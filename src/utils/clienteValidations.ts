import {
  Cliente,
  TipoCliente,
  TipoDocumentoCliente,
  RegistroTrazabilidadCliente
} from '../types';

/**
 * Validates CUIT / CUIL using AFIP standard Modulo 11 verification algorithm.
 */
export function validateCuitCuil(cuit: string): { isValid: boolean; error?: string } {
  if (!cuit) {
    return { isValid: false, error: 'El número de CUIT/CUIL es obligatorio.' };
  }

  const clean = cuit.replace(/\D/g, '');
  if (clean.length !== 11) {
    return {
      isValid: false,
      error: `El CUIT/CUIL debe contener exactamente 11 dígitos numéricos (se ingresaron ${clean.length}).`
    };
  }

  const prefix = clean.substring(0, 2);
  const validPrefixes = ['20', '23', '24', '27', '30', '33', '34'];
  if (!validPrefixes.includes(prefix)) {
    return {
      isValid: false,
      error: `Prefijo de CUIT/CUIL inválido (${prefix}). Prefijos válidos reconocidos: 20, 23, 24, 27, 30, 33, 34.`
    };
  }

  const multipliers = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
  let sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(clean[i], 10) * multipliers[i];
  }

  const mod = sum % 11;
  let checkDigit = 11 - mod;
  if (checkDigit === 11) checkDigit = 0;
  if (checkDigit === 10) checkDigit = 9;

  const actualCheckDigit = parseInt(clean[10], 10);
  if (checkDigit !== actualCheckDigit) {
    return {
      isValid: false,
      error: `Dígito verificador inválido en CUIT/CUIL (calculado: ${checkDigit}, ingresado: ${actualCheckDigit}). Verifique el número ingresado.`
    };
  }

  return { isValid: true };
}

/**
 * Formats a clean 11-digit string into standard CUIT/CUIL format XX-XXXXXXXX-X
 */
export function formatCuitCuil(cuit: string): string {
  const clean = cuit.replace(/\D/g, '');
  if (clean.length === 11) {
    return `${clean.substring(0, 2)}-${clean.substring(2, 10)}-${clean.substring(10, 11)}`;
  }
  return cuit;
}

/**
 * Validates DNI (7 to 8 numeric digits)
 */
export function validateDni(dni: string): { isValid: boolean; error?: string } {
  if (!dni) {
    return { isValid: false, error: 'El número de DNI es obligatorio.' };
  }
  const clean = dni.replace(/\D/g, '');
  if (clean.length < 7 || clean.length > 8) {
    return {
      isValid: false,
      error: `El DNI debe contener 7 u 8 dígitos numéricos (se ingresaron ${clean.length}).`
    };
  }
  if (/^0+$/.test(clean)) {
    return { isValid: false, error: 'El DNI no puede ser compuesto exclusivamente de ceros.' };
  }
  return { isValid: true };
}

/**
 * Extracts central DNI digits from a CUIT or CUIL string
 */
export function extractDniFromCuitCuil(cuitCuil: string): string | null {
  const clean = cuitCuil.replace(/\D/g, '');
  if (clean.length === 11) {
    // Digits from index 2 to 10 (8 digits)
    const rawDni = clean.substring(2, 10);
    // Remove leading zeros if present for 7-digit DNI
    return rawDni.replace(/^0+/, '');
  }
  return null;
}

/**
 * Validates Email according to RFC standards without invalid spaces
 */
export function validateEmail(email: string): { isValid: boolean; error?: string } {
  if (!email || email.trim() === '') {
    return { isValid: true }; // optional if not mandatory, mandatory check is done separately
  }
  if (/\s/.test(email)) {
    return { isValid: false, error: 'El email no puede contener espacios en blanco.' };
  }
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'El email ingresado no tiene un formato válido (ej: usuario@dominio.com).' };
  }
  return { isValid: true };
}

/**
 * Validates Phone structure (only valid characters, not letters only, no auto-modification)
 */
export function validatePhone(phone: string, fieldName: string = 'Teléfono'): { isValid: boolean; error?: string } {
  if (!phone || phone.trim() === '') {
    return { isValid: true };
  }
  // Check if contains exclusively letters
  if (/^[a-zA-Z\s]+$/.test(phone.trim())) {
    return {
      isValid: false,
      error: `El campo ${fieldName} no puede estar compuesto exclusivamente por letras.`
    };
  }
  // Extract digits
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 6) {
    return {
      isValid: false,
      error: `El campo ${fieldName} debe contener una estructura numérica válida (mínimo 6 dígitos).`
    };
  }
  // Allowed characters: numbers, +, -, (, ), spaces, .
  const validPhoneCharsRegex = /^[0-9+\-()\s./]+$/;
  if (!validPhoneCharsRegex.test(phone)) {
    return {
      isValid: false,
      error: `El campo ${fieldName} contiene caracteres no permitidos. Utilice números y separadores habituales (+, -, espacios, paréntesis).`
    };
  }
  return { isValid: true };
}

/**
 * Validates Birth Date for Persona Física
 */
export function validateBirthDate(birthDate: string): { isValid: boolean; error?: string } {
  if (!birthDate || birthDate.trim() === '') {
    return { isValid: true }; // optional unless specified
  }
  const d = new Date(birthDate);
  if (isNaN(d.getTime())) {
    return { isValid: false, error: 'La fecha de nacimiento no es una fecha válida.' };
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (d > today) {
    return { isValid: false, error: 'La fecha de nacimiento no puede ser una fecha futura.' };
  }
  const minDate = new Date('1900-01-01');
  if (d < minDate) {
    return { isValid: false, error: 'La fecha de nacimiento debe ser posterior al año 1900.' };
  }
  return { isValid: true };
}

/**
 * Duplicate Detection Result Structure
 */
export interface DuplicateDetectionResult {
  level1ConfirmedMatch: {
    matchedClient: Cliente;
    message: string;
  } | null;
  dniCuitCorrespondenceMatch: {
    matchedClient: Cliente;
    dni: string;
    cuit: string;
    message: string;
  } | null;
  level2StrongMatch: {
    matchedClient: Cliente;
    reasons: string[];
    message: string;
  } | null;
  level3WeakMatch: {
    matchedClient: Cliente;
    message: string;
  } | null;
}

/**
 * Normalizes text for comparison (removes accents, trim, lowercase)
 */
export function normalizeText(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Deterministic duplicate detection engine (Levels 1, 2, 3 and DNI ↔ CUIT/CUIL Correspondence)
 */
export function detectClientDuplicates(params: {
  currentClientId?: string;
  tipoDoc: TipoDocumentoCliente;
  numDoc: string;
  tipo: TipoCliente;
  nombreRazonSocial: string;
  nombre?: string;
  apellido?: string;
  fechaNacimiento?: string;
  telefono?: string;
  whatsapp?: string;
  email?: string;
  domicilio?: string;
  localidad?: string;
  existingClients: Cliente[];
}): DuplicateDetectionResult {
  const result: DuplicateDetectionResult = {
    level1ConfirmedMatch: null,
    dniCuitCorrespondenceMatch: null,
    level2StrongMatch: null,
    level3WeakMatch: null
  };

  const cleanNumDoc = params.numDoc.replace(/\D/g, '');
  const normNombreRazon = normalizeText(params.nombreRazonSocial);
  const normNombre = normalizeText(params.nombre || '');
  const normApellido = normalizeText(params.apellido || '');
  const cleanTel = params.telefono ? params.telefono.replace(/\D/g, '') : '';
  const cleanWpp = params.whatsapp ? params.whatsapp.replace(/\D/g, '') : '';
  const normEmail = params.email ? params.email.trim().toLowerCase() : '';
  const normDom = normalizeText(params.domicilio || '');
  const normLoc = normalizeText(params.localidad || '');

  // Extract possible DNI if doc is CUIT/CUIL
  const extractedDniFromCurrent =
    params.tipoDoc === 'CUIT' || params.tipoDoc === 'CUIL'
      ? extractDniFromCuitCuil(params.numDoc)
      : cleanNumDoc;

  for (const client of params.existingClients) {
    // Skip comparing against self when editing
    if (params.currentClientId && client.id === params.currentClientId) {
      continue;
    }

    const clientCleanDoc = client.cuitCuilDni.replace(/\D/g, '');
    const clientExtractedDni = extractDniFromCuitCuil(client.cuitCuilDni) || clientCleanDoc;
    const clientNormNombreRazon = normalizeText(client.nombreRazonSocial);
    const clientNormNombre = normalizeText(client.nombre || '');
    const clientNormApellido = normalizeText(client.apellido || '');
    const clientCleanTel = client.telefono ? client.telefono.replace(/\D/g, '') : '';
    const clientCleanWpp = client.whatsapp ? client.whatsapp.replace(/\D/g, '') : '';
    const clientNormEmail = client.email ? client.email.trim().toLowerCase() : '';
    const clientNormDom = normalizeText(client.domicilio || '');
    const clientNormLoc = normalizeText(client.localidad || '');

    // -------------------------------------------------------------
    // NIVEL 1 — COINCIDENCIA CONFIRMADA (Mismo documento exacto)
    // -------------------------------------------------------------
    if (cleanNumDoc !== '' && clientCleanDoc === cleanNumDoc) {
      result.level1ConfirmedMatch = {
        matchedClient: client,
        message: `El documento ingresado (${params.numDoc}) ya se encuentra registrado para el cliente "${client.nombreRazonSocial}" (ID: ${client.id}).`
      };
      return result; // Bloqueante de máxima prioridad
    }

    // -------------------------------------------------------------
    // CORRESPONDENCIA DNI ↔ CUIT/CUIL
    // -------------------------------------------------------------
    if (!result.dniCuitCorrespondenceMatch && cleanNumDoc !== '') {
      // Caso 1: Ingreso CUIT/CUIL y existe un cliente con DNI coincidente
      if (
        (params.tipoDoc === 'CUIT' || params.tipoDoc === 'CUIL') &&
        extractedDniFromCurrent &&
        (clientCleanDoc === extractedDniFromCurrent || clientCleanDoc === `0${extractedDniFromCurrent}`)
      ) {
        result.dniCuitCorrespondenceMatch = {
          matchedClient: client,
          dni: client.cuitCuilDni,
          cuit: params.numDoc,
          message: `Se encontró un cliente registrado con el DNI (${client.cuitCuilDni} - "${client.nombreRazonSocial}") correspondiente a la CUIT/CUIL ingresada (${params.numDoc}). Verifique si se trata del mismo cliente antes de continuar.`
        };
      }
      // Caso 2: Ingreso DNI y existe un cliente con CUIT/CUIL que contiene ese DNI
      else if (
        params.tipoDoc === 'DNI' &&
        clientExtractedDni &&
        (cleanNumDoc === clientExtractedDni || `0${cleanNumDoc}` === clientCleanDoc.substring(2, 10))
      ) {
        result.dniCuitCorrespondenceMatch = {
          matchedClient: client,
          dni: params.numDoc,
          cuit: client.cuitCuilDni,
          message: `Se encontró un cliente registrado con la CUIT/CUIL (${client.cuitCuilDni} - "${client.nombreRazonSocial}") que contiene el DNI ingresado (${params.numDoc}). Verifique si se trata del mismo cliente antes de continuar.`
        };
      }
    }

    // -------------------------------------------------------------
    // NIVEL 2 — POSIBLE CLIENTE EXISTENTE (Coincidencias Fuertes)
    // -------------------------------------------------------------
    const strongReasons: string[] = [];

    // Factor 1: Nombre + Apellido + Fecha de Nacimiento coincidente
    if (
      params.tipo === 'Persona Física' &&
      client.tipo === 'Persona Física' &&
      normNombre !== '' &&
      normApellido !== '' &&
      ((normNombre === clientNormNombre && normApellido === clientNormApellido) ||
        normNombreRazon === clientNormNombreRazon) &&
      params.fechaNacimiento &&
      client.fechaNacimiento &&
      params.fechaNacimiento === client.fechaNacimiento
    ) {
      strongReasons.push('Nombre, Apellido y Fecha de Nacimiento idénticos');
    }

    // Factor 2: Nombre o Razón Social coincidente + Email coincidente
    if (
      normNombreRazon !== '' &&
      normNombreRazon === clientNormNombreRazon &&
      normEmail !== '' &&
      normEmail === clientNormEmail
    ) {
      strongReasons.push(`Mismo Nombre/Razón Social y Email coincidente (${client.email})`);
    }

    // Factor 3: Nombre o Razón Social coincidente + Teléfono / WhatsApp coincidente
    if (
      normNombreRazon !== '' &&
      normNombreRazon === clientNormNombreRazon &&
      ((cleanTel !== '' && (cleanTel === clientCleanTel || cleanTel === clientCleanWpp)) ||
        (cleanWpp !== '' && (cleanWpp === clientCleanWpp || cleanWpp === clientCleanTel)))
    ) {
      strongReasons.push('Mismo Nombre/Razón Social y Número de Teléfono/WhatsApp coincidente');
    }

    // Factor 4: Mismo Nombre/Razón Social y Domicilio idéntico
    if (
      normNombreRazon !== '' &&
      normNombreRazon === clientNormNombreRazon &&
      normDom !== '' &&
      normDom === clientNormDom &&
      normLoc !== '' &&
      normLoc === clientNormLoc
    ) {
      strongReasons.push(`Mismo Nombre/Razón Social y Domicilio idéntico (${client.domicilio}, ${client.localidad})`);
    }

    if (strongReasons.length > 0 && !result.level2StrongMatch) {
      result.level2StrongMatch = {
        matchedClient: client,
        reasons: strongReasons,
        message: `Posible coincidencia fuerte con el cliente existente "${client.nombreRazonSocial}" (${client.cuitCuilDni}): ${strongReasons.join(' · ')}.`
      };
    }

    // -------------------------------------------------------------
    // NIVEL 3 — COINCIDENCIA DÉBIL (Homónimo simple)
    // -------------------------------------------------------------
    if (
      !result.level2StrongMatch &&
      !result.level3WeakMatch &&
      normNombreRazon !== '' &&
      normNombreRazon.length >= 5 &&
      (normNombreRazon === clientNormNombreRazon ||
        (normApellido !== '' &&
          normApellido === clientNormApellido &&
          normNombre !== '' &&
          normNombre === clientNormNombre))
    ) {
      result.level3WeakMatch = {
        matchedClient: client,
        message: `Posible homónimo: El nombre coincide con el cliente "${client.nombreRazonSocial}" (${client.cuitCuilDni}). Verifique si se trata de personas distintas.`
      };
    }
  }

  return result;
}

/**
 * Calculates field differences between original client and modified fields
 */
export function getClientFieldDifferences(
  original: Cliente,
  updated: Partial<Cliente>
): { campo: string; label: string; valorAnterior: any; valorNuevo: any }[] {
  const diffs: { campo: string; label: string; valorAnterior: any; valorNuevo: any }[] = [];

  const fieldLabels: Record<string, string> = {
    nombre: 'Nombre',
    apellido: 'Apellido',
    nombreRazonSocial: 'Nombre Completo / Razón Social',
    nombreFantasia: 'Nombre de Fantasía',
    condicionIva: 'Condición frente al IVA',
    fechaNacimiento: 'Fecha de Nacimiento',
    sexo: 'Sexo / Género',
    telefono: 'Teléfono Principal',
    telefonoSecundario: 'Teléfono Secundario',
    whatsapp: 'WhatsApp',
    email: 'Email Principal',
    emailSecundario: 'Email Secundario',
    medioContactoPreferido: 'Medio de Contacto Preferido',
    domicilio: 'Domicilio (Calle y Altura)',
    calle: 'Calle',
    numero: 'Número',
    piso: 'Piso',
    depto: 'Departamento',
    localidad: 'Localidad',
    provincia: 'Provincia',
    codigoPostal: 'Código Postal',
    productorResponsable: 'Productor / Responsable Asignado',
    perfilRiesgo: 'Perfil de Riesgo',
    notas: 'Observaciones Internas',
    observaciones: 'Observaciones',
    notasAdministrativas: 'Notas Administrativas'
  };

  for (const [key, label] of Object.entries(fieldLabels)) {
    if (key in updated) {
      const origVal = (original as any)[key];
      const newVal = (updated as any)[key];

      // Normalize empty strings and undefined
      const normOrig = origVal === undefined || origVal === null ? '' : String(origVal).trim();
      const normNew = newVal === undefined || newVal === null ? '' : String(newVal).trim();

      if (normOrig !== normNew) {
        diffs.push({
          campo: key,
          label,
          valorAnterior: origVal || '(vacío)',
          valorNuevo: newVal || '(vacío)'
        });
      }
    }
  }

  return diffs;
}
