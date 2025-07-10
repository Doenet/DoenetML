use std::{
    fmt,
    ops::{Deref, DerefMut},
};

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
pub struct NameWithDoenetMLId {
    pub name: String,
    pub source_doc: SourceDoc,
}

/// Map of all the names and source_doc combinations that are accessible (as descendants) from the node.
/// The data structure uses a `FxHashMap` so that iterating over the `name_map` is done in a consistent order.
#[derive(Debug, Default, Clone)]
pub struct NameMap(pub FxHashMap<NameWithDoenetMLId, Ref>);

impl Deref for NameMap {
    type Target = FxHashMap<NameWithDoenetMLId, Ref>;

    fn deref(self: &'_ Self) -> &'_ Self::Target {
        &self.0
    }
}

impl DerefMut for NameMap {
    fn deref_mut(self: &'_ mut Self) -> &'_ mut Self::Target {
        &mut self.0
    }
}

impl Serialize for NameMap {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        let mut map = serializer.serialize_map(Some(self.0.len()))?;
        for (name_with_doenetml_id, ref_) in &self.0 {
            map.serialize_entry(
                &format!(
                    "{};{}",
                    name_with_doenetml_id.name, name_with_doenetml_id.source_doc
                ),
                ref_,
            )?;
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
            let mut split = key.split(";");
            let name = split.next().unwrap().to_string();
            let source_doc = split.next().unwrap().parse::<u16>().unwrap().into();
            map.0.insert(NameWithDoenetMLId { name, source_doc }, value);
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
