# Bosnian editor and language-server surfaces. Translated from
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
# Bosnian counts in three plural categories, but only a message that prints the
# number beside a noun needs all three. `help-coordinates` never shows its count
# — it decides a heading's singular against its plural, and Bosnian has just the
# two forms there — so `one` and `*[other]` are the whole selection.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Poništi
       *[update] Osvježi
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } pregledač
       *[other] { $word } pregledač { $shortcut }
    }


## The variant picker

editor-variant = Varijanta
editor-variant-filter = Filter…
editor-variant-next = Izaberi sljedeću varijantu
editor-variant-previous = Izaberi prethodnu varijantu


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Utvrđeno je kršenje pristupačnosti prema WCAG AA. Kliknite da biste { $action ->
            [close] zatvorili
           *[open] otvorili
        } izvještaj o pristupačnosti.
        [advisories] Kliknite da biste { $action ->
            [close] zatvorili
           *[open] otvorili
        } izvještaj o pristupačnosti. Nisu pronađena kršenja prema WCAG AA, ali postoje dodatne preporuke o pristupačnosti.
       *[clean] Kliknite da biste { $action ->
            [close] zatvorili
           *[open] otvorili
        } izvještaj o pristupačnosti. Nisu pronađeni problemi s pristupačnošću.
    }

editor-accessibility-label =
    { $status ->
        [violations] Utvrđeno je kršenje pristupačnosti prema WCAG AA. { $count ->
            [one] Pronađeno je { $count } kršenje prema WCAG AA
            [few] Pronađena su { $count } kršenja prema WCAG AA
           *[other] Pronađeno je { $count } kršenja prema WCAG AA
        }. Kliknite da biste { $action ->
            [close] zatvorili
           *[open] otvorili
        } izvještaj o pristupačnosti.
        [advisories] Nisu utvrđena kršenja prema WCAG AA. { $count ->
            [one] Pronađena je { $count } dodatna preporuka o pristupačnosti
            [few] Pronađene su { $count } dodatne preporuke o pristupačnosti
           *[other] Pronađeno je { $count } dodatnih preporuka o pristupačnosti
        }. Kliknite da biste { $action ->
            [close] zatvorili
           *[open] otvorili
        } izvještaj o pristupačnosti.
       *[clean] Nisu utvrđena kršenja prema WCAG AA. Kliknite da biste { $action ->
            [close] zatvorili
           *[open] otvorili
        } izvještaj o pristupačnosti.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Verzija { $version } DoenetML-a

editor-tab-help = Kontekstna pomoć
editor-tab-help-short = Kontekst
editor-tab-errors = Greške
editor-tab-warnings = Upozorenja
editor-tab-info = Informacije
editor-tab-accessibility = Pristupačnost
editor-tab-responses = Poslani odgovori

editor-tab-with-count = { $label }: { $count }

editor-options = Postavke uređivača
editor-format-as-doenetml = Oblikuj kao DoenetML
editor-format-as-xml = Oblikuj kao XML


## The diagnostics panel

editor-diagnostic-line = Red br. { $line }

editor-no-errors = Nema grešaka
editor-no-warnings = Nema upozorenja
editor-no-info = Nema informativnih poruka

editor-show-info-annotations = Prikazuj informativne poruke u uređivaču
editor-show-accessibility-annotations = Prikazuj poruke o pristupačnosti u uređivaču

editor-accessibility-learn-more = Kako Doenet pristupa pristupačnosti

editor-accessibility-violations-heading = Kršenja pristupačnosti ({ $standard })

editor-accessibility-other-heading = Ostali problemi s pristupačnošću
editor-none-found = Ništa nije pronađeno


## Submitted responses

editor-no-responses = Još nema poslanih odgovora
editor-response-answer-id = Id odgovora
editor-response-response = Odgovor
editor-response-credit = Bodovi
editor-response-submitted = Poslano


## The context-help panel

help-placeholder = Postavite kursor na ime oznake, atribut ili { $ref } za dokumentaciju.

help-unsupported-ref-chain = Pomoć za višedijelne upute poput { $example } još nije podržana.

help-unresolved-ref =
    { $reason ->
        [notFound] Nije pronađen objekat za uputu: { $ref }.
        [multiple] Pronađeno je više objekata za uputu: { $ref }.
       *[indeterminate] Objekat za { $ref } nije se mogao odrediti.
    }

help-learn-about-references = Saznajte više o uputama →
help-reference-page = Stranica priručnika →

help-suggestions-header =
    { $location ->
        [inside] Unutar { $element }
       *[top] Na najvišem nivou
    }{ $allowed ->
        [none] { " — ovdje ne ide ništa." }
        [text] { " — ovdje možete upisati tekst." }
        [text-and-components] { " — ovdje možete upisati tekst ili pokušati:" }
       *[components] { " — možete pokušati:" }
    }

help-suggestions-footer = Pritisnite { $shortcut } da biste vidjeli svih { $total } komponenata.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } je uputa na { $target }.
       *[other] { $ref } je uputa na { $target } (red { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Uveo ju je { $owner } kao { $role }.
       *[other] Uveo ju je { $owner } u redu { $line } kao { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } je uputa na svojstvo { $property } elementa { $element }.
       *[other] { $ref } je uputa na svojstvo { $property } elementa { $element } (red { $line }).
    }

help-kind-attribute = atribut
help-kind-snippet = isječak
help-kind-array-entry = član niza

help-default = Zadana vrijednost:
help-active-default = Djelatna zadana vrijednost:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Dopuštene vrijednosti (po jedna na član):
       *[other] Dopuštene vrijednosti:
    }

help-suggested-values = Predložene vrijednosti:

help-inserts = Umeće:

help-coordinates =
    { $count ->
        [one] Koordinata:
       *[other] Koordinate:
    }

help-type = Tip:

help-resolved-style = Dobiveni stil (styleNumber { $styleNumber }):

help-resolved-function-names = Dobivena imena funkcija:
help-reset-list = Spisak za poništavanje na ovom polju:
help-added-on-input = Dodano na ovom polju:
help-removed-on-input = Uklonjeno na ovom polju:

help-reset-overrides = { $reset } nadjačava { $additional } i { $removed }.
