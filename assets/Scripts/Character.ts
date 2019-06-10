import Weapon from "./WeaponSystem/Weapon";
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


    @property(cc.Node)
    cameraNode: cc.Node = null;

    @property(cc.Node)
    primaryAmmoLeftinTheClipNode: cc.Node = null;

    @property(cc.Node)
    primaryAmmoLeftTotalNode: cc.Node = null;

    @property(cc.Node)
    healthNode: cc.Node = null;

    @property
    health: number = 100;

    @property
    dead: boolean = false;

    /**
     current weapon node
     Used to draw weapon in world
     */
    protected weaponNode: cc.Node = null;

    /**
     array of weapons that is used for storing info
     TODO: REPLACE WITH "ITEM" ARRAY
     */
    weapon: Weapon = null;

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

    dropButtonCallback(event, customEventData) {
        if (this.weaponNode != null) {
            //if item that was selected is being droped we set this.weapon to null
            if (this.getComponent(ObjectWithInventory).items[this.getComponent(ObjectWithInventory).selectedItemIndex].itemName == this.weapon.itemName) {
                this.weapon = null;
                this.weaponNode.getComponent(cc.Sprite).spriteFrame = null;
            }
        }
    }

    // LIFE-CYCLE CALLBACKS:
    selectWeaponButtonCallback(event, customEventData) {
        
        if (this.getComponent(ObjectWithInventory).items[this.getComponent(ObjectWithInventory).selectedItemIndex].type == "Weapon") {
            this.weapon = this.getComponent(ObjectWithInventory).items[this.getComponent(ObjectWithInventory).selectedItemIndex] as Weapon;

            if (this.weaponNode == null) {

                //create node for displaying weapon
                this.weaponNode = new cc.Node("weaponNode");
                this.weaponNode.addComponent(cc.Sprite);
                this.weaponNode.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.getComponent(ObjectWithInventory).items[this.getComponent(ObjectWithInventory).selectedItemIndex].imageName);
                this.weaponNode.parent = this.node;
            }
            else {

                this.weaponNode.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.getComponent(ObjectWithInventory).items[this.getComponent(ObjectWithInventory).selectedItemIndex].imageName);
            }
            
        }
    }

    onLoad() {
        if (cc.director.getPhysicsManager().enabled != true) { cc.director.getPhysicsManager().enabled = true; }

        this.rigidBody = this.node.getComponent(cc.RigidBody);
    }

    start() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

        //temp solution 
        //Result one must have Canvas node be chosable like node from scene
        cc.director.getScene().getChildByName("Canvas").on('mousemove', this.onMouseMove, this);

        cc.director.getScene().getChildByName("Canvas").on('mousedown', this.onMouseDown, this);

        this.node.on('damage', this.onDamage, this);
    }

    jump(): void {
        this.rigidBody.applyLinearImpulse(cc.v2(0, 2000), cc.v2(this.node.getPosition().x + 10, this.node.getPosition().y + 78), true);
    }

    onMouseDown(event: cc.Event.EventMouse) {
        if (this.weaponNode != null && this.weapon != null) {

            this.weapon.Fire(cc.v2(this.weaponNode.getPosition().x + this.node.getPosition().x+100, this.weaponNode.getPosition().y + this.node.getPosition().y), 0, this.node);
        }
    }

    onMouseMove(event: cc.Event.EventMouse) {
        
        let armature: dragonBones.Armature = this.node.getComponent(dragonBones.ArmatureDisplay).armature();
        let pos: cc.Vec2 = cc.v2(armature.getBone("hand_right").global.x, -armature.getBone("hand_right").global.y);
        

      
        let angle = Math.atan2(event.getLocation().y - this.node.getPosition().y, event.getLocation().x - this.node.getPosition().x);
        armature.getBone("neck").offset.rotation = angle;
        
        if (this.weaponNode != null) {
            this.weaponNode.setPosition(pos);
            
            this.weaponNode.angle = angle;
        }

        
       
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
                            for (let u: number = 0; u < this.collidingNodes[i].getComponents(UsableObject).length; u++) {
                                this.collidingNodes[i].getComponents(UsableObject)[u].beUsed(this.node);
                            }
                        }
                    }
                }
                this.useKeyPressed = true;
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

            this.node.emit('damage', this, 10);



        }
        else if (_event.keyCode == cc.macro.KEY.r) {
            if (this.weapon.PrimaryAmmoLeftInTheClip != this.weapon.PrimaryAmmoPerClip) {
                this.weapon.primaryReload(this.node);
            }
        }
        else if (_event.keyCode == cc.macro.KEY.space) {
           // cc.audioEngine.play(this.sound[0], false, 1);
            if (this.weaponNode != null && this.weapon != null) {

                this.weapon.Fire(cc.v2(this.weaponNode.getPosition().x + this.node.getPosition().x, this.weaponNode.getPosition().y + this.node.getPosition().y), 0, this.node);
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
        if (otherCollider.node.getComponent(Weapon) != null && otherCollider.node.getComponent(Weapon).canBePickedUp) {

            this.getComponent(ObjectWithInventory).addItem(otherCollider.node.getComponent(Weapon).itemName, otherCollider.node.getComponent(Weapon).amount);
            otherCollider.node.destroy();
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
        else if (otherCollider.node.getComponent(Item) != null && otherCollider.node.getComponent(Item).canBePickedUp) {
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

    onDamage(damager: cc.Node, amount: number): void {
        
        this.health -= amount;
        if (this.health < 0) { this.health = 0; this.dead = true; }
    }

    update(dt) {
        
        //cc.director.getScene().getChildByName("Canvas").getChildByName(this.cameraName).setPosition(this.node.getPosition().sub(cc.director.getScene().getChildByName("Canvas").position));
        if (this.cameraNode != null) {
            this.cameraNode.setPosition(this.node.getPosition().sub(cc.director.getScene().getChildByName("Canvas").position));
        }
        else if (cc.director.getScene().getChildByName("Canvas").getChildByName(this.cameraName) != null) {
            cc.director.getScene().getChildByName("Canvas").getChildByName(this.cameraName).setPosition(this.node.getPosition().sub(cc.director.getScene().getChildByName("Canvas").position));
        }

        if (this.primaryAmmoLeftinTheClipNode != null) {
            if (this.primaryAmmoLeftinTheClipNode.getComponent(cc.Label) != null) {
                if (this.weapon != null) {
                    this.primaryAmmoLeftinTheClipNode.getComponent(cc.Label).string = this.weapon.PrimaryAmmoLeftInTheClip.toString();
                }
            }
        }

        if (this.healthNode != null) {
            if (this.healthNode.getComponent(cc.Label) != null) {
                this.healthNode.getComponent(cc.Label).string = this.health.toString();
            }
        }

        if (this.primaryAmmoLeftTotalNode != null) {
            if (this.primaryAmmoLeftTotalNode.getComponent(cc.Label) != null) {
                if (this.weapon != null) {
                    if (this.node.getComponent(ObjectWithInventory) != null) {
                        for (let i: number = 0; i < this.node.getComponent(ObjectWithInventory).items.length; i++) {
                            if (this.node.getComponent(ObjectWithInventory).items[i] != null) {
                                if (this.node.getComponent(ObjectWithInventory).items[i].itemName == this.weapon.primaryAmmoType) {
                                    this.primaryAmmoLeftTotalNode.getComponent(cc.Label).string = this.node.getComponent(ObjectWithInventory).items[i].amount.toString();
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}