# Hawaiian editor and language-server surfaces. Translated from
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
# Hawaiian marks number on the article rather than on the noun, so the counted
# messages here need no selection — see the header of `chrome.ftl`.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Hoʻihoʻi
       *[update] Hoʻohou
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } i ka mea nānā
       *[other] { $word } i ka mea nānā { $shortcut }
    }


## The variant picker

editor-variant = ʻAno
editor-variant-filter = Kānana...
editor-variant-next = E koho i ke ʻano aʻe
editor-variant-previous = E koho i ke ʻano mua


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Ua ʻike ʻia kahi kūʻē i ka hiki ke komo WCAG AA. E kaomi e { $action ->
            [close] pani
           *[open] wehe
        } i ka hōʻike hiki ke komo.
        [advisories] E kaomi e { $action ->
            [close] pani
           *[open] wehe
        } i ka hōʻike hiki ke komo. ʻAʻohe kūʻē WCAG AA i loaʻa, akā aia kekahi mau ʻōlelo aʻo hou.
       *[clean] E kaomi e { $action ->
            [close] pani
           *[open] wehe
        } i ka hōʻike hiki ke komo. ʻAʻohe pilikia i loaʻa.
    }

editor-accessibility-label =
    { $status ->
        [violations] Ua ʻike ʻia kahi kūʻē i ka hiki ke komo WCAG AA. Ua loaʻa { $count } kūʻē WCAG AA. E kaomi e { $action ->
            [close] pani
           *[open] wehe
        } i ka hōʻike hiki ke komo.
        [advisories] ʻAʻohe kūʻē WCAG AA i loaʻa. Ua loaʻa { $count } ʻōlelo aʻo hou. E kaomi e { $action ->
            [close] pani
           *[open] wehe
        } i ka hōʻike hiki ke komo.
       *[clean] ʻAʻohe kūʻē WCAG AA i loaʻa. E kaomi e { $action ->
            [close] pani
           *[open] wehe
        } i ka hōʻike hiki ke komo.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML mana { $version }

editor-tab-help = Kōkua ma ke kūlana
editor-tab-help-short = Kūlana
editor-tab-errors = Nā hewa
editor-tab-warnings = Nā ao
editor-tab-info = ʻIke
editor-tab-accessibility = Hiki ke komo
editor-tab-responses = Nā pane i hoʻouna ʻia

editor-tab-with-count = { $label }: { $count }

editor-options = Nā koho o ka mea hoʻoponopono
editor-format-as-doenetml = E hoʻonohonoho ma ke ʻano DoenetML
editor-format-as-xml = E hoʻonohonoho ma ke ʻano XML


## The diagnostics panel

editor-diagnostic-line = Lālani #{ $line }

editor-no-errors = ʻAʻohe hewa
editor-no-warnings = ʻAʻohe ao
editor-no-info = ʻAʻohe ʻike

editor-show-info-annotations = E hōʻike i nā ʻike ma ka mea hoʻoponopono
editor-show-accessibility-annotations = E hōʻike i nā ʻike hiki ke komo ma ka mea hoʻoponopono

editor-accessibility-learn-more = E aʻo pehea e nānā ai ʻo Doenet i ka hiki ke komo

editor-accessibility-violations-heading = Nā kūʻē i ka hiki ke komo ({ $standard })

editor-accessibility-other-heading = Nā pilikia hiki ke komo ʻē aʻe
editor-none-found = ʻAʻohe mea i loaʻa


## Submitted responses

editor-no-responses = ʻAʻohe pane i hoʻouna ʻia
editor-response-answer-id = Answer Id
editor-response-response = Pane
editor-response-credit = Helu
editor-response-submitted = Ua hoʻouna ʻia


## The context-help panel

help-placeholder = E kau i ka pekona ma kahi inoa tag, ʻano, a i ʻole { $ref } no ka palapala kōkua.

help-unsupported-ref-chain = ʻAʻole i kākoʻo ʻia ke kōkua no nā kuhikuhi māhele lehulehu e like me { $example }.

help-unresolved-ref =
    { $reason ->
        [notFound] ʻAʻohe mea i loaʻa i kuhikuhi ʻia e ke kuhikuhi: { $ref }.
        [multiple] He nui nā mea i loaʻa i kuhikuhi ʻia e ke kuhikuhi: { $ref }.
       *[indeterminate] ʻAʻole hiki ke hoʻoholo i ka mea i kuhikuhi ʻia e { $ref }.
    }

help-learn-about-references = E aʻo e pili ana i nā kuhikuhi →
help-reference-page = ʻAoʻao kuhikuhi →

help-suggestions-header =
    { $location ->
        [inside] I loko o { $element }
       *[top] Ma ka pae kiʻekiʻe loa
    }{ $allowed ->
        [none] { " — ʻaʻohe mea e kau ʻia ma ʻaneʻi." }
        [text] { " — e kākau i kikokikona ma ʻaneʻi." }
        [text-and-components] { " — e kākau i kikokikona ma ʻaneʻi, a i ʻole e hoʻāʻo:" }
       *[components] { " — nā mea e hoʻāʻo ai:" }
    }

help-suggestions-footer = E kaomi i ka { $shortcut } e ʻike i nā ʻāpana { $total } a pau.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] He kuhikuhi ka { $ref } i ka { $target }.
       *[other] He kuhikuhi ka { $ref } i ka { $target } (lālani { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Ua hoʻolauna ʻia e { $owner } ma ke ʻano he { $role }.
       *[other] Ua hoʻolauna ʻia e { $owner } ma ka lālani { $line } ma ke ʻano he { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] He kuhikuhi ka { $ref } i ka waiwai { $property } o ka { $element }.
       *[other] He kuhikuhi ka { $ref } i ka waiwai { $property } o ka { $element } (lālani { $line }).
    }

help-kind-attribute = ʻano
help-kind-snippet = ʻāpana pōkole
help-kind-array-entry = komo array

help-default = Maʻamau:
help-active-default = Maʻamau e hana nei:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Nā waiwai i ʻae ʻia (hoʻokahi no kēlā me kēia mea):
       *[other] Nā waiwai i ʻae ʻia:
    }

help-suggested-values = Nā waiwai i ʻōlelo ʻia:

help-inserts = Hoʻokomo:

help-coordinates = Nā kikoʻī:

help-type = ʻAno:

help-resolved-style = Kaila i hoʻoholo ʻia (styleNumber { $styleNumber }):

help-resolved-function-names = Nā inoa hana i hoʻoholo ʻia:
help-reset-list = Papa inoa hoʻihoʻi ma kēia komo:
help-added-on-input = Ua hoʻohui ʻia ma kēia komo:
help-removed-on-input = Ua wehe ʻia mai kēia komo:

help-reset-overrides = Ke hoʻokau nei ka { $reset } ma luna o ka { $additional } a me ka { $removed }.
