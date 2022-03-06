export const initWS = (ws, setResponse) => {
    ws.onopen = (event) => {
        ws.send("Hi");
    };
    
    ws.onmessage = function (event) {
        console.log(event.data)
        if(event.data.toString().length>100) {
            setResponse(event.data.toString());
        }
    };    
}