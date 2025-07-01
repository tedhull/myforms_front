import styled from "styled-components";
import React from "react";

const Toolbar = ({addImage, addQuestion, userStatus}) => {
    return (
        <div>
            {userStatus !== "viewer" && (
                <div className="toolbar">
                    <button className="btn btn-primary mb-1" onClick={addQuestion}>➕</button>
                    <button className="btn btn-secondary mt-1" onClick={addImage}>🖼️</button>
                </div>
            )}
        </div>
    );
}
export default Toolbar;