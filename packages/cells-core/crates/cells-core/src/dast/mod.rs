//! A flat, columnar DAST. Nodes live in parallel arrays indexed by `NodeId`;
//! every string (tag names, attribute names, text, reference path parts)
//! lives once in a shared [`StringTable`]. Two loaders fill the same
//! structure: [`Dast::from_json`] (`json.rs`) for the JSON emitted by
//! `@doenet/parser`, and [`Dast::from_binary`] (`binary.rs`) for the compact
//! wire format written by `scripts/cdast-encode.mjs` (see
//! `docs/adr/0002-binary-wire-format.md`).
//!
//! Node 0 is a synthetic root element whose children are the document's
//! top-level nodes. Macros (`$a.b`) reuse the attribute range fields to index
//! the `path` array instead; each path part may carry `[index]` expressions
//! (`$r[3].p`, `$r[$i-2]`) whose value nodes live in `children` like any
//! other node list.

mod attrs;
mod binary;
mod json;

pub use attrs::LiteralAttrs;

use std::collections::HashMap;

pub type NodeId = u32;
pub type AttrId = u32;
pub type StrId = u32;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
#[repr(u8)]
pub enum NodeKind {
    Element = 0,
    Text = 1,
    Macro = 2,
    Other = 3,
}

impl NodeKind {
    fn from_u8(b: u8) -> NodeKind {
        match b {
            0 => NodeKind::Element,
            1 => NodeKind::Text,
            2 => NodeKind::Macro,
            _ => NodeKind::Other,
        }
    }
}

/// Deduplicated strings: `bytes[offsets[i]..offsets[i+1]]` is string `i`.
#[derive(Debug, Clone, Default)]
pub struct StringTable {
    pub offsets: Vec<u32>,
    pub bytes: Vec<u8>,
}

impl StringTable {
    pub fn new() -> Self {
        StringTable {
            offsets: vec![0],
            bytes: Vec::new(),
        }
    }

    pub fn len(&self) -> usize {
        self.offsets.len() - 1
    }

    pub fn is_empty(&self) -> bool {
        self.len() == 0
    }

    #[inline]
    pub fn get(&self, i: StrId) -> &str {
        let (a, b) = (
            self.offsets[i as usize] as usize,
            self.offsets[i as usize + 1] as usize,
        );
        // Validated once at load (binary) or produced from `str` (JSON).
        unsafe { std::str::from_utf8_unchecked(&self.bytes[a..b]) }
    }

    /// Append without deduplication.
    pub fn push(&mut self, s: &str) -> StrId {
        self.bytes.extend_from_slice(s.as_bytes());
        self.offsets.push(self.bytes.len() as u32);
        (self.offsets.len() - 2) as StrId
    }

    pub fn heap_bytes(&self) -> usize {
        self.offsets.capacity() * 4 + self.bytes.capacity()
    }
}

#[derive(Debug, Clone, Default)]
pub struct Dast {
    pub strings: StringTable,
    kind: Vec<u8>,
    /// element: tag string; text: value string; macro/other: unused
    str_: Vec<StrId>,
    /// element: attribute range; macro: path range
    a_start: Vec<u32>,
    a_count: Vec<u32>,
    c_start: Vec<u32>,
    c_count: Vec<u32>,
    attr_name: Vec<StrId>,
    attr_c_start: Vec<u32>,
    attr_c_count: Vec<u32>,
    children: Vec<NodeId>,
    path: Vec<StrId>,
    /// Per path part: range into `idx_c_*` of its `[index]` expressions.
    path_i_start: Vec<u32>,
    path_i_count: Vec<u32>,
    /// Per index expression: range into `children` of its value nodes.
    idx_c_start: Vec<u32>,
    idx_c_count: Vec<u32>,
}

/// Position of one part of a macro path in the `path` arrays.
pub type PathPart = u32;

impl Dast {
    pub const ROOT: NodeId = 0;

    pub fn len(&self) -> usize {
        self.kind.len()
    }

    pub fn is_empty(&self) -> bool {
        self.kind.is_empty()
    }

    #[inline]
    pub fn kind(&self, n: NodeId) -> NodeKind {
        NodeKind::from_u8(self.kind[n as usize])
    }

    /// Tag of an element or value of a text node.
    #[inline]
    pub fn str(&self, n: NodeId) -> &str {
        self.strings.get(self.str_[n as usize])
    }

    #[inline]
    pub fn str_id(&self, n: NodeId) -> StrId {
        self.str_[n as usize]
    }

    #[inline]
    pub fn children(&self, n: NodeId) -> &[NodeId] {
        let (s, c) = (
            self.c_start[n as usize] as usize,
            self.c_count[n as usize] as usize,
        );
        &self.children[s..s + c]
    }

    pub fn attrs(&self, n: NodeId) -> std::ops::Range<AttrId> {
        let s = self.a_start[n as usize];
        s..s + self.a_count[n as usize]
    }

    #[inline]
    pub fn attr_name(&self, a: AttrId) -> &str {
        self.strings.get(self.attr_name[a as usize])
    }

    #[inline]
    pub fn attr_name_id(&self, a: AttrId) -> StrId {
        self.attr_name[a as usize]
    }

    #[inline]
    pub fn attr_children(&self, a: AttrId) -> &[NodeId] {
        let (s, c) = (
            self.attr_c_start[a as usize] as usize,
            self.attr_c_count[a as usize] as usize,
        );
        &self.children[s..s + c]
    }

    /// An attribute by name; DoenetML attribute names ignore case.
    pub fn attr(&self, n: NodeId, name: &str) -> Option<AttrId> {
        self.attrs(n)
            .find(|&a| self.attr_name(a).eq_ignore_ascii_case(name))
    }

    /// Path parts of a macro node, as string ids.
    #[inline]
    pub fn macro_path(&self, n: NodeId) -> &[StrId] {
        let (s, c) = (
            self.a_start[n as usize] as usize,
            self.a_count[n as usize] as usize,
        );
        &self.path[s..s + c]
    }

    /// Positions of a macro's path parts, for `part_indices`.
    #[inline]
    pub fn macro_parts(&self, n: NodeId) -> std::ops::Range<PathPart> {
        let s = self.a_start[n as usize];
        s..s + self.a_count[n as usize]
    }

    /// The `[index]` expressions of one path part, each as its value nodes
    /// (`$r[3]` gives one index holding a text node; `$r[$i-2]` gives one
    /// index holding a macro and a text node).
    pub fn part_indices(&self, part: PathPart) -> impl Iterator<Item = &[NodeId]> + '_ {
        let (s, c) = (
            self.path_i_start[part as usize] as usize,
            self.path_i_count[part as usize] as usize,
        );
        (s..s + c).map(move |i| {
            let (cs, cc) = (self.idx_c_start[i] as usize, self.idx_c_count[i] as usize);
            &self.children[cs..cs + cc]
        })
    }

    /// Whether any part of the macro path carries an index.
    pub fn macro_has_index(&self, n: NodeId) -> bool {
        self.macro_parts(n)
            .any(|p| self.path_i_count[p as usize] > 0)
    }

    pub fn macro_display(&self, n: NodeId) -> String {
        self.macro_path(n)
            .iter()
            .map(|&p| self.strings.get(p))
            .collect::<Vec<_>>()
            .join(".")
    }

    pub fn heap_bytes(&self) -> usize {
        self.strings.heap_bytes()
            + self.kind.capacity()
            + 4 * (self.str_.capacity()
                + self.a_start.capacity()
                + self.a_count.capacity()
                + self.c_start.capacity()
                + self.c_count.capacity()
                + self.attr_name.capacity()
                + self.attr_c_start.capacity()
                + self.attr_c_count.capacity()
                + self.children.capacity()
                + self.path.capacity()
                + self.path_i_start.capacity()
                + self.path_i_count.capacity()
                + self.idx_c_start.capacity()
                + self.idx_c_count.capacity())
    }
}

// ---- construction ------------------------------------------------------------

/// Builds a [`Dast`] node by node, the way every builder of one from a tree
/// does (the JSON loader, `testing::dast`): a node is numbered after its
/// contents (post-order), with node 0 the root; strings are interned in the
/// order they are first written. Node ids feed `<select>`'s choice, so the
/// order is part of behaviour, and `to_binary` reproduces the JavaScript
/// encoder's bytes only for this order (`tests/wire.rs`).
pub(crate) struct DastWriter {
    dast: Dast,
    intern: HashMap<String, StrId>,
}

impl DastWriter {
    /// A writer holding only the root, whose children `finish` sets.
    pub(crate) fn new() -> Self {
        let mut w = DastWriter {
            dast: Dast {
                strings: StringTable::new(),
                ..Default::default()
            },
            intern: HashMap::new(),
        };
        let empty = w.intern("");
        w.push_node(NodeKind::Element, empty);
        w
    }

    pub(crate) fn intern(&mut self, s: &str) -> StrId {
        if let Some(&id) = self.intern.get(s) {
            return id;
        }
        let id = self.dast.strings.push(s);
        self.intern.insert(s.to_string(), id);
        id
    }

    /// A text node, or a node of another kind than element and macro (whose
    /// string is unused).
    pub(crate) fn leaf(&mut self, kind: NodeKind, s: StrId) -> NodeId {
        self.push_node(kind, s)
    }

    /// An element of the tag `tag`, written after its attributes' children
    /// and its children.
    pub(crate) fn element(
        &mut self,
        tag: StrId,
        attrs: Vec<(StrId, Vec<NodeId>)>,
        kids: &[NodeId],
    ) -> NodeId {
        let id = self.push_node(NodeKind::Element, tag);
        let d = &mut self.dast;
        d.a_start[id as usize] = d.attr_name.len() as u32;
        d.a_count[id as usize] = attrs.len() as u32;
        for (n, c) in attrs {
            d.attr_name.push(n);
            d.attr_c_start.push(d.children.len() as u32);
            d.attr_c_count.push(c.len() as u32);
            d.children.extend_from_slice(&c);
        }
        self.set_children(id, kids);
        id
    }

    /// A macro of the path `path`: each part's name and its `[index]`
    /// expressions, each as its value nodes, written before the macro.
    pub(crate) fn macro_(&mut self, path: Vec<(StrId, Vec<Vec<NodeId>>)>) -> NodeId {
        let id = self.push_node(NodeKind::Macro, 0);
        let d = &mut self.dast;
        d.a_start[id as usize] = d.path.len() as u32;
        d.a_count[id as usize] = path.len() as u32;
        for (name, indices) in path {
            d.path.push(name);
            d.path_i_start.push(d.idx_c_start.len() as u32);
            d.path_i_count.push(indices.len() as u32);
            for nodes in indices {
                d.idx_c_start.push(d.children.len() as u32);
                d.idx_c_count.push(nodes.len() as u32);
                d.children.extend_from_slice(&nodes);
            }
        }
        id
    }

    /// The DAST, with `kids` as the root's children.
    pub(crate) fn finish(mut self, kids: &[NodeId]) -> Dast {
        self.set_children(Dast::ROOT, kids);
        self.dast
    }

    fn push_node(&mut self, kind: NodeKind, s: StrId) -> NodeId {
        let d = &mut self.dast;
        d.kind.push(kind as u8);
        d.str_.push(s);
        d.a_start.push(0);
        d.a_count.push(0);
        d.c_start.push(0);
        d.c_count.push(0);
        (d.kind.len() - 1) as NodeId
    }

    fn set_children(&mut self, n: NodeId, kids: &[NodeId]) {
        let d = &mut self.dast;
        d.c_start[n as usize] = d.children.len() as u32;
        d.c_count[n as usize] = kids.len() as u32;
        d.children.extend_from_slice(kids);
    }
}

/// Load from either format, detected by the magic bytes.
pub fn load(bytes: &[u8]) -> crate::Result<Dast> {
    if bytes.starts_with(b"CDST") {
        Dast::from_binary(bytes)
    } else {
        let s = std::str::from_utf8(bytes)
            .map_err(|_| crate::Error::WireFormat("not UTF-8 JSON".into()))?;
        Dast::from_json(s)
    }
}
