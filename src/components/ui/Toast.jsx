// src/components/ui/Toast.jsx
import React, { useEffect } from "react";
import { CheckCircle, XCircle, AlertCircle, X } from "lucide-react";

const Toast = ({ mensagem, tipo = "sucesso", onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    const icones = {
        sucesso: (
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
        ),
        erro: <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />,
        alerta: (
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
        ),
    };

    const cores = {
        sucesso: "border-l-4 border-green-500 bg-green-50",
        erro: "border-l-4 border-red-500 bg-red-50",
        alerta: "border-l-4 border-yellow-500 bg-yellow-50",
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <div
                className={`
                p-3 sm:p-4 rounded shadow-lg 
                flex items-center gap-3 
                min-w-[200px] sm:min-w-[300px] max-w-[90vw]
                animate-slide-up
                ${cores[tipo]}
            `}
            >
                {icones[tipo]}
                <span className="text-xs sm:text-sm flex-1">{mensagem}</span>
                <button
                    onClick={onClose}
                    className="p-1 hover:bg-black/5 rounded transition-colors"
                >
                    <X className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
            </div>
        </div>
    );
};

export default Toast;
