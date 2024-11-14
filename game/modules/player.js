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

        this.actions = {r: false, l: false, u: false, d: false};
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

    response(){
        if(this.actions.r) this.move(5, 0);
        if(this.actions.l) this.move(-5, 0);
        if(this.actions.u) this.move(0, -5);
        if(this.actions.d) this.move(0, 5);
    }

    renderProfile(x, y){
        this.ctx.fillStyle = "#333";
        this.ctx.beginPath();
        this.ctx.moveTo(x + 10, y);
        this.ctx.lineTo(x + 180 - 10, y);
        this.ctx.quadraticCurveTo(x + 180, y, x + 180, y + 10);
        this.ctx.lineTo(x + 180, y + 48 - 10);
        this.ctx.quadraticCurveTo(x + 180, y + 48, x + 180 - 10, y + 48);
        this.ctx.lineTo(x + 10, y + 48);
        this.ctx.quadraticCurveTo(x, y + 48, x, y + 48 - 10);
        this.ctx.lineTo(x, y + 10);
        this.ctx.quadraticCurveTo(x, y, x + 10, y);
        this.ctx.closePath();
        this.ctx.fill();

        this.ctx.drawImage(this.graphics, x + 5, y + 10, 30, 30); 

        this.ctx.fillStyle = "#FFF";
        this.ctx.font = "13px Arial";
        this.ctx.fillText(this.nickname.toUpperCase(), x + 45, y + 18); 


        this.ctx.fillStyle = "#FFD700"; 
        this.ctx.font = "12px monospace";
        this.ctx.fillText(`Score: ${this.score}`, x + 55, y + 38); 

    }

    position(){
        return [this.x, this.y];
    }

    center(){
        return [this.x + (this.width / 2), this.y + (this.height / 2)];
    }
}