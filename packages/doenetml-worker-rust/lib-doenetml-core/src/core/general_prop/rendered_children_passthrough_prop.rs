use crate::{
    components::prelude::*,
    props::{Cond, ContentFilter, Op, OpNot, UpdaterObject},
};
use std::rc::Rc;

#[derive(Debug, Default)]
pub struct RenderedChildrenPassthroughProp {
    /// The data query that indicates how the dependencies of this prop will be created.
    data_query: DataQuery,
}

impl RenderedChildrenPassthroughProp {
    pub fn new() -> Self {
        RenderedChildrenPassthroughProp {
            data_query: DataQuery::AnnotatedContentRefs {
                container: PropSource::Me,
                filter: Rc::new(Op::Or(
                    // Keep things without a "hidden" prop
                    OpNot(ContentFilter::HasPropMatchingProfile(PropProfile::Hidden)),
                    // Keep things with a "hidden != true" prop
                    ContentFilter::HasPropMatchingProfileAndCondition(
                        PropProfile::Hidden,
                        Cond::Eq(PropValue::Boolean(false)),
                    ),
                )),
            },
        }
    }

    // Note: this is currently unused
    pub fn new_updater_object() -> UpdaterObject {
        Rc::new(Self::new())
    }
}

/// Structure to hold data generated from the data queries
#[derive(TryFromDataQueryResults, Debug)]
#[data_query(query_trait = DataQueries, pass_data = &DataQuery)]
struct RequiredData {
    refs: PropView<prop_type::AnnotatedContentRefs>,
}
impl DataQueries for RequiredData {
    fn refs_query(data_query: &DataQuery) -> DataQuery {
        data_query.clone()
    }
}

impl PropUpdater for RenderedChildrenPassthroughProp {
    type PropType = prop_type::AnnotatedContentRefs;

    fn data_queries(&self) -> Vec<DataQuery> {
        RequiredData::data_queries_vec(&self.data_query)
    }

    fn calculate(&self, data: DataQueryResults) -> PropCalcResult<Self::PropType> {
        let required_data = RequiredData::try_from_data_query_results(data).unwrap();
        PropCalcResult::Calculated(required_data.refs.value)
    }
}
