import { FYTimerInfo, OnFYTimer } from "./FYTimerInfo";
import FYLog from "../Log/FYLog";

/**
 * 定时器模块
 */
export class FYTimerModule {
    /**
     * 类名
     */
    public static readonly clsName = "FYTimerModule";

    /** 是否开始计时 */
    private _isRunning = false;
    /** 是否暂停 */
    private _isPaused = false;
    /** 定时器编号 */
    private _timerIdCounter = 0;
    /** 定时器类型 0:update 1:setInterval */
    private _type = 0;

    // 使用Map来存储普通定时器
    private _timers: Map<string, FYTimerInfo> = new Map();
    // 使用Map来存储多回调定时器
    private _multiTimers: Map<string, FYTimerInfo[]> = new Map();

    constructor() {
        if (this._type === 1) {
            const interval = 1000;
            window.setInterval(() => {
                this.update(interval / 1000);
            }, interval);
        }
    }

    /**
     * 重置
     */
    public reset(): void {
        this._isRunning = false;
        this._isPaused = false;
        this._timerIdCounter = 0;
        this._timers.clear();
        this._multiTimers.clear();
    }

    /**
     * 添加定时器
     * @param key 关键字
     * @param duration 持续时间 -1表示永久
     * @param interval 间隔时间 -1表示不触发间隔回调
     * @param callback 回调函数
     * @param context 上下文
     * @param canPause 是否可暂停
     */
    public add(
        key: string, 
        duration: number, 
        interval: number, 
        callback: OnFYTimer, 
        context: any, 
        canPause = true
    ): void {
        if (this._timers.has(key)) {
            FYLog.warn(`Timer with key ${key} already exists`);
            return;
        }

        const timer = new FYTimerInfo(key, duration, interval, callback, context, canPause);
        this._timers.set(key, timer);
        this._isRunning = true;
    }

    /**
     * 移除定时器
     */
    public remove(key: string): void {
        this._timers.delete(key);
        this.checkAndUpdateRunningState();
    }

    /**
     * 添加一次性定时器
     */
    public on(
        duration: number, 
        interval: number, 
        callback: OnFYTimer, 
        context: any, 
        canPause = true
    ): string {
        const id = (++this._timerIdCounter).toString();
        const timer = new FYTimerInfo(id, duration, interval, callback, context, canPause);
        this._timers.set(id, timer);
        (callback as any)._id = id;
        this._isRunning = true;
        return id;
    }

    /**
     * 移除一次性定时器
     */
    public off(callback: OnFYTimer): void {
        const id = (callback as any)._id;
        if (!id || !this._timers.has(id)) {
            FYLog.warn('Timer callback not found');
            return;
        }
        this._timers.delete(id);
        this.checkAndUpdateRunningState();
    }

    /**
     * 获取剩余时间
     */
    public getRemainTime(key: string): number | undefined {
        const timer = this._timers.get(key);
        if (timer) {
            return timer.needTime - timer.curTime;
        }
    }

    /**
     * 获取当前时间
     */
    public getCurTime(key: string): number | undefined {
        return this._timers.get(key)?.curTime;
    }

    /**
     * 获取定时器类型
     */
    public getType(): number {
        return this._type;
    }

    /**
     * 暂停
     */
    public pause(): void {
        this._isPaused = true;
    }

    /**
     * 恢复
     */
    public resume(): void {
        this._isPaused = false;
    }

    /**
     * 更新定时器
     */
    public update(dt: number): void {
        if (!this._isRunning) return;

        // 更新普通定时器
        this._timers.forEach((timer, key) => {
            this.updateTimer(timer, dt, key);
        });

        // 更新多回调定时器
        this._multiTimers.forEach((timers, key) => {
            this.updateMultiTimers(timers, dt, key);
        });
    }

    private updateTimer(timer: FYTimerInfo, dt: number, key: string): void {
        if (timer.canPause && this._isPaused) return;

        timer.curTime += dt;
        
        // 更新间隔计时
        if (timer.intervalTime !== -1) {
            timer.intervalTotalTime += dt;
            if (timer.intervalTotalTime >= timer.intervalTime) {
                this.executeCallback(timer, false);
                timer.intervalTotalTime = 0;
            }
        }

        // 检查是否完成
        if (timer.needTime !== -1 && timer.curTime >= timer.needTime) {
            this.executeCallback(timer, true);
            this._timers.delete(key);
            this.checkAndUpdateRunningState();
        }
    }

    private updateMultiTimers(timers: FYTimerInfo[], dt: number, key: string): void {
        let completedIndices: number[] = [];

        timers.forEach((timer, index) => {
            if (timer.canPause && this._isPaused) return;

            timer.curTime += dt;
            
            // 更新间隔计时
            if (timer.intervalTime !== -1) {
                timer.intervalTotalTime += dt;
                if (timer.intervalTotalTime >= timer.intervalTime) {
                    this.executeCallback(timer, false);
                    timer.intervalTotalTime = 0;
                }
            }

            // 检查是否完成
            if (timer.needTime !== -1 && timer.curTime >= timer.needTime) {
                this.executeCallback(timer, true);
                completedIndices.unshift(index); // 从后往前删除
            }
        });

        // 移除已完成的定时器
        completedIndices.forEach(index => {
            timers.splice(index, 1);
        });

        // 如果该key下的所有定时器都完成了，删除这个key
        if (timers.length === 0) {
            this._multiTimers.delete(key);
            this.checkAndUpdateRunningState();
        }
    }

    private executeCallback(timer: FYTimerInfo, isComplete: boolean): void {
        try {
            timer.cb?.call(timer.content, isComplete, timer.curTime);
        } catch (error) {
            FYLog.error('Timer callback error:', error);
        }
    }

    private checkAndUpdateRunningState(): void {
        if (this._timers.size === 0 && this._multiTimers.size === 0) {
            this._isRunning = false;
        }
    }

    /**
     * 添加多回调定时器
     * @param key 关键字
     * @param duration 持续时间 -1表示永久
     * @param interval 间隔时间 -1表示不触发间隔回调
     * @param callback 回调函数
     * @param context 上下文
     * @param canPause 是否可暂停
     */
    public onKey(
        key: string,
        duration: number,
        interval: number,
        callback: OnFYTimer,
        context: any,
        canPause = true
    ): void {
        if (!this._multiTimers.has(key)) {
            this._multiTimers.set(key, []);
        }

        const timer = new FYTimerInfo(key, duration, interval, callback, context, canPause);
        this._multiTimers.get(key)!.push(timer);
        this._isRunning = true;
    }

    /**
     * 移除多回调定时器
     * @param key 关键字
     */
    public offKey(key: string): void {
        if (!this._multiTimers.has(key)) {
            return;
        }
        this._multiTimers.delete(key);
        this.checkAndUpdateRunningState();
    }
}