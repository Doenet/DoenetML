import { u as s, j as a } from "./index-64c78e6b.js";
import i from "react";
import "react-dom";
import "styled-components";
const b = i.memo(function(o) {
  let { name: u, id: n, SVs: e, actions: r, callAction: t } = s(o, !1);
  return e.hidden ? null : /* @__PURE__ */ a.jsxs("p", { id: n, children: [
    /* @__PURE__ */ a.jsx("a", { name: n }),
    /* @__PURE__ */ a.jsx(
      "button",
      {
        id: n + "_previous",
        onClick: () => {
          t({
            action: r.setPage,
            args: { number: e.currentPage - 1 }
          });
        },
        disabled: e.disabled || !(e.currentPage > 1),
        children: e.previousLabel
      }
    ),
    " " + e.pageLabel,
    " ",
    e.currentPage,
    " of ",
    e.numPages + " ",
    /* @__PURE__ */ a.jsx(
      "button",
      {
        id: n + "_next",
        onClick: () => {
          t({
            action: r.setPage,
            args: { number: e.currentPage + 1 }
          });
        },
        disabled: e.disabled || !(e.currentPage < e.numPages),
        children: e.nextLabel
      }
    )
  ] });
});
export {
  b as default
};
