import React, {useEffect} from 'react';

const BootstrapTestPage = () => {
    useEffect(() => {
        const api = process.env.REACT_APP_API_ADDRESS;
        fetch(`${api}/templates`)
            .then(response => response.json())
            .then(json => console.log(json));
    });

    return (
        <div className="container mt-5">
            <h1 className="text-primary">Hello, Bootstrap!</h1>
            <p className="lead">This is a test to confirm Bootstrap is working in your React project.</p>

            <div className="alert alert-success" role="alert">
                If you can see this green alert, Bootstrap styles are working!
            </div>

            <button className="btn btn-primary">Primary Button</button>
            <button className="btn btn-outline-secondary ms-2">Secondary Button</button>

            <div className="card mt-4" style={{width: '18rem'}}>
                <img
                    src="https://via.placeholder.com/150"
                    className="card-img-top"
                    alt="Placeholder"
                />
                <div className="card-body">
                    <h5 className="card-title">Bootstrap Card</h5>
                    <p className="card-text">This is an example of a Bootstrap card in a React component.</p>
                    <a href="#" className="btn btn-success">
                        Go somewhere
                    </a>
                </div>
            </div>
        </div>
    );
};

export default BootstrapTestPage;