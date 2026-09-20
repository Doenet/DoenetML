import CompositeComponent from "./abstract/CompositeComponent";
import { postProcessCopy } from "../utils/copy";
import { createNewComponentIndices } from "../utils/componentIndices";
import {
    compareExtractedValues,
    returnBreakStringsIntoTypeSugarInstruction,
    returnListValueStateVariableDefinitions,
} from "../utils/listValues";

/**
 * The permutation taking `previous` to `current`, or `null` if `current` is
 * not a reordering of `previous`.
 *
 * Entry `k` of the result is the position in `previous` of the component that
 * belongs at position `k` now, which is the form
 * `changeType: "rearrangeReplacements"` takes: the replacement built from that
 * component is at that same position in the composite's replacements.
 *
 * A component may legitimately appear twice — `<sort>$a $a</sort>` copies it
 * once per occurrence — so positions are matched off in order rather than by
 * lookup, which pairs the first occurrence with the first, the second with the
 * second, and keeps the result a permutation.
 */
function arrangementFromCopiedComponents(previous, current) {
    if (previous === undefined || previous.length !== current.length) {
        return null;
    }

    const positionsByComponent = new Map();
    for (const [ind, componentIdx] of previous.entries()) {
        let positions = positionsByComponent.get(componentIdx);
        if (positions === undefined) {
            positions = [];
            positionsByComponent.set(componentIdx, positions);
        }
        positions.push(ind);
    }

    const arrangement = [];
    const nextOccurrence = new Map();

    for (const componentIdx of current) {
        const positions = positionsByComponent.get(componentIdx);
        const occurrence = nextOccurrence.get(componentIdx) ?? 0;

        if (positions === undefined || occurrence >= positions.length) {
            // A component that was not copied before, or copied fewer times:
            // the children changed rather than merely moved.
            return null;
        }

        arrangement.push(positions[occurrence]);
        nextOccurrence.set(componentIdx, occurrence + 1);
    }

    return arrangement;
}

/**
 * Whether moving the replacements into `arrangement` is worth doing rather than
 * rebuilding them.
 *
 * What a rearrangement saves is the replacements that *don't* move: those keep
 * their components, and so does whatever copies the sorted list. A replacement
 * that does move costs a copy of the list the same rebuild it would have paid
 * anyway, and the move on top of it.
 *
 * So the saving is proportional to how many entries stay where they were, and a
 * step that reorders nearly everything is better off rebuilt. On forty sorted
 * points read by a `<p>`, the two paths cost about the same when half the list
 * moves; below that rearranging wins by progressively more, above it rebuilding
 * does. A drag carries a value past one neighbor at a time and leaves all but
 * two entries where they were; typing a value that belongs at the far end is
 * what reaches the other case.
 */
function worthRearranging(arrangement) {
    let stayed = 0;

    for (const [ind, previousInd] of arrangement.entries()) {
        if (previousInd === ind) {
            stayed++;
        }
    }

    return stayed * 2 >= arrangement.length;
}

export default class Sort extends CompositeComponent {
    static componentType = "sort";

    static componentDocs = {
        summary: "Sorts a list according to a comparison function",
    };
    static takesIndex = true;

    static allowInSchemaAnywhere = true;

    static stateVariableToEvaluateAfterReplacements =
        "readyToExpandWhenResolved";

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        attributes.sortVectorsBy = {
            groupName: "sorting",
            description:
                "Whether to sort vectors by component or by magnitude.",
            createComponentOfType: "text",
            createStateVariable: "sortVectorsBy",
            defaultValue: "displacement",
            public: true,
            toLowerCase: true,
            validValues: [
                {
                    value: "displacement",
                    description:
                        "Sort vectors by their displacement components.",
                },
                {
                    value: "tail",
                    description:
                        "Sort vectors by the position of their tail point.",
                },
            ],
        };

        attributes.sortByComponent = {
            groupName: "sorting",
            description:
                "Index of the component to sort by (when sorting vectors).",
            createComponentOfType: "integer",
            createStateVariable: "sortByComponent",
            defaultValue: "1",
            public: true,
        };

        attributes.sortByProp = {
            createPrimitiveOfType: "string",
            highlighted: true,
            groupName: "sorting",
            description:
                'Name of a property to sort by (e.g. "x" for sorting points by x-coordinate).',
        };

        attributes.type = {
            createPrimitiveOfType: "string",
            highlighted: true,
            description:
                "Component type to sort bare string children as. Omit it and they are read as what they look like: every piece naming a number sorts by value, anything else sorts alphabetically.",
            validValues: [
                {
                    value: "number",
                    description:
                        "Read bare strings as numbers, ordered by value.",
                },
                {
                    value: "math",
                    description:
                        "Read bare strings as math expressions, ordered by value.",
                },
                {
                    value: "text",
                    description:
                        "Read bare strings as text, ordered alphabetically.",
                },
                {
                    value: "boolean",
                    description:
                        "Read bare strings as booleans, ordered with false before true.",
                },
            ],
        };

        attributes.asList = {
            createPrimitiveOfType: "boolean",
            createStateVariable: "asList",
            defaultValue: true,
            highlighted: true,
            description:
                "Whether to render the items separated by commas (true) or with no separator (false).",
        };

        return attributes;
    }

    static returnSugarInstructions() {
        let sugarInstructions = super.returnSugarInstructions();

        sugarInstructions.push(
            returnBreakStringsIntoTypeSugarInstruction(this.componentType),
        );

        return sugarInstructions;
    }

    static returnChildGroups() {
        return [
            {
                group: "anything",
                componentTypes: ["_base"],
            },
        ];
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        Object.assign(
            stateVariableDefinitions,
            returnListValueStateVariableDefinitions({
                componentName: this.componentType,
                supportProps: true,
            }),
        );

        stateVariableDefinitions.sortedValues = {
            returnDependencies: () => ({
                listValues: {
                    dependencyType: "stateVariable",
                    variableName: "listValues",
                },
                allAreNumeric: {
                    dependencyType: "stateVariable",
                    variableName: "allAreNumeric",
                },
            }),
            definition({ dependencyValues }) {
                let sortedValues = [...dependencyValues.listValues];

                sortedValues.sort((a, b) =>
                    compareExtractedValues(
                        a,
                        b,
                        dependencyValues.allAreNumeric,
                    ),
                );

                return { setValue: { sortedValues } };
            },
        };

        stateVariableDefinitions.readyToExpandWhenResolved = {
            returnDependencies: () => ({
                sortedValues: {
                    dependencyType: "stateVariable",
                    variableName: "sortedValues",
                },
            }),
            markStale: () => ({ updateReplacements: true }),
            definition: function () {
                return { setValue: { readyToExpandWhenResolved: true } };
            },
        };

        return stateVariableDefinitions;
    }

    static async createSerializedReplacements({
        component,
        components,
        componentInfoObjects,
        workspace,
        nComponents,
    }) {
        let diagnostics = [];

        let replacements = [];

        let componentsCopied = [];

        if (workspace.replacementsCreated === undefined) {
            workspace.replacementsCreated = 0;
        }

        // Without this, `createNewComponentIndices` clears `stateId` and each
        // replacement falls back to its `componentIdx` -- a position in the
        // build, which moves whenever anything ahead of this `<sort>` does, so
        // a reader's value comes back on the wrong replacement
        // (Doenet/DoenetML#1944). An id minted off the composite's own
        // document-derived id moves with nothing but the document.
        //
        // What it does not survive is a rebuild: every replacement is made
        // again, and each recreation takes the next numbers from this counter,
        // so work done on a replacement that a later rebuild recreates is
        // dropped rather than landing on a different one. Every counter-based
        // composite behaves that way; it is not what this is fixing.
        //
        // Two things rebuild: a changed set of values, and a reorder that
        // `worthRearranging` turns down. A reorder it accepts is not a
        // rebuild — `calculateReplacementChanges` moves the replacements it
        // already has, and their ids travel with them.
        const stateIdInfo = {
            prefix: `${component.stateId}|`,
            num: workspace.replacementsCreated,
        };

        for (let valueObj of await component.stateValues.sortedValues) {
            let replacementSource;

            if (valueObj.listInd === undefined) {
                replacementSource = components[valueObj.componentIdx];
            } else {
                let listComponent = components[valueObj.componentIdx];
                replacementSource =
                    listComponent.activeChildren[valueObj.listInd];
            }

            if (replacementSource) {
                componentsCopied.push(replacementSource.componentIdx);

                const serializedComponent = await replacementSource.serialize();

                const res = createNewComponentIndices(
                    [serializedComponent],
                    nComponents,
                    stateIdInfo,
                );
                nComponents = res.nComponents;
                replacements.push(res.components[0]);
            }
        }

        replacements = postProcessCopy({
            serializedComponents: replacements,
            componentIdx: component.componentIdx,
            addShadowDependencies: true,
            markAsPrimaryShadow: true,
        });

        workspace.componentsCopied = componentsCopied;
        workspace.replacementsCreated = stateIdInfo.num;

        return {
            replacements,
            diagnostics,
            nComponents,
        };
    }

    static async calculateReplacementChanges({
        component,
        components,
        componentInfoObjects,
        workspace,
        nComponents,
    }) {
        let diagnostics = [];

        let componentsToCopy = [];

        for (let valueObj of await component.stateValues.sortedValues) {
            let replacementSource;

            if (valueObj.listInd === undefined) {
                replacementSource = components[valueObj.componentIdx];
            } else {
                let listComponent = components[valueObj.componentIdx];
                replacementSource =
                    listComponent.activeChildren[valueObj.listInd];
            }

            if (replacementSource) {
                componentsToCopy.push(replacementSource.componentIdx);
            }
        }

        if (
            componentsToCopy.length == workspace.componentsCopied.length &&
            workspace.componentsCopied.every(
                (x, i) => x === componentsToCopy[i],
            )
        ) {
            return { replacementChanges: [], diagnostics, nComponents };
        }

        // Sorting the same children into a different order is the common case
        // — a value changed, or one moved past another — and the replacements
        // we would build are copies of the same components we already copied,
        // just in new positions. Rearranging them keeps every replacement
        // alive, so a dependency that resolved to one of them survives the
        // change and the core has nothing to delete or create. (A reference
        // that copies the output, such as `$sorted[2]`, still gets a
        // replacement of its own built afresh — it just resolves to a
        // component that is still there.)
        const arrangement = arrangementFromCopiedComponents(
            workspace.componentsCopied,
            componentsToCopy,
        );

        if (arrangement && worthRearranging(arrangement)) {
            workspace.componentsCopied = componentsToCopy;

            return {
                replacementChanges: [
                    { changeType: "rearrangeReplacements", arrangement },
                ],
                diagnostics,
                nComponents,
            };
        }

        // Either the children themselves changed, so there is nothing to
        // reuse, or so few replacements would stay put that moving them costs
        // more than building them again.
        let replacementResults = await this.createSerializedReplacements({
            component,
            components,
            componentInfoObjects,
            workspace,
            nComponents,
        });

        let replacements = replacementResults.replacements;
        diagnostics.push(...replacementResults.diagnostics);
        nComponents = replacementResults.nComponents;

        let replacementChanges = [
            {
                changeType: "add",
                changeTopLevelReplacements: true,
                firstReplacementInd: 0,
                numberReplacementsToReplace: component.replacements.length,
                serializedReplacements: replacements,
            },
        ];

        return { replacementChanges, diagnostics, nComponents };
    }
}
