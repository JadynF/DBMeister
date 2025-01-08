import "./App.css";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import React from "react"
import Landing from "./pages/Landing.js";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element = {<Landing/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
