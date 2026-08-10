import React, { useState, useEffect } from 'react';
import { RenovacionItem, Poliza } from '../types';
import { RefreshCw, Calculator, CheckCircle2, XCircle, Clock, ArrowRight, ShieldCheck, TrendingUp } from 'lucide-react';

interface RenovacionesViewProps {
  renovaciones: RenovacionItem[];
  polizas?: Poliza[];
  onUpdateEstadoRenovacion: (id: string, nuevoEstado: RenovacionItem['estadoRenovacion']) => void;
}

export const RenovacionesView: React.FC<RenovacionesViewProps> = ({
  renovaciones,
  polizas = [],
  onUpdateEstadoRenovacion
}) => {
  // Filtrar de renovaciones cualquier póliza que haya sido Anulada (MOD-001)
  const renovacionesActivas = renovaciones.filter((r) => {
    const polizaAsociada = polizas.find((p) => p.id === r.polizaId);
    if (polizaAsociada && polizaAsociada.estado === 'Anulada') {
      return false; // Las pólizas anuladas no deben aparecer para renovar
    }
    return true;
  });

  const [selectedRenovacion, setSelectedRenovacion] = useState<RenovacionItem | null>(renovacionesActivas[0] || null);
  const [factorInflacion, setFactorInflacion] = useState<number>(30); // 30% sugerido

  // Garantizar que nunca quede seleccionada una renovación cuyo estado de póliza esté en "Anulada"
  useEffect(() => {
    if (!selectedRenovacion && renovacionesActivas.length > 0) {
      setSelectedRenovacion(renovacionesActivas[0]);
    } else if (selectedRenovacion && !renovacionesActivas.some((r) => r.id === selectedRenovacion.id)) {
      setSelectedRenovacion(renovacionesActivas[0] || null);
    }
  }, [renovacionesActivas, selectedRenovacion]);

  const handleApplyInflationCalculator = () => {
    if (!selectedRenovacion) return;
    const factor = 1 + factorInflacion / 100;
    selectedRenovacion.sumaSugeridaInflacion = Math.round(selectedRenovacion.sumaAseguradaActual * factor);
    selectedRenovacion.premioNuevaPropuesta = Math.round(selectedRenovacion.premioActual * factor);
    alert(`Cálculo de Infraseguro aplicado (+${factorInflacion}%). Nueva Suma Sugerida: $${selectedRenovacion.sumaSugeridaInflacion.toLocaleString('es-AR')} ARS`);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-[#c7c7c7] shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <RefreshCw className="w-5 h-5 text-[#005a9e]" />
            <h2 className="text-lg font-bold text-slate-900">Proceso 7 · Circuito de Renovaciones y Retención</h2>
          </div>
          <p className="text-xs text-[#6d6e71] mt-0.5">
            Gestión comercial de vencimientos, negociación de primas y prevención de infraseguro por inflación.
          </p>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Pipeline List */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-[#c7c7c7] shadow-xs p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Pipeline de Renovaciones Pendientes ({renovacionesActivas.length})</h3>
            <span className="text-xs text-[#9e9e9e]">Vencimientos Próximos</span>
          </div>

          <div className="space-y-3">
            {renovacionesActivas.map((ren) => {
              const isSelected = selectedRenovacion?.id === ren.id;

              return (
                <div
                  key={ren.id}
                  onClick={() => setSelectedRenovacion(ren)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-[#005a9e]/5 border-[#005a9e] ring-1 ring-[#005a9e]'
                      : 'bg-white border-[#c7c7c7] hover:border-[#007bc1]'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold bg-[#005a9e] text-white px-2 py-0.5 rounded">
                        Vence en {ren.diasParaVencer} días
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 mt-1">{ren.clienteNombre}</h4>
                      <p className="text-xs text-[#6d6e71]">CUIT: {ren.clienteCuit} · {ren.ramo} ({ren.aseguradoraNombre})</p>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      ren.estadoRenovacion === 'Concretada'
                        ? 'bg-emerald-100 text-emerald-800'
                        : ren.estadoRenovacion === 'En Negociación'
                        ? 'bg-amber-100 text-amber-900'
                        : ren.estadoRenovacion === 'Rechazada'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {ren.estadoRenovacion}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <div>
                      <span className="text-[#9e9e9e] text-[10px] block">Premio Actual</span>
                      <span className="font-mono text-slate-800">${ren.premioActual.toLocaleString('es-AR')} ARS</span>
                    </div>
                    <div>
                      <span className="text-[#9e9e9e] text-[10px] block">Propuesta Renovación</span>
                      <span className="font-mono font-bold text-[#005a9e]">${ren.premioNuevaPropuesta.toLocaleString('es-AR')} ARS</span>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-2 flex items-center justify-end space-x-2 text-xs">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpdateEstadoRenovacion(ren.id, 'En Negociación');
                      }}
                      className="px-2.5 py-1 bg-amber-100 text-amber-900 font-bold rounded hover:bg-amber-200"
                    >
                      En Negociación
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpdateEstadoRenovacion(ren.id, 'Concretada');
                      }}
                      className="px-2.5 py-1 bg-emerald-600 text-white font-bold rounded hover:bg-emerald-700"
                    >
                      Concretar Renovación
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Anti-Infraseguro Calculator */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-[#c7c7c7] shadow-xs p-5 space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <Calculator className="w-5 h-5 text-[#005a9e]" />
            <h3 className="text-sm font-bold text-slate-900">Ajuste por Infraseguro e Inflación</h3>
          </div>

          {selectedRenovacion ? (
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 border border-[#c7c7c7] rounded-lg space-y-1">
                <span className="text-[10px] text-[#9e9e9e] uppercase font-bold">Cliente Seleccionado</span>
                <p className="font-bold text-slate-900 text-sm">{selectedRenovacion.clienteNombre}</p>
                <p className="text-[#6d6e71]">{selectedRenovacion.ramo} - {selectedRenovacion.aseguradoraNombre}</p>
              </div>

              <div className="space-y-2">
                <label className="font-bold text-slate-700 block">Porcentaje de Ajuste Inflacionario (%)</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    value={factorInflacion}
                    onChange={(e) => setFactorInflacion(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg font-mono font-bold text-slate-900"
                  />
                  <button
                    onClick={handleApplyInflationCalculator}
                    className="bg-[#005a9e] text-white px-3 py-2 rounded-lg font-bold flex-shrink-0"
                  >
                    Recalcular
                  </button>
                </div>
              </div>

              <div className="p-4 bg-blue-50/50 border border-[#005a9e]/30 rounded-xl space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#6d6e71]">Suma Asegurada Actual:</span>
                  <span className="font-mono text-slate-800">${selectedRenovacion.sumaAseguradaActual.toLocaleString('es-AR')}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#005a9e] border-t border-[#005a9e]/20 pt-2">
                  <span>Suma Asegurada Sugerida:</span>
                  <span className="font-mono">${selectedRenovacion.sumaSugeridaInflacion.toLocaleString('es-AR')}</span>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-950 text-[11px] space-y-1">
                <p className="font-bold">✓ Análisis de Siniestralidad Histórica: {selectedRenovacion.siniestralidad}</p>
                <p className="text-emerald-800 leading-relaxed">
                  Apto para bonificación por no siniestralidad. Se recomienda presentar la cotización con el valor de la suma asegurada actualizada para evitar pérdida de cobertura por regla de proporcionalidad.
                </p>
              </div>
            </div>
          ) : (
            <p className="text-xs text-[#9e9e9e] text-center py-10">Seleccione un elemento del pipeline para ajustar.</p>
          )}
        </div>

      </div>

    </div>
  );
};
