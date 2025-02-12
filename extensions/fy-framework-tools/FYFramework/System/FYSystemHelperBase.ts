/**
 * 系统辅助器基类
 */

export abstract class FYSystemHelperBase {
    /**
     * 初始化
     */
    public abstract init(): void;
    /**
     * 设置窗口大小
     * @param width 宽度
     * @param height 高度
     */
    public abstract setResolution(width: number, height: number): void;
    /**
     * 设置全屏
     * @param fullScreen 是否全屏
     */
    public abstract setFullScreen(fullScreen: boolean): void;
    /**
     * 退出游戏
     */
    public abstract quit(): void;
}