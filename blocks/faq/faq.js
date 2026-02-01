/**
 * BLOQUE: faq
 *
 * Responsabilidad JS:
 *  - Añadir animación suave de altura al abrir/cerrar <details>.
 *  - El bloque funciona SIN JS (details/summary nativo).
 *    Este script es solo progressive enhancement para la animación.
 *  - Opcionalmente: solo un item abierto a la vez (accordion exclusivo).
 *
 * Principios:
 *  - Progressive enhancement: si el JS falla, el FAQ sigue funcionando.
 *  - No manipula el DOM innecesariamente.
 *  - Usa Web Animations API para animación suave basada en scrollHeight real.
 */

export default function faq(block) {
  const items = [...block.querySelectorAll('.faq-item')];

  items.forEach((details) => {
    const summary = details.querySelector('.faq-question');
    const answer = details.querySelector('.faq-answer');

    // Prevenir el comportamiento nativo de toggle
    // para controlar la animación manualmente
    summary.addEventListener('click', (e) => {
      e.preventDefault();

      const isOpen = details.hasAttribute('open');

      // Cierra todos los otros items (accordion exclusivo)
      items.forEach((other) => {
        if (other !== details && other.hasAttribute('open')) {
          animateClose(other);
        }
      });

      // Abrir o cerrar este item
      if (isOpen) {
        animateClose(details);
      } else {
        animateOpen(details);
      }
    });
  });

  // ============================================================
  // ANIMACIONES
  // ============================================================

  /**
   * Abre un details con animación suave.
   * Usa scrollHeight para calcular la altura target real.
   */
  function animateOpen(details) {
    const answer = details.querySelector('.faq-answer');
    const targetHeight = answer.scrollHeight;

    details.setAttribute('open', '');

    // Anima desde 0 hasta scrollHeight
    const anim = answer.animate(
      [
        { maxHeight: '0px', opacity: 0 },
        { maxHeight: `${targetHeight}px`, opacity: 1 },
      ],
      {
        duration: 350,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        fill: 'forwards',
      }
    );

    anim.onfinish = () => {
      // Setea max-height a none para que el contenido pueda crecer si cambia
      answer.style.maxHeight = 'none';
      answer.style.opacity = '1';
    };
  }

  /**
   * Cierra un details con animación suave.
   */
  function animateClose(details) {
    const answer = details.querySelector('.faq-answer');
    const startHeight = answer.scrollHeight;

    // Anima desde scrollHeight actual hasta 0
    const anim = answer.animate(
      [
        { maxHeight: `${startHeight}px`, opacity: 1 },
        { maxHeight: '0px', opacity: 0 },
      ],
      {
        duration: 300,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        fill: 'forwards',
      }
    );

    anim.onfinish = () => {
      details.removeAttribute('open');
      answer.style.maxHeight = '0px';
      answer.style.opacity = '0';
    };
  }
}
