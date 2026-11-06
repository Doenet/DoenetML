//! `<collect>`: its definition and its planner.

use crate::components::ComponentType;
use crate::components::define::*;
use crate::error::{Error, Result};

component! {
    /// `<collect>`: its children are copies of the collected components,
    /// and `count` how many (an aggregate).
    tags: ["collect"],
    props {
        count: aggregate(Count, Gathered),
    }
    presentation { asList }
    machinery: Collect,
}

pub const COUNT: usize = Props::AT.count;

/// The type a `<collect>` collects, from the text of its `componentType`
/// (none when it has no literal one).
pub(crate) fn collected_type(type_text: Option<String>) -> Result<ComponentType> {
    let type_text = type_text.ok_or(Error::BadCollect)?;
    ComponentType::from_tag(type_text.trim())
        .filter(|k| k.copyable())
        .ok_or_else(|| Error::BadCollectType(type_text.trim().into()))
}
