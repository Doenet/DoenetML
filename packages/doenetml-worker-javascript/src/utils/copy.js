import {
    convertUnresolvedAttributesForComponentType,
    unwrapSource,
} from "./dast/convertNormalizedDast";
import { preprocessAttributesObject } from "./attributes";

/**
 * Whether the names inside what `composite` makes are reached through its
 * name (`$e.h`): it is the `_copy` made for an `extend` (or `copy`) of a list
 * (`forList`) or of any other component (`_createComponentIdx`). A reference
 * (`$l`) has no name to reach them through.
 *
 * A linked copy of a list made in such a `_copy` keeps the list's named
 * children (`namesReachedThroughCopy`, `BaseComponent.serialize`). So does
 * the shadow of a composite's replacements or of a parent's new children,
 * decided by the `_copy` mediating it (`shadows.compositeIdx`) so that it is
 * made with the same children as the copy that holds it
 * (`createComponentIndicesFromSerializedChildren` matches the two).
 */
export function namesReachedThroughCopy(composite) {
    return (
        composite?.doenetAttributes.forList !== undefined ||
        composite?.attributes._createComponentIdx !== undefined
    );
}

/**
 * Give each of `serializedReplacements`, the replacements a shadowing
 * composite makes by copying those of the composite it shadows, the
 * `isResponse` mark the shadowing composite holds, if it holds one. Returns
 * the new `nComponents`.
 *
 * The mark is the one an `<award referencesAreResponses>` gives a reference
 * it names (`Award.js`). In an award made by `extend`, that reference is the
 * shadow of a reference in the source award, and its replacements are copies
 * of that reference's replacements, which have no mark, so it is added here,
 * both when the shadow first expands (`CompositeExpander.ts`) and when its
 * replacements are remade (`CompositeReplacementUpdater.ts`). A copy that is
 * not a shadow resolves its attributes for its replacements itself
 * (`Copy.js`).
 *
 * A value reference (`_ref`) declares no attributes. It holds the mark as
 * the type it presents as reads it, a primitive (`ValueRef.js`).
 */
export function addShadowingCompositeResponseMark({
    shadowingComponent,
    serializedReplacements,
    componentInfoObjects,
    nComponents,
}) {
    const isResponse = shadowingComponent.attributes.isResponse;
    if (!isResponse) {
        return nComponents;
    }
    const compositeAttributesObj = preprocessAttributesObject(
        shadowingComponent.constructor.createAttributesObject(),
    );
    for (const repl of serializedReplacements) {
        if (typeof repl !== "object") {
            continue;
        }
        const componentType =
            repl.componentType === "_ref"
                ? repl.doenetAttributes?.presentedComponentType
                : repl.componentType;
        if (!componentInfoObjects.allComponentClasses[componentType]) {
            continue;
        }
        const res = convertUnresolvedAttributesForComponentType({
            attributes: { isResponse },
            componentType,
            componentInfoObjects,
            compositeAttributesObj,
            nComponents,
        });
        nComponents = res.nComponents;
        if (!repl.attributes) {
            repl.attributes = {};
        }
        Object.assign(repl.attributes, res.attributes);
    }
    return nComponents;
}

/**
 * The list form a `<collect>`, `<sort>` or `<shuffle>` of values is made as
 * (`utils/dast/listForms.ts`), mapped to the tag it is written as.
 */
export const TAGS_OF_LIST_FORMS = {
    _collectList: "collect",
    _sortList: "sort",
    _shuffleList: "shuffle",
};

/**
 * Whether a replacement of type `replacementType` is a component of
 * `requiredType`, the type a copy is written as. The list form of a tag
 * (`TAGS_OF_LIST_FORMS`) is a component of that tag: `<collect
 * copy="$B.gB.x"/>` of a `<collect>` made a list form is the list form,
 * even when the document pass (`utils/dast/listForms.ts`) could not see that
 * `x` is one, as when `x` is made by an `extend` (`gB`).
 */
export function replacementIsOfType(replacementType, requiredType) {
    return (
        replacementType === requiredType ||
        (Object.hasOwn(TAGS_OF_LIST_FORMS, replacementType) &&
            TAGS_OF_LIST_FORMS[replacementType] === requiredType)
    );
}

export function postProcessCopy({
    serializedComponents,
    componentIdx,
    addShadowDependencies = true,
    markAsPrimaryShadow = false,
    unlinkExternalCopies = false,
    withoutReaderState = false,
    copiesByRefIdx = {},
    componentIndicesFound = [],
    init = true,
}) {
    // recurse through serializedComponents
    //   - to add downstream dependencies to original component
    //   - add unique identifiers

    for (let ind in serializedComponents) {
        let component = serializedComponents[ind];

        if (typeof component !== "object") {
            continue;
        }

        if (unlinkExternalCopies) {
            componentIndicesFound.push(component.componentIdx);
        }

        if (component.shadowsVariableOf) {
            // made by a serialization to shadow one state variable of a
            // component (`ValueRef.serialize`), which a linked copy keeps
            if (addShadowDependencies) {
                const {
                    componentIdx: shadowedIdx,
                    variableName,
                    fromImplicitProp,
                } = component.shadowsVariableOf;
                const dependency = {
                    dependencyType: "referenceShadow",
                    compositeIdx: componentIdx,
                    propVariable: variableName,
                };
                if (fromImplicitProp) {
                    dependency.fromImplicitProp = true;
                }
                component.downstreamDependencies = {
                    [shadowedIdx]: [dependency],
                };
            } else if (component.originalIdx != undefined) {
                component.unlinkedCopySource = component.originalIdx;
                markWithoutReaderState(component);
            }
            delete component.shadowsVariableOf;
        } else if (component.originalIdx != undefined) {
            // preserializedNamesFound[component.originalIdx] = component;

            if (!component.dontShadowOriginalIndex) {
                // if dontShadowOriginalIndex, then was copied from a serialized component
                // so copy cannot shadow anything

                if (addShadowDependencies) {
                    let downDep = {
                        [component.originalIdx]: [
                            {
                                dependencyType: "referenceShadow",
                                compositeIdx: componentIdx,
                            },
                        ],
                    };

                    if (init) {
                        downDep[
                            component.originalIdx
                        ][0].firstLevelReplacement = true;
                    }
                    if (markAsPrimaryShadow) {
                        downDep[component.originalIdx][0].isPrimaryShadow =
                            true;
                    }

                    // create downstream dependency
                    component.downstreamDependencies = downDep;
                } else {
                    component.unlinkedCopySource = component.originalIdx;
                    markWithoutReaderState(component);
                }
            }
        }

        if (component.componentType === "_copy" && unlinkExternalCopies) {
            const refResolution = unwrapSource(component.extending);
            const nodeIdx = refResolution.nodeIdx;
            if (nodeIdx == null) {
                throw Error("we need to create a nodeIdx here, then.");
            } else {
                if (copiesByRefIdx[nodeIdx] === undefined) {
                    copiesByRefIdx[nodeIdx] = [];
                }
                copiesByRefIdx[nodeIdx].push(component);
            }
        }
    }

    // recurse after processing all components
    // so that first gather all active aliases

    /** Recurse into components nested one level below this one. */
    function recurse(nestedComponents) {
        return postProcessCopy({
            serializedComponents: nestedComponents,
            componentIdx,
            addShadowDependencies,
            markAsPrimaryShadow,
            unlinkExternalCopies,
            withoutReaderState,
            copiesByRefIdx,
            componentIndicesFound,
            init: false,
        });
    }

    /**
     * Mark a component of a `copy` (`withoutReaderState`), which takes no
     * state from its unlinked source (`unlinkedCopySource`): a `<repeat>`
     * of one makes its iterations as written, with its own random choices,
     * where one of a `copyWithState` takes those of its source's
     * iterations (`copyStateFromUnlinkedSource`, D33).
     */
    function markWithoutReaderState(component) {
        if (withoutReaderState) {
            component.unlinkedCopyWithoutReaderState = true;
        }
    }

    /**
     * The components inside a reference's path indices, such as the `$i` of
     * `$m[$i]`, were copied along with the reference, so they shadow their
     * originals just as a copied child does.
     *
     * Called for a reference in content — the component itself — and for each
     * entry of an attribute's `references` (a reference in `target`, `from`,
     * and the like). Only the indices are recursed into here: an attribute's
     * reference resolves from its new location, and giving it a
     * `referenceShadow` of its own would change index-free references that
     * work today.
     */
    function recurseIntoPathIndices(component) {
        if (!component.extending) {
            return;
        }
        for (const pathPart of unwrapSource(component.extending).originalPath ??
            []) {
            for (const index of pathPart.index) {
                recurse(index.value);
            }
        }
    }

    for (let ind in serializedComponents) {
        let component = serializedComponents[ind];
        if (typeof component !== "object") {
            continue;
        }

        recurse(component.children);

        for (let attrName in component.attributes) {
            let attribute = component.attributes[attrName];
            if (attribute.component) {
                attribute.component = recurse([attribute.component])[0];
            } else if (attribute.references) {
                for (const reference of attribute.references) {
                    recurseIntoPathIndices(reference);
                }
            }
        }

        if (component.replacements) {
            recurse(component.replacements);
        }

        recurseIntoPathIndices(component);
    }

    if (init && unlinkExternalCopies) {
        for (let extendIdxStr in copiesByRefIdx) {
            if (!componentIndicesFound.includes(Number(extendIdxStr))) {
                for (let copyComponent of copiesByRefIdx[extendIdxStr]) {
                    if (!copyComponent.attributes) {
                        copyComponent.attributes = {};
                    }
                    copyComponent.attributes._link = {
                        type: "primitive",
                        primitive: { type: "boolean", value: false },
                    };
                }
            }
        }
    }

    return serializedComponents;
}

/**
 * Whether the reference `component`, a `_copy`, names one thing (D37, rule
 * 1): it has no referent, it has an index (`$s[2]`), or it names a
 * component, or a property of one, that is not a collection named as a
 * whole. A reference to a collection as a whole, a composite or a list (`$r`
 * or `$r.y` of a `<repeat>`, `$g` of a `<group>`), gives its members,
 * possibly none, unless none of them could have the property it names
 * (`$g.nonexistent`, `doenet-w0104`), which names nothing. With `withheld`,
 * what it names is withheld, as in a case that is not active, so any name
 * after the first is one thing.
 *
 * A bare reference to one thing that makes nothing is a blank
 * (`isBareReferenceToOneThing` in `Copy.js`), and so is one in a parent that
 * needs it to make something, a `<text>` or a `<math>`
 * (`verifyReplacementsMatchSpecifiedType`).
 */
export async function referenceNamesOneThing(
    component,
    components,
    { withheld = false } = {},
) {
    if (component.doenetAttributes?.noReferent) {
        return true;
    }
    const extended = await component.stateValues.extendedComponent;
    const originalPath = await component.stateValues.originalPath;
    if (!extended) {
        // An index that names nothing now, as one below 1 (`$r[$i]` while
        // `i` is 0), leaves no referent: what it names is one thing.
        return Boolean(originalPath?.some((part) => part.index.length > 0));
    }
    // An index names one thing, or nothing, even after a `<setup>` (`$st[2]`,
    // which names nothing, as a `<setup>` makes nothing an index selects)
    if (originalPath?.some((part) => part.index.length > 0)) {
        return true;
    }
    if (extended.componentType === "setup") {
        return false;
    }
    const unresolvedPath = await component.stateValues.unresolvedPath;
    if (withheld && originalPath?.length > 1) {
        // A name in a branch that is not active (`$cc.x`), whatever it
        // names, as it is decided before the branch is made
        return true;
    }
    // A name, or a property of what it names: one thing, unless it names a
    // collection as a whole, a composite or a list, whose property is one
    // of each of its members (`$r.y` of a `<repeat>`), possibly none. A
    // name after it (`$cc.x` of a name in a case, `pathStartsWithProperty`
    // unset) is one thing, and so is a property of the collection itself,
    // read from it rather than from its members (`$c.maxNumber` of a
    // `<collect>`, #2416), unless it is an array (below).
    if (
        unresolvedPath?.length > 0 &&
        !component.doenetAttributes?.pathStartsWithProperty
    ) {
        return true;
    }
    const componentInfoObjects = component.componentInfoObjects;
    // Its only source is the collection itself, which has the property.
    const replacementSources = await component.stateValues.replacementSources;
    const ownPropName = (
        await component.stateValues.effectivePropNameBySource
    )?.[0];
    const ownProperty =
        unresolvedPath?.length > 0 &&
        replacementSources?.length === 1 &&
        replacementSources[0]?.componentIdx === extended.componentIdx &&
        Boolean(ownPropName) &&
        components[extended.componentIdx]?.state[ownPropName] !== undefined;
    // A property none of its members could have (`$g.nonexistent`, which
    // reports `doenet-w0104`) names nothing, so it is one thing.
    const propNames = await component.stateValues.effectivePropNameBySource;
    if (
        unresolvedPath?.length > 0 &&
        component.doenetAttributes?.pathStartsWithProperty &&
        propNames?.length > 0 &&
        propNames.every((name) => name === "__prop_name_not_found")
    ) {
        return true;
    }
    if (
        !ownProperty &&
        (componentInfoObjects.isCompositeComponent({
            componentType: extended.componentType,
        }) ||
            componentInfoObjects.allComponentClasses[extended.componentType]
                ?.listEntryComponentType !== undefined)
    ) {
        return false;
    }
    // A property that is an array, such as `$ci.selectedValues` or
    // `$f.minima`, is a list: its members, possibly none. So is an entry of
    // an array that spans entries, such as `$f.minimumValues`, unlike one
    // that is one entry, such as `$P.x` or `$f.minimumValue1`.
    if (unresolvedPath?.length > 0) {
        const propName = (
            await component.stateValues.effectivePropNameBySource
        )?.[0];
        const stateVarObj =
            propName && components[extended.componentIdx]?.state[propName];
        if (
            stateVarObj?.isArray ||
            (stateVarObj?.isArrayEntry &&
                stateVarObj.numDimensions >
                    (stateVarObj.wrappingComponents?.length ?? 0))
        ) {
            return false;
        }
    }
    return true;
}

/**
 * Whether `component` is a reference not written as a tag, in a parent that
 * needs every composite to make something (`compositesMustHaveAReplacement`,
 * a `<text>`, a `<math>` or a `<boolean>`), that names one thing
 * (`referenceNamesOneThing`). The blank it is given when it makes nothing is
 * missing (D37, #2487).
 */
async function isReferenceToOneThingInParentNeedingIt(component, components) {
    if (
        component.componentType !== "_copy" ||
        !component.sharedParameters.compositesMustHaveAReplacement ||
        component.attributes._createComponentOfType?.primitive ||
        component.doenetAttributes?.forList !== undefined ||
        !components
    ) {
        return false;
    }
    return await referenceNamesOneThing(component, components, {
        withheld: Boolean(await component.stateValues.targetInactive),
    });
}

export async function verifyReplacementsMatchSpecifiedType({
    component,
    replacements,
    replacementChanges,
    workspace = {},
    componentInfoObjects,
    compositeAttributesObj,
    components,
    nComponents,
    stateIdInfo,
    publicCaseInsensitiveAliasSubstitutions,
}) {
    let diagnostics = [];

    if (
        !component.attributes._createComponentOfType?.primitive &&
        !component.sharedParameters.compositesMustHaveAReplacement
    ) {
        return {
            replacements,
            replacementChanges,
            diagnostics,
            nComponents,
        };
    }

    // An extend that would change what its source makes shows one error in
    // its place (`extendChangesContentErrors` in `Copy.js`). It is left as
    // it is, not made into the type the extend was written as, which would
    // wrap it in a component of that type given the attributes that are the
    // error.
    const newReplacements = replacementChanges
        ? replacementChanges.length === 1 &&
          replacementChanges[0].changeType === "add"
            ? replacementChanges[0].serializedReplacements
            : undefined
        : replacements;
    if (
        newReplacements?.length === 1 &&
        newReplacements[0]?.doenetAttributes?.inPlaceOfExtend
    ) {
        return {
            replacements,
            replacementChanges,
            diagnostics,
            nComponents,
        };
    }

    let replacementsToWithhold = component.replacementsToWithhold;
    let replacementTypes;
    const originalReplacements = replacements;

    if (!replacementChanges) {
        // if have a group, filter out blank strings
        if (component.componentType === "group") {
            replacements = replacements.filter(
                (x) => x.componentType || x.trim().length > 0,
            );
        }

        replacementTypes = replacements.map((x) => x.componentType);

        if (
            replacementTypes.length === 1 &&
            replacementTypes[0] === "externalContent"
        ) {
            // since looking for a particular componentType, filter out blank strings
            replacementTypes = replacements[0].children
                .filter((x) => x.componentType || x.trim().length > 0)
                .map((x) => x.componentType);
        }

        if (replacementsToWithhold > 0) {
            replacementTypes = replacementTypes.slice(
                0,
                replacementTypes.length - replacementsToWithhold,
            );
        }
    } else {
        const res = calculateReplacementTypesFromChanges(
            component,
            replacementChanges,
        );

        replacementTypes = res.replacementTypes;
        replacementsToWithhold = res.replacementsToWithhold;
    }

    if (
        !component.attributes._createComponentOfType?.primitive &&
        component.sharedParameters.compositesMustHaveAReplacement &&
        replacementTypes.length > 0
    ) {
        // no changes since only reason we got this far was that
        // composites must have a replacement
        // and we have at least one replacement
        return {
            // Note: use `originalReplacements` as may have modified `replacements`, above.
            replacements: originalReplacements,
            replacementChanges,
            diagnostics,
            nComponents,
        };
    }

    let requiredComponentType =
        component.attributes._createComponentOfType?.primitive.value;

    let requiredLength = await component.stateValues.numComponentsSpecified;

    if (!requiredComponentType) {
        // must have be here due to composites needing a replacement
        requiredComponentType =
            component.sharedParameters.compositesDefaultReplacementType;
        if (!requiredComponentType) {
            throw Error(
                `A component class specified descendantCompositesMustHaveAReplacement but didn't specify descendantCompositesDefaultReplacementType`,
            );
        }
        requiredLength = 1;
    }

    requiredComponentType =
        componentInfoObjects.componentTypeLowerCaseMapping[
            requiredComponentType.toLowerCase()
        ];

    if (
        replacementTypes.length !== requiredLength ||
        !replacementTypes.every((x) =>
            replacementIsOfType(x, requiredComponentType),
        )
    ) {
        // console.warn(
        //     `Replacements from ${component.componentType} ${component.componentIdx} do not match the specified createComponentOfType`,
        // );

        // if only replacement is a group or a _copy
        // then give the group/_copy the createComponentOfType
        if (
            replacements?.length === 1 &&
            requiredLength === 1 &&
            (replacements[0].componentType === "group" ||
                replacements[0].componentType === "_copy")
        ) {
            if (!replacements[0].attributes) {
                replacements[0].attributes = {};
            }
            replacements[0].attributes._createComponentOfType = {
                type: "primitive",
                primitive: { type: "string", value: requiredComponentType },
            };

            if (component.attributes._createComponentName?.primitive) {
                replacements[0].attributes._createComponentName = JSON.parse(
                    JSON.stringify(component.attributes._createComponentName),
                );
                delete replacements[0].attributes.name;
            }
            if (component.attributes._createComponentIdx?.primitive) {
                replacements[0].attributes._createComponentIdx = JSON.parse(
                    JSON.stringify(component.attributes._createComponentIdx),
                );
                replacements[0].componentIdx = nComponents++;
                replacements[0].stateId = `${stateIdInfo.prefix}${stateIdInfo.num++}`;
            }

            return {
                replacements,
                replacementChanges,
                diagnostics,
                nComponents,
            };
        } else if (
            replacementChanges?.length === 1 &&
            replacementChanges[0].changeType === "add" &&
            replacementChanges[0].changeTopLevelReplacements &&
            replacementChanges[0].serializedReplacements.length === 1 &&
            (replacementChanges[0].serializedReplacements[0].componentType ==
                "group" ||
                replacementChanges[0].serializedReplacements[0]
                    .componentType === "_copy") &&
            requiredLength === 1 &&
            replacementChanges[0].numberReplacementsToReplace >=
                component.replacements.length
        ) {
            // if we are changing replacements so that only replacement is a group/_copy
            // then give the group/_copy the createComponentOfType

            const theReplacement =
                replacementChanges[0].serializedReplacements[0];

            if (!theReplacement.attributes) {
                theReplacement.attributes = {};
            }
            theReplacement.attributes._createComponentOfType = {
                type: "primitive",
                primitive: { type: "string", value: requiredComponentType },
            };

            if (component.attributes._createComponentName?.primitive) {
                theReplacement.attributes._createComponentName = JSON.parse(
                    JSON.stringify(component.attributes._createComponentName),
                );
                delete theReplacement.attributes.name;
            }
            if (component.attributes._createComponentIdx?.primitive) {
                theReplacement.attributes._createComponentIdx = JSON.parse(
                    JSON.stringify(component.attributes._createComponentIdx),
                );
                theReplacement.componentIdx = nComponents++;
                theReplacement.stateId = `${stateIdInfo.prefix}${stateIdInfo.num++}`;
            }

            return {
                replacements,
                replacementChanges,
                diagnostics,
                nComponents,
            };
        }

        // if the only discrepancy is the components are the wrong type,
        // with number of sources matching the number of components
        // then wrap each replacement with a blank component we are creating,
        // i.e., add each current replacement as the child of a new component

        // A source that made nothing, such as an iteration a `<repeat>`
        // withholds while it has fewer, is not counted.
        let wrapExistingReplacements =
            replacementTypes.length === requiredLength &&
            !(replacementsToWithhold > 0) &&
            (workspace.sourceIndices?.length === requiredLength ||
                (!replacementChanges &&
                    workspace.sourceIndices?.length > requiredLength &&
                    workspace.numReplacementsBySource?.filter((n) => n > 0)
                        .length === requiredLength));

        let originalReplacements;

        if (wrapExistingReplacements && replacementChanges) {
            // if we have replacement changes, we can wrap only if we are replacing all components
            // in a single add. It may replace more than the copy has now: a
            // replacement that shadowed a component deleted with it (the
            // `<number>` of a case no longer active, when `$cc.x` is now
            // the `<integer>` of another case) is already gone, as for a
            // group or a `_copy`, above.
            if (
                replacementChanges.length === 1 &&
                replacementChanges[0].numberReplacementsToReplace >=
                    component.replacements.length
            ) {
                originalReplacements =
                    replacementChanges[0].serializedReplacements;
            } else {
                wrapExistingReplacements = false;
            }
        }

        if (wrapExistingReplacements) {
            if (!originalReplacements) {
                originalReplacements = replacements;
            }
        } else {
            // since clearing out all replacements, reset all workspace variables
            workspace.numReplacementsBySource = [];
            workspace.numNonStringReplacementsBySource = [];
            workspace.propVariablesCopiedBySource = [];
            workspace.sourceIndices = [];
        }

        // A reference written as a tag whose source made nothing is missing
        // (D37): a tag whose source is missing is missing, whatever it adds.
        // So is the filler of a bare reference with no referent (`$nothing`)
        // in a parent that needs it to make something (a `<text>`), which is
        // a blank there, as `<text extend="$nothing"/>` is, and of any other
        // reference to one thing there that makes nothing (`$c.maxNumber` of
        // a `<collect>` with no limit, `$r[3]` of a `<repeat>` with two
        // iterations), as it is in a `<p>` (`referenceNamesOneThing`).
        const madeNothing =
            replacementTypes.length === 0 &&
            (Boolean(component.attributes._createComponentOfType?.primitive) ||
                Boolean(component.doenetAttributes?.noReferent) ||
                (await isReferenceToOneThingInParentNeedingIt(
                    component,
                    components,
                )));

        replacements = [];
        for (let i = 0; i < requiredLength; i++) {
            const res = convertUnresolvedAttributesForComponentType({
                attributes: component.attributes,
                componentType: requiredComponentType,
                componentInfoObjects,
                compositeAttributesObj,
                nComponents,
                stateIdInfo,
            });

            const attributesFromComposite = res.attributes;
            nComponents = res.nComponents;

            replacements.push({
                componentType: requiredComponentType,
                componentIdx: nComponents++,
                stateId: `${stateIdInfo.prefix}${stateIdInfo.num++}`,
                attributes: attributesFromComposite,
                doenetAttributes: madeNothing ? { missing: true } : {},
                state: {},
                children: [],
            });
        }

        // If we require a single replacement but had none,
        // then attempt to link the empty replacement to a state variable
        // from the target (by adding a downstreamDependencies to the replacement).
        // The most relevant scenario is where we are trying to copy
        // an array state variable or an array entry state variable
        // that currently is empty, but want the ability to
        // set the future value of this state variable (and make it non-empty)
        // via the copy we are now creating.
        // Since we don't see a use case for non-arrays,
        // this is only implemented for arrays

        // XXX: haven't reviewed this for non new namespace regime

        if (replacementTypes.length === 0 && requiredLength === 1) {
            let targetInactive = await component.stateValues.targetInactive;

            let propName = (
                await component.stateValues.effectivePropNameBySource
            )?.[0];

            if (propName && !targetInactive) {
                let replacementSources =
                    await component.stateValues.replacementSourceIdentities;

                let replacementSource = replacementSources[0];

                let target = components[replacementSource.componentIdx];

                if (target) {
                    let propVariable = publicCaseInsensitiveAliasSubstitutions({
                        stateVariables: [propName],
                        componentClass: target.constructor,
                    })[0];

                    let stateVarObj = target.state[propVariable];
                    // One entry (`$P.z`, `$f.minimumValue1`), not an array
                    // (`$f.minima`) or an entry that spans entries
                    // (`$f.minimumValues`), which are lists, possibly empty.
                    const isOneEntry =
                        stateVarObj?.isArrayEntry &&
                        !(
                            stateVarObj.numDimensions >
                            (stateVarObj.wrappingComponents?.length ?? 0)
                        );
                    if (stateVarObj?.isArray || stateVarObj?.isArrayEntry) {
                        let arrayStateVarObj, arrayKeys;
                        if (stateVarObj.isArray) {
                            arrayStateVarObj = stateVarObj;
                            let arraySize = await stateVarObj.arraySize;
                            arrayKeys = stateVarObj.getAllArrayKeys(arraySize);
                        } else {
                            arrayStateVarObj =
                                target.state[stateVarObj.arrayStateVariable];
                            // use getArrayKeysFromVarName without specifying arraySize
                            // so that get keys for the entry that might occur
                            // if the array size were increased
                            arrayKeys =
                                arrayStateVarObj.getArrayKeysFromVarName({
                                    arrayEntryPrefix: stateVarObj.entryPrefix,
                                    varEnding: stateVarObj.varEnding,
                                    numDimensions:
                                        arrayStateVarObj.numDimensions,
                                });
                        }

                        // want the prop variable corresponding to just the first entry
                        // of the array or the array entry
                        propVariable =
                            arrayStateVarObj.arrayVarNameFromArrayKey(
                                arrayKeys[0] ||
                                    Array(arrayStateVarObj.numDimensions)
                                        .fill("0")
                                        .join(","),
                            );
                    } else {
                        // Since we don't currently see a use case for non-arrays,
                        // we are setting stateVarObj to undefined
                        // so that dependencies are not added
                        stateVarObj = undefined;
                    }

                    if (stateVarObj) {
                        // For one entry, missing only while it holds no value
                        // (`missingWhileEntryEmpty`, D37, #2487): it holds
                        // what the array entry holds once it has one, and a
                        // write reaches the entry, so it is not missing for
                        // good, as a tag made with nothing to read is. A copy
                        // of an award's feedback, which the award has none
                        // of yet, is hidden while it is (`Feedback.js`).
                        replacements[0].doenetAttributes = isOneEntry
                            ? { missingWhileEntryEmpty: true }
                            : {};
                        replacements[0].downstreamDependencies = {
                            [replacementSource.componentIdx]: [
                                {
                                    dependencyType: "referenceShadow",
                                    compositeIdx: component.componentIdx,
                                    propVariable,
                                    additionalStateVariableShadowing:
                                        stateVarObj.shadowingInstructions
                                            .addStateVariablesShadowingStateVariables,
                                },
                            ],
                        };
                    }
                }
            }
        }

        if (wrapExistingReplacements) {
            for (let [ind, repl] of replacements.entries()) {
                const res = wrapAsWrittenType({
                    wrapper: repl,
                    wrapped: originalReplacements[ind],
                    componentInfoObjects,
                    nComponents,
                    stateIdInfo,
                });
                nComponents = res.nComponents;
            }
        }

        workspace.wrapExistingReplacements = wrapExistingReplacements;

        if (!wrapExistingReplacements) {
            workspace.numReplacementsBySource.push(replacements.length);
            workspace.numNonStringReplacementsBySource.push(
                replacements.filter((x) => typeof x !== "string").length,
            );
        }

        if (replacementChanges) {
            replacementChanges = [];
            if (component.replacementsToWithhold > 0) {
                replacementChanges.push({
                    changeType: "changeReplacementsToWithhold",
                    replacementsToWithhold: 0,
                });
            }

            let numberReplacementsToReplace = 0;
            if (component.replacements) {
                numberReplacementsToReplace = component.replacements.length;
            }

            replacementChanges.push({
                changeType: "add",
                changeTopLevelReplacements: true,
                firstReplacementInd: 0,
                numberReplacementsToReplace,
                serializedReplacements: replacements,
            });
        }
    }

    return { replacements, replacementChanges, diagnostics, nComponents };
}

/**
 * Makes `wrapper`, a new component of the type an `extend` or `copy` was
 * written as, hold `wrapped`, the replacement made from its source, so that
 * its value is the source's converted to that type (D26, REF-5). Most types
 * read a child of another value type as their own (a `<point>` a math
 * tuple, a `<text>` a math). A boolean is `1` or `0` as a number or a math:
 * a `<number>` reads a boolean child so with `convertBoolean`, and a
 * `<math>` reads it through such a number, which writes `1` or `0` back as
 * `true` or `false`. A `<boolean>` reads a text as the word `true` or `false`
 * with `_textAsWord`. A component that is missing makes `wrapper` missing.
 */
function wrapAsWrittenType({
    wrapper,
    wrapped,
    componentInfoObjects,
    nComponents,
    stateIdInfo,
}) {
    const isOfType = (componentType, baseComponentType) =>
        componentInfoObjects.isInheritedComponentType({
            inheritedComponentType: componentType,
            baseComponentType,
        });
    if (
        typeof wrapped === "object" &&
        (wrapped.doenetAttributes?.missing ||
            wrapped.componentType === "_missing")
    ) {
        // A tag made from what is missing is missing (D37): the component a
        // composite holds, missing while its value does not convert (a
        // `<point extend="$cc[1]"/>` while that is no tuple), is missing as
        // the vector it is extended as.
        wrapper.doenetAttributes = {
            ...wrapper.doenetAttributes,
            missing: true,
        };
        wrapper.children = [];
        return { nComponents };
    }
    // Missing while what it holds is (D37): `<math extend="$n"/>` of
    // `<number name="n">$l[$i]</number>` while the index names nothing.
    wrapper.doenetAttributes = {
        ...wrapper.doenetAttributes,
        missingWhenContentMissing: true,
    };
    const convertBoolean = {
        type: "primitive",
        name: "convertBoolean",
        primitive: { type: "boolean", value: true },
    };

    if (
        typeof wrapped === "object" &&
        isOfType(wrapped.componentType, "text") &&
        isOfType(wrapper.componentType, "boolean")
    ) {
        // read as the word `true` or `false`
        wrapper.attributes._textAsWord = {
            type: "primitive",
            name: "_textAsWord",
            primitive: { type: "boolean", value: true },
        };
        wrapper.children = [wrapped];
        return { nComponents };
    }
    if (
        typeof wrapped === "object" &&
        isOfType(wrapped.componentType, "boolean")
    ) {
        if (isOfType(wrapper.componentType, "number")) {
            wrapper.attributes.convertBoolean = convertBoolean;
            wrapper.children = [wrapped];
            return { nComponents };
        }
        if (
            isOfType(wrapper.componentType, "math") &&
            !isOfType(wrapper.componentType, "coords")
        ) {
            wrapper.children = [
                {
                    componentType: "number",
                    componentIdx: nComponents++,
                    stateId: `${stateIdInfo.prefix}${stateIdInfo.num++}`,
                    attributes: { convertBoolean },
                    doenetAttributes: {},
                    state: {},
                    children: [wrapped],
                },
            ];
            return { nComponents };
        }
    }

    wrapper.children = [wrapped];
    return { nComponents };
}

export function calculateReplacementTypesFromChanges(
    component,
    replacementChanges,
) {
    let replacementsToWithhold = component.replacementsToWithhold;
    let replacementTypes = component.replacements.map((x) => x.componentType);

    // apply any replacement changes to replacementTypes and replacementsToWithhold
    for (const change of replacementChanges) {
        if (change.changeType === "add") {
            if (change.replacementsToWithhold !== undefined) {
                replacementsToWithhold = change.replacementsToWithhold;
            }

            if (!change.changeTopLevelReplacements) {
                continue;
            }

            if (change.serializedReplacements) {
                let numberToDelete = change.numberReplacementsToReplace;
                if (!(numberToDelete > 0)) {
                    numberToDelete = 0;
                }

                const firstIndex = change.firstReplacementInd;

                const newTypes = change.serializedReplacements.map(
                    (x) => x.componentType,
                );

                replacementTypes.splice(
                    firstIndex,
                    numberToDelete,
                    ...newTypes,
                );
            }
        } else if (change.changeType === "delete") {
            if (change.replacementsToWithhold !== undefined) {
                replacementsToWithhold = change.replacementsToWithhold;
            }

            if (change.changeTopLevelReplacements) {
                const firstIndex = change.firstReplacementInd;
                const numberToDelete = change.numberReplacementsToDelete;
                replacementTypes.splice(firstIndex, numberToDelete);
            }
        } else if (change.changeType === "changeReplacementsToWithhold") {
            if (change.replacementsToWithhold !== undefined) {
                replacementsToWithhold = change.replacementsToWithhold;
            }
        } else if (change.changeType === "rearrangeReplacements") {
            // The same replacements in a new order, so the types travel
            // with the components and are permuted rather than recalculated.
            //
            // Nothing reaches this branch today: `<sort>` is the only source
            // of the change, and it does not run its changes through
            // `verifyReplacementsMatchSpecifiedType`. It is here so that this
            // function covers every change type a composite can emit rather
            // than silently leaving the types in the old order.
            const numActive =
                replacementTypes.length - (replacementsToWithhold ?? 0);
            const activeTypes = replacementTypes.slice(0, numActive);

            replacementTypes = [
                ...change.arrangement.map((ind) => activeTypes[ind]),
                ...replacementTypes.slice(numActive),
            ];
        }
    }

    if (replacementsToWithhold > 0) {
        replacementTypes = replacementTypes.slice(
            0,
            replacementTypes.length - replacementsToWithhold,
        );
    }
    return { replacementTypes, replacementsToWithhold };
}

/**
 * If there is a single replacement and the copy has `_createComponentName` or `_createComponentIdx`,
 * then add the name or component index to the replacement
 */
export function addAttributesToSingleReplacement(
    replacements,
    component,
    componentInfoObjects,
) {
    if (replacements.length === 1 && typeof replacements[0] === "object") {
        // If the replacement is a group or copy that was created by verify replacements
        // where it received the `_createComponentIdx` attribute from the copy already,
        // then don't also give it the name and index
        if (
            replacements[0].componentType === "group" ||
            replacements[0].componentType === "_copy"
        ) {
            if (replacements[0].attributes?._createComponentIdx != null) {
                return;
            }
        }

        if (
            component.attributes._createComponentName?.primitive.value !=
            undefined
        ) {
            replacements[0].attributes.name = {
                type: "primitive",
                name: "name",
                primitive: {
                    type: "string",
                    value: component.attributes._createComponentName.primitive
                        .value,
                },
            };
        }
        if (
            component.attributes._createComponentIdx?.primitive.value !=
            undefined
        ) {
            const prevComponentIdx = replacements[0].componentIdx;
            const newComponentIdx =
                component.attributes._createComponentIdx.primitive.value;

            substituteComponentIdx(
                replacements,
                prevComponentIdx,
                newComponentIdx,
            );
        }
    }
}

/**
 * Recurse through all `components` and substitute `newComponentIdx` for `prevComponentIdx`,
 * both for a component's `componentIdx` and also for any `nodeIdx` or `nodesInResolvedPath` entry
 * in an `extending` attribute.
 *
 * The `nodesInResolvedPath` entries matter for the origin of a reference in the replacement's attributes,
 * which is the replacement itself (see `convertRefsToCopies`). Left unsubstituted, that reference would be resolved
 * from a component that does not exist.
 */
function substituteComponentIdx(components, prevComponentIdx, newComponentIdx) {
    for (const component of components) {
        if (typeof component === "string") {
            continue;
        }

        if (component.componentIdx === prevComponentIdx) {
            component.componentIdx = newComponentIdx;
        }

        if (component.extending) {
            const refResolution = unwrapSource(component.extending);
            if (refResolution.nodeIdx === prevComponentIdx) {
                refResolution.nodeIdx = newComponentIdx;
            }
            refResolution.nodesInResolvedPath =
                refResolution.nodesInResolvedPath.map((idx) =>
                    idx === prevComponentIdx ? newComponentIdx : idx,
                );
        }

        substituteComponentIdx(
            component.children,
            prevComponentIdx,
            newComponentIdx,
        );

        for (const attrName in component.attributes) {
            const attribute = component.attributes[attrName];
            if (attribute.type === "component") {
                substituteComponentIdx(
                    [attribute.component],
                    prevComponentIdx,
                    newComponentIdx,
                );
            } else if (attribute.type === "expression") {
                // references the component resolves itself, from itself
                for (const { refResolution } of attribute.slots) {
                    if (refResolution.nodeIdx === prevComponentIdx) {
                        refResolution.nodeIdx = newComponentIdx;
                    }
                    refResolution.nodesInResolvedPath =
                        refResolution.nodesInResolvedPath.map((idx) =>
                            idx === prevComponentIdx ? newComponentIdx : idx,
                        );
                }
            }
        }
    }
}

/** If, after changes, we have a single component that has a componentName and componentIdx
 * given by the Copy, then assign those to the replacement
 * We have dealt just with the special case that we arrive at one replacement with a single "add" change.
 * We could generalize if we need to.
 */
export function addAttributesToSingleReplacementChange(
    component,
    replacementChanges,
    componentInfoObjects,
) {
    const { replacementTypes, replacementsToWithhold } =
        calculateReplacementTypesFromChanges(component, replacementChanges);
    if (replacementTypes.length === 1 && !(replacementsToWithhold > 0)) {
        if (
            replacementChanges.length === 1 &&
            replacementChanges[0].changeType === "add" &&
            replacementChanges[0].serializedReplacements.length === 1 &&
            typeof replacementChanges[0].serializedReplacements[0] === "object"
        ) {
            const theNewReplacement =
                replacementChanges[0].serializedReplacements[0];

            // If the replacement is a group/_copy that was created by verify replacements
            // where it received the `_createComponentIdx` attribute from the copy already,
            // then don't also give it the name and index
            if (
                theNewReplacement.componentType === "group" ||
                theNewReplacement.componentType === "_copy"
            ) {
                if (theNewReplacement.attributes?._createComponentIdx != null) {
                    return;
                }
            }

            if (
                component.attributes._createComponentName?.primitive.value !=
                undefined
            ) {
                theNewReplacement.attributes.name = {
                    type: "primitive",
                    name: "name",
                    primitive: {
                        type: "string",
                        value: component.attributes._createComponentName
                            .primitive.value,
                    },
                };
            }
            if (
                component.attributes._createComponentIdx?.primitive.value !=
                undefined
            ) {
                theNewReplacement.componentIdx =
                    component.attributes._createComponentIdx.primitive.value;
            }
        }
    }
}

/**
 * When a Copy/Ref with no explicit prop is a descendant of its own source
 * component (a self-referential copy), serializing the source throws. In a
 * recognized rendering context we fall back to the source's `value` state
 * variable instead of showing an error — but only when `value` is typed as
 * `math` or `text` (or a component that inherits from one of those).
 *
 * The recognized contexts are any ancestor that inherits from:
 * label, text, math, m, md, boolean, number, mathList, numberList,
 * textList, or booleanList.
 *
 * Transparent composites (treatAsComponentForRecursiveReplacements, e.g.
 * <group>) are walked through; any other ancestor type stops the search.
 *
 * Returns `"value"` if the fallback applies, otherwise `undefined`.
 */
export function getSelfReferentialFallbackPropName({
    componentAncestors,
    componentInfoObjects,
    replacementSourceComponentType,
}) {
    // Determine whether we're inside a recognized rendering context.
    let inRecognizedContext = false;
    for (const ancestor of componentAncestors) {
        const ancestorClass = ancestor.componentClass;
        const ancestorType = ancestorClass.componentType;
        if (
            [
                "label",
                "text",
                "math",
                "m",
                "md",
                "boolean",
                "number",
                "mathList",
                "numberList",
                "textList",
                "booleanList",
            ].some((base) =>
                componentInfoObjects.isInheritedComponentType({
                    inheritedComponentType: ancestorType,
                    baseComponentType: base,
                }),
            )
        ) {
            inRecognizedContext = true;
            break;
        }
        // Only continue through transparent composites (e.g. <group>).
        if (!ancestorClass.treatAsComponentForRecursiveReplacements) {
            break;
        }
    }

    if (!inRecognizedContext) {
        return undefined;
    }

    // Look up the `value` state variable on the source component.
    // `value` may be a direct public var or an alias to another var.
    const publicVarInfo =
        componentInfoObjects.publicStateVariableInfo[
            replacementSourceComponentType
        ];
    if (!publicVarInfo) {
        return undefined;
    }

    // Resolve alias if needed: Point's `value` aliases `coords`, etc.
    let valueType =
        publicVarInfo.stateVariableDescriptions?.value?.createComponentOfType;
    if (valueType === undefined && publicVarInfo.aliases?.value) {
        const aliasTarget = publicVarInfo.aliases.value.target;
        valueType =
            publicVarInfo.stateVariableDescriptions?.[aliasTarget]
                ?.createComponentOfType;
    }

    if (!valueType) {
        return undefined;
    }

    // Use `value` only when it is math- or text-typed (including subtypes like
    // coords, which inherits from math). Math and text can adapt to each other,
    // so no context-specific preference is needed.
    if (
        componentInfoObjects.isInheritedComponentType({
            inheritedComponentType: valueType,
            baseComponentType: "math",
        }) ||
        componentInfoObjects.isInheritedComponentType({
            inheritedComponentType: valueType,
            baseComponentType: "text",
        })
    ) {
        return "value";
    }

    return undefined;
}
