import { describe, expect, it, vi } from "vitest";
import { createTestCore, ResolvePathToNodeIdx } from "../utils/test-core";
import { submitAnswer, updateMathInputValue } from "../utils/actions";
import { PublicDoenetMLCore } from "../../CoreWorker";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

type Offset =
    | string
    | number
    | (string | number | (string | number | (string | number)[])[])[];
type Period = string | number | (string | number)[];
type PeriodicSetItem = ["tuple", Offset, Period, number, number];

type PeriodicSet = ["periodic_set", ...PeriodicSetItem[]];

async function check_periodic_set({
    core,
    componentIdx,
    offsets,
    period,
    lim1 = -Infinity,
    lim2 = Infinity,
    redundantOffsets = false,
}: {
    core: PublicDoenetMLCore;
    componentIdx: number;
    offsets?: Offset[];
    period?: Period;
    lim1?: number;
    lim2?: number;
    redundantOffsets?: boolean;
}) {
    const stateVariables = await core.returnAllStateVariables(false, true);
    if (offsets === undefined || period === undefined) {
        expect(stateVariables[componentIdx].stateValues.value.tree).eq(
            "\uff3f",
        );
    } else {
        let items: PeriodicSetItem[] = offsets.map((os) => [
            "tuple",
            os,
            period,
            lim1,
            lim2,
        ]);

        let s: PeriodicSet = ["periodic_set", ...items];

        expect(stateVariables[componentIdx].stateValues.value.tree).eqls(s);
        expect(stateVariables[componentIdx].stateValues.numOffsets).eq(
            offsets.length,
        );

        expect(
            stateVariables[componentIdx].stateValues.offsets.map((v) => v.tree),
        ).eqls(offsets);
        expect(stateVariables[componentIdx].stateValues.period.tree).eqls(
            period,
        );
        expect(stateVariables[componentIdx].stateValues.redundantOffsets).eq(
            redundantOffsets,
        );
    }
}

describe("PeriodicSet tag tests", async () => {
    it("match given periodic set", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>Offsets: <mathInput name="o"/></p>
    <p>Period: <mathInput name="p" /></p>
    <answer disableAfterCorrect="false" name="ans">
      <award>
        <when>
          <periodicSet name="s1"  offsets="$o" period="$p" />
          =
          <periodicSet name="s2"  offsets="pi/4 3pi/4" period="pi" />
        </when>
      </award>
    </answer>
    `,
        });

        await check_periodic_set({
            core,
            componentIdx: await resolvePathToNodeIdx("s1"),
        });

        let period: number | string | (number | string)[] = "pi";
        let offsets: Offset[] = [
            ["/", "pi", 4],
            ["/", ["*", 3, "pi"], 4],
        ];

        await check_periodic_set({
            core,
            componentIdx: await resolvePathToNodeIdx("s2"),
            offsets,
            period,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans")].stateValues
                .creditAchieved,
        ).eq(0);

        // Type in an offset and submit
        await updateMathInputValue({
            latex: "-\\pi/4",
            componentIdx: await resolvePathToNodeIdx("o"),
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans"),
            core,
        });
        await check_periodic_set({
            core,
            componentIdx: await resolvePathToNodeIdx("s1"),
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans")].stateValues
                .creditAchieved,
        ).eq(0);

        // Type in a period and submit
        await updateMathInputValue({
            latex: "\\pi/2",
            componentIdx: await resolvePathToNodeIdx("p"),
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans"),
            core,
        });
        period = ["/", "pi", 2];
        offsets = [["-", ["/", "pi", 4]]];
        await check_periodic_set({
            core,
            componentIdx: await resolvePathToNodeIdx("s1"),
            offsets,
            period,
        });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("ans")].stateValues
                .creditAchieved,
        ).eq(1);

        // Change period to be irrational factor of other period
        await updateMathInputValue({
            latex: "1",
            componentIdx: await resolvePathToNodeIdx("p"),
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans"),
            core,
        });
        period = 1;
        await check_periodic_set({
            core,
            componentIdx: await resolvePathToNodeIdx("s1"),
            offsets,
            period,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans")].stateValues
                .creditAchieved,
        ).eq(0);

        // Change period
        await updateMathInputValue({
            latex: "\\pi",
            componentIdx: await resolvePathToNodeIdx("p"),
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans"),
            core,
        });
        period = "pi";
        await check_periodic_set({
            core,
            componentIdx: await resolvePathToNodeIdx("s1"),
            offsets,
            period,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans")].stateValues
                .creditAchieved,
        ).eq(0);

        // add offset
        await updateMathInputValue({
            latex: "-\\pi/4, 5\\pi/4",
            componentIdx: await resolvePathToNodeIdx("o"),
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans"),
            core,
        });
        offsets.push(["/", ["*", 5, "pi"], 4]);
        await check_periodic_set({
            core,
            componentIdx: await resolvePathToNodeIdx("s1"),
            offsets,
            period,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans")].stateValues
                .creditAchieved,
        ).eq(1);

        // add redundant offset
        await updateMathInputValue({
            latex: "-\\pi/4, 5\\pi/4, \\pi/4",
            componentIdx: await resolvePathToNodeIdx("o"),
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans"),
            core,
        });
        offsets.push(["/", "pi", 4]);
        await check_periodic_set({
            core,
            componentIdx: await resolvePathToNodeIdx("s1"),
            offsets,
            period,
            redundantOffsets: true,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans")].stateValues
                .creditAchieved,
        ).eq(1);

        // add incorrect offset
        await updateMathInputValue({
            latex: "-\\pi/4, 5\\pi/4, \\pi/4, \\pi/2",
            componentIdx: await resolvePathToNodeIdx("o"),
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans"),
            core,
        });
        offsets.push(["/", "pi", 2]);
        await check_periodic_set({
            core,
            componentIdx: await resolvePathToNodeIdx("s1"),
            offsets,
            period,
            redundantOffsets: true,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans")].stateValues
                .creditAchieved,
        ).eq(0);

        // add invalid math
        await updateMathInputValue({
            latex: "-\\pi/4, 5\\pi/4, \\pi/4, \\pi/2, (",
            componentIdx: await resolvePathToNodeIdx("o"),
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans"),
            core,
        });
        await check_periodic_set({
            core,
            componentIdx: await resolvePathToNodeIdx("s1"),
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans")].stateValues
                .creditAchieved,
        ).eq(0);
    });

    it("match copied periodic sets", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>Offsets: <mathInput name="offsets" /></p>
    <p>Period: <mathInput name="period" /></p>
    
    <p>Offsets 2: <mathInput name="offsets2" /></p>
    <p>Period 2: <mathInput name="period2" /></p>
    
    <periodicSet name="a"  offsets="$offsets" period="$period" />
    <periodicSet name="b"  offsets="$offsets2" period="$period2" />
    
    <answer disableAfterCorrect="false" name="ans">
      <award>
        <when><periodicSet extend="$a" name="a2" /> = <periodicSet extend="$b" name="b2" /></when>
      </award>
    </answer>
    
    <p name="pR">Redundancies: $a.redundantOffsets, $b.redundantOffsets, $a2.redundantOffsets, $b2.redundantOffsets</p>
    `,
        });

        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans"),
            core,
        });

        await check_periodic_set({
            core,
            componentIdx: await resolvePathToNodeIdx("a"),
        });
        await check_periodic_set({
            core,
            componentIdx: await resolvePathToNodeIdx("b"),
        });
        await check_periodic_set({
            core,
            componentIdx: await resolvePathToNodeIdx("a2"),
        });
        await check_periodic_set({
            core,
            componentIdx: await resolvePathToNodeIdx("b2"),
        });
        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans")].stateValues
                .creditAchieved,
        ).eq(0);
        expect(
            stateVariables[await resolvePathToNodeIdx("pR")].stateValues.text,
        ).eq("Redundancies: false, false, false, false");

        // Submit offset for both

        await updateMathInputValue({
            latex: "-\\pi/4",
            componentIdx: await resolvePathToNodeIdx("offsets"),
            core,
        });
        await updateMathInputValue({
            latex: "-\\pi/4",
            componentIdx: await resolvePathToNodeIdx("offsets2"),
            core,
        });
        let offsets1: Offset[] = [["-", ["/", "pi", 4]]];
        let offsets2: Offset[] = [["-", ["/", "pi", 4]]];
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans"),
            core,
        });
        await check_periodic_set({
            core,
            componentIdx: await resolvePathToNodeIdx("a"),
        });
        await check_periodic_set({
            core,
            componentIdx: await resolvePathToNodeIdx("b"),
        });
        await check_periodic_set({
            core,
            componentIdx: await resolvePathToNodeIdx("a2"),
        });
        await check_periodic_set({
            core,
            componentIdx: await resolvePathToNodeIdx("b2"),
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans")].stateValues
                .creditAchieved,
        ).eq(0);
        expect(
            stateVariables[await resolvePathToNodeIdx("pR")].stateValues.text,
        ).eq("Redundancies: false, false, false, false");

        // Submit periods for both
        await updateMathInputValue({
            latex: "\\pi/2",
            componentIdx: await resolvePathToNodeIdx("period"),
            core,
        });
        await updateMathInputValue({
            latex: "2\\pi",
            componentIdx: await resolvePathToNodeIdx("period2"),
            core,
        });
        let period1: Period = ["/", "pi", 2];
        let period2: Period = ["*", 2, "pi"];
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans"),
            core,
        });
        await check_periodic_set({
            core,
            componentIdx: await resolvePathToNodeIdx("a"),
            offsets: offsets1,
            period: period1,
        });
        await check_periodic_set({
            core,
            componentIdx: await resolvePathToNodeIdx("b"),
            offsets: offsets2,
            period: period2,
        });
        await check_periodic_set({
            core,
            componentIdx: await resolvePathToNodeIdx("a2"),
            offsets: offsets1,
            period: period1,
        });
        await check_periodic_set({
            core,
            componentIdx: await resolvePathToNodeIdx("b2"),
            offsets: offsets2,
            period: period2,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans")].stateValues
                .creditAchieved,
        ).eq(0);
        expect(
            stateVariables[await resolvePathToNodeIdx("pR")].stateValues.text,
        ).eq("Redundancies: false, false, false, false");

        // Add offsets to match
        await updateMathInputValue({
            latex: "-\\pi/4, \\pi/4, 11\\pi/4, -11\\pi/4",
            componentIdx: await resolvePathToNodeIdx("offsets2"),
            core,
        });
        offsets2.push(
            ...[
                ["/", "pi", 4],
                ["/", ["*", 11, "pi"], 4],
                ["-", ["/", ["*", 11, "pi"], 4]],
            ],
        );
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans"),
            core,
        });
        await check_periodic_set({
            core,
            componentIdx: await resolvePathToNodeIdx("a"),
            offsets: offsets1,
            period: period1,
        });
        await check_periodic_set({
            core,
            componentIdx: await resolvePathToNodeIdx("b"),
            offsets: offsets2,
            period: period2,
        });
        await check_periodic_set({
            core,
            componentIdx: await resolvePathToNodeIdx("a2"),
            offsets: offsets1,
            period: period1,
        });
        await check_periodic_set({
            core,
            componentIdx: await resolvePathToNodeIdx("b2"),
            offsets: offsets2,
            period: period2,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans")].stateValues
                .creditAchieved,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("pR")].stateValues.text,
        ).eq("Redundancies: false, false, false, false");

        // Add extra offsets
        await updateMathInputValue({
            latex: "-\\pi/4, -17\\pi/4",
            componentIdx: await resolvePathToNodeIdx("offsets"),
            core,
        });
        offsets1.push(["-", ["/", ["*", 17, "pi"], 4]]);
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans"),
            core,
        });
        await check_periodic_set({
            core,
            componentIdx: await resolvePathToNodeIdx("a"),
            offsets: offsets1,
            period: period1,
            redundantOffsets: true,
        });
        await check_periodic_set({
            core,
            componentIdx: await resolvePathToNodeIdx("b"),
            offsets: offsets2,
            period: period2,
        });
        await check_periodic_set({
            core,
            componentIdx: await resolvePathToNodeIdx("a2"),
            offsets: offsets1,
            period: period1,
            redundantOffsets: true,
        });
        await check_periodic_set({
            core,
            componentIdx: await resolvePathToNodeIdx("b2"),
            offsets: offsets2,
            period: period2,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans")].stateValues
                .creditAchieved,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("pR")].stateValues.text,
        ).eq("Redundancies: true, false, true, false");

        // reduce period
        await updateMathInputValue({
            latex: "\\pi",
            componentIdx: await resolvePathToNodeIdx("period2"),
            core,
        });
        period2 = "pi";
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans"),
            core,
        });
        await check_periodic_set({
            core,
            componentIdx: await resolvePathToNodeIdx("a"),
            offsets: offsets1,
            period: period1,
            redundantOffsets: true,
        });
        await check_periodic_set({
            core,
            componentIdx: await resolvePathToNodeIdx("b"),
            offsets: offsets2,
            period: period2,
            redundantOffsets: true,
        });
        await check_periodic_set({
            core,
            componentIdx: await resolvePathToNodeIdx("a2"),
            offsets: offsets1,
            period: period1,
            redundantOffsets: true,
        });
        await check_periodic_set({
            core,
            componentIdx: await resolvePathToNodeIdx("b2"),
            offsets: offsets2,
            period: period2,
            redundantOffsets: true,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans")].stateValues
                .creditAchieved,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("pR")].stateValues.text,
        ).eq("Redundancies: true, true, true, true");

        // add incorrect offset
        await updateMathInputValue({
            latex: "-\\pi/4, \\pi/4, 11\\pi/4, -11\\pi/4, 0",
            componentIdx: await resolvePathToNodeIdx("offsets2"),
            core,
        });
        offsets2.push(0);
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans"),
            core,
        });
        await check_periodic_set({
            core,
            componentIdx: await resolvePathToNodeIdx("a"),
            offsets: offsets1,
            period: period1,
            redundantOffsets: true,
        });
        await check_periodic_set({
            core,
            componentIdx: await resolvePathToNodeIdx("b"),
            offsets: offsets2,
            period: period2,
            redundantOffsets: true,
        });
        await check_periodic_set({
            core,
            componentIdx: await resolvePathToNodeIdx("a2"),
            offsets: offsets1,
            period: period1,
            redundantOffsets: true,
        });
        await check_periodic_set({
            core,
            componentIdx: await resolvePathToNodeIdx("b2"),
            offsets: offsets2,
            period: period2,
            redundantOffsets: true,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("ans")].stateValues
                .creditAchieved,
        ).eq(0);
        expect(
            stateVariables[await resolvePathToNodeIdx("pR")].stateValues.text,
        ).eq("Redundancies: true, true, true, true");
    });

    it("partial credit with periodic set", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <setup>
      <mathList name="correct_offsets" mergeMathLists="true">30,150</mathList>
      <number name="n_correct_offsets">2</number>
      <math name="correct_period">180</math>
      <periodicSet name="correct"  offsets="$correct_offsets" period="$correct_period" />
    </setup>
    <p>What is the period?
      <answer disableAfterCorrect="false" name="period">
        <mathInput name="period_input" />
        <award><when>
          <isInteger>$period_input/$correct_period</isInteger>
        </when></award>
      </answer>
    </p>

    <p>How many offsets? 
      <answer disableAfterCorrect="false" name="number_offsets">
        <mathInput name="number_offsets_input" />
        <award><when>
          <isInteger>$number_offsets_input</isInteger>
          and
          $number_offsets_input >= $period/$correct_period*$n_correct_offsets
        </when></award>  
      </answer> 
    </p>

    <p name="offset_p">Enter the offsets:
      <setup><sequence name="seq" length="$number_offsets" /></setup>
      <repeat name="mis" for="$seq">
        <mathInput />
      </repeat>
    </p>

    <mathList name="collected_offsets" hide>
      <collect componentType="mathInput" from="$offset_p" />
    </mathList>

    <setup>
      <periodicSet offsets="$collected_offsets" period="$period" name="userPeriodicSet" />
      <conditionalContent hide name="maxCreditRedund">
        <case condition="$(userPeriodicSet.redundantOffsets)">
          <number>0.8</number>
        </case>
        <else>
          <number>1</number>
        </else>
      </conditionalContent>
    </setup>
    
    <answer disableAfterCorrect="false" name="answerNoPenalty">
      <award>
        <when matchPartial="true">
          $userPeriodicSet = $correct
        </when>
      </award>
    </answer>


    <p>Answer when penalizing redundant offsets: 
      <answer disableAfterCorrect="false" name="answerPenalty">
        <award credit="$maxCreditRedund">
          <when matchPartial>
            $userPeriodicSet = $correct
          </when>
        </award>
        <award name="redund" credit="0">
          <when>$userPeriodicSet.redundantOffsets</when>
        </award>
      </answer>
    </p>

    `,
        });

        // partially correct answer
        await updateMathInputValue({
            latex: "360",
            componentIdx: await resolvePathToNodeIdx("period_input"),
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("period"),
            core,
        });
        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("period")].stateValues
                .creditAchieved,
        ).eq(1);

        await updateMathInputValue({
            latex: "4",
            componentIdx: await resolvePathToNodeIdx("number_offsets_input"),
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("number_offsets"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("number_offsets")]
                .stateValues.creditAchieved,
        ).eq(1);

        await updateMathInputValue({
            latex: "30",
            componentIdx: await resolvePathToNodeIdx("mis[1][1]"),
            core,
        });
        await updateMathInputValue({
            latex: "150",
            componentIdx: await resolvePathToNodeIdx("mis[2][1]"),
            core,
        });
        await updateMathInputValue({
            latex: "210",
            componentIdx: await resolvePathToNodeIdx("mis[3][1]"),
            core,
        });
        await updateMathInputValue({
            latex: "211",
            componentIdx: await resolvePathToNodeIdx("mis[4][1]"),
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("answerNoPenalty"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("answerNoPenalty")]
                .stateValues.creditAchieved,
        ).eq(0.75);
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("answerPenalty"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("answerPenalty")]
                .stateValues.creditAchieved,
        ).eq(0.75);

        // correct answer
        await updateMathInputValue({
            latex: "-30",
            componentIdx: await resolvePathToNodeIdx("mis[4][1]"),
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("answerNoPenalty"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("answerNoPenalty")]
                .stateValues.creditAchieved,
        ).eq(1);
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("answerPenalty"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("answerPenalty")]
                .stateValues.creditAchieved,
        ).eq(1);

        // add extraneous answer blanks
        await updateMathInputValue({
            latex: "10",
            componentIdx: await resolvePathToNodeIdx("number_offsets_input"),
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("number_offsets"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("number_offsets")]
                .stateValues.creditAchieved,
        ).eq(1);

        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("answerNoPenalty"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("answerNoPenalty")]
                .stateValues.creditAchieved,
        ).eq(0.4);
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("answerPenalty"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("answerPenalty")]
                .stateValues.creditAchieved,
        ).eq(0.4);

        // add in a duplicate
        await updateMathInputValue({
            latex: "330",
            componentIdx: await resolvePathToNodeIdx("mis[5][1]"),
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("answerNoPenalty"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("answerNoPenalty")]
                .stateValues.creditAchieved,
        ).eq(0.5);
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("answerPenalty"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("answerPenalty")]
                .stateValues.creditAchieved,
        ).eq(0.4);

        // fill in with duplicates
        await updateMathInputValue({
            latex: "330",
            componentIdx: await resolvePathToNodeIdx("mis[6][1]"),
            core,
        });
        await updateMathInputValue({
            latex: "330",
            componentIdx: await resolvePathToNodeIdx("mis[7][1]"),
            core,
        });
        await updateMathInputValue({
            latex: "330",
            componentIdx: await resolvePathToNodeIdx("mis[8][1]"),
            core,
        });
        await updateMathInputValue({
            latex: "330",
            componentIdx: await resolvePathToNodeIdx("mis[9][1]"),
            core,
        });
        await updateMathInputValue({
            latex: "330",
            componentIdx: await resolvePathToNodeIdx("mis[10][1]"),
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("answerNoPenalty"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("answerNoPenalty")]
                .stateValues.creditAchieved,
        ).eq(1);
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("answerPenalty"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("answerPenalty")]
                .stateValues.creditAchieved,
        ).eq(0.8);

        // too few answer blanks
        await updateMathInputValue({
            latex: "3",
            componentIdx: await resolvePathToNodeIdx("number_offsets_input"),
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("number_offsets"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("number_offsets")]
                .stateValues.creditAchieved,
        ).eq(0);

        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("answerNoPenalty"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("answerNoPenalty")]
                .stateValues.creditAchieved,
        ).eq(0.75);
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("answerPenalty"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("answerPenalty")]
                .stateValues.creditAchieved,
        ).eq(0.75);

        await updateMathInputValue({
            latex: "100",
            componentIdx: await resolvePathToNodeIdx("mis[3][1]"),
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("answerNoPenalty"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("answerNoPenalty")]
                .stateValues.creditAchieved,
        ).eq(0.5);
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("answerPenalty"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("answerPenalty")]
                .stateValues.creditAchieved,
        ).eq(0.5);

        // even fewer answer blanks
        await updateMathInputValue({
            latex: "2",
            componentIdx: await resolvePathToNodeIdx("number_offsets_input"),
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("number_offsets"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("number_offsets")]
                .stateValues.creditAchieved,
        ).eq(0);

        await updateMathInputValue({
            latex: "100",
            componentIdx: await resolvePathToNodeIdx("mis[3][1]"),
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("answerNoPenalty"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("answerNoPenalty")]
                .stateValues.creditAchieved,
        ).eq(0.5);
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("answerPenalty"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("answerPenalty")]
                .stateValues.creditAchieved,
        ).eq(0.5);

        // change period
        await updateMathInputValue({
            latex: "180",
            componentIdx: await resolvePathToNodeIdx("period_input"),
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("period"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("period")].stateValues
                .creditAchieved,
        ).eq(1);

        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("number_offsets"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("number_offsets")]
                .stateValues.creditAchieved,
        ).eq(1);

        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("answerNoPenalty"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("answerNoPenalty")]
                .stateValues.creditAchieved,
        ).eq(1);
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("answerPenalty"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("answerPenalty")]
                .stateValues.creditAchieved,
        ).eq(1);

        // additional answer blanks
        await updateMathInputValue({
            latex: "3",
            componentIdx: await resolvePathToNodeIdx("number_offsets_input"),
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("number_offsets"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("number_offsets")]
                .stateValues.creditAchieved,
        ).eq(1);

        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("answerNoPenalty"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("answerNoPenalty")]
                .stateValues.creditAchieved,
        ).eq(2 / 3);
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("answerPenalty"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("answerPenalty")]
                .stateValues.creditAchieved,
        ).eq(2 / 3);

        await updateMathInputValue({
            latex: "330",
            componentIdx: await resolvePathToNodeIdx("mis[3][1]"),
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("answerNoPenalty"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("answerNoPenalty")]
                .stateValues.creditAchieved,
        ).eq(1);
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("answerPenalty"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("answerPenalty")]
                .stateValues.creditAchieved,
        ).eq(0.8);

        // change period
        await updateMathInputValue({
            latex: "90",
            componentIdx: await resolvePathToNodeIdx("period_input"),
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("period"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("period")].stateValues
                .creditAchieved,
        ).eq(0);

        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("number_offsets"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("number_offsets")]
                .stateValues.creditAchieved,
        ).eq(1);

        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("answerNoPenalty"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("answerNoPenalty")]
                .stateValues.creditAchieved,
        ).eq(0.5);
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("answerPenalty"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("answerPenalty")]
                .stateValues.creditAchieved,
        ).eq(0.4);

        await updateMathInputValue({
            latex: "100",
            componentIdx: await resolvePathToNodeIdx("mis[3][1]"),
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("answerNoPenalty"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("answerNoPenalty")]
                .stateValues.creditAchieved,
        ).eq(1 / 3);
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("answerPenalty"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("answerPenalty")]
                .stateValues.creditAchieved,
        ).eq(1 / 3);

        await updateMathInputValue({
            latex: "150",
            componentIdx: await resolvePathToNodeIdx("mis[3][1]"),
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("answerNoPenalty"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("answerNoPenalty")]
                .stateValues.creditAchieved,
        ).eq(0.5);
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("answerPenalty"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("answerPenalty")]
                .stateValues.creditAchieved,
        ).eq(0.4);
    });

    it("display periodic set as list", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>Period: <mathInput name="period" /></p>
    <p>Offsets: <mathInput name="offsets" /></p>

    <periodicSet period="$period" offsets="$offsets" name="pset" />
  
    <p name="pL1">As list: $pset.asList{assignNames="l1"}</p>

    <p>Min index: <mathInput name="minIndex" />, <mathInput name="maxIndex" /></p>

    <periodicSet period="$period" offsets="$offsets" name="pset2" minIndexAsList="$minIndex" maxIndexAsList="$maxIndex" />

    <p name="pL2">As list with specified min/max: $pset2.asList{assignNames="l2"}</p>

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("pL1")].stateValues.text,
        ).eq("As list: ");
        expect(
            stateVariables[await resolvePathToNodeIdx("pL2")].stateValues.text,
        ).eq("As list with specified min/max: ");

        await updateMathInputValue({
            latex: "7",
            componentIdx: await resolvePathToNodeIdx("period"),
            core,
        });
        await updateMathInputValue({
            latex: "1",
            componentIdx: await resolvePathToNodeIdx("offsets"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("pL1")].stateValues.text,
        ).eq("As list: ..., -6, 1, 8, ...");
        expect(
            stateVariables[await resolvePathToNodeIdx("pL2")].stateValues.text,
        ).eq("As list with specified min/max: ..., -6, 1, 8, ...");

        await updateMathInputValue({
            latex: "3",
            componentIdx: await resolvePathToNodeIdx("minIndex"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("pL1")].stateValues.text,
        ).eq("As list: ..., -6, 1, 8, ...");
        expect(
            stateVariables[await resolvePathToNodeIdx("pL2")].stateValues.text,
        ).eq("As list with specified min/max: ..., ...");

        await updateMathInputValue({
            latex: "6",
            componentIdx: await resolvePathToNodeIdx("maxIndex"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("pL1")].stateValues.text,
        ).eq("As list: ..., -6, 1, 8, ...");
        expect(
            stateVariables[await resolvePathToNodeIdx("pL2")].stateValues.text,
        ).eq("As list with specified min/max: ..., 22, 29, 36, 43, ...");

        await updateMathInputValue({
            latex: "1,3",
            componentIdx: await resolvePathToNodeIdx("offsets"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("pL1")].stateValues.text,
        ).eq("As list: ..., -6, -4, 1, 3, 8, 10, ...");
        expect(
            stateVariables[await resolvePathToNodeIdx("pL2")].stateValues.text,
        ).eq(
            "As list with specified min/max: ..., 22, 24, 29, 31, 36, 38, 43, 45, ...",
        );

        await updateMathInputValue({
            latex: "3,1",
            componentIdx: await resolvePathToNodeIdx("offsets"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("pL1")].stateValues.text,
        ).eq("As list: ..., -6, -4, 1, 3, 8, 10, ...");
        expect(
            stateVariables[await resolvePathToNodeIdx("pL2")].stateValues.text,
        ).eq(
            "As list with specified min/max: ..., 22, 24, 29, 31, 36, 38, 43, 45, ...",
        );

        await updateMathInputValue({
            latex: "3,1,8",
            componentIdx: await resolvePathToNodeIdx("offsets"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("pL1")].stateValues.text,
        ).eq("As list: ..., -6, -4, 1, 3, 8, 10, ...");
        expect(
            stateVariables[await resolvePathToNodeIdx("pL2")].stateValues.text,
        ).eq(
            "As list with specified min/max: ..., 22, 24, 29, 31, 36, 38, 43, 45, ...",
        );

        await updateMathInputValue({
            latex: "3,1,8,79",
            componentIdx: await resolvePathToNodeIdx("offsets"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("pL1")].stateValues.text,
        ).eq("As list: ..., -6, -5, -4, 1, 2, 3, 8, 9, 10, ...");
        expect(
            stateVariables[await resolvePathToNodeIdx("pL2")].stateValues.text,
        ).eq(
            "As list with specified min/max: ..., 22, 23, 24, 29, 30, 31, 36, 37, 38, 43, 44, 45, ...",
        );
    });
});
