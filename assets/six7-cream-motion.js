/* Progressive enhancement: content is never hidden pending JavaScript or scrolling. */
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const seen = new WeakSet();
  const pointers = new WeakSet();
  const running = new Set();
  const home = document.querySelector('main')?.dataset.template === 'index';
  if (home) return; // V2 handles homepage motion below; internal-page behavior is unchanged.
  const editor = Boolean(window.Shopify?.designMode);
  const easing = 'cubic-bezier(.2,.72,.22,1)';
  const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    for (const { target, isIntersecting } of entries) {
      if (!isIntersecting) continue;
      observer.unobserve(target);
      if (reduced.matches || editor || !target.animate) continue;
      const category = target.matches('.six7-category');
      const index = [...target.parentElement.children].indexOf(target);
      const animation = target.animate([
        { opacity: .18, translate: category ? `${index % 2 ? 16 : -16}px 18px` : '0 14px' },
        { opacity: 1, translate: '0 0' }
      ], { duration: home ? (category ? 950 : 750) : 460, delay: home ? Math.min(index % 4 * 65, 195) : 0, easing, fill: 'backwards' });
      running.add(animation);
      animation.finished.then(() => running.delete(animation), () => running.delete(animation));
    }
  }, { threshold: .08 }) : null;
  function initialize(root = document) {
    if (editor || reduced.matches) return;
    const selectors = home ? '.six7-category, .six7-lineup .card__inner, .six7-categories__header' : '.six7-about__lead, .six7-collection-banner__eyebrow, .six7-page-intro .main-page-title';
    root.querySelectorAll(selectors).forEach(target => {
      if (seen.has(target)) return;
      seen.add(target);
      observer?.observe(target);
    });
    if (!home) return;
    root.querySelectorAll('.six7-hero--motion .six7-hero__poster').forEach(poster => {
      if (pointers.has(poster)) return;
      pointers.add(poster);
      let bounds, frame = 0, x = 0, y = 0;
      const reset = () => {
        cancelAnimationFrame(frame); frame = 0;
        ['--cream-light-x', '--cream-light-y', '--cream-depth-x', '--cream-depth-y'].forEach(key => poster.style.removeProperty(key));
      };
      poster.addEventListener('pointerenter', () => {
        if (finePointer.matches && !reduced.matches) bounds = poster.getBoundingClientRect();
      }, { passive: true });
      poster.addEventListener('pointermove', event => {
        if (!bounds || !finePointer.matches || reduced.matches || poster.closest('.six7-hero').querySelector('.six7-hero__motion-toggle:checked')) return;
        x = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
        y = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height));
        if (frame) return;
        frame = requestAnimationFrame(() => {
          poster.style.setProperty('--cream-light-x', `${x * 100}%`);
          poster.style.setProperty('--cream-light-y', `${y * 100}%`);
          poster.style.setProperty('--cream-depth-x', `${(x - .5) * 8}px`);
          poster.style.setProperty('--cream-depth-y', `${(y - .5) * 6}px`);
          frame = 0;
        });
      }, { passive: true });
      poster.addEventListener('pointerleave', reset, { passive: true });
      poster.closest('.six7-hero').querySelector('.six7-hero__motion-toggle')?.addEventListener('change', reset);
      reduced.addEventListener('change', reset);
      finePointer.addEventListener('change', reset);
    });
  }
  reduced.addEventListener('change', () => {
    if (reduced.matches) { running.forEach(animation => animation.cancel()); observer?.disconnect(); }
    else initialize();
  });
  initialize();
  document.addEventListener('shopify:section:load', event => initialize(event.target));
})();

/* V2 cinematic homepage; no DOM restructuring, scroll control or commerce handlers. */
(() => {
  const main = document.querySelector('main');
  if (main?.dataset.template !== 'index' || window.Shopify?.designMode) return;
  document.body.dataset.six7Cinema = 'v2';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const mobile = matchMedia('(max-width: 749px)');
  const hero = main.querySelector('.six7-hero--motion');
  const poster = hero?.querySelector('.six7-hero__poster');
  const toggle = hero?.querySelector('.six7-hero__motion-toggle');
  const lineup = main.querySelector('.six7-lineup');
  const media = [...main.querySelectorAll('.six7-lineup .card__media')];
  const animations = new Set();
  const revealed = new WeakSet();
  let heroVisible = true, lineupVisible = false, scrollFrame = 0, layoutFrame = 0, pointerFrame = 0;
  let bounds, heroTop = 0, centers = [], pointerX = 0, pointerY = 0;
  const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
  const paused = () => reduce.matches || document.hidden || Boolean(toggle?.checked);
  function renderScroll() {
    scrollFrame = 0;
    if (!fine.matches || mobile.matches || paused()) return;
    const y = window.scrollY;
    if (heroVisible && poster) {
      const progress = Math.max(0, y - heroTop);
      poster.style.setProperty('--cinema-type-scroll', `${Math.min(progress * .14, 60)}px`);
      poster.style.setProperty('--cinema-media-scroll', `${-Math.min(progress * .07, 34)}px`);
      poster.style.setProperty('--cinema-ribbon-scroll', `${Math.min(progress * .085, 44)}px`);
    }
    if (lineupVisible) media.forEach((element, i) => {
      const progress = (y + innerHeight / 2 - centers[i]) / innerHeight;
      element.style.setProperty('--cinema-card-shift', `${clamp(progress * 18, -9, 9)}px`);
    });
  }
  function requestScroll() {
    if (!scrollFrame && fine.matches && !mobile.matches && !paused() && (heroVisible || lineupVisible)) scrollFrame = requestAnimationFrame(renderScroll);
  }
  function measure() {
    layoutFrame = 0;
    const y = window.scrollY;
    heroTop = poster ? poster.getBoundingClientRect().top + y : 0;
    centers = media.map(element => { const r = element.getBoundingClientRect(); return r.top + y + r.height / 2; });
    bounds = undefined; // Pointer bounds are refreshed on the next pointer entry.
    requestScroll();
  }
  function requestMeasure() { if (!layoutFrame) layoutFrame = requestAnimationFrame(measure); }
  function resetPointer() {
    cancelAnimationFrame(pointerFrame); pointerFrame = 0;
    ['--cream-light-x', '--cream-light-y', '--cream-depth-x', '--cream-depth-y'].forEach(key => poster?.style.removeProperty(key));
  }
  function syncPause() {
    if (hero) hero.dataset.cinemaPaused = String(paused() || !heroVisible);
    if (paused()) resetPointer();
    if (reduce.matches || !fine.matches || mobile.matches) {
      ['--cinema-type-scroll', '--cinema-media-scroll', '--cinema-ribbon-scroll'].forEach(key => poster?.style.removeProperty(key));
      media.forEach(element => element.style.removeProperty('--cinema-card-shift'));
    }
    if (reduce.matches) animations.forEach(animation => animation.cancel());
    else requestScroll();
  }
  const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    for (const entry of entries) {
      const target = entry.target;
      if (target === hero) { heroVisible = entry.isIntersecting; syncPause(); continue; }
      if (target === lineup) { lineupVisible = entry.isIntersecting; requestScroll(); continue; }
      if (!entry.isIntersecting || revealed.has(target) || reduce.matches || !target.animate) continue;
      revealed.add(target); observer.unobserve(target);
      if (target.contains(document.activeElement)) continue;
      const category = target.matches('.six7-category');
      const heading = target.matches('.six7-categories__header, .collection__title');
      const index = [...target.parentElement.children].indexOf(target);
      const x = category && !mobile.matches ? (index % 2 ? 28 : -28) : heading ? -12 : 0;
      const y = category ? (mobile.matches ? 38 : 68) : heading ? 24 : 32;
      const animation = target.animate([
        { opacity: category ? .12 : .2, translate: `${x}px ${y}px` },
        { opacity: 1, translate: '0 0' }
      ], { duration: category ? 1250 : heading ? 1050 : 900, delay: category ? index % 4 * 100 : heading ? 0 : index % 4 * 75, easing: 'cubic-bezier(.16,.8,.2,1)', fill: 'backwards' });
      animations.add(animation);
      target.addEventListener('focusin', () => animation.cancel(), { once: true });
      animation.finished.then(() => animations.delete(animation), () => animations.delete(animation));
    }
  }, { threshold: .08 }) : null;
  if (hero) observer?.observe(hero);
  if (lineup) observer?.observe(lineup);
  main.querySelectorAll('.six7-category, .six7-categories__header, .six7-lineup .collection__title, .six7-lineup .card__inner').forEach(element => observer?.observe(element));
  poster?.addEventListener('pointerenter', () => {
    if (fine.matches && !mobile.matches && !paused()) { const r = poster.getBoundingClientRect(); bounds = { left: r.left, top: r.top + scrollY, width: r.width, height: r.height }; }
  }, { passive: true });
  poster?.addEventListener('pointermove', event => {
    if (!bounds || !fine.matches || mobile.matches || paused()) return;
    pointerX = clamp((event.clientX - bounds.left) / bounds.width, 0, 1);
    pointerY = clamp((event.clientY + scrollY - bounds.top) / bounds.height, 0, 1);
    if (pointerFrame) return;
    pointerFrame = requestAnimationFrame(() => {
      poster.style.setProperty('--cream-light-x', `${pointerX * 100}%`);
      poster.style.setProperty('--cream-light-y', `${pointerY * 100}%`);
      poster.style.setProperty('--cream-depth-x', `${(pointerX - .5) * 16}px`);
      poster.style.setProperty('--cream-depth-y', `${(pointerY - .5) * 12}px`);
      pointerFrame = 0;
    });
  }, { passive: true });
  poster?.addEventListener('pointerleave', resetPointer, { passive: true });
  addEventListener('scroll', requestScroll, { passive: true });
  addEventListener('resize', requestMeasure, { passive: true });
  addEventListener('load', requestMeasure, { once: true });
  document.fonts?.ready.then(requestMeasure);
  if ('ResizeObserver' in window) new ResizeObserver(requestMeasure).observe(main);
  document.addEventListener('visibilitychange', syncPause);
  toggle?.addEventListener('change', syncPause);
  reduce.addEventListener('change', syncPause);
  fine.addEventListener('change', () => { resetPointer(); syncPause(); requestMeasure(); });
  mobile.addEventListener('change', () => { resetPointer(); syncPause(); requestMeasure(); });
  requestMeasure(); syncPause();
})();

// Independent card surfaces: preserve parent scroll reveals and child image hover effects.
(() => {
  const main = document.querySelector('main');
  if (!main || window.Shopify?.designMode) return;
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const cards = [...main.querySelectorAll(main.dataset.template === 'index' ? '.six7-category__link' : '.six7-about__art')];
  const resets = [];
  cards.forEach(card => {
    let bounds, frame = 0, x = .5, y = .5;
    const strength = card.matches('.six7-about__art') ? 4 : 8;
    const enabled = () => fine.matches && !reduce.matches && !document.hidden;
    function reset() {
      cancelAnimationFrame(frame); frame = 0; bounds = undefined;
      delete card.dataset.six7Tracking;
      ['--six7-tilt-x', '--six7-tilt-y', '--six7-edge-x', '--six7-edge-y'].forEach(key => card.style.removeProperty(key));
    }
    resets.push(reset);
    card.addEventListener('pointerenter', () => {
      if (!enabled()) return;
      const r = card.getBoundingClientRect();
      bounds = { left: r.left + scrollX, top: r.top + scrollY, width: r.width, height: r.height };
    }, { passive: true });
    card.addEventListener('pointermove', event => {
      if (!enabled() || !bounds) return;
      x = Math.max(0, Math.min(1, (event.clientX + scrollX - bounds.left) / bounds.width));
      y = Math.max(0, Math.min(1, (event.clientY + scrollY - bounds.top) / bounds.height));
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        card.dataset.six7Tracking = '';
        card.style.setProperty('--six7-tilt-x', `${(.5 - y) * strength}deg`);
        card.style.setProperty('--six7-tilt-y', `${(x - .5) * strength}deg`);
        card.style.setProperty('--six7-edge-x', `${x * 100}%`);
        card.style.setProperty('--six7-edge-y', `${y * 100}%`);
      });
    }, { passive: true });
    card.addEventListener('pointerleave', reset, { passive: true });
    card.addEventListener('focusin', reset);
  });
  const resetAll = () => resets.forEach(reset => reset());
  fine.addEventListener('change', resetAll);
  reduce.addEventListener('change', resetAll);
  addEventListener('resize', resetAll, { passive: true });
  addEventListener('blur', resetAll);
  document.addEventListener('visibilitychange', resetAll);
})();
