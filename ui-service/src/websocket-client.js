const ws = new WebSocket("ws://localhost:4000");

ws.onopen = (event) => {
    ws.send("Hi");
};

ws.onmessage = function (event) {
    console.log("Hello")
};
