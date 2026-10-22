// JSXGraph's stand-in where a document is rendered to HTML outside a
// browser (the tests here, and the server build). JSXGraph reads `window`
// as soon as it is imported, so it cannot load in Node; and rendering to
// HTML needs nothing of it, since a board is drawn only in a layout effect
// (`renderers/jsxgraph/Board.tsx`), which a server does not run. What is
// rendered for a graph is its container, sized, and empty.
export default {};
