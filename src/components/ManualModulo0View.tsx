import React from 'react';
import { BookOpen, CheckCircle2, ShieldCheck, ArrowRight, Zap, Database, Lock, Layers } from 'lucide-react';

interface ManualModulo0ViewProps {
  onNavigate: (processId: string) => void;
}

export const ManualModulo0View: React.FC<ManualModulo0ViewProps> = ({ onNavigate }) => {
  const puntosReglamento = [
    {
      num: 1,
      titulo: 'Independencia Arquitectónica del Módulo 0',
      desc: 'AVISAME actúa como una capa de supervisión inteligente desacoplada que no reemplaza los sistemas core de las aseguradoras ni los de emisión.'
    },
    {
      num: 2,
      titulo: 'Unicidad de Identidad por CUIT/CUIL/DNI',
      desc: 'Proceso 1 garantiza que no existan clientes duplicados. Toda la trazabilidad de pólizas, vehículos y ARTs se asocia de forma unívoca a la clave fiscal.'
    },
    {
      num: 3,
      titulo: 'Verificación de Estado SSN para Aseguradoras',
      desc: 'Proceso 2 valida la matrícula del PAS y la habilitación oficial de la aseguradora ante la Superintendencia de Seguros de la Nación.'
    },
    {
      num: 4,
      titulo: 'Trazabilidad de Vigencias Técnicas y Endosos',
      desc: 'Proceso 3 registra fecha de inicio y fin de vigencia técnica, asegurando alertas tempranas de fin de cobertura antes de que ocurra un siniestro.'
    },
    {
      num: 5,
      titulo: 'Identificación de Vehículos 0km sin Patente',
      desc: 'Proceso 4 permite la registración temporal por número de Chasis/Motor hasta la emisión definitiva de la patente del registro automotor.'
    },
    {
      num: 6,
      titulo: 'Monitoreo de Vencimiento de Obleas GNC',
      desc: 'Proceso 4 emite alertas automáticas para renovación de obleas GNC a fin de evitar la exclusión de cobertura en caso de accidente.'
    },
    {
      num: 7,
      titulo: 'Antigüedad Obligatoria de 12 Meses en ART (Ley 24.557)',
      desc: 'Proceso 5 contabiliza la permanencia del empleador en la ART actual para habilitar la ventana legal de traspaso sin penalizaciones.'
    },
    {
      num: 8,
      titulo: 'Generación de Certificados con Cláusula de No Repetición',
      desc: 'Proceso 5 emite constancias de cobertura con inclusión explícita de CUITs contratantes para presentación en obras y clientes corporativos.'
    },
    {
      num: 9,
      titulo: 'Motor Transversal de Automatizaciones (Proceso 6)',
      desc: 'No almacena entidades de negocio. Escanea los eventos de P1 a P5 y P7 y genera recordatorios sin acoplar la lógica interna.'
    },
    {
      num: 10,
      titulo: 'Pipeline de Retención y Prevención de Infraseguro (Proceso 7)',
      desc: 'Monitorea renovaciones 30 a 60 días antes del vencimiento y calcula ajustes por inflación para proteger la suma asegurada real.'
    },
    {
      num: 11,
      titulo: 'Panel de Control sin Duplicación de Datos (Proceso 8)',
      desc: 'Proceso 8 funciona como un agregador de métricas y acceso rápido sin almacenar estados redundantes en la base de datos.'
    },
    {
      num: 12,
      titulo: 'Identidad Visual Corporativa con Paleta Oficial PAS',
      desc: 'Utiliza estrictamente la paleta institucional (#005a9e, #007bc1, #00aeef, #c7c7c7, #6d6e71) garantizando legibilidad y profesionalismo.'
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#005a9e] to-[#007bc1] text-white p-6 rounded-xl shadow-sm space-y-2">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-6 h-6 text-[#4ae2fe]" />
          <h2 className="text-xl font-bold">Módulo 0 · Manual de Procesos y Reglas de Negocio</h2>
        </div>
        <p className="text-xs text-[#c7c7c7] max-w-3xl leading-relaxed">
          Especificación Técnica y Operativa APROBADA para Productores Asesores de Seguros (PAS) de la República Argentina.
        </p>
      </div>

      {/* Grid 12 Points */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {puntosReglamento.map((p) => (
          <div key={p.num} className="bg-white rounded-xl border border-[#c7c7c7] p-5 shadow-xs space-y-2 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-[#005a9e] text-white text-xs font-bold font-mono flex items-center justify-center">
                  {p.num}
                </span>
                <h3 className="text-sm font-bold text-slate-900 leading-tight">{p.titulo}</h3>
              </div>
              <p className="text-xs text-[#6d6e71] leading-relaxed">{p.desc}</p>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <span className="text-[10px] text-[#007bc1] font-bold flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Norma Cumplida</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Colors Identity Palette Showcase */}
      <div className="bg-white p-5 rounded-xl border border-[#c7c7c7] shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900">Paleta Oficial AVISAME Implementada</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-center text-xs font-mono">
          <div className="p-3 bg-[#00aeef] text-white rounded-lg font-bold shadow-xs">#00aeef</div>
          <div className="p-3 bg-[#007bc1] text-white rounded-lg font-bold shadow-xs">#007bc1</div>
          <div className="p-3 bg-[#005a9e] text-white rounded-lg font-bold shadow-xs">#005a9e</div>
          <div className="p-3 bg-[#c7c7c7] text-slate-900 rounded-lg font-bold shadow-xs">#c7c7c7</div>
          <div className="p-3 bg-[#9e9e9e] text-white rounded-lg font-bold shadow-xs">#9e9e9e</div>
          <div className="p-3 bg-[#6d6e71] text-white rounded-lg font-bold shadow-xs">#6d6e71</div>
          <div className="p-3 bg-gradient-to-r from-[#4ae2fe] to-[#0577b6] text-white rounded-lg font-bold shadow-xs">#4ae2fe / #0577b6</div>
        </div>
      </div>

    </div>
  );
};
