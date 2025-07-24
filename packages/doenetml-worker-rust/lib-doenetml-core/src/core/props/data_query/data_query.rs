use std::rc::Rc;

use crate::{
    components::{
        prelude::{ComponentIdx, LocalPropIdx},
        types::AttributeName,
    },
    graph_node::GraphNode,
};

use super::{ApplyTest, FilterData, PropProfile, cache::PropWithMeta};

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

/// Used in a [`DataQuery::Prop`] to specify which component to reference the prop from.
#[derive(Debug, Clone, PartialEq)]
pub enum PropSource {
    /// Search for the prop on the component making the query.
    Me,
    /// Search for the prop on the component making the query's parent.
    Parent,
    /// Search for the prop on the component with the given index.
    ByIdx(ComponentIdx),
    /// Search for the prop at the referent of a `ComponentRef`. The `ComponentRef`
    /// must be the contents of a local prop and is assumed to be **static**.
    StaticComponentRef(LocalPropIdx),
}

/// Used in a [`DataQuery::Prop`] to specify which prop to retrieve from a component.
#[derive(Debug, Clone, PartialEq)]
pub enum PropSpecifier {
    /// Get the prop specified by the local index.
    /// This is _only_ valid when used in conjunction with a `PropComponent::Me` or `PropComponent::ByIdx`.
    LocalIdx(LocalPropIdx),
    /// Get a prop that matches one of the profiles. The component decides which prop to return.
    Matching(Vec<PropProfile>),
    /// Get a pair of props
    /// where the first prop matches a profile from the first set
    /// and the second prop matches a profile from the second set.
    MatchingPair(Vec<PropProfile>, Vec<PropProfile>),
}

/// The source of a  [`DataQuery::PickProp`].
#[derive(Debug, Clone, PartialEq)]
pub enum PickPropSource {
    /// Search for the props on the children of the querying component.
    Children,
    /// Search for the props on the attribute `attribute_name` of the querying component
    Attribute { attribute_name: AttributeName },
    /// Search for the prop on the ancestors of the querying component.
    /// Only return the prop from the first matching ancestor (if one exists).
    NearestMatchingAncestor,
}

impl From<LocalPropIdx> for PropSpecifier {
    fn from(local_idx: LocalPropIdx) -> Self {
        PropSpecifier::LocalIdx(local_idx)
    }
}

/// A `DataQuery` a request for information from the document. It could be a request for a prop value,
/// a request for a list of children, etc..
#[derive(Debug, Clone, Default)]
pub enum DataQuery {
    /// Query for components, filtering element nodes based on the supplied
    /// `filter`. Results in a `prop_type::ComponentRefs` with the matching component refs.
    ///
    /// - `container`: the component whose children will be searched. For example, `PropComponent::Me`
    ///   to search your own children, or `PropComponent::Parent` to search your parent's children.
    /// - `filter`: A composition of `ContentFilter`s. These can be combined with `Op::And`, `Op::Or`,
    ///   and `OpNot`.
    ///
    /// ## Example
    /// ```rust
    /// # use std::rc::Rc;
    /// # use doenetml_core::props::{DataQuery, PropSource, ContentFilter, Op, PropProfile};
    /// DataQuery::ContentRefs {
    ///    container: PropSource::Me,
    ///    filter: Rc::new(Op::And(
    ///      ContentFilter::IsType("section"),
    ///      ContentFilter::HasPropMatchingProfile(PropProfile::Hidden),
    ///    ))
    /// }
    /// # ;
    /// ```
    /// This query will return all children of the querying component that are `<section>` components
    /// and have a prop matching the `PropProfile::Hidden` profile.
    ContentRefs {
        /// Children of this component will be searched
        container: PropSource,
        /// How to filter the children. This should be a [`ContentFilter`] or a
        /// composition of [`ContentFilter`]s.
        ///
        /// See [`DataQuery::ComponentRefs`] for an example.
        filter: Rc<dyn for<'a> ApplyTest<FilterData<'a>, GraphNode>>,
    },

    /// The same as [`DataQuery::ComponentRefs`], but returns additional information
    /// about each matching component in the form of a [`ElementRefAnnotation`].
    AnnotatedContentRefs {
        /// Children of this component will be searched
        container: PropSource,
        /// How to filter the children. This should be a [`ContentFilter`] or a
        /// composition of [`ContentFilter`]s.
        ///
        /// See [`DataQuery::ComponentRefs`] for an example.
        filter: Rc<dyn for<'a> ApplyTest<FilterData<'a>, GraphNode>>,
    },

    /// Query for a particular prop of a component
    Prop {
        /// Where to look for the desired prop.
        source: PropSource,
        /// What prop to look for. Note that `PropSpecifier::LocalIdx` is only valid
        /// when used in conjunction with `PropComponent::Me`.
        prop_specifier: PropSpecifier,
    },

    /// Query multiple components and pick a prop from each.
    PickProp {
        /// Where to find the component's whose props will be searched.
        source: PickPropSource,
        /// How to filter the props to pick. Note that `PropSpecifier::LocalIdx` is forbidden
        /// for this query.
        prop_specifier: PropSpecifier,
    },

    /// Query for all children of an attribute that match the prescribed `PropProfile`
    Attribute {
        /// The name of the attribute whose children will be matched.
        attribute_name: AttributeName,

        /// The data query will match child components that have at least one of these profiles.
        match_profiles: Vec<PropProfile>,
    },

    /// Will be initialized with the default value of this prop
    /// and will accept any change when inverting.
    State,

    /// Query for a reference to "self", the component making the query.
    SelfRef,

    #[default]
    /// A data query that cannot be resolved. This is used as a dependency of other data queries.
    Null,
}
