import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import {
    movePolyline,
    submitAnswer,
    updateMathInputValue,
    updateValue,
} from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("CobwebPolyline Tag Tests", async () => {
    it("logistic system", async () => {
        let core = await createTestCore({
            doenetML: `
  <function name='f' hide='true' variables='x'>1/3*x*(3-x)+x</function>
  <number hide="true" name="numPoints">1</number>

  <point name="P1" hide="true" x="-1.5" y="0">
    <constraints>
    <attractToGrid dx="0.2" xthreshold="0.05"/>
    </constraints>
  </point>

    
  <p>Initial condition is <m>x_0 = 1</m>:
  <answer name="check_initial">
    <award><when>
    $P1.coords = <math>(1,0)</math>
    </when></award>
  </answer>
  </p>

  <updateValue name="addline" target="numPoints" newValue="$numPoints+1" >
    <label>Add line</label>
  </updateValue>
  <updateValue name="deleteline" hide="$numPoints=1" target='numPoints' newValue="$numPoints-1" >
    <label>Delete line</label>
  </updateValue>
  
  <graph xmin="-2" xmax="5" ymin="-2.2" ymax="4.5" width="500px" height="300px" name="graph1" newNamespace="true">
    <xlabel>x_n</xlabel>
    <ylabel>x_{n+1}</ylabel>
    <cobwebpolyline name="cobweb" stylenumber="4" attractThreshold="0.2" numPoints="$(../numPoints)" function="$(../f)" initialPoint="$(../P1)" numIterationsRequired='3' />
  </graph> 


  <subsection>
    <title>Result of cobweb sketch</title>

    <md name="md1">
    <map>
      <template>
        <mrow>
          x_{<number>$i-1</number>} & = $(x{displayDigits="5"})
        </mrow>
      </template>
      <sources alias="x" indexAlias="i">
        $(graph1/cobweb.iterateValues)
      </sources>
    </map>
    </md>

  </subsection>

  <p>Cobweb at least three iterations</p>
  <p><answer name="check_cobweb">
  <award credit="$(graph1/cobweb.fractionCorrectVerticesAdjusted)"><when>true</when></award>
    <considerAsResponses>
      $(graph1/cobweb.vertices)
    </considerAsResponses>
  </answer>
  </p>

  <p name="psr">Submitted responses are the vertices of the polyline: $check_cobweb.submittedResponses{displayDigits="5"}</p>
  <p name="pcr">Current responses are the vertices of the polyline: $check_cobweb.currentResponses{displayDigits="5"}</p>
    `,
        });

        let latexResults = ["x_{ 0 } & = -1.5"];
        let submittedVertices: string[] = [];
        let currentVertices = ["( -1.5, 0 )"];
        let initialValCredit = 0;
        let cobwebCredit = 0;
        let cobwebJustSubmitted = false;

        async function check_items() {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            // check <answer> scores
            expect(
                stateVariables["/check_initial"].stateValues.creditAchieved,
            ).eqls(initialValCredit);
            expect(
                stateVariables["/check_cobweb"].stateValues.creditAchieved,
            ).eqls(cobwebCredit);
            expect(
                stateVariables["/check_cobweb"].stateValues.justSubmitted,
            ).eqls(cobwebJustSubmitted);
            // check numPoints
            expect(stateVariables["/numPoints"].stateValues.value).eqls(
                currentVertices.length,
            );
            // check math rows
            let mdChildren = stateVariables["/md1"].activeChildren;
            expect(mdChildren.length).eqls(latexResults.length);
            for (let i = 0; i < latexResults.length; i++) {
                let childName = mdChildren[i].componentIdx;
                expect(stateVariables[childName].stateValues.latex).eqls(
                    latexResults[i],
                );
            }
            // check submitted vertices via paragraph
            let allSubmittedVertices = submittedVertices.reduce(
                (a, v) => `${a}, ${v}`,
                "",
            );
            if (allSubmittedVertices.length > 0) {
                allSubmittedVertices = allSubmittedVertices.substring(2);
            }
            expect(stateVariables["/psr"].stateValues.text).eqls(
                `Submitted responses are the vertices of the polyline: ${allSubmittedVertices}`,
            );

            // check submitted vertices via paragraph
            let allCurrentVertices = currentVertices.reduce(
                (a, v) => `${a}, ${v}`,
                "",
            );
            if (allCurrentVertices.length > 0) {
                allCurrentVertices = allCurrentVertices.substring(2);
            }
            expect(stateVariables["/pcr"].stateValues.text).eqls(
                `Current responses are the vertices of the polyline: ${allCurrentVertices}`,
            );
        }

        await check_items();
        // Also check can't remove line
        {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(stateVariables["/deleteline"].stateValues.hidden).eqls(true);
        }

        // Click both submit buttons
        submittedVertices = [...currentVertices];
        cobwebJustSubmitted = true;
        await submitAnswer({ name: "/check_initial", core });
        await submitAnswer({ name: "/check_cobweb", core });
        await check_items();

        // Move first point
        currentVertices[0] = "( 1, 0 )";
        latexResults[0] = "x_{ 0 } & = 1";
        await movePolyline({
            name: "/graph1/cobweb",
            pointCoords: { 0: [1, 0] },
            core,
        });
        await check_items();

        // Click initial value submit
        initialValCredit = 1;
        await submitAnswer({ name: "/check_initial", core });
        await check_items();

        // Add second point, should spawn at center of graph
        const graphCenterX = (-2 + 5) / 2;
        const graphCenterY = (-2.2 + 4.5) / 2;
        latexResults.push(`x_{ 1 } & = ${graphCenterY}`);
        currentVertices.push(`( ${graphCenterX}, ${graphCenterY} )`);
        cobwebJustSubmitted = false;
        await updateValue({ name: "/addline", core });
        await check_items();

        // Move second point to wrong location, submit
        latexResults[1] = "x_{ 1 } & = 4";
        currentVertices[1] = "( 3, 4 )";
        submittedVertices = [...currentVertices];
        cobwebJustSubmitted = true;
        await movePolyline({
            name: "/graph1/cobweb",
            pointCoords: { 1: [3, 4] },
            core,
        });
        await submitAnswer({ name: "/check_cobweb", core });
        await check_items();

        // Move second point to a different wrong location and make sure submit button reappears
        latexResults[1] = "x_{ 1 } & = 1";
        currentVertices[1] = "( 1, 1 )";
        cobwebJustSubmitted = false;
        await movePolyline({
            name: "/graph1/cobweb",
            pointCoords: { 1: [1, 1] },
            core,
        });
        await check_items();

        // submit
        submittedVertices = [...currentVertices];
        cobwebJustSubmitted = true;
        await submitAnswer({ name: "/check_cobweb", core });
        await check_items();

        // Move second point to correct location, submit
        latexResults[1] = "x_{ 1 } & = 1.6667";
        currentVertices[1] = "( 1, 1.6667 )";
        submittedVertices = [...currentVertices];
        cobwebCredit = 0.2;
        await movePolyline({
            name: "/graph1/cobweb",
            pointCoords: { 1: [1, 1.6] },
            core,
        });
        await submitAnswer({ name: "/check_cobweb", core });
        await check_items();

        // Add third point but don't move it, should be at graph's center, submit
        currentVertices.push(`( ${graphCenterX}, ${graphCenterY} )`);
        submittedVertices = [...currentVertices];
        await updateValue({ name: "/addline", core });
        await submitAnswer({ name: "/check_cobweb", core });
        await check_items();

        // Move third point to correct location, submit
        currentVertices[2] = "( 1.6667, 1.6667 )";
        submittedVertices = [...currentVertices];
        cobwebCredit = 0.4;
        await movePolyline({
            name: "/graph1/cobweb",
            pointCoords: { 2: [1.6, 1.6] },
            core,
        });
        await submitAnswer({ name: "/check_cobweb", core });
        await check_items();

        // Add fourth point and move to wrong location, submit
        latexResults.push("x_{ 2 } & = 2");
        currentVertices.push(`( 1, 2 )`);
        submittedVertices = [...currentVertices];
        await updateValue({ name: "/addline", core });
        await movePolyline({
            name: "/graph1/cobweb",
            pointCoords: { 3: [1, 2] },
            core,
        });
        await submitAnswer({ name: "/check_cobweb", core });
        await check_items();

        // Move fourth point to correct location, submit
        latexResults[2] = "x_{ 2 } & = 2.4074";
        currentVertices[3] = "( 1.6667, 2.4074 )";
        submittedVertices = [...currentVertices];
        cobwebCredit = 0.6;
        await movePolyline({
            name: "/graph1/cobweb",
            pointCoords: { 3: [1.6, 2.4] },
            core,
        });
        await submitAnswer({ name: "/check_cobweb", core });
        await check_items();

        // Delete fourth point
        let removedLatex = latexResults.pop()!;
        let removedVertex = currentVertices.pop()!;
        cobwebJustSubmitted = false;
        await updateValue({ name: "/deleteline", core });
        await check_items();

        // submit
        submittedVertices = [...currentVertices];
        cobwebCredit = 0.4;
        cobwebJustSubmitted = true;
        await submitAnswer({ name: "/check_cobweb", core });
        await check_items();

        // Add fourth point back, should remember where it had been, submit
        await updateValue({ name: "/addline", core });
        latexResults.push(removedLatex);
        currentVertices.push(removedVertex);
        submittedVertices = [...currentVertices];
        cobwebCredit = 0.6;
        await submitAnswer({ name: "/check_cobweb", core });
        await check_items();

        // Add fifth point and move to correct location, submit
        currentVertices.push(`( 2.4074, 2.4074 )`);
        submittedVertices = [...currentVertices];
        cobwebCredit = 0.8;
        await updateValue({ name: "/addline", core });
        await movePolyline({
            name: "/graph1/cobweb",
            pointCoords: { 4: [2.4, 2.4] },
            core,
        });
        await submitAnswer({ name: "/check_cobweb", core });
        await check_items();

        // Add sixth point and move to wrong location, submit
        latexResults.push("x_{ 3 } & = 3");
        currentVertices.push(`( -1, 3 )`);
        submittedVertices = [...currentVertices];
        await updateValue({ name: "/addline", core });
        await movePolyline({
            name: "/graph1/cobweb",
            pointCoords: { 5: [-1, 3] },
            core,
        });
        await submitAnswer({ name: "/check_cobweb", core });
        await check_items();

        // Move sixth point to correct location, submit
        latexResults[3] = "x_{ 3 } & = 2.8829";
        currentVertices[5] = "( 2.4074, 2.8829 )";
        submittedVertices = [...currentVertices];
        cobwebCredit = 1;
        await movePolyline({
            name: "/graph1/cobweb",
            pointCoords: { 5: [2.4, 3] },
            core,
        });
        await submitAnswer({ name: "/check_cobweb", core });
        await check_items();

        // Add seventh point and move to wrong location, submit
        currentVertices.push(`( 3, 1 )`);
        submittedVertices = [...currentVertices];
        cobwebCredit = 5 / 6; // ~0.83
        await updateValue({ name: "/addline", core });
        await movePolyline({
            name: "/graph1/cobweb",
            pointCoords: { 6: [3, 1] },
            core,
        });
        await submitAnswer({ name: "/check_cobweb", core });
        await check_items();

        // Move seventh point to correct location, submit
        currentVertices[6] = "( 2.8829, 2.8829 )";
        submittedVertices = [...currentVertices];
        cobwebCredit = 1;
        await movePolyline({
            name: "/graph1/cobweb",
            pointCoords: { 6: [3, 3] },
            core,
        });
        await submitAnswer({ name: "/check_cobweb", core });
        await check_items();

        // Add eighth point and move to correct location, submit
        latexResults[4] = "x_{ 4 } & = 2.9954";
        currentVertices[7] = "( 2.8829, 2.9954 )";
        submittedVertices = [...currentVertices];
        await updateValue({ name: "/addline", core });
        await movePolyline({
            name: "/graph1/cobweb",
            pointCoords: { 7: [3, 3] },
            core,
        });
        await submitAnswer({ name: "/check_cobweb", core });
        await check_items();
    });

    it("handle bad initial point, lock to solution", async () => {
        let core = await createTestCore({
            doenetML: `
  <setup>
    <function name='f'>x^2</function>
  </setup>
  <p name="p1">Initial point: <mathinput name="x0" /></p>
  <graph>
    <cobwebpolyline name="cobweb" stylenumber="4" numPoints="100" function="$f" initialPoint="$x0" lockToSolution />
  </graph>
  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        let vertices = stateVariables["/cobweb"].stateValues.vertices;
        expect(vertices.length).eqls(100);
        expect(vertices[0].map((v) => v.tree)).eqls(["＿", 0]);
        for (let i = 1; i < 100; i++) {
            expect(vertices[i].map((v) => v.tree)).eqls([NaN, NaN]);
        }

        await updateMathInputValue({ name: "/x0", latex: "0.9", core });
        stateVariables = await core.returnAllStateVariables(false, true);
        vertices = stateVariables["/cobweb"].stateValues.vertices;
        expect(vertices.length).eqls(100);
        expect(vertices[0].map((v) => v.tree)).eqls([0.9, 0]);
        expect(vertices[1].map((v) => v.tree)).eqls([0.9, 0.81]);
        expect(vertices[50].map((v) => v.tree)).eqls([0, 0]);
        expect(vertices[99].map((v) => v.tree)).eqls([0, 0]);

        await updateMathInputValue({ name: "/x0", latex: "(1.1,3)", core });
        stateVariables = await core.returnAllStateVariables(false, true);
        vertices = stateVariables["/cobweb"].stateValues.vertices;
        expect(vertices.length).eqls(100);
        expect(vertices[0][0].tree).closeTo(1.1, 1e-14);
        expect(vertices[0][1].tree).closeTo(3, 1e-14);
        expect(vertices[1][0].tree).closeTo(1.1, 1e-14);
        expect(vertices[1][1].tree).closeTo(1.21, 1e-14);
        expect(vertices[50].map((v) => v.tree)).eqls([Infinity, Infinity]);
        expect(vertices[99].map((v) => v.tree)).eqls([Infinity, Infinity]);
    });
});
