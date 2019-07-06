import ObjectWithInventory, { InventoryMovingType } from "./ObjectWithInventory";
//import InventoryMovingType from "./ObjectWithInventory";

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
export default class ItemBuyer extends ObjectWithInventory {

    _inventoryMovingType: InventoryMovingType = InventoryMovingType.InOnly;

    @property({ tooltip: "Name of item used as money for this object" })
    moneyItemName: string = "";

    // LIFE-CYCLE CALLBACKS:

    onLoad() { cc.log(this); }

    //start () {}

    // update (dt) {}
}
