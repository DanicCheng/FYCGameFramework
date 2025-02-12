
import { _decorator, Component, Node, game } from 'cc';
import { FYAdvertComponent } from '../Advert/FYAdvertComponent';
import { FYAudioComponent } from '../Audio/FYAudioComponent';
import { FYDeviceComponent } from '../Device/FYDeviceComponent';
import { FYEntityComponent } from '../Entity/FYEntityComponent';
import { FYEventComponent } from '../Event/FYEventComponent';
import FYLog from '../Log/FYLog';
import { FYNetComponent } from '../Net/FYNetComponent';
import { FYResourceComponent } from '../Resource/FYResourceComponent';
import { FYShareComponent } from '../Share/FYShareComponent';
import { FYStorageComponent } from '../Storage/FYStorageComponent';
import { FYTimerComponent } from '../Timer/FYTimerComponent';
import { FYUIComponent } from '../UI/FYUIComponent';
import FYUtility from '../Utility/FYUtility';
import { FYComponent } from './FYComponent';
import { FYEntry } from './FYEntry';
import { FYLocalizationComponent } from '../Localization/FYLocalizationComponent';
import { FYSystemComponent } from '../System/FYSystemComponent';
import { FYAchievementComponent } from '../Achievement/FYAchievementComponent';
const { ccclass, executionOrder, menu, property } = _decorator;

@ccclass('FY')
@executionOrder(-100)
@menu('FY/FY')
export class FY extends Component {
    /** 资源组件 */
    public static resource: FYResourceComponent;
    /** 事件组件 */
    public static event: FYEventComponent;
    /** UI组件 */
    public static ui: FYUIComponent;
    /** Entity组件 */
    public static entity: FYEntityComponent;
    /** 存储组件 */
    public static storage: FYStorageComponent;
    /** 广告组件 */
    public static advert: FYAdvertComponent;
    /** 分享组件 */
    public static share: FYShareComponent;
    /** 声音组件 */
    public static audio: FYAudioComponent;
    /** 设备组件 */
    public static device: FYDeviceComponent;
    /** 网络组件 */
    public static net: FYNetComponent;
    /** 计时器组件 */
    public static timer: FYTimerComponent;
    /** 本地化组件 */
    public static localization: FYLocalizationComponent;
    /** 系统组件 */
    public static sys: FYSystemComponent;
    /** 成就组件 */
    public static achievement: FYAchievementComponent;

    onLoad() {
        // 设置常驻节点
        game.addPersistRootNode(this.node);
        this.initComponent();
    }

    public initComponent() {
        FY.resource = this.getOrAddComponent(FYResourceComponent);
        FY.event = this.getOrAddComponent(FYEventComponent);
        FY.ui = this.getOrAddComponent(FYUIComponent);
        FY.entity = this.getOrAddComponent(FYEntityComponent);
        FY.storage = this.getOrAddComponent(FYStorageComponent);
        FY.advert = this.getOrAddComponent(FYAdvertComponent);
        FY.share = this.getOrAddComponent(FYShareComponent);
        FY.audio = this.getOrAddComponent(FYAudioComponent);
        FY.device = this.getOrAddComponent(FYDeviceComponent);
        FY.net = this.getOrAddComponent(FYNetComponent);
        FY.timer = this.getOrAddComponent(FYTimerComponent);
        FY.localization = this.getOrAddComponent(FYLocalizationComponent);
        FY.sys = this.getOrAddComponent(FYSystemComponent);
        FY.achievement = this.getOrAddComponent(FYAchievementComponent);
    }

    public getOrAddComponent<T extends FYComponent>(Ctor: new () => T): T {
        let component = FYEntry.getComponent(Ctor);
        if (!component) {
            component = this.node.addComponent(Ctor);
        }

        if (!component) {
            let clsName = FYUtility.getClassName(Ctor);
            FYLog.error(`Can not find the component ${clsName}`);
        }

        return component;
    }
}