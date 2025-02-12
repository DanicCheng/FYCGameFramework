import { _decorator, CCInteger, Component, EventTouch, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ButtonEvent')
export class ButtonEvent extends Component {
    @property({
        type: CCInteger,
        displayName: '长按时间阈值（毫秒）',
        tooltip: '长按时间阈值（毫秒）'
    })
    longPressThreshold: number = 1000;

    @property({
        type: CCInteger,
        displayName: '双击时间阈值（毫秒）',
        tooltip: '双击时间阈值（毫秒）'
    })
    doubleClickThreshold: number = 300;

    /** 上一次点击的时间 */
    private _lastClickTime: number = 0;
    /** 长按定时器 */
    private _longPressTimer: number | null = null;
    /** 是否触发了长按 */
    private _isLongPressed: boolean = false;

    /** 长按回调 */
    private _longPressCallback: Function | null = null;
    /** 双击回调 */
    private _doubleClickCallback: Function | null = null;
    /** 点击回调 */
    private _clickCallback: Function | null = null;

    /**
     * 设置长按回调
     * @param cb 
     */
    setLongPressCallback(cb: Function) {
        this._longPressCallback = cb;
    }

    /**
     * 设置双击回调
     * @param cb 
     */
    setDoubleClickCallback(cb: Function) {
        this._doubleClickCallback = cb;
    }

    /**
     * 设置点击回调
     * @param cb 
     */
    setClickCallback(cb: Function) {
        this._clickCallback = cb;
    }

    onEnable(): void {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    onDisable(): void {
        this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    onTouchStart(event: EventTouch) {
        this._isLongPressed = false;

        // 设置长按定时器
        this._longPressTimer = setTimeout(() => {
            this._isLongPressed = true;
            this.onLongPress();
        }, this.longPressThreshold);
    }

    onTouchEnd(event: EventTouch) {
        // 清理长按定时器
        if (this._longPressTimer) {
            clearTimeout(this._longPressTimer);
            this._longPressTimer = null;
        }

        if (this._isLongPressed) {
            // 如果已经触发了长按，不处理单击和双击
            return;
        }

        const currentTime = Date.now();
        const timeDiff = currentTime - this._lastClickTime;

        if (timeDiff < this.doubleClickThreshold) {
            this.onDoubleClick();
            this._lastClickTime = 0; // 重置点击时间，防止重复双击
        } else {
            this.onClick();
            this._lastClickTime = currentTime;
        }
    }

    onTouchCancel(event: EventTouch) {
        // 清理长按定时器
        if (this._longPressTimer) {
            clearTimeout(this._longPressTimer);
            this._longPressTimer = null;
        }
    }

    onLongPress() {
        if (this._longPressCallback) {
            this._longPressCallback();
        }
    }

    onDoubleClick() {
        if (this._doubleClickCallback) {
            this._doubleClickCallback();
        }
    }

    onClick() {
        if (this._clickCallback) {
            this._clickCallback();
        }
    }
}


