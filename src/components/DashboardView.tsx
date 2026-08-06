import React from 'react';
import {
  Cliente,
  Poliza,
  Aseguradora,
  Vehiculo,
  ContratoART,
  AlertaTarea,
  RenovacionItem
} from '../types';
import {
  LayoutDashboard,
  AlertTriangle,
  TrendingUp,
  FileText,
  Users,
  Building2,
  Clock,
  ArrowRight,
  CheckCircle2,
  Car,
  Briefcase,
  ShieldCheck,
  Zap
} from 'lucide-react';

interface DashboardViewProps {
  clientes: Cliente[];
  polizas: Poliza[];
  aseguradoras: Aseguradora[];
  vehiculos: Vehiculo[];
  contratosArt: ContratoART[];
  alertasTareas: AlertaTarea[];
  renovaciones: RenovacionItem[];
  onNavigate: (processId: string) => void;
  onCompleteTask: (taskId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  clientes,
  polizas,
  aseguradoras,
  vehiculos,
  contratosArt,
  alertasTareas,
  renovaciones,
  onNavigate,
  onCompleteTask
}) => {
  // Calculations (Panel de Control consumes indicators from underlying processes)
  const polizasVigentes = polizas.filter((p) => p.estado === 'Vigente' || p.estado === 'En Renovación');
  const premioTotalMensual = polizasVigentes.reduce((acc, curr) => acc + curr.premioTotal, 0);
  const clientesActivosCount = clientes.filter((c) => c.estado === 'Activo').length;
  
  const renovacionesPendientes = renovaciones.filter((r) => r.estadoRenovacion === 'Pendiente' || r.estadoRenovacion === 'En Negociación');
  const renovacionesConcretadas = renovaciones.filter((r) => r.estadoRenovacion === 'Concretada').length;
  const tasaRetencion = renovaciones.length > 0
    ? Math.round((renovacionesConcretadas / renovaciones.length) * 100)
    : 100;

  const artElegiblesTraspaso = contratosArt.filter((a) => a.mesesPermanencia >= 12);
  const vehiculosConGncAlerta = vehiculos.filter((v) => v.poseeGnc && v.vencimientoGnc);
  const tareasPendientes = alertasTareas.filter((a) => a.estado === 'Pendiente');

  return (
    <div className="space-y-6">
      
      {/* Welcome & Supervision Header Banner */}
      <div className="bg-gradient-to-r from-[#005a9e] via-[#007bc1] to-[#00aeef] rounded-xl p-6 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="bg-white/20 text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Proceso 8 · Centro de Comando
            </span>
            <span className="text-xs text-[#c7c7c7]">Actualizado en tiempo real</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight">Supervisión Consolidada del PAS</h2>
          <p className="text-xs text-[#c7c7c7] max-w-2xl leading-relaxed">
            Métricas clave, alertas de vencimientos, inconsistencias operativas y estado general de la cartera. Sin datos duplicados.
          </p>
        </div>

        <button
          onClick={() => onNavigate('proceso-7')}
          className="bg-white text-[#005a9e] hover:bg-[#c7c7c7] font-bold text-xs px-4 py-2.5 rounded-lg transition-all shadow-sm flex items-center space-x-2 flex-shrink-0"
        >
          <span>Ir a Renovaciones</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Empty Database Helper Banner */}
      {clientes.length === 0 && polizas.length === 0 && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-5 text-emerald-900 space-y-3 shadow-xs">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
            <h3 className="text-base font-bold">Base de Datos en Blanco · Lista para Carga Real</h3>
          </div>
          <p className="text-xs text-emerald-800 leading-relaxed">
            La base de datos en Firebase Firestore está limpia. Su usuario o evaluador ya puede comenzar a ingresar clientes, aseguradoras, pólizas y vehículos reales. Toda la información introducida se sincroniza de forma inmediata en la nube.
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              onClick={() => onNavigate('proceso-1')}
              className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3.5 py-2 rounded-lg transition-all shadow-xs"
            >
              + Cargar Primer Cliente
            </button>
            <button
              onClick={() => onNavigate('proceso-2')}
              className="bg-white hover:bg-slate-50 text-emerald-800 border border-emerald-300 text-xs font-semibold px-3.5 py-2 rounded-lg transition-all shadow-xs"
            >
              + Registrar Aseguradora
            </button>
          </div>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Premio Total Cartera */}
        <div className="bg-white p-4 rounded-xl border border-[#c7c7c7] shadow-xs space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-[#6d6e71]">
            <span className="text-xs font-bold uppercase tracking-wider">Prima/Premio Mensual</span>
            <div className="p-2 bg-[#005a9e]/10 text-[#005a9e] rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-slate-900 font-mono">
            ${premioTotalMensual.toLocaleString('es-AR')} <span className="text-xs font-normal text-[#9e9e9e]">ARS</span>
          </div>
          <div className="text-[11px] text-[#6d6e71] flex items-center justify-between">
            <span>{polizasVigentes.length} Pólizas Activas</span>
            <button onClick={() => onNavigate('proceso-3')} className="text-[#007bc1] font-bold hover:underline">
              Ver
            </button>
          </div>
        </div>

        {/* KPI 2: Clientes Activos */}
        <div className="bg-white p-4 rounded-xl border border-[#c7c7c7] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#6d6e71]">
            <span className="text-xs font-bold uppercase tracking-wider">Clientes Activos</span>
            <div className="p-2 bg-[#007bc1]/10 text-[#007bc1] rounded-lg">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-slate-900 font-mono">
            {clientesActivosCount} <span className="text-xs font-normal text-[#9e9e9e]">Asegurados</span>
          </div>
          <div className="text-[11px] text-[#6d6e71] flex items-center justify-between">
            <span>100% CUIT Verificados</span>
            <button onClick={() => onNavigate('proceso-1')} className="text-[#007bc1] font-bold hover:underline">
              Ver
            </button>
          </div>
        </div>

        {/* KPI 3: Tasa de Retención Renovaciones */}
        <div className="bg-white p-4 rounded-xl border border-[#c7c7c7] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#6d6e71]">
            <span className="text-xs font-bold uppercase tracking-wider">Retención Cartera</span>
            <div className="p-2 bg-[#00aeef]/10 text-[#005a9e] rounded-lg">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-slate-900 font-mono">
            {tasaRetencion}% <span className="text-xs font-normal text-[#9e9e9e]">Efectividad</span>
          </div>
          <div className="text-[11px] text-[#6d6e71] flex items-center justify-between">
            <span>{renovacionesPendientes.length} En proceso</span>
            <button onClick={() => onNavigate('proceso-7')} className="text-[#007bc1] font-bold hover:underline">
              Ver
            </button>
          </div>
        </div>

        {/* KPI 4: Traspasos ART Ley 24.557 */}
        <div className="bg-white p-4 rounded-xl border border-[#c7c7c7] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-[#6d6e71]">
            <span className="text-xs font-bold uppercase tracking-wider">Oportunidad ART</span>
            <div className="p-2 bg-amber-50 text-amber-700 rounded-lg border border-amber-200">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-slate-900 font-mono">
            {artElegiblesTraspaso.length} <span className="text-xs font-normal text-[#9e9e9e]">Contratos</span>
          </div>
          <div className="text-[11px] text-[#6d6e71] flex items-center justify-between">
            <span>&ge; 12 Meses Permanencia</span>
            <button onClick={() => onNavigate('proceso-5')} className="text-[#007bc1] font-bold hover:underline">
              Ver
            </button>
          </div>
        </div>

      </div>

      {/* Main Grid: Alertas de Agenda & Próximos Vencimientos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Panel 1: Alertas y Tareas Pendientes */}
        <div className="bg-white rounded-xl border border-[#c7c7c7] shadow-xs overflow-hidden flex flex-col">
          <div className="p-4 bg-slate-50 border-b border-[#c7c7c7] flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h3 className="text-sm font-bold text-slate-900">Tareas y Alertas Supervisadas</h3>
            </div>
            <span className="bg-amber-100 text-amber-900 text-xs font-bold px-2.5 py-0.5 rounded-full font-mono">
              {tareasPendientes.length} Pendientes
            </span>
          </div>

          <div className="p-4 space-y-3 flex-1 overflow-y-auto max-h-[380px]">
            {tareasPendientes.length === 0 ? (
              <div className="text-center py-8 text-[#9e9e9e] text-xs">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p>No hay alertas operativas pendientes.</p>
              </div>
            ) : (
              tareasPendientes.map((task) => (
                <div
                  key={task.id}
                  className="p-3 bg-slate-50 border border-[#c7c7c7] rounded-lg space-y-2 hover:border-[#007bc1] transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          task.prioridad === 'Alta' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {task.prioridad}
                        </span>
                        <span className="text-[10px] text-[#9e9e9e]">P{task.procesoOrigen}</span>
                        <span className="text-xs font-bold text-slate-900">{task.titulo}</span>
                      </div>
                      <p className="text-xs text-[#6d6e71] leading-relaxed">{task.descripcion}</p>
                    </div>

                    <button
                      onClick={() => onCompleteTask(task.id)}
                      className="p-1.5 text-[#9e9e9e] hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                      title="Marcar completada"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200">
                    <span className="text-[#9e9e9e] font-mono">Vence: {task.vencimiento}</span>
                    <button
                      onClick={() => onNavigate(task.targetProceso)}
                      className="text-[#005a9e] font-bold hover:underline flex items-center space-x-1"
                    >
                      <span>Resolver en Proceso</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Panel 2: Pipeline de Renovaciones de Pólizas */}
        <div className="bg-white rounded-xl border border-[#c7c7c7] shadow-xs overflow-hidden flex flex-col">
          <div className="p-4 bg-slate-50 border-b border-[#c7c7c7] flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-[#005a9e]" />
              <h3 className="text-sm font-bold text-slate-900">Vencimientos Próximos (Renovaciones)</h3>
            </div>
            <button
              onClick={() => onNavigate('proceso-7')}
              className="text-xs font-bold text-[#007bc1] hover:underline flex items-center space-x-1"
            >
              <span>Ver todas</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="p-4 space-y-3 flex-1 overflow-y-auto max-h-[380px]">
            {renovaciones.length === 0 ? (
              <div className="text-center py-8 text-[#9e9e9e] text-xs">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p>No hay vencimientos ni renovaciones pendientes.</p>
              </div>
            ) : (
              renovaciones.map((ren) => (
                <div
                  key={ren.id}
                  className="p-3 bg-white border border-[#c7c7c7] rounded-lg space-y-2 hover:border-[#005a9e] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{ren.clienteNombre}</span>
                    <span className="text-[10px] font-bold bg-[#005a9e]/10 text-[#005a9e] px-2 py-0.5 rounded">
                      Vence en {ren.diasParaVencer} días
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-[#6d6e71]">
                    <div>
                      <span className="text-[#9e9e9e] text-[10px] block">Ramo / Compañía</span>
                      <span className="font-semibold text-slate-800">{ren.ramo} · {ren.aseguradoraNombre}</span>
                    </div>
                    <div>
                      <span className="text-[#9e9e9e] text-[10px] block">Propuesta Ajustada</span>
                      <span className="font-mono font-bold text-[#005a9e]">
                        ${ren.premioNuevaPropuesta.toLocaleString('es-AR')} ARS
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-100">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      ren.estadoRenovacion === 'En Negociación' ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-700'
                    }`}>
                      Estado: {ren.estadoRenovacion}
                    </span>

                    <button
                      onClick={() => onNavigate('proceso-7')}
                      className="text-[#007bc1] font-bold hover:underline flex items-center space-x-1"
                    >
                      <span>Procesar Renovación</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Distribution by Aseguradora Widget */}
      <div className="bg-white rounded-xl border border-[#c7c7c7] p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-[#005a9e]" />
            <h3 className="text-sm font-bold text-slate-900">Distribución de Cartera por Compañía Aseguradora</h3>
          </div>
          <button onClick={() => onNavigate('proceso-2')} className="text-xs text-[#007bc1] font-bold hover:underline">
            Gestionar Aseguradoras
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {aseguradoras.map((aseg) => {
            const countPolizas = polizas.filter((p) => p.aseguradoraId === aseg.id).length;
            return (
              <div
                key={aseg.id}
                className="p-3 bg-slate-50 border border-[#c7c7c7] rounded-lg text-center space-y-1 hover:border-[#005a9e] transition-colors"
              >
                <h4 className="text-xs font-bold text-slate-900 truncate">{aseg.nombre}</h4>
                <p className="text-[10px] text-[#6d6e71]">Código: {aseg.codigoProductor}</p>
                <div className="text-sm font-extrabold text-[#005a9e] font-mono">
                  {countPolizas} Pólizas
                </div>
                <span className="inline-block text-[9px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  {aseg.estadoSsn}
                </span>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
