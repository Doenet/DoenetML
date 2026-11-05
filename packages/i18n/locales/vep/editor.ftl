# Veps editor and language-server surfaces. Translated from
# `locales/en/editor.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in the **Latin** alphabet, with ä ö ü, č š ž and the palatalization
# apostrophe. Veps is a language of the Russian Federation that is not written
# in Cyrillic: its modern orthography has been Latin since 1989, and that is
# what its schoolbooks, «Kodima» and CLDR all use.
#
# Veps is Finnic but it is not Karelian: a separate ISO 639-3 language with no
# macrolanguage over it, and neither `locales/krl` nor `locales/olo` can stand
# in for it.
#
# `WCAG AA`, `DoenetML`, `XML`, `styleNumber` and every attribute or element
# name are identifiers, not prose, and stay as written.
#
# The technical nouns are the Russian-mediated ones the Veps press uses —
# «komponent», «atribut», «funkcii», «indeks», «klaviatur», «dokument»,
# «redaktor» — rather than invented native compounds, and they are the part of
# this seed a reviewer should expect to change first.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Pane tagaze
       *[update] Udišta
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } kacui
       *[other] { $word } kacui { $shortcut }
    }


## The variant picker

editor-variant = Variant
editor-variant-filter = Suoda…
editor-variant-next = Valiče jäl'ghine variant
editor-variant-previous = Valiče edeline variant


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA -sadatoiden rikkond om löut. Paina, miše { $action ->
            [close] saupta
           *[open] avaita
        } sadatoiden raport.
        [advisories] Paina, miše { $action ->
            [close] saupta
           *[open] avaita
        } sadatoiden raport. WCAG AA -rikkondoid ei löutud, no sadatoiš oma ližanevondad.
       *[clean] Paina, miše { $action ->
            [close] saupta
           *[open] avaita
        } sadatoiden raport. Sadatoiden probleemoid ei löutud.
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA -sadatoiden rikkond om löut. Löutihe { $count ->
            [one] { $count } WCAG AA -rikkond
           *[other] { $count } WCAG AA -rikkondad
        }. Paina, miše { $action ->
            [close] saupta
           *[open] avaita
        } sadatoiden raport.
        [advisories] WCAG AA -rikkondoid ei löutud. Löutihe { $count ->
            [one] { $count } sadatoiden ližanevond
           *[other] { $count } sadatoiden ližanevondad
        }. Paina, miše { $action ->
            [close] saupta
           *[open] avaita
        } sadatoiden raport.
       *[clean] WCAG AA -rikkondoid ei löutud. Paina, miše { $action ->
            [close] saupta
           *[open] avaita
        } sadatoiden raport.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML-versii { $version }

editor-tab-help = Kontekstan mödhe abu
editor-tab-help-short = Kontekst
editor-tab-errors = Vigad
editor-tab-warnings = Varutesed
editor-tab-info = Tedod
editor-tab-accessibility = Sadatoid
editor-tab-responses = Oigetud vastused

editor-tab-with-count = { $label }: { $count }

editor-options = Redaktoran azetused
editor-format-as-doenetml = Formirui DoenetML:n mödhe
editor-format-as-xml = Formirui XML:n mödhe


## The diagnostics panel

editor-diagnostic-line = Rid { $line }

editor-no-errors = Ei ole vigoid
editor-no-warnings = Ei ole varutesid
editor-no-info = Ei ole teddiagnostikad

editor-show-info-annotations = Ozuta teddiagnostik redaktoras
editor-show-accessibility-annotations = Ozuta sadatoiden diagnostik redaktoras

editor-accessibility-learn-more = Muga Doenet kacub sadatoihe

editor-accessibility-violations-heading = Sadatoiden rikkondad ({ $standard })

editor-accessibility-other-heading = Toižed sadatoiden probleemad
editor-none-found = Nimidä ei löutud


## Submitted responses

editor-no-responses = Völ ei ole oigetud vastusid
editor-response-answer-id = Vastusen tunduz
editor-response-response = Vastuz
editor-response-credit = Ballad
editor-response-submitted = Oigetud


## The context-help panel

help-placeholder = Vii kursor tundusen nimen, atributan vai kohtan { $ref } päle, miše nägištad dokumentacijan.

help-unsupported-ref-chain = Äioznaižiden viitusiden, mugoižiden kut { $example }, abud völ ei tugeta.

help-unresolved-ref =
    { $reason ->
        [notFound] Viitusele ei löutud kohtad: { $ref }.
        [multiple] Viitusele löutihe äi kohtad: { $ref }.
       *[indeterminate] Viitusen { $ref } kohtad ei voitud märita.
    }

help-learn-about-references = Luge viitusiš →
help-reference-page = Abulehtpol' →

help-suggestions-header =
    { $location ->
        [inside] Kohtan { $element } südäimes
       *[top] Ülembal tazol
    }{ $allowed ->
        [none] { " — tänna ei tule nimidä." }
        [text] { " — tänna kirjutadas tekst." }
        [text-and-components] { " — tänna kirjutadas tekst, vai kokka:" }
       *[components] { " — midä voib kokta:" }
    }

help-suggestions-footer = Paina { $shortcut }, miše nägištad kaikuččen { $total } komponentad.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } om viituz kohtale { $target }.
       *[other] { $ref } om viituz kohtale { $target } (rid { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Ozutadud kohtas { $owner } rolis { $role }.
       *[other] Ozutadud kohtas { $owner } ridal { $line } rolis { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } om viituz kohtan { $element } ominazusehe { $property }.
       *[other] { $ref } om viituz kohtan { $element } ominazusehe { $property } (rid { $line }).
    }

help-kind-attribute = atribut
help-kind-snippet = katkand
help-kind-array-entry = tablican element

help-default = Oletuz:
help-active-default = Voimas olii oletuz:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Sallitud arvod (üks' kaikuččele elementale):
       *[other] Sallitud arvod:
    }

help-suggested-values = Ehtoitadud arvod:

help-inserts = Paneb:

help-coordinates =
    { $count ->
        [one] Koordinat:
       *[other] Koordinatad:
    }

help-type = Tip:

help-resolved-style = Sel'genzoittud stil' (styleNumber { $styleNumber }):

help-resolved-function-names = Sel'genzoittud funkcijoiden nimed:
help-reset-list = Listan tagaze panend necil sirul:
help-added-on-input = Ližatud necil sirul:
help-removed-on-input = Heittud necil sirul:

help-reset-overrides = { $reset } heitäb azetused { $additional } da { $removed }.
