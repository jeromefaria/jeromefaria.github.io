Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => true,
  }),
});

global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
} as unknown as typeof IntersectionObserver;

window.scrollTo = () => {};

// eslint-disable-next-line local/no-comments -- non-obvious gotcha
// usePageHead injects <link rel="preload" as="image"> and happy-dom actually fetches preload links (disableCSSFileLoading only covers rel="stylesheet"); left pending, that fetch is aborted when the window is torn down and prints an AsyncTaskManager error that can flake the run, so short-circuit every resource fetch with a canned response.
const happyDom = (window as unknown as { happyDOM?: { settings: { fetch: { interceptor: unknown } } } }).happyDOM;
if (happyDom) {
  happyDom.settings.fetch.interceptor = {
    beforeAsyncRequest: async () => new Response('', { status: 200 }),
  };
}
