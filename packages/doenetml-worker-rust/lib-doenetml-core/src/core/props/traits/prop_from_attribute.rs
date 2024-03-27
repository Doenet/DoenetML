use crate::props::{PropUpdater, PropUpdaterUntyped, UpdaterObject};

/// Trait for creating a prop from an attribute. This is mainly used for
/// general props.
pub trait PropFromAttribute<T> {
    /// Create an instance of `Self` that references the attribute `attr_name`
    /// to get its value. If the attribute is not present, `default` is used.
    fn new_from_attribute(attr_name: &'static str, default: T) -> Self;
}

/// Create a prop from an attribute variant. This is meant to be implemented on
/// a component's `Attributes` enum.
pub trait PropFromAttributeVariant {
    /// Create a trait object instance of `PropUpdater`. The resulting prop will reference the value of
    /// the corresponding attribute. For example `MyAttributes::Foo.prop()` creates a prop
    /// that references the `"foo"` attribute.
    fn get_prop_updater_object(&self) -> UpdaterObject;

    /// Get the `PropUpdater` (with type information).
    fn get_prop_updater<T: PropUpdater + PropUpdaterUntyped>(&self) -> T {
        unimplemented!()
    }
}
