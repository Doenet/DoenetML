# Akan editor and language-server surfaces. Translated from
# `locales/en/editor.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Written in Asante Twi, as `content.ftl`'s header sets out.
#
# `WCAG AA`, `DoenetML`, `XML`, `styleNumber` and every attribute or element
# name are identifiers, not prose, and stay as written.
#
# The nouns the counted messages here count are invariable for number, so those
# selects are dropped — the same reason `chrome.ftl` gives.
#
# A line of the author's source is called a «layin», the loan the editor's own
# users say, and not «nsensanee», which `content.ftl` keeps for the geometric
# line a document draws.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] San Yɛ
       *[update] Yɛ No Foforɔ
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } Kyerɛfoɔ No
       *[other] { $word } Kyerɛfoɔ No { $shortcut }
    }


## The variant picker

editor-variant = Suban
editor-variant-filter = Yi mu...
editor-variant-next = Yi suban a ɛdi soɔ
editor-variant-previous = Yi suban a ɛdi kan


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Wɔahunu WCAG AA nkɔmu-kwan ho mmara a wɔabu so. Mia na { $action ->
            [close] to
           *[open] bue
        } nkɔmu-kwan amanneɛbɔ no mu.
        [advisories] Mia na { $action ->
            [close] to
           *[open] bue
        } nkɔmu-kwan amanneɛbɔ no mu. Wɔanhunu WCAG AA mmara a wɔabu so biara, nanso afotuo foforɔ wɔ nkɔmu-kwan ho.
       *[clean] Mia na { $action ->
            [close] to
           *[open] bue
        } nkɔmu-kwan amanneɛbɔ no mu. Wɔanhunu nkɔmu-kwan ho ɔhaw biara.
    }

editor-accessibility-label =
    { $status ->
        [violations] Wɔahunu WCAG AA nkɔmu-kwan ho mmara a wɔabu so. Wɔahunu WCAG AA mmara a wɔabu so { $count }. Mia na { $action ->
            [close] to
           *[open] bue
        } nkɔmu-kwan amanneɛbɔ no mu.
        [advisories] Wɔanhunu WCAG AA mmara a wɔabu so biara. Wɔahunu nkɔmu-kwan ho afotuo foforɔ { $count }. Mia na { $action ->
            [close] to
           *[open] bue
        } nkɔmu-kwan amanneɛbɔ no mu.
       *[clean] Wɔanhunu WCAG AA mmara a wɔabu so biara. Mia na { $action ->
            [close] to
           *[open] bue
        } nkɔmu-kwan amanneɛbɔ no mu.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML nkyerɛaseɛ { $version }

editor-tab-help = Mmoa a ɛfata asɛm no
editor-tab-help-short = Asɛm
editor-tab-errors = Mfomsoɔ
editor-tab-warnings = Kɔkɔbɔ
editor-tab-info = Nsɛm
editor-tab-accessibility = Nkɔmu-kwan
editor-tab-responses = Mmuaeɛ a wɔde kɔeɛ

editor-tab-with-count = { $label }: { $count }

editor-options = Nkyerɛwfoɔ nhyehyɛeɛ
editor-format-as-doenetml = Hyehyɛ no sɛ DoenetML
editor-format-as-xml = Hyehyɛ no sɛ XML


## The diagnostics panel

editor-diagnostic-line = Layin #{ $line }

editor-no-errors = Mfomsoɔ Biara Nni Hɔ
editor-no-warnings = Kɔkɔbɔ Biara Nni Hɔ
editor-no-info = Nsɛm Ho Nhwehwɛmu Biara Nni Hɔ

editor-show-info-annotations = Kyerɛ nsɛm ho nhwehwɛmu wɔ nkyerɛwfoɔ no mu
editor-show-accessibility-annotations = Kyerɛ nkɔmu-kwan ho nhwehwɛmu wɔ nkyerɛwfoɔ no mu

editor-accessibility-learn-more = Sua sɛdeɛ Doenet di nkɔmu-kwan ho dwuma

editor-accessibility-violations-heading = Nkɔmu-kwan mmara a wɔabu so ({ $standard })

editor-accessibility-other-heading = Nkɔmu-kwan ho nsɛm foforɔ
editor-none-found = Wɔanhunu biribiara


## Submitted responses

editor-no-responses = Wɔmmfaa mmuaeɛ biara nkɔeɛ
editor-response-answer-id = Mmuaeɛ Din
editor-response-response = Mmuaeɛ
editor-response-credit = Nsɛkyerɛ
editor-response-submitted = Wɔde kɔeɛ


## The context-help panel

help-placeholder = Fa kɔɔsɔ no si tagi din, su anaa { $ref } so na woanya nkyerɛkyerɛmu.

help-unsupported-ref-chain = Wɔntumi nyɛ nkyerɛ a ɛwɔ afaafa pii sɛ { $example } ho adwuma bi da.

help-unresolved-ref =
    { $reason ->
        [notFound] Wɔanhunu biribiara mmaa nkyerɛ: { $ref }.
        [multiple] Wɔhunuu nneɛma pii maa nkyerɛ: { $ref }.
       *[indeterminate] Wɔantumi anhunu deɛ { $ref } kyerɛ.
    }

help-learn-about-references = Sua nkyerɛ ho ade →
help-reference-page = Nkyerɛ kratafa →

help-suggestions-header =
    { $location ->
        [inside] { $element } mu
       *[top] Soro pɛɛ
    }{ $allowed ->
        [none] { " — biribiara nkɔ ha." }
        [text] { " — twerɛ nkyerɛwee wɔ ha." }
        [text-and-components] { " — twerɛ nkyerɛwee wɔ ha, anaasɛ sɔ yeinom hwɛ:" }
       *[components] { " — nneɛma a wobɛtumi asɔ ahwɛ:" }
    }

help-suggestions-footer = Mia { $shortcut } na woahunu nneɛma { $total } nyinaa.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } yɛ { $target } ho nkyerɛ.
       *[other] { $ref } yɛ { $target } ho nkyerɛ (layin { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } na ɔtoo no din sɛ { $role }.
       *[other] { $owner } na ɔtoo no din wɔ layin { $line } so sɛ { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } yɛ { $element } su { $property } ho nkyerɛ.
       *[other] { $ref } yɛ { $element } su { $property } ho nkyerɛ (layin { $line }).
    }

help-kind-attribute = su
help-kind-snippet = nkyerɛwee sini
help-kind-array-entry = tabo mu adeɛ

help-default = Deɛ ɛwɔ hɔ dada:
help-active-default = Deɛ ɛwɔ hɔ dada a ɛreyɛ adwuma:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Gyinaboɔ a wɔma ho kwan (baako ma adeɛ biara):
       *[other] Gyinaboɔ a wɔma ho kwan:
    }

help-suggested-values = Gyinaboɔ a wɔkamfo kyerɛ:

help-inserts = Ɛde ba mu:

help-coordinates = Nkyerɛbea:

help-type = Suban:

help-resolved-style = Nsiesieɛ a wɔahunu (styleNumber { $styleNumber }):

help-resolved-function-names = Fankshɔn din a wɔahunu:
help-reset-list = Nhwehwɛmu a ɛsan yɛ foforɔ wɔ ha:
help-added-on-input = Deɛ wɔde kaa ho wɔ ha:
help-removed-on-input = Deɛ wɔyii firi mu wɔ ha:

help-reset-overrides = { $reset } sene { $additional } ne { $removed } so.
