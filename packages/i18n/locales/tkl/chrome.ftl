# Tokelauan (Gagana Tokelau) viewer chrome. Translated from
# `locales/en/chrome.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** The standard spelling taught in Tokelau and used by the
# Tokelau Dictionary: the five vowels a e i o u, **macrons on the long
# vowels** (ā ē ī ō ū), and the velar nasal written **`g`** — never `ng` — so
# the language names itself «Gagana Tokelau». **Tokelauan has no glottal stop
# and none is written here**: the koma liliu «ʻ» that is part of Samoan
# spelling has no counterpart in this language, and a «ʻ» anywhere in these
# four files would be an error rather than a variant. A macron is part of the
# spelling and not decoration; where this seed has left one out it is a
# mistake to fix.
#
# **Samoan is the nearest existing catalog, and this file is not a copy of
# it.** Tokelauan and Samoan are both Samoic-Outlier Polynesian and share a
# great deal of inherited vocabulary, so a word that comes out the same in
# both is often simply right: «tali», «togi», «lanu», «laina», «igoa»,
# «vaega», «muamua», «taumafai» are the two languages' common inheritance and
# stand here because they are Tokelauan, not because `locales/sm` has them.
# What must never come out the same is anything the regular correspondences
# touch:
#
#   Samoan «s»  → Tokelauan «h»   sesē → hehē, sili → hili, sino → hino,
#                                 tasi → tahi, tutusa → tutuha,
#                                 faʻamalositino → fakamalohitino
#   Samoan «ʻ»  → Tokelauan «k»   where the glottal continues PPn *k:
#                                 faʻa- → faka-, aʻoaʻo → akoako,
#                                 piʻo → piko, tuaoi → tuakoi,
#                                 tuʻu → tuku, ʻafai → kafai,
#                                 amata → kamata, ʻese → kehe
#   Samoan «ʻ»  → nothing         where it does not: vaʻai → vaai,
#                                 faʻafitauli's «-fitauli» is untouched
#
# **That last pair is this seed's largest single risk.** The Samoan koma
# liliu has two histories and only one of them surfaces as a Tokelauan «k»,
# and this seed had to judge which applied word by word. Where it judged
# wrong the result is not a misspelling but a different word. The words it is
# least sure of are named at the foot of this header.
#
# **Tokelauan has no t/k register split.** Samoan's colloquial register turns
# «t» into «k» and «n» into «g»; Tokelauan does not, so there is one spelling
# here rather than a formal and an informal one, and every «k» in these files
# is a real «k».
#
# **`locales/tvl` (Tuvaluan) is a sibling in this same batch, and the two
# catalogs are expected to look alike.** Tuvaluan is Tokelauan's closest
# relative and the same correspondences run through it, so agreement between
# the two files is what relatedness predicts and is **not evidence that
# either is right** — two seeds can be wrong together in the same way. Check
# this file against Tokelauan, never against `tvl`.
#
# **No grammatical gender.** `noun-gender` answers one token and no adjective
# in these files forks on `$gender`. **No `$role` fork** either: nothing here
# changes shape between standing alone and sitting inside a clause.
#
# **Number.** A numeral in front of a Tokelauan noun leaves the noun alone —
# «tahi taumafai», «lua taumafai» — so a count never changes the word beside
# it, and the counted messages here are written as a single unselected form.
# Tokelauan does mark plural, but on the article («te» → «nā») and, in a
# family of adjectives, by **reduplicating a syllable**: «lahi» → «lalahi»,
# «loa» → «loloa», «poto» → «popoto». Every description these messages build
# is of one thing, so the singular is right throughout; a message about
# several things would want the reduplicated form, and no argument these
# messages receive would tell a translator so. `Intl.PluralRules` has no CLDR
# data for `tkl` and resolves against the runtime's default locale, so a
# `[two]`, `[few]` or `[many]` branch here would be text nothing could
# select.
#
# **Adjectives follow the noun**, as they do in Samoan — «laina mafiafia
# kula» — so the composition messages in `content.ftl` put the noun first and
# keep the English order among the adjectives themselves. That agreement with
# `locales/sm` is a real fact about both languages rather than a copy.
#
# **Loans, named rather than hidden.** Mathematics and computing are taught
# in Tokelau largely in English, so the technical nouns here are loans
# adapted to Tokelauan spelling and are marked as loans: «poini», «veta»,
# «poligoni», «parapola», «matematika», «kipoti», «lipoti», «etita»,
# «palakalafa», «numela», «koluhe», «matrix», «element». A loan takes «l» and
# never «r», Tokelauan having no /r/.
#
# **The words this seed is least sure of**, where a reviewer should start:
# «liko» (circle, from Samoan «liʻo» by the *k rule, which may not apply
# here), «fakataitaiga» (example — the same rule might make it
# «fakatakitakiga»), «lapatakiga» (warning), «hamahama» (yellow), «lanu
# meamata» (green), «enaena» (brown), «hoko» (next), «ka leai» (otherwise),
# «hakega» (slope, a coinage), «manatu fakafoki» (feedback, a coinage),
# «fakailoga tuhi» (the editor's cursor, a coinage), and «fakamama» (filter)
# beside «fakamamā» (clear), which differ only by a macron. None of these is
# attested by this seed; each is a derivation or a description.


## Answer submission

answer-checking = E hiaki nei...
answer-submitting = E lafo nei...
answer-checking-status = E hiaki nei te tali
answer-submitting-status = E lafo nei te tali
answer-correct = Hako
answer-incorrect = Hehē
answer-response-saved = Kua teu te tali
answer-percent-credit = { $percent }% o te togi
answer-percent-correct = { $percent }% hako
answer-percent-short = { $percent }%
max-credit-available = Togi maualuga e mafai ona maua: { $percent }%
attempts-remaining =
    { $count ->
        [0] kua leai he taumafai e toe
       *[other] e toe { $count } taumafai
    }
validation-correct = (Hako)
validation-incorrect = (Hehē)
validation-partially-correct = (Hako he vaega)
answer-show-responses = Fakaali tali e { $count } ki te { $answerId }

## Disclosure panels

feedback-heading = Manatu fakafoki
collapsible-click-to-open = (kiliki ke tatala)
collapsible-click-to-close = (kiliki ke tapuni)
collapsible-initializing = E kamata nei...
footnote-show = Fakaali te fakamatalaga i lalo
footnote-hide = Huna te fakamatalaga i lalo
description-more-information = nisi fakamatalaga

## Controls

slider-previous = Muamua
slider-next = Hoko
keyboard-open = Tatala te kipoti
keyboard-close = Tapuni te kipoti
choice-input-remove-choice = Ave kehe { $choice }
matrix-remove-row = Ave kehe te laina
matrix-add-row = Fakaopoopo he laina
matrix-remove-column = Ave kehe te koluma
matrix-add-column = Fakaopoopo he koluma
subset-add-remove-points = Fakaopoopo/Ave kehe poini
subset-toggle-points-intervals = Fesuiaki poini ma vā
subset-move-points = Hiki poini
subset-clear = Fakamamā
orbital-add-row = Fakaopoopo he laina
orbital-remove-row = Ave kehe te laina
orbital-add-box = Fakaopoopo he pusa
orbital-remove-box = Ave kehe te pusa
orbital-add-up-arrow = Fakaopoopo he ū ki luga
orbital-add-down-arrow = Fakaopoopo he ū ki lalo
orbital-remove-arrow = Ave kehe te ū
orbital-row-label = Igoa mo te laina { $row }
pretzel-answer = Tali

## Math input

math-input-preview-region = vaaiga muamua o te fakamatalaga matematika
math-input-preview = Vaaiga muamua
math-input-invalid-expression = Fakamatalaga hehē:

## Document status

viewer-initializing = E kamata nei...

## Errors

error-heading = Mea hehē
error-found-at =
    { $span ->
        [line] Na maua i te laina { $startLine }.
       *[lines] Na maua i laina { $startLine }–{ $endLine }.
    }
document-contains-errors = E i ai ni mea hehē i te pepa nei!
diagnostic-heading-error = Mea hehē
diagnostic-heading-warning = Lapatakiga
diagnostic-heading-information = Fakamatalaga
diagnostic-heading-hint = Fautuaga
accessibility-heading-level-1 = Holitulafono i te avanoa faigofie WCAG AA
accessibility-heading-level-2 = Lapatakiga i te avanoa faigofie
something-went-wrong = Na i ai he mea na hehē.
renderer-load-failed = e lē mafai ona uta he mea fakaali. Fakamolemole toe uta te itulau.
core-start-failed = E lē mafai ona kamata te pepa nei. Fakamolemole toe uta te itulau.
core-start-failed-busy = E lē mafai ona kamata te pepa nei. E uke pepa na kamata fakatahi, ma e mafai ona umi ai i he masini tuai. Kafai kua uma nā isi pepa, atonu e aoga te toe uta o te itulau.
core-start-failed-retry = E lē mafai ona kamata te pepa nei.
core-start-failed-busy-retry = E lē mafai ona kamata te pepa nei. E uke pepa na kamata fakatahi, ma e mafai ona umi ai i he masini tuai.
core-start-retry = Toe taumafai
saved-state-unavailable = E lē mafai ona uta tau gāluega na teu.
