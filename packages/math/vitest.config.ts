import { defineConfig } from "vite";

// The smoke test imports the *built* `dist/`, not `src/`, because the WASM
// inlining happens at build time — so the test also covers the build. The
// `test` script depends on `build` through wireit, so `npm run test -w
// packages/math` builds first.
export default defineConfig({
    test: {
        include: ["test/**/*.test.ts"],
        testTimeout: 60000,
    },
});
