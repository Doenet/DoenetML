/**
 * Names declared in the branches of a branch container, as seen from outside
 * it (D13, D22; issue #2455).
 *
 * A `<conditionalContent>` shows one of its `<case>`s or its `<else>`, and a
 * `<select>` that picks one shows one of its `<option>`s. The names declared
 * in those branches are visible outside the container, as a `<group>`'s are,
 * and the same name declared in several branches is not ambiguous, since
 * only one branch is active. The core resolver records such a name as the
 * container's branches (`Ref::Branches` in
 * `lib-doenetml-core/src/dast/ref_resolve/`), so resolving `$x` from outside
 * returns the container with `x` left unresolved, as for `$cc.x`.
 *
 * Whether the name then resolves is decided at load by the every-branch,
 * same-tag rule (`branchDeclaration` in
 * `doenetml-worker-javascript/src/utils/dast/typeChangeAtLoad.ts`): every
 * branch must declare it, once, with the same tag. Otherwise it is missing,
 * with `doenet-w0183` when a branch lacks it or `doenet-w0184` when the tags
 * differ. This module mirrors that rule on the raw DAST the language server
 * has, so autocomplete offers exactly the names that resolve.
 *
 * The mirror is deliberately conservative: anything the language server
 * cannot decide from the DoenetML as written (a branch written with `copy`
 * or `extend`, a container written with them, a name declared twice in one
 * branch) is treated as not resolving, since offering a reference the
 * runtime then reports is worse than leaving one out.
 */

import type { DastElement, DastNodes } from "@doenet/parser";
import {
    findAttributeKey,
    getElementAttributeValue,
} from "./dast-attribute-utils";

/** The kind of branches a branch container has. */
export type BranchKind = "case" | "option";

/**
 * The literal `name` of `element`, if it is written as plain text. Mirrors
 * `getElementNameAttributeValue` in `rust-resolver-adapter.ts`, which this
 * module cannot import without a cycle.
 */
function literalName(element: DastElement): string | null {
    const nameAttr = element.attributes?.name;
    if (
        nameAttr &&
        nameAttr.children?.length === 1 &&
        nameAttr.children[0].type === "text"
    ) {
        return nameAttr.children[0].value;
    }
    return null;
}

/** Whether `element` is written with `copy` or `extend`. */
function isWrittenAsCopy(element: DastElement): boolean {
    return (
        findAttributeKey(element, "copy") !== undefined ||
        findAttributeKey(element, "extend") !== undefined
    );
}

/**
 * The kind of branch container `element` is, if any, mirroring the core's
 * `branch_container_kind` (`ref_resolve/resolve.rs`):
 *
 * - a `<conditionalContent>`, whose branches are its `<case>`s and `<else>`;
 * - a `<select>` that picks one, whose branches are its `<option>`s:
 *   `numToSelect` written as exactly `1` (trimmed), or left out on a select
 *   not written with `copy` or `extend` (a copy picks as many as what it
 *   copies).
 *
 * With `indexed`, for a name after an index into a select's picks
 * (`$s[2].x`), a `<select>` of any number of picks shows one option there,
 * as `branchKind` in `typeChangeAtLoad.ts` has it.
 */
export function branchContainerKind(
    element: DastElement,
    indexed = false,
): BranchKind | undefined {
    const tag = element.name.toLowerCase();
    if (tag === "conditionalcontent") {
        return "case";
    }
    if (tag !== "select") {
        return undefined;
    }
    if (indexed) {
        return "option";
    }
    if (findAttributeKey(element, "numToSelect") === undefined) {
        return isWrittenAsCopy(element) ? undefined : "option";
    }
    return getElementAttributeValue(element, "numToSelect") === "1"
        ? "option"
        : undefined;
}

/**
 * The children of each branch of `container`, or `undefined` when what a
 * branch holds cannot be read from the DoenetML as written: the container
 * or a branch is written with `copy` or `extend`.
 *
 * A `<conditionalContent>` with no `<case>` or `<else>` is, after its sugar
 * (`conditionalContentSugar` in the parser), one case holding all its
 * children.
 */
function branchesOf(
    container: DastElement,
    kind: BranchKind,
): DastNodes[][] | undefined {
    if (isWrittenAsCopy(container)) {
        return undefined;
    }
    const branchTags = kind === "case" ? ["case", "else"] : ["option"];
    const branches: DastNodes[][] = [];
    for (const child of container.children) {
        if (child.type !== "element") continue;
        if (!branchTags.includes(child.name.toLowerCase())) continue;
        if (isWrittenAsCopy(child)) {
            return undefined;
        }
        branches.push(child.children as DastNodes[]);
    }
    if (branches.length === 0 && kind === "case") {
        return [container.children as DastNodes[]];
    }
    return branches;
}

/**
 * What the components among `nodes` declare by `name`, where a reference
 * from outside them would see it (`visibleDeclarations` in
 * `typeChangeAtLoad.ts`): written there or in a component written there,
 * but not in a repeat or a `<select>`'s options (private, or decided as a
 * nested branch container), nor below a component with the name (which
 * hides any of that name in it). Each entry is one declaration, as the
 * declaring elements (several for a nested branch container, one per
 * branch), or `null` for a nested branch container whose branches do not
 * satisfy the rule.
 */
function visibleDeclarations(
    nodes: DastNodes[],
    name: string,
    found: (DastElement[] | null)[],
): void {
    for (const node of nodes) {
        if (node.type !== "element") continue;
        if (literalName(node) === name) {
            found.push([node]);
            continue;
        }
        if (branchContainerKind(node)) {
            const declared = branchDeclarations(node, [name]);
            if (declared !== "none") {
                found.push(declared);
            }
            continue;
        }
        const tag = node.name.toLowerCase();
        if (
            tag === "repeat" ||
            tag === "repeatforsequence" ||
            tag === "select" ||
            tag === "option"
        ) {
            continue;
        }
        visibleDeclarations(node.children as DastNodes[], name, found);
    }
}

/**
 * How many declarations of `name` a reference sees among `nodes` and their
 * descendants (`visibleDeclarations`): a branch container whose branches
 * declare it counts once. More than one makes a reference to it from
 * where all of `nodes` are visible ambiguous.
 */
export function countVisibleDeclarations(
    nodes: DastNodes[],
    name: string,
): number {
    const found: (DastElement[] | null)[] = [];
    visibleDeclarations(nodes, name, found);
    return found.length;
}

/**
 * The elements `nodes` declare by the path `names` (`$h.x` as
 * `["h", "x"]`), one per branch passed through, or `null` when they do not
 * declare it exactly once, or `"none"` when they do not declare
 * `names[0]` at all.
 */
function declarationsIn(
    nodes: DastNodes[],
    names: string[],
): DastElement[] | null | "none" {
    const found: (DastElement[] | null)[] = [];
    visibleDeclarations(nodes, names[0], found);
    if (found.length === 0) {
        return "none";
    }
    if (found.length > 1 || found[0] === null) {
        // Declared twice (ambiguous, reported by the run time) or in a
        // nested container whose branches do not satisfy the rule.
        return null;
    }
    if (names.length === 1) {
        return found[0];
    }
    const result: DastElement[] = [];
    for (const declaration of found[0]) {
        const below = declarationsBelow(declaration, names.slice(1));
        if (below === null) {
            return null;
        }
        result.push(...below);
    }
    return result;
}

/**
 * The elements `element`, declared by a name, declares by the names after
 * it (`names`), or `null` when it does not declare them so that a
 * reference could see them.
 */
function declarationsBelow(
    element: DastElement,
    names: string[],
): DastElement[] | null {
    if (branchContainerKind(element)) {
        const declared = branchDeclarations(element, names);
        return declared === "none" ? null : declared;
    }
    const tag = element.name.toLowerCase();
    if (
        tag === "repeat" ||
        tag === "repeatforsequence" ||
        tag === "select" ||
        isWrittenAsCopy(element)
    ) {
        // Reached through an index, or what a copy holds, which is not
        // read here.
        return null;
    }
    const declared = declarationsIn(element.children as DastNodes[], names);
    return declared === "none" ? null : declared;
}

/**
 * What the branches of the branch container `container` declare by the
 * path `names` (`$x` as `["x"]`, `$x.y` as `["x", "y"]`), mirroring
 * `branchDeclaration` in `typeChangeAtLoad.ts`:
 *
 * - `"none"`: no branch declares `names[0]`;
 * - the declaring elements, one per branch (more for a nested branch
 *   container), when every branch declares the path once and the last
 *   name with the same tag, so that the reference resolves to the active
 *   branch's;
 * - `null` otherwise: a branch lacks it (`doenet-w0183`), the tags differ
 *   (`doenet-w0184`), a branch declares it twice, the container has no
 *   branches, or what a branch holds is not read here.
 *
 * With `indexed`, for a name after an index into a select's picks
 * (`$s[2].x`), `container` may be a `<select>` of any number of picks.
 */
export function branchDeclarations(
    container: DastElement,
    names: string[],
    indexed = false,
): DastElement[] | null | "none" {
    const kind = branchContainerKind(container, indexed);
    if (!kind || names.length === 0) {
        return null;
    }
    const branches = branchesOf(container, kind);
    if (!branches) {
        return null;
    }
    const perBranch = branches.map((nodes) => declarationsIn(nodes, names));
    if (perBranch.every((declared) => declared === "none")) {
        return "none";
    }
    const result: DastElement[] = [];
    for (const declared of perBranch) {
        if (declared === "none" || declared === null) {
            return null;
        }
        result.push(...declared);
    }
    const tag = result[0].name.toLowerCase();
    if (result.some((element) => element.name.toLowerCase() !== tag)) {
        return null;
    }
    return result;
}

/**
 * The element a reference from `container` to its descendant `name`
 * (`$sec.x`) names when `name` is declared in the branches of a branch
 * container below it (`$sec.x` for an `x` in every case of a
 * `<conditionalContent>` in `sec`): the first branch's declaration, which
 * shares its tag with the others. `null` when `container`'s descendants do
 * not declare `name` exactly once so (`declarationsIn`).
 */
export function branchDeclarationBelow(
    container: DastElement,
    name: string,
): DastElement | null {
    const declared = declarationsIn(container.children as DastNodes[], [name]);
    return Array.isArray(declared) ? declared[0] : null;
}

/**
 * The names a reference through `container` (`$cc.x`, or `$s[2].x` with
 * `indexed`) resolves to the active branch's: those every branch declares
 * once with the same tag (`branchDeclarations`). With `prefix`, the names
 * after it instead (`$cc.h.x` or `$h.x` for `h` declared in the branches,
 * with `prefix` `["h"]`): those that what every branch declares by
 * `prefix` declares in turn. Empty when `container` is not a branch
 * container or `prefix` does not resolve through it.
 */
export function sharedBranchNames(
    container: DastElement,
    indexed = false,
    prefix: string[] = [],
): string[] {
    const kind = branchContainerKind(container, indexed);
    if (!kind) {
        return [];
    }
    // Every shared name is declared in the first branch, or, with
    // `prefix`, below what the first branch declares by it.
    let firstNodes: DastNodes[];
    if (prefix.length === 0) {
        const branches = branchesOf(container, kind);
        if (!branches || branches.length === 0) {
            return [];
        }
        firstNodes = branches[0];
    } else {
        const declared = branchDeclarations(container, prefix, indexed);
        if (declared === null || declared === "none") {
            return [];
        }
        firstNodes = declared[0].children as DastNodes[];
    }
    const candidates = new Set<string>();
    collectNames(firstNodes, candidates);
    return [...candidates].filter((name) => {
        const declared = branchDeclarations(
            container,
            [...prefix, name],
            indexed,
        );
        return declared !== null && declared !== "none";
    });
}

/** Every literal `name` among `nodes` and their descendants. */
function collectNames(nodes: DastNodes[], names: Set<string>): void {
    for (const node of nodes) {
        if (node.type !== "element") continue;
        const name = literalName(node);
        if (name) {
            names.add(name);
        }
        collectNames(node.children as DastNodes[], names);
    }
}

/**
 * The names shared by the branches (`sharedBranchNames`) of every branch
 * container in `root`'s subtree. These are the candidates for a bare `$x`
 * that the core resolves through a container; whether one is reachable
 * from a given cursor is still for the resolver to say.
 */
export function namesSharedByBranchesIn(root: {
    children: unknown[];
}): string[] {
    const names = new Set<string>();
    function walk(nodes: DastNodes[]) {
        for (const node of nodes) {
            if (node.type !== "element") continue;
            if (branchContainerKind(node)) {
                for (const name of sharedBranchNames(node)) {
                    names.add(name);
                }
            }
            walk(node.children as DastNodes[]);
        }
    }
    walk(root.children as DastNodes[]);
    return [...names];
}
