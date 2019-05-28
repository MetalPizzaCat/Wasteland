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
export default class Item extends cc.Component {
    //name of the entry in .json file
    @property
    itemName: string = 'item';

    weight: number = 0;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        var url = cc.url.raw('resources/DataTabels/items.json')
        cc.loader.load(url, function (err, itemArray) {


            for (var i: number = 0; i < Object.keys(itemArray["json"]["items"]).length; i++) {
                const name = itemArray["json"]["items"][i]["name"];
                const weight = itemArray["json"]["items"][i]["weight"];
                if (this.itemName == itemArray["json"]["items"][i]["name"]) {
                    this.weight = itemArray["json"]["items"][i]["weight"];
                }
            }

        }.bind(this));
        if (this.weight < 0) {
            alert("item's weight is lower than zero");
        }
    }

    //constructor(name: string, weight: number) {
    //    super();
    //    this.weight = weight;
    //    this.name = name;
    //}
    start () {

    }

    // update (dt) {}
}
