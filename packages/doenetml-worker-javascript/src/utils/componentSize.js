import {
    orderedPercentWidthMidpoints,
    orderedWidthMidpoints,
    widthsBySize,
    sizePossibilities,
} from "@doenet/utils";

/**
 * The `size` / `width` pair that decides how wide a framed component renders.
 *
 * `<graph>` and `<barChart>` size themselves identically — a named preset, or
 * an explicit `width` snapped to the nearest preset — and both hand the result
 * to `GraphFrame`, so the wiring lives here rather than in each of them.
 *
 * `<image>` and `<video>` have a `size`/`width` pair of the same *shape* but
 * not the same *definition*: theirs consult a `<graph>` ancestor's `xScale` so
 * an image placed in a graph sizes in graph coordinates. They are deliberately
 * not folded in here; doing so would mean carrying that ancestor lookup into
 * components that have no use for it.
 */
export function returnSizeAttributes({ componentName }) {
    return {
        width: {
            createComponentOfType: "componentSize",
            description: `Explicit width of the ${componentName} (overrides size).`,
        },
        size: {
            createComponentOfType: "text",
            createStateVariable: "specifiedSize",
            defaultValue: "medium",
            toLowerCase: true,
            validValues: [
                { value: "tiny", description: "About 1/12 the full width." },
                { value: "small", description: "About 30% of the full width." },
                { value: "medium", description: "About half the full width." },
                { value: "large", description: "About 70% of the full width." },
                { value: "full", description: "The full available width." },
            ],
            description: `Named size preset for the ${componentName}.`,
        },
    };
}

/**
 * The `size` and `width` state variables those attributes feed.
 *
 * `size` is the author's preset when they named one, the nearest preset to an
 * explicit `width` when they gave one instead, and essential otherwise so it
 * survives being set from outside. `width` is the pixel width that preset means.
 */
export function returnSizeStateVariableDefinitions({ componentName }) {
    return {
        size: {
            description: `The size of the ${componentName}.`,
            public: true,
            defaultValue: "medium",
            hasEssential: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            returnDependencies: () => ({
                specifiedSize: {
                    dependencyType: "stateVariable",
                    variableName: "specifiedSize",
                },
                widthAttr: {
                    dependencyType: "attributeComponent",
                    attributeName: "width",
                    variableNames: ["componentSize"],
                },
            }),
            definition({ dependencyValues, usedDefault }) {
                const defaultSize = "medium";

                if (!usedDefault.specifiedSize) {
                    return {
                        setValue: { size: dependencyValues.specifiedSize },
                    };
                } else if (dependencyValues.widthAttr) {
                    let componentSize =
                        dependencyValues.widthAttr.stateValues.componentSize;
                    if (componentSize === null) {
                        return {
                            setValue: { size: defaultSize },
                        };
                    }
                    let { isAbsolute, size: widthSize } = componentSize;
                    let size;

                    if (isAbsolute) {
                        for (let [
                            ind,
                            pixels,
                        ] of orderedWidthMidpoints.entries()) {
                            if (widthSize <= pixels) {
                                size = sizePossibilities[ind];
                                break;
                            }
                        }
                        if (!size) {
                            size = defaultSize;
                        }
                    } else {
                        for (let [
                            ind,
                            percent,
                        ] of orderedPercentWidthMidpoints.entries()) {
                            if (widthSize <= percent) {
                                size = sizePossibilities[ind];
                                break;
                            }
                        }
                        if (!size) {
                            size = defaultSize;
                        }
                    }
                    return {
                        setValue: { size },
                    };
                } else {
                    return {
                        useEssentialOrDefaultValue: { size: true },
                    };
                }
            },
        },

        width: {
            description: `The width of the ${componentName}.`,
            public: true,
            forRenderer: true,
            shadowingInstructions: {
                createComponentOfType: "componentSize",
            },
            returnDependencies: () => ({
                size: {
                    dependencyType: "stateVariable",
                    variableName: "size",
                },
            }),
            definition({ dependencyValues }) {
                let width = {
                    isAbsolute: true,
                    size: widthsBySize[dependencyValues.size],
                };

                return {
                    setValue: { width },
                };
            },
        },
    };
}
