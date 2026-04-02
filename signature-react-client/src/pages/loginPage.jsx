import React, { useState } from 'react';
import { authService } from '../api/authService';
import { Lock, User, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: '', passwordHash: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await authService.login(formData);
            navigate('/admin'); 
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
                <div className="text-center mb-8">
                    <ShieldCheck className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-white">Signature Verification System</h1>
                </div>

                {error && <div className="mb-4 p-3 bg-rose-900/30 text-rose-400 text-xs rounded-lg text-center border border-rose-500/20">{error}</div>}

                <form onSubmit={handleLogin} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Username"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm focus:border-indigo-500 outline-none text-white"
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm focus:border-indigo-500 outline-none text-white"
                        onChange={(e) => setFormData({ ...formData, passwordHash: e.target.value })}
                    />
                    <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all">
                        {loading ? "Verifying..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
