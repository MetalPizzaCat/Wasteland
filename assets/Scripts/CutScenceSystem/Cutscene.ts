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
export default class Cutscene extends cc.Component {

    @property(cc.Node)
    cameraNode: cc.Node = null;

    @property({min:0})
    lenght: number = 0;

    @property
    cutsceneName: string = "";

    @property
    skippable: boolean = false;

    @property
    anyKeyToSkip: boolean = false;

    @property({ type: cc.Enum(cc.macro.KEY) })
    keyToSkip: cc.macro.KEY = cc.macro.KEY.space;

    @property({ type: [cc.Node] })
    cameraLocations: [cc.Node] = [null];

    cameraOrigin: cc.Vec2;

    passedTime: number = 0;

    cutsceneGoing: boolean = false;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);

        this.node.on('startcutscene', this.cutsceneStart, this);
        this.node.on('endcutscene', this.cutsceneEnd, this);
    }

    cutsceneStart() {
        
        if (this.cameraNode != null) {
            
            this.cutsceneGoing = true;
            this.cameraOrigin = this.cameraNode.getPosition();

            this.cameraNode.setPosition(this.cameraNode.convertToNodeSpaceAR(this.cameraLocations[0].convertToWorldSpaceAR(cc.v2(0, 0))));
            
        }
    }

    cutsceneEnd() {
        
        if (this.cameraNode != null) {

            
            this.cameraNode.setPosition(this.cameraOrigin);
            this.cutsceneGoing = false;
        }
    }

    onKeyDown(_event: cc.Event.EventKeyboard) {
        if (this.cutsceneGoing) {
            if (this.anyKeyToSkip) { this.cutsceneEnd(); }
            else {
                if (_event.keyCode == this.keyToSkip) { this.cutsceneEnd(); }
            }
        }
    }

    update(dt) {
        if (this.cutsceneGoing) {
            this.passedTime += dt;
            if (this.passedTime >= this.lenght) {
                this.passedTime = 0;
                this.cutsceneEnd();
            }
        }
    }
}
