# Bislama editor and language-server surfaces. Translated from
# `locales/en/editor.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# The orthographic, grammatical and Tok Pisin–comparison notes are in this
# locale's `chrome.ftl` header. Three things govern this file in particular:
#
# **`WCAG`, `DoenetML`, `XML`, `styleNumber` and the attribute names in
# `help-reset-overrides` are identifiers, not prose, and stay exactly as
# written.** So does the arrow «→» at the end of the two link messages: it is
# direction rather than punctuation, and Bislama is written left to right.
#
# **English-looking words here are Bislama.** Bislama is an English-lexified
# creole and its computing vocabulary is English-derived by nature, so «edita»,
# «laen», «pej», «lis», «input» are its own words. The stray-English check the
# rest of this batch can run does not work on this catalog; what was checked
# instead is set out in `chrome.ftl`.
#
# **Number.** A Bislama noun is not marked for it, so where English's two
# plural branches differ only in the noun — `help-coordinates`, and the two
# counters inside `editor-accessibility-label` — this file writes one
# unselected form. The count still arrives and is still formatted. Every
# *symbolic* selector — `$action`, `$status`, `$shortcut`, `$location`,
# `$allowed`, `$reason`, `$line`, `$perItem` — keeps all of English's branches
# with their keys copied letter for letter.
#
# Terms this seed is least sure of, so a speaker can go straight to them:
# «poenta» (the editing cursor), «kontekis» (context), «snipet» (snippet),
# «entri blong arei» (array entry), «varian» (variant). Each is an English loan
# taken in through Bislama's ordinary loan phonology rather than an attested
# technical term.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Ristat
       *[update] Apdet
    }
editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } Viuwa
       *[other] { $word } Viuwa { $shortcut }
    }

## The variant picker

editor-variant = Varian
editor-variant-filter = Filta…
editor-variant-next = Jusum nekis varian
editor-variant-previous = Jusum varian bifo

## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] I gat wan brekem loa blong akses WCAG AA. Klikim blong { $action ->
            [close] klosem
           *[open] openem
        } ripot blong akses.
        [advisories] Klikim blong { $action ->
            [close] klosem
           *[open] openem
        } ripot blong akses. Oli no faenem wan brekem loa WCAG AA, be i gat sam moa advaes blong akses.
       *[clean] Klikim blong { $action ->
            [close] klosem
           *[open] openem
        } ripot blong akses. Oli no faenem wan trabol blong akses.
    }
# The two counts do not fork: a Bislama noun is not marked for number, so «brekem
# loa» and «advaes» are the same words for one and for many.
editor-accessibility-label =
    { $status ->
        [violations] I gat wan brekem loa blong akses WCAG AA. Oli faenem { $count } brekem loa WCAG AA. Klikim blong { $action ->
            [close] klosem
           *[open] openem
        } ripot blong akses.
        [advisories] Oli no faenem wan brekem loa WCAG AA. Oli faenem { $count } moa advaes blong akses. Klikim blong { $action ->
            [close] klosem
           *[open] openem
        } ripot blong akses.
       *[clean] Oli no faenem wan brekem loa WCAG AA. Klikim blong { $action ->
            [close] klosem
           *[open] openem
        } ripot blong akses.
    }
editor-accessibility-badge = WCAG

## The footer

editor-version-title = DoenetML vesen { $version }
editor-tab-help = Tok halpem long ples we poenta i stap
editor-tab-help-short = Kontekis
editor-tab-errors = Ol mastik
editor-tab-warnings = Ol tok lukaot
editor-tab-info = Toksave
editor-tab-accessibility = Akses
editor-tab-responses = Ol respons we oli sanem
editor-tab-with-count = { $label }: { $count }
editor-options = Ol jus blong edita
editor-format-as-doenetml = Mekem fomat olsem DoenetML
editor-format-as-xml = Mekem fomat olsem XML

## The diagnostics panel

editor-diagnostic-line = Laen #{ $line }
editor-no-errors = I no gat mastik
editor-no-warnings = I no gat tok lukaot
editor-no-info = I no gat toksave
editor-show-info-annotations = Soemaot ol toksave insaed long edita
editor-show-accessibility-annotations = Soemaot ol toksave blong akses insaed long edita
editor-accessibility-learn-more = Lanem olsem wanem Doenet i tingbaot akses
editor-accessibility-violations-heading = Ol brekem loa blong akses ({ $standard })
editor-accessibility-other-heading = Ol nara trabol blong akses
editor-none-found = Oli no faenem wan

## Submitted responses

editor-no-responses = I no gat respons we oli sanem yet
editor-response-answer-id = Ansa Id
editor-response-response = Respons
editor-response-credit = Mak
editor-response-submitted = Oli sanem

## The context-help panel

help-placeholder = Putum poenta long wan nem blong tag, wan atribiut, no long { $ref } blong kasem dokiumenteson.
help-unsupported-ref-chain = Tok halpem long ol refrens we oli gat plante haf, olsem { $example }, i no rere yet.
help-unresolved-ref =
    { $reason ->
        [notFound] Oli no faenem wan samting we refrens ya i poentem: { $ref }.
        [multiple] Oli faenem plante samting we refrens ya i poentem: { $ref }.
       *[indeterminate] Oli no save wanem samting { $ref } i poentem.
    }
help-learn-about-references = Lanem long ol refrens →
help-reference-page = Pej blong ol refrens →
help-suggestions-header =
    { $location ->
        [inside] Insaed long { $element }
       *[top] Long antap olgeta
    }{ $allowed ->
        [none] { " — i no gat samting i save go long ples ya." }
        [text] { " — raetem tekis long ples ya." }
        [text-and-components] { " — raetem tekis long ples ya, no traem:" }
       *[components] { " — ol samting blong traem:" }
    }
help-suggestions-footer = Presem { $shortcut } blong luk olgeta { $total } komponen.
help-name-summary = { $name } — { $summary }
help-ref-is-reference =
    { $line ->
        [none] { $ref } i wan refrens i go long { $target }.
       *[other] { $ref } i wan refrens i go long { $target } (laen { $line }).
    }
help-ref-derived-from =
    { $line ->
        [none] { $owner } i putum hem olsem { $role }.
       *[other] { $owner } i putum hem long laen { $line } olsem { $role }.
    }
help-property-is-reference =
    { $line ->
        [none] { $ref } i wan refrens i go long propeti { $property } blong { $element }.
       *[other] { $ref } i wan refrens i go long propeti { $property } blong { $element } (laen { $line }).
    }
help-kind-attribute = atribiut
help-kind-snippet = snipet
help-kind-array-entry = entri blong arei
help-default = Difolt:
help-active-default = Difolt we i stap wok:
help-style-number-annotation = { " " }(styleNumber { $styleNumber })
help-allowed-values =
    { $perItem ->
        [true] Ol valiu we oli save go (wan long wan aetem):
       *[other] Ol valiu we oli save go:
    }
help-suggested-values = Ol valiu we yu save traem:
help-inserts = I putum:
# No select: «koodinet» is the same word for one and for many.
help-coordinates = Koodinet:
help-type = Kaen:
help-resolved-style = Stael we i kamaot (styleNumber { $styleNumber }):
help-resolved-function-names = Ol nem blong fanksen we oli kamaot:
help-reset-list = Ristat lis long input ya:
help-added-on-input = Oli adem long input ya:
help-removed-on-input = Oli tekemaot long input ya:
help-reset-overrides = { $reset } i winim { $additional } mo { $removed }.
