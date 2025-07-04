import React from "react";
import MarkdownRenderer from "./MarkdownRederer";

const HeaderBlock = ({
                         title,
                         description,
                         tags,
                         topic,
                         userStatus
                     }) => {
    return (<div className="container mt-5 d-flex justify-content-center">
        <div className="card shadow card-with-top-left-border"
             style={{width: "100%", maxWidth: "800px"}}>
            <div className="card-body">
                <fieldset disabled={userStatus === "viewer"}>
                    <div className={"mt-3"}>
                        <MarkdownRenderer markdownText={title}/>
                    </div>
                    <div className="mt-3">
                        <MarkdownRenderer markdownText={description}/>
                    </div>
                    <div className={" mt-lg-5"}>
                        <MarkdownRenderer markdownText={topic}/>
                    </div>
                    <div className=" col-md-4 mt-3">
                        <MarkdownRenderer markdownText={tags}/>
                    </div>
                </fieldset>
            </div>
        </div>
    </div>)
}
export default HeaderBlock;