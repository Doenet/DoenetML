import { numberToLetters, enumerateCombinations } from "@doenet/utils";
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

// getNumVariants: needed in returnAllPossibleVariants
// needed from componentInfoObjects:
// - isInheritedComponentType
// - what is needed from gatherVariantComponents and determineVariantsForSection
export function getNumVariants({
    serializedComponent,
    componentInfoObjects,
}: any): any {
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
}: {
    serializedComponent: any;
    componentInfoObjects: any;
    isDocument: boolean;
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
        });
    }

    let specifiedVariantNames: string[] = [];
    if (variantControlChild?.attributes.variantNames) {
        specifiedVariantNames =
            variantControlChild.attributes.variantNames.component.children.map(
                (x: any) => x.toLowerCase(),
            );
    }

    if (
        specifiedVariantNames.length !==
        [...new Set(specifiedVariantNames)].length
    ) {
        throw Error("Duplicate variant names specified");
    }

    let numVariantsSpecified =
        variantControlChild?.attributes.numVariants?.primitive;
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

    let variantsToInclude: string[] | undefined =
        variantControlChild?.attributes.variantsToInclude?.component.children;
    if (variantsToInclude) {
        if (variantsToInclude.length === 0) {
            throw Error(
                "Cannot specify a blank variantsToInclude attribute of a variantControl",
            );
        }

        variantsToInclude = variantsToInclude.map((x) => x.toLowerCase());

        // deduplicate
        variantsToInclude = [...new Set(variantsToInclude)];

        for (let variant of variantsToInclude) {
            if (!variantNames.includes(variant)) {
                throw Error(
                    `Cannot include variant ${variant} as ${variant} is a not variant name`,
                );
            }
        }
    }

    let variantsToExclude: string[] =
        variantControlChild?.attributes.variantsToExclude?.component.children ||
        [];
    variantsToExclude = variantsToExclude.map((x) => x.toLowerCase());

    for (let variant of variantsToExclude) {
        if (!variantNames.includes(variant)) {
            throw Error(
                `Cannot exclude variant ${variant} as ${variant} is not a variant name`,
            );
        }
    }

    if (variantsToInclude) {
        variantsToInclude = variantsToInclude.filter(
            (x: any) => !variantsToExclude.includes(x),
        );
    } else {
        variantsToInclude = [...variantNames].filter(
            (x) => !variantsToExclude.includes(x),
        );
    }

    // determine seeds
    let specifiedSeeds: string[] = [];
    if (variantControlChild?.attributes.seeds) {
        specifiedSeeds =
            variantControlChild.attributes.seeds.component.children;
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

    let variantsIndicesSeedsToInclude = variantsToInclude.map((variant) => {
        // Note: this index is for the case where we have unique indices.
        // After unique options are shuffled, use these indices
        const index = variantNames.indexOf(variant) + 1;
        return { variant, index, seed: variantSeeds[index - 1] };
    });

    // determine if use unique variants
    // if unique variants attribute is specified as false or fail to determine number of unique variants
    // then do no use unique variants
    // else use unique variants

    let uniqueVariantsIsSpecified =
        variantControlChild?.attributes.uniqueVariants !== undefined;

    let uniqueVariants = Boolean(
        variantControlChild?.attributes.uniqueVariants?.primitive,
    );

    let uniqueResult: { success: boolean; numVariants: number } | undefined;

    if (uniqueVariants || !uniqueVariantsIsSpecified) {
        let BaseComponent = componentInfoObjects.allComponentClasses._base;
        uniqueResult = BaseComponent.determineNumberOfUniqueVariants({
            serializedComponent,
            componentInfoObjects,
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

function indexToLowercaseLetters(index: number) {
    return numberToLetters(index, true);
}
