import './App.css';
import React from "react";
import {Route, Routes, BrowserRouter} from "react-router-dom";
import CreateTemplatePage from "./views/CreateTemplate";
import BootstrapTestPage from "./BootstrapTestPage";
import TemplateFinder from "./views/FindTemplate";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<BootstrapTestPage/>}/>
                <Route path="/create" element={<CreateTemplatePage/>}/>
                <Route path="/find" element={<TemplateFinder/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default App;

