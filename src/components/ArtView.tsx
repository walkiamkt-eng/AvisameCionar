import React, { useState } from 'react';
import { ContratoART, Cliente, Aseguradora } from '../types';
import {
  Briefcase,
  Plus,
  ShieldCheck,
  Download,
  AlertCircle,
  Clock,
  FileCheck,
  CheckCircle2,
  RotateCcw,
  Calendar,
  Building2,
  Info
} from 'lucide-react';

interface ArtViewProps {
  contratosArt: ContratoART[];
  clientes: Cliente[];
  aseguradoras: Aseguradora[];
  onAddContratoArt: (nuevo: Omit<ContratoART, 'id' | 'mesesPermanencia' | 'esElegibleTraspaso'>) => void;
  onUpdateContratoArt: (contrato: ContratoART) => void;
}

export const ArtView: React.FC<ArtViewProps> = ({
  contratosArt,
  clientes,
  aseguradoras,
  onAddContratoArt,
  onUpdateContratoArt
}) => {
  const [showModal, setShowModal] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState<ContratoART | null>(null);
  const [showRenewalModal, setShowRenewalModal] = useState<ContratoART | null>(null);

  // Form State for Alta de Contrato ART
  const [empresaClienteId, setEmpresaClienteId] = useState(clientes[0]?.id || '');
  const [artAseguradoraId, setArtAseguradoraId] = useState(aseguradoras[0]?.id || '');
  const [numContrato, setNumContrato] = useState('');
  const [ciiu, setCiiu] = useState('602300');
  const [actividad, setActividad] = useState('Servicios de Transporte Automotor de Cargas Generales');
  const [masaSalarial, setMasaSalarial] = useState<number>(35000000);
  const [trabajadores, setTrabajadores] = useState<number>(25);
  const [alicuotaFija, setAlicuotaFija] = useState<number>(850);
  const [alicuotaVar, setAlicuotaVar] = useState<number>(3.0);
  const [fechaInicio, setFechaInicio] = useState('2026-01-01');
  const [fechaFin, setFechaFin] = useState('2027-01-01');

  // Form State for Renovación de Contrato ART (only dates)
  const [renovacionFechaInicio, setRenovacionFechaInicio] = useState('');
  const [renovacionFechaFin, setRenovacionFechaFin] = useState('');
  const [renewalError, setRenewalError] = useState<string | null>(null);

  // Beneficiary input for Non-Repetition clause
  const [cuitBeneficiario, setCuitBeneficiario] = useState('');

  const getCliente = (id: string) => clientes.find((c) => c.id === id);
  const getAseguradora = (id: string) => aseguradoras.find((a) => a.id === id);

  const handleOpenAlta = () => {
    setEmpresaClienteId(clientes[0]?.id || '');
    setArtAseguradoraId(aseguradoras[0]?.id || '');
    setNumContrato('');
    setCiiu('602300');
    setActividad('Servicios de Transporte Automotor de Cargas Generales');
    setMasaSalarial(35000000);
    setTrabajadores(25);
    setAlicuotaFija(850);
    setAlicuotaVar(3.0);
    setFechaInicio('2026-01-01');
    setFechaFin('2027-01-01');
    setShowModal(true);
  };

  const handleAltaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!numContrato.trim()) return;

    onAddContratoArt({
      numeroContrato: numContrato.trim(),
      clienteId: empresaClienteId,
      aseguradoraId: artAseguradoraId,
      ciiuActividad: ciiu.trim(),
      descripcionActividad: actividad.trim(),
      masaSalarialEstimada: Number(masaSalarial),
      cantidadTrabajadores: Number(trabajadores),
      alicuotaFija: Number(alicuotaFija),
      alicuotaVariable: Number(alicuotaVar),
      fechaInicioContrato: fechaInicio,
      fechaFinContrato: fechaFin,
      clausulasNoRepeticion: []
    });

    setNumContrato('');
    setShowModal(false);
  };

  const handleOpenRenovar = (art: ContratoART) => {
    setShowRenewalModal(art);
    setRenovacionFechaInicio(art.fechaFinContrato || art.fechaInicioContrato);
    setRenovacionFechaFin('');
    setRenewalError(null);
  };

  const handleRenewalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRenewalError(null);

    // Validaciones:
    // - debe existir contrato seleccionado;
    // - debe existir fecha de inicio de nueva vigencia;
    // - debe existir fecha de fin;
    // - fecha fin debe ser posterior a fecha inicio;
    // - si falla una validación, no guardar.
    if (!showRenewalModal) {
      setRenewalError('No se ha seleccionado ningún contrato para renovar.');
      return;
    }
    if (!renovacionFechaInicio) {
      setRenewalError('Debe ingresar la fecha de inicio de la nueva vigencia.');
      return;
    }
    if (!renovacionFechaFin) {
      setRenewalError('Debe ingresar la fecha de fin de la nueva vigencia.');
      return;
    }
    if (renovacionFechaFin <= renovacionFechaInicio) {
      setRenewalError('La fecha de fin debe ser posterior a la fecha de inicio.');
      return;
    }

    // fechaInicioContrato es siempre la fecha ORIGINAL del contrato y nunca debe reiniciarse con una renovación.
    const fechaIniOriginal = new Date(showRenewalModal.fechaInicioContrato);
    const now = new Date();
    const meses = Math.floor((now.getTime() - fechaIniOriginal.getTime()) / (1000 * 3600 * 24 * 30.44));
    const esElegible = meses >= 12;

    const contratoActualizado: ContratoART = {
      ...showRenewalModal,
      fechaInicioContrato: showRenewalModal.fechaInicioContrato, // Conserva original
      fechaFinContrato: renovacionFechaFin,
      fechaUltimaRenovacion: new Date().toISOString(),
      mesesPermanencia: meses > 0 ? meses : 0,
      esElegibleTraspaso: esElegible
    };

    onUpdateContratoArt(contratoActualizado);
    setShowRenewalModal(null);
  };

  const handleAddClausula = (contratoId: string) => {
    if (!cuitBeneficiario.trim()) return;
    const contrato = contratosArt.find((c) => c.id === contratoId);
    if (contrato) {
      const updatedClausulas = [...contrato.clausulasNoRepeticion, cuitBeneficiario.trim()];
      const updatedContrato: ContratoART = {
        ...contrato,
        clausulasNoRepeticion: updatedClausulas
      };
      onUpdateContratoArt(updatedContrato);
      setCuitBeneficiario('');
      if (showCertificateModal && showCertificateModal.id === contratoId) {
        setShowCertificateModal(updatedContrato);
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-[#c7c7c7] shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <Briefcase className="w-5 h-5 text-[#005a9e]" />
            <h2 className="text-lg font-bold text-slate-900">Proceso 5 · Administración de ART (Ley 24.557)</h2>
          </div>
          <p className="text-xs text-[#6d6e71] mt-0.5">
            Supervisión de Contratos de Riesgos del Trabajo, Renovación de Vigencias, Traspasos de 12 Meses y Cláusulas de No Repetición.
          </p>
        </div>

        <button
          onClick={handleOpenAlta}
          className="bg-[#005a9e] hover:bg-[#007bc1] text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-all shadow-sm flex items-center space-x-2 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Nuevo Contrato ART</span>
        </button>
      </div>

      {/* Contracts List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {contratosArt.map((art) => {
          const cliente = getCliente(art.clienteId);
          const aseguradora = getAseguradora(art.aseguradoraId);

          return (
            <div key={art.id} className="bg-white rounded-xl border border-[#c7c7c7] p-5 shadow-xs space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                
                {/* Title & Status */}
                <div className="flex justify-between items-start gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-[#007bc1] bg-[#005a9e]/10 px-2 py-0.5 rounded">
                      Contrato N° {art.numeroContrato}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1">{cliente?.nombreRazonSocial || 'Empleador'}</h3>
                    <p className="text-xs text-[#6d6e71]">CUIT: {cliente?.cuitCuilDni || '(Sin CUIT)'}</p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-[#9e9e9e] uppercase font-bold block">Aseguradora ART</span>
                    <span className="text-xs font-bold text-[#005a9e]">{aseguradora?.nombre || 'Aseguradora'}</span>
                  </div>
                </div>

                {/* Vigencia Completa */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs bg-blue-50/60 p-2.5 rounded-lg border border-blue-100 text-slate-800 gap-1.5">
                  <div className="flex items-center space-x-1.5">
                    <Calendar className="w-4 h-4 text-[#005a9e]" />
                    <span className="font-bold text-slate-700">Vigencia:</span>
                    <span className="font-mono font-semibold text-[#005a9e]">
                      {art.fechaInicioContrato} al {art.fechaFinContrato || 'S/D'}
                    </span>
                  </div>
                  {art.fechaUltimaRenovacion && (
                    <span className="text-[10px] text-slate-500 font-mono">
                      Última renovación: {new Date(art.fechaUltimaRenovacion).toLocaleDateString('es-AR')}
                    </span>
                  )}
                </div>

                {/* Economic & Workers Details */}
                <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-lg border border-[#c7c7c7]">
                  <div>
                    <span className="text-[#9e9e9e] block text-[10px]">CIIU / Actividad</span>
                    <span className="font-semibold text-slate-800">{art.ciiuActividad} - {art.descripcionActividad}</span>
                  </div>
                  <div>
                    <span className="text-[#9e9e9e] block text-[10px]">Nómina de Personal</span>
                    <span className="font-bold text-slate-900 font-mono">{art.cantidadTrabajadores} Empleados</span>
                  </div>
                  <div>
                    <span className="text-[#9e9e9e] block text-[10px]">Masa Salarial Estimada</span>
                    <span className="font-bold font-mono text-[#005a9e]">${art.masaSalarialEstimada.toLocaleString('es-AR')} ARS</span>
                  </div>
                  <div>
                    <span className="text-[#9e9e9e] block text-[10px]">Alícuota Aplicada</span>
                    <span className="font-mono font-bold text-slate-800">${art.alicuotaFija} Fija + {art.alicuotaVariable}%</span>
                  </div>
                </div>

                {/* Ley 24.557 Transfer Eligibility Monitor */}
                <div className={`p-3 rounded-lg border text-xs flex items-center justify-between ${
                  art.esElegibleTraspaso
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-[#005a9e]" />
                    <div>
                      <span className="font-bold block text-xs">Permanencia en ART Actual</span>
                      <span className="text-[11px] opacity-80">{art.mesesPermanencia} Meses Cumplidos (Desde {art.fechaInicioContrato})</span>
                    </div>
                  </div>

                  {art.esElegibleTraspaso ? (
                    <span className="text-[10px] bg-emerald-600 text-white font-extrabold px-2 py-1 rounded shadow-xs uppercase">
                      Elegible Traspaso (Ley 24.557)
                    </span>
                  ) : (
                    <span className="text-[10px] bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded">
                      Req. 12 Meses
                    </span>
                  )}
                </div>

                {/* Clause list */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-[#9e9e9e] uppercase block">
                    Cláusulas de No Repetición Emitidas ({art.clausulasNoRepeticion?.length || 0})
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {art.clausulasNoRepeticion && art.clausulasNoRepeticion.length > 0 ? (
                      art.clausulasNoRepeticion.map((benef, idx) => (
                        <span key={idx} className="text-[10px] bg-white border border-[#c7c7c7] text-[#6d6e71] px-2 py-0.5 rounded">
                          {benef}
                        </span>
                      ))
                    ) : (
                      <span className="text-[10px] text-slate-400 italic">Sin cláusulas emitidas</span>
                    )}
                  </div>
                </div>

              </div>

              {/* Actions: Renovar Contrato & Emit Certificate */}
              <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={() => handleOpenRenovar(art)}
                  className="bg-slate-100 hover:bg-[#005a9e] hover:text-white text-[#005a9e] text-xs font-bold py-2 px-3 rounded-lg transition-all flex items-center justify-center space-x-1.5 border border-[#c7c7c7] cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Renovar contrato</span>
                </button>

                <button
                  onClick={() => setShowCertificateModal(art)}
                  className="bg-slate-100 hover:bg-[#005a9e] hover:text-white text-[#005a9e] text-xs font-bold py-2 px-3 rounded-lg transition-all flex items-center justify-center space-x-1.5 border border-[#c7c7c7] cursor-pointer"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>Certificado Cobertura</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* ============================================================= */}
      {/* MODAL: RENOVAR CONTRATO ART */}
      {/* ============================================================= */}
      {showRenewalModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#c7c7c7] shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <div className="flex items-center space-x-2">
                <RotateCcw className="w-5 h-5 text-[#005a9e]" />
                <h3 className="text-base font-bold text-slate-900">
                  Renovación de Contrato ART
                </h3>
              </div>
              <button
                onClick={() => setShowRenewalModal(null)}
                className="text-[#9e9e9e] hover:text-slate-900 font-bold text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Informative Header Banner */}
            <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg flex items-start space-x-2 text-xs text-slate-700">
              <Info className="w-4 h-4 text-[#005a9e] flex-shrink-0 mt-0.5" />
              <p>
                La renovación actualiza las fechas de vigencia del contrato manteniendo el mismo número y conservando como referencia los datos registrados al momento del alta.
              </p>
            </div>

            {/* Read-only Reference Information */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                Datos de Referencia del Contrato (No Modificables)
              </span>
              <div className="p-3 bg-slate-50 border border-[#c7c7c7] rounded-lg text-xs space-y-2.5">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[#9e9e9e] block text-[10px] uppercase font-bold">Empleador / Cliente</span>
                    <span className="font-bold text-slate-900 block">
                      {getCliente(showRenewalModal.clienteId)?.nombreRazonSocial || 'Empleador'}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      CUIT: {getCliente(showRenewalModal.clienteId)?.cuitCuilDni}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#9e9e9e] block text-[10px] uppercase font-bold">Aseguradora ART</span>
                    <span className="font-bold text-[#005a9e] block">
                      {getAseguradora(showRenewalModal.aseguradoraId)?.nombre || 'Aseguradora'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 border-t border-slate-200 pt-2">
                  <div>
                    <span className="text-[#9e9e9e] block text-[10px] uppercase font-bold">Número de Contrato</span>
                    <span className="font-mono font-bold text-slate-800">
                      {showRenewalModal.numeroContrato}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#9e9e9e] block text-[10px] uppercase font-bold">CIIU / Actividad</span>
                    <span className="text-slate-800">
                      {showRenewalModal.ciiuActividad} - {showRenewalModal.descripcionActividad}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 border-t border-slate-200 pt-2">
                  <div>
                    <span className="text-[#9e9e9e] block text-[10px] uppercase font-bold">Nómina</span>
                    <span className="font-mono font-bold text-slate-800">
                      {showRenewalModal.cantidadTrabajadores} Empleados
                    </span>
                  </div>
                  <div>
                    <span className="text-[#9e9e9e] block text-[10px] uppercase font-bold">Masa Salarial</span>
                    <span className="font-mono font-bold text-[#005a9e]">
                      ${showRenewalModal.masaSalarialEstimada.toLocaleString('es-AR')}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#9e9e9e] block text-[10px] uppercase font-bold">Alícuotas</span>
                    <span className="font-mono font-bold text-slate-800">
                      ${showRenewalModal.alicuotaFija} + {showRenewalModal.alicuotaVariable}%
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 border-t border-slate-200 pt-2">
                  <div>
                    <span className="text-[#9e9e9e] block text-[10px] uppercase font-bold">Fecha Inicio Original (Antigüedad)</span>
                    <span className="font-mono font-semibold text-slate-800">
                      {showRenewalModal.fechaInicioContrato}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#9e9e9e] block text-[10px] uppercase font-bold">Última Renovación</span>
                    <span className="font-mono font-semibold text-slate-800">
                      {showRenewalModal.fechaUltimaRenovacion
                        ? new Date(showRenewalModal.fechaUltimaRenovacion).toLocaleString('es-AR')
                        : 'Sin renovaciones previas'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Renewal Form: ONLY editable fields are new start and end dates */}
            <form onSubmit={handleRenewalSubmit} className="space-y-4 text-xs pt-1">
              {renewalError && (
                <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 font-semibold rounded-lg flex items-center space-x-1.5 text-xs">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <span>{renewalError}</span>
                </div>
              )}

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-900 uppercase tracking-wider block">
                  Nueva Vigencia del Contrato
                </span>
                <p className="text-[11px] text-[#6d6e71]">
                  Ingrese el nuevo período de vigencia acordado para este contrato.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-blue-50/40 p-3 rounded-lg border border-blue-200">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Nueva Fecha de Inicio <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={renovacionFechaInicio}
                    onChange={(e) => setRenovacionFechaInicio(e.target.value)}
                    className="w-full p-2 bg-white border border-[#005a9e] rounded-lg font-mono text-xs focus:ring-2 focus:ring-[#005a9e]"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Nueva Fecha de Fin <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={renovacionFechaFin}
                    onChange={(e) => setRenovacionFechaFin(e.target.value)}
                    className="w-full p-2 bg-white border border-[#005a9e] rounded-lg font-mono text-xs focus:ring-2 focus:ring-[#005a9e]"
                    required
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowRenewalModal(null)}
                  className="px-4 py-2 border border-[#c7c7c7] text-[#6d6e71] rounded-lg hover:bg-slate-50 cursor-pointer font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#005a9e] hover:bg-[#007bc1] text-white font-bold rounded-lg shadow-sm transition-all flex items-center space-x-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Confirmar Renovación</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* MODAL CERTIFICADO DE COBERTURA */}
      {/* ============================================================= */}
      {showCertificateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#c7c7c7] shadow-xl max-w-lg w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-[#005a9e]" />
                <h3 className="text-base font-bold text-slate-900">Emisión de Certificado de Cobertura</h3>
              </div>
              <button
                onClick={() => setShowCertificateModal(null)}
                className="text-[#9e9e9e] hover:text-slate-900 font-bold text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-slate-50 border border-[#c7c7c7] rounded-lg text-xs space-y-2 font-serif leading-relaxed text-slate-800">
              <p className="font-sans font-bold text-[#005a9e] text-center uppercase tracking-wide border-b border-slate-200 pb-2">
                Certificado de Cobertura ART con Cláusula de No Repetición
              </p>
              <p>
                Por la presente se certifica que la empresa <strong className="font-sans">{getCliente(showCertificateModal.clienteId)?.nombreRazonSocial}</strong> (CUIT: {getCliente(showCertificateModal.clienteId)?.cuitCuilDni}) posee contrato de cobertura por Riesgos del Trabajo N° <strong className="font-mono">{showCertificateModal.numeroContrato}</strong> emitido por la aseguradora <strong className="font-sans">{getAseguradora(showCertificateModal.aseguradoraId)?.nombre}</strong> con vigencia desde el <strong className="font-mono">{showCertificateModal.fechaInicioContrato}</strong> hasta el <strong className="font-mono">{showCertificateModal.fechaFinContrato || 'S/D'}</strong>.
              </p>
              <p>
                Se incluye expresamente la <strong>Cláusula de No Repetición</strong> a favor de los siguientes terceros contratantes beneficiarios:
              </p>

              <div className="p-2 bg-white border border-slate-200 rounded font-sans text-[11px] font-mono space-y-1">
                {showCertificateModal.clausulasNoRepeticion && showCertificateModal.clausulasNoRepeticion.length > 0 ? (
                  showCertificateModal.clausulasNoRepeticion.map((c, i) => (
                    <div key={i} className="flex items-center space-x-1.5 text-slate-800">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span>{c}</span>
                    </div>
                  ))
                ) : (
                  <span className="text-slate-400 italic text-[10px]">Sin beneficiarios registrados</span>
                )}
              </div>
            </div>

            {/* Form Add beneficiary */}
            <div className="space-y-2 text-xs">
              <label className="font-bold text-slate-700 block">Agregar Nuevo Beneficiario (CUIT / Razón Social):</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="30-99998888-7 (Cliente Contratante S.A.)"
                  value={cuitBeneficiario}
                  onChange={(e) => setCuitBeneficiario(e.target.value)}
                  className="flex-1 p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg font-mono text-xs"
                />
                <button
                  type="button"
                  onClick={() => handleAddClausula(showCertificateModal.id)}
                  className="bg-[#005a9e] hover:bg-[#007bc1] text-white px-3 py-2 rounded-lg font-bold cursor-pointer transition-all"
                >
                  Agregar
                </button>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowCertificateModal(null)}
                className="px-4 py-2 border border-[#c7c7c7] text-[#6d6e71] rounded-lg hover:bg-slate-50 text-xs cursor-pointer"
              >
                Cerrar
              </button>
              <button
                type="button"
                onClick={() => {
                  alert(`Certificado PDF generado exitosamente para ${getCliente(showCertificateModal.clienteId)?.nombreRazonSocial}`);
                  setShowCertificateModal(null);
                }}
                className="px-4 py-2 bg-[#005a9e] text-white font-bold rounded-lg hover:bg-[#007bc1] text-xs flex items-center space-x-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Descargar PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* MODAL NUEVO CONTRATO ART (ALTA) */}
      {/* ============================================================= */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#c7c7c7] shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900">Alta de Contrato ART (Proceso 5)</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-[#9e9e9e] hover:text-slate-900 font-bold text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAltaSubmit} className="space-y-3 text-xs">
              {/* Empleador & Aseguradora */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Empleador / Cliente <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={empresaClienteId}
                    onChange={(e) => setEmpresaClienteId(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg"
                    required
                  >
                    {clientes.map((c) => (
                      <option key={c.id} value={c.id}>{c.nombreRazonSocial}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Aseguradora ART <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={artAseguradoraId}
                    onChange={(e) => setArtAseguradoraId(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg"
                    required
                  >
                    {aseguradoras.map((a) => (
                      <option key={a.id} value={a.id}>{a.nombre}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Número de Contrato & CIIU */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    N° Contrato ART <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="ART-12345"
                    value={numContrato}
                    onChange={(e) => setNumContrato(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    CIIU Actividad <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={ciiu}
                    onChange={(e) => setCiiu(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg font-mono"
                    placeholder="602300"
                    required
                  />
                </div>
              </div>

              {/* Actividad */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Descripción Actividad <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={actividad}
                  onChange={(e) => setActividad(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg"
                  placeholder="Ej: Transporte Automotor de Cargas Generales"
                  required
                />
              </div>

              {/* Fechas de Vigencia Inicio y Fin */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Fecha Inicio Vigencia <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Fecha Fin Vigencia <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg font-mono"
                    required
                  />
                </div>
              </div>

              {/* Masa Salarial & Trabajadores */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Masa Salarial Estimada (ARS) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={masaSalarial}
                    onChange={(e) => setMasaSalarial(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg font-mono"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Cantidad de Trabajadores <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={trabajadores}
                    onChange={(e) => setTrabajadores(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg font-mono"
                    min="1"
                    required
                  />
                </div>
              </div>

              {/* Alícuota Fija & Alícuota Variable */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Alícuota Fija (ARS / Cápita) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={alicuotaFija}
                    onChange={(e) => setAlicuotaFija(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg font-mono"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Alícuota Variable (%) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={alicuotaVar}
                    onChange={(e) => setAlicuotaVar(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg font-mono"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-[#c7c7c7] text-[#6d6e71] rounded-lg hover:bg-slate-50 cursor-pointer font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#005a9e] hover:bg-[#007bc1] text-white font-bold rounded-lg shadow-sm cursor-pointer"
                >
                  Guardar Contrato ART
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
