# Cebuano editor and language-server surfaces. Translated from
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
# A Cebuano numeral joins what it counts with the invariable «ka», so the
# counted messages here need no selection — see the header of `chrome.ftl`.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] I-reset
       *[update] I-update
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } ang tigtan-aw
       *[other] { $word } ang tigtan-aw { $shortcut }
    }


## The variant picker

editor-variant = Variant
editor-variant-filter = Sala-a...
editor-variant-next = Pilia ang sunod nga variant
editor-variant-previous = Pilia ang miaging variant


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Nakit-an ang paglapas sa aksesibilidad nga WCAG AA. I-klik aron { $action ->
            [close] sirad-an
           *[open] ablihan
        } ang taho sa aksesibilidad.
        [advisories] I-klik aron { $action ->
            [close] sirad-an
           *[open] ablihan
        } ang taho sa aksesibilidad. Walay nakit-an nga paglapas sa WCAG AA, apan adunay dugang mga rekomendasyon sa aksesibilidad.
       *[clean] I-klik aron { $action ->
            [close] sirad-an
           *[open] ablihan
        } ang taho sa aksesibilidad. Walay nakit-an nga problema sa aksesibilidad.
    }

editor-accessibility-label =
    { $status ->
        [violations] Nakit-an ang paglapas sa aksesibilidad nga WCAG AA. Nakit-an ang { $count } ka paglapas sa WCAG AA. I-klik aron { $action ->
            [close] sirad-an
           *[open] ablihan
        } ang taho sa aksesibilidad.
        [advisories] Walay nakit-an nga paglapas sa WCAG AA. Nakit-an ang { $count } ka dugang rekomendasyon sa aksesibilidad. I-klik aron { $action ->
            [close] sirad-an
           *[open] ablihan
        } ang taho sa aksesibilidad.
       *[clean] Walay nakit-an nga paglapas sa WCAG AA. I-klik aron { $action ->
            [close] sirad-an
           *[open] ablihan
        } ang taho sa aksesibilidad.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML nga bersyon { $version }

editor-tab-help = Tabang sumala sa konteksto
editor-tab-help-short = Konteksto
editor-tab-errors = Mga sayop
editor-tab-warnings = Mga pasidaan
editor-tab-info = Impormasyon
editor-tab-accessibility = Aksesibilidad
editor-tab-responses = Mga tubag nga gipadala

editor-tab-with-count = { $label }: { $count }

editor-options = Mga kapilian sa editor
editor-format-as-doenetml = I-format isip DoenetML
editor-format-as-xml = I-format isip XML


## The diagnostics panel

editor-diagnostic-line = Linya #{ $line }

editor-no-errors = Walay sayop
editor-no-warnings = Walay pasidaan
editor-no-info = Walay diagnostic nga impormasyon

editor-show-info-annotations = Ipakita ang mga diagnostic nga impormasyon sa editor
editor-show-accessibility-annotations = Ipakita ang mga diagnostic sa aksesibilidad sa editor

editor-accessibility-learn-more = Hibaloi kon unsaon pag-atubang sa Doenet ang aksesibilidad

editor-accessibility-violations-heading = Mga paglapas sa aksesibilidad ({ $standard })

editor-accessibility-other-heading = Uban pang mga isyu sa aksesibilidad
editor-none-found = Walay nakit-an


## Submitted responses

editor-no-responses = Wala pay tubag nga gipadala
editor-response-answer-id = Answer Id
editor-response-response = Tubag
editor-response-credit = Puntos
editor-response-submitted = Gipadala


## The context-help panel

help-placeholder = Ibutang ang cursor sa ngalan sa tag, atributo, o { $ref } alang sa dokumentasyon.

help-unsupported-ref-chain = Wala pa suportahi ang tabang alang sa daghang bahin nga mga reperensiya sama sa { $example }.

help-unresolved-ref =
    { $reason ->
        [notFound] Walay nakit-an nga gitudlo sa reperensiya: { $ref }.
        [multiple] Daghan ang nakit-an nga gitudlo sa reperensiya: { $ref }.
       *[indeterminate] Dili matino ang gitudlo sa { $ref }.
    }

help-learn-about-references = Hibaloi ang mahitungod sa mga reperensiya →
help-reference-page = Panid sa reperensiya →

help-suggestions-header =
    { $location ->
        [inside] Sulod sa { $element }
       *[top] Sa kinatas-ang lebel
    }{ $allowed ->
        [none] { " — walay mabutang dinhi." }
        [text] { " — pagsulat ug teksto dinhi." }
        [text-and-components] { " — pagsulat ug teksto dinhi, o sulayi:" }
       *[components] { " — mga masulayan:" }
    }

help-suggestions-footer = Pislita ang { $shortcut } aron makita ang tanang { $total } ka sangkap.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] Ang { $ref } usa ka reperensiya ngadto sa { $target }.
       *[other] Ang { $ref } usa ka reperensiya ngadto sa { $target } (linya { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Gipaila ni { $owner } isip { $role }.
       *[other] Gipaila ni { $owner } sa linya { $line } isip { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] Ang { $ref } usa ka reperensiya ngadto sa property nga { $property } sa { $element }.
       *[other] Ang { $ref } usa ka reperensiya ngadto sa property nga { $property } sa { $element } (linya { $line }).
    }

help-kind-attribute = atributo
help-kind-snippet = snippet
help-kind-array-entry = entry sa array

help-default = Default:
help-active-default = Aktibo nga default:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Mga bili nga gitugotan (usa matag butang):
       *[other] Mga bili nga gitugotan:
    }

help-suggested-values = Mga bili nga gisugyot:

help-inserts = Magsulod:

help-coordinates = Mga koordinado:

help-type = Matang:

help-resolved-style = Natino nga estilo (styleNumber { $styleNumber }):

help-resolved-function-names = Natino nga mga ngalan sa punsyon:
help-reset-list = Lista sa reset niini nga input:
help-added-on-input = Gidugang niini nga input:
help-removed-on-input = Gikuha niini nga input:

help-reset-overrides = Ang { $reset } molabaw sa { $additional } ug { $removed }.
