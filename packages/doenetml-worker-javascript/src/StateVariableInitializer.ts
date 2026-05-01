import { deepClone, flattenDeep } from "@doenet/utils";
import {
    returnDefaultArrayVarNameFromPropIndex,
    returnDefaultGetArrayKeysFromVarName,
} from "./utils/stateVariables";

/**
 * Initializes state variables on a freshly-created component: walks the
 * component's `state` map (definitions produced by
 * `StateVariableDefinitionFactory`) and wires up each variable's runtime
 * representation — getters that resolve the value lazily, dependency
 * registration via `core.dependencies`, array entry materialization,
 * size-tracking variables for arrays, and prop-index-to-array-key
 * resolution.
 *
 * Critically, the per-state-variable getter must reach back through
 * `core.getStateVariableValue` rather than capturing a bound copy at
 * extraction time, so that when `getStateVariableValue` itself moves into
 * `StateVariableEvaluator` in Phase 4 the binding stays live.
 *
 * Holds a back-reference to Core to read `_components`,
 * `componentInfoObjects`, and to invoke `getStateVariableValue`,
 * `checkIfArrayEntry`, `matchPublicStateVariables`, `addDiagnostic`,
 * `createFromArrayEntry`, and `actionTriggerScheduler`.
 */
export class StateVariableInitializer {
    core: any;

    constructor({ core }: { core: any }) {
        this.core = core;
    }

    async initializeComponentStateVariables(component) {
        for (let stateVariable in component.state) {
            if (component.state[stateVariable].isAlias) {
                if (!component.stateVarAliases) {
                    component.stateVarAliases = {};
                }
                component.stateVarAliases[stateVariable] =
                    component.state[stateVariable].targetVariableName;

                // TODO: do we want to delete alias from state?
                delete component.state[stateVariable];
            } else {
                await this.initializeStateVariable({
                    component,
                    stateVariable,
                });
            }
        }
    }

    async initializeStateVariable({
        component,
        stateVariable,
        arrayStateVariable,
        arrayEntryPrefix,
    }) {
        let getStateVar = this.core.getStateVariableValue;
        if (!component.state[stateVariable]) {
            component.state[stateVariable] = {};
        }
        let stateVarObj = component.state[stateVariable];
        stateVarObj.isResolved = false;
        Object.defineProperty(stateVarObj, "value", {
            get: () => getStateVar({ component, stateVariable }),
            configurable: true,
        });
        // Object.defineProperty(stateVarObj, 'value', {
        //   get:
        //     async function () {
        //       try {
        //         return getStateVar({ component, stateVariable });
        //       } catch (e) {
        //         console.log(`got an error in getter`, e);
        //         throw e;
        //       }
        //     },
        //   configurable: true
        // });

        // Object.defineProperty(stateVarObj, 'value', { get: () => Promise.resolve(getStateVar({ component, stateVariable })), configurable: true });

        if (arrayEntryPrefix !== undefined) {
            await this.initializeArrayEntryStateVariable({
                stateVarObj,
                arrayStateVariable,
                arrayEntryPrefix,
                component,
                stateVariable,
            });
        } else if (stateVarObj.isArray) {
            await this.initializeArrayStateVariable({
                stateVarObj,
                component,
                stateVariable,
            });
        }

        if (stateVarObj.triggerActionOnChange) {
            let componentTriggers =
                this.core.stateVariableChangeTriggers[component.componentIdx];
            if (!componentTriggers) {
                componentTriggers = this.core.stateVariableChangeTriggers[
                    component.componentIdx
                ] = {};
            }
            componentTriggers[stateVariable] = {
                action: stateVarObj.triggerActionOnChange,
            };
        }
    }
    async initializeArrayEntryStateVariable({
        stateVarObj,
        arrayStateVariable,
        arrayEntryPrefix,
        component,
        stateVariable,
    }) {
        // This function used for initializing array entry variables
        // (not the original array variable)
        // It adds many attributes to state variables corresponding to
        // array entries, including
        // - arrayStateVariable: the name of the array for which this is an entry
        // - arrayKeys: an array of the key(s) that constitute this entry
        // - markStale: function from array state variable
        // - freshnessInfo: object from array state variable
        // - getValueFromArrayValues: function used to get this entry's value
        // - isLocation: array entries are locations if the array state variable is
        //   (See expanation of location in fixLocation state variable of BaseComponent.js)

        stateVarObj.isArrayEntry = true;

        stateVarObj.arrayStateVariable = arrayStateVariable;
        let arrayStateVarObj = component.state[arrayStateVariable];
        stateVarObj.definition = arrayStateVarObj.definition;
        stateVarObj.inverseDefinition = arrayStateVarObj.inverseDefinition;
        stateVarObj.markStale = arrayStateVarObj.markStale;
        stateVarObj.freshnessInfo = arrayStateVarObj.freshnessInfo;
        stateVarObj.getPreviousDependencyValuesForMarkStale =
            arrayStateVarObj.getPreviousDependencyValuesForMarkStale;
        stateVarObj.provideEssentialValuesInDefinition =
            arrayStateVarObj.provideEssentialValuesInDefinition;
        stateVarObj.providePreviousValuesInDefinition =
            arrayStateVarObj.providePreviousValuesInDefinition;
        stateVarObj.isLocation = arrayStateVarObj.isLocation;

        stateVarObj.numDimensions =
            arrayStateVarObj.returnEntryDimensions(arrayEntryPrefix);
        stateVarObj.entryPrefix = arrayEntryPrefix;
        stateVarObj.varEnding = stateVariable.slice(arrayEntryPrefix.length);

        if (arrayStateVarObj.createWorkspace) {
            stateVarObj.createWorkspace = true;
            stateVarObj.workspace = arrayStateVarObj.workspace;
        }

        if (arrayStateVarObj.basedOnArrayKeyStateVariables) {
            stateVarObj.basedOnArrayKeyStateVariables = true;
        }

        // if any of the additional state variables defined are arrays,
        // (which should be all of them)
        // transform to their array entry
        if (arrayStateVarObj.additionalStateVariablesDefined) {
            stateVarObj.additionalStateVariablesDefined = [];

            let entryPrefixInd =
                arrayStateVarObj.entryPrefixes.indexOf(arrayEntryPrefix);

            for (let varName of arrayStateVarObj.additionalStateVariablesDefined) {
                let sObj = component.state[varName];

                if (sObj.isArray) {
                    // find the same array entry prefix in the other array state variable
                    let newArrayEntryPrefix =
                        sObj.entryPrefixes[entryPrefixInd];
                    let arrayEntryVarName =
                        newArrayEntryPrefix + stateVarObj.varEnding;

                    stateVarObj.additionalStateVariablesDefined.push(
                        arrayEntryVarName,
                    );
                } else {
                    stateVarObj.additionalStateVariablesDefined.push(varName);
                }
            }
        }

        if (arrayStateVarObj.shadowingInstructions) {
            stateVarObj.shadowingInstructions = {};

            // See description of returnWrappingComponents in initializeArrayStateVariable, below.
            stateVarObj.wrappingComponents =
                arrayStateVarObj.shadowingInstructions.returnWrappingComponents(
                    arrayEntryPrefix,
                );

            if (arrayStateVarObj.shadowingInstructions.attributesToShadow) {
                stateVarObj.shadowingInstructions.attributesToShadow =
                    arrayStateVarObj.shadowingInstructions.attributesToShadow;
            }

            if (arrayStateVarObj.shadowingInstructions.createComponentOfType) {
                let entryPrefixInd =
                    arrayStateVarObj.entryPrefixes.indexOf(arrayEntryPrefix);
                if (
                    arrayStateVarObj.shadowingInstructions
                        .createComponentOfType[entryPrefixInd]
                ) {
                    stateVarObj.shadowingInstructions.createComponentOfType = [
                        arrayStateVarObj.shadowingInstructions
                            .createComponentOfType[entryPrefixInd],
                    ];
                }
            }
        }

        // Each arrayEntry state variable will have a function getValueFromArrayValue
        // that will be used to retrieve the actual value of the components
        // specified by this entry from the whole array stored in arrayValues
        // Note: getValueFromArrayValues assumes that arrayValues has been populated
        if (arrayStateVarObj.getEntryValues) {
            // the function getEntryValues must have been overwritten by the class
            // so use this function instead
            stateVarObj.getValueFromArrayValues = async function () {
                return await arrayStateVarObj.getEntryValues({
                    varName: stateVariable,
                });
            };
        } else {
            // getValueFromArrayValues returns an array of the values
            // that correspond to the arrayKeys of this entry state variable
            // (returning a scalar instead if it is just a single value)
            // It uses the function getArrayValue, which gets the values
            // from arrayValues of the corresponding array state variable
            stateVarObj.getValueFromArrayValues = async function () {
                let arrayKeys = await stateVarObj.arrayKeys;
                if (arrayKeys.length === 0) {
                    return;
                }
                let value = [];
                for (let arrayKey of arrayKeys) {
                    value.push(arrayStateVarObj.getArrayValue({ arrayKey }));
                }
                if (value.length === 1) {
                    return value[0];
                } else {
                    return value;
                }
            };
        }

        stateVarObj.arraySizeStateVariable =
            arrayStateVarObj.arraySizeStateVariable;

        stateVarObj._arrayKeys = [];
        stateVarObj._unflattenedArrayKeys = [];

        Object.defineProperty(stateVarObj, "arrayKeys", {
            get: function () {
                return (async () => {
                    // first evaluate arraySize so _arrayKeys is recalculated
                    // in case arraySize change
                    await arrayStateVarObj.arraySize;
                    return stateVarObj._arrayKeys;
                })();
            },
        });

        Object.defineProperty(stateVarObj, "unflattenedArrayKeys", {
            get: function () {
                return (async () => {
                    // first evaluate arraySize so _unflattenedArrayKeys is recalculated
                    // in case arraySize change
                    await arrayStateVarObj.arraySize;
                    return stateVarObj._unflattenedArrayKeys;
                })();
            },
        });

        if (
            component.state[stateVarObj.arraySizeStateVariable]
                .initiallyResolved
        ) {
            let arraySize = await arrayStateVarObj.arraySize;
            let arrayKeys = arrayStateVarObj.getArrayKeysFromVarName({
                arrayEntryPrefix: stateVarObj.entryPrefix,
                varEnding: stateVarObj.varEnding,
                arraySize,
                numDimensions: arrayStateVarObj.numDimensions,
            });

            stateVarObj._unflattenedArrayKeys = arrayKeys;
            stateVarObj._arrayKeys = flattenDeep(arrayKeys);

            // for each arrayKey, add this entry name to the array's list variables
            let varNamesIncluding = arrayStateVarObj.varNamesIncludingArrayKeys;
            for (let arrayKey of stateVarObj._arrayKeys) {
                if (!varNamesIncluding[arrayKey]) {
                    varNamesIncluding[arrayKey] = [];
                }
                varNamesIncluding[arrayKey].push(stateVariable);
            }
        }

        arrayStateVarObj.arrayEntryNames.push(stateVariable);

        Object.defineProperty(stateVarObj, "arraySize", {
            get: () => arrayStateVarObj.arraySize,
        });

        // TODO: delete since arrayEntrySize isn't currently used?
        Object.defineProperty(stateVarObj, "arrayEntrySize", {
            get: function () {
                return (async () => {
                    // assume array is rectangular, so just look at first subarray of each dimension
                    let unflattenedArrayKeys =
                        await stateVarObj.unflattenedArrayKeys;
                    let arrayEntrySize = [];
                    let subArray = [unflattenedArrayKeys];
                    for (let i = 0; i < stateVarObj.numDimensions; i++) {
                        subArray = subArray[0];
                        arrayEntrySize.push(subArray.length);
                    }
                    arrayEntrySize.reverse(); // so starts with inner dimension
                    return arrayEntrySize;
                })();
            },
        });

        if (arrayStateVarObj.stateVariablesDeterminingDependencies) {
            if (!stateVarObj.stateVariablesDeterminingDependencies) {
                stateVarObj.stateVariablesDeterminingDependencies = [];
            }

            for (let varName of arrayStateVarObj.stateVariablesDeterminingDependencies) {
                if (
                    !stateVarObj.stateVariablesDeterminingDependencies.includes(
                        varName,
                    )
                ) {
                    stateVarObj.stateVariablesDeterminingDependencies.push(
                        varName,
                    );
                }
            }
        }

        // add a returnDependencies function based on the array returnDependencies
        let arrayReturnDependencies =
            arrayStateVarObj.returnDependencies.bind(arrayStateVarObj);
        stateVarObj.returnDependencies = async function (args) {
            // add array size to argument of return dependencies
            args.arraySize = await stateVarObj.arraySize;
            args.arrayKeys = await stateVarObj.arrayKeys;
            let dependencies = await arrayReturnDependencies(args);

            // We keep track of how many names were defined when we calculate dependencies
            // If this number changes, it should be treated as dependencies changing
            // so that we recalculate the value of the arrayEntry variable
            // TODO: we are communicating this to updateDependencies by adding
            // an attribute to the arguments?  Is there a better way of doing it.
            // Didn't want to add to the return value, as that would add complexity
            // to how we normally define returnDependencies
            // We could change returnDependencies to output an object.
            // That would probably be cleaner.
            let numNames = Object.keys(
                arrayStateVarObj.dependencyNames.namesByKey,
            ).length;
            if (stateVarObj.numberNamesInPreviousReturnDep !== numNames) {
                args.changedDependency = true;
            }
            stateVarObj.numberNamesInPreviousReturnDep = numNames;

            return dependencies;
        };
    }

    async initializeArrayStateVariable({
        stateVarObj,
        component,
        stateVariable,
    }) {
        // This function used for initializing original array variables
        // (not array entry variables)

        // Arrays values are stored in a (possibly-multidimensional) array
        // called arrayValues.  However, so that core doesn't have to deal
        // with special cases for multiple dimensions, array values are typically
        // referenced with an arrayKey, which is a single string that corresponds
        // to a single entry in the array.
        // For one dimension, index is an integer and arrayKey is its string representation
        // For multiple dimensions, index is an array of integers, e.g. [i,j,k]
        // and arrayKey is its string representation, i.e., "i,j,k"

        // The function adds attributes to array state variables, including
        // - arrayValues: the array of the current values of the array
        //   (i.e., based on index rather than arrayKey)
        //   arrayValues is used rather than value given that value is
        //   sometimes deleted and replaced by a getter.  arrayValues is
        //   never deleted, but entries are marked as stale using freshnessInfo
        // - freshnessInfo: this object can be used to track information about the
        //   freshness of the array entries or other array features, such as size.
        //   freshnessInfo is prepopulated with
        //     - a freshByKey object for tracking by key
        //     - a freshArraySize for tracking array size
        //   To take advantage of this object, a component can read and modify
        //   freshnessInfo (as core will pass it in as an argument) in
        //   - the state variable's definition function
        //     (to short circuit calculation of something that is already fresh and/or
        //     to indicate what is now fresh)
        //   - the state variable's optional markStale function
        //     (to indicate what is no longer fresh)
        // - keyToIndex: maps arrayKey (single string) to (multi-)index
        // - indexToKey: maps (multi-)index to arrayKey
        // - setArrayValue: sets value in arrayValues corresponding to arrayKey
        // - getArrayValue: gets value in arrayValues corresponding to arrayKey
        // - getArrayKeysFromVarName: returns array of the arrayKeys that correspond
        //   to a given variable name of an array entry
        // - arrayVarNameFromArrayKey: returns the variable name of an array entry
        //   that contains a given array key (if there are many, just return one)
        //   This variable may not yet be created.

        let core = this;

        stateVarObj.arrayValues = [];

        if (stateVarObj.numDimensions === undefined) {
            stateVarObj.numDimensions = 1;
        }

        let entryPrefixes = stateVarObj.entryPrefixes;

        if (!entryPrefixes) {
            entryPrefixes = stateVarObj.entryPrefixes = [stateVariable];
        }

        if (!component.arrayEntryPrefixes) {
            component.arrayEntryPrefixes = {};
        }
        for (let prefix of entryPrefixes) {
            component.arrayEntryPrefixes[prefix] = stateVariable;
        }

        if (stateVarObj.numDimensions > 1) {
            // for multiple dimensions, have to convert from arrayKey
            // to multi-index when getting or setting
            // Note: we don't check that arrayKey has the appropriate number of dimensions
            // If it has fewer dimensions than numDimensions, it will set the slice
            // to the given value
            // (useful, for example, to set entire rows)
            // If it has more dimensinos than numDimensions, behavior isn't determined
            // (it should throw an error, assuming the array entries aren't arrays)
            stateVarObj.keyToIndex = (key) =>
                key.split(",").map((x) => Number(x));
            stateVarObj.setArrayValue = function ({
                value,
                arrayKey,
                arraySize,
                arrayValues = stateVarObj.arrayValues,
            }) {
                let index = stateVarObj.keyToIndex(arrayKey);
                let numDimensionsInArrayKey = index.length;
                if (!numDimensionsInArrayKey > stateVarObj.numDimensions) {
                    core.addDiagnostic({
                        type: "info",
                        message:
                            "Cannot set array value.  Number of dimensions is too large.",
                        position: component.position,
                        sourceDoc: component.sourceDoc,
                    });
                    return { nFailures: 1 };
                }
                let arrayValuesDrillDown = arrayValues;
                let arraySizeDrillDown = arraySize;
                for (let indComponent of index.slice(0, index.length - 1)) {
                    if (
                        indComponent >= 0 &&
                        indComponent < arraySizeDrillDown[0]
                    ) {
                        if (!arrayValuesDrillDown[indComponent]) {
                            arrayValuesDrillDown[indComponent] = [];
                        }
                        arrayValuesDrillDown =
                            arrayValuesDrillDown[indComponent];
                        arraySizeDrillDown = arraySizeDrillDown.slice(1);
                    } else {
                        core.addDiagnostic({
                            type: "info",
                            message: "ignore setting array value out of bounds",
                            position: component.position,
                            sourceDoc: component.sourceDoc,
                        });
                        return { nFailures: 1 };
                    }
                }

                let nFailures = 0;

                if (numDimensionsInArrayKey < stateVarObj.numDimensions) {
                    // if dimensions from arrayKey is less than number of dimensions
                    // then attempt to get additional dimensions from
                    // array indices of value

                    let setArrayValuesPiece = function (
                        desiredValue,
                        arrayValuesPiece,
                        arraySizePiece,
                    ) {
                        // try to set value of entries of arrayValuePiece to entries of desiredValue
                        // given that size of arrayValuesPieces is arraySizePiece

                        if (!Array.isArray(desiredValue)) {
                            core.addDiagnostic({
                                type: "info",
                                message:
                                    "ignoring array values with insufficient dimensions",
                                position: component.position,
                                sourceDoc: component.sourceDoc,
                            });
                            return { nFailures: 1 };
                        }

                        let nFailuresSub = 0;

                        let currentSize = arraySizePiece[0];
                        if (desiredValue.length > currentSize) {
                            core.addDiagnostic({
                                type: "info",
                                message: "ignoring array values of out bounds",
                                position: component.position,
                                sourceDoc: component.sourceDoc,
                            });
                            nFailuresSub += desiredValue.length - currentSize;
                            desiredValue = desiredValue.slice(0, currentSize);
                        }

                        if (arraySizePiece.length === 1) {
                            // down to last dimension
                            for (let [ind, val] of desiredValue.entries()) {
                                arrayValuesPiece[ind] = val;
                            }
                        } else {
                            for (let [ind, val] of desiredValue.entries()) {
                                if (!arrayValuesPiece[ind]) {
                                    arrayValuesPiece = [];
                                }
                                let result = setArrayValuesPiece(
                                    val,
                                    arrayValuesPiece[ind],
                                    arraySizePiece[ind],
                                );
                                nFailuresSub += result.nFailures;
                            }
                        }

                        return { nFailures: nFailuresSub };
                    };

                    let result = setArrayValuesPiece(
                        value,
                        arrayValuesDrillDown,
                        arraySizeDrillDown,
                    );
                    nFailures += result.nFailures;
                } else {
                    arrayValuesDrillDown[index[index.length - 1]] = value;
                }

                return { nFailures };
            };
            stateVarObj.getArrayValue = function ({
                arrayKey,
                arrayValues = stateVarObj.arrayValues,
            }) {
                let index = stateVarObj.keyToIndex(arrayKey);
                let aVals = arrayValues;
                for (let indComponent of index.slice(0, index.length - 1)) {
                    aVals = aVals[indComponent];
                    if (!aVals) {
                        return undefined;
                    }
                }
                return aVals[index[index.length - 1]];
            };

            if (!stateVarObj.getAllArrayKeys) {
                stateVarObj.getAllArrayKeys = function (
                    arraySize,
                    flatten = true,
                    desiredSize,
                ) {
                    function prependToAllKeys(keys, newStuff) {
                        for (let [ind, key] of keys.entries()) {
                            if (Array.isArray(key)) {
                                prependToAllKeys(key, newStuff);
                            } else {
                                keys[ind] = newStuff + "," + key;
                            }
                        }
                    }

                    function getAllArrayKeysSub(subArraySize) {
                        if (subArraySize.length === 1) {
                            // array of numbers from 0 to subArraySize[0], cast to strings
                            return Array.from(Array(subArraySize[0]), (_, i) =>
                                String(i),
                            );
                        } else {
                            let currentSize = subArraySize[0];
                            let subSubKeys = getAllArrayKeysSub(
                                subArraySize.slice(1),
                            );
                            let subKeys = [];
                            for (let ind = 0; ind < currentSize; ind++) {
                                if (flatten) {
                                    subKeys.push(
                                        ...subSubKeys.map((x) => ind + "," + x),
                                    );
                                } else {
                                    let newSubSubKeys = deepClone(subSubKeys);
                                    prependToAllKeys(newSubSubKeys, ind);
                                    subKeys.push(newSubSubKeys);
                                }
                            }
                            return subKeys;
                        }
                    }

                    if (desiredSize) {
                        if (desiredSize.length === 0) {
                            return [];
                        } else {
                            return getAllArrayKeysSub(desiredSize);
                        }
                    } else if (!arraySize || arraySize.length === 0) {
                        return [];
                    } else {
                        return getAllArrayKeysSub(arraySize);
                    }
                };
            }

            if (!stateVarObj.arrayVarNameFromArrayKey) {
                stateVarObj.arrayVarNameFromArrayKey = function (arrayKey) {
                    return (
                        entryPrefixes[0] +
                        arrayKey
                            .split(",")
                            .map((x) => Number(x) + 1)
                            .join("_")
                    );
                };
            }

            // arrayVarNameFromPropIndex is a function that calculates the name
            // an array entry state variable that corresponds to the specified propIndex.
            // It is a consequence of retrofitting the ability to index an array (e.g., $a.b[1])
            // onto a system that was designed with just array entry variables (e..g, $a.b1).
            // arrayVarNameFromPropIndex can be specified in the definition of the array state variable.
            // Since numDimensions > 1 here, the default arrayVarNameFromPropIndex
            // is to turn $a.b[1][2][3] to $a.p1_2_3,
            // where "p" is the first entry prefix of the array "b".

            // TODO: if we redesign arrays to be based on indices (or even slices),
            // then arrayVarNameFromPropIndex will be obsolete.
            if (!stateVarObj.arrayVarNameFromPropIndex) {
                stateVarObj.arrayVarNameFromPropIndex =
                    returnDefaultArrayVarNameFromPropIndex(
                        stateVarObj.numDimensions,
                        entryPrefixes[0],
                    );
            }

            stateVarObj.adjustArrayToNewArraySize = async function () {
                function resizeSubArray(subArray, subArraySize) {
                    subArray.length = subArraySize[0];

                    if (subArraySize.length > 1) {
                        let subSubArraySize = subArraySize.slice(1);
                        for (let [ind, subSubArray] of subArray.entries()) {
                            if (!subSubArray) {
                                // add in any empty entries
                                subSubArray = subArray[ind] = [];
                            }
                            resizeSubArray(subSubArray, subSubArraySize);
                        }
                    }
                }

                let arraySize = await stateVarObj.arraySize;
                resizeSubArray(stateVarObj.arrayValues, arraySize);
            };
        } else {
            // have just one dimension
            stateVarObj.keyToIndex = (key) => Number(key);
            stateVarObj.setArrayValue = function ({
                value,
                arrayKey,
                arraySize,
                arrayValues = stateVarObj.arrayValues,
            }) {
                let ind = stateVarObj.keyToIndex(arrayKey);
                if (ind >= 0 && ind < arraySize[0]) {
                    arrayValues[ind] = value;
                    return { nFailures: 0 };
                } else {
                    core.addDiagnostic({
                        type: "info",
                        message: `Ignoring setting array values out of bounds: ${arrayKey} of ${stateVariable}`,
                        position: component.position,
                        sourceDoc: component.sourceDoc,
                    });
                    return { nFailures: 1 };
                }
            };
            stateVarObj.getArrayValue = function ({
                arrayKey,
                arrayValues = stateVarObj.arrayValues,
            }) {
                return arrayValues[arrayKey];
            };

            if (!stateVarObj.getAllArrayKeys) {
                stateVarObj.getAllArrayKeys = function (
                    arraySize,
                    flatten,
                    desiredSize,
                ) {
                    if (desiredSize) {
                        if (desiredSize.length === 0) {
                            return [];
                        } else {
                            // array of numbers from 0 to desiredSize[0], cast to strings
                            return Array.from(Array(desiredSize[0]), (_, i) =>
                                String(i),
                            );
                        }
                    } else if (!arraySize || arraySize.length === 0) {
                        return [];
                    } else {
                        // array of numbers from 0 to arraySize[0], cast to strings
                        return Array.from(Array(arraySize[0]), (_, i) =>
                            String(i),
                        );
                    }
                };
            }

            if (!stateVarObj.arrayVarNameFromArrayKey) {
                stateVarObj.arrayVarNameFromArrayKey = function (arrayKey) {
                    return entryPrefixes[0] + String(Number(arrayKey) + 1);
                };
            }

            // arrayVarNameFromPropIndex is a function that calculates the name
            // an array entry state variable that corresponds to the specified propIndex.
            // It is a consequence of retrofitting the ability to index an array (e.g., $a.b[1])
            // onto a system that was designed with just array entry variables (e..g, $a.b1).
            // arrayVarNameFromPropIndex can be specified in the definition of the array state variable.
            // Since numDimensions = 1 here, the default arrayVarNameFromPropIndex
            // is to turn $a.b[1] to $a.p1,
            // where "p" is the first entry prefix of the array "b".

            // TODO: if we redesign arrays to be based on indices (or even slices),
            // then arrayVarNameFromPropIndex will be obsolete.
            if (!stateVarObj.arrayVarNameFromPropIndex) {
                stateVarObj.arrayVarNameFromPropIndex =
                    returnDefaultArrayVarNameFromPropIndex(1, entryPrefixes[0]);
            }

            stateVarObj.adjustArrayToNewArraySize = async function () {
                // console.log(`adjust array ${stateVariable} of ${component.componentIdx} to new array size: ${stateVarObj.arraySize[0]}`);
                let arraySize = await stateVarObj.arraySize;
                stateVarObj.arrayValues.length = arraySize[0];
            };
        }

        if (!stateVarObj.getArrayKeysFromVarName) {
            stateVarObj.getArrayKeysFromVarName =
                returnDefaultGetArrayKeysFromVarName(stateVarObj.numDimensions);
        }

        // converting from index to key is the same for single and multiple
        // dimensions, as we just want the string representation
        stateVarObj.indexToKey = (index) => String(index);

        if (!stateVarObj.returnEntryDimensions) {
            stateVarObj.returnEntryDimensions = () => 0;
        }

        if (stateVarObj.shadowingInstructions) {
            // returnWrappingComponents is a function that returns the wrapping components for
            // - the whole array (if called with no arguments), or
            // - an array entry (if called with an array entry prefix as the argument)
            // It returns wrappingComponents, which is an array of arrays.
            // Each inner array corresponds to a dimension of the array,
            // starting with the inner dimension,
            // so that wrappingComponents[numDimensions-1], if it exists,
            // corresponds to the wrapping of the entire array (or array entry),
            // leading to the return of a single component.
            // Each element of the inner array indicates a wrapping of the corresponding dimension,
            // and they are applied in reverse order.
            // Each element can be either:
            // - a string corresponding to the component type used to wrap
            // - an object with fields:
            //   - componentType: a string corresponding to the component type used to wrap
            //   - isAttributeNamed: a string giving the name of the attribute that this
            //     wrapping component should be for the wrapping component immediately preceding
            //     (no effect if isAttributeNamed appears in the first wrapping component)
            // Unless the subsequent wrapping component has been designated isAttributeNamed,
            // each wrapping component takes as children either
            // - the subsequent wrapping component if it exists,
            // - else the original array components.
            //
            // TODO: wrapping components (like most array features) was designed before
            // we had array indexing such as $a.b[1].
            // Hence it is based on array entries such as $a.b1, where b is the "prefix".
            // $a.b[1] has to be converted to something like $a.b1
            // before calculating wrapping components.
            // We should rework wrapping components (and other array features)
            // to make array indexing (maybe even including slices) be the basis.

            if (!stateVarObj.shadowingInstructions.returnWrappingComponents) {
                stateVarObj.shadowingInstructions.returnWrappingComponents = (
                    prefix,
                ) => [];
            }
            stateVarObj.wrappingComponents =
                stateVarObj.shadowingInstructions.returnWrappingComponents();
        }

        stateVarObj.usedDefaultByArrayKey = {};

        stateVarObj.arrayEntryNames = [];
        stateVarObj.varNamesIncludingArrayKeys = {};

        let allStateVariablesAffected = [stateVariable];
        if (stateVarObj.additionalStateVariablesDefined) {
            allStateVariablesAffected.push(
                ...stateVarObj.additionalStateVariablesDefined,
            );
        }

        // create the definition, etc., functions for the array state variable

        // create returnDependencies function from returnArrayDependenciesByKey
        stateVarObj.returnDependencies = async function (args) {
            // console.log(`return dependencies for array ${stateVariable} of ${component.componentIdx}`)
            // console.log(JSON.parse(JSON.stringify(args)));

            args.arraySize = await stateVarObj.arraySize;

            // delete the internally added dependencies from args.stateValues
            for (let key in args.stateValues) {
                if (key.slice(0, 8) === "__array_") {
                    delete args.stateValues[key];
                }
            }

            if (args.arrayKeys === undefined) {
                args.arrayKeys = stateVarObj.getAllArrayKeys(args.arraySize);
            }

            // link all dependencyNames of additionalStateVariablesDefined
            // to the same object, as they will share the same freshnessinfo
            // TODO: a better idea?  This seems like it could lead to confusion.
            if (!stateVarObj.dependencyNames) {
                stateVarObj.dependencyNames = {
                    namesByKey: {},
                    keysByName: {},
                    global: [],
                };
                if (stateVarObj.additionalStateVariablesDefined) {
                    for (let vName of stateVarObj.additionalStateVariablesDefined) {
                        component.state[vName].dependencyNames =
                            stateVarObj.dependencyNames;
                    }
                }
            }

            let dependencies = {};

            if (
                stateVarObj.basedOnArrayKeyStateVariables &&
                args.arrayKeys.length > 1
            ) {
                for (let arrayKey of args.arrayKeys) {
                    for (let vName of allStateVariablesAffected) {
                        let sObj = component.state[vName];
                        dependencies[vName + "_" + arrayKey] = {
                            dependencyType: "stateVariable",
                            variableName:
                                sObj.arrayVarNameFromArrayKey(arrayKey),
                        };
                    }
                }
            } else {
                let arrayDependencies =
                    stateVarObj.returnArrayDependenciesByKey(args);

                if (arrayDependencies.globalDependencies) {
                    stateVarObj.dependencyNames.global = Object.keys(
                        arrayDependencies.globalDependencies,
                    );
                    Object.assign(
                        dependencies,
                        arrayDependencies.globalDependencies,
                    );
                }

                if (!arrayDependencies.dependenciesByKey) {
                    arrayDependencies.dependenciesByKey = {};
                }

                for (let arrayKey of args.arrayKeys) {
                    // namesByKey also functions to indicate that dependencies
                    // have been returned for that arrayKey

                    // If had additional nameByKey, it should be treated as dependencies changing
                    // so that we recalculate the value of the array variable
                    // TODO: we are communicating this to updateDependencies by adding
                    // an attribute to the arguments?  Is there a better way of doing it.
                    // Didn't want to add to the return value, as that would add complexity
                    // to how we normally define returnDependencies
                    // We could change returnDependencies to output an object.
                    // That would probably be cleaner.
                    if (!(arrayKey in stateVarObj.dependencyNames.namesByKey)) {
                        args.changedDependency = true;
                    }
                    stateVarObj.dependencyNames.namesByKey[arrayKey] = {};
                    for (let depName in arrayDependencies.dependenciesByKey[
                        arrayKey
                    ]) {
                        let extendedDepName = "__" + arrayKey + "_" + depName;
                        dependencies[extendedDepName] =
                            arrayDependencies.dependenciesByKey[arrayKey][
                                depName
                            ];
                        stateVarObj.dependencyNames.namesByKey[arrayKey][
                            depName
                        ] = extendedDepName;
                        if (
                            !stateVarObj.dependencyNames.keysByName[
                                extendedDepName
                            ]
                        ) {
                            stateVarObj.dependencyNames.keysByName[
                                extendedDepName
                            ] = [];
                        }
                        if (
                            !stateVarObj.dependencyNames.keysByName[
                                extendedDepName
                            ].includes(arrayKey)
                        ) {
                            stateVarObj.dependencyNames.keysByName[
                                extendedDepName
                            ].push(arrayKey);
                        }
                    }
                }

                // to tie into making sure array size is a dependency, below
                stateVarObj.dependencyNames.global.push("__array_size");
            }

            // make sure array size is a dependency
            dependencies.__array_size = {
                dependencyType: "stateVariable",
                variableName: stateVarObj.arraySizeStateVariable,
            };

            // console.log(`resulting dependencies for ${stateVariable} of ${component.componentIdx}`)
            // console.log(dependencies)
            return dependencies;
        };

        stateVarObj.getCurrentFreshness = function ({
            freshnessInfo,
            arrayKeys,
            arraySize,
        }) {
            // console.log(`getCurrentFreshness for array ${stateVariable} of ${component.componentIdx}`)
            // console.log(arrayKeys, arraySize);
            // console.log(JSON.parse(JSON.stringify(freshnessInfo)))

            if (arrayKeys === undefined) {
                arrayKeys = stateVarObj.getAllArrayKeys(arraySize);
            }

            let freshByKey = freshnessInfo.freshByKey;

            let numberFresh = freshnessInfo.freshArraySize ? 1 : 0;
            for (let arrayKey of arrayKeys) {
                if (freshByKey[arrayKey]) {
                    numberFresh += 1;
                }
            }

            if (numberFresh > 0) {
                if (numberFresh === arrayKeys.length + 1) {
                    return { fresh: { [stateVariable]: true } };
                } else {
                    return { partiallyFresh: { [stateVariable]: numberFresh } };
                }
            } else {
                return { fresh: { [stateVariable]: false } };
            }
        };

        stateVarObj.markStale = function ({
            freshnessInfo,
            changes,
            arrayKeys,
            arraySize,
        }) {
            // console.log(`markStale for array ${stateVariable} of ${component.componentIdx}`)
            // console.log(changes, arrayKeys, arraySize);
            // console.log(JSON.parse(JSON.stringify(freshnessInfo)))

            let result = {};

            if (arrayKeys === undefined) {
                arrayKeys = stateVarObj.getAllArrayKeys(arraySize);
            }

            if (stateVarObj.markStaleByKey) {
                result = stateVarObj.markStaleByKey({ arrayKeys, changes });
            }

            let freshByKey = freshnessInfo.freshByKey;

            if (changes.__array_size) {
                freshnessInfo.freshArraySize = false;
                // everything is stale
                freshnessInfo.freshByKey = {};
                result.fresh = { [stateVariable]: false };
                return result;
            }

            if (Object.keys(freshByKey).length === 0) {
                // everything is stale, except possibly array size
                // (check for nothing fresh as a shortcut, as mark stale could
                // be called repeated if size doesn't change, given that it's partially fresh)
                freshnessInfo.freshByKey = {};
                if (freshnessInfo.freshArraySize) {
                    result.partiallyFresh = { [stateVariable]: 1 };
                    return result;
                } else {
                    result.fresh = { [stateVariable]: false };
                    return result;
                }
            }

            for (let changeName in changes) {
                if (stateVarObj.dependencyNames.global.includes(changeName)) {
                    // everything is stale, except possible array size
                    freshnessInfo.freshByKey = {};
                    if (freshnessInfo.freshArraySize) {
                        result.partiallyFresh = { [stateVariable]: 1 };
                        return result;
                    } else {
                        result.fresh = { [stateVariable]: false };
                        return result;
                    }
                }

                if (
                    stateVarObj.basedOnArrayKeyStateVariables &&
                    arrayKeys.length > 1
                ) {
                    delete freshByKey[changeName];
                } else {
                    for (let key of stateVarObj.dependencyNames.keysByName[
                        changeName
                    ]) {
                        delete freshByKey[key];
                    }
                }
            }

            // check if the array keys requested are fresh
            let numberFresh = freshnessInfo.freshArraySize ? 1 : 0;
            for (let arrayKey of arrayKeys) {
                if (freshByKey[arrayKey]) {
                    numberFresh += 1;
                }
            }

            // console.log(`ending freshness`)
            // console.log(JSON.parse(JSON.stringify(freshnessInfo)))

            if (numberFresh > 0) {
                if (numberFresh === arrayKeys.length + 1) {
                    result.fresh = { [stateVariable]: true };
                    return result;
                } else {
                    result.partiallyFresh = { [stateVariable]: numberFresh };
                    return result;
                }
            } else {
                result.fresh = { [stateVariable]: false };
                return result;
            }
        };

        stateVarObj.freshenOnNoChanges = function ({
            arrayKeys,
            freshnessInfo,
            arraySize,
        }) {
            // console.log(`freshenOnNoChanges for ${stateVariable} of ${component.componentIdx}`)
            let freshByKey = freshnessInfo.freshByKey;

            if (arrayKeys === undefined) {
                arrayKeys = stateVarObj.getAllArrayKeys(arraySize);
            }

            for (let arrayKey of arrayKeys) {
                freshByKey[arrayKey] = true;
            }
        };

        function extractArrayDependencies(
            dependencyValues,
            arrayKeys,
            usedDefault,
        ) {
            // console.log(`extract array dependencies`, dependencyValues, arrayKeys, usedDefault)
            // console.log(JSON.parse(JSON.stringify(arrayKeys)))

            let globalDependencyValues = {};
            let globalUsedDefault = {};
            for (let dependencyName of stateVarObj.dependencyNames.global) {
                globalDependencyValues[dependencyName] =
                    dependencyValues[dependencyName];
                globalUsedDefault[dependencyName] = usedDefault[dependencyName];
            }

            let dependencyValuesByKey = {};
            let usedDefaultByKey = {};
            let foundAllDependencyValuesForKey = {};
            for (let arrayKey of arrayKeys) {
                dependencyValuesByKey[arrayKey] = {};
                usedDefaultByKey[arrayKey] = {};
                if (arrayKey in stateVarObj.dependencyNames.namesByKey) {
                    foundAllDependencyValuesForKey[arrayKey] = true;
                    for (let dependencyName in stateVarObj.dependencyNames
                        .namesByKey[arrayKey]) {
                        let extendedDepName =
                            stateVarObj.dependencyNames.namesByKey[arrayKey][
                                dependencyName
                            ];
                        if (extendedDepName in dependencyValues) {
                            dependencyValuesByKey[arrayKey][dependencyName] =
                                dependencyValues[extendedDepName];
                            usedDefaultByKey[arrayKey][dependencyName] =
                                usedDefault[extendedDepName];
                        } else {
                            foundAllDependencyValuesForKey[arrayKey] = false;
                        }
                    }
                }
            }

            return {
                globalDependencyValues,
                globalUsedDefault,
                dependencyValuesByKey,
                usedDefaultByKey,
                foundAllDependencyValuesForKey,
            };
        }

        stateVarObj.definition = function (args) {
            // console.log(`definition in array ${stateVariable} of ${component.componentIdx}`)
            // console.log(JSON.parse(JSON.stringify(args)));
            // console.log(args.arrayKeys)
            // console.log(args.dependencyValues)

            if (args.arrayKeys === undefined) {
                args.arrayKeys = stateVarObj.getAllArrayKeys(args.arraySize);
            }

            if (
                stateVarObj.basedOnArrayKeyStateVariables &&
                args.arrayKeys.length > 1
            ) {
                // if based on array key state variables and have more than one array key
                // then must have calculated all the relevant array keys
                // when retrieving the dependency values
                // Hence there is nothing to do, as arrayValues has been populated
                // with all the requisite values

                return {};
            } else {
                let extractedDeps = extractArrayDependencies(
                    args.dependencyValues,
                    args.arrayKeys,
                    args.usedDefault,
                );
                let globalDependencyValues =
                    extractedDeps.globalDependencyValues;
                let globalUsedDefault = extractedDeps.globalUsedDefault;
                let dependencyValuesByKey = extractedDeps.dependencyValuesByKey;
                let usedDefaultByKey = extractedDeps.usedDefaultByKey;
                let foundAllDependencyValuesForKey =
                    extractedDeps.foundAllDependencyValuesForKey;

                delete args.dependencyValues;
                args.globalDependencyValues = globalDependencyValues;
                args.globalUsedDefault = globalUsedDefault;
                args.dependencyValuesByKey = dependencyValuesByKey;
                args.usedDefaultByKey = usedDefaultByKey;

                let arrayKeysToRecalculate = [];
                let freshByKey = args.freshnessInfo.freshByKey;
                for (let arrayKey of args.arrayKeys) {
                    // only recalculate if
                    // - arrayKey isn't fresh, and
                    // - found all dependency values for array key (i.e., have calculated dependencies for arrayKey)
                    if (
                        !freshByKey[arrayKey] &&
                        foundAllDependencyValuesForKey[arrayKey]
                    ) {
                        freshByKey[arrayKey] = true;
                        arrayKeysToRecalculate.push(arrayKey);
                    }
                }

                let result;
                if (arrayKeysToRecalculate.length === 0) {
                    // console.log(`nothing to recalculate`)
                    // console.log(`was going to recalculate`, args.arrayKeys)
                    // console.log(JSON.parse(JSON.stringify(args.freshnessInfo)))
                    // console.log(JSON.parse(JSON.stringify(stateVarObj.dependencyNames)))
                    result = {};
                } else {
                    args.arrayKeys = arrayKeysToRecalculate;

                    if (!stateVarObj.arrayDefinitionByKey) {
                        throw Error(
                            `For ${stateVariable} of ${component.componentType}, arrayDefinitionByKey must be a function`,
                        );
                    }

                    result = stateVarObj.arrayDefinitionByKey(args);

                    // in case definition returns additional array entries,
                    // mark all array keys received as fresh as well
                    if (result.setValue && result.setValue[stateVariable]) {
                        for (let arrayKey in result.setValue[stateVariable]) {
                            freshByKey[arrayKey] = true;
                        }
                    }
                    if (
                        result.useEssentialOrDefaultValue &&
                        result.useEssentialOrDefaultValue[stateVariable]
                    ) {
                        for (let arrayKey in result.useEssentialOrDefaultValue[
                            stateVariable
                        ]) {
                            freshByKey[arrayKey] = true;
                        }
                    }
                }

                if (!args.freshnessInfo.freshArraySize) {
                    if (args.changes.__array_size) {
                        result.arraySizeChanged = [stateVariable];
                        if (stateVarObj.additionalStateVariablesDefined) {
                            for (let varName of stateVarObj.additionalStateVariablesDefined) {
                                // do we have to check if it is array?
                                if (component.state[varName].isArray) {
                                    result.arraySizeChanged.push(varName);
                                }
                            }
                        }
                    }
                    args.freshnessInfo.freshArraySize = true;
                }

                // console.log(`result of array definition of ${stateVariable} of ${component.componentIdx}`)
                // console.log(JSON.parse(JSON.stringify(result)))
                // console.log(JSON.parse(JSON.stringify(args.freshnessInfo)))
                return result;
            }
        };

        stateVarObj.inverseDefinition = function (args) {
            // console.log(`inverse definition args for ${stateVariable}`)
            // console.log(args)

            if (!stateVarObj.inverseArrayDefinitionByKey) {
                return { success: false };
            }

            if (args.arrayKeys === undefined) {
                args.arrayKeys = stateVarObj.getAllArrayKeys(args.arraySize);
            }

            if (
                stateVarObj.basedOnArrayKeyStateVariables &&
                args.arrayKeys.length > 1
            ) {
                let instructions = [];

                for (let vName of allStateVariablesAffected) {
                    for (let key in args.desiredStateVariableValues[vName]) {
                        let depName = vName + "_" + key;
                        if (depName in args.dependencyValues) {
                            instructions.push({
                                setDependency: depName,
                                desiredValue:
                                    args.desiredStateVariableValues[vName][key],
                                treatAsInitialChange: args.initialChange,
                            });
                        }
                    }
                }

                return {
                    success: true,
                    instructions,
                };
            } else {
                let extractedDeps = extractArrayDependencies(
                    args.dependencyValues,
                    args.arrayKeys,
                    args.usedDefault,
                );
                let globalDependencyValues =
                    extractedDeps.globalDependencyValues;
                let globalUsedDefault = extractedDeps.globalUsedDefault;
                let dependencyValuesByKey = extractedDeps.dependencyValuesByKey;
                let usedDefaultByKey = extractedDeps.usedDefaultByKey;
                // let foundAllDependencyValuesForKey = extractedDeps.foundAllDependencyValuesForKey;

                delete args.dependencyValues;
                args.globalDependencyValues = globalDependencyValues;
                args.globalUsedDefault = globalUsedDefault;
                args.dependencyValuesByKey = dependencyValuesByKey;
                args.usedDefaultByKey = usedDefaultByKey;

                args.dependencyNamesByKey =
                    stateVarObj.dependencyNames.namesByKey;

                if (!stateVarObj.allowExtraArrayKeysInInverse) {
                    // by default, inverseArrayDefinitionByKey does not need to be
                    // programmed defensively against arrayKeys that don't exist
                    // as they are filtered out here.
                    // However, if allowExtraArrayKeysInInverse, then we skip this
                    // filtering to allow the possibility that the array size
                    // could be changed.
                    let newDesiredStateVariableValues = {};
                    for (let vName in args.desiredStateVariableValues) {
                        newDesiredStateVariableValues[vName] = {};
                        for (let key in args.desiredStateVariableValues[
                            vName
                        ]) {
                            if (args.arrayKeys.includes(key)) {
                                newDesiredStateVariableValues[vName][key] =
                                    args.desiredStateVariableValues[vName][key];
                            }
                        }
                    }
                    args.desiredStateVariableValues =
                        newDesiredStateVariableValues;
                }

                let result = stateVarObj.inverseArrayDefinitionByKey(args);
                // console.log(`result of inverse definition of array`)
                // console.log(JSON.parse(JSON.stringify(result)))
                return result;
            }
        };

        await this.createArraySizeStateVariable({
            stateVarObj,
            component,
            stateVariable,
        });

        stateVarObj.arraySizeStale = true;
        stateVarObj.previousArraySize = [];

        Object.defineProperty(stateVarObj, "arraySize", {
            get: function () {
                return (async () => {
                    if (
                        !component.state[stateVarObj.arraySizeStateVariable]
                            .initiallyResolved
                    ) {
                        return [];
                    }
                    if (stateVarObj.arraySizeStale) {
                        await stateVarObj.recalculateArraySizeDependentQuantities();
                    }
                    return await component.stateValues[
                        stateVarObj.arraySizeStateVariable
                    ];
                })();
            },
        });

        stateVarObj.recalculateArraySizeDependentQuantities =
            async function () {
                let newArraySize =
                    await component.stateValues[
                        stateVarObj.arraySizeStateVariable
                    ];
                if (
                    stateVarObj.previousArraySize.length !==
                        newArraySize.length ||
                    stateVarObj.previousArraySize.some(
                        (v, i) => v != newArraySize[i],
                    )
                ) {
                    stateVarObj.previousArraySize = [...newArraySize];
                    let varNamesIncluding =
                        (stateVarObj.varNamesIncludingArrayKeys = {});
                    for (let entryName of stateVarObj.arrayEntryNames) {
                        let entryStateVarObj = component.state[entryName];
                        let arrayKeys = stateVarObj.getArrayKeysFromVarName({
                            arrayEntryPrefix: entryStateVarObj.entryPrefix,
                            varEnding: entryStateVarObj.varEnding,
                            arraySize: newArraySize,
                            numDimensions: stateVarObj.numDimensions,
                        });
                        entryStateVarObj._unflattenedArrayKeys = arrayKeys;
                        entryStateVarObj._arrayKeys = flattenDeep(arrayKeys);

                        // for each arrayKey, add this entry name to the array's list variables
                        for (let arrayKey of entryStateVarObj._arrayKeys) {
                            if (!varNamesIncluding[arrayKey]) {
                                varNamesIncluding[arrayKey] = [];
                            }
                            varNamesIncluding[arrayKey].push(entryName);
                        }
                    }
                }
                stateVarObj.arraySizeStale = false;
            };

        // link all freshnessInfo of additionalStateVariablesDefined
        // to the same object, as they will share the same freshnessinfo
        // TODO: a better idea?  This seems like it could lead to confusion.
        if (!stateVarObj.freshnessInfo) {
            stateVarObj.freshnessInfo = { freshByKey: {} };
            if (stateVarObj.additionalStateVariablesDefined) {
                for (let vName of stateVarObj.additionalStateVariablesDefined) {
                    if (!component.state[vName]) {
                        component.state[vName] = {};
                    }
                    component.state[vName].freshnessInfo =
                        stateVarObj.freshnessInfo;
                }
            }
        }
    }

    async createArraySizeStateVariable({
        stateVarObj,
        component,
        stateVariable,
    }) {
        let allStateVariablesAffected = [stateVariable];
        if (stateVarObj.additionalStateVariablesDefined) {
            allStateVariablesAffected.push(
                ...stateVarObj.additionalStateVariablesDefined,
            );
        }
        allStateVariablesAffected.sort();

        let arraySizeStateVar =
            `__array_size_` + allStateVariablesAffected.join("_");
        stateVarObj.arraySizeStateVariable = arraySizeStateVar;

        let originalStateVariablesDeterminingDependencies;
        let originalAdditionalStateVariablesDefined;

        // Make the array's dependencies depend on the array size state variable
        if (stateVarObj.stateVariablesDeterminingDependencies) {
            originalStateVariablesDeterminingDependencies = [
                ...stateVarObj.stateVariablesDeterminingDependencies,
            ];
            stateVarObj.stateVariablesDeterminingDependencies.push(
                arraySizeStateVar,
            );
        } else {
            stateVarObj.stateVariablesDeterminingDependencies = [
                arraySizeStateVar,
            ];
        }

        // If array size state variable has already been created,
        // either it was created due to being shadowed
        // or from an additional state variable defined.
        // If it is shadowing target array size state variable,
        // make it mark the array's arraySize as stale on markStale
        if (component.state[arraySizeStateVar]) {
            if (component.state[arraySizeStateVar].isShadow) {
                let arraySizeStateVarObj = component.state[arraySizeStateVar];
                arraySizeStateVarObj.markStale = function () {
                    for (let varName of allStateVariablesAffected) {
                        component.state[varName].arraySizeStale = true;
                    }
                    return {};
                };
            }
            return;
        }

        component.state[arraySizeStateVar] = {
            returnDependencies: stateVarObj.returnArraySizeDependencies,
            definition({ dependencyValues }) {
                let arraySize = stateVarObj.returnArraySize({
                    dependencyValues,
                });
                for (let [ind, value] of arraySize.entries()) {
                    if (!(Number.isInteger(value) && value >= 0)) {
                        arraySize[ind] = 0;
                    }
                }
                return { setValue: { [arraySizeStateVar]: arraySize } };
            },
            markStale() {
                for (let varName of allStateVariablesAffected) {
                    component.state[varName].arraySizeStale = true;
                }
                return {};
            },
        };

        if (stateVarObj.stateVariablesDeterminingArraySizeDependencies) {
            component.state[
                arraySizeStateVar
            ].stateVariablesDeterminingDependencies =
                stateVarObj.stateVariablesDeterminingArraySizeDependencies;
        }

        await this.initializeStateVariable({
            component,
            stateVariable: arraySizeStateVar,
        });
    }

    // arrayEntryNamesFromPropIndex is essentially a wrapper around
    // stateVarObj.arrayVarNameFromPropIndex.
    // (See above description of arrayVarNameFromPropIndex for technical debt commentary.)
    // It calls arrayVarNameFromPropIndex on each of an array of stateVariables,
    // first creating any missing array entry state variables,
    // logs diagnostics,
    // and returns an array of the resulting state variables.
    async arrayEntryNamesFromPropIndex({
        stateVariables,
        component,
        propIndex,
    }) {
        let newVarNames = [];
        for (let varName of stateVariables) {
            let stateVarObj = component.state[varName];
            if (!stateVarObj) {
                if (
                    !this.core.checkIfArrayEntry({
                        stateVariable: varName,
                        component,
                    }).isArrayEntry
                ) {
                    // varName doesn't exist.  Ignore error here
                    newVarNames.push(varName);
                    continue;
                }
                await this.core.createFromArrayEntry({
                    stateVariable: varName,
                    component,
                });
                stateVarObj = component.state[varName];
            }

            let newName;
            if (stateVarObj.isArray) {
                newName = stateVarObj.arrayVarNameFromPropIndex(
                    propIndex,
                    varName,
                );
            } else if (stateVarObj.isArrayEntry) {
                let arrayStateVarObj =
                    component.state[stateVarObj.arrayStateVariable];
                newName = arrayStateVarObj.arrayVarNameFromPropIndex(
                    propIndex,
                    varName,
                );
            } else {
                this.core.addDiagnostic({
                    type: "warning",
                    message: `Cannot get propIndex from ${varName} of ${component.componentIdx} as it is not an array or array entry state variable`,
                    position: component.position,
                    sourceDoc: component.sourceDoc,
                });
                newName = varName;
            }
            if (newName) {
                newVarNames.push(newName);
            } else {
                this.core.addDiagnostic({
                    type: "warning",
                    message: `Cannot get propIndex from ${varName} of ${component.componentIdx}`,
                    position: component.position,
                    sourceDoc: component.sourceDoc,
                });
                newVarNames.push(varName);
            }
        }

        return newVarNames;
    }

    recursivelyReplaceCompositesWithReplacements({
        replacements,
        recurseNonStandardComposites = false,
        forceExpandComposites = false,
        includeWithheldReplacements = false,
        stopIfHaveProp,
    }) {
        let compositesFound = [];
        let newReplacements = [];
        let unexpandedCompositesReady = [];
        let unexpandedCompositesNotReady = [];

        for (let replacement of replacements) {
            if (
                this.core.componentInfoObjects.isCompositeComponent({
                    componentType: replacement.componentType,
                    includeNonStandard: recurseNonStandardComposites,
                })
            ) {
                if (stopIfHaveProp) {
                    const checkForPublic = this.core.matchPublicStateVariables({
                        stateVariables: [stopIfHaveProp],
                        componentClass: replacement.constructor,
                    })[0];

                    if (!checkForPublic.startsWith("__not_public_")) {
                        // The composite has a public state variable that matches `stopIfHaveProp`.
                        // Therefore, we don't recurse to its replacements but treat the composite itself as the replacement
                        newReplacements.push(replacement);
                        continue;
                    }
                }

                compositesFound.push(replacement.componentIdx);

                if (!replacement.isExpanded) {
                    if (
                        replacement.state.readyToExpandWhenResolved.isResolved
                    ) {
                        unexpandedCompositesReady.push(
                            replacement.componentIdx,
                        );
                    } else {
                        unexpandedCompositesNotReady.push(
                            replacement.componentIdx,
                        );
                    }
                }

                if (replacement.isExpanded) {
                    let replacementReplacements = replacement.replacements;
                    if (
                        !includeWithheldReplacements &&
                        replacement.replacementsToWithhold > 0
                    ) {
                        replacementReplacements = replacementReplacements.slice(
                            0,
                            -replacement.replacementsToWithhold,
                        );
                    }
                    let recursionResult =
                        this.recursivelyReplaceCompositesWithReplacements({
                            replacements: replacementReplacements,
                            recurseNonStandardComposites,
                            forceExpandComposites,
                            includeWithheldReplacements,
                            stopIfHaveProp,
                        });
                    compositesFound.push(...recursionResult.compositesFound);
                    newReplacements.push(...recursionResult.newReplacements);
                    unexpandedCompositesReady.push(
                        ...recursionResult.unexpandedCompositesReady,
                    );
                    unexpandedCompositesNotReady.push(
                        ...recursionResult.unexpandedCompositesNotReady,
                    );
                } else {
                    newReplacements.push(replacement);
                }
            } else {
                newReplacements.push(replacement);
            }
        }

        return {
            compositesFound,
            newReplacements,
            unexpandedCompositesReady,
            unexpandedCompositesNotReady,
        };
    }
}
