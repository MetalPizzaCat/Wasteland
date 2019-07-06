import Item from "../Item/Item";
import ItemSoundDataScript from "./ItemSoundData";
import Weapon from "../WeaponSystem/Weapon";
import ItemSeller from "./itemSeller";
import ItemBuyer from "./itemBuyer";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
class ItemData {
    @property({ tooltip: "Name of the item in itemTable", displayName:"ItemName" })
    name: string = 'cup';

    @property({
        min: 1
    })
    amount: number = 1;
}



@ccclass
/*
* used to safely move item between inventories
* DEPRECATED. AVOID USING
*/
class InventoryBridge {
    inventoryOne: ObjectWithInventory = null;

    inventoryTwo: ObjectWithInventory = null;

    //move item from One to Two
    moveItemToTwo(name: string, amount: number) {
        this.inventoryOne.removeItem(name, amount);
        this.inventoryTwo.addItem(name, amount);
    }

    //move item from Two to One
    moveItemToOne(name: string, amount: number) {
        this.inventoryTwo.removeItem(name, amount);
        this.inventoryOne.addItem(name, amount);
    }
}

export enum InventoryMovingType {
    InOnly,
    OutOnly,
    Both
}

@ccclass
export default class ObjectWithInventory extends cc.Component {

    _inventoryMovingType: InventoryMovingType = InventoryMovingType.Both;

    @property([ItemData])
    itemsData: [ItemData] = [null];


    //items: [Item] = [null];

    items: [any] = [null];

    @property(cc.Node)
    itemSoundDataNode: cc.Node = null;


    //@property(ObjectWithInventory)
    /*
     *if you want to safely move objects from one inventory to another assign other one to this field
     *
     * */
    otherInventory: ObjectWithInventory = null;

    @property(cc.Node)
    sliderNode: cc.Node = null;

    //parent node used to display inventory
    @property(cc.Node)
    inventoryNode: cc.Node = null;

    @property(cc.Node)
    /* *node for displaying other's inventory*/
    otherInventoryNode: cc.Node = null;

    @property(cc.Node)
    otherSlider: cc.Node = null;

    @property(cc.SpriteFrame)
    itemButtonPressed: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    itemButtonHovered: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    itemButtonDefault: cc.SpriteFrame = null;

    activated: boolean = false;

    selectedItemIndex: number = 0;

    itemMoveSelectedItemIndex: number = 0;    

    itemDataTable: any;

    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        var url = cc.url.raw('resources/DataTabels/items.json')
        cc.loader.load(url, function (err, itemArray) {
            for (var i: number = 0; i < this.itemsData.length; i++) {
                if (this.itemsData[i] != null) {
                    var item = new Item();
                    item.itemName = this.itemsData[i].name;
                    item.amount = this.itemsData[i].amount;
                    for (let u: number = 0; u < Object.keys(itemArray["json"]["items"]).length; u++) {
                        if (itemArray["json"]["items"][u]["name"] == this.itemsData[i].name) {
                            if (itemArray["json"]["items"][u]["type"] == "Weapon") {
                                item = new Weapon();
                                item.itemName = this.itemsData[i].name;
                                item.amount = this.itemsData[i].amount;
                                item.loadDataForItem(itemArray);
                            }
                            else {
                                item.loadDataForItem(itemArray);
                            }
                        }
                    }
                    this.items.push(item);
                }
            }
            cc.log(this.items.length);


            cc.log(this.items.length);
            for (var i: number = 1; i < this.items.length; i++) {

                this.items[i].loadDataForItem(itemArray);
            }
            this.itemDataTable = itemArray;

        }.bind(this));

        if (this.itemSoundDataNode == null || this.itemSoundDataNode.getComponent(ItemSoundDataScript) == null) { alert("There must be itemSoundDataNode with ItemSoundDataScript component Object: " + this.node.name); close(); }
    }

    start() {

    }

    itemButtonCallback(event, customEventData) {
        this.addItem(customEventData, 1);
    }

    dropButtonCallback(event, customEventData) {
        let num: number;

        if (this.sliderNode != null && this.items[this.selectedItemIndex] != null) { num = Math.round(this.items[this.selectedItemIndex].amount * (this.sliderNode as cc.Node).getComponent(cc.Slider).progress); }
        else { num = 0; }

        if (this.items[this.selectedItemIndex] != null) {
            let itemNode = new cc.Node(this.items[this.selectedItemIndex].itemName);
            itemNode.addComponent(Item);
            itemNode.getComponent(Item).itemName = this.items[this.selectedItemIndex].itemName;
            itemNode.getComponent(Item).amount = num;
            itemNode.addComponent(cc.Sprite);
            itemNode.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.items[this.selectedItemIndex].imageName);
            itemNode.addComponent(cc.RigidBody);
            itemNode.addComponent(cc.PhysicsBoxCollider);

            itemNode.parent = cc.director.getScene();
            itemNode.setPosition(this.node.getPosition().add(cc.v2(200, 0)));
            itemNode.getComponent(cc.PhysicsBoxCollider).size = cc.size(itemNode.getComponent(cc.Sprite).spriteFrame.getOriginalSize().width, itemNode.getComponent(cc.Sprite).spriteFrame.getOriginalSize().height);
            itemNode.getComponent(cc.PhysicsBoxCollider).apply();



            for (let i: number = 0; i < this.itemSoundDataNode.getComponent(ItemSoundDataScript).sounds.length; i++) {

                if (this.itemSoundDataNode.getComponent(ItemSoundDataScript).sounds[i].name == this.items[this.selectedItemIndex].itemName) {
                    cc.audioEngine.play(this.itemSoundDataNode.getComponent(ItemSoundDataScript).sounds[i].dropSound[0], false, 1);
                }

            }
            this.removeItem(this.items[this.selectedItemIndex].itemName, num);
        }
    }

    /**
     * Safe way of removing items from invemtory of object
      if amount is bigger than amount of items in inventory error will be thrown
     @param name name of the item that you would like to remove
     @param amount  how much do you want to remove, must be int value that is bigger than 0
      */
    removeItem(name: string, amount: number) {
        amount = Math.round(amount);
        if (amount > 0) {
            for (let i: number = 1; i < this.items.length; i++) {
                if (this.items[i].itemName == name) {
                    if (this.items[i].amount == amount) {
                        this.items.splice(i, 1)[0];
                       
                        this.refreshInventoryNode();

                        return;
                    }
                    else if (this.items[i].amount > amount) {
                        this.items[i].amount -= amount;
                        this.refreshInventoryNode();

                        return;
                    }
                    else {

                        throw new RangeError("Attemp to remove " + name + " from " + this.name + " failed. Reason: attempted to remove more than it was");
                    }
                }
            }
        }
        else {
            throw new RangeError("Attemp to remove " + name + " from " + this.name + " failed. Reason: value is less than 0");
        }
    }

    addItem(name: string, amount: number) {
        amount = Math.round(amount);
        if (amount > 0) {
            for (let i: number = 0; i < this.items.length; i++) {
                if (this.items[i] != null) {
                    if (this.items[i].itemName == name) {
                        this.items[i].amount += amount;
                        this.refreshInventoryNode();
                        return;
                    }
                }
            }

            

            if (this.itemDataTable != null) {
                for (let u: number = 0; u < Object.keys(this.itemDataTable["json"]["items"]).length; u++) {
                    if (this.itemDataTable["json"]["items"][u]["name"] == name) {
                        if (this.itemDataTable["json"]["items"][u]["type"] == "Weapon") {
                            item = new Weapon();
                            item.itemName = name;
                            item.amount = amount;
                            if (!item.loadDataForItem(this.itemDataTable)) {
                                cc.log("Failed to load item");
                            }
                            else {
                                this.items.push(item);
                                this.refreshInventoryNode();
                                return;
                            }
                        }
                        else {
                            var item = new Item();
                            item.itemName = name;
                            item.amount = amount;

                            if (!item.loadDataForItem(this.itemDataTable)) {
                                cc.log("Failed to load item");
                            }
                            else {
                                this.items.push(item);
                                this.refreshInventoryNode();
                                return;
                            }
                        }
                    }
                }
            }

            //let it = new Item();
            //it.itemName = name;
            //it.amount = amount;
            //if (this.itemDataTable != null) {
            //    if (!it.loadDataForItem(this.itemDataTable)) {
                   
            //    }
            //    else {
            //        this.items.push(it);
            //        this.refreshInventoryNode();
            //        return;
            //    }
            //}
            //else {
            //    //cc.log("it didn't work");
            //}
        }
        else {
            throw new RangeError("Attemp to add item to " + name + " with name " + this.name + " failed. Reason: value is less than 0");
        }
    }

    /**
     * Refresh data in the array and make node visible
     * */
    activateInventory() {
        if (this.inventoryNode != null && !this.activated) {

            if (this.items.length - 1 != this.inventoryNode.getComponent(cc.ScrollView).content.childrenCount) {

                this.refreshInventoryNode();
                this.inventoryNode.setPosition(cc.v2(0, 0));

            }

            this.inventoryNode.active = true;
            if (this.sliderNode != null) { this.sliderNode.active = true; }
            this.activated = true;
            if (this.otherInventory != null) {
                if (this.getComponent(ObjectWithInventory).inventoryNode.getChildByName("dropButton") != null) {
                    this.getComponent(ObjectWithInventory).inventoryNode.getChildByName("dropButton").active = false;
                }
                if (this.getComponent(ObjectWithInventory).inventoryNode.getChildByName("setAsCurrentWeaponButton") != null) {
                    this.getComponent(ObjectWithInventory).inventoryNode.getChildByName("setAsCurrentWeaponButton").active = false;
                }
            }
            else {
                if (this.getComponent(ObjectWithInventory).inventoryNode.getChildByName("dropButton") != null) {
                    this.getComponent(ObjectWithInventory).inventoryNode.getChildByName("dropButton").active = true;
                }
                if (this.getComponent(ObjectWithInventory).inventoryNode.getChildByName("setAsCurrentWeaponButton") != null) {
                    this.getComponent(ObjectWithInventory).inventoryNode.getChildByName("setAsCurrentWeaponButton").active = true;
                }
            }
        }
        else if (this.inventoryNode == null) {
            throw new Error("Failed to find inventory node");
            close();
        }
    }

    activateAsOtherInv(otherInvNode: cc.Node, otherSliderNode: cc.Node) {
        if (otherInvNode != null && !otherInvNode.active ) {
            otherInvNode.active = true;
            otherSliderNode.active = true;
            this.refreshAsOtherInv(otherInvNode, otherSliderNode);  
        }
        
    }

    refreshAsOtherInv(otherInvNode: cc.Node, otherSliderNode: cc.Node) {
        cc.log(this.items);
        otherInvNode.getComponent(cc.ScrollView).content.removeAllChildren();
        for (var i: number = 0; i < this.items.length; i++) {
            if (this.items[i] != null) {
                const index: number = i;
                otherInvNode.getComponent(cc.ScrollView).content.addChild(new cc.Node(this.items[i].itemName));
                if (otherInvNode.getComponent(cc.ScrollView).content.getChildByName(this.items[i].itemName) != null) {

                    let clickEventHandler = new cc.Component.EventHandler();
                    clickEventHandler.target = this.node; //This node is the node to which your event handler code component belongs
                    clickEventHandler.component = "ObjectWithInventory";//This is the code file name
                    clickEventHandler.handler = "itemButtonCallback";
                    clickEventHandler.customEventData = this.items[i].itemName;




                    otherInvNode.getComponent(cc.ScrollView).content.getChildByName(this.items[i].itemName).addChild(new cc.Node(this.items[i].itemName + "_background"));


                    otherInvNode.getComponent(cc.ScrollView).content.getChildByName(this.items[i].itemName).addComponent(cc.Button);

                    otherInvNode.getComponent(cc.ScrollView).content.getChildByName(this.items[i].itemName).getChildByName(this.items[i].itemName + "_background").addComponent(cc.Sprite);

                    otherInvNode.getComponent(cc.ScrollView).content.getChildByName(this.items[i].itemName).getChildByName(this.items[i].itemName + "_background").getComponent(cc.Sprite).spriteFrame = this.itemButtonDefault;

                    otherInvNode.getComponent(cc.ScrollView).content.getChildByName(this.items[i].itemName).getChildByName(this.items[i].itemName + "_background").setPosition(cc.v2(0, 0));


                    otherInvNode.getComponent(cc.ScrollView).content.getChildByName(this.items[i].itemName).getComponent(cc.Button).target = otherInvNode.getComponent(cc.ScrollView).content.getChildByName(this.items[i].itemName).getChildByName(this.items[i].itemName + "_background");

                    if (this.itemButtonDefault != null) {
                        otherInvNode.getComponent(cc.ScrollView).content.getChildByName(this.items[i].itemName).getComponent(cc.Button).normalSprite = this.itemButtonDefault;
                    }
                    if (this.itemButtonHovered != null) {
                        otherInvNode.getComponent(cc.ScrollView).content.getChildByName(this.items[i].itemName).getComponent(cc.Button).hoverSprite = this.itemButtonHovered;
                    }
                    if (this.itemButtonPressed != null) {
                        otherInvNode.getComponent(cc.ScrollView).content.getChildByName(this.items[i].itemName).getComponent(cc.Button).pressedSprite = this.itemButtonPressed;
                    }

                    otherInvNode.getComponent(cc.ScrollView).content.getChildByName(this.items[i].itemName).getChildByName(this.items[i].itemName + "_background").addComponent(cc.Label);

                   otherInvNode.getComponent(cc.ScrollView).content.getChildByName(this.items[i].itemName).getChildByName(this.items[i].itemName + "_background").getComponent(cc.Label).horizontalAlign = cc.Label.HorizontalAlign.LEFT;
                    otherInvNode.getComponent(cc.ScrollView).content.getChildByName(this.items[i].itemName).getChildByName(this.items[i].itemName + "_background").getComponent(cc.Label).string = this.items[i].displayName + "(" + this.items[i].amount + ")";
                    otherInvNode.getComponent(cc.ScrollView).content.getChildByName(this.items[i].itemName).setPosition(this.inventoryNode.getComponent(cc.ScrollView).content.getChildByName(this.items[i].itemName).getPosition().x, - i * 35);
                    otherInvNode.getComponent(cc.ScrollView).content.getChildByName(this.items[i].itemName).getChildByName(this.items[i].itemName + "_background").getComponent(cc.Label).fontSize = 24;
                    // cc.log("supposed name " + this.items[i].itemName + " result name " + this.inventoryNode.getComponent(cc.ScrollView).content.getChildByName(this.items[i].itemName).getComponent(cc.Label).string);

                    otherInvNode.getComponent(cc.ScrollView).content.getChildByName(this.items[i].itemName).getComponent(cc.Button).clickEvents.push(clickEventHandler);

                    (otherInvNode.getComponent(cc.ScrollView).content.getChildByName(this.items[i].itemName).getChildByName(this.items[i].itemName + "_background") as cc.Node).color = cc.Color.WHITE;

                    otherInvNode.getComponent(cc.ScrollView).content.getChildByName(this.items[i].itemName).getChildByName(this.items[i].itemName + "_background").on('mousedown', function (event) {


                        if (this.otherInventory != null) {
                            if (this.sliderNode != null) {
                                (this as ObjectWithInventory).itemMoveSelectedItemIndex = index;
                                otherSliderNode.getChildByName("item_slider_amount").getComponent(cc.Label).string = (Math.round(this.items[this.itemMoveSelectedItemIndex].amount * (otherSliderNode as cc.Node).getComponent(cc.Slider).progress)).toString();
                                (otherInvNode.getComponent(cc.ScrollView).content.getChildByName(this.items[index].itemName).getChildByName(this.items[index].itemName + "_background") as cc.Node).color = cc.Color.RED;
                            }
                            else {
                                this.addItem(this.items[index].itemName, 1);
                                this.otherInventory.removeItem(this.items[index].itemName, 1);
                            }
                        }                                           

                    }.bind(this, index, otherSliderNode, otherInvNode));

                }
                else {
                    cc.log("Failed to add child with name " + this.items[i].itemName);
                }

            }

            else {
                //cc.log("item at " + i + " is null");
            }
        }
    }

    deactivateInventory() {
        if (this.inventoryNode != null && this.activated) {
            this.inventoryNode.active = false;
            this.activated = false;
            if (this.sliderNode != null) { this.sliderNode.active = false; }
            if (this.otherSlider != null) { this.otherSlider.active = false; }
            if (this.otherInventoryNode != null) { this.otherInventoryNode.active = false; }
        }
        if (this.otherInventory != null) { this.otherInventory.otherInventory = null; this.otherInventory.deactivateInventory(); this.otherInventory = null; }
    }

    refreshInventoryNode() {
        this.inventoryNode.getComponent(cc.ScrollView).content.removeAllChildren();
        for (var i: number = 0; i < this.items.length; i++) {
            if (this.items[i] != null) {
                const index: number = i;
                this.inventoryNode.getComponent(cc.ScrollView).content.addChild(new cc.Node(this.items[i].itemName));
                if (this.inventoryNode.getComponent(cc.ScrollView).content.getChildByName(this.items[i].itemName) != null) {

                    var clickEventHandler = new cc.Component.EventHandler();
                    clickEventHandler.target = this.node; //This node is the node to which your event handler code component belongs
                    clickEventHandler.component = "ObjectWithInventory";//This is the code file name
                    clickEventHandler.handler = "itemButtonCallback";
                    clickEventHandler.customEventData = this.items[i].itemName;




                    this.inventoryNode.getComponent(cc.ScrollView).content.getChildByName(this.items[i].itemName).addChild(new cc.Node(this.items[i].itemName + "_background"));


                    this.inventoryNode.getComponent(cc.ScrollView).content.getChildByName(this.items[i].itemName).addComponent(cc.Button);

                    this.inventoryNode.getComponent(cc.ScrollView).content.getChildByName(this.items[i].itemName).getChildByName(this.items[i].itemName + "_background").addComponent(cc.Sprite);

                    this.inventoryNode.getComponent(cc.ScrollView).content.getChildByName(this.items[i].itemName).getChildByName(this.items[i].itemName + "_background").getComponent(cc.Sprite).spriteFrame = this.itemButtonDefault;

                    this.inventoryNode.getComponent(cc.ScrollView).content.getChildByName(this.items[i].itemName).getChildByName(this.items[i].itemName + "_background").setPosition(cc.v2(0, 0));


                    this.inventoryNode.getComponent(cc.ScrollView).content.getChildByName(this.items[i].itemName).getComponent(cc.Button).target = this.inventoryNode.getComponent(cc.ScrollView).content.getChildByName(this.items[i].itemName).getChildByName(this.items[i].itemName + "_background");

                    if (this.itemButtonDefault != null) {
                        this.inventoryNode.getComponent(cc.ScrollView).content.getChildByName(this.items[i].itemName).getComponent(cc.Button).normalSprite = this.itemButtonDefault;
                    }
                    if (this.itemButtonHovered != null) {
                        this.inventoryNode.getComponent(cc.ScrollView).content.getChildByName(this.items[i].itemName).getComponent(cc.Button).hoverSprite = this.itemButtonHovered;
                    }
                    if (this.itemButtonPressed != null) {
                        this.inventoryNode.getComponent(cc.ScrollView).content.getChildByName(this.items[i].itemName).getComponent(cc.Button).pressedSprite = this.itemButtonPressed;
                    }

                    this.inventoryNode.getComponent(cc.ScrollView).content.getChildByName(this.items[i].itemName).getChildByName(this.items[i].itemName + "_background").addComponent(cc.Label);

                    this.inventoryNode.getComponent(cc.ScrollView).content.getChildByName(this.items[i].itemName).getChildByName(this.items[i].itemName + "_background").getComponent(cc.Label).horizontalAlign = cc.Label.HorizontalAlign.LEFT;
                    this.inventoryNode.getComponent(cc.ScrollView).content.getChildByName(this.items[i].itemName).getChildByName(this.items[i].itemName + "_background").getComponent(cc.Label).string = this.items[i].displayName + "(" + this.items[i].amount + ")";
                    this.inventoryNode.getComponent(cc.ScrollView).content.getChildByName(this.items[i].itemName).setPosition(this.inventoryNode.getComponent(cc.ScrollView).content.getChildByName(this.items[i].itemName).getPosition().x, - i * 35);
                    this.inventoryNode.getComponent(cc.ScrollView).content.getChildByName(this.items[i].itemName).getChildByName(this.items[i].itemName + "_background").getComponent(cc.Label).fontSize = 24;
                    // cc.log("supposed name " + this.items[i].itemName + " result name " + this.inventoryNode.getComponent(cc.ScrollView).content.getChildByName(this.items[i].itemName).getComponent(cc.Label).string);

                    this.inventoryNode.getComponent(cc.ScrollView).content.getChildByName(this.items[i].itemName).getComponent(cc.Button).clickEvents.push(clickEventHandler);

                    (this.inventoryNode.getComponent(cc.ScrollView).content.getChildByName(this.items[i].itemName).getChildByName(this.items[i].itemName + "_background") as cc.Node).color = cc.Color.WHITE;

                    this.inventoryNode.getComponent(cc.ScrollView).content.getChildByName(this.items[i].itemName).getChildByName(this.items[i].itemName + "_background").on('mousedown', function (event) {


                        if (this.otherInventory != null) {
                            if (this.sliderNode != null) {
                                (this as ObjectWithInventory).itemMoveSelectedItemIndex = index;
                                this.sliderNode.getChildByName("item_slider_amount").getComponent(cc.Label).string = (Math.round(this.items[this.itemMoveSelectedItemIndex].amount * (this.sliderNode as cc.Node).getComponent(cc.Slider).progress)).toString();
                                (this.inventoryNode.getComponent(cc.ScrollView).content.getChildByName(this.items[index].itemName).getChildByName(this.items[index].itemName + "_background") as cc.Node).color = cc.Color.RED;
                            }
                            else {
                                this.otherInventory.addItem(this.items[index].itemName, 1);
                                this.removeItem(this.items[index].itemName, 1);
                            }
                        }
                        else {
                            this.selectedItemIndex = index;
                            this.sliderNode.getChildByName("item_slider_amount").getComponent(cc.Label).string = (Math.round(this.items[this.selectedItemIndex].amount * (this.sliderNode as cc.Node).getComponent(cc.Slider).progress)).toString();
                            (this.inventoryNode.getComponent(cc.ScrollView).content.getChildByName(this.items[index].itemName).getChildByName(this.items[index].itemName + "_background") as cc.Node).color = cc.Color.RED;
                        }

                        { /*     if (this.items[index].amount < 10) {
                                    (this.sliderNode as cc.Node).active = false;
                                    this.otherInventory.addItem(this.items[index].itemName, 1);
                                    this.removeItem(this.items[index].itemName, 1);
                                }
                                else {
                                    if (this.sliderNode != null) {
                                        (this.sliderNode as cc.Node).active = true;
                                        (this.sliderNode as cc.Node).getChildByName("item_slider_amount").getComponent(cc.Label).string = (Math.round(this.items[index].amount * (this.sliderNode as cc.Node).getComponent(cc.Slider).progress)).toString();
                                        (this.sliderNode as cc.Node).on('mousedown', function (event) {
                                            this.getChildByName("item_slider_amount").getComponent(cc.Label).string = (Math.round(this.items[index].amount * (this.sliderNode as cc.Node).getComponent(cc.Slider).progress)).toString();
                                            this.otherInventory.addItem(this.items[index].itemName, (Math.round(this.items[index].amount * (this.sliderNode as cc.Node).getComponent(cc.Slider).progress)).toString());
                                        });
                                        this.removeItem(this.items[index].itemName, (Math.round(this.items[index].amount * (this.sliderNode as cc.Node).getComponent(cc.Slider).progress)).toString());
                                    }
                                }
                            }
                            else {                            
                            }
                        }
                        else {
                            this.selectedItemIndex = index;
                        }
                        */
                        }

                    }.bind(this, index));

                }
                else {
                    cc.log("Failed to add child with name " + this.items[i].itemName);
                }

            }

            else {
                //cc.log("item at " + i + " is null");
            }
        }
    }

    onSliderSlide() {
        if (this.sliderNode != null) {
            if (this.otherInventory != null && this.items[this.itemMoveSelectedItemIndex] != null) {
                this.sliderNode.getChildByName("item_slider_amount").getComponent(cc.Label).string = (Math.round(this.items[this.itemMoveSelectedItemIndex].amount * (this.sliderNode as cc.Node).getComponent(cc.Slider).progress)).toString();
            }
            else if (this.items[this.selectedItemIndex] != null) {
                this.sliderNode.getChildByName("item_slider_amount").getComponent(cc.Label).string = (Math.round(this.items[this.selectedItemIndex].amount * (this.sliderNode as cc.Node).getComponent(cc.Slider).progress)).toString();
            }
        }
    }

    onOtherInvSliderSlide() {
        if (this.otherSlider != null) {
            if (this.otherInventory != null && this.otherInventory.items[this.otherInventory.itemMoveSelectedItemIndex] != null) {
                this.otherSlider.getChildByName("item_slider_amount").getComponent(cc.Label).string = (Math.round(this.otherInventory.items[this.otherInventory.itemMoveSelectedItemIndex].amount * (this.otherSlider as cc.Node).getComponent(cc.Slider).progress)).toString();
            }
        }
    }

    itemMoveToTheInventory() {
        //if (this.otherInventory != null && this.sliderNode != null && !(this.otherInventory instanceof ItemSeller)) {
        //    if (this.otherInventory instanceof ItemBuyer) {
        //        this.otherInventory.addItem(this.items[this.itemMoveSelectedItemIndex].itemName, Math.round(this.items[this.itemMoveSelectedItemIndex].amount * (this.sliderNode as cc.Node).getComponent(cc.Slider).progress));
        //        this.removeItem(this.items[this.itemMoveSelectedItemIndex].itemName, Math.round(this.items[this.itemMoveSelectedItemIndex].amount * (this.sliderNode as cc.Node).getComponent(cc.Slider).progress));

        //        this.addItem((this.otherInventory as ItemBuyer).moneyItemName, (this.items[this.itemMoveSelectedItemIndex] as Item).value);
        //        this.otherInventory.removeItem((this.otherInventory as ItemBuyer).moneyItemName, (this.items[this.itemMoveSelectedItemIndex] as Item).value);
        //    }
        //    else {
        //        this.otherInventory.addItem(this.items[this.itemMoveSelectedItemIndex].itemName, Math.round(this.items[this.itemMoveSelectedItemIndex].amount * (this.sliderNode as cc.Node).getComponent(cc.Slider).progress));
        //        this.removeItem(this.items[this.itemMoveSelectedItemIndex].itemName, Math.round(this.items[this.itemMoveSelectedItemIndex].amount * (this.sliderNode as cc.Node).getComponent(cc.Slider).progress));
        //    }
        //}

        if (this.otherInventory != null && this.sliderNode != null) {

            if (this.otherInventory._inventoryMovingType == InventoryMovingType.Both) {
                this.otherInventory.addItem(this.items[this.itemMoveSelectedItemIndex].itemName, Math.round(this.items[this.itemMoveSelectedItemIndex].amount * (this.sliderNode as cc.Node).getComponent(cc.Slider).progress));
                this.removeItem(this.items[this.itemMoveSelectedItemIndex].itemName, Math.round(this.items[this.itemMoveSelectedItemIndex].amount * (this.sliderNode as cc.Node).getComponent(cc.Slider).progress));
            }
            else if (this.otherInventory._inventoryMovingType == InventoryMovingType.InOnly) {
                //means it is buyer

                this.otherInventory.addItem(this.items[this.itemMoveSelectedItemIndex].itemName, Math.round(this.items[this.itemMoveSelectedItemIndex].amount * (this.sliderNode as cc.Node).getComponent(cc.Slider).progress));
                this.removeItem(this.items[this.itemMoveSelectedItemIndex].itemName, Math.round(this.items[this.itemMoveSelectedItemIndex].amount * (this.sliderNode as cc.Node).getComponent(cc.Slider).progress));

                this.addItem((this.otherInventory as ItemBuyer).moneyItemName, (this.items[this.itemMoveSelectedItemIndex] as Item).value * Math.round(this.items[this.itemMoveSelectedItemIndex].amount * (this.sliderNode as cc.Node).getComponent(cc.Slider).progress));
                this.otherInventory.removeItem((this.otherInventory as ItemBuyer).moneyItemName, (this.items[this.itemMoveSelectedItemIndex] as Item).value * Math.round(this.items[this.itemMoveSelectedItemIndex].amount * (this.sliderNode as cc.Node).getComponent(cc.Slider).progress));
            }
            else if (this.otherInventory._inventoryMovingType == InventoryMovingType.OutOnly) {}
        }
    }

    /**Button using this callback is located in host inventry(the that opened) */
    otherInvItemMoveToTheInventory() {

        if (this.otherInventory != null && this.otherSlider != null) {

            if (this.otherInventory._inventoryMovingType == InventoryMovingType.Both) {
                this.addItem(this.otherInventory.items[this.otherInventory.itemMoveSelectedItemIndex].itemName, Math.round(this.otherInventory.items[this.otherInventory.itemMoveSelectedItemIndex].amount * (this.otherSlider as cc.Node).getComponent(cc.Slider).progress));
                this.otherInventory.removeItem(this.otherInventory.items[this.otherInventory.itemMoveSelectedItemIndex].itemName, Math.round(this.otherInventory.items[this.otherInventory.itemMoveSelectedItemIndex].amount * (this.otherSlider as cc.Node).getComponent(cc.Slider).progress));

                this.otherInventory.refreshAsOtherInv(this.otherInventoryNode, this.otherSlider);
            }
        }
    }

    update(dt) {
        for (let i: number = 0; i < this.items.length; i++) {
            if (this.items[i] != null) {

                this.items[i].manualUpdate(dt);
                if (this.activated == true) {
                    if (this.selectedItemIndex == i) {
                        (this.inventoryNode.getComponent(cc.ScrollView).content.getChildByName(this.items[i].itemName).getChildByName(this.items[i].itemName + "_background") as cc.Node).color = cc.Color.RED;
                    }
                    else if (this.itemMoveSelectedItemIndex == i && this.otherInventory != null) {
                        (this.inventoryNode.getComponent(cc.ScrollView).content.getChildByName(this.items[i].itemName).getChildByName(this.items[i].itemName + "_background") as cc.Node).color = cc.Color.RED;
                    }
                    else {
                        (this.inventoryNode.getComponent(cc.ScrollView).content.getChildByName(this.items[i].itemName).getChildByName(this.items[i].itemName + "_background") as cc.Node).color = cc.Color.WHITE;
                    }
                }
            }
        }
    }
}
