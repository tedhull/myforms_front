import {useNavigate} from 'react-router-dom';
import {useEffect} from 'react';

export default function LogoutHandler() {
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.clear();
        navigate('/login');
    }, [navigate]);
    return null;
}
