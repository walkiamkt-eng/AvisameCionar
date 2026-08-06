import React, { useState } from 'react';
import { Poliza, Cliente, Aseguradora, RamoSeguro } from '../types';
import { FileText, Plus, Search, Filter, Shield, Calendar, DollarSign, ArrowUpRight } from 'lucide-react';

interface PolizasViewProps {
  polizas: Poliza[];
  clientes: Cliente[];
  aseguradoras: Aseguradora[];
  onAddPoliza: (nueva: Omit<Poliza, 'id'>) => void;
  onNavigate: (processId: string) => void;
}

export const PolizasView: React.FC<PolizasViewProps> = ({
  polizas,
  clientes,
  aseguradoras,
  onAddPoliza,
  onNavigate
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [ramoFilter, setRamoFilter] = useState<string>('Todos');
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [numPoliza, setNumPoliza] = useState('');
  const [endoso, setEndoso] = useState('000');
  const [clienteId, setClienteId] = useState(clientes[0]?.id || '');
  const [aseguradoraId, setAseguradoraId] = useState(aseguradoras[0]?.id || '');
  const [ramo, setRamo] = useState<RamoSeguro>('Automotores');
  const [vigDesde, setVigDesde] = useState('2026-08-01');
  const [vigHasta, setVigHasta] = useState('2027-08-01');
  const [sumaAsegurada, setSumaAsegurada] = useState<number>(25000000);
  const [primaNeta, setPrimaNeta] = useState<number>(65000);
  const [premioTotal, setPremioTotal] = useState<number>(95000);
  const [planCuotas, setPlanCuotas] = useState<number>(12);
  const [objetoAsegurado, setObjetoAsegurado] = useState('');

  const filteredPolizas = polizas.filter((p) => {
    const matchRamo = ramoFilter === 'Todos' || p.ramo === ramoFilter;
    const matchSearch =
      p.numeroPoliza.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.objetoAsegurado.toLowerCase().includes(searchTerm.toLowerCase());
    return matchRamo && matchSearch;
  });

  const getClienteNombre = (id: string) => clientes.find((c) => c.id === id)?.nombreRazonSocial || 'Cliente N/D';
  const getAseguradoraNombre = (id: string) => aseguradoras.find((a) => a.id === id)?.nombre || 'Aseguradora N/D';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!numPoliza.trim() || !objetoAsegurado.trim()) return;

    onAddPoliza({
      numeroPoliza: numPoliza,
      endoso,
      clienteId,
      aseguradoraId,
      ramo,
      vigenciaDesde: vigDesde,
      vigenciaHasta: vigHasta,
      sumaAsegurada: Number(sumaAsegurada),
      primaNeta: Number(primaNeta),
      premioTotal: Number(premioTotal),
      planCuotas: Number(planCuotas),
      estado: 'Vigente',
      objetoAsegurado
    });

    setNumPoliza('');
    setObjetoAsegurado('');
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-[#c7c7c7] shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-[#005a9e]" />
            <h2 className="text-lg font-bold text-slate-900">Proceso 3 · Administración de Pólizas</h2>
          </div>
          <p className="text-xs text-[#6d6e71] mt-0.5">
            Registro unificado de contratos de seguro, vigencia técnica, sumas y premios.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-[#005a9e] hover:bg-[#007bc1] text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-all shadow-sm flex items-center space-x-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Registrar Póliza</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-[#c7c7c7]">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#9e9e9e]" />
          <input
            type="text"
            placeholder="Buscar por N° Póliza u Objeto Asegurado..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-[#c7c7c7] rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#005a9e] text-slate-800"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto text-xs overflow-x-auto pb-1 sm:pb-0">
          <span className="text-[#6d6e71] font-bold">Ramo:</span>
          {['Todos', 'Automotores', 'Combinado Familiar', 'Integral de Comercio', 'Agro'].map((r) => (
            <button
              key={r}
              onClick={() => setRamoFilter(r)}
              className={`px-3 py-1 rounded-md font-medium transition-all whitespace-nowrap ${
                ramoFilter === r
                  ? 'bg-[#005a9e] text-white shadow-xs'
                  : 'bg-white border border-[#c7c7c7] text-[#6d6e71] hover:text-[#005a9e]'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Policies Table */}
      <div className="bg-white rounded-xl border border-[#c7c7c7] shadow-xs overflow-hidden">
        <div className="p-3 bg-slate-50 border-b border-[#c7c7c7] text-xs font-bold text-[#6d6e71] flex justify-between items-center">
          <span>Contratos de Seguro ({filteredPolizas.length})</span>
          <span className="font-mono text-[#005a9e]">Trazabilidad Técnica SSN</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-800">
            <thead className="bg-slate-100/70 border-b border-[#c7c7c7] text-[#6d6e71] font-bold uppercase text-[10px]">
              <tr>
                <th className="p-3">N° Póliza / Endoso</th>
                <th className="p-3">Asegurado / Tomador</th>
                <th className="p-3">Compañía / Ramo</th>
                <th className="p-3">Objeto Cubierto</th>
                <th className="p-3">Vigencia Técnica</th>
                <th className="p-3 text-right">Suma Asegurada</th>
                <th className="p-3 text-right">Premio Total</th>
                <th className="p-3 text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredPolizas.map((pol) => (
                <tr key={pol.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3">
                    <span className="font-bold font-mono text-slate-900 block">{pol.numeroPoliza}</span>
                    <span className="text-[10px] text-[#9e9e9e] font-mono">Endoso: {pol.endoso}</span>
                  </td>
                  <td className="p-3">
                    <span className="font-bold text-slate-900 block">{getClienteNombre(pol.clienteId)}</span>
                  </td>
                  <td className="p-3">
                    <span className="font-semibold text-[#005a9e] block">{getAseguradoraNombre(pol.aseguradoraId)}</span>
                    <span className="text-[10px] text-[#9e9e9e]">{pol.ramo}</span>
                  </td>
                  <td className="p-3 max-w-xs truncate text-[#6d6e71]">
                    {pol.objetoAsegurado}
                  </td>
                  <td className="p-3 text-[11px] font-mono text-[#6d6e71]">
                    {pol.vigenciaDesde} al {pol.vigenciaHasta}
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-slate-900">
                    ${pol.sumaAsegurada.toLocaleString('es-AR')}
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-[#005a9e]">
                    ${pol.premioTotal.toLocaleString('es-AR')} <span className="text-[10px] text-[#9e9e9e]">({pol.planCuotas} cuotas)</span>
                  </td>
                  <td className="p-3 text-center">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      pol.estado === 'Vigente'
                        ? 'bg-emerald-100 text-emerald-800'
                        : pol.estado === 'En Renovación'
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {pol.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Alta de Póliza */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#c7c7c7] shadow-xl max-w-xl w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900">Registro de Póliza Emitida (Proceso 3)</h3>
              <button onClick={() => setShowModal(false)} className="text-[#9e9e9e] hover:text-slate-900 font-bold text-lg">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Cliente / Tomador</label>
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

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Aseguradora</label>
                  <select
                    value={aseguradoraId}
                    onChange={(e) => setAseguradoraId(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg"
                  >
                    {aseguradoras.map((a) => (
                      <option key={a.id} value={a.id}>{a.nombre}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">N° Póliza Madre</label>
                  <input
                    type="text"
                    placeholder="0800-12345"
                    value={numPoliza}
                    onChange={(e) => setNumPoliza(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Endoso</label>
                  <input
                    type="text"
                    value={endoso}
                    onChange={(e) => setEndoso(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Ramo Seguro</label>
                  <select
                    value={ramo}
                    onChange={(e) => setRamo(e.target.value as RamoSeguro)}
                    className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg"
                  >
                    <option value="Automotores">Automotores</option>
                    <option value="Combinado Familiar">Combinado Familiar</option>
                    <option value="Integral de Comercio">Integral de Comercio</option>
                    <option value="Accidentes Personales">Accidentes Personales</option>
                    <option value="Agro">Agro</option>
                    <option value="Caución">Caución</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Objeto Asegurado / Riesgo Cubierto</label>
                <input
                  type="text"
                  placeholder="Ej: Toyota Hilux AB 123 CD o Inmueble Comercial Calle Florida 100"
                  value={objetoAsegurado}
                  onChange={(e) => setObjetoAsegurado(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Vigencia Desde</label>
                  <input
                    type="date"
                    value={vigDesde}
                    onChange={(e) => setVigDesde(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Vigencia Hasta</label>
                  <input
                    type="date"
                    value={vigHasta}
                    onChange={(e) => setVigHasta(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Suma Asegurada ($)</label>
                  <input
                    type="number"
                    value={sumaAsegurada}
                    onChange={(e) => setSumaAsegurada(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Premio Total ($)</label>
                  <input
                    type="number"
                    value={premioTotal}
                    onChange={(e) => setPremioTotal(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Plan Cuotas</label>
                  <input
                    type="number"
                    value={planCuotas}
                    onChange={(e) => setPlanCuotas(Number(e.target.value))}
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
                  Guardar Póliza
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
