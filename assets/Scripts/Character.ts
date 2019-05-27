import Weapon from "./Weapon";
import ElevatorTrigger from "./ElevatorTrigger";
import UsableObject from "./UsableObject";

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

    protected currentWeaponId: number = 1;
    @property({
        type: [cc.AudioClip]
    })
    sound: [cc.AudioClip] = [null];

    collidingNodes: [cc.Node] = [null];

    //Audio: cc.AudioClip = null;



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
    }

    jump(): void {
        this.rigidBody.applyLinearImpulse(cc.v2(0, 2000), cc.v2(this.node.getPosition().x + 10, this.node.getPosition().y + 78), true);
    }

    onKeyDown(_event: cc.Event.EventKeyboard) {
        if (_event.keyCode == cc.macro.KEY.w) {
            if (this.isOnTheGround() == true) { this.jump(); }
            this.jump();
        }
        else if (_event.keyCode == cc.macro.KEY.a) {
            this.rigidBody.applyLinearImpulse(cc.v2(-500, 0), cc.v2(this.node.getPosition().x, this.node.getPosition().y), true);
        }

        else if (_event.keyCode == cc.macro.KEY.d) {
            this.rigidBody.applyLinearImpulse(cc.v2(500, 0), cc.v2(this.node.getPosition().x, this.node.getPosition().y), true);

        }
        else if (_event.keyCode == cc.macro.KEY.e) {
            for (var i = 0; i < this.collidingNodes.length; i++)
            {
                if (this.collidingNodes[i] != null) {
                    if (this.collidingNodes[i].getComponent(UsableObject) != null) {
                        this.collidingNodes[i].getComponent(UsableObject).beUsed();
                    }
                }
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
            cc.log(otherCollider.node.name);
            this.collidingNodes.push(otherCollider.node);
        }
    }

    // will be called once when the contact between two colliders just about to end.
    onEndContact(contact, selfCollider, otherCollider) {
        if (otherCollider.node.getComponent(UsableObject) != null) {
            //const id = this.collidingNodes.findIndex(otherCollider.node);

            for (var i: number = 0; i < this.collidingNodes.length; i++) {
                if (this.collidingNodes[i] == otherCollider.node) {
                        cc.log("ActoifffA");
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

    start() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);

    }

    // update (dt) {}
}