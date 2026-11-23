//! Anchors, as planned: where a value is drawn in a graph
//! ([`PropFrom::Anchor`]), for every type that has one, whatever its planner
//! (ADR 0047).

use super::Planning;
use crate::compile::*;

/// Planning, anchors: the `anchor` attribute's point onto a type's anchor
/// props, after the type's own planner. Reads the element's own attribute,
/// never another element's plan (ADR 0029).
impl Planning<'_> {
    /// Plan the anchor props of element `e`, which its planner left absent.
    /// In a graph, the coordinates of its own `anchor` (`(1,2)`, a given
    /// point a drag writes, or `$P`, which a drag moves), else under
    /// `extend` the referent's, else the origin, given. With no graph
    /// above it nothing draws or drags it, so it stays not given, a
    /// constant that costs no state (ADR 0019); its `anchor` is still
    /// read, so the attribute is accepted. A copy that aliases
    /// its referent's props (a bare copy, a clone) keeps them.
    pub(super) fn plan_anchor(&mut self, t: TemplateId, e: ElemId) -> Result<()> {
        let Elem {
            node,
            component_type,
            name_scope: scope,
            ..
        } = *self.rd.own_row(t, e);
        let Some(at) = component_type.anchor_props() else {
            return Ok(());
        };
        let plan = &self.tables[t.index()].plans[e.index()];
        if at
            .iter()
            .any(|&pi| !plan.props.get(pi).is_some_and(is_absent))
        {
            return Ok(());
        }
        let extend = plan.extend;
        let d = self.rd.dast;
        let attr = (node != NodeId::NONE)
            .then(|| d.attr(node, "anchor"))
            .flatten();
        let coords: [Source; 2] = match attr {
            _ if !self.rd.under_graph(t, e) => return Ok(()),
            Some(a) => {
                let p = self.rd.plan_point_attr(&mut self.ar, t, scope, a)?;
                [p.coord(0), p.coord(1)]
            }
            None => match extend {
                Some(p) => [Source::port_of(p, at[0]), Source::port_of(p, at[1])],
                None => [Source::given(0.0), Source::given(0.0)],
            },
        };
        let props = &mut self.tables[t.index()].plans[e.index()].props;
        for (pi, source) in at.into_iter().zip(coords) {
            props[pi] = source;
        }
        Ok(())
    }
}

/// Whether `source` is a value not given (`Source::absent`), as a planner
/// leaves a prop for planning after it.
fn is_absent(source: &Source) -> bool {
    matches!(source, Source::Leaf(Leaf::Const(v)) if v.to_bits() == NO_VALUE.to_bits())
}
