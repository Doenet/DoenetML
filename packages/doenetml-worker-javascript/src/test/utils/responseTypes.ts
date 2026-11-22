/**
 * The type of each of an `<answer>`'s responses, as a reference to them
 * makes it: the types decided from the DoenetML when the document loads
 * (`doenetAttributes.propertyTypes`, `propertyTypesAtLoad.ts`, TYPE-2), one
 * per entry. `undefined` when the DoenetML doesn't decide them, when no
 * reference may read them (`doenet-e0090`).
 *
 * `variableName` is `submittedResponses` (the default) or
 * `currentResponses`. Read from the core, as the run time never works a
 * type out.
 */
export async function responseTypes(
    core: any,
    componentIdx: number,
    variableName:
        "submittedResponses" | "currentResponses" = "submittedResponses",
): Promise<string[] | undefined> {
    const answer = core.core._components[componentIdx];
    const types = answer.doenetAttributes?.propertyTypes?.[variableName];
    const count = (await answer.stateValues[variableName]).length;
    if (typeof types === "string") {
        return Array(count).fill(types);
    }
    return Array.isArray(types) ? [...types] : undefined;
}
