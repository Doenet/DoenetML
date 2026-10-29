//! How a component type is defined: `component!`, one block per type, and
//! what it is built on (the prop sources `attr`, `computed`, ... resolved
//! by `props`, the definition's builders, and `at` for a prop's position
//! by name).

use super::{Args, ComponentDef, Flags, MAX_ARGS, PropDef, PropFrom};
pub(super) use crate::compile::api::NO_VALUE;
pub(super) use crate::program::OpSpec;

/// A prop as a table writes it: a [`PropDef`] whose source still names
/// the props a computed prop reads. [`props`] resolves the names to
/// positions.
#[derive(Clone, Copy)]
pub(super) struct Prop {
    def: PropDef,
    source: DeclaredSource,
}

/// [`PropFrom`] with props named rather than numbered.
#[derive(Clone, Copy)]
enum DeclaredSource {
    Attribute,
    Children,
    Computed(OpSpec, &'static [&'static str]),
    AttributeOr(&'static str),
    ByPlanner,
}

/// A prop with nothing set: what every prop starts from.
const BLANK: PropDef = PropDef {
    name: "",
    default: f64::NAN,
    from: PropFrom::ByPlanner,
    attr: None,
    bind: None,
    ref_prop: None,
    interactive: false,
    written_by_action: false,
    rendered: false,
    score: false,
    read_by_action: false,
    span: 1,
};

const fn prop_from(name: &'static str, default: f64, source: DeclaredSource) -> Prop {
    Prop {
        def: PropDef {
            name,
            default,
            ..BLANK
        },
        source,
    }
}

/// Given by the attribute of the same name, else `default`.
pub(super) const fn attr(name: &'static str, default: f64) -> Prop {
    prop_from(name, default, DeclaredSource::Attribute)
}

/// Given by the attribute of the same name, else an alias of the prop `or`.
pub(super) const fn attr_or(name: &'static str, or: &'static str) -> Prop {
    prop_from(name, f64::NAN, DeclaredSource::AttributeOr(or))
}

/// Given by the element's children: a literal, one reference, or math.
pub(super) const fn children(name: &'static str) -> Prop {
    prop_from(name, f64::NAN, DeclaredSource::Children)
}

/// `op` applied to the component's own props `args`.
pub(super) const fn computed(
    name: &'static str,
    op: OpSpec,
    args: &'static [&'static str],
) -> Prop {
    // A table's computed prop names its operator's inputs: a wrong count
    // fails to compile.
    assert!(
        op.accepts(args.len()),
        "a computed prop's operator takes another number of args"
    );
    prop_from(name, f64::NAN, DeclaredSource::Computed(op, args))
}

/// Set by the type's planner, which reads the whole element, rather than
/// by one attribute, the children or an operator.
pub(super) const fn by_planner(name: &'static str) -> Prop {
    prop_from(name, f64::NAN, DeclaredSource::ByPlanner)
}

impl Prop {
    /// Read the attribute `attr` instead of the prop's name.
    pub(super) const fn attribute(mut self, attr: &'static str) -> Self {
        self.def.attr = Some(attr);
        self
    }
    /// When the attribute `attr` is present, alias the component it
    /// references (a slider's `bindValueTo`).
    pub(super) const fn bind(mut self, attr: &'static str) -> Self {
        self.def.bind = Some(attr);
        self
    }
    /// When the attribute is a bare reference, alias this prop of the
    /// referent instead of its default prop.
    pub(super) const fn ref_prop(mut self, prop: &'static str) -> Self {
        self.def.ref_prop = Some(prop);
        self
    }
    /// A renderer may request this prop: a student's action writes it
    /// (ADR 0017's inputs).
    pub(super) const fn interactive(mut self) -> Self {
        self.def.interactive = true;
        self
    }
    /// An action writes this prop (`Document::submit`, `trigger`), so it
    /// is student state though no renderer requests it (ADR 0018).
    pub(super) const fn written_by_action(mut self) -> Self {
        self.def.written_by_action = true;
        self
    }
    /// A renderer reads this prop: an output when its component is
    /// rendered (ADR 0019).
    pub(super) const fn rendered(mut self) -> Self {
        self.def.rendered = true;
        self
    }
    /// A grader reads this prop: an output wherever its component is
    /// (ADR 0019).
    pub(super) const fn score(mut self) -> Self {
        self.def.score = true;
        self
    }
    /// An action reads this prop (`Document::submit`, `trigger`), so the
    /// core needs its value though no renderer may read it (ADR 0019).
    pub(super) const fn read_by_action(mut self) -> Self {
        self.def.read_by_action = true;
        self
    }
    /// The first of `SAMPLES` consecutive cells (a curve's samples), which
    /// a renderer reads together: when it is an output, all of them are.
    pub(super) const fn sampled(mut self) -> Self {
        self.def.span = crate::program::SAMPLES;
        self
    }
}

/// A table's [`PropDef`]s, with each prop name a computed prop reads
/// resolved to its position. A name not in the table fails to compile.
pub(super) const fn props<const N: usize>(table: [Prop; N]) -> [PropDef; N] {
    let mut out = [BLANK; N];
    let mut i = 0;
    while i < N {
        out[i] = table[i].def;
        i += 1;
    }
    // With every name in place, the sources' names resolve.
    let mut i = 0;
    while i < N {
        out[i].from = match table[i].source {
            DeclaredSource::Attribute => PropFrom::Attribute,
            DeclaredSource::Children => PropFrom::Children,
            DeclaredSource::ByPlanner => PropFrom::ByPlanner,
            DeclaredSource::AttributeOr(or) => PropFrom::AttributeOr {
                alias: at(&out, or) as u8,
            },
            DeclaredSource::Computed(op, names) => {
                assert!(names.len() <= MAX_ARGS, "too many args");
                let mut positions = [0; MAX_ARGS];
                let mut j = 0;
                while j < names.len() {
                    positions[j] = at(&out, names[j]) as u8;
                    j += 1;
                }
                PropFrom::Computed {
                    op,
                    args: Args {
                        at: positions,
                        len: names.len() as u8,
                    },
                }
            }
        };
        i += 1;
    }
    out
}

/// A type's definition before its builders (`.copyable()`, ...) are
/// applied; only `component!` calls this.
pub(super) const fn definition(
    tags: &'static [&'static str],
    props: &'static [PropDef],
) -> ComponentDef {
    ComponentDef {
        tags,
        props,
        default_prop: None,
        combined_props: &[],
        list: None,
        alternate_names: &[],
        flags: Flags {
            copyable: false,
            container: false,
            symbolic: false,
            internal: false,
        },
        renders: super::Renders::Always,
        sticky: None,
        planner: crate::compile::api::Planner::Props,
        presentation: &[],
    }
}

impl ComponentDef {
    /// See [`super::ComponentType::copyable`].
    pub(super) const fn copyable(mut self) -> Self {
        self.flags.copyable = true;
        self
    }
    /// See [`super::ComponentType::container`].
    pub(super) const fn container(mut self) -> Self {
        self.flags.container = true;
        self
    }
    /// See [`super::ComponentType::symbolic`].
    pub(super) const fn symbolic(mut self) -> Self {
        self.flags.symbolic = true;
        self
    }
    /// Made by the builder, never by a tag in the source.
    pub(super) const fn internal(mut self) -> Self {
        self.flags.internal = true;
        self
    }
    /// Where a component of the type is drawn (ADR 0019).
    pub(super) const fn renders(mut self, renders: super::Renders) -> Self {
        self.renders = renders;
        self
    }
    /// The same definition under other tags (`<derivative>` is a
    /// `<function>`'s).
    pub(super) const fn with_tags(mut self, tags: &'static [&'static str]) -> Self {
        self.tags = tags;
        self
    }
    pub(super) const fn planner(mut self, planner: crate::compile::api::Planner) -> Self {
        self.planner = planner;
        self
    }
    pub(super) const fn default_prop(mut self, prop: &'static str) -> Self {
        self.default_prop = Some(prop);
        self
    }
    pub(super) const fn combined_props(
        mut self,
        combined_props: &'static [(&'static str, &'static [&'static str])],
    ) -> Self {
        self.combined_props = combined_props;
        self
    }
    pub(super) const fn list(mut self, list: super::ListProp) -> Self {
        self.list = Some(list);
        self
    }
    pub(super) const fn alternate_names(
        mut self,
        alternate_names: &'static [(&'static str, &'static str)],
    ) -> Self {
        self.alternate_names = alternate_names;
        self
    }
    pub(super) const fn presentation(mut self, presentation: &'static [&'static str]) -> Self {
        self.presentation = presentation;
        self
    }
    /// A sticky group member of `shape`, its points where the type already
    /// says they are: its list's points (a polygon's vertices, or a
    /// segment's two endpoints among the table's props), or, with no list,
    /// the coordinates of its default prop, a combined prop (a point's
    /// `coords`).
    pub(super) const fn sticky(mut self, shape: crate::tick::snap::Shape) -> Self {
        let points = match &self.list {
            Some(list) => match list.points {
                super::ListPoints::Table(pairs) => super::StickyPoints::Props {
                    first: at(self.props, pairs[0][0]),
                    n: pairs.len(),
                },
                super::ListPoints::Given { .. } => super::StickyPoints::List,
            },
            None => {
                let Some(default) = self.default_prop else {
                    panic!("a sticky type without a list needs a default prop of coordinates");
                };
                let mut i = 0;
                let mut parts: Option<&[&str]> = None;
                while i < self.combined_props.len() {
                    if str_eq(self.combined_props[i].0, default) {
                        parts = Some(self.combined_props[i].1);
                    }
                    i += 1;
                }
                let Some(parts) = parts else {
                    panic!("a sticky type's default prop must be a combined prop of coordinates");
                };
                super::StickyPoints::Props {
                    first: at(self.props, parts[0]),
                    n: parts.len() / 2,
                }
            }
        };
        self.sticky = Some((shape, points));
        self
    }
}

/// The position of the prop `name` in `defs`, if it has one: the one
/// lookup by name, usable in `const`.
pub(crate) const fn find(defs: &[PropDef], name: &str) -> Option<usize> {
    let mut i = 0;
    while i < defs.len() {
        if str_eq(defs[i].name, name) {
            return Some(i);
        }
        i += 1;
    }
    None
}

/// The position of the prop `name` in `defs`, for a type's named
/// positions. A name not in the table fails to compile.
pub(crate) const fn at(defs: &[PropDef], name: &str) -> usize {
    match find(defs, name) {
        Some(i) => i,
        None => panic!("no such prop"),
    }
}

/// Whether `name` is a prop of `defs`, usable in `const`.
pub(crate) const fn has(defs: &[PropDef], name: &str) -> bool {
    find(defs, name).is_some()
}

/// `a == b`, usable in `const`.
pub(crate) const fn str_eq(a: &str, b: &str) -> bool {
    let (a, b) = (a.as_bytes(), b.as_bytes());
    if a.len() != b.len() {
        return false;
    }
    let mut i = 0;
    while i < a.len() {
        if a[i] != b[i] {
            return false;
        }
        i += 1;
    }
    true
}

/// A component type's whole definition in one block: its tags, flags,
/// props, combined props, list, alternate names, attributes, shared state
/// and planner. It makes the row `DEFINITION`, which `component_types!`
/// registers, the table `PROPS`, and the typed plan `Props` with its
/// `shared_state`. Each prop is named once, as an identifier, so a
/// combined prop or a computed prop naming one the table lacks fails to
/// compile. The sections come in the order below; only `tags`, `props`
/// and `planner` are required.
///
/// `Props<T>` is a struct with one field per prop of the table, named as
/// the props are, in table order, and generic over what each field holds:
/// a planner fills `Props<Wire>` (`compile::plan::Wire`) as a struct
/// literal, so a prop left unplanned does not compile, and
/// `Props::<usize>::AT` holds every prop's position.
///
/// `shared_state { .. }` names the pieces of essential state a copy with
/// overrides shares with its original unless it overrides them
/// (`compile::plan::SharedState`), as constants of a `shared_state` module
/// beside the props. A copy extends only its own type, so a type's names
/// need differ only from one another, as constants of one module must.
///
/// `presentation { .. }` names the attributes of this type that a renderer
/// reads from the document's literal attributes (a `<ref>`'s `to`), which
/// the core itself never looks up; with `PRESENTATION_ATTRS`, the ones
/// every type may carry, they are the attributes the check accepts
/// without a planner reading them (`compile/check.rs`).
///
/// `attributes { .. }` names the attributes the type's planner reads
/// itself, beyond its table's: a module `attr` holds one
/// `compile::api::Attr` per name (`attr::radius`), which is how a planner
/// names an attribute (`ctx.scalar(attr::radius)`), and where a piece of
/// shared state's value was given (`Wire::essential_from(shared_state::R,
/// attr::radius, v)`). Only the macro makes an `Attr`, so a planner names
/// only attributes its type declares, and a misspelling does not compile.
///
/// A prop is `name: source`, the source one of `by_planner`, `children`,
/// `attr(default)`, `attr_or(other)` or `computed(op, [args])`,
/// optionally followed by `{ attribute: a, bind: b, ref_prop: p,
/// interactive, written_by_action, rendered, score, read_by_action }`.
/// `interactive` marks a prop a renderer may request (ADR 0017's inputs);
/// a list ending `interactive: true` has every point interactive, for a
/// shape a drag of one point or of the whole shape moves.
/// `written_by_action` marks a prop an action writes instead (a submit, a
/// trigger; ADR 0018). `rendered` marks a prop a renderer reads, `score`
/// one a grader reads and `read_by_action` one an action reads: what the
/// core must compute (ADR 0019). A list ending `rendered: true` has every
/// point rendered.
///
/// `renders: Never` or `renders: InGraph`, after `flags`, says where a
/// component of the type is drawn ([`super::Renders`]); by default it is
/// drawn wherever it is. `sticky: shape` makes the type a sticky group
/// member (ADR 0007) whose points are its list's, or its default prop's
/// coordinates.
///
/// ```ignore
/// component! {
///     /// `<clamped lo="0" hi="1">`: its `value` held between `lo` and `hi`.
///     tags: ["clamped"],
///     flags: [copyable],
///     default_prop: clamped,
///     props {
///         value: attr(0.0),
///         lo: attr(0.0),
///         hi: attr(1.0),
///         atLeastLo: computed(OpSpec::Max, [value, lo]),
///         clamped: computed(OpSpec::Min, [atLeastLo, hi]),
///     }
///     planner: Props,
/// }
/// ```
macro_rules! component {
    // A type with no props of its own.
    (
        $(#[$doc:meta])*
        tags: [$($tag:literal),+ $(,)?],
        $(flags: [$($flag:ident),* $(,)?],)?
        $(renders: $renders:ident,)?
        $(presentation { $($prname:ident),* $(,)? })?
        $(planner: $pkind:ident $(($pfn:path))? $(,)?)?
    ) => {
        $(#[$doc])*
        pub(crate) const DEFINITION: $crate::components::ComponentDef =
            $crate::components::define::definition(&[$($tag),+], &[])
                $($(.$flag())*)?
                $(.renders($crate::components::Renders::$renders))?
                $(.presentation(&[$(stringify!($prname)),*]))?
                .planner($crate::components::define::component!(@planner $($pkind $(($pfn))?)?));
    };
    (
        $(#[$doc:meta])*
        tags: [$($tag:literal),+ $(,)?],
        $(flags: [$($flag:ident),* $(,)?],)?
        $(renders: $renders:ident,)?
        $(default_prop: $default:ident,)?
        props {
            $($pname:ident : $kind:ident $(($($karg:tt)*))? $({ $($opt:ident $(: $oval:ident)?),* $(,)? })?),+ $(,)?
        }
        $(combined_props { $($cname:ident : [$($cpart:ident),+ $(,)?]),* $(,)? })?
        $(list {
            names: [$($lname:ident),+ $(,)?],
            item: $litem:ident,
            $(points: [$([$px:ident, $py:ident]),+ $(,)?]
                $(, interactive: $lpinteractive:literal)?
                $(, rendered: $lprendered:literal)? $(,)?)?
            $(coords: [$lx:ident, $ly:ident] $(, alternate_name: $lalt:ident)?,
                attribute: $lattr:ident $(, max: $lmax:expr)?
                $(, interactive: $lcinteractive:literal)?
                $(, rendered: $lcrendered:literal)? $(,)?)?
        })?
        $(alternate_names { $($afrom:ident : $ato:ident),* $(,)? })?
        $(presentation { $($prname:ident),* $(,)? })?
        $(sticky: $sticky:expr,)?
        $(attributes { $($aname:ident),* $(,)? })?
        $(shared_state { $($state:ident),* $(,)? })?
        $(planner: $pkind:ident $(($pfn:path))? $(,)?)?
    ) => {
        $(#[$doc])*
        pub(crate) const DEFINITION: $crate::components::ComponentDef =
            $crate::components::define::definition(&[$($tag),+], PROPS)
                $($(.$flag())*)?
                $(.renders($crate::components::Renders::$renders))?
                $(.default_prop(stringify!($default)))?
                $(.combined_props(&[$((stringify!($cname), &[$(stringify!($cpart)),+])),*]))?
                $(.list($crate::components::ListProp {
                    names: &[$(stringify!($lname)),+],
                    item: stringify!($litem),
                    points: $crate::components::define::component!(@list_points
                        $(table [$([$px, $py]),+])?
                        $(given [$lx, $ly] [$($lalt)?] [$lattr] [$($lmax)?])?
                    ),
                    interactive: $crate::components::define::component!(@flag $($($lpinteractive)?)? $($($lcinteractive)?)?),
                    rendered: $crate::components::define::component!(@flag $($($lprendered)?)? $($($lcrendered)?)?),
                }))?
                $(.alternate_names(&[$((stringify!($afrom), stringify!($ato))),*]))?
                $(.presentation(&[$(stringify!($prname)),*]))?
                $(.sticky($sticky))?
                .planner($crate::components::define::component!(@planner $($pkind $(($pfn))?)?));

        const PROPS: &[$crate::components::PropDef] = &$crate::components::define::props([
            $(
                $crate::components::define::component!(@prop $kind $pname $(($($karg)*))?)
                    $($(.$opt($(stringify!($oval))?))*)?
            ),+
        ]);

        $(
            /// The essential state a copy of this type shares with its
            /// original unless it overrides it.
            pub(crate) mod shared_state {
                $(
                    pub(crate) const $state: $crate::compile::api::SharedState =
                        $crate::compile::api::SharedState::declared(stringify!($state));
                )*
            }

            // `shared_point_state` names a list's points `pt`; a declared
            // name is the constant's own, so two always differ.
            const _: () = {
                $(
                    assert!(
                        !$crate::components::define::str_eq(shared_state::$state.name(), "pt"),
                        "shared state must not be named pt"
                    );
                )*
            };
        )?

        /// One field per prop of the table, in its order. A type may use
        /// only its positions (`AT`), or only its plan.
        #[allow(non_snake_case, dead_code)]
        #[derive(Debug, Clone)]
        pub(crate) struct Props<T> {
            $(pub(crate) $pname: T,)+
        }

        #[allow(dead_code)]
        impl<T> Props<T> {
            /// The props in table order.
            pub(crate) fn into_vec(self) -> Vec<T> {
                vec![$(self.$pname),+]
            }
        }

        #[allow(dead_code)]
        const PROPS_LEN: usize = PROPS.len();

        /// The props in table order, with no allocation: what
        /// `ElemWiring::set_public` takes.
        impl<T> IntoIterator for Props<T> {
            type Item = T;
            type IntoIter = std::array::IntoIter<T, PROPS_LEN>;
            fn into_iter(self) -> Self::IntoIter {
                [$(self.$pname),+].into_iter()
            }
        }

        #[allow(dead_code)]
        impl Props<usize> {
            /// Each prop's position in the table.
            pub(crate) const AT: Props<usize> = Props {
                $($pname: $crate::components::define::at(PROPS, stringify!($pname)),)+
            };
        }

        $(
            /// The attributes this type's planner reads itself
            /// (`attributes { .. }`), as the planner names them.
            #[allow(non_upper_case_globals, dead_code)]
            pub(crate) mod attr {
                $(
                    pub(crate) const $aname: $crate::compile::api::Attr =
                        $crate::compile::api::Attr::declared(stringify!($aname));
                )*
            }
        )?

        $($($(
            const _: () = assert!(
                $crate::components::define::has(PROPS, stringify!($px))
                    && $crate::components::define::has(PROPS, stringify!($py)),
                concat!(
                    "component!: list point (", stringify!($px), ", ", stringify!($py),
                    ") names a prop the table lacks"
                ),
            );
        )+)?)?
        $($($(
            const _: () = assert!(
                $crate::components::define::has(PROPS, stringify!($cpart)),
                concat!(
                    "component!: combined prop `", stringify!($cname), "` names `",
                    stringify!($cpart), "`, which is not a prop"
                ),
            );
        )+)*)?
    };
    (@planner) => {
        compile_error!(
            "component! needs `planner: Props`, or `PropsThen(f)`, `Plan(f)` or `Whole(f)`, as its last section"
        )
    };
    (@planner $kind:ident) => { $crate::compile::api::Planner::$kind };
    (@planner $kind:ident ($f:path)) => { $crate::compile::api::Planner::$kind($f) };
    (@list_points table [$([$x:ident, $y:ident]),+]) => {
        $crate::components::ListPoints::Table(&[$([stringify!($x), stringify!($y)]),+])
    };
    (@list_points given [$x:ident, $y:ident] [$($alt:ident)?] [$attr:ident] [$($max:expr)?]) => {
        $crate::components::ListPoints::Given {
            coords: [stringify!($x), stringify!($y)],
            alternate_name: $crate::components::define::component!(@alternate_name $($alt)?),
            attribute: attr::$attr,
            max: $crate::components::define::component!(@max $($max)?),
        }
    };
    (@list_points) => {
        compile_error!(
            "component!: a list needs `points: [[x1, y1], ..]` (points that are the table's props) or `coords: [x, y], attribute: a` (as many points as an element gives in its attribute `a`, which `attributes { .. }` declares; optionally `max: n`), either optionally ending `interactive: true` and then `rendered: true`"
        )
    };
    (@flag) => { false };
    (@flag $flag:literal) => { $flag };
    (@max) => { None };
    (@max $max:expr) => { Some($max) };
    (@alternate_name) => { None };
    (@alternate_name $name:ident) => { Some(stringify!($name)) };
    (@prop by_planner $name:ident) => { $crate::components::define::by_planner(stringify!($name)) };
    (@prop children $name:ident) => { $crate::components::define::children(stringify!($name)) };
    (@prop attr $name:ident ($default:expr)) => {
        $crate::components::define::attr(stringify!($name), $default)
    };
    (@prop attr_or $name:ident ($or:ident)) => {
        $crate::components::define::attr_or(stringify!($name), stringify!($or))
    };
    (@prop computed $name:ident ($op:expr, [$($arg:ident),+ $(,)?])) => {{
        $(
            const _: () = assert!(
                $crate::components::define::has(PROPS, stringify!($arg)),
                concat!(
                    "component!: computed prop `", stringify!($name), "` reads `",
                    stringify!($arg), "`, which is not a prop"
                ),
            );
        )+
        $crate::components::define::computed(stringify!($name), $op, &[$(stringify!($arg)),+])
    }};
    (@prop $other:ident $name:ident $($rest:tt)*) => {
        compile_error!(concat!(
            "component!: prop `", stringify!($name), "` has source `", stringify!($other),
            "`; a source is by_planner, children, attr(default), attr_or(other) or computed(op, [args])"
        ))
    };
}
pub(crate) use component;
