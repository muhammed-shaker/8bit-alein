// Player Profile 
const avatar = document.querySelector("[data-avatar]");

const characters = document.querySelectorAll(".character");
characters.forEach(character =>{
    character.addEventListener("change",  event =>{
        if(event.target.checked){
            avatar.src = `../assets/characters/${event.target.value}.png`;
        }
    });
});

const nickname = document.getElementById("nickname");
nickname.value = generate_NickName();

function generate_NickName(){
    return `player-${Math.random().toString(36).substr(2, 6)}`;
}

// Console
let GAME_IDENTIFIER, PLAYER_IDENTIFIER;

const socket = new WebSocket("wss://192.168.27.13:8200");  
socket.onmessage = function(message){
    const response = JSON.parse(message.data);
    if(response.code === 300){
        console.log("Console connected successfully.")
        GAME_IDENTIFIER = response.body.Game_Identifier;
        PLAYER_IDENTIFIER = response.body.Player_Identifier;
    }
}

const butttons = document.querySelectorAll("[data-console-action-btn]");
butttons.forEach(btn =>{
    btn.addEventListener("touchstart", () =>{
        if(GAME_IDENTIFIER && PLAYER_IDENTIFIER){
            const request = {
                code: 102,
                body: {
                    GAME_IDENTIFIER,
                    PLAYER_IDENTIFIER,
                    action: btn.getAttribute("data-action"),
                    value: true,
                }
            }
            socket.send(JSON.stringify(request));
        }
    });

    btn.addEventListener("touchend", () =>{
        if(GAME_IDENTIFIER && PLAYER_IDENTIFIER){
            const request = {
                code: 102 ,
                body: {
                    GAME_IDENTIFIER,
                    PLAYER_IDENTIFIER,
                    action: btn.getAttribute("data-action"),
                    value: false,
                }
            }
            socket.send(JSON.stringify(request));
        }
    });
});

// QR Scanner 
const scanButton = document.querySelector("[data-connect-console-btn]");
let qrScanner;

scanButton.addEventListener("click", () =>{
    document.querySelector("[data-qr-scaner]").style.setProperty("display", "flex");

    if(!qrScanner){
        qrScanner = new Html5Qrcode("qr-reader");
    }

    qrScanner.start(
        { facingMode: "environment" }, 
        { fps: 10, qrbox: 250 }, 
        onScanSuccess, 
        onScanFailure,
    ).catch(error => {
        console.error("Error starting QR scanner:", error);
    });
});

function onScanSuccess(token) {
    const character = document.querySelector('[name="character"]:checked').value;
    const request = JSON.stringify({code: 101, body:{
        token, 
        nickname: nickname.value,
        character,
    }});
    socket.send(request);
    qrScanner.stop()
                .then(() => {
                    console.log("QR code scanning stopped."); 
                    document.querySelector("[data-qr-scaner]").remove();
                    document.querySelector("[data-player-profile]").remove();
                    document.querySelector(".console").style.display = "flex";
                })
                .catch(error => {
                    console.error("Error stopping the QR scanner: ", error);
                });
}




function onScanFailure(error) {
    console.warn(`QR Code scanning failed: ${error}`);
}
