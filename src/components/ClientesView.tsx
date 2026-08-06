import React, { useState } from 'react';
import { Cliente, Poliza, Vehiculo, ContratoART, TipoCliente, CondicionIVA, PerfilRiesgo } from '../types';
import { Users, Search, Plus, FileText, Car, Briefcase, CheckCircle2, AlertCircle, Building2, User } from 'lucide-react';

interface ClientesViewProps {
  clientes: Cliente[];
  polizas: Poliza[];
  vehiculos: Vehiculo[];
  contratosArt: ContratoART[];
  onAddCliente: (nuevo: Omit<Cliente, 'id' | 'fechaAlta'>) => void;
  onNavigate: (processId: string) => void;
}

export const ClientesView: React.FC<ClientesViewProps> = ({
  clientes,
  polizas,
  vehiculos,
  contratosArt,
  onAddCliente,
  onNavigate
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFilter, setTipoFilter] = useState<'Todos' | TipoCliente>('Todos');
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(clientes[0] || null);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [formCuit, setFormCuit] = useState('');
  const [formTipo, setFormTipo] = useState<TipoCliente>('Persona Física');
  const [formNombre, setFormNombre] = useState('');
  const [formIva, setFormIva] = useState<CondicionIVA>('Consumidor Final');
  const [formEmail, setFormEmail] = useState('');
  const [formTel, setFormTel] = useState('');
  const [formDomicilio, setFormDomicilio] = useState('');
  const [formLocalidad, setFormLocalidad] = useState('');
  const [formProvincia, setFormProvincia] = useState('Buenos Aires');
  const [formPerfil, setFormPerfil] = useState<PerfilRiesgo>('Bajo');
  const [formError, setFormError] = useState<string | null>(null);

  const filteredClientes = clientes.filter((c) => {
    const matchTipo = tipoFilter === 'Todos' || c.tipo === tipoFilter;
    const matchSearch =
      c.nombreRazonSocial.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.cuitCuilDni.includes(searchTerm) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchTipo && matchSearch;
  });

  const handleSubmitNew = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formCuit.trim() || !formNombre.trim()) {
      setFormError('Por favor complete CUIT/CUIL/DNI y Nombre/Razón Social.');
      return;
    }

    // Check CUIT uniqueness rule from Process 1
    const exists = clientes.some(c => c.cuitCuilDni.replace(/\D/g, '') === formCuit.replace(/\D/g, ''));
    if (exists) {
      setFormError('Ya existe un cliente registrado con ese número de CUIT/CUIL/DNI.');
      return;
    }

    onAddCliente({
      cuitCuilDni: formCuit,
      tipo: formTipo,
      nombreRazonSocial: formNombre,
      condicionIva: formIva,
      email: formEmail,
      telefono: formTel,
      domicilio: formDomicilio,
      localidad: formLocalidad,
      provincia: formProvincia,
      perfilRiesgo: formPerfil,
      estado: 'Activo'
    });

    // Reset
    setFormCuit('');
    setFormNombre('');
    setFormEmail('');
    setFormTel('');
    setFormDomicilio('');
    setFormLocalidad('');
    setShowModal(false);
  };

  const getPolizasCliente = (clienteId: string) => polizas.filter((p) => p.clienteId === clienteId);
  const getVehiculosCliente = (clienteId: string) => vehiculos.filter((v) => v.clienteId === clienteId);
  const getArtsCliente = (clienteId: string) => contratosArt.filter((a) => a.clienteId === clienteId);

  return (
    <div className="space-y-6">
      
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-[#c7c7c7] shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-[#005a9e]" />
            <h2 className="text-lg font-bold text-slate-900">Proceso 1 · Administración de Clientes</h2>
          </div>
          <p className="text-xs text-[#6d6e71] mt-0.5">
            Asegurados y Tomadores. Unicidad verificada por CUIT/CUIL/DNI.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-[#005a9e] hover:bg-[#007bc1] text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-all shadow-sm flex items-center space-x-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Nuevo Cliente</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-[#c7c7c7]">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#9e9e9e]" />
          <input
            type="text"
            placeholder="Buscar por CUIT, Nombre o Email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-[#c7c7c7] rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#005a9e] text-slate-800"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto text-xs">
          <span className="text-[#6d6e71] font-bold">Tipo:</span>
          {(['Todos', 'Persona Física', 'Persona Jurídica'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTipoFilter(t)}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                tipoFilter === t
                  ? 'bg-[#005a9e] text-white shadow-xs'
                  : 'bg-white border border-[#c7c7c7] text-[#6d6e71] hover:text-[#005a9e]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Layout: Master List + Detail Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Clientes List */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-[#c7c7c7] shadow-xs overflow-hidden flex flex-col">
          <div className="p-3 bg-slate-50 border-b border-[#c7c7c7] text-xs font-bold text-[#6d6e71] flex justify-between">
            <span>Listado de Clientes</span>
            <span>{filteredClientes.length} Registros</span>
          </div>

          <div className="divide-y divide-slate-100 overflow-y-auto max-h-[500px]">
            {filteredClientes.map((c) => {
              const isSelected = selectedCliente?.id === c.id;
              const countPolizas = getPolizasCliente(c.id).length;

              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedCliente(c)}
                  className={`w-full text-left p-3.5 transition-all space-y-1 block ${
                    isSelected ? 'bg-[#005a9e]/10 border-l-4 border-l-[#005a9e]' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 truncate">{c.nombreRazonSocial}</span>
                    <span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                      {c.cuitCuilDni}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#6d6e71]">
                    <span className="flex items-center space-x-1">
                      {c.tipo === 'Persona Jurídica' ? (
                        <Building2 className="w-3.5 h-3.5 text-[#005a9e]" />
                      ) : (
                        <User className="w-3.5 h-3.5 text-[#007bc1]" />
                      )}
                      <span>{c.tipo}</span>
                    </span>
                    <span className="font-semibold text-[#005a9e]">{countPolizas} Pólizas Activas</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Cliente Detail */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-[#c7c7c7] shadow-xs p-5 space-y-6">
          {selectedCliente ? (
            <>
              {/* Header Info */}
              <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="bg-[#005a9e] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      {selectedCliente.tipo}
                    </span>
                    <span className="text-xs font-mono font-bold text-[#007bc1]">{selectedCliente.cuitCuilDni}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mt-1">{selectedCliente.nombreRazonSocial}</h3>
                  <p className="text-xs text-[#6d6e71]">{selectedCliente.condicionIva} · {selectedCliente.domicilio}, {selectedCliente.localidad}</p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-[#9e9e9e] block">Perfil de Riesgo</span>
                  <span className="inline-block text-xs font-bold px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-900">
                    {selectedCliente.perfilRiesgo}
                  </span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-3 rounded-lg border border-[#c7c7c7]">
                <div>
                  <span className="text-[#9e9e9e] block">Email de Contacto</span>
                  <span className="font-semibold text-slate-800">{selectedCliente.email}</span>
                </div>
                <div>
                  <span className="text-[#9e9e9e] block">Teléfono / WhatsApp</span>
                  <span className="font-semibold text-slate-800">{selectedCliente.telefono}</span>
                </div>
              </div>

              {/* Linked Items: Polizas */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                    <FileText className="w-4 h-4 text-[#005a9e]" />
                    <span>Pólizas Vinculadas ({getPolizasCliente(selectedCliente.id).length})</span>
                  </h4>
                  <button onClick={() => onNavigate('proceso-3')} className="text-[11px] text-[#007bc1] font-bold hover:underline">
                    Ver en Pólizas
                  </button>
                </div>

                {getPolizasCliente(selectedCliente.id).length === 0 ? (
                  <p className="text-xs text-[#9e9e9e] italic">No posee pólizas registradas.</p>
                ) : (
                  <div className="space-y-2">
                    {getPolizasCliente(selectedCliente.id).map((p) => (
                      <div key={p.id} className="p-3 bg-white border border-[#c7c7c7] rounded-lg text-xs space-y-1">
                        <div className="flex justify-between font-bold text-slate-900">
                          <span>{p.ramo} · N° {p.numeroPoliza}</span>
                          <span className="font-mono text-[#005a9e]">${p.premioTotal.toLocaleString('es-AR')} ARS</span>
                        </div>
                        <p className="text-[#6d6e71] text-[11px]">{p.objetoAsegurado}</p>
                        <div className="text-[10px] text-[#9e9e9e] flex justify-between">
                          <span>Vigencia: {p.vigenciaDesde} al {p.vigenciaHasta}</span>
                          <span className="font-bold text-emerald-700">{p.estado}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Linked Items: Vehiculos */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                    <Car className="w-4 h-4 text-[#007bc1]" />
                    <span>Vehículos Registrados ({getVehiculosCliente(selectedCliente.id).length})</span>
                  </h4>
                  <button onClick={() => onNavigate('proceso-4')} className="text-[11px] text-[#007bc1] font-bold hover:underline">
                    Ver en Vehículos
                  </button>
                </div>

                {getVehiculosCliente(selectedCliente.id).map((v) => (
                  <div key={v.id} className="p-2.5 bg-slate-50 border border-[#c7c7c7] rounded-lg text-xs flex justify-between items-center">
                    <div>
                      <span className="font-bold text-slate-900">{v.marca} {v.modelo}</span>
                      <span className="text-[#9e9e9e] block text-[10px]">Patente: {v.dominioChasis} {v.poseeGnc && '· [GNC]'}</span >
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                      {v.estado}
                    </span>
                  </div>
                ))}
              </div>

            </>
          ) : (
            <div className="text-center py-12 text-[#9e9e9e] text-xs">
              Seleccione un cliente para ver su legajo funcional.
            </div>
          )}
        </div>

      </div>

      {/* Modal Alta de Cliente */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#c7c7c7] shadow-xl max-w-lg w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900">Alta de Nuevo Cliente (Proceso 1)</h3>
              <button onClick={() => setShowModal(false)} className="text-[#9e9e9e] hover:text-slate-900 font-bold text-lg">
                ✕
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-lg flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmitNew} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tipo Cliente</label>
                  <select
                    value={formTipo}
                    onChange={(e) => setFormTipo(e.target.value as TipoCliente)}
                    className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg"
                  >
                    <option value="Persona Física">Persona Física</option>
                    <option value="Persona Jurídica">Persona Jurídica</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">CUIT / CUIL / DNI</label>
                  <input
                    type="text"
                    placeholder="20-30000000-9"
                    value={formCuit}
                    onChange={(e) => setFormCuit(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Nombre Completo o Razón Social</label>
                <input
                  type="text"
                  placeholder="Ej: Pérez, Juan Manuel o Empresa S.A."
                  value={formNombre}
                  onChange={(e) => setFormNombre(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Condición IVA</label>
                  <select
                    value={formIva}
                    onChange={(e) => setFormIva(e.target.value as CondicionIVA)}
                    className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg"
                  >
                    <option value="Consumidor Final">Consumidor Final</option>
                    <option value="Monotributo">Monotributo</option>
                    <option value="Responsable Inscripto">Responsable Inscripto</option>
                    <option value="Exento">Exento</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Perfil Riesgo</label>
                  <select
                    value={formPerfil}
                    onChange={(e) => setFormPerfil(e.target.value as PerfilRiesgo)}
                    className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg"
                  >
                    <option value="Bajo">Bajo</option>
                    <option value="Medio">Medio</option>
                    <option value="Alto">Alto</option>
                    <option value="Corporativo">Corporativo</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Email</label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Teléfono</label>
                  <input
                    type="text"
                    value={formTel}
                    onChange={(e) => setFormTel(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Domicilio</label>
                  <input
                    type="text"
                    value={formDomicilio}
                    onChange={(e) => setFormDomicilio(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Localidad</label>
                  <input
                    type="text"
                    value={formLocalidad}
                    onChange={(e) => setFormLocalidad(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg"
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
                  Guardar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
