//! DASTs built in Rust, for unit tests of the core that need neither the
//! parser nor node (ADR 0016, Migration step 8).
//!
//! ```
//! use cells_core::testing::dast::{document, el, mac, part, text};
//!
//! // <point name="p">(1,2)</point>
//! // <point name="q" extend="$p" x="3"/>
//! // <number name="n">$p.x + $r[2].y</number>
//! let dast = document([
//!     el("point").name("p").text("(1,2)"),
//!     el("point").name("q").attr("extend", mac("p")).attr("x", "3"),
//!     el("number")
//!         .name("n")
//!         .child(mac("p.x"))
//!         .text(" + ")
//!         .child([part("r").index("2"), part("y")]),
//! ]);
//! assert_eq!(dast.str(dast.children(0)[0]), "document");
//! ```
//!
//! What is built is the DAST the core reads, which is the parser's after
//! normalization (`normalizeDocumentDast`). The builder does not normalize:
//! text is not split around `$` references (write `mac` where the parser
//! would find one), and sugar the normalizer expands (an `<answer>`'s
//! award, a `<repeat>`'s setup, a `<graph>`'s `_dynamicChildren`) is
//! written in its expanded form or left out, as a test needs. Nodes are
//! numbered and strings interned as the JSON loader does
//! (`dast::DastWriter`), so a tree written as the parser would produce it
//! is the same DAST, byte for byte (`tests/dast_builder.rs`).

use crate::dast::{Dast, DastWriter, NodeId, NodeKind};

/// A node of a tree to build.
#[derive(Debug, Clone)]
pub enum Node {
    Element(Element),
    Text(String),
    /// A `$` reference: its path, one part per `.`.
    Macro(Vec<Part>),
}

/// An element: its tag, its attributes in order, and its children.
#[derive(Debug, Clone)]
pub struct Element {
    tag: String,
    attrs: Vec<(String, Vec<Node>)>,
    children: Vec<Node>,
}

/// One part of a reference's path: a name and its `[index]` expressions,
/// each as its value nodes.
#[derive(Debug, Clone)]
pub struct Part {
    name: String,
    indices: Vec<Vec<Node>>,
}

/// An element of the tag `tag`, without attributes or children.
pub fn el(tag: &str) -> Element {
    Element {
        tag: tag.to_string(),
        attrs: Vec::new(),
        children: Vec::new(),
    }
}

/// A text node.
pub fn text(s: &str) -> Node {
    Node::Text(s.to_string())
}

/// A reference without indices: `mac("c.radius")` is `$c.radius`.
pub fn mac(path: &str) -> Node {
    Node::Macro(path.split('.').map(part).collect())
}

/// A part of a reference's path, for one with indices:
/// `[part("r").index("2"), part("p")]` is `$r[2].p`.
pub fn part(name: &str) -> Part {
    Part {
        name: name.to_string(),
        indices: Vec::new(),
    }
}

impl Part {
    /// Adds an `[index]` expression: `part("r").index([mac("i"), text("+1")])`
    /// is `r[$i+1]`.
    pub fn index(mut self, value: impl Into<Nodes>) -> Self {
        self.indices.push(value.into().0);
        self
    }
}

impl Element {
    /// Adds the attribute `name` with the value `value`: text, a node, or a
    /// list of nodes (`[mac("a"), text("+1")]`).
    pub fn attr(mut self, name: &str, value: impl Into<Nodes>) -> Self {
        self.attrs.push((name.to_string(), value.into().0));
        self
    }

    /// Adds the attribute `name` without a value, as `<point hide/>`.
    pub fn flag(self, name: &str) -> Self {
        self.attr(name, Nodes(Vec::new()))
    }

    /// Adds the `name` attribute.
    pub fn name(self, name: &str) -> Self {
        self.attr("name", name)
    }

    /// Adds a child.
    pub fn child(mut self, node: impl Into<Node>) -> Self {
        self.children.push(node.into());
        self
    }

    /// Adds a text child.
    pub fn text(self, s: &str) -> Self {
        self.child(text(s))
    }
}

/// The value of an attribute or an index: a list of nodes.
#[derive(Debug, Clone)]
pub struct Nodes(Vec<Node>);

impl From<&str> for Nodes {
    fn from(s: &str) -> Self {
        Nodes(vec![text(s)])
    }
}

impl From<Node> for Nodes {
    fn from(n: Node) -> Self {
        Nodes(vec![n])
    }
}

impl From<Element> for Nodes {
    fn from(e: Element) -> Self {
        Nodes(vec![Node::Element(e)])
    }
}

impl<const N: usize> From<[Node; N]> for Nodes {
    fn from(ns: [Node; N]) -> Self {
        Nodes(ns.into())
    }
}

impl From<Vec<Node>> for Nodes {
    fn from(ns: Vec<Node>) -> Self {
        Nodes(ns)
    }
}

impl From<Element> for Node {
    fn from(e: Element) -> Self {
        Node::Element(e)
    }
}

impl From<&str> for Node {
    fn from(s: &str) -> Self {
        text(s)
    }
}

/// A reference with indices, from its parts.
impl<const N: usize> From<[Part; N]> for Node {
    fn from(parts: [Part; N]) -> Self {
        Node::Macro(parts.into())
    }
}

/// A document: `nodes` inside a `<document>` element, as the parser wraps
/// every source.
pub fn document<const N: usize>(nodes: [Element; N]) -> Dast {
    let mut doc = el("document");
    for n in nodes {
        doc = doc.child(n);
    }
    build([Node::Element(doc)])
}

/// The DAST whose root has the children `nodes`, as given: no
/// `<document>` element is added (the compile then synthesizes the
/// document's component).
pub fn build(nodes: impl IntoIterator<Item = Node>) -> Dast {
    let mut w = DastWriter::new();
    let kids: Vec<NodeId> = nodes.into_iter().map(|n| write(&mut w, n)).collect();
    w.finish(&kids)
}

/// Writes `node` after its contents, interning strings in the order the
/// JSON loader meets them: a tag, then each attribute's name and its
/// children, then the children; a path part's name, then its indices.
fn write(w: &mut DastWriter, node: Node) -> NodeId {
    match node {
        Node::Text(s) => {
            let s = w.intern(&s);
            w.leaf(NodeKind::Text, s)
        }
        Node::Element(e) => {
            let tag = w.intern(&e.tag);
            let attrs = e
                .attrs
                .into_iter()
                .map(|(name, value)| {
                    let name = w.intern(&name);
                    (name, write_all(w, value))
                })
                .collect();
            let kids = write_all(w, e.children);
            w.element(tag, attrs, &kids)
        }
        Node::Macro(parts) => {
            let path = parts
                .into_iter()
                .map(|p| {
                    let name = w.intern(&p.name);
                    let indices = p.indices.into_iter().map(|i| write_all(w, i)).collect();
                    (name, indices)
                })
                .collect();
            w.macro_(path)
        }
    }
}

fn write_all(w: &mut DastWriter, nodes: Vec<Node>) -> Vec<NodeId> {
    nodes.into_iter().map(|n| write(w, n)).collect()
}

/// Loads the document `dast`, as `test_utils::load` loads source, but with
/// every author's value essential (`LoadOptions::classify` off, ADR 0018):
/// the unit tests it serves check the language's rules over test-only
/// components, which no input reaches, and request their props unchecked
/// (`request_prop`).
#[cfg(any(test, feature = "testing"))]
pub fn load(dast: Dast) -> crate::Result<crate::Document> {
    let mut t = crate::LoadTimings::default();
    let options = crate::LoadOptions {
        classify: false,
        ..Default::default()
    };
    crate::Document::load_dast(std::sync::Arc::new(dast), options, &mut t)
}
