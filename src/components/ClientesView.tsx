import React, { useState } from 'react';
import {
  Cliente,
  Poliza,
  Vehiculo,
  ContratoART,
  TipoCliente,
  TipoDocumentoCliente,
  CondicionIVA,
  PerfilRiesgo,
  SexoCliente,
  MedioContactoPreferido,
  EstadoCliente,
  RegistroTrazabilidadCliente
} from '../types';
import {
  Users,
  Search,
  Plus,
  FileText,
  Car,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Building2,
  User,
  Eye,
  Edit3,
  ShieldOff,
  ShieldCheck,
  Lock,
  History,
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Calendar,
  Info,
  Clock,
  ArrowRight,
  X,
  FileCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  validateCuitCuil,
  formatCuitCuil,
  validateDni,
  validateEmail,
  validatePhone,
  validateBirthDate,
  detectClientDuplicates,
  getClientFieldDifferences,
  DuplicateDetectionResult
} from '../utils/clienteValidations';

interface ClientesViewProps {
  clientes: Cliente[];
  polizas: Poliza[];
  vehiculos: Vehiculo[];
  contratosArt: ContratoART[];
  onAddCliente: (nuevo: Omit<Cliente, 'id' | 'fechaAlta'>) => void;
  onUpdateCliente?: (clienteActualizado: Cliente) => void;
  onNavigate: (processId: string) => void;
}

export const ClientesView: React.FC<ClientesViewProps> = ({
  clientes,
  polizas,
  vehiculos,
  contratosArt,
  onAddCliente,
  onUpdateCliente,
  onNavigate
}) => {
  const { user } = useAuth();
  const currentUserEmail = user?.email || 'pas.titular@avisame.cionar.com.ar';

  // Master Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFilter, setTipoFilter] = useState<'Todos' | TipoCliente>('Todos');
  const [estadoFilter, setEstadoFilter] = useState<'Todos' | EstadoCliente>('Todos');
  const [selectedClienteId, setSelectedClienteId] = useState<string | null>(clientes[0]?.id || null);

  // Modals State
  const [showAltaModal, setShowAltaModal] = useState(false);
  const [showVerModal, setShowVerModal] = useState(false);
  const [verClienteTarget, setVerClienteTarget] = useState<Cliente | null>(null);

  const [showModificarModal, setShowModificarModal] = useState(false);
  const [modificarClienteTarget, setModificarClienteTarget] = useState<Cliente | null>(null);

  const [showInhabilitarModal, setShowInhabilitarModal] = useState(false);
  const [inhabilitarTarget, setInhabilitarTarget] = useState<Cliente | null>(null);

  const [showHabilitarModal, setShowHabilitarModal] = useState(false);
  const [habilitarTarget, setHabilitarTarget] = useState<Cliente | null>(null);

  const [showConfirmModificacionModal, setShowConfirmModificacionModal] = useState(false);
  const [pendingModifiedClient, setPendingModifiedClient] = useState<Cliente | null>(null);
  const [pendingDifferences, setPendingDifferences] = useState<{ campo: string; label: string; valorAnterior: any; valorNuevo: any }[]>([]);
  const [pendingDuplicatesResult, setPendingDuplicatesResult] = useState<DuplicateDetectionResult | null>(null);

  // Form State for Modification
  const [modForm, setModForm] = useState<{
    nombre: string;
    apellido: string;
    nombreRazonSocial: string;
    nombreFantasia: string;
    condicionIva: CondicionIVA;
    fechaNacimiento: string;
    sexo: SexoCliente;
    telefono: string;
    telefonoSecundario: string;
    whatsapp: string;
    email: string;
    emailSecundario: string;
    medioContactoPreferido: MedioContactoPreferido;
    domicilio: string;
    calle: string;
    numero: string;
    piso: string;
    depto: string;
    localidad: string;
    provincia: string;
    codigoPostal: string;
    productorResponsable: string;
    perfilRiesgo: PerfilRiesgo;
    notas: string;
    observaciones: string;
    notasAdministrativas: string;
  }>({
    nombre: '',
    apellido: '',
    nombreRazonSocial: '',
    nombreFantasia: '',
    condicionIva: 'Consumidor Final',
    fechaNacimiento: '',
    sexo: 'No especificado',
    telefono: '',
    telefonoSecundario: '',
    whatsapp: '',
    email: '',
    emailSecundario: '',
    medioContactoPreferido: 'WhatsApp',
    domicilio: '',
    calle: '',
    numero: '',
    piso: '',
    depto: '',
    localidad: '',
    provincia: 'Buenos Aires',
    codigoPostal: '',
    productorResponsable: 'PAS Titular',
    perfilRiesgo: 'Bajo',
    notas: '',
    observaciones: '',
    notasAdministrativas: ''
  });
  const [modFormErrors, setModFormErrors] = useState<string[]>([]);
  const [modFormWarning, setModFormWarning] = useState<string | null>(null);
  const [modFormInfo, setModFormInfo] = useState<string | null>(null);

  // Form State for Alta
  const [altaTipoDoc, setAltaTipoDoc] = useState<TipoDocumentoCliente>('CUIT');
  const [altaNumDoc, setAltaNumDoc] = useState('');
  const [altaTipo, setAltaTipo] = useState<TipoCliente>('Persona Física');
  const [altaNombre, setAltaNombre] = useState('');
  const [altaApellido, setAltaApellido] = useState('');
  const [altaRazonSocial, setAltaRazonSocial] = useState('');
  const [altaNombreFantasia, setAltaNombreFantasia] = useState('');
  const [altaIva, setAltaIva] = useState<CondicionIVA>('Consumidor Final');
  const [altaFechaNac, setAltaFechaNac] = useState('');
  const [altaSexo, setAltaSexo] = useState<SexoCliente>('No especificado');
  const [altaEmail, setAltaEmail] = useState('');
  const [altaEmailSecundario, setAltaEmailSecundario] = useState('');
  const [altaTel, setAltaTel] = useState('');
  const [altaTelSecundario, setAltaTelSecundario] = useState('');
  const [altaWhatsapp, setAltaWhatsapp] = useState('');
  const [altaMedioPreferido, setAltaMedioPreferido] = useState<MedioContactoPreferido>('WhatsApp');
  const [altaCalle, setAltaCalle] = useState('');
  const [altaNumero, setAltaNumero] = useState('');
  const [altaPiso, setAltaPiso] = useState('');
  const [altaDepto, setAltaDepto] = useState('');
  const [altaLocalidad, setAltaLocalidad] = useState('');
  const [altaProvincia, setAltaProvincia] = useState('Buenos Aires');
  const [altaCp, setAltaCp] = useState('');
  const [altaProductorResp, setAltaProductorResp] = useState('PAS Titular');
  const [altaPerfil, setAltaPerfil] = useState<PerfilRiesgo>('Bajo');
  const [altaNotas, setAltaNotas] = useState('');
  const [altaFormErrors, setAltaFormErrors] = useState<string[]>([]);
  const [altaFormWarning, setAltaFormWarning] = useState<string | null>(null);
  const [altaFormInfo, setAltaFormInfo] = useState<string | null>(null);

  // Currently selected client for detail view
  const selectedCliente = clientes.find((c) => c.id === selectedClienteId) || clientes[0] || null;

  // Filtered Clients list
  const filteredClientes = clientes.filter((c) => {
    const matchTipo = tipoFilter === 'Todos' || c.tipo === tipoFilter;
    const matchEstado =
      estadoFilter === 'Todos' ||
      (estadoFilter === 'Activo' && (c.estado === 'Activo' || !c.estado)) ||
      (estadoFilter === 'Inhabilitado' && (c.estado === 'Inhabilitado' || c.estado === 'Inactivo'));
    const term = searchTerm.toLowerCase().trim();
    const matchSearch =
      term === '' ||
      c.nombreRazonSocial.toLowerCase().includes(term) ||
      (c.nombre && c.nombre.toLowerCase().includes(term)) ||
      (c.apellido && c.apellido.toLowerCase().includes(term)) ||
      c.cuitCuilDni.includes(term) ||
      (c.numeroDocumento && c.numeroDocumento.includes(term)) ||
      c.email.toLowerCase().includes(term) ||
      (c.whatsapp && c.whatsapp.includes(term)) ||
      c.telefono.includes(term);

    return matchTipo && matchEstado && matchSearch;
  });

  const getPolizasCliente = (clienteId: string) => polizas.filter((p) => p.clienteId === clienteId);
  const getVehiculosCliente = (clienteId: string) => vehiculos.filter((v) => v.clienteId === clienteId);
  const getArtsCliente = (clienteId: string) => contratosArt.filter((a) => a.clienteId === clienteId);

  // -------------------------------------------------------------
  // OPEN ACTIONS
  // -------------------------------------------------------------
  const handleOpenVer = (cliente: Cliente) => {
    setVerClienteTarget(cliente);
    setShowVerModal(true);
  };

  const handleOpenModificar = (cliente: Cliente) => {
    if (cliente.estado === 'Inhabilitado' || cliente.estado === 'Inactivo') {
      alert('Un cliente inhabilitado no puede ser modificado. Debe habilitarlo previamente.');
      return;
    }

    setModificarClienteTarget(cliente);
    setModFormErrors([]);
    setModFormWarning(null);
    setModFormInfo(null);

    // Populate modification form with current values
    setModForm({
      nombre: cliente.nombre || (cliente.tipo === 'Persona Física' ? cliente.nombreRazonSocial.split(', ')[1] || '' : ''),
      apellido: cliente.apellido || (cliente.tipo === 'Persona Física' ? cliente.nombreRazonSocial.split(', ')[0] || '' : ''),
      nombreRazonSocial: cliente.nombreRazonSocial || '',
      nombreFantasia: cliente.nombreFantasia || '',
      condicionIva: cliente.condicionIva || 'Consumidor Final',
      fechaNacimiento: cliente.fechaNacimiento || '',
      sexo: cliente.sexo || 'No especificado',
      telefono: cliente.telefono || '',
      telefonoSecundario: cliente.telefonoSecundario || '',
      whatsapp: cliente.whatsapp || cliente.telefono || '',
      email: cliente.email || '',
      emailSecundario: cliente.emailSecundario || '',
      medioContactoPreferido: cliente.medioContactoPreferido || 'WhatsApp',
      domicilio: cliente.domicilio || '',
      calle: cliente.calle || cliente.domicilio || '',
      numero: cliente.numero || '',
      piso: cliente.piso || '',
      depto: cliente.depto || '',
      localidad: cliente.localidad || '',
      provincia: cliente.provincia || 'Buenos Aires',
      codigoPostal: cliente.codigoPostal || '',
      productorResponsable: cliente.productorResponsable || 'PAS Titular',
      perfilRiesgo: cliente.perfilRiesgo || 'Bajo',
      notas: cliente.notas || cliente.observaciones || '',
      observaciones: cliente.observaciones || cliente.notas || '',
      notasAdministrativas: cliente.notasAdministrativas || ''
    });

    setShowModificarModal(true);
  };

  const handleOpenInhabilitar = (cliente: Cliente) => {
    setInhabilitarTarget(cliente);
    setShowInhabilitarModal(true);
  };

  const handleOpenHabilitar = (cliente: Cliente) => {
    setHabilitarTarget(cliente);
    setShowHabilitarModal(true);
  };

  // -------------------------------------------------------------
  // VALIDATE & PREPARE MODIFICATION CONFIRMATION
  // -------------------------------------------------------------
  const handleValidateModification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modificarClienteTarget) return;

    setModFormErrors([]);
    setModFormWarning(null);
    setModFormInfo(null);

    const errors: string[] = [];

    // Validate Required Fields based on client type
    let finalNombreRazonSocial = '';
    if (modificarClienteTarget.tipo === 'Persona Física') {
      if (!modForm.nombre.trim()) {
        errors.push('El campo Nombre es obligatorio.');
      }
      if (!modForm.apellido.trim()) {
        errors.push('El campo Apellido es obligatorio.');
      }
      finalNombreRazonSocial = `${modForm.apellido.trim()}, ${modForm.nombre.trim()}`;

      // Validate Birthdate
      if (modForm.fechaNacimiento) {
        const birthVal = validateBirthDate(modForm.fechaNacimiento);
        if (!birthVal.isValid && birthVal.error) {
          errors.push(birthVal.error);
        }
      }
    } else {
      if (!modForm.nombreRazonSocial.trim()) {
        errors.push('El campo Razón Social es obligatorio.');
      }
      finalNombreRazonSocial = modForm.nombreRazonSocial.trim();
    }

    // Validate Condición IVA
    if (!modForm.condicionIva) {
      errors.push('El campo Condición frente al IVA es obligatorio.');
    }

    // Validate Contact Data
    if (!modForm.email.trim()) {
      errors.push('El campo Email Principal es obligatorio.');
    } else {
      const emailVal = validateEmail(modForm.email);
      if (!emailVal.isValid && emailVal.error) {
        errors.push(emailVal.error);
      }
    }

    if (modForm.emailSecundario && modForm.emailSecundario.trim() !== '') {
      const emailSecVal = validateEmail(modForm.emailSecundario);
      if (!emailSecVal.isValid && emailSecVal.error) {
        errors.push(`Email Secundario: ${emailSecVal.error}`);
      }
    }

    if (!modForm.telefono.trim()) {
      errors.push('El campo Teléfono Principal es obligatorio.');
    } else {
      const phoneVal = validatePhone(modForm.telefono, 'Teléfono Principal');
      if (!phoneVal.isValid && phoneVal.error) {
        errors.push(phoneVal.error);
      }
    }

    if (modForm.telefonoSecundario && modForm.telefonoSecundario.trim() !== '') {
      const phoneSecVal = validatePhone(modForm.telefonoSecundario, 'Teléfono Secundario');
      if (!phoneSecVal.isValid && phoneSecVal.error) {
        errors.push(phoneSecVal.error);
      }
    }

    if (!modForm.whatsapp.trim()) {
      errors.push('El campo WhatsApp es obligatorio.');
    } else {
      const wppVal = validatePhone(modForm.whatsapp, 'WhatsApp');
      if (!wppVal.isValid && wppVal.error) {
        errors.push(wppVal.error);
      }
    }

    // Validate Address
    if (!modForm.localidad.trim()) {
      errors.push('El campo Localidad es obligatorio.');
    }
    if (!modForm.provincia.trim()) {
      errors.push('El campo Provincia es obligatorio.');
    }

    // Build consolidated address string
    const consolidatedDomicilio = modForm.calle
      ? `${modForm.calle} ${modForm.numero || ''} ${modForm.piso ? `Piso ${modForm.piso}` : ''} ${modForm.depto ? `Dto ${modForm.depto}` : ''}`.trim()
      : modForm.domicilio;

    if (errors.length > 0) {
      setModFormErrors(errors);
      return;
    }

    // Candidate updated object
    const updatedCandidate: Cliente = {
      ...modificarClienteTarget,
      nombre: modificarClienteTarget.tipo === 'Persona Física' ? modForm.nombre.trim() : undefined,
      apellido: modificarClienteTarget.tipo === 'Persona Física' ? modForm.apellido.trim() : undefined,
      nombreRazonSocial: finalNombreRazonSocial,
      nombreFantasia: modForm.nombreFantasia.trim() || undefined,
      condicionIva: modForm.condicionIva,
      fechaNacimiento: modificarClienteTarget.tipo === 'Persona Física' ? modForm.fechaNacimiento : undefined,
      sexo: modificarClienteTarget.tipo === 'Persona Física' ? modForm.sexo : undefined,
      telefono: modForm.telefono.trim(),
      telefonoSecundario: modForm.telefonoSecundario.trim() || undefined,
      whatsapp: modForm.whatsapp.trim(),
      email: modForm.email.trim(),
      emailSecundario: modForm.emailSecundario.trim() || undefined,
      medioContactoPreferido: modForm.medioContactoPreferido,
      domicilio: consolidatedDomicilio,
      calle: modForm.calle.trim() || undefined,
      numero: modForm.numero.trim() || undefined,
      piso: modForm.piso.trim() || undefined,
      depto: modForm.depto.trim() || undefined,
      localidad: modForm.localidad.trim(),
      provincia: modForm.provincia.trim(),
      codigoPostal: modForm.codigoPostal.trim() || undefined,
      productorResponsable: modForm.productorResponsable,
      perfilRiesgo: modForm.perfilRiesgo,
      notas: modForm.notas.trim() || undefined,
      observaciones: modForm.observaciones.trim() || undefined,
      notasAdministrativas: modForm.notasAdministrativas.trim() || undefined
    };

    // 1. Detect Changes (Differences)
    const diffs = getClientFieldDifferences(modificarClienteTarget, updatedCandidate);
    if (diffs.length === 0) {
      setModFormErrors(['No se detectaron modificaciones en los datos del cliente. Modifique al menos un campo para guardar.']);
      return;
    }

    // 2. Deterministic Duplicate Detection
    const dupResult = detectClientDuplicates({
      currentClientId: modificarClienteTarget.id,
      tipoDoc: (modificarClienteTarget.tipoDocumento || (modificarClienteTarget.cuitCuilDni.length === 13 ? 'CUIT' : 'DNI')) as TipoDocumentoCliente,
      numDoc: modificarClienteTarget.cuitCuilDni,
      tipo: modificarClienteTarget.tipo,
      nombreRazonSocial: finalNombreRazonSocial,
      nombre: modForm.nombre,
      apellido: modForm.apellido,
      fechaNacimiento: modForm.fechaNacimiento,
      telefono: modForm.telefono,
      whatsapp: modForm.whatsapp,
      email: modForm.email,
      domicilio: consolidatedDomicilio,
      localidad: modForm.localidad,
      existingClients: clientes
    });

    if (dupResult.level1ConfirmedMatch) {
      setModFormErrors([dupResult.level1ConfirmedMatch.message]);
      return;
    }

    // Set warnings / info
    if (dupResult.dniCuitCorrespondenceMatch) {
      setModFormWarning(dupResult.dniCuitCorrespondenceMatch.message);
    } else if (dupResult.level2StrongMatch) {
      setModFormWarning(dupResult.level2StrongMatch.message);
    } else {
      setModFormWarning(null);
    }

    if (dupResult.level3WeakMatch) {
      setModFormInfo(dupResult.level3WeakMatch.message);
    } else {
      setModFormInfo(null);
    }

    // Open Confirmation Dialog
    setPendingModifiedClient(updatedCandidate);
    setPendingDifferences(diffs);
    setPendingDuplicatesResult(dupResult);
    setShowConfirmModificacionModal(true);
  };

  // -------------------------------------------------------------
  // CONFIRM MODIFICATION SAVE
  // -------------------------------------------------------------
  const handleExecuteConfirmedModification = () => {
    if (!modificarClienteTarget || !pendingModifiedClient) return;

    const now = new Date();
    const fecha = now.toISOString().split('T')[0];
    const hora = now.toTimeString().split(' ')[0];

    const registroTrazabilidad: RegistroTrazabilidadCliente = {
      id: `traz-${Date.now()}`,
      clienteId: pendingModifiedClient.id,
      operacion: 'MODIFICACIÓN',
      fecha,
      hora,
      usuario: currentUserEmail,
      datosModificados: pendingDifferences.map((d) => ({
        campo: d.campo,
        label: d.label,
        valorAnterior: d.valorAnterior,
        valorNuevo: d.valorNuevo
      })),
      resumenModificacion: `Modificación de ${pendingDifferences.length} campo(s): ${pendingDifferences.map((d) => d.label).join(', ')}`,
      estadoAnterior: modificarClienteTarget.estado || 'Activo',
      estadoPosterior: modificarClienteTarget.estado || 'Activo'
    };

    const updatedWithTraceability: Cliente = {
      ...pendingModifiedClient,
      trazabilidad: [registroTrazabilidad, ...(modificarClienteTarget.trazabilidad || [])]
    };

    if (onUpdateCliente) {
      onUpdateCliente(updatedWithTraceability);
    }

    // Close Modals
    setShowConfirmModificacionModal(false);
    setShowModificarModal(false);
    setModificarClienteTarget(null);
    setPendingModifiedClient(null);
    setSelectedClienteId(updatedWithTraceability.id);
  };

  // -------------------------------------------------------------
  // EXECUTE INHABILITAR CLIENTE
  // -------------------------------------------------------------
  const handleExecuteInhabilitar = () => {
    if (!inhabilitarTarget) return;

    const now = new Date();
    const fecha = now.toISOString().split('T')[0];
    const hora = now.toTimeString().split(' ')[0];

    const registroTrazabilidad: RegistroTrazabilidadCliente = {
      id: `traz-${Date.now()}`,
      clienteId: inhabilitarTarget.id,
      operacion: 'INHABILITACIÓN',
      fecha,
      hora,
      usuario: currentUserEmail,
      resumenModificacion: 'Inhabilitación formal del cliente para nuevas operaciones comerciales.',
      estadoAnterior: inhabilitarTarget.estado || 'Activo',
      estadoPosterior: 'Inhabilitado'
    };

    const updatedCliente: Cliente = {
      ...inhabilitarTarget,
      estado: 'Inhabilitado',
      trazabilidad: [registroTrazabilidad, ...(inhabilitarTarget.trazabilidad || [])]
    };

    if (onUpdateCliente) {
      onUpdateCliente(updatedCliente);
    }

    setShowInhabilitarModal(false);
    setInhabilitarTarget(null);
    setSelectedClienteId(updatedCliente.id);
  };

  // -------------------------------------------------------------
  // EXECUTE HABILITAR CLIENTE
  // -------------------------------------------------------------
  const handleExecuteHabilitar = () => {
    if (!habilitarTarget) return;

    const now = new Date();
    const fecha = now.toISOString().split('T')[0];
    const hora = now.toTimeString().split(' ')[0];

    const registroTrazabilidad: RegistroTrazabilidadCliente = {
      id: `traz-${Date.now()}`,
      clienteId: habilitarTarget.id,
      operacion: 'HABILITACIÓN',
      fecha,
      hora,
      usuario: currentUserEmail,
      resumenModificacion: 'Reactivación y habilitación del cliente como activo comercial.',
      estadoAnterior: habilitarTarget.estado || 'Inhabilitado',
      estadoPosterior: 'Activo'
    };

    const updatedCliente: Cliente = {
      ...habilitarTarget,
      estado: 'Activo',
      trazabilidad: [registroTrazabilidad, ...(habilitarTarget.trazabilidad || [])]
    };

    if (onUpdateCliente) {
      onUpdateCliente(updatedCliente);
    }

    setShowHabilitarModal(false);
    setHabilitarTarget(null);
    setSelectedClienteId(updatedCliente.id);
  };

  // -------------------------------------------------------------
  // EXECUTE ALTA DE CLIENTE
  // -------------------------------------------------------------
  const handleValidateAndSubmitAlta = (e: React.FormEvent) => {
    e.preventDefault();
    setAltaFormErrors([]);
    setAltaFormWarning(null);
    setAltaFormInfo(null);

    const errors: string[] = [];

    // Document Validation
    let formattedDoc = altaNumDoc.trim();
    if (altaTipoDoc === 'CUIT' || altaTipoDoc === 'CUIL') {
      const cuitVal = validateCuitCuil(altaNumDoc);
      if (!cuitVal.isValid && cuitVal.error) {
        errors.push(cuitVal.error);
      } else {
        formattedDoc = formatCuitCuil(altaNumDoc);
      }
    } else {
      const dniVal = validateDni(altaNumDoc);
      if (!dniVal.isValid && dniVal.error) {
        errors.push(dniVal.error);
      }
    }

    // Name / Social Reason Validation
    let finalNombreRazonSocial = '';
    if (altaTipo === 'Persona Física') {
      if (!altaNombre.trim()) errors.push('El campo Nombre es obligatorio.');
      if (!altaApellido.trim()) errors.push('El campo Apellido es obligatorio.');
      finalNombreRazonSocial = `${altaApellido.trim()}, ${altaNombre.trim()}`;

      if (altaFechaNac) {
        const birthVal = validateBirthDate(altaFechaNac);
        if (!birthVal.isValid && birthVal.error) errors.push(birthVal.error);
      }
    } else {
      if (!altaRazonSocial.trim()) errors.push('El campo Razón Social es obligatorio.');
      finalNombreRazonSocial = altaRazonSocial.trim();
    }

    // Contact Validations
    if (!altaEmail.trim()) {
      errors.push('El campo Email Principal es obligatorio.');
    } else {
      const emailVal = validateEmail(altaEmail);
      if (!emailVal.isValid && emailVal.error) errors.push(emailVal.error);
    }

    if (!altaTel.trim()) {
      errors.push('El campo Teléfono Principal es obligatorio.');
    } else {
      const telVal = validatePhone(altaTel, 'Teléfono Principal');
      if (!telVal.isValid && telVal.error) errors.push(telVal.error);
    }

    if (!altaWhatsapp.trim()) {
      errors.push('El campo WhatsApp es obligatorio.');
    } else {
      const wppVal = validatePhone(altaWhatsapp, 'WhatsApp');
      if (!wppVal.isValid && wppVal.error) errors.push(wppVal.error);
    }

    if (!altaLocalidad.trim()) errors.push('El campo Localidad es obligatorio.');
    if (!altaProvincia.trim()) errors.push('El campo Provincia es obligatorio.');

    // Consolidated Address
    const consolidatedDomicilio = altaCalle
      ? `${altaCalle} ${altaNumero || ''} ${altaPiso ? `Piso ${altaPiso}` : ''} ${altaDepto ? `Dto ${altaDepto}` : ''}`.trim()
      : `${altaLocalidad}, ${altaProvincia}`;

    if (errors.length > 0) {
      setAltaFormErrors(errors);
      return;
    }

    // Duplicate Detection Check
    const dupResult = detectClientDuplicates({
      tipoDoc: altaTipoDoc,
      numDoc: formattedDoc,
      tipo: altaTipo,
      nombreRazonSocial: finalNombreRazonSocial,
      nombre: altaNombre,
      apellido: altaApellido,
      fechaNacimiento: altaFechaNac,
      telefono: altaTel,
      whatsapp: altaWhatsapp,
      email: altaEmail,
      domicilio: consolidatedDomicilio,
      localidad: altaLocalidad,
      existingClients: clientes
    });

    if (dupResult.level1ConfirmedMatch) {
      setAltaFormErrors([dupResult.level1ConfirmedMatch.message]);
      return;
    }

    if (dupResult.dniCuitCorrespondenceMatch && !altaFormWarning) {
      setAltaFormWarning(dupResult.dniCuitCorrespondenceMatch.message);
      return;
    }

    const now = new Date();
    const fecha = now.toISOString().split('T')[0];
    const hora = now.toTimeString().split(' ')[0];

    const trazabilidadAlta: RegistroTrazabilidadCliente[] = [
      {
        id: `traz-${Date.now()}`,
        clienteId: '',
        operacion: 'ALTA',
        fecha,
        hora,
        usuario: currentUserEmail,
        resumenModificacion: 'Alta inicial del cliente en cartera comercial',
        estadoAnterior: '-',
        estadoPosterior: 'Activo'
      }
    ];

    onAddCliente({
      cuitCuilDni: formattedDoc,
      tipoDocumento: altaTipoDoc,
      numeroDocumento: formattedDoc,
      tipo: altaTipo,
      nombre: altaTipo === 'Persona Física' ? altaNombre.trim() : undefined,
      apellido: altaTipo === 'Persona Física' ? altaApellido.trim() : undefined,
      nombreRazonSocial: finalNombreRazonSocial,
      nombreFantasia: altaNombreFantasia.trim() || undefined,
      condicionIva: altaIva,
      fechaNacimiento: altaTipo === 'Persona Física' ? altaFechaNac : undefined,
      sexo: altaTipo === 'Persona Física' ? altaSexo : undefined,
      email: altaEmail.trim(),
      emailSecundario: altaEmailSecundario.trim() || undefined,
      telefono: altaTel.trim(),
      telefonoSecundario: altaTelSecundario.trim() || undefined,
      whatsapp: altaWhatsapp.trim(),
      medioContactoPreferido: altaMedioPreferido,
      domicilio: consolidatedDomicilio,
      calle: altaCalle.trim() || undefined,
      numero: altaNumero.trim() || undefined,
      piso: altaPiso.trim() || undefined,
      depto: altaDepto.trim() || undefined,
      localidad: altaLocalidad.trim(),
      provincia: altaProvincia.trim(),
      codigoPostal: altaCp.trim() || undefined,
      productorResponsable: altaProductorResp,
      perfilRiesgo: altaPerfil,
      medioIncorporacion: 'Carga Manual Directa',
      estado: 'Activo',
      notas: altaNotas.trim() || undefined,
      observaciones: altaNotas.trim() || undefined,
      trazabilidad: trazabilidadAlta
    });

    // Reset Form
    setAltaNumDoc('');
    setAltaNombre('');
    setAltaApellido('');
    setAltaRazonSocial('');
    setAltaNombreFantasia('');
    setAltaEmail('');
    setAltaEmailSecundario('');
    setAltaTel('');
    setAltaTelSecundario('');
    setAltaWhatsapp('');
    setAltaCalle('');
    setAltaNumero('');
    setAltaPiso('');
    setAltaDepto('');
    setAltaLocalidad('');
    setAltaCp('');
    setAltaNotas('');
    setShowAltaModal(false);
  };

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
            Asegurados y Tomadores. Unicidad verificada por CUIT/CUIL/DNI y Supervisión Trazable MOD-008.
          </p>
        </div>

        <button
          onClick={() => {
            setAltaFormErrors([]);
            setAltaFormWarning(null);
            setAltaFormInfo(null);
            setShowAltaModal(true);
          }}
          className="bg-[#005a9e] hover:bg-[#007bc1] text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-all shadow-sm flex items-center space-x-2 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Nuevo Cliente</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-[#c7c7c7]">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#9e9e9e]" />
          <input
            type="text"
            placeholder="Buscar por CUIT, Nombre, WhatsApp o Email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-[#c7c7c7] rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#005a9e] text-slate-800"
          />
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto text-xs">
          {/* Status Filter */}
          <div className="flex items-center space-x-1.5">
            <span className="text-[#6d6e71] font-bold">Estado:</span>
            {(['Todos', 'Activo', 'Inhabilitado'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setEstadoFilter(st as any)}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  estadoFilter === st
                    ? st === 'Inhabilitado'
                      ? 'bg-amber-700 text-white shadow-xs'
                      : 'bg-[#005a9e] text-white shadow-xs'
                    : 'bg-white border border-[#c7c7c7] text-[#6d6e71] hover:text-[#005a9e]'
                }`}
              >
                {st === 'Activo' ? 'Activos' : st === 'Inhabilitado' ? 'Inhabilitados' : 'Todos'}
              </button>
            ))}
          </div>

          {/* Type Filter */}
          <div className="flex items-center space-x-1.5">
            <span className="text-[#6d6e71] font-bold">Tipo:</span>
            {(['Todos', 'Persona Física', 'Persona Jurídica'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTipoFilter(t)}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
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
      </div>

      {/* Main Content Layout: Master List + Detail Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Clientes List */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-[#c7c7c7] shadow-xs overflow-hidden flex flex-col">
          <div className="p-3 bg-slate-50 border-b border-[#c7c7c7] text-xs font-bold text-[#6d6e71] flex justify-between items-center">
            <span>Listado de Clientes</span>
            <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded text-[11px] font-mono">
              {filteredClientes.length} Registros
            </span>
          </div>

          <div className="divide-y divide-slate-100 overflow-y-auto max-h-[620px]">
            {filteredClientes.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#9e9e9e] italic">
                No se encontraron clientes con los filtros seleccionados.
              </div>
            ) : (
              filteredClientes.map((c) => {
                const isSelected = selectedCliente?.id === c.id;
                const isActivo = c.estado === 'Activo' || !c.estado;
                const countPolizas = getPolizasCliente(c.id).length;

                return (
                  <div
                    key={c.id}
                    className={`w-full p-3.5 transition-all space-y-2 border-l-4 ${
                      isSelected
                        ? 'bg-[#005a9e]/10 border-l-[#005a9e]'
                        : isActivo
                        ? 'hover:bg-slate-50 border-l-transparent'
                        : 'bg-slate-50/70 border-l-amber-500/80 hover:bg-slate-100/80'
                    }`}
                  >
                    <div
                      className="cursor-pointer"
                      onClick={() => setSelectedClienteId(c.id)}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {c.nombreRazonSocial}
                        </span>
                        <div className="flex items-center space-x-1.5 flex-shrink-0">
                          {isActivo ? (
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded flex items-center space-x-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block"></span>
                              <span>Activo</span>
                            </span>
                          ) : (
                            <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded border border-amber-300 flex items-center space-x-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 inline-block"></span>
                              <span>Inhabilitado</span>
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-[#6d6e71] mt-1">
                        <span className="flex items-center space-x-1">
                          {c.tipo === 'Persona Jurídica' ? (
                            <Building2 className="w-3.5 h-3.5 text-[#005a9e]" />
                          ) : (
                            <User className="w-3.5 h-3.5 text-[#007bc1]" />
                          )}
                          <span>{c.tipo}</span>
                          <span className="font-mono text-slate-500">· {c.cuitCuilDni}</span>
                        </span>
                        <span className="font-semibold text-[#005a9e]">{countPolizas} Pólizas</span>
                      </div>
                    </div>

                    {/* Quick Row Action Buttons */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <div className="text-[10px] text-slate-400">
                        {c.whatsapp ? (
                          <span className="flex items-center space-x-1 text-emerald-700 font-medium">
                            <MessageCircle className="w-3 h-3" />
                            <span>{c.whatsapp}</span>
                          </span>
                        ) : (
                          <span>{c.email}</span>
                        )}
                      </div>

                      <div className="flex items-center space-x-1.5">
                        {/* VER */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenVer(c);
                          }}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded text-[10px] flex items-center space-x-1 cursor-pointer transition-colors"
                          title="Ver legajo completo del cliente"
                        >
                          <Eye className="w-3 h-3 text-[#005a9e]" />
                          <span>VER</span>
                        </button>

                        {/* If ACTIVO -> MODIFICAR & INHABILITAR */}
                        {isActivo ? (
                          <>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenModificar(c);
                              }}
                              className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-[#005a9e] font-bold rounded text-[10px] flex items-center space-x-1 cursor-pointer transition-colors"
                              title="Modificar datos del cliente"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>MODIFICAR</span>
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenInhabilitar(c);
                              }}
                              className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold rounded text-[10px] flex items-center space-x-1 cursor-pointer transition-colors"
                              title="Inhabilitar cliente"
                            >
                              <ShieldOff className="w-3 h-3 text-amber-600" />
                              <span>INHABILITAR</span>
                            </button>
                          </>
                        ) : (
                          /* If INHABILITADO -> HABILITAR */
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenHabilitar(c);
                            }}
                            className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded text-[10px] flex items-center space-x-1 cursor-pointer transition-colors border border-emerald-200"
                            title="Habilitar cliente"
                          >
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            <span>HABILITAR</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Selected Cliente Detail */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-[#c7c7c7] shadow-xs p-5 space-y-6">
          {selectedCliente ? (
            <>
              {/* Header Info & Action Controls */}
              <div className="border-b border-slate-200 pb-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="bg-[#005a9e] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                        {selectedCliente.tipo}
                      </span>
                      <span className="text-xs font-mono font-bold text-[#007bc1]">
                        {selectedCliente.tipoDocumento || 'CUIT/CUIL/DNI'}: {selectedCliente.cuitCuilDni}
                      </span>
                      {selectedCliente.estado === 'Inhabilitado' || selectedCliente.estado === 'Inactivo' ? (
                        <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-2 py-0.5 rounded flex items-center space-x-1">
                          <ShieldOff className="w-3 h-3 text-amber-700" />
                          <span>INHABILITADO</span>
                        </span>
                      ) : (
                        <span className="bg-emerald-100 text-emerald-900 text-[10px] font-bold px-2 py-0.5 rounded flex items-center space-x-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-700" />
                          <span>ACTIVO</span>
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mt-1">
                      {selectedCliente.nombreRazonSocial}
                    </h3>
                    {selectedCliente.nombreFantasia && (
                      <p className="text-xs text-slate-600 font-medium">
                        Fantasía: {selectedCliente.nombreFantasia}
                      </p>
                    )}
                    <p className="text-xs text-[#6d6e71] mt-0.5">
                      {selectedCliente.condicionIva} · {selectedCliente.domicilio}, {selectedCliente.localidad} ({selectedCliente.provincia})
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-[10px] uppercase font-bold text-[#9e9e9e] block">
                      Perfil de Riesgo
                    </span>
                    <span className="inline-block text-xs font-bold px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-900">
                      {selectedCliente.perfilRiesgo || 'Bajo'}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-1">
                      Alta: {selectedCliente.fechaAlta}
                    </span>
                  </div>
                </div>

                {/* Primary Action Toolbar */}
                <div className="pt-2 flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleOpenVer(selectedCliente)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg text-xs flex items-center space-x-1.5 cursor-pointer transition-all border border-slate-300"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#005a9e]" />
                    <span>Ver Legajo Completo</span>
                  </button>

                  {selectedCliente.estado === 'Activo' || !selectedCliente.estado ? (
                    <>
                      <button
                        onClick={() => handleOpenModificar(selectedCliente)}
                        className="px-3 py-1.5 bg-[#005a9e] hover:bg-[#007bc1] text-white font-bold rounded-lg text-xs flex items-center space-x-1.5 cursor-pointer transition-all shadow-xs"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Modificar Cliente</span>
                      </button>
                      <button
                        onClick={() => handleOpenInhabilitar(selectedCliente)}
                        className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold rounded-lg text-xs flex items-center space-x-1.5 cursor-pointer transition-all"
                      >
                        <ShieldOff className="w-3.5 h-3.5 text-amber-700" />
                        <span>Inhabilitar Cliente</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleOpenHabilitar(selectedCliente)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs flex items-center space-x-1.5 cursor-pointer transition-all shadow-xs"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Habilitar Cliente</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Contact Data Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="bg-slate-50 p-3 rounded-lg border border-[#c7c7c7] space-y-1">
                  <span className="text-[#9e9e9e] flex items-center space-x-1 text-[11px] font-bold">
                    <Phone className="w-3 h-3 text-[#005a9e]" />
                    <span>Teléfono Principal</span>
                  </span>
                  <span className="font-semibold text-slate-800 block">{selectedCliente.telefono}</span>
                  {selectedCliente.telefonoSecundario && (
                    <span className="text-[10px] text-slate-500 block">
                      Secundario: {selectedCliente.telefonoSecundario}
                    </span>
                  )}
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-[#c7c7c7] space-y-1">
                  <span className="text-emerald-700 flex items-center space-x-1 text-[11px] font-bold">
                    <MessageCircle className="w-3 h-3 text-emerald-600" />
                    <span>WhatsApp (Específico)</span>
                  </span>
                  <span className="font-semibold text-slate-800 block">
                    {selectedCliente.whatsapp || selectedCliente.telefono}
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    Preferido: {selectedCliente.medioContactoPreferido || 'WhatsApp'}
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-[#c7c7c7] space-y-1">
                  <span className="text-[#9e9e9e] flex items-center space-x-1 text-[11px] font-bold">
                    <Mail className="w-3 h-3 text-[#007bc1]" />
                    <span>Email Principal</span>
                  </span>
                  <span className="font-semibold text-slate-800 block truncate" title={selectedCliente.email}>
                    {selectedCliente.email}
                  </span>
                  {selectedCliente.emailSecundario && (
                    <span className="text-[10px] text-slate-500 block truncate">
                      Secundario: {selectedCliente.emailSecundario}
                    </span>
                  )}
                </div>
              </div>

              {/* Linked Items: Polizas */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                    <FileText className="w-4 h-4 text-[#005a9e]" />
                    <span>Pólizas Vinculadas ({getPolizasCliente(selectedCliente.id).length})</span>
                  </h4>
                  <button
                    onClick={() => onNavigate('proceso-3')}
                    className="text-[11px] text-[#007bc1] font-bold hover:underline cursor-pointer"
                  >
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
                          <span className="font-mono text-[#005a9e]">
                            ${p.premioTotal.toLocaleString('es-AR')} ARS
                          </span>
                        </div>
                        <p className="text-[#6d6e71] text-[11px]">{p.objetoAsegurado || p.bienAsegurado}</p>
                        <div className="text-[10px] text-[#9e9e9e] flex justify-between">
                          <span>Vigencia: {p.vigenciaDesde} al {p.vigenciaHasta}</span>
                          <span className="font-bold text-emerald-700">{p.estado}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Linked Items: Vehiculos & ART */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Vehiculos */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                    <h4 className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                      <Car className="w-4 h-4 text-[#007bc1]" />
                      <span>Vehículos ({getVehiculosCliente(selectedCliente.id).length})</span>
                    </h4>
                    <button
                      onClick={() => onNavigate('proceso-4')}
                      className="text-[10px] text-[#007bc1] font-bold hover:underline cursor-pointer"
                    >
                      Ver todos
                    </button>
                  </div>

                  {getVehiculosCliente(selectedCliente.id).length === 0 ? (
                    <p className="text-[11px] text-[#9e9e9e] italic">Sin vehículos asociados.</p>
                  ) : (
                    getVehiculosCliente(selectedCliente.id).map((v) => (
                      <div key={v.id} className="p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg text-xs flex justify-between items-center">
                        <div>
                          <span className="font-bold text-slate-900 block">{v.marca} {v.modelo}</span>
                          <span className="text-[#9e9e9e] text-[10px]">Patente: {v.dominioChasis} {v.poseeGnc && '· [GNC]'}</span >
                        </div>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                          {v.estado}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                {/* ART */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                    <h4 className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                      <Briefcase className="w-4 h-4 text-[#005a9e]" />
                      <span>Contratos ART ({getArtsCliente(selectedCliente.id).length})</span>
                    </h4>
                    <button
                      onClick={() => onNavigate('proceso-5')}
                      className="text-[10px] text-[#007bc1] font-bold hover:underline cursor-pointer"
                    >
                      Ver todos
                    </button>
                  </div>

                  {getArtsCliente(selectedCliente.id).length === 0 ? (
                    <p className="text-[11px] text-[#9e9e9e] italic">Sin contratos ART.</p>
                  ) : (
                    getArtsCliente(selectedCliente.id).map((a) => (
                      <div key={a.id} className="p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg text-xs flex justify-between items-center">
                        <div>
                          <span className="font-bold text-slate-900 block">{a.numeroContrato}</span>
                          <span className="text-[#9e9e9e] text-[10px]">{a.cantidadCapitas} cápitas · Alícuota: {a.alicuotaPactada}%</span>
                        </div>
                        <span className="text-[10px] bg-blue-100 text-blue-900 font-bold px-2 py-0.5 rounded">
                          {a.estado}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Traceability Audit Trail Snippet */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                    <History className="w-4 h-4 text-[#005a9e]" />
                    <span>Trazabilidad y Auditoría ({selectedCliente.trazabilidad?.length || 0} Registros)</span>
                  </h4>
                  <button
                    onClick={() => handleOpenVer(selectedCliente)}
                    className="text-[11px] text-[#007bc1] font-bold hover:underline cursor-pointer"
                  >
                    Ver historial completo
                  </button>
                </div>

                {(!selectedCliente.trazabilidad || selectedCliente.trazabilidad.length === 0) ? (
                  <p className="text-[11px] text-slate-400 italic">No registra historial de modificaciones aún.</p>
                ) : (
                  <div className="space-y-1.5 max-h-36 overflow-y-auto">
                    {selectedCliente.trazabilidad.slice(0, 3).map((tr) => (
                      <div key={tr.id} className="p-2 bg-slate-50 rounded border border-slate-200 text-[11px] flex items-center justify-between">
                        <div className="space-y-0.5">
                          <div className="flex items-center space-x-2">
                            <span className={`px-1.5 py-0.2 rounded font-bold text-[9px] ${
                              tr.operacion === 'ALTA' ? 'bg-emerald-100 text-emerald-800' :
                              tr.operacion === 'MODIFICACIÓN' ? 'bg-blue-100 text-blue-800' :
                              tr.operacion === 'INHABILITACIÓN' ? 'bg-amber-100 text-amber-900' :
                              'bg-purple-100 text-purple-800'
                            }`}>
                              {tr.operacion}
                            </span>
                            <span className="font-medium text-slate-800">{tr.resumenModificacion || 'Operación registrada'}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 block">Usuario: {tr.usuario}</span>
                        </div>
                        <span className="font-mono text-[10px] text-slate-500 whitespace-nowrap">
                          {tr.fecha} {tr.hora}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-[#9e9e9e] text-xs">
              Seleccione un cliente para ver su legajo funcional.
            </div>
          )}
        </div>
      </div>

      {/* ============================================================= */}
      {/* MODAL 1: CONSULTA DE CLIENTE (VER) - READ ONLY */}
      {/* ============================================================= */}
      {showVerModal && verClienteTarget && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#c7c7c7] shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <div className="flex items-center space-x-2">
                <Eye className="w-5 h-5 text-[#005a9e]" />
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Legajo de Cliente (Modo Consulta - Solo Lectura)
                  </h3>
                  <span className="text-[10px] text-[#6d6e71]">
                    Identificador de Sistema: {verClienteTarget.id}
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowVerModal(false);
                  setVerClienteTarget(null);
                }}
                className="text-[#9e9e9e] hover:text-slate-900 font-bold text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* General Data Grid */}
            <div className="space-y-4 text-xs">
              {/* Identification Block */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-[#005a9e] text-xs uppercase tracking-wider flex items-center space-x-1.5">
                  <User className="w-4 h-4" />
                  <span>1. Identificación y Tipo de Cliente</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-[#9e9e9e] block text-[10px] uppercase font-bold">Tipo de Cliente</span>
                    <span className="font-bold text-slate-900">{verClienteTarget.tipo}</span>
                  </div>
                  <div>
                    <span className="text-[#9e9e9e] block text-[10px] uppercase font-bold">Documento / Identificación</span>
                    <span className="font-mono font-bold text-slate-900">
                      {verClienteTarget.tipoDocumento || 'CUIT/CUIL/DNI'}: {verClienteTarget.cuitCuilDni}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#9e9e9e] block text-[10px] uppercase font-bold">Estado Actual</span>
                    <span className={`inline-block font-bold px-2 py-0.5 rounded text-[10px] ${
                      verClienteTarget.estado === 'Inhabilitado' || verClienteTarget.estado === 'Inactivo'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {verClienteTarget.estado || 'Activo'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Personal / Societary Block */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-[#005a9e] text-xs uppercase tracking-wider flex items-center space-x-1.5">
                  <Building2 className="w-4 h-4" />
                  <span>2. Datos Personales o Societarios</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <span className="text-[#9e9e9e] block text-[10px] uppercase font-bold">Nombre Completo / Razón Social</span>
                    <span className="font-bold text-slate-900 text-sm">{verClienteTarget.nombreRazonSocial}</span>
                  </div>
                  <div>
                    <span className="text-[#9e9e9e] block text-[10px] uppercase font-bold">Nombre de Fantasía</span>
                    <span className="text-slate-800">{verClienteTarget.nombreFantasia || '(No especificado)'}</span>
                  </div>
                  <div>
                    <span className="text-[#9e9e9e] block text-[10px] uppercase font-bold">Condición frente al IVA</span>
                    <span className="font-semibold text-slate-800">{verClienteTarget.condicionIva}</span>
                  </div>
                  {verClienteTarget.tipo === 'Persona Física' && (
                    <>
                      <div>
                        <span className="text-[#9e9e9e] block text-[10px] uppercase font-bold">Fecha de Nacimiento</span>
                        <span className="text-slate-800">{verClienteTarget.fechaNacimiento || '(No especificada)'}</span>
                      </div>
                      <div>
                        <span className="text-[#9e9e9e] block text-[10px] uppercase font-bold">Sexo / Género</span>
                        <span className="text-slate-800">{verClienteTarget.sexo || '(No especificado)'}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Contact Data Block */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-[#005a9e] text-xs uppercase tracking-wider flex items-center space-x-1.5">
                  <Phone className="w-4 h-4" />
                  <span>3. Datos de Contacto</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-[#9e9e9e] block text-[10px] uppercase font-bold">Teléfono Principal</span>
                    <span className="font-semibold text-slate-800">{verClienteTarget.telefono}</span>
                  </div>
                  <div>
                    <span className="text-[#9e9e9e] block text-[10px] uppercase font-bold">Teléfono Secundario</span>
                    <span className="text-slate-800">{verClienteTarget.telefonoSecundario || '(No registrado)'}</span>
                  </div>
                  <div>
                    <span className="text-emerald-700 block text-[10px] uppercase font-bold">WhatsApp (Específico)</span>
                    <span className="font-bold text-emerald-800">{verClienteTarget.whatsapp || verClienteTarget.telefono}</span>
                  </div>
                  <div>
                    <span className="text-[#9e9e9e] block text-[10px] uppercase font-bold">Email Principal</span>
                    <span className="font-semibold text-slate-800">{verClienteTarget.email}</span>
                  </div>
                  <div>
                    <span className="text-[#9e9e9e] block text-[10px] uppercase font-bold">Email Secundario</span>
                    <span className="text-slate-800">{verClienteTarget.emailSecundario || '(No registrado)'}</span>
                  </div>
                  <div>
                    <span className="text-[#9e9e9e] block text-[10px] uppercase font-bold">Medio Preferido</span>
                    <span className="font-semibold text-[#005a9e]">{verClienteTarget.medioContactoPreferido || 'WhatsApp'}</span>
                  </div>
                </div>
              </div>

              {/* Address Block */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-[#005a9e] text-xs uppercase tracking-wider flex items-center space-x-1.5">
                  <MapPin className="w-4 h-4" />
                  <span>4. Domicilio Legal y Comercial</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <span className="text-[#9e9e9e] block text-[10px] uppercase font-bold">Domicilio / Calle</span>
                    <span className="font-semibold text-slate-800">{verClienteTarget.domicilio}</span>
                  </div>
                  <div>
                    <span className="text-[#9e9e9e] block text-[10px] uppercase font-bold">Localidad</span>
                    <span className="font-semibold text-slate-800">{verClienteTarget.localidad}</span>
                  </div>
                  <div>
                    <span className="text-[#9e9e9e] block text-[10px] uppercase font-bold">Provincia</span>
                    <span className="font-semibold text-slate-800">{verClienteTarget.provincia}</span>
                  </div>
                  <div>
                    <span className="text-[#9e9e9e] block text-[10px] uppercase font-bold">Código Postal</span>
                    <span className="font-semibold text-slate-800">{verClienteTarget.codigoPostal || '(No registrado)'}</span>
                  </div>
                  <div>
                    <span className="text-[#9e9e9e] block text-[10px] uppercase font-bold">Productor / Responsable</span>
                    <span className="font-semibold text-[#005a9e]">{verClienteTarget.productorResponsable || 'PAS Titular'}</span>
                  </div>
                </div>
              </div>

              {/* Audit & Traceability Full Trail */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-[#005a9e] text-xs uppercase tracking-wider flex items-center space-x-1.5">
                  <History className="w-4 h-4" />
                  <span>5. Historial Completo de Trazabilidad y Auditoría</span>
                </h4>

                {(!verClienteTarget.trazabilidad || verClienteTarget.trazabilidad.length === 0) ? (
                  <p className="text-slate-400 italic text-[11px]">No se registran eventos de auditoría previos.</p>
                ) : (
                  <div className="divide-y divide-slate-200 border border-slate-200 rounded-lg overflow-hidden bg-white">
                    {verClienteTarget.trazabilidad.map((tr) => (
                      <div key={tr.id} className="p-3 space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                              tr.operacion === 'ALTA' ? 'bg-emerald-100 text-emerald-800' :
                              tr.operacion === 'MODIFICACIÓN' ? 'bg-blue-100 text-blue-800' :
                              tr.operacion === 'INHABILITACIÓN' ? 'bg-amber-100 text-amber-900' :
                              'bg-purple-100 text-purple-800'
                            }`}>
                              {tr.operacion}
                            </span>
                            <span className="font-bold text-slate-900">{tr.resumenModificacion || 'Registro'}</span>
                          </div>
                          <span className="font-mono text-[10px] text-slate-500">
                            {tr.fecha} {tr.hora}
                          </span>
                        </div>

                        <div className="text-[10px] text-slate-500 flex items-center space-x-3">
                          <span>Usuario Responsable: <strong className="text-slate-700">{tr.usuario}</strong></span>
                          {tr.estadoAnterior && tr.estadoPosterior && tr.estadoAnterior !== tr.estadoPosterior && (
                            <span>
                              Estado: <span className="line-through">{tr.estadoAnterior}</span> → <strong className="text-[#005a9e]">{tr.estadoPosterior}</strong>
                            </span>
                          )}
                        </div>

                        {tr.datosModificados && tr.datosModificados.length > 0 && (
                          <div className="mt-1.5 p-2 bg-slate-50 rounded border border-slate-100 text-[10px] space-y-1">
                            <span className="font-bold text-slate-700 block">Detalle de campos modificados:</span>
                            <ul className="list-disc pl-4 space-y-0.5 text-slate-600">
                              {tr.datosModificados.map((dm, idx) => (
                                <li key={idx}>
                                  <strong>{dm.label || dm.campo}:</strong>{' '}
                                  <span className="line-through text-red-600">{String(dm.valorAnterior)}</span> →{' '}
                                  <span className="font-semibold text-emerald-700">{String(dm.valorNuevo)}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowVerModal(false);
                  setVerClienteTarget(null);
                }}
                className="px-5 py-2 bg-slate-800 text-white font-bold rounded-lg hover:bg-slate-900 cursor-pointer text-xs"
              >
                Cerrar Consulta
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* MODAL 2: MODIFICAR CLIENTE (SOLO PARA CLIENTES ACTIVOS) */}
      {/* ============================================================= */}
      {showModificarModal && modificarClienteTarget && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#c7c7c7] shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                  <Edit3 className="w-5 h-5 text-[#005a9e]" />
                  <span>Modificar Datos de Cliente (MOD-008)</span>
                </h3>
                <p className="text-xs text-[#6d6e71]">
                  Los campos de identificación base son inmutables para garantizar la integridad y trazabilidad.
                </p>
              </div>
              <button
                onClick={() => {
                  setShowModificarModal(false);
                  setModificarClienteTarget(null);
                }}
                className="text-[#9e9e9e] hover:text-slate-900 font-bold text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Error & Warning Messages */}
            {modFormErrors.length > 0 && (
              <div className="p-3.5 bg-red-50 border border-red-200 text-red-900 text-xs rounded-lg space-y-1">
                <div className="flex items-center space-x-1.5 font-bold text-red-800">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>No se puede proceder con la modificación:</span>
                </div>
                <ul className="list-disc pl-5 space-y-0.5">
                  {modFormErrors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            {modFormWarning && (
              <div className="p-3.5 bg-amber-50 border border-amber-300 text-amber-900 text-xs rounded-lg flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Advertencia de Coincidencia:</span>
                  <span>{modFormWarning}</span>
                </div>
              </div>
            )}

            {modFormInfo && (
              <div className="p-3 bg-blue-50 border border-blue-200 text-blue-900 text-xs rounded-lg flex items-start space-x-2">
                <Info className="w-4 h-4 text-blue-700 flex-shrink-0 mt-0.5" />
                <span>{modFormInfo}</span>
              </div>
            )}

            <form onSubmit={handleValidateModification} className="space-y-4 text-xs">
              {/* SECCIÓN: CAMPOS BLOQUEADOS (NO MODIFICABLES) */}
              <div className="p-3 bg-slate-100 rounded-lg border border-slate-300 space-y-2">
                <div className="flex items-center space-x-1.5 text-[#005a9e] font-bold">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Campos No Modificables (Bloqueados por Sistema)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Tipo de Cliente</label>
                    <input
                      type="text"
                      value={modificarClienteTarget.tipo}
                      disabled
                      className="w-full p-2 bg-slate-200/80 border border-slate-300 rounded-lg font-bold text-slate-700 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Tipo de Documento</label>
                    <input
                      type="text"
                      value={modificarClienteTarget.tipoDocumento || 'CUIT / CUIL / DNI'}
                      disabled
                      className="w-full p-2 bg-slate-200/80 border border-slate-300 rounded-lg font-bold text-slate-700 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Número de Documento</label>
                    <input
                      type="text"
                      value={modificarClienteTarget.cuitCuilDni}
                      disabled
                      className="w-full p-2 bg-slate-200/80 border border-slate-300 rounded-lg font-mono font-bold text-slate-700 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* SECCIÓN: DATOS PRINCIPALES MODIFICABLES */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-1">
                  Datos Principales y Fiscales
                </h4>

                {modificarClienteTarget.tipo === 'Persona Física' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Nombre *</label>
                      <input
                        type="text"
                        value={modForm.nombre}
                        onChange={(e) => setModForm({ ...modForm, nombre: e.target.value })}
                        className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg focus:ring-2 focus:ring-[#005a9e]"
                        required
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Apellido *</label>
                      <input
                        type="text"
                        value={modForm.apellido}
                        onChange={(e) => setModForm({ ...modForm, apellido: e.target.value })}
                        className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg focus:ring-2 focus:ring-[#005a9e]"
                        required
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Fecha de Nacimiento</label>
                      <input
                        type="date"
                        value={modForm.fechaNacimiento}
                        onChange={(e) => setModForm({ ...modForm, fechaNacimiento: e.target.value })}
                        className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Sexo / Género</label>
                      <select
                        value={modForm.sexo}
                        onChange={(e) => setModForm({ ...modForm, sexo: e.target.value as SexoCliente })}
                        className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg"
                      >
                        <option value="No especificado">No especificado</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Femenino">Femenino</option>
                        <option value="Otro">Otro</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="sm:col-span-2">
                      <label className="font-bold text-slate-700 block mb-1">Razón Social *</label>
                      <input
                        type="text"
                        value={modForm.nombreRazonSocial}
                        onChange={(e) => setModForm({ ...modForm, nombreRazonSocial: e.target.value })}
                        className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg focus:ring-2 focus:ring-[#005a9e]"
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Nombre de Fantasía</label>
                    <input
                      type="text"
                      value={modForm.nombreFantasia}
                      onChange={(e) => setModForm({ ...modForm, nombreFantasia: e.target.value })}
                      placeholder="Ej: Tisur Logística"
                      className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Condición IVA *</label>
                    <select
                      value={modForm.condicionIva}
                      onChange={(e) => setModForm({ ...modForm, condicionIva: e.target.value as CondicionIVA })}
                      className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg"
                      required
                    >
                      <option value="Consumidor Final">Consumidor Final</option>
                      <option value="Monotributo">Monotributo</option>
                      <option value="Responsable Inscripto">Responsable Inscripto</option>
                      <option value="Exento">Exento</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Perfil de Riesgo</label>
                    <select
                      value={modForm.perfilRiesgo}
                      onChange={(e) => setModForm({ ...modForm, perfilRiesgo: e.target.value as PerfilRiesgo })}
                      className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg"
                    >
                      <option value="Bajo">Bajo</option>
                      <option value="Medio">Medio</option>
                      <option value="Alto">Alto</option>
                      <option value="Corporativo">Corporativo</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SECCIÓN: DATOS DE CONTACTO (WHATSAPP ESPECÍFICO) */}
              <div className="space-y-3 pt-2">
                <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-1 flex items-center justify-between">
                  <span>Datos de Contacto y Comunicación</span>
                  <span className="text-[10px] text-emerald-700 font-bold flex items-center space-x-1">
                    <MessageCircle className="w-3 h-3" />
                    <span>WhatsApp independiente</span>
                  </span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Teléfono Principal *</label>
                    <input
                      type="text"
                      value={modForm.telefono}
                      onChange={(e) => setModForm({ ...modForm, telefono: e.target.value })}
                      placeholder="Ej: +54 11 4821-9900"
                      className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Teléfono Secundario</label>
                    <input
                      type="text"
                      value={modForm.telefonoSecundario}
                      onChange={(e) => setModForm({ ...modForm, telefonoSecundario: e.target.value })}
                      placeholder="Opcional"
                      className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-emerald-800 block mb-1 flex items-center space-x-1">
                      <MessageCircle className="w-3 h-3 text-emerald-600" />
                      <span>WhatsApp *</span>
                    </label>
                    <input
                      type="text"
                      value={modForm.whatsapp}
                      onChange={(e) => setModForm({ ...modForm, whatsapp: e.target.value })}
                      placeholder="Ej: +54 9 11 5566-7788"
                      className="w-full p-2 bg-emerald-50/50 border border-emerald-300 rounded-lg font-medium text-slate-900"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Email Principal *</label>
                    <input
                      type="email"
                      value={modForm.email}
                      onChange={(e) => setModForm({ ...modForm, email: e.target.value })}
                      placeholder="usuario@dominio.com"
                      className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Email Secundario</label>
                    <input
                      type="email"
                      value={modForm.emailSecundario}
                      onChange={(e) => setModForm({ ...modForm, emailSecundario: e.target.value })}
                      placeholder="Opcional"
                      className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Medio de Contacto Preferido</label>
                    <select
                      value={modForm.medioContactoPreferido}
                      onChange={(e) => setModForm({ ...modForm, medioContactoPreferido: e.target.value as MedioContactoPreferido })}
                      className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg"
                    >
                      <option value="WhatsApp">WhatsApp</option>
                      <option value="Email">Email</option>
                      <option value="Teléfono Principal">Teléfono Principal</option>
                      <option value="Teléfono Secundario">Teléfono Secundario</option>
                      <option value="Indiferente">Indiferente</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SECCIÓN: DOMICILIO */}
              <div className="space-y-3 pt-2">
                <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-1">
                  Domicilio y Ubicación
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="sm:col-span-2">
                    <label className="font-bold text-slate-700 block mb-1">Calle / Avenida</label>
                    <input
                      type="text"
                      value={modForm.calle}
                      onChange={(e) => setModForm({ ...modForm, calle: e.target.value })}
                      placeholder="Ej: Av. Industrial"
                      className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Número / Altura</label>
                    <input
                      type="text"
                      value={modForm.numero}
                      onChange={(e) => setModForm({ ...modForm, numero: e.target.value })}
                      placeholder="Ej: 4550"
                      className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Piso</label>
                      <input
                        type="text"
                        value={modForm.piso}
                        onChange={(e) => setModForm({ ...modForm, piso: e.target.value })}
                        placeholder="Ej: 4"
                        className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Depto</label>
                      <input
                        type="text"
                        value={modForm.depto}
                        onChange={(e) => setModForm({ ...modForm, depto: e.target.value })}
                        placeholder="Ej: B"
                        className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Localidad *</label>
                    <input
                      type="text"
                      value={modForm.localidad}
                      onChange={(e) => setModForm({ ...modForm, localidad: e.target.value })}
                      className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Provincia *</label>
                    <input
                      type="text"
                      value={modForm.provincia}
                      onChange={(e) => setModForm({ ...modForm, provincia: e.target.value })}
                      className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Código Postal</label>
                    <input
                      type="text"
                      value={modForm.codigoPostal}
                      onChange={(e) => setModForm({ ...modForm, codigoPostal: e.target.value })}
                      placeholder="Ej: B1870"
                      className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* SECCIÓN: OBSERVACIONES & NOTAS ADMINISTRATIVAS */}
              <div className="space-y-3 pt-2">
                <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-1">
                  Notas y Observaciones Internas
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Productor / Responsable Asignado</label>
                    <select
                      value={modForm.productorResponsable}
                      onChange={(e) => setModForm({ ...modForm, productorResponsable: e.target.value })}
                      className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg"
                    >
                      <option value="PAS Titular">PAS Titular</option>
                      <option value="Organizador Principal">Organizador Principal</option>
                      <option value="Asistente Comercial">Asistente Comercial</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Notas Administrativas</label>
                    <input
                      type="text"
                      value={modForm.notasAdministrativas}
                      onChange={(e) => setModForm({ ...modForm, notasAdministrativas: e.target.value })}
                      placeholder="Información contable, horarios de cobro..."
                      className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="font-bold text-slate-700 block mb-1">Observaciones Generales</label>
                    <textarea
                      rows={2}
                      value={modForm.notas}
                      onChange={(e) => setModForm({ ...modForm, notas: e.target.value })}
                      placeholder="Detalles sobre siniestralidad, pólizas contratadas o requerimientos especiales..."
                      className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModificarModal(false);
                    setModificarClienteTarget(null);
                  }}
                  className="px-4 py-2 border border-[#c7c7c7] text-[#6d6e71] rounded-lg hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#005a9e] text-white font-bold rounded-lg hover:bg-[#007bc1] cursor-pointer shadow-xs flex items-center space-x-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Revisar y Confirmar Cambios</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* MODAL 3: CONFIRMAR MODIFICACIÓN (RESUMEN DE CAMBIOS) */}
      {/* ============================================================= */}
      {showConfirmModificacionModal && pendingModifiedClient && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#c7c7c7] shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center space-x-2 text-[#005a9e] border-b border-slate-200 pb-3">
              <FileCheck className="w-6 h-6" />
              <div>
                <h3 className="text-base font-bold text-slate-900">CONFIRMAR MODIFICACIÓN</h3>
                <p className="text-xs text-slate-500">
                  Cliente: <strong>{pendingModifiedClient.nombreRazonSocial}</strong> ({pendingModifiedClient.cuitCuilDni})
                </p>
              </div>
            </div>

            {/* Warnings if any */}
            {pendingDuplicatesResult?.dniCuitCorrespondenceMatch && (
              <div className="p-3 bg-amber-50 border border-amber-300 text-amber-900 text-xs rounded-lg flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">⚠️ POSIBLE CLIENTE EXISTENTE:</span>
                  <span>{pendingDuplicatesResult.dniCuitCorrespondenceMatch.message}</span>
                </div>
              </div>
            )}

            {pendingDuplicatesResult?.level2StrongMatch && (
              <div className="p-3 bg-amber-50 border border-amber-300 text-amber-900 text-xs rounded-lg flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">⚠️ ADVERTENCIA DE HOMÓNIMO / DATOS DUPLICADOS:</span>
                  <span>{pendingDuplicatesResult.level2StrongMatch.message}</span>
                </div>
              </div>
            )}

            <div className="space-y-2 text-xs">
              <p className="font-bold text-slate-800">
                Se modificarán los siguientes {pendingDifferences.length} campo(s):
              </p>
              <div className="max-h-48 overflow-y-auto divide-y divide-slate-100 bg-slate-50 p-3 rounded-lg border border-slate-200">
                {pendingDifferences.map((diff, idx) => (
                  <div key={idx} className="py-1.5 text-xs">
                    <span className="font-bold text-slate-900 block">• {diff.label}:</span>
                    <div className="flex items-center space-x-2 text-[11px] pl-3 mt-0.5">
                      <span className="line-through text-red-600 truncate max-w-[140px]">{String(diff.valorAnterior)}</span>
                      <ArrowRight className="w-3 h-3 text-slate-400 flex-shrink-0" />
                      <span className="font-semibold text-emerald-700 truncate max-w-[160px]">{String(diff.valorNuevo)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs text-slate-600 font-medium">
              ¿Desea confirmar estos cambios y registrar la trazabilidad de la operación?
            </p>

            <div className="pt-3 border-t border-slate-200 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowConfirmModificacionModal(false)}
                className="px-4 py-2 border border-[#c7c7c7] text-[#6d6e71] rounded-lg hover:bg-slate-50 cursor-pointer text-xs"
              >
                CANCELAR
              </button>
              <button
                type="button"
                onClick={handleExecuteConfirmedModification}
                className="px-4 py-2 bg-[#005a9e] text-white font-bold rounded-lg hover:bg-[#007bc1] cursor-pointer text-xs shadow-xs"
              >
                CONFIRMAR CAMBIOS
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* MODAL 4: INHABILITAR CLIENTE (CONFIRMACIÓN EXPRESA) */}
      {/* ============================================================= */}
      {showInhabilitarModal && inhabilitarTarget && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#c7c7c7] shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center space-x-2 text-amber-700 border-b border-slate-200 pb-3">
              <ShieldOff className="w-6 h-6 flex-shrink-0" />
              <h3 className="text-base font-bold text-slate-900">
                ¿Desea inhabilitar este cliente?
              </h3>
            </div>

            <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-lg text-xs space-y-2 text-amber-950">
              <p className="font-bold text-amber-900">
                Cliente: {inhabilitarTarget.nombreRazonSocial} ({inhabilitarTarget.cuitCuilDni})
              </p>
              <ul className="space-y-1.5 pl-1 text-slate-700">
                <li className="flex items-start space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span>El cliente no será eliminado.</span>
                </li>
                <li className="flex items-start space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span>Conservará toda su información e historial.</span>
                </li>
                <li className="flex items-start space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span>Permanecerá disponible para consulta.</span>
                </li>
                <li className="flex items-start space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span>Dejará de estar disponible como cliente activo para nuevas operaciones.</span>
                </li>
                <li className="flex items-start space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span>Esta acción no modifica ni elimina pólizas, vehículos, ART, cobranzas, renovaciones ni documentación asociada.</span>
                </li>
              </ul>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => {
                  setShowInhabilitarModal(false);
                  setInhabilitarTarget(null);
                }}
                className="px-4 py-2 border border-[#c7c7c7] text-[#6d6e71] rounded-lg hover:bg-slate-50 cursor-pointer text-xs"
              >
                CANCELAR
              </button>
              <button
                type="button"
                onClick={handleExecuteInhabilitar}
                className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-lg cursor-pointer text-xs shadow-xs"
              >
                INHABILITAR CLIENTE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* MODAL 5: HABILITAR CLIENTE (CONFIRMACIÓN EXPRESA) */}
      {/* ============================================================= */}
      {showHabilitarModal && habilitarTarget && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#c7c7c7] shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center space-x-2 text-emerald-700 border-b border-slate-200 pb-3">
              <ShieldCheck className="w-6 h-6 flex-shrink-0" />
              <h3 className="text-base font-bold text-slate-900">
                ¿Desea habilitar nuevamente este cliente?
              </h3>
            </div>

            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-lg text-xs space-y-2 text-emerald-950">
              <p className="font-bold text-emerald-900">
                Cliente: {habilitarTarget.nombreRazonSocial} ({habilitarTarget.cuitCuilDni})
              </p>
              <ul className="space-y-1.5 pl-1 text-slate-700">
                <li className="flex items-start space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>El cliente volverá a estar disponible como cliente activo.</span>
                </li>
                <li className="flex items-start space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Su información e historial no serán modificados.</span>
                </li>
              </ul>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => {
                  setShowHabilitarModal(false);
                  setHabilitarTarget(null);
                }}
                className="px-4 py-2 border border-[#c7c7c7] text-[#6d6e71] rounded-lg hover:bg-slate-50 cursor-pointer text-xs"
              >
                CANCELAR
              </button>
              <button
                type="button"
                onClick={handleExecuteHabilitar}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg cursor-pointer text-xs shadow-xs"
              >
                HABILITAR CLIENTE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* MODAL 6: ALTA DE CLIENTE (PROCESO 1) CON VALIDACIONES Y CUIT/DNI */}
      {/* ============================================================= */}
      {showAltaModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#c7c7c7] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <Plus className="w-5 h-5 text-[#005a9e]" />
                <span>Alta de Nuevo Cliente (Proceso 1)</span>
              </h3>
              <button
                onClick={() => setShowAltaModal(false)}
                className="text-[#9e9e9e] hover:text-slate-900 font-bold text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {altaFormErrors.length > 0 && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-900 text-xs rounded-lg space-y-1">
                <div className="flex items-center space-x-1.5 font-bold text-red-800">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>Por favor revise los siguientes datos:</span>
                </div>
                <ul className="list-disc pl-5 space-y-0.5">
                  {altaFormErrors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            {altaFormWarning && (
              <div className="p-3 bg-amber-50 border border-amber-300 text-amber-900 text-xs rounded-lg flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Advertencia de Coincidencia:</span>
                  <span>{altaFormWarning}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleValidateAndSubmitAlta} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tipo de Cliente *</label>
                  <select
                    value={altaTipo}
                    onChange={(e) => setAltaTipo(e.target.value as TipoCliente)}
                    className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg"
                  >
                    <option value="Persona Física">Persona Física</option>
                    <option value="Persona Jurídica">Persona Jurídica</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tipo Documento *</label>
                  <select
                    value={altaTipoDoc}
                    onChange={(e) => setAltaTipoDoc(e.target.value as TipoDocumentoCliente)}
                    className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg"
                  >
                    <option value="CUIT">CUIT</option>
                    <option value="CUIL">CUIL</option>
                    <option value="DNI">DNI</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {altaTipoDoc} (Número) *
                  </label>
                  <input
                    type="text"
                    placeholder={altaTipoDoc === 'DNI' ? 'Ej: 32890123' : '20-32890123-4'}
                    value={altaNumDoc}
                    onChange={(e) => setAltaNumDoc(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg font-mono focus:ring-2 focus:ring-[#005a9e]"
                    required
                  />
                </div>
              </div>

              {altaTipo === 'Persona Física' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Nombre *</label>
                    <input
                      type="text"
                      placeholder="Ej: Juan Manuel"
                      value={altaNombre}
                      onChange={(e) => setAltaNombre(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Apellido *</label>
                    <input
                      type="text"
                      placeholder="Ej: Pérez"
                      value={altaApellido}
                      onChange={(e) => setAltaApellido(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg"
                      required
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Razón Social *</label>
                  <input
                    type="text"
                    placeholder="Ej: Transportes del Plata S.A."
                    value={altaRazonSocial}
                    onChange={(e) => setAltaRazonSocial(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg"
                    required
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nombre de Fantasía</label>
                  <input
                    type="text"
                    placeholder="Opcional"
                    value={altaNombreFantasia}
                    onChange={(e) => setAltaNombreFantasia(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Condición IVA *</label>
                  <select
                    value={altaIva}
                    onChange={(e) => setAltaIva(e.target.value as CondicionIVA)}
                    className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg"
                  >
                    <option value="Consumidor Final">Consumidor Final</option>
                    <option value="Monotributo">Monotributo</option>
                    <option value="Responsable Inscripto">Responsable Inscripto</option>
                    <option value="Exento">Exento</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Perfil de Riesgo</label>
                  <select
                    value={altaPerfil}
                    onChange={(e) => setAltaPerfil(e.target.value as PerfilRiesgo)}
                    className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg"
                  >
                    <option value="Bajo">Bajo</option>
                    <option value="Medio">Medio</option>
                    <option value="Alto">Alto</option>
                    <option value="Corporativo">Corporativo</option>
                  </select>
                </div>
              </div>

              {/* Contacts */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Teléfono Principal *</label>
                  <input
                    type="text"
                    placeholder="Ej: +54 11 4821-9900"
                    value={altaTel}
                    onChange={(e) => setAltaTel(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-emerald-800 block mb-1">WhatsApp (Específico) *</label>
                  <input
                    type="text"
                    placeholder="Ej: +54 9 11 5566-7788"
                    value={altaWhatsapp}
                    onChange={(e) => setAltaWhatsapp(e.target.value)}
                    className="w-full p-2 bg-emerald-50/50 border border-emerald-300 rounded-lg text-slate-900 font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Email Principal *</label>
                  <input
                    type="email"
                    placeholder="usuario@dominio.com"
                    value={altaEmail}
                    onChange={(e) => setAltaEmail(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg"
                    required
                  />
                </div>
              </div>

              {/* Address */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Domicilio / Calle</label>
                  <input
                    type="text"
                    placeholder="Ej: Av. Belgrano 1240"
                    value={altaCalle}
                    onChange={(e) => setAltaCalle(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Localidad *</label>
                  <input
                    type="text"
                    value={altaLocalidad}
                    onChange={(e) => setAltaLocalidad(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Provincia *</label>
                  <input
                    type="text"
                    value={altaProvincia}
                    onChange={(e) => setAltaProvincia(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-[#c7c7c7] rounded-lg"
                    required
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAltaModal(false)}
                  className="px-4 py-2 border border-[#c7c7c7] text-[#6d6e71] rounded-lg hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#005a9e] text-white font-bold rounded-lg hover:bg-[#007bc1] cursor-pointer shadow-xs"
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
