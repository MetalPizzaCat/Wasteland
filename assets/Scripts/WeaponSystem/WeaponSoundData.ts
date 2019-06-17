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
class WeaponSoundData {
    @property({ tooltip: "Name of the item in itemTable", displayName: "ItemName" })
    name: string = 'Shotgun';

    @property({
        type: [cc.AudioClip]
    })
    primaryShootSound: [cc.AudioClip] = [null];

    @property({
        type: [cc.AudioClip]
    })
    secondaryShootSound: [cc.AudioClip] = [null];

    @property({
        type: [cc.AudioClip]
    })
    secondaryReloadSound: [cc.AudioClip] = [null];

    @property({
        type: [cc.AudioClip]
    })
    primaryReloadSound: [cc.AudioClip] = [null];
}

@ccclass
export default class WeaponSoundDataScript extends cc.Component {

    @property([WeaponSoundData])
    sounds: [WeaponSoundData] = [null];

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {

    }

    // update (dt) {}
}
