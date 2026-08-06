import React from 'react';
import {
  LayoutDashboard,
  Users,
  Building2,
  FileText,
  Car,
  Briefcase,
  Zap,
  RefreshCw,
  BookOpen,
  ChevronRight,
  ShieldCheck,
  Database,
  Trash2,
  RotateCcw,
  UserCheck,
  Lock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  activeProcessId: string;
  onNavigate: (processId: string) => void;
  pendingAlertsCount: number;
  onClearDatabase: () => void;
  onResetDemoData: () => void;
  isDbCleared: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeProcessId,
  onNavigate,
  pendingAlertsCount,
  onClearDatabase,
  onResetDemoData,
  isDbCleared
}) => {
  const { user } = useAuth();

  const navItems = [
    {
      id: 'proceso-8',
      num: 8,
      title: 'Panel de Control',
      subtitle: 'Supervisión y KPIs',
      icon: LayoutDashboard,
      type: 'transversal',
      badge: pendingAlertsCount > 0 ? `${pendingAlertsCount} Alertas` : undefined
    },
    {
      id: 'proceso-1',
      num: 1,
      title: 'Clientes',
      subtitle: 'Asegurados y Tomadores',
      icon: Users,
      type: 'core'
    },
    {
      id: 'proceso-2',
      num: 2,
      title: 'Aseguradoras',
      subtitle: 'Compañías y Códigos PAS',
      icon: Building2,
      type: 'core'
    },
    {
      id: 'proceso-3',
      num: 3,
      title: 'Pólizas',
      subtitle: 'Contratos y Endosos',
      icon: FileText,
      type: 'core'
    },
    {
      id: 'proceso-4',
      num: 4,
      title: 'Vehículos',
      subtitle: 'Patentes y Obleas GNC',
      icon: Car,
      type: 'core'
    },
    {
      id: 'proceso-5',
      num: 5,
      title: 'ART (Ley 24.557)',
      subtitle: 'Nóminas y Traspasos',
      icon: Briefcase,
      type: 'core'
    },
    {
      id: 'proceso-6',
      num: 6,
      title: 'Automatizaciones',
      subtitle: 'Reglas y Disparadores',
      icon: Zap,
      type: 'transversal'
    },
    {
      id: 'proceso-7',
      num: 7,
      title: 'Renovaciones',
      subtitle: 'Pipeline de Retención',
      icon: RefreshCw,
      type: 'transversal'
    }
  ];

  return (
    <aside className="w-full md:w-72 bg-white rounded-xl border border-[#c7c7c7] shadow-xs flex flex-col justify-between overflow-hidden flex-shrink-0">
      
      <div>
        {/* Active Producer Tenant Badge */}
        {user && (
          <div className="p-3 bg-slate-900 text-white border-b border-slate-800 flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#007bc1] flex items-center justify-center shrink-0">
              <UserCheck className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-1">
                <span className="text-xs font-bold truncate text-white">
                  {user.displayName || 'Productor Asesor'}
                </span>
                <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
              </div>
              <p className="text-[10px] text-slate-400 truncate">
                {user.email}
              </p>
            </div>
          </div>
        )}

        {/* Section Header */}
        <div className="p-3.5 bg-[#005a9e]/5 border-b border-[#c7c7c7] flex items-center justify-between">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#005a9e] flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-[#007bc1]" />
            <span>Procesos Operativos</span>
          </span>
          <span className="text-[10px] bg-[#005a9e] text-white px-2 py-0.5 rounded-full font-mono font-semibold">
            8 Procesos
          </span>
        </div>

        {/* Process Navigation List */}
        <nav className="p-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeProcessId === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full text-left p-2.5 rounded-lg transition-all flex items-center justify-between group cursor-pointer ${
                  isActive
                    ? 'bg-[#005a9e] text-white shadow-sm'
                    : 'text-[#6d6e71] hover:bg-[#007bc1]/10 hover:text-[#005a9e]'
                }`}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div
                    className={`p-1.5 rounded-md flex-shrink-0 transition-colors ${
                      isActive
                        ? 'bg-[#00aeef] text-white'
                        : 'bg-slate-100 text-[#007bc1] group-hover:bg-[#007bc1]/20'
                    }`}
                  >
                    <Icon className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-1.5">
                      <span className={`text-[10px] font-bold font-mono px-1 rounded ${
                        isActive ? 'bg-white/20 text-white' : 'text-[#9e9e9e]'
                      }`}>
                        P{item.num}
                      </span>
                      <h3 className={`text-xs font-bold truncate ${isActive ? 'text-white' : 'text-slate-900'}`}>
                        {item.title}
                      </h3>
                    </div>
                    <p className={`text-[10px] truncate ${isActive ? 'text-[#c7c7c7]' : 'text-[#9e9e9e]'}`}>
                      {item.subtitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-1">
                  {item.badge && (
                    <span className="bg-[#00aeef] text-[#005a9e] font-extrabold text-[10px] px-1.5 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight
                    className={`w-3.5 h-3.5 transition-transform ${
                      isActive ? 'text-white translate-x-0.5' : 'text-[#c7c7c7] group-hover:text-[#005a9e]'
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Controls & Database Clear Action */}
      <div className="p-3 border-t border-[#c7c7c7] bg-slate-50 space-y-2">
        {/* Manual Modulo 0 Button */}
        <button
          onClick={() => onNavigate('modulo-0')}
          className={`w-full p-2.5 rounded-lg border text-left transition-all flex items-center space-x-2.5 cursor-pointer ${
            activeProcessId === 'modulo-0'
              ? 'bg-[#005a9e] border-[#005a9e] text-white'
              : 'bg-white border-[#c7c7c7] text-[#6d6e71] hover:border-[#007bc1] hover:text-[#005a9e]'
          }`}
        >
          <BookOpen className="w-5 h-5 flex-shrink-0 text-[#00aeef]" />
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-bold truncate">Manual Módulo 0</h4>
            <p className="text-[10px] opacity-80 truncate">12 Puntos de Arquitectura</p>
          </div>
        </button>

        {/* Highlighted Database Action Card */}
        <div className={`p-3 rounded-xl border text-xs space-y-2 transition-all ${
          isDbCleared
            ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
            : 'bg-rose-50 border-rose-300 text-rose-900'
        }`}>
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-[11px] flex items-center space-x-1.5">
              <Database className={`w-3.5 h-3.5 ${isDbCleared ? 'text-emerald-600' : 'text-rose-600'}`} />
              <span>{isDbCleared ? 'Base de Datos en Blanco' : 'Cartera Productor'}</span>
            </span>
            <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
              isDbCleared ? 'bg-emerald-200 text-emerald-800' : 'bg-rose-200 text-rose-800'
            }`}>
              {isDbCleared ? 'Nube Limpia' : 'Aislado'}
            </span>
          </div>

          <p className="text-[10px] leading-tight opacity-90">
            {isDbCleared
              ? 'Su cartera está limpia en Firestore y lista para el ingreso de sus pólizas reales.'
              : 'Los registros están vinculados exclusivamente a su UID de Productor en cionar.com.ar.'}
          </p>

          {isDbCleared ? (
            <button
              onClick={onResetDemoData}
              className="w-full bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-[11px] font-bold py-1.5 px-2 rounded-lg transition-all flex items-center justify-center space-x-1.5 shadow-xs cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-emerald-600" />
              <span>Cargar Pólizas Iniciales</span>
            </button>
          ) : (
            <button
              onClick={onClearDatabase}
              className="w-full bg-rose-600 hover:bg-rose-700 active:scale-[0.98] text-white font-bold text-[11px] py-2 px-2 rounded-lg transition-all flex items-center justify-center space-x-1.5 shadow-sm cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Vaciar Mi Cartera</span>
            </button>
          )}
        </div>
      </div>

    </aside>
  );
};


