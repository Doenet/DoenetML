import { DastElement } from "@doenet/parser";
import { VFile } from "vfile";
import { breakStringInPiecesBySpacesOrParens } from "./break-into-pieces";
import { AssignNamesContext, chooseCompositeName } from "./context";
import { PositionMap, registerAssignNames } from "./register-assign-names";

/**
 * Parse an element's `assignNames`, pick the v0.7 name the composite will carry, and
 * register the indexed path that replaces each assigned name.
 *
 * Returns the chosen name, or `undefined` when the value could not be parsed (in which
 * case a message has been recorded and nothing was registered). The caller is responsible
 * for putting the name on the element — `<map>` puts it on the `<repeat>` it produces
 * rather than on the element that carried `assignNames`.
 */
export function registerCompositeAssignNames({
    node,
    assignNamesValue,
    fallbackBase,
    context,
    file,
    positionMap,
}: {
    node: DastElement;
    assignNamesValue: string;
    /** Base name to generate from when the assigned names cannot be reused. */
    fallbackBase: string;
    context: AssignNamesContext;
    file: VFile;
    positionMap?: PositionMap;
}): string | undefined {
    const origin = { elementName: node.name, position: node.position };
    const parsed = breakStringInPiecesBySpacesOrParens(assignNamesValue);
    if (!parsed.success) {
        // Calling through anyway keeps the "unbalanced parentheses" message in one place.
        registerAssignNames({
            assignNamesValue,
            compositeName: "",
            registry: context.registry,
            origin,
            file,
        });
        return undefined;
    }

    const compositeName = chooseCompositeName(
        node,
        parsed.pieces,
        fallbackBase,
        context,
    );
    registerAssignNames({
        assignNamesValue,
        compositeName,
        registry: context.registry,
        origin,
        file,
        positionMap,
    });
    return compositeName;
}
