# Azerbaijani viewer chrome. Translated from `locales/en/chrome.ftl`, which is
# the source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Azerbaijani counts in two plural categories, `one` and `other`, the same two
# English has, so every `{ $count -> … }` below keeps the shape it had. A noun
# after a numeral stays singular — «2 cəhd», not a plural — so the two branches
# differ in nothing but the number they print.


## Answer submission

answer-checking = Yoxlanılır…
answer-submitting = Göndərilir…
answer-checking-status = Cavab yoxlanılır
answer-submitting-status = Cavab göndərilir
answer-correct = Düzdür
answer-incorrect = Səhvdir
answer-response-saved = Cavab saxlanıldı
answer-percent-credit = { $percent }% bal
answer-percent-correct = { $percent }% düz
answer-percent-short = { $percent } %
max-credit-available = Mümkün ən yüksək bal: { $percent }%
attempts-remaining =
    { $count ->
        [0] cəhd qalmayıb
        [one] { $count } cəhd qalıb
       *[other] { $count } cəhd qalıb
    }
validation-correct = (Düzdür)
validation-incorrect = (Səhvdir)
validation-partially-correct = (Qismən düzdür)
answer-show-responses =
    { $count ->
        [one] { $answerId } üçün { $count } cavabı göstər
       *[other] { $answerId } üçün { $count } cavabı göstər
    }

## Disclosure panels

feedback-heading = Rəy
collapsible-click-to-open = (açmaq üçün klikləyin)
collapsible-click-to-close = (bağlamaq üçün klikləyin)
collapsible-initializing = Hazırlanır…
footnote-show = Qeydi göstər
footnote-hide = Qeydi gizlət
description-more-information = əlavə məlumat

## Controls

slider-previous = Əvvəlki
slider-next = Sonrakı
keyboard-open = Klaviaturanı aç
keyboard-close = Klaviaturanı bağla
choice-input-remove-choice = { $choice } seçimini sil
matrix-remove-row = Sətri sil
matrix-add-row = Sətir əlavə et
matrix-remove-column = Sütunu sil
matrix-add-column = Sütun əlavə et
subset-add-remove-points = Nöqtə əlavə et/sil
subset-toggle-points-intervals = Nöqtələr və intervallar arasında keç
subset-move-points = Nöqtələri köçür
subset-clear = Təmizlə
orbital-add-row = Sətir əlavə et
orbital-remove-row = Sətri sil
orbital-add-box = Xana əlavə et
orbital-remove-box = Xananı sil
orbital-add-up-arrow = Yuxarı ox əlavə et
orbital-add-down-arrow = Aşağı ox əlavə et
orbital-remove-arrow = Oxu sil
orbital-row-label = { $row } sətrinin etiketi
pretzel-answer = Cavab

## Math input

math-input-preview-region = riyazi ifadənin ön baxışı
math-input-preview = Ön baxış
math-input-invalid-expression = Yanlış ifadə:

## Document status

viewer-initializing = Hazırlanır…

## Errors

error-heading = Xəta
error-found-at =
    { $span ->
        [line] { $startLine } sətrində tapıldı.
       *[lines] { $startLine }–{ $endLine } sətirlərində tapıldı.
    }
document-contains-errors = Bu sənəddə xətalar var!
diagnostic-heading-error = Xəta
diagnostic-heading-warning = Xəbərdarlıq
diagnostic-heading-information = Məlumat
diagnostic-heading-hint = İpucu
accessibility-heading-level-1 = WCAG AA əlçatanlıq pozuntusu
accessibility-heading-level-2 = Əlçatanlıq bildirişi
something-went-wrong = Nəsə səhv getdi.
renderer-load-failed = göstərici yüklənə bilmədi. Zəhmət olmasa səhifəni yeniləyin.
core-start-failed = Sənəd göstəricisi işə salına bilmədi. Zəhmət olmasa səhifəni yeniləyin.
