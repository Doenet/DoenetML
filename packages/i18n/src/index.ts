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

export { DEFAULT_LOCALE, EN_CATALOGS, EN_CATALOG_SOURCE } from "./catalogs";

export {
    DEFAULT_LOCALE_DATA,
    createTranslatorFromLocaleData,
    type LocaleData,
} from "./localeData";

export { MESSAGE_KEYS, type MessageKey } from "./generated/messageKeys";
