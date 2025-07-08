import {useEffect, useState} from "react";
import React from 'react';
import '../App.css';
import {AppHeader} from "../components/AppHeader";
import Navbar from "../components/Navbar";
import {getUserData} from "../scripts/User";
import axios from "axios";
import {useNavigate} from "react-router-dom";

export function AccountUsers({toggleTheme}) {
    const [username, setUsername] = useState("Guest");
    const api = process.env.REACT_APP_API_ADDRESS;
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const navigate = useNavigate();
    const [userId, setUserId] = useState('');
    const [userName, setUserName] = useState('');
    const [userStatus, setUserStatus] = useState('user');
    useEffect(() => {
        axios.get(`${api}/user/list`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            }
        }).then(res => {
            console.log(res.data);
            setUsers(JSON.parse(res.data));
        })
        configureUser();
    }, [api])

    const configureUser = () => {
        const user = getUserData()
        setUserId(user.id);
        setUsername(user.username);
        if (user.roles.includes("ROLE_ADMIN")) setUserStatus("admin");
    }

    const allSelected = users.length > 0 && selectedUsers.length === users.length;
    const toggleSelection = (id) => {
        setSelectedUsers(prev =>
            prev.includes(id)
                ? prev.filter(itemId => itemId !== id)
                : [...prev, id]
        );
    };
    const toggleSelectAll = () => {
        if (selectedUsers.length === users.length) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(users.map(t => t.id));
        }
    };
    const deleteUsers = async (e) => {
        e.preventDefault();
        await axios.delete(`${api}/user/remove`, {
            data: {
                ids: selectedUsers
            },
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            }
        }).then(res => {
            setUsers(prev =>
                prev.filter(user => !selectedUsers.includes(user.id))
            );
            setSelectedUsers([]);
        })
    }
    const unbanUsers = async (e) => {
        e.preventDefault();
        await axios.post(`${api}/user/unban`, {
                ids: selectedUsers
            },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                }
            }).then(res => {
            console.log(res);
        })
    }
    const banUsers = async (e) => {
        e.preventDefault();
        await axios.post(`${api}/user/ban`, {
                ids: selectedUsers
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                }
            }).then(res => {
            console.log(res);
        })
    }
    const promoteUsers = async (e) => {
        e.preventDefault();
        await axios.post(`${api}/user/promote`, {
                ids: selectedUsers
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                }
            }).then(res => {
            console.log(res);
        })
    }
    const restrictSelectedUsers = async (e) => {
        e.preventDefault();
        await axios.post(`${api}/user/restrict`, {
                ids: selectedUsers
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                }
            }).then(res => {
            console.log(res);
        })
    }
    return (
        <AppHeader className="App-header">
            <Navbar
                toggleTheme={toggleTheme}
                username={username}
                view={"account"}
                accountSection={"users"}
                hasSelectedRows={selectedUsers.length > 0}
                userStatus={userStatus}
                banSelected={banUsers}
                unbanSelected={unbanUsers}
                deleteSelected={deleteUsers}
                promoteSelected={promoteUsers}
                restrictSelected={restrictSelectedUsers}
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
                            <th>Email</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan="2" className="text-muted">No templates found</td>
                            </tr>
                        ) : (
                            users.map((item, index) => (
                                <tr key={item.id}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={selectedUsers.includes(item.id)}
                                            onChange={() => toggleSelection(item.id)}
                                        />
                                    </td>
                                    <td>
                                        <a href={`/edit/${item.id}`} className="text-decoration-none">
                                            {item.email || "Untitled Template"}
                                        </a>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppHeader>
    )
}