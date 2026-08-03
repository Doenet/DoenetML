import { defineConfig } from "vite";

// The smoke test imports the *built* `dist/`, not `src/`, because the engine
// choice and the WASM inlining both happen at build time. Build first:
//   npm run build -w packages/math                      (JavaScript engine)
//   npm run build -w packages/math   (Rust/WASM engine)
export default defineConfig({
    test: {
        include: ["test/**/*.test.ts"],
        testTimeout: 60000,
    },
});
