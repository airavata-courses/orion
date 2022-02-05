import React, { Component } from "react";
import { GoogleLogin, GoogleLogout } from "react-google-login";
const CLIENT_ID ="820065859364-kgh69aa322cq2v5hvp60prdobsr8ekvb.apps.googleusercontent.com";


function GoogleLogoutComp(){
        const onSuccess=()=>{
            console.log('Logout Made Successfully')
        };
       
        
        return(
            <div>
              <GoogleLogout
                clientId={CLIENT_ID}
                onLogoutSuccess={onSuccess}
                buttontext="Sign In with Google"

              />
            </div>
        );
}

export default GoogleLogoutComp;