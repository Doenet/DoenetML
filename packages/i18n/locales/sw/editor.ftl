# Swahili editor and language-server surfaces. Translated from
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
# Swahili has two plural categories and marks number on the noun with a class
# prefix, so the counted messages keep their selects.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Weka Upya
       *[update] Sasisha
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } Kionyeshi
       *[other] { $word } Kionyeshi { $shortcut }
    }


## The variant picker

editor-variant = Toleo
editor-variant-filter = Chuja...
editor-variant-next = Chagua toleo linalofuata
editor-variant-previous = Chagua toleo lililotangulia


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Ukiukaji wa ufikivu wa WCAG AA umebainika. Bofya ili { $action ->
            [close] kufunga
           *[open] kufungua
        } ripoti ya ufikivu.
        [advisories] Bofya ili { $action ->
            [close] kufunga
           *[open] kufungua
        } ripoti ya ufikivu. Hakuna ukiukaji wa WCAG AA uliopatikana, lakini kuna mapendekezo ya ziada ya ufikivu.
       *[clean] Bofya ili { $action ->
            [close] kufunga
           *[open] kufungua
        } ripoti ya ufikivu. Hakuna masuala ya ufikivu yaliyopatikana.
    }

editor-accessibility-label =
    { $status ->
        [violations] Ukiukaji wa ufikivu wa WCAG AA umebainika. { $count ->
            [one] Ukiukaji { $count } wa WCAG AA umepatikana
           *[other] Ukiukaji { $count } wa WCAG AA umepatikana
        }. Bofya ili { $action ->
            [close] kufunga
           *[open] kufungua
        } ripoti ya ufikivu.
        [advisories] Hakuna ukiukaji wa WCAG AA uliobainika. { $count ->
            [one] Pendekezo { $count } la ziada la ufikivu limepatikana
           *[other] Mapendekezo { $count } ya ziada ya ufikivu yamepatikana
        }. Bofya ili { $action ->
            [close] kufunga
           *[open] kufungua
        } ripoti ya ufikivu.
       *[clean] Hakuna ukiukaji wa WCAG AA uliobainika. Bofya ili { $action ->
            [close] kufunga
           *[open] kufungua
        } ripoti ya ufikivu.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML toleo { $version }

editor-tab-help = Msaada kulingana na muktadha
editor-tab-help-short = Muktadha
editor-tab-errors = Hitilafu
editor-tab-warnings = Maonyo
editor-tab-info = Taarifa
editor-tab-accessibility = Ufikivu
editor-tab-responses = Majibu yaliyowasilishwa

editor-tab-with-count = { $label }: { $count }

editor-options = Chaguo za kihariri
editor-format-as-doenetml = Panga kama DoenetML
editor-format-as-xml = Panga kama XML


## The diagnostics panel

editor-diagnostic-line = Mstari #{ $line }

editor-no-errors = Hakuna Hitilafu
editor-no-warnings = Hakuna Maonyo
editor-no-info = Hakuna Uchunguzi wa Taarifa

editor-show-info-annotations = Onyesha uchunguzi wa taarifa katika kihariri
editor-show-accessibility-annotations = Onyesha uchunguzi wa ufikivu katika kihariri

editor-accessibility-learn-more = Jifunze jinsi Doenet inavyoshughulikia ufikivu

editor-accessibility-violations-heading = Ukiukaji wa ufikivu ({ $standard })

editor-accessibility-other-heading = Masuala mengine ya ufikivu
editor-none-found = Hakuna kilichopatikana


## Submitted responses

editor-no-responses = Bado hakuna majibu yaliyowasilishwa
editor-response-answer-id = Kitambulisho cha Jibu
editor-response-response = Jibu
editor-response-credit = Alama
editor-response-submitted = Limewasilishwa


## The context-help panel

help-placeholder = Weka kielekezi juu ya jina la tagi, sifa au { $ref } ili kupata nyaraka.

help-unsupported-ref-chain = Msaada kwa marejeleo ya sehemu nyingi kama { $example } bado hauungwi mkono.

help-unresolved-ref =
    { $reason ->
        [notFound] Hakuna kirejelewa kilichopatikana kwa rejeleo: { $ref }.
        [multiple] Virejelewa vingi vimepatikana kwa rejeleo: { $ref }.
       *[indeterminate] Kirejelewa cha { $ref } hakikuweza kubainishwa.
    }

help-learn-about-references = Jifunze kuhusu marejeleo →
help-reference-page = Ukurasa wa marejeleo →

help-suggestions-header =
    { $location ->
        [inside] Ndani ya { $element }
       *[top] Katika ngazi ya juu
    }{ $allowed ->
        [none] { " — hakuna kinachowekwa hapa." }
        [text] { " — andika maandishi hapa." }
        [text-and-components] { " — andika maandishi hapa, au jaribu:" }
       *[components] { " — mambo ya kujaribu:" }
    }

help-suggestions-footer = Bonyeza { $shortcut } ili kuona vipengele vyote { $total }.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } ni rejeleo la { $target }.
       *[other] { $ref } ni rejeleo la { $target } (mstari { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Limetambulishwa na { $owner } kama { $role }.
       *[other] Limetambulishwa na { $owner } kwenye mstari { $line } kama { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } ni rejeleo la sifa { $property } ya { $element }.
       *[other] { $ref } ni rejeleo la sifa { $property } ya { $element } (mstari { $line }).
    }

help-kind-attribute = sifa
help-kind-snippet = kijisehemu
help-kind-array-entry = ingizo la safu

help-default = Chaguo-msingi:
help-active-default = Chaguo-msingi linalotumika:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Thamani zinazoruhusiwa (moja kwa kila kipengee):
       *[other] Thamani zinazoruhusiwa:
    }

help-suggested-values = Thamani zinazopendekezwa:

help-inserts = Huingiza:

help-coordinates =
    { $count ->
        [one] Kiratibu:
       *[other] Viratibu:
    }

help-type = Aina:

help-resolved-style = Mtindo uliobainishwa (styleNumber { $styleNumber }):

help-resolved-function-names = Majina ya fanksheni yaliyobainishwa:
help-reset-list = Orodha inayowekwa upya kwenye ingizo hili:
help-added-on-input = Yaliyoongezwa kwenye ingizo hili:
help-removed-on-input = Yaliyoondolewa kwenye ingizo hili:

help-reset-overrides = { $reset } hupitisha { $additional } na { $removed }.
