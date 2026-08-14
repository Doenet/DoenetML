# Baoulé editor and language-server surfaces. Translated from
# `locales/en/editor.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# See `content.ftl`'s header for orthography, plural-category behaviour, the
# Akan/Twi agreement comparison, the verbal-morphology caveat, and the
# vocabulary/loanword policy.
#
# `WCAG AA`, `DoenetML`, `XML`, `styleNumber` and every attribute or element
# name are identifiers, not prose, and stay as written.
#
# `help-coordinates` is the one counted message here, and it counts a noun
# invariable for number in Baoulé, so its select collapses to one wording, the
# same reason `diagnostics.ftl`'s header gives for its own collapsed selects.
#
# A line of the author's source is a «layin», the loan the editor's own users
# say, and not «liɲ», which `content.ftl` keeps for the geometric line a
# document draws.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] San Yo I
       *[update] Yo I Uflɛ
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } Kyerɛfuɛ'n
       *[other] { $word } Kyerɛfuɛ'n { $shortcut }
    }


## The variant picker

editor-variant = Varyan
editor-variant-filter = Yi mun...
editor-variant-next = Yi varyan ng'ɔ o su'n
editor-variant-previous = Yi varyan ng'ɔ o ɲrun'n


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Be wunnin WCAG AA nun-tinlɛ mmara mɔ b'a fiman i su. Kli i naan ɔ { $action ->
            [close] kata
           *[open] bue
        } nun-tinlɛ rapɔ'n.
        [advisories] Kli i naan ɔ { $action ->
            [close] kata
           *[open] bue
        } nun-tinlɛ rapɔ'n. B'a wunman WCAG AA mmara mɔ b'a fiman i su fi, sanngɛ afɔtuɛ uflɛ wie wɔ nun-tinlɛ ndɛ'n nun.
       *[clean] Kli i naan ɔ { $action ->
            [close] kata
           *[open] bue
        } nun-tinlɛ rapɔ'n. B'a wunman nun-tinlɛ sa fi.
    }

editor-accessibility-label =
    { $status ->
        [violations] Be wunnin WCAG AA nun-tinlɛ mmara mɔ b'a fiman i su. Be wunnin WCAG AA mmara { $count } mɔ b'a fiman i su. Kli i naan ɔ { $action ->
            [close] kata
           *[open] bue
        } nun-tinlɛ rapɔ'n.
        [advisories] B'a wunman WCAG AA mmara mɔ b'a fiman i su fi. Be wunnin nun-tinlɛ afɔtuɛ uflɛ { $count }. Kli i naan ɔ { $action ->
            [close] kata
           *[open] bue
        } nun-tinlɛ rapɔ'n.
       *[clean] B'a wunman WCAG AA mmara mɔ b'a fiman i su fi. Kli i naan ɔ { $action ->
            [close] kata
           *[open] bue
        } nun-tinlɛ rapɔ'n.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML nglɛlɛ { $version }

editor-tab-help = Ndɛ mɔ ɔ fata asɔnun'n
editor-tab-help-short = Ndɛ
editor-tab-errors = Sa tɛ mun
editor-tab-warnings = Kɔkɔlɛ mun
editor-tab-info = Ndɛ
editor-tab-accessibility = Nun-tinlɛ
editor-tab-responses = Tɛlɛ mɔ be fa mannin

editor-tab-with-count = { $label }: { $count }

editor-options = Kyerɛfuɛ'n i sɛsalɛ
editor-format-as-doenetml = Sɛsa i kɛ DoenetML sa
editor-format-as-xml = Sɛsa i kɛ XML sa


## The diagnostics panel

editor-diagnostic-line = Layin #{ $line }

editor-no-errors = Sa Tɛ Fi Nunman
editor-no-warnings = Kɔkɔlɛ Fi Nunman
editor-no-info = Ndɛ Nglɛlɛ Fi Nunman

editor-show-info-annotations = Kle ndɛ nglɛlɛ wɔ kyerɛfuɛ'n nun
editor-show-accessibility-annotations = Kle nun-tinlɛ nglɛlɛ wɔ kyerɛfuɛ'n nun

editor-accessibility-learn-more = Suan wafa ng'ɔ Doenet di nun-tinlɛ junman'n niɔn

editor-accessibility-violations-heading = Nun-tinlɛ mmara mɔ b'a fiman i su ({ $standard })

editor-accessibility-other-heading = Nun-tinlɛ ndɛ uflɛ mun
editor-none-found = B'a wunman hwe


## Submitted responses

editor-no-responses = Tɛlɛ fi w'a fiman likawlɛ
editor-response-answer-id = Tɛlɛ i endisi
editor-response-response = Tɛlɛ
editor-response-credit = Nsɛkyerɛ
editor-response-submitted = Be fali i mannin


## The context-help panel

help-placeholder = Fa kɔsɔ'n sie tagi dunman, atribi, annzɛ { $ref } su naan a nya nglɛlɛ.

help-unsupported-ref-chain = Ɔ kwlá-man man ndɛ mma referans mɔ ɔ wɔ akpasua kpanngban kɛ { $example } sa.

help-unresolved-ref =
    { $reason ->
        [notFound] B'a wunman deɛ referans nga kle i: { $ref }.
        [multiple] Be wunnin like kpanngban mɔ referans nga kle be: { $ref }.
       *[indeterminate] B'a kwlá-man si deɛ { $ref } kle i.
    }

help-learn-about-references = Suan referans mun be ndɛ →
help-reference-page = Referans i fluwa-bue →

help-suggestions-header =
    { $location ->
        [inside] { $element } i wun lɔ
       *[top] Osu likawlɛ
    }{ $allowed ->
        [none] { " — hwe kwlá-man ba ha." }
        [text] { " — klɛ nkyerɛwde ha." }
        [text-and-components] { " — klɛ nkyerɛwde ha, annzɛ maan yeinom:" }
       *[components] { " — like mɔ a kwla maan:" }
    }

help-suggestions-footer = Kli { $shortcut } naan a wun like { $total } kwlaa.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } ti { $target } i referans.
       *[other] { $ref } ti { $target } i referans (layin { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } yɛ ɔ toli i dunman kɛ { $role } niɔn.
       *[other] { $owner } yɛ ɔ toli i dunman wɔ layin { $line } su kɛ { $role } niɔn.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } ti { $element } i su { $property } i referans.
       *[other] { $ref } ti { $element } i su { $property } i referans (layin { $line }).
    }

help-kind-attribute = atribi
help-kind-snippet = nkyerɛwde-kaan
help-kind-array-entry = tablo nun like

help-default = Deɛ ɔ o osu:
help-active-default = Deɛ ɔ o osu mɔ ɔ o junman nun:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Valè mɔ be maan i kwan (kunngba mma like kwlaa):
       *[other] Valè mɔ be maan i kwan:
    }

help-suggested-values = Valè mɔ be kamfoli:

help-inserts = Ɔ fa ba nun:

help-coordinates = Nzɔliɛ:

help-type = Wafa:

help-resolved-style = Nsiesielɛ mɔ b'a wunnin i (styleNumber { $styleNumber }):

help-resolved-function-names = Fɔnksiɔn dunman mɔ b'a wunnin be:
help-reset-list = Nhwehwɛmu mɔ ɔ san yo uflɛ wɔ input nga su:
help-added-on-input = Deɛ be fa kannin i su wɔ input nga su:
help-removed-on-input = Deɛ be yili i nun wɔ input nga su:

help-reset-overrides = { $reset } tra { $additional } nin { $removed } be su.
