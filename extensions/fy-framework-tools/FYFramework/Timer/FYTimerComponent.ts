import { _decorator } from "cc";
import { FYComponent } from "../Base/FYComponent";
import { FYEntry } from "../Base/FYEntry";
import { OnFYTimer } from "./FYTimerInfo";
import { FYTimerModule } from "./FYTimerModule";

const { ccclass, menu } = _decorator;

/**
 * 计时器组件
 */

@ccclass('FYTimerComponent')
@menu('FY/FYTimerComponent')
export class FYTimerComponent extends FYComponent {

    private _timer: FYTimerModule;
    /** 资源模块 */
    public get timer(): FYTimerModule {
        if (!this._timer) {
            this._timer = FYEntry.getModule(FYTimerModule);
        }

        return this._timer;
    }

    onLoad() {
        super.onLoad();
    }

    /**
     * 重置
     */
    public reset() {
        this.timer.reset();
    }

    /**
    * 添加计时器
    * @param key 关键字
    * @param needTime 需要时间 倒计时一共执行多久 -1: 一直执行
    * @param intervalTime 间隔时间 单位秒 多久执行一次回调 -1: 直到结束 中间都不执行回调
    * @param callback 回调函数
    * @param content 上下文
    * @param canPause 是否可以暂停
    */
    public add(key: string, needTime: number, intervalTime: number, callback: OnFYTimer, content: any, canPause: boolean = true) {
        this.timer.add(key, needTime, intervalTime, callback, content, canPause);
    }


    /**
     * 移除计时器
     * @param key 关键字
     */
    public remove(key: string) {
        this.timer.remove(key);
    }

    /**
     * 添加计时器
     * @param needTime 需要时间 计时器一共执行多久 -1: 一直执行
     * @param intervalTime 间隔时间 单位秒 多久执行一次回调 -1: 直到结束 中间都不执行回调
     * @param callback 回调函数
     * @param content 上下文
     * @param canPause 是否可以暂停
     */
    public on(needTime: number, intervalTime: number, callback: OnFYTimer, content: any, canPause: boolean = true) {
        this.timer.on(needTime, intervalTime, callback, content, canPause);
    }

    /**
     * 移除计时器
     * @param callback 回调函数
     */
    public off(callback: OnFYTimer) {
        this.timer.off(callback);
    }

    /**
     * 添加计时器
     * @param key 关键字
     * @param needTime 需要时间 计时器一共执行多久 -1: 一直执行
     * @param intervalTime 间隔时间 单位秒 多久执行一次回调 -1: 直到结束 中间都不执行回调
     * @param callback 回调函数
     * @param content 上下文
     * @param canPause 是否可以暂停
     */
    public onKey(key: string, needTime: number, intervalTime: number, callback: OnFYTimer, content: any, canPause: boolean = true) {
        this.timer.onKey(key, needTime, intervalTime, callback, content, canPause);
    }

    /**
     * 移除计时器
     * @param key 关键字
     * @returns 
     */
    public offKey(key: string) {
        this.timer.offKey(key);
    }

    /**
     * 获取剩余时间
     * @param key 关键字
     */
    public getRemainTime(key: string) {
        return this.timer.getRemainTime(key);
    }

    /**
     * 获取当前时间
     * @param key 关键字
     * @returns 
     */
    public getCurTime(key: string) {
        return this.timer.getCurTime(key);
    }

    /**
     * 暂停
     */
    public pause() {
        this.timer.pause();
    }

    /**
     * 恢复
     */
    public resume() {
        this.timer.resume();
    }

    update(dt) {
        if (this.timer.getType() === 0) {
            this.timer.update(dt);
        }
    }
}