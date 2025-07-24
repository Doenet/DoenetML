use super::FromPropWithMeta;

/// Trait to convert into a typed `PropView`.
/// We need our own trait because Rust will not allow implementing `Into`
/// on a `Vec<PropWithMeta>` to a `Vec<PropView<T>>`.
pub trait IntoPropView<Out> {
    /// Convert the object into a `PropView`-like object.
    fn into_prop_view(self) -> Out;

    fn try_into_prop_view(self) -> anyhow::Result<Out>;
}

/// Blanked implementation of `IntoPropView` for items with `FromPropViewWithMeta`
impl<Target, Item> IntoPropView<Target> for Item
where
    Target: FromPropWithMeta<Item, Target>,
{
    fn into_prop_view(self) -> Target {
        Target::from_prop_with_meta(self)
    }

    fn try_into_prop_view(self) -> anyhow::Result<Target> {
        Target::try_from_prop_with_meta(self)
    }
}
