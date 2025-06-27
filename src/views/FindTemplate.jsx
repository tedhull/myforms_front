import React, {useState} from 'react';
import axios from 'axios';

const TemplateFinder = () => {
    const [templateId, setTemplateId] = useState('');
    const [templateData, setTemplateData] = useState(null);
    const [error, setError] = useState(null);
    const api = process.env.REACT_APP_API_ADDRESS;
    const handleFetchTemplate = async () => {
        try {
            const response = await axios.get(`${api}/templates/${templateId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                }
            });
            setTemplateData(response.data);
            setError(null);
        } catch (err) {
            setError('Template not found');
            setTemplateData(null);
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto bg-white rounded shadow">
            <input
                type="text"
                placeholder="Enter Template ID"
                value={templateId}
                onChange={(e) => setTemplateId(e.target.value)}
                className="border px-2 py-1 rounded w-full mb-2"
            />
            <button
                onClick={handleFetchTemplate}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
            >
                Fetch Template
            </button>

            {templateData && (
                <div className="mt-4 bg-gray-100 p-3 rounded">
                    <pre>{JSON.stringify(templateData, null, 2)}</pre>
                </div>
            )}

            {error && (
                <div className="mt-4 text-red-500">
                    {error}
                </div>
            )}
        </div>
    );
};

export default TemplateFinder;
