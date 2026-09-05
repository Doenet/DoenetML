# Gilbertese / Kiribati (te taetae ni Kiribati) viewer chrome. Translated from
# `locales/en/chrome.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** This file writes the **standard Kiribati orthography** — the
# thirteen letters `a b e i k m n ng o r t u w` and no others. Two decisions in
# it are worth naming, because printed Kiribati is not consistent about either:
#
#   * **`b`/`bw` and `m`/`mw` are written out.** Kiribati distinguishes plain
#     labials from velarized ones, and this file spells the velarized ones with
#     the `w` — «bwai» (thing), «mwakoro» (portion), «mwakuri» (work),
#     «mwaneaba» — which is what the modern dictionaries and most government
#     and school material do. The older mission orthography, the one the
#     Kiribati Bible is set in, writes «bai», «makoro», «makuri» and leaves the
#     distinction to the reader. Both are current. A reviewer who prefers the
#     mission spelling should convert **all four files at once** rather than
#     mix the two systems inside one catalog.
#   * **No macrons.** Vowel length is written by doubling the vowel —
#     «mainaina» (white), «taari», «kaawakina» — never with a macron. A macron
#     anywhere in these files is a mistake, not a variant spelling.
#
# **Counting, and the classifier.** Kiribati counts with **numeral
# classifiers**: a numeral is a stem plus a suffix naming what kind of thing is
# being counted — «-ua» for general and inanimate things («teuana», «uoua»,
# «tenua», «aua», «nimaua»), «-man» for animate beings, «-kai» for rigid or
# wooden things, «-waa» for canoes and vehicles, and a dozen more. Everything
# counted in this catalog and in `diagnostics.ftl` is an abstract item — an
# attempt, a submitted response, a dimension, an output, a coordinate, a
# violation — so this seed counts them all with **«-ua», the general
# classifier**, which is the one an unmarked count of "things" takes and the
# only one any of these nouns could reach.
#
# The classifier is nevertheless **almost never written here**, and that is a
# fact about the messages rather than about Kiribati. A count arrives as
# `{ $count }`, a value this catalog never sees, and a classifier is a suffix
# welded to the numeral word: «uoua», not «2-ua». That is the README's
# "an affix cannot be welded to a placeable" exactly. So a counted message is
# written as digit + «te» + noun — «{ $count } te kaeka» — which is how a
# numeral phrase with a digit is written in Kiribati, and the classifier lives
# in this header instead of in the messages. A speaker reading a count aloud
# supplies it.
#
# **Number.** A Kiribati noun is not marked for number by a numeral in front of
# it, so a count changes nothing about the word beside it. `Intl.PluralRules`
# has no CLDR data for `gil` and resolves against the runtime's default locale,
# so a `[two]`, `[few]` or `[many]` branch here would be text nothing could
# select. Where English's two branches differ only in the noun's number this
# file writes **one unselected form**, as `locales/sm` does; explicit `[0]` and
# `[1]` literals are matched numerically and are kept where English has them.
#
# **Word order: the describing word follows the noun, joined by the linker
# «ae».** «te kaa ae uraura» is *the red car* — noun, linker, description —
# and «ae» is the singular linker, «aika» the plural one. Every noun a
# description is built around in these files is singular, so **«ae» is the only
# linker used**, and it is used wherever a modifier attaches: «te line ae
# bubura ae uraura». It is a separate word, so nothing here welds it to a
# placeable. This is the same postnominal order the batch's four other
# Micronesian catalogs write — `mh`, `chk`, `pon` and `kos` — and that
# `ch`, `sm` and `to` already had.
#
# **No grammatical gender**, so `noun-gender` answers one token and no
# adjective in these files forks on `$gender`. **No `$role` fork** either:
# nothing here changes shape between a standalone position and a clause,
# because the linker «ae» does the work a case ending would do elsewhere.
#
# **Loans.** Kiribati schooling in mathematics and computing is in English, and
# this seed keeps the technical vocabulary it could not establish **in English
# spelling** rather than dressing a guess up as Kiribati — the method
# `locales/kos` states for its whole residue, applied here only where it is
# needed. `document`, `page`, `keyboard`, `row`, `column`, `box`, `arrow`,
# `point`, `interval`, `line` (the source line), `credit`, `renderer`,
# `statistics`, `accessibility`, `expression` and `math` are loans of that kind
# here. Everything else below is Kiribati. The frame — word order, the linker,
# the absence of gender and number agreement — is this file's contribution; the
# loans are its debt, and replacing one needs no permission.
#
# **Words this file commits to** (a reviewer should check these first, since
# every other message is built out of them): «kaeka» answer, «tuoa» check,
# «kanakoa» send/submit, «eti» be correct, «kairua» be wrong, «bure» error,
# «kauring» warning, «rongorongo» information, «kanikina» sign or symbol,
# «kaotioti» a revealing (this file's word for *hint*), «kunea» find,
# «akea» there is none, «kaota» show, «karabaa» hide,
# «kauka» open, «kaina» close, «karina» add/put in, «kaakea» remove,
# «kaitiaka» clear, «kamwaing» move, «kaawakina» save/keep, «kataia» try,
# «kona» be able, «riai» ought, «tuai» not yet, «moana» begin, «bita» change.


## Answer submission — the check-work button and the status it reports.

answer-checking = E tuoaki...
answer-submitting = E kanakoaki...

answer-checking-status = E tuoaki te kaeka
answer-submitting-status = E kanakoaki te kaeka

answer-correct = E eti
answer-incorrect = E kairua

answer-response-saved = E a kaawakinaki te kaeka

answer-percent-credit = { $percent }% te credit
answer-percent-correct = { $percent }% e eti
answer-percent-short = { $percent } %

max-credit-available = Te credit ae kona n reke: { $percent }%

# One unselected form beside the `[0]` literal: a Kiribati noun does not change
# after a numeral, so `one` and `other` would be the same words.
attempts-remaining =
    { $count ->
        [0] akea te kataaki ae tiku
       *[other] { $count } te kataaki ae tiku
    }

validation-correct = (E eti)
validation-incorrect = (E kairua)
validation-partially-correct = (E eti teutana)

answer-show-responses = Kaota { $count } te kaeka nakon { $answerId }


## Disclosure panels

feedback-heading = Kaongoraa iaon te kaeka

collapsible-click-to-open = (kiliki bwa e na uki)
collapsible-click-to-close = (kiliki bwa e na kainaki)

collapsible-initializing = E moanaki...

footnote-show = Kaota te taeka ae i nano
footnote-hide = Karabaa te taeka ae i nano

description-more-information = rongorongo riki

## Controls

slider-previous = Rimoa
slider-next = Imwina

keyboard-open = Kauka te keyboard
keyboard-close = Kaina te keyboard

choice-input-remove-choice = Kaakea { $choice }

matrix-remove-row = Kaakea te row
matrix-add-row = Karina te row
matrix-remove-column = Kaakea te column
matrix-add-column = Karina te column

subset-add-remove-points = Karina ke kaakea taian point
subset-toggle-points-intervals = Bita i marenan taian point ao taian interval
subset-move-points = Kamwaingi taian point
subset-clear = Kaitiaka

orbital-add-row = Karina te Row
orbital-remove-row = Kaakea te Row
orbital-add-box = Karina te Box
orbital-remove-box = Kaakea te Box
orbital-add-up-arrow = Karina te Arrow ae Rierake
orbital-add-down-arrow = Karina te Arrow ae Ruo
orbital-remove-arrow = Kaakea te Arrow

orbital-row-label = Te ara ibukin row { $row }

pretzel-answer = Kaeka



## Math input

math-input-preview-region = kaotan te math expression
math-input-preview = Kaotana
math-input-invalid-expression = Te expression ae aki eti:


## Document status

viewer-initializing = E moanaki...


## Errors

error-heading = Bure

error-found-at =
    { $span ->
        [line] E kuneaki n te line { $startLine }.
       *[lines] E kuneaki n taian line { $startLine }–{ $endLine }.
    }

document-contains-errors = Iai taian bure n te document aei!

diagnostic-heading-error = Bure
diagnostic-heading-warning = Kauring
diagnostic-heading-information = Rongorongo
diagnostic-heading-hint = Kaotioti

accessibility-heading-level-1 = Te bure n te WCAG AA accessibility
accessibility-heading-level-2 = Te kauring ibukin te accessibility

something-went-wrong = Iai te bwai ae aki nakoraoi.

renderer-load-failed = e aki kona n ruo te renderer. Taiaoka kaboua te page.

core-start-failed = E aki kona ni moanaki te document aei. Taiaoka kaboua te page.

core-start-failed-busy = E aki kona ni moanaki te document aei. A bati taian document aika a moanaki n te tai ae ti te bo, ae kona ni karekea te tai ae maan riki iaon te bwai ae maraurau. E kona n ibuobuoki kabouan te page ngkana a a tia n toki nikiran taian document.

core-start-failed-retry = E aki kona ni moanaki te document aei.

core-start-failed-busy-retry = E aki kona ni moanaki te document aei. A bati taian document aika a moanaki n te tai ae ti te bo, ae kona ni karekea te tai ae maan riki iaon te bwai ae maraurau.

core-start-retry = Kataia riki

saved-state-unavailable = E aki kona n ruo am mwakuri are kaawakinaki.
