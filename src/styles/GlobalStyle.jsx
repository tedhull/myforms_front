import {createGlobalStyle} from 'styled-components';

const GlobalStyle = createGlobalStyle`
    input, textarea, select {
        background-color: ${({theme}) => theme.inputBackground};
        color: ${({theme}) => theme.text};
        border: 1px solid #ccc;
        transition: background-color 0.3s ease;
    }

    input::placeholder, textarea::placeholder {
        color: #aaa;
    }

    body {
        background-color: ${({theme}) => theme.background};
        color: ${({theme}) => theme.text};
        transition: background 0.3s ease, color 0.3s ease;
    }

    .card, card:disabled {
        background-color: ${({theme}) => theme.card} !important;
        color: ${({theme}) => theme.text};
        border: 1px solid ${({theme}) => theme.blockBorder};

        input::placeholder, textarea::placeholder {
            color: ${({theme}) => theme.placeholder};
        }

    }

    input:disabled,
    textarea:disabled,
    select:disabled {
        background-color: ${({theme}) => theme.inputBackground} !important;
        color: ${({theme}) => theme.text} !important;
        opacity: 1; /* Optional: prevent graying out */
        cursor: not-allowed;
    }

    input::placeholder:disabled,
    textarea::placeholder:disabled {
        color: ${({theme}) => theme.placeholder} !important;
    }

    .brand-text {
        color: ${({theme}) => theme.text};
    }

    .redactor-navbar {
        background-color: ${({theme}) => theme.redactorNavbarBackground};

        text {
            color: crimson;
        }

        input::placeholder, textarea::placeholder {
            color: ${({theme}) => theme.placeholder};

        }
    }

    .navbar-border {
        border-bottom: 1px solid ${({theme}) => theme.blockBorder};
    }


    .card:focus {
        background-color: ${({theme}) => theme.card} !important;
        color: ${({theme}) => theme.text};

        input::placeholder, textarea::placeholder {
            color: ${({theme}) => theme.placeholder};
        }
    }

    .toolbar {
        background-color: ${({theme}) => theme.toolbar};
    }

    input.form-control,
    textarea.form-control,
    select.form-control {

        background-color: ${({theme}) => theme.inputBackground};
        color: ${({theme}) => theme.text};
        border: 1px solid ${({theme}) => theme.inputBorder};
    }

    input.form-control:focus,
    textarea.form-control:focus,
    select.form-control:focus {
        border-color: ${({theme}) => theme.accent};
        background-color: ${({theme}) => theme.inputBackground};
        color: ${({theme}) => theme.text};
        outline: none;
        box-shadow: 0 0 0 0.2rem ${({theme}) => theme.accent}33;
    }

    select.form-control option {
        background-color: ${({theme}) => theme.inputBackground};
        color: ${({theme}) => theme.text};
    }

    select.form-control {
        appearance: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        background-image: url("data:image/svg+xml;utf8,<svg fill='${({theme}) =>
                theme.text.replace(
                        "#",
                        "%23"
                )}' height='16' viewBox='0 0 20 20' width='16' xmlns='http://www.w3.org/2000/svg'><polygon points='0,0 20,0 10,10'/></svg>");
        background-repeat: no-repeat;
        background-position: right 0.75rem center;
        background-size: 1rem;
        padding-right: 2rem; /* room for icon */
    }
`;

export default GlobalStyle;