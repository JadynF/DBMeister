import React from "react";
import "./Landing.css"

function Landing() {
    return (
        <div className = "page">
            <header className = "landing-header">
                <div className = "header-title">
                    <h1>DBMeister</h1>
                </div>
                <div className = "header-buttons">
                    <button className = "header-signup">Sign Up!</button>
                    <button className = "header-signin">Sign In</button>
                </div>
            </header>
            <div className = "landing-body">
                Body
            </div>
        </div>
    );
}
  
export default Landing;