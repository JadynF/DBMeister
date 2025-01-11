import React from "react";
import Canvas from "../components/Canvas.js";
import { useNavigate}  from "react-router-dom";

export default function Project() {
    const navigate = useNavigate();

    const backToLogin = () => {
        navigate("/Login");
    }

    return (
        <div>
            <div>
                <h1>Canvas</h1>
                <button id="loginNav" onClick={backToLogin}>Go to Login Page</button>
            </div>
            <div>
                <Canvas/>
            </div>
        </div>
    )
}