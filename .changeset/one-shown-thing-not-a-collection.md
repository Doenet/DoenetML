---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/doenetml-headless": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

**Breaking:** a `<conditionalContent>`, and a `<select>` or other chooser that picks one, is no longer a collection. Each stands for what it shows, and a reference whose meaning would change with what is shown is an error:

- **An index after a `<conditionalContent>` or a one-pick chooser reaches into what it shows**, as after a `<group>` of one. With a case holding `<math>(1,2)</math>`, `$cc[2]` is `2` and `$cc[1]` is `1`; before, `$cc[1]` was the case itself and `$cc[2]` named nothing. With a pick of `<point>(3,4)</point>`, `$s[1]` is `3`; before, it was the point. A one-pick chooser is a `<select>`, `<selectFromSequence>`, `<selectRandomNumbers>`, `<selectPrimeNumbers>`, `<sampleRandomNumbers>` or `<samplePrimeNumbers>` whose `numToSelect` (or `numSamples`) is left out or written as `1` (one written with `copy` picks one only when it writes `numToSelect="1"` itself); `$s[1]` of a one-pick `<selectFromSequence>` indexes its one number, so it names nothing. Write `$cc` and `$s` for what they show. A chooser that picks several is unchanged.
- **Neither has a `numItems`** any more: `$cc.numItems`, and `$s.numItems` of a one-pick chooser, name nothing.
- **Such an index is an error when the document loads** (`doenet-e0095`), in the reference's place, bare or on a tag, unless every case (or option) holds at most one component, all of one type: a case holding several components, or a math in one case and a text in another, is decided whichever case is shown, and in every variant. A tag made from an index into components of one type is type-checked when the document loads, as `<boolean extend="$cc[1]"/>` of cases holding a math (`doenet-e0065`).
- **A name some case or option lacks, such as `$cc.x`, is an error** (`doenet-e0093`), shown in the reference's place, where it was a warning with a blank (`doenet-w0183`). A name of different types in two cases stays an error in the reference's place, now under an error's code, `doenet-e0094` (it was `doenet-w0184`, reported at error level). The same holds for `$s[2].x` after a select that picks several, and for a name after a `<repeat>`'s value whose items each hold several components.
- `$cc` while no case is shown, or while the case shown is empty, shows nothing, as before; a tag made from it is missing, and an index into it names nothing.
- `<repeat extend="$cc[1]"/>` of a case holding a repeat is its first iteration, so it is `doenet-e0071` when the document loads. For a list held alone in a case, `doenet-e0064` now suggests `$cc[1]`.
- No path reaches the case or pick itself by index any more, so a component in one that has no name of its own has no index-based id (`cc:1:2`) or, in `@doenet/doenetml-headless`, no stable key (`s[1][1]`): give it a name. Editor completions and help no longer offer a case's or option's names after an index (`$cc[1].`, `$s[1].` of a one-pick select).

Closes #2673.
