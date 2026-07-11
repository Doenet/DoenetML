import type Core from "../Core";
import { deepClone, flattenDeep } from "@doenet/utils";
import type { ComponentInstance } from "../types/componentInstance";
import {
    returnDefaultArrayVarNameFromPropIndex,
    returnDefaultGetArrayKeysFromVarName,
} from "../utils/stateVariables";

/**
 * Initializes state variables on a freshly-created component: walks the
 * component's `state` map (definitions produced by
 * `StateVariableDefinitionFactory`) and wires up each variable's runtime
 * representation — getters that resolve the value lazily, array entry
 * materialization, size-tracking variables for arrays, and prop-index-to-
 * array-key resolution.
 *
 * To avoid one closure (plus captured context) per state variable per
 * component instance, the runtime behavior is provided by module-level
 * functions shared across all state variables (the same approach as the
 * `shadow*` functions in `StateVariableDefinitionFactory`). They read
 * their per-variable parameters from fields on the state-variable object
 * itself: `initializeStateVariable` stores the owning component as
 * `svComponent` and the variable's own name as `svVarName`, and the
 * shared functions reach core through `svComponent.coreFunctions`.
 *
 * Stateless — exported functions take a back-reference to Core to read
 * `stateVariableChangeTriggers` and to invoke `checkIfArrayEntry`,
 * `addDiagnostic`, and `createFromArrayEntry` (the shared runtime functions
 * instead reach core through `svComponent.coreFunctions`, as above). The
 * private helper `initializeArrayEntryStateVariable` needs none of these
 * and so does not take `core`.
 */

/**
 * The shared getter installed for `value` on every unresolved-or-stale
 * state variable. `this` is the state-variable object the property is
 * read from; evaluating the variable replaces the getter with a plain
 * data property (see `installStaleValueGetter`).
 */
function getStaleStateVariableValue(this: any) {
    return this.svComponent.coreFunctions.getStateVariableValue({
        component: this.svComponent,
        stateVariable: this.svVarName,
    });
}

// One shared descriptor: `Object.defineProperty` copies the attributes out
// of it, so reusing the object is safe.
const STALE_VALUE_DESCRIPTOR: PropertyDescriptor = Object.freeze({
    get: getStaleStateVariableValue,
    configurable: true,
});

/**
 * (Re-)install the lazy `value` getter on `stateVarObj`.
 *
 * Contract relied on elsewhere: `value` must remain an OWN accessor
 * property while unresolved/stale (StateVariableEvaluator and
 * StalenessPropagator detect staleness via
 * `Object.getOwnPropertyDescriptor(stateVarObj, "value")?.get`), and
 * evaluation replaces it with an own data property via
 * `delete stateVarObj.value` + plain assignment.
 */
export function installStaleValueGetter(stateVarObj: any) {
    delete stateVarObj.value;
    Object.defineProperty(stateVarObj, "value", STALE_VALUE_DESCRIPTOR);
}

// ─── Shared array-entry machinery ───────────────────────────────────────
// Module-level equivalents of what used to be per-entry closures in
// `initializeArrayEntryStateVariable`. `this` is the array-ENTRY
// state-variable object; the array it belongs to is reached via
// `this.svComponent.state[this.arrayStateVariable]` (a state-variable
// object's identity never changes once created, so the indirection is
// stable).

// Variant used when the class overrides `getEntryValues`.
async function entryGetValueViaGetEntryValues(this: any) {
    const arrayStateVarObj = this.svComponent.state[this.arrayStateVariable];
    return await arrayStateVarObj.getEntryValues({
        varName: this.svVarName,
    });
}

// Default variant: returns the values corresponding to this entry's
// arrayKeys (a scalar if there is just a single value), read from the
// array's arrayValues via its getArrayValue.
async function entryGetValueFromArrayValues(this: any) {
    const arrayStateVarObj = this.svComponent.state[this.arrayStateVariable];
    const arrayKeys = await this.arrayKeys;
    if (arrayKeys.length === 0) {
        return;
    }
    const value = [];
    for (const arrayKey of arrayKeys) {
        value.push(arrayStateVarObj.getArrayValue({ arrayKey }));
    }
    if (value.length === 1) {
        return value[0];
    } else {
        return value;
    }
}

function getEntryArrayKeys(this: any) {
    return (async () => {
        // first evaluate arraySize so _arrayKeys is recalculated
        // in case arraySize change
        await this.svComponent.state[this.arrayStateVariable].arraySize;
        return this._arrayKeys;
    })();
}
const ENTRY_ARRAY_KEYS_DESCRIPTOR: PropertyDescriptor = Object.freeze({
    get: getEntryArrayKeys,
});

function getEntryUnflattenedArrayKeys(this: any) {
    return (async () => {
        // first evaluate arraySize so _unflattenedArrayKeys is recalculated
        // in case arraySize change
        await this.svComponent.state[this.arrayStateVariable].arraySize;
        return this._unflattenedArrayKeys;
    })();
}
const ENTRY_UNFLATTENED_ARRAY_KEYS_DESCRIPTOR: PropertyDescriptor =
    Object.freeze({ get: getEntryUnflattenedArrayKeys });

function getEntryArraySize(this: any) {
    return this.svComponent.state[this.arrayStateVariable].arraySize;
}
const ENTRY_ARRAY_SIZE_DESCRIPTOR: PropertyDescriptor = Object.freeze({
    get: getEntryArraySize,
});

function getEntryArrayEntrySize(this: any) {
    return (async () => {
        // assume array is rectangular, so just look at first subarray of each dimension
        let unflattenedArrayKeys = await this.unflattenedArrayKeys;
        let arrayEntrySize: number[] = [];
        let subArray = [unflattenedArrayKeys];
        for (let i = 0; i < this.numDimensions; i++) {
            subArray = subArray[0];
            arrayEntrySize.push(subArray.length);
        }
        arrayEntrySize.reverse(); // so starts with inner dimension
        return arrayEntrySize;
    })();
}
const ENTRY_ARRAY_ENTRY_SIZE_DESCRIPTOR: PropertyDescriptor = Object.freeze({
    get: getEntryArrayEntrySize,
});

// ─── Shared array machinery ─────────────────────────────────────────────
// Module-level equivalents of what used to be per-array closures in
// `initializeArrayStateVariable`. `this` is the array state-variable
// object; per-variable parameters (arrayValues, numDimensions,
// entryPrefixes, svComponent, svVarName) are fields on it.

function multiDimKeyToIndex(key: string) {
    return key.split(",").map((x) => Number(x));
}

function oneDimKeyToIndex(key: string) {
    return Number(key);
}

// converting from index to key is the same for single and multiple
// dimensions, as we just want the string representation
function arrayIndexToKey(index: any) {
    return String(index);
}

function defaultReturnEntryDimensions() {
    return 0;
}

function multiDimSetArrayValue(
    this: any,
    { value, arrayKey, arraySize, arrayValues = this.arrayValues }: any,
) {
    const component = this.svComponent;
    const addDiagnostic = component.coreFunctions.addDiagnostic;
    const numDimensions = this.numDimensions;

    let index = this.keyToIndex(arrayKey);
    let numDimensionsInArrayKey = index.length;
    // Pre-existing typo fix: the original
    // `!numDimensionsInArrayKey > stateVarObj.numDimensions`
    // evaluates to `false > number === false` for any positive
    // integer, so the diagnostic was unreachable.
    if (numDimensionsInArrayKey > numDimensions) {
        addDiagnostic({
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
        if (indComponent >= 0 && indComponent < arraySizeDrillDown[0]) {
            if (!arrayValuesDrillDown[indComponent]) {
                arrayValuesDrillDown[indComponent] = [];
            }
            arrayValuesDrillDown = arrayValuesDrillDown[indComponent];
            arraySizeDrillDown = arraySizeDrillDown.slice(1);
        } else {
            addDiagnostic({
                type: "info",
                message: "ignore setting array value out of bounds",
                position: component.position,
                sourceDoc: component.sourceDoc,
            });
            return { nFailures: 1 };
        }
    }

    let nFailures = 0;

    if (numDimensionsInArrayKey < numDimensions) {
        // if dimensions from arrayKey is less than number of dimensions
        // then attempt to get additional dimensions from
        // array indices of value

        let setArrayValuesPiece = function (
            desiredValue: any,
            arrayValuesPiece: any,
            arraySizePiece: any,
        ): { nFailures: number } {
            // try to set value of entries of arrayValuePiece to entries of desiredValue
            // given that size of arrayValuesPieces is arraySizePiece

            if (!Array.isArray(desiredValue)) {
                addDiagnostic({
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
                addDiagnostic({
                    type: "info",
                    message: "ignoring array values out of bounds",
                    position: component.position,
                    sourceDoc: component.sourceDoc,
                });
                nFailuresSub += desiredValue.length - currentSize;
                desiredValue = desiredValue.slice(0, currentSize);
            }

            if (arraySizePiece.length === 1) {
                // down to last dimension
                for (let [ind, val] of desiredValue.entries() as Iterable<
                    [number, any]
                >) {
                    arrayValuesPiece[ind] = val;
                }
            } else {
                for (let [ind, val] of desiredValue.entries() as Iterable<
                    [number, any]
                >) {
                    if (!arrayValuesPiece[ind]) {
                        arrayValuesPiece[ind] = [];
                    }
                    let result = setArrayValuesPiece(
                        val,
                        arrayValuesPiece[ind],
                        arraySizePiece.slice(1),
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
}

function oneDimSetArrayValue(
    this: any,
    { value, arrayKey, arraySize, arrayValues = this.arrayValues }: any,
) {
    let ind = this.keyToIndex(arrayKey);
    if (ind >= 0 && ind < arraySize[0]) {
        arrayValues[ind] = value;
        return { nFailures: 0 };
    } else {
        const component = this.svComponent;
        component.coreFunctions.addDiagnostic({
            type: "info",
            message: `Ignoring setting array values out of bounds: ${arrayKey} of ${this.svVarName}`,
            position: component.position,
            sourceDoc: component.sourceDoc,
        });
        return { nFailures: 1 };
    }
}

function multiDimGetArrayValue(
    this: any,
    { arrayKey, arrayValues = this.arrayValues }: any,
) {
    let index = this.keyToIndex(arrayKey);
    let aVals = arrayValues;
    for (let indComponent of index.slice(0, index.length - 1)) {
        aVals = aVals[indComponent];
        if (!aVals) {
            return undefined;
        }
    }
    return aVals[index[index.length - 1]];
}

function oneDimGetArrayValue(
    this: any,
    { arrayKey, arrayValues = this.arrayValues }: any,
) {
    return arrayValues[arrayKey];
}

function multiDimGetAllArrayKeys(
    arraySize: any,
    flatten = true,
    desiredSize?: any,
) {
    function prependToAllKeys(keys: any[], newStuff: any) {
        for (let [ind, key] of keys.entries() as Iterable<[number, any]>) {
            if (Array.isArray(key)) {
                prependToAllKeys(key, newStuff);
            } else {
                keys[ind] = newStuff + "," + key;
            }
        }
    }

    function getAllArrayKeysSub(subArraySize: any): any[] {
        if (subArraySize.length === 1) {
            // array of numbers from 0 to subArraySize[0], cast to strings
            return Array.from(Array(subArraySize[0]), (_, i) => String(i));
        } else {
            let currentSize = subArraySize[0];
            let subSubKeys = getAllArrayKeysSub(subArraySize.slice(1));
            let subKeys: any[] = [];
            for (let ind = 0; ind < currentSize; ind++) {
                if (flatten) {
                    subKeys.push(...subSubKeys.map((x: any) => ind + "," + x));
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
}

function oneDimGetAllArrayKeys(
    arraySize: any,
    flatten?: any,
    desiredSize?: any,
) {
    if (desiredSize) {
        if (desiredSize.length === 0) {
            return [];
        } else {
            // array of numbers from 0 to desiredSize[0], cast to strings
            return Array.from(Array(desiredSize[0]), (_, i) => String(i));
        }
    } else if (!arraySize || arraySize.length === 0) {
        return [];
    } else {
        // array of numbers from 0 to arraySize[0], cast to strings
        return Array.from(Array(arraySize[0]), (_, i) => String(i));
    }
}

function defaultMultiDimArrayVarNameFromArrayKey(this: any, arrayKey: string) {
    return (
        this.entryPrefixes[0] +
        arrayKey
            .split(",")
            .map((x: string) => Number(x) + 1)
            .join("_")
    );
}

function defaultOneDimArrayVarNameFromArrayKey(this: any, arrayKey: string) {
    return this.entryPrefixes[0] + String(Number(arrayKey) + 1);
}

async function multiDimAdjustArrayToNewArraySize(this: any) {
    function resizeSubArray(subArray: any[], subArraySize: any) {
        subArray.length = subArraySize[0];

        if (subArraySize.length > 1) {
            let subSubArraySize = subArraySize.slice(1);
            for (let [ind, subSubArray] of subArray.entries() as Iterable<
                [number, any]
            >) {
                if (!subSubArray) {
                    // add in any empty entries
                    subSubArray = subArray[ind] = [];
                }
                resizeSubArray(subSubArray, subSubArraySize);
            }
        }
    }

    let arraySize = await this.arraySize;
    resizeSubArray(this.arrayValues, arraySize);
}

async function oneDimAdjustArrayToNewArraySize(this: any) {
    let arraySize = await this.arraySize;
    this.arrayValues.length = arraySize[0];
}

/**
 * Resolve the array state-variable object from a receiver that may be
 * either the array itself or one of its array ENTRIES: entries receive
 * field copies of the array's `definition` / `inverseDefinition` /
 * `markStale` (see `initializeArrayEntryStateVariable`), so those shared
 * functions are invoked with the entry as `this`. All bookkeeping —
 * dependencyNames, freshness keys, setValue keys — must use the ARRAY's
 * object and variable name (`_remapArrayEntryFreshness` in
 * StalenessPropagator relies on the array's name in fresh/partiallyFresh
 * keys), exactly as the old per-array closures did by capture.
 */
function resolveArrayStateVarObj(svObj: any) {
    return svObj.isArrayEntry
        ? svObj.svComponent.state[svObj.arrayStateVariable]
        : svObj;
}

function defaultReturnWrappingComponents(prefix?: any) {
    return [];
}

// create returnDependencies function from returnArrayDependenciesByKey
async function arrayReturnDependencies(this: any, args: any) {
    const arrayStateVarObj = resolveArrayStateVarObj(this);
    const component = arrayStateVarObj.svComponent;
    const arrayVarName = arrayStateVarObj.svVarName;

    args.arraySize = await arrayStateVarObj.arraySize;

    // delete the internally added dependencies from args.stateValues
    for (let key in args.stateValues) {
        if (key.slice(0, 8) === "__array_") {
            delete args.stateValues[key];
        }
    }

    if (args.arrayKeys === undefined) {
        args.arrayKeys = arrayStateVarObj.getAllArrayKeys(args.arraySize);
    }

    // link all dependencyNames of additionalStateVariablesDefined
    // to the same object, as they will share the same freshnessinfo
    // TODO: a better idea?  This seems like it could lead to confusion.
    if (!arrayStateVarObj.dependencyNames) {
        arrayStateVarObj.dependencyNames = {
            namesByKey: {},
            keysByName: {},
            global: [],
        };
        if (arrayStateVarObj.additionalStateVariablesDefined) {
            for (let vName of arrayStateVarObj.additionalStateVariablesDefined) {
                component.state[vName].dependencyNames =
                    arrayStateVarObj.dependencyNames;
            }
        }
    }

    let dependencies: Record<string, any> = {};

    if (
        arrayStateVarObj.basedOnArrayKeyStateVariables &&
        args.arrayKeys.length > 1
    ) {
        const allStateVariablesAffected = [
            arrayVarName,
            ...(arrayStateVarObj.additionalStateVariablesDefined ?? []),
        ];
        for (let arrayKey of args.arrayKeys) {
            for (let vName of allStateVariablesAffected) {
                let sObj = component.state[vName];
                dependencies[vName + "_" + arrayKey] = {
                    dependencyType: "stateVariable",
                    variableName: sObj.arrayVarNameFromArrayKey(arrayKey),
                };
            }
        }
    } else {
        let arrayDependencies =
            arrayStateVarObj.returnArrayDependenciesByKey(args);

        if (arrayDependencies.globalDependencies) {
            arrayStateVarObj.dependencyNames.global = Object.keys(
                arrayDependencies.globalDependencies,
            );
            Object.assign(dependencies, arrayDependencies.globalDependencies);
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
            if (!(arrayKey in arrayStateVarObj.dependencyNames.namesByKey)) {
                args.changedDependency = true;
            }
            arrayStateVarObj.dependencyNames.namesByKey[arrayKey] = {};
            for (let depName in arrayDependencies.dependenciesByKey[arrayKey]) {
                let extendedDepName = "__" + arrayKey + "_" + depName;
                dependencies[extendedDepName] =
                    arrayDependencies.dependenciesByKey[arrayKey][depName];
                arrayStateVarObj.dependencyNames.namesByKey[arrayKey][depName] =
                    extendedDepName;
                if (
                    !arrayStateVarObj.dependencyNames.keysByName[
                        extendedDepName
                    ]
                ) {
                    arrayStateVarObj.dependencyNames.keysByName[
                        extendedDepName
                    ] = [];
                }
                if (
                    !arrayStateVarObj.dependencyNames.keysByName[
                        extendedDepName
                    ].includes(arrayKey)
                ) {
                    arrayStateVarObj.dependencyNames.keysByName[
                        extendedDepName
                    ].push(arrayKey);
                }
            }
        }

        // to tie into making sure array size is a dependency, below
        arrayStateVarObj.dependencyNames.global.push("__array_size");
    }

    // make sure array size is a dependency
    dependencies.__array_size = {
        dependencyType: "stateVariable",
        variableName: arrayStateVarObj.arraySizeStateVariable,
    };

    return dependencies;
}

function arrayGetCurrentFreshness(
    this: any,
    { freshnessInfo, arrayKeys, arraySize }: any,
) {
    const arrayStateVarObj = resolveArrayStateVarObj(this);
    const arrayVarName = arrayStateVarObj.svVarName;

    if (arrayKeys === undefined) {
        arrayKeys = arrayStateVarObj.getAllArrayKeys(arraySize);
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
            return { fresh: { [arrayVarName]: true } };
        } else {
            return { partiallyFresh: { [arrayVarName]: numberFresh } };
        }
    } else {
        return { fresh: { [arrayVarName]: false } };
    }
}

function arrayMarkStale(
    this: any,
    { freshnessInfo, changes, arrayKeys, arraySize }: any,
) {
    const arrayStateVarObj = resolveArrayStateVarObj(this);
    const arrayVarName = arrayStateVarObj.svVarName;

    let result: any = {};

    if (arrayKeys === undefined) {
        arrayKeys = arrayStateVarObj.getAllArrayKeys(arraySize);
    }

    if (arrayStateVarObj.markStaleByKey) {
        result = arrayStateVarObj.markStaleByKey({ arrayKeys, changes });
    }

    let freshByKey = freshnessInfo.freshByKey;

    if (changes.__array_size) {
        freshnessInfo.freshArraySize = false;
        // everything is stale
        freshnessInfo.freshByKey = {};
        result.fresh = { [arrayVarName]: false };
        return result;
    }

    if (Object.keys(freshByKey).length === 0) {
        // everything is stale, except possibly array size
        // (check for nothing fresh as a shortcut, as mark stale could
        // be called repeated if size doesn't change, given that it's partially fresh)
        freshnessInfo.freshByKey = {};
        if (freshnessInfo.freshArraySize) {
            result.partiallyFresh = { [arrayVarName]: 1 };
            return result;
        } else {
            result.fresh = { [arrayVarName]: false };
            return result;
        }
    }

    for (let changeName in changes) {
        if (arrayStateVarObj.dependencyNames.global.includes(changeName)) {
            // everything is stale, except possible array size
            freshnessInfo.freshByKey = {};
            if (freshnessInfo.freshArraySize) {
                result.partiallyFresh = { [arrayVarName]: 1 };
                return result;
            } else {
                result.fresh = { [arrayVarName]: false };
                return result;
            }
        }

        if (
            arrayStateVarObj.basedOnArrayKeyStateVariables &&
            arrayKeys.length > 1
        ) {
            delete freshByKey[changeName];
        } else {
            for (let key of arrayStateVarObj.dependencyNames.keysByName[
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

    if (numberFresh > 0) {
        if (numberFresh === arrayKeys.length + 1) {
            result.fresh = { [arrayVarName]: true };
            return result;
        } else {
            result.partiallyFresh = { [arrayVarName]: numberFresh };
            return result;
        }
    } else {
        result.fresh = { [arrayVarName]: false };
        return result;
    }
}

function arrayFreshenOnNoChanges(
    this: any,
    { arrayKeys, freshnessInfo, arraySize }: any,
) {
    const arrayStateVarObj = resolveArrayStateVarObj(this);
    let freshByKey = freshnessInfo.freshByKey;

    if (arrayKeys === undefined) {
        arrayKeys = arrayStateVarObj.getAllArrayKeys(arraySize);
    }

    for (let arrayKey of arrayKeys) {
        freshByKey[arrayKey] = true;
    }
}

function extractArrayDependencies(
    arrayStateVarObj: any,
    dependencyValues: any,
    arrayKeys: any[],
    usedDefault: any,
) {
    let globalDependencyValues: Record<string, any> = {};
    let globalUsedDefault: Record<string, any> = {};
    for (let dependencyName of arrayStateVarObj.dependencyNames.global) {
        globalDependencyValues[dependencyName] =
            dependencyValues[dependencyName];
        globalUsedDefault[dependencyName] = usedDefault[dependencyName];
    }

    let dependencyValuesByKey: Record<string, any> = {};
    let usedDefaultByKey: Record<string, any> = {};
    let foundAllDependencyValuesForKey: Record<string, any> = {};
    for (let arrayKey of arrayKeys) {
        dependencyValuesByKey[arrayKey] = {};
        usedDefaultByKey[arrayKey] = {};
        if (arrayKey in arrayStateVarObj.dependencyNames.namesByKey) {
            foundAllDependencyValuesForKey[arrayKey] = true;
            for (let dependencyName in arrayStateVarObj.dependencyNames
                .namesByKey[arrayKey]) {
                let extendedDepName =
                    arrayStateVarObj.dependencyNames.namesByKey[arrayKey][
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

function arrayDefinition(this: any, args: any) {
    const arrayStateVarObj = resolveArrayStateVarObj(this);
    const arrayVarName = arrayStateVarObj.svVarName;
    const component = arrayStateVarObj.svComponent;

    if (args.arrayKeys === undefined) {
        args.arrayKeys = arrayStateVarObj.getAllArrayKeys(args.arraySize);
    }

    if (
        arrayStateVarObj.basedOnArrayKeyStateVariables &&
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
            arrayStateVarObj,
            args.dependencyValues,
            args.arrayKeys,
            args.usedDefault,
        );
        let globalDependencyValues = extractedDeps.globalDependencyValues;
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
            result = {};
        } else {
            args.arrayKeys = arrayKeysToRecalculate;

            if (!arrayStateVarObj.arrayDefinitionByKey) {
                throw Error(
                    `For ${arrayVarName} of ${component.componentType}, arrayDefinitionByKey must be a function`,
                );
            }

            result = arrayStateVarObj.arrayDefinitionByKey(args);

            // in case definition returns additional array entries,
            // mark all array keys received as fresh as well
            if (result.setValue && result.setValue[arrayVarName]) {
                for (let arrayKey in result.setValue[arrayVarName]) {
                    freshByKey[arrayKey] = true;
                }
            }
            if (
                result.useEssentialOrDefaultValue &&
                result.useEssentialOrDefaultValue[arrayVarName]
            ) {
                for (let arrayKey in result.useEssentialOrDefaultValue[
                    arrayVarName
                ]) {
                    freshByKey[arrayKey] = true;
                }
            }
        }

        if (!args.freshnessInfo.freshArraySize) {
            if (args.changes.__array_size) {
                result.arraySizeChanged = [arrayVarName];
                if (arrayStateVarObj.additionalStateVariablesDefined) {
                    for (let varName of arrayStateVarObj.additionalStateVariablesDefined) {
                        // do we have to check if it is array?
                        if (component.state[varName].isArray) {
                            result.arraySizeChanged.push(varName);
                        }
                    }
                }
            }
            args.freshnessInfo.freshArraySize = true;
        }

        return result;
    }
}

function arrayInverseDefinition(this: any, args: any) {
    const arrayStateVarObj = resolveArrayStateVarObj(this);
    const arrayVarName = arrayStateVarObj.svVarName;

    if (!arrayStateVarObj.inverseArrayDefinitionByKey) {
        return { success: false };
    }

    if (args.arrayKeys === undefined) {
        args.arrayKeys = arrayStateVarObj.getAllArrayKeys(args.arraySize);
    }

    if (
        arrayStateVarObj.basedOnArrayKeyStateVariables &&
        args.arrayKeys.length > 1
    ) {
        const allStateVariablesAffected = [
            arrayVarName,
            ...(arrayStateVarObj.additionalStateVariablesDefined ?? []),
        ];
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
            arrayStateVarObj,
            args.dependencyValues,
            args.arrayKeys,
            args.usedDefault,
        );
        let globalDependencyValues = extractedDeps.globalDependencyValues;
        let globalUsedDefault = extractedDeps.globalUsedDefault;
        let dependencyValuesByKey = extractedDeps.dependencyValuesByKey;
        let usedDefaultByKey = extractedDeps.usedDefaultByKey;

        delete args.dependencyValues;
        args.globalDependencyValues = globalDependencyValues;
        args.globalUsedDefault = globalUsedDefault;
        args.dependencyValuesByKey = dependencyValuesByKey;
        args.usedDefaultByKey = usedDefaultByKey;

        args.dependencyNamesByKey = arrayStateVarObj.dependencyNames.namesByKey;

        if (!arrayStateVarObj.allowExtraArrayKeysInInverse) {
            // by default, inverseArrayDefinitionByKey does not need to be
            // programmed defensively against arrayKeys that don't exist
            // as they are filtered out here.
            // However, if allowExtraArrayKeysInInverse, then we skip this
            // filtering to allow the possibility that the array size
            // could be changed.
            let newDesiredStateVariableValues: Record<string, any> = {};
            for (let vName in args.desiredStateVariableValues) {
                newDesiredStateVariableValues[vName] = {};
                for (let key in args.desiredStateVariableValues[vName]) {
                    if (args.arrayKeys.includes(key)) {
                        newDesiredStateVariableValues[vName][key] =
                            args.desiredStateVariableValues[vName][key];
                    }
                }
            }
            args.desiredStateVariableValues = newDesiredStateVariableValues;
        }

        let result = arrayStateVarObj.inverseArrayDefinitionByKey(args);
        return result;
    }
}

function getArrayArraySize(this: any) {
    return (async () => {
        if (
            !this.svComponent.state[this.arraySizeStateVariable]
                .initiallyResolved
        ) {
            return [];
        }
        if (this.arraySizeStale) {
            await this.recalculateArraySizeDependentQuantities();
        }
        return await this.svComponent.stateValues[this.arraySizeStateVariable];
    })();
}
const ARRAY_ARRAY_SIZE_DESCRIPTOR: PropertyDescriptor = Object.freeze({
    get: getArrayArraySize,
});

/**
 * Populate the class-invariant array defaults directly on a (shared,
 * per-class) state-variable definition, so component instances inherit
 * them through their definition prototype (non-shadow path) or pick them
 * up in their flat per-instance clone (adapter/shadow path) instead of
 * each instance assigning the same values as own properties.
 *
 * Called by `StateVariableDefinitionFactory.getClassStateVariableDefinitions`
 * while building the per-class definition cache. `initializeArrayStateVariable`
 * keeps guarded fallbacks for array definitions created outside that cache.
 *
 * All defaults installed here must be receiver-free or read only fields
 * present on both definitions and runtime state-variable objects
 * (class-level description objects also invoke `getArrayKeysFromVarName`
 * and `arrayVarNameFromPropIndex`).
 */
export function normalizeArrayStateVariableDefaults(def: any, varName: string) {
    if (!def.isArray) {
        return;
    }

    if (def.numDimensions === undefined) {
        def.numDimensions = 1;
    }
    if (!def.entryPrefixes) {
        def.entryPrefixes = [varName];
    }

    const multiDim = def.numDimensions > 1;

    if (!def.keyToIndex) {
        def.keyToIndex = multiDim ? multiDimKeyToIndex : oneDimKeyToIndex;
    }
    if (!def.indexToKey) {
        def.indexToKey = arrayIndexToKey;
    }
    if (!def.getAllArrayKeys) {
        def.getAllArrayKeys = multiDim
            ? multiDimGetAllArrayKeys
            : oneDimGetAllArrayKeys;
    }
    if (!def.getArrayKeysFromVarName) {
        def.getArrayKeysFromVarName = returnDefaultGetArrayKeysFromVarName(
            def.numDimensions,
        );
    }
    if (!def.arrayVarNameFromArrayKey) {
        def.arrayVarNameFromArrayKey = multiDim
            ? defaultMultiDimArrayVarNameFromArrayKey
            : defaultOneDimArrayVarNameFromArrayKey;
    }
    if (!def.arrayVarNameFromPropIndex) {
        // one closure per (class, variable) — was one per component instance
        def.arrayVarNameFromPropIndex = returnDefaultArrayVarNameFromPropIndex(
            def.numDimensions,
            def.entryPrefixes[0],
        );
    }
    if (!def.returnEntryDimensions) {
        def.returnEntryDimensions = defaultReturnEntryDimensions;
    }
    if (
        def.shadowingInstructions &&
        !def.shadowingInstructions.returnWrappingComponents
    ) {
        def.shadowingInstructions.returnWrappingComponents =
            defaultReturnWrappingComponents;
    }
}

// ─── Shared array-size state-variable machinery ─────────────────────────
// `this` is the __array_size_* state-variable object. Its parameters are
// stored as fields when `createArraySizeStateVariable` builds it:
// - arraySizeVarNamesAffected: the (sorted) array variables whose
//   arraySizeStale is set on markStale
// - arraySizeSourceVarName: the array variable whose returnArraySize
//   computes the size (the first array of the group to create the size
//   variable, matching the closure it replaces)

function arraySizeDefinition(this: any, { dependencyValues }: any) {
    let arraySize = this.svComponent.state[
        this.arraySizeSourceVarName
    ].returnArraySize({
        dependencyValues,
    });
    for (let [ind, value] of arraySize.entries() as Iterable<[number, any]>) {
        if (!(Number.isInteger(value) && value >= 0)) {
            arraySize[ind] = 0;
        }
    }
    return { setValue: { [this.svVarName]: arraySize } };
}

function arraySizeMarkStale(this: any) {
    for (let varName of this.arraySizeVarNamesAffected) {
        this.svComponent.state[varName].arraySizeStale = true;
    }
    return {};
}

async function arrayRecalculateArraySizeDependentQuantities(this: any) {
    const component = this.svComponent;
    let newArraySize = await component.stateValues[this.arraySizeStateVariable];
    if (
        this.previousArraySize.length !== newArraySize.length ||
        this.previousArraySize.some((v: any, i: number) => v != newArraySize[i])
    ) {
        this.previousArraySize = [...newArraySize];
        let varNamesIncluding = (this.varNamesIncludingArrayKeys = {} as any);
        for (let entryName of this.arrayEntryNames) {
            let entryStateVarObj = component.state[entryName];
            let arrayKeys = this.getArrayKeysFromVarName({
                arrayEntryPrefix: entryStateVarObj.entryPrefix,
                varEnding: entryStateVarObj.varEnding,
                arraySize: newArraySize,
                numDimensions: this.numDimensions,
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
    this.arraySizeStale = false;
}

// returnDependencies for an array entry delegates to the array's
// returnDependencies, adding this entry's arraySize/arrayKeys to the
// arguments.
async function entryReturnDependencies(this: any, args: any) {
    const arrayStateVarObj = this.svComponent.state[this.arrayStateVariable];

    // add array size to argument of return dependencies
    args.arraySize = await this.arraySize;
    args.arrayKeys = await this.arrayKeys;
    let dependencies = await arrayStateVarObj.returnDependencies(args);

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
    if (this.numberNamesInPreviousReturnDep !== numNames) {
        args.changedDependency = true;
    }
    this.numberNamesInPreviousReturnDep = numNames;

    return dependencies;
}

export async function initializeComponentStateVariables({
    core,
    component,
}: {
    core: Core;
    component: ComponentInstance;
}) {
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
            await initializeStateVariable({
                core,
                component,
                stateVariable,
            });
        }
    }
}

export async function initializeStateVariable({
    core,
    component,
    stateVariable,
    arrayStateVariable,
    arrayEntryPrefix,
}: {
    core: Core;
    component: ComponentInstance;
    stateVariable: string;
    arrayStateVariable?: string;
    arrayEntryPrefix?: string;
}) {
    if (!component.state[stateVariable]) {
        component.state[stateVariable] = {};
    }
    let stateVarObj = component.state[stateVariable];
    // Back-pointers read by the shared runtime functions (via `this`).
    // Note: state-variable objects must never be JSON-serialized or
    // deep-cloned wholesale — `svComponent` makes them cyclic. (Nothing
    // does so today; persistence extracts individual values.)
    stateVarObj.svComponent = component;
    stateVarObj.svVarName = stateVariable;
    stateVarObj.isResolved = false;
    installStaleValueGetter(stateVarObj);

    if (arrayEntryPrefix !== undefined) {
        // Callers always pair `arrayEntryPrefix` with `arrayStateVariable`;
        // assert here so the inner helper can require both as `string`.
        await initializeArrayEntryStateVariable({
            stateVarObj,
            arrayStateVariable: arrayStateVariable!,
            arrayEntryPrefix,
            component,
            stateVariable,
        });
    } else if (stateVarObj.isArray) {
        await initializeArrayStateVariable({
            core,
            stateVarObj,
            component,
            stateVariable,
        });
    }

    if (stateVarObj.triggerActionOnChange) {
        let componentTriggers =
            core.stateVariableChangeTriggers[component.componentIdx];
        if (!componentTriggers) {
            componentTriggers = core.stateVariableChangeTriggers[
                component.componentIdx
            ] = {};
        }
        componentTriggers[stateVariable] = {
            action: stateVarObj.triggerActionOnChange,
        };
    }
}

async function initializeArrayEntryStateVariable({
    stateVarObj,
    arrayStateVariable,
    arrayEntryPrefix,
    component,
    stateVariable,
}: {
    stateVarObj: any;
    arrayStateVariable: string;
    arrayEntryPrefix: string;
    component: ComponentInstance;
    stateVariable: string;
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
                let newArrayEntryPrefix = sObj.entryPrefixes[entryPrefixInd];
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
                arrayStateVarObj.shadowingInstructions.createComponentOfType[
                    entryPrefixInd
                ]
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
        stateVarObj.getValueFromArrayValues = entryGetValueViaGetEntryValues;
    } else {
        // getValueFromArrayValues returns an array of the values
        // that correspond to the arrayKeys of this entry state variable
        // (returning a scalar instead if it is just a single value)
        // It uses the function getArrayValue, which gets the values
        // from arrayValues of the corresponding array state variable
        stateVarObj.getValueFromArrayValues = entryGetValueFromArrayValues;
    }

    stateVarObj.arraySizeStateVariable =
        arrayStateVarObj.arraySizeStateVariable;

    stateVarObj._arrayKeys = [];
    stateVarObj._unflattenedArrayKeys = [];

    Object.defineProperty(
        stateVarObj,
        "arrayKeys",
        ENTRY_ARRAY_KEYS_DESCRIPTOR,
    );

    Object.defineProperty(
        stateVarObj,
        "unflattenedArrayKeys",
        ENTRY_UNFLATTENED_ARRAY_KEYS_DESCRIPTOR,
    );

    if (component.state[stateVarObj.arraySizeStateVariable].initiallyResolved) {
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

    Object.defineProperty(
        stateVarObj,
        "arraySize",
        ENTRY_ARRAY_SIZE_DESCRIPTOR,
    );

    // TODO: delete since arrayEntrySize isn't currently used?
    Object.defineProperty(
        stateVarObj,
        "arrayEntrySize",
        ENTRY_ARRAY_ENTRY_SIZE_DESCRIPTOR,
    );

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
                stateVarObj.stateVariablesDeterminingDependencies.push(varName);
            }
        }
    }

    // add a returnDependencies function based on the array returnDependencies
    stateVarObj.returnDependencies = entryReturnDependencies;
}

async function initializeArrayStateVariable({
    core,
    stateVarObj,
    component,
    stateVariable,
}: {
    core: Core;
    stateVarObj: any;
    component: ComponentInstance;
    stateVariable: string;
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
        if (!stateVarObj.keyToIndex) {
            stateVarObj.keyToIndex = multiDimKeyToIndex;
        }
        stateVarObj.setArrayValue = multiDimSetArrayValue;
        stateVarObj.getArrayValue = multiDimGetArrayValue;

        if (!stateVarObj.getAllArrayKeys) {
            stateVarObj.getAllArrayKeys = multiDimGetAllArrayKeys;
        }

        if (!stateVarObj.arrayVarNameFromArrayKey) {
            stateVarObj.arrayVarNameFromArrayKey =
                defaultMultiDimArrayVarNameFromArrayKey;
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

        stateVarObj.adjustArrayToNewArraySize =
            multiDimAdjustArrayToNewArraySize;
    } else {
        // have just one dimension
        if (!stateVarObj.keyToIndex) {
            stateVarObj.keyToIndex = oneDimKeyToIndex;
        }
        stateVarObj.setArrayValue = oneDimSetArrayValue;
        stateVarObj.getArrayValue = oneDimGetArrayValue;

        if (!stateVarObj.getAllArrayKeys) {
            stateVarObj.getAllArrayKeys = oneDimGetAllArrayKeys;
        }

        if (!stateVarObj.arrayVarNameFromArrayKey) {
            stateVarObj.arrayVarNameFromArrayKey =
                defaultOneDimArrayVarNameFromArrayKey;
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

        stateVarObj.adjustArrayToNewArraySize = oneDimAdjustArrayToNewArraySize;
    }

    if (!stateVarObj.getArrayKeysFromVarName) {
        stateVarObj.getArrayKeysFromVarName =
            returnDefaultGetArrayKeysFromVarName(stateVarObj.numDimensions);
    }

    if (!stateVarObj.indexToKey) {
        stateVarObj.indexToKey = arrayIndexToKey;
    }

    if (!stateVarObj.returnEntryDimensions) {
        stateVarObj.returnEntryDimensions = defaultReturnEntryDimensions;
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
            stateVarObj.shadowingInstructions.returnWrappingComponents =
                defaultReturnWrappingComponents;
        }
        stateVarObj.wrappingComponents =
            stateVarObj.shadowingInstructions.returnWrappingComponents();
    }

    stateVarObj.usedDefaultByArrayKey = {};

    stateVarObj.arrayEntryNames = [];
    stateVarObj.varNamesIncludingArrayKeys = {};

    // create the definition, etc., functions for the array state variable
    // (module-level functions shared across all array state variables;
    // entries invoke some of them with the ENTRY as receiver, so they
    // resolve the array object via resolveArrayStateVarObj)

    stateVarObj.returnDependencies = arrayReturnDependencies;

    stateVarObj.getCurrentFreshness = arrayGetCurrentFreshness;

    stateVarObj.markStale = arrayMarkStale;

    stateVarObj.freshenOnNoChanges = arrayFreshenOnNoChanges;

    stateVarObj.definition = arrayDefinition;

    stateVarObj.inverseDefinition = arrayInverseDefinition;

    await createArraySizeStateVariable({
        core,
        stateVarObj,
        component,
        stateVariable,
    });

    stateVarObj.arraySizeStale = true;
    stateVarObj.previousArraySize = [];

    Object.defineProperty(
        stateVarObj,
        "arraySize",
        ARRAY_ARRAY_SIZE_DESCRIPTOR,
    );

    stateVarObj.recalculateArraySizeDependentQuantities =
        arrayRecalculateArraySizeDependentQuantities;

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

async function createArraySizeStateVariable({
    core,
    stateVarObj,
    component,
    stateVariable,
}: {
    core: Core;
    stateVarObj: any;
    component: ComponentInstance;
    stateVariable: string;
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

    // Make the array's dependencies depend on the array size state variable
    if (stateVarObj.stateVariablesDeterminingDependencies) {
        stateVarObj.stateVariablesDeterminingDependencies.push(
            arraySizeStateVar,
        );
    } else {
        stateVarObj.stateVariablesDeterminingDependencies = [arraySizeStateVar];
    }

    // If array size state variable has already been created,
    // either it was created due to being shadowed
    // or from an additional state variable defined.
    // If it is shadowing target array size state variable,
    // make it mark the array's arraySize as stale on markStale
    if (component.state[arraySizeStateVar]) {
        if (component.state[arraySizeStateVar].isShadow) {
            let arraySizeStateVarObj = component.state[arraySizeStateVar];
            arraySizeStateVarObj.arraySizeVarNamesAffected =
                allStateVariablesAffected;
            arraySizeStateVarObj.markStale = arraySizeMarkStale;
        }
        return;
    }

    component.state[arraySizeStateVar] = {
        returnDependencies: stateVarObj.returnArraySizeDependencies,
        definition: arraySizeDefinition,
        markStale: arraySizeMarkStale,
        arraySizeVarNamesAffected: allStateVariablesAffected,
        arraySizeSourceVarName: stateVariable,
    };

    if (stateVarObj.stateVariablesDeterminingArraySizeDependencies) {
        component.state[
            arraySizeStateVar
        ].stateVariablesDeterminingDependencies =
            stateVarObj.stateVariablesDeterminingArraySizeDependencies;
    }

    await initializeStateVariable({
        core,
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
export async function arrayEntryNamesFromPropIndex({
    core,
    stateVariables,
    component,
    propIndex,
}: {
    core: Core;
    stateVariables: string[];
    component: ComponentInstance;
    propIndex: number[];
}) {
    let newVarNames = [];
    for (let varName of stateVariables) {
        let stateVarObj = component.state[varName];
        if (!stateVarObj) {
            if (
                !core.checkIfArrayEntry({
                    stateVariable: varName,
                    component,
                }).isArrayEntry
            ) {
                // varName doesn't exist.  Ignore error here
                newVarNames.push(varName);
                continue;
            }
            await core.createFromArrayEntry({
                stateVariable: varName,
                component,
            });
            stateVarObj = component.state[varName];
        }

        let newName;
        if (stateVarObj.isArray) {
            newName = stateVarObj.arrayVarNameFromPropIndex(propIndex, varName);
        } else if (stateVarObj.isArrayEntry) {
            let arrayStateVarObj =
                component.state[stateVarObj.arrayStateVariable];
            newName = arrayStateVarObj.arrayVarNameFromPropIndex(
                propIndex,
                varName,
            );
        } else {
            core.addDiagnostic({
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
            core.addDiagnostic({
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
