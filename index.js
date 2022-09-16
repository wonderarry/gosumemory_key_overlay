let socket = new ReconnectingWebSocket("ws://127.0.0.1:24050/ws");
let canvas = document.getElementById('cnv');
let ctx = canvas.getContext("2d");
ctx.fillStyle = 'white';

let s_speed = 1;
let beforekey = 0;
let keyheight = 29.5;
let keyseparator = 4;


socket.onopen = () => {
    console.log("Successfully Connected");
};

socket.onclose = event => {
    console.log("Socket Closed Connection: ", event);
    socket.send("Client Closed!")
};

socket.onerror = error => {
    console.log("Socket Error: ", error);
};


let tempState;
let key1state;
let key2state;

socket.onmessage = event => {
    let data = JSON.parse(event.data);
    if (tempState !== data.menu.state){
        tempState = data.menu.state;

        if (tempState == 2){
            canvas.style.opacity = 1;
        }
        else{
            canvas.style.opacity = 0;
            key1state = 0;
            key2state = 0;
        }
    }
    
    if (data.menu.state == 2){
        if (data.gameplay.keyOverlay.k1.isPressed){
            key1state = 1;
        }
        else{
            key1state = 0;
        }

        if (data.gameplay.keyOverlay.k2.isPressed){
            key2state = 1;
        }
        else{
            key2state = 0;
        }
    }
}



function shiftcanvas(){
    var imagedata = ctx.getImageData(1, 0, ctx.canvas.width - s_speed, ctx.canvas.height)
    ctx.putImageData(imagedata, 0, 0);

    ctx.clearRect(ctx.canvas.width - s_speed, 0, s_speed, ctx.canvas.height);

    if(key1state){
        ctx.fillRect(ctx.canvas.width - s_speed, beforekey, s_speed, keyheight);
    }

    if(key2state){
        ctx.fillRect(ctx.canvas.width - s_speed, beforekey + keyheight + keyseparator, s_speed, keyheight)
    }

}

var shiftingInterval = setInterval(shiftcanvas);

