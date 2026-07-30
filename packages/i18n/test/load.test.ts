import { afterEach, describe, expect, it, vi } from "vitest";

import { BUNDLED_LOCALES } from "../src/bundled";
import { DEFAULT_LOCALE } from "../src/catalogs";
import {
    LAZY_LOCALE_LOADERS,
    fetchLocaleLoaders,
    loadLocaleResources,
    loadLocaleResourcesFor,
    type LocaleLoaders,
} from "../src/load";
import { SUPPORTED_LOCALES } from "../src/generated/supportedLocales";
import { CATALOG_NAMESPACES, WORKER_NAMESPACES } from "../src/namespaces";
import { createTranslator } from "../src/translator";

/**
 * The locales that are meant to be code-split: every catalog directory that is
 * not already inlined.
 *
 * Derived from the roster rather than written out, so these tests keep
 * covering the registry as translations are added.
 */
const LAZY_LOCALES = SUPPORTED_LOCALES.map((info) => info.locale)
    .filter((locale) => !BUNDLED_LOCALES.includes(locale))
    .sort();

/**
 * A loader map standing in for catalogs this repository does not ship, so the
 * negotiation and caching rules can be tested without depending on which
 * translations happen to exist.
 */
function stubLoaders(
    locales: readonly string[],
    onLoad?: (locale: string, namespaces: readonly string[]) => void,
): LocaleLoaders {
    const loaders: LocaleLoaders = {};
    for (const locale of locales) {
        loaders[locale] = async (namespaces) => {
            onLoad?.(locale, namespaces);
            return Object.fromEntries(
                namespaces.map((namespace) => [
                    namespace,
                    `stub-${locale}-${namespace} = ${locale}/${namespace}\n`,
                ]),
            );
        };
    }
    return loaders;
}

describe("the lazy loader registry", () => {
    it("offers exactly the locales that are not already inlined", () => {
        // An inlined locale left in the glob never gets its own chunk; an
        // unbundled one left out of it can never be loaded at all. `lint:i18n`
        // checks the same invariant against the glob's source text.
        expect(Object.keys(LAZY_LOCALE_LOADERS)).not.toContain(DEFAULT_LOCALE);
        expect(Object.keys(LAZY_LOCALE_LOADERS).sort()).toEqual(LAZY_LOCALES);
    });

    // Nothing is code-split while every translation is still inlined. These
    // start running on their own the first time a locale is added that isn't.
    const withLazyLocale = describe.skipIf(LAZY_LOCALES.length === 0);

    withLazyLocale("a code-split locale", () => {
        it("loads a catalog per namespace, each with something in it", async () => {
            const catalogs =
                await LAZY_LOCALE_LOADERS[LAZY_LOCALES[0]](CATALOG_NAMESPACES);
            expect(Object.keys(catalogs).sort()).toEqual(
                [...CATALOG_NAMESPACES].sort(),
            );
            for (const source of Object.values(catalogs)) {
                expect(source).toBeTruthy();
            }
        });

        it("loads only the namespaces the asking context renders", async () => {
            const catalogs =
                await LAZY_LOCALE_LOADERS[LAZY_LOCALES[0]](WORKER_NAMESPACES);
            expect(Object.keys(catalogs)).toEqual(["content"]);
        });
    });
});

describe("loadLocaleResources", () => {
    it("loads nothing for English, which is already inlined", async () => {
        await expect(loadLocaleResources("en")).resolves.toEqual({});
    });

    it("loads nothing for a blank or unset tag", async () => {
        await expect(loadLocaleResources("")).resolves.toEqual({});
        await expect(loadLocaleResources("   ")).resolves.toEqual({});
    });

    it("loads nothing for a bundled locale", async () => {
        const loaders = stubLoaders(BUNDLED_LOCALES);
        for (const locale of BUNDLED_LOCALES) {
            await expect(
                loadLocaleResources(locale, CATALOG_NAMESPACES, { loaders }),
            ).resolves.toEqual({});
        }
    });

    it("loads nothing for a locale nobody offers a catalog for", async () => {
        await expect(
            loadLocaleResources("qq", CATALOG_NAMESPACES, {
                loaders: stubLoaders(["fr"]),
            }),
        ).resolves.toEqual({});
    });

    it("keys the result by the tag that matched, not the tag asked for", async () => {
        const resources = await loadLocaleResources(
            "fr-CA",
            CATALOG_NAMESPACES,
            { loaders: stubLoaders(["fr"]) },
        );
        // `fr` is the key the fallback chain will look for once
        // `negotiateLocales` has had its say.
        expect(Object.keys(resources)).toEqual(["fr"]);
    });

    it("normalizes a hand-typed tag before negotiating it", async () => {
        const resources = await loadLocaleResources(
            "FR-ca",
            CATALOG_NAMESPACES,
            { loaders: stubLoaders(["fr"]) },
        );
        expect(Object.keys(resources)).toEqual(["fr"]);
    });

    it("prefers a locale already on hand over one it would have to fetch", async () => {
        const loaded: string[] = [];
        const loaders = stubLoaders(["fr"], (locale) => loaded.push(locale));
        await expect(
            loadLocaleResources("fr", CATALOG_NAMESPACES, {
                loaders,
                available: ["fr"],
            }),
        ).resolves.toEqual({});
        expect(loaded).toEqual([]);
    });

    it("returns a source the translator can resolve against", async () => {
        const resources = await loadLocaleResources("fr", CATALOG_NAMESPACES, {
            loaders: stubLoaders(["fr"]),
        });
        const t = createTranslator(["fr", "en"], resources);
        expect(t("stub-fr-chrome" as never, undefined, "fallback")).toBe(
            "fr/chrome",
        );
    });

    it("asks the loader only for the namespaces requested", async () => {
        let asked: readonly string[] = [];
        const loaders = stubLoaders(["fr"], (_locale, namespaces) => {
            asked = namespaces;
        });
        await loadLocaleResources("fr", WORKER_NAMESPACES, { loaders });
        expect(asked).toEqual(WORKER_NAMESPACES);
    });

    it("does not cache a custom loader map, which is the caller's object", async () => {
        let calls = 0;
        const loaders = stubLoaders(["fr"], () => {
            calls += 1;
        });
        await loadLocaleResources("fr", CATALOG_NAMESPACES, { loaders });
        await loadLocaleResources("fr", CATALOG_NAMESPACES, { loaders });
        expect(calls).toBe(2);
    });
});

describe("loadLocaleResourcesFor", () => {
    it("merges several tags into the one map localeResources takes", async () => {
        const resources = await loadLocaleResourcesFor(
            ["fr", "de"],
            CATALOG_NAMESPACES,
            { loaders: stubLoaders(["fr", "de"]) },
        );
        expect(Object.keys(resources).sort()).toEqual(["de", "fr"]);
    });

    it("ignores blanks, English, and repeats, so a caller can pass what it resolved", async () => {
        const loaded: string[] = [];
        const loaders = stubLoaders(["fr"], (locale) => loaded.push(locale));
        const resources = await loadLocaleResourcesFor(
            ["fr", "fr", "en", "", null, undefined],
            CATALOG_NAMESPACES,
            { loaders },
        );
        expect(Object.keys(resources)).toEqual(["fr"]);
        expect(loaded).toEqual(["fr"]);
    });
});

describe("fetchLocaleLoaders", () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("lays catalogs out as <base>/<locale>/<namespace>.ftl", async () => {
        const requested: string[] = [];
        vi.stubGlobal("fetch", async (url: URL) => {
            requested.push(url.toString());
            return { ok: true, text: async () => "key = value\n" };
        });

        const loaders = fetchLocaleLoaders("https://example.test/locales", [
            "fr",
        ]);
        await loaders["fr"](["chrome", "content"]);

        expect(requested.sort()).toEqual([
            "https://example.test/locales/fr/chrome.ftl",
            "https://example.test/locales/fr/content.ftl",
        ]);
    });

    it("extends a base that already ends in a slash rather than doubling it", async () => {
        const requested: string[] = [];
        vi.stubGlobal("fetch", async (url: URL) => {
            requested.push(url.toString());
            return { ok: true, text: async () => "" };
        });

        const loaders = fetchLocaleLoaders("https://example.test/locales/", [
            "fr",
        ]);
        await loaders["fr"](["chrome"]);

        expect(requested).toEqual([
            "https://example.test/locales/fr/chrome.ftl",
        ]);
    });

    it("never offers English, which is never fetched", () => {
        const loaders = fetchLocaleLoaders("https://example.test/locales", [
            "en",
            "fr",
        ]);
        expect(Object.keys(loaders)).toEqual(["fr"]);
    });

    it("treats a missing catalog as an untranslated namespace, not an error", async () => {
        vi.stubGlobal("fetch", async (url: URL) =>
            url.toString().endsWith("chrome.ftl")
                ? { ok: true, text: async () => "key = value\n" }
                : { ok: false, text: async () => "" },
        );

        const loaders = fetchLocaleLoaders("https://example.test/locales", [
            "fr",
        ]);
        await expect(loaders["fr"](["chrome", "content"])).resolves.toEqual({
            chrome: "key = value\n",
        });
    });

    it("does not throw on a base no URL can be resolved against", async () => {
        // `@doenet/doenetml-iframe` boots the standalone bundle from a Blob
        // URL, so `import.meta.url` there is `blob:` — opaque, and `new URL`
        // throws on it. Building the loaders happens at module scope, so a
        // throw here leaves the whole bundle unevaluated and every viewer on
        // the page blank. It has to degrade to English instead.
        vi.stubGlobal("fetch", async () => {
            throw new Error("should never be reached");
        });

        for (const base of [
            "blob:http://example.test/8f1c-uuid",
            "about:srcdoc",
        ]) {
            const loaders = fetchLocaleLoaders(base, ["fr"]);
            await expect(loaders["fr"](["chrome"])).resolves.toEqual({});
        }
    });

    it("treats a network failure the same way, since this runs during a paint", async () => {
        vi.stubGlobal("fetch", async () => {
            throw new Error("offline");
        });

        const loaders = fetchLocaleLoaders("https://example.test/locales", [
            "fr",
        ]);
        await expect(loaders["fr"](["chrome"])).resolves.toEqual({});
    });
});
