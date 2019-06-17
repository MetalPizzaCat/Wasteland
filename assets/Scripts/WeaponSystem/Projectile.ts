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
export default class Projectile extends cc.Component {

    @property({ min: 0 })
    damage: number = 0;

    @property({})
    destroyOnTouch: boolean = false;

    @property({ min: 0.0, tooltip: "How much time will pass before node will be destroyed. 0.0 means infinite" })
    lifeTime: number = 0.0;

    livedTime: number = 0.0;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {

    }

    onBeginContact(contact, selfCollider, otherCollider) {
        if ((otherCollider as cc.PhysicsCollider).sensor != true) {
            otherCollider.node.emit('damage', this.node, this.damage);
            if (this.destroyOnTouch) {
                this.node.destroy();
            }
        }
    }

    update(dt) {
        if (this.lifeTime != 0.0 && !this.destroyOnTouch) {
            this.livedTime += dt;
            if (this.livedTime >= this.lifeTime) {
                if (this.node != null) {
                    this.node.destroy();
                   
                }
            }
        }
    }
}
