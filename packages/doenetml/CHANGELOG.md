# @doenet/doenetml

## 0.7.27

### Patch Changes

- 9415cc1: A reference to a list keeps the list's commas, and the whitespace an author writes around the items of a list no longer lands in front of a comma.

    `$r[1]` and `$g` showed `1234` where the composite they name showed `1, 2, 3, 4`, in the rendered list and in `text` alike. A reference that lands on a composite copies its replacements, and did so recursively down to plain components — which is what makes `$mp[1]` reach the point inside a repeat item rather than the `<setup>` beside it — but recursing that far also flattened away every composite in between, and with it the `asList` that made the replacements a list. The recursion now stops at a composite that can be a list of its own, so the reference copies that composite and the list survives; composites that cannot be a list are still recursed through, so what a reference resolves to is unchanged.

    Whitespace at the end of a list item no longer lands in front of the comma that follows it. `<group asList><group><number>1</number> </group><group><number>2</number> </group></group>` read `1 , 2` and now reads `1, 2`.

    The whitespace an author puts between the items of a list group is where the commas go, in `text` as in the rendered list. `<group asList><number>1</number> <number>2</number></group>` had a `text` of `1, , 2`; it now reads `1, 2`, and an empty composite among the items, such as a sequence of length zero, changes nothing.

    Underneath, the commas were being worked out four times over from the same data — once for the renderers, once for `text`, once for the string a `<math>` parses, and once for the FlatDast the prototype renderers read. Those four now share one implementation of the grouping, so where the commas go is decided once for all of them.

- a9828c1: Add hypergeometric, binomial, and Poisson distributions to `<sampleRandomNumbers>` and `<selectRandomNumbers>`.

    Until now the only distributions available were `uniform`, `discreteUniform`, and `gaussian`, so there was no way to sample count data without building it by hand.

    `type="hypergeometric"` counts the successes obtained when drawing `numDraws` items _without replacement_ from a population of `numTotal` items containing `numSuccesses` successes. `type="binomial"` counts the successes in `numTrials` independent trials that each succeed with the given `probability`, defaulting to a single fair trial. `type="poisson"` is determined entirely by its `mean`, which defaults to 1 rather than the 0 that `gaussian` uses, since a Poisson distribution with mean 0 always returns 0.

    The `mean`, `variance`, and `standardDeviation` properties report the exact values for each new distribution. Invalid parameters produce `NaN` for both the samples and those properties, along with a warning describing what is wrong. Those warnings are shown wherever the document's other warnings are, rather than only in the browser console; the long-standing warning about an invalid `gaussian` mean or standard deviation is now shown there too.

    Because these distributions are drawn one item, trial, or event at a time, parameters that would need more than ten million draws for a single sample are refused the same way impossible ones are, rather than leaving the page unresponsive while they ran. The limit is far above any population, trial count, or rate that arises in practice; it is there so that mistyping an extra digit reports a problem instead of freezing the activity. Parameters an order of magnitude below it are still sampled as asked, with a warning that sampling may be slow.

    A fractional `numSamples` now draws the same count from every distribution, rounding up as `uniform` always has. Alongside unusable parameters — a `gaussian` with a negative `variance`, say — a fractional count used to break the document instead of reporting `NaN`.

    Counts must also be whole numbers small enough to stay exact — up to about nine quadrillion. Past that, neighboring whole numbers stop being distinguishable, so drawing from such a population would not do what it says; it is refused rather than sampled.

    The new distributions draw with the generator's full precision rather than its default 32 bits, so a success rarer than about one in four billion — a large population with few successes, or a very small `probability` — happens as often as asked rather than being rounded up to that floor. The hypergeometric is exact for every population it accepts; a `binomial` `probability` below about one in nine quadrillion is smaller than any value a draw can take, so it occurs at that floor instead, which would take on the order of nine quadrillion samples to notice.

    A `gaussian` whose spread or center describes no distribution now reports `NaN` for `mean`, `variance` and `standardDeviation`, as the other distributions already did, instead of reporting a plausible-looking spread beside `NaN` samples; an infinite spread is recognized as unusable rather than sampled. The explanation also survives a reload, and `<selectRandomNumbers>` holds its distribution parameters fixed alongside the selection they produced.

- bb9c5a2: Fix two defects in the automatic commas placed between the replacements of a list composite.

    A `<math>` containing a list next to a component froze the document. To decide whether the comma-separated list needs parentheses around it, the core looks at what sits on either side of it, walking past whitespace to find it — but that walk never advanced its index, so it never ended when the neighbor was a component rather than a string. `<math><number>3</number> <numberList>1 2</numberList></math>`, and the same with the list first, both hung.

    Commas also appeared around a replacement that cannot be a list item, whenever the composite was not the first thing in its container. A composite holding something that can't be part of a list — a `<me>`, say — is shown without commas, but the record of which replacements are eligible was kept in step with the parent's children rather than with the composite's own, so the answer slid by however far the composite sat from the start. `<p><group asList><numberList>1 2</numberList><me>x</me></group></p>` was correct while `<p>lead <group asList><numberList>1 2</numberList><me>x</me></group></p>` was not.

- d7b0338: Add list operators: cumulative scans and index-returning operators.

    Every math operator in DoenetML reduced a list to a single value — `<sum>`, `<min>`, `<mean>` and the rest. Nothing turned a list into another list, and nothing reported a _position_ within a list. That left ordinary tasks with no reasonable expression: a running total had to be hand-rolled with `<repeat>`, and "which entry is this?" could not be asked at all.

    Ten new components, in two families.

    **Cumulative scans** map a list to another list of the same length: `<cumulativeSum>`, `<cumulativeProduct>`, `<cumulativeMin>`, `<cumulativeMax>`, and `<differences>` (which is one shorter, and undoes `<cumulativeSum>` apart from its first value). They accumulate numerically when every input is a number and symbolically otherwise, so `<cumulativeSum>x y z</cumulativeSum>` gives `x, x+y, x+y+z`. The result is an ordinary list: `$cum[3]`, `<sum>$cum</sum>` and `<numberList>$cum</numberList>` all work on it, and rounding attributes pass through to each value.

    **Index-returning operators** report a position rather than a value: `<argMin>`, `<argMax>`, `<indexOf>`, `<searchSorted>` and `<sortIndices>`. Indices are 1-based to match `$list[1]`, and `0` means "no such element". These are not math-only — they order values exactly as `<sort>` does, comparing numerically when every value is numeric and alphabetically otherwise, so `<indexOf type="text" target="Cal">$names</indexOf>` searches a `<textList>` as readily as `<argMin>` scans a `<numberList>`.

    The `target` of `<indexOf>` and `<searchSorted>` is a _list_, and the result has one position per target, in the manner of `np.searchsorted(a, v)` with an array `v` and R's `match()`. A single target still reads as a single index — it renders inline and indexes another list, so `$pop[$which]` works as before — but a thousand targets are searched by one operator rather than a thousand. Each result is still its own `<math>`, so the results scale with the targets; what does not scale is the searching. That is what makes these usable on the output of `<sampleRandomNumbers>`: searching a large sample by wrapping it in a `<repeat>` builds a whole operator, with its own dependencies and its own result, for every draw, and stops being practical long before the sample is big enough to be interesting.

    The index family is worth more than its parts because DoenetML already indexes by reference, so a returned index composes with every list in the document:

    ```xml
    <numberList name="scores">72 91 65 88</numberList>
    <textList name="names">Ann Bob Cal Dee</textList>
    <argMax name="best">$scores</argMax>
    <p>Top scorer: $names[$best]</p>
    ```

    `<sortIndices>` extends `<sort>` and accepts everything it accepts, including `sortByProp`, so `$names[$perm[1]]` sorts one list by another list's ordering — which `<sort>` alone cannot express, since it returns the values it sorted and discards where they came from.

    Together, the two families make sampling from a weighted population a matter of three lines: accumulate the weights, draw uniformly from the total, and look up which bucket each draw landed in. Raising `numSamples` here changes nothing but the number of results.

    ```xml
    <numberList name="pop">30 45 12 60</numberList>
    <cumulativeSum name="cum">$pop</cumulativeSum>
    <number name="total"><sum>$pop</sum></number>
    <sampleRandomNumbers name="draws" type="discreteUniform" from="1" to="$total" numSamples="500" />
    <searchSorted name="which" target="$draws">$cum</searchSorted>
    ```

    The value extraction that decides how `<sort>` compares its children now lives in one shared place, so `<sortIndices>` and the index operators agree with `<sort>` by construction rather than by coincidence.

    Sharing it also fixes a second bug, in `<sort>` and `<shuffle>`: an explicit `type` used to be forced onto reference children as well as bare strings, which fused a referenced list into the single string it renders as. `<sort type="text">$names Zoe</sort>` sorted the two values `"Ann, Cal, Bob"` and `"Zoe"` rather than the four names, and `<shuffle type="text">$names Zoe</shuffle>` had only two things to shuffle. A reference already carries a type of its own, so it is now passed through untouched and `type` applies only to the bare strings it was meant for. The one behavior this removes is coercion of a reference to a different type — `<sort type="number">$aTextComponent</sort>` no longer reads that component as a number.

    Sharing it also fixes a bug in `<sort>` itself, so `<sort type="boolean">` now renders differently than before: `type="boolean"` has always been an accepted type, but a boolean child had no comparable value and was silently skipped, so `<sort type="boolean">true false</sort>` rendered nothing at all. Boolean children are now ordered as text, which puts `false` before `true` — the same order `<indexOf>` uses when its `target` is a boolean. `<shuffle type="boolean">` was never affected, since it rearranges its children without comparing them.

    Two ways of getting a 0 out of an index operator say so, since neither is a position and the result alone does not distinguish them. Omitting `target` on `<indexOf>` or `<searchSorted>` is a warning — no document written that way can ever produce an answer. Having no values at all to look through is an info message, since a list driven by an input can legitimately be empty for a while. A target that is simply absent from the list is _not_ reported: that 0 is what `<indexOf>` is for, and a `target` bound to an input would otherwise raise one message for every value typed on the way to the right one. Nor is an empty _list_ of targets reported — it produces no positions, which is the honest answer to a question about nothing.

    The `type` attribute of `<sort>`, `<shuffle>` and the five index operators now declares the values it accepts — `number`, `math`, `text` and `boolean` — so the editor offers them, the reference pages list them with descriptions, and writing anything else is flagged rather than only warned about once the document runs. The set is unchanged; it was simply never declared.

    Finally, the reference pages for `<sort>`, `<shuffle>` and the sequence components (`<sequence>`, `<selectFromSequence>`, `<repeatForSequence>`, `<animateFromSequence>`) now open on the handful of attributes that actually define what the component does, rather than on an undifferentiated list. `<sort>`'s three ways of choosing what to compare are gathered under a "Sort order" heading of their own.

    Closes #1816. Closes #1817. Closes #1823. Closes #1831.

- 0281713: Add `<sampleMultivariateRandomNumber>`, which draws a vector-valued random number.

    Every existing sampling component produces numbers that are independent of one another. This one draws a single sample whose numbers are drawn _together_: `numInCategories` describes a population split into categories, `numDraws` items are drawn from it without replacement, and the component expands to one number per category giving how many of the drawn items came from each. The counts always sum to `numDraws`.

    ```doenet
    <p>An urn holds 5 red, 3 blue, and 2 green marbles. Draw 4 without replacement:</p>
    <p><sampleMultivariateRandomNumber name="draw" type="hypergeometric" numInCategories="5 3 2" numDraws="4" /></p>
    <p>Red: $draw[1], blue: $draw[2], green: $draw[3]</p>
    ```

    The `numCategories`, `numTotal`, `means`, and `variances` properties describe the distribution, and the `resample` action draws a fresh set.

    `type` accepts only `hypergeometric` so far, and is required rather than defaulting to it. It is unlikely to remain the most natural default — a joint normal distribution is the more usual multivariate one — so naming the distribution in every document means adding others later cannot change what an existing document does.

    Invalid parameters produce `NaN` for the samples and for `means` and `variances`, along with a warning describing what to change; `numCategories` and `numTotal` go on reporting the population the component read. Because each category is drawn in turn, parameters that could need more than ten million random draws for a single sample are refused the same way, instead of leaving the page unresponsive while they ran.

    Counts must be whole numbers small enough to stay exact — each category, the population they add up to, and `numDraws` all up to about nine quadrillion. Past that, neighboring whole numbers stop being distinguishable, so drawing from such a population would not do what it says; it is refused rather than sampled.

    Each category's count is drawn as a hypergeometric against the part of the population not yet accounted for, so the whole vector is drawn exactly, with no smallest probability it rounds away, for every population accepted.

- 279b2b6: Stop two core traversals from taking exponential time when composites nest inside one another.

    A repeat whose iterations refer to the previous iteration, as in

    ```xml
    <numberList name="vals"><sequence from="1" to="16" /></numberList>

    <repeatForSequence from="1" to="16" valueName="i" name="cumSums">
      <number><conditionalContent>
        <case condition="$i=1">$vals[1]</case>
        <else>$cumSums[$i-1] + $vals[$i]</else>
      </conditionalContent></number>
    </repeatForSequence>
    ```

    hung the document rather than loading it. At 8 iterations it took 4 seconds and at 10 it took 3 minutes, with each further iteration multiplying the cost by about four, so the 16 iterations above would have needed several days.

    The cost was not in evaluating the recurrence. Components form a directed acyclic graph rather than a tree: a composite's replacements are spliced in as children of the composite's parent while the composite goes on pointing at them as replacements, so the same component is reachable along several paths. Each iteration of the repeat above adds a `<conditionalContent>` → `<group>` → copy chain, which makes the previous iteration reachable four ways, and two traversals walked every path separately:

    - `allPotentialRendererTypes`, which collects the renderers a document may need to load, recursed into children and into replacements. It now walks each component once, which loses nothing because every path contributed to the same set of renderer types.
    - `ancestorsIncludingComposites`, used when propagating dependency blockers, walked up both the parent chain and the chain of the composite a replacement came from — chains that converge on the same ancestors. It now remembers the ancestors it has already worked out for a component.

    The renderer types collected are unchanged. The example above loads in a few seconds, and cost now grows with the number of components rather than exponentially.

    Documents that nest composites only a few deep — the overwhelming majority — were never affected and are unchanged.

- c7803ee: Finish resolving a reference that indexes into a repeat nested inside another repeat.

    With the repeats inside a `<p>` or any other element, a reference to an inner item written directly in the document dropped its last index. `$a[2][1][3]` and `$a[2].b[3]` returned the whole inner repeat — all three of its items rather than the third — and `<number extend="$a[2][1][3]" />` written that way came out as `NaN`, since it was extending three items rather than one. The same references written inside a `<p>` of their own, or as the content of a `<number>`, were already correct: those are resolved after the repeats have expanded, and so never passed through the intermediate state that got stuck.

    A reference resolved before the repeat it indexes into exists gets a provisional answer, to be resolved again once that repeat expands. The second resolution did run and did find the right component, but the reference kept the component it had been paired with the first time: the flag marking it as mid-resolution was left set when an attempt gave up early, and while that flag is set the reference is never told to rebuild what it points at. The flag is now cleared however the attempt ends.

- ae0b2c9: Stop warning that a repeat's `valueName` has no referent when a reference lifts it out of the repeat.

    Referencing one iteration of a repeat, as in

    ```xml
    <repeatForSequence from="1" to="5" valueName="i" name="xiValues">
      <number>$i</number>
    </repeatForSequence>
    <m>x_3 = $xiValues[3]</m>
    ```

    copies the iteration's `<number>` — and the `$i` inside it — to where the reference appears. The copy was then re-resolved from where it landed, and `i` lives inside the repeat, invisible from the `<m>`, so the document reported "No referent found for reference: `$i`" even though the reference had resolved and the value showed correctly. The warning went away if the reference or the `<number>` wrapper was removed, which is what made it look spurious.

    Re-resolving from where a copy lands is what lets each iteration of a repeat bind `$i` to its own value, so that stays. A copy that lands somewhere the name is out of scope now falls back on resolving the reference where the component it shadows sits — which is where the reference came from and still points — and keeps falling back however many times the reference has been copied, so referencing the `<m>` above stays quiet too.

    A reference that resolves nowhere still reports the same warning it always did, at the same place.

    Closes #1424.

## 0.7.26

### Patch Changes

- 5872790: A `handGraded` answer no longer stops a `<cascade>`, and no longer holds a
  section's title banner gray.

    A hand-graded answer keeps a credit of 0 until an instructor grades it, which
    happens well after the reader is done with the document. A cascade step
    containing one therefore never reached full credit, and the reader was left
    there with no way forward however much they wrote.

    Such an answer now counts as complete as soon as the reader submits a response
    that is not blank; submitting an untouched input does not count, except for a
    `<booleanInput>`, whose unchecked box is itself an answer. The same rule colors
    the title banner of a `boxed` or `collapsible` section, so a section whose
    questions have all been answered shows as completed rather than waiting for a
    grade the reader cannot see.

    The new `completedColorRequiresCredit` attribute opts a section's banner back
    into waiting for the real credit, and is inherited by the sections within it.
    It affects only the color, never when a cascade advances. Either way the
    reported `creditAchieved` is unchanged — a hand-graded answer is still awaiting
    its grade.

- fd6ce8f: An attribute that refers back to the component it is on is reported as a
  circular dependency instead of hanging the page.

    `<selectFromSequence name="a" from="1" to="10" numToSelect="2" exclude="2$a[1]"/>`
    asks for a selection that cannot be made until the exclusion is known, and an
    exclusion that cannot be evaluated until the selection is made. The two chased
    each other — no warning, no error, the tab growing until it ran out of memory —
    and the same happened for any attribute written in terms of the component's own
    values: `<sequence name="a" from="1" to="10" exclude="$a[1]"/>` among them, and
    the matching shapes on `<select>`, `<repeat>`, and `<conditionalContent>`.

    Doenet had recognized the cycle all along and raised its usual error naming the
    components involved; the error was being dropped rather than reported, because
    the step that raised it was started and never waited for. It is waited for now,
    so the cycle is reported.

    The report arrives as the document's failure, which is what a circular
    reference has always done — `<math name="m">$m</math>` fails a document the
    same way. Confining the report to the component at fault, as a composite that
    reports a cycle in its own replacements manages to, is left for later.

- b70a5c6: The context-sensitive help explains what a `width` or `height` accepts.

    With the cursor on one of these attributes, the help panel now lists the forms its value
    may take — `600`, `600px`, `6in`, `450pt`, `15cm`, and, for a width, `50%` —
    along with a note naming the unit each carries. Each attribute is offered only
    what it honors: a height gets the absolute forms, since a percentage there has
    no page height to measure itself against, and a `<sideBySide>` width gets the
    percentage, since it divides a row into shares. The `width` of a `<graph>`,
    `<image>` or `<video>` is marked as choosing the nearest `size` preset rather
    than being used exactly.

    The panel keys off the attribute's type rather than its name, so every attribute
    taking a single size is covered. A size default also reads as `120px` now,
    instead of as the internal `{"size":120,"isAbsolute":true}` — in the reference
    tables as well as the panel.

- c39ee37: Offer a retry when a document's core cannot be started.

    The failure pane advised reloading the page, which is the wrong advice on the page that produces most of these failures: a section that starts many documents at once on a slow device. Reloading restarts all of them, and the reader who tried it was worse off the second time.

    A failed document now offers **Try again**, which starts that one document over — a fresh saved-state load and boot ladder, without reloading the page or re-parsing the bundle — and shows that it is working rather than leaving a blank pane while it boots. The message beside the button leaves out the reload advice, and still names contention when that is what the failure is attributable to.

    The offer is made once per document. A retry that fails too is shown the previous message, whose advice to reload is by then the honest next step, and no further button — so the reader is never left clicking at a document that will not start. A viewer handed a different document — an editor recompile, a host moving on to the next activity — starts the count over.

    Both panes are announced now, since a reader who cannot see them is otherwise told nothing about what their click did: the button removes itself when clicked, so the "Initializing…" pane that replaces it reports politely that the retry is working, and the failure pane interrupts the way a failed renderer already does.

    A message raised while a document was still starting no longer outlives it: a host that reports it cannot produce the saved state puts its message where the document would be, and a document that then starts is no longer left behind it.

    A boot-scheduling host needs no changes to keep up: a retry that succeeds reports `initializedCallback` as any boot does, which is what clears the `failed` mark the `@doenet/standalone` coordinator put on the activity, and a retry that fails reports `coreStartFailedCallback` again.

- 59a59e0: Editor: keep offering element names when the character after the cursor cannot be part of a tag name.

    Typing `<` opened the element menu, and typing the first letter of the tag name emptied it, whenever the character immediately following the cursor was one that ends a tag name, such as `}`, `{`, `)`, `]`, `$`, `&`, `%`, or `\`. The menu now stays open and filters by what has been typed, as it does when nothing follows the cursor.

    The case that surfaces this is a tag typed inside a brace group of typeset math, such as an input in the bounds of an integral: because the editor closes brackets as you type, `<me>\int_{` is already `<me>\int_{|}` by the time you type `<`, so every tag written there hit this.

    The context-help panel follows the same correction: while you type such a tag name it now describes the element being named, rather than listing the elements allowed inside it.

    Closes #1767.

- fc5cbf3: Render a `<textInput>` or an inline `<choiceInput>` in place inside typeset math.

    An input written inside `<m>`, `<me>`, `<men>`, or an `<mrow>` of an `<md>` is now drawn where it is written, inside the typeset expression, instead of being flattened to its current value. The motivating case is an aligned `<md>` derivation where the reader fills in the missing step in the place that step belongs; the rows stay aligned around the input, because the space it needs is measured before the display is typeset.

    Not every input can be embedded. A `<choiceInput>` that is not `inline` or an `expanded` `<textInput>` is too large to sit in a line of mathematics, a `<textInput>` with a relative `width` (`%` or `em`) has nothing to measure against, and math drawn on a graph is a single picture with no room for a control; each of those also renders as it did before, and now warns that the input is not being drawn inside the expression.

    The public `latex`, `text`, and `math` properties still report a filled-in input's value — for a choice input, the choice it has selected, which previously contributed nothing — so `$m.latex` remains the static rendering of the expression, and an input left empty now leaves a blank there instead of nothing. Previously it contributed nothing at all, which did not leave a gap so much as delete a term: `<m>x = <textInput/> + 3</m>` produced `x =  + 3`, in which the `+` is no longer an operator but a sign. It now produces `x = \underline{\hspace{2em}} + 3`; `text` reads `x = ＿ + 3`, and `math` keeps its shape as `x = ＿ + 3` rather than collapsing to a bare placeholder.

    A PreTeXt export writes those blanks out as `<fillin>`, the element PreTeXt's own content model provides for them, so an exported worksheet shows a gap where the reader is meant to write. An input the reader has already filled in exports its value instead.

    An embedded input is described to a screen reader by the expression it sits in — `<m>x = <textInput/> + 3</m>` reads as "x equals blank plus 3" — unless the author names it with a `<shortDescription>`, a `<label>`, or a `<label for>`. Its visible label is not drawn, since there is nowhere inside an equation to put it; a `<label>`'s text becomes the input's accessible name instead, and a `<shortDescription>` given alongside it remains its description.

- df46355: Render a `<mathInput>` in place inside typeset math.

    A math input written inside `<m>`, `<me>`, `<men>`, or an `<mrow>` of an `<md>` is now drawn where it is written, alongside the text and choice inputs that could already be. The motivating case is an aligned `<md>` derivation in which the reader writes the missing step, as mathematics, on the line that step belongs to.

    A math input is the one input that grows as the reader types — in both directions, with the caret inside it — which is why it could not be embedded before. The room reserved for the field follows it exactly, growing and shrinking with it, and the expression is re-typeset around it in the same frame as each keystroke when that is cheap enough — which it is for an expression of ordinary size — and a beat behind when it is not, so that a large display does not hold up the typing. A centered display recenters as the field grows, by half of each character; drawn in step with the keystroke, that reads as the expression breathing rather than jumping. The input keeps its caret while the expression is re-typeset around it. An author who places a reference such as `$mi.immediateValue` _before_ the input in its row should expect the input to move over as it is typed into.

    `<mathInput>` gains a public `latex` property, the committed value written as LaTeX. This is what a field embedded in an expression contributes to that expression's `latex`, `text`, and `math` — so `<m>x = <mathInput/></m>` reports `x = \sqrt{2}` rather than the plain-text `x = sqrt(2)` it would otherwise have reported — and it is available to authors in its own right, as `<math>` has had it.

    A field left empty leaves a blank in those properties, and a PreTeXt export writes it out as a `<fillin>`, exactly as an empty text input already did. Inside an expression the field's visible label is not drawn, since there is nowhere in an equation to put it; the expression names the field to a screen reader instead, unless the author names it with a `<shortDescription>`, a `<label>`, or a `<label for>`. The typeset preview, when an author asks for one, opens above the field rather than beside it, where the rest of the equation is.

    Math drawn on a `<graph>` is a single picture with no room for a control, so a math input there renders as it did before, and now warns to say so.

- b70a5c6: An expanded `<textInput>` carries its check-work button beneath it.

    An expanded input fills the width it is given, so a button beside it was
    squeezed against the right margin, its label wrapping onto a second line that
    the button's fixed height then clipped. The button now sits under the input, as
    it already does under the choices of a non-inline `<choiceInput>`, and it is the
    full labelled button by default there — `forceFullCheckWorkButton` is no longer
    needed to get one, and `forceSmallCheckWorkButton` asks for the compact one. A
    word-sized input is unchanged: its small button still rides beside it on the
    line. An expanded input's `<description>` popover moves under it too, travelling
    with the button.

    Every check-work button now grows to hold a label that wraps, rather than
    clipping it, which a long translated label could run into anywhere.

- b70a5c6: An expanded `<textInput>` is sized by its `width` and `height` again.

    The textarea an expanded input renders had dropped both dimensions from its
    style, so it fell back to the browser's default box — about twenty columns and
    two rows — no matter what was authored, and `width` and `height` did nothing.

    An expanded input now also takes a relative width: `width="50%"` is half the
    column it sits in, where before a percentage resolved against the input's own
    shrink-to-fit row and produced an arbitrary size. Its default width is now 100%
    rather than 600 pixels, and it never grows wider than the column even when an
    absolute width asks for more, so it shrinks to fit a narrow window. The width of
    a word-sized (not `expanded`) input is unchanged.

    On a `<graph>` a text input is drawn as a one-line field however it is written,
    so `expanded` no longer changes its size there: it is the same width as any
    other input on the graph. A percentage width has nothing to be a share of on a
    graph, so an input given one falls back to the word-sized 100 pixels rather than
    to the arbitrary size it used to get.

    The reference table and the help panel now name the two defaults, and say that
    `height` applies only to an expanded input.

- fba4ff8: Export an `expanded` `<textInput>` as room to write on, rather than as a one-line blank.

    An expanded text input is a text area for a long answer, so on paper it should be blank space, not the short `<fillin>` rule a one-line input exports as. This covers a hand-graded `<answer type="text" handGraded expanded />`, which sugars in such an input. PreTeXt writes that space as a `workspace` attribute on the block the space follows, and only leaves the space inside a printout division — so a document holding an expanded input is exported as a `<handout>`: either the section containing the input, or the whole document when it has no sections. The space is as tall as the input, so `<answer handGraded><textInput expanded height="3in" /></answer>` exports as `workspace="3in"`, and two expanded inputs in one paragraph get room for both.

    The space is left where the reader is meant to write. An input written inside a paragraph puts the space after that paragraph; one written outside any paragraph — an `<answer>` on a line of its own — gets a paragraph of its own standing where it stood, so the space stays inside the problem or list item that asked the question rather than after it. Where that input was written among a run of text — as in `<li>Why? <answer type="text" handGraded expanded /></li>`, or beside an expression such as `<m>2+2=</m>` — the new paragraph takes in the run, since a list item holds either a run of text or blocks and never a mix. Only the input itself gives way to the space, so an answer's label still asks its question in front of it.

    A document with no expanded input is exported exactly as before. Wrapping it in a printout would change how the page reads — a printout carries its own heading, a print-preview bar, and its own page geometry — so the wrapping only happens where the space is needed. No PreTeXt printout may hold a section, so where the space has nowhere to go — the input's section holds sections of its own, or the input sits outside every section of a document that has them — the input still exports as a `<fillin>`.

    In the printed output, that space is now drawn: PreTeXt leaves the height of a workspace to the javascript behind its own print preview, which a printed DoenetML document does not load, so the height is written into the page instead. PreTeXt's print-preview controls, which need that same javascript, are dropped from the page along with the other on-screen navigation.

- 87edd1f: Remove two unreachable plural branches from the Khmer catalog and stop any
  catalog from gaining another.

    Khmer has a single plural category, so the `[one]` branches in its
    `attempts-remaining` and `answer-show-responses` could never be selected. Both
    were byte-identical to the default beside them, so nothing rendered
    differently; what changes is that the dead text is gone.

    `lint:i18n` now fails on any catalog that names a plural category its own
    locale cannot select — whether because CLDR gives the locale no such category,
    or because CLDR has no data for the tag at all and the branch would be chosen
    by the runtime's default language.

- 412efd0: An activity embedded in a page that does not speak SPLICE no longer tells readers their saved work could not be loaded.

    Canvas listens for messages on every page it serves and answers any it does not recognize with `error: { code: "unsupported_subject" }`, quoting the id it was sent. So a Doenet activity embedded in a Canvas page got that back for its `SPLICE.getState` request, from a page that is not a host at all — and the viewer read it as a host reporting a failure. Readers were told their saved work was unavailable on an activity that has no saved work and nothing wrong with it; before the notice moved beside the document, the same reply replaced the activity entirely.

    The viewer now recognizes that platform vocabulary — `unsupported_subject`, `unauthorized`, `wrong_origin`, `bad_request` — as a page saying it will not act on what was asked of it, which is the same to the viewer as no answer at all: it is logged and dropped, and the request stays open for a host that does speak SPLICE. Those four codes are reserved for that; a host's own load failures reach the reader under any other code.

    An error the viewer cannot put on screen — one with no string `message` — is now logged and dropped too, rather than shown as "Invalid response to getState". That named the host's bug to a reader who could do nothing about it, over a document that was working. An error carrying text but no `code` is now shown rather than discarded.

    Closes #1795.

- b489f95: Stop the virtual keyboard tray from leaving an unhandled promise rejection behind when it is torn down.

    The tray is a React root of its own, shared by every viewer on the page and unmounted when the last of them goes away. Its keys are `<MathJax>` elements, and a typeset can still be in flight at that moment: unmounting clears the elements' refs, so the typeset reaches MathJax with a null element and rejects with `Typesetting failed: Cannot read properties of null (reading 'contains')`. Nothing is rendered wrong by it — the tray is on its way out — but the rejection is unhandled, so it reaches `window.onunhandledrejection` and any error reporting a host has wired up there. It became easier to hit now that focusing a math input on a touch device opens the tray by itself.

    `MathJaxContext` now takes a `signal`, and the tray aborts it as it tears the tray down. A `<MathJax>` element reaches the engine in stages — waiting on the context promise, then on `startup.promise`, and only then reading the element it is to typeset — so each stage is gated on the signal: once aborted, none of them proceeds and no typeset starts against a tree that is going away. The rest of the engine is passed through untouched, since it is the page's one shared MathJax and cancelling the tray's view of it must not disturb anyone else's.

- a092ce4: A host that cannot produce a document's saved state no longer takes the document away.

    The viewer does not wait for the host's answer to `SPLICE.getState` — it boots and restores if state arrives — and the request stays open until an answer carries usable state. So an error could land on a document that had been on screen and worked in for minutes, and it replaced that document with a red box nothing but a page reload cleared.

    What the host says is now a notice beside the document, in the reader's language and carrying the host's own words. The document, and the work in it, stay where they are, and the host is not told the document failed. A reader who cannot see the notice is told about it politely, without being interrupted in what they were doing.

    The failure pane also follows a rule instead of an arrival order. It is reserved for failures that leave no document at all — a core that never started, saved state that could not be read — so a document that failed to start and a host that could not produce its saved work no longer overwrite each other: the pane says the core never started, and what the host said is shown beneath it. The **Try again** button stays with the failure it addresses, rather than following whichever message settled last.

- 0912dfc: `<legend>` honors its `layer` attribute and can draw an opaque box behind itself.

    A legend's swatches, and its box, are now drawn at the DoenetML `layer` the
    legend asks for, offset the same way the rest of a graph's contents are.
    `<legend layer="3">` therefore sits above a `layer="2"` rectangle, where before
    it was painted underneath one. A legend now defaults to `layer="1"` rather than
    `layer="0"`, so that it still sits above everything on the default layer, as its
    marker swatches did before.

    Its labels are a different matter, and the `layer` does less for them: they are
    drawn as HTML overlaid on the board, so they paint above the graph's contents
    whatever layer is asked for. Lowering a legend's layer sends its swatches behind
    a curve but leaves its labels in front — the same asymmetry that made the
    opaque-rectangle workaround look half-broken.

    The new `boxed` attribute draws an opaque box behind the legend, so a curve
    passing behind it is hidden rather than tangled up with the labels. The box
    paints the graph's background color, or the `backgroundColor` of the legend's
    `<styleDefinition>` when one is set, and is bordered so it reads as a panel in
    both light and dark presentation.

    Legend labels now follow the theme, and the legend's `<styleDefinition>`, rather
    than being painted black whatever the theme was: they read white on a dark canvas
    and take the style definition's `textColor` when one is set, so an author who
    paints the box a color of their own can name the text color that reads against it.

    A `<legend>` inside a `<graph>` also honors `hide` at last: it was drawn whether
    or not it was hidden, which `boxed` would have made plain, since a hidden legend
    would still have painted an opaque box over the graph.

    Legend labels are also kept on one line. A label too long for the room beside
    its swatch used to wrap, which made it taller than the single row the legend
    gives each entry — overlapping the entry below it and overflowing the box drawn
    around them. It now runs past the graph's edge instead.

    Closes #1717.

- 2d73ffa: A legend's swatches now follow the document's theme.

    Every swatch was painted with the light-mode color of the object it stands for,
    whatever the theme, so in dark mode a legend could disagree with the objects it
    describes: a curve drawn in its dark-mode color beside a swatch drawn in its
    light-mode one. A swatch is now painted with the color the current theme calls
    for, and is repainted when the theme is switched, alongside the box and the
    labels, which already were.

- 5196324: A legend is now redrawn in place instead of being rebuilt from scratch.

    Every change to a `<graph>`'s legend — a label whose text depends on something
    the student changes, a style, the graph being panned or zoomed, the position or
    the box — used to delete every swatch and label and create them again. With
    MathJax labels that meant a fresh typesetting pass each time, and the legend
    visibly flashed and shifted.

    The legend now keeps its objects and updates them: a label whose text changed is
    given the new text, a swatch takes the new colors, and everything moves to the
    new geometry. What still has to be built or thrown away is only what cannot be
    carried over — an entry the legend gains or loses, an entry that changes what
    kind of swatch it draws, a label that gains or loses latex or moves to a new
    layer, the backing box as `boxed` is switched on or off, and everything at once
    when the legend is hidden. Switching the box on no longer takes the swatches and
    labels with it, which is the difference.

    Closes #402.

- ea79074: Math can now be written with MathJax's `units` extension.

    `\units` typesets a quantity beside its unit with the spacing a typesetter
    would use, instead of leaving authors to approximate it with `\,` and
    `\mathrm`. The same extension supplies `\unitfrac` and `\nicefrac`.

    ```
    <m>\units{9.8}{\text{m}/\text{s}^2}</m>
    ```

    Documents embedded in a page that provides its own MathJax now render the same
    way they do on doenet.org. Doenet reuses such an engine rather than clobbering
    it, which meant none of Doenet's configuration applied there — `\units` and
    macros such as `\var` typeset as their own names. Doenet now teaches that engine
    its macros and packages before rendering.

- 6144b32: The `text` property of an `<md>` reads an aligned display whose rows use a
  literal `&`.

    `<md><mrow>q &amp;= \sin(x)</mrow></md>` and the same display written with
    Doenet's `\amp` macro render identically, but only the macro spelling was
    stripped before each row was parsed. A row aligned with `&` could not be read,
    and `text` silently handed back the raw LaTeX — `\notag` and `\\` included —
    instead of the plain-text expression.

    Both spellings are stripped now, by one helper shared with the accessible name
    of a math input embedded in an `<mrow>`. That name reads a marker opening a row
    correctly too, rather than consuming the `\\` row break before it.

- 2bf1527: Three message catalogs are now identified by the code of the language they are
  actually written in rather than by the macrolanguage code above it: Northern
  Kurdish is `kmr` (was `ku`), Komi-Zyrian is `kpv` (was `kv`) and Meadow Mari is
  `mhr` (was `chm`). Each of the three shares its macrolanguage with a language
  that has a separate catalog here — Central Kurdish, Komi-Permyak and Hill Mari
  — so the old names claimed to cover readers they could not serve.

    A host that supplies its own catalog for one of these languages through
    `localeResources` keeps being served its own copy, whether it keys it on the
    old code or the new one. Locale negotiation now treats an alias as an extra
    fallback rather than a replacement, so a host catalog keyed on the old code is
    still preferred over the bundled one — which also fixes the same latent problem
    for `no`, `tw` and `man`.

    Documents keep working unchanged. `<document lang="ku">`, `lang="kv"` and
    `lang="chm"` still reach these catalogs, as do the new codes, and a browser
    sending either form is served the same way it was before. `<document lang>`
    autocomplete now offers the new codes, still under the English names CLDR gives
    the macrolanguage — "Kurdish", "Komi", "Mari" — because ICU canonicalizes each
    new code back onto it.

    One deployment does need a change: a host that serves its own copy of the
    catalog directory alongside the bundle and has hand-placed a translation in
    `ku/`, `kv/` or `chm/` must move it to `kmr/`, `kpv/` or `mhr/`. The viewer now
    fetches the new directory names, and a locale whose files 404 falls back to
    English rather than failing the render. A copy the build takes from the package
    picks up the new names on its own.

- 7a33de5: Seed unreviewed message catalogs for fifteen more languages of the Americas:
  Kalaallisut (`kl`), Inuktitut (`iu`), Yucatec Maya (`yua`), Qʼeqchiʼ (`kek`),
  Garifuna (`cab`), Mískito (`miq`), Papiamentu (`pap`), Sranan Tongo (`srn`),
  Jamaican Creole (`jam`), Guadeloupean Creole French (`gcf`), Saint Lucian
  Creole French (`acf`), Guianese Creole French (`gcr`), Belize Kriol (`bzj`),
  Aukan (`djk`) and Saramaccan (`srm`). A document declaring one of them now
  renders its style descriptions, section headings, boolean words, answer
  buttons, editor chrome and diagnostics in that language instead of falling
  back to English.

    Inuktitut is written in Canadian Aboriginal syllabics and has a dual, so a
    count in it selects one of three forms rather than one of two. It also leaves
    the geometry nouns to fall back to English rather than writing them in roman letters inside a syllabic sentence, so a
    style description in Inuktitut is part English by design.

    An Inuinnaqtun (`ikt`) reader is served English rather than the Inuktitut
    catalog, because Inuinnaqtun is written in roman letters and that catalog is
    written in syllabics. Nine of the fifteen are creoles and none of them is
    reachable through its lexifier: `gcf` does not answer a request for French,
    and French does not answer a request for `gcf`.

    All fifteen leave the two chemistry tables to fall back to English, since
    school science across these communities is taught in Dutch, Danish, Spanish,
    French or English.

- 1beb269: Seed unreviewed message catalogs for fifteen more languages of the Caucasus and
  the Kurdish-speaking world: Abkhaz (`ab`), Adyghe (`ady`), Kabardian (`kbd`),
  Avar (`av`), Lezgian (`lez`), Dargwa (`dar`), Lak (`lbe`), Tabasaran (`tab`),
  Ingush (`inh`), Karachay-Balkar (`krc`), Kumyk (`kum`), Nogai (`nog`), Talysh
  (`tly`), Kurmanji Kurdish (`ku`) and Central Kurdish (`ckb`). A document
  declaring one of these languages now renders its style descriptions, section
  headings, boolean words, answer buttons, editor chrome and diagnostics in it
  instead of falling back to English. The chemistry element tables are
  deliberately left out of all fifteen and still fall back to English.

    Central Kurdish is written in the Perso-Arabic script and renders right to
    left, the eleventh such catalog. Kurmanji beside it is Latin and renders left
    to right, and a reader arriving under a Southern Kurdish code (`sdh`) or the
    ISO 639-3 code for Kurmanji (`kmr`) now reaches it rather than English; a
    Sorani reader keeps reaching the Sorani catalog rather than being folded onto
    Kurmanji.

    Two of the fifteen are locales CLDR has no name for, so Lak and Tabasaran now
    supply their own names to `<document lang>`'s autocomplete instead of appearing
    as bare codes.

    Every string is machine-generated and has not been read by a speaker; each
    catalog says so in its header. Three carry an additional confidence caveat
    worth naming: `locales/tly` (Talysh) is the least certain of the fifteen,
    `locales/dar` (Dargwa) records that seven of its colour words are still
    Russian, and `locales/nog` (Nogai) records that its editor vocabulary is
    largely coined. Correcting any of this needs no permission.

- 3ee5557: Seed unreviewed message catalogs for two Bantu languages of Uganda: Chiga
  (`cgg`, Rukiga) and Soga (`xog`, Olusoga). A document declaring either now
  renders its style descriptions, section headings, boolean words, answer
  buttons, editor chrome and diagnostics in that language instead of falling
  back to English, and `<document lang>` autocompletes both from CLDR's own
  names.

    Both sit at 439/575 keys rather than the 445 recent batches reach. The two
    chemistry element tables are left out for the school-system reason — Uganda
    teaches science in English from upper primary, so the fallback is the language
    the periodic table is actually taught in — and six further keys are left out
    deliberately: the three remaining chemistry prose messages, so the chemistry
    group falls back entire rather than appearing half in Rukiga and half in
    English inside one sentence; `noun.slope-field` and `noun.vector-field`, where
    neither language has a term and a phrase would have been the seed's invention
    rather than a word; and `noun.rectangle`, where the descriptive phrase either
    language would use means _four-sided figure_ and so names a quadrilateral, not
    a rectangle.

    Both are written in Latin script, left to right, with the initial vowel — the
    augment — written as part of the word, so a line is «omurongo» and
    «olunyiriri» rather than «murongo» and «lunyiriri». Both put a describing word
    after its noun and agree it with the noun's class rather than with a gender,
    so `$gender` carries a class token: five classes in Soga and five in Chiga.
    Neither keeps English's order of the three style adjectives, because both
    render the dash pattern as an associative phrase — «na tucweka», «n'obutundu»
    — which cannot sit between two adjectives, so both read width, colour, then
    pattern.

    CLDR has plural rules for both, and the class prefix does the marking rather
    than a suffix, so «ekirikuruga» and «ebirikuruga» differ at the front of the
    word rather than the end. Not every noun does: a class 9/10 noun is spelt the
    same in both numbers and the number shows on what agrees with it instead, and
    where the counted noun is one that does not inflect at all — a Lusoga class-15
    verbal noun — the two branches are the same string. Each header says which of
    the three its counted selects are doing rather than coining a countable noun
    to hide it.

    This batch was assembled as **fifteen** languages of Kenya, Uganda and
    Tanzania and thirteen were left out rather than shipped: Kamba, Gusii,
    Kalenjin, Luyia, Masai, Meru, Samburu, Taita, Embu, Teso, Shambala, Vunjo and
    Machame. Attempted honestly they came to between 0 and 91 keys of 575 — against
    the 439 the two that ship reach — and they are recorded on #1655 with the
    coverage each reached and the orthography each attempt settled. `lint:i18n`
    does not report them at all, because no catalog for them exists to be partial;
    a document declaring one of the thirteen renders in English exactly as it did
    before.

    These two are machine-generated seeds pending review by speakers (#1521), and
    each file's header says so and names where it is weakest. Both name the loan
    language they keep openly — English, not Swahili — and both name a near
    relative already on this roster as the first thing a reviewer should hunt for:
    Luganda intrusion in Soga, which is catchable because Lusoga writes `dh` where
    Luganda writes `z` or `j`, and Ankole rather than Kigezi vocabulary in Chiga,
    which is not catchable by a rule and so is stated as a question instead.

    Numbers written into a message render in Latin digits in both, so a digit
    inside a sentence matches the count formatted beside it.

- 7272b46: Seed unreviewed message catalogs for fifteen more regional and minority
  languages of Europe: Aragonese (`an`), Extremaduran (`ext`), Ladino (`lad`),
  Mirandese (`mwl`), Walloon (`wa`), Arpitan (`frp`), Norman (`nrf`), Lombard
  (`lmo`), Emilian (`egl`), Ladin (`lld`), Cornish (`kw`), Manx (`gv`), Bavarian
  (`bar`), Northern Frisian (`frr`) and Romani (`rom`). A document declaring one
  of them now renders its style descriptions, section headings, boolean words,
  answer buttons, editor chrome and diagnostics in that language instead of
  falling back to English.

    All fifteen are written in the Latin script and lay out left to right — which
    took a fix rather than nothing. CLDR maximizes `lad` to the Hebrew script
    Judeo-Spanish was written in for four centuries, so a Ladino document would
    have laid a Latin catalog out right to left; `directionOf` now follows the
    script a catalog is actually written in for a bare tag, while a tag that names
    its script, such as `lad-Hebr`, still gets that script's direction.

    Twelve of the fifteen put a shape's adjectives behind its noun, so an Aragonese
    document reads «linia gorda discontinua roya» where a Bavarian one reads «dicke
    gstrichlte rode Linie». Fourteen agree those adjectives with the noun's gender:
    twelve by an ending, and Cornish and Manx by an initial mutation instead —
    «tew» before a masculine noun and «dew» before a feminine one. Northern Frisian
    writes one invariant form, which is Mooring's grammar rather than a gap in the
    seed.

    Five of the fifteen have plural rules of their own in CLDR, ending a run of two
    batches with none. Cornish reaches all six plural categories from ordinary
    counts — the third language on the roster whose rules do, after Welsh and
    Arabic — and its catalog writes four of them by name; Walloon's singular covers
    zero as well as one; Manx and Ladin each declare a `many` no realistic count in
    these messages reaches — Manx's belongs to counts written with a decimal
    fraction, which none here are, and Ladin's only to exact whole millions — and
    neither catalog writes a branch for it.

    The other ten have no rules at all, so a category branch in one of them would be
    chosen by whatever language the runtime fell back to. Two consequences show in
    the messages themselves. `field-function-wrong-num-outputs` forks on how many
    outputs a component needs rather than on a count's grammar, so all ten write the
    exact-value branch `[1]` where English writes the category `[one]` — the same
    mechanism `attempts-remaining`'s `[0]` uses — while the five with rules of their
    own keep the category. And where a `[one]` would have read the same words as its
    default, it is dropped rather than written twice, which is why Lombard and
    Emilian have fewer count forks than the English they were seeded from.

    The chemistry element tables are left out of all fifteen, so a document in one
    of these languages still shows the element names in English. Thirteen are the
    school-system case — chemistry is taught in Spanish, Portuguese, French,
    Italian, German or English wherever these languages are spoken, and each
    catalog's header names which. Ladino and Romani are the two whose speakers are
    spread across several school systems, so there is no single language to point
    at.

    `<document lang>` autocompletes all fifteen. Norman and Ladin are offered from
    hand-written entries, since CLDR gives neither tag an English name or an
    endonym — though it does have plural rules for Ladin, and names for it in a
    scattering of other languages, Italian and Czech among them.

    These are machine-generated seeds pending review by speakers (#1521), and each
    file's header says so and names where it is weakest. Ten of the fifteen are
    Romance languages sitting beside a national Romance language whose words are
    one respelling away, so every header names the written standard it follows —
    the Academia de l'Aragonés proposal, OSCEC, Aki Yerushalayim, the Convenção
    Ortográfica, _rifondou walon_, ORB, Jèrriais, classical Milanese, Bolognese,
    Ladin Dolomitan, the Cornish Standard Written Form, traditional Manx
    orthography, Central Bavarian, Mooring and the Romani Union alphabet — and says
    what it borrowed and from where.

    Numbers written into a message render in Latin digits in every one of the
    fifteen, so a digit inside a sentence matches the count formatted beside it.

- 19b00e5: Seed unreviewed message catalogs for fifteen more regional languages of
  Europe, five Germanic, five Romance and five Slavic: Norwegian Nynorsk (`nn`),
  Scots (`sco`), Swiss German (`gsw`), Colognian (`ksh`) and Limburgish (`li`);
  Friulian (`fur`), Venetian (`vec`), Ligurian (`lij`), Piedmontese (`pms`) and
  Neapolitan (`nap`); Upper Sorbian (`hsb`), Lower Sorbian (`dsb`), Kashubian
  (`csb`), Silesian (`szl`) and Rusyn (`rue`). A document declaring one of them
  now renders its style descriptions, section headings, boolean words, answer
  buttons, editor chrome and diagnostics in that language instead of falling
  back to English.

    Norwegian Nynorsk is complete, the periodic table included. The other fourteen
    leave the chemistry element tables out and still fall back to English for
    them; each catalog's header says why in its own words.

    `<document lang>` autocompletes all fifteen, and CLDR has a name for every one
    of them, so no hand-written roster entry was needed.

    No existing reader is sent anywhere new. `no` still resolves to Bokmål: a
    reader who says only `no` has not said which written standard they read, and
    pointing it at the new Nynorsk catalog would be a substitution rather than a
    canonicalization.

    Eight of the fifteen have CLDR plural data and use it; the other seven write
    no category branch at all, because nothing could select one correctly. Upper
    and Lower Sorbian write a living grammatical dual, and Colognian a `zero`, both
    selected by their own CLDR rules.

- 68d412e: Seed unreviewed message catalogs for eleven more languages of Oceania:
  Marshallese (`mh`), Chuukese (`chk`), Pohnpeian (`pon`), Kosraean (`kos`),
  Gilbertese (`gil`), Niuean (`niu`), Tokelauan (`tkl`), Tuvaluan (`tvl`),
  Rarotongan (`rar`), Wallisian (`wls`) and Bislama (`bi`). A document declaring
  one of them now renders its style descriptions, section headings, boolean
  words, answer buttons, editor chrome and diagnostics in that language instead
  of falling back to English. The chemistry element tables are deliberately left
  out of all eleven and still fall back to English.

    These are the first catalogs to carry the messages that name a blank inside
    typeset math and the warning about an input that cannot be drawn there.

    `<document lang>` autocompletes all eleven. Wallisian is offered as "Wallisian
    (Fakaʻuvea)" from a hand-written entry, since CLDR has no name for the tag in
    any language.

    No existing reader is sent anywhere new: none of the eleven was previously
    folded onto another catalog.

    The catalogs are not equally complete, and each says in its own header where it
    stands. Nine write their own vocabulary throughout, and two write the catalog's
    frame in the language around English technical nouns. Nothing was invented to
    fill a gap.

- 3c4f5b8: Seed unreviewed message catalogs for fifteen more languages of the Silk Road:
  Crimean Tatar (`crh`), Gagauz (`gag`), Karakalpak (`kaa`), Khakas (`kjh`),
  Southern Altai (`alt`), Mazanderani (`mzn`), Gilaki (`glk`), Northern Luri
  (`lrc`), Balochi (`bal`), Hazaragi (`haz`), Muslim Tat (`ttt`), Zazaki
  (`zza`), Shughni (`sgh`), Dungan (`dng`) and Wakhi (`wbl`). A document
  declaring one of them now renders its style descriptions, section headings,
  boolean words, answer buttons, editor chrome and diagnostics in that language
  instead of falling back to English.

    Five of them — `mzn`, `glk`, `lrc`, `bal` and `haz` — are written in the
    Perso-Arabic script, so a document declaring one lays out right to left. The
    mathematics inside it does not: notation stays left-to-right, as it already
    does in Arabic and Hebrew.

    The chemistry element tables are left out of twelve of the fifteen and still
    fall back to English. The exceptions are `mzn`, `glk` and `lrc`, which carry
    the Persian table unchanged, because chemistry in Māzandarān, Gilan and
    Lorestan is taught, examined and printed in Persian and that list is the one
    those readers actually use. `locales/glk` and `locales/lrc` translate every
    key, as `locales/nn` does. `locales/ttt` additionally leaves ten of the longest
    diagnostics messages in English and says so in its own header.

    `<document lang>` autocompletes all fifteen. Khakas, Wakhi, Dungan, Shughni
    and Hazaragi are offered from hand-written entries, since CLDR has no name for
    those tags in any language.

    Two macrolanguages gain members, so some readers who reached English before
    now reach a catalog: a Northern Zazaki (`kiu`) reader reaches `locales/zza`,
    and Western (`bgn`) and Eastern (`bgp`) Balochi readers reach `locales/bal`.
    Both catalogs' headers say which variety they are written in, so a reader
    served through one of those entries may meet spellings they have to adjust to.
    No reader is moved off a catalog they already reached.

    The catalogs are not equally complete, and each says in its own header where it
    stands — `locales/ttt` marks itself the least certain, `locales/sgh` records
    that its diagnostics are a Tajik and Russian loan register with a Shughni
    frame, and `locales/kjh` records that Khakas has almost no written technical
    register to draw on. Nothing was invented to fill a gap.

- b3856ea: Seed unreviewed message catalogs for fifteen more languages of South Asia and
  its diaspora: Awadhi (`awa`), Chhattisgarhi (`hne`), Magahi (`mag`), Marwari
  (`mwr`), Garhwali (`gbm`), Kumaoni (`kfy`), Newar (`new`), Sylheti (`syl`),
  Tulu (`tcy`), Mizo (`lus`), Khasi (`kha`), Garo (`grt`), Saraiki (`skr`),
  Brahui (`brh`) and Fiji Hindi (`hif`). A document declaring one of them now
  renders its style descriptions, section headings, boolean words, answer
  buttons, editor chrome and diagnostics in that language instead of falling
  back to English.

    Five scripts: Devanagari for the six Hindi-belt and Uttarakhand catalogs and
    for Newar, the Bengali script for Sylheti, Kannada for Tulu, Latin for Mizo,
    Khasi, Garo and Fiji Hindi, and Perso-Arabic for Saraiki and Brahui. **Saraiki
    and Brahui lay out right to left**, which takes the roster's right-to-left
    catalogs from sixteen to eighteen; the other thirteen lay out left to right.

    Thirteen of the fifteen put a shape's adjectives in front of its noun, as
    English does. Khasi and Mizo put them behind it, so a Khasi document reads
    «lain bakhraw badash basaw» where a Garo one — the same state, the other
    order — reads «dal·gipa dashgipa gitchak lain». Saraiki is the one catalog of
    the fifteen that agrees its adjectives with the noun's gender; the other
    fourteen write one invariant form, which is a fact about the language in eight
    of them and a stated gap in the seed in six.

    The chemistry element tables are left out of all fifteen, so a document in one
    of these languages still shows the element names in English. Thirteen are the
    school-system case — chemistry is taught in Hindi, Nepali, Bengali, Urdu or
    English wherever these languages are spoken — and Marwari has no settled list
    of all 118 in any case. Tulu is the one whose neighbour cannot help either:
    a Tulu pupil meets the table in Kannada, and `locales/kn` omits it too. Each
    catalog's header says which case it is in.

    `<document lang>` autocompletes all fifteen. Chhattisgarhi, Garhwali, Kumaoni,
    Sylheti, Garo and Saraiki are offered from hand-written entries, since CLDR
    has no name for those tags in any language.

    These are machine-generated seeds pending review by speakers (#1521), and each
    file's header says so and names where it is weakest. In the nine Indo-Aryan
    catalogs, and in Newar beside them, the technical vocabulary is largely
    borrowed — Hindi in the six Hindi-belt and Uttarakhand catalogs, Nepali in
    Newar, Bengali in Sylheti, Urdu in Saraiki — and
    what is the language's own is the grammar around it and, more often than not,
    the colour words. Every header declares that rather than leaving it to be
    discovered.

    Numbers written into a message render in Latin digits in every one of the
    fifteen, so a digit inside a sentence matches the count formatted beside it.

- 14d2009: Seed unreviewed message catalogs for fifteen languages of maritime and
  mainland Southeast Asia: Buginese (`bug`), Makasar (`mak`), Banjar (`bjn`),
  Gorontalo (`gor`), Nias (`nia`), Toba Batak (`bbc`), Iban (`iba`),
  Kadazandusun (`dtp`), Pangasinan (`pag`), Chavacano (`cbk`), Tausug (`tsg`),
  Maranao (`mrw`), Shan (`shn`), Mon (`mnw`) and S'gaw Karen (`ksw`). A document
  declaring one of them now renders its style descriptions, section headings,
  boolean words, answer buttons, editor chrome and diagnostics in that language
  instead of falling back to English.

    Twelve are written in the Latin script and three — Shan, Mon and S'gaw Karen —
    in the Myanmar script. All fifteen lay out left to right, so nothing about
    direction changes.

    The chemistry element tables are left out of all fifteen, so a document in one
    of these languages still shows the element names in English. None of the
    fifteen is a language chemistry is taught in: secondary science in these
    regions runs in Indonesian, Malay, English or Burmese, so there is no settled
    list of element names in Buginese or Mon to write down, and an invented one
    would be worse than the English. Readers in the English-medium systems get
    their own school vocabulary; the rest get a second language rather than a
    first. Each catalog's header says which case it is in.

    `<document lang>` autocompletes all fifteen. Chavacano, Tausug, Maranao, Mon
    and S'gaw Karen are offered from hand-written entries, since CLDR has no name
    for those tags in any language; Chavacano is listed as "Chavacano (cbk)"
    because both «Chavacano» and «Chabacano» are in live use for it and the
    catalog does not choose between them. Two of the fifteen are offered under the
    name CLDR gives them rather than the one their catalog writes — "Batak Toba"
    for `bbc` and "Central Dusun" for `dtp` — because the autocomplete fills gaps
    in CLDR and never overrides it.

    Malay gains its members, so many readers who reached English before now reach
    a catalog: Brunei Malay (`kxd`), Kedah Malay (`meo`), Pattani Malay (`mfa`),
    Central Malay (`pse`), Sabah Malay (`msi`), North Moluccan Malay (`max`)
    and Manado Malay (`xmm`) and twenty-five other varieties now reach
    `locales/ms`. The list has thirty-three entries; the thirty-third is Standard
    Malay (`zsm`) itself, which already reached that catalog because ICU rewrites
    the tag. `locales/ms` is Standard Malay, so a reader served through one of the
    thirty-two may meet spellings they have to adjust to. A Pattani reader who writes in Jawi is served Rumi.
    Indonesian, Minangkabau and Banjar readers are deliberately left out of that
    list, because each has a catalog of its own. Coastal Kadazan (`kzj`) readers
    reach the new `locales/dtp`. No reader is moved off a catalog they already
    reached.

    Numbers written into a message render in Latin digits in every language,
    including the three written in the Myanmar script, so a digit inside a sentence
    matches the count formatted beside it and the mathematics around it.

- a6e6d3e: Seed unreviewed message catalogs for fifteen more Uralic languages of northern
  Europe and Siberia: Southern Sami (`sma`), Lule Sami (`smj`), Inari Sami
  (`smn`), Skolt Sami (`sms`), Kildin Sami (`sjd`), Veps (`vep`), Livvi-Karelian
  (`olo`), Karelian (`krl`), Võro (`vro`), Meänkieli (`fit`), Moksha (`mdf`),
  Komi-Permyak (`koi`), Hill Mari (`mrj`), Khanty (`kca`) and Mansi (`mns`). A
  document declaring one of these languages now renders its style descriptions,
  section headings, boolean words, answer buttons, editor chrome and diagnostics
  in it instead of falling back to English. The chemistry element tables are
  deliberately left out of all fifteen and still fall back to English.

    Two of the new catalogs change where an existing reader is sent. A
    Komi-Permyak (`koi`) reader was previously served the Komi-Zyrian catalog and a
    Hill Mari (`mrj`) reader the Meadow Mari one, because each is a member of a
    macrolanguage the roster had a catalog for; both now reach their own catalog
    instead. Readers arriving under the other members of those macrolanguages
    (`kpv`, `mhr`) are unaffected, and a Moksha (`mdf`) reader who previously
    reached English now reaches Moksha.

    Two contrast warnings now reach the reader in the language they were written
    for. `style-definition-insufficient-contrast` selects a branch by a symbolic
    key the core passes in, and Meänkieli's catalog had translated two of those
    keys along with the prose around them, so a text-on-background and a
    text-on-canvas warning both fell through to the wrong branch; both select
    correctly again. A Efik reader gets the same repair in
    `variant-attribute-wrong-type-for-sequence`, whose catalog had dropped the
    "a number" branch entirely and answered "an integer" for both — that one
    predates this batch and is fixed here because the check that found it is new.

    Four of the fifteen are locales CLDR has no name for, so Kildin Sami,
    Livvi-Karelian, Khanty and Mansi now supply their own names to
    `<document lang>`'s autocomplete instead of appearing as bare codes.

    Every string is machine-generated and has not been read by a speaker; each
    catalog says so in its header. Five carry an additional confidence caveat worth
    naming: `locales/kca` (Khanty) and `locales/mns` (Mansi) record that much of
    their editor and diagnostics vocabulary is coined rather than attested, and
    that a further set of words — "error", "line", "page", "figure" and the
    school-genre section names — is still unadapted Russian because the seed could
    establish no Khanty or Mansi form,
    `locales/sjd` (Kildin Sami) is the least certain of the five Sami catalogs,
    `locales/vro` (Võro) records that two of its messages read with the wrong case
    and that its word for a right-hand side is probably the word for "good", and
    `locales/mdf` (Moksha) names the six Erzya residues it still carries — the
    ablative ending, the abessive ending, the word for "equal", everything derived
    from the word for "many", the demonstrative and the word for a part — where the
    seed could not establish the Moksha form. Nine other catalogs now record, in
    the same way, a word of their own that carries two concepts at once and that
    the seed could not split.
    Correcting any of this needs no permission.

- ae70028: Keep the worker when a document's boot is restarted mid-handshake.

    A boot restarted while the first one was still shaking hands with its core worker used to run a second initialization on the same worker, interleaved with the first. Three ordinary things restart a boot that way: a host answering `SPLICE.getState` at once, as doenet.org's assignment page does; a source edit, attempt change, locale switch or retry landing mid-boot; and `render` turning true on a viewer still priming its worker. The second initialization then initialized from a document DAST the first had already released, its handshake failed with a misleading `Cannot create normalized dast root before source is set`, and the boot ladder discarded the worker as wedged and booted a replacement — so the document rendered a worker and a WASM compile late, and on a page sharing one worker among documents the discard quarantined that worker for its siblings too.

    Initializations are now serialized per worker: a boot that finds one in flight waits for it to settle, then runs whole on the worker it found — no failed handshake, no discarded worker, no replacement to boot. The second initialization still runs (skipping it when nothing has changed is #1800); what is gone is the failure and the second worker. They queue in the order they were asked for, so the worker ends up holding the document on screen even when an older initialization's external references were slow to fetch. A restarted boot's handshake watchdog counts from its turn on the worker, so the wait behind the initialization ahead of it does not come out of the time its own handshake was given; and an initialization the viewer has already moved on from steps aside instead of running — at its turn, or as soon as another is queued behind it — so that wait is for the one initialization already on the worker and no more. The worker itself now refuses to initialize twice from one source and says why, and a refused initialization no longer leaves the worker's call queue held.

    Closes #1533.

- 0b5a848: Editor: keep suggesting a hyphenated snippet name across its hyphens.

    Nine of the ten completion snippets have hyphenated names, and the menu emptied on the hyphen: typing `<answer` offered `answer-labeled`, and typing the `-` that comes next offered nothing at all. The same happened to `<multiple-`, `<table-`, `<video-` and `<if-`. The suggestions now survive the hyphen, so a snippet can be reached by typing its name straight through.

    More generally, a tag name is now recognized as one whatever character it ends on — `.`, `:` and accented letters behaved like `-` — so the context-help panel no longer describes the enclosing element while a name is being typed.

    Closes #1780.

## 0.7.25

### Patch Changes

- 2086cb3: Offer the values of `renderMode`, `marker`, and `grid` in autocomplete and context help, and check them when a document runs. `<odeSystem renderMode>` is deprecated in the process.

    Each of these attributes accepted a fixed set of words that lived only in the
    renderer's `if`/`else` chain, so the schema surfaced them as free text and an
    author had no way to discover or check what to write.

    - `<math renderMode>` now declares `inline` and `display` and matches them
      case-insensitively; an unrecognized value falls back to `inline` with a
      diagnostic instead of silently rendering inline. The renderer's other two
      modes are deliberately not offered on `<math>`: `numbered` needs an equation
      tag that only `<me>`, `<men>`, and `<odeSystem>` supply, and `align` needs `&`
      markers that a `<math>` expression cannot carry — use `<md>` for that.
    - `<odeSystem renderMode>` is deprecated and removed. `align` was always its
      only workable value — the rendered LaTeX carries `&` markers and its own
      `\tag`, which no other mode's delimiters can hold — so the mode is now fixed
      by the component. The attribute is dropped during DAST normalization with a
      deprecation warning, so existing documents keep working and render as before
      rather than failing on an unknown attribute. (Since the mode is no longer an
      attribute, `$theOdeSystem.renderMode` is no longer available as a public
      reference.)
    - `marker` is split per tag, since the two sets do not cross. `<ul>` declares
      `disc`, `circle`, and `square` and enforces them: they are the complete set,
      so they now match case-insensitively and an unusable value is reported
      instead of silently reverting to the level default. `<ol>` offers `1`, `a`,
      `A`, `i`, and `I` as suggestions only, because the renderer matches on the
      first character and decorated forms like `1.` or `a)` are legitimate.
    - `<graph grid>` lists its values as suggestions too, since it also accepts
      two numbers for the spacing, and now offers `1 1` and `2 2` alongside the
      named spacings so the numeric form stays discoverable.

    `<summaryStatistics statisticsToDisplay>` gains the same list, but only as
    runtime validation: the component is experimental and excluded from the schema,
    so the values do not reach autocomplete yet. An unrecognized statistic is now
    dropped with an info diagnostic instead of being ignored in silence.

- fbb802c: Free a boot slot when a document's core fails to start.

    Hosts that cap how many documents boot at once released a slot only from `initializedCallback`, so a failed boot held one until the manager's own watchdog expired: 90 s for the `@doenet/standalone` coordinator and for windowed `@doenet/doenetml-iframe` viewers, 30 s for the docs site's editors. The queue that exists to keep a page from overloading was starved by the failures themselves.

    `DoenetViewer` and `DoenetEditor` gain **`coreStartFailedCallback`**, the failure counterpart of `initializedCallback`. It fires once per core-start attempt and covers every way a start can end without a core: handshake retries exhausted, a rejected evaluation, or a document-state load that failed. A windowed `@doenet/doenetml-iframe` viewer releases its slot on the signal whether or not the host passed a callback of its own, and the docs site's editors release theirs the same way.

    The standalone bundle posts `bootFailed` to a parent-page coordinator, which frees the slot and marks the activity `failed` — still budgeted and still parkable, but parking skips the state flush, since a failed realm has no core to answer one and whatever it last reported is already warehoused. A later attempt in that realm that does start a core clears the mark, so an activity that recovers flushes its state like any other. A failure that lands while the activity is already parking is not lost either: the flush in flight will never be answered, so the coordinator stops waiting for it — detaching at once off-screen, and keeping the `failed` mark if the reader scrolled back mid-flush.

    The coordinator script also accepts `data-boot-watchdog-ms`, the one option that had no data attribute.

- ca59f06: Deliver a core boot's result only while it still owns the document.

    Getting a document on screen is a chain of waits — hash the source, read any saved state from IndexedDB, hand shake with a fresh worker, evaluate — and a rebuild during any of them (a locale switch, an editor recompile, new source from the host) leaves the previous boot still running. Both boots drive the same core worker, so the older one's result is no longer its to deliver: whichever way its evaluation ends, it now stands aside rather than rendering a superseded document over the new one or putting the "could not be started" screen over a document that booted fine.

    The rule covers what a boot delivers _while_ running, not only its final result: a superseded initialization no longer announces the old document's structure or resolved language, and a superseded core's mid-evaluation deliveries — renderer updates, diagnostics, score reports, clipboard writes, host events, solution-view requests, and the async renderer-chunk loads that commit the document's React tree — are dropped rather than written under the identity of the document that replaced it. Only a boot whose viewer has gone away disposes what it created; after a rebuild there is a successor that has already inherited it. The safety net that turns an unexpected throw during a boot into a visible error follows the same rule, and additionally stays quiet once the boot has already put its document on screen — the last thing a boot does is call `initializedCallback`, and a host handler that throws there must not replace the document it was told about. The state load that _precedes_ a boot obeys the same rule: a load that has been overtaken now stops, rather than seeding the successor's core with the state saved for the document it replaced or reporting its own failure as that document's.

    At most one boot runs per document at a time. A viewer brought back after being prepared off-screen restarted its boot on every re-render until that boot finished, and the two then tore down each other's worker — on that path aborting the render outright and leaving the viewer dead.

- fd13acc: Put a held-back cascade step's message on the same row as its number.

    A `<problem>`/`<task>`/`<part>` that a `<cascade>` is holding back shows one thing — the `<cascadeMessage>` telling the reader what to finish first — and its number was drawn a line above that message rather than beside it. A list item lines its number up with the first child that renders something, and a held-back step was treated as rendering nothing at all, so the message led nothing: the item dropped out of the numbering layout it uses for every other item and the message kept the top margin that pushed it onto a second row.

    This also qualifies the previous release's "a `<cascadeMessage>` no longer takes the lead", which was true only of a hidden one: while the step is held back the message is the one thing on screen, and it does take the lead there.

    The message is now the child such a step lines its number up with, which is what it always was on the screen. Nothing changes once the step is revealed: the message is hidden then, and the content behind it leads as before. Nothing changes for a step with a title or a box of its own either — those draw their number in a heading, with the message below it, exactly as they did.

- 5cee7e9: Make a `<codeEditor>` inside a dark-mode document use the dark editor theme.

    The `<codeEditor>` renderer mounts the same `EditorViewer` the authoring editor
    does, but never told it which theme to use, so it fell back to the light-mode
    default. Inside a dark-mode document that left light syntax colors — chosen for
    contrast on a white canvas — painted on the dark canvas, and plain text content
    in particular came out nearly invisible. The renderer now reads the document's
    resolved theme from context and passes it down, so the embedded editor's
    canvas, gutters, and syntax highlighting follow the surrounding document.

- 3b70595: Size the core-worker watchdog to the contention it actually faces.

    An Active Calculus reader on a 2020 dual-core MacBook Air saw every Doenet activity in a Runestone section fail with "The document viewer could not be started". The handshake budget was a fixed 15 s, measured on developer hardware where the handshake "stays bounded under CPU pressure". On that machine it is not bounded: a page starting many documents at once pushes a perfectly healthy handshake past 15 s, and the watchdog then makes the document unloadable on exactly the contended machines the guard exists for.

    The budget now scales with handshakes-per-core, read page-wide from a shared Web Lock that every realm mid-handshake holds, and is capped so a genuine hang is still recovered from. The census gates nothing and is independent of any boot scheduling, so it works on pages whose host schedules boots itself — which is where cores can share a worker thread and contention matters most. `doenetGlobalConfig.coreHandshakeWatchdogMs` still overrides the budget outright, for a deployment whose handshake is slow for reasons contention cannot explain (one using `fetchExternalDoenetML`, say).

    Retries back off exponentially with jitter instead of re-piling a fresh multi-MB worker 250 ms after one just failed, which was positive feedback exactly when the machine could least afford it.

    A timeout on a demonstrably contended page no longer reports the worker as wedged. In shared-core mode that suspicion quarantines the host worker: the suspected core is killed and retried, no new cores join the host, and the retried and new cores land on a replacement worker whose multi-MB bundle must spawn and compile under the very contention that produced the false alarm.

    A failure attributable to contention now says so — that several documents were starting at once, and may take longer on a slower device — instead of presenting an unexplained error. The general failure message is reworded to match: "This document could not be started", where it said "The document viewer could not be started".

- ced96e0: Let the contention-aware watchdog reach a document's first boot attempt.

    The page-wide handshake count is cached and refreshed in the background, so every reading is answered by the refresh before it — and a realm's first handshake has none. Its first attempt therefore sized itself as though it were the only boot on the page, and the contention-scaled budget only took effect from the first retry. That inverts the intent: the widening exists for a page where many activities boot at once, and a fresh iframe on such a page is exactly the attempt it never reached.

    The census seat a boot already takes now reports the count it was granted against, counted from inside the grant — the boot path gains no suspension point, and the count rides on a lock operation that was happening anyway. Taking a seat is as quick as it ever was; the figure follows a moment later and moves a deadline that is already running, so nothing waits for it. A later reading only ever grants more time, never less, and an explicit `doenetGlobalConfig.coreHandshakeWatchdogMs` still wins outright. A timeout on that first attempt is now attributed to the page it actually ran on, so it comes back with the busy-page wording rather than an unexplained error.

- 38b92ca: Let the first usable answer to a document's `SPLICE.getState` be the one that counts.

    A page can hold more than one listener willing to answer that request. On a Runestone or SCORM page running the standalone coordinator there are two: the coordinator, which answers a restored activity out of the in-page warehouse it filled when it parked the activity, and the book's own persistence layer, which answers out of durable storage. Both answers were processed, so the document was rebuilt from whichever one happened to arrive last — and the durable one, being a round trip to storage, generally arrives second while carrying older work than the reader had just done. A reader who typed something, scrolled past the activity, and scrolled back could find the answer they gave before that reverted to an earlier one.

    A request now has a single answer: the first that carries state for this document wins, and later answers to it are ignored. Within a page load the coordinator's warehouse is the fresher of the two and answers first, so the reader keeps their work; on a boot the warehouse cannot answer — the first visit of a session, say — the persistence layer is the only answerer and restores as before. An answer with no state does not consume the request, so a host with nothing saved for an activity cannot shut out a better answer still on its way.

    Each answer also rebuilt the document from scratch, so on such a page every restore paid for a full core start whose result was immediately thrown away. Only the winning answer rebuilds now.

    An error from one listener no longer hides the document another restores. A listener with nothing to offer can report a failure rather than stay silent, and a failure carries no `message_id`, so it leaves the request open for a listener that does have state — but the error it put on screen was never cleared when that state arrived, leaving the reader looking at a load failure with their restored work behind it.

- 85caf7c: Save a reader's most recent work when the page goes away or the viewer is taken down, not only when a host asks for it.

    The core throttles its state reports to a host at sixty seconds, so a host's copy of a reader's work can be a minute behind what is on screen. Only an explicit flush request from the host — or the reader submitting an answer — closed that window, and a document can go away with neither: the tab is closed, a new URL is typed, an external link is followed, a backgrounded mobile tab is discarded, or an app navigates in place and unmounts the viewer. Up to a minute of answers could be lost. Documents that keep no local copy — the default for embeds, and what a graded assignment on doenet.org uses — had nothing to fall back on.

    The viewer now flushes whatever the throttle is holding back when the page hides, on both `pagehide` and a `visibilitychange` to hidden (a backgrounded tab can be discarded without firing anything else), and when the viewer itself unmounts. The work reaches the host through the ordinary state-report channel, so a host saves it exactly as it saves a routine autosave.

    Getting the payload out in time is the whole difficulty: `pagehide` can end the document as soon as the handler returns. That is no budget for a round trip into the worker that holds the state, so the core now mirrors each throttled payload out to the page as it is built and the viewer keeps it in hand. Nor is it budget for a posted message, which only queues work an unloading document is destroyed before it does; the report is delivered to a host's listeners directly instead, in the same shape a posted one arrives in. Nothing is torn down on the way, so a page that comes back — returning to a backgrounded tab, or a back/forward-cache restore — carries on with its core intact and its work already saved.

    A host has to hold up its end of that for the last moment to count, and the READMEs now say so: the listener receiving the report must write synchronously — `navigator.sendBeacon`, or a synchronous store — because a listener that defers to a `fetch` or a timer is discarded along with the document. For the same reason a `@doenet/doenetml-iframe` host that consumes reports through the `reportScoreAndStateCallback` prop instead of the message keeps its old exposure on an unload: that call crosses the frame boundary as a posted message.

- d5dfb21: Show a reader the load failure their host reported, even when the host quotes the request's `message_id`.

    A viewer asks its host for saved state with `SPLICE.getState`, and a host that cannot produce it answers with an error. The shape the protocol originally specified — an error carrying no `message_id` — was handled, but the branch that handled it hung off the id _not_ matching, so a host that quoted the request's id instead had its error dropped. Quoting it is the natural thing for a host to do: it is what its own answers carrying state do, and what every other request/response pair in the protocol does.

    Nothing hung as a result, because the viewer never waits for this answer — it boots fresh and reboots seeded with whatever state arrives. The failure was quieter than that. The reader carried on in a document started without the work they had saved, with nothing on screen to say why, while the host believed it had reported the problem.

    An error is now surfaced whether it quotes the open request's id or carries none, and one quoting a different id is ignored, since that id belongs to another request — one some rebuild has already replaced, or another viewer's on the page. A response carrying state is unchanged: it is read only when it quotes the request it answers, because replies reach every viewer in the window and `cid` alone cannot tell two of them apart. An error still does not close the request, so a page holding a second listener — the `@doenet/standalone` coordinator beside a book's own persistence layer — can still restore the document after the first answerer has failed.

- 5231472: Viewer: size the virtual keyboard's controls for a fingertip on touch devices.

    Every control in the keyboard tray was built for a mouse pointer. On a phone or
    tablet the tab that opens the tray was 48x24, the button that closes it 24x24,
    the layout tabs (`123`, `f(x)`, `ABC`, `αβγ`, `$%∞`) 30x25, and the keys
    themselves 39x40 — all under the 44px minimum a fingertip needs, which is the
    figure in both Apple's HIG and WCAG 2.5.5. The tab that opens the tray was the
    worst of them, since it is the only way in and had to be found before anything
    else could be tapped.

    On a device whose primary pointing device is coarse, those controls are now at
    least 44px in the direction that was short: the open tab is 64x44, the close
    button 44x44, and the layout tabs and keys are 44px tall. Key width is left to
    the row layout, which shares the row out evenly — a phone cannot fit twelve
    44px-wide keys across, and forcing it would only cause an overflow. What the
    extra room buys on a tablet is wider keys: the keyboard may now spread to 48rem
    rather than 42rem, so a key grows to 48px there instead of staying at 40px in
    the middle of an empty row.

    The tray also stops short of the height that would carry its own tab off the
    top of the screen — floor as well as ceiling, so a window shorter than the
    tray's usual 280px no longer pushes the tab out of reach either. It hangs the
    tab exactly its own height above the tray, so a taller tab needs a taller gap;
    on a phone held sideways, where the tray is tall enough to reach that limit,
    the tab was being clipped.

    Where the tray has no room for the whole keyboard — the same phone held
    sideways, or any short window — the keyboard now scrolls inside the tray
    instead of running off the bottom of the screen, so the rows that were cut off,
    the number pad among them, can be reached. Taller keys would have cut off more.
    The tab and the close button stay where they are while it scrolls, and the tray
    opens onto the top of the keyboard however far it was scrolled last time, so the
    layout tabs are in view whenever it opens.

    Nothing else changes for a reader with a mouse, including on a narrow window:
    the sizing is keyed on the primary pointer being coarse, which is the same test
    the viewer already uses to decide whether to suppress the device's own
    on-screen keyboard. The scrolling is the exception, and deliberately so — a
    window too short for the keyboard cut it off whatever was pointing at it.

    Closes #449.

- 35acd91: Fix matrix, vector, and tuple arithmetic losing an entry whose value works out to one.

    Subtracting a matrix that has an entry of `-1`, as in `<math simplify>$A + $B - $C</math>`, gave a wrong answer or no answer at all. Distributing the minus sign over the entries turned that entry into the product `(-1)(-1)`, which simplified to an empty product rather than to `1`, so the entry dropped out of the sum. Where the rest of that entry's sum was negative, the entry silently came out one too small; where it was positive, evaluating the expression failed outright and the document reported an internal error. Subtracting tuples and vectors with an entry of `-1` behaved the same way.

- 10fea3d: Show one `<cascadeMessage>` at a time in a `<cascade>`.

    A `<cascadeMessage>` nested inside a section was shown by every held-back
    section at once, so a cascade of three problems displayed "finish problem 1"
    and "finish problem 2" simultaneously — one of them describing a step the
    learner cannot see the point of yet. A message now shows only while its section
    is the _next_ one, the one that becomes visible as soon as the current section
    is completed; sections further down show only their number and title, as a
    held-back section with no message of its own already did.

    Where an author has put messages in both places, the two placements now
    negotiate rather than both appear: a section's own message is the more specific
    of the two, so when the next section has one, it is shown and the `<cascade>`'s
    own `<cascadeMessage>` children stay hidden for as long as it is. A cascade's
    own message continues to serve every gap that the next section does not cover
    itself.

    A `<cascade>` nested inside another waits its turn the same way: its own
    `<cascadeMessage>` children used to be shown while it was still several steps
    away, so a cascade of cascades spoke from every level at once. Each cascade now
    shows at most one message, and only once it is the next step.

- 2155e94: Fix plain-text labels being invisible in dark mode on prefigure-rendered graphs.

    Point, line/vector, and angle labels without LaTeX, along with graph axis
    titles, are rendered by PreFigure as native SVG `<text>` elements. Without an
    explicit color, PreFigure leaves these unstyled, which defaults to opaque
    black and disappears against a dark canvas. Math/LaTeX labels were unaffected
    since they render through MathJax, which already uses the page's text color.
    Plain-text labels now carry an explicit color that follows the page's
    light/dark theme.

- 5c94445: Shrink the eagerly-parsed standalone bundle by lazy-loading the editor stack
  (#1437). The `EditorViewer` behind both `DoenetEditor` and the `<codeEditor>`
  renderer now loads through a `React.lazy` boundary (an editor chunk that
  still fails to load after the retries renders the same inline
  renderer-failed-to-load message the viewer renderers use, keeping the rest of
  the page mounted), `@doenet/standalone` is
  code-split (`doenet-standalone.js` plus lazy `chunks/` resolved relative to
  the bundle URL). The split bundle pins its chunk URLs to its own version at
  runtime when served from a floating CDN tag (`@latest`, a version range, or no
  version), so an already-cached entry keeps loading its own release's chunks
  across releases instead of 404ing on the next release's hashes; under any
  other URL (self-hosted, exact-version) chunks resolve relative to the bundle
  URL as before. The `onload` contract of PreTeXt-style pages is preserved:
  `window.renderDoenetViewerToContainer` / `renderDoenetEditorToContainer`
  exist at `load` (queueing until the bundle finishes evaluating), and
  `window.doenetGlobalConfig` values a host sets at `load` are honored —
  `@doenet/doenetml` now adopts a host-created config object instead of
  replacing it, and a host-chosen `doenetWorkerUrl` stays in force (the
  bundle's own worker-URL resolution and version pinning defer to it).
  A second copy of the bundle loaded on the same page now stays fully inert
  instead of taking over the render globals: its worker-URL write and its
  `window.renderDoenet*ToContainer` / palette globals both defer to the first
  copy's, so every document pairs one release's UI with that same release's
  worker. When two copies load concurrently, render calls a host queued against
  one copy's `onload` stubs replay through the first copy that finishes
  loading — never stranded, even if the copy that installed the stubs fails to
  finish loading — and editor handles captured from a stub keep working after
  that hand-off.
  Duplicate copies of the component schema are eliminated
  (five down to two, none of them eagerly loaded). Hosts that evaluate the bundle from a Blob or `srcdoc` URL, where
  relative chunk imports cannot resolve, can use the new single-file
  `doenet-standalone-inline.js` published beside it. The `CodeMirror` component
  is now exported from `@doenet/doenetml/codemirror.js` instead of the main
  `@doenet/doenetml` entry, so importing the viewer no longer parses the editor
  stack.
- 37c99b6: Serve the core WASM as its own file beside the worker script instead of inlining it into the worker bundle as a base64 data URL. The worker fetches it at run time (from beside its own script, or from a jsDelivr URL pinned to the built release as a last resort) and hands the response to streaming compilation, so the browser's URL-keyed machine-code cache shares one compilation across all workers, iframes, and repeat page views — and the worker bundle shrinks from ~15 MB to ~6.3 MB. Single-file consumers (the inline-worker entry, the VS Code extension) still work with no network access: they bake the WASM in as a `data:` URL the worker decodes without fetching.

    Closes #1438.

## 0.7.24

### Patch Changes

- 78516e9: Editor: suggest, describe, and insert only text that is actually a reference.

    Autocomplete opened on every `.`, including one ending a sentence. It now opens only when the period continues an unfinished reference path — `$P.`, `$P.coords.`, `$rep[$i].`, `$(P.` — and a list that is already open closes as soon as the cursor leaves the name it is a list of names for, so typing `$P.(`, `$P."`, `$P. `, a second `.`, the `[` and `]` of an index, or anything but a name after a bare `$`, no longer leaves a stale list — or, once the reference is behind the cursor, the whole element menu — on screen.

    Three places also offered the forms `$(P).coords` and `$P.(coords)`, which read as a reference followed by literal text: a macro ends at the `)` of `$(P)`, and the grammar has no parenthesized property form. Member completions, the help panel, and the annotation skeleton snippet now all use the form that works.

    Completing a member into a path that needs the richer `$(…)` identifier syntax — because of a hyphen, say — rewrites the macro instead of parenthesizing one segment: accepting `my-p` after `$base.my` now gives `$(base.my-p)`, and accepting `p1` after `$s.sub-sec.` gives `$(s.sub-sec.p1)`. The help panel names paths the same way, the annotation skeleton writes `$(my-seg.endpoints[1].x)`, and completing a hyphenated name that takes an index inserts `$(my-rep[])` rather than `$(my-rep)[]`, whose macro ends before the index.

- 182de88: Fix illegible link and text contrast in description panels, especially in dark mode. The panel is the info button/popover (inline) or expandable `<details>` (block) attached to an image, video, graph, or input, so the fix reaches all of them; the link color change reaches every `<ref>` link as well.

    The attribution links generated from `licenseCodes` (and from `authorName`/`imageName`) were plain anchors with no color of their own, so they fell through to the browser's `#0000EE` — 1.2:1 against the dark panel, and worse once visited. `<ref>` links used `--mainBlue`, which is identical in both themes and reached only 1.6:1. Links now use a new `--linkText` custom property that differs per theme.

    The panel also painted surfaces of its own (`--revealButtonSurface` for `<details>`, a hardcoded `hsl(204 4% 16%)` for the popover) rather than the canvas. Style-definition contrast is checked statically against the canvas, so authored text colors could clear that check and still be unreadable inside the description. Both surfaces now use `--canvas`/`--canvasText`, which makes the existing guarantee hold there. Since neither panel has a fill to set it apart, both are outlined with a new `--panelBorder` custom property that meets WCAG's 3:1 non-text contrast against the canvas, replacing the popover's hardcoded near-canvas border (and its arrow's matching stroke), which was all but invisible in either theme.

- e973402: Editor: remove the small gap between the diagnostics/help panel's scrollbar and the editor's trailing edge.

    The inline padding that insets the panel text was applied to the panel's non-scrolling wrapper, so it pushed the scrolling element — and with it the scrollbar — in from the editor's edge. The padding now lives on the panel content instead, leaving the scrollbar flush against the resizer while the text keeps the same inset.

- 7c62983: Editor: make the selection unmistakable, and give the two hints that were competing with it channels of their own.

    The editor paints three things around text — the selection, the other occurrences of the selected text, and the tag pair under the cursor — and off the shelf all three were fills of nearly the same strength on the dark canvas: the selection at 1.32:1 against the canvas, the tag pair at 1.51:1, the occurrences at 4.51:1. The loudest was the one that mattered least, and authors reported the selection as effectively invisible and as getting lost against the tag-pair highlight.

    The selection is now 3.48:1 against the dark canvas — 3.27:1 on the line holding the cursor, where the active-line tint is painted over it, so it clears WCAG's 3:1 for non-text contrast either way — and 1.96:1 against the white one, up from 1.28:1. What was holding it down is that the fill is painted _behind_ syntax-colored text that has to stay readable on top of it, which capped how far it could move before the dimmest token fell below WCAG AA. Selected text now gets a single high-contrast color of its own, the way a native selection in any other input on the page does (white on dark at 5.39:1, near-black on light at 9.64:1), so the palette no longer sets the ceiling. Light mode also stops using the neutral gray the gutter is painted in, so the selection no longer reads as editor chrome.

    Occurrences of the selected text used to be marked in CodeMirror's stock `#99ff7780` green, which shouted over the selection it was echoing and, on the dark canvas, dropped every syntax token to between 1.35:1 and 3.5:1 — under AA. They are now a quiet blue drawn from the selection color, at 1.18:1 light and 1.47:1 dark, with every token clearing AA on top. The dark comment gray is a shade lighter (`#8b949e` → `#9ba4ad`) so that tint can register at all and still keep comments readable on it; comments stay plainly quieter than body content.

    The tag pair the cursor sits in is now outlined rather than filled, in a channel neither fill can be mistaken for, with the outline clearing 3:1 against the canvas in both modes.

    Ctrl+D (select-next-occurrence) used to blank out every occurrence mark on the first press — `highlightSelectionMatches` returns nothing at all once the selection holds more than one range, so the guidance disappeared exactly when a multi-cursor edit was relying on it. It is replaced by an equivalent that keeps marking whatever copies have not been taken yet, so each press visibly moves one occurrence from the hint color into the selection. Selections of a single character, or of nothing but whitespace, no longer mark anything.

    Also fixes the editor canvas in dark mode outside `EditorViewer`: `@uiw/react-codemirror` appended a theme of its own after ours whose only rule painted the editor white, leaving a dark-mode editor sitting on white anywhere the app's own belt-and-suspenders CSS override did not reach.

- a97239f: `<slopeField>` and `<vectorField>` take their function as a child rather than a `function` attribute, and gain a `variables` attribute.

    The `function` attribute is gone. A field's function is now written inside the component, either as a bare expression — `<vectorField>(y, -x)</vectorField>` — or as a `<function>` child, which may be a reference to one declared elsewhere. The two ways of saying the same thing were doing the same work: the bare expression was already being turned into a `<function>`, and the attribute created one too, so an author had to pick between forms that could not differ.

    The new `variables` attribute names the inputs of a bare expression, in order, and defaults to `x y`. `<slopeField variables="s t">s - t</slopeField>` reads that equation in the letters its author wrote it in, rather than requiring an explicit `<function variables="s t">` for the sake of two names. It is the same `variables` a `<function>` takes, and it is moved onto the wrapping `<function>` rather than read, so the names may themselves be references: `<vectorField variables="$v1 $v2">(r, -q)</vectorField>`, beside a pair of `<mathInput>`s named `v1` and `v2`, lets a student say which axis `q` names and which `r` does, and the field is redrawn as they type. It has no bearing on a `<function>` child, which names its own variables and is used exactly as written; writing both warns, rather than letting one of them silently do nothing, as does writing `variables` on a field with no expression inside it at all.

    A field also no longer takes a `<label>`. It covers the whole visible region, so there is nowhere for a label to sit, and none was ever drawn; one written on a field is now reported as the invalid child it is rather than accepted and ignored. The `labelIsName`, `applyStyleToLabel` and `maskLabel` attributes go with it, having nothing left to name, style or mask. `<pegboard>` is in the same position and loses its label too.

    A field whose function takes a single input now respects that function's `domain`. Such a function was being called with the lattice's `y` as a second argument, which is not a second input but a flag that suppresses the domain check, so marks were drawn right across the interval the function's author had excluded — everywhere except along `y = 0`.

- bb2b146: Graph: stop axis tick spacing from flickering between two values while a point is dragged.

    The number of minor ticks was chosen from the major-tick interval, but JSXGraph derives that interval from the number of minor ticks — it keeps a minimum pixel gap between minor ticks, so a larger minor count pushes the interval up. At some board scales the two never agree, and because the choice was remade on every render, the axis kept alternating between the two answers for as long as renders kept arriving. `<graph aspectRatio="2" ymin="-6" ymax="6" size="large">` was one such scale: dragging a point flipped the y axis between ticks every 2 and ticks every 1.

    The minor-tick count is now chosen by evaluating the candidates rather than iterating toward a fixed point that may not exist, so it settles; and it is recomputed only when something it depends on — the region the board shows, the canvas it is drawn in, or the axes themselves — actually changes, rather than on every render.

- 0754686: Line a list item's number up with a labeled `<choiceInput>` however it is wrapped, and stop a hidden first child from taking the lead.

    A labeled block `<choiceInput>` leading an `<ol>`/`<ul>` list item drew the item's number beside the first choice instead of beside the question label, because the label was rendered in a `<legend>` and a browser aligns a list marker with the content _after_ a legend. #1668 fixed that only where the core could tell the input it was leading a list item, which left the bug in place for wrappers that pass no such signal on — `<li><p>`, `<li><span>` and `<li><em>` all still drew the number a line low. The label now renders in an equivalent `<div>` wherever it appears, so nesting the input in anything at all keeps the number on the label's row. Its accessible name is unchanged (`aria-labelledby` names the fieldset either way) and so is its position on the line.

    A list item — an `<li>`, or a `<problem>`/`<task>`/`<part>` rendered as one — lines its number up with its first child, and suppresses that child's top margin. A child hidden with `hide` counted as that first child even though nothing of it renders, so the child behind it kept its top margin and lost its claim on the number. In `<li><p hide/><answer><choiceInput/></answer></li>` that put the marker beside the first choice instead of beside the question label. The first child that actually renders is now the one used, so hidden content can sit at the front of a list item without disturbing it.

    This holds at every level the number's alignment is passed down. Hiding a composite counts: a `<repeat hide>` or `<conditionalContent hide>` at the front of an item is skipped along with the replacements it stands in for. And every component that hands the alignment on now applies the same test to its own children:

    - A wrapper that leads the item — a `<div>`, `<blockQuote>`, `<stack>`, or `<sideBySide>` panel — so `<li><div><p hide/><answer><choiceInput/></answer></div></li>` lines up the same way the unwrapped item does. A wrapper also stops leading with a child that draws nothing anywhere, such as an `<animateFromSequence>`.
    - A `<sideBySide>` leading the item, which took its top-or-baseline alignment from its first panel whether or not that panel was shown. `<li><sideBySide><p hide/><graph/></sideBySide></li>` was laid out as though it led with a paragraph; it now top-aligns, exactly as it does with the hidden panel deleted.
    - An `<answer>` leading the item, which pointed at its first block `<choiceInput>` even when that input was hidden. The item now falls back to its usual alignment instead of lining the number up against an input nobody can see.

    A `<cascadeMessage>` no longer takes the lead either. It is hidden whenever the step around it is revealed, so a `<problem>` that opened with one gave its number, and the top-margin suppression, to a message the reader cannot see.

    Only a child's own `hide` counts, though. Hiding a _container_ does not re-pick the lead of anything inside it: a hidden `<ol>`, a hidden section, and a `<cascade>` step held back until earlier ones are done all hide their contents while leaving each item leading with exactly the child it would lead with if shown.

    An `<li>` leading with a box that offers no first line of text — a `<graph>`, `<image>`, `<video>`, `<figure>` or `<tabular>` — had its number drawn at the bottom of that box rather than beside its top. That was tracked separately as [#1673](https://github.com/Doenet/DoenetML/issues/1673), and the entry for it in this same release draws the number beside the top of such a lead instead. Two things this entry named as left over are deliberately still left over there: an item leading with a `<matrixInput>` keeps its number on the row its label sits on, which is where it belongs; and a `<p>` alone in a table cell keeps its own top margin, so an item leading with a `<tabular>` built that way now has its number on the item's first row with the cell's text a row below it.

- c9dd764: Fix `<ol>`/`<ul>` list markers misaligning with a labeled `<choiceInput>` first child.

    An `<ol><li>` whose first child was a labeled `<choiceInput>` (on its own or inside an `<answer>`) drew its "1." beside the first choice instead of beside the question label. The label was rendered in a `<legend>`, which a browser treats specially inside a list item: it aligns the item's marker with the content _after_ the legend. A block `<choiceInput>` now renders its label in an equivalent `<div>` instead — same accessible name, same position on the line — so the marker stays on the label's row wherever the input is nested (see the accompanying entry, which finishes this off for wrappers such as `<li><p>` that pass no list-item signal along).

    A list item's first child also gets the spacing a section's first child has always had: its top margin is suppressed. That is invisible in most lists, where the margin already collapsed into the 16px spacing around it. Where it shows is a list that mixes item shapes — an item of plain text followed by an item starting with a block (`<p>`, `<pre>`, `<blockQuote>`, `<graph>`, `<image>`, `<video>`, `<spreadsheet>`, `<tabular>`) no longer leaves a blank line between the two, matching the spacing two plain-text items already had. Likewise, a `<sideBySide>` leading a list item now top-aligns its panels the way it does inside a `<problem>`/`<task>` rather than stretching them.

- 968a347: Draw a list item's number beside the top of a leading `<graph>`, `<image>`, `<video>`, `<figure>` or `<tabular>` instead of at its bottom.

    An `<ol>`/`<ul>` list item leading with one of these had its number drawn after all of the item's content — for a graph, at the _bottom_ of the graph, some 250px below where a reader looks for it. The browser draws a list item's number on the item's first line of text, and the box these components render offers none of its own, so the browser fell back to putting the number last. Such an item now gets an empty first line at the top of its content for the number to sit on, taking no space of its own; the number lands exactly where the number of an item beginning with ordinary text lands. A container around the block lines up the same way: a `<graph>` inside a `<div>`, a `<sideBySide>` panel, a `<blockQuote>`, a `<stack>`, a `<pre>` or a `<figure>` is placed as one written directly in the item. A `<table>` is the exception, and for the ordinary case wants to be: it draws a name of its own — _Table 1_ — as the item's first line, and that name is the line the number belongs on. So a `<table suppressTableNameInTitle>` around one of these blocks, which leaves no such line, still has its number drawn at the bottom.

    A leading `<spreadsheet>` had the same missing first line show up the other way round: rather than putting the number last, the browser reserved a blank line at the top of the item to hold it. The number was in the right place, but the spreadsheet started a line below it. That line is gone too — the spreadsheet starts beside its number, and the item is a line shorter.

    Only items whose leading content has no first line of its own are affected, so an item that begins with text keeps the browser's own placement. That distinction is the point: a `<matrixInput>` puts its label on the matrix's last row and an item leading with inline math has a taller first line than a plain one, and in both the number belongs on that line rather than at the top of the item.

    A `<figure>` leading a list item also passes the item's top-margin suppression on to the content it holds, as the other container components do, so the number and the figure's content start on the same row. A `<caption>` is skipped when a container looks for the content the number lines up with, since it is drawn below that content whatever its position among the children.

    These items now line up exactly as the corresponding `<problem>`/`<task>`/`<part>` list items do, which draw their own numbers instead of asking the browser for one. For a leading `<figure>` that agreement is new on both sides: a `<problem>`, `<task>` or `<part>` beginning with a figure now draws its own number beside the top of the figure's content and suppresses the figure's top margin as well, where before it put the number on a baseline the figure had no text on.

    Closes #1673.

- d21fbc5: Fix `<odeSystem>` failing with "numeric is not defined" in the browser.

    Any document containing an `<odeSystem>` rendered as that error banner instead of a document, and any graph of a solution drew no curve. The solver, `dopri`, comes from numeric.js, bundled inside math-expressions. numeric builds most of its helpers at load time with the `Function` constructor, and the generated bodies reference a bare `numeric` — resolvable only if numeric has registered itself on the global object. It did that solely through Node's `global`, which neither a browser main thread nor a web worker has, so every generated helper threw the first time it was called, and `dopri` reaches them immediately. The worker's evaluation and the main-thread renderer's curve sampling both went through that path, so both failed.

    Fixed upstream in math-expressions 2.0.0-alpha95, which registers numeric itself; this bumps to it.

- e6064be: Fix a `<pegboard>` removed from a document coming back, and stop it taking a `<label>` it cannot draw.

    A pegboard listens for the graph's bounding box changing so that it can re-tile as the graph is panned or zoomed. That listener was never removed. The board outlives a pegboard taken out of the document — one inside a `<conditionalContent>` that switches off, say — so the next pan or zoom found no pegs and built a fresh set. Those pegs belonged to no component, so nothing could ever remove them; only reloading cleared them. The listener is now registered once, when the pegboard arrives, and removed when it goes.

    A `<pegboard>` also no longer takes a `<label>`. It fills the whole visible region, so there is nowhere for a label to sit, and none was ever drawn — one written on a pegboard was read and then dropped. It is now reported as the invalid child it is.

- 6c812b5: Add message catalogs for twelve African and Berber languages: Northern Sotho, Swati, Venda, Tsonga, Kikuyu, Bemba, Luo, Sango, Fula, Kabyle, Standard Moroccan Tamazight and Tachelhit.

    `documentLocale` and `<document lang>` work for all twelve with nothing configured, and each reaches `<document lang>`'s autocomplete. Northern Sotho, Swati, Venda and Tsonga complete South Africa's spoken official languages, which now all have catalogs. Fula is an ISO 639-3 macrolanguage, so Maasina, Adamawa, Nigerian and the other Fulfulde codes reach its Pulaar catalog too. Tifinagh is new to the roster with Tamazight and Tachelhit and needed nothing from `direction.ts`, since it runs left to right; Kabyle is in Latin letters, because that is what CLDR fills a bare `kab` in as, and a reader arriving under `ff-Adlm`, `kab-Tfng` or `shi-Latn` reaches the catalog and gets the script it is written in.

    These are **unreviewed machine-generated seeds**, and every file says so in its header. All twelve leave the two chemistry tables to English, and unlike recent batches they split no ways at all: every one is the school-system case, across a row of education ministries that teach secondary science in English, Afrikaans, Portuguese, French or Arabic. Afrikaans, in the same South African classrooms, supplies the whole table — which is a fact about the medium of instruction rather than about either language.

- 1c07eb6: Seed unreviewed message catalogs for four more African languages: Mende
  (`men`), Umbundu (`umb`), Kimbundu (`kmb`) and Zarma (`dje`). A document
  declaring one of these languages now renders its style descriptions, section
  headings, boolean words, answer buttons, editor chrome and diagnostics in it
  instead of falling back to English. The chemistry element tables are
  deliberately left out of all four and still fall back to English.

    Every string is machine-generated and has not been read by a speaker; each
    catalog says so in its header. Correcting one needs no permission.

    Zarma is a member of the Songhay macrolanguage, so readers arriving under
    `ddn`, `hmb`, `khq`, `ses`, `tda` or `twq` now reach it as well. A bare `son`
    is deliberately still served English: CLDR has no opinion about which Songhay
    variety it means, so choosing one would be a guess rather than a published
    fact.

    Umbundu and Kimbundu are the first catalogs in the roster centred on Angola,
    and Mende the third for a language of Sierra Leone.

- c39e46d: Add message catalogs for Ilocano, Waray, Hiligaynon, Kapampangan, Bikol, Balinese, Minangkabau, Acehnese, Madurese, Tetum, Tongan, Fijian, Tahitian, Chamorro and Tok Pisin.

    Each covers all four namespaces — the viewer chrome, the editor and language-server surfaces, the prose the core computes into a document, and the warnings and errors. `documentLocale="ilo"` and `<document lang="to">` work with nothing configured, and all fifteen reach `<document lang>`'s autocomplete.

    The batch takes the roster across the Philippines, the Indonesian archipelago, Timor-Leste, Polynesia, Micronesia and Papua New Guinea, and it brings the first Bikol macrolanguage fold: `bcl`, `bto`, `cts` and the other members reach the Central Bikol catalog rather than falling to English.

    These are **unreviewed machine-generated seeds**, and every file says so in its header. Nothing falls back silently: a key a translation is missing renders in English, which is what makes seeding safe.

- 3a3acd3: Add a message catalog for Klingon, the roster's first constructed language.

    `documentLocale="tlh"` and `<document lang="tlh">` work with nothing configured, and Klingon reaches `<document lang>`'s autocomplete. `tlh` is a registered IANA primary subtag, so it negotiates like any other individual language; `tlh-Piqd` reaches the Latin catalog, since Unicode does not encode pIqaD.

    This is an **unreviewed machine-generated seed**, and every file says so in its header. It is also the first catalog that is partial for a lexical rather than a curricular reason: Klingon's lexicon is closed — every word in it is one Marc Okrand has published — so words such as _parabola_, _attribute_ and _variant_ simply do not exist. It translates 160 of the 562 keys, using Okrand's published geometry vocabulary where it exists («gho» circle, «mey'» polygon, «chav» function) and leaving the rest to English rather than inventing roots, which is what makes seeding safe here as everywhere else.

    Markers and regions now build their one-colour description through the same message a stroke does. Every catalog writes that branch as the identity, so no language's output changes.

- a8be1de: Seed unreviewed message catalogs for twelve more languages, all written in
  Cyrillic and all spoken in the Russian Federation: Bashkir (`ba`), Chuvash
  (`cv`), Yakut (`sah`), Tuvan (`tyv`), Buryat (`bua`), Kalmyk (`xal`), Udmurt
  (`udm`), Komi (`kv`), Erzya (`myv`), Mari (`chm`), Ossetian (`os`) and Chechen
  (`ce`). A document declaring one of these languages now renders its style
  descriptions, section headings, boolean words, answer buttons, editor chrome
  and diagnostics in it instead of falling back to English. The chemistry element
  tables are deliberately left out of all twelve and still fall back to English.

    Three of the twelve are ISO 639-3 macrolanguages, so a reader arriving under a
    member code now reaches the catalog rather than English: Mongolia and China
    Buriat (`bxm`, `bxu`) reach Buryat, Komi-Permyak (`koi`) reaches Komi, and Hill
    Mari (`mrj`) reaches Mari. Each of those catalogs is written in one standard —
    Russia Buriat, Komi-Zyrian, Meadow Mari — and says so in its own header.

    Every string is machine-generated and has not been read by a speaker; each
    catalog says so in its header. Five carry an additional confidence caveat —
    `locales/cv`, `locales/tyv`, `locales/udm`, `locales/xal` and `locales/ce` —
    and two of those are worth naming: `locales/xal` (Kalmyk) is the least certain
    of the twelve, and `locales/ce` (Chechen) is the one catalog that agrees words
    with a noun class and is honest that it could verify the class markers but not
    the class of every noun it needed. Correcting any of this needs no permission.

- 9f2a2e1: Add message catalogs for twelve South Asian languages: Sanskrit, Maithili, Bhojpuri, Konkani, Dogri, Bodo, Manipuri, Santali, Kashmiri, Dhivehi, Tibetan and Dzongkha.

    `documentLocale` and `<document lang>` work for all twelve with nothing configured, and each reaches `<document lang>`'s autocomplete. Konkani and Dogri are ISO 639-3 macrolanguages, so Maharashtrian Konkani (`knn`) and Kangri (`xnr`) reach their catalogs too. Three scripts are new to the roster — Ol Chiki for Santali, Thaana for Dhivehi and Tibetan for both Tibetan and Dzongkha — and Kashmiri and Dhivehi bring the right-to-left catalogs to ten, needing nothing from `direction.ts`. Manipuri is written in Bengali letters rather than Meetei Mayek, because that is what CLDR fills a bare `mni` in as; its header says so and says a `mni-Mtei` catalog beside it is owed.

    These are **unreviewed machine-generated seeds**, and every file says so in its header. All twelve leave the two chemistry tables to English, for five different reasons the headers set out: seven are the school-system case, Bodo and Sanskrit have no settled list of all 118 to seed from, Santali has neither the schooling that reaches the table nor a list behind it, Dhivehi has both halves at once, and Tibetan alone has the names but no single convention to reproduce — while Dzongkha, in the same script, is partial for the opposite reason. Kashmiri's header additionally records that its adjectives should agree for gender and that this seed does not attempt it.

- 570cd8d: Seed unreviewed message catalogs for ten more languages: Baoulé (`bci`), Bini
  (`bin`), Bulu (`bum`), Jola-Fonyi (`dyo`), Efik (`efi`), Ewondo (`ewo`),
  Kpelle (`kpe`), Loma (`lom`), Susu (`sus`) and Urhobo (`urh`). A document
  declaring one of these languages now renders its style descriptions, section
  headings, boolean words, answer buttons, editor chrome and diagnostics in it
  instead of falling back to English. The chemistry element tables are
  deliberately left out of all ten and still fall back to English.

    Every string is machine-generated and has not been read by a speaker; each
    catalog says so in its header. Several of the ten — Ewondo, Bulu, Bini,
    Urhobo, Jola-Fonyi, Susu, Kpelle and Loma — carry an additional honest
    confidence caveat in their headers: low online lexical coverage for these
    languages means heavier reliance on English or French loanwords, and Loma in
    particular is the least digitized language seeded so far. Correcting any of
    this needs no permission.

- c3d8556: Seed unreviewed message catalogs for six more West and Central African
  languages: Kongo (`kg`), Fon (`fon`), Nigerian Pidgin (`pcm`), Krio (`kri`),
  Kabiyè (`kbp`) and Temne (`tem`). A document declaring one of these languages
  now renders its style descriptions, section headings, boolean words, answer
  buttons, editor chrome and diagnostics in it instead of falling back to English.
  The chemistry element tables are deliberately left out of all six and still fall
  back to English.

    Every string is machine-generated and has not been read by a speaker; each
    catalog says so in its header. Correcting one needs no permission.

    Kongo is a macrolanguage, so a reader arriving under `kwy`, `ldi`, `kng` or
    `kon` now reaches it as well. Kituba (`ktu`, `mkw`) is deliberately _not_ folded
    onto Kongo: it is a creole of Kikongo rather than a variety of it, and a Kituba
    reader would be served a different language.

    Kabiyè has no CLDR language name, so it takes a `LOCALE_NAME_FALLBACKS` entry
    and appears as "Kabiyè (Kabɩyɛ)" in `<document lang>`'s autocomplete and context
    help rather than as the bare code "kbp".

- 90a33ae: Add message catalogs for eleven West and Central African languages: Rundi, Nyankole, Luba-Lulua, Kituba, Mooré, Dagbani, Dyula, Mandinka, Ga, Tiv and Kanuri.

    `documentLocale` and `<document lang>` work for all eleven with nothing configured, and each reaches `<document lang>`'s autocomplete. Kanuri is an ISO 639-3 macrolanguage, so the Manga, Bilma and Tumari codes reach its Central Kanuri catalog too; `man`, the Manding macrolanguage, is the first this repository has catalogs for three _members_ of rather than for itself, and it reaches Mandinka because CLDR's likely-subtags resolves a bare `man` to the Gambia. Rundi's directory is named `rn` and needs no alias, since `Intl.getCanonicalLocales` already rewrites `run` to it. A Manga Kanuri reader arriving under `kby-Arab` reaches the catalog and gets Latin, which is the same debt `ha-Arab` and `ff-Adlm` already carry.

    Locales that CLDR has no name for are now labelled with a name instead of with their own code in `<document lang>`'s autocomplete and context help. That covers `dag`, `ktu` and `mnk` from this batch — now "Dagbani (Dagbanli)", "Kituba (Kikongo ya leta)" and "Mandinka (Mandinkakaŋo)" — and also fixes `nah`, added in an earlier batch, which had the same gap and now reads "Nahuatl (Nāhuatl)".

- 3c33536: Add `<slopeField>` and `<vectorField>` graphical components for drawing direction fields on a `<graph>`.

    `<slopeField>y - x</slopeField>` draws the slope field of a differential equation as tick marks on a lattice; `<vectorField>(y, -x)</vectorField>` draws a two-output function as arrows, either scaled by magnitude or normalized to show direction alone. Both take their function inside the component, either as a bare expression or as a `<function>` child, which may be a reference to one declared elsewhere and may take one input or two. A bare expression is read as a function of both `x` and `y`; a `<function>` child keeps whatever variables its own author named. Given a function with the wrong number of outputs for the component, a field draws nothing and warns, naming the sibling component that does want it. The lattice they are sampled on is set by `dx`, `dy`, `xoffset` and `yoffset`, which mirror `<pegboard>`'s attributes of the same names, along with `markLength` (measured in pixels) and `maxMarks`. A slope mark is centered on its lattice point, sampling the tangent line through it, while a vector field's arrow has its tail on the lattice point so it shows the vector at that point.

    Authors previously built these by nesting `<repeatForSequence>` to emit one `<lineSegment>` per lattice point, which does not scale: the reactive core has to evaluate several math expressions per mark and JSXGraph creates an SVG element for each one. A field of a few hundred marks built that way takes about 16 seconds to appear; `<slopeField>` draws a field of comparable density in about 1 second, using a constant number of SVG nodes instead of one per mark, because the whole field is a single curve whose coordinate arrays carry NaN pen-ups between marks.

    Two things follow from doing the geometry in the renderer that the hand-built version could not do. The field re-tiles from the live bounding box as the graph is panned or zoomed, rather than being pinned to a hard-coded range; and marks are sized in pixels, so they stay the same length and show the true visual angle even when the axes are not equally scaled — the hand-built version was only correct under `identicalAxisScales`. `maxMarks` bounds the work by coarsening the lattice when zoomed out, rather than leaving the mark count unbounded.

- bd38f21: Viewer: make the virtual keyboard usable on phones and tablets.

    On a touch device the Doenet keyboard and the device's own on-screen keyboard
    were competing for the same screen. Tapping a math input raised the system
    keyboard, which on iOS covered the Doenet keyboard tray outright; on Android,
    dismissing it was futile, because pressing a Doenet key blurred the input and
    the refocus that followed summoned the system keyboard again.

    A math input on a touch device now sets `inputmode="none"` from the outset —
    not merely once the tray is open, which would be too late to stop the system
    keyboard appearing at the first input the reader taps — so the device leaves
    its own keyboard down. Focus, the caret, selection, and any physical keyboard
    still work as before. The tray also declines focus when it is pressed, so the
    input no longer blurs and is no longer refocused on every key. Tabbing into
    the tray does not end the edit either — the keys still go to the input that
    was left, and what was typed is committed once focus leaves the tray for
    somewhere other than that input. Closing the tray hands the device's keyboard
    back; the choice is remembered, so the tray stays shut, and the system
    keyboard keeps coming up, as the reader moves between math inputs until they
    ask for the Doenet keyboard again. When the
    system keyboard is the one in use, it no longer capitalizes or autocorrects
    what is typed into a math input.

    The tray now follows focus on touch devices: it opens when a math input takes
    focus and gets out of the way when focus moves to something else, such as a
    text input, whose editing wants the device's own keyboard. Several viewers can
    share a page; the tray stays open while any of them has a math input focused.
    On a desktop the tray remains under manual control, exactly as before.

    Which input the keyboard types into is now recorded explicitly rather than
    inferred from a 100 ms window between a blur and a tray press. Besides being
    deterministic, that decouples typing from `document.activeElement`, which is
    the prerequisite for operating the keyboard from the keyboard (#747). The
    record is also taken correctly for a math input focused the instant it
    appears, which used to leave the virtual keyboard typing nowhere until the
    reader left that input and came back to it.

    Note for embedders of `@doenet/doenetml-iframe`, where the wrapper hosts the
    tray and the iframe holds the viewer, and the two can come from different
    releases — a `doenetmlVersion` or `standaloneUrl` naming a particular release,
    a document declaring an `xmlns` version that the wrapper's version
    autodetection pins to, or simply a wrapper installed before the viewer it
    loads from the CDN. A viewer from this release **can** be driven by a tray
    from before it: the old tray announces itself by the `accessed` message it
    sends as it takes focus, and its keys are then delivered to the math input the
    same press blurred a moment earlier, with the caret given back afterwards —
    including when the press carried no key, such as opening the tray while
    already editing an input. Only that input, and only that moment: a press made
    after the reader has left a math input of their own accord types nowhere and
    moves no caret, as before. Under such a tray the Doenet keyboard is the only
    one on offer on a touch device: the tray does not follow focus, so the reader
    opens it themselves as they always did with it, and closing it does not hand
    the device's own keyboard back, because that tray has no way to report that
    they asked for it. This is the pairing that arises the moment a new viewer is
    published under an already-deployed wrapper, so it is the one worth keeping
    working — without it, a phone reader would meet a math input that raises no
    keyboard at all and a Doenet keyboard that types nothing.

    The opposite pairing cannot be rescued from the viewer's side: a viewer from
    before this release typed only in response to a blur that this tray no longer
    causes. An embedder pinning a viewer older than this release should pin the
    wrapper with it. Physical keyboards are unaffected either way.

    Closes #1692.

## 0.7.23

### Patch Changes

- e8253e7: Fix `@doenet/standalone` rendering every language in English.

    The bundle published as 0.7.22 never requested a message catalog. A document declaring `<document lang="ar">` was recognized in every visible way — it laid out right to left, negotiated its locale, labelled itself `lang="ar"` — and then read "Check Work", because the catalog that would have said otherwise sat unfetched beside the bundle.

    The one file held two copies of `@doenet/i18n`: one built from source for `src/index.tsx`, which installs the loaders that fetch the served catalogs, and one already compiled into `@doenet/doenetml`, which is the copy the viewer resolves a language through. The loaders are module-level state and do not cross between instances, so the viewer's copy held none, judged every language unloadable, and fell back to English — which is exactly what it is supposed to do when a catalog cannot be reached, and therefore said nothing about it.

    `@doenet/doenetml` now re-exports `setLocaleLoaders` and `fetchLocaleLoaders`, and `@doenet/standalone` reaches them through the same entry point its viewer comes from, which makes the setter and the reader one instance. A host installing its own catalogs should import them from `@doenet/doenetml` for the same reason.

    Two guards, because neither half of this was visible: `npm run check:i18n-instances` fails the build when any built package holds more than one copy of `@doenet/i18n` in one script, and a component spec renders a document in a language only a served catalog carries and asserts the request goes out.

## 0.7.22

### Patch Changes

- ca0e785: Keep the whole check-work widget in one language.

    The button rested on a label in the document's language and then reported "Correct", "37% Credit" or "Response Saved" in the reader's, so an activity declaring `lang="es"` read with `uiLocale="en"` said "Revisar" and then "Correct" on the same control.

    The button, its verdict, the attempts-remaining message beside it and the validation state announced on the input now all follow the document. An author can name that button from their own prose — "Pulsa el botón $ans.submitLabel" — and a sentence that names the button has to name what the button actually says, so the label, the prose pointing at it, and the verdict are all one language.

    Nothing changes when the reader's language and the document's agree. Where they differ the whole widget is now the document's — including when an activity declares no language at all, which counts as English: a reader who set `uiLocale="es"` used to see a Spanish "Correcto" beside an English "Check Work", and now sees the control wholly in English. One language on one control is the trade.

    Error boxes still follow the reader: a diagnostic is addressed to whoever is looking at the screen, and no authored prose ever refers to one.

- 84e1ec6: Write the names the chemistry components generate in the document's language: all 118 element names, the name an ion takes, and the message shown where a symbol names nothing.

    Symbols, formulas, and anything an author's `<award>` compares against by value are unchanged. Only what is displayed as prose moves. An element's periodic group, its phase at STP and its metal category read as words but are compared as values — `$atom.groupName = Noble Gas` — so they stay as the atom database spells them in every language.

    An ion's name is now looked up rather than derived. English builds an anion's name by stripping a trailing "ine" and adding "ide", with a small table for the words that rule does not fit — that is English morphology, and no other language derives its anion names that way. Each language supplies its own names instead. A transition metal's oxidation state keeps its Roman numeral, which is international, but where it sits and how it is punctuated is now the catalog's to say.

    A document that declares no language reads exactly as it did before.

- fd3ee74: Translate Chinese into both scripts: `zh-Hans` for Simplified and `zh-Hant` for Traditional.

    Catalogues the pair by script rather than leaving Simplified as a plain `zh`, which is what makes a Traditional reader reach Traditional text. Locale negotiation tries the region-stripped tag before it consults likely-subtags, so a catalog named `zh` would answer `zh-TW`, `zh-HK` and `zh-MO` ahead of `zh-Hant` — a reader in Taipei would be served Simplified. Named by script, `zh-CN` and `zh-SG` reach `zh-Hans`, the Traditional regions reach `zh-Hant`, and a bare `zh` reaches `zh-Hans`, which is what it means.

    `<document lang="zh">` and `documentLocale="zh"` therefore render Simplified, as the tag says. `zh-Hans` and `zh-Hant` are what `<document lang>`'s autocomplete offers, as _Simplified Chinese (简体中文)_ and _Traditional Chinese (繁體中文)_.

    The Traditional catalog is a full translation rather than a character conversion of the Simplified one, and follows Taiwan usage where the two diverge — 預設 over 默认, 變數 over 变量, 質數 over 素数, 元件 over 组件, 參照 over 引用. A table's rows and columns are 列 and 欄, the opposite assignment to the mainland's, so the matrix and data-frame messages are not a mistranslation of their Simplified counterparts. Several elements are named differently too, 矽 for silicon among them.

    Both remain **unreviewed machine-generated seeds**, as their headers say. Both are complete, so neither leans on the other, and a Traditional reader never falls through to Simplified: `zh-Hant` and every region that implies it negotiate to `["zh-Hant", "en"]`.

- 97d65a5: Editor: Add bidirectional click-to-navigate between the source editor and the rendered preview.

    Clicking a rendered element now moves the editor's cursor to (and reveals/centers) its source location, and moving the editor's cursor scrolls the preview to follow, debounced so it doesn't fight active typing. Works in both the VS Code extension's preview panel and `DoenetEditor`'s built-in CodeMirror editor. Clicks on a graph navigate to the `<graph>` source, clicks on the graphical elements inside it (point, vector, line, ray, lineSegment, circle, polygon, polyline) navigate to the element's own source, and drag releases don't navigate.

    Implementation notes: the core now includes each component's source `position` in its renderer instructions; `DocViewer` maintains an id-to-position map from that stream to power a delegated capture-phase click handler and a `scrollToSourceOffset` prop; the line-family renderers report clicks on their JSXGraph elements through a `DocContext` callback at the same click-vs-drag disambiguation point that powers `triggerWhenObjectsClicked`. Content brought in by a copy (e.g. `$g` or `<graph extend="$g">`) navigates to the copy the author wrote where it renders, not to the copied component's original definition.

    Also fixes `@doenet/codemirror`'s library build, whose Vite config pointed `lib.entry` at `CodeMirror.tsx` instead of `index.ts` — silently dropping any runtime (non-type-only) export added to `index.ts` from the built bundle that `@doenet/doenetml` consumes.

- 67835f6: Editor: click-to-navigate now requires Cmd+click (macOS) / Ctrl+click (Windows/Linux), like go-to-definition, so plain clicks interact with the document without moving the editor.

    - Preview → editor (both the VS Code preview panel and `DoenetEditor`): navigation to an element's source fires only with the modifier held, including clicks on graph boards, margins, and individual graph elements (Cmd/Ctrl+Enter is the keyboard equivalent on a focused graph element). The element's normal click behavior still fires alongside navigation.
    - `DoenetEditor` editor → preview: the debounced follow-the-cursor scroll is replaced by Cmd/Ctrl+click on a spot in the source, which scrolls the preview to the element rendered from that offset. Typing and plain cursor moves never scroll the preview. `Cmd/Ctrl+Alt+P` does the same for the cursor's position, so the gesture is reachable without a mouse. The code editor otherwise reads that same modifier as "add another selection range", so mouse-driven multiple selections are turned off in it: the gesture leaves a single cursor where you clicked, and extra cursors now come from `Cmd/Ctrl+D` instead.
    - VS Code editor → preview keeps following the cursor, as it does today, since the VS Code API exposes no mouse modifiers for editor clicks and so has no way to spell the web editor's Cmd/Ctrl+click gesture. Two additions: a `Scroll Doenet Preview to Cursor` command bound to `Ctrl+Alt+P` (`Cmd+Alt+P` on macOS), rebindable from the Keyboard Shortcuts UI and the same chord as the web editor — on macOS that chord otherwise toggles the find widget's Preserve Case, which the new binding takes over while the text of a Doenet file has focus; and a `doenet.preview.scrollPreviewWithEditor` setting (default on, like VS Code's own `markdown.preview.scrollPreviewWithEditor`) that turns the cursor-following off, leaving the command as the only thing that moves the preview.
    - For host apps driving `DoenetViewer` directly: `onSourcePositionClick` now fires only for modified clicks, so a host no longer has to filter plain ones out itself. `scrollToSourceOffset` is unchanged for hosts that drive it from a moving cursor, but a host that drives it from a discrete gesture should set it back to `null` between requests, so that repeating the same offset scrolls again.

    Since touch devices have no modifier key, click-to-navigate is unavailable on touch.

- becd31c: Context help now names the shortcut that works on a Mac: Option+I.

    The panel's "Press Ctrl+Space to see all N components" footer named a key
    combination Mac users cannot use. CodeMirror binds a literal Control+Space on
    every platform, but macOS claims Control+Space for "Select the previous input
    source", so the keystroke is swallowed before the editor sees it. CodeMirror
    ships mac-only alternates for that reason, and the panel now points at one of
    them (Option+I) when running on a Mac; other platforms still see Ctrl+Space.
    The authoring guides that point at the autocomplete menu name the Mac
    alternate too.

    Closes #1537.

- ca53727: Render the editor's context-help panel in the reader's language.

    The panel that explains whatever the cursor is on was the last English surface left inside the editor. Its labels, its placeholder, and the sentences it writes about a reference — "`$m` is a reference to `<point>` (line 4)" — now come from the catalogs, with Spanish alongside.

    Those sentences stay whole rather than being split at the markup inside them, so a translation decides where each quoted name sits and how the sentence is punctuated around it. Element names, attribute names and `styleNumber` stay as written, and the descriptions the panel shows still come from the schema, which is generated from the documentation and is not translated.

- c205608: Editor: fix the code editor's text-selection highlight so highlighted (selected) text stays legible, especially in dark mode.

    The selection highlight was rendering with CodeMirror's built-in light lavender (`#d7d4f0`) in every mode: the theme's own selection rule never took effect (CodeMirror's base theme targets the selection with a higher-specificity selector), and the editor was never told it was in dark mode, so it also fell back to CodeMirror's light-mode defaults. On the dark canvas the near-white and brightly-colored syntax tokens were then washed out under the pale highlight — and clicking away from the editor made it worse, reverting the blurred selection to the base light-gray default.

    The dark-mode selection is now a dark navy (`#092c4d`) that keeps every syntax token — down to the dim comment gray — at WCAG AA contrast (≥ 4.5:1) while still reading as a selection, and light mode now correctly uses its intended neutral gray. The override matches CodeMirror's base-theme selector for both the focused and blurred states, and the theme now passes the real brightness to CodeMirror so its base defaults align.

    The light-mode comment color is also darkened slightly (`#656d76` → `#5c636d`) so highlighted comments clear WCAG AA against the light selection background too (they previously sat at ~4.1:1); it remains above AA on the white canvas.

    Adds `@doenet/codemirror` Cypress component tests (`selectionAccessibility.cy.tsx`) that select highlighted code and assert the WCAG contrast between each rendered token color and the actual selection-background color, in light mode, dark mode, and after the editor is blurred. (`cy.checkA11y` can't be used for this: axe-core cannot resolve CodeMirror's separate selection layer / `::selection` pseudo-element and instead compares tokens against a phantom white background.)

- 4ef80b6: Fix a "Found a duplicate componentIdx" crash when content containing a dynamic index reference (such as `$p[$i]`) is repeatedly removed and recreated.

    A reference with a dynamic index creates a hidden copy to resolve the index (for example, the copy that evaluates `$i` in `$p[$i]`). That copy lives in the referencing component's internal reference resolution rather than among its children or attributes, so deleting the component left the copy behind. When the surrounding composite — for instance a `<conditionalContent>` case or the branch of a `<triggerSet>` — later recreated its replacement and reused the same reserved component indices, the leaked copy's index collided and the activity errored. Deletion now also removes the copies created for reference-path indices, so such content can be recreated cleanly.

- d798fb3: Warn that the `description` attribute is deprecated in favor of a `<shortDescription>` child.

    `<image description="A tree" />` has quietly gone on working since version 0.6: normalization rewrites the attribute into a `<shortDescription>` child, so it still supplies the alt text. But the attribute is in neither the schema nor the documentation, which left old source being carried forward with no indication that it is writing something no longer supported. It now says so, on all ten components that accepted it — `<image>`, `<video>`, `<graph>`, `<answer>` and the `<*Input>`s — and keeps working exactly as before.

- f363e32: Offer the languages DoenetML has translations for as autocomplete and help for `<document lang>`.

    Typing `lang="` in the editor now lists each language by tag, named in English
    and in itself — `es` as "Spanish (español)" — and the context-help panel shows
    the same list under "Suggested values". The list comes from the catalogs in the
    repository, so a language added later appears in both places without anyone
    maintaining a second copy of it.

    They are suggestions, not a constraint. `lang` still takes any BCP-47 tag, and
    a document in a language nobody has translated the interface into is not a
    mistake: its tag reaches the rendered `lang` attribute, where a screen reader
    picks a voice and the browser hyphenates, with only the prose the core computes
    falling back to English. So the editor draws no squiggle under a tag it does
    not recognize, the help panel says "Suggested values" rather than "Allowed
    values" so it does not claim a rule nothing enforces, and typing an unlisted
    tag unquoted still gets the same offer to quote it that any free-text attribute
    gets.

- 164d88e: Render the editor's own chrome in the reader's language.

    The viewer chrome was translated; the editor's was not, so a reader who set `uiLocale="es"` — or opened a document declaring `<document lang="es">` — got a Spanish document inside an English editor. It showed worst in the Diagnostics panel, where a translated message sat beside an untranslated `Line #2`.

    The footer, the diagnostics and responses panels, the variant picker, the accessibility button and the update button all follow the same language now, and that language is the one the viewer resolved rather than the one the surrounding host chrome uses — so the two halves of the editor can never disagree. Spanish translations ship with it.

- f630ca2: Show the editor's diagnostic tooltips in the reader's language: the message, the severity heading above it, and the accessibility headings.

    Hovering a squiggle was the last place a diagnostic stayed English no matter who was reading. The checks the language server runs as you type — an unrecognized element, one in a parent that doesn't accept it, an unknown attribute, a value outside its enumeration — now read in the same language as the Diagnostics tab beside them.

    The lint panel and what a screen reader announces follow the same text, so no surface of one diagnostic disagrees with another. A document that declares its own language is read in that language here too, the same as everywhere else the reader's language is left unset.

    A language that arrives after the editor is already up — a host switching it, or a `<document lang>` the viewer has only just parsed — redraws the squiggles that are already marked, rather than leaving them in the previous language until the next edit.

    Also fixes squiggles disappearing when the editor re-renders. Re-rendering `<DoenetEditor>` reconfigures the CodeMirror instance behind it, which used to discard every diagnostic on screen — and nothing brought them back until the language server next published. The editor now carries the lint state in its own configuration, so what is marked stays marked.

    With no locale configured anywhere, every tooltip reads exactly as it did before.

- b97857e: Render the red error box inside a document in the reader's language, instead of leaving it English beside a Diagnostics panel that was already translated.

    The same error reported in two places used to read in two languages: the panel showed the reader's, the box in the document showed the English the worker wrote. The box now renders from the same code and arguments the panel does, so the two agree.

    The line the error was found on follows the reader too. It is a message with a line number in it rather than a sentence the worker assembles, so a translation can put the number where its own language wants it.

    An error that has no code yet still shows the English it arrived with, unchanged.

- e8d9809: Editor: stop the hover from showing one problem twice, and let error messages
  be translated like every other diagnostic.

    Errors raised while the source is being turned into components are thrown, not
    built, and the `_error` component they become had nowhere to keep the code
    naming the situation — so an error was the one diagnostic that could only ever
    reach the reader in English. It now carries the code and its arguments through,
    and the invalid-component-type, repeated-attribute and invalid-attribute errors
    are translatable wherever diagnostics are shown — the Diagnostics panel, the
    editor hover, and a host's `setDiagnosticsCallback`. The error box drawn in the
    document itself still reads in English; that is a separate step.

    That also fixes what would have surfaced as duplicate squiggle text: the LSP
    merges the parser's copy of a diagnostic with the worker's echo of it, and once
    the echo is rendered in the reader's language the two are no longer the same
    string. A record is now matched by its message and, when it has one, also by
    its code plus the arguments filling it in — agreeing on either makes it the
    same diagnostic, so a copy that has a code and one that doesn't still collapse
    while they agree on the English. The arguments are part of the match because a
    code names a message template rather than one occurrence of it: a single
    component can report the same code twice with different values, and both still
    reach the author.

- abf2779: Graph: warn about an unusable `grid` value instead of failing.

    A `grid` whose pieces could not be parsed — `grid="(1, 2)"`, where the space falls inside the parentheses — took the whole document down with a red `Expecting ) or ]` box. It is now reported as an invalid value like any other.

    Values that were already ignored in silence, such as `grid="(1,2) (3,4)"`, `grid="0 1"`, and `grid="1"`, now say so: the warning names the value and the forms `grid` accepts. A value that comes from a reference stays quiet: `grid="$gx $gy"` is unusable until the reader fills the inputs in, and `grid="$choice"` is how a reader picks `none`, `medium`, or `dense` in the first place.

    The editor's own description of `grid` was offering values it never accepted — `off`, `minor`, `major`. It now describes the values it does accept.

- dd4f83e: Graphs: stop math drawn inside a graph from taking a keyboard tab stop.

    A graph is presented to assistive technology as a single image named by its `<shortDescription>` — or hidden entirely, when it is `decorative` — so a label drawn inside it is not separately reachable. MathJax, though, marks every expression it renders as focusable, which put a tab stop on each math label in the graph: `<graph><label><m>A</m></label></graph>` made keyboard users stop on an `A` that is not in the accessibility tree and does nothing when focused.

    Math drawn inside a graph is now skipped when tabbing. Math elsewhere on the page is unchanged, as are the graph's own keyboard-navigable objects and any input or button anchored in it — those still take focus as before.

- 2049662: Agree the Hindi word joining a fill pattern to the shape it fills. `वाला` is itself an adjective that agrees with the shape, so a filled line with dots now describes itself as `बिंदुओं वाली हरी भरी हुई रेखा` rather than putting a masculine word in front of a feminine noun.
- dd10466: Translate more of the words the core computes into a document: boolean words, the default submit-button labels, and the `if`, `or` and `otherwise` a piecewise function writes around its branch conditions.

    A `<boolean>` or `<booleanInput>` in a Spanish activity now reads "verdadero" and "falso" where an author interpolates `$b.text` into their prose. The _value_ is untouched: `true` and `false` are DoenetML syntax, so an `<award>` comparing against them, and saved state holding them, work the same in every language. Where a boolean is read back out of text — `$b.text` bound to an input — both spellings are accepted.

    An answer's submit button says "Revisar" instead of "Check Work" in a Spanish activity, and the same for a section-wide check-work button. Only the _default_ is translated: `submitLabel="Ready?"` is the author's own wording and passes through verbatim in every language, including when it happens to match the English default.

    `<intComma>` groups by the document's own conventions rather than always in English — `25.236.501,35` in Spanish or German, `12,34,567` in Hindi. It still groups rather than rounds, so a value written with trailing zeros keeps them.

    `<pluralize>` works by running an English model over its text, and there is no equivalent for an arbitrary language. In a document written in another language it now leaves the text alone and says so, rather than silently doing nothing — unless the author supplied a `pluralForm`, which needs no model and is used in every language, with `basedOnNumber` choosing between the two forms. `<lorem>` stays Latin in every language, which is what placeholder text is for.

    Numbers inside mathematics keep `.` as their decimal separator in every language. A decimal comma is a real and wanted feature, but it has to arrive on the input side at the same time — until then, changing it would change what a grader compares rather than only how it looks.

    An answer's or section's `showCorrectness` and `colorCorrectness` are now properties an author can reference as `$a.showCorrectness` and `$a.colorCorrectness`, reporting the resolved values after any enclosing section's setting, hand-grading and the activity-wide flag are taken into account. The raw attribute values behind them, and the raw value behind a submit label, are no longer reachable under their internal names.

    With no locale configured, every one of these reads exactly as it did before.

- ea07d40: Give stable codes and translatable messages to the remaining directly authored
  diagnostics in the worker: the PreFigure renderer's fallbacks, `<updateValue>`,
  `<copy>`, `<collect>`, `<dataFrame>`, `<answer>` and section-wide check work,
  `<module>` attributes, `<conditionalContent>`, `<slider>`, pretzel validation,
  `<mathInput>` function names, and invalid attribute values. Lists and counts in
  these messages now agree through the catalog rather than through string
  concatenation.
- 0110575: Give stable codes and translatable messages to the diagnostics raised by the
  math components: `<circle>`, `<function>`, `<sequence>` and
  `<selectFromSequence>`, `<animateFromSequence>`, `<odeSystem>`, `<angle>`,
  `<parabola>`, `<intersection>`, and the ionic-compound and eigendecomposition
  helpers. Counts inside these messages now agree with their nouns through the
  catalog rather than through string concatenation.
- 5760bf2: Give stable codes and translatable messages to another 48 diagnostics, covering
  accessibility checks, `<label>`'s `for` attribute, `<sideBySide>`, `<sort>` and
  `<shuffle>`, attract and constrain targets, and index ordering. The
  section-heading contrast warning now picks its dark-mode wording from the
  catalog and formats its ratio for the reader's locale instead of assembling
  English in the caller.
- 5873ff7: Translate the diagnostics that explain why unique variants could not be
  determined, and the warnings the PreFigure graph conversion raises.

    These were the largest group of messages still reaching authors only in English.
    Three helpers built them on their callers' behalf, so roughly sixty messages sat
    behind three diagnostic constructions — invisible to the migration's own
    progress count, and unreachable by any translation.

    The English is otherwise unchanged. The one exception is a PreFigure warning
    about a descendant with no component type, which now names it `<?>` rather than
    `<unknown>`: the subject of these warnings is handed to the message as an
    argument, so an English word there is one no translation can reach.

- e2ddc2d: Stop reporting the core's broken invariants as diagnostics.

    Eighteen messages raised when something inside the core does not add up — a
    state variable that should exist and doesn't, an array index past the end of
    its own array, a parent that vanished before its children were added — no
    longer reach the diagnostics list. They name state variables and component
    indices, never anything in the document, and there is nothing an author can do
    about one. They are now plain English lines on the console, worded exactly as
    before.

    Three more named something an author had written, and those become two
    translated warnings that say only that part: an index that cannot be applied
    now reads ``Cannot reference index `$p.styleDescription[1]` `` and is marked on
    the reference that wrote it rather than on whatever it pointed at, and a
    `<callAction>` whose `actionName` the target does not have now reads
    ``Cannot call submitAnswer on component `$p` `` rather than quoting a component
    index no author has seen.

- c021a4b: Translate the parser's diagnostics — the unclosed tags, mismatched quotes,
  invalid names and deprecation notices an author sees before anything runs, and
  usually the first Doenet message a beginner ever reads. Spanish included, so a
  `uiLocale="es"` reader now gets them in Spanish rather than in English.

    A parser error reaches the editor twice: once from the language server and once
    as the worker's echo of it. Both copies now carry the same stable code, so the
    editor recognizes them as one error and shows the translated one, instead of
    the same problem twice in two languages.

    The seventeen hand-written deprecation notices, which differed only in the
    attribute and component names they mentioned, are now three messages — one per
    shape — with the component name chosen in the catalog rather than pasted in
    beforehand, so a translation can place or drop that clause as its own grammar
    requires.

- 79fedef: Add a `lang` attribute to `<document>` and `documentLocale` / `uiLocale` settings to the viewer and editor, laying the groundwork for translated activities.

    `<document lang="es-MX">` declares what language the content is written in. The rendered activity then carries a matching `lang` attribute, so screen readers pronounce the content with the right voice and rules — an accessibility improvement that applies today, before any strings are translated.

    `<document>` also gains a public `locale` property reporting the language tag actually in effect, whether that came from an authored `lang` or from the host.

    Hosts can supply the same information from outside the document with the new `documentLocale` prop (`data-doenet-document-locale` on a standalone container), and can set the language of the surrounding interface separately with `uiLocale`, which defaults to following `documentLocale`. An authored `lang` always wins over the host's setting: the author knows what language they wrote in. Both settings are available through `DoenetViewer`, `DoenetEditor`, `@doenet/standalone`, and `@doenet/doenetml-iframe`; the React components additionally take a `localeResources` prop for supplying translated message catalogs.

    Language tags are accepted in any casing (`ES-mx` works the same as `es-MX`), and a blank tag counts as not set.

    Content itself is not translated yet. With the default locale, output is unchanged.

    Also corrects two long-standing errors in the `@doenet/standalone` README: it showed `data-doenet-*` settings on the inner `<script type="text/doenetml">` element, when they are read from the container element only, so attributes written on the script have never taken effect; and its usage example called a global named `renderDoenetToContainer`, which does not exist — the exported globals are `renderDoenetViewerToContainer` and `renderDoenetEditorToContainer`.

- e818298: Translate the viewer's own interface, and ship Spanish.

    Buttons, panel headers, error messages, and screen-reader announcements — "Correct", "Response Saved", "Max credit available: 80%", "1 attempt remaining", "Show footnote", the "(click to open)" beside a solution, hint, or collapsible section heading, the "This document contains errors!" banner, the matrix input's row and column controls, the subset-of-reals input's mode buttons, the orbital diagram's row, box, and arrow buttons, the ⓘ tooltip on an input's description, the virtual keyboard's labels — now come from message catalogs instead of being written into the code. Setting `uiLocale="es"` (or `data-doenet-ui-locale="es"` on a standalone container) renders all of it in Spanish, with no other configuration. An activity that declares `<document lang="es">` gets the Spanish interface automatically, since the interface follows the content's language unless a host says otherwise.

    Counts are pluralized by the rules of the language being rendered rather than by English's, so Spanish says "queda 1 intento" and "quedan 2 intentos" where English says "1 attempt remaining" and "2 attempts remaining".

    Hosts can supply their own catalogs through `localeResources` to add a language or correct a translation DoenetML ships.

    With no locale configured the interface is unchanged, apart from the startup message, which now reads "Initializing..." rather than "Initializing....".

- 9ccf23a: Translate style descriptions, and ship the Spanish vocabulary.

    "thick dashed blue line", "filled blue circle with a thick red border", "green square", "black with a yellow background" — the words `styleDescription`, `styleDescriptionWithNoun`, `borderStyleDescription`, `fillStyleDescription`, `textStyleDescription`, `textColor`, and `backgroundColor` report now come from message catalogs. An activity set to Spanish, by `documentLocale="es"` or by declaring `<document lang="es">`, describes its graphics in Spanish with nothing else configured.

    These are the words authors interpolate into their prose with `$line.styleDescription`, and the words a screen reader announces for a graph, so they follow the language the activity was _written_ in rather than the reader's interface language.

    Word order and agreement belong to the language, not to the code that assembles the sentence. Spanish puts adjectives after the noun and inflects them to match its gender, so it says "línea discontinua gruesa roja" where English says "thick dashed red line", and "círculo azul relleno con un borde grueso rojo" where English says "filled blue circle with a thick red border" — including agreeing the border's adjectives with the word for border rather than with the shape around it.

    A word an author writes themselves — `lineColorWord="chartreuse"`, `markerStyleWord`, or a CSS color asked for by name like `rebeccapurple` — is left exactly as written.

    A shape that names itself after another, such as a triangle or a rectangle, is now described with its own noun rather than by rewriting the finished English sentence, so `$triangle.styleDescriptionWithNoun` reads correctly in every language.

    Hosts can supply their own catalogs through `localeResources` to describe graphics in a further language, or to correct a translation DoenetML ships — the same way they already could for the interface.

    With no locale configured, every description reads exactly as it did before, with one exception: a `<regularPolygon>` reports its side count through the locale's own number formatting, so a thousand-sided one now reads "1,000-sided regular polygon" rather than "1000-sided regular polygon". Every side count anyone writes in practice is unaffected.

- 0ccc589: Give warnings and errors stable codes, and translate the first of them.

    Every diagnostic that has moved into the message catalogs now carries a permanent code — `doenet-w0001`, `doenet-i0001` — alongside its message. A code names one situation forever, whatever language the message is shown in and however the wording is later revised, so it is something to cite in a bug report or filter on. It reaches an embedding page on the diagnostic record, and the editor's language server publishes it in the standard LSP `code` field; nothing displays it on screen yet, which arrives with the documentation pages the codes will link to.

    Because a diagnostic now carries its code and the values that fill its message in, rather than a finished sentence, it can be shown in the reader's language. Diagnostics follow `uiLocale`, not `documentLocale`: they are addressed to whoever is looking at the screen, so a Spanish-speaking student working a French activity reads the activity in French and its warnings in Spanish. Setting `uiLocale="es"` now reports `<line>`, `<lineSegment>`, `<ray>` and `<vector>` diagnostics in Spanish with nothing else configured.

    Lists inside a message are assembled by whichever language ends up rendering it, rather than pieced together as English and handed over as a finished string. So the verb agrees with the list beside it — "slope is ignored" for one attribute against "slope and length are ignored" for two — and a message that has no translation yet keeps both its sentence and its list in English instead of mixing the two.

    Also fixed: a host that files its `localeResources` under a locale tag `Intl` cannot parse — `en_US`, the POSIX spelling, rather than `en-US` — no longer renders that catalog's messages that count things as `{???}`. That covers the chrome's "attempts remaining" and submitted-response counts as well as the new diagnostics: the host's own wording is used, with English counting and number conventions.

    The remaining messages still report in English and are unaffected. With no locale configured, every diagnostic reads exactly as it did.

- ab82a9d: Translate the last of the worker's author-facing diagnostics: circular
  dependencies in a copy or composite, references that resolve to nothing or to
  several things, children that do not match what a component accepts, an
  attribute value that falls back to its default, and the embed's
  DoenetML-version failure.

    Circular dependencies were reported by two components in two places with the
    same wording; they now share one code, so a host filtering on it catches both.

- 284ff85: Give the language server's schema checks stable diagnostic codes, so the squiggles the editor draws under an unrecognized element, a misplaced one, an unknown attribute, or a value outside its enumeration can be translated and cited.

    These were the last author-facing diagnostics composing their English at the point they were raised, with no name a bug report could quote or a host could filter on. Each now carries a code and the values that fill its message in, alongside the English it has always shown, and the same sentences are in the message catalogs for translators.

    The check for a name that does not start with a letter shares its code with the parser's identical check rather than taking a second name for one mistake, which also lets the editor collapse the two reports into one entry.

    Every message reads exactly as it did before.

- a23df7c: Viewer: show the right choice in an inline `<choiceInput>` that has a hidden choice.

    A hidden choice still occupies an index, but the inline input looked its selected
    choice up by position in the list of _visible_ options. Every choice after a
    hidden one therefore displayed its neighbor's text — or, for the last choice,
    fell back to the placeholder as though nothing were selected. Only the display
    was wrong; the recorded answer was always correct.

- 7725b8d: Viewer: announce inline `<choiceInput>` options by their text, not "[object Object]".

    The inline choice input passed each choice's rendered content to react-select as
    the option label. React-select stringifies that label for the announcements it
    writes to its aria-live region (and for typeahead filtering), so screen readers
    heard "[object Object], 1 of 3" instead of the choice text, and typing to filter
    the list matched nothing.

    Each option now carries its plain text alongside the rendered content: the text
    supplies the accessible name and the filter string, while the rendered content —
    which may contain math, images, or styled text — is still what is drawn in the
    menu and in the displayed value.

    With `selectMultiple`, the button that removes a selected choice was likewise
    named "Remove [object Object]"; it is now named after the choice text too, in
    the reader's language.

    Closes #1613.

- 11e7ba3: Write every number in Latin digits, whatever the locale counts in.

    CLDR gives a locale a default numbering system, and for a number of languages it is not Latin. A warning's contrast ratio, a count in a message, and `<intComma>`'s output all went through `Intl` under the document's or the reader's own tag, so under such a locale they came back written in that locale's own digits.

    What localizes is now the punctuation and never the ten characters: German still groups with periods, India still groups in twos, and `4.53` is `4.53` everywhere. Two things made this the answer rather than the reverse. A number in prose sits beside numbers that are not — a contrast ratio is written `4.53:1` with the `1` a literal in the message, a line number is read off a gutter the editor draws itself, an author's `styleNumber="3"` is quoted back at them — and localizing the digits split those across two scripts rather than moving them together. And mathematics is Latin-digit regardless, so a document whose prose counted one way and whose equations counted another would be worse than either alone.

    In the Arabic script the separator moves with the digits, because CLDR pairs one set with the other: Persian writes `٬` and `٫` around its own digits and `,` and `.` around these, so a Persian document now writes `1,000.50` where it wrote `۱٬۰۰۰٫۵۰`. Everywhere else the separator is untouched. A tag that asks for a numbering system itself (`zh-u-nu-hanidec`) is overridden too — one answer per product, not per tag.

    No currently shipped language moves: every catalog in the repository is one CLDR already counts in Latin digits, and each of the twenty renders byte-for-byte what it did. What changes is what the next languages will do — Bangla, Assamese, Marathi, Nepali and Burmese are all otherwise ready to seed, and this is what was standing in front of them.

- 07b1f24: Graphing: add new ways to define a `<lineSegment>` via `slope`, `length`, `midpoint`, and `midpointOffset` attributes, plus a public `midpoint` property giving its actual midpoint.

    A `<lineSegment>` can now be positioned without giving both endpoints explicitly:

    - `midpoint` (attribute) — a reference point on the segment, located at its midpoint by default.
    - `slope` and `length` — the segment's x-y direction and its signed defining length (a negative `length` flips the endpoints). The public `length` state variable still reports the Euclidean distance between the endpoints.
    - `midpointOffset` (clamped to `[-1, 1]`) — where the `midpoint` point sits along the segment: `-1` = first endpoint, `0` = midpoint, `1` = second endpoint.
    - `midpoint` (property) — a public state variable giving the segment's actual midpoint (the average of its endpoints), with `midpoint.x`/`midpoint.y` access and a translation inverse. It equals the `midpoint` attribute point when `midpointOffset` is `0` and differs from it when `midpointOffset` is nonzero.

    These combine so a segment can be defined by an endpoint plus `midpoint`, an endpoint plus `slope`/`length`, `midpoint` plus `slope`/`length`, or `slope`/`length` alone. When one endpoint and `midpoint` are given, the second endpoint is placed so the given point sits at the `midpointOffset` position of the segment — by default the midpoint, so `endpoints="(1,2)" midpoint="(2,3)"` yields endpoints `(1,2)` and `(3,4)`. Dragging a graph handle keeps the opposite endpoint fixed while the midpoint tracks its position, and dragging a referenced endpoint translates the segment (for the slope/length cases). When none of the new attributes are given, behavior is unchanged. The generated schema recognizes the new attributes in editor diagnostics.

    Closes #1376.

- 5427160: List items: fix a leading child that renders nothing breaking the layout of a `<part>` or `<task>`.

    A list item aligns its hanging number against its first visible child. Children that render nothing — `<setup>`, `<variantControl>`, `<animateFromSequence>`, `<solveEquations>` and the like — were still eligible to be chosen, so the child that actually rendered first kept its top margin and never reported the alignment it needs. A `<part>` starting with a `<setup>` followed by a `<graph>` (or image, video, tabular, spreadsheet, or block `<choiceInput>`) put its number at the bottom of that content instead of the top.

    Also, a section no longer hides its `<setup>` and `<variantControl>` along with its content. Hiding a `<setup>` hid everything defined inside it, which stripped hidden pieces out of the text of those definitions — so text defined in the `<setup>` of an unrevealed `<cascade>` step came back incomplete.

- 2e3bce0: Viewer: let screen readers read the list marker of an item that starts with a `<p>`.

    A `<p>` renders as `<div class="para">`, and any wrapper element between the
    `<li>` and its text stops a screen reader from folding the item's `::marker`
    into the item's own text. VoiceOver then landed on the marker as a separate
    object and announced "list marker" rather than "1. Apples, 1 of 3", so an
    ordered list whose items each held a `<p>` lost its numbering out loud. The
    paragraph that leads a list item is now presentational, which restores the
    accessibility tree a plain `<li>Apples</li>` produces.

    Paragraphs are also exposed as paragraphs now: a `<div>` carries no paragraph
    semantics on its own, so every `<p>` — outside a list, and every one in a list
    item beyond the leading one — gets an explicit `paragraph` role. Nothing about
    the visual layout changes.

    Closes #662.

- 046bcc0: Load Spanish on demand like every other translation, leaving English as the only language carried inside the JavaScript.

    Spanish was inlined back when it was the only translation there was. With more of them every release, a language earns its place in the bundle by being worth its weight to every consumer — including the ones who never read it — and no single language clears that bar. This takes about 116 KB off `@doenet/standalone`, which carried the Spanish catalogs in its bundle and again in its core worker, and moves them out of `@doenet/doenetml`'s entry chunk into code-split chunks of their own. It also makes the rule uniform: English terminates every fallback chain, everything else arrives on demand.

    Nothing needs configuring. `documentLocale="es"` and `<document lang="es">` work exactly as before — `@doenet/doenetml` code-splits the Spanish catalogs into their own chunks, and `@doenet/standalone` serves them from the `locales/` directory beside the bundle, the same way it already served every other language.

    What changes is when they arrive. A Spanish document now paints in English for as long as the catalog takes to load and then re-renders in Spanish, because a document's language is fixed for the lifetime of the core that renders it and is not known until the source has been parsed. That was already true of every other language; Spanish now behaves the same. A host that wants Spanish on the first frame can still pass the catalogs in as `localeResources`, which take precedence over anything shipped and are in hand before the first render.

- 95c16a9: Load message catalogs for languages that are not inlined into the bundle.

    Only English is carried inside the JavaScript. Every other language now arrives on demand: `@doenet/doenetml` code-splits each catalog into its own chunk, and `@doenet/standalone` — which is one file by construction, so it cannot code-split — serves them from a `locales/` directory beside the bundle. The viewer does the loading itself, so `documentLocale="de"` and `<document lang="de">` work with nothing configured, and a host's own `localeResources` still take precedence over anything shipped.

    Adding a language is now a directory under `packages/i18n/locales/`: no bundling decision to make, and no registry of languages to keep in step with it. At roughly 16 KB gzipped per translation, inlining every language would have put the cost of all of them on everyone who uses one, or none.

    `@doenet/standalone` therefore ships a new `locales/` directory, which should be served alongside `doenet-standalone.js`. Nothing breaks if it is not: those fetches fail quietly and the language falls back to English, which is what it does today.

- 95c16a9: Stop a language switch from discarding the reader's work, and give a nested `<document lang>` the catalog it needs.

    Two problems with loading catalogs on demand, both invisible while every language in use was inlined.

    Changing `uiLocale` rebuilt the core. The catalogs for the reader's chrome and for the document's content live in one map, and the core was rebuilt whenever anything in that map changed — so a reader switching language pulled down a chrome catalog the core never reads, and lost every answer they had typed. The rebuild is now gated on the catalogs the core actually renders from: the content's. Switching the reader's language re-translates the chrome in place, as it always did for a language that happened to be inlined. The gate reacts only to a catalog _arriving_, so an activity whose `<document lang>` disagrees with the host's `documentLocale` — or a host that changes `documentLocale` mid-session — builds its core once rather than twice.

    A nested `<document lang="es">` inside an activity written in another language never had its catalog requested, so its subtree rendered in English however long you waited. The languages a source declares are now read from the source itself, which is where an author wrote them — so the catalog is on its way before the core is built, rather than after the core has already computed that subtree's prose. `lang` takes a plain string and nothing else, so reading it this way finds every language the core could have rendered in. The exception is content that is not in the source yet: a _nested_ `<document lang>` inside DoenetML pulled in by an external reference still renders in English. An activity that is itself pulled in that way is unaffected — its language is read from the expanded source.

    A viewer given `render={false}` — a document a host has asked about but is not showing — started a second core worker every time it re-rendered, and abandoned the one before it. A catalog finishing loading is one of the things that re-renders such a viewer, so the waste was easy to reach once catalogs load on demand. It now primes one worker and reuses it.

    All three applied to every language that is not inlined, which today is every language but English.

- 394bc01: Give the physical-side attributes on inputs and tabulars a logical `start`/`end` vocabulary.

    `labelPosition` on `<textInput>`, `<mathInput>`, `<booleanInput>`, `<choiceInput>`, `<matrixInput>` and `<fractionInput>` now takes `start` and `end` instead of `left` and `right`. The label sits beside the input in DOM order, which mirrors with the writing direction, so under `dir="rtl"` the old names said the opposite of where the label went.

    The tabular border attributes — `left`, `right`, `top` and `bottom` on `<cell>`, `<row>` and `<tabular>`, inherited from PreTeXt — become `startBorder`, `endBorder`, `topBorder` and `bottomBorder`, and are drawn with logical CSS so they follow the writing direction rather than staying pinned to a physical edge. `halign` takes `start` and `end` alongside `center` and `justify`. All three components now declare these vocabularies, so autocomplete and the editor's help panel offer the allowed values, and `<row>` and `<cell>` read them without regard to case the way `<tabular>` always has.

    `resultsLocation` on `<codeEditor>` and the host-facing `viewerLocation` prop take `start`/`end` too. The editor and viewer panels are placed in DOM order and already mirrored with the writing direction, the way panes conventionally do in a right-to-left interface; only the names claimed otherwise. Hosts passing `left`/`right` to `viewerLocation` keep the layout they had.

    `<sideBySide>` panel margins are drawn with logical CSS as well. The two `margins` entries have always been read in the order the panels are laid out, and now the margins mirror with the panels under `dir="rtl"` instead of staying on fixed sides. The attribute keeps its name and values.

    Documents using the old names and values keep working: they are migrated with a deprecation warning naming the replacement. `labelPosition` on graph components such as `<point>` and `<line>` is unchanged — it places a label in coordinate space, which does not mirror.

- a4ba205: Editor: cut the bundled DoenetML language server roughly in half.

    The server reached `@doenet/utils` through its root barrel for a single
    function, dragging math-expressions, the AST helpers and the URL utilities into
    the bundle alongside it. Those math-input function-name helpers now have an
    entry point of their own, taking the built server from 2.3 MB to 1.1 MB
    minified (640 KB to 317 KB gzipped). The server ships inline inside the code
    editor, so every package that embeds the editor downloads and parses that much
    less before the first cursor-help request can be answered.

- 79f138f: Give the Marathi fill description the noun its colour agrees with. `describeFill` hands the colour the gender of the fill, and the pattern words have genders of their own, so a shape filled with horizontal lines described itself as `निळे आडव्या रेषा` — a neuter adjective in front of a feminine plural noun. It now names «भरण» and hangs the pattern off वापरून: `आडव्या रेषा वापरून निळे भरण`.
- 1d98f2e: `<matchesPattern>`: add a `parameters` attribute, so a pattern can require the same subexpression in more than one place.

    `parameters` names the variables in `pattern` that stand for a subexpression instead of themselves. A name repeated in the pattern has to match the same subexpression each time, which is what the blanks written `()` cannot say — each of those matches independently of the others. So `pattern="sin(a)^2+cos(a)^2" parameters="a"` accepts `sin(x)^2+cos(x)^2` and turns down `sin(x)^2+cos(y)^2`.

    `patternMatches` comes back in the order the parameters were named, and a parameter that does not occur in the pattern holds its place there as a blank and warns, so an author's `$m.patternMatches[2]` keeps meaning the second name they wrote. A name listed twice is one placeholder and takes one place in that list.

    Specifying `parameters` also makes `()` a literal blank rather than a placeholder — a pattern cannot ask for both kinds at once, and a pattern that wants a literal blank matched needs `matchExpressionWithBlanks` as before. `parameters` is a list of variable names, the same kind `<function variables>` and `<solveEquations variables>` take, so a plain symbol or a subscripted one is a parameter and anything else is ignored with a warning. A function name counts, which makes `pattern="f(x)+f(y)" parameters="f"` match `sin(x)+sin(y)` and not `sin(x)+cos(y)`.

    Leaving `parameters` off changes nothing.

    Closes #1315.

- e70ee64: Show angle brackets and norm bars in a math input whose `prefillLatex` writes them without `\left` and `\right`.

    `<mathInput prefillLatex="\langle 2, 3 \rangle" />` rendered an empty field. The vector reached the input's `value` correctly — only the field the reader looks at was blank, so the prefill was invisible. MathQuill recognized `\langle` as a delimiter but had no rule for what follows it, so it took only the one block an ordinary LaTeX command takes — just the `2` — and had nothing left to give `\rangle`. That failed the parse of the whole expression, and a math field whose LaTeX will not parse renders as empty. `\left\langle 2, 3 \right\rangle` worked, but that is not how the brackets are usually written.

    An opening delimiter written without `\left` now takes everything up to its matching partner, the way it behaves when typed: `\langle 2, 3 \rangle`, `\langle \rangle`, `\lVert x \rVert`, and nestings of them all render. One with no partner — `\langle 2, 3`, or `\langle` by itself — keeps all of its contents and shows the same half-open bracket typing one produces, rather than closing after the first term.

    The closing delimiter no longer takes a term of its own either, which fixes anything written after a matched pair: `\lVert v \rVert^2` drew the `\rVert` around the exponent, rendering ‖v‖‖²‖, and now renders the norm squared. A closing delimiter with nothing to close still leaves the field blank, and now does so wherever it sits — `2 \rangle 3` used to render 2⟨3⟩, wrapping whatever followed the stray delimiter in a pair of its own.

    Closes #1336.

- 9fdb73f: Let a nested `<document lang>` reach the rendered page.

    An inner `<document lang="es">` already resolved its language in the core and had its computed prose translated, but nothing in the DOM said so: the `lang` attribute was only ever written for the activity as a whole, so a screen reader read the Spanish subtree with an English voice.

    The inner document now carries its own `lang` — but only when its language differs from the one already in effect around it. A nested document that merely restates the surrounding language adds no attribute, since the DOM already says it.

- 163127a: Improve the hex/rgb-to-color-word algorithm used for style descriptions.

    `resolveColorWord` (used to name colors in core-computed style descriptions such
    as "thick red line") previously matched inputs against curated anchors using raw
    RGB Euclidean distance, which misnamed many author-supplied colors that were
    nowhere near an edge case — e.g. `#0072b2` (blue) became "cyan", `#c22047`
    (crimson) became "brown", and `#a99d96` (warm gray) became "yellow".

    Matching now happens in a perceptual space: near-neutral (low-chroma) colors are
    classified as black/gray/white by lightness before any hue matching, and the
    remaining colors are matched against the anchors using the CIEDE2000
    color-difference metric. A few gap-filling anchors (crimson, wine, mid/sky blue,
    mid cyan, muted purple) were added. Because color words feed the accessibility
    descriptions read by screen-reader and colorblind users, this makes those
    descriptions substantially more accurate for author-supplied colors.

    The built-in palettes previously pinned explicit `*Word` descriptors to work
    around the old matcher. With the improved matcher, 221 of those overrides are now
    redundant (the matcher derives the identical word) and have been removed; every
    palette's fully expanded style definitions still resolve to the identical color
    word for every key (the only difference is key ordering, irrelevant for a
    field-keyed object). The
    overrides that remain are those where the canonical twelve-word vocabulary is too
    coarse for the intended name (e.g. "olive", "teal", "gold", "indigo", "magenta")
    or where the matcher rounds a borderline hue to a neighbouring family.

- dd99082: Graph: draw the grid in the prefigure renderer.

    `grid` was silently ignored when a `<graph>` rendered with `renderer="prefigure"`. It now draws, using PreFigure's own `<grid>` element:

    - `grid` (or `grid="medium"`) lets PreFigure pick the spacing from the axis limits, so the grid follows the graph's bounds.
    - `grid="dense"` subdivides that spacing to add the finer lines.
    - `grid="dx dy"` places lines on multiples of `dx` and `dy`, as the Doenet renderer does.

    The grid is drawn behind the axes and the graph's contents, and takes a dimmer stroke in dark mode. A spacing so fine that it would fill the graph with thousands of lines is dropped with a warning.

- 817ae69: Added a `styleOverrides` prop to `<DoenetViewer>` and `<DoenetEditor>` that lets a host application pass reader (end-user) style overrides — per-styleNumber remappings of colors and other style settings, e.g. colors a color-blind reader can better distinguish. Overrides win over everything authored in the document (`<styleDefinition>` and `<stylePalette>` alike), update live when the prop changes, never produce author-facing diagnostics, and keep text style descriptions truthful by re-deriving color words (with dark-mode colors derived from the reader's light-mode colors when not supplied). A reader can also switch the whole document to one of the built-in style palettes by name (e.g. `grayscale` for readers who distinguish styles by lightness alone): the reader's palette replaces all authored styling, style numbers beyond its size wrap around onto it, and per-styleNumber overrides apply on top. The format is exported as the `ReaderStyleOverrides` type.
- f08da0c: Graphing: a `<rectangle>` that binds one of its sizes to the other, such as `<rectangle name="R" width="4" height="$R.width" />`, can now be dragged and resized.

    Previously, dragging such a rectangle could leave it pinned along one axis, and dragging a corner resized it in unpredictable ways rather than following the pointer. It now translates freely, and dragging a corner resizes it while keeping it square. This applies whether the rectangle is anchored on a center, on a specified vertex, or on neither.

    Rectangles without a self-referential size are unaffected.

- b685d7a: Editor: Fix missing property autocomplete and context help for references to a name that is reused across sibling scopes.

    Given two `<exercise>` sections that each contain a `<point name="P">`, `$P.styleDescription` resolved correctly at runtime, but typing `$P.` in the editor offered no property suggestions and the context-help panel said nothing about `styleDescription`. Both features now describe the point inside the same `<exercise>` as the reference, matching what the document renders.

    Both features share one resolver lookup, which used to begin its search above the enclosing `<exercise>`, where both points named `P` are in view; the ambiguous name left the editor with nothing to offer. The lookup now starts from inside the enclosing element, the same place a bare `$P` reference was already resolved from.

- d384b18: Lay documents out right-to-left when their language is written that way.

    DoenetML emitted no `dir` anywhere, and a browser will not infer one from `lang`. An Arabic document therefore rendered right-to-left text in a left-to-right box: punctuation landed on the wrong end, and a run mixing Arabic with a Latin identifier came out in the wrong visual order. The stylesheets were written in left and right throughout, so every indent, gutter and hanging list number pointed away from the text it belonged to.

    The viewer now labels the document with its direction beside its language, and the chrome around it with the reader's — two attributes rather than one, because a reader whose language runs the other way from the activity's is the case this exists for. A nested `<document lang>` carries its own. Where a piece of chrome drawn inside the document runs the opposite way to it, it re-declares itself; where the two agree, nothing is added.

    Mathematical notation does not mirror. Graphs, the math input and its keyboard, matrices, the spreadsheet, sliders, number lines, orbital diagrams and the source editor all stay left-to-right inside a right-to-left document. What does mirror is the prose: indents, list numbering, the paginator, feedback and hint headers, the editor toolbar.

    Translated chrome now isolates its interpolated values, which is what keeps a Latin identifier from scrambling the words around it. English is unchanged, byte for byte. Content computed in the worker is unchanged too — those strings become state variables an author can interpolate and an `<award>` can compare, where an invisible character would be a silent wrong answer.

    No right-to-left catalog ships yet: `<document lang="ar">` turns the page around and leaves the words in English. Arabic and the six other languages this unblocks — Persian, Hebrew, Urdu, Pashto, Sindhi and Uyghur — follow separately.

- 66127ee: Sections: fix children silently disappearing when a section contains a `<stylePalette>`, `<styleDefinition>`, or `<feedbackDefinition>`.

    Each of those configuration children shifted the section's rendered-child indices by one, so content at the end of the section was silently dropped — one child for each configuration child present.

- bbd7081: Write the word a sectional block calls itself in the document's language: section, example, problem, part, proof, solution, answer, hint, and the rest.

    The heading a section builds around that word moves with it. "Section 2: Limits" used to be assembled by concatenation — the word, a space, the number, then a colon or a period before the title — which is English order and English punctuation written into the code. It is now one message per shape, so a translation can order and punctuate each one on its own terms.

    The word is keyed by the element an author writes rather than by an internal class name, so `<subsection>` and `<subsubsection>` share the word for section, and a block whose name the author set with `renameTo` keeps their word in every language.

    An unnumbered block such as `<proof>`, asked to include its number, used to render the word "null" where the number would have gone. It now renders no number, which is what it has.

    A block whose `renameTo` is empty, or is nothing but blank space, likewise renders no name, rather than the space and colon that used to be written around the word that isn't there.

    Apart from those, a document that declares no language reads exactly as it did before.

- 2049662: Add a message catalog for Arabic, the first language DoenetML is translated into that is written right to left.

    It covers all four namespaces — the viewer chrome, the editor and language-server surfaces, the prose the core computes into a document, and the warnings and errors. `documentLocale="ar"` and `<document lang="ar">` work with nothing configured, and Arabic reaches `<document lang>`'s autocomplete under its own name. The page turns around with it: the words are Arabic and the layout runs the way they are read, while graphs, equations and math input stay left to right inside it.

    This is an **unreviewed machine-generated seed**, and every file says so in its header. Nothing falls back silently: a key the translation is missing renders in English.

    Arabic counts a phrase six ways where English counts it two, and is the first catalog to need a dual: a count of exactly two selects a form carrying no number at all, and none, three to ten, eleven to ninety-nine and everything above take four further forms of their own. Its adjectives follow the noun and agree with it in gender, so a styled line describes itself as `خط أحمر متقطع سميك`. Where English welds a preposition to an interpolated value, the Arabic message names what the value is instead, since a one-letter preposition cannot be attached to an argument.

    Element and anion names are included: Arabic has a settled chemical nomenclature, and it is the one a student meets in their own textbook.

- 342afad: Add message catalogs for Irish, Scottish Gaelic, Welsh, Breton, Icelandic, Faroese, Basque, Catalan, Galician and Maltese.

    Each covers all four namespaces — the viewer chrome, the editor and language-server surfaces, the prose the core computes into a document, and the warnings and errors. `documentLocale="cy"` and `<document lang="cy">` work with nothing configured, and all ten reach `<document lang>`'s autocomplete with their names in their own spelling.

    These are **unreviewed machine-generated seeds**, and every file says so in its header. Nothing falls back silently: a key a translation is missing renders in English, which is what makes seeding safe.

    Western Europe was the last of the map with holes in it, and the holes were not small ones: Catalan and Galician between them have more speakers than several languages already here. What the batch is really about, though, is the **Celtic four**. Irish, Scottish Gaelic, Welsh and Breton mark an adjective as heavily as any language in the repository and do it at the _front_ of the word rather than the end — a feminine noun softens whatever follows it, so «dearg» is «dhearg», «coch» is «goch», «du» is «zu». The trigger is the noun, and the noun's gender is already a token these messages carry, so all four select on `$gender` alone and not one of them writes a `$role` branch. Welsh goes a step further than the other three: some of its adjectives have a feminine form of their own before the mutation lands, so «gwyn» becomes «gwen» and only then «wen».

    The other six are the counterweights. **Icelandic** and **Faroese** are the batch's case languages, and they part company on one noun: both dative clauses land on `-um` in Icelandic because «jaðar» and «bakgrunnur» are masculine, while Faroese «bakgrund» is feminine and takes `-ari`, making it the one catalog here whose two dative branches differ. **Basque** has more cases than either and selects on neither argument, because a Basque case is a suffix on the last word of the whole noun phrase — it lands on «batekin», a word the catalog writes, never on a placeable. **Maltese** is the one Semitic language written in Latin letters, and its feminine is a change of vowels rather than an ending: «aħmar» → «ħamra». **Catalan** and **Galician** are the plain gender-agreeing case, with the adjectives after the noun.

    Also the largest spread of plural categories yet in one batch: Welsh has six, Irish, Breton and Maltese five, Scottish Gaelic four. Maltese's are not a scale — eleven to nineteen go back to a singular noun, so `many` there reads like `other` and not like `few`.

- 69b72c5: Add message catalogs for Bulgarian, Croatian, Serbian, Slovenian, Macedonian, Albanian, Lithuanian, Latvian, Estonian and Belarusian.

    Each covers all four namespaces — the viewer chrome, the editor and language-server surfaces, the prose the core computes into a document, and the warnings and errors. `documentLocale="hr"` and `<document lang="hr">` work with nothing configured, and all ten reach `<document lang>`'s autocomplete with their names in their own spelling.

    These are **unreviewed machine-generated seeds**, and every file says so in its header. Nothing falls back silently: a key a translation is missing renders in English, which is what makes seeding safe.

    Central and Eastern Europe and the Balkans were the largest remaining gap on the map, and what makes the batch interesting is that it pulls `$gender` and `$role` apart. Every inflecting catalog before this one needed both at once, so nothing had yet shown that they are independent. Here **Estonian** has fourteen cases and no gender whatsoever — it forks on `$role` alone, and its `noun-gender` answers a single constant the way English's does — while **Bulgarian** and **Macedonian** have three genders and no cases at all, so they fork on `$gender` alone and consult `$role` nowhere. Neither catalog needed a change outside itself, which is the argument working as designed.

    The remaining seven use both. Croatian, Serbian, Slovenian and Belarusian each pick their own nouns for the two clause heads and so land on four different arrangements: Croatian's border is masculine `rub` and Serbian's feminine `ивица`, so the same instrumental is `-im` in one and `-ом` in the other; Slovenian's text and background are _both_ neuter where Croatian's and Serbian's split across two genders. Lithuanian's four heads are all masculine and its clauses need no gender fork; Latvian splits them across two genders and needs a different case in each, and marks its background with a genitive after `uz` that happens to be spelled like the nominative feminine — a branch written out anyway so a correction to one does not silently move the other.

    **Albanian** is the odd one and the batch's counterpart to Yoruba and Igbo: it puts its describing words after the noun, so `style-with-noun` and `style-filled-with-noun` reorder rather than substituting into the English frame. Its agreement is carried by a proclitic article — `i`, `e`, `të` — rather than by an ending, and half its colour vocabulary is unarticulated loans (`blu`, `gri`, `kafe`, `rozë`) that select on nothing at all. Which words fork is a fact about the word, not about the position.

    Slovenian is the first European catalog to need CLDR's `two` — only Arabic and Hebrew needed it before — because it has a living dual, so two attempts are `2 poskusa` and neither the singular nor any plural will serve. **Latvian** needs `zero`, which only Arabic needed before and which does not mean "none" — it covers every number ending in 0 and the whole of the teens. Both still spell out `[0]` by number, because the English wording changes for zero as well as the noun and a category cannot say that. Slovenian and Belarusian carry four categories; Latvian, Croatian, Serbian and Lithuanian three; and Bulgarian, Macedonian, Albanian and Estonian the two English has.

    All ten supply the 118 element names and 12 anion names, so the count of deliberately partial catalogs stays at twenty-one: every one of these school systems teaches chemistry in its own language with settled nomenclature.

    Serbian is catalogued as `sr` in Cyrillic, which is what CLDR fills a bare `sr` in as; a reader arriving under `sr-Latn` reaches it and gets Cyrillic, the same asymmetry `pa-Arab` already has. No locale in this batch needs an entry in `LANGUAGE_ALIASES` — `sh`, the retired Serbo-Croatian code, is canonicalized to `sr-Latn` by `Intl.getCanonicalLocales` on its own and lands there too.

- 046bcc0: Add message catalogs for eight more languages: French, German, Italian, Dutch, Russian, Somali, Chinese, and Hmong Njua.

    Each covers all four namespaces — the viewer chrome, the editor and language-server surfaces, the prose the core computes into a document, and the ~214 warnings and errors. `documentLocale="de"` and `<document lang="de">` now work with nothing configured, and all eight appear in `<document lang>`'s autocomplete with their names in their own script.

    These are **unreviewed machine-generated seeds**, and every file says so in its header. So is Spanish, which shipped first and was never anything else; its four catalogs now carry the same header. English is the source of truth and the only language anyone has read. They are a starting point for the community translation platform (#1521), not finished translations: expect wording to be corrected. Nothing falls back silently — a key a translation is missing renders in English, which is what makes seeding safe.

    The style descriptions are not word-for-word translations, because they cannot be. Each language declares the grammatical gender of every noun it describes and inflects its adjectives to agree: German and Russian across three genders, Dutch across _de_- and _het_-words, French and Italian across two, and Chinese, Somali and Hmong Njua across none. German and Russian also carry the case their border clause governs, so "with a thick border" comes out "mit einem dicken Rand" and "с толстой границей" rather than agreeing with the wrong thing.

    Somali and Hmong Njua deliberately leave the 118 element names and 12 anion names untranslated rather than invent a chemical nomenclature; those render in English until a chemist who writes the language supplies them.

- cc43fde: Add message catalogs for Bosnian, Yiddish, Northern Sami, Luxembourgish, Western Frisian, Low German, Romansh, Occitan, Asturian, Sardinian, Sicilian and Corsican.

    Each covers all four namespaces — the viewer chrome, the editor and language-server surfaces, the prose the core computes into a document, and the warnings and errors. `documentLocale="oc"` and `<document lang="bs">` work with nothing configured, and all twelve reach `<document lang>`'s autocomplete, eleven of them labelled with their endonym beside the English name.

    These are **unreviewed machine-generated seeds**, and every file says so in its header. Nothing falls back silently: a key a translation is missing renders in English, which is what makes seeding safe.

    This is the roster's first batch of **European regional and minority languages**, and it is the largest gap left in a roster that already had every European national language. What it is not is one linguistic story: the twelve share a continent and almost nothing else, and the catalogs differ from each other more than any of them differs from `de` or `es`.

    **Two answer `$role`, and only two.** `bs` forks on it the way `locales/hr` does — and the fork lands on a different word, because `locales/hr` calls a border «rub», which is masculine and takes the instrumental `-im`, while `locales/bs` calls it «ivica», which is feminine and takes `-om`. `yi` forks on it too, taking a dative after «מיט» and «אויף»; it is the only right-to-left catalog in the roster that does. Everything else in the batch marks a clause position on a preposition rather than on the adjective, so a fork would write one string twice.

    **Yiddish is the roster's eighth right-to-left catalog, and it needed no code.** `direction.ts` already lists `yi` and the retired `ji`, and `Intl.Locale` canonicalizes `ji` on its own, so nothing was added to `LANGUAGE_ALIASES` either. It is also the odd one out among the eight: its adjectives _precede_ the noun and it has three genders, so its composition messages read like `locales/de`'s rather than like `locales/ar`'s. Its digraphs are written as two letters each — «וו», «וי», «יי» — rather than as the precomposed ligatures U+05F0–U+05F2, which render identically and compare unequal; that is how CLDR spells the endonym the roster labels it with.

    **Northern Sami is the batch's dual.** CLDR gives it `one`, `two` and `other`, so its counted messages have three branches where English has two — and the noun does not do what English does across them either, standing in the nominative singular after «okta» and the genitive singular after «guokte» and every higher numeral, so that the dual and the plural share a form that neither shares with the singular. Wherever anything else in the branch still differs, both are written out anyway, because a later correction to one of them is unlikely to be a correction to both. Its adjectives are the opposite case from Yiddish's: the attributive form agrees with _nothing_ — not case, not number, and there is no gender — so «asse čáhppes» is the phrase in every position, and `styleDescriptions.test.ts` pins that as an identity rather than as a difference, which is what would catch someone adding a `$role` fork the language has no use for.

    **Luxembourgish met the affix rule in a shape the README had not seen.** A masculine attributive is underlyingly `-en`, but the _Eifeler Regel_ drops the `n` before most consonants and at the end of a phrase — and whether it survives is decided by the _following_ word, which in `style-stroke` is `{ $color }` or nothing at all. That is "an affix cannot be welded to a placeable" met as a sandhi rule rather than as a case ending or an article, and the catalog writes the dropped form, which is right before every noun in its own table and right phrase-finally. It and `nds` are also the two that fold a regular polygon's side count into a compound — «regelméissegt 5-Eck», «regelmatig 5-Eck» — whose head is `-Eck` rather than their word «Polygon», so `noun-gender` answers neuter for `regular-polygon` and the adjectives wrapped around the phrase agree with the compound.

    **The six Romance catalogs are where the `$part` split finally earns its keep.** `oc`, `ast`, `sc`, `scn`, `co` and `rm` all put their adjectives after the noun, and all six split `noun-regular-polygon` the way `locales/es` does — head «poligòn regular», tail «de 5 costats» — so `style-with-noun`'s `[noun-tail]` branch is now exercised by six catalogs rather than by the one the argument was designed for. The tail lands directly in front of the fill pattern's own preposition, so each of the six chose one that cannot be read as continuing it: Occitan counts a shape's sides with «amb» in isolation and the catalog still says «de N costats», because «amb 5 costats amb punts» would read as a single clause listing two things. `styleDescriptionLocale.test.ts` runs Occitan through the whole worker path for it.

    **Plurals.** Bosnian keeps `few`; Sicilian's third category is `many`, which selects only for a large round number in compact notation and so is unreachable from these messages, and its header says so rather than leaving a reader to wonder. Where a language does not make a distinction English makes — Low German's «warrt övergahn» for one attribute and for several, Northern Sami's «vástádusa» after every numeral, Frisian's count of tries — the select is dropped rather than written out twice identically, and a comment says which.

    **Scripts and tags.** `bs` is Latin, so a reader arriving under `bs-Cyrl` reaches it and gets Latin; `nds` is the German-based Northern Low Saxon orthography, so `nds-NL` reaches it and gets that. Both are the asymmetry `pa` and `sr` already have, and the answer to each is a second catalog beside the first rather than a rename of it. `negotiate.test.ts` holds all of this — plus `ji` → `yi` and `sme` → `se` — against the real roster.

    **Two written standards over a spread of varieties**, and both catalogs say which they are: `sc` is the Limba Sarda Comuna and `rm` is Rumantsch Grischun. A deployment that wants Campidanese or Vallader supplies its own catalog as `localeResources`; correcting the shipped file toward one sentence by sentence is what would leave it in two standards at once, which is the trade `locales/jv` and `locales/su` already make with speech level.

    **Corsican is the one of the twelve whose endonym comes back as its English name.** `supportedLocales.ts` asks `Intl.DisplayNames` for a language's name in itself, CLDR has no Corsican-language data to answer with, and the fallback is English — so the label drops its parenthesis and reads "Corsican" once rather than "Corsican (Corsican)". It is not the first to do that: `ak`, `ceb`, `fil`, `hnj`, `mg`, `mi`, `ny` and `sm` already read that way. Nothing here hand-writes around it — the same rule that makes `ny` read "Nyanja".

    **Chemistry.** Bosnian supplies the 118 element names and the 12 anion names; the other eleven leave them to fall back to English. Bosnian is the Swahili case — its schools teach chemistry in it out of textbooks that print the whole table — and its list is close to `locales/hr`'s without being a copy: «kalaj» against Croatian's «kositar», «hlor» against «klor», «hemijski» rather than «kemijski». Of the eleven, nine are the school-system case in six different school systems (French for Occitan and Corsican, Spanish for Asturian, Italian for Sardinian and Sicilian, Dutch for Frisian, German for Low German and Luxembourgish, and German again for Romansh's upper grades). Northern Sami is the one where the schooling _is_ in the language and the table still does not settle: a pupil meets the Norwegian, Swedish or Finnish names depending on which side of a border the school is, and those three differ. Yiddish has the vocabulary in its scientific writing and no school system teaching secondary chemistry in it.

- b9112d1: Add message catalogs for Bangla, Assamese, Marathi, Nepali and Burmese.

    Each covers all four namespaces — the viewer chrome, the editor and language-server surfaces, the prose the core computes into a document, and the warnings and errors. `documentLocale="bn"` and `<document lang="bn">` work with nothing configured, and all five reach `<document lang>`'s autocomplete with their names in their own script.

    These are **unreviewed machine-generated seeds**, and every file says so in its header. Nothing falls back silently: a key a translation is missing renders in English, which is what makes seeding safe.

    All five count in their own digits by CLDR's reckoning, and none of them writes numbers that way here — that is the digit policy that had to land first, and it is why this batch could be seeded at all.

    Marathi is the fullest test yet of the agreement machinery: three genders where Hindi has two, and an oblique adjective before a postposition, so a border reads `जाड काळी` standing alone and `जाड काळ्या किनारीसह` inside the clause. Nepali, written in the same script, forks neither way — its adjectives mark gender only for animate nouns and never go oblique. Bangla, Assamese and Burmese inflect none of this, and put their postpositions behind the noun where English puts them in front.

    Assamese, Nepali and Burmese leave the 118 element names and 12 anion names untranslated, joining Somali, Hmong Njua and Amharic: there is no settled chemical nomenclature in any of the three to seed from, and the English fallback is what a student meets in a textbook. Bangla and Marathi do have one and supply it — so Bangla and Assamese part company here despite sharing a script, which is exactly why they are two catalogs.

- fd3ee74: Add message catalogs for Japanese, Korean, Vietnamese and Indonesian.

    Each covers all four namespaces — the viewer chrome, the editor and language-server surfaces, the prose the core computes into a document, and the warnings and errors. `documentLocale="ja"` and `<document lang="ja">` work with nothing configured, and all four reach `<document lang>`'s autocomplete with their names in their own script.

    These are **unreviewed machine-generated seeds**, and every file says so in its header. Nothing falls back silently: a key a translation is missing renders in English, which is what makes seeding safe.

    All four have a single plural category and no adjective agreement, so the style descriptions needed word order rather than inflection. Japanese and Korean put modifiers before the noun; Vietnamese and Indonesian put them after, as Spanish does. Japanese spells every style word as a noun and joins them with の, because an i-adjective would be ungrammatical in the one branch that has no noun to modify.

    Vietnamese deliberately leaves the 118 element names and 12 anion names untranslated. Its school chemistry has moved from the transliterated names to the IUPAC forms, which are the English words already shipped, so the fallback is what the current curriculum uses; the older names can be added as keys by anyone who wants them.

- c06508d: Add message catalogs for Haitian Creole, Quechua, Guarani, Aymara, Nahuatl, Kʼicheʼ, Mapudungun and Ojibwe.

    Each covers all four namespaces — the viewer chrome, the editor and language-server surfaces, the prose the core computes into a document, and the warnings and errors. `documentLocale="qu"` and `<document lang="ht">` work with nothing configured, and all eight reach `<document lang>`'s autocomplete.

    These are the roster's first languages indigenous to the Americas, and they close the one whole continent a 124-locale roster had nothing from.

    These are **unreviewed machine-generated seeds**, and every file says so in its header. Nothing falls back silently: a key a translation is missing renders in English, which is what makes seeding safe.

    Fix a fallback bug they uncovered: `qu`, `ay`, `gn` and `oj` are ISO 639-3 macrolanguages and `nah` an ISO 639-3 collection, and CLDR's likely-subtags folds exactly one member of a macrolanguage to it and leaves the rest unresolvable. A reader arriving under `quh` (Bolivian Quechua), `ciw` (Chippewa), `ojb` (Northwestern Ojibwa) or `gui` (Bolivian Guarani) was served English even where a catalog for their macrolanguage existed. Negotiation now folds every member code onto the wider code its catalog is named for.

- 05bf701: Add message catalogs for Wolof, Bambara, Akan, Ewe, Lingala, Shona, Southern Sotho, Setswana, Tigrinya and Ganda.

    Each covers all four namespaces — the viewer chrome, the editor and language-server surfaces, the prose the core computes into a document, and the warnings and errors. `documentLocale="sn"` and `<document lang="lg">` work with nothing configured, and all ten reach `<document lang>`'s autocomplete, eight of them labelled with their endonym beside the English name.

    All ten also carry `deprecated-attribute-to-child`, the diagnostic added alongside them, so no locale in the batch lands already one key behind.

    These are **unreviewed machine-generated seeds**, and every file says so in its header. Nothing falls back silently: a key a translation is missing renders in English, which is what makes seeding safe.

    This is the second sub-Saharan batch, and it goes back for the two largest things the first one left out: **Bantu south of the equator**, which the first reached only through Swahili, Zulu, Xhosa, Kinyarwanda and Nyanja, and **francophone West and Central Africa**, which it did not reach at all.

    Five of the ten agree an adjective with its noun's **class**, and they use the `$gender` argument as a class token exactly the way `locales/sw` does — the whole reason that argument was named for a position rather than for a case. What is worth reading is how differently five languages do the same thing:

    - **Shona** does not bolt a prefix onto an unchanged stem. In class 5 the stem's own first consonant changes with the prefix, so «-tema» is «dema», «-chena» is «jena» and «-kobvu» is «gobvu». The table cannot be derived from the stems and is written out in the header.
    - **Luganda** carries six classes, the widest table here, because its own geometry words land where the others' do not: «olunyiriri», a line, is class 11, and «akasaale», a ray, and «akatonnyeze», a point, are class 12 — the diminutive, which is where a small thing goes whether or not it is small on purpose.
    - **Southern Sotho** and **Setswana** additionally need a qualificative _particle_ — «mola _o_ motenya» — and both leave it out on purpose, because the same string is what `backgroundColor` reports standing alone, where a bare particle would be a fragment. That is the trade `locales/sw` already makes with its associative.
    - **Lingala** is the case where the device barely reaches. Its inventory of true adjectives is small and no colour word is in it — most of them are invariable French loans, and the three native ones are cited in one shape — so the concord touches two adjective stems and one participle and no more. Recording that is the point: a smaller table here is a fact about Lingala, not an unfinished one.

    **Tigrinya** is the one that uses `$gender` for a gender. It is Semitic, the agreement is internal rather than suffixed — «ጸሊም» → «ጸላም», «ረጒድ» → «ረጓድ» — and it is also the only language in the batch whose adjectives _precede_ the noun, so its composition messages keep the English order while the other nine invert it. Its Ge'ez runs left to right, so `direction.ts` needs nothing.

    The four West African languages are the batch's counterweight, and they answer one question four ways: **what does a description do when the language inflects nothing?** **Wolof** has noun classes and still ignores `$gender`, because the class in Wolof rides on the determiner and the relative marker and never on the adjective. **Bambara** marks an adjective with the qualifier suffix `-man` rather than agreement. **Akan** and **Ewe** mark nothing at all on the adjective and put it after the noun.

    Plurals split the batch too. CLDR gives Wolof and Bambara one category each, and Akan and Ewe have two that no counted message here can use — an Ewe noun takes no plural after a numeral, and the two nouns Akan counts carry their plural prefix in the singular already — so all four drop their selects rather than write a `[one]` that repeats its `[other]`. The five Bantu languages keep theirs and change the noun inside them, except that in Shona and Luganda it is decided per message by the class of the noun being counted: Shona's «edzo» is class 5 and takes «ma-», while «mhinduro» is class 9 and its plural is spelled the same; Luganda's «akabonero» becomes «obubonero», while «okumenya» is a class 15 verbal noun with no plural at all and «amagezi» is class 6 and already plural. So in both, some counted messages keep their selects and the rest drop them.

    **Akan needs an alias, and Fante deliberately does not get one.** `ak` is the macrolanguage and the catalog is Asante Twi. `tw` is the retired code for Twi and the tag an author is as likely to type, and `Intl.getCanonicalLocales` leaves it alone rather than rewriting it the way it rewrites `iw` and `in` — so `negotiate.ts` maps `tw` to `ak`, the second entry `LANGUAGE_ALIASES` has ever needed. Fante is left out for the reason Nynorsk is: it is a written standard of its own, and answering `fat` with an Asante Twi catalog would be a substitution rather than a canonicalization. `negotiate.test.ts` holds both halves against the real roster.

    **Chemistry.** All ten leave the 118 element names and the 12 anion names to fall back to English, and unlike the batches before them they split no ways at all: every one is the school-system case. Secondary science is taught in English across Ghana, Zimbabwe, Botswana, Lesotho, Uganda, Eritrea and Tigray, and in French across Senegal, Mali and both Congos, so in all ten the fallback _is_ the curriculum. That is a fact about ten education ministries rather than about ten languages.

    **Naming.** `lg` appears in the roster as **Ganda**, `st` as **Southern Sotho** and `tn` as **Tswana**, because `Intl.DisplayNames` renders them that way and `supportedLocales.ts` is derived rather than hand-written — the same split `ny` already has between Nyanja and Chichewa. All three catalogs' headers say so.

    Setswana and Southern Sotho are close enough to raise the question of why they are two files: they are two standard languages with two orthographies and two vocabularies, and `locales/tn` writes «kgotsa», «boammaaruri» and «-hibidu» where `locales/st` writes «kapa», «nnete» and «-fubedu». That is the same reason `hr` is a directory of its own rather than a script of `sr`.

- 2049662: Add message catalogs for Persian, Hebrew, Urdu, Pashto, Sindhi and Uyghur, which with Arabic completes the set of right-to-left languages DoenetML is translated into.

    Each covers all four namespaces — the viewer chrome, the editor and language-server surfaces, the prose the core computes into a document, and the warnings and errors. `documentLocale="he"` and `<document lang="he">` work with nothing configured, and all six reach `<document lang>`'s autocomplete with their names in their own script.

    These are **unreviewed machine-generated seeds**, and every file says so in its header. Nothing falls back silently: a key a translation is missing renders in English.

    Direction turns out to be the only thing these six have in common. Hebrew counts in three plural categories and agrees its adjectives with the noun they follow; Persian agrees nothing with anything and has no gender at all; Urdu, Pashto and Sindhi put their adjectives in front of the noun and inflect them again in front of a postposition — Urdu and Sindhi in both genders, Pashto only in the feminine — so Urdu's catalog is closer to Hindi's than to Arabic's; Uyghur is Turkic and marks its cases with suffixes, which is a different reason for the same restructuring Arabic needed — an affix cannot be attached to an interpolated value, so the message names what the value is or reaches for a word that can stand beside it.

    Pashto, Sindhi and Uyghur leave the 118 element names and 12 anion names untranslated, joining Somali, Hmong Njua, Amharic, Assamese, Nepali and Burmese: there is no settled chemical nomenclature in any of the three to seed from, and the English fallback is what a student meets in a textbook. Persian, Hebrew and Urdu do have one and supply it — so the line runs through the Arabic script rather than around it.

- 79f138f: Add message catalogs for Tamil, Telugu, Kannada, Malayalam, Gujarati, Punjabi, Odia, Thai, Malay and Filipino.

    Each covers all four namespaces — the viewer chrome, the editor and language-server surfaces, the prose the core computes into a document, and the warnings and errors. `documentLocale="ta"` and `<document lang="ta">` work with nothing configured, and all ten reach `<document lang>`'s autocomplete with their names in their own script.

    These are **unreviewed machine-generated seeds**, and every file says so in its header. Nothing falls back silently: a key a translation is missing renders in English, which is what makes seeding safe.

    This batch covers the major languages of Indian schooling and adds the three of mainland and maritime Southeast Asia that a Doenet activity is likeliest to be read in. Eight of the ten have a script of digits recorded for them in CLDR — Tamil, Telugu, Kannada, Malayalam, Gujarati, Punjabi, Odia and Thai — and none of them writes a number that way here, which is the digit policy that had to land first.

    Gujarati and Punjabi are the ones that exercise the agreement machinery. Gujarati has three genders, so a border reads `જાડી કાળી` — feminine, agreeing with `કિનારી` rather than with the shape the border surrounds — and a filled circle is `ભરેલું વાદળી વર્તુળ`, neuter, in the same sentence. It agrees on gender alone: it has an oblique, but every clause position its adjectives reach lands on a feminine noun or on none at all, so no position spells the word differently. Punjabi falls the opposite way round from Hindi: its feminine `ਕਿਨਾਰੀ` spells the border alike in both positions while its masculine `ਪਿਛੋਕੜ` sends the background colour oblique, so `ਪੀਲਾ` standing alone becomes `ਪੀਲੇ ਪਿਛੋਕੜ ਉੱਤੇ` inside the sentence — one clause position out of the four, which is the whole of Punjabi's `$role` fork. Both name the fill so that its colour has a noun of the right gender to agree with: a dotted blue circle reports its fill as `ટપકાં વાળી વાદળી ભરણી`. The other eight inflect none of this; Thai, Malay and Filipino put their adjectives after the noun, and the rest keep the English order and postpose the adposition instead. Tamil and Telugu mark a fill pattern with a free participle rather than a bound postposition, because joining one to a word the catalog never sees would have to reshape that word's ending.

    Filipino is where a plural category is least like a count. CLDR splits `fil` by the linker a numeral takes — `one` is every number whose Tagalog word ends in a vowel and takes `-ng`, and `other` is 4, 6, 9 and anything ending in them, which take the separate `na` — so `one` catches five and `other` catches four. Every message that stands a count in front of a noun selects on it for that linker. Filipino marks number itself with the free word `mga` instead, and a message that wants a singular selects `[1]` by number.

    The seven catalogs of India call a `<label>` a label rather than a name, following the four already here that do: `name` is a DoenetML attribute these same messages talk about, and "must have a short description or a name" sends an author to the wrong one.

    Filipino is catalogued as `fil`, and `tl` reaches it without an alias because `Intl.Locale` canonicalizes the deprecated code before negotiation sees it — `negotiate.test.ts` now holds that against the real roster. Punjabi is `pa` in Gurmukhi, following the rule that a directory is named for a script only where two scripts of one language are translated separately.

    Kannada, Punjabi and Filipino leave the 118 element names and 12 anion names untranslated, joining Somali, Hmong Njua, Amharic, Assamese, Nepali, Burmese, Pashto, Sindhi, Uyghur and Vietnamese. Kannada has two nomenclatures a textbook may draw on in one chapter and picking either would misreport the other; Punjabi's secondary chemistry moves to English terminology; and Philippine science is taught in English from the intermediate grades, so there the English fallback is already the curriculum. Tamil, Telugu, Malayalam, Gujarati, Odia, Thai and Malay do have a settled set and supply it — so Tamil and Kannada part company here despite neighbouring school systems, which is exactly why they are two catalogs.

- e8278da: Add message catalogs for Khmer, Lao, Sinhala, Javanese, Sundanese, Cebuano, Malagasy, Māori, Samoan and Hawaiian.

    Each covers all four namespaces — the viewer chrome, the editor and language-server surfaces, the prose the core computes into a document, and the warnings and errors. `documentLocale="km"` and `<document lang="haw">` work with nothing configured, and all ten reach `<document lang>`'s autocomplete, named there the way CLDR names them.

    These are **unreviewed machine-generated seeds**, and every file says so in its header. Nothing falls back silently: a key a translation is missing renders in English, which is what makes seeding safe.

    The batch closes the last large gaps in Asia and opens the Pacific. **Khmer** and **Lao** are isolating languages that inflect nothing at all and write no space inside a phrase, so their descriptions close up flush around every placeable; **Sinhala** marks case with a postposition that never touches the adjective in front of it, which is why it takes no `$role` branch for a reason English does not have. **Javanese** and **Sundanese** each had to choose a speech level, since a catalog cannot leave that open, and both are written at their unmarked everyday level throughout — ngoko for Javanese, loma for Sundanese — with the choice recorded in every file header. **Cebuano** turns on its linker «nga», which joins a noun to each of its adjectives, and on the fact that CLDR's plural rule for it (inherited from Filipino's, which splits on a numeral's linker) does not apply, because a Cebuano numeral takes the invariable «ka». **Malagasy**, **Māori**, **Samoan** and **Hawaiian** all put the adjective after the noun and mark number on the article rather than on the noun, so none of them selects on a count.

    Only Javanese and Sundanese supply the 118 element names, taking the Indonesian scientific vocabulary their schools teach chemistry in while keeping their own words for the substances known long before the elements were — «wesi», «beusi», «walirang», «warangan». The other eight leave those 130 keys to fall back to English, each catalog stating its own reason.

- b06cabb: Add message catalogs for Swahili, Zulu, Xhosa, Kinyarwanda, Chichewa, Hausa, Yoruba, Igbo, Oromo and Afrikaans.

    Each covers all four namespaces — the viewer chrome, the editor and language-server surfaces, the prose the core computes into a document, and the warnings and errors. `documentLocale="sw"` and `<document lang="sw">` work with nothing configured, and all ten reach `<document lang>`'s autocomplete with their names in their own spelling.

    These are **unreviewed machine-generated seeds**, and every file says so in its header. Nothing falls back silently: a key a translation is missing renders in English, which is what makes seeding safe.

    Sub-Saharan Africa was the largest region with no catalog at all, and five of these ten are Bantu — which is what makes the batch interesting rather than routine. A Bantu adjective agrees with its noun's **class**, not with a gender, and `$gender` turned out to carry that unchanged: `noun-gender` answers `c3`, `c5`, `c6`, `c7` or `c9`, and every describing word selects on it. Nothing outside the catalogs had to learn what a noun class is. Swahili gives each of the four classes a shape lands in its own pair of forms off the same two stems — `mstari mnene mwekundu`, `duara nene jekundu`, `kipande cha mstari kinene chekundu`, `pembenyingi nene nyekundu` — and Zulu and Xhosa need two concord tables rather than one, because whether a word takes the adjective concord or the relative concord is a fact about the word: `omkhulu` and `obomvu` describe the same class-3 line with different prefixes.

    Hausa is the one whose `noun-gender` answers with a real masculine and feminine — the sense `$gender` was named for, agreed with a linking `-n`/`-r` — and it selects on it nowhere, because not one of the describing words it needs is a true adjective: the colours and the widths are the invariable `mai …` construction and the fill patterns are bare noun phrases. The genders are written into `noun-gender` anyway, so a translator reaching for `farin`/`farar` later finds them already decided. Oromo has gender too and answers `m` throughout, because every noun it names is a derived form or a loan; its header says which noun would have to arrive for a fork to be worth writing. Afrikaans is the mirror of both: Dutch splits its nouns into de-words and het-words and its catalog forks on every colour, and Afrikaans is that catalog with the split taken out.

    Swahili and Kinyarwanda land on opposite sides of the same gap. An attributive colour noun wants an associative particle whose shape comes from the class, and the identical string is also what `backgroundColor` reports standing alone, where the particle would be wrong — and `$role` is `standalone` in both places. Swahili writes the colour bare; Kinyarwanda writes the particle in, because `icyatsi` without it does not read as a colour at all.

    Only Afrikaans and Swahili supply the 118 element names and 12 anion names. The other eight join the thirteen catalogs that leave them to English: secondary science across those systems is taught in English, French or Afrikaans, so the fallback is what a learner meets in their own textbook rather than a gap in the translation. That line runs through a language family as well as through a script — Swahili supplies them and Zulu, Xhosa, Kinyarwanda and Chichewa do not.

    Chichewa is catalogued as `ny` and shows in the roster as **Nyanja**, which is what CLDR renders that code as; the two names are one language. No locale in this batch needs an alias — `sw-KE`, `sw-TZ`, `af-ZA` and the rest all filter to their catalog on their own.

- 3280643: Add message catalogs for Ukrainian, Czech, Slovak, Greek, Romanian, Hungarian, Finnish, Swedish, Danish and Norwegian Bokmål, which fills in Northern and Eastern Europe alongside the Western European languages DoenetML already had.

    Each covers all four namespaces — the viewer chrome, the editor and language-server surfaces, the prose the core computes into a document, and the warnings and errors. `documentLocale="uk"` and `<document lang="el">` work with nothing configured, and all ten reach `<document lang>`'s autocomplete under their own names.

    These are **unreviewed machine-generated seeds**, and every file says so in its header. Nothing falls back silently: a key a translation is missing renders in English.

    All ten supply the element and anion names, so no locale in this batch is partial.

    `no` reaches the Bokmål catalog as well as `nb` does. It is the macrolanguage tag, so no directory is named for it, but it is what a hand-typed `<document lang="no">` says and what several browsers still send — and filtering negotiation would otherwise have answered it with English. Nynorsk (`nn`) still falls back to English, being a written standard of its own rather than a spelling of this one.

    What these ten have in common is a constraint the right-to-left work met first: an affix cannot be attached to an interpolated value. Hungarian and Finnish weld case endings whose shape depends on the word they land on, Romanian's definite article is a suffix, and Czech and Slovak vocalize a preposition according to what follows it — so several messages are restructured rather than translated in place, and `packages/i18n/README.md` now writes the constraint down once for every language rather than as a right-to-left curiosity.

- cc5cb5e: Add message catalogs for Armenian, Georgian, Azerbaijani, Kazakh, Kyrgyz, Uzbek, Tajik, Turkmen, Mongolian and Tatar.

    Each covers all four namespaces — the viewer chrome, the editor and language-server surfaces, the prose the core computes into a document, and the warnings and errors. `documentLocale="kk"` and `<document lang="kk">` work with nothing configured, and all ten reach `<document lang>`'s autocomplete with their names in their own spelling.

    These are **unreviewed machine-generated seeds**, and every file says so in its header. Nothing falls back silently: a key a translation is missing renders in English, which is what makes seeding safe.

    The Caucasus, Central Asia and the Turkic belt were the largest remaining gap on the map, and the batch is the counterweight to the last one. Where Central and Eastern Europe pulled `$gender` and `$role` apart, nine of these ten select on **neither** — the Turkic languages and Mongolian inflect a great deal and never on the words a style description places, because what carries a clause there is a suffix on the noun and an attributive adjective in front of it does not move. **Armenian** is the same answer from an Indo-European grammar with seven cases.

    Only **Georgian** forks, and it shows the argument at its narrowest: an adjective drops its final -ი in the dative and nowhere else, and only one of the four positions is a dative, so its catalog writes out a single `$role` branch — «წითელი» everywhere but «ყვითელ ფონზე». **Tajik** is the other pole, and it needs no fork at all to be interesting: it is Persian in Cyrillic, its adjectives follow the noun, so it reorders the composition messages, and the izafat linking them is written rather than left as an unwritten vowel, which makes it the one catalog anywhere that welds onto a placeable an affix whose shape that placeable decides. What keeps that sound is the words it puts in reach of the frame — «нур» rather than «шуоъ» for a ray — since the izafat does reshape a ъ- or ӣ-final word. The README now carries that case where the rule is stated.

- 4a64c4a: Show the `<select>` family's error boxes in the reader's language.

    `<select>`, `<selectFromSequence>` and `<selectPrimeNumbers>` replace themselves with a red box when nothing can be selected, and that box was built from a finished English sentence. It was the last error box that stayed English on a page rendering in any other language.

    The twenty-two messages behind it now carry the same stable codes every other diagnostic does, with Spanish translations alongside. Two failures that read as one — a sequence whose values all share a factor, and a sequence that ran out of draws looking for a coprime pair — are separate codes, because they are separate situations.

    The English text of every box is unchanged, except that a count of a thousand or more is now written the way the reader's language writes numbers — "Cannot select 1,500 components" rather than "1500".

- 80877e0: Graphs: a labeled `<vector>` or `<polyline>` draws its label only once, instead of repeating it on every draggable handle.

    A `<vector><label><m>x^2</m></label></vector>` in a graph drew three copies of its label: the intended one beside the arrow, plus one at the head and one at the tail. A `<polyline>` did the same at each vertex. Only the component's own copy was typeset, so with a `<m>` label the extra copies appeared as raw LaTeX — `\(x^2\)`.

    The extra copies came from the invisible points each renderer creates as drag handles. Those points inherit the component's attributes, including its label text, and the instruction that switched the label back off was being silently dropped. `<vector>`, `<lineSegment>` and `<polyline>` now build their drag handles from one shared helper, so the suppression can no longer go missing from one of them.

- 1eaa039: Fix the German and Russian style descriptions that were inflected for the wrong position, and add Portuguese, Turkish, Polish, Hindi and Amharic catalogs.

    Style descriptions handed adjectives one token, the gender of the noun they describe. That is enough while a phrase is rendered in one place, but three of them are rendered in two — a border's adjectives, the background colour, and the text colour beside it — and a language that inflects for case needs a different form in each. German and Russian had one token to spend, so each fork came out right in one position and wrong in the other:

    - `borderStyleDescription` read `dicken` and `толстой` instead of `dicker` and `толстая`
    - `textStyleDescription` read `roter auf gelber Hintergrund` instead of `rot auf gelbem Hintergrund`, and `красный на жёлтый фоне` instead of `красный на жёлтом фоне`

    Descriptions now carry the syntactic position alongside the gender, so a catalog can select on both. A language with no case ignores the new argument, so English, Spanish, French, Italian, Dutch, Chinese, Japanese, Korean, Vietnamese, Indonesian, Somali and Hmong Njua are byte-identical.

    Five catalogs join, each covering all four namespaces. Portuguese is Brazilian, which is what a bare `pt` means; `pt-AO` and `pt-MZ` reach it too, and a European `pt-PT` could be added later without disturbing it. Its border is feminine where Spanish's is masculine, so the border clause reads `com uma borda grossa`. Turkish inflects none of this — its suffixes attach to the noun rather than to the adjectives in front of it — and a noun counted by a numeral stays singular.

    Polish and Hindi are the two that needed the new argument. Polish style words land in three different cases, so from one set of words it now renders `grube`, `z grubym obramowaniem` and `czerwony na żółtym tle`. Hindi's marked adjectives — the ones ending in -ा — take the oblique before a postposition, so a border reads `मोटा` alone and `मोटे किनारे के साथ` in the clause, while unmarked ones like लाल never change.

    Amharic is written in the Ge'ez script, which runs left to right, so it needs none of the right-to-left support DoenetML lacks. It leaves the element and anion names untranslated, as Somali and Hmong Njua do and for the same reason — there is no settled Amharic chemical nomenclature to seed from — so those names fall back to English and `lint:i18n` reports the gap.

    Like the others, every one of the five is an **unreviewed machine-generated seed** and says so in every file's header.

- 817ae69: Added a way for host applications to look up the available style palettes, so they can present readers a palette picker with swatches. `@doenet/doenetml` exports `getStylePalettes()` and `getStylePalette(name)`, returning each palette's name, description, and per-style resolved colors (light and dark), line/marker settings, and color words. The standalone bundle exposes the same functions as `window.getDoenetStylePalettes` / `window.getDoenetStylePalette` for pages that load it from a CDN. In `@doenet/doenetml-iframe`, `<DoenetViewer>` and `<DoenetEditor>` accept an `onStylePalettes` callback that reports the palettes of the standalone bundle actually booted in the iframe (`null` when that version is too old to provide them).
- bfe075d: Added style palettes: named, coordinated sets of style definitions selectable with the new `<stylePalette>` component. The six standard styles are now the `default` palette, joined by eight more — the colorblind-friendly `okabeIto` (Okabe-Ito), `tolBright`, `tolMuted`, and `tolHighContrast` (Paul Tol), and `ibm` (IBM Design Library); a pure-luminance `grayscale` for readers who distinguish styles by lightness alone; and `categorical` (ten maximally varied hues) and `grumpyNarwhal` (six saturated hues that go neon in dark mode) for documents that need many obviously different styles. Every palette is WCAG-checked in light and dark mode, varies marker shapes and line widths alongside colors, and carries curated style-description color words.

    A palette selection scopes to its containing section and resets that subtree's base styles; `<styleDefinition>` overrides still apply on top, and style numbers beyond the palette's size cycle through the palette. Every palette has at least four styles, and the documentation now advises reserving style numbers 1-4 for the most important distinctions. Style number 1 always renders text in the ordinary document text color, so selecting a palette never recolors prose that specifies no style number. Palette names autocomplete in the editor, and the context-help panel resolves styles against the active palette.

- 04a0dba: Punctuate a table's title and a figure's caption from the document's language.

    `<table>` and `<figure>` already named themselves in the document's language, but the `": "` joining that name to the authored title or caption was written into the renderer, so a Spanish activity read **`Figura 2`: pie de foto** — the name from one language and the punctuation from another. The separator is part of the name the catalog composes now, so a language that joins the two differently can say so.

    The English text is unchanged. The separator is emphasized along with the name it belongs to, so `<strong>Figure 2</strong>: caption` becomes `<strong>Figure 2: </strong>caption`.

- d42f6dd: Write the words a `<table>`, a `<figure>`, and a `<paginatorControls>` name themselves with in the document's language.

    "Table 2" and "Figure 3" are one message each rather than a word with a number stuck on the end, so a language that orders or punctuates them differently can say so.

    The paginator's "Page 3 of 5" is now composed as a whole sentence in the document's language. It used to be half worker and half renderer — the word came from the document, the "of" joining the counts was English written into the viewer and unreachable — so a translated activity read "Página 3 of 5".

    `previousLabel`, `nextLabel`, and `pageLabel` follow the document when the author leaves them unset, and pass through untouched when the author writes them — including when what they wrote is the English default.

    A document that declares no language reads exactly as it did before.

- 96b2e21: Viewer: don't stay permanently blank when the browser reports the not-yet-rendered viewer as off-page.

    The viewer starts hidden and unhides once an IntersectionObserver sees its
    wrapper on the page (a guard that keeps JSXGraph from initializing while
    actually hidden). But while hidden the viewer renders nothing, so the observed
    wrapper has zero height — and some browsers (observed in branded Chrome 149,
    with activities embedded in a same-origin iframe as in PreTeXt books) report a
    zero-area target as non-intersecting even with the observer's huge rootMargin.
    The viewer then deadlocked as a silent blank box: hidden ⇒ zero height ⇒
    reported off-page ⇒ stays hidden.

    A zero-area element that still generates a layout box cannot meaningfully be
    off the page, so it now counts as on-page; `display: none` — the state the
    guard exists to detect — generates no layout boxes and still keeps the viewer
    hidden.

- f068c6b: `<updateValue>` can now set a property that holds a whole list of coordinates, such as a vector's `tail`, `head`, or `displacement`.

    Targeting one of these did nothing before: `<updateValue target="$v.tail" newValue="(7,8)" />` left the vector where it was, and the only way through was to update `tail.x` and `tail.y` separately from a `<triggerSet>`. The new value's components are now spread across the property's entries, so a single `<updateValue>` moves the tail, head, or displacement.

    Setting a property this way makes the same change as dragging a point that extends it — `<point extend="$v.tail" />` — rather than the same change as dragging the vector's own tail handle, which additionally holds the head in place.

    The same applies to other one-dimensional coordinate properties, including a `<point>`'s `xs` and a `<circle>`'s `center`. Properties holding a list of points, such as a `<polygon>`'s `vertices`, are unchanged.

    Closes #1529.

- c14705f: Style-contrast accessibility alerts can now be translated, as can the warning
  that a section selected more than one `<stylePalette>`.

    The contrast alerts named the colors they compared — "text color against
    background color", " (dark mode)" — by building the sentence out of English
    fragments, so no translation could reposition or reword them. The pair and the
    mode are now data the message renders, and the dark-mode advice is a variant of
    the message rather than a second sentence appended to it.

    Translating them gives the style utilities a runtime dependency on the message
    catalogs, and the DoenetML language server — embedded in the code editor as
    well as in the VS Code extension — imports those utilities for something
    unrelated. That would have added 20 KB gzipped of catalog text to it with none
    of the code that reads it. The catalogs are declared side-effect-free instead,
    so the language server is unchanged byte for byte, and a new build check fails
    if they ever arrive.

- 8157928: Always label the rendered activity with the language it was rendered in.

    The container the viewer renders carries a `lang` attribute even when nobody declared a language — no `<document lang>`, no `documentLocale` from the host. Such an activity is labeled `en`, the language the core computes its prose in. Were the container left unlabeled, its subtree would inherit the embedding page's language instead, so a Spanish page could wrap an English "Check Work" and an English "thick red line" in a subtree the DOM called Spanish, and a screen reader would read them with a Spanish voice.

    An author who wrote in another language and never said so should declare it — `<document lang="es">` — the same fix that already gets them Spanish style descriptions and Spanish chrome.

## 0.7.21

### Patch Changes

- c470948: Support `addChildren`/`deleteChildren` on more parent components.

    The `addChildren` (and `deleteChildren`) actions, previously available only on `<graph>`, now also work on `<stickyGroup>` and all sectioning components — `<section>`, `<subsection>`, `<subsubsection>`, `<paragraphs>`, `<part>`, `<task>`, `<aside>`, `<objectives>`, `<problem>`, `<exercise>`, `<question>`, `<activity>`, `<example>`, `<definition>`, `<note>`, `<theorem>`, `<proof>`, `<problems>`, and `<exercises>`. For example, a `<callAction actionName="addChildren">` can now add a `<point>` to a `<stickyGroup>` inside a `<graph>`, or add a `<graph>` to a `<section>` or `<problem>`.

    The underlying mechanism (a `<_dynamicChildren>` internal child appended during normalization, plus shared worker actions that delegate to it) has been generalized so additional parent components can opt in with minimal changes.

    The `<callAction>` schema now accepts arbitrary children, since the children of a `<callAction actionName="addChildren">` are the (serialized) components to be added and can be any component type.

    Closes #1361.

- b2ad13e: Align list-item section numbers consistently.

    Section numbers for list-rendered sections (for example `<problem>`s inside `<problems>`, including through a `<cascade>`) now line up at the decimal regardless of how the content wraps, the container width, or whether an item starts with text or with an element. Previously a number could drift horizontally as its content wrapped, as the viewport narrowed, or when the item's first child was a plain string.

- 728cadf: Editor: Fix autocomplete when typing a tag immediately before another tag.

    When typing an element name directly in front of an existing tag (e.g.
    `<nu|<text>` or `<text><nu|</text>`), error recovery parsed the half-typed tag as a complete element, so the editor suggested a bogus close-tag completion (`/nu>`) and the completion menu would not open. The cursor is now recognized as still typing the open tag name, so element-name completions are offered and the menu opens — whether reached by typing or by invoking completion explicitly (Ctrl+Space) at that position, and including when `<` is typed just before another tag. In unclosed containers, the normal parent close-tag option is preserved and inserts a complete close tag even when completion is invoked before typing `<`.

    Element/tag-name suggestions now match the typed text as a substring and rank prefix matches first, so you don't have to remember how a tag name begins — typing `<num` offers `number` and `numberList` first, then `isNumber` and other tags containing `num`. The suggestions are also consistent however the menu is reached (typing, Ctrl+Space, or deleting back to a shorter prefix), where previously the visible set depended on what was cached when the menu first opened.

    Invoking completion in the body of an unclosed element (e.g. `<text><math>|</text>`) now offers that element's child components alongside its closing tag, and accepting the closing tag inserts it at the cursor instead of overwriting the end of the opening tag.

    Closes #1328.

- 27bd3db: Update the bundled MathJax from 4.1.0 to 4.1.3.

    Doenet now loads MathJax `4.1.3` (from 4.1.0) for the copy it injects when a
    page provides none, and the VS Code preview's Content-Security-Policy allowlist
    is bumped to match. The `4.1.x` line is bug-fix only: 4.1.3 notably fixes
    infinite-loop crashes in the semantic-enrichment/speech code, a Safari rendering
    bug for math in `overflow: auto` containers, and assorted TeX edge cases; 4.1.1
    and 4.1.2 improved dark-mode contrast and accessibility. This also aligns the
    version Doenet injects with what host pages that ship a floating `mathjax@4`
    tag (e.g. PreTeXt books) now load, so typesetting is consistent whether Doenet
    loads MathJax itself or reuses a host-provided engine.

    Note: MathJax 4.1.2 corrected the LaTeX size macros (`\large`, `\tiny`, etc.) to
    use standard LaTeX sizes.

- 16f0ba8: Clicking the math in a button's label now activates the button. Previously, when a button's label contained math (e.g. a `<callAction>` with a `<label>` holding an `<m>`), MathJax intercepted clicks on the math and the button did nothing.
- 40e3ff5: Answer: fix the check-work button getting stuck on "Checking..." for a choice answer with inline math inside a repeat in a `<cascade>`.

    A `<choice>` computes its `text` from its inline children's `hiddenIgnoreParent` so that it ignores the visibility it inherits from ancestors (a choice's text feeds an answer's credit-achieved dependencies, and inside a `<cascade>` ancestor visibility changes after a submission). However, `hiddenIgnoreParent` still climbed up to ancestor sections through its source composite's `hidden` — so a choice with an `<m>` placed inside a `<repeat>`/`<repeatForSequence>` within a `<cascade>` still depended on the cascade's credit-based visibility. Submitting such an answer changed its own credit-achieved dependencies, which immediately reset `justSubmitted` to `false`, leaving the "Check Work" button spinning indefinitely. `hiddenIgnoreParent` now recurses through the source composite's and adapter source's `hiddenIgnoreParent` instead of `hidden`, so it no longer depends on ancestor-section visibility.

- 0bbad39: Fix circular dependency when referencing `choice.selected` inside the same `<choice>`.

    `$c1.selected` (or a `<conditionalContent>` whose condition references `$c1.selected`) inside `<choice name="c1">` previously threw a "Circular dependency detected" error. The root cause was that `choiceInput.indicesMatchedByBoundValue` always declared a dependency on `choiceChildren.text` even when `bindValueTo` is absent — a dependency that is never used in that case. This created a resolver-blocker cycle:

    `allSelectedIndices` → `indicesMatchedByBoundValue` → `c1.text` → composite expansion of `$c1.selected` → `c1.selected` → `childIndicesSelected` → `selectedIndices` → `allSelectedIndices`

    The fix makes `indicesMatchedByBoundValue` only declare the `choiceChildren.text` dependency when `bindValueTo` is actually set, breaking the cycle.

    Closes #1399.

- 45e18eb: Choice inputs no longer hide embedded text inputs, redirect nested interactive input clicks to the outer choice, or show the outer choice focus ring while those embedded controls are focused.

    Closes #1398.

- 52d3488: Editor: Add `initialOpenTab` attribute to `<codeEditor>` to control which diagnostics/responses tab opens initially.

    The new attribute accepts: `none` (panel closed), `first` (first available tab, default), `errors`, `warnings`, `info`, `accessibility`, `responses`, or `help`.

- 27bd3db: Viewer: coexist with a MathJax that the host page already provides.

    `DoenetViewer` / `DoenetEditor` previously wrapped content in
    `better-react-mathjax`'s `MathJaxContext`, which unconditionally assigned
    `window.MathJax = config` and appended its own MathJax `<script>` — with no
    check for a MathJax the host page had already loaded. When a Doenet activity was
    embedded in a page that loads its own MathJax (e.g. PreTeXt books), this clobbered
    the host's live engine with a plain config object and/or raced a second engine,
    causing intermittent, load-order-dependent failures to render.

    Doenet now loads MathJax through a coexisting loader: if a live MathJax engine
    is already present it is reused and `window.MathJax` is never overwritten; if a
    MathJax `<script>` is already on the page (including a deferred one) Doenet waits
    for it instead of injecting a second copy; only when no MathJax is present does
    Doenet load its own. This also removes the duplicate engine (and its extra
    worker) that was previously loaded per embedded activity.

    Two new controls are exposed on `DoenetViewer` / `DoenetEditor` (and, for the
    standalone build, as `data-doenet-mathjax-url` / `data-doenet-use-existing-mathjax`
    attributes and `renderDoenet*ToContainer` config keys):

    - `mathjaxUrl` — the MathJax script URL to load when the page provides none.
    - `useExistingMathjax` — force reuse of a host-provided MathJax even when it is
      not yet detectable (e.g. the host loads it after Doenet mounts).

    Reusing a host engine means the host's MathJax version governs typesetting;
    MathJax 3.x–4.x are supported for reuse.

    Closes #1433.

- d9de421: feat: add `collapsible` and `startOpen` attributes to all sectioning components.

    Previously, `collapsible` was hardcoded to `false` in the base sectioning component and only `<aside>` and `<proof>` exposed it as a user-settable attribute (defaulting to `true`). All other sectioning components (`<section>`, `<example>`, `<theorem>`, etc.) could not be made collapsible by the author.

    `collapsible` is now declared on the base `SectioningComponent` with a default of `false`, so every sectioning component inherits the attribute. The shared `startOpen` attribute is now available on every sectioning component and controls the initial state only when `collapsible` is enabled: it defaults to `true` in the base class, while `<aside>` and `<proof>` continue to default to `collapsible="true"` plus `startOpen="false"` — no behavior change for existing documents.

    Closes #1393.

- 9728e26: New `colorInputsSeparately` attribute on `<answer>`: when set, each input is
  colored based on the awards that reference it rather than all inputs sharing the
  same overall credit color. Works with `<fractionInput>` (coloring numerator and
  denominator boxes independently) and with multiple `<mathInput>`s connected via
  `forAnswer`. Requires `numAwardsCredited` ≥ 2 for meaningful results.

    Also renames `forceIndividualAnswerColoring` → `colorAnswersSeparately` on
    sectioning components (section, exercise, problem, etc.) for naming consistency.
    The old name is deprecated and rewritten at parse time with a warning.

    Closes #1389.

- affed83: Editor: Fix context-sensitive help when the cursor sits on a tag boundary.

    When the cursor is immediately before a tag (e.g. `|<text/>`, including after whitespace or indentation), the help panel now reports the surrounding context — the parent element, or the document top level — instead of claiming the cursor is inside the element and suggesting its children. The same now holds when the cursor sits between a closed child and its parent's close tag (e.g. `<p><math>x</math>|</p>` or `<p><math/>|</p>`), where the panel reports the parent (`p`) rather than the just-closed child (`math`). When the cursor is inside a self-closing tag's `/>` (e.g. `<text/|>`), the panel now shows element-level help rather than the element's children.

    Closes #1327.

- ab57ea2: Dark mode: make it actually work and meet WCAG AA.

    - The viewer/editor now own the theme: the `darkMode` prop accepts
      `"light" | "dark" | "system"` (system tracks `prefers-color-scheme` live) and
      the resolved theme is written to a `data-theme` attribute on the viewer/editor
      root and the viewer paints its own `--canvas` background, so standalone
      embeds do not rely on the host page for the dark canvas/text/JSXGraph-axis
      CSS variables to take effect. Stray `.dark` selectors, description surfaces,
      hint/solution/feedback reveal buttons, and portaled popovers were unified
      onto `[data-theme]`. The `darkMode` prop now defaults to `"system"`
      (previously `"light"`), so an embedded `DoenetViewer`/`DoenetEditor` follows
      the user's OS/browser theme preference unless the host pins a theme.
    - Style definitions now derive a dark-mode color (and color word) from an
      author's light-mode color instead of mirroring it. Graphic/marker/line colors
      are lightened until they clear WCAG AA against the dark canvas where possible
      at their rendered opacity. A
      `textColor`/`backgroundColor` is adapted by inverting each color's lightness
      independently (so e.g. white-on-black becomes black-on-white). Because each
      color is derived from itself alone, the result is independent of the order in
      which the colors were authored and of whether they were split across
      parent/child style blocks, and it preserves the author's figure/ground
      relationship without "fixing" an intentionally low-contrast pairing. When an
      otherwise-accessible light-mode text color (or text/background pair) happens
      to invert to an inaccessible dark-mode value, an accessibility diagnostic is
      emitted (with a suggested `textColorDarkMode`/`backgroundColorDarkMode` value,
      targeting the attribute the diagnostic is anchored to, that restores
      sufficient contrast).
      Author-supplied contributors to the rendered contrast (including backgrounds,
      opacity, and `*ColorDarkMode` values) that fail AA likewise emit a diagnostic,
      mirroring the existing light-mode check.
    - The six built-in style presets had their dark-mode colors recomputed to meet
      WCAG AA.
    - Fixed renderer pieces that went invisible (or low-contrast) on the dark
      canvas: math notation lines (fraction bars / square-root vincula in
      `<mathInput>`), the `<mathInput>` insertion caret (#397), the JSXGraph
      keyboard-focus outline (#396), editable `<curve>` through/control-point
      handles, draggable polygon/polyline vertex highlights, the
      `<summaryStatistics>` table border, the `<orbitalDiagram>` and
      `<subsetOfRealsInput>` number-line graphics, the on-canvas (unchecked)
      graph-control toggle buttons, and the inline `<choiceInput>` dropdown (control
      and the portaled menu, which is given an elevated dark surface) — all now
      track the theme via `--canvasText` / `--canvas` (or doc-level dark mode for
      the portaled menu).
    - The editor's diagnostic hover tooltip (including the accessibility-contrast
      warnings) used CodeMirror's light default surface, so its text rendered
      white-on-white in dark mode; it now uses an elevated dark surface with
      recolored, AA-legible heading/code accents.
    - The PreFigure renderer (`<graph renderer="prefigure">`) is now dark-mode
      aware: the generated diagram XML depends on the document theme, so line,
      marker, and fill colors use their derived dark-mode values, and the axes/ticks
      (which PreFigure draws black by default, invisible on the dark canvas) get a
      light stroke matching the JSXGraph axes. Tick labels are MathJax
      `currentColor` and already follow `--canvasText`.
    - Added dark-mode accessibility (cypress-axe) coverage across renderer
      categories, plus computed-style regression tests for the caret, focus outline,
      and fraction bar.

    Closes #966 (complete dark mode), #396, #397. Contributes dark-mode contrast
    coverage toward #1324.

- 6412d89: Editor dark mode: theme the CodeMirror code area, syntax highlighting, autocomplete icons, diagnostics/responses/help panels, viewer controls bar, and resizable handles for WCAG AA contrast in dark mode.

    Adds cypress-axe color-contrast coverage for representative editor authoring surfaces in dark mode.

    Closes #1366.

- dcf1019: Dark mode: keep viewer, editor, and iframe error states and graph UI legible.

    Error banners, renderer-load failures, and editor footer menus now use theme-aware colors, graph drag handles now follow live dark-mode changes, and smart labels use dark-mode-aware colors on JSXGraph canvases. This also adds dark-mode accessibility coverage for disabled check-work buttons.

- e0254ea: fix: convert remaining hardcoded light-mode colors in renderers to dark-mode-aware CSS variables

    Fixes all remaining DoenetML renderer elements that displayed poorly or fell below WCAG AA contrast in dark mode after PR #1381. Replaces hardcoded colors with new theme variables (`--errorText`, `--indicatorHoverBlue`, `--buttonHoverBlue`, `--doenetTagColor`) and dark-mode values for the existing `--lightBlue/Green/Red/Orange` hover variables.

- fa58c22: Dark mode: theme the virtual keyboard.

    With `darkMode="dark"` the virtual keyboard now renders in dark mode in the viewer, editor, and iframe wrappers: the tray, key faces, special keys, focus-ring offset, and tab indicator all switch to dark-surface colors. The tray receives `data-theme` directly on its `#virtual-keyboard-tray` element so the theme is applied even though the tray portals to `document.body` outside the viewer's `data-theme` wrapper. When multiple documents share the singleton tray, it follows the active document's resolved theme, routes key events only to the focused owner, and keeps the last active document's theme while focus moves into the tray or temporarily leaves all registered owners. All dark-mode keyboard colors meet WCAG AA contrast.

    Closes #1367.

- 9a7b623: Viewer: reliably render math when embedded in a page that provides its own MathJax 4.

    When a Doenet activity is embedded inline in a page that loads its own MathJax 4
    (e.g. a PreTeXt book), the viewer reuses the host engine instead of loading its
    own. The check that recognizes a live engine required `MathJax.startup` to be a
    plain object, but MathJax 4 exposes `startup` as a function, so the host engine
    was never recognized: the viewer waited until it timed out and every piece of
    math rendered blank (with a couple of spots showing raw LaTeX). A live engine is
    now detected whether `startup` is a function (MathJax 4) or an object
    (MathJax 3).

    As a safety net, if a host-provided MathJax is present but never becomes usable
    within the timeout, the viewer now falls back to loading — and taking over with —
    its own MathJax instead of leaving math blank, and a failed load no longer
    prevents later attempts from retrying.

- f4391f8: Disabled `<textInput>` controls inside `<graph>` now use the same muted disabled styling as other text inputs instead of appearing enabled.

    Closes #1289.

- 172d797: Viewer: stop flashing raw LaTeX while inline math updates (e.g. dragging a point).

    Inline math that references a changing value — like `$P` for a dragged point, or
    a `<number>`/`<line>` bound to it — is rendered with `better-react-mathjax`'s
    `<MathJax dynamic>`, which writes the new raw LaTeX into the DOM and typesets it
    asynchronously. When updates outpaced MathJax (e.g. a point referenced many
    times, dragged), the raw LaTeX (`\left( 3, 4 \right)`) stayed visible during the
    drag, and its update effect could drop the final typeset, leaving one copy stuck
    showing raw LaTeX until the next unrelated re-render.

    These value-display renderers (`<m>`/`<me>`/`<men>`, point, number, line, vector,
    angle, label, answer, and response/label helpers) now render through a new
    double-buffered `DynamicMath` component: it typesets the new LaTeX on an
    off-screen buffer and swaps the result in only once it is ready, keeping the
    previously rendered math on screen meanwhile. Rapid updates are coalesced to the
    latest value (so nothing is left un-typeset) and throttled. The math therefore
    stays rendered throughout a drag — momentarily stale during a fast drag, but
    never showing raw LaTeX and never blanking.

    Math inside inputs and some labels (e.g. `<mathInput>` previews) still uses the
    previous path and is unaffected by this change.

- 9e78216: Editor: Ctrl/Cmd+S now refreshes pending source edits when focus is anywhere in the editor-viewer, including the rendered document, without triggering the viewer's Reset behavior when no code changes are pending. When the button is showing Reset, its tooltip now omits the Ctrl/Cmd+S hint.

    The shortcut follows the platform convention used by the code editor — Cmd+S on macOS, Ctrl+S elsewhere — and ignores AltGr/Alt combinations so AltGr+S still inserts a character.

- e8837f7: `@doenet/standalone`: load the core worker from a co-located file instead of embedding it, cutting per-embed memory.

    The standalone bundle previously embedded the entire ~15 MB core worker as an inline string, so every embedded viewer realm on a page held its own copy. It now ships the worker as a separate `doenetml-worker/` directory alongside `doenet-standalone.js` and loads it from there — using a tiny same-origin `importScripts` bootstrap when the bundle is served cross-origin (e.g. from a CDN, the way PreTeXt and doenet.org load it), so the realm no longer holds the ~15 MB copy. Measured ~70 MB less per embedded instance (a 20-instance textbook page saves well over 1 GB).

    The worker files must be served alongside the bundle. This is automatic when loading from npm/CDN (e.g. jsdelivr serves the whole package) or from a normal `dist/` deploy; a host that serves only `doenet-standalone.js` in isolation must now also serve the `doenetml-worker/` directory next to it. A host that loads the bundle from a blob/data URL (where "next to the bundle" does not exist) gets a fallback to `<origin>/doenetml-worker/index.js` and must serve the worker there. A new `@doenet/doenetml/doenetml-external-worker.js` entry point drives this; the existing `@doenet/doenetml/doenetml-inline-worker.js` entry remains available for fully self-contained embeds.

- 2bd7f0a: Give patterned fills a translucent background instead of a fully transparent one.

    A closed shape with a non-solid `fillStyle` (horizontal, vertical, diagonal, backdiagonal, dots, diamonds) now renders as two layers: a background the color of the graph canvas at `fillOpacity`, and the pattern itself in `fillColor` at `fillPatternOpacity`. Previously the area behind the pattern was fully transparent. A `solid` fill is unchanged — `fillColor` at `fillOpacity`.

- d383c46: Add a `SPLICE.flushState` message so hosts can unmount in-progress viewers losslessly.

    Hosts that unmount off-screen viewers to reclaim memory could already remount with prior work via `initialState`, but state was only reported at (throttled) save events, so work since the last report was silently lost. A host can now post `{ subject: "SPLICE.flushState", message_id }` (to the viewer's window, or to its own window for `@doenet/doenetml-iframe`, which forwards it). The viewer settles in-flight updates and pushes any pending state out through the **normal `SPLICE.reportScoreAndState` message** — so a host that already persists those reports saves the just-flushed state with no extra code, and need not know a flush occurred. It then replies with a stateless acknowledgement `{ subject: "SPLICE.flushState.response", message_id, activity_id, doc_id, success, hadState }`. Once the acknowledgement arrives every saved report is current, so tearing the viewer down loses nothing — remounting later with the last saved state (as `initialState`) restores the document. `hadState: false` means the viewer held no state beyond what it was initialized with (e.g. its core was never created), so unmounting is equally safe.

    This split suits a host topology where the party managing lifecycle (which sends `flushState` and waits for the acknowledgement) is not the party persisting state (which just saves `reportScoreAndState`). Hosts should apply a retry/timeout around the round-trip (the viewer's listener registers on mount, and flushing is idempotent). Enables bounded-window / park-and-restore embedding (Doenet/assignment-viewer#36, #37). Closes #1440.

- 3803d38: `<fractionInput>` now colors its numerator and denominator input box borders by submitted correctness inside an `<answer>`, matching the correctness feedback already shown by `<mathInput>` and `<textInput>`.

    When correctness coloring is enabled, the fraction as a whole also exposes its validation state in accessible text without implying that the numerator and denominator are graded separately.

    Closes #1388.

- b2bdb5a: Fix the `<fractionInput>` fraction bar (vinculum) not rendering on high-DPI displays.

    The bar was drawn as a `border-bottom` on an empty, zero-height table cell inside a `border-collapse: collapse` table. On high-DPI (e.g. Retina) screens the browser snaps that collapsed hairline to the device-pixel grid and rounds it away to nothing, so the vinculum disappeared in Chrome, Safari, and Brave on those displays. It is now painted as a solid 2px-high block (`background-color: currentColor`), which rasterizes reliably at any `devicePixelRatio`.

- c0db375: Add a `<fractionInput>` component.

    `<fractionInput>` renders a numerator input box above a denominator input box, separated by a fraction bar; each box accepts a math value like a `<mathInput>`. It exposes `numerator`, `denominator`, and `value` (the numerator divided by the denominator) properties, supports `prefillNumerator`/`prefillDenominator` attributes, links two-way to a math child or `bindValueTo` target, and works as the input inside an `<answer>` (with check-work integration).

    This also clarifies the `value`/`immediateValue` help-text descriptions for the math inputs (`mathInput`, `matrixInput`, `fractionInput`): `value` is described simply as the input's value, and `immediateValue` as the value reflecting the user's in-progress edits.

    Closes #1342.

- 32a7054: Graphing: add `lineStyle` and `lineWidth` attributes to `<function>`.

    When a function is graphed, it now accepts the same per-component line style overrides as the equivalent wrapped `<curve>`. The generated schema also recognizes these attributes in editor diagnostics.

    Closes #1356.

- 35ae4b0: Graph: revise closed-shape `fillStyle` patterns and add `fillPatternOpacity`.

    Closed shapes in graphs (`polygon`, `circle`, `angle`, `regionBetweenCurves`, and `regionBetweenCurveXAxis`) now support patterned fills via `fillStyle` and separate pattern opacity via `fillPatternOpacity`.

    Available `fillStyle` values are:

    - `solid` (default — existing behavior unchanged)
    - `horizontal` — horizontal line pattern
    - `vertical` — vertical line pattern
    - `diagonal` — diagonal lines (/)
    - `backDiagonal` — back-diagonal lines (\\)
    - `dots` — dots pattern
    - `diamonds` — filled diamonds pattern

    The `dots` and `diamonds` patterns are drawn from the BANA (Braille Authority of North America) Texture Palette for Tiger Embossers, intended for tactile graphics. Pattern fills now use `fillPatternOpacity` (default `1`) instead of the solid-fill `fillOpacity` default (`0.3`).

    The previous `crosshatch` and `diagonalCrosshatch` values are replaced by `dots` and `diamonds`, respectively.

    The JSXGraph interactive renderer supports all patterns. The PreFigure renderer uses the native `fill-pattern` attribute (available from prefig 0.6.7). Filled circles and polygons also include the pattern wording in their text style descriptions (such as `styleDescription` and `fillStyleDescription`).

    Closes #1386.

- 103095a: Graph: rename the `xscale` and `yscale` properties to `xScale` and `yScale`.

    The casing now matches the other graph limit properties (`xMin`, `xMax`, `yMin`, `yMax`). Because DoenetML resolves property references case-insensitively, existing documents that use `xscale`/`yscale` (e.g. `$g.xscale`) continue to work unchanged—the canonical name reported by the schema and autocomplete is now `xScale`/`yScale`. (The unrelated `xscale`/`yscale` attributes of `<function>`, which set interpolation scales, are unaffected.)

- 2aba692: Graph: make `xScale` and `yScale` settable.

    The `xScale` and `yScale` properties of a `<graph>` were previously read-only derived values (`xMax − xMin` and `yMax − yMin`). They now have inverse definitions, so binding to or otherwise setting them adjusts the axis limits: the midpoint of the corresponding limits is held fixed while both ends move symmetrically so that the difference matches the requested scale (e.g. setting `xScale` updates `xMin` and `xMax` around their shared midpoint). Non-finite and non-positive values are rejected (a non-positive scale would make the minimum ≥ the maximum), and the underlying `xMin`/`xMax` (and `yMin`/`yMax`) inverse logic—including the `fixAxes` refusal—is reused.

- 0a58d4d: Image: resolve `source="doenet:<id>"` against a configurable media URL.

    When an `<image>` specifies `source="doenet:abcdefg"`, the image now loads from `doenetImagesUrl + "/" + imageId` (the middle slash is omitted when `doenetImagesUrl` already ends with `/`). The `doenetImagesUrl` is a new optional prop on `<DoenetViewer>` and `<DoenetEditor>` (defaulting to `https://doenet.org/api/media`), mirroring the existing `doenetViewerUrl` prop.

    Only a source that is exactly `doenet:<id>` (an alphanumeric id) is treated as a media reference; any other `doenet:` source (such as a legacy `doenet:cid=<hash>` form) renders the image placeholder rather than requesting an unknown URL.

- 6764722: Image: add open-license attribution to `<image>`.

    `<image>` gains a set of new attributes for crediting open-licensed images. A new `licenseCodes` attribute accepts a fixed set of open-license codes (the Creative Commons licenses, `CC0`, `PDM`, plus `GFDL`, `FAL`, `OGL`, `MIT`, and `APACHE-2.0`); codes are matched case-insensitively and offered in editor autocomplete in their canonical case, and specifying two codes marks the image as dual-licensed. A new `licenseVersion` attribute selects the Creative Commons URL version (default `4.0`; ignored by other licenses). From the codes the worker derives public `licenseNames` and `licenseUrls`. New `licenseName`/`licenseUrl` attributes provide a fallback used only when no `licenseCodes` are given.

    New optional attributes `imageName`, `authorName`, `authorUrl`, and `originalUrl` supply the rest of the attribution. The viewer renders a Creative Commons "TASL"-style credit sentence (e.g. `"Squirrel" by Jane Doe is licensed under a Creative Commons Attribution 4.0 license.`) at the bottom of the image's `<description>` — and shows the same description disclosure UI even when no `<description>` is authored. The license clause is phrased by kind: Creative Commons reads "a <name> <version> license", other licenses read "the <name>", and public-domain dedications read "is in the public domain (<name>)"; dual licenses are joined with "or".

    The recognized license list is exported from `@doenet/doenetml` and `@doenet/doenetml-iframe` (`mediaLicenses`, `getMediaLicenseInfo`, `getMediaLicenseDisplay`, `creativeCommonsVersions`, `defaultCreativeCommonsVersion`, and the `MediaLicenseInfo` / `MediaLicenseKind` / `MediaLicenseDisplay` / `CreativeCommonsVersion` types) so embedding apps can build their own license pickers from the same source of truth.

- 9df6f1e: Apply each option's style text color in an inline `<choiceInput>`, matching the behavior of a block `<choiceInput>`.

    Inline choice inputs render their options through a select dropdown, which previously suppressed the text color from the options' style definitions. The displayed value and the unselected (and focused) menu options now render with their style text colors; the currently selected, dark-highlighted menu option keeps white text for contrast.

    Closes #1352.

- 2b856c8: Set `maskLabel="true"` on a graphical component (or a stand-alone `<label>`) to give its label an opaque background so it stays legible when it overlaps an axis, grid line, or another object. Labels keep their transparent background by default. When masking is enabled, hovering a draggable object outlines its label as a cue that the object can be dragged.
- 4cfd4a5: Fix light-mode WCAG AA contrast for built-in style presets 1, 3, and 6.

    Preset line/marker colors for styles 1 (blue), 3 (orange), and 6 (gray) sat
    below the WCAG AA graphic threshold (3:1) in light mode when composited at
    their 0.7 opacity over the white canvas. The colors are darkened (hue and
    saturation preserved) to just clear 3:1:

    - Style 1: `#648FFF` → `#1f5dff` (2.11 → 3.08)
    - Style 3: `#F19143` → `#a6510c` (1.82 → 3.11)
    - Style 6: `gray` → `#636363` (2.43 → 3.12)

    Dark-mode variants (`*ColorDarkMode`) are unchanged — those were already
    fixed in the dark-mode PR. `fillColor` for each preset is updated to match
    the new line/marker color for visual consistency.

    The updated light-mode blue (`#1f5dff`) and orange (`#a6510c`) are also
    registered with the style-color-word resolver so editor/LSP help continues
    to describe presets 1 and 3 as blue and orange rather than purple/brown.

    The preset palette accessibility test (`presetPaletteAccessibility.test.ts`)
    is extended to assert WCAG AA compliance in light mode too (mirroring the
    existing dark-mode guard), closing the test gap identified in #1364.

    Closes #1364.

- 9b48416: Editor: support enumerated `validValues` on list-valued attributes (e.g. `createComponentOfType: "textList"`).

    When an attribute declares `validValues`, it is now interpreted per-item on a list-valued attribute: every item of the list must be one of the listed values. This flows through schema generation (the attribute is marked as a list of keywords), so editor autocomplete suggests the allowed values, the context-sensitive help panel labels them "Allowed values (one per item)", and the reference docs render the value table with a list type. The schema-violation check validates each whitespace-separated item rather than the whole value, and at runtime invalid items are dropped with a diagnostic. `<sideBySide>`/`<sbsGroup>` `valign`/`valigns` are migrated as the first worked example.

- 4998214: `<mathInput>` can now be placed inside a `<graph>`. Like `<textInput>`, it renders
  at an `anchor` point on the board and honors `positionFromAnchor` for placement
  relative to that anchor. Click inside the field to edit it; grab its label (or the
  grip shown when it has no label) to drag it to a new position. Set
  `draggable="false"` to pin it in place.
- cf8503e: Fix self-referential references in recognized rendering contexts (for example `<label>$a</label>` inside component `a`) so they render a meaningful value instead of a circular dependency error.

    When a component references itself without an explicit prop inside a recognized rendering context, DoenetML now falls back to the component's public `value` state variable rather than showing an error. For `<point>`, that means using its public coordinates value. This applies in contexts such as `<label>`, `<text>`, `<math>`, `<m>`, `<md>`, `<boolean>`, `<number>`, and the corresponding list variants. The existing circular-dependency error is preserved outside those contexts.

    Closes #1333.

- 895b636: PreFigure renderer: use native `fill-pattern` attribute for patterned `fillStyle` values.

    The `@doenet/prefigure` package now vendors `prefig-0.6.7-py3-none-any.whl`, which added native `fill-pattern` support. The PreFigure renderer now uses the `fill-pattern` attribute for patterned `fillStyle` values (`horizontal`, `vertical`, `diagonal`, `backDiagonal`, `dots`, `diamonds`) instead of falling back to a solid fill with a warning. Pattern opacity is controlled by `fillPatternOpacity` (mapped to `fill-opacity` on the patterned element).

- a760eaf: Viewer: prevent stale queued theme updates from overriding the current theme after reinitializing with Ctrl+S.

    This fixes prefigure graphs and other theme-sensitive rendering after switching between light and dark mode without a full page reload.

- 044f318: Problems: preserve list numbering through an intervening `<cascade>`.

    When `<problem>` elements sit inside a `<cascade>` inside `<problems>`, the cascade is now treated as a transparent structural container for `asList` propagation. The problems receive the expected list numbering (`1.`, `2.`, `3.`), and the cascade itself no longer incorrectly renders as list item `1`.

    Closes #1390.

- 1f18803: Viewer: fix boxed and collapsible section heading colors in dark mode.

    Boxed and collapsible section titles now use accessible dark-mode defaults instead of reusing the light-mode gray/green heading backgrounds. Authored concrete light-mode heading colors now derive accessible dark-mode heading colors automatically, while authored CSS-variable colors fall back to the accessible dark-mode defaults unless authors override them explicitly with `completedColorDarkMode`, `inProgressColorDarkMode`, and `notStartedColorDarkMode`. Accessibility diagnostics now also flag authored section heading colors that fall below WCAG AA contrast in either theme, including translucent colors after compositing.

- f920b2f: Answer: stop a partial-credit `<feedback>` from briefly flashing on screen when a section-wide check-work button submits multiple answers at once.

    `submitAllAnswers` submits each enclosed answer with `skipRendererUpdate: true` so the renderer only updates once, on the final `numSubmissions` bump. However, `performUpdate` forced a renderer fan-out whenever the update carried a `recordItemSubmission` instruction (every answer submission does), ignoring `skipRendererUpdate`. That pushed the renderer mid-loop while the section's aggregated `creditAchieved` was at an intermediate partial value, so feedback gated on a partial-credit condition flashed and then disappeared. The renderer fan-out now honors `skipRendererUpdate`; normal single submissions still render via their trailing `triggerChainedActions` flush.

- 49327a0: Section-wide check work: add a `maxNumAttempts` attribute and rename `documentWideCheckWork` to `sectionWideCheckWork`.

    Any container that supports `sectionWideCheckWork` (`<section>`, `<problem>`, `<exercise>`, `<example>`, `<p>`, `<li>`, `<div>`, `<span>`, lists, and the document) now also accepts `maxNumAttempts`. Just like a per-`<answer>` `maxNumAttempts`, each submission counts as one attempt: pressing the section-wide "Check Work" button submits and uses up an attempt, and pressing the button again does nothing until one of the inputs changes (returning the button to "Check Work"). The number of attempts remaining is shown next to the button, and once the attempts are exhausted every `<answer>` inside the container becomes disabled and the button is disabled.

    The document's `documentWideCheckWork` attribute is renamed to `sectionWideCheckWork` so the document shares the same abstraction as other containers. `documentWideCheckWork` continues to work as a deprecated alias (with a deprecation warning).

    Within a `sectionWideCheckWork` container, the attempt count is controlled solely by that container. A `maxNumAttempts` set on an enclosed `<answer>` — or on a nested `sectionWideCheckWork` container — is ignored, and DoenetML emits a warning suggesting that `maxNumAttempts` be set on the (outer) container instead.

    Closes #1308.

- 433fdcf: Opt-in shared core-worker host: multiplex document cores onto shared workers.

    Setting `doenetGlobalConfig.useSharedCoreWorker = true` makes viewers on a page share core workers (up to `sharedCoreWorkerMaxCores` cores per worker, default 12) instead of booting one ~100 MB dedicated worker per document. Each document's core runs independently on its own message channel with the same API as before; tearing down one document releases only its core. Measured on the memory benchmark: 8 viewers drop from ~1455 MB to ~584 MB total (marginal cost per additional viewer ~136 MB → ~12 MB).

    For iframe embedding, `@doenet/doenetml-iframe`'s `DoenetViewer` gains a `useSharedCoreWorker` prop: the parent page owns the shared worker pool and forwards each iframe's core over a `MessagePort`, so the cores of many same-origin iframes — which cannot share workers on their own — multiplex onto parent-owned workers (pools are keyed per standalone version). This works with the default CDN-served bundle (the worker is loaded via a same-origin `importScripts` bootstrap when cross-origin).

    Default off. Trade-off when opted in: a worker-level hang or crash affects every document on that worker (per-core teardown is still individual); the recovery escalation ladder is tracked in #1466.

- 614b4c3: Adopt the shared input helpers across the non-math inputs.

    `textInput`, `codeEditor`, `booleanInput`, and `choiceInput` now reuse the shared input helpers introduced alongside `fractionInput` instead of duplicating the logic: `booleanInput`/`choiceInput`/`textInput` use the shared `submitAnswer` external action, and `textInput`/`codeEditor` use the shared `valueChanged`/`immediateValueChanged` state-variable definitions. Their `value`/`immediateValue` help-text descriptions are also reworded to match the math inputs — `value` is described simply as the input's value, and `immediateValue` as the value reflecting the user's in-progress edits.

- d383c46: Include the README in the published `@doenet/doenetml` and `@doenet/standalone` packages.

    These packages publish their `dist/` directory, and the README was not copied into it, so npm displayed no documentation at all. The build now ships the README (as `@doenet/doenetml-iframe` already did) — including the new host message protocol (SPLICE) documentation.

- 3b2c343: Stop the standalone viewer from collapsing its host iframe during boot.

    When embedded with `data-doenet-send-resize-events="true"`, the viewer used to start reporting its height to the parent page the moment the React element mounted — before the core had rendered anything. Hosts that honor these messages (e.g. PreTeXt) would shrink the iframe to a sliver while the activity was still loading, and leave it collapsed if the render never completed.

    The viewer now waits for the document's first render before reporting heights, and never reports collapse-level heights. Host iframes keep their placeholder size until real content appears, then resize to its true height.

- f6ff9ac: Spreadsheet: upgrade `handsontable` to v18.0.0, `@handsontable/react-wrapper` to v18.0.0 (replaces `@handsontable/react`), and `hyperformula` to v3.3.0, while adding dark-mode theming for spreadsheet rendering.

    No changes to `<spreadsheet>` markup or formula syntax — existing content continues to work as-is. Floating-point formula results may differ very slightly (HyperFormula now rounds at 10 significant digits, matching Excel/Google Sheets behavior). The spreadsheet visual appearance is preserved via the Classic theme, and dark mode now uses the matching Classic dark theme. For accessibility, spreadsheets now use native HTML table semantics instead of Handsontable's newer ARIA grid/treegrid tags, so screen readers will navigate them as tables.

    Closes #1391.

- f4a711f: Editor: Fix stale VS Code tag/snippet autocomplete ranges.

    When typing a closing tag in the editor (for example `</te|` inside `<text>`),
    the close-tag completion now stays in sync with the full partially typed prefix
    and accepting it replaces that whole prefix. This avoids VS Code/native-LSP
    flows that could previously duplicate the `/` or leave the already-typed suffix
    behind when completing a close tag.

    The same refresh logic now also keeps `<`-triggered snippet completions in sync
    with the typed prefix, including the prefigure `annotations-skeleton` snippet,
    so accepting those items no longer leaves stale typed characters behind either.

## 0.7.20

## 0.7.19

### Patch Changes

- da57627: Editor: the accessibility report now links to the accessibility documentation.

    A "Learn how Doenet approaches accessibility" link at the top of the report points to `<docsURL>/concepts/accessibility`, where new Concept and Guide pages explain what the WCAG checks do and don't guarantee and how to write accessible activities.

- 2cf122a: Editor: give each autocomplete suggestion a meaningful, color-coded icon in the dropdown's left column.

    CodeMirror renders that icon from each completion's `type` string, and the editor was passing the lowercased LSP `CompletionItemKind` name straight through. That left the column showing accidental glyphs — a box for components, a union sign (`∪`, easily misread as a stray "u") for attributes — and nothing at all for snippets, attribute values, and references, since those `type` names aren't in CodeMirror's built-in icon set.

    Completions are now assigned distinct, intentional types and a small theme defines a colored glyph for each DoenetML category: components (`◈`), attribute names (`@`), attribute values (`▪`), references (`$`), reference properties (`.`), and snippets (`❏`). Components, reference properties, and closing tags share one LSP kind (`Property`) but are split apart for icon purposes using signal the items already carry — no LSP `kind` values change, so the language-server output and its tests are unaffected.

    Also: when the element menu is opened with Ctrl+Space (no `<` typed yet), each component suggestion now displays as a tag — `<math>`, `<answer-label>` — so it's clear they're elements. Filtering and insertion still use the bare name; only the displayed label gains the angle brackets. When a `<` was already typed, the suggestions stay bare as before.

- 818b17c: Adopt the Diátaxis documentation framework: rename the "Document Structure" section to "Concepts".
    - The editor's context-help "Learn about references" link now points to `concepts/references` (was `document_structure/references`), following the documentation folder rename from `document_structure/` to `concepts/`.

- 7d53e42: Improve the editor's context-sensitive help and make Ctrl+Space work between tags.
    - Component help now leads with the component name and its one-line summary on a single line, and the `<tag>` name is a link to the component's reference page (the footer link stays too).
    - Reference help for `$name` and `$name.property` now explains what a reference is and links to a new References page, rather than showing the referenced component's summary and page. The help is identical wherever the cursor sits in a `$a.b` chain — the whole reference is treated as one unit. A cursor on a reference inside an attribute value (e.g. `extend="$m"`) now gets reference help rather than help for the enclosing attribute.
    - An invalid reference like `$bad` (or a failing member chain like `$m.sub` or `$s2.m`) now explains the problem — "No referent found" or "Multiple referents found" when the resolver can say so definitively, and a hedged message when it can't — instead of falling back to the default panel text. The message is reported against the whole reference and is the same wherever the cursor sits in the chain, including inside attribute values like `copy="$s2.m"`.
    - When the cursor is in an element's body or in empty top-level space, the panel now surfaces a short list of components to try (instead of going blank), and points to Ctrl+Space for the full list. The same shared ranking — per-container hand-picks (including ones keyed by an abstract ancestor like `_sectioningComponent`) first, then a global "favorites" tier, then how directly the child is allowed (adapter-only children dropped unless picked), with alphabetical as the tiebreak — also drives the autocomplete dropdown's order, so the two surfaces stay in lockstep. Snippets cluster with their element in the dropdown.
    - Containers that take no children (e.g. `<variantControl>`) or only text now say so plainly instead of inviting Ctrl+Space; containers that accept both text and components note that text is allowed.
    - Pressing Ctrl+Space between tags (or in empty top-level space) now opens the element-completion menu and inserts the leading `<` for you; previously you had to type `<` first. The cursor position right between adjacent open and close tags (e.g. `<mathInput>|</mathInput>`, where the autocompleter parks the cursor after inserting a tag pair) is now recognized as the body rather than as the tag itself.
    - Adds a References page to the documentation covering `$name`, `$name.property`, and referencing repeat iterations.

- 7addd7c: Flow inputs and their labels inline with the surrounding text.

    Inputs (`<mathInput>`, `<textInput>`, `<booleanInput>`, `<matrixInput>`, an inline `<choiceInput>`, and `<answer>`) now lay their label and input out as ordinary inline content. A label long enough to wrap breaks across lines with the input following its end, instead of the input sitting beside the label's first line where it could read as though it belonged in the middle of the label text. Text before and after an input in the same paragraph also wraps together with it. A single tall label, such as one containing tall math, still aligns with the input as before.

- f5406bd: Make the document viewer resilient to a stalled core-worker startup, and stop slow documents from being aborted before they finish loading.
    - If the core worker stalled while starting up (under CPU/timing pressure), the viewer could be left permanently blank — no document and no error. It now watchdogs the worker's brief startup handshake and restarts a worker that fails to come up or hangs; after repeated failures it shows a "could not be started — reload the page" message instead of staying blank.
    - The document-evaluation phase — which can legitimately take seconds to minutes on complex documents — is no longer time-limited, so large documents finish loading instead of being aborted.

## 0.7.18

### Patch Changes

- 3449f8a: Fix two autocomplete papercuts when typing an unquoted attribute value.
    - The wrap-in-quotes / value-completion hint for a bare value past `=` (e.g. `<math name=hello`) now also fires inside a parent element. Previously the parser's error-recovery wrapped the bare run in an `AttributeValue` node when the partial element was followed by `</...>` or another `<`, which masked the bare-value branch. The cursor-position detector now distinguishes a real quoted value (starts with `"`/`'`) from this recovered form.
    - The value popup no longer flickers closed when whitespace follows `=` (e.g. `<math simplify= full`). The CodeMirror gate that decides whether to ask the LSP for completions now treats whitespace immediately following `=` as "still in trigger reach," so typing a space after `=` doesn't close the popup that opened on `=`. Scoped to `=` only — other server triggers (`<`, `/`, `"`, `'`) don't reopen the popup across whitespace, so `<math name="hello" ` behaves like `<math ` and waits for a letter before suggesting attributes.
    - Typing the _closing_ quote of an attribute value (e.g. `<math name="hello"`) no longer pops a popup of attribute names. `"` and `'` are server trigger characters so the opening quote can pop value completions, but the gate now distinguishes openers from closers by counting prior occurrences of the typed quote between the last `<` and the cursor — an even count is an opener, odd is a closer. This correctly classifies `<math name="hello" simplify="` as an opener (two prior `"` chars from `name="hello"`) while still treating the closing `"` of `<math foo="x=y"` as a closer, so closers behave like `<math ` and wait for a letter before suggesting attributes.

- ace8b55: Reword the one-sentence component summaries surfaced by the editor's context-sensitive help and the schema.
    - ~234 per-component summaries (the `static componentDocs.summary` on each component class) were reconciled against the prior reference-docs wording. The worker class is now the single source of truth; the alphabetical and by-type reference indexes are generated from it.
    - Style is uniform across all 245 components: starts with a capital letter; no trailing period.
    - A handful of substantive corrections, most notably `<pretzel>` (which previously described itself as "a figure for visualizing logical compositions of subsets of the reals" — entirely wrong; now describes its actual response-matching behavior) and `<attractToConstraint>` (which had mirrored `<attractTo>`'s description instead of its own).
    - The autocomplete-popup hover text, the in-editor help panel, and any other surface that reads `componentDocs.summary` will all show the new wording.

- b4f39dc: Editor: resolve coordinate-style chains via array `indexAliases`, so autocomplete and the context-help panel both surface `$vector.head.x`, `$line.points[1].x`, `$circle.center.y`, and `$curve.controlVectors[0][2].x` (3D, with two bracket indices on one segment).

    The DoenetML runtime already resolves these chains: each array state variable carries an `indexAliases` table — `Vector.head` has `[["x","y","z"]]`, `Line.points` has `[[], ["x","y","z"]]`, `Circle.center` has `[["x","y","z"]]` — and the runtime treats the trailing segment as an exact-match alias for one dimension. The editor previously dead-ended at the first segment past the array property because the schema didn't carry the alias table.

    This change emits `indexAliases` onto each array `SchemaProperty` from the runtime's existing per-state-var declaration, then wires a small `walkIndexAliases` helper into both the autocomplete and the context-help layers:
    - **Autocomplete** at `$container.arrayProp.` (or `$container.arrayProp[N].`) now offers each alias name for the current dimension as a Reference-kind completion (`x`, `y`, `z` for `$vector.head.`).
    - **Help panel** renders a new `arrayEntry` payload for a fully-consumed chain (`$vector.head.x`, `$line.points[1].x`), showing the array property's description plus the alias path and the entry's leaf type.

    The chase is intentionally exact-match on the alias table — it never looks up properties of the array entry's `type` (e.g. `<point>` for `head`). So `$vector.head.hidden` continues to produce no completion and no help, matching the runtime: `hidden` IS a `<point>` property, but it isn't in `head`'s alias table and the runtime won't resolve it either. This keeps the editor in lockstep with what authors will actually see at runtime instead of inviting them down chains that look plausible but don't work.

    Picks up any array state variable that ships `indexAliases` automatically once the schema is regenerated, with no per-component plumbing.

    Closes #1180.

- a7bb40b: Improve the editor's context-sensitive help panel.
    - The panel now reflects the currently-highlighted autocomplete row. Arrow-key navigation through the popup swaps the help instantly, and closing the popup reverts to cursor-based help. Element, attribute, property (ref-member), `$name` reference, and value rows are all supported.
    - Highlighting a snippet row shows the snippet's description and a preview of the template it would insert.
    - Help no longer disappears mid-attribute when the cursor crosses tricky parser boundaries: `<math simplify=`, `<math simplify="`, `<math simplify=full`, `<math simplify= full` (whitespace after `=`), and similar unquoted-value cases all keep the `simplify` attribute help visible.
    - Unknown attributes fall back to element help instead of blanking. Typing `<math bad`, `<math bad=foo`, or having `"foo"` highlighted in the value popup now keeps the `<math>` description on screen.

- a07d543: Fix the editor's context-sensitive help for `$container.member` access through composite wrappers, when multiple wrapper branches each declare a descendant with the same name.

    Example: a `<select name="s">` with two `<option>` branches each containing `<text name="t">`. The autocomplete dropdown correctly offered `t` at `$s[1].`, but the help panel went blank — `getNamedDescendant` requires a uniquely-addressable name and saw two matches.

    The resolver already includes such names in `visibleDescendantNames` for indexed access through a composite (walking `<case>` / `<else>` / `<option>` wrappers transparently via `collectNamesFromCompositeChildren`). The help-side descendant lookup in `resolveRefMemberDescendantHelp` now mirrors that wrapper walk and returns the first match — but only when every branch resolves the name to the same component type. When branches diverge (e.g. one `<option><math name="t">` and another `<option><text name="t">`), the help layer can't statically tell which branch the runtime will pick, so the panel stays blank rather than guessing.

    Closes #1179.

- 092dfb5: Fix the editor's context-sensitive help panel for property refs whose path has two or more navigation segments (e.g. `$rep[1].point1.x`).

    The editor's help logic used to run against a local `AutoCompleter` with no Rust resolver attached, so multi-segment refs silently fell to a JS-only fallback that only walked the first path segment and could surface misleading help — or, for unindexed traversal through a `takesIndex` composite like `$rep.myMath`, surface help that the runtime would actually error on.

    Help derivation now lives in the LSP worker, which already has the Rust resolver attached for diagnostics and completions. The editor sends a small `doenet/contextHelp` / `doenet/contextHelpForCompletion` request and renders the response. Multi-part chains resolve correctly through the real reference graph; resolver-suppressed cases (`$rep.myMath` without an index) correctly return no help.

    User-visible improvements:
    - `$rep[1].myMath.x` now shows `<math> property x` instead of "Help for multi-part references is not yet supported."
    - `$rep.myMath` (unindexed access through a `takesIndex` composite) no longer surfaces misleading help — the panel correctly blanks, matching what the runtime would error on.
    - `$valueName` / `$indexName` references inside a `<repeat>` / `<repeatForSequence>` now surface the binding in the help panel — matching what the autocomplete dropdown offers. The panel notes which repeat introduced the name and whether it's the value or the index.
    - Editor bundle drops the schema map + `AutoCompleter` + `computeContextHelp*` modules; the LSP worker is now the single source of truth for help derivation.

    During the rust-core boot window (~300–800 ms on first load), ref-resolution positions briefly show no help; element/attribute/snippet help works as soon as the LSP initialises.

- acef508: Resolve CSS variables in the editor's context-sensitive help panel so attribute defaults like `var(--lightGreen)` are shown as their concrete computed value (e.g. `#a6f19f`) instead of an opaque variable reference. Resolution happens at runtime via `getComputedStyle` on `:root`, so `DoenetML.css` remains the single source of truth — any new attribute whose default is a `var(--name)` is handled automatically.
- 9bf3629: `<section name=foo>` and similar unquoted attribute values now produce a single error both in the viewer and in the editor, instead of up to four overlapping diagnostics (an "invalid attribute" from the worker, two duplicate "missing value" parser errors, and a "name=''" normalization error). The unified message names the corrected form (`name="foo"`) and is classified as an error so the viewer renders the orange error block — matching the existing severity for the related shapes `<section name>` and `<section name="4" />`. Authors who write an unquoted value on an unknown attribute (e.g. `<a foo=bar />`) see only the unquoted-value error until the quoting is fixed; the follow-up "unknown attribute" warning surfaces on the next edit.

    Also fixes a pre-existing parser duplication: errors that lived inside the first attribute of an open tag (e.g. the "missing value" warning for `<x name= />`) were emitted twice. They now appear once.

    And fixes a pre-existing LSP severity bug: DoenetML diagnostics with a soft severity (`warning`, `info`) were rendered as red error squiggles in the editor regardless. Deprecation warnings now render with the appropriate yellow/blue squiggle color.

    And fixes a pre-existing duplication in the editor hover: parser-emitted DAST errors were surfaced once by the LSP and again by the worker's runtime diagnostics once the viewer ran, so the hover tooltip showed the same message twice even though only one squiggle was drawn. The duplicate copy is now collapsed before reaching the editor.

- 7aeb62d: Re-parent `<description>` and `<shortDescription>` to appropriate base components, removing irrelevant inherited attributes.

    `<description>` previously extended the scored-section base used by `<div>`, exposing attributes (`aggregateScores`, `weight`, `sectionWideCheckWork`, `showCorrectness`, `colorCorrectness`, `forceIndividualAnswerColoring`, `submitLabel`, `submitLabelNoCorrectness`, `displayDigitsForCreditAchieved`) and properties (`creditAchieved`, `percentCreditAchieved`) that have no meaning for a description. It also appeared as a valid generic block child everywhere in the schema, causing spurious autocompletion. It now extends `BlockComponent` and is schema-valid only where a `description`/`descriptions` child group is declared.

    `<shortDescription>` previously extended `<text>`, exposing graph-placement attributes (`draggable`, `layer`, `anchor`, `positionFromAnchor`) and `isLatex`, along with `math`/`number` adapters — none of which apply, since a `shortDescription` is never visually rendered. It now extends the non-graphical inline base used by `<title>`. Its accessibility diagnostic that warns when a short description contains math is rewritten to inspect the inline children directly.

    The dropped attributes are registered as deprecated-and-ignored in the DAST deprecation registry (#1144), so existing documents that used them produce a warning instead of an "invalid attribute" error.

    Fix `<blockQuote>` rendering of whitespace between inline children. `<blockQuote>` was missing `includeBlankStringChildren`, so a whitespace-only string between two child components was stripped and adjacent texts ran together — `<blockQuote><text>hello</text> <text>there</text></blockQuote>` rendered as `hellothere`. `<blockQuote>` now also sets `canDisplayChildErrors`, matching the other arbitrary-content block containers (`<description>`, `<p>`, `<div>`).

- ca00a1f: Editor now warns when an attribute value is written without quotes (e.g. `<math name=foo>` → `name="foo"`). The yellow squiggle covers the bare token and the hover message names the corrected form, catching the case where the author dismissed the autocomplete hint or never opened the menu.
- 2dcf818: Use schema descriptions in the generated documentation and give schema attributes their own type.

    Each schema attribute now carries a `type` derived from its own declaration: `createComponentOfType`/`createPrimitiveOfType` (with the `string` primitive surfaced as `text`), `keyword` when the attribute enumerates valid values, and `reference` for reference-creating attributes — or `referenceOrText` when such an attribute also sets `allowStrings` (e.g. `<ref to>`, which accepts a URL string in addition to a component reference). Previously an attribute's type was inferred only from a same-named property, so attributes without one (e.g. `<answer>`'s `type`, `showCorrectness`, `colorCorrectness`) had no type.

    The reference documentation now renders the attribute, property, and attribute-value descriptions (and component summaries) that were already used for editor context-help and autocomplete.

    The unused `description` attribute of `<answer>` is excluded from the schema, so it no longer appears in autocomplete or RelaxNG validation.

- 63a0079: Schema cleanup and reference docs additions.
    - Hide non-functional or PreTeXt-compat-only components from the generated schema (and therefore from autocomplete and the auto-generated reference docs): `<markers>` (slider helper currently broken — tracked in #1164), `<topic>` (PreTeXt-compat alias), `<dataFrame>` and `<summaryStatistics>` (experimental, no source mechanism yet).
    - Refresh wording of two `<annotation>` attribute descriptions (`speech`, `sonify`) to match how Prefigure's screen-reader features actually surface to learners.
    - Add 22 new author-facing reference pages covering previously-undocumented components (annotation, annotations, cascade, cascadeMessage, cellBlock, clampFunction, codeEditor, column, displayDoenetML, extractMathOperator, feedbackDefinition, givenAnswer, latex, lcm, note, periodicSet, pluralize, solveEquations, tagc, tage, variantControl, wrapFunctionPeriodic), plus cross-link additions on existing `<option>`, `<select>`, `<feedback>`, `<award>`, `<tag>` pages. Every component now in the generated schema is documented (`check:docs-coverage` reports `0 unresolved` with an empty allow-list).

- f2a5698: Add reference documentation pages for the chemistry components `<electronConfiguration>`, `<ion>`, `<ionicCompound>`, and `<orbitalDiagram>`. Editor context-sensitive help now links to these new pages instead of treating them as undocumented (four `docsSlug` entries in the generated schema flipped from `null` to the new slugs).
- 942b3e3: Add reference documentation pages for `<cobwebPolyline>`, `<eigenDecomposition>`, `<equilibriumCurve>`, `<equilibriumLine>`, `<equilibriumPoint>`, and `<rightHandSide>`. Editor context-sensitive help now links to a reference page for these components instead of treating them as undocumented (six `docsSlug` entries in the generated schema flipped from `null` to the new slugs).
- 5ae7e7c: Add reference documentation for graphical and constraint components that were previously undocumented: `<attractToConstraint>`, `<constrainToInterior>`, `<pegboard>`, `<regionHalfPlane>`, and `<stickyGroup>`. Each component has been removed from `undocumented-components-allowlist.txt` and the existing unlinked entries in the `Alphabetical Component Index` and `Index by Component Type` tables have been linkified, with new rows added for `<attractToConstraint>`, `<constrainToInterior>`, `<regionHalfPlane>`, and `<stickyGroup>`.

    The `<attractToConstraint>` page leads with a callout positioning it for constraints that have no dedicated "attract" form (especially `<constrainToInterior>`) or for combining several constraint types under one threshold via `<constraintUnion>` — the simpler `<attractTo>` and `<attractToGrid>` are recommended when wrapping a single `<constrainTo>` or `<constrainToGrid>`. Its examples wrap `<constrainToInterior>` and a mixed `<constraintUnion>` so they cannot be re-expressed with `<attractTo>` siblings.

    The `<pegboard>` page notes that the pegboard itself only renders dots — making other objects snap to those positions requires pairing it with an `<attractToGrid>` or `<constrainToGrid>` constraint using the same `dx`/`dy`/`xoffset`/`yoffset`.

    Correct misleading attribute descriptions on `<regionHalfPlane>`. The `horizontal` attribute description previously said the half-plane is bounded by a horizontal line, and `boundaryValue` referenced `y = boundaryValue`, but the implementation constrains the x-coordinate when `horizontal` is true (the bounding line is vertical and the half-plane extends horizontally). The descriptions have been rewritten to match the actual behavior.

- 0a0858f: Docs: group attributes and properties on component reference pages into collapsible sections — a curated "Highlighted" group (open by default), functional groups (e.g. number display, labels), an "Other" group, and a "Common to all components" group that surfaces the previously hidden `BaseComponent` attributes. Adds a filter box, an Expand/Collapse-all toggle, and links from each listed attribute/property to its worked example (including examples on other pages of a multi-page reference).

    Drives the grouping with optional, docs-only `groupName`/`highlighted` metadata on attribute definitions and public state variables, threaded into the generated schema.

- 98e3733: Add reference documentation pages for `<asList>`, `<convertSetToList>`, `<pointList>`, `<tupleList>`, and `<vectorList>`. Editor context-sensitive help links to these new pages instead of treating them as undocumented.

    Documentation pass on the rest of `pages/reference/`: every `<*Input>` now has a programmatic label (a `<label>` child, a sibling `<label for="$name">`, or a `<shortDescription>` for inputs that have no natural visible prompt); every `<graph>`, `<image>`, and `<video>` now has a `<shortDescription>` first child; sugared answers (no explicit `<*Input>` child, no `<award><when>`) get their own `<label>`. The accessibility rules behind these changes are written up in `.github/skills/doenetml-docs-authoring/SKILL.md`.

    The List-component docs (`<mathList>`, `<numberList>`, `<textList>`, `<booleanList>`, `<intervalList>`) gained an explicit note that items are separated by **spaces**, not commas. The `asList` attribute's description was corrected from "each on its own line (false)" to "with no separator (false)" across the 21 List/composite source files that share it.

- 0da78df: Add reference documentation for sectional and block-level components that were previously undocumented: `<activity>`, `<blockQuote>`, `<br>`, `<conclusion>`, `<definition>`, `<exercises>`, `<hr>`, `<introduction>`, `<objectives>`, `<paragraphs>`, `<part>`, `<problems>`, `<span>`, `<statement>`, `<subsection>`, `<subsubsection>`, `<task>`, and `<theorem>`. Each component has been removed from `undocumented-components-allowlist.txt`.

    The new `<problems>`, `<exercises>`, `<introduction>`, and `<conclusion>` pages highlight the `asList=true` child-filtering rule (only the title child, sectional children, `<introduction>`, and `<conclusion>` render; bare strings and `<p>`s are silently dropped), with an instructive before/after example. The `<introduction>` and `<conclusion>` pages lead with the `asList`-parent use case where these components are most needed.

    The new `<subsection>` and `<subsubsection>` pages note that they are equivalent to a `<section>` nested to the same depth (heading level follows nesting), and `<section>` gains a parallel "equivalent nesting" example so the choice between the two forms is visible at a glance.

    All sugared `<answer>`s in the new pages carry a `<label>` (per the `doenetml-docs-authoring` skill's accessibility rule); references to named block components were unwrapped from any enclosing `<p>` to satisfy schema constraints.

    Correct misleading `componentDocs.summary` strings that overstated auto-numbering. Sections (`<section>`, `<subsection>`, `<subsubsection>`, `<paragraphs>`, `<part>`, `<task>`, `<definition>`, `<theorem>`) only render an auto-generated number when no explicit `<title>` is provided (`includeAutoNumber` defaults to `false` and `includeAutoNumberIfNoTitle` defaults to `true`), so summaries no longer assert that they are unconditionally numbered. The `<section>`, `<example>`, `<problem>`, and `<exercise>` reference pages have been reworded similarly. `<statement>`, `<introduction>`, and `<conclusion>` summaries now describe what they group rather than implying sectional auto-numbering.

    Also re-label and link the entries for these components in the `Index by Component Type` and `Alphabetical Component Index` pages, including newly-added rows for `<blockQuote>`, `<br>`, `<hr>`, `<span>`, `<part>`, `<task>`, and `<subsubsection>`. The `<section>` entry in those tables no longer asserts that the rendered block is auto-numbered, and the previously placeholder descriptions of the form "container element included for PreTeXt compatibility" are replaced with a brief author-facing description per component.

- 8fa2e2c: Fix crash when `<description>` is a direct child of `<document>` (including standalone `<description>` at the top level).

    `<document>` declared a `description` child group and a `description` state variable that read `text` from any `<description>` child. `<description>` extends `BlockComponent` and never defined a `text` state variable, so dependency setup threw `Unknown state variable text of <idx>`. The bug was pre-existing — `<description>` previously extended `<div>`, which also lacks `text` — but only surfaced when a `<description>` sat directly under the document.

    The `document.description` state variable was a legacy hook with no consumers in the worker, the renderer, or the surrounding packages. The `description` child group and `description` state variable have been removed from `<document>`; a `<description>` anywhere in a document now resolves cleanly, and the schema no longer lists `<description>` as a direct child of `<document>`.

- e8bf61e: Fix the EditorViewer's context-sensitive help panel intermittently staying on the placeholder text after a programmatic source reset (e.g. when a parent component pushes a new `doenetML` prop and the user immediately interacts). The LSP server's `textDocument/didChange` notification is fire-and-forget, so the editor can send a help RPC before the server has finished populating its `documentInfo` map — the server returns `{kind: "none"}` and the panel never updated. The help handler now retries once after 400 ms when a `none` response lands within 3 s of a source reset; cursor changes, additional source resets, and unmount all invalidate the pending retry.
- cf2b262: Redesign the editor's footer and the diagnostics/responses/help panel.
    - The diagnostics tabstrip and the `Format`/version bar collapse into a single footer row: version on the left, then a `</> Context` help tab, the four diagnostics tabs (errors / warnings / info / accessibility), a submitted-responses tab, and a three-dot menu on the right with `Format as DoenetML` / `Format as XML`.
    - Tabs are now click-to-toggle — click a tab to open the panel on it, click the active tab to close. The close-X is gone.
    - New `showHelp` prop on `DoenetEditor` (default `true`) controls the help tab independently of `showDiagnostics` / `showResponses`.
    - `initialOpenTab` now defaults to opening on the help tab (or the first enabled tab). Pass `initialOpenTab={null}` to mount with the panel closed.
    - The panel opens to ~¼ of the editor height; the virtual keyboard's open-keyboard tab moves to the lower right so it no longer overlaps the footer.

- e8bf61e: Fix the EditorViewer Format button silently doing nothing after an undo or whitespace-only edit. The editor was tracking the user's text in a ref but not in the React `value` state passed to CodeMirror, so once the state drifted from the buffer (e.g., after Ctrl+Z reverted a previous format), formatting again to the same output was an `Object.is` no-op and CodeMirror was never told to update. The format handler now flushes a sync state-to-buffer pass before applying the formatted output, guaranteeing the controlled `value` prop dispatches a real change without re-rendering on every keystroke.
- d2a749f: Exclude the ignored `label` and `cols` attributes of `<ol>`/`<ul>` from the schema.

    These two list attributes are accepted by the parser but not acted on — the renderer ignores `cols` entirely and does not yet render `label`. They now set `excludeFromSchema: true`, so they disappear from editor autocomplete, RelaxNG validation, and the docs reference tables while remaining registered. Existing content that sets `label` or `cols` on an `<ol>`/`<ul>` continues to parse silently instead of erroring.

- 73c1af3: Exclude the PreTeXt-compatibility `<h>` and `<idx>` components from the schema.

    The `<idx>` (back-of-the-book index entry) and `<h>` (index heading) elements were added for PreTeXt compatibility but have no DoenetML index infrastructure behind them and no tests. They now set `excludeFromSchema = true`, so they disappear from editor autocomplete and RelaxNG validation while remaining registered — content copied from PreTeXt that contains these tags continues to parse silently instead of erroring. Their `componentDocs.summary` strings have been corrected to describe what they actually are and flag the PreTeXt-compat status.

- f2d8a73: Stop offering plumbing state variables as author-facing properties.

    Editor autocomplete and context-help no longer suggest the renamed-aside or pre-processed state variables that components keep around as runtime scaffolding — `disabledOriginal`, `valuePreRound`, `valuePreOperator`, `valuePrePluralize`, `originalValue`, and `colorCorrectnessPreliminary`. The derived author-facing names (`disabled`, `value`, `colorCorrectness` attribute, …) stay available; only the internal twin is hidden from the schema.

- 5c6191a: Fix auto-completion of closing tags when nesting an element with the same
  tag name as its parent. Previously, typing `<p>` inside an existing
  `<p></p>` would not insert the inner `</p>` (the parser's stack-matching
  "stole" the only `</p>` for the inner element), and typing `</` afterward
  would not suggest the closing tag. The completion logic now walks up the
  contiguous chain of same-name ancestor elements and, if any of them is
  missing a close tag, treats the inner element as still needing one. (#1117)
- a104621: Fix per-component `fillOpacity` (and `lineWidth`/`lineStyle` on `<parabola>`) having no effect.

    A per-component `fillOpacity` on a filled `<circle>` was ignored — the fill stayed at the styleNumber's default opacity regardless of the attribute, so two circles with very different `fillOpacity` values rendered identically. `<circle>` and `<parabola>` borrow their state-variable definitions straight from `GraphicalComponent` (to skip `<curve>`'s parametric-curve variables), but the borrow ran with the wrong `this`, so their style-override categories (`["line", "fill"]` for circle, `["line"]` for parabola) resolved to an empty set and the overrides never reached `selectedStyle`. The borrow now preserves the leaf component as `this`, so `fillOpacity` on a circle and `lineWidth`/`lineStyle` on a parabola take effect.

- e8bf61e: The "Format DoenetML"/"Format XML" buttons (and the LSP format-on-save) now lay out documents like a standard HTML/XML formatter: block-level elements always sit on their own line, inline elements flow with the surrounding text, and unrelated sibling elements never share a line. Each element's content mode (block, inline, pre) is derived from the component's `InlineComponent` / `BlockComponent` inheritance, emitted into the schema as `layoutCategory`. Blank lines between any two block-adjacent siblings (block↔block, text↔block, block↔text) are preserved and capped uniformly at one. `<pre>` content stays verbatim. Inside `<setup>` and `<moduleAttributes>` — definitional containers with no prose flow — every direct element child gets its own line regardless of inline/block classification, while each child's own internals format normally. Re-running the formatter on its own output is a no-op (idempotence enforced by tests). Closes #1116.
- 68bfe0c: Fix iframe-wrapped `<DoenetEditor>` so prop changes no longer reload the iframe and reset editor state. Toggling `readOnly`, `showDiagnostics`, `showResponses`, `width`, and similar serializable props now propagates to the inner editor live via Comlink instead of being baked into a new `srcDoc`. Function-typed props (callbacks) also propagate live: when the parent passes a new closure identity, the iframe is re-pointed at the fresh function. `doenetML` is treated as initial-only after mount — changes are silently ignored so in-progress edits aren't overwritten; consumers wanting to seed a new document should remount via a parent `key=`. In `@doenet/standalone`, `renderDoenetViewerToContainer` and `renderDoenetEditorToContainer` now cache the React root per container so repeat calls re-render in place instead of mounting a competing root.
- fb3ebdf: Fix `<latex>` crashing when one of its children lacks a `latex` state variable. Constructs like `<latex><text>foo</text></latex>`, `<latex>$mathInput.latex</latex>` (where `<mathInput>` does not expose a `.latex` prop), or any reference whose resolved component lacks `latex` previously raised "Unknown state variable latex of `<idx>`" from the worker, which leaked the internal state-variable name to the rendered viewer. The `<latex>` value-dependency now marks `text`/`latex` as optional on its children, matching `<m>`/`<me>`/`<md>`, so children without `latex` fall back to their `text` value.
- 94b7714: Editor: extend `childContextHelp` alias resolution beyond documentation so the LSP validates the alias target's children, attribute set, and per-attribute enumerated values — not just its help text.

    Before, `<row>` and `<column>` inside `<matrix>` were validated against the tabular `<row>` / `<column>` schemas even though the runtime sugars them into `<matrixRow>` / `<matrixColumn>` (a `MathList`). Authoring the docs examples produced spurious diagnostics (`Element <math> is not allowed inside of <row>.`, `<row> doesn't have an attribute called unordered/maxNumber/…`), element and attribute-name completion offered the wrong sets, and the attribute-value dropdown read its enumeration from the canonical entry.

    Now child-element validation, attribute-name validation, attribute-value enumeration, and the corresponding completion branches all consult the alias-aware schema entry when a parent declares a `childContextHelp` redirect, sharing the same `resolveEffectiveSchemaElement` lookup as the documentation popup.

- ee9cb06: `<mathInput>`: customize which identifiers are auto-formatted as built-in function names in the editor.
    - `additionalFunctionNames` — extra names to auto-format (e.g., `"erf"`).
    - `removedFunctionNames` — built-in names to stop auto-formatting (e.g., `"min"` so `kg/min` can be typed as a unit).
    - `resetFunctionNames` — when set, replaces the entire list (defaults plus the other two attributes are ignored). Pass an empty value to disable auto-formatting entirely.

    Defaults are unchanged. All three attributes accept whitespace-separated text lists. Without `resetFunctionNames`, entries appearing in `removedFunctionNames` are dropped from the effective list even if `additionalFunctionNames` re-adds them. Author-supplied names that MathQuill would reject are filtered out instead of crashing the editor; a `warning` diagnostic positioned on the offending attribute lists what was ignored and explains the naming rule.

    The editor's context-help panel surfaces the resolved effective list when the cursor is on any of the three attributes, alongside the deltas (or the reset list) authored on that input. Attributes whose schema default is an empty array no longer render an empty `Default:` row.

- 09152a0: Editor: surface the declared child's component type and default value when describing author-declared attributes on a `<module copy="$x" />` (or `extend=`) site. The attribute-name autocomplete dropdown and the context-help panel now show e.g. "Author-declared module attribute (`<point>`)" instead of the generic placeholder, so authors can see at a glance whether the declared attribute on the target module is a point, number, text, … rather than having to chase down the definition. The help panel's "Default:" row also picks up the declaring element's inner content (e.g. `(3,4)` from `<point name="P">(3,4)</point>`), so authors can see what value the instance would take if they omitted the attribute.
- 2980677: Editor: stop warning on author-declared attributes of `<module copy="$x" />` (or `extend=`) when `$x` resolves to a `<module>` whose `<moduleAttributes>` declares them; surface those declared names in the attribute-name autocomplete dropdown alongside `<module>`'s canonical attributes; and show the same description in the context-help panel when the cursor sits on one.

    For each `<module copy=…>` / `<module extend=…>` site, the editor resolves the reference through the same Rust resolver the runtime uses, so bare names (`$m`), multi-segment paths (`$s.m`), and deeper chains all work. Scope rules match the runtime exactly: an inner `<module copy="$m">` inside `<section name="s1">` resolves to that section's `m`, not to another section's same-named module, and ambiguous references (e.g. `$s2.m` when two sibling sections share the name `s2`) produce no augmentation — the unknown-attribute warning correctly fires.

    When the reference doesn't resolve, points at a non-`<module>`, or targets a `<module>` with no `<moduleAttributes>`, the canonical `<module>` schema decides as before and unknown-attribute warnings remain correct. Bracket-bearing path segments (`copy="$s[0].m"`) are conservatively skipped, and names reserved by the `<module>` class itself (`name`, `hide`, `copy`, `extend`, …) are filtered to match the runtime's silent rejection of such declarations.

    Resolution is precomputed once per source revision and batched across all sites, so back-to-back validation + completion + help calls between edits cost at most one resolver round-trip per `<module copy=…>` site total.

- 374a4c1: Allow per-component overrides for non-color style attributes on graphical components — e.g. `<point markerStyle="square" markerSize="10">`, `<line lineWidth="1" lineStyle="dashed">`, `<polygon fillOpacity="0.5">`. Component-level overrides win over inherited `<styleDefinition>` values; siblings without the attribute still inherit normally.

    Each component opts into the categories its renderer uses via `static styleOverrideCategories`:
    - **marker** (`markerStyle`, `markerSize`, `markerFilled`) — `<point>`; `<endpoint>` and `<equilibriumPoint>` (both minus `markerFilled` — their `open` / `stable` already control fill).
    - **line** (`lineStyle`, `lineWidth`) — `<line>`, `<lineSegment>`, `<ray>`, `<vector>`, `<polyline>`, `<parabola>`, `<bestFitLine>`, `<cobwebPolyline>`; `<equilibriumLine>` (minus `lineStyle` — `stable` determines solid vs. dashed).
    - **line + fill** (line group + `fillOpacity`) — `<polygon>`, `<triangle>`, `<rectangle>`, `<regularPolygon>`, `<curve>`, `<circle>`; `<equilibriumCurve>` (minus `lineStyle`, same reason).

    Cross-category use is a schema error: `<point lineWidth="3">` and `<line markerStyle="square">` are now rejected.

    **New attribute `markerFilled`** (boolean, default `true`) toggles filled vs. open marker rendering on `<point>`; no-op for `markerStyle="cross"` / `"plus"`.

    **Exclusions.** Color attributes (`*Color`, `*ColorDarkMode`, `*ColorWord`) and the contrast-feeding opacities (`lineOpacity`, `markerOpacity`) stay `<styleDefinition>`-only so the per-styleNumber WCAG contrast diagnostics remain authoritative. `fillOpacity` is contrast-irrelevant and overridable. `*Word` descriptors (`markerStyleWord`, `lineStyleWord`, `lineWidthWord`) are derived from the underlying value rather than independently overridable — overriding `lineWidth=2` re-derives `lineWidthWord=""` even when a `<styleDefinition>` shipped a custom `"hairline"`, since a stale descriptor next to a different value would mislead.

    **Schema.** `markerStyle` and `lineStyle` are now keyword/enum attributes with autocomplete (case-insensitive): `markerStyle` ∈ {circle, square, triangle, triangleUp/Down/Left/Right, diamond, cross, plus}; `lineStyle` ∈ {solid, dashed, dotted}. Both the override path and the `<styleDefinition>` path forward the same enum metadata.

- 6ae802f: Add PreFigure rendering support for `<regionBetweenCurves>`. The region is emitted as a PreFigure `<area-between-curves>` element with `<definition>` elements registering each child function in the PreFigure namespace; previously the component rendered blank under the PreFigure renderer.

    Only formula-typed child functions and unflipped axes are supported in this initial pass. `flipFunctions="true"` and non-formula function children (interpolated, bezier, piecewise) emit a warning and are skipped.

    Closes #1203.

- f8015c0: Retry transient dynamic-import failures when loading viewer renderers, and fall back to an inline error placeholder if the import still fails after retries.

    The viewer loads renderer modules via a per-renderer dynamic `import()` in `DocViewer` and `useDoenetRenderer`. Under Cypress component-test runs, Vite's dev server occasionally rejects one of these in-flight chunk fetches with `Failed to fetch dynamically imported module` — most often `section.tsx` or `math.tsx`, the renderers most specs load on demand. Because the existing call sites attached no handler to the per-renderer promise (the loader awaited them serially, so a later promise could reject before any handler was attached), the rejection bubbled to `window` and Cypress failed the spec under its default `uncaught:exception` policy. In production the same rejection on a real network blip would silently leave an empty space where the renderer should be.

    The fix passes loader factories into `renderersLoadComponent` instead of pre-started promises, retries each load up to three times with exponential backoff on the transient error phrasings the browsers emit (`Failed to fetch dynamically imported module`, `Importing a module script failed`, `error loading dynamically imported module`), and — if a renderer ultimately fails to load — substitutes a small `RendererLoadFailed` placeholder so the surrounding document still mounts and no unhandled rejection escapes. See issue #1190.

- 970b92b: Surface state-variable defaults to attributes in the schema, and render math-expression defaults through MathJax.
    - Attributes whose resting value lives on a state variable rather than the attribute declaration (e.g. `padZeros`, `displayDigits`, `displayDecimals`, `displaySmallAsZero`, `avoidScientificNotation`) now carry their effective `defaultValue` in the schema, so the reference documentation and the editor's context-sensitive help panel show it. `BaseComponent.returnStateVariableInfo` surfaces each state def's `hasEssential` + `defaultValue` pair, and `get-schema.ts` falls back to that when an attribute does not declare its own default.
    - Math-expression defaults (e.g. the `<math>` `assumptions` attribute, which defaults to `me.fromAst("＿")`) are encoded as a `{ type: "math", latex }` sentinel instead of the opaque `{ objectType: "math-expression", tree }` JSON dump. The docs reference pages and the editor's context-help panel both render the sentinel through MathJax, so the LaTeX appears typeset rather than as a serialized object.

- 475effb: Editor: surface autocomplete and context-sensitive help for `$s.t` shorthand on the select family when the count attribute is absent or literal `"1"`.

    Before this change the autocomplete dropdown and the help panel both treated `<select>` (and its siblings `selectFromSequence`, `selectRandomNumbers`, `selectPrimeNumbers`, `samplePrimeNumbers`, `sampleRandomNumbers`) as `takesIndex` composites whose descendants are only addressable via `$s[1].t`. The runtime already resolves `$s.t` like `$s[1].t` when the composite produces a single replacement (Select.js wraps each chosen option's serialized contents in a `<group>`, and group children propagate names to the parent's name_map), so authors with `numToSelect="1"` (the default) were correctly typing `$s.t` and getting no editor help despite the runtime accepting it.

    The rule is a strict textual DAST check: the shorthand applies iff the count attribute is absent OR its source text, trimmed, equals exactly `"1"`. `numToSelect="$n"` (dynamic, even when `$n` evaluates to 1), `"01"`, `"1.0"`, `"One"`, and `"2"` deliberately do NOT qualify — authors who need shorthand with dynamic count write `$s[1].t` explicitly. Attribute names are matched case-insensitively to mirror the worker (so `<select NumToSelect="2">` is correctly rejected, not silently treated as "attribute absent" — the worker accepts mixed-case attributes via its lowercase-mapping pass). Element names are not case-insensitive at the worker (`<SELECT>` is rejected as an invalid component type), but the predicate lowercases them too as harmless LSP defensiveness. Both the autocomplete and the context-help layers read from the same resolver-adapter output for a given DAST node, so they cannot diverge on whether to surface the shorthand on a given source.

    Behaviour:
    - `$s.t` (with `numToSelect` absent or `"1"`, possibly whitespace-padded) now offers descendant completions and renders the same `refName` help payload as `$s[1].t`.
    - `$s.numToSelect` (and other composite-own properties) still completes and shows property help — the shorthand commits to descendant resolution only. `$s[1].numToSelect` continues to surface nothing, since with an authored bracket the cursor is on the replacement (which has no `numToSelect` property), matching how the worker resolver behaves.
    - `$s.t` with `numToSelect="2"` / `"$n"` / non-canonical literals continues to surface no descendants and no help, matching today's runtime: the author must write `$s[1].t`.

    Each select-family member reads its real count attribute (`numToSelect` for the four `select*` tags, `numSamples` for the two `sample*` tags) — the shared `SELECT_FAMILY_COUNT_ATTRIBUTE` table is the single source so the predicate stays consistent across layers.

    Closes #1181.

- 2865d08: Make accessibility diagnostics less intrusive in the editor. The squiggle now covers only the opening tag (`<graph`, `<image`, …) instead of the entire multi-line element, so the hover popup no longer follows the cursor across an element's body. The squiggle and tooltip are restyled to a dotted purple to read as advisory rather than as a hard error, and a new "Show accessibility diagnostics in editor" toggle on the accessibility report tab lets authors silence the editor squiggles while still seeing the issues in the report and status button.
- 28244d2: The editor's context-help panel for style attributes — per-component overrides like `<point markerStyle="…">` and attributes inside a `<styleDefinition>` — now surfaces an **Active default** row in addition to the schema's static **Default**. The value is what `selectedStyle` resolves to at the cursor's scope: the in-scope `<styleDefinition>` blocks run through the same merge and per-block derivation passes the worker applies at runtime, including the built-in numbered presets as the seed. Annotated with the styleNumber the value came from.

    Inside a `<styleDefinition>`, the active default excludes the queried attribute from the current block so authors see what their _peers_ (other styleDefinition siblings) and the built-in preset would contribute for that styleNumber. This makes it obvious whether you're starting a new styleNumber from the preset or layering onto an existing definition.

    Resolution is fully static — no worker round-trip, no extra cache invalidation. Dynamic `styleNumber` (e.g. `styleNumber="$n"`) falls back to the styleNumber=1 preset since the LSP doesn't evaluate macros — same trade-off the issue calls out.

- 7b7a521: Editor: the context-help panel now surfaces the full **Resolved style** breakdown for the active styleNumber, building on the per-attribute "Active default" row added in #1200.

    Triggers:
    - Cursor on the `styleNumber` attribute of a graphical component — the breakdown is filtered to the style key prefixes the component declares (marker* for `<point>`, line* for `<line>` / `<vector>` / `<ray>` / `<lineSegment>` / `<polyline>` / `<parabola>`, line* + fill* for `<polygon>` / `<curve>`). Color attributes for each detected prefix come along even though they're `<styleDefinition>`-only (no per-component override), since the issue asks for "style attributes that are relevant for the component" rather than just the override surface.
    - Cursor on any attribute inside a `<styleDefinition>` — the breakdown lists every populated style key for the active styleNumber, since the author is editing the styleDefinition itself.
    - Cursor on a `<styleDefinition>` tag name itself (opening or closing) — the breakdown is shown alongside the element description, so landing on the tag is as useful as landing on any of its attributes.

    The breakdown reflects ancestor `<styleDefinition>` blocks and runtime per-block derivation (`addMissingChildStyleColorFields` / `deriveMissingStyleWords`), so what the panel shows is what the runtime will render. Color values are paired with their derived word and painted in the resolved color, matching the "Active default" row.

    Resolution remains fully static — no worker round-trip. Dynamic `styleNumber` (e.g. `styleNumber="$n"`) falls back to styleNumber=1, same trade-off the existing active-default surface accepts.

    Closes #1204.

- 19905b6: Propagate `styleNumber` from a composite (e.g. `<group>`) to the components it creates, and make the nearest setting win.

    Setting `styleNumber` on a `<group>` previously had no effect on the members inside it — they rendered with the default style — because `styleNumber` only inherited from the rendered parent, and a group's members are reparented out of the group into its container. Members now also fall back to the `styleNumber` of the composite that created them.

    Relatedly, when an attribute can inherit from both a parent and a source composite, the **source composite (the innermost authored wrapper) now wins over the parent**. This makes a `<group styleNumber="4">` behave like the nearest container: in `<graph styleNumber="5"><group styleNumber="4">…</group></graph>` the grouped points are style 4, and a loose point alongside them is style 5 — the same result you get from a `<graph styleNumber="4">` nested in a `<section styleNumber="5">`, so authors don't have to know which components are composites. Extending such a graph (`<graph extend="$g" styleNumber="2" />`) re-resolves each member in its new context: a loose point picks up the new `2`, while grouped points keep the group's `4`.

    An explicit `styleNumber` on a member still wins over everything. The new precedence also applies to the other attributes that already used both fall-backs (`<math>`/`<mathList>` `functionSymbols`, `splitSymbols`, `referencesAreFunctionSymbols`), where a wrapping list composite now likewise takes precedence over a more distant containing element.

- f16dd18: `<subsetOfRealsInput>` improvements:
    - Propagate the input's `variable` through `extend`. Previously, `<subsetOfReals extend="$input" displayMode="inequalities" />` ignored the input's variable and rendered with the `<subsetOfReals>` default `x`. The `subsetValue` shadowing instructions now include the `variable` attribute, matching the pattern `<mathInput>` uses for its number-display attributes.
    - Hide attributes that the renderer currently ignores from the generated schema (`xMin`, `xMax`, `width`, `height`, `dx`, `xlabel`) via `excludeFromSchema: true` so they no longer appear in autocomplete or auto-generated docs. The attributes remain on the class — this is a documentation/schema cleanup, not a behavior change for documents that already set them.
    - Add the long-missing reference page at `packages/docs-nextra/pages/reference/subsetOfRealsInput.mdx`, with a regression test exercising the variable-shadowing fix and an updated alphabetical-index entry.

- 6aa7fdf: Upgrade `math-expressions` to `2.0.0-alpha92`.

    This fixes a bug where `simplify` did not fully simplify an nth root: given positivity assumptions, `nthroot(a^7*b^6*c^28, 5)` failed to pull the `a` and `b` factors out of the fifth root (only `c^5` was extracted). It now simplifies to `a*b*c^5 * nthroot(a^2*b*c^3, 5)`.

- 8cde20e: Upgrade `math-expressions` to `2.0.0-alpha93`.

    This adds support for the plus-minus operator: `\pm` in the LaTeX parser and the `±` symbol in the text parser. For example, `<math format="latex">\pm \sqrt{x}</math>` now parses instead of rendering blank.

- 535c7dd: Surface variant-time validation messages as `info` diagnostics instead of writing them to the browser console. When a document can't compute unique variants (e.g. a `<select>` with `selectWeight` or `selectForVariants`, a `<selectFromSequence>` with non-integer `numToSelect`, or a `requestedVariantIndex` that isn't a finite integer), the explanation now appears in the editor's diagnostics panel and flows through `diagnosticsSummaryCallback` / `setDiagnosticsCallback` like any other info record, rather than being dropped into `console.log` where authors couldn't see it. The `<select>` component's messages also no longer claim to be from `selectFromSequence`.
- 8d5e174: Stop loading the YouTube IFrame API at viewer/editor startup. The `https://www.youtube.com/iframe_api` script is now injected lazily — only when a `<video>` component with a `youtube` attribute actually renders. Documents that contain no YouTube videos make no network request to youtube.com.

## 0.7.17

### Patch Changes

- 25c28ed: Every enumerated attribute value now ships with a description that flows into editor autocomplete and the context-help panel. The `ValidValueEntry` type requires `description`, and bare-string `validValues` entries are no longer accepted. Pure boolean primitives no longer render an "Allowed values" row in the help panel (autocomplete for `true`/`false` is unchanged).
- 87318b9: Support per-value descriptions on enumerated attribute values. Each entry of an attribute's `validValues` can now be declared as `{value, description}` instead of a bare string; the description flows through schema generation into editor autocomplete (as the completion item's documentation tooltip) and into the context-sensitive help panel (as a definition list under "Allowed values"). Both shapes remain accepted so components can migrate gradually. Schema and help surfaces preserve the casing the author wrote — `toLowerCase` continues to govern only runtime case-insensitive matching, not how values are displayed. Migrated `<video>` (`size`, `displayMode`, `horizontalAlign`), `<slider>` (`type`), `<answer>` (`simplifyOnCompare`), and `<award>` (`simplifyOnCompare`) as worked examples.
- c62a1b7: Open attribute-value autocomplete immediately after typing `=`. The completion menu now appears with the canonical quoted form in the dropdown (e.g. `"full"`) while still matching on the bare value — so typing `<math simplify=` and picking `"full"` produces `<math simplify="full"`. Typing a partial value right after `=` without a quote (e.g. `<math simplify=ful`) filters the menu and replaces the typed prefix with the fully quoted value on selection. When the author types `"` first, dropdown items display without surrounding quotes since they are already in the source. For free-text attributes that have no enumerated values (e.g. `name`), typing a bare prefix after `=` (e.g. `<aa name=foo`) now offers a single `"foo"` hint that wraps the typed value in quotes on acceptance — an expert who types `"` first sees no menu.
- 3ae54ac: Show schema descriptions in autocomplete. Component-type, attribute, and property completions now display the same component summaries and attribute/property descriptions used by the context-sensitive help panel. Bare `$name` ref completions show `(<type>, line N)` as detail (matching CodeMirror's gutter) and the referent's component summary as documentation, making it easy to disambiguate names that shadow each other. Alias-aware: a `<row>` inside `<matrix>` pulls its docs from the `matrixRow` aliased entry, mirroring the help panel.

    Schema description text now renders inline markdown in both surfaces. Authors writing `componentDocs.summary` or attribute/property descriptions can use `` `code` `` (e.g. `` `<answer>` ``), `*em*`, and `**strong**`; these render as `<code>`/`<em>`/`<strong>` in the autocomplete info popup and the help panel. Anything else is emitted as literal text. Component summaries that previously contained bare `<tag>` references have been updated to use backtick-quoted form for proper rendering.

- ac1ab81: Extend the editor's context-sensitive help panel to cover ref names. When the cursor is on a bare `$name` or on the segment of a member ref that resolves to a named child element (e.g. `$sec.bi` where `<section name="sec"><booleanInput name="bi"/></section>`), the panel now shows a sentence-form line — `$sec.bi references <booleanInput> on line 1.` — followed by the target component's summary and a link to its reference page. Descendants take precedence over same-named properties, matching runtime ref-resolution rules. AST-only resolution: repeat-introduced names (`valueName`/`indexName`) and multi-part chains beyond two segments still need the Rust resolver and remain tracked in #1086.
- d32a6da: Add a context-sensitive help tab to the editor's diagnostics panel. When the cursor is on a component, attribute, or `$ref.property`, the panel shows the relevant description and a link to the corresponding `/reference/<slug>` docs page. Components can override the slug via `componentDocs.docsSlug` (or set it to `null` to suppress the link), and parents can redirect sugar-rewritten children via `componentDocs.childAliases` so e.g. `<row>` inside `<matrix>` shows `<matrixRow>`'s help. Adds a new `docsURL` prop on `DoenetEditor` (default `https://docs.doenet.org`) so embedding apps can point at staging or local docs builds.
- cddfe34: `diagnosticsSummaryCallback` on `DoenetEditor` and `setDiagnosticsCallback` on `DoenetViewer` now receive a second argument, `doenetML`, containing the source string the viewer was rendering when those diagnostics were produced. Consumers can use this to correlate diagnostics with the document version that triggered them rather than the (potentially newer) editor buffer. Existing single-argument consumers remain valid — passing a callback with fewer parameters than the declared signature is still allowed by TypeScript.
- 44ec6cc: Fix `diagnosticsSummaryCallback` in `DoenetEditor` to fire once per diagnostics update, including when the counts are unchanged. Previously the effect was keyed off a memoized counts object, so a viewer re-run that produced the same counts would silently skip the callback. Inline callbacks are now tracked through a ref so they don't refire the effect on every parent render, and `initialDiagnostics` defaults to a stable reference so unrelated parent re-renders don't refire downstream memos and effects.
- 9650a0f: Replace `isAccessibleCallback` with `diagnosticsSummaryCallback` in `DoenetEditor`. The new callback receives an object with counts for `warningsCount`, `errorsCount`, `infosCount`, `accessibilityLevel1Count`, and `accessibilityLevel2Count` instead of a single boolean. The callback is only invoked after diagnostics have been received from the viewer.
- d3c3e43: Add programmatic control of the `<DoenetEditor>` diagnostics/responses panel:
    - New `initialOpenTab` prop opens the panel on the given tab when the editor mounts. Valid IDs: `"errors" | "warnings" | "info" | "accessibility" | "responses"`.
    - `<DoenetEditor>` now accepts a `ref` exposing a `DoenetEditorHandle` with `openDiagnosticsTab(tabId)` and `closeDiagnosticsPanel()` for runtime control.
    - The iframe wrapper (`@doenet/doenetml-iframe`) supports the same prop and ref handle, with calls made before the iframe finishes loading queued and replayed on ready.

- 0f7357d: Exclude properties derived from `excludeFromSchema` attributes. When an attribute is marked `excludeFromSchema: true` and creates a companion state variable via `createStateVariable`, that state variable is now also excluded from the schema. This stops `collaborateGroups`, `modifyIndirectly`, and `permid` from leaking into autocomplete and context-help despite their backing attributes already being hidden. Tracked in #1089.
- feae758: Improve list-item first-child alignment for section/task/problem-style numbering when content starts with block renderers.

    This update standardizes list-item alignment signals across block components, updates section and sideBySide rendering to top-align numbering with block-first content, and adds Cypress coverage for the new behavior (including answer and choiceInput cases).

- f20f4d0: `DoenetEditorHandle` (the imperative ref handle on `<DoenetEditor>`) now exposes `updateRenderedView()`, the programmatic equivalent of clicking the editor's "Update" button. Consumers can call it before reading diagnostics to flush any pending edits from the editor buffer to the viewer, ensuring the next `diagnosticsSummaryCallback` reflects the current source rather than stale state. The method is a no-op when there is nothing to update (matching the visually-disabled button), and warns when invoked with `showViewer={false}`. The new method is plumbed through `@doenet/standalone`'s `renderDoenetEditorToContainer` handle and across the `@doenet/doenetml-iframe` ComLink boundary, including the same queue-and-replay treatment used for the existing `openDiagnosticsTab` / `closeDiagnosticsPanel` methods.
- 79c7d37: Stabilize `<DoenetEditor>` callback identity. The `doenetmlChangeCallback`, `immediateDoenetmlChangeCallback`, and `documentStructureCallback` props are now routed through ref mirrors, so the editor's internal `useCallback` hooks (and the imperative handle exposed via `ref`) no longer churn when consumers pass inline arrow functions. Also fixes a stale-closure bug where the unmount cleanup could fire the original `doenetmlChangeCallback` instead of the latest one.
- c2248b4: Fix `<video>` with a YouTube source so the player reloads correctly when the YouTube id changes (for example when `youtube` is bound to a `choiceInput` or any reactive value), and so the player initializes once the YouTube IFrame API finishes loading. Previously the new video silently failed to load and stale internal timers could throw against the destroyed player.

## 0.7.16

### Patch Changes

- bbd2c4f: Fix `sort` and `shuffle` sugar handling when type information is missing or invalid, and improve diagnostics for mixed string/component children.
    - Fall back to `math` (with warning diagnostics) when `type` is invalid.
    - When `type` is omitted, do not apply sugar; instead, if a string child exists, emit warnings telling authors to specify a `type` attribute.
    - Ignore string children in mixed-content cases with explicit warning diagnostics.
    - Add test coverage for the fallback and diagnostics behavior.

- 84e3472: Introduce a new `avoidScientificNotation` number-display attribute and ensure
  number-display settings are applied consistently across worker and viewer
  rendering.
    - Add `avoidScientificNotation` support to core number/math formatting behavior in the worker.
    - Apply number-display parameters consistently through related formatted outputs (including line/function/point/vector/angle/piecewise/ODE displays).
    - Wire number-display formatting through graph controls worker payloads and viewer parsing/model logic so display settings are respected end-to-end.
    - Update generated schema output so inherited number-display attributes are available consistently.
    - Add worker and viewer test coverage for the new/updated display behavior.

## 0.7.15

### Patch Changes

- 2c02091: Generalize point slider controls into an `addControls` feature with graph-level modes. Replace the boolean `addSliders` attribute with `addControls` text attribute supporting `all`, `slidersOnly`, `inputsOnly`, and `none`. Rename the per-point `addSliders` attribute to `addControls` while preserving point-level options (`both`, `xOnly`, `yOnly`, `none`).

    New capabilities in `all` mode: sliders are paired with editable inline axis inputs in their labels, allowing users to both drag and type to adjust coordinates.

    New `inputsOnly` mode: pure text input controls where users can enter single values or ordered pairs, validated as math expressions before committing.

    Authors can now choose the control interaction style that best fits their pedagogical goals: traditional sliders, text input boxes, or a hybrid combining both.

- 3efdb48: Fix a graph controls regression that affected consecutive regularPolygon center moves. Dependency change flags are now preserved during inverse-definition argument construction and then consumed afterward to prevent stale flags from affecting follow-up center moves and restore-state flows.
- 6589ddc: Add graph controls for circles, line segments, and vectors. When `addControls` is enabled on a `<graph>`, circles expose controls for center and radius, line segments expose controls for their two endpoints, and vectors expose controls for their tail and displacement (or head).
- 4bfe856: Add collapsible graph control cards to reduce long scrolling in control-heavy graphs. By default, the first two controls are expanded and remaining controls are collapsed, with consistent behavior across default and prefigure renderers. Each card now has an accessible disclosure button with keyboard support and ARIA semantics.
- be4ff47: Improve graph controls ordering across control types. Controls now follow descendant order by default (instead of rendering grouped by type), and graphical controls support a new `controlOrder` attribute to request an earlier or later position in the controls list. `controlOrder` uses 1-indexed slot semantics: the renderer fills slots 1, 2, 3, ... with the lowest matching control order in each slot, uses `controlOrder=0` controls to fill gaps between positive orders, then places remaining higher orders at the end. A value of `0` (default) has no fixed position; such controls are grouped for gap-filling and do not preserve authored order relative to controls with positive `controlOrder` values.
- 86b0356: Make graph point controls renderer-agnostic by moving controls UI/logic out of the Prefigure renderer into `GraphControls`.

    Controls now appear consistently regardless of graph renderer selection, while preserving `addControls` graph/point mode behavior (`all`, `slidersOnly`, `inputsOnly`, `none`; and `both`, `xOnly`, `yOnly`, `none`).

    This also removes duplicated controls code from `prefigure.tsx` and keeps Prefigure focused on prefigure runtime/render concerns.

- 8ab58a5: Add graph controls for polygons, triangles, regular polygons, and rectangles. When `addControls` is enabled on a `<graph>`, polygons and triangles can expose center controls, regular polygons can expose center and radius controls, and rectangles can expose center, width, and height controls based on their `addControls` mode and draggable settings.
- 0d7e316: Add center state-variable support for polylines, polygons and triangles in the worker layer.
    - Polyline now exposes a public renderer-facing center location computed from the average of vertex coordinates, with symbolic math support for derived polygon and triangle components.
    - Polyline now supports a semantic center-move action that polygon center movement delegates to through the shared base implementation.
    - Triangle now supports moveTriangleCenter by delegating to the shared polygon/polyline center movement behavior.
    - Add targeted worker tests covering polygon center computation, symbolic center behavior, center-driven translation, constrained center-driven translation, and triangle center movement.

- ae3d871: Fix PreFigure curve rendering for implicit-multiplication expressions. Functions like `(x-2)(x-5)` or `3x` now render correctly in the PreFigure renderer; previously these produced invalid formula strings that the PreFigure parser dropped silently.
- 665f4b1: Add `sliderPosition` support for PreFigure point sliders. Authors can now place sliders on the `left`, `right`, `top`, or `bottom` of the graph, with `left` as the default. Side placements responsively fall back to `top` or `bottom` on narrow layouts, and keyboard focus now lands on the graph itself before the sliders so PreFigure annotations remain accessible.
- f506092: Suppress implicit PreFigure accessibility annotations when authors do not provide an `<annotations>` block. We now emit an empty `<annotations>` container in generated PreFigure XML and only initialize `diagcess` when authored annotations are present, preventing unintended auto-generated annotation text from appearing.
- 9bfb8c3: Fix responsive styling of input boxes in graph controls. Input boxes now properly shrink to fit available space when the screen width decreases, both for `addControls="all"` and `addControls="inputsOnly"` modes, including scalar controls and point controls.

## 0.7.14

### Patch Changes

- 6efb167: Add a dynamic `annotations-skeleton` autocomplete snippet for prefigure graphs.

    When authoring inside a `<graph renderer="prefigure">`, autocomplete now offers `annotations-skeleton`, which inserts an `<annotations>` tree derived from authored graphical descendants. The generated author-facing annotation text now covers supported prefigure graphical component types (including authored `<function>`), uses explicit coordinate labels where appropriate for accessibility, and includes guidance when a referenced graphical component is unnamed.

    This change also aligns Ray coordinate aliases with generated annotation references by supporting `.endpoint.x/.y/.z` and `.through.x/.y/.z` access patterns in core state variables.

- a0f76aa: Fix PreFigure annotation refs that target functions in graphs. An annotation like `<annotation ref="$f" />` now resolves when `f` is a `<function>` rendered via an adapted `<curve>`, while preserving existing behavior and warnings for invalid or out-of-graph refs.
- 0c67635: Add initial PreFigure rendering support for `<curve>` elements.

    It adds conversion for function, parameterized, and bezier curves, and includes support for piecewise and interpolated function definitions (including piecewise children that are interpolated). It also adds diagnostics for unsupported curve definitions.

- fd1f9ec: Update the default PreFigure runtime pins used by the viewer.

    The published Doenet packages now default to `@doenet/prefigure@0.5.15` and
    `diagcess@1.4.1` for PreFigure rendering, aligning the built-in CDN defaults
    with the latest synchronized PreFigure runtime update.

- 552d4b3: Fix LSP schema validation and autocomplete for enum attributes that also support boolean aliases.

    Attributes like `simplify`, `simplifyOnCompare`, `addSliders`, and `sort` now accept presence form and explicit `"true"`/`"false"` without warnings, while autocomplete continues to prioritize the author-facing enum values.

- 7436aa7: Add Phase 1 PreFigure point sliders with graph- and point-level control.

    When using `<graph renderer="prefigure" addSliders>`, draggable points can now render coordinate sliders below the graph. Authors can control slider behavior per point with a new `<point addSliders="none|both|xOnly|yOnly">` attribute (default `both`). Slider labels follow point display rounding settings, including padded zero formatting, and constrained points snap to valid values on release.

- 90204e9: Fix PreFigure renderer so local WASM readiness cancels slow or failed service fallback.

    When the local WASM runtime is not yet warm, the renderer previously committed exclusively to the remote build service. Two flaws resulted: if the service failed the diagram was never rendered, and if WASM became ready during a slow service call the renderer still waited for the network round-trip.

    Both issues are resolved by racing the service request and the local warmup in parallel. When the WASM runtime becomes ready first, the in-flight service request is aborted and the diagram is compiled locally. When the service responds first its result is used immediately (existing behavior). If the service fails but warmup later succeeds, the diagram is still rendered locally instead of showing an error.

- f4ff6fd: Replace `sortResults` boolean attribute with `sort` text attribute for `selectFromSequence` and `selectPrimeNumbers` components. The new `sort` attribute accepts three values: "unsorted", "increasing", and "decreasing". Backward compatibility is maintained through deprecation shims that automatically convert `sort="true"` to `sort="increasing"` and `sort="false"` to `sort="unsorted"`.

## 0.7.13

### Patch Changes

- 75725e5: Improve DoenetML editor autocomplete for references.

    The editor now suggests in-scope names after `$`, offers descendant names and
    properties after `.` on references, and handles completion reopening more
    reliably while typing, deleting, and accepting completions.

- 66d0ddb: Add isAccessibleCallback feature to EditorViewer
- e604d76: expose schemaSubarrays-derived properties in generated Doenet schema to improve documentation
- 544c619: Add graph attributes to control axis tick visibility.

    Graphs now support `displayXAxisTicks` and `displayYAxisTicks`. Tick labels inherit from the corresponding tick visibility setting unless `displayXAxisTickLabels` or `displayYAxisTickLabels` is explicitly specified.

- b380ebc: Improve reference autocomplete behavior by wiring Rust-backed resolver logic and fixing completion visibility/index handling.

    This includes better scope filtering for names, indexed reference completions for takesIndex components, and repeat synthetic name support in autocomplete flows.

- 9ad3a40: Change `<selectPrimeNumbers>` and `<samplePrimeNumbers>` attributes from `minValue`/`maxValue` to `from`/`to`, and add deprecation shims for the old attributes.
- ec9b81f: connect external labels to inputs and answers with `for` attributes

## 0.7.12

### Patch Changes

- 3834b7f: Add DoenetML graph annotation support for PreFigure-rendered graphs.

    This adds conversion of nested graph annotations to PreFigure XML and improves related diagnostics and annotation handling.
