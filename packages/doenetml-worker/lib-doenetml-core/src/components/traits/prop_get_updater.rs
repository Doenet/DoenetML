use crate::props::UpdaterObject;

/// Trait to be implemented on the `Props` **enum** of a component.
///
/// e.g.
/// ```ignore
/// enum Props {
///   Foo,
///   Bar,
/// }
///
/// impl PropGetUpdater for Props {
///   fn get_updater(&self) -> UpdaterObject {
///     match self {
///       Props::Foo => StringProp::new_from_children("".to_string()).into_updater(),
///       Props::Bar => StringProp::new_from_children("".to_string()).into_updater(),
///     }
///   }
/// }
/// ```
pub trait PropGetUpdater {
    /// Get the updater for a specific prop on a Props enum.
    fn get_updater(&self) -> UpdaterObject;
}

/// A function that asserts, at compile time, that a type implements `PropGetUpdater`.
///
/// Usage:
/// ```ignore
/// let x = Props::Foo;
/// assert_has_prop_get_updater(x);
/// ```
pub fn assert_has_prop_get_updater<T: PropGetUpdater>(_: T) {}
