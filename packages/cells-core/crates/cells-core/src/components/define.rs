//! How a component type is defined: `component!`, one block per type, and
//! what it is built on (the prop sources `attr`, `computed`, ... resolved
//! by `props`, the definition's builders, and `at` for a prop's position
//! by name).

use super::{
    AggOp, Aggregate, ArgFrom, Args, Collection, ComponentDef, Flags, MAX_ARGS, PropDef, PropFrom,
};
pub(super) use crate::compile::api::NO_VALUE;
pub(super) use crate::program::OpSpec;

/// A prop as a table writes it: a [`PropDef`] whose source still names the
/// props a computed prop reads.
#[derive(Clone, Copy)]
pub(super) struct Prop {
    def: PropDef,
    source: DeclaredSource,
    /// For a run of cells (`sampled`), the prop that says whether it is
    /// there, by name.
    sampled_when: Option<&'static str>,
    /// The expression it stands for, by name: where it is (None: the prop
    /// itself) and the prop that says there is one.
    expr: Option<(Option<&'static str>, &'static str)>,
}

/// A computed prop's input as a table writes it: a prop by name, or a
/// literal.
#[derive(Clone, Copy)]
pub(super) enum DeclaredArg {
    Prop(&'static str),
    Const(f64),
}

/// [`PropFrom`] with props named rather than numbered.
#[derive(Clone, Copy)]
enum DeclaredSource {
    Attribute,
    Children,
    Computed(OpSpec, &'static [DeclaredArg]),
    AttributeOr(&'static str),
    ByPlanner,
    Aggregate(Aggregate),
}

/// A prop with nothing set: what every prop starts from.
const BLANK: PropDef = PropDef {
    name: "",
    default: f64::NAN,
    from: PropFrom::ByPlanner,
    attr: None,
    bind: None,
    ref_prop: None,
    text: false,
    interactive: false,
    written_by_action: false,
    rendered: false,
    score: false,
    read_by_action: false,
    span: 1,
    span_when: None,
    expr: None,
};

const fn prop_from(name: &'static str, default: f64, source: DeclaredSource) -> Prop {
    Prop {
        def: PropDef {
            name,
            default,
            ..BLANK
        },
        source,
        sampled_when: None,
        expr: None,
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

/// `op` applied to `args`: the component's own props, and literals.
pub(super) const fn computed(name: &'static str, op: OpSpec, args: &'static [DeclaredArg]) -> Prop {
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

/// `op` over the collection `over`, wired by the build. Credit is over
/// scored items only, a count over sections or what the element gathers;
/// any other pairing fails to compile.
pub(super) const fn aggregate(name: &'static str, op: AggOp, over: Collection) -> Prop {
    assert!(
        matches!(
            (op, over),
            (
                AggOp::Credit | AggOp::PercentCredit,
                Collection::ScoredItems
            ) | (
                AggOp::Count,
                Collection::SectionsThrough | Collection::Gathered
            )
        ),
        "an aggregate's operator does not fit its collection"
    );
    prop_from(
        name,
        f64::NAN,
        DeclaredSource::Aggregate(Aggregate { op, over }),
    )
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
    /// The prop holds text, a string id, whatever gives it.
    pub(super) const fn text(mut self) -> Self {
        self.def.text = true;
        self
    }
    /// A renderer may request this prop: a student's action writes it.
    pub(super) const fn interactive(mut self) -> Self {
        self.def.interactive = true;
        self
    }
    /// An action writes this prop (a submit, a trigger): student state,
    /// though no renderer requests it.
    pub(super) const fn written_by_action(mut self) -> Self {
        self.def.written_by_action = true;
        self
    }
    /// A renderer reads this prop: an output when its component is
    /// rendered.
    pub(super) const fn rendered(mut self) -> Self {
        self.def.rendered = true;
        self
    }
    /// A grader reads this prop: an output wherever its component is.
    pub(super) const fn score(mut self) -> Self {
        self.def.score = true;
        self
    }
    /// An action reads this prop (a submit, a trigger), so the core needs
    /// its value though no renderer may read it.
    pub(super) const fn read_by_action(mut self) -> Self {
        self.def.read_by_action = true;
        self
    }
    /// Stands for the expression in prop `at` when `at` is math: a
    /// `<math>`'s `value` for its `expr` ([`super::ExprOf`]).
    pub(super) const fn expr_of(mut self, at: &'static str) -> Self {
        self.expr = Some((Some(at), at));
        self
    }
    /// Is itself an expression when prop `when` is math: an answer's
    /// `correct` when what it submits is math ([`super::ExprOf`]).
    pub(super) const fn expr_when(mut self, when: &'static str) -> Self {
        self.expr = Some((None, when));
        self
    }
    /// The first of `SAMPLES` consecutive cells (a curve's samples) when
    /// the prop `when` is nonzero; one cell when it is 0.
    pub(super) const fn sampled(mut self, when: &'static str) -> Self {
        self.def.span = crate::program::SAMPLES;
        self.sampled_when = Some(when);
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
            DeclaredSource::Aggregate(a) => PropFrom::Aggregate(a),
            DeclaredSource::AttributeOr(or) => PropFrom::AttributeOr {
                alias: at(&out, or) as u8,
            },
            DeclaredSource::Computed(op, args) => {
                assert!(args.len() <= MAX_ARGS, "too many args");
                let mut resolved = [ArgFrom::Prop(0); MAX_ARGS];
                let mut j = 0;
                while j < args.len() {
                    resolved[j] = match args[j] {
                        DeclaredArg::Prop(name) => ArgFrom::Prop(at(&out, name) as u8),
                        DeclaredArg::Const(k) => ArgFrom::Const(k),
                    };
                    j += 1;
                }
                PropFrom::Computed {
                    op,
                    args: Args {
                        at: resolved,
                        len: args.len() as u8,
                    },
                }
            }
        };
        if let Some(when) = table[i].sampled_when {
            out[i].span_when = Some(at(&out, when) as u8);
        }
        if let Some((holder, when)) = table[i].expr {
            let holder = match holder {
                Some(name) => at(&out, name),
                None => i,
            };
            out[i].expr = Some(super::ExprOf {
                at: holder as u8,
                when: at(&out, when) as u8,
            });
        }
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
            owned: false,
            not_extendable: false,
            located: false,
        },
        renders: super::Renders::Always,
        sticky: None,
        planner: crate::compile::api::Planner::Props,
        presentation: &[],
        reads_as: None,
        attributes: &[],
        children: super::ChildrenDecl::RENDERED,
        machinery: None,
        owner: None,
        roles: &[],
        structure_kind: None,
        response: None,
        text: None,
        constrain_target: None,
        params: &[],
    }
}

impl ComponentDef {
    pub(super) const fn copyable(mut self) -> Self {
        self.flags.copyable = true;
        self
    }
    pub(super) const fn container(mut self) -> Self {
        self.flags.container = true;
        self
    }
    pub(super) const fn symbolic(mut self) -> Self {
        self.flags.symbolic = true;
        self
    }
    /// Made by the builder, never by a tag in the source.
    pub(super) const fn internal(mut self) -> Self {
        self.flags.internal = true;
        self
    }
    pub(super) const fn owned(mut self) -> Self {
        self.flags.owned = true;
        self
    }
    pub(super) const fn not_extendable(mut self) -> Self {
        self.flags.not_extendable = true;
        self
    }
    pub(super) const fn machinery(mut self, machinery: super::Machinery) -> Self {
        self.machinery = Some(machinery);
        self
    }
    pub(super) const fn constrain_target(mut self, target: super::ConstrainTarget) -> Self {
        self.constrain_target = Some(target);
        self
    }
    /// The roles the type plays for the core ([`super::Role`]).
    pub(super) const fn roles(mut self, roles: &'static [super::Role]) -> Self {
        self.roles = roles;
        self
    }
    /// How the type is structure rather than content ([`super::StructureKind`]).
    pub(super) const fn structure_kind(mut self, kind: super::StructureKind) -> Self {
        self.structure_kind = Some(kind);
        self
    }
    /// What an answer's response reads of an input of the type
    /// ([`super::ResponseKind`]).
    pub(super) const fn response(mut self, response: super::ResponseKind) -> Self {
        self.response = Some(response);
        self
    }
    /// How a component of the type shows in text ([`super::TextKind`]).
    pub(super) const fn text(mut self, text: super::TextKind) -> Self {
        self.text = Some(text);
        self
    }
    pub(super) const fn owner(mut self, owner: super::ComponentType) -> Self {
        self.owner = Some(owner);
        self
    }
    pub(super) const fn located(mut self) -> Self {
        self.flags.located = true;
        self
    }
    /// Where a component of the type is drawn.
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
    pub(super) const fn attributes(mut self, attributes: &'static [super::AttrDecl]) -> Self {
        self.attributes = attributes;
        self
    }
    /// How the type reads its children.
    pub(super) const fn children(mut self, children: super::ChildrenDecl) -> Self {
        self.children = children;
        self
    }
    pub(super) const fn params(mut self, params: &'static [&'static str]) -> Self {
        self.params = params;
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
    pub(super) const fn reads_as(mut self, component_type: super::ComponentType) -> Self {
        self.reads_as = Some(component_type);
        self
    }
    /// A sticky group member of `shape`: its points are its list's, or,
    /// with no list, its default prop's, a combined prop of coordinates.
    /// Panics at compile time when it has neither.
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

/// The position of attribute `name` among `attrs`, for a type's `attr`
/// constants. A name not declared fails to compile.
pub(crate) const fn attr_index(attrs: &[super::AttrDecl], name: &str) -> u8 {
    let mut i = 0;
    while i < attrs.len() {
        if str_eq(attrs[i].name, name) {
            return i as u8;
        }
        i += 1;
    }
    panic!("no such attribute")
}

/// An attribute's name as a block writes it, a keyword as a raw
/// identifier (`r#type` is `type`).
pub(crate) const fn raw_name(name: &'static str) -> &'static str {
    let bytes = name.as_bytes();
    if bytes.len() > 2 && bytes[0] == b'r' && bytes[1] == b'#' {
        match std::str::from_utf8(bytes.split_at(2).1) {
            Ok(s) => s,
            Err(_) => panic!("an attribute name is UTF-8"),
        }
    } else {
        name
    }
}

/// The position of the group `name` among `groups`, for a type's typed
/// record. A name not declared fails to compile.
pub(crate) const fn group_index(groups: &[super::ChildGroup], name: &str) -> usize {
    let mut i = 0;
    while i < groups.len() {
        if str_eq(groups[i].name, name) {
            return i;
        }
        i += 1;
    }
    panic!("no such group")
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
/// props, combined props, list, alternate names, attributes, parameters
/// and planner. It makes the row `DEFINITION`, the table `PROPS`, the
/// typed plan `Props` and the typed record `Attrs`. Each prop is named
/// once, as an identifier, so a combined or computed prop naming one the
/// table lacks fails to compile. The sections come in the order below;
/// only `tags`, `props` and `planner` are required.
///
/// `reads_as: T` says a bare reference to a component of this type is a
/// `T` holding its value, not a copy (`$mi` of a `<mathInput>` is a
/// `<math>`); its props alias the referent's of the same name.
///
/// `roles: [Root]` says the core makes a component of this type when it
/// needs one in that role ([`super::Role`]), so the core names the role,
/// not the type.
///
/// `structure: Gate { active: active }` says the type is structure rather
/// than content ([`super::StructureKind`]): `Transparent` (or `Transparent {
/// choice: p }`), `Gate { active: p }` or `Repeat { count: p }`, each `p`
/// a prop of the table.
///
/// `response: Math(expr)` makes the type an answer's input whose response
/// reads that prop ([`super::ResponseKind`]), and `text: Number(value)`
/// says how a component shows in text ([`super::TextKind`]). A prop
/// option `expr_of: expr` or `expr_when: submitted` says the prop stands
/// for an expression ([`super::ExprOf`]).
///
/// `Props<T>` has one field per prop of the table, in table order: a
/// planner fills `Props<Wire>` as a struct literal, so a prop left
/// unplanned does not compile; `Props::PORTS` holds every prop's port, by
/// which a planner names it in its wiring; `Props::<usize>::AT` holds
/// every prop's position.
///
/// `params { .. }` names the parameters the planner introduces that no
/// attribute gives: named given leaves with a default (a line's distance
/// along its direction), shared by a copy, as constants of a `param`
/// module.
///
/// `presentation { .. }` names the attributes of this type that a renderer
/// reads and the core does not (a `<ref>`'s `to`).
///
/// `attributes { .. }` declares the attributes the type's planner reads,
/// each with its kind: `center: Point`, `radius: Scalar`,
/// `through: Points(3)`, `hide: Flag(false)`, `rigid: Bool(false)`,
/// `minShrink: Number(0.1)`, `rotateAround: Text`, `equation: Math`,
/// `function: Ref`. The planner reads them typed, as the struct `Attrs`
/// (`Attrs::of(ctx.record())`). A module `attr` holds one
/// `compile::api::Attr` per name (`attr::radius`), by which a planner says
/// what gave a given leaf (`Wire::given_by(attr::radius, v)`); a
/// misspelling does not compile.
///
/// A prop is `name: source`, the source one of `by_planner`, `children`,
/// `attr(default)`, `attr_or(other)`, `computed(op, [args])` or
/// `aggregate(op, collection)`, where an arg is a prop or a literal in
/// parentheses (`[radius, (2.0)]`), optionally followed by `{ attribute:
/// a, bind: b, ref_prop: p, text, interactive, written_by_action,
/// rendered, score, read_by_action, sampled: p }`, each as the [`Prop`]
/// builder of that name. A list ending `interactive: true` or `rendered:
/// true` marks every point so.
///
/// `renders: Never` or `renders: InGraph`, after `flags`, says where a
/// component of the type is drawn ([`super::Renders`]); by default
/// wherever it is. `sticky: shape` makes the type a sticky group member
/// whose points are its list's, or its default prop's coordinates.
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
        $(reads_as: $ras:ident,)?
        $(roles: [$($role:ident),* $(,)?],)?
        $(structure: $stkind:ident $({ $($stfield:ident : $stprop:ident),* $(,)? })?,)?
        $(presentation { $($prname:ident),* $(,)? })?
        $(attributes { $($aname:ident : $akind:ident $(($($akarg:tt)*))?),* $(,)? })?
        $(children: $ckind:ident $({ $($gname:ident : [$($gty:ident),* $(,)?]),* $(,)? })? $(,)?)?
        $(machinery: $mach:ident,)?
        $(owner: $owner:ident,)?
        $(planner: $pkind:ident $(($pfn:path))? $(,)?)?
    ) => {
        $(#[$doc])*
        pub(crate) const DEFINITION: $crate::components::ComponentDef =
            $crate::components::define::definition(&[$($tag),+], &[])
                $($(.$flag())*)?
                $(.renders($crate::components::Renders::$renders))?
                $(.reads_as($crate::components::ComponentType::$ras))?
                $(.roles(&[$($crate::components::Role::$role),*]))?
                $(.structure_kind($crate::components::define::component!(@structure $stkind $({ $($stfield : $stprop),* })?)))?
                $(.presentation(&[$(stringify!($prname)),*]))?
                .attributes(ATTRS)
                .children(CHILDREN)
                $(.machinery($crate::components::Machinery::$mach))?
                $(.owner($crate::components::ComponentType::$owner))?
                .planner($crate::components::define::component!(@planner $($pkind $(($pfn))?)?));

        $crate::components::define::component!(@record
            [$($($aname : $akind $(($($akarg)*))?),*)?]
            [$($ckind $([$($gname : [$($gty),*]),*])?)?]
        );
    };
    (
        $(#[$doc:meta])*
        tags: [$($tag:literal),+ $(,)?],
        $(flags: [$($flag:ident),* $(,)?],)?
        $(renders: $renders:ident,)?
        $(reads_as: $ras:ident,)?
        $(roles: [$($role:ident),* $(,)?],)?
        $(structure: $stkind:ident $({ $($stfield:ident : $stprop:ident),* $(,)? })?,)?
        $(response: $rkind:ident ($rprop:ident),)?
        $(text: $tkind:ident ($($tprop:ident),+ $(,)?),)?
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
        $(constrain_target {
            $(ports: [$($ctport:ident),+ $(,)?], op: $ctop:ident)?
            $(graph: $ctgraph:ident)? $(,)?
        })?
        $(attributes { $($aname:ident : $akind:ident $(($($akarg:tt)*))?),* $(,)? })?
        $(params { $($param:ident),* $(,)? })?
        $(children: $ckind:ident $({ $($gname:ident : [$($gty:ident),* $(,)?]),* $(,)? })? $(,)?)?
        $(machinery: $mach:ident,)?
        $(owner: $owner:ident,)?
        $(planner: $pkind:ident $(($pfn:path))? $(,)?)?
    ) => {
        $(#[$doc])*
        pub(crate) const DEFINITION: $crate::components::ComponentDef =
            $crate::components::define::definition(&[$($tag),+], PROPS)
                $($(.$flag())*)?
                $(.renders($crate::components::Renders::$renders))?
                $(.reads_as($crate::components::ComponentType::$ras))?
                $(.roles(&[$($crate::components::Role::$role),*]))?
                $(.structure_kind($crate::components::define::component!(@structure $stkind $({ $($stfield : $stprop),* })?)))?
                $(.response($crate::components::ResponseKind::$rkind(
                    $crate::components::define::at(PROPS, stringify!($rprop)),
                )))?
                $(.text($crate::components::TextKind::$tkind(
                    $($crate::components::define::at(PROPS, stringify!($tprop))),+
                )))?
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
                $(.constrain_target($crate::components::define::component!(@constrain_target
                    $([$($ctport),+] $ctop)?
                    $(graph $ctgraph)?
                )))?
                .attributes(ATTRS)
                .children(CHILDREN)
                $(.params(&[$(stringify!($param)),*]))?
                $(.machinery($crate::components::Machinery::$mach))?
                $(.owner($crate::components::ComponentType::$owner))?
                .planner($crate::components::define::component!(@planner $($pkind $(($pfn))?)?));

        const PROPS: &[$crate::components::PropDef] = &$crate::components::define::props([
            $(
                $crate::components::define::component!(@prop $kind $pname $(($($karg)*))?)
                    $($(.$opt($(stringify!($oval))?))*)?
            ),+
        ]);

        $(
            /// The parameters this type's planner introduces that no
            /// attribute gives: named given leaves, shared by a copy.
            #[allow(non_upper_case_globals, dead_code)]
            pub(crate) mod param {
                $(
                    pub(crate) const $param: $crate::compile::api::Param =
                        $crate::compile::api::Param::declared(stringify!($param));
                )*
            }
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

        /// The props in table order, with no allocation.
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

        #[allow(dead_code)]
        impl Props<$crate::compile::api::Port> {
            /// Each prop's port: how a planner names a table prop in its
            /// wiring (`ports.cx`).
            pub(crate) const PORTS: Props<$crate::compile::api::Port> = Props {
                $($pname: $crate::compile::api::Port::table(
                    $crate::components::define::at(PROPS, stringify!($pname))
                ),)+
            };
        }

        $crate::components::define::component!(@record
            [$($($aname : $akind $(($($akarg)*))?),*)?]
            [$($ckind $([$($gname : [$($gty),*]),*])?)?]
        );

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
    // A structure kind, each prop it names a position in `PROPS`.
    (@structure Transparent) => {
        $crate::components::StructureKind::Transparent { choice: None }
    };
    (@structure Transparent { choice: $p:ident }) => {
        $crate::components::StructureKind::Transparent {
            choice: Some($crate::components::define::at(PROPS, stringify!($p))),
        }
    };
    (@structure Gate { active: $p:ident }) => {
        $crate::components::StructureKind::Gate {
            active: $crate::components::define::at(PROPS, stringify!($p)),
        }
    };
    (@structure Repeat { count: $p:ident }) => {
        $crate::components::StructureKind::Repeat {
            count: $crate::components::define::at(PROPS, stringify!($p)),
        }
    };
    // What the attributes and children a type declares make: `ATTRS`,
    // `CHILDREN`, the `attr` module and the typed record `Attrs`.
    (@record
        [$($aname:ident : $akind:ident $(($($akarg:tt)*))?),*]
        [$($ckind:ident $([$($gname:ident : [$($gty:ident),*]),*])?)?]
    ) => {
        /// The attributes this type's planner reads, each with its kind.
        const ATTRS: &[$crate::components::AttrDecl] = &[$(
            $crate::components::AttrDecl {
                name: $crate::components::define::raw_name(stringify!($aname)),
                kind: $crate::components::define::component!(@kind $akind $(($($akarg)*))?),
            }
        ),*];

        /// How this type reads its children.
        const CHILDREN: $crate::components::ChildrenDecl =
            $crate::components::define::component!(@children $($ckind $([$($gname : [$($gty),*]),*])?)?);

        /// The attributes this type's planner reads itself
        /// (`attributes { .. }`), as the planner names them.
        #[allow(non_upper_case_globals, dead_code)]
        pub(crate) mod attr {
            $(
                pub(crate) const $aname: $crate::compile::api::Attr =
                    $crate::compile::api::Attr::declared(
                        $crate::components::define::raw_name(stringify!($aname)),
                        $crate::components::define::attr_index(
                            super::ATTRS,
                            $crate::components::define::raw_name(stringify!($aname)),
                        ),
                    );
            )*
        }

        /// The type's attributes and children as the compile parsed them into
        /// the element's record: one typed field per declared attribute,
        /// `children` as its kind reads them, and one field per group of
        /// element children, each the element's own value or, under `extend`,
        /// its referent's.
        #[allow(non_snake_case, dead_code)]
        #[derive(Debug)]
        pub(crate) struct Attrs {
            $(pub(crate) $aname: $crate::components::define::component!(@field $akind $(($($akarg)*))?),)*
            $(
                pub(crate) children: $crate::components::define::component!(@ctype $ckind),
                $($(pub(crate) $gname: Vec<$crate::compile::api::Member>,)*)?
            )?
        }

        #[allow(dead_code)]
        impl Attrs {
            /// The record's values, typed.
            #[allow(unused_variables)]
            pub(crate) fn of(record: &$crate::compile::api::Record) -> Attrs {
                Attrs {
                    $($aname: $crate::components::define::component!(@get $akind $(($($akarg)*))?, record, attr::$aname),)*
                    $(
                        children: $crate::components::define::component!(@cget $ckind, record),
                        $($($gname: record.group($crate::components::define::group_index(
                            CHILDREN.groups,
                            stringify!($gname),
                        )),)*)?
                    )?
                }
            }
        }
    };
    (@constrain_target [$($port:ident),+] $op:ident) => {{
        $(
            const _: () = assert!(
                $crate::components::define::has(PROPS, stringify!($port)),
                concat!("component!: constrain_target names `", stringify!($port), "`, which is not a prop"),
            );
        )+
        $crate::components::ConstrainTarget::Project {
            props: &[$(stringify!($port)),+],
            op: $crate::program::VecOp::$op,
        }
    }};
    (@constrain_target graph $expr:ident) => {{
        const _: () = assert!(
            $crate::components::define::has(PROPS, stringify!($expr)),
            concat!("component!: constrain_target names `", stringify!($expr), "`, which is not a prop"),
        );
        $crate::components::ConstrainTarget::Graph { expr: stringify!($expr) }
    }};
    (@children) => { $crate::components::ChildrenDecl::RENDERED };
    (@children $ckind:ident $([$($gname:ident : [$($gty:ident),*]),*])?) => {
        $crate::components::ChildrenDecl {
            kind: $crate::components::ChildrenKind::$ckind,
            groups: &[$($($crate::components::ChildGroup {
                name: stringify!($gname),
                types: &[$($crate::components::ComponentType::$gty),*],
            }),*)?],
        }
    };
    (@ctype Math) => { Option<Box<[$crate::dast::NodeId]>> };
    (@ctype Value) => { $crate::compile::api::ValueChildren };
    (@ctype None) => { () };
    (@ctype Rendered) => { () };
    (@ctype $other:ident) => {
        compile_error!(concat!(
            "component!: children kind `", stringify!($other),
            "` is not one of None, Math, Value, Rendered"
        ))
    };
    (@cget Math, $r:ident) => { $r.child_math() };
    (@cget Value, $r:ident) => { $r.child_value() };
    (@cget $other:ident, $r:ident) => { () };
    // A type that names machinery, or is owned, plans nothing itself.
    (@planner) => { $crate::compile::api::Planner::Props };
    (@kind Scalar) => { $crate::components::AttrKind::Scalar };
    (@kind Value) => { $crate::components::AttrKind::Value };
    (@kind Point) => { $crate::components::AttrKind::Point };
    (@kind Points) => { $crate::components::AttrKind::Points { max: None } };
    (@kind Scalars) => { $crate::components::AttrKind::Scalars };
    (@kind Points($max:expr)) => { $crate::components::AttrKind::Points { max: Some($max) } };
    (@kind Flag($d:expr)) => { $crate::components::AttrKind::Flag { default: $d } };
    (@kind Bool($d:expr)) => { $crate::components::AttrKind::Bool { default: $d } };
    (@kind Number($d:expr)) => { $crate::components::AttrKind::Number { default: $d } };
    (@kind Literal($d:expr)) => { $crate::components::AttrKind::Literal { default: $d } };
    (@kind On) => { $crate::components::AttrKind::On };
    (@kind Written) => { $crate::components::AttrKind::Written };
    (@kind LiteralFlag) => { $crate::components::AttrKind::LiteralFlag };
    (@kind Content) => { $crate::components::AttrKind::Content };
    (@kind Text) => { $crate::components::AttrKind::Text };
    (@kind Math) => { $crate::components::AttrKind::Math };
    (@kind Ref) => { $crate::components::AttrKind::Ref };
    (@kind $other:ident $(($($karg:tt)*))?) => {
        compile_error!(concat!(
            "component!: attribute kind `", stringify!($other),
            "` is not one of Scalar, Value, Point, Points, Points(max), Flag(default), Bool(default), Number(default), Literal(default), On, Written, LiteralFlag, Content, Text, Math, Ref"
        ))
    };
    (@field Scalar) => { Option<$crate::compile::api::Source> };
    (@field Value) => { Option<$crate::compile::api::Source> };
    (@field Point) => { Option<$crate::compile::api::PointAttr> };
    (@field Points $(($max:expr))?) => { Vec<$crate::compile::api::GivenPoint> };
    (@field Scalars) => { Vec<$crate::compile::api::Source> };
    (@field Flag($d:expr)) => { $crate::compile::api::Source };
    (@field Bool($d:expr)) => { bool };
    (@field Number($d:expr)) => { f64 };
    (@field Literal($d:expr)) => { $crate::error::Result<f64> };
    (@field On) => { bool };
    (@field Written) => { bool };
    (@field LiteralFlag) => { Option<Option<bool>> };
    (@field Content) => { Option<$crate::compile::api::ValueChildren> };
    (@field Text) => { Option<String> };
    (@field Math) => { Option<Box<[$crate::dast::NodeId]>> };
    (@field Ref) => { Option<$crate::compile::ir::RefId> };
    (@get Scalar, $r:ident, $a:expr) => { $r.scalar($a) };
    (@get Value, $r:ident, $a:expr) => { $r.scalar($a) };
    (@get Point, $r:ident, $a:expr) => { $r.point($a) };
    (@get Points $(($max:expr))?, $r:ident, $a:expr) => { $r.points($a) };
    (@get Scalars, $r:ident, $a:expr) => { $r.scalars($a) };
    (@get Flag($d:expr), $r:ident, $a:expr) => { $r.flag($a, $d) };
    (@get Bool($d:expr), $r:ident, $a:expr) => { $r.bool($a, $d) };
    (@get Number($d:expr), $r:ident, $a:expr) => { $r.number($a, $d) };
    (@get Literal($d:expr), $r:ident, $a:expr) => { $r.literal($a, $d) };
    (@get On, $r:ident, $a:expr) => { $r.bool($a, false) };
    (@get Written, $r:ident, $a:expr) => { $r.bool($a, false) };
    (@get LiteralFlag, $r:ident, $a:expr) => { $r.literal_flag($a) };
    (@get Content, $r:ident, $a:expr) => { $r.content($a) };
    (@get Text, $r:ident, $a:expr) => { $r.text($a) };
    (@get Math, $r:ident, $a:expr) => { $r.math($a) };
    (@get Ref, $r:ident, $a:expr) => { $r.reference($a) };
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
    (@prop aggregate $name:ident ($op:ident, $over:ident)) => {
        $crate::components::define::aggregate(
            stringify!($name),
            $crate::components::AggOp::$op,
            $crate::components::Collection::$over,
        )
    };
    (@prop computed $name:ident ($op:expr, [$($arg:tt),+ $(,)?])) => {{
        $($crate::components::define::component!(@has_arg $name $arg);)+
        $crate::components::define::computed(
            stringify!($name),
            $op,
            &[$($crate::components::define::component!(@arg $arg)),+],
        )
    }};
    (@has_arg $name:ident $arg:ident) => {
        const _: () = assert!(
            $crate::components::define::has(PROPS, stringify!($arg)),
            concat!(
                "component!: computed prop `", stringify!($name), "` reads `",
                stringify!($arg), "`, which is not a prop"
            ),
        );
    };
    (@has_arg $name:ident ($k:expr)) => {};
    (@arg $arg:ident) => { $crate::components::define::DeclaredArg::Prop(stringify!($arg)) };
    (@arg ($k:expr)) => { $crate::components::define::DeclaredArg::Const($k) };
    (@prop $other:ident $name:ident $($rest:tt)*) => {
        compile_error!(concat!(
            "component!: prop `", stringify!($name), "` has source `", stringify!($other),
            "`; a source is by_planner, children, attr(default), attr_or(other), computed(op, [args]) or aggregate(op, collection)"
        ))
    };
}
pub(crate) use component;
