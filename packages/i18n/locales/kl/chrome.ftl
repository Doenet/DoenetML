# Kalaallisut (Greenlandic) viewer chrome. Translated from
# `locales/en/chrome.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** The **1973 orthography**, which is the one Greenland has
# taught, printed and legislated in since it replaced Kleinschmidt's. Its
# letters are `a e f g i j k l m n o p q r s t u v` plus the loan letters
# `b c d h w x y z æ ø å`, which appear only inside Danish loans. The
# Kleinschmidt letter **ĸ (U+0138, kra) is not used anywhere in these four
# files**: every one of its occurrences is written `q`, as the 1973 reform
# directs — «qujanaq», never «ĸujanaĸ». Doubled vowels and consonants are
# written out (`aa`, `ii`, `uu`, `rr`, `ll`, `tt`), because in this
# orthography length is spelling rather than an accent, and no accented vowel
# occurs in Kalaallisut words here.
#
# **Number.** `Intl.PluralRules("kl")` resolves to `kl` and selects **one**
# and **other**, and Kalaallisut earns both: a counted noun takes the plural
# ending — «misileraaneq ataaseq» beside «misileraanerit marluk» — so the two
# branches are genuinely different words and both are written. No `few` or
# `many` branch appears; the locale cannot select one. English's explicit
# `[0]` literal matches the number itself and is kept.
#
# **Compounding.** Kalaallisut builds a sentence by suffixing, and much of
# what English says with a separate word is an ending here. That works
# against the placeables: an ending cannot be welded onto `{ $choice }` or
# `{ $answerId }`, whose final sound this catalog never sees. So wherever a
# case ending would have attached to an argument, the sentence is built
# around it with separate words instead — «{ $choice } peeruk», not a
# case-marked form of the argument. That is a recorded debt, not a style.
#
# **Confidence.** The four files below are seeded from the modern
# administrative and school register, which Kalaallisut genuinely has: the
# vocabulary of Greenland's own school system, Inatsisartut's published
# Greenlandic, and KNR. Where that register has no settled Kalaallisut word,
# the **Danish loan** is written rather than a coinage, in Greenlandic
# spelling. «Tastatur» is such a loan and is the word in use. So are
# «rækki», «søjli», «kassi» and «pili» on the matrix and orbital controls, and
# «punkti» and «intervalli» on the subset strip: Greenland's school
# mathematics is taught in Danish terms, and those are the words a reader
# would meet.

## Answer submission

answer-checking = Misissorneqarpoq...
answer-submitting = Nassiunneqarpoq...
answer-checking-status = Akissut misissorneqarpoq
answer-submitting-status = Akissut nassiunneqarpoq
answer-correct = Eqqortoq
answer-incorrect = Eqqunngitsoq
answer-response-saved = Akissut toqqorneqarpoq
answer-percent-credit = { $percent }% poointit
answer-percent-correct = { $percent }% eqqortoq
answer-percent-short = { $percent } %
max-credit-available = Poointit annerpaamik pisinnaasat: { $percent }%
attempts-remaining =
    { $count ->
        [0] misileraanerit sinneruttut peqanngillat
        [one] { $count } misileraaneq sinneruppoq
       *[other] { $count } misileraanerit sinnerupput
    }
validation-correct = (Eqqortoq)
validation-incorrect = (Eqqunngitsoq)
validation-partially-correct = (Ilaatigut eqqortoq)
answer-show-responses =
    { $count ->
        [one] { $answerId } akissutaa { $count } takutiguk
       *[other] { $answerId } akissutai { $count } takutikkit
    }


## Disclosure panels

feedback-heading = Oqaaseqaatit
collapsible-click-to-open = (ammarniarlugu tooruk)
collapsible-click-to-close = (matuniarlugu tooruk)
collapsible-initializing = Aallartinneqarpoq...
footnote-show = Ataani allassimasoq takutiguk
footnote-hide = Ataani allassimasoq matuuk
description-more-information = paasissutissat allat


## Controls

slider-previous = Siulia
slider-next = Tullia
keyboard-open = Tastatur ammaruk
keyboard-close = Tastatur matuuk
choice-input-remove-choice = { $choice } peeruk
matrix-remove-row = Rækki peeruk
matrix-add-row = Rækki ilanngullugu
matrix-remove-column = Søjli peeruk
matrix-add-column = Søjli ilanngullugu
subset-add-remove-points = Punktit ilanngullugit imaluunniit peerlugit
subset-toggle-points-intervals = Punktit intervallillu akornanni allanngortiguk
subset-move-points = Punktit nuutikkit
subset-clear = Peerukkit
orbital-add-row = Rækki ilanngullugu
orbital-remove-row = Rækki peeruk
orbital-add-box = Kassi ilanngullugu
orbital-remove-box = Kassi peeruk
orbital-add-up-arrow = Pili qulamukartoq ilanngullugu
orbital-add-down-arrow = Pili ammukartoq ilanngullugu
orbital-remove-arrow = Pili peeruk
orbital-row-label = Rækkimut { $row } ateq
pretzel-answer = Akissut


## Math input

math-input-preview-region = matematikkikkut allakkat takutinnerat
math-input-preview = Takutitsineq
math-input-invalid-expression = Matematikkikkut allakkat eqqunngitsut:


## Document status

viewer-initializing = Aallartinneqarpoq...


## Errors

error-heading = Kukkuneq
error-found-at =
    { $span ->
        [line] Nassaarineqarpoq linjemi { $startLine }.
       *[lines] Nassaarineqarpoq linjeni { $startLine }–{ $endLine }.
    }
document-contains-errors = Allakkani makkunani kukkunerpassuit!
diagnostic-heading-error = Kukkuneq
diagnostic-heading-warning = Mianersoqqussut
diagnostic-heading-information = Paasissutissat
diagnostic-heading-hint = Ikiuut
accessibility-heading-level-1 = WCAG AA atorsinnaanermut unioqqutitsineq
accessibility-heading-level-2 = Atorsinnaanermut mianersoqqussut
something-went-wrong = Kukkuneqarpoq.
renderer-load-failed = takutitsissut aallerneqarsinnaanngilaq. Quppernera nutaanngortikkiuk.
core-start-failed = Allakkat makku aallartinneqarsinnaanngillat. Quppernera nutaanngortikkiuk.
core-start-failed-busy = Allakkat makku aallartinneqarsinnaanngillat. Allakkat arlallit ataatsikkut aallartinneqarput, tamannalu qarasaasiami sukkanngitsumi sivisunerusinnaavoq. Allat naammassippata quppernera nutaanngortikkuit ikiorsinnaavoq.
core-start-failed-retry = Allakkat makku aallartinneqarsinnaanngillat.
core-start-failed-busy-retry = Allakkat makku aallartinneqarsinnaanngillat. Allakkat arlallit ataatsikkut aallartinneqarput, tamannalu qarasaasiami sukkanngitsumi sivisunerusinnaavoq.
core-start-retry = Misileqqiguk
saved-state-unavailable = Suliatit toqqorsimasat atuarneqarsinnaanngillat.
