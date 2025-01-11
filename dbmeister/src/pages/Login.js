import React, {useState, useEffect, useCallback} from "react";
import ReactFlow, { addEdge, MiniMap, Controls, Background, applyNodeChanges, applyEdgeChanges } from "reactflow";
import "reactflow/dist/style.css";
import { Link, useNavigate } from 'react-router-dom';
import "./Login.css";

const loginNodes = [
    { id: "1", position: { x: 250, y: -50 }, data: { label: "Welcome" }, style: {background: "#FFD700"}},
    { id: "2", position: { x: 100, y: 100 }, data: { label: "To" }, style: {background: "#4169E1", color: "#ffffff"} },
    { id: "3", position: { x: 400, y: 250 }, data: { label: "DBMeister!" }, style: {background: "#FFD700"} },
];
const loginEdges = [
    { id: "e1-2", source: "1", target: "2", animated: true },
    { id: "e2-3", source: "2", target: "3" },
];

export default function Login() {
    //Variables for user input
    const [uNameInput, setUName] = useState("");
    const [passInput, setPassword] = useState("");
    //Variable for value returned from the backend
    const [loginMessage, setLoginMessage] = useState("");

    const [nodes, setNodes] = useState(loginNodes);
    const [edges, setEdges] = useState(loginEdges);

    const onNodesChange = useCallback(
        (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
        []
      );
    
      const onEdgesChange = useCallback(
        (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        []
      );
    
      const onConnect = useCallback(
        (connection) => setEdges((eds) => addEdge(connection, eds)),
        []
      );

    //handle changes to username and password input
    const handleUsernameChange = (event) => setUName(event.target.value);
    const handlePasswordChange = (event) => setPassword(event.target.value);

    const navigate = useNavigate();
    const navigateSignUp = () => navigate("/CreateAccount");


    //function to login. When 'Log In' button is pressed, the inputs are sent to the backend. 
    //If the login info matches a user in the database, the user will be sent to the home page.
    const submitLogin = () => {
        const loginQuery = {
            username: uNameInput,
            password: passInput
        };
        fetch('http://localhost:8000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginQuery), //sent as a JSON string
            })
            .then(res => res.json())
            .then(data => {
                if (data.response === "accepted") {
                    setLoginMessage("Login accepted. Taking you to dashboard...");
                    //localStorage.setItem('token', data.token);
                    navigate("/Dashboard");
                }
                else {
                    setLoginMessage("Login rejected. Please enter valid credentials...");
                }
            })
            .catch(error => console.error(error));
    }

    return (
        <div className="login-container">
            <div className="left-half">
                <div style={{ height: "100vh", width: "100%" }}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    fitView
                >
                    <Controls />
                    <Background color="#aaa" gap={16} />
                </ReactFlow>
                </div>
            </div>
            <div className="right-half">
                <div className="login-box">
                    <h1>LOGIN PAGE</h1>
                        <div className="login-box input">
                            <input type="text" id="usernameIn" placeholder="username" onChange={handleUsernameChange}></input>
                        </div>
                        <div className="login-box input">
                            <input type="password" id="passIn" placeholder="password" onChange={handlePasswordChange}></input>
                        </div>
                        <button className="login-box button" id="submitLogin" onClick={submitLogin}>Log In</button>
                    <p>{loginMessage}</p>
                    <button id="toSignUp" onClick={navigateSignUp}>Create an Account</button>
                </div>
            </div>
        </div>
    )
}