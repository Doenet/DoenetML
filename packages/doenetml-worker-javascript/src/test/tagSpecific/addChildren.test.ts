import { describe, expect, it, vi } from "vitest";
import { entriesOrReplacements } from "../utils/list-entries";
import { createTestCore } from "../utils/test-core";
import { callAction } from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("addChildren for non-graph parents @group4", () => {
    it("add and delete children of a stickyGroup inside a graph", async () => {
        const doenetML = `
    <graph name="g">
      <stickyGroup name="sg">
        <point name="P">(1,2)</point>
      </stickyGroup>
    </graph>

    <callAction name="addPoint" target="$sg" actionName="addChildren">
      <point>(3,4)</point>
    </callAction>
    <callAction name="deletePoint" target="$sg" actionName="deleteChildren" number="1" />
    `;

        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
        });

        async function check_counts(numObjects: number) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const sg = stateVariables[await resolvePathToNodeIdx("sg")];
            expect(sg.stateValues.numObjects).eq(numObjects);

            // The graph sees each point plus the stickyGroup itself as
            // graphical descendants.
            const g = stateVariables[await resolvePathToNodeIdx("g")];
            expect(g.stateValues.graphicalDescendants.length).eq(
                numObjects + 1,
            );
        }

        await check_counts(1);

        await callAction({
            componentIdx: await resolvePathToNodeIdx("addPoint"),
            core,
        });
        await check_counts(2);

        await callAction({
            componentIdx: await resolvePathToNodeIdx("addPoint"),
            core,
        });
        await check_counts(3);

        await callAction({
            componentIdx: await resolvePathToNodeIdx("deletePoint"),
            core,
        });
        await check_counts(2);
    });

    it("add and delete a graph child of a section", async () => {
        const doenetML = `
    <section name="sec">
      <title>My section</title>
      <graph name="g0">
        <point>(0,0)</point>
      </graph>
    </section>

    <p>points: <collect componentType="point" from="$sec" name="col" /></p>

    <callAction name="addGraph" target="$sec" actionName="addChildren">
      <graph>
        <point>(5,6)</point>
      </graph>
    </callAction>
    <callAction name="deleteGraph" target="$sec" actionName="deleteChildren" number="1" />
    `;

        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
        });

        async function check_num_points(n: number) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                entriesOrReplacements(
                    core,
                    stateVariables,
                    await resolvePathToNodeIdx("col"),
                ).length,
            ).eq(n);
        }

        await check_num_points(1);

        await callAction({
            componentIdx: await resolvePathToNodeIdx("addGraph"),
            core,
        });
        await check_num_points(2);

        await callAction({
            componentIdx: await resolvePathToNodeIdx("deleteGraph"),
            core,
        });
        await check_num_points(1);
    });

    it("add and delete children of a problem", async () => {
        const doenetML = `
    <problem name="prob">
      <title>My problem</title>
      <p>Intro.</p>
    </problem>

    <p>graphs: <collect componentType="graph" from="$prob" name="col" /></p>

    <callAction name="addGraph" target="$prob" actionName="addChildren">
      <graph>
        <point>(1,1)</point>
      </graph>
    </callAction>
    <callAction name="deleteGraph" target="$prob" actionName="deleteChildren" number="1" />
    `;

        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
        });

        async function check_num_graphs(n: number) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const col = stateVariables[await resolvePathToNodeIdx("col")];
            expect(col.replacements?.length ?? 0).eq(n);
        }

        await check_num_graphs(0);

        await callAction({
            componentIdx: await resolvePathToNodeIdx("addGraph"),
            core,
        });
        await check_num_graphs(1);

        await callAction({
            componentIdx: await resolvePathToNodeIdx("deleteGraph"),
            core,
        });
        await check_num_graphs(0);
    });

    it("add and delete rows of a tabular", async () => {
        const doenetML = `
    <tabular name="t">
      <row><cell>a</cell><cell>b</cell></row>
    </tabular>

    <collect componentType="row" from="$t" name="col" />

    <callAction name="addRow" target="$t" actionName="addChildren">
      <row><cell>c</cell><cell>d</cell></row>
    </callAction>
    <callAction name="deleteRow" target="$t" actionName="deleteChildren" number="1" />
    `;

        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
        });

        async function check_num_rows(n: number) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const col = stateVariables[await resolvePathToNodeIdx("col")];
            expect(col.replacements?.length ?? 0).eq(n);
        }

        await check_num_rows(1);

        await callAction({
            componentIdx: await resolvePathToNodeIdx("addRow"),
            core,
        });
        await check_num_rows(2);

        await callAction({
            componentIdx: await resolvePathToNodeIdx("addRow"),
            core,
        });
        await check_num_rows(3);

        await callAction({
            componentIdx: await resolvePathToNodeIdx("deleteRow"),
            core,
        });
        await check_num_rows(2);
    });

    it("add and delete cells of a spreadsheet", async () => {
        const doenetML = `
    <spreadsheet name="s">
      <cell>a</cell>
    </spreadsheet>
    <spreadsheet extend="$s" name="s2" />

    <callAction name="addCell" target="$s" actionName="addChildren">
      <cell rowNum="2" colNum="B">x</cell>
    </callAction>
    <callAction name="deleteCell" target="$s" actionName="deleteChildren" number="1" />
    `;

        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
        });

        // An extend is the same spreadsheet, so it shows the added cells too.
        async function check_cells(b2: string) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            for (const name of ["s", "s2"]) {
                const cells =
                    stateVariables[await resolvePathToNodeIdx(name)].stateValues
                        .cells;
                expect(cells[0][0]).eq("a");
                expect(cells[1][1]).eq(b2);
            }
        }

        await check_cells("");

        await callAction({
            componentIdx: await resolvePathToNodeIdx("addCell"),
            core,
        });
        await check_cells("x");

        await callAction({
            componentIdx: await resolvePathToNodeIdx("deleteCell"),
            core,
        });
        await check_cells("");
    });

    it("cells added through an extend of a spreadsheet go to the spreadsheet", async () => {
        // An extend takes no children of its own and shows its source's
        // cells, so what is added through it, or through an extend of it,
        // is added to the source and shows in all three.
        const doenetML = `
    <spreadsheet name="s">
      <cell>a</cell>
    </spreadsheet>
    <spreadsheet extend="$s" name="s2" />
    <spreadsheet extend="$s2" name="s3" />

    <callAction name="addCell2" target="$s2" actionName="addChildren">
      <cell colNum="B">x</cell>
    </callAction>
    <callAction name="addCell3" target="$s3" actionName="addChildren">
      <cell colNum="C">y</cell>
    </callAction>
    <callAction name="deleteCell2" target="$s2" actionName="deleteChildren" number="1" />
    <callAction name="deleteCell" target="$s" actionName="deleteChildren" number="1" />
    `;

        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
        });

        async function check_first_row(row: string[]) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            for (const name of ["s", "s2", "s3"]) {
                const cells =
                    stateVariables[await resolvePathToNodeIdx(name)].stateValues
                        .cells;
                expect(cells[0].slice(0, 3)).eqls(row);
            }
        }

        await check_first_row(["a", "", ""]);

        await callAction({
            componentIdx: await resolvePathToNodeIdx("addCell2"),
            core,
        });
        await check_first_row(["a", "x", ""]);

        await callAction({
            componentIdx: await resolvePathToNodeIdx("addCell3"),
            core,
        });
        await check_first_row(["a", "x", "y"]);

        await callAction({
            componentIdx: await resolvePathToNodeIdx("deleteCell2"),
            core,
        });
        await check_first_row(["a", "x", ""]);

        await callAction({
            componentIdx: await resolvePathToNodeIdx("deleteCell"),
            core,
        });
        await check_first_row(["a", "", ""]);
    });

    it("cells added through an extend of a copied spreadsheet go to the copy, and are deleted last added first", async () => {
        // A copy is a spreadsheet of its own, with the source's
        // `<_dynamicChildren>` copied into it as well as its own. Cells
        // added through an extend of the copy go to the copy, with the
        // cells added to the copy itself, so deleting through either one
        // deletes the cell added last.
        const doenetML = `
    <spreadsheet name="s"><cell>a</cell></spreadsheet>
    <spreadsheet copy="$s" name="sc" />
    <spreadsheet extend="$sc" name="se" />

    <callAction name="addToCopy" target="$sc" actionName="addChildren">
      <cell colNum="B">x</cell>
    </callAction>
    <callAction name="addToExtend" target="$se" actionName="addChildren">
      <cell colNum="C">y</cell>
    </callAction>
    <callAction name="deleteFromCopy" target="$sc" actionName="deleteChildren" number="1" />
    <callAction name="deleteFromExtend" target="$se" actionName="deleteChildren" number="1" />
    `;

        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
        });

        async function check_first_rows(sRow: string[], scRow: string[]) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const firstRow = async (name: string) =>
                stateVariables[
                    await resolvePathToNodeIdx(name)
                ].stateValues.cells[0].slice(0, 3);
            expect(await firstRow("s")).eqls(sRow);
            expect(await firstRow("sc")).eqls(scRow);
            expect(await firstRow("se")).eqls(scRow);
        }

        await check_first_rows(["a", "", ""], ["a", "", ""]);

        await callAction({
            componentIdx: await resolvePathToNodeIdx("addToCopy"),
            core,
        });
        await check_first_rows(["a", "", ""], ["a", "x", ""]);

        await callAction({
            componentIdx: await resolvePathToNodeIdx("addToExtend"),
            core,
        });
        await check_first_rows(["a", "", ""], ["a", "x", "y"]);

        await callAction({
            componentIdx: await resolvePathToNodeIdx("deleteFromCopy"),
            core,
        });
        await check_first_rows(["a", "", ""], ["a", "x", ""]);

        await callAction({
            componentIdx: await resolvePathToNodeIdx("deleteFromExtend"),
            core,
        });
        await check_first_rows(["a", "", ""], ["a", "", ""]);
    });

    it("a tabular with no rows written takes rows, and deleting more than were added deletes them all", async () => {
        const doenetML = `
    <tabular name="t"></tabular>
    <p name="n">$t.numColumns</p>

    <callAction name="deleteRows" target="$t" actionName="deleteChildren" number="5" />
    <callAction name="addRow" target="$t" actionName="addChildren">
      <row><cell>a</cell><cell>b</cell><cell>c</cell></row>
    </callAction>
    `;

        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
        });

        async function check(numRows: number, numColumns: number) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const t = stateVariables[await resolvePathToNodeIdx("t")];
            expect(t.activeChildren.length).eq(numRows);
            expect(t.stateValues.numColumns).eq(numColumns);
            expect(
                stateVariables[await resolvePathToNodeIdx("n")].stateValues
                    .text,
            ).eq(String(numColumns));
        }

        await check(0, 0);

        // Nothing has been added, so there is nothing to delete.
        await callAction({
            componentIdx: await resolvePathToNodeIdx("deleteRows"),
            core,
        });
        await check(0, 0);

        await callAction({
            componentIdx: await resolvePathToNodeIdx("addRow"),
            core,
        });
        await callAction({
            componentIdx: await resolvePathToNodeIdx("addRow"),
            core,
        });
        await check(2, 3);

        await callAction({
            componentIdx: await resolvePathToNodeIdx("deleteRows"),
            core,
        });
        await check(0, 0);
    });

    it("rows added to a tabular and cells added to a spreadsheet are restored from saved state", async () => {
        const doenetML = `
    <tabular name="t">
      <row><cell>a</cell></row>
    </tabular>
    <spreadsheet name="s">
      <cell>a</cell>
    </spreadsheet>

    <callAction name="addRow" target="$t" actionName="addChildren">
      <row><cell>b</cell></row>
    </callAction>
    <callAction name="addCell" target="$s" actionName="addChildren">
      <cell rowNum="2">b</cell>
    </callAction>
    `;

        let { core, resolvePathToNodeIdx, scoreState } = await createTestCore({
            doenetML,
        });

        async function check() {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const t = stateVariables[await resolvePathToNodeIdx("t")];
            expect(
                t.activeChildren.map(
                    (row: any) =>
                        stateVariables[
                            stateVariables[row.componentIdx].activeChildren[0]
                                .componentIdx
                        ].stateValues.text,
                ),
            ).eqls(["a", "b"]);
            const cells =
                stateVariables[await resolvePathToNodeIdx("s")].stateValues
                    .cells;
            expect([cells[0][0], cells[1][0]]).eqls(["a", "b"]);
        }

        await callAction({
            componentIdx: await resolvePathToNodeIdx("addRow"),
            core,
        });
        await callAction({
            componentIdx: await resolvePathToNodeIdx("addCell"),
            core,
        });
        await check();

        await core.saveImmediately();
        ({ core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
            initialState: scoreState.state,
        }));
        await check();
    });

    it.each(["aside", "proof"])(
        "does not create children added to a postponed %s until opened",
        async (sectionType) => {
            const doenetML = `
    <${sectionType} name="section" postponeRendering>
      <title>My ${sectionType}</title>
    </${sectionType}>

    <callAction name="addContent" target="$section" actionName="addChildren">
      <p name="dynamicContent">Content added while closed.</p>
    </callAction>

    <collect componentType="p" from="$section" name="col" />
    `;

            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
            });

            async function checkNumParagraphs(n: number) {
                const stateVariables = await core.returnAllStateVariables(
                    false,
                    true,
                );
                const col = stateVariables[await resolvePathToNodeIdx("col")];
                expect(col.replacements?.length ?? 0).eq(n);
            }

            await checkNumParagraphs(0);

            await callAction({
                componentIdx: await resolvePathToNodeIdx("addContent"),
                core,
            });
            await checkNumParagraphs(0);

            await core.requestAction({
                actionName: "revealSection",
                componentIdx: await resolvePathToNodeIdx("section"),
                args: {},
            });

            await checkNumParagraphs(1);
        },
    );

    it.each(["aside", "proof"])(
        "creates children added to a non-postponed %s before it is opened",
        async (sectionType) => {
            const doenetML = `
    <${sectionType} name="section">
      <title>My ${sectionType}</title>
    </${sectionType}>

    <callAction name="addContent" target="$section" actionName="addChildren">
      <p name="dynamicContent">Content added while closed.</p>
    </callAction>

    <collect componentType="p" from="$section" name="col" />
    `;

            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
            });

            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("col")].replacements
                    ?.length ?? 0,
            ).eq(0);

            await callAction({
                componentIdx: await resolvePathToNodeIdx("addContent"),
                core,
            });

            stateVariables = await core.returnAllStateVariables(false, true);
            expect(
                stateVariables[await resolvePathToNodeIdx("col")].replacements
                    ?.length ?? 0,
            ).eq(1);
        },
    );
});
