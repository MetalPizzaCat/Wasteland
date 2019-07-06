// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class SoundWithFalloff extends cc.Component {

    @property(cc.Node)
    listenerNode: cc.Node = null;

    // @property({ type: cc.Node })
    soundEmmitingNode: cc.Node = null;

    @property({ min: 0, tooltip: "Outside this distance volume is 0" })
    maxDistance: number = 1;

    @property({ min: 0 })
    supposedVolume: number = 0;

    resultVolume: number = 0;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        if (this.soundEmmitingNode == null) { this.soundEmmitingNode = this.node; }
    }

    start() {

    }

    update(dt) {
        if (this.listenerNode != null && this.soundEmmitingNode != null) {
            let x: number = -this.soundEmmitingNode.convertToWorldSpaceAR(cc.v2(0, 0)).x + this.listenerNode.convertToWorldSpaceAR(cc.v2(0, 0)).x ;
            let y: number = -this.soundEmmitingNode.convertToWorldSpaceAR(cc.v2(0, 0)).y + this.listenerNode.convertToWorldSpaceAR(cc.v2(0, 0)).y;
            let distance: number = Math.sqrt(x * x + y * y);
            if (distance > this.maxDistance) { this.resultVolume = 0; }
            else if (distance == 0) { this.resultVolume = this.supposedVolume; }
            else if (distance > 0 && distance <= this.maxDistance) {
                let mul = (100 * distance) / this.maxDistance;
                this.resultVolume = this.supposedVolume * (1 - (mul / 100));
            }
            else if (distance < 0) {
                throw new RangeError("disance is less than 0. Node: " + this.node.name);
            }
           
            for (let i: number = 0; i < this.soundEmmitingNode.getComponents(cc.AudioSource).length; i++) {
                if (this.soundEmmitingNode.getComponents(cc.AudioSource)[i] != null) {
                    this.soundEmmitingNode.getComponents(cc.AudioSource)[i].volume = this.resultVolume;
                }
            }

        }
    }
}

//let x: number = -this.soundEmmitingNode.getPosition().x + this.listenerNode.getPosition().x;
//let y: number = -this.soundEmmitingNode.getPosition().y + this.listenerNode.getPosition().y;