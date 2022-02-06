// import React, { Component } from "react";
// import { GoogleLogin, GoogleLogout } from "react-google-login";
// const CLIENT_ID ="820065859364-kgh69aa322cq2v5hvp60prdobsr8ekvb.apps.googleusercontent.com";


// function GoogleLoginComp(){
//         const onSuccess=(res)=>{
//             let userInfo = {
//                 name: res.profileObj.name,
//                 emailId: res.profileObj.email,
//               };
//             console.log('[Login Success] currentUser:',res.profileObj)
//         };
//         const OnFailure=(res)=>{
//             console.log('[Login Failed]:',res) 
//         };
//         return(
//             <div>
//               <h1 class="Google-header">Welcome, {userInfo.name}</h1>

//               <GoogleLogin
//                 clientId={CLIENT_ID}
//                 buttontext="Sign In with Google"
//                 onSuccess={onSuccess}
//                 onFailure={onFailure}
//                 isSignedIn={true}
//                 cookiePolicy={"single_host_origin"}
//               />
//             </div>
//         );
// }

// export default GoogleLoginComp;