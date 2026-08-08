# Tongan editor and language-server surfaces. Translated from
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
# The fakauʻa «ʻ» is U+02BB and the toloi is the macron; see `chrome.ftl`.
# Tongan marks no number on the noun, so a `{ $count -> … }` whose two English
# branches differ only in the noun renders one string here and the select is
# dropped.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Fakafoki
       *[update] Fakafoʻou
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } ʻa e mata sio
       *[other] { $word } ʻa e mata sio { $shortcut }
    }


## The variant picker

editor-variant = Kehekehe
editor-variant-filter = Fakamama…
editor-variant-next = Fili ʻa e kehekehe hoko
editor-variant-previous = Fili ʻa e kehekehe kimuʻa


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Naʻe maʻu ha maumauʻi ʻo e aʻusia WCAG AA. Lomiʻi ke { $action ->
            [close] tāpuni
           *[open] fakaava
        } ʻa e lipooti aʻusia.
        [advisories] Lomiʻi ke { $action ->
            [close] tāpuni
           *[open] fakaava
        } ʻa e lipooti aʻusia. Naʻe ʻikai maʻu ha maumauʻi WCAG AA, ka ʻoku ʻi ai ha fokotuʻu aʻusia kehe.
       *[clean] Lomiʻi ke { $action ->
            [close] tāpuni
           *[open] fakaava
        } ʻa e lipooti aʻusia. Naʻe ʻikai maʻu ha palopalema aʻusia.
    }

# No select on `$count` inside the branches: «maumauʻi» and «fokotuʻu» are the
# same words for one and for many.
editor-accessibility-label =
    { $status ->
        [violations] Naʻe maʻu ha maumauʻi ʻo e aʻusia WCAG AA. Naʻe maʻu ʻa e maumauʻi WCAG AA ʻe { $count }. Lomiʻi ke { $action ->
            [close] tāpuni
           *[open] fakaava
        } ʻa e lipooti aʻusia.
        [advisories] Naʻe ʻikai maʻu ha maumauʻi WCAG AA. Naʻe maʻu ʻa e fokotuʻu aʻusia kehe ʻe { $count }. Lomiʻi ke { $action ->
            [close] tāpuni
           *[open] fakaava
        } ʻa e lipooti aʻusia.
       *[clean] Naʻe ʻikai maʻu ha maumauʻi WCAG AA. Lomiʻi ke { $action ->
            [close] tāpuni
           *[open] fakaava
        } ʻa e lipooti aʻusia.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Fatu DoenetML { $version }

editor-tab-help = Tokoni fakatatau ki he tuʻunga
editor-tab-help-short = Tuʻunga
editor-tab-errors = Hala
editor-tab-warnings = Fakatokanga
editor-tab-info = Fakamatala
editor-tab-accessibility = Aʻusia
editor-tab-responses = Ngaahi tali kuo ʻave

editor-tab-with-count = { $label }: { $count }

editor-options = Ngaahi fili ʻo e tohitaʻu
editor-format-as-doenetml = Fokotuʻutuʻu ko e DoenetML
editor-format-as-xml = Fokotuʻutuʻu ko e XML


## The diagnostics panel

editor-diagnostic-line = Laine #{ $line }

editor-no-errors = ʻIkai ha hala
editor-no-warnings = ʻIkai ha fakatokanga
editor-no-info = ʻIkai ha fakamatala fakasivi

editor-show-info-annotations = Fakahā ʻa e fakamatala fakasivi ʻi he tohitaʻu
editor-show-accessibility-annotations = Fakahā ʻa e fakasivi aʻusia ʻi he tohitaʻu

editor-accessibility-learn-more = Ako pe ʻoku fakahoko fēfē ʻe Doenet ʻa e aʻusia

editor-accessibility-violations-heading = Maumauʻi ʻo e aʻusia ({ $standard })

editor-accessibility-other-heading = Palopalema aʻusia kehe
editor-none-found = ʻIkai maʻu ha taha


## Submitted responses

editor-no-responses = ʻOku teʻeki ke ʻi ai ha tali kuo ʻave
editor-response-answer-id = Id ʻo e tali
editor-response-response = Tali
editor-response-credit = Mataʻitohi
editor-response-submitted = Kuo ʻave


## The context-help panel

help-placeholder = Tuku ʻa e kāsolo ki ha hingoa tag, ha ʻatilipiuti, pe ko e { $ref } ki he fakamatala.

help-unsupported-ref-chain = ʻOku teʻeki poupouʻi ʻa e tokoni ki he ngaahi fakasino konga lahi hangē ko e { $example }.

help-unresolved-ref =
    { $reason ->
        [notFound] Naʻe ʻikai maʻu ha meʻa ʻoku tuhu ki ai ʻa e fakasino: { $ref }.
        [multiple] Naʻe maʻu ha meʻa lahi ʻoku tuhu ki ai ʻa e fakasino: { $ref }.
       *[indeterminate] Naʻe ʻikai lava ke fakapapauʻi pe ko e hā ʻoku tuhu ki ai ʻa e { $ref }.
    }

help-learn-about-references = Ako fekauʻaki mo e ngaahi fakasino →
help-reference-page = Peesi fakasino →

help-suggestions-header =
    { $location ->
        [inside] ʻI loto ʻi he { $element }
       *[top] ʻI he tuʻunga ʻi ʻolunga
    }{ $allowed ->
        [none] { " — ʻoku ʻikai ha meʻa ʻe lava ke tuku heni." }
        [text] { " — tohi ha tohi heni." }
        [text-and-components] { " — tohi ha tohi heni, pe ʻahiʻahiʻi:" }
       *[components] { " — ngaahi meʻa ke ʻahiʻahiʻi:" }
    }

help-suggestions-footer = Lomiʻi ʻa e { $shortcut } ke sio ki he konga kotoa ʻe { $total }.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] Ko e { $ref } ko e fakasino ia ki he { $target }.
       *[other] Ko e { $ref } ko e fakasino ia ki he { $target } (laine { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Naʻe ʻomi ʻe he { $owner } ko e { $role }.
       *[other] Naʻe ʻomi ʻe he { $owner } ʻi he laine { $line } ko e { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] Ko e { $ref } ko e fakasino ia ki he tuʻunga { $property } ʻo e { $element }.
       *[other] Ko e { $ref } ko e fakasino ia ki he tuʻunga { $property } ʻo e { $element } (laine { $line }).
    }

help-kind-attribute = ʻatilipiuti
help-kind-snippet = konga koti
help-kind-array-entry = hū ki he array

help-default = Angamaheni:
help-active-default = Angamaheni ngāue:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Mahuʻinga ngofua (taha ki he meʻa taki taha):
       *[other] Mahuʻinga ngofua:
    }

help-suggested-values = Mahuʻinga fokotuʻu:

help-inserts = ʻOku fakahū:

# No select: «kōtinaite» is the same word for one and for many.
help-coordinates = Kōtinaite:

help-type = Faʻahinga:

help-resolved-style = Sitaila kuo fakapapauʻi (styleNumber { $styleNumber }):

help-resolved-function-names = Hingoa ngāue fika kuo fakapapauʻi:
help-reset-list = Lisi fakafoki ʻi he input ko ʻeni:
help-added-on-input = Naʻe tānaki ʻi he input ko ʻeni:
help-removed-on-input = Naʻe toʻo ʻi he input ko ʻeni:

help-reset-overrides = ʻOku fetongi ʻe he { $reset } ʻa e { $additional } mo e { $removed }.
