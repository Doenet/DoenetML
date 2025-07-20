use enum_dispatch::enum_dispatch;

use crate::components::ComponentEnum;
use crate::components::types::AttributeName;

use crate::core::props::PropDefinition;

/// The ComponentAttributes trait can be derived for a component,
/// giving it the default implementation of ignoring all attributes.
/// To add attributes to be processed by core, a component type can implement the trait.
#[enum_dispatch]
pub trait ComponentAttributes {
    /// Return a list of the attribute names that the component will accept
    fn get_attribute_names(&self) -> Vec<AttributeName> {
        // TODO: add default attribute names, like hide and disabled?
        // If so, should provide a mechanism for including default props depending on them.
        vec![]
    }

    /// In some attributes, references should not be expanded into components, but
    /// should instead keep the data they have about their referent.
    /// This function returns the (local) indices of the attributes whose references should be preserved.
    fn get_preserve_ref_attribute_indices(&self) -> &[usize] {
        &[]
    }
}

/// Trait that creates props from attribute variants.
/// For example, if implemented on the enum `Attrs`
///
/// ```rust
/// enum Attrs {
///   Prefill,
///   Disabled,
/// }
/// ```
/// one can call `Attrs::Prefill.prop()` to get a prop that will query the `"prefill"`
/// attribute of a component.
///
/// An implementation might look like
/// ```ignore
/// impl AttributeProp<String> for Attrs {
///   fn prop(&self) -> Prop<String> {
///     match self {
///       Attrs::Prefill => StringProp::new_from_attribute("prefill", "").into_prop(),
///       _ => panic!("This attribute does not have a string prop."),
///     }
///   }
/// }
/// impl AttributeProp<bool> for Attrs {
///   fn prop(&self) -> Prop<bool> {
///     match self {
///       Attrs::Disabled => BooleanProp::new_from_attribute("disabled", false).into_prop(),
///       _ => panic!("This attribute does not have a boolean prop."),
///     }
///   }
/// }
/// ```
pub trait AttributeProp<T: Default + Clone> {
    /// Get a prop whose value is determined by the attribute.
    fn prop(&self) -> PropDefinition;
}
