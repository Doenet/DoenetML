import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("DoenetML text tests", async () => {
    it("doenetML state variable", async () => {
        let core = await createTestCore({
            doenetML: `
        <p name="theP">
          Did you know that
          <math name="m">1 + 1</math>
          =
          $m{simplify}?
        </p>
      
        <pre name="theDoenetML">$theP.doenetML</pre>
      
  `,
        });

        let thePDoenetML = `<p name="theP">
  Did you know that
  <math name="m">1 + 1</math>
  =
  $m{simplify}?
</p>`;

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/theP"].stateValues.text).eq(`
          Did you know that
          1 + 1
          =
          2?
        `);
        expect(stateVariables["/theP"].stateValues.doenetML).eqls(thePDoenetML);

        let preChild =
            stateVariables["/theDoenetML"].activeChildren[0].componentIdx;
        expect(stateVariables[preChild].stateValues.value).eqls(thePDoenetML);
    });

    it("doenetML from displayDoenetML", async () => {
        let core = await createTestCore({
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
        expect(stateVariables["/ddml1"].stateValues.value).eq(thePDoenetML);
        expect(stateVariables["/ddml1"].stateValues.text).eq(thePDoenetML);
        expect(stateVariables["/ddml2"].stateValues.value).eq(
            "String with no space.",
        );
        expect(stateVariables["/ddml3"].stateValues.value).eq("$f");
        expect(stateVariables["/pMacro"].stateValues.text).eq(
            "This is a macro: $f.",
        );
    });

    it("doenetML from displayDoenetML, remove preceding spacing in pre", async () => {
        let core = await createTestCore({
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
        expect(stateVariables["/ddml1"].stateValues.value).eq(theDoenetML1);
        expect(stateVariables["/ddml1"].stateValues.text).eq(theDoenetML1);
        expect(stateVariables["/ddml2"].stateValues.value).eq(theDoenetML2);
        expect(stateVariables["/ddml2"].stateValues.text).eq(theDoenetML2);
        expect(stateVariables["/ddml3"].stateValues.value).eq(theDoenetML3);
        expect(stateVariables["/ddml3"].stateValues.text).eq(theDoenetML3);
    });

    // Note: copying a <displayDoenetML> directly with link="false" no longer works,
    // given changes made to make the following work:
    // "doenetML of copySource shows the doenetML of the copy" (see below)
    // We could work to fix it if there is a compelling reason to do so.
    it("copying displayDoenetML, with or without linking", async () => {
        let core = await createTestCore({
            doenetML: `
  <section name="s1" newNamespace>
    <pre><displayDoenetML name="ddml">
      <text>hello!</text>
    </displayDoenetML></pre>

    <p name="p1">A sentence</p>

    <p name="pd">DoenetML: <c>$p1.doenetML</c></p>

  </section>

  <section name="s2" copySource="s1" />
  $s1{name="s3"}
  <section name="s4" copySource="s1" link="false" />
  $s1{name="s5" link="false"}

  
  <section name="s1a" newNamespace>
    <title>$(/s1.title)</title>
    <p name="p1">Copy: $(/s1/ddml)</p>
    <!--<p name="p2">Copy, no link: $(/s1/ddml{link="false"})</p>-->
    <p name="p3">Copy text: $(/s1/ddml.text)</p>
    <p name="p4">Copy text, no link: $(/s1/ddml.text{link="false"})</p>
  </section>

  <section name="s2a" newNamespace>
    <title>$(/s2.title)</title>
    <p name="p1">Copy: $(/s2/ddml)</p>
    <!--<p name="p2">Copy, no link: $(/s2/ddml{link="false"})</p>-->
    <p name="p3">Copy text: $(/s2/ddml.text)</p>
    <p name="p4">Copy text, no link: $(/s2/ddml.text{link="false"})</p>
  </section>

  <section name="s3a" newNamespace>
    <title>$(/s3.title)</title>
    <p name="p1">Copy: $(/s3/ddml)</p>
    <!--<p name="p2">Copy, no link: $(/s3/ddml{link="false"})</p>-->
    <p name="p3">Copy text: $(/s3/ddml.text)</p>
    <p name="p4">Copy text, no link: $(/s3/ddml.text{link="false"})</p>
  </section>

  <section name="s4a" newNamespace>
    <title>$(/s4.title)</title>
    <p name="p1">Copy: $(/s4/ddml)</p>
    <!--<p name="p2">Copy, no link: $(/s4/ddml{link="false"})</p>-->
    <p name="p3">Copy text: $(/s4/ddml.text)</p>
    <p name="p4">Copy text, no link: $(/s4/ddml.text{link="false"})</p>
  </section>

  <section name="s5a" newNamespace>
    <title>$(/s5.title)</title>
    <p name="p1">Copy: $(/s5/ddml)</p>
    <!--<p name="p2">Copy, no link: $(/s5/ddml{link="false"})</p>-->
    <p name="p3">Copy text: $(/s5/ddml.text)</p>
    <p name="p4">Copy text, no link: $(/s5/ddml.text{link="false"})</p>
  </section>

  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        for (let i = 1; i < 5; i++) {
            expect(stateVariables[`/s${i}/ddml`].stateValues.value).eq(
                `<text>hello!</text>`,
            );
            expect(stateVariables[`/s${i}/pd`].stateValues.text).eq(
                `DoenetML: <p name="p1">A sentence</p>`,
            );

            expect(stateVariables[`/s${i}a/p1`].stateValues.text).eq(
                `Copy: <text>hello!</text>`,
            );
            // expect(stateVariables[`/s${i}a/p2`].stateValues.text).eq(
            //     `Copy, no link: <text>hello!</text>`,
            // );
            expect(stateVariables[`/s${i}a/p3`].stateValues.text).eq(
                `Copy text: <text>hello!</text>`,
            );
            expect(stateVariables[`/s${i}a/p4`].stateValues.text).eq(
                `Copy text, no link: <text>hello!</text>`,
            );
        }
    });

    it("doenetML inside groups", async () => {
        let core = await createTestCore({
            doenetML: `
        <group name='g'>
          <p name="p">Hello</p>
          <p><text copySource="p.doenetML" name="dml" /></p>
        </group>
        
        <text copySource="p.doenetML" name="pdml" />
        
        <group copySource="g" newNamespace name="g2" >
          <p name="p2">Bye</p>
        </group>
        
        <text name="g2pdml" copySource="g2/p.doenetML" />
        <text name="g2p2dml" copySource="g2/p2.doenetML" />
  `,
        });

        let pdml = `<p name="p">Hello</p>`;
        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/dml"].stateValues.text).eq(pdml);
        expect(stateVariables["/pdml"].stateValues.text).eq(pdml);
        expect(stateVariables["/g2/dml"].stateValues.text).eq(pdml);
        expect(stateVariables["/g2pdml"].stateValues.text).eq(pdml);
        expect(stateVariables["/g2p2dml"].stateValues.text).eq(
            `<p name="p2">Bye</p>`,
        );
    });

    it("doenetML of copySource shows the doenetML of the copy", async () => {
        let core = await createTestCore({
            doenetML: `
    <section name="s1" newNamespace>
      <p name="p"><text>Hello</text></p>
      <p name="p2" copySource="p">
        <text>world</text>
      </p>
          
      <text name="pdml" copySource="p.doenetML" />
      <text name="p2dml" copySource="p2.doenetML" />
          
      <p><math name="m">x+x</math> <math name="m2" simplify copySource="m" /></p>
      <text name="mdml" copySource="m.doenetML" />
      <text name="m2dml" copySource="m2.doenetML" />
    </section>

    <section name="s2" copySource="s1" />
    <section name="s3" copySource="s1" link="false" />
  `,
        });

        let pdml = `<p name="p"><text>Hello</text></p>`;
        let p2dml = `<p name="p2" copySource="p">\n  <text>world</text>\n</p>`;

        let mdml = `<math name="m">x+x</math>`;
        let m2dml = `<math name="m2" simplify copySource="m" />`;

        // check original

        let stateVariables = await core.returnAllStateVariables(false, true);

        for (let i = 1; i <= 3; i++) {
            expect(stateVariables[`/s${i}/pdml`].stateValues.text).eq(pdml);
            expect(stateVariables[`/s${i}/p2dml`].stateValues.text).eq(p2dml);
            expect(stateVariables[`/s${i}/mdml`].stateValues.text).eq(mdml);
            expect(stateVariables[`/s${i}/m2dml`].stateValues.text).eq(m2dml);
        }
    });

    it("doenetML of self-closing tags", async () => {
        let core = await createTestCore({
            doenetML: `
    <section name="s1" newNamespace>
      <p name="p1"/>
      <p name="p2" />
      <p name="p3"
/>
      <p name="p4"
     
      />
          
      <text name="p1dml" copySource="p1.doenetML" />
      <text name="p2dml" copySource="p2.doenetML" />
      <text name="p3dml" copySource="p3.doenetML" />
      <text name="p4dml" copySource="p4.doenetML" />
    </section>

    <section name="s2" copySource="s1" />
    <section name="s3" copySource="s1" link="false" />
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
            expect(stateVariables[`/s${i}/p1dml`].stateValues.text).eq(p1dml);
            expect(stateVariables[`/s${i}/p2dml`].stateValues.text).eq(p2dml);
            expect(stateVariables[`/s${i}/p3dml`].stateValues.text).eq(p3dml);
            expect(stateVariables[`/s${i}/p4dml`].stateValues.text).eq(p4dml);
        }
    });
});
