import { convertUnresolvedAttributesForComponentType } from "./dast/convertNormalizedDast";
import { returnNumberDisplayAttributes } from "./numberDisplay";

/**
 * Replacement bookkeeping for composites whose replacements are a list of
 * freshly computed values — `<cumulativeSum>` and friends, and `<sortIndices>`.
 *
 * These differ from `<sort>`, which copies existing components: here there is
 * nothing to copy, so the composite creates value-carrying components the way
 * `<sequence>` does. And they differ from `<sequence>` in that the values come
 * from an already-computed array rather than from a formula, so the same code
 * serves every operator in the family. `<sequence>` shares the per-replacement
 * pieces below — `returnPassThroughAttributes` and `createOneReplacement` — but
 * keeps its own change calculation, which has to reason about `from`, `step`
 * and `exclude` rather than about an array of values.
 *
 * The reason this is more than "recreate everything" is reactivity: an operator
 * fed by a `<mathInput>` recomputes on every keystroke, and tearing down the
 * replacements each time would discard everything downstream that references
 * `$result[2]`. So a replacement that survives has its value updated in place,
 * and only genuine length changes add or withhold components.
 */

/**
 * The attributes a value-creating composite forwards onto each replacement it
 * creates, so that `<cumulativeSum displayDigits="3">` rounds each of its
 * results. `fixed` is included so an author can override the `fixed="true"`
 * that these replacements otherwise carry — their values are computed, so they
 * are not modifiable by default.
 *
 * The composite must declare them all as `leaveRaw`, since it forwards them
 * rather than acting on them itself. Since the declarations and the forwarding
 * have to name the same attributes, both come from here.
 */
export function returnPassThroughAttributeDeclarations() {
    let attributes = {
        fixed: {
            leaveRaw: true,
            description:
                "Whether this component's value is fixed and cannot be modified.",
        },
    };

    const numberDisplayAttrs = returnNumberDisplayAttributes();
    for (let attrName in numberDisplayAttrs) {
        attributes[attrName] = {
            leaveRaw: true,
            description: numberDisplayAttrs[attrName].description,
        };
    }

    return attributes;
}

/**
 * The pass-through attributes an author actually wrote on `component`, ready to
 * be converted onto its replacements.
 */
export function returnPassThroughAttributes(component) {
    let attributesToConvert = {};
    for (let attr of Object.keys(returnPassThroughAttributeDeclarations())) {
        if (attr in component.attributes) {
            attributesToConvert[attr] = component.attributes[attr];
        }
    }
    return attributesToConvert;
}

/**
 * Serialize one replacement carrying `value`, forwarding `attributesToConvert`
 * from the composite onto it.
 */
export function createOneReplacement({
    value,
    componentType,
    attributesToConvert,
    componentInfoObjects,
    nComponents,
    stateIdInfo,
}) {
    let attributesFromComposite = {};

    if (Object.keys(attributesToConvert).length > 0) {
        const res = convertUnresolvedAttributesForComponentType({
            attributes: attributesToConvert,
            componentType,
            componentInfoObjects,
            nComponents,
            stateIdInfo,
        });

        nComponents = res.nComponents;
        attributesFromComposite = res.attributes;
    }

    let serializedComponent = {
        type: "serialized",
        componentType,
        componentIdx: nComponents++,
        stateId: `${stateIdInfo.prefix}${stateIdInfo.num++}`,
        attributes: attributesFromComposite,
        doenetAttributes: {},
        children: [],
        state: { value, fixed: true },
    };

    return { serializedComponent, nComponents };
}

/**
 * Build the full set of replacements for `values`. Mirrors the shape a
 * composite's `createSerializedReplacements` must return.
 */
export function createValueListReplacements({
    component,
    values,
    componentType,
    attributesToConvert = {},
    componentInfoObjects,
    workspace,
    nComponents,
}) {
    if (workspace.replacementsCreated === undefined) {
        workspace.replacementsCreated = 0;
    }

    const stateIdInfo = {
        prefix: `${component.stateId}|`,
        num: workspace.replacementsCreated,
    };

    let replacements = [];

    for (let value of values) {
        const res = createOneReplacement({
            value,
            componentType,
            attributesToConvert,
            componentInfoObjects,
            nComponents,
            stateIdInfo,
        });
        nComponents = res.nComponents;
        replacements.push(res.serializedComponent);
    }

    workspace.replacementsCreated = stateIdInfo.num;
    workspace.numReplacements = values.length;

    return { replacements, diagnostics: [], nComponents };
}

/**
 * Reconcile the existing replacements with a new array of `values`. Mirrors the
 * shape a composite's `calculateReplacementChanges` must return.
 */
export function calculateValueListReplacementChanges({
    component,
    values,
    componentType,
    attributesToConvert = {},
    componentInfoObjects,
    workspace,
    nComponents,
}) {
    let replacementChanges = [];

    let prevNumReplacements = workspace.numReplacements ?? 0;
    let numReplacements = values.length;

    let numToModify = Math.min(prevNumReplacements, numReplacements);

    if (numReplacements < prevNumReplacements) {
        // Withhold the extra replacements rather than deleting them, so they
        // can be revealed again if the list grows back.
        replacementChanges.push({
            changeType: "changeReplacementsToWithhold",
            replacementsToWithhold:
                component.replacements.length - numReplacements,
        });
    } else if (numReplacements > prevNumReplacements) {
        let numToAdd = numReplacements - prevNumReplacements;
        let withheld = component.replacementsToWithhold ?? 0;

        if (withheld > 0) {
            // Reuse withheld replacements before creating new ones.
            let numToReveal = Math.min(withheld, numToAdd);
            numToModify += numToReveal;
            numToAdd -= numToReveal;

            if (numToAdd === 0) {
                // Only send the withhold instruction when we are not also
                // sending an add instruction, which recalculates the parent's
                // replacements anyway.
                replacementChanges.push({
                    changeType: "changeReplacementsToWithhold",
                    replacementsToWithhold: withheld - numToReveal,
                });
            }
        }

        if (numToAdd > 0) {
            const stateIdInfo = {
                prefix: `${component.stateId}|`,
                num: workspace.replacementsCreated ?? 0,
            };

            let firstNewInd = numReplacements - numToAdd;

            let newSerializedReplacements = [];
            for (let ind = firstNewInd; ind < numReplacements; ind++) {
                const res = createOneReplacement({
                    value: values[ind],
                    componentType,
                    attributesToConvert,
                    componentInfoObjects,
                    nComponents,
                    stateIdInfo,
                });
                nComponents = res.nComponents;
                newSerializedReplacements.push(res.serializedComponent);
            }

            workspace.replacementsCreated = stateIdInfo.num;

            replacementChanges.push({
                changeType: "add",
                changeTopLevelReplacements: true,
                firstReplacementInd: firstNewInd,
                numberReplacementsToReplace:
                    component.replacements.length - firstNewInd,
                serializedReplacements: newSerializedReplacements,
                replacementsToWithhold: 0,
            });
        }
    }

    for (let ind = 0; ind < numToModify; ind++) {
        replacementChanges.push({
            changeType: "updateStateVariables",
            component: component.replacements[ind],
            stateChanges: { value: values[ind] },
        });
    }

    workspace.numReplacements = numReplacements;

    return { replacementChanges, diagnostics: [], nComponents };
}
