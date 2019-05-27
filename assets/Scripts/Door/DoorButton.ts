import UsableObject from "../UsableObject";
import Door from "./Door";
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
export default class DoorButton extends UsableObject {

    @property
    doorName: string = 'door';

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    beUsed(): void {
        if (cc.director.getScene().getChildByName(this.doorName) != null) {
            if (cc.director.getScene().getChildByName(this.doorName).getComponent(Door) != null) {
                cc.director.getScene().getChildByName(this.doorName).getComponent(Door).open();
            }
        }
    }

    start () {

    }

    // update (dt) {}
}
