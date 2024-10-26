const WebSocket = require("ws");
const server = new WebSocket.Server({port: 8000});


const clients = new Map();

server.on("connection", ws =>{
    console.log("[#] New Connection");
    
    ws.on("message", message =>{
        const data = JSON.parse(message);
        if(data.requestType === "init"){
            clients.set(data.sender, ws);
        } 

        if(data.requestType === "action" && data.sender === "console"){
            clients.get("game").send(JSON.stringify(data.body));
        }
    });
    
    
});

