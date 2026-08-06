import React, { useState } from 'react';
import { Building2, Globe, AlertCircle, ShieldCheck, Terminal, ExternalLink, Activity, Bug } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { firebaseInitStatus, firebaseConfig, lastAuthErrorAudit } from '../lib/firebase';
import { AdminDiagnosticPanel } from './AdminDiagnosticPanel';

export const LoginView: React.FC = () => {
  const { loginWithGoogle, loginWithGoogleRedirect, loading, error, clearError } = useAuth();
  const [showAdminDiagnostic, setShowAdminDiagnostic] = useState(false);

  const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'desconocido';
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'desconocido';
  const consoleSettingsUrl = `https://console.firebase.google.com/project/${firebaseConfig.projectId}/authentication/settings`;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between font-sans selection:bg-[#007bc1] selection:text-white">
      {/* Top Banner Header */}
      <header className="border-b border-slate-800 bg-slate-950/60 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-[#005a9e] flex items-center justify-center shadow-lg shadow-[#005a9e]/20">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-xl text-white tracking-wide">AVISAME</span>
              <span className="text-[10px] bg-[#007bc1]/20 text-[#007bc1] border border-[#007bc1]/30 font-bold px-2 py-0.5 rounded">
                PLATAFORMA PAS
              </span>
            </div>
            <p className="text-xs text-slate-400">Plataforma Inteligente para Productores Asesores de Seguros</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowAdminDiagnostic(true)}
            className="flex items-center space-x-1.5 text-xs text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1.5 rounded-lg border border-amber-500/30 font-semibold transition-colors cursor-pointer"
            title="Abrir Panel de Diagnóstico para Administradores"
          >
            <Activity className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Diagnóstico Admin</span>
          </button>

          <div className="hidden md:flex items-center space-x-2 text-xs text-slate-400 bg-slate-800/60 px-3 py-1.5 rounded-full border border-slate-700/60">
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>Plataforma <strong className="text-slate-200">cionar.com.ar</strong></span>
          </div>
        </div>
      </header>

      {/* Main Login Card Area */}
      <main className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Background Subtle Gradient Blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#005a9e]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#007bc1]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-lg bg-slate-950/80 border border-slate-800 rounded-2xl p-8 shadow-2xl backdrop-blur-xl relative z-10 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Acceso Productor Asesor</h1>
            <p className="text-slate-400 text-sm">
              Inicie sesión con su cuenta de Google para acceder a sus clientes, cartera de pólizas y automatizaciones.
            </p>
          </div>

          {!firebaseInitStatus.isValid && (
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-200 text-xs space-y-2">
              <div className="flex items-center space-x-2 font-bold text-amber-300">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Error de Configuración Firebase</span>
              </div>
              <p className="text-slate-300">{firebaseInitStatus.errorDetail}</p>
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-400 space-y-1">
                <div>Source: <span className="text-amber-300">{firebaseInitStatus.configSource}</span></div>
                <div>Project ID: <span className="text-white">{firebaseConfig.projectId || 'N/A'}</span></div>
                <div>Auth Domain: <span className="text-white">{firebaseConfig.authDomain || 'N/A'}</span></div>
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-xs space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div className="font-semibold text-red-200 text-sm">Error en signInWithPopup() (SDK Raw)</div>
                </div>
                <button
                  onClick={clearError}
                  className="text-red-400 hover:text-red-200 font-bold ml-2 cursor-pointer text-base"
                >
                  ×
                </button>
              </div>

              {/* Exact raw fields breakdown */}
              <div className="text-slate-300 font-mono text-[11px] leading-relaxed bg-slate-900/90 p-3 rounded-lg border border-red-500/20 space-y-1.5 overflow-x-auto">
                <div>
                  <span className="text-amber-400 font-bold">error.code: </span>
                  <span className="text-rose-300 font-bold">{lastAuthErrorAudit?.code ?? 'null'}</span>
                </div>
                <div>
                  <span className="text-amber-400 font-bold">error.message: </span>
                  <span className="text-slate-200">{lastAuthErrorAudit?.message ?? error}</span>
                </div>
                <div>
                  <span className="text-amber-400 font-bold">error.customData: </span>
                  <span className="text-slate-400">
                    {lastAuthErrorAudit?.customData
                      ? JSON.stringify(lastAuthErrorAudit.customData)
                      : 'undefined'}
                  </span>
                </div>
                <div className="pt-1.5 border-t border-slate-800 text-[10px] text-slate-400 grid grid-cols-1 sm:grid-cols-2 gap-1">
                  <div><span className="text-sky-400 font-bold">origin: </span>{currentOrigin}</div>
                  <div><span className="text-sky-400 font-bold">hostname: </span>{currentHost}</div>
                </div>
              </div>

              {/* Technical Assistance Links */}
              <div className="pt-1 flex items-center justify-between text-[11px]">
                <a
                  href={consoleSettingsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#00aeef] hover:text-[#4ae2fe] font-bold flex items-center gap-1 underline"
                >
                  <span>Firebase Console Settings</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <button
                  onClick={() => setShowAdminDiagnostic(true)}
                  className="text-amber-300 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Terminal className="w-3 h-3" />
                  <span>Ver Diagnóstico Completo</span>
                </button>
              </div>
            </div>
          )}

          {/* Login Options */}
          <div className="space-y-3">
            {/* Google Sign In Button - Popup (Original) */}
            <button
              onClick={() => loginWithGoogle()}
              disabled={loading || !firebaseInitStatus.isValid}
              className="w-full py-3.5 px-4 bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center space-x-3 group disabled:opacity-50 cursor-pointer"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{loading ? 'Verificando sesión...' : 'Iniciar Sesión con Google (Popup)'}</span>
            </button>

            {/* Google Sign In Button - Redirect (A/B Test) */}
            <button
              onClick={() => loginWithGoogleRedirect()}
              disabled={loading || !firebaseInitStatus.isValid}
              className="w-full py-3.5 px-4 bg-slate-800 hover:bg-slate-700 text-sky-300 font-bold text-sm rounded-xl border border-sky-500/30 shadow-lg transition-all duration-200 flex items-center justify-center space-x-3 group disabled:opacity-50 cursor-pointer"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Iniciar sesión con Google (Redirect)</span>
            </button>

            <div className="pt-2 text-[11px] text-slate-500 text-center flex items-center justify-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Prueba A/B: Popup vs Redirect para entorno iFrame AI Studio</span>
            </div>
          </div>
        </div>
      </main>

      {/* Admin Diagnostic Panel Modal */}
      <AdminDiagnosticPanel
        isOpen={showAdminDiagnostic}
        onClose={() => setShowAdminDiagnostic(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950/80 px-6 py-4 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <Building2 className="w-4 h-4 text-[#005a9e]" />
          <span>AVISAME Seguros &copy; {new Date().getFullYear()} - cionar.com.ar</span>
        </div>
        <div className="flex items-center space-x-3 text-[11px] text-slate-600">
          <span>Gestión Inteligente de Pólizas y Clientes</span>
          <span>&bull;</span>
          <button
            onClick={() => setShowAdminDiagnostic(true)}
            className="hover:text-amber-300 transition-colors cursor-pointer"
          >
            Panel Admin
          </button>
        </div>
      </footer>
    </div>
  );
};




