export interface OnFYTimer {
    (isCountDownComplete: boolean, curTime: number): void
}

/** 计时器信息 */
export class FYTimerInfo {
    public key: string = "";
    /** 需要的时间 -1 永不停止 */
    public needTime: number = 0;
    /** 间隔时间 多久执行一次回调 -1:直到时间到 中间不执行回调 */
    public intervalTime: number = 0;
    /** 累计间隔施加 */
    public intervalTotalTime: number = 0;
    /** 当前时间 */
    public curTime: number = 0;
    /** 回调函数 */
    public cb: OnFYTimer = null;
    /** 上下文 */
    public content: any = null;
    /** 是否可以暂停 */
    public canPause: boolean = true;

    public constructor(key: string, needTime: number, intervalTime: number, cb: OnFYTimer, content: any, canPause: boolean) {
        this.key = key;
        this.needTime = needTime;
        this.intervalTime = intervalTime;
        this.cb = cb;
        this.curTime = 0;
        this.intervalTotalTime = 0;
        this.content = content;
        this.canPause = canPause;
    }
}