import React from "react";
import ReactDOM from "react-dom/client";
import DoenetML from "./DoenetML";

let doenetML = `Hi Duane <graph><regularPolygon center="($s, 0)"/></graph><mathinput name='f'/>$f<spreadsheet />
  <video youtube='ZZ5LpwO-An4' name='v'/><callaction target='v' actionName='playVideo' />
  <subsetOfRealsInput /><orbitalDiagramInput /><slider name="s"/><matrixInput />
  <codeEditor showResults/><booleanInput asToggleButton="$bool" name="bool"/><booleanInput />
  <textInput /> <textInput expanded /><choiceInput><choice>dog</choice><choice>not dog</choice></choiceInput>
  <choiceInput inline><choice>dog</choice><choice>not dog</choice></choiceInput>
  <ref />
  `;

// let doenetML = `<document Xmlns="https://doenet.org/spec/doenetml/v0.1.0" type="activity">
//  <order behavior="sequence">
//    <page><variantControl uniqueVariants /><selectFromSequence length="3" name="n" /> <answer>$n</answer></page>
//    <page><graph><point>(4,-7)</point></graph><mathinput /></page>
//  </order>
// </document>`
//let doenetML = "<graph><regularPolygon /></graph>";
ReactDOM.createRoot(document.getElementById("root")).render(
  <DoenetML doenetML={doenetML} />,
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
