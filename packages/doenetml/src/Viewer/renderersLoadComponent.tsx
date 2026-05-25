import React from "react";

/**
 * True when `error` matches the transient dynamic-import failures we see when
 * Vite's dev server hiccups (Cypress component-test runs) or a network blip
 * interrupts a renderer-chunk fetch in production. The browsers emit slightly
 * different wording for the same condition, so we check several phrasings.
 *
 * The fourth regex is an intentional catch-all that subsumes the first and
 * third (and would catch unanticipated wording variations). The second is
 * Safari's phrasing and is *not* a subset of the catch-all, so leave it in
 * place; the first and third remain for self-documenting intent.
 */
export function isTransientDynamicImportError(error: unknown): boolean {
    const message = error instanceof Error ? error.message : String(error);
    return (
        /Failed to fetch dynamically imported module/i.test(message) ||
        /Importing a module script failed/i.test(message) ||
        /error loading dynamically imported module/i.test(message) ||
        /dynamically imported module/i.test(message)
    );
}

/**
 * Call `loader()` (a dynamic `import()` factory), retrying with exponential
 * backoff on transient failure. See issue #1190.
 */
export async function importRendererWithRetry<T>(
    loader: () => Promise<T>,
    name: string,
    retries = 3,
    initialDelayMs = 100,
): Promise<T> {
    let remaining = retries;
    let delayMs = initialDelayMs;
    for (;;) {
        try {
            return await loader();
        } catch (error) {
            if (remaining === 0 || !isTransientDynamicImportError(error)) {
                throw error;
            }
            console.warn(
                `Transient failure loading renderer "${name}" — retrying (${remaining} left).`,
                error,
            );
            await new Promise((resolve) => setTimeout(resolve, delayMs));
            remaining -= 1;
            delayMs *= 2;
        }
    }
}

/**
 * Inline placeholder rendered in place of a renderer that ultimately failed
 * to load (after retries). Keeps the surrounding document mounted and avoids
 * an unhandled rejection — what used to happen when a viewer renderer chunk
 * failed to fetch.
 */
export function RendererLoadFailed(props: {
    componentInstructions?: { id?: string };
}) {
    return (
        <div
            id={props.componentInstructions?.id}
            role="alert"
            style={{
                backgroundColor: "#ff9999",
                color: "#222",
                borderWidth: 3,
                borderStyle: "solid",
                padding: "0.5em",
                textAlign: "center",
            }}
        >
            <b>Error</b>: a renderer failed to load. Please reload the page.
        </div>
    );
}

export type RenderersLoadResult = {
    rendererClasses: Record<string, any>;
    /** Names of renderers whose loader rejected (a placeholder was substituted). */
    failedRenderers: string[];
};

/**
 * Resolve each loader factory into its module's default export, retrying
 * transient dynamic-import failures and substituting a placeholder when a
 * loader ultimately rejects. Loaders settle in parallel with handlers
 * attached up-front, so a late rejection from one renderer can't surface as
 * an unhandled promise rejection while we are still awaiting an earlier one.
 *
 * Loaders are factories (`() => import(...)`) rather than pre-started
 * promises so each `import()` call happens *inside* `importRendererWithRetry`,
 * where its rejection is caught by the surrounding try/catch on the same
 * microtask the import would settle. See issue #1190.
 */
export async function renderersLoadComponent(
    loaders: Array<() => Promise<any>>,
    rendererClassNames: string[],
): Promise<RenderersLoadResult> {
    const failedRenderers: string[] = [];
    const settled = await Promise.all(
        loaders.map((loader, index) => {
            const name = rendererClassNames[index];
            return importRendererWithRetry(loader, name).then(
                (module) => ({ name, component: module.default }),
                (error) => {
                    console.error(
                        `Failed to load renderer "${name}" after retries:`,
                        error,
                    );
                    failedRenderers.push(name);
                    return { name, component: RendererLoadFailed };
                },
            );
        }),
    );
    const rendererClasses: Record<string, any> = {};
    for (const { name, component } of settled) {
        rendererClasses[name] = component;
    }
    return { rendererClasses, failedRenderers };
}
