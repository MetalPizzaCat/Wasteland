import SoundWithFalloff from "../Sound/SoundWithFalloff";

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
export class AnimalTalkData {

    @property({})
    text: string = "";

    @property({ min: 0.1 })
    timeForText: number = 0.1;
}

@ccclass
export default class AnimalTalk extends cc.Component {

    @property({
        type: [cc.AudioClip]
    })
    sound: [cc.AudioClip] = [null];

    

    @property({
        type: [AnimalTalkData]
    })
    talkData: [AnimalTalkData] = [null];

    @property(cc.Node)
    talkLabelNode: cc.Node = null;

    @property(cc.Node)
    talkLabelBackgroundNode: cc.Node = null;

    @property({ tooltip: "Requires for node to have SoundWithFallof component" })
    useSoundWithFallof: boolean = false;

    currentStringId: number = 0; 

    timeSinceLastChange: number = 0;

    done: boolean = false;

    talking: boolean = false;

    voiceChannelId: number = 0;

    // LIFE-CYCLE CALLBACKS:

    
    startTalking() {
        if (this.talkLabelNode != null && this.talkLabelNode.getComponent(cc.Label) != null) {
            this.currentStringId = 0;
            this.talking = true;

            if (this.talkData[0] != null) {
                this.talkLabelNode.getComponent(cc.Label).string = this.talkData[0].text;

                let num: number = Math.floor(Math.random() * (this.sound.length));
                if (this.sound[num] != null) {
                    this.voiceChannelId = cc.audioEngine.playEffect(this.sound[num], false);
                    if (this.useSoundWithFallof && this.getComponent(SoundWithFalloff) != null) {
                        cc.audioEngine.setVolume(this.voiceChannelId, this.getComponent(SoundWithFalloff).resultVolume * cc.audioEngine.getEffectsVolume());
                    }
                }

            }
        }
    }

    continueTalking(dt: number) {
        if (!this.done && this.talking) {
            this.timeSinceLastChange += dt;
            if (this.talkData[this.currentStringId].text != "") {
                if (this.talkLabelBackgroundNode != null) {
                    this.talkLabelBackgroundNode.active = true;
                    if (this.talkLabelBackgroundNode.getComponent(cc.Sprite) != null) {
                        this.talkLabelBackgroundNode.scaleX = this.talkData[this.currentStringId].text.length;
                    }
                }
                if (this.talkLabelNode != null) { this.talkLabelNode.active = true; }
                if (cc.audioEngine.getState(this.voiceChannelId) != cc.audioEngine.AudioState.PLAYING) {

                    let num: number = Math.floor(Math.random() * (this.sound.length));
                    if (this.sound[num] != null) {
                        this.voiceChannelId = cc.audioEngine.playEffect(this.sound[num], false);

                    }

                }
              
                if (this.useSoundWithFallof && this.getComponent(SoundWithFalloff) != null) {
                    cc.audioEngine.setVolume(this.voiceChannelId, this.getComponent(SoundWithFalloff).resultVolume * cc.audioEngine.getEffectsVolume());
                }
            }
            else {
                if (this.talkLabelBackgroundNode != null) { this.talkLabelBackgroundNode.active = false }
                if (this.talkLabelNode != null) { this.talkLabelNode.active = false }
            }
            if (this.timeSinceLastChange >= this.talkData[this.currentStringId].timeForText) {
                this.timeSinceLastChange = 0;
                this.currentStringId += 1;
                if (this.currentStringId < this.talkData.length) {
                    if (this.talkData[this.currentStringId] != null) {
                        this.talkLabelNode.getComponent(cc.Label).string = this.talkData[this.currentStringId].text;
                    }
                }
                else {
                    this.done = true;
                    this.talkLabelNode.getComponent(cc.Label).string = "";
                }
            }
        }
    }

    start() {
        this.node.on('starttalk', this.startTalking, this);
        if (this.useSoundWithFallof && this.node.getComponent(SoundWithFalloff) == null) { cc.log(Error("Script has useSoundWithFallof checked but no suitable component is found. Node: " + this.node)); }

       // this.startTalking();
    }

    update(dt) {
        this.continueTalking(dt);
    }
}
