# Breton editor and language-server surfaces. Translated from
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
# Breton counts in five plural categories, so the counted messages below are
# written out in all five; the noun after a numeral stays singular and it is
# the mutation on it that moves.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Adderaouekaat
       *[update] Hizivaat
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } ar gweler
       *[other] { $word } ar gweler { $shortcut }
    }


## The variant picker

editor-variant = Doare
editor-variant-filter = Silañ…
editor-variant-next = Diuzañ an doare war-lerc'h
editor-variant-previous = Diuzañ an doare a-raok


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Un torr-reizh haezadusted WCAG AA a zo bet kavet. Klikit evit { $action ->
            [close] serriñ
           *[open] digeriñ
        } an danevell haezadusted.
        [advisories] Klikit evit { $action ->
            [close] serriñ
           *[open] digeriñ
        } an danevell haezadusted. Torr-reizh WCAG AA ebet n'eus bet kavet, met kuzulioù haezadusted ouzhpenn a zo hegerz.
       *[clean] Klikit evit { $action ->
            [close] serriñ
           *[open] digeriñ
        } an danevell haezadusted. Kudenn haezadusted ebet n'eus bet kavet.
    }

editor-accessibility-label =
    { $status ->
        [violations] Un torr-reizh haezadusted WCAG AA a zo bet kavet. Kavet ez eus bet { $count ->
            [one] { $count } torr-reizh WCAG AA
            [two] { $count } dorr-reizh WCAG AA
            [few] { $count } zorr-reizh WCAG AA
            [many] { $count } a dorr-reizhoù WCAG AA
           *[other] { $count } torr-reizh WCAG AA
        }. Klikit evit { $action ->
            [close] serriñ
           *[open] digeriñ
        } an danevell haezadusted.
        [advisories] Torr-reizh WCAG AA ebet n'eus bet kavet. Kavet ez eus bet { $count ->
            [one] { $count } kuzul haezadusted ouzhpenn
            [two] { $count } guzul haezadusted ouzhpenn
            [few] { $count } c'huzul haezadusted ouzhpenn
            [many] { $count } a guzulioù haezadusted ouzhpenn
           *[other] { $count } kuzul haezadusted ouzhpenn
        }. Klikit evit { $action ->
            [close] serriñ
           *[open] digeriñ
        } an danevell haezadusted.
       *[clean] Torr-reizh WCAG AA ebet n'eus bet kavet. Klikit evit { $action ->
            [close] serriñ
           *[open] digeriñ
        } an danevell haezadusted.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Stumm DoenetML { $version }

editor-tab-help = Skoazell hervez ar c'hendestenn
editor-tab-help-short = Kendestenn
editor-tab-errors = Fazioù
editor-tab-warnings = Kemennoù diwall
editor-tab-info = Titouroù
editor-tab-accessibility = Haezadusted
editor-tab-responses = Respontoù kaset

editor-tab-with-count = { $label }: { $count }

editor-options = Dibarzhioù an aozer
editor-format-as-doenetml = Furmadiñ evel DoenetML
editor-format-as-xml = Furmadiñ evel XML


## The diagnostics panel

editor-diagnostic-line = Linenn #{ $line }

editor-no-errors = Fazi ebet
editor-no-warnings = Kemenn diwall ebet
editor-no-info = Titour ebet

editor-show-info-annotations = Diskouez an titouroù en aozer
editor-show-accessibility-annotations = Diskouez ar c'hemennoù haezadusted en aozer

editor-accessibility-learn-more = Deskit penaos e vez sellet ouzh an haezadusted gant Doenet

editor-accessibility-violations-heading = Torroù-reizh haezadusted ({ $standard })

editor-accessibility-other-heading = Kudennoù haezadusted all
editor-none-found = Hini ebet kavet


## Submitted responses

editor-no-responses = Respont ebet kaset c'hoazh
editor-response-answer-id = Naoudi ar respont
editor-response-response = Respont
editor-response-credit = Poentoù
editor-response-submitted = Kaset


## The context-help panel

help-placeholder = Lakait ar reti war anv ur valizenn, war un doareenn pe war { $ref } evit an teuliadur.

help-unsupported-ref-chain = N'eus ket skoazell c'hoazh evit an daveoù lies-lodenn evel { $example }.

help-unresolved-ref =
    { $reason ->
        [notFound] N'eus bet kavet daveenn ebet evit an dave: { $ref }.
        [multiple] Meur a zaveenn a zo bet kavet evit an dave: { $ref }.
       *[indeterminate] N'eus ket bet gallet termeniñ un daveenn evit { $ref }.
    }

help-learn-about-references = Deskit diwar-benn an daveoù →
help-reference-page = Pajenn zaveiñ →

help-suggestions-header =
    { $location ->
        [inside] E-barzh { $element }
       *[top] War al live uhelañ
    }{ $allowed ->
        [none] { " — netra ne da amañ." }
        [text] { " — skrivit testenn amañ." }
        [text-and-components] { " — skrivit testenn amañ, pe klaskit:" }
       *[components] { " — traoù da glask:" }
    }

help-suggestions-footer = Pouezit war { $shortcut } evit gwelet an holl { $total } parzh.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] Un dave da { $target } eo { $ref }.
       *[other] Un dave da { $target } eo { $ref } (linenn { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Degaset gant { $owner } evel { $role }.
       *[other] Degaset gant { $owner } war al linenn { $line } evel { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] Un dave d'ar berzh { $property } eus { $element } eo { $ref }.
       *[other] Un dave d'ar berzh { $property } eus { $element } eo { $ref } (linenn { $line }).
    }

help-kind-attribute = doareenn
help-kind-snippet = tamm kod
help-kind-array-entry = enankad steudad

help-default = Dre ziouer:
help-active-default = Dre ziouer oberiant:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Talvoudoù aotreet (unan dre elfenn):
       *[other] Talvoudoù aotreet:
    }

help-suggested-values = Talvoudoù kinniget:

help-inserts = Ensoc'hañ a ra:

help-coordinates =
    { $count ->
        [one] Daveenn:
       *[other] Daveennoù:
    }

help-type = Seurt:

help-resolved-style = Stil diskoulmet (styleNumber { $styleNumber }):

help-resolved-function-names = Anvioù arc'hwel diskoulmet:
help-reset-list = Adderaouekaat ar roll war an enankad-mañ:
help-added-on-input = Ouzhpennet war an enankad-mañ:
help-removed-on-input = Lamet war an enankad-mañ:

help-reset-overrides = { $reset } a zo trec'h war { $additional } ha { $removed }.
