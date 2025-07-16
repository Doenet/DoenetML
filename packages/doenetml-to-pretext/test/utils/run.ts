/**
 * This file (compiles to a file that) can be executed by node. It spawns a headless browser with core loaded in.
 * You can then ask core to do certain processing tasks and get the result back.
 */
import fs from "node:fs";
import yargs from "yargs";
import { remote } from "webdriverio";
// @ts-ignore
import convertScript from "./dist/dast-to-flat-dast/index.js?raw";

// Parse command-line arguments with yargs
const argv = yargs(process.argv.slice(2))
    .usage(`Usage: $0 -i '<document>My DoenetML</document>'`)
    .option("input", {
        alias: "i",
        description: "Input for toDast function",
        type: "string",
    })
    .option("fileInput", {
        alias: "f",
        description: "Read input from a file",
        type: "string",
    })
    .option("strip-position", {
        description: "Strip position data from the DAST tree",
        type: "boolean",
    }).argv;

if (argv.input == null && argv.fileInput == null) {
    throw new Error("Must provide an input via -i or -f");
}
const input: string = argv.input ?? fs.readFileSync(argv.fileInput, "utf8");

// Do the actual processing
// We run web worker in the browser via webdriverio so that we get full compatibility
(async () => {
    const browser = await remote({
        capabilities: {
            browserName: "chrome",
            "goog:chromeOptions": {
                args: ["headless", "disable-gpu"],
            },
        },
        logLevel: "error",
    });
    await browser.execute((scriptContent) => {
        const scriptElement = document.createElement("script");
        scriptElement.type = "module";
        scriptElement.textContent = scriptContent;
        document.head.appendChild(scriptElement);
    }, convertScript as string);
    const result = await browser.executeAsync(async (source, done) => {
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

    await browser.deleteSession();

    console.log(JSON.stringify(result));
})();
