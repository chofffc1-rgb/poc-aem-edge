/**
 * BLOQUE: hero-banner
 * 
 * Responsabilidad JS mínima:
 *  - Inyectar imagen de fondo desde dato del contenido (si viene de Doc).
 *  - En desarrollo local, la imagen viene del CSS directamente (fallback).
 *  - No acoplamiento con otros bloques. Solo self-contained.
 * 
 * Patrón EDS: export default function nombre(block) { ... }
 * El runtime de EDS llama a esta función automáticamente cuando
 * detecta un div con clase "hero-banner".
 */

export default function heroBanner(block) {
  const bg = block.querySelector('.hero-banner-bg');

  /*
   * Si el contenido viene de un doc (Google Docs / SharePoint),
   * las filas del bloque contienen los datos en orden.
   * Aquí simplemente leemos si hay una imagen custom y la aplicamos.
   * En desarrollo local el CSS ya tiene la imagen como fallback.
   */
  const rows = block.querySelectorAll('div > div');

  if (rows.length >= 3) {
    const imgCell = rows[2]?.querySelector('p');
    if (imgCell && imgCell.textContent.trim().startsWith('http')) {
      const customImg = imgCell.textContent.trim();
      bg.style.backgroundImage = `url('${customImg}')`;
      // Limpar la celda de datos (no debe renderizarse visualmente)
      imgCell.remove();
    }
  }

  // Lazy-load: solo anuncia que la imagen debe cargarse cuando está cerca del viewport
  // En este caso es el hero (siempre visible al cargar), así que no aplica.
  // Este hook existe por si el hero se usa en otro contexto (ej: mid-page hero).
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          block.classList.add('hero-banner--visible');
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(block);
  }
}
