use crate::{
    components::prelude::{Dependency, StateVarMutableView, StateVarView, StateVarViewEnum},
    dependency::DependencySource,
};

/// Create a mutable view of a state variable along with a read only view
pub fn create_state_var_views<T: Default + Clone>(
    value: T,
    came_from_default: bool,
) -> (StateVarMutableView<T>, StateVarView<T>) {
    let mutable_view = StateVarMutableView::new_with_value(value, came_from_default);
    let view = mutable_view.create_new_read_only_view();
    (mutable_view, view)
}

pub fn create_state_var_dependency<T: Default + Clone>(
    initial_value: T,
    came_from_default: bool,
) -> (Dependency, StateVarMutableView<T>)
where
    // make sure T is one of the types that we can convert from StateVarView<T> into StateVarViewEnum
    StateVarViewEnum: From<StateVarView<T>>,
{
    let (state_var, state_var_view) = create_state_var_views(initial_value, came_from_default);

    let dependency_source = DependencySource::StateVar {
        component_idx: 0,
        state_var_idx: 0,
    };

    let dependency = Dependency {
        source: dependency_source,
        value: state_var_view.into(),
    };

    (dependency, state_var)
}
