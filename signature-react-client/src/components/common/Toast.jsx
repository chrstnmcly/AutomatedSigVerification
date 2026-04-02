import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { XCircle, CheckCircle, Info } from 'lucide-react';

const Toast = () => {
    const { toast } = useAppContext();

    if (!toast.show) return null;

    const styles = {
        success: 'bg-emerald-500/10 border-emerald-500 text-emerald-400',
        error: 'bg-rose-500/10 border-rose-500 text-rose-400',
        info: 'bg-indigo-500/10 border-indigo-500 text-indigo-400',
    };

    const Icons = {
        success: <CheckCircle className="w-5 h-5" />,
        error: <XCircle className="w-5 h-5" />,
        info: <Info className="w-5 h-5" />,
    };

    return (
        <div className={`fixed bottom-5 right-5 z-[10000] flex items-center gap-3 p-4 rounded-xl border animate-in slide-in-from-right duration-300 ${styles[toast.type]}`}>
            {Icons[toast.type]}
            <span className="text-sm font-semibold">
                {typeof toast.message === 'object' ? JSON.stringify(toast.message) : toast.message}
            </span>
        </div>
    );
};

export default Toast;
