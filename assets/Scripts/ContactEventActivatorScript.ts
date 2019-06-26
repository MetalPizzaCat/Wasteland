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
export default class EventActivatorScript extends cc.Component {

    @property
    onBeginEventName: string = "";

    @property
    onEndEventName: string = "";

    @property({
        type: [cc.Node]
    })
    nodes: [cc.Node] = [null];

    @property
    onlyUsedBySpecialNodes: boolean = false;

    @property({
        type: [cc.Node]
    })
    specialNodes: [cc.Node] = [null];

    @property
    once: boolean = false;

    beginDone: boolean = false;

    endDone: boolean = false;
        

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    onBeginContact(contact, selfCollider, otherCollider) {
        if (!this.beginDone) {
            if (this.onlyUsedBySpecialNodes) {
                for (let i: number = 0; i < this.specialNodes.length; i++) {
                    if (this.specialNodes[i] != null) {
                        if (this.specialNodes[i] == otherCollider.node) {
                            for (let u: number = 0; u < this.nodes.length; u++) {
                                this.nodes[u].emit(this.onBeginEventName);
                            }
                            if (this.once) { this.beginDone = true; }
                            break;
                        }
                    }
                }
            }
            else {
                for (let u: number = 0; u < this.nodes.length; u++) {
                    this.nodes[u].emit(this.onBeginEventName);
                }
                if (this.once) { this.beginDone = true; }
            }
        }
    }

    onEndContact(contact, selfCollider, otherCollider) {
        if (!this.endDone)
            if (this.onlyUsedBySpecialNodes) {
                for (let i: number = 0; i < this.specialNodes.length; i++) {
                    if (this.specialNodes[i] != null) {
                        if (this.specialNodes[i] == otherCollider.node) {
                            for (let u: number = 0; u < this.nodes.length; u++) {
                                this.nodes[u].emit(this.onEndEventName);
                            }
                            if (this.once) { this.endDone = true; }
                            break;
                        }
                    }
                }
            }
            else {
                for (let u: number = 0; u < this.nodes.length; u++) {
                    this.nodes[u].emit(this.onEndEventName);
                    if (this.once) { this.endDone = true; }
                }
            }

    }

    start() {

    }

    // update (dt) {}
}