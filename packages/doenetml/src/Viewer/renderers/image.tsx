// @ts-nocheck
import React, { useEffect, useState, useContext, useRef } from "react";
import { BoardContext, IMAGE_LAYER_OFFSET } from "./graph";
import useDoenetRenderer from "../useDoenetRenderer";
import { sizeToCSS } from "./utils/css";
import { useRecordVisibilityChanges } from "../../utils/visibility";
import me from "math-expressions";
import { POINTER_DRAG_THRESHOLD } from "./utils/graph";
import { DescriptionAsDetails, DescriptionPopover } from "./utils/Description";

export default React.memo(function Image(props) {
    let { componentIdx, id, SVs, children, actions, callAction } =
        useDoenetRenderer(props, false);
    let [url, setUrl] = useState(null);

    Image.ignoreActionsWithoutCore = () => true;

    let imageJXG = useRef(null);
    let anchorPointJXG = useRef(null);

    const board = useContext(BoardContext);

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

    const urlOrSource = (SVs.cid ? url : SVs.source) || "";

    const ref = useRef(null);

    useRecordVisibilityChanges(ref, callAction, actions);

    useEffect(() => {
        if (SVs.cid) {
            // TODO: need new approach for getting media
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
        if (board === null) {
            return null;
        }

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
            (document.activeElement as HTMLElement | null)?.blur();

            pointerAtDown.current = [e.x, e.y];
            pointAtDown.current = [...newAnchorPointJXG.coords.scrCoords];
            dragged.current = false;
            pointerIsDown.current = true;
            pointerMovedSinceDown.current = false;
            if (!fixed.current) {
                callAction({
                    action: actions.imageFocused,
                    args: { componentIdx }, // send componentIdx so get original componentIdx if adapted
                });
            }
        });

        newImageJXG.on("hit", function (e) {
            pointAtDown.current = [...newAnchorPointJXG.coords.scrCoords];
            dragged.current = false;
            callAction({
                action: actions.imageFocused,
                args: { componentIdx }, // send componentIdx so get original componentIdx if adapted
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
                    args: { componentIdx }, // send componentIdx so get original componentIdx if adapted
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
                Math.abs(e.x - pointerAtDown.current[0]) >
                    POINTER_DRAG_THRESHOLD ||
                Math.abs(e.y - pointerAtDown.current[1]) >
                    POINTER_DRAG_THRESHOLD
            ) {
                dragged.current = true;
            }

            let [xMin, yMax, xMax, yMin] = board.getBoundingBox();
            let xminAdjusted =
                xMin +
                0.01 * (xMax - xMin) -
                currentOffset.current[0] -
                currentSize.current[0];
            let xmaxAdjusted =
                xMax - 0.01 * (xMax - xMin) - currentOffset.current[0];
            let yminAdjusted =
                yMin +
                0.01 * (yMax - yMin) -
                currentOffset.current[1] -
                currentSize.current[1];
            let ymaxAdjusted =
                yMax - 0.01 * (yMax - yMin) - currentOffset.current[1];

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
                    args: { componentIdx }, // send componentIdx so get original componentIdx if adapted
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
                Math.abs(e.x - pointerAtDown.current[0]) >
                    POINTER_DRAG_THRESHOLD ||
                Math.abs(e.y - pointerAtDown.current[1]) >
                    POINTER_DRAG_THRESHOLD
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
        board?.removeObject(imageJXG.current);
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
            if (SVs.cid && !url) {
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

        return <span id={id} />;
    }

    // not in board

    if (SVs.hidden) return null;

    let outerStyle = {};
    let innerStyle = {};

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

    // If image is decorative, it is designated by having set alt="".
    // If a shortDescription is merely missing (which will generate a warning)
    // then the alt attribute is omitted.
    const shortDescription = SVs.decorative
        ? ""
        : SVs.shortDescription || undefined;

    // description will be the one non-null child
    const descriptionChild = children.find((child) => child);

    const description =
        descriptionChild &&
        (SVs.displayMode === "inline" ? (
            <DescriptionPopover>{descriptionChild}</DescriptionPopover>
        ) : (
            <DescriptionAsDetails>{descriptionChild}</DescriptionAsDetails>
        ));

    return (
        <div style={outerStyle} ref={ref} id={`${id}-container`}>
            <div style={innerStyle}>
                {urlOrSource ? (
                    <img
                        id={id}
                        src={urlOrSource}
                        style={imageStyle}
                        alt={shortDescription}
                    />
                ) : (
                    <div id={id} style={imageStyle}>
                        {SVs.shortDescription}
                    </div>
                )}
                {description}
            </div>
        </div>
    );
});
