# Maltese editor and language-server surfaces. Translated from
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
# Maltese counts in five plural categories, so the accessibility counts below
# are written out in all five; `many` is the 11–19 branch and takes a singular
# noun with an `-il` on the numeral, and `other` the bare singular.
# `help-coordinates` prints no number beside its noun, so it keeps the two
# branches the English source has.
#
# `help-suggestions-footer` puts its count in brackets rather than before the
# noun: the definite article assimilates to the word after it, and which form
# `l-` takes before a spelled-out numeral is not something this catalog can
# know from a digit.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Irrisettja
       *[update] Aġġorna
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } il-viewer
       *[other] { $word } il-viewer { $shortcut }
    }


## The variant picker

editor-variant = Varjant
editor-variant-filter = Iffiltra…
editor-variant-next = Agħżel il-varjant li jmiss
editor-variant-previous = Agħżel il-varjant ta' qabel


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Instab ksur tal-aċċessibbiltà WCAG AA. Ikklikkja biex { $action ->
            [close] tagħlaq
           *[open] tiftaħ
        } ir-rapport tal-aċċessibbiltà.
        [advisories] Ikklikkja biex { $action ->
            [close] tagħlaq
           *[open] tiftaħ
        } ir-rapport tal-aċċessibbiltà. Ma nstab l-ebda ksur ta' WCAG AA, iżda hemm rakkomandazzjonijiet addizzjonali dwar l-aċċessibbiltà.
       *[clean] Ikklikkja biex { $action ->
            [close] tagħlaq
           *[open] tiftaħ
        } ir-rapport tal-aċċessibbiltà. Ma nstabet l-ebda problema ta' aċċessibbiltà.
    }

editor-accessibility-label =
    { $status ->
        [violations] Instab ksur tal-aċċessibbiltà WCAG AA. Instab { $count ->
            [one] { $count } ksur ta' WCAG AA
            [two] { $count } każijiet ta' ksur ta' WCAG AA
            [few] { $count } każijiet ta' ksur ta' WCAG AA
            [many] { $count }-il ksur ta' WCAG AA
           *[other] { $count } ksur ta' WCAG AA
        }. Ikklikkja biex { $action ->
            [close] tagħlaq
           *[open] tiftaħ
        } ir-rapport tal-aċċessibbiltà.
        [advisories] Ma nstab l-ebda ksur ta' WCAG AA. Instab { $count ->
            [one] { $count } rakkomandazzjoni addizzjonali dwar l-aċċessibbiltà
            [two] { $count } rakkomandazzjonijiet addizzjonali dwar l-aċċessibbiltà
            [few] { $count } rakkomandazzjonijiet addizzjonali dwar l-aċċessibbiltà
            [many] { $count }-il rakkomandazzjoni addizzjonali dwar l-aċċessibbiltà
           *[other] { $count } rakkomandazzjoni addizzjonali dwar l-aċċessibbiltà
        }. Ikklikkja biex { $action ->
            [close] tagħlaq
           *[open] tiftaħ
        } ir-rapport tal-aċċessibbiltà.
       *[clean] Ma nstab l-ebda ksur ta' WCAG AA. Ikklikkja biex { $action ->
            [close] tagħlaq
           *[open] tiftaħ
        } ir-rapport tal-aċċessibbiltà.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Verżjoni { $version } ta' DoenetML

editor-tab-help = Għajnuna skont il-kuntest
editor-tab-help-short = Kuntest
editor-tab-errors = Żbalji
editor-tab-warnings = Twissijiet
editor-tab-info = Informazzjoni
editor-tab-accessibility = Aċċessibbiltà
editor-tab-responses = Tweġibiet mibgħuta

editor-tab-with-count = { $label }: { $count }

editor-options = Għażliet tal-editur
editor-format-as-doenetml = Ifformattja bħala DoenetML
editor-format-as-xml = Ifformattja bħala XML


## The diagnostics panel

editor-diagnostic-line = Linja #{ $line }

editor-no-errors = L-ebda żball
editor-no-warnings = L-ebda twissija
editor-no-info = L-ebda dijanjostika ta' informazzjoni

editor-show-info-annotations = Uri d-dijanjostika ta' informazzjoni fl-editur
editor-show-accessibility-annotations = Uri d-dijanjostika tal-aċċessibbiltà fl-editur

editor-accessibility-learn-more = Skopri kif Doenet jitratta l-aċċessibbiltà

editor-accessibility-violations-heading = Każijiet ta' ksur tal-aċċessibbiltà ({ $standard })

editor-accessibility-other-heading = Problemi oħra ta' aċċessibbiltà
editor-none-found = Ma nstab xejn


## Submitted responses

editor-no-responses = Għadha ma ntbagħtet l-ebda tweġiba
editor-response-answer-id = Identifikatur tat-tweġiba
editor-response-response = Tweġiba
editor-response-credit = Punteġġ
editor-response-submitted = Mibgħuta


## The context-help panel

help-placeholder = Poġġi l-kursur fuq isem ta' tag, fuq attribut jew fuq { $ref } għad-dokumentazzjoni.

help-unsupported-ref-chain = L-għajnuna għal referenzi b'diversi partijiet bħal { $example } għadha mhix appoġġata.

help-unresolved-ref =
    { $reason ->
        [notFound] Ma nstab l-ebda referent għar-referenza: { $ref }.
        [multiple] Instabu diversi referenti għar-referenza: { $ref }.
       *[indeterminate] Ma setax jiġi determinat referent għal { $ref }.
    }

help-learn-about-references = Skopri aktar dwar ir-referenzi →
help-reference-page = Paġna ta' referenza →

help-suggestions-header =
    { $location ->
        [inside] Ġewwa { $element }
       *[top] Fl-ogħla livell
    }{ $allowed ->
        [none] { " — xejn ma jmur hawn." }
        [text] { " — ikteb test hawn." }
        [text-and-components] { " — ikteb test hawn, jew ipprova:" }
       *[components] { " — affarijiet x'tipprova:" }
    }

help-suggestions-footer = Agħfas { $shortcut } biex tara l-komponenti kollha ({ $total }).

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } hija referenza għal { $target }.
       *[other] { $ref } hija referenza għal { $target } (linja { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Introdott minn { $owner } bħala { $role }.
       *[other] Introdott minn { $owner } fil-linja { $line } bħala { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } hija referenza għall-proprjetà { $property } ta' { $element }.
       *[other] { $ref } hija referenza għall-proprjetà { $property } ta' { $element } (linja { $line }).
    }

help-kind-attribute = attribut
help-kind-snippet = snippet
help-kind-array-entry = entrata ta' array

help-default = Valur awtomatiku:
help-active-default = Valur awtomatiku attiv:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Valuri permessi (wieħed għal kull element):
       *[other] Valuri permessi:
    }

help-suggested-values = Valuri suġġeriti:

help-inserts = Jinserixxi:

help-coordinates =
    { $count ->
        [one] Koordinata:
       *[other] Koordinati:
    }

help-type = Tip:

help-resolved-style = Stil riżolt (styleNumber { $styleNumber }):

help-resolved-function-names = Ismijiet ta' funzjonijiet riżolti:
help-reset-list = Irrisettja l-lista f'din l-input:
help-added-on-input = Miżjud f'din l-input:
help-removed-on-input = Imneħħi f'din l-input:

help-reset-overrides = { $reset } jieħu preċedenza fuq { $additional } u { $removed }.
