import React, { useState, useEffect } from 'react';
import { UserPlus, X, CreditCard, UserCircle, Search, Camera, Trash2, Save } from 'lucide-react';
import { signatureService } from '../api/signatureService';
import { userService } from '../api/userService';
import { useAppContext } from '../context/AppContext';

const SignatureIntakePage = () => {
    const { showToast, showLoader } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [accounts, setAccounts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const [formData, setFormData] = useState({
        fullName: '',
        accountNumber: '',
        signatures: []
    });

    const [previews, setPreviews] = useState([null, null, null]);

    const fetchAccounts = async () => {
        try {
            const data = await userService.getAllAccounts();
            setAccounts(data);
        } catch (err) {
            console.error("Fetch error:", err);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    const handleFileChange = (index, e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const newPreviews = [...previews];
            newPreviews[index] = reader.result;
            setPreviews(newPreviews);
            const validSignatures = newPreviews.filter(img => img !== null);
            setFormData(prev => ({ ...prev, signatures: validSignatures }));
        };
        reader.readAsDataURL(file);
    };

    const removeFile = (index) => {
        const newPreviews = [...previews];
        newPreviews[index] = null;
        setPreviews(newPreviews);

        const validSignatures = newPreviews.filter(img => img !== null);
        setFormData(prev => ({ ...prev, signatures: validSignatures }));
    };

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
            await signatureService.registerAccount(formData);
            showToast("Account Holder registered successfully", "success");

            setIsModalOpen(false);
            setFormData({ fullName: '', accountNumber: '', signatures: [] });
            setPreviews([null, null, null]);
            fetchAccounts();
        } catch (err) {
            showToast(err?.message || err?.toString() || "Registration failed", "error");
        } finally {
            showLoader(false);
        }
    };

    const filteredAccounts = accounts.filter(acc =>
        acc.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        acc.accountNumber.includes(searchTerm)
    );

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Account Holders</h1>
                    <p className="text-slate-400 text-sm">Manage customer reference signatures</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/20"
                >
                    <UserPlus size={20} /> Register Customer
                </button>
            </header>

            {/* Search Bar */}
            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                <input
                    type="text"
                    placeholder="Search by Name or Account Number..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-5 pl-12 text-white focus:border-indigo-500 outline-none transition-all"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4">
                    <div className="bg-slate-900 border border-slate-800 w-full max-w-6xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center p-6 border-b border-slate-800">
                            <h2 className="text-xl font-bold text-white">New Customer Onboarding</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
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
                                        "Accuracy Notice: Please ensure each signature sample is clear and centered for optimal system verification."
                                    </p>
                                </div>

                                <button
                                    onClick={handleRegister}
                                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-600/20 transition-all active:scale-[0.98]"
                                >
                                    Finalize Registration
                                </button>
                            </div>

                            {/* Right Side: 3-Box Signature Intake */}
                            <div className="space-y-4">
                                <label className="block text-xs font-black text-slate-500 uppercase mb-5 tracking-widest text-center">
                                    Individual Reference Signatures (3 Samples Required)
                                </label>

                                {[0, 1, 2].map((idx) => (
                                    <div key={idx} className="relative group h-32 bg-slate-950 border-2 border-dashed border-slate-800 rounded-2xl flex items-center justify-center overflow-hidden transition-all hover:border-indigo-500/50">
                                        {previews[idx] ? (
                                            <div className="flex items-center w-full h-full p-4 gap-4">
                                                <img src={previews[idx]} alt={`sample-${idx}`} className="h-full w-32 object-contain bg-white rounded-lg" />
                                                <div className="flex-1">
                                                    <p className="text-white font-bold text-sm">Sample {idx + 1}</p>
                                                    <p className="text-emerald-500 text-[10px] font-bold uppercase">Ready</p>
                                                </div>
                                                <button
                                                    onClick={() => removeFile(idx)}
                                                    className="p-2 bg-rose-500/10 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        ) : (
                                            <label className="cursor-pointer flex items-center justify-center gap-4 w-full h-full">
                                                <div className="p-3 bg-slate-900 rounded-xl">
                                                    <Camera className="text-slate-500" size={24} />
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-white font-bold text-sm">Upload Signature {idx + 1}</p>
                                                    <p className="text-slate-500 text-[10px]">Click to browse</p>
                                                </div>
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={(e) => handleFileChange(idx, e)}
                                                />
                                            </label>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* List View */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredAccounts.length > 0 ? (
                    filteredAccounts.map(acc => (
                        <div key={acc.accountNumber} className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl flex items-center justify-between hover:border-slate-700 transition-all group">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 bg-slate-800 rounded-xl flex items-center justify-center text-slate-500 group-hover:text-indigo-400 group-hover:bg-indigo-500/10 transition-all">
                                    <UserCircle size={28} />
                                </div>
                                <div>
                                    <p className="text-white font-bold">{acc.fullName}</p>
                                    <p className="text-xs text-slate-500 flex items-center gap-1">
                                        <CreditCard size={12} /> {acc.accountNumber}
                                    </p>
                                </div>
                            </div>
                            <div className="text-[10px] font-bold px-2 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-md uppercase tracking-wider">
                                Verified
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center text-slate-600 border border-dashed border-slate-800 rounded-3xl">
                        No account holders found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default SignatureIntakePage;
