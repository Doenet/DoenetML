# Pohnpeian editor and language-server surfaces, Latin script. Translated from
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
# ORTHOGRAPHY. Standard Pohnpeian spelling, digraphs `ng`, `oa`, `mw` and `pw`
# intact, `h` marking a long vowel. The letters `b`, `c`, `f`, `g`, `j`, `q`,
# `v`, `x` and `z` are not Pohnpeian, so loans are respelled: «editer»,
# «kihpohd», «kredit», «wersin», «koordineit», «arre», «stail», «tehpel».
#
# REGISTER. Common, non-honorific speech throughout, as in the other three
# files. Nothing here is addressed to a title-holder.
#
# NUMBER. Pohnpeian does not mark a noun for number, and
# `Intl.PluralRules("pon")` has no CLDR data of its own — it resolves against
# the runtime's default locale — so no message here writes a plural branch.
# `help-coordinates` and the two counters inside `editor-accessibility-label`
# each render one string where English writes two; the count itself still
# arrives and is still formatted. The classifier that Pohnpeian would fuse onto
# a numeral cannot be written beside a placeable, so «{ $count } kauwehla en
# WCAG AA» leaves the numeral bare — see `chrome.ftl`'s header for why.
#
# WORD ORDER. Pohnpeian is head-initial and verb-medial, so these sentences
# keep close to the English order; the object follows its verb, which means
# `editor-accessibility-title` and `-label` can leave the `$action` select
# where English puts it rather than moving it to the end, as `locales/sma` had
# to.
#
# VOCABULARY THAT NEEDS A SPEAKER, and the first place to look. «kak en
# pedolong» — "the ability to enter" — is this seed's coinage for
# *accessibility*, built from ordinary Pohnpeian words; it is used in every
# accessibility message here and in `chrome.ftl`, so correcting it is one
# search-and-replace. «kaweid» carries *feedback* (in `chrome.ftl`), *hint* as
# «kisin kaweid», and *recommendation* here: three English words, one Pohnpeian
# word, and this seed could not separate them. «idihd» (to name, to mention) is
# pressed into service for *reference*, «irair» for *attribute*, «uwe» for
# *value*, «soahng» for *type*, «ede» for *name*, «akadei» for a *target* and
# also for *objectives* in `content.ftl`. «mehn kilang» is the viewer and
# «mehn kasale» the renderer — two words on purpose, since the reader meets
# both. «uwe tepitep» ("the starting value") is the coinage for *default*.
# «kauwehla» is a *violation*, from the ordinary verb to spoil or break.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Kasapahl
       *[update] Kapwada
    }
editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } Mehn kilang
       *[other] { $word } Mehn kilang { $shortcut }
    }


## The variant picker

editor-variant = Wariant
editor-variant-filter = Rapahki...
editor-variant-next = Pilada wariant mwuri
editor-variant-previous = Pilada wariant mwohn


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Kauwehla en WCAG AA en kak en pedolong diarekda. Klik pwen { $action ->
            [close] ritingedi
           *[open] ritingada
        } ripohten kak en pedolong.
        [advisories] Klik pwen { $action ->
            [close] ritingedi
           *[open] ritingada
        } ripohten kak en pedolong. Sohte kauwehla en WCAG AA diarekda, ahpw mie kaweid ekei ong kak en pedolong.
       *[clean] Klik pwen { $action ->
            [close] ritingedi
           *[open] ritingada
        } ripohten kak en pedolong. Sohte kahpwal en kak en pedolong diarekda.
    }

editor-accessibility-label =
    { $status ->
        [violations] Kauwehla en WCAG AA en kak en pedolong diarekda. Kauwehla en WCAG AA { $count } diarekda. Klik pwen { $action ->
            [close] ritingedi
           *[open] ritingada
        } ripohten kak en pedolong.
        [advisories] Sohte kauwehla en WCAG AA diarekda. Kaweid { $count } ong kak en pedolong diarekda. Klik pwen { $action ->
            [close] ritingedi
           *[open] ritingada
        } ripohten kak en pedolong.
       *[clean] Sohte kauwehla en WCAG AA diarekda. Klik pwen { $action ->
            [close] ritingedi
           *[open] ritingada
        } ripohten kak en pedolong.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Wersin en DoenetML { $version }

editor-tab-help = Sawas me kohsang wasa me kursoro mi ie
editor-tab-help-short = Wasa
editor-tab-errors = Sapwung
editor-tab-warnings = Kehkehlik
editor-tab-info = Rohng
editor-tab-accessibility = Kak en pedolong
editor-tab-responses = Sapeng me kadarala
editor-tab-with-count = { $label }: { $count }

editor-options = Pilipil en editer
editor-format-as-doenetml = Koasoanehdi nin duwen DoenetML
editor-format-as-xml = Koasoanehdi nin duwen XML


## The diagnostics panel

editor-diagnostic-line = Lain #{ $line }

editor-no-errors = Sohte sapwung
editor-no-warnings = Sohte kehkehlik
editor-no-info = Sohte rohng

editor-show-info-annotations = Kasalehda rohng nan editer
editor-show-accessibility-annotations = Kasalehda kak en pedolong nan editer

editor-accessibility-learn-more = Sukuhlki duwen Doenet eh kin apwalih kak en pedolong

editor-accessibility-violations-heading = Kauwehla en kak en pedolong ({ $standard })

editor-accessibility-other-heading = Kahpwal teikan en kak en pedolong
editor-none-found = Sohte diarek


## Submitted responses

editor-no-responses = Sohte sapeng kadarala ahnsou wet
editor-response-answer-id = Id en pasapeng
editor-response-response = Sapeng
editor-response-credit = Kredit
editor-response-submitted = Kadarala


## The context-help panel

help-placeholder = Kihdiong kursoro pohn eden tag, irair, de { $ref } pwen alehdi kaweid.

help-unsupported-ref-chain = Sawas ong idihd me mie kis tohto duwehte { $example } saikinte mie.

help-unresolved-ref =
    { $reason ->
        [notFound] Sohte mehkot diarek ong idihd wet: { $ref }.
        [multiple] Mehkot tohto diarek ong idihd wet: { $ref }.
       *[indeterminate] Sohte kak diarada dahme { $ref } kin idihdki.
    }

help-learn-about-references = Sukuhlki duwen idihd →
help-reference-page = Pali en idihd →

help-suggestions-header =
    { $location ->
        [inside] Nan { $element }
       *[top] Ni tepin doakumend
    }{ $allowed ->
        [none] { " — sohte mehkot kak mi met." }
        [text] { " — ntingihdi lokaia met." }
        [text-and-components] { " — ntingihdi lokaia met, de song met:" }
       *[components] { " — song met:" }
    }

help-suggestions-footer = Padikedi { $shortcut } pwen kilang kompohnent { $total } koaros.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } iei idihd ong { $target }.
       *[other] { $ref } iei idihd ong { $target } (lain { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Kapwarada sang { $owner } nin duwen { $role }.
       *[other] Kapwarada sang { $owner } nan lain { $line } nin duwen { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } iei idihd ong irair { $property } en { $element }.
       *[other] { $ref } iei idihd ong irair { $property } en { $element } (lain { $line }).
    }

help-kind-attribute = irair
help-kind-snippet = kisin nting
help-kind-array-entry = pedolong en arre

help-default = Uwe tepitep:
help-active-default = Uwe tepitep me doadoahk:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Uwe me mweimweiong (ehu ong ehu kis):
       *[other] Uwe me mweimweiong:
    }

help-suggested-values = Uwe me kaweidki:

help-inserts = Kin kapataiong:

# No plural branch: Pohnpeian does not mark the noun for number, so both
# English headings render one string.
help-coordinates = Koordineit:

help-type = Soahng:

help-resolved-style = Stail me diarekda (styleNumber { $styleNumber }):

help-resolved-function-names = Eden pwuhnksin me diarekda:
help-reset-list = Lis me kasapahlla nan wasahn pedolong wet:
help-added-on-input = Kapatapat nan wasahn pedolong wet:
help-removed-on-input = Kihsang nan wasahn pedolong wet:

help-reset-overrides = { $reset } kin powehdi { $additional } oh { $removed }.
