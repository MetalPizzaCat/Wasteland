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
export default class NewClass extends cc.Component {

    @property({ min: 0 })
    damage: number = 0;

    @property({min:0})
   timeInterval: number = 0;

    @property
    damaging: boolean = true;

    passedTime: number = 0;

    damagedNodes: [cc.Node] = [null];

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    onBeginContact(contact, selfCollider, otherCollider) {

       
       
        for (let i: number = 0; i < this.damagedNodes.length; i++) {
            if (this.damagedNodes[i] != null) {
                if (this.damagedNodes[i] == otherCollider.node) {
                    return;
                }
            }
        }
        this.damagedNodes.push((otherCollider.node as cc.Node));
    }

    onEndContact(contact, selfCollider, otherCollider) {
        for (let i: number = 0; i < this.damagedNodes.length; i++) {
            if (this.damagedNodes[i] != null) {
                if (this.damagedNodes[i] == otherCollider.node) {
                    this.damagedNodes.splice(i, 1);
                }
            }
        }
    }

    start () {

    }

    update(dt) {
        if (this.damaging) {
            this.passedTime += dt;
            if (this.passedTime >= this.timeInterval) {
                this.passedTime = 0;
                for (let i: number = 0; i < this.damagedNodes.length; i++) {
                    if (this.damagedNodes[i] != null) {
                        this.damagedNodes[i].emit('damage', this.node, this.damage);
                    }
                }
            }
        }
    }
}
