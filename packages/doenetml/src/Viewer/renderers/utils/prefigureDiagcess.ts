import { PREFIGURE_DIAGCESS_SCRIPT_URL } from "./prefigureConfig";

export const DIAGCESS_REINIT_DELAY_MS = 400;

export type DiagcessApi = {
    Base: {
        init: () => void;
        molMap: Record<string, unknown>;
    };
};

const DIAGCESS_SCRIPT_MARKER_ATTR = "data-doenet-diagcess-script";
const DIAGCESS_SCRIPT_LOADED_ATTR = "data-doenet-diagcess-loaded";
let diagcessScriptLoadPromise: Promise<void> | null = null;

export function diagcessApi(): DiagcessApi | undefined {
    return (window as Window & { diagcess?: DiagcessApi }).diagcess;
}

function resolveScriptUrl(url: string): string {
    return new URL(url, window.location.href).href;
}

function findDiagcessScript(): HTMLScriptElement | null {
    const expectedUrl = resolveScriptUrl(PREFIGURE_DIAGCESS_SCRIPT_URL);
    const scripts = Array.from(document.getElementsByTagName("script"));

    for (const script of scripts) {
        const matchesMarker =
            script.getAttribute(DIAGCESS_SCRIPT_MARKER_ATTR) === "true";
        const matchesUrl = script.src === expectedUrl;

        if (matchesMarker || matchesUrl) {
            return script;
        }
    }

    return null;
}

export function ensureDiagcessScriptLoaded(): Promise<void> {
    if (diagcessApi()) {
        return Promise.resolve();
    }

    if (diagcessScriptLoadPromise) {
        return diagcessScriptLoadPromise;
    }

    diagcessScriptLoadPromise = new Promise<void>((resolve, reject) => {
        const resolveLoaded = () => {
            resolve();
        };

        const rejectLoad = () => {
            diagcessScriptLoadPromise = null;
            reject(new Error("Failed to load diagcess script."));
        };

        const existingScript = findDiagcessScript();
        if (existingScript) {
            if (
                diagcessApi() ||
                existingScript.getAttribute(DIAGCESS_SCRIPT_LOADED_ATTR) ===
                    "true"
            ) {
                resolveLoaded();
                return;
            }

            existingScript.addEventListener("load", resolveLoaded, {
                once: true,
            });
            existingScript.addEventListener("error", rejectLoad, {
                once: true,
            });
            return;
        }

        const script = document.createElement("script");
        script.src = PREFIGURE_DIAGCESS_SCRIPT_URL;
        script.type = "text/javascript";
        script.async = true;
        script.setAttribute(DIAGCESS_SCRIPT_MARKER_ATTR, "true");

        script.addEventListener(
            "load",
            () => {
                script.setAttribute(DIAGCESS_SCRIPT_LOADED_ATTR, "true");
                resolveLoaded();
            },
            { once: true },
        );

        script.addEventListener("error", rejectLoad, { once: true });
        document.head.appendChild(script);
    });

    return diagcessScriptLoadPromise;
}

export function removeDiagcessMessages(container: HTMLElement | null): void {
    if (!container) {
        return;
    }

    for (const child of Array.from(container.children)) {
        if (
            child instanceof HTMLParagraphElement &&
            child.classList.contains("cacc-message")
        ) {
            child.remove();
        }
    }
}

export function queueDiagcessReinit({
    diagcess,
    priorTimer,
}: {
    diagcess: DiagcessApi;
    priorTimer: ReturnType<typeof setTimeout> | null;
}): ReturnType<typeof setTimeout> {
    if (priorTimer) {
        clearTimeout(priorTimer);
    }

    // diagcess mutates molMap during init, so clear any stale
    // entries before re-running it against newly inserted markup.
    diagcess.Base.molMap = {};

    // Wait briefly for the sanitized SVG/annotations XML markup to be present
    // in the live DOM before diagcess scans and annotates it.
    return setTimeout(() => {
        diagcess.Base.init();
    }, DIAGCESS_REINIT_DELAY_MS);
}
