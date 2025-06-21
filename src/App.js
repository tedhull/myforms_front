import './App.css';
import React from "react";
import {Route, Routes, BrowserRouter} from "react-router-dom";
import CreateTemplatePage from "./views/CreateTemplate";
import BootstrapTestPage from "./BootstrapTestPage";
import TemplateFinder from "./views/FindTemplate";
import Login from "./views/Login";
import Register from "./views/Signup";
import LogoutHandler from "./scripts/LogoutHandler";
import ProtectedRoute from "./scripts/ProtectedRoute";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<ProtectedRoute> <BootstrapTestPage/></ProtectedRoute>}/>
                <Route path="/create" element={<CreateTemplatePage/>}/>
                <Route path="/find" element={<TemplateFinder/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="signup" element={<Register/>}/>
                <Route path="logout" element={<LogoutHandler/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default App;

