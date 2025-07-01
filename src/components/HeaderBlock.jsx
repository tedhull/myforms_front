import React from "react";

const HeaderBlock = ({
                         title,
                         setTitle,
                         description,
                         setDescription,
                         textareaRef,
                         tags,
                         setTags,
                         topic,
                         setTopic,
                         userStatus
                     }) => {
    return (<div className="container mt-5 d-flex justify-content-center">
        <div className="card shadow card-with-top-left-border"
             style={{width: "100%", maxWidth: "800px"}}>
            <div className="card-body">
                <fieldset disabled={userStatus === "viewer"}>
                    <input
                        type="text"
                        className={"form-control mt-3"}
                        style={{height: "40px"}}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter template title"
                    />
                    <textarea
                        ref={textareaRef}
                        className={"form-control mt-3"}
                        rows="1"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter template description"
                        style={{overflow: 'hidden', resize: 'none'}}
                    />
                    <input
                        className={"form-control mt-3"}
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="Specify tags"
                    />
                    <div className="form-group col-md-4 mt-3">
                        <select value={topic} id="inputState" className="form-control"
                                onChange={(e) => setTopic(e.target.value)}>
                            <option>Topic</option>
                            <option>Registration</option>
                            <option>Quiz/Test Form</option>
                            <option>Job Application</option>
                            <option>Onboarding</option>
                            <option>Survey</option>
                            <option>Checklist</option>
                            <option>Other</option>
                        </select>
                    </div>
                </fieldset>
            </div>
        </div>
    </div>)
}
export default HeaderBlock;