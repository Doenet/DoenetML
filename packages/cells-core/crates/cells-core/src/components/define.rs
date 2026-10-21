//! The vocabulary a family file defines its types with: prop builders
//! (`attr`, `computed`, ...) resolved by `props`, the row builder `info`,
//! `at` for named prop positions, and `typed_props!` for a struct with one
//! field per prop.

use super::{Args, ArrayProp, ComponentTypeInfo, Flags, MAX_ARGS, PropDef, PropFrom};
pub(super) use crate::program::OpSpec;

/// A prop as a table writes it: like a [`PropDef`], but naming the props a
/// computed prop reads. [`props`] resolves the names to positions.
#[derive(Clone, Copy)]
pub(super) struct Prop {
    name: &'static str,
    default: f64,
    source: Source,
    attr: Option<&'static str>,
    bind: Option<&'static str>,
    ref_prop: Option<&'static str>,
}

/// [`PropFrom`] with props named rather than numbered.
#[derive(Clone, Copy)]
enum Source {
    Attribute,
    Children,
    Derived,
    Computed(OpSpec, &'static [&'static str]),
    AttributeOr(&'static str),
    ByPlanner,
}

const fn prop_from(name: &'static str, default: f64, source: Source) -> Prop {
    Prop {
        name,
        default,
        source,
        attr: None,
        bind: None,
        ref_prop: None,
    }
}

/// Given by the attribute of the same name, else `default`.
pub(super) const fn attr(name: &'static str, default: f64) -> Prop {
    prop_from(name, default, Source::Attribute)
}

/// Given by the attribute of the same name, else an alias of the prop `or`.
pub(super) const fn attr_or(name: &'static str, or: &'static str) -> Prop {
    prop_from(name, f64::NAN, Source::AttributeOr(or))
}

/// Given by the element's children: a literal, one reference, or math.
pub(super) const fn children(name: &'static str) -> Prop {
    prop_from(name, f64::NAN, Source::Children)
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
    prop_from(name, f64::NAN, Source::Computed(op, args))
}

/// The `<op>` element's operator over its `args`.
pub(super) const fn derived(name: &'static str) -> Prop {
    prop_from(name, f64::NAN, Source::Derived)
}

/// Set by the type's planner, which reads the whole element, rather than
/// by one attribute, the children or an operator.
pub(super) const fn by_planner(name: &'static str) -> Prop {
    prop_from(name, f64::NAN, Source::ByPlanner)
}

impl Prop {
    /// Read the attribute `attr` instead of the prop's name.
    pub(super) const fn attribute(mut self, attr: &'static str) -> Self {
        self.attr = Some(attr);
        self
    }
    /// When the attribute `attr` is present, alias the component it
    /// references (a slider's `bindValueTo`).
    pub(super) const fn bind(mut self, attr: &'static str) -> Self {
        self.bind = Some(attr);
        self
    }
    /// When the attribute is a bare reference, alias this prop of the
    /// referent instead of its default prop.
    pub(super) const fn ref_prop(mut self, prop: &'static str) -> Self {
        self.ref_prop = Some(prop);
        self
    }
}

/// A table's [`PropDef`]s, with each prop name a computed prop reads
/// resolved to its position. A name not in the table fails to compile.
pub(super) const fn props<const N: usize>(table: [Prop; N]) -> [PropDef; N] {
    let blank = PropDef {
        name: "",
        default: f64::NAN,
        from: PropFrom::ByPlanner,
        attr: None,
        bind: None,
        ref_prop: None,
    };
    let mut out = [blank; N];
    let mut i = 0;
    while i < N {
        let p = table[i];
        let from = match p.source {
            Source::Attribute => PropFrom::Attribute,
            Source::Children => PropFrom::Children,
            Source::Derived => PropFrom::Derived,
            Source::ByPlanner => PropFrom::ByPlanner,
            Source::AttributeOr(or) => PropFrom::AttributeOr {
                alias: position(&table, or),
            },
            Source::Computed(op, names) => {
                assert!(names.len() <= MAX_ARGS, "too many args");
                let mut at = [0; MAX_ARGS];
                let mut j = 0;
                while j < names.len() {
                    at[j] = position(&table, names[j]);
                    j += 1;
                }
                PropFrom::Computed {
                    op,
                    args: Args {
                        at,
                        len: names.len() as u8,
                    },
                }
            }
        };
        out[i] = PropDef {
            name: p.name,
            default: p.default,
            from,
            attr: p.attr,
            bind: p.bind,
            ref_prop: p.ref_prop,
        };
        i += 1;
    }
    out
}

const fn position(table: &[Prop], name: &str) -> u8 {
    let mut i = 0;
    while i < table.len() {
        if str_eq(table[i].name, name) {
            return i as u8;
        }
        i += 1;
    }
    panic!("no such prop")
}

/// A row of `COMPONENT_TYPES`, to be finished with the builder methods:
/// `info(..).copyable().default_prop("value")`.
pub(super) const fn info(
    tags: &'static [&'static str],
    props: &'static [PropDef],
) -> ComponentTypeInfo {
    ComponentTypeInfo {
        tags,
        props,
        default_prop: None,
        views: &[],
        arrays: &[],
        list: None,
        aliases: &[],
        flags: Flags {
            copyable: false,
            container: false,
            symbolic: false,
            internal: false,
            test_only: false,
        },
        sticky: None,
    }
}

impl ComponentTypeInfo {
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
    /// A prototype-only tag, registered only with the `testing` feature.
    pub(super) const fn test_only(mut self) -> Self {
        self.flags.test_only = true;
        self
    }
    pub(super) const fn default_prop(mut self, prop: &'static str) -> Self {
        self.default_prop = Some(prop);
        self
    }
    pub(super) const fn views(
        mut self,
        views: &'static [(&'static str, &'static [&'static str])],
    ) -> Self {
        self.views = views;
        self
    }
    pub(super) const fn arrays(mut self, arrays: &'static [ArrayProp]) -> Self {
        self.arrays = arrays;
        self
    }
    pub(super) const fn list(mut self, list: super::ListProp) -> Self {
        self.list = Some(list);
        self
    }
    pub(super) const fn aliases(
        mut self,
        aliases: &'static [(&'static str, &'static str)],
    ) -> Self {
        self.aliases = aliases;
        self
    }
    /// A sticky member with `n` points from the table's prop `first`.
    pub(super) const fn sticky(
        mut self,
        shape: crate::tick::snap::Shape,
        first: usize,
        n: usize,
    ) -> Self {
        self.sticky = Some((shape, super::StickyPoints::Props { first, n }));
        self
    }
    /// A sticky member whose points are its list.
    pub(super) const fn sticky_list(mut self, shape: crate::tick::snap::Shape) -> Self {
        self.sticky = Some((shape, super::StickyPoints::List));
        self
    }
}

/// The position of the prop `name` in `defs`, for a type's named
/// positions. A name not in the table fails to compile.
pub(crate) const fn at(defs: &[PropDef], name: &str) -> usize {
    let mut i = 0;
    while i < defs.len() {
        if str_eq(defs[i].name, name) {
            return i;
        }
        i += 1;
    }
    panic!("no such prop")
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

/// A struct with one field per prop of a table, named as the props are,
/// in table order, and generic over what each field holds: a planner fills
/// `Props<Planned>` (`compile::plan::Planned`) as a struct literal, so a
/// prop left unplanned does not compile, and `Props::<usize>::AT` holds
/// every prop's position. A list that names a prop the table lacks, or
/// misses or reorders one, fails to compile.
///
/// `roles { .. }` declares the roles the type's planner gives its
/// essential state, as constants of a `roles` module beside the props: a
/// copy with overrides shares a slot with its referent by role
/// (`compile::plan::Role`). A copy extends only its own type, so a type's
/// roles need differ only from one another, as constants of one module
/// must.
///
/// ```ignore
/// typed_props!(CIRCLE_PROPS { cx, cy, radius, ... } roles { CX, CY, R });
/// ```
macro_rules! typed_props {
    ($table:ident { $($field:ident),* $(,)? } $(roles { $($role:ident),* $(,)? })?) => {
        $(
            /// The roles this type's planner gives its essential state.
            pub(crate) mod roles {
                $(
                    pub(crate) const $role: $crate::compile::api::Role =
                        $crate::compile::api::Role::declared(stringify!($role));
                )*
            }

            // `point_roles` names a list's points so; a declared role is
            // the constant's own name, so two always differ.
            const _: () = {
                $(
                    assert!(
                        !$crate::components::define::str_eq(roles::$role.name(), "pt"),
                        "typed_props! roles must not be named pt"
                    );
                )*
            };
        )?

        /// One field per prop of the table, in its order. A type may use
        /// only its positions (`AT`), or only its plan.
        #[allow(non_snake_case, dead_code)]
        #[derive(Debug, Clone)]
        pub(crate) struct Props<T> {
            $(pub(crate) $field: T,)*
        }

        #[allow(dead_code)]
        impl<T> Props<T> {
            /// The props in table order.
            pub(crate) fn into_vec(self) -> Vec<T> {
                vec![$(self.$field),*]
            }
        }

        const PROPS_LEN: usize = $table.len();

        /// The props in table order, with no allocation: what
        /// `ElemPlan::set_public` takes.
        impl<T> IntoIterator for Props<T> {
            type Item = T;
            type IntoIter = std::array::IntoIter<T, PROPS_LEN>;
            fn into_iter(self) -> Self::IntoIter {
                [$(self.$field),*].into_iter()
            }
        }

        #[allow(dead_code)]
        impl Props<usize> {
            /// Each prop's position in the table.
            pub(crate) const AT: Props<usize> = Props {
                $($field: $crate::components::define::at($table, stringify!($field)),)*
            };
        }

        const _: () = {
            let names: &[&str] = &[$(stringify!($field)),*];
            assert!(
                names.len() == $table.len(),
                "typed_props! must name every prop of its table"
            );
            let mut i = 0;
            while i < names.len() {
                assert!(
                    $crate::components::define::str_eq(names[i], $table[i].name),
                    "typed_props! must list the props in table order"
                );
                i += 1;
            }
        };
    };
}
pub(crate) use typed_props;
