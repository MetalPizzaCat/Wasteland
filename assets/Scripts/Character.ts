import Weapon from "./Weapon";
import ElevatorTrigger from "./ElevatorTrigger";
import UsableObject from "./UsableObject";
import Item from "./Item/Item";

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
    @property(cc.RigidBody)
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

    items: [Item] = [null];

    protected currentWeaponId: number = 1;
    @property({
        type: [cc.AudioClip]
    })
    sound: [cc.AudioClip] = [null];

    collidingNodes: [cc.Node] = [null];

    //Audio: cc.AudioClip = null;

    //movement

    movingLeft: boolean = false;

    movingRight: boolean = false;

    useKeyPressed: boolean = false;

    // LIFE-CYCLE CALLBACKS:

    loadJSON(err,res): void {
        cc.log('err[' + err + '] result: ' + JSON.stringify(res));
        cc.log(this.weapons[0].WeaponName);
    }

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
    }
    start() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

        cc.log(this.items.length);
        for (var i: number = 0; i < this.items.length; i++) {
            if (this.items[i] != null) {
                cc.log(this.items[i].itemName);
            }
            else {
                cc.log("this.items[" + i + "] is null");
            }
        }

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
            this.node.position.y = JSON.parse(cc.sys.localStorage['player']).g;
        }
        else if (_event.keyCode == cc.macro.KEY.l)
        {
            cc.log(this.items.length);
            for (var i: number = 0; i < this.items.length; i++) {
                if (this.items[i] != null) {
                    cc.log(this.items[i].itemName);
                }
                else {
                    cc.log("this.items[" + i + "] is null");
                }
            }

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
        cc.director.getScene().getChildByName(this.cameraName).setPosition(this.node.getPosition());
        
    }
}