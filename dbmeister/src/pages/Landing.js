import React from "react";
import "./Landing.css"
import {useNavigate} from "react-router-dom";

function Landing() {
    const navigate = useNavigate();

    const navigateLogin = () => navigate("/Login");
    const navigateCreateAccount = () => navigate("/CreateAccount");


    return (
        <div className = "page">
            <header className = "landing-header">
                <div className = "header-title">
                    <h1>DBMeister</h1>
                </div>
                <div className = "header-buttons">
                    <button className = "header-signup" onClick={navigateCreateAccount}>Sign Up!</button>
                    <button className = "header-signin" onClick={navigateLogin}>Sign In</button>
                </div>
            </header>
            <div className = "landing-body">
                Body
            </div>
        </div>
    );
}
  
export default Landing;