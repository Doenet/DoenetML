# Malagasy editor and language-server surfaces. Translated from
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
# A Malagasy noun is not marked for number, so the counted messages here need
# no selection — see the header of `chrome.ftl`.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Avereno
       *[update] Havaozy
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } ny mpijery
       *[other] { $word } ny mpijery { $shortcut }
    }


## The variant picker

editor-variant = Karazany
editor-variant-filter = Sivana...
editor-variant-next = Fidio ny karazany manaraka
editor-variant-previous = Fidio ny karazany teo aloha


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Hita ny fandikana ny fahafahana miditra WCAG AA. Tsindrio mba { $action ->
            [close] hanidy
           *[open] hanokatra
        } ny tatitra momba ny fahafahana miditra.
        [advisories] Tsindrio mba { $action ->
            [close] hanidy
           *[open] hanokatra
        } ny tatitra momba ny fahafahana miditra. Tsy nisy fandikana WCAG AA hita, saingy misy soso-kevitra fanampiny.
       *[clean] Tsindrio mba { $action ->
            [close] hanidy
           *[open] hanokatra
        } ny tatitra momba ny fahafahana miditra. Tsy nisy olana hita.
    }

editor-accessibility-label =
    { $status ->
        [violations] Hita ny fandikana ny fahafahana miditra WCAG AA. Nisy fandikana WCAG AA { $count } hita. Tsindrio mba { $action ->
            [close] hanidy
           *[open] hanokatra
        } ny tatitra momba ny fahafahana miditra.
        [advisories] Tsy nisy fandikana WCAG AA hita. Nisy soso-kevitra fanampiny { $count } hita. Tsindrio mba { $action ->
            [close] hanidy
           *[open] hanokatra
        } ny tatitra momba ny fahafahana miditra.
       *[clean] Tsy nisy fandikana WCAG AA hita. Tsindrio mba { $action ->
            [close] hanidy
           *[open] hanokatra
        } ny tatitra momba ny fahafahana miditra.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML dikan-drindrambaiko { $version }

editor-tab-help = Fanampiana araka ny toe-javatra
editor-tab-help-short = Toe-javatra
editor-tab-errors = Hadisoana
editor-tab-warnings = Fampitandremana
editor-tab-info = Fanazavana
editor-tab-accessibility = Fahafahana miditra
editor-tab-responses = Valiny nalefa

editor-tab-with-count = { $label }: { $count }

editor-options = Safidin'ny mpanova
editor-format-as-doenetml = Amboary ho endrika DoenetML
editor-format-as-xml = Amboary ho endrika XML


## The diagnostics panel

editor-diagnostic-line = Andalana #{ $line }

editor-no-errors = Tsy misy hadisoana
editor-no-warnings = Tsy misy fampitandremana
editor-no-info = Tsy misy fanazavana

editor-show-info-annotations = Asehoy ao amin'ny mpanova ny fanazavana
editor-show-accessibility-annotations = Asehoy ao amin'ny mpanova ny fanamarihana momba ny fahafahana miditra

editor-accessibility-learn-more = Fantaro ny fomba iatrehan'i Doenet ny fahafahana miditra

editor-accessibility-violations-heading = Fandikana ny fahafahana miditra ({ $standard })

editor-accessibility-other-heading = Olana hafa momba ny fahafahana miditra
editor-none-found = Tsy nisy hita


## Submitted responses

editor-no-responses = Mbola tsy misy valiny nalefa
editor-response-answer-id = Answer Id
editor-response-response = Valiny
editor-response-credit = Naoty
editor-response-submitted = Nalefa


## The context-help panel

help-placeholder = Apetraho eo amin'ny anaran-tag, attribute na { $ref } ny kursora hahitana ny torolalana.

help-unsupported-ref-chain = Mbola tsy tohanana ny fanampiana ho an'ny fanondroana misy ampahany maro toy ny { $example }.

help-unresolved-ref =
    { $reason ->
        [notFound] Tsy hita izay tondroin'ny fanondroana: { $ref }.
        [multiple] Maro ny hita tondroin'ny fanondroana: { $ref }.
       *[indeterminate] Tsy azo faritana izay tondroin'ny { $ref }.
    }

help-learn-about-references = Fantaro ny momba ny fanondroana →
help-reference-page = Pejin'ny fanondroana →

help-suggestions-header =
    { $location ->
        [inside] Ao anatin'ny { $element }
       *[top] Eo amin'ny ambaratonga ambony indrindra
    }{ $allowed ->
        [none] { " — tsy misy azo apetraka eto." }
        [text] { " — soraty eto ny lahatsoratra." }
        [text-and-components] { " — soraty eto ny lahatsoratra, na andramo:" }
       *[components] { " — zavatra azo andramana:" }
    }

help-suggestions-footer = Tsindrio ny { $shortcut } hahitana ny singa { $total } rehetra.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] Fanondroana ny { $target } ny { $ref }.
       *[other] Fanondroana ny { $target } ny { $ref } (andalana { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Nampidirin'ny { $owner } ho { $role }.
       *[other] Nampidirin'ny { $owner } teo amin'ny andalana { $line } ho { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] Fanondroana ny property { $property } an'ny { $element } ny { $ref }.
       *[other] Fanondroana ny property { $property } an'ny { $element } ny { $ref } (andalana { $line }).
    }

help-kind-attribute = attribute
help-kind-snippet = sombiny
help-kind-array-entry = singa anaty array

help-default = Mahazatra:
help-active-default = Mahazatra ampiasaina:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Sanda azo atao (iray isaky ny singa):
       *[other] Sanda azo atao:
    }

help-suggested-values = Sanda atolotra:

help-inserts = Mampiditra:

help-coordinates = Kaordone:

help-type = Karazana:

help-resolved-style = Endrika voafaritra (styleNumber { $styleNumber }):

help-resolved-function-names = Anaram-piasa voafaritra:
help-reset-list = Lisitra averina amin'ity input ity:
help-added-on-input = Nampiana tamin'ity input ity:
help-removed-on-input = Nesorina tamin'ity input ity:

help-reset-overrides = Manafoana ny { $additional } sy ny { $removed } ny { $reset }.
