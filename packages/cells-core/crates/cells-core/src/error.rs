use thiserror::Error;

#[derive(Debug, Error)]
pub enum Error {
    #[error("invalid DAST JSON: {0}")]
    Json(#[from] serde_json::Error),
    #[error("invalid binary DAST: {0}")]
    WireFormat(String),
    #[error("unsupported tag <{0}>")]
    UnsupportedTag(String),
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
        "extend=\"${referent}\" is a <{referent_type}> but the element is a <{component_type}>"
    )]
    ExtendTypeMismatch {
        referent: String,
        referent_type: String,
        component_type: String,
    },
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
    #[error("<op> attribute '{0}' must be a literal number")]
    BadLiteralParam(String),
    #[error("unknown <op> kind '{0}'")]
    UnknownOp(String),
    #[error("<op kind=\"{kind}\"> takes {expected} argument(s), got {got}")]
    OpArity {
        kind: String,
        expected: usize,
        got: usize,
    },
    #[error("<op kind=\"{kind}\"> is missing attribute '{attr}'")]
    MissingParam { kind: String, attr: String },
    #[error("<op> args must be references only; literal arguments are not supported")]
    LiteralArg,
    #[error("dependency cycle involving component '{0}'")]
    Cycle(String),
    #[error(
        "index in '${0}' is not a constant: only literal integers and iteration index names (plus or minus a literal) are supported"
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
    #[error("document structure did not settle after {0} rebuilds")]
    UnstableStructure(usize),
    #[error("cannot parse math '{text}': {reason}")]
    BadMath { text: String, reason: String },
    #[error("unsupported: {0}")]
    Unsupported(String),
    #[error("not allowed (ADR 0009): {0}")]
    Banned(String),
    #[error("'{name}' is not in the branch interface of '{choice}': {reason}")]
    NotInInterface {
        choice: String,
        name: String,
        reason: String,
    },
}

pub type Result<T> = std::result::Result<T, Error>;
