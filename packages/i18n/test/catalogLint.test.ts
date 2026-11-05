import { describe, expect, it } from "vitest";
import {
    parse,
    Resource,
    serialize,
    type Entry,
    type Message,
    type Pattern,
    type SelectExpression,
    type Variant,
} from "@fluent/syntax";

import {
    SUPPORTED_LOCALES_FILE,
    catalogParseErrors,
    countDiagnosticConstructions,
    extractKeys,
    listLocales,
    LOCALE_NAME_FALLBACKS,
    multilinePatterns,
    numberingSystemOverrides,
    readCatalog,
    remainingLiteralDiagnostics,
    symbolicVariantKeys,
    allowedPluralCategories,
    hasOwnPluralData,
    pluralVariantKeys,
    unselectablePluralCategories,
    renderMessageKeysModule,
    renderSupportedLocalesModule,
} from "../scripts/catalogUtils";
import { SUPPORTED_LOCALES } from "../src/generated/supportedLocales";
import { CATALOG_NAMESPACES } from "../src/namespaces";
import { DEFAULT_LOCALE } from "../src/catalogs";

describe("extractKeys", () => {
    it("reads message ids, attributes, and both together", () => {
        expect(
            extractKeys(`
plain = Value
attrs-only =
    .one = One
    .two = Two
both = Value
    .attr = Attr
`),
        ).toEqual([
            "plain",
            "attrs-only.one",
            "attrs-only.two",
            "both",
            "both.attr",
        ]);
    });

    it("skips terms, which no call site can address", () => {
        expect(extractKeys("-brand = Doenet\nuses = { -brand }")).toEqual([
            "uses",
        ]);
    });
});

describe("catalogParseErrors", () => {
    it("is empty for a valid catalog", () => {
        expect(catalogParseErrors("greeting = Hello")).toEqual([]);
    });

    it("reports a malformed entry that the runtime would silently drop", () => {
        // `@fluent/bundle` discards this as junk without complaining, which is
        // precisely why the lint parses with `@fluent/syntax` too.
        const source = "good = Hello\n= no identifier\n";
        expect(extractKeys(source)).toEqual(["good"]);

        const errors = catalogParseErrors(source);
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0]).toContain("line 2");
    });

    it("reports an id defined twice", () => {
        expect(
            catalogParseErrors("greeting = Hello\ngreeting = Hi\n").length,
        ).toBeGreaterThan(0);
    });
});

describe("numberingSystemOverrides", () => {
    it("catches a builtin that names a numbering system", () => {
        expect(
            numberingSystemOverrides(
                'ratio = contrast { NUMBER($ratio, numberingSystem: "beng") }',
            ),
        ).toEqual(['NUMBER() sets numberingSystem in "ratio"']);
        expect(
            numberingSystemOverrides(
                'when = { DATETIME($due, numberingSystem: "deva") }',
            ),
        ).toEqual(['DATETIME() sets numberingSystem in "when"']);
    });

    it("leaves the formatting options a catalog is allowed to set", () => {
        // The real pattern from `diagnostics.ftl`. Fraction digits are a
        // catalog's business; which script the digits are written in is not.
        expect(
            numberingSystemOverrides(
                "ratio = { NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1",
            ),
        ).toEqual([]);
    });

    it("reads the syntax rather than the text, so a comment may say the word", () => {
        // The group comments explaining the policy are the reason this is an
        // AST walk: a catalog has to be able to write down why it must not.
        expect(
            numberingSystemOverrides(
                "# Never pass numberingSystem here — see src/intl.ts.\ncount = { $count } items",
            ),
        ).toEqual([]);
    });

    it("descends into selects and attributes", () => {
        expect(
            numberingSystemOverrides(`
items =
    { $count ->
        [one] one item
       *[other] { NUMBER($count, numberingSystem: "mymr") } items
    }
    .label = { NUMBER($count, numberingSystem: "beng") }
`),
        ).toEqual([
            'NUMBER() sets numberingSystem in "items"',
            'NUMBER() sets numberingSystem in "items"',
        ]);
    });
});

describe("multilinePatterns", () => {
    it("catches a note indented under the attribute it explains", () => {
        // The bug this exists for. The `#` line is not a comment — Fluent
        // reads it as more of `.green`'s pattern, so a Hebrew document
        // describing a green square rendered the English note along with it.
        const found = multilinePatterns(`
color =
    .green = ירוק
    # «תכלת» does not inflect.
    .cyan = תכלת
`);
        expect(found).toHaveLength(1);
        expect(found[0]).toContain('"color"');
        expect(found[0]).toContain("indented comment");
    });

    it("catches a pattern wrapped across two lines", () => {
        expect(multilinePatterns("greeting =\n    Hello\n    there\n")).toEqual(
            ['"greeting" renders a newline (continues with "there")'],
        );
    });

    it("allows a comment above the message and a pattern on its own line", () => {
        expect(
            multilinePatterns("# A greeting.\ngreeting =\n    Hello there\n"),
        ).toEqual([]);
    });

    it("allows a select, whose own line breaks are structure rather than text", () => {
        // The shape every counted message uses: the variants sit on separate
        // lines but each variant's content is one line, so nothing renders a
        // break.
        expect(
            multilinePatterns(`
items =
    { $count ->
        [one] one item
       *[other] { $count } items
    }
`),
        ).toEqual([]);
    });

    it("catches a variant continued onto a further line", () => {
        expect(
            multilinePatterns(`
items =
    { $count ->
        [one] one
            item
       *[other] items
    }
`),
        ).toEqual(['"items" renders a newline (continues with "item")']);
    });
});

describe("renderMessageKeysModule", () => {
    it("emits `never` when there are no keys", async () => {
        const rendered = await renderMessageKeysModule([]);
        expect(rendered).toContain("export type MessageKey = never;");
    });

    it("emits a union and a matching list", async () => {
        const rendered = await renderMessageKeysModule([
            "greeting",
            "color.blue",
        ]);
        expect(rendered).toMatch(
            /export type MessageKey =[\s\S]*"greeting"[\s\S]*"color\.blue"/,
        );
        expect(rendered).toMatch(
            /MESSAGE_KEYS[\s\S]*"greeting"[\s\S]*"color\.blue"/,
        );
    });

    it("emits Prettier-formatted output so lint:i18n and prettier agree", async () => {
        const rendered = await renderMessageKeysModule(["greeting"]);
        const prettier = await import("prettier");
        expect(await prettier.check(rendered, { parser: "typescript" })).toBe(
            true,
        );
    });
});

describe("renderSupportedLocalesModule", () => {
    it("derives each locale's name in English and in itself", async () => {
        const rendered = await renderSupportedLocalesModule(["en", "es"]);
        expect(rendered).toContain('englishName: "Spanish"');
        expect(rendered).toContain('endonym: "español"');
        expect(rendered).toContain('label: "Spanish (español)"');
    });

    it("collapses the label when both names coincide", async () => {
        // English in English, and any tag `Intl` doesn't recognize, would
        // otherwise read as `English (English)` — which looks like a bug.
        const rendered = await renderSupportedLocalesModule(["en"]);
        expect(rendered).toContain('label: "English"');
        expect(rendered).not.toContain("English (English)");
    });

    it("names an unknown locale rather than throwing on it", async () => {
        // A locale directory can be added long before `Intl` (or this Node)
        // knows the tag, and before anyone has added a fallback name for it.
        // Codegen must not be what stops it landing: such a tag degrades to
        // the tag itself, which is usable and visibly a code rather than
        // ICU's "zz (QQ)", which reads like a name and is not one.
        const rendered = await renderSupportedLocalesModule(["en", "zz-QQ"]);
        expect(rendered).toContain('locale: "zz-QQ"');
        expect(rendered).toContain('label: "zz-QQ"');
    });

    it("fills a name in for a locale CLDR has none for", async () => {
        // ICU has no name for `dag` in either English or Dagbani, so without
        // the table it would be labelled "dag" — which tells a reader choosing
        // a `<document lang>` nothing. `LOCALE_NAME_FALLBACKS` supplies both.
        const rendered = await renderSupportedLocalesModule(["en", "dag"]);
        expect(rendered).toContain('label: "Dagbani (Dagbanli)"');
    });

    it("lets CLDR win over an entry for a locale CLDR knows", async () => {
        // The table fills gaps and never overrides. Proved by planting an
        // entry that would be visibly wrong if it were consulted, since the
        // real table is meant to hold no entry for a locale ICU knows — that
        // is the `holds no entry ICU no longer needs` test's job, and asserting
        // against the real table here would prove nothing about overriding.
        LOCALE_NAME_FALLBACKS.es = {
            englishName: "NOT-SPANISH",
            endonym: "NO-ES-ESPAÑOL",
        };
        try {
            const rendered = await renderSupportedLocalesModule(["en", "es"]);
            expect(rendered).toContain('label: "Spanish (español)"');
            expect(rendered).not.toContain("NOT-SPANISH");
            expect(rendered).not.toContain("NO-ES-ESPAÑOL");
        } finally {
            delete LOCALE_NAME_FALLBACKS.es;
        }
    });

    it("emits Prettier-formatted output so lint:i18n and prettier agree", async () => {
        // Checked under the repo's own config, which is what `prettier:check`
        // will hold the committed file to — the default 2-space width would
        // disagree with every line of it.
        const rendered = await renderSupportedLocalesModule(["en", "es"]);
        const prettier = await import("prettier");
        const config = await prettier.resolveConfig(SUPPORTED_LOCALES_FILE);
        expect(
            await prettier.check(rendered, {
                ...config,
                filepath: SUPPORTED_LOCALES_FILE,
                parser: "typescript",
            }),
        ).toBe(true);
    });
});

describe("LOCALE_NAME_FALLBACKS", () => {
    /**
     * The gap this table closes, held shut for the roster rather than for the
     * handful of entries that close it today. A future batch adding a language
     * CLDR has no data for fails here until someone supplies a name — which is
     * the whole point, since the alternative is a `<document lang>` autocomplete
     * that offers a reader "ktu" and expects them to know what it is.
     */
    it("leaves no locale labelled with its own code", () => {
        const bare = SUPPORTED_LOCALES.filter(
            (entry) => entry.label === entry.locale,
        ).map((entry) => entry.locale);
        expect(bare).toEqual([]);
    });

    /**
     * The other half: an entry ICU has since learned a name for is dead weight
     * that nothing would otherwise notice, because a fallback that never fires
     * behaves exactly like a fallback that is correct. Failing here is the
     * signal to delete the entry, not to reword it.
     */
    it("holds no entry ICU no longer needs", () => {
        const unneeded = Object.keys(LOCALE_NAME_FALLBACKS).filter(
            (locale) =>
                new Intl.DisplayNames(["en"], { type: "language" }).of(
                    locale,
                ) !== locale,
        );
        expect(unneeded).toEqual([]);
    });

    /** An English name is what identifies a language; an endonym is a bonus. */
    it("gives every entry a non-empty English name", () => {
        for (const [locale, names] of Object.entries(LOCALE_NAME_FALLBACKS)) {
            expect(names.englishName, locale).toBeTruthy();
        }
    });
});

describe("SUPPORTED_LOCALES", () => {
    it("lists every locale directory, English first", () => {
        // The roster is generated from `locales/`, deliberately not from the
        // catalogs inlined into the bundle — which is what keeps it listing
        // every language now that English is the only one inlined. `lint:i18n`
        // enforces the same agreement; this pins it as a runtime fact too.
        expect(SUPPORTED_LOCALES.map((l) => l.locale)).toEqual(listLocales());
        expect(SUPPORTED_LOCALES[0]?.locale).toBe("en");
    });

    it("gives every locale a non-empty label", () => {
        // The schema generator hard-fails on an empty description, so a blank
        // label here would break the build of `<document lang>`'s suggestions.
        for (const { label } of SUPPORTED_LOCALES) {
            expect(label.trim()).not.toBe("");
        }
    });
});

describe("countDiagnosticConstructions", () => {
    it("counts a coded call once on each side, so it nets out", () => {
        const counts = countDiagnosticConstructions(
            `diagnostics.push(codedDiagnostic({ type: "warning", code: "doenet-w0001" }));`,
        );
        expect(counts).toEqual({
            constructionCount: 1,
            codedConstructionCount: 1,
            forwardedCount: 0,
        });
        expect(remainingLiteralDiagnostics({ ...counts, codes: [] })).toBe(0);
    });

    it("counts a literal construction with nothing to cancel it", () => {
        const counts = countDiagnosticConstructions(
            `diagnostics.push({ type: "warning", message: "no" });`,
        );
        expect(remainingLiteralDiagnostics({ ...counts, codes: [] })).toBe(1);
    });

    it("does not credit the declaration of `codedDiagnostic` itself", () => {
        // The declaration has a shorthand `type,` rather than a severity
        // literal, so nothing in the denominator offsets it. Counted, it
        // would report one more construction migrated than there are.
        const counts = countDiagnosticConstructions(
            `export function codedDiagnostic({ type, code }: Args) { return { type }; }`,
        );
        expect(counts.codedConstructionCount).toBe(0);
        expect(counts.constructionCount).toBe(0);
    });

    it("credits the declaration of `codedDastError`, which is where its construction is", () => {
        // The mirror image of the rule above. A DAST error's `type` is always
        // `"error"` — the node kind — so the parser's builder writes it and
        // its callers write nothing; the one construction and the one credit
        // both belong to the declaration.
        const counts = countDiagnosticConstructions(
            `export function codedDastError({ code, message }: Args): DastError {\n    return { type: "error", message, code };\n}`,
        );
        expect(counts).toEqual({
            constructionCount: 1,
            codedConstructionCount: 1,
            forwardedCount: 0,
        });
        expect(remainingLiteralDiagnostics({ ...counts, codes: [] })).toBe(0);
    });

    it("does not credit a call to `codedDastError`, which carries no construction", () => {
        // Callers hand over a code and a message and nothing else; crediting
        // them would take the burn-down below zero, one per call site.
        const counts = countDiagnosticConstructions(
            `children.push(codedDastError({ code: "doenet-e0009", message }));`,
        );
        expect(counts).toEqual({
            constructionCount: 0,
            codedConstructionCount: 0,
            forwardedCount: 0,
        });
    });

    it("counts a forwarded code as migrated", () => {
        const counts = countDiagnosticConstructions(
            `addDiagnostic({ type: "error", ...diagnosticCodeFrom(e) });`,
        );
        expect(counts.forwardedCount).toBe(1);
        expect(remainingLiteralDiagnostics({ ...counts, codes: [] })).toBe(0);
    });

    it("ignores a severity in a type declaration or a longer property name", () => {
        const counts = countDiagnosticConstructions(
            `interface R { type: "error"; }\nconst r = { error_type: "warning" };`,
        );
        expect(counts.constructionCount).toBe(0);
    });
});

/**
 * Every `SelectExpression` an entry contains, at any nesting depth. A select
 * can sit inside a variant of another select — which is how a catalog forks on
 * `$role` and then on `$gender` — so this recurses rather than reading the top
 * level of each pattern.
 */
function selectExpressions(entry: Entry): SelectExpression[] {
    const found: SelectExpression[] = [];

    const visitPattern = (pattern: Pattern | null) => {
        for (const element of pattern?.elements ?? []) {
            if (element.type !== "Placeable") {
                continue;
            }
            const expression = element.expression;
            if (expression.type === "SelectExpression") {
                found.push(expression);
                for (const variant of expression.variants) {
                    visitPattern(variant.value);
                }
            }
        }
    };

    if (entry.type === "Message" || entry.type === "Term") {
        visitPattern(entry.value ?? null);
        for (const attribute of entry.attributes) {
            visitPattern(attribute.value);
        }
    }
    return found;
}

describe("the noun-class reachability rule", () => {
    /**
     * `$gender` is a token set a catalog defines for itself: `noun-gender`
     * maps each noun key to a token, and every concording word selects on the
     * tokens that come back. A variant for a token `noun-gender` can never
     * answer is therefore dead — it renders for no noun, and it reads as
     * agreement the catalog does not actually have. `locales/zu`'s header
     * states the rule («a `c6` branch would be a variant nothing can select»)
     * and the README restates it for `$role`; this is what holds all the
     * catalogs to it at once.
     *
     * The default variant is exempt: it is what an unlisted token falls to,
     * which is the point of writing one.
     *
     * The rule is asserted for **noun-class** tokens (`c3`, `c5`, …) and not
     * for the gender tokens of `locales/ru`, `locales/be` and `locales/sr`,
     * which write a neuter no noun currently reaches. The difference is that a
     * class token set is one a catalog invents for the core's own closed list
     * of nouns, so a class with no noun in it is a claim about nothing,
     * whereas Russian's three genders exist whatever this repository names —
     * and the neuter is the form the file needs the moment a neuter noun is
     * added.
     */
    it("writes no noun-class variant its own `noun-gender` cannot answer", () => {
        const offenders: string[] = [];

        for (const locale of listLocales()) {
            const source = readCatalog(locale, "content");
            if (source === null) {
                continue;
            }
            const resource = parse(source, { withSpans: false });

            const nounGender = resource.body.find(
                (entry): entry is Message =>
                    entry.type === "Message" && entry.id.name === "noun-gender",
            );
            if (!nounGender) {
                continue;
            }

            const answered = new Set(
                selectExpressions(nounGender).flatMap((select) =>
                    select.variants.flatMap((variant) =>
                        variant.value.elements.flatMap((element) =>
                            element.type === "TextElement"
                                ? [element.value.trim()]
                                : [],
                        ),
                    ),
                ),
            );

            for (const entry of resource.body) {
                if (entry.type !== "Message" && entry.type !== "Term") {
                    continue;
                }
                for (const select of selectExpressions(entry)) {
                    if (
                        select.selector.type !== "VariableReference" ||
                        select.selector.id.name !== "gender"
                    ) {
                        continue;
                    }
                    for (const variant of select.variants) {
                        const key =
                            variant.key.type === "Identifier"
                                ? variant.key.name
                                : variant.key.value;
                        if (
                            variant.default ||
                            !/^c\d+$/.test(key) ||
                            answered.has(key)
                        ) {
                            continue;
                        }
                        offenders.push(`${locale}: [${key}]`);
                    }
                }
            }
        }

        expect([...new Set(offenders)].sort()).toEqual([]);
    });

    /**
     * The rule above catches a class branch nothing can select. This is its
     * mirror image, and it is pinned rather than left to the header: Kituba is
     * a Bantu-based creole whose describing words agree with nothing, so a
     * `$gender` fork of *any* shape in `locales/ktu` would be a second spelling
     * of a form the language does not have — the same argument
     * `locales/sg`'s plural test makes about a `[one]` branch.
     *
     * Asserted for Kituba alone rather than for every catalog without a class
     * table, because the claim is about *this* language: nineteen other Bantu
     * catalogs in this repository do fork, and what makes Kituba's flatness
     * worth holding still is that a later editor would reasonably expect it not
     * to be.
     */
    it("has Kituba write no noun-class fork at all", () => {
        const offenders: string[] = [];

        for (const namespace of CATALOG_NAMESPACES) {
            const source = readCatalog("ktu", namespace) ?? "";
            for (const entry of parse(source, { withSpans: false }).body) {
                if (entry.type !== "Message" && entry.type !== "Term") {
                    continue;
                }
                for (const select of selectExpressions(entry)) {
                    if (
                        select.selector.type === "VariableReference" &&
                        select.selector.id.name === "gender"
                    ) {
                        const name =
                            entry.type === "Message" ? entry.id.name : "term";
                        offenders.push(`${namespace}: ${name}`);
                    }
                }
            }
        }

        expect(offenders).toEqual([]);
    });

    /**
     * The other half of the same claim, added when `locales/kg` arrived: what
     * makes Kituba's flatness worth reading is that its *lexifier* is not flat.
     * The two headers say so, and the assertion is what keeps the pair honest,
     * since a header can drift and a `$gender` fork cannot.
     *
     * `color` is the message the two headers point a reader at, so it is the
     * one pinned. Asserting on the count rather than on the exact variants
     * leaves a speaker free to fix Kongo's four class rows — the whole file is
     * an unreviewed seed — without failing here, while still catching the one
     * change that would make the pair meaningless.
     */
    it("has Kongo fork `color` where its creole does not", () => {
        const genderForks = (locale: string) => {
            const source = readCatalog(locale, "content") ?? "";
            const color = parse(source, { withSpans: false }).body.find(
                (entry) =>
                    entry.type === "Message" && entry.id.name === "color",
            );
            expect(color, `${locale} defines color`).toBeDefined();
            return selectExpressions(color!).filter(
                (select) =>
                    select.selector.type === "VariableReference" &&
                    select.selector.id.name === "gender",
            ).length;
        };

        expect(genderForks("kg")).toBeGreaterThan(0);
        expect(genderForks("ktu")).toBe(0);
    });
});

describe("counted messages", () => {
    const countArguments = new Set([
        "count",
        "attributesCount",
        "valuesCount",
        "parametersCount",
        "intervals",
        "inputs",
        "outputs",
    ]);

    /** Each message in a catalog, mapped to the count arguments it selects on. */
    const countSelectors = (source: string) => {
        const found = new Map<string, Set<string>>();
        for (const entry of parse(source, { withSpans: false }).body) {
            if (entry.type !== "Message") {
                continue;
            }
            const selectors = new Set(
                selectExpressions(entry).flatMap((select) =>
                    select.selector.type === "VariableReference" &&
                    countArguments.has(select.selector.id.name)
                        ? [select.selector.id.name]
                        : [],
                ),
            );
            if (selectors.size > 0) {
                found.set(entry.id.name, selectors);
            }
        }
        return found;
    };

    const forLocale = (locale: string) =>
        CATALOG_NAMESPACES.map(
            (namespace) =>
                [
                    namespace,
                    countSelectors(readCatalog(locale, namespace) ?? ""),
                ] as const,
        );

    /**
     * `locales/shi` inflects a verb for the number of its subject —
     * ⵢⵜⵜⵓⵣⴳⴰⵍ for one thing ignored against ⵜⵜⵓⵣⴳⴰⵍⵏ for several — and a noun
     * counted behind ⵏ for the number of the count. So a count English forks
     * on is a count it forks on too, and a message that renders one branch for
     * every count states a plural verb about a single attribute.
     *
     * Asserted for Tachelhit alone rather than for every catalog, because the
     * rule is a fact about *this* language, and the check is that the catalog
     * agrees with itself.
     */
    it("has Tachelhit fork on every count English forks on", () => {
        const tachelhit = new Map(forLocale("shi"));
        for (const [namespace, english] of forLocale("en")) {
            for (const [message, selectors] of english) {
                expect(
                    [...(tachelhit.get(namespace)?.get(message) ?? [])].sort(),
                    `${namespace}: ${message}`,
                ).toEqual([...selectors].sort());
            }
        }
    });

    /**
     * The mirror image, and the reason the rule above is stated per language
     * rather than for the roster: `Intl.PluralRules("sg")` reports the single
     * category `other`, so a Sango `[one]` branch would be a second spelling
     * of a form the language does not have.
     *
     * An exact-number key is a different thing and stays allowed: `[0]` is
     * matched by value rather than by category, and it is how every catalog —
     * Sango included — writes "no attempts remaining" as its own sentence.
     */
    it("has Sango write no plural-category branch", () => {
        const categories = new Set(["one", "two", "few", "many"]);

        for (const namespace of CATALOG_NAMESPACES) {
            const offenders: string[] = [];
            for (const entry of parse(readCatalog("sg", namespace) ?? "", {
                withSpans: false,
            }).body) {
                if (entry.type !== "Message") {
                    continue;
                }
                for (const select of selectExpressions(entry)) {
                    if (
                        select.selector.type !== "VariableReference" ||
                        !countArguments.has(select.selector.id.name)
                    ) {
                        continue;
                    }
                    for (const variant of select.variants) {
                        if (
                            variant.key.type === "Identifier" &&
                            categories.has(variant.key.name)
                        ) {
                            offenders.push(
                                `${entry.id.name} [${variant.key.name}]`,
                            );
                        }
                    }
                }
            }
            expect(offenders, namespace).toEqual([]);
        }
    });
});

describe("symbolicVariantKeys", () => {
    it("lists a message's selector keys and leaves the plural ones out", () => {
        expect(
            symbolicVariantKeys(`
picked =
    { $parts ->
        [width-color] { $width } { $color }
       *[color] { $color }
    }
counted =
    { $count ->
        [one] one
       *[other] many
    }
plain = Nothing to select
`),
        ).toEqual(new Map([["picked", ["color", "width-color"]]]));
    });
});

/**
 * A selector key is an interface, not prose.
 *
 * `$parts`, `$context`, `$status`, `$role` and the rest are symbols the core
 * passes in; Fluent matches a variant by comparing them letter for letter, and
 * falls back to the default when nothing matches. So a translated key does not
 * fail — it silently unreaches its branch and renders the default for every
 * input that should have chosen it, which no other check here would notice.
 * `locales/fit` shipped that in the Uralic north seed, having applied
 * Meänkieli's `on` → `oon` spelling rule to `[text-on-background]` and
 * `[text-on-canvas]` along with the sentence around them.
 *
 * Plural categories are the deliberate exception and are excluded: CLDR gives
 * each language its own set, so a catalog resolving `one` and `other` where
 * English resolves `one`, `two` and `other` is right rather than wrong. Every
 * other key English selects on must still be there. A catalog may add keys
 * English does not have — `locales/kmr` and the Dagestanian catalogs nest a
 * `$gender` select inside a `$parts` one, so their style messages carry an `m`
 * and an `f` English has no use for — so this is a subset check rather than an
 * equality one. What it forbids is a branch going missing.
 */
describe("every catalog's selector keys", () => {
    const english = new Map(
        CATALOG_NAMESPACES.map((namespace) => [
            namespace,
            symbolicVariantKeys(readCatalog(DEFAULT_LOCALE, namespace) ?? ""),
        ]),
    );

    it.each(listLocales().filter((locale) => locale !== DEFAULT_LOCALE))(
        "%s translates the prose and not the keys",
        (locale) => {
            const offenders: string[] = [];
            for (const namespace of CATALOG_NAMESPACES) {
                const source = readCatalog(locale, namespace);
                if (source === null) {
                    continue;
                }
                for (const [id, keys] of symbolicVariantKeys(source)) {
                    const expected = english.get(namespace)?.get(id);
                    if (expected === undefined) {
                        // A key English does not have is already reported as
                        // an unknown key by the coverage check above.
                        continue;
                    }
                    const missing = expected.filter(
                        (key) => !keys.includes(key),
                    );
                    if (missing.length > 0) {
                        offenders.push(
                            `${namespace}/${id}: no branch for ` +
                                `[${missing.join("] [")}]`,
                        );
                    }
                }
            }
            expect(offenders).toEqual([]);
        },
    );
});

/**
 * Dead plural branches: a category a catalog writes and its own locale can
 * never select.
 *
 * Such a branch is the quietest defect a catalog can carry. It parses, it
 * lints, it looks like a translation, and it renders nothing — the default
 * variant answers every input instead. `locales/km` carried one: Khmer has a
 * single plural category, its own header said so, and its `attempts-remaining`
 * and `answer-show-responses` each had a `[one]` branch beside an identical
 * `*[other]`. Identical, which is exactly why nobody noticed — the output was
 * right and the branch was unreachable.
 *
 * Every seeded batch since the Sami one has hand-written a substring check
 * against its own locales' sources. These tests replace those with one
 * property over the whole roster, read off the syntax tree rather than the
 * text, so a locale added later cannot reintroduce the defect merely by not
 * having a batch block of its own. The batch blocks keep the half the property
 * cannot state: which tags have their own CLDR data, and which category each
 * of them resolves.
 */
describe("plural categories a locale cannot select", () => {
    describe("pluralVariantKeys", () => {
        it("reads the categories a catalog writes", () => {
            expect(
                pluralVariantKeys(
                    [
                        "attempts = { $count ->",
                        "        [one] one",
                        "        [few] a few",
                        "       *[other] many",
                        "    }",
                    ].join("\n"),
                ),
            ).toEqual(["few", "one"]);
        });

        it("leaves numeric literals out, since they match the number itself", () => {
            // `[0]` stays selectable in a language whose only category is
            // `other`, which is the distinction that keeps `locales/km`'s zero
            // branch legal.
            expect(
                pluralVariantKeys(
                    [
                        "attempts = { $count ->",
                        "        [0] none",
                        "       *[other] some",
                        "    }",
                    ].join("\n"),
                ),
            ).toEqual([]);
        });

        it("reads the syntax rather than the text, so a comment may say the word", () => {
            // Several headers discuss `[two]` in prose while writing none.
            expect(
                pluralVariantKeys(
                    ["# no [two] branch here", "greeting = hello"].join("\n"),
                ),
            ).toEqual([]);
        });

        it("leaves the default variant out, since Fluent always falls back to it", () => {
            // `*[one]` in a language whose only category is `other` is
            // selected by every count rather than by none, so it is not the
            // defect this rule is about.
            expect(
                pluralVariantKeys(
                    [
                        "attempts = { $count ->",
                        "        [two] both",
                        "       *[one] some",
                        "    }",
                    ].join("\n"),
                ),
            ).toEqual(["two"]);
            expect(
                unselectablePluralCategories(
                    "km",
                    [
                        "attempts = { $count ->",
                        "       *[one] some",
                        "    }",
                    ].join("\n"),
                ),
            ).toEqual([]);
        });

        it("reads a term and an attribute, not only a message's own value", () => {
            // Neither is where a count lives today, but both are places a
            // select may be written, and a rule that skipped them would leave
            // a hole exactly where nobody would look for one.
            expect(
                pluralVariantKeys(
                    [
                        "-brand = { $count ->",
                        "        [two] a pair",
                        "       *[other] some",
                        "    }",
                    ].join("\n"),
                ),
            ).toEqual(["two"]);
            expect(
                pluralVariantKeys(
                    [
                        "button = press",
                        "    .label = { $count ->",
                        "        [few] a few",
                        "       *[other] some",
                        "    }",
                    ].join("\n"),
                ),
            ).toEqual(["few"]);
        });

        it("reads a category name as a category even on a non-count select", () => {
            // Fluent would match `[few]` on a string selector against the
            // literal `"few"`, so this branch is not strictly dead. Reading it
            // as a category anyway keeps this function and
            // `symbolicVariantKeys` from disagreeing about a key, and no
            // selector in the roster is affected: the symbolic selects key on
            // `plain`, `none`, `dark`, `true` and the like.
            expect(
                pluralVariantKeys(
                    [
                        "message = { $status ->",
                        "        [few] a few",
                        "       *[other] some",
                        "    }",
                    ].join("\n"),
                ),
            ).toEqual(["few"]);
            expect(
                symbolicVariantKeys(
                    [
                        "message = { $status ->",
                        "        [few] a few",
                        "       *[other] some",
                        "    }",
                    ].join("\n"),
                ).size,
            ).toBe(0);
        });

        it("descends into a select nested under another", () => {
            expect(
                pluralVariantKeys(
                    [
                        "message = { $parts ->",
                        "       *[plain] { $count ->",
                        "            [two] both",
                        "           *[other] some",
                        "        }",
                        "    }",
                    ].join("\n"),
                ),
            ).toEqual(["two"]);
        });
    });

    describe("allowedPluralCategories", () => {
        it("gives a locale CLDR knows exactly its own categories", () => {
            expect([...allowedPluralCategories("km")]).toEqual(["other"]);
            expect([...allowedPluralCategories("hsb")].sort()).toEqual([
                "few",
                "one",
                "other",
                "two",
            ]);
        });

        it("keeps a script subtag from reading as a different language", () => {
            // `Intl.PluralRules("zh-Hans")` resolves to plain `zh`, which is
            // its own data and not a fallback — so the naive comparison of
            // resolved tag against directory name would have called both
            // Chinese catalogs no-data and let them write `[one]`.
            expect([...allowedPluralCategories("zh-Hans")]).toEqual(["other"]);
            expect([...allowedPluralCategories("zh-Hant")]).toEqual(["other"]);
        });

        it("gives a locale CLDR has no data for `one` and `other` only", () => {
            // The branches these catalogs are entitled to: English's split
            // is the one the fallback usually makes, and each of the
            // ninety-odd catalogs that take it records the trade in its own
            // header.
            expect([...allowedPluralCategories("sco")].sort()).toEqual([
                "one",
                "other",
            ]);
            expect(allowedPluralCategories("szl").has("few")).toBe(false);
        });

        it("canonicalizes before asking, so a member code inherits its macrolanguage's rules", () => {
            // ICU folds `kmr` onto `ku`, and Kurmanji genuinely counts by
            // Kurdish's rules — unlike `kpv` and `mhr`, whose macrolanguages
            // CLDR has no data for either.
            expect(new Intl.PluralRules("kmr").resolvedOptions().locale) //
                .toBe("ku");
            expect([...allowedPluralCategories("kmr")].sort()).toEqual([
                "one",
                "other",
            ]);
        });

        it("treats a tag Intl refuses as the no-data case, as the runtime does", () => {
            // `en_US`, the POSIX spelling a host gets wrong: every `Intl`
            // constructor throws on it, `intlLocale` hands the bundle
            // `DEFAULT_LOCALE` instead, and English is then literally what
            // selects the branch.
            expect(() => new Intl.Locale("en_US")).toThrow();
            expect([...allowedPluralCategories("en_US")].sort()).toEqual([
                "one",
                "other",
            ]);
        });

        it("treats a bare region or script tag as no-data rather than throwing", () => {
            // A directory named for a region or a script alone is not a
            // locale, and `Intl` says so. The rule must still answer, and the
            // conservative answer is the one that lets least through: a
            // directory named `Hans` may write `[one]` and nothing wider.
            for (const notALocale of ["Hans", "419"]) {
                expect(() => new Intl.Locale(notALocale)).toThrow();
                expect([...allowedPluralCategories(notALocale)].sort()).toEqual(
                    ["one", "other"],
                );
            }
        });
    });

    describe("unselectablePluralCategories", () => {
        it("names a category the locale cannot reach", () => {
            expect(
                unselectablePluralCategories(
                    "km",
                    [
                        "attempts = { $count ->",
                        "        [one] one",
                        "       *[other] some",
                        "    }",
                    ].join("\n"),
                ),
            ).toEqual(["one"]);
        });

        it("passes a category the locale does reach", () => {
            expect(
                unselectablePluralCategories(
                    "hsb",
                    [
                        "attempts = { $count ->",
                        "        [two] both",
                        "       *[other] some",
                        "    }",
                    ].join("\n"),
                ),
            ).toEqual([]);
        });
    });

    describe("hasOwnPluralData", () => {
        it("tells the two cases apart, which is what the lint message says", () => {
            // `km` is CLDR's own answer — one category, and it is Khmer's.
            // `sco` and `en_US` are not: the categories on offer there belong
            // to whatever locale the runtime falls back to.
            expect(hasOwnPluralData("km")).toBe(true);
            expect(hasOwnPluralData("zh-Hans")).toBe(true);
            expect(hasOwnPluralData("sco")).toBe(false);
            expect(hasOwnPluralData("en_US")).toBe(false);
        });
    });

    /**
     * The property itself, over every catalog on the roster. This is what the
     * per-batch blocks in `chrome.test.ts` were reaching for one batch at a
     * time.
     */
    it("is written by no catalog in the roster", () => {
        const dead: string[] = [];
        for (const locale of listLocales()) {
            for (const namespace of CATALOG_NAMESPACES) {
                const source = readCatalog(locale, namespace);
                if (source === null) {
                    continue;
                }
                for (const category of unselectablePluralCategories(
                    locale,
                    source,
                )) {
                    dead.push(
                        `locales/${locale}/${namespace}.ftl: [${category}]`,
                    );
                }
            }
        }
        expect(dead).toEqual([]);
    });

    /**
     * Three headers in the Silk Road batch do not merely name a script — they set
     * the catalog's letter inventory out **exactly**, and tell a corrector not to
     * fold a letter into its Russian look-alike. `locales/alt` allows the Russian
     * letters plus `ј ҥ ӧ ӱ`, `locales/kjh` plus `і ғ ң ӧ ӱ ӌ`, and `locales/dng`
     * plus `ә җ ң ў ү`.
     *
     * That is the rare header claim a test can hold in full, and it is worth
     * holding, because the failure it catches is invisible: a homoglyph renders
     * identically and breaks nothing, so it survives review and then defeats every
     * search a later corrector runs. The seed shipped two — the Tajik `ҷ` (U+04B7)
     * where Khakas has `ӌ` (U+04CC), and the Latin `ə` (U+0259) beside the
     * Cyrillic `ә` (U+04D9) `locales/dng` uses everywhere else.
     *
     * Only the three catalogs whose headers make the claim are checked. Most
     * catalogs make no such promise, and some legitimately mix scripts by letter:
     * Ossetian's `æ` is U+00E6, a Latin letter inside a Cyrillic alphabet, and the
     * Mansi and Kildin Sami vowels with macrons are Latin too.
     */
    describe("the letter inventories three Silk Road headers state exactly", () => {
        const RUSSIAN = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя";

        /** Letters each catalog's header allows on top of the Russian alphabet. */
        const EXTRA: Record<string, string> = {
            alt: "јҥӧӱ",
            kjh: "іғңӧӱӌ",
            dng: "әҗңўү",
        };

        it.each(Object.keys(EXTRA))(
            "keeps %s to the Russian letters and the ones its header names",
            (locale) => {
                const allowed = new Set(
                    [...`${RUSSIAN}${EXTRA[locale]}`].flatMap((letter) => [
                        letter,
                        letter.toUpperCase(),
                    ]),
                );
                const offenders = new Set<string>();
                for (const namespace of CATALOG_NAMESPACES) {
                    const source = readCatalog(locale, namespace);
                    if (source === null) {
                        continue;
                    }
                    for (const line of source.split("\n")) {
                        // Headers quote the look-alikes they warn against, and
                        // every catalog writes DoenetML's own identifiers in
                        // Latin, so only the prose a reader sees is checked.
                        if (line.trimStart().startsWith("#")) {
                            continue;
                        }
                        for (const letter of line.replace(/`[^`]*`/g, " ")) {
                            if (
                                /\p{L}/u.test(letter) &&
                                !/[\x00-\x7f]/.test(letter)
                            ) {
                                if (!allowed.has(letter)) {
                                    offenders.add(
                                        `${letter} (U+${letter
                                            .codePointAt(0)!
                                            .toString(16)
                                            .toUpperCase()
                                            .padStart(4, "0")})`,
                                    );
                                }
                            }
                        }
                    }
                }
                expect([...offenders]).toEqual([]);
            },
        );
    });

    /**
     * The Americas batch's headers make a claim of the same checkable kind the
     * three Silk Road headers do, but about **one character rather than an
     * alphabet**: `locales/yua` and `locales/kek` state that the glottal stop
     * and the ejectives are written with U+02BC MODIFIER LETTER APOSTROPHE
     * throughout, and never with the typographic U+2019 or the ASCII U+0027.
     *
     * That is worth holding for the Silk Road block's reason exactly. The
     * three characters are near-indistinguishable on screen, a text editor
     * with smart quotes turns one into another without being asked, and the
     * result breaks no test and defeats every later search — but «tʼaan» and
     * «t’aan» are different strings, and in Mayan orthography the ejective is
     * a letter rather than punctuation.
     *
     * `locales/iu` gets the other half of the same idea: its header states
     * that no Inuktitut word is spelled in roman letters, and the roman that
     * does appear is either DoenetML source or a declared English loan. The
     * check that fits that claim is not an inventory — the loans are real
     * roman words — but the absence of the one syllabics character that would
     * mean the file had drifted into a neighbouring language's inventory.
     */
    describe("the character inventories the Americas headers state exactly", () => {
        /** The message text of a catalog: comment lines and code spans dropped. */
        const prose = (locale: string): string =>
            CATALOG_NAMESPACES.map((namespace) =>
                readCatalog(locale, namespace),
            )
                .filter((source): source is string => source !== null)
                .join("\n")
                .split("\n")
                .filter((line) => !line.trimStart().startsWith("#"))
                .join("\n")
                .replace(/`[^`]*`/g, " ");

        it.each(["yua", "kek"])(
            "writes every apostrophe in %s as U+02BC",
            (locale) => {
                const text = prose(locale);
                expect(text).toContain("\u02bc");
                // The look-alike, named by codepoint so a failure says which
                // character crept in rather than printing two identical marks.
                expect(text).not.toContain("\u2019");
                // U+0027 is deliberately not forbidden: English's own
                // messages quote enumerated values with straight quotes and
                // write the derivative as `y'`, and both come through a
                // translation unchanged. It is the curly one a smart-quote
                // editor substitutes, and the curly one that would be a
                // silent respelling of a Mayan letter.
            },
        );

        /**
         * ᐦ (U+1426) is the Cree final `h`. It is not part of the Nunavut
         * Inuktitut inventory — `locales/iu` writes ᕼ (U+157C) where it needs
         * an *h* — and its appearance would mean a syllabics string had been
         * taken from a Cree source. The batch shipped no Cree catalog, which
         * is exactly why nothing else would catch this.
         */
        it("keeps iu's syllabics out of the Cree finals", () => {
            // ᕼ itself appears only in the headers — the syllabics words
            // this catalog happens to use need no *h* — so what is asserted
            // is the absence, which is the half that could rot.
            expect(prose("iu")).not.toContain("\u1426");
        });

        /**
         * `locales/srm`'s headers state that tone is not written, and that the
         * one accented letter outside its `ë`/`ö` vowels is «á», the preverbal
         * negator, whose accent marks the word rather than a tone. Any other
         * acute would mean tone had been half-restored — worse than the stated
         * absence, because a reader could not tell which words had been done.
         */
        it("keeps srm to the one accented letter its header allows", () => {
            const accented = new Set(
                [...prose("srm")].filter((letter) =>
                    /[\u00c0-\u024f]/.test(letter),
                ),
            );
            // Case-folded: «Ë» opens a sentence in several messages, and a
            // capital is the same letter.
            expect(
                [
                    ...new Set(
                        [...accented].map((letter) => letter.toLowerCase()),
                    ),
                ].sort(),
            ).toEqual(["á", "ë", "ö"]);
        });
    });
});

/**
 * Two catalogs can agree without being one catalog, and this batch has both
 * shapes of that. `jam` and `bzj` are English-lexifier creoles in phonemic
 * orthographies, so the short everyday words converge — «chruu», «faals»,
 * «tik dash-dash red lain» — and `gcf` and `gcr` agree word for word on a
 * styled line. Convergence is the language; a catalog copied to a second tag
 * is a defect, and the two look alike from a distance.
 *
 * What separates them is a *rate*. A copy differs nowhere; these differ in
 * most of what they both define. The rate over `content.ftl` alone is
 * asserted in `packages/utils/test/styleDescriptions.test.ts`, beside the
 * styled-line phrase it is about; what is left here is the whole-catalog
 * rate, and the French trio, whose agreement is confined to that one phrase.
 * The floors are floors rather than equalities so that correcting a string
 * cannot fail the test — only wholesale duplication can.
 */
describe("catalogs of one lexifier that are not each other's copy", () => {
    /** Message id → serialized entry, for every message in one namespace. */
    const entries = (locale: string, namespace: string) => {
        const source = readCatalog(locale, namespace);
        const values = new Map<string, string>();
        if (source === null) {
            return values;
        }
        for (const entry of parse(source, { withSpans: false }).body) {
            if (entry.type === "Message") {
                values.set(entry.id.name, serialize(new Resource([entry]), {}));
            }
        }
        return values;
    };

    /** How many of the ids both catalogs define carry different text. */
    const differing = (a: string, b: string, namespaces: readonly string[]) => {
        let shared = 0;
        let differ = 0;
        for (const namespace of namespaces) {
            const left = entries(a, namespace);
            const right = entries(b, namespace);
            for (const [id, value] of left) {
                const other = right.get(id);
                if (other === undefined) {
                    continue;
                }
                shared += 1;
                differ += value === other ? 0 : 1;
            }
        }
        return { shared, differ };
    };

    it("keeps jam and bzj apart in most of what both define", () => {
        const all = differing("jam", "bzj", CATALOG_NAMESPACES);
        // One lower than they were on each count since
        // `summary-statistics-caption` was dropped from every catalog but
        // `en`: its translations all named the data column that
        // `<summaryStatistics>` no longer has, and the two rendered it
        // differently, so it counted toward both numbers.
        expect(all.shared).toBe(388);
        expect(all.differ).toBeGreaterThanOrEqual(341);
    });

    /**
     * The French-lexifier trio, where the styled-line phrase agrees but the
     * diagnostics do not: `gcr` writes the indefinite «roun» where `gcf`
     * writes «on», which alone separates most of the file.
     */
    it.each([
        ["gcf", "gcr", 206],
        ["gcf", "acf", 180],
        ["acf", "gcr", 205],
    ] as [string, string, number][])(
        "keeps %s and %s apart across their diagnostics",
        (a, b, floor) => {
            const { shared, differ } = differing(a, b, ["diagnostics"]);
            expect(shared).toBe(220);
            expect(differ).toBeGreaterThanOrEqual(floor);
        },
    );
});

/**
 * A select every branch of which renders the same string is a distinction the
 * catalog has silently dropped. It parses, it lints, every property above
 * passes it, and it reads to a skimmer as a locale that carefully wrote out
 * three forms — but the reader gets one string whatever the count, and the
 * header claiming the forms differ is now false about its own file.
 *
 * The Americas seed shipped five of them and they were the batch's second
 * semantic defect, after `locales/miq`'s collapsed
 * `field-function-wrong-num-outputs`. All five were in `kl` and `iu`, which is
 * where they matter: those two are the batch's catalogs whose plural branches
 * a runtime can actually select, so a repeated branch is a live branch saying
 * nothing. They are now written as a single form, which is the honest shape
 * for a message whose wording does not turn on the count.
 *
 * **Identical branches are forbidden; merely non-distinct ones are not.**
 * `style-border-clause` forks four ways on two distinctions English draws, an
 * indefinite article and a linker English spells two ways, and six of these
 * catalogs collapse one of the two: `kl` and `miq` write no article, so
 * `[with-article]` lands on `[with]`, while `cab`, `srn`, `djk` and `srm` use
 * one word for both *with* and *and*, so `[with]` lands on `[and]`. Either
 * way two branches remain. That is a distinction the target language does not
 * draw, not one the translation lost, so the floor is *some* branch differing
 * rather than all of them.
 */
describe("selects in the Americas batch that still say something", () => {
    /** The fifteen tags this batch adds, in the order the README lists them. */
    const AMERICAS_LOCALES = [
        "kl",
        "iu",
        "yua",
        "kek",
        "cab",
        "miq",
        "pap",
        "srn",
        "jam",
        "gcf",
        "acf",
        "gcr",
        "bzj",
        "djk",
        "srm",
    ];

    /** A variant's key as written — `[one]`, `[0]` — for a failure message. */
    const variantKey = (variant: Variant): string =>
        variant.key.type === "Identifier"
            ? variant.key.name
            : variant.key.value;

    /** Every select in one catalog, nested ones included. */
    const selects = (locale: string, namespace: string) => {
        const source = readCatalog(locale, namespace);
        const found: SelectExpression[] = [];
        if (source === null) {
            return found;
        }
        const walk = (pattern: Pattern) => {
            for (const element of pattern.elements) {
                if (
                    element.type === "Placeable" &&
                    element.expression.type === "SelectExpression"
                ) {
                    found.push(element.expression);
                    for (const variant of element.expression.variants) {
                        walk(variant.value);
                    }
                }
            }
        };
        for (const entry of parse(source, { withSpans: false }).body) {
            if (entry.type !== "Message" && entry.type !== "Term") {
                continue;
            }
            for (const pattern of [
                entry.value,
                ...entry.attributes.map((attribute) => attribute.value),
            ]) {
                if (pattern) {
                    walk(pattern);
                }
            }
        }
        return found;
    };

    /**
     * A variant's pattern as a comparable string. Written out rather than
     * handed to `serialize`, which needs a whole `Resource` of real AST nodes
     * and throws on a synthesized one: text is taken verbatim, and a placeable
     * is reduced to a canonical token so that two branches differing only in
     * *which* variable they interpolate still count as different.
     */
    const patternText = (pattern: Pattern): string =>
        pattern.elements
            .map((element) => {
                if (element.type === "TextElement") {
                    return element.value;
                }
                const expression = element.expression;
                if (expression.type === "VariableReference") {
                    return `{$${expression.id.name}}`;
                }
                if (expression.type === "SelectExpression") {
                    return `{select:${expression.variants
                        .map(
                            (variant) =>
                                `${variantKey(variant)}=${patternText(
                                    variant.value,
                                )}`,
                        )
                        .join("|")}}`;
                }
                if (
                    expression.type === "StringLiteral" ||
                    expression.type === "NumberLiteral"
                ) {
                    return expression.value;
                }
                if (expression.type === "MessageReference") {
                    return `{${expression.id.name}}`;
                }
                if (expression.type === "TermReference") {
                    return `{-${expression.id.name}}`;
                }
                return `{${expression.type}}`;
            })
            .join("");

    it.each(AMERICAS_LOCALES)(
        "leaves no select in %s with every branch the same",
        (locale) => {
            const uniform: string[] = [];
            for (const namespace of CATALOG_NAMESPACES) {
                for (const select of selects(locale, namespace)) {
                    const rendered = select.variants.map((variant) =>
                        patternText(variant.value),
                    );
                    if (new Set(rendered).size === 1) {
                        uniform.push(
                            `${namespace}: ${select.variants
                                .map((variant) => variantKey(variant))
                                .join("/")}`,
                        );
                    }
                }
            }
            expect(uniform).toEqual([]);
        },
    );
});

/**
 * No catalog writes a number in its own script's digits.
 *
 * This is the README's "Digits are Latin, separators are not" rule met from the
 * catalog side. The rule is enforced on every *formatter* — `intlLocale` pins
 * the numbering system, and `lint:i18n` rejects a catalog passing
 * `numberingSystem` to a Fluent builtin — but a literal digit typed into a
 * message value goes through no formatter at all, and there was nothing
 * checking it.
 *
 * The failure it produces is worse than an inconsistency between locales. It is
 * an inconsistency *inside one sentence*: a message reading "more than 3 points"
 * with the 3 in Myanmar digits sits beside a `{ $count }` in the next message
 * rendering in Latin ones, and beside mathematics that is Latin-digit
 * regardless. `locales/mnw` and `locales/ksw` were seeded with exactly that, six
 * messages each, and this is the property that found it.
 *
 * Every digit range CLDR would otherwise count in is checked rather than only
 * the ones the roster has languages for, since the next batch is what this is
 * for.
 */
describe("every catalog's digits", () => {
    /**
     * The decimal-digit blocks of the scripts this roster writes in, plus the
     * ones it plausibly will. Latin `0`–`9` is deliberately absent: it is the
     * answer, not an offender.
     */
    const NON_LATIN_DIGITS =
        /[٠-٩۰-۹०-९০-৯੦-੯૦-૯୦-୯௦-௯౦-౯೦-೯൦-൯๐-๙໐-໙༠-༩၀-၉႐-႙០-៩᥆-᥏᧐-᧙]/u;

    it.each(listLocales())("%s counts in Latin digits", (locale) => {
        const offenders: string[] = [];
        for (const namespace of CATALOG_NAMESPACES) {
            const source = readCatalog(locale, namespace);
            if (source === null) {
                continue;
            }
            source.split("\n").forEach((line, index) => {
                // Header prose may name a script's digits to say it does not
                // use them, which is the opposite of the defect.
                if (line.trimStart().startsWith("#")) {
                    return;
                }
                if (NON_LATIN_DIGITS.test(line)) {
                    offenders.push(`${namespace}:${index + 1}: ${line.trim()}`);
                }
            });
        }
        expect(offenders).toEqual([]);
    });
});

/**
 * The letter inventories the Southeast Asian batch's headers state exactly.
 *
 * Twelve of the fifteen catalogs are written in Latin, and the interesting fact
 * about them is how *little* they need beyond ASCII: seven use nothing at all,
 * and the other five commit to exactly one or three characters apiece. Each of
 * those five carries a distinction of the language rather than decoration —
 * `nia`'s «ö», `mrw`'s schwa «ë», `tsg`'s macrons for a long vowel, the «é»
 * `bug` and `mak` write for a vowel their Lontara tradition does not
 * distinguish — and each locale's header names its own and warns against
 * folding it away. A catalog that acquired a sixth diacritic would have
 * acquired it by guess.
 */
describe("the letter inventories the Southeast Asian headers state exactly", () => {
    /** Non-ASCII letters each Latin-script catalog's header allows. */
    const LATIN_EXTRA: Record<string, string> = {
        bug: "é",
        mak: "é",
        bjn: "",
        gor: "",
        nia: "ö",
        bbc: "",
        iba: "",
        dtp: "",
        pag: "",
        cbk: "",
        tsg: "āīū",
        mrw: "ë",
    };

    /** Every letter a catalog writes outside ASCII, as it appears. */
    const lettersOutsideAscii = (locale: string): Set<string> => {
        const found = new Set<string>();
        for (const namespace of CATALOG_NAMESPACES) {
            const source = readCatalog(locale, namespace);
            if (source === null) {
                continue;
            }
            for (const line of source.split("\n")) {
                // Headers quote the look-alikes they warn against, and every
                // catalog writes DoenetML's own identifiers in Latin, so only
                // the prose a reader sees is checked.
                if (line.trimStart().startsWith("#")) {
                    continue;
                }
                for (const letter of line.replace(/`[^`]*`/g, " ")) {
                    if (/\p{L}/u.test(letter) && letter.codePointAt(0)! > 127) {
                        found.add(letter);
                    }
                }
            }
        }
        return found;
    };

    /**
     * The same, widened to combining marks. The Myanmar script writes its
     * vowels as marks rather than as letters, so `\p{L}` alone sees none of
     * `ၢ`, `ႃ` or `ၣ` — the very characters the three headers below make
     * claims about.
     */
    const signsOutsideAscii = (locale: string): Set<string> => {
        const found = new Set<string>();
        for (const namespace of CATALOG_NAMESPACES) {
            const source = readCatalog(locale, namespace);
            if (source === null) {
                continue;
            }
            for (const line of source.split("\n")) {
                if (line.trimStart().startsWith("#")) {
                    continue;
                }
                for (const sign of line.replace(/`[^`]*`/g, " ")) {
                    if (
                        /[\p{L}\p{M}]/u.test(sign) &&
                        sign.codePointAt(0)! > 127
                    ) {
                        found.add(sign);
                    }
                }
            }
        }
        return found;
    };

    it.each(Object.keys(LATIN_EXTRA))(
        "keeps %s to ASCII and the letters its header names",
        (locale) => {
            const allowed = new Set(
                [...LATIN_EXTRA[locale]].flatMap((letter) => [
                    letter,
                    letter.toUpperCase(),
                ]),
            );
            expect(
                [...lettersOutsideAscii(locale)].filter(
                    (letter) => !allowed.has(letter),
                ),
            ).toEqual([]);
        },
    );

    /**
     * Seven of the twelve need nothing beyond ASCII at all, asserted as a fact
     * about those catalogs rather than left implicit in an empty string above.
     * `cbk` is the one worth naming: printed Chavacano inherits Spanish's
     * accents, and `locales/cbk` commits to writing none — so an «á» appearing
     * here later is a change of orthography, not a typo.
     */
    it.each(["bjn", "gor", "bbc", "iba", "dtp", "pag", "cbk"])(
        "writes %s in ASCII letters alone",
        (locale) => {
            expect([...lettersOutsideAscii(locale)]).toEqual([]);
        },
    );

    /**
     * The glottal stop, which six of the twelve write and all six write the
     * same way: **ASCII `'` (U+0027)**, never U+2019 or U+02BC.
     *
     * This is the deliberate opposite of `locales/quc`, whose Kʼicheʼ is
     * written with U+02BC throughout because there the glottal stop is a
     * *letter* of Mayan orthography. In Buginese, Makasar, Gorontalo, Nias,
     * Kadazandusun and Tausug the mark is punctuation-shaped in ordinary
     * print, the surrounding catalogs quote values with straight quotes, and a
     * curly apostrophe in a value a reader might retype is a hazard rather
     * than a nicety. Either convention is defensible; what a batch cannot
     * afford is both.
     *
     * The other six Latin catalogs are not listed because they do not write
     * the sound at all — the only apostrophes in `bjn`, `bbc`, `iba`, `pag`,
     * `cbk` and `mrw` are the primes of `y'` and `d'` in mathematical prose.
     */
    it.each(["bug", "mak", "gor", "nia", "dtp", "tsg"])(
        "writes %s's glottal stop as ASCII apostrophe",
        (locale) => {
            const offenders: string[] = [];
            for (const namespace of CATALOG_NAMESPACES) {
                const source = readCatalog(locale, namespace) ?? "";
                for (const line of source.split("\n")) {
                    if (line.trimStart().startsWith("#")) {
                        continue;
                    }
                    if (/[’ʼʻ]/.test(line)) {
                        offenders.push(`${namespace}: ${line.trim()}`);
                    }
                }
            }
            expect(offenders).toEqual([]);
        },
    );

    /**
     * The three Myanmar-script catalogs, and the two header claims a homoglyph
     * audit corrected during seeding rather than after review.
     *
     * These languages share a script and do not share its letters, and the
     * failure mode is silent: a Burmese letter standing in for the Shan or
     * Karen one it resembles renders, lints and reads as text. So each catalog
     * is held to the letters its own header names, in both directions — the
     * ones it must have and the ones it must not.
     */
    it("holds shn, mnw and ksw to their own letters", () => {
        const has = (locale: string, sign: string) =>
            signsOutsideAscii(locale).has(sign);

        // Shan's own consonants, and `ၢ` U+1062 — correct Shan spelling for
        // /aa/ before a final consonant, which `shn/chrome.ftl` warns against
        // "correcting" to `ႃ`. Both are present; neither replaces the other.
        for (const letter of ["ၵ", "ၶ", "ၸ", "ၺ", "ၼ", "ၽ", "ၾ", "ႁ", "ဢ"]) {
            expect(has("shn", letter)).toBe(true);
        }
        expect(has("shn", "ၢ")).toBe(true);
        expect(has("shn", "ႃ")).toBe(true);

        // Mon's own letters. The header first claimed `ဿ` and `ၝ` and the audit
        // found neither in the text, so the header was corrected to match the
        // catalog rather than the catalog padded to match the header.
        for (const letter of ["ၚ", "ၜ", "ၞ", "ၟ", "ၠ"]) {
            expect(has("mnw", letter)).toBe(true);
        }
        for (const letter of ["ဿ", "ၝ"]) {
            expect(has("mnw", letter)).toBe(false);
        }

        // S'gaw Karen's own letters, and the sharper correction: `ၦ` and `ၯ`
        // are **Pwo** letters, not S'gaw ones, and the seeding brief asked for
        // them by mistake. The catalog uses neither. The negotiation side of
        // the same boundary is in `negotiate.test.ts`, where `kjp` (Eastern
        // Pwo) and `blk` (Pa'o) fall to English rather than to this catalog —
        // there because `kar` is an ISO 639-5 collection rather than a
        // macrolanguage, not because of any letter.
        for (const letter of ["ၢ", "ၣ", "ၤ"]) {
            expect(has("ksw", letter)).toBe(true);
        }
        for (const letter of ["ၦ", "ၯ", "ၡ", "ဢ"]) {
            expect(has("ksw", letter)).toBe(false);
        }
    });

    /**
     * And the negative control across the three: no catalog here writes a
     * letter from *outside* the Myanmar block, apart from the Latin the
     * declared English and Burmese loan registers are written in. A Thai or
     * Khmer letter would be a seeding accident rather than a language.
     */
    it.each(["shn", "mnw", "ksw"])(
        "keeps %s inside the Myanmar block",
        (locale) => {
            const strays = [...signsOutsideAscii(locale)].filter(
                (sign) => !/[က-႟ꩠ-ꩿ]/u.test(sign),
            );
            expect(strays).toEqual([]);
        },
    );
});
