const https = require('https');
const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

const privateKey = fs.readFileSync(path.join(__dirname, 'ssl', 'key.pem'), 'utf8');
const certificate = fs.readFileSync(path.join(__dirname, 'ssl', 'cert.pem'), 'utf8');

const server = https.createServer({
  key: privateKey,
  cert: certificate,
});

const wss = new WebSocket.Server({ server });

const PORT = 8200;

const GAMES = new Map();

wss.on("connection", ws =>{
    ws.on("message", message =>{
        const request = JSON.parse(message.toString()); 
        switch (request.code) {
            case 100:
                const gameToken = request.body.token;
                if(gameToken){
                    if(GAMES.has(gameToken)){
                        const response = JSON.stringify({code: 200, message: `${gameToken} has allready initialized`});
                        ws.send(response);
                    } else{
                        GAMES.set(gameToken, new Game(ws, gameToken));

                        const response = JSON.stringify({code: 201, message: "Successfuly initialized"});
                        console.log(`# Game created ${gameToken}`);
                        
                        ws.send(response);
                    }
                }
                break;
                
            case 101:
                const Game_Identifier = request.body.token;
                if(GAMES.has(Game_Identifier)){
                    const Game = GAMES.get(Game_Identifier);
                    if(Game.players.size < 2){
                        const {nickname, character} = request.body;

                        const Player_Identifier = Generate_Identifier(); 
                        const Action_Identifier  =  Generate_Identifier(); 

                        console.log(`# Console connected to ${Game_Identifier}`);
                        console.log(`# nickname: ${nickname}  - ${character}`);
                        
                        Game.players.set(Player_Identifier, new Player(Action_Identifier, Game));
                        Game.host.send(JSON.stringify({code: 400, body:{Action_Identifier,nickname, character}}));
                        ws.send(JSON.stringify({code: 300, body:{Player_Identifier}}));

                        ws.on("close", () =>{
                            console.log("Player not connected");
                            
                            Game.players.delete(Player_Identifier);
                            Game.host.send(JSON.stringify({code: 401, body:{Action_Identifier}}));       
                        });

                    } else{
                        console.log("Can't join the game");
                    }
                    

                } else{
                    console.log("# Game not found");
                }
                break;

            default:
                ws.send({code: 203, body: {message: "invalid code request"}});
                break;
        } 
    });
    
    
});

server.listen(PORT, () => {
  console.log(`Secure WebSocket server is running on wss://localhost:${PORT}`);
});

class Game{
    constructor(host, token){
        this.host = host;
        this.token = token;
        this.players = new Map();
    }
}

class Player{
    constructor(control_identifier, game){
        this.control_identifier = control_identifier;
        this.game = game;
    }

    action(actionRequest){
        game.send(JSON.stringify({control_identifier: this.control_identifier, action:actionRequest}));
    }
}


function Generate_Identifier(length = 16) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let identifier = '';
    for (let i = 0; i < length; i++) {
        identifier += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return identifier;
}
