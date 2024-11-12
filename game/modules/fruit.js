export default class Fruit{
    constructor(ctx, graphics){
        this.X = Math.random() * 600 - 10;
        this.Y = Math.random() * 538 - 10;
        this.graphics = graphics;
        this.context = ctx;
    }

    render(){
        this.context.drawImage(this.graphics, this.X, this.Y, 25, 25);
    }
}