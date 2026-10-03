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
        // (and regrow for whatever a later evaluation sets up). The blocker
        // order is rebuilt then, keeping positions only for the items of the
        // few blockers still outstanding.
        const dependencies = core.core.dependencies;
        expect(dependencies.circularCheckMarks.size).eq(0);
        const outstanding = new Set<string>();
        for (const [type, entries] of dependencies.resolveBlockers
            .neededToResolve) {
            for (const [code, blockers] of entries) {
                outstanding.add(`${type}:${code}`);
                for (const blockerType in blockers) {
                    for (const blockerCode of blockers[blockerType]) {
                        outstanding.add(`${blockerType}:${blockerCode}`);
                    }
                }
            }
        }
        expect(outstanding.size).toBeLessThan(10);
        expect(dependencies.blockerOrder.size).eq(outstanding.size);

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

/**
 * Doenet/DoenetML#2137: a cycle that comes into existence after load. The
 * blocker check found it all along and threw, but the request queue caught
 * the error, the action reported a failure with an empty message, and the
 * core carried on with a cycle in its graph: the next evaluation that reached
 * it recursed until the worker ran out of memory.
 *
 * A circular dependency raised by an update now stops the document, as one
 * found during load does: the request that raised it is rejected with the
 * cycle's message, so is every later request, and the viewer is told to show
 * the message in place of the document.
 */
describe("Circular references created after load @group2", async () => {
    const circularError = "Circular dependency involving these components";

    async function loadAndWatch(doenetML: string) {
        const result = await createTestCore({ doenetML });
        const stopped: string[] = [];
        result.core.core!.updateRenderersCallback = (args: any) => {
            if (args.documentStopped !== undefined) {
                stopped.push(args.documentStopped);
            }
        };
        return { ...result, stopped };
    }

    async function expectDocumentStopped({
        core,
        stopped,
        laterAction,
    }: {
        core: Awaited<ReturnType<typeof createTestCore>>["core"];
        stopped: string[];
        laterAction: Parameters<typeof core.requestAction>[0];
    }) {
        expect(stopped).toHaveLength(1);
        expect(stopped[0]).toContain(circularError);

        // A later request is not run: running it is what used to exhaust the
        // heap.
        const later = await core.requestAction(laterAction);
        expect(later.success).toBe(false);
        expect(later.errMsg).toBe(stopped[0]);
    }

    it("a dependency re-pointed into a cycle stops the document", async () => {
        const { core, resolvePathToNodeIdx, stopped } = await loadAndWatch(`
<mathInput name="i" prefill="1"/>
<number name="n">
  <conditionalContent condition="$i=1">1</conditionalContent>
  <conditionalContent condition="$i=2">$n+1</conditionalContent>
</number>`);
        const iIdx = await resolvePathToNodeIdx("i");

        await core.requestAction({
            componentIdx: iIdx,
            actionName: "updateRawValue",
            args: { rawRendererValue: "2" },
        });
        const result = await core.requestAction({
            componentIdx: iIdx,
            actionName: "updateValue",
            args: {},
        });
        expect(result.success).toBe(false);
        expect(result.errMsg).toContain(circularError);

        await expectDocumentStopped({
            core,
            stopped,
            laterAction: {
                componentIdx: iIdx,
                actionName: "updateRawValue",
                args: { rawRendererValue: "1" },
            },
        });
    });

    it("a self-extending component switched on stops the document", async () => {
        const { core, resolvePathToNodeIdx, stopped } = await loadAndWatch(`
<booleanInput name="b"/>
<conditionalContent condition="$b"><text name="t" extend="$t"/></conditionalContent>`);
        const bIdx = await resolvePathToNodeIdx("b");

        const result = await core.requestAction({
            componentIdx: bIdx,
            actionName: "updateBoolean",
            args: { boolean: true },
        });
        expect(result.success).toBe(false);
        expect(result.errMsg).toContain(circularError);

        await expectDocumentStopped({
            core,
            stopped,
            laterAction: {
                componentIdx: bIdx,
                actionName: "updateBoolean",
                args: { boolean: false },
            },
        });
    });

    // `returnAllStateVariables` is reached outside the queue: `DocViewer`
    // installs it as a `window` function on every page. Evaluating `n` after
    // the stop is the recursion that ran the worker out of memory, so without
    // the check this test kills the vitest worker.
    it("a state dump of a stopped document is refused without evaluating", async () => {
        const { core, resolvePathToNodeIdx, stopped } = await loadAndWatch(`
<mathInput name="i" prefill="1"/>
<number name="n">
  <conditionalContent condition="$i=1">1</conditionalContent>
  <conditionalContent condition="$i=2">$n+1</conditionalContent>
</number>`);
        const iIdx = await resolvePathToNodeIdx("i");

        // a running document dumps its state as before
        await expect(
            core.returnAllStateVariables(false, true),
        ).resolves.toBeTruthy();

        await core.requestAction({
            componentIdx: iIdx,
            actionName: "updateRawValue",
            args: { rawRendererValue: "2" },
        });
        await core.requestAction({
            componentIdx: iIdx,
            actionName: "updateValue",
            args: {},
        });
        expect(stopped).toHaveLength(1);

        await expect(core.returnAllStateVariables(false, true)).rejects.toThrow(
            stopped[0],
        );
    });

    it("a stopped document evaluates nothing from outside the queue", async () => {
        // The input's keystroke schedules the debounced save, which fires
        // after the stop. Building the save evaluates `n`, which recursed
        // until the worker ran out of memory (vitest reports the worker
        // exiting unexpectedly). Terminating sends the visibility recorded
        // below as an event, which the stopped queue rejects; a terminate
        // that throws reads to the viewer as a wedged core.
        vi.useFakeTimers();
        try {
            const { core, resolvePathToNodeIdx, stopped } = await loadAndWatch(`
<p name="p"><mathInput name="i" prefill="1"/></p>
<number name="n">
  <conditionalContent condition="$i=1">1</conditionalContent>
  <conditionalContent condition="$i=2">$n+1</conditionalContent>
</number>`);
            const iIdx = await resolvePathToNodeIdx("i");

            await core.requestAction({
                componentIdx: await resolvePathToNodeIdx("p"),
                actionName: "recordVisibilityChange",
                args: { isVisible: true },
            });
            await core.requestAction({
                componentIdx: iIdx,
                actionName: "updateRawValue",
                args: { rawRendererValue: "2" },
            });
            await core.requestAction({
                componentIdx: iIdx,
                actionName: "updateValue",
                args: {},
            });
            expect(stopped).toHaveLength(1);

            await vi.advanceTimersByTimeAsync(5000);
            await core.saveImmediately();
            await core.terminate();
        } finally {
            vi.useRealTimers();
        }
    });

    it("a save built before the stop is still delivered on terminate", async () => {
        // The second keystroke's save is built while the 60-second throttle
        // holds it back. The stop skips building any new save, but the held
        // one evaluates nothing to deliver, and `terminate` sends it.
        vi.useFakeTimers();
        try {
            const {
                core,
                resolvePathToNodeIdx,
                stopped,
                lastStateReport,
                pendingReports,
            } = await loadAndWatch(`
<mathInput name="i" prefill="1"/>
<number name="n">
  <conditionalContent condition="$i=1">1</conditionalContent>
  <conditionalContent condition="$i=2">$n+1</conditionalContent>
</number>`);
            const iIdx = await resolvePathToNodeIdx("i");
            async function enter(value: string) {
                await core.requestAction({
                    componentIdx: iIdx,
                    actionName: "updateRawValue",
                    args: { rawRendererValue: value },
                });
                await core.requestAction({
                    componentIdx: iIdx,
                    actionName: "updateValue",
                    args: {},
                });
            }

            await enter("3");
            await vi.advanceTimersByTimeAsync(1500);
            await enter("5");
            await vi.advanceTimersByTimeAsync(1500);
            const held = pendingReports.at(-1)?.state;
            expect(held).toBeDefined();
            expect(lastStateReport.payload).not.toEqual(held);

            await enter("2");
            expect(stopped).toHaveLength(1);

            await core.terminate();
            expect(lastStateReport.payload).toEqual(held);
        } finally {
            vi.useRealTimers();
        }
    });

    it("an event queued behind the stopping update is dropped quietly", async () => {
        // The first update queues its "selected" event when it finishes, by
        // which time the second update is ahead of it in the queue. The
        // second raises the cycle, and the stop rejects the queued event,
        // which nobody awaits.
        const unhandled: unknown[] = [];
        const onUnhandled = (reason: unknown) => unhandled.push(reason);
        process.on("unhandledRejection", onUnhandled);
        try {
            const { core, resolvePathToNodeIdx, stopped } = await loadAndWatch(`
<booleanInput name="b1"/>
<booleanInput name="b"/>
<conditionalContent condition="$b"><text name="t" extend="$t"/></conditionalContent>`);
            const b1Idx = await resolvePathToNodeIdx("b1");
            const bIdx = await resolvePathToNodeIdx("b");

            const first = core.requestAction({
                componentIdx: b1Idx,
                actionName: "updateBoolean",
                args: { boolean: true },
            });
            const second = core.requestAction({
                componentIdx: bIdx,
                actionName: "updateBoolean",
                args: { boolean: true },
            });
            expect((await first).success).not.toBe(false);
            expect((await second).success).toBe(false);
            expect(stopped).toHaveLength(1);

            await new Promise((resolve) => setTimeout(resolve, 50));
            expect(unhandled).toEqual([]);
        } finally {
            process.off("unhandledRejection", onUnhandled);
        }
    });

    it("hiding a stopped document sends its visibility quietly", async () => {
        // The browser tab is hidden after the stop: the core suspends
        // visibility measuring, which sends the visibility recorded below as
        // an event that the stopped queue rejects. Nobody awaits it.
        const unhandled: unknown[] = [];
        const onUnhandled = (reason: unknown) => unhandled.push(reason);
        process.on("unhandledRejection", onUnhandled);
        vi.useFakeTimers();
        try {
            const { core, resolvePathToNodeIdx, stopped } = await loadAndWatch(`
<p name="p"><mathInput name="i" prefill="1"/></p>
<number name="n">
  <conditionalContent condition="$i=1">1</conditionalContent>
  <conditionalContent condition="$i=2">$n+1</conditionalContent>
</number>`);
            const iIdx = await resolvePathToNodeIdx("i");

            await core.requestAction({
                componentIdx: await resolvePathToNodeIdx("p"),
                actionName: "recordVisibilityChange",
                args: { isVisible: true },
            });
            await vi.advanceTimersByTimeAsync(5000);
            await core.requestAction({
                componentIdx: iIdx,
                actionName: "updateRawValue",
                args: { rawRendererValue: "2" },
            });
            await core.requestAction({
                componentIdx: iIdx,
                actionName: "updateValue",
                args: {},
            });
            expect(stopped).toHaveLength(1);

            core.handleVisibilityChange(false);
            await vi.advanceTimersByTimeAsync(100);
        } finally {
            vi.useRealTimers();
        }
        try {
            await new Promise((resolve) => setTimeout(resolve, 50));
            expect(unhandled).toEqual([]);
        } finally {
            process.off("unhandledRejection", onUnhandled);
        }
    });

    it("hiding a running document logs a failed visibility suspend", async () => {
        // The rejection the stop produces is dropped (above); any other
        // failure of the unawaited suspend is logged, not left unhandled.
        const unhandled: unknown[] = [];
        const onUnhandled = (reason: unknown) => unhandled.push(reason);
        process.on("unhandledRejection", onUnhandled);
        const logged: unknown[][] = [];
        const errorSpy = vi
            .spyOn(console, "error")
            .mockImplementation((...args) => {
                logged.push(args);
            });
        try {
            const { core } = await loadAndWatch(`<p>hello</p>`);
            const failure = new Error("suspend failed");
            (core.core as any).visibilityTracker.suspendVisibilityMeasuring =
                async () => {
                    throw failure;
                };

            core.handleVisibilityChange(false);
            await new Promise((resolve) => setTimeout(resolve, 50));

            expect(unhandled).toEqual([]);
            expect(logged).toEqual([
                ["Error in visibility suspend on hide:", failure],
            ]);
        } finally {
            errorSpy.mockRestore();
            process.off("unhandledRejection", onUnhandled);
        }
    });

    it("the same switch with no cycle leaves the document running", async () => {
        const { core, resolvePathToNodeIdx, stopped } = await loadAndWatch(`
<booleanInput name="b"/>
<conditionalContent condition="$b"><text name="t">hello</text></conditionalContent>`);
        const bIdx = await resolvePathToNodeIdx("b");

        const result = await core.requestAction({
            componentIdx: bIdx,
            actionName: "updateBoolean",
            args: { boolean: true },
        });
        expect(result.success).not.toBe(false);
        expect(stopped).toHaveLength(0);
    });
});
