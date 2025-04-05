use itertools::Itertools;

use crate::components::prelude::*;

/// A prop that computes an integer from a string value.
#[derive(Debug)]
pub struct StringToIntegerProp {
    /// The data query that indicates how the dependencies of this prop will be created.
    data_query: DataQuery,
    default: prop_type::Integer,
}

impl PropFromAttribute<prop_type::Integer> for StringToIntegerProp {
    fn new_from_attribute(attr_name: &'static str, default: prop_type::Integer) -> Self {
        Self {
            data_query: DataQuery::Attribute {
                attribute_name: attr_name,
                match_profiles: vec![PropProfile::String],
            },
            default,
        }
    }
}

#[derive(TryFromDataQueryResults, Debug)]
#[data_query(query_trait = DataQueries, pass_data = &DataQuery)]
struct RequiredData {
    string: Vec<PropView<prop_type::String>>,
}
impl DataQueries for RequiredData {
    fn string_query(query: &DataQuery) -> DataQuery {
        query.clone()
    }
}

impl PropUpdater for StringToIntegerProp {
    type PropType = prop_type::Integer;

    fn data_queries(&self) -> Vec<DataQuery> {
        RequiredData::data_queries_vec(&self.data_query)
    }

    fn calculate(&self, data: DataQueryResults) -> PropCalcResult<Self::PropType> {
        // There are different options based on the data query that created us.
        match self.data_query {
            DataQuery::Attribute { .. } => {
                let required_data = RequiredData::try_from_data_query_results(data).unwrap();
                match required_data.string.len() {
                    0 => PropCalcResult::FromDefault(self.default),
                    _ => {
                        if required_data.string[0].came_from_default {
                            return PropCalcResult::FromDefault(self.default);
                        }

                        // Float parsing is slightly more permissive. We may lose accuracy, but JS cannot handle i64s anyway.
                        let float_val = required_data
                            .string
                            .iter()
                            .map(|s| (*s.value).clone())
                            .join("")
                            .parse::<f64>()
                            .unwrap_or(self.default as f64);
                        let ret = float_val.trunc() as i64;
                        PropCalcResult::Calculated(ret)
                    }
                }
            }
            _ => {
                panic!("Wrong data query encountered")
            }
        }
    }
}
