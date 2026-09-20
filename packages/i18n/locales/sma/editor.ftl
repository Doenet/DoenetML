# Southern Sami editor and language-server surfaces, Latin script. Translated
# from `locales/en/editor.ftl`, which is the source of truth: `lint:i18n`
# rejects a key that does not exist there, and reports a key that exists there
# but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# `WCAG AA`, `DoenetML`, `XML`, `styleNumber` and every attribute or element
# name are identifiers, not prose, and stay as written.
#
# Southern Sami is written without `á`, `č`, `đ`, `ŋ`, `š`, `ŧ` and `ž`, and
# with `ï`, `ä`, `ö` and `å`, which Northern Sami does not use. Anything below
# that carries a Northern Sami letter is a bug.
#
# Southern Sami counts in three categories, `one`, `two` and `other`. A
# message that prints its count writes all three, as `chrome.ftl` explains —
# `two` and `other` carry the same plural form today, and are kept apart
# because a later correction to one of them is unlikely to be a correction to
# both. `help-coordinates` is the message that does not: it never prints a
# count, it decides a heading's singular against its plural, and Southern
# Sami's plural is one form, so a dual branch there would be a variant nothing
# could tell apart.
#
# A limit worth knowing before editing `editor-accessibility-title` and
# `editor-accessibility-label`: Southern Sami puts the object in front of the
# infinitive, so "click to open the report" is «Klikkh jaksemevoeten raportem
# rïhpestidh» — the verb closes the clause. The `$action` select has been
# moved to the end of the sentence for that reason; it cannot sit where
# English and Northern Sami put it.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Bååstede
       *[update] Orresth
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } vuesiehtæjjam
       *[other] { $word } vuesiehtæjjam { $shortcut }
    }


## The variant picker

editor-variant = Variante
editor-variant-filter = Sïllh…
editor-variant-next = Veeljh mubpie variantem
editor-variant-previous = Veeljh aerebi variantem


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA jaksemevoeten rïhkestimmie gaavneme. Klikkh jaksemevoeten raportem { $action ->
            [close] gaptjedh
           *[open] rïhpestidh
        }.
        [advisories] Klikkh jaksemevoeten raportem { $action ->
            [close] gaptjedh
           *[open] rïhpestidh
        }. WCAG AA rïhkestimmieh eah gaavneme, men vielie jaksemevoeten raerieh gååvnesieh.
       *[clean] Klikkh jaksemevoeten raportem { $action ->
            [close] gaptjedh
           *[open] rïhpestidh
        }. Jaksemevoeten dåeriesmoerh eah gaavneme.
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA jaksemevoeten rïhkestimmie gaavneme. Gaavneme { $count ->
            [one] { $count } WCAG AA rïhkestimmie
            [two] { $count } WCAG AA rïhkestimmieh
           *[other] { $count } WCAG AA rïhkestimmieh
        }. Klikkh jaksemevoeten raportem { $action ->
            [close] gaptjedh
           *[open] rïhpestidh
        }.
        [advisories] WCAG AA rïhkestimmieh eah gaavneme. Gaavneme { $count ->
            [one] { $count } vielie jaksemevoeten raerie
            [two] { $count } vielie jaksemevoeten raerieh
           *[other] { $count } vielie jaksemevoeten raerieh
        }. Klikkh jaksemevoeten raportem { $action ->
            [close] gaptjedh
           *[open] rïhpestidh
        }.
       *[clean] WCAG AA rïhkestimmieh eah gaavneme. Klikkh jaksemevoeten raportem { $action ->
            [close] gaptjedh
           *[open] rïhpestidh
        }.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML versjovne { $version }

editor-tab-help = Ektiedimmien mietie viehkie
editor-tab-help-short = Ektiedimmie
editor-tab-errors = Båajhtoehtimmieh
editor-tab-warnings = Vaaroehtimmieh
editor-tab-info = Bïevnesh
editor-tab-accessibility = Jaksemevoete
editor-tab-responses = Seedtesovveme vaestiedassh

editor-tab-with-count = { $label }: { $count }

editor-options = Tjaelemedïrregen heevehtimmieh
editor-format-as-doenetml = Hammoedh DoenetML:ine
editor-format-as-xml = Hammoedh XML:ine


## The diagnostics panel

editor-diagnostic-line = Raajese nr. { $line }

editor-no-errors = Eah leah båajhtoehtimmieh
editor-no-warnings = Eah leah vaaroehtimmieh
editor-no-info = Eah leah bïevnesedïeveh

editor-show-info-annotations = Vuesehth bïevnesedïeveh tjaelemedïrregisnie
editor-show-accessibility-annotations = Vuesehth jaksemevoeten dïeveh tjaelemedïrregisnie

editor-accessibility-learn-more = Guktie Doenet jaksemevoetine barka

editor-accessibility-violations-heading = Jaksemevoeten rïhkestimmieh ({ $standard })

editor-accessibility-other-heading = Jeatjah jaksemevoeten dåeriesmoerh
editor-none-found = Ij mij gaavneme


## Submitted responses

editor-no-responses = Eah leah annje seedtesovveme vaestiedassh
editor-response-answer-id = Vaestiedassen Id
editor-response-response = Vaestiedasse
editor-response-credit = Poengh
editor-response-submitted = Seedtesovveme


## The context-help panel

help-placeholder = Bïejh tjaelemetjuvtjiem gille tsagkese, attribuvtese jallh daase: { $ref } jis dokumentasjovnem sïjhth.

help-unsupported-ref-chain = Viehkie gellieboelhkeles vuesiehtimmide goh { $example } ij annje dåarjoehtamme.

help-unresolved-ref =
    { $reason ->
        [notFound] Vuesiehtimmien ulmie ij gaavneme: { $ref }.
        [multiple] Gellie vuesiehtimmien ulmieh gaavneme: { $ref }.
       *[indeterminate] { $ref } ulmiem ij maehtieh nænnoestidh.
    }

help-learn-about-references = Lïerh vuesiehtimmiej bïjre →
help-reference-page = Vuesiehtimmiesæjroe →

help-suggestions-header =
    { $location ->
        [inside] { $element } sisnie
       *[top] Bijjemes daltesisnie
    }{ $allowed ->
        [none] { " — daase ij mij båetieh." }
        [text] { " — tjaelieh teekstem daase." }
        [text-and-components] { " — tjaelieh teekstem daase, jallh pryövh:" }
       *[components] { " — pryövh:" }
    }

help-suggestions-footer = Tsagkh { $shortcut } jis abpe { $total } komponentem vuejnedh sïjhth.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } daase vuesehte: { $target }.
       *[other] { $ref } daase vuesehte: { $target } (raajese { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } dam buakteme { $role } råållesne.
       *[other] { $owner } dam buakteme raajesisnie { $line } { $role } råållesne.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } { $element } jïjtsevoetese { $property } vuesehte.
       *[other] { $ref } { $element } jïjtsevoetese { $property } vuesehte (raajese { $line }).
    }

help-kind-attribute = attribuvte
help-kind-snippet = teekstebielie
help-kind-array-entry = listen lïhtsege

help-default = Standarde:
help-active-default = Aktijve standarde:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Luhpiedihks aarvoeh (akte fïerhten lïhtsegen gaavhtan):
       *[other] Luhpiedihks aarvoeh:
    }

help-suggested-values = Raeriestamme aarvoeh:

help-inserts = Bïeje sïjse:

help-coordinates =
    { $count ->
        [one] Koordinaate:
       *[other] Koordinaath:
    }

help-type = Såarhte:

help-resolved-style = Nænnoestamme stïjle (styleNumber { $styleNumber }):

help-resolved-function-names = Nænnoestamme funksjovnenommh:
help-reset-list = Bååstedelæstoe daan sæjjan:
help-added-on-input = Lissiehtamme daan sæjjan:
help-removed-on-input = Vaalteme daehtie sæjjeste:

help-reset-overrides = { $reset } { $additional } jïh { $removed } bijjelen vaadtsa.
