import React, { useState } from 'react';
import { Poliza, Cliente, Aseguradora, RamoSeguro, EndosoItem } from '../types';
import { FileText, Plus, Search, Shield, Edit3, Layers, Calendar, DollarSign, ArrowUpRight, CheckCircle2, History } from 'lucide-react';

interface PolizasViewProps {
  polizas: Poliza[];
  clientes: Cliente[];
  aseguradoras: Aseguradora[];
  onAddPoliza: (nueva: Omit<Poliza, 'id'>) => void;
  onUpdatePoliza?: (polizaActualizada: Poliza) => void;
  onNavigate: (processId: string) => void;
}

export const PolizasView: React.FC<PolizasViewProps> = ({
  polizas,
  clientes,
  aseguradoras,
  onAddPoliza,
  onUpdatePoliza,
  onNavigate
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [ramoFilter, setRamoFilter] = useState<string>('Todos');

  // Modal State for Create / Edit Policy
  const [showModal, setShowModal] = useState(false);
  const [editingPoliza, setEditingPoliza] = useState<Poliza | null>(null);

  // Modal State for Endosos Management
  const [showEndososModal, setShowEndososModal] = useState(false);
  const [selectedPolizaForEndoso, setSelectedPolizaForEndoso] = useState<Poliza | null>(null);

  // Policy Form State
  const [numPoliza, setNumPoliza] = useState('');
  const [endosoNum, setEndosoNum] = useState('000');
  const [clienteId, setClienteId] = useState(clientes[0]?.id || '');
  const [aseguradoraId, setAseguradoraId] = useState(aseguradoras[0]?.id || '');
  const [ramo, setRamo] = useState<RamoSeguro>('Automotores');
  const [vigDesde, setVigDesde] = useState('2026-08-01');
  const [vigHasta, setVigHasta] = useState('2027-08-01');
  const [sumaAsegurada, setSumaAsegurada] = useState<number>(25000000);
  const [primaNeta, setPrimaNeta] = useState<number>(65000);
  const [premioTotal, setPremioTotal] = useState<number>(95000);
  const [planCuotas, setPlanCuotas] = useState<number>(12);
  const [bienAsegurado, setBienAsegurado] = useState('');
  const [riesgoCubierto, setRiesgoCubierto] = useState('');
  const [estado, setEstado] = useState<'Vigente' | 'Anulada' | 'En Renovación' | 'Pendiente Emisión'>('Vigente');
  const [fechaAnulacion, setFechaAnulacion] = useState<string>('');
  const [motivoAnulacion, setMotivoAnulacion] = useState<string>('');

  // Endoso Form State
  const [numEndosoNuevo, setNumEndosoNuevo] = useState('');
  const [fechaEndoso, setFechaEndoso] = useState(new Date().toISOString().split('T')[0]);
  const [tipoEndoso, setTipoEndoso] = useState<EndosoItem['tipo']>('Modificación de Cobertura');
  const [descripcionEndoso, setDescripcionEndoso] = useState('');
  const [ajusteSuma, setAjusteSuma] = useState<string>('');
  const [ajustePremio, setAjustePremio] = useState<string>('');

  const filteredPolizas = polizas.filter((p) => {
    const matchRamo = ramoFilter === 'Todos' || p.ramo === ramoFilter;
    const bienText = (p.bienAsegurado || p.objetoAsegurado || '').toLowerCase();
    const riesgoText = (p.riesgoCubierto || '').toLowerCase();
    const numText = p.numeroPoliza.toLowerCase();
    const searchLower = searchTerm.toLowerCase();

    const matchSearch =
      numText.includes(searchLower) ||
      bienText.includes(searchLower) ||
      riesgoText.includes(searchLower);

    return matchRamo && matchSearch;
  });

  const getClienteNombre = (id: string) => clientes.find((c) => c.id === id)?.nombreRazonSocial || 'Cliente N/D';
  const getAseguradoraNombre = (id: string) => aseguradoras.find((a) => a.id === id)?.nombre || 'Aseguradora N/D';

  const handleOpenCreateModal = () => {
    setEditingPoliza(null);
    setNumPoliza('');
    setEndosoNum('000');
    setClienteId('');
    setAseguradoraId('');
    setRamo('Automotores');
    setVigDesde(new Date().toISOString().split('T')[0]);
    const unAnioMas = new Date();
    unAnioMas.setFullYear(unAnioMas.getFullYear() + 1);
    setVigHasta(unAnioMas.toISOString().split('T')[0]);
    setSumaAsegurada(25000000);
    setPrimaNeta(65000);
    setPremioTotal(95000);
    setPlanCuotas(12);
    setBienAsegurado('');
    setRiesgoCubierto('');
    setEstado('Vigente');
    setFechaAnulacion('');
    setMotivoAnulacion('');
    setShowModal(true);
  };

  const handleOpenEditModal = (pol: Poliza) => {
    setEditingPoliza(pol);
    setNumPoliza(pol.numeroPoliza);
    setEndosoNum(pol.endoso || '000');
    setClienteId(pol.clienteId);
    setAseguradoraId(pol.aseguradoraId);
    setRamo(pol.ramo);
    setVigDesde(pol.vigenciaDesde);
    setVigHasta(pol.vigenciaHasta);
    setSumaAsegurada(pol.sumaAsegurada);
    setPrimaNeta(pol.primaNeta);
    setPremioTotal(pol.premioTotal);
    setPlanCuotas(pol.planCuotas);
    setBienAsegurado(pol.bienAsegurado || pol.objetoAsegurado || '');
    setRiesgoCubierto(pol.riesgoCubierto || '');
    setEstado(pol.estado);
    setFechaAnulacion(pol.fechaAnulacion || '');
    setMotivoAnulacion(pol.motivoAnulacion || '');
    setShowModal(true);
  };

  const handleSubmitPolicy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!numPoliza.trim() || !bienAsegurado.trim() || !riesgoCubierto.trim()) {
      alert('Por favor complete los campos obligatorios (N° Póliza, Bien Asegurado y Riesgo Cubierto).');
      return;
    }

    if (estado === 'Anulada') {
      if (!fechaAnulacion) {
        alert('Por favor ingrese la fecha de anulación.');
        return;
      }
      if (fechaAnulacion <= vigDesde || fechaAnulacion >= vigHasta) {
        alert(`La fecha de anulación (${fechaAnulacion}) debe ser estrictamente posterior a la fecha de inicio (${vigDesde}) y anterior a la fecha de vencimiento (${vigHasta}).`);
        return;
      }
    }

    if (editingPoliza) {
      // Edit mode
      if (onUpdatePoliza) {
        onUpdatePoliza({
          ...editingPoliza,
          numeroPoliza: numPoliza,
          endoso: endosoNum,
          clienteId,
          aseguradoraId,
          ramo,
          vigenciaDesde: vigDesde,
          vigenciaHasta: vigHasta,
          sumaAsegurada: Number(sumaAsegurada),
          primaNeta: Number(primaNeta),
          premioTotal: Number(premioTotal),
          planCuotas: Number(planCuotas),
          bienAsegurado,
          riesgoCubierto,
          objetoAsegurado: bienAsegurado,
          estado,
          fechaAnulacion: estado === 'Anulada' ? fechaAnulacion : undefined,
          motivoAnulacion: estado === 'Anulada' ? motivoAnulacion : undefined
        });
      }
    } else {
      // Create mode
      onAddPoliza({
        numeroPoliza: numPoliza,
        endoso: endosoNum,
        clienteId,
        aseguradoraId,
        ramo,
        vigenciaDesde: vigDesde,
        vigenciaHasta: vigHasta,
        sumaAsegurada: Number(sumaAsegurada),
        primaNeta: Number(primaNeta),
        premioTotal: Number(premioTotal),
        planCuotas: Number(planCuotas),
        estado,
        fechaAnulacion: estado === 'Anulada' ? fechaAnulacion : undefined,
        motivoAnulacion: estado === 'Anulada' ? motivoAnulacion : undefined,
        bienAsegurado,
        riesgoCubierto,
        objetoAsegurado: bienAsegurado,
        endosos: []
      });
    }

    setShowModal(false);
  };

  // Endosos Modal Handler
  const handleOpenEndososModal = (pol: Poliza) => {
    setSelectedPolizaForEndoso(pol);
    setNumEndosoNuevo(`00${(pol.endosos?.length || 0) + 1}`);
    setFechaEndoso(new Date().toISOString().split('T')[0]);
    setTipoEndoso('Modificación de Cobertura');
    setDescripcionEndoso('');
    setAjusteSuma('');
    setAjustePremio('');
    setShowEndososModal(true);
  };

  const handleAddEndoso = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPolizaForEndoso || !numEndosoNuevo.trim() || !descripcionEndoso.trim()) {
      alert('Complete el número y descripción del endoso.');
      return;
    }

    const nuevoEndosoItem: EndosoItem = {
      id: `end-${Date.now()}`,
      numero: numEndosoNuevo,
      fecha: fechaEndoso,
      tipo: tipoEndoso,
      descripcion: descripcionEndoso,
      sumaAseguradaAnterior: selectedPolizaForEndoso.sumaAsegurada,
      sumaAseguradaNueva: ajusteSuma ? Number(ajusteSuma) : undefined,
      premioAjuste: ajustePremio ? Number(ajustePremio) : undefined
    };

    const listaEndososActual = selectedPolizaForEndoso.endosos || [];
    const listaEndososActualizada = [nuevoEndosoItem, ...listaEndososActual];

    const polizaActualizada: Poliza = {
      ...selectedPolizaForEndoso,
      endoso: numEndosoNuevo,
      sumaAsegurada: ajusteSuma ? Number(ajusteSuma) : selectedPolizaForEndoso.sumaAsegurada,
      premioTotal: ajustePremio ? Number(ajustePremio) : selectedPolizaForEndoso.premioTotal,
      endosos: listaEndososActualizada
    };

    if (onUpdatePoliza) {
      onUpdatePoliza(polizaActualizada);
    }

    setSelectedPolizaForEndoso(polizaActualizada);
    setNumEndosoNuevo(`00${listaEndososActualizada.length + 1}`);
    setDescripcionEndoso('');
    setAjusteSuma('');
    setAjustePremio('');
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
            Registro unificado de contratos de seguro con diferenciación de Bien Asegurado, Riesgo Cubierto y control de Endosos.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
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
            placeholder="Buscar por N° Póliza, Bien o Riesgo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-[#c7c7c7] rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#005a9e] text-slate-800"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto text-xs overflow-x-auto pb-1 sm:pb-0">
          <span className="text-[#6d6e71] font-bold">Ramo:</span>
          {[
            'Todos',
            'Automotores',
            'Combinado Familiar',
            'Integral de Comercio',
            'Integral de Consorcio',
            'Incendio',
            'Responsabilidad Civil',
            'Accidentes Personales',
            'Vida',
            'Riesgos del Trabajo (ART)',
            'Caución',
            'Agro',
            'Seguro Técnico',
            'Transporte de Mercaderías',
            'Robo y Riesgos Similares',
            'Salud / Sepelio'
          ].map((r) => (
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
          <span>Contratos de Seguro Registrados ({filteredPolizas.length})</span>
          <span className="font-mono text-[#005a9e]">Supervisión Trazable SSN</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-800">
            <thead className="bg-slate-100/70 border-b border-[#c7c7c7] text-[#6d6e71] font-bold uppercase text-[10px]">
              <tr>
                <th className="p-3">N° Póliza / Endoso</th>
                <th className="p-3">Asegurado / Tomador</th>
                <th className="p-3">Compañía / Ramo</th>
                <th className="p-3">Bien Asegurado</th>
                <th className="p-3">Riesgo Cubierto</th>
                <th className="p-3">Vigencia Técnica</th>
                <th className="p-3 text-right">Suma Asegurada</th>
                <th className="p-3 text-right">Premio Total</th>
                <th className="p-3 text-center">Estado</th>
                <th className="p-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredPolizas.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-[#9e9e9e]">
                    No se encontraron pólizas registradas que coincidan con la búsqueda.
                  </td>
                </tr>
              ) : (
                filteredPolizas.map((pol) => {
                  const cantEndosos = pol.endosos?.length || 0;
                  return (
                    <tr key={pol.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3">
                        <span className="font-bold font-mono text-slate-900 block">{pol.numeroPoliza}</span>
                        <span className="text-[10px] text-[#9e9e9e] font-mono">Endoso: {pol.endoso || '000'}</span>
                      </td>
                      <td className="p-3">
                        <span className="font-bold text-slate-900 block">{getClienteNombre(pol.clienteId)}</span>
                      </td>
                      <td className="p-3">
                        <span className="font-semibold text-[#005a9e] block">{getAseguradoraNombre(pol.aseguradoraId)}</span>
                        <span className="text-[10px] text-[#9e9e9e]">{pol.ramo}</span>
                      </td>
                      <td className="p-3 max-w-xs truncate font-semibold text-slate-800" title={pol.bienAsegurado || pol.objetoAsegurado}>
                        {pol.bienAsegurado || pol.objetoAsegurado || '—'}
                      </td>
                      <td className="p-3 max-w-xs truncate text-[#6d6e71]" title={pol.riesgoCubierto}>
                        {pol.riesgoCubierto || '—'}
                      </td>
                      <td className="p-3 text-[11px] font-mono text-[#6d6e71]">
                        {pol.vigenciaDesde} al {pol.vigenciaHasta}
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-slate-900">
                        ${pol.sumaAsegurada.toLocaleString('es-AR')}
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-[#005a9e]">
                        ${pol.premioTotal.toLocaleString('es-AR')} <span className="text-[10px] text-[#9e9e9e]">({pol.planCuotas}c)</span>
                      </td>
                      <td className="p-3 text-center">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${
                          pol.estado === 'Vigente'
                            ? 'bg-emerald-100 text-emerald-800'
                            : pol.estado === 'En Renovación'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {pol.estado}
                        </span>
                        {pol.estado === 'Anulada' && pol.fechaAnulacion && (
                          <div className="text-[9px] text-red-700 font-mono mt-1" title={pol.motivoAnulacion || 'Sin motivo especificado'}>
                            Anulada: {pol.fechaAnulacion}
                            {pol.motivoAnulacion && (
                              <span className="block text-[8px] italic text-[#6d6e71] truncate max-w-[100px] mx-auto">
                                {pol.motivoAnulacion}
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <button
                            onClick={() => handleOpenEditModal(pol)}
                            className="p-1 text-[#005a9e] hover:bg-slate-100 rounded transition-colors"
                            title="Editar Datos de Póliza"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEndososModal(pol)}
                            className="p-1 text-[#007bc1] hover:bg-slate-100 rounded transition-colors flex items-center space-x-0.5 text-[11px] font-bold"
                            title="Gestionar Endosos de la Póliza"
                          >
                            <Layers className="w-4 h-4" />
                            {cantEndosos > 0 && (
                              <span className="bg-[#005a9e] text-white text-[9px] px-1 rounded-full font-mono">
                                {cantEndosos}
                              </span>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Carga / Edición de Póliza */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#c7c7c7] shadow-xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {editingPoliza ? 'Editar Póliza Emitida' : 'Registro de Póliza Emitida'}
                </h3>
                <p className="text-xs text-[#6d6e71]">Proceso 3 · Administración de Pólizas</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-[#9e9e9e] hover:text-slate-900 font-bold text-lg">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitPolicy} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Cliente / Tomador *</label>
                  <select
                    value={clienteId}
                    onChange={(e) => setClienteId(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg focus:ring-2 focus:ring-[#005a9e]"
                  >
                    <option value="">Seleccione un cliente...</option>
                    {clientes.map((c) => (
                      <option key={c.id} value={c.id}>{c.nombreRazonSocial}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Aseguradora *</label>
                  <select
                    value={aseguradoraId}
                    onChange={(e) => setAseguradoraId(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg focus:ring-2 focus:ring-[#005a9e]"
                  >
                    <option value="">Seleccione una aseguradora...</option>
                    {aseguradoras.map((a) => (
                      <option key={a.id} value={a.id}>{a.nombre}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">N° Póliza Madre *</label>
                  <input
                    type="text"
                    placeholder="Ej: 0800-12345"
                    value={numPoliza}
                    onChange={(e) => setNumPoliza(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg font-mono focus:ring-2 focus:ring-[#005a9e]"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Endoso Actual</label>
                  <input
                    type="text"
                    value={endosoNum}
                    onChange={(e) => setEndosoNum(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg font-mono focus:ring-2 focus:ring-[#005a9e]"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Ramo Seguro *</label>
                  <select
                    value={ramo}
                    onChange={(e) => setRamo(e.target.value as RamoSeguro)}
                    className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg focus:ring-2 focus:ring-[#005a9e]"
                  >
                    <option value="Accidentes Personales">Accidentes Personales</option>
                    <option value="Agro">Agro</option>
                    <option value="Automotores">Automotores</option>
                    <option value="Caución">Caución</option>
                    <option value="Combinado Familiar">Combinado Familiar</option>
                    <option value="Incendio">Incendio</option>
                    <option value="Integral de Comercio">Integral de Comercio</option>
                    <option value="Integral de Consorcio">Integral de Consorcio</option>
                    <option value="Responsabilidad Civil">Responsabilidad Civil</option>
                    <option value="Riesgos del Trabajo (ART)">Riesgos del Trabajo (ART)</option>
                    <option value="Robo y Riesgos Similares">Robo y Riesgos Similares</option>
                    <option value="Salud / Sepelio">Salud / Sepelio</option>
                    <option value="Seguro Técnico">Seguro Técnico</option>
                    <option value="Transporte de Mercaderías">Transporte de Mercaderías</option>
                    <option value="Vida">Vida</option>
                  </select>
                </div>
              </div>

              {/* CAMPOS SEPARADOS: Bien Asegurado & Riesgo Cubierto */}
              <div className="bg-slate-50 p-3.5 rounded-lg border border-[#c7c7c7] space-y-3">
                <h4 className="font-bold text-[#005a9e] text-xs uppercase tracking-wider">
                  Definición de Objeto y Cobertura
                </h4>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Bien Asegurado *</label>
                  <input
                    type="text"
                    placeholder="Ej: Toyota Hilux SRX 4x4 (Dominio AA 123 BB) / Propiedad en Av. Colón 890"
                    value={bienAsegurado}
                    onChange={(e) => setBienAsegurado(e.target.value)}
                    className="w-full p-2 bg-white border border-[#c7c7c7] rounded-lg focus:ring-2 focus:ring-[#005a9e]"
                    required
                  />
                  <span className="text-[10px] text-[#6d6e71]">Detalle físico del vehículo, inmueble, mercadería o persona asegurada.</span>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Riesgo Cubierto *</label>
                  <input
                    type="text"
                    placeholder="Ej: Todo Riesgo c/Franquicia de $150.000 / Incendio Edificio y Contenido"
                    value={riesgoCubierto}
                    onChange={(e) => setRiesgoCubierto(e.target.value)}
                    className="w-full p-2 bg-white border border-[#c7c7c7] rounded-lg focus:ring-2 focus:ring-[#005a9e]"
                    required
                  />
                  <span className="text-[10px] text-[#6d6e71]">Cobertura específica acordada con la aseguradora.</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Estado de Póliza</label>
                  <select
                    value={estado}
                    onChange={(e) => setEstado(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg font-bold"
                  >
                    <option value="Vigente">Vigente</option>
                    <option value="En Renovación">En Renovación</option>
                    <option value="Pendiente Emisión">Pendiente Emisión</option>
                    <option value="Anulada">Anulada</option>
                  </select>
                </div>
              </div>

              {/* Campos condicionales para Anulación (MOD-001) */}
              {estado === 'Anulada' && (
                <div className="bg-red-50 p-3.5 rounded-lg border border-red-200 space-y-3">
                  <h4 className="font-bold text-red-800 text-xs uppercase tracking-wider">
                    Registro de Anulación de Póliza (MOD-001)
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Fecha de Anulación *</label>
                      <input
                        type="date"
                        value={fechaAnulacion}
                        onChange={(e) => setFechaAnulacion(e.target.value)}
                        min={vigDesde}
                        max={vigHasta}
                        className="w-full p-2 bg-white border border-red-300 rounded-lg font-mono text-slate-900 focus:ring-2 focus:ring-red-500"
                        required
                      />
                      <span className="text-[10px] text-red-600 block mt-0.5">
                        Debe ser estrictamente posterior a {vigDesde} y anterior a {vigHasta}.
                      </span>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Motivo de Anulación</label>
                      <input
                        type="text"
                        placeholder="Ej: Solicitud del asegurado / Venta de unidad / Falta de pago"
                        value={motivoAnulacion}
                        onChange={(e) => setMotivoAnulacion(e.target.value)}
                        className="w-full p-2 bg-white border border-red-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                  className="px-4 py-2 border border-[#c7c7c7] text-[#6d6e71] rounded-lg hover:bg-slate-50 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#005a9e] text-white font-bold rounded-lg hover:bg-[#007bc1]"
                >
                  {editingPoliza ? 'Guardar Cambios' : 'Guardar Póliza'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Registro y Consulta de Endosos Ilimitados */}
      {showEndososModal && selectedPolizaForEndoso && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#c7c7c7] shadow-xl max-w-3xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-slate-200 pb-3">
              <div>
                <div className="flex items-center space-x-2">
                  <Layers className="w-5 h-5 text-[#005a9e]" />
                  <h3 className="text-base font-bold text-slate-900">
                    Historial y Registro de Endosos
                  </h3>
                </div>
                <p className="text-xs text-[#6d6e71] mt-0.5">
                  Póliza N° <span className="font-mono font-bold text-slate-900">{selectedPolizaForEndoso.numeroPoliza}</span> · {getClienteNombre(selectedPolizaForEndoso.clienteId)} ({getAseguradoraNombre(selectedPolizaForEndoso.aseguradoraId)})
                </p>
              </div>
              <button onClick={() => setShowEndososModal(false)} className="text-[#9e9e9e] hover:text-slate-900 font-bold text-lg">
                ✕
              </button>
            </div>

            {/* Ficha Resumen de la Póliza */}
            <div className="bg-slate-50 p-3 rounded-lg border border-[#c7c7c7] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-[#6d6e71] block">Bien Asegurado:</span>
                <span className="font-bold text-slate-900">{selectedPolizaForEndoso.bienAsegurado || selectedPolizaForEndoso.objetoAsegurado}</span>
              </div>
              <div>
                <span className="text-[#6d6e71] block">Riesgo Cubierto:</span>
                <span className="font-bold text-slate-900">{selectedPolizaForEndoso.riesgoCubierto || '—'}</span>
              </div>
              <div>
                <span className="text-[#6d6e71] block">Suma Asegurada Actual:</span>
                <span className="font-bold font-mono text-slate-900">${selectedPolizaForEndoso.sumaAsegurada.toLocaleString('es-AR')}</span>
              </div>
              <div>
                <span className="text-[#6d6e71] block">Premio Total Actual:</span>
                <span className="font-bold font-mono text-[#005a9e]">${selectedPolizaForEndoso.premioTotal.toLocaleString('es-AR')}</span>
              </div>
            </div>

            {/* Formulario para Cargar Nuevo Endoso */}
            <form onSubmit={handleAddEndoso} className="bg-blue-50/50 p-4 rounded-xl border border-blue-200 space-y-3 text-xs">
              <div className="flex items-center space-x-2 text-[#005a9e] font-bold">
                <Plus className="w-4 h-4" />
                <span>Registrar Nuevo Endoso</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">N° Endoso *</label>
                  <input
                    type="text"
                    placeholder="Ej: 001, 002"
                    value={numEndosoNuevo}
                    onChange={(e) => setNumEndosoNuevo(e.target.value)}
                    className="w-full p-2 bg-white border border-[#c7c7c7] rounded-lg font-mono focus:ring-2 focus:ring-[#005a9e]"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Fecha Emisión *</label>
                  <input
                    type="date"
                    value={fechaEndoso}
                    onChange={(e) => setFechaEndoso(e.target.value)}
                    className="w-full p-2 bg-white border border-[#c7c7c7] rounded-lg font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tipo de Endoso *</label>
                  <select
                    value={tipoEndoso}
                    onChange={(e) => setTipoEndoso(e.target.value as any)}
                    className="w-full p-2 bg-white border border-[#c7c7c7] rounded-lg focus:ring-2 focus:ring-[#005a9e]"
                  >
                    <option value="Modificación de Cobertura">Modificación de Cobertura</option>
                    <option value="Aumento de Suma Asegurada">Aumento de Suma Asegurada</option>
                    <option value="Cambio de Domicilio">Cambio de Domicilio</option>
                    <option value="Alta/Baja de Riesgo">Alta/Baja de Riesgo</option>
                    <option value="Refacturación / Cuotas">Refacturación / Cuotas</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Descripción del Endoso / Detalle de la Modificación *</label>
                <textarea
                  rows={2}
                  placeholder="Describa el motivo y modificaciones realizadas en este endoso..."
                  value={descripcionEndoso}
                  onChange={(e) => setDescripcionEndoso(e.target.value)}
                  className="w-full p-2 bg-white border border-[#c7c7c7] rounded-lg focus:ring-2 focus:ring-[#005a9e]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nueva Suma Asegurada ($) (Opcional)</label>
                  <input
                    type="number"
                    placeholder="Dejar en blanco si no modifica la suma"
                    value={ajusteSuma}
                    onChange={(e) => setAjusteSuma(e.target.value)}
                    className="w-full p-2 bg-white border border-[#c7c7c7] rounded-lg font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nuevo Premio Total ($) (Opcional)</label>
                  <input
                    type="number"
                    placeholder="Dejar en blanco si no modifica el premio"
                    value={ajustePremio}
                    onChange={(e) => setAjustePremio(e.target.value)}
                    className="w-full p-2 bg-white border border-[#c7c7c7] rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="bg-[#005a9e] hover:bg-[#007bc1] text-white font-bold px-4 py-2 rounded-lg transition-all shadow-xs flex items-center space-x-1"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Agregar Endoso a Póliza</span>
                </button>
              </div>
            </form>

            {/* Historial de Endosos Cargados */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-slate-900 font-bold text-xs">
                <History className="w-4 h-4 text-[#005a9e]" />
                <span>Historial de Endosos Registrados ({selectedPolizaForEndoso.endosos?.length || 0})</span>
              </div>

              {(!selectedPolizaForEndoso.endosos || selectedPolizaForEndoso.endosos.length === 0) ? (
                <div className="text-center py-6 border border-dashed border-[#c7c7c7] rounded-lg text-xs text-[#9e9e9e]">
                  No hay endosos adicionales registrados para esta póliza.
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedPolizaForEndoso.endosos.map((end) => (
                    <div key={end.id} className="p-3 bg-slate-50 border border-[#c7c7c7] rounded-lg space-y-1.5 text-xs">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold bg-[#005a9e] text-white px-2 py-0.5 rounded text-[10px]">
                            Endoso N° {end.numero}
                          </span>
                          <span className="font-bold text-slate-800">{end.tipo}</span>
                        </div>
                        <span className="font-mono text-[11px] text-[#6d6e71]">{end.fecha}</span>
                      </div>

                      <p className="text-slate-700 leading-relaxed">{end.descripcion}</p>

                      {(end.sumaAseguradaNueva || end.premioAjuste) && (
                        <div className="flex items-center space-x-4 pt-1 border-t border-slate-200 text-[11px] font-mono text-[#005a9e]">
                          {end.sumaAseguradaNueva && (
                            <span>Suma Actualizada: ${end.sumaAseguradaNueva.toLocaleString('es-AR')}</span>
                          )}
                          {end.premioAjuste && (
                            <span>Premio Actualizado: ${end.premioAjuste.toLocaleString('es-AR')}</span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setShowEndososModal(false)}
                className="px-4 py-2 border border-[#c7c7c7] text-[#6d6e71] font-bold rounded-lg hover:bg-slate-50 text-xs"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
