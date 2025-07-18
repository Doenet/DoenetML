use crate::core::props::PropValueType;

/// A trait to be implemented on each component variant. This allows asking for the type
/// of each prop without an instance of the component. It is primarily implemented by macros.
pub trait ComponentVariantPropTypes {
    /// A list of the `PropValueType` for each prop in the component,
    /// ordered by local prop index.
    const PROP_VALUE_TYPES: &'static [PropValueType];

    /// The name of the component.
    const COMPONENT_NAME: &'static str;
}
