# Kazakh editor and language-server surfaces. Translated from
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
# Kazakh counts in the same two categories English does, so every selection
# below keeps both branches — though a noun after a numeral stays singular, so
# the two read alike.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Қалпына келтіру
       *[update] Жаңарту
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] Қарау құралын { $word }
       *[other] Қарау құралын { $word } { $shortcut }
    }


## The variant picker

editor-variant = Нұсқа
editor-variant-filter = Сүзу…
editor-variant-next = Келесі нұсқаны таңдау
editor-variant-previous = Алдыңғы нұсқаны таңдау


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA қолжетімділік бұзушылығы анықталды. Қолжетімділік есебін { $action ->
            [close] жабу
           *[open] ашу
        } үшін басыңыз.
        [advisories] Қолжетімділік есебін { $action ->
            [close] жабу
           *[open] ашу
        } үшін басыңыз. WCAG AA бұзушылықтары табылмады, бірақ қосымша қолжетімділік ұсыныстары бар.
       *[clean] Қолжетімділік есебін { $action ->
            [close] жабу
           *[open] ашу
        } үшін басыңыз. Қолжетімділік мәселелері табылмады.
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA қолжетімділік бұзушылығы анықталды. { $count ->
            [one] { $count } WCAG AA бұзушылығы
           *[other] { $count } WCAG AA бұзушылығы
        } табылды. Қолжетімділік есебін { $action ->
            [close] жабу
           *[open] ашу
        } үшін басыңыз.
        [advisories] WCAG AA бұзушылықтары анықталмады. { $count ->
            [one] { $count } қосымша қолжетімділік ұсынысы
           *[other] { $count } қосымша қолжетімділік ұсынысы
        } табылды. Қолжетімділік есебін { $action ->
            [close] жабу
           *[open] ашу
        } үшін басыңыз.
       *[clean] WCAG AA бұзушылықтары анықталмады. Қолжетімділік есебін { $action ->
            [close] жабу
           *[open] ашу
        } үшін басыңыз.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML нұсқасы { $version }

editor-tab-help = Контекстік анықтама
editor-tab-help-short = Контекст
editor-tab-errors = Қателер
editor-tab-warnings = Ескертулер
editor-tab-info = Ақпарат
editor-tab-accessibility = Қолжетімділік
editor-tab-responses = Жіберілген жауаптар

editor-tab-with-count = { $label }: { $count }

editor-options = Редактор баптаулары
editor-format-as-doenetml = DoenetML ретінде пішімдеу
editor-format-as-xml = XML ретінде пішімдеу


## The diagnostics panel

editor-diagnostic-line = { $line }-жол

editor-no-errors = Қателер жоқ
editor-no-warnings = Ескертулер жоқ
editor-no-info = Ақпараттық хабарламалар жоқ

editor-show-info-annotations = Ақпараттық хабарламаларды редакторда көрсету
editor-show-accessibility-annotations = Қолжетімділік хабарламаларын редакторда көрсету

editor-accessibility-learn-more = Doenet қолжетімділікке қалай қарайды

editor-accessibility-violations-heading = Қолжетімділік бұзушылықтары ({ $standard })

editor-accessibility-other-heading = Басқа қолжетімділік мәселелері
editor-none-found = Ештеңе табылмады


## Submitted responses

editor-no-responses = Әзірге жіберілген жауаптар жоқ
editor-response-answer-id = Жауаптың Id-і
editor-response-response = Жауап
editor-response-credit = Ұпай
editor-response-submitted = Жіберілді


## The context-help panel

help-placeholder = Құжаттаманы көру үшін меңзерді тег атауына, атрибутқа немесе { $ref } үстіне қойыңыз.

help-unsupported-ref-chain = { $example } сияқты көп бөлікті сілтемелерге арналған анықтама әзірге қолдау таппайды.

help-unresolved-ref =
    { $reason ->
        [notFound] Сілтемеге нысан табылмады: { $ref }.
        [multiple] Сілтемеге бірнеше нысан табылды: { $ref }.
       *[indeterminate] { $ref } үшін нысанды анықтау мүмкін болмады.
    }

help-learn-about-references = Сілтемелер туралы білу →
help-reference-page = Анықтамалық бет →

help-suggestions-header =
    { $location ->
        [inside] { $element } ішінде
       *[top] Жоғарғы деңгейде
    }{ $allowed ->
        [none] { " — мұнда ештеңе орналаспайды." }
        [text] { " — мұнда мәтін жазуға болады." }
        [text-and-components] { " — мұнда мәтін жазуға болады немесе мынаны байқаңыз:" }
       *[components] { " — мынаны байқауға болады:" }
    }

help-suggestions-footer = Барлық { $total } құрамдасты көру үшін { $shortcut } басыңыз.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } — { $target } нысанына сілтеме.
       *[other] { $ref } — { $target } нысанына сілтеме ({ $line }-жол).
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } оны { $role } ретінде енгізген.
       *[other] { $owner } оны { $line }-жолда { $role } ретінде енгізген.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } — { $element } элементінің { $property } қасиетіне сілтеме.
       *[other] { $ref } — { $element } элементінің { $property } қасиетіне сілтеме ({ $line }-жол).
    }

help-kind-attribute = атрибут
help-kind-snippet = үзінді
help-kind-array-entry = массив элементі

help-default = Әдепкі мән:
help-active-default = Қолданыстағы әдепкі мән:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Рұқсат етілген мәндер (әр элементке бір):
       *[other] Рұқсат етілген мәндер:
    }

help-suggested-values = Ұсынылатын мәндер:

help-inserts = Қосады:

help-coordinates =
    { $count ->
        [one] Координата:
       *[other] Координаталар:
    }

help-type = Түрі:

help-resolved-style = Алынған стиль (styleNumber { $styleNumber }):

help-resolved-function-names = Алынған функция атаулары:
help-reset-list = Осы өрістің қалпына келтіру тізімі:
help-added-on-input = Осы өріске қосылғандар:
help-removed-on-input = Осы өрістен алынғандар:

help-reset-overrides = { $reset } — { $additional }, { $removed } атрибуттарынан басым.
