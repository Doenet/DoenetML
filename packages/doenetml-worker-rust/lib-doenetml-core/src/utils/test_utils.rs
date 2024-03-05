use crate::dependency::DependencySource;

/// Create a mutable view of a prop along with a read only view
pub fn create_prop_views<T: Default + Clone>(
    value: T,
    came_from_default: bool,
) -> (PropViewMut<T>, PropView<T>) {
    let mutable_view = PropViewMut::new_with_value(value, came_from_default);
    let view = mutable_view.create_new_read_only_view();
    (mutable_view, view)
}

pub fn create_prop_dependency<T: Default + Clone>(
    initial_value: T,
    came_from_default: bool,
) -> (Dependency, PropViewMut<T>)
where
    // make sure T is one of the types that we can convert from PropView<T> into PropViewEnum
    PropViewEnum: From<PropView<T>>,
{
    let (prop, prop_view) = create_prop_views(initial_value, came_from_default);

    let dependency_source = DependencySource::Prop {
        component_idx: 0,
        prop_idx: 0,
    };

    let dependency = Dependency {
        source: dependency_source,
        value: prop_view.into(),
    };

    (dependency, prop)
}
