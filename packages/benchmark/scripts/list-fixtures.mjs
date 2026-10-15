// Print the corpus: name, where the text comes from, its size, and the
// actions the manifest drives. Doubles as a check that every manifest
// resolves to text.
import { fixtureText, listFixtures } from "../src/fixtures.mjs";

const rows = listFixtures().map((m) => {
    const text = fixtureText(m);
    const src = m.source.generate ? `generated ${m.source.generate}` : m.source.file ?? m.source.path;
    const steps = m.steps.map((s) => `${s.action} ${s.target}`).filter((s, i, a) => a.indexOf(s) === i).join(", ");
    const structural = m.structural ? `${m.structural[0].action} ${m.structural[0].target}` : "";
    return [m.name, m.tier, src, text.length, steps, structural];
});
const w = rows.reduce((acc, r) => r.map((c, i) => Math.max(acc[i] ?? 0, String(c).length)), []);
for (const r of rows) {
    console.log(r.map((c, i) => String(c)[i === 3 ? "padStart" : "padEnd"](w[i])).join("  "));
}
