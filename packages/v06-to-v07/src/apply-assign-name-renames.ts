import { Plugin } from "unified";
import { DastRoot } from "@doenet/parser";
import { applyRefRenames } from "./assign-names/apply-renames";
import { AssignNamesContext } from "./assign-names/context";

/**
 * Rewrite every reference to a v0.6 `assignNames` name, using the renames collected by
 * `upgradeCollectElement`, `upgradeMapElement` and `upgradeAssignNames`.
 *
 * This runs once, after all of them, so that a reference is rewritten exactly once no
 * matter which plugin claimed the name.
 */
export const applyAssignNameRenames: Plugin<
    [AssignNamesContext],
    DastRoot,
    DastRoot
> = (context) => {
    return (tree, file) => {
        applyRefRenames(tree, context.registry, file, context);
    };
};
