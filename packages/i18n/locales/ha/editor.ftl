# Hausa editor and language-server surfaces. Translated from
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
# Hausa has a single plural category, so a countable message needs no
# selection.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Sake Saita
       *[update] Sabunta
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } Mai Nunawa
       *[other] { $word } Mai Nunawa { $shortcut }
    }


## The variant picker

editor-variant = Nau'i
editor-variant-filter = Tace...
editor-variant-next = Zaɓi nau'i na gaba
editor-variant-previous = Zaɓi nau'i na baya


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] An gano take haƙƙin samun damar WCAG AA. Danna don { $action ->
            [close] rufe
           *[open] buɗe
        } rahoton samun dama.
        [advisories] Danna don { $action ->
            [close] rufe
           *[open] buɗe
        } rahoton samun dama. Ba a sami take haƙƙin WCAG AA ba, amma akwai ƙarin shawarwarin samun dama.
       *[clean] Danna don { $action ->
            [close] rufe
           *[open] buɗe
        } rahoton samun dama. Ba a sami matsalar samun dama ba.
    }

editor-accessibility-label =
    { $status ->
        [violations] An gano take haƙƙin samun damar WCAG AA. An sami take haƙƙin WCAG AA { $count }. Danna don { $action ->
            [close] rufe
           *[open] buɗe
        } rahoton samun dama.
        [advisories] Ba a gano take haƙƙin WCAG AA ba. An sami ƙarin shawarar samun dama { $count }. Danna don { $action ->
            [close] rufe
           *[open] buɗe
        } rahoton samun dama.
       *[clean] Ba a gano take haƙƙin WCAG AA ba. Danna don { $action ->
            [close] rufe
           *[open] buɗe
        } rahoton samun dama.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Sigar DoenetML { $version }

editor-tab-help = Taimako bisa yanayin da ake ciki
editor-tab-help-short = Yanayi
editor-tab-errors = Kurakurai
editor-tab-warnings = Gargaɗi
editor-tab-info = Bayani
editor-tab-accessibility = Samun dama
editor-tab-responses = Amsoshin da aka aika

editor-tab-with-count = { $label }: { $count }

editor-options = Zaɓuɓɓukan mai gyara
editor-format-as-doenetml = Tsara a matsayin DoenetML
editor-format-as-xml = Tsara a matsayin XML


## The diagnostics panel

editor-diagnostic-line = Layi #{ $line }

editor-no-errors = Babu Kurakurai
editor-no-warnings = Babu Gargaɗi
editor-no-info = Babu Binciken Bayani

editor-show-info-annotations = Nuna binciken bayani a cikin mai gyara
editor-show-accessibility-annotations = Nuna binciken samun dama a cikin mai gyara

editor-accessibility-learn-more = Koyi yadda Doenet ke duban samun dama

editor-accessibility-violations-heading = Take haƙƙin samun dama ({ $standard })

editor-accessibility-other-heading = Sauran matsalolin samun dama
editor-none-found = Ba a sami komai ba


## Submitted responses

editor-no-responses = Ba a aika amsa ba tukuna
editor-response-answer-id = Lambar Amsa
editor-response-response = Amsa
editor-response-credit = Maki
editor-response-submitted = An aika


## The context-help panel

help-placeholder = Sanya siginan kwamfuta a kan sunan tag, sifa ko { $ref } don samun takardun bayani.

help-unsupported-ref-chain = Ba a tallafa wa taimako ga nassoshi masu sassa da yawa kamar { $example } ba tukuna.

help-unresolved-ref =
    { $reason ->
        [notFound] Ba a sami abin da ake nufi ba ga nassi: { $ref }.
        [multiple] An sami abubuwa da yawa da ake nufi ga nassi: { $ref }.
       *[indeterminate] Ba a iya tantance abin da { $ref } ke nufi ba.
    }

help-learn-about-references = Koyi game da nassoshi →
help-reference-page = Shafin nassoshi →

help-suggestions-header =
    { $location ->
        [inside] A cikin { $element }
       *[top] A matakin sama
    }{ $allowed ->
        [none] { " — babu abin da ke shiga nan." }
        [text] { " — rubuta rubutu nan." }
        [text-and-components] { " — rubuta rubutu nan, ko a gwada:" }
       *[components] { " — abubuwan da za a gwada:" }
    }

help-suggestions-footer = Danna { $shortcut } don ganin dukkan sassa { $total }.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } nassi ne ga { $target }.
       *[other] { $ref } nassi ne ga { $target } (layi { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } ne ya gabatar da shi a matsayin { $role }.
       *[other] { $owner } ne ya gabatar da shi a layi { $line } a matsayin { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } nassi ne ga sifar { $property } ta { $element }.
       *[other] { $ref } nassi ne ga sifar { $property } ta { $element } (layi { $line }).
    }

help-kind-attribute = sifa
help-kind-snippet = gutsure
help-kind-array-entry = shigarwar jeri

help-default = Tsoho:
help-active-default = Tsohon da ke aiki:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Ƙimomin da aka yarda da su (ɗaya ga kowane abu):
       *[other] Ƙimomin da aka yarda da su:
    }

help-suggested-values = Ƙimomin da aka shawarta:

help-inserts = Yana shigar da:

help-coordinates = Matsayi:

help-type = Nau'i:

help-resolved-style = Salon da aka tantance (styleNumber { $styleNumber }):

help-resolved-function-names = Sunayen ayyuka da aka tantance:
help-reset-list = Jerin da ake sake saitawa a wannan shigarwa:
help-added-on-input = Abin da aka ƙara a wannan shigarwa:
help-removed-on-input = Abin da aka cire a wannan shigarwa:

help-reset-overrides = { $reset } yana rinjayar { $additional } da { $removed }.
