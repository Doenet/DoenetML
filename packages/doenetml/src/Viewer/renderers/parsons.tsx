import React, {
    useContext,
    useEffect,
    useRef,
    useState,
    ReactNode,
} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
    faArrowDown,
    faArrowUp,
    faGripVertical,
    faMinus,
    faPlus,
} from "@fortawesome/free-solid-svg-icons";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { useRecordVisibilityChanges } from "../../utils/visibility";
import { DocContext } from "../DocViewer";
import { AnswerResponseButton } from "./utils/AnswerResponseButton";
import {
    calculateValidationState,
    createCheckWorkComponent,
    wantsFullCheckWorkButton,
} from "./utils/checkWork";
import { useSubmitActionWithDelay } from "./utils/useSubmitActionWithDelay";
import { addValidationStateToShortDescription } from "./utils/validationState";
import { DynamicMath } from "./utils/DynamicMath";
import { DescriptionPopover } from "./utils/Description";
import { POINTER_DRAG_THRESHOLD } from "./utils/graph";
import { useContentT, useT } from "../../utils/i18n";
import "./parsons.css";

interface ParsonsSVs {
    [key: string]: any;
    hidden: boolean;
    disabled: boolean;
    fixed: boolean;
    label: string;
    labelHasLatex: boolean;
    shortDescription: string;
    statementChildInd: number;
    blockChildIndices: number[];
    descriptionChildInd: number;
    solutionIndices: number[];
    unusedIndices: number[];
    solutionLabel: string;
    unusedLabel: string;
    justSubmitted: boolean;
    colorCorrectness: boolean;
}

type Area = "solution" | "unused";

type DropTarget = {
    area: Area;
    /** Insertion position in the solution, counting from 1. */
    position: number | null;
};

type DragState = {
    blockIndex: number;
    /** The translation that keeps the block under the pointer. */
    dx: number;
    dy: number;
    target: DropTarget | null;
};

type PointerTracking = {
    blockIndex: number;
    pointerId: number;
    startX: number;
    startY: number;
    /** Where the block's box sat in the layout when the pointer went down. */
    originLeft: number;
    originTop: number;
    /** The translation currently rendered, to undo when measuring. */
    appliedDx: number;
    appliedDy: number;
    dragging: boolean;
};

/**
 * Elements inside a block that own their own pointer interaction, so a press
 * on them is theirs and never starts a drag.
 */
const INTERACTIVE_SELECTOR =
    "a, button, input, textarea, select, [contenteditable='true'], .jxgbox, .mq-editable-field, .parsons-block-controls";

/**
 * A Parsons problem: the reader moves blocks from the unused area into the
 * solution area and orders them there.
 *
 * Every change goes through the worker's `moveBlock` action, whether it came
 * from a button, a key, or a pointer drop, so the three paths cannot drift
 * apart. The buttons are the complete keyboard path on their own; the
 * shortcuts on a focused block and dragging are conveniences.
 */
export default React.memo(function Parsons(props: UseDoenetRendererProps) {
    const {
        componentIdx,
        id,
        SVs,
        docId,
        activityId,
        children,
        actions,
        callAction,
        flags,
    } = useDoenetRenderer<ParsonsSVs>(props);

    const t = useT();

    // The check-work button and the validation suffix follow the document's
    // language, not the reader's — see `useContentT`.
    const tContent = useContentT();

    const ref = useRef<HTMLDivElement | null>(null);
    const solutionAreaRef = useRef<HTMLDivElement | null>(null);
    const unusedAreaRef = useRef<HTMLDivElement | null>(null);
    const solutionListRef = useRef<HTMLUListElement | null>(null);

    useRecordVisibilityChanges(ref, callAction, actions);

    const { showAnswerResponseButton, answerResponseCounts } =
        useContext(DocContext) || {};

    const validationState = calculateValidationState(SVs);

    const { isPending, submitActionWithPending } = useSubmitActionWithDelay({
        actionKey: "submitAnswer",
        actions,
        callAction,
        validationState,
        justSubmitted: SVs.justSubmitted,
    });

    // What a screen reader hears after a move. The nonce gives the live
    // region a fresh node each time, so a message repeated verbatim (two
    // removals in a row) is still announced.
    const [announcement, setAnnouncement] = useState({ text: "", nonce: 0 });

    // The block to focus once the arrangement it was moved in has rendered.
    const focusBlockRef = useRef<number | null>(null);

    const pointerRef = useRef<PointerTracking | null>(null);
    const [drag, setDrag] = useState<DragState | null>(null);

    const interactive = !SVs.disabled && !SVs.fixed;
    const solutionIndices = SVs.solutionIndices;
    const unusedIndices = SVs.unusedIndices;
    const solutionKey = solutionIndices.join(",");
    const unusedKey = unusedIndices.join(",");

    useEffect(() => {
        const blockIndex = focusBlockRef.current;
        focusBlockRef.current = null;
        if (blockIndex === null) {
            return;
        }
        // Reclaim only the focus the move itself displaced (its button or
        // list item was unmounted), never a place the reader has since gone.
        const active = document.activeElement;
        if (
            active &&
            active !== document.body &&
            !ref.current?.contains(active)
        ) {
            return;
        }
        ref.current
            ?.querySelector<HTMLElement>(`[data-block-index="${blockIndex}"]`)
            ?.focus();
    }, [solutionKey]);

    // A drag cannot outlive what it started in: end it when the blocks stop
    // being interactive or the dragged block is no longer shown.
    useEffect(() => {
        if (
            drag &&
            (!interactive ||
                !(
                    solutionIndices.includes(drag.blockIndex) ||
                    unusedIndices.includes(drag.blockIndex)
                ))
        ) {
            cancelDrag();
        }
    }, [drag, interactive, solutionKey, unusedKey]);

    // Escape abandons a drag wherever focus is.
    useEffect(() => {
        if (!drag) {
            return;
        }
        function onKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape") {
                cancelDrag();
            }
        }
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [drag]);

    if (SVs.hidden) {
        return null;
    }

    function announce(text: string) {
        setAnnouncement((previous) => ({ text, nonce: previous.nonce + 1 }));
    }

    function cancelDrag() {
        pointerRef.current = null;
        setDrag(null);
    }

    /**
     * Ask the worker to move a block, unless the request would change
     * nothing (a move past the end of the solution, a drop where the block
     * already sits), in which case nothing is announced either.
     */
    function move({
        blockIndex,
        toArea,
        toPosition,
    }: {
        blockIndex: number;
        toArea: Area;
        toPosition?: number;
    }) {
        if (!interactive) {
            return;
        }

        const others = solutionIndices.filter((ind) => ind !== blockIndex);
        const wasInSolution = others.length < solutionIndices.length;

        if (toArea === "unused") {
            if (!wasInSolution) {
                return;
            }
            focusBlockRef.current = blockIndex;
            callAction({
                action: actions.moveBlock,
                args: { blockIndex, toArea },
            });
            announce(
                t(
                    "parsons-moved-to-unused",
                    undefined,
                    "Moved to the unused blocks.",
                ),
            );
            return;
        }

        const count = others.length + 1;
        const position =
            toPosition === undefined
                ? count
                : Math.max(1, Math.min(toPosition, count));
        if (wasInSolution && solutionIndices[position - 1] === blockIndex) {
            return;
        }

        focusBlockRef.current = blockIndex;
        callAction({
            action: actions.moveBlock,
            args: { blockIndex, toArea, toPosition: position },
        });
        announce(
            wasInSolution
                ? t(
                      "parsons-moved-within-solution",
                      { position, count },
                      `Moved to position ${position} of ${count}.`,
                  )
                : t(
                      "parsons-moved-to-solution",
                      { position, count },
                      `Moved to the solution, position ${position} of ${count}.`,
                  ),
        );
    }

    function moveFocus(current: HTMLElement, direction: 1 | -1): boolean {
        const items = Array.from(
            current.parentElement?.querySelectorAll<HTMLElement>(
                "li[data-block-index]",
            ) ?? [],
        );
        const next = items[items.indexOf(current) + direction];
        if (!next) {
            return false;
        }
        next.focus();
        return true;
    }

    function onBlockKeyDown(
        e: React.KeyboardEvent<HTMLLIElement>,
        blockIndex: number,
        area: Area,
        position: number,
    ) {
        if (e.target !== e.currentTarget) {
            // A key pressed on a button inside the block is the button's.
            return;
        }

        if (e.key === "ArrowUp" || e.key === "ArrowDown") {
            const direction = e.key === "ArrowUp" ? -1 : 1;
            if (e.altKey) {
                if (area === "solution") {
                    e.preventDefault();
                    move({
                        blockIndex,
                        toArea: "solution",
                        toPosition: position + direction,
                    });
                }
            } else if (moveFocus(e.currentTarget, direction)) {
                e.preventDefault();
            }
        } else if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            // A held key repeats; a block should not ping-pong between areas.
            if (!e.repeat) {
                move({
                    blockIndex,
                    toArea: area === "solution" ? "unused" : "solution",
                });
            }
        }
    }

    /**
     * Where a pointer at `(x, y)` would drop the block: which area, and for
     * the solution, the position among the other blocks there. Geometry
     * only, so the dragged block itself cannot get in the way.
     */
    function dropTargetAt(
        x: number,
        y: number,
        blockIndex: number,
    ): DropTarget | null {
        function inside(el: HTMLElement | null) {
            if (!el) {
                return false;
            }
            const r = el.getBoundingClientRect();
            return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
        }

        if (inside(solutionAreaRef.current)) {
            const items = Array.from(
                solutionListRef.current?.querySelectorAll<HTMLElement>(
                    "li[data-block-index]",
                ) ?? [],
            ).filter((li) => Number(li.dataset.blockIndex) !== blockIndex);
            let position = 1;
            for (const li of items) {
                const r = li.getBoundingClientRect();
                if (y > r.top + r.height / 2) {
                    position++;
                }
            }
            return { area: "solution", position };
        }
        if (inside(unusedAreaRef.current)) {
            return { area: "unused", position: null };
        }
        return null;
    }

    function onPointerDown(
        e: React.PointerEvent<HTMLLIElement>,
        blockIndex: number,
    ) {
        if (!interactive || !e.isPrimary || pointerRef.current) {
            return;
        }
        if (e.pointerType === "mouse" && e.button !== 0) {
            return;
        }
        if ((e.target as HTMLElement).closest(INTERACTIVE_SELECTOR)) {
            return;
        }
        const { left, top } = e.currentTarget.getBoundingClientRect();
        pointerRef.current = {
            blockIndex,
            pointerId: e.pointerId,
            startX: e.clientX,
            startY: e.clientY,
            originLeft: left,
            originTop: top,
            appliedDx: 0,
            appliedDy: 0,
            dragging: false,
        };
    }

    function onPointerMove(
        e: React.PointerEvent<HTMLLIElement>,
        blockIndex: number,
    ) {
        const tracking = pointerRef.current;
        if (
            !tracking ||
            tracking.blockIndex !== blockIndex ||
            e.pointerId !== tracking.pointerId
        ) {
            return;
        }
        const movedX = e.clientX - tracking.startX;
        const movedY = e.clientY - tracking.startY;
        if (!tracking.dragging) {
            if (
                Math.abs(movedX) <= POINTER_DRAG_THRESHOLD &&
                Math.abs(movedY) <= POINTER_DRAG_THRESHOLD
            ) {
                return;
            }
            tracking.dragging = true;
            // Capture only once this is a drag, so a plain click still
            // reaches whatever inside the block was clicked.
            try {
                e.currentTarget.setPointerCapture(e.pointerId);
            } catch {
                // Pointer capture may fail in test environments (synthetic
                // events) or if the pointer has already been released.
            }
        }
        e.preventDefault();

        // The block stays in the flow, so the lists around it keep their
        // size; when the drop indicator shifts its layout box, the shift is
        // taken out of the translation and the block stays under the pointer.
        const box = e.currentTarget.getBoundingClientRect();
        const layoutLeft = box.left - tracking.appliedDx;
        const layoutTop = box.top - tracking.appliedDy;
        const dx = movedX - (layoutLeft - tracking.originLeft);
        const dy = movedY - (layoutTop - tracking.originTop);
        tracking.appliedDx = dx;
        tracking.appliedDy = dy;

        setDrag({
            blockIndex,
            dx,
            dy,
            target: dropTargetAt(e.clientX, e.clientY, blockIndex),
        });
    }

    function onPointerUp(e: React.PointerEvent<HTMLLIElement>) {
        const tracking = pointerRef.current;
        if (!tracking || e.pointerId !== tracking.pointerId) {
            return;
        }
        pointerRef.current = null;
        if (!tracking.dragging) {
            return;
        }
        try {
            e.currentTarget.releasePointerCapture(tracking.pointerId);
        } catch {
            // Already released.
        }
        setDrag(null);
        const target = dropTargetAt(e.clientX, e.clientY, tracking.blockIndex);
        if (target) {
            move({
                blockIndex: tracking.blockIndex,
                toArea: target.area,
                toPosition: target.position ?? undefined,
            });
        }
    }

    function onPointerCancel(e: React.PointerEvent<HTMLLIElement>) {
        if (
            pointerRef.current &&
            e.pointerId === pointerRef.current.pointerId
        ) {
            cancelDrag();
        }
    }

    function controlButton({
        key,
        label,
        icon,
        testId,
        onClick,
        disabled = false,
    }: {
        key: string;
        label: string;
        icon: IconProp;
        testId: string;
        onClick: () => void;
        disabled?: boolean;
    }) {
        return (
            <button
                key={key}
                type="button"
                className="parsons-control"
                aria-label={label}
                title={label}
                data-test={testId}
                disabled={!interactive || disabled}
                onClick={onClick}
            >
                <FontAwesomeIcon icon={icon} />
            </button>
        );
    }

    function renderBlock(
        blockIndex: number,
        area: Area,
        position: number,
        order?: number,
    ) {
        const dragging = drag?.blockIndex === blockIndex;
        const classNames = ["parsons-block"];
        if (interactive) {
            classNames.push("parsons-block-interactive");
        }
        if (dragging) {
            classNames.push("parsons-block-dragging");
        }

        const controls =
            area === "unused"
                ? [
                      controlButton({
                          key: "to-solution",
                          label: t(
                              "parsons-move-to-solution",
                              undefined,
                              "Move to solution",
                          ),
                          icon: faPlus as IconProp,
                          testId: "parsons-move-to-solution",
                          onClick: () =>
                              move({ blockIndex, toArea: "solution" }),
                      }),
                  ]
                : [
                      controlButton({
                          key: "up",
                          label: t("parsons-move-up", undefined, "Move up"),
                          icon: faArrowUp as IconProp,
                          testId: "parsons-move-up",
                          disabled: position === 1,
                          onClick: () =>
                              move({
                                  blockIndex,
                                  toArea: "solution",
                                  toPosition: position - 1,
                              }),
                      }),
                      controlButton({
                          key: "down",
                          label: t("parsons-move-down", undefined, "Move down"),
                          icon: faArrowDown as IconProp,
                          testId: "parsons-move-down",
                          disabled: position === solutionIndices.length,
                          onClick: () =>
                              move({
                                  blockIndex,
                                  toArea: "solution",
                                  toPosition: position + 1,
                              }),
                      }),
                      controlButton({
                          key: "to-unused",
                          label: t(
                              "parsons-move-to-unused",
                              undefined,
                              "Remove from solution",
                          ),
                          icon: faMinus as IconProp,
                          testId: "parsons-move-to-unused",
                          onClick: () => move({ blockIndex, toArea: "unused" }),
                      }),
                  ];

        const style: React.CSSProperties = { order };
        if (dragging && drag) {
            style.transform = `translate(${drag.dx}px, ${drag.dy}px)`;
        }

        return (
            <li
                key={blockIndex}
                className={classNames.join(" ")}
                data-test="parsons-block"
                data-block-index={blockIndex}
                tabIndex={0}
                aria-describedby={`${id}-instructions`}
                style={style}
                onKeyDown={(e) => onBlockKeyDown(e, blockIndex, area, position)}
                onPointerDown={(e) => onPointerDown(e, blockIndex)}
                onPointerMove={(e) => onPointerMove(e, blockIndex)}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerCancel}
                onLostPointerCapture={onPointerCancel}
                onDragStart={(e) => e.preventDefault()}
            >
                {interactive && (
                    <span className="parsons-block-handle" aria-hidden={true}>
                        <FontAwesomeIcon icon={faGripVertical as IconProp} />
                    </span>
                )}
                <div className="parsons-block-content">
                    {children[SVs.blockChildIndices[blockIndex - 1]]}
                </div>
                <div
                    className="parsons-block-controls"
                    role="group"
                    aria-label={
                        area === "solution"
                            ? t(
                                  "parsons-solution-block-controls",
                                  { position },
                                  `Controls for solution step ${position}`,
                              )
                            : t(
                                  "parsons-unused-block-controls",
                                  { position },
                                  `Controls for unused block ${position}`,
                              )
                    }
                >
                    {controls}
                </div>
            </li>
        );
    }

    // The solution's blocks keep their DOM order throughout a drag: moving a
    // captured element in the DOM releases its pointer capture and ends the
    // drag. So the drop indicator is always the last child, and flexbox
    // `order` puts it visually before the block that would follow the drop
    // (counting among the blocks other than the dragged one).
    const solutionItems: ReactNode[] = solutionIndices.map((blockIndex, i) =>
        renderBlock(blockIndex, "solution", i + 1, 2 * (i + 1)),
    );
    if (drag?.target?.area === "solution") {
        const others = solutionIndices.filter((ind) => ind !== drag.blockIndex);
        const following = others[(drag.target.position ?? 1) - 1];
        const followingIndex =
            following === undefined
                ? solutionIndices.length
                : solutionIndices.indexOf(following);
        solutionItems.push(
            <li
                key="drop-indicator"
                className="parsons-drop-indicator"
                style={{ order: 2 * followingIndex + 1 }}
                aria-hidden={true}
                data-test="parsons-drop-indicator"
            />,
        );
    }

    const statement =
        SVs.statementChildInd !== -1 ? children[SVs.statementChildInd] : null;

    const hasLabel =
        typeof SVs.label === "string"
            ? SVs.label.trim() !== ""
            : Boolean(SVs.label);
    const labelId = `${id}-label`;
    const label: ReactNode = SVs.labelHasLatex ? (
        <DynamicMath latex={SVs.label} />
    ) : (
        SVs.label
    );

    // With no label, the short description (or a default) names the group
    // and the verdict is appended to it; with a label, the description holds
    // the verdict.
    const baseName =
        SVs.shortDescription ||
        t("parsons-default-name", undefined, "Arrange the blocks");
    const describedName = addValidationStateToShortDescription(
        validationState,
        hasLabel ? SVs.shortDescription || undefined : baseName,
        tContent,
    );

    const descriptionChild =
        SVs.descriptionChildInd !== -1 && children[SVs.descriptionChildInd];
    let descriptionId: string | undefined = undefined;
    let description: ReactNode = null;
    if (descriptionChild) {
        descriptionId = `${id}-description-content`;
        description = (
            <DescriptionPopover>
                <div id={descriptionId}>{descriptionChild}</div>
            </DescriptionPopover>
        );
    }

    let answerResponseButton = null;
    if (showAnswerResponseButton) {
        answerResponseButton = (
            <AnswerResponseButton
                answerId={id}
                answerComponentIdx={componentIdx}
                docId={docId}
                activityId={activityId}
                numResponses={answerResponseCounts?.[id]}
                flags={flags}
            />
        );
    }

    const checkWorkComponent = createCheckWorkComponent(
        SVs,
        id,
        validationState,
        submitActionWithPending,
        // A parsons takes a block of its own, so the full labelled button is
        // the default, as for an `<answer>` with no input field.
        wantsFullCheckWorkButton(SVs, true),
        isPending,
        tContent,
    );

    const areaClassNames = ["parsons-areas"];
    if (SVs.colorCorrectness && validationState !== "unvalidated") {
        areaClassNames.push(`parsons-${validationState}`);
    }

    const solutionLabelId = `${id}-solution-label`;
    const unusedLabelId = `${id}-unused-label`;

    return (
        <div
            id={id}
            ref={ref}
            className="parsons-root"
            data-test="parsons-root"
            role="group"
            aria-labelledby={hasLabel ? labelId : undefined}
            aria-label={hasLabel ? undefined : describedName}
            aria-description={hasLabel ? describedName : undefined}
            aria-details={descriptionId}
        >
            {hasLabel && (
                <div id={labelId} className="parsons-label">
                    {label}
                </div>
            )}
            <div id={`${id}-instructions`} className="visually-hidden">
                {t(
                    "parsons-block-instructions",
                    undefined,
                    "Press Enter or Space to move this block between the solution and the unused blocks. Hold Alt and press the up or down arrow to move it within the solution.",
                )}
            </div>
            <div className={areaClassNames.join(" ")}>
                <div
                    ref={solutionAreaRef}
                    className={
                        "parsons-area parsons-solution" +
                        (drag?.target?.area === "solution"
                            ? " parsons-area-drop-target"
                            : "")
                    }
                    data-test="parsons-solution"
                >
                    <div id={solutionLabelId} className="parsons-area-label">
                        {SVs.solutionLabel}
                    </div>
                    {statement && (
                        <div
                            className="parsons-block parsons-statement"
                            data-test="parsons-statement"
                        >
                            <div className="parsons-block-content">
                                {statement}
                            </div>
                        </div>
                    )}
                    <ul
                        ref={solutionListRef}
                        className="parsons-list"
                        aria-labelledby={solutionLabelId}
                    >
                        {solutionItems}
                    </ul>
                </div>
                <div
                    ref={unusedAreaRef}
                    className={
                        "parsons-area parsons-unused" +
                        (drag?.target?.area === "unused"
                            ? " parsons-area-drop-target"
                            : "")
                    }
                    data-test="parsons-unused"
                >
                    <div id={unusedLabelId} className="parsons-area-label">
                        {SVs.unusedLabel}
                    </div>
                    <ul
                        className="parsons-list"
                        aria-labelledby={unusedLabelId}
                    >
                        {unusedIndices.map((blockIndex, i) =>
                            renderBlock(blockIndex, "unused", i + 1),
                        )}
                    </ul>
                </div>
            </div>
            <div
                className="visually-hidden"
                aria-live="polite"
                aria-atomic={true}
                data-test="parsons-live"
            >
                <span key={announcement.nonce}>{announcement.text}</span>
            </div>
            {description}
            {checkWorkComponent}
            {answerResponseButton}
        </div>
    );
});
