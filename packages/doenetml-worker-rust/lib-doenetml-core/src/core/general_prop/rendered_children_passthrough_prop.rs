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
                        Cond::NotEq(PropValue::Boolean(true)),
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

impl PropUpdater for RenderedChildrenPassthroughProp {
    type PropType = prop_type::ContentRefs;

    fn data_queries(&self) -> Vec<DataQuery> {
        vec![self.data_query.clone()]
    }

    fn calculate(&self, data: DataQueryResults) -> PropCalcResult<Self::PropType> {
        // TODO: verify that data was in the right format.
        // For now, assuming that has just one value that is of type PropValue::GraphNodes
        let nodes = data.vec[0]
            .values
            .iter()
            .flat_map(|prop| match &prop.value {
                PropValue::ContentRefs(content_ref) => (**content_ref).clone().into_vec(),
                _ => {
                    unreachable!(
                        "should only encounter content refs from filtered children, not {:?}",
                        prop.value
                    )
                }
            })
            .collect::<Vec<_>>();

        PropCalcResult::Calculated(Rc::new(nodes.into()))
    }
}
