## 2024-03-08 - Added React.memo and loading="lazy" to MatchCard component
**Learning:** List components like `MatchCard` are often rendered multiple times and their props might not change. Memoizing the component can prevent unnecessary re-renders. Additionally, lazy loading images within these cards can improve the initial load performance by deferring the fetching of images until they are in the viewport.
**Action:** Use `React.memo` for components that render frequently in a list. Use `loading="lazy"` on image tags within such components.
