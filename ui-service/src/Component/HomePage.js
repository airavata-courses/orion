import React, { useState, useEffect } from 'react';
import useForm from '../utils/useForm';
import { initWS } from '../websocket-client.js';


// post request to gateway/ingester
async function sendData(data) {
    return fetch('http://149.165.155.203:30001/orionweather', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(data => data.json())
   }


export default function HomePage(userData){
   
    const [date, setDate] = useState();
    const [time, setTime] = useState();
    const [datacenter, setDataCenter] = useState();
   
    const [response, setResponse] = useState([]);

    useEffect(() => {
        const ws = new WebSocket("ws://149.165.155.203:30001");
        initWS(ws, setResponse)
    }, [])

    var res = []
    //var userEmail = userData["useremail"]
    // response from the backend 
    const formSubmit = async e => {
        if(e) e.preventDefault();
        //res = await sendData({date,time,datacenter,userEmail});
        res = await sendData({date,time,datacenter});
	setResponse(res);
        console.log(response);                                        
    }

    // const {handleChange, values,errors,handleSubmit } = useForm(formSubmit);
        return(
        <div >
            <h1>View Current Atmospheric Conditions</h1>
            <form onSubmit={formSubmit}>
                <label>
                    <p><strong>Date</strong></p>
                    <input type="date" id="date" onChange={e => setDate(e.target.value)} />
                    {/* <input type="date" name="date" onChange={handleChange} />  */}

                </label>
                <label>
                    <p><strong>Time</strong></p>
                    <input type="time" id="time" onChange={e => setTime(e.target.value)}/>
                    {/* <input type="time" name="time" onChange={handleChange} />  */}

                </label>
                <label>
                    <p><strong>NEXRAD Center</strong></p>
                    <input type="text" id="datacenter" onChange={e => setDataCenter(e.target.value)}/>
                    {/* <input type="text" name="datacenter" onChange={handleChange} />  */}

                </label>
                 <button type="submit" align="center" >Diagnose Current Atmospheric Conditions </button>
            </form>
            {
                response.map(e1=>
                    <img src={`data:image/png;base64,${e1}`} alt="Plot" key={e1}/>)
            }
        </div> 
        );
        }
