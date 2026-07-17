import React, { useEffect, useState, useContext, useRef } from "react";
import { BoardContext, IMAGE_LAYER_OFFSET } from "./graph";
import { retrieveMediaForCid, getMediaLicenseDisplay } from "@doenet/utils";
import useDoenetRenderer from "../useDoenetRenderer";
import { PageContext } from "../PageViewer";
import { sizeToCSS } from "./utils/css";
import VisibilitySensor from "react-visibility-sensor-v2";
import me from "math-expressions";

export default React.memo(function Image(props) {
    let { name, id, SVs, actions, callAction } = useDoenetRenderer(
        props,
        false,
    );
    let [url, setUrl] = useState(null);

    Image.ignoreActionsWithoutCore = () => true;

    let imageJXG = useRef(null);
    let anchorPointJXG = useRef(null);

    const board = useContext(BoardContext);

    const { doenetImagesUrl } = useContext(PageContext) || {};

    let pointerAtDown = useRef(null);
    let pointAtDown = useRef(null);
    let pointerIsDown = useRef(false);
    let pointerMovedSinceDown = useRef(false);
    let dragged = useRef(false);

    let calculatedX = useRef(null);
    let calculatedY = useRef(null);

    let lastPositionFromCore = useRef(null);
    let previousPositionFromAnchor = useRef(null);
    let currentSize = useRef(null);

    let currentOffset = useRef(null);

    let rotationTransform = useRef(null);
    let lastRotate = useRef(SVs.rotate);

    let fixed = useRef(false);
    let fixLocation = useRef(false);

    fixed.current = SVs.fixed;
    fixLocation.current = !SVs.draggable || SVs.fixLocation || SVs.fixed;

    // cid sources resolve asynchronously to a blob URL (`url` state);
    // everything else resolves synchronously from the source/imageId.
    const urlOrSource =
        (SVs.cid
            ? url
            : getUrlForImage({
                  source: SVs.source || "",
                  imageId: SVs.imageId,
                  doenetImagesUrl,
              })) || "";

    let onChangeVisibility = (isVisible) => {
        callAction({
            action: actions.recordVisibilityChange,
            args: { isVisible },
        });
    };

    useEffect(() => {
        return () => {
            callAction({
                action: actions.recordVisibilityChange,
                args: { isVisible: false },
            });
        };
    }, []);

    useEffect(() => {
        if (SVs.cid) {
            retrieveMediaForCid(SVs.cid, SVs.mimeType)
                .then((result) => {
                    // console.log('retrieved media')
                    // console.log(result)
                    setUrl(result.mediaURL);
                })
                .catch((e) => {
                    //Ignore errors for now
                });
        }
    }, []);

    useEffect(() => {
        //On unmount
        return () => {
            // if line is defined
            if (imageJXG.current !== null) {
                deleteImageJXG();
            }

            if (board) {
                board.off("move", boardMoveHandler);
            }
        };
    }, []);

    useEffect(() => {
        if (board) {
            board.on("move", boardMoveHandler);
        }
    }, [board]);

    function createImageJXG() {
        //things to be passed to JSXGraph as attributes
        let jsxImageAttributes = {
            visible: !SVs.hidden,
            fixed: fixed.current,
            layer: 10 * SVs.layer + IMAGE_LAYER_OFFSET,
            highlight: !fixLocation.current,
        };

        let newAnchorPointJXG;

        try {
            let anchor = me.fromAst(SVs.anchor);
            let anchorCoords = [
                anchor.get_component(0).evaluate_to_constant(),
                anchor.get_component(1).evaluate_to_constant(),
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
            });
        } catch (e) {
            jsxImageAttributes["visible"] = false;
            newAnchorPointJXG = board.create("point", [0, 0], {
                visible: false,
            });
        }

        jsxImageAttributes.anchor = newAnchorPointJXG;

        let width = SVs.widthForGraph?.size || 1;
        let height = width / (SVs.aspectRatio || 1);
        if (!(Number.isFinite(width) && Number.isFinite(height))) {
            width = 0;
            height = 0;
        }

        let offset;
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
            [urlOrSource, offset, [width, height]],
            jsxImageAttributes,
        );

        newImageJXG.isDraggable = !fixLocation.current;

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
        );
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
        );
        var tRot = board.create("transform", [SVs.rotate], { type: "rotate" });

        tOff.bindTo(newImageJXG); // Shift image to origin
        tRot.bindTo(newImageJXG); // Rotate
        tOffInverse.bindTo(newImageJXG); // Shift image back

        rotationTransform.current = tRot;
        lastRotate.current = SVs.rotate;

        newImageJXG.on("down", function (e) {
            pointerAtDown.current = [e.x, e.y];
            pointAtDown.current = [...newAnchorPointJXG.coords.scrCoords];
            dragged.current = false;
            pointerIsDown.current = true;
            pointerMovedSinceDown.current = false;
            if (!fixed.current) {
                callAction({
                    action: actions.imageFocused,
                    args: { name }, // send name so get original name if adapted
                });
            }
        });

        newImageJXG.on("hit", function (e) {
            pointAtDown.current = [...newAnchorPointJXG.coords.scrCoords];
            dragged.current = false;
            callAction({
                action: actions.imageFocused,
                args: { name }, // send name so get original name if adapted
            });
        });

        newImageJXG.on("up", function (e) {
            if (dragged.current) {
                callAction({
                    action: actions.moveImage,
                    args: {
                        x: calculatedX.current,
                        y: calculatedY.current,
                    },
                });
                dragged.current = false;
            } else if (!pointerMovedSinceDown.current && !fixed.current) {
                callAction({
                    action: actions.imageClicked,
                    args: { name }, // send name so get original name if adapted
                });
            }
            pointerIsDown.current = false;
        });

        newImageJXG.on("keyfocusout", function (e) {
            if (dragged.current) {
                callAction({
                    action: actions.moveImage,
                    args: {
                        x: calculatedX.current,
                        y: calculatedY.current,
                    },
                });
                dragged.current = false;
            }
        });

        newImageJXG.on("drag", function (e) {
            let viaPointer = e.type === "pointermove";

            //Protect against very small unintended drags
            if (
                !viaPointer ||
                Math.abs(e.x - pointerAtDown.current[0]) > 0.1 ||
                Math.abs(e.y - pointerAtDown.current[1]) > 0.1
            ) {
                dragged.current = true;
            }

            let [xmin, ymax, xmax, ymin] = board.getBoundingBox();
            let xminAdjusted =
                xmin +
                0.01 * (xmax - xmin) -
                currentOffset.current[0] -
                currentSize.current[0];
            let xmaxAdjusted =
                xmax - 0.01 * (xmax - xmin) - currentOffset.current[0];
            let yminAdjusted =
                ymin +
                0.01 * (ymax - ymin) -
                currentOffset.current[1] -
                currentSize.current[1];
            let ymaxAdjusted =
                ymax - 0.01 * (ymax - ymin) - currentOffset.current[1];

            if (viaPointer) {
                // the reason we calculate point position with this algorithm,
                // rather than using .X() and .Y() directly
                // is that attributes .X() and .Y() are affected by the
                // .setCoordinates function called in update().
                // Due to this dependence, the location of .X() and .Y()
                // can be affected by constraints of objects that the points depends on,
                // leading to a different location on up than on drag
                // (as dragging uses the mouse location)
                // TODO: find an example where need this this additional complexity

                var o = board.origin.scrCoords;

                calculatedX.current =
                    (pointAtDown.current[1] +
                        e.x -
                        pointerAtDown.current[0] -
                        o[1]) /
                    board.unitX;

                calculatedY.current =
                    (o[2] -
                        (pointAtDown.current[2] +
                            e.y -
                            pointerAtDown.current[1])) /
                    board.unitY;
            } else {
                calculatedX.current =
                    newAnchorPointJXG.X() +
                    newImageJXG.relativeCoords.usrCoords[1] -
                    currentOffset.current[0];
                calculatedY.current =
                    newAnchorPointJXG.Y() +
                    newImageJXG.relativeCoords.usrCoords[2] -
                    currentOffset.current[1];
            }

            calculatedX.current = Math.min(
                xmaxAdjusted,
                Math.max(xminAdjusted, calculatedX.current),
            );
            calculatedY.current = Math.min(
                ymaxAdjusted,
                Math.max(yminAdjusted, calculatedY.current),
            );

            callAction({
                action: actions.moveImage,
                args: {
                    x: calculatedX.current,
                    y: calculatedY.current,
                    transient: true,
                    skippable: true,
                },
            });

            newImageJXG.relativeCoords.setCoordinates(
                JXG.COORDS_BY_USER,
                currentOffset.current,
            );
            newAnchorPointJXG.coords.setCoordinates(
                JXG.COORDS_BY_USER,
                lastPositionFromCore.current,
            );
        });

        newImageJXG.on("keydown", function (e) {
            if (e.key === "Enter") {
                if (dragged.current) {
                    callAction({
                        action: actions.moveImage,
                        args: {
                            x: calculatedX.current,
                            y: calculatedY.current,
                        },
                    });
                    dragged.current = false;
                }
                callAction({
                    action: actions.imageClicked,
                    args: { name }, // send name so get original name if adapted
                });
            }
        });

        imageJXG.current = newImageJXG;
        anchorPointJXG.current = newAnchorPointJXG;
        previousPositionFromAnchor.current = SVs.positionFromAnchor;
        currentSize.current = [width, height];

        // need fullUpdate to get initial rotation in case image was from a blob
        imageJXG.current.fullUpdate();
    }

    function boardMoveHandler(e) {
        if (pointerIsDown.current) {
            //Protect against very small unintended move
            if (
                Math.abs(e.x - pointerAtDown.current[0]) > 0.1 ||
                Math.abs(e.y - pointerAtDown.current[1]) > 0.1
            ) {
                pointerMovedSinceDown.current = true;
            }
        }
    }

    function deleteImageJXG() {
        imageJXG.current.off("drag");
        imageJXG.current.off("down");
        imageJXG.current.off("hit");
        imageJXG.current.off("up");
        imageJXG.current.off("keyfocusout");
        imageJXG.current.off("keydown");
        board.removeObject(imageJXG.current);
        imageJXG.current = null;
    }

    if (board) {
        let anchorCoords;
        try {
            let anchor = me.fromAst(SVs.anchor);
            anchorCoords = [
                anchor.get_component(0).evaluate_to_constant(),
                anchor.get_component(1).evaluate_to_constant(),
            ];
        } catch (e) {
            anchorCoords = [NaN, NaN];
        }

        lastPositionFromCore.current = anchorCoords;

        if (imageJXG.current === null) {
            // Don't create the JSXGraph image until we have a non-empty URL,
            // e.g., while a cid is still resolving to a blob URL, or for an
            // unsupported doenet: source that has no URL at all.
            if (!urlOrSource) {
                return null;
            }
            createImageJXG();
        } else {
            anchorPointJXG.current.coords.setCoordinates(
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
                rotationTransform.current.setMatrix(board, "rotate", [
                    SVs.rotate,
                ]);
                lastRotate.current = SVs.rotate;
            }

            if (
                SVs.positionFromAnchor !== previousPositionFromAnchor.current ||
                sizeChanged
            ) {
                let offset;
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

            anchorPointJXG.current.needsUpdate = true;
            anchorPointJXG.current.update();
            board.updateRenderer();
        }

        return <a name={id} />;
    }

    // not in board

    if (SVs.hidden) return null;

    let outerStyle = {};

    if (SVs.displayMode === "inline") {
        outerStyle = {
            display: "inline-block",
            verticalAlign: "middle",
            margin: "12px 0",
        };
    } else {
        outerStyle = {
            display: "flex",
            justifyContent: SVs.horizontalAlign,
            margin: "12px 0",
        };
    }

    let imageStyle = {
        maxWidth: "100%",
        width: sizeToCSS(SVs.width),
    };

    if (SVs.aspectRatio > 0) {
        imageStyle.aspectRatio = String(SVs.aspectRatio);
    }

    if (!urlOrSource) {
        imageStyle.border = "var(--mainBorder)";
    }

    const media = urlOrSource ? (
        <img id={id} src={urlOrSource} style={imageStyle} alt={SVs.description} />
    ) : (
        <div id={id} style={imageStyle}>
            {SVs.description}
        </div>
    );

    // The author/license attribution is shown as a caption beneath the image.
    // (DoenetML 0.7 shows it inside the image's description info popover/details
    // UI, which this 0.6 line does not have, so a caption is the closest fit.)
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

    // When there is an attribution, stack it below the image in a column so it
    // reads as a caption; the column's alignment follows `horizontalAlign`.
    // Without an attribution, the image is rendered directly so existing markup
    // is unchanged.
    const alignItems =
        SVs.horizontalAlign === "left"
            ? "flex-start"
            : SVs.horizontalAlign === "right"
              ? "flex-end"
              : "center";

    return (
        <VisibilitySensor
            partialVisibility={true}
            onChange={onChangeVisibility}
        >
            <div style={outerStyle}>
                <a name={id} />
                {attribution ? (
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems,
                        }}
                    >
                        {media}
                        {attribution}
                    </div>
                ) : (
                    media
                )}
            </div>
        </VisibilitySensor>
    );
});

/**
 * Whether `url` is safe to place in an `href`. Authors supply the attribution
 * URLs (`originalUrl`, `authorUrl`, and the fallback `licenseUrl`), so guard
 * against script-bearing schemes (`javascript:`, `data:`, `vbscript:`, …) that
 * could run on click. Whitespace and ASCII control characters are stripped
 * first so obfuscated schemes (e.g. `java\tscript:`) cannot slip through. A URL
 * with no scheme (relative or protocol-relative) is treated as safe.
 */
function isSafeHref(url) {
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
function maybeLink(text, url, key) {
    return url && isSafeHref(url) ? (
        <a key={key} href={url} target="_blank" rel="noopener noreferrer">
            {text}
        </a>
    ) : (
        <span key={key}>{text}</span>
    );
}

/**
 * Render the author/license attribution shown beneath the image, or `null` when
 * there is nothing to attribute.
 *
 * The text follows Creative Commons' recommended practice of a single
 * self-describing credit sentence. Following the TASL convention (Title,
 * Author, Source, License), the subject is the quoted `imageName` when supplied,
 * otherwise the generic word "Image"; it links to the source (`originalUrl`),
 * and the author name links to `authorUrl`. The license clause is phrased by
 * kind so each reads naturally:
 *   - Creative Commons: "is licensed under a <name> <version> license"
 *   - other licenses (MIT, Apache, GFDL, …): "is licensed under the <name>"
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
}) {
    // Resolve each license into kind/label/url. Codes take precedence and carry
    // full phrasing info; otherwise fall back to the preliminary name/url pair
    // (rendered with generic phrasing since its kind is unknown).
    let licenses;
    if (licenseCodes && licenseCodes.length > 0) {
        licenses = [];
        for (const code of licenseCodes) {
            const display = getMediaLicenseDisplay(code, licenseVersion);
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
            kind: "generic",
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
    const subjectText = imageName ? `“${imageName}”` : "Image";
    const subjectNode = maybeLink(subjectText, originalUrl);

    const subjectAndAuthor = hasAuthor ? (
        <>
            {subjectNode} by {maybeLink(authorName, authorUrl)}
        </>
    ) : (
        subjectNode
    );

    // Join an array of nodes with " or " (the dual-license connector).
    function joinWithOr(nodes) {
        return nodes.map((node, i) =>
            i === 0 ? (
                <React.Fragment key={i}>{node}</React.Fragment>
            ) : (
                <React.Fragment key={i}> or {node}</React.Fragment>
            ),
        );
    }

    let sentence;
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
        <p
            id={`${idPrefix}-attribution`}
            className="image-attribution"
            style={{
                margin: "0.35em 0 0",
                maxWidth: "100%",
                fontSize: "0.85em",
                fontStyle: "italic",
                opacity: 0.85,
            }}
        >
            {sentence}
        </p>
    );
}

/**
 * Resolve the URL to use for an image.
 *
 * When the image references a Doenet-hosted media item (`source="doenet:<id>"`),
 * `imageId` holds the `<id>` and the URL is built from `doenetImagesUrl` and that
 * id (avoiding a doubled slash when `doenetImagesUrl` already ends with `/`).
 *
 * A `doenet:` source that did not yield an `imageId` and is not handled
 * elsewhere (the `doenet:cid=` form is resolved separately into a blob URL)
 * is an unsupported media reference; return "" so the placeholder UI is used
 * rather than handing the `doenet:` URI to an <img> or JSXGraph. Any other
 * source is an ordinary URL/path and is returned unchanged.
 */
function getUrlForImage({
    source,
    imageId,
    doenetImagesUrl = "https://media.doenet.org/images",
}) {
    if (imageId) {
        const separator = doenetImagesUrl.endsWith("/") ? "" : "/";
        return doenetImagesUrl + separator + imageId;
    } else if (/^\s*doenet:/i.test(source)) {
        return "";
    } else {
        return source;
    }
}
