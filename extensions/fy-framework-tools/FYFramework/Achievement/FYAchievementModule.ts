
import { _decorator } from 'cc';
import { FYModule } from '../Base/FYModule';
import { FYAchievementHelperBase } from './FYAchievementHelperBase';
const { ccclass } = _decorator;

/**
 * 成就模块
 */

export class FYAchievementModule extends FYModule {
    /**
     * 类名
     */
    public static clsName = "FYAchievementModule";

    /**
     * 辅助器
     */
    private _helper: FYAchievementHelperBase = undefined;

    public setHelper(helper: FYAchievementHelperBase) {
        this._helper = helper;
    }

    /**
     * 激活成就
     * @param achievement 成就关键字
     */
    public async activate(achievement: string): Promise<boolean> {
        return await this._helper?.activate(achievement);
    }
    /**
     * 成就是否激活
     */
    public async isActivated(achievement: string): Promise<boolean> {
        return await this._helper?.isActivated(achievement);
    }
    /**
     * 清除成就
     * @param achievement 成就关键字
     */
    public async clear(achievement: string): Promise<boolean> {
        return await this._helper?.clear(achievement);
    }
}