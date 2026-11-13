import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * `null`, `undefined` and `[object …]` are JavaScript, not DoenetML, so none
 * of them ever reaches what an author sees (D40, VAL-5, #2460): where `null`
 * means "no value", the value is missing, a blank `＿`.
 *
 * For every component type, written bare (`<T name="x"/>`), every public
 * property is referenced in a `<p>` and in a `<text>`, and nothing the
 * document sends its renderers, nor the text of either, may hold one. A type
 * that does not load bare (one that needs a parent, or content) is not
 * checked here.
 */
const SHOWN_JAVASCRIPT = /\bnull\b|\bundefined\b|\[object/;

/** Each string in `value`, with the path to it, that holds one. */
function javascriptShown(value: any, path: string, seen = new Set<any>()) {
    const found: string[] = [];
    if (typeof value === "string") {
        if (SHOWN_JAVASCRIPT.test(value)) {
            found.push(`${path}: ${JSON.stringify(value).slice(0, 120)}`);
        }
    } else if (value && typeof value === "object" && !seen.has(value)) {
        seen.add(value);
        for (const key of Object.keys(value)) {
            found.push(...javascriptShown(value[key], `${path}.${key}`, seen));
        }
    }
    return found;
}

describe("Never shows null (D40) @group3", () => {
    it("shows no null, undefined or [object in a property of any component type, or what is drawn", async () => {
        const { core: firstCore } = await createTestCore({ doenetML: "<p/>" });
        const componentInfoObjects = firstCore.core!.componentInfoObjects;
        const types = Object.keys(componentInfoObjects.allComponentClasses)
            .filter((type) => !type.startsWith("_"))
            .sort();

        const found: string[] = [];
        let checked = 0;
        for (const type of types) {
            let shown: string[];
            try {
                shown = await javascriptShownByType(type);
            } catch {
                // a type that does not load bare, or whose properties cannot
                // all be read bare
                continue;
            }
            checked++;
            found.push(...shown);
        }

        async function javascriptShownByType(type: string) {
            const properties = Object.keys(
                componentInfoObjects.publicStateVariableInfo[type]
                    .stateVariableDescriptions,
            );
            const references = properties
                .map((property) => `[${property}=$x.${property}]`)
                .join(" ");
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `<${type} name="x"/>
<p name="p">${references}</p>
<p name="pt"><text>${references}</text></p>`,
            });
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const shown: string[] = [];
            for (const name of ["p", "pt"]) {
                shown.push(
                    ...javascriptShown(
                        stateVariables[await resolvePathToNodeIdx(name)]
                            .stateValues.text,
                        `<${type}> ${name}`,
                    ),
                );
            }
            const rendererState = (core.core as any).rendererInstructionBuilder
                .rendererState;
            for (const [idx, state] of Object.entries<any>(rendererState)) {
                shown.push(
                    ...javascriptShown(
                        state?.stateValues,
                        `<${type}> renderer ${idx}`,
                    ),
                );
            }
            // free the core: several hundred in one file run out of memory
            await core.terminate();
            return shown;
        }
        // most types load bare
        expect(checked).greaterThan(types.length * 0.8);
        expect(found).eqls([]);
    }, 1_800_000);

    it("loads a reference to a property declared a number that holds another value, and shows the sizes of a subsetOfRealsInput", async () => {
        // `$P.scales` holds an array, which a number entry once crashed on;
        // the width and height defaults of `<subsetOfRealsInput>` read
        // `undefined%` (#2460)
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <point name="P"/>
    <subsetOfRealsInput name="s"/>
    <p name="p">[$P.scales][$s.width][$s.height]</p>
    `,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues.text,
        ).eq("[NaN][800px][300px]");
    });
});
