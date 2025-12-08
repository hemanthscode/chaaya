/**
 * Image Helper Utilities
 * Functions for image manipulation and optimization
 */

/**
 * Generate responsive image URLs from base URL
 * @param {string} baseUrl - Base Cloudinary URL
 * @returns {object} Object with different size URLs
 */
export const generateResponsiveUrls = (baseUrl) => {
  if (!baseUrl) return null;

  const parts = baseUrl.split('/upload/');
  if (parts.length !== 2) return { original: baseUrl };

  const [base, path] = parts;

  return {
    thumbnail: `${base}/upload/c_fill,w_400,h_400,q_auto,f_auto/${path}`,
    small: `${base}/upload/w_640,q_80,f_auto/${path}`,
    medium: `${base}/upload/w_1024,q_85,f_auto/${path}`,
    large: `${base}/upload/w_1920,q_90,f_auto/${path}`,
    original: baseUrl
  };
};

/**
 * Generate thumbnail URL with custom dimensions
 * @param {string} baseUrl - Base Cloudinary URL
 * @param {number} width - Thumbnail width
 * @param {number} height - Thumbnail height
 * @returns {string} Thumbnail URL
 */
export const generateThumbnail = (baseUrl, width = 400, height = 400) => {
  if (!baseUrl) return null;

  const parts = baseUrl.split('/upload/');
  if (parts.length !== 2) return baseUrl;

  const [base, path] = parts;
  return `${base}/upload/c_fill,w_${width},h_${height},q_auto,f_auto/${path}`;
};

/**
 * Generate optimized URL with specific width
 * @param {string} baseUrl - Base Cloudinary URL
 * @param {number} width - Desired width
 * @param {number} quality - Image quality (1-100)
 * @returns {string} Optimized URL
 */
export const generateOptimizedUrl = (baseUrl, width = 1920, quality = 80) => {
  if (!baseUrl) return null;

  const parts = baseUrl.split('/upload/');
  if (parts.length !== 2) return baseUrl;

  const [base, path] = parts;
  return `${base}/upload/w_${width},q_${quality},f_auto/${path}`;
};

/**
 * Calculate aspect ratio from dimensions
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @returns {number} Aspect ratio
 */
export const calculateAspectRatio = (width, height) => {
  if (!width || !height) return 1;
  return width / height;
};

/**
 * Get aspect ratio class for Tailwind
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @returns {string} Tailwind aspect ratio class
 */
export const getAspectRatioClass = (width, height) => {
  const ratio = calculateAspectRatio(width, height);

  if (Math.abs(ratio - 1) < 0.1) return 'aspect-square';
  if (Math.abs(ratio - 1.33) < 0.1) return 'aspect-[4/3]';
  if (Math.abs(ratio - 1.5) < 0.1) return 'aspect-[3/2]';
  if (Math.abs(ratio - 1.78) < 0.1) return 'aspect-video';
  if (Math.abs(ratio - 0.67) < 0.1) return 'aspect-[2/3]';

  return 'aspect-auto';
};

/**
 * Check if image is landscape
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @returns {boolean} True if landscape
 */
export const isLandscape = (width, height) => {
  return width > height;
};

/**
 * Check if image is portrait
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @returns {boolean} True if portrait
 */
export const isPortrait = (width, height) => {
  return height > width;
};

/**
 * Check if image is square
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @returns {boolean} True if square
 */
export const isSquare = (width, height) => {
  return Math.abs(width - height) < 10; // Allow 10px tolerance
};

/**
 * Get orientation string
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @returns {string} Orientation ('landscape', 'portrait', or 'square')
 */
export const getOrientation = (width, height) => {
  if (isSquare(width, height)) return 'square';
  if (isLandscape(width, height)) return 'landscape';
  return 'portrait';
};

/**
 * Preload image
 * @param {string} src - Image source URL
 * @returns {Promise} Promise that resolves when image is loaded
 */
export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

/**
 * Batch preload multiple images
 * @param {Array} urls - Array of image URLs
 * @returns {Promise} Promise that resolves when all images are loaded
 */
export const preloadImages = (urls) => {
  return Promise.all(urls.map(url => preloadImage(url)));
};

/**
 * Get image dimensions from URL
 * @param {string} url - Image URL
 * @returns {Promise} Promise that resolves with {width, height}
 */
export const getImageDimensions = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = reject;
    img.src = url;
  });
};

/**
 * Create image blob from file
 * @param {File} file - Image file
 * @returns {Promise} Promise that resolves with blob URL
 */
export const createImageBlob = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Extract dominant color from image (placeholder functionality)
 * @param {string} imageUrl - Image URL
 * @returns {string} Hex color code
 */
export const extractDominantColor = (imageUrl) => {
  // This is a placeholder - in production, you'd use a library like color-thief
  // or implement canvas-based color extraction
  return '#e5e7eb'; // Default gray
};

/**
 * Generate placeholder while image loads
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @param {string} color - Background color
 * @returns {string} Data URL for placeholder
 */
export const generatePlaceholder = (width, height, color = '#e5e7eb') => {
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${width} ${height}'%3E%3Crect width='${width}' height='${height}' fill='${color}'/%3E%3C/svg%3E`;
};

/**
 * Check if image URL is valid
 * @param {string} url - Image URL
 * @returns {boolean} True if valid
 */
export const isValidImageUrl = (url) => {
  if (!url) return false;
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
  return imageExtensions.some(ext => url.toLowerCase().includes(ext)) ||
         url.includes('cloudinary.com');
};

export default {
  generateResponsiveUrls,
  generateThumbnail,
  generateOptimizedUrl,
  calculateAspectRatio,
  getAspectRatioClass,
  isLandscape,
  isPortrait,
  isSquare,
  getOrientation,
  preloadImage,
  preloadImages,
  getImageDimensions,
  createImageBlob,
  extractDominantColor,
  generatePlaceholder,
  isValidImageUrl
};
