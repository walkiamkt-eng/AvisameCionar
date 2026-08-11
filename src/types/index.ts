export type TipoCliente = 'Persona Física' | 'Persona Jurídica';
export type CondicionIVA = 'Responsable Inscripto' | 'Monotributo' | 'Consumidor Final' | 'Exento';
export type PerfilRiesgo = 'Bajo' | 'Medio' | 'Alto' | 'Corporativo';

export interface Cliente {
  id: string;
  productorId?: string;
  cuitCuilDni: string;
  tipo: TipoCliente;
  nombreRazonSocial: string;
  condicionIva: CondicionIVA;
  email: string;
  telefono: string;
  domicilio: string;
  localidad: string;
  provincia: string;
  perfilRiesgo: PerfilRiesgo;
  fechaAlta: string;
  estado: 'Activo' | 'Inactivo';
  notas?: string;
}

export interface Aseguradora {
  id: string;
  productorId?: string;
  nombre: string;
  cuit: string;
  codigoProductor: string;
  codigoOrganizador?: string;
  ramosHabilitados: string[];
  estadoSsn: 'Habilitada' | 'Inhabilitada' | 'Bajo Observación';
  telefonoSoporte: string;
  emailSuscripcion: string;
  comisionPromedio: number; // porcentaje
  estado: 'Activa' | 'Suspendida';
}

export type RamoSeguro = 
  | 'Automotores'
  | 'Combinado Familiar'
  | 'Integral de Comercio'
  | 'Integral de Consorcio'
  | 'Incendio'
  | 'Responsabilidad Civil'
  | 'Accidentes Personales'
  | 'Vida'
  | 'Riesgos del Trabajo (ART)'
  | 'Caución'
  | 'Agro'
  | 'Seguro Técnico'
  | 'Transporte de Mercaderías'
  | 'Robo y Riesgos Similares'
  | 'Salud / Sepelio';

export interface EndosoItem {
  id: string;
  numero: string;
  fecha: string;
  tipo: 'Modificación de Cobertura' | 'Aumento de Suma Asegurada' | 'Cambio de Domicilio' | 'Alta/Baja de Riesgo' | 'Refacturación / Cuotas' | 'Otro';
  descripcion: string;
  sumaAseguradaAnterior?: number;
  sumaAseguradaNueva?: number;
  premioAjuste?: number;
}

export interface Poliza {
  id: string;
  productorId?: string;
  numeroPoliza: string;
  endoso: string;
  clienteId: string;
  aseguradoraId: string;
  ramo: RamoSeguro;
  vigenciaDesde: string;
  vigenciaHasta: string;
  sumaAsegurada: number;
  primaNeta: number;
  premioTotal: number;
  planCuotas: number;
  estado: 'Vigente' | 'Anulada' | 'En Renovación' | 'Pendiente Emisión';
  fechaAnulacion?: string;
  motivoAnulacion?: string;
  objetoAsegurado?: string; // Mantenido para retrocompatibilidad
  bienAsegurado: string; // ej: "Toyota Hilux SRX 4x4 (Dominio AB 123 CD)"
  riesgoCubierto: string; // ej: "Automotores - Todo Riesgo c/Franquicia ARS 150.000"
  endosos?: EndosoItem[]; // Historial ilimitado de endosos registrados
}

export interface Vehiculo {
  id: string;
  productorId?: string;
  dominioChasis: string; // Patente o Chasis si es 0km
  es0kmSinPatente: boolean;
  marca: string;
  modelo: string;
  anio: number;
  tipoUso: 'Particular' | 'Comercial' | 'Carga / Logística' | 'Alquiler';
  combustible: 'Nafta' | 'Diésel' | 'GNC' | 'Híbrido / Eléctrico';
  poseeGnc: boolean;
  vencimientoGnc?: string;
  polizaId?: string;
  clienteId: string;
  estado: 'Cubierto' | 'Sin Cobertura';
}

export interface ContratoART {
  id: string;
  productorId?: string;
  numeroContrato: string;
  clienteId: string; // Empleador Tomador
  aseguradoraId: string; // ART Aseguradora
  ciiuActividad: string; // Clasificación Internacional Industrial Uniforme
  descripcionActividad: string;
  masaSalarialEstimada: number;
  cantidadTrabajadores: number;
  alicuotaFija: number; // Cuota fija por trabajador ARS
  alicuotaVariable: number; // % sobre masa salarial
  fechaInicioContrato: string;
  mesesPermanencia: number; // Monitoreo para los 12 meses de traspaso por Ley 24.557
  esElegibleTraspaso: boolean;
  clausulasNoRepeticion: string[]; // Listado de CUITs beneficiarios
}

export interface ReglaAutomatizacion {
  id: string;
  productorId?: string;
  titulo: string;
  descripcion: string;
  procesoOrigen: number;
  disparador: string;
  frecuencia: string;
  modo: 'Notificación PAS' | 'Alerta Panel' | 'Tarea Agenda' | 'Aviso Cliente';
  estado: 'Activa' | 'Pausada';
  ejecucionesTotales: number;
  ultimaEjecucion: string;
}

export interface AlertaTarea {
  id: string;
  productorId?: string;
  titulo: string;
  descripcion: string;
  procesoOrigen: number;
  prioridad: 'Alta' | 'Media' | 'Baja';
  fechaCreacion: string;
  vencimiento: string;
  estado: 'Pendiente' | 'Completada';
  clienteNombre?: string;
  targetProceso: string; // ID del proceso para navegacion
}

export type EstadoRenovacion =
  | 'pendiente'
  | 'en_negociacion'
  | 'concretada'
  | 'perdida_no_renueva';

export interface RenovacionItem {
  id: string;
  productorId?: string;
  polizaId: string;
  clienteNombre: string;
  clienteCuit: string;
  aseguradoraNombre: string;
  ramo: RamoSeguro;
  vigenciaHasta: string;
  diasParaVencer: number;
  sumaAseguradaActual: number;
  sumaSugeridaInflacion: number;
  premioActual: number;
  premioNuevaPropuesta: number;
  estadoRenovacion: EstadoRenovacion;
  siniestralidad: 'Sin Siniestros' | 'Baja' | 'Media' | 'Alta';
  fechaCierreGestion?: string;
}

export function parseLocalDate(dateStr: string): Date {
  if (!dateStr) return new Date();
  const cleanStr = dateStr.split('T')[0];
  const parts = cleanStr.split('-');
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    return new Date(year, month, day);
  }
  return new Date(dateStr);
}

export function getTodayDate(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function calculateDiasParaVencer(vigenciaHasta: string): number {
  if (!vigenciaHasta) return 0;
  const today = getTodayDate();
  const hasta = parseLocalDate(vigenciaHasta);
  const diffMs = hasta.getTime() - today.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export function isPolizaProximaAVencer(poliza: Poliza): boolean {
  if (!poliza || (poliza.estado && poliza.estado.toLowerCase() === 'anulada')) {
    return false;
  }
  const isVigente = poliza.estado?.toLowerCase() === 'vigente';
  if (!isVigente) return false;

  const today = getTodayDate();
  const desde = parseLocalDate(poliza.vigenciaDesde);
  if (today < desde) {
    return false;
  }

  const dias = calculateDiasParaVencer(poliza.vigenciaHasta);
  return dias >= 0 && dias <= 30;
}

export function normalizeEstadoRenovacion(estado: string): EstadoRenovacion {
  if (!estado) return 'pendiente';
  const e = estado.toLowerCase().trim();
  if (e === 'en negociación' || e === 'en_negociacion') return 'en_negociacion';
  if (e === 'concretada') return 'concretada';
  if (e === 'rechazada' || e === 'no_renueva' || e === 'perdida_no_renueva' || e === 'perdida / no renueva') {
    return 'perdida_no_renueva';
  }
  return 'pendiente';
}

export function isEstadoGestionCerrado(estadoGestion: EstadoRenovacion): boolean {
  const normalized = normalizeEstadoRenovacion(estadoGestion);
  return normalized === 'concretada' || normalized === 'perdida_no_renueva';
}

export function getRenovacionesUnificadas(
  polizas: Poliza[],
  renovacionesGuardadas: RenovacionItem[],
  clientes: Cliente[] = [],
  aseguradoras: Aseguradora[] = []
): RenovacionItem[] {
  const unificadas: RenovacionItem[] = [];
  const processedPolizaIds = new Set<string>();

  const savedMap = new Map<string, RenovacionItem>();
  for (const r of renovacionesGuardadas || []) {
    if (r.polizaId) {
      savedMap.set(r.polizaId, r);
    }
  }

  for (const poliza of polizas || []) {
    if (poliza.estado?.toLowerCase() === 'anulada') {
      continue;
    }

    processedPolizaIds.add(poliza.id);
    const saved = savedMap.get(poliza.id);

    if (saved) {
      const diasDin = calculateDiasParaVencer(poliza.vigenciaHasta);
      unificadas.push({
        ...saved,
        vigenciaHasta: poliza.vigenciaHasta,
        diasParaVencer: diasDin,
        estadoRenovacion: normalizeEstadoRenovacion(saved.estadoRenovacion)
      });
    } else {
      if (isPolizaProximaAVencer(poliza)) {
        const cliente = clientes.find((c) => c.id === poliza.clienteId);
        const aseguradora = aseguradoras.find((a) => a.id === poliza.aseguradoraId);
        const diasDin = calculateDiasParaVencer(poliza.vigenciaHasta);

        unificadas.push({
          id: `renovacion-virtual-${poliza.id}`,
          polizaId: poliza.id,
          clienteNombre: cliente?.nombreRazonSocial || 'Cliente',
          clienteCuit: cliente?.cuitCuilDni || '',
          aseguradoraNombre: aseguradora?.nombre || 'Compañía',
          ramo: poliza.ramo,
          vigenciaHasta: poliza.vigenciaHasta,
          diasParaVencer: diasDin,
          sumaAseguradaActual: poliza.sumaAsegurada,
          sumaSugeridaInflacion: Math.round(poliza.sumaAsegurada * 1.3),
          premioActual: poliza.premioTotal,
          premioNuevaPropuesta: Math.round(poliza.premioTotal * 1.3),
          estadoRenovacion: 'pendiente',
          siniestralidad: 'Sin Siniestros',
          productorId: poliza.productorId
        });
      }
    }
  }

  for (const saved of renovacionesGuardadas || []) {
    if (saved.polizaId && processedPolizaIds.has(saved.polizaId)) {
      continue;
    }
    const assocPol = polizas?.find((p) => p.id === saved.polizaId);
    if (assocPol && assocPol.estado?.toLowerCase() === 'anulada') {
      continue;
    }

    const diasDin = calculateDiasParaVencer(saved.vigenciaHasta);
    unificadas.push({
      ...saved,
      diasParaVencer: diasDin,
      estadoRenovacion: normalizeEstadoRenovacion(saved.estadoRenovacion)
    });
  }

  return unificadas;
}

export function getRenovacionesPendientes(
  polizas: Poliza[],
  renovacionesGuardadas: RenovacionItem[],
  clientes: Cliente[] = [],
  aseguradoras: Aseguradora[] = []
): RenovacionItem[] {
  const unificadas = getRenovacionesUnificadas(polizas, renovacionesGuardadas, clientes, aseguradoras);

  return unificadas.filter((r) => {
    const isClosed = isEstadoGestionCerrado(r.estadoRenovacion);
    if (isClosed) return false;

    return r.diasParaVencer >= 0 && r.diasParaVencer <= 30;
  });
}