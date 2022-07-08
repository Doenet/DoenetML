import { PublicDoenetCore } from "doenet_rust_wasm"
import { parseAndCompile } from "./Parser/parser.js"

const DoenetText =
`<text name="root">hello<number>1</number></text><textInput />`;

const DoenetTextJson = parseAndCompile(DoenetText);

console.log("JSON", DoenetTextJson);

const dc = PublicDoenetCore.new(JSON.stringify(DoenetTextJson));

const render_tree_string = dc.update_renderers();
const render_tree_json = JSON.parse(render_tree_string);

console.log("JS deserialized JSON", render_tree_json);

let action = {
    componentName: "root",
    actionName: "updateValue",
    args: "hi there",
};

dc.handle_action(JSON.stringify(action));
