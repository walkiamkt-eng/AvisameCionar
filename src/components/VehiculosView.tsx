import React, { useState } from 'react';
import { Vehiculo, Cliente, Poliza } from '../types';
import { Car, Plus, AlertTriangle, ShieldCheck, Flame, CheckCircle2 } from 'lucide-react';

interface VehiculosViewProps {
  vehiculos: Vehiculo[];
  clientes: Cliente[];
  polizas: Poliza[];
  onAddVehiculo: (nuevo: Omit<Vehiculo, 'id'>) => void;
}

export const VehiculosView: React.FC<VehiculosViewProps> = ({
  vehiculos,
  clientes,
  polizas,
  onAddVehiculo
}) => {
  const [showModal, setShowModal] = useState(false);
  const [dominio, setDominio] = useState('');
  const [es0km, setEs0km] = useState(false);
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [anio, setAnio] = useState(2024);
  const [combustible, setCombustible] = useState<'Nafta' | 'Diésel' | 'GNC' | 'Híbrido / Eléctrico'>('Nafta');
  const [poseeGnc, setPoseeGnc] = useState(false);
  const [vencGnc, setVencGnc] = useState('');
  const [clienteId, setClienteId] = useState(clientes[0]?.id || '');
  const [polizaId, setPolizaId] = useState(polizas[0]?.id || '');

  const getClienteNombre = (id: string) => clientes.find((c) => c.id === id)?.nombreRazonSocial || 'N/D';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dominio.trim() || !marca.trim()) return;

    onAddVehiculo({
      dominioChasis: dominio,
      es0kmSinPatente: es0km,
      marca,
      modelo,
      anio: Number(anio),
      tipoUso: 'Particular',
      combustible,
      poseeGnc,
      vencimientoGnc: poseeGnc ? vencGnc : undefined,
      polizaId: polizaId || undefined,
      clienteId,
      estado: 'Cubierto'
    });

    setDominio('');
    setMarca('');
    setModelo('');
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-[#c7c7c7] shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <Car className="w-5 h-5 text-[#005a9e]" />
            <h2 className="text-lg font-bold text-slate-900">Proceso 4 · Administración de Vehículos</h2>
          </div>
          <p className="text-xs text-[#6d6e71] mt-0.5">
            Registro por Dominio/Patente o Chasis (0km). Monitoreo de Oblea GNC y Cobertura.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-[#005a9e] hover:bg-[#007bc1] text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-all shadow-sm flex items-center space-x-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Alta de Vehículo</span>
        </button>
      </div>

      {/* Grid of Vehicles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vehiculos.map((v) => {
          const isGncVencida = v.poseeGnc && v.vencimientoGnc && new Date(v.vencimientoGnc) <= new Date('2026-08-15');

          return (
            <div key={v.id} className="bg-white rounded-xl border border-[#c7c7c7] p-5 shadow-xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                      v.es0kmSinPatente
                        ? 'bg-amber-100 text-amber-900 border-amber-300'
                        : 'bg-[#005a9e]/10 text-[#005a9e] border-[#005a9e]/30'
                    }`}>
                      {v.es0kmSinPatente ? 'Chasis (0km Sin Patente)' : `Patente: ${v.dominioChasis}`}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1">{v.marca} {v.modelo}</h3>
                    <p className="text-xs text-[#6d6e71]">Año {v.anio} · {v.tipoUso}</p>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    v.estado === 'Cubierto' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {v.estado}
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-[#c7c7c7] text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-[#9e9e9e]">Titular:</span>
                    <span className="font-bold text-slate-900 truncate max-w-[160px]">{getClienteNombre(v.clienteId)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#9e9e9e]">Combustible:</span>
                    <span className="font-semibold text-slate-800">{v.combustible}</span>
                  </div>
                </div>

                {/* GNC Oblea Alert Card */}
                {v.poseeGnc && (
                  <div className={`p-2.5 rounded-lg border text-xs flex items-center justify-between ${
                    isGncVencida
                      ? 'bg-amber-50 border-amber-300 text-amber-900'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}>
                    <div className="flex items-center space-x-2">
                      <Flame className="w-4 h-4 text-amber-600" />
                      <div>
                        <span className="font-bold block text-[11px]">Equipo GNC Instalado</span>
                        <span className="text-[10px] opacity-80">Vencimiento Oblea: {v.vencimientoGnc}</span>
                      </div>
                    </div>

                    {isGncVencida && (
                      <span className="text-[9px] bg-amber-200 text-amber-900 font-extrabold px-1.5 py-0.5 rounded uppercase">
                        Próx. Vencer
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Nuevo Vehiculo */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#c7c7c7] shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900">Alta de Vehículo (Proceso 4)</h3>
              <button onClick={() => setShowModal(false)} className="text-[#9e9e9e] hover:text-slate-900 font-bold text-lg">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Titular / Cliente</label>
                <select
                  value={clienteId}
                  onChange={(e) => setClienteId(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg"
                >
                  {clientes.map((c) => (
                    <option key={c.id} value={c.id}>{c.nombreRazonSocial}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Dominio / Patente / Chasis</label>
                  <input
                    type="text"
                    placeholder="AB 123 CD o Chasis N°"
                    value={dominio}
                    onChange={(e) => setDominio(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg font-mono"
                    required
                  />
                </div>

                <div className="flex items-center space-x-2 pt-5">
                  <input
                    type="checkbox"
                    id="chk0km"
                    checked={es0km}
                    onChange={(e) => setEs0km(e.target.checked)}
                    className="w-4 h-4 text-[#005a9e] rounded"
                  />
                  <label htmlFor="chk0km" className="font-bold text-slate-700">Es 0km sin patente</label>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Marca</label>
                  <input
                    type="text"
                    placeholder="Toyota"
                    value={marca}
                    onChange={(e) => setMarca(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Modelo</label>
                  <input
                    type="text"
                    placeholder="Hilux SRV"
                    value={modelo}
                    onChange={(e) => setModelo(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Año</label>
                  <input
                    type="number"
                    value={anio}
                    onChange={(e) => setAnio(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Combustible</label>
                  <select
                    value={combustible}
                    onChange={(e) => setCombustible(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg"
                  >
                    <option value="Nafta">Nafta</option>
                    <option value="Diésel">Diésel</option>
                    <option value="GNC">GNC</option>
                    <option value="Híbrido / Eléctrico">Híbrido / Eléctrico</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2 pt-5">
                  <input
                    type="checkbox"
                    id="chkGnc"
                    checked={poseeGnc}
                    onChange={(e) => setPoseeGnc(e.target.checked)}
                    className="w-4 h-4 text-[#005a9e] rounded"
                  />
                  <label htmlFor="chkGnc" className="font-bold text-slate-700">Tiene Equipo GNC</label>
                </div>
              </div>

              {poseeGnc && (
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Vencimiento Oblea GNC</label>
                  <input
                    type="date"
                    value={vencGnc}
                    onChange={(e) => setVencGnc(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg font-mono"
                  />
                </div>
              )}

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
                  Guardar Vehículo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
