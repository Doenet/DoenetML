# Rarotongan / Cook Islands Māori (Te reo Māori Kūki ʻĀirani) editor and
# language-server surfaces. Translated from `locales/en/editor.ftl`, which is
# the source of truth: `lint:i18n` rejects a key that does not exist there,
# and reports a key that exists there but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# The variety (the Rarotonga standard), the orthography, the amata character
# (U+02BB) and the correspondence table against `locales/mi` and `locales/ty`
# are set out once in the header of `chrome.ftl`. The frame words are
# `diagnostics.ftl`'s and the words for the things the core draws are
# `content.ftl`'s `noun` table; neither is re-decided here.
#
# `WCAG`, `WCAG AA`, `DoenetML`, `XML` and `styleNumber` are names and
# identifiers and stay in English, as do the element, attribute and property
# names this panel quotes back from the author's own source. `$shortcut` is a
# key combination and stays as written.
#
# **Number.** A Rarotongan noun takes no ending for number, so the two
# accessibility counters in `editor-accessibility-label` and the coordinate
# heading in `help-coordinates` carry a single unselected form where English
# selects on `one` and `other`. `Intl.PluralRules("rar")` has no CLDR data and
# resolves against the runtime's default locale, so a `[two]`, `[few]` or
# `[many]` branch would be text nothing could select. Every **symbolic**
# selector — `$action`, `$status`, `$location`, `$allowed`, `$reason`,
# `$line`, `$perItem`, `$shortcut` — keeps all of English's branches with the
# keys copied letter for letter, because the core matches against them.
#
# **Coinages in this file, for a reviewer to confirm or replace:** «tātā
# ʻāpi» editor (writing-tool), «ʻakaʻouʻanga» update, «ʻoki» reset,
# «tāʻiriʻanga» reference, «tumu tuatua» source, «ʻāito» to fit or match.
# «Kōteti» for a key combination is not used: the shortcut arrives already
# written and is never described here.
#
# **Two things this seed could not do well.** The four `editor-tab-*` labels
# have to fit a tab with room for about one word, and Rarotongan's derived
# nouns are long — «ʻAkakiteʻanga» for *Info* is already at the limit, and a
# reviewer who knows a shorter everyday word should use it. And
# `help-name-summary` is punctuation on its own when `$name` is empty; the em
# dash is kept because nothing in Rarotongan punctuation replaces it.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] ʻOki
       *[update] ʻAkaʻou
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } i te ʻakaraʻanga
       *[other] { $word } i te ʻakaraʻanga { $shortcut }
    }


## The variant picker

editor-variant = Variant
editor-variant-filter = Tātā i konei...
editor-variant-next = ʻIki i te variant i muri
editor-variant-previous = ʻIki i te variant i mua


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Kua kiteʻa tētai takingaʻanga i te ture urunga WCAG AA. E pāto kia { $action ->
            [close] ʻōpani
           *[open] ʻuaki
        } i te rīpōti urunga.
        [advisories] E pāto kia { $action ->
            [close] ʻōpani
           *[open] ʻuaki
        } i te rīpōti urunga. Kāre e takingaʻanga WCAG AA i kiteʻa, inārā tē vai nei tētai au ākonoʻanga urunga ke.
       *[clean] E pāto kia { $action ->
            [close] ʻōpani
           *[open] ʻuaki
        } i te rīpōti urunga. Kāre e manamanatā urunga i kiteʻa.
    }

# No select on `$count`: «takingaʻanga» and «ākonoʻanga» take no ending for
# number, so the count stands in front of an unchanged noun.
editor-accessibility-label =
    { $status ->
        [violations] Kua kiteʻa tētai takingaʻanga i te ture urunga WCAG AA. Kua kiteʻa e { $count } takingaʻanga WCAG AA. E pāto kia { $action ->
            [close] ʻōpani
           *[open] ʻuaki
        } i te rīpōti urunga.
        [advisories] Kāre e takingaʻanga WCAG AA i kiteʻa. Kua kiteʻa e { $count } ākonoʻanga urunga ke. E pāto kia { $action ->
            [close] ʻōpani
           *[open] ʻuaki
        } i te rīpōti urunga.
       *[clean] Kāre e takingaʻanga WCAG AA i kiteʻa. E pāto kia { $action ->
            [close] ʻōpani
           *[open] ʻuaki
        } i te rīpōti urunga.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML version { $version }

editor-tab-help = Tauturu e tau ki te ngāʻi
editor-tab-help-short = Ngāʻi
editor-tab-errors = Tarevake
editor-tab-warnings = ʻAkamatakite
editor-tab-info = ʻAkakiteʻanga
editor-tab-accessibility = Urunga
editor-tab-responses = Au pauʻanga i tukuʻia

editor-tab-with-count = { $label }: { $count }

editor-options = Au ʻikiʻanga tātā ʻāpi
editor-format-as-doenetml = ʻAkatū ei DoenetML
editor-format-as-xml = ʻAkatū ei XML


## The diagnostics panel

editor-diagnostic-line = Rārangi #{ $line }

editor-no-errors = Kāre e tarevake
editor-no-warnings = Kāre e ʻakamatakite
editor-no-info = Kāre e ʻakakiteʻanga

editor-show-info-annotations = ʻAkaʻite i te au ʻakakiteʻanga i roto i te tātā ʻāpi
editor-show-accessibility-annotations = ʻAkaʻite i te au ʻakakiteʻanga urunga i roto i te tātā ʻāpi

editor-accessibility-learn-more = E ʻāpiʻi mei te aʻa te tū o Doenet ki te urunga

editor-accessibility-violations-heading = Au takingaʻanga urunga ({ $standard })

editor-accessibility-other-heading = Au manamanatā urunga ke
editor-none-found = Kāre e mea i kiteʻa


## Submitted responses

editor-no-responses = Kāre rai e pauʻanga i tukuʻia
editor-response-answer-id = Answer Id
editor-response-response = Pauʻanga
editor-response-credit = Tāpura
editor-response-submitted = Kua tukuʻia


## The context-help panel

help-placeholder = E tuku i te ʻakaraʻanga ki runga i tētai ingoa tag, tētai tū, me kore tētai { $ref } nō te ʻakakiteʻanga.

help-unsupported-ref-chain = Kāre rai i tauturuʻia te tauturu nō te au tāʻiriʻanga tuʻanga maʻata mei te { $example }.

help-unresolved-ref =
    { $reason ->
        [notFound] Kāre e mea i kiteʻa nō te tāʻiriʻanga: { $ref }.
        [multiple] E maʻata te mea i kiteʻa nō te tāʻiriʻanga: { $ref }.
       *[indeterminate] Kāre i rauka i te ʻakataka i tētai mea nō te { $ref }.
    }

help-learn-about-references = E ʻāpiʻi nō te au tāʻiriʻanga →
help-reference-page = Kapi tāʻiriʻanga →

help-suggestions-header =
    { $location ->
        [inside] I roto i te { $element }
       *[top] I te ngāʻi teitei
    }{ $allowed ->
        [none] { " — kāre e mea ka tau ki konei." }
        [text] { " — e tātā tuatua ki konei." }
        [text-and-components] { " — e tātā tuatua ki konei, me kore e tāmata i teia:" }
       *[components] { " — au mea ka tāmata:" }
    }

help-suggestions-footer = E pāto i te { $shortcut } kia kite i te { $total } ʻapinga katoa.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] E tāʻiriʻanga te { $ref } ki te { $target }.
       *[other] E tāʻiriʻanga te { $ref } ki te { $target } (rārangi { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Kua ʻakaʻitiʻia e te { $owner } ei { $role }.
       *[other] Kua ʻakaʻitiʻia e te { $owner } i te rārangi { $line } ei { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] E tāʻiriʻanga te { $ref } ki te { $property } property o te { $element }.
       *[other] E tāʻiriʻanga te { $ref } ki te { $property } property o te { $element } (rārangi { $line }).
    }

help-kind-attribute = tū
help-kind-snippet = tuʻanga tuatua
help-kind-array-entry = ʻurunga array

help-default = Tumau:
help-active-default = Tumau angaʻanga:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Au tau ka tika (okotaʻi nō tēnā mea):
       *[other] Au tau ka tika:
    }

help-suggested-values = Au tau ka tau:

help-inserts = Tē tuku nei:

# No select: «ngāʻi tāpaʻo» takes no ending for number, so English's two
# headings are one word here.
help-coordinates = Ngāʻi tāpaʻo:

help-type = Tūʻanga:

help-resolved-style = Style i ʻakatakaʻia (styleNumber { $styleNumber }):

help-resolved-function-names = Au ingoa function i ʻakatakaʻia:
help-reset-list = Tāpura ʻoki i runga i teia input:
help-added-on-input = Kua tāpiriʻia i runga i teia input:
help-removed-on-input = Kua ʻiritiʻia i runga i teia input:

help-reset-overrides = Tē ʻakateretere nei te { $reset } i te { $additional } e te { $removed }.
