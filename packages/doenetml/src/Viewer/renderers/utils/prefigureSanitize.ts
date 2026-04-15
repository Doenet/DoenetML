import DOMPurify from "dompurify";
import { PrefigureBuildResult } from "./prefigureRuntime";

const FORBIDDEN_MARKUP_TAGS = new Set([
    "script",
    "foreignobject",
    "iframe",
    "object",
    "embed",
    "link",
    "meta",
    "base",
]);

const URL_ATTRIBUTE_NAMES = new Set([
    "href",
    "xlink:href",
    "src",
    "data",
    "action",
    "formaction",
    "poster",
]);

export function normalizeSerializedMarkup(value: unknown): string {
    if (typeof value !== "string") {
        return "";
    }

    let text = value;

    for (let ind = 0; ind < 2; ind++) {
        const trimmed = text.trim();

        if (!(trimmed.startsWith('"') && trimmed.endsWith('"'))) {
            break;
        }

        try {
            const parsed = JSON.parse(trimmed);
            if (typeof parsed === "string") {
                text = parsed;
            } else {
                break;
            }
        } catch (_e) {
            break;
        }
    }

    return text;
}

export function hasAnnotationsXml(value: string): boolean {
    const trimmed = value.trim();
    if (!trimmed) {
        return false;
    }

    // The annotations payload uses <diagram> as its root element.
    return /<diagram\b/i.test(trimmed);
}

function isUnsafeUrl(value: string): boolean {
    const normalized = value.trim().replace(/\s+/g, "").toLowerCase();
    return (
        normalized.startsWith("javascript:") ||
        normalized.startsWith("vbscript:") ||
        normalized.startsWith("data:") ||
        normalized.startsWith("file:") ||
        normalized.startsWith("//")
    );
}

function isLocalSvgFragmentReference(value: string): boolean {
    return value.trim().startsWith("#");
}

function sanitizeXmlMarkup({
    markup,
    mimeType,
    allowedRootNames,
}: {
    markup: string;
    mimeType: DOMParserSupportedType;
    allowedRootNames: Set<string>;
}): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(markup, mimeType);

    if (doc.getElementsByTagName("parsererror").length > 0) {
        return "";
    }

    const root = doc.documentElement;
    const rootName = root?.tagName?.toLowerCase?.();
    if (!rootName || !allowedRootNames.has(rootName)) {
        return "";
    }

    const elements = [root, ...Array.from(root.getElementsByTagName("*"))];
    for (const element of elements) {
        const tagName = (element.localName || element.tagName).toLowerCase();

        if (FORBIDDEN_MARKUP_TAGS.has(tagName)) {
            element.remove();
            continue;
        }

        const attributes = Array.from(element.attributes);
        for (const attribute of attributes) {
            const name = attribute.name.toLowerCase();
            const localName = (
                attribute.localName || attribute.name
            ).toLowerCase();
            const value = attribute.value.trim();
            const isEventHandler = name.startsWith("on");
            const isUseHrefAttr = tagName === "use" && localName === "href";
            const hasUnsafeUseHref =
                isUseHrefAttr && !isLocalSvgFragmentReference(value);
            const isScriptUrl = isUnsafeUrl(value);
            const hasUnsafeUrl =
                (URL_ATTRIBUTE_NAMES.has(name) ||
                    URL_ATTRIBUTE_NAMES.has(localName)) &&
                isScriptUrl;
            const hasStyleAttr = name === "style";
            if (
                isEventHandler ||
                hasUnsafeUseHref ||
                hasUnsafeUrl ||
                hasStyleAttr
            ) {
                element.removeAttribute(attribute.name);
            }
        }
    }

    return new XMLSerializer().serializeToString(root);
}

export function sanitizeSvgMarkup(markup: string): string {
    const purified = DOMPurify.sanitize(markup, {
        USE_PROFILES: { svg: true, svgFilters: true },
        ADD_TAGS: ["use"],
        FORBID_TAGS: ["foreignObject", "iframe", "object", "embed"],
        FORBID_ATTR: ["style"],
        ALLOW_UNKNOWN_PROTOCOLS: false,
        RETURN_TRUSTED_TYPE: false,
    });

    if (typeof purified !== "string") {
        return "";
    }

    return sanitizeXmlMarkup({
        markup: purified,
        mimeType: "image/svg+xml",
        allowedRootNames: new Set(["svg"]),
    });
}

function parseSvgLength(value: string | null): number | null {
    if (!value) {
        return null;
    }

    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

/**
 * Convert a built PreFigure SVG into a container-responsive SVG.
 *
 * PreFigure output can arrive with fixed width/height attributes, which makes
 * the browser lay it out at a rigid pixel size. In narrower graph containers
 * that can truncate the visible drawing even though the underlying SVG content
 * is complete. By ensuring a viewBox exists and then switching the root SVG to
 * width/height 100%, the browser scales the existing viewport to fit the graph
 * frame instead of clipping it. If no usable viewBox exists and one cannot be
 * derived from numeric width/height attributes, preserve the original sizing
 * so this normalization step does not change SVG layout semantics.
 */
export function normalizeSvgViewport(markup: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(markup, "image/svg+xml");
    if (doc.getElementsByTagName("parsererror").length > 0) {
        return "";
    }

    const root = doc.documentElement;
    if (!root || root.tagName.toLowerCase() !== "svg") {
        return "";
    }

    let hasUsableViewBox = Boolean(root.getAttribute("viewBox"));

    if (!hasUsableViewBox) {
        const width = parseSvgLength(root.getAttribute("width"));
        const height = parseSvgLength(root.getAttribute("height"));

        if (width !== null && height !== null) {
            // Preserve the original drawing coordinates before replacing the
            // fixed outer size with responsive sizing.
            root.setAttribute("viewBox", `0 0 ${width} ${height}`);
            hasUsableViewBox = true;
        }
    }

    if (hasUsableViewBox) {
        root.setAttribute("width", "100%");
        root.setAttribute("height", "100%");
        if (!root.getAttribute("preserveAspectRatio")) {
            // Keep the full diagram visible when the container aspect ratio differs
            // from the original SVG dimensions.
            root.setAttribute("preserveAspectRatio", "xMidYMid meet");
        }
    }

    return new XMLSerializer().serializeToString(root);
}

export function sanitizeAnnotationsMarkup(markup: string): string {
    return sanitizeXmlMarkup({
        markup,
        mimeType: "application/xml",
        allowedRootNames: new Set(["diagram"]),
    });
}

export function sanitizeBuildResult(data: PrefigureBuildResult): {
    svgMarkup: string;
    svgMessage: string;
    annotationsXml: string;
} {
    let svgMarkup = "";
    let svgMessage = "";

    const svg = normalizeSerializedMarkup(data.svg);
    if (svg) {
        const sanitizedSvg = sanitizeSvgMarkup(svg);
        const responsiveSvg = sanitizedSvg
            ? normalizeSvgViewport(sanitizedSvg)
            : "";

        if (responsiveSvg) {
            svgMarkup = responsiveSvg;
            svgMessage = "";
        } else {
            svgMarkup = "";
            svgMessage = "Error: Invalid or unsafe SVG in build response.";
        }
    } else {
        svgMarkup = "";
        svgMessage = "Error: No SVG found in response.";
    }

    const annotationsMarkup = normalizeSerializedMarkup(data.annotationsXml);
    const annotationsXml = annotationsMarkup
        ? sanitizeAnnotationsMarkup(annotationsMarkup)
        : "";

    return {
        svgMarkup,
        svgMessage,
        annotationsXml,
    };
}
