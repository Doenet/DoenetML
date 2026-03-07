declare module "rgb" {
    type RgbConverter = {
        (color: string): string;
        matches: (color: string) => boolean;
        replace: (
            text: string,
            replacement?: (match: string) => string,
        ) => string;
    };

    const rgb: RgbConverter;
    export default rgb;
}
