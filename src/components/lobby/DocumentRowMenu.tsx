import React from 'react';
import { Dropdown, type DropdownItem } from '../common/primitives/Dropdown';
import { MoreVertical, ExternalLink, Edit2, Copy, Download, Trash2 } from 'lucide-react';

export interface DocumentRowMenuProps {
  onOpen: () => void;
  onRename: () => void;
  onDuplicate: () => void;
  onDownloadPDF: () => void;
  onDelete: () => void;
  hasExportedPDF: boolean;
}

/**
 * DocumentRowMenu: Menú contextual accesible de fila para operaciones atómicas de gestión sobre un CV.
 * Trazabilidad: US-07 (Criterio 7.2), TASK-2.4.2
 */
export const DocumentRowMenu: React.FC<DocumentRowMenuProps> = ({
  onOpen,
  onRename,
  onDuplicate,
  onDownloadPDF,
  onDelete,
  hasExportedPDF,
}) => {
  const items: DropdownItem[] = [
    {
      id: 'open',
      label: 'Abrir en Editor',
      icon: <ExternalLink className="w-4 h-4 text-blue-600 dark:text-blue-400" />,
      onClick: onOpen,
    },
    {
      id: 'rename',
      label: 'Renombrar',
      icon: <Edit2 className="w-4 h-4 text-slate-500" />,
      onClick: onRename,
    },
    {
      id: 'duplicate',
      label: 'Duplicar',
      icon: <Copy className="w-4 h-4 text-slate-500" />,
      onClick: onDuplicate,
    },
    {
      id: 'download-pdf',
      label: hasExportedPDF ? 'Descargar PDF' : 'Generar PDF',
      icon: <Download className="w-4 h-4 text-slate-500" />,
      onClick: onDownloadPDF,
    },
    {
      id: 'delete',
      label: 'Eliminar',
      icon: <Trash2 className="w-4 h-4 text-red-500" />,
      danger: true,
      onClick: onDelete,
    },
  ];

  return (
    <Dropdown
      trigger={
        <button
          type="button"
          aria-label="Opciones del documento"
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      }
      items={items}
      align="right"
    />
  );
};
