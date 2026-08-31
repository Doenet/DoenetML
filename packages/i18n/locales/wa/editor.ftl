# Walloon (walon) editor and language-server surfaces. Translated from
# `locales/en/editor.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script and orthography.** Latin script, in the *rifondou walon* unified
# spelling, as `chrome.ftl` sets it out. The **Feller system** is the
# alternative and none of it is mixed in here.
#
# `WCAG AA`, `DoenetML`, `XML`, `styleNumber` and every attribute or element
# name are identifiers, not prose, and stay as written.
#
# **What is Walloon's own.** The imperative is the 2nd person plural in
# `-ez` / `-oz` / `-îz` that Walloon addresses a reader with: «Clitchîz»,
# «Metoz», «Tapez», «Mostrer». «håyner» (to display) and «clitchî» (to click)
# are the Walloon software-localisation register, and «modêye» is that
# register's word for a version. The connectives and function words are
# Walloon: «nén» (the postposed negator), «pont d'» / «nou» / «nole» for
# *no…*, «po» for *in order to*, «so» for *on*, «inte» for *between»,
# «å dvins di» for *inside*, «passe divant» for *overrides*, «co» for *yet*.
# «aroke» is the Walloon word for an error and «racsegne» for a piece of
# information.
#
# **What is borrowed.** The editorial and accessibility vocabulary is French
# respelled: «variante», «filtrer», «accessibilité», «violåcion»,
# «recomandåcion», «rapoirt», «contecse», «infôrmåcion», «referince»,
# «proprieté», «coordonêye», «documintåcion», «atribut». Two entries are the
# weakest in the file: «cwårea» for an array (an extension of the ordinary
# Walloon word for a square/panel) and «bokèt» for a snippet.
#
# **Counts.** CLDR has its own plural data for `wa`, with two categories,
# `one` and `other`, and Walloon's `one` covers zero as well as one. The two
# counted messages here — `editor-accessibility-label` and
# `help-coordinates` — keep the English `[one]`/`*[other]` shape, because
# Walloon writes its plural («ene violåcion» / «des violåcions»,
# «Coordonêye» / «Coordonêyes»).
#
# Walloon punctuates as French does, with a space before `:`, `;`, `?` and
# `!`. That spacing belongs to this catalog and is written out here.
#
# **Weakest first.** A reviewer should attack «cwårea» and «bokèt», then the
# context-help sentences, which are the longest prose in the four files.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Renonder
       *[update] Mete a djoû
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } l' håyneu
       *[other] { $word } l' håyneu { $shortcut }
    }


## The variant picker

editor-variant = Variante
editor-variant-filter = Filtrer…
editor-variant-next = Tchoezi l' variante shuvante
editor-variant-previous = Tchoezi l' variante di dvant


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] On-z a trové ene violåcion di l' accessibilité WCAG AA. Clitchîz po { $action ->
            [close] serer
           *[open] drovi
        } li rapoirt d' accessibilité.
        [advisories] Clitchîz po { $action ->
            [close] serer
           *[open] drovi
        } li rapoirt d' accessibilité. Nole violåcion WCAG AA n' a stî trovêye, mins gn a d' ôtes recomandåcions d' accessibilité.
       *[clean] Clitchîz po { $action ->
            [close] serer
           *[open] drovi
        } li rapoirt d' accessibilité. Nou problinme d' accessibilité n' a stî trové.
    }

editor-accessibility-label =
    { $status ->
        [violations] On-z a trové ene violåcion di l' accessibilité WCAG AA. { $count ->
            [one] { $count } violåcion WCAG AA di trovêye
           *[other] { $count } violåcions WCAG AA di trovêyes
        }. Clitchîz po { $action ->
            [close] serer
           *[open] drovi
        } li rapoirt d' accessibilité.
        [advisories] Nole violåcion WCAG AA n' a stî trovêye. { $count ->
            [one] { $count } recomandåcion d' accessibilité di pus di trovêye
           *[other] { $count } recomandåcions d' accessibilité di pus di trovêyes
        }. Clitchîz po { $action ->
            [close] serer
           *[open] drovi
        } li rapoirt d' accessibilité.
       *[clean] Nole violåcion WCAG AA n' a stî trovêye. Clitchîz po { $action ->
            [close] serer
           *[open] drovi
        } li rapoirt d' accessibilité.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Modêye DoenetML { $version }

editor-tab-help = Aidance sorlon l' contecse
editor-tab-help-short = Contecse
editor-tab-errors = Arokes
editor-tab-warnings = Adviertixhmints
editor-tab-info = Infôrmåcions
editor-tab-accessibility = Accessibilité
editor-tab-responses = Responses evoyeyes

editor-tab-with-count = { $label } : { $count }

editor-options = Tchuzes di l' aspougneu
editor-format-as-doenetml = Mete e cogne come DoenetML
editor-format-as-xml = Mete e cogne come XML


## The diagnostics panel

editor-diagnostic-line = Roye n° { $line }

editor-no-errors = Nole aroke
editor-no-warnings = Nou adviertixhmint
editor-no-info = Nou messaedje d' infôrmåcion

editor-show-info-annotations = Mostrer les messaedjes d' infôrmåcion dins l' aspougneu
editor-show-accessibility-annotations = Mostrer les messaedjes d' accessibilité dins l' aspougneu

editor-accessibility-learn-more = Vey comint çk' i Doenet prind l' accessibilité

editor-accessibility-violations-heading = Violåcions di l' accessibilité ({ $standard })

editor-accessibility-other-heading = Ôtes problinmes d' accessibilité
editor-none-found = Rén d' trové


## Submitted responses

editor-no-responses = Nole response evoyeye disk' asteure
editor-response-answer-id = Id del response
editor-response-response = Response
editor-response-credit = Ponts
editor-response-submitted = Evoyeye


## The context-help panel

help-placeholder = Metoz l' cursoe so on no d' balize, on atribut ou { $ref } po vey li documintåcion.

help-unsupported-ref-chain = L' aidance po les referinces a pus d' ene pårt come { $example } n' est nén co sopoirtêye.

help-unresolved-ref =
    { $reason ->
        [notFound] Nou referint di trové pol referince : { $ref }.
        [multiple] Sacwants referints di trovés pol referince : { $ref }.
       *[indeterminate] On n' a nén polou dire li referint di { $ref }.
    }

help-learn-about-references = Endè saveur di pus so les referinces →
help-reference-page = Pådje di referince →

help-suggestions-header =
    { $location ->
        [inside] Å dvins d' { $element }
       *[top] Å pus hôt livtea
    }{ $allowed ->
        [none] { " — i n' va rén chal." }
        [text] { " — tapez do tecse chal." }
        [text-and-components] { " — tapez do tecse chal, ou sayîz :" }
       *[components] { " — sacwès a sayî :" }
    }

help-suggestions-footer = Tapez { $shortcut } po vey les { $total } componints.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } est ene referince a { $target }.
       *[other] { $ref } est ene referince a { $target } (roye { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Metou e plaece pa { $owner } come { $role }.
       *[other] Metou e plaece pa { $owner } al roye { $line } come { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } est ene referince al proprieté { $property } di { $element }.
       *[other] { $ref } est ene referince al proprieté { $property } di { $element } (roye { $line }).
    }

help-kind-attribute = atribut
help-kind-snippet = bokèt
help-kind-array-entry = intrêye di cwårea

help-default = Valeur prémetowe :
help-active-default = Valeur prémetowe en alaedje :

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Valeurs permises (ene pa cayet) :
       *[other] Valeurs permises :
    }

help-suggested-values = Valeurs propôzêyes :

help-inserts = Mete e plaece :

help-coordinates =
    { $count ->
        [one] Coordonêye :
       *[other] Coordonêyes :
    }

help-type = Type :

help-resolved-style = Stîle rzoû (styleNumber { $styleNumber }) :

help-resolved-function-names = Nos d' fonccions rzoûs :
help-reset-list = Djîveye di renondaedje so ç' tchamp chal :
help-added-on-input = Radjouté so ç' tchamp chal :
help-removed-on-input = Oisté so ç' tchamp chal :

help-reset-overrides = { $reset } passe divant { $additional } et { $removed }.
