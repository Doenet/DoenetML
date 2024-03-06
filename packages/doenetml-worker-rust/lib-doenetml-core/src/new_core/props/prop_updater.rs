use thiserror::Error;

use crate::components::prelude::DataQuery;

use super::{data_query::DataQueryResult, PropValue};

/// The possible results of a call to `calculate`:
/// - `Calculated(val)`: the value was calculated to be `val`
/// - `FromDefault(val)`: the value `val` was determined from the default value
/// - `NoChange`: the value did not change, so just mark it as fresh
#[derive(Debug)]
pub enum PropCalcResult<T: Clone> {
    Calculated(T),
    FromDefault(T),
    NoChange,
}

#[derive(Debug, Error)]
pub enum InvertError {
    #[error("invert is not implemented")]
    NotImplemented,
    #[error("could not invert")]
    CouldNotUpdate,
}

/// Implemented by all Props. Specifies how a prop is computed and what data it needs to compute its value.
pub trait PropUpdater: std::fmt::Debug {
    /// The default value used when creating a state prop for this prop
    /// using a `State` data query
    fn default(&self) -> PropValue {
        PropValue::Boolean(false)
    }

    /// Returns the data queries needed to calculate the dependencies
    /// for this prop. These queries may be based on structure of the document,
    /// e.g., the children, attributes, or other props
    /// of the component of this prop.
    fn data_queries(&self) -> Vec<DataQuery>;

    /// Calculate the value of the prop from the passed in `data`.
    /// Results of this function will be cached, so local caching is not needed.
    fn calculate(&self, data: Vec<DataQueryResult>) -> PropCalcResult<PropValue>;

    /// All props know how to calculate their value given their dependencies.
    /// Sometimes a prop is requested to take on a particular value. If the
    /// prop has dependencies, these dependencies must change in order for the
    /// prop to take on the target value.
    ///
    /// This function returns a list of update requests for the prop's dependencies
    /// that, if set on the dependencies, will cause the prop to take on the
    /// desired value.
    ///
    /// An `Err` is returned if an effective combination of updates cannot be found.
    ///
    /// The `is_direct_change_from_action` argument is true if the requested value
    /// came directly from an action (as opposed to coming from another prop requesting
    /// a change).
    #[allow(unused)]
    fn invert(
        &self,
        data: Vec<DataQueryResult>,
        requested_value: PropValue,
        is_direct_change_from_action: bool,
    ) -> Result<Vec<Option<PropValue>>, InvertError> {
        Err(InvertError::NotImplemented)
    }
}
