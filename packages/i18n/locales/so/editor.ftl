# Somali editor and language-server surfaces. Translated from
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


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Dib u deji
       *[update] Cusboonaysii
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } daawadaha
       *[other] { $word } daawadaha { $shortcut }
    }


## The variant picker

editor-variant = Nooc
editor-variant-filter = Shaandhee...
editor-variant-next = Dooro nooca xiga
editor-variant-previous = Dooro nooca hore


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Waxaa la helay xadgudub helitaanka WCAG AA. Guji si aad u { $action ->
            [close] xirto
           *[open] furto
        } warbixinta helitaanka.
        [advisories] Guji si aad u { $action ->
            [close] xirto
           *[open] furto
        } warbixinta helitaanka. Xadgudub WCAG AA lama helin, laakiin waxaa jira talooyin kale oo helitaan ah.
       *[clean] Guji si aad u { $action ->
            [close] xirto
           *[open] furto
        } warbixinta helitaanka. Dhibaato helitaan ah lama helin.
    }

editor-accessibility-label =
    { $status ->
        [violations] Waxaa la helay xadgudub helitaanka WCAG AA. Waxaa la helay { $count ->
            [one] { $count } xadgudub WCAG AA
           *[other] { $count } xadgudub WCAG AA
        }. Guji si aad u { $action ->
            [close] xirto
           *[open] furto
        } warbixinta helitaanka.
        [advisories] Xadgudub WCAG AA lama helin. Waxaa la helay { $count ->
            [one] { $count } talo dheeraad ah oo helitaan ah
           *[other] { $count } talo dheeraad ah oo helitaan ah
        }. Guji si aad u { $action ->
            [close] xirto
           *[open] furto
        } warbixinta helitaanka.
       *[clean] Xadgudub WCAG AA lama helin. Guji si aad u { $action ->
            [close] xirto
           *[open] furto
        } warbixinta helitaanka.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Nooca DoenetML { $version }

editor-tab-help = Caawimaad ku saabsan meesha aad joogto
editor-tab-help-short = Xaalad
editor-tab-errors = Qaladaad
editor-tab-warnings = Digniino
editor-tab-info = Macluumaad
editor-tab-accessibility = Helitaan
editor-tab-responses = Jawaabaha la diray

editor-tab-with-count = { $label }: { $count }

editor-options = Doorashooyinka tifaftiraha
editor-format-as-doenetml = U qaabee sida DoenetML
editor-format-as-xml = U qaabee sida XML


## The diagnostics panel

editor-diagnostic-line = Sadarka { $line }

editor-no-errors = Qaladaad ma jiraan
editor-no-warnings = Digniino ma jiraan
editor-no-info = Macluumaad baaris ah ma jiraan

editor-show-info-annotations = Ku muuji macluumaadka baarista tifaftiraha
editor-show-accessibility-annotations = Ku muuji baarista helitaanka tifaftiraha

editor-accessibility-learn-more = Baro sida Doenet u wajaho helitaanka

editor-accessibility-violations-heading = Xadgudubyada helitaanka ({ $standard })

editor-accessibility-other-heading = Dhibaatooyin kale oo helitaan ah
editor-none-found = Waxba lama helin


## Submitted responses

editor-no-responses = Weli jawaabo la diray ma jiraan
editor-response-answer-id = Id-ga jawaabta
editor-response-response = Jawaab
editor-response-credit = Dhibco
editor-response-submitted = La diray


## The context-help panel

help-placeholder = Curseerka saar magac tag, sifo, ama { $ref } si aad u aragto dukumentiyada.

help-unsupported-ref-chain = Caawimaadda tixraacyada qaybo badan leh sida { $example } weli lama taageero.

help-unresolved-ref =
    { $reason ->
        [notFound] Wax lagu tixraacay lama helin tixraaca: { $ref }.
        [multiple] Waxaa la helay wax ka badan mid lagu tixraacay: { $ref }.
       *[indeterminate] Lama go’aamin karin waxa { $ref } tixraacayo.
    }

help-learn-about-references = Wax badan ka baro tixraacyada →
help-reference-page = Bogga tixraaca →

help-suggestions-header =
    { $location ->
        [inside] Gudaha { $element }
       *[top] Heerka sare
    }{ $allowed ->
        [none] { " — halkan waxba ma galaan." }
        [text] { " — halkan qoraal ku qor." }
        [text-and-components] { " — halkan qoraal ku qor, ama isku day:" }
       *[components] { " — waxaad isku dayi kartaa:" }
    }

help-suggestions-footer = Riix { $shortcut } si aad u aragto dhammaan { $total } qaybood.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } waa tixraac loo sameeyay { $target }.
       *[other] { $ref } waa tixraac loo sameeyay { $target } (sadarka { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Waxaa soo bandhigay { $owner } isagoo ah { $role }.
       *[other] Waxaa soo bandhigay { $owner } sadarka { $line } isagoo ah { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } waa tixraac loo sameeyay sifada { $property } ee { $element }.
       *[other] { $ref } waa tixraac loo sameeyay sifada { $property } ee { $element } (sadarka { $line }).
    }

help-kind-attribute = sifo
help-kind-snippet = qayb qoraal ah
help-kind-array-entry = gelin safaf ah

help-default = Qiimaha caadiga ah:
help-active-default = Qiimaha caadiga ah ee shaqeeya:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Qiimayaasha la ogol yahay (mid walba shay):
       *[other] Qiimayaasha la ogol yahay:
    }

help-suggested-values = Qiimayaasha la soo jeedinayo:

help-inserts = Gelinaya:

help-coordinates =
    { $count ->
        [one] Isu-duwaha:
       *[other] Isu-duwayaasha:
    }

help-type = Nooc:

help-resolved-style = Qaabka la go’aamiyay (styleNumber { $styleNumber }):

help-resolved-function-names = Magacyada howlaha la go’aamiyay:
help-reset-list = Liiska dib-u-dejinta ee gelintan:
help-added-on-input = Lagu daray gelintan:
help-removed-on-input = Laga saaray gelintan:

help-reset-overrides = { $reset } wuxuu ka mudan yahay { $additional } iyo { $removed }.
