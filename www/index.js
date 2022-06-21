import { DoenetCore } from "doenet_rust_wasm"
import { parseAndCompile } from "./Parser/parser.js"

const DoenetText = "<text><text>hello</text> world</text>";
// const DoenetText = "<answer><award><math>x</math></award></answer>";
// const DoenetText = "<answer symbolicEquality><award><math>x</math></award></answer>";

const DoenetTextJson = parseAndCompile(DoenetText);

console.log("JSON", DoenetTextJson);

const dc = DoenetCore.new(JSON.stringify(DoenetTextJson));

// const render_tree_string = dc.render_tree();
// const render_tree_json = JSON.parse(render_tree_string);

// console.log("JS deserialized JSON", render_tree_json);
