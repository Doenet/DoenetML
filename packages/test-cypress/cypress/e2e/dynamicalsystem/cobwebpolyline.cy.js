import { cesc } from "@doenet/utils";

describe("CobwebPolyline Tag Tests", function () {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    // Note: this are pretty ridiculous tests, as they are testing complicated doenetml rather than particular features.
    // Leaving them in for now. But we might want to remove them, at least for tests in the CI.

    it("cobweb graded applet", () => {
        const externalDoenetMLs = {
            cobwebGraded: `
<module name="cobwebAppletGraded">
  <moduleAttributes>
    <function name="function">x(4-x)</function>
    <number name="x0">1</number>
    <number name="initialInitialValue">0</number>
    <number name="initialValueDx">0.5</number>
    <number name="initialValueOffset">0</number>
    <number name="numIterationsRequired">0</number>
    <componentSize name="width">300px</componentSize>
    <componentSize name="height">300px"</componentSize>
    <number name="xmin">-10</number>
    <number name="xmax">10</number>
    <number name="ymin">-10</number>
    <number name="ymax">10</number>
    <boolean name="showNavigation">true</boolean>
    <number name="attractThreshold">0.5</number>
    <math name="variable">x</math>
    <math name="timeVariable">n</math>
    <boolean name="checkInitialCondition">true</boolean>
    <number name="initialConditionWeight">1</number>
    <number name="cobwebbingWeight">1</number>
    <boolean name="showCalculatedValues">true</boolean>
    <text name="grid">none</text>
    <point name="defaultPoint"/>
  </moduleAttributes>

  <module
    copy="doenet:cobwebApplet"
    name="cobwebApplet" function="$function" x0="$x0" initialInitialValue="$initialInitialValue"
    initialValueDx="$initialValueDx" initialValueOffset="$initialValueOffset"
    numIterationsRequired="$numIterationsRequired" width="$width" height="$height" xmin="$xmin"
    xmax="$xmax" ymin="$ymin" ymax="$ymax" showNavigation="$showNavigation"
    attractThreshold="$attractThreshold" variable="$variable" timeVariable="$timeVariable"
    showCalculatedValues="$showCalculatedValues" grid="$grid" defaultPoint="$defaultPoint" />

  <conditionalContent condition="$checkInitialCondition" name="cc">
    <p>Initial condition: <answer name="initialCorrect" weight="$initialConditionWeight">
        <award>
          <when>
            $cobwebApplet.initialCorrect
          </when>
        </award>
        <considerAsResponses>
          $cobwebApplet.initialPoint
          $cobwebApplet.atLeastOnePoint
        </considerAsResponses>
      </answer>
    </p>
  </conditionalContent>

  <p>Correct cobwebbing: <answer name="correctCobwebbing" weight="$cobwebbingWeight">
      <award credit="$cobwebApplet.fractionCorrectCobweb">
        <when>true</when>
      </award>
      <considerAsResponses>
        $cobwebApplet.cobwebPolyline.numIterateValues
        <and>
          $cobwebApplet.cobwebPolyline.correctVertices
        </and>
        $cobwebApplet.cobwebPolyline.vertices
      </considerAsResponses>
    </answer>
  </p>
  <feedback condition="$(correctCobwebbing.submittedResponse1) = 1" name="startFeedback">
    To start cobwebbing, click the "Add line" button and move the point at the end of the line.
  </feedback>
  <feedback condition="$(correctCobwebbing.submittedResponse2) = false" name="incorrectFeedback">
    At least one point on cobweb plot is incorrect.
  </feedback>
  <feedback
    condition="$(correctCobwebbing.submittedResponse2) = true and $(correctCobwebbing.submittedResponse1) > 1 and $(correctCobwebbing.submittedResponse1) <= $numIterationsRequired"
    name="insufficientFeedback"> For full credit, calculate at least $numIterationsRequired iterates
    (i.e., to <m>x_{$numIterationsRequired}</m>). </feedback>

</module>`,
            cobwebApplet: `
<module name="cobwebApplet">
  <moduleAttributes>
   <function name="function">x(4-x)</function>
   <number name="x0">1</number>
   <number name="initialInitialValue">0</number>
   <number name="initialValueDx">0.5</number>
   <number name="initialValueOffset">0</number>
   <number name="numIterationsRequired">0</number>
   <componentSize name="width">300px</componentSize>
   <number name="aspectRatio">1</number>
   <number name="xmin">-10</number>
   <number name="xmax">10</number>
   <number name="ymin">-10</number>
   <number name="ymax">10</number>
   <boolean name="showNavigation">true</boolean>
   <number name="attractThreshold">0.5</number>
   <math name="variable">x</math>
   <math name="timeVariable">n</math>
   <boolean name="showCalculatedValues">true</boolean>
   <text name="grid">none</text>
   <point name="defaultPoint"></point>
  </moduleAttributes>

  <setup>
    <number name="numPoints">1</number>
    <number name="zeroFixed" fixed>0</number>
    <number name="initialInitialX" copy="$initialInitialValue" />
    <point x="$initialInitialX" y="$zeroFixed" name="initialPoint" hide>
      <constraints>
        <constrainToGrid dx="$initialValueDx" xoffset="$initialValueOffset" />
      </constraints>
    </point>

    <boolean name="initialCorrect">$initialPoint = ($x0,0)</boolean>
    <number extend="$cobwebPolyline.fractionCorrectVerticesAdjusted" name="fractionCorrectCobweb" />
  </setup>

  <updateValue name="addLine" target="$numPoints" newValue="$numPoints+1" type="number" >
    <label>Add line</label>
  </updateValue>
  <updateValue name="deleteLine" target="$numPoints" newValue="$numPoints-1" type="number" disabled="$numPoints <= 1" >
    <label>Delete line</label>
  </updateValue>

  <graph width="$width" aspectRatio="$aspectRatio" xmin="$xmin" xmax="$xmax" ymin="$ymin" ymax="$ymax" showNavigation="$showNavigation" identicalAxisScales grid="$grid">
    <xLabel>$(variable)_$timeVariable</xLabel>
    <yLabel>$(variable)_{$timeVariable+1}</yLabel>
    <cobwebPolyline function="$function" numPoints="$numPoints" name="cobwebPolyline" initialPoint="$initialPoint" numIterationsRequired="$numIterationsRequired" attractThreshold="$attractThreshold" variable="$variable" defaultPoint="$defaultPoint" />
  </graph>

  <aside hide="not $showCalculatedValues" name="calculatedValue">
    <title>Calculated values</title>

    <md>
    <repeat for="$cobwebPolyline.iterateValues" valueName="x" indexName="i">
        <mrow>
          $(variable)_{<number>$i-1</number>} \\amp = <number extend="$x" displayDigits="5" />
        </mrow>
    </repeat>
    </md>

  </aside>

</module>
`,
        };
        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
  <setup>
    <function name="f">2x-x^2/3</function>
  </setup>
  
  <module copy="doenet:cobwebGraded" name="gradedApplet" function="$f" xmin="-0.8" xmax="7" ymin="-1" ymax="4" width="320px" height="200px" attractThreshold="0.2" showNavigation="false" numIterationsRequired="3" initialValueDx="0.2" x0="1" />
  
  `,
                    externalDoenetMLs,
                },
                "*",
            );
        });

        let f = (x) => 2 * x - x ** 2 / 3;

        cy.get(cesc("#gradedApplet.cc.initialCorrect_submit")).click();
        cy.get(cesc("#gradedApplet.cc.initialCorrect_incorrect")).should(
            "be.visible",
        );

        cy.get(cesc("#gradedApplet.correctCobwebbing_submit")).click();
        cy.get(cesc("#gradedApplet.correctCobwebbing_incorrect")).should(
            "be.visible",
        );

        cy.get(cesc("#gradedApplet.startFeedback")).should("be.visible");

        let polylineIdx;
        cy.window().then(async (win) => {
            polylineIdx = await win.resolvePath1(
                "gradedApplet.cobwebApplet.cobwebPolyline",
            );
            win.callAction1({
                actionName: "movePolyline",
                componentIdx: polylineIdx,
                args: {
                    pointCoords: { 0: [1, 0] },
                },
            });
        });

        cy.get(cesc("#gradedApplet.cc.initialCorrect_submit")).should(
            "be.visible",
        );
        cy.get(cesc("#gradedApplet.correctCobwebbing_incorrect")).should(
            "be.visible",
        );
        cy.get(cesc("#gradedApplet.cc.initialCorrect_submit")).click();
        cy.get(cesc("#gradedApplet.cc.initialCorrect_correct")).should(
            "be.visible",
        );

        cy.get(cesc("#gradedApplet.cobwebApplet.calculatedValue"))
            .find("span")
            .eq(0)
            .click();

        cy.get(cesc("#gradedApplet.cobwebApplet.calculatedValue")).should(
            "contain.text",
            "x0=1\n",
        );

        cy.get(cesc("#gradedApplet.cobwebApplet.addLine_button")).click();
        cy.get(cesc("#gradedApplet.correctCobwebbing_submit")).should(
            "be.visible",
        );
        cy.get(cesc("#gradedApplet.cc.initialCorrect_correct")).should(
            "be.visible",
        );
        cy.get(cesc("#gradedApplet.startFeedback")).should("be.visible");

        cy.get(cesc("#gradedApplet.correctCobwebbing_submit")).click();
        cy.get(cesc("#gradedApplet.cc.initialCorrect_correct")).should(
            "be.visible",
        );
        cy.get(cesc("#gradedApplet.correctCobwebbing_incorrect")).should(
            "be.visible",
        );
        cy.get(cesc("#gradedApplet.incorrectFeedback")).should("be.visible");

        let x1 = f(1);
        cy.window().then(async (win) => {
            win.callAction1({
                actionName: "movePolyline",
                componentIdx: polylineIdx,
                args: {
                    pointCoords: { 1: [1, x1] },
                },
            });
        });
        cy.get(cesc("#gradedApplet.correctCobwebbing_submit")).click();
        cy.get(cesc("#gradedApplet.cc.initialCorrect_correct")).should(
            "be.visible",
        );
        cy.get(cesc("#gradedApplet.correctCobwebbing_partial"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("20% correct");
            });
        cy.get(cesc("#gradedApplet.insufficientFeedback")).should("be.visible");

        cy.get(cesc("#gradedApplet.cobwebApplet.calculatedValue")).should(
            "contain.text",
            `x0=1x1=${Math.round(x1 * 10000) / 10000}\n`,
        );

        cy.get(cesc("#gradedApplet.cobwebApplet.deleteLine_button")).click();
        cy.get(cesc("#gradedApplet.correctCobwebbing_submit")).click();
        cy.get(cesc("#gradedApplet.cc.initialCorrect_correct")).should(
            "be.visible",
        );
        cy.get(cesc("#gradedApplet.correctCobwebbing_incorrect")).should(
            "be.visible",
        );
        cy.get(cesc("#gradedApplet.startFeedback")).should("be.visible");

        cy.get(cesc("#gradedApplet.cobwebApplet.calculatedValue")).should(
            "contain.text",
            "x0=1\n",
        );

        cy.get(cesc("#gradedApplet.cobwebApplet.addLine_button")).click();
        cy.get(cesc("#gradedApplet.correctCobwebbing_submit")).click();
        cy.get(cesc("#gradedApplet.cc.initialCorrect_correct")).should(
            "be.visible",
        );
        cy.get(cesc("#gradedApplet.correctCobwebbing_partial"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("20% correct");
            });
        cy.get(cesc("#gradedApplet.insufficientFeedback")).should("be.visible");

        cy.get(cesc("#gradedApplet.cobwebApplet.calculatedValue")).should(
            "contain.text",
            `x0=1x1=${Math.round(x1 * 10000) / 10000}\n`,
        );

        cy.get(cesc("#gradedApplet.cobwebApplet.addLine_button")).click();
        cy.get(cesc("#gradedApplet.correctCobwebbing_submit")).click();
        cy.get(cesc("#gradedApplet.correctCobwebbing_partial"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("20% correct");
            });
        cy.get(cesc("#gradedApplet.incorrectFeedback")).should("be.visible");

        cy.window().then(async (win) => {
            win.callAction1({
                actionName: "movePolyline",
                componentIdx: polylineIdx,
                args: {
                    pointCoords: { 2: [x1, x1] },
                },
            });
        });
        cy.get(cesc("#gradedApplet.correctCobwebbing_submit")).click();
        cy.get(cesc("#gradedApplet.correctCobwebbing_partial"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("40% correct");
            });
        cy.get(cesc("#gradedApplet.insufficientFeedback")).should("be.visible");

        cy.get(cesc("#gradedApplet.cobwebApplet.calculatedValue")).should(
            "contain.text",
            `x0=1x1=${Math.round(x1 * 10000) / 10000}\n`,
        );

        cy.get(cesc("#gradedApplet.cobwebApplet.addLine_button")).click();
        cy.get(cesc("#gradedApplet.correctCobwebbing_submit")).click();
        cy.get(cesc("#gradedApplet.correctCobwebbing_partial")).should(
            "be.visible",
        );

        let x2 = f(x1);
        cy.window().then(async (win) => {
            win.callAction1({
                actionName: "movePolyline",
                componentIdx: polylineIdx,
                args: {
                    pointCoords: { 3: [x1, x2] },
                },
            });
        });
        cy.get(cesc("#gradedApplet.correctCobwebbing_submit")).should(
            "be.visible",
        );

        cy.get(cesc("#gradedApplet.cobwebApplet.calculatedValue")).should(
            "contain.text",
            `x0=1x1=${Math.round(x1 * 10000) / 10000}x2=${Math.round(x2 * 10000) / 10000}\n`,
        );

        cy.get(cesc("#gradedApplet.cobwebApplet.addLine_button")).click();

        cy.get(cesc("#gradedApplet.correctCobwebbing_submit")).click();
        cy.get(cesc("#gradedApplet.correctCobwebbing_partial")).should(
            "be.visible",
        );

        cy.window().then(async (win) => {
            win.callAction1({
                actionName: "movePolyline",
                componentIdx: polylineIdx,
                args: {
                    pointCoords: { 4: [x2, x2] },
                },
            });
        });

        cy.get(cesc("#gradedApplet.correctCobwebbing_submit")).should(
            "be.visible",
        );

        cy.get(cesc("#gradedApplet.cobwebApplet.calculatedValue")).should(
            "contain.text",
            `x0=1x1=${Math.round(x1 * 10000) / 10000}x2=${Math.round(x2 * 10000) / 10000}\n`,
        );

        cy.get(cesc("#gradedApplet.cobwebApplet.addLine_button")).click();
        cy.get(cesc("#gradedApplet.correctCobwebbing_submit")).click();
        cy.get(cesc("#gradedApplet.correctCobwebbing_partial")).should(
            "be.visible",
        );

        let x3 = f(x2);
        cy.window().then(async (win) => {
            win.callAction1({
                actionName: "movePolyline",
                componentIdx: polylineIdx,
                args: {
                    pointCoords: { 5: [x2, x3] },
                },
            });
        });

        cy.get(cesc("#gradedApplet.correctCobwebbing_submit")).click();
        cy.get(cesc("#gradedApplet.correctCobwebbing_correct")).should(
            "be.visible",
        );

        cy.get(cesc("#gradedApplet.cobwebApplet.calculatedValue")).should(
            "contain.text",
            `x0=1x1=${Math.round(x1 * 10000) / 10000}x2=${Math.round(x2 * 10000) / 10000}x3=${Math.round(x3 * 10000) / 10000}\n`,
        );

        cy.get(cesc("#gradedApplet.cobwebApplet.addLine_button")).click();
        cy.get(cesc("#gradedApplet.correctCobwebbing_submit")).click();
        cy.get(cesc("#gradedApplet.correctCobwebbing_partial")).should(
            "be.visible",
        );
        cy.get(cesc("#gradedApplet.correctCobwebbing_partial"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("83% correct");
            });
        cy.get(cesc("#gradedApplet.incorrectFeedback")).should("be.visible");

        cy.window().then(async (win) => {
            win.callAction1({
                actionName: "movePolyline",
                componentIdx: polylineIdx,
                args: {
                    pointCoords: { 6: [x3, x3] },
                },
            });
        });
        cy.get(cesc("#gradedApplet.correctCobwebbing_submit")).click();
        cy.get(cesc("#gradedApplet.correctCobwebbing_correct")).should(
            "be.visible",
        );

        cy.get(cesc("#gradedApplet.cobwebApplet.calculatedValue")).should(
            "contain.text",
            `x0=1x1=${Math.round(x1 * 10000) / 10000}x2=${Math.round(x2 * 10000) / 10000}x3=${Math.round(x3 * 10000) / 10000}\n`,
        );

        cy.get(cesc("#gradedApplet.cobwebApplet.addLine_button")).click();
        cy.get(cesc("#gradedApplet.correctCobwebbing_submit")).click();
        cy.get(cesc("#gradedApplet.correctCobwebbing_partial")).should(
            "be.visible",
        );
        cy.get(cesc("#gradedApplet.correctCobwebbing_partial"))
            .invoke("text")
            .then((text) => {
                expect(text.trim().toLowerCase()).equal("86% correct");
            });
        cy.get(cesc("#gradedApplet.incorrectFeedback")).should("be.visible");

        let x4 = f(x3);
        cy.window().then(async (win) => {
            win.callAction1({
                actionName: "movePolyline",
                componentIdx: polylineIdx,
                args: {
                    pointCoords: { 7: [x3, x4] },
                },
            });
        });
        cy.get(cesc("#gradedApplet.correctCobwebbing_submit")).click();
        cy.get(cesc("#gradedApplet.correctCobwebbing_correct")).should(
            "be.visible",
        );

        cy.get(cesc("#gradedApplet.cobwebApplet.calculatedValue")).should(
            "contain.text",
            `x0=1x1=${Math.round(x1 * 10000) / 10000}x2=${Math.round(x2 * 10000) / 10000}x3=${Math.round(x3 * 10000) / 10000}x4=${Math.round(x4 * 10000) / 10000}\n`,
        );
    });

    it("cobweb intro tutorial", { defaultCommandTimeout: 60000 }, () => {
        const externalDoenetMLs = {
            tutorial: `<module name="initialCobwebTutorial">
    <moduleAttributes>
    <function name="function">x(4-x)</function>
    <number name="x0">0.5</number>

    <componentSize name="width">300px</componentSize>
    <componentSize name="height">300px</componentSize>
    <number name="xmin">-1</number>
    <number name="xmax">5</number>
    <number name="ymin">-1</number>
    <number name="ymax">5</number>
    <boolean name="showNavigation">true</boolean>
    <math name="variable">x</math>
    <number name="attractThreshold">0.1</number>
    <number name="answerWeight">1</number>
    </moduleAttributes>

  <setup>

    <number name="step">0</number>
    <number name="stepCompleted">0</number>
    <number name="nPoints">0</number>
    <number name="nVlines">0</number>
    <number name="nHlines">0</number>

    <math name="x1" displayDecimals="2">$$function($x0)</math>
    <math name="x2" displayDecimals="2">$$function($x1)</math>
    <boolean name="showX1Result">false</boolean>
    <boolean name="showX2Result">false</boolean>
    <number name="initX">($xmin+$xmax)/2</number>
    <number name="initY">($ymin+$ymax)/2</number>
    <number name="initXCopy1" copy="$initX.value" />
    <number name="initYCopy1" copy="$initY.value" />
    <number name="initXCopy2" copy="$initX.value" />
    <number name="initYCopy2" copy="$initY.value" />
    <number name="initXCopy3" copy="$initX.value" />
    <number name="initYCopy3" copy="$initY.value" />
    <number name="initXCopy4" copy="$initX.value" />
    <number name="initYCopy4" copy="$initY.value" />
    <number name="P1StyleNum">1</number>
    <boolean name="P1Placed">$nPoints >= 1 and $P1 = ($x0,0)</boolean>
    <number name="v1StyleNum">1</number>
    <boolean name="v1Placed">$nVlines >= 1 and $pv11.x = $x0</boolean>
    <number name="h1StyleNum">1</number>
    <boolean name="h1Placed">$nHlines >= 1 and $ph11.y = $x1</boolean>
    <number name="P2StyleNum">1</number>
    <boolean name="P2Placed">$nPoints >= 2 and $P2 = (0,$x1)</boolean>
    <number name="P3StyleNum">1</number>
    <boolean name="P3Placed">$nPoints >= 2 and $P3 = ($x1,0)</boolean>
    <number name="v2StyleNum">1</number>
    <boolean name="v2Placed">$nVlines >= 2 and $pv21.x = $x1</boolean>
    <number name="h2StyleNum">1</number>
    <boolean name="h2Placed">$nHlines >= 2 and $ph21.y = $x2</boolean>
    <number name="P4StyleNum">1</number>
    <boolean name="P4Placed">$nPoints >= 4 and $P4 = (0,$x2)</boolean>
    <boolean name="previewShortcut">false</boolean>

    <triggerSet triggerWhen="$P1Placed">
      <updateValue target="$stepCompleted" newvalue="1" />
      <updateValue target="$P1StyleNum" newvalue="2" />
    </triggerSet>

    <triggerSet triggerWhen="not $P1Placed">
      <updateValue target="$stepCompleted" newvalue="0" />
      <updateValue target="$P1StyleNum" newvalue="1" />
    </triggerSet>

    <triggerSet triggerWhen="$v1Placed">
      <updateValue target="$stepCompleted" newvalue="2" />
      <updateValue target="$v1StyleNum" newvalue="2" />
    </triggerSet>
    <triggerSet triggerWhen="not $v1Placed">
      <updateValue target="$stepCompleted" newvalue="1" />
      <updateValue target="$v1StyleNum" newvalue="1" />
    </triggerSet>

    <updateValue triggerWhen="$h1Placed" target="$h1StyleNum" newvalue="2" />
    <updateValue triggerWhen="not $h1Placed" target="$h1StyleNum" newvalue="1" />

    <triggerSet triggerWhen="$P2Placed">
      <updateValue target="$stepCompleted" newvalue="3" />
      <updateValue target="$P2StyleNum" newvalue="2" />
    </triggerSet>
    <triggerSet triggerWhen="not $P2Placed">
      <updateValue target="$stepCompleted" newvalue="2" />
      <updateValue target="$P2StyleNum" newvalue="1" />
    </triggerSet>

    <triggerSet triggerWhen="$P3Placed">
      <updateValue target="$stepCompleted" newvalue="4" />
      <updateValue target="$P3StyleNum" newvalue="2" />
    </triggerSet>
    <triggerSet triggerWhen="not $P3Placed">
      <updateValue target="$stepCompleted" newvalue="3" />
      <updateValue target="$P3StyleNum" newvalue="1" />
    </triggerSet>

    <triggerSet triggerWhen="$v2Placed">
      <updateValue target="$stepCompleted" newvalue="5" />
      <updateValue target="$v2StyleNum" newvalue="2" />
    </triggerSet>
    <triggerSet triggerWhen="not $v2Placed">
      <updateValue target="$stepCompleted" newvalue="4" />
      <updateValue target="$v2StyleNum" newvalue="1" />
    </triggerSet>

    <updateValue triggerWhen="$h2Placed" target="$h2StyleNum" newvalue="2" />
    <updateValue triggerWhen="not $h2Placed" target="$h2StyleNum" newvalue="1" />

    <triggerSet triggerWhen="$P4Placed">
      <updateValue target="$P4StyleNum" newvalue="2" />
      <updateValue target="$stepCompleted" newvalue="6" />
    </triggerSet>
    <triggerSet triggerWhen="not $P4Placed">
      <updateValue target="$P4StyleNum" newvalue="1" />
      <updateValue target="$stepCompleted" newvalue="5" />
    </triggerSet>


    <point name="pv11" x="0" y="0">
      <constraints>
        <attractTo threshold="$attractThreshold"><line equation="x=$x0" /></attractTo>
      </constraints>
    </point>
    <point name="pv12" x="0" y="1" >
      <constraints>
        <attractTo threshold="$attractThreshold"><line equation="x=$x0" /></attractTo>
      </constraints>
    </point>

    <point name="ph11" x="0" y="0">
      <constraints>
        <attractTo threshold="$attractThreshold"><line equation="y=$x1" /></attractTo>
      </constraints>
    </point>
    <point name="ph12" x="1" y="0" >
      <constraints>
        <attractTo threshold="$attractThreshold"><line equation="y=$x1" /></attractTo>
      </constraints>
    </point>

    <point name="pv21" x="0" y="0">
      <constraints>
        <attractTo threshold="$attractThreshold"><line equation="x=$x1" /></attractTo>
      </constraints>
    </point>
    <point name="pv22" x="0" y="1" >
      <constraints>
        <attractTo threshold="$attractThreshold"><line equation="x=$x1" /></attractTo>
      </constraints>
    </point>

    <point name="ph21" x="0" y="0">
      <constraints>
        <attractTo threshold="$attractThreshold"><line equation="y=$x2" /></attractTo>
      </constraints>
    </point>
    <point name="ph22" x="1" y="0" >
      <constraints>
        <attractTo threshold="$attractThreshold"><line equation="y=$x2" /></attractTo>
      </constraints>
    </point>

    <math extend="$P1.coords" name="P1coords" />
    <math extend="$P2.coords" name="P2coords" />
    <math extend="$P3.coords" name="P3coords" />
    <math extend="$P4.coords" name="P4coords" />
    <math extend="$pv11.coords" name="pv11coords" />
    <math extend="$pv12.coords" name="pv12coords" />
    <math extend="$pv21.coords" name="pv21coords" />
    <math extend="$pv22.coords" name="pv22coords" />
    <math extend="$ph11.coords" name="ph11coords" />
    <math extend="$ph12.coords" name="ph12coords" />
    <math extend="$ph21.coords" name="ph21coords" />
    <math extend="$ph22.coords" name="ph22coords" />

    <number name="pflash">1</number>
    <boolean name="flashShortcut">false</boolean>
    <animateFromSequence name="animatePflash" animationMode='increase once' animationOn='$flashShortcut' target='$pflash' animationInterval='500' from="1" to="5" />

  </setup>

  <sideBySide widths="75% 25%">

  <graph width="$width" xmin="$xmin" xmax="$xmax" ymin="$ymin" ymax="$ymax" showNavigation="$showNavigation" identicalAxisScales >
    <xLabel>$(variable)_n</xLabel>
    <yLabel>$(variable)_{n+1}</yLabel>

    <curve styleNumber="3" fixed>$function</curve>
    <line styleNumber="4" equation="y=x" fixed />
  
    <point name="P1" hide="$nPoints < 1" x="$initXCopy1" y="$initYCopy1" fixed='$step > 1' styleNumber='$P1StyleNum'>
      <label>($(variable)_0,0)</label>
      <constraints>
        <attractTo threshold="$attractThreshold"><point x="$x0" y="0" ></point></attractTo>
      </constraints>
    </point>

    <line name="v1" through="$pv11 $pv12" hide="$nVlines < 1" fixed="$step > 2" styleNumber="$v1StyleNum" />

    <line name="h1" through="$ph11 $ph12" hide="$nHlines < 1" fixed="$nPoints > 1" styleNumber="$h1StyleNum" />

    <point name="P2" hide="$nPoints < 2" x="$initXCopy2" y="$initYCopy2" fixed='$step > 3' styleNumber='$P2StyleNum'>
      <label>(0,$(variable)_1)</label>
      <constraints>
        <attractTo threshold="$attractThreshold"><point x="0" y="$x1" ></point></attractTo>
      </constraints>
    </point>

    <point name="P3" hide="$nPoints < 3" x="$initXCopy3" y="$initYCopy3" fixed='$step > 4' styleNumber='$P3StyleNum'>
      <label>($(variable)_1,0)</label>
      <constraints>
        <attractTo threshold="$attractThreshold"><point x="$x1" y="0" ></point></attractTo>
      </constraints>
    </point>

    <line name="v2" through="$pv21 $pv22" hide="$nVlines < 2" fixed="$step > 5" styleNumber="$v2StyleNum" />

    <line name="h2" through="$ph21 $ph22" hide="$nHlines < 2" fixed="$nPoints > 3" styleNumber="$h2StyleNum" />

    <point name="P4" hide="$nPoints < 4" x="$initXCopy4" y="$initYCopy4" fixed='$step > 6' styleNumber='$P4StyleNum'>
      <label>(0,$(variable)_2)</label>
      <constraints>
        <attractTo threshold="$attractThreshold"><point x="0" y="$x2" ></point></attractTo>
      </constraints>
    </point>

    <polyline styleNumber="1" vertices="($x0,0) ($x0, $x1) ($x1, $x1) ($x1, $x2)" hide="mod($pflash, 2) = 0 or not $previewShortcut" fixed />

  </graph>

  <subsection>
    <title>Results</title>

    <md>
      <mrow hide="not $P1Placed">
        $(variable)_0 \\amp = <number extend="$x0" displayDecimals="2" />
      </mrow>
      <mrow hide="not $P2Placed">
        $(variable)_1 \\amp = $x1
      </mrow>
      <mrow hide="not $P4Placed">
        $(variable)_2 \\amp = <number extend="$x2" displayDecimals="2" />
      </mrow>
    </md>

  </subsection>
  </sideBySide>

  <sideBySide>
  <aside boxed collapsible="false">
    <title>Goal</title>

    <conditionalContent>
      <case condition="$step = 0">
        <p>This tutorial will give step-by-step instructions for using the graph of the function <m>f($variable) = <evaluate forceSymbolic function="$function" input="$variable" /></m> to iterate the dynamical system
        <md>
          <mrow>$(variable)_{n+1} \\amp = <evaluate forceSymbolic function="$function" input="$(variable)_n" /></mrow>
          <mrow>$(variable)_0 \\amp = $x0.</mrow>
        </md>
        </p>
      </case>
      <case condition="$step = 1">
        <p>The first step is to create a point for the initial condition <m>$(variable)_0 = $x0</m>.</p>
      </case>
      <case condition="$step = 2">
          <p>We want to graphically apply the function to the initial condition <m>$(variable)_0 = $x0</m> to determine the value of <m>f($(variable)_0).</m> </p>
          
          <p>For this step, we'll draw a vertical line through the initial condition which will intersect the graph of the function at <m>f($(variable)_0)</m>. </p>
      </case>
      <case condition="$step = 3"> 
          <p>The value of <m>$(variable)_1 = f($(variable)_0)</m> is where the vertical line intersects the graph of the function.  We'll draw a horizontal line at that height and place a point where it hits the <m>y</m>-axis to read the value of <m>$(variable)_1</m> off the <m>y</m>-axis.</p>
      </case>
      <case condition="$step = 4">
        <p>Now that we know that <m>$(variable)_1 = $x1</m>, we can repeat the previous steps to calculate <m>$(variable)_2 = f($(variable)_1)</m>.</p>

        <p>So far, we have the value of <m>$(variable)_1</m> shown by a point on the <m>y</m>-axis.  In this step, we'll translate the value of <m>$(variable)_1</m> into a point on the <m>x</m>-axis.</p>
        
      </case>
      <case condition="$step = 5">
        <p>To estimate the value of <m>$(variable)_2 = f($(variable)_1)</m>, draw a vertical line through the point <m>($x1,0)</m> to see where it intersects the graph of the function.</p>
      </case>
      <case condition="$step=6">
        <p>We need to determine the height of the function where the vertical line through <m>($x1,0)</m> hits the graph of the function.  This height will be the value of <m>$(variable)_2</m>.</p>
        
        <p>We'll draw a horizontal line and a point along the <m>y</m>-axis to determine this height.</p>
      </case>
      <case condition="$step=7">

        <p>The graph is getting a bit busy, so we won't keep going to <m>$(variable)_3</m> or beyond with drawing all these lines.</p>

        <p>Here, you can just get a glimpse of the simpler strategy we'll use to iterate the system more efficiently.</p>

      </case>
    </conditionalContent>

  </aside>
  <aside boxed collapsible="false">
    <title>Instructions</title>

    <conditionalContent name="cc0">
      <case condition="$step = 0">

        <p>Click Next to begin.</p>

      </case>
      <case condition="$step = 1">
        <conditionalContent name="cc1">
          <case condition="$nPoints = 0">
            <p>Click 
              <updateValue name="addPoint1" target="$nPoints" newValue="1" >
                <label>add point</label>
              </updateValue>
              to create a point for the initial condition.</p>
          </case>
          <case condition="not $P1Placed">
            <p>Now move the point to the <m>x</m>-axis and the location of the initial condition <m>$(variable)_0=$x0</m>.</p>
          </case>
          <else>
            <p>Great!  We'll use the Results panel to keep track of the values of <m>$(variable)_n</m>.  It now shows that <m>$(variable)_0=$x0</m>.</p>
            
            <p>Click Next to move on to the next step.</p>
          </else>
        </conditionalContent>
      </case>
      <case condition="$step = 2">
        <conditionalContent name="cc2">
          <case condition="$nVlines = 0" >
            <p>Click
            <updateValue name="addVline1" target="$nVlines" newValue="1" >
              <label>add vertical line</label>
            </updateValue>
            to create the line.</p>
          </case>
          <case condition="not $v1Placed" >
            <p>Move the line to <m>$variable=$x0</m>. </p>
          </case>
          <else>
            <p>Line is in place.  Click Next to continue.</p>
          </else>
        </conditionalContent>

      </case>
      <case condition="$step = 3">
        <conditionalContent name="cc3">
          <case condition="$nHlines = 0" >
            <p>Click 
              <updateValue name="addHline1" target="$nHlines" newValue="1" >
                <label>add horizontal line</label>
              </updateValue>
            to create the line.</p>
          </case>

          <case condition="not $h1Placed">
            <p>Move the line to the height of <m>f($(variable)_0).</m></p>
          </case>

          <case condition="$nPoints < 2">
            <p>The horizontal line is in place. Click
              <updateValue name="addPoint2"  target="$nPoints" newValue="2" >
                <label>add point</label>
              </updateValue>
             to create a point.</p>
          </case>

          <case condition="not $P2Placed">
            <p>Move that point to where the horizontal line intersects the <m>y</m>-axis.</p>
          </case>

          <else>
            <p>Good job! The coordinates of that point are <m>(0, $(variable)_1) = (0,$x1)</m>. The value <m>$(variable)_1=$x1</m> now appears in the results.</p>
            
            <p>Click Next to move on to the next step.</p>
          </else>
        </conditionalContent>

      </case>
      <case condition="$step = 4">
        <conditionalContent name="cc4">
          <case condition="$nPoints = 2" >
            <p>Click
              <updateValue name="addPoint3" target="$nPoints" newValue="3" >
                <label>add point</label>
              </updateValue>
            to create a point.</p>
          </case>
          <case condition="not $P3Placed">
            <p>Move the point to the location <m>($x1,0)</m>, which is on the <m>x</m>-axis.</p>
          </case>
          <else>
            <p>Way to go!  Now we're set to estimate the value of <m>f($(variable)_1)</m>.  Click Next to continue.</p>
          </else>
        </conditionalContent>
        
      </case>

      <case condition="$step=5">
        <conditionalContent name="cc5">
          <case condition="$nVlines = 1" >
            <p>Click
              <updateValue name="addVline2" target="$nVlines" newValue="2" >
                <label>add vertical line</label>
              </updateValue>
            to create a vertical line.</p>
          </case>
          <case condition="not $v2Placed">
            <p>Move the line so it goes through the point <m>($x1,0)</m>.</p>
          </case>
          <else>
            <p>Making progress! Click Next to move on to the next step.</p>
          </else>
        </conditionalContent>
      </case>

      <case condition="$step=6">
        <conditionalContent name="cc6">
          <case condition="$nHlines = 1" >
            <p>Click 
              <updateValue name="addHline2" target="$nHlines" newValue="2" >
                <label>add horizontal line</label>
              </updateValue>
              to create a horizontal line.</p>
          </case>
          <case condition="not $h2Placed">
            <p>Move the line to the point where the vertical line through <m>($x1,0)</m> intersects the function.</p>
          </case>
          <case condition="$nPoints = 3">
            <p>The line is where we want it.  Now, create a point by clicking
              <updateValue name="addPoint4" target="$nPoints" newValue="4" >
                <label>add point</label>
              </updateValue>.</p>
          </case>
          <case condition="not $P4Placed">
            <p>Move the point to where that horizontal line crosses the <m>y</m>-axis.</p>
          </case>
          <else>
            <p>Awesome! The coordinates of that point are <m>(0, $(variable)_2) = (0,$x2)</m>. We added <m>$(variable)_2=$x2</m> to the results.</p>
            <p>Click Next to continue.</p>
          </else>
        </conditionalContent>
      </case>

      <case condition="$step=7">
        <conditionalContent name="cc7">
          <case condition="not $previewShortcut" >
            <p>Click this 
              <triggerSet name="shortcutButton">
                <label>preview shortcut</label>
                <updateValue target="$flashShortcut" newValue="true" type="boolean" />
                <updateValue target="$previewShortcut" newValue="true" type="boolean" /> 
              </triggerSet>
              button to reveal the shortcut on the graph.</p>
          </case>
          <else>
            <p>Congratulations, you've finished this introductory tutorial on cobwebbing!</p>
          </else>
        </conditionalContent>

      </case>

    </conditionalContent>

    <triggerSet name="resetTutorial" disabled="$step = 0">
      <label>Reset tutorial</label>

      <updateValue target="$step" newValue="0" />
      <updateValue target="$nPoints" newValue="0" />
      <updateValue target="$nHlines" newValue="0" />
      <updateValue target="$nVlines" newValue="0" />
      <updateValue target="$P1coords" newValue="($initX, $initY)" />
      <updateValue target="$P2coords" newValue="($initX, $initY)" />
      <updateValue target="$P3coords" newValue="($initX, $initY)" />
      <updateValue target="$P4coords" newValue="($initX, $initY)" />
      <updateValue target="$pv11coords" newValue="(0,0)" />
      <updateValue target="$pv12coords" newValue="(0,1)" />
      <updateValue target="$pv21coords" newValue="(0,0)" />
      <updateValue target="$pv22coords" newValue="(0,1)" />
      <updateValue target="$ph11coords" newValue="(0,0)" />
      <updateValue target="$ph12coords" newValue="(1,0)" />
      <updateValue target="$ph21coords" newValue="(0,0)" />
      <updateValue target="$ph22coords" newValue="(1,0)" />
      <updateValue target="$P1StyleNum" newValue="1" />
      <updateValue target="$P2StyleNum" newValue="1" />
      <updateValue target="$P3StyleNum" newValue="1" />
      <updateValue target="$P4StyleNum" newValue="1" />
      <updateValue target="$v1StyleNum" newValue="1" />
      <updateValue target="$v2StyleNum" newValue="1" />
      <updateValue target="$h1StyleNum" newValue="1" />
      <updateValue target="$h2StyleNum" newValue="1" />
      <updateValue target="$previewShortcut" newValue="false" type="boolean" />
      <updateValue target="$stepCompleted" newValue="0" />
    </triggerSet>
    <callAction triggerWith="$resetTutorial" target="$ans" actionName="submitAnswer" />
    
    <updateValue name="next" disabled="$stepCompleted < $step" target="$step" newValue="$step+1">
      <label>Next</label>
    </updateValue>
    <callAction triggerWith="$next" target="$ans" actionName="submitAnswer" />

    <answer name="ans" hide weight="$answerWeight">
      <award credit="$stepCompleted/6"><when>true</when></award>
    </answer>


  </aside>

  </sideBySide>

</module>
`,
        };

        cy.window().then(async (win) => {
            win.postMessage(
                {
                    doenetML: `
  <setup>
    <function name="f">2x-x^2/3</function>
  </setup>
  
  <module copy="doenet:tutorial" name="cobwebTutorial" function="$f" xmin="-0.8" xmax="7" ymin="-1" ymax="4" width="320px" height="200px" attractThreshold="0.2" showNavigation="false" numIterationsRequired="3" initialValueDx="0.2" x0="1" />
 
  <p>Credit achieved: <number extend="$_document1.creditAchieved" name="ca" /></p>
  `,
                    externalDoenetMLs,
                },
                "*",
            );
        });

        let f = (x) => 2 * x - x ** 2 / 3;

        cy.get(cesc("#ca")).should("have.text", "0");
        cy.get(cesc("#cobwebTutorial.next_button")).click();
        cy.get(cesc("#cobwebTutorial.next_button")).should("be.disabled");
        cy.get(cesc("#cobwebTutorial.cc0.cc1.addPoint1_button")).click();
        cy.get(cesc("#cobwebTutorial.cc0.cc1.addPoint1_button")).should(
            "not.exist",
        );
        cy.get(cesc("#cobwebTutorial.next_button")).should("be.disabled");

        cy.window().then(async (win) => {
            win.callAction1({
                actionName: "movePoint",
                componentIdx: await win.resolvePath1("cobwebTutorial.P1"),
                args: { x: 0.9, y: -0.1 },
            });
        });

        cy.get(cesc("#cobwebTutorial.next_button")).should("not.be.disabled");
        cy.get(cesc("#ca")).should("have.text", "0");
        cy.get(cesc("#cobwebTutorial.next_button")).click();
        cy.get(cesc("#ca")).should("have.text", "0.167");
        cy.get(cesc("#cobwebTutorial.next_button")).should("be.disabled");

        cy.get(cesc("#cobwebTutorial.cc0.cc2.addVline1_button")).click();
        cy.get(cesc("#cobwebTutorial.cc0.cc2.addVline1_button")).should(
            "not.exist",
        );
        cy.get(cesc("#cobwebTutorial.next_button")).should("be.disabled");

        cy.window().then(async (win) => {
            win.callAction1({
                actionName: "moveLine",
                componentIdx: await win.resolvePath1("cobwebTutorial.v1"),
                args: {
                    point1coords: [1.2, 1],
                    point2coords: [1.2, 2],
                },
            });
        });

        cy.get(cesc("#cobwebTutorial.next_button")).should("not.be.disabled");
        cy.get(cesc("#ca")).should("have.text", "0.167");
        cy.get(cesc("#cobwebTutorial.next_button")).click();
        cy.get(cesc("#cobwebTutorial.next_button")).should("be.disabled");
        cy.get(cesc("#ca")).should("have.text", "0.333");

        cy.get(cesc("#cobwebTutorial.cc0.cc3.addHline1_button")).click();
        cy.get(cesc("#cobwebTutorial.cc0.cc3.addHline1_button")).should(
            "not.exist",
        );
        cy.get(cesc("#cobwebTutorial.next_button")).should("be.disabled");

        cy.window().then(async (win) => {
            win.callAction1({
                actionName: "moveLine",
                componentIdx: await win.resolvePath1("cobwebTutorial.h1"),
                args: {
                    point1coords: [2, 1.5],
                    point2coords: [3, 1.5],
                },
            });
        });
        cy.get(cesc("#cobwebTutorial.cc0.cc3.addPoint2_button")).should(
            "be.visible",
        );
        cy.get(cesc("#ca")).should("have.text", "0.333");
        cy.get(cesc("#cobwebTutorial.next_button")).should("be.disabled");
        cy.get(cesc("#cobwebTutorial.cc0.cc3.addPoint2_button")).click();
        cy.get(cesc("#cobwebTutorial.next_button")).should("be.disabled");

        cy.window().then(async (win) => {
            win.callAction1({
                actionName: "movePoint",
                componentIdx: await win.resolvePath1("cobwebTutorial.P2"),
                args: { x: -0.1, y: 1.7 },
            });
        });

        cy.get(cesc("#cobwebTutorial.next_button")).should("not.be.disabled");
        cy.get(cesc("#ca")).should("have.text", "0.333");
        cy.get(cesc("#cobwebTutorial.next_button")).click();
        cy.get(cesc("#cobwebTutorial.next_button")).should("be.disabled");
        cy.get(cesc("#ca")).should("have.text", "0.5");

        cy.get(cesc("#cobwebTutorial.cc0.cc4.addPoint3_button")).click();
        cy.get(cesc("#cobwebTutorial.cc0.cc4.addPoint3_button")).should(
            "not.exist",
        );
        cy.get(cesc("#cobwebTutorial.next_button")).should("be.disabled");

        cy.window().then(async (win) => {
            win.callAction1({
                actionName: "movePoint",
                componentIdx: await win.resolvePath1("cobwebTutorial.P3"),
                args: { x: 1.8, y: 0 },
            });
        });

        cy.get(cesc("#cobwebTutorial.next_button")).should("not.be.disabled");
        cy.get(cesc("#ca")).should("have.text", "0.5");
        cy.get(cesc("#cobwebTutorial.next_button")).click();
        cy.get(cesc("#cobwebTutorial.next_button")).should("be.disabled");
        cy.get(cesc("#ca")).should("have.text", "0.667");

        cy.get(cesc("#cobwebTutorial.cc0.cc5.addVline2_button")).click();
        cy.get(cesc("#cobwebTutorial.cc0.cc5addVline2_button")).should(
            "not.exist",
        );
        cy.get(cesc("#cobwebTutorial.next_button")).should("be.disabled");

        cy.window().then(async (win) => {
            win.callAction1({
                actionName: "moveLine",
                componentIdx: await win.resolvePath1("cobwebTutorial.v2"),
                args: {
                    point1coords: [1.5, 3],
                    point2coords: [1.5, 4],
                },
            });
        });

        cy.get(cesc("#cobwebTutorial.next_button")).should("not.be.disabled");
        cy.get(cesc("#ca")).should("have.text", "0.667");
        cy.get(cesc("#cobwebTutorial.next_button")).click();
        cy.get(cesc("#cobwebTutorial.next_button")).should("be.disabled");
        cy.get(cesc("#ca")).should("have.text", "0.833");

        cy.get(cesc("#cobwebTutorial.cc0.cc6.addHline2_button")).click();
        cy.get(cesc("#cobwebTutorial.cc0.cc6.addHline2_button")).should(
            "not.exist",
        );
        cy.get(cesc("#cobwebTutorial.next_button")).should("be.disabled");

        cy.window().then(async (win) => {
            win.callAction1({
                actionName: "moveLine",
                componentIdx: await win.resolvePath1("cobwebTutorial.h2"),
                args: {
                    point1coords: [4, 2.3],
                    point2coords: [5, 2.3],
                },
            });
        });

        cy.get(cesc("#cobwebTutorial.cc0.cc6.addPoint4_button")).should(
            "be.visible",
        );
        cy.get(cesc("#ca")).should("have.text", "0.833");
        cy.get(cesc("#cobwebTutorial.next_button")).should("be.disabled");
        cy.get(cesc("#cobwebTutorial.cc0.cc6.addPoint4_button")).click();
        cy.get(cesc("#cobwebTutorial.cc0.cc6.addPoint4_button")).should(
            "not.exist",
        );
        cy.get(cesc("#cobwebTutorial.next_button")).should("be.disabled");

        cy.window().then(async (win) => {
            win.callAction1({
                actionName: "movePoint",
                componentIdx: await win.resolvePath1("cobwebTutorial.P4"),
                args: { x: 0.1, y: 2.5 },
            });
        });

        cy.get(cesc("#cobwebTutorial.next_button")).should("not.be.disabled");
        cy.get(cesc("#ca")).should("have.text", "0.833");
        cy.get(cesc("#cobwebTutorial.next_button")).click();
        cy.get(cesc("#cobwebTutorial.next_button")).should("be.disabled");
        cy.get(cesc("#ca")).should("have.text", "1");

        cy.get(cesc("#cobwebTutorial.cc0.cc7.shortcutButton_button")).click();
        cy.get(cesc("#cobwebTutorial.cc0.cc7.shortcutButton_button")).should(
            "not.exist",
        );
        cy.get(cesc("#cobwebTutorial.next_button")).should("be.disabled");
        cy.get(cesc("#ca")).should("have.text", "1");

        cy.get(cesc("#cobwebTutorial.resetTutorial_button")).click();

        cy.get(cesc("#ca")).should("have.text", "0");
        cy.get(cesc("#cobwebTutorial.next_button")).click();
        cy.get(cesc("#cobwebTutorial.next_button")).should("be.disabled");
        cy.get(cesc("#cobwebTutorial.cc0.cc1.addPoint1_button")).click();
        cy.get(cesc("#cobwebTutorial.cc0.cc1addPoint1_button")).should(
            "not.exist",
        );
        cy.get(cesc("#cobwebTutorial.next_button")).should("be.disabled");

        cy.window().then(async (win) => {
            win.callAction1({
                actionName: "movePoint",
                componentIdx: await win.resolvePath1("cobwebTutorial.P1"),
                args: { x: 0.9, y: -0.1 },
            });
        });

        cy.get(cesc("#cobwebTutorial.next_button")).should("not.be.disabled");
        cy.get(cesc("#ca")).should("have.text", "0");
        cy.get(cesc("#cobwebTutorial.next_button")).click();
        cy.get(cesc("#ca")).should("have.text", "0.167");
        cy.get(cesc("#cobwebTutorial.next_button")).should("be.disabled");

        cy.get(cesc("#cobwebTutorial.cc0.cc2.addVline1_button")).click();
        cy.get(cesc("#cobwebTutorial.cc0.cc2.addVline1_button")).should(
            "not.exist",
        );
        cy.get(cesc("#cobwebTutorial.next_button")).should("be.disabled");

        cy.window().then(async (win) => {
            win.callAction1({
                actionName: "moveLine",
                componentIdx: await win.resolvePath1("cobwebTutorial.v1"),
                args: {
                    point1coords: [1.2, 1],
                    point2coords: [1.2, 2],
                },
            });
        });

        cy.get(cesc("#cobwebTutorial.next_button")).should("not.be.disabled");
        cy.get(cesc("#ca")).should("have.text", "0.167");
        cy.get(cesc("#cobwebTutorial.next_button")).click();
        cy.get(cesc("#cobwebTutorial.next_button")).should("be.disabled");
        cy.get(cesc("#ca")).should("have.text", "0.333");

        cy.get(cesc("#cobwebTutorial.cc0.cc3.addHline1_button")).click();
        cy.get(cesc("#cobwebTutorial.cc0.cc3.addHline1_button")).should(
            "not.exist",
        );
        cy.get(cesc("#cobwebTutorial.next_button")).should("be.disabled");

        cy.window().then(async (win) => {
            win.callAction1({
                actionName: "moveLine",
                componentIdx: await win.resolvePath1("cobwebTutorial.h1"),
                args: {
                    point1coords: [2, 1.5],
                    point2coords: [3, 1.5],
                },
            });
        });

        cy.get(cesc("#cobwebTutorial.cc0.cc3.addPoint2_button")).should(
            "be.visible",
        );
        cy.get(cesc("#ca")).should("have.text", "0.333");
        cy.get(cesc("#cobwebTutorial.next_button")).should("be.disabled");
        cy.get(cesc("#cobwebTutorial.cc0.cc3.addPoint2_button")).click();
        cy.get(cesc("#cobwebTutorial.cc0.cc3.addPoint2_button")).should(
            "not.exist",
        );
        cy.get(cesc("#cobwebTutorial.next_button")).should("be.disabled");

        cy.window().then(async (win) => {
            win.callAction1({
                actionName: "movePoint",
                componentIdx: await win.resolvePath1("cobwebTutorial.P2"),
                args: { x: -0.1, y: 1.7 },
            });
        });

        cy.get(cesc("#cobwebTutorial.next_button")).should("not.be.disabled");
        cy.get(cesc("#ca")).should("have.text", "0.333");
        cy.get(cesc("#cobwebTutorial.next_button")).click();
        cy.get(cesc("#cobwebTutorial.next_button")).should("be.disabled");
        cy.get(cesc("#ca")).should("have.text", "0.5");

        cy.get(cesc("#cobwebTutorial.cc0.cc4.addPoint3_button")).click();
        cy.get(cesc("#cobwebTutorial.cc0.cc4.addPoint3_button")).should(
            "not.exist",
        );
        cy.get(cesc("#cobwebTutorial.next_button")).should("be.disabled");

        cy.window().then(async (win) => {
            win.callAction1({
                actionName: "movePoint",
                componentIdx: await win.resolvePath1("cobwebTutorial.P3"),
                args: { x: 1.8, y: 0 },
            });
        });

        cy.get(cesc("#cobwebTutorial.next_button")).should("not.be.disabled");
        cy.get(cesc("#ca")).should("have.text", "0.5");
        cy.get(cesc("#cobwebTutorial.next_button")).click();
        cy.get(cesc("#cobwebTutorial.next_button")).should("be.disabled");
        cy.get(cesc("#ca")).should("have.text", "0.667");

        cy.get(cesc("#cobwebTutorial.cc0.cc5.addVline2_button")).click();
        cy.get(cesc("#cobwebTutorial.cc0.cc5.addVline2_button")).should(
            "not.exist",
        );
        cy.get(cesc("#cobwebTutorial.next_button")).should("be.disabled");

        cy.window().then(async (win) => {
            win.callAction1({
                actionName: "moveLine",
                componentIdx: await win.resolvePath1("cobwebTutorial.v2"),
                args: {
                    point1coords: [1.5, 3],
                    point2coords: [1.5, 4],
                },
            });
        });

        cy.get(cesc("#cobwebTutorial.next_button")).should("not.be.disabled");
        cy.get(cesc("#ca")).should("have.text", "0.667");
        cy.get(cesc("#cobwebTutorial.next_button")).click();
        cy.get(cesc("#cobwebTutorial.next_button")).should("be.disabled");
        cy.get(cesc("#ca")).should("have.text", "0.833");

        cy.get(cesc("#cobwebTutorial.cc0.cc6.addHline2_button")).click();
        cy.get(cesc("#cobwebTutorial.cc0.cc6.addHline2_button")).should(
            "not.exist",
        );
        cy.get(cesc("#cobwebTutorial.next_button")).should("be.disabled");

        cy.window().then(async (win) => {
            win.callAction1({
                actionName: "moveLine",
                componentIdx: await win.resolvePath1("cobwebTutorial.h2"),
                args: {
                    point1coords: [4, 2.3],
                    point2coords: [5, 2.3],
                },
            });
        });

        cy.get(cesc("#cobwebTutorial.cc0.cc6.addPoint4_button")).should(
            "be.visible",
        );
        cy.get(cesc("#ca")).should("have.text", "0.833");
        cy.get(cesc("#cobwebTutorial.next_button")).should("be.disabled");
        cy.get(cesc("#cobwebTutorial.cc0.cc6.addPoint4_button")).click();
        cy.get(cesc("#cobwebTutorial.cc0.cc6.addPoint4_button")).should(
            "not.exist",
        );
        cy.get(cesc("#cobwebTutorial.next_button")).should("be.disabled");

        cy.window().then(async (win) => {
            win.callAction1({
                actionName: "movePoint",
                componentIdx: await win.resolvePath1("cobwebTutorial.P4"),
                args: { x: 0.1, y: 2.5 },
            });
        });

        cy.get(cesc("#cobwebTutorial.next_button")).should("not.be.disabled");
        cy.get(cesc("#ca")).should("have.text", "0.833");
        cy.get(cesc("#cobwebTutorial.next_button")).click();
        cy.get(cesc("#cobwebTutorial.next_button")).should("be.disabled");
        cy.get(cesc("#ca")).should("have.text", "1");

        cy.get(cesc("#cobwebTutorial.cc0.cc7.shortcutButton_button")).click();
        cy.get(cesc("#cobwebTutorial.cc0.cc7.shortcutButton_button")).should(
            "not.exist",
        );
        cy.get(cesc("#cobwebTutorial.next_button")).should("be.disabled");
        cy.get(cesc("#ca")).should("have.text", "1");
    });
});
