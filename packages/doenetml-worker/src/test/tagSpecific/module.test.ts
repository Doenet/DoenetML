import { describe, expect, it, vi } from "vitest";
import { createTestCore, returnAllStateVariables } from "../utils/test-core";
import { cleanLatex } from "../utils/math";
import {
    movePoint,
    submitAnswer,
    updateMathInputValue,
    updateTextInputValue,
} from "../utils/actions";
import { widthsBySize } from "@doenet/utils";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);

describe("Module tag tests", async () => {
    it("module with sentence", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p1"><module name="m">
      <setup>
        <customAttribute componentType="text" attribute="item" defaultValue="who?" assignNames="item" />
      </setup>
      Hello $item!
    </module>
    </p>

    <p name="p2">Hello $item!</p>

    <p name="p3">$m{item="plant"}</p>

    <p><textInput name="item2" prefill="animal" /></p>
    <p name="p4">$m{item="$item2"}</p>
    <p name="p5">$m</p>

    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p1"].stateValues.text).contain("Hello who?!");
        expect(stateVariables["/p2"].stateValues.text).contain("Hello who?!");
        expect(stateVariables["/p3"].stateValues.text).contain("Hello plant!");
        expect(stateVariables["/p4"].stateValues.text).contain("Hello animal!");
        expect(stateVariables["/p5"].stateValues.text).contain("Hello who?!");

        await updateTextInputValue({ text: "rock", name: "/item2", core });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/p4"].stateValues.text).contain("Hello rock!");
        expect(stateVariables["/p1"].stateValues.text).contain("Hello who?!");
        expect(stateVariables["/p2"].stateValues.text).contain("Hello who?!");
        expect(stateVariables["/p3"].stateValues.text).contain("Hello plant!");
        expect(stateVariables["/p5"].stateValues.text).contain("Hello who?!");
    });

    it("module with sentence, newnamespace", async () => {
        let core = await createTestCore({
            doenetML: `
    <module name="m" newNamespace>
      <setup>
        <customAttribute componentType="text" attribute="item" defaultValue="who?" assignNames="item" />
      </setup>
      <p name="p">Hello $item!</p>
    </module>

    <p name="p2">Hello $(m/item)!</p>

    $m{item="plant" name="m2"}
    <p><textInput name="item" prefill="animal" /></p>
    $m{item="$item" name="m3"}
    $m{name="m4"}
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/m/p"].stateValues.text).eq("Hello who?!");
        expect(stateVariables["/p2"].stateValues.text).eq("Hello who?!");
        expect(stateVariables["/m2/p"].stateValues.text).eq("Hello plant!");
        expect(stateVariables["/m3/p"].stateValues.text).eq("Hello animal!");
        expect(stateVariables["/m4/p"].stateValues.text).eq("Hello who?!");

        await updateTextInputValue({ text: "rock", name: "/item", core });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/m3/p"].stateValues.text).eq("Hello rock!");
        expect(stateVariables["/m/p"].stateValues.text).eq("Hello who?!");
        expect(stateVariables["/p2"].stateValues.text).eq("Hello who?!");
        expect(stateVariables["/m2/p"].stateValues.text).eq("Hello plant!");
        expect(stateVariables["/m4/p"].stateValues.text).eq("Hello who?!");
    });

    it("module with sentence, nested newnamespaces", async () => {
        let core = await createTestCore({
            doenetML: `
    <module name="m" newNamespace>
      <setup newNamespace name="mads">
        <customAttribute componentType="text" attribute="item" defaultValue="who?" assignNames="item" />
      </setup>
      <p name="p">Hello $(mads/item)!</p>
    </module>

    <p name="p2">Hello $(m/mads/item)!</p>

    $m{item="plant" name="m2"}
    <p><textInput name="item" prefill="animal" /></p>
    $m{item="$item" name="m3"}
    $m{name="m4"}
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/m/p"].stateValues.text).eq("Hello who?!");
        expect(stateVariables["/p2"].stateValues.text).eq("Hello who?!");
        expect(stateVariables["/m2/p"].stateValues.text).eq("Hello plant!");
        expect(stateVariables["/m3/p"].stateValues.text).eq("Hello animal!");
        expect(stateVariables["/m4/p"].stateValues.text).eq("Hello who?!");

        await updateTextInputValue({ text: "rock", name: "/item", core });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/m3/p"].stateValues.text).eq("Hello rock!");
        expect(stateVariables["/m/p"].stateValues.text).eq("Hello who?!");
        expect(stateVariables["/p2"].stateValues.text).eq("Hello who?!");
        expect(stateVariables["/m2/p"].stateValues.text).eq("Hello plant!");
        expect(stateVariables["/m4/p"].stateValues.text).eq("Hello who?!");
    });

    it("module with sentence, triple nested newnamespaces", async () => {
        let core = await createTestCore({
            doenetML: `
    <module name="m" newNamespace>
      <setup newNamespace name="mads">
        <customAttribute componentType="text" attribute="item" defaultValue="who?" assignNames="item" newNamespace name="ma" />
      </setup>
      <p name="p">Hello $(mads/ma/item)!</p>
    </module>

    <p name="p2">Hello $(m/mads/ma/item)!</p>

    $m{item="plant" name="m2"}
    <p><textInput name="item" prefill="animal" /></p>
    $m{item="$item" name="m3"}
    $m{name="m4"}
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/m/p"].stateValues.text).eq("Hello who?!");
        expect(stateVariables["/p2"].stateValues.text).eq("Hello who?!");
        expect(stateVariables["/m2/p"].stateValues.text).eq("Hello plant!");
        expect(stateVariables["/m3/p"].stateValues.text).eq("Hello animal!");
        expect(stateVariables["/m4/p"].stateValues.text).eq("Hello who?!");

        await updateTextInputValue({ text: "rock", name: "/item", core });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/m3/p"].stateValues.text).eq("Hello rock!");
        expect(stateVariables["/m/p"].stateValues.text).eq("Hello who?!");
        expect(stateVariables["/p2"].stateValues.text).eq("Hello who?!");
        expect(stateVariables["/m2/p"].stateValues.text).eq("Hello plant!");
        expect(stateVariables["/m4/p"].stateValues.text).eq("Hello who?!");
    });
    it("module with graph, newnamespace", async () => {
        let core = await createTestCore({
            doenetML: `
    <module name="m" newNamespace>
      <setup>
        <customAttribute componentType="math" attribute="x" defaultValue="3" assignNames="pointX" />
        <customAttribute componentType="math" attribute="y" defaultValue="5" assignNames="pointY" />
        <customAttribute componentType="text" attribute="size" defaultValue="medium" assignNames="graphSize" />
        <customAttribute componentType="number" attribute="aspectRatio" defaultValue="300px" assignNames="graphAspectRatio" />
      </setup>
      <graph size="$graphSize" aspectRatio="$graphAspectRatio" name="g">
        <point name="p" x="$pointX" y="$pointY" />
      </graph>
      <p>Point coords:
        <mathInput name="x2" bindValueTo="$(p.x)" />
        <mathInput name="y2" bindValueTo="$(p.y)" />
      </p>
    </module>

    <p>Point coords: <mathInput name="x" prefill="7" /> <mathInput name="y" prefill='-7' /></p>
    <p>Graph size: <textInput name="s" prefill="small" /> <mathInput name="ar" prefill="1/2" /></p>
    
    $m{x="$x" y="$y" size="$s" aspectRatio="$ar" name="m2"}
    `,
        });

        async function check_items({
            p1,
            p2,
            size,
            ar,
        }: {
            p1: number[];
            p2: number[];
            size: string;
            ar: number;
        }) {
            let stateVariables = await returnAllStateVariables(core);
            expect(stateVariables["/m/g"].stateValues.size).eq("medium");
            expect(stateVariables["/m/g"].stateValues.width.size).eq(
                widthsBySize["medium"],
            );
            expect(stateVariables["/m/g"].stateValues.aspectRatio).eq(1);
            expect(
                stateVariables["/m/p"].stateValues.xs.map((v) => v.tree),
            ).eqls(p1);
            expect(stateVariables["/m2/g"].stateValues.size).eq(size);
            expect(stateVariables["/m2/g"].stateValues.width.size).eq(
                widthsBySize[size],
            );
            expect(stateVariables["/m2/g"].stateValues.aspectRatio).eq(ar);
            expect(
                stateVariables["/m2/p"].stateValues.xs.map((v) => v.tree),
            ).eqls(p2);
        }

        let p1 = [3, 5];
        let p2 = [7, -7];
        let size = "small";
        let ar = 0.5;

        await check_items({ p1, p2, size, ar });

        p1 = [-6, 9];
        await updateMathInputValue({
            latex: p1[0].toString(),
            name: "/m/x2",
            core,
        });
        await updateMathInputValue({
            latex: p1[1].toString(),
            name: "/m/y2",
            core,
        });
        await check_items({ p1, p2, size, ar });

        p2 = [1, 2];
        size = "large";
        ar = 3 / 2;
        await updateMathInputValue({
            latex: p2[0].toString(),
            name: "/x",
            core,
        });
        await updateMathInputValue({
            latex: p2[1].toString(),
            name: "/y",
            core,
        });
        await updateTextInputValue({ text: size, name: "/s", core });
        await updateMathInputValue({ latex: "3/2", name: "/ar", core });
        await check_items({ p1, p2, size, ar });

        p2 = [-3, 4];

        await updateMathInputValue({
            latex: p2[0].toString(),
            name: "/m2/x2",
            core,
        });
        await updateMathInputValue({
            latex: p2[1].toString(),
            name: "/m2/y2",
            core,
        });
        await check_items({ p1, p2, size, ar });

        p1 = [-8, 9];
        await movePoint({ name: "/m/p", x: p1[0], y: p1[1], core });
        await check_items({ p1, p2, size, ar });

        p2 = [6, -10];
        await movePoint({ name: "/m2/p", x: p2[0], y: p2[1], core });
        await check_items({ p1, p2, size, ar });
    });

    it("module inside a module", async () => {
        let core = await createTestCore({
            doenetML: `
    <module name="m" newNamespace>
      <setup>
        <customAttribute componentType="math" attribute="x" defaultValue="3" assignNames="pointX" />
        <customAttribute componentType="math" attribute="y" defaultValue="5" assignNames="pointY" />
      </setup>
      <graph>
        <point name="p" x="$pointX" y="$pointY" />
      </graph>
    </module>

    <module name="n" newNamespace>
      <setup>
        <customAttribute componentType="math" attribute="u" defaultValue="1" assignNames="u" />
        <customAttribute componentType="math" attribute="v" defaultValue="-2" assignNames="v" />
      </setup>
      <graph>
        <point name="p" x="$u" y="$v" />
      </graph>
      <math name="vfixed" modifyIndirectly="false" hide>$v</math>
      $(../m{x="$u+$vfixed" y="9" name="m"})
      
    </module>

    <p>Point coords: <mathInput name="x" prefill="7" /> <mathInput name="y" prefill='-7' /></p>
    $n{u="$x" v="$y" name="n2"}

    `,
        });

        async function check_items({
            mx,
            my,
            nx,
            ny,
            nmy,
            n2x,
            n2y,
            n2my,
        }: {
            mx: number;
            my: number;
            nx: number;
            ny: number;
            nmy: number;
            n2x: number;
            n2y: number;
            n2my: number;
        }) {
            const stateVariables = await returnAllStateVariables(core);
            expect(
                stateVariables["/m/p"].stateValues.xs.map((v) => v.tree),
            ).eqls([mx, my]);
            expect(
                stateVariables["/n/p"].stateValues.xs.map((v) => v.tree),
            ).eqls([nx, ny]);
            expect(
                stateVariables["/n/m/p"].stateValues.xs.map((v) => v.tree),
            ).eqls([nx + ny, nmy]);
            expect(
                stateVariables["/n2/p"].stateValues.xs.map((v) => v.tree),
            ).eqls([n2x, n2y]);
            expect(
                stateVariables["/n2/m/p"].stateValues.xs.map((v) => v.tree),
            ).eqls([n2x + n2y, n2my]);
        }

        let mx = 3;
        let my = 5;
        let nx = 1;
        let ny = -2;
        let nmy = 9;
        let n2x = 7;
        let n2y = -7;
        let n2my = 9;

        await check_items({ mx, my, nx, ny, nmy, n2x, n2y, n2my });

        n2x = -6;
        n2y = 8;
        await updateMathInputValue({ latex: n2x.toString(), name: "/x", core });
        await updateMathInputValue({ latex: n2y.toString(), name: "/y", core });
        await check_items({ mx, my, nx, ny, nmy, n2x, n2y, n2my });

        mx = -2;
        my = -4;
        await movePoint({ name: "/m/p", x: mx, y: my, core });
        await check_items({ mx, my, nx, ny, nmy, n2x, n2y, n2my });

        nx = 7;
        ny = -3;
        await movePoint({ name: "/n/p", x: nx, y: ny, core });
        await check_items({ mx, my, nx, ny, nmy, n2x, n2y, n2my });

        nx = -2;
        nmy = -7;
        await movePoint({ name: "/n/m/p", x: nx + ny, y: nmy, core });
        await check_items({ mx, my, nx, ny, nmy, n2x, n2y, n2my });

        n2x = 4;
        n2y = 5;
        await movePoint({ name: "/n2/p", x: n2x, y: n2y, core });
        await check_items({ mx, my, nx, ny, nmy, n2x, n2y, n2my });

        n2x = -10;
        n2my = -6;
        await movePoint({ name: "/n2/m/p", x: n2x + n2y, y: n2my, core });
        await check_items({ mx, my, nx, ny, nmy, n2x, n2y, n2my });
    });

    it("apply sugar in module attributes", async () => {
        let core = await createTestCore({
            doenetML: `
    <module name="m" newNamespace>
      <setup>
        <customAttribute componentType="point" attribute="P" defaultValue="(1,2)" assignNames="P" />
      </setup>
      <p>Point: $P{name="p"}</p>
    </module>
    
    $m{P="(3,4)" name="m2"}

    <graph>
      <point name="Q">(5,6)</point>
    </graph>
    $m{P="$Q" name="m3"}
    

    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/m/p"].stateValues.xs.map((v) => v.tree)).eqls([
            1, 2,
        ]);
        expect(stateVariables["/m2/p"].stateValues.xs.map((v) => v.tree)).eqls([
            3, 4,
        ]);
        expect(stateVariables["/m3/p"].stateValues.xs.map((v) => v.tree)).eqls([
            5, 6,
        ]);

        await movePoint({ name: "/Q", x: 7, y: 8, core });
        expect(stateVariables["/m3/p"].stateValues.xs.map((v) => v.tree)).eqls([
            7, 8,
        ]);
    });

    it("invalid attributes ignored in module", async () => {
        // disabled is already an attribute on all components, so we can't add a custom attribute with that name
        let core = await createTestCore({
            doenetML: `
    <module name='m' newNamespace>
      <setup>
        <customAttribute componentType="boolean" attribute="disabled" defaultValue="true" assignNames="disabled" />
      </setup>
      <p name="p">Disabled? $disabled</p>
    </module>
    
    $m{name="m1"}
    $m{disabled="true" name="m2"}
    $m{disabled="false" name="m3"}
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/m/p"].stateValues.text).eq("Disabled? ");
        expect(stateVariables["/m1/p"].stateValues.text).eq("Disabled? ");
        expect(stateVariables["/m2/p"].stateValues.text).eq("Disabled? ");
        expect(stateVariables["/m3/p"].stateValues.text).eq("Disabled? ");

        let errorWarnings = core.errorWarnings;
        expect(errorWarnings.errors.length).eq(0);
        expect(errorWarnings.warnings.length).eq(4);
        for (let i = 0; i < 4; i++) {
            expect(errorWarnings.warnings[i].message).contain(
                `Cannot add attribute "disabled" to a <module> because the <module> component type already has a "disabled" attribute defined`,
            );
        }
    });

    it("handle error in custom attributes", async () => {
        let core = await createTestCore({
            doenetML: `
    <module name='m'>
      <setup>
        <customAttribute componentType="boolean" attribute="a1" defaultValue="true" assignNames="duplicate" />
        
        <customAttribute componentType="text" attribute="a2" defaultValue="yes" assignNames="duplicate" />
      </setup>
    </module>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        let errorChild =
            stateVariables[
                stateVariables["/_document1"].activeChildren[0].componentName
            ];
        expect(errorChild.componentType).eq("_error");
        expect(errorChild.stateValues.message).eq(
            "Duplicate component name: duplicate.",
        );

        let errorWarnings = core.errorWarnings;

        expect(errorWarnings.errors.length).eq(1);
        expect(errorWarnings.warnings.length).eq(0);

        expect(errorWarnings.errors[0].message).contain(
            "Duplicate component name: duplicate",
        );
        expect(errorWarnings.errors[0].doenetMLrange.lineBegin).eq(6);
        expect(errorWarnings.errors[0].doenetMLrange.charBegin).eq(9);
        expect(errorWarnings.errors[0].doenetMLrange.lineEnd).eq(6);
        expect(errorWarnings.errors[0].doenetMLrange.charEnd).eq(106);
    });

    it("warnings in custom attributes", async () => {
        let core = await createTestCore({
            doenetML: `
    <module name='m' newNamespace>
      <setup>
        <customAttribute componentType="boolean" defaultValue="true" attribute="disabled" assignNames="disabled" />
        
        <customAttribute componentType="bad" defaultValue="yes" attribute="a" assignNames="a" />

        <customAttribute componentType="text" attribute="b" assignNames="b" />

        <customAttribute />

      </setup>

      <customAttribute componentType="boolean" defaultValue="true" attribute="outside" assignNames="outside" />
    
      <p name="p">b: $b</p>
    </module>

    <module copySource="m" b="hello" name="m1" />
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/m/p"].stateValues.text).eq("b: ");
        expect(stateVariables["/m1/p"].stateValues.text).eq("b: hello");

        let errorWarnings = core.errorWarnings;

        expect(errorWarnings.errors.length).eq(0);
        expect(errorWarnings.warnings.length).eq(9);

        expect(errorWarnings.warnings[0].message).contain(
            "Could not create <customAttribute>. It must be inside a <setup> component that is inside a <module> or similar component",
        );
        expect(errorWarnings.warnings[0].level).eq(1);
        expect(errorWarnings.warnings[0].doenetMLrange.lineBegin).eq(14);
        expect(errorWarnings.warnings[0].doenetMLrange.charBegin).eq(7);
        expect(errorWarnings.warnings[0].doenetMLrange.lineEnd).eq(14);
        expect(errorWarnings.warnings[0].doenetMLrange.charEnd).eq(111);

        expect(errorWarnings.warnings[1].message).contain(
            "Could not create <customAttribute>. It must be inside a <setup> component that is inside a <module> or similar component",
        );
        expect(errorWarnings.warnings[1].level).eq(1);
        expect(errorWarnings.warnings[1].doenetMLrange.lineBegin).eq(14);
        expect(errorWarnings.warnings[1].doenetMLrange.charBegin).eq(7);
        expect(errorWarnings.warnings[1].doenetMLrange.lineEnd).eq(14);
        expect(errorWarnings.warnings[1].doenetMLrange.charEnd).eq(111);

        expect(errorWarnings.warnings[2].message).contain(
            `Cannot add attribute "disabled" to a <module> because the <module> component type already has a "disabled" attribute defined`,
        );
        expect(errorWarnings.warnings[2].level).eq(1);
        expect(errorWarnings.warnings[2].doenetMLrange.lineBegin).eq(4);
        expect(errorWarnings.warnings[2].doenetMLrange.charBegin).eq(9);
        expect(errorWarnings.warnings[2].doenetMLrange.lineEnd).eq(4);
        expect(errorWarnings.warnings[2].doenetMLrange.charEnd).eq(115);

        expect(errorWarnings.warnings[3].message).contain(
            "<customAttribute> contains an invalid component type: <bad>",
        );
        expect(errorWarnings.warnings[3].level).eq(1);
        expect(errorWarnings.warnings[3].doenetMLrange.lineBegin).eq(6);
        expect(errorWarnings.warnings[3].doenetMLrange.charBegin).eq(9);
        expect(errorWarnings.warnings[3].doenetMLrange.lineEnd).eq(6);
        expect(errorWarnings.warnings[3].doenetMLrange.charEnd).eq(96);

        expect(errorWarnings.warnings[4].message).contain(
            `Since a default value was not supplied for <customAttribute> with attribute="b", it will not be created unless a value is specified`,
        );
        expect(errorWarnings.warnings[4].level).eq(1);
        expect(errorWarnings.warnings[4].doenetMLrange.lineBegin).eq(8);
        expect(errorWarnings.warnings[4].doenetMLrange.charBegin).eq(9);
        expect(errorWarnings.warnings[4].doenetMLrange.lineEnd).eq(8);
        expect(errorWarnings.warnings[4].doenetMLrange.charEnd).eq(78);

        expect(errorWarnings.warnings[5].message).contain(
            `<customAttribute> must contain a componentType attribute`,
        );
        expect(errorWarnings.warnings[5].level).eq(1);
        expect(errorWarnings.warnings[5].doenetMLrange.lineBegin).eq(10);
        expect(errorWarnings.warnings[5].doenetMLrange.charBegin).eq(9);
        expect(errorWarnings.warnings[5].doenetMLrange.lineEnd).eq(10);
        expect(errorWarnings.warnings[5].doenetMLrange.charEnd).eq(27);

        expect(errorWarnings.warnings[6].message).contain(
            `Cannot add attribute "disabled" to a <module> because the <module> component type already has a "disabled" attribute defined`,
        );
        expect(errorWarnings.warnings[6].level).eq(1);
        expect(errorWarnings.warnings[6].doenetMLrange.lineBegin).eq(4);
        expect(errorWarnings.warnings[6].doenetMLrange.charBegin).eq(9);
        expect(errorWarnings.warnings[6].doenetMLrange.lineEnd).eq(4);
        expect(errorWarnings.warnings[6].doenetMLrange.charEnd).eq(115);

        expect(errorWarnings.warnings[7].message).contain(
            "<customAttribute> contains an invalid component type: <bad>",
        );
        expect(errorWarnings.warnings[7].level).eq(1);
        expect(errorWarnings.warnings[7].doenetMLrange.lineBegin).eq(6);
        expect(errorWarnings.warnings[7].doenetMLrange.charBegin).eq(9);
        expect(errorWarnings.warnings[7].doenetMLrange.lineEnd).eq(6);
        expect(errorWarnings.warnings[7].doenetMLrange.charEnd).eq(96);

        expect(errorWarnings.warnings[8].message).contain(
            `<customAttribute> must contain a componentType attribute`,
        );
        expect(errorWarnings.warnings[8].level).eq(1);
        expect(errorWarnings.warnings[8].doenetMLrange.lineBegin).eq(10);
        expect(errorWarnings.warnings[8].doenetMLrange.charBegin).eq(9);
        expect(errorWarnings.warnings[8].doenetMLrange.lineEnd).eq(10);
        expect(errorWarnings.warnings[8].doenetMLrange.charEnd).eq(27);
    });

    it("copy module and overwrite attribute values", async () => {
        let core = await createTestCore({
            doenetML: `
    <module name="md" newNamespace>
      <setup>
        <customAttribute attribute="n" componentType="number" defaultValue="2" assignNames="n" />
        <customAttribute attribute="m" componentType="number" defaultValue="1" assignNames="m" />
      </setup>
      <p name="p1">The first number is $m; the second number is $n.</p>
      <p name="p2">Next value? <mathInput name="q" />  OK $q{name="q2"} it is.</p>
    </module>
    
    $md{name="md1"}
    $md1{n="10" name="md2"}
    $md2{m="100" name="md3"}
    $md3{n="0" name="md4"}

    $md{m="13" n="17" name="md5"}
    $md5{m="" n="a" name="md6"}
    $md6{m="3" n="4" name="md7"}

    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/md/p1"].stateValues.text).eq(
            "The first number is 1; the second number is 2.",
        );
        expect(stateVariables["/md1/p1"].stateValues.text).eq(
            "The first number is 1; the second number is 2.",
        );
        expect(stateVariables["/md2/p1"].stateValues.text).eq(
            "The first number is 1; the second number is 10.",
        );
        expect(stateVariables["/md3/p1"].stateValues.text).eq(
            "The first number is 100; the second number is 10.",
        );
        expect(stateVariables["/md4/p1"].stateValues.text).eq(
            "The first number is 100; the second number is 0.",
        );
        expect(stateVariables["/md5/p1"].stateValues.text).eq(
            "The first number is 13; the second number is 17.",
        );
        expect(stateVariables["/md6/p1"].stateValues.text).eq(
            "The first number is NaN; the second number is NaN.",
        );
        expect(stateVariables["/md7/p1"].stateValues.text).eq(
            "The first number is 3; the second number is 4.",
        );

        for (let i = 0; i <= 7; i++) {
            expect(
                stateVariables[`/md${i || ""}/q2`].stateValues.value.tree,
            ).eq("\uff3f");
        }

        let qs = ["x", "y", "z", "u", "v", "w", "s", "t"];

        for (let [i, v] of qs.entries()) {
            await updateMathInputValue({
                latex: v,
                name: `/md${i || ""}/q`,
                core,
            });
        }

        stateVariables = await returnAllStateVariables(core);
        for (let [i, v] of qs.entries()) {
            expect(
                stateVariables[`/md${i || ""}/q2`].stateValues.value.tree,
            ).eq(v);
        }
    });

    it("copy sourcesAreResponses with parent namespace target", async () => {
        let core = await createTestCore({
            doenetML: `
    <setup>
      <module name="mod" newNamespace>
        <setup>
          <customAttribute componentType="text" attribute="title" defaultValue="Find point" assignNames="title" />
          <customAttribute componentType="math" attribute="initialx" defaultValue="0" assignNames="initialx" />
          <customAttribute componentType="math" attribute="initialy" defaultValue="0" assignNames="initialy" />
          <customAttribute componentType="math" attribute="goalx" defaultValue="3" assignNames="goalx" />
          <customAttribute componentType="math" attribute="goaly" defaultValue="4" assignNames="goaly" />
          <customAttribute componentType="_componentSize" attribute="width" defaultValue="300px" assignNames="width" />
          <customAttribute componentType="number" attribute="aspectRatio" defaultValue="1" assignNames="aspectRatio" />
        </setup>
      
        <problem name="prob"><title>$title</title>
      
          <p>Move the point to <m name="m1">($goalx, $goaly)</m>.</p>
          <graph width="$width" aspectRatio="$aspectRatio">
            <point x="$(initialx{link='false'})" y="$(initialy{link='false'})" name="P">
              <constraints>
                <attractTo><point x="$goalx" y="$goaly" ></point></attractTo>
              </constraints>
            </point>
          </graph>
      
          <answer name="ans" newNamespace>
            <award sourcesAreResponses="../P">
              <when>
                $(../P) = ($(../goalx), $(../goaly))
              </when>
            </award>
          </answer>
        </problem>
      </module>
    </setup>


    <section><title>First one</title>
    $mod{name="m1"}

    <p>Submitted response for problem 1: <math name="sr1">$(m1/ans.submittedResponse)</math></p>
    <p>Credit for problem 1: $(m1/prob.creditAchieved{assignNames="ca1"})</p>
    </section>

    <section><title>Second one</title>

    <p>Now, let's use initial point <m name="coordsa">(<math name="xa">-3</math>, <math name="ya">3</math>)</m> and the goal point <m name="coordsb">(<math name="xb">7</math>, <math name="yb">-5</math>)</m> </p>

    
    $mod{title="Find point again" goalX="$xb" GoaLy="$yb" initialX="$xa" initialy="$ya" width="200px" aspectRatio="1" name="m2"}
    <p>Submitted response for problem 2: <math name="sr2">$(m2/ans.submittedResponse)</math></p>
    <p>Credit for problem 2: $(m2/prob.creditAchieved{assignNames="ca2"})</p>
    </section>

    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/m1/m1"].stateValues.latex)).eq(
            "(3,4)",
        );
        expect(cleanLatex(stateVariables["/coordsa"].stateValues.latex)).eq(
            "(-3,3)",
        );
        expect(cleanLatex(stateVariables["/coordsb"].stateValues.latex)).eq(
            "(7,-5)",
        );
        expect(cleanLatex(stateVariables["/m2/m1"].stateValues.latex)).eq(
            "(7,-5)",
        );
        expect(cleanLatex(stateVariables["/sr1"].stateValues.latex)).eq("＿");
        expect(stateVariables["/ca1"].stateValues.value).eq(0);
        expect(cleanLatex(stateVariables["/sr2"].stateValues.latex)).eq("＿");
        expect(stateVariables["/ca2"].stateValues.value).eq(0);

        expect(stateVariables["/m1/P"].stateValues.xs.map((v) => v.tree)).eqls([
            0, 0,
        ]);
        expect(stateVariables["/m2/P"].stateValues.xs.map((v) => v.tree)).eqls([
            -3, 3,
        ]);

        // submit answers
        await submitAnswer({ name: "/m1/ans", core });
        await submitAnswer({ name: "/m2/ans", core });
        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/sr1"].stateValues.latex)).eq(
            "(0,0)",
        );
        expect(stateVariables["/ca1"].stateValues.value).eq(0);
        expect(cleanLatex(stateVariables["/sr2"].stateValues.latex)).eq(
            "(-3,3)",
        );
        expect(stateVariables["/ca2"].stateValues.value).eq(0);

        // move near correct answers
        await movePoint({ name: "/m1/P", x: 3.2, y: 3.9, core });
        await movePoint({ name: "/m2/P", x: 7.2, y: -4.9, core });
        expect(cleanLatex(stateVariables["/m1/m1"].stateValues.latex)).eq(
            "(3,4)",
        );
        expect(cleanLatex(stateVariables["/coordsa"].stateValues.latex)).eq(
            "(-3,3)",
        );
        expect(cleanLatex(stateVariables["/coordsb"].stateValues.latex)).eq(
            "(7,-5)",
        );
        expect(cleanLatex(stateVariables["/m2/m1"].stateValues.latex)).eq(
            "(7,-5)",
        );

        // submit answers
        await submitAnswer({ name: "/m1/ans", core });
        await submitAnswer({ name: "/m2/ans", core });
        stateVariables = await returnAllStateVariables(core);
        expect(cleanLatex(stateVariables["/sr1"].stateValues.latex)).eq(
            "(3,4)",
        );
        expect(stateVariables["/ca1"].stateValues.value).eq(1);
        expect(cleanLatex(stateVariables["/sr2"].stateValues.latex)).eq(
            "(7,-5)",
        );
        expect(stateVariables["/ca2"].stateValues.value).eq(1);
    });
});
