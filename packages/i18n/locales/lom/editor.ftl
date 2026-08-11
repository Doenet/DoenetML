# Loma editor and language-server catalog: the footer, the diagnostics panel,
# the variant picker, the accessibility button, and the context-help panel
# beside them. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# See `content.ftl`'s header for what separates this catalog from
# `locales/kpe`'s (the other Southwestern Mande seed in this batch), for the
# reasoning behind `LOCALE_NAME_FALLBACKS`, and for what a speaker should
# check first — this catalog leans on the same short, mostly-attested
# vocabulary and the same calque strategy for everything past it.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Segin
       *[update] Kɛnɛya
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } Jirala
       *[other] { $word } Jirala { $shortcut }
    }


## The variant picker

editor-variant = Yɛlɛma-fan
editor-variant-filter = Wolo…
editor-variant-next = Yɛlɛma-fan nata sugandi
editor-variant-previous = Yɛlɛma-fan kɔrɔ sugandi


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA sekokɔrɔ tɛmɛli sɔrɔla. A digi ka sekokɔrɔ-sɛbɛ { $action ->
            [close] tugu
           *[open] wulo
        }.
        [advisories] A digi ka sekokɔrɔ-sɛbɛ { $action ->
            [close] tugu
           *[open] wulo
        }. WCAG AA tɛmɛli si sɔrɔ gaa, kɔni sekokɔrɔ-nɔnabɔli gbɛtɛ bɛ yen.
       *[clean] A digi ka sekokɔrɔ-sɛbɛ { $action ->
            [close] tugu
           *[open] wulo
        }. Sekokɔrɔ-fele si sɔrɔ gaa.
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA sekokɔrɔ tɛmɛli sɔrɔla. { $count ->
            [one] WCAG AA tɛmɛli { $count }
           *[other] WCAG AA tɛmɛli { $count }
        } sɔrɔla. A digi ka sekokɔrɔ-sɛbɛ { $action ->
            [close] tugu
           *[open] wulo
        }.
        [advisories] WCAG AA tɛmɛli si sɔrɔ gaa. { $count ->
            [one] sekokɔrɔ-nɔnabɔli gbɛtɛ { $count }
           *[other] sekokɔrɔ-nɔnabɔli gbɛtɛ { $count }
        } sɔrɔla. A digi ka sekokɔrɔ-sɛbɛ { $action ->
            [close] tugu
           *[open] wulo
        }.
       *[clean] WCAG AA tɛmɛli si sɔrɔ gaa. A digi ka sekokɔrɔ-sɛbɛ { $action ->
            [close] tugu
           *[open] wulo
        }.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML yɛlɛma-fan { $version }

editor-tab-help = Nɔnabɔli sɛbɛ-lɔnnin
editor-tab-help-short = Nɔnabɔli
editor-tab-errors = Fele-nu
editor-tab-warnings = Kɔlɔyaa-nu
editor-tab-info = Kunnafoni
editor-tab-accessibility = Sekokɔrɔ
editor-tab-responses = Jaabi cilen-nu

editor-tab-with-count = { $label }: { $count }

editor-options = Sɛbɛ-jirala sugandi-nu
editor-format-as-doenetml = DoenetML-woo lɔn
editor-format-as-xml = XML-woo lɔn


## The diagnostics panel

editor-diagnostic-line = Laa #{ $line }

editor-no-errors = Fele si to gaa
editor-no-warnings = Kɔlɔyaa si to gaa
editor-no-info = Kunnafoni-nɔnabɔli si to gaa

editor-show-info-annotations = Kunnafoni-nɔnabɔli jira sɛbɛ-jirala nun
editor-show-accessibility-annotations = Sekokɔrɔ-nɔnabɔli jira sɛbɛ-jirala nun

editor-accessibility-learn-more = Doenet ka sekokɔrɔ-kɛcogo lɔn

editor-accessibility-violations-heading = Sekokɔrɔ tɛmɛli-nu ({ $standard })

editor-accessibility-other-heading = Sekokɔrɔ-fele gbɛtɛ-nu
editor-none-found = Fɛn si sɔrɔ gaa


## Submitted responses

editor-no-responses = Jaabi si cilen to gaa halisa
editor-response-answer-id = Jaabi-tɔgɔ
editor-response-response = Jaabi
editor-response-credit = Pɔn
editor-response-submitted = Cilen


## The context-help panel

help-placeholder = Klaviye-kɛlɛ da tɔgɔ, sugandi-woo, walasa { $ref } ma ka sɛbɛ-lɔnnin sɔrɔ.

help-unsupported-ref-chain = Nɔnabɔli fan-caa-woo n'ɔŋ ɓɛ { $example } ma se-lɛ halisa.

help-unresolved-ref =
    { $reason ->
        [notFound] { $ref } ma lasigi-fan si sɔrɔ gaa.
        [multiple] { $ref } ma lasigi-fan caa sɔrɔla.
       *[indeterminate] { $ref } ma lasigi-fan lɔn se gaa.
    }

help-learn-about-references = Lasigi-fan-nu lɔn →
help-reference-page = Peji lasigilen →

help-suggestions-header =
    { $location ->
        [inside] { $element } kɔnɔ
       *[top] Sanfɛ-yɔrɔ ma
    }{ $allowed ->
        [none] { " — fɛn si yen gaa." }
        [text] { " — sɛbɛ-kuma sɛbɛ yan." }
        [text-and-components] { " — sɛbɛ-kuma sɛbɛ yan, walisa a lajɛ:" }
       *[components] { " — fɛn-nu lajɛ:" }
    }

help-suggestions-footer = { $shortcut } digi ka sugandi-woo { $total } bɛɛ lajɛ.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } ye lasigi-fan { $target } ma.
       *[other] { $ref } ye lasigi-fan { $target } ma (laa { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } ye a damina { $role } woo.
       *[other] { $owner } ye a damina laa { $line } ma { $role } woo.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } ye lasigi-fan { $element } ma { $property } ma.
       *[other] { $ref } ye lasigi-fan { $element } ma { $property } ma (laa { $line }).
    }

help-kind-attribute = sugandi-woo
help-kind-snippet = sɛbɛ-kunkun
help-kind-array-entry = laa-woo

help-default = Fɔlɔ-woo:
help-active-default = Fɔlɔ-woo kɛlɛ:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Woo se-lɛ-nu (kelen-kelen fɛn-woo kelen):
       *[other] Woo se-lɛ-nu:
    }

help-suggested-values = Woo lajɛlen-nu:

help-inserts = A donni-nu:

help-coordinates =
    { $count ->
        [one] Yɔrɔ-woo:
       *[other] Yɔrɔ-woo-nu:
    }

help-type = Woo-nɔɔ:

help-resolved-style = Woo lɔnlen (styleNumber { $styleNumber }):

help-resolved-function-names = Kɛli-tɔgɔ lɔnlen-nu:
help-reset-list = Segin-woo laa nin sugandi-woo ma:
help-added-on-input = Falen nin sugandi-woo ma:
help-removed-on-input = Bɔlen nin sugandi-woo ma:

help-reset-overrides = { $reset } ye { $additional } nun { $removed } lasegin.
