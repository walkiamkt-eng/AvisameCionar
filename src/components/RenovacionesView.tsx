import React, { useState, useEffect } from 'react';
import {
  RenovacionItem,
  Poliza,
  Cliente,
  Aseguradora,
  EstadoRenovacion,
  getRenovacionesUnificadas,
  getRenovacionesPendientes,
  isEstadoGestionCerrado
} from '../types';
import { RefreshCw, Calculator, CheckCircle2, XCircle, Clock, ArrowRight, ShieldCheck, TrendingUp, AlertTriangle } from 'lucide-react';

interface RenovacionesViewProps {
  renovaciones: RenovacionItem[];
  polizas?: Poliza[];
  clientes?: Cliente[];
  aseguradoras?: Aseguradora[];
  onUpdateEstadoRenovacion: (id: string, nuevoEstado: EstadoRenovacion) => void;
}

export const RenovacionesView: React.FC<RenovacionesViewProps> = ({
  renovaciones,
  polizas = [],
  clientes = [],
  aseguradoras = [],
  onUpdateEstadoRenovacion
}) => {
  const [activeTab, setActiveTab] = useState<'pendientes' | 'todas'>('pendientes');

  // Fuente de verdad unificada
  const renovacionesUnificadas = getRenovacionesUnificadas(polizas, renovaciones, clientes, aseguradoras);
  const renovacionesPendientes = getRenovacionesPendientes(polizas, renovaciones, clientes, aseguradoras);

  const listaAMostrar = activeTab === 'pendientes' ? renovacionesPendientes : renovacionesUnificadas;

  const [selectedRenovacion, setSelectedRenovacion] = useState<RenovacionItem | null>(listaAMostrar[0] || null);
  const [factorInflacion, setFactorInflacion] = useState<number>(30);

  useEffect(() => {
    if (!selectedRenovacion && listaAMostrar.length > 0) {
      setSelectedRenovacion(listaAMostrar[0]);
    } else if (selectedRenovacion && !listaAMostrar.some((r) => r.id === selectedRenovacion.id)) {
      setSelectedRenovacion(listaAMostrar[0] || null);
    }
  }, [listaAMostrar, selectedRenovacion]);

  const handleApplyInflationCalculator = () => {
    if (!selectedRenovacion) return;
    const factor = 1 + factorInflacion / 100;
    selectedRenovacion.sumaSugeridaInflacion = Math.round(selectedRenovacion.sumaAseguradaActual * factor);
    selectedRenovacion.premioNuevaPropuesta = Math.round(selectedRenovacion.premioActual * factor);
    alert(`Cálculo de Infraseguro aplicado (+${factorInflacion}%). Nueva Suma Sugerida: $${selectedRenovacion.sumaSugeridaInflacion.toLocaleString('es-AR')} ARS`);
  };

  const handleMarcarPerdidaNoRenueva = (ren: RenovacionItem) => {
    const confirmacion = window.confirm(
      `¿Confirma marcar esta renovación como "Póliza perdida / Cliente no renueva"?\n\n` +
      `Cliente: ${ren.clienteNombre}\n` +
      `Póliza/Ramo: ${ren.ramo} (${ren.aseguradoraNombre})\n\n` +
      `Esta acción registrará el cierre en el historial. La póliza y el cliente NO serán eliminados ni modificados.`
    );
    if (confirmacion) {
      onUpdateEstadoRenovacion(ren.id, 'perdida_no_renueva');
    }
  };

  const renderBadgeEstado = (estado: EstadoRenovacion) => {
    switch (estado) {
      case 'concretada':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">Concretada</span>;
      case 'en_negociacion':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">En Negociación</span>;
      case 'perdida_no_renueva':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-800">Perdida / No Renueva</span>;
      case 'pendiente':
      default:
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">Pendiente</span>;
    }
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

        {/* Tab Filters */}
        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button
            onClick={() => setActiveTab('pendientes')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
              activeTab === 'pendientes'
                ? 'bg-white text-[#005a9e] shadow-xs'
                : 'text-[#6d6e71] hover:text-slate-900'
            }`}
          >
            Pendientes ({renovacionesPendientes.length})
          </button>
          <button
            onClick={() => setActiveTab('todas')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
              activeTab === 'todas'
                ? 'bg-white text-[#005a9e] shadow-xs'
                : 'text-[#6d6e71] hover:text-slate-900'
            }`}
          >
            Todas / Histórico ({renovacionesUnificadas.length})
          </button>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Pipeline List */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-[#c7c7c7] shadow-xs p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">
              {activeTab === 'pendientes' ? 'Pipeline de Renovaciones Pendientes' : 'Historial Unificado de Renovaciones'} ({listaAMostrar.length})
            </h3>
            <span className="text-xs text-[#9e9e9e]">Vencimientos Próximos</span>
          </div>

          <div className="space-y-3">
            {listaAMostrar.length === 0 ? (
              <div className="text-center py-10 text-[#9e9e9e] text-xs space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                <p>No hay renovaciones registradas en este estado.</p>
              </div>
            ) : (
              listaAMostrar.map((ren) => {
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
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          ren.diasParaVencer <= 7 ? 'bg-red-600 text-white' : 'bg-[#005a9e] text-white'
                        }`}>
                          {ren.diasParaVencer < 0
                            ? `Venció hace ${Math.abs(ren.diasParaVencer)} días`
                            : ren.diasParaVencer === 0
                            ? 'Vence hoy'
                            : `Vence en ${ren.diasParaVencer} días`}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 mt-1">{ren.clienteNombre}</h4>
                        <p className="text-xs text-[#6d6e71]">CUIT: {ren.clienteCuit} · {ren.ramo} ({ren.aseguradoraNombre})</p>
                      </div>

                      {renderBadgeEstado(ren.estadoRenovacion)}
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
                    {!isEstadoGestionCerrado(ren.estadoRenovacion) && (
                      <div className="pt-2 flex flex-wrap items-center justify-end gap-2 text-xs">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onUpdateEstadoRenovacion(ren.id, 'en_negociacion');
                          }}
                          className="px-2.5 py-1 bg-amber-100 text-amber-900 font-bold rounded hover:bg-amber-200 transition-colors cursor-pointer"
                        >
                          En Negociación
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onUpdateEstadoRenovacion(ren.id, 'concretada');
                          }}
                          className="px-2.5 py-1 bg-emerald-600 text-white font-bold rounded hover:bg-emerald-700 transition-colors cursor-pointer"
                        >
                          Concretar Renovación
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarcarPerdidaNoRenueva(ren);
                          }}
                          className="px-2.5 py-1 bg-red-100 text-red-800 font-bold rounded hover:bg-red-200 transition-colors cursor-pointer"
                        >
                          Póliza perdida / Cliente no renueva
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
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
                    className="bg-[#005a9e] text-white px-3 py-2 rounded-lg font-bold flex-shrink-0 cursor-pointer"
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
