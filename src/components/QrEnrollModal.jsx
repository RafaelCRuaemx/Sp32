import React, { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function QrEnrollModal({ email, tempToken, isOpen, onClose }) {
  const [copied, setCopied] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && tempToken && !data) {
      setLoading(true);
      authService.setup2FAReal(tempToken)
        .then(res => setData(res))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    } else if (isOpen && !tempToken && !data) {
        setData(authService.setup2FA(email || 'admin@escuela.edu'));
    }
  }, [isOpen, tempToken, data, email]);

  if (!isOpen) return null;

  const handleCopy = () => {
    if(!data) return;
    navigator.clipboard.writeText(data.secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </span>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Vincular Google Authenticator</h3>
              <p className="text-xs text-slate-500">Escanea el código con la app en tu celular</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-4">
          {loading || !data ? (
              <div className="text-center p-6 text-sm text-slate-500">Generando código seguro...</div>
          ) : (
            <>
              {/* Imagen del Código QR */}
              <div className="flex flex-col items-center justify-center p-3 bg-slate-50 rounded-xl border border-slate-200">
                <img
                  src={data.qrImageUrl}
                  alt="Código QR Google Authenticator"
                  className="w-48 h-48 rounded-lg shadow-xs bg-white p-1"
                />
                <p className="text-[11px] text-slate-500 mt-2 text-center">
                  Abre <strong>Google Authenticator</strong> en tu teléfono, pulsa <strong>(+)</strong> y selecciona <strong>Escanear código QR</strong>.
                </p>
              </div>

              {/* Clave Manual Base32 */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                <span className="text-slate-500 font-medium block mb-1">¿No puedes escanear el QR? Usa esta clave:</span>
                <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-slate-300 font-mono font-bold text-slate-800 tracking-wider">
                  <span>{data.secret}</span>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="text-[11px] px-2 py-0.5 rounded theme-btn-primary cursor-pointer transition-all"
                  >
                    {copied ? '¡Copiado!' : 'Copiar'}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        <button
          onClick={onClose}
          type="button"
          className="w-full py-2.5 rounded-xl font-semibold text-xs theme-btn-primary shadow-xs cursor-pointer transition-all"
        >
          Listo, ya lo agregué a mi celular
        </button>
      </div>
    </div>
  );
}
