use serde::{Deserialize, Serialize};

use crate::{
    state::{PropIdx, PropValue},
    ComponentIdx,
};

use super::ActionsEnum;

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[cfg_attr(feature = "web", derive(tsify::Tsify))]
#[cfg_attr(feature = "web", tsify(from_wasm_abi))]
pub struct ActionBody<T> {
    pub args: T,
}

#[derive(Debug, Deserialize, Serialize)]
#[cfg_attr(feature = "web", derive(tsify::Tsify))]
#[cfg_attr(feature = "web", serde(rename_all = "camelCase"))]
#[cfg_attr(feature = "web", tsify(from_wasm_abi))]
pub struct Action {
    pub component_idx: ComponentIdx,
    #[serde(flatten)]
    pub action: ActionsEnum,
}

pub struct UpdateFromAction(pub PropIdx, pub PropValue);
