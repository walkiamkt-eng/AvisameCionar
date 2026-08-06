import React, { useState } from 'react';
import { Aseguradora } from '../types';
import { Building2, Plus, ShieldCheck, Phone, Mail, Percent, CheckCircle2 } from 'lucide-react';

interface AseguradorasViewProps {
  aseguradoras: Aseguradora[];
  onAddAseguradora: (nueva: Omit<Aseguradora, 'id'>) => void;
}

export const AseguradorasView: React.FC<AseguradorasViewProps> = ({
  aseguradoras,
  onAddAseguradora
}) => {
  const [showModal, setShowModal] = useState(false);
  const [nombre, setNombre] = useState('');
  const [cuit, setCuit] = useState('');
  const [codigoProductor, setCodigoProductor] = useState('');
  const [codigoOrganizador, setCodigoOrganizador] = useState('');
  const [telefonoSoporte, setTelefonoSoporte] = useState('');
  const [emailSuscripcion, setEmailSuscripcion] = useState('');
  const [comisionPromedio, setComisionPromedio] = useState<number>(18);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !codigoProductor.trim()) return;

    onAddAseguradora({
      nombre,
      cuit,
      codigoProductor,
      codigoOrganizador,
      ramosHabilitados: ['Automotores', 'Combinado Familiar', 'Integral de Comercio'],
      estadoSsn: 'Habilitada',
      telefonoSoporte,
      emailSuscripcion,
      comisionPromedio: Number(comisionPromedio),
      estado: 'Activa'
    });

    setNombre('');
    setCuit('');
    setCodigoProductor('');
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-[#c7c7c7] shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-[#005a9e]" />
            <h2 className="text-lg font-bold text-slate-900">Proceso 2 · Administración de Aseguradoras</h2>
          </div>
          <p className="text-xs text-[#6d6e71] mt-0.5">
            Compañías de Seguros, Códigos de Matrícula/Organizador y Estado Habilitante SSN.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-[#005a9e] hover:bg-[#007bc1] text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-all shadow-sm flex items-center space-x-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Nueva Aseguradora</span>
        </button>
      </div>

      {/* Insurers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {aseguradoras.map((aseg) => (
          <div key={aseg.id} className="bg-white rounded-xl border border-[#c7c7c7] p-5 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <span className="text-[10px] font-mono font-bold text-[#007bc1] bg-[#005a9e]/10 px-2 py-0.5 rounded">
                    CUIT: {aseg.cuit}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-1">{aseg.nombre}</h3>
                </div>
                <span className="bg-emerald-100 text-emerald-900 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-700" />
                  <span>{aseg.estadoSsn}</span>
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-[#c7c7c7] space-y-1.5 text-xs">
                <div className="flex justify-between text-[#6d6e71]">
                  <span>Código PAS:</span>
                  <span className="font-bold text-slate-900 font-mono">{aseg.codigoProductor}</span>
                </div>
                {aseg.codigoOrganizador && (
                  <div className="flex justify-between text-[#6d6e71]">
                    <span>Organizador:</span>
                    <span className="font-bold text-slate-900 font-mono">{aseg.codigoOrganizador}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#6d6e71]">
                  <span>Comisión Pactada:</span>
                  <span className="font-bold text-[#005a9e] font-mono">{aseg.comisionPromedio}%</span>
                </div>
              </div>

              {/* Ramos */}
              <div>
                <span className="text-[10px] font-bold text-[#9e9e9e] uppercase block mb-1">Ramos Autorizados</span>
                <div className="flex flex-wrap gap-1">
                  {aseg.ramosHabilitados.map((ramo) => (
                    <span key={ramo} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                      {ramo}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Direct Support Contacts */}
            <div className="pt-3 border-t border-slate-100 text-xs text-[#6d6e71] space-y-1">
              <div className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-[#005a9e]" />
                <span>{aseg.telefonoSoporte}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-[#007bc1]" />
                <span>{aseg.emailSuscripcion}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Nueva Aseguradora */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#c7c7c7] shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900">Alta de Aseguradora (Proceso 2)</h3>
              <button onClick={() => setShowModal(false)} className="text-[#9e9e9e] hover:text-slate-900 font-bold text-lg">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nombre Razón Social</label>
                <input
                  type="text"
                  placeholder="Ej: Mapfre Seguros"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">CUIT Compañía</label>
                  <input
                    type="text"
                    placeholder="30-50000000-1"
                    value={cuit}
                    onChange={(e) => setCuit(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Código Productor</label>
                  <input
                    type="text"
                    placeholder="PAS-12345"
                    value={codigoProductor}
                    onChange={(e) => setCodigoProductor(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Código Organizador</label>
                  <input
                    type="text"
                    placeholder="ORG-99"
                    value={codigoOrganizador}
                    onChange={(e) => setCodigoOrganizador(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Comisión %</label>
                  <input
                    type="number"
                    value={comisionPromedio}
                    onChange={(e) => setComisionPromedio(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Teléfono Soporte Emisión</label>
                <input
                  type="text"
                  placeholder="0810-000-1234"
                  value={telefonoSoporte}
                  onChange={(e) => setTelefonoSoporte(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Email Suscripción</label>
                <input
                  type="email"
                  placeholder="emision@aseguradora.com.ar"
                  value={emailSuscripcion}
                  onChange={(e) => setEmailSuscripcion(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg"
                />
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
                  Guardar Aseguradora
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
