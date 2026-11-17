import { describe, expect, it } from "vitest";
import { pageUrlOn, switchTargets } from "../components/version-switcher";

describe("pageUrlOn", () => {
    it("maps a page onto the root site and onto a sub-path site", () => {
        expect(pageUrlOn("", "/reference/math")).toBe("/reference/math");
        expect(pageUrlOn("/dev", "/reference/math")).toBe(
            "/dev/reference/math",
        );
    });

    it("maps the home page", () => {
        expect(pageUrlOn("", "/")).toBe("/");
        expect(pageUrlOn("/dev", "/")).toBe("/dev/");
    });

    it("drops a trailing slash", () => {
        expect(pageUrlOn("/dev", "/reference/math/")).toBe(
            "/dev/reference/math",
        );
    });
});

describe("switchTargets", () => {
    it("keeps the page, with no query or hash", () => {
        expect(switchTargets("/dev", "/reference/math")).toEqual({
            url: "/dev/reference/math",
            homeUrl: "/dev/",
        });
        expect(switchTargets("", "/")).toEqual({ url: "/", homeUrl: "/" });
    });

    it("keeps the query and hash", () => {
        expect(switchTargets("/dev", "/reference/math?q=a#h").url).toBe(
            "/dev/reference/math?q=a#h",
        );
        expect(switchTargets("", "/reference/math#h").url).toBe(
            "/reference/math#h",
        );
        expect(switchTargets("", "/?q=a").url).toBe("/?q=a");
    });

    it("keeps a query containing `?` and a hash containing `#` verbatim", () => {
        expect(switchTargets("/dev", "/reference/math?q=a?b#h").url).toBe(
            "/dev/reference/math?q=a?b#h",
        );
        expect(switchTargets("/dev", "/reference/math#a#b").url).toBe(
            "/dev/reference/math#a#b",
        );
        expect(switchTargets("", "/dev-page/?q=a/").url).toBe("/dev-page?q=a/");
    });
});
