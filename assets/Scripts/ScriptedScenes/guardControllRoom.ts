
import AnimalTalk from "../AI/AnimalTalkScript";
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
export default class NewClass extends cc.Component {

    @property(cc.Node)
    guardCharacterNode: cc.Node = null;

    @property(cc.Node)
    guardGeneralCharacterNode: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.node.on('startcutscene', this.cutsceneStart, this);
        this.node.on('endcutscene', this.cutsceneEnd, this);
    }

    cutsceneStart() {
        for (let i: number = 0; i < this.node.getComponents(cc.AudioSource).length; i++) {
            if (this.node.getComponents(cc.AudioSource)[i] != null) {
                this.node.getComponents(cc.AudioSource)[i].play();
            }
        }

        //if (this.node.getComponent(cc.AudioSource) != null) { this.node.getComponent(cc.AudioSource).play(); }
        if (this.guardCharacterNode != null) { this.guardCharacterNode.getComponent(AnimalTalk).startTalking(); }
        if (this.guardGeneralCharacterNode != null) { this.guardGeneralCharacterNode.getComponent(AnimalTalk).startTalking(); }
    }

    cutsceneEnd() {
        for (let i: number = 0; i < this.node.getComponents(cc.AudioSource).length; i++) {
            if (this.node.getComponents(cc.AudioSource)[i] != null) {
                this.node.getComponents(cc.AudioSource)[i].stop();
            }
        }
        if (this.guardCharacterNode != null) { this.guardCharacterNode.getComponent(AnimalTalk).done = true; }
        if (this.guardGeneralCharacterNode != null) { this.guardGeneralCharacterNode.getComponent(AnimalTalk).done = true; }
    }

    // update (dt) {}
}
