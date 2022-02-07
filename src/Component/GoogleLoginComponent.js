import React, { Component } from "react";
import { GoogleLogin, GoogleLogout } from "react-google-login";
import '../styles/GoogleLoginComponent.css';
import HomePage from "./HomePage";
const CLIENT_ID ="820065859364-kgh69aa322cq2v5hvp60prdobsr8ekvb.apps.googleusercontent.com";

class GoogleLoginComponent extends Component {
  constructor() {
    super();
    this.state = {
      isLoggedIn: false,
      userInfo: {
        name: "",
        emailId: "",
      },
    };
  }

  // Success Handler
  responseGoogleSuccess = (response) => {
    console.log();
    let userInfo = {
      name: response.profileObj.name,
      emailId: response.profileObj.email,
    };
    this.setState({ userInfo, isLoggedIn: true });
  };

  // Error Handler
  responseGoogleError = (response) => {
    console.log(response);
  };

  // Logout Session and Update State
  logout = (response) => {
    console.log(response);
    let userInfo = {
      name: "",
      emailId: "",
    };
    this.setState({ userInfo, isLoggedIn: false });
  };

  render() {
    return (
      <div >
          {this.state.isLoggedIn ? (
            <div>
              <h1 className="Google-header">Welcome, {this.state.userInfo.name}</h1>
              <GoogleLogout
                clientId={CLIENT_ID}
                buttonText={"Logout"}
                onLogoutSuccess={this.logout}
              ></GoogleLogout>
              <HomePage useremail={this.state.userInfo.emailId}/>
              
              
            </div>
          ) : (
            <GoogleLogin
              clientId={CLIENT_ID}
              buttonText="Sign In with Google"
              onSuccess={this.responseGoogleSuccess}
              onFailure={this.responseGoogleError}
              isSignedIn={true}
              cookiePolicy={"single_host_origin"}
            />
          )}
     
      </div>
    );
  }
}
export default GoogleLoginComponent;