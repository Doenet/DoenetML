# Oromo editor and language-server surfaces. Translated from
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
        [reset] Deebisi
       *[update] Haaromsi
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] Agarsiisaa { $word }
       *[other] Agarsiisaa { $word } { $shortcut }
    }


## The variant picker

editor-variant = Gosa
editor-variant-filter = Calaqqisi...
editor-variant-next = Gosa itti aanu filadhu
editor-variant-previous = Gosa darbe filadhu


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Sarbamni argamummaa WCAG AA argameera. Gabaasa argamummaa { $action ->
            [close] cufuuf
           *[open] banuuf
        } tuqi.
        [advisories] Gabaasa argamummaa { $action ->
            [close] cufuuf
           *[open] banuuf
        } tuqi. Sarbamni WCAG AA hin argamne, garuu yaadawwan argamummaa dabalataa jiru.
       *[clean] Gabaasa argamummaa { $action ->
            [close] cufuuf
           *[open] banuuf
        } tuqi. Rakkoon argamummaa hin argamne.
    }

editor-accessibility-label =
    { $status ->
        [violations] Sarbamni argamummaa WCAG AA argameera. { $count ->
            [one] Sarbamni WCAG AA { $count } argameera
           *[other] Sarbamoonni WCAG AA { $count } argamaniiru
        }. Gabaasa argamummaa { $action ->
            [close] cufuuf
           *[open] banuuf
        } tuqi.
        [advisories] Sarbamni WCAG AA hin argamne. { $count ->
            [one] Yaadni argamummaa dabalataa { $count } argameera
           *[other] Yaadawwan argamummaa dabalataa { $count } argamaniiru
        }. Gabaasa argamummaa { $action ->
            [close] cufuuf
           *[open] banuuf
        } tuqi.
       *[clean] Sarbamni WCAG AA hin argamne. Gabaasa argamummaa { $action ->
            [close] cufuuf
           *[open] banuuf
        } tuqi.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Gosa DoenetML { $version }

editor-tab-help = Gargaarsa haala irratti hundaa'e
editor-tab-help-short = Haala
editor-tab-errors = Dogoggorawwan
editor-tab-warnings = Akeekkachiisawwan
editor-tab-info = Odeeffannoo
editor-tab-accessibility = Argamummaa
editor-tab-responses = Deebiiwwan ergaman

editor-tab-with-count = { $label }: { $count }

editor-options = Filannoowwan gulaalaa
editor-format-as-doenetml = Akka DoenetML qopheessi
editor-format-as-xml = Akka XML qopheessi


## The diagnostics panel

editor-diagnostic-line = Sarara #{ $line }

editor-no-errors = Dogoggorri Hin Jiru
editor-no-warnings = Akeekkachiisni Hin Jiru
editor-no-info = Qorannoon Odeeffannoo Hin Jiru

editor-show-info-annotations = Qorannoo odeeffannoo gulaalaa keessatti agarsiisi
editor-show-accessibility-annotations = Qorannoo argamummaa gulaalaa keessatti agarsiisi

editor-accessibility-learn-more = Doenet akkamitti argamummaa ilaalu baradhu

editor-accessibility-violations-heading = Sarbamoota argamummaa ({ $standard })

editor-accessibility-other-heading = Rakkoolee argamummaa biroo
editor-none-found = Homaa hin argamne


## Submitted responses

editor-no-responses = Amma illee deebiin ergame hin jiru
editor-response-answer-id = Eenyummeessaa Deebii
editor-response-response = Deebii
editor-response-credit = Qabxii
editor-response-submitted = Ergameera


## The context-help panel

help-placeholder = Barreeffama argachuuf qubduuka maqaa taagii, amala yookaan { $ref } irra kaa'i.

help-unsupported-ref-chain = Gargaarsi wabii kutaa hedduu qabu akka { $example } ammatti hin deggeramne.

help-unresolved-ref =
    { $reason ->
        [notFound] Wabii { $ref } irratti wanti argame hin jiru.
        [multiple] Wabii { $ref } irratti wantoonni hedduun argamaniiru.
       *[indeterminate] Wanti { $ref } agarsiisu murtaa'uu hin dandeenye.
    }

help-learn-about-references = Waa'ee wabiiwwanii baradhu →
help-reference-page = Fuula wabii →

help-suggestions-header =
    { $location ->
        [inside] { $element } keessatti
       *[top] Sadarkaa ol'aanaa irratti
    }{ $allowed ->
        [none] { " — wanti asitti dhufu hin jiru." }
        [text] { " — asitti barreeffama barreessi." }
        [text-and-components] { " — asitti barreeffama barreessi, yookaan yaali:" }
       *[components] { " — wantoota yaaltu:" }
    }

help-suggestions-footer = Kutaalee { $total } hunda ilaaluuf { $shortcut } tuqi.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } wabii { $target } ti.
       *[other] { $ref } wabii { $target } ti (sarara { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } akka { $role } tti isa dhiheesse.
       *[other] { $owner } sarara { $line } irratti akka { $role } tti isa dhiheesse.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } wabii amala { $property } kan { $element } ti.
       *[other] { $ref } wabii amala { $property } kan { $element } ti (sarara { $line }).
    }

help-kind-attribute = amala
help-kind-snippet = kutaa gabaabaa
help-kind-array-entry = galtee tarree

help-default = Durtii:
help-active-default = Durtii hojiirra jiru:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Gatiiwwan hayyamaman (tokkoon tokkoo wantaaf tokko):
       *[other] Gatiiwwan hayyamaman:
    }

help-suggested-values = Gatiiwwan yaadaman:

help-inserts = Ni galcha:

help-coordinates =
    { $count ->
        [one] Iddoo:
       *[other] Iddoowwan:
    }

help-type = Gosa:

help-resolved-style = Bifa murtaa'e (styleNumber { $styleNumber }):

help-resolved-function-names = Maqaalee hojii murtaa'an:
help-reset-list = Tarree galtee kana irratti haaromfamu:
help-added-on-input = Kan galtee kana irratti dabalame:
help-removed-on-input = Kan galtee kana irratti haqame:

help-reset-overrides = { $reset } { $additional } fi { $removed } ni caalcha.
