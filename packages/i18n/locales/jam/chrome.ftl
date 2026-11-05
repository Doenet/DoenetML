# Jamaican Creole (Patwa, «Jamiekan») viewer chrome. Translated from
# `locales/en/chrome.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** These four files are written in the **Cassidy phonemic
# orthography** (Cassidy 1961, as regularized by the Jamaican Language Unit at
# UWI Mona). They are not written in English-based spelling. Most everyday
# written Jamaican — song lyrics, social media, advertising, published
# dialogue in novels and newspapers — uses English spelling conventions
# instead, so this catalog does not look like what a Jamaican reader usually
# sees written. A reviewer who decides the English-based system is wanted here
# would **respell** the whole catalog rather than retranslate it: the words and
# the grammar would stand, only the letters would move. That is why the choice
# has to be made once and applied to all four files together, and why a file
# half in one system and half in the other is the one outcome to avoid.
#
# The parts of the system that carry the load here, because they are what a
# reader trips over:
#
#   * **Five vowels**, `i e a o u`, each with one value. The **long vowels are
#     written doubled** — `ii`, `aa`, `uu`: «tii» *tea*, «taak» *talk*,
#     «tuu» *two*, «griin» *green*, «bluu» *blue*.
#   * **Three diphthongs**, `ie`, `ai`, `ou`: «niem» *name*, «brait» *bright*,
#     «tou» *toe*. So *make* is «miek», *time* is «taim», *show* is «shuo».
#   * **Palatal onsets written `ky` and `gy`**: «kyaan» *cannot*, «gyal»
#     *girl*, «kyar» *car*.
#   * **`h` is written only where it is pronounced.** «uman» *woman*, «aid»
#     *hide*, «elp» *help*, against «hous» *house* and «hat» *hot*. The letter
#     is not restored by English analogy, and it is not dropped by analogy
#     either: it goes where the word is said with one.
#   * **No apostrophes** stand in for "missing" English letters. The system
#     spells what is said, not what English would have spelled: «lef», not
#     «lef'»; «don», not «done»; «dem», not «'em».
#
# **No diacritics are used** anywhere in these files. Every character is a
# plain ASCII letter.
#
# **Number.** `Intl.PluralRules` has no CLDR data of its own for `jam`; the
# probe resolves it to `en-US` and reports `['one', 'other']`. Jamaican Creole
# does not inflect a noun after a numeral — «tuu buk», never a pluralized
# noun — and marks plurality with the postposed particle «dem» («di buk dem»),
# which a count does not trigger. So the `one` and `other` branches would be
# word-for-word identical here, and where that is so this file writes **one
# unselected form** instead of two identical branches. English's explicit
# `[0]` literal in `attempts-remaining` matches the number itself, not a
# plural category, and is kept as a branch.
#
# **Loans, named.** The technical vocabulary comes from English, as it does in
# Jamaican generally, and is written in Cassidy spelling with Jamaican grammar
# around it: «kompuonent», «atribyut», «fongkshan», «vekta», «espreshan»,
# «kiibuod», «priivyuu», «dokyument», «renda», «kredit». The words doing the
# grammatical work are Jamaican: «a» for the progressive and for the equative
# copula, «de» for location, «did» for past, «wi» for future, «mos» for
# obligation, «fi» for purpose and possession, «no»/«naa» for negation,
# «kyaan» for *cannot*, «no av» for *does not have*.
#
# So the technical vocabulary in this file is **an English loan set carried in
# Jamaican Creole's own grammar and written in Cassidy spelling**. The loans
# are the words the language actually uses for these things; the sentences
# around them are Jamaican, not English. A Cassidy-spelled English loan is
# correct here. An English sentence anywhere in these four files is a defect.


## Answer submission

answer-checking = A chek...
answer-submitting = A sen...
answer-checking-status = A chek di ansa
answer-submitting-status = A sen di ansa
answer-correct = Korek
answer-incorrect = No korek
answer-response-saved = Ansa Siev
answer-percent-credit = { $percent }% Kredit
answer-percent-correct = { $percent }% Korek
answer-percent-short = { $percent } %
max-credit-available = Muos kredit yu kyan get: { $percent }%
attempts-remaining =
    { $count ->
        [0] no chans no lef
       *[other] { $count } chans lef
    }
validation-correct = (Korek)
validation-incorrect = (No korek)
validation-partially-correct = (Paat a it korek)
answer-show-responses = Shuo { $count } ansa we sen gi { $answerId }


## Disclosure panels

feedback-heading = Fiidbak
collapsible-click-to-open = (klik fi uopn it)
collapsible-click-to-close = (klik fi kluoz it)
collapsible-initializing = A staat op...
footnote-show = Shuo di futnuot
footnote-hide = Aid di futnuot
description-more-information = muo infarmieshan


## Controls

slider-previous = Bak
slider-next = Neks
keyboard-open = Uopn Di Kiibuod
keyboard-close = Kluoz Di Kiibuod
choice-input-remove-choice = Tek we { $choice }
matrix-remove-row = Tek we wan ruo
matrix-add-row = Put wan ruo
matrix-remove-column = Tek we wan kolom
matrix-add-column = Put wan kolom
subset-add-remove-points = Put/Tek we pwaint
subset-toggle-points-intervals = Swich bitwiin pwaint an intovol
subset-move-points = Muuv Di Pwaint Dem
subset-clear = Kliar
orbital-add-row = Put Wan Ruo
orbital-remove-row = Tek We Wan Ruo
orbital-add-box = Put Wan Baks
orbital-remove-box = Tek We Wan Baks
orbital-add-up-arrow = Put Wan Aro We Point Op
orbital-add-down-arrow = Put Wan Aro We Point Dong
orbital-remove-arrow = Tek We Wan Aro
orbital-row-label = Liebl fi ruo { $row }
pretzel-answer = Ansa


## Math input

math-input-preview-region = priivyuu a di mat espreshan
math-input-preview = Priivyuu
math-input-invalid-expression = Di espreshan no valid:


## Document status

viewer-initializing = A staat op...


## Errors

error-heading = Era

error-found-at =
    { $span ->
        [line] Fain pan lain { $startLine }.
       *[lines] Fain pan lain { $startLine }–{ $endLine }.
    }

document-contains-errors = Dis dokyument av era iina it!

diagnostic-heading-error = Era
diagnostic-heading-warning = Waanin
diagnostic-heading-information = Info
diagnostic-heading-hint = Hint

accessibility-heading-level-1 = WCAG AA Aksesibiliti Vaiolieshan
accessibility-heading-level-2 = Aksesibiliti alat

something-went-wrong = Sitn gaan rang.
renderer-load-failed = wan renda kyaan luod. Du, riluod di piej.
core-start-failed = Dis dokyument kyaan staat. Du, riluod di piej.
core-start-failed-busy = Dis dokyument kyaan staat. Nof dokyument did a staat di siem taim, an dat kyan tek langa pan wan sluo divais. Riluod di piej kyan elp wans di ada dokyument dem don.
core-start-failed-retry = Dis dokyument kyaan staat.
core-start-failed-busy-retry = Dis dokyument kyaan staat. Nof dokyument did a staat di siem taim, an dat kyan tek langa pan wan sluo divais.
core-start-retry = Chrai agen
saved-state-unavailable = Wi kyaan luod di wok we yu did siev.
