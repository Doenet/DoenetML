//! Run a scripted scenario against the prototype, for differential tests
//! against the current core (see `web/baseline/slider-diff.mjs`).
//!
//! stdin:  {"doc": "<doenetml>", "steps": [{"target": "s", "value": 3.7}, ...], "observe": ["s", "n"]}
//! stdout: {"initial": [..], "steps": [{"values": [..], "dropped": n}, ...]}
//! Values are `value` props of the observed components; NaN prints as null.
use cells_core::Request;
use cells_core::testing::test_utils::load;
use std::io::Read;

fn main() {
    let mut input = String::new();
    std::io::stdin().read_to_string(&mut input).unwrap();
    let scenario: serde_json::Value = serde_json::from_str(&input).unwrap();
    let mut doc = match load(scenario["doc"].as_str().unwrap()) {
        Ok(d) => d,
        Err(e) => {
            println!("{}", serde_json::json!({ "error": e.to_string() }));
            return;
        }
    };
    let observe: Vec<&str> = scenario["observe"]
        .as_array()
        .unwrap()
        .iter()
        .map(|v| v.as_str().unwrap())
        .collect();
    let read = |doc: &cells_core::Document| -> Vec<serde_json::Value> {
        observe
            .iter()
            .map(|n| match doc.value(n, "value") {
                Some(v) if v.is_finite() => serde_json::json!(v),
                _ => serde_json::Value::Null,
            })
            .collect()
    };
    let initial = read(&doc);
    let mut steps = Vec::new();
    for step in scenario["steps"].as_array().unwrap() {
        let target = step["target"].as_str().unwrap();
        let value = match &step["value"] {
            serde_json::Value::Number(n) => n.as_f64().unwrap(),
            serde_json::Value::String(s) => s.parse::<f64>().unwrap_or(f64::NAN),
            _ => f64::NAN,
        };
        let cell = doc.cell(target, "value").unwrap();
        let tick = doc.request(&[Request { cell, value }]);
        steps.push(serde_json::json!({ "values": read(&doc), "dropped": tick.dropped.len() }));
    }
    println!(
        "{}",
        serde_json::json!({ "initial": initial, "steps": steps })
    );
}
