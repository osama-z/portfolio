const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');

function closeMenu() {
  toggle?.setAttribute('aria-expanded', 'false');
  nav?.classList.remove('is-open');
}
toggle?.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('is-open', open);
});
nav?.addEventListener('click', event => {
  if (event.target.closest('a')) closeMenu();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && toggle?.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    toggle.focus();
  }
});
document.addEventListener('click', event => {
  if (!event.target.closest('.site-header')) closeMenu();
});
matchMedia('(min-width: 561px)').addEventListener('change', closeMenu);

// Essential content is always visible; motion is an optional enhancement.
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
const motionButton = document.querySelector('.motion-toggle');
const covers = [...document.querySelectorAll('[data-tilt]')];
let manuallyPaused = false;
try {
  manuallyPaused = localStorage.getItem('portfolio-motion') === 'paused';
} catch { /* Storage is optional. */ }

function resetCover(cover) {
  cover.style.removeProperty('--tilt-x');
  cover.style.removeProperty('--tilt-y');
}
function updateMotion() {
  const paused = manuallyPaused || reducedMotion.matches;
  document.body.dataset.motion = paused ? 'paused' : 'playing';
  covers.forEach(resetCover);
  if (motionButton) {
    motionButton.setAttribute('aria-pressed', String(paused));
    motionButton.textContent = reducedMotion.matches ? 'Reduced motion enabled' : paused ? 'Resume motion' : 'Pause motion';
    motionButton.disabled = reducedMotion.matches;
  }
}
motionButton?.addEventListener('click', () => {
  manuallyPaused = !manuallyPaused;
  try {
    localStorage.setItem('portfolio-motion', manuallyPaused ? 'paused' : 'playing');
  } catch { /* Keep the control working without storage. */ }
  updateMotion();
});
reducedMotion.addEventListener('change', updateMotion);
finePointer.addEventListener('change', () => covers.forEach(resetCover));
updateMotion();

covers.forEach(cover => {
  cover.addEventListener('pointermove', event => {
    if (!finePointer.matches || document.body.dataset.motion === 'paused') return;
    const box = cover.parentElement.getBoundingClientRect();
    const x = Math.max(-.5, Math.min(.5, (event.clientX - box.left) / box.width - .5));
    const y = Math.max(-.5, Math.min(.5, (event.clientY - box.top) / box.height - .5));
    cover.style.setProperty('--tilt-x', `${-6 - y * 16}deg`);
    cover.style.setProperty('--tilt-y', `${-18 + x * 20}deg`);
  });
  cover.addEventListener('pointerleave', () => resetCover(cover));
  cover.addEventListener('blur', () => resetCover(cover));
});
