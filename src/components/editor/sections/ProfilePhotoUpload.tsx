import React, { useRef, useState } from 'react';
import { User, Image as ImageIcon, Upload, Trash2, AlertCircle } from 'lucide-react';
import { validateImageFile, compressProfileImage } from '../../../utils/security';

export interface ProfilePhotoUploadProps {
  avatarUrl: string;
  onChange: (avatarUrl: string) => void;
}

/**
 * ProfilePhotoUpload: Componente con responsabilidad única para la selección, validación segura
 * (magic bytes - CWE-434), compresión Canvas (CWE-79) y remoción de foto de perfil.
 * Trazabilidad: US-01, TASK-2.2.4
 */
export const ProfilePhotoUpload: React.FC<ProfilePhotoUploadProps> = ({
  avatarUrl,
  onChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isProcessingImage, setIsProcessingImage] = useState<boolean>(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingImage(true);

    try {
      // SECURITY (CWE-434): Validación estricta de magic bytes antes de procesar
      const validation = await validateImageFile(file);
      if (!validation.valid) {
        setImageError(validation.error || 'Archivo de imagen no válido');
        return;
      }

      // SECURITY (CWE-434 / CWE-79): Compresión y rasterización en Canvas para neutralizar payloads
      const compressedDataUrl = await compressProfileImage(file, 300, 300, 0.85);
      onChange(compressedDataUrl);
    } catch (err: any) {
      setImageError(err.message || 'Error al procesar la imagen');
    } finally {
      setIsProcessingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemovePhoto = () => {
    setImageError(null);
    onChange('');
  };

  return (
    <div className="md:col-span-2 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>Foto de Perfil (Opcional - JPEG, PNG o WebP)</span>
        </span>
        <span className="text-[10px] text-slate-400 font-mono">Magic bytes verificado</span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Vista Previa de la Foto */}
        <div className="relative w-16 h-16 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 shrink-0 flex items-center justify-center">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Foto de perfil"
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-8 h-8 text-slate-400" />
          )}
        </div>

        <div className="flex-1 space-y-2 text-center sm:text-left">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileUpload}
            className="hidden"
          />

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <button
              type="button"
              disabled={isProcessingImage}
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-2xs transition disabled:opacity-50"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{isProcessingImage ? 'Procesando...' : 'Subir Imagen Local'}</span>
            </button>

            {avatarUrl && (
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-50 hover:bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300 border border-red-200 dark:border-red-900 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Quitar Foto</span>
              </button>
            )}
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Se optimizará y comprimirá automáticamente a &lt; 150KB para asegurar que el PDF final no supere los 2MB.
          </p>
        </div>
      </div>

      {imageError && (
        <div className="flex items-center gap-1.5 p-2 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-xs">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-500" />
          <span>{imageError}</span>
        </div>
      )}
    </div>
  );
};
