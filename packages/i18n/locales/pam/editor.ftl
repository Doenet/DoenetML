# Kapampangan editor and language-server surfaces. Translated from
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
# Kapampangan marks no number on the noun, so a `{ $count -> … }` whose two
# English branches differ only in the noun renders one string here and the
# select is dropped.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Ibalik
       *[update] Bayuan
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } ing pamanakit
       *[other] { $word } ing pamanakit { $shortcut }
    }


## The variant picker

editor-variant = Baryante
editor-variant-filter = Salain…
editor-variant-next = Piliin ing tutuking baryante
editor-variant-previous = Piliin ing milabas a baryante


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Atin mekit a pamanlabag king aksesibilidad a WCAG AA. I-klik ban { $action ->
            [close] masara
           *[open] mabuklat
        } ing report ning aksesibilidad.
        [advisories] I-klik ban { $action ->
            [close] masara
           *[open] mabuklat
        } ing report ning aksesibilidad. Alang mekit a pamanlabag king WCAG AA, oneng atin pang dagdag a rekomendasyon king aksesibilidad.
       *[clean] I-klik ban { $action ->
            [close] masara
           *[open] mabuklat
        } ing report ning aksesibilidad. Alang mekit a problema king aksesibilidad.
    }

# No select on `$count` inside the branches: «pamanlabag» and «rekomendasyon»
# are the same words for one and for many.
editor-accessibility-label =
    { $status ->
        [violations] Atin mekit a pamanlabag king aksesibilidad a WCAG AA. { $count } a pamanlabag king WCAG AA ing mekit. I-klik ban { $action ->
            [close] masara
           *[open] mabuklat
        } ing report ning aksesibilidad.
        [advisories] Alang mekit a pamanlabag king WCAG AA. { $count } a dagdag a rekomendasyon king aksesibilidad ing mekit. I-klik ban { $action ->
            [close] masara
           *[open] mabuklat
        } ing report ning aksesibilidad.
       *[clean] Alang mekit a pamanlabag king WCAG AA. I-klik ban { $action ->
            [close] masara
           *[open] mabuklat
        } ing report ning aksesibilidad.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Bersyon ning DoenetML { $version }

editor-tab-help = Saup a agpang king konteksto
editor-tab-help-short = Konteksto
editor-tab-errors = Kamalian
editor-tab-warnings = Babala
editor-tab-info = Impormasyon
editor-tab-accessibility = Aksesibilidad
editor-tab-responses = Mipadalang pakibat

editor-tab-with-count = { $label }: { $count }

editor-options = Deng opsyon ning editor
editor-format-as-doenetml = I-pormat antimong DoenetML
editor-format-as-xml = I-pormat antimong XML


## The diagnostics panel

editor-diagnostic-line = Gulis #{ $line }

editor-no-errors = Alang kamalian
editor-no-warnings = Alang babala
editor-no-info = Alang diagnostikong impormasyon

editor-show-info-annotations = Ipakit la reng diagnostikong impormasyon king editor
editor-show-accessibility-annotations = Ipakit la reng diagnostiko ning aksesibilidad king editor

editor-accessibility-learn-more = Pag-aralan nung makananu tinuki ing Doenet king aksesibilidad

editor-accessibility-violations-heading = Pamanlabag king aksesibilidad ({ $standard })

editor-accessibility-other-heading = Aliwa pang problema king aksesibilidad
editor-none-found = Alang mekit


## Submitted responses

editor-no-responses = Ala pang mipadalang pakibat
editor-response-answer-id = Id ning pakibat
editor-response-response = Pakibat
editor-response-credit = Kredito
editor-response-submitted = Mipadala


## The context-help panel

help-placeholder = Ilage ing kursor king lagyu ning tag, atributo, o { $ref } para king dokumentasyon.

help-unsupported-ref-chain = Ala pang suporta ing saup para karing referensiang dakal a dake anti ing { $example }.

help-unresolved-ref =
    { $reason ->
        [notFound] Alang mekit a tinuturu ning referensia: { $ref }.
        [multiple] Dakal a mekit a tinuturu ning referensia: { $ref }.
       *[indeterminate] Ali me-alaman ing tinuturu ning { $ref }.
    }

help-learn-about-references = Pag-aralan la reng referensia →
help-reference-page = Bulung ning referensia →

help-suggestions-header =
    { $location ->
        [inside] Kilub ning { $element }
       *[top] King kamaragulan a lebel
    }{ $allowed ->
        [none] { " — alang maylage keni." }
        [text] { " — manulat kang teksto keni." }
        [text-and-components] { " — manulat kang teksto keni, o subukan mu:" }
       *[components] { " — deng masubukan:" }
    }

help-suggestions-footer = Pindutan me ing { $shortcut } ban akit la reng eganagana a { $total } a komponente.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] Ing { $ref } metung yang referensia king { $target }.
       *[other] Ing { $ref } metung yang referensia king { $target } (gulis { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Dinala ne ning { $owner } antimong { $role }.
       *[other] Dinala ne ning { $owner } king gulis { $line } antimong { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] Ing { $ref } metung yang referensia king propyedad a { $property } ning { $element }.
       *[other] Ing { $ref } metung yang referensia king propyedad a { $property } ning { $element } (gulis { $line }).
    }

help-kind-attribute = atributo
help-kind-snippet = malating kodigo
help-kind-array-entry = entrada king array

help-default = Karaniwan:
help-active-default = Aktibong karaniwan:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Deng makatuldung alaga (metung kada bage):
       *[other] Deng makatuldung alaga:
    }

help-suggested-values = Deng misusuherinang alaga:

help-inserts = Maglalage:

# No select: «koordinado» is the same word for one and for many.
help-coordinates = Koordinado:

help-type = Klase:

help-resolved-style = Me-alaman a estilo (styleNumber { $styleNumber }):

help-resolved-function-names = Me-alaman a lagyu ning punsyon:
help-reset-list = Lista ning pamanibalik king input a ini:
help-added-on-input = Medagdag king input a ini:
help-removed-on-input = Me-alis king input a ini:

help-reset-overrides = Ing { $reset } salinan na ing { $additional } at { $removed }.
