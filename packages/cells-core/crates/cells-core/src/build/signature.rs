//! The input signature: what students can act on in a document, and what
//! decides what each input shows and whether it exists or can be acted on,
//! named by stable keys and literals only. It is read off the template
//! graph's definitions (ADR 0035, ADR 0032; `compile/graph/signature.rs`),
//! so an input in any iteration or branch is covered by its template's.
//! Here are what it is and the readings both sides share.
//!
//! An input's *derivation* is a hash over the backward closure of its
//! interactive props and of what decides whether it exists or can be acted
//! on (the `hide` of it and its ancestors, the cases, conditionals and
//! repeats around it). Each cell hashes as what it is, never by its index:
//! an essential cell by its key and prop, a constant by its value, a
//! derived cell by its operator over its inputs' hashes. The defaults of
//! the essential cells in the closure are kept beside it, with whether each
//! is the input's starting value.

use std::collections::BTreeMap;
use std::hash::{DefaultHasher, Hash, Hasher};

use super::*;

/// A document's inputs, by their element's stable key.
#[derive(Debug, Clone, Default, PartialEq)]
pub struct Signature {
    pub inputs: BTreeMap<String, Input>,
}

/// One input: an element with props a renderer may request, an answer, or
/// a select.
#[derive(Debug, Clone, PartialEq)]
pub struct Input {
    /// The element it was made from, for a report.
    pub node: NodeId,
    pub tag: &'static str,
    /// Its interactive props, by name, with their value types.
    pub props: Vec<(String, ValueType)>,
    /// The values a request on it can take.
    pub domain: Domain,
    /// What decides what it shows and whether it exists or can be acted on,
    /// but for the defaults of the essential cells it reads. It names each
    /// essential cell by the (element key, prop) that defines it and its
    /// type, so it also fixes which cells a request on the input writes and
    /// which elements share them.
    pub derivation: u64,
    /// The defaults of every essential cell its closure reads, by the
    /// cell's key: the default's hash, and whether it is the input's
    /// starting value.
    pub defaults: BTreeMap<(String, String), (u64, bool)>,
}

/// The values a request on an input can take.
#[derive(Debug, Clone, PartialEq)]
pub enum Domain {
    /// Any value of its type: a number, math or text input, a slider, a
    /// graph's bounds.
    Any,
    /// Inside a graph whose bounds the author set as literals, as
    /// `[xmin, xmax, ymin, ymax]`.
    Bounds([f64; 4]),
    /// Inside a graph whose bounds are given by cells: their derivation.
    BoundsBy(u64),
    /// A choice input's choices, by key and content, in order: it stores a
    /// position.
    Choices(Vec<(String, u64)>),
    /// A select's options by key, in order, with how it picks.
    Options {
        keys: Vec<String>,
        weights: Vec<u64>,
        num_to_select: u32,
        with_replacement: bool,
    },
}

impl Domain {
    /// Whether every value this domain allows, `new` allows too.
    pub fn within(&self, new: &Domain) -> bool {
        match (self, new) {
            (_, Domain::Any) => true,
            (Domain::Bounds([a0, a1, b0, b1]), Domain::Bounds([c0, c1, d0, d1])) => {
                c0 <= a0 && a1 <= c1 && d0 <= b0 && b1 <= d1
            }
            (Domain::Choices(old), Domain::Choices(new)) => new.starts_with(old),
            (old, new) => old == new,
        }
    }
}

pub(crate) fn hash_of(x: impl Hash) -> u64 {
    let mut h = DefaultHasher::new();
    x.hash(&mut h);
    h.finish()
}

/// A number's bits, every NaN one.
pub(crate) fn bits(v: f64) -> u64 {
    if v.is_nan() {
        f64::NAN.to_bits()
    } else {
        v.to_bits()
    }
}

/// A prop's name, or its position for a hidden slot.
pub(crate) fn prop_label(ty: ComponentType, n_props: usize, pi: usize) -> String {
    ty.prop_name(n_props, pi)
        .map_or_else(|| format!("(hidden {pi})"), |n| n.into_owned())
}

/// Expression text with each cell leaf, numbered by its position among the
/// operator's inputs (`cellN0`), as `N#0`.
pub(crate) fn canonical_leaves(text: &str) -> String {
    let mut out = String::with_capacity(text.len());
    let mut rest = text;
    while let Some(i) = rest.find("cell") {
        out.push_str(&rest[..i]);
        let after = &rest[i + 4..];
        let kind = after.chars().next();
        let digits = after
            .get(1..)
            .map_or(0, |s| s.bytes().take_while(u8::is_ascii_digit).count());
        match (kind, digits) {
            (Some(k @ ('N' | 'M')), n) if n > 0 => {
                out.push(k);
                out.push('#');
                out.push_str(&after[1..1 + n]);
                rest = &after[1 + n..];
            }
            _ => {
                out.push_str("cell");
                rest = after;
            }
        }
    }
    out.push_str(rest);
    out
}

/// A DAST subtree as text: tags, attributes and text, without positions.
pub(crate) fn dast_text(d: &crate::dast::Dast, n: NodeId) -> String {
    use crate::dast::NodeKind;
    let mut out = String::new();
    let mut stack = vec![(n, false)];
    while let Some((n, close)) = stack.pop() {
        match d.kind(n) {
            NodeKind::Element if close => {
                out.push_str("</>");
            }
            NodeKind::Element => {
                out.push('<');
                out.push_str(d.str(n));
                for a in d.attrs(n) {
                    out.push(' ');
                    out.push_str(d.attr_name(a));
                    out.push_str("=\"");
                    for &k in d.attr_children(a) {
                        out.push_str(&dast_text(d, k));
                    }
                    out.push('"');
                }
                out.push('>');
                stack.push((n, true));
                stack.extend(d.children(n).iter().rev().map(|&k| (k, false)));
            }
            _ => out.push_str(d.str(n)),
        }
    }
    out
}
