# Shona editor and language-server surfaces. Translated from
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
# Whether a counted noun changes shape depends on its class, as `chrome.ftl`'s
# header sets out, and here none of them does, so all three selects are
# dropped. `help-coordinates` counts «makoodhineti», a loan cited in one shape
# for both numbers. `editor-accessibility-label` counts «kutyorwa», the class
# 15 verbal noun for a violation, which has no plural at all, and «mazano»,
# which is already the class 6 plural and is what the message says at any
# count.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Dzosera
       *[update] Vandudza
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } Muratidzi
       *[other] { $word } Muratidzi { $shortcut }
    }


## The variant picker

editor-variant = Mhando
editor-variant-filter = Sefa...
editor-variant-next = Sarudza mhando inotevera
editor-variant-previous = Sarudza mhando yapfuura


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Kutyorwa kweWCAG AA kwekuwanikwa kwaonekwa. Dzvanya kuti { $action ->
            [close] uvhare
           *[open] uvhure
        } mushumo wekuwanikwa.
        [advisories] Dzvanya kuti { $action ->
            [close] uvhare
           *[open] uvhure
        } mushumo wekuwanikwa. Hapana kutyorwa kweWCAG AA kwakawanikwa, asi pane mamwe mazano ekuwanikwa.
       *[clean] Dzvanya kuti { $action ->
            [close] uvhare
           *[open] uvhure
        } mushumo wekuwanikwa. Hapana dambudziko rekuwanikwa rakawanikwa.
    }

editor-accessibility-label =
    { $status ->
        [violations] Kutyorwa kweWCAG AA kwekuwanikwa kwaonekwa. Kutyorwa kweWCAG AA { $count } kwakawanikwa. Dzvanya kuti { $action ->
            [close] uvhare
           *[open] uvhure
        } mushumo wekuwanikwa.
        [advisories] Hapana kutyorwa kweWCAG AA kwakaonekwa. Mamwe mazano ekuwanikwa { $count } akawanikwa. Dzvanya kuti { $action ->
            [close] uvhare
           *[open] uvhure
        } mushumo wekuwanikwa.
       *[clean] Hapana kutyorwa kweWCAG AA kwakaonekwa. Dzvanya kuti { $action ->
            [close] uvhare
           *[open] uvhure
        } mushumo wekuwanikwa.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML vhezheni { $version }

editor-tab-help = Rubatsiro runoenderana nenzvimbo
editor-tab-help-short = Nzvimbo
editor-tab-errors = Zvikanganiso
editor-tab-warnings = Yambiro
editor-tab-info = Ruzivo
editor-tab-accessibility = Kuwanikwa
editor-tab-responses = Mhinduro dzakatumirwa

editor-tab-with-count = { $label }: { $count }

editor-options = Sarudzo dzemunyori
editor-format-as-doenetml = Gadzira seDoenetML
editor-format-as-xml = Gadzira seXML


## The diagnostics panel

editor-diagnostic-line = Mutsara #{ $line }

editor-no-errors = Hapana Zvikanganiso
editor-no-warnings = Hapana Yambiro
editor-no-info = Hapana Ongororo yeRuzivo

editor-show-info-annotations = Ratidza ongororo dzeruzivo mumunyori
editor-show-accessibility-annotations = Ratidza ongororo dzekuwanikwa mumunyori

editor-accessibility-learn-more = Dzidza kuti Doenet inobata sei kuwanikwa

editor-accessibility-violations-heading = Kutyorwa kwekuwanikwa ({ $standard })

editor-accessibility-other-heading = Mamwe matambudziko ekuwanikwa
editor-none-found = Hapana chakawanikwa


## Submitted responses

editor-no-responses = Hapana mhinduro yakatumirwa parizvino
editor-response-answer-id = Zita reMhinduro
editor-response-response = Mhinduro
editor-response-credit = Mamakisi
editor-response-submitted = Yakatumirwa


## The context-help panel

help-placeholder = Isa chiratidzo pamusoro pezita retagi, chimiro kana { $ref } kuti uwane magwaro.

help-unsupported-ref-chain = Rubatsiro rwezvinongedzo zvine zvikamu zvakawanda se{ $example } haruna kutsigirwa.

help-unresolved-ref =
    { $reason ->
        [notFound] Hapana chakawanikwa pachinongedzo: { $ref }.
        [multiple] Zvinhu zvakawanda zvakawanikwa pachinongedzo: { $ref }.
       *[indeterminate] Zvinonongedzwa ne{ $ref } hazvina kuzivikanwa.
    }

help-learn-about-references = Dzidza nezvezvinongedzo →
help-reference-page = Peji rezvinongedzo →

help-suggestions-header =
    { $location ->
        [inside] Mukati me{ $element }
       *[top] Pamusoro-soro
    }{ $allowed ->
        [none] { " — hapana chinopinda pano." }
        [text] { " — nyora zvinyorwa pano." }
        [text-and-components] { " — nyora zvinyorwa pano, kana edza:" }
       *[components] { " — zvinhu zvekuedza:" }
    }

help-suggestions-footer = Dzvanya { $shortcut } kuti uone zvinhu { $total } zvese.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } chinongedzo che{ $target }.
       *[other] { $ref } chinongedzo che{ $target } (mutsara { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } akachitumidza kuti { $role }.
       *[other] { $owner } akachitumidza pamutsara { $line } kuti { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } chinongedzo chechimiro { $property } che{ $element }.
       *[other] { $ref } chinongedzo chechimiro { $property } che{ $element } (mutsara { $line }).
    }

help-kind-attribute = chimiro
help-kind-snippet = chidimbu chezvinyorwa
help-kind-array-entry = chipinzwa chetafura

help-default = Chiripo kare:
help-active-default = Chiripo kare chiri kushanda:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Kukosha kunobvumirwa (kumwe pachinhu chimwe nechimwe):
       *[other] Kukosha kunobvumirwa:
    }

help-suggested-values = Kukosha kunokurudzirwa:

help-inserts = Inoisa:

help-coordinates = Makoodhineti:

help-type = Rudzi:

help-resolved-style = Chimiro chakazivikanwa (styleNumber { $styleNumber }):

help-resolved-function-names = Mazita emabasa akazivikanwa:
help-reset-list = Runyorwa runodzoserwa pachipinzwa ichi:
help-added-on-input = Zvakawedzerwa pachipinzwa ichi:
help-removed-on-input = Zvakabviswa pachipinzwa ichi:

help-reset-overrides = { $reset } inopfuura { $additional } ne{ $removed }.
