use serde::{ser::SerializeStruct, Deserialize, Serialize};
use std::collections::HashMap;
#[cfg(feature = "web")]
use tsify::Tsify;
#[cfg(feature = "web")]
use wasm_bindgen::prelude::*;

use thiserror::Error;

use crate::components::RenderedState;

/// Dast root node
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
#[serde(rename = "root")]
#[cfg_attr(feature = "web", derive(Tsify))]
#[cfg_attr(feature = "web", tsify(into_wasm_abi, from_wasm_abi))]
pub struct DastRoot {
    pub children: Vec<DastElementContent>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub position: Option<Position>,
}

/// Allowed children of an element node or the root node
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(untagged)]
#[cfg_attr(feature = "web", derive(Tsify))]
pub enum DastElementContent {
    Element(DastElement),
    Text(DastText),
    Macro(DastMacro),
    FunctionMacro(DastFunctionMacro),
    Error(DastError),
}

impl DastElementContent {
    pub fn element_with_name(name: &str) -> Self {
        DastElementContent::Element(DastElement::with_name(name))
    }
}

/// Allowed children of an attribute node
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(untagged)]
#[cfg_attr(feature = "web", derive(Tsify))]
pub enum DastTextMacroContent {
    Text(DastText),
    Macro(DastMacro),
    FunctionMacro(DastFunctionMacro),
}

/// An element node
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
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

impl DastElement {
    pub fn with_name(name: &str) -> Self {
        DastElement {
            name: name.to_string(),
            attributes: HashMap::new(),
            children: Vec::new(),
            data: None,
            position: None,
        }
    }
}

/// Additional data associated with an element. The majority of the data
/// that DoenetMLCore produces will end up in `ElementData`
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[cfg_attr(feature = "web", derive(Tsify))]
pub struct ElementData {
    pub id: usize,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub action_names: Option<Vec<String>>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub message: Option<String>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub state: Option<RenderedState>,
}

impl PartialEq for ElementData {
    /// XXX: This is an incomplete implementation of PartialEq for ElementData.
    /// It does not compare `state`.
    fn eq(&self, other: &Self) -> bool {
        self.id == other.id
            && self.action_names == other.action_names
            && self.message == other.message
    }
}

/// A text node
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
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

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[cfg_attr(feature = "web", derive(Tsify))]
pub struct TextData {}

/// An attribute. Unlike in XML, attributes can have non-string children.
/// It is up to the serializer to convert the non-string children into a
/// correct attribute value.
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
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
    pub fn get_string_value(&self) -> Result<String, NoValueFound> {
        if self.children.len() == 1 {
            if let DastTextMacroContent::Text(name_text) = &self.children[0] {
                // have string attribute
                return Ok(name_text.value.clone());
            }
        }

        Err(NoValueFound)
    }

    pub fn get_string_value_or_implicit_true(&self) -> Result<String, NoValueFound> {
        if self.children.is_empty() {
            return Ok("true".to_string());
        } else if self.children.len() == 1 {
            if let DastTextMacroContent::Text(name_text) = &self.children[0] {
                // have string attribute
                return Ok(name_text.value.clone());
            }
        }

        Err(NoValueFound)
    }
}

/// A macro (i.e., a macro that starts with `$`)
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
#[serde(rename = "macro")]
#[cfg_attr(feature = "web", derive(Tsify))]
pub struct DastMacro {
    pub path: Vec<PathPart>,
    pub attributes: HashMap<String, DastAttribute>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub position: Option<Position>,
}

/// A function macro (i.e., a macro that starts with `$$`)
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
#[serde(rename = "function")]
#[cfg_attr(feature = "web", derive(Tsify))]
pub struct DastFunctionMacro {
    pub path: Vec<PathPart>,
    pub input: Option<Vec<Vec<DastElementContent>>>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub position: Option<Position>,
}

/// A part of a macro path
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
#[serde(rename = "pathPart")]
#[cfg_attr(feature = "web", derive(Tsify))]
pub struct PathPart {
    pub name: String,
    pub index: Vec<DastIndex>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub position: Option<Position>,
}

/// An index into a macro path
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
#[serde(rename = "index")]
#[cfg_attr(feature = "web", derive(Tsify))]
pub struct DastIndex {
    pub value: Vec<DastTextMacroContent>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub position: Option<Position>,
}

/// An error node that can be inserted into the Dast tree.
/// Because `DastError`s can be inserted into the tree, they
/// can appear close to whatever caused the error.
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type")]
#[serde(rename = "error")]
#[cfg_attr(feature = "web", derive(Tsify))]
pub struct DastError {
    pub message: String,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub position: Option<Position>,
}

/// Range in a source string
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[cfg_attr(feature = "web", derive(Tsify))]
pub struct Position {
    pub start: Point,
    pub end: Point,
}

/// Location in a source string
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[cfg_attr(feature = "web", derive(Tsify))]
pub struct Point {
    pub line: usize,
    pub column: usize,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub offset: Option<usize>,
}

/// Root element of `FlatDast`, which flattens the tree structure of `Dast`.
/// All `text` nodes are converted into literal strings. Each `element` is given
/// a unique id and children of elements/roots are represented as an array of
/// ids and string literals.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
#[serde(rename = "root")]
#[cfg_attr(feature = "web", derive(Tsify))]
#[cfg_attr(feature = "web", tsify(into_wasm_abi))]
pub struct FlatDastRoot {
    pub children: Vec<FlatDastElementContent>,

    pub elements: Vec<FlatDastElement>,
    pub warnings: Vec<DastWarning>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub position: Option<Position>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(untagged)]
#[cfg_attr(feature = "web", derive(Tsify))]
pub enum FlatDastElementContent {
    Element(usize),
    Text(String),
}

/// A flattened version of DastElement that is easier to serialize
/// Instead of children, an array of references to to child ids is used
/// for element children, and `text` children are included as literal strings.
#[derive(Debug, Clone, Deserialize, PartialEq)]
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

/// Non-fatal error produced when running DoenetMLCore
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
#[serde(rename = "warning")]
#[cfg_attr(feature = "web", derive(Tsify))]
pub struct DastWarning {
    pub message: String,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub position: Option<Position>,
}

/// An update to a single element in the Dast tree.
/// It may contain changes to the element's attributes, children, or `data.state`.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
#[serde(rename = "elementUpdate")]
#[serde(rename_all = "camelCase")]
#[cfg_attr(feature = "web", derive(Tsify))]
pub struct FlatDastElementUpdate {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub new_children: Option<Vec<FlatDastElementContent>>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub changed_state: Option<RenderedState>,
}

#[derive(Debug, Error)]
#[error("no value found")]
pub struct NoValueFound;
