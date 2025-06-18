import { useState } from 'react';
import axios from 'axios';

export default function CreateTemplatePage() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [fields, setFields] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const api = process.env.REACT_APP_API_ADDRESS
            const response = await axios.post(`${api}/templates/new`, {
                title,
                description,
                fields: JSON.parse(fields), // expecting fields as JSON
            });
            console.log(response.data);
            alert('Template created: ' + response.data.id);
        } catch (error) {
            console.error(error);
            alert('Failed to create template');
        }
    };

    return (
        <div className="p-6 max-w-xl mx-auto">
            <h1 className="text-2xl mb-4">Create Template</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="text"
                    placeholder="Template title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="p-2 border rounded"
                    required
                />
                <input
                    type="text"
                    placeholder="template description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="p-2 border rounded"
                    required
                />
                <textarea
                    placeholder='Fields (as JSON, e.g. [{"name": "email"}, {"name": "age"}])'
                    value={fields}
                    onChange={(e) => setFields(e.target.value)}
                    className="p-2 border rounded h-32"
                    required
                />
                <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
                    Create
                </button>
            </form>
        </div>
    );
}
