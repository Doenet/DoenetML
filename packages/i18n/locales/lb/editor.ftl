# Luxembourgish editor and language-server surfaces. Translated from
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
        [reset] Zerécksetzen
       *[update] Aktualiséieren
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] Visualiséierer { $word }
       *[other] Visualiséierer { $word } { $shortcut }
    }


## The variant picker

editor-variant = Variant
editor-variant-filter = Filter…
editor-variant-next = Nächste Variant auswielen
editor-variant-previous = Virege Variant auswielen


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] E Verstouss géint d'Accessibilitéit no WCAG AA gouf festgestallt. Klickt fir de Bericht iwwer d'Accessibilitéit { $action ->
            [close] zouzemaachen
           *[open] opzemaachen
        }.
        [advisories] Klickt fir de Bericht iwwer d'Accessibilitéit { $action ->
            [close] zouzemaachen
           *[open] opzemaachen
        }. Et goufe keng Verstéiss no WCAG AA fonnt, mä et gi weider Empfehlungen zur Accessibilitéit.
       *[clean] Klickt fir de Bericht iwwer d'Accessibilitéit { $action ->
            [close] zouzemaachen
           *[open] opzemaachen
        }. Et goufe keng Problemer mat der Accessibilitéit fonnt.
    }

editor-accessibility-label =
    { $status ->
        [violations] E Verstouss géint d'Accessibilitéit no WCAG AA gouf festgestallt. { $count ->
            [one] Et gouf { $count } Verstouss no WCAG AA
           *[other] Et goufen { $count } Verstéiss no WCAG AA
        } fonnt. Klickt fir de Bericht iwwer d'Accessibilitéit { $action ->
            [close] zouzemaachen
           *[open] opzemaachen
        }.
        [advisories] Et goufe keng Verstéiss no WCAG AA festgestallt. { $count ->
            [one] Et gouf { $count } weider Empfehlung zur Accessibilitéit
           *[other] Et goufen { $count } weider Empfehlungen zur Accessibilitéit
        } fonnt. Klickt fir de Bericht iwwer d'Accessibilitéit { $action ->
            [close] zouzemaachen
           *[open] opzemaachen
        }.
       *[clean] Et goufe keng Verstéiss no WCAG AA festgestallt. Klickt fir de Bericht iwwer d'Accessibilitéit { $action ->
            [close] zouzemaachen
           *[open] opzemaachen
        }.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML-Versioun { $version }

editor-tab-help = Kontextbezunnen Hëllef
editor-tab-help-short = Kontext
editor-tab-errors = Feeler
editor-tab-warnings = Warnungen
editor-tab-info = Info
editor-tab-accessibility = Accessibilitéit
editor-tab-responses = Geschéckten Äntwerten

editor-tab-with-count = { $label }: { $count }

editor-options = Astellunge vum Editeur
editor-format-as-doenetml = Als DoenetML formatéieren
editor-format-as-xml = Als XML formatéieren


## The diagnostics panel

editor-diagnostic-line = Linn Nr. { $line }

editor-no-errors = Keng Feeler
editor-no-warnings = Keng Warnungen
editor-no-info = Keng Info-Meldungen

editor-show-info-annotations = Info-Meldungen am Editeur weisen
editor-show-accessibility-annotations = Meldungen zur Accessibilitéit am Editeur weisen

editor-accessibility-learn-more = Wéi Doenet mat Accessibilitéit ëmgeet

editor-accessibility-violations-heading = Verstéiss géint d'Accessibilitéit ({ $standard })

editor-accessibility-other-heading = Aner Problemer mat der Accessibilitéit
editor-none-found = Näischt fonnt


## Submitted responses

editor-no-responses = Nach keng Äntwerte geschéckt
editor-response-answer-id = Id vun der Äntwert
editor-response-response = Äntwert
editor-response-credit = Punkten
editor-response-submitted = Geschéckt


## The context-help panel

help-placeholder = Setzt de Cursor op en Tag-Numm, en Attribut oder { $ref } fir d'Dokumentatioun.

help-unsupported-ref-chain = Hëllef fir méideeleg Referenze wéi { $example } gëtt et nach net.

help-unresolved-ref =
    { $reason ->
        [notFound] Keen Objet fir d'Referenz fonnt: { $ref }.
        [multiple] Méi wéi een Objet fir d'Referenz fonnt: { $ref }.
       *[indeterminate] En Objet fir { $ref } konnt net bestëmmt ginn.
    }

help-learn-about-references = Méi iwwer Referenze léieren →
help-reference-page = Referenzsäit →

help-suggestions-header =
    { $location ->
        [inside] Bannent { $element }
       *[top] Op der iewechster Ebene
    }{ $allowed ->
        [none] { " — hei kënnt näischt hin." }
        [text] { " — schreift hei Text." }
        [text-and-components] { " — schreift hei Text, oder probéiert:" }
       *[components] { " — probéiert:" }
    }

help-suggestions-footer = Dréckt { $shortcut } fir all { $total } Komponenten ze gesinn.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } ass eng Referenz op { $target }.
       *[other] { $ref } ass eng Referenz op { $target } (Linn { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Agefouert vu { $owner } als { $role }.
       *[other] Agefouert vu { $owner } op der Linn { $line } als { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } ass eng Referenz op d'Eegeschaft { $property } vu { $element }.
       *[other] { $ref } ass eng Referenz op d'Eegeschaft { $property } vu { $element } (Linn { $line }).
    }

help-kind-attribute = Attribut
help-kind-snippet = Textbausteen
help-kind-array-entry = Element vun engem Array

help-default = Standard:
help-active-default = Aktive Standard:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Erlaabte Wäerter (ee pro Element):
       *[other] Erlaabte Wäerter:
    }

help-suggested-values = Proposéiert Wäerter:

help-inserts = Setzt an:

help-coordinates =
    { $count ->
        [one] Koordinat:
       *[other] Koordinaten:
    }

help-type = Typ:

help-resolved-style = Opgeléiste Stil (styleNumber { $styleNumber }):

help-resolved-function-names = Opgeléiste Funktiounsnimm:
help-reset-list = Lëscht fir d'Zerécksetzen op dësem Feld:
help-added-on-input = Op dësem Feld derbäigesat:
help-removed-on-input = Op dësem Feld ewechgeholl:

help-reset-overrides = { $reset } iwwerschreift { $additional } an { $removed }.
