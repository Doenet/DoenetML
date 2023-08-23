/*
 * This file is for running a dev test of the codemirror component.
 * It does not show up in the bundled package.
 */

import React from "react";
import ReactDOM from "react-dom/client";
import { CodeMirror } from "./CodeMirror";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <CodeMirror
        onBeforeChange={() => {}}
        setInternalValueTo={`
<p>Use this to test DoenetML</p>
<graph showNavigation="false">

  <line through="(-8,8) (9,6)" />
  <line through="(0,4)" slope="1/2" styleNumber="2" />

  <line equation="y=2x-8" styleNumber="3" />
  <line equation="x=-6" styleNumber="4" />
  
</graph>
`}
    />,
);
