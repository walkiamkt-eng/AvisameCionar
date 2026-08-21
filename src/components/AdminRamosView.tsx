import React, { useState } from 'react';
import { Plus, Power, ShieldCheck } from 'lucide-react';
import { RamoCatalogo } from '../types';

interface AdminRamosViewProps {
  ramos: RamoCatalogo[];
  onAddRamo: (nombre: string) => Promise<{ success: boolean; error?: string }>;
  onToggleRamo: (ramo: RamoCatalogo) => Promise<void>;
}

export const AdminRamosView: React.FC<AdminRamosViewProps> = ({
  ramos,
  onAddRamo,
  onToggleRamo
}) => {
  const [nuevoRamo, setNuevoRamo] = useState('');
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

  const handleAgregar = async () => {
    setError('');

    const nombre = nuevoRamo.trim();

    if (!nombre) {
      setError('Ingrese el nombre del ramo.');
      return;
    }

    setGuardando(true);

    try {
      const resultado = await onAddRamo(nombre);

      if (!resultado.success) {
        setError(resultado.error || 'No fue posible agregar el ramo.');
        return;
      }

      setNuevoRamo('');
    } catch (err: any) {
      console.error('Error al agregar ramo:', err);
      setError(err?.message || 'No fue posible agregar el ramo.');
    } finally {
      setGuardando(false);
    }
  };

  const activos = ramos.filter((r) => r.activo).length;
  const inactivos = ramos.filter((r) => !r.activo).length;

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-xl border border-[#c7c7c7] shadow-xs overflow-hidden">
        <div className="p-5 border-b border-[#c7c7c7] bg-[#005a9e]/5">
          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-lg bg-[#005a9e] text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>

            <div>
              <h2 className="text-lg font-extrabold text-[#005a9e]">
                Administrador de Ramos
              </h2>
              <p className="text-xs text-[#6d6e71] mt-1">
                Catálogo general compartido de ramos de seguros.
              </p>
            </div>
          </div>
        </div>

        <div className="p-5">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={nuevoRamo}
              onChange={(e) => {
                setNuevoRamo(e.target.value);
                setError('');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  void handleAgregar();
                }
              }}
              placeholder="Nombre del nuevo ramo"
              className="flex-1 px-3 py-2 rounded-lg border border-[#c7c7c7] text-sm outline-none focus:border-[#007bc1] focus:ring-1 focus:ring-[#007bc1]"
              disabled={guardando}
            />

            <button
              type="button"
              onClick={() => void handleAgregar()}
              disabled={guardando}
              className="px-4 py-2 rounded-lg bg-[#005a9e] hover:bg-[#007bc1] disabled:opacity-50 text-white text-sm font-bold flex items-center justify-center space-x-2 cursor-pointer disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
              <span>{guardando ? 'Guardando...' : 'Agregar ramo'}</span>
            </button>
          </div>

          {error && (
            <p className="mt-2 text-xs font-semibold text-rose-600">
              {error}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <p className="text-[10px] uppercase tracking-wider font-bold text-emerald-700">
            Ramos activos
          </p>
          <p className="text-2xl font-extrabold text-emerald-800 mt-1">
            {activos}
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <p className="text-[10px] uppercase tracking-wider font-bold text-slate-600">
            Ramos inactivos
          </p>
          <p className="text-2xl font-extrabold text-slate-800 mt-1">
            {inactivos}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#c7c7c7] shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-[#c7c7c7]">
          <h3 className="text-sm font-extrabold text-slate-900">
            Catálogo general
          </h3>
          <p className="text-[11px] text-[#6d6e71] mt-1">
            Los ramos inactivos permanecen registrados y no deben utilizarse para nuevas operaciones.
          </p>
        </div>

        <div className="divide-y divide-slate-100">
          {ramos.map((ramo) => (
            <div
              key={ramo.id}
              className="px-5 py-3 flex items-center justify-between gap-4"
            >
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">
                  {ramo.nombre}
                </p>

                <p className="text-[10px] text-[#9e9e9e]">
                  {ramo.activo ? 'Disponible' : 'Inactivo'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => void onToggleRamo(ramo)}
                className={`shrink-0 px-3 py-1.5 rounded-lg border text-[11px] font-bold flex items-center space-x-1.5 cursor-pointer ${
                  ramo.activo
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                    : 'bg-slate-50 border-slate-300 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Power className="w-3.5 h-3.5" />
                <span>{ramo.activo ? 'Activo' : 'Inactivo'}</span>
              </button>
            </div>
          ))}

          {ramos.length === 0 && (
            <div className="p-8 text-center text-sm text-[#9e9e9e]">
              No existen ramos registrados.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
