import {jwtDecode} from "jwt-decode";

export function getUserData() {
    const token = localStorage.getItem("access_token");
    return jwtDecode(token);
}
