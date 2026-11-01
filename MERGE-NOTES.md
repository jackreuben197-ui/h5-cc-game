# Merge notes — table fixes that must survive every upstream merge

Fixes 1–7 were made on `dev_merge_0923` (commit `9bfb46a fix: merge 0923`, plus the texture change),
fix 8 on `dev_merge_1031`. Several of them had already been lost once by a "take our side" merge, so please run the checklist
after every `dev_refactor_*` → `dev_merge_*` merge.

## Post-merge checklist (30 seconds)

```bash
# 1. card reset calls — must print 5 and 1
grep -c '_resetCardVisualState();' assets/script/views/scene/room/texas/SeatPlayer.ts
grep -c 'v.node.parent.active = false));' assets/script/views/scene/room/texas/SeatPlayer.ts

# 2. saveAreaTop must be read from the getter — must print 5
grep -rn 'ccviewData.saveAreaTop' assets/script --include='*.ts' | wc -l

# 3. these five handlers must NOT take saveAreaTop as a parameter again — must print nothing
grep -rn 'saveAreaTop: number' \
  assets/script/views/scene/room/texas/UIRoomTexas.ts \
  assets/script/views/scene/room/texas/SeatManager.ts \
  assets/script/views/scene/room/texas/MorePlayTypeInfo.ts \
  assets/script/views/dialog/report/UITexasReport.ts \
  assets/script/views/dialog/history/UITexasHistory.ts

# 4. prefab references and flags
node -e '
const fs=require("fs");
const P=(a,id)=>{const n=[];let x=a[id];while(x&&x.__type__==="cc.Node"){n.unshift(x._name);x=x._parent?a[x._parent.__id__]:null}return n.join("/")};
let a=JSON.parse(fs.readFileSync("assets/resources/rc/scene/room/texas/UIOtherBndings.prefab"));
const c=a.find(o=>o.__type__==="29b296yLQFE1rfLoOXl8iYE");
for (const k of ["viewPlayerCardsConfigNode","viewPublicCardsConfigNode"]) console.log(k,"->",P(a,c[k].__id__));
a=JSON.parse(fs.readFileSync("assets/resources/rc/scene/room/texas/UITexasHistory.prefab"));
a.forEach(o=>{ if(o.__type__==="cc.Sprite"&&o._spriteFrame&&o._spriteFrame.__uuid__.startsWith("6dc281df")) console.log("history bottom gradient enabled =",o._enabled);
               if(o.__type__==="cc.Widget"&&o.alignMode===2&&(o._right===100||o._right===-100)) console.log("history",P(a,o.node.__id__),"alignFlags =",o._alignFlags); });
'
# expected (order of the last three lines may vary):
#   viewPlayerCardsConfigNode -> UIOtherBndings/view/viewcards
#   viewPublicCardsConfigNode -> UIOtherBndings/view/viewpub
#   history UITexasHistory/layer/bg/ScrollView alignFlags = 37
#   history bottom gradient enabled = false
#   history UITexasHistory/layer/bg alignFlags = 37

# 5. interactive props and player info dialog — must print 1 1 1 1 2 5 10, one number per line
F=assets/script/views/dialog/playerinfo/UIPlayerInfo.ts
T=assets/script/views/util/ThrowPropManager.ts
S=assets/script/data/room/texas/TexasGameRoomDataSeatsStateManager.ts
grep -c 'hasPendingThrowProp || throwPropManager.isPropSenderBusy' $F
grep -c ': Def.ConsumeType.CT_NONE) as ClientMessageBroadcastMsg' $F
grep -c 'globalConfigStore.isChannelDiamondFreeMode && !!data && !userStore.isPropFree(data) && payPrice > 0' $F
grep -c 'cc.Tween.stopAllByTarget(node);' $F
grep -c 'PENDING_THROW_PROP_TIMEOUT_MS' $S
grep -c '_playingPropSenders' $T
grep -E -c '^\s+duration: (2\.6|2\.7|1\.7|1\.6|2\.3|3\.6|3|1\.9),' $T
```

---

## 1. `emit` drops the 6th argument → the whole top/bottom UI disappears

**Symptom.** Player switches to another app and comes back: the side menu, 战绩 / 牌谱 / 表情 row, IM
button, pot and table info are gone and never come back. Seats and avatars stay visible.
Reported from iOS Safari, reproduced deterministically.

**Root cause.** In Cocos Creator 2.4 the event bus takes **at most five** arguments:

```js
// engine: cocos2d/core/platform/callbacks-invoker.js
proto.emit = function (key, arg1, arg2, arg3, arg4, arg5) { ... }
```

`CCViewData.resizeEvent` emitted six: `(vw, vh, fw, fh, suggestScale, saveAreaTop)`. The sixth one was
silently dropped, so every `FRAME_SIZE_UPDATE` handler received `saveAreaTop === undefined`.
`UIRoomTexas.onFrameResize` then did `widget.top = undefined`, the widget layout produced `NaN` for the
`scaleUI` node height/position, and the whole subtree stopped rendering.

It worked on room entry only because the first call goes through `initParams` (the array is passed
directly), not through `emit`.

**Fix.** `CCViewData` exposes the value through a getter and the handlers read it from there:

```ts
// CCViewData.ts
public get saveAreaTop(): number { return this._realSaveTop; }
```

Call sites: `UIRoomTexas.ts`, `SeatManager.ts`, `MorePlayTypeInfo.ts`, `UITexasReport.ts`,
`UITexasHistory.ts`.

**Rule for new code.** Never pass more than five arguments to `emit()` or to a `@pureEvent` /
`@observable` method — TypeScript will not warn you, the value simply arrives as `undefined`.

**Why upstream does not see it.** `FRAME_SIZE_UPDATE` is only emitted from `ccviewData.initData()`
inside `ProcedureInit.updateFitMode()`, and only our fork re-runs `updateFitMode` on window resize
(`ProcedureInit.bindFitModeToBrowserResize`). On iOS the viewport height changes when the browser
returns from background, which is what triggered it.

## 2. Hole cards disappear after reconnect (regression of an upstream fix)

**Symptom.** After returning from background (or any reconnect) the player's own cards are gone,
opponents' card backs too, while the action buttons still show.

**History.** Upstream fixed this in `d13b960` (nine, 2026-07-27, 手牌错位): it removed the two
`this._bigCards.forEach(v => (v.node.parent.active = false))` lines from `onUpdatePosition` and added
`_resetCardVisualState()` in five places. Our merge `0328b69` (2026-08-05, "preserving local UI &
modifications") took our side of `SeatPlayer.ts` and threw that fix away.

**Chain.** reconnect → `SyncEnter` → `mine.clearData()` sets `seatNo = 0` → `setMySeat()` re-seats
everybody (`position` is `forceEmit`) → `onUpdatePosition` hides the cards → `setCards()` with the same
cards emits nothing (deep dirty check in `@observable`) → cards stay hidden.

**Keep.** `_resetCardVisualState()` in `initData`, `onDisable`, after the `switch` in `onUpdatePosition`,
at the start of `onUpdateCards`, and in the FOLD/Done branch for `mine` — five calls, and exactly one
`_bigCards.forEach(... active = false)` inside `onUpdateCards`.

## 3. Certification logo (bmm) missing from the bottom bar

`UIOtherBndings.prefab` had `viewPublicCardsConfigNode` bound to the `cert_banner` node and
`viewPlayerCardsConfigNode` bound into the other button's subtree. `OtherBindings` does
`viewPublicCardsConfigNode.active = enabled`, so the logo was switched off together with the paid
"view public cards" button — i.e. almost always.

Both fields must point at their own buttons: `view/viewcards` and `view/viewpub` (same as upstream).

## 4. Bottom bar was squeezed to the left

`_applyMainMenuLayout()` chose the compact spacing (`paddingLeft 51`, `spacingX 20`) whenever
`basicInfo.isInVideoRoom` was true — and that is true for any table with voice anti-cheat, not only
video tables. The result was three buttons crammed into the left third.

Now the compact spacing is used only when the right-hand trio is actually visible
(`OtherBindings.hasVisibleVideoButtons`), otherwise the wide one (`150` / `135`), which matches the
reference layout: items at 17% / 37% / 58% / 79.5% of the bar width. `OtherBindings` calls back into
`UIRoomTexas` through `onVideoButtonsVisibilityChanged` whenever that visibility changes, and moves the
logo accordingly (`x = 0` with the trio visible, `x = 366` without it).

## 5. Disabled 特效 / 语音 / 视频 buttons are hidden, not greyed

`_setVideoButtonVisible()` in `OtherBindings` deactivates the node on `ButtonState.DISABLE` and refreshes
the parent `cc.Layout`, instead of only graying it out.

## 6. 牌谱 panel: bottom gradient strip removed

The `bottombg.png` sprite on `UITexasHistory/layer/bg/New Sprite(Splash)` is disabled (`_enabled: false`).
The node itself and its children (Total Diamonds, slider, pager, Save, peek buttons) stay — they now sit
on the panel's own dark background.

Keep `alignFlags = 37` on `UITexasHistory/layer/bg` and `.../ScrollView`. Cocos Creator sometimes
re-saves them as `45`; that is not our change.

## 7. MTT countdown pill repainted

`assets/textures/dialog/bg/waitStart.png` (865×209) used to be a blue-lavender pill that clashed with the
table. It is repainted to neutral dark (fill ≈ 42, rim ≈ 104) with the alpha, shape and highlight
untouched, so no prefab or uuid changes. Used by `Tips/Image_WaitForStartTips`, shown by
`MttTableStateView` as the MTT countdown / break overlay.

Other tip bars (`Image_RedistributionTips`, `Image_WaitForStartBathTips`, `Image_ReserveSeatTips`,
`Image_SeeMorePublicTips`) use `Group 4871 (1).png` and were intentionally left as they are.

## 8. Player info dialog and interactive props

Commits on `dev_merge_1031`: `e638e6a`, `d3d3875`, `31a04d8`, `cc934f2`. All of it is TypeScript in the
three files from checklist step 5. `UIPlayerInfo.prefab` was not changed: the layout is applied at runtime,
so taking upstream's prefab is safe, while taking upstream's `UIPlayerInfo.ts` silently loses everything
below. On a conflict in these files, keep our logic and port upstream's change on top.

### 8.1 Unconfigured prop is sent with `consume = CT_NONE`

**Symptom.** The gun did nothing on tap and showed no error. Other props worked.

**Root cause.** The gun (`boxing_Button`, `PropsID.PROPSBOXING` = 608, `$propOp_3`) was missing from the CMS
list. The old fallback sent `consume = CT_EMOJI_2` (6). The server treats `consume` as a price id, and
price 6 is in a currency that does not match the table's `gold_type`, so it replied with
`code 99, status 90001 "route throom service error"`. Backend log: `chat price 6 currency does not match
access mode`.

**Keep.** In `UIPlayerInfo._clickProp`: free prop → `CT_NONE`, prop from the list → `propData.priceID`, prop
missing from the list → `CT_NONE`. Never `CT_EMOJI_2`. The old comment above that line still mentions
`CT_EMOJI_2` and is stale, so do not restore the code from it. A live test on bepvazti returned
`1019 status 0` and the animation played.

### 8.2 No fake price

Prices in the dialog come from `/api/misc/combine` (`api_list: [62]`, `get_chat_shop_prop_list_resp.list`,
`prop_type = 4`). A prop missing from that list used to show the default `0.10`; that default is removed
and `payPrice` falls back to `0`.

### 8.3 Prop price is hidden on the ordinary link

```ts
const showPrice = globalConfigStore.isChannelDiamondFreeMode && !!data && !userStore.isPropFree(data) && payPrice > 0;
```

Decision: hide the diamond price under the props in this dialog only. Do **not** hardcode
`isChannelDiamondFreeMode` to get this: the flag comes from H5 (`channel_package_diamond_free_mode`) or
`data-channel-package` and drives about 20 files, including bring-in wallets.

This is display only. Listed props still send their real `price_id`, so they can be charged on the
ordinary link with no price on screen. No price was changed in the CMS or on the server.

### 8.4 Rapid taps must not stack animations

**Symptom.** Twenty quick taps queued twenty throws, the animation kept running for a long time, and the
prop icon was bigger the next time the dialog opened.

- `_clickProp` returns early while `seatsStateManager.hasPendingThrowProp` or
  `throwPropManager.isPropSenderBusy(userStore.userRID)` is true.
- `hasPendingThrowProp` expires after `PENDING_THROW_PROP_TIMEOUT_MS` (5000), so a lost server reply does
  not block taps forever.
- `ThrowPropManager.playProp` keeps at most one waiting task per sender/target pair, which also limits
  throws from other players.
- `_playClickScale` calls `cc.Tween.stopAllByTarget(node)` and `node.setScale(1)` before the tween and
  animates to the absolute scale. The dialog is pooled, so concurrent relative tweens left the icon
  enlarged across openings.

### 8.5 Tap lock follows the real animation length

The lock is released by `task.duration`, so a too long value in `ThrowPropManager.CONFIGS` shows up as
"the animation finished, but the button is not clickable yet". Values are measured from the clips and
`.skel` files, in seconds:

| tomato | flower | kiss | good | cheers | touch | shark | chicken | boxing | baseball |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2.6 | 2.7 | 1.7 | 2.7 | 1.6 | 2.3 | 3.6 | 3 | 1.9 | 2.6 |

`fish` (6) and `money` (4) were left unchanged because they are hidden in the dialog. The shark node is
destroyed after 3.5 s (`_destroyAfterDelay`). If a clip is replaced, measure it again and update the table.

### 8.6 Dialog layout

Constants at the top of `UIPlayerInfo`: `PROP_CELL_WIDTH 170`, `PROP_CELL_HEIGHT 230`, `PROP_ICON_SCALE 1.2`,
`TAB_CONTENT_SCALE 0.75`, `CLOSE_HIT_SIZE 180`, `CLOSE_BTN_X 425`, `DIALOG_PADDING_TOP 60`.

`_applyTabContentLayout` shrinks the Data / All in / Gift block and enlarges the prop grid.
`_applyDiamondShowLayout` puts a horizontal `cc.Layout` on `$DiamondShow`, which fixes the overlapping
"Diamond balance" text. The `closeHitArea` child enlarges the X tap area.

### 8.7 Known gaps, not regressions

- `code 99` on a throw: the pending state is not cleared, so taps are blocked for 5 s and no toast is shown.
- A queued throw can still fly after a player leaves, and the queue is not reset on table change. At most
  one stray throw per pair.
- The gun has no sound: `_playBoxing` does not play a clip sound.
- Open with the backend: add `boxing_Button` to the CMS, and configure prices per `gold_type`.
- Not verified yet: the `cc934f2` durations on a deployed build, and the gun on the ordinary link and on
  other channel domains.

---

## How this class of bug was found

Headless Chrome with an iPhone user agent, driven over CDP against the deployed build: fake
`document.hidden` + `visibilitychange`/`pagehide`, close the WebSocket the way iOS does, wait past the
10 s force-reconnect threshold, then restore visibility and change the window height. After that, dump
node geometry (`active / opacity / scale / position / convertToWorldSpaceAR`) and texture state
(`cc.isValid`, `loaded`, `spriteFrame._original`). The `NaN` source was pinned down by overriding the
`cc.Widget.prototype.top` setter and logging `new Error().stack` whenever an `undefined` was assigned.
