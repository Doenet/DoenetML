# Karelian editor and language-server surfaces. Translated from
# `locales/en/editor.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in the **Latin** alphabet, the official orthography of Karelian in
# the Republic of Karelia. Karelian is a language of the Russian Federation
# that is not written in Cyrillic.
#
# This catalog is the **Karelian Proper (Viena / Northern)** literary norm.
# `locales/olo` is Livvi, a separate ISO 639-3 language with no macrolanguage
# over the pair; the two are close enough that a reader of one can largely read
# the other, which is exactly why neither file may be a copy of the other.
#
# `WCAG AA`, `DoenetML`, `XML`, `styleNumber` and every attribute or element
# name are identifiers, not prose, and stay as written.
#
# The technical nouns are taken in their Finnic shape — «komponentti»,
# «attribuutti», «funktijo», «indeksi» — which is what the Viena norm prefers.
# `locales/olo` and `locales/vep` take the Russian-mediated shapes instead, and
# that difference is a real one between the norms rather than a slip.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Palauta
       *[update] Uuvvista
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } katselija
       *[other] { $word } katselija { $shortcut }
    }


## The variant picker

editor-variant = Muunneh
editor-variant-filter = Suodata…
editor-variant-next = Vallitse seuruaja muunneh
editor-variant-previous = Vallitse eelline muunneh


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA -šuavutettavuurikkomus havaittu. Paina, ku { $action ->
            [close] salpuat
           *[open] avuat
        } šuavutettavuuraportin.
        [advisories] Paina, ku { $action ->
            [close] salpuat
           *[open] avuat
        } šuavutettavuuraportin. WCAG AA -rikkomukšie ei löytyn, ka šuavutettavuuvvešta on lisäšuosituksie.
       *[clean] Paina, ku { $action ->
            [close] salpuat
           *[open] avuat
        } šuavutettavuuraportin. Šuavutettavuuongelmie ei löytyn.
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA -šuavutettavuurikkomus havaittu. Löyty { $count ->
            [one] { $count } WCAG AA -rikkomus
           *[other] { $count } WCAG AA -rikkomusta
        }. Paina, ku { $action ->
            [close] salpuat
           *[open] avuat
        } šuavutettavuuraportin.
        [advisories] WCAG AA -rikkomukšie ei havaittu. Löyty { $count ->
            [one] { $count } šuavutettavuuvven lisäšuositus
           *[other] { $count } šuavutettavuuvven lisäšuositusta
        }. Paina, ku { $action ->
            [close] salpuat
           *[open] avuat
        } šuavutettavuuraportin.
       *[clean] WCAG AA -rikkomukšie ei havaittu. Paina, ku { $action ->
            [close] salpuat
           *[open] avuat
        } šuavutettavuuraportin.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML-versijo { $version }

editor-tab-help = Konteksinmukaine ohjeh
editor-tab-help-short = Konteksti
editor-tab-errors = Virhehet
editor-tab-warnings = Varotukšet
editor-tab-info = Tietuo
editor-tab-accessibility = Šuavutettavus
editor-tab-responses = Työnnetyt vastaukšet

editor-tab-with-count = { $label }: { $count }

editor-options = Toimittajan azetukšet
editor-format-as-doenetml = Muotoile DoenetML:nä
editor-format-as-xml = Muotoile XML:nä


## The diagnostics panel

editor-diagnostic-line = Rivi { $line }

editor-no-errors = Ei virhehie
editor-no-warnings = Ei varotukšie
editor-no-info = Ei tietodiagnostiikkua

editor-show-info-annotations = Näytä tietodiagnostiikka toimittajašša
editor-show-accessibility-annotations = Näytä šuavutettavuudiagnostiikka toimittajašša

editor-accessibility-learn-more = Näin Doenet lähestyy šuavutettavutta

editor-accessibility-violations-heading = Šuavutettavuurikkomukšet ({ $standard })

editor-accessibility-other-heading = Muut šuavutettavuuongelmat
editor-none-found = Ei löytyn mitänä


## Submitted responses

editor-no-responses = Ei vielä työnnettyjä vastaukšie
editor-response-answer-id = Vastaukšen tunnus
editor-response-response = Vastaus
editor-response-credit = Pisteet
editor-response-submitted = Työnnetty


## The context-help panel

help-placeholder = Vie kursori tunnuksen nimen, attribuutin tahi kohtehen { $ref } piällä, ku niät dokumentatijon.

help-unsupported-ref-chain = Monioza-viittaukšien, moisien kuin { $example }, ohjehta ei vielä tuveta.

help-unresolved-ref =
    { $reason ->
        [notFound] Viittaukšella ei löytyn kohtehta: { $ref }.
        [multiple] Viittaukšella löyty monta kohtehta: { $ref }.
       *[indeterminate] Viittaukšen { $ref } kohtehta ei šuatu miärittyä.
    }

help-learn-about-references = Lue viittaukšista →
help-reference-page = Ohjehsivu →

help-suggestions-header =
    { $location ->
        [inside] Kohtehen { $element } šisällä
       *[top] Ylimmällä tazolla
    }{ $allowed ->
        [none] { " — tähä ei tule mitänä." }
        [text] { " — tähä kirjutetah tekstie." }
        [text-and-components] { " — tähä kirjutetah tekstie, tahi kokeile:" }
       *[components] { " — mitä voit kokeilla:" }
    }

help-suggestions-footer = Paina { $shortcut }, ku niät kaikki { $total } komponenttie.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } on viittaus kohtieh { $target }.
       *[other] { $ref } on viittaus kohtieh { $target } (rivi { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Ezitelty kohtehešša { $owner } rolissa { $role }.
       *[other] Ezitelty kohtehešša { $owner } rivillä { $line } rolissa { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } on viittaus kohtehen { $element } ominaisuutehe { $property }.
       *[other] { $ref } on viittaus kohtehen { $element } ominaisuutehe { $property } (rivi { $line }).
    }

help-kind-attribute = attribuutti
help-kind-snippet = katkelma
help-kind-array-entry = taulukon alkijo

help-default = Oletus:
help-active-default = Voimašša oleva oletus:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Šallitut arvot (yksi kutakin alkijuo kohti):
       *[other] Šallitut arvot:
    }

help-suggested-values = Ehotetut arvot:

help-inserts = Ližäy:

help-coordinates =
    { $count ->
        [one] Koordinaatti:
       *[other] Koordinaatit:
    }

help-type = Tyyppi:

help-resolved-style = Ratkaistu tyyli (styleNumber { $styleNumber }):

help-resolved-function-names = Ratkaistut funktijoloin nimet:
help-reset-list = Listan palautus täššä šyöttehešša:
help-added-on-input = Ližätty täššä šyöttehešša:
help-removed-on-input = Poistettu täššä šyöttehešša:

help-reset-overrides = { $reset } kumuou azetukšet { $additional } ta { $removed }.
