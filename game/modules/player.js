export default class Player{
    constructor(nickname, character, identifier, context, graphics, x, y){

        this.identifier = identifier;

        this.nickname = nickname;
        this.character = character;
        this.score = 0;

        this.x = x;
        this.y = y;
        this.socre = 0;
        this.width = 50;
        this.height = 50;
        this.graphics = graphics;
        this.ctx = context;
    }

    getProfile(){
        return {
            nickname: this.nickname,
            character: this.character
        }
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
        console.log("rendered");
        
        this.ctx.drawImage(this.graphics, this.x, this.y, this.width, this.height);
    }

    position(){
        return [this.x, this.y];
    }

    center(){
        return [this.x + (this.width / 2), this.y + (this.height / 2)];
    }
}