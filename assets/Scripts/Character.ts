import Weapon, { WeaponType } from "./WeaponSystem/Weapon";
//import WeaponType from "./WeaponSystem/Weapon"
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

export enum CrouchingMode {
    NotCrouching,
    Crouching,
    Sliding
}

@ccclass
export default class Character extends cc.Component {
   // @property(cc.RigidBody)
    rigidBody: cc.RigidBody = null;

    @property
    cameraName: string = 'mainCamera';

    @property(cc.Node)
    weaponSoundDataNode: cc.Node = null;

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

    crouchMode: CrouchingMode = CrouchingMode.NotCrouching;

    /**
     current weapon node
     Used to draw weapon in world
    TODO:TODO:
     */
    protected weaponNode: cc.Node = null;

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

    crouchButtonDown: boolean = false;

    isPaused: boolean = false;

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
           // this.getComponent(ObjectWithInventory).items[this.getComponent(ObjectWithInventory).selectedItemIndex].loadDataForItem(this.node.getComponent(ObjectWithInventory).itemDataTable);

            this.weapon = this.getComponent(ObjectWithInventory).items[this.getComponent(ObjectWithInventory).selectedItemIndex] as Weapon;
            this.weapon.loadDataForItem(this.node.getComponent(ObjectWithInventory).itemDataTable)
            this.weapon.weaponSoundDataNode = this.node.getComponent(ObjectWithInventory).itemSoundDataNode;
          
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

        this.node.on('secondaryendreload', this.onWeaponSecondaryFireEndReloading, this);

        this.node.on(' startcutscene', this.onCutsceneStart, this);

        this.node.on('primaryendreload', this.onWeaponPrimaryFireEndReloading, this);
    }

    jump(): void {
        if (this.isOnTheGround() && this.crouchMode != CrouchingMode.Sliding && this.crouchMode != CrouchingMode.Crouching) {
            this.rigidBody.applyLinearImpulse(cc.v2(0, 15000), cc.v2(this.node.getPosition().x + 10, this.node.getPosition().y + 78), true);

            if (Math.round(this.rigidBody.linearVelocity.x) == 0.0) {
               
                let armature: dragonBones.Armature = this.node.getComponent(dragonBones.ArmatureDisplay).armature();
                armature.animation.play("jump_up", 1);
            }
        }
    }

    crouch() {
        if (this.isOnTheGround() && this.crouchMode == CrouchingMode.NotCrouching/*you can not crouch if you already crouching*/) {
            if (Math.round(this.rigidBody.linearVelocity.x) == 0.0) {
                this.crouchMode = CrouchingMode.Crouching;
                (this.node.getComponent(dragonBones.ArmatureDisplay).armature() as dragonBones.Armature).animation.play("crouch_down", 1);
            }
            else {
                this.crouchMode = CrouchingMode.Sliding;
                (this.node.getComponent(dragonBones.ArmatureDisplay).armature() as dragonBones.Armature).animation.play("belly_sliding_start", 1);
            }
            if (!(this.node.getComponent(dragonBones.ArmatureDisplay).armature() as dragonBones.Armature).flipX) {
                //->

                if (this.getComponent(cc.PhysicsBoxCollider) != null) {

                    this.getComponent(cc.PhysicsBoxCollider).offset.x = 71;
                    this.getComponent(cc.PhysicsBoxCollider).offset.y = 54;
                    this.getComponent(cc.PhysicsBoxCollider).size.height = 100;
                    this.getComponent(cc.PhysicsBoxCollider).size.width = 145;
                    this.getComponent(cc.PhysicsBoxCollider).apply();
                }
            }
            else {

                //<-
                if (this.getComponent(cc.PhysicsBoxCollider) != null) {

                    this.getComponent(cc.PhysicsBoxCollider).offset.x = -71;
                    this.getComponent(cc.PhysicsBoxCollider).offset.y = 54;
                    this.getComponent(cc.PhysicsBoxCollider).size.height = 100;
                    this.getComponent(cc.PhysicsBoxCollider).size.width = 145;
                    this.getComponent(cc.PhysicsBoxCollider).apply();
                }
            }
        }
    }

    unCrouch() {
        this.crouchMode = CrouchingMode.NotCrouching;
        if (this.getComponent(cc.PhysicsBoxCollider) != null) {
            this.getComponent(cc.PhysicsBoxCollider).offset.x = 0;
            this.getComponent(cc.PhysicsBoxCollider).offset.y = 127;
            this.getComponent(cc.PhysicsBoxCollider).size.height = 145;
            this.getComponent(cc.PhysicsBoxCollider).size.width = 100;
            this.getComponent(cc.PhysicsBoxCollider).apply();
        }
    }

    onMouseDown(event: cc.Event.EventMouse) {
        if (this.weaponNode != null && this.weapon != null) {

            this.weapon.Fire(cc.v2(this.weaponNode.getPosition().x + this.node.getPosition().x+100, this.weaponNode.getPosition().y + this.node.getPosition().y), 0, this.node);
        }
    }

    onMouseMove(event: cc.Event.EventMouse) {
        
        let armature: dragonBones.Armature = this.node.getComponent(dragonBones.ArmatureDisplay).armature();
       // let pos: cc.Vec2 = cc.v2(armature.getBone("hand_right").global.x, -armature.getBone("hand_right").global.y);
        

      
        let angle = Math.atan2(event.getLocation().y - this.node.getPosition().y, event.getLocation().x - this.node.getPosition().x);
        armature.getBone("Body_3").offset.rotation = angle;
        
        if (this.weaponNode != null) {
           // this.weaponNode.setPosition(pos);
            
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
        else if (_event.keyCode == cc.macro.KEY.ctrl) {
            
        }
        else if (_event.keyCode == cc.macro.KEY.s) {
            this.crouchButtonDown = false;
            this.unCrouch();
        }
       
    }



    onKeyDown(_event: cc.Event.EventKeyboard) {
        if (_event.keyCode == cc.macro.KEY.w) {
            if (this.isOnTheGround() == true) { this.jump(); }
            
        }
        else if (_event.keyCode == cc.macro.KEY.a) {
            this.movingLeft = true;
        }

        else if (_event.keyCode == cc.macro.KEY.d) {
            this.movingRight = true;
        }
        else if (_event.keyCode == cc.macro.KEY.s) {
            this.crouchButtonDown = true;
            this.crouch();
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
            if (this.weapon.PrimaryAmmoLeftInTheClip != this.weapon.PrimaryAmmoPerClip && this.crouchMode != CrouchingMode.Sliding && this.isOnTheGround()) {
                this.weapon.primaryReload(this.node);

                let armature: dragonBones.Armature = this.node.getComponent(dragonBones.ArmatureDisplay).armature();
                if (this.crouchMode == CrouchingMode.Crouching) {
                    armature.animation.play("crouch_reload", 1);
                }
                else if (this.crouchMode == CrouchingMode.NotCrouching) {
                    if (Math.round(this.rigidBody.linearVelocity.x) != 0.0) {
                        armature.animation.play("run_reload",1);
                    }
                    else {
                        armature.animation.play("idle_reload",1);
                    }
                   
                }
                

                if (this.weapon.type == WeaponType.Melee) {
                    //armature.animation.play("nameofmeleereload");
                    cc.log("reload " + WeaponType.Melee);
                }

                else if (this.weapon.type == WeaponType.Pistol) {
                   // armature.animation.play("nameofPistolreload");
                    cc.log("reload " + WeaponType.Pistol);
                }

                else if (this.weapon.type == WeaponType.Rifle) {
                    //armature.animation.play("nameofRiflereload");
                    cc.log("reload " + WeaponType.Rifle);
                }

                else if (this.weapon.type == WeaponType.Shotgun) {
                   // armature.animation.play("nameofShotgunreload");
                    cc.log("reload " + WeaponType.Shotgun);
                }

            }
        }
        else if (_event.keyCode == cc.macro.KEY.space) {
           // cc.audioEngine.play(this.sound[0], false, 1);
            let armature: dragonBones.Armature = this.node.getComponent(dragonBones.ArmatureDisplay).armature();
           
            if (this.weaponNode != null && this.weapon != null) {        
                
                if (armature.flipX) {
                    if (this.weapon.Fire(cc.v2(armature.getBone("gun").global.x + this.node.getPosition().x - 20, -armature.getBone("gun").global.y + this.node.getPosition().y), 180, this.node)) {


                        if (Math.round(this.rigidBody.linearVelocity.x) != 0.0) {
                            if (this.crouchMode == CrouchingMode.Sliding) { armature.animation.play("belly_sliding_shooting", 1); }
                            else { armature.animation.play("run_shooting_forward", 1); }

                        }
                        else {
                            if (this.crouchMode == CrouchingMode.Crouching) { armature.animation.play("crouch_shooting", 1); }
                            { armature.animation.play("idle_shooting_forward", 1); }

                        }
                    }
                }
                else {
                    if (this.weapon.Fire(cc.v2(armature.getBone("gun").global.x + this.node.getPosition().x + 20, -armature.getBone("gun").global.y + this.node.getPosition().y), 0, this.node)) {


                        if (Math.round(this.rigidBody.linearVelocity.x) != 0.0) {
                            if (this.crouchMode == CrouchingMode.Sliding) { armature.animation.play("belly_sliding_shooting", 1); }
                            else { armature.animation.play("run_shooting_forward", 1); }

                        }
                        else {
                            if (this.crouchMode == CrouchingMode.Crouching) { armature.animation.play("crouch_shooting", 1); }
                            { armature.animation.play("idle_shooting_forward", 1); }

                        }
                    }
                }
            }


        }
    
        else if (_event.keyCode == cc.macro.KEY.tab) {
            //first item is always null
            this.node.getComponent(ObjectWithInventory).activateInventory();
           
           
        }
        if (this.movingLeft) {
            if (this.crouchMode != CrouchingMode.Crouching) {
                this.rigidBody.applyLinearImpulse(cc.v2(-2000 - this.rigidBody.linearVelocity.x, 0), cc.v2(this.node.getPosition().x, this.node.getPosition().y), true);
            }
        }
        if (this.movingRight) {
            if (this.crouchMode != CrouchingMode.Crouching) {
                this.rigidBody.applyLinearImpulse(cc.v2(2000 - this.rigidBody.linearVelocity.x, 0), cc.v2(this.node.getPosition().x, this.node.getPosition().y), true);
            }
        }

    }


    isOnTheGround(): boolean {
        if (cc.director.getPhysicsManager().enabled != true) { cc.director.getPhysicsManager().enabled = true; }
        if (this.node.getComponent(cc.PhysicsBoxCollider) != null) {
            let rayResult = cc.director.getPhysicsManager().rayCast(this.node.getPosition(), cc.v2(this.node.getPosition().x, this.node.getPosition().y - this.node.getComponent(cc.PhysicsBoxCollider).size.height + this.node.getComponent(cc.PhysicsBoxCollider).offset.y + 1), cc.RayCastType.Any);

            for (var i = 0; i < rayResult.length; i++) {
                var collider = rayResult[i].collider;
                if (rayResult[i].collider.body != null) { return true; }
            }
        }
        else {
            let rayResult = cc.director.getPhysicsManager().rayCast(this.node.getPosition(), cc.v2(this.node.getPosition().x, this.node.getPosition().y + 1), cc.RayCastType.Any);

            for (var i = 0; i < rayResult.length; i++) {
                var collider = rayResult[i].collider;
                if (rayResult[i].collider.body != null) { return true; }
            }
        }
        //var rayResult = cc.director.getPhysicsManager().rayCast(this.node.getPosition(), cc.v2(this.node.getPosition().x, this.node.getPosition().y), cc.RayCastType.Any);

       
        return false;
    }

    // will be called once when two colliders begin to contact
    onBeginContact(contact, selfCollider, otherCollider) {
        if (otherCollider.node.getComponent(Item) != null && otherCollider.node.getComponent(Item).canBePickedUp && cc.isValid(otherCollider.node)) {
            this.getComponent(ObjectWithInventory).addItem(otherCollider.node.getComponent(Item).itemName, otherCollider.node.getComponent(Item).amount);      
            otherCollider.node.destroy();
            otherCollider.destroy();
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

    onWeaponPrimaryFireEndReloading() {
    }

    onWeaponSecondaryFireEndReloading() { cc.log("Finished - Secondary");}

    onDamage(damager: cc.Node, amount: number): void {
        
        this.health -= amount;
        if (this.health < 0) { this.health = 0; this.dead = true; }
    }

    onCutsceneStart() {
        this.isPaused = true;
    }

    onCutsceneEnd() {

    }

    update(dt) {

        let armature: dragonBones.Armature = this.node.getComponent(dragonBones.ArmatureDisplay).armature();
        //let pos: cc.Vec2 = cc.v2(armature.getBone("hand_right").global.x, -armature.getBone("hand_right").global.y);

        //if (this.weaponNode != null) {
        //    this.weaponNode.setPosition(pos);
        //}

        //cc.director.getScene().getChildByName("Canvas").getChildByName(this.cameraName).setPosition(this.node.getPosition().sub(cc.director.getScene().getChildByName("Canvas").position));

        if (!this.isOnTheGround()) {
            if (!(armature.animation.lastAnimationName == "jump_up" && armature.animation.isPlaying) && armature.animation.lastAnimationName != "jump_fall") { armature.animation.play("jump_fall"); }
            if (this.crouchMode == CrouchingMode.Sliding || this.crouchMode == CrouchingMode.Crouching) {
                this.unCrouch();
            }
        }
        else if (this.getComponent(cc.RigidBody) != null && this.getComponent(dragonBones.ArmatureDisplay) != null) {
            if (this.crouchButtonDown) { this.crouch(); }
            if (Math.round(this.rigidBody.linearVelocity.x) != 0.0) {
                if (this.crouchMode == CrouchingMode.Sliding) {
                    if (!(armature.animation.lastAnimationName == "belly_sliding_shooting" && armature.animation.isPlaying) && armature.animation.lastAnimationName != "belly_sliding") { armature.animation.play("belly_sliding"); }
                }
                else {
                    if (!((armature.animation.lastAnimationName == "run_shooting_forward" || armature.animation.lastAnimationName == "run_reload") && armature.animation.isPlaying) && armature.animation.lastAnimationName != "run") { armature.animation.play("run"); }
                }

                if (this.getComponent(cc.RigidBody).linearVelocity.x > 0) {
                    armature.flipX = false;
                }
                else if (this.getComponent(cc.RigidBody).linearVelocity.x < 0) {
                    armature.flipX = true;
                }
            }
            else if (Math.round(this.rigidBody.linearVelocity.x) == 0.0) {
                if (this.crouchMode == CrouchingMode.Sliding) { this.crouchMode = CrouchingMode.Crouching }
                if (this.crouchMode == CrouchingMode.Crouching) {
                    if (!((armature.animation.lastAnimationName == "crouch_shooting" || armature.animation.lastAnimationName == "crouch_reload") && armature.animation.isPlaying) && armature.animation.lastAnimationName != "crouch_idle") { armature.animation.play("crouch_idle"); }
                }

                else {
                    if (!((armature.animation.lastAnimationName == "idle_shooting_forward" || armature.animation.lastAnimationName == "idle_reload") && armature.animation.isPlaying) && armature.animation.lastAnimationName != "idle") { armature.animation.play("idle"); }
                }
            }
        }

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