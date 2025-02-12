
import { _decorator } from 'cc';
import { FYModule } from '../Base/FYModule';
import { FYStorageHelperBase } from './FYStorageHelperBase';
const { ccclass } = _decorator;

/**
 * 存储模块
 */

export class FYStorageModule extends FYModule {
    /**
     * 类名
     */
    public static clsName = "FYStorageModule";

    /**
     * 辅助器
     */
    private _helper: FYStorageHelperBase = undefined;

    public setHelper(helper: FYStorageHelperBase) {
        this._helper = helper;
    }

    /**
     * 数据数量
     */
    public get count(): number {
        return this._helper?.count;
    }

    /**
     * 加载
     */
    public load(): boolean {
        return this._helper?.load();
    }
    /**
     * 保存
     */
    public save(): boolean {
        return this._helper?.save();
    }
    /**
     * 设置数值
     * @param key 关键字
     * @param value 数据
     */
    public setNumber(key: string, value: number) {
        this._helper?.setNumber(key, value);
    }
    /**
     * 获取数值
     * @param key 关键字
     * @param defaultValue 默认值
     */
    public getNumber(key: string, defaultValue?: number): number {
        return this._helper?.getNumber(key, defaultValue);
    }
    /**
     * 设置字符串
     * @param key 关键字
     * @param value 数据
     */
    public setString(key: string, value: string) {
        this._helper?.setString(key, value);
    }
    /**
     * 获取字符串
     * @param key 关键字
     * @param defaultValue 默认值
     */
    public getString(key: string, defaultValue?: string): string {
        return this._helper?.getString(key, defaultValue);
    }
    /**
     * 获取对象
     * @param key 关键字
     */
    public setObject(key: string, value: Object) {
        this._helper?.setObject(key, value);
    }
    /**
     * 获取对象
     * @param key 关键字
     * @param defaultValue 默认值
     */
    public getObject(key: string, defaultValue?: Object): Object {
        return this._helper?.getObject(key, defaultValue);
    }
    /**
     * 移除
     * @param key 关键字
     */
    public remove(key: string) {
        this._helper?.remove(key);
    }
    /**
     * 清空
     */
    public clear() {
        this._helper?.clear();
    }

}