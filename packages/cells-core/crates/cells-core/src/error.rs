use std::sync::Arc;

use thiserror::Error;

/// Cloneable, so a stage's result can hold an error for every reader of
/// it to report (a `<math>`'s parse, ADR 0030).
#[derive(Debug, Clone, Error)]
pub enum Error {
    #[error("invalid DAST JSON: {0}")]
    Json(#[source] Arc<serde_json::Error>),
    #[error("invalid binary DAST: {0}")]
    WireFormat(String),
    #[error("unsupported tag <{0}>")]
    UnsupportedTag(String),
    #[error(
        "attribute '{attr}' is not supported on <{tag}> in this core: nothing reads it, so it would be ignored"
    )]
    UnsupportedAttribute { tag: String, attr: String },
    #[error("duplicate name '{0}'")]
    DuplicateName(String),
    #[error("reference '${0}' is ambiguous: several components with that name are visible")]
    AmbiguousName(String),
    #[error("unknown reference '${0}'")]
    UnknownName(String),
    #[error("component '{name}' has no prop '{prop}'")]
    UnknownProp { name: String, prop: String },
    #[error("reference path '${0}' is too deep; only $name and $name.prop are supported")]
    PathTooDeep(String),
    #[error("'{0}' has no default prop, so a bare reference to it cannot supply a value")]
    NoDefaultProp(String),
    #[error("cannot copy a <{0}>")]
    UncopyableType(String),
    #[error(
        "cannot extend a <{referent_type}> (extend=\"${referent}\") as a <{component_type}>: only related types may differ (a number and a math, an input and its value type)"
    )]
    ExtendTypeMismatch {
        referent: String,
        referent_type: String,
        component_type: String,
    },
    #[error("'${0}' names a component with an error of its own, so this cannot be planned from it")]
    BoxedReferent(String),
    #[error(
        "prop '{prop}' of <{component_type}> expects {expected} cell(s) but the reference supplies {got}"
    )]
    ArityMismatch {
        component_type: String,
        prop: String,
        expected: usize,
        got: usize,
    },
    #[error(
        "attribute '{attr}' must be a number or a single reference, got '{text}' (math expressions are out of scope)"
    )]
    BadValue { attr: String, text: String },
    #[error("attribute '{0}' must be a literal number")]
    BadLiteralParam(String),
    #[error("dependency cycle involving component '{0}'")]
    Cycle(String),
    #[error(
        "index in '${0}' is not supported: a repeat, collect or point list takes a literal integer, an iteration index name (plus or minus a literal) or one reference to a cell; anything else takes a literal integer or an iteration index name"
    )]
    DynamicIndex(String),
    #[error("bad index in '${0}'")]
    BadIndex(String),
    #[error("'${0}' cannot be indexed; only repeats and collects can")]
    NotIndexable(String),
    #[error("'${0}' names an iteration with {1} component children, so it needs a child name")]
    AmbiguousIteration(String, usize),
    #[error("<collect> componentType '{0}' is not a known tag")]
    BadCollectType(String),
    #[error("<collect> needs a 'from' reference and a 'componentType'")]
    BadCollect,
    #[error("cannot parse math '{text}': {reason}")]
    BadMath { text: String, reason: String },
    #[error("unsupported: {0}")]
    Unsupported(String),
    #[error(
        "saved state from core release {saved} cannot be restored by release {core} (ADR 0017)"
    )]
    OtherRelease { saved: String, core: String },
    #[error("not allowed (ADR 0009): {0}")]
    Banned(String),
    #[error(
        "a build after the load found an error the load did not report, which the core must never let happen (ADR 0014): {0}"
    )]
    Unchecked(String),
    #[error("the core planned an element it cannot build (a core bug): {0}")]
    Internal(String),
    /// A reference reached a container copy whose clones outlining has not
    /// made yet (ADR 0031): outlining makes them and plans the reference
    /// again (`with_clones`). Never reported, but as a core bug.
    #[error("a container copy's clones were read before outlining made them (a core bug)")]
    AwaitsClones { template: u32, elem: u32 },
    #[error("'{name}' is not in the branch interface of '{choice}': {reason}")]
    NotInInterface {
        choice: String,
        name: String,
        reason: String,
    },
}

pub type Result<T> = std::result::Result<T, Error>;

impl From<serde_json::Error> for Error {
    fn from(e: serde_json::Error) -> Error {
        Error::Json(Arc::new(e))
    }
}
