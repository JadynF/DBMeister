import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Landing from "./pages/Landing.js";
import Login from "./pages/Login.js";
import CreateAccount from "./pages/CreateAccount.js";
import Dashboard from "./pages/Dashboard.js";
import Project from "./pages/Project.js";
import NotFound from "./pages/NotFound.js";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element = {<Landing/>} />
          <Route path="/Login" element = {<Login/>} />
          <Route path="/CreateAccount" element = {<CreateAccount/>} />
          <Route path="/Dashboard" element = {<Dashboard/>} />
          <Route path="/Project" element = {<Project/>} />
          {/* Catch all other non-specified routes as 'Not Found' */}
          <Route path="*" element = {<NotFound/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
