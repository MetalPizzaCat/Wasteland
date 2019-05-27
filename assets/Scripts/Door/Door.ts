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
export default class Door extends cc.Component {


    @property(cc.Vec2)
    endLocation: cc.Vec2 = cc.v2(0, 0);

    @property(cc.Vec3)
    endLocation3D: cc.Vec3 = new cc.Vec3(0, 0, 0);

    startLocation: cc.Vec2 = cc.v2(0, 0);

    startLocation3D: cc.Vec3 = new cc.Vec3(0, 0, 0);

    @property
    locked: boolean = false;

    @property
    opened: boolean = false;

    @property({
        type: cc.AudioClip
    })
    openSound: cc.AudioClip = null;
    openSoundAudioId: number = 0;

    @property({
        type: cc.AudioClip
    })
    closeSound: cc.AudioClip = null;
    closeSoundAudioId: number = 0;

    @property({
        type: cc.AudioClip
    })
    lockedSound: cc.AudioClip = null;
    lockedSoundAudioId: number = 0;

    @property({
        type: cc.AudioClip
    })
    unlockedSound: cc.AudioClip = null;
    unlockedSoundAudioId: number = 0;

    @property({
        type: cc.AudioClip
    })
    lockSound: cc.AudioClip = null;
    lockSoundAudioId: number = 0;
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.startLocation3D = new cc.Vec3(this.node.position.x, this.node.position.y, this.node.z);
        this.startLocation = this.node.position;
    }

    open(): void {
        if (!this.locked) {
            if (!this.node.is3DNode) {
                this.node.position = cc.v2(this.endLocation3D.x, this.endLocation3D.y);
                this.node.z = this.endLocation3D.z;
            }
            else {
                this.node.position = this.endLocation;
            }
            this.openSoundAudioId = cc.audioEngine.play(this.openSound, false, 1);
        }
        else {
            this.lockedSoundAudioId = cc.audioEngine.play(this.lockedSound, false, 1);
        }
    }

    close(): void {
        if (!this.locked) {
            if (!this.locked) {
                if (!this.node.is3DNode) {
                    this.node.position = cc.v2(this.startLocation3D.x, this.startLocation3D.y);
                    this.node.z = this.startLocation3D.z;
                }
                else {
                    this.node.position = this.startLocation;
                }
            }
            this.closeSoundAudioId = cc.audioEngine.play(this.closeSound, false, 1);
        }
        else {
            this.lockedSoundAudioId = cc.audioEngine.play(this.lockedSound, false, 1);
        }
    }

    lock() {
        this.locked = true;
        this.lockSoundAudioId = cc.audioEngine.play(this.lockSound, false, 1);
    }

    unLock() {
        this.locked = false;
        this.unlockedSoundAudioId = cc.audioEngine.play(this.unlockedSound, false, 1);
    }

    start() {

    }

    // update (dt) {}
}
