import ItemData from './ObjectWithInventory'
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
class ItemSoundData {
    @property({ tooltip: "Name of the item in itemTable", displayName: "ItemName" })
    name: string = 'cup';

    @property({
        type: [cc.AudioClip]
    })
    pickupSound: [cc.AudioClip] = [null];

    @property({
        type: [cc.AudioClip]
    })
   dropSound: [cc.AudioClip] = [null];
}

@ccclass
export default class ItemSoundDataScript extends cc.Component {

    @property([ItemSoundData])
    sounds: [ItemSoundData] = [null];

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}
}
