export default class Player{
    constructor(x, y, width, height, graphics, ctx){
        this.X  = x; 
        this.Y = y; // (X,Y) intial position : constants
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.graphics = graphics;
        this.ctx = ctx;
    }

    home(){
        this.x = this.X;
        this.y = this.Y;
    }
    
    move(h, v){
        if(!(this.x + h < 0 || this.x + h > 600 - 50)){ 
            this.x += h;
        }
        if(!(this.y + v < 0 || this.y + v >  548 - 50)){ 
            this.y += v;
        }
    }

    render(){
        this.ctx.drawImage(this.graphics, this.x, this.y, this.width, this.height);
    }

    position(){
        return [this.x, this.y];
    }

    center(){
        return [this.x + (this.width / 2), this.y + (this.height / 2)];
    }
}