import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import DashboardView from './views/DashboardView';
import BitacoraView from './views/BitacoraView';
import InasistenciasView from './views/InasistenciasView';
import AltasRfidView from './views/AltasRfidView';
import { appConfig, getActiveTheme, getAppBackgroundColor, isSidebarLayout, isBottomNavLayout } from './config/appConfig';
import './App.css';
import LoginView from './views/LoginView';
import { authService } from './services/authService';

/**
 * App - Shell dinámico de la aplicación
 * Soporta navegación Horizontal Superior (top), Menú Lateral (sidebar izq/der con auto-ocultar) y Dock Inferior (bottom)
 * Inyecta variables CSS y controla la visibilidad modular y marca de agua
 */
function App() {
  const preferredDefault = appConfig.layout?.defaultView;
  const initialTab =
    preferredDefault && appConfig.modules[preferredDefault]?.enabled !== false
      ? preferredDefault
      : Object.keys(appConfig.modules).find(
          (key) => appConfig.modules[key]?.enabled !== false
        ) || 'dashboard';

  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('benitto_active_tab') || initialTab;
  });

  useEffect(() => {
    localStorage.setItem('benitto_active_tab', activeTab);
  }, [activeTab]);
  const [toast, setToast] = useState({ show: false, title: '', message: '', type: 'success' });

  // Control de sesión y 2FA (Google Authenticator)
  const [isAuthenticated, setIsAuthenticated] = useState(() => authService.isAuthenticated());
  const [currentUser, setCurrentUser] = useState(() => authService.getCurrentUser());

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    setToast({
      show: true,
      title: 'Acceso Autorizado',
      message: `Bienvenido al sistema, ${user?.name || 'Administrador'}`,
      type: 'success',
    });
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  const activeTheme = getActiveTheme();
  const themePreset = appConfig.themePreset;
  const fontFamily = appConfig.fontFamily;
  const currentFontSize = appConfig.appearance?.fontSize || 'normal';
  const backgroundMode = appConfig.appearance?.backgroundMode;
  const cardStyleConfig = appConfig.layout?.cards?.style;

  // Inyección de variables CSS según el tema configurado en appConfig.js
  useEffect(() => {
    const root = document.documentElement;

    root.style.setProperty('--color-primary', activeTheme.primary);
    root.style.setProperty('--color-primary-hover', activeTheme.primaryHover);
    root.style.setProperty('--color-primary-text', activeTheme.primaryText);
    root.style.setProperty('--color-accent', activeTheme.accent);
    root.style.setProperty('--color-accent-light', activeTheme.accentLight);
    root.style.setProperty('--color-badge-border', activeTheme.badgeBorder);

    // Fondo general dinámico (slate, tinted, pure-white o hexadecimal)
    const appBgColor = getAppBackgroundColor();
    root.style.setProperty('--app-bg-color', appBgColor);

    // Tipografía dinámica
    const defaultFonts = {
      sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      serif: 'Georgia, Cambria, "Times New Roman", Times, serif',
      mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    };
    const fontPresetsMap = { ...defaultFonts, ...(appConfig.fontPresets || {}) };
    const fontFamilyStyle = fontPresetsMap[fontFamily] || defaultFonts.sans;
    root.style.setProperty('--font-family-base', fontFamilyStyle);

    // Escala de tamaño de fuente general (compact, normal, large)
    if (currentFontSize === 'compact') {
      root.style.fontSize = '14px';
    } else if (currentFontSize === 'large') {
      root.style.fontSize = '17px';
    } else {
      root.style.fontSize = '15px';
    }

    // Bordes y sombras de botones y tarjetas
    const btnRadiusMap = { square: '0px', pill: '9999px', rounded: '0.5rem' };
    const btnShadowMap = {
      flat: 'none',
      soft: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      elevated: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    };
    root.style.setProperty('--btn-radius', btnRadiusMap[appConfig.buttons?.borderRadius] || '0.5rem');
    root.style.setProperty('--btn-shadow', btnShadowMap[appConfig.buttons?.elevation] || 'none');

    const cardRadiusMap = { none: '0px', rounded: '0.5rem', curved: '1rem' };
    root.style.setProperty('--card-radius', cardRadiusMap[appConfig.layout?.cards?.borderRadius] || '1rem');

    // Estilo y color de tarjetas según layout.cards.style
    const cardStyle = String(cardStyleConfig || 'theme-border').toLowerCase().trim();
    if (cardStyle === 'tinted') {
      root.style.setProperty('--card-bg', activeTheme.accentLight || '#f8fafc');
      root.style.setProperty('--card-border', activeTheme.badgeBorder || '#cbd5e1');
      root.style.setProperty('--card-border-hover', activeTheme.primary);
    } else if (cardStyle === 'glass') {
      root.style.setProperty('--card-bg', 'rgba(255, 255, 255, 0.85)');
      root.style.setProperty('--card-border', activeTheme.badgeBorder || '#cbd5e1');
      root.style.setProperty('--card-border-hover', activeTheme.primary);
    } else if (cardStyle === 'white') {
      root.style.setProperty('--card-bg', '#ffffff');
      root.style.setProperty('--card-border', '#e2e8f0');
      root.style.setProperty('--card-border-hover', '#cbd5e1');
    } else {
      // 'theme-border' (por defecto recomendado)
      root.style.setProperty('--card-bg', '#ffffff');
      root.style.setProperty('--card-border', activeTheme.badgeBorder || '#cbd5e1');
      root.style.setProperty('--card-border-hover', activeTheme.primary);
    }
  }, [activeTheme, themePreset, fontFamily, currentFontSize, backgroundMode, cardStyleConfig]);

  const showToast = (title, message, type = 'success') => {
    setToast({ show: true, title, message, type });
  };

  const closeToast = () => {
    setToast((prev) => ({ ...prev, show: false }));
  };

  const renderCurrentView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView showToast={showToast} />;
      case 'bitacora':
        return <BitacoraView showToast={showToast} />;
      case 'inasistencias':
        return <InasistenciasView showToast={showToast} />;
      case 'altas':
        return <AltasRfidView showToast={showToast} />;
      default:
        return <DashboardView showToast={showToast} />;
    }
  };

  const isSidebar = isSidebarLayout();
  const isBottom = isBottomNavLayout();
  const isRightSidebar = isSidebar && appConfig.layout?.sidebar?.position === 'right';

  // Si requireLogin está activo y el usuario no se ha autenticado con 2FA
  if (!isAuthenticated && appConfig.security?.auth?.requireLogin) {
    return (
      <div
        style={{
          '--color-primary': activeTheme.primary,
          '--color-primary-hover': activeTheme.primaryHover,
          '--color-primary-text': activeTheme.primaryText,
          '--color-accent': activeTheme.accent,
          '--color-accent-light': activeTheme.accentLight,
          '--color-badge-border': activeTheme.badgeBorder,
          fontFamily: 'var(--font-family-base)',
          backgroundColor: 'var(--app-bg-color, #f8fafc)',
        }}
      >
        <LoginView onLoginSuccess={handleLoginSuccess} />
        <Toast toast={toast} onClose={closeToast} />
      </div>
    );
  }

  return (
    <div
      style={{
        '--color-primary': activeTheme.primary,
        '--color-primary-hover': activeTheme.primaryHover,
        '--color-primary-text': activeTheme.primaryText,
        '--color-accent': activeTheme.accent,
        '--color-accent-light': activeTheme.accentLight,
        '--color-badge-border': activeTheme.badgeBorder,
        fontFamily: 'var(--font-family-base)',
        backgroundColor: 'var(--app-bg-color, #f8fafc)',
      }}
      className={`min-h-screen text-slate-900 antialiased relative ${
        isSidebar
          ? isRightSidebar
            ? 'flex flex-col md:flex md:flex-row-reverse'
            : 'flex flex-col md:flex md:flex-row'
          : 'flex flex-col'
      }`}
    >
      {/* Alerta de Telemetría si el lector está Offline */}
      {appConfig.telemetry?.offlineAlertBanner && String(appConfig.hardware?.status || '').toLowerCase() !== 'online' && (
        <div className="bg-amber-600 text-white text-xs font-semibold px-4 py-2 flex items-center justify-between shadow-xs sticky top-0 z-50">
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
            <span className="font-bold">⚠️ ALERTA DE TELEMETRÍA:</span>
            <span>
              El lector {appConfig.hardware.label} ({appConfig.hardware.ip}) se encuentra {appConfig.hardware.status}. Verifique la conexión WiFi del hardware.
            </span>
          </div>
        </div>
      )}
      {/* Marca de agua institucional tenue en el fondo */}
      {appConfig.watermark?.enabled && appConfig.watermark?.imageUrl && (
        <div
          className="fixed inset-0 pointer-events-none z-0 flex overflow-hidden select-none"
          style={{
            opacity: appConfig.watermark.opacity || 0.04,
            justifyContent: appConfig.watermark.position === 'bottom-right' ? 'flex-end' : 'center',
            alignItems: appConfig.watermark.position === 'bottom-right' ? 'flex-end' : 'center',
            padding: appConfig.watermark.position === 'bottom-right' ? '3rem' : '0',
          }}
        >
          <img
            src={appConfig.watermark.imageUrl}
            alt="Marca de agua institucional"
            className="max-w-none pointer-events-none select-none"
            style={{ width: appConfig.watermark.size || '420px', height: 'auto' }}
          />
        </div>
      )}

      {/* Navegación Adaptable (Topbar, Sidebar o Dock Inferior) */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={currentUser}
        onLogout={handleLogout}
      />

      {/* Contenedor Principal (Flexible en Sidebar, Centrado en Topbar/Bottom) */}
      <div className={`flex-1 flex flex-col min-h-screen relative z-10 ${isSidebar ? 'overflow-x-hidden' : ''}`}>
        <main className={`flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 ${isBottom ? 'pb-28' : ''}`}>
          {renderCurrentView()}
        </main>

        {/* Footer Institucional Configurable */}
        <footer className="border-t border-slate-200 bg-white py-4 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 font-mono">
            <div className="flex items-center gap-2">
              <span>{appConfig.institution.copyright}</span>
              {appConfig.institution.cct && (
                <>
                  <span>•</span>
                  <span>{appConfig.institution.cct}</span>
                </>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {appConfig.support?.supportEmail && (
                <span className="text-slate-400">
                  Soporte: {appConfig.support.supportEmail}
                </span>
              )}
              {appConfig.support?.version && (
                <span className="text-slate-400">• {appConfig.support.version}</span>
              )}
              <span>•</span>
              <span className="text-emerald-600 font-semibold">
                {appConfig.hardware.label} {appConfig.hardware.status} ({appConfig.hardware.ip})
              </span>  
            </div>
          </div>
        </footer>
      </div>

      {/* Toast Flotante Global */}
      <Toast toast={toast} onClose={closeToast} />
    </div>
  );
}

export default App;