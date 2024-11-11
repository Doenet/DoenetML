import { describe, expect, it, vi } from "vitest";
import { createTestCore, returnAllStateVariables } from "../utils/test-core";
import { submitAnswer, updateMathInputValue } from "../utils/actions";
import Core from "../../Core";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);

type Offset =
    | string
    | number
    | (string | number | (string | number | (string | number)[])[])[];
type Period = string | number | (string | number)[];
type PeriodicSetItem = ["tuple", Offset, Period, number, number];

type PeriodicSet = ["periodic_set", ...PeriodicSetItem[]];

async function check_periodic_set({
    core,
    name,
    offsets,
    period,
    lim1 = -Infinity,
    lim2 = Infinity,
    redundantOffsets = false,
}: {
    core: Core;
    name: string;
    offsets?: Offset[];
    period?: Period;
    lim1?: number;
    lim2?: number;
    redundantOffsets?: boolean;
}) {
    const stateVariables = await returnAllStateVariables(core);
    if (offsets === undefined || period === undefined) {
        expect(stateVariables[name].stateValues.value.tree).eq("\uff3f");
    } else {
        let items: PeriodicSetItem[] = offsets.map((os) => [
            "tuple",
            os,
            period,
            lim1,
            lim2,
        ]);

        let s: PeriodicSet = ["periodic_set", ...items];

        expect(stateVariables[name].stateValues.value.tree).eqls(s);
        expect(stateVariables[name].stateValues.numOffsets).eq(offsets.length);

        expect(
            stateVariables[name].stateValues.offsets.map((v) => v.tree),
        ).eqls(offsets);
        expect(stateVariables[name].stateValues.period.tree).eqls(period);
        expect(stateVariables[name].stateValues.redundantOffsets).eq(
            redundantOffsets,
        );
    }
}

describe("PeriodicSet tag tests", async () => {
    it("match given periodic set", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>Offsets: <mathInput name="o"/></p>
    <p>Period: <mathInput name="p" /></p>
    <answer name="ans">
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

        await check_periodic_set({ core, name: "/s1" });

        let period: number | string | (number | string)[] = "pi";
        let offsets: Offset[] = [
            ["/", "pi", 4],
            ["/", ["*", 3, "pi"], 4],
        ];

        await check_periodic_set({ core, name: "/s2", offsets, period });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/ans"].stateValues.creditAchieved).eq(0);

        // Type in an offset and submit
        await updateMathInputValue({ latex: "-\\pi/4", name: "/o", core });
        await submitAnswer({ name: "/ans", core });
        await check_periodic_set({ core, name: "/s1" });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/ans"].stateValues.creditAchieved).eq(0);

        // Type in a period and submit
        await updateMathInputValue({ latex: "\\pi/2", name: "/p", core });
        await submitAnswer({ name: "/ans", core });
        period = ["/", "pi", 2];
        offsets = [["-", ["/", "pi", 4]]];
        await check_periodic_set({ core, name: "/s1", offsets, period });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/ans"].stateValues.creditAchieved).eq(1);

        // Change period to be irrational factor of other period
        await updateMathInputValue({ latex: "1", name: "/p", core });
        await submitAnswer({ name: "/ans", core });
        period = 1;
        await check_periodic_set({ core, name: "/s1", offsets, period });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/ans"].stateValues.creditAchieved).eq(0);

        // Change period
        await updateMathInputValue({ latex: "\\pi", name: "/p", core });
        await submitAnswer({ name: "/ans", core });
        period = "pi";
        await check_periodic_set({ core, name: "/s1", offsets, period });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/ans"].stateValues.creditAchieved).eq(0);

        // add offset
        await updateMathInputValue({
            latex: "-\\pi/4, 5\\pi/4",
            name: "/o",
            core,
        });
        await submitAnswer({ name: "/ans", core });
        offsets.push(["/", ["*", 5, "pi"], 4]);
        await check_periodic_set({ core, name: "/s1", offsets, period });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/ans"].stateValues.creditAchieved).eq(1);

        // add redundant offset
        await updateMathInputValue({
            latex: "-\\pi/4, 5\\pi/4, \\pi/4",
            name: "/o",
            core,
        });
        await submitAnswer({ name: "/ans", core });
        offsets.push(["/", "pi", 4]);
        await check_periodic_set({
            core,
            name: "/s1",
            offsets,
            period,
            redundantOffsets: true,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/ans"].stateValues.creditAchieved).eq(1);

        // add incorrect offset
        await updateMathInputValue({
            latex: "-\\pi/4, 5\\pi/4, \\pi/4, \\pi/2",
            name: "/o",
            core,
        });
        await submitAnswer({ name: "/ans", core });
        offsets.push(["/", "pi", 2]);
        await check_periodic_set({
            core,
            name: "/s1",
            offsets,
            period,
            redundantOffsets: true,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/ans"].stateValues.creditAchieved).eq(0);

        // add invalid math
        await updateMathInputValue({
            latex: "-\\pi/4, 5\\pi/4, \\pi/4, \\pi/2, (",
            name: "/o",
            core,
        });
        await submitAnswer({ name: "/ans", core });
        await check_periodic_set({ core, name: "/s1" });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/ans"].stateValues.creditAchieved).eq(0);
    });

    it("match copied periodic sets", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>Offsets: <mathInput name="offsets" /></p>
    <p>Period: <mathInput name="period" /></p>
    
    <p>Offsets 2: <mathInput name="offsets2" /></p>
    <p>Period 2: <mathInput name="period2" /></p>
    
    <periodicSet name="a"  offsets="$offsets" period="$period" />
    <periodicSet name="b"  offsets="$offsets2" period="$period2" />
    
    <answer name="ans">
      <award>
        <when>$a{name="a2"} = $b{name="b2"}</when>
      </award>
    </answer>
    
    <p name="pR">Redundancies: $a.redundantOffsets, $b.redundantOffsets, $a2.redundantOffsets, $b2.redundantOffsets</p>
    `,
        });

        await submitAnswer({ name: "/ans", core });

        await check_periodic_set({ core, name: "/a" });
        await check_periodic_set({ core, name: "/b" });
        await check_periodic_set({ core, name: "/a2" });
        await check_periodic_set({ core, name: "/b2" });
        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/ans"].stateValues.creditAchieved).eq(0);
        expect(stateVariables["/pR"].stateValues.text).eq(
            "Redundancies: false, false, false, false",
        );

        // Submit offset for both

        await updateMathInputValue({
            latex: "-\\pi/4",
            name: "/offsets",
            core,
        });
        await updateMathInputValue({
            latex: "-\\pi/4",
            name: "/offsets2",
            core,
        });
        let offsets1: Offset[] = [["-", ["/", "pi", 4]]];
        let offsets2: Offset[] = [["-", ["/", "pi", 4]]];
        await submitAnswer({ name: "/ans", core });
        await check_periodic_set({ core, name: "/a" });
        await check_periodic_set({ core, name: "/b" });
        await check_periodic_set({ core, name: "/a2" });
        await check_periodic_set({ core, name: "/b2" });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/ans"].stateValues.creditAchieved).eq(0);
        expect(stateVariables["/pR"].stateValues.text).eq(
            "Redundancies: false, false, false, false",
        );

        // Submit periods for both
        await updateMathInputValue({
            latex: "\\pi/2",
            name: "/period",
            core,
        });
        await updateMathInputValue({
            latex: "2\\pi",
            name: "/period2",
            core,
        });
        let period1: Period = ["/", "pi", 2];
        let period2: Period = ["*", 2, "pi"];
        await submitAnswer({ name: "/ans", core });
        await check_periodic_set({
            core,
            name: "/a",
            offsets: offsets1,
            period: period1,
        });
        await check_periodic_set({
            core,
            name: "/b",
            offsets: offsets2,
            period: period2,
        });
        await check_periodic_set({
            core,
            name: "/a2",
            offsets: offsets1,
            period: period1,
        });
        await check_periodic_set({
            core,
            name: "/b2",
            offsets: offsets2,
            period: period2,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/ans"].stateValues.creditAchieved).eq(0);
        expect(stateVariables["/pR"].stateValues.text).eq(
            "Redundancies: false, false, false, false",
        );

        // Add offsets to match
        await updateMathInputValue({
            latex: "-\\pi/4, \\pi/4, 11\\pi/4, -11\\pi/4",
            name: "/offsets2",
            core,
        });
        offsets2.push(
            ...[
                ["/", "pi", 4],
                ["/", ["*", 11, "pi"], 4],
                ["-", ["/", ["*", 11, "pi"], 4]],
            ],
        );
        await submitAnswer({ name: "/ans", core });
        await check_periodic_set({
            core,
            name: "/a",
            offsets: offsets1,
            period: period1,
        });
        await check_periodic_set({
            core,
            name: "/b",
            offsets: offsets2,
            period: period2,
        });
        await check_periodic_set({
            core,
            name: "/a2",
            offsets: offsets1,
            period: period1,
        });
        await check_periodic_set({
            core,
            name: "/b2",
            offsets: offsets2,
            period: period2,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/ans"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/pR"].stateValues.text).eq(
            "Redundancies: false, false, false, false",
        );

        // Add extra offsets
        await updateMathInputValue({
            latex: "-\\pi/4, -17\\pi/4",
            name: "/offsets",
            core,
        });
        offsets1.push(["-", ["/", ["*", 17, "pi"], 4]]);
        await submitAnswer({ name: "/ans", core });
        await check_periodic_set({
            core,
            name: "/a",
            offsets: offsets1,
            period: period1,
            redundantOffsets: true,
        });
        await check_periodic_set({
            core,
            name: "/b",
            offsets: offsets2,
            period: period2,
        });
        await check_periodic_set({
            core,
            name: "/a2",
            offsets: offsets1,
            period: period1,
            redundantOffsets: true,
        });
        await check_periodic_set({
            core,
            name: "/b2",
            offsets: offsets2,
            period: period2,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/ans"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/pR"].stateValues.text).eq(
            "Redundancies: true, false, true, false",
        );

        // reduce period
        await updateMathInputValue({
            latex: "\\pi",
            name: "/period2",
            core,
        });
        period2 = "pi";
        await submitAnswer({ name: "/ans", core });
        await check_periodic_set({
            core,
            name: "/a",
            offsets: offsets1,
            period: period1,
            redundantOffsets: true,
        });
        await check_periodic_set({
            core,
            name: "/b",
            offsets: offsets2,
            period: period2,
            redundantOffsets: true,
        });
        await check_periodic_set({
            core,
            name: "/a2",
            offsets: offsets1,
            period: period1,
            redundantOffsets: true,
        });
        await check_periodic_set({
            core,
            name: "/b2",
            offsets: offsets2,
            period: period2,
            redundantOffsets: true,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/ans"].stateValues.creditAchieved).eq(1);
        expect(stateVariables["/pR"].stateValues.text).eq(
            "Redundancies: true, true, true, true",
        );

        // add incorrect offset
        await updateMathInputValue({
            latex: "-\\pi/4, \\pi/4, 11\\pi/4, -11\\pi/4, 0",
            name: "/offsets2",
            core,
        });
        offsets2.push(0);
        await submitAnswer({ name: "/ans", core });
        await check_periodic_set({
            core,
            name: "/a",
            offsets: offsets1,
            period: period1,
            redundantOffsets: true,
        });
        await check_periodic_set({
            core,
            name: "/b",
            offsets: offsets2,
            period: period2,
            redundantOffsets: true,
        });
        await check_periodic_set({
            core,
            name: "/a2",
            offsets: offsets1,
            period: period1,
            redundantOffsets: true,
        });
        await check_periodic_set({
            core,
            name: "/b2",
            offsets: offsets2,
            period: period2,
            redundantOffsets: true,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/ans"].stateValues.creditAchieved).eq(0);
        expect(stateVariables["/pR"].stateValues.text).eq(
            "Redundancies: true, true, true, true",
        );
    });

    it("partial credit with periodic set", async () => {
        let core = await createTestCore({
            doenetML: `
    <setup>
      <mathList name="correct_offsets" mergeMathLists="true">30,150</mathList>
      <number name="n_correct_offsets">2</number>
      <math name="correct_period">180</math>
      <periodicSet name="correct"  offsets="$correct_offsets" period="$correct_period" />
    </setup>
    <p>What is the period?
      <answer name="period">
        <mathInput name="period_input" />
        <award><when>
          <isinteger>$period_input/$correct_period</isinteger>
        </when></award>
      </answer>
    </p>

    <p>How many offsets? 
      <answer name="number_offsets">
        <mathInput name="number_offsets_input" />
        <award><when>
          <isinteger>$number_offsets_input</isinteger>
          and
          $number_offsets_input >= $period/$correct_period*$n_correct_offsets
        </when></award>  
      </answer> 
    </p>

    <p name="offset_p">Enter the offsets:
      <map assignNames="(mi1) (mi2) (mi3) (mi4) (mi5) (mi6) (mi7) (mi8) (mi9) (mi10)">
        <template>
          <mathInput />
        </template>
        <sources>
          <sequence length="$number_offsets" />
        </sources>
      </map>
    </p>

    <mathList name="collected_offsets" hide>
      <collect componentTypes="mathInput" prop="value" target="offset_p" />
    </mathList>

    <setup>
      <periodicSet offsets="$collected_offsets" period="$period" name="userPeriodicSet" />
      <conditionalContent hide assignNames="(maxCreditRedund)">
        <case condition="$(userPeriodicSet.redundantOffsets)">
          <number>0.8</number>
        </case>
        <else>
          <number>1</number>
        </else>
      </conditionalContent>
    </setup>
    
    <answer name="answerNoPenalty">
      <award>
        <when matchPartial="true">
          $userPeriodicSet = $correct
        </when>
      </award>
    </answer>


    <p>Answer when penalizing redundant offsets: 
      <answer name="answerPenalty">
        <award credit="$maxCreditRedund">
          <when matchPartial>
            $userPeriodicSet = $correct
          </when>
        </award>
        <award name="redund" credit="0">
          <when>$userPeriodicSet.redundantOffsets</when>
        </award>
        <considerAsResponses>
          $p$o
        </considerAsResponses>
      </answer>
    </p>

    `,
        });

        // partially correct answer
        await updateMathInputValue({
            latex: "360",
            name: "/period_input",
            core,
        });
        await submitAnswer({ name: "/period", core });
        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/period"].stateValues.creditAchieved).eq(1);

        await updateMathInputValue({
            latex: "4",
            name: "/number_offsets_input",
            core,
        });
        await submitAnswer({ name: "/number_offsets", core });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/number_offsets"].stateValues.creditAchieved).eq(
            1,
        );

        await updateMathInputValue({ latex: "30", name: "/mi1", core });
        await updateMathInputValue({ latex: "150", name: "/mi2", core });
        await updateMathInputValue({ latex: "210", name: "/mi3", core });
        await updateMathInputValue({ latex: "211", name: "/mi4", core });
        await submitAnswer({ name: "/answerNoPenalty", core });
        stateVariables = await returnAllStateVariables(core);
        expect(
            stateVariables["/answerNoPenalty"].stateValues.creditAchieved,
        ).eq(0.75);
        await submitAnswer({ name: "/answerPenalty", core });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/answerPenalty"].stateValues.creditAchieved).eq(
            0.75,
        );

        // correct answer
        await updateMathInputValue({ latex: "-30", name: "/mi4", core });
        await submitAnswer({ name: "/answerNoPenalty", core });
        stateVariables = await returnAllStateVariables(core);
        expect(
            stateVariables["/answerNoPenalty"].stateValues.creditAchieved,
        ).eq(1);
        await submitAnswer({ name: "/answerPenalty", core });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/answerPenalty"].stateValues.creditAchieved).eq(
            1,
        );

        // add extraneous answer blanks
        await updateMathInputValue({
            latex: "10",
            name: "/number_offsets_input",
            core,
        });
        await submitAnswer({ name: "/number_offsets", core });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/number_offsets"].stateValues.creditAchieved).eq(
            1,
        );

        await submitAnswer({ name: "/answerNoPenalty", core });
        stateVariables = await returnAllStateVariables(core);
        expect(
            stateVariables["/answerNoPenalty"].stateValues.creditAchieved,
        ).eq(0.4);
        await submitAnswer({ name: "/answerPenalty", core });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/answerPenalty"].stateValues.creditAchieved).eq(
            0.4,
        );

        // add in a duplicate
        await updateMathInputValue({ latex: "330", name: "/mi5", core });
        await submitAnswer({ name: "/answerNoPenalty", core });
        stateVariables = await returnAllStateVariables(core);
        expect(
            stateVariables["/answerNoPenalty"].stateValues.creditAchieved,
        ).eq(0.5);
        await submitAnswer({ name: "/answerPenalty", core });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/answerPenalty"].stateValues.creditAchieved).eq(
            0.4,
        );

        // fill in with duplicates
        await updateMathInputValue({ latex: "330", name: "/mi6", core });
        await updateMathInputValue({ latex: "330", name: "/mi7", core });
        await updateMathInputValue({ latex: "330", name: "/mi8", core });
        await updateMathInputValue({ latex: "330", name: "/mi9", core });
        await updateMathInputValue({ latex: "330", name: "/mi10", core });
        await submitAnswer({ name: "/answerNoPenalty", core });
        stateVariables = await returnAllStateVariables(core);
        expect(
            stateVariables["/answerNoPenalty"].stateValues.creditAchieved,
        ).eq(1);
        await submitAnswer({ name: "/answerPenalty", core });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/answerPenalty"].stateValues.creditAchieved).eq(
            0.8,
        );

        // too few answer blanks
        await updateMathInputValue({
            latex: "3",
            name: "/number_offsets_input",
            core,
        });
        await submitAnswer({ name: "/number_offsets", core });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/number_offsets"].stateValues.creditAchieved).eq(
            0,
        );

        await submitAnswer({ name: "/answerNoPenalty", core });
        stateVariables = await returnAllStateVariables(core);
        expect(
            stateVariables["/answerNoPenalty"].stateValues.creditAchieved,
        ).eq(0.75);
        await submitAnswer({ name: "/answerPenalty", core });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/answerPenalty"].stateValues.creditAchieved).eq(
            0.75,
        );

        await updateMathInputValue({ latex: "100", name: "/mi3", core });
        await submitAnswer({ name: "/answerNoPenalty", core });
        stateVariables = await returnAllStateVariables(core);
        expect(
            stateVariables["/answerNoPenalty"].stateValues.creditAchieved,
        ).eq(0.5);
        await submitAnswer({ name: "/answerPenalty", core });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/answerPenalty"].stateValues.creditAchieved).eq(
            0.5,
        );

        // even fewer answer blanks
        await updateMathInputValue({
            latex: "2",
            name: "/number_offsets_input",
            core,
        });
        await submitAnswer({ name: "/number_offsets", core });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/number_offsets"].stateValues.creditAchieved).eq(
            0,
        );

        await updateMathInputValue({ latex: "100", name: "/mi3", core });
        await submitAnswer({ name: "/answerNoPenalty", core });
        stateVariables = await returnAllStateVariables(core);
        expect(
            stateVariables["/answerNoPenalty"].stateValues.creditAchieved,
        ).eq(0.5);
        await submitAnswer({ name: "/answerPenalty", core });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/answerPenalty"].stateValues.creditAchieved).eq(
            0.5,
        );

        // change period
        await updateMathInputValue({
            latex: "180",
            name: "/period_input",
            core,
        });
        await submitAnswer({ name: "/period", core });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/period"].stateValues.creditAchieved).eq(1);

        await submitAnswer({ name: "/number_offsets", core });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/number_offsets"].stateValues.creditAchieved).eq(
            1,
        );

        await submitAnswer({ name: "/answerNoPenalty", core });
        stateVariables = await returnAllStateVariables(core);
        expect(
            stateVariables["/answerNoPenalty"].stateValues.creditAchieved,
        ).eq(1);
        await submitAnswer({ name: "/answerPenalty", core });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/answerPenalty"].stateValues.creditAchieved).eq(
            1,
        );

        // additional answer blanks
        await updateMathInputValue({
            latex: "3",
            name: "/number_offsets_input",
            core,
        });
        await submitAnswer({ name: "/number_offsets", core });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/number_offsets"].stateValues.creditAchieved).eq(
            1,
        );

        await submitAnswer({ name: "/answerNoPenalty", core });
        stateVariables = await returnAllStateVariables(core);
        expect(
            stateVariables["/answerNoPenalty"].stateValues.creditAchieved,
        ).eq(2 / 3);
        await submitAnswer({ name: "/answerPenalty", core });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/answerPenalty"].stateValues.creditAchieved).eq(
            2 / 3,
        );

        await updateMathInputValue({ latex: "330", name: "/mi3", core });
        await submitAnswer({ name: "/answerNoPenalty", core });
        stateVariables = await returnAllStateVariables(core);
        expect(
            stateVariables["/answerNoPenalty"].stateValues.creditAchieved,
        ).eq(1);
        await submitAnswer({ name: "/answerPenalty", core });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/answerPenalty"].stateValues.creditAchieved).eq(
            0.8,
        );

        // change period
        await updateMathInputValue({
            latex: "90",
            name: "/period_input",
            core,
        });
        await submitAnswer({ name: "/period", core });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/period"].stateValues.creditAchieved).eq(0);

        await submitAnswer({ name: "/number_offsets", core });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/number_offsets"].stateValues.creditAchieved).eq(
            1,
        );

        await submitAnswer({ name: "/answerNoPenalty", core });
        stateVariables = await returnAllStateVariables(core);
        expect(
            stateVariables["/answerNoPenalty"].stateValues.creditAchieved,
        ).eq(0.5);
        await submitAnswer({ name: "/answerPenalty", core });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/answerPenalty"].stateValues.creditAchieved).eq(
            0.4,
        );

        await updateMathInputValue({ latex: "100", name: "/mi3", core });
        await submitAnswer({ name: "/answerNoPenalty", core });
        stateVariables = await returnAllStateVariables(core);
        expect(
            stateVariables["/answerNoPenalty"].stateValues.creditAchieved,
        ).eq(1 / 3);
        await submitAnswer({ name: "/answerPenalty", core });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/answerPenalty"].stateValues.creditAchieved).eq(
            1 / 3,
        );

        await updateMathInputValue({ latex: "150", name: "/mi3", core });
        await submitAnswer({ name: "/answerNoPenalty", core });
        stateVariables = await returnAllStateVariables(core);
        expect(
            stateVariables["/answerNoPenalty"].stateValues.creditAchieved,
        ).eq(0.5);
        await submitAnswer({ name: "/answerPenalty", core });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/answerPenalty"].stateValues.creditAchieved).eq(
            0.4,
        );
    });

    it("display periodic set as list", async () => {
        let core = await createTestCore({
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

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/pL1"].stateValues.text).eq("As list: ");
        expect(stateVariables["/pL2"].stateValues.text).eq(
            "As list with specified min/max: ",
        );

        await updateMathInputValue({ latex: "7", name: "/period", core });
        await updateMathInputValue({ latex: "1", name: "/offsets", core });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/pL1"].stateValues.text).eq(
            "As list: ..., -6, 1, 8, ...",
        );
        expect(stateVariables["/pL2"].stateValues.text).eq(
            "As list with specified min/max: ..., -6, 1, 8, ...",
        );

        await updateMathInputValue({ latex: "3", name: "/minIndex", core });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/pL1"].stateValues.text).eq(
            "As list: ..., -6, 1, 8, ...",
        );
        expect(stateVariables["/pL2"].stateValues.text).eq(
            "As list with specified min/max: ..., ...",
        );

        await updateMathInputValue({ latex: "6", name: "/maxIndex", core });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/pL1"].stateValues.text).eq(
            "As list: ..., -6, 1, 8, ...",
        );
        expect(stateVariables["/pL2"].stateValues.text).eq(
            "As list with specified min/max: ..., 22, 29, 36, 43, ...",
        );

        await updateMathInputValue({ latex: "1,3", name: "/offsets", core });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/pL1"].stateValues.text).eq(
            "As list: ..., -6, -4, 1, 3, 8, 10, ...",
        );
        expect(stateVariables["/pL2"].stateValues.text).eq(
            "As list with specified min/max: ..., 22, 24, 29, 31, 36, 38, 43, 45, ...",
        );

        await updateMathInputValue({ latex: "3,1", name: "/offsets", core });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/pL1"].stateValues.text).eq(
            "As list: ..., -6, -4, 1, 3, 8, 10, ...",
        );
        expect(stateVariables["/pL2"].stateValues.text).eq(
            "As list with specified min/max: ..., 22, 24, 29, 31, 36, 38, 43, 45, ...",
        );

        await updateMathInputValue({ latex: "3,1,8", name: "/offsets", core });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/pL1"].stateValues.text).eq(
            "As list: ..., -6, -4, 1, 3, 8, 10, ...",
        );
        expect(stateVariables["/pL2"].stateValues.text).eq(
            "As list with specified min/max: ..., 22, 24, 29, 31, 36, 38, 43, 45, ...",
        );

        await updateMathInputValue({
            latex: "3,1,8,79",
            name: "/offsets",
            core,
        });
        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/pL1"].stateValues.text).eq(
            "As list: ..., -6, -5, -4, 1, 2, 3, 8, 9, 10, ...",
        );
        expect(stateVariables["/pL2"].stateValues.text).eq(
            "As list with specified min/max: ..., 22, 23, 24, 29, 30, 31, 36, 37, 38, 43, 44, 45, ...",
        );
    });
});
