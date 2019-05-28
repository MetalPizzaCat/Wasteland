import Elevator from "./Elevator";
import Character from "./Character";
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
export default class ElevatorTrigger extends UsableObject {
    @property
    elevatorName: string = 'elevator';

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

    }


    // will be called once when two colliders begin to contact
    onBeginContact(contact, selfCollider, otherCollider) {
        //if (otherCollider.node.getComponent(Character) != null) {
        //    if (cc.director.getScene().getChildByName(this.elevatorName) != null) {
        //        if (cc.director.getScene().getChildByName(this.elevatorName).getComponent(Elevator) != null) {
        //            cc.director.getScene().getChildByName(this.elevatorName).getComponent(Elevator).startMovement();
        //        }
        //    }
        //}
    }

    // will be called once when the contact between two colliders just about to end.
    onEndContact(contact, selfCollider, otherCollider) {
        //if (otherCollider.node.getComponent(Character) != null) {
        //    if (cc.director.getScene().getChildByName(this.elevatorName) != null) {
        //        if (cc.director.getScene().getChildByName(this.elevatorName).getComponent(Elevator) != null) {
        //            cc.director.getScene().getChildByName(this.elevatorName).getComponent(Elevator).stopMovement();
        //        }
        //    }
        //}
    }

    // will be called everytime collider contact should be resolved
    onPreSolve(contact, selfCollider, otherCollider) {
    }

    // will be called every time collider contact is resolved
    onPostSolve(contact, selfCollider, otherCollider) {
    }

    beUsed() {
        cc.log("i'm used");
        if (cc.director.getScene().getChildByName(this.elevatorName) != null) {
            if (cc.director.getScene().getChildByName(this.elevatorName).getComponent(Elevator) != null) {
                cc.director.getScene().getChildByName(this.elevatorName).getComponent(Elevator).startMovement();
            }
        }
    }

    start () {
        
    }

    // update (dt) {}
}
