import React, { useState, useEffect } from 'react';
import {
  Cliente,
  Aseguradora,
  Poliza,
  Vehiculo,
  ContratoART,
  ReglaAutomatizacion,
  AlertaTarea,
  RenovacionItem
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
  markDatabaseStatus
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

    return () => {
      unsubClientes();
      unsubAseguradoras();
      unsubPolizas();
      unsubVehiculos();
      unsubArt();
      unsubReglas();
      unsubTareas();
      unsubRenovaciones();
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
    const clienteCompleto: Cliente = { ...nuevo, id, fechaAlta, productorId };
    setClientes((prev) => [clienteCompleto, ...prev]);
    await saveDocument('clientes', clienteCompleto, productorId);
  };

  const handleAddAseguradora = async (nueva: Omit<Aseguradora, 'id'>) => {
    const id = `aseg-${Date.now()}`;
    const aseguradoraCompleta: Aseguradora = { ...nueva, id, productorId };
    setAseguradoras((prev) => [aseguradoraCompleta, ...prev]);
    await saveDocument('aseguradoras', aseguradoraCompleta, productorId);
  };

  const handleAddPoliza = async (nueva: Omit<Poliza, 'id'>) => {
    const id = `pol-${Date.now()}`;
    const polizaCompleta: Poliza = { ...nueva, id, productorId };
    setPolizas((prev) => [polizaCompleta, ...prev]);
    await saveDocument('polizas', polizaCompleta, productorId);

    // Check if near expiration to add to renovation pipeline (Process 7)
    const hastaDate = new Date(nueva.vigenciaHasta);
    const today = new Date();
    const diffDays = Math.ceil((hastaDate.getTime() - today.getTime()) / (1000 * 3600 * 24));

    if (diffDays <= 60) {
      const cliente = clientes.find((c) => c.id === nueva.clienteId);
      const aseguradora = aseguradoras.find((a) => a.id === nueva.aseguradoraId);
      const nuevaRenovacion: RenovacionItem = {
        id: `ren-${Date.now()}`,
        productorId,
        polizaId: id,
        clienteNombre: cliente?.nombreRazonSocial || 'Cliente',
        clienteCuit: cliente?.cuitCuilDni || '',
        aseguradoraNombre: aseguradora?.nombre || 'Compañía',
        ramo: nueva.ramo,
        vigenciaHasta: nueva.vigenciaHasta,
        diasParaVencer: diffDays > 0 ? diffDays : 0,
        sumaAseguradaActual: nueva.sumaAsegurada,
        sumaSugeridaInflacion: Math.round(nueva.sumaAsegurada * 1.3),
        premioActual: nueva.premioTotal,
        premioNuevaPropuesta: Math.round(nueva.premioTotal * 1.3),
        estadoRenovacion: 'Pendiente',
        siniestralidad: 'Sin Siniestros'
      };
      setRenovaciones((prev) => [nuevaRenovacion, ...prev]);
      await saveDocument('renovaciones', nuevaRenovacion, productorId);
    }
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
    nuevoEstado: RenovacionItem['estadoRenovacion']
  ) => {
    const ren = renovaciones.find((r) => r.id === renovacionId);
    if (ren) {
      const updatedRen: RenovacionItem = { ...ren, estadoRenovacion: nuevoEstado, productorId };
      setRenovaciones((prev) =>
        prev.map((r) => (r.id === renovacionId ? updatedRen : r))
      );
      await saveDocument('renovaciones', updatedRen, productorId);
    }
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
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col md:flex-row gap-6">
        
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
              onNavigate={setActiveProcessId}
            />
          )}

          {activeProcessId === 'proceso-2' && (
            <AseguradorasView
              aseguradoras={aseguradoras}
              onAddAseguradora={handleAddAseguradora}
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
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
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
