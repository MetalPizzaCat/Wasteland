import UsableObject from "../UsableObject";
import ObjectWithInventory from "./ObjectWithInventory";

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
export default class InventoryOpener extends UsableObject {

    

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    beUsed(node: cc.Node) {

        if (this.node.getComponent(ObjectWithInventory) != null && node.getComponent(ObjectWithInventory) != null) {
            if (this.node.getComponent(ObjectWithInventory).otherInventory == null && node.getComponent(ObjectWithInventory).otherInventory == null) {
                this.node.getComponent(ObjectWithInventory).otherInventory = node.getComponent(ObjectWithInventory);
                node.getComponent(ObjectWithInventory).otherInventory = this.node.getComponent(ObjectWithInventory);
                node.getComponent(ObjectWithInventory).activateInventory();
                this.node.getComponent(ObjectWithInventory).activateInventory();



                //this.node.getComponent(ObjectWithInventory).inventoryNode.setPosition((cc.v2(300, 0).sub(this.node.getPosition())).add(node.getPosition()));

                this.node.getComponent(ObjectWithInventory).inventoryNode.setPosition(this.node.getComponent(ObjectWithInventory).inventoryNode.convertToNodeSpaceAR(node.getPosition()).add(cc.v2(600, 0)));
                this.node.getComponent(ObjectWithInventory).sliderNode.setPosition(this.node.getComponent(ObjectWithInventory).sliderNode.convertToNodeSpaceAR(node.getPosition()).add(cc.v2(600, 600)));
            }
        }
    }

    start() {
        
    }

    // update (dt) {}
}
