# Kumyk viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Kumyk (къумукъ тил) is a Kipchak Turkic language of the Dagestan lowlands.
# Written in Cyrillic, the orthography the republic's schools, its newspapers
# and its book publishing have used since 1938 and the one CLDR fills a bare
# `kum` in as (`kum` maximizes to `kum-Cyrl-RU`). The digraphs гъ, гь, къ, нг
# and the vowels оь, уь are single letters of that alphabet: «къара» spelled
# «кара» is Russian, not Kumyk, and «гёк» spelled «гок» is nothing at all.
#
# Kumyk counts in two plural categories, `one` and `other`, the same two
# English has, so every `{ $count -> … }` below keeps the shape it had. A noun
# after a numeral stays singular — «2 сынав», never «2 сынавлар» — so the two
# branches usually differ in nothing but the number they print.
#
# Kumyk has no grammatical gender and no noun class, so nothing in this file
# agrees with anything. That is worth stating in a catalog sitting in a batch
# of Caucasian class systems: Kumyk's neighbours inside the same republic —
# Avar, Dargwa, Lak and Tabasaran — all mark a noun class on the words that
# agree with a noun, and Kumyk, in the middle of them, marks none.
#
# «онгайлыкъ» for *accessibility* is the weakest word in this file. It means
# convenience or ease of use, and no settled Kumyk term for accessibility in
# the WCAG sense exists to reach for; a speaker should feel free to replace
# every occurrence of it here and in `editor.ftl` at once.


## Answer submission

answer-checking = Тергеле…
answer-submitting = Йибериле…
answer-checking-status = Жавап тергеле
answer-submitting-status = Жавап йибериле
answer-correct = Тюз
answer-incorrect = Тюз тюгюл
answer-response-saved = Жавап сакъланды
answer-percent-credit = { $percent }% балл
answer-percent-correct = { $percent }% тюз
answer-percent-short = { $percent } %
max-credit-available = Алма болагъан инг кёп балл: { $percent }%
attempts-remaining =
    { $count ->
        [0] сынав къалмагъан
        [one] { $count } сынав къалгъан
       *[other] { $count } сынав къалгъан
    }
validation-correct = (Тюз)
validation-incorrect = (Тюз тюгюл)
validation-partially-correct = (Кесеги тюз)
answer-show-responses =
    { $count ->
        [one] { $answerId } учун { $count } жавапны гёрсетив
       *[other] { $answerId } учун { $count } жавапны гёрсетив
    }

## Disclosure panels

feedback-heading = Кери байлавлукъ
collapsible-click-to-open = (ачмакъ учун басыгъыз)
collapsible-click-to-close = (япмакъ учун басыгъыз)
collapsible-initializing = Гьазирлене…
footnote-show = Тюп эсгеривню гёрсетив
footnote-hide = Тюп эсгеривню яшырыв
description-more-information = къошум малумат

## Controls

slider-previous = Алдагъы
slider-next = Сонрагъы
keyboard-open = Клавиатураны ачыв
keyboard-close = Клавиатураны ябыв
choice-input-remove-choice = { $choice } танглавну гетерив
matrix-remove-row = Сатырны гетерив
matrix-add-row = Сатыр къошув
matrix-remove-column = Багъананы гетерив
matrix-add-column = Багъана къошув
subset-add-remove-points = Нокъат къошув/гетерив
subset-toggle-points-intervals = Нокъатланы ва аралыкъланы алышдырыв
subset-move-points = Нокъатланы гёчюрюв
subset-clear = Тазалав
orbital-add-row = Сатыр къошув
orbital-remove-row = Сатырны гетерив
orbital-add-box = Къуту къошув
orbital-remove-box = Къутуну гетерив
orbital-add-up-arrow = Юкъаргъа окъ къошув
orbital-add-down-arrow = Тёбенге окъ къошув
orbital-remove-arrow = Окъну гетерив
orbital-row-label = { $row } сатырны белгиси
pretzel-answer = Жавап

## Math input

math-input-preview-region = математика ифаданы алдын гёрюв
math-input-preview = Алдын гёрюв
math-input-invalid-expression = Тюз болмагъан ифада:

## Document status

viewer-initializing = Гьазирлене…

## Errors

error-heading = Янгылыш
error-found-at =
    { $span ->
        [line] Табылгъан сатыр: { $startLine }.
       *[lines] Табылгъан сатырлар: { $startLine }–{ $endLine }.
    }
document-contains-errors = Бу документде янгылышлар бар!
diagnostic-heading-error = Янгылыш
diagnostic-heading-warning = Эсгертив
diagnostic-heading-information = Малумат
diagnostic-heading-hint = Ишара
accessibility-heading-level-1 = WCAG AA онгайлыкъ бузув
accessibility-heading-level-2 = Онгайлыкъ гьакъда эсгертив
something-went-wrong = Бир зат тюз болмады.
renderer-load-failed = суратлавчуну юклеп болмады. Бетни янгыртыгъыз.
core-start-failed = Бу документни башлап болмады. Бетни янгыртыгъыз.
core-start-failed-busy = Бу документни башлап болмады. Бир нече документ бир вакътиде башлангъан эди, оьзю яй ишлейген жагьазда бу кёп заман алма бола. Оьзге документлер битгенде бетни янгыртыв кёмек этме бола.
core-start-failed-retry = Бу документни башлап болмады.
core-start-failed-busy-retry = Бу документни башлап болмады. Бир нече документ бир вакътиде башлангъан эди, оьзю яй ишлейген жагьазда бу кёп заман алма бола.
core-start-retry = Дагъы бир керен сынагъыз
saved-state-unavailable = Сакъланып тургъан ишигизни юклеп болмады.
