import React, { useState, useEffect } from 'react';
import {
  Cliente,
  Aseguradora,
  Poliza,
  Vehiculo,
  ContratoART,
  ReglaAutomatizacion,
  AlertaTarea,
  RenovacionItem,
  EstadoRenovacion,
  RamoCatalogo,
  INITIAL_RAMOS_CATALOGO,
  getRenovacionesUnificadas,
  isEstadoGestionCerrado
} from './types';
import {
  INITIAL_CLIENTES,
  INITIAL_ASEGURADORAS,
  INITIAL_POLIZAS,
  INITIAL_VEHICULOS,
  INITIAL_ART,
  INITIAL_REGLAS,
  INITIAL_ALERTAS_TAREAS,
  INITIAL_RENOVACIONES
} from './data/mockData';
import {
  subscribeToCollection,
  saveDocument,
  seedCollectionIfEmpty,
  clearAllFirestoreCollections,
  checkIsDatabaseCleared,
  markDatabaseStatus,
  subscribeToGeneralCollection,
  saveGeneralDocument,
  seedGeneralCollectionIfEmpty
} from './lib/firebase';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginView } from './components/LoginView';
import { AdminDiagnosticPanel } from './components/AdminDiagnosticPanel';

import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { ClientesView } from './components/ClientesView';
import { AseguradorasView } from './components/AseguradorasView';
import { PolizasView } from './components/PolizasView';
import { VehiculosView } from './components/VehiculosView';
import { ArtView } from './components/ArtView';
import { AutomatizacionesView } from './components/AutomatizacionesView';
import { RenovacionesView } from './components/RenovacionesView';
import { ManualModulo0View } from './components/ManualModulo0View';
import { AdminRamosView } from './components/AdminRamosView';
import { Database, ShieldCheck } from 'lucide-react';

function MainAppContent() {
  const { user, loading } = useAuth();
  const [activeProcessId, setActiveProcessId] = useState<string>('proceso-8'); // Default Panel de Control
  const [searchQuery, setSearchQuery] = useState('');

  // Domain State Stores
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [aseguradoras, setAseguradoras] = useState<Aseguradora[]>([]);
  const [polizas, setPolizas] = useState<Poliza[]>([]);
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [contratosArt, setContratosArt] = useState<ContratoART[]>([]);
  const [reglas, setReglas] = useState<ReglaAutomatizacion[]>([]);
  const [alertasTareas, setAlertasTareas] = useState<AlertaTarea[]>([]);
  const [renovaciones, setRenovaciones] = useState<RenovacionItem[]>([]);
  const [ramos, setRamos] = useState<RamoCatalogo[]>(INITIAL_RAMOS_CATALOGO);
  const [isCloudConnected, setIsCloudConnected] = useState<boolean>(false);
  const [isDbCleared, setIsDbCleared] = useState<boolean>(false);
  const [showQuickModal, setShowQuickModal] = useState<boolean>(false);
  const [showAdminDiagnostic, setShowAdminDiagnostic] = useState<boolean>(false);

  // Subscribe to Firebase Collections for Active Producer (No automatic mass seeding on mount if data exists)
  useEffect(() => {
    if (!user) {
      setClientes([]);
      setAseguradoras([]);
      setPolizas([]);
      setVehiculos([]);
      setContratosArt([]);
      setReglas([]);
      setAlertasTareas([]);
      setRenovaciones([]);
      return;
    }

    const productorId = user.uid;

    const initFirebaseData = async () => {
      try {
        console.log(`[DEBUG App] Initializing Firestore connection for active producer UID: ${productorId}`);

        // Seed general ramos catalog if needed (independent of tenant isolation)
        await seedGeneralCollectionIfEmpty('ramos', INITIAL_RAMOS_CATALOGO);

        const isCleared = await checkIsDatabaseCleared(productorId);
        setIsDbCleared(isCleared);

        if (!isCleared) {
          console.log(`[DEBUG App] Database for producer ${productorId} is active. Checking initial seed requirements...`);
          await Promise.all([
            seedCollectionIfEmpty('clientes', INITIAL_CLIENTES, productorId),
            seedCollectionIfEmpty('aseguradoras', INITIAL_ASEGURADORAS, productorId),
            seedCollectionIfEmpty('polizas', INITIAL_POLIZAS, productorId),
            seedCollectionIfEmpty('vehiculos', INITIAL_VEHICULOS, productorId),
            seedCollectionIfEmpty('contratosArt', INITIAL_ART, productorId),
            seedCollectionIfEmpty('reglas', INITIAL_REGLAS, productorId),
            seedCollectionIfEmpty('alertasTareas', INITIAL_ALERTAS_TAREAS, productorId),
            seedCollectionIfEmpty('renovaciones', INITIAL_RENOVACIONES, productorId)
          ]);
        }

        setIsCloudConnected(true);
      } catch (err: any) {
        console.error(`[DEBUG App Error] Firebase initialization error for producer ${productorId}:`, err?.code, err?.message || String(err));
      }
    };

    initFirebaseData();

    // Setup real-time listeners filtering strictly by productorId
    const unsubClientes = subscribeToCollection<Cliente>('clientes', productorId, (data) => {
      setClientes(data);
    });
    const unsubAseguradoras = subscribeToCollection<Aseguradora>('aseguradoras', productorId, (data) => {
      setAseguradoras(data);
    });
    const unsubPolizas = subscribeToCollection<Poliza>('polizas', productorId, (data) => {
      setPolizas(data);
    });
    const unsubVehiculos = subscribeToCollection<Vehiculo>('vehiculos', productorId, (data) => {
      setVehiculos(data);
    });
    const unsubArt = subscribeToCollection<ContratoART>('contratosArt', productorId, (data) => {
      setContratosArt(data);
    });
    const unsubReglas = subscribeToCollection<ReglaAutomatizacion>('reglas', productorId, (data) => {
      setReglas(data);
    });
    const unsubTareas = subscribeToCollection<AlertaTarea>('alertasTareas', productorId, (data) => {
      setAlertasTareas(data);
    });
    const unsubRenovaciones = subscribeToCollection<RenovacionItem>('renovaciones', productorId, (data) => {
      setRenovaciones(data);
    });

    // Real-time listener for General Shared Ramos Catalog (MOD-010)
    const unsubRamos = subscribeToGeneralCollection<RamoCatalogo>('ramos', (data) => {
      if (data && data.length > 0) {
        setRamos(data);
      }
    });

    return () => {
      unsubClientes();
      unsubAseguradoras();
      unsubPolizas();
      unsubVehiculos();
      unsubArt();
      unsubReglas();
      unsubTareas();
      unsubRenovaciones();
      unsubRamos();
    };
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 space-y-4 font-sans">
        <div className="w-12 h-12 rounded-xl bg-[#005a9e] flex items-center justify-center animate-pulse">
          <ShieldCheck className="w-7 h-7 text-white" />
        </div>
        <div className="text-center space-y-1">
          <h2 className="text-lg font-bold text-slate-100">Verificando sesión...</h2>
          <p className="text-xs text-slate-400">Plataforma AVISAME para cionar.com.ar</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginView />;
  }

  const productorId = user.uid;

  const handleClearDatabase = async () => {
    const confirmClear = window.confirm(
      '¿Está seguro de que desea VACIAR la base de datos de su cartera?\n\nEsta acción eliminará únicamente sus datos en la nube para que pueda comenzar la carga real desde cero.'
    );
    if (!confirmClear) return;

    try {
      setIsDbCleared(true);
      setClientes([]);
      setAseguradoras([]);
      setPolizas([]);
      setVehiculos([]);
      setContratosArt([]);
      setReglas([]);
      setAlertasTareas([]);
      setRenovaciones([]);

      await clearAllFirestoreCollections(productorId);

      alert('Base de datos vaciada con éxito. Su cartera está en blanco para ingresar pólizas reales.');
    } catch (err: any) {
      console.error('Error al vaciar la base de datos:', err?.message || String(err));
      alert('Ocurrió un error al vaciar la base de datos.');
    }
  };

  const handleResetDemoData = async () => {
    const confirmReset = window.confirm(
      '¿Desea cargar los datos de demostración iniciales en su cartera de Firestore?'
    );
    if (!confirmReset) return;

    try {
      setIsDbCleared(false);
      await markDatabaseStatus(false, productorId);
      await Promise.all([
        seedCollectionIfEmpty('clientes', INITIAL_CLIENTES, productorId, true),
        seedCollectionIfEmpty('aseguradoras', INITIAL_ASEGURADORAS, productorId, true),
        seedCollectionIfEmpty('polizas', INITIAL_POLIZAS, productorId, true),
        seedCollectionIfEmpty('vehiculos', INITIAL_VEHICULOS, productorId, true),
        seedCollectionIfEmpty('contratosArt', INITIAL_ART, productorId, true),
        seedCollectionIfEmpty('reglas', INITIAL_REGLAS, productorId, true),
        seedCollectionIfEmpty('alertasTareas', INITIAL_ALERTAS_TAREAS, productorId, true),
        seedCollectionIfEmpty('renovaciones', INITIAL_RENOVACIONES, productorId, true)
      ]);
      alert('Datos de prueba cargados correctamente en su cartera de Firebase.');
    } catch (err: any) {
      console.error('Error al restaurar datos demo:', err?.message || String(err));
    }
  };

  // Add Handlers with Firebase Sync & productorId inclusion
  const handleAddCliente = async (nuevo: Omit<Cliente, 'id' | 'fechaAlta'>) => {
    const id = `cli-${Date.now()}`;
    const fechaAlta = new Date().toISOString().split('T')[0];
    const horaAlta = new Date().toTimeString().split(' ')[0];
    const trazabilidadInicial = nuevo.trazabilidad || [
      {
        id: `traz-${Date.now()}`,
        clienteId: id,
        operacion: 'ALTA' as const,
        fecha: fechaAlta,
        hora: horaAlta,
        usuario: user.email || 'PAS Titular',
        resumenModificacion: 'Alta de nuevo cliente en cartera comercial',
        estadoAnterior: '-',
        estadoPosterior: nuevo.estado || 'Activo'
      }
    ];
    const clienteCompleto: Cliente = {
      ...nuevo,
      id,
      fechaAlta,
      productorId,
      trazabilidad: trazabilidadInicial
    };
    setClientes((prev) => [clienteCompleto, ...prev]);
    await saveDocument('clientes', clienteCompleto, productorId);
  };

  const handleUpdateCliente = async (clienteActualizado: Cliente) => {
    const clienteCompleto: Cliente = { ...clienteActualizado, productorId };
    setClientes((prev) =>
      prev.map((c) => (c.id === clienteActualizado.id ? clienteCompleto : c))
    );
    await saveDocument('clientes', clienteCompleto, productorId);
  };

  const handleAddAseguradora = async (nueva: Omit<Aseguradora, 'id'>) => {
    const id = `aseg-${Date.now()}`;
    const aseguradoraCompleta: Aseguradora = { ...nueva, id, productorId };
    setAseguradoras((prev) => [aseguradoraCompleta, ...prev]);
    await saveDocument('aseguradoras', aseguradoraCompleta, productorId);
  };

  const handleUpdateAseguradora = async (aseguradoraActualizada: Aseguradora) => {
    const aseguradoraCompleta: Aseguradora = { ...aseguradoraActualizada, productorId };
    setAseguradoras((prev) =>
      prev.map((a) => (a.id === aseguradoraActualizada.id ? aseguradoraCompleta : a))
    );
    await saveDocument('aseguradoras', aseguradoraCompleta, productorId);
  };

  // Handler to add a new Ramo to the shared General Catalog (MOD-010)
  const handleAddRamo = async (nombre: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const trimmed = nombre.trim();

      if (!trimmed) {
        return {
          success: false,
          error: 'El nombre del ramo no puede estar vacio.'
        };
      }

      // Case-insensitive duplicate check
      const normalized = trimmed.toLowerCase();

      if (ramos.some((r) => r.nombre.trim().toLowerCase() === normalized)) {
        return {
          success: false,
          error: `El ramo "${trimmed}" ya existe en el catalogo general.`
        };
      }

      const id = `ramo-${Date.now()}`;

      const nuevoRamo: RamoCatalogo = {
        id,
        nombre: trimmed,
        activo: true,
        fechaCreacion: new Date().toISOString()
      };

      // Optimistic local state update
      setRamos((prev) => [...prev, nuevoRamo]);

      // Save to general/shared Firestore collection without tenant isolation
      await saveGeneralDocument('ramos', nuevoRamo);

      return { success: true };
    } catch (err: any) {
      console.error('Error al registrar ramo en catalogo general:', err);

      return {
        success: false,
        error: err?.message || 'Error al guardar el ramo.'
      };
    }
  };

  // Handler to activate/deactivate a Ramo in the shared General Catalog (MOD-010)
  const handleToggleRamo = async (ramo: RamoCatalogo): Promise<void> => {
    try {
      const ramoActualizado: RamoCatalogo = {
        ...ramo,
        activo: !ramo.activo
      };

      setRamos((prev) =>
        prev.map((r) => (r.id === ramo.id ? ramoActualizado : r))
      );

      await saveGeneralDocument('ramos', ramoActualizado);
    } catch (err: any) {
      console.error('Error al actualizar estado del ramo:', err);

      // Restore previous state if Firestore save fails
      setRamos((prev) =>
        prev.map((r) => (r.id === ramo.id ? ramo : r))
      );

      throw err;
    }
  };
  const handleAddPoliza = async (nueva: Omit<Poliza, 'id'>) => {
    const id = `pol-${Date.now()}`;
    const polizaCompleta: Poliza = { ...nueva, id, productorId };
    setPolizas((prev) => [polizaCompleta, ...prev]);
    await saveDocument('polizas', polizaCompleta, productorId);
  };

  const handleUpdatePoliza = async (polizaActualizada: Poliza) => {
    const polizaCompleta: Poliza = { ...polizaActualizada, productorId };
    setPolizas((prev) =>
      prev.map((p) => (p.id === polizaActualizada.id ? polizaCompleta : p))
    );
    await saveDocument('polizas', polizaCompleta, productorId);
  };

  const handleAddVehiculo = async (nuevo: Omit<Vehiculo, 'id'>) => {
    const id = `veh-${Date.now()}`;
    const vehiculoCompleto: Vehiculo = { ...nuevo, id, productorId };
    setVehiculos((prev) => [vehiculoCompleto, ...prev]);
    await saveDocument('vehiculos', vehiculoCompleto, productorId);

    // If GNC near expiration, generate alert task
    if (nuevo.poseeGnc && nuevo.vencimientoGnc) {
      const cliente = clientes.find((c) => c.id === nuevo.clienteId);
      const nuevaTarea: AlertaTarea = {
        id: `alt-${Date.now()}`,
        productorId,
        titulo: `Vencimiento Oblea GNC: ${nuevo.marca} ${nuevo.modelo}`,
        descripcion: `Vehículo ${nuevo.dominioChasis} del cliente ${cliente?.nombreRazonSocial}. Oblea vence el ${nuevo.vencimientoGnc}.`,
        procesoOrigen: 4,
        prioridad: 'Alta',
        fechaCreacion: new Date().toISOString().split('T')[0],
        vencimiento: nuevo.vencimientoGnc,
        estado: 'Pendiente',
        clienteNombre: cliente?.nombreRazonSocial,
        targetProceso: 'proceso-4'
      };
      setAlertasTareas((prev) => [nuevaTarea, ...prev]);
      await saveDocument('alertasTareas', nuevaTarea, productorId);
    }
  };

  const handleAddContratoArt = async (nuevo: Omit<ContratoART, 'id' | 'mesesPermanencia' | 'esElegibleTraspaso'>) => {
    const id = `art-${Date.now()}`;
    const fechaIni = new Date(nuevo.fechaInicioContrato);
    const now = new Date();
    const meses = Math.floor((now.getTime() - fechaIni.getTime()) / (1000 * 3600 * 24 * 30.44));
    const esElegible = meses >= 12;

    const contratoCompleto: ContratoART = {
      ...nuevo,
      id,
      productorId,
      mesesPermanencia: meses > 0 ? meses : 0,
      esElegibleTraspaso: esElegible
    };
    setContratosArt((prev) => [contratoCompleto, ...prev]);
    await saveDocument('contratosArt', contratoCompleto, productorId);
  };

  const handleUpdateContratoArt = async (contratoActualizado: ContratoART) => {
    const contratoCompleto: ContratoART = {
      ...contratoActualizado,
      productorId
    };
    setContratosArt((prev) =>
      prev.map((c) => (c.id === contratoActualizado.id ? contratoCompleto : c))
    );
    await saveDocument('contratosArt', contratoCompleto, productorId);
  };

  const handleCompleteTask = async (taskId: string) => {
    const task = alertasTareas.find((t) => t.id === taskId);
    if (task) {
      const updatedTask: AlertaTarea = { ...task, estado: 'Completada', productorId };
      setAlertasTareas((prev) =>
        prev.map((t) => (t.id === taskId ? updatedTask : t))
      );
      await saveDocument('alertasTareas', updatedTask, productorId);
    }
  };

  const handleToggleRegla = async (reglaId: string) => {
    const regla = reglas.find((r) => r.id === reglaId);
    if (regla) {
      const updatedRegla: ReglaAutomatizacion = {
        ...regla,
        productorId,
        estado: regla.estado === 'Activa' ? 'Pausada' : 'Activa'
      };
      setReglas((prev) =>
        prev.map((r) => (r.id === reglaId ? updatedRegla : r))
      );
      await saveDocument('reglas', updatedRegla, productorId);
    }
  };

  const handleEjecutarMotor = async () => {
    // Scan active rules and update execution counts in Firestore
    const updatedReglas = reglas.map((r) => {
      if (r.estado === 'Activa') {
        const u = {
          ...r,
          productorId,
          ejecucionesTotales: r.ejecucionesTotales + 1,
          ultimaEjecucion: new Date().toISOString().replace('T', ' ').substring(0, 16)
        };
        saveDocument('reglas', u, productorId);
        return u;
      }
      return r;
    });
    setReglas(updatedReglas);
    alert('Motor de Automatizaciones (Proceso 6) ejecutado correctamente. Reglas de su cartera actualizadas en Firestore.');
  };

  const handleUpdateEstadoRenovacion = async (
    renovacionId: string,
    nuevoEstado: EstadoRenovacion
  ) => {
    const unificadas = getRenovacionesUnificadas(polizas, renovaciones, clientes, aseguradoras);
    const itemTarget = unificadas.find((r) => r.id === renovacionId);
    if (!itemTarget) return;

    const isVirtual = renovacionId.startsWith('renovacion-virtual-');
    const docId = isVirtual ? `ren-${itemTarget.polizaId}` : renovacionId;

    const fechaCierre = isEstadoGestionCerrado(nuevoEstado)
      ? new Date().toISOString().split('T')[0]
      : itemTarget.fechaCierreGestion;

    const updatedRen: RenovacionItem = {
      ...itemTarget,
      id: docId,
      estadoRenovacion: nuevoEstado,
      fechaCierreGestion: fechaCierre,
      productorId
    };

    setRenovaciones((prev) => {
      const existingIndex = prev.findIndex((r) => r.id === docId || r.polizaId === itemTarget.polizaId);
      if (existingIndex >= 0) {
        const copy = [...prev];
        copy[existingIndex] = updatedRen;
        return copy;
      }
      return [updatedRen, ...prev];
    });

    await saveDocument('renovaciones', updatedRen, productorId);
  };

  const pendingTasksCount = alertasTareas.filter((a) => a.estado === 'Pendiente').length;

  return (
    <div className="min-h-screen bg-[#c7c7c7]/20 font-sans text-slate-800 flex flex-col">
      
      {/* Top Header */}
      <Header
        activeProcessId={activeProcessId}
        onNavigate={setActiveProcessId}
        pendingTasksCount={pendingTasksCount}
        onOpenNewRecordModal={() => setShowQuickModal(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenAdminDiagnostic={() => setShowAdminDiagnostic(true)}
      />

      {/* Main Workspace Container */}
      <main className="flex-1 w-full p-4 sm:p-6 lg:p-8 flex flex-col md:flex-row gap-6">
        
        {/* Left Navigation Sidebar */}
        <Sidebar
          activeProcessId={activeProcessId}
          onNavigate={setActiveProcessId}
          pendingAlertsCount={pendingTasksCount}
          onClearDatabase={handleClearDatabase}
          onResetDemoData={handleResetDemoData}
          isDbCleared={isDbCleared}
        />

        {/* Central Dynamic Process Content View */}
        <div className="flex-1 min-w-0">
          {activeProcessId === 'proceso-8' && (
            <DashboardView
              clientes={clientes}
              polizas={polizas}
              aseguradoras={aseguradoras}
              vehiculos={vehiculos}
              contratosArt={contratosArt}
              alertasTareas={alertasTareas}
              renovaciones={renovaciones}
              onNavigate={setActiveProcessId}
              onCompleteTask={handleCompleteTask}
            />
          )}

          {activeProcessId === 'proceso-1' && (
            <ClientesView
              clientes={clientes}
              polizas={polizas}
              vehiculos={vehiculos}
              contratosArt={contratosArt}
              onAddCliente={handleAddCliente}
              onUpdateCliente={handleUpdateCliente}
              onNavigate={setActiveProcessId}
            />
          )}

          {activeProcessId === 'proceso-2' && (
            <AseguradorasView
              aseguradoras={aseguradoras}
              onAddAseguradora={handleAddAseguradora}
              onUpdateAseguradora={handleUpdateAseguradora}
            />
          )}
          {activeProcessId === 'admin-ramos' && (
            <AdminRamosView
              ramos={ramos}
              onAddRamo={handleAddRamo}
              onToggleRamo={handleToggleRamo}
            />
          )}

          {activeProcessId === 'proceso-3' && (
            <PolizasView
              polizas={polizas}
              clientes={clientes}
              aseguradoras={aseguradoras}
              onAddPoliza={handleAddPoliza}
              onUpdatePoliza={handleUpdatePoliza}
              onNavigate={setActiveProcessId}
            />
          )}

          {activeProcessId === 'proceso-4' && (
            <VehiculosView
              vehiculos={vehiculos}
              clientes={clientes}
              polizas={polizas}
              onAddVehiculo={handleAddVehiculo}
            />
          )}

          {activeProcessId === 'proceso-5' && (
            <ArtView
              contratosArt={contratosArt}
              clientes={clientes}
              aseguradoras={aseguradoras}
              onAddContratoArt={handleAddContratoArt}
              onUpdateContratoArt={handleUpdateContratoArt}
            />
          )}

          {activeProcessId === 'proceso-6' && (
            <AutomatizacionesView
              reglas={reglas}
              onToggleRegla={handleToggleRegla}
              onEjecutarMotor={handleEjecutarMotor}
            />
          )}

          {activeProcessId === 'proceso-7' && (
            <RenovacionesView
              renovaciones={renovaciones}
              polizas={polizas}
              clientes={clientes}
              aseguradoras={aseguradoras}
              onUpdateEstadoRenovacion={handleUpdateEstadoRenovacion}
            />
          )}

          {activeProcessId === 'modulo-0' && (
            <ManualModulo0View
              onNavigate={setActiveProcessId}
            />
          )}
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#c7c7c7] py-4 text-center text-xs text-[#6d6e71]">
        <div className="w-full px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-[#005a9e]">AVISAME · cionar.com.ar</span>
            <span className="hidden sm:inline text-slate-300">|</span>
            <span className="inline-flex items-center space-x-1 text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              <Database className="w-3 h-3 text-emerald-600" />
              <span>Multi-Tenant Producción (ID: {productorId.substring(0, 8)}...)</span>
            </span>
          </div>
          <span className="text-[11px] text-[#9e9e9e]">Aislamiento de Cartera por Productor Asesor de Seguros</span>
        </div>
      </footer>

      {/* Modal Quick Selector */}
      {showQuickModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#c7c7c7] shadow-xl max-w-sm w-full p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="text-sm font-bold text-slate-900">¿Qué nuevo registro desea crear?</h3>
              <button onClick={() => setShowQuickModal(false)} className="text-[#9e9e9e] font-bold text-lg cursor-pointer">
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <button
                onClick={() => {
                  setShowQuickModal(false);
                  setActiveProcessId('proceso-1');
                }}
                className="w-full p-3 bg-slate-50 border border-[#c7c7c7] rounded-lg hover:bg-[#005a9e] hover:text-white transition-all text-left font-bold cursor-pointer"
              >
                1. Nuevo Cliente (Persona Física / Jurídica)
              </button>
              <button
                onClick={() => {
                  setShowQuickModal(false);
                  setActiveProcessId('proceso-3');
                }}
                className="w-full p-3 bg-slate-50 border border-[#c7c7c7] rounded-lg hover:bg-[#005a9e] hover:text-white transition-all text-left font-bold cursor-pointer"
              >
                2. Nueva Póliza Emitida
              </button>
              <button
                onClick={() => {
                  setShowQuickModal(false);
                  setActiveProcessId('proceso-4');
                }}
                className="w-full p-3 bg-slate-50 border border-[#c7c7c7] rounded-lg hover:bg-[#005a9e] hover:text-white transition-all text-left font-bold cursor-pointer"
              >
                3. Nuevo Vehículo (Dominio / 0km)
              </button>
              <button
                onClick={() => {
                  setShowQuickModal(false);
                  setActiveProcessId('proceso-5');
                }}
                className="w-full p-3 bg-slate-50 border border-[#c7c7c7] rounded-lg hover:bg-[#005a9e] hover:text-white transition-all text-left font-bold cursor-pointer"
              >
                4. Nuevo Contrato ART (Ley 24.557)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Diagnostic Panel Modal */}
      <AdminDiagnosticPanel
        isOpen={showAdminDiagnostic}
        onClose={() => setShowAdminDiagnostic(false)}
      />

    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}

export default App;
