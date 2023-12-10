/*
 * This file is for running a dev test of the codemirror component.
 * It does not show up in the bundled package.
 */

import React from "react";
import ReactDOM from "react-dom/client";
import { CodeMirror2 } from "./CodeMirror2";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.Fragment>
        <CodeMirror2
            onBeforeChange={() => {}}
            value={`
<p xxx />
<p>Use this to test DoenetML.
 Some text &amp;
</p>
<graph showNavigation="false">
  <line through="(-8,8) (9,6)" />
  <line through="(0,4)" slope="1/2" styleNumber="2" />

  <line equation="y=2x-8" styleNumber="3" />
  <line equation="x=-6" styleNumber="4" />
  
</graph>
`}
            onBlur={
                () => {} //console.log("blur")
            }
            onFocus={
                () => {} //console.log("focus")
            }
            onCursorChange={(e) => console.log("cursor change", e)}
        />
        {
            <CodeMirror2
                onBeforeChange={() => {}}
                value={`<p>foo</p>`}
                onBlur={
                    () => {} //console.log("blur")
                }
                onFocus={
                    () => {}
                    //console.log("focus")
                }
                readOnly={true}
            />
        }
    </React.Fragment>,
);
