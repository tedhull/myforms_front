import React from "react";

export default function Navbar({save, toggleTheme, userStatus, username}) {
    return (

        <nav className="navbar redactor-navbar fixed-top navbar-border navbar-expand-lg px-3">
            <a className="navbar-brand" href="#">
                <img src="../docs/4.0/assets/brand/bootstrap-solid.svg" width="30" height="30"
                     className="d-inline-block align-top" alt=""/>
                Myforms
            </a>
            <div className="d-flex position-relative" role="search">
                <input className="form-control search-line me-2" type="search" placeholder="Find Template" aria-label="Search"/>
                <button className="btn btn-primary">Search</button>
            </div>
            <div className="ms-auto d-flex gap-2">
                {userStatus !== "viewer" &&
                    (<button className="btn btn-primary" onClick={save}>Save</button>)}
                {userStatus === "creator" && (
                    <button className="btn btn-primary">Publish</button>
                )}
                {userStatus !== "creator" && (
                    <button className="btn btn-primary" onClick={save}>Add To My Templates </button>
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
                        <li><a className="dropdown-item" href="#">Account</a></li>
                        <li><a className="dropdown-item" href="/logout">Log Out</a></li>
                        <button className="btn"
                                onClick={toggleTheme}>{localStorage.getItem('theme') === 'light' ? "Light Mode" : "Dark Mode"}</button>
                    </ul>
                </div>

            </div>
        </nav>
    );
}