//! Aggregates in the template graph, as the abstract build materializes
//! them (`build/expand/aggregate.rs`) from the tree it stamped: the
//! document's and each aggregating section's credit over its scored items,
//! each weight gated by the cases around it, and each section's number
//! after the gates of the sections before it.
//!
//! The tree is the stamped templates': an element's children, an
//! iteration's or an option's root, and a conditional content's cases, one
//! per branch, each `active` when the choice is its position. A `$ref`
//! child is typed as the build places it; one that copies an answer or a
//! section, and a collect that gathers either, is a [`Gap`].

use super::walk::At;
use super::*;
use crate::components::prop::{answer, section};
use crate::limits::SCORE_CHUNK as CHUNK;

/// A component of the stamped tree.
#[derive(Debug, Clone, Copy)]
enum Tree {
    Elem(TemplateId, ElemId),
    /// Case `k` (1-based) of the conditional content at (template, element).
    Case(TemplateId, ElemId, usize),
    /// A `$ref` child of a template.
    RefChild(TemplateId, RefChildId),
}

impl<'c> Stamp<'c> {
    /// The reads of the document's and every section's credit and of every
    /// section's number.
    pub(super) fn aggregates(&mut self) {
        let doc = TemplateId::new(0);
        let root = self.c.plans.templates[doc.index()]
            .children
            .iter()
            .find_map(|ch| match ch {
                Child::Elem(e) => Some(*e),
                _ => None,
            })
            .expect("a document root");
        self.credit(doc, root);
        for t in TemplateId::below(self.c.plans.templates.len()) {
            if !self.g.stamped[t.index()] {
                continue;
            }
            let tpl = self.c.plans.templates[t.index()].view();
            for e in ElemId::below(tpl.elems.len()) {
                if !tpl.is_dead(e)
                    && tpl.row(e).component_type == ComponentType::Section
                    && self.aggregates_scores(t, e)
                {
                    self.credit(t, e);
                }
            }
        }
        self.numbers(Tree::Elem(doc, root), None, &mut None);
    }

    /// Whether section `e` of template `t` aggregates scores.
    fn aggregates_scores(&self, t: TemplateId, e: ElemId) -> bool {
        matches!(
            self.c.plans.templates[t.index()].plan(e).props.get(section::AGGREGATE),
            Some(Source::Leaf(Leaf::Const(v))) if *v != 0.0
        )
    }

    /// `creditAchieved` of the document or an aggregating section, element
    /// `e` of template `t`, reads the weighted mean of its scored items; its
    /// percentage reads it.
    fn credit(&mut self, t: TemplateId, e: ElemId) {
        let mut items = Vec::new();
        self.scored_items(Tree::Elem(t, e), None, &mut items);
        let Some(mean) = self.mean_credit(t, items) else {
            return; // Nothing to score: full credit, a constant.
        };
        let credit = self.g.port(t, e, section::CREDIT);
        self.read(credit, mean);
        let percent = self.g.port(t, e, section::PERCENT_CREDIT);
        self.read(percent, credit);
    }

    /// The weighted mean of `items`, read in chunks; None when there are
    /// none.
    fn mean_credit(
        &mut self,
        t: TemplateId,
        mut items: Vec<(GraphNode, GraphNode)>,
    ) -> Option<GraphNode> {
        if items.is_empty() {
            return None;
        }
        loop {
            let mut next = Vec::with_capacity(items.len().div_ceil(CHUNK));
            for chunk in items.chunks(CHUNK) {
                let mean = self.node(t, NodeKind::Read);
                for &(w, _) in chunk {
                    self.read(mean, w);
                }
                for &(_, c) in chunk {
                    self.read(mean, c);
                }
                let total = self.node(t, NodeKind::Read);
                self.read(total, mean);
                next.push((total, mean));
            }
            if next.len() == 1 {
                return Some(next[0].1);
            }
            items = next;
        }
    }

    /// (gated weight, credit) of each scored item under `c`, in document
    /// order: answers, and sections that aggregate; other sections and
    /// containers are looked through, `<setup>` is not.
    fn scored_items(
        &mut self,
        c: Tree,
        gate: Option<GraphNode>,
        out: &mut Vec<(GraphNode, GraphNode)>,
    ) {
        for k in self.tree_children(c) {
            let (weight, credit) = match (k, self.tree_type(k)) {
                (_, ComponentType::Setup) => continue,
                (Tree::Case(..), _) => {
                    let g = self.gate_through(gate, k);
                    self.scored_items(k, g, out);
                    continue;
                }
                (Tree::RefChild(..), ComponentType::Answer | ComponentType::Section) => {
                    self.g.gaps.insert(Gap::RefChild);
                    continue;
                }
                (Tree::Elem(t, e), ComponentType::Answer) => {
                    // A blank response checks as no credit.
                    let checked = self.g.port(t, e, answer::CREDIT);
                    let credit = self.node(t, NodeKind::Read);
                    self.read(credit, checked);
                    (self.g.port(t, e, answer::WEIGHT), credit)
                }
                (Tree::Elem(t, e), ComponentType::Section) if self.aggregates_scores(t, e) => (
                    self.g.port(t, e, section::WEIGHT),
                    self.g.port(t, e, section::CREDIT),
                ),
                _ => {
                    self.scored_items(k, gate, out);
                    continue;
                }
            };
            let weight = self.gated(gate, weight, self.tree_template(k));
            out.push((weight, credit));
        }
    }

    /// Number the sections among the children of `c`, counting through the
    /// containers expanded in place; `before` is what the sections counted
    /// so far add under cases.
    fn numbers(&mut self, c: Tree, gate: Option<GraphNode>, before: &mut Option<GraphNode>) {
        for k in self.tree_children(c) {
            match (k, self.tree_type(k)) {
                (Tree::Case(..), _) => {
                    let g = self.gate_through(gate, k);
                    self.numbers(k, g, before);
                }
                (
                    _,
                    ComponentType::RepeatForSequence
                    | ComponentType::RepeatFor
                    | ComponentType::Collect
                    | ComponentType::ConditionalContent
                    | ComponentType::Select
                    | ComponentType::Group,
                ) => self.numbers(k, gate, before),
                (Tree::Elem(t, e), ComponentType::Section) => {
                    if let Some(b) = *before {
                        let number = self.g.port(t, e, section::NUMBER);
                        self.read(number, b);
                    }
                    if let Some(g) = gate {
                        *before = Some(match *before {
                            None => g,
                            Some(b) => {
                                let sum = self.node(t, NodeKind::Read);
                                self.read(sum, b);
                                self.read(sum, g);
                                sum
                            }
                        });
                    }
                    self.numbers(k, None, &mut None);
                }
                _ => self.numbers(k, None, &mut None),
            }
        }
    }

    /// `gate` times case `k`'s `active`, made in the case's template.
    fn gate_through(&mut self, gate: Option<GraphNode>, k: Tree) -> Option<GraphNode> {
        let active = self.case_active(k);
        Some(self.gated(gate, active, self.tree_template(k)))
    }

    /// `x`, times `gate` when there is one, made in template `t`.
    fn gated(&mut self, gate: Option<GraphNode>, x: GraphNode, t: TemplateId) -> GraphNode {
        match gate {
            None => x,
            Some(g) => {
                let product = self.node(t, NodeKind::Read);
                self.read(product, g);
                self.read(product, x);
                product
            }
        }
    }

    /// The `active` node of a case: whether its conditional content's
    /// choice is its position. One per case.
    fn case_active(&mut self, k: Tree) -> GraphNode {
        let Tree::Case(t, e, pos) = k else {
            unreachable!("only a case is active")
        };
        if let Some(&n) = self.cases.get(&(t, e, pos)) {
            return n;
        }
        let n = self.node(t, NodeKind::Read);
        let choice = self.g.port(t, e, prop::conditional_content::CHOICE);
        self.read(n, choice);
        self.cases.insert((t, e, pos), n);
        n
    }

    /// The children of `c` in the stamped tree.
    fn tree_children(&mut self, c: Tree) -> Vec<Tree> {
        match c {
            Tree::Elem(t, e) => {
                let row = self.c.plans.templates[t.index()].row(e);
                match &row.body {
                    Body::Repeat { template } => self.root_children(*template),
                    Body::Choice(cid) => {
                        let def = &self.c.plans.choices[cid.index()];
                        if def.reactive {
                            (1..=def.branches.len())
                                .map(|k| Tree::Case(t, e, k))
                                .collect()
                        } else {
                            let branches = def.branches.clone();
                            branches
                                .into_iter()
                                .flat_map(|b| self.root_children(b))
                                .collect()
                        }
                    }
                    Body::Collect { component_type } => {
                        // Its children are copies of what it gathers.
                        if matches!(
                            component_type,
                            ComponentType::Answer | ComponentType::Section
                        ) {
                            self.g.gaps.insert(Gap::Gathered);
                        }
                        Vec::new()
                    }
                    // A point list's children are points.
                    _ if row.component_type == ComponentType::PointList => Vec::new(),
                    Body::Plain => row
                        .children
                        .iter()
                        .filter_map(|ch| match ch {
                            Child::Elem(x) => Some(Tree::Elem(t, *x)),
                            Child::Macro(id) => Some(Tree::RefChild(t, *id)),
                            Child::Text(_) => None,
                        })
                        .collect(),
                }
            }
            Tree::Case(t, e, k) => {
                let Body::Choice(cid) = self.c.plans.templates[t.index()].row(e).body else {
                    unreachable!("a case is of a choice")
                };
                let b = self.c.plans.choices[cid.index()].branches[k - 1];
                self.root_children(b)
            }
            Tree::RefChild(..) => Vec::new(),
        }
    }

    /// Template `t`'s own children: an iteration's, an option's, a case's.
    fn root_children(&self, t: TemplateId) -> Vec<Tree> {
        self.c.plans.templates[t.index()]
            .children
            .iter()
            .filter_map(|ch| match ch {
                Child::Elem(x) => Some(Tree::Elem(t, *x)),
                Child::Macro(id) => Some(Tree::RefChild(t, *id)),
                Child::Text(_) => None,
            })
            .collect()
    }

    /// The template a tree component is stamped in: a case is in its
    /// choice's.
    fn tree_template(&self, c: Tree) -> TemplateId {
        match c {
            Tree::Elem(t, _) | Tree::Case(t, _, _) | Tree::RefChild(t, _) => t,
        }
    }

    /// The type of a tree component: a `$ref` child's as the build places
    /// it.
    fn tree_type(&mut self, c: Tree) -> ComponentType {
        match c {
            Tree::Elem(t, e) => self.c.plans.templates[t.index()].row(e).component_type,
            Tree::Case(..) => ComponentType::Case,
            Tree::RefChild(t, id) => self.ref_child_type(t, id),
        }
    }

    /// The type the build gives `$ref` child `id` of template `t`: the
    /// missing value's or a prop's is a number (a text for a string, which
    /// is neither an answer nor a section); a whole component's is its
    /// referent's, or for an input not read through an iteration the value
    /// type it reads as.
    fn ref_child_type(&mut self, t: TemplateId, id: RefChildId) -> ComponentType {
        let RefChildPlan::Ref(p) =
            self.c.plans.templates[t.index()].tables.ref_child_plans[id.index()]
        else {
            return ComponentType::Error;
        };
        let (at, prop, _) = self.resolve(p, t);
        if matches!(at, At::Missing) || prop.is_some() {
            return ComponentType::Number;
        }
        let through_iteration = matches!(at, At::Iter(_));
        let Some(referent) = self.single_component(at) else {
            self.g.gaps.insert(Gap::RefChild);
            return ComponentType::Error;
        };
        let rt = self.component_type(referent);
        match (through_iteration, rt.reads_as()) {
            (false, Some(as_type)) => as_type,
            _ => rt,
        }
    }
}
