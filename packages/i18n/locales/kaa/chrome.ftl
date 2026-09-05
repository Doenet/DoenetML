# Karakalpak viewer chrome. Translated from `locales/en/chrome.ftl`, which is
# the source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Karakalpak** (qaraqalpaq tili), the Kipchak Turkic language of the Republic
# of Karakalpakstan in Uzbekistan.
#
# SCRIPT. Karakalpak is written in two official orthographies at once — the
# Cyrillic inherited from the Soviet standard and the Latin adopted alongside
# Uzbekistan's, whose changeover has been legislated and postponed repeatedly.
# This catalog is written **entirely in the current Latin alphabet**: the one
# with `á ó ú`, dotless `ı`, `ǵ`, `ń`, and the digraphs `sh` and `ch`. It
# is the script of Karakalpakstan's schoolbooks and official publication today,
# and the one new material is set in. A corrector should not mix Cyrillic
# letters into it, and should not fall back on the earlier 1990s Latin drafts
# that wrote `ǵ` as `ğ` or `ń` as `ñ`: one alphabet, consistently, in all four
# files of this locale.
#
# PLURALS. `Intl.PluralRules` has no data for `kaa`, so a `[one]` branch could
# never be selected by Karakalpak's own rules — and Karakalpak would not want
# one anyway, since a noun after a numeral stays in the singular ("eki kitap",
# not "eki kitaplar"). Every count selection below is therefore collapsed to a
# single `*[other]`. Explicit numeric branches like `[0]` are matched against
# the number itself, not against a plural category, and are kept.


## Answer submission

answer-checking = Tekserilmekte…
answer-submitting = Jiberilmekte…
answer-checking-status = Juwap tekserilmekte
answer-submitting-status = Juwap jiberilmekte
answer-correct = Durıs
answer-incorrect = Qáte
answer-response-saved = Juwap saqlandı
answer-percent-credit = { $percent }% ball
answer-percent-correct = { $percent }% durıs
answer-percent-short = { $percent } %
max-credit-available = Alıw múmkin bolǵan eń joqarı ball: { $percent }%
attempts-remaining =
    { $count ->
        [0] urınıs qalmadı
       *[other] { $count } urınıs qaldı
    }
validation-correct = (Durıs)
validation-incorrect = (Qáte)
validation-partially-correct = (Bólekley durıs)
answer-show-responses =
    { $count ->
       *[other] { $answerId } ushın { $count } juwaptı kórsetiw
    }


## Disclosure panels

feedback-heading = Keri baylanıs
collapsible-click-to-open = (ashıw ushın basıń)
collapsible-click-to-close = (jabıw ushın basıń)
collapsible-initializing = Tayarlanbaqta…
footnote-show = Sıltemeni kórsetiw
footnote-hide = Sıltemeni jasırıw
description-more-information = qosımsha maǵlıwmat


## Controls

slider-previous = Aldıńǵı
slider-next = Keyingi
keyboard-open = Klaviaturanı ashıw
keyboard-close = Klaviaturanı jabıw
choice-input-remove-choice = { $choice } saylawın óshiriw
matrix-remove-row = Qatardı óshiriw
matrix-add-row = Qatar qosıw
matrix-remove-column = Baǵananı óshiriw
matrix-add-column = Baǵana qosıw
subset-add-remove-points = Noqat qosıw/óshiriw
subset-toggle-points-intervals = Noqatlar hám aralıqlardı almastırıw
subset-move-points = Noqatlardı jıljıtıw
subset-clear = Tazalaw
orbital-add-row = Qatar qosıw
orbital-remove-row = Qatardı óshiriw
orbital-add-box = Qutı qosıw
orbital-remove-box = Qutını óshiriw
orbital-add-up-arrow = Joqarıǵa oq qosıw
orbital-add-down-arrow = Tómenge oq qosıw
orbital-remove-arrow = Oqtı óshiriw
orbital-row-label = { $row } qatardıń belgisi
pretzel-answer = Juwap


## Math input

math-input-preview-region = matematikalıq ańlatpanı aldın kóriw
math-input-preview = Aldın kóriw
math-input-invalid-expression = Nadurıs ańlatpa:


## Document status

viewer-initializing = Tayarlanbaqta…


## Errors

error-heading = Qátelik
error-found-at =
    { $span ->
        [line] { $startLine }-qatarda tabıldı.
       *[lines] { $startLine }–{ $endLine }-qatarlarda tabıldı.
    }
document-contains-errors = Bul hújjette qátelikler bar!
diagnostic-heading-error = Qátelik
diagnostic-heading-warning = Eskertiw
diagnostic-heading-information = Maǵlıwmat
diagnostic-heading-hint = Kórsetpe
accessibility-heading-level-1 = WCAG AA qolaylıq talabınıń buzılıwı
accessibility-heading-level-2 = Qolaylıq haqqında eskertiw
something-went-wrong = Bir nárse qáte ketti.
renderer-load-failed = kórsetiwshiniń biri júklenbedi. Betti qaytadan júkleń.
core-start-failed = Bul hújjetti iske túsiriw múmkin bolmadı. Betti qaytadan júkleń.
core-start-failed-busy = Bul hújjetti iske túsiriw múmkin bolmadı. Bir neshe hújjet bir waqıtta iske túsip atır edi, bul áste qurılmada kóbirek waqıt aladı. Basqa hújjetler juwmaqlanǵannan keyin betti qaytadan júklew járdem beriwi múmkin.
core-start-failed-retry = Bul hújjetti iske túsiriw múmkin bolmadı.
core-start-failed-busy-retry = Bul hújjetti iske túsiriw múmkin bolmadı. Bir neshe hújjet bir waqıtta iske túsip atır edi, bul áste qurılmada kóbirek waqıt aladı.
core-start-retry = Qayta urınıw
saved-state-unavailable = Saqlanǵan jumısıńızdı júklew múmkin bolmadı.
