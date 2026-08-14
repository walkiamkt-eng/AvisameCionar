import React, { useState } from 'react';
import { Aseguradora, ComisionRamo, RamoSeguro, LISTA_RAMOS_SEGURO } from '../types';
import {
  Building2,
  Plus,
  ShieldCheck,
  Phone,
  Mail,
  Percent,
  Edit3,
  ExternalLink,
  Key,
  User,
  Eye,
  EyeOff,
  Copy,
  Check,
  Ban,
  RotateCcw,
  Search,
  Lock,
  Trash2
} from 'lucide-react';

interface AseguradorasViewProps {
  aseguradoras: Aseguradora[];
  onAddAseguradora: (nueva: Omit<Aseguradora, 'id'>) => void;
  onUpdateAseguradora?: (aseguradoraActualizada: Aseguradora) => void;
}

export const AseguradorasView: React.FC<AseguradorasViewProps> = ({
  aseguradoras,
  onAddAseguradora,
  onUpdateAseguradora
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState<'Todas' | 'Habilitadas' | 'Inhabilitadas'>('Todas');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingAseguradora, setEditingAseguradora] = useState<Aseguradora | null>(null);

  // Form State
  const [nombre, setNombre] = useState('');
  const [cuit, setCuit] = useState('');
  const [codigoProductor, setCodigoProductor] = useState('');
  const [codigoOrganizador, setCodigoOrganizador] = useState('');
  const [telefonoSoporte, setTelefonoSoporte] = useState('');
  const [emailSuscripcion, setEmailSuscripcion] = useState('');
  const [estadoSsn, setEstadoSsn] = useState<'Habilitada' | 'Inhabilitada' | 'Bajo Observación'>('Habilitada');
  const [estado, setEstado] = useState<'Habilitada' | 'Inhabilitada'>('Habilitada');

  // Access Data State (MOD-005)
  const [linkAcceso, setLinkAcceso] = useState('');
  const [usuarioAcceso, setUsuarioAcceso] = useState('');
  const [claveAcceso, setClaveAcceso] = useState('');
  const [showFormPassword, setShowFormPassword] = useState(false);

  // Commissions by Ramo State (MOD-005)
  const [comisionesPorRamo, setComisionesPorRamo] = useState<ComisionRamo[]>([]);
  const [selectedRamoToAdd, setSelectedRamoToAdd] = useState<RamoSeguro>(LISTA_RAMOS_SEGURO[0]);
  const [porcentajeToAdd, setPorcentajeToAdd] = useState<number>(20);

  // Visibility toggle for passwords in cards
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  const togglePasswordVisibility = (id: string) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleCopy = (text: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopyFeedback(label);
    setTimeout(() => {
      setCopyFeedback(null);
    }, 2000);
  };

  const isAseguradoraHabilitada = (aseg: Aseguradora): boolean => {
    const st = (aseg.estado || '').toLowerCase();
    return st === 'habilitada' || st === 'activa';
  };

  const filteredAseguradoras = aseguradoras.filter((aseg) => {
    const isHab = isAseguradoraHabilitada(aseg);
    if (filterEstado === 'Habilitadas' && !isHab) return false;
    if (filterEstado === 'Inhabilitadas' && isHab) return false;

    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      aseg.nombre.toLowerCase().includes(term) ||
      aseg.cuit.toLowerCase().includes(term) ||
      aseg.codigoProductor.toLowerCase().includes(term) ||
      (aseg.codigoOrganizador && aseg.codigoOrganizador.toLowerCase().includes(term))
    );
  });

  const countHabilitadas = aseguradoras.filter((a) => isAseguradoraHabilitada(a)).length;
  const countInhabilitadas = aseguradoras.filter((a) => !isAseguradoraHabilitada(a)).length;

  const handleOpenCreateModal = () => {
    setEditingAseguradora(null);
    setNombre('');
    setCuit('');
    setCodigoProductor('');
    setCodigoOrganizador('');
    setTelefonoSoporte('');
    setEmailSuscripcion('');
    setEstadoSsn('Habilitada');
    setEstado('Habilitada');
    setLinkAcceso('');
    setUsuarioAcceso('');
    setClaveAcceso('');
    setShowFormPassword(false);
    // Initial standard commissions
    setComisionesPorRamo([
      { ramo: 'Automotores', porcentaje: 20 },
      { ramo: 'Combinado Familiar', porcentaje: 20 }
    ]);
    setSelectedRamoToAdd(LISTA_RAMOS_SEGURO[2]); // Integral de Comercio
    setPorcentajeToAdd(18);
    setShowModal(true);
  };

  const handleOpenEditModal = (aseg: Aseguradora) => {
    setEditingAseguradora(aseg);
    setNombre(aseg.nombre || '');
    setCuit(aseg.cuit || '');
    setCodigoProductor(aseg.codigoProductor || '');
    setCodigoOrganizador(aseg.codigoOrganizador || '');
    setTelefonoSoporte(aseg.telefonoSoporte || '');
    setEmailSuscripcion(aseg.emailSuscripcion || '');
    setEstadoSsn(aseg.estadoSsn || 'Habilitada');
    setEstado(isAseguradoraHabilitada(aseg) ? 'Habilitada' : 'Inhabilitada');
    setLinkAcceso(aseg.linkAcceso || '');
    setUsuarioAcceso(aseg.usuarioAcceso || '');
    setClaveAcceso(aseg.claveAcceso || '');
    setShowFormPassword(false);

    if (aseg.comisionesPorRamo && aseg.comisionesPorRamo.length > 0) {
      setComisionesPorRamo([...aseg.comisionesPorRamo]);
    } else if (aseg.comisionPromedio !== undefined) {
      // Create initial array from legacy ramosHabilitados or comisionPromedio
      const defaultRamos = (aseg.ramosHabilitados || ['Automotores']).map((r) => ({
        ramo: r as RamoSeguro,
        porcentaje: aseg.comisionPromedio || 18
      }));
      setComisionesPorRamo(defaultRamos);
    } else {
      setComisionesPorRamo([]);
    }

    const availableRamo = LISTA_RAMOS_SEGURO.find(
      (r) => !(aseg.comisionesPorRamo || []).some((c) => c.ramo === r)
    );
    setSelectedRamoToAdd(availableRamo || LISTA_RAMOS_SEGURO[0]);
    setPorcentajeToAdd(20);
    setShowModal(true);
  };

  const handleAddComisionRamo = () => {
    if (!selectedRamoToAdd) return;
    if (comisionesPorRamo.some((c) => c.ramo === selectedRamoToAdd)) {
      alert(`El ramo "${selectedRamoToAdd}" ya tiene una comisión configurada para esta aseguradora.`);
      return;
    }
    const pct = Number(porcentajeToAdd);
    if (isNaN(pct) || pct < 0 || pct > 100) {
      alert('Por favor ingrese un porcentaje de comisión válido entre 0% y 100%.');
      return;
    }

    setComisionesPorRamo((prev) => [...prev, { ramo: selectedRamoToAdd, porcentaje: pct }]);

    // Select next available unconfigured ramo
    const remaining = LISTA_RAMOS_SEGURO.filter(
      (r) => r !== selectedRamoToAdd && !comisionesPorRamo.some((c) => c.ramo === r)
    );
    if (remaining.length > 0) {
      setSelectedRamoToAdd(remaining[0]);
    }
  };

  const handleUpdateComisionPorcentaje = (ramo: RamoSeguro, nuevoPct: number) => {
    setComisionesPorRamo((prev) =>
      prev.map((item) => (item.ramo === ramo ? { ...item, porcentaje: nuevoPct } : item))
    );
  };

  const handleRemoveComisionRamo = (ramo: RamoSeguro) => {
    setComisionesPorRamo((prev) => prev.filter((c) => c.ramo !== ramo));
  };

  const handleToggleInhabilitacion = (aseg: Aseguradora) => {
    const isCurrentlyHab = isAseguradoraHabilitada(aseg);
    const confirmMsg = isCurrentlyHab
      ? `¿Desea inhabilitar la aseguradora "${aseg.nombre}"?\n\nLa compañía conservará todos sus datos, accesos, comisiones e historial, pero figurará inhabilitada para nuevas operaciones.`
      : `¿Desea rehabilitar la aseguradora "${aseg.nombre}"?\n\nLa compañía volverá a estar disponible con todos sus datos y comisiones configuradas.`;

    if (!window.confirm(confirmMsg)) return;

    if (onUpdateAseguradora) {
      const nuevoEstado: Aseguradora['estado'] = isCurrentlyHab ? 'Inhabilitada' : 'Habilitada';
      onUpdateAseguradora({
        ...aseg,
        estado: nuevoEstado
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !codigoProductor.trim()) {
      alert('Nombre y Código de Productor son requeridos.');
      return;
    }

    // Determine ramos habilitados from configured commissions or default
    const ramosHabilitados = comisionesPorRamo.length > 0
      ? comisionesPorRamo.map((c) => c.ramo)
      : (editingAseguradora?.ramosHabilitados || ['Automotores']);

    // Calculate representative average for backward compatibility if needed
    const avgComision = comisionesPorRamo.length > 0
      ? Number((comisionesPorRamo.reduce((acc, c) => acc + c.porcentaje, 0) / comisionesPorRamo.length).toFixed(1))
      : (editingAseguradora?.comisionPromedio || 18);

    const baseData = {
      nombre: nombre.trim(),
      cuit: cuit.trim(),
      codigoProductor: codigoProductor.trim(),
      codigoOrganizador: codigoOrganizador.trim(),
      ramosHabilitados,
      estadoSsn,
      telefonoSoporte: telefonoSoporte.trim(),
      emailSuscripcion: emailSuscripcion.trim(),
      comisionPromedio: avgComision,
      estado,
      linkAcceso: linkAcceso.trim(),
      usuarioAcceso: usuarioAcceso.trim(),
      claveAcceso: claveAcceso.trim(),
      comisionesPorRamo
    };

    if (editingAseguradora) {
      if (onUpdateAseguradora) {
        onUpdateAseguradora({
          ...editingAseguradora,
          ...baseData
        });
      }
    } else {
      onAddAseguradora(baseData);
    }

    setShowModal(false);
  };

  return (
    <div className="space-y-6">

      {/* Toast Feedback for Copy */}
      {copyFeedback && (
        <div className="fixed top-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-lg flex items-center space-x-2 border border-slate-700 animate-in fade-in slide-in-from-top-2 duration-200">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{copyFeedback} copiado al portapapeles</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-[#c7c7c7] shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-[#005a9e]" />
            <h2 className="text-lg font-bold text-slate-900">Proceso 2 · Administración de Aseguradoras</h2>
          </div>
          <p className="text-xs text-[#6d6e71] mt-0.5">
            Gestión de Compañías de Seguros, Datos de Acceso al Portal PAS y Comisiones por Ramo.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="bg-[#005a9e] hover:bg-[#007bc1] text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-all shadow-sm flex items-center space-x-2 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Nueva Aseguradora</span>
        </button>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-[#c7c7c7] shadow-xs">

        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#9e9e9e] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar aseguradora por nombre, CUIT o código PAS..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-[#c7c7c7] rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#005a9e]"
          />
        </div>

        {/* State Tabs */}
        <div className="flex items-center space-x-1 border border-[#c7c7c7] p-1 rounded-lg bg-slate-50 self-start md:self-auto">
          <button
            onClick={() => setFilterEstado('Todas')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors cursor-pointer ${
              filterEstado === 'Todas'
                ? 'bg-[#005a9e] text-white shadow-xs'
                : 'text-[#6d6e71] hover:text-slate-900'
            }`}
          >
            Todas ({aseguradoras.length})
          </button>
          <button
            onClick={() => setFilterEstado('Habilitadas')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors cursor-pointer ${
              filterEstado === 'Habilitadas'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-[#6d6e71] hover:text-slate-900'
            }`}
          >
            Habilitadas ({countHabilitadas})
          </button>
          <button
            onClick={() => setFilterEstado('Inhabilitadas')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors cursor-pointer ${
              filterEstado === 'Inhabilitadas'
                ? 'bg-slate-700 text-white shadow-xs'
                : 'text-[#6d6e71] hover:text-slate-900'
            }`}
          >
            Inhabilitadas ({countInhabilitadas})
          </button>
        </div>
      </div>

      {/* Insurers Grid */}
      {filteredAseguradoras.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#c7c7c7] p-12 text-center space-y-3">
          <Building2 className="w-10 h-10 text-[#9e9e9e] mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">No se encontraron aseguradoras</h3>
          <p className="text-xs text-[#6d6e71]">
            {searchTerm
              ? 'No hay compañías que coincidan con los criterios de búsqueda.'
              : 'No hay aseguradoras en este estado.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAseguradoras.map((aseg) => {
            const isHab = isAseguradoraHabilitada(aseg);
            const isPwVisible = !!visiblePasswords[aseg.id];
            const comisiones = aseg.comisionesPorRamo || [];

            return (
              <div
                key={aseg.id}
                className={`bg-white rounded-xl border p-5 shadow-xs flex flex-col justify-between transition-all ${
                  isHab
                    ? 'border-[#c7c7c7] hover:border-[#005a9e]/50'
                    : 'border-slate-300 bg-slate-50/70 opacity-90'
                }`}
              >
                <div className="space-y-4">

                  {/* Card Header & Status Badges */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-[#007bc1] bg-[#005a9e]/10 px-2 py-0.5 rounded">
                          CUIT: {aseg.cuit || 'S/D'}
                        </span>
                        <h3 className="text-base font-bold text-slate-900 mt-1 leading-snug">
                          {aseg.nombre}
                        </h3>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        {/* Estado Operativo AVISAME */}
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1 ${
                            isHab
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-slate-200 text-slate-700 border border-slate-300'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isHab ? 'bg-emerald-500' : 'bg-slate-500'}`} />
                          <span>{isHab ? 'Habilitada' : 'Inhabilitada'}</span>
                        </span>

                        {/* Estado SSN */}
                        <span className="bg-slate-100 text-slate-600 text-[9px] font-semibold px-2 py-0.5 rounded flex items-center space-x-1 border border-slate-200">
                          <ShieldCheck className="w-2.5 h-2.5 text-[#005a9e]" />
                          <span>SSN: {aseg.estadoSsn || 'Habilitada'}</span>
                        </span>
                      </div>
                    </div>

                    {/* Producer & Organizer Codes */}
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-[#c7c7c7] grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[10px] text-[#6d6e71] block">Código PAS:</span>
                        <span className="font-bold text-slate-900 font-mono text-xs">{aseg.codigoProductor}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#6d6e71] block">Organizador:</span>
                        <span className="font-bold text-slate-900 font-mono text-xs">
                          {aseg.codigoOrganizador || '—'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Acceso al Sistema de la Compañía (MOD-005) */}
                  <div className="bg-blue-50/40 p-3 rounded-lg border border-blue-100 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#005a9e] uppercase tracking-wider flex items-center space-x-1">
                        <Lock className="w-3 h-3" />
                        <span>Acceso al Sistema / Portal PAS</span>
                      </span>

                      {aseg.linkAcceso && (
                        <a
                          href={aseg.linkAcceso.startsWith('http') ? aseg.linkAcceso : `https://${aseg.linkAcceso}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-[#005a9e] hover:text-[#007bc1] font-bold flex items-center space-x-0.5 hover:underline"
                          title="Abrir portal en nueva pestaña"
                        >
                          <span>Ir al Portal</span>
                          <ExternalLink className="w-3 h-3 ml-0.5" />
                        </a>
                      )}
                    </div>

                    <div className="space-y-1.5 pt-1">
                      {/* Usuario */}
                      <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded border border-blue-100/80">
                        <div className="flex items-center space-x-1.5 min-w-0">
                          <User className="w-3.5 h-3.5 text-[#6d6e71] shrink-0" />
                          <span className="text-[11px] text-[#6d6e71]">Usuario:</span>
                          <span className="font-mono font-bold text-slate-900 text-[11px] truncate">
                            {aseg.usuarioAcceso || 'No configurado'}
                          </span>
                        </div>
                        {aseg.usuarioAcceso && (
                          <button
                            type="button"
                            onClick={() => handleCopy(aseg.usuarioAcceso || '', 'Usuario')}
                            className="p-1 text-[#6d6e71] hover:text-[#005a9e] rounded transition-colors cursor-pointer"
                            title="Copiar usuario"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        )}
                      </div>

                      {/* Clave */}
                      <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded border border-blue-100/80">
                        <div className="flex items-center space-x-1.5 min-w-0">
                          <Key className="w-3.5 h-3.5 text-[#6d6e71] shrink-0" />
                          <span className="text-[11px] text-[#6d6e71]">Clave:</span>
                          <span className="font-mono font-bold text-slate-900 text-[11px] truncate">
                            {aseg.claveAcceso
                              ? (isPwVisible ? aseg.claveAcceso : '••••••••••••')
                              : 'No configurada'}
                          </span>
                        </div>
                        {aseg.claveAcceso && (
                          <div className="flex items-center space-x-1">
                            <button
                              type="button"
                              onClick={() => togglePasswordVisibility(aseg.id)}
                              className="p-1 text-[#6d6e71] hover:text-[#005a9e] rounded transition-colors cursor-pointer"
                              title={isPwVisible ? 'Ocultar clave' : 'Ver clave'}
                            >
                              {isPwVisible ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleCopy(aseg.claveAcceso || '', 'Clave')}
                              className="p-1 text-[#6d6e71] hover:text-[#005a9e] rounded transition-colors cursor-pointer"
                              title="Copiar clave"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Comisiones por Ramo (MOD-005) */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#6d6e71] uppercase tracking-wider flex items-center space-x-1">
                        <Percent className="w-3 h-3 text-[#005a9e]" />
                        <span>Comisión que Paga por Ramo</span>
                      </span>
                      <span className="text-[9px] text-[#9e9e9e]">
                        {comisiones.length} {comisiones.length === 1 ? 'ramo' : 'ramos'}
                      </span>
                    </div>

                    {comisiones.length > 0 ? (
                      <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                        {comisiones.map((c) => (
                          <div
                            key={c.ramo}
                            className="flex items-center justify-between bg-slate-50 px-2.5 py-1 rounded border border-slate-200 text-xs"
                          >
                            <span className="text-[11px] text-slate-700 truncate mr-2">{c.ramo}</span>
                            <span className="font-mono font-bold text-[#005a9e] text-xs bg-white px-2 py-0.5 rounded border border-[#005a9e]/20 shrink-0">
                              {c.porcentaje}%
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-amber-50/60 p-2 rounded border border-amber-200 text-[11px] text-amber-800">
                        <span>Sin comisiones por ramo detalladas.</span>
                        {aseg.comisionPromedio !== undefined && (
                          <span className="font-bold ml-1">Comisión Base: {aseg.comisionPromedio}%</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Contacts */}
                  <div className="pt-2 border-t border-slate-100 text-xs text-[#6d6e71] space-y-1">
                    {aseg.telefonoSoporte && (
                      <div className="flex items-center space-x-2">
                        <Phone className="w-3.5 h-3.5 text-[#005a9e] shrink-0" />
                        <span className="truncate">{aseg.telefonoSoporte}</span>
                      </div>
                    )}
                    {aseg.emailSuscripcion && (
                      <div className="flex items-center space-x-2">
                        <Mail className="w-3.5 h-3.5 text-[#007bc1] shrink-0" />
                        <span className="truncate">{aseg.emailSuscripcion}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(aseg)}
                    className="flex-1 py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition-colors flex items-center justify-center space-x-1.5 border border-slate-300 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#005a9e]" />
                    <span>Editar</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleInhabilitacion(aseg)}
                    className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-colors flex items-center justify-center space-x-1 border cursor-pointer ${
                      isHab
                        ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                    }`}
                    title={isHab ? 'Inhabilitar aseguradora' : 'Rehabilitar aseguradora'}
                  >
                    {isHab ? (
                      <>
                        <Ban className="w-3.5 h-3.5" />
                        <span>Inhabilitar</span>
                      </>
                    ) : (
                      <>
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Rehabilitar</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Alta / Edición de Aseguradora */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl border border-[#c7c7c7] shadow-xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] flex flex-col">

            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <div className="flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-[#005a9e]" />
                <h3 className="text-base font-bold text-slate-900">
                  {editingAseguradora ? 'Editar Aseguradora (Proceso 2)' : 'Alta de Aseguradora (Proceso 2)'}
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-[#9e9e9e] hover:text-slate-900 font-bold text-lg cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto pr-1 flex-1 text-xs">

              {/* Sección 1: Datos Principales */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#005a9e] border-b border-slate-100 pb-1">
                  1. Datos Generales de la Compañía
                </h4>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nombre o Razón Social *</label>
                  <input
                    type="text"
                    placeholder="Ej: Mapfre Seguros, San Cristóbal Seguros, etc."
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#005a9e]"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                    <label className="font-bold text-slate-700 block mb-1">Código Productor (PAS) *</label>
                    <input
                      type="text"
                      placeholder="PAS-12345"
                      value={codigoProductor}
                      onChange={(e) => setCodigoProductor(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg font-mono"
                      required
                    />
                  </div>

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
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                    <label className="font-bold text-slate-700 block mb-1">Email Suscripción / Comercial</label>
                    <input
                      type="email"
                      placeholder="emision@aseguradora.com.ar"
                      value={emailSuscripcion}
                      onChange={(e) => setEmailSuscripcion(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Estado Habilitante SSN</label>
                    <select
                      value={estadoSsn}
                      onChange={(e) => setEstadoSsn(e.target.value as any)}
                      className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg"
                    >
                      <option value="Habilitada">Habilitada por SSN</option>
                      <option value="Bajo Observación">Bajo Observación</option>
                      <option value="Inhabilitada">Inhabilitada por SSN</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Estado Operativo en Cartera</label>
                    <select
                      value={estado}
                      onChange={(e) => setEstado(e.target.value as any)}
                      className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg font-bold"
                    >
                      <option value="Habilitada">Habilitada (Activa para emisiones)</option>
                      <option value="Inhabilitada">Inhabilitada (Pausada para nuevas operaciones)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Sección 2: Datos de Acceso al Sistema de la Aseguradora (MOD-005) */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#005a9e] flex items-center space-x-1">
                    <Lock className="w-3.5 h-3.5" />
                    <span>2. Datos de Acceso al Sistema de la Aseguradora</span>
                  </h4>
                  <span className="text-[10px] text-[#6d6e71]">Credenciales del portal web</span>
                </div>

                <div className="bg-blue-50/40 p-3 rounded-lg border border-blue-100 space-y-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Link de Acceso (Portal / Autogestión)</label>
                    <input
                      type="text"
                      placeholder="https://portal.aseguradora.com.ar/pas"
                      value={linkAcceso}
                      onChange={(e) => setLinkAcceso(e.target.value)}
                      className="w-full p-2 bg-white border border-[#c7c7c7] rounded-lg font-mono text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Usuario de Acceso</label>
                      <input
                        type="text"
                        placeholder="Ej: PAS12345 o usuario@aseguradora.com"
                        value={usuarioAcceso}
                        onChange={(e) => setUsuarioAcceso(e.target.value)}
                        className="w-full p-2 bg-white border border-[#c7c7c7] rounded-lg font-mono"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Clave de Acceso</label>
                      <div className="relative">
                        <input
                          type={showFormPassword ? 'text' : 'password'}
                          placeholder="Contraseña del portal de la compañía"
                          value={claveAcceso}
                          onChange={(e) => setClaveAcceso(e.target.value)}
                          className="w-full p-2 pr-9 bg-white border border-[#c7c7c7] rounded-lg font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => setShowFormPassword(!showFormPassword)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-[#6d6e71] hover:text-slate-900 p-1 cursor-pointer"
                        >
                          {showFormPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sección 3: Comisiones por Ramo (MOD-005) */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#005a9e] flex items-center space-x-1">
                    <Percent className="w-3.5 h-3.5" />
                    <span>3. Comisiones que Paga la Aseguradora por Ramo</span>
                  </h4>
                  <span className="text-[10px] text-[#6d6e71]">Porcentaje pactado por ramo</span>
                </div>

                <div className="space-y-2">
                  {/* Lista de comisiones actuales */}
                  {comisionesPorRamo.length === 0 ? (
                    <div className="p-3 bg-slate-50 border border-dashed border-slate-300 rounded-lg text-center text-[#6d6e71]">
                      No hay comisiones por ramo configuradas aún. Agregue al menos un ramo abajo.
                    </div>
                  ) : (
                    <div className="border border-[#c7c7c7] rounded-lg overflow-hidden divide-y divide-slate-200">
                      <div className="bg-slate-100 px-3 py-1.5 grid grid-cols-12 gap-2 text-[10px] font-bold text-[#6d6e71] uppercase">
                        <span className="col-span-7">Ramo</span>
                        <span className="col-span-4">Comisión que paga (%)</span>
                        <span className="col-span-1 text-center">Acción</span>
                      </div>
                      {comisionesPorRamo.map((c) => (
                        <div key={c.ramo} className="px-3 py-2 grid grid-cols-12 gap-2 items-center bg-white">
                          <span className="col-span-7 font-bold text-slate-800 truncate">{c.ramo}</span>
                          <div className="col-span-4 flex items-center space-x-1">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              step="0.5"
                              value={c.porcentaje}
                              onChange={(e) => handleUpdateComisionPorcentaje(c.ramo, Number(e.target.value))}
                              className="w-20 p-1 bg-slate-50 border border-[#c7c7c7] rounded text-xs font-mono font-bold text-[#005a9e] text-right"
                            />
                            <span className="text-slate-600 font-bold">%</span>
                          </div>
                          <div className="col-span-1 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveComisionRamo(c.ramo)}
                              className="text-rose-600 hover:text-rose-800 p-1 rounded hover:bg-rose-50 cursor-pointer"
                              title="Eliminar comisión para este ramo"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Fila para agregar un nuevo ramo */}
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-[#c7c7c7] flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <div className="flex-1">
                      <label className="text-[10px] font-bold text-[#6d6e71] block mb-0.5">Ramo a incorporar:</label>
                      <select
                        value={selectedRamoToAdd}
                        onChange={(e) => setSelectedRamoToAdd(e.target.value as RamoSeguro)}
                        className="w-full p-1.5 bg-white border border-[#c7c7c7] rounded text-xs"
                      >
                        {LISTA_RAMOS_SEGURO.map((r) => (
                          <option
                            key={r}
                            value={r}
                            disabled={comisionesPorRamo.some((c) => c.ramo === r)}
                          >
                            {r} {comisionesPorRamo.some((c) => c.ramo === r) ? '(Ya configurado)' : ''}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="w-full sm:w-28">
                      <label className="text-[10px] font-bold text-[#6d6e71] block mb-0.5">Comisión %:</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.5"
                        placeholder="20"
                        value={porcentajeToAdd}
                        onChange={(e) => setPorcentajeToAdd(Number(e.target.value))}
                        className="w-full p-1.5 bg-white border border-[#c7c7c7] rounded text-xs font-mono font-bold"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleAddComisionRamo}
                      className="mt-auto py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold transition-colors flex items-center justify-center space-x-1 cursor-pointer shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Añadir Ramo</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Botones de Acción Modal */}
              <div className="pt-4 border-t border-slate-200 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-[#c7c7c7] text-[#6d6e71] rounded-lg hover:bg-slate-50 cursor-pointer font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#005a9e] text-white font-bold rounded-lg hover:bg-[#007bc1] shadow-sm cursor-pointer"
                >
                  {editingAseguradora ? 'Guardar Cambios' : 'Guardar Aseguradora'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
