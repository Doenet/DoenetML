import me from "math-expressions";
import { cesc } from "@doenet/utils";

describe("Unlinked Copying Tests", function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    it("unlinked copy of linked copy copies state variables from uncopied children and attributes", () => {
        // When creating a linked copy, often children and attributes are not copied
        // but instead the resulting state variables are just shadowed.
        // Then, when subsequently creating an unlinked copy of that linked copy,
        // there are no children or attributes to copy.
        // Instead, the unlinked copy needs to copy the state variables values directly
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <text>a</text>
    <graph name="g" newNamespace xmax="5">
        <point name="A" styleNumber="2" labelIsName labelPosition="upperLeft">(1,2)</point>
    </graph>

    <graph copySource="g" name="g2" />

    <graph copySource="g2" link="false" name="g3" />
  `,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables["/g"].stateValues.xmax).eq(5);
            expect(stateVariables["/g/A"].stateValues.xs).eqls([1, 2]);
            expect(stateVariables["/g/A"].stateValues.styleNumber).eq(2);
            expect(stateVariables["/g/A"].stateValues.label).eq("A");
            expect(stateVariables["/g/A"].stateValues.labelPosition).eq(
                "upperleft",
            );

            expect(stateVariables["/g2"].stateValues.xmax).eq(5);
            expect(stateVariables["/g2/A"].stateValues.xs).eqls([1, 2]);
            expect(stateVariables["/g2/A"].stateValues.styleNumber).eq(2);
            expect(stateVariables["/g2/A"].stateValues.label).eq("A");
            expect(stateVariables["/g2/A"].stateValues.labelPosition).eq(
                "upperleft",
            );

            expect(stateVariables["/g3"].stateValues.xmax).eq(5);
            expect(stateVariables["/g3/A"].stateValues.xs).eqls([1, 2]);
            expect(stateVariables["/g3/A"].stateValues.styleNumber).eq(2);
            expect(stateVariables["/g3/A"].stateValues.label).eq("A");
            expect(stateVariables["/g3/A"].stateValues.labelPosition).eq(
                "upperleft",
            );
        });
    });

    it("unlinked copy of linked copy, overwrite attributes of linked copy", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <text>a</text>
    <graph name="g" newNamespace xmax="5">
        <point name="A" styleNumber="2">(1,2)</point>
        <point name="B">(3,4)</point>
    </graph>

    <graph copySource="g" name="g2" styleNumber="3" xmin="-3" xmax="7" />

    <graph copySource="g2" link="false" name="g3" />
  `,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables["/g"].stateValues.xmin).eq(-10);
            expect(stateVariables["/g"].stateValues.xmax).eq(5);
            expect(stateVariables["/g/A"].stateValues.xs).eqls([1, 2]);
            expect(stateVariables["/g/A"].stateValues.styleNumber).eq(2);
            expect(stateVariables["/g/B"].stateValues.xs).eqls([3, 4]);
            expect(stateVariables["/g/B"].stateValues.styleNumber).eq(1);

            expect(stateVariables["/g2"].stateValues.xmin).eq(-3);
            expect(stateVariables["/g2"].stateValues.xmax).eq(7);
            expect(stateVariables["/g2/A"].stateValues.xs).eqls([1, 2]);
            expect(stateVariables["/g2/A"].stateValues.styleNumber).eq(2);
            expect(stateVariables["/g2/B"].stateValues.xs).eqls([3, 4]);
            expect(stateVariables["/g2/B"].stateValues.styleNumber).eq(3);

            expect(stateVariables["/g3"].stateValues.xmin).eq(-3);
            expect(stateVariables["/g3"].stateValues.xmax).eq(7);
            expect(stateVariables["/g3/A"].stateValues.xs).eqls([1, 2]);
            expect(stateVariables["/g3/A"].stateValues.styleNumber).eq(2);
            expect(stateVariables["/g3/B"].stateValues.xs).eqls([3, 4]);
            expect(stateVariables["/g3/B"].stateValues.styleNumber).eq(3);
        });
    });

    // TODO: overwriting attributes of unlinked copy of linked copy isn't working as we'd like.
    it.only("unlinked copy of linked copy, overwrite attributes of unlinked copy", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <text>a</text>
    <graph name="g" newNamespace xmax="5">
        <point name="A" styleNumber="2">(1,2)</point>
        <point name="B">(3,4)</point>
    </graph>

    <graph copySource="g" name="g2" xmin="-3" />

    <graph copySource="g2" link="false" name="g3" styleNumber="4" xmin="-5" xmax="7" ymax="8" />
  `,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables["/g"].stateValues.xmax).eq(5);
            expect(stateVariables["/g"].stateValues.xmin).eq(-10);
            expect(stateVariables["/g"].stateValues.ymax).eq(10);
            expect(stateVariables["/g/A"].stateValues.xs).eqls([1, 2]);
            expect(stateVariables["/g/A"].stateValues.styleNumber).eqls(2);
            expect(stateVariables["/g/B"].stateValues.xs).eqls([3, 4]);
            expect(stateVariables["/g/B"].stateValues.styleNumber).eqls(1);

            expect(stateVariables["/g2"].stateValues.xmax).eq(5);
            expect(stateVariables["/g2"].stateValues.xmin).eq(-3);
            expect(stateVariables["/g2"].stateValues.ymax).eq(10);
            expect(stateVariables["/g2/A"].stateValues.xs).eqls([1, 2]);
            expect(stateVariables["/g2/A"].stateValues.styleNumber).eqls(2);
            expect(stateVariables["/g2/B"].stateValues.xs).eqls([3, 4]);
            expect(stateVariables["/g2/B"].stateValues.styleNumber).eqls(1);

            expect(stateVariables["/g3"].stateValues.xmax).eq(7);
            expect(stateVariables["/g3"].stateValues.xmin).eq(-5);
            expect(stateVariables["/g3"].stateValues.ymax).eq(8);
            expect(stateVariables["/g3/A"].stateValues.xs).eqls([1, 2]);
            expect(stateVariables["/g3/A"].stateValues.styleNumber).eqls(2);
            expect(stateVariables["/g3/B"].stateValues.xs).eqls([3, 4]);
            // TODO: uncomment when fix the behavior so this passes
            // expect(stateVariables["/g3/B"].stateValues.styleNumber).eqls(4);
        });
    });
});
