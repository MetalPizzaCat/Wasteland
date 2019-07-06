import ObjectWithInventory, { InventoryMovingType } from "./ObjectWithInventory";

import Item from "../Item/Item";

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
export default class ItemSeller extends ObjectWithInventory {

    _inventoryMovingType: InventoryMovingType = InventoryMovingType.OutOnly;

    @property({ tooltip:"Name of item used as money for this object" })
    moneyItemName: string = "";

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    itemMoveToTheInventory() {
       
        if (this.otherInventory != null && this.sliderNode != null) {
            for (let i: number = 0; i < this.otherInventory.items.length; i++) {
                if ((this.otherInventory.items[i] as Item).itemName == this.moneyItemName) {
                    if ((this.otherInventory.items[i] as Item).amount >= Math.round(this.items[this.itemMoveSelectedItemIndex].amount * (this.sliderNode as cc.Node).getComponent(cc.Slider).progress)) {
                        this.otherInventory.addItem(this.items[this.itemMoveSelectedItemIndex].itemName, Math.round(this.items[this.itemMoveSelectedItemIndex].amount * (this.sliderNode as cc.Node).getComponent(cc.Slider).progress));
                        this.removeItem(this.items[this.itemMoveSelectedItemIndex].itemName, Math.round(this.items[this.itemMoveSelectedItemIndex].amount * (this.sliderNode as cc.Node).getComponent(cc.Slider).progress));

                        this.addItem(this.moneyItemName, (this.items[this.itemMoveSelectedItemIndex] as Item).value);
                        this.otherInventory.removeItem(this.moneyItemName, (this.items[this.itemMoveSelectedItemIndex] as Item).value);

                        break;
                    }
                }
            }
        }
    }

    //start() {}

    // update (dt) {}
}
