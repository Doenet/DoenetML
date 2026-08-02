# Hmong Njua editor and language-server surfaces. Translated from
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
# Hmong does not inflect for number, so a countable message needs no selection.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Rov pib dua
       *[update] Hloov kho
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } qhov saib
       *[other] { $word } qhov saib { $shortcut }
    }


## The variant picker

editor-variant = Hom
editor-variant-filter = Lim...
editor-variant-next = Xaiv hom tom ntej
editor-variant-previous = Xaiv hom yav tas


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Pom kev ua txhaum WCAG AA txog kev nkag tau. Nias los { $action ->
            [close] kaw
           *[open] qhib
        } daim ntawv qhia txog kev nkag tau.
        [advisories] Nias los { $action ->
            [close] kaw
           *[open] qhib
        } daim ntawv qhia txog kev nkag tau. Tsis pom kev ua txhaum WCAG AA, tiam sis muaj lwm cov lus taw qhia txog kev nkag tau.
       *[clean] Nias los { $action ->
            [close] kaw
           *[open] qhib
        } daim ntawv qhia txog kev nkag tau. Tsis pom teeb meem txog kev nkag tau.
    }

editor-accessibility-label =
    { $status ->
        [violations] Pom kev ua txhaum WCAG AA txog kev nkag tau. Pom { $count } qhov ua txhaum WCAG AA. Nias los { $action ->
            [close] kaw
           *[open] qhib
        } daim ntawv qhia txog kev nkag tau.
        [advisories] Tsis pom kev ua txhaum WCAG AA. Pom { $count } lo lus taw qhia ntxiv txog kev nkag tau. Nias los { $action ->
            [close] kaw
           *[open] qhib
        } daim ntawv qhia txog kev nkag tau.
       *[clean] Tsis pom kev ua txhaum WCAG AA. Nias los { $action ->
            [close] kaw
           *[open] qhib
        } daim ntawv qhia txog kev nkag tau.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML tus lej { $version }

editor-tab-help = Kev pab raws li qhov chaw
editor-tab-help-short = Qhov chaw
editor-tab-errors = Kev yuam kev
editor-tab-warnings = Ceeb toom
editor-tab-info = Lus qhia
editor-tab-accessibility = Kev nkag tau
editor-tab-responses = Cov lus teb xa lawm

editor-tab-with-count = { $label }: { $count }

editor-options = Cov kev xaiv rau tus kws kho
editor-format-as-doenetml = Ua raws DoenetML
editor-format-as-xml = Ua raws XML


## The diagnostics panel

editor-diagnostic-line = Kab { $line }

editor-no-errors = Tsis muaj kev yuam kev
editor-no-warnings = Tsis muaj ceeb toom
editor-no-info = Tsis muaj lus qhia

editor-show-info-annotations = Qhia cov lus qhia hauv tus kws kho
editor-show-accessibility-annotations = Qhia cov lus txog kev nkag tau hauv tus kws kho

editor-accessibility-learn-more = Kawm txog Doenet txoj kev saib xyuas kev nkag tau

editor-accessibility-violations-heading = Kev ua txhaum txog kev nkag tau ({ $standard })

editor-accessibility-other-heading = Lwm cov teeb meem txog kev nkag tau
editor-none-found = Tsis pom ib qho


## Submitted responses

editor-no-responses = Tsis tau muaj cov lus teb xa
editor-response-answer-id = Lus teb Id
editor-response-response = Lus teb
editor-response-credit = Cov ntsiab
editor-response-submitted = Xa lawm


## The context-help panel

help-placeholder = Muab tus cursor tso rau saum lub npe tag, sifo, los yog { $ref } kom pom cov ntaub ntawv qhia.

help-unsupported-ref-chain = Tseem tsis tau muaj kev pab rau cov tswv yim ntau feem li { $example }.

help-unresolved-ref =
    { $reason ->
        [notFound] Tsis pom qhov uas hais txog rau: { $ref }.
        [multiple] Pom ntau qhov uas hais txog rau: { $ref }.
       *[indeterminate] Tsis tau paub qhov uas { $ref } hais txog.
    }

help-learn-about-references = Kawm ntxiv txog cov tswv yim →
help-reference-page = Nplooj ntawv qhia →

help-suggestions-header =
    { $location ->
        [inside] Hauv { $element }
       *[top] Nyob saum toj kawg nkaus
    }{ $allowed ->
        [none] { " — tsis muaj dab tsi mus rau ntawm no." }
        [text] { " — sau ntawv rau ntawm no." }
        [text-and-components] { " — sau ntawv rau ntawm no, los yog sim:" }
       *[components] { " — sim cov no:" }
    }

help-suggestions-footer = Nias { $shortcut } kom pom tag nrho { $total } feem.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } yog ib qho hais txog { $target }.
       *[other] { $ref } yog ib qho hais txog { $target } (kab { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } tau coj los ua { $role }.
       *[other] { $owner } tau coj los ntawm kab { $line } ua { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } yog ib qho hais txog { $element } qhov { $property }.
       *[other] { $ref } yog ib qho hais txog { $element } qhov { $property } (kab { $line }).
    }

help-kind-attribute = sifo
help-kind-snippet = ib nrab ntawv
help-kind-array-entry = ib qho hauv cov npe

help-default = Tus nqi ib txwm:
help-active-default = Tus nqi ib txwm siv:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Cov nqi tso cai (ib qho rau ib yam):
       *[other] Cov nqi tso cai:
    }

help-suggested-values = Cov nqi taw qhia:

help-inserts = Ntxiv:

help-coordinates = Cov taw qhia chaw:

help-type = Hom:

help-resolved-style = Tus qauv teev tseg (styleNumber { $styleNumber }):

help-resolved-function-names = Cov npe haujlwm teev tseg:
help-reset-list = Cov npe rov pib dua ntawm qhov no:
help-added-on-input = Ntxiv rau ntawm qhov no:
help-removed-on-input = Tshem tawm ntawm qhov no:

help-reset-overrides = { $reset } hla { $additional } thiab { $removed }.
