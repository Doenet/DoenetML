# Ewe editor and language-server surfaces. Translated from
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
# A counted noun in Ewe takes no plural suffix, so the counted messages drop
# their selects.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Gaɖoe Ɖe Egɔme
       *[update] Wɔe Yeyee
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } Kpɔla la
       *[other] { $word } Kpɔla la { $shortcut }
    }


## The variant picker

editor-variant = Nɔnɔme
editor-variant-filter = Tia...
editor-variant-next = Tia nɔnɔme si kplɔe ɖo
editor-variant-previous = Tia nɔnɔme si do ŋgɔ


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Wokpɔ WCAG AA ŋudɔwɔwɔ ƒe sedzimawɔmawɔ. Zi edzi be nàtu ŋudɔwɔwɔ nyatakaka la { $action ->
            [close] nu
           *[open] ʋu
        }.
        [advisories] Zi edzi be nà{ $action ->
            [close] tu
           *[open] ʋu
        } ŋudɔwɔwɔ nyatakaka la. Womekpɔ WCAG AA sedzimawɔmawɔ aɖeke o, gake aɖaŋuɖoɖo bubuwo li le ŋudɔwɔwɔ ŋu.
       *[clean] Zi edzi be nà{ $action ->
            [close] tu
           *[open] ʋu
        } ŋudɔwɔwɔ nyatakaka la. Womekpɔ ŋudɔwɔwɔ ƒe kuxi aɖeke o.
    }

editor-accessibility-label =
    { $status ->
        [violations] Wokpɔ WCAG AA ŋudɔwɔwɔ ƒe sedzimawɔmawɔ. Wokpɔ WCAG AA sedzimawɔmawɔ { $count }. Zi edzi be nà{ $action ->
            [close] tu
           *[open] ʋu
        } ŋudɔwɔwɔ nyatakaka la.
        [advisories] Womekpɔ WCAG AA sedzimawɔmawɔ aɖeke o. Wokpɔ ŋudɔwɔwɔ ŋuti aɖaŋuɖoɖo bubu { $count }. Zi edzi be nà{ $action ->
            [close] tu
           *[open] ʋu
        } ŋudɔwɔwɔ nyatakaka la.
       *[clean] Womekpɔ WCAG AA sedzimawɔmawɔ aɖeke o. Zi edzi be nà{ $action ->
            [close] tu
           *[open] ʋu
        } ŋudɔwɔwɔ nyatakaka la.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML tata { $version }

editor-tab-help = Kpekpeɖeŋu si sɔ kple nyaa
editor-tab-help-short = Nyaa
editor-tab-errors = Vodadawo
editor-tab-warnings = Nuxlɔ̃amewo
editor-tab-info = Nyatakaka
editor-tab-accessibility = Ŋudɔwɔwɔ
editor-tab-responses = Ŋuɖoɖo siwo woɖo ɖa

editor-tab-with-count = { $label }: { $count }

editor-options = Nuŋlɔla ƒe tiatiawo
editor-format-as-doenetml = Ɖoe ɖe ɖoɖo nu abe DoenetML ene
editor-format-as-xml = Ɖoe ɖe ɖoɖo nu abe XML ene


## The diagnostics panel

editor-diagnostic-line = Fli #{ $line }

editor-no-errors = Vodada Aɖeke Meli O
editor-no-warnings = Nuxlɔ̃ame Aɖeke Meli O
editor-no-info = Nyatakaka Ŋuti Nudidi Aɖeke Meli O

editor-show-info-annotations = Fia nyatakaka ŋuti nudidiwo le nuŋlɔla la me
editor-show-accessibility-annotations = Fia ŋudɔwɔwɔ ŋuti nudidiwo le nuŋlɔla la me

editor-accessibility-learn-more = Srɔ̃ ale si Doenet léa ŋudɔwɔwɔ me ɖe asi

editor-accessibility-violations-heading = Ŋudɔwɔwɔ ƒe sedzimawɔmawɔwo ({ $standard })

editor-accessibility-other-heading = Ŋudɔwɔwɔ ŋuti kuxi bubuwo
editor-none-found = Womekpɔ naneke o


## Submitted responses

editor-no-responses = Womeɖo ŋuɖoɖo aɖeke ɖa haɖe o
editor-response-answer-id = Ŋuɖoɖoa ƒe Ŋkɔ
editor-response-response = Ŋuɖoɖo
editor-response-credit = Dzesi
editor-response-submitted = Woɖoe ɖa


## The context-help panel

help-placeholder = Tsɔ asinudzesia da ɖe tagi ƒe ŋkɔ, nɔnɔme alo { $ref } dzi be nàkpɔ nuŋlɔɖiwo.

help-unsupported-ref-chain = Womete ŋu wɔ dɔ kple asifiafia si me akpa geɖe le abe { $example } ene haɖe o.

help-unresolved-ref =
    { $reason ->
        [notFound] Womekpɔ naneke na asifiafia sia o: { $ref }.
        [multiple] Wokpɔ nu geɖe na asifiafia sia: { $ref }.
       *[indeterminate] Womete ŋu kpɔ nu si { $ref } fia o.
    }

help-learn-about-references = Srɔ̃ nu tso asifiafiawo ŋu →
help-reference-page = Asifiafia ƒe axa →

help-suggestions-header =
    { $location ->
        [inside] Le { $element } me
       *[top] Le tame ke
    }{ $allowed ->
        [none] { " — naneke meyi afi sia o." }
        [text] { " — ŋlɔ nya ɖe afi sia." }
        [text-and-components] { " — ŋlɔ nya ɖe afi sia, alo dze agbagba kple:" }
       *[components] { " — nu siwo nàte ŋu adze agbagba:" }
    }

help-suggestions-footer = Zi { $shortcut } dzi be nàkpɔ nu { $total } katã.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } nye { $target } ƒe asifiafia.
       *[other] { $ref } nye { $target } ƒe asifiafia (fli { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } na ŋkɔe be { $role }.
       *[other] { $owner } na ŋkɔe le fli { $line } dzi be { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } nye { $element } ƒe nɔnɔme { $property } ƒe asifiafia.
       *[other] { $ref } nye { $element } ƒe nɔnɔme { $property } ƒe asifiafia (fli { $line }).
    }

help-kind-attribute = nɔnɔme
help-kind-snippet = nuŋɔŋlɔ kpui
help-kind-array-entry = kplɔ̃ me nu

help-default = Nu si li xoxo:
help-active-default = Nu si li xoxo eye wòle dɔ wɔm:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Home siwo woɖe mɔ na (ɖeka na nu ɖe sia ɖe):
       *[other] Home siwo woɖe mɔ na:
    }

help-suggested-values = Home siwo woɖo ɖa:

help-inserts = Etsɔa esiawo dea eme:

help-coordinates = Nɔƒefiadzesiwo:

help-type = Ƒomevi:

help-resolved-style = Nɔnɔme si wokpɔ (styleNumber { $styleNumber }):

help-resolved-function-names = Dɔwɔfia ƒe ŋkɔ siwo wokpɔ:
help-reset-list = Nuŋɔŋlɔ si wogaɖoa ɖe egɔme le afi sia:
help-added-on-input = Nu si wotsɔ kpe ɖe eŋu le afi sia:
help-removed-on-input = Nu si woɖe ɖa le afi sia:

help-reset-overrides = { $reset } ƒua { $additional } kple { $removed } ta.
