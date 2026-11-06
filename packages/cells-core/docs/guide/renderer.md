# Drawing a document

For someone who draws a document the core has loaded: a renderer, the
browser binding (`crates/cells-wasm`), or the bridge that puts the core
behind DoenetML's shared renderer interface
(`packages/doenetml-worker/src/cells`, ADR 0020). It needs only the
public API, and the links below stay inside it.

## Loading

[`Document::load`](crate::Document::load) takes the parser's DAST, as
JSON or in the binary wire format (ADR 0002), and
[`LoadOptions`](crate::LoadOptions); [`Document::from_bytes`](crate::Document::from_bytes)
loads with the defaults. A load does not fail on an author's mistake: an
element that cannot be built is an `_error` component where it stands,
and [`Document::diagnostics`](crate::Document::diagnostics) lists every
error, warning and lint finding by node (ADR 0013). Only a dependency
cycle, which no element can carry, fails the load with an
[`Error`](crate::Error).

## Reading

A loaded document reads as its build, [`Built`](crate::Built). Every
value is a cell, an `f64` in [`Built::cells`](crate::Built::cells), and
a renderer addresses everything by cell index (ADR 0001):
[`Built::value_types`](crate::Built::value_types) says what each holds (a
number, a boolean, text whose value is a string id, or math whose value
is a handle into the document's engine:
[`Document::math_text`](crate::Document::math_text) and
[`Document::math_latex`](crate::Document::math_latex) spell it).

Components are names for cells. The [`ComponentTable`](crate::ComponentTable)
holds them in columns: each component's type, name, parent and children
([`Child`](crate::Child)), the component a reference refers to
(`referent`, ADR 0024), and the cell of each prop. The helpers on
[`Built`](crate::Built) read it by component:
[`component_type`](crate::Built::component_type),
[`name`](crate::Built::name), [`children`](crate::Built::children),
[`prop_cells`](crate::Built::prop_cells) and
[`cell`](crate::Built::cell) (a prop's cell by component and prop name).
The browser binding hands the same columns to JavaScript as zero-copy
views.

Only what leaves the core is computed (ADR 0019). An *output* is a prop
a renderer reads, of a component that is rendered
([`Built::rendered_components`](crate::Built::rendered_components)), or a
score a grader reads; [`Built::output_cells`](crate::Built::output_cells)
lists them. A cell no output reads may hold no value at all. A renderer
reads only outputs: a prop it starts reading is marked `rendered` in its
type's block in the same change, or the core does not compute it.

Presentation the core keeps no state for (a style number, the decimals
to display, a width) is the source's literal attributes:
[`Document::attr_text`](crate::Document::attr_text) of a component, or
[`Document::literal_attrs`](crate::Document::literal_attrs) of every
element.

## Requests and actions

A renderer asks to change a cell with a [`Request`](crate::Request), or
moves points together with [`PointRequest`](crate::PointRequest)s, through
[`Document::request`](crate::Document::request) and
[`Document::request_points`](crate::Document::request_points). Only an
input's cells take one ([`Built::interactive_cells`](crate::Built::interactive_cells),
ADR 0018); a request on any other is refused. The
[`TickOutcome`](crate::TickOutcome) lists the cells that changed and the
requests dropped. When `rebuilt` is set, a repeat's count changed and
the document was built again: cell indices and the component table are
new, and a renderer reads them again from the start.

A submit and a trigger are actions, not requests:
[`Document::submit`](crate::Document::submit) submits an answer and
[`Document::trigger`](crate::Document::trigger) presses a
`<triggerSet>`, each one tick of its own.

## Saved state

[`Document::save_state`](crate::Document::save_state) writes the
essential cells a student changed as JSON, keyed by element and scope so
it survives a rebuild and, where
[`compare_versions`](crate::compare_versions) calls an edit safe, an
edit of the document (ADR 0017).
[`Document::restore_state`](crate::Document::restore_state) applies it to
a freshly loaded document. Only a core with the same
[`RELEASE`](crate::RELEASE) restores it.

## Changing what a renderer reads

The wasm binding is `crates/cells-wasm/src/lib.rs`; it exposes zero-copy
views of the cells and the component table (ADR 0001). The React side is
`packages/cells-viewer/src/`, and the core runs on the main thread. Graphs
are JSXGraph boards (`renderers/jsxgraph/`, ADR 0010) whose elements read
cells directly and redraw once per tick; Doenet's styling is copied into
`jsxgraph/doenet.ts`. A renderer reads only outputs: a prop it starts
reading is marked `rendered` in its type's block in the same change, or
the core does not compute it, and the viewer's test, which checks every
`CellStore.get` and `subscribe`, fails first (ADR 0019).
