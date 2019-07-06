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

const { ccclass, property } = cc._decorator;


@ccclass
export default class TutorialScene extends cc.Component {

    @property(cc.Node)
    tutorCharacterNode: cc.Node = null;



    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
       this.node.on('startcutscene', this.cutsceneStart, this);
        this.node.on('endcutscene', this.cutsceneEnd, this);
    }

    cutsceneStart() {
        if (this.node.getComponent(cc.AudioSource) != null) { this.node.getComponent(cc.AudioSource).play(); }
        if (this.tutorCharacterNode != null) { this.tutorCharacterNode.getComponent(AnimalTalk).startTalking(); }
    }

    cutsceneEnd() {
        this.node.getComponent(cc.AudioSource).stop();
        if (this.tutorCharacterNode != null) { this.tutorCharacterNode.getComponent(AnimalTalk).done = true; }
    }

    // update (dt) {}
}

