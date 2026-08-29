# Lak editor and language-server surfaces. Translated from
# `locales/en/editor.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Lak in Cyrillic with the palochka, the orthography of Dagestan's schools and
# of the Lak-language press. Ӏ is a letter, not a Latin I and not a digit 1.
#
# `WCAG AA`, `DoenetML`, `XML`, `styleNumber` and every attribute or element
# name are identifiers rather than prose and stay exactly as written.
#
# Lak resolves the same two plural categories English does, so every count
# below keeps both branches. A noun after a numeral stays singular in Lak, so
# the two branches read alike; that is correct rather than an unfinished
# translation.
#
# Nothing here agrees with a noun class. Lak's four-class system is real, and
# where it would reach this package is `content.ftl` — whose header explains
# why that file does not fork on it either.
#
# The panel vocabulary is the weakest part of this file. Lak-language writing
# about software is very small, so «хьхьичӀава кӀицӀ» for a warning, «бигьану
# ишла баву» for accessibility and «хӀадур баву» for formatting are coinages
# this seed chose to be transparent rather than terms it found in use. A
# speaker should check those first.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Зана бан
       *[update] ЦӀудуккан дан
    }
editor-update-viewer-title =
    { $shortcut ->
        [none] Ккаккаву { $word }
       *[other] Ккаккаву { $word } { $shortcut }
    }

## The variant picker

editor-variant = Вариант
editor-variant-filter = Личлачаву…
editor-variant-next = Махъмур вариант язи бугьин
editor-variant-previous = ХьхьичӀмур вариант язи бугьин

## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA бигьану ишла баврил тӀалавшин лиян дурну дур. Бигьану ишла баврил отчёт { $action ->
            [close] лакьин
           *[open] тӀитӀин
        } щелк бува.
        [advisories] Бигьану ишла баврил отчёт { $action ->
            [close] лакьин
           *[open] тӀитӀин
        } щелк бува. WCAG AA лиян даву лявкъуну дакъар, амма бигьану ишла баврил цаймигу маслихӀатру бур.
       *[clean] Бигьану ишла баврил отчёт { $action ->
            [close] лакьин
           *[open] тӀитӀин
        } щелк бува. Бигьану ишла баврил цукунчӀавсса захӀматшиву лявкъуну дакъар.
    }
editor-accessibility-label =
    { $status ->
        [violations] WCAG AA бигьану ишла баврил тӀалавшин лиян дурну дур. { $count ->
            [one] WCAG AA { $count } лиян даву
           *[other] WCAG AA { $count } лиян даву
        } лявкъунни. Бигьану ишла баврил отчёт { $action ->
            [close] лакьин
           *[open] тӀитӀин
        } щелк бува.
        [advisories] WCAG AA лиян даву лявкъуну дакъар. Бигьану ишла баврил { $count ->
            [one] цаймигу { $count } маслихӀат
           *[other] цаймигу { $count } маслихӀат
        } лявкъунни. Бигьану ишла баврил отчёт { $action ->
            [close] лакьин
           *[open] тӀитӀин
        } щелк бува.
       *[clean] WCAG AA лиян даву лявкъуну дакъар. Бигьану ишла баврил отчёт { $action ->
            [close] лакьин
           *[open] тӀитӀин
        } щелк бува.
    }
editor-accessibility-badge = WCAG

## The footer

editor-version-title = DoenetML версия { $version }
editor-tab-help = КӀанттуцӀун бавхӀусса кумаг
editor-tab-help-short = Кумаг
editor-tab-errors = ГъалатӀру
editor-tab-warnings = ХьхьичӀава кӀицӀру
editor-tab-info = Хаварду
editor-tab-accessibility = Бигьану ишла баву
editor-tab-responses = Гьан дурсса жавабру
editor-tab-with-count = { $label }: { $count }
editor-options = Редакторданул параметрду
editor-format-as-doenetml = DoenetML куццуй хӀадур бан
editor-format-as-xml = XML куццуй хӀадур бан

## The diagnostics panel

editor-diagnostic-line = Строка #{ $line }
editor-no-errors = ГъалатӀру дакъар
editor-no-warnings = ХьхьичӀава кӀицӀру дакъар
editor-no-info = Хаварду дакъар
editor-show-info-annotations = Редакторданий хаварду ккаккан бан
editor-show-accessibility-annotations = Редакторданий бигьану ишла баврил кӀицӀру ккаккан бан
editor-accessibility-learn-more = Doenet бигьану ишла баврихун цукун бучӀайссарив лахьхьу
editor-accessibility-violations-heading = Бигьану ишла баврил лиян даврду ({ $standard })
editor-accessibility-other-heading = Бигьану ишла баврил цаймигу захӀматшивурду
editor-none-found = Лявкъуну дакъар

## Submitted responses

editor-no-responses = Гьан дурсса жавабру хӀаллихшиннайн дакъар
editor-response-answer-id = Жавабрал ид
editor-response-response = Жаваб
editor-response-credit = Балл
editor-response-submitted = Гьан дурну

## The context-help panel

help-placeholder = Документация ккаккан бан курсор тегърал цӀанийн, атрибутрайн я { $ref } тӀисса кӀанттайн бишира.
help-unsupported-ref-chain = { $example } кунмасса чӀярусса бутӀайх бавчусса ссылкардан кумаг хӀаллихшиннайн дакъар.
help-unresolved-ref =
    { $reason ->
        [notFound] { $ref } тӀисса ссылкалун ци кӀицӀ бувссарив лявкъуну дакъар.
        [multiple] { $ref } тӀисса ссылкалун чӀярусса кӀанттурду лявкъунни.
       *[indeterminate] { $ref } тӀисса ссылкалун ци кӀицӀ бувссарив кӀул бан къавхьунни.
    }
help-learn-about-references = Ссылкардая лахьхьу →
help-reference-page = Справкалул чӀапӀи →
help-suggestions-header =
    { $location ->
        [inside] { $element } дуссаксса
       *[top] Яла лахъмур даражалий
    }{ $allowed ->
        [none] { " — ва кӀанттай цучӀав къабагьай." }
        [text] { " — ва кӀанттай текст чичара." }
        [text-and-components] { " — ва кӀанттай текст чичара, я ххал бува:" }
       *[components] { " — ххал бансса затру:" }
    }
help-suggestions-footer = Гьарца { $total } компонент ккаккан бан { $shortcut } бишира.
help-name-summary = { $name } — { $summary }
help-ref-is-reference =
    { $line ->
        [none] { $ref } — { $target } тӀисса кӀанттайн бавчусса ссылка.
       *[other] { $ref } — { $target } тӀисса кӀанттайн бавчусса ссылка ({ $line } строка).
    }
help-ref-derived-from =
    { $line ->
        [none] { $owner } тӀисса кӀанттай { $role } хӀисаврай бивхьуссар.
       *[other] { $owner } тӀисса кӀанттай { $line } строкалий { $role } хӀисаврай бивхьуссар.
    }
help-property-is-reference =
    { $line ->
        [none] { $ref } — { $element } тӀисса кӀанттул { $property } свойстволийн бавчусса ссылка.
       *[other] { $ref } — { $element } тӀисса кӀанттул { $property } свойстволийн бавчусса ссылка ({ $line } строка).
    }
help-kind-attribute = атрибут
help-kind-snippet = сниппет
help-kind-array-entry = массивраву бивхьумур
help-default = Дефолт:
help-active-default = Даврий дусса дефолт:
help-style-number-annotation = { " " }(styleNumber { $styleNumber })
help-allowed-values =
    { $perItem ->
        [true] Ихтияр дусса кьиматру (гьарца бутӀлун ца):
       *[other] Ихтияр дусса кьиматру:
    }
help-suggested-values = МаслихӀат бувсса кьиматру:
help-inserts = Бишлашиссар:
help-coordinates =
    { $count ->
        [one] Координата:
       *[other] Координатру:
    }
help-type = Тип:
help-resolved-style = КӀул бувсса стиль (styleNumber { $styleNumber }):
help-resolved-function-names = КӀул бувсса функциярттал цӀарду:
help-reset-list = Ва инпутрай список зана баву:
help-added-on-input = Ва инпутрай бивхьумур:
help-removed-on-input = Ва инпутрай дуккан дурмур:
help-reset-overrides = { $reset } { $additional } ва { $removed } ххишалану бишлашиссар.
