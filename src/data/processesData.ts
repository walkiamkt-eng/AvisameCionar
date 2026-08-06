export interface ProcessStructure {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  type: 'core' | 'transversal';
  objetivo: string;
  inicio: string;
  eventos: string[];
  flujoPrincipal: string[];
  decisiones: string[];
  excepciones: string[];
  interacciones: string[];
  finalizacion: string;
  alcance: string;
  responsabilidades: string[];
  queNoHace: string[];
  checklistValidacion: string[];
}

export const PROCESSES_DATA: ProcessStructure[] = [
  {
    id: 'proceso-1',
    number: 1,
    title: 'Administración de Clientes',
    subtitle: 'Gestión del ciclo de vida de Asegurados y Tomadores (Personas Físicas y Jurídicas)',
    type: 'core',
    objetivo: 'Administrar de manera integral el ciclo de vida de los clientes (asegurados, tomadores y contactos) del PAS, garantizando la consistencia, veracidad y trazabilidad de sus datos identificatorios, fiscales, de contacto y perfil de riesgo, asegurando el cumplimiento normativo (SSN / UIF) y sirviendo de base unívoca para todas las operaciones aseguradoras.',
    inicio: 'Inicia formalmente cuando una persona física o jurídica solicita una cotización, adquiere una cobertura o es dada de alta por primera vez en la cartera del PAS.',
    eventos: [
      'Ingreso de prospecto/nuevo cliente.',
      'Solicitud de modificación de datos personales o fiscales (ej. cambio de domicilio, condición IVA, mail).',
      'Detección de duplicidad de registro por CUIT/CUIL/DNI.',
      'Solicitud de baja o transferencia de cartera.',
      'Inhabilitación o reclasificación por perfil de riesgo o mora habitual.'
    ],
    flujoPrincipal: [
      'Identificación del tipo de cliente (Persona Física vs. Persona Jurídica).',
      'Ingreso y validación de datos unívocos obligatorios (DNI/CUIT/CUIL, Razón Social/Nombre Completo, Condición Fiscal ante el IVA).',
      'Registro de canales de contacto primarios y secundarios (Teléfono móvil, Correo electrónico verificado, Domicilio legal y de riesgo).',
      'Clasificación del perfil de cliente (Particulares, Pymes, Corporativo, Flotas, Agro) y grupo afín/familiar.',
      'Vinculación con pólizas vigentes, vehículos, ART y solicitudes en trámite.',
      'Mantenimiento continuo de historial de modificaciones y auditoría de cambios en datos sensibles.'
    ],
    decisiones: [
      '¿El CUIT/CUIL/DNI ya existe en la cartera? -> Si existe, unificar registro o asociar nuevo rol; si no existe, proceder con alta nueva.',
      '¿El cliente requiere verificación UIF por monto/materia asegurada? -> Si aplica, requerir documentación respaldatoria (Origen de fondos / Balance); si no, continuar.',
      '¿El cliente es Tomador, Asegurado o Ambos? -> Definir roles explícitos para facturación y certificados de cobertura.'
    ],
    excepciones: [
      'Cliente en nómina de ART que pasa a ser tomador de seguro individual.',
      'Cliente con CUIT/CUIL provisorio o persona extranjera con pasaporte/residencia precaria.',
      'Fallecimiento del titular persona física con continuidad contractual a nombre de la sucesión indivisa.'
    ],
    interacciones: [
      'Proceso 3 (Administración de Pólizas): Provee el titular/tomador para la emisión o modificación de contrataciones.',
      'Proceso 4 (Administración de Vehículos): Asigna titularidad o usufructo del rodado.',
      'Proceso 5 (Administración de ART): Asigna razón social empleadora e integrantes de nómina.',
      'Proceso 7 (Renovaciones): Provee datos de contacto actualizados para avisos de renovación.'
    ],
    finalizacion: 'Finaliza cuando la persona física o jurídica cesa completamente su relación comercial con el PAS y no posee pólizas vigentes, reclamos ni saldos pendientes, pasando a estado Inactivo/Histórico.',
    alcance: 'Abarca la recepción, validación, actualización y custodia de datos de clientes desde el primer contacto hasta el archivo histórico post-cancelación.',
    responsabilidades: [
      'Validar la exactitud de los datos fiscales y de identificación oficial conforme a normativas de la SSN y AFIP/ARCA.',
      'Mantener la confidencialidad y protección de datos personales de acuerdo con la legislación argentina (Ley 25.326).',
      'Asegurar que no existan registros duplicados en el sistema.'
    ],
    queNoHace: [
      'NO emite pólizas ni endosos.',
      'NO registra pagos ni gestiona cobranzas de cuotas.',
      'NO aprueba inspecciones previas de vehículos.',
      'NO evalúa riesgos de suscripción de las aseguradoras.'
    ],
    checklistValidacion: [
      '¿Está definida la condición de unicidad por CUIT/CUIL/DNI?',
      '¿Se distingue correctamente entre Persona Física y Persona Jurídica?',
      '¿El proceso permite guardar historial de cambios en datos fiscales?',
      '¿Está acotado para NO realizar cobranzas ni emision de coberturas?',
      '¿Tiene definidos los eventos de inicio y finalización unívocos?'
    ]
  },
  {
    id: 'proceso-2',
    number: 2,
    title: 'Administración de Aseguradoras',
    subtitle: 'Gestión de Compañías, Códigos de Productor, Ramos Autorisados y Parámetros Operativos',
    type: 'core',
    objetivo: 'Administrar el catálogo de Compañías Aseguradoras con las cuales el PAS opera, manteniendo actualizados los códigos de matrícula/organizador, ramos habilitados, vías de soporte, acuerdos de comisiones y parámetros de integración para la gestión de emisión y siniestros.',
    inicio: 'Inicia cuando una Compañía de Seguros otorga un código de productor u organizador habilitado para comercializar coberturas.',
    eventos: [
      'Alta de nueva compañía aseguradora y código de canal.',
      'Modificación de parámetros operativos (vías de contacto, portal web, vigencias de acuerdos).',
      'Baja o suspensión temporal de autorización para emitir en determinado ramo.',
      'Actualización de tablas de comisiones de la aseguradora.'
    ],
    flujoPrincipal: [
      'Registro de la Razón Social de la Compañía, CUIT y Matrícula SSN.',
      'Ingreso de Códigos de Productor / Organizador asignados por la entidad.',
      'Habilitación de Ramos autorizados (Automotores, Combinado Familiar, Integral de Comercio, Vida, ART, Caución, etc.).',
      'Configuración de contactos operativos (Suscripción, Emisión, Siniestros, Cobranzas, Mantenimiento de cuentas).',
      'Registro de condiciones de liquidación de comisiones contractuales.',
      'Mantenimiento de estado (Activa / Inactiva / Suspendida).'
    ],
    decisiones: [
      '¿La aseguradora está habilitada por SSN para el ramo solicitado? -> Si está habilitada, permitir carga de póliza; si no, bloquear comercialización.',
      '¿El código de PAS está activo en la aseguradora? -> Si está activo, vincular operativamente; si no, marcar alerta de inhabilitación.'
    ],
    excepciones: [
      'Aseguradora en proceso de liquidación o inhibición general de bienes dictada por la SSN.',
      'Fusiones o absorciones entre compañías aseguradoras que requieran unificación de códigos de producción.'
    ],
    interacciones: [
      'Proceso 3 (Administración de Pólizas): Determina las reglas y códigos válidos para registrar una póliza.',
      'Proceso 8 (Panel de Control): Aporta métricas de distribución de cartera por aseguradora.'
    ],
    finalizacion: 'Finaliza cuando el PAS rescinde la relación comercial o la aseguradora revoca definitivamente los códigos de producción y no quedan pólizas ni comisiones pendientes.',
    alcance: 'Abarca la parametrización operativa del vínculo comercial entre el PAS y las Compañías Aseguradoras.',
    responsabilidades: [
      'Mantener actualizados los códigos operativos de emisión.',
      'Verificar la vigencia de la matrícula y estado habilitante de las aseguradoras en la SSN.'
    ],
    queNoHace: [
      'NO liquida pagos de comisiones al PAS.',
      'NO modifica las condiciones contractuales generales de la aseguradora.',
      'NO reemplaza el portal corporativo de la compañía.'
    ],
    checklistValidacion: [
      '¿Están contemplados los códigos de productor y ramos por aseguradora?',
      '¿El proceso previene la emisión con aseguradoras inhabilitadas?',
      '¿Está acotado para NO liquidar comisiones internamente en este módulo?',
      '¿Registra el estado normativo dictado por SSN?'
    ]
  },
  {
    id: 'proceso-3',
    number: 3,
    title: 'Administración de Pólizas',
    subtitle: 'Registro y seguimiento del contrato de seguro (Vigencia, Endosos y Refrendos)',
    type: 'core',
    objetivo: 'Administrar el registro unificado y consistente de los contratos de seguro (pólizas, suplementos y endosos) vigentes en la cartera del PAS, manteniendo la trazabilidad estricta del riesgo cubierto, tomador, aseguradora, vigencia técnica, suma asegurada y bien cubierto.',
    inicio: 'Inicia cuando una póliza o endoso es emitida por la aseguradora y entra en vigencia técnica.',
    eventos: [
      'Ingreso de nueva póliza emitida.',
      'Recepción de endoso/refrendo (modificación de suma asegurada, cambio de bien, cambio de tomador, anulación parcial).',
      'Solicitud de anulación total del contrato.',
      'Vencimiento de la vigencia técnica de la póliza.'
    ],
    flujoPrincipal: [
      'Recepción del documento de póliza emitida o certificado de cobertura.',
      'Asociación unívoca del Cliente (Tomador/Asegurado) y Aseguradora/Ramo.',
      'Registro de número de póliza, endoso, vigencia desde/hasta, suma asegurada, plan de cuotas y prima/premio.',
      'Vinculación con el objeto asegurable (Vehículo, Inmueble, Nómina ART, Vida, etc.).',
      'Actualización de estados de la póliza (Vigente, Anulada, Vencida, Pendiente de Emisión).',
      'Pase al circuito de renovaciones al aproximarse el fin de vigencia.'
    ],
    decisiones: [
      '¿La póliza cuenta con refrendo o endoso emitido? -> Registrar como suplemento manteniendo el número de póliza madre.',
      '¿Solicita anulación por falta de pago o pedido del cliente? -> Marcar estado Anulada e informar vigencia efectiva final.'
    ],
    excepciones: [
      'Pólizas de vigencia irregular (ej. Seguro de Caución por obra o pólizas de viaje/transporte por viaje específico).',
      'Refrendos de refacturación automática sin cambio de cobertura.'
    ],
    interacciones: [
      'Proceso 1 (Administración de Clientes): Asocia la póliza a un titular.',
      'Proceso 2 (Administración de Aseguradoras): Valida el código de compañía y ramo.',
      'Proceso 4 (Administración de Vehículos): Registra el rodado bajo cobertura.',
      'Proceso 7 (Renovaciones): Transfiere la póliza cuando resta el período configurable de vigencia.'
    ],
    finalizacion: 'Finaliza cuando la póliza cumple su vigencia total, es reemplazada por un nuevo período en Renovaciones, o es anulada definitivamente.',
    alcance: 'Registro, actualización de estados y trazabilidad del contrato de seguro.',
    responsabilidades: [
      'Garantizar que no existan pólizas huérfanas de cliente o aseguradora.',
      'Reflejar con exactitud la vigencia técnica emitida por la compañía.'
    ],
    queNoHace: [
      'NO gestiona el cobro ni la cobranza de cuotas.',
      'NO almacena archivos adjuntos ni gestiona documentación física (pertenece a Módulo de Documentación).',
      'NO ejecuta el proceso de negociación de renovación (pertenece al Proceso 7).'
    ],
    checklistValidacion: [
      '¿Queda claro que la lógica de renovación vive en el Proceso 7 y no aquí?',
      '¿Se diferencia correctamente el número de póliza del número de endoso/refrendo?',
      '¿Se abstiene explícitamente de administrar cobranzas o documentos?',
      '¿Tiene eventos de inicio y fin alineados a la vigencia técnica?'
    ]
  },
  {
    id: 'proceso-4',
    number: 4,
    title: 'Administración de Vehículos',
    subtitle: 'Identificación, Scoring y Seguimiento de Rodados y Unidades Cubiertas',
    type: 'core',
    objetivo: 'Administrar el inventario detallado y las características técnicas de los vehículos asegurados en la cartera (automóviles, pick-ups, camiones, acoplados, motos, maquinarias), garantizando la unicidad de identificación por Dominio (Patente) o Chasis/Motor.',
    inicio: 'Inicia cuando un vehículo queda cubierto bajo una póliza vigente del PAS.',
    eventos: [
      'Incorporación de vehículo por emisión de nueva póliza o endoso de alta.',
      'Solicitud de sustitución de unidad (baja de vehículo anterior y alta del nuevo).',
      'Cambio de uso o radicación del vehículo.',
      'Baja del vehículo por anulación de póliza o destrucción total/robo.'
    ],
    flujoPrincipal: [
      'Carga e identificación unívoca por Dominio (Patente) o Número de Motor y Chasis (para 0km o maquinarias sin patentar).',
      'Registro de marca, modelo, versión, año de fabricación, tipo de uso (particular, comercial, alquiler) y tipo de combustible (Nafta, Diesel, GNC).',
      'Verificación de accesorios, rastreo satelital o inspección previa si corresponde.',
      'Asociación con la póliza activa y la aseguradora correspondiente.',
      'Seguimiento del historial de coberturas del mismo vehículo a lo largo del tiempo.'
    ],
    decisiones: [
      '¿El dominio ingresado ya existe asociado a otro cliente o póliza anterior? -> Notificar reasignación o cambio de titularidad.',
      '¿El vehículo posee equipo de GNC instalado? -> Requerir fecha de vencimiento de oblea y tubo para alertas.'
    ],
    excepciones: [
      'Vehículos 0km sin patentar (se identifican temporalmente por Chasis y Motor hasta la asignación del Dominio definitivo).',
      'Unidades de flota con identificación interna de la empresa tomadora.'
    ],
    interacciones: [
      'Proceso 1 (Administración de Clientes): Vincula al propietario/conductor habitual.',
      'Proceso 3 (Administración de Pólizas): Vincula la unidad al contrato de cobertura.'
    ],
    finalizacion: 'Finaliza cuando el vehículo deja de tener cobertura activa en cualquier póliza administrada por el PAS.',
    alcance: 'Gestión de datos de identificación técnica, uso y scoring de vehículos asegurados.',
    responsabilidades: [
      'Evitar la duplicación de dominios activos en simultáneo con coberturas contrapuestas.',
      'Mantener el historial de unidades asignadas a cada cliente.'
    ],
    queNoHace: [
      'NO realiza la inspección física previa del rodado.',
      'NO cotiza el valor comercial del vehículo (suscripción de aseguradora).',
      'NO emite certificados de circulación por sí solo.'
    ],
    checklistValidacion: [
      '¿Se contempla la identificación por Dominio y por Chasis/Motor (0km)?',
      '¿El inicio y fin coinciden exactamente con la vigencia de la cobertura?',
      '¿Está desligado de tareas de inspección técnica o valuación comercial?'
    ]
  },
  {
    id: 'proceso-5',
    number: 5,
    title: 'Administración de ART',
    subtitle: 'Gestión de Contratos de Riesgos del Trabajo (Ley 24.557) e Integración de Nóminas',
    type: 'core',
    objetivo: 'Administrar los contratos de Riesgos del Trabajo (ART) de los empleadores clientes del PAS, incluyendo la gestión de CIIU (actividad económica), masa salarial estimada, cláusulas de no repetición y certificados de cobertura para presentación ante terceros.',
    inicio: 'Inicia cuando un empleador suscribe un contrato de afiliación a una ART a través del PAS o traspasa su contrato a la cartera.',
    eventos: [
      'Alta de contrato de afiliación a ART.',
      'Novedades de nómina (altas/bajas de trabajadores vía F.931 AFIP/ARCA).',
      'Solicitud de Certificado de Cobertura con o sin Cláusula de No Repetición.',
      'Proceso de Traspaso de ART (cumplimiento de alícuota y antigüedad mínima de 1 año).'
    ],
    flujoPrincipal: [
      'Registro del número de contrato de ART, CUIT del empleador y razón social.',
      'Clasificación de la actividad (CIIU principal y secundarios) y alícuota pactada (suma fija por trabajador + % de masa salarial).',
      'Seguimiento de la cantidad de trabajadores cubiertos.',
      'Emisión y control de solicitudes de Certificados de Cobertura con nómina de empleados.',
      'Identificación de fecha de posibilidad de traspaso (12 meses de permanencia mínima obligatoria por ley argentina).'
    ],
    decisiones: [
      '¿El contrato cumple los 12 meses de antigüedad mínima para traspaso? -> Habilitar en Panel/Alertas oportunidad de cotización comparativa; si no, bloquear traspaso.',
      '¿La solicitud de certificado requiere Cláusula de No Repetición para CUITs específicos? -> Registrar empresas beneficiarias requeridas.'
    ],
    excepciones: [
      'Empleadores en régimen de Casas Particulares (Personal Doméstico) con esquemas de pago fijo.',
      'Rescisión del contrato por la ART debido a mora acumulada en AFIP.'
    ],
    interacciones: [
      'Proceso 1 (Administración de Clientes): Vincula al empleador titular del CUIT.',
      'Proceso 2 (Administración de Aseguradoras): Vincula la entidad ART correspondiente.',
      'Proceso 7 (Renovaciones): Monitorea la continuidad y alícuotas del contrato.'
    ],
    finalizacion: 'Finaliza cuando se extingue la relación contractual entre el empleador y la ART o el cliente cesa su actividad como empleador.',
    alcance: 'Administración funcional de contratos de Riesgos del Trabajo conforme a la Ley 24.557.',
    responsabilidades: [
      'Controlar las fechas de elegibilidad para traspaso de ART.',
      'Verificar que las solicitudes de certificados contengan las exigencias requeridas por comitentes o contratistas.'
    ],
    queNoHace: [
      'NO liquida sueldos ni genera el Formulario 931 de AFIP/ARCA.',
      'NO liquida prestaciones dinerarias ni gestiona altas médicas de incapacidad.',
      'NO realiza inspecciones de Higiene y Seguridad Laboral.'
    ],
    checklistValidacion: [
      '¿Cumple con la normativa argentina de ART (Ley 24.557)?',
      '¿Monitorea los 12 meses obligatorios para posibilidad de traspaso?',
      '¿Diferencia claramente las funciones del PAS de las obligaciones tributarias/laborales del empleador?'
    ]
  },
  {
    id: 'proceso-6',
    number: 6,
    title: 'Automatizaciones',
    subtitle: 'Motor Transversal de Reglas, Eventos, Disparadores y Acciones Supervisadas',
    type: 'transversal',
    objetivo: 'Detectar en tiempo real o programado eventos de negocio, vencimientos, inconsistencias o cumplimiento de reglas parametrizadas, generando de manera automática alertas, tareas, notificaciones o sugerencias dirigidas al PAS o a los clientes, sin alterar directamente la lógica de los procesos de negocio.',
    inicio: 'Inicia cuando el sistema evalúa cronológicamente o por reacción a un evento la ocurrencia de una condición configurada.',
    eventos: [
      'Llegada de fecha límite de vigencia de póliza (ej. a 60, 30, 15 días).',
      'Detección de datos incompletos en cliente o vehículo (ej. CUIT no verificado, GNC vencido).',
      'Ocurrencia de un cumpleaños de cliente o aniversario de cartera.',
      'Cambio de estado en una renovación o solicitud.'
    ],
    flujoPrincipal: [
      'Monitoreo continuo de eventos generados por los Procesos 1, 2, 3, 4, 5 y 7.',
      'Evaluación de condiciones y reglas activas (ej. "Si Póliza vence en 30 días Y no está en circuito de renovación -> Disparar Alerta").',
      'Generación de la acción correspondiente: Tarea en agenda del PAS, Alerta visible en Panel de Control, Notificación al usuario.',
      'Registro de trazabilidad y log de ejecución automática.'
    ],
    decisiones: [
      '¿La regla automática requiere confirmación manual del PAS antes de enviar notificación? -> Crear tarea pendiente de revisión; si no, ejecutar notificación según preferencia.'
    ],
    excepciones: [
      'Clientes con bandera de "No Notificar Automáticamente" (contacto VIP o restricción de comunicación).',
      'Fallas en el canal externo de envío que requieran reintento.'
    ],
    interacciones: [
      'Interactúa de forma transversal con TODOS los demás procesos leyendo sus estados y registrando tareas o alertas.',
      'Proceso 8 (Panel de Control): Deposita indicadores, alertas y tareas pendientes.'
    ],
    finalizacion: 'Finaliza una vez emitida la alerta, creada la tarea o enviada la notificación requerida.',
    alcance: 'Detección de condiciones y disparo de acciones supervisadas.',
    responsabilidades: [
      'Garantizar la ejecución oportuna de las reglas sin duplicar alertas.',
      'Respetar las políticas de privacidad y restricciones de contacto de los clientes.'
    ],
    queNoHace: [
      'NO ejecuta transacciones de negocio por sí solo (no emite, no cobra, no anula).',
      'NO reemplaza el criterio ni la toma de decisiones del PAS.',
      'NO modifica los datos originarios de los procesos.'
    ],
    checklistValidacion: [
      '¿Cumple la regla de no ejecutar procesos de negocio por sí mismo?',
      '¿Es estrictamente transversal e independiente?',
      '¿Genera tareas auditables para el PAS?'
    ]
  },
  {
    id: 'proceso-7',
    number: 7,
    title: 'Renovaciones',
    subtitle: 'Circuito Unificado de Negociación, Re-cotización y Retención de Cartera',
    type: 'transversal',
    objetivo: 'Gestionar de manera integral el circuito de renovación de pólizas y contratos de ART próximos a vencer, permitiendo analizar la siniestralidad, re-cotizar coberturas, negociar condiciones con el cliente y concretar la continuidad o reemplazo de la cobertura antes del fin de vigencia.',
    inicio: 'Inicia cuando una póliza o contrato ART alcanza la ventana de tiempo previa a su vencimiento (ej. 45 o 30 días antes de la fecha fin de vigencia).',
    eventos: [
      'Ingreso automático de póliza al listado de renovaciones por proximidad de vencimiento.',
      'Recepción de propuesta de renovación enviada por la aseguradora.',
      'Solicitud del cliente de cambio de cobertura, franquicia o aseguradora para la renovación.',
      'Decisión del cliente de no renovar o cancelar.'
    ],
    flujoPrincipal: [
      'Identificación de contratos próximos a vencer dentro del rango configurable.',
      'Análisis previo por parte del PAS: evaluación de actualización de sumas aseguradas (inflación), ajuste de cuotas y siniestralidad del período.',
      'Comparación de alternativas entre aseguradoras si se requiere re-cotización.',
      'Gestión de contacto con el cliente: envío de propuesta de renovación.',
      'Registro de la respuesta del cliente y resultado de la gestión: Concretada, Modificada, En Negociación, Rechazada/No Renueva.',
      'Si se concreta: derivación de la orden al Proceso 3 para registro de la nueva póliza emitida.'
    ],
    decisiones: [
      '¿El cliente acepta la renovación en la misma compañía? -> Marcar Concretada y enviar a registrar nueva póliza.',
      '¿El cliente solicita cambio de aseguradora? -> Iniciar trámite de emisión en nueva compañía y marcar no renovación en la anterior.',
      '¿La aseguradora aumenta la prima por encima del umbral aceptable? -> Disparar alerta de revisión prioritaria para el PAS.'
    ],
    excepciones: [
      'Pólizas con anulación previa que ingresaron erróneamente al circuito de renovación.',
      'Pólizas de no renovabilidad automática (ej. Seguro de Construcción o Caución de un solo evento).'
    ],
    interacciones: [
      'Proceso 3 (Administración de Pólizas): Lee el vencimiento y le re-envía el resultado de la renovación concretada.',
      'Proceso 1 (Administración de Clientes): Utiliza datos de contacto para la propuesta.',
      'Proceso 6 (Automatizaciones): Recibe alertas de renovaciones pendientes sin gestión.',
      'Proceso 8 (Panel de Control): Alimenta el indicador de Tasa de Retención de Cartera.'
    ],
    finalizacion: 'Finaliza cuando el trámite de renovación concluye en uno de sus tres estados definitivos: Concretada, Rechazada o Cancelada.',
    alcance: 'Toda la lógica de análisis, negociación y seguimiento de renovaciones de contratos.',
    responsabilidades: [
      'Evitar la caída por vencimiento desatendido de coberturas críticas (descubierto de riesgo).',
      'Mantener la actualización de valores para evitar infraseguro.'
    ],
    queNoHace: [
      'NO guarda directamente la nueva póliza emitida (la transfiere al Proceso 3).',
      'NO cobra las cuotas del nuevo período.',
      'NO realiza cobro de comisiones.'
    ],
    checklistValidacion: [
      '¿Centraliza toda la lógica de renovación tal como exige la regla de arquitectura?',
      '¿Tiene definidos sus 3 estados finales (Concretada, Rechazada, Cancelada)?',
      '¿Interactúa limpiamente con el Proceso 3 sin duplicar responsabilidades?'
    ]
  },
  {
    id: 'proceso-8',
    number: 8,
    title: 'Panel de Control',
    subtitle: 'Centro de Supervisión Integral, Navegación y Consolidación de Indicadores',
    type: 'transversal',
    objetivo: 'Proporcionar al Productor Asesor de Seguros una vista consolidada, en tiempo real y supervisada de la situación global de su negocio, reuniendo tareas pendientes, alertas operativas, indicadores clave de desempeño (KPIs) y vencimientos, funcionando exclusivamente como centro de comando y acceso directo a los procesos operativos.',
    inicio: 'Inicia cuando un usuario autenticado ingresa al sistema o cuando el sistema requiere refrescar el estado consolidado de la cartera.',
    eventos: [
      'Ingreso/Login del usuario PAS.',
      'Actualización de estado en cualquier proceso subyacente (ej. cobro de póliza, nueva tarea generada, renovación concretada).',
      'Selección de un widget o métrica para profundizar en un proceso específico.'
    ],
    flujoPrincipal: [
      'Consolidación de métricas de negocio desde los procesos de origen (Pólizas vigentes, Clientes activos, % de Retención de renovaciones, Alertas de vencimientos).',
      'Presentación de la Agenda y Tareas pendientes priorizadas por gravedad/fecha.',
      'Visualización de alertas de inconsistencia (ej. vehículos sin patente, clientes sin CUIT verificado).',
      'Provisión de accesos directos (links funcionales) a la ejecución de cada proceso de origen.',
      'Filtrado y segmentación por período, aseguradora, ramo o colaborador.'
    ],
    decisiones: [
      '¿El usuario hace clic en una alerta de renovación? -> Redirigir al Proceso 7 (Renovaciones) posicionando en el registro correspondiente.',
      '¿El usuario no posee permisos para ver comisiones o datos financieros? -> Ocultar widgets con información restringida según perfil.'
    ],
    excepciones: [
      'Indisponibilidad momentánea de datos consolidados por mantenimiento de origen.',
      'Perfiles de usuario administrativo restringidos solo a tareas específicas.'
    ],
    interacciones: [
      'Consume información de los Procesos 1, 2, 3, 4, 5, 6 y 7.',
      'No modifica ni altera ningún dato de los procesos de origen.'
    ],
    finalizacion: 'Finaliza cuando el usuario navega hacia un proceso operativo específico o cierra su sesión en el sistema.',
    alcance: 'Supervisión consolidada, métricas y navegación directa a la operación.',
    responsabilidades: [
      'Garantizar la fidelidad y exactitud de los indicadores presentados.',
      'Respetar estrictamente los permisos de acceso y perfiles de usuario.'
    ],
    queNoHace: [
      'NO almacena ni duplica datos de negocio propios.',
      'NO ejecuta reglas de cálculo de procesos.',
      'NO permite crear o editar clientes/pólizas directamente dentro del widget (redirecciona al proceso correspondiente).'
    ],
    checklistValidacion: [
      '¿Respetó estrictamente la prohibición de tener lógica o datos propios?',
      '¿Cada widget redirige al proceso operativo de origen?',
      '¿Consolida tareas, indicadores y alertas de forma desacoplada?'
    ]
  }
];
