//! Wiring, how a planner says where each of an element's ports gets its
//! value ([`ElemWiring`], [`Wire`]), and what gave a given leaf
//! ([`GivenId`]): an attribute, the children, or a parameter.

use crate::compile::*;
use crate::components::PropFrom;

/// An attribute a component's planner reads, as its `attributes { .. }`
/// declares it: its name and its position among the type's declarations.
/// Only `component!` makes one.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub struct Attr(&'static str, u8);

impl Attr {
    /// An attribute a component declares; only `component!` calls this.
    #[doc(hidden)]
    pub(crate) const fn declared(name: &'static str, index: u8) -> Attr {
        Attr(name, index)
    }

    /// Its name, as the source spells it (ignoring case).
    pub(crate) const fn name(self) -> &'static str {
        self.0
    }

    /// Its position among its type's declarations ([`Record`](crate::compile::ir::record::Record)).
    pub(crate) const fn index(self) -> usize {
        self.1 as usize
    }
}

/// A parameter a planner introduces that no attribute gives: a named given
/// leaf with a default (a line's distance along its direction). Only
/// `component!` makes one.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub(crate) struct Param(&'static str);

impl Param {
    /// A parameter a component declares; only `component!` calls this.
    #[doc(hidden)]
    pub(crate) const fn declared(name: &'static str) -> Param {
        Param(name)
    }

    pub(crate) const fn name(self) -> &'static str {
        self.0
    }
}

/// What gave a given leaf its value: an attribute (its `k`-th leaf: a
/// point's two coordinates, a list's points), the element's children, or a
/// parameter the planner introduced.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub(crate) enum GivenId {
    Attr(Attr, u32),
    /// The `k`-th leaf of what the children give (a point's `(a, b)`).
    Children(u32),
    Param(Param),
}

impl GivenId {
    /// What saved state names a hidden port holding it by: the attribute's
    /// or the parameter's name, and the leaf's position after the first
    /// (`_through3`), under a `_` so it is never a prop's name.
    pub(crate) fn key(self) -> String {
        match self {
            GivenId::Attr(a, 0) => format!("_{}", a.name()),
            GivenId::Attr(a, k) => format!("_{}{k}", a.name()),
            GivenId::Children(0) => "_children".to_string(),
            GivenId::Children(k) => format!("_children{k}"),
            GivenId::Param(p) => format!("_{}", p.name()),
        }
    }
}

/// A point a planner uses when the author gives none: the parameters its
/// coordinates are, and their value.
pub(crate) type DefaultPoint = ([Param; 2], [f64; 2]);

/// One port's source and, when it is a given leaf, what gave it.
#[derive(Debug, Clone)]
pub(crate) struct Wire {
    pub(crate) source: Source,
    given: Option<GivenId>,
}

impl From<Source> for Wire {
    fn from(source: Source) -> Self {
        Wire {
            source,
            given: None,
        }
    }
}

impl Wire {
    /// A given value `v`, the `k`-th leaf of what `id` gives: state when a
    /// student's action can write it.
    pub(crate) fn given(id: GivenId, v: f64) -> Self {
        Wire {
            source: Source::given(v),
            given: Some(id),
        }
    }
    /// A given value `v` of attribute `attr` (its first leaf).
    pub(crate) fn given_by(attr: Attr, v: f64) -> Self {
        Wire::given(GivenId::Attr(attr, 0), v)
    }
    /// A parameter at its default `v`.
    pub(crate) fn param(param: Param, v: f64) -> Self {
        Wire::given(GivenId::Param(param), v)
    }
    /// A given text value, given by `attr`, initially the string `id`.
    pub(crate) fn given_text(id: GivenId, text: StrId) -> Self {
        Wire {
            source: Source::Leaf(Leaf::GivenText(Some(text))),
            given: Some(id),
        }
    }
    /// A constant, not NaN: a value not given is
    /// `absent`, one the element cannot have `undefined`.
    pub(crate) fn constant(v: f64) -> Self {
        assert!(
            !v.is_nan(),
            "Wire::constant(NaN): use Wire::absent, or Wire::undefined after a warning"
        );
        Source::constant(v).into()
    }
    /// A value not given (`NO_VALUE`), as a constant.
    pub(crate) fn absent() -> Self {
        Source::absent().into()
    }
    /// A value the element cannot have, as `warned` explains: NaN.
    pub(crate) fn undefined(warned: Warned) -> Self {
        Source::undefined(warned).into()
    }
    /// An alias of the element's own port.
    pub(crate) fn own(port: Port) -> Self {
        Source::own(port).into()
    }
    /// An operator over the element's own ports.
    pub(crate) fn computed(op: OpSpec, args: Vec<Port>) -> Self {
        Source::computed(op, args).into()
    }
    /// The prop at `port` as the type's table computes it from its other
    /// props.
    pub(crate) fn from_table(component_type: ComponentType, port: Port) -> Self {
        let i = port.index();
        match component_type.prop_defs()[i].from {
            PropFrom::Computed { op, args } => Source::from_def(op, &args).into(),
            PropFrom::Aggregate(a) => Source::aggregate(a).into(),
            _ => unreachable!(
                "{} is not computed by the table",
                component_type.prop_defs()[i].name
            ),
        }
    }
    /// A scalar as its source plans it: a literal is a given leaf of `id`,
    /// anything else what it computes.
    pub(crate) fn scalar(source: Source, id: GivenId) -> Self {
        match source {
            Source::Leaf(Leaf::Given(v)) => Wire::given(id, v),
            other => other.into(),
        }
    }
    /// A given point as `point` plans it, else the default with its
    /// parameters.
    pub(crate) fn point_or_default(
        p: Option<&GivenPoint>,
        attr: Attr,
        k: usize,
        (params, default): DefaultPoint,
    ) -> [Self; 2] {
        match p {
            Some(p) => Self::point(p, attr, k),
            None => std::array::from_fn(|j| Self::param(params[j], default[j])),
        }
    }
    /// The `k`-th point of attribute `attr`: a literal coordinate is a
    /// given leaf of the attribute, the `2k + j`-th.
    pub(crate) fn point(p: &GivenPoint, attr: Attr, k: usize) -> [Self; 2] {
        Self::point_given(p, |j| GivenId::Attr(attr, (2 * k + j) as u32))
    }
    /// A point's two coordinates, a literal coordinate a given leaf whose
    /// identity `id` names by coordinate.
    pub(crate) fn point_given(p: &GivenPoint, id: impl Fn(usize) -> GivenId) -> [Self; 2] {
        std::array::from_fn(|j| match p.coord(j) {
            Source::Leaf(Leaf::Given(v)) => Wire::given(id(j), v),
            other => other.into(),
        })
    }
}

/// How each of an element's ports gets its value, as its planner builds
/// it: the public ports (the table's props, then the list's points), then
/// hidden ports holding helper values that the props read like any own
/// port.
pub(crate) struct ElemWiring {
    component_type: ComponentType,
    /// Each port's source, by [`Port::index`].
    props: Vec<Option<Source>>,
    /// How many points the list holds, two ports each after the table's
    /// props.
    n_points: usize,
    /// Which port holds each given leaf, by what gave it.
    given: HashMap<GivenId, Port>,
}

/// The props of an element planned from its type's table, one per table
/// prop by its port.
pub(crate) struct TableProps(Vec<Option<Source>>);

impl TableProps {
    /// One unplanned prop per prop of `component_type`'s table.
    pub(in crate::compile) fn of(component_type: ComponentType) -> Self {
        TableProps(vec![None; component_type.prop_defs().len()])
    }

    /// The props in table order, each planned.
    pub(in crate::compile) fn finish(self) -> Vec<Source> {
        self.0
            .into_iter()
            .enumerate()
            .map(|(i, p)| p.unwrap_or_else(|| panic!("table prop {i} left unplanned")))
            .collect()
    }
}

impl std::ops::Index<Port> for TableProps {
    type Output = Option<Source>;
    fn index(&self, port: Port) -> &Option<Source> {
        &self.0[port.index()]
    }
}

impl std::ops::IndexMut<Port> for TableProps {
    fn index_mut(&mut self, port: Port) -> &mut Option<Source> {
        &mut self.0[port.index()]
    }
}

/// `props`, wiring for an element of `component_type`, with every prop
/// the type's table declares an aggregate ([`PropFrom::Aggregate`]) planned
/// so, whatever else the element inherits or copies: a copy of a section
/// is numbered among its own siblings and scores what is inside it.
pub(crate) fn mark_aggregates(component_type: ComponentType, props: &mut [Source]) {
    for (def, p) in component_type.prop_defs().iter().zip(props.iter_mut()) {
        if let PropFrom::Aggregate(a) = def.from {
            *p = Source::aggregate(a);
        }
    }
}

impl ElemWiring {
    /// Wiring for an element of `component_type`, one public port per prop
    /// in its table, each set by its name (`Props::PORTS`).
    pub(crate) fn of(component_type: ComponentType) -> Self {
        let n_table = component_type.prop_defs().len();
        ElemWiring {
            component_type,
            props: vec![None; n_table],
            n_points: 0,
            given: HashMap::new(),
        }
    }

    /// Wiring for an element of `component_type` whose list holds
    /// `n_points` points, two public ports each after the table's props
    /// (`item`).
    pub(crate) fn with_list(component_type: ComponentType, n_points: usize) -> Self {
        debug_assert!(component_type.given_coords().is_some());
        let mut wiring = Self::of(component_type);
        wiring.n_points = n_points;
        wiring.props.resize(wiring.n_public(), None);
        wiring
    }

    /// How many of the ports are public: the table's props and the list's
    /// points.
    fn n_public(&self) -> usize {
        self.component_type.prop_defs().len() + 2 * self.n_points
    }

    /// The two ports holding the coordinates of list point `k` (0-based),
    /// which the wiring holds.
    pub(crate) fn item(&self, k: usize) -> [Port; 2] {
        assert!(
            k < self.n_points,
            "list point {k} of a list of {} points",
            self.n_points
        );
        let first = self.component_type.prop_defs().len() + 2 * k;
        [Port::table(first), Port::table(first + 1)]
    }

    /// The ports of every list point, in order (`item`).
    pub(crate) fn items(&self) -> impl Iterator<Item = [Port; 2]> + '_ {
        (0..self.n_points).map(|k| self.item(k))
    }

    /// A hidden port planned as `source`.
    pub(crate) fn hidden(&mut self, source: Source) -> Port {
        self.props.push(Some(source));
        Port::table(self.props.len() - 1)
    }
    /// Two hidden ports holding the `k`-th point of attribute `attr`, a
    /// literal coordinate a given leaf of it.
    pub(crate) fn hidden_point_of(&mut self, p: &GivenPoint, attr: Attr, k: usize) -> [Port; 2] {
        Wire::point(p, attr, k).map(|w| self.hidden_wire(w))
    }
    /// Two hidden ports holding a point's coordinates.
    pub(crate) fn hidden_point(&mut self, p: &GivenPoint) -> [Port; 2] {
        [self.hidden(p.coord(0)), self.hidden(p.coord(1))]
    }
    /// A hidden port planned as `p`, holding its given leaf if any.
    pub(crate) fn hidden_wire(&mut self, p: Wire) -> Port {
        let port = self.hidden(p.source);
        if let Some(id) = p.given {
            self.given.insert(id, port);
        }
        port
    }
    /// A hidden port holding parameter `param` at `value`.
    pub(crate) fn param(&mut self, param: Param, value: f64) -> Port {
        self.hidden_wire(Wire::param(param, value))
    }
    /// Every table prop's port, from a typed plan's fields in table order
    /// (`Props::into_iter`), with their given leaves.
    pub(crate) fn set_public(&mut self, props: impl IntoIterator<Item = Wire>) {
        for (i, p) in props.into_iter().enumerate() {
            self.props[i] = Some(p.source);
            if let Some(id) = p.given {
                self.given.insert(id, Port::table(i));
            }
        }
    }
    /// `set_public` for a typed plan of sources that hold no shared state.
    pub(crate) fn set_public_sources(&mut self, props: impl IntoIterator<Item = Source>) {
        self.set_public(props.into_iter().map(Wire::from));
    }
    /// The list's points, which fill the public ports after the table's
    /// props (`item`), with their given leaves.
    pub(crate) fn set_list(&mut self, points: Vec<[Wire; 2]>) {
        assert_eq!(
            points.len(),
            self.n_points,
            "the wiring holds the list's points"
        );
        for (k, point) in points.into_iter().enumerate() {
            let ports = self.item(k);
            for (port, p) in ports.into_iter().zip(point) {
                self.props[port.index()] = Some(p.source);
                if let Some(id) = p.given {
                    self.given.insert(id, port);
                }
            }
        }
    }
    /// `vector` for as many consecutive ports as the operator has outputs,
    /// from `head` (a list's points, which a polygon's `Shape` moves).
    pub(crate) fn vector_from(head: Port, op: VecOp, args: Vec<Port>, consts: &[f64]) -> Vec<Wire> {
        let args: Vec<Arg> = args
            .into_iter()
            .map(Arg::Own)
            .chain(consts.iter().map(|&k| Arg::Const(k)))
            .collect();
        (0..op.n_out())
            .map(|k| {
                if k == 0 {
                    Source::op(OpSpec::Vec(op), args.clone()).into()
                } else {
                    Source::Flow(Flow::VecOut(head, byte(k))).into()
                }
            })
            .collect()
    }
    /// The outputs of a vector instruction over own ports, for the public
    /// ports `at`, which must be consecutive: the head at `at[0]`, output
    /// `k` at `at[k]`.
    pub(crate) fn vector<const N: usize>(at: [Port; N], op: VecOp, args: Vec<Port>) -> [Wire; N] {
        assert_eq!(op.n_out(), N, "a vector operator's outputs are its ports");
        assert!(
            at.iter()
                .enumerate()
                .all(|(k, a)| a.index() == at[0].index() + k),
            "a vector operator's outputs are consecutive ports"
        );
        std::array::from_fn(|k| {
            if k == 0 {
                Source::vector(op, args.clone()).into()
            } else {
                Source::Flow(Flow::VecOut(at[0], byte(k))).into()
            }
        })
    }

    /// Which port holds each given leaf, by what gave it.
    pub(in crate::compile) fn given(&self) -> &HashMap<GivenId, Port> {
        &self.given
    }

    /// Whether `port` is planned as a given value.
    pub(in crate::compile) fn is_given(&self, port: Port) -> bool {
        matches!(self.props[port.index()], Some(Source::Leaf(Leaf::Given(_))))
    }

    /// Every port's source, by [`Port::index`], and how many points the list
    /// holds: what an element's plan keeps of it.
    pub(crate) fn finish(self) -> (Vec<Source>, ListLen) {
        let list = if self.component_type.given_coords().is_some() {
            ListLen::Points(self.n_points as u32)
        } else {
            ListLen::None
        };
        let props = self
            .props
            .into_iter()
            .enumerate()
            .map(|(i, p)| p.unwrap_or_else(|| panic!("public prop {i} left unplanned")))
            .collect();
        (props, list)
    }
}

/// One point of a point-list attribute (`through`, `vertices`, `endpoints`).
#[derive(Debug, Clone)]
pub(crate) enum GivenPoint {
    /// `$p`: a point-valued reference (two cells).
    Ref(RefId),
    /// `(a, b)`: two scalar sources.
    Tuple([Source; 2]),
    /// Item `i` of a list prop: `$l.points` contributes one per item.
    Item(RefId, usize),
}

impl GivenPoint {
    pub(crate) fn coord(&self, j: usize) -> Source {
        match self {
            GivenPoint::Ref(p) => Source::coord(*p, j),
            GivenPoint::Tuple(xy) => xy[j].clone(),
            GivenPoint::Item(p, i) => Source::item(*p, *i, j),
        }
    }
}
