import {ThemeProvider, createGlobalStyle} from 'styled-components';
import {BrowserRouter, Routes, Route,} from 'react-router-dom';
import {useEffect, useState} from 'react';
import './App.css';
import {lightTheme, darkTheme} from './styles/theme';
import ProtectedRoute from './scripts/ProtectedRoute';
import BootstrapTestPage from './BootstrapTestPage';
import TemplateFinder from './views/FindTemplate';
import GlobalStyle from './styles/GlobalStyle';
import Login from './views/Login';
import {Form} from './views/Form';
import Register from './views/Signup';
import LogoutHandler from './scripts/LogoutHandler';
import {TemplateRedactor} from "./views/TemplateRedactor";

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
                                <TemplateRedactor toggleTheme={toggleTheme} theme={currentTheme}/>
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
                    }/>
                    <Route path={"/submit/:id"} element={<ProtectedRoute>
                        <Form toggleTheme={toggleTheme} redact={false}/>
                    </ProtectedRoute>}
                    />
                    <Route path={"/correct/:id"} element={<ProtectedRoute>
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