//! The JSON loader, for the DAST `@doenet/parser` emits.

use super::{Dast, DastWriter, NodeId, NodeKind, StrId};

impl Dast {
    /// Load from DAST JSON as produced by `@doenet/parser`.
    pub fn from_json(json: &str) -> crate::Result<Dast> {
        let mut b = DastWriter::new();
        let kids = parse_root(&mut b, json)?;
        Ok(b.finish(&kids))
    }
}

// ---- JSON loader -------------------------------------------------------------
//
// A hand-written serde visitor: serde's internally tagged enums buffer every
// node before dispatching on `type`, which doubled deserialization time.
// Children are deserialized recursively into a scratch list and then
// appended to the flat `children` array so each node's range is contiguous.
// Nodes and strings are written in document order through `DastWriter`,
// which is what `scripts/cdast-encode.mjs` does too, so `to_binary`
// reproduces its bytes (`tests/wire.rs`).

fn parse_root(b: &mut DastWriter, json: &str) -> crate::Result<Vec<NodeId>> {
    let mut de = serde_json::Deserializer::from_str(json);
    let kids = Seed(
        b,
        Field {
            key: "children",
            what: "a DAST root object",
        },
    )
    .deserialize(&mut de)?;
    Ok(kids)
}

use serde::de::{self, DeserializeSeed, MapAccess, SeqAccess, Visitor};
use std::borrow::Cow;
use std::fmt;

/// One kind of JSON value the builder reads; `Seed` adapts it to serde.
trait Item: Copy {
    type Value;
    fn read<'de, D: de::Deserializer<'de>>(
        self,
        b: &mut DastWriter,
        d: D,
    ) -> Result<Self::Value, D::Error>;
}

struct Seed<'b, I>(&'b mut DastWriter, I);

impl<'de, I: Item> DeserializeSeed<'de> for Seed<'_, I> {
    type Value = I::Value;
    fn deserialize<D: de::Deserializer<'de>>(self, d: D) -> Result<Self::Value, D::Error> {
        self.1.read(self.0, d)
    }
}

/// A JSON array of items.
#[derive(Clone, Copy)]
struct Seq<I>(I, &'static str);

impl<I: Item> Item for Seq<I> {
    type Value = Vec<I::Value>;
    fn read<'de, D: de::Deserializer<'de>>(
        self,
        b: &mut DastWriter,
        d: D,
    ) -> Result<Self::Value, D::Error> {
        struct V<'b, I>(&'b mut DastWriter, Seq<I>);
        impl<'de, I: Item> Visitor<'de> for V<'_, I> {
            type Value = Vec<I::Value>;
            fn expecting(&self, f: &mut fmt::Formatter) -> fmt::Result {
                f.write_str(self.1.1)
            }
            fn visit_seq<A: SeqAccess<'de>>(self, mut s: A) -> Result<Self::Value, A::Error> {
                let mut v = Vec::with_capacity(s.size_hint().unwrap_or(0));
                while let Some(x) = s.next_element_seed(Seed(&mut *self.0, self.1.0))? {
                    v.push(x);
                }
                Ok(v)
            }
        }
        d.deserialize_seq(V(b, self))
    }
}

/// An object of which only one key, a node list, matters: the root's and an
/// attribute's `children`, an index's `value`.
#[derive(Clone, Copy)]
struct Field {
    key: &'static str,
    what: &'static str,
}

impl Item for Field {
    type Value = Vec<NodeId>;
    fn read<'de, D: de::Deserializer<'de>>(
        self,
        b: &mut DastWriter,
        d: D,
    ) -> Result<Self::Value, D::Error> {
        struct V<'b>(&'b mut DastWriter, Field);
        impl<'de> Visitor<'de> for V<'_> {
            type Value = Vec<NodeId>;
            fn expecting(&self, f: &mut fmt::Formatter) -> fmt::Result {
                f.write_str(self.1.what)
            }
            fn visit_map<A: MapAccess<'de>>(self, mut m: A) -> Result<Self::Value, A::Error> {
                let mut nodes = Vec::new();
                while let Some(key) = m.next_key::<Cow<str>>()? {
                    if key == self.1.key {
                        nodes = m.next_value_seed(Seed(&mut *self.0, NODES))?;
                    } else {
                        m.next_value::<de::IgnoredAny>()?;
                    }
                }
                Ok(nodes)
            }
        }
        d.deserialize_map(V(b, self))
    }
}

/// A JSON array of nodes, returned as their ids (not yet attached).
const NODES: Seq<Node> = Seq(Node, "an array of DAST nodes");

#[derive(Clone, Copy)]
struct Node;

impl Item for Node {
    type Value = NodeId;
    fn read<'de, D: de::Deserializer<'de>>(
        self,
        b: &mut DastWriter,
        d: D,
    ) -> Result<Self::Value, D::Error> {
        struct V<'b>(&'b mut DastWriter);
        impl<'de> Visitor<'de> for V<'_> {
            type Value = NodeId;
            fn expecting(&self, f: &mut fmt::Formatter) -> fmt::Result {
                f.write_str("a DAST node object")
            }
            fn visit_map<A: MapAccess<'de>>(self, mut m: A) -> Result<Self::Value, A::Error> {
                let b = self.0;
                let mut kind = NodeKind::Other;
                let mut name: Option<StrId> = None;
                let mut value: Option<StrId> = None;
                // (name, index expressions as node lists) per path part
                let mut path: Vec<(StrId, Vec<Vec<NodeId>>)> = Vec::new();
                // (name, children) per attribute
                let mut attrs: Vec<(StrId, Vec<NodeId>)> = Vec::new();
                let mut kids: Vec<NodeId> = Vec::new();
                while let Some(key) = m.next_key::<Cow<str>>()? {
                    match key.as_ref() {
                        "type" => {
                            let t: Cow<str> = m.next_value()?;
                            kind = match t.as_ref() {
                                "element" => NodeKind::Element,
                                "text" => NodeKind::Text,
                                "macro" => NodeKind::Macro,
                                _ => NodeKind::Other,
                            };
                        }
                        "name" => {
                            let s: Cow<str> = m.next_value()?;
                            name = Some(b.intern(&s));
                        }
                        "value" => {
                            let s: Cow<str> = m.next_value()?;
                            value = Some(b.intern(&s));
                        }
                        "path" => {
                            path =
                                m.next_value_seed(Seed(&mut *b, Seq(Part, "a macro path array")))?
                        }
                        "attributes" => attrs = m.next_value_seed(Seed(&mut *b, Attrs))?,
                        "children" => kids = m.next_value_seed(Seed(&mut *b, NODES))?,
                        _ => {
                            m.next_value::<de::IgnoredAny>()?;
                        }
                    }
                }
                let id = match kind {
                    NodeKind::Element => {
                        let tag = name.unwrap_or_else(|| b.intern(""));
                        b.element(tag, attrs, &kids)
                    }
                    NodeKind::Text => {
                        let v = value.unwrap_or_else(|| b.intern(""));
                        b.leaf(NodeKind::Text, v)
                    }
                    NodeKind::Macro => b.macro_(path),
                    NodeKind::Other => b.leaf(NodeKind::Other, StrId::new(0)),
                };
                Ok(id)
            }
        }
        d.deserialize_map(V(b))
    }
}

/// One path part: `{name, index: [{value: [nodes]}, ...]}`.
#[derive(Clone, Copy)]
struct Part;

impl Item for Part {
    type Value = (StrId, Vec<Vec<NodeId>>);
    fn read<'de, D: de::Deserializer<'de>>(
        self,
        b: &mut DastWriter,
        d: D,
    ) -> Result<Self::Value, D::Error> {
        struct V<'b>(&'b mut DastWriter);
        impl<'de> Visitor<'de> for V<'_> {
            type Value = (StrId, Vec<Vec<NodeId>>);
            fn expecting(&self, f: &mut fmt::Formatter) -> fmt::Result {
                f.write_str("a path part object")
            }
            fn visit_map<A: MapAccess<'de>>(self, mut m: A) -> Result<Self::Value, A::Error> {
                let mut name = None;
                let mut indices = Vec::new();
                while let Some(key) = m.next_key::<Cow<str>>()? {
                    match key.as_ref() {
                        "name" => {
                            let s: Cow<str> = m.next_value()?;
                            name = Some(self.0.intern(&s));
                        }
                        // Only each index object's `value` node list matters.
                        "index" => {
                            indices = m.next_value_seed(Seed(
                                &mut *self.0,
                                Seq(
                                    Field {
                                        key: "value",
                                        what: "an index object",
                                    },
                                    "an index array",
                                ),
                            ))?
                        }
                        _ => {
                            m.next_value::<de::IgnoredAny>()?;
                        }
                    }
                }
                let name = name.unwrap_or_else(|| self.0.intern(""));
                Ok((name, indices))
            }
        }
        d.deserialize_map(V(b))
    }
}

/// The attributes object: (name, children) per attribute.
#[derive(Clone, Copy)]
struct Attrs;

impl Item for Attrs {
    type Value = Vec<(StrId, Vec<NodeId>)>;
    fn read<'de, D: de::Deserializer<'de>>(
        self,
        b: &mut DastWriter,
        d: D,
    ) -> Result<Self::Value, D::Error> {
        struct V<'b>(&'b mut DastWriter);
        impl<'de> Visitor<'de> for V<'_> {
            type Value = Vec<(StrId, Vec<NodeId>)>;
            fn expecting(&self, f: &mut fmt::Formatter) -> fmt::Result {
                f.write_str("an attributes object")
            }
            fn visit_map<A: MapAccess<'de>>(self, mut m: A) -> Result<Self::Value, A::Error> {
                let mut v = Vec::new();
                while let Some(key) = m.next_key::<Cow<str>>()? {
                    let name = self.0.intern(&key);
                    // Only each attribute object's `children` matter.
                    let kids = m.next_value_seed(Seed(
                        &mut *self.0,
                        Field {
                            key: "children",
                            what: "an attribute object",
                        },
                    ))?;
                    v.push((name, kids));
                }
                Ok(v)
            }
        }
        d.deserialize_map(V(b))
    }
}
