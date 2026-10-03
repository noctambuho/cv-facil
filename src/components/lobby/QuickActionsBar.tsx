/**
 * src/components/lobby/QuickActionsBar.tsx
 * [COMPONENTE] Fila superior de acciones rápidas para el Lobby inspirada en ONLYOFFICE.
 * Permite crear un CV nuevo desde cero, seleccionar una plantilla o importar un respaldo.
 * Trazabilidad: US-07, TASK-7.6
 */

import React from 'react';
import { ActionCard } from '../common/primitives/ActionCard';
import { FilePlus2, LayoutTemplate, UploadCloud } from 'lucide-react';

export interface QuickActionsBarProps {
  onCreateBlank: () => void;
  onChooseTemplate: () => void;
  onImportFile: () => void;
}

export const QuickActionsBar: React.FC<QuickActionsBarProps> = ({
  onCreateBlank,
  onChooseTemplate,
  onImportFile,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 mb-8">
      <ActionCard
        title="Crear CV en Blanco"
        description="Inicia un currículum desde cero con secciones guiadas paso a paso."
        icon={<FilePlus2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
        badge="Recomendado"
        highlight={true}
        onClick={onCreateBlank}
      />

      <ActionCard
        title="Explorar Plantillas"
        description="Comienza con datos de muestra en formato Moderno, Clásico o Minimalista."
        icon={<LayoutTemplate className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
        onClick={onChooseTemplate}
      />

      <ActionCard
        title="Importar Archivo"
        description="Carga un respaldo en formato JSON para continuar editando tu información."
        icon={<UploadCloud className="w-5 h-5 text-sky-600 dark:text-sky-400" />}
        onClick={onImportFile}
      />
    </div>
  );
};
