import React, { useState, useEffect } from 'react';
import { UserPlus, X, CreditCard, UserCircle, Search } from 'lucide-react';
import { signatureService } from '../api/signatureService';
import { useAppContext } from '../context/AppContext';
import SignatureUpload from '../pages/SignatureUpload';

const SignatureIntakePage = () => {
    const { showToast, showLoader } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [accounts, setAccounts] = useState([]);
    const [formData, setFormData] = useState({
        fullName: '',
        accountNumber: '',
        signatures: [] 
    });
    const fetchAccounts = async () => {
        try {
            const data = await accountService.getAllAccounts();
            setAccounts(data);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchAccounts(); }, []);

    const handleRegister = async (e) => {
        e.preventDefault();
        if (formData.signatures.length !== 3) {
            return showToast("Please upload exactly 3 signature samples", "error");
        }
        if (!formData.fullName || !formData.accountNumber) {
            return showToast("Please fill in all customer details", "error");
        }

        showLoader(true);
        try {
            await accountService.registerAccount(formData);
            showToast("Account Holder registered successfully", "success");
            setIsModalOpen(false);
            setFormData({ fullName: '', accountNumber: '', signatures: [] });
            fetchAccounts();
        } catch (err) {
            showToast(err.toString(), "error");
        } finally {
            showLoader(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
            <header className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">Account Holders</h1>
                <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all">
                    <UserPlus size={20} /> Register Customer
                </button>
            </header>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4">
                    <div className="bg-slate-900 border border-slate-800 w-full max-w-6xl rounded-3xl shadow-2xl overflow-hidden">
                        <div className="flex justify-between items-center p-6 border-b border-slate-800">
                            <h2 className="text-xl font-bold text-white">New Customer Onboarding</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white"><X /></button>
                        </div>

                        <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
                            {/* Left Side: Info */}
                            <div className="space-y-6">
                                <h3 className="text-indigo-400 font-bold text-sm uppercase tracking-widest">Customer Information</h3>
                                <div>
                                    <label className="block text-xs font-black text-slate-500 uppercase mb-3 tracking-widest">Full Name</label>
                                    <input
                                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white outline-none focus:border-indigo-500 transition-all"
                                        placeholder="Ex: Juan Dela Cruz"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-500 uppercase mb-3 tracking-widest">Account Number</label>
                                    <input
                                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-white outline-none focus:border-indigo-500 transition-all"
                                        placeholder="Ex: 123456789"
                                        value={formData.accountNumber}
                                        onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                                    />
                                </div>

                                <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl">
                                    <p className="text-xs text-slate-400 leading-relaxed italic">
                                        "Accuracy Notice: Uploading 3 distinct signature samples provides higher forensic reliability for the verification system."
                                    </p>
                                </div>

                                <button onClick={handleRegister} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-600/20 transition-all">
                                    Finalize Registration
                                </button>
                            </div>

                            {/* Right Side: Reverted 3-Signature Intake */}
                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase mb-5 tracking-widest text-center">
                                    Individual Reference Signatures (3 Samples Required)
                                </label>

                                {/* We use the version of SignatureUpload that handles its own 3-image state */}
                                <SignatureUpload
                                    onImagesChange={(base64Array) => setFormData({ ...formData, signatures: base64Array })}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* List View */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {accounts.length > 0 ? (
                    accounts.map(acc => (
                        <div key={acc.accountNumber} className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl flex items-center justify-between hover:border-slate-700 transition-all group">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 bg-slate-800 rounded-xl flex items-center justify-center text-slate-500 group-hover:text-indigo-400 group-hover:bg-indigo-500/10 transition-all">
                                    <UserCircle size={28} />
                                </div>
                                <div>
                                    <p className="text-white font-bold">{acc.fullName}</p>
                                    <p className="text-xs text-slate-500 flex items-center gap-1"><CreditCard size={12} /> {acc.accountNumber}</p>
                                </div>
                            </div>
                            <div className="text-[10px] font-bold px-2 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-md uppercase tracking-wider">Verified</div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center text-slate-600 border border-dashed border-slate-800 rounded-3xl">
                        No account holders registered in the system.
                    </div>
                )}
            </div>
        </div>
    );
};

export default SignatureIntakePage;
