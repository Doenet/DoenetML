//! Templates, one per repeat body, choice branch and the document, each
//! a table per stage (ADR 0031): outlining's rows ([`Outlined`]), boxing's
//! and planning's ([`Tables`]), sealing's ([`SealedTemplate`]) and the
//! check's ([`Checked`]), read together as a [`Template`]. Nothing here
//! names an iteration.

use crate::compile::*;

crate::index::index_type! {
    /// An element's stable key, as an index into the compile's [`Keys`](crate::compile::keys::Keys):
    /// what saved state names it by. Every instance of a template element
    /// shares its key; the scope tells them apart.
    pub struct ElemKey;
}

crate::index::index_type! {
    /// A template, indexing the compile's templates.
    pub(crate) struct TemplateId;
}

crate::index::index_type! {
    /// An element of a template, indexing its elements.
    pub(crate) struct ElemId;
}

/// A child of an element, as outlining made it: an element, text, or a `$ref`
/// child.
#[derive(Debug, Clone)]
pub(crate) enum Child {
    Elem(ElemId),
    Text(StrId),
    /// A `$ref` child: a copy or a number, decided when it resolves.
    Macro(RefChildId),
}

/// What an element holds under it beside its children: nothing, a repeat's
/// body, a collect's type, or a choice.
#[derive(Debug, Clone)]
pub(crate) enum Body {
    Plain,
    Repeat {
        template: TemplateId,
    },
    /// A `<collect>` or `<polyline>`, of the type it collects.
    Collect {
        component_type: ComponentType,
    },
    /// A `<conditionalContent>` or `<select>`.
    Choice(ChoiceId),
}

/// How many points an element's list holds, which with its type's table
/// says which of its ports are public.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Default)]
pub(crate) enum ListLen {
    /// No points after the table's props: a type without a given list, or
    /// one planned without its list.
    #[default]
    None,
    /// As many as planning made, two ports per point after the table's
    /// props.
    Points(u32),
    /// As many as its `extend` referent has: a bare or cloned copy of a
    /// type with a list, whose length is known only when built.
    AsReferent,
}

/// The template itself, as the parent of its top-level elements.
pub(crate) const ROOT_SCOPE: ElemId = ElemId::NONE;

/// An element of a template, as outlining made it: its node, type and name, its
/// children, and what it extends.
#[derive(Debug, Clone)]
pub(crate) struct Elem {
    pub(crate) node: NodeId,
    pub(crate) component_type: ComponentType,
    pub(crate) name: StrId,
    /// Parent element within the template (`ROOT_SCOPE` at the top). A
    /// name is visible from every ancestor within the template.
    pub(crate) name_scope: ElemId,
    pub(crate) children: Vec<Child>,
    /// The reference the element's `extend` attribute names; a clone's
    /// names its original.
    pub(crate) extend: Option<RefId>,
    /// A child of a container copy (`<graph extend="$g"/>`): every prop
    /// aliases the original's, and the children are clones too.
    pub(crate) cloned: bool,
    /// The type whose planner plans it: its tag's, where `component_type`
    /// is the type outlining settled (a `<math>` that is a point).
    pub(crate) planned_as: ComponentType,
    pub(crate) body: Body,
    /// A container copy whose clones are not made yet. False once
    /// outlining is done.
    pub(crate) clones_pending: bool,
}

impl Elem {
    /// This element as its box: an `_error` element
    /// with its node and name, and no props, children, body or extend.
    pub(crate) fn as_box(&self) -> Elem {
        Elem {
            node: self.node,
            component_type: Role::Refused.ty(),
            name: self.name,
            name_scope: self.name_scope,
            children: Vec::new(),
            extend: None,
            cloned: self.cloned,
            planned_as: self.planned_as,
            body: Body::Plain,
            clones_pending: false,
        }
    }
}

/// How an element is named in a diagnostic: its name, else its tag.
pub(in crate::compile) fn elem_label(dast: &Dast, el: &Elem) -> String {
    if el.name != StrId::NONE {
        dast.strings.get(el.name).trim().to_string()
    } else {
        format!("<{}>", el.component_type.tag())
    }
}

/// What planning makes of one element, indexed by [`ElemId`] in its
/// template.
#[derive(Debug, Clone, Default)]
pub(crate) struct ElemPlan {
    /// Each port's source, by [`Port::index`]: the table's props, then two
    /// per point of the list, then the hidden ports.
    pub(crate) props: Vec<Source>,
    /// How many points its list holds, which says how many of
    /// `props` are public; the hidden ports follow them.
    pub(crate) list: ListLen,
    /// What holds it (`fixed`).
    pub(crate) hold: Hold,
    /// What planning gave its body to read: the reference a `<collect>`
    /// gathers from, or the list a `<pointList extend="$l.points">`
    /// takes its points from.
    pub(crate) from: Option<RefId>,
    /// What the element is a copy of, if it is wired as one (not when it
    /// is an alias of an extended prop).
    pub(crate) extend: Option<RefId>,
}

impl ElemPlan {
    /// The plan of a box, and of an element not planned: nothing.
    pub(crate) const NONE: ElemPlan = ElemPlan {
        props: Vec::new(),
        list: ListLen::None,
        hold: Hold::Off,
        from: None,
        extend: None,
    };

    /// How many of the element's ports are public, for an element of
    /// `component_type`: its table's props and its list's points. None
    /// when only a build knows ([`ListLen::AsReferent`]).
    pub(crate) fn n_public(&self, component_type: ComponentType) -> Option<usize> {
        let n_table = component_type.prop_defs().len();
        match self.list {
            ListLen::None => Some(n_table),
            ListLen::Points(n) => Some(n_table + 2 * n as usize),
            ListLen::AsReferent => None,
        }
    }
}

/// A stage of the compile, as recorded for the stage that made a box.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub(crate) enum Stage {
    Outline,
    Parse,
    Plan,
    Link,
    Seal,
}

/// Whether an element is a box.
#[derive(Debug, Clone, Default)]
pub(crate) enum BoxState {
    #[default]
    Live,
    /// Boxed where it failed, or, `dead`, under a box: no build makes a
    /// dead element, and a reference to it reads as undefined. `row` is
    /// the element as the build sees it.
    Boxed {
        row: Box<Elem>,
        by: Stage,
        dead: bool,
    },
}

crate::index::index_type! {
    /// A position in a template's slot space: an element's slot offset
    /// ([`Sealed::slot_off`]) plus the port's position among its slots. With
    /// its scope it names an essential value across builds (see
    /// `CONTEXT.md`, essential key).
    pub struct TemplateSlot;
}

/// What sealing makes of one element, indexed by [`ElemId`] in its template.
#[derive(Debug, Clone, Copy)]
pub(crate) struct Sealed {
    /// The element's identity across loads, for saved state.
    pub(crate) key: ElemKey,
    /// First of this element's prop slots within the template's slot
    /// space.
    pub(crate) slot_off: TemplateSlot,
}

/// What sealing makes of a template: a row per element, how
/// many slots its elements take, and what each port holds.
#[derive(Debug, Clone, Default)]
pub(crate) struct SealedTemplate {
    pub(crate) elems: Vec<Sealed>,
    pub(crate) n_slots: u32,
    /// Each port's type, by template slot (`slot_off` plus the port's
    /// position).
    pub(crate) types: Vec<PortType>,
}

/// What outlining makes of a template: its elements' rows, its own
/// children and its `$ref` children.
#[derive(Debug, Clone, Default)]
pub(crate) struct Outlined {
    /// (template, element) of the repeat or choice this template belongs to.
    pub(crate) parent: Option<(TemplateId, ElemId)>,
    pub(crate) elems: Vec<Elem>,
    /// Children of the template itself (the document, a repeat body or a
    /// choice branch).
    pub(crate) children: Vec<Child>,
    /// The `$ref` children, by [`RefChildId`].
    pub(crate) ref_children: Vec<RefChild>,
}

/// What boxing and planning make of a template's elements, parallel to
/// its outlined elements and `$ref` children.
#[derive(Debug, Clone, Default)]
pub(crate) struct Tables {
    /// A row per element.
    pub(crate) boxes: Vec<BoxState>,
    /// A plan per element: empty until planning.
    pub(crate) plans: Vec<ElemPlan>,
    /// A plan per `$ref` child: empty until planning.
    pub(crate) ref_child_plans: Vec<RefChildPlan>,
}

/// A template as the build reads it: each stage's table. It derefs to its
/// outlined part.
#[derive(Debug, Clone, Default)]
pub(crate) struct Template {
    pub(crate) outlined: Outlined,
    pub(crate) tables: Tables,
    /// What sealing made, parallel to `elems`.
    pub(crate) sealed: SealedTemplate,
    /// What the check found, by template slot.
    pub(crate) checked: Checked,
}

impl std::ops::Deref for Template {
    type Target = Outlined;
    fn deref(&self) -> &Outlined {
        &self.outlined
    }
}

/// A template's outlined part and its tables, read together: an element as
/// built, its plan, whether it is a box.
#[derive(Clone, Copy)]
pub(crate) struct TemplateRef<'t> {
    pub(crate) outlined: &'t Outlined,
    pub(crate) tables: &'t Tables,
}

impl std::ops::Deref for TemplateRef<'_> {
    type Target = Outlined;
    fn deref(&self) -> &Outlined {
        self.outlined
    }
}

impl Tables {
    /// Whether element `e` is a box, or under one: what every stage reads
    /// of boxing's table.
    pub(crate) fn is_box(&self, e: ElemId) -> bool {
        matches!(self.boxes[e.index()], BoxState::Boxed { .. })
    }
}

impl<'t> TemplateRef<'t> {
    /// Whether element `e` is a box, or under one.
    pub(crate) fn is_box(self, e: ElemId) -> bool {
        self.tables.is_box(e)
    }

    /// Whether element `e` is under a box: no build makes it.
    pub(crate) fn is_dead(self, e: ElemId) -> bool {
        matches!(
            self.tables.boxes[e.index()],
            BoxState::Boxed { dead: true, .. }
        )
    }

    /// Element `e` as built: its box's row when it is a box, else its own.
    pub(crate) fn row(self, e: ElemId) -> &'t Elem {
        match &self.tables.boxes[e.index()] {
            BoxState::Boxed { row, .. } => row,
            BoxState::Live => &self.outlined.elems[e.index()],
        }
    }

    /// Element `e`'s plan as built: nothing for a box, else planning's.
    pub(crate) fn plan(self, e: ElemId) -> &'t ElemPlan {
        static NONE: ElemPlan = ElemPlan::NONE;
        match self.tables.boxes[e.index()] {
            BoxState::Boxed { .. } => &NONE,
            BoxState::Live => &self.tables.plans[e.index()],
        }
    }

    /// Every element as built, in order.
    pub(crate) fn rows(self) -> impl Iterator<Item = &'t Elem> {
        (0..self.outlined.elems.len()).map(move |e| self.row(ElemId::from_index(e)))
    }
}

impl Template {
    /// Its outlined part and its tables, read together.
    pub(crate) fn view(&self) -> TemplateRef<'_> {
        TemplateRef {
            outlined: &self.outlined,
            tables: &self.tables,
        }
    }

    pub(crate) fn is_dead(&self, e: ElemId) -> bool {
        self.view().is_dead(e)
    }

    pub(crate) fn row(&self, e: ElemId) -> &Elem {
        self.view().row(e)
    }

    pub(crate) fn plan(&self, e: ElemId) -> &ElemPlan {
        self.view().plan(e)
    }
}

/// What the check makes of a template: what it found of each port, by
/// template slot (`slot_off` plus the port's position). Empty until the
/// check has run.
#[derive(Debug, Clone, Default)]
pub(crate) struct Checked {
    pub(crate) attrs: Vec<PortAttrs>,
    /// The `numToSelect` of each select of the template, by element: a
    /// document constant the check evaluated (ADR 0037).
    pub(crate) picks: Vec<(ElemId, u32)>,
}
