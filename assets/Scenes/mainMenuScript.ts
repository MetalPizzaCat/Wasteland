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
export default class mainMenu extends cc.Component {

    @property(cc.Node)
    askExit: cc.Node = null;

    @property({ type: [cc.AudioClip] })
    backgroundSounds: [cc.AudioClip] = [null];

    @property({ type: [cc.AudioClip] })
    backgroundMusic: [cc.AudioClip] = [null];

    // LIFE-CYCLE CALLBACKS:

    onLoad() {      
    }

    startDemoButtonCallback() {
       // cc.audioEngine.stopAll();
        let musicVolume: number = cc.audioEngine.getMusicVolume();

        let effectsVolume: number = cc.audioEngine.getEffectsVolume();

        cc.director.loadScene("lvl", function () {
            cc.log(effectsVolume);
            cc.log(musicVolume);
            cc.audioEngine.setEffectsVolume(effectsVolume);
            cc.audioEngine.setMusicVolume(musicVolume);
        }.bind(effectsVolume, musicVolume));
    }
   

    exitButtonCallback() {
        if (this.askExit != null) {
            this.askExit.active = true;
        }
        else {
            close();
        }
    }

    finalExitButtonCallback() {
        close();
    }

    cancelExitButtonCallback() {
        this.askExit.active = false;
    }

 

    start() {
        for (let i: number = 0; i < this.backgroundMusic.length; i++) {
            if (this.backgroundMusic[i] != null) {
                cc.audioEngine.playMusic(this.backgroundMusic[i], true);
            }
        }

        for (let i: number = 0; i < this.backgroundSounds.length; i++) {
            if (this.backgroundSounds[i] != null) {
                cc.audioEngine.playEffect(this.backgroundSounds[i], true);
            }
        }

    }

    // update (dt) {}
}
