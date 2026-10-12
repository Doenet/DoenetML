In this stage, the goal is to test out how "conditional tags" such as `<select>` and `<conditionalContent>` fit into the prototype. We want to find solutions that keep the system simple and performant.

In the current JS core, conditional tags add tremendous flexibility, but they also limit the core's ability to reason about what is happening. We want to avoid the gnarliest spiraling consequences that open up categories of bugs and system complexity. But we also want to allow authors to express the structures they need.

Changes to the DoenetML language itself are not off the table.

## Underlying author use cases

There are two general buckets of use cases for conditional tags:

1. Local changes where each option roughly mirrors the others. Examples: picking from a list of animals, changing your wording based on the student's answers.

2. Broad changes where the choice drastically alters the document. Examples: "choose your own adventure"-style documents, problems where some students get a word problem and some students get a visual problem.

Right now, both use cases are expressed using the same tags. What are the implications if we separated them out into different tags? Are there different rulesets and would those differences allow us to keep the system simpler and faster?

## Banned flexibility

Some scenarios that are allowed in the JS core should certainly NOT be allowed in the prototype. No document should allow one reference name to change types when the conditional branch changes. Example:

```
<numberInput name="ni" />
<conditionalContent name="cc">
<case where="$ni = 1">
    <math name="x">a + 2 * b</math>
</case>
<else>
    <text name="x>Hi there</text>
</else>
</conditionalContent>

$cc.x
```

`$cc.x` is either a `<math>` or a `<text>`. This is not only flexibility the system has to account for, it is also confusing to authors.

Find similar situations where the JS core allows flexibility that we do not really need.

## Criteria of success

This stage will be considered a success if it does all of the below:

- extends the prototype to support both author use cases
- does not substantially increase document load time, tick time, and memory usage
- does not substantially increase the ambient complexity of the prototype
