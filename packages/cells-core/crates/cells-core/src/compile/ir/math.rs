//! Math text: tokenized once while outlining ([`MathText`]), parsed once
//! by parsing ([`ParsedMath`]), and kept as text for the symbolic engine
//! ([`SymText`]).

use crate::compile::*;

/// Math text tokenized once: its `$ref`s are placeholders,
/// `Token::Cell(RefId::NONE)`, until planned.
pub(crate) struct MathText {
    pub(in crate::compile) toks: Vec<Token>,
    /// The `$ref` nodes, one per placeholder, in order.
    pub(in crate::compile) macros: Vec<NodeId>,
    /// The nodes the text was read from.
    pub(in crate::compile) nodes: Box<[NodeId]>,
}

impl MathText {
    pub(crate) fn tokens(&self) -> &[Token] {
        &self.toks
    }

    /// Where the text came from, for an error.
    pub(in crate::compile) fn src(&self) -> MathSrc<'_> {
        MathSrc(&self.nodes)
    }
}

/// The nodes math text was read from, spelled only when an error shows it.
#[derive(Clone, Copy)]
pub(crate) struct MathSrc<'n>(pub(in crate::compile) &'n [NodeId]);

impl MathSrc<'_> {
    /// The text, each `$ref` as written, trimmed.
    pub(crate) fn text(self, dast: &Dast) -> String {
        spell_math(dast, self.0).trim().to_string()
    }
}

/// Math text from `nodes` as written: its text, and `$` with each
/// reference's path. Other elements are skipped, as tokenizing skips them.
pub(in crate::compile) fn spell_math(dast: &Dast, nodes: &[NodeId]) -> String {
    let mut text = String::new();
    for &n in nodes {
        match dast.kind(n) {
            NodeKind::Text => text.push_str(dast.str(n)),
            NodeKind::Macro => {
                text.push('$');
                text.push_str(&dast.macro_display(n));
            }
            _ => {}
        }
    }
    text
}

/// The symbolic engine's text of a math template, spelled only when the
/// math is symbolic.
#[derive(Debug, Clone)]
pub(crate) enum SymText {
    /// Math text from the DAST: its nodes, and the plan of each `$ref` among
    /// them, in order, which the text spells as its leaf.
    Nodes {
        nodes: Box<[NodeId]>,
        plans: Box<[RefId]>,
    },
    /// One reference's leaf alone.
    Leaf(RefId),
    /// Text the compile spelled already (a condition's operand).
    Spelled(String),
}

impl SymText {
    /// The text, each `$ref` written `cellN<plan>`.
    pub(crate) fn spell(&self, dast: &Dast) -> String {
        let leaf = |p: RefId| crate::sym::engine::leaf_name(p.get(), false);
        match self {
            SymText::Nodes { nodes, plans } => {
                let mut text = String::new();
                let mut plans = plans.iter();
                for &n in nodes.iter() {
                    match dast.kind(n) {
                        NodeKind::Text => text.push_str(dast.str(n)),
                        // Spaces keep `2$a` from reading as one token.
                        NodeKind::Macro => {
                            let p = *plans.next().expect("a plan per reference");
                            text.push(' ');
                            text.push_str(&leaf(p));
                            text.push(' ');
                        }
                        _ => {}
                    }
                }
                text
            }
            SymText::Leaf(p) => leaf(*p),
            SymText::Spelled(text) => text.clone(),
        }
    }
}

/// A `<math>`'s text parsed once, as the type outlining settled.
#[derive(Debug, Clone)]
pub(crate) enum ParsedMath {
    /// A math: one expression.
    Expr(ExprId),
    /// A point or a tuple: an expression per entry.
    Entries(Vec<ExprId>),
}
