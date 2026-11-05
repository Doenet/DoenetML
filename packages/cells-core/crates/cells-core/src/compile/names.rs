//! The name table: made while outlining, read by every later stage.

use crate::compile::*;

/// A name-table entry naming more than one element.
pub(in crate::compile) const AMBIGUOUS: ElemId = ElemId::NONE;

crate::index::index_type! {
    /// An element name, trimmed, as the name table numbers it
    /// (`NameTable::ids`, `NameTable::texts`).
    pub(crate) struct NameId;
}

/// The name table.
#[derive(Default)]
pub(in crate::compile) struct NameTable {
    /// By (template, scope, name), the one descendant of the scope (or
    /// `ROOT_SCOPE`) carrying the name, or `AMBIGUOUS` when several do. A
    /// name is registered at every ancestor of its element.
    pub(in crate::compile) by_scope: HashMap<(TemplateId, ElemId, NameId), ElemId>,
    /// Each element name, trimmed, by its id in `by_scope`.
    pub(in crate::compile) ids: HashMap<Box<str>, NameId>,
    /// Each name by its id: the inverse of `ids`.
    pub(in crate::compile) texts: Vec<Box<str>>,
    /// The id of each DAST string an element is named by, by string id
    /// (`NO_NAME` for the rest).
    pub(in crate::compile) by_str: Vec<NameId>,
    /// (template, name scope, name) of every named element: two siblings
    /// with one name can never be told apart.
    pub(in crate::compile) siblings: HashSet<(TemplateId, ElemId, NameId)>,
}

/// A string no element is named by exactly.
pub(in crate::compile) const NO_NAME: NameId = NameId::NONE;

impl NameTable {
    /// The name with id `id`.
    pub(in crate::compile) fn text(&self, id: NameId) -> &str {
        &self.texts[id.index()]
    }

    /// The id of `name`, when some element carries it.
    pub(in crate::compile) fn id(&self, name: &str) -> Option<NameId> {
        self.ids.get(name.trim()).copied()
    }

    /// The id of the DAST string `s` as a name, when some element carries
    /// it: from `by_str` when an element is named by `s` itself, else by
    /// its trimmed text (`s` spelled with spaces, or naming nothing).
    pub(in crate::compile) fn id_of(&self, dast: &Dast, s: StrId) -> Option<NameId> {
        match self.by_str.get(s.index()) {
            Some(&id) if id != NO_NAME => Some(id),
            _ => self.id(dast.strings.get(s)),
        }
    }

    /// What name `id` names from `scope` of template `t`.
    pub(in crate::compile) fn at_id(&self, t: TemplateId, scope: ElemId, id: NameId) -> NameHit {
        match self.entry(t, scope, id) {
            None => NameHit::None,
            Some(AMBIGUOUS) => NameHit::Ambiguous,
            Some(e) => NameHit::One(e),
        }
    }

    /// The entry for name `id` at `scope` of template `t`: an element, or
    /// `AMBIGUOUS`.
    pub(in crate::compile) fn entry(
        &self,
        t: TemplateId,
        scope: ElemId,
        id: NameId,
    ) -> Option<ElemId> {
        self.by_scope.get(&(t, scope, id)).copied()
    }

    /// What `name` names from `scope` of template `t`: the one descendant
    /// carrying it, or that several do.
    pub(in crate::compile) fn at(&self, t: TemplateId, scope: ElemId, name: &str) -> NameHit {
        match self.id(name).and_then(|id| self.entry(t, scope, id)) {
            None => NameHit::None,
            Some(AMBIGUOUS) => NameHit::Ambiguous,
            Some(e) => NameHit::One(e),
        }
    }
}

/// What a name names from a scope.
pub(in crate::compile) enum NameHit {
    None,
    One(ElemId),
    Ambiguous,
}

impl Compiler<'_> {
    /// What `name` names from `scope` of template `t`: the one descendant
    /// carrying it, or that several do.
    pub(in crate::compile) fn name_at(&self, t: TemplateId, scope: ElemId, name: &str) -> NameHit {
        self.names().at(t, scope, name)
    }
}
