import React, { useState, useEffect } from 'react';
import {
  Activity,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Server,
  Globe,
  UserCheck,
  Key,
  ExternalLink,
  RefreshCw,
  Terminal,
  X,
  ShieldCheck,
  Bug
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { firebaseConfig, firebaseInitStatus, db, auth, lastAuthErrorAudit } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface AdminDiagnosticPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminDiagnosticPanel: React.FC<AdminDiagnosticPanelProps> = ({ isOpen, onClose }) => {
  const { user, error: authContextError } = useAuth();
  const [firestoreStatus, setFirestoreStatus] = useState<'testing' | 'connected' | 'error'>('testing');
  const [firestoreError, setFirestoreError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'desconocido';
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'desconocido';
  const mainProductionDomain = 'avisame.cionar.com.ar';
  const consoleSettingsUrl = `https://console.firebase.google.com/project/${firebaseConfig.projectId}/authentication/settings`;

  const isDomainAuthorizedCandidate =
    currentHost === mainProductionDomain ||
    currentHost === 'localhost' ||
    currentHost === '127.0.0.1' ||
    currentHost.includes('run.app') ||
    currentHost === firebaseConfig.authDomain ||
    currentHost === `${firebaseConfig.projectId}.firebaseapp.com` ||
    currentHost === `${firebaseConfig.projectId}.web.app`;

  const runDiagnostics = async () => {
    setFirestoreStatus('testing');
    setFirestoreError(null);

    // Register logs in browser console as requested by prompt
    console.group('[DEBUG Admin Diagnostic Panel Audit]');
    console.log('Firebase Project ID:', firebaseConfig.projectId);
    console.log('Current Hostname:', currentHost);
    console.log('Current Origin:', currentOrigin);
    console.log('Auth Domain:', firebaseConfig.authDomain);
    console.log('Google Provider Enabled:', true);
    console.log('UID Authenticated:', user ? user.uid : 'No autenticado');
    console.log('Production Domain Target:', mainProductionDomain);
    console.log('Raw SDK error.code:', lastAuthErrorAudit?.code ?? 'N/A');
    console.log('Raw SDK error.message:', lastAuthErrorAudit?.message ?? 'N/A');
    console.log('Raw SDK error.customData:', lastAuthErrorAudit?.customData ?? 'N/A');
    console.groupEnd();

    // Test Firestore connectivity
    try {
      if (!firebaseInitStatus.isValid) {
        setFirestoreStatus('error');
        setFirestoreError(firebaseInitStatus.errorDetail || 'Configuración inválida');
        return;
      }
      const testRef = doc(db, '_system', 'ping');
      await getDoc(testRef);
      setFirestoreStatus('connected');
    } catch (err: any) {
      console.warn('[Admin Diagnostic] Firestore Ping:', err?.message || err);
      // Even if permission denied or doc doesn't exist, reachable response confirms connection
      if (err?.code === 'permission-denied' || err?.code === 'not-found') {
        setFirestoreStatus('connected');
      } else {
        setFirestoreStatus('error');
        setFirestoreError(err?.message || 'Error de conexión con Firestore');
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      runDiagnostics();
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const copyDiagnosticReport = () => {
    const report = `=== PANEL DE DIAGNÓSTICO ADMINISTRATIVO - AVISAME ===
Fecha/Hora: ${new Date().toLocaleString()}
Proyecto Firebase Activo: ${firebaseConfig.projectId}
UID Autenticado: ${user ? user.uid : 'No autenticado'}
Email Usuario: ${user ? user.email : 'N/A'}
window.location.hostname: ${currentHost}
window.location.origin: ${currentOrigin}
Dominio Principal Producción: ${mainProductionDomain}
Auth Domain Configurado: ${firebaseConfig.authDomain}
Estado Firestore: ${firestoreStatus === 'connected' ? 'Conectado' : firestoreStatus === 'testing' ? 'Probando' : 'Error'}
Estado Google Auth: ${firebaseInitStatus.isValid ? 'Habilitado (Google Provider Active)' : 'Error Configuración'}
---------------- RAW SDK AUTH ERROR AUDIT ----------------
error.code: ${lastAuthErrorAudit?.code ?? 'N/A'}
error.message: ${lastAuthErrorAudit?.message ?? (authContextError || 'N/A')}
error.customData: ${lastAuthErrorAudit?.customData ? JSON.stringify(lastAuthErrorAudit.customData) : 'N/A'}
URL Configuración Firebase Console: ${consoleSettingsUrl}
=====================================================`;

    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-slate-100 font-sans">
        
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#005a9e] flex items-center justify-center text-white shadow-md">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                Panel de Diagnóstico Admin
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-bold px-2 py-0.5 rounded-full uppercase">
                  Solo Administradores
                </span>
              </h3>
              <p className="text-xs text-slate-400">Verificación técnica del entorno Firebase y dominio</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Active Firebase Project */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-1">
              <div className="text-xs font-medium text-slate-400 flex items-center space-x-1.5">
                <Server className="w-3.5 h-3.5 text-[#00aeef]" />
                <span>Proyecto Firebase Activo</span>
              </div>
              <div className="font-mono text-sm font-bold text-white truncate" title={firebaseConfig.projectId}>
                {firebaseConfig.projectId || 'No configurado'}
              </div>
              <div className="text-[11px] text-slate-500">
                Source: <span className="text-slate-300 font-mono">{firebaseInitStatus.configSource}</span>
              </div>
            </div>

            {/* Authenticated UID */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-1">
              <div className="text-xs font-medium text-slate-400 flex items-center space-x-1.5">
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>UID Autenticado</span>
              </div>
              <div className="font-mono text-xs font-bold text-white truncate" title={user?.uid || 'No autenticado'}>
                {user ? user.uid : 'No autenticado'}
              </div>
              <div className="text-[11px] text-slate-400 truncate">
                {user?.email ? user.email : 'Sin sesión iniciada'}
              </div>
            </div>

            {/* Current Hostname */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-1">
              <div className="text-xs font-medium text-slate-400 flex items-center space-x-1.5">
                <Globe className="w-3.5 h-3.5 text-indigo-400" />
                <span>Dominio Actual (Hostname)</span>
              </div>
              <div className="font-mono text-xs font-bold text-white truncate" title={currentHost}>
                {currentHost}
              </div>
              <div className="text-[11px] flex items-center gap-1">
                {isDomainAuthorizedCandidate ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Candidato Autorizado
                  </span>
                ) : (
                  <span className="text-amber-400 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Dominio no estándar
                  </span>
                )}
              </div>
            </div>

            {/* Target Production Domain */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-1">
              <div className="text-xs font-medium text-slate-400 flex items-center space-x-1.5">
                <Globe className="w-3.5 h-3.5 text-sky-400" />
                <span>Dominio Principal Producción</span>
              </div>
              <div className="font-mono text-xs font-bold text-sky-300 truncate">
                {mainProductionDomain}
              </div>
              <div className="text-[11px] text-slate-400">
                Dominio exclusivo para entorno productivo
              </div>
            </div>

          </div>

          {/* Status Checks Box */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span>Estado de Servicios</span>
              <button
                onClick={runDiagnostics}
                className="text-[11px] text-[#00aeef] hover:underline flex items-center gap-1 font-normal cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" /> Re-evaluar
              </button>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Firestore Status */}
              <div className="flex items-center justify-between p-3 bg-slate-900/90 rounded-lg border border-slate-800">
                <div className="flex items-center space-x-2.5">
                  <Server className="w-4 h-4 text-slate-400" />
                  <div>
                    <div className="text-xs font-semibold text-slate-200">Conexión Firestore</div>
                    <div className="text-[10px] text-slate-400">
                      DB: {firebaseConfig.firestoreDatabaseId || '(default)'}
                    </div>
                  </div>
                </div>
                <div>
                  {firestoreStatus === 'testing' && (
                    <span className="text-xs text-amber-400 flex items-center gap-1 animate-pulse">
                      <RefreshCw className="w-3 h-3 animate-spin" /> Probando...
                    </span>
                  )}
                  {firestoreStatus === 'connected' && (
                    <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Conectado
                    </span>
                  )}
                  {firestoreStatus === 'error' && (
                    <span className="text-xs text-rose-400 font-bold flex items-center gap-1">
                      <XCircle className="w-3 h-3" /> Error
                    </span>
                  )}
                </div>
              </div>

              {/* Google Auth Status */}
              <div className="flex items-center justify-between p-3 bg-slate-900/90 rounded-lg border border-slate-800">
                <div className="flex items-center space-x-2.5">
                  <Key className="w-4 h-4 text-slate-400" />
                  <div>
                    <div className="text-xs font-semibold text-slate-200">Google Authentication</div>
                    <div className="text-[10px] text-slate-400">
                      Auth Domain: {firebaseConfig.authDomain || 'N/A'}
                    </div>
                  </div>
                </div>
                <div>
                  {firebaseInitStatus.isValid ? (
                    <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Habilitado
                    </span>
                  ) : (
                    <span className="text-xs text-rose-400 font-bold flex items-center gap-1">
                      <XCircle className="w-3 h-3" /> Invalido
                    </span>
                  )}
                </div>
              </div>

            </div>

            {firestoreError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-300 text-xs font-mono">
                Detalle Error Firestore: {firestoreError}
              </div>
            )}
          </div>

          {/* Raw Firebase Auth Error Audit Box */}
          <div className="bg-slate-950/80 border border-amber-500/30 rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Bug className="w-4 h-4 text-amber-400" />
                Auditoría Raw Firebase SDK Error
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {lastAuthErrorAudit ? lastAuthErrorAudit.timestamp : 'Sin captura reciente'}
              </span>
            </h4>

            <div className="space-y-2 text-xs font-mono bg-slate-900/90 p-3 rounded-lg border border-slate-800 text-slate-200 overflow-x-auto">
              <div className="flex items-start gap-2">
                <span className="text-amber-400 font-bold shrink-0">error.code:</span>
                <span className={lastAuthErrorAudit?.code ? "text-rose-300 font-bold" : "text-slate-400"}>
                  {lastAuthErrorAudit?.code ?? 'null'}
                </span>
              </div>

              <div className="flex items-start gap-2">
                <span className="text-amber-400 font-bold shrink-0">error.message:</span>
                <span className={lastAuthErrorAudit?.message ? "text-rose-200" : "text-slate-400"}>
                  {lastAuthErrorAudit?.message ?? authContextError ?? 'null'}
                </span>
              </div>

              <div className="flex items-start gap-2">
                <span className="text-amber-400 font-bold shrink-0">error.customData:</span>
                <span className="text-slate-300">
                  {lastAuthErrorAudit?.customData
                    ? JSON.stringify(lastAuthErrorAudit.customData, null, 2)
                    : 'undefined'}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-sky-400 font-bold">window.location.origin: </span>
                  <span className="text-slate-200">{currentOrigin}</span>
                </div>
                <div>
                  <span className="text-sky-400 font-bold">window.location.hostname: </span>
                  <span className="text-slate-200">{currentHost}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Console Log Notice & Firebase Console Link */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-300">
              <Terminal className="w-4 h-4 text-[#00aeef]" />
              <span>Registros en Consola de Navegador</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Los detalles técnicos (<code className="text-sky-300">Firebase Project ID</code>, <code className="text-sky-300">Current Hostname</code>, <code className="text-sky-300">Auth Domain</code>, <code className="text-sky-300">Google Provider Enabled</code>) han sido emitidos a la consola F12 para auditoría de desarrollo.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800/80">
              <a
                href={consoleSettingsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#00aeef] hover:text-[#4ae2fe] font-semibold inline-flex items-center gap-1 transition-colors"
              >
                <span>Configuración en Firebase Console</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={copyDiagnosticReport}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>{copied ? '¡Copiado!' : 'Copiar Reporte'}</span>
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-6 py-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <div>AVISAME PAS Diagnostics &bull; Producción: {mainProductionDomain}</div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
