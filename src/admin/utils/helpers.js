// News & Article Editor Helpers
// Shree Abhaydas Portal Admin

import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase';

/**
 * Convert string to clean SEO-friendly URL slug.
 * Supports English alphanumeric and Hindi Devanagari characters.
 */
export function slugify(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphen
    .replace(/[^\w\u0900-\u097F\-]+/g, '') // Keep alphanumeric, Hindi devanagari characters and hyphens
    .replace(/\-\-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+/, '') // Trim hyphen from start
    .replace(/-+$/, ''); // Trim hyphen from end
}

/**
 * Calculate estimated reading time based on word count (approx. 200 wpm)
 */
export function calculateReadingTime(content) {
  if (!content) return '1 min read';
  // Strip HTML tags
  const clean = content.replace(/<[^>]*>/g, ' ').trim();
  const words = clean.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

/**
 * Compress and optimize an image in the browser using HTML5 Canvas.
 * Produces a high-clarity WebP/JPEG data URL with reduced file size (approx. 50-140 KB),
 * preventing Firestore document size issues and network delays.
 */
export function compressImage(file, { maxWidth = 1280, maxHeight = 850, quality = 0.82 } = {}) {
  return new Promise((resolve, reject) => {
    if (!file) return reject(new Error('No file provided for compression.'));
    if (!file.type || !file.type.startsWith('image/')) {
      return reject(new Error('Selected file is not a supported image.'));
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.onload = (event) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to parse image data.'));
      img.onload = () => {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Canvas 2D context unavailable'));
        }

        // Draw image smoothed
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Try WebP first for best compression, fallback to JPEG
        let dataUrl = '';
        try {
          dataUrl = canvas.toDataURL('image/webp', quality);
          if (!dataUrl || !dataUrl.startsWith('data:image/webp')) {
            dataUrl = canvas.toDataURL('image/jpeg', quality);
          }
        } catch (e) {
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        const approxBytes = Math.round((dataUrl.length * 3) / 4);
        const approxKB = Math.round(approxBytes / 1024);

        resolve({
          dataUrl,
          width,
          height,
          dimensions: `${width}×${height}`,
          sizeKB: approxKB,
          originalName: file.name,
          mimeType: dataUrl.split(';')[0].replace('data:', '')
        });
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Upload an image file directly to Firebase Storage with real-time progress callback.
 */
export async function uploadToFirebaseStorage(file, folder = 'news_uploads', onProgress) {
  if (!file) throw new Error('No file provided for upload.');

  const timestamp = Date.now();
  const cleanName = (file.name || 'image.jpg').replace(/[^a-zA-Z0-9._-]/g, '_');
  const path = `${folder}/${timestamp}_${cleanName}`;
  const storageRef = ref(storage, path);
  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        if (onProgress && snapshot.totalBytes > 0) {
          const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          onProgress(pct);
        }
      },
      (error) => {
        console.error('Firebase Storage upload error:', error);
        reject(error);
      },
      async () => {
        try {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          resolve({ downloadUrl, path, fileName: cleanName });
        } catch (err) {
          reject(err);
        }
      }
    );
  });
}

/**
 * Unified News Image Processor:
 * 1. Optimizes the image locally with canvas compression.
 * 2. Attempts Firebase Storage upload with a fast timeout.
 * 3. Gracefully falls back to high-clarity direct data URL if storage is 404/unavailable.
 * 4. Guarantees the admin can ALWAYS publish and edit news without blocking storage errors!
 */
export async function processNewsImage(file, onProgress) {
  if (!file) throw new Error('No file provided.');

  if (onProgress) onProgress(20);
  // 1. Client-side compression
  const compressed = await compressImage(file, { maxWidth: 1280, maxHeight: 850, quality: 0.82 });
  if (onProgress) onProgress(50);

  // 2. Attempt Firebase Storage with a 4-second timeout
  try {
    const storagePromise = uploadToFirebaseStorage(file, 'news_uploads', (pct) => {
      if (onProgress) {
        onProgress(Math.min(99, 50 + Math.round(pct * 0.5)));
      }
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Storage unavailable')), 4000)
    );

    const result = await Promise.race([storagePromise, timeoutPromise]);
    if (onProgress) onProgress(100);

    return {
      url: result.downloadUrl,
      source: 'storage',
      width: compressed.width,
      height: compressed.height,
      dimensions: compressed.dimensions,
      sizeKB: compressed.sizeKB,
      originalName: compressed.originalName,
      message: 'Uploaded to Firebase Storage'
    };
  } catch (storageErr) {
    // Graceful fallback to client-optimized Data URL
    console.warn('Firebase Storage note (using optimized direct image fallback):', storageErr.message);
    if (onProgress) onProgress(100);

    return {
      url: compressed.dataUrl,
      source: 'direct',
      width: compressed.width,
      height: compressed.height,
      dimensions: compressed.dimensions,
      sizeKB: compressed.sizeKB,
      originalName: compressed.originalName,
      message: 'Optimized high-resolution image ready to publish'
    };
  }
}

/**
 * Unified Gallery Image Processor:
 * 1. Optimizes the photo with canvas compression (up to 1440x1080, quality 0.84, ~70-150KB).
 * 2. Attempts Firebase Storage upload into 'gallery' folder with a 3.5-second timeout.
 * 3. Gracefully falls back to high-clarity direct data URL if storage is 404/unavailable.
 * 4. Ensures gallery uploads work 100% reliably in all environments without blocking.
 */
export async function processGalleryImage(file, onProgress) {
  if (!file) throw new Error('No file provided for gallery.');

  if (onProgress) onProgress(20);
  // 1. Client-side canvas compression tailored for photo gallery
  const compressed = await compressImage(file, { maxWidth: 1440, maxHeight: 1080, quality: 0.84 });
  if (onProgress) onProgress(50);

  // 2. Attempt Firebase Storage with a 3.5-second timeout
  try {
    const storagePromise = uploadToFirebaseStorage(file, 'gallery', (pct) => {
      if (onProgress) {
        onProgress(Math.min(99, 50 + Math.round(pct * 0.5)));
      }
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Storage unavailable')), 3500)
    );

    const result = await Promise.race([storagePromise, timeoutPromise]);
    if (onProgress) onProgress(100);

    return {
      url: result.downloadUrl,
      storagePath: result.path,
      source: 'storage',
      width: compressed.width,
      height: compressed.height,
      dimensions: compressed.dimensions,
      sizeKB: compressed.sizeKB,
      originalName: compressed.originalName,
      message: 'Uploaded to Firebase Storage'
    };
  } catch (storageErr) {
    // Graceful fallback to client-optimized Data URL
    console.warn('Firebase Storage note (using optimized gallery direct image fallback):', storageErr.message);
    if (onProgress) onProgress(100);

    return {
      url: compressed.dataUrl,
      storagePath: '',
      source: 'direct',
      width: compressed.width,
      height: compressed.height,
      dimensions: compressed.dimensions,
      sizeKB: compressed.sizeKB,
      originalName: compressed.originalName,
      message: 'Optimized photo ready'
    };
  }
}

/**
 * Unified Event Poster/Banner Image Processor:
 * 1. Optimizes the event poster with client-side canvas compression (up to 1600x1100, quality 0.85, ~60-140KB).
 * 2. Attempts Firebase Storage upload into 'events_uploads' folder with a 3.5-second timeout.
 * 3. Gracefully falls back to high-clarity direct data URL if storage is 404/unavailable or offline.
 * 4. Ensures event creation always succeeds reliably without blocking errors.
 */
export async function processEventImage(file, onProgress) {
  if (!file) throw new Error('No file provided for event image.');

  if (onProgress) onProgress(20);
  // 1. Client-side canvas compression tailored for event banners & posters
  const compressed = await compressImage(file, { maxWidth: 1600, maxHeight: 1100, quality: 0.85 });
  if (onProgress) onProgress(50);

  // 2. Attempt Firebase Storage with a 3.5-second timeout
  try {
    const storagePromise = uploadToFirebaseStorage(file, 'events_uploads', (pct) => {
      if (onProgress) {
        onProgress(Math.min(99, 50 + Math.round(pct * 0.5)));
      }
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Storage unavailable')), 3500)
    );

    const result = await Promise.race([storagePromise, timeoutPromise]);
    if (onProgress) onProgress(100);

    return {
      url: result.downloadUrl,
      storagePath: result.path,
      source: 'storage',
      width: compressed.width,
      height: compressed.height,
      dimensions: compressed.dimensions,
      sizeKB: compressed.sizeKB,
      originalName: compressed.originalName,
      message: 'Uploaded to Firebase Storage'
    };
  } catch (storageErr) {
    // Graceful fallback to client-optimized Data URL
    console.warn('Firebase Storage note (using optimized event direct image fallback):', storageErr.message);
    if (onProgress) onProgress(100);

    return {
      url: compressed.dataUrl,
      storagePath: '',
      source: 'direct',
      width: compressed.width,
      height: compressed.height,
      dimensions: compressed.dimensions,
      sizeKB: compressed.sizeKB,
      originalName: compressed.originalName,
      message: 'Optimized event banner ready'
    };
  }
}

