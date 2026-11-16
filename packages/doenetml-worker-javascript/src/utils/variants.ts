import { serializedAttributeComponent } from "./literalAttribute";
import {
    numberToLetters,
    enumerateCombinations,
    codedDiagnostic,
} from "@doenet/utils";
import type { DiagnosticRecord } from "@doenet/utils";
import type { DiagnosticArgs, DiagnosticCode } from "@doenet/i18n";
import seedrandom from "seedrandom";

// getVariantsForDescendantsForUniqueVariants: only needed in worker
export function getVariantsForDescendantsForUniqueVariants({
    variantIndex,
    serializedComponent,
    componentInfoObjects,
}: {
    variantIndex: number;
    serializedComponent: any;
    componentInfoObjects: any;
}) {
    let descendantVariantComponents =
        serializedComponent.variants?.descendantVariantComponents;

    if (descendantVariantComponents === undefined) {
        return { success: false };
    }

    let numVariantsByDescendant = descendantVariantComponents.map(
        (x: any) => x.variants.numVariants,
    );

    let indices = enumerateCombinations({
        numberOfOptionsByIndex: numVariantsByDescendant,
        maxNumber: variantIndex,
    })[variantIndex - 1];

    let desiredVariants = [];
    for (let [ind, comp] of descendantVariantComponents.entries()) {
        let compClass =
            componentInfoObjects.allComponentClasses[comp.componentType];
        let r = compClass.getUniqueVariant({
            serializedComponent: comp,
            variantIndex: indices[ind] + 1,
            componentInfoObjects,
        });
        if (r.success) {
            desiredVariants.push(r.desiredVariant);
        } else {
            return { success: false };
        }
    }

    return {
        success: true,
        desiredVariants,
    };
}

// setUpVariantSeedAndRng: only needed in worker
export function setUpVariantSeedAndRng({
    serializedComponent,
    sharedParameters,
    descendantVariantComponents,
    useSubpartVariantRng = false,
}: {
    serializedComponent: any;
    sharedParameters: any;
    descendantVariantComponents: any;
    useSubpartVariantRng: boolean;
}) {
    // Note: use subpartVariantRng for containers that don't actually select anything random.
    // That way, adding such a non-random component to the DoenetML
    // does not change the values selected by other components that use the regular variantRng.

    let variantSeed;
    // check if desiredVariant was specified
    let desiredVariant;
    if (serializedComponent.variants) {
        desiredVariant = serializedComponent.variants.desiredVariant;
    }
    if (desiredVariant?.seed !== undefined) {
        variantSeed = desiredVariant.seed.toString();
    } else {
        // if variant seed wasn't specified

        // randomly pick variant seed
        if (useSubpartVariantRng) {
            variantSeed = sharedParameters
                .subpartVariantRng()
                .toString()
                .slice(2);
        } else {
            variantSeed = sharedParameters.variantRng().toString().slice(2);
        }
    }

    sharedParameters.variantSeed = variantSeed;
    sharedParameters.variantRng = sharedParameters.rngClass(
        sharedParameters.variantSeed,
    );
    sharedParameters.subpartVariantRng = sharedParameters.rngClass(
        sharedParameters.variantSeed + "s",
    );

    // if subvariants were specified, add those the corresponding descendants

    if (desiredVariant?.subvariants && descendantVariantComponents) {
        for (let ind in desiredVariant.subvariants) {
            let subvariant = desiredVariant.subvariants[ind];
            let variantComponent = descendantVariantComponents[ind];
            if (variantComponent === undefined) {
                break;
            }
            variantComponent.variants.desiredVariant = subvariant;
        }
    }
}

// gatherVariantComponents: needed in getNumVariants, which is needed in returnAllPossibleVariants
// needed from componentInfoObjects:
// - componentTypesCreatingVariants
// - ignoreVariantsFromChildren from component class
export function gatherVariantComponents({
    serializedComponents,
    componentInfoObjects,
}: any) {
    // returns a list of serialized components who are variant components,
    // where the components are selected from serializedComponents themselves,
    // or, if a particular component isn't a variant component,
    // then recurse to find descendant variant components

    // Also, as a side effect, mark each found variant component as a variant component
    // directly in the variants attribute of that component

    let variantComponents: any[] = [];

    for (let serializedComponent of serializedComponents) {
        if (typeof serializedComponent !== "object") {
            continue;
        }

        if (!serializedComponent.variants) {
            serializedComponent.variants = {};
        }

        if (serializedComponent.variants.isVariantComponent) {
            variantComponents.push(serializedComponent);
            continue;
        }

        let componentType = serializedComponent.componentType;

        if (
            componentType in componentInfoObjects.componentTypesCreatingVariants
        ) {
            serializedComponent.variants.isVariantComponent = true;
            variantComponents.push(serializedComponent);
            continue;
        }

        let compClass =
            componentInfoObjects.allComponentClasses[
                serializedComponent.componentType
            ];

        if (
            compClass?.ignoreVariantsFromChildren ||
            !serializedComponent.children
        ) {
            continue;
        }

        // check if have a variant control child, which means this component
        // is a variant component
        if (
            serializedComponent.children.some(
                (x: any) => x.componentType === "variantControl",
            )
        ) {
            serializedComponent.variants.isVariantComponent = true;
            variantComponents.push(serializedComponent);
            continue;
        }

        // if a component isn't a variant component, then recurse on children

        let descendantVariantComponents = gatherVariantComponents({
            serializedComponents: serializedComponent.children,
            componentInfoObjects,
        });

        if (descendantVariantComponents.length > 0) {
            serializedComponent.variants.descendantVariantComponents =
                descendantVariantComponents;
            variantComponents.push(...descendantVariantComponents);
        }
    }

    return variantComponents;
}

/**
 * The component types a component reads `generatedVariantInfo` from among its
 * descendants, to make its `subvariants`: those that create variants and the
 * copies (`_copy`). A copy reports the variants of the random children added
 * to it (`<p copy="$a"><selectFromSequence/></p>`), which
 * `gatherVariantComponents` finds among its serialized children, so that the
 * subvariants line up with the components they are handed to when the
 * component is made again from them (an unlinked copy of a container, or a
 * page loaded with the variant it generated).
 */
export function variantDescendantComponentTypes(componentInfoObjects: any) {
    return [
        ...Object.keys(componentInfoObjects.componentTypesCreatingVariants),
        "_copy",
    ];
}

// getNumVariants: needed in returnAllPossibleVariants
// needed from componentInfoObjects:
// - isInheritedComponentType
// - what is needed from gatherVariantComponents and determineVariantsForSection
export function getNumVariants({
    serializedComponent,
    componentInfoObjects,
    infoDiagnostics,
}: {
    serializedComponent: any;
    componentInfoObjects: any;
    infoDiagnostics?: DiagnosticRecord[];
}): any {
    // get number of variants from document (or other sectioning component)

    if (!serializedComponent.variants) {
        serializedComponent.variants = {};
    }

    let variantControlChild;
    for (let child of serializedComponent.children) {
        if (child.componentType === "variantControl") {
            variantControlChild = child;
            break;
        }
    }

    let isDocument = serializedComponent.componentType === "document";

    if (!variantControlChild) {
        if (!isDocument) {
            // if are a section without a variant control, it doesn't determine variants
            return { success: false };
        }

        // if have a single child that is a section, use variants from that section

        let nonBlankChildren = serializedComponent.children.filter(
            (x: any) => x.componentType || x.trim() !== "",
        );

        if (
            nonBlankChildren.length === 1 &&
            componentInfoObjects.isInheritedComponentType({
                inheritedComponentType: nonBlankChildren[0].componentType,
                baseComponentType: "_sectioningComponent",
            })
        ) {
            let sectionChild = nonBlankChildren[0];

            let results = getNumVariants({
                serializedComponent: sectionChild,
                componentInfoObjects,
                infoDiagnostics,
            });

            if (results.success) {
                serializedComponent.variants.descendantVariantComponents =
                    gatherVariantComponents({
                        serializedComponents: serializedComponent.children,
                        componentInfoObjects,
                    });

                serializedComponent.variants.uniqueVariants = true;
                serializedComponent.variants.numVariants =
                    sectionChild.variants.numVariants;
                serializedComponent.variants.allPossibleVariants =
                    sectionChild.variants.allPossibleVariants;
                serializedComponent.variants.allVariantNames =
                    sectionChild.variants.allVariantNames;
                serializedComponent.variants.allPossibleVariantUniqueIndices = [
                    ...sectionChild.variants.allPossibleVariants.keys(),
                ].map((x) => x + 1);
                serializedComponent.variants.allPossibleVariantSeeds = [
                    ...sectionChild.variants.allPossibleVariants.keys(),
                ].map((x) => (x + 1).toString());

                return results;
            }
        }
    }

    return determineVariantsForSection({
        serializedComponent,
        componentInfoObjects,
        isDocument,
        infoDiagnostics,
    });
}

// determineVariantsForSection: needed in getNumVariants, which is needed in returnAllPossibleVariants
// needed from componentInfoObjects:
// - determineNumberOfUniqueVariants from base component and what is needed in there
//   which is determineNumberOfUniqueVariants from all variant types

export function determineVariantsForSection({
    serializedComponent,
    componentInfoObjects,
    isDocument = false,
    infoDiagnostics,
}: {
    serializedComponent: any;
    componentInfoObjects: any;
    isDocument?: boolean;
    infoDiagnostics?: DiagnosticRecord[];
}) {
    if (serializedComponent.variants === undefined) {
        serializedComponent.variants = {};
    }

    // if allPossibleVariants has already been set,
    // then determineVariantsForSection has already been run,
    // so just give the number of variants
    // Note: skipping this check and running this function again
    // could incorrectly invoke uniqueVariants, as numVariants would have already
    // been reduced to numVariantsSpecified
    if (serializedComponent.variants.allPossibleVariants) {
        return {
            success: true,
            numVariants: serializedComponent.variants.numVariants,
        };
    }

    let variantControlChild;
    for (let child of serializedComponent.children) {
        if (child.componentType === "variantControl") {
            variantControlChild = child;
            break;
        }
    }

    if (!variantControlChild && !isDocument) {
        let BaseComponent = componentInfoObjects.allComponentClasses._base;
        return BaseComponent.determineNumberOfUniqueVariants({
            serializedComponent,
            componentInfoObjects,
            infoDiagnostics,
        });
    }

    let specifiedVariantNamesAsWritten: string[] = [];
    if (variantControlChild?.attributes.variantNames) {
        specifiedVariantNamesAsWritten = serializedAttributeComponent(
            variantControlChild.attributes.variantNames,
        )!.children as string[];
    }
    let specifiedVariantNames = specifiedVariantNamesAsWritten.map((x) =>
        x.toLowerCase(),
    );

    if (
        specifiedVariantNames.length !==
        [...new Set(specifiedVariantNames)].length
    ) {
        throw Error("Duplicate variant names specified");
    }

    let numVariantsSpecified =
        variantControlChild?.attributes.numVariants?.primitive.value;
    if (!Number.isFinite(numVariantsSpecified)) {
        numVariantsSpecified = 100;
    }

    numVariantsSpecified = Math.min(Math.max(numVariantsSpecified, 1), 1000);

    let variantNames: string[] = [...specifiedVariantNames];

    if (variantNames.length < numVariantsSpecified) {
        // if fewer variantNames specified than numVariantsSpecified, find additional variantNames
        // try variantNames, n, n+1, ...., numVariantsSpecified, (converted to letters)
        // except skipping variantNames that are already in original variantNames
        let variantNumber = variantNames.length;
        let variantValue = variantNumber;
        let variantString: string;
        while (variantNumber < numVariantsSpecified) {
            variantNumber++;
            variantValue++;
            variantString = indexToLowercaseLetters(variantValue);
            while (specifiedVariantNames.includes(variantString)) {
                variantValue++;
                variantString = indexToLowercaseLetters(variantValue);
            }
            variantNames.push(variantString);
        }
    } else {
        variantNames = variantNames.slice(0, numVariantsSpecified);
    }

    // The names written in `variantsToInclude` and `variantsToExclude`. They
    // are compared with the variant names without case, and are checked
    // against the variants there are once it is known how many there are,
    // after unique variants are worked out (`knownVariantNames`).
    const includeAttribute = variantControlChild?.attributes.variantsToInclude;
    const variantsToIncludeAsWritten = serializedAttributeComponent(
        includeAttribute,
    )?.children as string[] | undefined;
    if (variantsToIncludeAsWritten?.length === 0) {
        throw Error(
            "Cannot specify a blank variantsToInclude attribute of a variantControl",
        );
    }

    const excludeAttribute = variantControlChild?.attributes.variantsToExclude;
    const variantsToExcludeAsWritten =
        (serializedAttributeComponent(excludeAttribute)?.children as
            string[] | undefined) ?? [];

    // determine seeds
    let specifiedSeeds: string[] = [];
    if (variantControlChild?.attributes.seeds) {
        specifiedSeeds = serializedAttributeComponent(
            variantControlChild.attributes.seeds,
        )!.children as string[];
    }

    let variantSeeds = [...specifiedSeeds];

    if (variantSeeds.length < numVariantsSpecified) {
        // if fewer variantSeeds specified than numVariantsSpecified,
        // then ignore the specified seeds and just use seeds 1, 2, ...numVariantsSpecified
        variantSeeds = [...Array(numVariantsSpecified).keys()].map((i) =>
            (i + 1).toString(),
        );
    } else {
        variantSeeds = variantSeeds.slice(0, numVariantsSpecified);
    }

    // determine if use unique variants
    // if unique variants attribute is specified as false or fail to determine number of unique variants
    // then do no use unique variants
    // else use unique variants

    let uniqueVariantsIsSpecified =
        variantControlChild?.attributes.uniqueVariants !== undefined;

    let uniqueVariants = Boolean(
        variantControlChild?.attributes.uniqueVariants?.primitive.value,
    );

    let uniqueResult: { success: boolean; numVariants: number } | undefined;

    if (uniqueVariants || !uniqueVariantsIsSpecified) {
        let BaseComponent = componentInfoObjects.allComponentClasses._base;
        uniqueResult = BaseComponent.determineNumberOfUniqueVariants({
            serializedComponent,
            componentInfoObjects,
            infoDiagnostics,
        }) as { success: boolean; numVariants: number };

        if (
            !uniqueResult.success ||
            !(
                uniqueResult.numVariants > 0 &&
                // If there are more than 10000000 variants,
                // there is no more than about a 0.05% chance of getting a duplicate in 100 tries
                // and no more than about a 5% chance of getting a duplicate in 1000 tries.
                // Since creating arrays that large to enumerate the unique results is getting to be expensive,
                // we'll just randomly and independently select variants.
                uniqueResult.numVariants <= 10000000
            )
        ) {
            uniqueVariants = false;
        } else {
            uniqueVariants = true;
        }
    }

    // The variants there are. With unique variants, there are no more of them
    // than there are unique ones, however many names there are.
    const availableVariantNames =
        uniqueVariants && uniqueResult
            ? variantNames.slice(0, uniqueResult.numVariants)
            : variantNames;
    const variantNamesAsWritten = availableVariantNames.map(
        (name, ind) => specifiedVariantNamesAsWritten[ind] ?? name,
    );

    // A name that is not a variant is ignored, with an error, and the other
    // names are used (DIAG-5, DIAG-7). If `variantsToInclude` names no
    // variant at all, every variant is included.
    const included = variantsToIncludeAsWritten
        ? knownVariantNames({
              attributeName: "variantsToInclude",
              attribute: includeAttribute,
              namesAsWritten: variantsToIncludeAsWritten,
              availableVariantNames,
              variantNamesAsWritten,
              serializedComponent,
              variantControlChild,
              infoDiagnostics,
          })
        : undefined;
    const excluded = knownVariantNames({
        attributeName: "variantsToExclude",
        attribute: excludeAttribute,
        namesAsWritten: variantsToExcludeAsWritten,
        availableVariantNames,
        variantNamesAsWritten,
        serializedComponent,
        variantControlChild,
        infoDiagnostics,
    });

    const variantsToInclude = (
        included && included.length > 0 ? included : availableVariantNames
    ).filter((x) => !excluded.includes(x));

    let variantsIndicesSeedsToInclude = variantsToInclude.map((variant) => {
        // Note: this index is for the case where we have unique indices.
        // After unique options are shuffled, use these indices
        const index = variantNames.indexOf(variant) + 1;
        return { variant, index, seed: variantSeeds[index - 1] };
    });

    let allPossibleVariants: string[] = [];
    let allPossibleVariantUniqueIndices: number[] = [];
    let allPossibleVariantSeeds: string[] = [];

    // including `uniqueResult` in test is just for typescript
    if (uniqueVariants && uniqueResult) {
        // if the variant control specified indices beyond the ones available, ignore them
        variantsIndicesSeedsToInclude = variantsIndicesSeedsToInclude.filter(
            ({ index }) => index <= uniqueResult.numVariants,
        );
        const maxIndex = variantsIndicesSeedsToInclude.reduce(
            (a, c) => Math.max(a, c.index),
            0,
        );

        // for this shuffling of the variants, we just use a separate instance of the rng with seed "0"
        const rng = seedrandom.alea("0");
        const N = uniqueResult.numVariants;

        // Shuffle the unique indices and choose maxIndex of them
        // (We don't actually have to shuffle them all, just shuffle into the first part of the array of size maxIndex)
        // https://stackoverflow.com/a/11935263
        const uniqueIndices = [...Array(N).keys()].map((i) => i + 1);

        for (let i = 0; i < maxIndex; i++) {
            const rand = rng();
            const j = i + Math.floor(rand * (N - i));
            [uniqueIndices[i], uniqueIndices[j]] = [
                uniqueIndices[j],
                uniqueIndices[i],
            ];
        }

        const uniqueIndicesToChooseFrom = uniqueIndices.slice(0, maxIndex);

        for (const { variant, index, seed } of variantsIndicesSeedsToInclude) {
            allPossibleVariantUniqueIndices.push(
                uniqueIndicesToChooseFrom[index - 1],
            );
            allPossibleVariants.push(variant);
            allPossibleVariantSeeds.push(seed);
        }
    } else {
        allPossibleVariants = variantsToInclude;
        allPossibleVariantUniqueIndices = variantsIndicesSeedsToInclude.map(
            ({ index }) => index,
        );
        allPossibleVariantSeeds = variantsIndicesSeedsToInclude.map(
            ({ seed }) => seed,
        );
    }

    let numVariants = allPossibleVariants.length;
    if (numVariants === 0) {
        throw Error(
            "No variants selected based on variantsToInclude, variantsToExclude, and the number of variants available",
        );
    }

    serializedComponent.variants.uniqueVariants = uniqueVariants;
    serializedComponent.variants.numVariants = numVariants;
    serializedComponent.variants.allPossibleVariants = allPossibleVariants;
    serializedComponent.variants.allVariantNames = variantNames;
    serializedComponent.variants.allPossibleVariantUniqueIndices =
        allPossibleVariantUniqueIndices;
    serializedComponent.variants.allPossibleVariantSeeds =
        allPossibleVariantSeeds;

    return {
        success: true,
        numVariants,
    };
}

/** How many variant names `doenet-e0078` lists before it shortens the list. */
const MAX_VARIANT_NAMES_LISTED = 8;

/**
 * The names among `namesAsWritten` (from `variantsToInclude` or
 * `variantsToExclude`) that are variants, compared without case, without
 * repeats, in lowercase.
 *
 * The others are left out, and named in one error diagnostic at the
 * attribute (`doenet-e0078`), each once, as it was first written, pushed to
 * `infoDiagnostics`. That buffer holds every diagnostic found before Core
 * exists, not only infos: `CoreWorker` makes it Core's
 * `preliminaryDiagnostics`. This runs once per sectioning
 * component, as `determineVariantsForSection` returns early once it has set
 * `allPossibleVariants`.
 */
function knownVariantNames({
    attributeName,
    attribute,
    namesAsWritten,
    availableVariantNames,
    variantNamesAsWritten,
    serializedComponent,
    variantControlChild,
    infoDiagnostics,
}: {
    attributeName: "variantsToInclude" | "variantsToExclude";
    attribute: any;
    namesAsWritten: string[];
    availableVariantNames: string[];
    variantNamesAsWritten: string[];
    serializedComponent: any;
    variantControlChild: any;
    infoDiagnostics?: DiagnosticRecord[];
}): string[] {
    const known: string[] = [];
    const unknown: string[] = [];
    // each unknown name as it was first written
    const unknownAsWritten: string[] = [];
    for (const nameAsWritten of namesAsWritten) {
        const name = nameAsWritten.toLowerCase();
        if (availableVariantNames.includes(name)) {
            if (!known.includes(name)) {
                known.push(name);
            }
        } else if (!unknown.includes(name)) {
            unknown.push(name);
            unknownAsWritten.push(nameAsWritten);
        }
    }

    if (unknownAsWritten.length > 0 && infoDiagnostics) {
        // A long list of variants is shown by its first few and its last,
        // as the letters `a` to `cv` of a hundred unnamed variants.
        const numVariants = variantNamesAsWritten.length;
        const variantsShown =
            numVariants <= MAX_VARIANT_NAMES_LISTED
                ? variantNamesAsWritten.map((name) => `\`${name}\``)
                : [
                      ...variantNamesAsWritten
                          .slice(0, MAX_VARIANT_NAMES_LISTED - 2)
                          .map((name) => `\`${name}\``),
                      "…",
                      `\`${variantNamesAsWritten[numVariants - 1]}\``,
                  ];
        const allUnknown =
            attributeName === "variantsToInclude" && known.length === 0;
        const component = attribute?.component;
        infoDiagnostics.push(
            codedDiagnostic({
                type: "error",
                code: "doenet-e0078",
                args: {
                    attribute: attributeName,
                    names: {
                        list: unknownAsWritten.map((name) => `\`${name}\``),
                        type: "conjunction",
                    },
                    component: serializedComponent.componentType,
                    numVariants,
                    variants: { list: variantsShown, type: "unit" },
                    outcome: allUnknown ? "allVariants" : "ignored",
                },
                position:
                    component?.position ??
                    attribute?.position ??
                    variantControlChild?.position,
                sourceDoc:
                    component?.sourceDoc ??
                    attribute?.sourceDoc ??
                    variantControlChild?.sourceDoc,
            }),
        );
    }

    return known;
}

function indexToLowercaseLetters(index: number) {
    return numberToLetters(index, true);
}

/**
 * Extract and validate a constant sort attribute from a serialized component.
 * Used by selection components (selectFromSequence, selectPrimeNumbers) to ensure
 * the sort attribute is a constant string value during variant determination.
 *
 * @param serializedComponent - The component to extract sort from
 * @param componentName - The component type name (for error messages)
 * @param numToSelect - The number of items being selected (determines if sort is valid)
 * @returns Object with success flag and extracted sort value ("unsorted", "increasing", "decreasing")
 */
export function extractConstantSortAttribute(
    serializedComponent: any,
    componentName: string,
    numToSelect: number,
    infoDiagnostics?: DiagnosticRecord[],
): { success: boolean; sort?: string } {
    let sort;

    let sortComponent = serializedAttributeComponent(
        serializedComponent.attributes.sort,
    );
    if (sortComponent) {
        // only implemented if have a single string child

        if (
            sortComponent.children?.length === 1 &&
            typeof sortComponent.children[0] === "string"
        ) {
            sort = sortComponent.children[0].trim().toLowerCase();
        } else if (
            (!sortComponent.children || sortComponent.children?.length === 0) &&
            typeof sortComponent.state?.value === "string"
        ) {
            sort = sortComponent.state.value.trim().toLowerCase();
        } else {
            pushVariantInfo(
                infoDiagnostics,
                {
                    code: "doenet-i0027",
                    component: componentName,
                    args: { attribute: "sort" },
                },
                serializedComponent,
            );
            return { success: false };
        }
    } else {
        sort = "unsorted";
    }

    if (sort !== "unsorted" && numToSelect > 1) {
        pushVariantInfo(
            infoDiagnostics,
            { code: "doenet-i0031", component: componentName },
            serializedComponent,
        );
        return { success: false };
    }

    return { success: true, sort };
}

/**
 * Append an info-typed diagnostic record describing a reason that unique
 * variant determination failed. Variant code runs during DAST serialization,
 * before Core exists, so the caller chains pass this buffer down and Core
 * drains it into `preliminaryDiagnostics` when it's constructed.
 *
 * Takes a code and its arguments rather than a finished sentence. Before, the
 * ~40 call sites behind this helper each held a literal English string, and
 * the migration burn-down could not see any of them: it counts diagnostic
 * *constructions*, and there is only one here (#1518).
 *
 * `component` is the one argument every one of these messages takes, so it is
 * a parameter rather than something each site remembers to pass. It is a tag
 * name and stays as written in every language, which is what makes it an
 * argument at all — the reasons differ in prose, so each is its own code.
 */
export function pushVariantInfo(
    infoDiagnostics: DiagnosticRecord[] | undefined,
    {
        code,
        component,
        args,
    }: {
        code: DiagnosticCode;
        /** The tag being analyzed, for messages that name it. */
        component?: string;
        args?: DiagnosticArgs;
    },
    serializedComponent: any,
) {
    if (!infoDiagnostics) {
        return;
    }
    infoDiagnostics.push(
        codedDiagnostic({
            type: "info",
            code,
            args:
                component === undefined ? args : { component, ...(args ?? {}) },
            position: serializedComponent?.position,
            sourceDoc: serializedComponent?.sourceDoc,
        }),
    );
}
