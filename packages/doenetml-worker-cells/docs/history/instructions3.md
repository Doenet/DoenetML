In this stage of the prototype, the goal is to evaluate how far the "definitions and inverses as operations" model can be pushed to work for actual DoenetML components.

Considering that hand-written definitions are already "operations" by virtue of being executed by the computer, the real question is: if we express _inverses_ as local operation inverses, how much of DoenetML's inverse functionality can we match?

## Sub-question: build time vs compute time

The current hand-written DoenetML inverses are complicated. `<line>` and `<circle>` are two prime examples of this complication. Some of this complication may actually be "build time" complication. In other words, there are many different ways to define lines and circles in the DoenetML language, and the inverse's complication is due to dealing with all those possibilities.

Right now, we do not know whether the line and circle are _inherently_ complicated or whether their complication can disappear with a rearchitecture.

## Sub-question: inverses with context?

A second scenario to look out for is one in which an inverse _inherently_ requires more context than the current "local operation inverse" model gives it. I'm not sure if this scenario will actually happen, but I would like to know if it does and why.

## Test case

Implement `<line>` and `<circle>`, including all the various ways that those can be set up. Also implement any tag that you think has a complicated inverse and whose complication might stem from different reasons than the line and circle.

The current JS core already has a significant body of tests that cover the functionality of these components. Test our prototype against those tests to make sure we are preserving the same behavior.
