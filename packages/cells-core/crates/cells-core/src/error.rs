use std::sync::Arc;

use thiserror::Error;

/// An error the core reports.
#[derive(Debug, Clone, Error)]
pub enum Error {
    /// The DAST JSON handed to the core does not parse or has the wrong shape.
    #[error("invalid DAST JSON: {0}")]
    Json(#[source] Arc<serde_json::Error>),
    /// The bytes handed to the core are malformed binary DAST, or are not UTF-8.
    #[error("invalid binary DAST: {0}")]
    WireFormat(String),
    /// The source uses a tag (or `<division type>`) this core has no component for.
    #[error("unsupported tag <{0}>")]
    UnsupportedTag(String),
    /// An element carries an attribute that nothing in the core reads, and that
    /// is not presentation.
    #[error(
        "attribute '{attr}' is not supported on <{tag}> in this core: nothing reads it, so it would be ignored"
    )]
    UnsupportedAttribute {
        /// The element's tag.
        tag: String,
        /// The attribute nothing reads.
        attr: String,
    },
    /// Two siblings in one name scope carry the same `name`.
    #[error("duplicate name '{0}'")]
    DuplicateName(String),
    /// A reference's name matches several components visible where it stands.
    #[error("reference '${0}' is ambiguous: several components with that name are visible")]
    AmbiguousName(String),
    /// A reference names no component visible from where it stands.
    #[error("unknown reference '${0}'")]
    UnknownName(String),
    /// A reference `$name.prop` names a prop the component's type does not have.
    #[error("component '{name}' has no prop '{prop}'")]
    UnknownProp {
        /// The component the reference names.
        name: String,
        /// The prop it lacks.
        prop: String,
    },
    /// A reference path goes past `$name.prop` (or past what an index allows).
    #[error("reference path '${0}' is too deep; only $name and $name.prop are supported")]
    PathTooDeep(String),
    /// A bare `$name` is read as a value, but its type has no default prop.
    #[error("'{0}' has no default prop, so a bare reference to it cannot supply a value")]
    NoDefaultProp(String),
    /// A reference copies a component whose type cannot be copied.
    #[error("cannot copy a <{0}>")]
    UncopyableType(String),
    /// An element's `extend` names a component of an unrelated type.
    #[error(
        "cannot extend a <{referent_type}> (extend=\"${referent}\") as a <{component_type}>: only related types may differ (a number and a math, an input and its value type)"
    )]
    ExtendTypeMismatch {
        /// The `extend` reference.
        referent: String,
        /// The tag of the component it names.
        referent_type: String,
        /// The tag of the extending element.
        component_type: String,
    },
    /// A reference names a component boxed by an error of its own, so the reader
    /// is boxed too (ADR 0027).
    #[error("'${0}' names a component with an error of its own, so this cannot be planned from it")]
    BoxedReferent(String),
    /// A reference supplies a prop with a different number of cells than the prop
    /// takes.
    #[error(
        "prop '{prop}' of <{component_type}> expects {expected} cell(s) but the reference supplies {got}"
    )]
    ArityMismatch {
        /// The tag of the component whose prop is supplied.
        component_type: String,
        /// The prop.
        prop: String,
        /// The cells the prop takes.
        expected: usize,
        /// The cells the reference supplies.
        got: usize,
    },
    /// An attribute that takes a number holds neither a number nor a single
    /// reference, or a number out of its range.
    #[error(
        "attribute '{attr}' must be a number or a single reference, got '{text}' (math expressions are out of scope)"
    )]
    BadValue {
        /// The attribute.
        attr: String,
        /// Its text, or the value it came to.
        text: String,
    },
    /// A `<constrainToGrid>` parameter that must be a literal number is not one.
    #[error("attribute '{0}' must be a literal number")]
    BadLiteralParam(String),
    /// Values depend on each other in a loop, at load or in a later build.
    #[error("dependency cycle involving component '{0}'")]
    Cycle(String),
    /// A reference's index has a form the core cannot plan.
    #[error(
        "index in '${0}' is not supported: a repeat, collect or point list takes a literal integer, an iteration index name (plus or minus a literal) or one reference to a cell; anything else takes a literal integer or an iteration index name"
    )]
    DynamicIndex(String),
    /// A reference's index does not parse, or is out of range for what it
    /// indexes.
    #[error("bad index in '${0}'")]
    BadIndex(String),
    /// A reference indexes a component that is neither a repeat nor a collect.
    #[error("'${0}' cannot be indexed; only repeats and collects can")]
    NotIndexable(String),
    /// A reference names one iteration of a repeat whose template has several
    /// component children, without naming which.
    #[error("'${0}' names an iteration with {1} component children, so it needs a child name")]
    AmbiguousIteration(String, usize),
    /// A `<collect>`'s `componentType` is not a known tag.
    #[error("<collect> componentType '{0}' is not a known tag")]
    BadCollectType(String),
    /// A `<collect>` lacks its `from` reference or its `componentType`.
    #[error("<collect> needs a 'from' reference and a 'componentType'")]
    BadCollect,
    /// Math text in the source, or typed into a `<mathInput>`, does not parse or
    /// has the wrong number of entries.
    #[error("cannot parse math '{text}': {reason}")]
    BadMath {
        /// The math text.
        text: String,
        /// Why it does not parse.
        reason: String,
    },
    /// The source (or saved state) uses something this core does not implement,
    /// such as a tuple too long or a `<selectFromSequence>` of letters.
    #[error("unsupported: {0}")]
    Unsupported(String),
    /// Saved state handed to the core was written by another core release.
    #[error("saved state from core release {saved} cannot be restored by release {core}")]
    OtherRelease {
        /// The release that wrote the state.
        saved: String,
        /// This core's release.
        core: String,
    },
    /// The source uses a form the core forbids by design, such as copying a whole
    /// `<select>` or an index after an interface name.
    #[error("not allowed: {0}")]
    Banned(String),
    /// A build after the load hit an error the load's checks should have caught
    /// (a core bug).
    #[error(
        "a build after the load found an error the load did not report, which the core must never let happen: {0}"
    )]
    Unchecked(String),
    /// Compiling planned an element it then cannot build (a core bug).
    #[error("the core planned an element it cannot build (a core bug): {0}")]
    Internal(String),
    /// A reference reached a container copy whose clones outlining has not
    /// made yet. Never reported, but as a core bug.
    #[error("a container copy's clones were read before outlining made them (a core bug)")]
    AwaitsClones {
        /// The template that holds the container copy.
        template: u32,
        /// The container copy's element in that template.
        elem: u32,
    },
    /// A load-time choice reads a value a student can change (ADR 0037).
    #[error(
        "<{tag} {attr}=\"{text}\">: a load-time choice may read only values no student can change, and {reason}"
    )]
    ChoiceNotConstant {
        /// The choice's tag.
        tag: String,
        /// The attribute that makes the choice.
        attr: String,
        /// The attribute's text.
        text: String,
        /// What it reads that a student can change.
        reason: String,
    },
    /// A load-time choice that some draw or some scope could not make
    /// (ADR 0014, ADR 0037).
    #[error("<{tag}>: {reason}")]
    ChoiceDomain {
        /// The choice's tag.
        tag: String,
        /// Why the choice cannot be made.
        reason: String,
    },
    /// A reference uses an interface name of a `<select>` or
    /// `<conditionalContent>` that not every branch has, with one type.
    #[error("'{name}' is not in the branch interface of '{choice}': {reason}")]
    NotInInterface {
        /// The choice, as labelled for authors.
        choice: String,
        /// The interface name.
        name: String,
        /// Which branch lacks it, or gives it another type.
        reason: String,
    },
}

/// The core's result type, failing with [`enum@Error`].
pub type Result<T> = std::result::Result<T, Error>;

impl From<serde_json::Error> for Error {
    fn from(e: serde_json::Error) -> Error {
        Error::Json(Arc::new(e))
    }
}
