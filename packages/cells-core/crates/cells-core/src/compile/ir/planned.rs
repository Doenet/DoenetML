//! What planning hands on to linking, sealing and sharing ([`Planned`]):
//! the reads it recorded, the given leaves copies share, and the extends
//! whose referent is in another template.

use crate::compile::*;

/// What planning makes for linking and sealing, beside the plans
/// themselves in the templates.
#[derive(Default)]
pub(in crate::compile) struct Planned {
    /// What copies share of their referents' given leaves.
    pub(in crate::compile) shares: Vec<Share>,
    /// By (template, element), which port holds each given leaf of an
    /// element planned by a `Plan` type's planner, by what gave it.
    pub(in crate::compile) given: HashMap<(TemplateId, ElemId), HashMap<GivenId, Port>>,
    /// Every read recorded, outlining's and planning's: an element whose
    /// plan read the type of what a reference names.
    pub(in crate::compile) reads: Vec<Read>,
    /// The extends whose referent is in another template.
    pub(in crate::compile) paths: Vec<PathExtend>,
}

/// A given leaf copy `e` shares with its referent: port `port` of the copy
/// is to alias the referent's port holding the leaf `id` gave. The referent
/// is an element of the same template, or reached by a path from `e`'s.
pub(in crate::compile) struct Share {
    pub(in crate::compile) t: TemplateId,
    pub(in crate::compile) e: ElemId,
    pub(in crate::compile) port: Port,
    pub(in crate::compile) referent: Referent,
    pub(in crate::compile) id: GivenId,
}

/// What an extend names: an element of the copy's template, or a path to
/// one in another.
#[derive(Clone, Copy)]
pub(in crate::compile) enum Referent {
    Here(ElemId),
    Path(RefId, TemplateId, ElemId),
}

/// An extend whose referent is in another template: an element of template
/// `t` extending element `re` of template `rt` through reference `path`.
#[derive(Debug, Clone, Copy)]
pub(in crate::compile) struct PathExtend {
    pub(in crate::compile) t: TemplateId,
    pub(in crate::compile) path: RefId,
    pub(in crate::compile) rt: TemplateId,
    pub(in crate::compile) re: ElemId,
}
