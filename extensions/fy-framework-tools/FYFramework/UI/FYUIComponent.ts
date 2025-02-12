
import { _decorator, Node } from 'cc';
import { FYComponent } from '../Base/FYComponent';
import { FYEntry } from '../Base/FYEntry';
import { FYUIModule } from './FYUIModule';
import { FYUIControllerBase } from './FYUIControllerBase';
import { FYEnum } from '../Define/FYEnum';
const { ccclass, menu } = _decorator;

/**
 * UI组件
 */

@ccclass('FYUIComponent')
@menu('FY/FYUIComponent')
export class FYUIComponent extends FYComponent {
    private _ui: FYUIModule;
    /** UI模块 */
    private get ui(): FYUIModule {
        if (!this._ui) {
            this._ui = FYEntry.getModule(FYUIModule);
        }

        return this._ui
    }

    onLoad() {
        super.onLoad();
    }

    /**
     * 打开UI
     * @param Ctor UI的类
     * @param parent 父对象
     * @param cacheType 是否需要缓存，资源缓存类型
     * @returns 
     */
    public async open<T extends FYUIControllerBase>(Ctor: new () => T, parent?: Node, cacheType: FYEnum.ResourceCacheType = FYEnum.ResourceCacheType.None): Promise<T> {
        return this.ui.open<T>(Ctor, parent, cacheType);
    }

    /**
     * 打开UI
     * @param clsName 类名
     * @param parent 父对象
     * @param cacheType 是否需要缓存，资源缓存类型
     * @returns 
     */
    public async openByName<T extends FYUIControllerBase>(clsName: string, parent?: Node, cacheType: FYEnum.ResourceCacheType = FYEnum.ResourceCacheType.None): Promise<T> {
        return this.ui.openByName(clsName, parent, cacheType);
    }

    /**
     * 关闭UI
     * @param Ctor UI的类
     * @returns 
     */
    public async close<T extends FYUIControllerBase>(Ctor: new () => T): Promise<void> {
        return this.ui.close<T>(Ctor);
    }

    /**
     * 根据类对象关闭UI
     * @param clsInstance 类对象
     * @returns 
     */
    public async closeByInstance(clsInstance: FYUIControllerBase): Promise<void> {
        this.ui.closeByInstance(clsInstance);
    }

    /**
     * 根据类名关闭UI
     * @param clsName 类名
     * @returns 
     */
    public async closeByName(clsName: string): Promise<void> {
        this.ui.closeByName(clsName);
    }

    /**
     * 关闭所有UI
     */
    public closeAll() {
        this.ui.closeAll();
    }

    /**
     * 获取在指定节点下的UI数量
     * @param parent 父对象
     * @returns 
     */
    public getUICountInNode(parent: Node) {
        return this.ui.getUICountInNode(parent);
    }
}