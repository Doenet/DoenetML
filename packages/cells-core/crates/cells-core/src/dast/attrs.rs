//! The literal attributes of a DAST, kept after load in place of the DAST:
//! the presentation a renderer reads by a component's node (a style number,
//! decimals to display, a width), which is not state. Names and values are
//! ids in the DAST's string table, which every document's table begins
//! with, except a value made of several text nodes, which the table keeps.

use super::{Dast, NodeId, NodeKind, StrId};

/// A value that is no string: an attribute with no children.
const EMPTY: StrId = StrId::MAX;
/// A value id with this bit is an index into `LiteralAttrs::texts`.
const OWN: StrId = 1 << 31;

/// Every attribute of every element whose value is text alone (no
/// reference), by node.
#[derive(Debug, Default)]
pub struct LiteralAttrs {
    /// Per element with a literal attribute, in node order: its node and
    /// where its attributes start in `attrs`.
    nodes: Vec<(NodeId, u32)>,
    /// (name, value) per attribute, grouped by node.
    attrs: Vec<(StrId, StrId)>,
    /// Values of several text nodes, which have no id of their own.
    texts: Vec<Box<str>>,
}

impl LiteralAttrs {
    /// Gather `dast`'s literal attributes.
    pub fn new(dast: &Dast) -> LiteralAttrs {
        let literal = |a| {
            !dast
                .attr_children(a)
                .iter()
                .any(|&c| dast.kind(c) == NodeKind::Macro)
        };
        let elements = || (0..dast.len() as NodeId).filter(|&n| dast.kind(n) == NodeKind::Element);
        // Counted first, so the table is reserved at the size it keeps: it
        // is made while the load is at its peak.
        let (mut n_nodes, mut n_attrs) = (0, 0);
        for n in elements() {
            let k = dast.attrs(n).filter(|&a| literal(a)).count();
            n_nodes += (k > 0) as usize;
            n_attrs += k;
        }
        let mut out = LiteralAttrs {
            nodes: Vec::with_capacity(n_nodes),
            attrs: Vec::with_capacity(n_attrs),
            texts: Vec::new(),
        };
        for n in elements() {
            let start = out.attrs.len() as u32;
            for a in dast.attrs(n).filter(|&a| literal(a)) {
                let mut texts = dast
                    .attr_children(a)
                    .iter()
                    .copied()
                    .filter(|&c| dast.kind(c) == NodeKind::Text);
                let value = match (texts.next(), texts.next()) {
                    (None, _) => EMPTY,
                    (Some(t), None) => dast.str_id(t),
                    (Some(t), Some(u)) => {
                        let mut s = format!("{}{}", dast.str(t), dast.str(u));
                        texts.for_each(|t| s.push_str(dast.str(t)));
                        out.texts.push(s.into());
                        OWN | (out.texts.len() - 1) as StrId
                    }
                };
                out.attrs.push((dast.attr_name_id(a), value));
            }
            if out.attrs.len() as u32 > start {
                out.nodes.push((n, start));
            }
        }
        out
    }

    /// The (name, value) ids of `node`'s literal attributes.
    pub fn of(&self, node: NodeId) -> &[(StrId, StrId)] {
        match self.nodes.binary_search_by_key(&node, |&(n, _)| n) {
            Ok(i) => &self.attrs[self.range(i)],
            Err(_) => &[],
        }
    }

    /// Every node with a literal attribute, with its attributes.
    pub fn iter(&self) -> impl Iterator<Item = (NodeId, &[(StrId, StrId)])> {
        (0..self.nodes.len()).map(|i| (self.nodes[i].0, &self.attrs[self.range(i)]))
    }

    fn range(&self, i: usize) -> std::ops::Range<usize> {
        let start = self.nodes[i].1 as usize;
        let end = self
            .nodes
            .get(i + 1)
            .map_or(self.attrs.len(), |&(_, s)| s as usize);
        start..end
    }

    /// The text of a value id from `of` or `iter`; `strings` is the
    /// document's string table.
    pub fn text<'a>(&'a self, strings: &'a super::StringTable, value: StrId) -> &'a str {
        if value == EMPTY {
            ""
        } else if value & OWN != 0 {
            &self.texts[(value & !OWN) as usize]
        } else {
            strings.get(value)
        }
    }

    pub fn heap_bytes(&self) -> usize {
        self.nodes.capacity() * 8
            + self.attrs.capacity() * 8
            + self.texts.iter().map(|t| t.len() + 16).sum::<usize>()
    }
}
