/**
 * 默认成就辅助器
 */

import { FYAchievementHelperBase } from "./FYAchievementHelperBase";

export class DefaultAchievementHelper extends FYAchievementHelperBase {
    /**
     * 激活成就
     * @param achievement 成就关键字
     */
    public async activate(achievement: string): Promise<boolean> {
        return false;
    }
    /**
     * 成就是否激活
     */
    public async isActivated(achievement: string): Promise<boolean> {
        return false;
    }
    /**
     * 清除成就
     * @param achievement 成就关键字
     */
    public async clear(achievement: string): Promise<boolean> {
        return false;
    }

}