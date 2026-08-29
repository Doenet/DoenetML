# Livvi-Karelian editor and language-server surfaces. Translated from
# `locales/en/editor.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in the **Latin** alphabet, the official orthography of Livvi in the
# Republic of Karelia. Livvi is a language of the Russian Federation that is
# not written in Cyrillic.
#
# This catalog is the **Livvi (Olonets Karelian)** norm — the one the Karelian
# Republic publishes in. `locales/krl` is Karelian Proper (Viena / Northern), a
# separate ISO 639-3 language with no macrolanguage over the pair; a reader of
# either norm can largely read the other, which is precisely why the two files
# are written separately rather than copied.
#
# `WCAG AA`, `DoenetML`, `XML`, `styleNumber` and every attribute or element
# name are identifiers, not prose, and stay as written.
#
# The technical nouns are the Russian-mediated ones that written Livvi uses —
# «komponentu», «atribuuttu», «funktsii», «indeksu», «klavijatuuru»,
# «dokumentu». `locales/krl` takes the Finnic shapes instead, and that
# difference is a real one between the two norms rather than a slip.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Pane järilleh
       *[update] Uvvista
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } kaččelii
       *[other] { $word } kaččelii { $shortcut }
    }


## The variant picker

editor-variant = Variantu
editor-variant-filter = Suodata…
editor-variant-next = Vallli seuruai variantu
editor-variant-previous = Vallli ielline variantu


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA -suavutettavuon rikkomus on löytty. Paina, gu { $action ->
            [close] salvat
           *[open] avuat
        } suavutettavuon raportan.
        [advisories] Paina, gu { $action ->
            [close] salvat
           *[open] avuat
        } suavutettavuon raportan. WCAG AA -rikkomuksii ei löytty, ga suavutettavuos on liziänevvoloi.
       *[clean] Paina, gu { $action ->
            [close] salvat
           *[open] avuat
        } suavutettavuon raportan. Suavutettavuon probliemoi ei löytty.
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA -suavutettavuon rikkomus on löytty. Löydyi { $count ->
            [one] { $count } WCAG AA -rikkomus
           *[other] { $count } WCAG AA -rikkomustu
        }. Paina, gu { $action ->
            [close] salvat
           *[open] avuat
        } suavutettavuon raportan.
        [advisories] WCAG AA -rikkomuksii ei löytty. Löydyi { $count ->
            [one] { $count } suavutettavuon liziänevvo
           *[other] { $count } suavutettavuon liziänevvuo
        }. Paina, gu { $action ->
            [close] salvat
           *[open] avuat
        } suavutettavuon raportan.
       *[clean] WCAG AA -rikkomuksii ei löytty. Paina, gu { $action ->
            [close] salvat
           *[open] avuat
        } suavutettavuon raportan.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML-versii { $version }

editor-tab-help = Kontekstan mugaine abu
editor-tab-help-short = Kontekstu
editor-tab-errors = Viet
editor-tab-warnings = Varaitukset
editor-tab-info = Tiedo
editor-tab-accessibility = Suavutettavus
editor-tab-responses = Työtyt vastavukset

editor-tab-with-count = { $label }: { $count }

editor-options = Redaktoran azetukset
editor-format-as-doenetml = Muotoile DoenetML:nnu
editor-format-as-xml = Muotoile XML:nnu


## The diagnostics panel

editor-diagnostic-line = Riädy { $line }

editor-no-errors = Ei ole vigoi
editor-no-warnings = Ei ole varaituksii
editor-no-info = Ei ole tiedodiagnostiekkua

editor-show-info-annotations = Ozuta tiedodiagnostiekku redaktoras
editor-show-accessibility-annotations = Ozuta suavutettavuon diagnostiekku redaktoras

editor-accessibility-learn-more = Nengoi Doenet kaččou suavutettavuttu

editor-accessibility-violations-heading = Suavutettavuon rikkomukset ({ $standard })

editor-accessibility-other-heading = Toizet suavutettavuon probliemat
editor-none-found = Nimidä ei löytty


## Submitted responses

editor-no-responses = Vie ei ole työttylöi vastavuksii
editor-response-answer-id = Vastavuksen tunnus
editor-response-response = Vastavus
editor-response-credit = Pistehet
editor-response-submitted = Työtty


## The context-help panel

help-placeholder = Vie kursoru tunnuksen nimen, atribuutan libo kohtehen { $ref } piäle, gu näet dokumentatsien.

help-unsupported-ref-chain = Moniozazien viittavuksien, moizien kui { $example }, abuu vie ei tuveta.

help-unresolved-ref =
    { $reason ->
        [notFound] Viittavuksele ei löytty kohtehtu: { $ref }.
        [multiple] Viittavuksele löydyi monii kohtehtu: { $ref }.
       *[indeterminate] Viittavuksen { $ref } kohtehtu ei suadu miärittiä.
    }

help-learn-about-references = Lue viittavuksis →
help-reference-page = Abusivu →

help-suggestions-header =
    { $location ->
        [inside] Kohtehen { $element } sydämes
       *[top] Ylimäzel tazol
    }{ $allowed ->
        [none] { " — tähä ei tule nimidä." }
        [text] { " — tähä kirjutetah tekstua." }
        [text-and-components] { " — tähä kirjutetah tekstua, libo opi:" }
       *[components] { " — midä voit opita:" }
    }

help-suggestions-footer = Paina { $shortcut }, gu näet kai { $total } komponentua.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } on viittavus kohtehele { $target }.
       *[other] { $ref } on viittavus kohtehele { $target } (riädy { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Ezitelty kohtehes { $owner } rolis { $role }.
       *[other] Ezitelty kohtehes { $owner } riävyl { $line } rolis { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } on viittavus kohtehen { $element } ominazuolluo { $property }.
       *[other] { $ref } on viittavus kohtehen { $element } ominazuolluo { $property } (riädy { $line }).
    }

help-kind-attribute = atribuuttu
help-kind-snippet = katkelmu
help-kind-array-entry = tabličan elementu

help-default = Oletus:
help-active-default = Voimas olii oletus:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Luvallizet arvot (yksi jogahizele elementale):
       *[other] Luvallizet arvot:
    }

help-suggested-values = Ehoitetut arvot:

help-inserts = Panou:

help-coordinates =
    { $count ->
        [one] Koordinuattu:
       *[other] Koordinuatat:
    }

help-type = Tyyppi:

help-resolved-style = Selvitetty stiili (styleNumber { $styleNumber }):

help-resolved-function-names = Selvitetyt funktsieloin nimet:
help-reset-list = Listan järilleh panendu täs syötös:
help-added-on-input = Lizätty täs syötös:
help-removed-on-input = Otettu iäres täs syötös:

help-reset-overrides = { $reset } kumuau azetukset { $additional } da { $removed }.
