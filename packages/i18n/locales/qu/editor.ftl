# Quechua editor and language-server surfaces. Translated from
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
# Quechua drops the plural suffix after a numeral, so a `{ $count -> … }` whose
# only English difference is the noun's number renders one string here and the
# select is dropped. A comment marks each site.
#
# A few case suffixes are hyphenated onto an identifier — `{ $ref }-pi`,
# `{ $target }-man`. Quechua's suffixes have one shape whatever precedes them, so
# these are adjacency rather than agreement: the same thing `locales/hy` and
# `locales/ka` do, and not the weld the README forbids. Where a suffix's *choice*
# would have depended on the value, `content.ftl` names the value instead.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Kutichiy
       *[update] Musuqchay
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] Rikuchiqta { $word }
       *[other] Rikuchiqta { $word } { $shortcut }
    }


## The variant picker

editor-variant = Huk niray
editor-variant-filter = Suysuy…
editor-variant-next = Qhipa nirayta akllay
editor-variant-previous = Ñawpaq nirayta akllay


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA chayanapaq p'akiy tarikun. Chayanapaq willayta { $action ->
            [close] wichq'anapaq
           *[open] kichanapaq
        } ñit'iy.
        [advisories] Chayanapaq willayta { $action ->
            [close] wichq'anapaq
           *[open] kichanapaq
        } ñit'iy. Mana ima WCAG AA p'akiypas tarikunchu, ichaqa huk chayanapaq yuyaychaykuna kachkan.
       *[clean] Chayanapaq willayta { $action ->
            [close] wichq'anapaq
           *[open] kichanapaq
        } ñit'iy. Mana ima chayanapaq sasachakuypas tarikunchu.
    }

# No select on `$count`: «p'akiy» and «yuyaychay» take no plural suffix after a
# numeral, so both categories would render the same string.
editor-accessibility-label =
    { $status ->
        [violations] WCAG AA chayanapaq p'akiy tarikun. { $count } WCAG AA p'akiy tarikun. Chayanapaq willayta { $action ->
            [close] wichq'anapaq
           *[open] kichanapaq
        } ñit'iy.
        [advisories] Mana ima WCAG AA p'akiypas tarikunchu. { $count } huk chayanapaq yuyaychay tarikun. Chayanapaq willayta { $action ->
            [close] wichq'anapaq
           *[open] kichanapaq
        } ñit'iy.
       *[clean] Mana ima WCAG AA p'akiypas tarikunchu. Chayanapaq willayta { $action ->
            [close] wichq'anapaq
           *[open] kichanapaq
        } ñit'iy.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML { $version } niray

editor-tab-help = Maypi kasqanman hina yanapay
editor-tab-help-short = Maypi
editor-tab-errors = Pantaykuna
editor-tab-warnings = Yuyaychaykuna
editor-tab-info = Willay
editor-tab-accessibility = Chayanapaq
editor-tab-responses = Apachisqa kutichiykuna

editor-tab-with-count = { $label }: { $count }

editor-options = Qillqaqpa akllanakuna
editor-format-as-doenetml = DoenetML hina churay
editor-format-as-xml = XML hina churay


## The diagnostics panel

editor-diagnostic-line = Siqi #{ $line }

editor-no-errors = Mana pantaykuna
editor-no-warnings = Mana yuyaychaykuna
editor-no-info = Mana willay riqsichiykuna

editor-show-info-annotations = Qillqaqpi willay riqsichiykunata rikuchiy
editor-show-accessibility-annotations = Qillqaqpi chayanapaq riqsichiykunata rikuchiy

editor-accessibility-learn-more = Doenet imayna chayanapaqta ruran chayta yachay

editor-accessibility-violations-heading = Chayanapaq p'akiykuna ({ $standard })

editor-accessibility-other-heading = Huk chayanapaq sasachakuykuna
editor-none-found = Mana imapas tarikunchu


## Submitted responses

editor-no-responses = Manaraq apachisqa kutichiykuna kanchu
editor-response-answer-id = Kutichiypa sutin
editor-response-response = Kutichiy
editor-response-credit = Chanin
editor-response-submitted = Apachisqa


## The context-help panel

help-placeholder = Qillqa yaykunapaq, unancha sutipi, unanchapi, icha { $ref }-pi chimputa churay.

help-unsupported-ref-chain = { $example } hina achka phatma tupachiykunapaq yanapay manaraq kanchu.

help-unresolved-ref =
    { $reason ->
        [notFound] Kay tupachiypaq mana ima tarikunchu: { $ref }.
        [multiple] Kay tupachiypaq achka tarikun: { $ref }.
       *[indeterminate] { $ref } imaman tupasqan mana yachaykuyta atirqanchu.
    }

help-learn-about-references = Tupachiykunamanta yachay →
help-reference-page = Tupachiy p'anqa →

help-suggestions-header =
    { $location ->
        [inside] { $element } ukhupi
       *[top] Aswan pata kaqpi
    }{ $allowed ->
        [none] { " — kaypi mana imapas yaykunchu." }
        [text] { " — kaypi qillqata churay." }
        [text-and-components] { " — kaypi qillqata churay, icha kayta ruray:" }
       *[components] { " — ruranapaq imakuna:" }
    }

help-suggestions-footer = Llapan { $total } kaqkunata rikunapaq { $shortcut } ñit'iy.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } { $target }-man tupachiy.
       *[other] { $ref } { $target }-man tupachiy ({ $line } siqi).
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } { $role } hina churamun.
       *[other] { $owner } { $line } siqipi { $role } hina churamun.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } { $element } kaqpa { $property } kayninman tupachiy.
       *[other] { $ref } { $element } kaqpa { $property } kayninman tupachiy ({ $line } siqi).
    }

help-kind-attribute = unancha
help-kind-snippet = qillqa phatma
help-kind-array-entry = siqi yaykuy

help-default = Ñawpaq kaqnin:
help-active-default = Kunan ñawpaq kaqnin:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Saqisqa chanikuna (sapa kaqpaq huk):
       *[other] Saqisqa chanikuna:
    }

help-suggested-values = Yuyaychasqa chanikuna:

help-inserts = Churan:

# No select: «chiqan» takes no plural suffix after a numeral, so both categories
# would render the same string.
help-coordinates = Chiqankuna:

help-type = Niray:

help-resolved-style = Tarisqa rikch'ay (styleNumber { $styleNumber }):

help-resolved-function-names = Tarisqa funsyun sutikuna:
help-reset-list = Kay yaykuypi kutichiy siqi:
help-added-on-input = Kay yaykuypi yapasqa:
help-removed-on-input = Kay yaykuypi qichusqa:

help-reset-overrides = { $reset } { $additional } hinaspa { $removed } kaqkunata saqin.
