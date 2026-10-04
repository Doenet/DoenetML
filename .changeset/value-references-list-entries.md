---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

A reference to one entry of a list used only for its value, such as `$l[$i]` inside `<math>$l[$i]+1</math>` or inside a `<repeatForSequence>`, now resolves its own reference instead of being made by a copy component. This applies to lists whose entries always have one type: `<numberList>`, `<mathList>`, `<tupleList>`, `<textList>`, `<booleanList>`, `<sampleRandomNumbers>`, `<selectRandomNumbers>`, and the list operators `<sortIndices>`, `<tally>`, `<binCounts>`, `<indexOf>`, `<searchSorted>`, `<cumulativeSum>`, `<cumulativeProduct>`, `<cumulativeMin>`, `<cumulativeMax>` and `<differences>`. A reference written between the brackets, such as the `$i` of `$l[$i]`, is also one small component when it refers to a number, where it used to be a copy and an integer. Documents that index lists inside a repeat, such as dot plots, load faster and use less memory. What the reference shows is unchanged as the index changes and as the list grows or shrinks, and a write through it still reaches the list. An index past the end of a list no longer reports a "Could not find prop" message beside its "No referent found" warning.
