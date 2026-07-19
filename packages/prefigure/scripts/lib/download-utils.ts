import fs from "fs";
import crypto from "crypto";

/** HTTP statuses worth retrying: request timeout, rate limiting, and any 5xx. */
function isRetryableStatus(status: number): boolean {
    return status === 408 || status === 429 || status >= 500;
}

/** Read integer configuration from the environment and fail loudly on typos. */
function readIntegerEnv(
    name: string,
    defaultValue: number,
    minValue: number,
): number {
    const rawValue = process.env[name];
    if (rawValue == null || rawValue.trim() === "") {
        return defaultValue;
    }
    const parsed = Number(rawValue);
    if (!Number.isInteger(parsed) || parsed < minValue) {
        throw new Error(
            `${name} must be an integer greater than or equal to ${minValue}; received ${JSON.stringify(
                rawValue,
            )}.`,
        );
    }
    return parsed;
}

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export type FetchRetryOptions = {
    maxAttempts?: number;
    baseDelayMs?: number;
    maxDelayMs?: number;
};

/**
 * Fetch a URL, retrying transient failures with exponential backoff.
 *
 * The CDN/registry downloads these scripts perform (jsDelivr for pyodide wheels,
 * PyPI for the prefig wheel, GitHub raw for liblouis) occasionally fail with a
 * network-level "fetch failed" or a transient 5xx/429, which would otherwise
 * abort the whole build. Network errors and transient server-side statuses are
 * retried; permanent client errors (e.g. 404) fail immediately.
 *
 * Defaults can be overridden per call, or globally via the environment:
 *   DOWNLOAD_MAX_ATTEMPTS     total attempts before giving up (default 4)
 *   DOWNLOAD_RETRY_DELAY_MS   base backoff delay in ms (default 500)
 *   DOWNLOAD_MAX_DELAY_MS     backoff delay cap in ms (default 8000)
 */
export async function fetchUrl(
    url: string,
    options: FetchRetryOptions = {},
): Promise<Response> {
    const maxAttempts =
        options.maxAttempts ?? readIntegerEnv("DOWNLOAD_MAX_ATTEMPTS", 4, 1);
    const baseDelayMs =
        options.baseDelayMs ??
        readIntegerEnv("DOWNLOAD_RETRY_DELAY_MS", 500, 0);
    const maxDelayMs =
        options.maxDelayMs ?? readIntegerEnv("DOWNLOAD_MAX_DELAY_MS", 8_000, 0);

    let lastError: Error | undefined;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        let res: Response | undefined;
        try {
            res = await fetch(url);
        } catch (err) {
            // Network-level failure (DNS, reset connection, "fetch failed").
            lastError = err instanceof Error ? err : new Error(String(err));
        }

        if (res) {
            if (res.ok) {
                return res;
            }
            const statusError = new Error(
                `HTTP ${res.status} ${res.statusText} fetching ${url}`,
            );
            // Fail fast on permanent client errors (e.g. 404); only transient
            // server-side statuses are worth retrying.
            if (!isRetryableStatus(res.status)) {
                throw statusError;
            }
            lastError = statusError;
        }

        if (attempt < maxAttempts) {
            const delay = Math.min(
                baseDelayMs * 2 ** (attempt - 1),
                maxDelayMs,
            );
            console.warn(
                `  fetch attempt ${attempt}/${maxAttempts} for ${url} failed: ${lastError?.message}; retrying in ${delay}ms`,
            );
            await sleep(delay);
        }
    }

    throw lastError ?? new Error(`Failed to fetch ${url}`);
}

export async function downloadBuffer(url: string): Promise<Buffer> {
    const res = await fetchUrl(url);
    return Buffer.from(await res.arrayBuffer());
}

export async function downloadToFile(
    url: string,
    destPath: string,
): Promise<Buffer> {
    const buffer = await downloadBuffer(url);
    fs.writeFileSync(destPath, buffer);
    return buffer;
}

export function sha256hex(buffer: Uint8Array): string {
    return crypto.createHash("sha256").update(buffer).digest("hex");
}
