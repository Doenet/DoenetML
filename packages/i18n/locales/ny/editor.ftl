# Chichewa editor and language-server surfaces. Translated from
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


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Bwezerani
       *[update] Sinthani
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } Chiwonetsero
       *[other] { $word } Chiwonetsero { $shortcut }
    }


## The variant picker

editor-variant = Mtundu
editor-variant-filter = Sefani...
editor-variant-next = Sankhani mtundu wotsatira
editor-variant-previous = Sankhani mtundu wapitawo


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Kwapezeka kuphwanya kupezeka kwa WCAG AA. Dinani kuti { $action ->
            [close] mutseke
           *[open] mutsegule
        } lipoti la kupezeka.
        [advisories] Dinani kuti { $action ->
            [close] mutseke
           *[open] mutsegule
        } lipoti la kupezeka. Palibe kuphwanya kwa WCAG AA komwe kwapezeka, koma pali malangizo ena a kupezeka.
       *[clean] Dinani kuti { $action ->
            [close] mutseke
           *[open] mutsegule
        } lipoti la kupezeka. Palibe mavuto a kupezeka omwe apezeka.
    }

editor-accessibility-label =
    { $status ->
        [violations] Kwapezeka kuphwanya kupezeka kwa WCAG AA. { $count ->
            [one] Kwapezeka kuphwanya kwa WCAG AA { $count }
           *[other] Kwapezeka kuphwanya kwa WCAG AA { $count }
        }. Dinani kuti { $action ->
            [close] mutseke
           *[open] mutsegule
        } lipoti la kupezeka.
        [advisories] Palibe kuphwanya kwa WCAG AA komwe kwapezeka. { $count ->
            [one] Kwapezeka langizo { $count } lowonjezera la kupezeka
           *[other] Kwapezeka malangizo { $count } owonjezera a kupezeka
        }. Dinani kuti { $action ->
            [close] mutseke
           *[open] mutsegule
        } lipoti la kupezeka.
       *[clean] Palibe kuphwanya kwa WCAG AA komwe kwapezeka. Dinani kuti { $action ->
            [close] mutseke
           *[open] mutsegule
        } lipoti la kupezeka.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Mtundu wa DoenetML { $version }

editor-tab-help = Chithandizo chogwirizana ndi malo
editor-tab-help-short = Malo
editor-tab-errors = Zolakwika
editor-tab-warnings = Machenjezo
editor-tab-info = Chidziwitso
editor-tab-accessibility = Kupezeka
editor-tab-responses = Mayankho otumizidwa

editor-tab-with-count = { $label }: { $count }

editor-options = Zosankha za mkonzi
editor-format-as-doenetml = Konzani ngati DoenetML
editor-format-as-xml = Konzani ngati XML


## The diagnostics panel

editor-diagnostic-line = Mzere #{ $line }

editor-no-errors = Palibe Zolakwika
editor-no-warnings = Palibe Machenjezo
editor-no-info = Palibe Zoyezetsa za Chidziwitso

editor-show-info-annotations = Onetsani zoyezetsa za chidziwitso mu mkonzi
editor-show-accessibility-annotations = Onetsani zoyezetsa za kupezeka mu mkonzi

editor-accessibility-learn-more = Phunzirani momwe Doenet imaonera kupezeka

editor-accessibility-violations-heading = Kuphwanya kupezeka ({ $standard })

editor-accessibility-other-heading = Mavuto ena a kupezeka
editor-none-found = Palibe chomwe chapezeka


## Submitted responses

editor-no-responses = Palibe mayankho otumizidwa panobe
editor-response-answer-id = Chizindikiro cha Yankho
editor-response-response = Yankho
editor-response-credit = Mfundo
editor-response-submitted = Latumizidwa


## The context-help panel

help-placeholder = Ikani cholozera pa dzina la tagi, pa mbali kapena pa { $ref } kuti mupeze zolemba.

help-unsupported-ref-chain = Chithandizo cha zolozera za magawo ambiri ngati { $example } sichinathandizidwebe.

help-unresolved-ref =
    { $reason ->
        [notFound] Palibe cholozedwa chomwe chapezeka pa cholozera: { $ref }.
        [multiple] Zapezeka zolozedwa zambiri pa cholozera: { $ref }.
       *[indeterminate] Cholozedwa cha { $ref } sichinathe kudziwika.
    }

help-learn-about-references = Phunzirani za zolozera →
help-reference-page = Tsamba la zolozera →

help-suggestions-header =
    { $location ->
        [inside] Mkati mwa { $element }
       *[top] Pamlingo wapamwamba
    }{ $allowed ->
        [none] { " — palibe chomwe chimapita pano." }
        [text] { " — lembani mawu pano." }
        [text-and-components] { " — lembani mawu pano, kapena yesani:" }
       *[components] { " — zinthu zoyesa:" }
    }

help-suggestions-footer = Dinani { $shortcut } kuti muwone zigawo zonse { $total }.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } ndi cholozera cha { $target }.
       *[other] { $ref } ndi cholozera cha { $target } (mzere { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Chinayambitsidwa ndi { $owner } ngati { $role }.
       *[other] Chinayambitsidwa ndi { $owner } pa mzere { $line } ngati { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } ndi cholozera cha mbali { $property } ya { $element }.
       *[other] { $ref } ndi cholozera cha mbali { $property } ya { $element } (mzere { $line }).
    }

help-kind-attribute = mbali
help-kind-snippet = chigawo
help-kind-array-entry = cholowa mu mndandanda

help-default = Chikhazikitso:
help-active-default = Chikhazikitso chogwira ntchito:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Mtengo wololedwa (umodzi pa chinthu chilichonse):
       *[other] Mtengo wololedwa:
    }

help-suggested-values = Mtengo wolimbikitsidwa:

help-inserts = Imalowetsa:

help-coordinates =
    { $count ->
        [one] Malo:
       *[other] Malo:
    }

help-type = Mtundu:

help-resolved-style = Kalembedwe kodziwika (styleNumber { $styleNumber }):

help-resolved-function-names = Maina a ntchito odziwika:
help-reset-list = Mndandanda wobwezeretsedwa pa cholowetsa ichi:
help-added-on-input = Zowonjezedwa pa cholowetsa ichi:
help-removed-on-input = Zochotsedwa pa cholowetsa ichi:

help-reset-overrides = { $reset } imaposa { $additional } ndi { $removed }.
