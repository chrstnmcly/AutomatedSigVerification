import React, { useState } from 'react';
import { Upload, Trash2, CheckCircle, Image as ImageIcon, Camera } from 'lucide-react';

const SignatureUpload = ({ onImageReady, resetTrigger }) => {
    const [preview, setPreview] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
            onImageReady(reader.result); // Pass base64 to parent
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="space-y-4">
            <div className="relative group aspect-[4/3] bg-slate-950 border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center overflow-hidden transition-all hover:border-indigo-500/50">
                {preview ? (
                    <>
                        <img src={preview} alt="signature sheet" className="w-full h-full object-contain p-2" />
                        <button
                            onClick={() => { setPreview(null); onImageReady(null); }}
                            className="absolute top-4 right-4 p-2 bg-rose-500 text-white rounded-xl shadow-xl"
                        >
                            <Trash2 size={18} />
                        </button>
                    </>
                ) : (
                    <label className="cursor-pointer flex flex-col items-center p-8 text-center w-full h-full justify-center">
                        <div className="p-4 bg-indigo-500/10 rounded-2xl mb-4">
                            <Camera className="text-indigo-400" size={40} />
                        </div>
                        <p className="text-white font-bold">Upload Signature Sheet</p>
                        <p className="text-slate-500 text-xs mt-2">Take a clear photo of the paper <br /> containing all 3 signatures.</p>
                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    </label>
                )}
            </div>
        </div>
    );
};

export default SignatureUpload;
