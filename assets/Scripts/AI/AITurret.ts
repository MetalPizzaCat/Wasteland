import Character from "./../Character";
import Weapon, { WeaponType } from "../WeaponSystem/Weapon";
import ObjectWithInventory from "../InventorySystem/ObjectWithInventory";

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


export enum CellingTurretState {
    OpenedIdle,
    Opening,

    ClosedIdle,
    Closing,

    Shooting,
    /**If turret is alive but is not suppoosed to work */
    Disabled
}

export enum CellingTurretWeaponType {
    Flametrower = 1,
    Minigun

}

@ccclass
export default class AITurret extends cc.Component {



    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    @property({ type: cc.Enum(CellingTurretState) })
    state: CellingTurretState = CellingTurretState.ClosedIdle;

    @property({ type: cc.Enum(CellingTurretWeaponType) })
    weaponType: CellingTurretWeaponType = CellingTurretWeaponType.Minigun;


    weaponName: string = "";

    @property({ tooltip: "use ammo from inventory or not" })
    infiteAmmo: boolean = false;

    @property(cc.Node)
    weaponSoundDataNode: cc.Node = null;

    @property({ min: 0.1, editorOnly: false/*, tooltip: "if no target was found during this period turret will deactivate. Once target will be found turret will ativate" */ })
    timeBeforeDeactivating: number = 1.0;

    @property({ editorOnly: false/*tooltip: "if this value is true and if no target was found during timeBeforeDeactivating period turret will be  deactivated. Once target will be found turret will ativate"*/ })
    deactivateOverTime: boolean = true;

    @property({
        type: cc.AudioClip
    })
    activateSound: cc.AudioClip = null;

    @property({
        type: cc.AudioClip
    })
    deactivateSound: cc.AudioClip = null;

    @property({
        type: cc.AudioClip
    })
    shootSound: cc.AudioClip = null;

    @property({
        type: cc.AudioClip
    })
    idleSound: cc.AudioClip = null;

    idleSoundId: number = 0;

    timeLeft: number = 0;

    target: cc.Node = null;

    weapon: Weapon = null;

    onLoad() {

    }
    start() {
        //cc.log("Deactivate over time " + this.timeBeforeDeactivating);

        let armature: dragonBones.Armature = this.getComponent(dragonBones.ArmatureDisplay).armature();
        armature.getSlot("carabine").displayIndex = this.weaponType;

        //dragonBones.CCFactory.prototype.replaceSlotDisplay()

        //armature.getSlot("carabine").

        
        cc.log(dragonBones.CCFactory.getInstance().replaceSlotDisplay("celling_turret", armature.name, "carabine", "minigun", armature.getSlot("carabine")));

        //dragonBones.CCFactory.prototype.getDragonBonesData

        cc.log(WeaponType[this.weaponType]);
        
        this.weapon = new Weapon();
        this.weapon.itemName = "Minigun";
        this.weapon.amount = 1;
        this.weapon.weaponSoundDataNode = this.weaponSoundDataNode;

        if (this.getComponent(ObjectWithInventory).itemDataTable != null) {
            if (!this.weapon.loadDataForItem(this.getComponent(ObjectWithInventory).itemDataTable)) {
                throw new Error("Failed to load data for turret's weapon");
            }
        }
        else {
            throw new Error("Item data in ObjectWithInventory component is null");
        }


        let wpn_node = new cc.Node();
        wpn_node.addComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.weapon.imageName);

        armature.getSlot("carabine").display = wpn_node;

        //armature.getSlot("carabine").display = new cc.SpriteFrame(this.weapon.imageName);

        this.node.on('usedbybutton', this.beUsedByButton, this);
        
    }

    activate() {
        if (this.state != CellingTurretState.OpenedIdle && this.state != CellingTurretState.Shooting && this.state != CellingTurretState.Disabled) {
            let armature: dragonBones.Armature = this.getComponent(dragonBones.ArmatureDisplay).armature();
            if (this.state == CellingTurretState.ClosedIdle) {
                this.state = CellingTurretState.Opening;
                armature.animation.play("open", 1);
                if (!this.infiteAmmo) {
                    for (let i: number = 0; i < this.getComponent(ObjectWithInventory).items.length; i++) {
                        if (this.getComponent(ObjectWithInventory).items[i] != null) {
                            if (this.getComponent(ObjectWithInventory).items[i].itemName == this.weapon.primaryAmmoType) {
                                this.weapon.PrimaryAmmoLeftInTheClip = this.getComponent(ObjectWithInventory).items[i].amount;
                            }
                        }
                    }
                }
                else {
                    this.weapon.PrimaryAmmoLeftInTheClip = Infinity;
                }
                cc.log(this.weapon.PrimaryAmmoLeftInTheClip);
                if (this.activateSound != null) {
                    cc.audioEngine.playEffect(this.activateSound, false);
                }
            }

        }
    }

    deactivate() {
        if (this.state != CellingTurretState.ClosedIdle && this.state != CellingTurretState.Disabled) {
            let armature: dragonBones.Armature = this.getComponent(dragonBones.ArmatureDisplay).armature();
            if (this.state == CellingTurretState.OpenedIdle) {
                this.state = CellingTurretState.Closing;
                armature.animation.play("close", 1);
                if (this.deactivateSound != null) {
                    cc.audioEngine.playEffect(this.deactivateSound, false);
                    cc.audioEngine.stop(this.idleSoundId);
                }
            }

        }
    }


    disable() {
        this.deactivate();
        this.state = CellingTurretState.Disabled;
    }

    enable() {

    }

    onBeginContact(contact, selfCollider, otherCollider) {
        if (this.state != CellingTurretState.Disabled) {
            if (otherCollider.node.getComponent(Character) != null) {
                this.target = otherCollider.node;
                if (this.canSeeTarget()) {
                    if (this.state != CellingTurretState.OpenedIdle) { this.timeLeft = 0.0; this.activate(); }
                }
                else {

                }
            }
        }
    }

    onEndContact(contact, selfCollider, otherCollider) {
        if (otherCollider.node == this.target) {
            this.target = null;
        }
    }

    beUsedByButton(node: cc.Node) {
        this.disable();
    }

    canSeeTarget(): boolean {
        if (this.target == null) { return false; }
        else {
            var rayResult = cc.director.getPhysicsManager().rayCast(this.node.getPosition(), this.target.getPosition(), cc.RayCastType.Any);
            for (let i: number = 0; i < rayResult.length; i++) {
                if (rayResult[i].collider.node == this.target) {
                    return true;
                }
            }
            return false;
        }
    }

    update(dt) {

        let armature: dragonBones.Armature = this.getComponent(dragonBones.ArmatureDisplay).armature();
        if (this.state != CellingTurretState.Disabled) {
            if (this.canSeeTarget()) {
                if (this.state != CellingTurretState.OpenedIdle && this.state != CellingTurretState.Shooting) { this.timeLeft = 0.0; this.activate(); }
                else {

                    if (this.weapon != null) {
                        this.state = CellingTurretState.Shooting;


                        let angle = Math.atan2(this.target.convertToWorldSpaceAR(cc.v2(0, 0)).y - this.node.convertToWorldSpaceAR(cc.v2(0, 0)).y, this.target.convertToWorldSpaceAR(cc.v2(0, 0)).x - this.node.convertToWorldSpaceAR(cc.v2(0, 0)).x);

                        armature.animation.play("shooting", 0);

                        armature.getBone("bone").offset.rotation = angle;

                        this.weapon.Fire(this.node.convertToWorldSpaceAR(cc.v2(0, 0))/*.getPosition()*/, angle, this.node);


                    }
                }
            }
            else {
                if (this.state != CellingTurretState.ClosedIdle && this.state != CellingTurretState.Closing) {
                    if (this.state != CellingTurretState.OpenedIdle) {
                        this.state = CellingTurretState.OpenedIdle;
                        armature.animation.play("idle_opened", 0);
                        armature.getBone("bone").offset.rotation = 0;
                    }
                    if (this.deactivateOverTime) {

                        this.timeLeft += dt;

                        if (this.timeLeft >= this.timeBeforeDeactivating) {
                            this.timeLeft = 0.0;

                            this.deactivate();
                        }

                    }
                }
            }
        }

        if (this.weapon != null) {
            this.weapon.manualUpdate(dt);
        }



        if (this.state != CellingTurretState.Disabled) {
            if (this.state == CellingTurretState.Opening) {
                if (armature.animation.isCompleted) {
                    this.state = CellingTurretState.OpenedIdle;
                    armature.animation.play("idle_opened", 0);
                    if (this.idleSound != null) {
                        this.idleSoundId = cc.audioEngine.playEffect(this.idleSound, true);
                    }
                }
            }

            if (this.state == CellingTurretState.Closing) {
                if (armature.animation.isCompleted) {
                    this.state = CellingTurretState.ClosedIdle;
                    armature.animation.play("idle_closed", 0);
                }
            }
        }
    }
}

//unsued parts of code
// cc.v2(this.node.getPosition().x, this.node.getPosition().y - this.node.getComponent(cc.PhysicsBoxCollider).size.height + this.node.getComponent(cc.PhysicsBoxCollider).offset.y)