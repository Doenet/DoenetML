# Samoan editor and language-server surfaces. Translated from
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
# A Samoan noun takes no ending for number, so the counted messages here need
# no selection — see the header of `chrome.ftl`.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Toe faʻatulaga
       *[update] Faʻafou
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } le tagata vaʻai
       *[other] { $word } le tagata vaʻai { $shortcut }
    }


## The variant picker

editor-variant = Ituaiga
editor-variant-filter = Faʻamama...
editor-variant-next = Filifili le ituaiga sosoʻo
editor-variant-previous = Filifili le ituaiga muamua


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Ua maua se solitulafono i avanoa faigofie WCAG AA. Kiliki e { $action ->
            [close] tapuni
           *[open] tatala
        } le lipoti o avanoa faigofie.
        [advisories] Kiliki e { $action ->
            [close] tapuni
           *[open] tatala
        } le lipoti o avanoa faigofie. E leai se solitulafono WCAG AA na maua, ae o loʻo iai ni fautuaga faʻaopoopo.
       *[clean] Kiliki e { $action ->
            [close] tapuni
           *[open] tatala
        } le lipoti o avanoa faigofie. E leai se faʻafitauli na maua.
    }

editor-accessibility-label =
    { $status ->
        [violations] Ua maua se solitulafono i avanoa faigofie WCAG AA. E { $count } solitulafono WCAG AA na maua. Kiliki e { $action ->
            [close] tapuni
           *[open] tatala
        } le lipoti o avanoa faigofie.
        [advisories] E leai se solitulafono WCAG AA na maua. E { $count } fautuaga faʻaopoopo na maua. Kiliki e { $action ->
            [close] tapuni
           *[open] tatala
        } le lipoti o avanoa faigofie.
       *[clean] E leai se solitulafono WCAG AA na maua. Kiliki e { $action ->
            [close] tapuni
           *[open] tatala
        } le lipoti o avanoa faigofie.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML lomiga { $version }

editor-tab-help = Fesoasoani e tusa ma le tulaga
editor-tab-help-short = Tulaga
editor-tab-errors = Mea sesē
editor-tab-warnings = Lapataʻiga
editor-tab-info = Faʻamatalaga
editor-tab-accessibility = Avanoa faigofie
editor-tab-responses = Tali ua lafo

editor-tab-with-count = { $label }: { $count }

editor-options = Filifiliga o le ētita
editor-format-as-doenetml = Faʻatulaga e pei o le DoenetML
editor-format-as-xml = Faʻatulaga e pei o le XML


## The diagnostics panel

editor-diagnostic-line = Laina #{ $line }

editor-no-errors = E leai ni mea sesē
editor-no-warnings = E leai ni lapataʻiga
editor-no-info = E leai ni faʻamatalaga

editor-show-info-annotations = Faʻaali faʻamatalaga i le ētita
editor-show-accessibility-annotations = Faʻaali faʻailoga o avanoa faigofie i le ētita

editor-accessibility-learn-more = Aʻoaʻo pe faʻapefea ona vaʻai Doenet i avanoa faigofie

editor-accessibility-violations-heading = Solitulafono i avanoa faigofie ({ $standard })

editor-accessibility-other-heading = Isi faʻafitauli o avanoa faigofie
editor-none-found = E leai se mea na maua


## Submitted responses

editor-no-responses = E leʻi lafo mai se tali
editor-response-answer-id = Answer Id
editor-response-response = Tali
editor-response-credit = Togi
editor-response-submitted = Na lafo


## The context-help panel

help-placeholder = Tuʻu le kesa i luga o se igoa tag, uiga, poʻo le { $ref } mo faʻamatalaga.

help-unsupported-ref-chain = E leʻi lagolagoina le fesoasoani mo faʻasinomaga e tele vaega e pei o le { $example }.

help-unresolved-ref =
    { $reason ->
        [notFound] E leai se mea na maua e faʻasino i ai le faʻasinomaga: { $ref }.
        [multiple] E tele mea na maua e faʻasino i ai le faʻasinomaga: { $ref }.
       *[indeterminate] E lē mafai ona faʻamaoti le mea e faʻasino i ai le { $ref }.
    }

help-learn-about-references = Aʻoaʻo e uiga i faʻasinomaga →
help-reference-page = Itulau faʻasinomaga →

help-suggestions-header =
    { $location ->
        [inside] I totonu o le { $element }
       *[top] I le tulaga pito i luga
    }{ $allowed ->
        [none] { " — e leai se mea e mafai ona tuʻu iinei." }
        [text] { " — taina se tusitusiga iinei." }
        [text-and-components] { " — taina se tusitusiga iinei, pe taumafai:" }
       *[components] { " — mea e mafai ona taumafai:" }
    }

help-suggestions-footer = Oomi le { $shortcut } e vaʻai ai i vaega uma e { $total }.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] O le { $ref } o se faʻasinomaga i le { $target }.
       *[other] O le { $ref } o se faʻasinomaga i le { $target } (laina { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Na faʻailoa mai e { $owner } o se { $role }.
       *[other] Na faʻailoa mai e { $owner } i le laina { $line } o se { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] O le { $ref } o se faʻasinomaga i le uiga { $property } o le { $element }.
       *[other] O le { $ref } o se faʻasinomaga i le uiga { $property } o le { $element } (laina { $line }).
    }

help-kind-attribute = uiga
help-kind-snippet = vaega puupuu
help-kind-array-entry = ulufale array

help-default = Masani:
help-active-default = Masani o loʻo faʻaaogāina:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Tau e faʻatagaina (tasi mo mea taitasi):
       *[other] Tau e faʻatagaina:
    }

help-suggested-values = Tau e fautuaina:

help-inserts = E faʻaofi:

help-coordinates = Faʻasinomaga tulaga:

help-type = Ituaiga:

help-resolved-style = Sitaili ua faʻamaoti (styleNumber { $styleNumber }):

help-resolved-function-names = Igoa galuega ua faʻamaoti:
help-reset-list = Lisi toe faʻatulaga i lenei faʻaofiga:
help-added-on-input = Na faʻaopoopo i lenei faʻaofiga:
help-removed-on-input = Na aveʻese mai lenei faʻaofiga:

help-reset-overrides = E sili le { $reset } i le { $additional } ma le { $removed }.
