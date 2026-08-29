import React, {
    createContext,
    useCallback,
    useContext,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { MATH_INPUT_SLOT_PATTERN as SLOT_PATTERN } from "@doenet/utils";
import { reserveForSlot, sameBox, SlotBox } from "./mathSlotReserve";

/**
 * Placing a live input inside typeset math.
 *
 * MathJax settles an expression's geometry when it typesets — column widths in
 * an `align`, stretchy delimiter sizes, fraction bars — and cannot reflow
 * around a control that changes size afterwards. So the control is never put
 * *into* the typeset output. Instead core leaves a marker where the input was
 * written, this module measures the control, the marker is replaced by an
 * invisible box of exactly that size, and the control is then positioned over
 * that box from a separate layer.
 *
 * Keeping the control out of the typeset subtree is not a detail: `DynamicMath`
 * replaces that subtree wholesale on every re-typeset, which would unmount a
 * focused input, dropping its caret and closing any open dropdown.
 *
 * The sizing is deliberately one-way. A slot wrapper takes its *position* from
 * the reserved box and its *size* from its own content, never the reverse —
 * otherwise the reservation would feed the control's width, which would feed
 * the reservation.
 *
 * A control that changes size as the reader types — a math field — would
 * re-typeset the expression on every keystroke under that rule, so while such a
 * control is being used it is given more room than it needs and the rest of the
 * expression is held still. `mathSlotReserve` decides how much room; this module
 * holds the template, and `MathSlot` positions the control by its baseline so
 * that the extra room falls beside it rather than moving it.
 */

interface SlotPosition {
    left: number;
    /**
     * Where the reserved box sits on the line, which is what a control is
     * placed against: its own baseline goes here, so room reserved above the
     * control falls above it rather than carrying it down the page.
     *
     * Read directly off the typeset output. The box's top plus the room
     * reserved above the control gives the same answer only once the
     * expression has been typeset around the current reservation, and a
     * control grows a frame or more before that happens.
     */
    baseline: number;
}

/** The template an expression is typeset from while a control in it is used. */
interface HeldTemplate {
    template: string;
    embeddedComponentIndices: readonly number[];
}

interface MathSlotContextValue {
    reportSize(componentIdx: number, box: SlotBox): void;
    positions: ReadonlyMap<number, SlotPosition>;
    /** Whether this slot's control is being edited; see `useMathSlots`. */
    setSlotEditing(componentIdx: number, editing: boolean): void;
    /** The reader committed a value, so the expression may catch up. */
    noteSlotCommit(settled?: Promise<unknown>): void;
}

const MathSlotContext = createContext<MathSlotContextValue | null>(null);

/** The component indices marked in a template, in the order they appear. */
function slotIndicesInTemplate(template: string): number[] {
    return [...template.matchAll(SLOT_PATTERN)].map((match) =>
        Number(match[1]),
    );
}

/**
 * Replace each marker with an invisible box of the measured size, plus a
 * zero-width label that only a screen reader sees.
 *
 * The label is not decoration. MathJax builds its spoken rendering from the
 * expression's structure, and a reserved space is not part of that structure —
 * so with the box alone, `x = ␣ + 3` is read "x equals positive 3": with no
 * operand at the gap, the binary `+` is taken for a sign. Giving the slot a
 * text operand restores the reading, and `\rlap` plus a hidden class keeps it
 * from being drawn. It costs a constant sliver of width, independent of how
 * long the label is.
 *
 * A zero-sized box goes in alongside, carrying an id of its own. A box with no
 * height and no depth sits on the line's baseline, so its position in the
 * typeset output is where the control's baseline goes; see `SlotPosition`.
 *
 * Returns `null` while any slot is still unmeasured, so that the expression is
 * typeset once, with real sizes, rather than being typeset to a guess and
 * visibly reflowing.
 */
export function substituteSlots({
    template,
    componentIndices,
    sizes,
    slotElementId,
    slotBaselineElementId,
    slotLabel,
}: {
    template: string;
    /** The markers that are slots; any other is left as written. */
    componentIndices: readonly number[];
    sizes: ReadonlyMap<number, SlotBox>;
    slotElementId: (componentIdx: number) => string;
    slotBaselineElementId: (componentIdx: number) => string;
    slotLabel: (componentIdx: number) => string;
}): string | null {
    let missing = false;

    const substituted = template.replace(
        SLOT_PATTERN,
        (match, rawIdx: string) => {
            const componentIdx = Number(rawIdx);
            if (!componentIndices.includes(componentIdx)) {
                return match;
            }
            const box = sizes.get(componentIdx);
            if (!box) {
                missing = true;
                return "";
            }
            const label = escapeForTex(slotLabel(componentIdx));
            return (
                `\\cssId{${slotElementId(componentIdx)}}{\\mathord{` +
                `\\class{doenet-math-slot-label}{\\rlap{\\text{${label}}}}` +
                `\\cssId{${slotBaselineElementId(componentIdx)}}{` +
                `\\Space{0px}{0px}{0px}}` +
                `\\Space{${box.width}px}{${box.height}px}{${box.depth}px}}}`
            );
        },
    );

    return missing ? null : substituted;
}

/**
 * Neutralize the characters that would end the `\text{…}` argument or start a
 * control sequence, and the angle brackets that would open a tag once the TeX
 * is handed to MathJax as markup. The label is the translated word for a
 * blank, and a translation is free text that is written into TeX, so it is
 * made safe here.
 */
function escapeForTex(label: string): string {
    return label.replace(/[\\{}$&#^_~%<>]/g, " ");
}

/**
 * Owns the slot registry for one typeset expression: collects the sizes its
 * slots report and hands back the positions read off the typeset output.
 */
export function useMathSlots({
    rootId,
    template,
    embeddedComponentIndices,
    describeSlot,
}: {
    rootId: string;
    template: string;
    /** The inputs core embedded, which is what makes a marker a slot. */
    embeddedComponentIndices: readonly number[];
    /** The spoken name of the `ordinal`-th of `total` slots. */
    describeSlot: (ordinal: number, total: number) => string;
}) {
    const rootRef = useRef<HTMLSpanElement>(null);
    // Coordinates are read against the layer, not the root. The root is an
    // inline box, so when an expression sits in running text its border box is
    // the union of its line fragments, while an absolutely positioned child
    // resolves its offsets against the fragment geometry instead — the two
    // disagree by however far the line's start is from that union. The layer is
    // itself absolutely positioned, so its own box *is* what the slots resolve
    // against, and measuring from it makes the two agree by construction.
    const layerRef = useRef<HTMLSpanElement>(null);
    const [sizes, setSizes] = useState<ReadonlyMap<number, SlotBox>>(new Map());
    const [positions, setPositions] = useState<
        ReadonlyMap<number, SlotPosition>
    >(new Map());

    // What the expression is typeset from while a reader is editing one of its
    // controls: the template as it stood when the editing began, or when the
    // last committed value came back, whichever is later.
    //
    // The reason is the caret. An expression can be re-typeset because anything
    // in it changed — a dragged point feeding it, another input's value — and a
    // re-typeset moves every reserved box, and so every control, while someone
    // is typing into one of them. Holding the template is what makes the layout
    // still; the control's own growth is held separately, by what it reports
    // (see `reserveForSlot`). The embedded list is held alongside the template
    // so the two always describe the same set of markers.
    const [held, setHeld] = useState<HeldTemplate | null>(null);
    const editingSlots = useRef(new Set<number>());
    const liveTemplate = useRef({ template, embeddedComponentIndices });
    liveTemplate.current = { template, embeddedComponentIndices };

    /**
     * Hold the template as it stands now, or release it if nothing is being
     * edited. Called at every boundary — editing starting or ending, a value
     * committed, a commit settled — so the hold is always the newest template
     * the expression has been allowed to see.
     */
    const holdTemplate = useCallback(() => {
        setHeld(editingSlots.current.size > 0 ? liveTemplate.current : null);
    }, []);

    const setSlotEditing = useCallback(
        (componentIdx: number, editing: boolean) => {
            const slots = editingSlots.current;
            if (editing) {
                slots.add(componentIdx);
            } else {
                slots.delete(componentIdx);
            }
            holdTemplate();
        },
        [holdTemplate],
    );

    // Core resolves a committed action once it has finished the action and sent
    // out every renderer update the action caused, so this is the point at
    // which the expression knows there is nothing further coming — whether or
    // not anything about it changed. Counted, so that two commits in a row are
    // two events, each with a catch-up of its own.
    const [commitsSettled, setCommitsSettled] = useState(0);
    const noteSettled = useCallback(
        () => setCommitsSettled((count) => count + 1),
        [],
    );

    const noteSlotCommit = useCallback(
        (settled?: Promise<unknown>) => {
            holdTemplate();
            settled?.then(noteSettled, noteSettled);
        },
        [holdTemplate, noteSettled],
    );

    // A commit asks the expression to catch up, but what it is to catch up to
    // is still on its way: the value goes to core, and the LaTeX that shows it
    // comes back a round trip later. So a commit holds what is on screen for
    // now, and catches up again once the action it started has settled.
    //
    // A commit need not change the template at all — `x = ␣` reads the same
    // whatever is typed into the field — so completion is taken from the
    // action settling, which happens either way. The catch-up is an effect on
    // the settle count so that it runs after the render that follows the
    // settle, where the template it reads is the one core sent with the
    // action's updates.
    useLayoutEffect(() => {
        if (commitsSettled > 0) {
            holdTemplate();
        }
    }, [commitsSettled, holdTemplate]);

    const activeTemplate = held?.template ?? template;
    const activeEmbedded =
        held?.embeddedComponentIndices ?? embeddedComponentIndices;

    // The template is trusted only as far as core's own list goes: a marker
    // is a slot when core embedded that input, not merely because the text
    // matches. So an author who happens to write the marker's spelling, or a
    // host that defines a macro of that name, gets it typeset as written.
    const componentIndices = useMemo(
        () =>
            slotIndicesInTemplate(activeTemplate).filter((componentIdx) =>
                activeEmbedded.includes(componentIdx),
            ),
        [activeTemplate, activeEmbedded],
    );

    const slotElementId = useCallback(
        (componentIdx: number) => `${rootId}_mathSlot_${componentIdx}`,
        [rootId],
    );

    // A reserved box is found by the `_mathSlot_` in its id, so the marker's
    // id keeps clear of that substring.
    const slotBaselineElementId = useCallback(
        (componentIdx: number) => `${rootId}_mathBaseline_${componentIdx}`,
        [rootId],
    );

    const slotLabel = useCallback(
        (componentIdx: number) =>
            describeSlot(
                componentIndices.indexOf(componentIdx) + 1,
                componentIndices.length,
            ),
        [componentIndices, describeSlot],
    );

    const reportSize = useCallback((componentIdx: number, box: SlotBox) => {
        setSizes((previous) => {
            // Quantized already, so equality here means nothing moved and a
            // re-typeset would be wasted.
            if (sameBox(previous.get(componentIdx) ?? null, box)) {
                return previous;
            }
            const next = new Map(previous);
            next.set(componentIdx, box);
            return next;
        });
    }, []);

    const latexForTypeset = useMemo(
        () =>
            componentIndices.length === 0
                ? activeTemplate
                : substituteSlots({
                      template: activeTemplate,
                      componentIndices,
                      sizes,
                      slotElementId,
                      slotBaselineElementId,
                      slotLabel,
                  }),
        [
            activeTemplate,
            componentIndices,
            sizes,
            slotElementId,
            slotBaselineElementId,
            slotLabel,
        ],
    );

    /**
     * Read each reserved box's position out of the freshly typeset output.
     *
     * The lookup is scoped to this expression's root, so it sees neither the
     * off-screen buffer `DynamicMath` typesets into nor another viewer on the
     * same page that happens to mint the same ids.
     *
     * Both coordinates come out of the output being measured — the left edge
     * from the reserved box, the baseline from the zero-sized marker typeset on
     * it — so they describe the same typeset, even when a newer size has been
     * reported since and the swap that reflects it is still on its way.
     */
    const readPositions = useCallback(() => {
        const root = rootRef.current;
        const layer = layerRef.current;
        if (!root || !layer) {
            return;
        }
        const originRect = layer.getBoundingClientRect();
        const next = new Map<number, SlotPosition>();
        for (const componentIdx of componentIndices) {
            const reserved = root.querySelector(
                `#${CSS.escape(slotElementId(componentIdx))}`,
            );
            if (!reserved) {
                continue;
            }
            const baselineMarker = root.querySelector(
                `#${CSS.escape(slotBaselineElementId(componentIdx))}`,
            );
            if (!baselineMarker) {
                continue;
            }
            next.set(componentIdx, {
                left: reserved.getBoundingClientRect().left - originRect.left,
                baseline:
                    baselineMarker.getBoundingClientRect().bottom -
                    originRect.top,
            });
        }
        setPositions((previous) =>
            samePositions(previous, next) ? previous : next,
        );
    }, [componentIndices, slotElementId, slotBaselineElementId]);

    const contextValue = useMemo<MathSlotContextValue>(
        () => ({ reportSize, positions, setSlotEditing, noteSlotCommit }),
        [reportSize, positions, setSlotEditing, noteSlotCommit],
    );

    return { rootRef, layerRef, latexForTypeset, readPositions, contextValue };
}

function samePositions(
    a: ReadonlyMap<number, SlotPosition>,
    b: ReadonlyMap<number, SlotPosition>,
) {
    if (a.size !== b.size) {
        return false;
    }
    for (const [key, value] of b) {
        const other = a.get(key);
        if (
            !other ||
            other.left !== value.left ||
            other.baseline !== value.baseline
        ) {
            return false;
        }
    }
    return true;
}

export function MathSlotProvider({
    value,
    children,
}: {
    value: MathSlotContextValue;
    children: React.ReactNode;
}) {
    return (
        <MathSlotContext.Provider value={value}>
            {children}
        </MathSlotContext.Provider>
    );
}

/**
 * True while rendering inside a slot, so an input can keep its visible label
 * out of the equation. The equation names the input instead; see
 * `shortDescription`.
 */
export const InMathSlotContext = createContext(false);

export function useInMathSlot() {
    return useContext(InMathSlotContext);
}

/**
 * How a control tells the expression around it that it is being edited, and
 * that the reader has committed a value to it.
 *
 * Editing holds the rest of the expression still, so that nothing else in the
 * document re-typesets it under the reader's hands, and committing lets it
 * catch up without waiting for focus to leave. A math field, which grows as
 * the reader types, uses the same signal to buy itself room. The calls are
 * no-ops outside a slot, so a renderer can make them unconditionally.
 */
export interface MathSlotEditing {
    /** The reader began using this control, or has finished with it. */
    setEditing(editing: boolean): void;
    /**
     * A value was committed without editing ending, as Enter does.
     *
     * `settled` is what the action returned: core resolves it once it has
     * finished the action and sent out every renderer update the action
     * caused. That is the expression's cue that there is nothing further to
     * wait for — including when the answer is that nothing changed.
     */
    commit(settled?: Promise<unknown>): void;
}

const notInASlot: MathSlotEditing = {
    setEditing() {},
    commit() {},
};

const MathSlotEditingContext = createContext(notInASlot);

export function useMathSlotEditing() {
    return useContext(MathSlotEditingContext);
}

/**
 * One embedded input: measured while hidden, then positioned over the box that
 * measurement reserved.
 */
export function MathSlot({
    componentIdx,
    children,
}: {
    componentIdx: number;
    children: React.ReactNode;
}) {
    const context = useContext(MathSlotContext);
    const wrapperRef = useRef<HTMLSpanElement>(null);
    const baselineRef = useRef<HTMLSpanElement>(null);
    const editing = useRef(false);
    const reserved = useRef<SlotBox | null>(null);
    // How much of the control stands above its own baseline, which is what it
    // is positioned by: it keeps its baseline on the expression's however much
    // it grows, so the room a reservation holds above it stays above it.
    const [heightAboveBaseline, setHeightAboveBaseline] = useState(0);

    const reportSize = context?.reportSize;
    const position = context?.positions.get(componentIdx);

    const measure = useCallback(
        ({ exact = false } = {}) => {
            const wrapper = wrapperRef.current;
            const baseline = baselineRef.current;
            if (!wrapper || !baseline || !reportSize) {
                return;
            }
            const rect = wrapper.getBoundingClientRect();
            // An empty zero-height inline-block sits with its bottom edge on
            // the line box's baseline, which is what splits the box into the
            // height and depth MathJax needs to reserve.
            const baselineY = baseline.getBoundingClientRect().bottom;
            const measured = {
                width: Math.ceil(rect.width),
                height: Math.max(0, Math.ceil(baselineY - rect.top)),
                depth: Math.max(0, Math.ceil(rect.bottom - baselineY)),
            };
            const box = reserveForSlot({
                measured,
                reserved: exact ? null : reserved.current,
                editing: editing.current && !exact,
            });
            reserved.current = box;
            setHeightAboveBaseline(measured.height);
            reportSize(componentIdx, box);
        },
        [componentIdx, reportSize],
    );

    const setSlotEditing = context?.setSlotEditing;
    const noteSlotCommit = context?.noteSlotCommit;

    const slotEditing = useMemo<MathSlotEditing>(
        () => ({
            setEditing(nowEditing: boolean) {
                if (editing.current === nowEditing) {
                    return;
                }
                editing.current = nowEditing;
                setSlotEditing?.(componentIdx, nowEditing);
                if (!nowEditing) {
                    // Give back whatever room went unused. Entering needs no
                    // such step: the control still fits what is reserved, and
                    // asks for more only when it outgrows it.
                    measure({ exact: true });
                }
            },
            commit(settled?: Promise<unknown>) {
                measure({ exact: true });
                noteSlotCommit?.(settled);
            },
        }),
        [componentIdx, measure, setSlotEditing, noteSlotCommit],
    );

    // A control unmounted mid-edit — hidden, or replaced — would otherwise hold
    // the expression frozen with nothing left to release it.
    useLayoutEffect(
        () => () => {
            if (editing.current) {
                editing.current = false;
                setSlotEditing?.(componentIdx, false);
            }
        },
        [componentIdx, setSlotEditing],
    );

    useLayoutEffect(() => {
        measure();
        if (typeof ResizeObserver === "undefined") {
            return;
        }
        const observer = new ResizeObserver(() => measure());
        if (wrapperRef.current) {
            observer.observe(wrapperRef.current);
        }
        return () => observer.disconnect();
    }, [measure]);

    return (
        <span
            ref={wrapperRef}
            className="doenet-math-slot"
            style={
                position
                    ? {
                          left: position.left,
                          top: position.baseline - heightAboveBaseline,
                      }
                    : // Laid out so it can be measured, but neither drawn,
                      // announced, nor focusable until it has somewhere to be.
                      { left: 0, top: 0, visibility: "hidden" }
            }
        >
            <MathSlotEditingContext.Provider value={slotEditing}>
                <InMathSlotContext.Provider value={true}>
                    {children}
                </InMathSlotContext.Provider>
            </MathSlotEditingContext.Provider>
            <span
                ref={baselineRef}
                aria-hidden="true"
                style={{ display: "inline-block", width: 0, height: 0 }}
            />
        </span>
    );
}
