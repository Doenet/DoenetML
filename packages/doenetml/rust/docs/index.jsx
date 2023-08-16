import React from "react";
import { createRoot } from "react-dom/client";
import DoenetTest from "/src/test/DoenetTest.jsx";
import PageViewer from "/src/Viewer/PageViewer.jsx";
// import CodeSnippet from '/docs/codeSnippet.jsx'

import { RecoilRoot } from "recoil";
import { MathJaxContext } from "better-react-mathjax";
import { mathjaxConfig } from "/src/utils/math.js";

import Prism from "prismjs";

import Editor from "react-simple-code-editor";
// import { highlight, languages } from 'prismjs/components/prism-core';
// import 'prismjs/components/prism-clike';
// import 'prismjs/components/prism-javascript';
// import 'prismjs/components/prism-cshtml';

// import 'prismjs/themes/prism.css'; //Example style, you can use another

const root = createRoot(document.getElementById("root"));

// const [code, setCode] = React.useState(
//   `function add(a, b) {\n  return a + b;\n}`
// );
// var code = `<p>hey there</p>`

let examples = [
    [
        "Text-input",
        `
<textInput name="t1" prefill="Cake"/>
<text>$t1.value is good.</text>
`,
    ],

    [
        "Sequence and number input",
        `<p>Count from <numberInput name="n1" prefill="4"/> to
<numberInput name="n2" prefill="14"/></p>

<p>
  The sequence from $n1.value to $n2.value is:
  <sequence name="seq" from="$n1.value" to="$n2.value"/>.
</p>

<p>And the fifth number is $seq[5].value.</p>`,
    ],

    [
        "Value vs immediate value",
        `<graph name="graph">
	<point name="p1" xs="$n1.value $n2.value"/>
	<point name="p2" xs="$n1.immediateValue+0.5 $n2.immediateValue"/>
</graph>

<numberInput name="n1" prefill="0"/>
<numberInput name="n2" prefill="0"/>

One point uses immediate value plus an offset`,
    ],
];

console.log(examples);

let components = [];
for (let example of examples) {
    components.push(<hr key={"line break" + example[0]}></hr>);
    components.push(<h3 key={"heading" + example[0]}>{example[0]}</h3>);

    components.push(
        <div key={"viewer" + example[0]} className="example-demo">
            <PageViewer doenetML={example[1]} flags={{}} pageIsActive={true} />
        </div>
    );

    components.push(
        <pre key={"markup code" + example[0]} className="example-markup">
            <code className="language-xml">{example[1]}</code>
        </pre>

        // <script type='text/plain' className='language-markup'>HI</script>
    );

    // components.push(
    //   <Editor className='example-markup'
    //     value={example}
    //     onValueChange={code => {example = code}}
    //     highlight={code => highlight(code, languages.js)}
    //     padding={10}
    //     style={{
    //       fontFamily: '"Fira code", "Fira Mono", monospace',
    //       fontSize: 20,
    //     }}
    //   />
    // );
}

{
    /* <div className='example-demo'>
<PageViewer
  doenetML={example2}
  flags={{}}
  pageIsActive={true}
/>
</div>
<pre className='example-markup'><code id='example2'>{example2}</code></pre> */
}

root.render(
    <RecoilRoot>
        <pre>
            <code className="language-html">{"<p>asdf</p>"}</code>
        </pre>

        <MathJaxContext
            version={2}
            config={mathjaxConfig}
            onStartup={(mathJax) => (mathJax.Hub.processSectionDelay = 0)}
        >
            <h1>DoenetML Demos</h1>

            {components}

            {/* <CodeSnippet></CodeSnippet> */}
        </MathJaxContext>
    </RecoilRoot>
);
