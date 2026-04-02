import React from 'react';

const ToggleSwitch = ({ isOn, onToggle }) => {
    return (
        <div className="flex items-center gap-3 group cursor-pointer" onClick={onToggle}>
            <div
                className={`relative inline-flex h-5 w-10 items-center rounded-full transition-all duration-300 focus:outline-none shadow-inner ${isOn
                        ? 'bg-indigo-600 shadow-indigo-500/20'
                        : 'bg-slate-800 border border-slate-700'
                    }`}
            >
                <span
                    className={`inline-block h-3 w-3 transform rounded-full bg-white shadow-md transition-transform duration-300 ease-in-out ${isOn ? 'translate-x-6' : 'translate-x-1'
                        }`}
                />
            </div>
            <span
                className={`text-[10px] font-black uppercase tracking-widest transition-colors duration-300 ${isOn ? 'text-indigo-400' : 'text-slate-500'
                    }`}
            >
                {isOn ? 'Active' : 'Disabled'}
            </span>
        </div>
    );
};

export default ToggleSwitch;
