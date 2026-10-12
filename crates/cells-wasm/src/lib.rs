//! Browser binding. The renderer reads cells through a `Float64Array` view
//! over wasm memory (see `cells_ptr`/`cells_len`), receives a one-time render
//! manifest, and writes with cell-addressed requests. See ADR 0001.

use cells_core::{
    DirtyClosure, Document, Evaluator, FullRecompute, LoadOptions, PointRequest, Request,
};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct Core {
    doc: Document,
    evaluator: Box<dyn Evaluator>,
    timings: cells_core::LoadTimings,
    last_dropped: u32,
    last_rebuilt: bool,
    last_rebuild_error: Option<String>,
    /// ms spent inside the rebuild during the last tick, if one happened.
    last_rebuild_ms: f64,
}

#[wasm_bindgen]
impl Core {
    /// Load a document from either wire format (DAST JSON or binary CDST,
    /// detected by content) and compute its initial values.
    #[wasm_bindgen(constructor)]
    pub fn new(dast: &[u8]) -> Result<Core, JsError> {
        Core::with_engine(dast, "A")
    }

    /// Load with a named symbolic engine: "A" (this prototype's), or "R"
    /// (math-expressions-rs) when built with the `engine-r` feature.
    pub fn with_engine(dast: &[u8], engine: &str) -> Result<Core, JsError> {
        Core::with_engine_seeded(dast, engine, 0.0)
    }

    /// Load with the document seed load-time choices draw from (ADR 0009).
    pub fn with_seed(dast: &[u8], seed: f64) -> Result<Core, JsError> {
        Core::with_engine_seeded(dast, "A", seed)
    }

    fn with_engine_seeded(dast: &[u8], engine: &str, seed: f64) -> Result<Core, JsError> {
        console_error_panic_hook::set_once();
        let engine: Box<dyn cells_sym::SymEngine> = match engine {
            "A" => Box::new(cells_sym::flat::Flat::new()),
            #[cfg(feature = "engine-r")]
            "R" => Box::new(cells_sym_mer::Mer::new()),
            other => {
                return Err(JsError::new(&format!(
                    "no symbolic engine '{other}' in this build"
                )));
            }
        };
        let (doc, timings) = Document::load(
            dast,
            LoadOptions {
                engine: Some(engine),
                seed: seed as u64,
                ..Default::default()
            },
        )
        .map_err(|e| JsError::new(&e.to_string()))?;
        let evaluator: Box<dyn Evaluator> =
            Box::new(DirtyClosure::new(&doc.program, doc.cells.len()));
        Ok(Core {
            doc,
            evaluator,
            timings,
            last_dropped: 0,
            last_rebuilt: false,
            last_rebuild_error: None,
            last_rebuild_ms: 0.0,
        })
    }

    /// Parse what a student typed into the engine: the value to request on
    /// a mathInput's `expr` cell.
    pub fn parse_math(&self, text: &str) -> Result<f64, JsError> {
        self.doc.parse_math(text).map_err(|e| JsError::new(&e))
    }

    /// Symbolic instructions that called the engine since load.
    pub fn sym_runs(&self) -> f64 {
        self.doc.program.sym.stats.get().runs as f64
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

    /// Stage timings from loading, in milliseconds, as JSON.
    pub fn load_timings_json(&self) -> String {
        let t = &self.timings;
        format!(
            r#"{{"deserialize":{},"build":{},"schedule":{},"initial_compute":{},"passes":{},"structural_depth":{}}}"#,
            t.deserialize.as_secs_f64() * 1e3,
            t.build.as_secs_f64() * 1e3,
            t.schedule.as_secs_f64() * 1e3,
            t.initial_compute.as_secs_f64() * 1e3,
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
        self.doc.root
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
        self.doc.components.parent.as_ptr()
    }
    pub fn comp_prop_base_ptr(&self) -> *const u32 {
        self.doc.components.prop_base.as_ptr()
    }
    pub fn prop_cells_ptr(&self) -> *const u32 {
        self.doc.components.prop_cells.as_ptr()
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
        self.doc.components.child_list.as_ptr()
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
    /// every pointer and length above must be re-read.
    pub fn request(&mut self, cells: &[u32], values: &[f64]) -> Vec<u32> {
        let reqs: Vec<Request> = cells
            .iter()
            .zip(values)
            .map(|(&cell, &value)| Request { cell, value })
            .collect();
        self.apply(&reqs, &[])
    }

    /// Points dragged together, as `x0, y0, x1, y1, ...`: one point group
    /// (ADR 0006), so a constrained point carries the others with it.
    pub fn request_points(&mut self, cells: &[u32], values: &[f64]) -> Vec<u32> {
        let pts: Vec<PointRequest> = cells
            .chunks_exact(2)
            .zip(values.chunks_exact(2))
            .map(|(c, v)| PointRequest {
                cells: [c[0], c[1]],
                values: [v[0], v[1]],
            })
            .collect();
        self.apply(&[], &[pts])
    }

    fn apply(&mut self, reqs: &[Request], groups: &[Vec<PointRequest>]) -> Vec<u32> {
        let clock = web_time::Instant::now();
        let tick = self
            .doc
            .request_with_groups(self.evaluator.as_mut(), reqs, groups);
        self.last_dropped = tick.dropped.len() as u32;
        self.last_rebuilt = tick.rebuilt;
        self.last_rebuild_error = tick.rebuild_error;
        self.last_rebuild_ms = 0.0;
        if tick.rebuilt {
            // The whole tick is the rebuild when the program changed shape;
            // the evaluator's dependency tables are for the old program.
            self.last_rebuild_ms = clock.elapsed().as_secs_f64() * 1e3;
            let name = self.evaluator.name().to_string();
            self.set_evaluator(&name).unwrap();
        }
        tick.changed
    }

    // ---- test adapter -----------------------------------------------------
    //
    // The current core's vitest suites run against this core through an
    // adapter. These calls answer by name so the adapter needs no
    // knowledge of the column layout.

    /// Component index of a dotted path as the tests write it
    /// (`"g.Ps[2]"`), or `u32::MAX`.
    pub fn resolve_path(&self, path: &str) -> u32 {
        self.doc.resolve_path(path).unwrap_or(u32::MAX)
    }

    pub fn component_tag(&self, idx: u32) -> Option<String> {
        if (idx as usize) < self.doc.n_components() {
            Some(self.doc.component_type(idx).tag().to_string())
        } else {
            None
        }
    }

    /// Cells of a prop by name, including virtual (`coords`, `center`) and
    /// array (`points`, `vertices`) props; empty if no such prop.
    pub fn prop_cells(&self, idx: u32, prop: &str) -> Vec<u32> {
        if (idx as usize) >= self.doc.n_components() {
            return Vec::new();
        }
        self.doc.prop_cells(idx, prop).unwrap_or_default()
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
        if self.doc.is_essential(cell) {
            "essential".into()
        } else if self.doc.is_fixed(cell) {
            "fixed".into()
        } else {
            "derived".into()
        }
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
            self.doc.rendered_text(idx)
        } else {
            String::new()
        }
    }

    /// The string a `<text>` value cell holds.
    pub fn text_value(&self, cell: u32) -> String {
        if (cell as usize) < self.doc.cells.len() {
            self.doc.text_value(cell)
        } else {
            String::new()
        }
    }

    /// Text of the expression a math cell holds, for display.
    pub fn expr_text(&self, cell: u32) -> String {
        self.doc.math_text(cell)
    }

    /// Build passes the load took to settle repeat counts.
    pub fn passes(&self) -> u32 {
        self.timings.passes
    }

    /// Authoring warnings for the loaded document, JSON array of strings.
    pub fn warnings_json(&self) -> String {
        serde_json::to_string(&self.doc.warnings()).unwrap()
    }

    /// Choose the recompute strategy: "full" or "dirty-closure".
    pub fn set_evaluator(&mut self, name: &str) -> Result<(), JsError> {
        self.evaluator = match name {
            "full" => Box::new(FullRecompute),
            "dirty-closure" => Box::new(DirtyClosure::new(&self.doc.program, self.doc.cells.len())),
            other => return Err(JsError::new(&format!("unknown evaluator {other}"))),
        };
        Ok(())
    }
}
