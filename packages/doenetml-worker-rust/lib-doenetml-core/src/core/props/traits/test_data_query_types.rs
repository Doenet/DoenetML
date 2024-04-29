use crate::{components::ComponentVariantPropTypes, props::PropValueType};

use super::TryFromDataQueryResults;

/// This trait implements functions needed to test the types of a `DataQueryResults` object.
/// It **should not be depended upon at runtime**, and is implemented only for testing type consistency.
pub trait TestDataQueryTypes: TryFromDataQueryResults {
    /// A list of tuples `(field_name, expected_type)` that are derived from the `RequiredData` struct's fields.
    /// For example
    /// ```ignore
    /// struct RequiredData {
    ///   a: PropView<prop_type::String>,
    ///   b: PropView<prop_type::Number>,
    /// }
    /// ```
    /// would result in the list `&[("a", PropValueType::String), ("b", PropValueType::Number)]`.
    const _DECLARED_DATA_QUERY_TYPES: &'static [(&'static str, PropValueType)];

    /// Test that the types of the data queries match the types declared in the `RequiredData` struct.
    /// This function should only be used as part of tests.
    ///
    /// It must be called with a type parameter of the related component. For example, if `RequiredData`
    /// is for a prop on the `Text` component, this function is called
    /// ```ignore
    /// RequiredData::_test_data_query_types::<Text>();
    /// ```
    fn _test_data_query_types<T: ComponentVariantPropTypes + 'static>() {
        let types_from_data_queries = Self::to_data_queries()
            .iter()
            .map(|query| query.guess_return_type::<T>())
            .collect::<Vec<_>>();

        for (possible_types, (field_name, expected_type)) in types_from_data_queries
            .into_iter()
            .zip(Self::_DECLARED_DATA_QUERY_TYPES)
        {
            if possible_types.is_err() {
                // If we could not determine the type that this data query produces, we won't test it.
                continue;
            }
            let possible_types = possible_types.unwrap();
            if !possible_types.contains(&expected_type) {
                panic!(
                    "Based on the data query, `{}` should have one of the following types: {:?}. Based on the `PropValue<...>` definition, the type is {:?}",
                    field_name, expected_type, possible_types
                );
            }
        }
    }
}
