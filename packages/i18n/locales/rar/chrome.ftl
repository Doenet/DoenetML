# Rarotongan / Cook Islands Māori (Te reo Māori Kūki ʻĀirani) viewer chrome.
# Translated from `locales/en/chrome.ftl`, which is the source of truth:
# `lint:i18n` rejects a key that does not exist there, and reports a key that
# exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Which variety.** The tag `rar` names Rarotongan, and this catalog is
# written in **the Rarotonga standard** — the variety of the Cook Islands
# Māori Dictionary and of most published Cook Islands Māori. That is a choice
# and not a neutral default: the language is spoken across the whole group,
# and Aitutaki, Ātiu, Mangaia, Mauke and Mitiāro each differ from Rarotonga in
# vocabulary and in where a glottal stop falls, while Pukapukan (`pkp`) and
# Penrhyn/Tongarevan (`pnh`) are separate languages with codes of their own
# and are **not** what this file is. A reviewer from another island who finds
# a word here that is not theirs has found an island difference rather than an
# error, and the right fix is a note, not a silent replacement.
#
# **Orthography.** Both marks that distinguish words are written: the glottal
# stop as the *amata* «ʻ» and vowel length as the macron. The amata here is
# **U+02BB MODIFIER LETTER TURNED COMMA** throughout — the same character
# `locales/ty` and `locales/to` use — and never U+0027 or U+2019, which render
# alike and compare unequal. A mixed convention is invisible to the linter and
# breaks nothing until someone greps; so it is stated here and held to in all
# four files. The consonants of the language are p, t, k, m, n, ng, v, r and
# the amata: **no h, no f, no w, no wh, no l, no s**, and a word here
# containing one of those is a loan and is marked as such below.
#
# **The three Eastern Polynesian catalogs, and where they part.** This file was
# written beside `locales/mi` (New Zealand Māori) and `locales/ty` (Tahitian),
# and the point of reading all three is the differences rather than the
# overlap. The regular correspondences this seed leaned on:
#
#   | meaning        | `mi`         | `ty`         | `rar` (here)  |
#   | -------------- | ------------ | ------------ | ------------- |
#   | causative      | whaka-       | faʻa-        | **ʻaka-**     |
#   | nominalizer    | -nga/-tanga  | -raʻa        | **-ʻanga**    |
#   | four           | whā          | fā           | **vā**        |
#   | house          | whare        | hare         | **ʻare**      |
#   | to hide        | huna         | hunā         | **ʻuna**      |
#   | plural article | ngā          | te mau       | **te au**     |
#   | not            | kāore        | ʻaita        | **kāre**      |
#   | this           | tēnei        | teie         | **teia**      |
#   | a, a certain   | tētahi       | te tahi      | **tētai**     |
#   | progressive    | kei te …     | te … nei     | **tē … nei**  |
#
# Genuinely shared three ways, and used here as such: «tika» correct, «tuku»
# to send, «tapa» edge, «mua»/«muri» before/after, «runga»/«raro» up/down,
# «toe» to remain, «tatau» to count, «tapatoru» triangle, «tāmata» to try,
# «pouaka» box.
#
# Where this file deliberately differs from both siblings: «tuatua» for word
# or speech (`mi` «kōrero», `ty` «parau»), «tātā» for to write (`mi` «tuhi»,
# `ty` «papaʻi»), «ʻakara» for to look (`mi` «mātakitaki», `ty` «hiʻo»),
# «maʻata» for much (`mi` «nui», `ty` «rahi»), «kapi» for page (`mi`
# «whārangi», `ty` «ʻāpī»), «tarevake» for a mistake (`mi` «hē», `ty` «hape»).
# None of that is a respelling of Māori, and this file must not be edited into
# one: where Rarotongan simply has its own word, that word is the point.
#
# **Loans, said plainly.** Cook Islands schooling and its mathematics teaching
# are in English, and the language's institutional loans come from English
# rather than from French — which is the sharpest practical difference from
# `locales/ty`, whose technical vocabulary is French-derived. Where this seed
# could not reach a Rarotongan word it keeps the English one and says so
# rather than inventing a Polynesian dress for it. In this file that is:
# «WCAG» (a standard's name, untranslated everywhere).
#
# **Coinages in this file, for a reviewer to confirm or replace.** Each is
# built by the language's own productive rule, and none is attested to this
# seed: «papa tātā» keyboard (writing-board), «tātāʻanga vaevae» footnote
# (foot-writing), «rārangi tū» column beside «rārangi» row, «urunga»
# accessibility (from «uru» to enter), «ʻakapotoʻanga» summary, «ʻakaraʻanga
# mua» preview. Two words this seed is **least** sure of and a reviewer should
# check first: «ʻuaki» to open and «ʻōpani» to close — the second may be a
# Tahitian loan rather than a Rarotongan word, and if Rarotongan has its own
# pair they belong here and in `collapsible-click-to-*` together.
#
# **Number.** Rarotongan marks no number on the noun — «te rārangi» one line,
# «te au rārangi» many, and the noun itself does not move — so a count in
# front of a word changes nothing about it. `Intl.PluralRules("rar")` has no
# CLDR data and resolves against the runtime's default locale, so a `[two]`,
# `[few]` or `[many]` branch here would be text nothing could select. Where
# English's two branches differ only in the noun's number this file writes a
# **single unselected form**, as `locales/sm` and `locales/ty` do; a `[0]`
# branch stays wherever English has one, because it names none rather than
# counting.
#
# **No grammatical gender**, so no message in these four files forks on
# `$gender`, and `noun-gender` in `content.ftl` answers one token. **No
# `$role` fork** either: nothing here changes shape between standing alone and
# sitting inside a clause.
#
# **Word order: the describing word follows the noun** — «rārangi mātotoru» —
# which is what `mi`, `ty`, `sm`, `to` and every other Polynesian catalog in
# the roster does. `content.ftl` writes that out.


## Answer submission

answer-checking = Tē ʻakara nei...
answer-submitting = Tē tuku nei...
answer-checking-status = Tē ʻakara nei i te pauʻanga
answer-submitting-status = Tē tuku nei i te pauʻanga
answer-correct = Tika
answer-incorrect = Tarevake
answer-response-saved = Kua ʻakaputuʻia te pauʻanga
answer-percent-credit = { $percent }% o te tāpura
answer-percent-correct = { $percent }% tika
answer-percent-short = { $percent } %
max-credit-available = Tāpura maʻata roa e rauka: { $percent }%
# No select: «tāmataʻanga» is the same word for one and for many. The `[0]`
# branch stays, because it names none rather than counting.
attempts-remaining =
    { $count ->
        [0] kāre e tāmataʻanga i toe
       *[other] e { $count } tāmataʻanga i toe
    }
validation-correct = (Tika)
validation-incorrect = (Tarevake)
validation-partially-correct = (Tika i tētai tuʻanga)
# No select, for the reason above. `$answerId` is the author's own name for
# the answer and is never translated.
answer-show-responses = ʻAkaʻite i te { $count } pauʻanga ki { $answerId }

## Disclosure panels

feedback-heading = Manako ʻakaʻoki
collapsible-click-to-open = (pāto kia ʻuaki)
collapsible-click-to-close = (pāto kia ʻōpani)
collapsible-initializing = Tē ʻakamata nei...
footnote-show = ʻAkaʻite i te tātāʻanga vaevae
footnote-hide = ʻUna i te tātāʻanga vaevae
description-more-information = ʻakakiteʻanga maʻata atu

## Controls

slider-previous = Mua
slider-next = Muri
keyboard-open = ʻUaki i te papa tātā
keyboard-close = ʻŌpani i te papa tātā
choice-input-remove-choice = ʻIriti iā { $choice }
matrix-remove-row = ʻIriti i te rārangi
matrix-add-row = Tāpiri i tētai rārangi
matrix-remove-column = ʻIriti i te rārangi tū
matrix-add-column = Tāpiri i tētai rārangi tū
subset-add-remove-points = Tāpiri/ʻIriti ira
subset-toggle-points-intervals = Taui i te au ira e te au vā
subset-move-points = ʻAkaneke i te au ira
subset-clear = Tāmā
orbital-add-row = Tāpiri i tētai rārangi
orbital-remove-row = ʻIriti i te rārangi
orbital-add-box = Tāpiri i tētai pouaka
orbital-remove-box = ʻIriti i te pouaka
orbital-add-up-arrow = Tāpiri i tētai pere ki runga
orbital-add-down-arrow = Tāpiri i tētai pere ki raro
orbital-remove-arrow = ʻIriti i te pere
orbital-row-label = Tāpaʻo nō te rārangi { $row }
pretzel-answer = Pauʻanga

## Math input

math-input-preview-region = ʻakaraʻanga mua i te tuatua numero
math-input-preview = ʻAkaraʻanga mua
math-input-invalid-expression = Tuatua numero tano kore:

## Document status

viewer-initializing = Tē ʻakamata nei...

## Errors

error-heading = Tarevake
error-found-at =
    { $span ->
        [line] Kua kiteʻa i te rārangi { $startLine }.
       *[lines] Kua kiteʻa i te au rārangi { $startLine }–{ $endLine }.
    }
document-contains-errors = Tē vai nei te tarevake i roto i teia tātāʻanga!
diagnostic-heading-error = Tarevake
diagnostic-heading-warning = ʻAkamatakite
diagnostic-heading-information = ʻAkakiteʻanga
diagnostic-heading-hint = Aratakiʻanga
# `WCAG AA` is the name of a standard and is not translated.
accessibility-heading-level-1 = Takingaʻanga i te ture urunga WCAG AA
accessibility-heading-level-2 = ʻAkamatakite nō te urunga
something-went-wrong = Kua tarevake tētai mea.
renderer-load-failed = kāre tētai ʻāpai tūtū i uta mai. Uta ʻakaʻou i te kapi.
core-start-failed = Kāre teia tātāʻanga i rauka i te ʻakamata. Uta ʻakaʻou i te kapi.
core-start-failed-busy = Kāre teia tātāʻanga i rauka i te ʻakamata. E maʻata te au tātāʻanga i ʻakamata tāokotaʻi, e ka roa atu te reira i runga i tētai mātini pāneʻe. Penei ka tauturu te uta ʻakaʻouʻanga i te kapi me oti te au tātāʻanga ke.
core-start-failed-retry = Kāre teia tātāʻanga i rauka i te ʻakamata.
core-start-failed-busy-retry = Kāre teia tātāʻanga i rauka i te ʻakamata. E maʻata te au tātāʻanga i ʻakamata tāokotaʻi, e ka roa atu te reira i runga i tētai mātini pāneʻe.
core-start-retry = Tāmata ʻakaʻou
saved-state-unavailable = Kāre tāʻau angaʻanga i ʻakaputuʻia i rauka i te uta mai.
