import me from "math-expressions";
import { cesc, cesc2 } from "@doenet/utils";

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

    it("unlinked copy of linked copy copies state variables from uncopied children and attributes, group inside", () => {
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
        <group>
            <point name="A" styleNumber="2" labelIsName labelPosition="upperLeft">(1,2)</point>
        </group>
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

    it("unlinked copy of linked copy copies state variables from uncopied children and attributes, group outside", () => {
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
    <group name="gr" newNamespace>
        <graph name="g" xmax="5">
            <point name="A" styleNumber="2" labelIsName labelPosition="upperLeft">(1,2)</point>
        </graph>
    </group>

    <group copySource="gr" name="gr2" />

    <group copySource="gr2" link="false" name="gr3" />
  `,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables["/gr/g"].stateValues.xmax).eq(5);
            expect(stateVariables["/gr/A"].stateValues.xs).eqls([1, 2]);
            expect(stateVariables["/gr/A"].stateValues.styleNumber).eq(2);
            expect(stateVariables["/gr/A"].stateValues.label).eq("A");
            expect(stateVariables["/gr/A"].stateValues.labelPosition).eq(
                "upperleft",
            );

            expect(stateVariables["/gr2/g"].stateValues.xmax).eq(5);
            expect(stateVariables["/gr2/A"].stateValues.xs).eqls([1, 2]);
            expect(stateVariables["/gr2/A"].stateValues.styleNumber).eq(2);
            expect(stateVariables["/gr2/A"].stateValues.label).eq("A");
            expect(stateVariables["/gr2/A"].stateValues.labelPosition).eq(
                "upperleft",
            );

            expect(stateVariables["/gr3/g"].stateValues.xmax).eq(5);
            expect(stateVariables["/gr3/A"].stateValues.xs).eqls([1, 2]);
            expect(stateVariables["/gr3/A"].stateValues.styleNumber).eq(2);
            expect(stateVariables["/gr3/A"].stateValues.label).eq("A");
            expect(stateVariables["/gr3/A"].stateValues.labelPosition).eq(
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

    it("unlinked copy of linked copy, overwrite attributes of linked copy, group inside", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <text>a</text>
    <graph name="g" newNamespace xmax="5">
        <group>
            <point name="A" styleNumber="2">(1,2)</point>
            <point name="B">(3,4)</point>
        </group>
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
    it("unlinked copy of linked copy, overwrite attributes of unlinked copy", () => {
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

    it("unlinked copy of linked copy, overwrite attributes of unlinked copy, group inside", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <text>a</text>
    <graph name="g" newNamespace xmax="5">
        <group>
            <point name="A" styleNumber="2">(1,2)</point>
            <point name="B">(3,4)</point>
        </group>
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
            expect(stateVariables["/g3/B"].stateValues.styleNumber).eqls(4);
        });
    });

    it("create snapshot of group with conditionalContent", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <text>a</text>
    <graph name="graph1">
        <group name="gr">
            <point name="P" />
            <point name="Q" />
        </group>
    </graph>

    <boolean name="copy">false</boolean>

    <updateValue target="copy" type="boolean" newValue="true" name="takeSnapshot">
        <label>Take snapshot</label>
    </updateValue>

    <graph name="graph2">
        <conditionalContent condition="$copy">
            $gr{link="false"}
        </conditionalContent>
    </graph>
  `,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

        // move points
        cy.window().then(async (win) => {
            await win.callAction1({
                actionName: "movePoint",
                componentName: "/P",
                args: { x: -1, y: -7 },
            });
            await win.callAction1({
                actionName: "movePoint",
                componentName: "/Q",
                args: { x: 5, y: 3 },
            });
        });

        cy.get(cesc("#\\/takeSnapshot_button")).click();
        cy.get(cesc2("#/copy")).should("have.text", "true");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables["/P"].stateValues.xs).eqls([-1, -7]);
            expect(stateVariables["/Q"].stateValues.xs).eqls([5, 3]);

            let graph2Children = stateVariables["/graph2"].activeChildren;
            let P2 = graph2Children[0].componentName;
            let Q2 = graph2Children[1].componentName;
            expect(stateVariables[P2].stateValues.xs).eqls([-1, -7]);
            expect(stateVariables[Q2].stateValues.xs).eqls([5, 3]);
        });

        // move points again
        cy.window().then(async (win) => {
            await win.callAction1({
                actionName: "movePoint",
                componentName: "/P",
                args: { x: 2, y: -9 },
            });
            await win.callAction1({
                actionName: "movePoint",
                componentName: "/Q",
                args: { x: 1, y: 8 },
            });
        });

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables["/P"].stateValues.xs).eqls([2, -9]);
            expect(stateVariables["/Q"].stateValues.xs).eqls([1, 8]);

            let graph2Children = stateVariables["/graph2"].activeChildren;
            let P2 = graph2Children[0].componentName;
            let Q2 = graph2Children[1].componentName;
            expect(stateVariables[P2].stateValues.xs).eqls([-1, -7]);
            expect(stateVariables[Q2].stateValues.xs).eqls([5, 3]);
        });
    });

    it("create snapshot of group with callAction", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <text>a</text>
    <graph name="graph1">
        <group name="gr">
            <point name="P" />
            <point name="Q" />
        </group>
    </graph>

    <callAction name="takeSnapshot" target="graph2" actionName="addChildren">
        <label>Take snapshot</label>
        $gr{link="false"}
    </callAction>
    <updateValue triggerWith="takeSnapshot" target="takeSnapshot.disabled" newValue="true" type="boolean" />

    <graph name="graph2">
    </graph>
  `,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

        // move points
        cy.window().then(async (win) => {
            await win.callAction1({
                actionName: "movePoint",
                componentName: "/P",
                args: { x: -1, y: -7 },
            });
            await win.callAction1({
                actionName: "movePoint",
                componentName: "/Q",
                args: { x: 5, y: 3 },
            });
        });

        cy.get(cesc("#\\/takeSnapshot_button")).click();

        cy.get(cesc2("#/takeSnapshot_button")).should("be.disabled");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables["/P"].stateValues.xs).eqls([-1, -7]);
            expect(stateVariables["/Q"].stateValues.xs).eqls([5, 3]);

            let graph2Children = stateVariables["/graph2"].activeChildren;
            let P2 = graph2Children[0].componentName;
            let Q2 = graph2Children[1].componentName;
            expect(stateVariables[P2].stateValues.xs).eqls([-1, -7]);
            expect(stateVariables[Q2].stateValues.xs).eqls([5, 3]);
        });

        // move points again
        cy.window().then(async (win) => {
            await win.callAction1({
                actionName: "movePoint",
                componentName: "/P",
                args: { x: 2, y: -9 },
            });
            await win.callAction1({
                actionName: "movePoint",
                componentName: "/Q",
                args: { x: 1, y: 8 },
            });
        });

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables["/P"].stateValues.xs).eqls([2, -9]);
            expect(stateVariables["/Q"].stateValues.xs).eqls([1, 8]);

            let graph2Children = stateVariables["/graph2"].activeChildren;
            let P2 = graph2Children[0].componentName;
            let Q2 = graph2Children[1].componentName;
            expect(stateVariables[P2].stateValues.xs).eqls([-1, -7]);
            expect(stateVariables[Q2].stateValues.xs).eqls([5, 3]);
        });
    });

    it("create snapshot of map with conditionalContent", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <text>a</text>
    <graph name="graph1">
        <map name="mp" assignNames="(P) (Q)">
            <template>
                <point>(1, $i{link="false"})</point>
            </template>
            <sources alias="i">
                <sequence length="2" />
            </sources>
        </map>
    </graph>

    <boolean name="copy">false</boolean>

    <updateValue target="copy" type="boolean" newValue="true" name="takeSnapshot">
        <label>Take snapshot</label>
    </updateValue>

    <graph name="graph2">
        <conditionalContent condition="$copy">
            $mp{link="false"}
        </conditionalContent>
    </graph>
  `,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

        // move points
        cy.window().then(async (win) => {
            await win.callAction1({
                actionName: "movePoint",
                componentName: "/P",
                args: { x: -1, y: -7 },
            });
            await win.callAction1({
                actionName: "movePoint",
                componentName: "/Q",
                args: { x: 5, y: 3 },
            });
        });

        cy.get(cesc("#\\/takeSnapshot_button")).click();
        cy.get(cesc2("#/copy")).should("have.text", "true");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables["/P"].stateValues.xs).eqls([-1, -7]);
            expect(stateVariables["/Q"].stateValues.xs).eqls([5, 3]);

            let graph2Children = stateVariables["/graph2"].activeChildren;
            let P2 = graph2Children[0].componentName;
            let Q2 = graph2Children[1].componentName;
            expect(stateVariables[P2].stateValues.xs).eqls([-1, -7]);
            expect(stateVariables[Q2].stateValues.xs).eqls([5, 3]);
        });

        // move points again
        cy.window().then(async (win) => {
            await win.callAction1({
                actionName: "movePoint",
                componentName: "/P",
                args: { x: 2, y: -9 },
            });
            await win.callAction1({
                actionName: "movePoint",
                componentName: "/Q",
                args: { x: 1, y: 8 },
            });
        });

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables["/P"].stateValues.xs).eqls([2, -9]);
            expect(stateVariables["/Q"].stateValues.xs).eqls([1, 8]);

            let graph2Children = stateVariables["/graph2"].activeChildren;
            let P2 = graph2Children[0].componentName;
            let Q2 = graph2Children[1].componentName;
            expect(stateVariables[P2].stateValues.xs).eqls([-1, -7]);
            expect(stateVariables[Q2].stateValues.xs).eqls([5, 3]);
        });
    });

    it("create snapshot of map with callAction", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <text>a</text>
    <graph name="graph1">
        <map name="mp" assignNames="(P) (Q)">
            <template>
                <point>(1, $i{link="false"})</point>
            </template>
            <sources alias="i">
                <sequence length="2" />
            </sources>
        </map>
    </graph>

    <callAction name="takeSnapshot" target="graph2" actionName="addChildren">
        <label>Take snapshot</label>
        $mp{link="false"}
    </callAction>
    <updateValue triggerWith="takeSnapshot" target="takeSnapshot.disabled" newValue="true" type="boolean" />

    <graph name="graph2">
    </graph>
  `,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

        // move points
        cy.window().then(async (win) => {
            await win.callAction1({
                actionName: "movePoint",
                componentName: "/P",
                args: { x: -1, y: -7 },
            });
            await win.callAction1({
                actionName: "movePoint",
                componentName: "/Q",
                args: { x: 5, y: 3 },
            });
        });

        cy.get(cesc("#\\/takeSnapshot_button")).click();

        cy.get(cesc2("#/takeSnapshot_button")).should("be.disabled");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables["/P"].stateValues.xs).eqls([-1, -7]);
            expect(stateVariables["/Q"].stateValues.xs).eqls([5, 3]);

            let graph2Children = stateVariables["/graph2"].activeChildren;
            let P2 = graph2Children[0].componentName;
            let Q2 = graph2Children[1].componentName;
            expect(stateVariables[P2].stateValues.xs).eqls([-1, -7]);
            expect(stateVariables[Q2].stateValues.xs).eqls([5, 3]);
        });

        // move points again
        cy.window().then(async (win) => {
            await win.callAction1({
                actionName: "movePoint",
                componentName: "/P",
                args: { x: 2, y: -9 },
            });
            await win.callAction1({
                actionName: "movePoint",
                componentName: "/Q",
                args: { x: 1, y: 8 },
            });
        });

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables["/P"].stateValues.xs).eqls([2, -9]);
            expect(stateVariables["/Q"].stateValues.xs).eqls([1, 8]);

            let graph2Children = stateVariables["/graph2"].activeChildren;
            let P2 = graph2Children[0].componentName;
            let Q2 = graph2Children[1].componentName;
            expect(stateVariables[P2].stateValues.xs).eqls([-1, -7]);
            expect(stateVariables[Q2].stateValues.xs).eqls([5, 3]);
        });
    });

    it("create snapshot of map in a group with conditionalContent", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <text>a</text>
    <graph name="graph1">
        <group name="gr">
            <map name="mp" assignNames="(P) (Q)">
                <template>
                    <point>(1, $i{link="false"})</point>
                </template>
                <sources alias="i">
                    <sequence length="2" />
                </sources>
            </map>
        </group>
    </graph>

    <boolean name="copy">false</boolean>

    <updateValue target="copy" type="boolean" newValue="true" name="takeSnapshot">
        <label>Take snapshot</label>
    </updateValue>

    <graph name="graph2">
        <conditionalContent condition="$copy">
            $gr{link="false"}
        </conditionalContent>
    </graph>
  `,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

        // move points
        cy.window().then(async (win) => {
            await win.callAction1({
                actionName: "movePoint",
                componentName: "/P",
                args: { x: -1, y: -7 },
            });
            await win.callAction1({
                actionName: "movePoint",
                componentName: "/Q",
                args: { x: 5, y: 3 },
            });
        });

        cy.get(cesc("#\\/takeSnapshot_button")).click();
        cy.get(cesc2("#/copy")).should("have.text", "true");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables["/P"].stateValues.xs).eqls([-1, -7]);
            expect(stateVariables["/Q"].stateValues.xs).eqls([5, 3]);

            let graph2Children = stateVariables["/graph2"].activeChildren;
            let P2 = graph2Children[0].componentName;
            let Q2 = graph2Children[1].componentName;
            expect(stateVariables[P2].stateValues.xs).eqls([-1, -7]);
            expect(stateVariables[Q2].stateValues.xs).eqls([5, 3]);
        });

        // move points again
        cy.window().then(async (win) => {
            await win.callAction1({
                actionName: "movePoint",
                componentName: "/P",
                args: { x: 2, y: -9 },
            });
            await win.callAction1({
                actionName: "movePoint",
                componentName: "/Q",
                args: { x: 1, y: 8 },
            });
        });

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables["/P"].stateValues.xs).eqls([2, -9]);
            expect(stateVariables["/Q"].stateValues.xs).eqls([1, 8]);

            let graph2Children = stateVariables["/graph2"].activeChildren;
            let P2 = graph2Children[0].componentName;
            let Q2 = graph2Children[1].componentName;
            expect(stateVariables[P2].stateValues.xs).eqls([-1, -7]);
            expect(stateVariables[Q2].stateValues.xs).eqls([5, 3]);
        });
    });

    it("create snapshot of map in a group with callAction", () => {
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
    <text>a</text>
    <graph name="graph1">
        <group name="gr">
            <map name="mp" assignNames="(P) (Q)">
                <template>
                    <point>(1, $i{link="false"})</point>
                </template>
                <sources alias="i">
                    <sequence length="2" />
                </sources>
            </map>
        </group>
    </graph>

    <callAction name="takeSnapshot" target="graph2" actionName="addChildren">
        <label>Take snapshot</label>
        $gr{link="false"}
    </callAction>
    <updateValue triggerWith="takeSnapshot" target="takeSnapshot.disabled" newValue="true" type="boolean" />

    <graph name="graph2">
    </graph>
  `,
                },
                "*",
            );
        });

        cy.get(cesc("#\\/_text1")).should("have.text", "a"); // to wait for page to load

        // move points
        cy.window().then(async (win) => {
            await win.callAction1({
                actionName: "movePoint",
                componentName: "/P",
                args: { x: -1, y: -7 },
            });
            await win.callAction1({
                actionName: "movePoint",
                componentName: "/Q",
                args: { x: 5, y: 3 },
            });
        });

        cy.get(cesc("#\\/takeSnapshot_button")).click();

        cy.get(cesc2("#/takeSnapshot_button")).should("be.disabled");

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables["/P"].stateValues.xs).eqls([-1, -7]);
            expect(stateVariables["/Q"].stateValues.xs).eqls([5, 3]);

            let graph2Children = stateVariables["/graph2"].activeChildren;
            let P2 = graph2Children[0].componentName;
            let Q2 = graph2Children[1].componentName;
            expect(stateVariables[P2].stateValues.xs).eqls([-1, -7]);
            expect(stateVariables[Q2].stateValues.xs).eqls([5, 3]);
        });

        // move points again
        cy.window().then(async (win) => {
            await win.callAction1({
                actionName: "movePoint",
                componentName: "/P",
                args: { x: 2, y: -9 },
            });
            await win.callAction1({
                actionName: "movePoint",
                componentName: "/Q",
                args: { x: 1, y: 8 },
            });
        });

        cy.window().then(async (win) => {
            let stateVariables = await win.returnAllStateVariables1();
            expect(stateVariables["/P"].stateValues.xs).eqls([2, -9]);
            expect(stateVariables["/Q"].stateValues.xs).eqls([1, 8]);

            let graph2Children = stateVariables["/graph2"].activeChildren;
            let P2 = graph2Children[0].componentName;
            let Q2 = graph2Children[1].componentName;
            expect(stateVariables[P2].stateValues.xs).eqls([-1, -7]);
            expect(stateVariables[Q2].stateValues.xs).eqls([5, 3]);
        });
    });
});
