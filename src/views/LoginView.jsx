import React, { useState, useEffect, useRef } from 'react';
import { appConfig, getCardShadowClass } from '../config/appConfig';
import { authService } from '../services/authService';
import QrEnrollModal from '../components/QrEnrollModal';

export default function LoginView({ onLoginSuccess }) {
  const [step, setStep] = useState(1); // 1 = Credenciales, 2 = Desafío 2FA
  const [email, setEmail] = useState('admin@escuela.edu');
  const [password, setPassword] = useState('admin123');
  const [tempUser, setTempUser] = useState(null);
  const [tempToken, setTempToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showQrModal, setShowQrModal] = useState(false);

  // 6 casillas del PIN TOTP
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const pinInputRefs = useRef([]);

  // Temporizador circular de 30 segundos
  const [secondsLeft, setSecondsLeft] = useState(30);

  useEffect(() => {
    if (step === 2) {
      const interval = setInterval(() => {
        const currentSec = Math.floor(Date.now() / 1000) % 30;
        setSecondsLeft(30 - currentSec);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [step]);

  // Manejo de teclado en el PIN de 6 casillas (auto-focus y backspace)
  const handlePinChange = (index, value) => {
    if (value.length > 1) {
      // Si el usuario pega un código completo (ej: 456789)
      const pasted = value.replace(/\D/g, '').slice(0, 6).split('');
      const newPin = [...pin];
      pasted.forEach((char, i) => {
        if (i < 6) newPin[i] = char;
      });
      setPin(newPin);
      const nextIndex = Math.min(pasted.length, 5);
      pinInputRefs.current[nextIndex]?.focus();
      if (pasted.length === 6) {
        verifyOtpCode(newPin.join(''));
      }
      return;
    }

    const digit = value.replace(/\D/g, '');
    const newPin = [...pin];
    newPin[index] = digit;
    setPin(newPin);

    // Salto automático a la siguiente casilla
    if (digit && index < 5) {
      pinInputRefs.current[index + 1]?.focus();
    }

    // Si llenó las 6 casillas, verificar automáticamente
    if (digit && index === 5) {
      const fullPin = newPin.join('');
      if (fullPin.length === 6) {
        verifyOtpCode(fullPin);
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      pinInputRefs.current[index - 1]?.focus();
    }
  };

  // Paso 1: Enviar credenciales
  const handleSubmitCredentials = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await authService.login(email, password);
      if (res.status === '2fa_required') {
        setTempUser(res.user);
        setTempToken(res.tempToken);
        setStep(2);
        setTimeout(() => pinInputRefs.current[0]?.focus(), 150);
      } else if (res.status === 'success') {
        onLoginSuccess(res.user);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  // Paso 2: Verificar código TOTP
  const verifyOtpCode = async (codeToVerify) => {
    setErrorMsg('');
    setLoading(true);

    try {
      const result = await authService.verify2FA(tempToken, codeToVerify, tempUser);
      onLoginSuccess(result.user);
    } catch (err) {
      setErrorMsg(err.message || 'Código incorrecto');
      setPin(['', '', '', '', '', '']);
      pinInputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-100/80">
      <div className={`w-full max-w-md bg-white rounded-3xl p-8 border border-slate-200 ${getCardShadowClass()} relative`}>
        {/* Encabezado Institucional */}
        <div className="text-center mb-6">
          {appConfig.institution?.logoUrl && (
            <img
              src={appConfig.institution.logoUrl}
              alt="Logo"
              className="w-14 h-14 mx-auto mb-2 object-contain"
            />
          )}
          <span className="text-[11px] font-mono px-2.5 py-0.5 rounded font-semibold theme-btn-primary shadow-xs">
            {appConfig.institution?.shortName || 'RFID ACCESS'}
          </span>
          <h1 className="text-xl font-bold text-slate-900 mt-2">
            {appConfig.institution?.name || 'Sistema de Control Escolar'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {step === 1 ? 'Acceso administrativo seguro' : 'Verificación de dos factores (2FA)'}
          </p>
        </div>

        {/* Mensaje de Error */}
        {errorMsg && (
          <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* ============================================================== */}
        {/* PASO 1: FORMULARIO DE USUARIO Y CONTRASEÑA                    */}
        {/* ============================================================== */}
        {step === 1 ? (
          <form onSubmit={handleSubmitCredentials} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Correo Electrónico Institucional
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@escuela.edu"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-xs theme-btn-primary shadow-xs cursor-pointer transition-all flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <span>Validando credenciales...</span>
              ) : (
                <>
                  <span>Continuar</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </form>
        ) : (
          /* ============================================================== */
          /* PASO 2: DESAFÍO GOOGLE AUTHENTICATOR (6 DÍGITOS)               */
          /* ============================================================== */
          <div className="space-y-5">
            <div className="text-center bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <div className="w-10 h-10 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-1.5">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-xs font-semibold text-slate-800">Introduce el código de 6 dígitos</p>
              <p className="text-[11px] text-slate-500">Generado en tu app Google Authenticator</p>
            </div>

            {/* 6 Casillas Numéricas */}
            <div className="flex justify-between gap-2 max-w-xs mx-auto">
              {pin.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (pinInputRefs.current[i] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={digit}
                  onChange={(e) => handlePinChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className="w-11 h-13 text-center text-xl font-bold font-mono rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all shadow-xs bg-white text-slate-900"
                />
              ))}
            </div>

            {/* Temporizador de 30s */}
            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>El código cambia en: <strong>{secondsLeft}s</strong></span>
            </div>

            {/* Acciones adicionales */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowQrModal(true)}
                className="w-full text-center text-xs font-semibold text-emerald-600 hover:text-emerald-700 cursor-pointer py-1"
              >
                ¿No tienes configurado el autenticador? Ver Código QR
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setPin(['', '', '', '', '', '']);
                }}
                className="w-full text-center text-xs text-slate-500 hover:text-slate-700 cursor-pointer py-1"
              >
                ← Volver a usuario y contraseña
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal para enrolar QR */}
      <QrEnrollModal
        isOpen={showQrModal}
        email={email}
        onClose={() => setShowQrModal(false)}
      />
    </div>
  );
}
