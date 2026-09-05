# Ingush viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Ingush (гӀалгӀай мотт), written in Cyrillic with the palochka Ӏ — the
# orthography Ingushetia's schools and publishing use and what CLDR fills a
# bare `inh` in as (`inh` maximizes to `inh-Cyrl-RU`). The palochka is a
# letter, not a Latin capital I and not a digit 1; a catalog that spells
# «Ӏаьржа» with either has quietly stopped being Ingush.
#
# **This catalog's nearest neighbour in the roster is `locales/ce`, and it is
# one language over rather than a dialect of this one.** Ingush and Chechen are
# the two Vainakh languages: they share the в-/й-/б-/д- class system, much of
# the vocabulary and most of the syntax, and a reader who knows one can follow
# the other. They are still two literary standards with two orthographic
# habits, so this file was written as Ingush rather than as a respelling —
# «доаца» where Chechen writes «доцу», «оагӀув» for a page where Chechen writes
# «агӀо», «кийчду» where Chechen writes «кечдо». Where the two genuinely
# coincide the coincidence is correct and was left alone. Where this seed was
# less sure which of the two a word belongs to, the header of `content.ftl`
# says so.
#
# Ingush counts in two plural categories, `one` and `other`, so every
# `{ $count -> … }` below keeps the shape it had. A noun after a numeral stays
# singular, so the two branches differ in nothing but the number they print.
#
# Nothing in this file agrees with a noun class — see `content.ftl`, which is
# where the class fork lives and where the class table a speaker should check
# first is written out.


## Answer submission

answer-checking = Талло…
answer-submitting = ДӀалуш да…
answer-checking-status = Жоп талло
answer-submitting-status = Жоп дӀалу
answer-correct = Нийса
answer-incorrect = Нийса дац
answer-response-saved = Жоп Ӏалашдаьд
answer-percent-credit = { $percent }% балл
answer-percent-correct = { $percent }% нийса
answer-percent-short = { $percent } %
max-credit-available = Схьаэца йиш йолу лакхара балл: { $percent }%
attempts-remaining =
    { $count ->
        [0] гӀорт йисаяц
        [one] { $count } гӀорт йисай
       *[other] { $count } гӀорт йисай
    }
validation-correct = (Нийса)
validation-incorrect = (Нийса дац)
validation-partially-correct = (Дакъа нийса)
answer-show-responses =
    { $count ->
        [one] { $answerId } тӀа { $count } жоп гойта
       *[other] { $answerId } тӀа { $count } жоп гойта
    }

## Disclosure panels

feedback-heading = Юхахаам
collapsible-click-to-open = (даста тӀатаӀае)
collapsible-click-to-close = (дӀакъовла тӀатаӀае)
collapsible-initializing = Кийчду…
footnote-show = Билгалдар гойта
footnote-hide = Билгалдар къайладаккха
description-more-information = кхы дола хаам

## Controls

slider-previous = Хьалха
slider-next = ТӀехьа
keyboard-open = Клавиатура даста
keyboard-close = Клавиатура дӀакъовла
choice-input-remove-choice = { $choice } харжам дӀабаккха
matrix-remove-row = МогӀа дӀабаккха
matrix-add-row = МогӀа тӀатоха
matrix-remove-column = Багана дӀаяккха
matrix-add-column = Багана тӀатоха
subset-add-remove-points = ТӀадамаш тӀатоха/дӀабаха
subset-toggle-points-intervals = ТӀадамаш а, юкъаш а хийца
subset-move-points = ТӀадамаш дӀаоттаде
subset-clear = ЦӀенде
orbital-add-row = МогӀа тӀатоха
orbital-remove-row = МогӀа дӀабаккха
orbital-add-box = Клетка тӀатоха
orbital-remove-box = Клетка дӀаяккха
orbital-add-up-arrow = Лакхара тӀам тӀатоха
orbital-add-down-arrow = Лохара тӀам тӀатоха
orbital-remove-arrow = ТӀам дӀабаккха
orbital-row-label = { $row } могӀан хьаьрк
pretzel-answer = Жоп

## Math input

math-input-preview-region = математически билгалдаккхара хьалхара хьажар
math-input-preview = Хьалхара хьажар
math-input-invalid-expression = Нийса доаца билгалдаккхар:

## Document status

viewer-initializing = Кийчду…

## Errors

error-heading = ГӀалат
error-found-at =
    { $span ->
        [line] { $startLine }-ча могӀанехь корадаьд.
       *[lines] { $startLine }–{ $endLine } могӀанашка корадаьд.
    }
document-contains-errors = Укх документехь гӀалаташ да!
diagnostic-heading-error = ГӀалат
diagnostic-heading-warning = Тергамбар
diagnostic-heading-information = Хаам
diagnostic-heading-hint = Хьехам
accessibility-heading-level-1 = WCAG AA кхачара дохадар
accessibility-heading-level-2 = Кхачара хьакъехьа хаам
something-went-wrong = ХӀама нийса ца хиннад.
renderer-load-failed = сурт дехкархо чуйийла ца делар. ОагӀув керлаяккха.
core-start-failed = Укх документа хьажархо болабе ца делар. ОагӀув керлаяккха.
core-start-failed-busy = Укх документа хьажархо болабе ца делар. Дукха документаш цхьана хана йолалуш яра, из ткъа мело болхбеча компьютера тӀа тӀехьадоагӀа. Кхыдола документаш кийчле, тӀаккха оагӀув керлаяккхарах пайда хила мега.
core-start-failed-retry = Укх документа хьажархо болабе ца делар.
core-start-failed-busy-retry = Укх документа хьажархо болабе ца делар. Дукха документаш цхьана хана йолалуш яра, из ткъа мело болхбеча компьютера тӀа тӀехьадоагӀа.
core-start-retry = Юха гӀорта
saved-state-unavailable = Шун Ӏалашдаь болх чубала ца делар.
