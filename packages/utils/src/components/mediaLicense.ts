/**
 * Open-licensing metadata for media (images, and potentially other media in the
 * future). A DoenetML author tags a `<image>` with one or more license *codes*
 * (e.g. `CC-BY-SA`); the codes are matched case-insensitively but are displayed
 * to authors in the canonical case defined here. From the codes (and, for
 * Creative Commons licenses, a license version) the worker derives
 * human-readable license names and canonical license URLs.
 *
 * This list is exported publicly from `@doenet/doenetml` and
 * `@doenet/doenetml-iframe` so apps embedding the editor/viewer can build their
 * own license pickers from the same source of truth.
 */

/** A Creative Commons license version whose URL embeds the version number. */
export type CreativeCommonsVersion = "1.0" | "2.0" | "2.5" | "3.0" | "4.0";

/** The Creative Commons license versions DoenetML recognizes, oldest first. */
export const creativeCommonsVersions: CreativeCommonsVersion[] = [
    "1.0",
    "2.0",
    "2.5",
    "3.0",
    "4.0",
];

/** The default Creative Commons version used when an author omits it. */
export const defaultCreativeCommonsVersion: CreativeCommonsVersion = "4.0";

/** Information about a single recognized media license. */
export type MediaLicenseInfo = {
    /** Canonical code as displayed to authors (e.g. `"CC-BY-SA"`). */
    code: string;
    /** Human-readable license name (e.g. `"Creative Commons Attribution-ShareAlike"`). */
    name: string;
    /** One-sentence description, surfaced in editor autocomplete and help. */
    description: string;
    /**
     * Whether this is a Creative Commons license whose canonical URL embeds the
     * version number. When `true`, `url(version)` varies with the version; when
     * `false`, the version is ignored.
     */
    isCreativeCommons: boolean;
    /**
     * Build the canonical URL for this license. For Creative Commons licenses
     * the URL embeds the version; other licenses ignore the argument and return
     * a fixed URL.
     */
    url: (version?: CreativeCommonsVersion) => string;
};

/**
 * Helper to build a Creative Commons license entry whose URL embeds the
 * version, e.g. `https://creativecommons.org/licenses/by-sa/4.0/`. The
 * display name is prefixed with "Creative Commons " so an attribution link
 * reads e.g. "Creative Commons Attribution-ShareAlike" rather than the
 * ambiguous bare "Attribution-ShareAlike".
 */
function creativeCommonsLicense(
    code: string,
    name: string,
    urlSlug: string,
    description: string,
): MediaLicenseInfo {
    return {
        code,
        name: `Creative Commons ${name}`,
        description,
        isCreativeCommons: true,
        url: (version = defaultCreativeCommonsVersion) =>
            `https://creativecommons.org/licenses/${urlSlug}/${version}/`,
    };
}

/** Helper to build a license entry with a fixed (version-independent) URL. */
function fixedUrlLicense(
    code: string,
    name: string,
    url: string,
    description: string,
): MediaLicenseInfo {
    return {
        code,
        name,
        description,
        isCreativeCommons: false,
        url: () => url,
    };
}

/**
 * The recognized media licenses, in the order they should be offered to
 * authors (most permissive / most common first).
 */
export const mediaLicenses: MediaLicenseInfo[] = [
    creativeCommonsLicense(
        "CC-BY",
        "Attribution",
        "by",
        "Creative Commons Attribution: reuse with credit, including commercially.",
    ),
    creativeCommonsLicense(
        "CC-BY-SA",
        "Attribution-ShareAlike",
        "by-sa",
        "Creative Commons Attribution-ShareAlike: reuse with credit; adaptations keep the same license.",
    ),
    creativeCommonsLicense(
        "CC-BY-ND",
        "Attribution-NoDerivatives",
        "by-nd",
        "Creative Commons Attribution-NoDerivatives: reuse unchanged, with credit.",
    ),
    creativeCommonsLicense(
        "CC-BY-NC",
        "Attribution-NonCommercial",
        "by-nc",
        "Creative Commons Attribution-NonCommercial: reuse with credit for noncommercial purposes.",
    ),
    creativeCommonsLicense(
        "CC-BY-NC-SA",
        "Attribution-NonCommercial-ShareAlike",
        "by-nc-sa",
        "Creative Commons Attribution-NonCommercial-ShareAlike: noncommercial reuse with credit; adaptations keep the same license.",
    ),
    creativeCommonsLicense(
        "CC-BY-NC-ND",
        "Attribution-NonCommercial-NoDerivatives",
        "by-nc-nd",
        "Creative Commons Attribution-NonCommercial-NoDerivatives: reuse unchanged for noncommercial purposes, with credit.",
    ),
    fixedUrlLicense(
        "CC0",
        "CC0 1.0 Public Domain Dedication",
        "https://creativecommons.org/publicdomain/zero/1.0/",
        "Creative Commons Zero: the creator has dedicated the work to the public domain.",
    ),
    fixedUrlLicense(
        "PDM",
        "Public Domain Mark 1.0",
        "https://creativecommons.org/publicdomain/mark/1.0/",
        "Public Domain Mark: the work is free of known copyright restrictions.",
    ),
    fixedUrlLicense(
        "GFDL",
        "GNU Free Documentation License",
        "https://www.gnu.org/licenses/fdl-1.3.html",
        "GNU Free Documentation License: copyleft license common on Wikimedia.",
    ),
    fixedUrlLicense(
        "FAL",
        "Free Art License 1.3",
        "https://artlibre.org/licence/lal/en/",
        "Free Art License: copyleft license for artistic works.",
    ),
    fixedUrlLicense(
        "OGL",
        "Open Government Licence v3.0 (UK)",
        "https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/",
        "UK Open Government Licence: reuse government material with attribution.",
    ),
    fixedUrlLicense(
        "MIT",
        "MIT License",
        "https://opensource.org/license/mit",
        "MIT License: permissive license common for icon and illustration sets.",
    ),
    fixedUrlLicense(
        "APACHE-2.0",
        "Apache License 2.0",
        "https://www.apache.org/licenses/LICENSE-2.0",
        "Apache License 2.0: permissive license common for icon and illustration sets.",
    ),
];

/**
 * Lookup of license info by lower-cased code. Built once so case-insensitive
 * lookups (e.g. of the worker's lower-cased `licenseCodes`) are O(1).
 */
const mediaLicensesByLowerCode: Record<string, MediaLicenseInfo> =
    Object.fromEntries(
        mediaLicenses.map((info) => [info.code.toLowerCase(), info]),
    );

/**
 * Return the license info for a code, matched case-insensitively, or
 * `undefined` if the code is not recognized.
 */
export function getMediaLicenseInfo(
    code: string,
): MediaLicenseInfo | undefined {
    return mediaLicensesByLowerCode[code.toLowerCase()];
}
