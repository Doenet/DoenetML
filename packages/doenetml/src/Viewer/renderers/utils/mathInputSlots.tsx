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
 */

/** A control's box, in integer CSS pixels, split at its baseline. */
export interface SlotBox {
    width: number;
    /** Height above the baseline. */
    height: number;
    /** Depth below the baseline. */
    depth: number;
}

interface SlotPosition {
    left: number;
    top: number;
}

interface MathSlotContextValue {
    reportSize(componentIdx: number, box: SlotBox): void;
    positions: ReadonlyMap<number, SlotPosition>;
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
 * Returns `null` while any slot is still unmeasured, so that the expression is
 * typeset once, with real sizes, rather than being typeset to a guess and
 * visibly reflowing.
 */
export function substituteSlots({
    template,
    componentIndices,
    sizes,
    slotElementId,
    slotLabel,
}: {
    template: string;
    /** The markers that are slots; any other is left as written. */
    componentIndices: readonly number[];
    sizes: ReadonlyMap<number, SlotBox>;
    slotElementId: (componentIdx: number) => string;
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
 * made safe here rather than trusted to be.
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

    // The template is trusted only as far as core's own list goes: a marker
    // is a slot when core embedded that input, not merely because the text
    // matches. So an author who happens to write the marker's spelling, or a
    // host that defines a macro of that name, gets it typeset as written.
    const componentIndices = useMemo(
        () =>
            slotIndicesInTemplate(template).filter((componentIdx) =>
                embeddedComponentIndices.includes(componentIdx),
            ),
        [template, embeddedComponentIndices],
    );

    const slotElementId = useCallback(
        (componentIdx: number) => `${rootId}_mathSlot_${componentIdx}`,
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
            const existing = previous.get(componentIdx);
            // Quantized already, so equality here means nothing moved and a
            // re-typeset would be wasted.
            if (
                existing &&
                existing.width === box.width &&
                existing.height === box.height &&
                existing.depth === box.depth
            ) {
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
                ? template
                : substituteSlots({
                      template,
                      componentIndices,
                      sizes,
                      slotElementId,
                      slotLabel,
                  }),
        [template, componentIndices, sizes, slotElementId, slotLabel],
    );

    /**
     * Read each reserved box's position out of the freshly typeset output.
     *
     * Only ever called after a swap has landed, so `getElementById` finds the
     * visible output rather than the off-screen buffer `DynamicMath` typesets
     * into. Position only — the box's size came from the control in the first
     * place.
     */
    const readPositions = useCallback(() => {
        const layer = layerRef.current;
        if (!layer) {
            return;
        }
        const originRect = layer.getBoundingClientRect();
        const next = new Map<number, SlotPosition>();
        for (const componentIdx of componentIndices) {
            const reserved = document.getElementById(
                slotElementId(componentIdx),
            );
            if (!reserved) {
                continue;
            }
            const rect = reserved.getBoundingClientRect();
            next.set(componentIdx, {
                left: rect.left - originRect.left,
                top: rect.top - originRect.top,
            });
        }
        setPositions((previous) =>
            samePositions(previous, next) ? previous : next,
        );
    }, [componentIndices, slotElementId]);

    const contextValue = useMemo<MathSlotContextValue>(
        () => ({ reportSize, positions }),
        [reportSize, positions],
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
        if (!other || other.left !== value.left || other.top !== value.top) {
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
 * True while rendering inside a slot, so an input can drop the parts of itself
 * that make no sense inside an equation — its visible label and its check-work
 * button. The equation names the input instead; see `shortDescription`.
 */
export const InMathSlotContext = createContext(false);

export function useInMathSlot() {
    return useContext(InMathSlotContext);
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

    const reportSize = context?.reportSize;
    const position = context?.positions.get(componentIdx);

    const measure = useCallback(() => {
        const wrapper = wrapperRef.current;
        const baseline = baselineRef.current;
        if (!wrapper || !baseline || !reportSize) {
            return;
        }
        const rect = wrapper.getBoundingClientRect();
        // An empty zero-height inline-block sits with its bottom edge on the
        // line box's baseline, which is what splits the box into the height and
        // depth MathJax needs to reserve.
        const baselineY = baseline.getBoundingClientRect().bottom;
        reportSize(componentIdx, {
            width: Math.ceil(rect.width),
            height: Math.max(0, Math.ceil(baselineY - rect.top)),
            depth: Math.max(0, Math.ceil(rect.bottom - baselineY)),
        });
    }, [componentIdx, reportSize]);

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
                    ? { left: position.left, top: position.top }
                    : // Laid out so it can be measured, but neither drawn,
                      // announced, nor focusable until it has somewhere to be.
                      { left: 0, top: 0, visibility: "hidden" }
            }
        >
            <InMathSlotContext.Provider value={true}>
                {children}
            </InMathSlotContext.Provider>
            <span
                ref={baselineRef}
                aria-hidden="true"
                style={{ display: "inline-block", width: 0, height: 0 }}
            />
        </span>
    );
}
