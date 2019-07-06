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

    @property({ type: cc.AudioClip })
    pressSound: cc.AudioClip = null; 

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    beUsed(node: cc.Node): void {
        if (this.door != null) {
            if (this.pressSound != null) { cc.audioEngine.playEffect(this.pressSound, false); }
            if (this.door.getComponent(Door) != null) {

                if (this.action == DoorAction.Open) { this.door.getComponent(Door).open(); }
                else if (this.action == DoorAction.Close) { this.door.getComponent(Door).close(); }
                else if (this.action == DoorAction.Lock) { this.door.getComponent(Door).lock(); }
                else if (this.action == DoorAction.UnLock) { this.door.getComponent(Door).unLock(); }
                else if (this.action == DoorAction.ToggleLock) {
                    if (this.door.getComponent(Door).locked) { this.door.getComponent(Door).unLock(); }
                    else { this.door.getComponent(Door).lock(); }
                }
                else if (this.action == DoorAction.ToggleOpen) {
                    cc.log(this.door.getComponent(Door).opened);
                    if (this.door.getComponent(Door).opened) { this.door.getComponent(Door).close(); }
                    else { this.door.getComponent(Door).open(); }
                }

            }
        }
    }

    start() {
        this.node.on('beused', this.beUsed, this);
    }

    // update (dt) {}
}
