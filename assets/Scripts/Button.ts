import UsableObject from "./UsableObject";

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
export default class Button extends UsableObject {

    @property([cc.Node])
    usedNodes: [cc.Node] = [null];

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    beUsed(node: cc.Node): void {
        for (let i: number = 0; i < this.usedNodes.length; i++) {
            this.usedNodes[i].emit('usedbybutton', node);
        }
    }

    start () {

    }

    // update (dt) {}
}
