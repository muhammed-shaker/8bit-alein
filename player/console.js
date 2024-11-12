
// const butttons = document.querySelectorAll("[data-control]");

// butttons.forEach(btn =>{
//     btn.addEventListener("touchstart", () =>{
//         const request = {
//             code: 0 ,
//             body: {
//                 key: btn.getAttribute("data-control"),
//                 stat: true,
//             }
//         }

//         socket.send(JSON.stringify(request));
//     });

//     btn.addEventListener("touchend", () =>{
//         const request = {
//             code: 0,
//             body: {
//                 key: btn.getAttribute("data-control"),
//                 stat: false,
//             }
//         }
//     });
// });



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
    const socket = new WebSocket("wss://192.168.27.11:8200");    
    socket.addEventListener("open", () =>{
        const request = JSON.stringify({code: 101, body:{
            token, 
            nickname: nickname.value,
            character,
        }});
        socket.send(request);
    });

    qrScanner.stop()
                .then(() => {
                    console.log("QR code scanning stopped."); 
                    document.querySelector("[data-qr-scaner]").remove();
                    document.querySelector("[data-player-profile]").remove();
                    document.body.textContent = "Console Connected Successfully";
                    
                })
                .catch(error => {
                    console.error("Error stopping the QR scanner: ", error);
                });
    
}

function onScanFailure(error) {
    console.warn(`QR Code scanning failed: ${error}`);
}
