import { describe, expect, it } from "vitest";
import { lezerToDast } from "../src/lezer-to-dast";
import { toXml } from "../src/dast-to-xml/dast-util-to-xml";
import util from "util";
import { DastRoot } from "../src/types";

const origLog = console.log;
console.log = (...args) => {
    origLog(...args.map((x) => util.inspect(x, false, 10, true)));
};

describe("parser", () => {
    let source: string;
    let dast: DastRoot;
    let xml: string;

    it("can print basic doenet to xml", () => {
        source = `abc`;
        dast = lezerToDast(source);
        xml = toXml(dast);
        expect(xml).toEqual("abc");

        source = `<p>abc</p>`;
        dast = lezerToDast(source);
        xml = toXml(dast);
        expect(xml).toEqual("<p>abc</p>");

        source = `<foo />`;
        dast = lezerToDast(source);
        xml = toXml(dast);
        expect(xml).toEqual("<foo />");
    });

    it("can print macros", () => {
        source = `$foo.bar`;
        dast = lezerToDast(source);
        xml = toXml(dast);
        expect(xml).toEqual("$foo.bar");
    });

    it("can print function macros", () => {
        source = `$$foo(x)`;
        dast = lezerToDast(source);
        xml = toXml(dast);
        expect(xml).toEqual("$$foo(x)");
    });

    it("keeps parens on a macro whose following text would be absorbed into it", () => {
        // `$x` printed directly before `_0` would re-parse as a macro named `x_0`,
        // so the macro has to be printed in its `$(...)` form instead.
        for (const src of [`$(x)_0`, `$(x)y`, `$(x1)1`, `$(foo.bar)_1`]) {
            dast = lezerToDast(src);
            xml = toXml(dast);
            expect(xml).toEqual(src);
        }

        // A function macro needs the same treatment.
        dast = lezerToDast(`$$(f)(1)_0`);
        expect(toXml(dast)).toEqual("$$(f)(1)_0");

        // ...but a macro that is not followed by a name character stays unwrapped.
        for (const src of [`$x 0`, `$x-0`, `<p>$x</p>`, `$x!`]) {
            dast = lezerToDast(src);
            expect(toXml(dast)).toEqual(src);
        }
    });
});
