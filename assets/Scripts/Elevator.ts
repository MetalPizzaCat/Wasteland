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
export default class Elevator extends cc.Component {

    rigidBody: cc.RigidBody = null;

    arrived: boolean = false;

    movingBack: boolean = false;

    moving: boolean = false;

    @property(cc.Vec2)
    endLocation: cc.Vec2 = null;

    startLocation: cc.Vec2 = null;

    @property
    speed: number = 0;

    @property({
        type: cc.AudioClip
    })
    moveSound: cc.AudioClip = null;
    moveSoundAudioId: number = 0;

    @property({
        type: cc.AudioClip
    })
    stopSound: cc.AudioClip = null;
    stopSoundAudioId: number = 0;

    @property({
        type: cc.AudioClip
    })
    startSound: cc.AudioClip = null;
    startSoundAudioId: number = 0;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.speed = Math.abs(this.speed);
        this.rigidBody = this.node.getComponent(cc.RigidBody);
        this.startLocation = this.node.getPosition();
        if (this.endLocation == null) { alert("End location is null"); }
        if (this.stopSound == null) { cc.log("Missing platform stop moving sound"); }
        if (this.startSound == null) { cc.log("Missing platform start moving sound"); }
        if (this.moveSound == null) { cc.log("Missing platform  move moving sound"); }

        
    }

    startMovement(): void {
        if (this.arrived == true) {
            this.arrived = false;
            this.moving = true;
            if (this.node.position.fuzzyEquals(this.endLocation, 1)) {
                
                var vec = this.startLocation.sub(this.node.getPosition()).normalizeSelf();
                this.rigidBody.linearVelocity = cc.v2(this.speed * vec.x, this.speed * vec.y);
                this.movingBack = true;

                this.startSoundAudioId = cc.audioEngine.play(this.startSound, false, 1);
                this.moveSoundAudioId = cc.audioEngine.play(this.moveSound, true, 1);
            }
            else if (this.node.position.fuzzyEquals(this.startLocation, 1)) {
                
                var vec = this.endLocation.sub(this.node.getPosition()).normalizeSelf();
                this.rigidBody.linearVelocity = cc.v2(this.speed * vec.x, this.speed * vec.y);

                this.movingBack = false;

                this.startSoundAudioId = cc.audioEngine.play(this.startSound, false, 1);
                this.moveSoundAudioId = cc.audioEngine.play(this.moveSound, true, 1);
            }
        }
        else {
            this.arrived = false;
            this.moving = true;
            var vec = this.endLocation.sub(this.node.getPosition()).normalizeSelf();

            
            this.rigidBody.linearVelocity = cc.v2(this.speed * vec.x, this.speed * vec.y);
           

            this.startSoundAudioId = cc.audioEngine.play(this.startSound, false, 1);
            this.moveSoundAudioId = cc.audioEngine.play(this.moveSound, true, 1);
        }
    }

    stopMovement(): void {
        this.rigidBody.linearVelocity = cc.v2(0, 0);
        this.moving = false;

        cc.audioEngine.stop(this.moveSoundAudioId);

        this.stopSoundAudioId = cc.audioEngine.play(this.stopSound, false, 1);
    }
    beUsedByButton(node: cc.Node) {
        this.startMovement();
    }

    start() {
        this.node.on('usedbybutton', this.beUsedByButton, this);
    }

    update(dt) {

        
        if (this.movingBack) {
            if (this.node.position.fuzzyEquals(this.startLocation, 1)) {
                if (!this.arrived) {
                    this.arrived = true;
                    this.stopMovement();
                }
            }
        }
        else {

            if (this.node.position.fuzzyEquals(this.endLocation, 1)) {
                if (!this.arrived) {
                    this.arrived = true;
                    this.stopMovement();
                }
            }
        }
    }
}
