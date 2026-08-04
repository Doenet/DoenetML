# Bambara editor and language-server surfaces. Translated from
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
# A counted noun in Bambara takes no plural suffix, so the counted messages
# drop their selects.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Lasegin
       *[update] Kura Don
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] Jirala { $word }
       *[other] Jirala { $word } { $shortcut }
    }


## The variant picker

editor-variant = Cogoya
editor-variant-filter = Woloma...
editor-variant-next = Cogoya nata sugandi
editor-variant-previous = Cogoya kɔfɛta sugandi


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA sɔrɔliya tiɲɛni ye sɔrɔ. Digi walasa sɔrɔliya rapɔri ka { $action ->
            [close] datugu
           *[open] da wuli
        }.
        [advisories] Digi walasa sɔrɔliya rapɔri ka { $action ->
            [close] datugu
           *[open] da wuli
        }. WCAG AA tiɲɛni si ma sɔrɔ, nka ladilikan wɛrɛw bɛ sɔrɔliya kan.
       *[clean] Digi walasa sɔrɔliya rapɔri ka { $action ->
            [close] datugu
           *[open] da wuli
        }. Sɔrɔliya gɛlɛya si ma sɔrɔ.
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA sɔrɔliya tiɲɛni ye sɔrɔ. WCAG AA tiɲɛni { $count } sɔrɔla. Digi walasa sɔrɔliya rapɔri ka { $action ->
            [close] datugu
           *[open] da wuli
        }.
        [advisories] WCAG AA tiɲɛni si ma sɔrɔ. Sɔrɔliya ladilikan wɛrɛ { $count } sɔrɔla. Digi walasa sɔrɔliya rapɔri ka { $action ->
            [close] datugu
           *[open] da wuli
        }.
       *[clean] WCAG AA tiɲɛni si ma sɔrɔ. Digi walasa sɔrɔliya rapɔri ka { $action ->
            [close] datugu
           *[open] da wuli
        }.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML cogoya { $version }

editor-tab-help = Dɛmɛ min bɛ bɛn kuma ma
editor-tab-help-short = Kuma
editor-tab-errors = Filiw
editor-tab-warnings = Lasɔminiw
editor-tab-info = Kunnafoni
editor-tab-accessibility = Sɔrɔliya
editor-tab-responses = Jaabi cilenw

editor-tab-with-count = { $label }: { $count }

editor-options = Sɛbɛnnikɛla sugandiliw
editor-format-as-doenetml = A labɛn i n'a fɔ DoenetML
editor-format-as-xml = A labɛn i n'a fɔ XML


## The diagnostics panel

editor-diagnostic-line = Liɲi #{ $line }

editor-no-errors = Fili Tɛ Yen
editor-no-warnings = Lasɔmini Tɛ Yen
editor-no-info = Kunnafoni Sɛgɛsɛgɛli Tɛ Yen

editor-show-info-annotations = Kunnafoni sɛgɛsɛgɛliw jira sɛbɛnnikɛla kɔnɔ
editor-show-accessibility-annotations = Sɔrɔliya sɛgɛsɛgɛliw jira sɛbɛnnikɛla kɔnɔ

editor-accessibility-learn-more = Doenet bɛ sɔrɔliya ɲɛnabɔ cogo min na, o kalan

editor-accessibility-violations-heading = Sɔrɔliya tiɲɛniw ({ $standard })

editor-accessibility-other-heading = Sɔrɔliya gɛlɛya wɛrɛw
editor-none-found = Foyi ma sɔrɔ


## Submitted responses

editor-no-responses = Jaabi si ma ci fɔlɔ
editor-response-answer-id = Jaabi Tɔgɔ
editor-response-response = Jaabi
editor-response-credit = Nɔgɔya
editor-response-submitted = A cila


## The context-help panel

help-placeholder = Kurusɔrɔ bila tagi tɔgɔ, atiribi walima { $ref } kan walasa ka sɛbɛnw sɔrɔ.

help-unsupported-ref-chain = Yirali caman ta i n'a fɔ { $example } ka dɛmɛ ma se fɔlɔ.

help-unresolved-ref =
    { $reason ->
        [notFound] Foyi ma sɔrɔ yirali la: { $ref }.
        [multiple] Fɛn caman sɔrɔla yirali la: { $ref }.
       *[indeterminate] { $ref } bɛ min yira, o ma se ka jateminɛ.
    }

help-learn-about-references = Yiraliw kalan →
help-reference-page = Yirali sɛbɛnnisɛn →

help-suggestions-header =
    { $location ->
        [inside] { $element } kɔnɔ
       *[top] Sanfɛ yɔrɔ la
    }{ $allowed ->
        [none] { " — foyi tɛ don yan." }
        [text] { " — sɛbɛnni kɛ yan." }
        [text-and-components] { " — sɛbɛnni kɛ yan, walima a lajɛ:" }
       *[components] { " — fɛn minnu bɛ se ka lajɛ:" }
    }

help-suggestions-footer = { $shortcut } digi walasa ka elemanti { $total } bɛɛ ye.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } ye { $target } yirali ye.
       *[other] { $ref } ye { $target } yirali ye (liɲi { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } y'a tɔgɔ da ko { $role }.
       *[other] { $owner } y'a tɔgɔ da liɲi { $line } kan ko { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } ye { $element } ka atiribi { $property } yirali ye.
       *[other] { $ref } ye { $element } ka atiribi { $property } yirali ye (liɲi { $line }).
    }

help-kind-attribute = atiribi
help-kind-snippet = sɛbɛn tilancɛ
help-kind-array-entry = tabali donyɔrɔ

help-default = Bilalen:
help-active-default = Bilalen baaralen:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Hakɛ dagalenw (kelen elemanti kelen-kelen bɛɛ la):
       *[other] Hakɛ dagalenw:
    }

help-suggested-values = Hakɛ laadilenw:

help-inserts = A bɛ don:

help-coordinates = Kɔɔridɔne:

help-type = Suguya:

help-resolved-style = Cogoya jateminɛna (styleNumber { $styleNumber }):

help-resolved-function-names = Fɔnksiyɔn tɔgɔ jateminɛnaw:
help-reset-list = Lisi min bɛ lasegin nin donni na:
help-added-on-input = Min farala nin donni kan:
help-removed-on-input = Min bɔra nin donni na:

help-reset-overrides = { $reset } bɛ tɛmɛ { $additional } ni { $removed } kan.
