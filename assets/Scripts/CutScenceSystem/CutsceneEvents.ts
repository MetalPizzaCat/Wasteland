import Character from "../Character";

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
export default class CutsceneEvents extends cc.Component {

    @property(cc.Node)
    cutsceneNode: cc.Node = null;

    @property
    onlyForPlayer: boolean = true;

    @property
    onlyOnce: boolean = false;

    triggererNode: cc.Node;

    // LIFE-CYCLE CALLBACKS:

    onBeginContact(contact, selfCollider, otherCollider) {
        if (this.onlyForPlayer) {
            if ((otherCollider.node as cc.Node).getComponent(Character) != null) {
                (otherCollider.node as cc.Node).emit('oncutscenestart');
                this.triggererNode = otherCollider.node;
            }
        }
    }

    onEndContact(contact, selfCollider, otherCollider) {
        if (otherCollider.node == this.triggererNode) {
            if (this.onlyOnce) { this.destroy(); }
        }
    }

    // onLoad () {}

    start () {

    }

    // update (dt) {}
}
