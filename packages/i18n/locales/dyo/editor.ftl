# Jola-Fonyi editor and language-server surfaces. Selected by `uiLocale`.
#
# UNREVIEWED SEED, and a partial one. See `diagnostics.ftl`'s header for the
# full account: an earlier draft of this file was produced by mechanically
# re-lexifying Temne's (`locales/tem`) editor catalog rather than being
# translated, and has been discarded and rewritten from scratch. This version
# uses the class-prefix system and vocabulary established in `chrome.ftl` and
# `content.ftl` (`ka-`/`si-`/`bu-`/`fu-`; `arus` as the clause-final negator;
# `buka` as the infinitive/purposive marker) and reuses their words for
# shared concepts rather than inventing new ones.
#
# Jola-Fonyi (Diola-Fogny, `dyo`), Atlantic (Niger-Congo, Jola/Bak group),
# Casamance region of Senegal. Latin script. `Intl.PluralRules("dyo")` →
# `["one", "other"]`.
#
# Honest confidence level: a fluent non-speaker's construction from published
# grammatical sketches, not a speaker's translation — see `diagnostics.ftl`'s
# header for the full caveat. Technical terms without an available
# Jola-Fonyi source use adapted French loanwords (`fɔrmɛ`, `ʌŋdeks`,
# `varyaŋ`), matching the reasoning in `content.ftl`'s header for its own
# French mathematical vocabulary.
#
# DoenetML element names, attribute names and `styleNumber` are identifiers of
# the language and stay in English exactly as written.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Yeen bɛk
       *[update] Firi
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } Kayiraŋ
       *[other] { $word } Kayiraŋ { $shortcut }
    }


## The variant picker

editor-variant = Varyaŋ

editor-variant-filter = Am…

editor-variant-next = Yool varyaŋ ka taŋ

editor-variant-previous = Yool varyaŋ ka paa


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Ka siit kakaañ ku WCAG AA ku kasoot. Toot buka { $action ->
            [close] kant
           *[open] tulen
        } kasoŋ ku kasoot.
        [advisories] Toot buka { $action ->
            [close] kant
           *[open] tulen
        } kasoŋ ku kasoot; buka siit kakaañ ku WCAG AA arus, kutaa sisandi sijaŋ si kasoot si ase mu.
       *[clean] Toot buka { $action ->
            [close] kant
           *[open] tulen
        } kasoŋ ku kasoot; buka siit kakaañ ku kasoot arus.
    }

editor-accessibility-label =
    { $status ->
        [violations] Ka siit kakaañ ku WCAG AA ku kasoot. Ka siit { $count ->
            [one] kakaañ { $count } ku WCAG AA
           *[other] sikaañ { $count } si WCAG AA
        }. Toot buka { $action ->
            [close] kant
           *[open] tulen
        } kasoŋ ku kasoot.
        [advisories] Buka siit kakaañ ku WCAG AA arus. Ka siit { $count ->
            [one] kasandi { $count } kajaŋ ku kasoot
           *[other] sisandi { $count } sijaŋ si kasoot
        }. Toot buka { $action ->
            [close] kant
           *[open] tulen
        } kasoŋ ku kasoot.
       *[clean] Buka siit kakaañ ku WCAG AA arus. Toot buka { $action ->
            [close] kant
           *[open] tulen
        } kasoŋ ku kasoot.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML version { $version }

editor-tab-help = Kasandi ku ro mu ase
editor-tab-help-short = Ro
editor-tab-errors = Sikaañ
editor-tab-warnings = Sifur
editor-tab-info = Funkeer
editor-tab-accessibility = Kasoot
editor-tab-responses = Silipi si lel

editor-tab-with-count = { $label }: { $count }

editor-options = Sifen si kayiraŋ
editor-format-as-doenetml = Jaw fɔrmɛ DoenetML
editor-format-as-xml = Jaw fɔrmɛ XML


## The diagnostics panel

editor-diagnostic-line = Kalay #{ $line }

editor-no-errors = Sikaañ Si Arus
editor-no-warnings = Sifur Si Arus
editor-no-info = Funkeer Ka Arus

editor-show-info-annotations = Won funkeer ku kayiraŋ
editor-show-accessibility-annotations = Won sikaañ si kasoot ku kayiraŋ

editor-accessibility-learn-more = Kalan ase Doenet ka jaw kasoot

editor-accessibility-violations-heading = Sikaañ si kasoot ({ $standard })

editor-accessibility-other-heading = Sikaañ sijaŋ si kasoot
editor-none-found = Buka siit lëf arus


## Submitted responses

editor-no-responses = Silipi si lel arus nɛ
editor-response-answer-id = Ʌŋdeks ku kalipi
editor-response-response = Kalipi
editor-response-credit = Kabay
editor-response-submitted = Ka lel


## The context-help panel

help-placeholder = Bʌŋ kakar ku fues ku tag, ku attribute, mba ku { $ref } ka mu siit funkeer.

help-unsupported-ref-chain = Kasandi ku sikeer si sipath siboor ka { $example } ase arus nɛ.

help-unresolved-ref =
    { $reason ->
        [notFound] Buka siit lëf ku { $ref } arus.
        [multiple] Buka siit sijaŋ siboor ku { $ref }.
       *[indeterminate] Buka yool funkabat ku { $ref } arus.
    }

help-learn-about-references = Kalan sikeer si sinuŋ →
help-reference-page = Kapej ku funkeer →

help-suggestions-header =
    { $location ->
        [inside] Ku ro { $element }
       *[top] Ku katoŋ ku kabuk
    }{ $allowed ->
        [none] { " — lëf ka baa ro arus." }
        [text] { " — soŋ funkeer ro." }
        [text-and-components] { " — soŋ funkeer ro, mba simpa:" }
       *[components] { " — sijaŋ si mu simpa:" }
    }

help-suggestions-footer = Toot { $shortcut } ka mu won sijaŋ { $total } si pəŋ.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } ka nuŋ ku { $target }.
       *[other] { $ref } ka nuŋ ku { $target } (kalay { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } ka lomb ka ka { $role }.
       *[other] { $owner } ka lomb ka ku kalay { $line } ka { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } ka nuŋ ku { $property } ku { $element }.
       *[other] { $ref } ka nuŋ ku { $property } ku { $element } (kalay { $line }).
    }

help-kind-attribute = attribute
help-kind-snippet = kapat
help-kind-array-entry = kapat ku array

help-default = Ka ase paa:
help-active-default = Ka ase paa ase ka lil:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Sijaŋ si buka yif (karoŋ ku kamoot):
       *[other] Sijaŋ si buka yif:
    }

help-suggested-values = Sijaŋ si buka sandi:

help-inserts = Ka lomb:

help-coordinates =
    { $count ->
        [one] Karoo:
       *[other] Siro:
    }

help-type = Kanoot:

help-resolved-style = Kanoot ka buka siit (styleNumber { $styleNumber }):

help-resolved-function-names = Ʌŋes ku sifɔnksiyɔŋ si buka siit:
help-reset-list = Yeen bɛk kalist ku input kanɛ:
help-added-on-input = Ka lomb ku input kanɛ:
help-removed-on-input = Ka cim ku input kanɛ:

help-reset-overrides = { $reset } ka law { $additional } na { $removed }.
