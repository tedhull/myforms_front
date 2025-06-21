import {useNavigate} from 'react-router-dom';
import {useEffect} from 'react';
import {removeToken} from "./TokenManager";

export default function LogoutHandler() {
    const navigate = useNavigate();

    useEffect(() => {
        removeToken();
        navigate('/login');
    }, [navigate]);
    return null;
}
