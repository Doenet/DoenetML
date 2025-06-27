use itertools::Itertools;

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
    /// would result in the list `&[("a", Some(PropValueType::String)), ("b", Some(PropValueType::Number))]`.
    const _DECLARED_DATA_QUERY_TYPES: &'static [(&'static str, Option<PropValueType>)];

    const _STRUCT_NAME: &'static str;

    /// Test that the types of the data queries match the types declared in the `RequiredData` struct.
    /// This function should only be used as part of tests.
    ///
    /// It must be called with a type parameter of the related component. For example, if `RequiredData`
    /// is for a prop on the `Text` component, this function is called
    /// ```ignore
    /// RequiredData::_test_data_query_types::<Text>();
    /// ```
    fn _test_data_query_types<T: ComponentVariantPropTypes + 'static>() -> anyhow::Result<()> {
        let types_from_data_queries = Self::to_data_queries()
            .iter()
            .map(|query| query._guess_return_type::<T>())
            .collect::<Vec<_>>();

        for (possible_types, (field_name, expected_type)) in types_from_data_queries
            .into_iter()
            .zip(Self::_DECLARED_DATA_QUERY_TYPES)
        {
            if possible_types.is_err() {
                // If we could not determine the type that this data query produces, we won't test it.
                continue;
            }
            if expected_type.is_none() {
                // If the expected type is `None`, it cannot be determined, so we don't do any testing.
                continue;
            }
            let expected_type = expected_type.unwrap();
            let possible_types = possible_types.unwrap();
            if !possible_types.contains(&expected_type) {
                let struct_name = Self::_STRUCT_NAME;
                let component_name = T::COMPONENT_NAME;
                let possible_types_str =
                    possible_types.iter().map(|x| format!("{x:?}")).join("`, `");
                // Note: All whitespace after the `\` at the end of the line is removed, so if we want indented messages,
                // we need to include the whitespace _before_ the `\`.
                return Err(anyhow::anyhow!(
                    "Type error for component `{component_name}`:\n  \
                      In `{struct_name}.{field_name}`\n    \
                         DataQuery returns a type of `{possible_types_str}`.\n    \
                         PropValue<...> definition is of incompatible type `{expected_type:?}`",
                ));
            }
        }
        Ok(())
    }
}
