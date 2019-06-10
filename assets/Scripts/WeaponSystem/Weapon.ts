import Item from "../Item/Item";
import Projectile from "./Projectile"
import Character from "../Character";
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

const {ccclass, property} = cc._decorator;
/*
 * Used to define animation used to play when firing weapon
 */
enum WeaponType {
    Melee = "Melee",
    Pistol = "Pistol",
    Rifle = "Rifle",
    Shotgun = "Shotgun",
}

/*
 * Used to define animation used to play when firing weapon
 */
enum WeaponHandType {
    OneHanded,
    TwoHanded
}

@ccclass
export default class Weapon extends Item {

    @property
    PrimaryAmmoPerClip: number = 0;

    @property
    PrimaryAmmoLeftInTheClip: number = 10;

    @property
    SecondaryAmmoPerClip: number = 0;

    @property
    SecondaryAmmoLeftInTheClip: number = 0;

    @property(cc.SpriteFrame)
    weaponSprire: cc.SpriteFrame = null;

    @property({ type: cc.Enum(WeaponType) })
    WeaponType: WeaponType = WeaponType.Melee;

    //Primary fire of the weapon - INFO - BEGIN
    //if object is melee this property will not be used
    primaryFireProjectileName: string = "melee";

    primaryProjectileData: any = null;

    primaryFireTimeBetweenShots: number = 0.1;

    primaryAmmoType: string = "";

    primaryFireTimeSinceLastShot: number = 0.0;

    primaryShot: boolean = false;
    //Primary fire of the weapon - INFO - END

    //------------------------------------------------------------------

    //Primary fire of the weapon - INFO - BEGIN
    //if object is melee this property will not be used
    secondaryFireProjectileName: string = "melee";

    secondaryProjectileData: any = null;

    secondaryFireTimeBetweenShots: number = 0.1;

    secondaryFireTimeSinceLastShot: number = 0.0;

    secondaryAmmoType: string = "";

    secondaryShot: boolean = false;
    //Primary fire of the weapon - INFO - END


    // LIFE-CYCLE CALLBACKS:

    primaryReload(parent: cc.Node): void {
        if (parent != null) {
            if (parent.getComponent(ObjectWithInventory) != null) {
                for (let i: number = 0; i < parent.getComponent(ObjectWithInventory).items.length; i++) {
                    if (parent.getComponent(ObjectWithInventory).items[i] != null) {
                        if (parent.getComponent(ObjectWithInventory).items[i].itemName == this.primaryAmmoType) {
                            if (parent.getComponent(ObjectWithInventory).items[i].amount >= this.PrimaryAmmoPerClip) {
                                this.PrimaryAmmoLeftInTheClip = this.PrimaryAmmoPerClip;
                                parent.getComponent(ObjectWithInventory).removeItem(parent.getComponent(ObjectWithInventory).items[i].itemName, this.PrimaryAmmoPerClip);
                            }
                            else if (parent.getComponent(ObjectWithInventory).items[i].amount > 0 && parent.getComponent(ObjectWithInventory).items[i].amount < this.PrimaryAmmoPerClip) {
                                this.PrimaryAmmoLeftInTheClip = parent.getComponent(ObjectWithInventory).items[i].amount;
                                parent.getComponent(ObjectWithInventory).removeItem(parent.getComponent(ObjectWithInventory).items[i].itemName, this.PrimaryAmmoPerClip);
                            }
                        }
                    }
                }
            }
        }
    }

    secondaryReload(parent: cc.Node): void {
        if (parent != null) {
            if (parent.getComponent(ObjectWithInventory) != null) {
                for (let i: number = 0; i < parent.getComponent(ObjectWithInventory).items.length; i++) {
                    if (parent.getComponent(ObjectWithInventory).items[i].itemName == this.secondaryAmmoType) {
                        if (parent.getComponent(ObjectWithInventory).items[i].amount >= this.SecondaryAmmoPerClip) {
                            this.SecondaryAmmoLeftInTheClip = this.SecondaryAmmoPerClip;
                            parent.getComponent(ObjectWithInventory).removeItem(parent.getComponent(ObjectWithInventory).items[i].itemName, this.SecondaryAmmoPerClip);
                        }
                        else if (parent.getComponent(ObjectWithInventory).items[i].amount > 0 && parent.getComponent(ObjectWithInventory).items[i].amount < this.SecondaryAmmoPerClip) {
                            this.SecondaryAmmoLeftInTheClip = parent.getComponent(ObjectWithInventory).items[i].amount;
                            parent.getComponent(ObjectWithInventory).removeItem(parent.getComponent(ObjectWithInventory).items[i].itemName, parent.getComponent(ObjectWithInventory).items[i].amount);
                        }
                    }
                }
            }
        }
    }

    canPrimaryFire(): boolean {
        if (this.primaryFireTimeSinceLastShot == 0.0 && this.PrimaryAmmoLeftInTheClip > 0 && !this.primaryShot) { return true; }
        else { return false; }
    }

    canSecondaryFire(): boolean {
        if (this.secondaryFireTimeSinceLastShot == 0.0 && this.SecondaryAmmoLeftInTheClip > 0 && !this.secondaryShot) { return true; }
        else { return false; }
    }

    /**
     * For each type of weapon there should be speacial function that will be called from main Weapon.Fire function
     * @param location
     * @param rotation
     * @param parent
     */
    PrimaryFireMelee(location: cc.Vec2, rotation: number, parent: cc.Node): void {

    }

    PrimaryFireGun(location: cc.Vec2, rotation: number, parent: cc.Node): void {
        //due to unabiluty to create safe and easy way of storing data table in in somekind of  storage object data will be loaded and realeased each time by default
        cc.audioEngine.play(parent.getComponent(Character).sound[0], false, 1);

        cc.log("file");

        let projectile = new cc.Node();
        projectile.addComponent(cc.RigidBody);
        projectile.addComponent(cc.PhysicsCircleCollider);
        projectile.addComponent(cc.Sprite);
        projectile.addComponent(Projectile);

        cc.log(this.primaryProjectileData);

        if (this.primaryProjectileData != null) {

            if (projectile.getComponent(cc.Sprite) != null) {
                projectile.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(this.primaryProjectileData["imageName"]);
            }
        }




        if (projectile.getComponent(cc.PhysicsCircleCollider) != null) {
            projectile.getComponent(cc.PhysicsCircleCollider).radius = 10;
        }

        projectile.setPosition(location);
        projectile.parent = cc.director.getScene();

        projectile.getComponent(cc.RigidBody).applyLinearImpulse(cc.v2(this.primaryProjectileData["speed"] * Math.cos(rotation), this.primaryProjectileData["speed"] * Math.sin(rotation)), parent.position, true);

        this.primaryShot = true;

        this.PrimaryAmmoLeftInTheClip -= 1;
        if (this.PrimaryAmmoLeftInTheClip < 0) { this.PrimaryAmmoLeftInTheClip = 0; }
    }

    Fire(location: cc.Vec2, rotation: number, parent: cc.Node): boolean {
        if (this.WeaponType == WeaponType.Melee) {
            if (this.canSecondaryFire()) { this.PrimaryFireMelee(location, rotation, parent); }
            else { return false; }
        }
        else if (this.WeaponType == WeaponType.Pistol || this.WeaponType == WeaponType.Rifle || this.WeaponType == WeaponType.Shotgun) {
            cc.log("Can shoot: " + this.canPrimaryFire());
            if (this.canPrimaryFire()) { this.PrimaryFireGun(location, rotation, parent); return true; }
            else { return false; }
        }
        else { return false; }
    }

    loadDataForItem(data): boolean {

        let result: boolean = false;
        for (var i: number = 0; i < Object.keys(data["json"]["items"]).length; i++) {
            const name = data["json"]["items"][i]["name"];
            const weight = data["json"]["items"][i]["weight"];
            if (this.itemName == data["json"]["items"][i]["name"]) {
                //load all needed data
                this.weight = data["json"]["items"][i]["weight"];
                this.imageName = data["json"]["items"][i]["imageName"];
                this.type = data["json"]["items"][i]["type"];
                this.displayName = data["json"]["items"][i]["displayName"];
                this.WeaponType = <WeaponType>data["json"]["items"][i]["weaponType"];
                this.primaryFireTimeBetweenShots = data["json"]["items"][i]["primaryFireTimeBetweenShots"];
                this.primaryAmmoType = data["json"]["items"][i]["primaryAmmoType"];
                this.PrimaryAmmoPerClip = data["json"]["items"][i]["primaryFireAmmoPerClip"];
                if (this.WeaponType != WeaponType.Melee) {
                    this.primaryFireProjectileName = data["json"]["items"][i]["primaryFireProjectileName"];
                }
                //cc.log("imageName is " + this.imageName + " but it's suppossed to be " + data["json"]["items"][i]["imageName"]);

                //finish 
                result = true;
                break;

            }
        }

        for (var i: number = 0; i < Object.keys(data["json"]["projectiles"]).length; i++) {
            if (this.primaryFireProjectileName == data["json"]["projectiles"][i]["name"]) {
                this.primaryProjectileData = data["json"]["projectiles"][i];
                cc.log(data["json"]["projectiles"][i]["imageName"]);
            }
        }

        //table ended but no suitable entry was found
        return result;
    }

    loadDataForItemFromFile(): boolean {
        let result: boolean = false;
        var url = cc.url.raw('resources/DataTabels/items.json');
        cc.loader.load(url, function (err, data) {
            if (data != null) {
                cc.log(JSON.stringify(data));
                for (var i: number = 0; i < Object.keys(data["json"]["items"]).length; i++) {
                    if (this.itemName == data["json"]["items"][i]["name"]) {
                        //load all needed data
                        this.weight = data["json"]["items"][i]["weight"];
                        this.imageName = data["json"]["items"][i]["imageName"];
                        this.type = data["json"]["items"][i]["type"];
                        this.displayName = data["json"]["items"][i]["displayName"];
                        this.WeaponType = <WeaponType>data["json"]["items"][i]["weaponType"];
                        this.primaryFireTimeBetweenShots = data["json"]["items"][i]["primaryFireTimeBetweenShots"];
                        this.primaryAmmoType = data["json"]["items"][i]["primaryAmmoType"];
                        this.PrimaryAmmoPerClip = data["json"]["items"][i]["primaryFireAmmoPerClip"];
                        if (this.WeaponType != WeaponType.Melee) {
                            this.primaryFireProjectileName = data["json"]["items"][i]["primaryFireProjectileName"];
                        }
                        //finish 
                        result = true;
                        break;

                    }
                }

            }
            else {
                cc.log(typeof err + " " + err + " " + JSON.stringify(err));
                throw new Error("Failed to load DataTable for items Function: ' loadDataForItemFromFile(): boolean' Error: " + err + " itemName: " + this.itemName + " amount: " + this.amount);
            }
        }.bind(this, result));

        let url2 = cc.url.raw('resources/DataTabels/projectiles.json')
        cc.loader.load(url2, function (err, data) {
            cc.log("error");
            if (data != null) {
                for (var i: number = 0; i < Object.keys(data["json"]["projectiles"]).length; i++) {
                    if (this.primaryFireProjectileName == data["json"]["projectiles"][i]["name"]) {
                        this.primaryProjectileData = data["json"]["projectiles"][i];
                    }
                }
            }
            else {
                throw new Error("Failed to load DataTable for items");
            }
        }.bind(this));

        //table ended but no suitable entry was found
        return result;
    }

    onLoad() {

        var url = cc.url.raw('resources/DataTabels/items.json')
        cc.loader.load(url, function (err, itemArray) {
            if (itemArray != null) {
                for (var i: number = 0; i < Object.keys(itemArray["json"]["items"]).length; i++) {
                    const name = itemArray["json"]["items"][i]["name"];
                    const weight = itemArray["json"]["items"][i]["weight"];
                    if (this.itemName == itemArray["json"]["items"][i]["name"]) {
                        this.weight = itemArray["json"]["items"][i]["weight"];
                        this.imageName = itemArray["json"]["items"][i]["imageName"];
                        this.type = itemArray["json"]["items"][i]["type"];
                        this.displayName = itemArray["json"]["items"][i]["displayName"];
                        this.WeaponType = <WeaponType>itemArray["json"]["items"][i]["weaponType"];
                        this.primaryFireTimeBetweenShots = itemArray["json"]["items"][i]["primaryFireTimeBetweenShots"];
                        this.primaryAmmoType = itemArray["json"]["items"][i]["primaryAmmoType"];
                        this.PrimaryAmmoPerClip = itemArray["json"]["items"][i]["primaryFireAmmoPerClip"];
                        if (this.WeaponType != WeaponType.Melee) {
                            this.primaryFireProjectileName = itemArray["json"]["items"][i]["primaryFireProjectileName"];
                        }
                    }
                }
            }
            else {
                throw new Error("Failed to load DataTable for items");
            }
        }.bind(this));
        if (this.weight < 0) {
            alert("item's weight is lower than zero");
        }



    }

    start() {

    }

    manualUpdate(dt) {

        if (this.primaryShot) {

            this.primaryFireTimeSinceLastShot += dt;
            if (this.primaryFireTimeSinceLastShot >= this.primaryFireTimeBetweenShots) {

                this.primaryShot = false;
                this.primaryFireTimeSinceLastShot = 0.0;
            }
        }
        if (this.secondaryShot) {
            this.secondaryFireTimeSinceLastShot += dt;
            if (this.secondaryFireTimeSinceLastShot >= this.secondaryFireTimeBetweenShots) {
                this.secondaryShot = false;
                this.secondaryFireTimeSinceLastShot = 0.0;
            }
        }
    }
}
