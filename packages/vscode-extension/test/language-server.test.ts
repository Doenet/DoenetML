import { describe, expect, it } from "vitest";
// Required to use a worker inside a test
import "@vitest/web-worker";
import util from "util";

const origLog = console.log;
console.log = (...args) => {
    origLog(...args.map((x) => util.inspect(x, false, 10, true)));
};

describe("Doenet vscode extension", async () => {
    it("empty test", async () => {});
});
