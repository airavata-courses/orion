export const initWS = (ws, setResponse) => {
    ws.onopen = (event) => {
        ws.send("Hi");
        console.log("WebSocket connection opened");
    };
    
    ws.onmessage = function (event) {
        if(event && event.data) { 
            console.log("This is the event data coming from the Gateway: ", event.data)
            if(event.data.toString().length>100) {
                const json_data = JSON.parse(event.data.toString());
                setResponse(json_data[0]);
                console.log("This is at the incoming socket: ", json_data);
            }
        } else {
            console.log("WebSocket message event error", event);
        }
    };    
    
    ws.onclose = (event) => {
        console.log("WebSocket connection closed");
    }
    // ws.on('message', (message) => {
    
    //     //log the received message and send it back to the client
    //     console.log(`received: %s`, message);
    //     // ws.send(`Hello, you sent -> ${message}`);
    // });
}