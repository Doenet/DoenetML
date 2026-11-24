//! The item a repeat-like type makes per iteration (ADR 0040, decision 3):
//! [`ItemCtx`], what its declared function wires the item with, and the
//! planning of a repeat's hidden iteration elements.

use super::Planning;
use crate::compile::*;
use crate::components::ItemDecl;

/// What an item's function (`item: Number(item)`, ADR 0040) is given: the
/// iteration's position and the repeat's own ports, one scope up, each as
/// a port of the item's wiring. It reaches no other element.
pub(crate) struct ItemCtx<'p> {
    /// The plans' arenas, for the references to the repeat.
    ar: &'p mut Arenas,
    /// The repeat, as seen from its body.
    owner: (TemplateId, ElemId),
    /// Its type.
    owner_ty: ComponentType,
    /// The item's wiring, whose hidden ports hold what the function makes.
    wiring: ElemWiring,
}

impl ItemCtx<'_> {
    /// The iteration's 1-based position.
    pub(crate) fn index(&mut self) -> Port {
        self.wiring
            .hidden(Source::Leaf(Leaf::Scope(ScopeConst::IterIndex)))
    }

    /// The iteration's position from 0: the index less one.
    pub(crate) fn index_from_zero(&mut self) -> Port {
        let k = self.index();
        self.wiring
            .hidden(Source::computed_k(crate::program::OpSpec::Add, k, -1.0))
    }

    /// Port `port` of the repeat's table, read from the iteration.
    pub(crate) fn owner(&mut self, port: Port) -> Port {
        let p = self.owner_ref(port);
        self.wiring.hidden(Source::reference(p))
    }

    /// A box of a grid (ADR 0045): a given math value whose first
    /// expression is entry (the repeat's position, this iteration's
    /// position) of the matrix the repeat's port `matrix` holds, else what
    /// its port `fallback` holds ([`ScopeConst::SeedEntry`]).
    pub(crate) fn seed_entry(&mut self, matrix: Port, fallback: Port) -> Source {
        let m = self.owner_ref(matrix);
        let f = self.owner_ref(fallback);
        Source::Leaf(Leaf::Scope(ScopeConst::SeedEntry(m, f)))
    }

    /// A reference to port `port` of the repeat's table, from the
    /// iteration.
    fn owner_ref(&mut self, port: Port) -> RefId {
        let (_, e) = self.owner;
        let name = self.owner_ty.prop_defs()[port.index()].name;
        let prop = RefProp::named(self.owner_ty, name).expect("a table prop of the repeat");
        let plan = RefPlan {
            hops: 1,
            steps: vec![Step::Elem(e)],
            prop: Some(prop),
            entries: Vec::new(),
            display: RefDisplay::Spelled(format!("(repeat).{name}").into()),
            node: NodeId::NONE,
        };
        self.ar.push_ref(plan)
    }

    /// A hidden port of the item: `op` over its ports `args`, for a value
    /// the item's props read.
    pub(crate) fn computed(&mut self, op: crate::program::OpSpec, args: Vec<Port>) -> Port {
        self.wiring.hidden(Source::computed(op, args))
    }
}

/// Planning, the hidden elements of a repeat's body. Reads the repeat's
/// record and its type's declarations, never another element's plan (ADR
/// 0029); writes the plans of the elements in the repeat's body that
/// outlining made for it.
impl Planning<'_> {
    /// The hidden iteration elements outlining made in repeat `e`'s body:
    /// the item its type declares (ADR 0040), wired by the type's
    /// function, element 0 of the body when there is one; and the index
    /// `indexName` names, the iteration's position.
    pub(super) fn plan_iteration_names(&mut self, t: TemplateId, e: ElemId) {
        let Some((sub, body)) = self.rd.body_rows(t, e) else {
            return;
        };
        let owner_ty = self.rd.own_row(t, e).component_type;
        let has_item = self.has_item(t, e);
        let item = has_item.then(|| owner_ty.def().item).flatten();
        for (i, el) in body.iter().enumerate() {
            if el.node != NodeId::NONE {
                continue;
            }
            let ty = el.component_type;
            let props = match item {
                // An item no declaration wires (a `<repeat for>`'s) is its
                // machinery's to plan.
                _ if i == 0 && has_item && item.is_none() => continue,
                Some(ItemDecl { ty: item_ty, wire }) if i == 0 && ty == item_ty => {
                    let mut ctx = ItemCtx {
                        ar: &mut self.ar,
                        owner: (t, e),
                        owner_ty,
                        wiring: ElemWiring::of(item_ty),
                    };
                    let wires = wire(&mut ctx);
                    let mut wiring = ctx.wiring;
                    wiring.set_planned(wires);
                    let props = wiring.finish().0;
                    // An item that is a repeat-like type of its own (a
                    // matrix input's row, ADR 0045) has its own item.
                    if matches!(el.body, Body::Repeat { .. }) {
                        self.tables[sub.index()].plans[i].props = props;
                        self.plan_iteration_names(sub, ElemId::from_index(i));
                        continue;
                    }
                    props
                }
                _ if ty.plays(Role::Index) => prop::number::Props {
                    value: Source::Leaf(Leaf::Scope(ScopeConst::IterIndex)),
                    // An iteration's index shows as numbers do, and is
                    // never drawn in a graph.
                    displayDigits: Source::absent(),
                    displayDecimals: Source::absent(),
                    displaySmallAsZero: Source::absent(),
                    padZeros: Source::absent(),
                    avoidScientificNotation: Source::absent(),
                    displayBlanks: Source::absent(),
                    anchorX: Source::constant(0.0),
                    anchorY: Source::constant(0.0),
                }
                .into_vec(),
                _ => continue,
            };
            self.tables[sub.index()].plans[i].props = props;
        }
    }

    /// Whether repeat `e` has an item in its body, element 0: it names
    /// one (`valueName`), or its type declares one and it reads no
    /// children (the item is its one child).
    pub(super) fn has_item(&self, t: TemplateId, e: ElemId) -> bool {
        let el = self.rd.own_row(t, e);
        let def = el.component_type.def();
        // A repeat outlining made (a matrix input's row) names nothing.
        (el.node != NodeId::NONE && self.rd.attr_name_str(el.node, "valueName").is_some())
            || (def.item.is_some() && !def.children.built())
    }
}
