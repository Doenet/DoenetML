import { describe, expect, it } from "vitest";
import { lezerToDast } from "../src/lezer-to-dast";
import { toXml } from "../src/dast-to-xml/dast-util-to-xml";
import util from "util";
import { DastRoot } from "../src/types";
import { detectVersionFromDoenetML } from "../src/detect-version";

const origLog = console.log;
console.log = (...args) => {
    origLog(...args.map((x) => util.inspect(x, false, 10, true)));
};

describe("detect version from namespace", () => {
    let source: string;
    let version: ReturnType<typeof detectVersionFromDoenetML>;
    let versionString: string;

    it("can detect doenetml version from namespace on document tag", () => {
        versionString = "0.7.0-alpha44";
        source = `<document xmlns="https://doenet.org/spec/doenetml/v${versionString}"><p>content</p></document>`;
        version = detectVersionFromDoenetML(source);

        expect(version).toMatchObject({
            version: versionString,
        });
        expect(
            source.slice(version?.position.begin, version?.position.end),
        ).toEqual(versionString);

        source = `<document \nother-attr="https://doenet.org/spec/doenetml/v10"  xmlns="https://doenet.org/spec/doenetml/v${versionString}"><p>content</p></document>`;
        version = detectVersionFromDoenetML(source);

        expect(version).toMatchObject({
            version: versionString,
        });
        expect(
            source.slice(version?.position.begin, version?.position.end),
        ).toEqual(versionString);
    });
    it("returns null on invalid or missing versions", () => {
        versionString = "0.7.0-alpha44";
        source = `<document xmlns="https://doenet.org/spec/doenetml/x${versionString}"><p>content</p></document>`;
        version = detectVersionFromDoenetML(source);

        expect(version).toEqual(null);

        source = `<document xmlnsXXX="https://doenet.org/spec/doenetml/v${versionString}"><p>content</p></document>`;
        version = detectVersionFromDoenetML(source);

        expect(version).toEqual(null);

        source = `<document><p>content</p></document>`;
        version = detectVersionFromDoenetML(source);

        expect(version).toEqual(null);
    });
});
