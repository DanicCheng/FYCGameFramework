
import { _decorator } from 'cc';
import { FYModule } from '../Base/FYModule';
import { FYNetHelperBase } from './FYNetHelperBase';
const { ccclass } = _decorator;

/**
 * 网络模块
 */

export class FYNetModule extends FYModule {
    /**
     * 类名
     */
    public static clsName = "FYNetModule";
    /** netName为空的默认网络辅助器 */
    private _defaultNetHelper: FYNetHelperBase = undefined;
    /** 网络辅助器字典 */
    private _netHelperDict: { [key: string]: FYNetHelperBase } = {};

    /**
     * 设置网络辅助器
     * @param netHelper 网络辅助器
     * @param netName 网络链接名，如果有多个网络链接，则用名字区分
     */
    public setHelper(netHelper: FYNetHelperBase, netName?: string): void {
        if (!!netName) {
            this._netHelperDict[netName] = netHelper;
        } else {
            this._defaultNetHelper = netHelper;
        }
    }

    /**
     * 获取网络辅助器
     * @param netName 网络链接名
     * @returns 
     */
    public getHelper(netName?: string): FYNetHelperBase {
        if (!!netName) {
            return this._netHelperDict[netName];
        } else {
            return this._defaultNetHelper;
        }
    }

    /**
     * 初始化
     * @param netHelper 网络辅助器
     * @param netName 网络链接名，如果有多个网络链接，则用名字区分
     */
    public init(netHelper: FYNetHelperBase, netName?: string) {
        this.setHelper(netHelper, netName);
    }

    /**
     * 连接
     * @param host 地址
     * @param port 端口号
     * @param cb 回调
     * @param netName 网络链接名，如果有多个网络链接，则用名字区分
     */
    public connect(host: string, port: number, cb: (data?: any) => void, netName?: string) {
        let netHelper = this.getHelper(netName);
        if (!!netHelper) {
            netHelper.connect(host, port, cb);
        }
    }

    /**
     * 消息请求 有回复
     * @param route 消息类型
     * @param msg 消息体
     * @param cb 回调
     * @param netName 网络链接名，如果有多个网络链接，则用名字区分
     */
    public request(route: string, msg: any, cb: (data: any) => void, netName?: string) {
        let netHelper = this.getHelper(netName);
        if (!!netHelper) {
            netHelper.request(route, msg, cb);
        }
    }

    /**
     * 消息通知 没回复
     * @param route 消息类型
     * @param msg 消息体
     * @param netName 网络链接名，如果有多个网络链接，则用名字区分
     */
    public notify(route: string, msg: any, netName?: string) {
        let netHelper = this.getHelper(netName);
        if (!!netHelper) {
            netHelper.notify(route, msg);
        }
    }

    /**
     * 服务器推送消息监听
     * @param route 消息类型
     * @param cb 回调
     * @param netName 网络链接名，如果有多个网络链接，则用名字区分
     */
    public on(route: string, cb: (...params) => void, netName?: string) {
        let netHelper = this.getHelper(netName);
        if (!!netHelper) {
            netHelper.on(route, cb);
        }
    }

    /**
     * 服务器推送消息取消监听
     * @param route 消息类型
     * @param cb 回调
     * @param netName 网络链接名，如果有多个网络链接，则用名字区分
     */
    public off(route: string, cb: (...params) => void, netName?: string) {
        let netHelper = this.getHelper(netName);
        if (!!netHelper) {
            netHelper.off(route, cb);
        }
    }

    /**
     * 断开连接
     * @param netName 网络链接名，如果有多个网络链接，则用名字区分
     */
    public disconnect(netName?: string) {
        let netHelper = this.getHelper(netName);
        if (!!netHelper) {
            netHelper.disconnect();
        }
    }
}