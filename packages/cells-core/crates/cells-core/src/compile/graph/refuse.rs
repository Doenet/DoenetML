//! The refuse analysis over the template graph's definitions (ADR 0026,
//! ADR 0032 step 8): a warning for each interactive prop whose request
//! would be refused and a note for each whose request would be dropped,
//! once per template element, by the rule the tick applies to the program
//! (`program::refuse`).

use super::define::Defined;
use super::share::FxMap;
use super::*;
use crate::diagnostics::Diagnostic;
use crate::program::refuse::{self, Finding, Graph, NodeKind as RefuseKind};

/// The graph's cells as the refuse analysis reads them: a cell is named
/// by the node its aliases merged under, a node by the defining node of
/// an operator.
struct Cells<'a> {
    g: &'a TemplateGraph,
    d: &'a Defined,
    /// The cells after the head that a vector operator writes, by its
    /// defining node.
    vec_outs: FxMap<GraphNode, Vec<GraphNode>>,
}

impl<'a> Cells<'a> {
    fn new(g: &'a TemplateGraph, d: &'a Defined) -> Self {
        let mut outs: FxMap<GraphNode, Vec<(u8, GraphNode)>> = FxMap::default();
        for (s, def) in g.defs.iter().enumerate() {
            let s = GraphNode::from_index(s);
            if let Def::VecOut(head, k) = *def
                && d.defines(s)
            {
                let op = d.def(d.cell_of(head));
                outs.entry(op).or_default().push((k, d.cell_of(s)));
            }
        }
        let vec_outs = outs
            .into_iter()
            .map(|(op, mut outs)| {
                outs.sort_unstable();
                (op, outs.into_iter().map(|(_, c)| c).collect())
            })
            .collect();
        Cells { g, d, vec_outs }
    }

    fn def(&self, cell: GraphNode) -> &Def {
        &self.g.defs[self.d.def(cell).index()]
    }

    /// Whether `cell` is a constant as the program will have it: a
    /// constant, or a given value no student's action can write. A math
    /// handle's value is the engine's, and not zero.
    fn constant(&self, cell: GraphNode) -> Option<f64> {
        match *self.def(cell) {
            Def::Const(v) => Some(v.unwrap_or(f64::NAN)),
            Def::Given(v) if !self.d.essential[self.d.def(cell).index()] => {
                Some(v.unwrap_or(f64::NAN))
            }
            _ => None,
        }
    }
}

impl Graph for Cells<'_> {
    type Cell = GraphNode;
    type Node = GraphNode;

    fn n_cells(&self) -> usize {
        self.g.nodes.len()
    }

    fn n_nodes(&self) -> usize {
        self.g.nodes.len()
    }

    fn producer(&self, cell: GraphNode) -> Option<GraphNode> {
        let d = self.d.def(cell);
        match self.g.defs[d.index()] {
            Def::Op(..) => Some(d),
            Def::VecOut(head, _) => Some(self.d.def(self.d.cell_of(head))),
            _ => None,
        }
    }

    fn inputs(&self, node: GraphNode) -> impl Iterator<Item = GraphNode> + '_ {
        let inputs: &[GraphNode] = match &self.g.defs[node.index()] {
            Def::Op(_, inputs) => inputs,
            _ => &[],
        };
        inputs.iter().map(|&s| self.d.cell_of(s))
    }

    fn outputs(&self, node: GraphNode) -> impl Iterator<Item = GraphNode> + '_ {
        std::iter::once(self.d.cell_of(node))
            .chain(self.vec_outs.get(&node).into_iter().flatten().copied())
    }

    fn writes(&self, node: GraphNode) -> u64 {
        match self.g.defs[node.index()] {
            Def::Op(GraphOp::Spec(spec), _) => spec.writes(),
            _ => 0,
        }
    }

    fn kind(&self, node: GraphNode) -> RefuseKind {
        match self.g.defs[node.index()] {
            Def::Op(GraphOp::Spec(OpSpec::Vec(_)), _) => RefuseKind::Vector,
            Def::Op(GraphOp::Spec(OpSpec::Sym(_)), _) | Def::Op(GraphOp::Template(_), _) => {
                RefuseKind::Symbolic
            }
            _ => RefuseKind::Scalar,
        }
    }

    fn is_essential(&self, cell: GraphNode) -> bool {
        let d = self.d.def(cell);
        matches!(self.g.defs[d.index()], Def::Given(_)) && self.d.essential[d.index()]
    }

    /// A flag that is a constant and set holds the cell for good, as the
    /// program has it: a given value no input writes among them.
    fn held_always(&self, cell: GraphNode) -> bool {
        self.d
            .flags(cell)
            .iter()
            .any(|&f| self.constant(self.d.cell_of(f)).is_some_and(|v| v != 0.0))
    }
}

/// Requests the program cannot land (ADR 0026), once per template
/// element: each interactive prop's cell once, with the first component
/// that names it, in the order the graph lists components (`TemplateGraph::comps`).
pub(crate) fn refuse_warnings(
    g: &TemplateGraph,
    d: &Defined,
    c: CompiledRef<'_>,
) -> Vec<Diagnostic> {
    let mut asked = Vec::new();
    let mut owner: Vec<(usize, usize, usize)> = Vec::new();
    let mut is_asked = vec![false; g.nodes.len()];
    for (ci, comp) in g.comps.iter().enumerate() {
        let (ty, np) = (comp.component_type, comp.n_public as usize);
        for pi in 0..np {
            let cell = d.cell_of(comp.base.offset(pi));
            if !is_asked[cell.index()] && ty.is_interactive_prop(np, pi) {
                is_asked[cell.index()] = true;
                asked.push(cell);
                owner.push((ci, pi, np));
            }
        }
    }
    let findings = refuse::analyze(&Cells::new(g, d), &asked);
    // The findings come in the order of `asked`.
    let mut at = 0;
    let mut warnings = Vec::with_capacity(findings.len());
    for (cell, finding) in findings {
        while asked[at] != cell {
            at += 1;
        }
        let (ci, pi, np) = owner[at];
        let comp = g.comps[ci];
        let ty = comp.component_type;
        let (who, node) = match comp.elem {
            Some((t, e)) => {
                let row = c.plans.templates[t.index()].row(e);
                let who = match row.name {
                    StrId::NONE => format!("<{}>", ty.tag()),
                    s => c.dast.strings.get(s).trim().to_string(),
                };
                (who, Some(row.node).filter(|n| !n.is_none()))
            }
            None => (format!("<{}>", ty.tag()), None),
        };
        let prop = match ty.prop_name(np, pi) {
            Some(name) => format!("{who}.{name}"),
            None => who,
        };
        warnings.push(match finding {
            Finding::Twice { source } => Diagnostic::warning(
                "cells-request-reaches-its-source-twice",
                node,
                format!(
                    "a request on '{prop}' is refused: the value it would write, '{}', reaches it along more than one path, so the request could not land where it asks",
                    slot_label(g, c, d.def(source))
                ),
            ),
            Finding::Drops => Diagnostic::info(
                "cells-request-meets-no-inverse",
                node,
                format!(
                    "a request on '{prop}' is dropped: it reaches an operator with no inverse (a power or a comparison)"
                ),
            ),
        });
    }
    warnings
}

/// How node `n` is named in a warning or an error: its component, by
/// name or by its tag and position in `TemplateGraph::comps`, and its
/// prop.
pub(super) fn slot_label(g: &TemplateGraph, c: CompiledRef<'_>, n: GraphNode) -> String {
    let owner = g.comps.iter().enumerate().find(|(_, comp)| {
        !comp.base.is_none()
            && comp.base.index() <= n.index()
            && n.index() < comp.base.index() + comp.n_ports as usize
    });
    let Some((ci, comp)) = owner else {
        return format!("(anonymous slot {n})");
    };
    let pi = n.index() - comp.base.index();
    let name = comp
        .elem
        .and_then(|(t, e)| match c.plans.templates[t.index()].row(e).name {
            StrId::NONE => None,
            s => Some(c.dast.strings.get(s).trim().to_string()),
        });
    let owner = name.unwrap_or_else(|| format!("<{}>#{ci}", comp.component_type.tag()));
    match comp.component_type.prop_name(comp.n_public as usize, pi) {
        Some(name) => format!("{owner}.{name}"),
        None => format!("{owner}.(hidden slot {pi})"),
    }
}
