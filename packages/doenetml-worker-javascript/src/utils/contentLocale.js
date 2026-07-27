import { DEFAULT_LOCALE } from "@doenet/i18n";

/**
 * The document's language, for the state variables that compute *content*.
 *
 * Content answers to `documentLocale`, not to the reader's UI language: an
 * author can interpolate `$b.text` or `$answer.submitLabel` into their own
 * prose, so the words have to be in the language the activity is written in.
 * That language is the resolved `locale` of the `<document>` the component
 * sits in — a nested `<document lang="de">` differs from the one around it, so
 * an ancestor dependency is the only thing that can answer it.
 *
 * This is the same wiring `@doenet/utils`' style descriptions use
 * (`styleDescriptionDefinitions.ts`), lifted here for the components that need
 * it without needing the style pipeline. The two are deliberately not shared:
 * `@doenet/utils` cannot import from the worker, and hoisting this there would
 * put the worker's dependency vocabulary in a package that has no core.
 *
 * Bind the translator to `t` (or `translate`) and pass it a literal key —
 * `lint:i18n` reads call sites textually, and anything else is invisible to it.
 * There is no example written out here for the same reason: the scan does not
 * skip comments, so an illustration would register as a real use of whatever
 * key it named. `packages/i18n/README.md` is not scanned, and has one.
 */
export function returnContentLocaleDependencies({ ownLocale = false } = {}) {
    return {
        // For `<document>` itself, whose own `lang` is the language of its own
        // content. The ancestor lookup below deliberately excludes the
        // component it runs on — that is what lets a nested `<document>`
        // detect that it is nested — so without this a root
        // `<document lang="es">` would resolve its own prose against the
        // host's locale instead of the one it declares.
        //
        // Off by default: a `stateVariable` dependency on a variable the
        // component doesn't have is an error, not an empty value, and only
        // `<document>` has `locale`.
        ...(ownLocale
            ? {
                  contentLocaleSelf: {
                      dependencyType: "stateVariable",
                      variableName: "locale",
                  },
              }
            : {}),
        contentLocaleDocument: {
            dependencyType: "ancestor",
            componentType: "document",
            variableNames: ["locale"],
        },
        // The host's locale, for a component with no `<document>` above it —
        // which happens in tests and in a fragment rendered on its own. Without
        // it `contentLocale` would have no tag to hand `Intl`, and a number
        // would be grouped in English inside a Spanish document merely because
        // the ancestor lookup came up empty.
        contentHostLocale: {
            dependencyType: "locale",
        },
        getContentTranslator: {
            dependencyType: "translator",
        },
    };
}

/**
 * The BCP-47 tag this component's content is written in.
 *
 * Always a non-empty tag: a component with no `<document>` above it falls back
 * to the host's, and a host that supplied none falls back to English.
 */
export function contentLocale(dependencyValues) {
    return (
        dependencyValues.contentLocaleSelf ||
        dependencyValues.contentLocaleDocument?.stateValues.locale ||
        dependencyValues.contentHostLocale ||
        // A host that supplies an empty tag, which is not a locale but is also
        // not a reason for a state variable to throw.
        DEFAULT_LOCALE
    );
}

/**
 * Whether this component's content is written in English.
 *
 * For the handful of things that are English-language *processing* rather than
 * English text — `<pluralize>`'s part-of-speech model is the one today — and
 * so have to know whether they apply at all, rather than which words to use.
 *
 * The primary subtag alone: `en-GB` and `en-US` are both English for this
 * purpose, and no dialect of English is not.
 */
export function isEnglishContent(dependencyValues) {
    return (
        contentLocale(dependencyValues).split(/[-_]/)[0].toLowerCase() === "en"
    );
}

/** The translator for {@link contentLocale}. */
export function contentTranslator(dependencyValues) {
    return dependencyValues.getContentTranslator(
        contentLocale(dependencyValues),
    );
}

/**
 * A state variable holding an author-overridable label: the attribute's value
 * if the author wrote one, otherwise the default in the document's language.
 *
 * Only the *default* is translated. An author who writes `nextLabel="Onward"`
 * gets "Onward" in every locale — those are their words, chosen for their
 * document — so the attribute value passes through verbatim, and only an
 * unspecified one reaches the catalog. `usedDefault` is the only thing that
 * tells an unspecified attribute apart from an author who typed the English
 * default on purpose, which is why the attribute has to land on a separate
 * `…PreLocalize` state variable and be re-taken here.
 *
 * The attribute declaration keeps its English `defaultValue` so that authors
 * see the words in the schema; the value is never read, because this
 * definition replaces it whenever `usedDefault` is set.
 *
 * @param name The state variable authors and renderers see.
 * @param translatedDefault The default, as a function of the translator rather
 *   than as a key: `lint:i18n` reads call sites literally, so a key passed as
 *   data would read as an orphan in the catalog and a typo would surface only
 *   at runtime.
 * @param ownLocale Read the component's *own* `locale` as well as the
 *   enclosing document's; see {@link returnContentLocaleDependencies}.
 */
export function returnLocalizedDefaultStateVariableDefinition({
    name,
    translatedDefault,
    description,
    createComponentOfType = "text",
    ownLocale = false,
}) {
    const authored = `${name}PreLocalize`;
    return {
        description,
        public: true,
        shadowingInstructions: { createComponentOfType },
        forRenderer: true,
        returnDependencies: () => ({
            [authored]: {
                dependencyType: "stateVariable",
                variableName: authored,
            },
            ...returnContentLocaleDependencies({ ownLocale }),
        }),
        definition({ dependencyValues, usedDefault }) {
            const value = usedDefault[authored]
                ? translatedDefault(contentTranslator(dependencyValues))
                : dependencyValues[authored];
            return { setValue: { [name]: value } };
        },
    };
}
