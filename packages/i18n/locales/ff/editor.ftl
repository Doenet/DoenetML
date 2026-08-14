# Fula editor and language-server surfaces: the footer, the diagnostics panel,
# the variant picker, the accessibility button, and the context-help panel
# beside them. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# `WCAG`, `WCAG AA`, `DoenetML`, `XML` and `styleNumber` are names rather than
# words and stay as they stand.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Artir
       *[update] Hesɗitin
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } Kollirgal
       *[other] { $word } Kollirgal { $shortcut }
    }


## The variant picker

editor-variant = Sifaa

editor-variant-filter = Cuɓo…

editor-variant-next = Suɓo sifaa garowo

editor-variant-previous = Suɓo sifaa ɓennungo


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Yiyaama firtugol WCAG AA e yettagol. Ñoƴƴu ngam { $action ->
            [close] uddude
           *[open] udditde
        } raportu yettagol.
        [advisories] Ñoƴƴu ngam { $action ->
            [close] uddude
           *[open] udditde
        } raportu yettagol. Firtugol WCAG AA yiyaaka, kono waajuuji goɗɗi yettagol ina ngoodi.
       *[clean] Ñoƴƴu ngam { $action ->
            [close] uddude
           *[open] udditde
        } raportu yettagol. Caɗeele yettagol yiyaaka.
    }

editor-accessibility-label =
    { $status ->
        [violations] Yiyaama firtugol WCAG AA e yettagol. Yiyaama { $count ->
            [one] firtugol WCAG AA { $count }
           *[other] firtugol WCAG AA { $count }
        }. Ñoƴƴu ngam { $action ->
            [close] uddude
           *[open] udditde
        } raportu yettagol.
        [advisories] Firtugol WCAG AA yiyaaka. Yiyaama { $count ->
            [one] waaju goɗɗo yettagol { $count }
           *[other] waajuuji goɗɗi yettagol { $count }
        }. Ñoƴƴu ngam { $action ->
            [close] uddude
           *[open] udditde
        } raportu yettagol.
       *[clean] Firtugol WCAG AA yiyaaka. Ñoƴƴu ngam { $action ->
            [close] uddude
           *[open] udditde
        } raportu yettagol.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Sifaa DoenetML { $version }

editor-tab-help = Ballal nokku
editor-tab-help-short = Nokku
editor-tab-errors = Juumreeji
editor-tab-warnings = Reentinooje
editor-tab-info = Humpito
editor-tab-accessibility = Yettagol
editor-tab-responses = Jaabawuuji nelaaɗi

editor-tab-with-count = { $label }: { $count }

editor-options = Cuɓooje binndoowo
editor-format-as-doenetml = Toppito wano DoenetML
editor-format-as-xml = Toppito wano XML


## The diagnostics panel

editor-diagnostic-line = Diidol #{ $line }

editor-no-errors = Alaa Juumre
editor-no-warnings = Alaa Reentino
editor-no-info = Alaa Humpito

editor-show-info-annotations = Hollu humpito e binndoowo
editor-show-accessibility-annotations = Hollu reentinooje yettagol e binndoowo

editor-accessibility-learn-more = Ekkito no Doenet ƴeewrata yettagol

editor-accessibility-violations-heading = Firtugol yettagol ({ $standard })

editor-accessibility-other-heading = Caɗeele goɗɗe yettagol
editor-none-found = Hay huunde yiyaaka


## Submitted responses

editor-no-responses = Alaa jaabawuuji nelaaɗi haa jooni
editor-response-answer-id = Aydi Jaabawol
editor-response-response = Jaabawol
editor-response-credit = Nataaji
editor-response-submitted = Nelaama


## The context-help panel

help-placeholder = Waɗ kursoor e innde tag, e sifa, walla e { $ref } ngam heɓde ɗeri.

help-unsupported-ref-chain = Ballal joopagol geɗe keewɗe wano { $example } tawaaka tawo.

help-unresolved-ref =
    { $reason ->
        [notFound] Hay huunde yiyaaka e ngoo joopagol: { $ref }.
        [multiple] Piiji keewɗi njiyaama e ngoo joopagol: { $ref }.
       *[indeterminate] Ko { $ref } joopii waawaa anndeede.
    }

help-learn-about-references = Ekkito e baɗte joopagol →
help-reference-page = Hello joopagol →

help-suggestions-header =
    { $location ->
        [inside] Nder { $element }
       *[top] E dow fof
    }{ $allowed ->
        [none] { " — hay huunde yahataa ɗoo." }
        [text] { " — winndu ɗeri ɗoo." }
        [text-and-components] { " — winndu ɗeri ɗoo, walla eto:" }
       *[components] { " — piiji ɗi mbaawɗaa etaade:" }
    }

help-suggestions-footer = Ñoƴƴu { $shortcut } ngam yiyde geɗe fof { $total }.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } ko joopagol { $target }.
       *[other] { $ref } ko joopagol { $target } (diidol { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Addaama e { $owner } wano { $role }.
       *[other] Addaama e { $owner } e diidol { $line } wano { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } ko joopagol sifa { $property } e { $element }.
       *[other] { $ref } ko joopagol sifa { $property } e { $element } (diidol { $line }).
    }

help-kind-attribute = sifa
help-kind-snippet = taƴre
help-kind-array-entry = naatnugol e njuɓɓudi

help-default = Ko woowaa:
help-active-default = Ko woowaa golloowo:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Keeweeje jaɓaaɗe (wootere e kala huunde):
       *[other] Keeweeje jaɓaaɗe:
    }

help-suggested-values = Keeweeje waajaaɗe:

help-inserts = Ina naatna:

help-coordinates =
    { $count ->
        [one] Joopirgal:
       *[other] Joopirɗe:
    }

help-type = Sifaa:

help-resolved-style = Sifa yiyaaɗo (styleNumber { $styleNumber }):

help-resolved-function-names = Inɗe golle yiyaaɗe:
help-reset-list = Njuɓɓudi artiraandi e ngoo naatnugol:
help-added-on-input = Ko ɓeydaa e ngoo naatnugol:
help-removed-on-input = Ko ittaa e ngoo naatnugol:

help-reset-overrides = { $reset } ina ɓura { $additional } e { $removed }.
