import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const INTERVALO_MS = 4500;

// Carrusel controlado con estado (no depende del JS de Bootstrap)
export default function BannerCarousel({ banners }) {
  const [actual, setActual] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setActual(i => (i + 1) % banners.length), INTERVALO_MS);
    return () => clearInterval(timer);
  }, [actual, banners.length]);

  const mover = paso => setActual(i => (i + paso + banners.length) % banners.length);

  return (
    <div className='carousel slide carrusel'>
      <div className='carousel-indicators'>
        {banners.map((banner, i) => (
          <button
            key={banner.src}
            type='button'
            className={i === actual ? 'active' : ''}
            aria-label={banner.alt}
            onClick={() => setActual(i)}
          />
        ))}
      </div>
      <div className='carousel-inner rounded-4 bg-dark'>
        {banners.map((banner, i) => (
          <div className={`carousel-item ${i === actual ? 'active' : ''}`} key={banner.src}>
            <img src={banner.src} className='banner-img' alt={banner.alt} />
          </div>
        ))}
      </div>
      <button className='carousel-control-prev' type='button' onClick={() => mover(-1)}>
        <span className='carousel-control-prev-icon' aria-hidden='true' />
        <span className='visually-hidden'>Anterior</span>
      </button>
      <button className='carousel-control-next' type='button' onClick={() => mover(1)}>
        <span className='carousel-control-next-icon' aria-hidden='true' />
        <span className='visually-hidden'>Siguiente</span>
      </button>
    </div>
  );
}

BannerCarousel.propTypes = {
  banners: PropTypes.arrayOf(
    PropTypes.shape({ src: PropTypes.string.isRequired, alt: PropTypes.string.isRequired }),
  ).isRequired,
};
