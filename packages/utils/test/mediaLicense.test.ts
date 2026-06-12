import { describe, expect, it } from "vitest";
import {
    mediaLicenses,
    getMediaLicenseInfo,
    getMediaLicenseDisplay,
    creativeCommonsVersions,
    defaultCreativeCommonsVersion,
} from "../src/components/mediaLicense";

describe("media licenses", () => {
    it("looks up a license case-insensitively", () => {
        const upper = getMediaLicenseInfo("CC-BY-SA");
        const lower = getMediaLicenseInfo("cc-by-sa");
        expect(upper).toBeDefined();
        expect(lower).toBe(upper);
        expect(upper?.name).toBe("Creative Commons Attribution-ShareAlike");
    });

    it("returns undefined for an unknown code", () => {
        expect(getMediaLicenseInfo("not-a-license")).toBeUndefined();
    });

    it("builds versioned URLs for Creative Commons licenses", () => {
        const ccBySa = getMediaLicenseInfo("CC-BY-SA");
        expect(ccBySa?.kind).toBe("creative-commons");
        expect(ccBySa?.url("3.0")).toBe(
            "https://creativecommons.org/licenses/by-sa/3.0/",
        );
        // defaults to the default version when none is given
        expect(ccBySa?.url()).toBe(
            `https://creativecommons.org/licenses/by-sa/${defaultCreativeCommonsVersion}/`,
        );
    });

    it("ignores the version for non-Creative-Commons licenses", () => {
        const mit = getMediaLicenseInfo("MIT");
        expect(mit?.kind).toBe("license");
        expect(mit?.url("1.0")).toBe("https://opensource.org/license/mit");
        expect(mit?.url("4.0")).toBe("https://opensource.org/license/mit");
    });

    it("classifies CC0 and the Public Domain Mark as public domain", () => {
        expect(getMediaLicenseInfo("CC0")?.kind).toBe("public-domain");
        expect(getMediaLicenseInfo("PDM")?.kind).toBe("public-domain");
    });

    it("treats CC0 and the Public Domain Mark as version-independent", () => {
        expect(getMediaLicenseInfo("CC0")?.url()).toBe(
            "https://creativecommons.org/publicdomain/zero/1.0/",
        );
        expect(getMediaLicenseInfo("PDM")?.url()).toBe(
            "https://creativecommons.org/publicdomain/mark/1.0/",
        );
    });

    it("exposes unique codes with names and descriptions for building pickers", () => {
        const codes = mediaLicenses.map((license) => license.code);
        expect(new Set(codes).size).toBe(codes.length);
        for (const license of mediaLicenses) {
            expect(license.name.length).toBeGreaterThan(0);
            expect(license.description.length).toBeGreaterThan(0);
        }
    });

    it("lists Creative Commons versions oldest-to-newest with 4.0 as default", () => {
        expect(creativeCommonsVersions).toEqual([
            "1.0",
            "2.0",
            "2.5",
            "3.0",
            "4.0",
        ]);
        expect(defaultCreativeCommonsVersion).toBe("4.0");
    });

    describe("getMediaLicenseDisplay", () => {
        it("appends the version to a Creative Commons label", () => {
            const display = getMediaLicenseDisplay("CC-BY-SA", "4.0");
            expect(display).toEqual({
                kind: "creative-commons",
                label: "Creative Commons Attribution-ShareAlike 4.0",
                url: "https://creativecommons.org/licenses/by-sa/4.0/",
            });
        });

        it("uses the default version in both label and URL when version is omitted", () => {
            const display = getMediaLicenseDisplay("CC-BY-SA");
            expect(display).toEqual({
                kind: "creative-commons",
                label: "Creative Commons Attribution-ShareAlike 4.0",
                url: "https://creativecommons.org/licenses/by-sa/4.0/",
            });
        });

        it("does not append a version to a non-Creative-Commons label", () => {
            expect(getMediaLicenseDisplay("MIT", "4.0")).toEqual({
                kind: "license",
                label: "MIT License",
                url: "https://opensource.org/license/mit",
            });
        });

        it("marks public-domain dedications", () => {
            const display = getMediaLicenseDisplay("CC0");
            expect(display?.kind).toBe("public-domain");
            expect(display?.label).toBe("CC0 1.0 Public Domain Dedication");
        });

        it("returns undefined for an unknown code", () => {
            expect(getMediaLicenseDisplay("not-a-license")).toBeUndefined();
        });
    });
});
