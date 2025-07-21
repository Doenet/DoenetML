use enum_dispatch::enum_dispatch;

use crate::{
    components::{ComponentEnum, types::LocalPropIdx},
    props::PropProfile,
};

/// The Component trait specifies methods that will, in general, be implemented by deriving them.
/// It depends on the ComponentProps trait, which will be derived
/// for each component type based on its prop structure.
#[enum_dispatch]
pub trait ComponentNode {
    /// Get the component type, which is the name of the component's struct
    /// converted to camel case.
    fn get_component_type(&self) -> &str;

    /// The name of the component that a direct reference should transmute to.
    /// For example in `<textInput name="i"/>$i`, the `$i` should be rendered as a `<text extend="$i"/>`
    /// rather than a `<textInput extend="$i"/>`. In this case `self.ref_transmutes_to()` should return `Some("Text")`.
    ///
    /// If `None` is returned, no transmutation will occur.
    fn ref_transmutes_to(&self) -> Option<&'static str> {
        None
    }

    /// If `extend_via_default_prop` is `true` and the component is extended by a different component type,
    /// then the component will be extended via the prop that is marked with `#[default_prop]`.
    /// Otherwise, the component will always be extended directly as a component
    /// whenever a prop is not explicitly specified,
    /// even if it is extended by a different component type.
    ///
    /// For example, since `extend_via_default_prop()` returns `true` for a text input,
    /// and its default prop is 'value`,
    /// `<textInput name="$i" /><text extend="$i" />` will become equivalent to
    /// `<textInput name="$i" /><text extend="$i.value" />`
    fn extend_via_default_prop(&self) -> bool {
        false
    }

    /// A vector of the possible profiles this component provides along with the
    /// index of the prop that you should refer to if you want data satisfying
    /// that profile.
    fn provided_profiles(&self) -> Vec<(PropProfile, LocalPropIdx)> {
        // This is automatically implemented for `Component` from `ComponentVariantProps`
        // so it doesn't actually need to be implemented on each variant.
        // This impl is kept here so that `Component` and each component variant
        // can have the same traits
        panic!("Not implemented. `provided_profiles` is automatically implemented on `Component`")
    }
}
