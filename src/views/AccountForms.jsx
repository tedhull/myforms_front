import {useEffect, useState} from "react";
import React from 'react';
import '../App.css';
import {AppHeader} from "../components/AppHeader";
import Navbar from "../components/Navbar";
import {getUserData} from "../scripts/User";
import axios from "axios";

export function AccountForms({toggleTheme}) {
    const [username, setUsername] = useState("Guest");
    const api = process.env.REACT_APP_API_ADDRESS;
    const [forms, setForms] = useState([]);
    const userId = getUserData().id;
    useEffect(() => {
        axios.get(`${api}/user/forms`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            }
        }).then(res => {
            setForms(JSON.parse(res.data));
        })
        setUsername(getUserData().username);
    }, [api])

    return (
        <AppHeader className="App-header">
            <Navbar
                toggleTheme={toggleTheme}
                username={username}
                view={"account"}
                accountSection={"forms"}
            />
            <div className="container-md mt-5 d-flex flex-column align-items-center">
                <div className="table-responsive" style={{maxWidth: "600px", width: "100%"}}>
                    <table className="custom-table table table-hover table-borderless text-center rounded ">
                        <thead className="table-light">
                        <tr>
                        </tr>
                        </thead>
                        <tbody>
                        {forms.length === 0 ? (
                            <tr>
                                <td colSpan="2" className="text-muted">No templates found</td>
                            </tr>
                        ) : (
                            forms.map((item, index) => (
                                <tr key={item.id}>
                                    <td>
                                        <a href={`/correct/${item.template.id}/${userId}`}
                                           className="text-decoration-none">
                                            {item.template.title || "Untitled Form"}
                                        </a>
                                    </td>
                                </tr>
                            ))
                        )}
                        <tr>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </AppHeader>
    )
}