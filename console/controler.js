const socket = new WebSocket("ws://192.168.27.10:8000");
socket.addEventListener('open', () => {
    socket.send(JSON.stringify({requestType: "init", sender: "console"}));
});

const butttons = document.querySelectorAll("[data-control]");

butttons.forEach(btn =>{
    btn.addEventListener("touchstart", () =>{
        const request = {
            requestType: "action",
            sender: "console",
            body: {
                key: btn.getAttribute("data-control"),
                stat: true,
            }
        }

        socket.send(JSON.stringify(request));
    });

    btn.addEventListener("touchend", () =>{
        const request = {
            requestType: "action",
            sender: "console",
            body: {
                key: btn.getAttribute("data-control"),
                stat: false,
            }
        }

        socket.send(JSON.stringify(request));
    });
});
