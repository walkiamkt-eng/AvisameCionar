import React from 'react';
import { ReglaAutomatizacion } from '../types';
import { Zap, Play, Pause, RefreshCw, CheckCircle2, Clock, ShieldAlert, ArrowRight } from 'lucide-react';

interface AutomatizacionesViewProps {
  reglas: ReglaAutomatizacion[];
  onToggleRegla: (id: string) => void;
  onEjecutarMotor: () => void;
}

export const AutomatizacionesView: React.FC<AutomatizacionesViewProps> = ({
  reglas,
  onToggleRegla,
  onEjecutarMotor
}) => {
  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-[#c7c7c7] shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-[#005a9e]" />
            <h2 className="text-lg font-bold text-slate-900">Proceso 6 · Motor de Automatizaciones y Reglas</h2>
          </div>
          <p className="text-xs text-[#6d6e71] mt-0.5">
            Módulo transversal de desacoplamiento. Escanea eventos de P1 a P5 y P7 para disparar tareas y alertas.
          </p>
        </div>

        <button
          onClick={onEjecutarMotor}
          className="bg-[#005a9e] hover:bg-[#007bc1] text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-all shadow-sm flex items-center space-x-2 self-start sm:self-auto"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Ejecutar Reglas Ahora</span>
        </button>
      </div>

      {/* Rules Active Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reglas.map((r) => (
          <div
            key={r.id}
            className="bg-white rounded-xl border border-[#c7c7c7] p-5 shadow-xs space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex justify-between items-start gap-2">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono font-bold bg-[#005a9e]/10 text-[#005a9e] px-2 py-0.5 rounded">
                      Proceso Origen: P{r.procesoOrigen}
                    </span>
                    <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded">
                      Modo: {r.modo}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{r.titulo}</h3>
                </div>

                <button
                  onClick={() => onToggleRegla(r.id)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    r.estado === 'Activa'
                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                  title={r.estado === 'Activa' ? 'Pausar regla' : 'Activar regla'}
                >
                  {r.estado === 'Activa' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
              </div>

              <p className="text-xs text-[#6d6e71] leading-relaxed">{r.descripcion}</p>

              <div className="bg-slate-50 p-3 rounded-lg border border-[#c7c7c7] text-xs space-y-1 font-mono">
                <div className="flex justify-between">
                  <span className="text-[#9e9e9e]">Disparador:</span>
                  <span className="font-bold text-slate-900">{r.disparador}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9e9e9e]">Frecuencia:</span>
                  <span className="text-slate-800">{r.frecuencia}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-[#6d6e71]">
              <span>Ejecuciones Totales: <strong className="font-mono text-[#005a9e]">{r.ejecucionesTotales}</strong></span>
              <span className="text-[10px] text-[#9e9e9e]">Última: {r.ultimaEjecucion}</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
