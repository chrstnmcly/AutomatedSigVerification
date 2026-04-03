import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { authService } from '../api/authService';
import { userService } from '../api/userService'; 
import {
    FileCheck,
    AlertCircle,
    History,
    TrendingUp,
    Camera,
    Search,
    Shield,
    UserCircle,
    X
} from 'lucide-react';

const Dashboard = () => {
    const user = authService.getCurrentUser();
    const { showToast } = useAppContext();
    const navigate = useNavigate();

    // Search States
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const searchRef = useRef(null);

    const stats = [
        { label: 'Total Verifications', value: '1,284', icon: FileCheck, color: 'text-indigo-400' },
        { label: 'Pending Flags', value: '12', icon: AlertCircle, color: 'text-rose-400' },
        { label: 'System Confidence', value: '98.2%', icon: TrendingUp, color: 'text-emerald-400' },
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsSearching(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearch = async (query) => {
        setSearchQuery(query);
        if (query.length > 2) {
            try {
                const results = await userService.searchAccountHolders(query);
                setSearchResults(results);
                setIsSearching(true);
            } catch (err) {
                console.error("Search error:", err);
            }
        } else {
            setSearchResults([]);
            setIsSearching(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">System Overview</h1>
                    <p className="text-slate-400">Monitoring signature integrity for <span className="text-indigo-400 font-semibold">{user.username}</span></p>
                </div>
                <div className="text-xs bg-slate-900 border border-slate-800 px-4 py-2 rounded-full text-slate-400">
                    Session Role: <span className="text-indigo-400 font-bold uppercase">{user.role}</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center justify-between shadow-xl">
                        <div>
                            <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">{stat.label}</p>
                            <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
                        </div>
                        <stat.icon className={`h-10 w-10 ${stat.color} opacity-80`} />
                    </div>
                ))}
            </div>

            {/* Quick Operations Section */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative">
                <h2 className="text-xl font-bold text-white mb-6">Quick Operations</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                    {/* 1. New Registration */}
                    <button
                        onClick={() => navigate('/signature-intake')}
                        className="flex items-center gap-4 p-4 bg-slate-950 border border-slate-700 rounded-xl hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all group"
                    >
                        <div className="p-3 bg-indigo-500/10 rounded-lg group-hover:bg-indigo-500/20 transition-colors">
                            <Camera className="text-indigo-400" />
                        </div>
                        <div className="text-left">
                            <p className="text-white font-bold text-sm">New Registration</p>
                            <p className="text-slate-500 text-[10px]">Onboard 3 reference samples</p>
                        </div>
                    </button>

                    {/* 2. Verify Signature */}
                    <button
                        onClick={() => navigate('/verify-signature')}
                        className="flex items-center gap-4 p-4 bg-slate-950 border border-slate-700 rounded-xl hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all group"
                    >
                        <div className="p-3 bg-emerald-500/10 rounded-lg group-hover:bg-emerald-500/20 transition-colors">
                            <FileCheck className="text-emerald-400" />
                        </div>
                        <div className="text-left">
                            <p className="text-white font-bold text-sm">Verify Signature</p>
                            <p className="text-slate-500 text-[10px]">Run cross-check analysis</p>
                        </div>
                    </button>

                    {/* 3. Search Database (Input Field Integrated) */}
                    <div className="relative" ref={searchRef}>
                        <div className="flex items-center gap-4 p-4 bg-slate-950 border border-slate-700 rounded-xl focus-within:border-indigo-500 transition-all">
                            <div className="p-3 bg-slate-800 rounded-lg">
                                <Search className="text-slate-300" size={20} />
                            </div>
                            <div className="text-left w-full">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    placeholder="Search Customer..."
                                    className="bg-transparent border-none outline-none text-white text-sm w-full placeholder:text-slate-600"
                                    onChange={(e) => handleSearch(e.target.value)}
                                    onFocus={() => searchQuery.length > 2 && setIsSearching(true)}
                                />
                                <p className="text-slate-500 text-[10px]">Search by Name or Account #</p>
                            </div>
                        </div>

                        {/* Search Results Dropdown */}
                        {isSearching && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 max-h-60 overflow-y-auto animate-in slide-in-from-top-2 duration-200">
                                {searchResults.length > 0 ? (
                                    searchResults.map((acc) => (
                                        <button
                                            key={acc.accountNumber}
                                            onClick={() => navigate('/signature-intake')} // Or to a specific profile
                                            className="w-full p-4 flex items-center gap-3 hover:bg-slate-800 border-b border-slate-800/50 last:border-none text-left transition-colors"
                                        >
                                            <UserCircle className="text-indigo-400" size={24} />
                                            <div>
                                                <p className="text-white font-bold text-xs">{acc.fullName}</p>
                                                <p className="text-slate-500 text-[10px]">{acc.accountNumber}</p>
                                            </div>
                                        </button>
                                    ))
                                ) : (
                                    <div className="p-4 text-center text-slate-500 text-xs italic">No matching records found.</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Lower Grid: Transactions and Sidebar Info */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                    <div className="p-6 border-b border-slate-800">
                        <h3 className="text-lg font-bold text-white">Recent Transactions</h3>
                    </div>
                    <div className="p-6 text-center py-12">
                        <History className="h-12 w-12 text-slate-800 mx-auto mb-4" />
                        <p className="text-slate-500 text-sm">No recent transactions to display.</p>
                    </div>
                </div>

                <div className="bg-indigo-600 rounded-2xl p-6 text-white relative overflow-hidden shadow-xl shadow-indigo-500/20 self-start">
                    <Shield className="absolute -right-4 -bottom-4 h-32 w-32 text-white/10" />
                    <h3 className="text-lg font-bold mb-2">Security Status</h3>
                    <p className="text-indigo-100 text-sm mb-4">Your connection is encrypted. MFA is currently enabled for your account.</p>
                    <div className="bg-white/20 backdrop-blur-md rounded-lg p-3 text-xs font-mono">
                        IP: 192.168.1.45
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
