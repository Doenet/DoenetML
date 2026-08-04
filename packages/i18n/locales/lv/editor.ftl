# Latvian editor and language-server surfaces. Translated from
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
# Latvian counts in three categories, `zero` among them, but only a message
# that prints the number beside a noun needs all three. `help-coordinates`
# never shows its count — it decides a heading's singular against its plural —
# so `one` and `*[other]` are the whole selection there.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Atiestatīt
       *[update] Atjaunināt
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } skatītāju
       *[other] { $word } skatītāju { $shortcut }
    }


## The variant picker

editor-variant = Variants
editor-variant-filter = Filtrs…
editor-variant-next = Izvēlēties nākamo variantu
editor-variant-previous = Izvēlēties iepriekšējo variantu


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Konstatēts WCAG AA piekļūstamības pārkāpums. Noklikšķiniet, lai { $action ->
            [close] aizvērtu
           *[open] atvērtu
        } piekļūstamības pārskatu.
        [advisories] Noklikšķiniet, lai { $action ->
            [close] aizvērtu
           *[open] atvērtu
        } piekļūstamības pārskatu. WCAG AA pārkāpumi nav atrasti, taču ir papildu ieteikumi par piekļūstamību.
       *[clean] Noklikšķiniet, lai { $action ->
            [close] aizvērtu
           *[open] atvērtu
        } piekļūstamības pārskatu. Piekļūstamības problēmas nav atrastas.
    }

editor-accessibility-label =
    { $status ->
        [violations] Konstatēts WCAG AA piekļūstamības pārkāpums. Atrasts { $count ->
            [zero] { $count } WCAG AA pārkāpumu
            [one] { $count } WCAG AA pārkāpums
           *[other] { $count } WCAG AA pārkāpumi
        }. Noklikšķiniet, lai { $action ->
            [close] aizvērtu
           *[open] atvērtu
        } piekļūstamības pārskatu.
        [advisories] WCAG AA pārkāpumi nav konstatēti. Atrasts { $count ->
            [zero] { $count } papildu piekļūstamības ieteikumu
            [one] { $count } papildu piekļūstamības ieteikums
           *[other] { $count } papildu piekļūstamības ieteikumi
        }. Noklikšķiniet, lai { $action ->
            [close] aizvērtu
           *[open] atvērtu
        } piekļūstamības pārskatu.
       *[clean] WCAG AA pārkāpumi nav konstatēti. Noklikšķiniet, lai { $action ->
            [close] aizvērtu
           *[open] atvērtu
        } piekļūstamības pārskatu.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML versija { $version }

editor-tab-help = Kontekstuālā palīdzība
editor-tab-help-short = Konteksts
editor-tab-errors = Kļūdas
editor-tab-warnings = Brīdinājumi
editor-tab-info = Informācija
editor-tab-accessibility = Piekļūstamība
editor-tab-responses = Iesniegtās atbildes

editor-tab-with-count = { $label }: { $count }

editor-options = Redaktora iestatījumi
editor-format-as-doenetml = Formatēt kā DoenetML
editor-format-as-xml = Formatēt kā XML


## The diagnostics panel

editor-diagnostic-line = { $line }. rinda

editor-no-errors = Kļūdu nav
editor-no-warnings = Brīdinājumu nav
editor-no-info = Informatīvu ziņojumu nav

editor-show-info-annotations = Rādīt informatīvos ziņojumus redaktorā
editor-show-accessibility-annotations = Rādīt piekļūstamības ziņojumus redaktorā

editor-accessibility-learn-more = Kā Doenet raugās uz piekļūstamību

editor-accessibility-violations-heading = Piekļūstamības pārkāpumi ({ $standard })

editor-accessibility-other-heading = Citas piekļūstamības problēmas
editor-none-found = Nekas nav atrasts


## Submitted responses

editor-no-responses = Iesniegtu atbilžu vēl nav
editor-response-answer-id = Atbildes Id
editor-response-response = Atbilde
editor-response-credit = Punkti
editor-response-submitted = Iesniegta


## The context-help panel

help-placeholder = Novietojiet kursoru uz birkas nosaukuma, atribūta vai { $ref }, lai redzētu dokumentāciju.

help-unsupported-ref-chain = Palīdzība saliktām atsaucēm, piemēram { $example }, vēl netiek atbalstīta.

help-unresolved-ref =
    { $reason ->
        [notFound] Atsaucei nav atrasts objekts: { $ref }.
        [multiple] Atsaucei atrasti vairāki objekti: { $ref }.
       *[indeterminate] Objektu atsaucei { $ref } nevarēja noteikt.
    }

help-learn-about-references = Uzziniet vairāk par atsaucēm →
help-reference-page = Rokasgrāmatas lappuse →

help-suggestions-header =
    { $location ->
        [inside] { $element } iekšpusē
       *[top] Augšējā līmenī
    }{ $allowed ->
        [none] { " — šeit neder nekas." }
        [text] { " — šeit var rakstīt tekstu." }
        [text-and-components] { " — šeit var rakstīt tekstu vai izmēģināt:" }
       *[components] { " — var izmēģināt:" }
    }

help-suggestions-footer = Nospiediet { $shortcut }, lai redzētu visus { $total } komponentus.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } ir atsauce uz { $target }.
       *[other] { $ref } ir atsauce uz { $target } ({ $line }. rinda).
    }

help-ref-derived-from =
    { $line ->
        [none] Ieviesa { $owner } kā { $role }.
       *[other] Ieviesa { $owner } { $line }. rindā kā { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } ir atsauce uz { $element } īpašību { $property }.
       *[other] { $ref } ir atsauce uz { $element } īpašību { $property } ({ $line }. rinda).
    }

help-kind-attribute = atribūts
help-kind-snippet = fragments
help-kind-array-entry = masīva loceklis

help-default = Noklusējuma vērtība:
help-active-default = Spēkā esošā noklusējuma vērtība:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Atļautās vērtības (pa vienai katram loceklim):
       *[other] Atļautās vērtības:
    }

help-suggested-values = Ieteiktās vērtības:

help-inserts = Ievieto:

help-coordinates =
    { $count ->
        [one] Koordināta:
       *[other] Koordinātas:
    }

help-type = Tips:

help-resolved-style = Iegūtais stils (styleNumber { $styleNumber }):

help-resolved-function-names = Iegūtie funkciju nosaukumi:
help-reset-list = Šī lauka atiestatīšanas saraksts:
help-added-on-input = Pievienots šim laukam:
help-removed-on-input = Noņemts no šī lauka:

help-reset-overrides = { $reset } ir pārāks par { $additional } un { $removed }.
