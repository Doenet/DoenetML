import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchUrl } from "../scripts/lib/download-utils.ts";

// Keep backoff instant so the retry tests don't actually wait.
const NO_WAIT = { baseDelayMs: 0, maxDelayMs: 0 };

afterEach(() => {
    vi.restoreAllMocks();
});

describe("fetchUrl", () => {
    it("returns the response on the first successful fetch", async () => {
        const ok = new Response("ok", { status: 200 });
        const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(ok);

        const res = await fetchUrl("https://example.test/file", NO_WAIT);

        expect(res).toBe(ok);
        expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it("retries a network-level failure and then succeeds", async () => {
        const ok = new Response("ok", { status: 200 });
        const fetchMock = vi
            .spyOn(globalThis, "fetch")
            .mockRejectedValueOnce(new TypeError("fetch failed"))
            .mockRejectedValueOnce(new TypeError("fetch failed"))
            .mockResolvedValue(ok);

        const res = await fetchUrl("https://example.test/file", {
            ...NO_WAIT,
            maxAttempts: 4,
        });

        expect(res).toBe(ok);
        expect(fetchMock).toHaveBeenCalledTimes(3);
    });

    it("retries a transient 5xx status and then succeeds", async () => {
        const fetchMock = vi
            .spyOn(globalThis, "fetch")
            .mockResolvedValueOnce(new Response(null, { status: 503 }))
            .mockResolvedValue(new Response("ok", { status: 200 }));

        const res = await fetchUrl("https://example.test/file", {
            ...NO_WAIT,
            maxAttempts: 4,
        });

        expect(res.ok).toBe(true);
        expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it("fails fast on a permanent client error without retrying", async () => {
        const fetchMock = vi
            .spyOn(globalThis, "fetch")
            .mockResolvedValue(new Response(null, { status: 404 }));

        await expect(
            fetchUrl("https://example.test/missing", {
                ...NO_WAIT,
                maxAttempts: 4,
            }),
        ).rejects.toThrow(/HTTP 404/);
        expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it("gives up after exhausting all attempts", async () => {
        const fetchMock = vi
            .spyOn(globalThis, "fetch")
            .mockRejectedValue(new TypeError("fetch failed"));

        await expect(
            fetchUrl("https://example.test/file", {
                ...NO_WAIT,
                maxAttempts: 3,
            }),
        ).rejects.toThrow(/fetch failed/);
        expect(fetchMock).toHaveBeenCalledTimes(3);
    });
});
