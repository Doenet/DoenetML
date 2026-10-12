The goal of this prototype is to try out a new way to architect the DoenetML core.

We've demonstrated that at a base level the generation, get, and update of cells is sufficiently fast. Now, it's time to broaden the scope of what cells can do and test whether this architecture holds for some _actual functionality_ that Doenet requires.

There are four main areas of concern:

1. Complicated inverses
2. Dependencies across different cell types
3. Array state variables and `<repeat>`s
4. Symbolic expressions

## Complicateed inverses

The prototype architecture breaks down dependencies into instructions, some of which are numerical operations. The question is: Is using the idea of operations and their local inverses expressive enough to capture behavior of complicated state variable inverses?

In the current Doenet core, definitions and inverse definitions are written by hand, so it's a wild west. Given that inverses in the current system tend to be quite convoluted, I want to test whether the prototype's performant and elegant system works for real inverses.

I recommend using `<slider>'s `value` prop in numerical mode (specified by from/to/step) as a use case. Its inverse doesn't do much work itself. What makes it complicated is that it starts a chain of inverses through other state variables, and the chain changes the value it was asked to set.

1. value → index (invertSliderValue, Slider.js:841). The requested value is snapped to the nearest valid step with round((v - from) / step), then clamped to [0, numItems-1] (findIndexOfClosestValidValue, Slider.js:768). A non-finite value returns success: false. So the inverse is lossy: ask for 3.7 and you may get 4.
2. index → preliminaryValue (Slider.js:502). This step rejects a non-integer or out-of-range index with success: false. Otherwise it sends from + index \* step down to preliminaryValue.
3. preliminaryValue → storage (Slider.js:429). This step branches:
   - If the slider has bindValueTo, it sends the value on to the other component's value. That component's own inverse then runs, so the chain crosses into another component.
   - If not, it saves the value as the slider's own stored (essential) value.

## Dependencies across different cell types

It is likely that we will want some cells to be types othen than double precision floats - most likely, integers. How do dependencies that convert across types work? What are the implications for how we lay out the cells? Can we maintain the same performance?

## Arrays of cells

Real Doenet documents don't just operate on dependencies around single values. They also have "array state variables" such as $point1.coords, and sometimes the dependencies are scoped in different ways. For example, maybe a point depends on the first element (the x coordinate) of another coord.

Also, Doenet has tags that repeat their child components an arbitrary number of times. You could have a graph with N different points and N is determined by a numberInput so the points can grow or shrink. And maybe there is a dependency on the 32nd point, which sometimes exist and sometimes doesn't. Or maybe every point in the repeat depends on the point two iterations ago. How do we deal with this in the cell architecture?

Look at: `<mathlist>`, `<repeatForSequence>`, `<repeat>`

## Symbolic expressions

Finally, there is a question of symbolic expressions.How do we deal with symbolic expressions while keeping performance? How do symbolic expressions interface with the cell architecture?

For example, a very specific question (and not necessarily an important one) is it worth differentiating between a `<math>` for computation and a `<math>` for symbolic expression. The current Doenet core does not differentiate between a `<math>` meant to be computed and a `<math>` whose derivative will by compared against a simplifed form of a math input, but maybe we should?

## Conclusion

The ultimate goal of this prototype is to test out a cell architecture and determine if it's a promising rearchitecture. We want to make sure that there aren't any major snags implicit in the cell architecture that will cause problems for the functionality Doenet actually requires.

The two general principles you should hold when considering the above question are: performance and simplicity.
