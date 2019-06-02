import Door from "./Door";
import UsableObject from "../UsableObject";


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

export enum DoorAction {
    Open,
    Close,
    Lock,
    UnLock,
    ToggleOpen,
    ToggleLock
}

@ccclass
export default class DoorButton extends UsableObject {

    @property({ type: cc.Enum(DoorAction) })
    action: DoorAction = DoorAction.ToggleOpen;

    @property(cc.Node)
    door: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    beUsed(node: cc.Node): void {
        if (this.door != null) {
            for (let i: number = 0; i < this.door.getComponents(Door).length; i++) {
                if (this.door.getComponents(Door) != null) {
                    if (this.action == DoorAction.Open) { this.door.getComponents(Door)[i].open(); }
                    else if (this.action == DoorAction.Close) { this.door.getComponents(Door)[i].close(); }
                    else if (this.action == DoorAction.Lock) { this.door.getComponents(Door)[i].lock(); }
                    else if (this.action == DoorAction.UnLock) { this.door.getComponents(Door)[i].unLock(); }
                    else if (this.action = DoorAction.ToggleLock) {
                        if (this.door.getComponents(Door)[i].locked) { this.door.getComponents(Door)[i].unLock(); }
                        else { this.door.getComponents(Door)[i].lock();}
                    }
                    else if (this.action = DoorAction.ToggleOpen ){
                        if (this.door.getComponents(Door)[i].opened) { this.door.getComponents(Door)[i].close(); }
                        else { this.door.getComponents(Door)[i].open(); }
                    }
                }
            }
        }
    }

    start() {
        
    }

    // update (dt) {}
}
