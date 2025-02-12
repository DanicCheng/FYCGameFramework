/**
 *成就辅助器基类
 */

export abstract class FYAchievementHelperBase {
    /**
     * 激活成就
     * @param achievement 成就关键字
     */
    public abstract activate(achievement: string): Promise<boolean>
    /**
     * 成就是否激活
     */
    public abstract isActivated(achievement: string): Promise<boolean>
    /**
     * 清除成就
     * @param achievement 成就关键字
     */
    public abstract clear(achievement: string): Promise<boolean>

}