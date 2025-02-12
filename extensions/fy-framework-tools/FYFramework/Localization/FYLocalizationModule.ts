import { _decorator } from 'cc';
import { FYModule } from "../Base/FYModule";
import { FYLocalizationHelperBase } from './FYLocalizationHelperBase';

const { ccclass } = _decorator;

/**
 * 本地化模块
 */
export class FYLocalizationModule extends FYModule {
    /**
     * 类名
     */
    public static clsName = "FYLocalizationModule";

    /**
     * 辅助器
     */
    private _helper: FYLocalizationHelperBase = undefined;

    public setHelper(helper: FYLocalizationHelperBase) {
        this._helper = helper;
    }

    /**
     * 获取多语言文本
     * @param key 关键字
     */
    public async get(key: string): Promise<string> {
        return await this._helper?.get(key);
    }
}