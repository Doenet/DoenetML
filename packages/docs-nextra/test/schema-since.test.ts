/**
 * Covers the rules that decide what a documented item says about its age, in
 * `scripts/schema-since.ts`. They are checked against synthetic indexes rather
 * than the real tags, because their whole point is to *drop* markers and a
 * regression would show up as silence on a page rather than as a wrong version.
 *
 * The suppression rule is the one that keeps the docs readable: without it
 * `<chart>`, which arrived in 0.7.27 carrying 70 keys, would badge each of its
 * 30 attributes and 39 properties instead of reading as one new component.
 */
import { describe, expect, it } from "vitest";
import { UNRELEASED, type SchemaHistory } from "../scripts/schema-history-keys";
import { schemaSince } from "../scripts/schema-since";

/** An index over `versions` holding exactly the given `key: version` pairs. */
function history(
    versions: string[],
    since: Record<string, string>,
    removedIn: Record<string, string> = {},
): SchemaHistory {
    return {
        latestReleasedVersion: versions[versions.length - 1],
        versions,
        since,
        removedIn,
    };
}

const VERSIONS = ["0.7.0", "0.7.10", "0.7.27"];

describe("schemaSince", () => {
    it("says nothing about an element present in the oldest release covered", () => {
        const since = schemaSince(history(VERSIONS, { "el:point": "0.7.0" }));
        expect(since.element("point")).toBeUndefined();
    });

    it("names the release a later element arrived in", () => {
        const since = schemaSince(history(VERSIONS, { "el:chart": "0.7.27" }));
        expect(since.element("chart")).toBe("0.7.27");
    });

    it("calls an element the index has never seen unreleased", () => {
        const since = schemaSince(history(VERSIONS, {}));
        expect(since.element("newThing")).toBe(UNRELEASED);
    });

    it("suppresses members that arrived with their element", () => {
        const since = schemaSince(
            history(VERSIONS, {
                "el:chart": "0.7.27",
                "at:chart.type": "0.7.27",
                "pr:chart.numSeries": "0.7.27",
            }),
        );
        expect(since.element("chart")).toBe("0.7.27");
        expect(since.attribute("chart", "type")).toBeUndefined();
        expect(since.property("chart", "numSeries")).toBeUndefined();
    });

    it("marks members added to an element that already existed", () => {
        const since = schemaSince(
            history(VERSIONS, {
                "el:section": "0.7.0",
                "at:section.boxed": "0.7.10",
                "pr:section.level": "0.7.27",
            }),
        );
        expect(since.element("section")).toBeUndefined();
        expect(since.attribute("section", "boxed")).toBe("0.7.10");
        expect(since.property("section", "level")).toBe("0.7.27");
    });

    it("says nothing about a member as old as its old element", () => {
        const since = schemaSince(
            history(VERSIONS, {
                "el:section": "0.7.0",
                "at:section.hide": "0.7.0",
            }),
        );
        expect(since.attribute("section", "hide")).toBeUndefined();
    });

    it("marks an unreleased member of a released element", () => {
        const since = schemaSince(
            history(VERSIONS, { "el:selectRandomNumbers": "0.7.0" }),
        );
        expect(since.attribute("selectRandomNumbers", "logMean")).toBe(
            UNRELEASED,
        );
    });

    it("suppresses the members of an unreleased element", () => {
        // A component still in development would otherwise badge every one of
        // its attributes as well as itself.
        const since = schemaSince(history(VERSIONS, {}));
        expect(since.element("newThing")).toBe(UNRELEASED);
        expect(since.attribute("newThing", "size")).toBeUndefined();
        expect(since.property("newThing", "value")).toBeUndefined();
    });

    it("calls a member that came back after the newest release unreleased", () => {
        // Present through 0.7.0, gone by 0.7.10, and back in the working tree.
        // Read from `since` alone it looks as old as its element, which the
        // suppression rule would then silence — leaving a reader on 0.7.27 no
        // sign that the attribute is one they do not have.
        const since = schemaSince(
            history(
                VERSIONS,
                { "el:section": "0.7.0", "at:section.boxed": "0.7.0" },
                { "at:section.boxed": "0.7.10" },
            ),
        );
        expect(since.attribute("section", "boxed")).toBe(UNRELEASED);
    });

    it("calls an element that came back after the newest release unreleased", () => {
        const since = schemaSince(
            history(VERSIONS, { "el:gone": "0.7.0" }, { "el:gone": "0.7.10" }),
        );
        expect(since.element("gone")).toBe(UNRELEASED);
        // And its members fall back under the element's badge, as for any
        // other element the released schema does not have.
        expect(since.attribute("gone", "size")).toBeUndefined();
    });

    it("suppresses the values an attribute arrived with", () => {
        // A new enumerated attribute should not repeat itself once per keyword
        // in its value table.
        const since = schemaSince(
            history(VERSIONS, {
                "el:chart": "0.7.27",
                "at:chart.type": "0.7.27",
                "va:chart.type.bar": "0.7.27",
            }),
        );
        expect(since.element("chart")).toBe("0.7.27");
        expect(since.attribute("chart", "type")).toBeUndefined();
        expect(since.value("chart", "type", "bar")).toBeUndefined();
    });

    it("marks a value added to an attribute that already existed", () => {
        const since = schemaSince(
            history(VERSIONS, {
                "el:selectRandomNumbers": "0.7.0",
                "at:selectRandomNumbers.type": "0.7.0",
                "va:selectRandomNumbers.type.uniform": "0.7.0",
                "va:selectRandomNumbers.type.poisson": "0.7.10",
            }),
        );
        expect(since.attribute("selectRandomNumbers", "type")).toBeUndefined();
        expect(
            since.value("selectRandomNumbers", "type", "uniform"),
        ).toBeUndefined();
        expect(since.value("selectRandomNumbers", "type", "poisson")).toBe(
            "0.7.10",
        );
    });

    it("marks an unreleased value of a released attribute", () => {
        // The case the value rule exists for: `type` is as old as the schema,
        // so it carries no badge, and without this its table would list
        // `logNormal` as though an author could write it.
        const since = schemaSince(
            history(VERSIONS, {
                "el:selectRandomNumbers": "0.7.0",
                "at:selectRandomNumbers.type": "0.7.0",
            }),
        );
        expect(since.value("selectRandomNumbers", "type", "logNormal")).toBe(
            UNRELEASED,
        );
    });

    it("suppresses the values of an unreleased attribute", () => {
        const since = schemaSince(history(VERSIONS, { "el:point": "0.7.0" }));
        expect(since.attribute("point", "newThing")).toBe(UNRELEASED);
        expect(since.value("point", "newThing", "someValue")).toBeUndefined();
    });

    it("marks a value of an attribute suppressed under a new element", () => {
        // `attribute()` returns undefined here, so the value rule has to
        // compare against the attribute's arrival rather than against its
        // badge, or every value of a new element's attributes comes back.
        const since = schemaSince(
            history(VERSIONS, {
                "el:chart": "0.7.27",
                "at:chart.type": "0.7.27",
                "va:chart.type.bar": "0.7.27",
                "va:chart.type.violin": "0.7.10",
            }),
        );
        expect(since.attribute("chart", "type")).toBeUndefined();
        expect(since.value("chart", "type", "bar")).toBeUndefined();
        expect(since.value("chart", "type", "violin")).toBe("0.7.10");
    });

    it("dates a value that came back after the newest release as unreleased", () => {
        const since = schemaSince({
            latestReleasedVersion: "0.7.27",
            versions: VERSIONS,
            since: {
                "el:point": "0.7.0",
                "at:point.styleNumber": "0.7.0",
                "va:point.styleNumber.auto": "0.7.0",
            },
            removedIn: { "va:point.styleNumber.auto": "0.7.10" },
        });
        expect(since.value("point", "styleNumber", "auto")).toBe(UNRELEASED);
    });

    it("marks a member reintroduced after its element settled", () => {
        // `statement.colorAnswersSeparately` replaced a longer spelling in
        // 0.7.21; the new name has to carry its own version.
        const since = schemaSince(
            history(VERSIONS, {
                "el:statement": "0.7.0",
                "at:statement.colorAnswersSeparately": "0.7.27",
            }),
        );
        expect(since.attribute("statement", "colorAnswersSeparately")).toBe(
            "0.7.27",
        );
    });
});
