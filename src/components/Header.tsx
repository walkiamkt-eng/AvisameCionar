import React from 'react';
import { Shield, Bell, Plus, Search, HelpCircle, LogOut, User as UserIcon, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  activeProcessId: string;
  onNavigate: (processId: string) => void;
  pendingTasksCount: number;
  onOpenNewRecordModal: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenAdminDiagnostic?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeProcessId,
  onNavigate,
  pendingTasksCount,
  onOpenNewRecordModal,
  searchQuery,
  onSearchChange,
  onOpenAdminDiagnostic
}) => {
  const { user, logout } = useAuth();

  const getProcessName = (id: string) => {
    switch (id) {
      case 'proceso-8': return 'Panel de Control (Supervisión)';
      case 'proceso-1': return 'Administración de Clientes';
      case 'proceso-2': return 'Administración de Aseguradoras';
      case 'proceso-3': return 'Administración de Pólizas';
      case 'proceso-4': return 'Administración de Vehículos';
      case 'proceso-5': return 'Administración de ART';
      case 'proceso-6': return 'Motor de Automatizaciones';
      case 'proceso-7': return 'Circuito de Renovaciones';
      case 'modulo-0': return 'Módulo 0: Manual de Procesos';
      default: return 'AVISAME PAS';
    }
  };

  return (
    <header className="bg-[#005a9e] text-white border-b border-[#007bc1] sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#4ae2fe] to-[#0577b6] flex items-center justify-center text-white shadow-md border border-white/20">
            <Shield className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-extrabold tracking-tight text-white drop-shadow-xs">AVISAME</span>
              <span className="bg-[#00aeef]/20 text-[#4ae2fe] border border-[#00aeef]/40 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                PAS Argentina
              </span>
            </div>
            <p className="text-[11px] text-[#c7c7c7] font-medium hidden sm:block">
              Sistema Inteligente de Supervisión para Seguros
            </p>
          </div>
        </div>

        {/* Current Active Path Indicator */}
        <div className="hidden md:flex items-center space-x-2 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
          <span className="text-xs text-[#c7c7c7] font-medium">Módulo:</span>
          <span className="text-xs text-white font-bold tracking-wide">{getProcessName(activeProcessId)}</span>
        </div>

        {/* Right Section: Search & Actions */}
        <div className="flex items-center space-x-3">
          {/* Quick Search */}
          <div className="relative hidden sm:block w-40 lg:w-56">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#9e9e9e]" />
            <input
              type="text"
              placeholder="Buscar CUIT, Póliza..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white/90 focus:bg-white text-slate-800 text-xs rounded-lg border border-transparent focus:border-[#00aeef] focus:outline-none transition-all placeholder-[#9e9e9e]"
            />
          </div>

          {/* Quick New Item Modal Button */}
          <button
            onClick={onOpenNewRecordModal}
            className="bg-[#00aeef] hover:bg-[#007bc1] text-white text-xs font-semibold px-3 py-2 rounded-lg transition-all flex items-center space-x-1.5 shadow-sm active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">Nuevo Registro</span>
          </button>

          {/* Pending Notifications Button */}
          <button
            onClick={() => onNavigate('proceso-8')}
            className="relative p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors border border-white/10 cursor-pointer"
            title="Ver Tareas y Alertas en Panel de Control"
          >
            <Bell className="w-5 h-5 text-white" />
            {pendingTasksCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#4ae2fe] text-[#005a9e] font-extrabold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#005a9e]">
                {pendingTasksCount}
              </span>
            )}
          </button>

          {/* Admin Diagnostic Button */}
          {onOpenAdminDiagnostic && (
            <button
              onClick={onOpenAdminDiagnostic}
              className="p-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 rounded-lg transition-colors border border-amber-400/30 cursor-pointer flex items-center space-x-1 text-xs font-semibold"
              title="Abrir Panel de Diagnóstico Admin"
            >
              <Activity className="w-4 h-4 text-amber-300" />
              <span className="hidden xl:inline">Diagnóstico</span>
            </button>
          )}

          {/* User Profile & Logout Button */}
          {user && (
            <div className="flex items-center space-x-2 pl-2 border-l border-white/20">
              <div className="flex items-center space-x-2 bg-white/10 px-2.5 py-1 rounded-lg border border-white/10">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'Usuario'}
                    className="w-6 h-6 rounded-full border border-white/30"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-[#00aeef] text-white flex items-center justify-center text-[10px] font-bold">
                    <UserIcon className="w-3.5 h-3.5" />
                  </div>
                )}
                <span className="text-xs font-semibold text-white hidden lg:inline truncate max-w-[120px]">
                  {user.displayName || user.email?.split('@')[0]}
                </span>
              </div>

              <button
                onClick={() => logout()}
                className="p-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-100 rounded-lg transition-colors border border-rose-400/30 flex items-center space-x-1 cursor-pointer text-xs font-semibold"
                title="Cerrar Sesión"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden xl:inline">Salir</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};


