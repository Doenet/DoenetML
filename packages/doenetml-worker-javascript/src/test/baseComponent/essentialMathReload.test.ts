import { describe, expect, it } from "vitest";
import me from "math-expressions";
import { createTestCore } from "../utils/test-core";
import * as ComponentTypes from "../../ComponentTypes";
import {
    moveMath,
    moveNumber,
    movePolygon,
    movePolyline,
    moveText,
} from "../utils/actions";

/**
 * A save holds a math-expression as its bare tree
 * (`removeFunctionsMathExpressionClass`), and a restore puts the class back
 * only through the state variable's `set`. An essential state variable that
 * holds math-expressions and has no `set` therefore restores a bare tree,
 * on which any math-expression method throws.
 */
describe("Essential math values after a reload @group4", async () => {
    it("every essential state variable whose default is a math-expression has a set", async () => {
        const all = ComponentTypes.allComponentClasses() as Record<string, any>;
        const missing = new Set<string>();
        let numChecked = 0;
        for (const [componentType, componentClass] of Object.entries(all)) {
            const definitions =
                componentClass.returnStateVariableDefinitions?.() ?? {};
            for (const [varName, definition] of Object.entries<any>(
                definitions,
            )) {
                if (!definition.hasEssential) {
                    continue;
                }
                const defaultValue = definition.defaultValueByArrayKey
                    ? definition.defaultValueByArrayKey("0")
                    : definition.defaultValue;
                if (!(defaultValue instanceof me.class)) {
                    continue;
                }
                numChecked++;
                if (!definition.set) {
                    missing.add(`${componentType}.${varName}`);
                }
            }
        }

        // the scan is the load-bearing half, so check it found something
        expect(numChecked).toBeGreaterThan(50);
        expect([...missing]).eqls([]);
    });

    async function dragSaveAndReload({
        doenetML,
        drag,
    }: {
        doenetML: string;
        drag: (args: {
            core: any;
            resolvePathToNodeIdx: (name: string) => Promise<number>;
        }) => Promise<void>;
    }) {
        const { core, resolvePathToNodeIdx, scoreState } = await createTestCore(
            { doenetML },
        );
        await drag({ core, resolvePathToNodeIdx });
        await core.saveImmediately();
        return await createTestCore({
            doenetML,
            initialState: scoreState.state,
        });
    }

    for (const [componentType, move, actionName] of [
        ["math", moveMath, "moveMath"],
        ["number", moveNumber, "moveNumber"],
        ["text", moveText, "moveText"],
    ] as const) {
        it(`a dragged ${componentType} without an anchor attribute reloads its anchor as a math`, async () => {
            const doenetML = `
    <graph>
        <${componentType} name="c">1</${componentType}>
        <point name="P" extend="$c.anchor" />
    </graph>
    <p name="p">$c.anchor</p>
    <math name="m">$c.anchor</math>
    `;

            const { core, resolvePathToNodeIdx } = await dragSaveAndReload({
                doenetML,
                drag: async ({ core, resolvePathToNodeIdx }) =>
                    move({
                        componentIdx: await resolvePathToNodeIdx("c"),
                        x: 3,
                        y: 4,
                        core,
                    }),
            });

            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const anchor =
                stateVariables[await resolvePathToNodeIdx("c")].stateValues
                    .anchor;
            expect(anchor).toBeInstanceOf(me.class);
            expect(anchor.tree).eqls(["vector", 3, 4]);
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("P")
                ].stateValues.xs.map((x: any) => x.tree),
            ).eqls([3, 4]);
            expect(
                stateVariables[await resolvePathToNodeIdx("m")].stateValues
                    .value.tree,
            ).eqls(["vector", 3, 4]);
            expect(
                stateVariables[await resolvePathToNodeIdx("p")].stateValues
                    .text,
            ).eq("(3, 4)");

            // a move given `y` alone keeps the reloaded `x`
            await core.requestAction({
                componentIdx: await resolvePathToNodeIdx("c"),
                actionName,
                args: { y: 6 },
            });
            stateVariables = await core.returnAllStateVariables(false, true);
            expect(
                stateVariables[await resolvePathToNodeIdx("c")].stateValues
                    .anchor.tree,
            ).eqls(["vector", 3, 6]);
        });
    }

    for (const [componentType, move] of [
        ["polygon", movePolygon],
        ["polyline", movePolyline],
    ] as const) {
        it(`the desired vertices of a dragged ${componentType} reload as maths`, async () => {
            const doenetML = `
    <graph>
        <${componentType} name="p" vertices="(1,2) (3,4) (5,1)" />
    </graph>
    `;

            const { core, resolvePathToNodeIdx } = await dragSaveAndReload({
                doenetML,
                drag: async ({ core, resolvePathToNodeIdx }) =>
                    move({
                        componentIdx: await resolvePathToNodeIdx("p"),
                        pointCoords: {
                            0: [7.2, 8.1],
                            1: [9.2, 10.1],
                            2: [11.2, 7.1],
                        },
                        core,
                    }),
            });

            const stateValues = (
                await core.returnAllStateVariables(false, true)
            )[await resolvePathToNodeIdx("p")].stateValues;
            for (const vertex of stateValues.desiredUnconstrainedVertices) {
                for (const x of vertex) {
                    expect(x).toBeInstanceOf(me.class);
                }
            }
            expect(
                stateValues.desiredUnconstrainedVertices.map((v: any) =>
                    v.map((x: any) => x.tree),
                ),
            ).eqls([
                [7.2, 8.1],
                [9.2, 10.1],
                [11.2, 7.1],
            ]);
        });
    }
});
