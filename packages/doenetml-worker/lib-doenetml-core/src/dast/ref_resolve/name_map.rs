use std::{
    fmt,
    ops::{Deref, DerefMut},
};

use regex::Regex;
use rustc_hash::FxHashMap;
use serde::{
    de::{MapAccess, Visitor},
    ser::SerializeMap,
    Deserialize, Deserializer, Serialize,
};

use crate::dast::{flat_dast::SourceDoc, ref_resolve::Ref};

/// The key into `NameMap` that accounts for both the name of an element
/// and the `source_doc` where the element originated.
/// If the element was present in the original source, `source_doc` will be `0`.
/// If the element was loaded from external content, `source_doc` will be the index
/// of that document in the list of source documents.
// TODO: update this comment when determine where this list of source documents is stored
#[derive(Debug, Serialize, Deserialize, Clone, Hash, PartialEq, Eq)]
pub struct NameWithSource {
    pub name: String,
    pub source_doc: SourceDoc,
}

/// Try to create a `NameWithSource` from a string slice of the form
/// `name:source_doc`, where `name` is a string and `source_doc` is an integer.
impl TryFrom<&str> for NameWithSource {
    type Error = anyhow::Error;

    fn try_from(value: &str) -> Result<Self, Self::Error> {
        let name_source_re = Regex::new(r"^([^:]+):(\d+)$")?;
        let captures = name_source_re
            .captures(value)
            .ok_or(anyhow::anyhow!("Invalid name with source: {value}"))?;
        let name = captures.get(1).unwrap().as_str().to_string();
        let source_doc = captures.get(2).unwrap().as_str().try_into().unwrap();
        Ok(NameWithSource { name, source_doc })
    }
}

/// Create a string of the form `name:source_doc` from a `NameSource`
impl From<&NameWithSource> for String {
    fn from(value: &NameWithSource) -> Self {
        format!("{}:{}", value.name, value.source_doc)
    }
}

/// Map of all the names and source_doc combinations that are accessible (as descendants) from the node.
/// The data structure uses a `FxHashMap` so that iterating over the `name_map` is done in a consistent order.
#[derive(Debug, Default, Clone)]
pub struct NameMap(pub FxHashMap<NameWithSource, Ref>);

impl Deref for NameMap {
    type Target = FxHashMap<NameWithSource, Ref>;

    fn deref(&'_ self) -> &'_ Self::Target {
        &self.0
    }
}

impl DerefMut for NameMap {
    fn deref_mut(&'_ mut self) -> &'_ mut Self::Target {
        &mut self.0
    }
}

impl Serialize for NameMap {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        let mut map = serializer.serialize_map(Some(self.0.len()))?;
        for (name_with_source_doc, ref_) in &self.0 {
            let key: String = name_with_source_doc.into();
            map.serialize_entry(&key, ref_)?;
        }
        map.end()
    }
}

struct NameMapVisitor {}

impl NameMapVisitor {
    fn new() -> Self {
        NameMapVisitor {}
    }
}

impl<'de> Visitor<'de> for NameMapVisitor {
    type Value = NameMap;

    fn expecting(&self, formatter: &mut fmt::Formatter) -> fmt::Result {
        formatter.write_str("a name map")
    }

    fn visit_map<M>(self, mut access: M) -> Result<Self::Value, M::Error>
    where
        M: MapAccess<'de>,
    {
        let mut map = NameMap::default();

        while let Some((key, value)) = access.next_entry::<String, Ref>()? {
            let name_with_source: NameWithSource = key.as_str().try_into().unwrap();
            map.0.insert(name_with_source, value);
        }

        Ok(map)
    }
}

impl<'de> Deserialize<'de> for NameMap {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: Deserializer<'de>,
    {
        deserializer.deserialize_map(NameMapVisitor::new())
    }
}
