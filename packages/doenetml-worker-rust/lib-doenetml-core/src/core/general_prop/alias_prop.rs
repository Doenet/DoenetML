use crate::components::prelude::*;

/// A struct of all data required to compute the value of this prop.
#[add_dependency_data]
#[derive(Debug, Default, PropDependencies, PropDataQueries)]
pub struct RequiredData<T>
where
    T: Default + Clone,
{
    aliased_value: PropView<T>,
}

/// A prop that aliases another prop from the same component.
///
/// The prop takes on the value of this other prop,
/// and when inverting, requests that the value of this other variable be changed.
///
/// Constructor:
/// - `new(aliased_prop_idx)`: create a prop that aliases
///   the variable with the index `aliased_prop_idx`.
#[derive(Debug, Default)]
pub struct PropAlias {
    aliased_prop_idx: LocalPropIdx,
}

impl PropAlias {
    /// Create a prop that aliases
    /// the variable with the index `aliased_prop_idx`.
    pub fn new(aliased_prop_idx: LocalPropIdx) -> Self {
        PropAlias { aliased_prop_idx }
    }
}

impl<T> PropUpdater<T, RequiredData<T>> for PropAlias
where
    T: Default + Clone + std::fmt::Debug,
    PropView<T>: TryFromProp<PropViewEnum>,
    <PropView<T> as TryFromProp<PropViewEnum>>::Error: std::fmt::Debug,
{
    fn return_data_queries(&self) -> Vec<DataQuery> {
        RequiredDataQueries {
            aliased_value: DataQuery::Prop {
                component_idx: None,
                prop_idx: self.aliased_prop_idx,
            },
        }
        .into()
    }

    fn calculate_old(&mut self, data: &RequiredData<T>) -> PropCalcResult<T> {
        // take on the value from `aliased_value`, propagating `came_from_default`.
        if data.aliased_value.came_from_default() {
            PropCalcResult::FromDefault(data.aliased_value.get().clone())
        } else {
            PropCalcResult::Calculated(data.aliased_value.get().clone())
        }
    }

    fn invert(
        &self,
        data: &mut RequiredData<T>,
        prop: &PropView<T>,
        _is_direct_change_from_action: bool,
    ) -> Result<Vec<DependencyValueUpdateRequest>, InvertError> {
        data.aliased_value
            .queue_update(prop.get_requested_value().clone());

        Ok(data.queued_updates())
    }
}

#[cfg(test)]
#[path = "alias_prop.test.rs"]
mod tests;
