import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import {
    updateBooleanInputValue,
    updateMathInputValue,
    updateTextInputValue,
} from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * A diagnostic's level follows where its condition comes from (D35, DIAG-1,
 * DIAG-2, #2422): a warning when what the author wrote causes it, and an
 * info when a value that can change does (an input, a reference, the active
 * case), which appears and goes away with the value (B33). These are the
 * sampling, selection, collect, action-target and graph sites.
 */

async function setup(doenetML: string) {
    const { core, resolvePathToNodeIdx } = await createTestCore({
        doenetML,
    });

    /** The diagnostics with `code` now, as type and line. */
    function diagnostics(code: string) {
        return (core as any).core.diagnostics
            .filter((d: any) => d.code === code)
            .map((d: any) => ({
                type: d.type,
                line: d.position?.start.line,
            }));
    }
    // diagnostics are decided again when what shows them is
    async function refresh() {
        await core.returnAllStateVariables(false, true);
    }
    async function setMath(name: string, latex: string) {
        await updateMathInputValue({
            latex,
            componentIdx: await resolvePathToNodeIdx(name),
            core,
        });
        await refresh();
    }
    async function setText(name: string, text: string) {
        await updateTextInputValue({
            text,
            componentIdx: await resolvePathToNodeIdx(name),
            core,
        });
        await refresh();
    }
    async function setBoolean(name: string, boolean: boolean) {
        await updateBooleanInputValue({
            boolean,
            componentIdx: await resolvePathToNodeIdx(name),
            core,
        });
        await refresh();
    }

    return { core, diagnostics, refresh, setMath, setText, setBoolean };
}

describe("Warning levels by the source of the condition: sampling, collect, targets, graphs", () => {
    it("w0126: a gaussian with a negative standard deviation", async () => {
        const { diagnostics, setMath } = await setup(`
<sampleRandomNumbers type="gaussian" standardDeviation="-1"/>
<mathInput name="sd" prefill="-1"/>
<sampleRandomNumbers type="gaussian" standardDeviation="$sd"/>
`);
        expect(diagnostics("doenet-w0126")).eqls([
            { type: "warning", line: 2 },
            { type: "info", line: 4 },
        ]);

        await setMath("sd", "2");
        expect(diagnostics("doenet-w0126")).eqls([
            { type: "warning", line: 2 },
        ]);

        await setMath("sd", "-3");
        expect(diagnostics("doenet-w0126")).eqls([
            { type: "warning", line: 2 },
            { type: "info", line: 4 },
        ]);
    });

    it("w0131: a poisson with a negative mean", async () => {
        const { diagnostics, setMath } = await setup(`
<sampleRandomNumbers type="poisson" mean="-2"/>
<mathInput name="m" prefill="-2"/>
<sampleRandomNumbers type="poisson" mean="$m"/>
`);
        expect(diagnostics("doenet-w0131")).eqls([
            { type: "warning", line: 2 },
            { type: "info", line: 4 },
        ]);

        await setMath("m", "3");
        expect(diagnostics("doenet-w0131")).eqls([
            { type: "warning", line: 2 },
        ]);
    });

    it("w0129: a binomial with a probability above 1, by type from an input", async () => {
        const { diagnostics, setMath, setText } = await setup(`
<sampleRandomNumbers type="binomial" numTrials="3" probability="2"/>
<mathInput name="p" prefill="2"/>
<sampleRandomNumbers type="binomial" numTrials="3" probability="$p"/>
<textInput name="t" prefill="binomial"/>
<sampleRandomNumbers type="$t" numTrials="3" probability="2"/>
`);
        expect(diagnostics("doenet-w0129")).eqls([
            { type: "warning", line: 2 },
            { type: "info", line: 4 },
            { type: "info", line: 6 },
        ]);

        await setMath("p", "0.5");
        await setText("t", "uniform");
        expect(diagnostics("doenet-w0129")).eqls([
            { type: "warning", line: 2 },
        ]);
    });

    it("w0135: a multivariate hypergeometric drawing more than there are", async () => {
        const { diagnostics, setMath } = await setup(`
<sampleMultivariateRandomNumber type="hypergeometric" numInCategories="2 3" numDraws="9"/>
<mathInput name="n" prefill="9"/>
<sampleMultivariateRandomNumber type="hypergeometric" numInCategories="2 3" numDraws="$n"/>
`);
        expect(diagnostics("doenet-w0135")).eqls([
            { type: "warning", line: 2 },
            { type: "info", line: 4 },
        ]);

        await setMath("n", "4");
        expect(diagnostics("doenet-w0135")).eqls([
            { type: "warning", line: 2 },
        ]);
    });

    it("w0126: a selectRandomNumbers from an input is an info", async () => {
        // Its selection is made once, so the info stays with it.
        const { diagnostics } = await setup(`
<selectRandomNumbers type="gaussian" standardDeviation="-1"/>
<mathInput name="sd" prefill="-1"/>
<selectRandomNumbers type="gaussian" standardDeviation="$sd"/>
`);
        expect(diagnostics("doenet-w0126")).eqls([
            { type: "warning", line: 2 },
            { type: "info", line: 4 },
        ]);
    });

    it("w0051: coprime for letters", async () => {
        const { diagnostics } = await setup(`
<selectFromSequence type="letters" from="a" to="e" coprime/>
<booleanInput name="c" prefill="true"/>
<selectFromSequence type="letters" from="a" to="e" coprime="$c"/>
`);
        expect(diagnostics("doenet-w0051")).eqls([
            { type: "warning", line: 2 },
            { type: "info", line: 4 },
        ]);
    });

    it("w0072: a collect whose source is in a case that is not active", async () => {
        const { diagnostics, setBoolean } = await setup(`
<collect componentType="math"/>
<collect componentType="math" from="$nothing"/>
<booleanInput name="b"/>
<conditionalContent name="cc">
  <case condition="$b"><section name="S"><math>x</math></section></case>
</conditionalContent>
<p><collect componentType="math" from="$cc.S"/></p>
`);
        expect(diagnostics("doenet-w0072")).eqls([
            { type: "warning", line: 2 },
            { type: "warning", line: 3 },
            { type: "info", line: 8 },
        ]);

        await setBoolean("b", true);
        expect(diagnostics("doenet-w0072")).eqls([
            { type: "warning", line: 2 },
            { type: "warning", line: 3 },
        ]);
    });

    it("w0073: a component type to collect that is not one", async () => {
        const { diagnostics, setText } = await setup(`
<p name="p"><math>x</math></p>
<collect componentType="banana" from="$p"/>
<textInput name="t" prefill="banana"/>
<collect componentType="$t" from="$p"/>
`);
        expect(diagnostics("doenet-w0073")).eqls([
            { type: "warning", line: 3 },
            { type: "info", line: 5 },
        ]);

        await setText("t", "math");
        expect(diagnostics("doenet-w0073")).eqls([
            { type: "warning", line: 3 },
        ]);
    });

    it("w0043: an action whose target has nothing in it now", async () => {
        const { diagnostics, refresh, setBoolean } = await setup(`
<updateValue target="$nothing" newValue="1"/>
<booleanInput name="b"/>
<conditionalContent name="cc">
  <case condition="$b"><math>1</math></case>
</conditionalContent>
<updateValue target="$cc" newValue="2"/>
<animateFromSequence target="$cc" from="1" to="3"/>
`);
        // nothing asks an action for its targets until it is used, or
        // until every state variable is asked for, as here
        await refresh();
        expect(diagnostics("doenet-w0043")).eqls([
            { type: "warning", line: 2 },
            { type: "info", line: 7 },
            { type: "info", line: 8 },
        ]);

        await setBoolean("b", true);
        expect(diagnostics("doenet-w0043")).eqls([
            { type: "warning", line: 2 },
        ]);
    });

    it("w0044: an action whose target has no value to change", async () => {
        const { diagnostics, refresh, setBoolean } = await setup(`
<p name="p">hi</p>
<updateValue target="$p" newValue="1"/>
<booleanInput name="b"/>
<conditionalContent name="cc">
  <case condition="$b"><math>1</math></case>
  <else><p>no</p></else>
</conditionalContent>
<updateValue target="$cc" newValue="2"/>
`);
        await refresh();
        expect(diagnostics("doenet-w0044")).eqls([
            { type: "warning", line: 3 },
            { type: "info", line: 9 },
        ]);

        await setBoolean("b", true);
        expect(diagnostics("doenet-w0044")).eqls([
            { type: "warning", line: 3 },
        ]);
    });

    it("w0062: a PreFigure graph with bounds that are not numbers", async () => {
        const { diagnostics, setMath } = await setup(`
<graph renderer="prefigure" xMin="x"/>
<mathInput name="a"/>
<graph renderer="prefigure" xMin="$a"/>
`);
        expect(diagnostics("doenet-w0062")).eqls([
            { type: "warning", line: 2 },
            { type: "info", line: 4 },
        ]);

        await setMath("a", "-5");
        expect(diagnostics("doenet-w0062")).eqls([
            { type: "warning", line: 2 },
        ]);
    });

    it("w0119: a grid that cannot be used", async () => {
        const { diagnostics, setMath } = await setup(`
<graph grid="1 -2"/>
<mathInput name="gx" prefill="-2"/>
<graph grid="1 $gx"/>
`);
        expect(diagnostics("doenet-w0119")).eqls([
            { type: "warning", line: 2 },
            { type: "info", line: 4 },
        ]);

        await setMath("gx", "2");
        expect(diagnostics("doenet-w0119")).eqls([
            { type: "warning", line: 2 },
        ]);
    });
});
