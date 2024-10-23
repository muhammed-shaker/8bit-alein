export default class Fruit{
    constructor(ctx, graphics){
        this.X = Math.random() * window.innerWidth - 10;
        this.Y = Math.random() * window.innerHeight - 10;
        this.graphics = graphics;
        this.context = ctx;
    }

    render(){
        this.context.drawImage(this.graphics, this.X, this.Y, 25, 25);
    }
}