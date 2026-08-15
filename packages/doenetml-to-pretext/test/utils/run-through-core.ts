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
 * no longer answering at all, which is how `pretext-export.test.ts` failed
 * three times on this branch, always in the last tests of the file.
 *
 * What was actually wrong was upstream of WebDriver: every conversion leaked
 * its core worker, so one page accumulated ~50 of them. Measured across the
 * file, Chrome grew by 7.0 GB and was still climbing at the last test; with
 * the leak fixed the same measurement is 1.9 GB and plateaus. The renderer ran
 * the runner out of memory and stopped servicing BiDi — the run that prompted
 * this note reported it as `Command network.continueRequest ... timed out`.
 * `DoenetMLToPretext.dispose` fixes that: capped at 6 GB with
 * `systemd-run -p MemoryMax=6G`, the leaking build never finished at all while
 * the fixed one passes in ~66 s. On CI the same file went from 166,595 ms with
 * two failures to ~52,000 ms with none.
 *
 * This budget stays as the net underneath, because a session that has stopped
 * answering must not be waited on: it does not fail, it hangs, and a hang
 * spreads to every test after it. Blowing this budget means throwing the
 * session away rather than waiting on it.
 */
const SESSION_BUDGET_MS = 20000;

/**
 * How long {@link RunThroughCore.close} waits for a polite `deleteSession`
 * before walking away from it. Comfortably inside vitest's 10 s `afterAll`
 * hook timeout, so a session that has stopped answering cannot fail the hook.
 */
const CLOSE_BUDGET_MS = 5000;

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
    /**
     * Give the session back, without ever waiting on it indefinitely.
     *
     * `deleteSession` is itself a WebDriver command, so on a session that has
     * stopped answering it does not answer either: it neither resolves nor
     * rejects. Awaiting it bare — which is what this used to do — turns one
     * wedged round trip into a hang that outlives the test that caused it, so
     * the *next* test times out too and `afterAll` times out after that. That
     * is exactly the three-failure shape seen in
     * https://github.com/Doenet/DoenetML/actions/runs/31852722677.
     *
     * So: drop the handle first, then give the teardown a bounded chance to be
     * polite. Either way the caller gets control back and {@link ready} builds
     * a fresh session.
     */
    async close() {
        const browser = this.browser;
        if (!browser) {
            return;
        }
        this.browser = undefined;
        this._initPromise();

        let timer: ReturnType<typeof setTimeout> | undefined;
        try {
            await Promise.race([
                // Swallowing the rejection is what keeps a failed teardown
                // from becoming an unhandled rejection after the race has
                // walked away, but say so rather than losing it silently.
                browser.deleteSession().catch((error) => {
                    console.warn(`Could not end the browser session: ${error}`);
                }),
                new Promise<void>((resolve) => {
                    timer = setTimeout(resolve, CLOSE_BUDGET_MS);
                }),
            ]);
        } finally {
            clearTimeout(timer);
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
                                try {
                                    resolve(
                                        await converter.convertMultiple(
                                            theJob.sources,
                                        ),
                                    );
                                } finally {
                                    // One core worker per converter, and this
                                    // page outlives ~50 of them; see
                                    // `DoenetMLToPretext.dispose`.
                                    converter.dispose();
                                }
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
            // `close()` drops the handle before it waits, and bounds the wait,
            // so this both returns and leaves `ready()` able to build a new
            // session.
            await this.close().catch(() => {});
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
