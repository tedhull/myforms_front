import {useEffect, useState} from "react";
import React from "react";
import "../App.css";
import {AppHeader} from "../components/AppHeader";
import Navbar from "../components/Navbar";
import {getUserData} from "../scripts/User";
import axios from "axios";
import {useNavigate} from "react-router-dom";

export function Home({toggleTheme}) {
    const api = process.env.REACT_APP_API_ADDRESS;
    const [username, setUsername] = useState("Guest");
    const [templates, setTemplates] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        setUsername(getUserData().username);
        axios.get(`${api}/templates/latest`, {
            headers: {
                authorization: `Bearer ${localStorage.getItem('access_token')}`,
            }
        }).then((response) => {
            console.log(response);
            setTemplates(JSON.parse(response.data.templates));
        })
    }, [api])

    const handleClick = () => {
        navigate('/create')
    }

    return (
        <AppHeader className={"App-header"}>
            <Navbar
                toggleTheme={toggleTheme}
                username={username}
                view={"home"}
            />
            <div className="container-md mt-5 d-flex flex-column align-items-center">
                <h2 className="mt-3 mb-4 text-center">Latest Templates</h2>

                <div className="table-responsive" style={{maxWidth: "600px", width: "100%"}}>
                    <table className="custom-table table table-hover table-bordered text-center rounded ">
                        <thead className="table-light">
                        <tr>
                        </tr>
                        </thead>
                        <tbody>
                        {templates.length === 0 ? (
                            <tr>
                                <td colSpan="2" className="text-muted">No templates found</td>
                            </tr>
                        ) : (
                            templates.map((item, index) => (
                                <tr key={item.id}>
                                    <td>
                                        <a href={`/edit/${item.id}`} className="text-decoration-none">
                                            {item.title?.trim() || "Untitled Template"}
                                        </a>
                                    </td>
                                </tr>
                            ))
                        )}
                        <tr>
                        </tr>
                        </tbody>
                    </table>
                    <button className={"btn btn-primary"} onClick={handleClick}>Create</button>
                </div>
            </div>
        </AppHeader>

    )
}