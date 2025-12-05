import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getRFPs } from '../api/rfpApi';

const Dashboard = () => {
    const [rfps, setRfps] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRFPs();
    }, []);

    const fetchRFPs = async () => {
        try {
            const data = await getRFPs();
            setRfps(data);
        } catch (error) {
            console.error('Error fetching RFPs', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-6xl mx-auto text-white">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
                    <p className="text-gray-400">Manage your procurement cycles</p>
                </div>
                <Link to="/create-rfp" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition transform hover:-translate-y-1 animate-pulse-slow">
                    + Create New RFP
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <p className="text-gray-400">Loading RFPs...</p>
                ) : rfps.length === 0 ? (
                    <div className="col-span-3 text-center py-20 bg-gray-900 rounded-xl border border-gray-800">
                        <p className="text-gray-500 text-xl font-medium">No RFPs found. Create one to get started.</p>
                    </div>
                ) : (
                    rfps.map((rfp, index) => (
                        <Link to={`/rfps/${rfp.id}`} key={rfp.id} className="block group animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                            <div className="bg-gray-900 p-6 rounded-xl border border-gray-700 group-hover:border-blue-500 transition shadow-sm group-hover:shadow-blue-900/20 h-full flex flex-col transform group-hover:-translate-y-1 duration-300">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-300 group-hover:from-blue-400 group-hover:to-purple-400 transition-all">{rfp.title}</h3>
                                    <span className="bg-gray-800 text-xs px-2 py-1 rounded border border-gray-600">{rfp.status}</span>
                                </div>
                                <p className="text-gray-400 text-sm line-clamp-3 mb-4">{rfp.user_prompt}</p>
                                <div className="mt-auto text-xs text-gray-500">
                                    Created: {new Date(rfp.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
};

export default Dashboard;
