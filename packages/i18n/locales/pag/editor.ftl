# Pangasinan (Salitan Pangasinan) editor and language-server surfaces.
# Translated from `locales/en/editor.ftl`, which is the source of truth:
# `lint:i18n` rejects a key that does not exist there, and reports a key that
# exists there but not here as missing coverage.
#
# `WCAG AA`, `DoenetML`, `XML`, `styleNumber`, `Answer Id` and every attribute
# or element name are identifiers, not prose, and stay as written.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography: the modernised spelling**, as `chrome.ftl`'s header sets out.
# The older Spanish-influenced spelling is a respelling of this one, not a
# different translation; convert all four files at once or none.
#
# **This is the file where the loans are heaviest, and it should be read as
# such.** The editor's technical nouns are Spanish-derived or English —
# `editor`, `viewer`, `baryante`, `filter`, `komponente`, `atributo`,
# `reference`, `property`, `snippet`, `array entry`, `balor`, `koordinado`,
# `punsion`, `dokumentasyon`, `aksesibilidad`, `report`, `kredito`,
# `Answer Id`, `default`, `cursor`, `tag` — **around a Pangasinan frame**.
# What is Pangasinan here is the verb-initial word order, the markers «so»,
# «na» and «ed», the linker «a»/«ya», the negator «ag», «walay» and
# «anggapoy», and the verbs «balowen» ('renew'), «ipawil» ('return'),
# «peselen» ('press'), «pilien» ('choose'), «naromog» ('is found') and
# «ipanengneng» ('show').
#
# `editor-update-viewer` is **translated rather than kept in English**:
# «Balowen» for Update and «Ipawil» for Reset are both short enough for a
# toolbar button. If either turns out to be too long in a real toolbar, the
# English words are the fallback a corrector should reach for, not a coinage.
#
# `Filter...` is kept as the English word: it stands in an empty input as a
# placeholder, and the seed had no Pangasinan word for it short enough and
# settled enough to vouch for.
#
# **No plural-category branches.** Pangasinan leaves a noun unmarked after a
# numeral — «{ $count } a kasumlangan» is right for one and for many — and CLDR
# has no plural data for `pag`, so a `[one]` branch here would be text selected
# by English's rules. Every count select is collapsed to a single `*[other]`.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Ipawil
       *[update] Balowen
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } so Viewer
       *[other] { $word } so Viewer { $shortcut }
    }


## The variant picker

editor-variant = Baryante

editor-variant-filter = Filter...

editor-variant-next = Pilien so onsublay a baryante

editor-variant-previous = Pilien so akaunan baryante


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Walay abirbir a kasumlangan ed WCAG AA ya aksesibilidad. I-click pian { $action ->
            [close] nakapotan
           *[open] nalukasan
        } so report ed aksesibilidad.
        [advisories] I-click pian { $action ->
            [close] nakapotan
           *[open] nalukasan
        } so report ed aksesibilidad. Anggapoy naromog a kasumlangan ed WCAG AA, balet walay arum ni ran rekomendasyon ed aksesibilidad.
       *[clean] I-click pian { $action ->
            [close] nakapotan
           *[open] nalukasan
        } so report ed aksesibilidad. Anggapoy naromog a problema ed aksesibilidad.
    }

editor-accessibility-label =
    { $status ->
        [violations] Walay abirbir a kasumlangan ed WCAG AA ya aksesibilidad. { $count ->
           *[other] { $count } a kasumlangan ed WCAG AA
        } so naromog. I-click pian { $action ->
            [close] nakapotan
           *[open] nalukasan
        } so report ed aksesibilidad.
        [advisories] Anggapoy abirbir a kasumlangan ed WCAG AA. { $count ->
           *[other] { $count } ya arum a rekomendasyon ed aksesibilidad
        } so naromog. I-click pian { $action ->
            [close] nakapotan
           *[open] nalukasan
        } so report ed aksesibilidad.
       *[clean] Anggapoy abirbir a kasumlangan ed WCAG AA. I-click pian { $action ->
            [close] nakapotan
           *[open] nalukasan
        } so report ed aksesibilidad.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Bersyon na DoenetML { $version }

editor-tab-help = Tulong ya unong ed konteksto
editor-tab-help-short = Konteksto
editor-tab-errors = Saray Lingo
editor-tab-warnings = Saray Pasakbay
editor-tab-info = Impormasyon
editor-tab-accessibility = Aksesibilidad
editor-tab-responses = Saray niipawit ya ebat

editor-tab-with-count = { $label }: { $count }

editor-options = Saray opsyon na editor
editor-format-as-doenetml = I-format bilang DoenetML
editor-format-as-xml = I-format bilang XML


## The diagnostics panel

editor-diagnostic-line = Linya #{ $line }

editor-no-errors = Anggapoy Lingo
editor-no-warnings = Anggapoy Pasakbay
editor-no-info = Anggapoy Impormasyon a Diagnostic

editor-show-info-annotations = Ipanengneng ed editor iray diagnostic ya impormasyon
editor-show-accessibility-annotations = Ipanengneng ed editor iray diagnostic ed aksesibilidad

editor-accessibility-learn-more = Aralen no panon ya asikasoen na Doenet so aksesibilidad

editor-accessibility-violations-heading = Saray kasumlangan ed aksesibilidad ({ $standard })

editor-accessibility-other-heading = Arum ni ran problema ed aksesibilidad
editor-none-found = Anggapoy naromog


## Submitted responses

editor-no-responses = Anggapo ni ran niipawit ya ebat
editor-response-answer-id = Answer Id
editor-response-response = Ebat
editor-response-credit = Kredito
editor-response-submitted = Niipawit


## The context-help panel

help-placeholder = Iyan so cursor ed sakey a ngaran na tag, atributo, odino { $ref } parad dokumentasyon.

help-unsupported-ref-chain = Ag ni suportado so tulong parad saray reference ya dakel so kabiangan to a singa { $example }.

help-unresolved-ref =
    { $reason ->
        [notFound] Anggapoy naromog a tutukoyen na reference: { $ref }.
        [multiple] Dakel so naromog a tutukoyen na reference: { $ref }.
       *[indeterminate] Ag ayari ya nadeterminaan so tutukoyen na { $ref }.
    }

help-learn-about-references = Aralen so nipaakar ed saray reference →
help-reference-page = Pahina na reference →

help-suggestions-header =
    { $location ->
        [inside] Diad loob na { $element }
       *[top] Diad tagey a lebel
    }{ $allowed ->
        [none] { " — anggapoy nayarin iyan dia." }
        [text] { " — mansulat na teksto dia." }
        [text-and-components] { " — mansulat na teksto dia, odino salien:" }
       *[components] { " — saray nayarin salien:" }
    }

help-suggestions-footer = Peselen so { $shortcut } pian nanengneng so amin ya { $total } a komponente.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] Say { $ref } et reference ed { $target }.
       *[other] Say { $ref } et reference ed { $target } (linya { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Inggapo na { $owner } bilang { $role }.
       *[other] Inggapo na { $owner } ed linya { $line } bilang { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] Say { $ref } et reference ed say { $property } a property na { $element }.
       *[other] Say { $ref } et reference ed say { $property } a property na { $element } (linya { $line }).
    }

help-kind-attribute = atributo
help-kind-snippet = snippet
help-kind-array-entry = array entry

help-default = Default:
help-active-default = Aktibon default:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Saray abuloyan a balor (sakey ed kada item):
       *[other] Saray abuloyan a balor:
    }

help-suggested-values = Saray nisusuheridon balor:

help-inserts = Iyan to:

help-coordinates =
    { $count ->
       *[other] Koordinado:
    }

help-type = Klase:

help-resolved-style = Nadeterminaan a style (styleNumber { $styleNumber }):

help-resolved-function-names = Saray nadeterminaan a ngaran na punsion:
help-reset-list = Ipawil so lista ed sayan input:
help-added-on-input = Inyarum ed sayan input:
help-removed-on-input = Inekal ed sayan input:

help-reset-overrides = Say { $reset } so mansasalat ed { $additional } tan { $removed }.
