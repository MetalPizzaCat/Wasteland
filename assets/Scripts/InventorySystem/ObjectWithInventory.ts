import Item from "../Item/Item";
import ItemSoundDataScript from "./ItemSoundData";

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
    amount: number = 0;
}


@ccclass
export default class ObjectWithInventory extends cc.Component {
    @property([ItemData])
    itemsData: [ItemData] = [null];


    items: [Item] = [null];

    @property(cc.Node)
    itemSoundDataNode: cc.Node = null;

    //parent node used to display inventory
    @property(cc.Node)
    inventoryNode: cc.Node = null;

    @property(cc.SpriteFrame)
    itemButtonPressed: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    itemButtonHovered: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    itemButtonDefault: cc.SpriteFrame = null;

    activated: boolean = false;
    // LIFE-CYCLE CALLBACKS:

    itemDataTable;

    onLoad() {
        for (var i: number = 0; i < this.itemsData.length; i++) {
            if (this.itemsData[i] != null) {
                var item = new Item();
                item.itemName = this.itemsData[i].name;
                item.amount = this.itemsData[i].amount;
                this.items.push(item);
            }
        }
        cc.log(this.items.length);
        var url = cc.url.raw('resources/DataTabels/items.json')
        cc.loader.load(url, function (err, itemArray) {

            cc.log(this.items.length);
            for (var i: number = 1; i < this.items.length; i++) {
                this.items[i].loadDataForItem(itemArray);
            }
            this.itemDataTable = itemArray;
        }.bind(this));

        if (this.itemSoundDataNode == null || this.itemSoundDataNode.getComponent(ItemSoundDataScript) == null) { alert("There must be itemSoundDataNode with ItemSoundDataScript comonent"); close(); }
    }

    start() {
       
    }

    itemButtonCallback(event, customEventData) {
        this.addItem(customEventData, 1);
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
            for (let i: number = 1; i < this.items.length; i++) {
                if (this.items[i].itemName == name) {
                    this.items[i].amount += amount;
                    this.refreshInventoryNode();
                    return;
                }
            }
            let it = new Item();
            it.itemName = name;
            it.amount = amount;
            if (this.itemDataTable != null) {
                if (!it.loadDataForItem(this.itemDataTable)) {
                    cc.log("Failed to load item");
                }
                else {
                    this.items.push(it);
                    this.refreshInventoryNode();
                    return;
                }
            }
            else {
                cc.log("it didn't work");
            }
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
            }

            this.inventoryNode.active = true;
            this.activated = true;
        }
        else if (this.inventoryNode == null) {
            throw new Error("Failed to find inventory node");
            close();
        }
    }

    deactivateInventory() {
        if (this.inventoryNode != null && this.activated) {
            this.inventoryNode.active = false;
            this.activated = false;
        }
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
                    this.inventoryNode.getComponent(cc.ScrollView).content.getChildByName(this.items[i].itemName).getChildByName(this.items[i].itemName + "_background").getComponent(cc.Label).string = this.items[i].itemName + "(" + this.items[i].amount + ")";
                    this.inventoryNode.getComponent(cc.ScrollView).content.getChildByName(this.items[i].itemName).setPosition(this.inventoryNode.getComponent(cc.ScrollView).content.getChildByName(this.items[i].itemName).getPosition().x, - i * 35);
                    this.inventoryNode.getComponent(cc.ScrollView).content.getChildByName(this.items[i].itemName).getChildByName(this.items[i].itemName + "_background").getComponent(cc.Label).fontSize = 24;
                    // cc.log("supposed name " + this.items[i].itemName + " result name " + this.inventoryNode.getComponent(cc.ScrollView).content.getChildByName(this.items[i].itemName).getComponent(cc.Label).string);

                    this.inventoryNode.getComponent(cc.ScrollView).content.getChildByName(this.items[i].itemName).getComponent(cc.Button).clickEvents.push(clickEventHandler);

                    this.inventoryNode.getComponent(cc.ScrollView).content.getChildByName(this.items[i].itemName).getChildByName(this.items[i].itemName + "_background").on('mousedown', function (event) {

                        

                        let itemNode = new cc.Node(this.items[index].itemName);
                        itemNode.addComponent(Item);
                        itemNode.getComponent(Item).itemName = this.items[index].itemName;
                        itemNode.getComponent(Item).amount = 1;
                        itemNode.addComponent(cc.Sprite); 
                        itemNode.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.items[index].imageName);
                        itemNode.addComponent(cc.RigidBody);
                        itemNode.addComponent(cc.PhysicsBoxCollider);

                        itemNode.parent = cc.director.getScene();
                        itemNode.setPosition(this.node.getPosition().add(cc.v2(100, 0)));
                        itemNode.getComponent(cc.PhysicsBoxCollider).size = cc.size(itemNode.getComponent(cc.Sprite).spriteFrame.getOriginalSize().width, itemNode.getComponent(cc.Sprite).spriteFrame.getOriginalSize().height);
                        itemNode.getComponent(cc.PhysicsBoxCollider).apply();

                        this.removeItem(this.items[index].itemName, 1);

                        for (let i: number = 0; i < this.itemSoundDataNode.getComponent(ItemSoundDataScript).sounds.length; i++) {
                            if (this.itemSoundDataNode.getComponent(ItemSoundDataScript).sounds[i].name == this.items[index].itemName) {
                                cc.audioEngine.play(this.itemSoundDataNode.getComponent(ItemSoundDataScript).sounds[i].dropSound[0], false, 1);
                            }
                        }
                       
                    }.bind(this, index));
                    
                }
                else {
                    cc.log("Failed to add child with name " + this.items[i].itemName);
                }

            }
            else {
                cc.log("item at " + i + " is null");
            }
        }
    }

    update(dt) {

    }
}
