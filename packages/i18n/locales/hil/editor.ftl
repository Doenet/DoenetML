# Hiligaynon editor and language-server surfaces. Translated from
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
# Hiligaynon marks no number on the noun, so a `{ $count -> … }` whose two
# English branches differ only in the noun renders one string here and the
# select is dropped.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Ibalik
       *[update] Update
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } ang pagtan-aw
       *[other] { $word } ang pagtan-aw { $shortcut }
    }


## The variant picker

editor-variant = Baryante
editor-variant-filter = Sagion…
editor-variant-next = Pilia ang sunod nga baryante
editor-variant-previous = Pilia ang nagligad nga baryante


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] May nakita nga paglapas sa aksesibilidad nga WCAG AA. I-klik agod { $action ->
            [close] matakpan
           *[open] mabuksan
        } ang report sang aksesibilidad.
        [advisories] I-klik agod { $action ->
            [close] matakpan
           *[open] mabuksan
        } ang report sang aksesibilidad. Wala sing nakita nga paglapas sa WCAG AA, pero may dugang pa nga rekomendasyon sa aksesibilidad.
       *[clean] I-klik agod { $action ->
            [close] matakpan
           *[open] mabuksan
        } ang report sang aksesibilidad. Wala sing nakita nga problema sa aksesibilidad.
    }

# No select on `$count` inside the branches: «paglapas» and «rekomendasyon» are
# the same words for one and for many.
editor-accessibility-label =
    { $status ->
        [violations] May nakita nga paglapas sa aksesibilidad nga WCAG AA. { $count } nga paglapas sa WCAG AA ang nakita. I-klik agod { $action ->
            [close] matakpan
           *[open] mabuksan
        } ang report sang aksesibilidad.
        [advisories] Wala sing nakita nga paglapas sa WCAG AA. { $count } nga dugang nga rekomendasyon sa aksesibilidad ang nakita. I-klik agod { $action ->
            [close] matakpan
           *[open] mabuksan
        } ang report sang aksesibilidad.
       *[clean] Wala sing nakita nga paglapas sa WCAG AA. I-klik agod { $action ->
            [close] matakpan
           *[open] mabuksan
        } ang report sang aksesibilidad.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Bersyon sang DoenetML { $version }

editor-tab-help = Bulig nga suno sa konteksto
editor-tab-help-short = Konteksto
editor-tab-errors = Sayop
editor-tab-warnings = Paandam
editor-tab-info = Impormasyon
editor-tab-accessibility = Aksesibilidad
editor-tab-responses = Ginpadala nga mga sabat

editor-tab-with-count = { $label }: { $count }

editor-options = Mga opsyon sang editor
editor-format-as-doenetml = I-pormat subong DoenetML
editor-format-as-xml = I-pormat subong XML


## The diagnostics panel

editor-diagnostic-line = Linya #{ $line }

editor-no-errors = Wala sing sayop
editor-no-warnings = Wala sing paandam
editor-no-info = Wala sing diagnostiko nga impormasyon

editor-show-info-annotations = Ipakita ang mga diagnostiko nga impormasyon sa editor
editor-show-accessibility-annotations = Ipakita ang mga diagnostiko sang aksesibilidad sa editor

editor-accessibility-learn-more = Tun-i kon paano ginaatubang sang Doenet ang aksesibilidad

editor-accessibility-violations-heading = Mga paglapas sa aksesibilidad ({ $standard })

editor-accessibility-other-heading = Iban pa nga problema sa aksesibilidad
editor-none-found = Wala sing nakita


## Submitted responses

editor-no-responses = Wala pa sing ginpadala nga sabat
editor-response-answer-id = Id sang sabat
editor-response-response = Sabat
editor-response-credit = Kredito
editor-response-submitted = Ginpadala


## The context-help panel

help-placeholder = Ibutang ang kursor sa ngalan sang tag, atributo, ukon { $ref } para sa dokumentasyon.

help-unsupported-ref-chain = Wala pa sing suporta ang bulig para sa mga reperensya nga madamo ang bahin subong sang { $example }.

help-unresolved-ref =
    { $reason ->
        [notFound] Wala sing nakita nga ginatudlo sang reperensya: { $ref }.
        [multiple] Madamo ang nakita nga ginatudlo sang reperensya: { $ref }.
       *[indeterminate] Wala matukoy ang ginatudlo sang { $ref }.
    }

help-learn-about-references = Tun-i ang parte sa mga reperensya →
help-reference-page = Pahina sang reperensya →

help-suggestions-header =
    { $location ->
        [inside] Sa sulod sang { $element }
       *[top] Sa pinakamataas nga lebel
    }{ $allowed ->
        [none] { " — wala sing mabutang diri." }
        [text] { " — magsulat sing teksto diri." }
        [text-and-components] { " — magsulat sing teksto diri, ukon tilawi:" }
       *[components] { " — mga matilawan:" }
    }

help-suggestions-footer = Pisla ang { $shortcut } agod makita ang tanan nga { $total } nga komponente.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] Ang { $ref } isa ka reperensya sa { $target }.
       *[other] Ang { $ref } isa ka reperensya sa { $target } (linya { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Gindala sang { $owner } subong { $role }.
       *[other] Gindala sang { $owner } sa linya { $line } subong { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] Ang { $ref } isa ka reperensya sa propyedad nga { $property } sang { $element }.
       *[other] Ang { $ref } isa ka reperensya sa propyedad nga { $property } sang { $element } (linya { $line }).
    }

help-kind-attribute = atributo
help-kind-snippet = gamay nga kodigo
help-kind-array-entry = entrada sa array

help-default = Naandan:
help-active-default = Aktibo nga naandan:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Mga tugot nga balor (isa kada butang):
       *[other] Mga tugot nga balor:
    }

help-suggested-values = Mga ginasuhestyon nga balor:

help-inserts = Nagasulod:

# No select: «koordinado» is the same word for one and for many.
help-coordinates = Koordinado:

help-type = Klase:

help-resolved-style = Natukoy nga estilo (styleNumber { $styleNumber }):

help-resolved-function-names = Natukoy nga mga ngalan sang punsyon:
help-reset-list = Lista sang pagbalik sa sini nga input:
help-added-on-input = Gindugang sa sini nga input:
help-removed-on-input = Ginkuha sa sini nga input:

help-reset-overrides = Ang { $reset } nagailis sang { $additional } kag { $removed }.
