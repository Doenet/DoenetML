export let styleAttributes = {
    lineColor: { componentType: "text" },
    lineColorWord: { componentType: "text" },
    lineColorDarkMode: { componentType: "text" },
    lineColorWordDarkMode: { componentType: "text" },
    lineOpacity: { componentType: "number" },
    lineWidth: { componentType: "number" },
    lineWidthWord: { componentType: "text" },
    lineStyle: { componentType: "text" }, // solid, dashed, dotted
    lineStyleWord: { componentType: "text" },
    markerColor: { componentType: "text" },
    markerColorWord: { componentType: "text" },
    markerColorDarkMode: { componentType: "text" },
    markerColorWordDarkMode: { componentType: "text" },
    markerOpacity: { componentType: "number" },
    // marker styles: cross, circle, square, plus, diamond,
    // triangle (alias for triangleUp), triangleUp, triangleDown, triangleLeft, triangleRight
    markerStyle: { componentType: "text" },
    markerStyleWord: { componentType: "text" },
    markerSize: { componentType: "number" },
    fillColor: { componentType: "text" },
    fillColorWord: { componentType: "text" },
    fillColorDarkMode: { componentType: "text" },
    fillColorWordDarkMode: { componentType: "text" },
    fillOpacity: { componentType: "number" },
    textColor: { componentType: "text" },
    textColorWord: { componentType: "text" },
    textColorDarkMode: { componentType: "text" },
    textColorWordDarkMode: { componentType: "text" },
    highContrastColor: { componentType: "text" },
    highContrastColorWord: { componentType: "text" },
    highContrastColorDarkMode: { componentType: "text" },
    highContrastColorWordDarkMode: { componentType: "text" },
    backgroundColor: { componentType: "text" },
    backgroundColorWord: { componentType: "text" },
    backgroundColorDarkMode: { componentType: "text" },
    backgroundColorWordDarkMode: { componentType: "text" },
};

let defaultStyle = {
    lineColor: "#648FFF",
    lineColorWord: "blue",
    lineColorDarkMode: "#648FFF",
    lineColorWordDarkMode: "blue",
    lineOpacity: 0.7,
    lineWidth: 4,
    lineWidthWord: "thick",
    lineStyle: "solid",
    lineStyleWord: "",
    markerColor: "#648FFF",
    markerColorWord: "blue",
    markerColorDarkMode: "#648FFF",
    markerColorWordDarkMode: "blue",
    markerOpacity: 0.7,
    markerStyle: "circle",
    markerStyleWord: "point",
    markerSize: 5,
    fillColor: "#648FFF",
    fillColorWord: "blue",
    fillColorDarkMode: "#648FFF",
    fillColorWordDarkMode: "blue",
    fillOpacity: 0.3,
    textColor: "black",
    textColorWord: "black",
    textColorDarkMode: "white",
    textColorWordDarkMode: "white",
    highContrastColor: "#2963FF",
    highContrastColorWord: "blue",
    highContrastColorDarkMode: "#2963FF",
    highContrastColorWordDarkMode: "blue",
};

function returnDefaultStyleDefinitions() {
    return {
        1: {
            lineColor: "#648FFF",
            lineColorWord: "blue",
            lineColorDarkMode: "#648FFF",
            lineColorWordDarkMode: "blue",
            lineOpacity: 0.7,
            lineWidth: 4,
            lineWidthWord: "thick",
            lineStyle: "solid",
            lineStyleWord: "",
            markerColor: "#648FFF",
            markerColorWord: "blue",
            markerColorDarkMode: "#648FFF",
            markerColorWordDarkMode: "blue",
            markerOpacity: 0.7,
            markerStyle: "circle",
            markerStyleWord: "point",
            markerSize: 5,
            fillColor: "#648FFF",
            fillColorWord: "blue",
            fillColorDarkMode: "#648FFF",
            fillColorWordDarkMode: "blue",
            fillOpacity: 0.3,
            textColor: "black",
            textColorWord: "black",
            textColorDarkMode: "white",
            textColorWordDarkMode: "white",
            highContrastColor: "#2963FF",
            highContrastColorWord: "blue",
            highContrastColorDarkMode: "#2963FF",
            highContrastColorWordDarkMode: "blue",
        },
        2: {
            lineColor: "#D4042D",
            lineColorWord: "red",
            lineColorDarkMode: "#D4042D",
            lineColorWordDarkMode: "red",
            lineOpacity: 0.7,
            lineWidth: 2,
            lineWidthWord: "",
            lineStyle: "solid",
            lineStyleWord: "",
            markerColor: "#D4042D",
            markerColorWord: "red",
            markerColorDarkMode: "#D4042D",
            markerColorWordDarkMode: "red",
            markerOpacity: 0.7,
            markerStyle: "square",
            markerStyleWord: "square",
            markerSize: 5,
            fillColor: "#D4042D",
            fillColorWord: "red",
            fillColorDarkMode: "#D4042D",
            fillColorWordDarkMode: "red",
            fillOpacity: 0.3,
            textColor: "#D4042D",
            textColorWord: "red",
            textColorDarkMode: "#D4042D",
            textColorWordDarkMode: "red",
            highContrastColor: "#D4042D",
            highContrastColorWord: "red",
            highContrastColorDarkMode: "#D4042D",
            highContrastColorWordDarkMode: "red",
        },
        3: {
            lineColor: "#F19143",
            lineColorWord: "orange",
            lineColorDarkMode: "#F19143",
            lineColorWordDarkMode: "orange",
            lineOpacity: 0.7,
            lineWidth: 3,
            lineWidthWord: "",
            lineStyle: "solid",
            lineStyleWord: "",
            markerColor: "#F19143",
            markerColorWord: "orange",
            markerColorDarkMode: "#F19143",
            markerColorWordDarkMode: "orange",
            markerOpacity: 0.7,
            markerStyle: "triangle",
            markerStyleWord: "triangle",
            markerSize: 5,
            fillColor: "#F19143",
            fillColorWord: "orange",
            fillColorDarkMode: "#F19143",
            fillColorWordDarkMode: "orange",
            fillOpacity: 0.3,
            textColor: "#BE5A0E",
            textColorWord: "orange",
            textColorDarkMode: "#BE5A0E",
            textColorWordDarkMode: "orange",
            highContrastColor: "#BE5A0E",
            highContrastColorWord: "orange",
            highContrastColorDarkMode: "#BE5A0E",
            highContrastColorWordDarkMode: "orange",
        },
        4: {
            lineColor: "#644CD6",
            lineColorWord: "purple",
            lineColorDarkMode: "#644CD6",
            lineColorWordDarkMode: "purple",
            lineOpacity: 0.7,
            lineWidth: 2,
            lineWidthWord: "",
            lineStyle: "solid",
            lineStyleWord: "",
            markerColor: "#644CD6",
            markerColorWord: "purple",
            markerColorDarkMode: "#644CD6",
            markerColorWordDarkMode: "purple",
            markerOpacity: 0.7,
            markerStyle: "diamond",
            markerStyleWord: "diamond",
            markerSize: 5,
            fillColor: "#644CD6",
            fillColorWord: "purple",
            fillColorDarkMode: "#644CD6",
            fillColorWordDarkMode: "purple",
            fillOpacity: 0.3,
            textColor: "#644CD6",
            textColorWord: "purple",
            textColorDarkMode: "#644CD6",
            textColorWordDarkMode: "purple",
            highContrastColor: "#644CD6",
            highContrastColorWord: "purple",
            highContrastColorDarkMode: "#644CD6",
            highContrastColorWordDarkMode: "purple",
        },
        5: {
            lineColor: "black",
            lineColorWord: "black",
            lineColorDarkMode: "white",
            lineColorWordDarkMode: "white",
            lineOpacity: 1,
            lineWidth: 1,
            lineWidthWord: "thin",
            lineStyle: "solid",
            lineStyleWord: "",
            markerColor: "black",
            markerColorWord: "black",
            markerColorDarkMode: "white",
            markerColorWordDarkMode: "white",
            markerOpacity: 1,
            markerStyle: "circle",
            markerStyleWord: "point",
            markerSize: 5,
            fillColor: "black",
            fillColorWord: "black",
            fillColorDarkMode: "white",
            fillColorWordDarkMode: "white",
            fillOpacity: 0.7,
            textColor: "black",
            textColorWord: "black",
            textColorDarkMode: "white",
            textColorWordDarkMode: "white",
            highContrastColor: "black",
            highContrastColorWord: "black",
            highContrastColorDarkMode: "black",
            highContrastColorWordDarkMode: "black",
        },
        6: {
            lineColor: "gray",
            lineColorWord: "gray",
            lineColorDarkMode: "gray",
            lineColorWordDarkMode: "gray",
            lineOpacity: 0.7,
            lineWidth: 1,
            lineWidthWord: "thin",
            lineStyle: "dotted",
            lineStyleWord: "dotted",
            markerColor: "gray",
            markerColorWord: "gray",
            markerColorDarkMode: "gray",
            markerColorWordDarkMode: "gray",
            markerOpacity: 0.7,
            markerStyle: "circle",
            markerStyleWord: "point",
            markerSize: 5,
            fillColor: "gray",
            fillColorWord: "gray",
            fillColorDarkMode: "gray",
            fillColorWordDarkMode: "gray",
            fillOpacity: 0.3,
            textColor: "#757575",
            textColorWord: "gray",
            textColorDarkMode: "#757575",
            textColorWordDarkMode: "gray",
            highContrastColor: "#757575",
            highContrastColorWord: "gray",
            highContrastColorDarkMode: "#757575",
            highContrastColorWordDarkMode: "gray",
        },
    };
}

export function returnStyleDefinitionStateVariables() {
    let stateVariableDefinitions = {};

    stateVariableDefinitions.setupChildren = {
        returnDependencies: () => ({
            setupChildren: {
                dependencyType: "child",
                childGroups: ["setups"],
                proceedIfAllChildrenNotMatched: true,
            },
        }),
        definition({ dependencyValues }) {
            return {
                setValue: { setupChildren: dependencyValues.setupChildren },
            };
        },
    };

    stateVariableDefinitions.styleDefinitions = {
        stateVariablesDeterminingDependencies: ["setupChildren"],
        returnDependencies({ stateValues }) {
            let dependencies = {
                ancestorWithStyle: {
                    dependencyType: "ancestor",
                    variableNames: ["styleDefinitions"],
                },
                styleDefinitionSetupChildren: {
                    dependencyType: "child",
                    childGroups: ["styleDefinitions", "setups"],
                    variableNames: ["styleNumber", "styleDefinition"],
                    variablesOptional: true,
                    proceedIfAllChildrenNotMatched: true,
                },
            };

            for (let setupChild of stateValues.setupChildren) {
                dependencies[`styleDefinitionsOf${setupChild.componentIdx}`] = {
                    dependencyType: "child",
                    parentIdx: setupChild.componentIdx,
                    childGroups: ["styleDefinitions"],
                    variableNames: ["styleNumber", "styleDefinition"],
                };
            }

            return dependencies;
        },
        definition({ dependencyValues }) {
            const styleDefinitions = {};

            let startingStateVariableDefinitions;

            if (dependencyValues.ancestorWithStyle) {
                startingStateVariableDefinitions =
                    dependencyValues.ancestorWithStyle.stateValues
                        .styleDefinitions;
            }

            if (!startingStateVariableDefinitions) {
                startingStateVariableDefinitions =
                    returnDefaultStyleDefinitions();
            }

            for (const styleNumber in startingStateVariableDefinitions) {
                styleDefinitions[styleNumber] = Object.assign(
                    {},
                    startingStateVariableDefinitions[styleNumber],
                );
            }

            const styleDefinitionChildren = [];
            for (let child of dependencyValues.styleDefinitionSetupChildren) {
                if (child.componentType === "setup") {
                    styleDefinitionChildren.push(
                        ...dependencyValues[
                            `styleDefinitionsOf${child.componentIdx}`
                        ],
                    );
                } else {
                    styleDefinitionChildren.push(child);
                }
            }

            const coloredItems = [
                "marker",
                "line",
                "fill",
                "text",
                "background",
            ];
            const widthItems = ["line"];
            const lineStyleItems = ["line"];

            for (const child of styleDefinitionChildren) {
                const styleNumber = child.stateValues.styleNumber;
                let styleDef = styleDefinitions[styleNumber];

                if (!styleDef) {
                    styleDef = styleDefinitions[styleNumber] = Object.assign(
                        {},
                        defaultStyle,
                    );
                }

                const theNewDef = Object.assign(
                    {},
                    child.stateValues.styleDefinition,
                );

                for (const item of coloredItems) {
                    const colorKey = `${item}Color`;
                    const colorWordKey = `${colorKey}Word`;
                    const darkKey = `${colorKey}DarkMode`;
                    const darkWordKey = `${colorWordKey}DarkMode`;

                    if (colorKey in theNewDef && !(colorWordKey in theNewDef)) {
                        theNewDef[colorWordKey] = theNewDef[colorKey];
                    }
                    if (darkKey in theNewDef && !(darkWordKey in theNewDef)) {
                        theNewDef[darkWordKey] = theNewDef[darkKey];
                    }
                    if (colorKey in theNewDef && !(darkKey in theNewDef)) {
                        theNewDef[darkKey] = theNewDef[colorKey];
                        theNewDef[darkWordKey] = theNewDef[colorWordKey];
                    }
                }

                for (const item of widthItems) {
                    const widthKey = `${item}Width`;
                    const widthWordKey = `${widthKey}Word`;

                    if (widthKey in theNewDef && !(widthWordKey in theNewDef)) {
                        if (theNewDef[widthKey] >= 4) {
                            theNewDef[widthWordKey] = "thick";
                        } else if (theNewDef[widthKey] <= 1) {
                            theNewDef[widthWordKey] = "thin";
                        } else {
                            theNewDef[widthWordKey] = "";
                        }
                    }
                }

                for (const item of lineStyleItems) {
                    const styleKey = `${item}Style`;
                    const styleWordKey = `${styleKey}Word`;

                    if (styleKey in theNewDef && !(styleWordKey in theNewDef)) {
                        if (theNewDef[styleKey] === "dashed") {
                            theNewDef[styleWordKey] = "dashed";
                        } else if (theNewDef[styleKey] === "dotted") {
                            theNewDef[styleWordKey] = "dotted";
                        } else {
                            theNewDef[styleWordKey] = "";
                        }
                    }
                }

                if (
                    "markerStyle" in theNewDef &&
                    !("markerStyleWord" in theNewDef)
                ) {
                    theNewDef.markerStyleWord = theNewDef.markerStyle;
                    if (theNewDef.markerStyleWord === "circle") {
                        theNewDef.markerStyleWord = "point";
                    } else if (
                        theNewDef.markerStyleWord.slice(0, 8) === "triangle"
                    ) {
                        theNewDef.markerStyleWord = "triangle";
                    }
                }

                Object.assign(styleDef, theNewDef);
            }

            return { setValue: { styleDefinitions } };
        },
    };

    return stateVariableDefinitions;
}

export function returnSelectedStyleStateVariableDefinition() {
    return {
        selectedStyle: {
            forRenderer: true,
            willNeverBeEssential: true,
            returnDependencies: () => ({
                styleNumber: {
                    dependencyType: "stateVariable",
                    variableName: "styleNumber",
                },
                ancestorWithStyle: {
                    dependencyType: "ancestor",
                    variableNames: ["styleDefinitions"],
                },
            }),
            definition: function ({ dependencyValues }) {
                let styleDefinitions =
                    dependencyValues.ancestorWithStyle.stateValues
                        .styleDefinitions;
                if (!styleDefinitions) {
                    styleDefinitions = returnDefaultStyleDefinitions();
                }

                let selectedStyle =
                    styleDefinitions[dependencyValues.styleNumber];

                if (selectedStyle === undefined) {
                    selectedStyle = defaultStyle;
                }
                return { setValue: { selectedStyle } };
            },
        },
    };
}

export function returnTextStyleDescriptionDefinitions() {
    return {
        textColor: {
            public: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            returnDependencies: () => ({
                selectedStyle: {
                    dependencyType: "stateVariable",
                    variableName: "selectedStyle",
                },
                document: {
                    dependencyType: "ancestor",
                    componentType: "document",
                    variableNames: ["theme"],
                },
            }),
            definition: function ({ dependencyValues }) {
                let selectedStyle = dependencyValues.selectedStyle;

                let textColorWord;
                if (dependencyValues.document?.stateValues.theme === "dark") {
                    textColorWord = selectedStyle.textColorWordDarkMode;
                } else {
                    textColorWord = selectedStyle.textColorWord;
                }

                return { setValue: { textColor: textColorWord } };
            },
        },

        backgroundColor: {
            public: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            returnDependencies: () => ({
                selectedStyle: {
                    dependencyType: "stateVariable",
                    variableName: "selectedStyle",
                },
                document: {
                    dependencyType: "ancestor",
                    componentType: "document",
                    variableNames: ["theme"],
                },
            }),
            definition: function ({ dependencyValues }) {
                let selectedStyle = dependencyValues.selectedStyle;

                let backgroundColorWord;
                if (dependencyValues.document?.stateValues.theme === "dark") {
                    backgroundColorWord =
                        selectedStyle.backgroundColorWordDarkMode;
                } else {
                    backgroundColorWord = selectedStyle.backgroundColorWord;
                }

                if (!backgroundColorWord) {
                    backgroundColorWord = "none";
                }

                return { setValue: { backgroundColor: backgroundColorWord } };
            },
        },

        textStyleDescription: {
            public: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            returnDependencies: () => ({
                textColor: {
                    dependencyType: "stateVariable",
                    variableName: "textColor",
                },
                backgroundColor: {
                    dependencyType: "stateVariable",
                    variableName: "backgroundColor",
                },
            }),
            definition: function ({ dependencyValues }) {
                let textStyleDescription = dependencyValues.textColor;

                if (dependencyValues.backgroundColor !== "none") {
                    textStyleDescription += ` with a ${dependencyValues.backgroundColor} background`;
                }

                return { setValue: { textStyleDescription } };
            },
        },
    };
}

export function textRendererStyle(darkMode, selectedStyle) {
    let textColor =
        darkMode === "dark"
            ? selectedStyle.textColorDarkMode
            : selectedStyle.textColor;
    let backgroundColor =
        darkMode === "dark"
            ? selectedStyle.backgroundColorDarkMode
            : selectedStyle.backgroundColor;
    let style = { color: textColor };
    if (backgroundColor) {
        style.backgroundColor = backgroundColor;
    }
    return style;
}
