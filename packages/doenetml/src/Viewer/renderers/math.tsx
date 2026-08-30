import React, { useCallback, useContext, useEffect, useRef } from "react";
import JXG from "jsxgraph";
import { BoardContext, TEXT_LAYER_OFFSET } from "./graph";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { DynamicMath } from "./utils/DynamicMath";
import me from "math-expressions";
import { textRendererStyle } from "@doenet/utils";
import { getPositionFromAnchorByCoordinate } from "./utils/graph";
import { DocContext } from "../DocViewer";
import { JXGObject } from "./jsxgraph-distrib/types";
import { ChoiceInputInlineContext } from "./choiceInput";
import type { ResolvedStyleDefinition } from "@doenet/utils";
import { usePointerDragState } from "./utils/pointerDragState";
import { useDraggableRefs } from "./utils/useDraggableRefs";
import { useBoardPointerTracking } from "./utils/useBoardPointerTracking";
import {
    attachAnchoredGraphDragHandlers,
    detachAnchoredGraphElement,
} from "./utils/useAnchoredGraphDragHandler";
import { useJSXGraphCleanup } from "./utils/useJSXGraphCleanup";
import { resolveBackgroundColor, resolveTextColor } from "./utils/styleColors";
import {
    MathSlot,
    MathSlotProvider,
    useMathSlots,
} from "./utils/mathInputSlots";
import { useContentT } from "../../utils/i18n";
import "./math.css";

interface MathSVs {
    [key: string]: any;
    hidden: boolean;
    layer: number;
    fixed: boolean;
    fixLocation: boolean;
    draggable: boolean;
    anchor: any;
    positionFromAnchor: any;
    latex: string;
    /** `latex` with a marker per embedded input; see `mathInputSlots`. */
    latexTemplate?: string;
    embeddedInputComponentIndices?: number[];
    /** True for an `<mrow>` whose `<md>` typesets it as part of the display. */
    typesetByParent?: boolean;
    /** True when the rendered children are the embedded inputs themselves. */
    typesetsOwnChildren?: boolean;
    renderMode?: string;
    equationTag?: string;
    mrowChildRendererIds?: string[];
    selectedStyle: ResolvedStyleDefinition;
}

function getMathDelimiters(SVs: MathSVs): [string, string] {
    if (SVs.renderMode === "inline") {
        return ["\\(", "\\)"];
    } else if (SVs.renderMode === "display") {
        return ["\\[", "\\]"];
    } else if (SVs.renderMode === "numbered") {
        return [`\\begin{gather}\\tag{${SVs.equationTag}}`, "\\end{gather}"];
    } else if (SVs.renderMode === "align") {
        return ["\\begin{align}", "\\end{align}"];
    }
    // treat as inline if have unrecognized renderMode
    return ["\\(", "\\)"];
}

export default React.memo(function MathComponent(
    props: UseDoenetRendererProps,
) {
    let { componentIdx, id, SVs, actions, callAction, children } =
        useDoenetRenderer<MathSVs>(props);

    // @ts-ignore
    MathComponent.ignoreActionsWithoutCore = () => true;

    const mathJXG = useRef<JXGObject | null>(null);
    const anchorPointJXG = useRef<JXGObject | null>(null);
    const anchorRel = useRef<[string, string] | null>(null);

    const board = useContext(BoardContext);
    const choiceInputInlineContext = useContext(ChoiceInputInlineContext);

    const pointerState = usePointerDragState();
    const pointAtDown = useRef<number[] | null>(null);
    const calculatedX = useRef<number | null>(null);
    const calculatedY = useRef<number | null>(null);
    const previousPositionFromAnchor = useRef(null);

    const { fixed, fixLocation, lastPositionFromCore } = useDraggableRefs<
        number[] | null
    >(SVs, null);

    useBoardPointerTracking(board, pointerState);

    useJSXGraphCleanup({
        objectRef: mathJXG,
        destroy: () => detachAnchoredGraphElement(mathJXG, board),
    });

    const { darkMode } = useContext(DocContext) || {};

    function createMathJXG() {
        if (board === null) {
            return null;
        }

        let textColor = resolveTextColor(SVs.selectedStyle, darkMode);
        let backgroundColor = resolveBackgroundColor(
            SVs.selectedStyle,
            darkMode,
        );

        let cssStyle = ``;
        if (backgroundColor) {
            cssStyle += `background-color: ${backgroundColor}`;
        }

        //things to be passed to JSXGraph as attributes
        let jsxMathAttributes: Record<string, any> = {
            visible: !SVs.hidden,
            fixed: fixed.current,
            layer: 10 * SVs.layer + TEXT_LAYER_OFFSET,
            cssStyle,
            highlightCssStyle: cssStyle,
            strokeColor: textColor,
            strokeOpacity: 1,
            highlightStrokeColor: textColor,
            highlightStrokeOpacity: 0.5,
            highlight: !fixLocation.current,
            useMathJax: true,
            parse: false,
        };

        let newAnchorPointJXG: JXGObject;

        try {
            let anchor = me.fromAst(SVs.anchor);
            let anchorCoords = [
                anchor.get_component(0).evaluate_to_constant(),
                anchor.get_component(1).evaluate_to_constant(),
            ];

            if (!Number.isFinite(anchorCoords[0])) {
                anchorCoords[0] = 0;
                jsxMathAttributes["visible"] = false;
            }
            if (!Number.isFinite(anchorCoords[1])) {
                anchorCoords[1] = 0;
                jsxMathAttributes["visible"] = false;
            }

            newAnchorPointJXG = board.create("point", anchorCoords, {
                visible: false,
            });
        } catch (e) {
            jsxMathAttributes["visible"] = false;
            newAnchorPointJXG = board.create("point", [0, 0], {
                visible: false,
            });
        }

        jsxMathAttributes.anchor = newAnchorPointJXG;

        let { anchorx, anchory } = getPositionFromAnchorByCoordinate(
            SVs.positionFromAnchor,
        );
        jsxMathAttributes.anchorx = anchorx;
        jsxMathAttributes.anchory = anchory;
        anchorRel.current = [anchorx, anchory];

        const [beginDelim, endDelim] = getMathDelimiters(SVs);

        let newMathJXG: JXGObject = board.create(
            "text",
            [0, 0, beginDelim + SVs.latex + endDelim],
            jsxMathAttributes,
        );

        attachAnchoredGraphDragHandlers({
            board,
            newJXG: newMathJXG,
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
                move: "moveMath",
                focused: "mathFocused",
                clicked: "mathClicked",
            },
        });

        mathJXG.current = newMathJXG;
        anchorPointJXG.current = newAnchorPointJXG;
        previousPositionFromAnchor.current = SVs.positionFromAnchor;

        // Note: no idea why one has to update the math after waiting
        // But, if we don't do that, the math isn't positioned correctly if any anchors are "middle",
        // and, especially for displayed math, the drag handlers may not be called
        // TODO: can we trigger this on MathJax being finished rather than wait 1 second?
        setTimeout(() => {
            if (mathJXG.current) {
                mathJXG.current.needsUpdate = true;
                mathJXG.current.setText(beginDelim + SVs.latex + endDelim);
                mathJXG.current.update();
                board.updateRenderer();
            }
        }, 1000);
    }

    if (board) {
        let anchorCoords: [number, number];
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

        if (mathJXG.current === null) {
            createMathJXG();
        } else {
            mathJXG.current.relativeCoords.setCoordinates(
                JXG.COORDS_BY_USER,
                [0, 0],
            );
            anchorPointJXG.current?.coords.setCoordinates(
                JXG.COORDS_BY_USER,
                anchorCoords,
            );

            const [beginDelim, endDelim] = getMathDelimiters(SVs);

            mathJXG.current.setText(beginDelim + SVs.latex + endDelim);

            let visible = !SVs.hidden;

            if (
                Number.isFinite(anchorCoords[0]) &&
                Number.isFinite(anchorCoords[1])
            ) {
                let actuallyChangedVisibility =
                    mathJXG.current.visProp["visible"] !== visible;
                mathJXG.current.visProp["visible"] = visible;
                mathJXG.current.visPropCalc["visible"] = visible;

                if (actuallyChangedVisibility) {
                    // this function is incredibly slow, so don't run it if not necessary
                    // TODO: figure out how to make label disappear right away so don't need to run this function
                    mathJXG.current.setAttribute({ visible });
                }
            } else {
                mathJXG.current.visProp["visible"] = false;
                mathJXG.current.visPropCalc["visible"] = false;
            }

            let layer = 10 * SVs.layer + TEXT_LAYER_OFFSET;
            let layerChanged = mathJXG.current.visProp.layer !== layer;

            if (layerChanged) {
                mathJXG.current.setAttribute({ layer });
            }

            let textColor = resolveTextColor(SVs.selectedStyle, darkMode);
            let backgroundColor = resolveBackgroundColor(
                SVs.selectedStyle,
                darkMode,
            );
            let cssStyle = ``;
            if (backgroundColor) {
                cssStyle += `background-color: ${backgroundColor}`;
            } else {
                cssStyle += `background-color: transparent`;
            }

            if (mathJXG.current.visProp.strokecolor !== textColor) {
                mathJXG.current.visProp.strokecolor = textColor!;
                mathJXG.current.visProp.highlightstrokecolor = textColor!;
            }
            if (mathJXG.current.visProp.cssstyle !== cssStyle) {
                mathJXG.current.visProp.cssstyle = cssStyle;
                mathJXG.current.visProp.highlightcssstyle = cssStyle;
            }

            mathJXG.current.visProp.highlight = !fixLocation.current;
            mathJXG.current.visProp.fixed = fixed.current;
            mathJXG.current.isDraggable = !fixLocation.current;

            mathJXG.current.needsUpdate = true;

            if (SVs.positionFromAnchor !== previousPositionFromAnchor.current) {
                let { anchorx, anchory } = getPositionFromAnchorByCoordinate(
                    SVs.positionFromAnchor,
                );
                mathJXG.current.visProp.anchorx = anchorx;
                mathJXG.current.visProp.anchory = anchory;
                anchorRel.current = [anchorx, anchory];
                previousPositionFromAnchor.current = SVs.positionFromAnchor;
                mathJXG.current.fullUpdate();
            } else {
                mathJXG.current.update();
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

    if (SVs.hidden) {
        return null;
    }

    // A row of an aligned display draws no math of its own — the whole display
    // is typeset as one expression by the `<md>` above — so all this row has to
    // do is place the inputs embedded in it, against that display's slots.
    if (SVs.typesetByParent) {
        return <EmbeddedInputs>{children}</EmbeddedInputs>;
    }

    const [beginDelim, endDelim] = getMathDelimiters(SVs);

    let anchors = [];
    if (SVs.mrowChildRendererIds) {
        anchors.push(
            ...SVs.mrowChildRendererIds.map((rowId: string) => {
                return <span key={rowId} id={rowId} />;
            }),
        );
    }

    const style = !choiceInputInlineContext.inOption
        ? textRendererStyle(darkMode ?? "light", SVs.selectedStyle)
        : undefined;

    // Core's list, not the template's text, decides that there are inputs to
    // draw: an expression without any takes the plain path whatever its LaTeX
    // happens to contain.
    const embeddedComponentIndices: number[] =
        SVs.embeddedInputComponentIndices ?? [];

    if (embeddedComponentIndices.length > 0) {
        return (
            <MathWithEmbeddedInputs
                id={id}
                style={style}
                template={SVs.latexTemplate ?? SVs.latex}
                embeddedComponentIndices={embeddedComponentIndices}
                beginDelim={beginDelim}
                endDelim={endDelim}
                anchors={anchors}
                slotsAreOwnChildren={SVs.typesetsOwnChildren !== false}
            >
                {children}
            </MathWithEmbeddedInputs>
        );
    }

    // No embedded inputs: the overwhelming majority of math, on exactly the
    // markup and code path it took before any of this existed.
    return (
        <>
            {anchors}
            <span style={style} id={id}>
                <DynamicMath latex={beginDelim + SVs.latex + endDelim} />
            </span>
        </>
    );
});

/** The closest ancestor-or-self whose box a `ResizeObserver` can report on. */
function nearestBlock(element: Element): Element {
    let current: Element | null = element;
    while (
        current &&
        current.parentElement &&
        getComputedStyle(current).display === "inline"
    ) {
        current = current.parentElement;
    }
    return current ?? element;
}

/**
 * The children that are embedded inputs, paired with the component index the
 * LaTeX template marks them by.
 *
 * `children` is positionally aligned with the component's active children and
 * carries a `null` for each one that is not rendered, so the built elements are
 * picked out rather than indexed.
 */
function embeddedInputChildren(children: React.ReactNode[]) {
    return children.flatMap((child) => {
        const componentIdx = (child as any)?.props?.componentInstructions
            ?.componentIdx;
        return typeof componentIdx === "number"
            ? [{ componentIdx, child }]
            : [];
    });
}

/** Wrap each embedded input in the slot that positions it. */
function EmbeddedInputs({ children }: { children: React.ReactNode[] }) {
    return (
        <>
            {embeddedInputChildren(children).map(({ componentIdx, child }) => (
                <MathSlot key={componentIdx} componentIdx={componentIdx}>
                    {child}
                </MathSlot>
            ))}
        </>
    );
}

/**
 * An expression with live inputs in it.
 *
 * The inputs are measured first and the expression is typeset around boxes of
 * exactly their size, so it appears already correct rather than reflowing into
 * place. They are then positioned over those boxes from a layer of their own,
 * which is what lets the expression re-typeset — because a value it depends on
 * changed, or because a control's own size did — without disturbing an input
 * the reader is using.
 */
function MathWithEmbeddedInputs({
    id,
    style,
    template,
    embeddedComponentIndices,
    beginDelim,
    endDelim,
    anchors,
    slotsAreOwnChildren,
    children,
}: {
    id: string;
    style: React.CSSProperties | undefined;
    template: string;
    embeddedComponentIndices: number[];
    beginDelim: string;
    endDelim: string;
    anchors: React.ReactNode[];
    /** True for `<m>`, whose children are the inputs; false for `<md>`, whose
     * children are the rows that hold them. */
    slotsAreOwnChildren: boolean;
    children: React.ReactNode[];
}) {
    const tContent = useContentT();

    const describeSlot = useCallback(
        (ordinal: number, total: number) =>
            total > 1
                ? tContent(
                      "math-embedded-input-blank-ordinal",
                      { ordinal, total },
                      `blank ${ordinal} of ${total}`,
                  )
                : tContent("math-embedded-input-blank", undefined, "blank"),
        [tContent],
    );

    const {
        rootRef,
        layerRef,
        latexForTypeset,
        readPositions,
        contextValue,
        indent,
        editing,
    } = useMathSlots({
        rootId: id,
        template,
        embeddedComponentIndices,
        describeSlot,
    });

    // The reserved boxes can move relative to the layer without the expression
    // being re-typeset: the page narrows and the expression re-wraps, or
    // display math re-breaks across lines. A `ResizeObserver` reports nothing
    // for a non-replaced inline box, which the root is in running text, so it
    // watches the nearest block around the expression — whose width is what
    // drives a re-wrap — and the typeset output itself once there is one, for
    // display math that MathJax re-breaks on its own.
    const reflowObserver = useRef<ResizeObserver | null>(null);
    const observedOutput = useRef<Element | null>(null);
    useEffect(() => {
        const root = rootRef.current;
        if (!root || typeof ResizeObserver === "undefined") {
            return;
        }
        const observer = new ResizeObserver(() => readPositions());
        observer.observe(nearestBlock(root));
        reflowObserver.current = observer;
        return () => {
            observer.disconnect();
            reflowObserver.current = null;
            observedOutput.current = null;
        };
    }, [readPositions]);

    const onTypeset = useCallback(() => {
        const output = rootRef.current?.querySelector("mjx-container");
        const observer = reflowObserver.current;
        if (observer && output && output !== observedOutput.current) {
            if (observedOutput.current) {
                observer.unobserve(observedOutput.current);
            }
            observer.observe(output);
            observedOutput.current = output;
        }
        readPositions({ typeset: true });
    }, [readPositions]);

    // MathJax's own fonts arrive after the first typeset and shift everything.
    useEffect(() => {
        async function readPositionsOnceFontsLoad() {
            try {
                await document.fonts?.ready;
            } catch {
                // The positions simply stay as first measured.
            }
            readPositions();
        }
        readPositionsOnceFontsLoad().catch(() => {});
    }, [readPositions]);

    return (
        <MathSlotProvider value={contextValue}>
            {anchors}
            <span
                ref={rootRef}
                style={
                    indent === null
                        ? style
                        : ({
                              ...style,
                              "--doenet-math-indent": `${indent}px`,
                          } as React.CSSProperties)
                }
                id={id}
                className={
                    indent === null
                        ? "doenet-math-root"
                        : "doenet-math-root doenet-math-pinned"
                }
            >
                {latexForTypeset !== null && (
                    <DynamicMath
                        latex={beginDelim + latexForTypeset + endDelim}
                        onTypeset={onTypeset}
                        immediate={editing}
                    />
                )}
                <span ref={layerRef} className="doenet-math-slot-layer">
                    {slotsAreOwnChildren ? (
                        <EmbeddedInputs>{children}</EmbeddedInputs>
                    ) : (
                        children
                    )}
                </span>
            </span>
        </MathSlotProvider>
    );
}
