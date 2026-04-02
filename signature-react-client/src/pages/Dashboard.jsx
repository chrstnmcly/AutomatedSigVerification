import React from 'react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { authService } from '../api/authService';
import {
    FileCheck,
    AlertCircle,
    History,
    TrendingUp,
    Camera,
    Search,
    Shield
} from 'lucide-react';

const Dashboard = () => {
    const user = authService.getCurrentUser();
    const { showToast } = useAppContext();
    const navigate = useNavigate();

    const stats = [
        { label: 'Total Verifications', value: '1,284', icon: FileCheck, color: 'text-indigo-400' },
        { label: 'Pending Flags', value: '12', icon: AlertCircle, color: 'text-rose-400' },
        { label: 'System Confidence', value: '98.2%', icon: TrendingUp, color: 'text-emerald-400' },
    ];

    const handleAction = (actionName) => {
        showToast(`${actionName} feature coming soon!`, 'info');
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">System Overview</h1>
                    <p className="text-slate-400">Monitoring signature integrity for <span className="text-indigo-400 font-semibold">{user.username}</span></p>
                </div>
                <div className="text-xs bg-slate-900 border border-slate-800 px-4 py-2 rounded-full text-slate-400">
                    Session Role: <span className="text-indigo-400 font-bold uppercase">{user.role}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center justify-between">
                        <div>
                            <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">{stat.label}</p>
                            <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
                        </div>
                        <stat.icon className={`h-10 w-10 ${stat.color} opacity-80`} />
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Actions Area */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                        <h2 className="text-xl font-bold text-white mb-6">Quick Operations</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                            {/* Conditional Action: Teller / Manager */}
                            <button
                                onClick={() => navigate('/signature-intake')} // Triggers the Search + SignatureUpload flow
                                className="flex items-center gap-4 p-4 bg-slate-950 border border-slate-800 rounded-xl hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all group"
                            >
                                <div className="p-3 bg-indigo-500/10 rounded-lg group-hover:bg-indigo-500/20 transition-colors">
                                    <Camera className="text-indigo-400" />
                                </div>
                                <div className="text-left">
                                    <p className="text-white font-bold">New Verification</p>
                                    <p className="text-slate-500 text-xs">Capture 3 physical signature samples</p>
                                </div>
                            </button>

                            <button
                                onClick={() => handleAction('Search Logs')}
                                className="flex items-center gap-4 p-4 bg-slate-950 border border-slate-800 rounded-xl hover:border-slate-600 transition-all group"
                            >
                                <div className="p-3 bg-slate-800 rounded-lg group-hover:bg-slate-700 transition-colors">
                                    <Search className="text-slate-300" />
                                </div>
                                <div className="text-left">
                                    <p className="text-white font-bold">Search Database</p>
                                    <p className="text-slate-500 text-xs">Find customer profile</p>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Recent Activity Table */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                        <div className="p-6 border-b border-slate-800">
                            <h3 className="text-lg font-bold text-white">Recent Transactions</h3>
                        </div>
                        <div className="p-6 text-center py-12">
                            <History className="h-12 w-12 text-slate-800 mx-auto mb-4" />
                            <p className="text-slate-500">No recent transactions to display.</p>
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="bg-indigo-600 rounded-2xl p-6 text-white relative overflow-hidden shadow-xl shadow-indigo-500/10">
                        <Shield className="absolute -right-4 -bottom-4 h-32 w-32 text-white/10" />
                        <h3 className="text-lg font-bold mb-2">Security Status</h3>
                        <p className="text-indigo-100 text-sm mb-4">Your connection is encrypted. MFA is currently enabled for your account.</p>
                        <div className="bg-white/20 backdrop-blur-md rounded-lg p-3 text-xs font-mono">
                            IP: 192.168.1.45
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
