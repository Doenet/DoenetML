# Soga (Olusoga) editor and language-server surfaces: the footer, the
# diagnostics panel, the variant picker, the accessibility button, and the
# context-help panel beside them. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script and orthography.** As `chrome.ftl` sets it out: the Lusoga Language
# Authority standard, `dh` where Luganda writes `z` or `j`, the initial vowel
# written, Latin digits.
#
# `WCAG`, `WCAG AA`, `DoenetML`, `XML` and `styleNumber` are names rather than
# words and stay exactly as they stand, as do the key combinations `$shortcut`
# carries.
#
# **What is Lusoga here.** The panel's own frame: «Tewali …» for *no X found*,
# «Nyiga …» for *click to …*, «Manya …» for *learn about*, «kiraga» for *is a
# reference to*, «engeri» for an attribute, «omuwendo» for a value, «ekika»
# for a type and for a variant, «okudhuula» for *to find*, «ekidha» for what
# comes next. The negator is **`ti-`**, not Luganda's `te-` / `si-`.
#
# **What is borrowed.** English, openly and only where the word is what a
# Ugandan classroom says: «fonkisoni», «lipoota», «tagi». The two counted
# selects below use ordinary Lusoga nouns («ekizibu» / «ebizibu»,
# «okuteesa») rather than a loan for *violation*, so that the plural has
# something to work on.
#
# **Weakest here.** «erinnya» for a name is the Luganda word and may be a
# Luganda intrusion; it is used in `chrome.ftl` too and should be corrected in
# both together. «engeri» for *attribute* and «okutuukirira» for
# *accessibility* are descriptions rather than established Lusoga technical
# terms, and are the next two to attack.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Zzaayo
       *[update] Kyusa
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } Omulaga
       *[other] { $word } Omulaga { $shortcut }
    }


## The variant picker

editor-variant = Ekika

editor-variant-filter = Sengejja…

editor-variant-next = Londa ekika ekidha

editor-variant-previous = Londa ekika ekiyise


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Kidhuuliddwa ekizibu kya WCAG AA mu kutuukirira. Nyiga { $action ->
            [close] okwigalawo
           *[open] okwigulawo
        } lipoota y'okutuukirira.
        [advisories] Nyiga { $action ->
            [close] okwigalawo
           *[open] okwigulawo
        } lipoota y'okutuukirira. Tewali kizibu kya WCAG AA ekidhuuliddwa, naye waliwo okuteesa okulala ku kutuukirira.
       *[clean] Nyiga { $action ->
            [close] okwigalawo
           *[open] okwigulawo
        } lipoota y'okutuukirira. Tewali bizibu bya kutuukirira ebidhuuliddwa.
    }

editor-accessibility-label =
    { $status ->
        [violations] Kidhuuliddwa ekizibu kya WCAG AA mu kutuukirira. { $count ->
            [one] Kidhuuliddwa ekizibu { $count } ekya WCAG AA
           *[other] Bidhuuliddwa ebizibu { $count } ebya WCAG AA
        }. Nyiga { $action ->
            [close] okwigalawo
           *[open] okwigulawo
        } lipoota y'okutuukirira.
        [advisories] Tewali kizibu kya WCAG AA ekidhuuliddwa. { $count ->
            [one] Kudhuuliddwa okuteesa { $count } okulala ku kutuukirira
           *[other] Kudhuuliddwa okuteesa { $count } okulala ku kutuukirira
        }. Nyiga { $action ->
            [close] okwigalawo
           *[open] okwigulawo
        } lipoota y'okutuukirira.
       *[clean] Tewali kizibu kya WCAG AA ekidhuuliddwa. Nyiga { $action ->
            [close] okwigalawo
           *[open] okwigulawo
        } lipoota y'okutuukirira.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Enkola ya DoenetML { $version }

editor-tab-help = Obuyambi bw'aw'oli
editor-tab-help-short = Aw'oli
editor-tab-errors = Ensobi
editor-tab-warnings = Okulabula
editor-tab-info = Amawulire
editor-tab-accessibility = Okutuukirira
editor-tab-responses = Eby'okwiramu ebiweereziddwa

editor-tab-with-count = { $label }: { $count }

editor-options = Ebisoboka ku muwandiisi
editor-format-as-doenetml = Tegeka nga DoenetML
editor-format-as-xml = Tegeka nga XML


## The diagnostics panel

editor-diagnostic-line = Olunyiriri #{ $line }

editor-no-errors = Tewali Nsobi
editor-no-warnings = Tewali Kulabula
editor-no-info = Tewali Mawulire

editor-show-info-annotations = Laga amawulire mu muwandiisi
editor-show-accessibility-annotations = Laga ebikwata ku kutuukirira mu muwandiisi

editor-accessibility-learn-more = Manya nga Doenet bw'etwala okutuukirira

editor-accessibility-violations-heading = Ebizibu by'okutuukirira ({ $standard })

editor-accessibility-other-heading = Ebizibu ebirala eby'okutuukirira
editor-none-found = Tewali kidhuuliddwa


## Submitted responses

editor-no-responses = Tewali by'okwiramu ebiweereziddwa kaakati
editor-response-answer-id = Akabonero k'Eky'okwiramu
editor-response-response = Eky'okwiramu
editor-response-credit = Amamaaka
editor-response-submitted = Kiweereziddwa


## The context-help panel

help-placeholder = Teeka akakomo ku rinnya lya tagi, ku ngeri, oba ku { $ref } okudhuula ebiwandiiko.

help-unsupported-ref-chain = Obuyambi ku biraga eby'ebitundu bingi nga { $example } tibunnaba kutandika.

help-unresolved-ref =
    { $reason ->
        [notFound] Tewali kidhuuliddwa ku kiraga kino: { $ref }.
        [multiple] Bidhuuliddwa ebintu bingi ku kiraga kino: { $ref }.
       *[indeterminate] Ekyo { $ref } ky'ekiraga tikimanyiddwa.
    }

help-learn-about-references = Manya ku biraga →
help-reference-page = Olupapula lw'ebiraga →

help-suggestions-header =
    { $location ->
        [inside] Munda mu { $element }
       *[top] Waigulu ddala
    }{ $allowed ->
        [none] { " — tewali kisobola kudha wano." }
        [text] { " — wandiika ebigambo wano." }
        [text-and-components] { " — wandiika ebigambo wano, oba ogezeeko:" }
       *[components] { " — ebitundu by'osobola okugezaako:" }
    }

help-suggestions-footer = Nyiga { $shortcut } okulaba ebitundu byonna { $total }.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } kiraga { $target }.
       *[other] { $ref } kiraga { $target } (olunyiriri { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Kiva ku { $owner } nga { $role }.
       *[other] Kiva ku { $owner } ku lunyiriri { $line } nga { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } kiraga engeri { $property } eya { $element }.
       *[other] { $ref } kiraga engeri { $property } eya { $element } (olunyiriri { $line }).
    }

help-kind-attribute = engeri
help-kind-snippet = akatundu
help-kind-array-entry = ekiteekeddwa mu lukalala

help-default = Eky'ebulijjo:
help-active-default = Eky'ebulijjo ekikola:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Emiwendo egikkirizibwa (ku buli kimu):
       *[other] Emiwendo egikkirizibwa:
    }

help-suggested-values = Emiwendo egiteesebwa:

help-inserts = Kiteeka:

help-coordinates =
    { $count ->
        [one] Akabonero k'ekifo:
       *[other] Obubonero bw'ebifo:
    }

help-type = Ekika:

help-resolved-style = Endabika edhuuliddwa (styleNumber { $styleNumber }):

help-resolved-function-names = Amannya ga fonkisoni agadhuuliddwa:
help-reset-list = Olukalala oluzzeemu ku kiteekeddwamu kino:
help-added-on-input = Ebyongereddwako ku kiteekeddwamu kino:
help-removed-on-input = Ebiihiddwako ku kiteekeddwamu kino:

help-reset-overrides = { $reset } esinga { $additional } ne { $removed }.
