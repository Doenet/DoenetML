import { parseModule, Program as EstreeProgram } from "esprima";

/**
 * Turn a plain JS object into an ESTree object suitable for including in a `mdxJsxAttributeValueExpression`.
 */
export function objectToEstree(obj: any): EstreeProgram {
    const estreeRaw = parseModule(`const IGNORE = ${JSON.stringify(obj)}`);

    const decl = estreeRaw.body[0];
    if (decl.type !== "VariableDeclaration") {
        throw new Error("PARSE ERROR: Expected a VariableDeclaration");
    }
    const decl2 = decl.declarations[0];
    if (decl2.type !== "VariableDeclarator") {
        throw new Error("PARSE ERROR: Expected a VariableDeclarator");
    }
    const expr = decl2.init;
    if (!expr) {
        throw new Error("PARSE ERROR: Expected an Expression");
    }

    return {
        type: "Program",
        body: [
            {
                type: "ExpressionStatement",
                expression: expr,
            },
        ],
        sourceType: "module",
    };
}
