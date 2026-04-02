import React from 'react';
import { useAppContext } from '../../context/AppContext';

const GlobalLoader = () => {
    const { isLoading } = useAppContext();

    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm">
            <div className="flex flex-col items-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
                <p className="mt-4 text-indigo-400 font-medium animate-pulse">Processing...</p>
            </div>
        </div>
    );
};

export default GlobalLoader;
