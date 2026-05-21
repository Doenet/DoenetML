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
    /**
     * Create a PreTeXt document from DoenetML. This document includes a root `<pretext>` tag.
     *
     * If you only want a fragment of a PreTeXt document (e.g. without the root `<pretext>` tag), use `processToFlatDastAsFragment` instead.
     */
    async processToFlatDast(input: string): Promise<FlatDastRoot> {
        if (!this.browser) {
            await this.init();
        }
        await this.initRunningPromise;
        if (!this.browser) {
            throw new Error("Failed to initialize browser");
        }
        const result = await this.browser.execute(
            async (source) =>
                new Promise(async (resolve, reject) => {
                    window.setTimeout(() => {
                        resolve(
                            "" + new Error("Took too long to execute script"),
                        );
                    }, 5000);
                    try {
                        // @ts-ignore
                        const dast = await doenetMLToPretext(source, {
                            fragment: false,
                        });
                        resolve(dast);
                    } catch (e) {
                        resolve("" + e);
                    }
                }),
            input,
        );

        return result as FlatDastRoot;
    }
    /**
     * Create a fragment of a PreTeXt document from DoenetML. The output will not be a complete PreTeXt document,
     * but should be suitable for embedding inside a larger PreTeXt document.
     */
    async processToFlatDastAsFragment(input: string): Promise<FlatDastRoot> {
        if (!this.browser) {
            await this.init();
        }
        await this.initRunningPromise;
        if (!this.browser) {
            throw new Error("Failed to initialize browser");
        }
        const result = await this.browser.execute(
            async (source) =>
                new Promise(async (resolve, reject) => {
                    window.setTimeout(() => {
                        resolve(
                            "" + new Error("Took too long to execute script"),
                        );
                    }, 5000);
                    try {
                        // @ts-ignore
                        const dast = await doenetMLToPretext(source, {
                            fragment: true,
                        });
                        resolve(dast);
                    } catch (e) {
                        resolve("" + e);
                    }
                }),
            input,
        );

        return result as FlatDastRoot;
    }

    /**
     * Convert multiple DoenetML fragments via doenetMLToPretextInstance.convertMultiple.
     * Each fragment is converted in fragment mode and should have unique xml:id's.
     */
    async processMultipleFragmentsToFlatDast(
        inputs: string[],
    ): Promise<string[]> {
        if (!this.browser) {
            await this.init();
        }
        await this.initRunningPromise;
        if (!this.browser) {
            throw new Error("Failed to initialize browser");
        }
        const result = await this.browser.execute(
            async (sources: string[]) =>
                new Promise(async (resolve, reject) => {
                    window.setTimeout(() => {
                        resolve(
                            "" + new Error("Took too long to execute script"),
                        );
                    }, 5000);
                    try {
                        // @ts-ignore
                        const converter = new DoenetMLToPretext();
                        const results =
                            await converter.convertMultiple(sources);
                        resolve(results);
                    } catch (e) {
                        resolve("" + e);
                    }
                }),
            inputs,
        );

        return result as string[];
    }
}
