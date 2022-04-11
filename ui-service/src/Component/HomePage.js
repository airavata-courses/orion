import React, { useState, useEffect } from 'react';
import useForm from '../utils/useForm';
import { initWS } from '../websocket-client.js';

import { ToggleSwitch } from './ToggleSwitch'

// post request to gateway/ingester
async function sendData(data, format) {
    // return fetch('http://149.165.155.203:30001/nexrad', {
    return fetch(`http://localhost:4000/${format ? 'nexRad' : 'merra'}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
}


export default function HomePage(userData) {

    const [date, setDate] = useState();
    const [time, setTime] = useState();
    const [datacenter, setDataCenter] = useState();
    const [format, setFormat] = useState(true);

    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const [minLatitude, setMinLatitude] = useState();
    const [maxLatitude, setMaxLatitude] = useState(); 
    const [minLongitude, setMinLongitude] = useState();
    const [maxLongitude, setMaxLongitude] = useState();
    const [merraDate, setMerraDate] = useState();

    const [response, setResponse] = useState();

    useEffect(() => {
        // const ws = new WebSocket("ws://149.165.155.203:30001");
        const ws = new WebSocket("ws://localhost:4000");
        initWS(ws, setResponse)
    }, [])

    var res = []
    //var userEmail = userData["useremail"]
    // response from the backend 
    const formSubmit = async e => {
        if (e) e.preventDefault();
        //res = await sendData({date,time,datacenter,userEmail});
        if (format) res = await sendData({ date, time, datacenter }, format);
        else res = await sendData({ username, password, minLatitude, maxLatitude, minLongitude, maxLongitude, merraDate}, format)
        //setResponse(res);
        console.log(response);
    }

    // const {handleChange, values,errors,handleSubmit } = useForm(formSubmit);
    return (
        <div >

            <h1>View Current Atmospheric Conditions</h1>
            {/* <div class="storybook">
            	<div id="storybook"></div>
            </div> */}
            <ToggleSwitch format={format} setFormat={setFormat} />
            {
                format ? (
                    <form onSubmit={formSubmit}>
                        <label>
                            <p><strong>Date</strong></p>
                            <input type="date" id="date" onChange={e => setDate(e.target.value)} />
                            {/* <input type="date" name="date" onChange={handleChange} />  */}

                        </label>
                        <label>
                            <p><strong>Time</strong></p>
                            <input type="time" id="time" onChange={e => setTime(e.target.value)} />

                        </label>
                        <label>
                            <p><strong>NEXRAD Center</strong></p>
                            <input type="text" id="datacenter" onChange={e => setDataCenter(e.target.value)} />

                        </label>
                        <button type="submit" align="center" >Diagnose Current Atmospheric Conditions </button>
                    </form>
                ) : (
                    <form onSubmit={formSubmit}>
                        <label>
                            <p><strong>Username</strong></p>
                            <input type="text" id="username" onChange={e => setUsername(e.target.value)} />
                            {/* <input type="date" name="date" onChange={handleChange} />  */}
                        </label>
                        <label>
                            <p><strong>Password</strong></p>
                            <input type="password" id="password" onChange={e => setPassword(e.target.value)} />
                            {/* <input type="date" name="date" onChange={handleChange} />  */}
                        </label>
                        <label>
                            <p><strong>Min Latitude</strong></p>
                            <input type="text" id="minLatitude" onChange={e => setMinLatitude(e.target.value)} />
                            {/* <input type="date" name="date" onChange={handleChange} />  */}
                        </label>
                        <label>
                            <p><strong>Max Latitude</strong></p>
                            <input type="text" id="maxLatitude" onChange={e => setMaxLatitude(e.target.value)} />
                            {/* <input type="date" name="date" onChange={handleChange} />  */}
                        </label>
                        <label>
                            <p><strong>Min Longitude</strong></p>
                            <input type="text" id="minLongitude" onChange={e => setMinLongitude(e.target.value)} />
                            {/* <input type="date" name="date" onChange={handleChange} />  */}
                        </label>
                        <label>
                            <p><strong>Max Longitude</strong></p>
                            <input type="text" id="maxLongitude" onChange={e => setMaxLongitude(e.target.value)} />
                            {/* <input type="date" name="date" onChange={handleChange} />  */}
                        </label>
                        <label>
                            <p><strong>Date</strong></p>
                            <input type="date" id="merraDate" onChange={e => setMerraDate(e.target.value)} />
                            {/* <input type="date" name="date" onChange={handleChange} />  */}
                        </label>
                        <button type="submit" align="center" >Diagnose Current Atmospheric Conditions </button>
                    </form>
                )
            }
            {
                response && <img src={`data:image/png;base64,${response}`} key={response} />
            }
        </div>
    );
}
