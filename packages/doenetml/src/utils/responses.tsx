import React from "react";
//@ts-ignore
import me from "math-expressions";
import { MathJax } from "better-react-mathjax";

/**
 * Format responses from submitted events into react elements
 * with MathJax rendering mathematical quantities
 */
export function formatResponse(
    response: unknown[],
    componentTypes: string[],
): React.JSX.Element {
    return (
        <>
            {response.map((v, i) => {
                const componentType = componentTypes[i];
                if (
                    ["math", "point", "matrix", "vector"].includes(
                        componentType,
                    )
                ) {
                    const expr = me
                        .fromAst(v)
                        .round_numbers_to_precision_plus_decimals(6, 2);
                    return (
                        <div key={i}>
                            <MathJax hideUntilTypeset={"first"} inline dynamic>
                                {
                                    //@ts-ignore
                                    "\\(" + expr.toLatex() + "\\)"
                                }
                            </MathJax>
                        </div>
                    );
                } else {
                    return (
                        <div style={{ whiteSpace: "pre-line" }} key={i}>
                            {String(v)}
                        </div>
                    );
                }
            })}
        </>
    );
}
