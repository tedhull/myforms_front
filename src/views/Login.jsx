import {useState} from 'react';
import {setToken} from "../scripts/TokenManager";
import axios from "axios";
import {Navigate, useNavigate} from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const api = process.env.REACT_APP_API_ADDRESS
            await axios.post(`${api}/login_check`, {
                email,
                password,
            }).then(res => {
                setToken(res.data.token)
                navigate('/create');
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="p-6 max-w-xl mx-auto">

            <h1 className="text-2xl mb-4">Login</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="p-2 border-rounded"
                    required
                />
                <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="p-2 border-rounded"
                    required/>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full">
                    Login
                </button>
            </form>
        </div>
    );
}