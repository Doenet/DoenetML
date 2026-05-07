import React, { useEffect, useState, useContext, useRef } from "react";
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

interface ImageSVs {
    hidden: boolean;
    layer: number;
    fixed: boolean;
    fixLocation: boolean;
    draggable: boolean;
    anchor: any;
    positionFromAnchor: any;
    cid?: string;
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
    let [url, setUrl] = useState<string | null>(null);

    // @ts-ignore
    Image.ignoreActionsWithoutCore = () => true;

    let imageJXG = useRef<JXGImage | null>(null);
    let anchorPointJXG = useRef<JXGPoint | null>(null);
    let anchorRel = useRef<[string, string] | null>(null);

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

    const urlOrSource = (SVs.cid ? url : SVs.source) || "";

    const ref = useRef<HTMLDivElement | null>(null);

    useRecordVisibilityChanges(ref, callAction, actions);

    useEffect(() => {
        if (SVs.cid) {
            // TODO: need new approach for getting media
        }
    }, []);

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
            [urlOrSource, offset, [width, height]],
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
            anchorRel,
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
            if (SVs.cid && !url) {
                return null;
            }
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

    let descriptionId: string | undefined = undefined;
    let description: React.ReactNode | null = null;

    if (descriptionChild) {
        descriptionId = `${id}-description-content`;
        description =
            SVs.displayMode === "inline" ? (
                <DescriptionPopover>
                    <div id={descriptionId}>{descriptionChild}</div>
                </DescriptionPopover>
            ) : (
                <DescriptionAsDetails>
                    <div id={descriptionId}>{descriptionChild}</div>
                </DescriptionAsDetails>
            );
    }

    const media = urlOrSource ? (
        <img
            id={id}
            src={urlOrSource}
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
