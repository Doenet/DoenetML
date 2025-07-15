/** fd
 * This file exports an object that can be used in tests. It spawns a headless browser and
 * and loads the doenet core worker into that browser.
 */
import { remote } from "webdriverio";
import type { FlatDastRoot } from "../../../doenetml-worker/dist";
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
                    browserName: "firefox",
                    "goog:chromeOptions": {
                        args: ["headless", "disable-gpu"],
                    },
                    "moz:firefoxOptions": {
                        args: ["-headless"],
                    },
                },
                logLevel: "error",
            });
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
        } catch (e) {
            throw e;
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
    async processToFatDast(input: string): Promise<FlatDastRoot> {
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
                        const dast = await doenetMLToPretext(source);
                        resolve(dast);
                    } catch (e) {
                        resolve("" + e);
                    }
                }),
            input,
        );

        return result as FlatDastRoot;
    }
}
