use serde::{
    Deserialize, Serialize,
    ser::{SerializeMap, SerializeStruct},
};

use std::collections::HashMap;
#[cfg(feature = "web")]
use tsify_next::Tsify;
#[cfg(feature = "web")]
use wasm_bindgen::prelude::*;

use thiserror::Error;

use crate::{dast::flat_dast::SourceDoc, props::PropValue};

use super::flat_dast::ErrorType;

/// Dast root node
#[derive(Debug, Clone, Serialize, Deserialize)]
#[cfg_attr(test, derive(PartialEq))]
#[serde(tag = "type")]
#[serde(rename = "root")]
#[cfg_attr(feature = "web", derive(Tsify))]
#[cfg_attr(feature = "web", tsify(into_wasm_abi, from_wasm_abi))]
pub struct DastRoot {
    pub children: Vec<DastElementContent>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub position: Option<Position>,

    pub sources: Vec<String>,
}

/// Allowed children of an element node or the root node
#[derive(Debug, Clone, Serialize, Deserialize)]
#[cfg_attr(test, derive(PartialEq))]
#[serde(untagged)]
#[cfg_attr(feature = "web", derive(Tsify))]
pub enum DastElementContent {
    Element(DastElement),
    Text(DastText),
    Ref(DastRef),
    FunctionRef(DastFunctionRef),
    Error(DastError),
}

impl DastElementContent {
    pub fn element_with_name(name: &str) -> Self {
        DastElementContent::Element(DastElement::with_name(name))
    }

    pub fn position(&self) -> Option<&Position> {
        match self {
            DastElementContent::Element(dast_element) => (dast_element.position).as_ref(),
            DastElementContent::Text(dast_text) => (dast_text.position).as_ref(),
            DastElementContent::Ref(dast_ref) => (dast_ref.position).as_ref(),
            DastElementContent::FunctionRef(dast_function_ref) => {
                (dast_function_ref.position).as_ref()
            }
            DastElementContent::Error(dast_error) => (dast_error.position).as_ref(),
        }
    }
}

/// Allowed children of an attribute node
#[derive(Debug, Clone, Serialize, Deserialize)]
#[cfg_attr(test, derive(PartialEq))]
#[serde(untagged)]
#[cfg_attr(feature = "web", derive(Tsify))]
pub enum DastTextRefElementContent {
    Text(DastText),
    Ref(DastRef),
    FunctionRef(DastFunctionRef),
    Element(DastElement),
}

/// An element node
#[derive(Debug, Clone, Serialize, Deserialize)]
#[cfg_attr(test, derive(PartialEq))]
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

    #[serde(skip_serializing_if = "Option::is_none")]
    pub source_doc: Option<SourceDoc>,
}

impl DastElement {
    pub fn with_name(name: &str) -> Self {
        DastElement {
            name: name.to_string(),
            attributes: HashMap::new(),
            children: Vec::new(),
            data: None,
            position: None,
            source_doc: None,
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

    #[serde(skip_serializing_if = "Option::is_none", skip_deserializing)]
    pub props: Option<ForRenderProps>,
}

/// A partial implementation of PartialEq for ElementData
/// only to be used for _testing_.
#[cfg(test)]
impl PartialEq for ElementData {
    /// This is an **incomplete** implementation of PartialEq for ElementData.
    /// It does not compare `state`.
    fn eq(&self, other: &Self) -> bool {
        self.id == other.id
            && self.action_names == other.action_names
            && self.message == other.message
    }
}

/// A struct containing values of props marked for_render
/// that will serialize like a map.
#[derive(Debug, Clone, Default, PartialEq)]
pub struct ForRenderProps(pub Vec<ForRenderPropValue>);

impl ForRenderProps {
    pub fn is_empty(&self) -> bool {
        self.0.is_empty()
    }
}

impl Serialize for ForRenderProps {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        let mut map = serializer.serialize_map(Some(self.0.len()))?;

        for rendered_value in self.0.iter() {
            map.serialize_entry(&rendered_value.name, &rendered_value.value)?;
        }
        map.end()
    }
}

/// The `value`` of the prop `name`.
#[derive(Debug, Clone, PartialEq)]
pub struct ForRenderPropValue {
    pub name: &'static str,
    pub value: ForRenderPropValueOrContent,
}

/// Some data may be pre-processed into `FlatDastElementContent`
/// and other data may be left as a `PropValue` to be serialized by
/// its own serializer. This enum stores both types of data.
#[derive(Debug, Clone, Serialize, PartialEq)]
#[serde(untagged)]
pub enum ForRenderPropValueOrContent {
    PropValue(PropValue),
    Content(Vec<FlatDastElementContent>),
}

impl From<PropValue> for ForRenderPropValueOrContent {
    fn from(prop_value: PropValue) -> Self {
        ForRenderPropValueOrContent::PropValue(prop_value)
    }
}

impl From<FlatDastElementContent> for ForRenderPropValueOrContent {
    fn from(content: FlatDastElementContent) -> Self {
        ForRenderPropValueOrContent::Content(vec![content])
    }
}

impl From<Vec<FlatDastElementContent>> for ForRenderPropValueOrContent {
    fn from(content: Vec<FlatDastElementContent>) -> Self {
        ForRenderPropValueOrContent::Content(content)
    }
}

impl From<&str> for ForRenderPropValueOrContent {
    fn from(s: &str) -> Self {
        ForRenderPropValueOrContent::PropValue(s.into())
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

    #[serde(skip_serializing_if = "Option::is_none")]
    pub source_doc: Option<SourceDoc>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[cfg_attr(feature = "web", derive(Tsify))]
pub struct TextData {}

/// An attribute. Unlike in XML, attributes can have non-string children.
/// It is up to the serializer to convert the non-string children into a
/// correct attribute value.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[cfg_attr(test, derive(PartialEq))]
#[serde(tag = "type")]
#[serde(rename = "attribute")]
#[cfg_attr(feature = "web", derive(Tsify))]
pub struct DastAttribute {
    pub name: String,
    pub children: Vec<DastTextRefElementContent>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub position: Option<Position>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub source_doc: Option<SourceDoc>,
}

impl DastAttribute {
    pub fn get_string_value(&self) -> Result<String, NoValueFound> {
        if self.children.len() == 1
            && let DastTextRefElementContent::Text(name_text) = &self.children[0] {
                // have string attribute
                return Ok(name_text.value.clone());
            }

        Err(NoValueFound)
    }

    pub fn get_string_value_or_implicit_true(&self) -> Result<String, NoValueFound> {
        if self.children.is_empty() {
            return Ok("true".to_string());
        } else if self.children.len() == 1
            && let DastTextRefElementContent::Text(name_text) = &self.children[0] {
                // have string attribute
                return Ok(name_text.value.clone());
            }

        Err(NoValueFound)
    }
}

/// A ref (i.e., starts with `$`)
#[derive(Debug, Clone, Serialize, Deserialize)]
#[cfg_attr(test, derive(PartialEq))]
#[serde(tag = "type")]
#[serde(rename = "macro")]
#[cfg_attr(feature = "web", derive(Tsify))]
pub struct DastRef {
    pub path: Vec<PathPart>,
    pub attributes: HashMap<String, DastAttribute>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub position: Option<Position>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub source_doc: Option<SourceDoc>,
}

/// A function ref (i.e., starts with `$$`)
#[derive(Debug, Clone, Serialize, Deserialize)]
#[cfg_attr(test, derive(PartialEq))]
#[serde(tag = "type")]
#[serde(rename = "function")]
#[cfg_attr(feature = "web", derive(Tsify))]
pub struct DastFunctionRef {
    pub path: Vec<PathPart>,
    pub input: Option<Vec<Vec<DastElementContent>>>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub position: Option<Position>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub source_doc: Option<SourceDoc>,
}

/// A part of a ref path
#[derive(Debug, Clone, Serialize, Deserialize)]
#[cfg_attr(test, derive(PartialEq))]
#[serde(tag = "type")]
#[serde(rename = "pathPart")]
#[cfg_attr(feature = "web", derive(Tsify))]
pub struct PathPart {
    pub name: String,
    pub index: Vec<DastIndex>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub position: Option<Position>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub source_doc: Option<SourceDoc>,
}

/// An index into a ref path
#[derive(Debug, Clone, Serialize, Deserialize)]
#[cfg_attr(test, derive(PartialEq))]
#[serde(tag = "type")]
#[serde(rename = "index")]
#[cfg_attr(feature = "web", derive(Tsify))]
pub struct DastIndex {
    pub value: Vec<DastTextRefElementContent>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub position: Option<Position>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub source_doc: Option<SourceDoc>,
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
    pub error_type: Option<ErrorType>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub position: Option<Position>,

    #[serde(skip_serializing_if = "Option::is_none")]
    pub source_doc: Option<SourceDoc>,
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
///
/// **Typescript Warning**: Since `FlatDastElement` may be serialized into a `DastError` instead
/// of an element, this type is not correct. Use the `FlatDastRootWithErrors` type instead.
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
    Element(AnnotatedElementRef),
    Text(String),
}

impl FlatDastElementContent {
    pub fn new_element(id: usize, annotation: ElementRefAnnotation) -> Self {
        FlatDastElementContent::Element(AnnotatedElementRef { id, annotation })
    }
    /// Create a `FlatDastElementContent::Element` with the annotation set to `Original`
    pub fn new_original_element(id: usize) -> Self {
        FlatDastElementContent::Element(AnnotatedElementRef {
            id,
            annotation: ElementRefAnnotation::Original,
        })
    }
    /// Create a `FlatDastElementContent::Element` with the annotation set to `Original`
    pub fn new_duplicate_element(id: usize) -> Self {
        FlatDastElementContent::Element(AnnotatedElementRef {
            id,
            annotation: ElementRefAnnotation::Duplicate,
        })
    }
}

/// A reference to an element that contains additional data.
#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
#[cfg_attr(feature = "web", derive(Tsify))]
pub struct AnnotatedElementRef {
    /// The id of the referenced element.
    pub id: usize,
    /// Additional data associated with this reference (e.g., whether it is the "original" reference)
    pub annotation: ElementRefAnnotation,
}

/// Additional data that may be associated with a reference to an element.
#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
#[cfg_attr(feature = "web", derive(Tsify))]
pub enum ElementRefAnnotation {
    /// The reference to this element is the "original" reference. I.e., it was not
    /// inherited from some `extend`.
    Original,
    /// The reference to this element is a duplicate. The original reference is somewhere else in
    /// the render tree.
    Duplicate,
}

/// A flattened version of DastElement that is easier to serialize
/// Instead of children, an array of references to to child ids is used
/// for element children, and `text` children are included as literal strings.
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

    #[serde(skip_serializing_if = "Option::is_none")]
    pub source_doc: Option<SourceDoc>,
}

impl Serialize for FlatDastElement {
    /// Implement a custom serialize for FlatDastElement in order to treat
    /// name="_error" special to turn it into type="error"
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        let have_position = self.position.is_some();
        let have_source_doc = self.source_doc.is_some();

        if self.name == "_error" {
            let n_fields =
                2 + if have_position { 1 } else { 0 } + if have_source_doc { 1 } else { 0 };

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
            if have_source_doc {
                state.serialize_field("source_doc", &self.source_doc)?;
            }
            state.end()
        } else {
            let n_fields =
                5 + if have_position { 1 } else { 0 } + if have_source_doc { 1 } else { 0 };

            let mut state = serializer.serialize_struct("element", n_fields)?;

            state.serialize_field("type", "element")?;
            state.serialize_field("name", &self.name)?;
            state.serialize_field("attributes", &self.attributes)?;
            state.serialize_field("children", &self.children)?;
            state.serialize_field("data", &self.data)?;
            if have_position {
                state.serialize_field("position", &self.position)?;
            }
            if have_source_doc {
                state.serialize_field("source_doc", &self.source_doc)?;
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

    #[serde(skip_serializing_if = "Option::is_none")]
    pub source_doc: Option<SourceDoc>,
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

    #[serde(skip_serializing_if = "Option::is_none", skip_deserializing)]
    pub changed_state: Option<ForRenderProps>,
}

#[derive(Debug, Error)]
#[error("no value found")]
pub struct NoValueFound;
