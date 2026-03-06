## 2024-05-15 - React.lazy and Code Splitting
**Learning:** Found an opportunity to lazy-load the heavy 3D dependency components in the LandingPage. The FloatingParticles component imports `@react-three/fiber` and `three.js`. By lazy loading this, the initial JS bundle size is significantly reduced. This will improve First Contentful Paint.
**Action:** Use `React.lazy` and `Suspense` when a heavy component isn't strictly necessary for the initial view or is entirely decorative.
