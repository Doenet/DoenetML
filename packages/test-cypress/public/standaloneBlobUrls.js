let cachedUrls = null;

/**
 * Fetch and cache the standalone script and CSS as blob URLs.
 * Returns an object with `scriptUrl` and `cssUrl` properties.
 */
export async function getStandaloneBlobUrls() {
    if (!cachedUrls) {
        const [scriptSource, cssSource] = await Promise.all([
            fetch("/standalone/doenet-standalone.js").then((r) => r.text()),
            fetch("/standalone/style.css").then((r) => r.text()),
        ]);

        cachedUrls = {
            scriptUrl: URL.createObjectURL(
                new Blob([scriptSource], {
                    type: "application/javascript",
                }),
            ),
            cssUrl: URL.createObjectURL(
                new Blob([cssSource], { type: "text/css" }),
            ),
        };
    }

    return cachedUrls;
}

/**
 * Inject the standalone CSS into the document head.
 * Optionally specify a target document (defaults to current document).
 */
export async function injectStandaloneCss(targetDocument = document) {
    const existing = targetDocument.getElementById("doenet-standalone-css");
    if (existing) {
        return;
    }

    const { cssUrl } = await getStandaloneBlobUrls();
    const link = targetDocument.createElement("link");
    link.id = "doenet-standalone-css";
    link.rel = "stylesheet";
    link.href = cssUrl;
    targetDocument.head.appendChild(link);
}

/**
 * Load and execute the standalone script in the document.
 * Optionally specify a target document (defaults to current document).
 */
export async function loadStandaloneScript(targetDocument = document) {
    if (typeof window.renderDoenetViewerToContainer === "function") {
        return;
    }

    const existing = targetDocument.getElementById("doenet-standalone-js");
    if (existing) {
        await new Promise((resolve) => {
            existing.addEventListener("load", resolve, { once: true });
        });
        return;
    }

    const { scriptUrl } = await getStandaloneBlobUrls();

    await new Promise((resolve) => {
        const script = targetDocument.createElement("script");
        script.id = "doenet-standalone-js";
        script.type = "module";
        script.src = scriptUrl;
        script.onload = resolve;
        targetDocument.head.appendChild(script);
    });
}
