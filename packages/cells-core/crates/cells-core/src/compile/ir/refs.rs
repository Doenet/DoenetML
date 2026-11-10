//! Reference plans: a path through the template nesting and the prop it
//! ends on ([`RefPlan`]), resolved per instance by a build, and the plans
//! of a template's `$ref` children ([`RefChildPlan`]).

use crate::compile::*;
use crate::components::Collection;

crate::index::index_type! {
    /// A reference plan, indexing the compile's reference plans. A compiled
    /// math's `$ref` leaves are these, until a build binds them to slots.
    pub(crate) struct RefId;
}

impl crate::sym::Leaf for RefId {
    fn raw(self) -> u32 {
        self.get()
    }
    fn from_raw(raw: u32) -> Self {
        Self::new(raw)
    }
}

crate::index::index_type! {
    /// A `$ref` child of a template's elements or of the template itself,
    /// indexing its template's `$ref` children and their plans.
    pub(crate) struct RefChildId;
}

/// What outlining knows of a `$ref` child: its node, the
/// element whose child it is (`None` for the template's own children), and
/// whether its path carries an index.
#[derive(Debug, Clone, Copy)]
pub(crate) struct RefChild {
    pub(crate) node: NodeId,
    pub(crate) owner: Option<ElemId>,
    pub(crate) has_index: bool,
}

/// A `$ref` child's plan: a reference, or a box when it cannot be planned.
/// `Unplanned` is under a box: no build reaches it.
#[derive(Debug, Clone, Copy, Default, PartialEq, Eq)]
pub(crate) enum RefChildPlan {
    #[default]
    Unplanned,
    Ref(RefId),
    Boxed,
}

/// One step of a reference path.
#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub(crate) enum Step {
    /// An element of the current template.
    Elem(ElemId),
    /// `[k]` on the repeat just selected: enters its template, at the
    /// iteration the index names.
    Iter(IndexPlan),
    /// `[k]` on a collection of the element just selected: a gathered
    /// item (a collect's, a polyline's), a point of a point list, or a
    /// pick of a select, which enters the option's template.
    Item(Collection, IndexPlan),
    /// An interface name of a choice, by its name-table id: `$cc.x`, or
    /// `$s[1].x` after an index into a select's picks.
    Iface(ChoiceId, NameId),
}

/// One term of an index: a constant, an iteration's position, or a cell's
/// value.
#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub(crate) enum IndexTerm {
    Const(i64),
    /// The position of the iteration `hops` template levels up from the
    /// referencing element.
    Iter(u32),
    /// The value of the cell the plan names (`$r[$n]`): a dynamic index.
    Cell(RefId),
}

/// An index into a list (`$r[k]`): the sum of its terms.
#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub(crate) struct IndexPlan {
    pub(crate) terms: Vec<IndexTerm>,
}

impl IndexPlan {
    /// The literal index `k`.
    pub(crate) fn constant(k: i64) -> IndexPlan {
        IndexPlan {
            terms: vec![IndexTerm::Const(k)],
        }
    }

    /// Its value when it is one literal.
    pub(crate) fn constant_value(&self) -> Option<i64> {
        match self.terms[..] {
            [IndexTerm::Const(k)] => Some(k),
            _ => None,
        }
    }

    /// The entry (1-based) of `n` it names when it is a literal in range.
    pub(crate) fn entry_in(&self, n: usize) -> Option<usize> {
        self.constant_value()
            .filter(|&k| k >= 1 && k as u64 <= n as u64)
            .map(|k| k as usize)
    }

    /// Whether the index reads a cell, so which item it names is known
    /// only when the document runs.
    pub(crate) fn is_dynamic(&self) -> bool {
        self.terms.iter().any(|t| matches!(t, IndexTerm::Cell(_)))
    }
}

/// `[k]` on the sequence a port holds (ADR 0041, decision 3): entry `k`
/// of its cells taken `width` at a time, a coordinate (`$P[$k]`, width 1)
/// or a point of a list (`$l.points[$k]`, width 2). An index that is not
/// an integer from 1 to the count names the missing value. A literal in
/// range is no entry step: planning binds it as the port's own entry.
#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub(crate) struct EntryIndex {
    pub(crate) index: IndexPlan,
    pub(crate) width: u8,
}

/// A reference planned: the template levels up to where its first name is, the
/// steps of its path, the prop it ends on, and the entries it takes of
/// that prop's sequence. Expansion resolves it per instance.
#[derive(Debug, Clone)]
pub(crate) struct RefPlan {
    /// Template levels up from the referencing element to where the first
    /// name was found.
    pub(crate) hops: u32,
    pub(crate) steps: Vec<Step>,
    /// The port the final part names, if any, resolved on the type the
    /// path reaches.
    pub(crate) prop: Option<RefProp>,
    /// `[k]` steps on the sequence the prop holds, in order, each over
    /// the cells the one before it left; empty for most plans.
    pub(crate) entries: Vec<EntryIndex>,
    /// How the plan is shown in an error.
    pub(crate) display: RefDisplay,
    /// The macro node the plan came from, or NONE for a plan the build
    /// made itself; what an error in resolving it is reported on.
    pub(crate) node: NodeId,
}

/// The port a reference plan names, resolved on the type the path
/// reaches: `sel` of `of`.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub(crate) struct RefProp {
    pub(crate) of: ComponentType,
    pub(crate) sel: crate::components::PropSel,
}

impl RefProp {
    /// `sel` of `of`.
    pub(crate) fn of(of: ComponentType, sel: crate::components::PropSel) -> RefProp {
        RefProp { of, sel }
    }

    /// Prop `name` of a referent of type `of`; None when the type has no
    /// such prop.
    pub(crate) fn named(of: ComponentType, name: &str) -> Option<RefProp> {
        of.resolve_prop(name).map(|sel| RefProp { of, sel })
    }

    /// The prop's name, for an error.
    pub(crate) fn name(&self) -> std::borrow::Cow<'static, str> {
        self.of.sel_name(self.sel)
    }

    /// The selector on a component of type `ty`: the resolved one, since
    /// a path reaches the type it was planned to. The type pass alone
    /// may reach another, through a branch the interface check will
    /// refuse, and then finds the prop by name.
    pub(crate) fn sel_on(&self, ty: ComponentType) -> Option<crate::components::PropSel> {
        if self.of == ty {
            Some(self.sel)
        } else {
            ty.resolve_prop(&self.name())
        }
    }

    /// Whether this is the table prop `name` (`value`, `expr`): for the
    /// compile's few checks of what a reference reads.
    pub(crate) fn is(&self, name: &str) -> bool {
        match self.sel {
            crate::components::PropSel::At(crate::components::PropAt::Position(i)) => {
                self.of.prop_defs()[i].name == name
            }
            _ => false,
        }
    }
}

/// How a reference plan is shown in an error, spelled only then.
#[derive(Debug, Clone)]
pub(crate) enum RefDisplay {
    /// The plan's macro node as written.
    Written,
    /// Another display, then `.prop`: a plan of another's prop.
    Prop(Box<RefDisplay>, &'static str),
    /// Spelled by the compile, for a plan it made itself.
    Spelled(Box<str>),
}

/// How `plan` is shown in an error, spelled from `dast`.
pub(crate) fn display_of(dast: &Dast, plan: &RefPlan) -> String {
    spell_display(dast, &plan.display, plan.node)
}

fn spell_display(dast: &Dast, display: &RefDisplay, node: NodeId) -> String {
    match display {
        RefDisplay::Written => dast.macro_display(node).to_string(),
        RefDisplay::Prop(base, prop) => format!("{}.{prop}", spell_display(dast, base, node)),
        RefDisplay::Spelled(text) => text.to_string(),
    }
}
