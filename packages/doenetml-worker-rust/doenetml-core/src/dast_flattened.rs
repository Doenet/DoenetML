use serde::{Deserialize, Serialize};
use std::collections::HashMap;

use crate::dast::{DastAttribute, DastError, ElementData, Position};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
#[serde(rename = "root")]
pub struct FlatDastRoot {
    pub children: Vec<FlatDastElementContent>,

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
