import React, { useState, useEffect } from 'react';
import { authApi, signatureApi } from '../api/axiosConfig';

const TestPage = () => {
    const [status, setStatus] = useState({
        identity: 'Connecting...',
        signature: 'Connecting...'
    });

    useEffect(() => {
        const checkHealth = async () => {
            // Test Identity Service (Port 7068)
            try {
                await authApi.get('/weatherforecast');
                setStatus(prev => ({ ...prev, identity: 'Online ✅' }));
            } catch (err) {
                setStatus(prev => ({ ...prev, identity: 'Offline ❌' }));
            }

            // Test Signature Service (Port 7025)
            try {
                await signatureApi.get('/weatherforecast');
                setStatus(prev => ({ ...prev, signature: 'Online ✅' }));
            } catch (err) {
                setStatus(prev => ({ ...prev, signature: 'Offline ❌' }));
            }
        };

        checkHealth();
    }, []);

    const getBadgeClass = (val) => {
        const base = "px-6 py-2 rounded-full text-sm font-bold shadow-md ";
        return val.includes('Online')
            ? base + "bg-emerald-900/40 text-emerald-400 border border-emerald-500/30"
            : base + "bg-rose-900/40 text-rose-400 border border-rose-500/30";
    };

    return (
        <div className="flex flex-col items-center justify-center p-8 bg-slate-950 min-h-screen text-white">
            <h2 className="text-2xl font-bold mb-8 text-indigo-400 uppercase tracking-widest">
                System Connectivity Test
            </h2>

            <div className="flex flex-col md:flex-row gap-8 w-full max-w-3xl">
                {/* Identity Service Card */}
                <div className="flex-1 bg-slate-900/50 p-8 rounded-3xl border border-slate-800 flex flex-col items-center">
                    <h3 className="text-lg font-medium text-slate-300 mb-1">Identity Service</h3>
                    <p className="text-xs text-slate-500 mb-6 font-mono">HTTPS:7068</p>
                    <div className={getBadgeClass(status.identity)}>
                        {status.identity}
                    </div>
                </div>

                {/* Signature Service Card */}
                <div className="flex-1 bg-slate-900/50 p-8 rounded-3xl border border-slate-800 flex flex-col items-center">
                    <h3 className="text-lg font-medium text-slate-300 mb-1">Signature Service</h3>
                    <p className="text-xs text-slate-500 mb-6 font-mono">HTTPS:7025</p>
                    <div className={getBadgeClass(status.signature)}>
                        {status.signature}
                    </div>
                </div>
            </div>
            <p className="mt-10 text-slate-500 text-sm italic">
                Ensure both .NET services are running in Visual Studio.
            </p>
        </div>
    );
};

export default TestPage;
