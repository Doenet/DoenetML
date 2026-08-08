import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { PtxCompiler } from "../src/index";
import { DoenetMLToPretext } from "@doenet/doenetml-to-pretext";

let compiler: PtxCompiler;
let converter: DoenetMLToPretext;

beforeAll(async () => {
    compiler = new PtxCompiler();
    console.log("compiler loaded");
    converter = new DoenetMLToPretext();
    console.log("converter loaded");
    await compiler.init();
    console.log("compiler initialized");
}, 300000);

afterAll(async () => {
    compiler = undefined as any;
    converter = undefined as any;
});

async function compile(source: string) {
    const pretext = await converter.convert(source, {
        fragment: false,
        throwOnError: false,
    });

    compiler.setMainPtx(pretext);
    return compiler.full_compile();
}

describe("PtxCompiler browser compile", () => {
    it("compiles non-graph content without errors", async () => {
        const html = await compile(`<p>Hello print compile</p>`);
        expect(html).toContain("<html");
    }, 300000);

    it("compiles graph content and inlines an svg container", async () => {
        const html = await compile(
            `<graph><point name="P" x="1" y="2" /></graph>`,
        );
        expect(html).toContain('<div class="svg">');
    }, 300000);
});
