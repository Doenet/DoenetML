/** fd
 * This file exports an object that can be used in tests. It spawns a headless browser and
 * and loads the doenet core worker into that browser.
 */
import { remote } from "webdriverio";
import type { FlatDastRoot } from "../../../doenetml-worker-rust/dist";
// @ts-ignore
import convertScript from "./dist/dast-to-flat-dast/index.js?raw";

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
                },
                logLevel: "error",
            });
            // Load in the web worker script
            await this.browser.execute((scriptContent) => {
                const scriptElement = document.createElement("script");
                scriptElement.type = "module";
                scriptElement.textContent = scriptContent;
                document.head.appendChild(scriptElement);
            }, convertScript);
        } catch (e) {
            throw e;
        } finally {
            this.initRunning = false;
            this.initRunningPromiseResolve();
        }
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
        const result = await this.browser.executeAsync(async (source, done) => {
            window.setTimeout(() => {
                done("" + new Error("Took too long to execute script"));
            }, 5000);
            try {
                // @ts-ignore
                const dast = await getFlatDast(source);
                done(dast);
            } catch (e) {
                done("" + e);
            }
        }, input);

        return result as FlatDastRoot;
    }
}
