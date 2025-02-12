
import { _decorator, Component, Node, resources, JsonAsset, Asset, TextAsset, BufferAsset, Prefab } from 'cc';
import { FYEntry } from '../Base/FYEntry';
import { FYModule } from '../Base/FYModule';
import { FYEnum } from '../Define/FYEnum';
import { FYEventModule } from '../Event/FYEventModule';
import { Pako } from '../Lib/pako/Pako';
import FYLog from '../Log/FYLog';
import { FYTimerModule } from '../Timer/FYTimerModule';
const { ccclass } = _decorator;

/**
 * 资源模块
 */

export class FYResourceModule extends FYModule {
    /**
     * 类名
     */
    public static clsName = "FYResourceModule";
    /** 定时器模块 */
    private _timer: FYTimerModule = FYEntry.getModule(FYTimerModule);
    /** 事件模块 */
    private _event: FYEventModule = FYEntry.getModule(FYEventModule);
    /** 释放缓存时间 */
    private _timeToReleaseCache: number = 60;
    /** 资源路径配置 */
    private _config: { [key: string]: string };
    /** 资源缓存字典 */
    private _dictResCache: { [key: string]: object } = {};

    /**
     * 根据资源名获取资源路径
     * @param resourceName 资源名
     * @returns 
     */
    public async getResourcePath(resourceName: string): Promise<string> {
        if (!this._config) {
            let buffer = (await this.loadPath<BufferAsset>('CFG_ResPath')).buffer();
            if (!buffer) {
                FYLog.error(`Load CFG_ResPath error`);
                return '';
            }

            let compress = Pako.inflate(buffer, { to: 'string' });
            if (!compress) {
                FYLog.error('pako.inflate error');
                return '';
            }

            this._config = JSON.parse(compress);
        }
        // 使用之前，请先成编辑器工具生成CFG_ResPath.bin文件
        if (!this._config[resourceName]) {
            FYLog.error(`Can not find the resource ${resourceName}`);
            return '';
        }

        return this._config[resourceName];
    }

    /**
     * 根据路径加载资源
     * @param path 资源路径
     * @returns 
     */
    public async loadPath<T extends Asset>(path: string): Promise<T> {
        return new Promise((resolve, reject) => {
            resources.load<T>(path, (error: Error, resource: T) => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve(resource);
                return;
            });
        });
    }

    /**
     * 根据资源名加载资源
     * @param name 资源名
     * @param cacheType 是否需要缓存，资源缓存类型
     * @param extendPath 扩展路径，有些资源里面还有子资源，例如图片里面有spriteFrame和texture
     * @returns 
     */
    public async load<T extends Asset>(name: string, cacheType: FYEnum.ResourceCacheType = FYEnum.ResourceCacheType.None, extendPath?: string): Promise<T> {
        let resourcePath = await this.getResourcePath(name);
        if (extendPath) {
            resourcePath += `/${extendPath}`;
        }
        if (resourcePath === '') {
            return Promise.reject('Resource path is empty');
        }

        if (this._dictResCache[name]) {
            return new Promise((resolve, reject) => {
                // 重置倒计时
                this._timer.remove(name);
                this._timer.add(name, this._timeToReleaseCache, 1, (isCountDownComplete: boolean, curTime: number) => {
                    this.onTimer(name, isCountDownComplete, curTime);
                });
                resolve(this._dictResCache[name] as T);
            });
        } else {
            return new Promise((resolve, reject) => {
                resources.load<T>(resourcePath, (error: Error, resource: T) => {
                    if (error) {
                        reject(error);
                        return;
                    }

                    if (cacheType === FYEnum.ResourceCacheType.AutoRelease) {
                        this._dictResCache[name] = resource;
                        this._timer.add(name, this._timeToReleaseCache, 1, (isCountDownComplete: boolean, curTime: number) => {
                            this.onTimer(name, isCountDownComplete, curTime);
                        });
                    } else if (cacheType === FYEnum.ResourceCacheType.ManualRelease) {
                        this._dictResCache[name] = resource;
                    }

                    resolve(resource);
                    return;
                });
            });
        }
    }

    /**
     * 预加载资源
     * @param nameList 预加载资源名列表
     */
    public async preload(nameList: Array<string>) {
        let sum = nameList.length;
        let count = 0;
        nameList.forEach(async name => {
            await this.load(name, FYEnum.ResourceCacheType.ManualRelease);
            count++;
            this._event.emit(FYEnum.ResourceEvent.PreLoadRes, name, count, sum);
        });
    }

    /**
     * 释放资源
     * @param name 资源名
     * @param extendPath 扩展路径，有些资源里面还有子资源，例如图片里面有spriteFrame和texture
     * @returns 
     */
    public async release<T extends Asset>(name: string, extendPath?: string) {
        let resourcePath = await this.getResourcePath(name);
        if (extendPath) {
            resourcePath += `/${extendPath}`;
        }
        if (resourcePath === '') {
            return Promise.reject('Resource path is empty');
        }
        this._timer.remove(name);
        delete this._dictResCache[name];

        resources.release(resourcePath);
    }

    private onTimer(name: string, isCountDownComplete: boolean, curTime: number) {
        if (isCountDownComplete) {
            delete this._dictResCache[name];
        }
    }
}