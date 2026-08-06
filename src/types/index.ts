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
  | 'Accidentes Personales'
  | 'Vida'
  | 'Riesgos del Trabajo (ART)'
  | 'Caución'
  | 'Responsabilidad Civil'
  | 'Agro';

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
  objetoAsegurado: string; // ej: "Toyota Hilux AB123CD" o "Av. Corrientes 1234, CABA"
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
  estadoRenovacion: 'Pendiente' | 'En Negociación' | 'Concretada' | 'Rechazada';
  siniestralidad: 'Sin Siniestros' | 'Baja' | 'Media' | 'Alta';
}

