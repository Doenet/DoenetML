# Crimean Tatar (qırımtatar tili) viewer chrome. Translated from
# `locales/en/chrome.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script.** These four files are written in the **Latin alphabet** that
# Ukraine adopted as the standard orthography for Crimean Tatar in 2021 — the
# thirty-one letters `a b c ç d e f g ğ h i ı j k l m n ñ o ö p q r s ş t u ü v
# y z` plus the apostrophe. So: `q` for the uvular stop («qalın», «yoq»),
# `ñ` for the velar nasal («oñ»), the dotted/dotless `i`/`ı` pair, and
# `ğ ş ç ö ü` as in Turkish.
#
# **Cyrillic is equally current.** A large part of the community in Crimea
# still reads and writes Crimean Tatar in the Cyrillic alphabet, and a good
# many speakers use only that one. A reviewer who wants these catalogs in
# Cyrillic should transliterate **all four files of the locale together**;
# mixing the two orthographies inside one catalog — or across the four files —
# produces something no reader of either alphabet can use. Nothing here is an
# argument that Latin is the better choice; it is the choice this seed made,
# stated so it can be reversed cleanly.
#
# **Number.** A Crimean Tatar noun after a numeral stays unmarked — «3 deñeme»,
# never «3 deñemeler» — so the two branches English writes for `one` and
# `other` would be word-for-word identical here. Where that is the case this
# file writes a **single unselected form**. `Intl.PluralRules` has no CLDR data
# for `crh` and would resolve a plural category against the runtime's default
# locale, so no `[zero]`, `[two]`, `[few]` or `[many]` branch appears anywhere
# in these files. English's explicit `[0]` literals are matched against the
# number itself, not against a plural category, and are kept.
#
# **Loans, named rather than hidden.** Where this seed could not establish a
# Crimean Tatar word it keeps the loan the language actually uses rather than
# coining one. Most are the Turkish word, which is what modern Crimean Tatar
# reaches for in school and press vocabulary («klaviatura» is the exception,
# taken from Russian, as school usage in Crimea has it); a few are Russian, by
# the same route: «ball» for a mark or credit, «statistika», «funktsiya»,
# «variant», «matritsa». Buttons take the bare imperative — «Aç», not
# «Açıñız» — which is what a Crimean Tatar control is labelled with.


## Answer submission

answer-checking = Teşkerile...
answer-submitting = Yiberile...
answer-checking-status = Cevap teşkerile
answer-submitting-status = Cevap yiberile
answer-correct = Doğru
answer-incorrect = Yañlış
answer-response-saved = Cevap saqlandı
answer-percent-credit = { $percent }% ball
answer-percent-correct = { $percent }% doğru
answer-percent-short = { $percent } %
max-credit-available = Alınabilecek eñ yüksek ball: { $percent }%
attempts-remaining =
    { $count ->
        [0] deñeme aqqı qalmadı
       *[other] { $count } deñeme aqqı qaldı
    }
validation-correct = (Doğru)
validation-incorrect = (Yañlış)
validation-partially-correct = (Qısmen doğru)
answer-show-responses = { $answerId } içün { $count } cevapnı köster


## Disclosure panels

feedback-heading = Keri bildirim
collapsible-click-to-open = (açmaq içün basıñız)
collapsible-click-to-close = (qapatmaq içün basıñız)
collapsible-initializing = Azırlana...
footnote-show = Tüpnotnı köster
footnote-hide = Tüpnotnı gizle
description-more-information = daa çoq malümat


## Controls

slider-previous = Evelki
slider-next = Soñraki
keyboard-open = Klaviaturanı aç
keyboard-close = Klaviaturanı qapat
choice-input-remove-choice = { $choice } saylamnı çıqar
matrix-remove-row = Satırnı çıqar
matrix-add-row = Satır ekle
matrix-remove-column = Sutunnı çıqar
matrix-add-column = Sutun ekle
subset-add-remove-points = Noqta ekle/çıqar
subset-toggle-points-intervals = Noqtalar ve aralıqlar arasında keç
subset-move-points = Noqtalarnı taşı
subset-clear = Temizle
orbital-add-row = Satır ekle
orbital-remove-row = Satırnı çıqar
orbital-add-box = Qutu ekle
orbital-remove-box = Qutunı çıqar
orbital-add-up-arrow = Yuqarı oq ekle
orbital-add-down-arrow = Aşağı oq ekle
orbital-remove-arrow = Oqnı çıqar
orbital-row-label = { $row }. satırnıñ etiketi
pretzel-answer = Cevap


## Math input

math-input-preview-region = matematik ifadeniñ ög baqışı
math-input-preview = Ög baqış
math-input-invalid-expression = Keçersiz ifade:


## Document status

viewer-initializing = Azırlana...


## Errors

error-heading = Hata
error-found-at =
    { $span ->
        [line] { $startLine }. satırda tapıldı.
       *[lines] { $startLine }–{ $endLine }. satırlarda tapıldı.
    }
document-contains-errors = Bu vesiqada hatalar bar!
diagnostic-heading-error = Hata
diagnostic-heading-warning = İhtar
diagnostic-heading-information = Malümat
diagnostic-heading-hint = İpucu
accessibility-heading-level-1 = WCAG AA irişimlik ihlali
accessibility-heading-level-2 = İrişimlik ihtarı
something-went-wrong = Bir şey yañlış ketti.
renderer-load-failed = kösterici komponentlerniñ biri yüklenmedi. Lütfen, sahifeni yañıdan yükleñiz.
core-start-failed = Bu vesiqa başlatılamadı. Lütfen, sahifeni yañıdan yükleñiz.
core-start-failed-busy = Bu vesiqa başlatılamadı. Bir qaç vesiqa aynı vaqıtta başlatıla edi; yavaş cihazda bu daa çoq vaqıt ala. Digerleri bitken soñ sahifeni yañıdan yüklemek yardım etip ola.
core-start-failed-retry = Bu vesiqa başlatılamadı.
core-start-failed-busy-retry = Bu vesiqa başlatılamadı. Bir qaç vesiqa aynı vaqıtta başlatıla edi; yavaş cihazda bu daa çoq vaqıt ala.
core-start-retry = Yañıdan deñeñiz
saved-state-unavailable = Saqlanğan işiñiz yüklenamadı.
