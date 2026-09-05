# Komi-Zyrian viewer chrome. Translated from `locales/en/chrome.ftl`, which is
# the source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Komi-Zyrian**, the literary standard of the Komi Republic. The directory is
# named `kpv` rather than the macrolanguage `kv` because Komi-Permyak ships
# beside it as `locales/koi`; `negotiate.ts` aliases `kv` onto `kpv`, so a
# document written with either tag reaches this catalog. See
# `locales/kpv/content.ftl` for the full note.
#
# Komi-Zyrian counts in two plural categories, `one` and `other`, so every
# `{ $count -> … }` below keeps the shape it had. A noun after a numeral stays
# singular, so the two branches differ in nothing but the number they print.


## Answer submission

answer-checking = Видлалӧ…
answer-submitting = Мӧдӧдӧ…
answer-checking-status = Вочакыв видлалӧ
answer-submitting-status = Вочакыв мӧдӧдӧ
answer-correct = Веськыд
answer-incorrect = Абу веськыд
answer-response-saved = Вочакыв видзӧма
answer-percent-credit = { $percent }% балл
answer-percent-correct = { $percent }% веськыд
answer-percent-short = { $percent } %
max-credit-available = Босьтны позян медся ыджыд балл: { $percent }%
attempts-remaining =
    { $count ->
        [0] видлӧм абу кольӧма
        [one] { $count } видлӧм кольӧма
       *[other] { $count } видлӧм кольӧма
    }
validation-correct = (Веськыд)
validation-incorrect = (Абу веськыд)
validation-partially-correct = (Юкӧнӧн веськыд)
answer-show-responses =
    { $count ->
        [one] { $answerId } вылӧ { $count } вочакыв петкӧдлыны
       *[other] { $answerId } вылӧ { $count } вочакыв петкӧдлыны
    }

## Disclosure panels

feedback-heading = Бӧр висьталӧм
collapsible-click-to-open = (восьтны вӧсна ляпкы)
collapsible-click-to-close = (пӧдлавны вӧсна ляпкы)
collapsible-initializing = Дасьтысьӧ…
footnote-show = Пасйӧд петкӧдлыны
footnote-hide = Пасйӧд дзебны
description-more-information = содтӧд юӧр

## Controls

slider-previous = Бӧрлань
slider-next = Водзлань
keyboard-open = Клавиатура восьтны
keyboard-close = Клавиатура пӧдлавны
choice-input-remove-choice = { $choice } бӧрйӧм бӧрйыны
matrix-remove-row = Визь бӧрйыны
matrix-add-row = Визь содтыны
matrix-remove-column = Юрбитан бӧрйыны
matrix-add-column = Юрбитан содтыны
subset-add-remove-points = Пас содтыны/бӧрйыны
subset-toggle-points-intervals = Пасъяс да коласъяс вежны
subset-move-points = Пасъяс вуджӧдны
subset-clear = Сӧстӧммӧдны
orbital-add-row = Визь содтыны
orbital-remove-row = Визь бӧрйыны
orbital-add-box = Клетка содтыны
orbital-remove-box = Клетка бӧрйыны
orbital-add-up-arrow = Вылӧ ньӧв содтыны
orbital-add-down-arrow = Улӧ ньӧв содтыны
orbital-remove-arrow = Ньӧв бӧрйыны
orbital-row-label = { $row } визьлӧн пасыс
pretzel-answer = Вочакыв

## Math input

math-input-preview-region = математическӧй висьталӧмлӧн водзвыв видзӧдлӧм
math-input-preview = Водзвыв видзӧдлӧм
math-input-invalid-expression = Абу веськыд висьталӧм:

## Document status

viewer-initializing = Дасьтысьӧ…

## Errors

error-heading = Тшыкӧдчӧм
error-found-at =
    { $span ->
        [line] Аддзӧм визь: { $startLine }.
       *[lines] Аддзӧм визьяс: { $startLine }–{ $endLine }.
    }
document-contains-errors = Тайӧ документын тшыкӧдчӧмъяс эмӧсь!
diagnostic-heading-error = Тшыкӧдчӧм
diagnostic-heading-warning = Пасйӧм
diagnostic-heading-information = Юӧр
diagnostic-heading-hint = Индӧд
accessibility-heading-level-1 = WCAG AA воан позянлун торкӧм
accessibility-heading-level-2 = Воан позянлун йылысь юӧр
something-went-wrong = Мыйкӧ абу веськыда петіс.
renderer-load-failed = серпасалысьсӧ пыртны эз артмы. Лист бок выльмӧд.
core-start-failed = Документ видзӧдысьсӧ заводитны эз артмы. Лист бок выльмӧд.
