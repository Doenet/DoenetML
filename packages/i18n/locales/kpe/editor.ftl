# Kpelle editor and language-server catalog: the footer, the diagnostics
# panel, the variant picker, the accessibility button, and the context-help
# panel beside them. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# See `content.ftl`'s header for what separates this catalog from
# `locales/lom`'s (the other Southwestern Mande seed in this batch), for the
# reasoning behind `LOCALE_NAME_FALLBACKS`, and for what a speaker should
# check first — this catalog leans on the same thin, mostly-unattested
# vocabulary and the same calque strategy as the rest of this seed.


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
        [violations] WCAG AA aksɛsibiliti tɛmɛli sɔrɔla. A digi ka aksɛsibiliti-sɛbɛ { $action ->
            [close] tugu
           *[open] wulo
        }.
        [advisories] A digi ka aksɛsibiliti-sɛbɛ { $action ->
            [close] tugu
           *[open] wulo
        }. WCAG AA tɛmɛli si sɔrɔ gaa, kɔni aksɛsibiliti-nɔnabɔli gbɛtɛ bɛ yen.
       *[clean] A digi ka aksɛsibiliti-sɛbɛ { $action ->
            [close] tugu
           *[open] wulo
        }. Aksɛsibiliti-fele si sɔrɔ gaa.
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA aksɛsibiliti tɛmɛli sɔrɔla. { $count ->
            [one] WCAG AA tɛmɛli { $count }
           *[other] WCAG AA tɛmɛli { $count }
        } sɔrɔla. A digi ka aksɛsibiliti-sɛbɛ { $action ->
            [close] tugu
           *[open] wulo
        }.
        [advisories] WCAG AA tɛmɛli si sɔrɔ gaa. { $count ->
            [one] aksɛsibiliti-nɔnabɔli gbɛtɛ { $count }
           *[other] aksɛsibiliti-nɔnabɔli gbɛtɛ { $count }
        } sɔrɔla. A digi ka aksɛsibiliti-sɛbɛ { $action ->
            [close] tugu
           *[open] wulo
        }.
       *[clean] WCAG AA tɛmɛli si sɔrɔ gaa. A digi ka aksɛsibiliti-sɛbɛ { $action ->
            [close] tugu
           *[open] wulo
        }.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML yɛlɛma-fan { $version }

editor-tab-help = Nɔnabɔli sɛbɛ-lɔnnin
editor-tab-help-short = Nɔnabɔli
editor-tab-errors = Fele-ŋa
editor-tab-warnings = Kɔlɔyaa-ŋa
editor-tab-info = Kunnafoni
editor-tab-accessibility = Aksɛsibiliti
editor-tab-responses = Jaabi cilen-ŋa

editor-tab-with-count = { $label }: { $count }

editor-options = Sɛbɛ-jirala sugandi-ŋa
editor-format-as-doenetml = DoenetML-kwaa lɔn
editor-format-as-xml = XML-kwaa lɔn


## The diagnostics panel

editor-diagnostic-line = Laa #{ $line }

editor-no-errors = Fele si to gaa
editor-no-warnings = Kɔlɔyaa si to gaa
editor-no-info = Kunnafoni-nɔnabɔli si to gaa

editor-show-info-annotations = Kunnafoni-nɔnabɔli jira sɛbɛ-jirala nda
editor-show-accessibility-annotations = Aksɛsibiliti-nɔnabɔli jira sɛbɛ-jirala nda

editor-accessibility-learn-more = Doenet ka aksɛsibiliti-kɛcogo lɔn

editor-accessibility-violations-heading = Aksɛsibiliti tɛmɛli-ŋa ({ $standard })

editor-accessibility-other-heading = Aksɛsibiliti-fele gbɛtɛ-ŋa
editor-none-found = Fɛn si sɔrɔ gaa


## Submitted responses

editor-no-responses = Jaabi si cilen to gaa halisa
editor-response-answer-id = Jaabi-tɔgɔ
editor-response-response = Jaabi
editor-response-credit = Pɔn
editor-response-submitted = Cilen


## The context-help panel

help-placeholder = Klaviye-kɛlɛ da tɔgɔ, sugandi-kwaa, walasa { $ref } ma ka sɛbɛ-lɔnnin sɔrɔ.

help-unsupported-ref-chain = Nɔnabɔli fan-caa-kwaa n'ɔŋ ɓɛ { $example } ma se-i halisa.

help-unresolved-ref =
    { $reason ->
        [notFound] { $ref } ma lasigi-fan si sɔrɔ gaa.
        [multiple] { $ref } ma lasigi-fan caa sɔrɔla.
       *[indeterminate] { $ref } ma lasigi-fan lɔn se gaa.
    }

help-learn-about-references = Lasigi-fan-ŋa lɔn →
help-reference-page = Peji lasigilen →

help-suggestions-header =
    { $location ->
        [inside] { $element } kɔnɔ
       *[top] Sanfɛ-yɔrɔ ma
    }{ $allowed ->
        [none] { " — fɛn si yen gaa." }
        [text] { " — sɛbɛ-kuma sɛbɛ yan." }
        [text-and-components] { " — sɛbɛ-kuma sɛbɛ yan, walisa a lajɛ:" }
       *[components] { " — fɛn-ŋa lajɛ:" }
    }

help-suggestions-footer = { $shortcut } digi ka sugandi-kwaa { $total } bɛɛ lajɛ.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } ye lasigi-fan { $target } ma.
       *[other] { $ref } ye lasigi-fan { $target } ma (laa { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } ye a damina { $role } kwaa.
       *[other] { $owner } ye a damina laa { $line } ma { $role } kwaa.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } ye lasigi-fan { $element } ma { $property } ma.
       *[other] { $ref } ye lasigi-fan { $element } ma { $property } ma (laa { $line }).
    }

help-kind-attribute = sugandi-kwaa
help-kind-snippet = sɛbɛ-kunkun
help-kind-array-entry = laa-kwaa

help-default = Fɔlɔ-kwaa:
help-active-default = Fɔlɔ-kwaa kɛlɛ:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Kwaa se-i-ŋa (tao-tao fɛn-kwaa tao):
       *[other] Kwaa se-i-ŋa:
    }

help-suggested-values = Kwaa lajɛlen-ŋa:

help-inserts = A donni-ŋa:

help-coordinates =
    { $count ->
        [one] Yɔrɔ-kwaa:
       *[other] Yɔrɔ-kwaa-ŋa:
    }

help-type = Kwaa-nɔɔ:

help-resolved-style = Kwaa lɔni (styleNumber { $styleNumber }):

help-resolved-function-names = Kɛli-tɔgɔ lɔni-ŋa:
help-reset-list = Segin-kwaa laa nin sugandi-kwaa ma:
help-added-on-input = Falen nin sugandi-kwaa ma:
help-removed-on-input = Bɔli nin sugandi-kwaa ma:

help-reset-overrides = { $reset } ye { $additional } nda { $removed } lasegin.
