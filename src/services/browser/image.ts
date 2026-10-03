/**
 * src/services/browser/image.ts
 * Procesamiento y validación de imágenes en el cliente (DOM / Canvas).
 * SECURITY (CWE-434 / CWE-79): Verificación de firmas binarias (Magic Bytes) y neutralización por rasterización Canvas.
 * Trazabilidad: TASK-7.2, specs/05-arquitectura-cv-facil-v2.md (Sección 7)
 */

/**
 * [EFECTO] Valida los magic bytes de un archivo para verificar que sea JPEG, PNG o WebP auténtico.
 * Bloquea la carga de SVGs con scripts o binarios ejecutables enmascarados.
 */
export async function validateImageFile(file: File | Blob): Promise<{ valid: boolean; error?: string }> {
  const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
  if (file.size > MAX_SIZE_BYTES) {
    return { valid: false, error: 'El archivo excede el tamaño máximo permitido (5MB).' };
  }

  try {
    const buffer = await file.slice(0, 12).arrayBuffer();
    const bytes = new Uint8Array(buffer);

    // Firma JPEG: FF D8 FF
    const isJpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;

    // Firma PNG: 89 50 4E 47 0D 0A 1A 0A
    const isPng =
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4e &&
      bytes[3] === 0x47 &&
      bytes[4] === 0x0d &&
      bytes[5] === 0x0a &&
      bytes[6] === 0x1a &&
      bytes[7] === 0x0a;

    // Firma WebP: RIFF ... WEBP
    const isWebp =
      bytes[0] === 0x52 &&
      bytes[1] === 0x49 &&
      bytes[2] === 0x46 &&
      bytes[3] === 0x46 &&
      bytes[8] === 0x57 &&
      bytes[9] === 0x45 &&
      bytes[10] === 0x42 &&
      bytes[11] === 0x50;

    if (!isJpeg && !isPng && !isWebp) {
      return {
        valid: false,
        error: 'Formato no permitido. Solo se admiten fotos en formato JPEG, PNG o WebP auténticos (no SVG).',
      };
    }

    return { valid: true };
  } catch (err: any) {
    return { valid: false, error: `No se pudo leer la firma binaria del archivo: ${err.message}` };
  }
}

/**
 * [EFECTO] Comprime y rasteriza una foto de perfil usando Canvas HTML5.
 * Neutraliza cualquier metadato o script malicioso incrustado en el archivo original.
 */
export async function compressProfileImage(
  file: File,
  maxWidth = 400,
  maxHeight = 400,
  quality = 0.85
): Promise<string> {
  const validation = await validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error || 'Archivo de imagen no válido');
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      let { width, height } = img;

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('No se pudo inicializar el contexto Canvas 2D'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedDataUrl);
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Error al decodificar la imagen en el navegador'));
    };

    img.src = objectUrl;
  });
}
