import assert from "node:assert/strict";

import { convert } from "../convert.js";

const sampleProblem = String.raw`DOCUMENT();
BEGIN_TEXT
Solve \{ ans_rule(10) \}
END_TEXT

$a = Compute("x^2");
ANS($a);
ENDDOCUMENT();`;

const output = convert(sampleProblem);

assert.match(output, /<math name="a" simplify="full">x\^2<\/math>/);
assert.match(output, /<mathInput name="mi1" \/>/);
assert.match(
    output,
    /<answer><award><when>\$mi1 = \$a<\/when><\/award><\/answer>/,
);

console.log("webwork-to-doenetml smoke test passed");
