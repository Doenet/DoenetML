//! Implement transparent Serde serialization and deserialization for `Rc<T>` types.
use serde::{Deserialize, Deserializer, Serialize, Serializer};
use std::rc::Rc;

pub fn serialize<T, S>(data: &Rc<T>, serializer: S) -> Result<S::Ok, S::Error>
where
    T: Serialize,
    S: Serializer,
{
    data.as_ref().serialize(serializer)
}

pub fn deserialize<'de, T, D>(deserializer: D) -> Result<Rc<T>, D::Error>
where
    T: Deserialize<'de>,
    D: Deserializer<'de>,
{
    let t = T::deserialize(deserializer)?;
    Ok(Rc::new(t))
}
