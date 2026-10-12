In this stage of the prototype, investigate how symbolic math expression might fit into the cell architecture.

# Guiding questions

1. What is the best case performance we can expect in documents that heavily rely on symbolic expression manipulation?
2. What should the interface be between the symbolic expression logic and the main compute logic? Are there any performance gains from combining the two systems together or from designing the interface in a certain way?
3. What is a good memory layout for expressions? How does it relate to the memory layout of the cells?
4. What cases are there in Doenet documents where we can bound the amount of "manipulation" that will have to happen at build time?
5. How do we deal with scenario where the symbolic maninpulate is interleaved with cell dependencies?

# Math expressions functionality

To understand what kinds of symbolic manipulation Doenet documents need, look on Github at Doenet/math-expressions, the library the current JS core uses. Do not assume that symbolic logic we use will be implemented the same way as in the current math-expressions. Only use math-expressions as a reference for final behavior we desire.

# Artefacts

The output of this stage should be one or more paired-down implementations of some symbolic manipulation into this prototype and performance data on the results.
