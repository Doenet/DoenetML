# Wolof editor and language-server surfaces. Translated from
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
# Wolof has one plural category, so the counted messages drop their selects.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Delloo
       *[update] Yeesal
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } Wonekaay bi
       *[other] { $word } Wonekaay bi { $shortcut }
    }


## The variant picker

editor-variant = Sukkandiku
editor-variant-filter = Tànn...
editor-variant-next = Tànn sukkandiku bi ci topp
editor-variant-previous = Tànn sukkandiku bi jiitu


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Gis nañu moytu jotewaay bu WCAG AA. Bësal ngir { $action ->
            [close] tëj
           *[open] ubbi
        } rapoor bu jotewaay bi.
        [advisories] Bësal ngir { $action ->
            [close] tëj
           *[open] ubbi
        } rapoor bu jotewaay bi. Gisuñu benn moytu WCAG AA, waaye am na ay xelal yu yokku ci jotewaay.
       *[clean] Bësal ngir { $action ->
            [close] tëj
           *[open] ubbi
        } rapoor bu jotewaay bi. Gisuñu benn jafe-jafe ci jotewaay.
    }

editor-accessibility-label =
    { $status ->
        [violations] Gis nañu moytu jotewaay bu WCAG AA. Gis nañu { $count } moytu WCAG AA. Bësal ngir { $action ->
            [close] tëj
           *[open] ubbi
        } rapoor bu jotewaay bi.
        [advisories] Gisuñu benn moytu WCAG AA. Gis nañu { $count } xelal yu yokku ci jotewaay. Bësal ngir { $action ->
            [close] tëj
           *[open] ubbi
        } rapoor bu jotewaay bi.
       *[clean] Gisuñu benn moytu WCAG AA. Bësal ngir { $action ->
            [close] tëj
           *[open] ubbi
        } rapoor bu jotewaay bi.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML wersiyoŋ { $version }

editor-tab-help = Ndimbal ci kàddu gi
editor-tab-help-short = Kàddu
editor-tab-errors = Njumte
editor-tab-warnings = Artu
editor-tab-info = Xibaar
editor-tab-accessibility = Jotewaay
editor-tab-responses = Tontu yi ñu yónnee

editor-tab-with-count = { $label }: { $count }

editor-options = Tànneefu editër bi
editor-format-as-doenetml = Tegtal ni DoenetML
editor-format-as-xml = Tegtal ni XML


## The diagnostics panel

editor-diagnostic-line = Rëdd #{ $line }

editor-no-errors = Amul Njumte
editor-no-warnings = Amul Artu
editor-no-info = Amul Seetlu bu Xibaar

editor-show-info-annotations = Wone seetlu yu xibaar ci editër bi
editor-show-accessibility-annotations = Wone seetlu yu jotewaay ci editër bi

editor-accessibility-learn-more = Jàng ni Doenet di topptoo jotewaay

editor-accessibility-violations-heading = Moytu jotewaay ({ $standard })

editor-accessibility-other-heading = Yeneen jafe-jafe yu jotewaay
editor-none-found = Gisuñu dara


## Submitted responses

editor-no-responses = Yónneewuñu benn tontu ba tey
editor-response-answer-id = Turu Tontu bi
editor-response-response = Tontu
editor-response-credit = Njariñ
editor-response-submitted = Yónnee nañu ko


## The context-help panel

help-placeholder = Teg jumtukaay bi ci kaw turu tagi, sifaa walla { $ref } ngir am dokimaantasiyoŋ.

help-unsupported-ref-chain = Ndimbal ci reyfeerãs yu bare cër ni { $example } jàppagul.

help-unresolved-ref =
    { $reason ->
        [notFound] Gisuñu dara ci reyfeerãs bi: { $ref }.
        [multiple] Gis nañu ay lu bare ci reyfeerãs bi: { $ref }.
       *[indeterminate] Mënuñu wóoral lu { $ref } di tudd.
    }

help-learn-about-references = Jàng ci reyfeerãs yi →
help-reference-page = Xëtu reyfeerãs →

help-suggestions-header =
    { $location ->
        [inside] Ci biir { $element }
       *[top] Ci kaw kaw
    }{ $allowed ->
        [none] { " — dara du fi dugg." }
        [text] { " — bindal mbind fii." }
        [text-and-components] { " — bindal mbind fii, walla jéemal:" }
       *[components] { " — lu ngeen mën a jéem:" }
    }

help-suggestions-footer = Bësal { $shortcut } ngir gis { $total } elemaa yépp.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } ab reyfeerãs la ci { $target }.
       *[other] { $ref } ab reyfeerãs la ci { $target } (rëdd { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } moo ko tudde { $role }.
       *[other] { $owner } moo ko tudde { $role } ci rëdd { $line }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } ab reyfeerãs la ci sifaa { $property } bu { $element }.
       *[other] { $ref } ab reyfeerãs la ci sifaa { $property } bu { $element } (rëdd { $line }).
    }

help-kind-attribute = sifaa
help-kind-snippet = tuutal
help-kind-array-entry = duggu tabalo

help-default = Bu ndogal:
help-active-default = Bu ndogal bi jariñu:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Nattu yi ñu may (benn ci elemaa bu nekk):
       *[other] Nattu yi ñu may:
    }

help-suggested-values = Nattu yi ñu digal:

help-inserts = Dafay dugal:

help-coordinates = Koordone:

help-type = Xeet:

help-resolved-style = Estil bi ñu wóoral (styleNumber { $styleNumber }):

help-resolved-function-names = Turu fonksiyoŋ yi ñu wóoral:
help-reset-list = Lim bi ñuy delloo ci duggu bii:
help-added-on-input = Li ñu yokk ci duggu bii:
help-removed-on-input = Li ñu dindi ci duggu bii:

help-reset-overrides = { $reset } dafay raw { $additional } ak { $removed }.
