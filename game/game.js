import assetsLoader from "./modules/loader.js";
import Keyboard from "./modules/keyboard.js";
import Player from "./modules/player.js";
import Fruit from "./modules/fruit.js";
import scoreTraker from "./modules/score.js";
import { generate_Token} from "./modules/utils.js";


const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const devicePixelRatio = window.devicePixelRatio || 1;

canvas.width = canvas.clientWidth * devicePixelRatio;
canvas.height = canvas.clientHeight * devicePixelRatio;
ctx.scale(devicePixelRatio, devicePixelRatio);

CanvasRenderingContext2D.prototype.clear = function(){
    this.clearRect(0, 0, this.canvas.width, this.canvas.height);
}


const Loader = new assetsLoader();

Loader.asset("apple", "../assets/images/apple.png");
Loader.asset("grapes", "../assets/images/grapes.png");
Loader.asset("strawbary", "../assets/images/strawbary.png");
Loader.asset("charries", "../assets/images/charries.png");

Loader.asset("ano", "../assets/characters/ano.png");
Loader.asset("deed", "../assets/characters/deed.png");
Loader.asset("jah", "../assets/characters/jah.png");
Loader.asset("naho", "../assets/characters/naho.png");


class Game{
    constructor(){
        this.objects = [];
        this.Players = new Map();
    }

    render(){
        this.objects.forEach(object => object.render());
        this.Players.forEach(player => player.render());
    }

    collisionHandler(){
        this.Players.forEach(player => {
            const [playerX, playerY] = player.center();
            const radius = player.width; // radius of collision circel
            this.objects.forEach((object, index) =>{
                const distance = Math.sqrt((playerX - object.X) ** 2 + (playerY - object.Y) ** 2);
                if(distance < radius){
                    delete this.objects[index];
                    player.score.incease();
                    const fruit = Loader.get(["apple", "strawbary", "grapes", "charries"]
                                             [Math.floor(Math.random() * 4)]);

                    this.objects.push(new Fruit(ctx, fruit));
                }
            });
        });
    }
}

const Mee = new Game();


function mainloop(){
    ctx.clear();
    Keyboard.apply();
    requestAnimationFrame(mainloop);
}


// Music
const backgroundMusic = new Audio("../assets/sounds/background1.mp3");
backgroundMusic.loop = true;
backgroundMusic.play();

// Network 
const socket = new WebSocket("wss://localhost:8200");
const token = generate_Token();

function initilize(){
    socket.addEventListener('open', () => {
        const request = JSON.stringify({code: 100, body:{token}});
        socket.send(request);
    });

    return new Promise( (resolve, reject) =>{
        socket.addEventListener("message", message =>{
            const {code, message:codeMessage} = JSON.parse(message.data);
            if(code === 201){
                resolve(codeMessage);
            }
            else{
                reject(codeMessage);
            }
        });
    });
}

const profiles = document.querySelectorAll("[data-profile]");

initilize().then(message =>{
    console.log(message);
    const qr = new QRious({
        element: document.getElementById('qr-canvas'),
        value: token,
        size: 138,
        background: '#FFFFFF',
        foreground: '#141D2E',
    });

    socket.addEventListener("message", message =>{
        const response = JSON.parse(message.data);        
        switch (response.code){
            case 400:
                if(Mee.Players.size < 2){
                    const {Action_Identifier: identifier,nickname, character} = response.body;
                    Mee.Players.set(identifier, new Player(nickname, character, identifier, ctx, Loader.get(character), 0, 0));
                    renderConnectedPlayers();
                    if(Mee.Players.size === 2){
                        notification("Players are ready, start the game")
                    }
                    notification(`${nickname} has connected`);
                }
                break;
            case 401: 
                Mee.Players.delete(response.body.Action_Identifier);
                const stat = document.querySelector(`[data-access="${response.body.Action_Identifier}"]`).lastElementChild;
                stat.classList.remove("connected");
                stat.classList.add("not-connected");
                stat.textContent = "Disconnected";
                notification(`Player has disconnected`);

                startButton.disabled = true;

            default:
                break;
        }
    });
});


function renderConnectedPlayers(){
    let index = 0;
    Mee.Players.forEach( player => {
            const {nickname, character} = player.getProfile();
            if(profiles[index]){
                profiles[index].dataset.access = player.identifier;
                profiles[index].innerHTML =
                    `<div class="avatar">
                        <img src="../assets/characters/${character}.png">
                    </div>
                    <div class="nickname">${nickname}</div>
                    <p class="player-stat connected">Connected</p>`;
            }
            index ++;
    });
}

// Start The Game 
const startButton = document.querySelector("[data-start-btn]");
startButton.addEventListener("click", () =>{
    if(Mee.Players.size === 2){
        document.querySelector("[data-wrapper]").remove();
        canvas.style.display = "block";
        Mee.render();
    } else{
        notification(`Can not start the game with ${Mee.Players.size} player`)
    }
});

// Snack Bar 
const snackbarContainer = document.createElement("div");
snackbarContainer.classList.add("snackbar-container");
window.document.body.appendChild(snackbarContainer);

function notification(messsage){
    const snackbar = document.createElement("div");
    snackbar.classList.add("snackbar");
    snackbar.innerHTML = `<div>${messsage}</p>`;
    snackbar.addEventListener("animationend", () =>{
        snackbar.remove();
    });

    snackbarContainer.appendChild(snackbar);
}
