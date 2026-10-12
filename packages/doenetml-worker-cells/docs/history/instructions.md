The goal of this prototype is to try out a new way to architect the DoenetML core. The current DoenetML core, found at https://github.com/Doenet/DoenetML, uses the user-facing idea of "components" to organize the underlying directed acyclic graph that powers Doenet's two way data binding. Here, we will prototype a design that breaks the symmetry between user abstractions and code abstractions. Instead, we will simply organize our DAG around the underlying data, which we are calling "cells".

Cells are just a value such as a double-precision float. Cells and collections of cells are nodes in the DAG. Some cells are Doenet's "essential data" - the minimum independent data needed to recreate the state of the document. Some cells are intermediate calculations done by the DAG. Some cells are values that will be passed to the renderer (a point x's coordinate).

By rearchitecture the system in this way, we hope to understand what performance gains can be achieved. For example: How fast can startup times be? How much data throughput can the system handle? How long of serialized dependency chains are still viable within the 50ms loop that happens when a user drags a point? (And any other performance questions that you think are relevant).

## Scope of the prototype

Only implement the skeleton of a couple of DoenetML tags: `<number>`, `<numberInput>`, `<graph>`, and `<point>`.

Do include a skeleton parser of a Doenet document file (You should be able to use or start with the existing parser, string document to DAST). The performance of the parser is not a focus.

Do include Doenet references, at both the component level (`$point1`) and on the prop level (`$point1.x`)

Do generate dependencies among components. Use stripped down versions of the relevant components's definitions. It's fine for now if dependencies only operate on single cells and not ranges of cells.

Do include renderers for the handful of components. If the format between renderers and Doenet core changes, that's fine.

Do write the Doenet core in Rust.

The only type allowed for state variables (and for cells) should be double-point floats.

Do include scaffolding for measuring the performance of different parts of the system.

Not in scope: any math expression trees. We will only do numerical computation.
Not in scope: loading essential data from previous attempts.

## Layout of the Cells

The cells should be stored in a list of doubles.

It's up to the system to map the component tree (DAST) to the cells.

Any state variable that exactly matches another state variable should use only one cell. For example, if point2's x coordinate is free and point2's y coordinate is point1's y coordinate, there should only be three cells for the coordinates.
