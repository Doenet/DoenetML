import { u as f, d as h, G as g, H as j, j as t } from "./index-8862516e.js";
import k from "react";
import { u as R, a as B, L as y } from "./index-f787cc75.js";
import _ from "styled-components";
import "react-dom";
const u = _.button`
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
`, C = k.memo(function(c) {
  let { name: w, id: r, SVs: e, children: s } = f(c);
  const n = h(g);
  let { search: p } = R(), x = B();
  if (e.hidden)
    return null;
  let o = s;
  s.length === 0 && (o = e.linkText);
  let { targetForATag: l, url: i, haveValidTarget: m, externalUri: v } = j({
    cid: e.cid,
    doenetId: e.doenetId,
    variantIndex: e.variantIndex,
    edit: e.edit,
    hash: e.hash,
    page: e.page,
    givenUri: e.uri,
    targetName: e.targetName,
    search: p,
    id: r
  });
  if (e.createButton)
    return l === "_blank" ? /* @__PURE__ */ t.jsxs("span", { id: r, children: [
      /* @__PURE__ */ t.jsx("a", { name: r }),
      /* @__PURE__ */ t.jsx(
        u,
        {
          id: r + "_button",
          onClick: () => window.open(i, l),
          disabled: e.disabled,
          children: e.linkText
        }
      )
    ] }) : /* @__PURE__ */ t.jsxs("span", { id: r, children: [
      /* @__PURE__ */ t.jsx("a", { name: r }),
      /* @__PURE__ */ t.jsx(
        u,
        {
          id: r + "_button",
          onClick: () => x(i),
          disabled: e.disabled,
          children: e.linkText
        }
      )
    ] });
  if (m) {
    if (v || i === "#")
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
          href: i,
          children: o
        }
      );
    {
      let b = n === window ? "scrollY" : "scrollTop", d = { fromLink: !0 };
      return Object.defineProperty(d, "previousScrollPosition", {
        get: () => n == null ? void 0 : n[b],
        enumerable: !0
      }), /* @__PURE__ */ t.jsx(
        y,
        {
          style: {
            color: "var(--mainBlue)",
            borderRadius: "5px"
          },
          target: l,
          id: r,
          name: r,
          to: i,
          state: d,
          children: o
        }
      );
    }
  } else
    return /* @__PURE__ */ t.jsx("span", { id: r, children: o });
});
export {
  C as default
};
