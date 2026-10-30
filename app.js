const tabs = [...document.querySelectorAll('[role="tab"]')];
const panels = [...document.querySelectorAll('[role="tabpanel"]')];
const selector = document.querySelector('.selector');
const highlight = document.createElement('span');
highlight.className = 'selection-highlight';
highlight.setAttribute('aria-hidden', 'true');
selector.prepend(highlight);
let selectedIndex = 0;
function moveHighlight() {
  const tab = tabs[selectedIndex];
  selector.setAttribute('aria-orientation', tabs[0].offsetTop === tabs[1].offsetTop ? 'horizontal' : 'vertical');
  highlight.style.width = `${tab.offsetWidth}px`;
  highlight.style.height = `${tab.offsetHeight}px`;
  highlight.style.transform = `translate(${tab.offsetLeft}px, ${tab.offsetTop}px)`;
}
function selectProject(index, focus = false) {
  selectedIndex = index;
  tabs.forEach((tab, i) => {
    tab.setAttribute('aria-selected', String(i === index));
    tab.tabIndex = i === index ? 0 : -1;
    panels[i].hidden = i !== index;
  });
  document.querySelector('#counter').textContent = `0${index + 1} / 03`;
  moveHighlight();
  if (focus) tabs[index].focus();
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectProject(index));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next !== undefined) { event.preventDefault(); selectProject(next, true); }
  });
});

new ResizeObserver(moveHighlight).observe(selector);
moveHighlight();

// Synthesize brief interface cues only after a user gesture; no audio downloads.
const soundToggle = document.querySelector('#sound-toggle');
let soundMuted = false;
let audioContext;
let lastSoundTime = -1;
function playInterfaceSound(kind = 'select') {
  if (soundMuted) return;
  const Audio = window.AudioContext || window.webkitAudioContext;
  if (!Audio) return;
  try {
    audioContext ||= new Audio();
    const schedule = () => {
      if (soundMuted || audioContext.state !== 'running') return;
      const now = audioContext.currentTime;
      if (now - lastSoundTime < .035) return;
      lastSoundTime = now;
      const layers = kind === 'activate'
        ? [{ from: 250, to: 65, duration: .13, volume: .085, type: 'sine' }, { from: 1900, to: 700, duration: .022, volume: .025, type: 'triangle' }]
        : [{ from: 210, to: 85, duration: .105, volume: .07, type: 'sine' }, { from: 1600, to: 650, duration: .018, volume: .022, type: 'triangle' }];
      layers.forEach(({ from, to, duration, volume, type }) => {
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();
        oscillator.type = type;
        oscillator.frequency.setValueAtTime(from, now);
        oscillator.frequency.exponentialRampToValueAtTime(to, now + duration);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(volume, now + .003);
        gain.gain.exponentialRampToValueAtTime(.0001, now + duration);
        oscillator.connect(gain);
        gain.connect(audioContext.destination);
        oscillator.start(now);
        oscillator.stop(now + duration + .005);
        oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
      });
    };
    if (audioContext.state === 'suspended') audioContext.resume().then(schedule).catch(() => {});
    else schedule();
  } catch { /* The portfolio remains usable when browser audio is unavailable. */ }
}
soundToggle.addEventListener('click', () => {
  soundMuted = !soundMuted;
  soundToggle.setAttribute('aria-pressed', String(soundMuted));
  soundToggle.setAttribute('aria-label', soundMuted ? 'Unmute interface sounds' : 'Mute interface sounds');
  soundToggle.querySelector('span').textContent = soundMuted ? 'Sound off' : 'Sound on';
  if (soundMuted && audioContext?.state === 'running') audioContext.suspend().catch(() => {});
  if (!soundMuted) playInterfaceSound('activate');
});
document.addEventListener('click', event => {
  if (event.target.closest('#sound-toggle')) return;
  const control = event.target.closest('a, button');
  if (control) playInterfaceSound(control.getAttribute('role') === 'tab' ? 'select' : 'activate');
});
selector.addEventListener('keydown', event => {
  if (['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft', 'Home', 'End'].includes(event.key)) playInterfaceSound('select');
});


// Reveal a translucent route from the work CTA as the document scrolls.
// Only scroll/resize events schedule frames; the page has no idle animation loop.
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const trail = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
trail.classList.add('scroll-trail');
trail.setAttribute('aria-hidden', 'true');
trail.setAttribute('focusable', 'false');
const trailPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
trail.append(trailPath);
document.body.append(trail);
let trailLength = 0;
let trailStartY = 0;
let trailEndY = 0;
let trailFrame = 0;
function updateTrail() {
  trailFrame = 0;
  if (reducedMotion.matches) return;
  const targetY = Math.max(trailStartY, Math.min(trailEndY, scrollY + innerHeight * .65));
  let visibleLength = 0;
  if (scrollY > 0 && targetY > trailStartY) {
    // The route is monotonic in Y, so this also tracks the lateral section sweep.
    let low = 0;
    let high = trailLength;
    for (let i = 0; i < 16; i++) {
      const middle = (low + high) / 2;
      if (trailPath.getPointAtLength(middle).y < targetY) low = middle;
      else high = middle;
    }
    visibleLength = (low + high) / 2;
  }
  trailPath.style.strokeDashoffset = String(Math.max(0, trailLength - visibleLength));
}
function requestTrailUpdate() {
  if (!trailFrame && !reducedMotion.matches) trailFrame = requestAnimationFrame(updateTrail);
}
function measureTrail() {
  if (reducedMotion.matches) return;
  const origin = document.querySelector('.all-work').getBoundingClientRect();
  const height = document.documentElement.scrollHeight;
  const width = document.documentElement.clientWidth;
  const startX = origin.right - 9;
  const startY = origin.bottom + scrollY;
  const lane = width < 650 ? 11 : Math.max(22, width * .025);
  const toolkitHeading = document.querySelector('#toolkit h2').getBoundingClientRect();
  const endY = toolkitHeading.top + scrollY + toolkitHeading.height / 2;
  trail.setAttribute('viewBox', `0 0 ${width} ${height}`);
  trail.style.height = `${height}px`;
  const boundary = document.querySelector('#velosync').getBoundingClientRect().top + scrollY;
  const rightLane = width - lane;
  // Rounded turns keep the crossover straight through the empty section boundary.
  // A slight downward slope preserves monotonic Y for scroll-progress lookup.
  const radius = Math.min(52, width * .12);
  const handle = radius * .5523;
  const leftTurnX = lane + radius;
  const rightTurnX = rightLane - radius;
  const crossTop = boundary - 13;
  const crossBottom = boundary + 13;
  const slope = (crossBottom - crossTop) / (rightTurnX - leftTurnX);
  trailPath.setAttribute('d', `M ${startX} ${startY} C ${startX} ${startY + 65}, ${lane} ${startY + 40}, ${lane} ${startY + 120} L ${lane} ${crossTop - radius} C ${lane} ${crossTop - radius + handle}, ${leftTurnX - handle} ${crossTop - handle * slope}, ${leftTurnX} ${crossTop} L ${rightTurnX} ${crossBottom} C ${rightTurnX + handle} ${crossBottom + handle * slope}, ${rightLane} ${crossBottom + radius - handle}, ${rightLane} ${crossBottom + radius} L ${rightLane} ${endY}`);
  trailLength = trailPath.getTotalLength();
  trailStartY = startY;
  trailEndY = endY;
  trailPath.style.strokeDasharray = String(trailLength);
  updateTrail();
}
window.addEventListener('scroll', requestTrailUpdate, { passive: true });
window.addEventListener('resize', measureTrail);
window.addEventListener('load', measureTrail);
reducedMotion.addEventListener('change', measureTrail);
new ResizeObserver(measureTrail).observe(document.querySelector('main'));
measureTrail();

// Reveal lower sections once; unsupported browsers keep the static, readable page.
let sectionObserver;
const revealTargets = [...document.querySelectorAll('.project-section-top, .project-story, .toolkit, .contact')];
function configureSectionReveals() {
  sectionObserver?.disconnect();
  revealTargets.forEach(element => element.classList.remove('reveal-pending', 'reveal-ready'));
  if (reducedMotion.matches || !('IntersectionObserver' in window)) return;
  sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.remove('reveal-pending');
      entry.target.classList.add('reveal-ready');
      sectionObserver.unobserve(entry.target);
    });
  }, { threshold: .08, rootMargin: '0px 0px -24px 0px' });
  revealTargets.forEach(element => {
    if (element.getBoundingClientRect().top < innerHeight * .9) return;
    element.classList.add('reveal-pending');
    sectionObserver.observe(element);
  });
}
reducedMotion.addEventListener('change', configureSectionReveals);
configureSectionReveals();
document.addEventListener('animationend', event => {
  if (event.target.matches('.all-work, #toolkit')) measureTrail();
});
