/**
 * Conversion from javascript to rust for the point component
 */
export function pointJsToRust(props: Record<string, any>) {
    const numericalXs = props.numericalXs;

    props.x = {
        math_object: numericalXs[0].toString(),
    };

    if (numericalXs.length >= 2) {
        props.y = {
            math_object: numericalXs[1].toString(),
        };
    }
    if (numericalXs.length >= 3) {
        props.z = {
            math_object: numericalXs[2].toString(),
        };
    }
    props.coordsLatex = props.latex;
}
