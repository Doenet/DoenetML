import { parseAndCompile } from "@doenet/parser";
import {
    retrieveTextFileForCid,
    deepClone,
    returnDeprecationMessage,
    convertToErrorComponent,
    createUniqueName,
} from "@doenet/utils";

export async function expandDoenetMLsToFullSerializedComponents({
    doenetMLs,
    componentInfoObjects,
    nPreviousDoenetMLs = 0,
}) {
    let arrayOfSerializedComponents = [];
    let cidComponents = {};
    let allDoenetMLs = [...doenetMLs];
    let errors = [];
    let warnings = [];

    for (let [ind, doenetML] of doenetMLs.entries()) {
        let errorsForDoenetML = [];
        let warningsForDoenetML = [];
        let result = parseAndCompile(doenetML);
        let serializedComponents = result.components;
        errorsForDoenetML.push(...result.errors);

        serializedComponents = cleanIfHaveJustDocument(serializedComponents);

        result = substituteAttributeDeprecations(serializedComponents);
        warningsForDoenetML.push(...result.warnings);

        temporarilyRenameSourceBackToTarget(serializedComponents);

        result = correctComponentTypeCapitalization(
            serializedComponents,
            componentInfoObjects,
        );
        errorsForDoenetML.push(...result.errors);
        warningsForDoenetML.push(...result.warnings);

        result = copyTargetOrFromURIAttributeCreatesCopyComponent(
            serializedComponents,
            componentInfoObjects.isCompositeComponent,
        );
        errorsForDoenetML.push(...result.errors);
        warningsForDoenetML.push(...result.warnings);

        result = createAttributesFromProps(
            serializedComponents,
            componentInfoObjects,
        );
        errorsForDoenetML.push(...result.errors);
        warningsForDoenetML.push(...result.warnings);

        result = breakUpTargetIntoPropsAndIndices(
            serializedComponents,
            componentInfoObjects,
        );
        errorsForDoenetML.push(...result.errors);
        warningsForDoenetML.push(...result.warnings);

        result = applyMacros(serializedComponents, componentInfoObjects);
        errorsForDoenetML.push(...result.errors);
        warningsForDoenetML.push(...result.warnings);

        result = substitutePropertyDeprecations(serializedComponents);
        warningsForDoenetML.push(...result.warnings);

        // remove blank string children after applying macros,
        // as applying macros could create additional blank string children
        removeBlankStringChildren(serializedComponents, componentInfoObjects);

        // remove comments after applying macros,
        // aswe need the comments in place while processing macros
        // to correctly calculate their position
        serializedComponents = removeComments(serializedComponents);

        decodeXMLEntities(serializedComponents);

        result = applySugar({ serializedComponents, componentInfoObjects });
        errorsForDoenetML.push(...result.errors);
        warningsForDoenetML.push(...result.warnings);

        arrayOfSerializedComponents.push(serializedComponents);

        let newContentComponents = findContentCopies({ serializedComponents });

        for (let cid in newContentComponents.cidComponents) {
            if (cidComponents[cid] === undefined) {
                cidComponents[cid] = [];
            }
            cidComponents[cid].push(...newContentComponents.cidComponents[cid]);
        }

        addDoenetMLIdToRange(serializedComponents, nPreviousDoenetMLs + ind);
        addDoenetMLIdToRange(errorsForDoenetML, nPreviousDoenetMLs + ind);
        addDoenetMLIdToRange(warningsForDoenetML, nPreviousDoenetMLs + ind);

        errors.push(...errorsForDoenetML);
        warnings.push(...warningsForDoenetML);
    }

    let cidList = Object.keys(cidComponents);
    if (cidList.length > 0) {
        // found copies with cids
        // so look up those cids
        // convert to doenetMLs, and recurse on those doenetMLs

        let { newDoenetMLs, newCids } = await cidsToDoenetMLs(cidList);

        // check to see if got the cids requested
        for (let [ind, cid] of cidList.entries()) {
            if (newCids[ind] && newCids[ind].substring(0, cid.length) !== cid) {
                return Promise.reject(
                    new Error(
                        `Requested cid ${cid} but got back ${newCids[ind]}!`,
                    ),
                );
            }
        }

        let expectedN = cidList.length;
        for (let ind = 0; ind < expectedN; ind++) {
            let cid = newCids[ind];
            if (!cid) {
                // wasn't able to retrieve content

                // Question: what condition will get to this line that doesn't throw an error
                // in the call to cidsToDoenetMLs, above?
                warnings.push({
                    message: `Unable to retrieve content with cid = ${cidList[ind]}`,
                    level: 1,
                    position: cidComponents[cid]?.[0]?.position,
                });
                newDoenetMLs[ind] = "";
            }
        }

        // recurse to additional doenetMLs
        let {
            fullSerializedComponents,
            allDoenetMLs: additionalDoenetMLs,
            errors: additionalErrors,
            warnings: additionalWarnings,
        } = await expandDoenetMLsToFullSerializedComponents({
            doenetMLs: newDoenetMLs,
            componentInfoObjects,
            nPreviousDoenetMLs: nPreviousDoenetMLs + doenetMLs.length,
        });

        allDoenetMLs.push(...additionalDoenetMLs);
        errors.push(...additionalErrors);
        warnings.push(...additionalWarnings);

        for (let [ind, cid] of cidList.entries()) {
            let serializedComponentsForCid = fullSerializedComponents[ind];

            for (let originalCopyWithUri of cidComponents[cid]) {
                if (originalCopyWithUri.children === undefined) {
                    originalCopyWithUri.children = [];
                }

                if (!originalCopyWithUri.doenetAttributes) {
                    originalCopyWithUri.doenetAttributes = {};
                }

                originalCopyWithUri.doenetAttributes.copiedURI = true;

                let originalChildren = JSON.parse(
                    JSON.stringify(serializedComponentsForCid),
                );

                // remove blank string children
                let nonBlankStringChildren = originalChildren.filter(
                    (x) => typeof x !== "string" || x.trim(),
                );

                let haveSingleComponent =
                    nonBlankStringChildren.length === 1 &&
                    typeof nonBlankStringChildren[0] === "object";

                let fromCopyFromURI =
                    originalCopyWithUri.doenetAttributes?.fromCopyFromURI;

                if (fromCopyFromURI || haveSingleComponent) {
                    if (fromCopyFromURI && !haveSingleComponent) {
                        warnings.push({
                            message:
                                "ignoring copyFromURI as it was not a single component",
                            position: originalCopyWithUri.position,
                            level: 1,
                        });
                    } else {
                        let comp = nonBlankStringChildren[0];

                        if (!comp.attributes) {
                            comp.attributes = {};
                        }

                        if (!originalCopyWithUri.doenetAttributes) {
                            originalCopyWithUri.doenetAttributes = {};
                        }

                        originalCopyWithUri.children = [
                            comp,
                            ...originalCopyWithUri.children,
                        ];

                        // Note: name of last child will get changed by assignName (or be given unique name if no assignNames)
                        // however, when first creating component names, need to keep its original name in case nay of its children reference it
                        // When assignNames, such references will be converted to newly assigned names
                        originalCopyWithUri.doenetAttributes.nameFirstChildIndependently = true;
                    }
                } else {
                    // XXX: fix copying external content without using namespaces
                    let extContent = {
                        componentType: "externalContent",
                        children: JSON.parse(
                            JSON.stringify(serializedComponentsForCid),
                        ),
                        doenetAttributes: { createUniqueName: true },
                    };

                    originalCopyWithUri.children = [
                        extContent,
                        ...originalCopyWithUri.children,
                    ];
                }
            }
        }
    }

    return {
        fullSerializedComponents: arrayOfSerializedComponents,
        allDoenetMLs,
        errors,
        warnings,
    };
}

function addDoenetMLIdToRange(serializedComponents, doenetMLId) {
    for (let component of serializedComponents) {
        if (component.position) {
            component.position.doenetMLId = doenetMLId;
        }
        if (component.children) {
            addDoenetMLIdToRange(component.children, doenetMLId);
        }
        if (component.attributes) {
            for (let attrName in component.attributes) {
                let comp = component.attributes[attrName].component;
                if (comp) {
                    addDoenetMLIdToRange([comp], doenetMLId);
                }
            }
        }
    }
}

function cidsToDoenetMLs(cids) {
    let promises = [];
    let newCids = cids;

    for (let cid of cids) {
        promises.push(retrieveTextFileForCid(cid, "doenet"));
    }

    return Promise.all(promises)
        .then((newDoenetMLs) => {
            // console.log({ newDoenetMLs, newCids })
            return Promise.resolve({ newDoenetMLs, newCids });
        })
        .catch((err) => {
            let message;
            if (newCids.length === 1) {
                message = `Could not retrieve cid ${newCids[0]}`;
            } else {
                message = `Could not retrieve cids ${newCids.join(",")}`;
            }

            message += ": " + err.message;

            console.error(message);

            return Promise.reject(new Error(message));
        });
}

export function removeBlankStringChildren(
    serializedComponents,
    componentInfoObjects,
) {
    for (let component of serializedComponents) {
        if (component.children) {
            let componentClass =
                componentInfoObjects.allComponentClasses[
                    component.componentType
                ];
            if (componentClass && !componentClass.includeBlankStringChildren) {
                component.children = component.children.filter(
                    (x) => typeof x !== "string" || x.trim() !== "",
                );
            }

            removeBlankStringChildren(component.children, componentInfoObjects);
        }

        // TODO: do we also need to remove blank string components
        // from childrenForFutureComponent of an attribute that is not yet a component?
        for (let attrName in component.attributes) {
            let comp = component.attributes[attrName].component;
            if (comp?.children) {
                removeBlankStringChildren([comp], componentInfoObjects);
            }
        }
    }
}

function removeComments(serializedComponents) {
    let filteredComponents = serializedComponents.filter(
        (x) => x.componentType !== "_comment",
    );
    for (let component of filteredComponents) {
        if (component.children) {
            component.children = removeComments(component.children);
        }

        for (let attrName in component.attributes) {
            let comp = component.attributes[attrName].component;
            if (comp?.children) {
                comp.children = removeComments(comp.children);
            }
        }
    }

    return filteredComponents;
}

function findContentCopies({ serializedComponents }) {
    let cidComponents = {};
    for (let serializedComponent of serializedComponents) {
        if (serializedComponent.componentType === "copy") {
            if (
                serializedComponent.attributes &&
                serializedComponent.attributes.uri
            ) {
                let uri = serializedComponent.attributes.uri.primitive;

                if (uri && uri.substring(0, 7).toLowerCase() === "doenet:") {
                    let result = uri.match(/[:&]cid=([^&]+)/i);
                    if (result) {
                        let cid = result[1];
                        if (cidComponents[cid] === undefined) {
                            cidComponents[cid] = [];
                        }
                        cidComponents[cid].push(serializedComponent);
                    }
                }
            }
        } else {
            if (serializedComponent.children !== undefined) {
                let results = findContentCopies({
                    serializedComponents: serializedComponent.children,
                });

                // append results on to cidComponents
                for (let cid in results.cidComponents) {
                    if (cidComponents[cid] === undefined) {
                        cidComponents[cid] = [];
                    }
                    cidComponents[cid].push(...results.cidComponents[cid]);
                }
            }
        }
    }
    return { cidComponents };
}

export function addDocumentIfItsMissing(serializedComponents) {
    if (
        serializedComponents.length !== 1 ||
        serializedComponents[0].componentType !== "document"
    ) {
        let components = serializedComponents.splice(0);
        serializedComponents.push({
            componentType: "document",
            children: components,
        });
    }
    return serializedComponents;
}

function substituteAttributeDeprecations(serializedComponents) {
    // Note: attributes are XML attributes
    // (which are called props at this point due to parser but will be renamed attributes later)
    // that are entered as attributes in the component tag

    let warnings = [];

    // Note: use lower case for keys
    let deprecatedAttributeSubstitutions = {
        tname: { substitute: "target", removeInVersion: 0.7 },
        triggerwithtnames: { substitute: "triggerWith", removeInVersion: 0.7 },
        updatewithtname: { substitute: "updateWith", removeInVersion: 0.7 },
        paginatortname: { substitute: "paginator", removeInVersion: 0.7 },
        randomizeorder: { substitute: "shuffleOrder", removeInVersion: 0.7 },
        copytarget: { substitute: "copySource", removeInVersion: 0.7 },
        triggerwithtargets: { substitute: "triggerWith", removeInVersion: 0.7 },
        triggerwhentargetsclicked: {
            substitute: "triggerWhenObjectsClicked",
            removeInVersion: 0.7,
        },
        fortarget: { substitute: "forObject", removeInVersion: 0.7 },
        targetattributestoignore: {
            substitute: "sourceAttributesToIgnore",
            removeInVersion: 0.7,
        },
        targetattributestoignorerecursively: {
            substitute: "sourceAttributesToIgnoreRecursively",
            removeInVersion: 0.7,
        },
        targetsareresponses: {
            substitute: "sourcesAreResponses",
            removeInVersion: 0.7,
        },
        updatewithtarget: { substitute: "updateWith", removeInVersion: 0.7 },
        targetsarefunctionsymbols: {
            substitute: "sourcesAreFunctionSymbols",
            removeInVersion: 0.7,
        },
        selectforvariantnames: {
            substitute: "selectForVariants",
            removeInVersion: 0.7,
        },
        numberdecimals: { substitute: "numDecimals", removeInVersion: 0.7 },
        numberdigits: { substitute: "numDigits", removeInVersion: 0.7 },
        ndimensions: { substitute: "numDimensions", removeInVersion: 0.7 },
        ninputs: { substitute: "numInputs", removeInVersion: 0.7 },
        noutputs: { substitute: "numOutputs", removeInVersion: 0.7 },
        niterates: { substitute: "numIterates", removeInVersion: 0.7 },
        nrows: { substitute: "numRows", removeInVersion: 0.7 },
        ncolumns: { substitute: "numColumns", removeInVersion: 0.7 },
        nvertices: { substitute: "numVertices", removeInVersion: 0.7 },
        npoints: { substitute: "numPoints", removeInVersion: 0.7 },
        nvariants: { substitute: "numVariants", removeInVersion: 0.7 },
        nsides: { substitute: "numSides", removeInVersion: 0.7 },
        niterationsrequired: {
            substitute: "numIterationsRequired",
            removeInVersion: 0.7,
        },
        numberofsamples: { substitute: "numSamples", removeInVersion: 0.7 },
        numbertoselect: { substitute: "numToSelect", removeInVersion: 0.7 },
        nawardscredited: {
            substitute: "numAwardsCredited",
            removeInVersion: 0.7,
        },
        maximumnumber: { substitute: "maxNumber", removeInVersion: 0.7 },
        nsignerrorsmatched: {
            substitute: "numSignErrorsMatched",
            removeInVersion: 0.7,
        },
        nperiodicsetmatchesrequired: {
            substitute: "numPeriodicSetMatchesRequired",
            removeInVersion: 0.7,
        },
        npages: { substitute: "numPages", removeInVersion: 0.7 },
    };

    // Note: use lower case
    let deprecatedAttributeDeletions = {
        suppressautoname: { removeInVersion: 0.7 },
        suppressautonumber: { removeInVersion: 0.7 },
        targetattributestoignorerecursively: { removeInVersion: 0.7 },
        sourceattributestoignorerecursively: { removeInVersion: 0.7 },
        showlabel: { removeInVersion: 0.7 },
        ignoredisplaydigits: { removeInVersion: 0.7 },
        ignoredisplaydecimals: { removeInVersion: 0.7 },
    };

    // Note: use lower case for keys
    let deprecatedAttributeSubstitutionsComponentSpecific = {
        copy: {
            target: { substitute: "source", removeInVersion: 0.7 },
            tname: { substitute: "source", removeInVersion: 0.7 },
        },
        collect: {
            target: { substitute: "source", removeInVersion: 0.7 },
            tname: { substitute: "source", removeInVersion: 0.7 },
        },
        summarystatistics: {
            target: { substitute: "source", removeInVersion: 0.7 },
        },
        answer: {
            maximumnumberofattempts: {
                substitute: "maxNumAttempts",
                removeInVersion: 0.7,
            },
        },
        bestfitline: {
            points: { substitute: "data", removeInVersion: 0.7 },
        },
    };

    // use lower case
    let deprecatedAttributeDeletionsComponentSpecific = {
        textinput: { size: { removeInVersion: 0.7 } },
        constraintogrid: { ignoregraphbounds: { removeInVersion: 0.7 } },
        attracttogrid: { ignoregraphbounds: { removeInVersion: 0.7 } },
        constraints: { baseongraph: { removeInVersion: 0.7 } },
        graph: {
            xlabel: { removeInVersion: 0.7 },
            ylabel: { removeInVersion: 0.7 },
            height: { removeInVersion: 0.7 },
        },
        image: { height: { removeInVersion: 0.7 } },
        video: { height: { removeInVersion: 0.7 } },
        conditionalcontent: { maximumnumbertoshow: { removeInVersion: 0.7 } },
        angle: { draggable: { removeInVersion: 0.7 } },
        answer: { supresstoast: { removeInVersion: 0.7 } },
    };

    for (let component of serializedComponents) {
        if (typeof component !== "object") {
            continue;
        }

        if (component.props) {
            let cType = component.componentType;
            let cTypeLower = cType.toLowerCase();
            let typeSpecificDeps =
                deprecatedAttributeSubstitutionsComponentSpecific[cTypeLower];
            if (!typeSpecificDeps) {
                typeSpecificDeps = {};
            }
            let typeSpecificDeletions =
                deprecatedAttributeDeletionsComponentSpecific[cTypeLower];
            if (!typeSpecificDeletions) {
                typeSpecificDeletions = {};
            }
            let retry = true;
            while (retry) {
                retry = false;
                for (let prop in component.props) {
                    let propLower = prop.toLowerCase();
                    if (propLower in typeSpecificDeps) {
                        let newProp = typeSpecificDeps[propLower].substitute;
                        let removeInVersion =
                            typeSpecificDeps[propLower].removeInVersion;

                        warnings.push({
                            message: `Attribute ${prop} of component type ${cType} is deprecated. Use ${newProp} instead. ${returnDeprecationMessage(
                                removeInVersion,
                            )}`,
                            position: component.position,
                            level: 1,
                        });

                        component.props[newProp] = component.props[prop];
                        delete component.props[prop];

                        // since modified object over which are looping
                        // break out of loop and start over
                        retry = true;
                        break;
                    } else if (propLower in deprecatedAttributeSubstitutions) {
                        let newProp =
                            deprecatedAttributeSubstitutions[propLower]
                                .substitute;
                        let removeInVersion =
                            deprecatedAttributeSubstitutions[propLower]
                                .removeInVersion;

                        warnings.push({
                            message: `Attribute ${prop} is deprecated. Use ${newProp} instead. ${returnDeprecationMessage(
                                removeInVersion,
                            )}`,
                            position: component.position,
                            level: 1,
                        });

                        component.props[newProp] = component.props[prop];
                        delete component.props[prop];

                        // since modified object over which are looping
                        // break out of loop and start over
                        retry = true;
                        break;
                    } else if (propLower in typeSpecificDeletions) {
                        let removeInVersion =
                            typeSpecificDeletions[propLower].removeInVersion;

                        warnings.push({
                            message: `Attribute ${prop} of component type ${cType} is deprecated. It is ignored. ${returnDeprecationMessage(
                                removeInVersion,
                            )}`,
                            position: component.position,
                            level: 1,
                        });

                        delete component.props[prop];

                        // since modified object over which are looping
                        // break out of loop and start over
                        retry = true;
                        break;
                    } else if (propLower in deprecatedAttributeDeletions) {
                        let removeInVersion =
                            deprecatedAttributeDeletions[propLower]
                                .removeInVersion;

                        warnings.push({
                            message: `Attribute ${prop} is deprecated. It is ignored. ${returnDeprecationMessage(
                                removeInVersion,
                            )}`,
                            position: component.position,
                            level: 1,
                        });

                        delete component.props[prop];

                        // since modified object over which are looping
                        // break out of loop and start over
                        retry = true;
                        break;
                    }
                }
            }
        }

        if (component.children) {
            let res = substituteAttributeDeprecations(component.children);
            warnings.push(...res.warnings);
        }
    }

    return { warnings };
}

export const deprecatedPropertySubstitutions = {
    maximumNumberOfAttempts: {
        substitute: "maxNumAttempts",
        removeInVersion: 0.7,
    },
    numberFeedbacks: { substitute: "numFeedbacks", removeInVersion: 0.7 },
    numberOfAttemptsLeft: {
        substitute: "numAttemptsLeft",
        removeInVersion: 0.7,
    },
    nSubmissions: { substitute: "numSubmissions", removeInVersion: 0.7 },
    nSubmittedResponses: {
        substitute: "numSubmittedResponses",
        removeInVersion: 0.7,
    },
    nAwardsCredited: { substitute: "numAwardsCredited", removeInVersion: 0.7 },
    numberChoices: { substitute: "numChoices", removeInVersion: 0.7 },
    numberMinima: { substitute: "numMinima", removeInVersion: 0.7 },
    numberMaxima: { substitute: "numMaxima", removeInVersion: 0.7 },
    numberExtrema: { substitute: "numExtrema", removeInVersion: 0.7 },
    numberDecimals: { substitute: "numDecimals", removeInVersion: 0.7 },
    numberDigits: { substitute: "numDigits", removeInVersion: 0.7 },
    numberOfSamples: { substitute: "numSamples", removeInVersion: 0.7 },
    numberToSelect: { substitute: "numToSelect", removeInVersion: 0.7 },
    numberSolutions: { substitute: "numSolutions", removeInVersion: 0.7 },
    maximumNumber: { substitute: "maxNumber", removeInVersion: 0.7 },
    nVertices: { substitute: "numVertices", removeInVersion: 0.7 },
    nPoints: { substitute: "numPoints", removeInVersion: 0.7 },
    nSignErrorsMatched: {
        substitute: "numSignErrorsMatched",
        removeInVersion: 0.7,
    },
    nPeriodicSetMatchesRequired: {
        substitute: "numPeriodicSetMatchesRequired",
        removeInVersion: 0.7,
    },
    nValues: { substitute: "numValues", removeInVersion: 0.7 },
    nResponses: { substitute: "numResponses", removeInVersion: 0.7 },
    nControls: { substitute: "numControls", removeInVersion: 0.7 },
    nThroughPoints: { substitute: "numThroughPoints", removeInVersion: 0.7 },
    nComponents: { substitute: "numComponents", removeInVersion: 0.7 },
    nChildrenToRender: {
        substitute: "numChildrenToRender",
        removeInVersion: 0.7,
    },
    nSelectedIndices: {
        substitute: "numSelectedIndices",
        removeInVersion: 0.7,
    },
    nDimensions: { substitute: "numDimensions", removeInVersion: 0.7 },
    nCases: { substitute: "numCases", removeInVersion: 0.7 },
    nDiscretizationPoints: {
        substitute: "numDiscretizationPoints",
        removeInVersion: 0.7,
    },
    nXCriticalPoints: {
        substitute: "numXCriticalPoints",
        removeInVersion: 0.7,
    },
    nYCriticalPoints: {
        substitute: "numYCriticalPoints",
        removeInVersion: 0.7,
    },
    nCurvatureChangePoints: {
        substitute: "numCurvatureChangePoints",
        removeInVersion: 0.7,
    },
    nScoredDescendants: {
        substitute: "numScoredDescendants",
        removeInVersion: 0.7,
    },
    nInputs: { substitute: "numInputs", removeInVersion: 0.7 },
    nOutputs: { substitute: "numOutputs", removeInVersion: 0.7 },
    nIterates: { substitute: "numIterates", removeInVersion: 0.7 },
    nDerivatives: { substitute: "numDerivatives", removeInVersion: 0.7 },
    nSources: { substitute: "numSources", removeInVersion: 0.7 },
    nMatches: { substitute: "numMatches", removeInVersion: 0.7 },
    nRows: { substitute: "numRows", removeInVersion: 0.7 },
    nColumns: { substitute: "numColumns", removeInVersion: 0.7 },
    nPages: { substitute: "numPages", removeInVersion: 0.7 },
    nOffsets: { substitute: "numOffsets", removeInVersion: 0.7 },
    nVariants: { substitute: "numVariants", removeInVersion: 0.7 },
    nSides: { substitute: "numSides", removeInVersion: 0.7 },
    nItems: { substitute: "numItems", removeInVersion: 0.7 },
    nLists: { substitute: "numLists", removeInVersion: 0.7 },
    nIterationsRequired: {
        substitute: "numIterationsRequired",
        removeInVersion: 0.7,
    },
    nGradedVertices: { substitute: "numGradedVertices", removeInVersion: 0.7 },
    nCorrectVertices: {
        substitute: "numCorrectVertices",
        removeInVersion: 0.7,
    },
    nIterateValues: { substitute: "numIterateValues", removeInVersion: 0.7 },
};

const deprecatedPropertySubstitutionsLowerCase = {};
Object.keys(deprecatedPropertySubstitutions).forEach(
    (key) =>
        (deprecatedPropertySubstitutionsLowerCase[key.toLowerCase()] =
            deprecatedPropertySubstitutions[key]),
);

function substitutePropertyDeprecations(serializedComponents) {
    let warnings = [];

    // Note: properties are public state variables that are referenced
    // either using dot notation in a source/copysource or in a prop/copyprop
    // but will be exclusively in prop by this point

    for (let component of serializedComponents) {
        if (typeof component !== "object") {
            continue;
        }

        let propName = component.attributes?.prop?.primitive;

        if (propName) {
            let propNameLower = propName.toLowerCase();

            if (propNameLower in deprecatedPropertySubstitutionsLowerCase) {
                let newProp =
                    deprecatedPropertySubstitutionsLowerCase[propNameLower]
                        .substitute;

                let removeInVersion =
                    deprecatedPropertySubstitutionsLowerCase[propNameLower]
                        .removeInVersion;

                warnings.push({
                    message: `Property ${propName} is deprecated. Use ${newProp} instead. ${returnDeprecationMessage(
                        removeInVersion,
                    )}`,
                    position: component.position,
                    level: 1,
                });

                component.attributes.prop.primitive = newProp;
            }
        }

        if (component.children) {
            let res = substitutePropertyDeprecations(component.children);
            warnings.push(...res.warnings);
        }

        if (component.attributes) {
            for (let attrName in component.attributes) {
                let attrComp = component.attributes[attrName].component;
                if (attrComp) {
                    let res = substitutePropertyDeprecations([attrComp]);
                    warnings.push(...res.warnings);
                }
            }
        }
    }

    return { warnings };
}

function temporarilyRenameSourceBackToTarget(serializedComponents) {
    // Note: use lower case for keys
    let backwardsDeprecatedAttributeSubstitutions = {
        copysource: "copyTarget",
    };

    // Note: use lower case for keys
    let backwardsDeprecatedAttributeSubstitutionsComponentSpecific = {
        copy: {
            source: "target",
        },
        collect: {
            source: "target",
        },
    };

    for (let component of serializedComponents) {
        if (typeof component !== "object") {
            continue;
        }

        if (component.props) {
            let cType = component.componentType;
            let typeSpecificDeps =
                backwardsDeprecatedAttributeSubstitutionsComponentSpecific[
                    cType.toLowerCase()
                ];
            if (!typeSpecificDeps) {
                typeSpecificDeps = {};
            }
            let retry = true;
            while (retry) {
                retry = false;
                for (let prop in component.props) {
                    let propLower = prop.toLowerCase();
                    if (propLower in typeSpecificDeps) {
                        let newProp = typeSpecificDeps[propLower];

                        component.props[newProp] = component.props[prop];
                        delete component.props[prop];

                        // since modified object over which are looping
                        // break out of loop and start over
                        retry = true;
                        break;
                    } else if (
                        propLower in backwardsDeprecatedAttributeSubstitutions
                    ) {
                        let newProp =
                            backwardsDeprecatedAttributeSubstitutions[
                                propLower
                            ];

                        component.props[newProp] = component.props[prop];
                        delete component.props[prop];

                        // since modified object over which are looping
                        // break out of loop and start over
                        retry = true;
                        break;
                    }
                }
            }
        }

        if (component.children) {
            temporarilyRenameSourceBackToTarget(component.children);
        }
    }
}

function cleanIfHaveJustDocument(serializedComponents) {
    let componentsWithoutBlankStrings = serializedComponents.filter(
        (x) => typeof x !== "string" || x.trim() !== "",
    );

    if (
        componentsWithoutBlankStrings.length === 1 &&
        componentsWithoutBlankStrings[0].componentType === "document"
    ) {
        return componentsWithoutBlankStrings;
    } else {
        return serializedComponents;
    }
}

function correctComponentTypeCapitalization(
    serializedComponents,
    componentInfoObjects,
    ignoreErrors = false,
) {
    let errors = [];
    let warnings = [];

    //special case for macros before application
    // componentTypeLowerCaseMapping["macro"] = "macro";
    for (let component of serializedComponents) {
        if (typeof component !== "object") {
            continue;
        }

        let componentTypeFixed =
            componentInfoObjects.componentTypeLowerCaseMapping[
                component.componentType.toLowerCase()
            ];

        if (componentTypeFixed) {
            component.componentType = componentTypeFixed;
        } else {
            let message = `Invalid component type: <${component.componentType}>.`;
            convertToErrorComponent(component, message);
            if (!ignoreErrors) {
                errors.push({
                    message,
                    position: component.position,
                });
            }
        }

        if (component.children) {
            let cClass =
                componentInfoObjects.allComponentClasses[
                    component.componentType
                ];
            let res = correctComponentTypeCapitalization(
                component.children,
                componentInfoObjects,
                ignoreErrors || cClass?.ignoreErrorsFromChildren,
            );
            errors.push(...res.errors);
            warnings.push(...res.warnings);
        }
    }
    return { errors, warnings };
}

function copyTargetOrFromURIAttributeCreatesCopyComponent(
    serializedComponents,
    isCompositeComponent,
) {
    // Convert <ctype copySource="name" /> essentially into <copy source="name" createComponentOfType="ctype" />
    // and <ctype copyFromURI="theuri" /> essentially into <copy uri="theuri" createComponentOfType="ctype" />
    // (except we currently have the technical debt where
    // copySource is internally copyTarget and source is internally target)
    // Also, add createNameFromComponentType=ctype so that, if no name was provided,
    // the automatically generated name for the copy's replacement will be of the form /_ctype1

    let errors = [];
    let warnings = [];

    for (let component of serializedComponents) {
        if (component.props) {
            try {
                let foundCopyTarget = false;
                let foundCopyFromURI = false;
                let foundAssignNames = false;
                let originalType = component.componentType;
                let haveComposite = isCompositeComponent({
                    componentType: originalType,
                    includeNonStandard: true,
                });
                for (let prop of Object.keys(component.props)) {
                    let lowerCaseProp = prop.toLowerCase();
                    if (lowerCaseProp === "copytarget") {
                        if (foundCopyTarget) {
                            throw Error(`Cannot repeat attribute ${prop}.`);
                        } else if (foundCopyFromURI) {
                            throw Error(
                                `Cannot combine copySource and copyFromURI attribiutes.`,
                            );
                        } else if (foundAssignNames) {
                            // Note: foundAssignNames is not set if haveComposite
                            throw Error(
                                `Invalid attribute assignNames for component of type <${originalType}>`,
                            );
                        }
                        foundCopyTarget = true;
                        if (!component.doenetAttributes) {
                            component.doenetAttributes = {};
                        }
                        component.props.createComponentOfType = originalType;

                        component.componentType = "copy";
                        component.props.target = component.props[prop];
                        if (typeof component.props.target !== "string") {
                            throw Error(`Must specify value for copySource.`);
                        }
                        delete component.props[prop];

                        component.doenetAttributes.fromCopyTarget = true;
                        component.doenetAttributes.createNameFromComponentType =
                            originalType;
                    } else if (lowerCaseProp === "copyfromuri") {
                        if (foundCopyFromURI) {
                            throw Error(`Cannot repeat attribute ${prop}.`);
                        } else if (foundCopyTarget) {
                            throw Error(
                                `Cannot combine copySource and copyFromURI attributes.`,
                            );
                        } else if (foundAssignNames) {
                            // Note: foundAssignNames is not set if haveComposite
                            throw Error(
                                `Invalid attribute assignNames for component of type <${originalType}>.`,
                            );
                        }
                        foundCopyFromURI = true;
                        if (!component.doenetAttributes) {
                            component.doenetAttributes = {};
                        }
                        component.props.createComponentOfType = originalType;
                        component.componentType = "copy";
                        component.props.uri = component.props[prop];
                        if (typeof component.props.uri !== "string") {
                            throw Error(`Must specify value for copyFromURI.`);
                        }
                        delete component.props[prop];
                        component.doenetAttributes.fromCopyFromURI = true;
                        component.doenetAttributes.createNameFromComponentType =
                            originalType;
                    } else if (
                        lowerCaseProp === "assignnames" &&
                        !haveComposite
                    ) {
                        if (foundCopyTarget || foundCopyFromURI) {
                            throw Error(
                                `Invalid attribute assignNames for component of type <${originalType}>.`,
                            );
                        }
                        foundAssignNames = true;
                    }
                }

                if (foundCopyTarget) {
                    // give error if have prop name "prop"
                    // after that rename copyProp to "prop"
                    for (let prop of Object.keys(component.props)) {
                        let lowerCaseProp = prop.toLowerCase();
                        if (lowerCaseProp === "prop") {
                            throw Error(
                                `Invalid attribute prop for component of type <${originalType}>`,
                            );
                        }
                    }
                    let foundCopyProp = false;
                    for (let prop of Object.keys(component.props)) {
                        let lowerCaseProp = prop.toLowerCase();
                        if (lowerCaseProp === "copyprop") {
                            if (foundCopyProp) {
                                throw Error(`Cannot repeat attribute ${prop}.`);
                            }
                            component.props.prop = component.props[prop];
                            delete component.props[prop];
                            foundCopyProp = true;
                        }
                    }
                }
            } catch (e) {
                convertToErrorComponent(component, e.message);
                errors.push({
                    message: e.message,
                    position: component.position,
                });
            }
        }

        if (component.children) {
            let res = copyTargetOrFromURIAttributeCreatesCopyComponent(
                component.children,
                isCompositeComponent,
            );
            errors.push(...res.errors);
            warnings.push(...res.warnings);
        }
    }
    return { errors, warnings };
}

function breakUpTargetIntoPropsAndIndices(
    serializedComponents,
    componentInfoObjects,
    ancestorString = "",
) {
    let errors = [];
    let warnings = [];

    for (let [component_ind, component] of serializedComponents.entries()) {
        // Note: do not do this for collect, as this dot notation would be confusing for collect

        try {
            if (
                component.props &&
                ["copy", "updateValue", "animateFromSequence"].includes(
                    component.componentType,
                )
            ) {
                let targetPropName;
                let sourceName;
                let componentIndex;
                let componentAttributes;
                let propArray;
                let subNames;

                let originalSource;

                for (let prop of Object.keys(component.props)) {
                    let lowerCaseProp = prop.toLowerCase();
                    if (lowerCaseProp === "target") {
                        if (targetPropName) {
                            let propNameForError = prop;
                            if (component.componentType === "copy") {
                                propNameForError = "source";
                            }
                            throw Error(
                                `Cannot repeat attribute ${propNameForError}.`,
                            );
                        }

                        targetPropName = prop;
                        originalSource = component.props[prop];

                        if (typeof originalSource !== "string") {
                            let propNameForError = prop;
                            if (component.componentType === "copy") {
                                propNameForError = "source";
                            }
                            throw Error(
                                `Must specify value for ${propNameForError}.`,
                            );
                        }

                        let sourcePiecesResult = buildSourcePieces(
                            originalSource,
                            true,
                        );

                        if (
                            sourcePiecesResult.success &&
                            sourcePiecesResult.matchLength ===
                                originalSource.length
                        ) {
                            sourceName = sourcePiecesResult.sourceName;
                            componentIndex = sourcePiecesResult.componentIndex;
                            componentAttributes =
                                sourcePiecesResult.componentAttributes;
                            propArray = sourcePiecesResult.propArray;
                            subNames = sourcePiecesResult.subNames;
                        }
                    }
                }

                if (targetPropName && sourceName) {
                    if (
                        componentIndex ||
                        componentAttributes ||
                        propArray.length > 0
                    ) {
                        // found an extended target

                        if (component.attributes.prop) {
                            throw Error(
                                `Cannot combine the prop attribute with an extended source attribute.`,
                            );
                        }

                        if (component.attributes.propIndex) {
                            throw Error(
                                `Cannot combine the propIndex attribute with an extended source attribute.`,
                            );
                        }
                        if (component.attributes.componentIndex) {
                            throw Error(
                                `Cannot combine the componentIndex attribute with an extended source attribute.`,
                            );
                        }

                        let componentResult = createComponentFromExtendedSource(
                            {
                                sourceName,
                                componentIndex,
                                subNames,
                                componentAttributes,
                                propArray,
                                componentInfoObjects,
                            },
                        );
                        // Note: don't need to create errors from createComponentFromExtendedSource
                        // as an error for it will be created, below
                        warnings.push(
                            ...componentResult.warnings.map((w) => {
                                w.position = component.position;
                                return w;
                            }),
                        );

                        if (componentResult.success) {
                            let newComponent = componentResult.newComponent;

                            if (component.componentType === "copy") {
                                // assign new componentType, attributes, and doenetAttributes
                                // to original component
                                delete component.props[targetPropName];
                                Object.assign(
                                    component.attributes,
                                    newComponent.attributes,
                                );
                                if (!component.doenetAttributes) {
                                    component.doenetAttributes = {};
                                }
                                Object.assign(
                                    component.doenetAttributes,
                                    newComponent.doenetAttributes,
                                );
                                component.componentType =
                                    newComponent.componentType;

                                if (propArray.length === 0) {
                                    let reducedAttributes = {
                                        ...component.attributes,
                                    };
                                    delete reducedAttributes.createComponentOfType;
                                    delete reducedAttributes.componentIndex;
                                    delete reducedAttributes.sourceSubnames;
                                    if (
                                        Object.keys(reducedAttributes)
                                            .length === 0
                                    ) {
                                        component.doenetAttributes.noAttributesOrProp = true;
                                    }
                                }

                                if (newComponent.children) {
                                    component.children = newComponent.children;
                                }
                            } else {
                                // have updateValue or animateFromSequence

                                if (newComponent.componentType === "copy") {
                                    // if the new component created was a copy
                                    // then we can just add the attributes to the original component

                                    // assign new componentType, attributes, and doenetAttributes
                                    // to original component
                                    delete component.props[targetPropName];
                                    Object.assign(
                                        component.attributes,
                                        newComponent.attributes,
                                    );
                                    // rename attributes to refer to target rather than source
                                    if (component.attributes.sourceSubnames) {
                                        component.attributes.targetSubnames =
                                            component.attributes.sourceSubnames;
                                        delete component.attributes
                                            .sourceSubnames;
                                    }
                                    if (
                                        component.attributes
                                            .sourceSubnamesComponentIndex
                                    ) {
                                        component.attributes.targetSubnamesComponentIndex =
                                            component.attributes.sourceSubnamesComponentIndex;
                                        delete component.attributes
                                            .sourceSubnamesComponentIndex;
                                    }

                                    if (!component.doenetAttributes) {
                                        component.doenetAttributes = {};
                                    }
                                    Object.assign(
                                        component.doenetAttributes,
                                        newComponent.doenetAttributes,
                                    );
                                } else {
                                    // if the new component created was an extract
                                    // then wrap the extract in a setup and append
                                    // and modify the updateValue/animateFromSequence to point to the extract

                                    let longNameId =
                                        "fromExtendedSource" +
                                        ancestorString +
                                        "|" +
                                        component_ind;
                                    let nameForExtract = createUniqueName(
                                        "extract",
                                        longNameId,
                                    );
                                    newComponent.doenetAttributes.prescribedName =
                                        nameForExtract;
                                    newComponent.doenetAttributes.excludeFromComponentCounts = true;

                                    let setupComponent = {
                                        componentType: "setup",
                                        children: [newComponent],
                                        doenetAttributes: {
                                            excludeFromComponentCounts: true,
                                        },
                                    };
                                    serializedComponents.push(setupComponent);

                                    delete component.props[targetPropName];

                                    if (!component.doenetAttributes) {
                                        component.doenetAttributes = {};
                                    }
                                    component.doenetAttributes.target =
                                        nameForExtract;
                                    component.doenetAttributes.allowDoubleUnderscoreTarget = true;
                                }
                            }
                        } else {
                            let message;
                            if (component.componentType === "copy") {
                                message = `invalid copy source: ${originalSource}`;
                            } else {
                                message = `invalid target: ${originalSource}`;
                            }
                            convertToErrorComponent(component, message);
                            errors.push({
                                message,
                                position: component.position,
                            });
                        }
                    } else {
                        // have copy with just a simple target prop that is a targetName

                        if (component.componentType === "copy") {
                            let reducedAttributes = { ...component.attributes };
                            delete reducedAttributes.createComponentOfType;
                            delete reducedAttributes.componentIndex;
                            delete reducedAttributes.sourceSubnames;
                            if (Object.keys(reducedAttributes).length === 0) {
                                if (!component.doenetAttributes) {
                                    component.doenetAttributes = {};
                                }
                                component.doenetAttributes.noAttributesOrProp = true;
                            }
                        }
                    }
                }
            }
        } catch (e) {
            convertToErrorComponent(component, e.message);
            errors.push({
                message: e.message,
                position: component.position,
            });
        }

        if (component.children) {
            let res = breakUpTargetIntoPropsAndIndices(
                component.children,
                componentInfoObjects,
                ancestorString + "|" + component_ind,
            );
            errors.push(...res.errors);
            warnings.push(...res.warnings);
        }
    }

    return { errors, warnings };
}

function createAttributesFromProps(
    serializedComponents,
    componentInfoObjects,
    ignoreErrors = false,
) {
    let errors = [];
    let warnings = [];

    for (let component of serializedComponents) {
        if (typeof component !== "object") {
            continue;
        }

        let componentClass =
            componentInfoObjects.allComponentClasses[component.componentType];

        try {
            let classAttributes = componentClass.createAttributesObject();

            let attributeLowerCaseMapping = {};

            for (let propName in classAttributes) {
                attributeLowerCaseMapping[propName.toLowerCase()] = propName;
            }

            let attributes = {};

            // if there are any props of json that match attributes for component class
            // create the specified components or primitives

            let originalComponentProps = Object.assign({}, component.props);
            if (component.props) {
                for (let prop in component.props) {
                    let propName =
                        attributeLowerCaseMapping[prop.toLowerCase()];
                    let attrObj = classAttributes[propName];
                    if (attrObj) {
                        if (propName in attributes) {
                            throw Error(`Cannot repeat attribute ${propName}.`);
                        }

                        let res = componentFromAttribute({
                            attrObj,
                            value: component.props[prop],
                            attributeRange: component.attributeRanges?.[prop],
                            originalComponentProps,
                            componentInfoObjects,
                        });
                        attributes[propName] = res.attribute;
                        errors.push(...res.errors);
                        warnings.push(...res.warnings);
                        delete component.props[prop];
                    } else if (
                        !["name", "assignnames", "target"].includes(
                            prop.toLowerCase(),
                        )
                    ) {
                        if (componentClass.acceptAnyAttribute) {
                            let res = componentFromAttribute({
                                value: component.props[prop],
                                attributeRange:
                                    component.attributeRanges?.[prop],
                                originalComponentProps,
                                componentInfoObjects,
                            });
                            attributes[prop] = res.attribute;
                            errors.push(...res.errors);
                            warnings.push(...res.warnings);
                            delete component.props[prop];
                        } else {
                            throw Error(
                                `Invalid attribute "${prop}" for a component of type <${component.componentType}>.`,
                            );
                        }
                    }
                }
            }

            // if there are any primitive attributes that define a default value
            // but were not specified via props, add them with their default value

            for (let attrName in classAttributes) {
                let attrObj = classAttributes[attrName];

                if (
                    attrObj.createPrimitiveOfType &&
                    "defaultPrimitiveValue" in attrObj &&
                    !(attrName in attributes)
                ) {
                    let res = componentFromAttribute({
                        attrObj,
                        originalComponentProps,
                        value: attrObj.defaultPrimitiveValue.toString(),
                        componentInfoObjects,
                    });
                    attributes[attrName] = res.attribute;
                    errors.push(...res.errors);
                    warnings.push(...res.warnings);
                }
            }

            component.attributes = attributes;
        } catch (e) {
            convertToErrorComponent(component, e.message);
            if (!ignoreErrors) {
                errors.push({
                    message: e.message,
                    position: component.position,
                });
            }
        }

        //recurse on children
        if (component.children !== undefined) {
            let ignoreErrorsInChildren =
                ignoreErrors || componentClass.ignoreErrorsFromChildren;
            let res = createAttributesFromProps(
                component.children,
                componentInfoObjects,
                ignoreErrorsInChildren,
            );
            errors.push(...res.errors);
            warnings.push(...res.warnings);
        }
    }

    return { errors, warnings };
}

export function componentFromAttribute({
    attrObj,
    value,
    attributeRange,
    originalComponentProps,
    componentInfoObjects,
}) {
    let errors = [];
    let warnings = [];

    if (typeof value !== "object") {
        // typically this would mean value is a string.
        // However, if had an attribute with no value, would get true.
        // Also, when get addAttributeComponentsShadowingStateVariables,
        // it is possible their values are not strings
        value = { rawString: value.toString() };
    } else if (value === null) {
        // could get null from addAttributeComponentsShadowingStateVariables
        value = { rawString: "" };
    }

    if (attrObj?.createComponentOfType) {
        let newComponent;
        let valueTrimLower = value.rawString.trim().toLowerCase();

        if (valueTrimLower === "true" && attrObj.valueForTrue !== undefined) {
            newComponent = {
                componentType: attrObj.createComponentOfType,
                state: { value: attrObj.valueForTrue },
            };
        } else if (
            valueTrimLower === "false" &&
            attrObj.valueForFalse !== undefined
        ) {
            newComponent = {
                componentType: attrObj.createComponentOfType,
                state: { value: attrObj.valueForFalse },
            };
        } else if (
            componentInfoObjects.isInheritedComponentType({
                inheritedComponentType: attrObj.createComponentOfType,
                baseComponentType: "boolean",
            }) &&
            ["true", "false"].includes(valueTrimLower)
        ) {
            newComponent = {
                componentType: attrObj.createComponentOfType,
                state: { value: valueTrimLower === "true" },
            };
        } else {
            let children = value.childrenForFutureComponent;
            if (children) {
                children = JSON.parse(JSON.stringify(children));
            } else {
                children = [value.rawString];
            }
            newComponent = {
                componentType: attrObj.createComponentOfType,
                children,
            };

            removeBlankStringChildren([newComponent], componentInfoObjects);
        }

        if (attributeRange) {
            newComponent.position = attributeRange;
        }

        if (
            attrObj.attributesForCreatedComponent ||
            attrObj.copyComponentAttributesForCreatedComponent
        ) {
            if (attrObj.attributesForCreatedComponent) {
                newComponent.props = attrObj.attributesForCreatedComponent;
            } else {
                newComponent.props = {};
            }

            if (attrObj.copyComponentAttributesForCreatedComponent) {
                for (let attrName of attrObj.copyComponentAttributesForCreatedComponent) {
                    if (originalComponentProps[attrName]) {
                        newComponent.props[attrName] = JSON.parse(
                            JSON.stringify(originalComponentProps[attrName]),
                        );
                    }
                }
            }

            let res = createAttributesFromProps(
                [newComponent],
                componentInfoObjects,
            );
            errors.push(...res.errors);
            warnings.push(...res.warnings);
        }

        let attr = { component: newComponent };
        if (attrObj.ignoreFixed) {
            attr.ignoreFixed = true;
        }
        return { attribute: attr, errors, warnings };
    } else if (attrObj?.createPrimitiveOfType) {
        let newPrimitive;
        if (value.primitive !== undefined) {
            newPrimitive = value.primitive;
            // Just in case to be careful, we'll make sure the newPrimitive is of the correct type
            if (attrObj.createPrimitiveOfType === "boolean") {
                newPrimitive = Boolean(newPrimitive);
            } else if (attrObj.createPrimitiveOfType === "number") {
                newPrimitive = Number(newPrimitive);
            } else if (attrObj.createPrimitiveOfType === "integer") {
                newPrimitive = Math.round(Number(newPrimitive));
            } else if (attrObj.createPrimitiveOfType === "stringArray") {
                if (Array.isArray(newPrimitive)) {
                    newPrimitive = newPrimitive.map((x) => x.toString());
                } else {
                    newPrimitive = [];
                }
            } else if (attrObj.createPrimitiveOfType === "numberArray") {
                if (Array.isArray(newPrimitive)) {
                    newPrimitive = newPrimitive.map((x) => Number(x));
                } else {
                    newPrimitive = [];
                }
            } else {
                // else assume string
                newPrimitive = newPrimitive.toString();
            }
        } else if (attrObj.createPrimitiveOfType === "boolean") {
            let valueTrimLower = value.rawString.trim().toLowerCase();
            newPrimitive = valueTrimLower === "true";
        } else if (attrObj.createPrimitiveOfType === "number") {
            newPrimitive = Number(value.rawString);
        } else if (attrObj.createPrimitiveOfType === "integer") {
            newPrimitive = Math.round(Number(value.rawString));
        } else if (attrObj.createPrimitiveOfType === "stringArray") {
            newPrimitive = value.rawString.trim().split(/\s+/);
        } else if (attrObj.createPrimitiveOfType === "numberArray") {
            newPrimitive = value.rawString.trim().split(/\s+/).map(Number);
        } else {
            // else assume string
            newPrimitive = value.rawString;
        }

        if (attrObj.validatePrimitives) {
            newPrimitive = attrObj.validatePrimitives(newPrimitive);
        }
        return { attribute: { primitive: newPrimitive }, errors, warnings };
    } else if (attrObj?.createTargetComponentNames) {
        let newTargets = value.rawString
            .trim()
            .split(/\s+/)
            .map((str) => {
                if (str[0] === "$" && str[1] !== "$") {
                    // remove unnecessary macro notation
                    str = str.slice(1);

                    if (str[0] === "(" && str[str.length - 1] === ")") {
                        // remove unnecessary parens from macro
                        // (don't both checking that parens match, as no valid result with multiple parens)
                        str = str.slice(1, str.length - 1);
                    }
                }
                // absolute name will be added when namespace is known
                return { relativeName: str };
            });

        return {
            attribute: { targetComponentNames: newTargets },
            errors,
            warnings,
        };
    } else {
        if (!value.childrenForFutureComponent) {
            if (value.rawString !== undefined) {
                value.childrenForFutureComponent = [value.rawString];
            }
        }
        return { attribute: value, errors, warnings };
    }
}

export function findPreSugarIndsAndMarkFromSugar(components) {
    let preSugarIndsFound = [];
    for (let component of components) {
        if (typeof component !== "object") {
            continue;
        }
        if (component.preSugarInd !== undefined) {
            preSugarIndsFound.push(component.preSugarInd);
        } else {
            if (!component.doenetAttributes) {
                component.doenetAttributes = {};
            }
            component.doenetAttributes.createdFromSugar = true;
            if (component.children) {
                let inds = findPreSugarIndsAndMarkFromSugar(component.children);
                preSugarIndsFound.push(...inds);
            }
        }
    }

    return preSugarIndsFound;
}

export function applyMacros(
    serializedComponents,
    componentInfoObjects,
    startDoenetMLInd = 0,
) {
    let errors = [];
    let warnings = [];

    for (let component of serializedComponents) {
        if (component.children) {
            let startDoenetMLIndForChildren;
            if (component.position) {
                startDoenetMLIndForChildren = component.position.openEnd;
                if (startDoenetMLIndForChildren === undefined) {
                    startDoenetMLIndForChildren = component.position.begin - 1;
                }
            }
            let res = applyMacros(
                component.children,
                componentInfoObjects,
                startDoenetMLIndForChildren,
            );
            errors.push(...res.errors);
            warnings.push(...res.warnings);
        }
        if (component.attributes) {
            for (let attrName in component.attributes) {
                let attribute = component.attributes[attrName];
                let startDoenetMLIndForAttr = Number(
                    component.attributeRanges?.[attrName]?.begin - 1,
                );
                if (attribute.component) {
                    let res = applyMacros(
                        [attribute.component],
                        componentInfoObjects,
                        startDoenetMLIndForAttr,
                    );
                    errors.push(...res.errors);
                    warnings.push(...res.warnings);
                } else if (attribute.childrenForFutureComponent) {
                    let res = applyMacros(
                        attribute.childrenForFutureComponent,
                        componentInfoObjects,
                        startDoenetMLIndForAttr,
                    );
                    errors.push(...res.errors);
                    warnings.push(...res.warnings);
                }
            }
        }
    }

    let res = substituteMacros(
        serializedComponents,
        componentInfoObjects,
        startDoenetMLInd,
    );
    errors.push(...res.errors);
    warnings.push(...res.warnings);
    return { errors, warnings };
}

function substituteMacros(
    serializedComponents,
    componentInfoObjects,
    startDoenetMLInd = 0,
) {
    let errors = [];
    let warnings = [];

    let doenetMLcharInd = startDoenetMLInd;

    for (
        let componentInd = 0;
        componentInd < serializedComponents.length;
        componentInd++
    ) {
        let component = serializedComponents[componentInd];

        if (typeof component === "string") {
            let startInd = 0;
            let nextDoenetMLcharIndAdjustment;

            while (startInd < component.length) {
                let str = component;
                let result = findFirstFullMacroInString(str.slice(startInd));

                if (!result.success) {
                    break;
                }

                let firstIndMatched = result.firstIndMatched + startInd;
                let matchLength = result.matchLength;
                let nDollarSigns = result.nDollarSigns;

                let position;
                if (Number.isFinite(doenetMLcharInd)) {
                    position = {
                        begin: doenetMLcharInd + 1 + firstIndMatched,
                        end: doenetMLcharInd + firstIndMatched + matchLength,
                    };
                }

                let componentsFromMacro;

                let componentResult = createComponentFromExtendedSource({
                    sourceName: result.sourceName,
                    componentIndex: result.componentIndex,
                    subNames: result.subNames,
                    componentAttributes: result.componentAttributes,
                    propArray: result.propArray,
                    componentInfoObjects,
                });
                // Note: don't need to create errors from createComponentFromExtendedSource
                // as an error for it will be created, below
                warnings.push(
                    ...componentResult.warnings.map((w) => {
                        w.position = position;
                        return w;
                    }),
                );

                let newComponent;
                if (componentResult.success) {
                    newComponent = componentResult.newComponent;
                    if (Number.isFinite(doenetMLcharInd)) {
                        newComponent.position = position;
                    }
                } else {
                    let strWithError = str.slice(
                        firstIndMatched,
                        firstIndMatched + matchLength,
                    );

                    let message = `${componentResult.errors[0].message} Found: ${strWithError}.`;
                    errors.push({
                        message,
                        position,
                    });
                    newComponent = {
                        componentType: "_error",
                        state: { message },
                        position,
                    };
                }

                markCreatedFromMacro([newComponent]);

                if (result.propArray.length === 0) {
                    let reducedAttributes = { ...newComponent.attributes };
                    delete reducedAttributes.createComponentOfType;
                    delete reducedAttributes.componentIndex;
                    delete reducedAttributes.sourceSubnames;
                    if (Object.keys(reducedAttributes).length === 0) {
                        newComponent.doenetAttributes.noAttributesOrProp = true;
                    }
                }

                componentsFromMacro = [newComponent];

                let numComponentsToRemove = 1;
                let stringToAddAtEnd = str.substring(
                    firstIndMatched + matchLength,
                );

                if (nDollarSigns === 2) {
                    let matchOpeningParens = str
                        .slice(firstIndMatched + matchLength)
                        .match(/^\s*\(/);

                    if (!matchOpeningParens) {
                        // if don't match function,
                        // don't replace double dollar sign macro
                        startInd = firstIndMatched + 2;
                        continue;
                    }

                    let matchLengthWithOpeningParens =
                        matchLength + matchOpeningParens[0].length;

                    // look for a closing parenthesis

                    // get array of the component with the rest of this string
                    // plus the rest of the components in the array
                    let remainingComponents = [];
                    let includeFirstInRemaining = false;

                    if (
                        str.length >
                        firstIndMatched + matchLengthWithOpeningParens
                    ) {
                        includeFirstInRemaining = true;
                        remainingComponents.push(
                            str.substring(
                                firstIndMatched + matchLengthWithOpeningParens,
                            ),
                        );
                    }

                    remainingComponents.push(
                        ...serializedComponents.slice(componentInd + 1),
                    );

                    let evaluateResult =
                        createEvaluateIfFindMatchedClosingParens({
                            componentsFromMacro,
                            remainingComponents,
                            includeFirstInRemaining,
                            componentInfoObjects,
                        });
                    errors.push(...evaluateResult.errors);
                    warnings.push(...evaluateResult.warnings);

                    if (!evaluateResult.success) {
                        // if couldn't create evaluate,
                        // don't replace double dollar macro
                        startInd = firstIndMatched + 2;
                        continue;
                    }

                    componentsFromMacro = evaluateResult.componentsFromMacro;

                    if (Number.isFinite(doenetMLcharInd)) {
                        let lastInd = component.length;
                        if (componentsFromMacro.length > 1) {
                            lastInd -= componentsFromMacro[1].length;
                        }
                        componentsFromMacro[0].position = {
                            begin: doenetMLcharInd + 1 + firstIndMatched,
                            end: doenetMLcharInd + lastInd,
                        };
                    }

                    numComponentsToRemove =
                        evaluateResult.lastComponentIndMatched + 1;
                    if (!includeFirstInRemaining) {
                        numComponentsToRemove++;
                    }

                    // leftover string already included in componentsFromMacro
                    stringToAddAtEnd = "";
                }

                let replacements = [];

                // the string before the function name
                if (firstIndMatched > 0) {
                    replacements.push(str.substring(0, firstIndMatched));
                }

                replacements.push(...componentsFromMacro);

                if (stringToAddAtEnd.length > 0) {
                    replacements.push(stringToAddAtEnd);
                }

                // splice new replacements into serializedComponents
                serializedComponents.splice(
                    componentInd,
                    numComponentsToRemove,
                    ...replacements,
                );

                let indOfLastComponentAddedBackIn =
                    componentInd - numComponentsToRemove + replacements.length;

                if (firstIndMatched > 0) {
                    // increment componentInd because we now have to skip
                    // over two components
                    // (the component made from the beginning of the string
                    // as well as the component made from the macro)
                    componentInd++;
                }

                let nextComponentThatWillProcess = componentInd + 1;

                if (
                    nextComponentThatWillProcess <=
                    indOfLastComponentAddedBackIn
                ) {
                    // next time, we'll reprocess the last string, so adjust doenetMLcharInd
                    let lastAddedIn =
                        serializedComponents[indOfLastComponentAddedBackIn];
                    if (typeof lastAddedIn === "string") {
                        nextDoenetMLcharIndAdjustment = lastAddedIn.length;
                    }
                }

                // break out of loop processing string,
                // as finished current one
                // (possibly breaking it into pieces, so will address remainder as other component)

                break;
            }
            doenetMLcharInd += component.length;

            if (nextDoenetMLcharIndAdjustment !== undefined) {
                doenetMLcharInd -= nextDoenetMLcharIndAdjustment;
            }
        } else {
            let position = component.position;
            if (position) {
                if (position.selfCloseBegin !== undefined) {
                    doenetMLcharInd = position.selfCloseEnd;
                } else if (position.openBegin !== undefined) {
                    doenetMLcharInd = position.closeEnd;
                } else if (position.begin !== undefined) {
                    doenetMLcharInd = position.end;
                } else {
                    doenetMLcharInd = NaN;
                }
            } else {
                doenetMLcharInd = NaN;
            }
        }
    }

    return { errors, warnings };
}

function createComponentFromExtendedSource({
    sourceName,
    componentIndex,
    componentAttributes,
    propArray,
    subNames,
    componentInfoObjects,
}) {
    let errors = [];
    let warnings = [];

    let newComponent = {
        componentType: "copy",
        doenetAttributes: { target: sourceName },
        attributes: {},
        props: {},
    };

    if (componentIndex) {
        let childrenForAttribute = [componentIndex];
        let res = applyMacros(childrenForAttribute, componentInfoObjects);
        errors.push(...res.errors);
        warnings.push(...res.warnings);
        if (errors.length > 0) {
            return { success: false, errors, warnings };
        }

        newComponent.attributes.componentIndex = {
            component: {
                componentType: "integer",
                children: childrenForAttribute,
            },
        };
    }

    if (subNames?.length > 0) {
        let sourceSubnames = [];
        let sourceSubnamesComponentIndex = [];

        for (let subNameObj of subNames) {
            sourceSubnames.push(subNameObj.subName);
            if (subNameObj.subNameComponentIndex !== undefined) {
                if (sourceSubnamesComponentIndex.length < sourceSubnames - 1) {
                    // TODO: NaN will presumably make it not return anything
                    // When we enable recursing to composites, we'll need a strategy to skip subname component index
                    sourceSubnamesComponentIndex.push(
                        ...Array[
                            sourceSubnames -
                                1 -
                                sourceSubnamesComponentIndex.length
                        ].fill(NaN),
                    );
                }
                sourceSubnamesComponentIndex.push(
                    subNameObj.subNameComponentIndex,
                );
            }
        }

        newComponent.attributes.sourceSubnames = {
            primitive: sourceSubnames,
        };
        if (sourceSubnamesComponentIndex.length > 0) {
            let childrenForAttribute = [sourceSubnamesComponentIndex.join(" ")];
            let res = applyMacros(childrenForAttribute, componentInfoObjects);
            errors.push(...res.errors);
            warnings.push(...res.warnings);
            if (errors.length > 0) {
                return { success: false, errors, warnings };
            }

            newComponent.attributes.sourceSubnamesComponentIndex = {
                component: {
                    componentType: "numberList",
                    children: childrenForAttribute,
                },
            };
        }
    }

    let propsAddExtract = false;

    if (componentAttributes) {
        propsAddExtract = true;

        let attributesResult = createAttributesFromString(
            componentAttributes,
            componentInfoObjects,
        );
        if (!attributesResult.success) {
            return attributesResult;
        }
        // Don't need to add errors, as errors would make success be false
        warnings.push(...attributesResult.warnings);

        Object.assign(newComponent.attributes, attributesResult.newAttributes);

        if (attributesResult.assignNames) {
            newComponent.props.assignNames = attributesResult.assignNames;
        }
        if (attributesResult.name) {
            newComponent.props.name = attributesResult.name;
        }
    }

    for (let propObj of propArray) {
        if (propsAddExtract) {
            newComponent.doenetAttributes.excludeFromComponentCounts = true;

            newComponent = {
                componentType: "extract",
                attributes: {},
                doenetAttributes: {},
                children: [newComponent],
                props: {},
            };
        }

        newComponent.attributes.prop = { primitive: propObj.prop };

        if (propObj.propIndex) {
            let childrenForAttribute = [propObj.propIndex.join(" ")];
            let res = applyMacros(childrenForAttribute, componentInfoObjects);
            errors.push(...res.errors);
            warnings.push(...res.warnings);
            if (errors.length > 0) {
                return { success: false, errors, warnings };
            }

            newComponent.attributes.propIndex = {
                component: {
                    componentType: "numberList",
                    children: childrenForAttribute,
                },
            };
        }

        if (propObj.attributes) {
            let attributesResult = createAttributesFromString(
                propObj.attributes,
                componentInfoObjects,
            );
            if (!attributesResult.success) {
                return attributesResult;
            }
            // Don't need to add errors, as errors would make success be false
            warnings.push(...attributesResult.warnings);

            Object.assign(
                newComponent.attributes,
                attributesResult.newAttributes,
            );

            if (attributesResult.assignNames) {
                newComponent.props.assignNames = attributesResult.assignNames;
            }
            if (attributesResult.name) {
                newComponent.props.name = attributesResult.name;
            }
        }

        propsAddExtract = true;
    }

    return { success: errors.length === 0, newComponent, errors, warnings };
}

function createAttributesFromString(componentAttributes, componentInfoObjects) {
    // parse a copy component with those attributes
    // to get attributes parsed

    let errors = [];
    let warnings = [];

    let attributesDoenetML = `<copy ${componentAttributes} />`;
    let componentsForAttributes;
    try {
        let result = parseAndCompile(attributesDoenetML);

        componentsForAttributes = result.components;
        errors.push(...result.errors);
    } catch (e) {
        errors.push({
            message: "Error in macro",
        });
        return { success: false, errors, warnings };
    }

    let res = substituteAttributeDeprecations(componentsForAttributes);
    warnings.push(...res.warnings);

    res = createAttributesFromProps(
        componentsForAttributes,
        componentInfoObjects,
    );
    errors.push(...res.errors);
    warnings.push(...res.warnings);

    markCreatedFromMacro(componentsForAttributes);

    // recurse in case there were more macros in additionalAttributes
    res = applyMacros(componentsForAttributes, componentInfoObjects);
    errors.push(...res.errors);
    warnings.push(...res.warnings);

    let newAttributes = componentsForAttributes[0].attributes;

    if (
        newAttributes.prop ||
        newAttributes.propIndex ||
        newAttributes.componentIndex
    ) {
        errors.push({
            message:
                "Error in macro: macro cannot directly add attributes prop, propIndex, or componentIndex.",
        });
        return { success: false, errors, warnings };
    }

    let assignNames, name;
    if (componentsForAttributes[0].props) {
        for (let prop in componentsForAttributes[0].props) {
            if (prop.toLowerCase() === "assignnames") {
                if (assignNames) {
                    errors.push({
                        message: "Error in macro: cannot repeat assignNames.",
                    });
                    return { success: false, errors, warnings };
                } else {
                    assignNames = componentsForAttributes[0].props[prop];
                }
            } else if (prop.toLowerCase() === "name") {
                if (name) {
                    return {
                        success: false,
                        message: "Error in macro: cannot repeat name",
                    };
                } else {
                    name = componentsForAttributes[0].props[prop];
                }
            }
        }
    }

    return {
        success: errors.length === 0,
        newAttributes,
        assignNames,
        name,
        errors,
        warnings,
    };
}

function findFirstFullMacroInString(str) {
    let offset = 0;
    let nDollarSigns;

    while (true) {
        // look for a macro
        let matchDollars = str.substring(offset).match(/(\$+)(.?)/);

        if (!matchDollars) {
            return { success: false };
        }

        nDollarSigns = matchDollars[1].length;
        offset += matchDollars.index + nDollarSigns;

        if (nDollarSigns <= 2) {
            let extendedWordCharacters = false;

            let strForMacro = str.substring(offset);
            let requiredLength = 0;

            let findResult = findWordOrDelimitedGroup(
                strForMacro,
                extendedWordCharacters,
            );

            if (findResult.startDelim === "(") {
                // if have parens, then restrict to string inside parens
                // and allowed extended characters in words
                extendedWordCharacters = true;
                strForMacro = findResult.group;
                requiredLength = findResult.group.length;
            }

            let result = buildSourcePieces(strForMacro, extendedWordCharacters);

            if (result.success) {
                if (extendedWordCharacters) {
                    // if were in parens, then must match all characters
                    if (result.matchLength !== requiredLength) {
                        return { success: false };
                    }
                    result.matchLength += 2; // +2 for the parens
                }

                result.nDollarSigns = nDollarSigns;
                result.firstIndMatched = offset - nDollarSigns;
                result.matchLength += nDollarSigns;

                return result;
            }
        }

        // try for another match, given that offset was shifted after last dollar signs
    }
}

function buildSourcePieces(str, extendedWordCharacters) {
    let findResult = findWordOrDelimitedGroup(str, extendedWordCharacters);

    let matchLength = 0;

    if (findResult.withPeriod || !findResult.word) {
        // must start with a word without a period
        return { success: false };
    }

    let result = {
        sourceName: (findResult.withSlash ? "/" : "") + findResult.word,
    };

    matchLength += findResult.matchLength;
    str = str.substring(findResult.matchLength);

    findResult = findWordOrDelimitedGroup(str, extendedWordCharacters);

    if (findResult.startDelim === "[") {
        result.componentIndex = findResult.group;
        matchLength += findResult.matchLength;
        str = str.substring(findResult.matchLength);
        findResult = findWordOrDelimitedGroup(str, extendedWordCharacters);
    }

    let subNames = [];
    while (findResult.withSlash) {
        // check for additional subname piece of /name[componentIndex]

        let subnameObj = { subName: findResult.word };
        matchLength += findResult.matchLength;
        str = str.substring(findResult.matchLength);
        findResult = findWordOrDelimitedGroup(str, extendedWordCharacters);

        if (findResult.startDelim === "[") {
            subnameObj.subNameComponentIndex = findResult.group;
            matchLength += findResult.matchLength;
            str = str.substring(findResult.matchLength);
            findResult = findWordOrDelimitedGroup(str, extendedWordCharacters);
        }

        subNames.push(subnameObj);
    }

    result.subNames = subNames;

    if (findResult.startDelim === "{") {
        result.componentAttributes = findResult.group;
        matchLength += findResult.matchLength;
        str = str.substring(findResult.matchLength);
        findResult = findWordOrDelimitedGroup(str, extendedWordCharacters);
    }

    let propArray = [];

    while (findResult.withPeriod) {
        // check to a prop object of prop[propIndex]{attributes}
        // where [] and {} parts are optional

        let propObj = { prop: findResult.word };
        matchLength += findResult.matchLength;
        str = str.substring(findResult.matchLength);
        findResult = findWordOrDelimitedGroup(str, extendedWordCharacters);

        let propIndex = [];

        while (findResult.startDelim === "[") {
            propIndex.push(findResult.group);
            matchLength += findResult.matchLength;
            str = str.substring(findResult.matchLength);
            findResult = findWordOrDelimitedGroup(str, extendedWordCharacters);
        }

        if (propIndex.length > 0) {
            propObj.propIndex = propIndex;
        }

        if (findResult.startDelim === "{") {
            propObj.attributes = findResult.group;
            matchLength += findResult.matchLength;
            str = str.substring(findResult.matchLength);
            findResult = findWordOrDelimitedGroup(str, extendedWordCharacters);
        }

        propArray.push(propObj);
    }

    result.propArray = propArray;
    result.matchLength = matchLength;
    result.success = true;

    return result;
}

function findWordOrDelimitedGroup(str, extendedWordCharacters = false) {
    // find the next word (possibly begininng with a period or, extendedWordCharacters, a slash ),
    // or a group delimited by (), [], or {},
    // where the word/group must start with the first character of the string

    let withPeriod = false;
    let withSlash = false;
    if (str[0] === "." && str[1] !== ".") {
        withPeriod = true;
        str = str.substring(1);
    }

    let wordRe;

    if (extendedWordCharacters) {
        if (withPeriod) {
            wordRe = /^[\w-]+/;
        } else {
            if (str[0] === "/" && str[1].match(/\w/)) {
                withSlash = true;
                str = str.substring(1);
            }
            wordRe = /^([\w\/-]|\.\.\/)+/;
        }
    } else {
        wordRe = /^[a-zA-Z_]\w*/;
    }

    let match = str.match(wordRe);

    if (match) {
        return {
            success: true,
            withPeriod,
            withSlash,
            word: match[0],
            matchLength:
                match[0].length + (withPeriod ? 1 : 0) + (withSlash ? 1 : 0),
        };
    } else if (withPeriod || withSlash) {
        // if starts with a period or slash, must have word next
        return { success: false };
    }

    let neededClosingDelimStack = [];
    let closingByOpeningDelim = {
        "(": ")",
        "{": "}",
        "[": "]",
    };
    let closeDelims = Object.values(closingByOpeningDelim);

    let startDelim = str[0];

    let nextClosing = closingByOpeningDelim[startDelim];

    if (!nextClosing) {
        return { success: false };
    }

    neededClosingDelimStack.push(nextClosing);

    for (let ind = 1; ind < str.length; ind++) {
        let char = str[ind];

        if (char in closingByOpeningDelim) {
            neededClosingDelimStack.push(closingByOpeningDelim[char]);
        } else if (closeDelims.includes(char)) {
            if (char !== neededClosingDelimStack.pop()) {
                // mismatched closing delim
                return { success: false };
            }
            if (neededClosingDelimStack.length === 0) {
                // matched startDelim
                return {
                    success: true,
                    group: str.substring(1, ind), // does not include delimiters
                    startDelim,
                    matchLength: ind + 1,
                };
            }
        }
    }

    // got to end of str with closing out startDelim
    return { success: false };
}

function markCreatedFromMacro(serializedComponents) {
    for (let serializedComponent of serializedComponents) {
        if (!serializedComponent.doenetAttributes) {
            serializedComponent.doenetAttributes = {};
        }
        serializedComponent.doenetAttributes.createdFromMacro = true;

        if (serializedComponent.children) {
            markCreatedFromMacro(serializedComponent.children);
        }
    }
}

function createEvaluateIfFindMatchedClosingParens({
    componentsFromMacro,
    remainingComponents,
    includeFirstInRemaining,
    componentInfoObjects,
}) {
    let errors = [];
    let warnings = [];

    let result = findFirstUnmatchedClosingParens(remainingComponents);

    if (!result.success) {
        return { success: false, errors, warnings };
    }
    // found unmatched closing parenthesis, so is the one
    // matching the opening parenthesis

    let lastComponentInd = result.componentInd;

    remainingComponents = remainingComponents.slice(0, lastComponentInd + 1);

    let lastComponentOfFunction = remainingComponents[lastComponentInd];

    let stringAfterFunction = "";

    // if have text after closing parenthesis
    // save in stringAfterFunction
    if (result.charInd + 1 < lastComponentOfFunction.length) {
        stringAfterFunction = lastComponentOfFunction.substring(
            result.charInd + 1,
        );
    }

    // remove closing parenthesis and any subsequent text
    // from the last component
    if (result.charInd > 0) {
        remainingComponents[lastComponentInd] =
            lastComponentOfFunction.substring(0, result.charInd);
    } else {
        // remove this component altogether as there is nothing left
        remainingComponents = remainingComponents.slice(0, lastComponentInd);
    }

    let breakResults = breakEmbeddedStringByCommas({
        childrenList: remainingComponents,
    });

    // recurse on pieces
    breakResults.pieces.forEach((x) => {
        let res = applyMacros(x, componentInfoObjects);
        errors.push(...res.errors);
        warnings.push(...res.warnings);
    });

    let inputArray = breakResults.pieces.map((x) => {
        if (x.length === 1 && typeof x[0] !== "string") {
            return x[0];
        } else {
            return {
                componentType: "math",
                doenetAttributes: { createdFromMacro: true },
                children: x,
            };
        }
    });

    let evaluateComponent = {
        componentType: "evaluate",
        doenetAttributes: { createdFromMacro: true },
        attributes: {
            function: {
                component: {
                    componentType: "function",
                    doenetAttributes: { createdFromMacro: true },
                    children: componentsFromMacro,
                },
            },
            input: {
                component: {
                    componentType: "mathList",
                    doenetAttributes: { createdFromMacro: true },
                    children: inputArray,
                    skipSugar: true,
                },
            },
        },
    };

    let replacements = [evaluateComponent];

    // if have text after function
    // include string component at end containing that text
    if (stringAfterFunction.length > 0) {
        replacements.push(stringAfterFunction);
    }

    return {
        success: true,
        componentsFromMacro: replacements,
        lastComponentIndMatched: lastComponentInd,
        errors,
        warnings,
    };
}

// TODO: this is currently code duplicated from breakstrings in commonsugar of doenetml-worker-javascript
function breakEmbeddedStringByCommas({ childrenList }) {
    let Nparens = 0;
    let pieces = [];
    let currentPiece = [];

    for (let component of childrenList) {
        if (typeof component !== "string") {
            currentPiece.push(component);
            continue;
        }

        let s = component.trim();
        let beginInd = 0;

        for (let ind = 0; ind < s.length; ind++) {
            let char = s[ind];
            if (char === "(") {
                Nparens++;
            }
            if (char === ")") {
                if (Nparens === 0) {
                    // parens didn't match, so return failure
                    return { success: false };
                }
                Nparens--;
            }
            if (char === "," && Nparens === 0) {
                if (ind > beginInd) {
                    let newString = s.substring(beginInd, ind).trim();
                    currentPiece.push(newString);
                }

                pieces.push(currentPiece);
                currentPiece = [];
                beginInd = ind + 1;
            }
        }

        if (s.length > beginInd) {
            let newString = s.substring(beginInd, s.length).trim();
            currentPiece.push(newString);
        }
    }

    // parens didn't match, so return failure
    if (Nparens !== 0) {
        return { success: false };
    }

    pieces.push(currentPiece);

    return {
        success: true,
        pieces: pieces,
    };
}

function findFirstUnmatchedClosingParens(components) {
    let Nparens = 0;

    for (let [componentInd, component] of components.entries()) {
        if (typeof component === "string") {
            let s = component;

            for (let charInd = 0; charInd < s.length; charInd++) {
                let char = s[charInd];
                if (char === "(") {
                    Nparens++;
                } else if (char === ")") {
                    if (Nparens === 0) {
                        // parens didn't match
                        return {
                            success: true,
                            componentInd,
                            charInd,
                        };
                    } else {
                        Nparens--;
                    }
                }
            }
        }
    }

    // never found a closing parenthesis that wasn't matched
    return { success: false };
}

function decodeXMLEntities(serializedComponents) {
    function replaceEntities(s) {
        return s
            .replace(/&apos;/g, "'")
            .replace(/&quot;/g, '"')
            .replace(/&gt;/g, ">")
            .replace(/&lt;/g, "<")
            .replace(/&dollar;/g, "$")
            .replace(/&amp;/g, "&");
    }

    for (let [ind, serializedComponent] of serializedComponents.entries()) {
        if (typeof serializedComponent === "string") {
            serializedComponents[ind] = replaceEntities(serializedComponent);
        } else {
            if (serializedComponent.children) {
                decodeXMLEntities(serializedComponent.children);
            }

            if (serializedComponent.attributes) {
                for (let attrName in serializedComponent.attributes) {
                    let attribute = serializedComponent.attributes[attrName];

                    if (attribute.component) {
                        decodeXMLEntities([attribute.component]);
                    } else if (attribute.primitive) {
                        if (typeof attribute.primitive === "string") {
                            attribute.primitive = replaceEntities(
                                attribute.primitive,
                            );
                        }
                    } else {
                        if (attribute.childrenForFutureComponent) {
                            decodeXMLEntities(
                                attribute.childrenForFutureComponent,
                            );
                        }
                        if (attribute.rawString) {
                            attribute.rawString = replaceEntities(
                                attribute.rawString,
                            );
                        }
                    }
                }
            }
        }
    }
}

export function applySugar({
    serializedComponents,
    parentParametersFromSugar = {},
    parentAttributes = {},
    componentInfoObjects,
    isAttributeComponent = false,
}) {
    let errors = [];
    let warnings = [];

    for (let component of serializedComponents) {
        if (typeof component !== "object") {
            continue;
        }

        try {
            let componentType = component.componentType;
            let componentClass =
                componentInfoObjects.allComponentClasses[componentType];
            if (!componentClass) {
                throw Error(`Unrecognized component type ${componentType}.`);
            }

            let componentAttributes = {};
            // add primitive attributes to componentAttributes
            for (let attrName in component.attributes) {
                let attribute = component.attributes[attrName];
                if (attribute.primitive !== undefined) {
                    componentAttributes[attrName] = attribute.primitive;
                }
            }

            if (component.children) {
                let newParentParametersFromSugar = {};

                if (!component.skipSugar) {
                    for (let sugarInstruction of componentClass.returnSugarInstructions()) {
                        // if (component.children.length === 0) {
                        //   break;
                        // }

                        let childTypes = component.children
                            .map((x) => (typeof x === "string" ? "s" : "n"))
                            .join("");

                        if (sugarInstruction.childrenRegex) {
                            let match = childTypes.match(
                                sugarInstruction.childrenRegex,
                            );

                            if (
                                !match ||
                                match[0].length !== component.children.length
                            ) {
                                // sugar pattern didn't match all children
                                // so don't apply sugar

                                continue;
                            }
                        }

                        let matchedChildren = deepClone(component.children);

                        let nNonStrings = 0;
                        for (let child of matchedChildren) {
                            if (typeof child !== "string") {
                                child.preSugarInd = nNonStrings;
                                nNonStrings++;
                            }
                        }

                        let createdFromMacro = false;
                        if (
                            component.doenetAttributes &&
                            component.doenetAttributes.createdFromMacro
                        ) {
                            createdFromMacro = true;
                        }

                        let sugarResults = sugarInstruction.replacementFunction(
                            {
                                matchedChildren,
                                parentParametersFromSugar,
                                parentAttributes,
                                componentAttributes,
                                componentInfoObjects,
                                isAttributeComponent,
                                createdFromMacro,
                            },
                        );

                        // console.log("sugarResults")
                        // console.log(sugarResults)

                        if (sugarResults.warnings) {
                            warnings.push(
                                ...sugarResults.warnings.map((w) => {
                                    w.position = component.position;
                                    return w;
                                }),
                            );
                        }

                        if (sugarResults.success) {
                            let newChildren = sugarResults.newChildren;
                            let newAttributes = sugarResults.newAttributes;

                            let preSugarIndsFoundInChildren = [],
                                preSugarIndsFoundInAttributes = [];

                            if (newChildren) {
                                preSugarIndsFoundInChildren =
                                    findPreSugarIndsAndMarkFromSugar(
                                        newChildren,
                                    );
                            }
                            if (newAttributes) {
                                for (let attrName in newAttributes) {
                                    let comp =
                                        newAttributes[attrName].component;
                                    if (comp) {
                                        preSugarIndsFoundInAttributes.push(
                                            ...findPreSugarIndsAndMarkFromSugar(
                                                comp.children,
                                            ),
                                        );
                                    }
                                }
                            }

                            let preSugarIndsFound = [
                                ...preSugarIndsFoundInChildren,
                                ...preSugarIndsFoundInAttributes,
                            ];

                            if (
                                preSugarIndsFound.length !== nNonStrings ||
                                !preSugarIndsFound
                                    .sort((a, b) => a - b)
                                    .every((v, i) => v === i)
                            ) {
                                throw Error(
                                    `Invalid sugar for ${componentType} as didn't return set of original components`,
                                );
                            }

                            if (preSugarIndsFoundInChildren.length > 0) {
                                let sortedList = [
                                    ...preSugarIndsFoundInChildren,
                                ].sort((a, b) => a - b);
                                if (
                                    !sortedList.every(
                                        (v, i) =>
                                            v ===
                                            preSugarIndsFoundInChildren[i],
                                    )
                                ) {
                                    throw Error(
                                        `Invalid sugar for ${componentType} as didn't return original components in order`,
                                    );
                                }
                            }

                            if (sugarResults.parametersForChildrenSugar) {
                                Object.assign(
                                    newParentParametersFromSugar,
                                    sugarResults.parametersForChildrenSugar,
                                );
                            }

                            if (newChildren) {
                                component.children = newChildren;
                            } else {
                                component.children = [];
                            }

                            if (newAttributes) {
                                if (!component.attributes) {
                                    component.attributes = {};
                                }
                                Object.assign(
                                    component.attributes,
                                    newAttributes,
                                );
                            }
                        }
                    }
                }

                if (componentClass.removeBlankStringChildrenPostSugar) {
                    component.children = component.children.filter(
                        (x) => typeof x !== "string" || /\S/.test(x),
                    );
                }

                // Note: don't pass in isAttributeComponent
                // as that flag should be set just for the top level attribute component

                let res = applySugar({
                    serializedComponents: component.children,
                    parentParametersFromSugar: newParentParametersFromSugar,
                    parentAttributes: componentAttributes,
                    componentInfoObjects,
                });
                errors.push(...res.errors);
                warnings.push(...res.warnings);
            }

            if (component.attributes) {
                for (let attrName in component.attributes) {
                    let attribute = component.attributes[attrName];

                    if (attribute.component) {
                        let res = applySugar({
                            serializedComponents: [attribute.component],
                            parentAttributes: componentAttributes,
                            componentInfoObjects,
                            isAttributeComponent: true,
                        });
                        errors.push(...res.errors);
                        warnings.push(...res.warnings);
                    }
                }
            }
        } catch (e) {
            convertToErrorComponent(component, e.message);
            errors.push({
                message: e.message,
                position: component.position,
            });
        }
    }

    return { errors, warnings };
}
