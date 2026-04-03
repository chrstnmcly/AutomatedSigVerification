import React, { useState } from 'react';
import { Search, FileUp, ShieldCheck, AlertTriangle } from 'lucide-react';
import { signatureService } from '../api/signatureService';
import { useAppContext } from '../context/AppContext';

const VerifySignaturePage = () => {
    const { showToast, showLoader } = useAppContext();
    const [accountNumber, setAccountNumber] = useState('');
    const [testImage, setTestImage] = useState(null);
    const [result, setResult] = useState(null);

    const handleVerify = async () => {
        if (!accountNumber || !testImage) return showToast("Missing details", "error");

        showLoader(true);
        try {
            const response = await signatureService.verifySignature(accountNumber, testImage);
            setResult(response); 
        } catch (err) {
            showToast(err.toString(), "error");
        } finally {
            showLoader(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
            <h1 className="text-3xl font-bold text-white">Signature Verification</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-6">
                    <div>
                        <label className="block text-xs font-black text-slate-500 uppercase mb-3">Customer Account Number</label>
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                            <input
                                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 pl-12 text-white outline-none focus:border-indigo-500"
                                placeholder="Enter account number..."
                                onChange={(e) => setAccountNumber(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-black text-slate-500 uppercase mb-3">New Transaction Signature</label>
                        <div className="aspect-video bg-slate-950 border-2 border-dashed border-slate-800 rounded-2xl flex items-center justify-center overflow-hidden">
                            {testImage ? (
                                <img src={testImage} className="h-full object-contain" />
                            ) : (
                                <label className="cursor-pointer text-center p-10">
                                    <FileUp className="mx-auto text-slate-700 mb-2" size={40} />
                                    <span className="text-slate-500 text-sm">Upload signature from cheque</span>
                                    <input type="file" className="hidden" onChange={(e) => {
                                        const reader = new FileReader();
                                        reader.onload = () => setTestImage(reader.result);
                                        reader.readAsDataURL(e.target.files[0]);
                                    }} />
                                </label>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={handleVerify}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-2xl transition-all"
                    >
                        Run Verification Engine
                    </button>
                </div>

                {result && (
                    <div className={`p-8 rounded-3xl border animate-in slide-in-from-right duration-500 ${result.confidence > 0.90 ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-rose-500/10 border-rose-500/30'
                        }`}>
                        <div className="text-center space-y-4">
                            {result.confidence > 0.90 ? (
                                <ShieldCheck size={80} className="mx-auto text-emerald-500" />
                            ) : (
                                <AlertTriangle size={80} className="mx-auto text-rose-500" />
                            )}
                            <h2 className="text-4xl font-black text-white">{result.status}</h2>
                            <p className="text-slate-400">System Confidence Score</p>
                            <div className="text-5xl font-mono text-indigo-400">{(result.confidence * 100).toFixed(2)}%</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerifySignaturePage;