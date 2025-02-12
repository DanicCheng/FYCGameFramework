import { sys } from "cc";
import FYUtility from "./FYUtility";
/**
 * 环境工具类
 */
export class EnvUtil {
    private static instance: EnvUtil | null = null;
    public static getInstance(): EnvUtil {
        if (this.instance === null) {
            this.instance = new EnvUtil();
        }
        return this.instance;
    }

    public static reset() {
        if (this.instance) {
            this.instance = null;
        }
    }

    private _electron = null;

    private _steam = null;

    /**
     * 获取Electron环境
     */
    public getElectronEnv(): any {
        if (sys.platform == sys.Platform.IOS || sys.platform === sys.Platform.ANDROID) {
            return null;
        }
        if (FYUtility.isValid(this._electron)) {
            return this._electron;
        }

        let electron: any;
        if (typeof window !== 'undefined' && window.require) {
            try {
                electron = require('electron');
            } catch (error) {

            }

        }

        this._electron = electron;
        return this._electron;
    }
    /**
     * 是否是Electron环境
     */
    public isElectronEnv(): boolean {
        return FYUtility.isValid(this.getElectronEnv());
    }

    /**
     * 获取Steam环境
     * @returns 
     */
    public getSteamEnv(): any {
        if (!this.isElectronEnv()) {
            return null;
        }

        if (FYUtility.isValid(this._steam)) {
            return this._steam;
        }

        let steam: any;
        if (typeof window !== 'undefined' && window.require) {
            try {
                steam = require('steamworks.js');
            } catch (error) {

            }

        }

        this._steam = steam;
        return this._steam;
    }

    /**
     * 是否是Steam环境
     * @returns 
     */
    public isSteamEnv(): boolean {
        return FYUtility.isValid(this.getSteamEnv());
    }
}