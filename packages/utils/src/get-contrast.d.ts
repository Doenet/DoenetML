declare module "get-contrast" {
    export type ContrastOptions = {
        ignoreAlpha?: boolean;
    };

    const contrast: {
        ratio: (
            colorA: string,
            colorB: string,
            options?: ContrastOptions,
        ) => number;
        score: (
            colorA: string,
            colorB: string,
            options?: ContrastOptions,
        ) => "AAA" | "AA" | "A" | "F";
        isAccessible: (
            colorA: string,
            colorB: string,
            options?: ContrastOptions,
        ) => boolean;
    };

    export default contrast;
}
