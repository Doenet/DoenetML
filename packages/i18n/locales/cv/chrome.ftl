# Chuvash viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Chuvash resolves a CLDR `zero` category, and it is the second catalog here to
# do so after `locales/lv` — but it means the opposite thing. Latvian's `zero`
# covers every number ending in 0 and the whole of the teens; Chuvash's fires
# for exactly 0 and nothing else, and `one` for exactly 1, so 21 and 101 are
# `other` where Latvian's are `one`. A `zero` category is therefore not a fact
# about a language family or about a script: it is a rule, and the two rules
# here happen to share a name.
#
# The consequence for this file is small and worth stating so nobody
# "corrects" it: `attempts-remaining` keeps the explicit `[0]` branch and adds
# no `[zero]`, because `[0]` is matched by number and would win over the
# category anyway. Where English writes no `[0]` — `answer-show-responses` —
# the `[zero]` branch is written out and is genuinely reached.


## Answer submission

answer-checking = Тĕрĕслет…
answer-submitting = Ярать…

answer-checking-status = Хурава тĕрĕслет
answer-submitting-status = Хурава ярать

answer-correct = Тĕрĕс
answer-incorrect = Йăнăш

answer-response-saved = Хурав упранчĕ

answer-percent-credit = { $percent }% балл
answer-percent-correct = { $percent }% тĕрĕс
answer-percent-short = { $percent } %

max-credit-available = Пулма пултаракан чи пысăк балл: { $percent }%

attempts-remaining =
    { $count ->
        [0] хăтланса пăхмалли юлмарĕ
        [one] { $count } хут хăтланса пăхма юлчĕ
       *[other] { $count } хут хăтланса пăхма юлчĕ
    }

validation-correct = (Тĕрĕс)
validation-incorrect = (Йăнăш)
validation-partially-correct = (Пайăн-пайăн тĕрĕс)

answer-show-responses =
    { $count ->
        [zero] { $answerId } валли хурав çук
        [one] { $answerId } валли { $count } хурав кăтартас
       *[other] { $answerId } валли { $count } хурав кăтартас
    }


## Disclosure panels

feedback-heading = Хирĕç калани

collapsible-click-to-open = (уçма пусăр)
collapsible-click-to-close = (хупма пусăр)

collapsible-initializing = Хатĕрленет…

footnote-show = Асăрхаттарăва кăтартас
footnote-hide = Асăрхаттарăва пытарас

description-more-information = хушма информаци


## Controls

slider-previous = Малтанхи
slider-next = Тепĕр

keyboard-open = Клавиатурăна уçас
keyboard-close = Клавиатурăна хупас

choice-input-remove-choice = { $choice } суйлавне кăларас

matrix-remove-row = Йĕркене кăларас
matrix-add-row = Йĕрке хушас
matrix-remove-column = Юпана кăларас
matrix-add-column = Юпа хушас

subset-add-remove-points = Пăнчă хушас/кăларас
subset-toggle-points-intervals = Пăнчăсемпе хушăксене улăштарас
subset-move-points = Пăнчăсене куçарас
subset-clear = Тасатас

orbital-add-row = Йĕрке хушас
orbital-remove-row = Йĕркене кăларас
orbital-add-box = Куçă хушас
orbital-remove-box = Куçă кăларас
orbital-add-up-arrow = Çӳлелле йĕппи хушас
orbital-add-down-arrow = Аялалла йĕппи хушас
orbital-remove-arrow = Йĕппе кăларас

orbital-row-label = { $row } йĕркин палли

pretzel-answer = Хурав

summary-statistics-caption = { $column } юпин пĕтĕмлетӳ статистики


## Math input

math-input-preview-region = математика палăртăвне малтан пăхни
math-input-preview = Малтан пăхни
math-input-invalid-expression = Тĕрĕс мар палăрту:


## Document status

viewer-initializing = Хатĕрленет…


## Errors

error-heading = Йăнăш

error-found-at =
    { $span ->
        [line] Тупнă йĕрке: { $startLine }.
       *[lines] Тупнă йĕркесем: { $startLine }–{ $endLine }.
    }

document-contains-errors = Ку документра йăнăшсем пур!

diagnostic-heading-error = Йăнăш
diagnostic-heading-warning = Асăрхаттару
diagnostic-heading-information = Информаци
diagnostic-heading-hint = Канаш

accessibility-heading-level-1 = WCAG AA майлăх пăсăлăвĕ
accessibility-heading-level-2 = Майлăх пирки хыпар

something-went-wrong = Темĕн йăнăш пулса тухрĕ.

renderer-load-failed = ӳкерекеннине тиеме пулмарĕ. Страницăна çĕнетĕр.

core-start-failed = Документ пăхмалли хатĕре ĕçлеттерсе яма пулмарĕ. Страницăна çĕнетĕр.
