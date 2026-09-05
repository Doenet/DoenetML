# Niuean (ko e vagahau Niue) viewer chrome. Translated from
# `locales/en/chrome.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** Standard Niuean as the Niue Language Commission and the
# school readers write it: sixteen letters, and the macron «ā ē ī ō ū» where
# vowel length is part of the spelling («hūhū», «tā», «fufū»). Niuean has
# **no glottal-stop letter** — this is the first and most visible way it is not
# Tongan. Where Tongan writes the fakauʻa, Niuean writes nothing at all:
# Tongan «ʻuliʻuli», «moʻoni», «fehuʻi» are Niuean «uli», «mooli», «hūhū».
# A corrector must not import Tongan's «ʻ» into this file; the doubled vowel
# «oo» in «mooli» is the spelling, not a typo.
#
# **Relation to `locales/to`.** Tongan is Niuean's closest relative and was read
# throughout. Where a word is genuinely the same in both, this file says so at
# the message; where Niuean has its own word, it uses it. Deliberate departures
# from Tongan, all of them real Niuean words rather than respellings:
#
#   English        Tongan            Niuean (here)
#   open           fakaava           hafagi
#   close          tāpuni            pā
#   show           fakahā            fakakite
#   add            tānaki            lafi
#   press/click    lomiʻi            lomi
#   page           peesi             lau
#   true           moʻoni            mooli
#   plural marker  ngaahi / ʻu       tau
#
# Shared with Tongan on purpose, and flagged rather than disguised: «tali»
# (answer), «sivi» (to check, to test), «kehekehe» (variant), «efuefu» (grey),
# «moli» (orange), «fufū» (to hide). Those are one Polynesian word each, not
# Tongan borrowed into Niuean. `content.ftl` carries the colour and noun tables
# and is canonical for all four files.
#
# **Number.** Niuean marks plural with the preposed particle «tau» and a noun
# after a numeral is never marked — «tolu e lali», three attempts, with the
# noun in its bare form. So a `{ $count -> … }` whose two English branches
# differ only in the noun's number renders one string here and the select is
# dropped, exactly as `locales/sm` and `locales/to` do. An explicit `[0]`
# branch stays wherever English has one: it names none rather than counting.
#
# **No grammatical gender**, and **no `$role` fork** — see `content.ftl`.


## Answer submission

answer-checking = Sivi hifo…
answer-submitting = Fakafano atu…
answer-checking-status = Sivi e tali
answer-submitting-status = Fakafano atu e tali
answer-correct = Tonu
answer-incorrect = Hehē
answer-response-saved = Kua tuku e tali
answer-percent-credit = { $percent }% he mataitohi
answer-percent-correct = { $percent }% tonu
answer-percent-short = { $percent } %
max-credit-available = Mataitohi mua atu ka maeke ke moua: { $percent }%
# No select on the noun: «lali» is the word for one attempt and for many. The
# `[0]` branch stays, because it names none rather than counting.
attempts-remaining =
    { $count ->
        [0] kua nakai toe ha lali
       *[other] toe { $count } e lali
    }
validation-correct = (Tonu)
validation-incorrect = (Hehē)
validation-partially-correct = (Tonu fakavala)
# No select, for the reason above. `$answerId` is the author's own name for the
# answer and is never translated.
answer-show-responses = Fakakite { $count } e tali ke he { $answerId }


## Disclosure panels

feedback-heading = Fakamatalaaga
collapsible-click-to-open = (lomi ke hafagi)
collapsible-click-to-close = (lomi ke pā)
collapsible-initializing = Kua kamata…
footnote-show = Fakakite e matakupu hifo
footnote-hide = Fufū e matakupu hifo
description-more-information = fakailoaaga foki


## Controls

slider-previous = Mua
slider-next = Hoko
keyboard-open = Hafagi e papa kī
keyboard-close = Pā e papa kī
choice-input-remove-choice = Tuku kehe { $choice }
matrix-remove-row = Tuku kehe e laini
matrix-add-row = Lafi taha laini
matrix-remove-column = Tuku kehe e koluma
matrix-add-column = Lafi taha koluma
subset-add-remove-points = Lafi/Tuku kehe e tau poini
subset-toggle-points-intervals = Hikihiki e tau poini mo e tau vahāloto
subset-move-points = Hiki e tau poini
subset-clear = Fakamea
orbital-add-row = Lafi taha laini
orbital-remove-row = Tuku kehe e laini
orbital-add-box = Lafi taha puha
orbital-remove-box = Tuku kehe e puha
orbital-add-up-arrow = Lafi taha hana ki luga
orbital-add-down-arrow = Lafi taha hana ki lalo
orbital-remove-arrow = Tuku kehe e hana
orbital-row-label = Fakamailoga ke he laini { $row }
pretzel-answer = Tali


## Math input

math-input-preview-region = kitekite fakamua he talahauaga fika
math-input-preview = Kitekite fakamua
math-input-invalid-expression = Talahauaga fika nakai tonu:


## Document status

viewer-initializing = Kua kamata…


## Errors

error-heading = Hehē
error-found-at =
    { $span ->
        [line] Ne moua he laini { $startLine }.
       *[lines] Ne moua he tau laini { $startLine }–{ $endLine }.
    }
document-contains-errors = Kua ha ha he tohi nei e tau hehē!
diagnostic-heading-error = Hehē
diagnostic-heading-warning = Fakatokanga
diagnostic-heading-information = Fakailoaaga
diagnostic-heading-hint = Tomatoma
accessibility-heading-level-1 = Moumouaga he tuaga hokotia WCAG AA
accessibility-heading-level-2 = Fakatokanga ke he hokotia
something-went-wrong = Kua tupu taha mena hehē.
renderer-load-failed = nakai maeke he taha renderer ke uta mai. Fakamolemole, liu uta foki e lau.
core-start-failed = Nakai maeke e tohi nei ke kamata. Fakamolemole, liu uta foki e lau.
core-start-failed-busy = Nakai maeke e tohi nei ke kamata. Ne kamata fakalataha e tau tohi loga, ti maeke ke leva he mena tahi tuai. Ka oti e tau tohi kehe, liga lagomatai e liu uta foki he lau.
core-start-failed-retry = Nakai maeke e tohi nei ke kamata.
core-start-failed-busy-retry = Nakai maeke e tohi nei ke kamata. Ne kamata fakalataha e tau tohi loga, ti maeke ke leva he mena tahi tuai.
core-start-retry = Liu lali foki
saved-state-unavailable = Nakai maeke ke uta mai hāu a gahua ne tuku.
