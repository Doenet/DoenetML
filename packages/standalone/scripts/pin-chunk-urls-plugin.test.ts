import { describe, expect, it } from "vitest";

import {
    FLUSH_RENDER_QUEUE_NAME,
    PIN_HELPER_NAME,
    pinChunkUrlsPlugin,
    pinHelperBanner,
    renderQueuePrologue,
    transformFacade,
} from "./pin-chunk-urls-plugin";

const PKG = "@doenet/standalone";
const V = "0.7.24";

/**
 * Evaluate the banner exactly as an emitted chunk would, with `import.meta.url`
 * standing in as a given URL, and hand back the resolver it binds.
 */
function evaluateBanner(selfUrl: string): (rel: string) => string {
    const banner = pinHelperBanner(PKG, V);
    const body = banner.replace("import.meta.url", JSON.stringify(selfUrl));
    expect(body).not.toBe(banner); // the substitution point must exist
    return new Function(`${body}; return ${PIN_HELPER_NAME};`)() as (
        rel: string,
    ) => string;
}

describe("pinHelperBanner", () => {
    it("is self-contained: no imports, no transpilation helpers", () => {
        const banner = pinHelperBanner(PKG, V);
        expect(banner).not.toMatch(/\bimport\s*[({"']/); // only import.meta
        expect(banner).not.toContain("require(");
        expect(banner).not.toContain("__name(");
        expect(banner).toContain("import.meta.url");
    });

    it("pins a chunk reference when evaluated under a floating tag", () => {
        const resolve = evaluateBanner(
            `https://cdn.jsdelivr.net/npm/${PKG}@latest/chunks/index-abc.js`,
        );
        expect(resolve("./EditorViewer-def.js")).toBe(
            `https://cdn.jsdelivr.net/npm/${PKG}@${V}/chunks/EditorViewer-def.js`,
        );
    });

    it("leaves a self-hosted URL on plain relative resolution", () => {
        const resolve = evaluateBanner(
            "https://host.example/doenet/chunks/index-abc.js",
        );
        expect(resolve("./EditorViewer-def.js")).toBe(
            "https://host.example/doenet/chunks/EditorViewer-def.js",
        );
    });
});

describe("transformFacade", () => {
    const banner = `/*banner*/\n`;

    it("rewrites the import+export facade shape this build emits", () => {
        const code =
            `import { bE as DoenetEditor, R as React } from './chunks/index-abc.js';\n` +
            `export { DoenetEditor, React };\n`;
        const { code: out } = transformFacade(code, banner);
        expect(out).toContain(banner);
        expect(out).toContain(
            `const { bE: DoenetEditor, R: React } = await import(${PIN_HELPER_NAME}("./chunks/index-abc.js"));`,
        );
        expect(out).toContain(`export { DoenetEditor, React };`);
        // The static import is gone: nothing left for a module loader to
        // resolve before the pin can run.
        expect(out).not.toMatch(/import\s*\{/);
    });

    it("accepts the same shape minified onto one line", () => {
        const code = `import{bE as e,R as t}from"./chunks/index-abc.js";export{e as DoenetEditor,t as React};`;
        const { code: out } = transformFacade(code, banner);
        expect(out).toContain(
            `const { bE: e, R: t } = await import(${PIN_HELPER_NAME}("./chunks/index-abc.js"));`,
        );
        expect(out).toContain(`export{e as DoenetEditor,t as React};`);
    });

    it("rewrites direct re-exports, renames and default included", () => {
        const code = `export { a as DoenetViewer, b as default, c } from './chunks/index-abc.js';\n`;
        const { code: out } = transformFacade(code, banner);
        expect(out).toContain(
            `const __doenetFacadeNs0 = await import(${PIN_HELPER_NAME}("./chunks/index-abc.js"));`,
        );
        expect(out).toContain(
            `export const DoenetViewer = __doenetFacadeNs0.a;`,
        );
        expect(out).toContain(`export default __doenetFacadeNs0.b;`);
        expect(out).toContain(`export const c = __doenetFacadeNs0.c;`);
    });

    it("rewrites side-effect, default, and namespace imports", () => {
        const code =
            `import './chunks/polyfill-abc.js';\n` +
            `import Def from './chunks/one-abc.js';\n` +
            `import * as ns from './chunks/two-abc.js';\n` +
            `export { ns };\n`;
        const { code: out } = transformFacade(code, banner);
        expect(out).toContain(
            `await import(${PIN_HELPER_NAME}("./chunks/polyfill-abc.js"));`,
        );
        expect(out).toContain(
            `const { default: Def } = await import(${PIN_HELPER_NAME}("./chunks/one-abc.js"));`,
        );
        expect(out).toContain(
            `const ns = await import(${PIN_HELPER_NAME}("./chunks/two-abc.js"));`,
        );
    });

    it("keeps statement order, so evaluation order is preserved", () => {
        const code =
            `import './chunks/first-abc.js';\n` +
            `import './chunks/second-abc.js';\n`;
        const { code: out } = transformFacade(code, banner);
        expect(out.indexOf("first-abc")).toBeLessThan(
            out.indexOf("second-abc"),
        );
    });

    it("fails loudly on a statement outside the facade grammar", () => {
        expect(() =>
            transformFacade(`const x = 1;\nexport { x };\n`, banner),
        ).toThrow(/outside the re-export grammar/);
    });

    it("fails loudly on a bare (non-relative) specifier", () => {
        expect(() =>
            transformFacade(`import { a } from 'react';\n`, banner),
        ).toThrow(/non-relative specifier/);
    });

    it("places the render-queue prologue before the await and its flush after everything", () => {
        const code =
            `import { a as b } from './chunks/index-abc.js';\n` +
            `export { b };\n`;
        const prologue = renderQueuePrologue();
        const { code: out } = transformFacade(code, banner, prologue);
        const installAt = out.indexOf(FLUSH_RENDER_QUEUE_NAME);
        const awaitAt = out.indexOf("await import(");
        const flushCallAt = out.lastIndexOf(`${FLUSH_RENDER_QUEUE_NAME}();`);
        expect(installAt).toBeGreaterThan(-1);
        expect(installAt).toBeLessThan(awaitAt);
        expect(flushCallAt).toBeGreaterThan(awaitAt);
        expect(flushCallAt).toBeGreaterThan(out.indexOf("export { b };"));
    });
});

describe("renderQueuePrologue", () => {
    it("is self-contained and installs the marked stubs when evaluated", () => {
        const prologue = renderQueuePrologue();
        expect(prologue).not.toMatch(/\bimport\s*[({"']/);
        expect(prologue).not.toContain("__name(");
        // Evaluate the exact injected text against a fake globalThis.
        const fakeGlobal: Record<string, unknown> = {};
        const flush = new Function(
            "globalThis",
            `${prologue}; return ${FLUSH_RENDER_QUEUE_NAME};`,
        )(fakeGlobal) as () => void;
        expect(typeof fakeGlobal.renderDoenetViewerToContainer).toBe(
            "function",
        );
        const queuedArgs: unknown[][] = [];
        (fakeGlobal.renderDoenetViewerToContainer as Function)("container");
        fakeGlobal.renderDoenetViewerToContainer = (...args: unknown[]) => {
            queuedArgs.push(args);
        };
        flush();
        expect(queuedArgs).toEqual([["container"]]);
    });
});

describe("pinChunkUrlsPlugin hooks", () => {
    const plugin = pinChunkUrlsPlugin({
        packageName: PKG,
        version: V,
        facadeFileName: "doenet-standalone.js",
    });
    const renderDynamicImport = plugin.renderDynamicImport as (options: {
        format: string;
        moduleId: string;
        targetModuleId: string | null;
        chunk: unknown;
        targetChunk: unknown;
    }) => { left: string; right: string } | null;

    it("wraps statically-resolved in-bundle dynamic imports", () => {
        const mechanism = renderDynamicImport({
            format: "es",
            moduleId: "/src/index.tsx",
            targetModuleId: "/src/lazy.tsx",
            chunk: { fileName: "chunks/index-abc.js" },
            targetChunk: { fileName: "chunks/lazy-def.js" },
        });
        expect(mechanism).toEqual({
            left: `import(${PIN_HELPER_NAME}(`,
            right: `))`,
        });
    });

    it("leaves runtime-variable specifiers on default rendering", () => {
        expect(
            renderDynamicImport({
                format: "es",
                moduleId: "/src/index.tsx",
                targetModuleId: null,
                chunk: { fileName: "chunks/index-abc.js" },
                targetChunk: null,
            }),
        ).toBeNull();
    });
});
