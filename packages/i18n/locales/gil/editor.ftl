# Gilbertese / Kiribati (te taetae ni Kiribati) editor and language-server
# surfaces. Translated from `locales/en/editor.ftl`, which is the source of
# truth: `lint:i18n` rejects a key that does not exist there, and reports a key
# that exists there but not here as missing coverage.
#
# `WCAG AA`, `DoenetML`, `XML`, `styleNumber` and every attribute or element
# name are identifiers, not prose, and stay as written.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** Standard Kiribati: the thirteen letters `a b e i k m n ng o
# r t u w`, the velarized labials written out as **«bw» and «mw»** («bwai»,
# «mwakoro», «mwakuri») rather than in the older mission spelling («bai»,
# «makoro», «makuri»), and **no macrons** — vowel length is doubling, not a
# diacritic. `chrome.ftl`'s header states both decisions in full and asks that
# a reviewer who prefers the mission orthography convert all four files
# together rather than mix them.
#
# **Word order and the linker.** The noun comes first and what describes it
# follows, joined by the singular linker **«ae»** — «te variant ae imwina»,
# *the next variant*. That is the order the batch's other Micronesian catalogs
# (`mh`, `chk`, `pon`, `kos`) write too.
#
# **No grammatical gender and no `$role` fork.** Nothing here agrees with
# anything.
#
# **Counting.** Kiribati counts with numeral classifiers, and the general
# classifier «-ua» is the one every count in this file would take — violations,
# recommendations, components. It is not written, because a classifier is a
# suffix on the numeral word («uoua», not «2-ua») and the count arrives as a
# placeable. `chrome.ftl`'s header sets this out at length. Since a noun after
# a numeral does not change either, the two accessibility counters below write
# **one form under both `one` and `other`**: the categories are kept apart so
# that no branch goes missing, not because the words differ.
#
# **Loans.** Technical vocabulary this seed could not establish is kept as the
# English word in English spelling rather than guessed at: `editor`, `viewer`,
# `variant`, `filter`, `accessibility`, `component`, `attribute`, `tag`,
# `reference`, `property`, `snippet`, `array entry`, `value`, `type`, `style`,
# `function`, `list`, `input`, `cursor`, `default` and `line` (a line of
# source). Everything else is Kiribati. Replacing a loan needs no permission.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Kaoka
       *[update] Kaboua
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } te viewer
       *[other] { $word } te viewer { $shortcut }
    }


## The variant picker

editor-variant = Variant

editor-variant-filter = Filter...

editor-variant-next = Rinea te variant are imwina

editor-variant-previous = Rinea te variant are rimoa


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] E kuneaki te bure n te WCAG AA accessibility. Kiliki bwa e na { $action ->
            [close] kainaki
           *[open] uki
        } te ribooti ni accessibility.
        [advisories] Kiliki bwa e na { $action ->
            [close] kainaki
           *[open] uki
        } te ribooti ni accessibility. Akea te bure n te WCAG AA ae kuneaki, ma iai taeka n ibuobuoki riki ibukin te accessibility.
       *[clean] Kiliki bwa e na { $action ->
            [close] kainaki
           *[open] uki
        } te ribooti ni accessibility. Akea te kangaanga n te accessibility ae kuneaki.
    }

editor-accessibility-label =
    { $status ->
        [violations] E kuneaki te bure n te WCAG AA accessibility. E kuneaki { $count ->
            [one] { $count } te bure n te WCAG AA
           *[other] { $count } te bure n te WCAG AA
        }. Kiliki bwa e na { $action ->
            [close] kainaki
           *[open] uki
        } te ribooti ni accessibility.
        [advisories] Akea te bure n te WCAG AA ae kuneaki. E kuneaki { $count ->
            [one] { $count } te taeka n ibuobuoki riki ibukin te accessibility
           *[other] { $count } te taeka n ibuobuoki riki ibukin te accessibility
        }. Kiliki bwa e na { $action ->
            [close] kainaki
           *[open] uki
        } te ribooti ni accessibility.
       *[clean] Akea te bure n te WCAG AA ae kuneaki. Kiliki bwa e na { $action ->
            [close] kainaki
           *[open] uki
        } te ribooti ni accessibility.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Te DoenetML version { $version }

editor-tab-help = Te ibuobuoki ae boraoi ma te tabo are ko mena iai
editor-tab-help-short = Ibuobuoki
editor-tab-errors = Taian Bure
editor-tab-warnings = Taian Kauring
editor-tab-info = Rongorongo
editor-tab-accessibility = Accessibility
editor-tab-responses = Taian kaeka aika kanakoaki

editor-tab-with-count = { $label }: { $count }

editor-options = Taian rine ibukin te editor
editor-format-as-doenetml = Kaetia n aron te DoenetML
editor-format-as-xml = Kaetia n aron te XML


## The diagnostics panel

editor-diagnostic-line = Line #{ $line }

editor-no-errors = Akea te Bure
editor-no-warnings = Akea te Kauring
editor-no-info = Akea te Rongorongo

editor-show-info-annotations = Kaoti taian rongorongo n te editor
editor-show-accessibility-annotations = Kaoti taian accessibility n te editor

editor-accessibility-learn-more = Reireiaki iaon aron Doenet ni kaineti ma te accessibility

editor-accessibility-violations-heading = Taian bure n te accessibility ({ $standard })

editor-accessibility-other-heading = Kangaanga riki n te accessibility
editor-none-found = Akea ae kuneaki


## Submitted responses

editor-no-responses = Akea te kaeka ae kanakoaki
editor-response-answer-id = Answer Id
editor-response-response = Kaeka
editor-response-credit = Credit
editor-response-submitted = E kanakoaki


## The context-help panel

help-placeholder = Kaaki te cursor iaon aran te tag, te attribute, ke { $ref } ibukin te rongorongo.

help-unsupported-ref-chain = E tuai ni kona te ibuobuoki ibukin taian reference aika bati mwakoroia n aron { $example }.

help-unresolved-ref =
    { $reason ->
        [notFound] Akea te bwai ae kuneaki ibukin te reference: { $ref }.
        [multiple] A bati bwaai aika kuneaki ibukin te reference: { $ref }.
       *[indeterminate] E aki kona n ataaki te bwai ae nanonaki iroun { $ref }.
    }

help-learn-about-references = Reireiaki iaon taian reference →
help-reference-page = Te iteraniba ni reference →

help-suggestions-header =
    { $location ->
        [inside] I nanon { $element }
       *[top] I aon te tabo ae moan te rietata
    }{ $allowed ->
        [none] { " — akea te bwai ae na mena ikai." }
        [text] { " — korea te koroboki ikai." }
        [text-and-components] { " — korea te koroboki ikai, ke kataia:" }
       *[components] { " — bwaai aika ko kona ni kataia:" }
    }

help-suggestions-footer = Taua { $shortcut } bwa ko na nori { $total } te component ni kabane.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } bon te reference nakon { $target }.
       *[other] { $ref } bon te reference nakon { $target } (line { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] E karinaki iroun { $owner } bwa { $role }.
       *[other] E karinaki iroun { $owner } n line { $line } bwa { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } bon te reference nakon te { $property } property ibukin { $element }.
       *[other] { $ref } bon te reference nakon te { $property } property ibukin { $element } (line { $line }).
    }

help-kind-attribute = attribute
help-kind-snippet = snippet
help-kind-array-entry = array entry

help-default = Te default:
help-active-default = Te default ae mwakuri:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Taian value aika kariaiakaki (teuana ibukin te item teuana):
       *[other] Taian value aika kariaiakaki:
    }

help-suggested-values = Taian value aika kaotaki:

help-inserts = E karina:

# One form under both branches: a Kiribati noun is not marked for number, so
# the two categories are kept apart only so that no branch goes missing.
help-coordinates =
    { $count ->
        [one] Coordinate:
       *[other] Coordinate:
    }

help-type = Te type:

help-resolved-style = Te style ae reke (styleNumber { $styleNumber }):

help-resolved-function-names = Aran taian function aika reke:
help-reset-list = Kaokan te list iaon te input aei:
help-added-on-input = Karinaki iaon te input aei:
help-removed-on-input = Kaakeaki iaon te input aei:

help-reset-overrides = E rietata riki { $reset } nakon { $additional } ao { $removed }.
