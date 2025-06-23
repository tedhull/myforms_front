import './App.css';
import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Route, Routes, BrowserRouter} from "react-router-dom";
import {TestCreateTemplate} from "./views/TestCreateTemplate";
import BootstrapTestPage from "./BootstrapTestPage";
import TemplateFinder from "./views/FindTemplate";
import Login from "./views/Login";
import Register from "./views/Signup";
import LogoutHandler from "./scripts/LogoutHandler";
import ProtectedRoute from "./scripts/ProtectedRoute";
import CreateTemplatePage from "./views/CreateTemplate";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<ProtectedRoute> <BootstrapTestPage/></ProtectedRoute>}/>
                <Route path="/create" element={<ProtectedRoute><CreateTemplatePage/></ProtectedRoute>}/>
                <Route path="/find" element={<ProtectedRoute><TemplateFinder/></ProtectedRoute>}/>
                <Route path="/test" element={<ProtectedRoute><TestCreateTemplate/></ProtectedRoute>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="signup" element={<Register/>}/>
                <Route path="logout" element={<LogoutHandler/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default App;

