# Belarusian editor and language-server surfaces. Translated from
# `locales/en/editor.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# `WCAG AA`, `DoenetML`, `XML`, `styleNumber` and every attribute or element
# name are identifiers, not prose, and stay as written.
#
# Belarusian counts in four plural categories, but only a message that prints
# the number beside a noun needs all four. `help-coordinates` never shows its
# count — it decides a heading's singular against its plural — so `one` and
# `*[other]` are the whole selection there.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Скінуць
       *[update] Абнавіць
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } прагляд
       *[other] { $word } прагляд { $shortcut }
    }


## The variant picker

editor-variant = Варыянт
editor-variant-filter = Фільтр…
editor-variant-next = Выбраць наступны варыянт
editor-variant-previous = Выбраць папярэдні варыянт


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Выяўлена парушэнне даступнасці паводле WCAG AA. Націсніце, каб { $action ->
            [close] закрыць
           *[open] адкрыць
        } справаздачу пра даступнасць.
        [advisories] Націсніце, каб { $action ->
            [close] закрыць
           *[open] адкрыць
        } справаздачу пра даступнасць. Парушэнняў WCAG AA не знойдзена, але ёсць дадатковыя рэкамендацыі па даступнасці.
       *[clean] Націсніце, каб { $action ->
            [close] закрыць
           *[open] адкрыць
        } справаздачу пра даступнасць. Праблем з даступнасцю не знойдзена.
    }

editor-accessibility-label =
    { $status ->
        [violations] Выяўлена парушэнне даступнасці паводле WCAG AA. Знойдзена { $count ->
            [one] { $count } парушэнне WCAG AA
            [few] { $count } парушэнні WCAG AA
            [many] { $count } парушэнняў WCAG AA
           *[other] { $count } парушэнні WCAG AA
        }. Націсніце, каб { $action ->
            [close] закрыць
           *[open] адкрыць
        } справаздачу пра даступнасць.
        [advisories] Парушэнняў WCAG AA не выяўлена. Знойдзена { $count ->
            [one] { $count } дадатковая рэкамендацыя па даступнасці
            [few] { $count } дадатковыя рэкамендацыі па даступнасці
            [many] { $count } дадатковых рэкамендацый па даступнасці
           *[other] { $count } дадатковыя рэкамендацыі па даступнасці
        }. Націсніце, каб { $action ->
            [close] закрыць
           *[open] адкрыць
        } справаздачу пра даступнасць.
       *[clean] Парушэнняў WCAG AA не выяўлена. Націсніце, каб { $action ->
            [close] закрыць
           *[open] адкрыць
        } справаздачу пра даступнасць.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Версія DoenetML { $version }

editor-tab-help = Кантэкстная даведка
editor-tab-help-short = Кантэкст
editor-tab-errors = Памылкі
editor-tab-warnings = Папярэджанні
editor-tab-info = Звесткі
editor-tab-accessibility = Даступнасць
editor-tab-responses = Адпраўленыя адказы

editor-tab-with-count = { $label }: { $count }

editor-options = Налады рэдактара
editor-format-as-doenetml = Фарматаваць як DoenetML
editor-format-as-xml = Фарматаваць як XML


## The diagnostics panel

editor-diagnostic-line = Радок № { $line }

editor-no-errors = Памылак няма
editor-no-warnings = Папярэджанняў няма
editor-no-info = Інфармацыйных паведамленняў няма

editor-show-info-annotations = Паказваць інфармацыйныя паведамленні ў рэдактары
editor-show-accessibility-annotations = Паказваць паведамленні пра даступнасць у рэдактары

editor-accessibility-learn-more = Як Doenet падыходзіць да даступнасці

editor-accessibility-violations-heading = Парушэнні даступнасці ({ $standard })

editor-accessibility-other-heading = Іншыя праблемы з даступнасцю
editor-none-found = Нічога не знойдзена


## Submitted responses

editor-no-responses = Адпраўленых адказаў пакуль няма
editor-response-answer-id = Id адказу
editor-response-response = Адказ
editor-response-credit = Балы
editor-response-submitted = Адпраўлена


## The context-help panel

help-placeholder = Змясціце курсор на імя тэга, атрыбут або { $ref }, каб убачыць дакументацыю.

help-unsupported-ref-chain = Даведка па складаных спасылках накшталт { $example } пакуль не падтрымліваецца.

help-unresolved-ref =
    { $reason ->
        [notFound] Не знойдзены аб'ект для спасылкі: { $ref }.
        [multiple] Знойдзена некалькі аб'ектаў для спасылкі: { $ref }.
       *[indeterminate] Не ўдалося вызначыць аб'ект для { $ref }.
    }

help-learn-about-references = Больш пра спасылкі →
help-reference-page = Старонка даведніка →

help-suggestions-header =
    { $location ->
        [inside] Унутры { $element }
       *[top] На верхнім узроўні
    }{ $allowed ->
        [none] { " — тут нічога не можа быць." }
        [text] { " — тут можна ўвесці тэкст." }
        [text-and-components] { " — тут можна ўвесці тэкст або паспрабаваць:" }
       *[components] { " — можна паспрабаваць:" }
    }

help-suggestions-footer = Націсніце { $shortcut }, каб убачыць усе { $total } кампанентаў.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } — спасылка на { $target }.
       *[other] { $ref } — спасылка на { $target } (радок { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Уведзена { $owner } як { $role }.
       *[other] Уведзена { $owner } у радку { $line } як { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } — спасылка на ўласцівасць { $property } элемента { $element }.
       *[other] { $ref } — спасылка на ўласцівасць { $property } элемента { $element } (радок { $line }).
    }

help-kind-attribute = атрыбут
help-kind-snippet = фрагмент
help-kind-array-entry = элемент масіва

help-default = Прадвызначанае значэнне:
help-active-default = Дзейнае прадвызначанае значэнне:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Дапушчальныя значэнні (па адным на элемент):
       *[other] Дапушчальныя значэнні:
    }

help-suggested-values = Прапанаваныя значэнні:

help-inserts = Устаўляе:

help-coordinates =
    { $count ->
        [one] Каардыната:
       *[other] Каардынаты:
    }

help-type = Тып:

help-resolved-style = Выніковы стыль (styleNumber { $styleNumber }):

help-resolved-function-names = Выніковыя імёны функцый:
help-reset-list = Спіс скіду для гэтага поля:
help-added-on-input = Дададзена для гэтага поля:
help-removed-on-input = Выдалена для гэтага поля:

help-reset-overrides = { $reset } мае перавагу над { $additional } і { $removed }.
