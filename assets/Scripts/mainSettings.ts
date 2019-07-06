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
export default class MainSettings extends cc.Component {


    @property(cc.Node)
    settingsMenu: cc.Node = null;

    @property(cc.Node)
    masterVolumeSlider: cc.Node = null;

    @property(cc.Node)
    musicVolumeSlider: cc.Node = null;

    @property(cc.Node)
    effectsVolumeSlider: cc.Node = null;


    // LIFE-CYCLE CALLBACKS:

    onLoad() {

        cc.game.addPersistRootNode(this.node);

    }



    onMasterVolumeSlide() {
        if (this.masterVolumeSlider != null && this.musicVolumeSlider != null && this.effectsVolumeSlider != null) {
            cc.audioEngine.setMusicVolume(this.masterVolumeSlider.getComponent(cc.Slider).progress * this.musicVolumeSlider.getComponent(cc.Slider).progress);
            cc.audioEngine.setEffectsVolume(this.masterVolumeSlider.getComponent(cc.Slider).progress * this.effectsVolumeSlider.getComponent(cc.Slider).progress);
        }
        else if (this.masterVolumeSlider != null && this.musicVolumeSlider != null && this.effectsVolumeSlider == null) {
            cc.audioEngine.setMusicVolume(this.masterVolumeSlider.getComponent(cc.Slider).progress * this.musicVolumeSlider.getComponent(cc.Slider).progress);
            cc.audioEngine.setEffectsVolume(this.masterVolumeSlider.getComponent(cc.Slider).progress);
        }
        else if (this.masterVolumeSlider != null && this.musicVolumeSlider == null && this.effectsVolumeSlider != null) {
            cc.audioEngine.setMusicVolume(this.masterVolumeSlider.getComponent(cc.Slider).progress);
            cc.audioEngine.setEffectsVolume(this.masterVolumeSlider.getComponent(cc.Slider).progress * this.effectsVolumeSlider.getComponent(cc.Slider).progress);
        }
        else if (this.masterVolumeSlider != null && this.musicVolumeSlider == null && this.effectsVolumeSlider == null) {
            cc.audioEngine.setMusicVolume(this.masterVolumeSlider.getComponent(cc.Slider).progress);
            cc.audioEngine.setEffectsVolume(this.masterVolumeSlider.getComponent(cc.Slider).progress);
        }
    }

    onMusicVolumeSlide() {
        if (this.musicVolumeSlider != null && this.masterVolumeSlider != null) {
            cc.audioEngine.setMusicVolume(this.masterVolumeSlider.getComponent(cc.Slider).progress * this.musicVolumeSlider.getComponent(cc.Slider).progress);
        }
    }

    onEffectsVolumeSlide() {
        if (this.effectsVolumeSlider != null && this.masterVolumeSlider != null) {
            cc.audioEngine.setEffectsVolume(this.masterVolumeSlider.getComponent(cc.Slider).progress * this.effectsVolumeSlider.getComponent(cc.Slider).progress);
        }
    }

    openSettingsButtonCallback() {
        if (this.settingsMenu != null) { this.settingsMenu.active = true; }
    }

    closeSettingButttonCallback() {
        if (this.settingsMenu != null) { this.settingsMenu.active = false; }
    }

    start() {

    }

    // update (dt) {}
}