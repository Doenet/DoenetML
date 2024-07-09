use super::PropValueType;

/// A `PropProfile` is used in a `DataQuery` to match a particular type of prop.
/// It can be used to filter components based on the presence of a prop with the `PropProfile`
/// or to return the value of the prop that matches the `PropProfile`.
///
/// A `PropProfile` is assigned to a prop by the `profile` attribute.
/// A prop can have only one `PropProfile`.
///
/// A prop with a particular `PropProfile` must be of a particular type.
/// TODO - this is currently not implemented.
/// Where do we specify this and how do we enforce it? Presumably in this `enum`.
/// (Right now, the type can be inferred from the `default()` function.)
/// If you specify the `profile` of a prop, should you no longer be able to specify the `value_type` attribute
/// as it is inferred from the `profile`?
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum PropProfile {
    /// Matches String props as well as literal string children
    String,
    /// Matches literal string children. Use if wish to exclude String props.
    /// Use the `String` variant to also match string props.
    /// TODO - how do we prevent props from being given the `PropProfile`?
    /// We haven't yet used `LiteralString` without also including `String`,
    /// but there are probably going to be cases where we want to restrict to literal strings?
    LiteralString,
    /// Matches Number props
    Number,
    /// Matches Math props
    Math,
    /// Matches Integer props
    Integer,
    /// Matches Boolean props
    Boolean,
    /// Matches the hidden prop
    Hidden,
    /// Matches the fixed prop
    Fixed,
    /// Matches the SerialNumber prop
    SerialNumber,
    /// Matches the DivisionCodeNumber prop
    DivisionCodeNumber,
    /// Matches a prop that indicates the depth of a division in a hierarchy of divisions. E.g.,
    /// how many levels deep a `<section>` is nested.
    DivisionDepth,
    /// Matches a prop that indicates the type of a division. E.g., `<section>`, `<chapter>`, etc.
    DivisionType,
    /// Matches a prop that indicates the depth of a list in a hierarchy of lists. E.g.,
    /// how many levels deep a `<ol>` is nested.
    ListDepth,
    /// Matches a prop that indicates on which number a list start start indexing from.
    ListStartIndex,
    /// Matches a prop that indicates the marker to be used for list items in a list.
    ListMarker,
    /// Matches a prop that indicates the code number of a list item. I.e., its fully-specified (local) name, like `4.a.ii`.
    ListCodeNumber,
    /// Matches a prop that can be rendered (i.e., contains a `ComponentRef` but is not `RenderedChildren`.
    /// This is used on props like `<section>.title` which contain references to content but are not themselves used for
    /// rendering children.)
    Renderable,
    /// Matches the RenderedChildren prop
    RenderedChildren,
    /// Matches a prop that stores a reference to another component.
    _Ref,
    /// Matches a prop that stores whether or not to split multi-characters symbols that don't contain numbers
    /// into the product of their characters when parsing into mathematics
    SplitSymbols,
    /// Matches a prop that stores a label suitable for a text-only reference to the component.
    XrefLabel,
    /// Matches a prop that stores `ContentRefs` to any content that should be "expanded" when an xref is clicked.
    XrefDisplayContent,
}

/// Returns the value type that corresponds to each `PropProfile`.
/// This function must be `const` so that it can be used for compile-time type checking.
pub const fn prop_profile_to_type(profile: PropProfile) -> PropValueType {
    match profile {
        PropProfile::String => PropValueType::String,
        PropProfile::LiteralString => PropValueType::String,
        PropProfile::Number => PropValueType::Number,
        PropProfile::Math => PropValueType::Math,
        PropProfile::Integer => PropValueType::Integer,
        PropProfile::Boolean => PropValueType::Boolean,
        PropProfile::Hidden => PropValueType::Boolean,
        PropProfile::Fixed => PropValueType::Boolean,
        PropProfile::SerialNumber => PropValueType::Integer,
        PropProfile::DivisionCodeNumber => PropValueType::String,
        PropProfile::DivisionDepth => PropValueType::Integer,
        PropProfile::DivisionType => PropValueType::DivisionType,
        PropProfile::ListDepth => PropValueType::ListDepth,
        PropProfile::ListStartIndex => PropValueType::Integer,
        PropProfile::ListMarker => PropValueType::ListMarker,
        PropProfile::ListCodeNumber => PropValueType::String,
        PropProfile::Renderable => PropValueType::ComponentRef,
        PropProfile::RenderedChildren => PropValueType::AnnotatedContentRefs,
        PropProfile::SplitSymbols => super::PropValueType::Boolean,
        PropProfile::_Ref => PropValueType::ComponentRef,
        PropProfile::XrefLabel => PropValueType::XrefLabel,
        PropProfile::XrefDisplayContent => PropValueType::AnnotatedContentRefs,
    }
}
