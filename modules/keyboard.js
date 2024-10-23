export default class Keyboard{
    static keys = {};
    static actions = []; 
    static record(context = window){
        context.addEventListener("keydown", event =>{
            this.keys[event.code] = true;
        });
        
        context.addEventListener("keyup", event =>{
            this.keys[event.code] = false;
        });
    }

    static on(key, callBack){;
        this.actions.push({key, callBack});
    }

    static apply(){
        this.actions.forEach( action =>{
            if(this.keys[action.key]){
                action.callBack();
            }
        });
    }
}