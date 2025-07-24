use crate::props::{DataQuery, DataQueryResults};

/// A trait for converting `DataQueryResults` into the custom `RequiredData`
/// types as used in the `calculate(...)` functions.
pub trait TryFromDataQueryResults {
    /// Get a vector of `DataQuery` objects. The order of this vector is important.
    /// The order here corresponds to the order that data will be unpacked in the
    /// `try_from_data_query_results` function.
    fn to_data_queries() -> Vec<DataQuery>;

    /// Convert the `DataQueryResults` into `Self`. This function assumes that
    /// `data` is a result of executing the queries coming from `to_data_queries()`
    /// in the same _order_ as listed by `to_data_queries()`.
    fn try_from_data_query_results(data: DataQueryResults) -> anyhow::Result<Self>
    where
        Self: Sized;

    /// Create a new instance of `Self` with all metadata reset.
    /// This is useful when deciding what props to change for an `invert` operation.
    fn try_new_desired(data: &DataQueryResults) -> anyhow::Result<Self>
    where
        Self: Sized,
    {
        Self::try_from_data_query_results(data.clone().with_reset_meta())
    }
}
