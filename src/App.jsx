import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import DashboardView from './views/DashboardView';
import BitacoraView from './views/BitacoraView';
import InasistenciasView from './views/InasistenciasView';
import AltasRfidView from './views/AltasRfidView';
import { appConfig, getActiveTheme, isSidebarLayout } from './config/appConfig';
import './App.css';

/**
 * App - Shell dinámico de la aplicación
 * Soporta alternar entre navegación Horizontal Superior (top) y Menú Lateral (sidebar)
 * Inyecta variables CSS y controla la visibilidad modular
 */
function App() {
  const preferredDefault = appConfig.layout?.defaultView;
  const initialTab =
    preferredDefault && appConfig.modules[preferredDefault]?.enabled !== false
      ? preferredDefault
      : Object.keys(appConfig.modules).find(
          (key) => appConfig.modules[key]?.enabled !== false
        ) || 'dashboard';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [toast, setToast] = useState({ show: false, title: '', message: '', type: 'success' });

  // Inyección de variables CSS según el tema configurado en appConfig.js
  useEffect(() => {
    const theme = getActiveTheme();
    const root = document.documentElement;

    root.style.setProperty('--color-primary', theme.primary);
    root.style.setProperty('--color-primary-hover', theme.primaryHover);
    root.style.setProperty('--color-primary-text', theme.primaryText);
    root.style.setProperty('--color-accent', theme.accent);
    root.style.setProperty('--color-accent-light', theme.accentLight);
    root.style.setProperty('--color-badge-border', theme.badgeBorder);

    // Tipografía dinámica
    let fontFamilyStyle = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
    if (appConfig.fontFamily === 'serif') {
      fontFamilyStyle = 'Georgia, Cambria, "Times New Roman", Times, serif';
    } else if (appConfig.fontFamily === 'mono') {
      fontFamilyStyle = 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';
    }
    root.style.setProperty('--font-family-base', fontFamilyStyle);
  }, []);

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

  return (
    <div className={`min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-indigo-600 selection:text-white ${isSidebar ? 'flex' : 'flex flex-col'}`}>
      {/* Navegación Adaptable (Topbar o Sidebar) */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Contenedor Principal (Flexible en Sidebar, Centrado en Topbar) */}
      <div className={`flex-1 flex flex-col min-h-screen ${isSidebar ? 'overflow-x-hidden' : ''}`}>
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            <div className="flex items-center gap-3">
              <span className="text-slate-400">Punto de Control:</span>
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
