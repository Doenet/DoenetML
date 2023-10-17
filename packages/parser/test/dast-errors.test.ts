import { describe, expect, it } from "vitest";
import { lezerToDast } from "../src/lezer-to-dast";
import util from "util";
import { extractDastErrors } from "../src/extract-dast-errors";

const origLog = console.log;
console.log = (...args) => {
    origLog(...args.map((x) => util.inspect(x, false, 10, true)));
};

describe("DAST", async () => {
    it("Shows error for incomplete XML tag", () => {
        let source: string;
        let dast: ReturnType<typeof lezerToDast>;

        source = `<a`;
        dast = lezerToDast(source);
        expect(extractDastErrors(dast)).toHaveLength(1);

        source = `<`;
        dast = lezerToDast(source);
        expect(extractDastErrors(dast)).toHaveLength(1);

        source = `<a><b>`;
        dast = lezerToDast(source);
        expect(extractDastErrors(dast)).toHaveLength(2);

        source = `<a!b`;
        dast = lezerToDast(source);
        expect(extractDastErrors(dast)).toHaveLength(1);

        source = `<-/>`;
        dast = lezerToDast(source);
        expect(extractDastErrors(dast)).toHaveLength(1);

        source = `<x " />`;
        dast = lezerToDast(source);
        expect(extractDastErrors(dast)).toHaveLength(1);
    });

    it("Shows error for incomplete XML tag that is a child of another element", () => {
        let source: string;
        let dast: ReturnType<typeof lezerToDast>;

        source = `<x><a></x>`;
        dast = lezerToDast(source);
        expect(extractDastErrors(dast)).toHaveLength(1);
    });

    it("Shows error for incomplete XML closing tag", () => {
        let source: string;
        let dast: ReturnType<typeof lezerToDast>;

        source = `<x></x `;
        dast = lezerToDast(source);
        expect(extractDastErrors(dast)).toHaveLength(1);
        expect(extractDastErrors(dast)[0].message).toMatchInlineSnapshot(
            '"Invalid DoenetML: Tag `</x ` was not closed (a `>` appears to be missing)."',
        );

        source = `<a><x></x </a>`;
        dast = lezerToDast(source);
        expect(extractDastErrors(dast)).toHaveLength(1);
        expect(extractDastErrors(dast)[0].message).toMatchInlineSnapshot(
            '"Invalid DoenetML: Tag `</x ` was not closed (a `>` appears to be missing)."',
        );
    });

    it("Unmatched and incomplete XML closing tags prioritize incomplete error", () => {
        let source: string;
        let dast: ReturnType<typeof lezerToDast>;

        source = `</x `;
        dast = lezerToDast(source);
        expect(extractDastErrors(dast)).toHaveLength(1);
        expect(extractDastErrors(dast)[0].message).toMatchInlineSnapshot(
            '"Invalid DoenetML: Tag `</x ` was not closed (a `>` appears to be missing)."',
        );

        source = `<a></x </a>`;
        dast = lezerToDast(source);
        expect(extractDastErrors(dast)).toHaveLength(1);
        expect(extractDastErrors(dast)[0].message).toMatchInlineSnapshot(
            '"Invalid DoenetML: Tag `</x ` was not closed (a `>` appears to be missing)."',
        );
    });

    it("Errors for missing tags are shown at the location of the starting tag", () => {
        let source: string;
        let dast: ReturnType<typeof lezerToDast>;

        source = `<x   `;
        dast = lezerToDast(source);
        expect(extractDastErrors(dast)[0].position).toMatchObject({
            start: {
                offset: 0,
            },
            end: {
                offset: 2,
            },
        });

        source = `<x z="">   `;
        dast = lezerToDast(source);
        expect(extractDastErrors(dast)[0].position).toMatchObject({
            start: {
                offset: 0,
            },
            end: {
                offset: 8,
            },
        });

        source = `</x>   `;
        dast = lezerToDast(source);
        expect(extractDastErrors(dast)[0].position).toMatchObject({
            start: {
                offset: 0,
            },
            end: {
                offset: 4,
            },
        });

        source = `</x   `;
        dast = lezerToDast(source);
        expect(extractDastErrors(dast)[0].position).toMatchObject({
            start: {
                offset: 0,
            },
            end: {
                offset: 3,
            },
        });
    });
});
