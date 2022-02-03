import React, { Component } from "react";
import { GoogleLogin, GoogleLogout } from "react-google-login";
import CLIENT_ID from './../Constants';

//const CLIENT_ID ="820065859364-kgh69aa322cq2v5hvp60prdobsr8ekvb.apps.googleusercontent.com";

class GoogleLogoutComponent extends Component {
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
      <div className="login-wrapper">
        <div className="login-wrapper">
          {this.state.isLoggedIn ? (
            <div>
              <h1>Welcome, {this.state.userInfo.name}</h1>

              <GoogleLogout // class or function already defined 
                clientId={CLIENT_ID} // props /attributes passed to child component which is a class/ function
                buttonText={"Logout"}
                onLogoutSuccess={this.logout}
              ></GoogleLogout>
            </div>
          ) : (
            <div>
              <h1>Weather Prediction</h1>
              <h2>Please Login here </h2>
              <GoogleLogin
                clientId={CLIENT_ID}
                buttonText="Sign In with Google"
                onSuccess={this.responseGoogleSuccess}
                onFailure={this.responseGoogleError}
                isSignedIn={true}
                cookiePolicy={"single_host_origin"}
              />
              </div>
          )}
        </div>
      </div>
    );
  }
}
class abc 
{

}
export default GoogleLoginComponent;