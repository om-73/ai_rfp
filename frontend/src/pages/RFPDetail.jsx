import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getRFPById, sendRFP } from '../api/rfpApi';
import SendRFPModal from '../components/SendRFPModal';
import ProposalComparison from '../components/ProposalComparison';

const RFPDetail = () => {
    const { id } = useParams();
    const [rfp, setRFP] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchRFP();
    }, [id]);

    const fetchRFP = async () => {
        try {
            const data = await getRFPById(id);
            setRFP(data);
        } catch (error) {
            console.error('Error fetching RFP', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSendRFPs = async (vendorIds) => {
        try {
            await sendRFP(rfp.id, vendorIds);
            setIsModalOpen(false);
            fetchRFP(); // Refresh to update status
            alert('RFPs sent successfully!');
        } catch (error) {
            console.error("Error sending RFPs", error);
            alert("Failed to send RFPs.");
        }
    };

    if (loading) return <div className="p-8 text-white">Loading...</div>;
    if (!rfp) return <div className="p-8 text-white">RFP not found</div>;

    return (
        <div className="p-8 w-full max-w-full mx-auto text-white">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-2">{rfp.title}</h1>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${rfp.status === 'SENT' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}`}>
                        {rfp.status}
                    </span>
                </div>
                <Link to="/vendors" className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded transition">
                    Manage Vendors
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Original Prompt */}
                <div className="bg-gray-900 p-6 rounded-xl border border-gray-700 min-h-[200px] animate-slide-up delay-100">
                    <h2 className="text-xl font-semibold mb-4 text-white">Original Request</h2>
                    <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{rfp.user_prompt || 'No details available.'}</p>
                </div>

                {/* AI Structured Data */}
                <div className="bg-gray-900 p-6 rounded-xl border border-gray-700 animate-slide-up delay-200">
                    <h2 className="text-xl font-semibold mb-4 text-gray-300">AI Structured Data</h2>
                    <pre className="bg-gray-950 p-4 rounded border border-gray-800 text-sm text-green-400 overflow-x-auto">
                        {JSON.stringify(rfp.structured_data, null, 2)}
                    </pre>
                </div>
            </div>

            {/* Actions Area */}
            <div className="mt-8 bg-gray-900 p-6 rounded-xl border border-gray-700 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold">Next Steps</h3>
                    <p className="text-gray-400 text-sm">{rfp.status === 'DRAFT' ? 'Review the structured data and send to vendors.' : 'Wait for vendor responses.'}</p>
                </div>
                {rfp.status === 'DRAFT' && (
                    <button
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transition"
                        onClick={() => setIsModalOpen(true)}
                    >
                        Select Vendors & Send
                    </button>
                )}
                {rfp.status === 'SENT' && (
                    <button className="bg-gray-700 text-gray-300 font-bold py-2 px-6 rounded cursor-not-allowed" disabled>
                        RFPs Sent
                    </button>
                )}
            </div>

            {rfp.status === 'SENT' && (
                <ProposalComparison rfpId={rfp.id} />
            )}

            <SendRFPModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSend={handleSendRFPs}
                rfpId={rfp.id}
            />
        </div>
    );
};

export default RFPDetail;
