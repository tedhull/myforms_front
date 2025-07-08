import {ThemeProvider, createGlobalStyle} from 'styled-components';
import {BrowserRouter, Routes, Route,} from 'react-router-dom';
import {useEffect, useState} from 'react';
import './App.css';
import {lightTheme, darkTheme} from './styles/theme';
import ProtectedRoute from './scripts/ProtectedRoute';
import TemplateFinder from './views/FindTemplate';
import GlobalStyle from './styles/GlobalStyle';
import Login from './views/Login';
import {Form} from './views/Form';
import Register from './views/Signup';
import LogoutHandler from './scripts/LogoutHandler';
import {TemplateRedactor} from "./views/TemplateRedactor";
import {ListForms} from "./views/ListForms";
import {Home} from "./views/Home";
import {AccountForms} from "./views/AccountForms";
import {AccountTemplates} from "./views/AccountTemplates";
import {AccountUsers} from "./views/AccountUsers";

export default function App() {
    const [theme, setTheme] = useState('');


    useEffect(() => {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme === 'dark' || storedTheme === 'light') {
            setTheme(storedTheme);
        } else setTheme('light');
    }, []);

    useEffect(() => {
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

    const currentTheme = theme === 'light' ? lightTheme : darkTheme;

    return (
        <ThemeProvider theme={currentTheme}>
            <GlobalStyle/>
            <BrowserRouter>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <Home toggleTheme={toggleTheme} theme={currentTheme}/>
                            </ProtectedRoute>
                        }
                    /><Route
                    path="/user/forms"
                    element={
                        <ProtectedRoute>
                            <AccountForms toggleTheme={toggleTheme} theme={currentTheme}/>
                        </ProtectedRoute>
                    }
                /><Route
                    path="/user/templates"
                    element={
                        <ProtectedRoute>
                            <AccountTemplates toggleTheme={toggleTheme} theme={currentTheme}/>
                        </ProtectedRoute>
                    }
                />/><Route
                    path="/user/admin"
                    element={
                        <ProtectedRoute>
                            <AccountUsers toggleTheme={toggleTheme} theme={currentTheme}/>
                        </ProtectedRoute>
                    }
                />
                    <Route
                        path="/find"
                        element={
                            <ProtectedRoute>
                                <TemplateFinder toggleTheme={toggleTheme} theme={currentTheme}/>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/create"
                        element={
                            <ProtectedRoute>
                                <TemplateRedactor toggleTheme={toggleTheme} theme={currentTheme}/>
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/edit/:id" element={<ProtectedRoute>
                        <TemplateRedactor toggleTheme={toggleTheme} theme={currentTheme}/>
                    </ProtectedRoute>
                    }/> <Route path="/list/:id" element={<ProtectedRoute>
                    <ListForms toggleTheme={toggleTheme}/>
                </ProtectedRoute>
                }/>
                    <Route path={"/submit/:id"} element={<ProtectedRoute>
                        <Form toggleTheme={toggleTheme} redact={false}/>
                    </ProtectedRoute>}
                    />

                    /><Route path={"/correct/:id/:userId"} element={<ProtectedRoute>
                    <Form toggleTheme={toggleTheme} redact={true}/>
                </ProtectedRoute>}
                />
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/signup" element={<Register/>}/>
                    <Route path="/logout" element={<LogoutHandler/>}/>
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}