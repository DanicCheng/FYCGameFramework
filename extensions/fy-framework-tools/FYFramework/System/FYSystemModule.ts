
import { _decorator } from 'cc';
import { FYModule } from '../Base/FYModule';
import { FYSystemHelperBase } from './FYSystemHelperBase';
const { ccclass } = _decorator;

/**
 * 分享模块
 */

export class FYSystemModule extends FYModule {
    /**
     * 类名
     */
    public static clsName = "FYSystemModule";

    /**
     * 辅助器
     */
    private _helper: FYSystemHelperBase = undefined;

    public setHelper(helper: FYSystemHelperBase) {
        this._helper = helper;
    }

    public init() {
        this._helper?.init();
    }

    /**
     * 设置窗口大小
     * @param width 宽度
     * @param height 高度
     */
    public setResolution(width: number, height: number): void {
        this._helper?.setResolution(width, height);
    }
    /**
     * 设置全屏
     * @param fullScreen 是否全屏
     */
    public setFullScreen(fullScreen: boolean): void {
        this._helper?.setFullScreen(fullScreen);
    }
    /**
     * 退出游戏
     */
    public quit() {
        this._helper?.quit();
    }
}