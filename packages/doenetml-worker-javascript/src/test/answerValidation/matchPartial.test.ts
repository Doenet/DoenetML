import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import {
    submitAnswer,
    updateBooleanInputValue,
    updateMathInputValue,
    updateTextInputValue,
} from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

async function run_tests({
    doenetML,
    responseCredits,
    type = "math",
}: {
    doenetML: string;
    responseCredits: {
        responses: Record<string, string | boolean>;
        credits: Record<string, number>;
    }[];
    type?: "math" | "text" | "boolean";
}) {
    const { core, resolvePathToNodeIdx } = await createTestCore({ doenetML });

    for (let responseObj of responseCredits) {
        await submit_check(responseObj);
    }

    async function submit_check({
        responses,
        credits,
    }: {
        responses: Record<string, string | boolean>;
        credits: Record<string, number>;
    }) {
        for (let name in responses) {
            if (type === "math") {
                await updateMathInputValue({
                    latex: `${responses[name]}`,
                    componentIdx: await resolvePathToNodeIdx(name),
                    core,
                });
            } else if (type === "text") {
                await updateTextInputValue({
                    text: `${responses[name]}`,
                    componentIdx: await resolvePathToNodeIdx(name),
                    core,
                });
            } else if (type === "boolean") {
                await updateBooleanInputValue({
                    boolean: Boolean(responses[name]),
                    componentIdx: await resolvePathToNodeIdx(name),
                    core,
                });
            }
        }
        for (let code in credits) {
            await submitAnswer({
                componentIdx: await resolvePathToNodeIdx(`ans${code}`),
                core,
            });
        }
        const stateVariables = await core.returnAllStateVariables(false, true);
        for (let code in credits) {
            expect(
                stateVariables[await resolvePathToNodeIdx(`ans${code}`)]
                    .stateValues.creditAchieved,
            ).eq(
                credits[code],
                `${code} credit for response ${JSON.stringify(responses)}`,
            );
        }
    }
}

async function run_ordered_unordered_tests({
    doenetML,
    delimiters,
}: {
    doenetML: string;
    delimiters: string[];
}) {
    function make_response(resp: string) {
        return delimiters[0] + resp + delimiters[1];
    }
    function make_alt_response(resp: string, i: number) {
        if (delimiters[0] === "(") {
            if (i === 1) {
                return "[" + resp + "]";
            } else {
                return resp;
            }
        } else if (delimiters[0] === "[") {
            if (i === 1) {
                return "(" + resp + ")";
            } else {
                return resp;
            }
        } else {
            if (i === 1) {
                return "(" + resp + ")";
            } else {
                return "[" + resp + "]";
            }
        }
    }

    await run_tests({
        doenetML,
        responseCredits: [
            {
                responses: { resp: "" },
                credits: { P: 0, PEP: 0, PU: 0, S: 0, U: 0 },
            },
            {
                responses: { resp: make_response("1,2,3") },
                credits: { P: 1, PEP: 1, PU: 1, S: 1, U: 1 },
            },
            {
                responses: { resp: make_response("1,3") },
                credits: { P: 2 / 3, PEP: 1 / 3, PU: 2 / 3, S: 0, U: 0 },
            },
            {
                responses: { resp: make_response("2") },
                credits: { P: 1 / 3, PEP: 0, PU: 1 / 3, S: 0, U: 0 },
            },
            {
                responses: { resp: make_response("1") },
                credits: { P: 1 / 3, PEP: 1 / 3, PU: 1 / 3, S: 0, U: 0 },
            },
            {
                responses: { resp: make_response("1,2,a,3") },
                credits: { P: 3 / 4, PEP: 1 / 2, PU: 3 / 4, S: 0, U: 0 },
            },
            {
                responses: { resp: make_response("0,1,2,a,3") },
                credits: { P: 3 / 5, PEP: 0, PU: 3 / 5, S: 0, U: 0 },
            },
            {
                responses: { resp: make_alt_response("1,2,3", 1) },
                credits: { P: 0, PEP: 0, PU: 0, S: 0, U: 0 },
            },
            {
                responses: { resp: make_alt_response("1,2,3", 2) },
                credits: { P: 0, PEP: 0, PU: 0, S: 0, U: 0 },
            },
            {
                responses: { resp: make_response("3,1,2") },
                credits: { P: 2 / 3, PEP: 0, PU: 1, S: 0, U: 1 },
            },
            {
                responses: { resp: make_response("3,2,1") },
                credits: { P: 1 / 3, PEP: 1 / 3, PU: 1, S: 0, U: 1 },
            },
            {
                responses: { resp: make_response("3,2,1,3") },
                credits: { P: 2 / 4, PEP: 1 / 4, PU: 3 / 4, S: 0, U: 0 },
            },
            {
                responses: { resp: make_response("3,a,2,1,3") },
                credits: { P: 2 / 5, PEP: 0, PU: 3 / 5, S: 0, U: 0 },
            },
            {
                responses: { resp: make_response("1,3,a,2,1,3") },
                credits: { P: 3 / 6, PEP: 1 / 6, PU: 3 / 6, S: 0, U: 0 },
            },
            {
                responses: { resp: make_response("3,1") },
                credits: { P: 1 / 3, PEP: 0, PU: 2 / 3, S: 0, U: 0 },
            },
            {
                responses: { resp: make_response("3,1,1") },
                credits: { P: 1 / 3, PEP: 0, PU: 2 / 3, S: 0, U: 0 },
            },
        ],
    });
}

describe("match partial validation tests", async () => {
    it("match partial with ordered and unordered tuple", async () => {
        const doenetML = `
  <setup>
    <math name="ordered">(1,2,3)</math>
    <math name="unordered" unordered>(1,2,3)</math>
  </setup>

  <mathInput name="resp" />

  <p>Match partial: <answer disableAfterCorrect="false" name="ansP">
    <award matchPartial><when>$resp=$ordered</when></award>
  </answer></p>
  
  <p>Match partial, match by exact positions: <answer disableAfterCorrect="false" name="ansPEP">
    <award matchPartial matchByExactPositions><when>$resp=$ordered</when></award>
  </answer></p>
  
  <p>Match partial, unordered: <answer disableAfterCorrect="false" name="ansPU">
    <award matchPartial><when>$resp=$unordered</when></award>
  </answer></p>
  
  <p>Strict equality: <answer disableAfterCorrect="false" name="ansS">
    <award><when>$resp=$ordered</when></award>
  </answer></p>
  
  <p>Unordered: <answer disableAfterCorrect="false" name="ansU">
    <award><when>$resp=$unordered</when></award>
  </answer></p>
    `;

        await run_ordered_unordered_tests({ doenetML, delimiters: ["(", ")"] });
    });

    it("match partial with ordered and unordered list", async () => {
        const doenetML = `
  <setup>
    <math name="ordered">1,2,3</math>
    <math name="unordered" unordered>1,2,3</math>
  </setup>

  <mathInput name="resp" />

  <p>Match partial: <answer disableAfterCorrect="false" name="ansP">
    <award matchPartial><when>$resp=$ordered</when></award>
  </answer></p>
  
  <p>Match partial, match by exact positions: <answer disableAfterCorrect="false" name="ansPEP">
    <award matchPartial matchByExactPositions><when>$resp=$ordered</when></award>
  </answer></p>
  
  <p>Match partial, unordered: <answer disableAfterCorrect="false" name="ansPU">
    <award matchPartial><when>$resp=$unordered</when></award>
  </answer></p>
  
  <p>Strict equality: <answer disableAfterCorrect="false" name="ansS">
    <award><when>$resp=$ordered</when></award>
  </answer></p>
  
  <p>Unordered: <answer disableAfterCorrect="false" name="ansU">
    <award><when>$resp=$unordered</when></award>
  </answer></p>
    `;

        await run_ordered_unordered_tests({ doenetML, delimiters: ["", ""] });
    });

    it("match partial with ordered and unordered array", async () => {
        const doenetML = `
  <setup>
    <math name="ordered">[1,2,3]</math>
    <math name="unordered" unordered>[1,2,3]</math>
  </setup>

  <mathInput name="resp" />

  <p>Match partial: <answer disableAfterCorrect="false" name="ansP">
    <award matchPartial><when>$resp=$ordered</when></award>
  </answer></p>
  
  <p>Match partial, match by exact positions: <answer disableAfterCorrect="false" name="ansPEP">
    <award matchPartial matchByExactPositions><when>$resp=$ordered</when></award>
  </answer></p>
  
  <p>Match partial, unordered: <answer disableAfterCorrect="false" name="ansPU">
    <award matchPartial><when>$resp=$unordered</when></award>
  </answer></p>
  
  <p>Strict equality: <answer disableAfterCorrect="false" name="ansS">
    <award><when>$resp=$ordered</when></award>
  </answer></p>
  
  <p>Unordered: <answer disableAfterCorrect="false" name="ansU">
    <award><when>$resp=$unordered</when></award>
  </answer></p>
    `;

        await run_ordered_unordered_tests({ doenetML, delimiters: ["[", "]"] });
    });

    it("match partial with ordered and unordered tuple, unordered specified on award", async () => {
        const doenetML = `

  <mathInput name="resp" />

  <p>Match partial: <answer disableAfterCorrect="false" name="ansP">
    <award matchPartial><when>$resp=(1,2,3)</when></award>
  </answer></p>
  
  <p>Match partial, match by exact positions: <answer disableAfterCorrect="false" name="ansPEP">
    <award matchPartial matchByExactPositions><when>$resp=(1,2,3)</when></award>
  </answer></p>
  
  <p>Match partial, unordered: <answer disableAfterCorrect="false" name="ansPU">
    <award matchPartial unorderedCompare><when>$resp=(1,2,3)</when></award>
  </answer></p>
  
  <p>Strict equality: <answer disableAfterCorrect="false" name="ansS">
    <award><when>$resp=(1,2,3)</when></award>
  </answer></p>
  
  <p>Unordered: <answer disableAfterCorrect="false" name="ansU">
    <award unorderedCompare><when>$resp=(1,2,3)</when></award>
  </answer></p>
    `;

        await run_ordered_unordered_tests({ doenetML, delimiters: ["(", ")"] });
    });

    it("match partial with ordered and unordered tuple, unordered specified on answer", async () => {
        const doenetML = `

  <mathInput name="resp" />

  <p>Match partial: <answer disableAfterCorrect="false" name="ansP">
    <award matchPartial><when>$resp=<math>(1,2,3)</math></when></award>
  </answer></p>
  
  <p>Match partial, match by exact positions: <answer disableAfterCorrect="false" name="ansPEP">
    <award matchPartial matchByExactPositions><when>$resp=<math>(1,2,3)</math></when></award>
  </answer></p>
  
  <p>Match partial, unordered: <answer disableAfterCorrect="false" name="ansPU" unorderedCompare>
    <award matchPartial><when>$resp=<math>(1,2,3)</math></when></award>
  </answer></p>
  
  <p>Strict equality: <answer disableAfterCorrect="false" name="ansS">
    <award><when>$resp=<math>(1,2,3)</math></when></award>
  </answer></p>
  
  <p>Unordered: <answer disableAfterCorrect="false" name="ansU" unorderedCompare>
    <award><when>$resp=<math>(1,2,3)</math></when></award>
  </answer></p>
    `;

        await run_ordered_unordered_tests({ doenetML, delimiters: ["(", ")"] });
    });

    it("match set", async () => {
        const doenetML = `
  <mathInput name="resp" />

  <p>Match partial: <answer disableAfterCorrect="false" name="ansP">
    <award matchPartial><when>$resp=<math>{1,2,3}</math></when></award>
  </answer></p>
  
  <p>No partial: <answer disableAfterCorrect="false" name="ansS">
    <award><when>$resp=<math>{1,2,3}</math></when></award>
  </answer></p>`;

        await run_tests({
            doenetML,
            responseCredits: [
                { responses: { resp: "" }, credits: { P: 0, S: 0 } },
                {
                    responses: { resp: "\\{1,2,3\\}" },
                    credits: { P: 1, S: 1 },
                },
                {
                    responses: { resp: "\\{3,2,1\\}" },
                    credits: { P: 1, S: 1 },
                },
                {
                    responses: { resp: "\\{3,a,2,1\\}" },
                    credits: { P: 3 / 4, S: 0 },
                },
                {
                    responses: { resp: "\\{3,a,2,b,1\\}" },
                    credits: { P: 3 / 5, S: 0 },
                },
                {
                    responses: { resp: "\\{3,2,3,1,1\\}" },
                    credits: { P: 1, S: 1 },
                },
                {
                    responses: { resp: "\\{3,2,3,a,1,1\\}" },
                    credits: { P: 3 / 4, S: 0 },
                },
                {
                    responses: { resp: "1,2,3" },
                    credits: { P: 0, S: 0 },
                },
                {
                    responses: { resp: "3" },
                    credits: { P: 1 / 3, S: 0 },
                },
                {
                    responses: { resp: "\\{2,1\\}" },
                    credits: { P: 2 / 3, S: 0 },
                },
            ],
        });
    });

    it("match intervals", async () => {
        const doenetML = `
  <mathInput name="resp" />

  <p>Open, match partial: <answer disableAfterCorrect="false" name="ansOP">
    <award matchPartial><when>$resp=<math createIntervals>(1,2)</math></when></award>
  </answer></p>
  
  <p>Open, no partial: <answer disableAfterCorrect="false" name="ansOS">
    <award><when>$resp=<math createIntervals>(1,2)</math></when></award>
  </answer></p>

  <p>Closed, match partial: <answer disableAfterCorrect="false" name="ansCP">
    <award matchPartial><when>$resp=<math createIntervals>[1,2]</math></when></award>
  </answer></p>

  <p>Closed, no partial: <answer disableAfterCorrect="false" name="ansCS">
    <award><when>$resp=<math createIntervals>[1,2]</math></when></award>
  </answer></p>

  <p>Left open, match partial: <answer disableAfterCorrect="false" name="ansLP">
    <award matchPartial><when>$resp=<math>(1,2]</math></when></award>
  </answer></p>

  <p>Left open, no partial: <answer disableAfterCorrect="false" name="ansLS">
    <award><when>$resp=<math>(1,2]</math></when></award>
  </answer></p>

  <p>Right open, match partial: <answer disableAfterCorrect="false" name="ansRP">
    <award matchPartial><when>$resp=<math>[1,2)</math></when></award>
  </answer></p>

  <p>Right open, no partial: <answer disableAfterCorrect="false" name="ansRS">
    <award><when>$resp=<math>[1,2)</math></when></award>
  </answer></p>`;

        await run_tests({
            doenetML,
            responseCredits: [
                {
                    responses: { resp: "" },
                    credits: {
                        OP: 0,
                        OS: 0,
                        CP: 0,
                        CS: 0,
                        LP: 0,
                        LS: 0,
                        RP: 0,
                        RS: 0,
                    },
                },
                {
                    responses: { resp: "1" },
                    credits: {
                        OP: 0,
                        OS: 0,
                        CP: 0,
                        CS: 0,
                        LP: 0,
                        LS: 0,
                        RP: 0,
                        RS: 0,
                    },
                },
                {
                    responses: { resp: "(1,2)" },
                    credits: {
                        OP: 1,
                        OS: 1,
                        CP: 0,
                        CS: 0,
                        LP: 0,
                        LS: 0,
                        RP: 0,
                        RS: 0,
                    },
                },
                {
                    responses: { resp: "(3,2)" },
                    credits: {
                        OP: 0.5,
                        OS: 0,
                        CP: 0,
                        CS: 0,
                        LP: 0,
                        LS: 0,
                        RP: 0,
                        RS: 0,
                    },
                },
                {
                    responses: { resp: "[1,2]" },
                    credits: {
                        OP: 0,
                        OS: 0,
                        CP: 1,
                        CS: 1,
                        LP: 0,
                        LS: 0,
                        RP: 0,
                        RS: 0,
                    },
                },
                {
                    responses: { resp: "[1,3]" },
                    credits: {
                        OP: 0,
                        OS: 0,
                        CP: 0.5,
                        CS: 0,
                        LP: 0,
                        LS: 0,
                        RP: 0,
                        RS: 0,
                    },
                },
                {
                    responses: { resp: "[2,1]" },
                    credits: {
                        OP: 0,
                        OS: 0,
                        CP: 0,
                        CS: 0,
                        LP: 0,
                        LS: 0,
                        RP: 0,
                        RS: 0,
                    },
                },
                {
                    responses: { resp: "(1,2]" },
                    credits: {
                        OP: 0,
                        OS: 0,
                        CP: 0,
                        CS: 0,
                        LP: 1,
                        LS: 1,
                        RP: 0,
                        RS: 0,
                    },
                },
                {
                    responses: { resp: "(1,3]" },
                    credits: {
                        OP: 0,
                        OS: 0,
                        CP: 0,
                        CS: 0,
                        LP: 0.5,
                        LS: 0,
                        RP: 0,
                        RS: 0,
                    },
                },
                {
                    responses: { resp: "(2,1]" },
                    credits: {
                        OP: 0,
                        OS: 0,
                        CP: 0,
                        CS: 0,
                        LP: 0,
                        LS: 0,
                        RP: 0,
                        RS: 0,
                    },
                },
                {
                    responses: { resp: "[1,2)" },
                    credits: {
                        OP: 0,
                        OS: 0,
                        CP: 0,
                        CS: 0,
                        LP: 0,
                        LS: 0,
                        RP: 1,
                        RS: 1,
                    },
                },
                {
                    responses: { resp: "[1,3)" },
                    credits: {
                        OP: 0,
                        OS: 0,
                        CP: 0,
                        CS: 0,
                        LP: 0,
                        LS: 0,
                        RP: 0.5,
                        RS: 0,
                    },
                },
                {
                    responses: { resp: "[2,1)" },
                    credits: {
                        OP: 0,
                        OS: 0,
                        CP: 0,
                        CS: 0,
                        LP: 0,
                        LS: 0,
                        RP: 0,
                        RS: 0,
                    },
                },
            ],
        });
    });

    async function run_ordered_unordered_input_tests({
        doenetML,
        type,
    }: {
        doenetML: string;
        type: "math" | "text";
    }) {
        await run_tests({
            doenetML,
            type,
            responseCredits: [
                {
                    responses: { x: "", y: "", z: "" },
                    credits: { P: 0, PEP: 0, PU: 0, S: 0, U: 0 },
                },
                {
                    responses: { x: "x", y: "y", z: "z" },
                    credits: { P: 1, PEP: 1, PU: 1, S: 1, U: 1 },
                },
                {
                    responses: { x: "x", y: "z", z: "" },
                    credits: { P: 2 / 3, PEP: 1 / 3, PU: 2 / 3, S: 0, U: 0 },
                },
                {
                    responses: { x: "z", y: "x", z: "y" },
                    credits: { P: 2 / 3, PEP: 0, PU: 1, S: 0, U: 1 },
                },
                {
                    responses: { x: "z", y: "y", z: "x" },
                    credits: { P: 1 / 3, PEP: 1 / 3, PU: 1, S: 0, U: 1 },
                },
                {
                    responses: { x: "z", y: "", z: "x" },
                    credits: { P: 1 / 3, PEP: 0, PU: 2 / 3, S: 0, U: 0 },
                },
                {
                    responses: { x: "z", y: "x", z: "x" },
                    credits: { P: 1 / 3, PEP: 0, PU: 2 / 3, S: 0, U: 0 },
                },
                {
                    responses: { x: "x", y: "x", z: "z" },
                    credits: { P: 2 / 3, PEP: 2 / 3, PU: 2 / 3, S: 0, U: 0 },
                },
                {
                    responses: { x: "x", y: "x", z: "y" },
                    credits: { P: 2 / 3, PEP: 1 / 3, PU: 2 / 3, S: 0, U: 0 },
                },
            ],
        });
    }
    it("match partial with ordered and unordered math inputs", async () => {
        const doenetML = `
  <p><mathInput name="x"/></p>
  <p><mathInput name="y"/></p>
  <p><mathInput name="z"/></p>

  <section><title>Match partial</title>

  <answer disableAfterCorrect="false" name="ansP">
    <award>
      <when matchPartial>
        <math>
          $x, $y, $z
        </math>
        =
        <math>x,y,z</math>
      </when>
    </award>
  </answer>
  </section>

  <section><title>Match partial, match by exact positions</title>

  <answer disableAfterCorrect="false" name="ansPEP">
  <award>
    <when matchPartial matchByExactPositions>
      <math>
        $x, $y, $z
      </math>
      =
      <math>x,y,z</math>
    </when>
  </award>
</answer>
</section>


  <section><title>Match partial, unordered</title>
  <answer disableAfterCorrect="false" name="ansPU">
    <award>
      <when matchPartial>
        <math unordered="true">
          $x, $y, $z
        </math>
        =
        <math>x,y,z</math>
      </when>
    </award>
  </answer>
  </section>

  <section><title>Strict equality</title>
   <answer disableAfterCorrect="false" name="ansS">
   <award>
     <when>
       <math>
         $x, $y, $z
       </math>
       =
       <math>x,y,z</math>
     </when>
   </award>
 </answer>
 </section>

  <section><title>Unordered</title>
    <answer disableAfterCorrect="false" name="ansU">
    <award>
      <when>
        <math unordered="true">
          $x, $y, $z
        </math>
        =
        <math>x,y,z</math>
      </when>
    </award>
  </answer>
  </section>`;

        await run_ordered_unordered_input_tests({ doenetML, type: "math" });
    });

    it("match partial with ordered and unordered text inputs", async () => {
        const doenetML = `
  <p><textInput name="x"/></p>
  <p><textInput name="y"/></p>
  <p><textInput name="z"/></p>

  <section><title>Match partial</title>

  <answer disableAfterCorrect="false" name="ansP">
    <award>
      <when matchPartial>
        <textList>
          $x $y $z
        </textList>
        =
        <textList>x y z</textList>
      </when>
    </award>
  </answer>
  </section>

  <section><title>Match partial, match by exact positions</title>

  <answer disableAfterCorrect="false" name="ansPEP">
  <award>
    <when matchPartial matchByExactPositions>
      <textList>
        $x $y $z
      </textList>
      =
      <textList>x y z</textList>
    </when>
  </award>
</answer>
</section>


  <section><title>Match partial, unordered</title>
  <answer disableAfterCorrect="false" name="ansPU">
    <award>
      <when matchPartial>
        <textList unordered="true">
          $x $y $z
        </textList>
        =
        <textList>x y z</textList>
      </when>
    </award>
  </answer>
  </section>

  <section><title>Strict equality</title>
   <answer disableAfterCorrect="false" name="ansS">
   <award>
     <when>
       <textList>
         $x $y $z
       </textList>
       =
       <textList>x y z</textList>
     </when>
   </award>
 </answer>
 </section>

  <section><title>Unordered</title>
    <answer disableAfterCorrect="false" name="ansU">
    <award>
      <when>
        <textList unordered="true">
          $x $y $z
        </textList>
        =
        <textList>x y z</textList>
      </when>
    </award>
  </answer>
  </section>`;

        await run_ordered_unordered_input_tests({ doenetML, type: "text" });
    });

    it("match partial with ordered and unordered boolean inputs", async () => {
        const doenetML = `
  <p><booleanInput name="x"/></p>
  <p><booleanInput name="y"/></p>
  <p><booleanInput name="z"/></p>

  <section><title>Match partial</title>

  <answer disableAfterCorrect="false" name="ansP">
    <award>
      <when matchPartial>
        <booleanList>
          $x $y $z
        </booleanList>
        =
        <booleanList>false true true</booleanList>
      </when>
    </award>
  </answer>
  </section>

  <section><title>Match partial, match by exact positions</title>

  <answer disableAfterCorrect="false" name="ansPEP">
  <award>
    <when matchPartial matchByExactPositions>
      <booleanList>
        $x $y $z
      </booleanList>
      =
      <booleanList>false true true</booleanList>
    </when>
  </award>
</answer>
</section>


  <section><title>Match partial, unordered</title>
  <answer disableAfterCorrect="false" name="ansPU">
    <award>
      <when matchPartial>
        <booleanList unordered="true">
          $x $y $z
        </booleanList>
        =
        <booleanList>false true true</booleanList>
      </when>
    </award>
  </answer>
  </section>

  <section><title>Strict equality</title>
   <answer disableAfterCorrect="false" name="ansS">
   <award>
     <when>
       <booleanList>
         $x $y $z
       </booleanList>
       =
       <booleanList>false true true</booleanList>
     </when>
   </award>
 </answer>
 </section>

  <section><title>Unordered</title>
    <answer disableAfterCorrect="false" name="ansU">
    <award>
      <when>
        <booleanList unordered="true">
          $x $y $z
        </booleanList>
        =
        <booleanList>false true true</booleanList>
      </when>
    </award>
  </answer>
  </section>`;

        await run_tests({
            doenetML,
            type: "boolean",
            responseCredits: [
                {
                    responses: { x: false, y: true, z: true },
                    credits: { P: 1, PEP: 1, PU: 1, S: 1, U: 1 },
                },
                {
                    responses: { x: true, y: true, z: true },
                    credits: { P: 2 / 3, PEP: 2 / 3, PU: 2 / 3, S: 0, U: 0 },
                },
                {
                    responses: { x: true, y: false, z: true },
                    credits: { P: 2 / 3, PEP: 1 / 3, PU: 1, S: 0, U: 1 },
                },
                {
                    responses: { x: true, y: false, z: false },
                    credits: { P: 1 / 3, PEP: 0, PU: 2 / 3, S: 0, U: 0 },
                },
                {
                    responses: { x: false, y: false, z: false },
                    credits: { P: 1 / 3, PEP: 1 / 3, PU: 1 / 3, S: 0, U: 0 },
                },
            ],
        });
    });

    async function test_combined_ordered_unordered_tuples({
        doenetML,
        inner_no_partial = false,
        force_ordered = false,
    }: {
        doenetML: string;
        inner_no_partial?: boolean;
        force_ordered?: boolean;
    }) {
        await run_tests({
            doenetML,
            responseCredits: [
                {
                    responses: { m1: "(1,2)", m2: "(3,4)" },
                    credits: { P: 1, S: 1 },
                },
                {
                    responses: { m1: "2", m2: "(3,4)" },
                    credits: { P: 3 / 4, S: 0 },
                },
                {
                    responses: { m1: "2", m2: "3" },
                    credits: { P: inner_no_partial ? 1 / 4 : 1 / 2, S: 0 },
                },
                {
                    responses: { m1: "(2,1)", m2: "(3,4)" },
                    credits: { P: 3 / 4, S: 0 },
                },
                {
                    responses: { m1: "(2,1)", m2: "(4,3)" },
                    credits: { P: force_ordered ? 1 / 2 : 3 / 4, S: 0 },
                },
                {
                    responses: { m1: "(1,2)", m2: "(4,3)" },
                    credits: force_ordered
                        ? { P: 3 / 4, S: 0 }
                        : { P: 1, S: 1 },
                },
            ],
        });
    }

    it("match partial with combined ordered/unordered tuples", async () => {
        const doenetML = `
  <mathInput name="m1"/>
  <mathInput name="m2"/>

  <p>Match partial: <answer disableAfterCorrect="false" name="ansP">
    <award matchPartial>
      <when>
        $m1 = (1,2)
        and
        $m2 = <math unordered>(3,4)</math>
      </when>
    </award>
  </answer></p>
  
  <p>Strict equality: <answer disableAfterCorrect="false" name="ansS">
    <award>
      <when>
        $m1 = (1,2)
        and
        $m2 = <math unordered>(3,4)</math>
      </when>
    </award>
  </answer></p>`;
        await test_combined_ordered_unordered_tuples({ doenetML });
    });

    it("match partial with combined ordered/unordered tuples via whens", async () => {
        const doenetML = `
  <mathInput name="m1"/>
  <mathInput name="m2"/>

  <p>Match partial: <answer disableAfterCorrect="false" name="ansP">
    <award matchPartial>
      <when>
        $m1 = (1,2)
        and
        <when unorderedCompare>$m2 = (3,4)</when>
      </when>
    </award>
  </answer></p>
  
  <p>Strict equality: <answer disableAfterCorrect="false" name="ansS">
    <award>
      <when>
        $m1 = (1,2)
        and
        <when unorderedCompare>$m2 = (3,4)</when>
      </when>
    </award>
  </answer></p>`;
        await test_combined_ordered_unordered_tuples({ doenetML });
    });

    it("match partial with combined ordered/unordered tuples via booleans", async () => {
        const doenetML = `
  <mathInput name="m1"/>
  <mathInput name="m2"/>

  <p>Match partial: <answer disableAfterCorrect="false" name="ansP">
    <award matchPartial>
      <when>
        $m1 = (1,2)
        and
        <boolean unorderedCompare>$m2 = (3,4)</boolean>
      </when>
    </award>
  </answer></p>
  
  <p>Strict equality: <answer disableAfterCorrect="false" name="ansS">
    <award>
      <when>
        $m1 = (1,2)
        and
        <boolean unorderedCompare>$m2 = (3,4)</boolean>
      </when>
    </award>
  </answer></p>`;
        await test_combined_ordered_unordered_tuples({
            doenetML,
            inner_no_partial: true,
        });
    });

    it("mixed match partial and ordered/unordered tuples via whens", async () => {
        const doenetML = `
  <mathInput name="m1"/>
  <mathInput name="m2"/>

  <p>Match partial: <answer disableAfterCorrect="false" name="ansP">
    <award matchPartial>
      <when>
        $m1 = (1,2)
        and
        <when unorderedCompare matchPartial="false">$m2 = (3,4)</when>
      </when>
    </award>
  </answer></p>
  
  <p>No net effect of inner matchPartial: <answer disableAfterCorrect="false" name="ansS">
    <award>
      <when>
        $m1 = (1,2)
        and
        <when unorderedCompare matchPartial>$m2 = (3,4)</when>
      </when>
    </award>
  </answer></p>`;
        await test_combined_ordered_unordered_tuples({
            doenetML,
            inner_no_partial: true,
        });
    });

    it("match partial with combined ordered/unordered tuples, force ordered compare", async () => {
        const doenetML = `
  <mathInput name="m1"/>
  <mathInput name="m2"/>

  <p>Match partial: <answer disableAfterCorrect="false" name="ansP">
    <award matchPartial>
      <when unorderedCompare="false">
        $m1 = (1,2)
        and
        $m2 = <math unordered>(3,4)</math>
      </when>
    </award>
  </answer></p>
  
  <p>Strict equality: <answer disableAfterCorrect="false" name="ansS">
    <award>
      <when unorderedCompare="false">
        $m1 = (1,2)
        and
        $m2 = <math unordered>(3,4)</math>
      </when>
    </award>
  </answer></p>`;

        await test_combined_ordered_unordered_tuples({
            doenetML,
            force_ordered: true,
        });
    });

    it("match partial with combined ordered/unordered tuples via whens, no effect of force ordered compare", async () => {
        const doenetML = `
  <mathInput name="m1"/>
  <mathInput name="m2"/>

  <p>Match partial: <answer disableAfterCorrect="false" name="ansP">
    <award matchPartial>
      <when unorderedCompare="false">
        $m1 = (1,2)
        and
        <when unorderedCompare>$m2 = (3,4)</when>
      </when>
    </award>
  </answer></p>
  
  <p>Strict equality: <answer disableAfterCorrect="false" name="ansS">
    <award>
      <when unorderedCompare="false">
        $m1 = (1,2)
        and
        <when unorderedCompare>$m2 = (3,4)</when>
      </when>
    </award>
  </answer></p>`;

        await test_combined_ordered_unordered_tuples({ doenetML });
    });

    it("match partial with combined ordered/unordered boolean inputs", async () => {
        const doenetML = `
  <p><booleanInput name="u"/></p>
  <p><booleanInput name="v"/></p>
  <p><booleanInput name="x"/></p>
  <p><booleanInput name="y"/></p>

  <p>Match partial:
  <answer disableAfterCorrect="false" name="ansP">
    <award>
      <when matchPartial>
        <booleanList>$u $v</booleanList>
        =
        <booleanList>true false</booleanList>
        and 
        <booleanList>$x $y</booleanList>
        =
        <booleanList unordered>true false</booleanList>
      </when>
    </award>
  </answer>
  </p>

  <p>Strict:
  <answer disableAfterCorrect="false" name="ansS">
    <award>
      <when>
        <booleanList>$u $v</booleanList>
        =
        <booleanList>true false</booleanList>
        and 
        <booleanList>$x $y</booleanList>
        =
        <booleanList unordered>true false</booleanList>
      </when>
    </award>
  </answer>
  </p>`;

        await run_tests({
            doenetML,
            type: "boolean",
            responseCredits: [
                {
                    responses: {
                        u: true,
                        v: false,
                        x: true,
                        y: false,
                    },
                    credits: { P: 1, S: 1 },
                },
                {
                    responses: {
                        u: true,
                        v: true,
                        x: true,
                        y: false,
                    },
                    credits: { P: 3 / 4, S: 0 },
                },
                {
                    responses: {
                        u: true,
                        v: true,
                        x: true,
                        y: true,
                    },
                    credits: { P: 1 / 2, S: 0 },
                },
                {
                    responses: {
                        u: false,
                        v: true,
                        x: true,
                        y: true,
                    },
                    credits: { P: 1 / 2, S: 0 },
                },
                {
                    responses: {
                        u: false,
                        v: true,
                        x: false,
                        y: true,
                    },
                    credits: { P: 3 / 4, S: 0 },
                },
                {
                    responses: {
                        u: true,
                        v: false,
                        x: false,
                        y: true,
                    },
                    credits: { P: 1, S: 1 },
                },
            ],
        });
    });

    async function test_tuple_vector_matches(doenetML: string) {
        await run_tests({
            doenetML,
            responseCredits: [
                { responses: { mi: "(1,2)" }, credits: { 1: 0.5, 2: 0.5 } },
                {
                    responses: { mi: "(1,2),(3,4)" },
                    credits: { 1: 1, 2: 1 },
                },
                { responses: { mi: "(3,4)" }, credits: { 1: 0.5, 2: 0.5 } },
                {
                    responses: { mi: "\\langle 1,2 \\rangle" },
                    credits: { 1: 0.5, 2: 0.5 },
                },
                {
                    responses: {
                        mi: "\\langle 1,2 \\rangle,\\langle 3,4 \\rangle",
                    },
                    credits: { 1: 1, 2: 1 },
                },
            ],
        });
    }

    it("match tuple with list of tuples", async () => {
        const doenetML = `
  <p>
  <mathInput name="mi" />
  <answer disableAfterCorrect="false" name="ans1">
    <award referencesAreResponses="$mi">
      <when matchPartial>
        $mi = <mathList><math>(1,2)</math><math>(3,4)</math></mathList>
      </when>
    </award>
  </answer>
  <answer disableAfterCorrect="false" name="ans2">
    <award referencesAreResponses="$mi">
      <when matchPartial>
        <mathList><math>(1,2)</math><math>(3,4)</math></mathList> = $mi
      </when>
    </award>
  </answer>
  </p>`;

        await test_tuple_vector_matches(doenetML);
    });

    it("match tuple with list of vectors", async () => {
        const doenetML = `
  <p>
  <mathInput name="mi" />
  <answer disableAfterCorrect="false" name="ans1">
    <award referencesAreResponses="$mi">
      <when matchPartial>
        $mi = <mathList><math createVectors>(1,2)</math><math createVectors>(3,4)</math></mathList>
      </when>
    </award>
  </answer>
  <answer disableAfterCorrect="false" name="ans2">
    <award referencesAreResponses="$mi">
      <when matchPartial>
        <mathList><math createVectors>(1,2)</math><math createVectors>(3,4)</math></mathList> = $mi
      </when>
    </award>
  </answer>
  </p>`;

        await test_tuple_vector_matches(doenetML);
    });

    it("match vector with list of tuples", async () => {
        const doenetML = `
  <p>
  <mathInput name="mi" />
  <answer disableAfterCorrect="false" name="ans1">
    <award referencesAreResponses="$mi">
      <when matchPartial>
        <math createVectors>$mi</math> = <mathList><math>(1,2)</math><math>(3,4)</math></mathList>
      </when>
    </award>
  </answer>
  <answer disableAfterCorrect="false" name="ans2">
    <award referencesAreResponses="$mi">
      <when matchPartial>
        <mathList><math>(1,2)</math><math>(3,4)</math></mathList> = <math createVectors>$mi</math>
      </when>
    </award>
  </answer>
  </p>`;

        await test_tuple_vector_matches(doenetML);
    });

    it("match vector with list of vectors", async () => {
        const doenetML = `
  <p>
  <mathInput name="mi" />
  <answer disableAfterCorrect="false" name="ans1">
    <award referencesAreResponses="$mi">
      <when matchPartial>
        <math createVectors>$mi</math> = <mathList><math createVectors>(1,2)</math><math createVectors>(3,4)</math></mathList>
      </when>
    </award>
  </answer>
  <answer disableAfterCorrect="false" name="ans2">
    <award referencesAreResponses="$mi">
      <when matchPartial>
        <mathList><math createVectors>(1,2)</math><math createVectors>(3,4)</math></mathList> = <math createVectors>$mi</math>
      </when>
    </award>
  </answer>
  </p>`;

        await test_tuple_vector_matches(doenetML);
    });

    it("match interval with list of intervals", async () => {
        const doenetML = `
  <p>
  <mathInput name="mi" />
  <answer disableAfterCorrect="false" name="ans1">
    <award referencesAreResponses="$mi">
      <when matchPartial>
        $mi = <mathList><math>[1,2)</math><math>(3,4]</math></mathList>
      </when>
    </award>
  </answer>
  <answer disableAfterCorrect="false" name="ans2">
    <award referencesAreResponses="$mi">
      <when matchPartial>
        <mathList><math>[1,2)</math><math>(3,4]</math></mathList> = $mi
      </when>
    </award>
  </answer>
  </p>`;

        await run_tests({
            doenetML,
            responseCredits: [
                { responses: { mi: "[1,2)" }, credits: { 1: 0.5, 2: 0.5 } },
                {
                    responses: { mi: "[1,2),(3,4]" },
                    credits: { 1: 1, 2: 1 },
                },
                { responses: { mi: "(3,4]" }, credits: { 1: 0.5, 2: 0.5 } },
            ],
        });
    });

    it("match interval with list of intervals", async () => {
        const doenetML = `
  <p>
  <mathInput name="mi" />
  <answer disableAfterCorrect="false" name="ans1">
    <award referencesAreResponses="$mi">
      <when matchPartial>
        $mi = <mathList><math>[1,2]</math><math>[3,4]</math></mathList>
      </when>
    </award>
  </answer>
  <answer disableAfterCorrect="false" name="ans2">
    <award referencesAreResponses="$mi">
      <when matchPartial>
        <mathList><math>[1,2]</math><math>[3,4]</math></mathList> = $mi
      </when>
    </award>
  </answer>
  </p>`;

        await run_tests({
            doenetML,
            responseCredits: [
                { responses: { mi: "[1,2]" }, credits: { 1: 0.5, 2: 0.5 } },
                {
                    responses: { mi: "[1,2],[3,4]" },
                    credits: { 1: 1, 2: 1 },
                },
                { responses: { mi: "[3,4]" }, credits: { 1: 0.5, 2: 0.5 } },
            ],
        });
    });

    it("match partial and unordered do not recurse on math lists", async () => {
        const doenetML = `
  <p>
  <mathInput name="mi" />
  <answer disableAfterCorrect="false" name="ansP">
    <award referencesAreResponses="$mi">
      <when matchPartial>
        $mi = <mathList>(1,2) (3,4)</mathList>
      </when>
    </award>
  </answer>
  <answer disableAfterCorrect="false" name="ansPU">
    <award referencesAreResponses="$mi">
      <when matchPartial unorderedCompare>
        $mi = <mathList>(1,2) (3,4)</mathList>
      </when>
    </award>
  </answer>
  </p>`;

        await run_tests({
            doenetML,
            responseCredits: [
                {
                    responses: { mi: "(1,2),(3,4)" },
                    credits: { P: 1, PU: 1 },
                },
                {
                    responses: { mi: "(1,-2),(3,4)" },
                    credits: { P: 0.5, PU: 0.5 },
                },
                {
                    responses: { mi: "(3,4),(1,2)" },
                    credits: { P: 0.5, PU: 1 },
                },
                {
                    responses: { mi: "(1,2),(4,3)" },
                    credits: { P: 0.5, PU: 0.5 },
                },
            ],
        });
    });
});
