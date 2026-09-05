# Muslim Tat (zuhun-i tati) viewer chrome. Translated from
# `locales/en/chrome.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Which Tat, and which script.** The **Muslim Tat of Azerbaijan and southern
# Dagestan** — an Iranian language of the Persian group, not a Turkic one —
# written here in the **Latin alphabet of Azerbaijan**, which is the tradition
# Tat material published in Azerbaijan follows: `ə` for the open vowel, `x`
# for the velar fricative, `q` for the uvular stop, `ç ş ğ ö ü ı` as
# Azerbaijani writes them. **In Dagestan Tat is written in Cyrillic**, and has
# been for longer; that tradition is equally real and equally current. A
# reviewer who wants Cyrillic must convert all four files of this locale
# together, and must never mix the two alphabets inside one catalog.
#
# **Verbs are the weakest part of this file.** Tat has no technical register,
# and it borrows a verb by putting a light verb on a borrowed stem —
# «yoxlamiş sax», *check it*; «göndərmiş sax», *send it*. This catalog uses
# that pattern throughout rather than coining native verbs it cannot check,
# and the button labels and status lines below are where a speaker will find
# the most to correct. Nothing here should be taken as settled usage.
#
# **Loans, named.** «Əvvəlki», «növbəti», «sətir», «sütun», «etiket»,
# «klaviatura», «statistika», «interval», «xəbərdorluğ», «əlçatanlığ»,
# «pozuntu», «bal» and the whole software vocabulary are Azerbaijani, kept
# because that is the word a Tat speaker in Azerbaijan uses; several arrived
# in Azerbaijani from Russian first. Where Tat's own Iranian word serves it is
# used: «rost» true, «nodürüs» invalid, «xəto» error, «nüqtə» point, «pok
# sax» erase, «nişun de» show, «vokard» open, «bast» close, «mundən» remain,
# «yoftən» find, «ziyod» more.
#
# **Number.** A noun after a numeral is unmarked in Tat, so English's `one`
# and `other` branches would be identical and each count message is written
# as one unselected form. `Intl.PluralRules` has no CLDR data for `ttt`, so no
# plural-category branch appears; English's `[0]` literal matches the number
# itself and is kept.


## Answer submission

answer-checking = Yoxlamiş soxdən...
answer-submitting = Göndərmiş soxdən...
answer-checking-status = Cavob yoxlamiş soxdən
answer-submitting-status = Cavob göndərmiş soxdən
answer-correct = Rost
answer-incorrect = Nodürüs
answer-response-saved = Cavob saxlamiş bire
answer-percent-credit = { $percent }% bal
answer-percent-correct = { $percent }% rost
answer-percent-short = { $percent } %
max-credit-available = Bali büzürgtərin: { $percent }%
attempts-remaining =
    { $count ->
        [0] cəhd nimund
       *[other] { $count } cəhd mundə
    }
validation-correct = (Rost)
validation-incorrect = (Nodürüs)
validation-partially-correct = (Yarımçıq rost)
answer-show-responses = { $answerId } üçün { $count } cavob-rə nişun de


## Disclosure panels

feedback-heading = Rəy
collapsible-click-to-open = (vokardən üçün klik sax)
collapsible-click-to-close = (bastən üçün klik sax)
collapsible-initializing = Hozür soxdən...
footnote-show = Qeydi poyi-rə nişun de
footnote-hide = Qeydi poyi-rə penhon sax
description-more-information = ziyodtər məlumat


## Controls

slider-previous = Əvvəlki
slider-next = Növbəti
keyboard-open = Klaviatura-rə vokard
keyboard-close = Klaviatura-rə bast
choice-input-remove-choice = { $choice }-rə pok sax
matrix-remove-row = Sətir-rə pok sax
matrix-add-row = Sətir ziyod sax
matrix-remove-column = Sütun-rə pok sax
matrix-add-column = Sütun ziyod sax
subset-add-remove-points = Nüqtə ziyod sax / pok sax
subset-toggle-points-intervals = Beyni nüqtəho və intervalho vogərd
subset-move-points = Nüqtəho-rə cümbün
subset-clear = Pok sax
orbital-add-row = Sətir ziyod sax
orbital-remove-row = Sətir-rə pok sax
orbital-add-box = Qutu ziyod sax
orbital-remove-box = Qutu-rə pok sax
orbital-add-up-arrow = Tiri bolo ziyod sax
orbital-add-down-arrow = Tiri zir ziyod sax
orbital-remove-arrow = Tir-rə pok sax
orbital-row-label = Etiketi sətiri { $row }
pretzel-answer = Cavob


## Math input

math-input-preview-region = nişundorəyi ifodəyi riyozi
math-input-preview = Nişundorə
math-input-invalid-expression = İfodəyi nodürüs:


## Document status

viewer-initializing = Hozür soxdən...


## Errors

error-heading = Xəto
error-found-at =
    { $span ->
        [line] Ə sətiri { $startLine } yoft bire.
       *[lines] Ə sətirhoyi { $startLine }–{ $endLine } yoft bire.
    }
document-contains-errors = İn sənəd xətoho dorü!
diagnostic-heading-error = Xəto
diagnostic-heading-warning = Xəbərdorluğ
diagnostic-heading-information = Məlumat
diagnostic-heading-hint = İşorə
accessibility-heading-level-1 = Pozuntuyi əlçatanlığ WCAG AA
accessibility-heading-level-2 = Xəbərdorluği əlçatanlığ
something-went-wrong = Yə çi ğələt raft.
renderer-load-failed = yə göstərici yükləmiş nəbü. Lütfən, səhifə-rə əz nu yükləmiş sax.
core-start-failed = İn sənəd oğoz nəbü. Lütfən, səhifə-rə əz nu yükləmiş sax.
core-start-failed-busy = İn sənəd oğoz nəbü. Çənd sənəd ə yə vaxt oğoz bisdi; ə dəsgohi ohəstə in ziyodtər vaxt migirə. Vaxti digərho tomom bü, səhifə-rə əz nu yükləmiş soxdən kümək misozü.
core-start-failed-retry = İn sənəd oğoz nəbü.
core-start-failed-busy-retry = İn sənəd oğoz nəbü. Çənd sənəd ə yə vaxt oğoz bisdi; ə dəsgohi ohəstə in ziyodtər vaxt migirə.
core-start-retry = Yə bori digər sınamiş sax
saved-state-unavailable = Kori saxlamiş bireyi şümü yükləmiş nəbü.
