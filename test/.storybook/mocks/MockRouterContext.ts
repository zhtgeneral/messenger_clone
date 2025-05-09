/** This is the mock for app router context */
const mockRouterContext = {
  push: () => Promise.resolve(true),
  replace: () => Promise.resolve(true),
  refresh: () => Promise.resolve(),
  back: () => Promise.resolve(),
  forward: () => Promise.resolve(),
  prefetch: () => Promise.resolve(),
}

export default mockRouterContext;