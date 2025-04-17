import { getUniqueIdentifierFromBase } from "@doenet/utils";
import {
    applyMacros,
    applySugar,
    componentFromAttribute,
    removeBlankStringChildren,
} from "./expandDoenetML";
import { processAssignNames } from "./naming";

export function postProcessCopy({
    serializedComponents,
    componentIdx,
    addShadowDependencies = true,
    markAsPrimaryShadow = false,
    uniqueIdentifiersUsed = [],
    identifierPrefix = "",
    unlinkExternalCopies = false,
    copiesByTargetComponentName = {},
    componentNamesFound = [],
    assignNamesFound = [],
    activeAliases = [],
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

        let uniqueIdentifierBase;
        if (component.originalIdx) {
            if (unlinkExternalCopies) {
                componentNamesFound.push(component.originalIdx);
                if (
                    component.originalDoenetAttributes &&
                    component.originalDoenetAttributes.assignNames
                ) {
                    for (let cIdx of component.originalDoenetAttributes
                        .assignNames) {
                        componentNamesFound.push(cIdx);
                        assignNamesFound.push(cIdx);
                    }
                }
                if (component.attributes) {
                    if (component.attributes.alias) {
                        activeAliases.push(
                            component.attributes.alias.primitive,
                        );
                    }
                    if (component.attributes.indexAlias) {
                        activeAliases.push(
                            component.attributes.indexAlias.primitive,
                        );
                    }
                }
            }

            // preserializedNamesFound[component.originalIdx] = component;
            uniqueIdentifierBase =
                identifierPrefix + component.originalIdx + "|shadow";

            if (!component.originalNameFromSerializedComponent) {
                // if originalNameFromSerializedComponent, then was copied from a serialized component
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
                }
            }
        } else {
            uniqueIdentifierBase =
                identifierPrefix + component.componentType + "|shadowUnnamed";
        }

        if (component.componentType === "copy" && unlinkExternalCopies) {
            let targetComponentIdx =
                component.doenetAttributes.targetComponentIdx;
            if (!targetComponentIdx) {
                if (!component.attributes.uri) {
                    throw Error(
                        "we need to create a targetComponentIdx here, then.",
                    );
                }
            } else {
                if (activeAliases.includes(component.doenetAttributes.target)) {
                    // TODO: is the this right thing to do?
                    // Not clear if following the same rules for when a match would override an alias
                    // Setting targetComponentIdx to a relative name presumably prevents the targetComponentIdx
                    // from ever matching anything.  Is that what we want?
                    component.doenetAttributes.targetComponentIdx =
                        component.doenetAttributes.target;
                } else {
                    // don't create if matches an alias
                    if (
                        copiesByTargetComponentName[targetComponentIdx] ===
                        undefined
                    ) {
                        copiesByTargetComponentName[targetComponentIdx] = [];
                    }
                    copiesByTargetComponentName[targetComponentIdx].push(
                        component,
                    );
                }
            }
        }

        component.uniqueIdentifier = getUniqueIdentifierFromBase(
            uniqueIdentifierBase,
            uniqueIdentifiersUsed,
        );
    }

    // recurse after processing all components
    // so that first gather all active aliases

    for (let ind in serializedComponents) {
        let component = serializedComponents[ind];
        if (typeof component !== "object") {
            continue;
        }

        postProcessCopy({
            serializedComponents: component.children,
            componentIdx,
            addShadowDependencies,
            markAsPrimaryShadow,
            uniqueIdentifiersUsed,
            identifierPrefix,
            unlinkExternalCopies,
            copiesByTargetComponentName,
            componentNamesFound,
            assignNamesFound,
            activeAliases: [...activeAliases], // don't add values from children
            init: false,
        });

        for (let attrName in component.attributes) {
            let attribute = component.attributes[attrName];
            if (attribute.component) {
                attribute.component = postProcessCopy({
                    serializedComponents: [attribute.component],
                    componentIdx,
                    addShadowDependencies,
                    markAsPrimaryShadow,
                    uniqueIdentifiersUsed,
                    identifierPrefix,
                    unlinkExternalCopies,
                    copiesByTargetComponentName,
                    componentNamesFound,
                    assignNamesFound,
                    activeAliases: [...activeAliases], // don't add values from children
                    init: false,
                })[0];
            }
        }

        if (component.replacements) {
            postProcessCopy({
                serializedComponents: component.replacements,
                componentIdx,
                addShadowDependencies,
                markAsPrimaryShadow,
                uniqueIdentifiersUsed,
                identifierPrefix,
                unlinkExternalCopies,
                copiesByTargetComponentName,
                componentNamesFound,
                assignNamesFound,
                activeAliases: [...activeAliases], // don't add values from children
                init: false,
            });
        }
    }

    // XXX: this doesn't work anymore with removing namespaces.
    // Determine what this is supposed to accomplish and recreate functionality
    if (init && unlinkExternalCopies) {
        for (let targetComponentIdx in copiesByTargetComponentName) {
            if (!componentNamesFound.includes(targetComponentIdx)) {
                let foundMatchViaAssignNames = false;
                for (let cIdx of assignNamesFound) {
                    let namespace = cIdx + "/";
                    let nSpaceLen = namespace.length;
                    if (
                        targetComponentIdx.substring(0, nSpaceLen) === namespace
                    ) {
                        foundMatchViaAssignNames = true;
                        break;
                    }
                }
                if (!foundMatchViaAssignNames) {
                    for (let copyComponent of copiesByTargetComponentName[
                        targetComponentIdx
                    ]) {
                        if (!copyComponent.attributes) {
                            copyComponent.attributes = {};
                        }
                        copyComponent.attributes.link = { primitive: false };
                        copyComponent.doenetAttributes.target =
                            copyComponent.doenetAttributes.targetComponentIdx;
                    }
                }
            }
        }
    }

    return serializedComponents;
}

export function convertAttributesForComponentType({
    attributes,
    componentType,
    componentInfoObjects,
    compositeAttributesObj = {},
    dontSkipAttributes = [],
}) {
    let errors = [];
    let warnings = [];

    let newClass = componentInfoObjects.allComponentClasses[componentType];
    let newAttributesObj = newClass.createAttributesObject();
    let attributeLowerCaseMapping = {};
    for (let propName in newAttributesObj) {
        attributeLowerCaseMapping[propName.toLowerCase()] = propName;
    }

    let newAttributes = {};

    for (let attrName in attributes) {
        if (
            attrName in compositeAttributesObj &&
            !compositeAttributesObj[attrName].leaveRaw &&
            !dontSkipAttributes.includes(attrName)
        ) {
            // skip any attributes in the composite itself
            // unless specifically marked to not be processed for the composite
            // or argument is passed in to not skip
            continue;
        }

        let propName = attributeLowerCaseMapping[attrName.toLowerCase()];
        let attrObj = newAttributesObj[propName];
        if (attrObj) {
            if (propName in newAttributes) {
                throw Error(`Cannot repeat prop ${propName}`);
            }

            let res = componentFromAttribute({
                attrObj,
                value: JSON.parse(JSON.stringify(attributes[attrName])),
                componentInfoObjects,
            });
            newAttributes[propName] = res.attribute;
            errors.push(...res.errors);
            warnings.push(...res.warnings);

            if (newAttributes[propName].component?.children) {
                let serializedComponents = [newAttributes[propName].component];

                applyMacros(serializedComponents, componentInfoObjects);

                removeBlankStringChildren(
                    serializedComponents,
                    componentInfoObjects,
                );

                applySugar({
                    serializedComponents,
                    componentInfoObjects,
                    isAttributeComponent: true,
                });
            }
        } else if (newClass.acceptAnyAttribute) {
            newAttributes[attrName] = JSON.parse(
                JSON.stringify(attributes[attrName]),
            );
        }
    }

    return newAttributes;
}

export async function verifyReplacementsMatchSpecifiedType({
    component,
    replacements,
    replacementChanges,
    assignNames,
    workspace = {},
    componentInfoObjects,
    compositeAttributesObj,
    components,
    publicCaseInsensitiveAliasSubstitutions,
}) {
    let errors = [];
    let warnings = [];

    if (
        !component.attributes.createComponentOfType?.primitive &&
        !component.sharedParameters.compositesMustHaveAReplacement
    ) {
        return { replacements, replacementChanges, errors, warnings };
    }

    let replacementsToWithhold = component.replacementsToWithhold;
    let replacementTypes;

    if (!replacementChanges) {
        // if have a group, filter out blank strings
        if (
            componentInfoObjects.isInheritedComponentType({
                inheritedComponentType: component.componentType,
                baseComponentType: "group",
            })
        ) {
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
    } else {
        replacementTypes = component.replacements.map((x) => x.componentType);

        // apply any replacement changes to replacementTypes and replacementsToWithhold
        for (let change of replacementChanges) {
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

                    let firstIndex = change.firstReplacementInd;

                    let newTypes = change.serializedReplacements.map(
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
                    let firstIndex = change.firstReplacementInd;
                    let numberToDelete = change.numberReplacementsToDelete;
                    replacementTypes.splice(firstIndex, numberToDelete);
                }
            } else if (change.changeType === "changeReplacementsToWithhold") {
                if (change.replacementsToWithhold !== undefined) {
                    replacementsToWithhold = change.replacementsToWithhold;
                }
            }
        }
    }

    if (replacementsToWithhold > 0) {
        replacementTypes = replacementTypes.slice(
            0,
            replacementTypes.length - replacementsToWithhold,
        );
    }

    if (
        !component.attributes.createComponentOfType?.primitive &&
        component.sharedParameters.compositesMustHaveAReplacement &&
        replacementTypes.length > 0
    ) {
        // no changes since only reason we got this far was that
        // composites must have a replacement
        // and we have at least one replacement
        return { replacements, replacementChanges, errors, warnings };
    }

    let requiredComponentType =
        component.attributes.createComponentOfType?.primitive;

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
        !replacementTypes.every((x) => x === requiredComponentType)
    ) {
        // console.warn(`Replacements from ${component.componentType} ${component.componentIdx} do not match the specified createComponentOfType and numComponents`);

        // if only replacement is a group
        // then give the group the createComponentOfType and numComponentsSpecified
        if (
            replacements?.length === 1 &&
            componentInfoObjects.isInheritedComponentType({
                inheritedComponentType: replacements[0].componentType,
                baseComponentType: "group",
            })
        ) {
            if (!replacements[0].attributes) {
                replacements[0].attributes = {};
            }
            replacements[0].attributes.createComponentOfType = {
                primitive: requiredComponentType,
            };
            replacements[0].attributes.numComponents = {
                primitive: requiredLength,
            };
            return { replacements, replacementChanges, errors, warnings };
        }

        // if the only discrepancy is the components are the wrong type,
        // with number of sources matching the number of components
        // then wrap each replacement with a blank component we are creating,
        // i.e., add each current replacement as the child of a new component

        let wrapExistingReplacements =
            replacementTypes.length === requiredLength &&
            !(replacementsToWithhold > 0) &&
            workspace.sourceNames?.length === requiredLength;

        // let uniqueIdentifiersUsed;
        let originalReplacements;

        if (wrapExistingReplacements && replacementChanges) {
            // if we have replacement changes, we can wrap only if we are replacing all components
            // in a single add
            if (
                replacementChanges.length === 1 &&
                replacementChanges[0].numberReplacementsToReplace ===
                    requiredLength
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
            workspace.sourceNames = [];
            workspace.uniqueIdentifiersUsedBySource = {};

            workspace.uniqueIdentifiersUsedBySource[0] = [];
            // uniqueIdentifiersUsed = workspace.uniqueIdentifiersUsedBySource[0] = [];
        }

        replacements = [];
        for (let i = 0; i < requiredLength; i++) {
            let attributesFromComposite = convertAttributesForComponentType({
                attributes: component.attributes,
                componentType: requiredComponentType,
                componentInfoObjects,
                compositeAttributesObj,
            });

            let uniqueIdentifierBase = requiredComponentType + "|empty" + i;
            let uniqueIdentifier = getUniqueIdentifierFromBase(
                uniqueIdentifierBase,
                workspace.uniqueIdentifiersUsedBySource[0],
            );
            replacements.push({
                componentType: requiredComponentType,
                attributes: attributesFromComposite,
                uniqueIdentifier,
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
        if (replacementTypes.length === 0 && requiredLength === 1) {
            let targetInactive = await component.stateValues.targetInactive;

            let propName = (
                await component.stateValues.effectivePropNameBySource
            )?.[0];

            if (propName && !targetInactive) {
                let replacementSources =
                    await component.stateValues.replacementSourceIdentities;

                if (replacementSources === undefined) {
                    // check if based on extract
                    replacementSources =
                        await component.stateValues.sourceComponents;
                }

                let replacementSource = replacementSources[0];

                let target = components[replacementSource.componentIdx];

                let propVariable = publicCaseInsensitiveAliasSubstitutions({
                    stateVariables: [propName],
                    componentClass: target.constructor,
                })[0];

                let stateVarObj = target.state[propVariable];
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
                        arrayKeys = arrayStateVarObj.getArrayKeysFromVarName({
                            arrayEntryPrefix: stateVarObj.entryPrefix,
                            varEnding: stateVarObj.varEnding,
                            numDimensions: arrayStateVarObj.numDimensions,
                        });
                    }

                    // want the prop variable corresponding to just the first entry
                    // of the array or the array entry
                    propVariable = arrayStateVarObj.arrayVarNameFromArrayKey(
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

        if (wrapExistingReplacements) {
            for (let [ind, repl] of replacements.entries()) {
                repl.children = [originalReplacements[ind]];
            }
        }

        let processResult = processAssignNames({
            assignNames,
            serializedComponents: replacements,
            parentIdx: component.componentIdx,
            componentInfoObjects,
        });
        errors.push(...processResult.errors);
        warnings.push(...processResult.warnings);

        replacements = processResult.serializedComponents;

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

    return { replacements, replacementChanges, errors, warnings };
}

export function renameAutonameBasedOnNewCounts(
    serializedComponents,
    newComponentCounts = {},
) {
    let componentCounts = { ...newComponentCounts };

    for (let serializedComponent of serializedComponents) {
        if (typeof serializedComponent === "object") {
            let componentType = serializedComponent.componentType;

            let count = componentCounts[componentType];
            if (count === undefined) {
                count = 0;
            }

            let doenetAttributes = serializedComponent.doenetAttributes;

            // if created from a attribute/sugar/macro, don't include in component counts
            if (
                !(
                    doenetAttributes?.isAttributeChildFor ||
                    doenetAttributes?.createdFromSugar ||
                    doenetAttributes?.createdFromMacro ||
                    doenetAttributes?.excludeFromComponentCounts
                )
            ) {
                componentCounts[componentType] = ++count;

                // check if name was created from counting components

                if (serializedComponent.componentIdx) {
                    let lastSlash =
                        serializedComponent.componentIdx.lastIndexOf("/");
                    let originalIdx =
                        serializedComponent.componentIdx.substring(
                            lastSlash + 1,
                        );
                    let nameStartFromComponentType =
                        "_" + componentType.toLowerCase();
                    if (
                        originalIdx.substring(
                            0,
                            nameStartFromComponentType.length,
                        ) === nameStartFromComponentType
                    ) {
                        // recreate using new count
                        serializedComponent.componentIdx =
                            serializedComponent.componentIdx.substring(
                                0,
                                lastSlash + 1,
                            ) +
                            nameStartFromComponentType +
                            count;
                    }
                }
            }

            if (serializedComponent.children) {
                // recurse to children
                componentCounts = renameAutonameBasedOnNewCounts(
                    serializedComponent.children,
                    componentCounts,
                );
            }
        }
    }

    return componentCounts;
}

// XXX: this function was used to keep reference external copies from reaching outside.
// Determine how to recreating this restriction

export function restrictTNamesToNamespace({
    components,
    namespace,
    parentNamespace,
    parentIsCopy = false,
    invalidateReferencesToBaseNamespace = false,
}) {
    if (parentNamespace === undefined) {
        parentNamespace = namespace;
    }

    let nSpace = namespace.length;

    for (let component of components) {
        if (component.doenetAttributes && component.doenetAttributes.target) {
            let target = component.doenetAttributes.target;

            if (target[0] === "/") {
                if (target.substring(0, nSpace) !== namespace) {
                    // if left part of target matches the left part of the namespace, delete matched part from larget
                    // else if left part of target matches the right part of the namespace, delete matched part

                    let namespaceParts = namespace.split("/").slice(1);
                    let targetParts = target.split("/").slice(1);
                    let foundAMatch = false;
                    let targetComponentIdx = namespace + target.slice(1);

                    while (
                        namespaceParts.length > 0 &&
                        namespaceParts[0] === targetParts[0]
                    ) {
                        namespaceParts = namespaceParts.slice(1);
                        targetParts = targetParts.slice(1);
                        foundAMatch = true;
                    }

                    if (foundAMatch) {
                        targetComponentIdx = namespace + targetParts.join("/");
                    } else {
                        let namespaceParts = namespace.split("/").slice(1);
                        for (let ind = 1; ind < namespaceParts.length; ind++) {
                            let namespacePiece =
                                "/" + namespaceParts.slice(ind).join("/");
                            if (
                                target.substring(0, namespacePiece.length) ===
                                namespacePiece
                            ) {
                                targetComponentIdx =
                                    "/" +
                                    namespaceParts.slice(0, ind).join("/") +
                                    target;
                                break;
                            }
                        }
                    }

                    component.doenetAttributes.target = targetComponentIdx;
                    component.doenetAttributes.targetComponentIdx =
                        targetComponentIdx;
                } else if (invalidateReferencesToBaseNamespace) {
                    let lastSlash = target.lastIndexOf("/");
                    if (target.slice(0, lastSlash + 1) === namespace) {
                        component.doenetAttributes.target = "";
                        component.doenetAttributes.targetComponentIdx = "";
                    }
                }
            } else if (target.substring(0, 3) === "../") {
                let tNamePart = target;
                let namespacePart = parentNamespace;
                while (tNamePart.substring(0, 3) === "../") {
                    tNamePart = tNamePart.substring(3);
                    let lastSlash = namespacePart
                        .substring(0, namespacePart.length - 1)
                        .lastIndexOf("/");
                    namespacePart = namespacePart.substring(0, lastSlash + 1);
                    if (namespacePart.substring(0, nSpace) !== namespace) {
                        while (tNamePart.substring(0, 3) === "../") {
                            tNamePart = tNamePart.substring(3);
                        }

                        let targetComponentIdx = namespace + tNamePart;
                        component.doenetAttributes.target = targetComponentIdx;
                        component.doenetAttributes.targetComponentIdx =
                            targetComponentIdx;
                        break;
                    }
                }
                if (invalidateReferencesToBaseNamespace) {
                    let targetComponentIdx =
                        component.doenetAttributes.targetComponentIdx;
                    let lastSlash = targetComponentIdx.lastIndexOf("/");
                    if (
                        targetComponentIdx.slice(0, lastSlash + 1) === namespace
                    ) {
                        component.doenetAttributes.target = "";
                        component.doenetAttributes.targetComponentIdx = "";
                    }
                }
            }
        }

        if (component.children) {
            let adjustedNamespace = namespace;
            if (parentIsCopy && component.componentType === "externalContent") {
                // if have a external content inside a copy,
                // then restrict children to the namespace of the externalContent
                adjustedNamespace = component.componentIdx + "/";
            }
            let namespaceForChildren = parentNamespace;
            if (
                component.attributes &&
                component.attributes.newNamespace?.primitive
            ) {
                namespaceForChildren = component.componentIdx;
            }
            restrictTNamesToNamespace({
                components: component.children,
                namespace: adjustedNamespace,
                parentNamespace: namespaceForChildren,
                parentIsCopy: component.componentType === "copy",
                invalidateReferencesToBaseNamespace,
            });
        }
        if (component.attributes) {
            for (let attrName in component.attributes) {
                let attribute = component.attributes[attrName];
                if (attribute.component) {
                    restrictTNamesToNamespace({
                        components: [attribute.component],
                        namespace,
                        parentNamespace,
                        invalidateReferencesToBaseNamespace,
                    });
                } else if (attribute.childrenForFutureComponent) {
                    restrictTNamesToNamespace({
                        components: attribute.childrenForFutureComponent,
                        namespace,
                        parentNamespace,
                        invalidateReferencesToBaseNamespace,
                    });
                }
            }
        }
    }
}
