export function startProjectDrift(reduced: MediaQueryList) {
  if (!("IntersectionObserver" in window)) return;

  const frames = document.querySelectorAll<HTMLElement>(".project-image");
  const nearby = new Set<HTMLElement>();
  const positions = new Map<HTMLElement, number>();
  let pending = 0;

  function update() {
    pending = 0;
    if (reduced.matches) return;
    let settling = false;
    const viewport = window.innerHeight;
    const offsets = [...nearby].flatMap((frame) => {
      const bounds = frame.getBoundingClientRect();
      if (!bounds.width) return [];
      const center = bounds.top + bounds.height / 2;
      const progress = Math.max(-1, Math.min(1, (viewport / 2 - center) / (viewport * .53)));
      const distance = progress * Math.min(39, bounds.width * .092);
      const previous = positions.get(frame) ?? distance;
      const difference = distance - previous;
      if (Math.abs(difference) > .2) {
        settling = true;
        return [{ frame, offset: previous + difference * .22 }];
      }
      return [{ frame, offset: distance }];
    });
    for (const { frame, offset } of offsets) {
      if (offset === positions.get(frame)) continue;
      positions.set(frame, offset);
      frame.style.setProperty("--screenshot-drift", offset.toFixed(2) + "px");
    }
    if (settling) schedule();
  }

  function schedule() {
    if (!reduced.matches && nearby.size && !pending) pending = requestAnimationFrame(update);
  }

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      const frame = entry.target as HTMLElement;
      if (entry.isIntersecting) nearby.add(frame);
      else {
        nearby.delete(frame);
        positions.delete(frame);
        frame.style.removeProperty("--screenshot-drift");
      }
    }
    schedule();
  }, { rootMargin: "96px 0px" });
  frames.forEach((frame) => observer.observe(frame));
  addEventListener("scroll", schedule, { passive: true });
  addEventListener("resize", schedule, { passive: true });
  reduced.addEventListener("change", () => {
    if (!reduced.matches) {
      schedule();
      return;
    }
    cancelAnimationFrame(pending);
    pending = 0;
    for (const frame of positions.keys()) frame.style.removeProperty("--screenshot-drift");
    positions.clear();
  });
}
