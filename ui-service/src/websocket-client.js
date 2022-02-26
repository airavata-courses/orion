export const initWS = (ws, setResponse) => {
    ws.onopen = (event) => {
        ws.send("Hi");
    };
    
    ws.onmessage = function (event) {
        console.log("Hello")
    };    
}