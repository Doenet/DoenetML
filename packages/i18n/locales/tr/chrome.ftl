# Turkish viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Turkish has two plural categories, but a noun counted by a numeral stays
# singular — `3 deneme`, never `3 denemeler` — so a `{ $count }` message reads
# the same in both branches and needs no selection beyond `[0]`, where the
# English wording changes.
#
# Controls take the bare imperative, which is what Turkish puts on a button:
# `Klavyeyi aç`, not `Klavyeyi açınız`.


## Answer submission

answer-checking = Denetleniyor...
answer-submitting = Gönderiliyor...
answer-checking-status = Yanıt denetleniyor
answer-submitting-status = Yanıt gönderiliyor
answer-correct = Doğru
answer-incorrect = Yanlış
answer-response-saved = Yanıt kaydedildi
answer-percent-credit = %{ $percent } puan
answer-percent-correct = %{ $percent } doğru
answer-percent-short = %{ $percent }
max-credit-available = Alınabilecek en yüksek puan: %{ $percent }
attempts-remaining =
    { $count ->
        [0] deneme hakkı kalmadı
       *[other] { $count } deneme hakkı kaldı
    }
validation-correct = (Doğru)
validation-incorrect = (Yanlış)
validation-partially-correct = (Kısmen doğru)
answer-show-responses = { $answerId } için { $count } yanıtı göster

## Disclosure panels

feedback-heading = Geri bildirim
collapsible-click-to-open = (açmak için tıklayın)
collapsible-click-to-close = (kapatmak için tıklayın)
collapsible-initializing = Hazırlanıyor...
footnote-show = Dipnotu göster
footnote-hide = Dipnotu gizle
description-more-information = daha fazla bilgi

## Controls

slider-previous = Önceki
slider-next = Sonraki
keyboard-open = Klavyeyi aç
keyboard-close = Klavyeyi kapat
choice-input-remove-choice = { $choice } sil
matrix-remove-row = Satır sil
matrix-add-row = Satır ekle
matrix-remove-column = Sütun sil
matrix-add-column = Sütun ekle
subset-add-remove-points = Nokta ekle/sil
subset-toggle-points-intervals = Noktalar ve aralıklar arasında geçiş yap
subset-move-points = Noktaları taşı
subset-clear = Temizle
# A `box` here is one orbital, drawn as a square: kutu.
orbital-add-row = Satır ekle
orbital-remove-row = Satır sil
orbital-add-box = Kutu ekle
orbital-remove-box = Kutu sil
orbital-add-up-arrow = Yukarı ok ekle
orbital-add-down-arrow = Aşağı ok ekle
orbital-remove-arrow = Ok sil
orbital-row-label = { $row }. satırın etiketi
pretzel-answer = Yanıt

## Math input

math-input-preview-region = matematiksel ifade önizlemesi
math-input-preview = Önizleme
math-input-invalid-expression = Geçersiz ifade:

## Document status

viewer-initializing = Hazırlanıyor...

## Errors

error-heading = Hata
error-found-at =
    { $span ->
        [line] { $startLine }. satırda bulundu.
       *[lines] { $startLine }–{ $endLine }. satırlarda bulundu.
    }
document-contains-errors = Bu belge hatalar içeriyor!
diagnostic-heading-error = Hata
diagnostic-heading-warning = Uyarı
diagnostic-heading-information = Bilgi
diagnostic-heading-hint = İpucu
accessibility-heading-level-1 = WCAG AA erişilebilirlik ihlali
accessibility-heading-level-2 = Erişilebilirlik uyarısı
something-went-wrong = Bir şeyler ters gitti.
renderer-load-failed = bir işleyici bileşeni yüklenemedi. Lütfen sayfayı yeniden yükleyin.
core-start-failed = Belge görüntüleyici başlatılamadı. Lütfen sayfayı yeniden yükleyin.
