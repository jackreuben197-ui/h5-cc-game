# pokerqueen

## 子模块更新 

git submodule update --init --recursive --remote

## 同步Hybrid代码

```shell
# h5 code sync(已经包含了国际化处理)
npm run sync:h5-game #pnpm run sync:h5-game
# protocol sync (pb)
npm run sync:proto
```

## 格式化代码

```shell
#可能缺失pretty，需要 npm install
npm run commit:format
```

## 检查代码

```shell
#可能缺失pretty，需要 npm install
npm run check:ts
```

## 日志使用

```typescript
// 全局设置
// assets/script/config/DevConfig.ts
public static LOG_LEVEL: LogLevel = 'warn';

// 类函数不传参数使用全局warn
@traceClass()
// 传参数本类使用此level
@traceClass({level: 'debug'})

//类里任何方法内使用
this.tracelog.(debug|info|warn|error)

//如果你还要把类的成员函数名一起打了,那就再函数上方加装饰器,也可以指定level,同理
@traceMethod()

//静态类使用(CLSSNAME使用指定的静态类)
{CLASSNAME}.tracelog.(debug|info|warn|error)

// 非类的全局函数，或者局部函数（类外）.[MainUtils] 就是前缀
const _ploger = createLogger('[MainUtils]');
// 方法内使用
_ploger.(debug|info|warn|error)
```

## 数据绑定
### 数据端
```typescript
// 数据端 必须是是父类cc.EventTarget类
// 属性事件
// 这个值变动后会传送给绑定端, instance.variable = propValue; 触发
// 如果要传多参数可以使用 IObservableBindings 进行多参数设置, 参看TexasGameRoomDataPlayer
// 然后就能使用 instance.setVariable(propValue, extArg1, extArg2...) 来触发事件
@observerable('事件名')
public variable: [number|string|boolean|Object|Array];

// 纯事件，这个事件函数被执行后，会把参数传给接收端的函数, initParams 是再保证第一次初始化的时候有参数执行
@pureEvent('纯事件')
public updateXXXX(arg1,arg2,arg3) { ... }

@pureEvent('BUTTON_CHANGE', {
    initParams() {
        return [0, this._buttonPosition, AnimateDisplayTypeButton.Static];
    }
})
public buttonChangeEvent(prev: number, cur: number, bat: AnimateDisplayTypeButton) {...}

//特殊方法,微操控制事件不发送, 要结合 IObservableBindings 参考 UserStore
@bindData()
this.muteEvents();
// 这中间的属性设置，或者setXXX方法都不会触发事件
this.unmuteEvents();
```

### 绑定端 
参考SeatPlayer

```typescript
// 和数据段进行绑定
// 统一激活绑定，注入强类型 tag 推导过滤机制
// 简单case 所有事件会初始化调用一次
autoBindEvents(this, { player: this._seatPlayer });

// 复杂case, 所有事件的初始化精细控制是否调用
autoBindEvents(this, { player: this._seatPlayer }, (evtName, tag, dataSource) => {
    if (tag === 'player') {
        if (evtName === 'WINNER' || evtName == 'HIGHLIGHT_CARDS') {
            return false;
        }
        if (dataSource.userID > 0) {
            if (evtName === 'EMPTY_SEAT') {
                return false;
            }
            return true;
        }
        if (evtName === 'EMPTY_SEAT' || evtName == 'SEAT_POSITION_CHANGE') {
            return true;
        }
        return false;
    }
    return true;
});

// 具体数据变动的事件绑定 （事件名, 数据来源(autobindevent函数里对应的第二个参数的map key)
// 函数的参数多少,取决于你事件传了多少, 这里是不知道是obserableEvent 还是pureEvent的。
// 简单case
@bindEvent('NICKNAME_CHANGE', 'player')
private onUpdateNickname(na: string) {
    this._enableDisableUser(true);
    // 自己不显示名字
    if (this._seatPlayer.mine) {
        this.nickName.node.active = false;
        this.nickNameSplash.active = false;
        return;
    }
    this.nickName.node.active = true;
    this.nickNameSplash.active = true;
    this.nickName.string = na;
}

// 复杂case, 要求这个函数再初始化的时候执行顺序的优先度，默认都是 0, 所以你 > 0 就是先执行, <0 就是最后执行
// onUpdateSeats 座位数调整, 这个优先度必须提前要创建座位的Node
@bindEvent('SEATS_CHANGE', {dataSource: 'seats', initPriority: 10})
private onUpdateSeats(count: number) {
}
```