# Gagauz (gagauz dili) viewer chrome. Translated from `locales/en/chrome.ftl`,
# which is the source of truth: `lint:i18n` rejects a key that does not exist
# there, and reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** The **Latin alphabet in official use in Gagauzia
# (Moldova)** since 1996: `a ä b c ç d e ê f g h ı i j k l m n o ö p r s ș t ț
# u ü v y z`. Four letters are worth naming because Turkish, the nearest
# language a reader is likely to know, writes them otherwise:
#
#   * **`ș`, not `ş`**, for the sh sound — «yeșil», «ișlemäk». `ç` keeps its
#     Turkish value (ch), and `c` is the j of «cuvap».
#   * **`ț`** for ts, which is where the Russian-mediated international
#     vocabulary lands: «funkțiya», «annotațiya», «matrița», «definițiya».
#   * **`ä`** for the open front vowel — «incä», «pembä», «lääzım» — a letter
#     Turkish does not have and one this catalog uses a great deal.
#   * **`ê`** for the vowel of the present tense, «-êr»: «sayılêr»,
#     «alınmêêr». That tense marker is one of the clearest signs these files
#     are Gagauz and not Turkish, and a reviewer should keep it.
#
# The Cyrillic alphabet Gagauz used until 1993 is not written here at all, and
# nothing in these four files should be mixed with it.
#
# **Number.** A noun after a numeral stays unmarked in Gagauz — «3 denemä»,
# never «3 denemelär» — so English's `one` and `other` branches would be
# identical, and where that is so this file writes **one unselected form**.
# `Intl.PluralRules` has no CLDR data for `gag`, so a `[few]` or `[many]`
# branch could never be selected and none is written. English's explicit `[0]`
# literals match the number itself and are kept.
#
# **Loans, named.** Gagauz technical vocabulary comes from Russian and
# Romanian, and this seed keeps it rather than coining: «klaviatura»,
# «statistika», «funkțiya», «variant», «matrița», «komponent», «atribut»,
# «format», «tip», «ball» (a mark), «aktivitet», «problema», «tablița».
# «Geri bildirim» for *feedback* is a Turkish calque and is the weakest word
# in the file. Buttons take the bare imperative: «Aç», not «Açınız».


## Answer submission

answer-checking = Bakılêr...
answer-submitting = Yollanêr...
answer-checking-status = Cuvap bakılêr
answer-submitting-status = Cuvap yollanêr
answer-correct = Dooru
answer-incorrect = Yannıș
answer-response-saved = Cuvap saklandı
answer-percent-credit = { $percent }% ball
answer-percent-correct = { $percent }% dooru
answer-percent-short = { $percent } %
max-credit-available = En büük alınabilecek ball: { $percent }%
attempts-remaining =
    { $count ->
        [0] denemä hakkı kalmadı
       *[other] { $count } denemä hakkı kaldı
    }
validation-correct = (Dooru)
validation-incorrect = (Yannıș)
validation-partially-correct = (Payca dooru)
answer-show-responses = { $answerId } için { $count } cuvap göster


## Disclosure panels

feedback-heading = Geri bildirim
collapsible-click-to-open = (açmaa deyni basınız)
collapsible-click-to-close = (kapamaa deyni basınız)
collapsible-initializing = Hazırlanêr...
footnote-show = Alt notu göster
footnote-hide = Alt notu gizlä
description-more-information = taa çok bilgi


## Controls

slider-previous = Öncäki
slider-next = Sonraki
keyboard-open = Klaviaturayı aç
keyboard-close = Klaviaturayı kapa
choice-input-remove-choice = { $choice } silmää
matrix-remove-row = Sırayı sil
matrix-add-row = Sıra kat
matrix-remove-column = Sutunu sil
matrix-add-column = Sutun kat
subset-add-remove-points = Nokta kat/sil
subset-toggle-points-intervals = Noktalarlan aralıklar arasında geç
subset-move-points = Noktaları götür
subset-clear = Temizlä
orbital-add-row = Sıra kat
orbital-remove-row = Sırayı sil
orbital-add-box = Kutu kat
orbital-remove-box = Kutuyu sil
orbital-add-up-arrow = Yukarı ok kat
orbital-add-down-arrow = Așaa ok kat
orbital-remove-arrow = Oku sil
orbital-row-label = { $row }. sıranın etiketi
pretzel-answer = Cuvap


## Math input

math-input-preview-region = matematika ifadesinin ön bakıșı
math-input-preview = Ön bakıș
math-input-invalid-expression = Geçersiz ifadä:


## Document status

viewer-initializing = Hazırlanêr...


## Errors

error-heading = Hata
error-found-at =
    { $span ->
        [line] { $startLine }. satırda bulundu.
       *[lines] { $startLine }–{ $endLine } satırlarında bulundu.
    }
document-contains-errors = Bu dokumentta hatalar var!
diagnostic-heading-error = Hata
diagnostic-heading-warning = Uyarma
diagnostic-heading-information = Bilgi
diagnostic-heading-hint = İpucu
accessibility-heading-level-1 = WCAG AA erișilebilirlik bozması
accessibility-heading-level-2 = Erișilebilirlik uyarması
something-went-wrong = Bir șey yannıș gitti.
renderer-load-failed = gösterici komponentlerdän biri yüklenmedi. Rica ederiz, sayfayı enidän yükleyiniz.
core-start-failed = Bu dokument bașlanamadı. Rica ederiz, sayfayı enidän yükleyiniz.
core-start-failed-busy = Bu dokument bașlanamadı. Birkaç dokument aynı vakıtta bașlanardı; yavaș cihazda bu taa çok vakıt alêr. Öbürleri bittiktän sora sayfayı enidän yüklemäk yardım edebilir.
core-start-failed-retry = Bu dokument bașlanamadı.
core-start-failed-busy-retry = Bu dokument bașlanamadı. Birkaç dokument aynı vakıtta bașlanardı; yavaș cihazda bu taa çok vakıt alêr.
core-start-retry = Bir taa deneyiniz
saved-state-unavailable = Saklanan ișiniz yüklenämedi.
