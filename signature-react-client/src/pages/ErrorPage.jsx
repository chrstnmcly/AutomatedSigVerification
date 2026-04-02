import React from 'react';
import { useNavigate } from 'react-router-dom';

const ErrorPage = ({ code = "404", message = "Page Not Found" }) => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
            <h1 className="text-9xl font-black text-indigo-500/20">{code}</h1>
            <div className="absolute">
                <h2 className="text-3xl font-bold text-white mb-2">{message}</h2>
                <p className="text-slate-400 mb-8 max-w-md mx-auto">
                    The page you are looking for might have been removed or is temporarily unavailable.
                </p>
                <button
                    onClick={() => navigate('/login')}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-bold transition-all"
                >
                    Return to Login
                </button>
            </div>
        </div>
    );
};

export default ErrorPage;
