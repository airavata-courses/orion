import React, { useState } from 'react';
//import { GoogleLogin, GoogleLogout } from "react-google-login";
//import CLIENT_ID from './../Constants';

export default function HomePage(){
   
    const [date, setDate] = useState();
    const [time, setTime] = useState();
    const [datacenter, setDataCenter] = useState();// 
    // const [userInfo, userInfoUpdate] = useState();// 

    const handleSubmit = async e => {
        e.preventDefault();
        const weather =  {date,time,datacenter};
        fetch('http://localhost:8080/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(weather)
    }).then(()=>{
            console.log('sent')
    })
    }

     // Logout Session and Update State
//     const logout = (response) => {
//     console.log(response);
//     let userInfo = {
//       name: "",
//       emailId: "",
//     };
//     userInfoUpdate(userInfo);

//   };

        return(
        <div className="home-wrapper">
            
            <h1>View Current Atmospheric Conditions</h1>
            
            {/* <GoogleLogout // class or function already defined 
                clientId={CLIENT_ID} // props /attributes passed to child component which is a class/ function
                buttonText={"Logout"}
                onLogoutSuccess={this.logout}
              ></GoogleLogout> */}

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