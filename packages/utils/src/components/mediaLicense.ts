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

/**
 * How a license is phrased in an attribution sentence:
 *  - `"creative-commons"`: "licensed under a <name> license" (and its URL
 *    embeds the Creative Commons version).
 *  - `"license"`: "licensed under the <name>" — for licenses whose name
 *    already contains the word "License"/"Licence" (e.g. MIT, Apache, GFDL).
 *  - `"public-domain"`: "in the public domain (<name>)" — for CC0 and the
 *    Public Domain Mark, which are dedications/marks, not licenses.
 */
export type MediaLicenseKind = "creative-commons" | "license" | "public-domain";

/** Information about a single recognized media license. */
export type MediaLicenseInfo = {
    /** Canonical code as displayed to authors (e.g. `"CC-BY-SA"`). */
    code: string;
    /** Human-readable license name (e.g. `"Creative Commons Attribution-ShareAlike"`). */
    name: string;
    /** One-sentence description, surfaced in editor autocomplete and help. */
    description: string;
    /**
     * How the license is phrased in an attribution and whether its URL is
     * versioned. Only `"creative-commons"` licenses embed the version in
     * `url(version)`; the others ignore the argument.
     */
    kind: MediaLicenseKind;
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
        kind: "creative-commons",
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
    kind: MediaLicenseKind,
): MediaLicenseInfo {
    return {
        code,
        name,
        description,
        kind,
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
        "public-domain",
    ),
    fixedUrlLicense(
        "PDM",
        "Public Domain Mark 1.0",
        "https://creativecommons.org/publicdomain/mark/1.0/",
        "Public Domain Mark: the work is free of known copyright restrictions.",
        "public-domain",
    ),
    fixedUrlLicense(
        "GFDL",
        "GNU Free Documentation License",
        "https://www.gnu.org/licenses/fdl-1.3.html",
        "GNU Free Documentation License: copyleft license common on Wikimedia.",
        "license",
    ),
    fixedUrlLicense(
        "FAL",
        "Free Art License 1.3",
        "https://artlibre.org/licence/lal/en/",
        "Free Art License: copyleft license for artistic works.",
        "license",
    ),
    fixedUrlLicense(
        "OGL",
        "Open Government Licence v3.0 (UK)",
        "https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/",
        "UK Open Government Licence: reuse government material with attribution.",
        "license",
    ),
    fixedUrlLicense(
        "MIT",
        "MIT License",
        "https://opensource.org/license/mit",
        "MIT License: permissive license common for icon and illustration sets.",
        "license",
    ),
    fixedUrlLicense(
        "APACHE-2.0",
        "Apache License 2.0",
        "https://www.apache.org/licenses/LICENSE-2.0",
        "Apache License 2.0: permissive license common for icon and illustration sets.",
        "license",
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

/** A license resolved for display in an attribution sentence. */
export type MediaLicenseDisplay = {
    /** How the license should be phrased (see `MediaLicenseKind`). */
    kind: MediaLicenseKind;
    /**
     * Display label, including the Creative Commons version when applicable
     * (e.g. `"Creative Commons Attribution 4.0"`); for non-CC licenses this is
     * just the license name (the version, if any, is already part of the name).
     */
    label: string;
    /** Canonical URL for the license (versioned for Creative Commons). */
    url: string;
};

/**
 * Resolve a license code (case-insensitively) into the pieces an attribution
 * renderer needs: its phrasing `kind`, a display `label` that includes the
 * Creative Commons version where applicable, and its canonical `url`. Returns
 * `undefined` for an unrecognized code.
 */
export function getMediaLicenseDisplay(
    code: string,
    version?: CreativeCommonsVersion,
): MediaLicenseDisplay | undefined {
    const info = getMediaLicenseInfo(code);
    if (!info) {
        return undefined;
    }
    // Resolve the version once so the label and URL stay consistent: a
    // Creative Commons label and URL both reflect the same version (the
    // provided one, or the default when omitted).
    const resolvedVersion = version ?? defaultCreativeCommonsVersion;
    const label =
        info.kind === "creative-commons"
            ? `${info.name} ${resolvedVersion}`
            : info.name;
    return { kind: info.kind, label, url: info.url(resolvedVersion) };
}
