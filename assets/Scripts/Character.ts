import Weapon from "./Weapon";
import ElevatorTrigger from "./ElevatorTrigger";
import UsableObject from "./UsableObject";
import Item from "./Item/Item";
import ObjectWithInventory from "./InventorySystem/ObjectWithInventory";
import ItemData from "./InventorySystem/ObjectWithInventory";

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
export default class Character extends cc.Component {
   // @property(cc.RigidBody)
    rigidBody: cc.RigidBody = null;

    @property
    cameraName: string = 'mainCamera';

    /**
     current weapon node
     Used to draw weapon in world
     */
    protected weaponNode: cc.Node = null;

    /**
     array of weapons that is used for storing info
     TODO: REPLACE WITH "ITEM" ARRAY
     */
    weapons: [Weapon] = [null];

    //items: [Item] = [null];

    protected currentWeaponId: number = 1;
    @property({
        type: [cc.AudioClip]
    })
    sound: [cc.AudioClip] = [null];

    collidingNodes: [cc.Node] = [null];

    //parent node used to display inventory
    //inventoryNode: cc.Node = null;

    //nodes that are use to display inventory items
    itemNodes: [cc.Node] = [null];



    //Audio: cc.AudioClip = null;

    //movement

    movingLeft: boolean = false;

    movingRight: boolean = false;

    useKeyPressed: boolean = false;


    // LIFE-CYCLE CALLBACKS:


    onLoad() {
        if (cc.director.getPhysicsManager().enabled != true) { cc.director.getPhysicsManager().enabled = true; }

        this.rigidBody = this.node.getComponent(cc.RigidBody);
        if (this.weaponNode == null && this.weapons != null) {

            //create node for displaying weapon
            this.weaponNode = new cc.Node("weaponNode");
            this.weaponNode.addComponent(cc.Sprite);
            if (this.currentWeaponId < this.weapons.length) {
                if (this.weapons[this.currentWeaponId] != null) {
                    this.weaponNode.getComponent(cc.Sprite).spriteFrame = this.weapons[this.currentWeaponId].weaponSprire;
                }
            }
            this.weaponNode.parent = this.node;
        }

        //var url = cc.url.raw('resources/DataTabels/items.json')
        //cc.loader.load(url, function (err, itemArray) {

        //    cc.log(JSON.stringify(itemArray));
        //    for (var i: number = 0; i < Object.keys(itemArray["json"]["items"]).length; i++) {
        //        const name = itemArray["json"]["items"][i]["name"];
        //        const weight = itemArray["json"]["items"][i]["weight"];
        //        var item = new Item();
        //        item.itemName = name;
        //        item.weight = weight;
        //        this.items.push(item);
        //    }

        //}.bind(this));

        //if (this.node.getComponent(ObjectWithInventory) != null) {
        //    if (this.node.getComponent(ObjectWithInventory).inventoryNode == null && this.node.getChildByName("inventory") != null) {
        //        this.node.getComponent(ObjectWithInventory).inventoryNode = this.node.getChildByName("inventory");
        //        this.inventoryNode = this.node.getComponent(ObjectWithInventory).inventoryNode;
        //    }
        //}
        //else {
        //    this.inventoryNode = this.node.getChildByName("inventory");
        //} 
       /// this.inventoryNode = this.node.getComponent(ObjectWithInventory).inventoryNode;
    }

    start() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

    }

    jump(): void {
        this.rigidBody.applyLinearImpulse(cc.v2(0, 2000), cc.v2(this.node.getPosition().x + 10, this.node.getPosition().y + 78), true);
    }

    onKeyUp(_event: cc.Event.EventKeyboard) {
        if (_event.keyCode == cc.macro.KEY.a) {
            this.rigidBody.linearVelocity.x = 0;
            this.movingLeft = false;
        }

        else if (_event.keyCode == cc.macro.KEY.d) {
            this.rigidBody.linearVelocity.x = 0;
            this.movingRight = false;
        }
        else if (_event.keyCode == cc.macro.KEY.e) {
            if (this.useKeyPressed) {

                this.useKeyPressed = false;
            }

        }
        else if (_event.keyCode == cc.macro.KEY.tab) {

            this.node.getComponent(ObjectWithInventory).deactivateInventory();
        }
       
    }



    onKeyDown(_event: cc.Event.EventKeyboard) {
        if (_event.keyCode == cc.macro.KEY.w) {
            if (this.isOnTheGround() == true) { this.jump(); }
            this.jump();
        }
        else if (_event.keyCode == cc.macro.KEY.a) {
            this.movingLeft = true;
        }

        else if (_event.keyCode == cc.macro.KEY.d) {
            this.movingRight = true;
        }

        else if (_event.keyCode == cc.macro.KEY.e) {
            if (!this.useKeyPressed) {
                for (var i = 0; i < this.collidingNodes.length; i++) {
                    if (this.collidingNodes[i] != null) {
                        if (this.collidingNodes[i].getComponent(UsableObject) != null) {
                            this.collidingNodes[i].getComponent(UsableObject).beUsed();
                        }
                    }
                }
                this.useKeyPressed = true;
            }

        }

        else if (_event.keyCode == cc.macro.KEY.r) {
            //if (this.node.getComponent(dragonBones.ArmatureDisplay) != null) { this.node.getComponent(dragonBones.ArmatureDisplay).playAnimation("newAnimtion", 10); }
            if (this.weaponNode == null && this.weapons != null) {

                //create node for displaying weapon
                this.weaponNode = new cc.Node("weaponNode");
                this.weaponNode.addComponent(cc.Sprite);
                if (this.currentWeaponId < this.weapons.length) {
                    if (this.weapons[this.currentWeaponId] != null) {
                        this.weaponNode.getComponent(cc.Sprite).spriteFrame = this.weapons[this.currentWeaponId].weaponSprire;
                    }
                }
                this.weaponNode.parent = this.node;
            }
            else {
                if (this.currentWeaponId < this.weapons.length) {
                    if (this.weapons[this.currentWeaponId] != null) {
                        this.weaponNode.getComponent(cc.Sprite).spriteFrame = this.weapons[this.currentWeaponId].weaponSprire;
                        cc.log(this.weapons[this.currentWeaponId].WeaponName);
                    }

                    else {
                        cc.log(this.currentWeaponId + "is null");
                    }
                }
                else {
                    cc.log(this.currentWeaponId + "doesn't exist");
                }
            }
        }

        else if (_event.keyCode == cc.macro.KEY.t) {
            //if (this.node.getComponent(dragonBones.ArmatureDisplay) != null) { this.node.getComponent(dragonBones.ArmatureDisplay).playAnimation("newAnimtion", 10); }
            cc.sys.localStorage['player'] = JSON.stringify({ g: this.node.getPosition().y });
        }

        else if (_event.keyCode == cc.macro.KEY.y) {
            //if (this.node.getComponent(dragonBones.ArmatureDisplay) != null) { this.node.getComponent(dragonBones.ArmatureDisplay).playAnimation("newAnimtion", 10); }
            //this.node.position.y = JSON.parse(cc.sys.localStorage['player']).g;
            for (let i: number = 0; i < this.node.getComponent(ObjectWithInventory).items.length; i++) {
                if (this.node.getComponent(ObjectWithInventory).items[i] != null) {
                    cc.log(this.node.getComponent(ObjectWithInventory).items[i].itemName + " (" + this.node.getComponent(ObjectWithInventory).items[i].amount + ")");
                }
            }
        }
        else if (_event.keyCode == cc.macro.KEY.l) {
           // this.node.getComponent(ObjectWithInventory).removeItem("cup", 1);

            cc.director.getScene().getChildByName("Canvas").getChildByName(this.cameraName).setPosition(this.node.getPosition().sub(cc.director.getScene().getChildByName("Canvas").position));
            let armature: dragonBones.Armature = this.node.getComponent(dragonBones.ArmatureDisplay).armature();
           

            
        }

        else if (_event.keyCode == cc.macro.KEY.space) {
            cc.audioEngine.play(this.sound[0], false, 1);
            if (this.weaponNode != null && this.weapons != null) {
                if (this.currentWeaponId < this.weapons.length) {
                    if (this.weapons[this.currentWeaponId] != null) {

                        this.weapons[this.currentWeaponId].Fire(cc.v2(this.weaponNode.getPosition().x + this.node.getPosition().x, this.weaponNode.getPosition().y + this.node.getPosition().y), 0, this.node);
                    }
                }
            }
        }
        else if (_event.keyCode == cc.macro.KEY.tab) {
            //first item is always null
            this.node.getComponent(ObjectWithInventory).activateInventory();
           
           
        }
        if (this.movingLeft) {
            this.rigidBody.applyLinearImpulse(cc.v2(-500, 0), cc.v2(this.node.getPosition().x, this.node.getPosition().y), true);
        }
        if (this.movingRight) {
            this.rigidBody.applyLinearImpulse(cc.v2(500, 0), cc.v2(this.node.getPosition().x, this.node.getPosition().y), true);
        }

    }


    isOnTheGround(): boolean {
        if (cc.director.getPhysicsManager().enabled != true) { cc.director.getPhysicsManager().enabled = true; }
        if (this.node.getComponent(cc.PhysicsBoxCollider) != null) {
            var rayResult = cc.director.getPhysicsManager().rayCast(this.node.getPosition(), cc.v2(this.node.getPosition().x, this.node.getPosition().y + this.node.getComponent(cc.PhysicsBoxCollider).size.height - this.node.getComponent(cc.PhysicsBoxCollider).offset.y + 1), cc.RayCastType.Any);
        }
        else {

            var rayResult = cc.director.getPhysicsManager().rayCast(this.node.getPosition(), cc.v2(this.node.getPosition().x, this.node.getPosition().y + 1), cc.RayCastType.Any);
        }
        var rayResult = cc.director.getPhysicsManager().rayCast(this.node.getPosition(), cc.v2(this.node.getPosition().x, this.node.getPosition().y), cc.RayCastType.Any);

        for (var i = 0; i < rayResult.length; i++) {
            var collider = rayResult[i].collider;
            if (rayResult[i].collider.body != null) { return true; }
        }
        return false;
    }

    // will be called once when two colliders begin to contact
    onBeginContact(contact, selfCollider, otherCollider) {
        if (otherCollider.node.getComponent(Weapon) != null) {
            this.weapons.push(otherCollider.node.getComponent(Weapon));
            cc.log(otherCollider.node.getComponent(Weapon).AmmoLeftInTheClip);
            cc.log(otherCollider.node.getComponent(Weapon).AmmoPerClip);
            cc.log(otherCollider.node.getComponent(Weapon).WeaponName);

            var id = this.weapons.push(new Weapon()) - 1;
            this.weapons[id].WeaponName = otherCollider.node.getComponent(Weapon).WeaponName;
            this.weapons[id].AmmoLeftInTheClip = otherCollider.node.getComponent(Weapon).AmmoLeftInTheClip;
            this.weapons[id].AmmoPerClip = otherCollider.node.getComponent(Weapon).AmmoPerClip;

            // otherCollider.node.destroy();
        }
        else if (otherCollider.node.getComponent(UsableObject) != null) {
            var shouldAdd: boolean = true;
            for (var i: number = 0; i < this.collidingNodes.length; i++) {
                if (this.collidingNodes[i] == otherCollider.node) {
                    shouldAdd = false;
                }
            }
            if (shouldAdd) { this.collidingNodes.push(otherCollider.node); }
        }
        else if (otherCollider.node.getComponent(Item) != null) {
            this.getComponent(ObjectWithInventory).addItem(otherCollider.node.getComponent(Item).itemName, otherCollider.node.getComponent(Item).amount);
            otherCollider.node.destroy();
        }
    }

    // will be called once when the contact between two colliders just about to end.
    onEndContact(contact, selfCollider, otherCollider) {
        if (otherCollider.node.getComponent(UsableObject) != null) {

            for (var i: number = 0; i < this.collidingNodes.length; i++) {
                if (this.collidingNodes[i] == otherCollider.node) {
                    this.collidingNodes.splice(i, 1);

                }
            }
        }
    }

    // will be called everytime collider contact should be resolved
    onPreSolve(contact, selfCollider, otherCollider) {
    }

    // will be called every time collider contact is resolved
    onPostSolve(contact, selfCollider, otherCollider) {
    }



    update(dt) {

        cc.director.getScene().getChildByName("Canvas").getChildByName(this.cameraName).setPosition(this.node.getPosition().sub(cc.director.getScene().getChildByName("Canvas").position));
        let armature: dragonBones.Armature = this.node.getComponent(dragonBones.ArmatureDisplay).armature();
        let pos: cc.Vec2 = cc.v2(armature.getBone("hand_right").global.x, -armature.getBone("hand_right").global.y);
       
        this.weaponNode.setPosition(pos);

        armature.getBone("shoulder_right").offset.rotation = Math.PI;
        
        //if (this.items.length - 1 != this.inventoryNode.getComponent(cc.ScrollView).content.childrenCount) {
        //    for (var i: number = 1; i < this.items.length; i++) {
        //        if (this.items[i] != null) {

        //            this.inventoryNode.getComponent(cc.ScrollView).content.addChild(new cc.Node(this.items[i].itemName));
        //            this.inventoryNode.getComponent(cc.ScrollView).content.getChildByName(this.items[i].itemName).addComponent(cc.Label);
        //            this.inventoryNode.getComponent(cc.ScrollView).content.getChildByName(this.items[i].itemName).getComponent(cc.Label).horizontalAlign = cc.Label.HorizontalAlign.LEFT;
        //            this.inventoryNode.getComponent(cc.ScrollView).content.getChildByName(this.items[i].itemName).getComponent(cc.Label).string = this.items[i].itemName;
        //            this.inventoryNode.getComponent(cc.ScrollView).content.getChildByName(this.items[i].itemName).setPosition(this.inventoryNode.getChildByName("view").getChildByName("content").getChildByName(this.items[i].itemName).getPosition().x, - i * 35);

        //        }
        //        else {
        //            alert("item at " + i + " is null");
        //        }
        //    }
        //}
    }
}