import { afterEach, describe, expect, it } from "vitest";

import { createComponentInfoObjects } from "../../doenetml-worker-javascript/src/utils/componentInfoObjects";
import { getSchema } from "../scripts/get-schema";

/**
 * Tests for the `excludeFromSchema` mechanisms on state variables (#1089).
 *
 * Three sources feed the schema's excluded-state-var set, exercised here:
 *
 *   (a) Attribute-level `excludeFromSchema: true` + `createStateVariable`
 *       — hides both the attribute and its companion state variable
 *       (already shipped in PR #1090; pinned in the regression test below
 *       to guard against drift).
 *
 *   (b) Attribute-level `stateVarExcludeFromSchema: true` — keeps the
 *       attribute author-facing but hides its companion state variable
 *       (e.g. `<answer>`'s `colorCorrectness` → `colorCorrectnessPreliminary`).
 *
 *   (c) State-def-level `excludeFromSchema: true` — for directly-defined
 *       plumbing state vars (most prominently the renamed-aside entries
 *       produced by `renameStateVariable`, e.g. `<answer>`'s
 *       `disabledOriginal`).
 */
describe("excludeFromSchema on state variables (#1089)", () => {
    const infoObjects = createComponentInfoObjects();
    let restore: () => void = () => {};

    afterEach(() => {
        restore();
        restore = () => {};
    });

    /** Helper: find one element's properties in a fresh schema build. */
    function getProperties(elementName: string) {
        const schema = getSchema(infoObjects);
        const el = schema.elements.find((e) => e.name === elementName);
        if (!el) throw new Error(`Expected element ${elementName} in schema`);
        return el.properties;
    }

    describe("source (a): attribute excludeFromSchema (PR #1090 regression)", () => {
        it("hides collaborateGroups on inputs (attribute is excludeFromSchema)", () => {
            const props = getProperties("booleanInput");
            expect(props.find((p) => p.name === "collaborateGroups")).toBe(
                undefined,
            );
        });

        it("hides modifyIndirectly globally (excluded on the base attribute)", () => {
            // `modifyIndirectly` is defined on `BaseComponent` with
            // `excludeFromSchema: true`. No element should expose it.
            const schema = getSchema(infoObjects);
            for (const el of schema.elements) {
                expect(
                    el.properties.find((p) => p.name === "modifyIndirectly"),
                ).toBe(undefined);
            }
        });
    });

    describe("source (b): attribute stateVarExcludeFromSchema", () => {
        it("hides colorCorrectnessPreliminary on <answer> while keeping the colorCorrectness attribute", () => {
            const schema = getSchema(infoObjects);
            const answer = schema.elements.find((e) => e.name === "answer")!;
            // The attribute must still be author-facing.
            expect(
                answer.attributes.find((a) => a.name === "colorCorrectness"),
            ).toBeDefined();
            // The plumbing state var must not.
            expect(
                answer.properties.find(
                    (p) => p.name === "colorCorrectnessPreliminary",
                ),
            ).toBe(undefined);
        });

        it("hides the same property on <pretzel> (inherits via BlockScoredComponent)", () => {
            const props = getProperties("pretzel");
            expect(
                props.find((p) => p.name === "colorCorrectnessPreliminary"),
            ).toBe(undefined);
        });
    });

    describe("source (c): state-def excludeFromSchema", () => {
        it("hides disabledOriginal on <answer> (set by renameStateVariable)", () => {
            const props = getProperties("answer");
            expect(props.find((p) => p.name === "disabledOriginal")).toBe(
                undefined,
            );
            // Sanity: the derived `disabled` state var is still present.
            expect(props.find((p) => p.name === "disabled")).toBeDefined();
        });

        it("hides the rename-aside `*PreRound` / `*PreOperator` / `*Original` plumbing", () => {
            // Pin every plumbing state var that #1089 strips. Each pair is
            // (element, state var). If a future component introduces a new
            // rename without this PR's machinery, the matching entry will
            // pop back into the schema and one of these assertions will
            // fail.
            const cases: Array<[string, string]> = [
                ["answer", "disabledOriginal"],
                ["choice", "disabledOriginal"],
                ["pretzel", "disabledOriginal"],
                ["integer", "valuePreRound"],
                ["not", "valuePreOperator"],
                ["intComma", "originalValue"],
                ["pluralize", "valuePrePluralize"],
            ];
            const schema = getSchema(infoObjects);
            for (const [elName, varName] of cases) {
                const el = schema.elements.find((e) => e.name === elName);
                expect(
                    el,
                    `Element ${elName} missing from schema`,
                ).toBeDefined();
                expect(
                    el!.properties.find((p) => p.name === varName),
                    `${elName}.${varName} should be excluded`,
                ).toBe(undefined);
            }
        });
    });

    describe("excluded vars don't need a description", () => {
        // The schema generator hard-fails on missing descriptions for
        // every property that reaches `singlePropFromDescription`. Excluded
        // vars must short-circuit *before* that check so plumbing state
        // vars don't have to invent author-facing copy.
        it("does not throw when an excluded state var has no description", () => {
            // The class is shared with the module-level `infoObjects`, so
            // patch & restore in afterEach. The new infoObjects below
            // observes the patched class via its own fresh lazy caches.
            const cls = infoObjects.allComponentClasses.point as any;
            const originalDefinitions = cls.returnStateVariableDefinitions;
            cls.returnStateVariableDefinitions = function () {
                const defs = originalDefinitions.call(this);
                defs._plumbingTestVar = {
                    public: true,
                    excludeFromSchema: true,
                    shadowingInstructions: { createComponentOfType: "text" },
                    // intentionally no `description`
                    returnDependencies: () => ({}),
                    definition: () => ({
                        setValue: { _plumbingTestVar: "" },
                    }),
                };
                return defs;
            };
            restore = () => {
                cls.returnStateVariableDefinitions = originalDefinitions;
            };
            // Build fresh info so the lazy `publicStateVariableInfo`
            // getters see the patched `returnStateVariableDefinitions`.
            // The module-level `infoObjects` cache has already memoized
            // the pre-patch shape for many components.
            const freshInfo = createComponentInfoObjects();
            expect(() => getSchema(freshInfo)).not.toThrow();
            const schema = getSchema(freshInfo);
            const point = schema.elements.find((e) => e.name === "point")!;
            expect(
                point.properties.find((p) => p.name === "_plumbingTestVar"),
            ).toBe(undefined);
        });
    });

    describe("aliases of excluded state vars", () => {
        it("drops an alias whose target is excluded", () => {
            // Synthetic exclusion: pick a real state var on <point>, mark
            // it excluded, point a fresh alias at it, then verify both
            // the target and the alias are absent from the schema.
            const info = infoObjects.publicStateVariableInfo.point as any;
            const realName = "coords";
            const originalDesc = {
                ...info.stateVariableDescriptions[realName],
            };
            info.stateVariableDescriptions[realName] = {
                ...originalDesc,
                excludeFromSchema: true,
            };
            info.aliases ??= {};
            const originalAlias = info.aliases._aliasOfExcluded;
            info.aliases._aliasOfExcluded = {
                target: realName,
                description: "Alias of an excluded target — should not appear.",
            };
            restore = () => {
                info.stateVariableDescriptions[realName] = originalDesc;
                if (originalAlias === undefined) {
                    delete info.aliases._aliasOfExcluded;
                } else {
                    info.aliases._aliasOfExcluded = originalAlias;
                }
            };
            const props = getProperties("point");
            expect(props.find((p) => p.name === realName)).toBe(undefined);
            expect(props.find((p) => p.name === "_aliasOfExcluded")).toBe(
                undefined,
            );
        });

        it("drops an alias marked excludeFromSchema while keeping its (non-excluded) target", () => {
            const info = infoObjects.publicStateVariableInfo.point as any;
            const targetName = "coords";
            info.aliases ??= {};
            const originalAlias = info.aliases._aliasExcludedItself;
            info.aliases._aliasExcludedItself = {
                target: targetName,
                description: "Alias that's excluded on its own.",
                excludeFromSchema: true,
            };
            restore = () => {
                if (originalAlias === undefined) {
                    delete info.aliases._aliasExcludedItself;
                } else {
                    info.aliases._aliasExcludedItself = originalAlias;
                }
            };
            const props = getProperties("point");
            // Target stays.
            expect(props.find((p) => p.name === targetName)).toBeDefined();
            // Alias is gone.
            expect(props.find((p) => p.name === "_aliasExcludedItself")).toBe(
                undefined,
            );
        });
    });
});
