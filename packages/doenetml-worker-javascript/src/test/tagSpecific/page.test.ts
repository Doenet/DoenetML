import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { getDiagnosticsByType } from "../utils/diagnostics";
import { submitAnswer, updateMathInputValue } from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Page tag tests @group4", async () => {
    async function sectionNumbers(doenetML: string, names: string[]) {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        const numbers: string[] = [];
        for (const name of names) {
            numbers.push(
                stateVariables[await resolvePathToNodeIdx(name)].stateValues
                    .sectionNumber,
            );
        }
        return numbers;
    }

    it("problems each on a page in a problems list are its items", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<problems name="ps">
  <page name="p1"><problem name="a"><p>a</p></problem></page>
  <page name="p2"><problem name="b"><p>b</p></problem></page>
  <page name="p3"><problem name="c"><p>c</p></problem></page>
</problems>
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const ps = stateVariables[await resolvePathToNodeIdx("ps")];

        // The list renders every page even though a page is not a section...
        const pagePositions = ps.activeChildren
            .map((child: any, ind: number) =>
                child.componentType === "page" ? ind : null,
            )
            .filter((ind: number | null) => ind !== null);
        expect(pagePositions.length).eq(3);
        for (const ind of pagePositions) {
            expect(ps.stateValues.childIndicesToRender).toContain(ind);
        }

        // ...which is not itself an item, but passes `asList` to the problem
        // inside it, so the problems are numbered as items of the list.
        for (const [pageName, problemName, number] of [
            ["p1", "a", "1"],
            ["p2", "b", "2"],
            ["p3", "c", "3"],
        ]) {
            const page = stateVariables[await resolvePathToNodeIdx(pageName)];
            expect(page.stateValues.isListItem, pageName).eq(false);
            expect(page.stateValues.asList, pageName).eq(true);

            const problem =
                stateVariables[await resolvePathToNodeIdx(problemName)];
            expect(problem.stateValues.isListItem, problemName).eq(true);
            expect(problem.stateValues.sectionNumber, problemName).eq(number);
        }

        expect(getDiagnosticsByType(core).errors).eqls([]);
    });

    it("problems beside a page continue its numbering", async () => {
        expect(
            await sectionNumbers(
                `
<problems>
  <problem name="a"><p>a</p></problem>
  <page>
    <problem name="b"><p>b</p></problem>
    <problem name="c"><p>c</p></problem>
  </page>
  <problem name="d"><p>d</p></problem>
</problems>`,
                ["a", "b", "c", "d"],
            ),
        ).eqls(["1", "2", "3", "4"]);
    });

    it("sections on pages are numbered as if written beside each other", async () => {
        expect(
            await sectionNumbers(
                `
<page><section name="a"><p>a</p></section></page>
<page><section name="b"><p>b</p></section></page>
<section name="c"><p>c</p></section>`,
                ["a", "b", "c"],
            ),
        ).eqls(["1", "2", "3"]);
    });

    it("a page outside a list does not make its sections list items", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<section name="s">
  <page name="p">
    <problem name="a"><p>a</p></problem>
  </page>
</section>
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues.asList,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues
                .isListItem,
        ).eq(false);
    });

    it("a page in a list renders only what the list renders", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<problems>
  <page name="p">
    <p name="stray">Not an item</p>
    <problem name="a"><p>a</p></problem>
  </page>
</problems>
<page name="q">
  <p name="shown">Shown</p>
</page>
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const p = stateVariables[await resolvePathToNodeIdx("p")];
        const renderedP = p.stateValues.childIndicesToRender.map(
            (ind: number) => p.activeChildren[ind].componentIdx,
        );
        expect(renderedP).toContain(await resolvePathToNodeIdx("a"));
        expect(renderedP).not.toContain(await resolvePathToNodeIdx("stray"));

        const q = stateVariables[await resolvePathToNodeIdx("q")];
        const renderedQ = q.stateValues.childIndicesToRender.map(
            (ind: number) => q.activeChildren[ind]?.componentIdx,
        );
        expect(renderedQ).toContain(await resolvePathToNodeIdx("shown"));
    });

    it("a page in a cascade in a list is rendered, and its problems are items", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<problems>
  <cascade name="c">
    <page name="p1"><problem name="a"><p>a</p></problem></page>
    <page name="p2"><problem name="b"><p>b</p></problem></page>
  </cascade>
</problems>
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const c = stateVariables[await resolvePathToNodeIdx("c")];
        const renderedC = c.stateValues.childIndicesToRender.map(
            (ind: number) => c.activeChildren[ind]?.componentIdx,
        );
        expect(renderedC).toContain(await resolvePathToNodeIdx("p1"));
        expect(renderedC).toContain(await resolvePathToNodeIdx("p2"));

        for (const [name, number] of [
            ["a", "1"],
            ["b", "2"],
        ]) {
            const problem = stateVariables[await resolvePathToNodeIdx(name)];
            expect(problem.stateValues.isListItem, name).eq(true);
            expect(problem.stateValues.sectionNumber, name).eq(number);
        }
    });

    it("a section is scored on the answers inside a page", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<problems name="ps" aggregateScores>
  <page><problem name="a"><p><answer name="ans1">1</answer></p></problem></page>
  <page><problem name="b"><p><answer name="ans2">2</answer></p></problem></page>
</problems>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        const mathInputIdx =
            stateVariables[await resolvePathToNodeIdx("ans1")].stateValues
                .inputChildren[0].componentIdx;
        await updateMathInputValue({
            latex: "1",
            componentIdx: mathInputIdx,
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans1"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("ps")].stateValues
                .creditAchieved,
        ).eq(0.5);
    });
});
