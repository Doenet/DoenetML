use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Debug, Serialize, Deserialize)]
#[serde(tag = "type")]
#[serde(rename = "root")]
pub struct DastRoot {
    children: Vec<DastElementContent>,

    #[serde(skip_serializing_if = "Option::is_none")]
    position: Option<Position>,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(untagged)]
enum DastElementContent {
    Element(DastElement),
    Text(DastText),
    Macro(DastMacro),
    FunctionMacro(DastFunctionMacro),
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(untagged)]
enum DastTextMacroContent {
    Text(DastText),
    Macro(DastMacro),
    FunctionMacro(DastFunctionMacro),
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(tag = "type")]
#[serde(rename = "element")]
struct DastElement {
    name: String,

    attributes: HashMap<String, DastAttribute>,

    children: Vec<DastElementContent>,

    #[serde(skip_serializing_if = "Option::is_none")]
    data: Option<ElementData>,

    #[serde(skip_serializing_if = "Option::is_none")]
    position: Option<Position>,
}

#[derive(Debug, Serialize, Deserialize)]
struct ElementData {}

#[derive(Debug, Serialize, Deserialize)]
#[serde(tag = "type")]
#[serde(rename = "text")]
struct DastText {
    value: String,

    #[serde(skip_serializing_if = "Option::is_none")]
    data: Option<TextData>,

    #[serde(skip_serializing_if = "Option::is_none")]
    position: Option<Position>,
}

#[derive(Debug, Serialize, Deserialize)]
struct TextData {}

#[derive(Debug, Serialize, Deserialize)]
#[serde(tag = "type")]
#[serde(rename = "attribute")]
struct DastAttribute {
    name: String,
    children: Vec<DastTextMacroContent>,

    #[serde(skip_serializing_if = "Option::is_none")]
    position: Option<Position>,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
#[serde(rename = "macro")]
struct DastMacro {
    attributes: HashMap<String, DastAttribute>,

    #[serde(skip_serializing_if = "Option::is_none")]
    position: Option<Position>,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(tag = "type")]
#[serde(rename = "function")]
struct DastFunctionMacro {
    path: Vec<PathPart>,
    input: Option<Vec<Vec<DastElementContent>>>,

    #[serde(skip_serializing_if = "Option::is_none")]
    position: Option<Position>,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(tag = "type")]
#[serde(rename = "pathPart")]
struct PathPart {
    name: String,
    index: Vec<DastIndex>,

    #[serde(skip_serializing_if = "Option::is_none")]
    position: Option<Position>,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(tag = "type")]
#[serde(rename = "index")]
struct DastIndex {
    value: Vec<DastTextMacroContent>,

    #[serde(skip_serializing_if = "Option::is_none")]
    position: Option<Position>,
}

#[derive(Debug, Serialize, Deserialize)]
struct Position {
    start: Point,
    end: Point,
}

#[derive(Debug, Serialize, Deserialize)]
struct Point {
    line: usize,
    column: usize,
    #[serde(skip_serializing_if = "Option::is_none")]
    offset: Option<usize>,
}
