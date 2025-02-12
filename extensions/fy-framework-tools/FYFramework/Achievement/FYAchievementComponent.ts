
import { _decorator } from 'cc';
import { FYComponent } from '../Base/FYComponent';
import { FYEntry } from '../Base/FYEntry';
import { FYAchievementHelperBase } from './FYAchievementHelperBase';
import { FYAchievementModule } from './FYAchievementModule';
import { DefaultAchievementHelper } from './DefaultAchievementHelper';
const { ccclass, menu } = _decorator;

/**
 * 成就组件
 */

@ccclass('FYAchievementComponent')
@menu('FY/FYAchievementComponent')
export class FYAchievementComponent extends FYComponent {

    private _achievement: FYAchievementModule;
    /** 成就模块 */
    public get achievement(): FYAchievementModule {
        if (!this._achievement) {
            this._achievement = FYEntry.getModule(FYAchievementModule);
        }

        return this._achievement
    }

    onLoad() {
        super.onLoad();
        this.setHelper(new DefaultAchievementHelper());
    }

    public setHelper(helper: FYAchievementHelperBase) {
        this.achievement.setHelper(helper);
    }

    /**
     * 激活成就
     * @param achievement 成就关键字
     */
    public async activate(achievement: string): Promise<boolean> {
        return await this.achievement?.activate(achievement);
    }
    /**
     * 成就是否激活
     */
    public async isActivated(achievement: string): Promise<boolean> {
        return await this.achievement?.isActivated(achievement);
    }
    /**
     * 清除成就
     * @param achievement 成就关键字
     */
    public async clear(achievement: string): Promise<boolean> {
        return await this.achievement?.clear(achievement);
    }
}