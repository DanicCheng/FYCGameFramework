import { _decorator, Component, game, Node, UITransform, Vec3, view, Widget } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 自适应
 * 挂载该脚本的节点，始终保持铺满整个屏幕
 */

@ccclass('SpriteAdation')
export class SpriteAdation extends Component {

    onLoad() {
        this.screenResize();

        view.on('canvas-resize', this.screenResize, this);
    }

    screenResize() {
        // 如果有widget，宽高可能设置失败
        let widget = this.getComponent(Widget);
        if (widget) {
            widget.enabled = false;
        }
        
        let size = view.getDesignResolutionSize();
        let canvas = game.canvas;
        let designResolutionRatio = size.width / size.height;
        let ratio = canvas.width / canvas.height;
        let scale = 1;

        if (designResolutionRatio < ratio) {
            scale = ratio / designResolutionRatio;
        } else {
            scale = designResolutionRatio / ratio;
        }

        this.node.scale = new Vec3(scale, scale, scale);

        // console.log(`designResolutionWidth = ${size.width}, designResolutionHeight = ${size.height}`);
        // console.log(`width = ${game.canvas.width}, height = ${game.canvas.height}`);
        // console.log(`scale = ${scale}`);
    }
}


