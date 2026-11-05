# Sakha (Yakut) viewer chrome. Translated from `locales/en/chrome.ftl`, which
# is the source of truth: `lint:i18n` rejects a key that does not exist there,
# and reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# SAKHA RESOLVES EXACTLY ONE PLURAL CATEGORY. `Intl.PluralRules("sah")` reports
# `other` and nothing else, so no message in this catalog can select on a
# count and every counted message below is written flat — the shape
# `locales/ja`, `locales/th`, `locales/bo` and `locales/dz` already have, and
# the first time a Turkic language in this roster has it. It is not a claim
# that Sakha has no plural: it marks one with -лар and its family, but a noun
# after a numeral stays in the singular, so the number carries the counting on
# its own and a category would have nothing to choose between.
#
# The `[0]` branches that survive are matched by *number* rather than by
# category — Fluent resolves an explicit number before it consults the plural
# rules — which is why a separate wording for none is still reachable here.


## Answer submission

answer-checking = Бэрэбиэркэлэнэр…
answer-submitting = Ыытыллар…
answer-checking-status = Хоруй бэрэбиэркэлэнэр
answer-submitting-status = Хоруй ыытыллар
answer-correct = Сөп
answer-incorrect = Сыыһа
answer-response-saved = Хоруй хараллыбыта
answer-percent-credit = { $percent }% баал
answer-percent-correct = { $percent }% сөп
answer-percent-short = { $percent } %
max-credit-available = Ылыахха сөптөөх үрдүк баал: { $percent }%
attempts-remaining =
    { $count ->
        [0] боруобалыыр кыах хаалбата
       *[other] { $count } боруобалыыр кыах хаалла
    }
validation-correct = (Сөп)
validation-incorrect = (Сыыһа)
validation-partially-correct = (Аҥаардастыы сөп)
answer-show-responses = { $answerId } диэҥҥэ { $count } хоруйу көрдөр

## Disclosure panels

feedback-heading = Хардары этии
collapsible-click-to-open = (аһар туһугар баттаа)
collapsible-click-to-close = (сабар туһугар баттаа)
collapsible-initializing = Бэлэмнэнэр…
footnote-show = Бэлиэтээһини көрдөр
footnote-hide = Бэлиэтээһини кистээ
description-more-information = эбии информация

## Controls

slider-previous = Иннинээҕи
slider-next = Аныгыскы
keyboard-open = Клавиатураны аһар
keyboard-close = Клавиатураны сабар
choice-input-remove-choice = { $choice } талыытын сот
matrix-remove-row = Строканы сот
matrix-add-row = Строка эп
matrix-remove-column = Колонканы сот
matrix-add-column = Колонка эп
subset-add-remove-points = Туочука эбии/сотуу
subset-toggle-points-intervals = Туочукалары уонна кэрчиктэри уларыт
subset-move-points = Туочукалары көһөр
subset-clear = Ыраастаа
orbital-add-row = Строка эп
orbital-remove-row = Строканы сот
orbital-add-box = Кыаһы эп
orbital-remove-box = Кыаһы сот
orbital-add-up-arrow = Үөһэ ох эп
orbital-add-down-arrow = Аллара ох эп
orbital-remove-arrow = Оҕу сот
orbital-row-label = { $row } строка бэлиэтэ
pretzel-answer = Хоруй

## Math input

math-input-preview-region = математика этиитин иннинэ көрүү
math-input-preview = Иннинэ көрүү
math-input-invalid-expression = Сыыһа этии:

## Document status

viewer-initializing = Бэлэмнэнэр…

## Errors

error-heading = Алҕас
error-found-at =
    { $span ->
        [line] Булуллубут строка: { $startLine }.
       *[lines] Булуллубут строкалар: { $startLine }–{ $endLine }.
    }
document-contains-errors = Бу дьокумуоҥҥа алҕастар бааллар!
diagnostic-heading-error = Алҕас
diagnostic-heading-warning = Сэрэтии
diagnostic-heading-information = Информация
diagnostic-heading-hint = Сүбэ
accessibility-heading-level-1 = WCAG AA туттуллар кыаҕын кэһиитэ
accessibility-heading-level-2 = Туттуллар кыаҕын туһунан биллэрии
something-went-wrong = Туох эрэ сыыһа тахсыбыт.
renderer-load-failed = ойуулааччыны хачайдыы иликпит. Сирэйи саҥалыы хачайдаа.
core-start-failed = Дьокумуон көрөр тэрилин саҕалыыр кыах суох. Сирэйи саҥалыы хачайдаа.
