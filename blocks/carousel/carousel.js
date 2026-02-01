/**
 * BLOQUE: carousel
 *
 * Responsabilidad:
 *  - Calcular cuántas cards caben según el ancho del contenedor.
 *  - Mover el track con translateX según el step actual.
 *  - Habilitar/deshabilitar botones prev/next en los extremos.
 *  - Generar y actualizar dots indicadores.
 *  - Soporte teclado (← →) y drag en mobile.
 *
 * Principios:
 *  - Sin dependencias externas.
 *  - Cálculo dinámico al resize (no valores hardcoded).
 *  - Estado encapsulado en closure (no polute global).
 *  - Accesibilidad: aria-label, botones con label, focus visible.
 */

export default function carousel(block) {
  const track = block.querySelector('.carousel-track');
  const container = block.querySelector('.carousel-track-container');
  const btnPrev = block.querySelector('.carousel-btn--prev');
  const btnNext = block.querySelector('.carousel-btn--next');
  const dotsContainer = block.querySelector('.carousel-dots');
  const cards = [...track.querySelectorAll('.carousel-card')];

  // --- Estado interno ---
  let currentStep = 0;
  let visibleCount = 4;         // Se recalcula en resize
  let maxStep = 0;              // Máximo paso posible
  let dots = [];

  // ============================================================
  // CÁLCULOS
  // ============================================================

  /**
   * Calcula cuántas cards caben en el contenedor según su ancho actual.
   * Respeta los breakpoints del CSS (4 → 2 → 1).
   */
  function getVisibleCount() {
    const w = container.clientWidth;
    if (w < 560) return 1;
    if (w < 900) return 2;
    return 4;
  }

  /**
   * Recalcula maxStep: cuántos pasos puede dar hacia la derecha.
   * Si hay 6 cards y se ven 4, maxStep = 2.
   */
  function calcMaxStep() {
    maxStep = Math.max(0, cards.length - visibleCount);
  }

  // ============================================================
  // RENDERIZADO
  // ============================================================

  /**
   * Mueve el track al step actual usando translateX.
   * Cada card tiene un ancho = 1/visibleCount del contenedor + gap.
   */
  function moveTrack() {
    const gap = 16;                                          // Debe coincidir con CSS gap
    const cardWidth = (container.clientWidth - gap * (visibleCount - 1)) / visibleCount;
    const offset = currentStep * (cardWidth + gap);

    track.style.transform = `translateX(-${offset}px)`;
  }

  /**
   * Actualiza estado de botones prev/next.
   */
  function updateButtons() {
    btnPrev.disabled = currentStep === 0;
    btnNext.disabled = currentStep >= maxStep;
  }

  /**
   * Genera los dots según la cantidad de steps posibles.
   */
  function renderDots() {
    dotsContainer.innerHTML = '';
    dots = [];

    for (let i = 0; i <= maxStep; i++) {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === currentStep ? ' carousel-dot--active' : '');
      dot.setAttribute('aria-label', `Ir a oferta ${i + 1}`);
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-selected', i === currentStep ? 'true' : 'false');
      dot.addEventListener('click', () => goToStep(i));
      dotsContainer.appendChild(dot);
      dots.push(dot);
    }
  }

  /**
   * Actualiza la clase activa en los dots existentes (sin re-renderizar).
   */
  function updateDots() {
    dots.forEach((dot, i) => {
      dot.classList.toggle('carousel-dot--active', i === currentStep);
      dot.setAttribute('aria-selected', i === currentStep ? 'true' : 'false');
    });
  }

  // ============================================================
  // ACCIONES DE NAVEGA
  // ============================================================

  function goToStep(step) {
    currentStep = Math.max(0, Math.min(step, maxStep));
    moveTrack();
    updateButtons();
    updateDots();
  }

  function goNext() { goToStep(currentStep + 1); }
  function goPrev() { goToStep(currentStep - 1); }

  // ============================================================
  // EVENTOS
  // ============================================================

  btnNext.addEventListener('click', goNext);
  btnPrev.addEventListener('click', goPrev);

  // Teclado: ← → dentro del carrusel
  block.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); goNext(); }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); goPrev(); }
  });

  // Drag/swipe en mobile (touch)
  let startX = 0;
  let isDragging = false;

  track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    const diff = startX - e.changedTouches[0].clientX;
    const threshold = 50;                                    // Mínimos px para considerar swipe

    if (diff > threshold)  goNext();
    if (diff < -threshold) goPrev();

    isDragging = false;
  }, { passive: true });

  // Resize: reajusta visibleCount y reposiciona
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      visibleCount = getVisibleCount();
      calcMaxStep();
      // Si el step actual ya no es válido, ajusta
      if (currentStep > maxStep) currentStep = maxStep;
      moveTrack();
      updateButtons();
      renderDots();
    }, 120);                                                 // Debounce en resize
  });

  // ============================================================
  // INICIALIZACIÓN
  // ============================================================

  visibleCount = getVisibleCount();
  calcMaxStep();
  moveTrack();
  updateButtons();
  renderDots();
}
