export const initWS = (ws, setResponse) => {
    ws.onopen = (event) => {
        ws.send("Hi");
    };
    
    ws.onmessage = function (event) {
        console.log(event.data)
        if(event.data.toString().length>100) {
            const json_data = JSON.parse(event.data.toString())
            setResponse(json_data[0]);
        }
    };    
}