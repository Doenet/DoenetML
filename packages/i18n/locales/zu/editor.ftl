# Zulu editor and language-server surfaces. Translated from
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
# name are identifiers, not prose, and stay as written. Zulu joins a borrowed
# noun to the word before it with a hyphen — «ye-DoenetML», «njenge-XML» — and
# the hyphen is this catalog's punctuation rather than part of the name.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Setha Kabusha
       *[update] Buyekeza
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } Isibonisi
       *[other] { $word } Isibonisi { $shortcut }
    }


## The variant picker

editor-variant = Uhlobo
editor-variant-filter = Hlunga...
editor-variant-next = Khetha uhlobo olulandelayo
editor-variant-previous = Khetha uhlobo olwedlule


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Kutholakale ukwephulwa kokufinyeleleka kwe-WCAG AA. Chofoza ukuze { $action ->
            [close] uvale
           *[open] uvule
        } umbiko wokufinyeleleka.
        [advisories] Chofoza ukuze { $action ->
            [close] uvale
           *[open] uvule
        } umbiko wokufinyeleleka. Akukho ukwephulwa kwe-WCAG AA okutholakele, kodwa kukhona ezinye izincomo zokufinyeleleka.
       *[clean] Chofoza ukuze { $action ->
            [close] uvale
           *[open] uvule
        } umbiko wokufinyeleleka. Azikho izinkinga zokufinyeleleka ezitholakele.
    }

editor-accessibility-label =
    { $status ->
        [violations] Kutholakale ukwephulwa kokufinyeleleka kwe-WCAG AA. { $count ->
            [one] Kutholakale ukwephulwa kwe-WCAG AA okungu-{ $count }
           *[other] Kutholakale ukwephulwa kwe-WCAG AA okungu-{ $count }
        }. Chofoza ukuze { $action ->
            [close] uvale
           *[open] uvule
        } umbiko wokufinyeleleka.
        [advisories] Akukho ukwephulwa kwe-WCAG AA okutholakele. { $count ->
            [one] Kutholakale isincomo esingu-{ $count } esengeziwe sokufinyeleleka
           *[other] Kutholakale izincomo ezingu-{ $count } ezengeziwe zokufinyeleleka
        }. Chofoza ukuze { $action ->
            [close] uvale
           *[open] uvule
        } umbiko wokufinyeleleka.
       *[clean] Akukho ukwephulwa kwe-WCAG AA okutholakele. Chofoza ukuze { $action ->
            [close] uvale
           *[open] uvule
        } umbiko wokufinyeleleka.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Inguqulo ye-DoenetML { $version }

editor-tab-help = Usizo oluhambisana nomongo
editor-tab-help-short = Umongo
editor-tab-errors = Amaphutha
editor-tab-warnings = Izixwayiso
editor-tab-info = Ulwazi
editor-tab-accessibility = Ukufinyeleleka
editor-tab-responses = Izimpendulo ezithunyelwe

editor-tab-with-count = { $label }: { $count }

editor-options = Izinketho zomhleli
editor-format-as-doenetml = Hlela njenge-DoenetML
editor-format-as-xml = Hlela njenge-XML


## The diagnostics panel

editor-diagnostic-line = Umugqa #{ $line }

editor-no-errors = Awekho Amaphutha
editor-no-warnings = Azikho Izixwayiso
editor-no-info = Alukho Ulwazi Lokuhlola

editor-show-info-annotations = Bonisa ukuhlola kolwazi kumhleli
editor-show-accessibility-annotations = Bonisa ukuhlola kokufinyeleleka kumhleli

editor-accessibility-learn-more = Funda ukuthi i-Doenet ikubheka kanjani ukufinyeleleka

editor-accessibility-violations-heading = Ukwephulwa kokufinyeleleka ({ $standard })

editor-accessibility-other-heading = Ezinye izinkinga zokufinyeleleka
editor-none-found = Akutholakalanga lutho


## Submitted responses

editor-no-responses = Azikho izimpendulo ezithunyelwe okwamanje
editor-response-answer-id = I-Id Yempendulo
editor-response-response = Impendulo
editor-response-credit = Amamaki
editor-response-submitted = Kuthunyelwe


## The context-help panel

help-placeholder = Beka ikhesa egameni lethegi, kusici noma ku-{ $ref } ukuze uthole imibhalo.

help-unsupported-ref-chain = Usizo lwezinkomba ezinezingxenye eziningi ezifana no-{ $example } alukasekelwa.

help-unresolved-ref =
    { $reason ->
        [notFound] Ayikho into ekhonjiwe etholakele kule nkomba: { $ref }.
        [multiple] Kutholakale izinto eziningi ezikhonjiwe kule nkomba: { $ref }.
       *[indeterminate] Into ekhonjwa ngu-{ $ref } ayikwazanga ukunqunywa.
    }

help-learn-about-references = Funda ngezinkomba →
help-reference-page = Ikhasi lezinkomba →

help-suggestions-header =
    { $location ->
        [inside] Ngaphakathi ku-{ $element }
       *[top] Ezingeni eliphezulu
    }{ $allowed ->
        [none] { " — akukho okuya lapha." }
        [text] { " — thayipha umbhalo lapha." }
        [text-and-components] { " — thayipha umbhalo lapha, noma uzame:" }
       *[components] { " — izinto ongazizama:" }
    }

help-suggestions-footer = Cindezela u-{ $shortcut } ukuze ubone zonke izingxenye ezingu-{ $total }.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] U-{ $ref } uyinkomba ku-{ $target }.
       *[other] U-{ $ref } uyinkomba ku-{ $target } (umugqa { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Wethulwe ngu-{ $owner } njenge-{ $role }.
       *[other] Wethulwe ngu-{ $owner } emugqeni { $line } njenge-{ $role }.
    }

help-property-is-reference =
    { $line ->
        [none] U-{ $ref } uyinkomba esicini { $property } se-{ $element }.
       *[other] U-{ $ref } uyinkomba esicini { $property } se-{ $element } (umugqa { $line }).
    }

help-kind-attribute = isici
help-kind-snippet = ucezu
help-kind-array-entry = ingeniso yohlu

help-default = Okuzenzakalelayo:
help-active-default = Okuzenzakalelayo okusebenzayo:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Amanani avunyelwe (elilodwa ngento ngayinye):
       *[other] Amanani avunyelwe:
    }

help-suggested-values = Amanani anconyiwe:

help-inserts = Ifaka:

help-coordinates =
    { $count ->
        [one] Isixhumanisi:
       *[other] Izixhumanisi:
    }

help-type = Uhlobo:

help-resolved-style = Isitayela esinqunyiwe (styleNumber { $styleNumber }):

help-resolved-function-names = Amagama emisebenzi anqunyiwe:
help-reset-list = Uhlu olusethwa kabusha kulokhu kufakwa:
help-added-on-input = Okwengezwe kulokhu kufakwa:
help-removed-on-input = Okususwe kulokhu kufakwa:

help-reset-overrides = U-{ $reset } udlula u-{ $additional } no-{ $removed }.
