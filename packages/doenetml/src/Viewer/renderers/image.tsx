import React, { useContext, useMemo, useRef } from "react";
import JXG from "jsxgraph";
import { BoardContext, IMAGE_LAYER_OFFSET } from "./graph";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { sizeToCSS } from "./utils/css";
import { useRecordVisibilityChanges } from "../../utils/visibility";
import me from "math-expressions";
import { DescriptionAsDetails, DescriptionPopover } from "./utils/Description";
import { getNonInlineMediaLayoutStyles } from "./utils/nonInlineMediaLayout";
import { NonInlineMediaWrapper } from "./utils/NonInlineMediaWrapper";
import { JXGElement, JXGPoint } from "./jsxgraph-distrib/types";
import { usePointerDragState } from "./utils/pointerDragState";
import { useDraggableRefs } from "./utils/useDraggableRefs";
import { useBoardPointerTracking } from "./utils/useBoardPointerTracking";
import {
    attachAnchoredGraphDragHandlers,
    detachAnchoredGraphElement,
} from "./utils/useAnchoredGraphDragHandler";
import { useJSXGraphCleanup } from "./utils/useJSXGraphCleanup";
import {
    getMediaLicenseDisplay,
    type MediaLicenseKind,
    type CreativeCommonsVersion,
} from "@doenet/utils";
import { DocContext } from "../DocViewer";

interface ImageSVs {
    hidden: boolean;
    layer: number;
    fixed: boolean;
    fixLocation: boolean;
    draggable: boolean;
    anchor: any;
    positionFromAnchor: any;
    imageId: string | null;
    source: string;
    widthForGraph?: { size: number };
    aspectRatio?: number;
    rotate: number;
    width: { size: string; isAbsolute: boolean };
    displayMode: string;
    horizontalAlign?: string;
    decorative?: boolean;
    shortDescription?: string;
    renderInlineForListItem?: boolean;
    authorName?: string | null;
    authorUrl?: string | null;
    imageName?: string | null;
    originalUrl?: string | null;
    licenseCodes?: string[] | null;
    licenseVersion?: string;
    licenseNames?: string[];
    licenseUrls?: string[];
}

type JXGImage = JXGElement & {
    X(): number;
    Y(): number;
    W(): number;
    H(): number;
    relativeCoords: {
        usrCoords: [number, number, number];
        setCoordinates: Function;
    };
    setSize(width: number, height: number): void;
};

type JXGTransform = JXGElement & {
    bindTo(target: JXGElement): void;
    setMatrix(board: any, type: string, params: any[]): void;
};

export default React.memo(function Image(props: UseDoenetRendererProps) {
    let { componentIdx, id, SVs, children, actions, callAction } =
        useDoenetRenderer<ImageSVs>(props, false);

    // @ts-ignore
    Image.ignoreActionsWithoutCore = () => true;

    const { doenetMediaUrl } = useContext(DocContext) || {};

    let imageJXG = useRef<JXGImage | null>(null);
    let anchorPointJXG = useRef<JXGPoint | null>(null);

    const board = useContext(BoardContext);

    const pointerState = usePointerDragState();
    let pointAtDown = useRef<number[] | null>(null);

    let calculatedX = useRef<number | null>(null);
    let calculatedY = useRef<number | null>(null);

    let previousPositionFromAnchor = useRef<any>(null);
    let currentSize = useRef<[number, number]>([0, 0]);
    let currentOffset = useRef<[number, number]>([0, 0]);

    let rotationTransform = useRef<JXGTransform | null>(null);
    let lastRotate = useRef<number>(SVs.rotate);

    const { fixed, fixLocation, lastPositionFromCore } = useDraggableRefs<
        number[] | null
    >(SVs, null);

    useBoardPointerTracking(board, pointerState);

    useJSXGraphCleanup({
        objectRef: imageJXG,
        destroy: () => detachAnchoredGraphElement(imageJXG, board),
    });

    const url = useMemo(
        () =>
            getUrlForImage({
                source: SVs.source,
                imageId: SVs.imageId,
                doenetMediaUrl,
            }),
        [SVs.source, SVs.imageId, doenetMediaUrl],
    );

    const ref = useRef<HTMLDivElement | null>(null);

    useRecordVisibilityChanges(ref, callAction, actions);

    function createImageJXG() {
        if (board === null) {
            return null;
        }

        //things to be passed to JSXGraph as attributes
        let jsxImageAttributes: Record<string, any> = {
            visible: !SVs.hidden,
            fixed: fixed.current,
            layer: 10 * SVs.layer + IMAGE_LAYER_OFFSET,
            highlight: !fixLocation.current,
        };

        let newAnchorPointJXG: JXGPoint;

        try {
            let anchor = me.fromAst(SVs.anchor);
            let anchorCoords = [
                anchor.get_component(0).evaluate_to_constant() ?? NaN,
                anchor.get_component(1).evaluate_to_constant() ?? NaN,
            ];

            if (!Number.isFinite(anchorCoords[0])) {
                anchorCoords[0] = 0;
                jsxImageAttributes["visible"] = false;
            }
            if (!Number.isFinite(anchorCoords[1])) {
                anchorCoords[1] = 0;
                jsxImageAttributes["visible"] = false;
            }

            newAnchorPointJXG = board.create("point", anchorCoords, {
                visible: false,
            }) as JXGPoint;
        } catch (e) {
            jsxImageAttributes["visible"] = false;
            newAnchorPointJXG = board.create("point", [0, 0], {
                visible: false,
            }) as JXGPoint;
        }

        jsxImageAttributes.anchor = newAnchorPointJXG;

        let width = SVs.widthForGraph?.size || 1;
        let height = width / (SVs.aspectRatio || 1);
        if (!(Number.isFinite(width) && Number.isFinite(height))) {
            width = 0;
            height = 0;
        }

        let offset: [number, number];
        if (SVs.positionFromAnchor === "center") {
            offset = [-width / 2, -height / 2];
        } else if (SVs.positionFromAnchor === "lowerleft") {
            offset = [-width, -height];
        } else if (SVs.positionFromAnchor === "lowerright") {
            offset = [0, -height];
        } else if (SVs.positionFromAnchor === "upperleft") {
            offset = [-width, 0];
        } else if (SVs.positionFromAnchor === "upperright") {
            offset = [0, 0];
        } else if (SVs.positionFromAnchor === "bottom") {
            offset = [-width / 2, -height];
        } else if (SVs.positionFromAnchor === "top") {
            offset = [-width / 2, 0];
        } else if (SVs.positionFromAnchor === "right") {
            offset = [0, -height / 2];
        } else {
            // positionFromAnchor === left
            offset = [-width, -height / 2];
        }
        currentOffset.current = offset;

        let newImageJXG = board.create(
            "image",
            [url, offset, [width, height]],
            jsxImageAttributes,
        ) as JXGImage;

        // tranformation code copied from jsxgraph documentation:
        // https://jsxgraph.uni-bayreuth.de/wiki/index.php?title=Images#The_JavaScript_code_5
        var tOff = board.create(
            "transform",
            [
                function () {
                    return -newImageJXG.X() - newImageJXG.W() * 0.5;
                },
                function () {
                    return -newImageJXG.Y() - newImageJXG.H() * 0.5;
                },
            ],
            { type: "translate" },
        ) as JXGTransform;
        var tOffInverse = board.create(
            "transform",
            [
                function () {
                    return newImageJXG.X() + newImageJXG.W() * 0.5;
                },
                function () {
                    return newImageJXG.Y() + newImageJXG.H() * 0.5;
                },
            ],
            { type: "translate" },
        ) as JXGTransform;
        var tRot = board.create("transform", [SVs.rotate], {
            type: "rotate",
        }) as JXGTransform;

        tOff.bindTo(newImageJXG); // Shift image to origin
        tRot.bindTo(newImageJXG); // Rotate
        tOffInverse.bindTo(newImageJXG); // Shift image back

        rotationTransform.current = tRot;
        lastRotate.current = SVs.rotate;

        attachAnchoredGraphDragHandlers({
            board,
            newJXG: newImageJXG,
            newAnchorPoint: newAnchorPointJXG,
            pointerState,
            pointAtDown,
            calculatedX,
            calculatedY,
            fixed,
            fixLocation,
            lastPositionFromCore,
            componentIdx,
            actions,
            callAction,
            actionNames: {
                move: "moveImage",
                focused: "imageFocused",
                clicked: "imageClicked",
            },
            imageMode: {
                getCurrentSize: () => currentSize.current,
                getCurrentOffset: () => currentOffset.current,
            },
        });

        imageJXG.current = newImageJXG;
        anchorPointJXG.current = newAnchorPointJXG;
        previousPositionFromAnchor.current = SVs.positionFromAnchor;
        currentSize.current = [width, height];

        // need fullUpdate to get initial rotation in case image was from a blob
        imageJXG.current.fullUpdate();
    }

    if (board) {
        let anchorCoords: number[];
        try {
            let anchor = me.fromAst(SVs.anchor);
            anchorCoords = [
                anchor.get_component(0).evaluate_to_constant() ?? NaN,
                anchor.get_component(1).evaluate_to_constant() ?? NaN,
            ];
        } catch (e) {
            anchorCoords = [NaN, NaN];
        }

        lastPositionFromCore.current = anchorCoords;

        if (imageJXG.current === null) {
            createImageJXG();
        } else {
            anchorPointJXG.current?.coords.setCoordinates(
                JXG.COORDS_BY_USER,
                anchorCoords,
            );

            // imageJXG.current.setImage(SVs.image)

            let visible = !SVs.hidden;

            if (
                Number.isFinite(anchorCoords[0]) &&
                Number.isFinite(anchorCoords[1])
            ) {
                let actuallyChangedVisibility =
                    imageJXG.current.visProp["visible"] !== visible;
                imageJXG.current.visProp["visible"] = visible;
                imageJXG.current.visPropCalc["visible"] = visible;

                if (actuallyChangedVisibility) {
                    // this function is incredibly slow, so don't run it if not necessary
                    // TODO: figure out how to make label disappear right away so don't need to run this function
                    imageJXG.current.setAttribute({ visible });
                }
            } else {
                imageJXG.current.visProp["visible"] = false;
                imageJXG.current.visPropCalc["visible"] = false;
            }

            let layer = 10 * SVs.layer + IMAGE_LAYER_OFFSET;
            let layerChanged = imageJXG.current.visProp.layer !== layer;

            if (layerChanged) {
                imageJXG.current.setAttribute({ layer });
            }

            imageJXG.current.visProp.highlight = !fixLocation.current;
            imageJXG.current.visProp.fixed = fixed.current;
            imageJXG.current.isDraggable = !fixLocation.current;

            imageJXG.current.needsUpdate = true;

            let width = SVs.widthForGraph?.size || 1;
            let height = width / (SVs.aspectRatio || 1);
            if (!(Number.isFinite(width) && Number.isFinite(height))) {
                width = 0;
                height = 0;
            }

            let sizeChanged =
                width !== currentSize.current[0] ||
                height !== currentSize.current[1];

            if (sizeChanged) {
                imageJXG.current.setSize(width, height);
                currentSize.current = [width, height];
            }

            if (SVs.rotate != lastRotate.current) {
                rotationTransform.current?.setMatrix(board, "rotate", [
                    SVs.rotate,
                ]);
                lastRotate.current = SVs.rotate;
            }

            if (
                SVs.positionFromAnchor !== previousPositionFromAnchor.current ||
                sizeChanged
            ) {
                let offset: [number, number];
                if (SVs.positionFromAnchor === "center") {
                    offset = [-width / 2, -height / 2];
                } else if (SVs.positionFromAnchor === "lowerleft") {
                    offset = [-width, -height];
                } else if (SVs.positionFromAnchor === "lowerright") {
                    offset = [0, -height];
                } else if (SVs.positionFromAnchor === "upperleft") {
                    offset = [-width, 0];
                } else if (SVs.positionFromAnchor === "upperright") {
                    offset = [0, 0];
                } else if (SVs.positionFromAnchor === "bottom") {
                    offset = [-width / 2, -height];
                } else if (SVs.positionFromAnchor === "top") {
                    offset = [-width / 2, 0];
                } else if (SVs.positionFromAnchor === "right") {
                    offset = [0, -height / 2];
                } else {
                    // positionFromAnchor === left
                    offset = [-width, -height / 2];
                }

                imageJXG.current.relativeCoords.setCoordinates(
                    JXG.COORDS_BY_USER,
                    offset,
                );

                previousPositionFromAnchor.current = SVs.positionFromAnchor;
                currentOffset.current = offset;
                imageJXG.current.fullUpdate();
            } else {
                imageJXG.current.relativeCoords.setCoordinates(
                    JXG.COORDS_BY_USER,
                    currentOffset.current,
                );
                imageJXG.current.update();
            }

            if (anchorPointJXG.current) {
                anchorPointJXG.current.needsUpdate = true;
                anchorPointJXG.current.update();
            }
            board.updateRenderer();
        }

        return <span id={id} />;
    }

    // not in board

    if (SVs.hidden) return null;

    let outerStyle: React.CSSProperties = {};
    let innerStyle: React.CSSProperties = {};
    let mediaContainerStyle: React.CSSProperties = {};
    let mediaColumnStyle: React.CSSProperties = {};

    if (SVs.displayMode === "inline") {
        outerStyle = {
            display: "inline-block",
            verticalAlign: "middle",
            margin: "12px 0",
        };
        innerStyle = {
            display: "inline-flex",
            alignItems: "start",
        };
    } else {
        ({ outerStyle, innerStyle, mediaContainerStyle, mediaColumnStyle } =
            getNonInlineMediaLayoutStyles({
                horizontalAlign: SVs.horizontalAlign,
                mediaWidth: sizeToCSS(SVs.width),
            }));
    }

    let imageStyle: React.CSSProperties = {
        maxWidth: "100%",
        width: sizeToCSS(SVs.width),
    };

    if ((SVs.aspectRatio ?? 0) > 0) {
        imageStyle.aspectRatio = String(SVs.aspectRatio);
    }

    if (!url) {
        imageStyle.border = "var(--mainBorder)";
    }

    // If image is decorative, it is designated by having set alt="".
    // If a shortDescription is merely missing (which will generate a warning)
    // then the alt attribute is omitted.
    const shortDescription = SVs.decorative
        ? ""
        : SVs.shortDescription || undefined;

    // description will be the one non-null child
    const descriptionChild = children.find((child) => child);

    // The author/license attribution is shown at the bottom of the
    // description content. Building it as a sibling of `descriptionChild`
    // inside the description-content `<div>` (which this renderer owns) lets
    // us append it without injecting a component into the `<description>` on
    // the worker side. When there is no authored `<description>`, the
    // attribution alone still produces the same description UI (info
    // button/popover when inline, `<details>` otherwise).
    const attribution = renderImageAttribution({
        idPrefix: id,
        imageName: SVs.imageName,
        authorName: SVs.authorName,
        authorUrl: SVs.authorUrl,
        originalUrl: SVs.originalUrl,
        licenseCodes: SVs.licenseCodes,
        licenseVersion: SVs.licenseVersion,
        licenseNames: SVs.licenseNames,
        licenseUrls: SVs.licenseUrls,
    });

    let descriptionId: string | undefined = undefined;
    let description: React.ReactNode | null = null;

    if (descriptionChild || attribution) {
        descriptionId = `${id}-description-content`;
        const descriptionContent = (
            <div id={descriptionId}>
                {descriptionChild}
                {attribution}
            </div>
        );
        description =
            SVs.displayMode === "inline" ? (
                <DescriptionPopover>{descriptionContent}</DescriptionPopover>
            ) : (
                <DescriptionAsDetails>
                    {descriptionContent}
                </DescriptionAsDetails>
            );
    }

    const media = url ? (
        <img
            id={id}
            src={url}
            style={imageStyle}
            alt={shortDescription}
            aria-details={descriptionId}
        />
    ) : (
        <div id={id} style={imageStyle}>
            {SVs.shortDescription}
        </div>
    );

    return (
        <NonInlineMediaWrapper
            id={id}
            displayMode={SVs.displayMode}
            suppressTopMargin={Boolean(SVs.renderInlineForListItem)}
            layoutStyles={{
                outerStyle,
                innerStyle,
                mediaContainerStyle,
                mediaColumnStyle,
            }}
            media={media}
            description={description}
            containerRef={ref}
        />
    );
});

/** A license resolved into the pieces the attribution sentence needs. */
type AttributionLicense = {
    /** Phrasing kind; `"generic"` covers the preliminary `licenseName` fallback. */
    kind: MediaLicenseKind | "generic";
    /** Display label (the linked text), including the CC version where relevant. */
    label: string;
    /** License URL, or `null` when none is known. */
    url: string | null;
};

/**
 * Whether `url` is safe to place in an `href`. Authors supply the attribution
 * URLs (`originalUrl`, `authorUrl`, and the fallback `licenseUrl`), so guard
 * against script-bearing schemes (`javascript:`, `data:`, `vbscript:`, …) that
 * could run on click. Whitespace and ASCII control characters are stripped
 * first so obfuscated schemes (e.g. `java\tscript:`) cannot slip through. A URL
 * with no scheme (relative or protocol-relative) is treated as safe.
 */
function isSafeHref(url: string): boolean {
    const stripped = url.replace(/[\u0000-\u001f\u007f\s]/g, "").toLowerCase();
    const schemeMatch = stripped.match(/^([a-z][a-z0-9+.-]*):/);
    if (!schemeMatch) {
        return true;
    }
    const scheme = schemeMatch[1];
    return scheme === "http" || scheme === "https" || scheme === "mailto";
}

/**
 * Render `text` as an external link when `url` is given and safe, otherwise as
 * a plain `<span>`. Shared by the attribution's subject, author, and license
 * nodes so the link-or-span branching lives in one place. `key` is for use in
 * lists.
 */
function maybeLink(
    text: React.ReactNode,
    url: string | null | undefined,
    key?: number,
): React.ReactNode {
    return url && isSafeHref(url) ? (
        <a key={key} href={url} target="_blank" rel="noopener noreferrer">
            {text}
        </a>
    ) : (
        <span key={key}>{text}</span>
    );
}

/**
 * Render the author/license attribution shown at the bottom of the image's
 * description content (so it appears in the same info popover/`<details>` UI as
 * an authored `<description>`), or `null` when there is nothing to attribute.
 *
 * The text follows Creative Commons' recommended practice of a single
 * self-describing credit sentence (rather than a `label: value` line or a
 * separate heading). Following the TASL convention (Title, Author, Source,
 * License), the subject is the quoted `imageName` when supplied, otherwise the
 * generic word "Image"; it links to the source (`originalUrl`), and the author
 * name links to `authorUrl` (e.g. the author's profile). The two links are
 * independent — each name carries its own URL — so there is no contention when
 * both are supplied. The license clause is phrased by kind so each reads
 * naturally:
 *   - Creative Commons: "is licensed under a <name> <version> license"
 *   - other licenses (MIT, Apache, GFDL, …): "is licensed under the <name>"
 *     (their names already contain the word "License"/"Licence")
 *   - public domain (CC0, PDM): "is in the public domain (<name>)"
 * Dual licensing (two codes) joins the licenses with "or" since the reuser may
 * choose either. License info is resolved from `licenseCodes` + `licenseVersion`
 * via `@doenet/utils`; when no codes are given, the `licenseNames`/`licenseUrls`
 * fallback is shown with generic phrasing.
 */
function renderImageAttribution({
    idPrefix,
    imageName,
    authorName,
    authorUrl,
    originalUrl,
    licenseCodes,
    licenseVersion,
    licenseNames,
    licenseUrls,
}: {
    idPrefix: string;
    imageName?: string | null;
    authorName?: string | null;
    authorUrl?: string | null;
    originalUrl?: string | null;
    licenseCodes?: string[] | null;
    licenseVersion?: string;
    licenseNames?: string[];
    licenseUrls?: string[];
}): React.ReactNode | null {
    // Resolve each license into kind/label/url. Codes take precedence and carry
    // full phrasing info; otherwise fall back to the preliminary name/url pair
    // (rendered with generic phrasing since its kind is unknown).
    let licenses: AttributionLicense[];
    if (licenseCodes && licenseCodes.length > 0) {
        licenses = [];
        for (const code of licenseCodes) {
            const display = getMediaLicenseDisplay(
                code,
                licenseVersion as CreativeCommonsVersion | undefined,
            );
            // Unknown codes are already dropped by the worker; guard anyway.
            if (display) {
                licenses.push({
                    kind: display.kind,
                    label: display.label,
                    url: display.url,
                });
            }
        }
    } else {
        const names = licenseNames ?? [];
        const urls = licenseUrls ?? [];
        licenses = names.map((name, i) => ({
            kind: "generic" as const,
            label: name,
            url: urls[i] ?? null,
        }));
    }

    const hasAuthor = Boolean(authorName);
    const hasLicense = licenses.length > 0;

    if (!hasAuthor && !hasLicense) {
        return null;
    }

    // The subject of the sentence is the work itself: a quoted `imageName` when
    // supplied (TASL "Title"), otherwise the generic word "Image". It carries
    // the source link (`originalUrl`) since the title is where the work is
    // found.
    const subjectText = imageName ? `\u201C${imageName}\u201D` : "Image";
    const subjectNode = maybeLink(subjectText, originalUrl);

    const subjectAndAuthor = hasAuthor ? (
        <>
            {subjectNode} by {maybeLink(authorName, authorUrl)}
        </>
    ) : (
        subjectNode
    );

    // Join an array of nodes with " or " (the dual-license connector).
    function joinWithOr(nodes: React.ReactNode[]) {
        return nodes.map((node, i) =>
            i === 0 ? (
                <React.Fragment key={i}>{node}</React.Fragment>
            ) : (
                <React.Fragment key={i}> or {node}</React.Fragment>
            ),
        );
    }

    let sentence: React.ReactNode;
    if (!hasLicense) {
        // Author only.
        sentence = <>{subjectAndAuthor}.</>;
    } else if (licenses.every((l) => l.kind === "public-domain")) {
        // Public-domain works are dedicated/marked, not "licensed under".
        const links = joinWithOr(
            licenses.map((l, i) => maybeLink(l.label, l.url, i)),
        );
        sentence = (
            <>
                {subjectAndAuthor} is in the public domain ({links}).
            </>
        );
    } else {
        // Licensed works. Each license becomes a clause phrased by kind, joined
        // with "or" for dual licensing. (A public-domain entry mixed into a
        // license list — not a realistic combination — falls through to the
        // "the <name>" form.)
        const clauses = licenses.map((l, i) => {
            const link = maybeLink(l.label, l.url, i);
            if (l.kind === "creative-commons") {
                return <>a {link} license</>;
            } else if (l.kind === "generic") {
                return <>{link}</>;
            } else {
                return <>the {link}</>;
            }
        });
        sentence = (
            <>
                {subjectAndAuthor} is licensed under {joinWithOr(clauses)}.
            </>
        );
    }

    return (
        <p id={`${idPrefix}-attribution`} className="image-attribution">
            {sentence}
        </p>
    );
}

/**
 * Resolve the URL to use for an image.
 *
 * When the image references a Doenet-hosted media item (`source="doenet:<id>"`),
 * `imageId` holds the `<id>` and the URL is built from `doenetMediaUrl` and that
 * id (avoiding a doubled slash when `doenetMediaUrl` already ends with `/`).
 *
 * A `doenet:` source that did not yield an `imageId` is an unsupported media
 * reference (e.g. a legacy `doenet:cid=<hash>` form); rather than passing the
 * `doenet:` URI through to `<img src>` (which would request an unknown scheme
 * and show a broken-image icon), treat it as missing so the placeholder UI is
 * used. Any other source is an ordinary URL/path and is returned unchanged.
 */
function getUrlForImage({
    source,
    imageId,
    doenetMediaUrl = "https://doenet.org/api/media",
}: {
    source: string;
    imageId: string | null;
    doenetMediaUrl?: string;
}) {
    if (imageId) {
        const separator = doenetMediaUrl.endsWith("/") ? "" : "/";
        return doenetMediaUrl + separator + imageId;
    } else if (/^\s*doenet:/i.test(source)) {
        return "";
    } else {
        return source;
    }
}
