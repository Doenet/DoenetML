# Tatar editor and language-server surfaces. Translated from
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
# Tatar counts in the same two categories English does, so every selection below
# keeps both branches — though a noun after a numeral stays singular, so the two
# read alike.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Кайтару
       *[update] Яңарту
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] Карагычны { $word }
       *[other] Карагычны { $word } { $shortcut }
    }


## The variant picker

editor-variant = Вариант
editor-variant-filter = Сөзү…
editor-variant-next = Киләсе вариантны сайлау
editor-variant-previous = Алдагы вариантны сайлау


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA үтемлелек бозуы табылды. Үтемлелек хисабын { $action ->
            [close] ябу
           *[open] ачу
        } өчен басыгыз.
        [advisories] Үтемлелек хисабын { $action ->
            [close] ябу
           *[open] ачу
        } өчен басыгыз. WCAG AA бозулары табылмады, ләкин өстәмә үтемлелек тәкъдимнәре бар.
       *[clean] Үтемлелек хисабын { $action ->
            [close] ябу
           *[open] ачу
        } өчен басыгыз. Үтемлелек проблемалары табылмады.
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA үтемлелек бозуы табылды. { $count ->
            [one] { $count } WCAG AA бозуы
           *[other] { $count } WCAG AA бозуы
        } табылды. Үтемлелек хисабын { $action ->
            [close] ябу
           *[open] ачу
        } өчен басыгыз.
        [advisories] WCAG AA бозулары табылмады. { $count ->
            [one] { $count } өстәмә үтемлелек тәкъдиме
           *[other] { $count } өстәмә үтемлелек тәкъдиме
        } табылды. Үтемлелек хисабын { $action ->
            [close] ябу
           *[open] ачу
        } өчен басыгыз.
       *[clean] WCAG AA бозулары табылмады. Үтемлелек хисабын { $action ->
            [close] ябу
           *[open] ачу
        } өчен басыгыз.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML версиясе { $version }

editor-tab-help = Контекст ярдәме
editor-tab-help-short = Контекст
editor-tab-errors = Хаталар
editor-tab-warnings = Кисәтүләр
editor-tab-info = Мәгълүмат
editor-tab-accessibility = Үтемлелек
editor-tab-responses = Җибәрелгән җаваплар

editor-tab-with-count = { $label }: { $count }

editor-options = Редактор көйләүләре
editor-format-as-doenetml = DoenetML буларак форматлау
editor-format-as-xml = XML буларак форматлау


## The diagnostics panel

editor-diagnostic-line = Юл №{ $line }

editor-no-errors = Хаталар юк
editor-no-warnings = Кисәтүләр юк
editor-no-info = Мәгълүмати хәбәрләр юк

editor-show-info-annotations = Мәгълүмати хәбәрләрне редакторда күрсәтү
editor-show-accessibility-annotations = Үтемлелек хәбәрләрен редакторда күрсәтү

editor-accessibility-learn-more = Doenet үтемлелеккә ничек карый

editor-accessibility-violations-heading = Үтемлелек бозулары ({ $standard })

editor-accessibility-other-heading = Башка үтемлелек проблемалары
editor-none-found = Бернәрсә дә табылмады


## Submitted responses

editor-no-responses = Әлегә җибәрелгән җаваплар юк
editor-response-answer-id = Җавапның Id-сы
editor-response-response = Җавап
editor-response-credit = Балл
editor-response-submitted = Җибәрелде


## The context-help panel

help-placeholder = Документацияне күрер өчен курсорны тег исеменә, атрибутка яки { $ref } өстенә куегыз.

help-unsupported-ref-chain = { $example } кебек күпөлешле сылтамалар өчен ярдәм әлегә каралмаган.

help-unresolved-ref =
    { $reason ->
        [notFound] Сылтама өчен объект табылмады: { $ref }.
        [multiple] Сылтама өчен берничә объект табылды: { $ref }.
       *[indeterminate] { $ref } өчен объектны билгеләп булмады.
    }

help-learn-about-references = Сылтамалар турында белү →
help-reference-page = Белешмә бите →

help-suggestions-header =
    { $location ->
        [inside] { $element } эчендә
       *[top] Югары дәрәҗәдә
    }{ $allowed ->
        [none] { " — монда бернәрсә дә сыймый." }
        [text] { " — монда текст язып була." }
        [text-and-components] { " — монда текст язып була, яки боларны сынап карагыз:" }
       *[components] { " — боларны сынап карап була:" }
    }

help-suggestions-footer = Барлык { $total } компонентны күрер өчен { $shortcut } басыгыз.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } — { $target } объектына сылтама.
       *[other] { $ref } — { $target } объектына сылтама (юл { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Аны { $owner } { $role } буларак керткән.
       *[other] Аны { $owner } { $line } юлында { $role } буларак керткән.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } — { $element } элементының { $property } үзлегенә сылтама.
       *[other] { $ref } — { $element } элементының { $property } үзлегенә сылтама (юл { $line }).
    }

help-kind-attribute = атрибут
help-kind-snippet = өзек
help-kind-array-entry = массив элементы

help-default = Килешү буенча кыйммәт:
help-active-default = Гамәлдәге килешү буенча кыйммәт:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Рөхсәт ителгән кыйммәтләр (һәр элементка берәү):
       *[other] Рөхсәт ителгән кыйммәтләр:
    }

help-suggested-values = Тәкъдим ителгән кыйммәтләр:

help-inserts = Өсти:

help-coordinates =
    { $count ->
        [one] Координата:
       *[other] Координаталар:
    }

help-type = Төр:

help-resolved-style = Алынган стиль (styleNumber { $styleNumber }):

help-resolved-function-names = Алынган функция исемнәре:
help-reset-list = Бу кырның кайтару исемлеге:
help-added-on-input = Бу кырда өстәлгәннәр:
help-removed-on-input = Бу кырдан бетерелгәннәр:

help-reset-overrides = { $reset } — { $additional } һәм { $removed } өстеннән өстенлекле.
