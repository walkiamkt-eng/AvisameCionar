import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  User,
  Auth
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  setDoc,
  addDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  query,
  where,
  writeBatch,
  Firestore
} from 'firebase/firestore';
import firebaseAppletConfig from '../../firebase-applet-config.json';

export interface FirebaseInitStatus {
  isValid: boolean;
  configSource: 'ENVIRONMENT_VARIABLES' | 'FIREBASE_APPLET_CONFIG_JSON';
  missingOrInvalidFields: string[];
  projectConsistencyError: string | null;
  errorDetail: string | null;
}

// Helper to strip surrounding quotes and whitespace from config property values
function cleanConfigProp(val: unknown): string {
  if (typeof val !== 'string') return '';
  let trimmed = val.trim();
  while (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    trimmed = trimmed.slice(1, -1).trim();
  }
  return trimmed;
}

function isValidConfigProp(val: unknown): boolean {
  const cleaned = cleanConfigProp(val);
  return (
    cleaned !== '' &&
    cleaned !== 'undefined' &&
    cleaned !== 'null' &&
    !cleaned.startsWith('MY_')
  );
}

// 1. Determine single source of truth (Environment Variables OR firebase-applet-config.json - NEVER hybrid)
const metaEnv = (import.meta as any).env || {};

const hasCompleteEnvConfig =
  isValidConfigProp(metaEnv.VITE_FIREBASE_API_KEY) &&
  isValidConfigProp(metaEnv.VITE_FIREBASE_PROJECT_ID) &&
  isValidConfigProp(metaEnv.VITE_FIREBASE_AUTH_DOMAIN) &&
  isValidConfigProp(metaEnv.VITE_FIREBASE_STORAGE_BUCKET) &&
  isValidConfigProp(metaEnv.VITE_FIREBASE_APP_ID);

let configSource: 'ENVIRONMENT_VARIABLES' | 'FIREBASE_APPLET_CONFIG_JSON';
let rawConfig: {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  firestoreDatabaseId: string;
};

if (hasCompleteEnvConfig) {
  configSource = 'ENVIRONMENT_VARIABLES';
  rawConfig = {
    apiKey: cleanConfigProp(metaEnv.VITE_FIREBASE_API_KEY),
    authDomain: cleanConfigProp(metaEnv.VITE_FIREBASE_AUTH_DOMAIN),
    projectId: cleanConfigProp(metaEnv.VITE_FIREBASE_PROJECT_ID),
    storageBucket: cleanConfigProp(metaEnv.VITE_FIREBASE_STORAGE_BUCKET),
    messagingSenderId: cleanConfigProp(metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID),
    appId: cleanConfigProp(metaEnv.VITE_FIREBASE_APP_ID),
    firestoreDatabaseId: cleanConfigProp(metaEnv.VITE_FIREBASE_DATABASE_ID) || '(default)'
  };
} else {
  configSource = 'FIREBASE_APPLET_CONFIG_JSON';
  const cfg = (firebaseAppletConfig as any)?.default || firebaseAppletConfig || {};
  rawConfig = {
    apiKey: cleanConfigProp(cfg.apiKey),
    authDomain: cleanConfigProp(cfg.authDomain),
    projectId: cleanConfigProp(cfg.projectId),
    storageBucket: cleanConfigProp(cfg.storageBucket),
    messagingSenderId: cleanConfigProp(cfg.messagingSenderId),
    appId: cleanConfigProp(cfg.appId),
    firestoreDatabaseId: cleanConfigProp(cfg.firestoreDatabaseId) || '(default)'
  };
}

// 2. Print exact configuration properties BEFORE initializing Firebase
console.log('[DEBUG Firebase Audit] Fuente de configuración activa:', configSource);
console.log('apiKey:', rawConfig.apiKey);
console.log('projectId:', rawConfig.projectId);
console.log('authDomain:', rawConfig.authDomain);
console.log('storageBucket:', rawConfig.storageBucket);
console.log('databaseId:', rawConfig.firestoreDatabaseId);
console.log('appId:', rawConfig.appId);

// 3. Validate that no property is undefined, null, "", or starts with "MY_*"
const requiredKeys = ['apiKey', 'projectId', 'authDomain', 'storageBucket', 'appId'];
const missingOrInvalidFields: string[] = [];

for (const key of requiredKeys) {
  const val = (rawConfig as Record<string, string>)[key];
  if (!isValidConfigProp(val)) {
    missingOrInvalidFields.push(key);
  }
}

// 4. Verify that apiKey, projectId, authDomain, appId, and messagingSenderId belong to the same project
let projectConsistencyError: string | null = null;
if (missingOrInvalidFields.length === 0) {
  if (!rawConfig.authDomain.includes(rawConfig.projectId)) {
    projectConsistencyError = `authDomain ("${rawConfig.authDomain}") no contiene projectId ("${rawConfig.projectId}").`;
  } else if (!rawConfig.storageBucket.includes(rawConfig.projectId)) {
    projectConsistencyError = `storageBucket ("${rawConfig.storageBucket}") no contiene projectId ("${rawConfig.projectId}").`;
  } else {
    const appIdParts = rawConfig.appId.split(':');
    if (appIdParts.length >= 2 && appIdParts[1]) {
      const appIdProjectNum = appIdParts[1];
      if (rawConfig.messagingSenderId && rawConfig.messagingSenderId !== appIdProjectNum) {
        projectConsistencyError = `messagingSenderId ("${rawConfig.messagingSenderId}") no coincide con el número de proyecto en appId ("${appIdProjectNum}").`;
      }
    }
  }
}

// Determine status
const isConfigValid = missingOrInvalidFields.length === 0 && projectConsistencyError === null;
let errorDetailMsg: string | null = null;

if (missingOrInvalidFields.length > 0) {
  errorDetailMsg = `Faltan o son inválidas las siguientes propiedades requeridas de Firebase: ${missingOrInvalidFields.join(', ')}.`;
} else if (projectConsistencyError !== null) {
  errorDetailMsg = `Incoherencia entre credenciales de proyectos distintas: ${projectConsistencyError}`;
}

export const firebaseInitStatus: FirebaseInitStatus = {
  isValid: isConfigValid,
  configSource,
  missingOrInvalidFields,
  projectConsistencyError,
  errorDetail: errorDetailMsg
};

export const firebaseConfig = rawConfig;

let appInstance: FirebaseApp;
let dbInstance: Firestore;
let authInstance: Auth;

if (!isConfigValid) {
  console.error('[ERROR Firebase Init Failure] Inicialización de Firebase detenida por configuración inválida:');
  console.error(`- Detalle del error: ${errorDetailMsg}`);
  if (missingOrInvalidFields.length > 0) {
    console.error(`- Campos faltantes: ${missingOrInvalidFields.join(', ')}`);
  }
  if (projectConsistencyError) {
    console.error(`- Error de coherencia: ${projectConsistencyError}`);
  }
} else {
  // Initialize Firebase App
  appInstance = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

  // Initialize Firestore
  const dbId = firebaseConfig.firestoreDatabaseId;
  dbInstance = dbId && dbId !== '(default)'
    ? getFirestore(appInstance, dbId)
    : getFirestore(appInstance);

  // Initialize Auth
  authInstance = getAuth(appInstance);

  // 6. Print automatic confirmation after successfully initializing Firebase
  console.log('Firebase inicializado correctamente');
  console.log(`Proyecto: ${firebaseConfig.projectId}`);
  console.log(`Auth Domain: ${firebaseConfig.authDomain}`);
  console.log(`Database: ${dbId || '(default)'}`);
  console.log(`App ID: ${firebaseConfig.appId}`);
}

export const app = appInstance!;
export const db = dbInstance!;
export const auth = authInstance!;

export interface FirebaseAuthErrorAudit {
  code: string | null;
  message: string | null;
  customData: any;
  stack: string | null;
  origin: string;
  hostname: string;
  timestamp: string;
}

export let lastAuthErrorAudit: FirebaseAuthErrorAudit | null = null;

// 8. Domain & Config verification audit log
if (typeof window !== 'undefined') {
  const currentHost = window.location.hostname;
  console.group('[DEBUG Firebase Config Audit]');
  console.log('Firebase Project ID:', firebaseConfig.projectId);
  console.log('Current Hostname:', currentHost);
  console.log('Current Origin:', window.location.origin);
  console.log('Auth Domain:', firebaseConfig.authDomain);
  console.log('Google Provider Enabled:', true);
  console.groupEnd();
}

/**
 * Log in with Google Account via popup using GoogleAuthProvider with pre-flight audit
 */
export async function loginWithGoogle(): Promise<User | null> {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'desconocido';
  const hostname = typeof window !== 'undefined' ? window.location.hostname : 'desconocido';

  // Audit Log: Register required values in browser console
  console.group('[DEBUG Firebase Auth Pre-Check]');
  console.log('Firebase Project ID:', firebaseConfig.projectId);
  console.log('Current Hostname:', hostname);
  console.log('Current Origin:', origin);
  console.log('Auth Domain:', firebaseConfig.authDomain);
  console.log('Google Provider Enabled:', true);
  console.groupEnd();

  // Validate Firebase initialization state
  if (!firebaseInitStatus.isValid) {
    const errorMsg = `No se puede iniciar la autenticación: Configuración de Firebase inválida (${firebaseInitStatus.errorDetail})`;
    console.error(`[DEBUG Pre-Auth Error] ${errorMsg}`);
    const err = new Error(errorMsg);
    lastAuthErrorAudit = {
      code: 'app/invalid-firebase-config',
      message: err.message,
      customData: undefined,
      stack: err.stack || null,
      origin,
      hostname,
      timestamp: new Date().toISOString()
    };
    throw err;
  }

  // 6. Confirmar que el proveedor Google esté correctamente inicializado antes de ejecutar signInWithPopup()
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  console.log('[DEBUG Firebase Auth] GoogleAuthProvider inicializado correctamente:', {
    providerId: provider.providerId,
    scopes: provider.getScopes()
  });

  try {
    const result = await signInWithPopup(auth, provider);
    lastAuthErrorAudit = null;
    if (result.user) {
      console.log(`[DEBUG Firebase Auth Success] Usuario autenticado exitosamente: UID=${result.user.uid}, Email=${result.user.email}`);
      return result.user;
    }
  } catch (error: any) {
    // 2. En el catch de signInWithPopup() registrar el objeto completo recibido:
    console.group('[DEBUG Firebase Auth SDK Raw Error]');
    console.dir(error);
    console.log('error.code:', error?.code);
    console.log('error.message:', error?.message);
    console.log('error.customData:', error?.customData);
    console.log('error.stack:', error?.stack);
    console.groupEnd();

    // 3. Store raw error audit record
    lastAuthErrorAudit = {
      code: error?.code !== undefined ? String(error.code) : null,
      message: error?.message !== undefined ? String(error.message) : String(error),
      customData: error?.customData,
      stack: error?.stack !== undefined ? String(error.stack) : null,
      origin,
      hostname,
      timestamp: new Date().toISOString()
    };

    // 1 & 7. Eliminar temporalmente cualquier traducción o reemplazo de mensajes de error.
    // Re-throw raw error object directly from Firebase SDK without modification
    throw error;
  }
  return null;
}

/**
 * A/B TEST: Log in with Google Account via signInWithRedirect()
 */
export async function loginWithGoogleRedirect(): Promise<void> {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'desconocido';
  const hostname = typeof window !== 'undefined' ? window.location.hostname : 'desconocido';

  console.group('[A/B TEST Google Auth Redirect Init]');
  console.log('Firebase Project ID:', firebaseConfig.projectId);
  console.log('Current Hostname:', hostname);
  console.log('Current Origin:', origin);
  console.log('Auth Domain:', firebaseConfig.authDomain);
  console.log('Google Provider Enabled:', true);
  console.groupEnd();

  if (!firebaseInitStatus.isValid) {
    const errorMsg = `No se puede iniciar la autenticación (Redirect): Configuración de Firebase inválida (${firebaseInitStatus.errorDetail})`;
    console.error(`[A/B TEST Error] ${errorMsg}`);
    const err = new Error(errorMsg);
    lastAuthErrorAudit = {
      code: 'app/invalid-firebase-config',
      message: err.message,
      customData: undefined,
      stack: err.stack || null,
      origin,
      hostname,
      timestamp: new Date().toISOString()
    };
    throw err;
  }

  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  console.log('[A/B TEST] Ejecutando signInWithRedirect(auth, provider)...');
  await signInWithRedirect(auth, provider);
}

/**
 * A/B TEST: Check and log redirect result from getRedirectResult()
 */
export async function checkRedirectResult(): Promise<User | null> {
  if (typeof window === 'undefined') return null;
  const origin = window.location.origin;
  const hostname = window.location.hostname;

  try {
    console.log('[A/B TEST] Verificando getRedirectResult(auth)...');
    const result = await getRedirectResult(auth);

    console.group('[A/B TEST getRedirectResult()]');
    console.log('resultado getRedirectResult():', result);
    console.log('window.location.origin:', origin);
    console.log('window.location.hostname:', hostname);
    if (result) {
      console.log('error.code: null (Exitoso)');
      console.log('error.message: null (Exitoso)');
      console.log('Usuario obtenido por Redirect:', result.user.uid, result.user.email);
    } else {
      console.log('No hay resultado de redirección previo en este render/mount.');
    }
    console.groupEnd();

    if (result?.user) {
      lastAuthErrorAudit = null;
      return result.user;
    }
  } catch (error: any) {
    console.group('[A/B TEST getRedirectResult() Error]');
    console.dir(error);
    console.log('error.code:', error?.code);
    console.log('error.message:', error?.message);
    console.log('error.customData:', error?.customData);
    console.log('error.stack:', error?.stack);
    console.log('window.location.origin:', origin);
    console.log('window.location.hostname:', hostname);
    console.groupEnd();

    lastAuthErrorAudit = {
      code: error?.code !== undefined ? String(error.code) : null,
      message: error?.message !== undefined ? String(error.message) : String(error),
      customData: error?.customData,
      stack: error?.stack !== undefined ? String(error.stack) : null,
      origin,
      hostname,
      timestamp: new Date().toISOString()
    };

    throw error;
  }
  return null;
}

/**
 * Sign out current authenticated user
 */
export async function logoutUser(): Promise<void> {
  try {
    const uid = auth.currentUser?.uid;
    console.log(`[DEBUG Firebase Auth] Cerrando sesión del usuario activo: ${uid || 'ninguno'}`);
    await signOut(auth);
    console.log('[DEBUG Firebase Auth] Sesión cerrada correctamente.');
  } catch (error: any) {
    console.error('[DEBUG Firebase Auth Error] Error al cerrar sesión:', error?.code, error?.message || String(error));
  }
}

/**
 * Check if the database status for a specific producer is set to cleared
 */
export async function checkIsDatabaseCleared(productorId?: string): Promise<boolean> {
  if (!productorId || !firebaseInitStatus.isValid) return false;
  try {
    const configRef = doc(db, 'system_config', `database_${productorId}`);
    console.log(`[DEBUG Firestore Read] Verificando estado de base de datos en system_config/database_${productorId} [Proyecto: ${firebaseConfig.projectId}, DB: ${firebaseConfig.firestoreDatabaseId}]`);
    const snap = await getDoc(configRef);
    if (snap.exists()) {
      const isCleared = snap.data()?.isCleared === true;
      console.log(`[DEBUG Firestore Read Result] system_config/database_${productorId} existe. isCleared=${isCleared}`);
      return isCleared;
    } else {
      console.log(`[DEBUG Firestore Read Result] system_config/database_${productorId} aún no existe.`);
    }
  } catch (err: any) {
    console.error(`[DEBUG Firestore Read Error] Error consultando estado de base de datos para ${productorId}:`, err?.code, err?.message || String(err));
  }
  return false;
}

/**
 * Mark database status in system_config for a specific producer
 */
export async function markDatabaseStatus(isCleared: boolean, productorId?: string): Promise<void> {
  if (!productorId || !firebaseInitStatus.isValid) return;
  try {
    const configRef = doc(db, 'system_config', `database_${productorId}`);
    console.log(`[DEBUG Firestore Write] Actualizando system_config/database_${productorId} -> isCleared=${isCleared} [UID: ${productorId}]`);
    await setDoc(configRef, { isCleared, productorId, updatedAt: new Date().toISOString() });
    console.log(`[DEBUG Firestore Write Success] Estado de base de datos actualizado para ${productorId}: isCleared=${isCleared}`);
  } catch (err: any) {
    console.error(`[DEBUG Firestore Write Error] Error actualizando system_config para ${productorId}:`, err?.code, err?.message || String(err));
  }
}

/**
 * Recursively removes undefined fields from an object to ensure Firestore compatibility
 * and guards against circular structure references.
 */
export function cleanForFirestore<T>(data: T, seen = new WeakSet()): T {
  if (data === null || data === undefined) {
    return data;
  }
  if (typeof data !== 'object') {
    return data;
  }
  if (data instanceof Date) {
    return data as unknown as T;
  }
  if (seen.has(data as object)) {
    return undefined as unknown as T;
  }
  try {
    seen.add(data as object);
  } catch {
    // ignore non-object key error
  }

  if (Array.isArray(data)) {
    return data
      .map((item) => cleanForFirestore(item, seen))
      .filter((item) => item !== undefined) as unknown as T;
  }

  const cleaned: Record<string, any> = {};
  for (const [key, value] of Object.entries(data as Record<string, any>)) {
    if (value !== undefined && typeof value !== 'function') {
      const cleanedVal = cleanForFirestore(value, seen);
      if (cleanedVal !== undefined) {
        cleaned[key] = cleanedVal;
      }
    }
  }
  return cleaned as T;
}

/**
 * Subscribe to real-time updates for a Firestore collection scoped STRICTLY by productorId
 */
export function subscribeToCollection<T>(
  collectionName: string,
  productorId: string,
  callback: (data: T[]) => void
): () => void {
  if (!productorId || !firebaseInitStatus.isValid) {
    console.warn(`[DEBUG Firestore Subscribe Warn] No se puede suscribir a '${collectionName}' sin productorId o con Firebase no inicializado.`);
    callback([]);
    return () => {};
  }

  console.log(`[DEBUG Firestore Read Query] Suscribiendo a '${collectionName}' donde productorId == "${productorId}" [Proyecto: ${firebaseConfig.projectId}, DB: ${firebaseConfig.firestoreDatabaseId}]`);

  const colRef = collection(db, collectionName);
  const q = query(colRef, where('productorId', '==', productorId));

  return onSnapshot(
    q,
    (snapshot) => {
      const items: T[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data()
      })) as T[];
      console.log(`[DEBUG Firestore Read Result] Colección '${collectionName}': ${items.length} items recibidos para el productor ${productorId}`);
      callback(items);
    },
    (error) => {
      console.error(`[DEBUG Firestore Read/Permission Error] Error de suscripción en '${collectionName}' para el productor ${productorId}:`, error?.code, error?.message || error);
    }
  );
}

/**
 * Save or update a document in a collection with the producer's ID
 */
export async function saveDocument<T extends { id: string }>(
  collectionName: string,
  item: T,
  productorId: string
): Promise<void> {
  if (!firebaseInitStatus.isValid) {
    throw new Error(`Error en Firestore: ${firebaseInitStatus.errorDetail}`);
  }

  const currentUid = auth.currentUser?.uid;
  const effectiveProductorId = currentUid || productorId;

  if (!effectiveProductorId || typeof effectiveProductorId !== 'string' || effectiveProductorId.trim() === '') {
    console.error(`[DEBUG Firestore Write Error] No se proporcionó un productorId válido al guardar en '${collectionName}'`);
    throw new Error('No se proporcionó un productorId válido para guardar el documento en Firestore');
  }

  console.log(`[DEBUG Firestore Write Attempt] Guardando doc '${item.id}' en colección '${collectionName}' con productorId=${effectiveProductorId}`);

  try {
    const docRef = doc(db, collectionName, item.id);
    const itemWithProductor = { ...item, productorId: effectiveProductorId };
    const cleanedItem = cleanForFirestore(itemWithProductor);
    await setDoc(docRef, cleanedItem, { merge: true });
    console.log(`[DEBUG Firestore Write Success] Guardado exitoso doc '${item.id}' en '${collectionName}' para productorId=${effectiveProductorId}`);
  } catch (error: any) {
    console.error(`[DEBUG Firestore Write Error] Falló al guardar doc '${item.id}' en '${collectionName}':`, error?.code, error?.message || String(error));
    throw error;
  }
}

/**
 * Add a new document to a collection with auto-generated ID including the producer's ID
 */
export async function addDocument<T extends Record<string, any>>(
  collectionName: string,
  data: T,
  productorId: string
): Promise<string> {
  if (!firebaseInitStatus.isValid) {
    throw new Error(`Error en Firestore: ${firebaseInitStatus.errorDetail}`);
  }

  const currentUid = auth.currentUser?.uid;
  const effectiveProductorId = currentUid || productorId;

  if (!effectiveProductorId || typeof effectiveProductorId !== 'string' || effectiveProductorId.trim() === '') {
    console.error(`[DEBUG Firestore Write Error] No se proporcionó un productorId válido al añadir en '${collectionName}'`);
    throw new Error('No se proporcionó un productorId válido para añadir documento en Firestore');
  }

  console.log(`[DEBUG Firestore Write Attempt] Añadiendo nuevo doc a '${collectionName}' con productorId=${effectiveProductorId}`);

  try {
    const colRef = collection(db, collectionName);
    const dataWithProductor = { ...data, productorId: effectiveProductorId };
    const cleanedData = cleanForFirestore(dataWithProductor);
    const docRef = await addDoc(colRef, cleanedData);
    console.log(`[DEBUG Firestore Write Success] Añadido doc ID '${docRef.id}' en '${collectionName}' para productorId=${effectiveProductorId}`);
    return docRef.id;
  } catch (error: any) {
    console.error(`[DEBUG Firestore Write Error] Falló al añadir doc en '${collectionName}':`, error?.code, error?.message || String(error));
    throw error;
  }
}

/**
 * Delete a document from a collection
 */
export async function deleteDocument(
  collectionName: string,
  id: string
): Promise<void> {
  if (!firebaseInitStatus.isValid) {
    throw new Error(`Error en Firestore: ${firebaseInitStatus.errorDetail}`);
  }

  console.log(`[DEBUG Firestore Write Attempt] Eliminando doc '${id}' de colección '${collectionName}'`);
  try {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
    console.log(`[DEBUG Firestore Write Success] Eliminado doc '${id}' de colección '${collectionName}'`);
  } catch (error: any) {
    console.error(`[DEBUG Firestore Write Error] Falló al eliminar doc '${id}' de '${collectionName}':`, error?.code, error?.message || String(error));
    throw error;
  }
}

/**
 * Seed initial data for a producer if their collection is empty
 */
export async function seedCollectionIfEmpty<T extends { id: string }>(
  collectionName: string,
  initialData: T[],
  productorId: string,
  bypassClearedCheck: boolean = false
): Promise<void> {
  if (!productorId || !firebaseInitStatus.isValid) return;

  try {
    if (!bypassClearedCheck) {
      const isCleared = await checkIsDatabaseCleared(productorId);
      if (isCleared) {
        console.log(`[DEBUG Firestore Seed] Base de datos del productor ${productorId} está marcada como borrada. Omitiendo seed de '${collectionName}'.`);
        return;
      }
    }

    console.log(`[DEBUG Firestore Read Query] Verificando si '${collectionName}' está vacía para productor ${productorId}...`);
    const colRef = collection(db, collectionName);
    const q = query(colRef, where('productorId', '==', productorId));
    const snapshot = await getDocs(q);

    if (snapshot.empty && initialData.length > 0) {
      console.log(`[DEBUG Firestore Write Batch] Colección '${collectionName}' vacía para productor ${productorId}. Insertando ${initialData.length} registros...`);
      const batch = writeBatch(db);
      for (const item of initialData) {
        const itemRef = doc(db, collectionName, item.id);
        const itemWithProductor = { ...item, productorId };
        const cleanedItem = cleanForFirestore(itemWithProductor);
        batch.set(itemRef, cleanedItem);
      }
      await batch.commit();
      console.log(`[DEBUG Firestore Write Success] Sembrado exitoso de ${initialData.length} ítems en '${collectionName}' para productor ${productorId}`);
    } else {
      console.log(`[DEBUG Firestore Seed] Colección '${collectionName}' ya contiene ${snapshot.docs.length} documentos para el productor ${productorId}. Omitiendo seed.`);
    }
  } catch (error: any) {
    console.error(`[DEBUG Firestore Seed/Write Error] Error sembrando colección ${collectionName} para productor ${productorId}:`, error?.code, error?.message || String(error));
  }
}

/**
 * Clear all documents for a specific producer from all Firestore collections
 */
export async function clearAllFirestoreCollections(productorId: string): Promise<void> {
  if (!productorId || !firebaseInitStatus.isValid) return;

  console.log(`[DEBUG Firestore Write Batch] Limpiando todas las colecciones para el productor ${productorId}...`);

  // Mark status as cleared for this producer in Firestore
  await markDatabaseStatus(true, productorId);

  const collectionNames = [
    'clientes',
    'aseguradoras',
    'polizas',
    'vehiculos',
    'contratosArt',
    'reglas',
    'alertasTareas',
    'renovaciones'
  ];

  for (const name of collectionNames) {
    try {
      const colRef = collection(db, name);
      const q = query(colRef, where('productorId', '==', productorId));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        console.log(`[DEBUG Firestore Write Batch] Eliminando ${snapshot.docs.length} docs de '${name}' para productor ${productorId}...`);
        const docs = snapshot.docs;
        for (let i = 0; i < docs.length; i += 400) {
          const chunk = docs.slice(i, i + 400);
          const batch = writeBatch(db);
          chunk.forEach((d) => batch.delete(d.ref));
          await batch.commit();
        }
        console.log(`[DEBUG Firestore Write Success] Limpieza completada de '${name}' para productor ${productorId}`);
      } else {
        console.log(`[DEBUG Firestore Write] Colección '${name}' ya estaba vacía para productor ${productorId}`);
      }
    } catch (err: any) {
      console.error(`[DEBUG Firestore Write Error] Error limpiando colección ${name} para productor ${productorId}:`, err?.code, err?.message || String(err));
    }
  }
}


