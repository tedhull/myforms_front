import {Navigate} from 'react-router-dom';
import {getUserData} from "./User";

export default function ProtectedRoute({children}) {
    const token = localStorage.getItem('access_token');
    if (!token) {
        return <Navigate to="/login" replace/>;
    }
    const user = getUserData();
    if (user.roles.includes("ROLE_BANNED")) {
        return <Navigate to={"/login"} replace/>;
    }
    return children;
}
