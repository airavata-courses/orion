import React, { useState } from 'react';


export default function HomePage(userData){
   
    const [date, setDate] = useState();
    const [time, setTime] = useState();
    const [datacenter, setDataCenter] = useState();

    console.log("userdata:"+userData);

    const handleSubmit = async e => {
        e.preventDefault();
        const weather =  {date,time,datacenter,userData};
        console.log(weather);
        fetch('http://localhost:8080/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(weather)
    }).then(()=>{
            console.log(weather)
    })
    }

        return(
        <div >
            <h1>View Current Atmospheric Conditions</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    <p><strong>Date</strong></p>
                    <input type="date" onChange={e => setDate(e.target.value)} />
                </label>
                <label>
                    <p><strong>Time</strong></p>
                    <input type="time" onChange={e => setTime(e.target.value)}/>
                </label>
                <label>
                    <p><strong>NEXRAD Center</strong></p>
                    <input type="text" onChange={e => setDataCenter(e.target.value)}/>
                </label>
                 
                 <button type="submit" align="center" >Diagnose Current Atmospheric Conditions </button>
            </form>
        </div> 
        );
}