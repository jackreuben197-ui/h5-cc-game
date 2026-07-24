export enum MenuItemType {
    Button = 'button',
    Logo = 'logo'
}

export enum MenuItemLayoutType {
    ThreeButtons = 3,
    FourButtons = 4,
    SixButtons = 6
}

export interface MenuItemPosition {
    index: number;
    type: MenuItemType;
    position: cc.Vec2;
    scale: number;
    width: number;
    height: number;
    realWidth: number;
    realHeight: number;
}

export interface MenuItemLayout {
    layoutType: MenuItemLayoutType;
    buttons: MenuItemPosition[];
    logo: MenuItemPosition;
    all: MenuItemPosition[];
    width: number;
    height: number;
    gap: number;
}

export class MenuItemCaculator {
    public static readonly DESIGN_WIDTH = 1242;
    public static readonly DESIGN_HEIGHT = 200;
    public static readonly BUTTON_WIDTH = 120;
    public static readonly BUTTON_HEIGHT = 180;
    public static readonly LOGO_WIDTH = 200;
    public static readonly LOGO_HEIGHT = 110;
    private static readonly SHORT_LAYOUT_SIDE_PADDING = 120;
    private static readonly FULL_LAYOUT_SIDE_PADDING = 80;

    public caculate(actualWidth: number, actualScale: number, layoutType: MenuItemLayoutType): MenuItemLayout {
        const scale = this._getScale(actualScale);
        const width = this._getLayoutWidth(actualWidth);
        const type = this._getLayoutType(layoutType);
        const buttonItems = this._createButtonItems(type, scale);
        const logo = this._createItem(0, MenuItemType.Logo, MenuItemCaculator.LOGO_WIDTH, MenuItemCaculator.LOGO_HEIGHT, scale);
        const allItems = this._getAllItems(type, buttonItems, logo);
        const gap = this._applyLayout(width, type, allItems, scale);
        return {
            layoutType: type,
            buttons: buttonItems,
            logo: logo,
            all: allItems,
            width: width,
            height: MenuItemCaculator.DESIGN_HEIGHT,
            gap: gap
        };
    }

    private _createButtonItems(layoutType: MenuItemLayoutType, scale: number): MenuItemPosition[] {
        const buttonCount = layoutType;
        const buttons: MenuItemPosition[] = [];
        for (let i = 0; i < buttonCount; i++) {
            buttons.push(this._createItem(i, MenuItemType.Button, MenuItemCaculator.BUTTON_WIDTH, MenuItemCaculator.BUTTON_HEIGHT, scale));
        }
        return buttons;
    }

    private _createItem(index: number, type: MenuItemType, width: number, height: number, scale: number): MenuItemPosition {
        return {
            index: index,
            type: type,
            position: cc.v2(0, 0),
            scale: scale,
            width: width,
            height: height,
            realWidth: width * scale,
            realHeight: height * scale
        };
    }

    private _getAllItems(layoutType: MenuItemLayoutType, buttons: MenuItemPosition[], logo: MenuItemPosition): MenuItemPosition[] {
        if (layoutType === MenuItemLayoutType.SixButtons) {
            const half = buttons.length / 2;
            return buttons.slice(0, half).concat([logo], buttons.slice(half));
        }
        return buttons.concat([logo]);
    }

    private _applyLayout(width: number, layoutType: MenuItemLayoutType, items: MenuItemPosition[], scale: number): number {
        const sidePadding = this._getSidePadding(width, layoutType, scale);
        return this._applyItemsInRange(-width / 2 + sidePadding, width / 2 - sidePadding, items);
    }

    private _applyItemsInRange(left: number, right: number, items: MenuItemPosition[]): number {
        if (items.length <= 0) return 0;
        if (items.length === 1) {
            items[0].position = cc.v2((left + right) / 2, 0);
            return 0;
        }
        const width = right - left;
        const totalWidth = this._getTotalRealWidth(items);
        let gap = 0;
        let cursor = left;
        gap = (width - totalWidth) / (items.length - 1);
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            item.position = cc.v2(cursor + item.realWidth / 2, 0);
            cursor += item.realWidth + gap;
        }
        return gap;
    }

    private _getTotalRealWidth(items: MenuItemPosition[]): number {
        return items.reduce((total, item) => total + item.realWidth, 0);
    }

    private _getLayoutWidth(actualWidth: number): number {
        if (!isFinite(actualWidth) || actualWidth <= 0) return MenuItemCaculator.DESIGN_WIDTH;
        return Math.min(MenuItemCaculator.DESIGN_WIDTH, actualWidth);
    }

    private _getScale(actualScale: number): number {
        if (!isFinite(actualScale) || actualScale <= 0) return 1;
        return actualScale;
    }

    private _getSidePadding(width: number, layoutType: MenuItemLayoutType, scale: number): number {
        const padding = layoutType === MenuItemLayoutType.SixButtons ? MenuItemCaculator.FULL_LAYOUT_SIDE_PADDING : MenuItemCaculator.SHORT_LAYOUT_SIDE_PADDING;
        const maxRate = layoutType === MenuItemLayoutType.SixButtons ? 0.08 : 0.16;
        return Math.min(padding * scale, width * maxRate);
    }

    private _getLayoutType(layoutType: MenuItemLayoutType): MenuItemLayoutType {
        switch (layoutType) {
            case MenuItemLayoutType.ThreeButtons:
            case MenuItemLayoutType.FourButtons:
            case MenuItemLayoutType.SixButtons:
                return layoutType;
            default:
                return MenuItemLayoutType.ThreeButtons;
        }
    }
}

const menuItemCaculator = new MenuItemCaculator();

export default menuItemCaculator;
