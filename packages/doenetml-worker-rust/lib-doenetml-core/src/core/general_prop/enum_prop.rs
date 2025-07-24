use std::{marker::PhantomData, rc::Rc};

use crate::{components::prelude::*, props::UpdaterObject};

/// A prop that represents a value from an enum. The enum must implement `TryFrom<&str>`.
/// If the `TryFrom` fails, the default value of the enum is used.
#[derive(Debug)]
pub struct EnumProp<T: Default + Clone> {
    /// The data query that indicates how the dependencies of this prop will be created.
    data_query: DataQuery,
    phantom: PhantomData<T>,
}

impl<T> From<EnumProp<T>> for UpdaterObject
where
    for<'a> T: From<&'a str>,
    T: Default + Clone + TryFrom<PropValue> + std::fmt::Debug + 'static,
    PropValue: From<T>,
    <T as TryFrom<PropValue>>::Error: std::fmt::Debug + std::fmt::Display,
{
    fn from(prop: EnumProp<T>) -> UpdaterObject {
        Rc::new(prop)
    }
}

impl<T: Default + Clone> PropFromAttribute<T> for EnumProp<T> {
    fn new_from_attribute(attr_name: &'static str, _default: T) -> Self {
        Self {
            data_query: DataQuery::Attribute {
                attribute_name: attr_name,
                match_profiles: vec![PropProfile::String],
            },
            phantom: PhantomData,
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

impl<T> PropUpdater for EnumProp<T>
where
    for<'a> T: TryFrom<&'a str>,
    T: Default + Clone + TryFrom<PropValue> + std::fmt::Debug,
    PropValue: From<T>,
    <T as TryFrom<PropValue>>::Error: std::fmt::Display + std::fmt::Debug,
{
    type PropType = T;
    fn data_queries(&self) -> Vec<DataQuery> {
        RequiredData::data_queries_vec(&self.data_query)
    }

    fn calculate(&self, data: DataQueryResults) -> PropCalcResult<Self::PropType> {
        let required_data = RequiredData::try_from_data_query_results(data).unwrap();
        match required_data.string.len() {
            0 => PropCalcResult::FromDefault(T::default()),
            _ => {
                let full_string = required_data
                    .string
                    .iter()
                    .map(|s| (*s.value).clone())
                    .collect::<String>();
                let ret = T::try_from(full_string.as_str()).unwrap_or_default();
                PropCalcResult::Calculated(ret)
            }
        }
    }
}
