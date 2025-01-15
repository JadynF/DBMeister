import React, {useState, useEffect} from "react";
import { Link, useNavigate } from 'react-router-dom';

export default function CreateAccount() {
    //account creation variables
    const [firstName, setFName] = useState("");
    const [lastName, setLName] = useState("");
    const [username, setUName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    //variable to communicate with user
    const [message, setMessage] = useState("");

    //handles changes to user input variables
    const handleFNameChange = (event) => {setFName(event.target.value);}
    const handleLNameChange = (event) => {setLName(event.target.value);}
    const handleUsernameChange = (event) => {setUName(event.target.value);}
    const handlePasswordChange = (event) => {setPassword(event.target.value);}
    const handleEmailChange = (event) => {setEmail(event.target.value);}

    //Validates format of inputted email
    const checkEmail = (email) => {
        const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return re.test(email);
    }

    const navigate = useNavigate();
    const navigateLogin = () => navigate("/Login");

    //function to create an account. When 'Submit' button is pressed, the inputs are sent to the backend. 
    //If the inputted data is acceptable, the account will be created, and the user will be brought into the login page.
    const submitCreateAcct = (event) => {
        if(!checkEmail(email)){
            setMessage("Please enter a valid email.");
            return;
        } else {
            setMessage("Creating your account...");
            event.preventDefault();
            const createAcctQuery = {
                firstName: firstName,
                lastName: lastName,
                username: username,
                password: password,
                email: email
            };
            fetch('http://localhost:8000/Register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(createAcctQuery), //sent as a JSON string
                })
                .then(res => res.json())
                .then(data => setMessage(data.response))
                .catch(error => setMessage(error.response));
        }
    }

    return (
        <div className="right-half">
                <div className="login-box">
                    <h1>Create an Account!</h1>
                        <div className="login-box input">
                            <input type="text" id="fNameIn" placeholder="First Name" onChange={handleFNameChange}></input>
                            <input type="text" id="lNameIn" placeholder="Last Name" onChange={handleLNameChange}></input>
                        </div>
                        <div className="login-box input">
                            <input type="text" id="usernameIn" placeholder="Username" onChange={handleUsernameChange}></input>
                            <input type="password" id="passIn" placeholder="Password" onChange={handlePasswordChange}></input>
                        </div>
                        <div className="login-box input">
                            <input type="text" id="emailIn" placeholder="Email" onChange={handleEmailChange}></input>
                        </div>
                        <button className="login-box button" id="submitCreateAccountBtn" onClick={submitCreateAcct}>Create Account</button>
                    <p>{message}</p>
                    <button id="toLogin" onClick={navigateLogin}>Back to Login Page</button>
                </div>
            </div>
    )
}