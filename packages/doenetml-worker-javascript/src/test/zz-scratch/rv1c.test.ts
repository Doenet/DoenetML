import { it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
vi.stubGlobal("postMessage", vi.fn());
vi.mock("hyperformula");
it("c", async () => {
  const L: string[] = [];
  const doc = `<graph><math name="m" anchor="(1,2)">x</math></graph><graph><math name="c" copy="$m"/></graph>`;
  let tc: any = await createTestCore({ doenetML: doc });
  const show = async (tag: string) => {
    const c = tc.core.core._components[await tc.resolvePathToNodeIdx("c")];
    const a = c.attributes.anchor;
    L.push(tag + " attr " + JSON.stringify(a, (k, v) => (v && v.tree !== undefined ? { ME: v.tree } : v)) + " ess " + JSON.stringify(c.essentialState, (k, v) => (v && v.tree !== undefined ? { ME: v.tree } : v)));
  };
  await show("init");
  await tc.core.requestAction({ componentIdx: await tc.resolvePathToNodeIdx("m"), actionName: "moveMath", args: { x: 3, y: -5 } });
  await tc.core.saveImmediately();
  L.push("saved " + tc.scoreState.state);
  tc = await createTestCore({ doenetML: doc, initialState: tc.scoreState.state });
  await tc.core.returnAllStateVariables(false, true);
  await show("restored");
  await tc.core.requestAction({ componentIdx: await tc.resolvePathToNodeIdx("c"), actionName: "moveMath", args: { x: 6, y: 6 } });
  await show("dragged");
  require("fs").writeFileSync(process.env.RV1_OUT!, L.join("\n"));
}, 900000);
