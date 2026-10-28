//! Browser binding. The renderer reads cells through a `Float64Array` view
//! over wasm memory (see `cells_ptr`/`cells_len`), reads the component
//! tables the same way, and writes with cell-addressed requests. See ADR 0001.

use cells_core::{CellIdx, CompIdx, Document, LoadOptions, PointRequest, Request};
use wasm_bindgen::prelude::*;

/// Every diagnostic of a document (ADR 0013), as a JSON array, from one
/// build through the exhaustive view: every option of every select and
/// every repeat body, whatever the seed or the counts. A function of the
/// wire-format bytes alone; no `Core` is made. For the language server.
/// Each entry has `kind` (error, warning, info, accessibility), `code`,
/// `message`, `node` (the DAST node, absent for a finding about the whole
/// document), and `level` and `args` where the kind has them.
#[wasm_bindgen]
pub fn diagnose_json(dast: &[u8]) -> Result<String, JsError> {
    let dast = cells_core::dast::load(dast).map_err(|e| JsError::new(&e.to_string()))?;
    Ok(serde_json::to_string(&cells_core::diagnose(&dast)).unwrap())
}

/// Whether publishing the document `new` over `old` is safe for every
/// student (ADR 0017): their saved state then carries over exactly. Both
/// are DAST bytes in either wire format; `renames` is a JSON array of
/// `[oldKey, newKey]` pairs an editor recorded. The result is JSON: `safe`,
/// and `failures`, each with the input's `key`, the `condition` (1 to 3)
/// it fails, its DAST `node` in `new` and `oldNode` in `old` where it has
/// one, and a `reason`. An error when either version does not load under
/// this release, which makes the edit not safe for attempts pinned to it.
#[wasm_bindgen]
pub fn compare_versions_json(old: &[u8], new: &[u8], renames: &str) -> Result<String, JsError> {
    let err = |e: cells_core::Error| JsError::new(&e.to_string());
    let old = cells_core::dast::load(old).map_err(err)?;
    let new = cells_core::dast::load(new).map_err(err)?;
    let renames: Vec<(String, String)> = if renames.trim().is_empty() {
        Vec::new()
    } else {
        serde_json::from_str(renames).map_err(|e| JsError::new(&e.to_string()))?
    };
    let report = cells_core::compare_versions(&old, &new, &renames).map_err(err)?;
    let failures: Vec<serde_json::Value> = report
        .failures
        .iter()
        .map(|f| {
            serde_json::json!({
                "key": f.key,
                "condition": f.condition,
                "node": f.node,
                "oldNode": f.old_node,
                "reason": f.reason,
            })
        })
        .collect();
    Ok(serde_json::json!({ "safe": report.safe(), "failures": failures }).to_string())
}

#[wasm_bindgen]
pub struct Core {
    doc: Document,
    timings: cells_core::LoadTimings,
    last_dropped: u32,
    last_rebuilt: bool,
    last_rebuild_error: Option<String>,
    /// ms spent inside the rebuild during the last tick, if one happened.
    last_rebuild_ms: f64,
    /// The load's spans (`cells_core::trace`), for the benchmark's trace layer.
    trace: Vec<cells_core::trace::Span>,
}

#[wasm_bindgen]
impl Core {
    /// Load a document from either wire format (DAST JSON or binary CDST,
    /// detected by content) and compute its initial values. The bytes are
    /// taken, not borrowed, so the load frees them once they are read.
    #[wasm_bindgen(constructor)]
    pub fn new(dast: Vec<u8>) -> Result<Core, JsError> {
        Core::with_seed(dast, 0.0)
    }

    /// Load with the document seed load-time choices draw from (ADR 0009).
    pub fn with_seed(dast: Vec<u8>, seed: f64) -> Result<Core, JsError> {
        Core::with_options(dast, seed, true)
    }

    /// Load with a seed, and with `prune` false every prop of every
    /// component computed (ADR 0019): for a reader of props no renderer
    /// reads, as the JavaScript worker's parity harness is.
    pub fn with_options(dast: Vec<u8>, seed: f64, prune: bool) -> Result<Core, JsError> {
        console_error_panic_hook::set_once();
        cells_core::trace::start();
        let loaded = Document::load_owned(
            dast,
            LoadOptions {
                seed: seed as u64,
                prune,
                ..Default::default()
            },
        );
        let trace = cells_core::trace::finish();
        let (doc, timings) = loaded.map_err(|e| JsError::new(&e.to_string()))?;
        Ok(Core {
            doc,
            timings,
            trace,
            last_dropped: 0,
            last_rebuilt: false,
            last_rebuild_error: None,
            last_rebuild_ms: 0.0,
        })
    }

    /// Load with a seed and saved state (`save_state`'s JSON): the document
    /// comes back where the session left it.
    pub fn with_seed_and_state(dast: Vec<u8>, seed: f64, state: &str) -> Result<Core, JsError> {
        Core::with_options_and_state(dast, seed, true, state)
    }

    /// `with_options`, then saved state, as `with_seed_and_state`.
    pub fn with_options_and_state(
        dast: Vec<u8>,
        seed: f64,
        prune: bool,
        state: &str,
    ) -> Result<Core, JsError> {
        let mut core = Core::with_options(dast, seed, prune)?;
        core.doc
            .restore_state(state)
            .map_err(|e| JsError::new(&e.to_string()))?;
        Ok(core)
    }

    /// This core's release id (ADR 0017): saved state records it, and only
    /// a core with the same id restores it.
    pub fn release_id() -> String {
        cells_core::RELEASE.to_string()
    }

    /// The session's state as JSON: every essential cell that differs from
    /// its default, by essential key (`Document::save_state`).
    pub fn save_state(&self) -> String {
        self.doc.save_state()
    }

    /// Parse what a student typed into the engine: the value to request on
    /// a mathInput's `expr` cell.
    pub fn parse_math(&self, text: &str) -> Result<f64, JsError> {
        self.doc.parse_math(text).map_err(|e| JsError::new(&e))
    }

    /// The string id of `text` as a cell value, interning it if new: the
    /// value to request on a text cell (a `<textInput>`'s). After a call
    /// that interned, `n_strings` and the string pointers must be re-read.
    pub fn intern(&mut self, text: &str) -> f64 {
        self.doc.intern(text)
    }

    /// Symbolic instructions that called the engine since load.
    pub fn sym_runs(&self) -> f64 {
        self.doc.sym.stats.runs as f64
    }

    /// Pointer to the cell array inside wasm memory. Valid until the next
    /// call that may allocate; callers re-derive their view after each call.
    pub fn cells_ptr(&self) -> *const f64 {
        self.doc.cells.as_ptr()
    }

    pub fn cells_len(&self) -> usize {
        self.doc.cells.len()
    }

    pub fn n_essential(&self) -> usize {
        self.doc.n_essential
    }

    /// The load's spans as JSON (`cells_core::trace::to_json`): name, depth,
    /// start and duration in milliseconds from the start of the load, and
    /// the work counted inside each.
    pub fn load_trace_json(&self) -> String {
        cells_core::trace::to_json(&self.trace)
    }

    /// Stage timings from loading, in milliseconds, as JSON.
    pub fn load_timings_json(&self) -> String {
        let t = &self.timings;
        format!(
            r#"{{"deserialize":{},"build":{},"schedule":{},"initial_compute":{},"cycle_check":{},"passes":{},"structural_depth":{}}}"#,
            t.deserialize.as_secs_f64() * 1e3,
            t.build.as_secs_f64() * 1e3,
            t.schedule.as_secs_f64() * 1e3,
            t.initial_compute.as_secs_f64() * 1e3,
            t.cycle_check.as_secs_f64() * 1e3,
            t.passes,
            t.structural_depth
        )
    }

    // ---- component tables -------------------------------------------------
    //
    // The renderer reads the columnar component layer directly through typed
    // array views over wasm memory, the same way it reads cells. There is no
    // serialized manifest. Pointers are valid until the next allocating call.

    pub fn root(&self) -> u32 {
        self.doc.root.get()
    }

    pub fn n_components(&self) -> usize {
        self.doc.n_components()
    }

    /// `u8` per component: the `ComponentType` discriminant, in the order of
    /// `type_tags()`.
    pub fn comp_type_ptr(&self) -> *const u8 {
        self.doc.components.component_type.as_ptr() as *const u8
    }

    /// Tag names indexed by type discriminant, JSON array.
    pub fn type_tags(&self) -> String {
        serde_json::to_string(
            &cells_core::components::ComponentType::ALL
                .iter()
                .map(|k| k.tag())
                .collect::<Vec<_>>(),
        )
        .unwrap()
    }

    /// Prop names per type, JSON array of arrays, in the order of `type_tags()`.
    pub fn type_props(&self) -> String {
        serde_json::to_string(
            &cells_core::components::ComponentType::ALL
                .iter()
                .map(|k| k.prop_defs().iter().map(|p| p.name).collect::<Vec<_>>())
                .collect::<Vec<_>>(),
        )
        .unwrap()
    }

    pub fn comp_name_ptr(&self) -> *const u32 {
        self.doc.components.name.as_ptr()
    }
    pub fn comp_parent_ptr(&self) -> *const u32 {
        // `CompIdx` is a `u32` (`repr(transparent)`).
        self.doc.components.parent.as_ptr() as *const u32
    }
    pub fn comp_prop_base_ptr(&self) -> *const u32 {
        self.doc.components.prop_base.as_ptr()
    }
    pub fn prop_cells_ptr(&self) -> *const u32 {
        // `CellIdx` is a `u32` (`repr(transparent)`).
        self.doc.components.prop_cells.as_ptr() as *const u32
    }
    pub fn prop_cells_len(&self) -> usize {
        self.doc.components.prop_cells.len()
    }
    pub fn comp_child_start_ptr(&self) -> *const u32 {
        self.doc.components.child_start.as_ptr()
    }
    pub fn comp_child_count_ptr(&self) -> *const u32 {
        self.doc.components.child_count.as_ptr()
    }
    pub fn child_list_ptr(&self) -> *const u32 {
        // `ChildEntry` is a `u32` (`repr(transparent)`): a component, or a
        // string id with `TEXT_BIT` set.
        self.doc.components.child_list.as_ptr() as *const u32
    }
    pub fn child_list_len(&self) -> usize {
        self.doc.components.child_list.len()
    }
    /// Stable identity across rebuilds: DAST node (NONE if synthesized) and scope.
    pub fn comp_node_ptr(&self) -> *const u32 {
        self.doc.components.dast_node.as_ptr()
    }
    pub fn comp_scope_ptr(&self) -> *const u32 {
        self.doc.components.scope.as_ptr()
    }
    /// String table: `n_strings + 1` offsets into the UTF-8 byte blob.
    pub fn string_offsets_ptr(&self) -> *const u32 {
        self.doc.strings.offsets.as_ptr()
    }
    pub fn n_strings(&self) -> usize {
        self.doc.strings.len()
    }
    pub fn string_bytes_ptr(&self) -> *const u8 {
        self.doc.strings.bytes.as_ptr()
    }
    pub fn string_bytes_len(&self) -> usize {
        self.doc.strings.bytes.len()
    }

    /// Literal attributes per DAST node, JSON `{node: {attr: text}}`: the
    /// presentation a renderer reads by a component's node (style numbers,
    /// decimals, widths), which is not state.
    pub fn node_attrs_json(&self) -> String {
        let map: serde_json::Map<String, serde_json::Value> = self
            .doc
            .literal_attrs()
            .into_iter()
            .map(|(n, attrs)| {
                let obj: serde_json::Map<String, serde_json::Value> = attrs
                    .into_iter()
                    .map(|(k, v)| (k.to_string(), serde_json::Value::String(v)))
                    .collect();
                (n.to_string(), serde_json::Value::Object(obj))
            })
            .collect();
        serde_json::Value::Object(map).to_string()
    }

    /// Apply cell-addressed requests. Returns the changed cell indices. When
    /// the tick rebuilt the document (`last_rebuilt`), the list is empty and
    /// every pointer and length above must be re-read. A request on a cell
    /// that is not interactive (`interactive_cells`) is refused and counted
    /// in `last_dropped` (ADR 0018).
    pub fn request(&mut self, cells: &[u32], values: &[f64]) -> Vec<u32> {
        let reqs: Vec<Request> = cells
            .iter()
            .zip(values)
            .map(|(&cell, &value)| Request {
                cell: CellIdx::new(cell),
                value,
            })
            .collect();
        self.apply(&reqs, &[])
    }

    /// Points dragged together, as `x0, y0, x1, y1, ...`: one point group
    /// (ADR 0006), so a constrained point carries the others with it.
    pub fn request_points(&mut self, cells: &[u32], values: &[f64]) -> Vec<u32> {
        let pts: Vec<PointRequest> = cells
            .as_chunks::<2>()
            .0
            .iter()
            .zip(values.as_chunks::<2>().0)
            .map(|(&[x, y], &values)| PointRequest {
                cells: [CellIdx::new(x), CellIdx::new(y)],
                values,
            })
            .collect();
        self.apply(&[], &[pts])
    }

    /// Submit an answer, an action: copy its live responses into its
    /// submitted cells and count the submission, as one tick. Returns the
    /// changed cells.
    pub fn submit(&mut self, answer: u32) -> Vec<u32> {
        if (answer as usize) >= self.doc.n_components() {
            return Vec::new();
        }
        self.act(|doc| doc.submit(CompIdx::new(answer)))
    }

    /// Press a `<triggerSet>` or a lone `<updateValue>`, an action: each
    /// `<updateValue>` under it sets its target, as one tick. Returns the
    /// changed cells.
    pub fn trigger(&mut self, comp: u32) -> Vec<u32> {
        if (comp as usize) >= self.doc.n_components() {
            return Vec::new();
        }
        self.act(|doc| doc.trigger(CompIdx::new(comp)))
    }

    /// The inputs an answer's responses read (`Document::answer_inputs`).
    pub fn answer_inputs(&self, answer: u32) -> Vec<u32> {
        if (answer as usize) >= self.doc.n_components() {
            return Vec::new();
        }
        raw_comps(self.doc.answer_inputs(CompIdx::new(answer)))
    }

    /// An answer's submitted cells, one per response
    /// (`Document::answer_responses`).
    pub fn answer_submitted(&self, answer: u32) -> Vec<u32> {
        if (answer as usize) >= self.doc.n_components() {
            return Vec::new();
        }
        self.doc
            .answer_responses(CompIdx::new(answer))
            .into_iter()
            .map(|(_, submitted)| submitted.get())
            .collect()
    }

    /// A component's parent, or `u32::MAX` at the root.
    pub fn component_parent(&self, idx: u32) -> u32 {
        if (idx as usize) < self.doc.n_components() {
            self.doc
                .parent(CompIdx::new(idx))
                .map_or(u32::MAX, CompIdx::get)
        } else {
            u32::MAX
        }
    }

    /// The text of a literal attribute of a component's element
    /// (`Document::attr_text`).
    pub fn attr_text(&self, idx: u32, name: &str) -> Option<String> {
        if (idx as usize) < self.doc.n_components() {
            self.doc.attr_text(CompIdx::new(idx), name)
        } else {
            None
        }
    }

    fn apply(&mut self, reqs: &[Request], groups: &[Vec<PointRequest>]) -> Vec<u32> {
        self.act(|doc| doc.request_with_groups(reqs, groups))
    }

    /// One tick, its outcome recorded for `last_dropped` and the rebuild
    /// getters.
    fn act(&mut self, tick: impl FnOnce(&mut Document) -> cells_core::TickOutcome) -> Vec<u32> {
        let clock = web_time::Instant::now();
        let tick = tick(&mut self.doc);
        self.last_dropped = tick.dropped.len() as u32;
        self.last_rebuilt = tick.rebuilt;
        self.last_rebuild_error = tick.rebuild_error;
        self.last_rebuild_ms = 0.0;
        if tick.rebuilt {
            // The whole tick is the rebuild when the program changed shape.
            self.last_rebuild_ms = clock.elapsed().as_secs_f64() * 1e3;
        }
        raw_cells(tick.changed)
    }

    // ---- test adapter -----------------------------------------------------
    //
    // The current core's vitest suites run against this core through an
    // adapter. These calls answer by name so the adapter needs no
    // knowledge of the column layout.

    /// Component index of a dotted path as the tests write it
    /// (`"g.Ps[2]"`), or `u32::MAX`.
    pub fn resolve_path(&self, path: &str) -> u32 {
        self.doc.resolve_path(path).map_or(u32::MAX, CompIdx::get)
    }

    pub fn component_tag(&self, idx: u32) -> Option<String> {
        if (idx as usize) < self.doc.n_components() {
            Some(self.doc.component_type(CompIdx::new(idx)).tag().to_string())
        } else {
            None
        }
    }

    /// Cells of a prop by name, including combined (`coords`, `center`) and
    /// list (`points`, `vertices`) props; empty if no such prop.
    pub fn prop_cells(&self, idx: u32, prop: &str) -> Vec<u32> {
        if (idx as usize) >= self.doc.n_components() {
            return Vec::new();
        }
        raw_cells(
            self.doc
                .prop_cells(CompIdx::new(idx), prop)
                .unwrap_or_default(),
        )
    }

    pub fn cell_value(&self, cell: u32) -> f64 {
        self.doc
            .cells
            .get(cell as usize)
            .copied()
            .unwrap_or(f64::NAN)
    }

    /// Whether a cell is essential (state), fixed (a constant), or derived.
    pub fn cell_class(&self, cell: u32) -> String {
        let cell = CellIdx::new(cell);
        if self.doc.is_essential(cell) {
            "essential".into()
        } else if self.doc.is_fixed(cell) {
            "fixed".into()
        } else {
            "derived".into()
        }
    }

    /// Whether a renderer may request a cell: one of a prop its component's
    /// definition marks interactive (ADR 0017).
    pub fn is_interactive(&self, cell: u32) -> bool {
        self.doc.is_interactive(CellIdx::new(cell))
    }

    /// Every cell a renderer may request, ascending; new indices after a
    /// rebuild.
    pub fn interactive_cells(&self) -> Vec<u32> {
        raw_cells(self.doc.interactive_cells())
    }

    /// Every cell a renderer may read or a grader reads, ascending (ADR
    /// 0019); new indices after a rebuild.
    pub fn output_cells(&self) -> Vec<u32> {
        raw_cells(self.doc.output_cells())
    }

    pub fn last_dropped(&self) -> u32 {
        self.last_dropped
    }

    pub fn last_rebuilt(&self) -> bool {
        self.last_rebuilt
    }

    pub fn last_rebuild_ms(&self) -> f64 {
        self.last_rebuild_ms
    }

    pub fn last_rebuild_error(&self) -> Option<String> {
        self.last_rebuild_error.clone()
    }

    /// The text a component shows (the current core's `text`), through the
    /// active case of a reactive choice only.
    pub fn component_text(&self, idx: u32) -> String {
        if (idx as usize) < self.doc.n_components() {
            self.doc.rendered_text(CompIdx::new(idx))
        } else {
            String::new()
        }
    }

    /// The string a `<text>` value cell holds.
    pub fn text_value(&self, cell: u32) -> String {
        if (cell as usize) < self.doc.cells.len() {
            self.doc.text_value(CellIdx::new(cell))
        } else {
            String::new()
        }
    }

    /// Text of the expression a math cell holds, for display.
    pub fn expr_text(&self, cell: u32) -> String {
        self.doc.math_text(CellIdx::new(cell))
    }

    /// Build passes the load took to settle repeat counts.
    pub fn passes(&self) -> u32 {
        self.timings.passes
    }

    /// What the load reported about the elements it stamped (ADR 0013),
    /// as a JSON array of diagnostics: the errors behind the document's
    /// `_error` components (each names the component's DAST node) and the
    /// lint findings and warnings of the rest. Per seed and per count, since
    /// only stamped elements are in it; the document's own list is
    /// `diagnose_json`'s.
    pub fn diagnostics_json(&self) -> String {
        serde_json::to_string(self.doc.diagnostics()).unwrap()
    }

    /// Choose the recompute strategy: "full" or "dirty-closure".
    pub fn set_evaluator(&mut self, name: &str) -> Result<(), JsError> {
        if self.doc.set_evaluator(name) {
            Ok(())
        } else {
            Err(JsError::new(&format!("unknown evaluator {name}")))
        }
    }
}

/// Cell indices as the renderer reads them.
fn raw_cells(cells: Vec<CellIdx>) -> Vec<u32> {
    cells.into_iter().map(CellIdx::get).collect()
}

/// Component indices as the renderer reads them.
fn raw_comps(comps: Vec<CompIdx>) -> Vec<u32> {
    comps.into_iter().map(CompIdx::get).collect()
}

#[cfg(test)]
mod tests {
    use cells_core::testing::test_utils::dast_json;

    /// The JSON a caller parses: the field names are the contract.
    #[test]
    fn diagnose_json_shape() {
        let json = dast_json(r#"<graph name="g"/><number name="n">$nope</number>"#);
        let out = super::diagnose_json(json.as_bytes()).unwrap();
        let list: Vec<serde_json::Value> = serde_json::from_str(&out).unwrap();
        assert_eq!(list.len(), 2, "{out}");
        let a11y = &list[0];
        assert_eq!(a11y["kind"], "accessibility");
        assert_eq!(a11y["level"], 1);
        assert_eq!(a11y["code"], "doenet-a0001");
        assert_eq!(a11y["args"]["component"], "graph");
        assert!(a11y["node"].is_number());
        let err = &list[1];
        assert_eq!(err["kind"], "error");
        assert_eq!(err["code"], "doenet-w0104");
        assert!(err["message"].as_str().unwrap().contains("nope"));
        assert!(err.get("level").is_none() && err.get("args").is_none());
    }
}
