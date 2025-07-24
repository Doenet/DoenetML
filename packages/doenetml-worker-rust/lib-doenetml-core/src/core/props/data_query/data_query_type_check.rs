use crate::{
    components::ComponentVariantPropTypes,
    props::{PropProfile, prop_profile_to_type},
};

use super::{DataQuery, PropSpecifier, PropValueType};

impl DataQuery {
    /// Guess the return type of a data query. Since this return type may depend on
    /// retrieving a prop from a component, you must pass in a reference to the component as a type parameter.
    ///
    /// Note: this function assumes the data query is well formed (E.g., it only uses `PropSpecifier::LocalIdx` in conjunction
    /// with `PropSource::Me`). If the data query is not well formed, this function may return an incorrect type.
    ///
    /// This function is **only used in tests** and should not be relied upon.
    #[allow(clippy::result_unit_err)]
    pub fn _guess_return_type<T: ComponentVariantPropTypes + 'static>(
        &self,
    ) -> Result<Vec<PropValueType>, ()> {
        match self {
            DataQuery::ContentRefs { .. } => Ok(vec![PropValueType::ContentRefs]),
            DataQuery::AnnotatedContentRefs { .. } => Ok(vec![PropValueType::AnnotatedContentRefs]),
            DataQuery::Prop { prop_specifier, .. } | DataQuery::PickProp { prop_specifier, .. } => {
                // This is not completely correct. There are non-allowed cases where `PropSpecifier::LocalIdx` is used
                // with a `source != PropSource:Me`. These are hard runtime errors. Technically, we should return `Err` in those
                // cases. However, we will assume that the data query is well formed.
                match prop_specifier {
                    PropSpecifier::Matching(profiles) => Ok(prop_profiles_to_value_types(profiles)),
                    PropSpecifier::LocalIdx(local_idx) => {
                        let prop_value_type = T::PROP_VALUE_TYPES.get(local_idx.as_usize()).unwrap_or_else(|| panic!("Error when guessing the prop type. Tried to access index {local_idx:?} but no such index exists"));
                        Ok(vec![*prop_value_type])
                    }
                    PropSpecifier::MatchingPair(..) => Ok(vec![PropValueType::PropVec]),
                }
            }
            DataQuery::Attribute { match_profiles, .. } => {
                Ok(prop_profiles_to_value_types(match_profiles))
            }
            DataQuery::State => Err(()),
            DataQuery::SelfRef => Ok(vec![PropValueType::ComponentRef]),
            DataQuery::Null => Err(()),
        }
    }
}

/// Convert a slice of `PropProfile`s to a `Vec` of `PropValueType`s.
/// Values are determined based on [`prop_profile_to_type`].
fn prop_profiles_to_value_types(profiles: &[PropProfile]) -> Vec<PropValueType> {
    profiles.iter().cloned().map(prop_profile_to_type).collect()
}
