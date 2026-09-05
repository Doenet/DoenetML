# Talysh viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in the **Latin** orthography Talysh publishing in Azerbaijan uses —
# the Azerbaijani alphabet, with ə, ı, ö, ü, ğ, ş and ç — because that is what
# the language's own periodicals print and what CLDR answers with:
# `Intl.Locale("tly").maximize()` is `tly-Latn-AZ`, so a reader who types the
# bare tag is, by CLDR's own data, most likely a Latin reader in Azerbaijan.
# Talysh is also written in Cyrillic, and in Iran in the Perso-Arabic script.
# A reader arriving under `tly-Cyrl` or `tly-Arab` reaches this catalog and
# gets Latin; the answer to that is a second catalog beside this one rather
# than a rename of it, which is the asymmetry `locales/pa`, `locales/sr`,
# `locales/jv` and `locales/kmr` already carry.
#
# Talysh counts in two plural categories, `one` and `other`, so every
# `{ $count -> … }` below keeps the shape English gives it. A noun after a
# numeral stays singular, so the two branches usually read alike.
#
# Talysh is Iranian and, like Persian and Ossetic, has no grammatical gender
# and no noun class. Nothing in this catalog agrees with anything:
# `content.ftl`'s `noun-gender` returns one token for every noun and no
# message forks on it. This catalog sits in a batch full of Caucasian class
# systems, so it is worth saying plainly — a reader expecting a fork here
# should stop looking for one.
#
# **This is likely the least certain catalog in its batch.** Talysh is
# endangered, its written output is small, and its Latin orthography is not
# settled even within Azerbaijan — the vowels ə/e and ı/i especially. Interface
# and technical vocabulary barely exists in it, so the words below lean on
# Azerbaijani and on Persian the way written Talysh itself does. A speaker
# should check the coined technical nouns before anything else: «xəto» (error),
# «hoşdor» (warning), «dastrəsi» (accessibility), «pozey» (violation),
# «nışondəkə» (renderer) and «səhv» for "invalid" are chosen here, not found
# in use.


## Answer submission

answer-checking = Yoxlə kardedə…
answer-submitting = Vığandedə…
answer-checking-status = Cəvob yoxlə kardedə
answer-submitting-status = Cəvob vığandedə
answer-correct = Rost
answer-incorrect = Rost ni
answer-response-saved = Cəvob nığo doə be
answer-percent-credit = { $percent }% bal
answer-percent-correct = { $percent }% rost
answer-percent-short = { $percent } %
max-credit-available = Ən vey bal: { $percent }%
attempts-remaining =
    { $count ->
        [0] cəhd nımandə
        [one] { $count } cəhd mandə
       *[other] { $count } cəhd mandə
    }
validation-correct = (Rost)
validation-incorrect = (Rost ni)
validation-partially-correct = (Qismən rost)
# The answer's own name follows the count rather than taking a postposition of
# its own: a Talysh «-ro» welded to a placeable would be an affix on a word
# this catalog never sees.
answer-show-responses =
    { $count ->
        [one] { $count } cəvob nışon doy: { $answerId }
       *[other] { $count } cəvob nışon doy: { $answerId }
    }


## Disclosure panels

feedback-heading = Əks-cəvob
collapsible-click-to-open = (oj kardeyro kılik bıkə)
collapsible-click-to-close = (bandeyro kılik bıkə)
collapsible-initializing = Hozı bedə…
footnote-show = Zerənivişt nışon doy
footnote-hide = Zerənivişt nıhon kardey
description-more-information = vey məlumat


## Controls

slider-previous = Navınə
slider-next = Peşinə
keyboard-open = Klaviaturə oj kardey
keyboard-close = Klaviaturə bandey
choice-input-remove-choice = { $choice } bekardey
matrix-remove-row = Sıra bekardey
matrix-add-row = Sıra əlovə kardey
matrix-remove-column = Sutun bekardey
matrix-add-column = Sutun əlovə kardey
subset-add-remove-points = Nuğtəon əlovə kardey/bekardey
subset-toggle-points-intervals = Nuğtəon iyən intervalon əvəz kardey
subset-move-points = Nuğtəon bardey
subset-clear = Pok kardey
orbital-add-row = Sıra əlovə kardey
orbital-remove-row = Sıra bekardey
orbital-add-box = Xonə əlovə kardey
orbital-remove-box = Xonə bekardey
orbital-add-up-arrow = Bə pe tir əlovə kardey
orbital-add-down-arrow = Bə ji tir əlovə kardey
orbital-remove-arrow = Tir bekardey
orbital-row-label = Sıra { $row } nışonə
pretzel-answer = Cəvob


## Math input

math-input-preview-region = riyoziyə ifodə navınə nışon
math-input-preview = Navınə nışon
math-input-invalid-expression = Səhvə ifodə:


## Document status

viewer-initializing = Hozı bedə…


## Errors

error-heading = Xəto
error-found-at =
    { $span ->
        [line] { $startLine } sətirədə peydo be.
       *[lines] { $startLine }–{ $endLine } sətironədə peydo be.
    }
document-contains-errors = Ə sənəddə xətoon heste!
diagnostic-heading-error = Xəto
diagnostic-heading-warning = Hoşdor
diagnostic-heading-information = Məlumat
diagnostic-heading-hint = İşorə
accessibility-heading-level-1 = WCAG AA dastrəsi pozey
accessibility-heading-level-2 = Dastrəsi barədə hoşdor
something-went-wrong = Çiyi səhv beşe.
renderer-load-failed = nışondəkə bar nıbe. Səhifə təzədən oj bıkə.
core-start-failed = Ə sənəd bino be nışe. Səhifə təzədən oj bıkə.
core-start-failed-busy = Ə sənəd bino be nışe. Çand sənəd i vaxtədə bino bedəbin, ım ki kandə cihozədə vey vaxt bardedə. Co sənədon ğırteysə peştə səhifə təzədən oj kardey kümək bəkarde.
core-start-failed-retry = Ə sənəd bino be nışe.
core-start-failed-busy-retry = Ə sənəd bino be nışe. Çand sənəd i vaxtədə bino bedəbin, ım ki kandə cihozədə vey vaxt bardedə.
core-start-retry = Təzədən sınəğ bıkə
saved-state-unavailable = Şımə nığo doə kor bar nıbe.
