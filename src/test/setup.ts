import "@testing-library/jest-dom/vitest";

Object.defineProperty(window, "scrollTo", {
  writable: true,
  value: () => {},
});

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// The cinematic title is canvas-enhanced in browsers; JSDOM deliberately has
// no canvas implementation, so tests use a minimal no-op 2D context.
Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
  writable: true,
  value: () => ({
    setTransform: () => {},
    clearRect: () => {},
    fillText: () => {},
    getImageData: () => ({ data: new Uint8ClampedArray(4) }),
    beginPath: () => {},
    arc: () => {},
    fill: () => {},
  }),
});
