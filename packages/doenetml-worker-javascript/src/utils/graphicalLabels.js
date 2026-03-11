export const LINE_FAMILY_LABEL_POSITION_VALID_VALUES = [
    "upperright",
    "upperleft",
    "lowerright",
    "lowerleft",
    "center",
    "top",
    "bottom",
    "left",
    "right",
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
    };
}