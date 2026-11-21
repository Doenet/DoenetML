import path from "node:path";
import { defineConfig } from "vitest/config";

// Not `vite.config.ts`, which is the library build. The tests run the source
// in `src/`, so they point the resolver WASM locator at the repository's
// build of it; the built package finds its own copy beside `dist/`, which
// `test/built-package.test.ts` checks in plain Node.
export default defineConfig({
    test: {
        environment: "node",
        include: ["test/**/*.test.ts"],
        testTimeout: 120000,
        env: {
            DOENET_HEADLESS_RESOLVER_WASM: path.resolve(
                import.meta.dirname,
                "../doenetml-worker-rust/lib-js-wasm-binding/pkg/lib_doenetml_worker_bg.wasm",
            ),
        },
    },
});
