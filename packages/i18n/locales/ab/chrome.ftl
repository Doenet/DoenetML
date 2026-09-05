# Abkhaz viewer chrome. Translated from `locales/en/chrome.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in the extended Cyrillic alphabet Abkhazia's schools and publishing
# use, which is what CLDR fills a bare `ab` in as (`ab` maximizes to
# `ab-Cyrl-GE`). ԥ is U+0525 and not the older ҧ U+04A7, ә is U+04D9 and not a
# Latin a; ҟ, ҭ, ҳ, ҵ, ҷ, ҽ, ҿ, ҩ and ҕ are each one letter. A mis-keyed one is
# not a typo here, it is a different word or no word at all.
#
# Abkhaz counts in two plural categories, `one` and `other`, so every
# `{ $count -> … }` below keeps the shape English gave it. A noun after a
# numeral stays in the singular, so the two branches differ in nothing but the
# number they print — the `[0]` branch of `attempts-remaining` is the only one
# that says something different, because Abkhaz negates the existential rather
# than counting to zero.
#
# Nothing in this file agrees with a noun class. Abkhaz agreement is a prefix
# on a verb, and the one place it could have reached the catalog is in
# `content.ftl`, whose header explains why it does not fork there either.
#
# The technical vocabulary is the Russian one where written Abkhaz uses the
# Russian one — «аклавиатура», «аматрица», «аинтервал», «аинформациа» — rather
# than a coinage invented for this file.


## Answer submission

answer-checking = Агәаҭара…
answer-submitting = Адәықәҵара…
answer-checking-status = Аҭак агәаҭара
answer-submitting-status = Аҭак адәықәҵара
answer-correct = Иашоуп
answer-incorrect = Иашаӡам
answer-response-saved = Аҭак еиқәырхоуп
answer-percent-credit = { $percent }% абал
answer-percent-correct = { $percent }% иашоуп
answer-percent-short = { $percent } %
max-credit-available = Иахьӡозаалакь абал зегь реиҳа: { $percent }%
attempts-remaining =
    { $count ->
        [0] аԥышәара ыҟаӡам
        [one] иаанхоит { $count } аԥышәара
       *[other] иаанхоит { $count } аԥышәара
    }
validation-correct = (Иашоуп)
validation-incorrect = (Иашаӡам)
validation-partially-correct = (Ахәҭала иашоуп)
answer-show-responses =
    { $count ->
        [one] { $answerId } азы { $count } аҭак аарԥшра
       *[other] { $answerId } азы { $count } аҭак аарԥшра
    }

## Disclosure panels

feedback-heading = Ахәшьара
collapsible-click-to-open = (аартразы иақәыӷәӷәа)
collapsible-click-to-close = (аркразы иақәыӷәӷәа)
collapsible-initializing = Аиқәыршәара…
footnote-show = Аҵаҟатәи азгәаҭа аарԥшра
footnote-hide = Аҵаҟатәи азгәаҭа аҵәахра
description-more-information = еиҳаны аинформациа

## Controls

slider-previous = Аԥхьатәи
slider-next = Анаҩстәи
keyboard-open = Аклавиатура аартра
keyboard-close = Аклавиатура аркра
choice-input-remove-choice = { $choice } аныхра
matrix-remove-row = Ацәаҳәа аныхра
matrix-add-row = Ацәаҳәа ацҵара
matrix-remove-column = Аколонка аныхра
matrix-add-column = Аколонка ацҵара
subset-add-remove-points = Акәаԥқәа рцҵара/рыныхра
subset-toggle-points-intervals = Акәаԥқәеи аинтервалқәеи реиҭныԥсахлара
subset-move-points = Акәаԥқәа риагара
subset-clear = Арыцқьара
orbital-add-row = Ацәаҳәа ацҵара
orbital-remove-row = Ацәаҳәа аныхра
orbital-add-box = Аклетка ацҵара
orbital-remove-box = Аклетка аныхра
orbital-add-up-arrow = Хыхьҟатәи ахыц ацҵара
orbital-add-down-arrow = Ҵаҟаҟатәи ахыц ацҵара
orbital-remove-arrow = Ахыц аныхра
orbital-row-label = { $row }-тәи ацәаҳәа ахьӡ
pretzel-answer = Аҭак

## Math input

math-input-preview-region = аматематикатә формула аԥхьаԥшра
math-input-preview = Аԥхьаԥшра
math-input-invalid-expression = Ииашам аформула:

## Document status

viewer-initializing = Аиқәыршәара…

## Errors

error-heading = Агха
error-found-at =
    { $span ->
        [line] Иԥшаан { $startLine }-тәи ацәаҳәаҿы.
       *[lines] Иԥшаан ацәаҳәақәа { $startLine }–{ $endLine } рҿы.
    }
document-contains-errors = Ари адокумент гхақәа амоуп!
diagnostic-heading-error = Агха
diagnostic-heading-warning = Агәаҽанҵара
diagnostic-heading-information = Аинформациа
diagnostic-heading-hint = Ацхыраагӡа
accessibility-heading-level-1 = WCAG AA анеира алшара аеилагара
accessibility-heading-level-2 = Анеира алшара иазку агәаҽанҵара
something-went-wrong = Акы гхала ицеит.
renderer-load-failed = асахьаҭыхга аҭагалара ауам. Адаҟьа еиҭаҭагала.
core-start-failed = Ари адокумент алагара ауам. Адаҟьа еиҭаҭагала.
core-start-failed-busy = Ари адокумент алагара ауам. Зныкала документқәак еицалагеит, аиҿартәыра ласымзар уи еиҳа аамҭа адҵахоит. Егьырҭ адокументқәа анхыркәшалак ашьҭахь адаҟьа еиҭаҭагалара ацхыраара ауеит.
core-start-failed-retry = Ари адокумент алагара ауам.
core-start-failed-busy-retry = Ари адокумент алагара ауам. Зныкала документқәак еицалагеит, аиҿартәыра ласымзар уи еиҳа аамҭа адҵахоит.
core-start-retry = Даҽазнык
saved-state-unavailable = Шәара шәусура еиқәырхоу аҭагалара ауам.
