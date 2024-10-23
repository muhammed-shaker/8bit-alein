export default class scoreTraker{
    constructor(ctx){
        this.value = 0;
        this.x = 10;
        this.y = 20;
        this.context = ctx;
    }

    render(){
        this.context.fillStyle = "#FFF";
        this.context.fillText(`SCORE: ${this.value}`, this.x, this.y);
    }

    setPosition(x, y){
        this.x = x;
        this.y = y;
    }

    increase(){
        this.value ++;
        if(this.onchange){
            this.onchange(this.score);
        }
    }

    reset(){
        this.score = 0;
    }

    onchange = null;
}