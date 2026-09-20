# Tuvaluan (te ggana Tuvalu) editor and language-server surfaces. Translated
# from `locales/en/editor.ftl`, which is the source of truth: `lint:i18n`
# rejects a key that does not exist there, and reports a key that exists there
# but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Dialect, orthography, number and gender are as `content.ftl`'s header sets
# them out: **southern (Funafuti–Vaitupu)**, geminate consonants written double
# («ggana», «ttau»), long vowels unmarked, no grammatical gender and no `$role`
# fork, and no plural marking on a noun after a numeral.
#
# `WCAG AA`, `DoenetML`, `XML`, `styleNumber` and every attribute, element and
# tag name are identifiers rather than words, and stay in English exactly as
# written — as do the key combinations `$shortcut` carries.
#
# The counted messages here keep `one` and `*[other]` where English's two
# branches differ in something other than the noun's number, so that no branch
# goes missing; the two branches are the same text, because a Tuvaluan noun
# does not change after a count. `Intl.PluralRules` has no CLDR data for `tvl`,
# so a `[two]`, `[few]` or `[many]` branch would be unreachable text.
#
# Terms this file settles, and keeps to across all four files:
#   «uiga»           attribute
#   «fakasinoga»     reference
#   «vaega»          component
#   «mea sē»         error, and «fakaeteete» warning
#   «fesuiaiga»      variant
#   «avanoa faigofie» accessibility ("easy access") — a phrase, not a word, and
#                    the one a reviewer is most likely to have a better term for
#   «te mea kilokilo» the viewer, and «te mea tusitusi» the editor. Both are
#                    descriptions ("the looking thing", "the writing thing")
#                    rather than found words, and both are this seed's coinage.
#                    «kilokilo» is the same root as `chrome.ftl`'s
#                    «kilokiloga muamua» for *preview*, kept deliberately.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Toe fakatoka
       *[update] Fakafou
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } te mea kilokilo
       *[other] { $word } te mea kilokilo { $shortcut }
    }


## The variant picker

editor-variant = Fesuiaiga
editor-variant-filter = Tala mai...
editor-variant-next = Filifili te fesuiaiga mulimuli
editor-variant-previous = Filifili te fesuiaiga muamua


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Ne maua se solitulafono ki avanoa faigofie WCAG AA. Kiliki ke { $action ->
            [close] pono
           *[open] tala
        } te lipoti o avanoa faigofie.
        [advisories] Kiliki ke { $action ->
            [close] pono
           *[open] tala
        } te lipoti o avanoa faigofie. Ne seki maua ne solitulafono WCAG AA, kae e isi ne fautuaga fakaopoopo ki avanoa faigofie.
       *[clean] Kiliki ke { $action ->
            [close] pono
           *[open] tala
        } te lipoti o avanoa faigofie. Ne seai ne fakalavelave ki avanoa faigofie ne maua.
    }

editor-accessibility-label =
    { $status ->
        [violations] Ne maua se solitulafono ki avanoa faigofie WCAG AA. { $count ->
            [one] Ne maua a solitulafono WCAG AA e { $count }
           *[other] Ne maua a solitulafono WCAG AA e { $count }
        }. Kiliki ke { $action ->
            [close] pono
           *[open] tala
        } te lipoti o avanoa faigofie.
        [advisories] Ne seai ne solitulafono WCAG AA ne maua. { $count ->
            [one] Ne maua a fautuaga fakaopoopo ki avanoa faigofie e { $count }
           *[other] Ne maua a fautuaga fakaopoopo ki avanoa faigofie e { $count }
        }. Kiliki ke { $action ->
            [close] pono
           *[open] tala
        } te lipoti o avanoa faigofie.
       *[clean] Ne seai ne solitulafono WCAG AA ne maua. Kiliki ke { $action ->
            [close] pono
           *[open] tala
        } te lipoti o avanoa faigofie.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Te fesuiaiga DoenetML { $version }

editor-tab-help = Fesoasoani e fakatatau ki te koga
editor-tab-help-short = Koga
editor-tab-errors = Mea sē
editor-tab-warnings = Fakaeteete
editor-tab-info = Fakamatalaga
editor-tab-accessibility = Avanoa faigofie
editor-tab-responses = Tali ne kave

editor-tab-with-count = { $label }: { $count }

editor-options = Filifiliga o te mea tusitusi
editor-format-as-doenetml = Fakatoka e pelā mo te DoenetML
editor-format-as-xml = Fakatoka e pelā mo te XML


## The diagnostics panel

editor-diagnostic-line = Laina #{ $line }

editor-no-errors = Seai ne mea sē
editor-no-warnings = Seai ne fakaeteete
editor-no-info = Seai ne fakamatalaga

editor-show-info-annotations = Fakaasi a fakamatalaga i te mea tusitusi
editor-show-accessibility-annotations = Fakaasi a fakamatalaga o avanoa faigofie i te mea tusitusi

editor-accessibility-learn-more = Iloa te auala e fakatau ei ne Doenet a avanoa faigofie

editor-accessibility-violations-heading = Solitulafono ki avanoa faigofie ({ $standard })

editor-accessibility-other-heading = Nisi fakalavelave ki avanoa faigofie
editor-none-found = Seai ne mea ne maua


## Submitted responses

editor-no-responses = E seki isi ne tali ne kave
editor-response-answer-id = Igoa o te tali
editor-response-response = Tali
editor-response-credit = Togi
editor-response-submitted = Ne kave


## The context-help panel

help-placeholder = Tuku te fakasinoga i luga o se igoa fakailoga, se uiga, io me se { $ref } mo fakamatalaga.

help-unsupported-ref-chain = E seki mafai o fesoasoani ki fakasinoga e uke ona vaega e pelā mo te { $example }.

help-unresolved-ref =
    { $reason ->
        [notFound] Seai se mea ne maua mo te fakasinoga: { $ref }.
        [multiple] E uke a mea ne maua mo te fakasinoga: { $ref }.
       *[indeterminate] E se mafai o iloa te mea e fakasino ki ei te { $ref }.
    }

help-learn-about-references = Iloa e uiga ki fakasinoga →
help-reference-page = Te itulau o fakasinoga →

help-suggestions-header =
    { $location ->
        [inside] I loto i te { $element }
       *[top] I te koga maluga
    }{ $allowed ->
        [none] { " — seai se mea e fai i konei." }
        [text] { " — tusi ne kupu i konei." }
        [text-and-components] { " — tusi ne kupu i konei, io me taumafai ki:" }
       *[components] { " — mea e mafai o taumafai ki ei:" }
    }

help-suggestions-footer = Taomi te { $shortcut } ke kilo ki vaega katoa e { $total }.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] Te { $ref } se fakasinoga ki te { $target }.
       *[other] Te { $ref } se fakasinoga ki te { $target } (laina { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Ne aumai ne te { $owner } e pelā mo te { $role }.
       *[other] Ne aumai ne te { $owner } i te laina { $line } e pelā mo te { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] Te { $ref } se fakasinoga ki te uiga { $property } o te { $element }.
       *[other] Te { $ref } se fakasinoga ki te uiga { $property } o te { $element } (laina { $line }).
    }

help-kind-attribute = uiga
help-kind-snippet = vaega tusi
help-kind-array-entry = mea i te lisi

help-default = Mea masani:
help-active-default = Mea masani e galue nei:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Tau e mafai (e tasi mo mea takitasi):
       *[other] Tau e mafai:
    }

help-suggested-values = Tau e fautua atu:

help-inserts = E tuku ki loto:

help-coordinates =
    { $count ->
        [one] Fuafuaga:
       *[other] Fuafuaga:
    }

help-type = Vaitino:

help-resolved-style = Foliga ne iloa (styleNumber { $styleNumber }):

help-resolved-function-names = Igoa galuega ne iloa:
help-reset-list = Toe fakatoka te lisi i te mea faiga tenei:
help-added-on-input = Ne fakaopoopo i te mea faiga tenei:
help-removed-on-input = Ne ave kese i te mea faiga tenei:

help-reset-overrides = E sili atu te { $reset } i te { $additional } mo te { $removed }.
