import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../../api/authService';
import { LayoutDashboard, Shield, LogOut, User, FileSearch, Settings } from 'lucide-react';

const MainLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = authService.getCurrentUser();

    const handleLogout = () => {
        authService.logout();
    };

    const isActive = (path) => location.pathname === path;

    return (
        <div className="flex min-h-screen bg-slate-950 text-slate-200">
            <aside className="w-64 border-r border-slate-800 bg-slate-900/50 p-6 flex flex-col">
                <div className="mb-10 flex items-center gap-2 text-indigo-400">
                    <Shield className="h-8 w-8" />
                    <span className="font-bold text-xl tracking-tight uppercase">V-System</span>
                </div>

                <nav className="space-y-2 flex-1">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 transition-all ${isActive('/dashboard') ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'hover:bg-slate-800 text-slate-400'
                            }`}
                    >
                        <LayoutDashboard className="h-5 w-5" /> Dashboard
                    </button>

                    {['Bank Teller', 'Security Manager'].includes(user?.role) && (
                        <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-slate-400 hover:bg-slate-800 transition-all">
                            <FileSearch className="h-5 w-5" /> Verifications
                        </button>
                    )}

                    {user?.role === 'Super Admin' && (
                        <button
                            onClick={() => navigate('/admin')}
                            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 transition-all ${isActive('/admin') ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'hover:bg-slate-800 text-slate-400'
                                }`}
                        >
                            <Shield className="h-5 w-5" /> Admin Center
                        </button>
                    )}
                </nav>

                <div className="mt-auto pt-6 border-t border-slate-800/50">
                    <div className="mb-4 flex items-center gap-3 px-3 py-3 bg-slate-800/30 rounded-2xl border border-slate-700/30">
                        <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-inner">
                            {user?.username?.charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-xs font-bold text-white truncate">{user?.username}</p>
                            <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-tighter">{user?.role}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-rose-400 hover:bg-rose-500/10 transition-all group"
                    >
                        <LogOut className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-bold text-sm">Logout</span>
                    </button>
                </div>
            </aside>

            <main className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
