import type React from "react";

export const GRAPH_CONTROL_CARD_STYLE: React.CSSProperties = {
    width: "100%",
    boxSizing: "border-box",
    padding: "10px",
    border: "1px solid var(--canvasText)",
    borderRadius: "8px",
};

export const GRAPH_CONTROL_HEADING_STYLE: React.CSSProperties = {
    fontWeight: 600,
    margin: 0,
    fontSize: "1em",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "8px",
};

export const GRAPH_CONTROL_HEADING_TEXT_STYLE: React.CSSProperties = {
    minWidth: 0,
};

export const GRAPH_CONTROL_DISCLOSURE_BUTTON_STYLE: React.CSSProperties = {
    border: "1px solid var(--canvasText)",
    borderRadius: "4px",
    backgroundColor: "transparent",
    color: "inherit",
    width: "1.65em",
    height: "1.65em",
    minWidth: "1.65em",
    padding: 0,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    transition: "background-color 120ms ease, box-shadow 120ms ease",
};

export const GRAPH_CONTROL_DISCLOSURE_BUTTON_HOVER_STYLE: React.CSSProperties =
    {
        backgroundColor: "rgba(127, 127, 127, 0.15)",
    };

export const GRAPH_CONTROL_DISCLOSURE_BUTTON_PRESSED_STYLE: React.CSSProperties =
    {
        backgroundColor: "rgba(127, 127, 127, 0.25)",
        boxShadow: "inset 0 0 0 1px var(--canvasText)",
    };

export const GRAPH_CONTROL_DISCLOSURE_BUTTON_FOCUS_STYLE: React.CSSProperties =
    {
        boxShadow: "0 0 0 2px var(--mainBlue)",
    };

export const GRAPH_CONTROL_DISCLOSURE_ICON_STYLE: React.CSSProperties = {
    display: "inline-block",
    width: 0,
    height: 0,
    borderStyle: "solid",
};

export const GRAPH_CONTROL_DISCLOSURE_ICON_EXPANDED_STYLE: React.CSSProperties =
    {
        borderWidth: "6px 5px 0 5px",
        borderColor: "var(--canvasText) transparent transparent transparent",
    };

export const GRAPH_CONTROL_DISCLOSURE_ICON_COLLAPSED_STYLE: React.CSSProperties =
    {
        borderWidth: "5px 0 5px 6px",
        borderColor: "transparent transparent transparent var(--canvasText)",
    };

export const GRAPH_CONTROL_CONTENT_STYLE: React.CSSProperties = {
    marginTop: "6px",
};

export const GRAPH_CONTROL_INPUT_BLOCK_STYLE: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    marginTop: "8px",
};

export const GRAPH_CONTROL_INLINE_INPUT_STACK_STYLE: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
    width: "100%",
};

export const GRAPH_CONTROL_TEXT_INPUT_STYLE: React.CSSProperties = {
    width: "100%",
    boxSizing: "border-box",
    minWidth: 0,
};

export const GRAPH_CONTROL_ERROR_TEXT_STYLE: React.CSSProperties = {
    color: "#b00020",
    fontSize: "0.85em",
};

export const GRAPH_CONTROL_SECTION_HEADING_STYLE: React.CSSProperties = {
    fontWeight: 600,
    margin: "8px 0 2px 0",
    fontSize: "0.9em",
};

export const GRAPH_CONTROL_SECTION_HEADING_WITH_DIVIDER_STYLE: React.CSSProperties =
    {
        ...GRAPH_CONTROL_SECTION_HEADING_STYLE,
        marginTop: "12px",
        paddingTop: "8px",
        borderTop: "1px solid var(--canvasText)",
    };
