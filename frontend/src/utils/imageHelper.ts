export const getImageUrl = (url: string | null | undefined): string => {
  if (!url) return '';
  if (url.startsWith('http')) return url;

  const rawBaseUrl = import.meta.env.VITE_API_URL || '';
  // Eliminamos el /api final si existe para las rutas de archivos estáticos
  const baseUrl = rawBaseUrl.replace(/\/api\/?$/, '');
  
  const cleanPath = url.startsWith('/') ? url : `/${url}`;
  return `${baseUrl}${cleanPath}`;
};
