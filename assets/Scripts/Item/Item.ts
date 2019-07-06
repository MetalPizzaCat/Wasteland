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
    canBePickedUp: boolean = true;
    @property
    itemName: string = 'item';

    weight: number = 0;

    @property
    amount: number = 0;

    type: string = "item";

    imageName: string = "Items/clipboard.png";

    pickupSoundName: string = "sounds/bottle/itm_bottle_up_01.wav";

    dropSoundName: string = "sounds/bottle/itm_bottle_down_01.wav";

    displayName: string = "item";

    value: number = 0;
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        var url = cc.url.raw('resources/DataTabels/items.json')
        cc.loader.load(url, function (err, itemArray) {
            if (itemArray != null) {
                for (var i: number = 0; i < Object.keys(itemArray["json"]["items"]).length; i++) {
                    const name = itemArray["json"]["items"][i]["name"];
                    const weight = itemArray["json"]["items"][i]["weight"];
                    if (this.itemName == itemArray["json"]["items"][i]["name"]) {
                        this.weight = itemArray["json"]["items"][i]["weight"];
                        this.imageName = itemArray["json"]["items"][i]["imageName"];
                        this.displayName = itemArray["json"]["items"][i]["displayName"];
                        this.value = itemArray["json"]["items"][i]["value"];
                    }
                }
            }
            else {
                throw new Error("Failed to load DataTable for items");
            }
        }.bind(this));
        if (this.weight < 0) {
            alert("item's weight is lower than zero");
        }
    }

    /**
     * Load data from json table
    @param data Result of loading json file wit cc.loader.load 
    @return Returns true if reading data for item was successful, false if otherwise
    */
    loadDataForItem(data): boolean {

        for (var i: number = 0; i < Object.keys(data["json"]["items"]).length; i++) {
            const name = data["json"]["items"][i]["name"];
            const weight = data["json"]["items"][i]["weight"];
            if (this.itemName == data["json"]["items"][i]["name"]) {
                //load all needed data
                this.weight = data["json"]["items"][i]["weight"];
                this.imageName = data["json"]["items"][i]["imageName"];
                this.type = data["json"]["items"][i]["type"];
                this.displayName = data["json"]["items"][i]["displayName"];
                this.value = data["json"]["items"][i]["value"];
                //finish 
                return true;
                
            }
        }
        //table ended but no suitable entry was found
        return false;
    }

    loadDataForItemFromFile(): boolean{
        let result: boolean = false;
        var url = cc.url.raw('resources/DataTabels/items.json');
        cc.loader.load(url, function (err, data) {
            if (data != null) {
                cc.log(JSON.stringify(data));
                for (var i: number = 0; i < Object.keys(data["json"]["items"]).length; i++) {
                    if (this.itemName == data["json"]["items"][i]["name"]) {
                        //load all needed data
                        this.weight = data["json"]["items"][i]["weight"];
                        this.imageName = data["json"]["items"][i]["imageName"];
                        this.type = data["json"]["items"][i]["type"];
                        this.displayName = data["json"]["items"][i]["displayName"];
                        this.value = data["json"]["items"][i]["value"];
                        //finish 
                        result = true;
                        break;

                    }
                }
            }
            else {
                cc.log(typeof err + " " + err + " " + JSON.stringify(err));
                throw new Error("Failed to load DataTable for items Function: ' loadDataForItemFromFile(): boolean' Error: " + err + " itemName: " + this.itemName + " amount: " + this.amount); 
            }
        }.bind(this, result));
        //table ended but no suitable entry was found
        return result;
    }

    //constructor(name: string, weight: number) {
    //    super();
    //    this.weight = weight;
    //    this.name = name;
    //}

    start() {
       
    }
    /**
     * Update that can only be called once AND only in update function
     * @param dt Delta time
     */
    manualUpdate(dt) {
    }
}
