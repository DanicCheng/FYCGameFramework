
import { _decorator, Asset, Script } from 'cc';
import { FYComponent } from '../Base/FYComponent';
import { FYEntry } from '../Base/FYEntry';
import { FYSystemModule } from './FYSystemModule';
import { DefaultSystemHelper } from './DefaultSystemHelper';
import { FYSystemHelperBase } from './FYSystemHelperBase';
const { ccclass, menu } = _decorator;

/**
 * 广告组件
 */

@ccclass('FYSystemComponent')
@menu('FY/FYSystemComponent')
export class FYSystemComponent extends FYComponent {

    private _share: FYSystemModule;
    /** 分享模块 */
    public get share(): FYSystemModule {
        if (!this._share) {
            this._share = FYEntry.getModule(FYSystemModule);
        }

        return this._share
    }

    onLoad() {
        super.onLoad();
        this.setHelper(new DefaultSystemHelper());
    }

    public setHelper(helper: FYSystemHelperBase) {
        this.share?.setHelper(helper);
        this.share?.init();
    }

    public init() {
        this.share?.init();
    }

    /**
     * 设置窗口大小
     * @param width 宽度
     * @param height 高度
     */
    public setResolution(width: number, height: number): void {
        this.share?.setResolution(width, height);
    }
    /**
     * 设置全屏
     * @param fullScreen 是否全屏
     */
    public setFullScreen(fullScreen: boolean): void {
        this.share?.setFullScreen(fullScreen);
    }
    /**
     * 退出游戏
     */
    public quit() {
        this.share?.quit();
    }
}