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
 * The definitions of `contentMissing` and `valueMissing` of a component that
 * is missing while its content is only missing children
 * (`BaseComponent.missingWhenContentMissing`, D40): `<number>$nothing</number>`
 * is a missing number, shown as `＿`, never equal to anything, and drawn as a
 * blank, not the `NaN` of `<number/>`. It is made from its children again
 * once a reference among them names something (`<number>$l[$i]</number>`
 * once `i` is an index of `l`), so it is missing only while they are. A
 * tag whose source is missing (`BaseComponent.isMissing`) is instead missing
 * for as long as it exists, and a new one is made once the source is there.
 * So is a component an `extend` makes of another type around what it
 * extends (`doenetAttributes.missingWhenContentMissing`, `<math
 * extend="$n"/>` of such a number).
 */
export function missingWhenContentMissingDefinitions() {
    return {
        contentMissing: contentMissingDefinition(),
        valueMissing: {
            returnDependencies: () => ({
                contentMissing: {
                    dependencyType: "stateVariable",
                    variableName: "contentMissing",
                },
            }),
            definition({
                dependencyValues,
            }: {
                dependencyValues: { contentMissing: boolean };
            }) {
                return {
                    setValue: {
                        valueMissing: Boolean(dependencyValues.contentMissing),
                    },
                };
            },
            // drawn as a blank while it is missing
            // (`RendererInstructionBuilder.updateDrawnMissing`)
            markStale: () => ({ updateParentRenderedChildren: true }),
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
        // drawn as a blank while it is missing
        // (`RendererInstructionBuilder.updateDrawnMissing`)
        markStale: () => ({ updateParentRenderedChildren: true }),
    };
}

/**
 * The definition of `valueMissing` of a component that shadows a property of
 * a component that can be missing for a while
 * (`doenetAttributes.missingWhileSourceMissing`, `BaseComponent.canBecomeMissing`):
 * `<number extend="$n.value"/>` of `<number name="n">$l[$i]</number>` is
 * missing while `n` is, as a property of a missing component is (D37).
 */
export function missingWhileSourceMissingDefinition() {
    return {
        returnDependencies: () => ({
            source: {
                dependencyType: "shadowSource",
                variableNames: ["valueMissing"],
            },
        }),
        definition({
            dependencyValues,
        }: {
            dependencyValues: { source: any };
        }) {
            return {
                setValue: {
                    valueMissing: Boolean(
                        dependencyValues.source?.stateValues?.valueMissing,
                    ),
                },
            };
        },
        // drawn as a blank while it is missing
        // (`RendererInstructionBuilder.updateDrawnMissing`)
        markStale: () => ({ updateParentRenderedChildren: true }),
    };
}
