//! A Prop is a piece of computed data associated with a component. The value of a Prop
//! is lazily computed and can depend on other Props.

use crate::components::{
    prelude::{ComponentIdx, LocalPropIdx},
    types::AttributeName,
};

use super::{cache::PropWithMeta, PropProfile, PropValue};

/// Data resulting from a `DataQuery`
#[derive(Debug, Clone)]
pub struct DataQueryResult {
    /// The value of the data that was queried for.
    pub values: Vec<PropWithMeta>,
}

/// A vector of `DataQueryResult`s implemented as a wrapped type.
///
/// The type is wrapped so we can re-implement external traits like `std::ops::Index`.
#[derive(Debug, Clone)]
pub struct DataQueryResults {
    pub vec: Vec<DataQueryResult>,
}

impl Default for DataQueryResults {
    fn default() -> Self {
        Self::new()
    }
}

impl DataQueryResults {
    pub fn new() -> Self {
        Self { vec: Vec::new() }
    }
    pub fn from_vec(vec: Vec<DataQueryResult>) -> Self {
        Self { vec }
    }
    /// Set all metadata to the defaults (e.g., `changed == false` and `came_from_default == false`)
    pub fn with_reset_meta(mut self) -> Self {
        for result in &mut self.vec {
            for prop in &mut result.values {
                prop.changed = false;
                prop.came_from_default = false;
            }
        }
        self
    }

    /// Return whether or not any props in the results have changed
    pub fn have_a_changed_value(&self) -> bool {
        self.vec
            .iter()
            .any(|data| data.values.iter().any(|prop| prop.changed))
    }

    /// return whether or not any results exist
    pub fn is_empty(&self) -> bool {
        self.vec.is_empty() || (self.vec.len() == 1 && self.vec[0].values.is_empty())
    }
}

/// A `DataQuery` a request for information from the document. It could be a request for a prop value,
/// a request for a list of children, etc..
#[derive(Debug, Clone, Default, PartialEq)]
pub enum DataQuery {
    /// Query for all children that have a prop that matches the prescribed `PropProfile`s.
    /// Returns the matching props
    ChildPropProfile {
        /// The data query will match child components that have at least one of these profiles
        match_profiles: Vec<PropProfile>,
    },

    /// Query for all child GraphNodes,
    /// filtering element nodes for components which contain PropProfile props given specified values
    ///
    /// filter: a vector of `PropProfile` and `PropValue` pairings.
    /// If a component has a prop with each specified `PropProfile`,
    /// then it will be filtered out if any of the values don't match the specified `PropValue`.
    /// If a component does not have a prop with one or more of the specified `PropProfiles`,
    /// then it will be included if `include_if_missing_profile` is `true`, otherwise it will be be filtered out.
    /// All non-component children are unaffected by the filter.
    ///
    /// For example, if the filter has one element `(PropProfile:Hidden`, `PropValue::Boolean(false))`, then
    /// - if `include_if_missing_profile` is `true`,
    ///   all component children that have a prop with the profile `Hidden` whose value is not `false`
    ///   will be filtered out.
    /// - if `include_if_missing_profile` is `false`,
    ///   all component children that do not have a prop with the profile `Hidden` with value `false`
    ///   will be filtered out.
    FilteredChildren {
        filters: Vec<DataQueryFilter>,
        include_if_missing_profile: bool,
    },

    /// Query for a particular prop of a component
    Prop {
        /// If None, prop is from the component making the query.
        component_idx: Option<ComponentIdx>,

        /// The prop from component_idx or component making the query.
        local_prop_idx: LocalPropIdx,
    },

    /// Query for a prop from a parent
    ParentProp { prop_profile: PropProfile },

    /// Query for all children of an attribute that match the prescribed `PropProfile`
    Attribute {
        /// The name of the attribute whose children will be matched.
        attribute_name: AttributeName,

        /// The data query will match child components that have at least one of these profiles.
        match_profiles: Vec<PropProfile>,
    },

    #[default]
    /// Will be initialized with the default value of this prop
    /// and will accept any change when inverting.
    State,

    /// A data query that cannot be resolved. This is used as a dependency of other data queries.
    Null,
}

#[derive(Debug, Clone, PartialEq)]
pub enum DataQueryFilter {
    PropProfile(PropProfileDataQueryFilter),
    ComponentType(ComponentTypeDataQueryFilter),
}

#[derive(Debug, Clone, PartialEq)]
pub struct PropProfileDataQueryFilter {
    pub profile: PropProfile,
    pub value: PropValue,
    pub comparison: DataQueryFilterComparison,
}

#[derive(Debug, Clone, PartialEq)]
pub struct ComponentTypeDataQueryFilter {
    pub component_type: &'static str,
    pub comparison: DataQueryFilterComparison,
}

#[derive(Debug, Clone, PartialEq)]
pub enum DataQueryFilterComparison {
    Equal,
    NotEqual,
}
