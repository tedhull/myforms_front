export function setToken(token) {
    localStorage.setItem('access_token', token);
    console.log("login success");
}

export function removeToken() {
    localStorage.removeItem('access_token');
}

