import { FlatDastRootWithErrors } from "@doenet/doenetml-worker";

/**
 * Convert DoenetML to static PreTeXt.
 */
export async function doenetmlToPretext() {
    // This function is a placeholder for the main export of the package.
    // It can be used to initialize or export functionalities related to DoenetML to PreTeXt conversion.
    console.log("DoenetML to PreTeXt conversion initialized.");
}

/**
 * Convert DoenetML `source` into a static DAST representation. This is suitable for rendering to PreTeXt.
 * @param source
 */
export async function getStaticDast(source: string): Promise<FlatDastRootWithErrors> {
    throw new Error(
        "getStaticDast is not implemented yet. Please use the DoenetML to PreTeXt conversion tools.",
    );
}
