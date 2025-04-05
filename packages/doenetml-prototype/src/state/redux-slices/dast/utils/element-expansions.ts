type ExpandInstruction = {
    to: string;
    /**
     * Attributes to be added to th expanded element.
     */
    attributes?: Record<string, string>;
};

export const ELEMENT_EXPANSIONS: Record<string, ExpandInstruction> = {
    chapter: {
        to: "division",
        attributes: {
            type: "chapter",
        },
    },
    part: {
        to: "division",
        attributes: {
            type: "part",
        },
    },
    section: {
        to: "division",
        attributes: {
            type: "section",
        },
    },
    subsection: {
        to: "division",
        attributes: {
            type: "subsection",
        },
    },
    subsubsection: {
        to: "division",
        attributes: {
            type: "subsubsection",
        },
    },
    paragraphs: {
        to: "division",
        attributes: {
            type: "paragraphs",
        },
    },
};
