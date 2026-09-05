# Chuukese (Fóósun Chuuk) viewer chrome, Chuuk Lagoon variety. Translated from
# `locales/en/chrome.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# ## Orthography
#
# This file writes the **Goodenough–Sugita orthography**, the one of the
# Chuukese–English Dictionary and of most Chuuk State school material:
#
#   * **Vowel length is written by doubling the vowel** — «nóóm», «fóós»,
#     «ttam» — never by a macron. A macron appearing in this catalog is an
#     inconsistency, not a refinement.
#   * **`ch`** is the affricate, and it is a single letter for spelling
#     purposes: «chchik», «chómmóng». The doubled («chch») spelling of a
#     geminate is kept.
#   * **`ó` and `ú`** are part of the spelling and not decoration. `ó` is the
#     low back rounded vowel («fóós», «pwóón», «chómmóng») and `ú` the high
#     central/back one («pwúng», «úkúkún», «túmwúnú»). A bare `o` where this
#     file writes `ó`, or a bare `u` for `ú`, is an error to fix. Some Chuuk
#     printing drops both diacritics; this file does not, and a reviewer who
#     prefers the undiacriticked spelling should convert all four files rather
#     than mix the two systems. `á` is written on the same footing where it
#     occurs («áninnis», «pwáraatá», «mwáál»).
#   * **`pw` and `mw`** are the velarized consonants and are written
#     everywhere: «pwúng» is not «púng», «amwúchú» is not «amuchú».
#
# ## Number, and the classifier
#
# **A Chuukese noun is not marked for number**, so a count in front of a noun
# changes nothing about the noun. What Chuukese does mark is the **verb**: the
# third-person subject marker is «e/a» in the singular and «re/ra» in the
# plural. So where the English forks only because the *noun* changes («1
# attempt» / «2 attempts») this file writes **one unselected form**, and where
# it forks because the *verb* changes («is ignored» / «are ignored») the
# `one` / `*[other]` pair is kept and carries «ese» against «resap». That is a
# real distinction in the language rather than a copy of English's.
#
# `Intl.PluralRules("chk")` has no CLDR data and resolves against the runtime's
# default locale, so only `one`, `other` and explicit numeric literals such as
# `[0]` may be written here. Never add `[two]`, `[few]` or `[many]`: nothing
# could select them.
#
# **Chuukese counts with numeral classifiers**, which is why a bare
# `{ $count }` in front of a noun is not what a speaker would say aloud. The
# general classifier for inanimate and abstract things is **`-w`** — «eew»,
# «ruuw», «únúúw», «fáán», «niim» — as against `-men` for animates and `-fóch`
# for long rigid objects. Everything the core counts in these four files
# (attempts, responses, violations, inputs, outputs, coordinates) is an
# inanimate or abstract item, so **`-w` is the classifier used**, and it is
# written wherever the number is a word this catalog controls («eew rooch»,
# «eew pwoos»). It **cannot** be written where the number arrives as
# `{ $count }`: the numeral is formatted by `Intl.NumberFormat` as digits, and
# a classifier is a suffix on the numeral itself, so there is nothing to attach
# it to — see the README's rule that an affix cannot be welded to a placeable.
# A reader therefore sees «3 sótun» where a speaker would say «únúúw sótun».
# That is a known residue of this seed, not a claim about Chuukese, and it is
# the same residue `locales/gil` records for its own `-ua`.
#
# ## Gender and word order
#
# Chuukese has **no grammatical gender**: `noun-gender` answers one token and
# no adjective in these files forks on `$gender`. Nor does any fork on
# `$role` — a describing word is the same shape standing alone and inside a
# clause.
#
# **The describing word follows the noun** — «nain mi wattee», a thick
# line, never the English order — so the composition messages in `content.ftl`
# reorder rather than substitute. All five Micronesian catalogs of this batch
# (`mh`, `pon`, `kos`, `gil` and this one) are postnominal, as `ch`, `sm` and
# `to` were before them; `gil` writes a linker «ae» between noun and modifier
# and this file writes the relative «mi», which is the Chuukese equivalent of
# that linker rather than a disagreement with it.
#
# ## Vocabulary this seed had to build, and the words to check first
#
# Schooling in Chuuk above the elementary grades is largely in English, so a
# good deal of the interface vocabulary here is **coined or borrowed rather
# than attested**. Recorded, not hidden:
#
#   «pwóón»        answer, response. This is the highest-frequency word in the
#                  four files and the **first one a reviewer should check**:
#                  the seed could not confirm it against a dictionary. If it
#                  is wrong, it is wrong in about forty places, and a single
#                  substitution fixes all of them. Chuukese does not seem to
#                  separate *answer* from *response*, so both English words
#                  come out «pwóón»; where the editor's table needs them apart,
#                  the answer's identifier is «Iten ewe Pwóón».
#   «ri-pwáraatá»  renderer, "the one who shows" — built on «pwáraatá», to
#                  show. The same coinage `locales/mh` makes as «ri-kwaļo̧k»,
#                  and this file follows it deliberately.
#   «tongeni tori» accessibility, "being able to reach". Again the shape `mh`
#                  chose («maro̧n̄ in tōpar»).
#   «kapas fán»    footnote, "the word underneath".
#   «nengeni mwen» preview, "to look at beforehand".
#   «kiipoot»      keyboard, borrowed; `mh` borrows the same word the same way.
#   «kiritit»      credit, borrowed. No Chuukese word for a partial score was
#                  available to this seed.
#   «rooch», «koonom», «pwoos», «poin», «nain», «mesin», «peich»
#                  row, column, box, point, line, machine, page — all borrowed
#                  with Chuukese spelling. «nain» is doing double duty for a
#                  geometric line and a line of source text, which a speaker
#                  may well want split.
#   «fótúk»        arrow. The word for a dart or bow-arrow, reused for the spin
#                  arrows of an orbital diagram; flagged because the reuse is
#                  this seed's and not the language's.
#   «túmwúnú»      warning, on the ordinary verb "to take care".
#   «Kapas Ngonuk» feedback, "words to you" — a coinage, and one of the
#                  weaker ones here.
#
# **Where this file writes a negation instead of a word.** «Ese pwúng» ("it is
# not right") stands for *incorrect*, and `footnote-hide` reads «Esap pwáraatá
# …» ("do not show …"), because the seed could not establish a Chuukese verb
# for *to hide* and would rather negate a word it has than invent one it does
# not. Both are grammatical Chuukese; both are places where a speaker almost
# certainly has a better single word.

## Answer submission

answer-checking = A nengeni...
answer-submitting = A tinanó...
answer-checking-status = A nengeni ewe pwóón
answer-submitting-status = A tinanó ewe pwóón
answer-correct = Pwúng
answer-incorrect = Ese pwúng
answer-response-saved = A fen isois ewe pwóón
answer-percent-credit = { $percent }% kiritit
answer-percent-correct = { $percent }% pwúng
answer-percent-short = { $percent } %
max-credit-available = Úkúkún kiritit mi tongeni: { $percent }%
# One form for any count above none: «sótun» is the same word after «eew» as
# after «engón», so a `one` branch would render what the default already
# renders. The count is still printed and still formatted.
attempts-remaining =
    { $count ->
        [0] esap wor sótun mi nom
       *[other] { $count } sótun mi nom
    }
validation-correct = (Pwúng)
validation-incorrect = (Ese pwúng)
validation-partially-correct = (Pwúng nge esap unusen)
# No select, for the reason given above: «pwóón» does not change after a
# numeral.
answer-show-responses = Pwáraatá { $count } pwóón ngeni { $answerId }

## Disclosure panels

feedback-heading = Kapas Ngonuk
collapsible-click-to-open = (chchik pwe epwe suuk)
collapsible-click-to-close = (chchik pwe epwe eppino)
collapsible-initializing = A poputá...
footnote-show = Pwáraatá ewe kapas fán
footnote-hide = Esap pwáraatá ewe kapas fán
description-more-information = pwóróus chómmóng

## Controls

slider-previous = Mwen
slider-next = Mwirin
keyboard-open = Suuki ewe Kiipoot
keyboard-close = Eppino ewe Kiipoot
choice-input-remove-choice = Amwúchú { $choice }
matrix-remove-row = Amwúchú eew rooch
matrix-add-row = Apacha eew rooch
matrix-remove-column = Amwúchú eew koonom
matrix-add-column = Apacha eew koonom
subset-add-remove-points = Apacha/Amwúchú poin
subset-toggle-points-intervals = Ekkesiwin nefinen poin me kinikin
subset-move-points = Amwékútú Poin
subset-clear = Amwúchúnó Meinisin
orbital-add-row = Apacha Rooch
orbital-remove-row = Amwúchú Rooch
orbital-add-box = Apacha Pwoos
orbital-remove-box = Amwúchú Pwoos
orbital-add-up-arrow = Apacha Fótúk Feita
orbital-add-down-arrow = Apacha Fótúk Feitiw
orbital-remove-arrow = Amwúchú Fótúk
orbital-row-label = Iten rooch { $row }
pretzel-answer = Pwóón

## Math input

math-input-preview-region = nengeni mwen ewe kapasen matematik
math-input-preview = Nengeni Mwen
math-input-invalid-expression = Kapasen matematik mi mwáál:

## Document status

viewer-initializing = A poputá...

## Errors

error-heading = Mwáál
error-found-at =
    { $span ->
        [line] Kúna wóón nain { $startLine }.
       *[lines] Kúna wóón nain { $startLine }–{ $endLine }.
    }
document-contains-errors = Mi wor mwáál wóón ei taropwe!
diagnostic-heading-error = Mwáál
diagnostic-heading-warning = Túmwúnú
diagnostic-heading-information = Pwóróus
diagnostic-heading-hint = Áninnis
accessibility-heading-level-1 = Atain WCAG AA usun tongeni tori
accessibility-heading-level-2 = Kapas éúréúr usun tongeni tori
something-went-wrong = Mi wor eew mettóch mi mwáál.
renderer-load-failed = eew ri-pwáraatá ese tongeni poputá. Kose mochen fóri sefán ewe peich.
core-start-failed = Ese tongeni poputá ei taropwe. Kose mochen fóri sefán ewe peich.
core-start-failed-busy = Ese tongeni poputá ei taropwe. Chómmóng taropwe ra poputá fengen fitiw, iwe a tongeni ttam wóón eew mesin mi ttam. Fóri sefán ewe peich epwe tongeni áninnis mwirin án ekkewe ekkóch taropwe wesino.
core-start-failed-retry = Ese tongeni poputá ei taropwe.
core-start-failed-busy-retry = Ese tongeni poputá ei taropwe. Chómmóng taropwe ra poputá fengen fitiw, iwe a tongeni ttam wóón eew mesin mi ttam.
core-start-retry = Sótuni sefán
saved-state-unavailable = Ese tongeni pwáraatá óm angang mi fen isois.
