use serde::{Deserialize, Serialize};
use std::{collections::HashMap, rc::Rc};

use crate::components::prelude::PropValue;

/// The structure of the json argument in a call to dispatch_action.
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct ActionStructure {
    component_idx: usize,
    action_name: String,
    args: HashMap<String, ArgValue>,
}

/// Each value in an action args must be a quantity that can be converted
/// into a `PropValue` or a vector of `PropValue`.
///
/// Currently just booleans, Numbers, arrays of numbers, and strings are supported.
#[derive(Debug, Serialize, Deserialize)]
#[serde(untagged)]
enum ArgValue {
    Bool(bool),
    Number(serde_json::Number),
    NumberArray(Vec<serde_json::Number>),
    String(String),
}

impl From<serde_json::Number> for PropValue {
    /// A json number will be converted to an integer if it is an integer.
    ///
    /// For this reason, it's important that we can convert PropValue::Integer to f64,
    /// and actions expecting PropValue::Number should be able to handle
    /// getting a PropValue::Integer instead.
    /// (They should try_into() an f64 and then create PropValue::Number from that.)
    ///
    /// Question: should we communicate the expectations of an action here so that it converts
    /// it to the type the action expects right away? Seems like a lot of effort.
    fn from(v: serde_json::Number) -> Self {
        if v.is_i64() {
            PropValue::Integer(v.as_i64().unwrap())
        } else {
            PropValue::Number(v.as_f64().unwrap())
        }
    }
}

impl From<ArgValue> for Vec<PropValue> {
    fn from(value: ArgValue) -> Self {
        match value {
            ArgValue::Bool(v) => vec![PropValue::Boolean(v)],
            ArgValue::String(v) => vec![PropValue::String(Rc::new(v))],
            ArgValue::Number(v) => vec![v.into()],
            ArgValue::NumberArray(v) => v.into_iter().map(|v| v.into()).collect(),
        }
    }
}
