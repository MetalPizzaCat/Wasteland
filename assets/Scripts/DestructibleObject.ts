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
export default class DestructibleObject extends cc.Component {

    @property({min:0})
    health: number = 0;

    dead: boolean = false;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        this.node.on('damage', this.onDamage, this);
    }

    die(killer: cc.Node) {
        this.node.destroy();
    }

    onDamage(damager: cc.Node, amount: number): void {
        this.health -= amount;
        cc.log("damaged by " + damager.name + " damage: " + amount);
        if (this.health <= 0) { this.die(damager); }
    }
    // update (dt) {}
}
