export {
    createTranslator,
    asFallbackTranslator,
    type Translator,
    type TranslationArgs,
    type CreateTranslatorOptions,
} from "./translator";

export {
    negotiateLocales,
    normalizeLocaleTag,
    resolveDocumentLocale,
    resolveUiLocale,
    type NegotiateLocalesOptions,
} from "./negotiate";

export {
    pseudoLocalize,
    PSEUDO_LOCALE,
    PSEUDO_RTL_LOCALE,
    PSEUDO_RTL_BRACKETS,
    type PseudoLocalizeOptions,
} from "./pseudo";

export { directionOf, stripBidiIsolates, type Direction } from "./direction";

export {
    CATALOG_NAMESPACES,
    WORKER_NAMESPACES,
    CHROME_NAMESPACES,
    combineCatalogs,
    type CatalogNamespace,
    type Catalogs,
} from "./namespaces";

export {
    BUNDLED_LOCALES,
    DEFAULT_LOCALE,
    EN_CATALOGS,
    EN_CATALOG_SOURCE,
    localeResourceKey,
} from "./catalogs";

export { createChromeTranslator, EN_CHROME_TRANSLATOR } from "./chrome";

// `LAZY_LOCALE_LOADERS` is deliberately not re-exported: it is what the
// default path already uses, and a consumer that wants different catalogs
// installs them with `setLocaleLoaders`.
export {
    loadLocaleResources,
    loadLocaleResourcesFor,
    reachableCatalogLocales,
    fetchLocaleLoaders,
    setLocaleLoaders,
    type LocaleLoader,
    type LocaleLoaders,
    type LoadLocaleResourcesOptions,
} from "./load";

export {
    DEFAULT_LOCALE_DATA,
    createTranslatorFromLocaleData,
    type LocaleData,
} from "./localeData";

export {
    MATH_NOTATION_LOCALE,
    formatDecimalString,
    intlLocale,
    listFormatFor,
    type ListType,
} from "./intl";

// `DIAGNOSTIC_CODE_PATTERN` is deliberately not here: it is the rule
// `lint:i18n` holds new codes to, not something anything at runtime should be
// parsing a code with. The lint imports it from `./diagnostics` directly.
export {
    DIAGNOSTIC_CODES,
    createDiagnosticFormatter,
    formatEnglishDiagnostic,
    isDiagnosticCode,
    type DiagnosticArgs,
    type DiagnosticArgValue,
    type DiagnosticCode,
    type DiagnosticFormatter,
    type DiagnosticListArg,
    type FormattableDiagnostic,
} from "./diagnostics";

export { MESSAGE_KEYS, type MessageKey } from "./generated/messageKeys";

export {
    SUPPORTED_LOCALES,
    type SupportedLocale,
    type SupportedLocaleInfo,
} from "./generated/supportedLocales";
