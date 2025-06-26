import styled from "styled-components";
import React from "react";

const Toolbar = ({addImage, addQuestion, toggleTheme}) => {
    return (
        <div className="toolbar">
            <button className="btn btn-primary mb-1" onClick={addQuestion}>➕</button>
            <button className="btn btn-secondary mt-1" onClick={addImage}>🖼️</button>
            <button className="btn btn-secondary mt-1"
                    onClick={toggleTheme}>{localStorage.getItem('theme') === 'light' ? "🌙" : "🌞"}</button>
        </div>
    );
}
export default Toolbar;