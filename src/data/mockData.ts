import {
  Cliente,
  Aseguradora,
  Poliza,
  Vehiculo,
  ContratoART,
  ReglaAutomatizacion,
  AlertaTarea,
  RenovacionItem
} from '../types';

export const INITIAL_CLIENTES: Cliente[] = [
  {
    id: 'cli-1',
    cuitCuilDni: '30-71234567-8',
    tipo: 'Persona Jurídica',
    nombreRazonSocial: 'Transportes e Industrias del Sur S.R.L.',
    condicionIva: 'Responsable Inscripto',
    email: 'contacto@tisur.com.ar',
    telefono: '+54 11 4821-9900',
    domicilio: 'Av. Industrial 4550',
    localidad: 'Avellaneda',
    provincia: 'Buenos Aires',
    perfilRiesgo: 'Corporativo',
    fechaAlta: '2023-03-15',
    estado: 'Activo',
    notas: 'Cliente corporativo con flota pesada y ART de 42 empleados.'
  },
  {
    id: 'cli-2',
    cuitCuilDni: '20-32890123-4',
    tipo: 'Persona Física',
    nombreRazonSocial: 'González, Roberto Carlos',
    condicionIva: 'Monotributo',
    email: 'roberto.gonzalez@gmail.com',
    telefono: '+54 9 11 5432-8877',
    domicilio: 'Calle Belgrano 1240',
    localidad: 'Rosario',
    provincia: 'Santa Fe',
    perfilRiesgo: 'Bajo',
    fechaAlta: '2022-08-10',
    estado: 'Activo',
    notas: 'Posee vehículo SUV con GNC y seguro de Combinado Familiar.'
  },
  {
    id: 'cli-3',
    cuitCuilDni: '27-25443210-9',
    tipo: 'Persona Física',
    nombreRazonSocial: 'Fernández, María Elena',
    condicionIva: 'Consumidor Final',
    email: 'mf_elena@hotmail.com',
    telefono: '+54 9 351 412-3344',
    domicilio: 'Av. Colón 890, 4to B',
    localidad: 'Córdoba Capital',
    provincia: 'Córdoba',
    perfilRiesgo: 'Bajo',
    fechaAlta: '2024-01-20',
    estado: 'Activo'
  },
  {
    id: 'cli-4',
    cuitCuilDni: '30-68991234-1',
    tipo: 'Persona Jurídica',
    nombreRazonSocial: 'Agropecuaria El Ombú S.A.',
    condicionIva: 'Responsable Inscripto',
    email: 'administracion@elombuagro.com.ar',
    telefono: '+54 249 443-1200',
    domicilio: 'Ruta Nacional 226 Km 162',
    localidad: 'Tandil',
    provincia: 'Buenos Aires',
    perfilRiesgo: 'Alto',
    fechaAlta: '2021-11-05',
    estado: 'Activo',
    notas: 'Polizas Agrícolas, Maquinaria Vial y ART.'
  },
  {
    id: 'cli-5',
    cuitCuilDni: '20-28112345-6',
    tipo: 'Persona Física',
    nombreRazonSocial: 'Martínez, Juan Pablo',
    condicionIva: 'Monotributo',
    email: 'jpmartinez.arq@gmail.com',
    telefono: '+54 9 11 6543-2109',
    domicilio: 'Av. Libertador 3200',
    localidad: 'Vicente López',
    provincia: 'Buenos Aires',
    perfilRiesgo: 'Medio',
    fechaAlta: '2023-09-01',
    estado: 'Activo'
  }
];

export const INITIAL_ASEGURADORAS: Aseguradora[] = [
  {
    id: 'aseg-1',
    nombre: 'Federación Patronal Seguros S.A.',
    cuit: '30-50004512-3',
    codigoProductor: 'PAS-88412',
    codigoOrganizador: 'ORG-1020',
    ramosHabilitados: ['Automotores', 'Combinado Familiar', 'Integral de Comercio', 'Accidentes Personales', 'Agro'],
    estadoSsn: 'Habilitada',
    telefonoSoporte: '0810-222-7800',
    emailSuscripcion: 'emision@fedpat.com.ar',
    comisionPromedio: 18.5,
    estado: 'Activa'
  },
  {
    id: 'aseg-2',
    nombre: 'San Cristóbal Seguros',
    cuit: '30-50005432-1',
    codigoProductor: 'PAS-43920',
    ramosHabilitados: ['Automotores', 'Combinado Familiar', 'Responsabilidad Civil', 'Caución'],
    estadoSsn: 'Habilitada',
    telefonoSoporte: '0810-222-8888',
    emailSuscripcion: 'suscripcion@sancristobal.com.ar',
    comisionPromedio: 17.0,
    estado: 'Activa'
  },
  {
    id: 'aseg-3',
    nombre: 'La Segunda Cooperativa de Seguros',
    cuit: '30-50001234-9',
    codigoProductor: 'PAS-12093',
    ramosHabilitados: ['Automotores', 'Agro', 'Vida', 'Combinado Familiar'],
    estadoSsn: 'Habilitada',
    telefonoSoporte: '0800-444-5222',
    emailSuscripcion: 'produccion@lasegunda.com.ar',
    comisionPromedio: 19.0,
    estado: 'Activa'
  },
  {
    id: 'aseg-4',
    nombre: 'Experta ART',
    cuit: '30-68421098-4',
    codigoProductor: 'PAS-77312',
    ramosHabilitados: ['Riesgos del Trabajo (ART)'],
    estadoSsn: 'Habilitada',
    telefonoSoporte: '0800-888-0278',
    emailSuscripcion: 'comercial@experta.com.ar',
    comisionPromedio: 8.5,
    estado: 'Activa'
  },
  {
    id: 'aseg-5',
    nombre: 'Zurich Argentina Seguros',
    cuit: '30-50009988-7',
    codigoProductor: 'PAS-30911',
    ramosHabilitados: ['Automotores', 'Integral de Comercio', 'Caución', 'Vida'],
    estadoSsn: 'Habilitada',
    telefonoSoporte: '0800-333-9874',
    emailSuscripcion: 'agentes@zurich.com.ar',
    comisionPromedio: 20.0,
    estado: 'Activa'
  }
];

export const INITIAL_POLIZAS: Poliza[] = [
  {
    id: 'pol-101',
    numeroPoliza: '0800-4592019',
    endoso: '000',
    clienteId: 'cli-1',
    aseguradoraId: 'aseg-1',
    ramo: 'Automotores',
    vigenciaDesde: '2025-09-01',
    vigenciaHasta: '2026-09-01',
    sumaAsegurada: 45000000,
    primaNeta: 120000,
    premioTotal: 185000,
    planCuotas: 12,
    estado: 'Vigente',
    objetoAsegurado: 'Flota 3 Unidades (Camión Mercedes Benz Actros + 2 Hilux)'
  },
  {
    id: 'pol-102',
    numeroPoliza: 'SC-992012',
    endoso: '001',
    clienteId: 'cli-2',
    aseguradoraId: 'aseg-2',
    ramo: 'Automotores',
    vigenciaDesde: '2025-03-15',
    vigenciaHasta: '2026-08-15', // Próxima a vencer en 14 días
    sumaAsegurada: 18500000,
    primaNeta: 48000,
    premioTotal: 72000,
    planCuotas: 6,
    estado: 'En Renovación',
    objetoAsegurado: 'Volkswagen Suran Cross 1.6 (Dominio AB 432 CD) c/GNC'
  },
  {
    id: 'pol-103',
    numeroPoliza: 'LS-3349120',
    endoso: '000',
    clienteId: 'cli-3',
    aseguradoraId: 'aseg-3',
    ramo: 'Combinado Familiar',
    vigenciaDesde: '2025-01-10',
    vigenciaHasta: '2026-08-28', // Vence este mes
    sumaAsegurada: 85000000,
    primaNeta: 25000,
    premioTotal: 38000,
    planCuotas: 12,
    estado: 'Vigente',
    objetoAsegurado: 'Inmueble residencial Av. Colón 890 4to B, Córdoba'
  },
  {
    id: 'pol-104',
    numeroPoliza: 'FP-7721092',
    endoso: '000',
    clienteId: 'cli-4',
    aseguradoraId: 'aseg-1',
    ramo: 'Agro',
    vigenciaDesde: '2025-10-01',
    vigenciaHasta: '2026-10-01',
    sumaAsegurada: 220000000,
    primaNeta: 340000,
    premioTotal: 490000,
    planCuotas: 4,
    estado: 'Vigente',
    objetoAsegurado: 'Maquinaria Agrícola Cosechadora John Deere S780 + Sembradora'
  },
  {
    id: 'pol-105',
    numeroPoliza: 'ZUR-112044',
    endoso: '002',
    clienteId: 'cli-5',
    aseguradoraId: 'aseg-5',
    ramo: 'Integral de Comercio',
    vigenciaDesde: '2025-06-01',
    vigenciaHasta: '2026-08-20', // Próxima a vencer
    sumaAsegurada: 110000000,
    primaNeta: 85000,
    premioTotal: 128000,
    planCuotas: 12,
    estado: 'En Renovación',
    objetoAsegurado: 'Estudio de Arquitectura y Maquetas, Vic. López'
  }
];

export const INITIAL_VEHICULOS: Vehiculo[] = [
  {
    id: 'veh-1',
    dominioChasis: 'AB 432 CD',
    es0kmSinPatente: false,
    marca: 'Volkswagen',
    modelo: 'Suran Cross 1.6 Highline',
    anio: 2018,
    tipoUso: 'Particular',
    combustible: 'GNC',
    poseeGnc: true,
    vencimientoGnc: '2026-08-10', // ALERTA OBLEA GNC VENCIDA EN POCOS DIAS
    polizaId: 'pol-102',
    clienteId: 'cli-2',
    estado: 'Cubierto'
  },
  {
    id: 'veh-2',
    dominioChasis: 'AF 891 ZX',
    es0kmSinPatente: false,
    marca: 'Toyota',
    modelo: 'Hilux SRV 4x4 2.8',
    anio: 2023,
    tipoUso: 'Carga / Logística',
    combustible: 'Diésel',
    poseeGnc: false,
    polizaId: 'pol-101',
    clienteId: 'cli-1',
    estado: 'Cubierto'
  },
  {
    id: 'veh-3',
    dominioChasis: '8AJ390123991203',
    es0kmSinPatente: true,
    marca: 'Ford',
    modelo: 'Ranger Limited V6 0km',
    anio: 2026,
    tipoUso: 'Particular',
    combustible: 'Diésel',
    poseeGnc: false,
    clienteId: 'cli-5',
    estado: 'Sin Cobertura'
  },
  {
    id: 'veh-4',
    dominioChasis: 'AE 112 LK',
    es0kmSinPatente: false,
    marca: 'Fiat',
    modelo: 'Cronos Precision 1.8 AT',
    anio: 2021,
    tipoUso: 'Particular',
    combustible: 'Nafta',
    poseeGnc: false,
    polizaId: 'pol-102',
    clienteId: 'cli-2',
    estado: 'Cubierto'
  }
];

export const INITIAL_ART: ContratoART[] = [
  {
    id: 'art-1',
    numeroContrato: 'ART-992014',
    clienteId: 'cli-1',
    aseguradoraId: 'aseg-4',
    ciiuActividad: '602300',
    descripcionActividad: 'Servicios de Transporte Automotor de Cargas Generales',
    masaSalarialEstimada: 48500000,
    cantidadTrabajadores: 42,
    alicuotaFija: 850,
    alicuotaVariable: 3.2,
    fechaInicioContrato: '2025-05-10', // LLEVA 15 MESES -> ELEGIBLE PARA TRASPASO
    mesesPermanencia: 15,
    esElegibleTraspaso: true,
    clausulasNoRepeticion: ['30-55443322-1 (Techint S.A.)', '33-70891234-9 (YPF S.A.)']
  },
  {
    id: 'art-2',
    numeroContrato: 'ART-441092',
    clienteId: 'cli-4',
    aseguradoraId: 'aseg-4',
    ciiuActividad: '011110',
    descripcionActividad: 'Cultivo de Cereales, Oleaginosas y Forrajeras',
    masaSalarialEstimada: 28000000,
    cantidadTrabajadores: 18,
    alicuotaFija: 920,
    alicuotaVariable: 2.8,
    fechaInicioContrato: '2026-02-01', // LLEVA 6 MESES -> NO ELEGIBLE AUN
    mesesPermanencia: 6,
    esElegibleTraspaso: false,
    clausulasNoRepeticion: ['30-60001234-5 (Cargill S.A.C.I.)']
  }
];

export const INITIAL_REGLAS: ReglaAutomatizacion[] = [
  {
    id: 'reg-1',
    titulo: 'Aviso Preventivo de Renovaciones (30 días)',
    descripcion: 'Escanea diariamente pólizas y contratos ART con vencimiento en los próximos 30 días y genera tareas en la agenda.',
    procesoOrigen: 7,
    disparador: 'Faltan 30 días para fin de vigencia técnica',
    frecuencia: 'Diaria a las 08:00 hs',
    modo: 'Tarea Agenda',
    estado: 'Activa',
    ejecucionesTotales: 342,
    ultimaEjecucion: '2026-08-01 08:00'
  },
  {
    id: 'reg-2',
    titulo: 'Inconsistencia de Oblea GNC Vencida',
    descripcion: 'Verifica la fecha de vencimiento de oblea GNC en vehículos cubiertos e informa al PAS para evitar rechazo de siniestros.',
    procesoOrigen: 4,
    disparador: 'Vencimiento de Oblea GNC <= 15 días',
    frecuencia: 'Semanal',
    modo: 'Alerta Panel',
    estado: 'Activa',
    ejecucionesTotales: 89,
    ultimaEjecucion: '2026-07-28 09:30'
  },
  {
    id: 'reg-3',
    titulo: 'Oportunidad de Traspaso de ART (Ley 24.557)',
    descripcion: 'Detecta contratos de ART con más de 12 meses de antigüedad y dispara sugerencia de re-cotización comparativa.',
    procesoOrigen: 5,
    disparador: 'Meses de permanencia >= 12 meses',
    frecuencia: 'Mensual',
    modo: 'Alerta Panel',
    estado: 'Activa',
    ejecucionesTotales: 24,
    ultimaEjecucion: '2026-08-01 00:00'
  },
  {
    id: 'reg-4',
    titulo: 'Alerta de Infraseguro por Inflación',
    descripcion: 'Monitorea pólizas con sumas aseguradas estancadas por más de 180 días en ramos de propiedad y vehículos.',
    procesoOrigen: 3,
    disparador: 'Suma asegurada sin endoso > 180 días',
    frecuencia: 'Quincenal',
    modo: 'Notificación PAS',
    estado: 'Activa',
    ejecucionesTotales: 156,
    ultimaEjecucion: '2026-07-15 10:00'
  }
];

export const INITIAL_ALERTAS_TAREAS: AlertaTarea[] = [
  {
    id: 'alt-1',
    titulo: 'Vencimiento Oblea GNC: Roberto Carlos González',
    descripcion: 'La oblea GNC del vehículo VW Suran (AB 432 CD) vence el 10/08/2026. Requiere actualización previa a renovación de póliza.',
    procesoOrigen: 4,
    prioridad: 'Alta',
    fechaCreacion: '2026-07-30',
    vencimiento: '2026-08-10',
    estado: 'Pendiente',
    clienteNombre: 'González, Roberto Carlos',
    targetProceso: 'proceso-4'
  },
  {
    id: 'alt-2',
    titulo: 'Re-cotización de Renovación: Integral de Comercio',
    descripcion: 'Póliza ZUR-112044 de Juan Pablo Martínez vence el 20/08/2026. Revisar ajuste de suma por inflación (+35%).',
    procesoOrigen: 7,
    prioridad: 'Alta',
    fechaCreacion: '2026-07-25',
    vencimiento: '2026-08-15',
    estado: 'Pendiente',
    clienteNombre: 'Martínez, Juan Pablo',
    targetProceso: 'proceso-7'
  },
  {
    id: 'alt-3',
    titulo: 'Oportunidad Traspaso ART: Transportes del Sur',
    descripcion: 'Contrato cumplicó 15 meses de permanencia en Experta ART. Analizar alícuotas competitivas en Galeno o Prevención ART.',
    procesoOrigen: 5,
    prioridad: 'Media',
    fechaCreacion: '2026-08-01',
    vencimiento: '2026-08-20',
    estado: 'Pendiente',
    clienteNombre: 'Transportes e Industrias del Sur S.R.L.',
    targetProceso: 'proceso-5'
  },
  {
    id: 'alt-4',
    titulo: 'Dominio Pendiente: Ford Ranger 0km',
    descripcion: 'Vehículo registrado por Chasis/Motor asignado a Juan Pablo Martínez. Requerir patente emitida.',
    procesoOrigen: 4,
    prioridad: 'Baja',
    fechaCreacion: '2026-07-20',
    vencimiento: '2026-08-25',
    estado: 'Pendiente',
    clienteNombre: 'Martínez, Juan Pablo',
    targetProceso: 'proceso-4'
  }
];

export const INITIAL_RENOVACIONES: RenovacionItem[] = [
  {
    id: 'ren-1',
    polizaId: 'pol-102',
    clienteNombre: 'González, Roberto Carlos',
    clienteCuit: '20-32890123-4',
    aseguradoraNombre: 'San Cristóbal Seguros',
    ramo: 'Automotores',
    vigenciaHasta: '2026-08-15',
    diasParaVencer: 14,
    sumaAseguradaActual: 18500000,
    sumaSugeridaInflacion: 24000000,
    premioActual: 72000,
    premioNuevaPropuesta: 94000,
    estadoRenovacion: 'En Negociación',
    siniestralidad: 'Sin Siniestros'
  },
  {
    id: 'ren-2',
    polizaId: 'pol-105',
    clienteNombre: 'Martínez, Juan Pablo',
    clienteCuit: '20-28112345-6',
    aseguradoraNombre: 'Zurich Argentina Seguros',
    ramo: 'Integral de Comercio',
    vigenciaHasta: '2026-08-20',
    diasParaVencer: 19,
    sumaAseguradaActual: 110000000,
    sumaSugeridaInflacion: 145000000,
    premioActual: 128000,
    premioNuevaPropuesta: 165000,
    estadoRenovacion: 'Pendiente',
    siniestralidad: 'Baja'
  },
  {
    id: 'ren-3',
    polizaId: 'pol-103',
    clienteNombre: 'Fernández, María Elena',
    clienteCuit: '27-25443210-9',
    aseguradoraNombre: 'La Segunda Seguros',
    ramo: 'Combinado Familiar',
    vigenciaHasta: '2026-08-28',
    diasParaVencer: 27,
    sumaAseguradaActual: 85000000,
    sumaSugeridaInflacion: 110000000,
    premioActual: 38000,
    premioNuevaPropuesta: 49000,
    estadoRenovacion: 'Pendiente',
    siniestralidad: 'Sin Siniestros'
  }
];
