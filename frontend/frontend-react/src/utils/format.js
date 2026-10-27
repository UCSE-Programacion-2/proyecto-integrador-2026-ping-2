const IMAGEN_POR_DEFECTO = '/img/logo.jpg';

export const formatPrice = price => `$${Number(price).toLocaleString('es-AR')}`;

// Las imágenes pueden ser URLs completas o rutas relativas dentro de /public (ej: img/Parlante.jpeg)
export const getImageUrl = product => {
  const { image } = product;
  if (!image) return IMAGEN_POR_DEFECTO;
  if (image.startsWith('http')) return image;
  return image.startsWith('/') ? image : `/${image}`;
};

export const normalizar = (texto = '') => texto.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
