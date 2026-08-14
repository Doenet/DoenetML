/** fd
 * This file exports an object that can be used in tests. It spawns a headless browser and
 * and loads the doenet core worker into that browser.
 */
import { remote } from "webdriverio";
import type { FlatDastRoot } from "@doenet/doenetml-worker";
// @ts-ignore
import _convertScript from "./dist/dast-to-flat-dast/index.js?raw";
const convertScript: string = _convertScript;

/**
 * How long the *page* is given to produce an answer. Resolving rather than
 * rejecting is deliberate: the caller then gets a string that fails its
 * snapshot and names the problem, instead of a bare timeout.
 *
 * The literal is repeated inside the in-page function below and cannot be
 * shared with it — that function is serialized into the browser, where this
 * module does not exist. This constant is here to be *compared against*, in
 * {@link SESSION_BUDGET_MS}'s reasoning; keep the two in step by hand.
 */
const PAGE_BUDGET_MS = 5000;

/**
 * How long a whole `browser.execute` round trip is given, page work included.
 *
 * Anything past {@link PAGE_BUDGET_MS} is not the document taking its time —
 * the in-page watchdog would have answered by then. It is the WebDriver session
 * itself wedged, which is what took `DoenetML to PreTeXt Tests` down twice on
 * this branch, both times on the *last* test in `pretext-export.test.ts` after
 * ~50 core boots through one Chrome session. Raising vitest's `testTimeout`
 * from 5 s to 60 s only changed which number the failure was reported at. So
 * this budget is the one that matters, and blowing it means throwing the
 * session away rather than waiting on it.
 */
const SESSION_BUDGET_MS = 20000;

/** Sentinel for "the round trip blew {@link SESSION_BUDGET_MS}". */
const WEDGED = Symbol("webdriver session wedged");

/**
 * What to ask the page for. One discriminated union rather than three
 * near-identical `browser.execute` calls, because the function below is
 * *serialized* into the browser and so cannot share anything with this module —
 * every helper it needs has to be written inside it, and was, three times over.
 */
type PageJob =
    | { kind: "convert"; source: string; fragment: boolean }
    | { kind: "convertMultiple"; sources: string[] };

/**
 * A processor that allows calls to be made to core via a headless browser.
 */
export class RunThroughCore {
    browser?: WebdriverIO.Browser = undefined;
    initRunning = false;
    initRunningPromise = Promise.resolve();
    initRunningPromiseResolve: (value: void) => void = () => {};
    constructor() {
        this._initPromise();
        this.init();
    }
    _initPromise() {
        let resolve: (value: void) => void = () => {};
        this.initRunningPromise = new Promise((r) => {
            resolve = r;
        });
        this.initRunningPromiseResolve = resolve;
    }
    async init() {
        if (this.initRunning) {
            return;
        }
        this.initRunning = true;
        try {
            // Initialize the browser
            this.browser = await remote({
                capabilities: {
                    browserName: "chrome",
                    "goog:chromeOptions": {
                        args: ["headless", "disable-gpu"],
                    },
                    "moz:firefoxOptions": {
                        args: ["-headless"],
                    },
                },
                logLevel: "error",
            });
            // Mock a URL to serve a minimal HTML page so the browser has a real
            // HTTP origin. Module workers from blob URLs require a non-null origin;
            // Chrome rejects type:"module" workers created on about:blank (null origin).
            const pageMock = await this.browser.mock(
                "http://doenetml-test.localhost/",
            );
            pageMock.respond(
                "<!DOCTYPE html><html><head></head><body></body></html>",
                { headers: { "Content-Type": "text/html" } },
            );
            await this.browser.url("http://doenetml-test.localhost/");
            // Set up logging of console.log messages from scripts the browser is executing
            await this.browser.sessionSubscribe({ events: ["log.entryAdded"] });
            this.browser.on("log.entryAdded", (entry) => this.onLog(entry));

            // Load in the web worker script
            await this.browser.execute((source) => {
                const scriptElement = document.createElement("script");
                scriptElement.type = "module";
                scriptElement.textContent = source;
                document.head.appendChild(scriptElement);
            }, convertScript);
        } finally {
            this.initRunning = false;
            this.initRunningPromiseResolve();
        }
    }
    async onLog(message: unknown) {
        console.log(
            "[webdriverio browser]",
            ...(message as any).args.map((a: any) => a.value),
        ); // (message as any).text, "args:", (message as any).args);
    }
    async close() {
        if (this.browser) {
            await this.browser.deleteSession();
            this.browser = undefined;
            this._initPromise();
        }
    }

    /** Have a live browser, starting or restarting one if there is not. */
    private async ready(): Promise<WebdriverIO.Browser> {
        if (!this.browser) {
            await this.init();
        }
        await this.initRunningPromise;
        if (!this.browser) {
            throw new Error("Failed to initialize browser");
        }
        return this.browser;
    }

    /**
     * Run one {@link PageJob} in the browser, giving up on a wedged session and
     * retrying on a fresh one.
     *
     * The retry is bounded at one, and it fires only on a session that has
     * missed {@link SESSION_BUDGET_MS} — four times what the page is allowed —
     * so it cannot paper over a slow or wrong document. A test whose page work
     * genuinely misbehaves still fails, with the in-page watchdog's message.
     */
    private async run(job: PageJob): Promise<unknown> {
        let lastError: unknown;

        for (let attempt = 0; attempt < 2; attempt++) {
            const browser = await this.ready();

            const execution = browser.execute(
                async (theJob: PageJob) =>
                    new Promise(async (resolve) => {
                        window.setTimeout(
                            () =>
                                resolve(
                                    "" +
                                        new Error(
                                            "Took too long to execute script",
                                        ),
                                ),
                            5000,
                        );
                        try {
                            if (theJob.kind === "convertMultiple") {
                                // @ts-ignore
                                const converter = new DoenetMLToPretext();
                                resolve(
                                    await converter.convertMultiple(
                                        theJob.sources,
                                    ),
                                );
                            } else {
                                // @ts-ignore
                                const dast = await doenetMLToPretext(
                                    theJob.source,
                                    { fragment: theJob.fragment },
                                );
                                resolve(dast);
                            }
                        } catch (e) {
                            resolve("" + e);
                        }
                    }),
                job,
            );
            // The race below may walk away from this promise, and an abandoned
            // rejection is an unhandled one. Claim it here rather than letting
            // the session teardown surface as a process-level failure.
            execution.catch(() => {});

            let timer: ReturnType<typeof setTimeout> | undefined;
            const watchdog = new Promise<typeof WEDGED>((resolve) => {
                timer = setTimeout(() => resolve(WEDGED), SESSION_BUDGET_MS);
            });

            let result: unknown;
            try {
                result = await Promise.race([execution, watchdog]);
            } finally {
                clearTimeout(timer);
            }

            if (result !== WEDGED) {
                return result;
            }

            lastError = new Error(
                `WebDriver did not answer within ${SESSION_BUDGET_MS} ms, though the page had only ${PAGE_BUDGET_MS} ms to work; discarding the session.`,
            );
            // `deleteSession` on a wedged session can wedge too. Drop the
            // handle either way so `ready()` builds a new one.
            await this.close().catch(() => {});
            this.browser = undefined;
            this._initPromise();
        }

        throw lastError;
    }

    /**
     * Create a PreTeXt document from DoenetML. This document includes a root `<pretext>` tag.
     *
     * If you only want a fragment of a PreTeXt document (e.g. without the root `<pretext>` tag), use `processToFlatDastAsFragment` instead.
     */
    async processToFlatDast(input: string): Promise<FlatDastRoot> {
        return (await this.run({
            kind: "convert",
            source: input,
            fragment: false,
        })) as FlatDastRoot;
    }
    /**
     * Create a fragment of a PreTeXt document from DoenetML. The output will not be a complete PreTeXt document,
     * but should be suitable for embedding inside a larger PreTeXt document.
     */
    async processToFlatDastAsFragment(input: string): Promise<FlatDastRoot> {
        return (await this.run({
            kind: "convert",
            source: input,
            fragment: true,
        })) as FlatDastRoot;
    }

    /**
     * Convert multiple DoenetML fragments via doenetMLToPretextInstance.convertMultiple.
     * Each fragment is converted in fragment mode and should have unique xml:id's.
     */
    async processMultipleFragmentsToFlatDast(
        inputs: string[],
    ): Promise<string[]> {
        return (await this.run({
            kind: "convertMultiple",
            sources: inputs,
        })) as string[];
    }
}
