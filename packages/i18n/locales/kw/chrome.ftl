# Cornish (Kernewek) viewer chrome. Translated from `locales/en/chrome.ftl`,
# which is the source of truth: `lint:i18n` rejects a key that does not exist
# there, and reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script: Latin, in the Standard Written Form (Furv Skrifys Savonek, FSS/SWF)**,
# the orthography agreed in 2008 and used by Akademi Kernewek's «Gerlyver
# Kernewek» and by the Cornish Language Office. The alternative orthography
# that was **not** used here is **Kernewek Kemmyn**, whose vowel-length and
# consonant conventions differ from the SWF's — this file's «linen» is Kemmyn's
# «lynen» — and Unified Cornish and Kernowek Standard are likewise not
# followed. Where they differ, the spelling here is the «Gerlyver Kernewek»'s;
# a reviewer working from a Kemmyn text should expect a different spelling of
# the same word rather than a different word. Digits are **Latin** (`1`, `2`,
# `1,234`), which is what DoenetML pins for every locale in `src/intl.ts`;
# grouping is the locale's own.
#
# **What is Cornish here.** The copula and existential are «yw» and «yma» /
# «nyns eus»; the negator is «ny» / «nyns»; «ha» / «hag» is *and*, «po» is *or*,
# «mars» is *if*, «poken» is *otherwise*, «mar pleg» is *please*. Buttons carry
# the bare verbal noun the way a Cornish label does — «Igeri», «Degea»,
# «Dilea», «Keworra», «Diskwedhes», «Kudha», «Gwaya» — rather than an
# imperative addressed to the reader. The everyday words are the language's
# own: «ewn» / «kamm» for right and wrong, «gorthyp» for a response, «gwall»
# for an error, «folen» for a page, «res» and «koloven» for a row and a column.
#
# **What is borrowed, and from where.** Cornish is a revived language and
# Akademi Kernewek's dictionary is the terminology authority; where it has a
# term this catalog uses it. Where it does not, the fallback is English, which
# is the language every Cornish speaker is actually schooled in, adapted to SWF
# spelling: «statistegow», «matematek», «vektor», «parabola», «diagonal»,
# «renderer», «WCAG». Three words in this catalog are transparent compounds
# built from attested roots rather than dictionary entries, and a reviewer
# should attack them first: **«dasliv»** for *feedback* (das- *re-* + liv
# *flow*), **«hyntyans»** for *hint* (on hyntya), and **«hedhadewder»** for
# *accessibility* (on hedhadow *reachable*). «terrys» for *dashed* and
# «poyntys» for *dotted* in `content.ftl` are the same kind of formation.
#
# **Counts.** CLDR gives Cornish **rules of its own with all six categories**,
# and Cornish integer counts really do reach every one of them:
#
#   zero   0
#   one    1
#   two    2, 22, 42, 62, 82, 102 — n mod 100 = 2, 22, 42, 62, 82
#   few    3, 23, 43, 63, 83, 103 — n mod 100 = 3, 23, 43, 63, 83
#   many   21, 41, 61, 81, 101, 121 — n mod 100 = 1, 21, 41, 61, 81 (not 1)
#   other  everything else: 4–20, 24–40, …
#
# A Cornish noun after a numeral stays **singular**; what varies is the
# mutation the numeral puts on it. «dew» / «diw» (2) lenites — p→b, t→d, k→g,
# g→∅, b→v, d→dh, m→v, gw→w. «tri» / «teyr» (3) spirantizes — k→h, p→f, t→th,
# and nothing else. «unn» (1) lenites a feminine noun only, and the vigesimal
# counts that land in `many` («unn ha ugens» = 21) mutate as 1 does. So a
# counted branch differs from its neighbours in the **first letter** of the
# word, not in an ending — the same shape `locales/cy` has.
#
# Where all six categories would render the same word — because the noun begins
# with a vowel, or with `l`, `r`, `s`, `n`, `f`, `h`, which have no lenited or
# spirantized form — the select is written with only the branches that differ
# plus the default. That is a fact about Cornish spelling, not an untranslated
# string. `attempts-remaining` and `answer-show-responses` below both fork.
#
# **Weakest first.** «prov» for *attempt* is chosen partly because it mutates
# and so shows the count rules; «assay» is the commoner dictionary word and a
# reviewer may well prefer it, at the cost of flattening the select. The three
# coinages named above, and «lettrennva» for *keyboard*, are the next things to
# check.


## Answer submission

answer-checking = Ow checkya…
answer-submitting = Ow tanvon…
answer-checking-status = Ow checkya an gorthyp
answer-submitting-status = Ow tanvon an gorthyp
answer-correct = Ewn
answer-incorrect = Kamm
answer-response-saved = Gorthyp gwithys
answer-percent-credit = { $percent }% a'n merkyow
answer-percent-correct = { $percent }% ewn
answer-percent-short = { $percent } %
max-credit-available = An moyha merkyow kavadow: { $percent }%
# «prov» is masculine, so «unn prov» is unmutated and only `two` («dew brov»)
# and `few` («tri frov») differ from the radical. `[0]` catches none by number,
# as the English does, so the `zero` category it would otherwise select is not
# written out.
attempts-remaining =
    { $count ->
        [0] nyns eus prov gesys
        [two] { $count } brov gesys
        [few] { $count } frov gesys
       *[other] { $count } prov gesys
    }
validation-correct = (Ewn)
validation-incorrect = (Kamm)
validation-partially-correct = (Yn rann ewn)
# «gorthyp» begins with `g`, which lenites to nothing after «dew» but is
# untouched by the spirantization «tri» causes — so `two` forks and `few`,
# `one` and `many` all read as the default does.
#
# **A seam a speaker must settle.** That is the rule the tables above state,
# and it is the rule `content.ftl` follows («gell» → «ell», «glas» → «las»).
# The other three files instead write `g-` as `w-` after a leniting word —
# «an wnas», «dhe wnas», «dhe worthyp» — which is the Welsh treatment, not
# the Cornish one. Each half is written the same way throughout, so the
# correction is one decision rather than thirty-five; it is recorded here
# rather than guessed at, since a wrong guess would be thirty-five wrong
# words — «wnas» thirty-two times and «worthyp» three.
answer-show-responses =
    { $count ->
        [two] Diskwedhes { $count } orthyp dhe { $answerId }
       *[other] Diskwedhes { $count } gorthyp dhe { $answerId }
    }


## Disclosure panels

feedback-heading = Dasliv
collapsible-click-to-open = (klyckya dhe igeri)
collapsible-click-to-close = (klyckya dhe dhegea)
collapsible-initializing = Ow talleth…
footnote-show = Diskwedhes an noten woles
footnote-hide = Kudha an noten woles
description-more-information = moy kedhlow


## Controls

slider-previous = Kyns
slider-next = Nessa
keyboard-open = Igeri an lettrennva
keyboard-close = Degea an lettrennva
choice-input-remove-choice = Dilea { $choice }
matrix-remove-row = Dilea res
matrix-add-row = Keworra res
matrix-remove-column = Dilea koloven
matrix-add-column = Keworra koloven
subset-add-remove-points = Keworra/dilea poyntys
subset-toggle-points-intervals = Treylya ynter poyntys hag intervalow
subset-move-points = Gwaya an poyntys
subset-clear = Klerhe
# A `box` here is one orbital, drawn as a square.
orbital-add-row = Keworra res
orbital-remove-row = Dilea res
orbital-add-box = Keworra boks
orbital-remove-box = Dilea boks
orbital-add-up-arrow = Keworra seth war-vann
orbital-add-down-arrow = Keworra seth war-nans
orbital-remove-arrow = Dilea seth
orbital-row-label = Label rag res { $row }
pretzel-answer = Gorthyp


## Math input

math-input-preview-region = ragwel an lavarow matematek
math-input-preview = Ragwel
math-input-invalid-expression = Lavarow anwiw:


## Document status

viewer-initializing = Ow talleth…


## Errors

error-heading = Gwall
error-found-at =
    { $span ->
        [line] Kevys war linen { $startLine }.
       *[lines] Kevys war linennow { $startLine }–{ $endLine }.
    }
document-contains-errors = Yma gwallow y'n dokument ma!
diagnostic-heading-error = Gwall
diagnostic-heading-warning = Gwarnyans
diagnostic-heading-information = Kedhlow
diagnostic-heading-hint = Hyntyans
accessibility-heading-level-1 = Torrva hedhadewder WCAG AA
accessibility-heading-level-2 = Gwarnyans hedhadewder
something-went-wrong = Neppyth eth yn kamm.
renderer-load-failed = ny allas renderer bos kargys. Daskarg an folen mar pleg.
core-start-failed = Ny allas an dokument ma dalleth. Daskarg an folen mar pleg.
core-start-failed-busy = Ny allas an dokument ma dalleth. Yth esa lies dokument ow talleth war an keth prys, ha hemma a yll kemmeres moy termyn war jynn lentter. Daskarga an folen a yll gweres wosa an dokumentow erell dhe worfenna.
core-start-failed-retry = Ny allas an dokument ma dalleth.
core-start-failed-busy-retry = Ny allas an dokument ma dalleth. Yth esa lies dokument ow talleth war an keth prys, ha hemma a yll kemmeres moy termyn war jynn lentter.
core-start-retry = Assaya arta
saved-state-unavailable = Ny allas dha ober gwithys bos kargys.
