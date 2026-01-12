import React from "react";

/**
 * Set variants state variable from the doenet generatedVariantCallback result.
 *
 * @param x - The object passed to the generatedVariantCallback
 * @param variants - The current variants state variable
 * @param setVariants - The setState function for the variants state variable
 */
export function setVariantsFromCallback(
    x: any,
    variants: {
        index: number;
        numVariants: number;
        allPossibleVariants: string[];
    },
    setVariants: React.Dispatch<
        React.SetStateAction<{
            index: number;
            numVariants: number;
            allPossibleVariants: string[];
        }>
    >,
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
