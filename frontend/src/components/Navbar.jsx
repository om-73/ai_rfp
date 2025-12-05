import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
    const location = useLocation();

    const isActive = (path) => location.pathname === path ? 'text-blue-400 font-bold border-b-2 border-blue-400' : 'text-gray-300 hover:text-white transition';

    return (
        <nav className="bg-gray-900 border-b border-gray-700 px-8 py-4 flex items-center justify-between sticky top-0 z-50 shadow-lg">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-lg"></div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                    RFP AI System
                </span>
            </div>
            <div className="flex gap-8">
                <Link to="/" className={`py-1 ${isActive('/')}`}>Dashboard</Link>
                <Link to="/vendors" className={`py-1 ${isActive('/vendors')}`}>Vendors</Link>
                <Link to="/create-rfp" className={`py-1 ${isActive('/create-rfp')}`}>Create RFP</Link>
            </div>
        </nav>
    );
};

export default Navbar;
