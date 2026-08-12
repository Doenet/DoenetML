import React, {
    useMemo,
    useRef,
    useState,
    FocusEventHandler,
    KeyboardEvent,
    useContext,
    useEffect,
} from "react";
import { createPortal } from "react-dom";
import JXG from "jsxgraph";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { MathField } from "./mathquill/types";
import { EditableMathField } from "./mathquill/EditableMathField";
import "./mathquill/mathquill.css";
import {
    DEFAULT_MATH_INPUT_FUNCTION_NAMES,
    hasCoarsePrimaryPointer,
    subscribeToPrimaryPointerType,
} from "@doenet/utils";
import { isInVirtualKeyboardTray } from "@doenet/virtual-keyboard";
import { DescriptionPopover } from "./utils/Description";
import * as Ariakit from "@ariakit/react";

import { MathJax } from "better-react-mathjax";

import "./mathInput.css";
import { FocusedMathInputContext } from "../../doenetml";
import { useAppSelector } from "../../state";
import { keyboardSlice } from "../../state/slices/keyboard";
import {
    calculateValidationState,
    createCheckWorkComponent,
} from "./utils/checkWork";
import { addValidationStateToShortDescription } from "./utils/validationState";
import { useSubmitActionWithDelay } from "./utils/useSubmitActionWithDelay";
import { BoardContext, TEXT_LAYER_OFFSET } from "./graph";
import me from "math-expressions";
import {
    getPositionFromAnchorByCoordinate,
    POINTER_DRAG_THRESHOLD,
} from "./utils/graph";
import { JXGObject } from "./jsxgraph-distrib/types";
import { useChromeLangDir, useContentT, useT } from "../../utils/i18n";

const PREVIEW_UPDATE_DELAY_MS = 500;
const PARSE_ERROR_PLACEHOLDER_LATEX = "\uff3f";

/**
 * MathQuill rejects an empty `autoOperatorNames` string (its validator
 * requires at least one entry of >=2 letters/pipes/dashes), so when the
 * effective list is empty \u2014 e.g., the author wrote
 * `<mathInput resetFunctionNames="" />` to disable auto-formatting
 * entirely \u2014 we hand MathQuill a single sentinel that satisfies the
 * validator but can never match user input.
 *
 * `Letter.autoUnItalicize` (mathquill.js around line 7859) builds
 * candidate match strings from runs of contiguous `Letter` nodes only,
 * so a token containing a dash cannot match anything the author types.
 * We use `"a-"` (length 2, the minimum) instead of a long descriptive
 * string so MathQuill's computed `autoOperatorNames._maxLength` stays
 * small \u2014 that value drives the inner loop in `autoUnItalicize`, and a
 * smaller `_maxLength` means less work on every keystroke.
 */
const EMPTY_AUTO_OPERATOR_NAMES_SENTINEL = "a-";

/**
 * Encapsulates math input preview popover state and interaction behavior.
 *
 * The preview is shown only when preview is enabled, the current raw renderer
 * value is non-blank, and either the input itself is focused or the user is
 * actively interacting with the preview (pointer/focus/wheel). While focused,
 * preview opening and content updates are debounced by `previewUpdateDelayMs`.
 * Escape dismisses the preview until the next pending preview-content update
 * (or until blur resets dismissal state).
 */
function useMathInputPreview({
    id,
    showPreview,
    rawRendererValue,
    immediateValueLatex,
    errorMessageRawRenderer,
    focused,
    previewUpdateDelayMs,
    onEscapeFromPreview,
}: {
    id: string;
    showPreview: boolean;
    rawRendererValue: string;
    immediateValueLatex: string;
    errorMessageRawRenderer: string | null;
    focused: boolean;
    previewUpdateDelayMs: number;
    onEscapeFromPreview: () => void;
}) {
    const [interactingWithPreview, setInteractingWithPreview] = useState(false);
    const [escapeDismissed, setEscapeDismissed] = useState(false);
    const previewWheelTimeout = useRef<number | null>(null);
    const previewUpdateTimeout = useRef<number | null>(null);
    const [debouncedPreview, setDebouncedPreview] = useState({
        rawRendererValue,
        immediateValueLatex,
        errorMessageRawRenderer,
    });

    const previewRef = useRef<HTMLDivElement | null>(null);
    const previewPopover = Ariakit.usePopoverStore({
        placement: "right",
    });

    const previewId = `${id}-preview`;
    const trimmedRawRendererValue =
        debouncedPreview.rawRendererValue?.trim() ?? "";
    const shouldShowPreview =
        showPreview &&
        trimmedRawRendererValue !== "" &&
        !escapeDismissed &&
        (focused || interactingWithPreview);
    const isPreviewOpen = Ariakit.useStoreState(previewPopover, "open");

    useEffect(() => {
        if (shouldShowPreview && !isPreviewOpen) {
            previewPopover.show();
        } else if (!shouldShowPreview && isPreviewOpen) {
            previewPopover.hide();
        }
    }, [shouldShowPreview, isPreviewOpen]);

    /**
     * Keeps debounced preview content in sync with renderer state.
     *
     * While focused, updates are delayed to avoid preview churn during typing.
     * On blur, updates are applied immediately so an open preview (e.g. after
     * focus transfer into the popover) does not display stale content.
     *
     * State writes are skipped when values are already in sync. This avoids
     * unnecessary render churn, and ensures Escape-dismissed previews do not
     * re-open unless there is a real pending preview-content change.
     */
    useEffect(() => {
        if (previewUpdateTimeout.current !== null) {
            window.clearTimeout(previewUpdateTimeout.current);
            previewUpdateTimeout.current = null;
        }

        const hasPendingPreviewUpdate =
            debouncedPreview.rawRendererValue !== rawRendererValue ||
            debouncedPreview.immediateValueLatex !== immediateValueLatex ||
            debouncedPreview.errorMessageRawRenderer !==
                errorMessageRawRenderer;

        if (!focused) {
            setEscapeDismissed(false);
            // On blur, set preview content immediately. In focus-transfer cases
            // (e.g., tabbing from input into the preview), the popover may stay
            // open and would otherwise show stale debounced content.
            if (hasPendingPreviewUpdate) {
                setDebouncedPreview({
                    rawRendererValue,
                    immediateValueLatex,
                    errorMessageRawRenderer,
                });
            }
        } else {
            // Skip equivalent state writes to avoid unnecessary render churn.
            if (!hasPendingPreviewUpdate) {
                return;
            }

            previewUpdateTimeout.current = window.setTimeout(() => {
                setEscapeDismissed(false);
                setDebouncedPreview({
                    rawRendererValue,
                    immediateValueLatex,
                    errorMessageRawRenderer,
                });
                previewUpdateTimeout.current = null;
            }, previewUpdateDelayMs);
        }
    }, [
        rawRendererValue,
        immediateValueLatex,
        errorMessageRawRenderer,
        focused,
        previewUpdateDelayMs,
        debouncedPreview,
    ]);

    const handlePreviewPointerDown = () => {
        setInteractingWithPreview(true);
    };

    const handlePreviewPointerLeave = () => {
        setInteractingWithPreview(false);
    };

    const handlePreviewWheel = () => {
        setInteractingWithPreview(true);

        if (previewWheelTimeout.current !== null) {
            window.clearTimeout(previewWheelTimeout.current);
        }

        previewWheelTimeout.current = window.setTimeout(() => {
            setInteractingWithPreview(false);
            previewWheelTimeout.current = null;
        }, 200);
    };

    const dismissPreview = () => {
        setInteractingWithPreview(false);
        setEscapeDismissed(true);
        previewPopover.hide();
    };

    const handlePreviewKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        const scrollAmount = 40;
        const target = e.currentTarget;

        // Escape dismisses the preview and returns keyboard focus to the
        // associated math input so editing can continue immediately.
        if (e.key === "Escape") {
            dismissPreview();
            onEscapeFromPreview();
            e.preventDefault();
            e.stopPropagation();
            // Arrow/Home/End keys provide keyboard-only horizontal navigation
            // for long, non-wrapping MathJax expressions inside the preview.
        } else if (e.key === "ArrowRight") {
            target.scrollLeft += scrollAmount;
            e.preventDefault();
        } else if (e.key === "ArrowLeft") {
            target.scrollLeft -= scrollAmount;
            e.preventDefault();
        } else if (e.key === "Home") {
            target.scrollLeft = 0;
            e.preventDefault();
        } else if (e.key === "End") {
            target.scrollLeft = target.scrollWidth;
            e.preventDefault();
        }
    };

    useEffect(() => {
        return () => {
            if (previewWheelTimeout.current !== null) {
                window.clearTimeout(previewWheelTimeout.current);
            }
            if (previewUpdateTimeout.current !== null) {
                window.clearTimeout(previewUpdateTimeout.current);
            }
        };
    }, []);

    return {
        interactingWithPreview,
        setInteractingWithPreview,
        previewRef,
        previewPopover,
        previewId,
        isPreviewOpen,
        handlePreviewPointerDown,
        handlePreviewPointerLeave,
        handlePreviewWheel,
        handlePreviewKeyDown,
        dismissPreview,
        debouncedImmediateValueLatex: debouncedPreview.immediateValueLatex,
        debouncedErrorMessageRawRenderer:
            debouncedPreview.errorMessageRawRenderer,
    };
}

type MathInputPreviewState = ReturnType<typeof useMathInputPreview>;

/**
 * Renders the preview popover for a math input.
 *
 * The popover uses Ariakit positioning and forwards interaction handlers from
 * `useMathInputPreview` so keyboard, pointer, and wheel interactions can keep
 * the preview open while the user is engaging with it.
 */
function MathInputPreviewPopover({
    preview,
    showPreview,
    immediateValueLatex,
    errorMessageRawRenderer,
}: {
    preview: MathInputPreviewState;
    showPreview: boolean;
    immediateValueLatex: string;
    errorMessageRawRenderer: string | null;
}) {
    const t = useT();

    // The parse-error message is chrome — the reader's language inside the
    // document's box — while the raw expression quoted after it is what the
    // user typed. Re-declared as one run so its trailing colon stays against
    // the label, and empty unless the two directions disagree.
    const chromeLangDir = useChromeLangDir();

    if (!showPreview) {
        return null;
    }

    const showParseErrorMessage =
        immediateValueLatex === PARSE_ERROR_PLACEHOLDER_LATEX &&
        errorMessageRawRenderer !== null;

    return (
        <Ariakit.Popover
            store={preview.previewPopover}
            className="description-popover mathInputPreviewPopover"
            aria-label={t(
                "math-input-preview-region",
                undefined,
                "math expression preview",
            )}
            gutter={8}
            flip="top bottom left"
            fitViewport
            overflowPadding={12}
            autoFocusOnShow={false}
            autoFocusOnHide={false}
            ref={preview.previewRef}
            data-test="MathInput Preview"
            onPointerDownCapture={preview.handlePreviewPointerDown}
            onPointerLeave={preview.handlePreviewPointerLeave}
            onWheelCapture={preview.handlePreviewWheel}
        >
            <Ariakit.PopoverArrow />
            <div
                id={preview.previewId}
                className="mathInputPreviewContent"
                // The preview is notation, like the field it previews, and it
                // is this div that scrolls a long expression — the popover
                // does not portal, so inside a right-to-left document it
                // would otherwise become an RTL scroll container: it opens
                // showing the tail of the expression, and `scrollLeft` runs
                // from the negatives up to zero, which turns Home and End in
                // `handlePreviewKeyDown` into two ways of showing the same
                // end. MathJax pins `mjx-math` itself, but that is the
                // content, not the container that scrolls it. The parse-error
                // branch is left to inherit: it is wrapping prose, and the
                // chrome half of it re-declares itself below when it
                // disagrees with the document.
                dir={showParseErrorMessage ? undefined : "ltr"}
                tabIndex={0}
                aria-label={t("math-input-preview", undefined, "Preview")}
                onFocus={() => preview.setInteractingWithPreview(true)}
                onBlur={() => preview.setInteractingWithPreview(false)}
                onKeyDown={preview.handlePreviewKeyDown}
            >
                {showParseErrorMessage ? (
                    <div
                        className="mathInputPreviewErrorMessage"
                        {...chromeLangDir}
                    >
                        <strong>
                            {t(
                                "math-input-invalid-expression",
                                undefined,
                                "Invalid expression:",
                            )}
                        </strong>{" "}
                        {errorMessageRawRenderer}
                    </div>
                ) : (
                    <MathJax hideUntilTypeset={"first"} inline dynamic>
                        {`\\(${immediateValueLatex}\\)`}
                    </MathJax>
                )}
            </div>
        </Ariakit.Popover>
    );
}

/**
 * Whether the reader's primary pointing device is coarse, re-evaluated if that
 * changes (a tablet gaining a trackpad).
 */
function useHasCoarsePrimaryPointer(): boolean {
    return React.useSyncExternalStore(
        subscribeToPrimaryPointerType,
        hasCoarsePrimaryPointer,
        // Server snapshot: assume a conventional pointer device.
        () => false,
    );
}

interface MathInputSVs {
    [key: string]: any;
    hidden: boolean;
    disabled: boolean;
    fixed: boolean;
    fixLocation: boolean;
    draggable: boolean;
    anchor: any;
    positionFromAnchor: any;
    label: string;
    labelHasLatex: boolean;
    labelPosition: string;
    justSubmitted: boolean;
    forceFullCheckWorkButton: boolean;
    colorCorrectness: boolean;
    errorMessageRawRenderer: any;
    externalLabelRendererIds: any;
    immediateValueLatex: string;
    minWidth: any;
    rawRendererValue: any;
    shortDescription: string;
    showCheckWork: boolean;
    showPreview: boolean;
    includeValidationStateInShortDescription?: boolean;
    // Optional because `_matrixComponentInput` reuses this renderer
    // (`rendererType = "mathInput"`) without defining the SV; the
    // `??` fallback below handles the absent case.
    effectiveFunctionNames?: string[];
}

export default function MathInput(props: UseDoenetRendererProps) {
    let { id, SVs, children, actions, ignoreUpdate, callAction } =
        useDoenetRenderer<MathInputSVs>(props);

    // The check-work button and the validation state announced on the input
    // both follow the document's language, not the reader's — see
    // `useContentT`.
    const tContent = useContentT();

    // @ts-ignore
    MathInput.baseStateVariable = "rawRendererValue";
    // @ts-ignore
    MathInput.ignoreActionsWithoutCore = (actionName: string) =>
        actionName === "moveInput";

    const virtualKeyboardEvents = useAppSelector(
        keyboardSlice.selectors.keyboardInput,
    );
    const systemKeyboardRequested = useAppSelector(
        keyboardSlice.selectors.systemKeyboardRequested,
    );
    const focusedMathInput = useContext(FocusedMathInputContext);
    const [mathField, setMathField] = useState<MathField | null>(null);
    // `EditableMathField`'s `handlers.enter` callback can hold stale captures.
    // Keep the latest MathField instance in a ref for enter handling.
    const mathFieldRef = useRef<MathField | null>(null);
    mathFieldRef.current = mathField;
    const [focused, setFocused] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null); // Ref to keep track of the mathInput's disabled state

    // On a touch device the Doenet keyboard and the device's own on-screen
    // keyboard compete for the same screen, so only one of them may be in
    // play. The Doenet keyboard has it unless the reader closes the tray,
    // which is how they ask for the device's keyboard back. Deciding this from
    // the outset, rather than waiting for the tray to open, is what stops the
    // system keyboard from appearing at the first math input a reader taps.
    const coarsePointer = useHasCoarsePrimaryPointer();
    const suppressSystemKeyboard = coarsePointer && !systemKeyboardRequested;

    useEffect(() => {
        const textarea = textareaRef.current;
        if (!textarea) {
            return;
        }
        // `inputmode="none"` keeps focus, the caret, selection, and any
        // physical keyboard working while telling the device not to raise its
        // on-screen keyboard — the standard way to run a custom math keyboard
        // on the web (issue #1692). Supported by Chrome/Android 66+, Safari
        // iOS 12.2+, and Firefox for Android; ignored by desktop browsers,
        // which is harmless because it is only ever set on touch devices.
        //
        // Changing this while the input is focused does not retract a system
        // keyboard that is already up: reopening it, or dismissing it, needs a
        // fresh tap on the input, because iOS raises the keyboard only during
        // a user gesture and this runs after one.
        textarea.inputMode = suppressSystemKeyboard ? "none" : "text";
    }, [suppressSystemKeyboard, mathField]);

    const rendererValue = useRef(SVs.rawRendererValue);

    // Keep this in a ref so `handlePressEnter` always sees current state.
    const showCheckWork = useRef(SVs.showCheckWork);
    showCheckWork.current = SVs.showCheckWork;

    // ===== In-graph rendering state =====
    // When a <mathInput> is placed inside a <graph>, we mount the MathQuill
    // field (via createPortal) into an empty JSXGraph `text` element so it can
    // be anchored and dragged on the board. These hooks/refs support that path;
    // they are inert when `board` is null (the normal inline case).
    const board = useContext(BoardContext);

    const textJXG = useRef<JXGObject | null>(null);
    const anchorPointJXG = useRef<JXGObject | null>(null);
    const anchorRel = useRef<[string, string] | null>(null);

    const pointerAtDown = useRef<[number, number] | null>(null);
    const pointAtDown = useRef<[number, number, number] | null>(null);
    const dragged = useRef(false);

    const calculatedX = useRef<number | null>(null);
    const calculatedY = useRef<number | null>(null);

    const lastPositionFromCore = useRef<number[] | null>(null);
    const previousPositionFromAnchor = useRef<any>(null);

    const fixed = useRef(false);
    const fixLocation = useRef(false);

    fixed.current = SVs.fixed;
    fixLocation.current = !SVs.draggable || SVs.fixLocation || SVs.fixed;

    const preview = useMathInputPreview({
        id,
        showPreview: SVs.showPreview,
        rawRendererValue: SVs.rawRendererValue,
        immediateValueLatex: SVs.immediateValueLatex,
        errorMessageRawRenderer: SVs.errorMessageRawRenderer,
        focused,
        previewUpdateDelayMs: PREVIEW_UPDATE_DELAY_MS,
        onEscapeFromPreview: () => {
            textareaRef.current?.focus();
        },
    });

    if (!ignoreUpdate) {
        rendererValue.current = SVs.rawRendererValue;
    }

    // The worker resolves the effective list (defaults +/- deltas, or
    // `resetFunctionNames` verbatim) and emits a `warning` diagnostic if
    // any tokens were dropped for failing MathQuill's validator. All
    // the renderer has to do here is join the deduped/validated list
    // and substitute a sentinel for the empty case (MathQuill rejects
    // an empty `autoOperatorNames` string outright; see the sentinel's
    // doc comment).
    //
    // `_matrixComponentInput` also mounts this renderer (it sets
    // `rendererType = "mathInput"`) but does not author the three
    // function-name attributes, so its SVs map omits
    // `effectiveFunctionNames`. Fall back to the shared default list
    // in that case so matrix cells still auto-format the same names a
    // bare `<mathInput/>` would.
    const autoOperatorNames = useMemo(() => {
        const names =
            SVs.effectiveFunctionNames ?? DEFAULT_MATH_INPUT_FUNCTION_NAMES;
        return names.length > 0
            ? names.join(" ")
            : EMPTY_AUTO_OPERATOR_NAMES_SENTINEL;
    }, [SVs.effectiveFunctionNames]);

    // Keep this in a ref so `handlePressEnter` always sees current state.
    let validationState = useRef<
        "unvalidated" | "correct" | "incorrect" | "partialcorrect"
    >("unvalidated");

    validationState.current = calculateValidationState(SVs);

    const { isPending, submitActionWithPending } = useSubmitActionWithDelay({
        actionKey: "submitAnswer",
        actions,
        callAction,
        validationState: validationState.current,
        justSubmitted: SVs.justSubmitted,
    });

    // `EditableMathField` can invoke an older enter handler capture.
    // Read submit callback from a ref so Enter always uses current guard state.
    const submitActionWithPendingRef = useRef(submitActionWithPending);
    submitActionWithPendingRef.current = submitActionWithPending;

    const handlePressEnter = React.useCallback(() => {
        if (!mathFieldRef.current) {
            return;
        }
        // The "Enter" key was pressed
        callAction({
            action: actions.updateValue,
            baseVariableValue: rendererValue.current,
        });

        if (
            showCheckWork.current &&
            validationState.current === "unvalidated"
        ) {
            submitActionWithPendingRef.current();
        }
    }, [callAction]);

    React.useEffect(() => {
        if (!mathField || focusedMathInput.current !== mathField.el()) {
            // These keys belong to a different input. `focusedMathInput` is
            // the record of which input the virtual keyboard is typing into;
            // it deliberately outlives `document.activeElement` moving into
            // the tray, so that the keyboard can be operated from the keyboard.
            return;
        }
        for (const event of virtualKeyboardEvents) {
            if (event.type === "keystroke" && event.command === "Enter") {
                // The "Enter" key was pressed
                callAction({
                    action: actions.updateValue,
                    baseVariableValue: rendererValue.current,
                });

                if (
                    showCheckWork.current &&
                    validationState.current === "unvalidated"
                ) {
                    submitActionWithPendingRef.current();
                }
                continue;
            }
            switch (event.type) {
                case "accessed":
                case "keyboardChoice":
                    // Not key presses. Both are handled elsewhere (or, for
                    // `accessed`, no longer needed at all); see `KeyCommand`.
                    break;
                case "cmd":
                    mathField.cmd(event.command);
                    break;
                case "write":
                    mathField.write(event.command);
                    break;
                case "keystroke":
                    mathField.keystroke(event.command);
                    break;
                case "type":
                    mathField.typedText(event.command);
                    break;
                default:
                    console.warn(
                        `Unknown event type: ${event.type} in MathInput`,
                        event,
                    );
                    break;
            }
        }
        // Deliberately no `mathField.focus()` here. The tray declines focus, so
        // this input still has it; and when the reader has instead tabbed into
        // the tray, pulling focus back would make the keyboard impossible to
        // operate by keyboard. Refocusing on every key is also what re-summoned
        // Android's system keyboard over the tray (issue #1692).
    }, [virtualKeyboardEvents]);

    function onFocusChanged(focused: boolean) {
        setFocused(focused);
        callAction({
            action: actions.focusChanged,
            args: { focused },
        });
    }

    const handleFocus = (e: React.FocusEvent) => {
        if (mathField) {
            focusedMathInput.current = mathField.el();
        }
        onFocusChanged(true);
    };

    const handleBlur: FocusEventHandler<HTMLElement> = (e) => {
        const relatedTarget = e.relatedTarget;

        if (isInVirtualKeyboardTray(relatedTarget)) {
            // The reader moved focus into the virtual keyboard in order to type
            // with it, so this input is still the one being edited: stay
            // registered as the target of its keys, and neither commit the
            // value nor drop the focused styling. Pressing a key does not reach
            // here at all — the tray cancels the default action of the pointer
            // press, so focus never leaves the input; only deliberate keyboard
            // navigation into the tray produces this blur.
            //
            // Nothing releases the input if the reader then tabs out of the
            // tray to something else: it stays styled as focused, with its
            // value uncommitted, until they come back to it. Same gap, and the
            // same reason for leaving it as it is, as the tray's own claim —
            // see `reportMathInputFocus`.
            return;
        }

        // For a genuine blur, stop claiming the virtual keyboard's keys, then
        // commit and unfocus.
        if (mathField && focusedMathInput.current === mathField.el()) {
            focusedMathInput.current = null;
        }

        callAction({
            action: actions.updateValue,
            baseVariableValue: rendererValue.current,
        });
        onFocusChanged(false);

        // Keep preview open when keyboard focus tabs from the input into the
        // preview region.
        if (
            relatedTarget instanceof Node &&
            preview.previewRef.current?.contains(relatedTarget)
        ) {
            preview.setInteractingWithPreview(true);
        }
    };

    const onChangeHandler = (text: string) => {
        // Ignore whitespace and single-character exponent braces when deciding
        // whether the raw renderer value has changed.
        if (
            text.replace(/\s/g, "").replace(/\^{(\w)}/g, "^$1") !==
            rendererValue.current
                ?.replace(/\s/g, "")
                .replace(/\^{(\w)}/g, "^$1")
        ) {
            rendererValue.current = text;

            callAction({
                action: actions.updateRawValue,
                args: {
                    rawRendererValue: text,
                },
                baseVariableValue: text,
            });
        }
    };

    // On unmount, tear down the JSXGraph text element (if we created one).
    useEffect(() => {
        return () => {
            if (textJXG.current !== null) {
                deleteTextJXG();
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Stop pointer/mouse/touch starts on the in-graph field from reaching the
    // board's drag handler, so clicking to edit never starts a drag. This uses
    // NATIVE, bubble-phase listeners on the field element (mirroring JSXGraph's
    // own native-input trick): JSXGraph attaches its `pointerdown`/`mousedown`/
    // `touchstart` handlers on the board container in the bubble phase, so a
    // bubble-phase `stopPropagation` on this descendant fires first and stops
    // the drag — while the event has already reached MathQuill so the field
    // still focuses and places its cursor. React's capture-phase handlers can't
    // be used: React dispatches them at the root during the native capture
    // phase, so `stopPropagation` there halts the event before it ever reaches
    // MathQuill (which is why clicking focused but typing did nothing).
    const graphFieldRefCallback = React.useCallback(
        (node: HTMLDivElement | null) => {
            if (!node) {
                return;
            }
            const stop = (e: Event) => e.stopPropagation();
            node.addEventListener("pointerdown", stop);
            node.addEventListener("mousedown", stop);
            node.addEventListener("touchstart", stop);
            return () => {
                node.removeEventListener("pointerdown", stop);
                node.removeEventListener("mousedown", stop);
                node.removeEventListener("touchstart", stop);
            };
        },
        [],
    );

    function createTextJXGForMath() {
        if (board === null) {
            return null;
        }

        let jsxTextAttributes: Record<string, any> = {
            visible: !SVs.hidden,
            fixed: fixed.current,
            layer: TEXT_LAYER_OFFSET,
            highlight: !fixLocation.current,
            // Keep parsing off: JSXGraph must never interpret or rewrite the
            // element's content (we own it through the portal).
            parse: false,
        };

        let newAnchorPointJXG: JXGObject;

        try {
            let anchor = me.fromAst(SVs.anchor);
            let anchorCoords = [
                anchor.get_component(0).evaluate_to_constant() ?? NaN,
                anchor.get_component(1).evaluate_to_constant() ?? NaN,
            ];

            if (!Number.isFinite(anchorCoords[0])) {
                anchorCoords[0] = 0;
                jsxTextAttributes["visible"] = false;
            }
            if (!Number.isFinite(anchorCoords[1])) {
                anchorCoords[1] = 0;
                jsxTextAttributes["visible"] = false;
            }

            newAnchorPointJXG = board.create("point", anchorCoords, {
                visible: false,
            });
        } catch (e) {
            jsxTextAttributes["visible"] = false;
            newAnchorPointJXG = board.create("point", [0, 0], {
                visible: false,
            });
            return;
        }

        jsxTextAttributes.anchor = newAnchorPointJXG;

        let { anchorx, anchory } = getPositionFromAnchorByCoordinate(
            SVs.positionFromAnchor,
        );
        jsxTextAttributes.anchorx = anchorx;
        jsxTextAttributes.anchory = anchory;
        anchorRel.current = [anchorx, anchory];

        // Create the text element with EMPTY content. JSXGraph produces an
        // absolutely-positioned `rendNode` div and keeps it positioned each
        // frame, but because the content stays "" forever its
        // `htmlStr !== content` guard never fires — so it never writes
        // innerHTML and never clobbers the portaled MathQuill DOM.
        // NEVER call setText/.set(value) on this element.
        let newTextJXG: JXGObject = board.create(
            "text",
            [0, 0, ""],
            jsxTextAttributes,
        );
        newTextJXG.isDraggable = !fixLocation.current;

        // Hand-rolled drag handlers mirroring textInput.tsx (we can't reuse
        // attachAnchoredGraphDragHandlers, which requires focused/clicked
        // actions the input components don't define).
        newTextJXG.on("down", function (e: any) {
            (document.activeElement as HTMLElement | null)?.blur();

            pointerAtDown.current = [e.x, e.y];
            pointAtDown.current = [...newAnchorPointJXG.coords.scrCoords];
            dragged.current = false;
        });

        newTextJXG.on("hit", function () {
            dragged.current = false;
        });

        newTextJXG.on("up", function () {
            if (dragged.current) {
                callAction({
                    action: actions.moveInput,
                    args: {
                        x: calculatedX.current,
                        y: calculatedY.current,
                    },
                });
                dragged.current = false;
            }
        });

        newTextJXG.on("keyfocusout", function () {
            if (dragged.current) {
                callAction({
                    action: actions.moveInput,
                    args: {
                        x: calculatedX.current,
                        y: calculatedY.current,
                    },
                });
                dragged.current = false;
            }
        });

        newTextJXG.on("drag", function (e: any) {
            let viaPointer = e.type === "pointermove";

            // Protect against very small unintended drags
            if (
                !viaPointer ||
                Math.abs(e.x - pointerAtDown.current![0]) >
                    POINTER_DRAG_THRESHOLD ||
                Math.abs(e.y - pointerAtDown.current![1]) >
                    POINTER_DRAG_THRESHOLD
            ) {
                dragged.current = true;
            }

            let [xMin, yMax, xMax, yMin] = board.getBoundingBox();
            let width = newTextJXG.size[0] / board.unitX;
            let height = newTextJXG.size[1] / board.unitY;

            let anchorx = anchorRel.current?.[0] || 0;
            let anchory = anchorRel.current?.[1] || 0;

            let offsetx = 0;
            if (anchorx === "middle") {
                offsetx = -width / 2;
            } else if (anchorx === "right") {
                offsetx = -width;
            }
            let offsety = 0;
            if (anchory === "middle") {
                offsety = -height / 2;
            } else if (anchory === "top") {
                offsety = -height;
            }

            let xminAdjusted = xMin + 0.04 * (xMax - xMin) - offsetx - width;
            let xmaxAdjusted = xMax - 0.04 * (xMax - xMin) - offsetx;
            let yminAdjusted = yMin + 0.04 * (yMax - yMin) - offsety - height;
            let ymaxAdjusted = yMax - 0.04 * (yMax - yMin) - offsety;

            if (viaPointer && pointAtDown.current && pointerAtDown.current) {
                // the reason we calculate point position with this algorithm,
                // rather than using .X() and .Y() directly
                // is that attributes .X() and .Y() are affected by the
                // .setCoordinates function called in update().
                // Due to this dependence, the location of .X() and .Y()
                // can be affected by constraints of objects that the points depends on,
                // leading to a different location on up than on drag
                // (as dragging uses the mouse location)
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
                    newTextJXG.relativeCoords.usrCoords[1];
                calculatedY.current =
                    newAnchorPointJXG.Y() +
                    newTextJXG.relativeCoords.usrCoords[2];
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
                action: actions.moveInput,
                args: {
                    x: calculatedX.current,
                    y: calculatedY.current,
                    transient: true,
                    skippable: true,
                },
            });

            newTextJXG.relativeCoords.setCoordinates(
                JXG.COORDS_BY_USER,
                [0, 0],
            );
            newAnchorPointJXG.coords.setCoordinates(
                JXG.COORDS_BY_USER,
                lastPositionFromCore.current,
            );
        });

        newTextJXG.on("keydown", function (e: any) {
            if (e.key === "Enter") {
                if (dragged.current) {
                    callAction({
                        action: actions.moveInput,
                        args: {
                            x: calculatedX.current,
                            y: calculatedY.current,
                        },
                    });
                    dragged.current = false;
                }
            }
        });

        textJXG.current = newTextJXG;
        anchorPointJXG.current = newAnchorPointJXG;
        previousPositionFromAnchor.current = SVs.positionFromAnchor;
    }

    function deleteTextJXG() {
        if (!textJXG.current) {
            return;
        }
        textJXG.current.off("down");
        textJXG.current.off("hit");
        textJXG.current.off("up");
        textJXG.current.off("keyfocusout");
        textJXG.current.off("drag");
        textJXG.current.off("keydown");
        board?.removeObject(textJXG.current);
        textJXG.current = null;
    }

    if (SVs.hidden && !board) {
        return null;
    }

    let mathInputStyle: React.CSSProperties = {
        /* Set border properties individually because border color is updated
           during rerender (e.g., disabled/validation state). */
        borderColor: "var(--canvasText)",
        borderStyle: "solid",
        borderWidth: "2px",
        margin: "0px",
        boxShadow: "none",
        outlineOffset: "2px",
        outlineColor: "var(--canvasText)",
        outlineWidth: "2px",
        backgroundColor: "var(--canvas)",
        minWidth: `${SVs.minWidth > 0 ? SVs.minWidth : 0}px`,
    };

    // TODO: move this focus outline styling into CSS.
    if (focused) {
        mathInputStyle.outlineStyle = "solid";
    }

    let mathInputWrapperCursor = "allowed";
    if (SVs.disabled) {
        // Disabled state: border and background both use --revealButtonSurface
        // so the border blends into the background (muted, flat appearance).
        // In light mode --revealButtonSurface is #e3e3e3, same as --mainGray,
        // which already produced this effect.  Setting the border explicitly
        // here makes dark mode match: #3a3a3a border on #3a3a3a background.
        mathInputStyle.borderColor = "var(--revealButtonSurface)";
        mathInputStyle.backgroundColor = "var(--revealButtonSurface)";
        mathInputStyle.pointerEvents = "none";
        mathInputWrapperCursor = "not-allowed";
    }

    if (textareaRef.current && textareaRef.current.disabled !== SVs.disabled) {
        // Update the mathInput ref's disabled state
        textareaRef.current.disabled = SVs.disabled;
    }

    let label: React.ReactNode = SVs.label;
    const inputKey = `${id}_input`;
    const hasLabel =
        typeof SVs.label === "string" ? SVs.label.trim() !== "" : !!SVs.label;
    const labelId = `${id}-input-label`;
    if (SVs.labelHasLatex) {
        label = (
            <MathJax hideUntilTypeset={"first"} inline dynamic>
                {label}
            </MathJax>
        );
    }

    let shortDescription = SVs.shortDescription || undefined;

    // ACCESSIBILITY: Get external labels that reference this input via `for` attribute
    const externalLabelRendererIds = SVs.externalLabelRendererIds ?? [];
    const hasExplicitLabel = hasLabel || externalLabelRendererIds.length > 0;

    // ACCESSIBILITY: Create ID for shortDescription span so it can be
    // referenced by textarea's aria-labelledby via EditableMathField
    const shortDescriptionId =
        !hasExplicitLabel && shortDescription
            ? `${id}-short-description`
            : undefined;

    // description will be the one non-null child
    const descriptionChild = children.find((child) => child);

    let descriptionId: string | undefined = undefined;
    let description: React.ReactNode | null = null;

    if (descriptionChild) {
        descriptionId = `${id}-description-content`;
        description = (
            <DescriptionPopover>
                <div id={descriptionId}>{descriptionChild}</div>
            </DescriptionPopover>
        );
    }

    const ariaDetailsIds = [
        descriptionId,
        preview.isPreviewOpen ? preview.previewId : undefined,
    ]
        .filter(Boolean)
        .join(" ");

    if (SVs.colorCorrectness) {
        if (validationState.current === "correct") {
            mathInputStyle.borderColor = "var(--mainGreen)";
            mathInputStyle.outlineColor = "var(--mainGreen)";
        } else if (validationState.current === "incorrect") {
            mathInputStyle.borderColor = "var(--mainRed)";
            mathInputStyle.outlineColor = "var(--mainRed)";
        } else if (validationState.current === "partialcorrect") {
            mathInputStyle.borderColor = "var(--mainOrange)";
            mathInputStyle.outlineColor = "var(--mainOrange)";
        }
        if (SVs.includeValidationStateInShortDescription !== false) {
            shortDescription = addValidationStateToShortDescription(
                validationState.current,
                shortDescription,
                tContent,
            );
        }
    }

    const ariaDescription =
        hasExplicitLabel && shortDescription ? shortDescription : undefined;

    // The MathQuill field, shared verbatim by the inline and in-graph branches
    // so both paths carry identical config, a11y wiring, and change handling.
    const mathFieldElement = (
        <EditableMathField
            style={mathInputStyle}
            latex={rendererValue.current}
            // ACCESSIBILITY: Pass label IDs (internal + external) so they are prepended
            // to the textarea's aria-labelledby (which includes MathQuill's auto-generated
            // math speech ID). This ensures explicit labels are announced before math descriptions.
            labelIds={
                hasLabel
                    ? [labelId, ...externalLabelRendererIds]
                    : externalLabelRendererIds
            }
            shortDescriptionId={shortDescriptionId}
            // Supplementary annotations (not primary labels)
            aria-description={ariaDescription}
            aria-details={ariaDetailsIds || undefined}
            config={{
                autoCommands:
                    "alpha beta gamma delta epsilon zeta eta mu nu xi omega rho sigma tau phi chi psi omega iota kappa lambda Gamma Delta Xi Omega Sigma Phi Psi Omega Lambda sqrt pi Pi theta Theta integral infinity forall exists",
                autoOperatorNames,
                handlers: {
                    enter: handlePressEnter,
                },
                substituteTextarea: function () {
                    textareaRef.current = document.createElement("textarea");
                    textareaRef.current.id = inputKey;
                    textareaRef.current.disabled = SVs.disabled;
                    // MathQuill puts these on the textarea it would have built
                    // itself, so a substitute has to repeat them. They matter
                    // most on phones, whose keyboards would otherwise
                    // capitalize and autocorrect mathematics.
                    textareaRef.current.setAttribute("autocapitalize", "off");
                    textareaRef.current.setAttribute("autocomplete", "off");
                    textareaRef.current.setAttribute("autocorrect", "off");
                    textareaRef.current.spellcheck = false;
                    textareaRef.current.addEventListener("keydown", (event) => {
                        if (event.key === "Escape") {
                            // Match preview Escape behavior: dismiss the
                            // popover until the next user interaction.
                            preview.dismissPreview();
                        }
                    });
                    return textareaRef.current;
                },
            }}
            onChange={(mField: any) => {
                onChangeHandler(mField.latex());
            }}
            onBlur={handleBlur}
            onFocus={handleFocus}
            mathquillDidMount={(mf: any) => {
                setMathField(mf);
                // When rendered in a graph, the JSXGraph text element hosting the
                // portaled field starts with empty content, so its measured size is
                // near-zero until MathQuill fills it. Force one size refresh so drag
                // clamping reflects the real field box. (`needsSizeUpdate`/
                // `updateSize` exist on JSXGraph text elements but aren't in the
                // legacy JXGObject typing, hence the cast.)
                if (board && textJXG.current) {
                    const textEl = textJXG.current as any;
                    textEl.needsSizeUpdate = true;
                    textEl.updateSize?.();
                    board.updateRenderer();
                }
            }}
        />
    );

    // ===== In-graph branch =====
    // Mount the shared field into the JSXGraph text element's rendNode via a
    // portal. Native bubble-phase listeners on the field region stop pointer/
    // mouse/touch starts from reaching the board's drag handler, so clicking to
    // edit never starts a board drag (see `graphFieldRefCallback`); the label/
    // grip handle omits them so it stays grabbable for dragging.
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

        if (textJXG.current === null) {
            createTextJXGForMath();
        } else if (anchorPointJXG.current) {
            // NOTE: never call setText/.set here — the JXG content must stay ""
            // forever so JSXGraph never overwrites the portaled MathQuill DOM.
            textJXG.current.relativeCoords.setCoordinates(
                JXG.COORDS_BY_USER,
                [0, 0],
            );
            anchorPointJXG.current.coords.setCoordinates(
                JXG.COORDS_BY_USER,
                anchorCoords,
            );

            let visible = !SVs.hidden;

            if (
                Number.isFinite(anchorCoords[0]) &&
                Number.isFinite(anchorCoords[1])
            ) {
                let actuallyChangedVisibility =
                    textJXG.current.visProp["visible"] !== visible;
                textJXG.current.visProp["visible"] = visible;
                textJXG.current.visPropCalc["visible"] = visible;

                if (actuallyChangedVisibility) {
                    // this function is incredibly slow, so don't run it if not necessary
                    textJXG.current.setAttribute({ visible });
                }
            } else {
                textJXG.current.visProp["visible"] = false;
                textJXG.current.visPropCalc["visible"] = false;
            }

            textJXG.current.visProp.highlight = !fixLocation.current;
            textJXG.current.visProp.fixed = fixed.current;
            textJXG.current.isDraggable = !fixLocation.current;

            textJXG.current.needsUpdate = true;

            if (SVs.positionFromAnchor !== previousPositionFromAnchor.current) {
                let { anchorx, anchory } = getPositionFromAnchorByCoordinate(
                    SVs.positionFromAnchor,
                );
                textJXG.current.visProp.anchorx = anchorx;
                textJXG.current.visProp.anchory = anchory;
                anchorRel.current = [anchorx, anchory];
                previousPositionFromAnchor.current = SVs.positionFromAnchor;
                textJXG.current.fullUpdate();
            } else {
                textJXG.current.update();
            }

            anchorPointJXG.current.needsUpdate = true;
            anchorPointJXG.current.update();
            board.updateRenderer();
        }

        // Label & drag handle placement inside the graph. The handle sits beside
        // the field (before it by default, or after it when
        // `labelPosition="end"`), never above it.
        // - A label (when present) is shown beside the field and, when the input
        //   is draggable, doubles as the grab region (mirroring native
        //   <textInput>). It keeps `id={labelId}` so the field's aria-labelledby
        //   reference resolves inside the portal.
        // - When there is no label but the input is draggable, show a small grip
        //   so there is still something to grab.
        // - When the input is not draggable, show no grip and no drag cursor.
        const draggableInGraph = !fixLocation.current;
        let graphHandle: React.ReactNode = null;
        if (hasLabel) {
            graphHandle = (
                <label
                    id={labelId}
                    htmlFor={inputKey}
                    className={
                        "mathInputGraphHandle" +
                        (draggableInGraph ? " mathInputGraphDraggable" : "")
                    }
                >
                    {label}
                </label>
            );
        } else if (draggableInGraph) {
            graphHandle = (
                <div
                    className="mathInputGraphHandle mathInputGraphGrip mathInputGraphDraggable"
                    aria-hidden="true"
                >
                    ⠿
                </div>
            );
        }

        const labelAtEnd = hasLabel && SVs.labelPosition === "end";

        return (
            <>
                <span id={id} />
                {textJXG.current?.rendNode &&
                    createPortal(
                        <div className="mathInputGraphWrapper">
                            {/* Visually hidden span referenced by aria-labelledby when shortDescription is the fallback label */}
                            {shortDescriptionId && (
                                <span
                                    id={shortDescriptionId}
                                    className="visually-hidden"
                                >
                                    {shortDescription}
                                </span>
                            )}
                            {!labelAtEnd && graphHandle}
                            <div
                                className="mathInputGraphField"
                                ref={graphFieldRefCallback}
                            >
                                {mathFieldElement}
                            </div>
                            {labelAtEnd && graphHandle}
                        </div>,
                        textJXG.current.rendNode,
                    )}
            </>
        );
    }

    // ===== Inline (non-graph) branch =====

    const checkWorkComponent = createCheckWorkComponent(
        SVs,
        id,
        validationState.current,
        submitActionWithPending,
        SVs.forceFullCheckWorkButton,
        isPending,
        tContent,
    );

    const labelComponent = hasLabel ? (
        <label
            id={labelId}
            htmlFor={inputKey}
            style={{
                marginInlineEnd:
                    SVs.labelPosition === "end" ? undefined : "2px",
                marginInlineStart:
                    SVs.labelPosition === "end" ? "2px" : undefined,
            }}
        >
            {label}
        </label>
    ) : null;

    const inputRow = (
        <span
            style={{
                display: "inline-flex",
                alignItems: "flex-start",
                // The input row flows as inline content (see the container
                // comment). `vertical-align: baseline` aligns it with the text
                // baseline of its line, keeping a single tall-math label
                // aligned with the input (#945).
                verticalAlign: "baseline",
            }}
        >
            {/* Visually hidden span referenced by aria-labelledby when shortDescription is the fallback label */}
            {shortDescriptionId && (
                <span id={shortDescriptionId} className="visually-hidden">
                    {shortDescription}
                </span>
            )}
            <Ariakit.PopoverAnchor
                store={preview.previewPopover}
                className="mathInputWrapper"
                style={{
                    cursor: mathInputWrapperCursor,
                    display: "block",
                }}
            >
                {mathFieldElement}
            </Ariakit.PopoverAnchor>
            <MathInputPreviewPopover
                preview={preview}
                showPreview={SVs.showPreview}
                immediateValueLatex={preview.debouncedImmediateValueLatex}
                errorMessageRawRenderer={
                    preview.debouncedErrorMessageRawRenderer
                }
            />
            {checkWorkComponent}
            {description}
        </span>
    );

    return (
        <React.Fragment>
            <span
                id={id}
                // `display: inline` keeps the label and input row as ordinary
                // inline content so the whole input flows with its paragraph:
                // text before and after the input wraps together with the label
                // and input box, and a long label wraps across lines with the
                // input following its end rather than baseline-aligning to the
                // label's *first* line, where it looked embedded in the label
                // text (#1245). (inline-block would instead make the label and
                // input an atomic box that surrounding paragraph text cannot
                // wrap together with.) A single tall label (e.g. tall math)
                // still aligns with the input via the input row's
                // `vertical-align: baseline` (preserving #945).
                style={{
                    display: "inline",
                }}
            >
                {SVs.labelPosition === "end" ? (
                    <>
                        {inputRow}
                        {labelComponent}
                    </>
                ) : (
                    <>
                        {labelComponent}
                        {inputRow}
                    </>
                )}
            </span>
        </React.Fragment>
    );
}
