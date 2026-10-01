import React, { useEffect } from 'react';
import { appConfig } from '../config/appConfig';
import {CheckIcon, XMarkIcon, InformationCircleIcon} from '@heroicons/react/24/outline';

/**
 * Toast - Componente de notificación flotante no invasivo
 * Reemplaza los alerts nativos con diseño moderno y armónico.
 */
export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (toast?.show) {
      const duration = appConfig.security?.toastDurationMs || 3500;
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  if (!toast?.show) return null;

  const isSuccess = toast.type === 'success' || !toast.type;
  const isError = toast.type === 'error';

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full animate-in fade-in slide-in-from-bottom-3 duration-200">
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-lg flex items-start gap-3">
        <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
          isSuccess
            ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
            : isError
            ? 'bg-rose-50 text-rose-600 border border-rose-200'
            : 'bg-indigo-50 text-indigo-600 border border-indigo-200'
        }`}>
          {isSuccess ? (
            <CheckIcon className="w-3.5 h-3.5" />
          ) : isError ? (
            <XMarkIcon className="w-3.5 h-3.5" />
          ) : (
            <InformationCircleIcon className="w-3.5 h-3.5" />
          )}
        </div>

        <div className="flex-1">
          <p className="text-xs font-semibold text-slate-900">{toast.title || 'Notificación'}</p>
          <p className="text-xs text-slate-500 mt-0.5">{toast.message}</p>
        </div>

        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 text-xs font-bold p-1 cursor-pointer"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

