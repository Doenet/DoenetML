use std::rc::Rc;

use crate::{
    components::prelude::*,
    props::{Cond, ContentFilter, Op, OpNot, UpdaterObject},
};

#[derive(Debug, Default)]
pub struct RenderedChildrenPassthroughProp {
    /// The data query that indicates how the dependencies of this prop will be created.
    data_query: DataQuery,
}

impl RenderedChildrenPassthroughProp {
    pub fn new() -> Self {
        RenderedChildrenPassthroughProp {
            data_query: DataQuery::ComponentRefs {
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
#[data_query(query_trait = DataQueries, pass_data = &RenderedChildrenPassthroughProp)]
struct RequiredData {
    refs: PropView<prop_type::ContentRefs>,
}
impl DataQueries for RequiredData {
    fn refs_query(arg: &RenderedChildrenPassthroughProp) -> DataQuery {
        arg.data_query.clone()
    }
}

impl PropUpdater for RenderedChildrenPassthroughProp {
    type PropType = prop_type::ContentRefs;

    fn data_queries(&self) -> Vec<DataQuery> {
        vec![self.data_query.clone()]
    }

    fn calculate(&self, data: DataQueryResults) -> PropCalcResult<Self::PropType> {
        let required_data = RequiredData::try_from_data_query_results(data).unwrap();
        PropCalcResult::Calculated(required_data.refs.value)
    }
}
