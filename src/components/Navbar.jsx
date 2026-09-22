import React, { useState, useEffect } from 'react';
import { appConfig, isSidebarLayout, getSidebarClasses } from '../config/appConfig';

/**
 * Navbar - Sistema de navegación adaptable (Top Header o Sidebar Lateral)
 * Soporta alineación de tabs, reloj dinámico, hardware badge, temas de sidebar y reordenamiento de menú.
 * @param {string} activeTab - Tab activo ('dashboard' | 'bitacora' | 'inasistencias' | 'altas')
 * @param {function} setActiveTab - Función selectora de tab
 */
export default function Navbar({ activeTab, setActiveTab }) {
  // Reloj en tiempo real
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const horaLocal = currentTime.toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  const fechaLocal = currentTime.toLocaleDateString('es-MX', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });

  const allNavItems = [
    {
      id: 'dashboard',
      label: appConfig.modules.dashboard?.label || 'Dashboard',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      id: 'bitacora',
      label: appConfig.modules.bitacora?.label || 'Registro de Asistencia',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
    },
    {
      id: 'inasistencias',
      label: appConfig.modules.inasistencias?.label || 'Inasistencias',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
    {
      id: 'altas',
      label: appConfig.modules.altas?.label || 'Usuarios',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
  ];

  // Reordenar las pestañas según appConfig.layout.menuOrder
  const customOrder = appConfig.layout?.menuOrder || ['dashboard', 'bitacora', 'inasistencias', 'altas'];
  const orderedItems = [
    ...customOrder
      .map((id) => allNavItems.find((item) => item.id === id))
      .filter(Boolean),
    ...allNavItems.filter((item) => !customOrder.includes(item.id)),
  ];

  // Filtrar solo los módulos que estén habilitados en appConfig.modules
  const navItems = orderedItems.filter((item) => appConfig.modules[item.id]?.enabled !== false);

  const isSidebar = isSidebarLayout();
  const sidebarStyles = getSidebarClasses();
  const showClock = appConfig.layout?.navbar?.showLiveClock !== false;
  const showHardware = appConfig.layout?.navbar?.showHardwareBadge !== false;
  const showLogo = appConfig.layout?.sidebar?.showLogo !== false;
  const alignment = appConfig.layout?.navbar?.tabsAlignment || 'center';

  // ============================================================================
  // MODO 1: SIDEBAR LATERAL IZQUIERDO (navigationStyle === 'sidebar' o 'slidebar')
  // ============================================================================
  if (isSidebar) {
    return (
      <aside className={sidebarStyles.aside}>
        {/* Encabezado e Identidad */}
        <div className="space-y-6">
          <div className={`pb-4 border-b ${sidebarStyles.headerBorder}`}>
            <div className="flex items-center gap-2 mb-1.5">
              {showLogo && (
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block ring-2 ring-emerald-300"></span>
              )}
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold border inline-block ${
                sidebarStyles.isDarkOrBrand
                  ? 'bg-white/10 text-white border-white/20'
                  : 'theme-accent-light'
              }`}>
                {appConfig.institution.shortName}
              </span>
            </div>
            <h2 className={`font-bold text-sm leading-snug ${
              sidebarStyles.isDarkOrBrand ? 'text-white' : 'text-slate-900'
            }`}>
              {appConfig.institution.name}
            </h2>
            <p className={`text-[11px] mt-0.5 ${
              sidebarStyles.isDarkOrBrand ? 'text-slate-300' : 'text-slate-500'
            }`}>
              {appConfig.institution.subtitle}
            </p>
          </div>

          {/* Menú de Navegación Vertical */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? sidebarStyles.navActive
                      : sidebarStyles.navInactive
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Widgets Inferiores del Sidebar: Reloj y Estado del ESP32 */}
        <div className={`space-y-3 pt-4 border-t ${sidebarStyles.headerBorder} text-xs`}>
          {showClock && (
            <div className={`p-3 border rounded-xl space-y-1 font-mono ${sidebarStyles.footerCard}`}>
              <div className={`flex items-center gap-2 font-bold text-sm ${
                sidebarStyles.isDarkOrBrand ? 'text-white' : 'text-slate-800'
              }`}>
                <svg className={`w-3.5 h-3.5 animate-pulse ${
                  sidebarStyles.isDarkOrBrand ? 'text-emerald-400' : 'theme-text-primary'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{horaLocal}</span>
              </div>
              <p className={`text-[11px] capitalize ${
                sidebarStyles.isDarkOrBrand ? 'text-slate-300' : 'text-slate-500'
              }`}>{fechaLocal}</p>
            </div>
          )}

          {showHardware && (
            <div className={`p-2.5 rounded-xl border text-xs font-mono flex items-center justify-between ${
              sidebarStyles.isDarkOrBrand
                ? 'bg-white/10 border-white/15 text-white'
                : 'bg-emerald-50 border-emerald-200 text-emerald-800'
            }`}>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="font-semibold">{appConfig.hardware.label}</span>
              </div>
              <span className={`text-[11px] ${
                sidebarStyles.isDarkOrBrand ? 'text-emerald-300' : 'text-emerald-700'
              }`}>{appConfig.hardware.ip}</span>
            </div>
          )}
        </div>
      </aside>
    );
  }

  // ============================================================================
  // MODO 2: BARRA HORIZONTAL SUPERIOR (navigationStyle === 'top')
  // ============================================================================
  const alignmentClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  };

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Identificador Configurable */}
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded font-semibold theme-accent-light border">
                  {appConfig.institution.shortName}
                </span>
                <span className="font-bold text-slate-900 text-sm hidden sm:inline">
                  {appConfig.institution.name}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                {appConfig.institution.subtitle}
              </p>
            </div>
          </div>

          {/* Navigation Tabs Horizontales con Alineación Configurable */}
          <div className={`flex-1 flex ${alignmentClasses[alignment] || 'justify-center'} px-4`}>
            <nav className="flex items-center space-x-1 sm:space-x-1.5 bg-slate-100/80 p-1 rounded-xl border border-slate-200/80">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      isActive
                        ? 'bg-white text-slate-900 shadow-xs border border-slate-200/90 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                    }`}
                  >
                    {item.icon}
                    <span className="hidden md:inline">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Widgets Derechos: Reloj y Badge ESP32 */}
          <div className="flex items-center gap-3">
            {showClock && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-100/90 border border-slate-200/90 rounded-lg text-xs font-mono text-slate-800 shadow-xs">
                <svg className="w-3.5 h-3.5 theme-text-primary animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-semibold text-slate-900">{horaLocal}</span>
                <span className="text-slate-300">|</span>
                <span className="text-slate-500 capitalize">{fechaLocal}</span>
              </div>
            )}

            {showHardware && (
              <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-mono text-emerald-800">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>{appConfig.hardware.label}: {appConfig.hardware.ip}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
