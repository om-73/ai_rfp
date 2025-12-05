import React, { useState, useEffect } from 'react';
import { getProposals, checkEmails, getProposalRecommendation } from '../api/proposalApi';

const ProposalComparison = ({ rfpId }) => {
    const [proposals, setProposals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [recommendation, setRecommendation] = useState(null);

    useEffect(() => {
        fetchData();
        // Auto-refresh every 30 seconds
        const interval = setInterval(() => {
            fetchData();
        }, 30000);
        return () => clearInterval(interval);
    }, [rfpId]);

    const fetchData = async () => {
        // Only set loading on first load to avoid flickering
        if (proposals.length === 0) setLoading(true);
        try {
            const [proposalsData, recData] = await Promise.all([
                getProposals(rfpId),
                getProposalRecommendation(rfpId)
            ]);

            // Sort by score descending
            const sorted = proposalsData.sort((a, b) => b.score - a.score);
            setProposals(sorted);
            setRecommendation(recData);
        } catch (error) {
            console.error("Failed to load data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCheckEmails = async () => {
        setProcessing(true);
        try {
            await checkEmails();
            alert('Inbox checked. Refreshing proposals...');
            fetchData();
        } catch (error) {
            console.error("Error checking emails", error);
            alert("Failed to check emails.");
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return <div className="text-gray-400 py-4">Loading proposals...</div>;

    return (
        <div className="mt-12">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
                    Vendor Proposal Comparison
                </h2>
                <button
                    onClick={handleCheckEmails}
                    disabled={processing}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-4 py-2 rounded transition shadow-lg hover:shadow-indigo-500/30 font-medium text-sm"
                >
                    {processing ? 'Checking Inbox...' : 'Check for New Proposals'}
                </button>
            </div>

            {recommendation && recommendation.recommended_vendor_id && (
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-xl border border-blue-500/30 shadow-lg shadow-blue-500/10 mb-8 relative overflow-hidden animate-slide-up">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <svg className="w-32 h-32 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">AI Recommendation</span>
                            <h3 className="text-2xl font-bold text-white">Recommended: Vendor #{recommendation.recommended_vendor_id}</h3>
                        </div>
                        <p className="text-gray-300 text-lg leading-relaxed max-w-4xl">{recommendation.reasoning}</p>
                    </div>
                </div>
            )}

            {proposals.length === 0 ? (
                <div className="bg-gray-900 p-8 rounded-xl border border-gray-800 text-center">
                    <h3 className="text-xl font-bold text-gray-300 mb-2">No Proposals Received Yet</h3>
                    <p className="text-gray-500">Waiting for vendors to respond via email.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {proposals.map((proposal, index) => {
                        const isTopPick = recommendation ? proposal.vendorId === recommendation.recommended_vendor_id : index === 0;
                        const data = proposal.extracted_data || {};

                        return (
                            <div key={proposal.id} style={{ animationDelay: `${index * 150}ms` }} className={`relative bg-gray-900 rounded-xl border ${isTopPick ? 'border-green-500 shadow-green-900/20 shadow-lg scale-105 z-10' : 'border-gray-800 hover:border-gray-700'} p-6 flex flex-col transition-all duration-300 animate-slide-up transform hover:-translate-y-2`}>
                                {isTopPick && (
                                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md border border-green-500">
                                        Best Match
                                    </div>
                                )}

                                <div className="mb-4 pb-4 border-b border-gray-800">
                                    <h3 className="text-xl font-bold text-gray-100 mb-1">{proposal.Vendor ? proposal.Vendor.name : 'Unknown Vendor'}</h3>
                                    <p className="text-sm text-gray-500">{proposal.Vendor ? proposal.Vendor.contact_person : ''}</p>
                                </div>

                                <div className="space-y-4 mb-6 flex-grow">
                                    <div>
                                        <div className="flex justify-between items-end mb-1">
                                            <p className="text-xs text-gray-500 uppercase font-semibold">Match Score</p>
                                            <span className={`text-lg font-bold ${isTopPick ? 'text-green-400' : 'text-blue-400'}`}>{proposal.score}</span>
                                        </div>
                                        <div className="w-full bg-gray-800 rounded-full h-2">
                                            <div className={`h-2 rounded-full ${isTopPick ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${proposal.score}%` }}></div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-gray-950/50 p-2 rounded">
                                            <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Cost</p>
                                            <p className="text-sm font-medium text-gray-200">{data.price || 'N/A'}</p>
                                        </div>
                                        <div className="bg-gray-950/50 p-2 rounded">
                                            <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Timeline</p>
                                            <p className="text-sm font-medium text-gray-200">{data.timeline || 'N/A'}</p>
                                        </div>
                                    </div>

                                    <div className="bg-gray-950/30 p-3 rounded border border-gray-800/50">
                                        <p className="text-xs text-gray-500 uppercase font-semibold mb-1">AI Summary</p>
                                        <p className="text-sm text-gray-400 line-clamp-4 leading-relaxed">{data.summary || 'No summary available.'}</p>
                                    </div>
                                </div>

                                <button
                                    className="w-full mt-auto bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded transition border border-gray-600 hover:border-gray-500 text-sm"
                                    onClick={() => alert(`Full Email Content:\n\n${proposal.email_content}`)}
                                >
                                    View Details
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ProposalComparison;
