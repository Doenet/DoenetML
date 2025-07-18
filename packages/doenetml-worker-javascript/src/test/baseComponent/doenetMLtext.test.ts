import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("DoenetML text tests", async () => {
    it("doenetML state variable", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
        <p name="theP">
          Did you know that
          <math name="m">1 + 1</math>
          =
          <math extend="$m" simplify />?
        </p>
      
        <pre name="theDoenetML">$theP.doenetML</pre>
      
  `,
        });

        let thePDoenetML = `<p name="theP">
  Did you know that
  <math name="m">1 + 1</math>
  =
  <math extend="$m" simplify />?
</p>`;

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("theP")].stateValues.text,
        ).eq(`
          Did you know that
          1 + 1
          =
          2?
        `);
        expect(
            stateVariables[await resolvePathToNodeIdx("theP")].stateValues
                .doenetML,
        ).eqls(thePDoenetML);

        let preChild =
            stateVariables[await resolvePathToNodeIdx("theDoenetML")]
                .activeChildren[0].componentIdx;
        expect(stateVariables[preChild].stateValues.value).eqls(thePDoenetML);
    });

    it("doenetML from displayDoenetML", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
        <pre name="theDoenetML"><displayDoenetML name="ddml1">
          <p>A graph of a point</p>

          <graph>
            <point name="P">(3,4)</point>
          </graph>

          A string by itself!
        </displayDoenetML></pre>
      
        <pre name="theDoenetML2"><displayDoenetML name="ddml2">String with no space.</displayDoenetML></pre>

        <p name="pMacro">This is a macro: <c><displayDoenetML name="ddml3">$f</displayDoenetML></c>.</p>

  `,
        });

        let thePDoenetML = `<p>A graph of a point</p>

<graph>
  <point name="P">(3,4)</point>
</graph>

A string by itself!`;

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("ddml1")].stateValues
                .value,
        ).eq(thePDoenetML);
        expect(
            stateVariables[await resolvePathToNodeIdx("ddml1")].stateValues
                .text,
        ).eq(thePDoenetML);
        expect(
            stateVariables[await resolvePathToNodeIdx("ddml2")].stateValues
                .value,
        ).eq("String with no space.");
        expect(
            stateVariables[await resolvePathToNodeIdx("ddml3")].stateValues
                .value,
        ).eq("$f");
        expect(
            stateVariables[await resolvePathToNodeIdx("pMacro")].stateValues
                .text,
        ).eq("This is a macro: $f.");
    });

    it("doenetML from displayDoenetML, remove preceding spacing in pre", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
        <pre name="preDoenetML1">
          <displayDoenetML name="ddml1">
            <p>A graph of a point</p>

            <graph>
              <point name="P">(3,4)</point>
            </graph>

            A string by itself!
          </displayDoenetML>
          </pre>
      
        <pre name="preDoenetML2">
          DoenetML A:
          <displayDoenetML name="ddml2">
            <graph>
              <point />
            </graph>
          </displayDoenetML>
          DoenetML B:
          <displayDoenetML name="ddml3">
            <p>
              Hello
            </p>
          </displayDoenetML>

        </pre>


  `,
        });

        let theDoenetML1 = `<p>A graph of a point</p>

<graph>
  <point name="P">(3,4)</point>
</graph>

A string by itself!`;

        let thePre1 = `
${theDoenetML1}
          `;

        let theDoenetML2 = `<graph>
  <point />
</graph>`;
        let theDoenetML3 = `<p>
  Hello
</p>`;

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("ddml1")].stateValues
                .value,
        ).eq(theDoenetML1);
        expect(
            stateVariables[await resolvePathToNodeIdx("ddml1")].stateValues
                .text,
        ).eq(theDoenetML1);
        expect(
            stateVariables[await resolvePathToNodeIdx("ddml2")].stateValues
                .value,
        ).eq(theDoenetML2);
        expect(
            stateVariables[await resolvePathToNodeIdx("ddml2")].stateValues
                .text,
        ).eq(theDoenetML2);
        expect(
            stateVariables[await resolvePathToNodeIdx("ddml3")].stateValues
                .value,
        ).eq(theDoenetML3);
        expect(
            stateVariables[await resolvePathToNodeIdx("ddml3")].stateValues
                .text,
        ).eq(theDoenetML3);
    });

    it("copying displayDoenetML, with or without linking", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <section name="s1">
    <pre><displayDoenetML name="ddml">
      <text>hello!</text>
    </displayDoenetML></pre>

    <p name="p1">A sentence</p>

    <p name="pd">DoenetML: <c>$p1.doenetML</c></p>

  </section>

  <section name="s2" extend="$s1" />
  <section name="s3" copy="$s1" />

  
  <section name="s1a">
    <title>$s1.title</title>
    <p name="p1">Copy: $s1.ddml</p>
    <p name="p2">Copy, no link: <displayDoenetML copy="$s1.ddml" /></p>
    <p name="p3">Copy text: $s1.ddml.text</p>
    <p name="p4">Copy text, no link: <text copy="$s1.ddml.text" /></p>
  </section>

  <section name="s2a">
    <title>$s2.title</title>
    <p name="p1">Copy: $s2.ddml</p>
    <p name="p2">Copy, no link: <displayDoenetML copy="$s2.ddml" /></p>
    <p name="p3">Copy text: $s2.ddml.text</p>
    <p name="p4">Copy text, no link: <text copy="$s2.ddml.text" /></p>
  </section>

  <section name="s3a">
    <title>$s3.title</title>
    <p name="p1">Copy: $s3.ddml</p>
    <p name="p2">Copy, no link: <displayDoenetML copy="$s3.ddml" /></p>
    <p name="p3">Copy text: $s3.ddml.text</p>
    <p name="p4">Copy text, no link: <text copy="$s3.ddml.text" /></p>
  </section>


  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        for (let i = 1; i < 3; i++) {
            expect(
                stateVariables[await resolvePathToNodeIdx(`s${i}.ddml`)]
                    .stateValues.value,
            ).eq(`<text>hello!</text>`);
            expect(
                stateVariables[await resolvePathToNodeIdx(`s${i}.pd`)]
                    .stateValues.text,
            ).eq(`DoenetML: <p name="p1">A sentence</p>`);

            expect(
                stateVariables[await resolvePathToNodeIdx(`s${i}a.p1`)]
                    .stateValues.text,
            ).eq(`Copy: <text>hello!</text>`);
            expect(
                stateVariables[await resolvePathToNodeIdx(`s${i}a.p2`)]
                    .stateValues.text,
            ).eq(`Copy, no link: <text>hello!</text>`);
            expect(
                stateVariables[await resolvePathToNodeIdx(`s${i}a.p3`)]
                    .stateValues.text,
            ).eq(`Copy text: <text>hello!</text>`);
            expect(
                stateVariables[await resolvePathToNodeIdx(`s${i}a.p4`)]
                    .stateValues.text,
            ).eq(`Copy text, no link: <text>hello!</text>`);
        }
    });

    it("doenetML inside groups", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
        <group name='g'>
          <p name="p">Hello</p>
          <p><text extend="$p.doenetML" name="dml" /></p>
        </group>
        
        <text extend="$p.doenetML" name="pdml" />
        
        <group extend="$g" name="g2" >
          <p name="p2">Bye</p>
        </group>
        
        <text name="g2pdml" extend="$g2.p.doenetML" />
        <text name="g2p2dml" extend="$g2.p2.doenetML" />
  `,
        });

        let pdml = `<p name="p">Hello</p>`;
        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("dml")].stateValues.text,
        ).eq(pdml);
        expect(
            stateVariables[await resolvePathToNodeIdx("pdml")].stateValues.text,
        ).eq(pdml);
        expect(
            stateVariables[await resolvePathToNodeIdx("g2.dml")].stateValues
                .text,
        ).eq(pdml);
        expect(
            stateVariables[await resolvePathToNodeIdx("g2pdml")].stateValues
                .text,
        ).eq(pdml);
        expect(
            stateVariables[await resolvePathToNodeIdx("g2p2dml")].stateValues
                .text,
        ).eq(`<p name="p2">Bye</p>`);
    });

    it("doenetML of copySource shows the doenetML of the copy", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <section name="s1">
      <p name="p"><text>Hello</text></p>
      <p name="p2" extend="$p">
        <text>world</text>
      </p>
          
      <text name="pdml" extend="$p.doenetML" />
      <text name="p2dml" extend="$p2.doenetML" />
          
      <p><math name="m">x+x</math> <math name="m2" simplify extend="$m" /></p>
      <text name="mdml" extend="$m.doenetML" />
      <text name="m2dml" extend="$m2.doenetML" />
    </section>

    <section name="s2" extend="$s1" />
    <section name="s3" copy="$s1"  />
  `,
        });

        let pdml = `<p name="p"><text>Hello</text></p>`;
        let p2dml = `<p name="p2" extend="$p">\n  <text>world</text>\n</p>`;

        let mdml = `<math name="m">x+x</math>`;
        let m2dml = `<math name="m2" simplify extend="$m" />`;

        // check original

        let stateVariables = await core.returnAllStateVariables(false, true);

        for (let i = 1; i <= 3; i++) {
            expect(
                stateVariables[await resolvePathToNodeIdx(`s${i}.pdml`)]
                    .stateValues.text,
            ).eq(pdml);
            expect(
                stateVariables[await resolvePathToNodeIdx(`s${i}.p2dml`)]
                    .stateValues.text,
            ).eq(p2dml);
            expect(
                stateVariables[await resolvePathToNodeIdx(`s${i}.mdml`)]
                    .stateValues.text,
            ).eq(mdml);
            expect(
                stateVariables[await resolvePathToNodeIdx(`s${i}.m2dml`)]
                    .stateValues.text,
            ).eq(m2dml);
        }
    });

    it("doenetML of self-closing tags", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <section name="s1">
      <p name="p1"/>
      <p name="p2" />
      <p name="p3"
/>
      <p name="p4"
     
      />
          
      <text name="p1dml" extend="$p1.doenetML" />
      <text name="p2dml" extend="$p2.doenetML" />
      <text name="p3dml" extend="$p3.doenetML" />
      <text name="p4dml" extend="$p4.doenetML" />
    </section>

    <section name="s2" extend="$s1" />
    <section name="s3" copy="$s1" />
  `,
        });

        let p1dml = `<p name="p1"/>`;
        let p2dml = `<p name="p2" />`;
        let p3dml = `<p name="p3"
/>`;
        // TODO: not sure why it is eating the spaces after the new lines.
        // Do we care?
        let p4dml = `<p name="p4"

/>`;

        // check original

        let stateVariables = await core.returnAllStateVariables(false, true);

        for (let i = 1; i <= 3; i++) {
            expect(
                stateVariables[await resolvePathToNodeIdx(`s${i}.p1dml`)]
                    .stateValues.text,
            ).eq(p1dml);
            expect(
                stateVariables[await resolvePathToNodeIdx(`s${i}.p2dml`)]
                    .stateValues.text,
            ).eq(p2dml);
            expect(
                stateVariables[await resolvePathToNodeIdx(`s${i}.p3dml`)]
                    .stateValues.text,
            ).eq(p3dml);
            expect(
                stateVariables[await resolvePathToNodeIdx(`s${i}.p4dml`)]
                    .stateValues.text,
            ).eq(p4dml);
        }
    });

    it("doenetML with external copies", async () => {
        const externalDoenetMLs = {
            abcdef: `
        <section>
            <p name="p1">The <alert>DoenetML</alert> of a graph:</p>

            <p name="p2"><displayDoenetML>
            <graph>
                <point name="P" />
            </graph>
            </displayDoenetML></p>

            <p name="p3">The DoenetML of the p:</p>
            <p name="p4">$p1.doenetML</p>
        </section>`,
        };

        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <section name="s1">
      <section boxed copy="doenet:abcdef" name="external">
        <title>Copy in external</title>
      </section>

      <p name="p1">Grab the DoenetML from external p1:</p>
      <p name="p2">$external.p1.doenetML</p>
      
      <p name="p3">Grab the DoenetML from external p2:</p>
      <p name="p4">$external.p2.doenetML</p>

    </section>

    <section extend="$s1" name="s2" />

    <section copy="$s1" name="s3" />

`,
            externalDoenetMLs,
        });

        let theGraphDoenetML = `<graph>
    <point name="P" />
</graph>`;

        let pWithGraphDoenetML = `<p name="p2"><displayDoenetML>
${theGraphDoenetML}
</displayDoenetML></p>`;

        let stateVariables = await core.returnAllStateVariables(false, true);

        for (let i = 1; i <= 3; i++) {
            expect(
                stateVariables[await resolvePathToNodeIdx(`s${i}.external.p2`)]
                    .stateValues.text,
            ).eq(theGraphDoenetML);
            expect(
                stateVariables[await resolvePathToNodeIdx(`s${i}.external.p4`)]
                    .stateValues.text,
            ).eq(`<p name="p1">The <alert>DoenetML</alert> of a graph:</p>`);
            expect(
                stateVariables[await resolvePathToNodeIdx(`s${i}.p2`)]
                    .stateValues.text,
            ).eq(`<p name="p1">The <alert>DoenetML</alert> of a graph:</p>`);
            expect(
                stateVariables[await resolvePathToNodeIdx(`s${i}.p4`)]
                    .stateValues.text,
            ).eq(pWithGraphDoenetML);
        }
    });
});
