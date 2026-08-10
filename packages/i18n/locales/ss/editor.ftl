# Swati editor and language-server surfaces: the footer, the diagnostics panel,
# the variant picker, the accessibility button, and the context-help panel
# beside them. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
#
# `WCAG`, `WCAG AA`, `DoenetML`, `XML` and `styleNumber` are names rather than
# words and stay as they stand.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Setja kabusha
       *[update] Buyeketa
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } Umbukisi
       *[other] { $word } Umbukisi { $shortcut }
    }


## The variant picker

editor-variant = Luhlobo

editor-variant-filter = Hlunga…

editor-variant-next = Khetsa luhlobo lolulandzelako

editor-variant-previous = Khetsa luhlobo lolwendlulile


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Kutfolwe kwephulwa kwe-WCAG AA kwekufinyeleleka. Chafata kute { $action ->
            [close] uvale
           *[open] uvule
        } umbiko wekufinyeleleka.
        [advisories] Chafata kute { $action ->
            [close] uvale
           *[open] uvule
        } umbiko wekufinyeleleka. Akukho kwephulwa kwe-WCAG AA lokutfolakele, kodvwa kunetincomo letengetiwe tekufinyeleleka.
       *[clean] Chafata kute { $action ->
            [close] uvale
           *[open] uvule
        } umbiko wekufinyeleleka. Akukho tinkinga tekufinyeleleka letitfolakele.
    }

editor-accessibility-label =
    { $status ->
        [violations] Kutfolwe kwephulwa kwe-WCAG AA kwekufinyeleleka. Kutfolwe { $count ->
            [one] kwephulwa lokungu-{ $count } kwe-WCAG AA
           *[other] kwephulwa lokungu-{ $count } kwe-WCAG AA
        }. Chafata kute { $action ->
            [close] uvale
           *[open] uvule
        } umbiko wekufinyeleleka.
        [advisories] Akukho kwephulwa kwe-WCAG AA lokutfolakele. Kutfolwe { $count ->
            [one] sincomo lesingu-{ $count } lesengetiwe sekufinyeleleka
           *[other] tincomo letingu-{ $count } letengetiwe tekufinyeleleka
        }. Chafata kute { $action ->
            [close] uvale
           *[open] uvule
        } umbiko wekufinyeleleka.
       *[clean] Akukho kwephulwa kwe-WCAG AA lokutfolakele. Chafata kute { $action ->
            [close] uvale
           *[open] uvule
        } umbiko wekufinyeleleka.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Invesheni ye-DoenetML { $version }

editor-tab-help = Lusito lwesimo
editor-tab-help-short = Simo
editor-tab-errors = Emaphutsa
editor-tab-warnings = Tecwayiso
editor-tab-info = Lwati
editor-tab-accessibility = Kufinyeleleka
editor-tab-responses = Timphendvulo letitfunyelwe

editor-tab-with-count = { $label }: { $count }

editor-options = Tinketselo temhleli
editor-format-as-doenetml = Hlela njenge-DoenetML
editor-format-as-xml = Hlela njenge-XML


## The diagnostics panel

editor-diagnostic-line = Umudvwa #{ $line }

editor-no-errors = Akukho Maphutsa
editor-no-warnings = Akukho Tecwayiso
editor-no-info = Akukho Lwati

editor-show-info-annotations = Khombisa lwati kumhleli
editor-show-accessibility-annotations = Khombisa tecwayiso tekufinyeleleka kumhleli

editor-accessibility-learn-more = Funda kutsi i-Doenet iyibuka njani inkinga yekufinyeleleka

editor-accessibility-violations-heading = Kwephulwa kwekufinyeleleka ({ $standard })

editor-accessibility-other-heading = Letinye tinkinga tekufinyeleleka
editor-none-found = Akukho lokutfolakele


## Submitted responses

editor-no-responses = Kute timphendvulo letitfunyelwe kuze kube nyalo
editor-response-answer-id = I-ID Yemphendvulo
editor-response-response = Imphendvulo
editor-response-credit = Emamaki
editor-response-submitted = Kutfunyelwe


## The context-help panel

help-placeholder = Beka indzawo yekubhala elibitweni lethegi, esicini, nobe ku-{ $ref } kute utfole umculu.

help-unsupported-ref-chain = Lusito lwetinkhomba letinetincenye letinyenti letifana ne-{ $example } alukakasekelwa.

help-unresolved-ref =
    { $reason ->
        [notFound] Akukho lokutfolakele kulenkhomba: { $ref }.
        [multiple] Kutfolwe tintfo letinyenti kulenkhomba: { $ref }.
       *[indeterminate] Loko { $ref } lokukhombako akukhonakalanga kutfolakala.
    }

help-learn-about-references = Funda ngetinkhomba →
help-reference-page = Likhasi lenkhomba →

help-suggestions-header =
    { $location ->
        [inside] Ngekhatsi kwe-{ $element }
       *[top] Etikwako konkhe
    }{ $allowed ->
        [none] { " — akukho lokuya lapha." }
        [text] { " — bhala umbhalo lapha." }
        [text-and-components] { " — bhala umbhalo lapha, nobe uzame:" }
       *[components] { " — tintfo longatizama:" }
    }

help-suggestions-footer = Chafata { $shortcut } kute ubone tonkhe ticheme letingu-{ $total }.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } yinkhomba ye-{ $target }.
       *[other] { $ref } yinkhomba ye-{ $target } (umudvwa { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Yetfulwe ngu-{ $owner } njenge-{ $role }.
       *[other] Yetfulwe ngu-{ $owner } emudvweni { $line } njenge-{ $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } yinkhomba yesici se-{ $property } se-{ $element }.
       *[other] { $ref } yinkhomba yesici se-{ $property } se-{ $element } (umudvwa { $line }).
    }

help-kind-attribute = sici
help-kind-snippet = sicucu
help-kind-array-entry = kufakwa eluhlwini

help-default = Lokuvamile:
help-active-default = Lokuvamile lokusebentako:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Emanani lavunyelwe (linye ngelinye ntfo):
       *[other] Emanani lavunyelwe:
    }

help-suggested-values = Emanani lanconyiwe:

help-inserts = Ifaka:

help-coordinates =
    { $count ->
        [one] Sikhombakhatsi:
       *[other] Tikhombakhatsi:
    }

help-type = Luhlobo:

help-resolved-style = Sitayela lesitfolakele (styleNumber { $styleNumber }):

help-resolved-function-names = Emabito emisebenti latfolakele:
help-reset-list = Luhlu loluseteliwe kulokufakwako:
help-added-on-input = Lokungetiwe kulokufakwako:
help-removed-on-input = Lokususiwe kulokufakwako:

help-reset-overrides = { $reset } yengca { $additional } na-{ $removed }.
