# Chiga (Rukiga) viewer chrome: buttons, panel headers, and other UI the
# reader interacts with. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script and orthography.** Latin, in the **Runyankore-Rukiga standard
# orthography** — the one written standard the two varieties share, as fixed
# by Taylor's «Runyankore-Rukiga Dictionary» and used by the Runyakitara
# programme at Makerere and by the Bible («Baiburi Erikwera»). Its /tʃ/ is
# written **`c`**, so a piece of a document is «ekicweka». The orthography
# **not** followed here is the older missionary spelling that wrote the same
# sound `ch` — «ekichweka» — and which still turns up in church printing; a
# reviewer meeting `ch` in a Kigezi text is looking at that older convention,
# not at a different word. The neighbouring **Runyoro-Rutooro** standard is
# likewise not followed. The initial vowel (the augment) is part of the word:
# «omurongo» is one word, and «murongo» is not the same thing said without an
# article. Digits are **Latin** (`1`, `2`, `1,234`), which is what DoenetML
# pins for every locale in `src/intl.ts`.
#
# **Rukiga and Runyankore.** They share this orthography, most of this
# vocabulary, and one dictionary, and `locales/nyn` is on disk beside this
# file. Overlap between the two catalogs is expected and is not a defect. Where
# a difference is known it is written the Kigezi way — **«eibara»** for *name*,
# where Runyankore says «eiziina» — and elsewhere the word is the shared
# Runyankore-Rukiga one. **The first thing a Rukiga reviewer should do is go
# through this file asking of each word whether it is current in Kigezi or only
# in Ankole.** That question, not the grammar, is where this seed is weakest.
#
# **What is Rukiga here.** The copula is the `ni-` prefix («nikyo» *it is so*)
# and the negator is `ti-` («tikyo», «tihariho» *there is none*); «na» / «n'»
# is *and*, «nari» is *or*, «obu» is *when / if*, «ahabw'okuba» is *because*,
# «kwonka» is *but*. A button carries the bare imperative the way Rukiga gives
# an instruction — «Igura», «Igara», «Ihaho», «Ongyeraho», «Yoreka»,
# «Sherekyera», «Toorana» — rather than a polite periphrasis. The everyday
# words are the language's own: «nikyo» / «tikyo» for right and wrong,
# «eky'okugarukamu» for a response, «ekihabo» for an error (on «okuhaba», to
# go astray), «orupapura» for a page, «omurongo» for a row and «empagi» for a
# column, «okuhikaho» for accessibility.
#
# **What is borrowed, and from where.** **English**, not Swahili. Uganda's
# school system teaches mathematics and science in English from upper primary
# on, so a Rukiga speaker's technical register *is* English, and this catalog
# keeps it openly rather than inventing Rukiga words for it: «kiiboodi»,
# «WCAG». Swahili is not the loan language here, and is reached for only where
# a word genuinely travelled into the region long ago rather than through a
# classroom — «etaburo», «akasanduuko». Where a technical term has no Rukiga
# word at all, the key is **left out** and falls back to English rather than
# being filled with English respelled.
#
# **Counts.** CLDR gives `cgg` its own plural data, with the two categories
# `one` and `other`. A Rukiga noun marks number with a class prefix rather
# than a suffix — «omurundi» one time, «emirundi» several; «eky'okugarukamu»
# one answer, «eby'okugarukamu» several — and it goes on doing so after a
# numeral, so both branches of every select are doing real work.
# `attempts-remaining` keeps its `[0]` branch, an exact-value match rather
# than a plural category, which says «tihariho» instead of counting to zero.


## Answer submission

answer-checking = Nikicendererezibwa…
answer-submitting = Nikyohererezibwa…
answer-checking-status = Nitucendereza eky'okugarukamu
answer-submitting-status = Nitwohereza eky'okugarukamu
answer-correct = Nikyo
answer-incorrect = Tikyo
answer-response-saved = Eky'okugarukamu Kibiikirwe
answer-percent-credit = { $percent }% ez'amanota
answer-percent-correct = { $percent }% Nikyo
answer-percent-short = { $percent } %
max-credit-available = Amanota maingi agariho: { $percent }%
attempts-remaining =
    { $count ->
        [0] tihariho murundi gusigaire
        [one] hasigaire omurundi { $count }
       *[other] hasigaire emirundi { $count }
    }
validation-correct = (Nikyo)
validation-incorrect = (Tikyo)
validation-partially-correct = (Nikyo aha rubaju)
answer-show-responses =
    { $count ->
        [one] Yoreka eky'okugarukamu { $count } eky'aha { $answerId }
       *[other] Yoreka eby'okugarukamu { $count } eby'aha { $answerId }
    }


## Disclosure panels

feedback-heading = Ekigarukiirwemu
collapsible-click-to-open = (kanda okwigura)
collapsible-click-to-close = (kanda okwigara)
collapsible-initializing = Nikitandika…
footnote-show = Yoreka ekyahandiikirwe aha nsi
footnote-hide = Sherekyera ekyahandiikirwe aha nsi
description-more-information = amakuru maingi


## Controls

slider-previous = Ekihweireho
slider-next = Ekirikukuratsya
keyboard-open = Igura Kiiboodi
keyboard-close = Igara Kiiboodi
choice-input-remove-choice = Ihaho { $choice }
matrix-remove-row = Ihaho omurongo
matrix-add-row = Ongyeraho omurongo
matrix-remove-column = Ihaho empagi
matrix-add-column = Ongyeraho empagi
subset-add-remove-points = Ongyeraho/Ihaho obudomo
subset-toggle-points-intervals = Hindura ahagati y'obudomo n'ebicweka
subset-move-points = Rugurura Obudomo
subset-clear = Ihaho byona
orbital-add-row = Ongyeraho Omurongo
orbital-remove-row = Ihaho Omurongo
orbital-add-box = Ongyeraho Akasanduuko
orbital-remove-box = Ihaho Akasanduuko
orbital-add-up-arrow = Ongyeraho Akambi Karikuza Ahaiguru
orbital-add-down-arrow = Ongyeraho Akambi Karikuza Ahansi
orbital-remove-arrow = Ihaho Akambi
orbital-row-label = Eibara ry'omurongo { $row }
pretzel-answer = Eky'okugarukamu


## Math input

math-input-preview-region = okureeba omu maisho ebibaro ebyahandiikirwe
math-input-preview = Okureeba omu maisho
math-input-invalid-expression = Ekyahandiikirwe tikyo:


## Document status

viewer-initializing = Nikitandika…


## Errors

error-heading = Ekihabo
error-found-at =
    { $span ->
        [line] Kishangirwe aha murongo { $startLine }.
       *[lines] Kishangirwe aha mirongo { $startLine }–{ $endLine }.
    }
document-contains-errors = Ekitabo eki kiine ebihabo!
diagnostic-heading-error = Ekihabo
diagnostic-heading-warning = Okurabura
diagnostic-heading-information = Amakuru
diagnostic-heading-hint = Akamanyiso
accessibility-heading-level-1 = Okuhenda WCAG AA omu Kuhikaho
accessibility-heading-level-2 = Okurabura kw'okuhikaho
something-went-wrong = Hariho ekitagyenzire gye.
renderer-load-failed = omworeki omwe tarahikire. Nooyeshengyereza garura orupapura.
core-start-failed = Ekitabo eki tikitandikire. Nooyeshengyereza garura orupapura.
core-start-failed-busy = Ekitabo eki tikitandikire. Ebitabo bingi bikaba nibitandika omu bwire bumwe, ekirikubaasa kutwara obwire buraingwa aha kyoma kitarikwiruka munonga. Okugarura orupapura nikibaasa kuhwera ebindi bitabo byaherize.
core-start-failed-retry = Ekitabo eki tikitandikire.
core-start-failed-busy-retry = Ekitabo eki tikitandikire. Ebitabo bingi bikaba nibitandika omu bwire bumwe, ekirikubaasa kutwara obwire buraingwa aha kyoma kitarikwiruka munonga.
core-start-retry = Gyezaho oburundi
saved-state-unavailable = Omurimo gwawe ogubiikirwe tigubaasize kutahwa.
