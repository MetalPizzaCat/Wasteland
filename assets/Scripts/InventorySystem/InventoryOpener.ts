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
        cc.log("fuck you");
        if (this.node.getComponent(ObjectWithInventory) != null && node.getComponent(ObjectWithInventory) != null) {
            cc.log(',but not now');
            this.node.getComponent(ObjectWithInventory).otherInventory = node.getComponent(ObjectWithInventory);
            node.getComponent(ObjectWithInventory).otherInventory = this.node.getComponent(ObjectWithInventory);
            node.getComponent(ObjectWithInventory).activateInventory();
            this.node.getComponent(ObjectWithInventory).activateInventory();

            

            this.node.getComponent(ObjectWithInventory).inventoryNode.setPosition((cc.v2(300, 0).sub(this.node.getPosition())).add(node.getPosition()));
        }
    }

    start() {
        
    }

    // update (dt) {}
}
