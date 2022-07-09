import { PublicDoenetCore } from "doenet_rust_wasm"
import { parseAndCompile } from "./Parser/parser.js"

const DoenetText =
`<text name="root">hello<number>1</number></text><textInput name="myInput"/>`;

const DoenetTextJson = parseAndCompile(DoenetText);

console.log("DoenetML as JSON\n", DoenetTextJson);

const dc = PublicDoenetCore.new(JSON.stringify(DoenetTextJson));

const render_tree_string = dc.update_renderers();
const render_tree_json = JSON.parse(render_tree_string);

console.log("JS deserialized JSON\n", render_tree_json);

let action = {
    componentName: "myInput",
    actionName: "updateValue",
    args: {
        "value": "hi there",
    },
};

dc.handle_action(JSON.stringify(action));
