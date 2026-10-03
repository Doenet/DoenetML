import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * Doenet/DoenetML#1665: an attribute written in terms of the values its own
 * component has yet to produce cannot be evaluated until the component is
 * expanded, and the component cannot be expanded until the attribute is
 * evaluated. Doenet recognized the cycle all along, but the error was raised
 * from a blocker registration nobody awaited, so it was dropped and resolution
 * went on around the cycle until the worker ran out of memory. Each case below
 * exhausted the heap before the fix.
 *
 * The shapes are gathered here rather than spread over the component suites
 * because none of them is about the component: they all fail at the same step
 * of reference resolution.
 */
describe("Circular reference tests @group2", async () => {
    const circularError = "Circular dependency involving these components";

    const selfReferentialAttributes: [string, string][] = [
        [
            "selectFromSequence exclude (the reported case)",
            `<selectFromSequence name="a" from="1" to="10" numToSelect="2" exclude="2$a[1]"/>`,
        ],
        [
            "selectFromSequence from",
            `<selectFromSequence name="a" from="$a[1]" to="10" numToSelect="2"/>`,
        ],
        [
            "selectFromSequence numToSelect",
            `<selectFromSequence name="a" from="1" to="10" numToSelect="$a[1]"/>`,
        ],
        ["sequence step", `<sequence name="a" from="1" to="10" step="$a[1]"/>`],
        ["sequence length", `<sequence name="a" from="1" length="$a[1]"/>`],
        [
            "select numToSelect",
            `<select name="a" numToSelect="$a[1]"><option><math>1</math></option><option><math>2</math></option></select>`,
        ],
        [
            "repeat for",
            `<repeat name="r" valueName="v" for="$r[1]"><number>$v</number></repeat>`,
        ],
        [
            "conditionalContent condition",
            `<conditionalContent name="c" condition="$c[1] > 0"><number>1</number></conditionalContent>`,
        ],
    ];

    for (const [description, doenetML] of selfReferentialAttributes) {
        it(`${description} is reported as circular`, async () => {
            await expect(createTestCore({ doenetML })).rejects.toThrow(
                circularError,
            );
        });
    }

    // The message is worth checking on one case: reporting the cycle is only
    // useful if it says where to look. It goes on to name the components the
    // attribute expanded into, which are an implementation detail, so only the
    // authored component is asserted.
    it("the report names the component the attribute is on", async () => {
        await expect(
            createTestCore({
                doenetML: `<selectFromSequence name="a" from="1" to="10" numToSelect="2" exclude="2$a[1]"/>`,
            }),
        ).rejects.toThrow(`${circularError}: <selectFromSequence> (line 1)`);
    });

    // Two components, each excluding a value the other has yet to produce:
    // the same cycle, drawn across a pair rather than closed on one component.
    // Both ends should be named, which is what distinguishes this from the
    // cases above.
    it("mutually referential excludes are reported as circular", async () => {
        await expect(
            createTestCore({
                doenetML: `
    <selectFromSequence name="a" from="1" to="10" exclude="$b[1]"/>
    <selectFromSequence name="b" from="1" to="10" exclude="$a[1]"/>
    `,
            }),
        ).rejects.toThrow(
            new RegExp(
                `${circularError}:.*<selectFromSequence> \\(line 2\\).*<selectFromSequence> \\(line 3\\)`,
                "s",
            ),
        );
    });
});

/**
 * Cycles that run through children and `extend` rather than through an
 * attribute. They close in the resolve-blocker graph the moment the last
 * reference is set up, and the report must name the authored components.
 *
 * The no-cycle cases guard the other side: the check memoizes what it has
 * searched and drops the memo of everything upstream of a changed edge, and
 * a reference that is set up before its target has any dependencies of its
 * own must still be searched once the target gets them.
 */
describe("Circular references through children and extend @group2", async () => {
    const circularError = "Circular dependency involving these components";

    it("a text that contains a reference to itself", async () => {
        await expect(
            createTestCore({ doenetML: `<text name="t">$t</text>` }),
        ).rejects.toThrow(`${circularError}: <text> (line 1)`);
    });

    it("two texts that reference each other", async () => {
        await expect(
            createTestCore({
                doenetML: `
    <text name="t1">$t2</text>
    <text name="t2">$t1</text>
    `,
            }),
        ).rejects.toThrow(
            new RegExp(
                `${circularError}:.*<text> \\(line 2\\).*<text> \\(line 3\\)`,
                "s",
            ),
        );
    });

    it("a number and a math that reference each other", async () => {
        await expect(
            createTestCore({
                doenetML: `
    <number name="a">$m</number>
    <math name="m">$a+1</math>
    `,
            }),
        ).rejects.toThrow(
            new RegExp(
                `${circularError}:.*<number> \\(line 2\\).*<math> \\(line 3\\)`,
                "s",
            ),
        );
    });

    it("two maths that extend each other", async () => {
        await expect(
            createTestCore({
                doenetML: `
    <math extend="$b1" name="b2" />
    <math extend="$b2" name="b1" />
    `,
            }),
        ).rejects.toThrow(circularError);
    });

    it("a mathInput prefilled with its own value", async () => {
        await expect(
            createTestCore({
                doenetML: `<mathInput name="mi" prefill="$mi.value" />`,
            }),
        ).rejects.toThrow(`${circularError}:`);
    });

    it("a long chain of references is not a cycle", async () => {
        const length = 60;
        let doenetML = `<number name="n1">1</number>`;
        for (let i = 2; i <= length; i++) {
            doenetML += `<number name="n${i}">$n${i - 1}+1</number>`;
        }
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
        });

        // The memos cover only the load; they are dropped once it is done
        // (and regrow for whatever a later evaluation sets up).
        const dependencies = core.core.dependencies;
        expect(dependencies.circularCheckMarks.size).eq(0);
        expect(dependencies.circularBlockerMarks.size).eq(0);

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx(`n${length}`)].stateValues
                .value,
        ).eq(length);
    });

    it("a reference reached along two paths is not a cycle", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <number name="a">1</number>
    <number name="b">$a+1</number>
    <number name="c">$a+2</number>
    <number name="d">$b+$c</number>
    <number name="e">$d+$a</number>
    `,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("e")].stateValues.value,
        ).eq(6);
    });
});

/**
 * The state-variable cycle check, driven directly. A cycle in a document
 * closes in the resolve-blocker graph first, since the target of the edge
 * that closes it cannot have resolved, so the cyclic documents above are all
 * rejected by that check; this one reports a cycle only on the update path,
 * when a dependency is re-pointed at a variable that has already resolved,
 * and no document is known that reaches it. These cases add edges to the
 * handler's tables the way `Dependency.addDownstreamComponent` records them,
 * with the memo reset it performs, and call the check the way
 * `Dependency.checkForCircular` does.
 */
describe("State-variable cycle check driven directly @group2", async () => {
    const circularError = "Circular dependency involving these components";

    // Four numbers on four lines, so the report's line numbers say which
    // components it names and in what order.
    async function handlerWithFourNumbers() {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `<number name="a">1</number>
<number name="b">2</number>
<number name="c">3</number>
<number name="d">4</number>`,
        });
        const dependencies = core.core.dependencies;
        const idx: Record<string, number> = {};
        for (const name of ["a", "b", "c", "d"]) {
            idx[name] = await resolvePathToNodeIdx(name);
        }

        /** An edge from `from` to `to` in a variable `v` of each. */
        function addEdge(from: string, to: string) {
            const dep = {
                dependencyName: `${from}_to_${to}`,
                upstreamComponentIdx: idx[from],
                upstreamVariableNames: ["v"],
                downstreamComponentIndices: [idx[to]],
                mappedDownstreamVariableNamesByComponent: [["v"]],
            };
            const down = (dependencies.downstreamDependencies[idx[from]] ??=
                {});
            (down.v ??= {})[dep.dependencyName] = dep;
            const up = (dependencies.upstreamDependencies[idx[to]] ??= {});
            up.v = (up.v ?? []).concat(dep);
            dependencies.resetCircularCheckPassed(idx[from], "v");
        }

        function check(name: string) {
            dependencies.checkForCircularDependency({
                componentIdx: idx[name],
                varName: "v",
            });
        }

        return { dependencies, idx, addEdge, check };
    }

    it("reports the path that closes a cycle, once", async () => {
        const { addEdge, check } = await handlerWithFourNumbers();
        addEdge("d", "a");
        addEdge("a", "b");
        addEdge("b", "c");
        expect(() => check("d")).not.toThrow();

        addEdge("c", "a");
        // The path runs from the variable searched to the one that closed
        // the cycle: c, a, b.
        expect(() => check("c")).toThrow(
            `${circularError}: <number> (line 3), <number> (line 1), <number> (line 2).`,
        );
        // The variables on that path keep their memo, so the cycle is not
        // reported again, by a search at the same variable or from above it.
        expect(() => check("c")).not.toThrow();
        expect(() => check("d")).not.toThrow();
    });

    it("a reset below a cycle re-arms the report up to the top", async () => {
        const { dependencies, idx, addEdge, check } =
            await handlerWithFourNumbers();
        addEdge("d", "a");
        addEdge("a", "b");
        addEdge("b", "c");
        addEdge("c", "a");
        expect(() => check("c")).toThrow(circularError);
        expect(() => check("d")).not.toThrow();

        // What a dependency change below c does: drop c's memo and every
        // memo upstream of it, d's included.
        dependencies.resetCircularCheckPassed(idx.c, "v");
        expect(() => check("d")).toThrow(
            `${circularError}: <number> (line 4), <number> (line 1), <number> (line 2), <number> (line 3).`,
        );
    });

    it("a variable that depends on itself", async () => {
        const { addEdge, check } = await handlerWithFourNumbers();
        addEdge("a", "a");
        expect(() => check("a")).toThrow(
            `${circularError}: <number> (line 1).`,
        );
    });
});
