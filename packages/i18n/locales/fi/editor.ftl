# Finnish editor and language-server surfaces. Translated from
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
        [reset] Palauta
       *[update] Päivitä
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } katselin
       *[other] { $word } katselin { $shortcut }
    }


## The variant picker

editor-variant = Muunnelma
editor-variant-filter = Suodata…
editor-variant-next = Valitse seuraava muunnelma
editor-variant-previous = Valitse edellinen muunnelma


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA -saavutettavuusrikkomus havaittu. Napsauta { $action ->
            [close] sulkeaksesi
           *[open] avataksesi
        } saavutettavuusraportin.
        [advisories] Napsauta { $action ->
            [close] sulkeaksesi
           *[open] avataksesi
        } saavutettavuusraportin. WCAG AA -rikkomuksia ei löytynyt, mutta saatavilla on lisäsuosituksia saavutettavuudesta.
       *[clean] Napsauta { $action ->
            [close] sulkeaksesi
           *[open] avataksesi
        } saavutettavuusraportin. Saavutettavuusongelmia ei löytynyt.
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA -saavutettavuusrikkomus havaittu. Löytyi { $count ->
            [one] { $count } WCAG AA -rikkomus
           *[other] { $count } WCAG AA -rikkomusta
        }. Napsauta { $action ->
            [close] sulkeaksesi
           *[open] avataksesi
        } saavutettavuusraportin.
        [advisories] WCAG AA -rikkomuksia ei havaittu. Löytyi { $count ->
            [one] { $count } saavutettavuutta koskeva lisäsuositus
           *[other] { $count } saavutettavuutta koskevaa lisäsuositusta
        }. Napsauta { $action ->
            [close] sulkeaksesi
           *[open] avataksesi
        } saavutettavuusraportin.
       *[clean] WCAG AA -rikkomuksia ei havaittu. Napsauta { $action ->
            [close] sulkeaksesi
           *[open] avataksesi
        } saavutettavuusraportin.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML-versio { $version }

editor-tab-help = Kontekstiherkkä ohje
editor-tab-help-short = Konteksti
editor-tab-errors = Virheet
editor-tab-warnings = Varoitukset
editor-tab-info = Tiedot
editor-tab-accessibility = Saavutettavuus
editor-tab-responses = Lähetetyt vastaukset

editor-tab-with-count = { $label }: { $count }

editor-options = Editorin asetukset
editor-format-as-doenetml = Muotoile DoenetML:nä
editor-format-as-xml = Muotoile XML:nä


## The diagnostics panel

editor-diagnostic-line = Rivi { $line }

editor-no-errors = Ei virheitä
editor-no-warnings = Ei varoituksia
editor-no-info = Ei tietodiagnostiikkaa

editor-show-info-annotations = Näytä tietodiagnostiikka editorissa
editor-show-accessibility-annotations = Näytä saavutettavuusdiagnostiikka editorissa

editor-accessibility-learn-more = Näin Doenet lähestyy saavutettavuutta

editor-accessibility-violations-heading = Saavutettavuusrikkomukset ({ $standard })

editor-accessibility-other-heading = Muut saavutettavuusongelmat
editor-none-found = Ei löytynyt mitään


## Submitted responses

editor-no-responses = Ei vielä lähetettyjä vastauksia
editor-response-answer-id = Vastauksen tunnus
editor-response-response = Vastaus
editor-response-credit = Pisteet
editor-response-submitted = Lähetetty


## The context-help panel

help-placeholder = Vie kohdistin tunnisteen nimen, attribuutin tai kohteen { $ref } päälle nähdäksesi dokumentaation.

help-unsupported-ref-chain = Moniosaisten viittausten, kuten { $example }, ohjetta ei vielä tueta.

help-unresolved-ref =
    { $reason ->
        [notFound] Viittaukselle ei löytynyt kohdetta: { $ref }.
        [multiple] Viittaukselle löytyi useita kohteita: { $ref }.
       *[indeterminate] Kohdetta viittaukselle { $ref } ei voitu määrittää.
    }

help-learn-about-references = Lue viittauksista →
help-reference-page = Ohjesivu →

help-suggestions-header =
    { $location ->
        [inside] Kohteen { $element } sisällä
       *[top] Ylimmällä tasolla
    }{ $allowed ->
        [none] { " — tähän ei tule mitään." }
        [text] { " — tähän kirjoitetaan tekstiä." }
        [text-and-components] { " — tähän kirjoitetaan tekstiä, tai kokeile:" }
       *[components] { " — mitä voi kokeilla:" }
    }

help-suggestions-footer = Paina { $shortcut } nähdäksesi kaikki { $total } komponenttia.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } on viittaus kohteeseen { $target }.
       *[other] { $ref } on viittaus kohteeseen { $target } (rivi { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Esitelty kohteessa { $owner } roolissa { $role }.
       *[other] Esitelty kohteessa { $owner } rivillä { $line } roolissa { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } on viittaus kohteen { $element } ominaisuuteen { $property }.
       *[other] { $ref } on viittaus kohteen { $element } ominaisuuteen { $property } (rivi { $line }).
    }

help-kind-attribute = attribuutti
help-kind-snippet = katkelma
help-kind-array-entry = taulukon alkio

help-default = Oletus:
help-active-default = Voimassa oleva oletus:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Sallitut arvot (yksi kutakin alkiota kohden):
       *[other] Sallitut arvot:
    }

help-suggested-values = Ehdotetut arvot:

help-inserts = Lisää:

help-coordinates =
    { $count ->
        [one] Koordinaatti:
       *[other] Koordinaatit:
    }

help-type = Tyyppi:

help-resolved-style = Ratkaistu tyyli (styleNumber { $styleNumber }):

help-resolved-function-names = Ratkaistut funktioiden nimet:
help-reset-list = Listan palautus tässä syötteessä:
help-added-on-input = Lisätty tässä syötteessä:
help-removed-on-input = Poistettu tässä syötteessä:

help-reset-overrides = { $reset } kumoaa asetukset { $additional } ja { $removed }.
