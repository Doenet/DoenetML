# Moksha viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **This file is the answer `locales/myv`'s header asks for.** That header says
# that Erzya and Moksha are two languages, not two spellings of one; that ISO
# 639-3 gives them `myv` and `mdf` separately with no macrolanguage code over
# them; that a Moksha reader arriving under `mdf` therefore "reaches English
# rather than this file"; and that "the answer to it is a `locales/mdf` beside
# this one, not a widening of this one". This is that catalog. It is a separate
# catalog, not a widening of `locales/myv`: nothing about `locales/myv` changes,
# and neither file is a fallback for the other.
#
# Written in Cyrillic, which is the orthography Mordovia's schools and
# publishing use for Moksha and what CLDR fills a bare `mdf` in as.
#
# Moksha has no grammatical gender and does not inflect an attributive
# adjective, so `$gender` and `$role` go unused, exactly as in `locales/myv`.
#
# The seed reached Moksha through the correspondences that separate it from
# Erzya in the words these files contain:
#
#   negation                «аф», «аш» for Erzya «а», «аволь», «арась»;
#                           «изь» for Erzya «эзь»
#   participle              -ф for Erzya -зь: максф, тиф, муф, артф
#   -фкс for Erzya -вкс     сюлмафкс (myv: сюлмавкс)
#   inessive/elative        -са, -ста for Erzya -сэ/-со, -стэ/-сто:
#                           ширеса, лангса (myv: чиресэ, лангсо)
#   -нза, -ть, -тне         for Erzya -нзэ, -нть, -тнэ
#   loan adjectives         -ай for Erzya -ой: серай, фиолетовай
#   lexicon                 мархта, инкса, кда, фкя, аньцек, лама, сяда, и
#                           (myv: марто, кисэ, бути, вейке, ансяк, ламо, седе,
#                           ды)
#   numerals                фкя, кафта, колма (myv: вейке, кавто, колмо), and
#                           the ablative on them in -да: фкяда, кафтада
#                           (myv: вейкеде, кавтодо)
#
# **Where the seed did not know Moksha's own word it left the shape Moksha and
# Erzya share**, rather than inventing one. Those are the first thing a speaker
# should correct, and they are the reason this catalog reads closer to
# `locales/myv` than a Moksha speaker will want it to. Four residues are known
# rather than guessed at, and are the next things to fix: the ablative is still
# written Erzya-style `-де/-до` outside the numerals («нетнеде»,
# «сюлмафкстнеде») where Moksha writes `-да`; the abessive is `-втомо`
# («таркавтомо», «точкавтомо») where Moksha writes `-фтома`; "equal" is
# «вейкетть», an Erzya form this seed could not confidently replace; and the
# lexicon row's «лама» reached only the bare word — everything built on it is
# still Erzya-shaped («ламоксчист», «ламоксчинтень», «аламо»,
# «коламо», «ламось»), because the seed could not establish Moksha's
# abstract-noun suffix here and declined to invent the case forms. The numerals
# and their ablative have been corrected — every `-да` on a digit below is the
# Moksha ending — so what is left is in the other endings rather than in the
# stems.
#
# Moksha counts in two plural categories, `one` and `other`, so every
# `{ $count -> … }` below keeps the shape it had. A noun after a numeral stays
# singular, so the two branches differ in nothing but the number they print.


## Answer submission

answer-checking = Ваннови…
answer-submitting = Кучови…
answer-checking-status = Каршо валось ваннови
answer-submitting-status = Каршо валось кучови
answer-correct = Виде
answer-incorrect = Аф виде
answer-response-saved = Каршо валось ванфтф
answer-percent-credit = { $percent }% балл
answer-percent-correct = { $percent }% виде
answer-percent-short = { $percent } %
max-credit-available = Саемс маштови сехте покш балл: { $percent }%
attempts-remaining =
    { $count ->
        [0] снартнема аш
        [one] { $count } снартнема кадовсь
       *[other] { $count } снартнема кадовсь
    }
validation-correct = (Виде)
validation-incorrect = (Аф виде)
validation-partially-correct = (Пельксэнь коряс виде)
answer-show-responses =
    { $count ->
        [one] { $answerId } ланкс { $count } каршо вал невтемс
       *[other] { $answerId } ланкс { $count } каршо вал невтемс
    }

## Disclosure panels

feedback-heading = Мекев ёвтамо
collapsible-click-to-open = (панжомга лепштик)
collapsible-click-to-close = (пекстамга лепштик)
collapsible-initializing = Анокстави…
footnote-show = Тешкстамоть невтемс
footnote-hide = Тешкстамоть кекшемс
description-more-information = поладкс тевпаро

## Controls

slider-previous = Инголень
slider-next = Сай
keyboard-open = Клавиатурать панжомс
keyboard-close = Клавиатурать пекстамс
choice-input-remove-choice = { $choice } кочкамоть саемс
matrix-remove-row = Рядоть саемс
matrix-add-row = Ряд поладомс
matrix-remove-column = Баганоть саемс
matrix-add-column = Баган поладомс
subset-add-remove-points = Точка поладомс/саемс
subset-toggle-points-intervals = Точкатнень и юткотнень полавтомс
subset-move-points = Точкатнень ютавтомс
subset-clear = Ванськавтомс
orbital-add-row = Ряд поладомс
orbital-remove-row = Рядоть саемс
orbital-add-box = Клетка поладомс
orbital-remove-box = Клеткать саемс
orbital-add-up-arrow = Верев нал поладомс
orbital-add-down-arrow = Алов нал поладомс
orbital-remove-arrow = Налоть саемс
orbital-row-label = { $row } рядонь тешкс
pretzel-answer = Каршо вал

## Math input

math-input-preview-region = математикань ёвтамонь икелькс ваномась
math-input-preview = Икелькс ваномась
math-input-invalid-expression = Аф виде ёвтамо:

## Document status

viewer-initializing = Анокстави…

## Errors

error-heading = Ильведефкс
error-found-at =
    { $span ->
        [line] Муезь ряд: { $startLine }.
       *[lines] Муезь рядт: { $startLine }–{ $endLine }.
    }
document-contains-errors = Тя документсэть улить ильведефкст!
diagnostic-heading-error = Ильведефкс
diagnostic-heading-warning = Икелев пелькстамо
diagnostic-heading-information = Тевпаро
diagnostic-heading-hint = Няфтемня
accessibility-heading-level-1 = WCAG AA пачкодемань коламо
accessibility-heading-level-2 = Пачкодемадо тевпаро
something-went-wrong = Мезеяк аф виде лиссь.
renderer-load-failed = артыцять аф саевсь. Лопать одкстомтык.
core-start-failed = Документэнь ваныцять аф ушодовсь. Лопать одкстомтык.
core-start-failed-busy = Тя документсь изь ушеду. Фкя пингста ушедсть лама документ, а сяда кальдяв компьютерса тя мольфти кувать. Лия документтне аделавихть меле лопать одукс кепедемась вермай лездомс.
core-start-failed-retry = Тя документсь изь ушеду.
core-start-failed-busy-retry = Тя документсь изь ушеду. Фкя пингста ушедсть лама документ, а сяда кальдяв компьютерса тя мольфти кувать.
core-start-retry = Варжак одукс
saved-state-unavailable = Тонь ванфтф уджце изь сявов.
