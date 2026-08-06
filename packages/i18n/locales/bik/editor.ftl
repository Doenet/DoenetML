# Bikol editor and language-server surfaces. Translated from
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
# Bikol marks no number on the noun, so a `{ $count -> … }` whose two English
# branches differ only in the noun renders one string here and the select is
# dropped.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Ibalik
       *[update] Baguhon
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } an pagheling
       *[other] { $word } an pagheling { $shortcut }
    }


## The variant picker

editor-variant = Baryante
editor-variant-filter = Salaon…
editor-variant-next = Pilion an sunod na baryante
editor-variant-previous = Pilion an nakaaging baryante


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Igwang nakuang paglapas sa aksesibilidad na WCAG AA. I-klik tanganing { $action ->
            [close] masarahan
           *[open] mabuksan
        } an report kan aksesibilidad.
        [advisories] I-klik tanganing { $action ->
            [close] masarahan
           *[open] mabuksan
        } an report kan aksesibilidad. Mayong nakuang paglapas sa WCAG AA, alagad igwa pang dagdag na rekomendasyon sa aksesibilidad.
       *[clean] I-klik tanganing { $action ->
            [close] masarahan
           *[open] mabuksan
        } an report kan aksesibilidad. Mayong nakuang problema sa aksesibilidad.
    }

# No select on `$count` inside the branches: «paglapas» and «rekomendasyon» are
# the same words for one and for many.
editor-accessibility-label =
    { $status ->
        [violations] Igwang nakuang paglapas sa aksesibilidad na WCAG AA. { $count } na paglapas sa WCAG AA an nakua. I-klik tanganing { $action ->
            [close] masarahan
           *[open] mabuksan
        } an report kan aksesibilidad.
        [advisories] Mayong nakuang paglapas sa WCAG AA. { $count } na dagdag na rekomendasyon sa aksesibilidad an nakua. I-klik tanganing { $action ->
            [close] masarahan
           *[open] mabuksan
        } an report kan aksesibilidad.
       *[clean] Mayong nakuang paglapas sa WCAG AA. I-klik tanganing { $action ->
            [close] masarahan
           *[open] mabuksan
        } an report kan aksesibilidad.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Bersyon kan DoenetML { $version }

editor-tab-help = Tabang na sunod sa konteksto
editor-tab-help-short = Konteksto
editor-tab-errors = Sala
editor-tab-warnings = Patanid
editor-tab-info = Impormasyon
editor-tab-accessibility = Aksesibilidad
editor-tab-responses = Ipinadarang mga simbag

editor-tab-with-count = { $label }: { $count }

editor-options = Mga opsyon kan editor
editor-format-as-doenetml = I-pormat bilang DoenetML
editor-format-as-xml = I-pormat bilang XML


## The diagnostics panel

editor-diagnostic-line = Linya #{ $line }

editor-no-errors = Mayong sala
editor-no-warnings = Mayong patanid
editor-no-info = Mayong diagnostikong impormasyon

editor-show-info-annotations = Ipahiling an mga diagnostikong impormasyon sa editor
editor-show-accessibility-annotations = Ipahiling an mga diagnostiko kan aksesibilidad sa editor

editor-accessibility-learn-more = Aramon kun paano inaatubang kan Doenet an aksesibilidad

editor-accessibility-violations-heading = Mga paglapas sa aksesibilidad ({ $standard })

editor-accessibility-other-heading = Ibang problema sa aksesibilidad
editor-none-found = Mayong nakua


## Submitted responses

editor-no-responses = Mayo pang ipinadarang simbag
editor-response-answer-id = Id kan simbag
editor-response-response = Simbag
editor-response-credit = Kredito
editor-response-submitted = Ipinadara


## The context-help panel

help-placeholder = Ibutang an kursor sa ngaran kan tag, atributo, o { $ref } para sa dokumentasyon.

help-unsupported-ref-chain = Mayo pang suporta an tabang para sa mga reperensiyang dakol an kabtang arog kan { $example }.

help-unresolved-ref =
    { $reason ->
        [notFound] Mayong nakuang tinutukdo kan reperensiya: { $ref }.
        [multiple] Dakol an nakuang tinutukdo kan reperensiya: { $ref }.
       *[indeterminate] Dai natukdoan an tinutukdo kan { $ref }.
    }

help-learn-about-references = Aramon an manongod sa mga reperensiya →
help-reference-page = Pahina kan reperensiya →

help-suggestions-header =
    { $location ->
        [inside] Sa laog kan { $element }
       *[top] Sa pinakahalangkaw na lebel
    }{ $allowed ->
        [none] { " — mayong puwedeng ibutang digdi." }
        [text] { " — magsurat nin teksto digdi." }
        [text-and-components] { " — magsurat nin teksto digdi, o purbaran:" }
       *[components] { " — mga puwedeng purbaran:" }
    }

help-suggestions-footer = Pindoton an { $shortcut } tanganing mahiling an gabos na { $total } na komponente.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] An { $ref } sarong reperensiya sa { $target }.
       *[other] An { $ref } sarong reperensiya sa { $target } (linya { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Dinara kan { $owner } bilang { $role }.
       *[other] Dinara kan { $owner } sa linya { $line } bilang { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] An { $ref } sarong reperensiya sa propyedad na { $property } kan { $element }.
       *[other] An { $ref } sarong reperensiya sa propyedad na { $property } kan { $element } (linya { $line }).
    }

help-kind-attribute = atributo
help-kind-snippet = sadit na kodigo
help-kind-array-entry = entrada sa array

help-default = Nakaugalian:
help-active-default = Aktibong nakaugalian:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Mga tinutugotan na balor (saro kada bagay):
       *[other] Mga tinutugotan na balor:
    }

help-suggested-values = Mga isinusuherenciang balor:

help-inserts = Naglalaog:

# No select: «koordinado» is the same word for one and for many.
help-coordinates = Koordinado:

help-type = Klase:

help-resolved-style = Natukdoan na estilo (styleNumber { $styleNumber }):

help-resolved-function-names = Natukdoan na mga ngaran kan punsyon:
help-reset-list = Lista kan pagbalik sa input na ini:
help-added-on-input = Idinagdag sa input na ini:
help-removed-on-input = Hinali sa input na ini:

help-reset-overrides = An { $reset } sinasalidahan an { $additional } asin { $removed }.
