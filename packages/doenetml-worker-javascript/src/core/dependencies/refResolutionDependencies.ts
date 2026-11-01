/**
 * Dependency subclasses that resolve string-style component references
 * (e.g. `<copy target="…">`) and the attribute-ref machinery used by
 * those references.
 */

import { Dependency } from "./Dependency";
import { codedDiagnostic } from "../../utils/diagnostics";
import {
    doenetMLDollarsForReference,
    doenetMLStringForReference,
} from "../../utils/sourceLocation";
import { listEntryAtResolverNode } from "../listEntryResolverNodes";
import { listEntryTargetOfResolution } from "../listEntryTargets";
import { refResolutionAt } from "../../utils/referenceSlot";
import { instanceKindOf } from "../../utils/indexInstances";

/**
 * The same path with every index emptied.
 *
 * A path that has been through `resolveComponentsInPathIndices` holds only
 * strings in its indices; one that has not holds the components the author
 * wrote between the brackets. The second kind must not be handed on as a
 * resolution result: it ends up in `compositeReplacementRange`, which
 * `childDependencies.ts` round-trips through `JSON.stringify`, and a live
 * component is circular.
 */
function dropPathIndices(path: any[]): any[] {
    return path.map((pathPart) => ({ ...pathPart, index: [] }));
}

/**
 * Whether `component`, written between the brackets of a reference's path,
 * gives the index: an `integer`, or a value reference presenting as one
 * (`$i` of `$l[$i]`, `utils/dast/valueReferences.ts`).
 */
function isIndexComponent(component: any): boolean {
    return (
        component.componentType === "integer" ||
        (component.componentType === "_ref" &&
            component.presentedComponentType === "integer")
    );
}

/**
 * The index that `component` (see `isIndexComponent`) gives when its
 * `value` is `value`, as the literal string the resolver takes. A value
 * reference reads its referent's number as it is, so it is rounded here,
 * as the `integer` a copy would have made from it rounds.
 */
function indexFromValue(component: any, value: any): string {
    return (
        component.componentType === "_ref" ? Math.round(value) : value
    ).toString();
}

export class RefResolutionIndexDependencies extends Dependency {
    static dependencyType = "refResolutionIndexDependencies";

    setUpParameters() {
        if (this.definition.compositeIdx != undefined) {
            this.compositeIdx = this.definition.compositeIdx;
            this.specifiedComponentName = this.compositeIdx;
        } else {
            this.compositeIdx = this.upstreamComponentIdx;
        }

        // the reference of an attribute's slot, or the component's own
        this.slot = this.definition.slot;

        this.missingComponentBlockers = [];
    }

    /**
     * The reference this dependency resolves on `component`: its slot's
     * (`refResolutionAt`), or the component's own.
     */
    refResolutionOf(component: any) {
        return refResolutionAt(component, this.slot);
    }

    async determineDownstreamComponents() {
        this.compositeReplacementDependencies = [];

        let composite = this.dependencyHandler._components[this.compositeIdx];

        if (!composite) {
            await this.addBlockerUpdateTriggerForMissingComponent(
                this.compositeIdx,
            );
            this.missingComponentBlockers.push(this.compositeIdx);

            return {
                success: false,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        this.componentList = [];

        const gatherResult = await this.gatherComponentsInPath(
            this.refResolutionOf(composite).originalPath,
        );

        if (gatherResult.success) {
            this.componentList = gatherResult.componentList;
            return {
                success: true,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        } else {
            return {
                success: false,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }
    }

    // Iterate through the index of all parts of `originalPath`.
    // If encounter unexpanded composites, set up resolve blockers
    // so that this dependency will be resolved again once the composites are expanded.
    // Otherwise, gather all the component indices of the index components (`isIndexComponent`) into `componentList`.
    // If encountered unexpanded composites, return
    // - success: false
    // If successfully found all index components return
    // - success: true,
    // - componentList: a list of the component indices of the index components found in the unresolved path
    //
    // An index that did not come out as a single index component is simply left
    // out of `componentList`. It used to throw, which blanked the document
    // (#1917): the index of a component that had already been turned into an
    // `_error` is not an integer, so an ordinary authoring slip -- a mistyped
    // attribute on an `<indexOf>` -- took down the page and the diagnostic about
    // that slip with it. `resolveComponentsInPathIndices` sees the same component
    // and is the single place that decides the reference is dead, so there is
    // nothing to report from here.
    async gatherComponentsInPath(originalPath: any) {
        const componentList = [];
        let foundUnexpanded = false;
        for (const path_part of originalPath) {
            for (const index_part of path_part.index) {
                if (typeof index_part.value[0] !== "string") {
                    let indexComponent = index_part.value[0];

                    const haveComposite =
                        this.dependencyHandler.componentInfoObjects.isCompositeComponent(
                            {
                                componentType: indexComponent.componentType,
                                includeNonStandard: true,
                            },
                        );

                    if (haveComposite) {
                        if (!indexComponent.isExpanded) {
                            await this.addBlockerForUnexpandedComposite(
                                indexComponent,
                            );

                            foundUnexpanded = true;
                        } else {
                            this.addUpdateTriggersForCompositeReplacements([
                                indexComponent.componentIdx,
                            ]);
                            this.compositeReplacementDependencies.push(
                                indexComponent.componentIdx,
                            );

                            if (indexComponent.replacements.length !== 1) {
                                continue;
                            }
                            indexComponent = indexComponent.replacements[0];
                        }
                    }

                    if (!foundUnexpanded && !isIndexComponent(indexComponent)) {
                        continue;
                    }

                    componentList.push(indexComponent.componentIdx);
                }
            }
        }

        if (foundUnexpanded) {
            return { success: false };
        } else {
            return {
                success: true,
                componentList,
            };
        }
    }

    async getValue({ consumeChanges = true } = {}) {
        const result = await super.getValue({ consumeChanges });

        result.value = this.componentList;

        // since value was not determined using actual `downstreamComponentIndices`
        // we need to manually mark it as changed each time it is computed.
        result.changes.componentIdentitiesChanged = true;

        return result;
    }

    deleteFromUpdateTriggers() {
        for (const componentIdx of this.missingComponentBlockers) {
            this.deleteUpdateTriggerForMissingComponent(componentIdx);
        }

        this.deleteUpdateTriggersForCompositeReplacements(
            this.compositeReplacementDependencies,
        );
    }
}

/**
 * The number of instances an expanded `composite` has, i.e., of its
 * replacements an index counts (all but blank strings) that it has not
 * withheld.
 */
function numInstances(composite: any): number {
    const counted = (composite.replacements ?? []).filter(
        (replacement: any) =>
            typeof replacement !== "string" || replacement.trim() !== "",
    ).length;
    return Math.max(0, counted - (composite.replacementsToWithhold ?? 0));
}

/**
 * The name an author gave `component`, or `undefined` if it has none. The
 * names the parser makes up for compatibility start with `_`.
 */
function authoredName(component: any): string | undefined {
    const name = component?.attributes?.name?.primitive?.value;
    return typeof name === "string" && name !== "" && !name.startsWith("_")
        ? name
        : undefined;
}

/**
 * What the `<group>` an index selected a child of was written as, given the
 * type of the component that made it (`_instanceOf`, see
 * `utils/indexInstances.ts`): an `iteration` of a repeat, a `pick` of a
 * select, the `case` a `<conditionalContent>` shows, or a `group` written as
 * one. (Only a repeat, a select and a `<conditionalContent>` make such a
 * group.)
 */
function containerKind(instanceOf: string | undefined): string {
    if (instanceOf === "conditionalContent") {
        return "case";
    }
    const kind = instanceKindOf(instanceOf);
    return kind === "iteration" || kind === "pick" ? kind : "group";
}

/**
 * A dependency that attempts to resolve the `originalPath` of a `refResolution` on a composite component.
 *
 * If `refResolution.nodeIdx` has any composite descendants
 * or any indices of the path have composites, these composites are first expanded.
 * Then, the `originalPath` path is resolved from the first of the candidate origins that
 * `originsToResolveFrom` yields (normally the first node of `refResolution.nodesInResolvedPath`);
 * `nodeIdx` is updated to the matched component, and `unresolvedPath` is updated to any remaining unresolved path.
 *
 * If an index is encountered (which halts the rust resolver), then
 * - if the current `nodeIdx` is a composite, then `nodeIdx` is set to the corresponding replacement of the composite
 *   and the algorithm recurses
 * - else, the algorithm terminates with the current `nodeIdx` and `unresolvedPath`.
 *
 * The dependency value returned is
 * - extendIdx: the resulting `nodeIdx`
 * - unresolvedPath: any remaining `unresolvedPath`
 * - originalPath: the original path
 */
export class RefResolutionDependency extends Dependency {
    static dependencyType = "refResolution";

    setUpParameters() {
        if (this.definition.compositeIdx != undefined) {
            this.compositeIdx = this.definition.compositeIdx;
            this.specifiedComponentName = this.compositeIdx;
        } else {
            this.compositeIdx = this.upstreamComponentIdx;
        }

        this.indexDependencyValues = this.definition.indexDependencyValues;
        // the reference of an attribute's slot, or the component's own
        this.slot = this.definition.slot;

        this.missingComponentBlockers = [];
    }

    /**
     * The origins to re-resolve `composite`'s reference from, best first.
     *
     * A reference is normally re-resolved from where it now sits, which is what lets a
     * copied reference find a copied referent: every iteration of a `<repeat>` supplies
     * its own `valueName`, so the copy of `$i` in each iteration must resolve against
     * that iteration and not the template.
     *
     * A copy can also land where the name it references is not in scope at all, though.
     * `$r[3]` on `<repeat name="r" valueName="i"><number>$i</number></repeat>` copies
     * the `<number>` and the `$i` inside it to wherever the reference appears, and `i`
     * lives inside the repeat, invisible from there. Such a copy shadows the component
     * it was copied from, and still refers to whatever that one refers to, so fall back
     * on resolving the reference where the shadowed component sits.
     *
     * A shadowing copy is a structural duplicate of what it shadows: its `refResolution`
     * is serialized from the shadowed component's, so the two carry the same reference —
     * the same path resolved from a different place — which is what makes their origins
     * interchangeable candidates. That is why the walk stops at the first link with no
     * `refResolution` of its own: a component whose reference did not come from the one
     * it shadows says nothing about where this reference should resolve.
     */
    *originsToResolveFrom(composite: any): Generator<number> {
        // Guards against a cycle in the `shadows` chain, so the walk terminates even if
        // the chain does not.
        const visitedSources = new Set<number>();
        // Two components in the chain can share an origin; resolving from the same place
        // a second time would only repeat the same failure.
        const yieldedOrigins = new Set<number>();

        let source = composite;

        while (
            this.refResolutionOf(source) &&
            !visitedSources.has(source.componentIdx)
        ) {
            visitedSources.add(source.componentIdx);

            const origin = this.refResolutionOf(source).nodesInResolvedPath[0];

            if (origin != undefined && !yieldedOrigins.has(origin)) {
                yieldedOrigins.add(origin);
                yield origin;
            }

            // A component that shadows nothing, or whose source is gone, ends the chain.
            source =
                this.dependencyHandler._components[
                    source.shadows?.componentIdx
                ];
        }
    }

    /**
     * Whether `resolution` landed on the reference itself or on a component containing it.
     *
     * A reference can legitimately point at its own container — `$P` inside `P`'s label
     * is how a label says "my own value" — so such a resolution is used when it is the
     * only one on offer. It is not what a *copy* wants, though. A composite that names
     * the item it creates, as `<repeat valueName="i">` does, hands that name to the copy
     * itself, so a `$i` that the copied content already carried now finds the copy rather
     * than what it named in the original. Preferring a candidate origin that resolves
     * outside the reference keeps the copied `$i` pointing where the original one did.
     */
    resolvesIntoOwnAncestry(composite: any, resolution: any) {
        const nodeIdx = resolution.nodeIdx;

        return (
            nodeIdx === composite.componentIdx ||
            (composite.ancestors?.some(
                (ancestor: any) => ancestor.componentIdx === nodeIdx,
            ) ??
                false)
        );
    }

    /**
     * The reference this dependency resolves on `component`: its slot's
     * (`refResolutionAt`), or the component's own.
     */
    refResolutionOf(component: any) {
        return refResolutionAt(component, this.slot);
    }

    /**
     * Wait for the `_copy` children that fill the list at `listIdx`
     * (`listCopiesOf`) to expand, and update when they change. Returns
     * `false` if one has not expanded yet (a blocker was added).
     *
     * Not the `_copy` `composite` belongs to, or one holding it: a list that
     * copies itself (`<mathList name="c" copy="$c"/>`) would wait on itself,
     * where it should report the cycle.
     */
    async waitForListCopies(listIdx: number, composite: any) {
        const listCopies = listCopiesOf(
            this.dependencyHandler._components[listIdx],
        ).filter(
            (copy) =>
                copy.componentIdx !== composite.componentIdx &&
                !composite.ancestors?.some(
                    (ancestor: any) =>
                        ancestor.componentIdx === copy.componentIdx,
                ),
        );
        const unexpandedListCopy = listCopies.find((copy) => !copy.isExpanded);
        if (unexpandedListCopy) {
            await this.addBlockerForUnexpandedComposite(unexpandedListCopy);
            return false;
        }
        if (listCopies.length > 0) {
            const indices = listCopies.map((copy) => copy.componentIdx);
            this.compositeReplacementDependencies.push(...indices);
            this.addUpdateTriggersForCompositeReplacements(indices);
        }
        return true;
    }

    async determineDownstreamComponents({ force = false } = {}) {
        this.compositeReplacementDependencies = [];

        let composite = this.dependencyHandler._components[this.compositeIdx];

        if (!composite) {
            await this.addBlockerUpdateTriggerForMissingComponent(
                this.compositeIdx,
            );
            this.missingComponentBlockers.push(this.compositeIdx);

            return {
                success: false,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        let nodeIdx = this.refResolutionOf(composite).nodeIdx;

        // If `nodeIdx` is a component that was created via an `extend` or `copy` attribute,
        // then it was (or will be) created from a copy that has a `_createComponentIdx` attribute
        // set to `nodeIdx`. In this case, we find that copy using the `createComponentIdxMapping`
        // and create blockers/triggers to potentially postpone creating this dependency
        // and update it when `nodeIdx` is created or updated.
        const componentCreatingExtendIdx =
            this.dependencyHandler.core.createComponentIdxMapping[nodeIdx];

        if (componentCreatingExtendIdx != null) {
            const compositeCreating =
                this.dependencyHandler._components[componentCreatingExtendIdx];

            if (!compositeCreating) {
                this.addUpdateTriggerForMissingComponent(
                    componentCreatingExtendIdx,
                );
                this.missingComponentBlockers.push(componentCreatingExtendIdx);

                return {
                    success: false,
                    downstreamComponentIndices: [],
                    downstreamComponentTypes: [],
                };
            }

            if (!compositeCreating.isExpanded) {
                await this.addBlockerForUnexpandedComposite(compositeCreating);

                return {
                    success: false,
                    downstreamComponentIndices: [],
                    downstreamComponentTypes: [],
                };
            }

            this.compositeReplacementDependencies.push(
                compositeCreating.componentIdx,
            );
            this.addUpdateTriggersForCompositeReplacements([
                compositeCreating.componentIdx,
            ]);
        }

        // A list made by a `copy` or `extend` (`convertToCopy.ts`) has its
        // children made by a `_copy` child (`forList`), and the resolver
        // learns their names only once it expands -- in a copy of a copy, a
        // `_copy` inside what that one made, too. Wait for them, as for a copy
        // made with `_createComponentIdx` above, so that `$c.h` finds the
        // copy's `h` wherever it is written (NAME-2).
        if (!(await this.waitForListCopies(nodeIdx, composite))) {
            return {
                success: false,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        // Resolve all components in the path indices to integer values
        const resolveComponentResult =
            await this.resolveComponentsInPathIndices(
                this.refResolutionOf(composite).originalPath,
                force,
            );

        if (resolveComponentResult.indexIsNotANumber) {
            // The reference cannot be resolved, but it is an authoring mistake
            // rather than a broken invariant, so it reports and renders as
            // nothing -- the same as a reference whose referent is missing. The
            // component sitting in the index has almost always reported an error
            // of its own already, and that is the one the author needs; this says
            // why the reference then came up empty (#1917).
            this.dependencyHandler.core.addDiagnostic(
                codedDiagnostic({
                    type: "warning",
                    code: "doenet-w0163",
                    args: {
                        reference: `${doenetMLDollarsForReference(
                            this.refResolutionOf(composite).originalPath,
                            this.dependencyHandler.core.allDoenetMLs,
                        )}${doenetMLStringForReference(
                            this.refResolutionOf(composite).originalPath,
                            this.dependencyHandler.core.allDoenetMLs,
                        )}`,
                    },
                    position: composite.position,
                    sourceDoc: composite.sourceDoc,
                }),
            );

            this.extendIdx = -1;
            // Without the index. Every other branch that gives up hands back a
            // path whose indices are the literal strings
            // `resolveComponentsInPathIndices` produced, and we never got one --
            // so what is left in there is the live component the index was
            // written from. That path reaches `compositeReplacementRange`, which
            // is round-tripped through `JSON.stringify` in
            // `childDependencies.ts`, and a component graph does not survive
            // that: the reference blanked the document all over again as soon as
            // anything followed it in the same parent. Nothing can resolve
            // through an index we could not work out anyway, and the names and
            // positions the reporting paths read are all still here.
            this.originalPath = dropPathIndices(
                this.refResolutionOf(composite).originalPath,
            );
            this.unresolvedPath = this.originalPath;
            return {
                success: true,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        if (!resolveComponentResult.success) {
            return {
                success: false,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        this.originalPath = resolveComponentResult.path;

        const refComponent = this.dependencyHandler._components[nodeIdx];

        if (!refComponent) {
            this.addUpdateTriggerForMissingComponent(nodeIdx);
            this.missingComponentBlockers.push(nodeIdx);

            this.extendIdx = -1;
            this.unresolvedPath = this.originalPath;

            return {
                success: true,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        const haveComposite =
            this.dependencyHandler.componentInfoObjects.isCompositeComponent({
                componentType: refComponent.componentType,
                includeNonStandard: true,
            });

        if (haveComposite) {
            // make sure that the composite refComponent is expanded
            if (!refComponent.isExpanded) {
                await this.addBlockerForUnexpandedComposite(refComponent);

                return {
                    success: false,
                    downstreamComponentIndices: [],
                    downstreamComponentTypes: [],
                };
            }

            this.compositeReplacementDependencies.push(
                refComponent.componentIdx,
            );
            this.addUpdateTriggersForCompositeReplacements([
                refComponent.componentIdx,
            ]);
        }

        /**
         * Given the ref resolution `this.refResolutionOf(composite)`
         * and the DoenetML string from `this.dependencyHandler.core.allDoenetMLs[0]`,
         * return the substring of DoenetML corresponding to the resolution's `originalPath`.
         */
        const getDoenetMLStringForReference = () =>
            doenetMLStringForReference(
                this.refResolutionOf(composite).originalPath,
                this.dependencyHandler.core.allDoenetMLs,
            );

        /**
         * The `$` or `$$` the author wrote. Hardcoding `$` named a function
         * reference as something they did not write: `$$fs[$i]` came back as
         * `$fs[$i]`.
         */
        const getDollarsForReference = () =>
            doenetMLDollarsForReference(
                this.refResolutionOf(composite).originalPath,
                this.dependencyHandler.core.allDoenetMLs,
            );

        // We skip parent search only if we start with no path,
        // which will happen from references to items created in a repeat
        const skip_parent_search = resolveComponentResult.path[0].name === "";

        // console.log(
        //     "resolve path",
        //     { path: resolveComponentResult.path },
        //     [...this.originsToResolveFrom(composite)],
        //     skip_parent_search,
        // );

        // The resolution from the first candidate origin that produced one; left
        // `undefined` if every candidate failed (or if there was no candidate to try).
        let refResolution;

        // A resolution that landed on the reference itself or on a component containing
        // it, kept aside in case no candidate origin does better.
        // See `resolvesIntoOwnAncestry`.
        let selfReferentialResolution;

        // The failure reported if no candidate origin resolves. It is the failure of the
        // first candidate — the reference's own position — since that is the one that
        // describes the document the author wrote; later candidates are only fallbacks.
        let firstResolutionError:
            "NonUniqueReferent" | "NoReferent" | undefined;

        for (const origin of this.originsToResolveFrom(composite)) {
            try {
                const candidateResolution = this.dependencyHandler.core
                    .resolvePath!(
                    { path: resolveComponentResult.path },
                    origin,
                    skip_parent_search,
                );

                if (
                    this.resolvesIntoOwnAncestry(composite, candidateResolution)
                ) {
                    selfReferentialResolution ??= candidateResolution;
                    continue;
                }

                refResolution = candidateResolution;
                break;
            } catch (e) {
                // console.log("resolve error", e);
                if (e === "NonUniqueReferent" || e === "NoReferent") {
                    firstResolutionError ??= e;
                } else {
                    throw e;
                }
            }
        }

        refResolution ??= selfReferentialResolution;

        if (refResolution === undefined) {
            const referenceText = getDoenetMLStringForReference();

            // TODO: these message match the messages from `format_error_message` of `ref_resolve.ts`.
            // Rather than duplicating code to make the messages,
            // we could make sure that `ref_resolve` formats the messages in this case, too.
            this.dependencyHandler.core.addDiagnostic(
                codedDiagnostic({
                    type: "warning",
                    // Spread rather than a ternary on the value: the
                    // code has to sit next to `code:` as a literal, or
                    // `lint:i18n` reads it as a code nothing raises.
                    ...(firstResolutionError === "NonUniqueReferent"
                        ? { code: "doenet-w0105" as const }
                        : { code: "doenet-w0104" as const }),
                    args: {
                        reference: `${getDollarsForReference()}${referenceText}`,
                    },
                    position: composite.position,
                    sourceDoc: composite.sourceDoc,
                }),
            );

            this.extendIdx = -1;
            this.unresolvedPath = this.originalPath;
            return {
                success: true,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        this.reportChildIndexes(composite, refResolution.childIndexes);

        // An entry of a list component that a composite is indexed by is a
        // node of the resolver with no component
        // (`listEntryResolverNodes.ts`); it is read as an index into the
        // list, as `$l[2]` is.
        const listEntry = listEntryAtResolverNode(
            this.dependencyHandler.core,
            refResolution.nodeIdx,
        );
        if (listEntry) {
            refResolution = {
                ...refResolution,
                nodeIdx: listEntry.listIdx,
                unresolvedPath: [
                    {
                        name: "",
                        index: [
                            {
                                value: [String(listEntry.entryIndex + 1)],
                            },
                        ],
                    },
                    ...(refResolution.unresolvedPath ?? []),
                ],
            };
        }

        // The name was resolved to a list made inside a copy (`$E.e.h` for
        // an `extend` `E` of a component holding `<mathList name="e"
        // extend="$l"/>`), whose children are again made by a `_copy` child
        // that may not have expanded yet. Wait for it, as for the list the
        // reference starts at (above), so that `h` is not read as a property.
        if (
            refResolution.unresolvedPath !== null &&
            refResolution.nodeIdx !== nodeIdx &&
            !(await this.waitForListCopies(refResolution.nodeIdx, composite))
        ) {
            return {
                success: false,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        this.extendIdx = refResolution.nodeIdx;
        this.unresolvedPath = refResolution.unresolvedPath;

        // console.log({ refResolution });

        for (const idx of refResolution.nodesInResolvedPath) {
            const componentInvolved = this.dependencyHandler._components[idx];
            if (
                idx !== this.compositeIdx &&
                componentInvolved &&
                this.dependencyHandler.componentInfoObjects.isCompositeComponent(
                    {
                        componentType: componentInvolved.componentType,
                        includeNonStandard: true,
                    },
                )
            ) {
                this.compositeReplacementDependencies.push(
                    componentInvolved.componentIdx,
                );
                this.addUpdateTriggersForCompositeReplacements([
                    componentInvolved.componentIdx,
                ]);
            }
        }

        if (refResolution.unresolvedPath === null) {
            // No unresolved path left, so we're done

            return this.foundExtend();
        }

        if (refResolution.unresolvedPath[0].name !== "") {
            // We stopped matching on a name.
            // This name must match a prop.
            // Return the result

            return this.foundExtend();
        }

        // We stopped matching on an index of refResolution.nodeIdx
        nodeIdx = refResolution.nodeIdx;

        // Make sure the node we stopped on exists
        const newRefComponent = this.dependencyHandler._components[nodeIdx];

        if (!newRefComponent) {
            this.addUpdateTriggerForMissingComponent(nodeIdx);
            this.missingComponentBlockers.push(nodeIdx);

            return {
                success: true,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        if (
            this.dependencyHandler.componentInfoObjects.isCompositeComponent({
                componentType: newRefComponent.componentType,
                includeNonStandard: true,
            })
        ) {
            // We ended on a composite component with the next unresolved path being an index.
            // If the composite isn't expanded, that's the next blocker for resolving the reference.
            if (!newRefComponent.isExpanded) {
                await this.addBlockerForUnexpandedComposite(newRefComponent);

                return {
                    success: false,
                    downstreamComponentIndices: [],
                    downstreamComponentTypes: [],
                };
            }

            // If the composite is expanded and yet the index did not match one of the composite's replacements,
            // then there is no replacement at that index, and we obtained no referent for the reference.
            const reference = `${getDollarsForReference()}${getDoenetMLStringForReference()}`;
            const instanceKind = instanceKindOf(newRefComponent.componentType);

            // A composite that produces instances says how many it made
            // (`doenet-w0181`), naming what the author wrote (D27).
            this.dependencyHandler.core.addDiagnostic(
                instanceKind
                    ? codedDiagnostic({
                          type: "warning",
                          code: "doenet-w0181",
                          args: {
                              reference,
                              component: newRefComponent.componentType,
                              kind: instanceKind,
                              count: numInstances(newRefComponent),
                          },
                          position: composite.position,
                          sourceDoc: composite.sourceDoc,
                      })
                    : codedDiagnostic({
                          type: "warning",
                          code: "doenet-w0104",
                          args: { reference },
                          position: composite.position,
                          sourceDoc: composite.sourceDoc,
                      }),
            );

            this.compositeReplacementDependencies.push(
                newRefComponent.componentIdx,
            );
            this.addUpdateTriggersForCompositeReplacements([
                newRefComponent.componentIdx,
            ]);
        }

        return this.foundExtend();
    }

    /**
     * Warn of each index of the reference that selected a child of a
     * `<group>` (`childIndexes` of the resolution), which still resolves but is
     * deprecated (D27): an index selects among the instances a component
     * produces, not among the children of a container. The warning quotes the
     * reference up to that index and shows the form to write instead, which
     * names the child.
     *
     * A reference resolved again, or in a copy of the component holding it,
     * raises the same warning at the same place, which is kept only once.
     */
    reportChildIndexes(composite: any, childIndexes: any[] | undefined) {
        if (!childIndexes?.length) {
            return;
        }
        const core = this.dependencyHandler.core;
        const originalPath = this.refResolutionOf(composite).originalPath;
        const start = originalPath?.[0]?.position?.start.offset;
        const source = core.allDoenetMLs?.[originalPath?.[0]?.sourceDoc ?? 0];
        if (start == undefined || source == undefined) {
            return;
        }
        const dollars = doenetMLDollarsForReference(
            originalPath,
            core.allDoenetMLs,
        );

        for (const { containerIdx, childIdx, position } of childIndexes) {
            const indexStart = position?.start.offset;
            const indexEnd = position?.end.offset;
            if (indexStart == undefined || indexEnd == undefined) {
                continue;
            }
            const child = this.dependencyHandler._components[childIdx];
            if (child?.componentType === "setup") {
                // The `<setup>` a repeat adds to an iteration for its
                // `valueName` and `indexName`, after the content: the author
                // wrote no such child, so there is none to name, and it shows
                // nothing (D27)
                continue;
            }
            const before = `${dollars}${source.substring(start, indexStart)}`;

            const childName = authoredName(child);
            const instanceOf =
                this.dependencyHandler._components[containerIdx]?.attributes
                    ?._instanceOf?.primitive?.value;

            core.addDiagnostic(
                codedDiagnostic({
                    type: "warning",
                    code: "doenet-w0179",
                    args: {
                        reference: `${dollars}${source.substring(start, indexEnd)}`,
                        suggestion: `${before}.${childName ?? "x"}`,
                        named: childName === undefined ? "no" : "yes",
                        container: containerKind(instanceOf),
                        component: instanceOf ?? "group",
                    },
                    position: composite.position,
                    sourceDoc: composite.sourceDoc,
                }),
            );
        }
    }

    /**
     * Given that we've successfully resolved the reference
     * and set `this.extendIdx` to the resulting node,
     * finish the determination of downstream components by
     * - checking if the component `this.extendIdx` exist and setting up a blocker if it doesn't,
     * - setting the downstream component data to that component if it does exist.
     */

    foundExtend() {
        let extendedComponent =
            this.dependencyHandler._components[this.extendIdx];

        if (!extendedComponent) {
            this.addUpdateTriggerForMissingComponent(this.extendIdx);
            this.missingComponentBlockers.push(this.extendIdx);

            return {
                success: true,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        if (extendedComponent.constructor.resolveToParent) {
            // replace the extended component with its parent
            this.extendIdx = extendedComponent.parentIdx;

            extendedComponent =
                this.dependencyHandler._components[this.extendIdx];

            if (!extendedComponent) {
                this.addUpdateTriggerForMissingComponent(this.extendIdx);
                this.missingComponentBlockers.push(this.extendIdx);

                return {
                    success: true,
                    downstreamComponentIndices: [],
                    downstreamComponentTypes: [],
                };
            }
        }

        return {
            success: true,
            downstreamComponentIndices: [this.extendIdx],
            downstreamComponentTypes: [extendedComponent.componentType],
        };
    }

    /**
     * Iterate through the index of all parts of `path`.
     * If any component is found, it must be an index component
     * (`isIndexComponent`), and its `value`, rounded where it is not an
     * `integer`'s (`indexFromValue`), replaces it as a string.
     *
     * A component that is not an index component -- or a composite that did not produce
     * exactly one replacement -- means the index cannot be worked out at all.
     * That returns `indexIsNotANumber`, and the caller reports it and leaves the
     * reference resolving to nothing. It used to throw, and since nothing between
     * here and the worker catches, the whole document went blank (#1917).
     *
     * Note: we use strings rather than numbers for the literal indices
     * so that the unresolved path follows the `FlatPathPart` assumed by the resolver.
     */
    async resolveComponentsInPathIndices(
        path: any,
        _force?: boolean,
    ): Promise<any> {
        const pathWithResolvedIndexComponents = [];
        for (const path_part of path) {
            let index = [];
            for (const index_part of path_part.index) {
                if (typeof index_part.value[0] === "string") {
                    index.push(index_part);
                } else {
                    let indexComponent = index_part.value[0];

                    const haveComposite =
                        this.dependencyHandler.componentInfoObjects.isCompositeComponent(
                            {
                                componentType: indexComponent.componentType,
                                includeNonStandard: true,
                            },
                        );

                    if (haveComposite) {
                        if (!indexComponent.isExpanded) {
                            await this.addBlockerForUnexpandedComposite(
                                indexComponent,
                            );

                            return {
                                success: false,
                            };
                        }

                        this.addUpdateTriggersForCompositeReplacements([
                            indexComponent.componentIdx,
                        ]);
                        this.compositeReplacementDependencies.push(
                            indexComponent.componentIdx,
                        );

                        if (indexComponent.replacements.length !== 1) {
                            return { success: true, indexIsNotANumber: true };
                        }
                        indexComponent = indexComponent.replacements[0];
                    }

                    if (!isIndexComponent(indexComponent)) {
                        return { success: true, indexIsNotANumber: true };
                    }

                    // save index as a literal string
                    index.push({
                        value: [
                            indexFromValue(
                                indexComponent,
                                this.indexDependencyValues[
                                    indexComponent.componentIdx
                                ],
                            ),
                        ],
                        position: index_part.position,
                        sourceDoc: index_part.sourceDoc,
                    });
                }
            }

            pathWithResolvedIndexComponents.push({
                name: path_part.name,
                index,
                position: path_part.position,
                sourceDoc: path_part.sourceDoc,
            });
        }

        return {
            success: true,
            path: pathWithResolvedIndexComponents,
        };
    }

    async getValue({ consumeChanges = true } = {}) {
        const result = await super.getValue({ consumeChanges });

        result.value = {
            extendIdx: this.extendIdx ?? -1,
            unresolvedPath: this.unresolvedPath,
            originalPath: this.originalPath,
        };

        return result;
    }

    deleteFromUpdateTriggers() {
        for (const componentIdx of this.missingComponentBlockers) {
            this.deleteUpdateTriggerForMissingComponent(componentIdx);
        }

        this.deleteUpdateTriggersForCompositeReplacements(
            this.compositeReplacementDependencies,
        );
    }
}

/**
 * A dependency that gives the resolutions of references from an attribute
 * that was marked `createReferences: true`.
 *
 * Any plain strings in the attribute are ignored. Returns an array
 * with an entry for each reference, such as `$x`, found in the attribute.
 * Each entry has the fields:
 * - componentIdx: the index of the component that the reference resolved to,
 *   or `undefined` if no referent was found
 * - unresolvedPath: any unresolved path remaining after `componentIdx` was resolved
 * - originalPath: the original path corresponding to the given reference
 * - listEntry: when the reference names one entry of a list component
 *   (`$pl[2]`), which has no component, the entry as a target
 *   (`listEntryTargetOfResolution`): the renderer index reserved for it, with
 *   the list and the entry's index; `undefined` otherwise. A consumer that
 *   needs a component as a target takes `componentIdx` when `unresolvedPath`
 *   is `null`, and otherwise this entry's `componentIdx`, if there is one.
 */
export class AttributeRefResolutions extends Dependency {
    static dependencyType = "attributeRefResolutions";

    setUpParameters() {
        if (this.definition.parentIdx != undefined) {
            this.parentIdx = this.definition.parentIdx;
            this.specifiedComponentName = this.parentIdx;
        } else {
            this.parentIdx = this.upstreamComponentIdx;
        }

        this.attributeName = this.definition.attributeName;

        this.originalDownstreamVariableNames = [
            "extendIdx",
            "unresolvedPath",
            "originalPath",
        ];

        this.missingComponentBlockers = [];

        this.extendIndicesResolved = [];
    }

    async determineDownstreamComponents() {
        let parent = this.dependencyHandler._components[this.parentIdx];

        if (!parent) {
            await this.addBlockerUpdateTriggerForMissingComponent(
                this.parentIdx,
            );
            this.missingComponentBlockers.push(this.parentIdx);

            return {
                success: false,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        let attribute = parent.attributes[this.attributeName];

        if (attribute?.references) {
            this.foundAttribute = true;
            return {
                success: true,
                downstreamComponentIndices: attribute.references.map(
                    (comp: any) => comp.componentIdx,
                ),
                downstreamComponentTypes: attribute.references.map(
                    (comp: any) => comp.componentType,
                ),
            };
        } else {
            this.foundAttribute = false;
            return {
                success: true,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }
    }
    async getValue({ consumeChanges = true } = {}) {
        const result = await super.getValue({ consumeChanges });

        const newValue = [];

        for (const comp of result.value) {
            const extendIdx = comp.stateValues.extendIdx;
            const unresolvedPath = comp.stateValues.unresolvedPath;

            newValue.push({
                componentIdx: extendIdx,
                unresolvedPath,
                originalPath: comp.stateValues.originalPath,
                position: comp.position,
                sourceDoc: comp.sourceDoc,
                listEntry:
                    extendIdx === -1
                        ? undefined
                        : listEntryTargetOfResolution(
                              this.dependencyHandler.core,
                              { componentIdx: extendIdx, unresolvedPath },
                          ),
            });

            if (extendIdx !== -1) {
                if (!this.extendIndicesResolved.includes(extendIdx)) {
                    this.extendIndicesResolved.push(extendIdx);

                    // add this dependency to the list of attributeRefResolution dependencies
                    // for the referenced component
                    let attributeRefResolutionDeps =
                        this.dependencyHandler
                            .attributeRefResolutionDependenciesByReferenced[
                            extendIdx
                        ];
                    if (!attributeRefResolutionDeps) {
                        attributeRefResolutionDeps =
                            this.dependencyHandler.attributeRefResolutionDependenciesByReferenced[
                                extendIdx
                            ] = [];
                    }
                    attributeRefResolutionDeps.push({
                        dependency: this,
                        composite: comp,
                    });
                }

                // if any componentsReferencingAttribute dependencies exist for this extendIdx,
                // then add blockers to recalculate them
                if (
                    this.dependencyHandler.updateTriggers
                        .componentsReferencingAttributeByReferenced[extendIdx]
                ) {
                    for (let dep of this.dependencyHandler.updateTriggers
                        .componentsReferencingAttributeByReferenced[
                        extendIdx
                    ]) {
                        for (let varName of dep.upstreamVariableNames) {
                            await this.dependencyHandler.addBlocker({
                                blockerComponentIdx: dep.upstreamComponentIdx,
                                blockerType: "recalculateDownstreamComponents",
                                blockerStateVariable: varName,
                                blockerDependency: dep.dependencyName,
                                componentIdxBlocked: dep.upstreamComponentIdx,
                                typeBlocked: "stateVariable",
                                stateVariableBlocked: varName,
                            });
                        }
                        await this.dependencyHandler.addBlockersFromChangedStateVariableDependencies(
                            {
                                componentIdx: dep.upstreamComponentIdx,
                                stateVariables: dep.upstreamVariableNames,
                            },
                        );
                    }
                }
            }
        }

        result.value = newValue;
        result.usedDefault = !this.foundAttribute;

        return result;
    }

    deleteFromUpdateTriggers() {
        for (const componentIdx of this.missingComponentBlockers) {
            this.deleteUpdateTriggerForMissingComponent(componentIdx);
        }

        // delete this dependency from the list of attributeRefResolution dependencies
        // for each referenced component
        for (const extendIdx of this.extendIndicesResolved) {
            let attributeRefResolutionDeps =
                this.dependencyHandler
                    .attributeRefResolutionDependenciesByReferenced[extendIdx];
            if (attributeRefResolutionDeps) {
                let ind = attributeRefResolutionDeps.findIndex(
                    (entry: any) => entry.dependency === this,
                );
                if (ind !== -1) {
                    attributeRefResolutionDeps.splice(ind, 1);
                }
            }
        }
    }
}

/**
 * A dependency that gives the list of components that reference
 * a given component via an attribute that was marked `createReferences: true`.
 *
 * Any plain strings in the attribute are ignored. Returns an array
 * with an entry for each component that references the given component.
 */
export class ComponentsReferencingAttributeDependency extends Dependency {
    static dependencyType = "componentsReferencingAttribute";

    setUpParameters() {
        if (this.definition.referencedIdx != undefined) {
            this.referencedIdx = this.definition.referencedIdx;
            this.specifiedComponentName = this.referencedIdx;
        } else {
            this.referencedIdx = this.upstreamComponentIdx;
        }

        this.attributeName = this.definition.attributeName;

        this.allowUnresolvedPath = this.definition.allowUnresolvedPath || false;

        this.missingComponentBlockers = [];
    }

    async determineDownstreamComponents() {
        let referencedComponent =
            this.dependencyHandler._components[this.referencedIdx];

        if (!referencedComponent) {
            await this.addBlockerUpdateTriggerForMissingComponent(
                this.referencedIdx,
            );
            this.missingComponentBlockers.push(this.referencedIdx);

            return {
                success: false,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        if (
            !this.dependencyHandler.updateTriggers
                .componentsReferencingAttributeByReferenced[this.referencedIdx]
        ) {
            this.dependencyHandler.updateTriggers.componentsReferencingAttributeByReferenced[
                this.referencedIdx
            ] = [];
        }
        this.dependencyHandler.updateTriggers.componentsReferencingAttributeByReferenced[
            this.referencedIdx
        ].push(this);

        let attributeRefResolutionDeps =
            this.dependencyHandler
                .attributeRefResolutionDependenciesByReferenced[
                this.referencedIdx
            ];

        if (attributeRefResolutionDeps) {
            if (!this.allowUnresolvedPath) {
                attributeRefResolutionDeps = attributeRefResolutionDeps.filter(
                    (entry: any) =>
                        entry.composite.stateValues.unresolvedPath === null,
                );
            }

            if (this.attributeName) {
                attributeRefResolutionDeps = attributeRefResolutionDeps.filter(
                    (entry: any) =>
                        entry.dependency.attributeName === this.attributeName,
                );
            }

            const downstreamComponentIndices = [];
            const downstreamComponentTypes = [];

            for (const entry of attributeRefResolutionDeps) {
                const parentIdx = entry.dependency.parentIdx;
                const parent = this.dependencyHandler._components[parentIdx];
                if (parent) {
                    downstreamComponentIndices.push(parentIdx);
                    downstreamComponentTypes.push(parent.componentType);
                }
            }

            return {
                success: true,
                downstreamComponentIndices: downstreamComponentIndices,
                downstreamComponentTypes: downstreamComponentTypes,
            };
        }

        return {
            success: false,
            downstreamComponentIndices: [],
            downstreamComponentTypes: [],
        };
    }

    deleteFromUpdateTriggers() {
        for (const componentIdx of this.missingComponentBlockers) {
            this.deleteUpdateTriggerForMissingComponent(componentIdx);
        }
    }
}

/**
 * A dependency that gives the (non-blank) strings from an attribute
 * that was marked `createReferences: true`.
 *
 * Such a attribute is generally used to extract references such as `$x`.
 * However, in some cases, one may want to use the same attribute for references
 * or for other string content. For such a case, this `StringsFromReferenceAttribute`
 * will give the strings that were added to the attribute, ignoring any references.
 */
export class StringsFromReferenceAttribute extends Dependency {
    static dependencyType = "stringsFromReferenceAttribute";

    setUpParameters() {
        if (this.definition.parentIdx != undefined) {
            this.parentIdx = this.definition.parentIdx;
            this.specifiedComponentName = this.parentIdx;
        } else {
            this.parentIdx = this.upstreamComponentIdx;
        }

        this.attributeName = this.definition.attributeName;

        this.missingComponentBlockers = [];
    }

    async determineDownstreamComponents() {
        let parent = this.dependencyHandler._components[this.parentIdx];

        if (!parent) {
            await this.addBlockerUpdateTriggerForMissingComponent(
                this.parentIdx,
            );
            this.missingComponentBlockers.push(this.parentIdx);

            return {
                success: false,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        let attribute = parent.attributes[this.attributeName];

        if (attribute?.references) {
            this.attributeStrings = [...attribute.stringChildren];
        } else {
            this.attributeStrings = null;
        }
        return {
            success: true,
            downstreamComponentIndices: [],
            downstreamComponentTypes: [],
        };
    }

    async getValue() {
        return {
            value: this.attributeStrings,
            changes: {},
        };
    }

    deleteFromUpdateTriggers() {
        for (const componentIdx of this.missingComponentBlockers) {
            this.deleteUpdateTriggerForMissingComponent(componentIdx);
        }
    }
}

/**
 * A dependency that gives the `rendererId` of the specified component,
 * where `rendererId` is the `rootName` of the component, if it exists,
 * else "_id_" followed by the `componentIdx` as a string.
 *
 * The `rootName` is the simplest unique reference to the component
 * when the document root is the origin. As `rootName` is designed to be
 * a HTML id, indices are represented with `:`. For example,
 * if `$a.b[2][3].c` is the simplest reference to a component from the root,
 * then its root name will be `a.b:2:3.c`.
 *
 * If a component was adapted from another component,
 * then the `renderedId` of the original component is used instead,
 * as that corresponds to the component that was authored.
 */
export class RendererId extends Dependency {
    static dependencyType = "rendererId";

    setUpParameters() {
        this.componentIdx = this.definition.componentIdx;
        this.specifiedComponentName = this.componentIdx;

        this.missingComponentBlockers = [];
    }

    async determineDownstreamComponents() {
        this.component = this.dependencyHandler._components[this.componentIdx];

        if (!this.component) {
            await this.addBlockerUpdateTriggerForMissingComponent(
                this.componentIdx,
            );
            this.missingComponentBlockers.push(this.componentIdx);

            return {
                success: false,
                downstreamComponentIndices: [],
                downstreamComponentTypes: [],
            };
        }

        return {
            success: true,
            downstreamComponentIndices: [],
            downstreamComponentTypes: [],
        };
    }

    async getValue() {
        if (this.component) {
            return {
                value: this.dependencyHandler.core.getRendererId(
                    this.component,
                ),
                changes: {},
            };
        } else {
            return {
                value: "",
                changes: {},
            };
        }
    }

    deleteFromUpdateTriggers() {
        for (const componentIdx of this.missingComponentBlockers) {
            this.deleteUpdateTriggerForMissingComponent(componentIdx);
        }
    }
}

/**
 * The `_copy` components (`forList`) that make the children of `list`, a list
 * written with `copy` or `extend`, and, once one has expanded, those that
 * make the children of the lists it made, as in a copy of a copy of a list.
 * Empty for any other component.
 */
function listCopiesOf(list: any): any[] {
    const copies: any[] = [];
    const visit = (component: any) => {
        for (const child of component?.definingChildren ?? []) {
            if (
                child?.componentType === "_copy" &&
                child.doenetAttributes?.forList !== undefined
            ) {
                copies.push(child);
                if (child.isExpanded) {
                    for (const replacement of child.replacements ?? []) {
                        visit(replacement);
                    }
                }
            }
        }
    };
    visit(list);
    return copies;
}
