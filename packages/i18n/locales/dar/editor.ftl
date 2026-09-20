# Dargwa editor and language-server surfaces. Translated from
# `locales/en/editor.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# The Akusha-based literary standard, in Cyrillic; `content.ftl`'s header says
# what that choice means for a reader of another Dargwa variety. The palochka Ӏ
# is a letter, not a Latin I and not a digit 1.
#
# `WCAG AA`, `DoenetML`, `XML`, `styleNumber` and every attribute or element
# name are identifiers, not prose, and stay as written.
#
# Dargwa counts in the same two categories English does, so every selection
# below keeps both branches — though a noun after a numeral stays singular, so
# the two read alike.
#
# Nothing here agrees with a noun class. Dargwa has one, and `content.ftl`
# explains why it reaches exactly one message in the whole catalog.
#
# `editor-diagnostic-line` prints the line number after a word rather than
# before it, because a Dargwa ordinal is built with «-ибил» on the numeral
# itself and the numeral here is a value this catalog never sees.
#
# «гьаргдеш» for *accessibility* is the same transparent coinage `chrome.ftl`
# uses, from «гьаргси» (open); it is not an attested term and a speaker should
# replace it if one exists.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Чарбара
       *[update] Сагабара
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] Чебиахъуси { $word }
       *[other] Чебиахъуси { $word } { $shortcut }
    }


## The variant picker

editor-variant = Вариант
editor-variant-filter = ЧердикӀни…
editor-variant-next = ГӀергъиси вариант чеббикӀа
editor-variant-previous = Гьалабси вариант чеббикӀа


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA гьаргдешла дохни баргибси саби. Гьаргдешла отчёт { $action ->
            [close] кӀапӀбарес
           *[open] абхьес
        } кабяхъа.
        [advisories] Гьаргдешла отчёт { $action ->
            [close] кӀапӀбарес
           *[open] абхьес
        } кабяхъа. WCAG AA дохнуби хӀедаргиб, амма цархӀилти гьаргдешла гьанбушнуби лер.
       *[clean] Гьаргдешла отчёт { $action ->
            [close] кӀапӀбарес
           *[open] абхьес
        } кабяхъа. Гьаргдешла суалти хӀедаргиб.
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA гьаргдешла дохни баргибси саби. { $count ->
            [one] { $count } WCAG AA дохни
           *[other] { $count } WCAG AA дохни
        } баргибси саби. Гьаргдешла отчёт { $action ->
            [close] кӀапӀбарес
           *[open] абхьес
        } кабяхъа.
        [advisories] WCAG AA дохнуби хӀедаргиб. { $count ->
            [one] { $count } гьаргдешла гьанбушни
           *[other] { $count } гьаргдешла гьанбушни
        } баргибси саби. Гьаргдешла отчёт { $action ->
            [close] кӀапӀбарес
           *[open] абхьес
        } кабяхъа.
       *[clean] WCAG AA дохнуби хӀедаргиб. Гьаргдешла отчёт { $action ->
            [close] кӀапӀбарес
           *[open] абхьес
        } кабяхъа.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML { $version } версия

editor-tab-help = Контекстличи хӀерси кумек
editor-tab-help-short = Контекст
editor-tab-errors = ХатӀаби
editor-tab-warnings = Балахънуби
editor-tab-info = Хабар
editor-tab-accessibility = Гьаргдеш
editor-tab-responses = Бархьибти жавабти

editor-tab-with-count = { $label }: { $count }

editor-options = Редакторла кабизуни
editor-format-as-doenetml = DoenetML сабливан форматбара
editor-format-as-xml = XML сабливан форматбара


## The diagnostics panel

editor-diagnostic-line = Жерге #{ $line }

editor-no-errors = ХатӀаби агара
editor-no-warnings = Балахънуби агара
editor-no-info = Хабарла хӀеруди агара

editor-show-info-annotations = Хабарла хӀеруди редакторлизиб чебаахъа
editor-show-accessibility-annotations = Гьаргдешла хӀеруди редакторлизиб чебаахъа

editor-accessibility-learn-more = Doenet гьаргдешличи сен хӀерхӀерулил бала

editor-accessibility-violations-heading = Гьаргдешла дохнуби ({ $standard })

editor-accessibility-other-heading = ЦархӀилти гьаргдешла суалти
editor-none-found = СекӀалра хӀебаргиб


## Submitted responses

editor-no-responses = Гьачамалра жаваб бархьили ахӀен
editor-response-answer-id = Жавабла Id
editor-response-response = Жаваб
editor-response-credit = Балл
editor-response-submitted = Бархьибси


## The context-help panel

help-placeholder = Документация чебаахъес курсор тегла уличи, атрибутличи яра { $ref } бикӀусиличи кабизахъа.

help-unsupported-ref-chain = { $example } гъуна дахъал бутӀала хӀерсилис кумек гьачамлис агара.

help-unresolved-ref =
    { $reason ->
        [notFound] ХӀерсилис мурад хӀебаргиб: { $ref }.
        [multiple] ХӀерсилис дахъал мурадуни даргиб: { $ref }.
       *[indeterminate] { $ref } бикӀусила мурад билгӀабарес хӀебиуб.
    }

help-learn-about-references = ХӀерсила хӀекьлизиб бала →
help-reference-page = Хасбарибси бяхӀ →

help-suggestions-header =
    { $location ->
        [inside] { $element } бухӀнаб
       *[top] Чедила даражаличиб
    }{ $allowed ->
        [none] { " — ишбахӀ секӀалра хӀебирар." }
        [text] { " — ишбахӀ текст белкӀес бирар." }
        [text-and-components] { " — ишбахӀ текст белкӀес бирар, яра ишди зягӀипдара:" }
       *[components] { " — ишди зягӀипдара:" }
    }

help-suggestions-footer = Лерилра { $total } компонент чебаахъес { $shortcut } кабяхъа.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } — { $target } бикӀусиличи хӀерси саби.
       *[other] { $ref } — { $target } бикӀусиличи хӀерси саби ({ $line } жерге).
    }

help-ref-derived-from =
    { $line ->
        [none] Ил { $owner } бикӀусили { $role } сабливан чебуцибси саби.
       *[other] Ил { $owner } бикӀусили { $line } жергелизиб { $role } сабливан чебуцибси саби.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } — { $element } элементла { $property } хасдешличи хӀерси саби.
       *[other] { $ref } — { $element } элементла { $property } хасдешличи хӀерси саби ({ $line } жерге).
    }

help-kind-attribute = атрибут
help-kind-snippet = бутӀа
help-kind-array-entry = массивла элемент

help-default = БехӀбихьудла кьимат:
help-active-default = ХӀянчилизибси бехӀбихьудла кьимат:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Бирути кьиматуни (гьар секӀайс цали):
       *[other] Бирути кьиматуни:
    }

help-suggested-values = Гьанбушибти кьиматуни:

help-inserts = Кабирхьу:

help-coordinates =
    { $count ->
        [one] Координата:
       *[other] Координатаби:
    }

help-type = Тип:

help-resolved-style = Баргибси стиль (styleNumber { $styleNumber }):

help-resolved-function-names = Даргибти функцияла умани:
help-reset-list = Иш чебухъанничибси чарбирнила список:
help-added-on-input = Иш чебухъанничи кабихьибти:
help-removed-on-input = Иш чебухъанничибад ардукибти:

help-reset-overrides = { $reset } бикӀусили { $additional } ва { $removed } чедидиру.
