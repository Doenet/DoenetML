use crate::props::DataQueryResults;

/// A trait for converting `RequiredData` types into `DataQueryResults`.
pub trait IntoDataQueryResults {
    /// Convert the object into a `DataQueryResults`.
    fn into_data_query_results(self) -> DataQueryResults;
}
