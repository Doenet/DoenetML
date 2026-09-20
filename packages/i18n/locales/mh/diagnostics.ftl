# Marshallese (Kajin M̧ajeļ) diagnostics: the errors and warnings the worker
# produces and the reader or author sees. Selected by `uiLocale`. Translated
# from `locales/en/diagnostics.ftl`, which is the source of truth: `lint:i18n`
# rejects a key that does not exist there, and reports a key that exists
# there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Orthography, number, gender and word order are set out in `chrome.ftl`'s
# header and hold here unchanged: the standard "new" spelling with `ļ`, `ņ`,
# `m̧`, `n̄` and `o̧` as letters rather than as accents; **no grammatical
# gender**, so nothing forks on `$gender`; **no number on a noun after a
# numeral**, so nothing here writes a plural branch; and a describing word
# **after** the noun it describes. The `noun` table in `content.ftl` is
# canonical for vocabulary and this file follows it.
#
# ## Counting, and why almost every count here is unselected
#
# English forks eight of these messages on a count, and in every one of them
# the two branches differ only in an English verb (`is`/`are`) or in an
# English plural `-s`. Marshallese marks neither: «juon attribute» and «jiljino
# attribute» hold the same noun, and «ejjab kōjerbale» serves whatever the
# count is. So those eight are written here as **one unselected sentence**
# that still prints `{ $count }` and its relatives — the `locales/sm` shape,
# and the shape the batch's four other Micronesian catalogs (`chk`, `pon`,
# `kos`, `gil`) take for the same reason. `Intl.PluralRules("mh")` has no CLDR
# data in any case and resolves against the runtime's default locale, so a
# `[one]` branch here would be a branch nothing could reliably select.
#
# `field-function-wrong-num-outputs` is the exception, and it is not about
# number: one output and two outputs are two different *sentences* there — a
# slope against a vector — so the fork is kept. It is written as the explicit
# literal **`[1]`** rather than `[one]`, because `$expected` is a number and a
# digit literal is matched numerically and is always safe. That is the one
# place in these four files where a numeric select survives.
#
# ## Inclusive and exclusive "we"
#
# Marshallese distinguishes the two — «kōj»/«jej» against «kōm»/«kōmij» — and
# a translator normally has to choose. **No message in the English catalog
# says "we"** (this was checked across all four English files, not assumed):
# every sentence here is either impersonal or addressed to «kwe». So the
# distinction never arises, and no message below makes a choice a reviewer
# would have to second-guess. If a future message does say "we", it will be
# the reader and the program together, and the inclusive «jej» is what that
# means.
#
# ## What stays in English, and why it is not laziness
#
# Two layers of English survive in this file.
#
# The first is required: `through`, `endpoint`, `midpointOffset`,
# `numDimensions`, `symbolicEquality`, every tag in angle brackets and every
# attribute in backticks are **DoenetML source**, not prose. They are left
# exactly as written, as the English file's own note demands.
#
# The second is a judgement, and a reviewer may overturn it. The **terms of
# art of the editing language itself** — `component`, `attribute`, `variant`,
# `state variable`, `prop`, `reference`, `type`, `value`, `sequence`,
# `domain`, `index`, `list`, `graph`, `style`, `output`, `input`, `default` —
# are kept in English inside otherwise Marshallese sentences. The reason is
# the one `content.ftl` gives for leaving `function` and `polygon` alone: an
# author who meets these words in Doenet meets them in Doenet's own
# documentation, which exists only in English, and a coined Marshallese word
# here would be a word they then had to un-learn to read anything else. Where
# the word is ordinary prose rather than a term of art it is translated —
# «laain» for a line, «poin̄» for a point, «doulul» for a circle, «kona» for
# an angle or a corner, «peba» for a document, «uwaak» for a response — and
# the boundary between the two is the thing to check.
#
# Three loans are written in Marshallese spelling rather than left in English:
# «dimenjen» (dimension), «intervōl» (interval, as in `chrome.ftl`) and
# «parapola» (parabola, as in `content.ftl`).
#
# ## Frames this file uses, so that one English phrase is one Marshallese one
#
#   «X ejjab jim̧we»        X is invalid
#   «Ejjab kōjerbal X»      X is ignored / is not used
#   «Ejjab maro̧n̄ …»        cannot …
#   «Ejjan̄in kōm̧m̧ane …»   has not been implemented
#   «… ej aikuj …»          … must …
#   «kōn ke …»              because …, which opens its clause in Marshallese
#                           and so lands where English puts it. That is worth
#                           saying: `locales/kca` and `locales/mns` had to
#                           split such sentences in two because their causal
#                           marker follows the clause. Marshallese does not
#                           have that problem.
#   «em̧ōj kwaļo̧k X»        X was specified
#   «ejjeļo̧k»               there is none / empty
#
# «Kajin Pālle» is Marshallese for the English language and is used in
# `pluralize-english-only`.
#
# ## Coinages a speaker should check first
#
#   «maro̧n̄ in tōpar»       accessibility — as in `chrome.ftl` and
#                            `editor.ftl`; one coinage, three files
#   «kōmeļeļe kadu»         short description
#   «variant ko rej make    unique variants, literally "variants that are
#    iaer»                   each their own"
#   «ej jako ļo̧k»           is deprecated, literally "is going away"
#   «oktak in color»        contrast, literally "the difference of colour"
#   «nejin»                 a child component. Marshallese «nejin» is *its
#                            offspring*, which is exactly the metaphor the
#                            English word is, and it is used throughout.


## `<lineSegment>`

# The English forks on `$attributesCount` only to move between "is" and
# "are". Marshallese has neither, so one sentence serves both.
line-segment-attributes-ignored-with-endpoints = Ejjab kōjerbal { $attributes } n̄e em̧ōj kwaļo̧k ruo endpoint

line-segment-attributes-ignored-with-endpoint-and-midpoint = Ejjab kōjerbal { $attributes } n̄e em̧ōj kwaļo̧k juon endpoint im juon midpoint

line-segment-midpoint-offset-without-midpoint = Ejjeļo̧k tokjān midpointOffset n̄e ejjeļo̧k midpoint

## `<line>`

line-points-undetermined-dimensions = Laain eo ej deblo̧k poin̄ ko me ejjab alikkar dimenjen ko aer.

line-points-too-few-dimensions = Laain eo ej aikuj deblo̧k poin̄ ko ewōr ruo ak eļapļo̧k dimenjen ippāer.

line-points-depend-on-variables = Laain eo ej deblo̧k poin̄ ko me rej pedped ioon variable kein: { $variables }.

line-equation-invalid-format = Wāween equation in laain ilo variable { $variable1 } im { $variable2 } ejjab jim̧we.

## `<ray>`

ray-overprescribed-through = Em̧ōj kwaļo̧k reey eo kōn through, endpoint, im direction. Ejjab kōjerbal through eo em̧ōj kwaļo̧ke.

ray-dimension-mismatch = Ejjab errā numDimensions ilo reey eo.

## `<vector>`

vector-overprescribed-head = Em̧ōj kwaļo̧k pektōr eo kōn head, tail, im displacement. Ejjab kōjerbal head eo em̧ōj kwaļo̧ke.

vector-dimension-mismatch = Ejjab errā numDimensions ilo pektōr eo.

## Attracting and constraining

attract-to-without-nearest-point = Ejjab maro̧n̄ kanōk n̄an juon `<{ $component }>` kōn ke ejjeļo̧k an nearestPoint state variable.

constrain-to-without-nearest-point = Ejjab maro̧n̄ dāpij n̄an juon `<{ $component }>` kōn ke ejjeļo̧k an nearestPoint state variable.

constrain-to-interior-without-nearest-point = Ejjab maro̧n̄ dāpij n̄an lowaan juon `<{ $component }>` kōn ke ejjeļo̧k an nearestPoint state variable.

## `<choiceInput>`

choice-input-label-position-ignored = Ejjab kōjerbal labelPosition n̄an juon choiceInput ejjab inline

## Ordering children by index

choice-input-indices-count-mismatch = Ejjab kōjerbal indices ko em̧ōj kwaļo̧ki n̄an choiceInput kōn ke oran indices ejjab jon̄an oran choice ko nejin.

pretzel-indices-count-mismatch = Ejjab kōjerbal indices ko em̧ōj kwaļo̧ki n̄an problem kōn ke oran indices ejjab jon̄an oran problem ko nejin.

shuffle-indices-count-mismatch = Ejjab kōjerbal indices ko em̧ōj kwaļo̧ki n̄an shuffle kōn ke oran indices ejjab jon̄an oran component ko.

indices-ignored-out-of-range = Ejjab kōjerbal indices ko em̧ōj kwaļo̧ki n̄an { $component } kōn ke jet iaan indices rej ilikin jon̄an eo.

pretzel-indices-repeated = Ejjab kōjerbal indices ko em̧ōj kwaļo̧ki n̄an pretzel kōn ke jet iaan indices rej bar waļo̧k ruo alen.

pretzel-circuit-first-index = Ejjab kōjerbal indices ko em̧ōj kwaļo̧ki n̄an pretzel ilo circuit mode kōn ke index eo m̧oktata ej aikuj 1.

## `<shuffle>` and `<sort>`

string-children-need-type = N̄an an `<{ $component }>` jerbal ippān string ko nejin, ej aikuj waļo̧k juon `type` attribute.

invalid-type-defaulting-to-math = Type { $type } ejjab jim̧we n̄an component { $component }. Ej aikuj juon iaan math, text, number, ak boolean. Ej oktak n̄an math.

string-not-valid-component-to-arrange = String "{ $value }" ejjab juon component ejim̧we n̄an { $component }. Ejjab kōjerbale.

## Types and variables

invalid-type-defaulting-to-number = Type { $type } ejjab jim̧we, ej likūt type n̄an number.

invalid-variable-value = Value in juon variable ejjab jim̧we: `{ $value }`

## Variants

variant-index-must-be-number = Variant index { $index } ej aikuj juon number

variant-index-must-be-integer = Variant index { $index } ej aikuj juon integer

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` ejjan̄in kōm̧m̧ane n̄an jon̄an absolute. Ej likūt depakpak ko n̄an relative.

side-by-side-absolute-margins = `<{ $component }>` ejjan̄in kōm̧m̧ane n̄an jon̄an absolute. Ej likūt marjin ko n̄an relative.

side-by-side-no-block-child = `<{ $component }>` ejjab jim̧we: ej aikuj wōr juon ak eļapļo̧k block nejin.

## `<label>`

label-for-ignored-on-graphical = Ejjab kōjerbal attribute eo `for` ioon juon `<label>` ej pād ilo juon graph.

label-for-must-resolve-to-one = Attribute eo `for` ioon `<label>` ej aikuj jitōn̄ n̄an juon wōt component.

label-for-unresolved = Attribute eo `for` ioon `<label>` ear jab maro̧n̄ jitōn̄ n̄an juon component.

label-for-answer-with-authored-inputs = Attribute eo `for` ioon `<label>` ej jitōn̄ n̄an juon `<answer>` ewōr input ko em̧ōj je er ippān; jitōn̄ n̄an input eo make.

label-for-answer-without-input = Attribute eo `for` ioon `<label>` ej jitōn̄ n̄an juon `<answer>` ejjeļo̧k an input n̄an leļo̧k etan.

label-for-must-reference-input-or-answer = Attribute eo `for` ioon `<label>` ej aikuj jitōn̄ n̄an juon input ak juon answer.

## Accessibility

accessibility-short-description-or-decorative = N̄an maro̧n̄ in tōpar, `<{ $component }>` ej aikuj wōr juon kōmeļeļe kadu ippān ak em̧ōj kwaļo̧ke bwe ej decorative.

accessibility-video-short-description = N̄an maro̧n̄ in tōpar, `<video>` ej aikuj wōr juon kōmeļeļe kadu ippān.

accessibility-input-short-description-or-label = N̄an maro̧n̄ in tōpar, `<{ $component }>` ej aikuj wōr juon kōmeļeļe kadu ak juon label ippān.

accessibility-answer-input-short-description-or-label = N̄an maro̧n̄ in tōpar, juon `<answer>` ej kōm̧m̧an juon input ej aikuj wōr juon kōmeļeļe kadu ak juon label ippān.

accessibility-short-description-contains-math = Kōmeļeļe kadu ko ren jab kobaik math component ko āinwōt `<{ $component }>`. Kōjerbal naan n̄an kwaļo̧k math eo.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] Ejjab bwe oktak in color an { $colorName } n̄an naan eo ioon jebta eo (dark mode) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ej aikuj { $threshold }:1 ak eļapļo̧k).
       *[other] Ejjab bwe oktak in color an { $colorName } n̄an naan eo ioon jebta eo ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ej aikuj { $threshold }:1 ak eļapļo̧k).
    }

## `<circle>`

circle-through-points-non-numerical = Ejjan̄in kōm̧m̧ane juon `<circle>` ej deblo̧k { $count } poin̄ n̄e ejjeļo̧k value in number ippān poin̄ ko.

circle-too-many-through-points = Ejjab maro̧n̄ bōnbōn juon doulul ej deblo̧k eļapļo̧k jān 3 poin̄.

circle-overprescribed-radius-center-points = Ejjab maro̧n̄ bōnbōn juon doulul ewōr radius, center, im through point ippān.

circle-center-with-multiple-points = Ejjab maro̧n̄ bōnbōn juon doulul ewōr center ippān ej deblo̧k eļapļo̧k jān 1 poin̄.

circle-radius-too-small = Ejjab maro̧n̄ bōnbōn doulul eo: kōn ke tōļo̧k ikōtaan poin̄ ko ruo ej { $distance }, radius eo em̧ōj kwaļo̧ke { $radius } edik ļo̧k.

circle-radius-with-many-points = Ejjab maro̧n̄ kōm̧m̧an juon doulul ej deblo̧k eļapļo̧k jān ruo poin̄ n̄e em̧ōj kwaļo̧k juon radius.

circle-invalid-center-or-through-points = Center ak through point ko an doulul eo rejjab jim̧we.

circle-radius-center-with-multiple-points = Ejjab maro̧n̄ bōnbōn radius an juon doulul ewōr center ippān ej deblo̧k eļapļo̧k jān 1 poin̄.

circle-change-radius-non-numerical = Ejjab maro̧n̄ ukōt radius an juon doulul n̄e ejjeļo̧k value in number ippān through point ko

circle-radius-with-points-non-numerical = Ejjab maro̧n̄ kōm̧m̧an juon doulul ej deblo̧k eļapļo̧k jān juon poin̄ ewōr radius em̧ōj kwaļo̧ke n̄e ejjeļo̧k value in number.

circle-change-center-non-numerical = Ejjan̄in kōm̧m̧ane bwe en maro̧n̄ ukōt center an juon doulul ej deblo̧k poin̄ ko ejjeļo̧k value in number ippāer.

## `<function>`

# English multiplies two counted branches out; Marshallese changes nothing
# after either count, so one sentence carries both numbers.
function-domain-insufficient-dimensions = Ejjab bwe dimenjen ko n̄an domain in function eo. Ewōr { $intervals } intervōl ilo domain eo ak ewōr { $inputs } input ippān function eo.

function-domain-invalid-format = Wāween domain n̄an function ejjab jim̧we.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Ejjab kōjerbal maximum in function eo kōn ke ejjab juon number.
        [minimum] Ejjab kōjerbal minimum in function eo kōn ke ejjab juon number.
        [extremum] Ejjab kōjerbal extremum in function eo kōn ke ejjab juon number.
        [point] Ejjab kōjerbal poin̄ eo an function eo kōn ke ejjab juon number.
        [slope] Ejjab kōjerbal slope in function eo kōn ke ejjab juon number.
       *[other] Ejjab kōjerbal { $type } in function eo kōn ke ejjab juon number.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Ejjab kōjerbal maximum in function eo kōn ke ejjeļo̧k kobban.
        [minimum] Ejjab kōjerbal minimum in function eo kōn ke ejjeļo̧k kobban.
        [extremum] Ejjab kōjerbal extremum in function eo kōn ke ejjeļo̧k kobban.
        [point] Ejjab kōjerbal poin̄ eo an function eo kōn ke ejjeļo̧k kobban.
       *[other] Ejjab kōjerbal { $type } in function eo kōn ke ejjeļo̧k kobban.
    }

function-points-too-close = Ewōr ruo poin̄ ilo function eo repaak ļo̧k n̄an doon. Ejjab maro̧n̄ kōm̧m̧ane function eo.

function-iterates-input-output-mismatch = Function iterate ko rej maro̧n̄ wōt n̄e oran input ko an function eo ej jon̄an oran output ko an. Ewōr { $inputs } input im { $outputs } output ippān function in.

## `<sequence>`

sequence-invalid-length = Aetokan sequence eo ejjab jim̧we. Ej aikuj juon integer ejjab dik jān 0.

sequence-invalid-step = Step in sequence eo ejjab jim̧we. Ej aikuj juon number n̄an juon sequence in type { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" in juon number sequence ejjab jim̧we. Ej aikuj juon number.

sequence-invalid-endpoint-letters = "{ $attribute }" in juon letters sequence ejjab jim̧we. Ej aikuj juon koba in leta.

sequence-invalid-endpoint = "{ $attribute }" in sequence eo ejjab jim̧we.

select-from-sequence-coprime-not-numbers = Ejjab kōjerbal coprime kōn ke ejjab kālet number ko

select-from-sequence-coprime-with-exclude-combinations = Ejjab kōjerbal coprime kōn ke em̧ōj kwaļo̧k excludeCombinations

## Resolving a `target`

target-not-found = Target n̄an `<{ $source }>` ejjab jim̧we: ejjab maro̧n̄ lo target eo.

target-state-variable-not-found = Target n̄an `<{ $source }>` ejjab jim̧we: ejjab maro̧n̄ lo juon state variable etan "{ $property }" ioon juon `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Variable ko an `<odeSystem>` rej aikuj oktak jān variable eo independent.

ode-system-duplicate-variable-names = Ejjab maro̧n̄ kōm̧m̧an ODE RHS function ko n̄e ejja etan wōt dependent variable ej bar waļo̧k.

ode-system-rhs-function-error = Ejjab maro̧n̄ kōm̧m̧an ODE RHS function. Ewōr bōd ilo kōm̧m̧an mathjs function eo.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Ejjab maro̧n̄ kōm̧m̧an juon kona ikōtaan { $count } laain

angle-invalid-through-point = Poin̄ eo ilo through an `<angle>` ejjab jim̧we

parabola-vertex-too-many-points = Ejjan̄in kōm̧m̧ane juon parapola ewōr vertex ippān ej deblo̧k eļapļo̧k jān 1 poin̄.

parabola-too-many-points = Ejjan̄in kōm̧m̧ane juon parapola ej deblo̧k eļapļo̧k jān 3 poin̄.

intersection-too-many-items = Ejjan̄in kōm̧m̧ane intersection n̄an eļapļo̧k jān ruo men

## Other math components

ionic-compound-not-two-ions = Ejjan̄in kōm̧m̧ane ionic compound n̄an jabdewōt ijello̧kin ruo ion.

ionic-compound-needs-cation-and-anion = Ionic compound ej jerbal wōt n̄an juon cation im juon anion.

solve-equations-cannot-evaluate = Ejjab maro̧n̄ uwaake equation eo kōn ke ejjab maro̧n̄ bōnbōn equation eo: { $equation }

math-operators-operand-number-required = Ej aikuj kwaļo̧k juon operandNumber n̄e ej bōk juon math operand.

eigen-decomposition-failed = Ejjab maro̧n̄ bōnbōn eigenvalue ko an matrix eo

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: parameter { $parameters } ejjab waļo̧k ilo pattern eo, kōn men in enaaj iioon juon jikin ejjeļo̧k iien otemjej.

## `<graph>`

graph-grid-invalid = `<graph>`: ejjab maro̧n̄ meļeļe grid="{ $grid }". Ej aikuj none, medium, dense, ak ruo number reļap jān 0 im em̧ōj kōjepeli kōn juon space, āinwōt grid="1 0.5". Ejjeļo̧k grid ej waļo̧k.

## `<slopeField>` and `<vectorField>`

# `[1]` rather than `[one]`: `$expected` is a number, a digit literal is
# matched numerically and is always safe, and the two branches are two
# different sentences rather than two forms of one noun.
field-function-wrong-num-outputs =
    `<{ $component }>` ej aikuj juon function ewōr { $expected ->
        [1] juon output ippān, aet slope y' ilo kajjojo poin̄, āinwōt `y - x`
       *[other] ruo output ippān, aet pektōr eo ilo kajjojo poin̄, āinwōt `(y, -x)`
    }, ak function eo em̧ōj leļo̧k ewōr { $found } output ippān. { $alternative ->
        [none] Ejjeļo̧k men ej waļo̧k.
       *[other] `<{ $alternative }>` ej component eo n̄an function rot in. Ejjeļo̧k men ej waļo̧k.
    }

field-function-attribute-ignored-with-child = Ejjab kōjerbal attribute eo `function` kōn ke em̧ōj barāinwōt leļo̧k function eo ilowaan component eo; eo ilowaan ej jerbal. Leļo̧k function eo ilo juon wōt iaan wāween kein ruo.

field-variables-ignored =
    `<{ $component }>`: attribute eo `variables` ej ba etan variable ko an juon expression em̧ōj je ilowaan component eo. { $reason ->
        [function-child] Function eo ije em̧ōj leļo̧ke āinwōt juon `<function>` nejin, im ej ba etan variable ko an make, kōn men in ejjab kōjerbal `variables`.
       *[no-expression] Ejjeļo̧k expression rot in ije, kōn men in ejjab kōjerbal `variables`.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" ejjab jerbal ilo prefigure renderer; ej kōjerbal wāween right.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" ejjab jerbal ilo prefigure renderer; ej kōjerbal wāween top.

prefigure-invalid-axis-bounds = `<graph>`: axis bound ko rejjab jim̧we n̄an ukōt n̄an prefigure; ej kōjerbal bbox eo default (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: depakpak eo ejjab jim̧we n̄an ukōt n̄an prefigure; ej kōjerbal depakpak in diagram eo default 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio ejjab jim̧we n̄an ukōt n̄an prefigure; ej kōjerbal aspect ratio eo default 1.

prefigure-grid-spacing-too-fine = `<graph>`: kōtaan grid eo edik ļo̧k n̄an jon̄an axis ko; ejjab kōjerbal grid eo ilo prefigure renderer.

prefigure-annotations-not-rendered = `<graph>`: annotation ko rejjab waļo̧k n̄e ejjab kōjerbal PreFigure renderer.

multiple-annotations-children = Elōn̄ `<annotations>` nejin `<graph>`; ejjab kōjerbal aolep ijello̧kin eo āliktata.

## Referring to other components

copy-unrecognized-component-type = Ejjab maro̧n̄ extend ak copy juon component type ejjab alikkar: { $type }.

copy-prop-not-found = Ejjab maro̧n̄ lo prop { $property } ioon juon component in type { $component }

collect-no-source = Ejjeļo̧k source em̧ōj loe n̄an collect.

collect-invalid-component-type = Ejjab maro̧n̄ collect component ko in type `<{ $component }>` kōn ke ejjab juon component type ejim̧we.

reference-index-unavailable = Ejjab maro̧n̄ jitōn̄ n̄an index `{ $reference }`

## `<callAction>`

component-action-unavailable = Ejjab maro̧n̄ kūr { $action } ioon component `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Wāween data eo ejjab jim̧we. Aetokan laajrak ko rejjab jon̄an doon. Ear waļo̧k ilo componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Ewōr etan kōlōm ko rej bar waļo̧k ruo alen. Ear waļo̧k ilo componentIdx :{ $componentIdx }

data-frame-missing-column-name = Ejjeļo̧k etan juon kōlōm ilo data eo. Ear waļo̧k ilo componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Juon award n̄an answer in ej pedped ioon uwaak eo answer tag in ear make jilkinļo̧ke, im men in enaaj kōm̧m̧an bwe en jerbal ilo juon wāween ejjab kōtmāne.

answer-max-num-attempts-in-section-wide-check-work = Ejjeļo̧k tokjān likūt `maxNumAttempts` ioon juon `<answer>` ej pād ilowaan juon container ewōr `sectionWideCheckWork` ippān, kōn ke container eo ej lale oran kajjio̧n̄ ko. Likūt `maxNumAttempts` ioon container eo ijello̧kin.

nested-section-wide-check-work-max-num-attempts = Ejjeļo̧k tokjān likūt `maxNumAttempts` ioon juon container ewōr `sectionWideCheckWork` ippān ej pād ilowaan bar juon container ewōr `sectionWideCheckWork` ippān, kōn ke container eo ilikin ej lale oran kajjio̧n̄ ko. Likūt `maxNumAttempts` ioon container eo ilikin.

answer-attributes-need-symbolic-equality = Ejjeļo̧k tokjān attribute { $attributes } n̄e ejjab likūt symbolicEquality.

answer-invalid-type = Type n̄an answer ejjab jim̧we: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Kōn ke ejjeļo̧k etan component eo `<{ $component }>`, ejjab maro̧n̄ kōjerbale n̄an juon module attribute

module-attribute-name-already-defined = Component eo `<{ $component } name="{ $name }">` ejjab maro̧n̄ kōjerbal āinwōt juon attribute n̄an juon module kōn ke ewōr an component type eo `<module>` juon attribute etan "{ $name }".

conditional-content-condition-ignored = Ejjab kōjerbal attribute eo `condition` ioon juon `<conditionalContent>` ewōr case ak else nejin.

slider-markers-type-mismatch = Type in marker ko ejjab errā ippān type in slider eo.

pretzel-problem-needs-statement-and-answer = Pretzel eo ejjab jim̧we: kajjojo `<problem>` ej aikuj wōr juon `<statement>` im juon `<answer>` ilowaan.

pretzel-circuit-first-problem-distractor = Pretzel eo ejjab jim̧we: ilo mode="circuit", `<problem>` eo m̧oktata ejjab maro̧n̄ juon distractor.

## Attribute values

attribute-invalid-values = Value { $values } n̄an attribute `{ $attribute }` ejjab jim̧we; ejjab kōjerbale.

attribute-must-be-references = Value `{ $value }` n̄an attribute `{ $attribute }` ejjab jim̧we. Attribute eo ej aikuj kōm̧m̧an jān reference ko rej jino kōn juon `$`.

math-input-invalid-function-names = <mathInput>: ejjab kōjerbal etan function ko rejjab jim̧we ilo { $attribute }: { $names }. M̧ōttan eo ej waļo̧k an kajjojo et ej aikuj ruo ak eļapļo̧k character (leta ak dash); juon `|<mathspeak alternative>` emaro̧n̄ ļoore.

## Building components from the source

component-type-invalid = Component type ejjab jim̧we: `<{ $componentType }>`

attribute-repeated = Ejjab maro̧n̄ bar kōjerbal attribute { $attribute } ruo alen.

attribute-invalid-for-component = Attribute "{ $attribute }" ejjab jim̧we n̄an juon component in type `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Ejjab bwe oktak in color ilo style definition { $styleNumber } n̄an { $context ->
        [text-on-background] color in naan n̄ae color in ālikin
        [high-contrast] color eo high-contrast n̄ae canvas eo
        [line] color in laain n̄ae canvas eo
        [marker] color in marker n̄ae canvas eo
       *[text-on-canvas] color in naan n̄ae canvas eo
    }{ $mode ->
        [dark] { " (dark mode)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ej aikuj { $threshold }:1 ak eļapļo̧k).

style-definition-dark-mode-text-background-contrast =
    Men̄e ewōr an style definition { $styleNumber } color ko rekar bwe n̄an light mode, color ko n̄an dark mode em̧ōj bōki jān er ejjab bwe oktak in color in naan n̄ae color in ālikin ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ej aikuj { $threshold }:1 ak eļapļo̧k). { $suggestion ->
        [available] N̄an kōm̧m̧an bwe en bwe oktak in color ilo dark mode, kaļapļo̧k oktak in color ilo light mode (āinwōt likūt { $lightAttribute }="{ $lightColor }") ak ukōt color in dark mode (āinwōt likūt { $darkAttribute }="{ $darkColor }").
       *[none] N̄an kōm̧m̧an bwe en bwe oktak in color ilo dark mode, kaļapļo̧k oktak in color ilo light mode ak ukōt color ko em̧ōj bōki kōn textColorDarkMode im/ak backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Men̄e ewōr an style definition { $styleNumber } juon color in naan ekar bwe n̄an light mode, color in naan n̄an dark mode em̧ōj bōke jān e ejjab bwe oktak in ippān canvas eo ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ej aikuj { $threshold }:1 ak eļapļo̧k). { $suggestion ->
        [available] N̄an kōm̧m̧an bwe en bwe oktak in color ilo dark mode, kaļapļo̧k oktak in color ilo light mode (āinwōt likūt textColor="{ $lightColor }") ak ukōt color in dark mode (āinwōt likūt textColorDarkMode="{ $darkColor }").
       *[none] N̄an kōm̧m̧an bwe en bwe oktak in color ilo dark mode, kaļapļo̧k oktak in color ilo light mode ak ukōt color eo em̧ōj bōke kōn textColorDarkMode.
    }

section-multiple-style-palettes = Juon jebta emaro̧n̄ kālet juon wōt <stylePalette>; ej kōjerbal eo āliktata.

## Unique variants

variant-num-to-select-not-non-negative-integer = ejjab maro̧n̄ alikkar variant ko rej make iaer an { $component } kōn ke numToSelect ejjab juon integer ejjab dik jān 0.

variant-num-to-select-not-constant-number = ejjab maro̧n̄ alikkar variant ko rej make iaer an { $component } kōn ke numToSelect ejjab juon number ejjab oktak.

variant-with-replacement-not-constant-boolean = ejjab maro̧n̄ alikkar variant ko rej make iaer an { $component } kōn ke withReplacement ejjab juon boolean ejjab oktak.

variant-select-weight-disables-unique = Ejjab maro̧n̄ kōm̧m̧an variant ko rej make iaer n̄an select n̄e ewōr juon option ewōr selectWeight ak selectForVariants ippān

variant-coprime-undetermined = ejjab maro̧n̄ alikkar variant ko rej make iaer an { $component } kōn ke ejjab maro̧n̄ alikkar bwe coprime ej riab iien otemjej.

variant-attribute-not-constant = ejjab maro̧n̄ alikkar variant ko rej make iaer an { $component } kōn ke { $attribute } ej oktak.

variant-attribute-not-number = ejjab maro̧n̄ alikkar variant ko rej make iaer an { $component } kōn ke { $attribute } ejjab juon number.

variant-attribute-wrong-type-for-sequence =
    ejjab maro̧n̄ alikkar variant ko rej make iaer an { $component } in type { $type } kōn ke { $attribute } ejjab { $expected ->
        [letters-combination] juon koba in leta
        [math-expression] juon math expression ejim̧we
        [integer] juon integer
       *[number] juon number
    }.

variant-length-not-integer = ejjab maro̧n̄ alikkar variant ko rej make iaer an { $component } kōn ke length ejjab juon integer.

variant-sort-not-implemented = ejjan̄in kōm̧m̧ane variant ko rej make iaer an juon { $component } ewōr sort ippān

variant-exclude-combinations-not-implemented = ejjan̄in kōm̧m̧ane variant ko rej make iaer an juon { $component } ewōr excludeCombinations ippān

variant-math-exclude-not-implemented = ejjan̄in kōm̧m̧ane variant ko rej make iaer an juon { $component } in type math ewōr exclude ippān

variant-non-constant-exclude-not-implemented = ejjan̄in kōm̧m̧ane variant ko rej make iaer an juon { $component } ewōr juon exclude ej oktak ippān

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: ejjab jerbal ilo graph prefigure renderer; ejjab kōjerbal nejin eo.

prefigure-descendant-invalid-geometry = { $subject }: geometry eo ejjeļo̧k jem̧ļo̧kin ak ejjab dedeļo̧k; ejjab kōjerbal nejin eo.

prefigure-curve-label-omitted = { $subject }: label ko rejjab jerbal ioon curve element ko em̧ōj ukōti; ejjab kōjerbal label eo.

prefigure-curve-unsupported-definition-type = { $subject }: curve function definition type '{ $definitionType }' ejjab jerbal; ejjab kōjerbal nejin eo.

prefigure-region-flip-functions-unsupported = { $subject }: attribute eo flipFunctions ioon regionBetweenCurves ejjab jerbal; ejjab kōjerbal nejin eo.

prefigure-region-non-formula-child = { $subject }: function ko nejin in type formula wōt rej jerbal ioon regionBetweenCurves; ejjab kōjerbal nejin eo.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' ejjab jerbal n̄an { $labelKind ->
        [line-family] label in laain
       *[point] label in poin̄
    }; ej kōjerbal wāween PreFigure eo default.

prefigure-fill-style-unsupported = { $subject }: fill style '{ $fillStyle }' ejjab jerbal ilo PreFigure; ej oktak n̄an juon fill obrak wōt.

prefigure-line-style-unknown = { $subject }: line style '{ $lineStyle }' ejjab alikkar im ejjab waļo̧k ilo PreFigure output.

prefigure-marker-style-mapped-to-diamond = { $subject }: marker style '{ $markerStyle }' em̧ōj ukōte n̄an PreFigure style 'diamond'.

prefigure-marker-style-unsupported = { $subject }: marker style '{ $markerStyle }' ejjab jerbal ilo PreFigure; ej kōjerbal style eo default.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` ejjab jim̧we; ejjab maro̧n̄ lo target eo. Ejjab kōjerbal annotation eo.

annotation-ref-multiple-targets = `<annotation>`: `ref` ear jitōn̄ n̄an elōn̄ target; ej kōjerbal eo m̧oktata.

annotation-ref-outside-graph = `<annotation>`: `ref` ejjab jim̧we; target eo ej pād ilikin graph eo. Ejjab kōjerbal annotation eo.

annotation-ref-unsupported-target = `<annotation>`: `ref` ejjab jim̧we; target eo ejjab juon men ilo graph eo ej jerbal ilo ukōt n̄an prefigure. Ejjab kōjerbal annotation eo.

annotation-text-missing = `<annotation>`: ejjeļo̧k `text` ak ejjeļo̧k kobban; ej kwaļo̧k juon naan ejjeļo̧k.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Em̧ōj lo juon circular dependency.
       *[other] Em̧ōj lo juon circular dependency ej itok ippān component eo `<{ $componentType }>`.
    }

reference-no-referent = Ejjeļo̧k men em̧ōj loe n̄an reference eo: `{ $reference }`

reference-multiple-referents = Elōn̄ men em̧ōj loi n̄an reference eo: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Wāween attribute { $attribute } an `<{ $componentType }>` ejjab jim̧we.

children-invalid = Nejin `<{ $componentType }>` rejjab jim̧we: em̧ōj lo nejin ko rejjab jim̧we: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Value `{ $value }` n̄an attribute `{ $attribute }` ejjab jim̧we, ej kōjerbal value `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Ejjab maro̧n̄ lo DoenetML version { $version }.
       *[other] Ejjab maro̧n̄ lo DoenetML version { $version }. Ej oktak n̄an version { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML ejjab jim̧we: { $content }

parse-tag-missing-close-tag = DoenetML ejjab jim̧we: Ejjeļo̧k closing tag an tag eo `{ $tag }`. Ej aikuj juon self-closing tag ak juon `</{ $tagName }>` tag.

parse-tag-error = DoenetML ejjab jim̧we: Ewōr bōd ilo tag eo `<{ $tagName }>`

parse-attribute-missing-value = DoenetML ejjab jim̧we: Attribute eo `{ $attribute }` ejjab jim̧we, āinwōt ejjeļo̧k value ippān.

parse-attribute-invalid = DoenetML ejjab jim̧we: Attribute `{ $attribute }` ejjab jim̧we

parse-attribute-value-invalid = DoenetML ejjab jim̧we: Attribute value `{ $value }` ejjab jim̧we

parse-attribute-value-quote-mismatch = DoenetML ejjab jim̧we: Attribute value `{ $value }` ejjab jim̧we. Kakōļļe in quote ko rejjab errā. Āinwōt ejjeļo̧k juon `{ $quote }`

parse-open-tag-name-missing = DoenetML ejjab jim̧we: Em̧ōj lo juon tag ejjeļo̧k etan, āinwōt `<`

parse-tag-not-closed = DoenetML ejjab jim̧we: Tag eo `{ $tag }` ear jab kilōk (āinwōt ejjeļo̧k juon `>`).

parse-self-closing-tag-name-missing = DoenetML ejjab jim̧we: Em̧ōj lo juon tag ejjeļo̧k etan `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML ejjab jim̧we: Tag eo `{ $tag }` ear jab kilōk (āinwōt ejjeļo̧k `/>`).

parse-tag-invalid-attributes = DoenetML ejjab jim̧we: Tag eo `{ $tag }` ejjab jim̧we. Emaro̧n̄ bōd attribute ko an.

parse-close-tag-name-missing = DoenetML ejjab jim̧we: Em̧ōj lo juon closing tag ejjeļo̧k etan, āinwōt `</`

parse-attribute-value-unquoted = Attribute value ko rej aikuj pād ilowaan quote: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML ejjab jim̧we: Em̧ōj lo closing tag `{ $tag }`, ak ejjeļo̧k opening tag n̄an e

parse-close-tag-mismatched = DoenetML ejjab jim̧we: Closing tag eo ejjab errā. Ej aikuj `</{ $expected }>`. Em̧ōj lo `{ $found }`

parser-node-unconvertible = Ejjab maro̧n̄ ukōt node { $node } n̄an juon Dast node.

## Names

name-attribute-invalid =
    Attribute name='{ $name }' ejjab jim̧we. { $reason ->
        [characters] Etan ko remaro̧n̄ wōr leta, number, underscore ak hyphen wōt ippāer.
       *[start] Etan ko rej aikuj jino kōn juon leta.
    }

component-name-invalid-start = Etan component "{ $name }" ejjab jim̧we. Etan ko rej aikuj jino kōn juon leta.

## `<answer>` sugar

answer-video-watched-missing-video = Juon answer in type videoWatched ej aikuj wōr juon video attribute ippān

answer-video-watched-video-not-reference = Juon answer in type videoWatched ej aikuj wōr juon video attribute ej juon reference

answer-name-not-single-text = Answer name attribute ej aikuj wōr juon wōt text nejin

## Referencing another document

external-doenetml-recursion-limit = Ejjab maro̧n̄ bōk DoenetML eo ilikin kōn ke eļap an lōn̄ recursion. Ewōr ke juon circular reference?

external-doenetml-unavailable = Ejjab maro̧n̄ bōk DoenetML jān { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML eo em̧ōj bōke jān { $attribute }="{ $uri }" ejjab jim̧we: ejjab errā ippān component type eo "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Attribute `{ $from }` ej jako ļo̧k; kōjerbal `{ $to }` ijello̧kin.
       *[other] [deprecation] Attribute `{ $from }` ioon `<{ $component }>` ej jako ļo̧k; kōjerbal `{ $to }` ijello̧kin.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Attribute `{ $from }` ej jako ļo̧k im ejjab kōjerbale kōn ke em̧ōj barāinwōt kwaļo̧k `{ $to }`.
       *[other] [deprecation] Attribute `{ $from }` ioon `<{ $component }>` ej jako ļo̧k im ejjab kōjerbale kōn ke em̧ōj barāinwōt kwaļo̧k `{ $to }`.
    }

deprecated-attribute-ignored = [deprecation] Attribute `{ $attribute }` ioon `<{ $component }>` ej jako ļo̧k im ejjab kōjerbale.

deprecated-attribute-to-child = [deprecation] Attribute `{ $attribute }` ioon `<{ $component }>` ej jako ļo̧k; kōjerbal juon `<{ $child }>` nejin ijello̧kin.

deprecated-attribute-value-renamed = [deprecation] Value `{ $value }` an attribute `{ $attribute }` ioon `<{ $component }>` ej jako ļo̧k; kōjerbal `{ $to }` ijello̧kin.


## Language coverage

pluralize-english-only = `<pluralize>` ej maro̧n̄ wōt kōm̧m̧an plural ilo Kajin Pālle, kōn men in naan eo ej pād wōt āinwōt an ri-jeje eo je ilo juon peba em̧ōj je ilo { $locale }. Je wāween plural eo make, ak likūte kōn attribute eo `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Element `<{ $tag }>` ejjab juon Doenet element em̧ōj kile.

schema-element-not-allowed-at-root = Element `<{ $tag }>` ejjab maro̧n̄ pād ilo okran peba eo.

schema-element-not-allowed-inside = Element `<{ $tag }>` ejjab maro̧n̄ pād ilowaan `<{ $parent }>`.

schema-attribute-unrecognized = Ejjeļo̧k an element eo `<{ $tag }>` attribute etan `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Attribute `{ $attribute }` an element `<{ $tag }>` ej aikuj juon list im kajjojo men ilowaan ej juon iaan kein: { $allowed }
       *[other] Attribute `{ $attribute }` an element `<{ $tag }>` ej aikuj juon iaan kein: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Variant name n̄an select ejjab jim̧we. Variant name { $variantName } ej waļo̧k ilo { $numOptions } option ak oran n̄an kālete ej { $numToSelect }.

select-variant-name-without-options = Em̧ōj kwaļo̧k jet variant n̄an select ak ejjeļo̧k option em̧ōj kwaļo̧ki n̄an variant name in: { $variantName }.

select-variant-name-not-possible = Variant name { $variantName } em̧ōj kwaļo̧ke n̄an select ejjab juon variant name emaro̧n̄ waļo̧k.

select-too-few-options = Ejjab maro̧n̄ kālet { $numToSelect } component jān { $numOptions } wōt.

select-from-sequence-too-few-values = Ejjab maro̧n̄ kālet { $numToSelect } value jān juon sequence aetokan { $length }.

select-from-sequence-indices-count-mismatch = Oran indices em̧ōj kwaļo̧ki n̄an select ej aikuj jon̄an oran n̄an kālete

select-from-sequence-indices-not-integers = Aolep indices em̧ōj kwaļo̧ki n̄an select rej aikuj integer

select-from-sequence-index-excluded = Em̧ōj kwaļo̧k juon index an selectfromsequence me em̧ōj joļo̧ke

select-from-sequence-indices-excluded-combination = Em̧ōj kwaļo̧k indices an selectfromsequence me rej juon koba em̧ōj joļo̧ke

select-from-sequence-coprime-not-positive-integers = Ejjab maro̧n̄ kālet koba in coprime kōn ke ejjab kālet integer ko reļap jān 0.

select-from-sequence-coprime-common-factor = Ejjab maro̧n̄ kālet number in coprime. Aolep value ko remaro̧n̄ waļo̧k ewōr juon common factor ippāer. (Value ko em̧ōj kwaļo̧ki n̄an "from" ak "to" rej aikuj coprime ippān "step".)

select-from-sequence-coprime-single-number = Ejjab maro̧n̄ kālet koba in coprime jān juon wōt number ejjab 1.

select-from-sequence-excluded-too-many-combinations = Em̧ōj joļo̧k eļapļo̧k jān 70% in koba ko ilo selectFromSequence

select-from-sequence-coprime-none-found = Ear jab maro̧n̄ kālet number in coprime. Aolep value ko remaro̧n̄ waļo̧k ewōr juon common factor ippāer.

select-from-sequence-too-few-unique-values = Ejjab maro̧n̄ kālet { $numToSelect } value ko rej make iaer jān juon sequence aetokan { $numPossibleValues }

select-prime-numbers-too-few-values = Ejjab maro̧n̄ kālet { $numToSelect } value jān juon list in prime aetokan { $numValues }

select-prime-numbers-values-count-mismatch = Oran value ko em̧ōj kwaļo̧ki n̄an select ej aikuj jon̄an oran n̄an kālete

select-prime-numbers-values-not-prime = Aolep value ko em̧ōj kwaļo̧ki n̄an select prime number rej aikuj pād ilo list in prime eo

select-prime-numbers-values-excluded-combination = Value ko em̧ōj kwaļo̧ki n̄an selectPrimeNumbers rej juon koba em̧ōj joļo̧ke

select-prime-numbers-excluded-too-many-combinations = Em̧ōj joļo̧k eļapļo̧k jān 70% in koba ko ilo selectPrimeNumbers

select-random-combination-fluke = Kōn juon men epen an waļo̧k, ear jab maro̧n̄ kālet juon koba in value ko ilo jide

select-random-value-fluke = Kōn juon men epen an waļo̧k, ear jab maro̧n̄ kālet juon value ilo jide

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    `<{ $component }>` ejjab waļo̧k ilowaan math eo; ej je expression eo āinwōt m̧okta jān an maro̧n̄ pād input ko ilowaan. { $reason ->
        [not-inline] Juon wōt choice input ewōr `inline` ippān ej maro̧n̄ pād ilowaan juon expression; n̄e ejjeļo̧k `inline`, ej juon bo̧o̧k in batin ko.
        [expanded] Juon text input `expanded` ej juon bo̧o̧k elōn̄ laajrak, im eļap ļo̧k n̄an an pād ilowaan juon expression.
        [on-graph] Ioon juon graph ej je expression eo āinwōt juon wōt pija, im ejjeļo̧k jikin n̄an juon kein jerbal ie.
       *[relative-width] Depakpak eo an ej relative (juon persent ak `em`), im ejjeļo̧k men n̄an jon̄ane ilowaan juon expression. Leļo̧k depakpak eo ilo jon̄an absolute, āinwōt `px`.
    }
