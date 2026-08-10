import { describe, expect, it } from "vitest";
import {
    parse,
    type Entry,
    type Message,
    type Pattern,
    type SelectExpression,
} from "@fluent/syntax";

import {
    SUPPORTED_LOCALES_FILE,
    catalogParseErrors,
    countDiagnosticConstructions,
    extractKeys,
    listLocales,
    multilinePatterns,
    numberingSystemOverrides,
    readCatalog,
    remainingLiteralDiagnostics,
    renderMessageKeysModule,
    renderSupportedLocalesModule,
} from "../scripts/catalogUtils";
import { SUPPORTED_LOCALES } from "../src/generated/supportedLocales";
import { CATALOG_NAMESPACES } from "../src/namespaces";

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
        // knows the tag. Codegen must not be what stops it landing: an
        // unrecognized tag degrades to `Intl`'s rendering of the tag itself,
        // which is still a usable label.
        const rendered = await renderSupportedLocalesModule(["en", "zz-QQ"]);
        expect(rendered).toContain('locale: "zz-QQ"');
        expect(rendered).toMatch(/label: "zz[^"]*"/);
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
        const source = readCatalog("ktu", "content") ?? "";
        const offenders: string[] = [];

        for (const entry of parse(source, { withSpans: false }).body) {
            if (entry.type !== "Message" && entry.type !== "Term") {
                continue;
            }
            for (const select of selectExpressions(entry)) {
                if (
                    select.selector.type === "VariableReference" &&
                    select.selector.id.name === "gender"
                ) {
                    offenders.push(
                        entry.type === "Message" ? entry.id.name : "term",
                    );
                }
            }
        }

        expect(offenders).toEqual([]);
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
