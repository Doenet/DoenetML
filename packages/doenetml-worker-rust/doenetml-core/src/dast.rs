use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
#[serde(rename = "root")]
pub struct DastRoot {
    pub children: Vec<DastElementContent>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub position: Option<Position>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(untagged)]
pub enum DastElementContent {
    Element(DastElement),
    Text(DastText),
    Macro(DastMacro),
    FunctionMacro(DastFunctionMacro),
    Error(DastError),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(untagged)]
pub enum DastTextMacroContent {
    Text(DastText),
    Macro(DastMacro),
    FunctionMacro(DastFunctionMacro),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
#[serde(rename = "element")]
pub struct DastElement {
    pub name: String,

    pub attributes: HashMap<String, DastAttribute>,

    pub children: Vec<DastElementContent>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub data: Option<ElementData>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub position: Option<Position>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ElementData {
    pub id: usize,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
#[serde(rename = "text")]
pub struct DastText {
    pub value: String,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub data: Option<TextData>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub position: Option<Position>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TextData {}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
#[serde(rename = "attribute")]
pub struct DastAttribute {
    pub name: String,
    pub children: Vec<DastTextMacroContent>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub position: Option<Position>,
}

impl DastAttribute {
    pub fn get_string_value(&self) -> Result<String, ()> {
        if self.children.len() == 1 {
            if let DastTextMacroContent::Text(name_text) = &self.children[0] {
                // have string attribute
                return Ok(name_text.value.clone());
            }
        }

        Err(())
    }

    pub fn get_string_value_or_implicit_true(&self) -> Result<String, ()> {
        if self.children.len() == 0 {
            return Ok("true".to_string());
        } else if self.children.len() == 1 {
            if let DastTextMacroContent::Text(name_text) = &self.children[0] {
                // have string attribute
                return Ok(name_text.value.clone());
            }
        }

        Err(())
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
#[serde(rename = "macro")]
pub struct DastMacro {
    pub path: Vec<PathPart>,
    pub attributes: HashMap<String, DastAttribute>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub position: Option<Position>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
#[serde(rename = "function")]
pub struct DastFunctionMacro {
    pub path: Vec<PathPart>,
    pub input: Option<Vec<Vec<DastElementContent>>>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub position: Option<Position>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
#[serde(rename = "pathPart")]
pub struct PathPart {
    pub name: String,
    pub index: Vec<DastIndex>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub position: Option<Position>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
#[serde(rename = "index")]
pub struct DastIndex {
    pub value: Vec<DastTextMacroContent>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub position: Option<Position>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
#[serde(rename = "error")]
pub struct DastError {
    pub message: String,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub position: Option<Position>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Position {
    pub start: Point,
    pub end: Point,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Point {
    pub line: usize,
    pub column: usize,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub offset: Option<usize>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
#[serde(rename = "root")]
pub struct FlatDastRoot {
    pub children: Vec<FlatDastElementContent>,

    pub elements: Vec<FlatDastElement>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub position: Option<Position>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(untagged)]
pub enum FlatDastElementContent {
    Element(usize),
    Text(String),
    Error(DastError),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
#[serde(rename = "element")]
pub struct FlatDastElement {
    pub name: String,

    pub attributes: HashMap<String, DastAttribute>,

    pub children: Vec<FlatDastElementContent>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub data: Option<ElementData>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub position: Option<Position>,
}
