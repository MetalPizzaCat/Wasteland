

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
export default class Weapon extends cc.Component {

    @property
    AmmoPerClip: number = 0;

    @property
    AmmoLeftInTheClip: number = 0;

    @property
    WeaponName: string = 'weapon';

    @property(cc.SpriteFrame)
    weaponSprire: cc.SpriteFrame = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    Fire(location: cc.Vec2, rotation: number, parent: cc.Node): void {
       
        var projectile = new cc.Node();
        projectile.addComponent(cc.RigidBody);
        projectile.addComponent(cc.PhysicsCircleCollider);
        projectile.addComponent(cc.Sprite);

        if (projectile.getComponent(cc.Sprite) != null) {
            projectile.getComponent(cc.Sprite).spriteFrame = this.weaponSprire;
        }

        if (projectile.getComponent(cc.PhysicsCircleCollider) != null) {
            projectile.getComponent(cc.PhysicsCircleCollider).radius = 10;
        }
        cc.log(projectile.position.x + "  " + projectile.position.y);
       
        projectile.position = location;
        projectile.parent = cc.director.getScene();

        projectile.getComponent(cc.RigidBody).applyLinearImpulse(cc.v2(1000, 0), this.node.position, true);
        
    }

    start () {

    }

    // update (dt) {}
}
