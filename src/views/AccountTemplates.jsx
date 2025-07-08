import {useEffect, useState} from "react";
import React from 'react';
import '../App.css';
import {AppHeader} from "../components/AppHeader";
import Navbar from "../components/Navbar";
import {getUserData} from "../scripts/User";
import axios from "axios";
import {useNavigate} from "react-router-dom";

export function AccountTemplates({toggleTheme}) {
    const [username, setUsername] = useState("Guest");
    const api = process.env.REACT_APP_API_ADDRESS;
    const [templates, setTemplates] = useState([]);
    const [selectedTemplates, setSelectedTemplates] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${api}/user/templates`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            }
        }).then(res => {
            console.log(res.data);
            setTemplates(JSON.parse(res.data));
        })
        setUsername(getUserData().username);
    }, [api])
    const allSelected = templates.length > 0 && selectedTemplates.length === templates.length;
    const toggleSelection = (id) => {
        setSelectedTemplates(prev =>
            prev.includes(id)
                ? prev.filter(itemId => itemId !== id)
                : [...prev, id]
        );
    };
    const toggleSelectAll = () => {
        if (selectedTemplates.length === templates.length) {
            setSelectedTemplates([]);
        } else {
            setSelectedTemplates(templates.map(t => t.id));
        }
    };
    const deleteTemplates = async (e) => {
        e.preventDefault();
        await axios.delete(`${api}/templates/delete`, {
            data: {
                ids: selectedTemplates
            },
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            }
        }).then(res => {
            setTemplates(prev =>
                prev.filter(template => !selectedTemplates.includes(template.id))
            );

            setSelectedTemplates([]);
        })
    }

    const handleClick = () => {
        navigate('/create')
    }
    return (
        <AppHeader className="App-header">
            <Navbar
                toggleTheme={toggleTheme}
                username={username}
                view={"account"}
                accountSection={"templates"}
                hasSelectedRows={selectedTemplates.length > 0}
                deleteSelected={deleteTemplates}
            />
            <div className="container-md mt-5 d-flex flex-column align-items-center">
                <div className="table-responsive table table-borderless" style={{maxWidth: "900px", width: "100%"}}>
                    <table className="custom-table table table-hover table-borderless text-center rounded">
                        <thead className="table-light ">
                        <tr>
                            <th style={{width: "50px"}}>
                                <input
                                    type="checkbox"
                                    checked={allSelected}
                                    onChange={toggleSelectAll}
                                />
                            </th>
                            <th>Title</th>
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
                                        <input
                                            type="checkbox"
                                            checked={selectedTemplates.includes(item.id)}
                                            onChange={() => toggleSelection(item.id)}
                                        />
                                    </td>
                                    <td>
                                        <a href={`/edit/${item.id}`} className="text-decoration-none">
                                            {item.title || "Untitled Template"}
                                        </a>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                        <button className={"btn btn-primary mt-3"} onClick={handleClick}>Create</button>
                    </table>
                </div>
            </div>
        </AppHeader>
    )
}