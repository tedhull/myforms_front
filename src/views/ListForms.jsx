import {useEffect, useState} from "react";
import '../App.css';
import {useParams} from "react-router-dom"
import {getUserData} from "../scripts/User";
import axios from "axios";
import {AppHeader} from "../components/AppHeader";
import Navbar from "../components/Navbar";

export function ListForms({toggleTheme}) {
    const {id} = useParams();
    const [username, setUsername] = useState("Guest");
    const navType = performance.getEntriesByType("navigation")[0]?.type;
    const [forms, setForms] = useState([]);
    const api = process.env.REACT_APP_API_ADDRESS;
    useEffect(() => {
        if (id) {
            axios.get(`${api}/form/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`
                }
            }).then(response => {
                setForms(JSON.parse(response.data.data));
            })
        }
        ConfigureUser();
    }, [api, id, navType])
    const ConfigureUser = () => {
        const user = getUserData();
        setUsername(user.username.split('@')[0]);
    }
    return (
        <div>
            <AppHeader className={"App-header"}>
                <Navbar
                    toggleTheme={toggleTheme}
                    username={username}
                    view={"table"}
                    editing={true}
                    templateId={id}
                />

                <div>

                    <table className={'table custom-table mt-2'}>

                        <thead>
                        ...
                        </thead>
                        <tbody>
                        <tr className="table-active colo">
                            ...
                        </tr>
                        {forms.map((item, index) => (

                            <tr>
                                <th scope="row">{index + 1}</th>
                                <td>
                                    <a href={`/correct/${id}/${item.respondent.id}`}>{item.respondent.email}</a>
                                </td>

                            </tr>
                        ))}

                        </tbody>
                    </table>
                </div>

            </AppHeader>
        </div>
    )
}
