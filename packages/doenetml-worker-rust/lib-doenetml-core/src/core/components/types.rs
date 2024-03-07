/// The local index of a prop relative to the component to which it belongs.
pub type PropIdx = usize;

/// The index of the component in `Core.components`
#[cfg_attr(feature = "web", tsify::declare)]
pub type ComponentIdx = usize;

/// Information of the source that a component is extending, which is currently
/// either another component or a prop.
#[derive(Debug, Clone)]
pub enum Extending {
    /// The component is extending another entire component, given by the component index
    Component(ComponentIdx),
    // TODO: what about array props?
    /// The component is extending the prop of another component
    Prop(PropSource),
}

#[derive(Debug, Clone, Copy)]
pub struct PropSource {
    /// The prop being extended
    pub prop_pointer: PropPointer,

    /// If true, the source of the extending was due to a direct reference,
    /// as opposed to being in an extend attribute.
    ///
    /// For example, given `<textInput name="i"/>`, a direct ref would be `$i.value` by itself,
    /// unlike `<text extend="$i.value"/>`.
    ///
    /// If we are extending from a direct ref,
    /// we need to add the referenced prop as a child in the `DataQuery::ChildPropProfile`,
    /// because the prop was not already added to the children.
    pub from_direct_ref: bool,
}

/// Pointer to a component's prop
#[derive(Debug, Clone, Copy)]
pub struct PropPointer {
    /// The index of the component in `Core.components`
    pub component_idx: ComponentIdx,
    /// The local index of the prop relative to the component to which
    /// it belongs. This is _not_ the offset of the prop in `Core.props`.
    pub local_prop_idx: PropIdx,
}