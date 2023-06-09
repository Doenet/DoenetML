import { u as h, d as g, G as j, H as k, j as t } from "./index-7c50cb13.js";
import R from "react";
import { L as B } from "./index-bdc9901b.js";
import y from "styled-components";
const c = y.button`
  position: relative;
  height: 24px;
  display: inline-block;
  color: white;
  color: ${(a) => a.disabled ? "var(--canvastext)" : "var(--canvas)"};
  background-color: ${(a) => a.disabled ? "var(--mainGray)" : "var(--mainBlue)"};

  padding: 2px;
  border: none;
  border-radius: var(--mainBorderRadius);
  cursor: pointer;
  cursor: ${(a) => a.disabled ? "not-allowed" : "pointer"};
  padding: 1px 6px 1px 6px;

  &:hover {
    background-color: ${(a) => a.disabled ? "var(--mainGray)" : "var(--lightBlue)"};
    color: ${(a) => a.disabled ? "var(--canvastext)" : "var(--canvas)"};
  }

  &:focus {
    outline: 2px solid var(--mainBlue);
    outline-offset: 2px;
  }
`, L = R.memo(function(u) {
  let { name: _, id: r, SVs: e, children: s, location: p, navigate: x } = h(u);
  const i = g(j);
  let m = p.search || "";
  if (e.hidden)
    return null;
  let o = s;
  s.length === 0 && (o = e.linkText);
  let { targetForATag: l, url: n, haveValidTarget: b, externalUri: v } = k({
    cid: e.cid,
    doenetId: e.doenetId,
    variantIndex: e.variantIndex,
    edit: e.edit,
    hash: e.hash,
    page: e.page,
    givenUri: e.uri,
    targetName: e.targetName,
    search: m,
    id: r
  });
  if (e.createButton)
    return l === "_blank" ? /* @__PURE__ */ t.jsxs("span", { id: r, children: [
      /* @__PURE__ */ t.jsx("a", { name: r }),
      /* @__PURE__ */ t.jsx(
        c,
        {
          id: r + "_button",
          onClick: () => window.open(n, l),
          disabled: e.disabled,
          children: e.linkText
        }
      )
    ] }) : /* @__PURE__ */ t.jsxs("span", { id: r, children: [
      /* @__PURE__ */ t.jsx("a", { name: r }),
      /* @__PURE__ */ t.jsx(
        c,
        {
          id: r + "_button",
          onClick: () => x(n),
          disabled: e.disabled,
          children: e.linkText
        }
      )
    ] });
  if (b) {
    if (v || n === "#")
      return /* @__PURE__ */ t.jsx(
        "a",
        {
          style: {
            color: "var(--mainBlue)",
            borderRadius: "5px"
          },
          target: l,
          id: r,
          name: r,
          href: n,
          children: o
        }
      );
    {
      let f = i === window ? "scrollY" : "scrollTop", d = { fromLink: !0 };
      return Object.defineProperty(d, "previousScrollPosition", {
        get: () => i == null ? void 0 : i[f],
        enumerable: !0
      }), /* @__PURE__ */ t.jsx(
        B,
        {
          style: {
            color: "var(--mainBlue)",
            borderRadius: "5px"
          },
          target: l,
          id: r,
          name: r,
          to: n,
          state: d,
          children: o
        }
      );
    }
  } else
    return /* @__PURE__ */ t.jsx("span", { id: r, children: o });
});
export {
  L as default
};
