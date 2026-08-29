# Tabasaran editor and language-server surfaces. Translated from
# `locales/en/editor.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in the Cyrillic orthography of the Tabasaran literary language. The
# palochka Ӏ is a letter, not a Latin I and not a digit 1.
#
# `WCAG AA`, `DoenetML`, `XML`, `styleNumber` and every attribute or element
# name are identifiers rather than prose and stay exactly as written.
#
# Tabasaran counts in `one` and `other`, so both branches of every count stay —
# and a noun after a numeral stays singular, so the two read alike. Nothing
# here forks on a noun class: Tabasaran's two classes are carried by numerals,
# by the verb and by some pronouns, and `content.ftl`'s header sets out why
# that keeps them out of these catalogs entirely.
#
# No case ending is welded onto a placeable. Where one was wanted the ending
# went onto a noun this file writes — «лишандиин» after `{ $ref }` in
# `help-placeholder`, «элементдиъ» after `{ $element }`, «терефнаан» after
# `{ $owner }` — which is why those three read differently from English rather
# than being translated in place.
#
# Least certain: the interface vocabulary is where an unreviewed seed is
# weakest, and «хъуркьувал» for accessibility, «лигру пенжер» for the viewer
# and «ивру» for an input field are this seed's own renderings rather than
# terms it could attest. Everything computing-specific that Tabasaran writing
# takes from Russian is left in Russian — «редактор», «вариант», «фильтр»,
# «ссылка», «отчёт», «координата» — which is what Tabasaran technical prose
# does.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Хътакуб
       *[update] ЦӀийи апӀуб
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] Лигру пенжер { $word }
       *[other] Лигру пенжер { $word } { $shortcut }
    }


## The variant picker

editor-variant = Вариант
editor-variant-filter = Фильтр…
editor-variant-next = Кьяляхъна вариант сечмиш апӀуб
editor-variant-previous = Улихьна вариант сечмиш апӀуб


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA хъуркьувалин нарушение а. Хъуркьувалин отчёт { $action ->
            [close] багъламиш
           *[open] ачмиш
        } апӀуз клик апӀин.
        [advisories] Хъуркьувалин отчёт { $action ->
            [close] багъламиш
           *[open] ачмиш
        } апӀуз клик апӀин. WCAG AA нарушенияр адар, амма жара меслятар а.
       *[clean] Хъуркьувалин отчёт { $action ->
            [close] багъламиш
           *[open] ачмиш
        } апӀуз клик апӀин. Хъуркьувалин масъалаяр адар.
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA хъуркьувалин нарушение а. { $count ->
            [one] { $count } WCAG AA нарушение
           *[other] { $count } WCAG AA нарушение
        } а. Хъуркьувалин отчёт { $action ->
            [close] багъламиш
           *[open] ачмиш
        } апӀуз клик апӀин.
        [advisories] WCAG AA нарушенияр адар. { $count ->
            [one] { $count } элаве меслят
           *[other] { $count } элаве меслят
        } а. Хъуркьувалин отчёт { $action ->
            [close] багъламиш
           *[open] ачмиш
        } апӀуз клик апӀин.
       *[clean] WCAG AA нарушенияр адар. Хъуркьувалин отчёт { $action ->
            [close] багъламиш
           *[open] ачмиш
        } апӀуз клик апӀин.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML версия { $version }

editor-tab-help = Контекстдин кюмек
editor-tab-help-short = Контекст
editor-tab-errors = ГъалатӀар
editor-tab-warnings = Хабардарар
editor-tab-info = Мялумат
editor-tab-accessibility = Хъуркьувал
editor-tab-responses = Ивнайи жавабар

editor-tab-with-count = { $label }: { $count }

editor-options = Редакторин параметрар
editor-format-as-doenetml = DoenetML кьяйдайиинди форматламиш апӀуб
editor-format-as-xml = XML кьяйдайиинди форматламиш апӀуб


## The diagnostics panel

editor-diagnostic-line = Жерге #{ $line }

editor-no-errors = ГъалатӀар адар
editor-no-warnings = Хабардарар адар
editor-no-info = Мялуматин хабарар адар

editor-show-info-annotations = Мялуматин хабарар редакториъ улупуб
editor-show-accessibility-annotations = Хъуркьувалин хабарар редакториъ улупуб

editor-accessibility-learn-more = Doenet хъуркьувализ фици лигура

editor-accessibility-violations-heading = Хъуркьувалин нарушенияр ({ $standard })

editor-accessibility-other-heading = Жара хъуркьувалин масъалаяр
editor-none-found = ЗатӀ адар


## Submitted responses

editor-no-responses = Гьеле ивнайи жавабар адар
editor-response-answer-id = Жавабин Id
editor-response-response = Жаваб
editor-response-credit = Балл
editor-response-submitted = Ивна


## The context-help panel

help-placeholder = Документация бадали курсор тегдин ччвуриин, атрибутиин ва я { $ref } лишандиин ивин.

help-unsupported-ref-chain = { $example } жюре гизаф пайлу ссылкйириз кюмек гьеле адар.

help-unresolved-ref =
    { $reason ->
        [notFound] Ссылкйин объект адар: { $ref }.
        [multiple] Ссылкйиз гизаф объектар а: { $ref }.
       *[indeterminate] { $ref } ссылкйин объект тайин апӀуз гъабхьундар.
    }

help-learn-about-references = Ссылкйирикан аьгъю апӀин →
help-reference-page = Справкайин ччин →

help-suggestions-header =
    { $location ->
        [inside] { $element } элементдиъ
       *[top] Заан дережайиъ
    }{ $allowed ->
        [none] { " — мушв затӀ жеди дар." }
        [text] { " — мушв текст ликӀуз шулу." }
        [text-and-components] { " — мушв текст ликӀуз шулу, ва я мурар синамиш апӀин:" }
       *[components] { " — мурар синамиш апӀин:" }
    }

help-suggestions-footer = Вари { $total } компонент лигуз { $shortcut } тӀуб иливин.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } — { $target } объектдиз ссылка ву.
       *[other] { $ref } — { $target } объектдиз ссылка ву ({ $line } жерге).
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } терефнаан { $role } кьяйдайиинди гъибтна.
       *[other] { $owner } терефнаан { $line } жергейиъ { $role } кьяйдайиинди гъибтна.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } — { $element } элементдин { $property } свойствойиз ссылка ву.
       *[other] { $ref } — { $element } элементдин { $property } свойствойиз ссылка ву ({ $line } жерге).
    }

help-kind-attribute = атрибут
help-kind-snippet = фрагмент
help-kind-array-entry = массивдин элемент

help-default = Стандарт кьимат:
help-active-default = Гьамусдин стандарт кьимат:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Ихтияр вуйи кьиматар (гьар са элементдиз саб):
       *[other] Ихтияр вуйи кьиматар:
    }

help-suggested-values = Меслят вуйи кьиматар:

help-inserts = Ивура:

help-coordinates =
    { $count ->
        [one] Координата:
       *[other] Координатйир:
    }

help-type = Жюре:

help-resolved-style = Тайин гъабхьи стиль (styleNumber { $styleNumber }):

help-resolved-function-names = Тайин гъабхьи функцйирин ччвурар:
help-reset-list = Му ивруйин хътакру список:
help-added-on-input = Му ивруйиъ элаве гъапӀу:
help-removed-on-input = Му ивруйиан адагъу:

help-reset-overrides = { $reset } { $additional } ва { $removed } эвез апӀуру.
