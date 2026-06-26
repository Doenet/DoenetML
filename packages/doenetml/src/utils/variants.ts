import React from "react";

export type VariantsState = {
    index: number;
    numVariants: number;
    allPossibleVariants: string[];
};

/**
 * Convert the zero-based index emitted by `VariantSelect` back to the 1-based
 * variant index used by the viewer state.
 */
export function setVariantIndex(
    setVariants: React.Dispatch<React.SetStateAction<VariantsState>>,
    index: number,
) {
    setVariants((prev) => ({
        ...prev,
        index: index + 1,
    }));
}

/**
 * Set variants state variable from the doenet generatedVariantCallback result.
 *
 * @param x - The object passed to the generatedVariantCallback
 * @param variants - The current variants state variable
 * @param setVariants - The setState function for the variants state variable
 */
export function setVariantsFromCallback(
    x: any,
    variants: VariantsState,
    setVariants: React.Dispatch<React.SetStateAction<VariantsState>>,
) {
    const allPossibleVariants = x.allPossibleVariants;
    if (Array.isArray(allPossibleVariants)) {
        const numVariants = allPossibleVariants.length;
        if (
            typeof x.variantInfo === "object" &&
            typeof x.variantInfo.index === "number"
        ) {
            const index = x.variantInfo.index;

            // If the variant generated does not match the variant prescribed,
            // set the variants state variable to match.
            if (
                index !== variants.index ||
                numVariants !== variants.numVariants ||
                allPossibleVariants.some(
                    (v, i) => v !== variants.allPossibleVariants[i],
                )
            ) {
                setVariants({
                    index,
                    numVariants,
                    allPossibleVariants,
                });
            }
        }
    }
}
