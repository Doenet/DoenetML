import { u as n, j as s, V as u, I as c } from "./index-dce15b2c.js";
import d, { useEffect as f } from "react";
const p = d.memo(function(o) {
  let { name: g, id: i, SVs: t, children: h, actions: e, callAction: a } = n(o), r = (l) => {
    e.recordVisibilityChange && a({
      action: e.recordVisibilityChange,
      args: { isVisible: l }
    });
  };
  return f(() => () => {
    e.recordVisibilityChange && a({
      action: e.recordVisibilityChange,
      args: { isVisible: !1 }
    });
  }, []), t.hidden ? null : /* @__PURE__ */ s.jsx(u, { partialVisibility: !0, onChange: r, children: /* @__PURE__ */ s.jsx(
    c,
    {
      doenetML: t.doenetML,
      flags: {
        showCorrectness: !0,
        solutionDisplayMode: "button",
        showFeedback: !0,
        showHints: !0,
        autoSubmit: !1,
        allowLoadState: !1,
        allowSaveState: !1,
        allowLocalState: !1,
        allowSaveSubmissions: !1,
        allowSaveEvents: !1
      },
      pageIsActive: !0,
      prefixForIds: i,
      pageNumber: i.replace(/[#\\\/]/g, "")
    }
  ) });
});
export {
  p as default
};
