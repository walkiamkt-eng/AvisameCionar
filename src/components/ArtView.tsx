import React, { useState } from 'react';
import { ContratoART, Cliente, Aseguradora } from '../types';
import { Briefcase, Plus, ShieldCheck, Download, AlertCircle, Clock, FileCheck, CheckCircle2 } from 'lucide-react';

interface ArtViewProps {
  contratosArt: ContratoART[];
  clientes: Cliente[];
  aseguradoras: Aseguradora[];
  onAddContratoArt: (nuevo: Omit<ContratoART, 'id' | 'mesesPermanencia' | 'esElegibleTraspaso'>) => void;
}

export const ArtView: React.FC<ArtViewProps> = ({
  contratosArt,
  clientes,
  aseguradoras,
  onAddContratoArt
}) => {
  const [showModal, setShowModal] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState<ContratoART | null>(null);
  const [empresaClienteId, setEmpresaClienteId] = useState(clientes[0]?.id || '');
  const [artAseguradoraId, setArtAseguradoraId] = useState(aseguradoras[0]?.id || '');
  const [numContrato, setNumContrato] = useState('');
  const [ciiu, setCiiu] = useState('602300');
  const [actividad, setActividad] = useState('Transporte Automotor de Carga');
  const [masaSalarial, setMasaSalarial] = useState<number>(35000000);
  const [trabajadores, setTrabajadores] = useState<number>(25);
  const [alicuotaFija, setAlicuotaFija] = useState<number>(850);
  const [alicuotaVar, setAlicuotaVar] = useState<number>(3.0);
  const [fechaInicio, setFechaInicio] = useState('2025-01-01');

  // New Non-Repetition Clause Beneficiary input
  const [cuitBeneficiario, setCuitBeneficiario] = useState('');

  const getCliente = (id: string) => clientes.find((c) => c.id === id);
  const getAseguradora = (id: string) => aseguradoras.find((a) => a.id === id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!numContrato.trim()) return;

    onAddContratoArt({
      numeroContrato: numContrato,
      clienteId: empresaClienteId,
      aseguradoraId: artAseguradoraId,
      ciiuActividad: ciiu,
      descripcionActividad: actividad,
      masaSalarialEstimada: Number(masaSalarial),
      cantidadTrabajadores: Number(trabajadores),
      alicuotaFija: Number(alicuotaFija),
      alicuotaVariable: Number(alicuotaVar),
      fechaInicioContrato: fechaInicio,
      clausulasNoRepeticion: []
    });

    setNumContrato('');
    setShowModal(false);
  };

  const handleAddClausula = (contratoId: string) => {
    if (!cuitBeneficiario.trim()) return;
    const contrato = contratosArt.find((c) => c.id === contratoId);
    if (contrato) {
      contrato.clausulasNoRepeticion.push(cuitBeneficiario);
      setCuitBeneficiario('');
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
            Supervisión de Contratos de Riesgos del Trabajo, Traspasos de 12 Meses y Cláusulas de No Repetición.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-[#005a9e] hover:bg-[#007bc1] text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-all shadow-sm flex items-center space-x-2 self-start sm:self-auto"
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
                    <p className="text-xs text-[#6d6e71]">CUIT: {cliente?.cuitCuilDni}</p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-[#9e9e9e] uppercase font-bold block">Aseguradora ART</span>
                    <span className="text-xs font-bold text-[#005a9e]">{aseguradora?.nombre}</span>
                  </div>
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
                    Cláusulas de No Repetición Emitidas ({art.clausulasNoRepeticion.length})
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {art.clausulasNoRepeticion.map((benef, idx) => (
                      <span key={idx} className="text-[10px] bg-white border border-[#c7c7c7] text-[#6d6e71] px-2 py-0.5 rounded">
                        {benef}
                      </span>
                    ))}
                  </div>
                </div>

              </div>

              {/* Actions: Emit Certificate */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setShowCertificateModal(art)}
                  className="w-full bg-slate-100 hover:bg-[#005a9e] hover:text-white text-[#005a9e] text-xs font-bold py-2 px-3 rounded-lg transition-all flex items-center justify-center space-x-2 border border-[#c7c7c7]"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>Generar Certificado de Cobertura</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Modal Certificado de Cobertura preview */}
      {showCertificateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#c7c7c7] shadow-xl max-w-lg w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-[#005a9e]" />
                <h3 className="text-base font-bold text-slate-900">Emisión de Certificado de Cobertura</h3>
              </div>
              <button onClick={() => setShowCertificateModal(null)} className="text-[#9e9e9e] hover:text-slate-900 font-bold text-lg">
                ✕
              </button>
            </div>

            <div className="p-4 bg-slate-50 border border-[#c7c7c7] rounded-lg text-xs space-y-2 font-serif leading-relaxed text-slate-800">
              <p className="font-sans font-bold text-[#005a9e] text-center uppercase tracking-wide border-b border-slate-200 pb-2">
                Certificado de Cobertura ART con Cláusula de No Repetición
              </p>
              <p>
                Por la presente se certifica que la empresa <strong className="font-sans">{getCliente(showCertificateModal.clienteId)?.nombreRazonSocial}</strong> (CUIT: {getCliente(showCertificateModal.clienteId)?.cuitCuilDni}) posee contrato de cobertura por Riesgos del Trabajo N° <strong className="font-mono">{showCertificateModal.numeroContrato}</strong> emitido por la aseguradora <strong className="font-sans">{getAseguradora(showCertificateModal.aseguradoraId)?.nombre}</strong>.
              </p>
              <p>
                Se incluye expresamente la <strong>Cláusula de No Repetición</strong> a favor de los siguientes terceros contratantes beneficiarios:
              </p>

              <div className="p-2 bg-white border border-slate-200 rounded font-sans text-[11px] font-mono space-y-1">
                {showCertificateModal.clausulasNoRepeticion.map((c, i) => (
                  <div key={i} className="flex items-center space-x-1.5 text-slate-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>{c}</span>
                  </div>
                ))}
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
                  onClick={() => handleAddClausula(showCertificateModal.id)}
                  className="bg-[#005a9e] text-white px-3 py-2 rounded-lg font-bold"
                >
                  Agregar
                </button>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end space-x-2">
              <button
                onClick={() => setShowCertificateModal(null)}
                className="px-4 py-2 border border-[#c7c7c7] text-[#6d6e71] rounded-lg hover:bg-slate-50 text-xs"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  alert(`Certificado PDF generado exitosamente para ${getCliente(showCertificateModal.clienteId)?.nombreRazonSocial}`);
                  setShowCertificateModal(null);
                }}
                className="px-4 py-2 bg-[#005a9e] text-white font-bold rounded-lg hover:bg-[#007bc1] text-xs flex items-center space-x-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Descargar PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Nuevo Contrato ART */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#c7c7c7] shadow-xl max-w-lg w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900">Alta de Contrato ART (Proceso 5)</h3>
              <button onClick={() => setShowModal(false)} className="text-[#9e9e9e] hover:text-slate-900 font-bold text-lg">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Empleador / Cliente</label>
                  <select
                    value={empresaClienteId}
                    onChange={(e) => setEmpresaClienteId(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg"
                  >
                    {clientes.map((c) => (
                      <option key={c.id} value={c.id}>{c.nombreRazonSocial}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Aseguradora ART</label>
                  <select
                    value={artAseguradoraId}
                    onChange={(e) => setArtAseguradoraId(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg"
                  >
                    {aseguradoras.map((a) => (
                      <option key={a.id} value={a.id}>{a.nombre}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">N° Contrato ART</label>
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
                  <label className="font-bold text-slate-700 block mb-1">Fecha Inicio Contrato</label>
                  <input
                    type="date"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">CIIU Actividad</label>
                  <input
                    type="text"
                    value={ciiu}
                    onChange={(e) => setCiiu(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Trabajadores</label>
                  <input
                    type="number"
                    value={trabajadores}
                    onChange={(e) => setTrabajadores(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-[#c7c7c7] text-[#6d6e71] rounded-lg hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#005a9e] text-white font-bold rounded-lg hover:bg-[#007bc1]"
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
