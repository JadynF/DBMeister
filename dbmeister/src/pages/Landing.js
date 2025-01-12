import React from "react";
import "./Landing.css";
import Collaboration from "../resources/Collaboration.jpg";

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
                <div className = "body-centered-main">
                    <div className = "inner-text">
                        <h1>Create Free Online Schema Diagrams!</h1>
                        <p>Speed up production and boost understanding in your project by creating a detailed schema. DBMeister allows you to show not only internal data flow, but external as well. The ultimate tool to minimize confusion in your database project.</p>
                        <button className = "header-signup">Create Diagram!</button>
                    </div>
                </div>
                <div className = "body-full">
                    <div className = "collab-image">
                        k
                    </div>
                    <div className = "collab-text">
                        <h1>Increased Collaboration</h1>
                        <h3>DBMeister nurtures collaboration within a development team. Groups can be created within DBMeister so that developer teams can seamlessly work together on the same diagram. Members of the group can interact with each other with a group chat, group priviledge management, real-time diagram changes, and more!</h3>
                    </div>
                </div>
            </div>
        </div>
    );
}
  
export default Landing;