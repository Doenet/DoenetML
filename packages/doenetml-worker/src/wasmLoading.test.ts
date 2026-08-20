import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
    decodeWasmDataUrl,
    resolveWasmInput,
    wasmUrlCandidates,
} from "./wasmLoading";

const WASM_FILE = "lib_doenetml_worker_bg.wasm";

const CDN_URL = `https://cdn.jsdelivr.net/npm/@doenet/standalone@0.0.0-test/doenetml-worker/${WASM_FILE}`;

/** A tiny valid base64 payload (the WASM magic bytes `\0asm`). */
const MAGIC_BASE64 = "AGFzbQ==";

/** A `Response`-like fetch result. */
function response(status: number, contentType?: string): Response {
    return new Response("body", {
        status,
        headers: contentType ? { "Content-Type": contentType } : {},
    });
}

beforeEach(() => {
    // The version the vite configs inject at build time.
    vi.stubGlobal("__DOENET_STANDALONE_VERSION__", "0.0.0-test");
});

afterEach(() => {
    vi.unstubAllGlobals();
});

describe("wasmUrlCandidates", () => {
    // These tests run in node, where `location` is undefined — the ladder's
    // step 3 contributes nothing, mirroring an environment with no URL of
    // its own.

    it("ends with the pinned CDN URL when nothing was injected", () => {
        expect(wasmUrlCandidates()).toEqual([CDN_URL]);
    });

    it("puts an injected WASM URL first", () => {
        vi.stubGlobal("__doenetWorkerWasmUrl", "https://host/custom.wasm");
        expect(wasmUrlCandidates()).toEqual([
            "https://host/custom.wasm",
            CDN_URL,
        ]);
    });

    it("resolves the sibling of an injected script URL", () => {
        vi.stubGlobal(
            "__doenetWorkerScriptUrl",
            "https://host/doenetml-worker/index.js",
        );
        expect(wasmUrlCandidates()).toEqual([
            `https://host/doenetml-worker/${WASM_FILE}`,
            CDN_URL,
        ]);
    });

    it("orders an injected WASM URL ahead of the script sibling", () => {
        vi.stubGlobal("__doenetWorkerWasmUrl", "https://host/custom.wasm");
        vi.stubGlobal(
            "__doenetWorkerScriptUrl",
            "https://host/doenetml-worker/index.js",
        );
        expect(wasmUrlCandidates()).toEqual([
            "https://host/custom.wasm",
            `https://host/doenetml-worker/${WASM_FILE}`,
            CDN_URL,
        ]);
    });

    it("deduplicates a WASM URL that equals the script sibling", () => {
        vi.stubGlobal(
            "__doenetWorkerWasmUrl",
            `https://host/doenetml-worker/${WASM_FILE}`,
        );
        vi.stubGlobal(
            "__doenetWorkerScriptUrl",
            "https://host/doenetml-worker/index.js",
        );
        expect(wasmUrlCandidates()).toEqual([
            `https://host/doenetml-worker/${WASM_FILE}`,
            CDN_URL,
        ]);
    });

    it("skips an opaque script base that has no sibling", () => {
        vi.stubGlobal("__doenetWorkerScriptUrl", "blob:not-a-base");
        expect(wasmUrlCandidates()).toEqual([CDN_URL]);
    });
});

describe("decodeWasmDataUrl", () => {
    it("decodes a base64 data: URL to its bytes", () => {
        const bytes = decodeWasmDataUrl(
            `data:application/wasm;base64,${MAGIC_BASE64}`,
        );
        expect(bytes).not.toBeNull();
        expect([...new Uint8Array(bytes!)]).toEqual([0x00, 0x61, 0x73, 0x6d]);
    });

    it("returns null for a URL that is not base64", () => {
        const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
        expect(decodeWasmDataUrl("data:application/wasm;base64,@@@@")).toBe(
            null,
        );
        warn.mockRestore();
    });
});

describe("resolveWasmInput", () => {
    it("decodes an injected data: URL without fetching", async () => {
        vi.stubGlobal(
            "__doenetWorkerWasmUrl",
            `data:application/wasm;base64,${MAGIC_BASE64}`,
        );
        const fetchMock = vi.fn();
        vi.stubGlobal("fetch", fetchMock);
        const input = await resolveWasmInput();
        expect(input).toBeInstanceOf(ArrayBuffer);
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it("returns the response of the first candidate that fetches", async () => {
        vi.stubGlobal("__doenetWorkerWasmUrl", "https://host/custom.wasm");
        const ok = response(200, "application/wasm");
        const fetchMock = vi.fn().mockResolvedValue(ok);
        vi.stubGlobal("fetch", fetchMock);
        await expect(resolveWasmInput()).resolves.toBe(ok);
        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(fetchMock).toHaveBeenCalledWith("https://host/custom.wasm");
    });

    it("accepts a mis-served MIME type that is not HTML", async () => {
        // wasm-bindgen's bytes fallback handles e.g. application/octet-stream.
        vi.stubGlobal("__doenetWorkerWasmUrl", "https://host/custom.wasm");
        const ok = response(200, "application/octet-stream");
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue(ok));
        await expect(resolveWasmInput()).resolves.toBe(ok);
    });

    it("falls through to the next candidate on a failed status", async () => {
        vi.stubGlobal(
            "__doenetWorkerScriptUrl",
            "https://host/doenetml-worker/index.js",
        );
        const ok = response(200, "application/wasm");
        const fetchMock = vi
            .fn()
            .mockResolvedValueOnce(response(404, "text/plain"))
            .mockResolvedValueOnce(ok);
        vi.stubGlobal("fetch", fetchMock);
        await expect(resolveWasmInput()).resolves.toBe(ok);
        expect(fetchMock).toHaveBeenNthCalledWith(2, CDN_URL);
    });

    it("treats a 200 HTML page (a SPA's catch-all route) as a miss", async () => {
        vi.stubGlobal(
            "__doenetWorkerScriptUrl",
            "https://host/doenetml-worker/index.js",
        );
        const ok = response(200, "application/wasm");
        const fetchMock = vi
            .fn()
            .mockResolvedValueOnce(response(200, "text/html; charset=utf-8"))
            .mockResolvedValueOnce(ok);
        vi.stubGlobal("fetch", fetchMock);
        await expect(resolveWasmInput()).resolves.toBe(ok);
        expect(fetchMock).toHaveBeenNthCalledWith(2, CDN_URL);
    });

    it("rejects with the last error when every candidate fails", async () => {
        vi.stubGlobal(
            "__doenetWorkerScriptUrl",
            "https://host/doenetml-worker/index.js",
        );
        const fetchMock = vi
            .fn()
            .mockResolvedValueOnce(response(404, "text/plain"))
            .mockResolvedValueOnce(response(200, "text/html"));
        vi.stubGlobal("fetch", fetchMock);
        await expect(resolveWasmInput()).rejects.toThrow(
            /text\/html.*rather than WebAssembly/,
        );
    });
});
