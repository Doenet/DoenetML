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
    numBlocks: number;
    blockOrder: number[];
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
    dx: number;
    dy: number;
    target: DropTarget | null;
};

type PointerTracking = {
    blockIndex: number;
    pointerId: number;
    startX: number;
    startY: number;
    dragging: boolean;
};

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

    // What a screen reader hears after a move.
    const [announcement, setAnnouncement] = useState("");

    // The block to focus once the arrangement it was moved in has rendered.
    const focusBlockRef = useRef<number | null>(null);

    const pointerRef = useRef<PointerTracking | null>(null);
    const [drag, setDrag] = useState<DragState | null>(null);

    // `fixed` and `disabled` are read from refs inside pointer handlers so a
    // change while a pointer is down is honored.
    const interactive = !SVs.disabled && !SVs.fixed;
    const interactiveRef = useRef(interactive);
    interactiveRef.current = interactive;

    const solutionKey = SVs.solutionIndices.join(",");
    useEffect(() => {
        if (focusBlockRef.current === null) {
            return;
        }
        const el = ref.current?.querySelector<HTMLElement>(
            `[data-block-index="${focusBlockRef.current}"]`,
        );
        focusBlockRef.current = null;
        el?.focus();
    }, [solutionKey]);

    if (SVs.hidden) {
        return null;
    }

    const solutionIndices = SVs.solutionIndices;
    const unusedIndices = SVs.unusedIndices;

    function move({
        blockIndex,
        toArea,
        toPosition,
    }: {
        blockIndex: number;
        toArea: Area;
        toPosition?: number;
    }) {
        if (!interactiveRef.current) {
            return;
        }

        const inSolution = solutionIndices.includes(blockIndex);
        const count = inSolution
            ? solutionIndices.length
            : solutionIndices.length + 1;

        if (toArea === "unused") {
            if (!inSolution) {
                return;
            }
            setAnnouncement(
                t(
                    "parsons-moved-to-unused",
                    undefined,
                    "Moved to the unused blocks.",
                ),
            );
        } else {
            let position =
                toPosition === undefined
                    ? count
                    : Math.max(1, Math.min(toPosition, count));
            if (inSolution) {
                setAnnouncement(
                    t(
                        "parsons-moved-within-solution",
                        { position, count },
                        `Moved to position ${position} of ${count}.`,
                    ),
                );
            } else {
                setAnnouncement(
                    t(
                        "parsons-moved-to-solution",
                        { position, count },
                        `Moved to the solution, position ${position} of ${count}.`,
                    ),
                );
            }
        }

        focusBlockRef.current = blockIndex;
        callAction({
            action: actions.moveBlock,
            args: { blockIndex, toArea, toPosition },
        });
    }

    function moveFocus(current: HTMLElement, direction: 1 | -1): boolean {
        const list = current.parentElement;
        if (!list) {
            return false;
        }
        const items = Array.from(
            list.querySelectorAll<HTMLElement>("li[data-block-index]"),
        );
        const ind = items.indexOf(current);
        const next = items[ind + direction];
        if (next) {
            next.focus();
            return true;
        }
        return false;
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
        if (e.key === "Escape" && drag) {
            pointerRef.current = null;
            setDrag(null);
            e.preventDefault();
            return;
        }
        if (!interactive) {
            return;
        }

        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            move({
                blockIndex,
                toArea: area === "solution" ? "unused" : "solution",
            });
        } else if (
            e.altKey &&
            (e.key === "ArrowUp" || e.key === "ArrowDown") &&
            area === "solution"
        ) {
            e.preventDefault();
            move({
                blockIndex,
                toArea: "solution",
                toPosition: position + (e.key === "ArrowUp" ? -1 : 1),
            });
        } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
            if (moveFocus(e.currentTarget, e.key === "ArrowUp" ? -1 : 1)) {
                e.preventDefault();
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
        if (!interactiveRef.current) {
            return;
        }
        if (e.pointerType === "mouse" && e.button !== 0) {
            return;
        }
        if ((e.target as HTMLElement).closest(".parsons-block-controls")) {
            // The buttons handle their own clicks.
            return;
        }
        pointerRef.current = {
            blockIndex,
            pointerId: e.pointerId,
            startX: e.clientX,
            startY: e.clientY,
            dragging: false,
        };
        try {
            e.currentTarget.setPointerCapture(e.pointerId);
        } catch {
            // Pointer capture may fail in test environments (synthetic
            // events) or if the pointer has already been released.
        }
    }

    function onPointerMove(
        e: React.PointerEvent<HTMLLIElement>,
        blockIndex: number,
    ) {
        const tracking = pointerRef.current;
        if (!tracking || tracking.blockIndex !== blockIndex) {
            return;
        }
        const dx = e.clientX - tracking.startX;
        const dy = e.clientY - tracking.startY;
        if (!tracking.dragging) {
            if (
                Math.abs(dx) <= POINTER_DRAG_THRESHOLD &&
                Math.abs(dy) <= POINTER_DRAG_THRESHOLD
            ) {
                return;
            }
            tracking.dragging = true;
        }
        e.preventDefault();
        setDrag({
            blockIndex,
            dx,
            dy,
            target: dropTargetAt(e.clientX, e.clientY, blockIndex),
        });
    }

    function endPointer(e: React.PointerEvent<HTMLLIElement>) {
        const tracking = pointerRef.current;
        if (!tracking) {
            return;
        }
        try {
            e.currentTarget.releasePointerCapture(tracking.pointerId);
        } catch {
            // Already released.
        }
        pointerRef.current = null;
        return tracking;
    }

    function onPointerUp(e: React.PointerEvent<HTMLLIElement>) {
        const tracking = endPointer(e);
        if (!tracking?.dragging) {
            return;
        }
        const target = dropTargetAt(e.clientX, e.clientY, tracking.blockIndex);
        setDrag(null);
        if (target) {
            move({
                blockIndex: tracking.blockIndex,
                toArea: target.area,
                toPosition: target.position ?? undefined,
            });
        }
    }

    function onPointerCancel(e: React.PointerEvent<HTMLLIElement>) {
        endPointer(e);
        setDrag(null);
    }

    function controlButton({
        label,
        icon,
        testId,
        onClick,
        disabled,
    }: {
        label: string;
        icon: IconProp;
        testId: string;
        onClick: () => void;
        disabled?: boolean;
    }) {
        return (
            <button
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

    function renderBlock(blockIndex: number, area: Area, position: number) {
        const count =
            area === "solution" ? solutionIndices.length : unusedIndices.length;
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
                ? controlButton({
                      label: t(
                          "parsons-move-to-solution",
                          undefined,
                          "Move to solution",
                      ),
                      icon: faPlus as IconProp,
                      testId: "parsons-move-to-solution",
                      onClick: () => move({ blockIndex, toArea: "solution" }),
                  })
                : [
                      controlButton({
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
                          label: t("parsons-move-down", undefined, "Move down"),
                          icon: faArrowDown as IconProp,
                          testId: "parsons-move-down",
                          disabled: position === count,
                          onClick: () =>
                              move({
                                  blockIndex,
                                  toArea: "solution",
                                  toPosition: position + 1,
                              }),
                      }),
                      controlButton({
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

        return (
            <li
                key={blockIndex}
                className={classNames.join(" ")}
                data-test="parsons-block"
                data-block-index={blockIndex}
                tabIndex={interactive ? 0 : undefined}
                style={
                    dragging
                        ? {
                              transform: `translate(${drag!.dx}px, ${drag!.dy}px)`,
                          }
                        : undefined
                }
                onKeyDown={(e) => onBlockKeyDown(e, blockIndex, area, position)}
                onPointerDown={(e) => onPointerDown(e, blockIndex)}
                onPointerMove={(e) => onPointerMove(e, blockIndex)}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerCancel}
            >
                <div className="parsons-block-content">
                    {children[SVs.blockChildIndices[blockIndex - 1]]}
                </div>
                <div
                    className="parsons-block-controls"
                    role="group"
                    aria-label={t(
                        "parsons-block-controls",
                        { position },
                        `Controls for block ${position}`,
                    )}
                >
                    {Array.isArray(controls)
                        ? controls.map((control, i) => (
                              <React.Fragment key={i}>{control}</React.Fragment>
                          ))
                        : controls}
                </div>
            </li>
        );
    }

    // The solution list, with the drop indicator inserted while dragging.
    const solutionItems: ReactNode[] = [];
    const dropPosition =
        drag?.target?.area === "solution" ? drag.target.position : null;
    const solutionWithoutDragged = solutionIndices.filter(
        (ind) => ind !== drag?.blockIndex,
    );
    solutionIndices.forEach((blockIndex, i) => {
        const positionAmongOthers =
            solutionWithoutDragged.indexOf(blockIndex) + 1;
        if (dropPosition !== null && positionAmongOthers === dropPosition) {
            solutionItems.push(
                <li
                    key="drop-indicator"
                    className="parsons-drop-indicator"
                    aria-hidden={true}
                    data-test="parsons-drop-indicator"
                />,
            );
        }
        solutionItems.push(renderBlock(blockIndex, "solution", i + 1));
    });
    if (
        dropPosition !== null &&
        dropPosition === solutionWithoutDragged.length + 1
    ) {
        solutionItems.push(
            <li
                key="drop-indicator"
                className="parsons-drop-indicator"
                aria-hidden={true}
                data-test="parsons-drop-indicator"
            />,
        );
    }

    const statement =
        SVs.statementChildInd !== -1 ? children[SVs.statementChildInd] : null;

    const hasLabel = Boolean(SVs.label);
    const labelId = `${id}-label`;
    let label: ReactNode = SVs.label;
    if (SVs.labelHasLatex) {
        label = <DynamicMath latex={SVs.label} />;
    }

    const shortDescription = addValidationStateToShortDescription(
        validationState,
        SVs.shortDescription || undefined,
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

    let checkWorkComponent = createCheckWorkComponent(
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
    if (checkWorkComponent && description) {
        checkWorkComponent = (
            <span aria-details={descriptionId} data-test="Details Associated">
                {checkWorkComponent}
            </span>
        );
    }

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
            aria-label={
                !hasLabel
                    ? shortDescription ||
                      t("parsons-default-name", undefined, "Arrange the blocks")
                    : undefined
            }
            aria-description={hasLabel ? shortDescription : undefined}
            aria-details={descriptionId}
        >
            {hasLabel && (
                <div id={labelId} className="parsons-label">
                    {label}
                </div>
            )}
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
                    <ul
                        ref={solutionListRef}
                        className="parsons-list"
                        aria-labelledby={solutionLabelId}
                    >
                        {statement && (
                            <li
                                className="parsons-block parsons-statement"
                                data-test="parsons-statement"
                            >
                                <div className="parsons-block-content">
                                    {statement}
                                </div>
                            </li>
                        )}
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
                {announcement}
            </div>
            {description}
            {checkWorkComponent}
            {answerResponseButton}
        </div>
    );
});
