import { _decorator, CCFloat, CCInteger, Component, math, Node, Tween, tween } from 'cc';
import { FY } from '../Base/FY';
const { ccclass, property } = _decorator;

/**
 * 序列帧动画
 */
@ccclass('SequenceFrameAnimation')
export class SequenceFrameAnimation extends Component {
    @property({
        type: [Node],
        displayName: '帧数组',
    })
    public frameArray: Array<Node> = [];

    @property({
        type: CCFloat,
        displayName: '间隔时间',
    })
    public interval: number = 1;
    @property({
        type: CCInteger,
        displayName: '重复次数',
        tooltip: '动画重复次数 -1是无限循环'
    })
    public repeatTimes: number = -1;
    @property({
        type: Boolean,
        displayName: '是否自动播放',
    })
    public autoPlay: boolean = true;

    /* 当前索引 */
    private _curIndex: number = 0;

    private _tween: Tween<any> = null;

    protected onEnable(): void {
        if (this.autoPlay) {
            this.play();
        }
    }

    protected onDisable(): void {
        if (this._tween) {
            this._tween.stop();
        }
    }

    setFrameActive(index: number) {
        this.frameArray.forEach(element => {
            element.active = false;
        });
        if (index < this.frameArray.length) {
            this.frameArray[index].active = true;
        }
    }

    public play() {
        this._tween = tween(this.node)
            .to(this.interval * this.frameArray.length, {}, {
                onUpdate: (target, ratio) => {
                    this._curIndex = Math.floor(this.frameArray.length * ratio) % this.frameArray.length;
                    this.setFrameActive(this._curIndex);
                }
            });
        if (this.repeatTimes == -1) {
            this._tween = this._tween.repeatForever().start();
        } else if (this.repeatTimes == 0) {
            this._tween = this._tween.call(() => {
                this.node.active = false;
            }).start();
        } else {
            this._tween = this._tween.repeat(this.repeatTimes).call(() => {
                this.node.active = false;
            }).start();
        }
    }
}


