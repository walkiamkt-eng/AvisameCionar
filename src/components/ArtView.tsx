import React, { useState } from 'react';
import { ContratoART, Cliente, Aseguradora } from '../types';
import { ciiuCatalog } from '../data/ciiu';
import { validateCuitCuil } from '../utils/clienteValidations';
import jsPDF from 'jspdf';
import {
  Briefcase,
  Plus,
  AlertCircle,
  Clock,
  CheckCircle2,
  RotateCcw,
  Search,
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
  const [searchTerm, setSearchTerm] = useState('');
  const [aseguradoraFilter, setAseguradoraFilter] = useState<string>('Todas');

  const [showModal, setShowModal] = useState(false);
  const [editingContrato, setEditingContrato] = useState<ContratoART | null>(null);
  const [showRenewalModal, setShowRenewalModal] = useState<ContratoART | null>(null);
  const [altaError, setAltaError] = useState<string | null>(null);

  // Form State for Alta / Modificación de Contrato ART
  const [empresaClienteId, setEmpresaClienteId] = useState(clientes[0]?.id || '');
  const [artAseguradoraId, setArtAseguradoraId] = useState(aseguradoras[0]?.id || '');
  const [numContrato, setNumContrato] = useState('');
  const [ciiu, setCiiu] = useState('602300');
  const [actividad, setActividad] = useState('Servicios de Transporte Automotor de Cargas Generales');
  const [ciiuSearch, setCiiuSearch] = useState('');
  const [showCiiuResults, setShowCiiuResults] = useState(false);
  const [masaSalarial, setMasaSalarial] = useState<number>(35000000);
  const [trabajadores, setTrabajadores] = useState<number>(25);
  const [alicuotaFija, setAlicuotaFija] = useState<number>(850);
  const [alicuotaVar, setAlicuotaVar] = useState<number>(3.0);
  const [fechaInicio, setFechaInicio] = useState('2026-01-01');
  const [fechaFin, setFechaFin] = useState('2027-01-01');

  // Form State for Renovación de Contrato ART
  const [renovacionFechaInicio, setRenovacionFechaInicio] = useState('');
  const [renovacionFechaFin, setRenovacionFechaFin] = useState('');
  const [renewalError, setRenewalError] = useState<string | null>(null);

  const getCliente = (id: string) => clientes.find((c) => c.id === id);
  const getAseguradora = (id: string) => aseguradoras.find((a) => a.id === id);
  const ciiuResults = ciiuCatalog.filter((item) => {
  const search = ciiuSearch.trim().toLowerCase();

  if (!search) return false;

  return (
    item.codigo.toLowerCase().includes(search) ||
    item.descripcion.toLowerCase().includes(search)
  );
}).slice(0, 20);

const handleSelectCiiu = (codigo: string) => {
  const item = ciiuCatalog.find((c) => c.codigo === codigo);

  if (!item) return;

  setCiiu(item.codigo);
  setActividad(item.descripcion);
  setCiiuSearch('');
  setShowCiiuResults(false);
  setAltaError(null);
};

  const handleGenerarDatosContrato = (art: ContratoART) => {
    const doc = new jsPDF();

    const cliente = getCliente(art.clienteId);
    const aseguradora = getAseguradora(art.aseguradoraId);

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 18;
    const contentWidth = pageWidth - margin * 2;

    let y = 18;

    const addSectionTitle = (title: string) => {
      doc.setFillColor(0, 90, 158);
      doc.rect(margin, y, contentWidth, 8, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text(title, margin + 4, y + 5.5);

      y += 13;
      doc.setTextColor(35, 45, 55);
    };

    const addField = (
      label: string,
      value: string,
      x: number,
      width: number
    ) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(110, 110, 110);
      doc.text(label.toUpperCase(), x, y);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(35, 45, 55);

      const lines = doc.splitTextToSize(value || '—', width);
      doc.text(lines, x, y + 5);

      return Math.max(10, lines.length * 4 + 6);
    };

    // Encabezado
    doc.setFillColor(0, 90, 158);
    doc.rect(0, 0, pageWidth, 32, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('AVISAME', margin, 14);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('Administración de Seguros', margin, 21);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('DOCUMENTO DE CONTRATO ART', pageWidth - margin, 15, {
      align: 'right'
    });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.text('Riesgos del Trabajo — Ley 24.557', pageWidth - margin, 21, {
      align: 'right'
    });

    y = 43;

    // Identificación
    doc.setTextColor(35, 45, 55);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    doc.text('CONTRATO DE RIESGOS DEL TRABAJO', margin, y);

    y += 8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(110, 110, 110);
    doc.text(
      `Documento generado el ${new Date().toLocaleDateString('es-AR')}`,
      margin,
      y
    );

    y += 10;

    addSectionTitle('IDENTIFICACIÓN DEL CONTRATO');

    const rowHeight = 15;

    addField(
      'N° Contrato',
      art.numeroContrato,
      margin,
      contentWidth / 2 - 4
    );

    addField(
      'Aseguradora ART',
      aseguradora?.nombre || 'Aseguradora no identificada',
      margin + contentWidth / 2,
      contentWidth / 2
    );

    y += rowHeight;

    addSectionTitle('EMPLEADOR / TITULAR');

    addField(
      'Razón Social / Nombre',
      cliente?.nombreRazonSocial || 'Empleador no identificado',
      margin,
      contentWidth
    );

    y += rowHeight;

    addField(
      'CUIT',
      cliente?.cuitCuilDni || 'Sin CUIT registrado',
      margin,
      contentWidth
    );

    y += rowHeight;

    addSectionTitle('ACTIVIDAD');

    addField(
      'Código CIIU',
      art.ciiuActividad || '—',
      margin,
      contentWidth / 3 - 4
    );

    addField(
      'Descripción',
      art.descripcionActividad || '—',
      margin + contentWidth / 3,
      (contentWidth * 2) / 3
    );

    y += rowHeight;

    addSectionTitle('VIGENCIA');

    addField(
      'Fecha de inicio',
      art.fechaInicioContrato || '—',
      margin,
      contentWidth / 2 - 4
    );

    addField(
      'Fecha de fin',
      art.fechaFinContrato || 'Sin fecha informada',
      margin + contentWidth / 2,
      contentWidth / 2
    );

    y += rowHeight;

    addSectionTitle('INFORMACIÓN LABORAL Y ECONÓMICA');

    addField(
      'Cantidad de trabajadores',
      `${art.cantidadTrabajadores} empleados`,
      margin,
      contentWidth / 3 - 4
    );

    addField(
      'Masa salarial estimada',
      `$${art.masaSalarialEstimada.toLocaleString('es-AR')}`,
      margin + contentWidth / 3,
      contentWidth / 3 - 4
    );

    addField(
      'Alícuota',
      `$${art.alicuotaFija} + ${art.alicuotaVariable.toLocaleString('es-AR', { minimumFractionDigits: 3, maximumFractionDigits: 3 })}%`,
      margin + (contentWidth * 2) / 3,
      contentWidth / 3
    );

    y += rowHeight;

    addSectionTitle('PERMANENCIA Y TRASPASO');

    addField(
      'Permanencia',
      `${art.mesesPermanencia || 0} meses`,
      margin,
      contentWidth / 2 - 4
    );

    addField(
      'Estado de traspaso',
      art.esElegibleTraspaso
        ? 'Elegible para traspaso'
        : 'Aún no cumple los 12 meses',
      margin + contentWidth / 2,
      contentWidth / 2
    );

    y += rowHeight;

    addSectionTitle('RENOVACIÓN');

    addField(
      'Última renovación',
      art.fechaUltimaRenovacion
        ? new Date(art.fechaUltimaRenovacion).toLocaleString('es-AR')
        : 'Sin renovaciones previas',
      margin,
      contentWidth
    );

    // Pie
    const pageHeight = doc.internal.pageSize.getHeight();

    doc.setDrawColor(210, 210, 210);
    doc.line(margin, pageHeight - 20, pageWidth - margin, pageHeight - 20);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(120, 120, 120);

    doc.text(
      'Documento informativo generado por AVISAME.',
      margin,
      pageHeight - 14
    );

    doc.text(
      `Contrato ${art.numeroContrato}`,
      pageWidth - margin,
      pageHeight - 14,
      { align: 'right' }
    );

    // Abrir en una nueva pestaña
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');
  };
  const contratosPorAseguradora = aseguradoras
    .map((aseguradora) => ({
      ...aseguradora,
      cantidadContratos: contratosArt.filter(
        (contrato) => contrato.aseguradoraId === aseguradora.id
      ).length
    }))
    .filter((aseguradora) => aseguradora.cantidadContratos > 0);
  const filteredContratosArt = contratosArt.filter((art) => {
    const cliente = getCliente(art.clienteId);
    const aseguradora = getAseguradora(art.aseguradoraId);

    const search = searchTerm.trim().toLowerCase();

    const matchesSearch =
      !search ||
      art.numeroContrato.toLowerCase().includes(search) ||
      (cliente?.nombreRazonSocial || '').toLowerCase().includes(search) ||
      (cliente?.cuitCuilDni || '').toLowerCase().includes(search) ||
      (aseguradora?.nombre || '').toLowerCase().includes(search) ||
      (art.ciiuActividad || '').toLowerCase().includes(search) ||
      (art.descripcionActividad || '').toLowerCase().includes(search);

    const matchesAseguradora =
      aseguradoraFilter === 'Todas' ||
      art.aseguradoraId === aseguradoraFilter;

    return matchesSearch && matchesAseguradora;
  });

  const handleOpenAlta = () => {
    setEditingContrato(null);
    setEmpresaClienteId(clientes[0]?.id || '');
    setArtAseguradoraId(aseguradoras[0]?.id || '');
    setNumContrato('');
    setCiiu('602300');
    setActividad('Servicios de Transporte Automotor de Cargas Generales');
    setCiiuSearch('');
    setShowCiiuResults(false);
    setMasaSalarial(35000000);
    setTrabajadores(25);
    setAlicuotaFija(850);
    setAlicuotaVar(3.0);
    setFechaInicio('2026-01-01');
    setFechaFin('2027-01-01');
    setAltaError(null);
    setShowModal(true);
  };

  const handleOpenModificar = (art: ContratoART) => {
    setEditingContrato(art);
    setEmpresaClienteId(art.clienteId);
    setArtAseguradoraId(art.aseguradoraId);
    setNumContrato(art.numeroContrato);
    setCiiu(art.ciiuActividad || '');
    setActividad(art.descripcionActividad || '');
    setCiiuSearch('');
    setShowCiiuResults(false);  
    setMasaSalarial(art.masaSalarialEstimada);
    setTrabajadores(art.cantidadTrabajadores);
    setAlicuotaFija(art.alicuotaFija);
    setAlicuotaVar(art.alicuotaVariable);
    setFechaInicio(art.fechaInicioContrato);
    setFechaFin(art.fechaFinContrato || '');
    setAltaError(null);
    setShowModal(true);
  };

  const handleAltaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAltaError(null);

    if (!numContrato.trim()) {
      setAltaError('El número de contrato ART es obligatorio.');
      return;
    }

    const selectedCliente = getCliente(empresaClienteId);

    if (!selectedCliente) {
      setAltaError('Debe seleccionar un Empleador / Cliente titular del contrato.');
      return;
    }

    const cuitTitularRaw = selectedCliente.cuitCuilDni || '';
    const cleanCuitTitular = cuitTitularRaw.replace(/\D/g, '');

    const cuitValidation = validateCuitCuil(cleanCuitTitular);

    if (!cuitValidation.isValid) {
      setAltaError(
        `El CUIT del titular "${selectedCliente.nombreRazonSocial}" es inválido: ${
          cuitValidation.error ||
          'Debe ser un CUIT argentino válido de 11 dígitos con dígito verificador correcto'
        }. Corrija el documento del cliente antes de registrar el contrato ART.`
      );
      return;
    }

    const contratoExistentePorCuit = contratosArt.find((art) => {
      if (editingContrato && art.id === editingContrato.id) {
        return false;
      }

      const clienteDeContrato = getCliente(art.clienteId);

      if (!clienteDeContrato || !clienteDeContrato.cuitCuilDni) {
        return false;
      }

      const cleanCuitExistente =
        clienteDeContrato.cuitCuilDni.replace(/\D/g, '');

      return cleanCuitExistente === cleanCuitTitular;
    });

    if (contratoExistentePorCuit) {
      const clienteExistente = getCliente(
        contratoExistentePorCuit.clienteId
      );

      setAltaError(
        `El CUIT titular ${cuitTitularRaw} (${selectedCliente.nombreRazonSocial}) ya posee un contrato ART registrado en el sistema (Contrato N° ${contratoExistentePorCuit.numeroContrato} - ${
          clienteExistente?.nombreRazonSocial || 'Titular'
        }). Solo se permite un único contrato ART por CUIT de titular.`
      );
      return;
    }

    const datosContrato = {
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
      fechaFinContrato: fechaFin
    };

    if (editingContrato) {
      const contratoActualizado: ContratoART = {
        ...editingContrato,
        ...datosContrato
      };

      onUpdateContratoArt(contratoActualizado);
      setEditingContrato(null);
    } else {
      onAddContratoArt({
        ...datosContrato,
        clausulasNoRepeticion: []
      });
    }

    setNumContrato('');
    setAltaError(null);
    setShowModal(false);
  };

  const handleOpenRenovar = (art: ContratoART) => {
    setShowRenewalModal(art);
    setRenovacionFechaInicio(
      art.fechaFinContrato || art.fechaInicioContrato
    );
    setRenovacionFechaFin('');
    setRenewalError(null);
  };

  const handleRenewalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRenewalError(null);

    if (!showRenewalModal) {
      setRenewalError(
        'No se ha seleccionado ningún contrato para renovar.'
      );
      return;
    }

    if (!renovacionFechaInicio) {
      setRenewalError(
        'Debe ingresar la fecha de inicio de la nueva vigencia.'
      );
      return;
    }

    if (!renovacionFechaFin) {
      setRenewalError(
        'Debe ingresar la fecha de fin de la nueva vigencia.'
      );
      return;
    }

    if (renovacionFechaFin <= renovacionFechaInicio) {
      setRenewalError(
        'La fecha de fin debe ser posterior a la fecha de inicio.'
      );
      return;
    }

    const fechaIniOriginal = new Date(
      showRenewalModal.fechaInicioContrato
    );

    const now = new Date();

    const meses = Math.floor(
      (now.getTime() - fechaIniOriginal.getTime()) /
        (1000 * 3600 * 24 * 30.44)
    );

    const esElegible = meses >= 12;

    const contratoActualizado: ContratoART = {
      ...showRenewalModal,
      fechaInicioContrato:
        showRenewalModal.fechaInicioContrato,
      fechaFinContrato: renovacionFechaFin,
      fechaUltimaRenovacion: new Date().toISOString(),
      mesesPermanencia: meses > 0 ? meses : 0,
      esElegibleTraspaso: esElegible
    };

    onUpdateContratoArt(contratoActualizado);
    setShowRenewalModal(null);
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-[#c7c7c7] shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <Briefcase className="w-5 h-5 text-[#005a9e]" />
            <h2 className="text-lg font-bold text-slate-900">
              Proceso 5 · Administración de ART (Ley 24.557)
            </h2>
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

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-[#c7c7c7]">

        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#9e9e9e]" />

          <input
            type="text"
            placeholder="Buscar contrato, empleador, CUIT, ART, CIIU o actividad..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-[#c7c7c7] rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#005a9e] text-slate-800"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto text-xs overflow-x-auto pb-1 sm:pb-0">
          <span className="text-[#6d6e71] font-bold whitespace-nowrap">
            ART:
          </span>

          {[
            { id: 'Todas', nombre: 'Todas' },
            ...aseguradoras.map((a) => ({
              id: a.id,
              nombre: a.nombre
            }))
          ].map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => setAseguradoraFilter(a.id)}
              className={`px-3 py-1 rounded-md font-medium transition-all whitespace-nowrap ${
                aseguradoraFilter === a.id
                  ? 'bg-[#005a9e] text-white shadow-sm'
                  : 'bg-white border border-[#c7c7c7] text-[#6d6e71] hover:border-[#007bc1] hover:text-[#005a9e]'
              }`}
            >
              {a.nombre}
            </button>
          ))}
        </div>
      </div>

      {/* Contracts Table */}
      <div className="bg-white rounded-xl border border-[#c7c7c7] shadow-xs overflow-hidden">

        <div className="p-3 bg-slate-50 border-b border-[#c7c7c7] text-xs font-bold text-[#6d6e71] flex justify-between items-center">
          <span>
            Contratos ART Registrados ({filteredContratosArt.length})
          </span>

          <span className="font-mono text-[#005a9e]">
            Supervisión Ley 24.557
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-800 min-w-[1250px]">

            <thead className="bg-slate-100/70 border-b border-[#c7c7c7] text-[#6d6e71] font-bold uppercase text-[10px]">
              <tr>
                <th className="p-3">N° Contrato</th>
                <th className="p-3">Empleador / CUIT</th>
                <th className="p-3">Aseguradora ART</th>
                <th className="p-3">CIIU / Actividad</th>
                <th className="p-3">Vigencia Técnica</th>
                <th className="p-3 text-right">Nómina</th>
                <th className="p-3 text-right">Masa Salarial</th>
                <th className="p-3 text-right">Alícuota</th>
                <th className="p-3 text-center">Permanencia</th>
                <th className="p-3 text-center">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 font-medium">

              {filteredContratosArt.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    className="p-8 text-center text-[#9e9e9e]"
                  >
                    No se encontraron contratos ART registrados que coincidan con la búsqueda.
                  </td>
                </tr>
              ) : (
                filteredContratosArt.map((art) => {
                  const cliente = getCliente(art.clienteId);
                  const aseguradora = getAseguradora(art.aseguradoraId);

                  return (
                    <tr
                      key={art.id}
                      className="hover:bg-slate-50 transition-colors"
                    >

                      {/* Contrato */}
                      <td className="p-3">
                        <span className="font-bold font-mono text-slate-900 block">
                          {art.numeroContrato}
                        </span>

                        {art.fechaUltimaRenovacion && (
                          <span className="text-[10px] text-[#9e9e9e] font-mono block mt-0.5">
                            Renovado:{' '}
                            {new Date(
                              art.fechaUltimaRenovacion
                            ).toLocaleDateString('es-AR')}
                          </span>
                        )}
                      </td>

                      {/* Empleador */}
                      <td className="p-3 max-w-[220px]">
                        <span
                          className="font-bold text-slate-900 block truncate"
                          title={cliente?.nombreRazonSocial || 'Empleador'}
                        >
                          {cliente?.nombreRazonSocial || 'Empleador'}
                        </span>

                        <span className="text-[10px] text-[#9e9e9e] font-mono block">
                          CUIT: {cliente?.cuitCuilDni || '(Sin CUIT)'}
                        </span>
                      </td>

                      {/* ART */}
                      <td className="p-3">
                        <span className="font-semibold text-[#005a9e] block max-w-[150px] truncate">
                          {aseguradora?.nombre || 'Aseguradora'}
                        </span>
                      </td>

                      {/* Actividad */}
                      <td
                        className="p-3 max-w-[240px]"
                        title={`${art.ciiuActividad || ''} - ${art.descripcionActividad || ''}`}
                      >
                        <span className="font-mono font-semibold text-slate-800 block">
                          {art.ciiuActividad || '—'}
                        </span>

                        <span className="text-[10px] text-[#6d6e71] block truncate">
                          {art.descripcionActividad || '—'}
                        </span>
                      </td>

                      {/* Vigencia */}
                      <td className="p-3 text-[11px] font-mono text-[#6d6e71] whitespace-nowrap">
                        <span className="block text-slate-800">
                          {art.fechaInicioContrato}
                        </span>

                        <span className="text-[#9e9e9e]">
                          al {art.fechaFinContrato || 'S/D'}
                        </span>
                      </td>

                      {/* Nómina */}
                      <td className="p-3 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                        {art.cantidadTrabajadores}
                        <span className="text-[10px] text-[#9e9e9e] ml-1">
                          emp.
                        </span>
                      </td>

                      {/* Masa Salarial */}
                      <td className="p-3 text-right font-mono font-bold text-[#005a9e] whitespace-nowrap">
                        ${art.masaSalarialEstimada.toLocaleString('es-AR')}
                      </td>

                      {/* Alícuota */}
                      <td className="p-3 text-right whitespace-nowrap">
                        <span className="font-mono font-bold text-[#005a9e] text-base block">
                          {art.alicuotaVariable.toLocaleString('es-AR', { minimumFractionDigits: 3, maximumFractionDigits: 3 })}%
                        </span>

                        <span className="text-[10px] text-[#6d6e71] font-mono block">
                          Fija: ${art.alicuotaFija}
                        </span>
                      </td>
                      {/* Permanencia */}
                      <td className="p-3 text-center">

                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${
                            art.esElegibleTraspaso
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {art.mesesPermanencia || 0} meses
                        </span>

                        {art.esElegibleTraspaso ? (
                          <span className="text-[9px] text-emerald-700 font-bold block mt-1">
                            Elegible traspaso
                          </span>
                        ) : (
                          <span className="text-[9px] text-[#9e9e9e] block mt-1">
                            Requiere 12 meses
                          </span>
                        )}

                      </td>

                      {/* Acciones */}
                      <td className="p-3 text-center">
                        <div className="flex flex-col gap-1.5 min-w-[130px]">
                           <button
                            type="button"
                            onClick={() => handleGenerarDatosContrato(art)}
                            className="bg-slate-100 hover:bg-[#005a9e] hover:text-white text-[#005a9e] text-[10px] font-bold py-1.5 px-2 rounded-lg transition-all flex items-center justify-center space-x-1 border border-[#c7c7c7] cursor-pointer"
                          >
                            <Info className="w-3.5 h-3.5" />
                            <span>Datos Contrato</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenModificar(art)}
                            className="bg-slate-100 hover:bg-[#005a9e] hover:text-white text-[#005a9e] text-[10px] font-bold py-1.5 px-2 rounded-lg transition-all flex items-center justify-center space-x-1 border border-[#c7c7c7] cursor-pointer"
                          >
                            <Info className="w-3.5 h-3.5" />
                            <span>Modificar</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenRenovar(art)}
                            className="bg-slate-100 hover:bg-[#005a9e] hover:text-white text-[#005a9e] text-[10px] font-bold py-1.5 px-2 rounded-lg transition-all flex items-center justify-center space-x-1 border border-[#c7c7c7] cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Renovar</span>
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

            {/* Resumen de contratos por aseguradora */}
      {contratosPorAseguradora.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {contratosPorAseguradora.map((aseguradora) => (
            <div
              key={aseguradora.id}
              className="bg-white rounded-xl border border-[#c7c7c7] shadow-xs p-4"
            >
              <span className="text-[10px] font-bold text-[#6d6e71] uppercase tracking-wider block">
                Nombre de la aseguradora
              </span>

              <span className="text-sm font-bold text-[#005a9e] block mt-1">
                {aseguradora.nombre}
              </span>

              <span className="text-[10px] font-bold text-[#6d6e71] uppercase tracking-wider block mt-3">
                Cantidad de contratos
              </span>

              <span className="text-xl font-bold text-slate-900 block mt-1">
                {aseguradora.cantidadContratos}
              </span>
            </div>
          ))}
        </div>
      )}

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
                ×
              </button>
            </div>

            <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg flex items-start space-x-2 text-xs text-slate-700">
              <Info className="w-4 h-4 text-[#005a9e] flex-shrink-0 mt-0.5" />

              <p>
                La renovación actualiza las fechas de vigencia del contrato manteniendo el mismo número y conservando como referencia los datos registrados al momento del alta.
              </p>
            </div>

            <div className="space-y-2">

              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                Datos de Referencia del Contrato (No Modificables)
              </span>

              <div className="p-3 bg-slate-50 border border-[#c7c7c7] rounded-lg text-xs space-y-2.5">

                <div className="grid grid-cols-2 gap-2">

                  <div>
                    <span className="text-[#9e9e9e] block text-[10px] uppercase font-bold">
                      Empleador / Cliente
                    </span>

                    <span className="font-bold text-slate-900 block">
                      {getCliente(showRenewalModal.clienteId)?.nombreRazonSocial || 'Empleador'}
                    </span>

                    <span className="text-[10px] text-slate-500 font-mono">
                      CUIT: {getCliente(showRenewalModal.clienteId)?.cuitCuilDni}
                    </span>
                  </div>

                  <div>
                    <span className="text-[#9e9e9e] block text-[10px] uppercase font-bold">
                      Aseguradora ART
                    </span>

                    <span className="font-bold text-[#005a9e] block">
                      {getAseguradora(showRenewalModal.aseguradoraId)?.nombre || 'Aseguradora'}
                    </span>
                  </div>

                </div>

                <div className="grid grid-cols-2 gap-2 border-t border-slate-200 pt-2">

                  <div>
                    <span className="text-[#9e9e9e] block text-[10px] uppercase font-bold">
                      Número de Contrato
                    </span>

                    <span className="font-mono font-bold text-slate-800">
                      {showRenewalModal.numeroContrato}
                    </span>
                  </div>

                  <div>
                    <span className="text-[#9e9e9e] block text-[10px] uppercase font-bold">
                      CIIU / Actividad
                    </span>

                    <span className="text-slate-800">
                      {showRenewalModal.ciiuActividad} - {showRenewalModal.descripcionActividad}
                    </span>
                  </div>

                </div>

                <div className="grid grid-cols-3 gap-2 border-t border-slate-200 pt-2">

                  <div>
                    <span className="text-[#9e9e9e] block text-[10px] uppercase font-bold">
                      Nómina
                    </span>

                    <span className="font-mono font-bold text-slate-800">
                      {showRenewalModal.cantidadTrabajadores} Empleados
                    </span>
                  </div>

                  <div>
                    <span className="text-[#9e9e9e] block text-[10px] uppercase font-bold">
                      Masa Salarial
                    </span>

                    <span className="font-mono font-bold text-[#005a9e]">
                      ${showRenewalModal.masaSalarialEstimada.toLocaleString('es-AR')}
                    </span>
                  </div>

                  <div>
                    <span className="text-[#9e9e9e] block text-[10px] uppercase font-bold">
                      Alícuotas
                    </span>

                    <span className="font-mono font-bold text-slate-800">
                      ${showRenewalModal.alicuotaFija} + ${showRenewalModal.alicuotaVariable.toLocaleString('es-AR', { minimumFractionDigits: 3, maximumFractionDigits: 3 })}%
                    </span>
                  </div>

                </div>

                <div className="grid grid-cols-2 gap-2 border-t border-slate-200 pt-2">

                  <div>
                    <span className="text-[#9e9e9e] block text-[10px] uppercase font-bold">
                      Fecha Inicio Original (Antigüedad)
                    </span>

                    <span className="font-mono font-semibold text-slate-800">
                      {showRenewalModal.fechaInicioContrato}
                    </span>
                  </div>

                  <div>
                    <span className="text-[#9e9e9e] block text-[10px] uppercase font-bold">
                      Última Renovación
                    </span>

                    <span className="font-mono font-semibold text-slate-800">
                      {showRenewalModal.fechaUltimaRenovacion
                        ? new Date(
                            showRenewalModal.fechaUltimaRenovacion
                          ).toLocaleString('es-AR')
                        : 'Sin renovaciones previas'}
                    </span>
                  </div>

                </div>

              </div>
            </div>

            <form
              onSubmit={handleRenewalSubmit}
              className="space-y-4 text-xs pt-1"
            >

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
                    Nueva Fecha de Inicio{' '}
                    <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="date"
                    value={renovacionFechaInicio}
                    onChange={(e) =>
                      setRenovacionFechaInicio(e.target.value)
                    }
                    className="w-full p-2 bg-white border border-[#005a9e] rounded-lg font-mono text-xs focus:ring-2 focus:ring-[#005a9e]"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Nueva Fecha de Fin{' '}
                    <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="date"
                    value={renovacionFechaFin}
                    onChange={(e) =>
                      setRenovacionFechaFin(e.target.value)
                    }
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
      {/* MODAL NUEVO / MODIFICAR CONTRATO ART */}
      {/* ============================================================= */}

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">

          <div className="bg-white rounded-xl border border-[#c7c7c7] shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">

            <div className="flex justify-between items-center border-b border-slate-200 pb-3">

              <h3 className="text-base font-bold text-slate-900">
                {editingContrato
                  ? 'Modificar Contrato ART'
                  : 'Alta de Contrato ART (Proceso 5)'}
              </h3>

              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingContrato(null);
                }}
                className="text-[#9e9e9e] hover:text-slate-900 font-bold text-lg cursor-pointer"
              >
                ×
              </button>

            </div>

            <form
              onSubmit={handleAltaSubmit}
              className="space-y-3.5 text-xs"
            >

              {altaError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 font-semibold rounded-lg flex items-start space-x-2 text-xs">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <span>{altaError}</span>
                </div>
              )}

              {/* Empleador & Aseguradora */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Empleador / Cliente{' '}
                    <span className="text-red-500">*</span>
                  </label>

                  <select
                    value={empresaClienteId}
                    onChange={(e) => {
                      setEmpresaClienteId(e.target.value);
                      setAltaError(null);
                    }}
                    className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg focus:ring-2 focus:ring-[#005a9e]"
                    required
                  >
                    {clientes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nombreRazonSocial}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Aseguradora ART{' '}
                    <span className="text-red-500">*</span>
                  </label>

                  <select
                    value={artAseguradoraId}
                    onChange={(e) =>
                      setArtAseguradoraId(e.target.value)
                    }
                    className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg focus:ring-2 focus:ring-[#005a9e]"
                    required
                  >
                    {aseguradoras.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.nombre}
                      </option>
                    ))}
                  </select>
                </div>

              </div>

              {/* CUIT del titular */}
              {(() => {
                const titular = getCliente(empresaClienteId);
                const cuitTitular = titular?.cuitCuilDni || '';

                const validation = validateCuitCuil(
                  cuitTitular.replace(/\D/g, '')
                );

                return (
                  <div
                    className={`p-2.5 rounded-lg border text-xs flex items-center justify-between transition-all ${
                      validation.isValid
                        ? 'bg-blue-50/50 border-blue-200 text-slate-800'
                        : 'bg-amber-50 border-amber-300 text-amber-900'
                    }`}
                  >

                    <div className="space-y-0.5">

                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#005a9e] block">
                        CUIT del titular del contrato
                      </span>

                      <span className="font-mono font-bold text-sm text-slate-900 block">
                        {cuitTitular || '(Sin CUIT registrado)'}
                      </span>

                    </div>

                    <div>
                      {validation.isValid ? (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-md border border-emerald-200 inline-flex items-center space-x-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>CUIT Válido</span>
                        </span>
                      ) : (
                        <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2.5 py-1 rounded-md border border-amber-200 inline-flex items-center space-x-1">
                          <AlertCircle className="w-3 h-3 text-amber-600" />
                          <span>CUIT Inválido</span>
                        </span>
                      )}
                    </div>

                  </div>
                );
              })()}

              {/* Número de contrato & CIIU */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">

                <div>
                  <label className="font-bold text-slate-900 block mb-1 text-xs">
                    N° Contrato ART{' '}
                    <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    placeholder="ART-12345"
                    value={numContrato}
                    onChange={(e) => {
                      setNumContrato(e.target.value);
                      setAltaError(null);
                    }}
                    className="w-full px-3.5 py-2.5 bg-white border-2 border-[#005a9e]/40 focus:border-[#005a9e] rounded-lg font-mono font-bold text-base text-slate-900 tracking-wider shadow-xs focus:ring-2 focus:ring-[#005a9e]/20 outline-none"
                    required
                  />

                  <span className="text-[10px] text-[#6d6e71] mt-0.5 block">
                    Identificador del contrato
                  </span>
                </div>

                <div className="relative">
                <label className="font-bold text-slate-700 block mb-1">
                  CIIU Actividad{' '}
                  <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  value={ciiuSearch || ciiu}
                  onChange={(e) => {
                    setCiiuSearch(e.target.value);
                    setShowCiiuResults(true);
                    setCiiu('');
                    setActividad('');
                    setAltaError(null);
                  }}
                  onFocus={() => {
                    if (ciiuSearch) {
                      setShowCiiuResults(true);
                    }
                  }}
                  className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg font-mono"
                  placeholder="Buscar código o actividad"
                  required={!ciiu}
                />

                {showCiiuResults && ciiuSearch && (
                  <div className="absolute z-30 left-0 right-0 mt-1 bg-white border border-[#c7c7c7] rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {ciiuResults.length > 0 ? (
                      ciiuResults.map((item) => (
                        <button
                          key={item.codigo}
                          type="button"
                          onClick={() => handleSelectCiiu(item.codigo)}
                          className="w-full text-left px-3 py-2 hover:bg-blue-50 border-b border-slate-100 last:border-b-0"
                        >
                          <span className="font-mono font-bold text-[#005a9e]">
                            {item.codigo}
                          </span>
                          <span className="text-slate-700 ml-2">
                            {item.descripcion}
                          </span>
                        </button>
                      ))
                    ) : (
                      <div className="px-3 py-3 text-[#6d6e71]">
                        No se encontraron actividades CIIU.
                      </div>
                    )}
                  </div>
                )}

                <span className="text-[10px] text-[#6d6e71] mt-0.5 block">
                  Busque por código o descripción
                </span>

                {ciiu && (
                  <span className="text-[10px] text-emerald-700 font-semibold mt-0.5 block">
                    CIIU seleccionado: {ciiu}
                  </span>
                )}
              </div>

              </div>

              {/* Actividad */}
              <div>

                <label className="font-bold text-slate-700 block mb-1">
                  Descripción Actividad{' '}
                  <span className="text-red-500">*</span>
                </label>

                <div className="w-full p-2 bg-slate-100 border border-[#c7c7c7] rounded-lg text-slate-700 min-h-[38px]">
                  {actividad || 'La descripción se completa automáticamente al seleccionar el CIIU.'}
                </div>

                <span className="text-[10px] text-[#6d6e71] mt-0.5 block">
                  Descripción oficial correspondiente al código CIIU seleccionado
                </span>

              </div>

              {/* Fechas */}
              <div className="grid grid-cols-2 gap-3">

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Fecha Inicio Vigencia{' '}
                    <span className="text-red-500">*</span>
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
                    Fecha Fin Vigencia{' '}
                    <span className="text-red-500">*</span>
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
                    Masa Salarial Estimada (ARS){' '}
                    <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="number"
                    value={masaSalarial}
                    onChange={(e) =>
                      setMasaSalarial(Number(e.target.value))
                    }
                    className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg font-mono"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Cantidad de Trabajadores{' '}
                    <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="number"
                    value={trabajadores}
                    onChange={(e) =>
                      setTrabajadores(Number(e.target.value))
                    }
                    className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg font-mono"
                    min="1"
                    required
                  />
                </div>

              </div>

              {/* Alícuotas */}
              <div className="grid grid-cols-2 gap-3">

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Alícuota Fija (ARS / Cápita){' '}
                    <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="number"
                    step="0.01"
                    value={alicuotaFija}
                    onChange={(e) =>
                      setAlicuotaFija(Number(e.target.value))
                    }
                    className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg font-mono"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Alícuota Variable (%){' '}
                    <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="number"
                    step="0.001"
                    value={alicuotaVar}
                    onChange={(e) =>
                      setAlicuotaVar(Number(e.target.value))
                    }
                    className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg font-mono"
                    min="0"
                    required
                  />
                </div>

              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end space-x-2">

                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingContrato(null);
                  }}
                  className="px-4 py-2 border border-[#c7c7c7] text-[#6d6e71] rounded-lg hover:bg-slate-50 cursor-pointer font-semibold"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-[#005a9e] hover:bg-[#007bc1] text-white font-bold rounded-lg shadow-sm cursor-pointer"
                >
                  {editingContrato
                    ? 'Guardar Cambios'
                    : 'Guardar Contrato ART'}
                </button>

              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};