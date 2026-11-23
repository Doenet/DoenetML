import { contentGivesACoordinate, holdsOneTuple } from "./coordinateContent";

/**
 * Missing values and missing components (D37, VAL-5).
 *
 * A reference to one thing (a name, an index, a property, an iteration or a
 * pick) gives that thing or a missing value, and a tag whose source is
 * missing is itself missing, whatever it adds. A missing value never equals
 * anything, is shown as a blank inline, and is not drawn in a graph.
 */

/**
 * The renderer of a missing component (`BaseComponent.isMissing`), and of a
 * drawn value reference while it has nothing to read: `＿` inline, announced
 * as a blank, not drawn in a graph, with none of its children drawn.
 */
export const BLANK_RENDERER_TYPE = "_blank";

/** How a missing value reads as text: a blank. */
export const MISSING_TEXT = "＿";

/**
 * The types of child that say nothing of a component's value, which a child
 * that is missing does not make the component missing beside
 * (`contentMissingDefinitions`): its label and descriptions.
 */
const NON_CONTENT_CHILD_TYPES = ["label", "description", "shortDescription"];

/**
 * The definition of `contentMissing`: whether what a component holds as
 * content is only missing children (D40, VAL-5, #2461). It is so when it has
 * at least one child that is missing (`valueMissing`), or whose own content
 * is (`contentMissing`, a `<math>` a sugar wrapped around the content), and
 * no other child apart from blank text and its label and descriptions.
 * `<number>$nothing</number>`, `<function><math extend="$nothing"/></function>`
 * and `<circle>$nothing</circle>` hold only missing content, while
 * `<boolean>$nothing = 1</boolean>` and `<number>$nothing + 1</number>`
 * hold an expression in which the blank takes part (D37).
 */
export function contentMissingDefinition() {
    return {
        returnDependencies: () => ({
            children: {
                dependencyType: "child",
                includeAllChildren: true,
                variableNames: ["valueMissing", "contentMissing"],
                variablesOptional: true,
            },
        }),
        definition({
            dependencyValues,
            componentInfoObjects,
        }: {
            dependencyValues: { children: any[] };
            componentInfoObjects: any;
        }) {
            let foundMissing = false;
            for (const child of dependencyValues.children) {
                if (typeof child !== "object") {
                    if (String(child).trim() !== "") {
                        return { setValue: { contentMissing: false } };
                    }
                    continue;
                }
                if (
                    NON_CONTENT_CHILD_TYPES.some((baseComponentType) =>
                        componentInfoObjects.isInheritedComponentType({
                            inheritedComponentType: child.componentType,
                            baseComponentType,
                        }),
                    )
                ) {
                    continue;
                }
                if (
                    child.stateValues?.valueMissing ||
                    child.stateValues?.contentMissing
                ) {
                    foundMissing = true;
                } else {
                    return { setValue: { contentMissing: false } };
                }
            }
            return { setValue: { contentMissing: foundMissing } };
        },
    };
}

/**
 * The definition of `contentNamesNothing`: whether what a `<math>`, a
 * `<point>` or a `<vector>` holds is only references that name nothing now
 * (`$nothing`, `$pl[3]` while `pl` has two points), each made a missing
 * component (`doenetAttributes.missing`, whose `namesNothing` is `true`), or
 * a blank entry of a list (`$pb[2]` of `<pointList name="pb">(1,2)
 * $nothing</pointList>`, whose shadow and its adapter define `namesNothing`),
 * or a value reference that names nothing (`<point>$ml[3]</point>` past the
 * end of a `<mathList>`, `<point>$Q</point>` of a `Q` that holds only such
 * references: `namesNothing` in `ValueRef.js`, #2596).
 * A point or vector made from an attribute (`center="$nothing"`) holds its
 * content in its `coords` or `displacement` (`attributeName`). It makes a
 * shape whose point that is missing (`BaseComponent.missingWhenPointsMissing`,
 * D40), and a point or vector itself
 * (`BaseComponent.missingWhenContentNamesNothing`, #2544). Unlike
 * `contentMissing`, it does not read whether a reference's source is missing,
 * which for a reference to a property of the shape
 * (`<ray through="$(r.endpoint)">`) would read the shape again.
 */
export function contentNamesNothingDefinition(
    attributeName?: string,
    {
        coordinateAttributes = [],
        anyChild = false,
    }: {
        /**
         * Whether one child that names nothing is enough, beside other
         * content: the `<coords>` holding a point's or vector's whole content
         * (`<ray through="(1,2) $nothing"/>`, two things in one point,
         * #2596). A blank takes part in a math, which can hold it, but not
         * in a point, which can't; a blank in one coordinate of a tuple is in
         * that coordinate's math (`<point>($nothing, 2)</point>` is
         * `(＿, 2)`), so content that is one tuple (`coords="($nothing,
         * 2)"`, `holdsOneTuple`) never names nothing as a whole.
         */
        anyChild?: boolean;
        /**
         * The attributes that give a point's coordinates one by one (`x`,
         * `y`, `z`), which the content is read after (D49, #2596): it names
         * nothing only where it gives a coordinate they don't
         * (`contentGivesACoordinate`), so `<point x="3" y="4">$nothing</point>`
         * is the point `(3, 4)`, and `<point x="3">$nothing</point>` is
         * missing.
         */
        coordinateAttributes?: string[];
    } = {},
) {
    return {
        returnDependencies: () => ({
            ...Object.fromEntries(
                coordinateAttributes.map((name) => [
                    `coordinate_${name}`,
                    {
                        dependencyType: "attributeComponent",
                        attributeName: name,
                    },
                ]),
            ),
            children: {
                dependencyType: "child",
                includeAllChildren: true,
                variableNames: ["namesNothing", "contentNamesNothing"],
                variablesOptional: true,
            },
            ...(attributeName
                ? {
                      attribute: {
                          dependencyType: "attributeComponent",
                          attributeName,
                          variableNames: ["contentNamesNothing"],
                          variablesOptional: true,
                      },
                  }
                : {}),
        }),
        definition({
            dependencyValues,
            componentInfoObjects,
        }: {
            dependencyValues: {
                children: any[];
                attribute?: any;
                [key: string]: any;
            };
            componentInfoObjects: any;
        }) {
            if (
                coordinateAttributes.length > 0 &&
                !contentGivesACoordinate(
                    coordinateAttributes.map(
                        (name) =>
                            dependencyValues[`coordinate_${name}`] != null,
                    ),
                )
            ) {
                // the attributes give every coordinate it would
                return { setValue: { contentNamesNothing: false } };
            }
            if (dependencyValues.attribute) {
                // the attribute, when there, is what is read: a written
                // `coords` or `displacement` comes before a point or vector
                // child (D49)
                return {
                    setValue: {
                        contentNamesNothing: Boolean(
                            dependencyValues.attribute.stateValues
                                ?.contentNamesNothing,
                        ),
                    },
                };
            }
            if (anyChild && holdsOneTuple(dependencyValues.children)) {
                // `coords="($nothing, 2)"`: each reference is in one
                // coordinate, which holds the blank, as in
                // `<point>($nothing, 2)</point>`
                return { setValue: { contentNamesNothing: false } };
            }
            let found = false;
            for (const child of dependencyValues.children) {
                if (typeof child !== "object") {
                    if (String(child).trim() !== "" && !anyChild) {
                        return { setValue: { contentNamesNothing: false } };
                    }
                    continue;
                }
                if (
                    NON_CONTENT_CHILD_TYPES.some((baseComponentType) =>
                        componentInfoObjects.isInheritedComponentType({
                            inheritedComponentType: child.componentType,
                            baseComponentType,
                        }),
                    )
                ) {
                    continue;
                }
                if (
                    child.stateValues?.namesNothing ||
                    child.stateValues?.contentNamesNothing
                ) {
                    if (anyChild) {
                        return { setValue: { contentNamesNothing: true } };
                    }
                    found = true;
                } else if (!anyChild) {
                    return { setValue: { contentNamesNothing: false } };
                }
            }
            return { setValue: { contentNamesNothing: found } };
        },
    };
}

/**
 * The definitions of `contentMissing` and `valueMissing` of a component that
 * is missing while its content is only missing children
 * (`BaseComponent.missingWhenContentMissing`, D40): `<number>$nothing</number>`
 * is a missing number, shown as `＿`, never equal to anything, and drawn as a
 * blank, not the `NaN` of `<number/>`. It is made from its children again
 * once a reference among them names something (`<number>$l[$i]</number>`
 * once `i` is an index of `l`), so it is missing only while they are. So,
 * through its `valueMissing`, is a component an `extend` makes of another
 * type around what it extends (`doenetAttributes.missingWhenContentMissing`,
 * `<math extend="$n"/>` of such a number). A tag whose source is missing
 * (`BaseComponent.isMissing`) is instead missing for as long as it exists,
 * and a new one is made once the source is there.
 *
 * A component whose value is computed from a missing input is missing too
 * (`computedMissing`, `BaseComponent.missingWhenComputedFromMissing`, D40,
 * #2460): a number or a boolean can't hold a blank, so `<number>$nothing +
 * 1</number>` and `<boolean>not $nothing</boolean>` are missing, where a
 * `<math>` holds the blank (`＿ + 1`). The component's own
 * `computedFromMissing` says when.
 *
 * A shape is also missing while a point among those an attribute gives it
 * (`entriesAttributes`, `BaseComponent.missingWhenEntriesMissing`) is
 * missing, and a shape that is not made from its children
 * (`contentMissing` false: a `<line>`, `<lineSegment>` or `<angle>`) is
 * missing only then (D40).
 */
export function missingWhenContentMissingDefinitions({
    contentMissing = true,
    entriesAttributes = [],
    pointAttributes = [],
    computedMissing = false,
    contentNamesNothing = false,
}: {
    contentMissing?: boolean;
    entriesAttributes?: string[];
    pointAttributes?: string[];
    computedMissing?: boolean;
    contentNamesNothing?: boolean;
} = {}) {
    return {
        ...(contentMissing
            ? { contentMissing: contentMissingDefinition() }
            : {}),
        valueMissing: {
            returnDependencies: () => ({
                ...(contentMissing
                    ? {
                          contentMissing: {
                              dependencyType: "stateVariable",
                              variableName: "contentMissing",
                          },
                      }
                    : {}),
                // A value computed from a missing input
                // (`BaseComponent.missingWhenComputedFromMissing`,
                // `computedFromMissing`): `<number>$nothing + 1</number>`,
                // `<boolean>not $nothing</boolean>` (D40, #2460).
                ...(computedMissing
                    ? {
                          computedFromMissing: {
                              dependencyType: "stateVariable",
                              variableName: "computedFromMissing",
                          },
                      }
                    : {}),
                // What it holds is only references that name nothing, or a
                // blank entry of a list
                // (`BaseComponent.missingWhenContentNamesNothing`):
                // `<point>$pl[$i]</point>` past the end of `pl` (D40, #2544).
                ...(contentNamesNothing
                    ? {
                          contentNamesNothing: {
                              dependencyType: "stateVariable",
                              variableName: "contentNamesNothing",
                          },
                      }
                    : {}),
                // A point among the points a shape is made from that is
                // missing (`entriesMissing`): `<polygon vertices="(1,0)
                // $nothing (0,1)"/>`, `<angle through="… $pl[3]"/>` (D40).
                ...Object.fromEntries(
                    entriesAttributes.map((attributeName) => [
                        `entries_${attributeName}`,
                        {
                            dependencyType: "attributeComponent",
                            attributeName,
                            variableNames: ["entriesMissing"],
                        },
                    ]),
                ),
                // A point a shape is made from, given by an attribute of one
                // point (`BaseComponent.missingWhenPointsMissing`), that is
                // missing: `<ray through="$nothing"/>`, `<circle
                // center="$pl[3]"/>` (D40, VAL-5).
                ...Object.fromEntries(
                    pointAttributes.map((attributeName) => [
                        `point_${attributeName}`,
                        {
                            dependencyType: "attributeComponent",
                            attributeName,
                            variableNames: [
                                "valueMissing",
                                "contentNamesNothing",
                            ],
                            variablesOptional: true,
                        },
                    ]),
                ),
            }),
            definition({
                dependencyValues,
            }: {
                dependencyValues: Record<string, any>;
            }) {
                const entryMissing =
                    entriesAttributes.some((attributeName) =>
                        dependencyValues[
                            `entries_${attributeName}`
                        ]?.stateValues?.entriesMissing?.some(Boolean),
                    ) ||
                    pointAttributes.some((attributeName) => {
                        const stateValues =
                            dependencyValues[`point_${attributeName}`]
                                ?.stateValues;
                        return Boolean(
                            stateValues?.valueMissing ||
                            stateValues?.contentNamesNothing,
                        );
                    });
                return {
                    setValue: {
                        valueMissing:
                            Boolean(dependencyValues.contentMissing) ||
                            Boolean(dependencyValues.computedFromMissing) ||
                            Boolean(dependencyValues.contentNamesNothing) ||
                            entryMissing,
                    },
                };
            },
            // drawn as a blank while it is missing; whether that changed is
            // checked once the update is done
            // (`RendererInstructionBuilder.checkDrawnMissing`)
            markStale: () => ({ checkDrawnMissing: true }),
        },
    };
}

/**
 * The definition of `valueMissing` of the component a reference written as
 * a tag makes for an array entry that holds no value now
 * (`doenetAttributes.missingWhileEntryEmpty`, `verifyReplacementsMatchSpecifiedType`):
 * `<number extend="$P.z"/>` of a point in the plane, `<text
 * extend="$ci.selectedValue"/>` before a choice. It is linked to the entry,
 * so it holds the entry's value once it has one, and is missing while it has
 * none (D37, #2487). A linked copy of it, which shadows it rather than the
 * entry, is missing while it is.
 */
export function missingWhileEntryEmptyDefinition() {
    return {
        returnDependencies: () => ({
            entry: {
                dependencyType: "shadowSource",
                givePropVariableValue: true,
            },
            source: {
                dependencyType: "shadowSource",
                variableNames: ["valueMissing"],
            },
        }),
        definition({
            dependencyValues,
        }: {
            dependencyValues: { entry: any; source: any };
        }) {
            const values = dependencyValues.entry?.stateValues;
            let valueMissing;
            if (values && Object.keys(values).length > 0) {
                valueMissing = Object.values(values)[0] == undefined;
            } else {
                valueMissing = Boolean(
                    dependencyValues.source?.stateValues?.valueMissing,
                );
            }
            return { setValue: { valueMissing } };
        },
        // drawn as a blank while it is missing; whether that changed is
        // checked once the update is done
        // (`RendererInstructionBuilder.checkDrawnMissing`)
        markStale: () => ({ checkDrawnMissing: true }),
    };
}

/**
 * The definition of `valueMissing` of a component that shadows a property of
 * a component that can be missing for a while
 * (`doenetAttributes.missingWhileSourceMissing`, `BaseComponent.canBecomeMissing`):
 * `<number extend="$n.value"/>` of `<number name="n">$l[$i]</number>` is
 * missing while `n` is, as a property of a missing component is (D37). Given
 * `propVariable`, the property, which holds `null` for no value, it is also
 * missing while the property holds `null` (D40, #2544): `<math
 * extend="$im.aspectRatio"/>` made while the image had an aspect ratio, once
 * it is cleared.
 */
export function missingWhileSourceMissingDefinition(
    sourceIdx?: number,
    propVariable?: string,
) {
    return {
        // The component whose property it shadows, `sourceIdx`; a linked
        // copy of it shadows it instead, as a whole (`shadowSource`). The
        // property itself, `propVariable`, when it holds `null` for no value.
        returnDependencies: () => ({
            ...(sourceIdx !== undefined && propVariable !== undefined
                ? {
                      property: {
                          dependencyType: "stateVariable",
                          componentIdx: sourceIdx,
                          variableName: propVariable,
                          variablesOptional: true,
                      },
                  }
                : {}),
            source:
                sourceIdx === undefined
                    ? {
                          dependencyType: "shadowSource",
                          variableNames: ["valueMissing"],
                      }
                    : {
                          dependencyType: "stateVariable",
                          componentIdx: sourceIdx,
                          variableName: "valueMissing",
                          variablesOptional: true,
                      },
        }),
        definition({
            dependencyValues,
        }: {
            dependencyValues: { source: any; property?: any };
        }) {
            const source = dependencyValues.source;
            return {
                setValue: {
                    valueMissing:
                        ("property" in dependencyValues &&
                            dependencyValues.property === null) ||
                        Boolean(
                            typeof source === "object" && source !== null
                                ? source.stateValues?.valueMissing
                                : source,
                        ),
                },
            };
        },
        // drawn as a blank while it is missing; whether that changed is
        // checked once the update is done
        // (`RendererInstructionBuilder.checkDrawnMissing`)
        markStale: () => ({ checkDrawnMissing: true }),
    };
}

/**
 * The definition of `namesNothing` of a component a copy makes of a property
 * of the component `sourceIdx`, which can be missing for a while
 * (`doenetAttributes.missingWhileSourceMissing`): whether that component is
 * made for a reference that names nothing (`namesNothing`), or holds only
 * missing content (`contentMissing`), as `<circle name="c">$nothing</circle>`
 * does, so the point of `<circle center="$(c.center)"/>` names nothing and
 * the circle is missing (`contentNamesNothingDefinition`, #2596). Like a
 * value reference's (`ValueRef.js`), it never reads whether the source is
 * missing (`valueMissing`), nor what a point or vector holds
 * (`contentNamesNothing`): of a vector whose `head` is its own `tail`, that
 * would read the vector again.
 */
export function namesNothingWhileSourceDoesDefinition(
    sourceIdx: number,
    /**
     * Whether the source is missing while its content is
     * (`BaseComponent.missingWhenContentMissing`); a `<math>`, which holds
     * the blank, isn't, so its `contentMissing` isn't read.
     */
    sourceMissingWhenContentMissing: boolean,
) {
    return {
        returnDependencies: () => ({
            sourceNamesNothing: {
                dependencyType: "stateVariable",
                componentIdx: sourceIdx,
                variableName: "namesNothing",
                variablesOptional: true,
            },
            ...(sourceMissingWhenContentMissing
                ? {
                      sourceContentMissing: {
                          dependencyType: "stateVariable",
                          componentIdx: sourceIdx,
                          variableName: "contentMissing",
                          variablesOptional: true,
                      },
                  }
                : {}),
        }),
        definition({
            dependencyValues,
        }: {
            dependencyValues: {
                sourceNamesNothing: any;
                sourceContentMissing?: any;
            };
        }) {
            return {
                setValue: {
                    namesNothing:
                        Boolean(dependencyValues.sourceNamesNothing) ||
                        Boolean(dependencyValues.sourceContentMissing),
                },
            };
        },
    };
}

/**
 * The definition of `valueMissing` of an adapter of a component that can be
 * missing for a while (`doenetAttributes.missingWhileAdaptedMissing`,
 * `ChildMatcher`): the `<math>` a `<math>` reads of `<number
 * name="n">$l[$i]</number>` is missing while `n` is, as the adapter of a
 * missing component is missing (D37). With `variableName` `namesNothing`,
 * the definition of whether it names nothing, or a blank entry of a list,
 * while what it adapts does (`contentNamesNothingDefinition`, #2544).
 */
export function missingWhileAdaptedMissingDefinition(
    variableName = "valueMissing",
) {
    return {
        returnDependencies: () => ({
            adaptedMissing: {
                dependencyType: "adapterSourceStateVariable",
                variableName,
            },
        }),
        definition({
            dependencyValues,
        }: {
            dependencyValues: { adaptedMissing: any };
        }) {
            return {
                setValue: {
                    [variableName]: Boolean(dependencyValues.adaptedMissing),
                },
            };
        },
        // drawn as a blank while it is missing; whether that changed is
        // checked once the update is done
        // (`RendererInstructionBuilder.checkDrawnMissing`)
        markStale: () => ({ checkDrawnMissing: true }),
    };
}

/**
 * The definition of `valueMissing` of a component that shadows an entry of
 * a list whose entries can be missing (`entriesMissing`,
 * `doenetAttributes.missingWhileListEntryMissing`, set in `ComponentBuilder`):
 * `<number extend="$a[1]"/>` of `<numberList name="a">$l[5] 2</numberList>`
 * is missing while that entry is a blank entry (D40, #2461), and holds the
 * entry's value once it is not. With `variableName` `namesNothing`, the
 * definition of whether it names a blank entry, which a point holding it
 * reads (`contentNamesNothingDefinition`, #2544).
 */
export function missingWhileListEntryMissingDefinition(
    listIdx: number,
    position: number,
    variableName = "valueMissing",
) {
    return {
        returnDependencies: () => ({
            entryMissing: {
                dependencyType: "stateVariable",
                componentIdx: listIdx,
                variableName: `entryMissing${position}`,
                variablesOptional: true,
            },
        }),
        definition({
            dependencyValues,
        }: {
            dependencyValues: { entryMissing: boolean | null };
        }) {
            return {
                setValue: {
                    [variableName]: Boolean(dependencyValues.entryMissing),
                },
            };
        },
        // drawn as a blank while it is missing; whether that changed is
        // checked once the update is done
        // (`RendererInstructionBuilder.checkDrawnMissing`)
        markStale: () => ({ checkDrawnMissing: true }),
    };
}

/**
 * The definition of `entriesMissing` of a list whose entries can be blank
 * (D40): an array of whether each entry is missing, by entry (`entryMissing2`),
 * of the list's `numEntries`, which a reference to the whole list reads, and
 * which redraws the list's entries as blanks when it changes. `definition`
 * holds how the list works out each entry's, its
 * `stateVariablesDeterminingDependencies`, `returnArrayDependenciesByKey` and
 * `arrayDefinitionByKey` (`AuthoredValueList`, `RepeatValueList`).
 */
export function entriesMissingDefinition(definition: Record<string, any>) {
    return {
        isArray: true,
        entryPrefixes: ["entryMissing"],
        // A reference to the whole list reads the list's.
        shadowVariable: true,
        // an entry is drawn as a blank while it is missing
        // (`RendererInstructionBuilder.childrenToRenderOf`)
        markStale: () => ({ updateParentRenderedChildren: true }),
        returnArraySizeDependencies: () => ({
            numEntries: {
                dependencyType: "stateVariable",
                variableName: "numEntries",
            },
        }),
        returnArraySize({
            dependencyValues,
        }: {
            dependencyValues: { numEntries: number };
        }) {
            return [dependencyValues.numEntries];
        },
        ...definition,
    };
}

/** Whether `value`, a math-expression or its tree, is or holds `NaN`. */
export function holdsNaN(value: any): boolean {
    if (typeof value === "number") {
        return Number.isNaN(value);
    }
    if (Array.isArray(value)) {
        return value.some(holdsNaN);
    }
    if (value && typeof value === "object" && "tree" in value) {
        return holdsNaN(value.tree);
    }
    return false;
}

/** Whether `value`, a math-expression or its tree, or a string, holds a blank `＿`. */
export function holdsBlank(value: any): boolean {
    if (typeof value === "string") {
        return value.includes(MISSING_TEXT);
    }
    if (Array.isArray(value)) {
        return value.some(holdsBlank);
    }
    if (value && typeof value === "object" && "tree" in value) {
        return holdsBlank(value.tree);
    }
    return false;
}

/**
 * Whether `child`, a child a component computes its value from, is a missing
 * input (D40, #2460): a missing component or reference (`valueMissing`), or
 * a value holding a blank (`<math>＿</math>`, a string `＿`).
 */
export function isMissingInput(child: any): boolean {
    if (typeof child !== "object" || child === null) {
        return holdsBlank(child);
    }
    const stateValues = child.stateValues ?? {};
    return Boolean(stateValues.valueMissing) || holdsBlank(stateValues.value);
}

/**
 * The definition of `computedFromMissing` for a component that computes its
 * boolean from its children of `childGroups` (`<and>`, `<isNumber>`,
 * `<matchesPattern>`): it is computed from a missing value while one of them
 * is missing (D70: any logic with a missing operand is missing).
 */
export function anyChildMissingDefinition(childGroups: string[]) {
    return {
        returnDependencies: () => ({
            children: {
                dependencyType: "child",
                childGroups,
                variableNames: ["valueMissing"],
                variablesOptional: true,
            },
        }),
        definition({
            dependencyValues,
        }: {
            dependencyValues: { children: any[] };
        }) {
            return {
                setValue: {
                    computedFromMissing: dependencyValues.children.some(
                        (child) => Boolean(child.stateValues?.valueMissing),
                    ),
                },
            };
        },
    };
}

/**
 * `definition`, the `value` of a component whose value is a boolean
 * (`BaseComponent.valueFalseWhileMissing`), made `false` while the component
 * is missing (D70). A missing boolean shows as `＿` and equals nothing, a
 * response "false" included (`valueMissing`); everything that reads it as a
 * condition (`hide`, a `<case>`'s `condition`, an award) reads it as false,
 * all through this one definition, with no case of its own.
 */
export function valueFalseWhileMissing(definition: any) {
    return {
        ...definition,
        returnDependencies(args: any) {
            return {
                ...definition.returnDependencies(args),
                __valueMissing: {
                    dependencyType: "stateVariable",
                    variableName: "valueMissing",
                },
            };
        },
        definition(args: any) {
            const { __valueMissing, ...dependencyValues } =
                args.dependencyValues;
            const result = definition.definition({
                ...args,
                dependencyValues,
            });
            if (
                __valueMissing &&
                result?.setValue &&
                "value" in result.setValue
            ) {
                return {
                    ...result,
                    setValue: { ...result.setValue, value: false },
                };
            }
            return result;
        },
    };
}
