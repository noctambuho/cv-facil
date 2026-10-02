import React, { useState } from 'react';
import type { CVMetadata } from '../../types/storage';
import { DocumentRowMenu } from './DocumentRowMenu';
import {
  FileText,
  Search,
  HardDrive,
  Laptop,
  Calendar,
  FileCheck2,
  FileClock,
  FolderOpen,
} from 'lucide-react';

export interface RecentDocumentsTableProps {
  documents: CVMetadata[];
  onOpen: (id: string) => void;
  onRename: (id: string, currentTitle: string) => void;
  onDuplicate: (id: string) => void;
  onDownloadPDF: (id: string) => void;
  onDelete: (id: string, title: string) => void;
  onCreateNew: () => void;
}

/**
 * RecentDocumentsTable: Tabla centralizada de currículums recientes con filtrado y menú de fila.
 * Trazabilidad: US-07 (Criterio 7.2), TASK-2.4.2
 */
export const RecentDocumentsTable: React.FC<RecentDocumentsTableProps> = ({
  documents,
  onOpen,
  onRename,
  onDuplicate,
  onDownloadPDF,
  onDelete,
  onCreateNew,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'local' | 'drive'>('all');

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (activeFilter === 'local') return !doc.isDriveSynced;
    if (activeFilter === 'drive') return doc.isDriveSynced;
    return true;
  });

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Barra de Filtros y Búsqueda */}
      <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Pestañas de Filtro */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`flex-1 sm:flex-none px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              activeFilter === 'all'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Todos ({documents.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('local')}
            className={`flex-1 sm:flex-none px-3 py-1.5 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5 ${
              activeFilter === 'local'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Laptop className="w-3.5 h-3.5" />
            <span>Local</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('drive')}
            className={`flex-1 sm:flex-none px-3 py-1.5 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5 ${
              activeFilter === 'drive'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <HardDrive className="w-3.5 h-3.5" />
            <span>Google Drive</span>
          </button>
        </div>

        {/* Buscador */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500"
          />
        </div>
      </div>

      {/* Contenido de la Tabla */}
      {filteredDocs.length === 0 ? (
        <div className="p-10 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-slate-800 text-blue-500 mx-auto flex items-center justify-center">
            <FolderOpen className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">
              No se encontraron documentos
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              {searchQuery
                ? 'No hay currículums que coincidan con la búsqueda ingresada.'
                : 'Aún no tienes ningún currículum creado en este destino.'}
            </p>
          </div>
          {!searchQuery && (
            <button
              type="button"
              onClick={onCreateNew}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition"
            >
              <span>Crear mi primer CV</span>
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider bg-slate-50/50 dark:bg-slate-800/40">
                <th className="py-3 px-4 sm:px-6">Documento</th>
                <th className="py-3 px-4 hidden sm:table-cell">Estado / PDF</th>
                <th className="py-3 px-4">Destino</th>
                <th className="py-3 px-4 hidden md:table-cell">Última Modificación</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredDocs.map((doc) => (
                <tr
                  key={doc.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer"
                  onClick={() => onOpen(doc.id)}
                >
                  {/* Título y Nombre */}
                  <td className="py-3 px-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-slate-900 dark:text-white truncate block group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {doc.title}
                        </span>
                        <span className="text-[10px] text-slate-400 md:hidden block">
                          {formatDate(doc.updatedAt)}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Estado / Exportación */}
                  <td className="py-3 px-4 hidden sm:table-cell">
                    {doc.hasExportedPDF ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                        <FileCheck2 className="w-3 h-3" />
                        <span>PDF Listo</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        <FileClock className="w-3 h-3" />
                        <span>Borrador</span>
                      </span>
                    )}
                  </td>

                  {/* Destino (Local vs Drive) */}
                  <td className="py-3 px-4">
                    {doc.isDriveSynced ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-600 dark:text-indigo-400">
                        <HardDrive className="w-3.5 h-3.5" />
                        <span>Drive</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 dark:text-slate-400">
                        <Laptop className="w-3.5 h-3.5" />
                        <span>Local</span>
                      </span>
                    )}
                  </td>

                  {/* Fecha de Modificación */}
                  <td className="py-3 px-4 hidden md:table-cell text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formatDate(doc.updatedAt)}</span>
                    </div>
                  </td>

                  {/* Menú Contextual */}
                  <td
                    className="py-3 px-4 text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <DocumentRowMenu
                      hasExportedPDF={doc.hasExportedPDF}
                      onOpen={() => onOpen(doc.id)}
                      onRename={() => onRename(doc.id, doc.title)}
                      onDuplicate={() => onDuplicate(doc.id)}
                      onDownloadPDF={() => onDownloadPDF(doc.id)}
                      onDelete={() => onDelete(doc.id, doc.title)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
