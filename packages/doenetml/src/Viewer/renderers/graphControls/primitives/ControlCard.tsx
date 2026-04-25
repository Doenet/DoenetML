import React from "react";
import {
    GRAPH_CONTROL_CARD_STYLE,
    GRAPH_CONTROL_CONTENT_STYLE,
    GRAPH_CONTROL_DISCLOSURE_BUTTON_FOCUS_STYLE,
    GRAPH_CONTROL_DISCLOSURE_BUTTON_HOVER_STYLE,
    GRAPH_CONTROL_DISCLOSURE_BUTTON_PRESSED_STYLE,
    GRAPH_CONTROL_DISCLOSURE_BUTTON_STYLE,
    GRAPH_CONTROL_DISCLOSURE_ICON_COLLAPSED_STYLE,
    GRAPH_CONTROL_DISCLOSURE_ICON_EXPANDED_STYLE,
    GRAPH_CONTROL_DISCLOSURE_ICON_STYLE,
    GRAPH_CONTROL_HEADING_STYLE,
    GRAPH_CONTROL_HEADING_TEXT_STYLE,
} from "./styles";

/**
 * Props for a control accordion card with disclosure button.
 *
 * @property id - HTML id for the card root
 * @property headingId - HTML id for the h3 heading (required for aria-labelledby)
 * @property heading - Control label rendered in the heading
 * @property children - Control UI elements (sliders, inputs) shown when expanded
 * @property contentId - HTML id for the content region; auto-generated if not provided
 * @property isExpanded - Whether the card is currently open (default: true)
 * @property onToggleExpanded - Callback when user clicks the disclosure button or presses Enter/Space
 * @property disclosureControlLabel - Plain-text control label appended to disclosure aria-label
 */
type ControlCardProps = {
    id?: string;
    headingId: string;
    heading: React.ReactNode;
    children: React.ReactNode;
    contentId?: string;
    isExpanded?: boolean;
    onToggleExpanded?: () => void;
    disclosureControlLabel?: string;
};

/**
 * A control card with collapsible disclosure button and content region.
 *
 * Renders a card containing a heading with a separate disclosure button (top-right)
 * and optionally displays the children in a region below. The button supports:
 * - Mouse click to toggle
 * - Enter/Space keyboard to toggle
 * - ARIA attributes (aria-expanded, aria-controls) for screen readers
 * - Visual states: hover, focus, pressed with distinct styling
 *
 * The disclosure button is semantically separate from the heading so that clicking
 * the heading text does not inadvertently collapse the card.
 */
export default function ControlCard({
    id,
    headingId,
    heading,
    children,
    contentId,
    isExpanded = true,
    onToggleExpanded,
    disclosureControlLabel,
}: ControlCardProps) {
    const resolvedContentId = contentId ?? (id ? `${id}-content` : undefined);
    const [isHeadingButtonFocused, setIsHeadingButtonFocused] =
        React.useState(false);
    const [isHeadingButtonHovered, setIsHeadingButtonHovered] =
        React.useState(false);
    const [isHeadingButtonPressed, setIsHeadingButtonPressed] =
        React.useState(false);

    const disclosureButtonStyle: React.CSSProperties = {
        ...GRAPH_CONTROL_DISCLOSURE_BUTTON_STYLE,
        ...(isHeadingButtonHovered
            ? GRAPH_CONTROL_DISCLOSURE_BUTTON_HOVER_STYLE
            : {}),
        ...(isHeadingButtonPressed
            ? GRAPH_CONTROL_DISCLOSURE_BUTTON_PRESSED_STYLE
            : {}),
        ...(isHeadingButtonFocused
            ? GRAPH_CONTROL_DISCLOSURE_BUTTON_FOCUS_STYLE
            : {}),
    };

    const disclosureIconStyle = isExpanded
        ? {
              ...GRAPH_CONTROL_DISCLOSURE_ICON_STYLE,
              ...GRAPH_CONTROL_DISCLOSURE_ICON_EXPANDED_STYLE,
          }
        : {
              ...GRAPH_CONTROL_DISCLOSURE_ICON_STYLE,
              ...GRAPH_CONTROL_DISCLOSURE_ICON_COLLAPSED_STYLE,
          };

    const disclosureControlLabelSuffix = disclosureControlLabel
        ? ` for ${disclosureControlLabel}`
        : "";

    return (
        <div
            id={id}
            role="group"
            aria-labelledby={headingId}
            style={GRAPH_CONTROL_CARD_STYLE}
        >
            <h3 id={headingId} style={GRAPH_CONTROL_HEADING_STYLE}>
                <span style={GRAPH_CONTROL_HEADING_TEXT_STYLE}>{heading}</span>
                <button
                    type="button"
                    aria-expanded={isExpanded}
                    aria-controls={resolvedContentId}
                    aria-label={
                        isExpanded
                            ? `Collapse control details${disclosureControlLabelSuffix}`
                            : `Expand control details${disclosureControlLabelSuffix}`
                    }
                    style={disclosureButtonStyle}
                    onClick={onToggleExpanded}
                    onFocus={() => setIsHeadingButtonFocused(true)}
                    onBlur={() => setIsHeadingButtonFocused(false)}
                    onMouseEnter={() => setIsHeadingButtonHovered(true)}
                    onMouseLeave={() => {
                        setIsHeadingButtonHovered(false);
                        setIsHeadingButtonPressed(false);
                    }}
                    onMouseDown={() => setIsHeadingButtonPressed(true)}
                    onMouseUp={() => setIsHeadingButtonPressed(false)}
                    onKeyDown={(event) => {
                        if (event.key === " " || event.key === "Enter") {
                            event.preventDefault();
                            setIsHeadingButtonPressed(true);
                            onToggleExpanded?.();
                        }
                    }}
                    onKeyUp={() => setIsHeadingButtonPressed(false)}
                >
                    <span aria-hidden="true" style={disclosureIconStyle} />
                </button>
            </h3>
            {isExpanded ? (
                <div
                    id={resolvedContentId}
                    role="region"
                    aria-labelledby={headingId}
                    style={GRAPH_CONTROL_CONTENT_STYLE}
                >
                    {children}
                </div>
            ) : null}
        </div>
    );
}
