/**
 * ==============================================================================
 * SERVICIO DE AUTENTICACIÓN Y DOBLE FACTOR (2FA / TOTP)
 * ==============================================================================
 * Soporta modo simulación (Mock) para pruebas locales y conexión real con Django REST.
 */
import { appConfig } from '../config/appConfig';
import { request } from './api';

const STORAGE_KEY_TOKEN = 'rfid_auth_token';
const STORAGE_KEY_USER = 'rfid_auth_user';
const STORAGE_KEY_2FA_SECRET = 'rfid_2fa_secret';

// Clave secreta Base32 de demostración (compatible con Google Authenticator)
const DEMO_BASE32_SECRET = 'JBSWY3DPEHPK3PXP';

export const authService = {
  /**
   * Verifica si hay una sesión activa guardada
   */
  isAuthenticated: () => {
    if (!appConfig.security?.auth?.requireLogin) return true;
    return !!localStorage.getItem(STORAGE_KEY_TOKEN);
  },

  /**
   * Obtiene los datos del usuario actual
   */
  getCurrentUser: () => {
    try {
      const user = localStorage.getItem(STORAGE_KEY_USER);
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  /**
   * Paso 1: Valida usuario y contraseña
   */
  login: async (email, password) => {
    const isMock = appConfig.security?.auth?.mockMode ?? true;

    if (isMock) {
      // Simulación en frontend
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (email.trim() && password.length >= 4) {
        const requires2FA = appConfig.security?.auth?.enable2FA ?? true;

        if (requires2FA) {
          return {
            status: '2fa_required',
            tempToken: 'temp_token_mock_12345',
            user: {
              email,
              name: email.split('@')[0].toUpperCase(),
              role: 'Administrador Escolar',
            },
          };
        }

        // Si 2FA está apagado en appConfig, inicia sesión directo
        const sessionData = {
          token: 'mock_jwt_token_school_rfid_999',
          user: { email, name: 'Admin Escolar', role: 'Administrador' },
        };
        localStorage.setItem(STORAGE_KEY_TOKEN, sessionData.token);
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(sessionData.user));
        return { status: 'success', ...sessionData };
      }
      throw new Error('Credenciales incorrectas (mínimo 4 caracteres en contraseña)');
    }

    // Modo producción con Django usando cliente centralizado:
    return request('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  /**
   * Genera los datos para enrolar Google Authenticator (QR y clave manual)
   */
  setup2FA: (email) => {
    const issuer = appConfig.security?.auth?.issuerName || 'Control Escolar RFID';
    const secret = localStorage.getItem(STORAGE_KEY_2FA_SECRET) || DEMO_BASE32_SECRET;
    localStorage.setItem(STORAGE_KEY_2FA_SECRET, secret);

    // Formato estándar RFC 6238 otpauth URI
    const otpauthUrl = `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(email)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}`;
    
    // Generación de imagen QR de alta resolución
    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=8&data=${encodeURIComponent(otpauthUrl)}`;

    return {
      secret,
      otpauthUrl,
      qrImageUrl,
      backupCodes: ['8421-9032', '3109-7741', '9920-1145', '6021-4488', '7153-2900'],
    };
  },

  /**
   * Paso 2: Valida el código de 6 dígitos ingresado desde Google Authenticator
   */
  verify2FA: async (tempToken, code, user) => {
    const isMock = appConfig.security?.auth?.mockMode ?? true;

    if (isMock) {
      await new Promise((resolve) => setTimeout(resolve, 400));

      // En modo mock acepta cualquier código de 6 dígitos numéricos o códigos maestros (ej: 123456)
      const cleanCode = String(code).trim();
      if (/^\d{6}$/.test(cleanCode)) {
        const sessionToken = 'mock_jwt_auth_token_verified';
        localStorage.setItem(STORAGE_KEY_TOKEN, sessionToken);
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
        return { status: 'success', token: sessionToken, user };
      }
      throw new Error('Código TOTP inválido. Deben ser 6 dígitos numéricos.');
    }

    // Modo producción con Django:
    const data = await request('/auth/verify-2fa/', {
      method: 'POST',
      body: JSON.stringify({ temp_token: tempToken, code }),
    });

    localStorage.setItem(STORAGE_KEY_TOKEN, data.token);
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(data.user));
    return data;
  },

  /**
   * Cierra la sesión
   */
  setup2FAReal: async (tempToken) => {
    return request('/auth/setup-2fa/', {
      method: 'POST',
      body: JSON.stringify({ temp_token: tempToken }),
    });
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEY_TOKEN);
    localStorage.removeItem(STORAGE_KEY_USER);
  },

  /** 
   * Verifica silenciosamente con el Backend si el token actual es válido
   */
  verifySessionOnServer: async () => {
    const isMock = appConfig.security?.auth?.mockMode ?? true;
    const token = localStorage.getItem(STORAGE_KEY_TOKEN);
    if (!token) return false;
    if (isMock) return true;
      
    try {
      await request('/auth/verify-token/');
      return true;
    } catch {
      return false;
    }
  },
};
