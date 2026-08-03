# Xhosa editor and language-server surfaces. Translated from
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
# name are identifiers, not prose, and stay as written. Xhosa joins a borrowed
# noun to the word before it with a hyphen — «lwe-DoenetML», «ye-XML» — and the
# hyphen is this catalog's punctuation rather than part of the name.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Misela Kwakhona
       *[update] Hlaziya
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } Isibonisi
       *[other] { $word } Isibonisi { $shortcut }
    }


## The variant picker

editor-variant = Uhlobo
editor-variant-filter = Hluza...
editor-variant-next = Khetha uhlobo olulandelayo
editor-variant-previous = Khetha uhlobo olungaphambili


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Kufunyenwe ukwaphulwa kokufikeleleka kwe-WCAG AA. Cofa ukuze { $action ->
            [close] uvale
           *[open] uvule
        } ingxelo yokufikeleleka.
        [advisories] Cofa ukuze { $action ->
            [close] uvale
           *[open] uvule
        } ingxelo yokufikeleleka. Akukho kwaphulwa kwe-WCAG AA kufunyenweyo, kodwa kukho ezinye iingcebiso zokufikeleleka.
       *[clean] Cofa ukuze { $action ->
            [close] uvale
           *[open] uvule
        } ingxelo yokufikeleleka. Akukho ngxaki zokufikeleleka zifunyenweyo.
    }

editor-accessibility-label =
    { $status ->
        [violations] Kufunyenwe ukwaphulwa kokufikeleleka kwe-WCAG AA. { $count ->
            [one] Kufunyenwe ukwaphulwa kwe-WCAG AA okungu-{ $count }
           *[other] Kufunyenwe ukwaphulwa kwe-WCAG AA okungu-{ $count }
        }. Cofa ukuze { $action ->
            [close] uvale
           *[open] uvule
        } ingxelo yokufikeleleka.
        [advisories] Akukho kwaphulwa kwe-WCAG AA kufunyenweyo. { $count ->
            [one] Kufunyenwe ingcebiso engu-{ $count } eyongezelelweyo yokufikeleleka
           *[other] Kufunyenwe iingcebiso ezingu-{ $count } ezongezelelweyo zokufikeleleka
        }. Cofa ukuze { $action ->
            [close] uvale
           *[open] uvule
        } ingxelo yokufikeleleka.
       *[clean] Akukho kwaphulwa kwe-WCAG AA kufunyenweyo. Cofa ukuze { $action ->
            [close] uvale
           *[open] uvule
        } ingxelo yokufikeleleka.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Uguqulelo lwe-DoenetML { $version }

editor-tab-help = Uncedo oluhambelana nomxholo
editor-tab-help-short = Umxholo
editor-tab-errors = Iimpazamo
editor-tab-warnings = Izilumkiso
editor-tab-info = Ulwazi
editor-tab-accessibility = Ukufikeleleka
editor-tab-responses = Iimpendulo ezingenisiweyo

editor-tab-with-count = { $label }: { $count }

editor-options = Iinketho zomhleli
editor-format-as-doenetml = Yenza ifomathi ye-DoenetML
editor-format-as-xml = Yenza ifomathi ye-XML


## The diagnostics panel

editor-diagnostic-line = Umgca #{ $line }

editor-no-errors = Akukho Mpazamo
editor-no-warnings = Akukho Zilumkiso
editor-no-info = Akukho Zicwangciso Zolwazi

editor-show-info-annotations = Bonisa ukuhlolwa kolwazi kumhleli
editor-show-accessibility-annotations = Bonisa ukuhlolwa kokufikeleleka kumhleli

editor-accessibility-learn-more = Funda indlela i-Doenet ejonga ngayo ukufikeleleka

editor-accessibility-violations-heading = Ukwaphulwa kokufikeleleka ({ $standard })

editor-accessibility-other-heading = Ezinye iingxaki zokufikeleleka
editor-none-found = Akukho nto ifunyenweyo


## Submitted responses

editor-no-responses = Akukho mpendulo ingenisiweyo okwangoku
editor-response-answer-id = I-Id Yempendulo
editor-response-response = Impendulo
editor-response-credit = Amanqaku
editor-response-submitted = Ingenisiwe


## The context-help panel

help-placeholder = Beka ikhesa kwigama lethegi, kwimpawu okanye ku-{ $ref } ukuze ufumane amaxwebhu.

help-unsupported-ref-chain = Uncedo lweembekiselo ezinamacandelo amaninzi ezifana no-{ $example } aluxhaswa okwangoku.

help-unresolved-ref =
    { $reason ->
        [notFound] Akukho nto ibhekiselwe kuyo ifunyenweyo kule mbekiselo: { $ref }.
        [multiple] Kufunyenwe izinto ezininzi ekubhekiselwa kuzo kule mbekiselo: { $ref }.
       *[indeterminate] Into ebhekiselwa kuyo ngu-{ $ref } ayikwazanga ukumiselwa.
    }

help-learn-about-references = Funda ngeembekiselo →
help-reference-page = Iphepha leembekiselo →

help-suggestions-header =
    { $location ->
        [inside] Ngaphakathi ku-{ $element }
       *[top] Kwinqanaba eliphezulu
    }{ $allowed ->
        [none] { " — akukho nto iya apha." }
        [text] { " — chwetheza umbhalo apha." }
        [text-and-components] { " — chwetheza umbhalo apha, okanye uzame:" }
       *[components] { " — izinto onokuzizama:" }
    }

help-suggestions-footer = Cofa u-{ $shortcut } ukuze ubone onke amacandelo angu-{ $total }.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] U-{ $ref } yimbekiselo ku-{ $target }.
       *[other] U-{ $ref } yimbekiselo ku-{ $target } (umgca { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Waziswa ngu-{ $owner } njenge-{ $role }.
       *[other] Waziswa ngu-{ $owner } kumgca { $line } njenge-{ $role }.
    }

help-property-is-reference =
    { $line ->
        [none] U-{ $ref } yimbekiselo kwimpawu { $property } ye-{ $element }.
       *[other] U-{ $ref } yimbekiselo kwimpawu { $property } ye-{ $element } (umgca { $line }).
    }

help-kind-attribute = impawu
help-kind-snippet = isiqwenga
help-kind-array-entry = ungeniso lweluhlu

help-default = Okuzenzekelayo:
help-active-default = Okuzenzekelayo okusebenzayo:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Amaxabiso avumelekileyo (elinye kwinto nganye):
       *[other] Amaxabiso avumelekileyo:
    }

help-suggested-values = Amaxabiso acetywayo:

help-inserts = Ifaka:

help-coordinates =
    { $count ->
        [one] Ikhowodinethi:
       *[other] Iikhowodinethi:
    }

help-type = Uhlobo:

help-resolved-style = Isimbo esimiselweyo (styleNumber { $styleNumber }):

help-resolved-function-names = Amagama emisebenzi amiselweyo:
help-reset-list = Uluhlu olumiselwa kwakhona kolu ngeniso:
help-added-on-input = Okongezwe kolu ngeniso:
help-removed-on-input = Okususwe kolu ngeniso:

help-reset-overrides = U-{ $reset } udlula u-{ $additional } no-{ $removed }.
