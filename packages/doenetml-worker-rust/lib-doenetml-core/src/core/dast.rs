use serde::{ser::SerializeStruct, Deserialize, Serialize};
use std::collections::HashMap;
#[cfg(feature = "web")]
use tsify::Tsify;
#[cfg(feature = "web")]
use wasm_bindgen::prelude::*;

use crate::state::StateVarValue;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
#[serde(rename = "root")]
#[cfg_attr(feature = "web", derive(Tsify))]
pub struct DastRoot {
    pub children: Vec<DastElementContent>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub position: Option<Position>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(untagged)]
#[cfg_attr(feature = "web", derive(Tsify))]
pub enum DastElementContent {
    Element(DastElement),
    Text(DastText),
    Macro(DastMacro),
    FunctionMacro(DastFunctionMacro),
    Error(DastError),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(untagged)]
#[cfg_attr(feature = "web", derive(Tsify))]
pub enum DastTextMacroContent {
    Text(DastText),
    Macro(DastMacro),
    FunctionMacro(DastFunctionMacro),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
#[serde(rename = "element")]
#[cfg_attr(feature = "web", derive(Tsify))]
pub struct DastElement {
    pub name: String,

    pub attributes: HashMap<String, DastAttribute>,

    pub children: Vec<DastElementContent>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub data: Option<ElementData>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub position: Option<Position>,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[cfg_attr(feature = "web", derive(Tsify))]
pub struct ElementData {
    pub id: usize,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub action_names: Option<Vec<String>>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub message: Option<String>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub state: Option<HashMap<String, StateVarValue>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
#[serde(rename = "text")]
#[cfg_attr(feature = "web", derive(Tsify))]
pub struct DastText {
    pub value: String,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub data: Option<TextData>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub position: Option<Position>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[cfg_attr(feature = "web", derive(Tsify))]
pub struct TextData {}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
#[serde(rename = "attribute")]
#[cfg_attr(feature = "web", derive(Tsify))]
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
#[cfg_attr(feature = "web", derive(Tsify))]
pub struct DastMacro {
    pub path: Vec<PathPart>,
    pub attributes: HashMap<String, DastAttribute>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub position: Option<Position>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
#[serde(rename = "function")]
#[cfg_attr(feature = "web", derive(Tsify))]
pub struct DastFunctionMacro {
    pub path: Vec<PathPart>,
    pub input: Option<Vec<Vec<DastElementContent>>>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub position: Option<Position>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
#[serde(rename = "pathPart")]
#[cfg_attr(feature = "web", derive(Tsify))]
pub struct PathPart {
    pub name: String,
    pub index: Vec<DastIndex>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub position: Option<Position>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
#[serde(rename = "index")]
#[cfg_attr(feature = "web", derive(Tsify))]
pub struct DastIndex {
    pub value: Vec<DastTextMacroContent>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub position: Option<Position>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
#[serde(rename = "error")]
#[cfg_attr(feature = "web", derive(Tsify))]
pub struct DastError {
    pub message: String,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub position: Option<Position>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[cfg_attr(feature = "web", derive(Tsify))]
pub struct Position {
    pub start: Point,
    pub end: Point,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[cfg_attr(feature = "web", derive(Tsify))]
pub struct Point {
    pub line: usize,
    pub column: usize,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub offset: Option<usize>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
#[serde(rename = "root")]
#[cfg_attr(feature = "web", derive(Tsify))]
pub struct FlatDastRoot {
    pub children: Vec<FlatDastElementContent>,

    pub elements: Vec<FlatDastElement>,
    pub warnings: Vec<DastWarning>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub position: Option<Position>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(untagged)]
#[cfg_attr(feature = "web", derive(Tsify))]
pub enum FlatDastElementContent {
    Element(usize),
    Text(String),
}

#[derive(Debug, Clone, Deserialize)]
#[serde(tag = "type")]
#[serde(rename = "element")]
#[cfg_attr(feature = "web", derive(Tsify))]
pub struct FlatDastElement {
    pub name: String,

    pub attributes: HashMap<String, DastAttribute>,

    pub children: Vec<FlatDastElementContent>,

    pub data: ElementData,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub position: Option<Position>,
}

impl Serialize for FlatDastElement {
    /// Implement a custom serialize for FlatDastElement in order to treat
    /// name="_error" special to turn it into type="error"
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        let have_position = self.position.is_some();

        if self.name == "_error" {
            let n_fields = 2 + if have_position { 1 } else { 0 };

            let mut state = serializer.serialize_struct("error", n_fields)?;
            state.serialize_field("type", "error")?;

            let message = if let Some(message) = &self.data.message {
                message.clone()
            } else {
                "".to_string()
            };
            state.serialize_field("message", &message)?;

            if have_position {
                state.serialize_field("position", &self.position)?;
            }
            state.end()
        } else {
            let n_fields = 5 + if have_position { 1 } else { 0 };

            let mut state = serializer.serialize_struct("element", n_fields)?;

            state.serialize_field("type", "element")?;
            state.serialize_field("name", &self.name)?;
            state.serialize_field("attributes", &self.attributes)?;
            state.serialize_field("children", &self.children)?;
            state.serialize_field("data", &self.data)?;
            if have_position {
                state.serialize_field("position", &self.position)?;
            }
            state.end()
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
#[serde(rename = "warning")]
#[cfg_attr(feature = "web", derive(Tsify))]
pub struct DastWarning {
    pub message: String,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub position: Option<Position>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
#[serde(rename = "elementUpdate")]
#[serde(rename_all = "camelCase")]
#[cfg_attr(feature = "web", derive(Tsify))]
pub struct FlatDastElementUpdate {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub changed_attributes: Option<HashMap<String, DastAttribute>>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub new_children: Option<Vec<FlatDastElementContent>>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub changed_state: Option<HashMap<String, StateVarValue>>,
}
