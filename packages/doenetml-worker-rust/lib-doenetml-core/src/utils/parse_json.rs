use serde::{Deserialize, Serialize};
use std::collections::HashMap;

use crate::state::StateVarValueEnum;

/// The structure of the json argument in a call to dispatch_action.
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct ActionStructure {
    component_idx: usize,
    action_name: String,
    args: HashMap<String, ArgValue>,
}

/// Each value in an action args must be a quantity that can be converted
/// into a `StateVarValueEnum` or a vector of `StateVarValueEnum`.
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

impl From<serde_json::Number> for StateVarValueEnum {
    /// A json number will be converted to an integer if it is an integer.
    ///
    /// For this reason, it's important that we can convert StateVarValueEnum::Integer to f64,
    /// and actions expecting StateVarValueEnum::Number should be able to handle
    /// getting a StateVarValueEnum::Integer instead.
    /// (They should try_into() an f64 and then create StateVarValueEnum::Number from that.)
    ///
    /// Question: should we communicate the expectations of an action here so that it converts
    /// it to the type the action expects right away? Seems like a lot of effort.
    fn from(v: serde_json::Number) -> Self {
        if v.is_i64() {
            StateVarValueEnum::Integer(v.as_i64().unwrap())
        } else {
            StateVarValueEnum::Number(v.as_f64().unwrap())
        }
    }
}

impl From<ArgValue> for Vec<StateVarValueEnum> {
    fn from(value: ArgValue) -> Self {
        match value {
            ArgValue::Bool(v) => vec![StateVarValueEnum::Boolean(v)],
            ArgValue::String(v) => vec![StateVarValueEnum::String(v)],
            ArgValue::Number(v) => vec![v.into()],
            ArgValue::NumberArray(v) => v.into_iter().map(|v| v.into()).collect(),
        }
    }
}
