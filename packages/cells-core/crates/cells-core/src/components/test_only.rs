//! Components that exist only in this crate's unit tests (ADR 0016,
//! Migration step 8), registered in `component_types!`'s `#[cfg(test)]`
//! section. They are here, not in `testing/`, because only `components/`
//! can define a component (`define.rs`). Each has only what a rule of the core needs, so a unit test of
//! that rule depends on no real component: a rule is tested where it is
//! implemented, against these, and fails there rather than in a spec.
//!
//! - `<testValue value="..">`: planned from its table alone (`Props`).
//! - `<testShape a=".." b="..">`: planned by a function inside
//!   `plan_with_extend`'s handling of `extend`, with two pieces of shared
//!   state, each supplied by the attribute of the same name, `a` else by
//!   the element's children (`<testShape>3</testShape>`) or its
//!   referent's, and a `hide` flag.
//! - `<testList points="(1,2) (3,4)">`: a list of as many points as it is
//!   given, planned by a function inside `plan_with_extend`.

/// `<testValue>`: a value and its double, from the table alone.
pub(crate) mod test_value {
    use crate::components::define::*;

    component! {
        /// `<testValue value="..">`: `value` from its attribute, `double`
        /// computed from it.
        tags: ["testValue"],
        flags: [copyable],
        default_prop: value,
        props {
            value: attr(0.0),
            double: computed(OpSpec::Scale { k: 2.0 }, [value]),
        }
        planner: Props,
    }
}

/// `<testShape>`: two pieces of shared state and their sum, planned by a
/// function.
pub(crate) mod test_shape {
    use crate::compile::api::*;
    use crate::components::ComponentType;
    use crate::components::define::*;
    use crate::error::Result;

    component! {
        /// `<testShape a=".." b="..">`: `a` and `b` are essential, 0 by
        /// default, unless their attribute is a reference or math; without
        /// its attribute, `a` is the element's children, else its
        /// referent's; `sum` is computed from them.
        tags: ["testShape"],
        flags: [copyable],
        props {
            a: by_planner,
            b: by_planner,
            sum: computed(OpSpec::Add, [a, b]),
            hide: by_planner,
        }
        attributes { a, b, hide }
        shared_state { A, B }
        planner: Plan(plan),
    }

    pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
        let mut wiring = ElemWiring::of(ComponentType::TestShape);
        wiring.set_public(Props {
            a: a(ctx)?,
            b: given(ctx, shared_state::B, attr::b)?,
            sum: Wire::from_table(ComponentType::TestShape, Props::AT.sum),
            hide: ctx.flag(attr::hide, false)?.into(),
        });
        Ok(wiring)
    }

    /// `a`: its attribute, else the element's children, else its
    /// referent's, which a copy then shares.
    fn a(ctx: &mut PlanCtx<'_, '_>) -> Result<Wire> {
        if ctx.has(attr::a) {
            return given(ctx, shared_state::A, attr::a);
        }
        let (nodes, from) = match (ctx.child_math(), ctx.referent_child_math()) {
            (Some(own), _) => (own, Given::Children),
            (None, Some(referent)) => (referent, Given::Referent),
            (None, None) => return Ok(Wire::essential(shared_state::A, 0.0)),
        };
        Ok(match ctx.scalar_of(attr::a, &nodes)? {
            Source::Literal(v) => Wire::essential_from(shared_state::A, from, v),
            other => other.into(),
        })
    }

    /// The attribute `name` as the shared state `state`: a literal is its
    /// value, anything else is what it computes, and none is 0.
    fn given(ctx: &mut PlanCtx<'_, '_>, state: SharedState, name: Attr) -> Result<Wire> {
        Ok(match ctx.scalar(name)? {
            Some(Source::Literal(v)) => Wire::essential_from(state, name, v),
            Some(other) => other.into(),
            None => Wire::essential(state, 0.0),
        })
    }
}

/// `<testList>`: a list of points, and how many.
pub(crate) mod test_list {
    use crate::compile::api::*;
    use crate::components::ComponentType;
    use crate::components::define::*;
    use crate::error::Result;

    component! {
        /// `<testList points="(1,2) (3,4)">`: its points are its list
        /// (`point1`, `px1`, ...), as many as given.
        tags: ["testList"],
        flags: [copyable],
        props {
            numPoints: by_planner,
        }
        list {
            names: [points],
            item: point,
            coords: [px, py],
        attribute: points,
        }
        attributes { points }
        planner: Plan(plan),
    }

    pub(crate) fn plan(ctx: &mut PlanCtx<'_, '_>) -> Result<ElemWiring> {
        let points = ctx.points(attr::points)?;
        let mut wiring = ElemWiring::with_list(ComponentType::TestList, points.len());
        wiring.set_public(Props {
            numPoints: Wire::fixed(points.len() as f64),
        });
        wiring.set_list(
            points
                .iter()
                .enumerate()
                .map(|(k, p)| Wire::point(p, shared_point_state(k), attr::points))
                .collect(),
        );
        Ok(wiring)
    }
}

#[cfg(test)]
mod tests {
    use crate::Document;
    use crate::testing::dast::{document, el, load, mac};

    fn read(doc: &Document, name: &str, prop: &str) -> f64 {
        let comp = doc.resolve_path(name).unwrap();
        let cells = doc.prop_cells(comp, prop).unwrap();
        assert_eq!(cells.len(), 1, "{name}.{prop}");
        doc.cells[cells[0].index()]
    }

    #[test]
    fn test_value_loads_from_its_table() {
        let doc = load(document([
            el("testValue").name("v").attr("value", "3"),
            el("testValue").name("w"),
        ]))
        .unwrap();
        assert!(doc.diagnostics().is_empty(), "{:?}", doc.diagnostics());
        assert_eq!(read(&doc, "v", "value"), 3.0);
        assert_eq!(read(&doc, "v", "double"), 6.0);
        assert_eq!(read(&doc, "w", "value"), 0.0);
    }

    #[test]
    fn test_shape_loads_through_its_planner() {
        let doc = load(document([
            el("testValue").name("v").attr("value", "5"),
            el("testShape").name("s").attr("a", "1").attr("b", "2"),
            el("testShape").name("t").attr("a", mac("v")),
        ]))
        .unwrap();
        assert!(doc.diagnostics().is_empty(), "{:?}", doc.diagnostics());
        assert_eq!(read(&doc, "s", "sum"), 3.0);
        assert_eq!(read(&doc, "t", "a"), 5.0);
        assert_eq!(read(&doc, "t", "b"), 0.0);
        assert_eq!(read(&doc, "t", "sum"), 5.0);
    }
}
