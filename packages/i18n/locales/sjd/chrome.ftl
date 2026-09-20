# Kildin Sami viewer chrome. Translated from `locales/en/chrome.ftl`, which is
# the source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **This is the sharpest catalog in the roster, and it is worth saying why in
# one place.** Kildin Sami — кӣллт са̄мь кӣлл — is a Sami language written in
# **Cyrillic**. It therefore sits in two groups at once and matches neither of
# them completely:
#
#   * by family it belongs with `locales/se`, `locales/sma`, `locales/smj` and
#     `locales/smn` — the same Sami vocabulary, the same three-way stem
#     alternation, the same absence of gender;
#   * by script it belongs with `locales/koi`, `locales/mdf` and `locales/mrj`
#     — Cyrillic Uralic catalogs written for schools inside Russia, taking
#     their technical vocabulary from Russian.
#
# Kildin is spoken on the Kola Peninsula and is written with Cyrillic plus its
# own letters: `ā ē ӣ ō ӯ ы̄` for the long vowels, `ҍ` for the soft sign that
# is not `ь`, `ӆ ӎ ӊ ҏ` for the voiceless sonorants, `ӈ`, and `ӭ`. Those are
# letters of the alphabet, not decorated Russian ones, and a pass that
# "normalises" them to their Russian look-alikes destroys words.
#
# **The plural difference is the one a message author has to know about.**
# `Intl.PluralRules("sjd")` resolves `one` and `other` and nothing else, so —
# unlike every other Sami catalog in this repository — **no message here can
# select on a dual.** Kildin has a dual in its pronouns and its verbs exactly
# as Northern and Skolt Sami do; CLDR simply does not give the language a
# `two` plural category, so a `[two]` branch written below would be dead text
# that Fluent never reaches. Where `locales/se` and `locales/sms` write three
# branches, this file writes two, and that is a fact about the plural-rule data
# rather than about the language. A reviewer who wants the dual back has to
# take it up with CLDR, not with this file.
#
# **THIS IS THE LEAST CERTAIN CATALOG IN ITS GROUP, and a speaker should read
# it before the two Sami catalogs beside it.** Kildin is severely endangered —
# a few hundred speakers, most of them elderly — and its written output is
# small: some schoolbooks, a dictionary tradition, a little journalism, and not
# much else. This seed had markedly less Kildin to draw on than it had Northern
# Sami, and far less than it had Russian. Where a Kildin word was not available
# to it, it did one of two things, both of which a reviewer should expect to
# find: it used the **Russian** technical noun, which is what written Kildin
# does with «компонент», «атрибут», «функция», «индекс» anyway; or it derived a
# Sami word from its Northern or Skolt cognate and wrote it in Kildin's
# Cyrillic conventions. The second of those is reconstruction and not
# attestation. `locales/xal` set the precedent for saying so in a file's own
# header rather than leaving a reader to discover it.
#
# `one` does not catch zero, so the wording for none is spelled out in `[0]`.


## Answer submission

answer-checking = Та̄ррькхэ…
answer-submitting = Вӯлльктэ…
answer-checking-status = Вāсьт та̄ррькхэлл
answer-submitting-status = Вāсьт вӯлльктэлл
answer-correct = Вӯййкесь
answer-incorrect = Пāстэй
answer-response-saved = Вāсьт сӯййтма
answer-percent-credit = { $percent }% ба̄лла
answer-percent-correct = { $percent }% вӯййкесь
answer-percent-short = { $percent } %
max-credit-available = Шӯрмус ба̄лл: { $percent }%
attempts-remaining =
    { $count ->
        [0] пробаhь ей ля
        [one] па̄дэ { $count } проба
       *[other] па̄дэ { $count } проба
    }
validation-correct = (Вӯййкесь)
validation-incorrect = (Пāстэй)
validation-partially-correct = (Ча̄ссҍ вӯййкесь)
answer-show-responses =
    { $count ->
        [one] Вуэссьтэ { $count } вāсьт та̄ррьм: { $answerId }
       *[other] Вуэссьтэ { $count } вāсьт та̄ррьм: { $answerId }
    }

## Disclosure panels

feedback-heading = Мāhцлувв
collapsible-click-to-open = (кыррьк ва̄лльтэ)
collapsible-click-to-close = (кыррьк кӣдтэ)
collapsible-initializing = Алльктэ…
footnote-show = Вуэссьтэ вӯлльсэ мērка
footnote-hide = Кāххьтэ вӯлльсэ мērка
description-more-information = ēнас тēдт

## Controls

slider-previous = Оуддэль
slider-next = Пуэдтҍе
keyboard-open = Ва̄лльтэ клавиатур
keyboard-close = Кӣдтэ клавиатур
choice-input-remove-choice = Вāльтэ ēлль { $choice }
matrix-remove-row = Вāльтэ ēлль ридт
matrix-add-row = Лāссьтэ ридт
matrix-remove-column = Вāльтэ ēлль столбец
matrix-add-column = Лāссьтэ столбец
subset-add-remove-points = Лāссьтэ/вāльтэ ēлль точкаhь
subset-toggle-points-intervals = Мōлльстэ точкаhь я интервалла коскэсьт
subset-move-points = Сӣррьтэ точкаhь
subset-clear = Пуhьтэ
orbital-add-row = Лāссьтэ ридт
orbital-remove-row = Вāльтэ ēлль ридт
orbital-add-box = Лāссьтэ ящик
orbital-remove-box = Вāльтэ ēлль ящик
orbital-add-up-arrow = Лāссьтэ ноаллэ па̄йяс
orbital-add-down-arrow = Лāссьтэ ноаллэ вӯлльса
orbital-remove-arrow = Вāльтэ ēлль ноаллэ
orbital-row-label = Ридт { $row } нэ̄ммп
pretzel-answer = Вāсьт

## Math input

math-input-preview-region = математическэ выражения оудвуэссьтэм
math-input-preview = Оудвуэссьтэм
math-input-invalid-expression = Пāстэй выражения:

## Document status

viewer-initializing = Алльктэ…

## Errors

error-heading = Пāстэй сāhь
error-found-at =
    { $span ->
        [line] Кāввнма { $startLine } линиесьт.
       *[lines] Кāввнма { $startLine }–{ $endLine } линиенҍ.
    }
document-contains-errors = Тэнн документэсьт ля пāстэй сāhь!
diagnostic-heading-error = Пāстэй сāhь
diagnostic-heading-warning = Ва̄рртэм
diagnostic-heading-information = Тēдт
diagnostic-heading-hint = Ноаллэсэсс
accessibility-heading-level-1 = WCAG AA доступность рӣккмуш
accessibility-heading-level-2 = Доступность ва̄рртэм
something-went-wrong = Мӣ-ля мāнэ пāстэй.
renderer-load-failed = вуэссьтэммодуль элль вāлльт. Вāльтэ лӣстт ōдтэсьт.
core-start-failed = Документвуэссьтэй элль алльк. Вāльтэ лӣстт ōдтэсьт.
core-start-failed-busy = Документвуэссьтэй элль алльк. Мāҏhа документ алльктэнҍ ыджя а̄йкма, тэдт вуэйй кӯhкь мāнне ва̄ннҍса машинасьт. Кōhт нӯббь документ ля валльм, лӣстт ōдтэсьт вāльтэм вуэйй вуэhкье.
core-start-failed-retry = Документвуэссьтэй элль алльк.
core-start-failed-busy-retry = Документвуэссьтэй элль алльк. Мāҏhа документ алльктэнҍ ыджя а̄йкма, тэдт вуэйй кӯhкь мāнне ва̄ннҍса машинасьт.
core-start-retry = Пыррьтэ ōдтэсьт
saved-state-unavailable = Тӯнн сӯййтма рāботт элль вāлльт.
