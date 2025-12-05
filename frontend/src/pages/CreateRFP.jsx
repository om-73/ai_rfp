import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRFP } from '../api/rfpApi';

const CreateRFP = () => {
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const rfp = await createRFP({ user_prompt: prompt });
            // Redirect to the RFP detail page (not created yet, but planning for it)
            navigate(`/rfps/${rfp.id}`);
        } catch (error) {
            console.error('Error creating RFP', error);
            alert('Failed to create RFP. See console.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto text-white">
            <h1 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">Create New RFP</h1>
            <p className="text-gray-400 mb-8">Describe what you need in natural language, and our AI will structure it for you.</p>

            <div className="bg-gray-900 p-8 rounded-xl border border-gray-700 shadow-2xl">
                <form onSubmit={handleSubmit}>
                    <label className="block text-gray-300 font-medium mb-3">Your Requirement</label>
                    <textarea
                        className="w-full h-48 p-4 bg-gray-800 rounded-lg border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition text-lg"
                        placeholder="e.g., I need to procure laptops for 50 new employees. 16GB RAM, 512GB SSD. Budget is $80,000. Needed by next month."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        required
                    ></textarea>

                    <div className="mt-6 flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Analysing with AI...
                                </span>
                            ) : 'Generage RFP Structure'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateRFP;
