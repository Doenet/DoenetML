# Soga (Olusoga) viewer chrome: buttons, panel headers, and other UI the
# reader interacts with. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script and orthography.** Latin, in the **standard Lusoga orthography**
# settled by the Lusoga Language Authority and used by «Eiwanika ly'Olusoga»,
# the Lusoga dictionary. Its distinguishing letter is **`dh`**, the voiced
# dental Luganda does not have and does not write: Lusoga «okwidha» (to come)
# is Luganda «okujja», and Lusoga «amaadhi» (water) is Luganda «amazzi». The
# orthography **not** followed here is the older Luganda-modelled spelling
# that renders that sound `z` or `j` — «amaazi», «okwija» — which is still
# what a Lusoga text set by a Luganda printer tends to look like. `ny` and
# `ŋ` (U+014B) are written as in Luganda — «enkuŋŋaana», not «enkung'aana» —
# and the initial vowel is part of the word, so
# «olunyiriri» is one word and «lunyiriri» is not the same thing said without
# an article. Digits are **Latin** (`1`, `2`, `1,234`), which is what DoenetML
# pins for every locale in `src/intl.ts`.
#
# **Lusoga and Luganda.** They are close, `locales/lg` is on disk beside this
# file, and the honest risk in a machine-written Lusoga seed is that it has
# quietly written Luganda. **That is the first thing a reviewer should hunt
# for**, and the header of each file says where it is most likely to have
# happened. Where Lusoga has its own word this catalog uses it — «ekidha» for
# *next* (what is coming), «okwiramu» for *to answer* where Luganda says
# «okuddamu», «okudhuula» for *to find* where Luganda says «okuzuula», the
# negator **`ti-`** where Luganda uses `te-` / `si-`.
#
# **What is Lusoga here.** «kituufu» / «tikituufu» for right and wrong,
# «eky'okwiramu» for a response, «ensobi» for an error, «olupapula» for a
# page, «olunyiriri» for a row and «empagi» for a column, «okutuukirira» for
# accessibility. A button carries the bare imperative — «Igulawo»,
# «Igalawo», «Ihawo», «Yongerako», «Laga», «Kweka», «Londa» — rather than a
# polite periphrasis.
#
# **What is borrowed, and from where.** **English**, not Swahili. Uganda
# teaches mathematics and science in English from upper primary on, so a
# Lusoga speaker's technical register *is* English and this catalog keeps it
# openly instead of inventing Lusoga words for it: «kiibbodi», «amamaaka»
# (marks), «WCAG». Swahili is not the loan language in Busoga. Where a
# technical term has no Lusoga word at all, the key is **left out** and falls
# back to English rather than being filled with English respelled.
#
# **Weakest here.** «erinnya» for *name* is the Luganda word and is the single
# most likely Luganda intrusion in this file; if Lusoga says something else,
# it should be corrected everywhere, including `orbital-row-label` and the
# editor catalog. «amamaaka» for credit and «akabonero» for a hint are the
# next two to attack.
#
# **Counts.** CLDR gives `xog` its own plural data, with the two categories
# `one` and `other`. A Lusoga noun marks number with a class prefix rather
# than a suffix — «omulundi» one time, «emirundi» several; «eky'okwiramu» one
# answer, «eby'okwiramu» several — and goes on doing so after a numeral, so
# both branches of every select are doing real work. `attempts-remaining`
# keeps its `[0]` branch, an exact-value match rather than a plural category,
# which says «tewali» instead of counting to zero.


## Answer submission

answer-checking = Ekebeera…
answer-submitting = Ewereza…
answer-checking-status = Tukebeera eky'okwiramu
answer-submitting-status = Tuwereza eky'okwiramu
answer-correct = Kituufu
answer-incorrect = Tikituufu
answer-response-saved = Eky'okwiramu Kiterekwa
answer-percent-credit = Amamaaka { $percent }%
answer-percent-correct = { $percent }% Kituufu
answer-percent-short = { $percent } %
max-credit-available = Amamaaka agasinga agasoboka: { $percent }%
attempts-remaining =
    { $count ->
        [0] tewali mulundi gusigaire
        [one] omulundi { $count } gusigaire
       *[other] emirundi { $count } gisigaire
    }
validation-correct = (Kituufu)
validation-incorrect = (Tikituufu)
validation-partially-correct = (Kituufu ku kitundu)
answer-show-responses =
    { $count ->
        [one] Laga eky'okwiramu { $count } ekya { $answerId }
       *[other] Laga eby'okwiramu { $count } ebya { $answerId }
    }


## Disclosure panels

feedback-heading = Okwiramu kw'Omusomesa
collapsible-click-to-open = (nyiga okwigulawo)
collapsible-click-to-close = (nyiga okwigalawo)
collapsible-initializing = Etandika…
footnote-show = Laga ekiwandiiko eky'ewansi
footnote-hide = Kweka ekiwandiiko eky'ewansi
description-more-information = amawulire amalala


## Controls

slider-previous = Ekiyise
slider-next = Ekidha
keyboard-open = Igulawo Kiibbodi
keyboard-close = Igalawo Kiibbodi
choice-input-remove-choice = Ihawo { $choice }
matrix-remove-row = Ihawo olunyiriri
matrix-add-row = Yongerako olunyiriri
matrix-remove-column = Ihawo empagi
matrix-add-column = Yongerako empagi
subset-add-remove-points = Yongerako/Ihawo obutonnyeze
subset-toggle-points-intervals = Kyusa wakati w'obutonnyeze n'ebitundu
subset-move-points = Situla Obutonnyeze
subset-clear = Sangula
orbital-add-row = Yongerako Olunyiriri
orbital-remove-row = Ihawo Olunyiriri
orbital-add-box = Yongerako Akasanduuko
orbital-remove-box = Ihawo Akasanduuko
orbital-add-up-arrow = Yongerako Akasaale Akatunudde Waigulu
orbital-add-down-arrow = Yongerako Akasaale Akatunudde Wansi
orbital-remove-arrow = Ihawo Akasaale
orbital-row-label = Erinnya ly'olunyiriri { $row }
pretzel-answer = Eky'okwiramu


## Math input

math-input-preview-region = okulaba mu maiso ebibalo ebiwandiike
math-input-preview = Okulaba mu maiso
math-input-invalid-expression = Ekiwandiike tikituufu:


## Document status

viewer-initializing = Etandika…


## Errors

error-heading = Ensobi
error-found-at =
    { $span ->
        [line] Kidhuuliddwa ku lunyiriri { $startLine }.
       *[lines] Kidhuuliddwa ku nnyiriri { $startLine }–{ $endLine }.
    }
document-contains-errors = Ekiwandiiko kino kirimu ensobi!
diagnostic-heading-error = Ensobi
diagnostic-heading-warning = Okulabula
diagnostic-heading-information = Amawulire
diagnostic-heading-hint = Akabonero
accessibility-heading-level-1 = Okumenya WCAG AA mu Kutuukirira
accessibility-heading-level-2 = Okulabula ku kutuukirira
something-went-wrong = Waliwo ekitagenze bulungi.
renderer-load-failed = omulaga ogumu tigudhize. Ddamu ozzeemu olupapula.
core-start-failed = Ekiwandiiko kino tikitandise. Ddamu ozzeemu olupapula.
core-start-failed-busy = Ekiwandiiko kino tikitandise. Ebiwandiiko bingi byali bitandika mu kiseera kimu, ekisobola okutwala ebbanga eddene ku kyuma ekitali kya bwangu. Okuzzaamu olupapula kisobola okuyamba ng'ebiwandiiko ebirala bimaze.
core-start-failed-retry = Ekiwandiiko kino tikitandise.
core-start-failed-busy-retry = Ekiwandiiko kino tikitandise. Ebiwandiiko bingi byali bitandika mu kiseera kimu, ekisobola okutwala ebbanga eddene ku kyuma ekitali kya bwangu.
core-start-retry = Ddamu ogezeeko
saved-state-unavailable = Omulimo gwo ogutereke tigusobose kutikkulwa.
