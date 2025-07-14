import React from "react";

export default function Navbar({
                                   save,
                                   toggleTheme,
                                   userStatus,
                                   username,
                                   edit,
                                   submit,
                                   publish,
                                   editing,
                                   view,
                                   templateId,
                                   accountSection,
                                   hasSelectedRows,
                                   deleteSelected,
                                   banSelected,
                                   promoteSelected,
                                   restrictSelected,
                                   unbanSelected,
                               }) {
    return (

        <nav className="navbar redactor-navbar fixed-top navbar-border navbar-expand-lg px-3">
            <a className="navbar-brand" href="/">
                <img src="../docs/4.0/assets/brand/bootstrap-solid.svg" width="30" height="30"
                     className="d-inline-block align-top" alt=""/>
                <span className={"brand-text ms-2"}>Myforms</span>
            </a>
            <div className="d-flex position-relative" role="search">
                <input className="form-control search-line me-2" type="search" placeholder="Find Template"
                       aria-label="Search"/>
                <button className="btn btn-primary">Search</button>
            </div>

            {view !== "form" && editing && userStatus !== "viewer" && (
                <div className="navbar-center-tabs-container">
                    <ul className="nav nav-underline navbar-center-tabs justify-content-center">
                        <li className="nav-item">
                            <a className={`nav-link ${view === "redactor" ? "active" : ""}`}
                               href={`/edit/${templateId}`}>Redactor</a>
                        </li>
                        <li className="nav-item">
                            <a className={`nav-link ${view === "table" ? "active" : ""}`}
                               href={`/list/${templateId}`}>Responses</a>
                        </li>
                    </ul>
                </div>
            )}
            {view === "account" && (
                <div className="navbar-center-tabs-container">
                    <ul className="nav nav-underline navbar-center-tabs justify-content-center">
                        <li className="nav-item">
                            <a className={`nav-link ${accountSection === "forms" ? "active" : ""}`}
                               href={`/user/forms`}>forms</a>
                        </li>
                        <li className="nav-item">
                            <a className={`nav-link ${accountSection === "templates" ? "active" : ""}`}
                               href={`/user/templates`}>templates</a>
                        </li>
                        {userStatus === "admin" && (
                            <li className="nav-item">
                                <a className={`nav-link ${accountSection === "users" ? "active" : ""}`}
                                   href={`/user/admin`}>users</a>
                            </li>
                        )}
                    </ul>
                </div>
            )}

            <div className="ms-auto d-flex gap-2">
                {view === "redactor" && (
                    <div className={"ms-auto d-flex gap-2"}>
                        {userStatus !== "viewer" && !editing &&
                            (<button className="btn btn-primary" onClick={save}>Save</button>)}
                        {userStatus !== "viewer" && editing &&
                            (<button className={"btn btn-primary"} onClick={edit}>Save</button>)}
                        {userStatus === "creator" && (
                            <button className="btn btn-primary" onClick={publish}>Publish</button>
                        )}
                        {userStatus !== "creator" && (
                            <button className="btn btn-primary" onClick={save}>Add To My Templates </button>
                        )}
                    </div>
                )}
                {view === "form" && (
                    <div className={"ms-auto d-flex gap-2"}>
                        <button className="btn btn-primary" onClick={submit}>Submit</button>
                    </div>
                )}
                {view === "account" && hasSelectedRows && (
                    <div className={"ms-auto d-flex gap-2"}>
                        <button className="btn btn-danger" onClick={deleteSelected}>Delete</button>
                        {accountSection === "users" && (
                            <div className={"ms-auto d-flex gap-2"}>
                                <button className={"btn btn-danger ms-auto"} onClick={banSelected}>Ban</button>
                                <button className={"btn btn-danger ms-auto"} onClick={restrictSelected}>Restrict
                                </button>
                                <button className="btn btn-primary ms-auto" onClick={unbanSelected}>Unban</button>
                                <button className="btn btn-success ms-auto" onClick={promoteSelected}>Grant</button>
                            </div>
                        )}
                    </div>
                )}

                <div className="dropdown">
                    <button
                        className="btn btn-secondary dropdown-toggle"
                        type="button"
                        id="dropdownMenuButton"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        {username}
                    </button>
                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                        <li><a className="dropdown-item" href="/user/forms">Account</a></li>
                        <li><a className="dropdown-item" href="/logout">Log Out</a></li>
                        <li><a className={"dropdown-item"} href={`/connect/${process.env.REACT_APP_SF_FORM_ID}`}>Add Salesforce</a>
                        </li>
                        <button className="btn"
                                onClick={toggleTheme}>{localStorage.getItem('theme') === 'light' ? "Light Mode" : "Dark Mode"}</button>
                    </ul>
                </div>
            </div>
        </nav>
    )
        ;
}