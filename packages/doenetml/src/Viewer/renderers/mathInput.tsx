import React, {
    useRef,
    useState,
    FocusEventHandler,
    KeyboardEvent,
    useContext,
    useEffect,
} from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { MathField } from "./mathquill/types";
import { EditableMathField } from "./mathquill/EditableMathField";
import "./mathquill/mathquill.css";
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
import { addValidationStateToShortDescription } from "./utils/description";

export default function MathInput(props: UseDoenetRendererProps) {
    let { id, SVs, children, actions, ignoreUpdate, callAction } =
        useDoenetRenderer(props);

    // @ts-ignore
    MathInput.baseStateVariable = "rawRendererValue";

    const virtualKeyboardEvents = useAppSelector(
        keyboardSlice.selectors.keyboardInput,
    );
    const focusedMathInput = useContext(FocusedMathInputContext);
    const [mathField, setMathField] = useState<MathField | null>(null);
    // The handles.enter of `EditableMathField` callback for some reason does not get updated when it changes.
    // To work around this, we safe the current mathField in a ref and use that in the callback.
    const mathFieldRef = useRef<MathField | null>(null);
    mathFieldRef.current = mathField;
    const [focused, setFocused] = useState(false);
    // Keep the preview open while the user is actively interacting with the popover
    // itself (for example dragging the horizontal scrollbar or using Shift+wheel).
    // Without this, blurring the math input immediately hides the popover and makes
    // long preview content difficult to inspect.
    const [interactingWithPreview, setInteractingWithPreview] =
        useState(false);
    // Debounce wheel-interaction end so a sequence of wheel events is treated as one
    // continuous interaction.
    const previewWheelTimeout = useRef<number | null>(null);
    const previewRef = useRef<HTMLDivElement | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null); // Ref to keep track of the mathInput's disabled state
    // The preview prefers to appear to the right, but Popover props configure
    // viewport-aware fallback to avoid clipping near screen edges.
    const previewPopover = Ariakit.usePopoverStore({
        placement: "right",
    });

    const lastKeyboardAccessTime = useRef(0);
    const lastBlurTime = useRef(0);
    const keyboardCausedBlur = useRef(false);

    const rendererValue = useRef(SVs.rawRendererValue);

    // Need to use ref for showCheckWork
    // or handlePressEnter doesn't get the new value when the SV changes
    const showCheckWork = useRef(SVs.showCheckWork);
    showCheckWork.current = SVs.showCheckWork;

    const trimmedRawRendererValue = SVs.rawRendererValue?.trim() ?? "";
    const previewId = `${id}-preview`;
    // "Blank" is determined from rawRendererValue (not immediateValueLatex), since
    // immediateValueLatex can intentionally contain non-empty error placeholders.
    const shouldShowPreview =
        SVs.showPreview &&
        trimmedRawRendererValue !== "" &&
        (focused || interactingWithPreview);
    const isPreviewOpen = Ariakit.useStoreState(
        previewPopover,
        "open",
    );

    useEffect(() => {
        // Use idempotent show/hide calls to avoid update loops with Ariakit store
        // notifications (previously caused maximum update depth errors).
        if (shouldShowPreview && !isPreviewOpen) {
            previewPopover.show();
        } else if (!shouldShowPreview && isPreviewOpen) {
            previewPopover.hide();
        }
    }, [shouldShowPreview, isPreviewOpen]);

    if (!ignoreUpdate) {
        rendererValue.current = SVs.rawRendererValue;
    }

    // need to use a ref for validation state as handlePressEnter
    // does not update to current values
    let validationState = useRef<
        "unvalidated" | "correct" | "incorrect" | "partialcorrect"
    >("unvalidated");

    const updateValidationState = () => {
        validationState.current = calculateValidationState(SVs);
    };

    const submitAnswer = () =>
        callAction({
            action: actions.submitAnswer,
        });

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
            submitAnswer();
        }
    }, [callAction, mathField]);

    React.useEffect(() => {
        if (!mathField || focusedMathInput.current !== mathField.el()) {
            // If we aren't the focused math input, ignore the events
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
                    submitAnswer();
                }
                continue;
            }
            if (event.type === "accessed") {
                // record the time the keyboard was accessed
                lastKeyboardAccessTime.current = event.timestamp || 0;

                // If there was a blur immediately preceding the keyboard access,
                // we conclude that the blur was caused by the keyboard access.
                // If not, we don't make any conclusions as there can be many subsequent keyboard accesses
                // after the initial blur.
                if (
                    Math.abs(
                        lastKeyboardAccessTime.current - lastBlurTime.current,
                    ) < 100
                ) {
                    keyboardCausedBlur.current = true;
                }
            }
            if (keyboardCausedBlur.current) {
                switch (event.type) {
                    case "accessed":
                        // Already handled
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
        }
        if (keyboardCausedBlur.current) {
            // If the keyboard caused the blur, return focus to the mathField
            mathField.focus();
        }
    }, [virtualKeyboardEvents]);

    const handleFocus = (e: React.FocusEvent) => {
        if (mathField) {
            focusedMathInput.current = mathField.el();
        }
        setFocused(true);
    };

    const handleBlur: FocusEventHandler<HTMLElement> = (e) => {
        lastBlurTime.current = +new Date();

        // If the blur was immediately preceded by a keyboard access,
        // we conclude that the blur was caused by the keyboard access.
        // If not, we currently indicate the blur was not caused by a keyboard access,
        // though we'll also check if there is a keyboard access following the blur.
        keyboardCausedBlur.current =
            Math.abs(lastKeyboardAccessTime.current - lastBlurTime.current) <
            100;

        const focusMovedToPreview =
            e.relatedTarget instanceof Node &&
            previewRef.current?.contains(e.relatedTarget);

        if (!keyboardCausedBlur.current) {
            // If blur is genuine (not virtual-keyboard handoff), commit and mark as
            // unfocused so preview can close unless popover interaction is active.
            callAction({
                action: actions.updateValue,
                baseVariableValue: rendererValue.current,
            });
            setFocused(false);

            // Keep preview open when keyboard focus tabs from the input into the
            // preview region.
            if (focusMovedToPreview) {
                setInteractingWithPreview(true);
            }
        }
    };

    const onChangeHandler = (text: string) => {
        // whitespace differences and whether or not a single character exponent has braces
        // do not count as a difference for changing raw renderer value
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

    const handlePreviewPointerDown = () => {
        // Capture pointer interaction in the popover so scrollbar drags don't close
        // the preview when the math input temporarily loses focus.
        setInteractingWithPreview(true);
    };

    const handlePreviewPointerLeave = () => {
        // Do not close immediately on pointerup after dragging the scrollbar.
        // Keep the preview open while pointer is over the popover and close when
        // pointer leaves (unless input has focus).
        setInteractingWithPreview(false);
    };

    const handlePreviewWheel = () => {
        // Preserve native wheel behavior (including Shift+wheel horizontal scroll),
        // but keep the popover visible for the duration of wheel activity.
        setInteractingWithPreview(true);

        if (previewWheelTimeout.current !== null) {
            window.clearTimeout(previewWheelTimeout.current);
        }

        previewWheelTimeout.current = window.setTimeout(() => {
            setInteractingWithPreview(false);
            previewWheelTimeout.current = null;
        }, 200);
    };

    const handlePreviewKeyDown = (
        e: KeyboardEvent<HTMLDivElement>,
    ) => {
        const scrollAmount = 40;
        const target = e.currentTarget;

        if (e.key === "ArrowRight") {
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
        };
    }, []);

    if (SVs.hidden) {
        return null;
    }

    updateValidationState();

    // const inputKey = this.componentIdx + '_input';

    let mathInputStyle: React.CSSProperties = {
        /* Set each border attribute separately since the borderColor is updated during rerender (checking mathInput's disabled state)
    Currently does not work with border: "var(--mainBorder)" */
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

    // XXX: should be done in CSS
    if (focused) {
        mathInputStyle.outlineStyle = "solid";
    }

    let mathInputWrapperCursor = "allowed";
    if (SVs.disabled) {
        // Disable the mathInput
        mathInputStyle.borderColor = getComputedStyle(
            document.documentElement,
        ).getPropertyValue("--mainGray");
        mathInputStyle.backgroundColor = "rgba(239, 239, 239, 0.3)";
        mathInputStyle.pointerEvents = "none";
        mathInputWrapperCursor = "not-allowed";
    }

    if (textareaRef.current && textareaRef.current.disabled !== SVs.disabled) {
        // Update the mathInput ref's disabled state
        textareaRef.current.disabled = SVs.disabled;
    }

    const checkWorkComponent = createCheckWorkComponent(
        SVs,
        id,
        validationState.current,
        submitAnswer,
        SVs.forceFullCheckWorkButton,
    );

    let label = SVs.label;
    if (SVs.labelHasLatex) {
        label = (
            <MathJax hideUntilTypeset={"first"} inline dynamic>
                {label}
            </MathJax>
        );
    }

    let shortDescription = SVs.shortDescription || undefined;

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
        isPreviewOpen ? previewId : undefined,
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
        shortDescription = addValidationStateToShortDescription(
            validationState.current,
            shortDescription,
        );
    }

    return (
        <React.Fragment>
            <span
                id={id}
                style={{ display: "inline-flex", alignItems: "start" }}
            >
                <label style={{ display: "inline-flex", maxWidth: "100%" }}>
                    {label}
                    <Ariakit.PopoverAnchor
                        store={previewPopover}
                        className="mathInputWrapper"
                        style={{
                            cursor: mathInputWrapperCursor,
                            display: "block",
                        }}
                    >
                        <EditableMathField
                            style={mathInputStyle}
                            latex={rendererValue.current}
                            ariaLabel={shortDescription}
                            aria-details={ariaDetailsIds || undefined}
                            config={{
                                autoCommands:
                                    "alpha beta gamma delta epsilon zeta eta mu nu xi omega rho sigma tau phi chi psi omega iota kappa lambda Gamma Delta Xi Omega Sigma Phi Psi Omega Lambda sqrt pi Pi theta Theta integral infinity forall exists",
                                autoOperatorNames:
                                    "arg deg det dim exp gcd hom ker lg lim ln log max min" +
                                    " Pr" +
                                    " cos cosh acos acosh arccos arccosh" +
                                    " cot coth acot acoth arccot arccoth" +
                                    " csc csch acsc acsch arccsc arccsch" +
                                    " sec sech asec asech arcsec arcsech" +
                                    " sin sinh asin asinh arcsin arcsinh" +
                                    " tan tanh atan atanh arctan arctanh" +
                                    " nPr nCr",
                                handlers: {
                                    enter: handlePressEnter,
                                },
                                substituteTextarea: function () {
                                    textareaRef.current =
                                        document.createElement("textarea");
                                    textareaRef.current.disabled = SVs.disabled;
                                    return textareaRef.current;
                                },
                            }} //more commands go here
                            onChange={(mField: any) => {
                                onChangeHandler(mField.latex());
                            }}
                            onBlur={handleBlur}
                            onFocus={handleFocus}
                            mathquillDidMount={(mf: any) => {
                                //console.log(">>> MathQuillMounted")
                                setMathField(mf);
                            }}
                        />
                    </Ariakit.PopoverAnchor>
                </label>
                {SVs.showPreview ? (
                    <Ariakit.Popover
                        store={previewPopover}
                        className="description-popover mathInputPreviewPopover"
                        gutter={8}
                        flip="top bottom left"
                        fitViewport
                        overflowPadding={12}
                        autoFocusOnShow={false}
                        autoFocusOnHide={false}
                        ref={previewRef}
                        data-test="MathInput Preview"
                        onPointerDownCapture={handlePreviewPointerDown}
                        onPointerLeave={handlePreviewPointerLeave}
                        onWheelCapture={handlePreviewWheel}
                    >
                        <Ariakit.PopoverArrow />
                        <div
                            id={previewId}
                            className="mathInputPreviewContent"
                            tabIndex={0}
                            aria-label="Preview"
                            onFocus={() => setInteractingWithPreview(true)}
                            onBlur={() => setInteractingWithPreview(false)}
                            onKeyDown={handlePreviewKeyDown}
                        >
                            <MathJax hideUntilTypeset={"first"} inline dynamic>
                                {`\\(${SVs.immediateValueLatex}\\)`}
                            </MathJax>
                        </div>
                    </Ariakit.Popover>
                ) : null}
                {checkWorkComponent}
                {description}
            </span>
        </React.Fragment>
    );
}
