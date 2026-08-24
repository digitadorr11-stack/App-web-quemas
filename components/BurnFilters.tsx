import React from 'react';
import { Farm, BurnStatus } from '@/lib/types';
import { Search, Filter, RotateCcw, X } from 'lucide-react';

interface BurnFiltersProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
  farmFilter: string;
  onFarmChange: (farm: string) => void;
  farms: Farm[];
  onReset: () => void;
}

export const BurnFilters: React.FC<BurnFiltersProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  farmFilter,
  onFarmChange,
  farms,
  onReset,
}) => {
  const hasActiveFilters = searchQuery !== '' || statusFilter !== 'ALL' || farmFilter !== 'ALL';

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        
        {/* Buscador de texto */}
        <div className="sm:col-span-5 relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por no. quema, frente, finca o supervisor..."
            className="w-full pl-9 pr-8 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-union-600 focus:border-transparent"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filtro de Finca */}
        <div className="sm:col-span-3">
          <select
            value={farmFilter}
            onChange={(e) => onFarmChange(e.target.value)}
            className="w-full py-2 px-3 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-union-600 bg-white"
          >
            <option value="ALL">Todas las Fincas</option>
            {farms.map((f) => (
              <option key={f.id} value={f.name}>
                {f.name}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro de Estado */}
        <div className="sm:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full py-2 px-3 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-union-600 bg-white"
          >
            <option value="ALL">Todos los Estados</option>
            <option value="SOLICITADA">1. Solicitada</option>
            <option value="PATRULLA_ASIGNADA">2. Patrulla Asignada</option>
            <option value="EN_REVISION">3. En Revisión</option>
            <option value="REVISION_COMPLETADA">4. Revisión Completada</option>
            <option value="VALIDADA">5. Validada</option>
            <option value="EN_QUEMA">6. En Quema</option>
            <option value="FINALIZADA">7. Finalizada</option>
            <option value="CANCELADA">Cancelada</option>
          </select>
        </div>

        {/* Botón Reset */}
        <div className="sm:col-span-1 flex justify-end">
          <button
            onClick={onReset}
            disabled={!hasActiveFilters}
            className={`p-2 rounded-lg border text-sm font-medium transition flex items-center justify-center ${
              hasActiveFilters
                ? 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-red-600'
                : 'border-gray-200 text-gray-300 cursor-not-allowed'
            }`}
            title="Limpiar filtros"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
