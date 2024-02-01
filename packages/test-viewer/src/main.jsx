import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TestViewer from "./test/testViewer";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import "@doenet/doenetml/style.css";

const root = createRoot(document.getElementById("root"));

window.addEventListener("message", (event) => {
    if (event.data.subject == "SPLICE.reportScoreAndState") {
        console.log(event.data.score);
        console.log(event.data.state);
    } else if (event.data.subject == "SPLICE.sendEvent") {
        console.log(event.data.location);
        console.log(event.data.name);
        console.log(event.data.data);
    }
});

export const mathjaxConfig = 
{
    tex: {
      tags: "ams",
      macros: {
        lt: "<",
        gt: ">",
        amp: "&",
        var: ["\\mathrm{#1}", 1],
        csch: "\\operatorname{csch}",
        sech: "\\operatorname{sech}"
      },
      displayMath: [["\\[", "\\]"]],
      packages: ['base', 'ams', 'noerrors', 'noundefined']
    },
    options: {
      ignoreHtmlClass: 'tex2jax_ignore',
      processHtmlClass: 'tex2jax_process'
    },
    loader: {
      load: ['[tex]/noerrors']
    }
  };

let mathJaxify = "\\(\\frac{a}{b}+5\\)";

root.render(

    <Router>
        <Routes>
            <Route path="*" element={
                
                <MathJaxContext
                    version={3}
                    config={mathjaxConfig}
                >

                    <a name={name} />
                    <span id={name}>
                        <MathJax hideUntilTypeset={"first"} inline dynamic>
                            {mathJaxify}
                        </MathJax>
                    </span>
                </MathJaxContext>
            } />
        </Routes>
    </Router>,
);

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://www.snowpack.dev/concepts/hot-module-replacement
if (import.meta.hot) {
    // console.log(">>>import.meta.hot")
    // import.meta.hot.accept(({module}) => {
    //   console.log(">>>ACCEPT CALLED!!!!!!!!!")
    // }
    // );
    import.meta.hot.accept();
}
