import TextBaseOperatorOfMath from "./abstract/TextBaseOperatorOfMath";

export class ExtractMathOperator extends TextBaseOperatorOfMath {
    static componentType = "extractMathOperator";

    static componentDocs = {
        summary:
            'Returns the top-level operator of a math expression as text (e.g. "+", "vector").',
    };

    static applyTextOperator(values) {
        if (values.length === 0) {
            return "";
        }
        if (values.length !== 1) {
            console.warn("MathOperator requires exactly one math child");
            return "";
        }

        if (!Array.isArray(values[0].tree)) {
            return "";
        }

        return values[0].tree[0];
    }
}
