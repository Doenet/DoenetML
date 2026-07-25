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
    declaredDocumentLocale,
    resolveDocumentLocale,
    resolveUiLocale,
    type NegotiateLocalesOptions,
} from "./negotiate";

export {
    pseudoLocalize,
    PSEUDO_LOCALE,
    type PseudoLocalizeOptions,
} from "./pseudo";

export {
    CATALOG_NAMESPACES,
    WORKER_NAMESPACES,
    CHROME_NAMESPACES,
    combineCatalogs,
    type CatalogNamespace,
    type Catalogs,
} from "./namespaces";

export {
    DEFAULT_LOCALE,
    EN_CATALOGS,
    EN_CATALOG_SOURCE,
    localeResourceKey,
} from "./catalogs";

export { createChromeTranslator, EN_CHROME_TRANSLATOR } from "./chrome";

export { bundledResources } from "./bundled";

export {
    DEFAULT_LOCALE_DATA,
    createTranslatorFromLocaleData,
    type LocaleData,
} from "./localeData";

export {
    DIAGNOSTIC_CODES,
    DIAGNOSTIC_CODE_PATTERN,
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
