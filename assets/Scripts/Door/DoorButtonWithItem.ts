import DoorButton from "./DoorButton";
import Item from "../Item/Item";
import Door from "./Door";
import ObjectWithInventory from "../InventorySystem/ObjectWithInventory";

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
export default class DoorButtonWithItem extends DoorButton {

    @property
    requiredItemName: string = "key";

    @property({ min: 1 })
    amountOfRequiredItems: number = 1;

    @property({ tooltip: "If item should be removed when using" })
    itemWillBeRemoved: boolean = false;

    @property({ tooltip: "Checked only if  itemWillBeRemoved is true" })
    needItemEverytime: boolean = false;

    itemWasUsed: boolean = false;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    beUsed(node: cc.Node): void {
        let canBeUsed: boolean = false;
        if (this.itemWasUsed && !this.needItemEverytime) { canBeUsed = true; }
        else if (node != null) {
            if (node.getComponent(ObjectWithInventory) != null) {
                for (let u: number = 0; u < node.getComponent(ObjectWithInventory).items.length; u++) {
                    if (node.getComponent(ObjectWithInventory).items[u] != null) {
                        if (node.getComponent(ObjectWithInventory).items[u].itemName == this.requiredItemName && node.getComponent(ObjectWithInventory).items[u].amount >= this.amountOfRequiredItems) {
                            canBeUsed = true;
                            this.itemWasUsed = true;
                            node.getComponent(ObjectWithInventory).removeItem(this.requiredItemName, this.amountOfRequiredItems);
                            break;
                        }
                    }
                }
            }
        }
        if (canBeUsed) {
            if (this.door != null) {
                cc.log(this.action);
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
                        if (this.door.getComponent(Door).opened) { this.door.getComponent(Door).close(); cc.log("ddd"); }
                        else { this.door.getComponent(Door).open(); cc.log("ddd"); }
                    }

                }
            }
        }
    }

    start() {

    }

    // update (dt) {}
}
