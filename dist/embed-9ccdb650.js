import { u as w, j as t, V as h } from "./index-7c50cb13.js";
import x, { useEffect as g } from "react";
import { s } from "./css-ab4d83ca.js";
const v = x.memo(function(b) {
  let { name: j, id: a, SVs: e, actions: o, callAction: n } = w(b), d = (l) => {
    n({
      action: o.recordVisibilityChange,
      args: { isVisible: l }
    });
  };
  if (g(() => () => {
    n({
      action: o.recordVisibilityChange,
      args: { isVisible: !1 }
    });
  }, []), g(() => {
    if (e.encodedGeogebraContent) {
      let l = e, f = a, u = s(e.width), p = s(e.height);
      window.MathJax.Hub.Register.StartupHook("End", function() {
        let m = {
          id: f,
          width: u,
          height: p,
          showResetIcon: !1,
          enableLabelDrags: !1,
          useBrowserForJS: !0,
          showMenubar: !1,
          errorDialogsActive: !0,
          showToolbar: !1,
          showAlgebraicInput: !1,
          enableShiftDragZoom: !0,
          enableRightClick: !0,
          showToolBarHelp: !1,
          ggbBase64: l.encodedGeogebraContent.trim(),
          language: "en",
          country: "US",
          isPreloader: !1,
          screenshotGenerator: !1,
          preventFocus: !1,
          fixApplet: !1,
          prerelease: !1,
          playButtonAutoDecide: !0,
          playButton: !1,
          canary: !1,
          allowUpscale: !1
        }, c = new window.GGBApplet(m, !0);
        c.setHTML5Codebase("/geogebra/HTML5/5.0/web/", "true"), c.inject("container_" + f, "preferhtml5");
      });
    }
  }, []), e.hidden)
    return null;
  let i = s(e.width), r = s(e.height);
  return e.geogebra ? /* @__PURE__ */ t.jsx(h, { partialVisibility: !0, onChange: d, children: /* @__PURE__ */ t.jsxs("div", { className: "geogebra", id: a, children: [
    /* @__PURE__ */ t.jsx("a", { name: a }),
    /* @__PURE__ */ t.jsx(
      "iframe",
      {
        scrolling: "no",
        title: "",
        src: `https://www.geogebra.org/material/iframe/id/${e.geogebra}/width/${i}/height/${r}/border/888888/sfsb/true/smb/false/stb/false/stbh/false/ai/false/asb/false/sri/false/rc/false/ld/false/sdz/false/ctl/false`,
        width: i,
        height: r,
        style: { border: "0px" },
        children: " "
      }
    )
  ] }) }) : e.encodedGeogebraContent ? /* @__PURE__ */ t.jsx(h, { partialVisibility: !0, onChange: d, children: /* @__PURE__ */ t.jsx("div", { className: "javascriptapplet", id: a, children: /* @__PURE__ */ t.jsx(
    "div",
    {
      className: "geogebrawebapplet",
      id: "container_" + a,
      style: { minWidth: i, minHeight: r }
    }
  ) }) }) : (console.warn("Nothing specified to embed"), null);
});
export {
  v as default
};
