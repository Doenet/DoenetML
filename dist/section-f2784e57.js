import { u as R, j as e, F as p, J as B, K as w, V as f, f as S, a as A, b as V, c as T } from "./index-dce15b2c.js";
import _, { useEffect as F, useRef as L } from "react";
const G = _.memo(function(v) {
  var g;
  let { name: E, id: t, SVs: i, children: l, actions: x, callAction: m } = R(v), b = (r) => {
    m({
      action: x.recordVisibilityChange,
      args: { isVisible: r }
    });
  };
  if (F(() => () => {
    m({
      action: x.recordVisibilityChange,
      args: { isVisible: !1 }
    });
  }, []), i.hidden)
    return null;
  let o = L(null);
  const k = () => {
    o.current = "unvalidated", i.justSubmitted && (i.creditAchieved === 1 ? o.current = "correct" : i.creditAchieved === 0 ? o.current = "incorrect" : o.current = "partialcorrect");
  };
  let j = () => m({
    action: x.submitAllAnswers
  }), n;
  if (i.titleChildName) {
    for (let [r, h] of l.entries())
      if (((g = h == null ? void 0 : h.props) == null ? void 0 : g.componentInstructions.componentName) === i.titleChildName) {
        n = l[r], l.splice(r, 1);
        break;
      }
  }
  n ? n = /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    i.titlePrefix,
    n
  ] }) : i.inAList || (n = i.title);
  let a = null, u = t + "_title";
  i.collapsible && (i.open ? n = /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx(p, { icon: B }),
    " ",
    n,
    " (click to close)"
  ] }) : n = /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx(p, { icon: w }),
    " ",
    n,
    " (click to open)"
  ] }));
  let c = {};
  switch ((i.collapsible || i.boxed) && (c = {
    marginBlockStart: 0,
    marginBlockEnd: 0
  }), i.level) {
    case 0:
      a = /* @__PURE__ */ e.jsx("h1", { id: u, style: c, children: n });
      break;
    case 1:
      a = /* @__PURE__ */ e.jsx("h2", { id: u, style: c, children: n });
      break;
    case 2:
      a = /* @__PURE__ */ e.jsx("h3", { id: u, style: c, children: n });
      break;
    case 3:
      a = /* @__PURE__ */ e.jsx("h4", { id: u, style: c, children: n });
      break;
    case 4:
      a = /* @__PURE__ */ e.jsx("h5", { id: u, style: c, children: n });
      break;
    default:
      a = /* @__PURE__ */ e.jsx("h6", { id: u, style: c, children: n });
      break;
  }
  let s = null;
  if (i.createSubmitAllButton && !i.suppressCheckwork) {
    k();
    let r = {
      height: "23px",
      display: "inline-block",
      backgroundColor: "var(--mainBlue)",
      padding: "1px 6px 1px 6px",
      color: "white",
      fontWeight: "bold",
      marginBottom: "30px"
      //Space after check work
    }, h = i.submitLabel;
    if (i.showCorrectness || (h = i.submitLabelNoCorrectness), s = /* @__PURE__ */ e.jsxs(
      "button",
      {
        id: t + "_submit",
        tabIndex: "0",
        style: r,
        onClick: j,
        onKeyPress: (y) => {
          y.key === "Enter" && j();
        },
        children: [
          /* @__PURE__ */ e.jsx(p, { icon: S, transform: { rotate: 90 } }),
          " ",
          h
        ]
      }
    ), i.showCorrectness) {
      if (o.current === "correct")
        r.backgroundColor = "var(--mainGreen)", s = /* @__PURE__ */ e.jsxs("span", { id: t + "_correct", style: r, children: [
          /* @__PURE__ */ e.jsx(p, { icon: A }),
          "  Correct"
        ] });
      else if (o.current === "incorrect")
        r.backgroundColor = "var(--mainRed)", s = /* @__PURE__ */ e.jsxs("span", { id: t + "_incorrect", style: r, children: [
          /* @__PURE__ */ e.jsx(p, { icon: V }),
          "  Incorrect"
        ] });
      else if (o.current === "partialcorrect") {
        r.backgroundColor = "var(--mainYellow)";
        let C = `${Math.round(i.creditAchieved * 100)}% Correct`;
        s = /* @__PURE__ */ e.jsx("span", { id: t + "_partial", style: r, children: C });
      }
    } else
      o.current !== "unvalidated" && (r.backgroundColor = "var(--mainPurple)", s = /* @__PURE__ */ e.jsxs("span", { id: t + "_saved", style: r, children: [
        /* @__PURE__ */ e.jsx(p, { icon: T }),
        "  Response Saved"
      ] }));
    s = /* @__PURE__ */ e.jsx("div", { children: s });
  }
  i.asList && (l = /* @__PURE__ */ e.jsx("ol", { children: l.map((r) => /* @__PURE__ */ e.jsx("li", { children: r })) }));
  let d = /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx("a", { name: t }),
    a,
    l,
    s
  ] });
  if (i.collapsible) {
    let r = null;
    i.open && (r = /* @__PURE__ */ e.jsxs("div", { style: { display: "block", padding: "6px" }, children: [
      l,
      s
    ] })), d = /* @__PURE__ */ e.jsxs(
      "div",
      {
        style: {
          border: "var(--mainBorder)",
          borderRadius: "var(--mainBorderRadius)",
          marginTop: "24px"
        },
        children: [
          /* @__PURE__ */ e.jsxs(
            "div",
            {
              style: {
                backgroundColor: "var(--mainGray)",
                cursor: "pointer",
                padding: "6px",
                borderBottom: i.open ? "var(--mainBorder)" : "none",
                borderTopLeftRadius: "var(--mainBorderRadius)",
                borderTopRightRadius: "var(--mainBorderRadius)"
              },
              onClick: () => m({
                action: i.open ? x.closeSection : x.revealSection
              }),
              children: [
                /* @__PURE__ */ e.jsx("a", { name: t }),
                a
              ]
            }
          ),
          r
        ]
      }
    );
  } else
    i.boxed && (d = /* @__PURE__ */ e.jsxs(
      "div",
      {
        style: {
          border: "var(--mainBorder)",
          borderRadius: "var(--mainBorderRadius)",
          marginTop: "24px"
        },
        children: [
          /* @__PURE__ */ e.jsxs(
            "div",
            {
              style: {
                padding: "6px",
                borderBottom: "var(--mainBorder)",
                backgroundColor: "var(--mainGray)",
                borderTopLeftRadius: "var(--mainBorderRadius)",
                borderTopRightRadius: "var(--mainBorderRadius)"
              },
              children: [
                /* @__PURE__ */ e.jsx("a", { name: t }),
                a
              ]
            }
          ),
          /* @__PURE__ */ e.jsxs("div", { style: { display: "block", padding: "6px" }, children: [
            l,
            s
          ] })
        ]
      }
    ));
  switch (i.containerTag) {
    case "aside":
      return /* @__PURE__ */ e.jsx(
        f,
        {
          partialVisibility: !0,
          onChange: b,
          children: /* @__PURE__ */ e.jsxs("aside", { id: t, style: { margin: "12px 0" }, children: [
            " ",
            d,
            " "
          ] })
        }
      );
    case "article":
      return /* @__PURE__ */ e.jsx(
        f,
        {
          partialVisibility: !0,
          onChange: b,
          children: /* @__PURE__ */ e.jsxs("article", { id: t, style: { margin: "12px 0" }, children: [
            " ",
            d,
            " "
          ] })
        }
      );
    case "div":
      return /* @__PURE__ */ e.jsx(
        f,
        {
          partialVisibility: !0,
          onChange: b,
          children: /* @__PURE__ */ e.jsxs("div", { id: t, style: { margin: "12px 0" }, children: [
            " ",
            d,
            " "
          ] })
        }
      );
    case "none":
      return /* @__PURE__ */ e.jsx(e.Fragment, { children: d });
    default:
      return /* @__PURE__ */ e.jsx(
        f,
        {
          partialVisibility: !0,
          onChange: b,
          children: /* @__PURE__ */ e.jsxs("section", { id: t, style: { margin: "12px 0" }, children: [
            " ",
            d,
            " "
          ] })
        }
      );
  }
});
export {
  G as default
};
