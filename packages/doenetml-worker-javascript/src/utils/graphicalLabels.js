const LINE_FAMILY_LABEL_POSITION_VALID_VALUES = [
    {
        value: "upperRight",
        description: "Place the label above and to the right of the line.",
    },
    {
        value: "upperLeft",
        description: "Place the label above and to the left of the line.",
    },
    {
        value: "lowerRight",
        description: "Place the label below and to the right of the line.",
    },
    {
        value: "lowerLeft",
        description: "Place the label below and to the left of the line.",
    },
    {
        value: "center",
        description: "Place the label at the midpoint of the line.",
    },
    {
        value: "top",
        description: "Place the label directly above the line.",
    },
    {
        value: "bottom",
        description: "Place the label directly below the line.",
    },
    {
        value: "left",
        description: "Place the label directly to the left of the line.",
    },
    {
        value: "right",
        description: "Place the label directly to the right of the line.",
    },
];

/**
 * Shared `labelPosition` attribute definition for line-family graphical components.
 */
export function returnLineFamilyLabelPositionAttribute() {
    return {
        createComponentOfType: "text",
        createStateVariable: "labelPosition",
        defaultValue: "center",
        public: true,
        forRenderer: true,
        toLowerCase: true,
        validValues: LINE_FAMILY_LABEL_POSITION_VALID_VALUES,
        description: "Where the label sits along this line/curve.",
    };
}
