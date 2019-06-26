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
export default class TimedEvent extends cc.Component {

    @property({ min: 0 })
    time: number = 0;

    @property
    onEndEventName: string = "";

    @property({
        type: [cc.Node]
    })
    nodes: [cc.Node] = [null];

    @property
    once: boolean = false;

    timerIsOn: boolean = false;

    passedTime: number = 0;

    done: boolean = false;


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}



    start() {
        this.node.on('starttimer', function () { (this as TimedEvent).timerIsOn = true; (this as TimedEvent).passedTime = 0; }.bind(this));

        this.node.on('pausetimer', function () { (this as TimedEvent).timerIsOn = false; }.bind(this));

        this.node.on('endtimer', function () { (this as TimedEvent).timerIsOn = false; (this as TimedEvent).passedTime = 0; }.bind(this));
    }

    update(dt) {
        if (!this.done) {
            if (this.timerIsOn) {
                this.passedTime += dt;

                if (this.passedTime >= this.time) {
                    for (let u: number = 0; u < this.nodes.length; u++) {
                        this.nodes[u].emit(this.onEndEventName);
                    }
                }    
                
            }
        }
    }

}
