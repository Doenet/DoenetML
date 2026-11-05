# Wakhi (Xik zik) editor and language-server surfaces. Translated from
# `locales/en/editor.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# `WCAG AA`, `DoenetML`, `XML`, `styleNumber` and every attribute or element
# name are identifiers, not prose, and stay as written.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** The Latin practice of Pakistan, in the plain diacritic-free
# form `chrome.ftl`'s header sets out — basic Latin letters plus `sh ch zh kh
# gh th dh ts ng`. Wakhi's other live orthography is the **Cyrillic of
# Tajikistan**, and a reader there or in Afghanistan or Xinjiang may not
# recognize these spellings. **No Cyrillic and no Perso-Arabic anywhere in
# this file**; converting the catalog means converting all four files at once,
# and changing the loans' source language with them.
#
# **This is the file where the loans are heaviest**, and it should be read as
# such: the editor's technical nouns are English almost without exception —
# `editor`, `viewer`, `variant`, `filter`, `component`, `attribute`,
# `reference`, `property`, `snippet`, `array entry`, `value`, `type`, `style`,
# `default`, `coordinate`, `function`, `line`, `tag`, `documentation`,
# `accessibility`, `report`, `credit`, `Answer Id` — **around a Wakhi frame**.
# What is Wakhi here is the word order (verb-final, modifier before head), the
# postpositions «-ir» and «-dar», and the single verb «tsar-» ('to do') that
# carries every action. The abstract vocabulary between them is Urdu and
# Persian: «ghalati» (error), «hushdor» (warning), «ma'lumot» (information),
# «intikhob» (selection), «khilofwarzi» (violation), «madad» (help), «zamina»
# (context), «faol» (active), «peshnihod» (suggestion), «ijozat»
# (permission, hence 'allowed'), «dakhil» (introduced, inserted), «ghalib»
# (overriding), «hal shuda» (resolved), «fishor» (press), «niwis» (write).
#
# `editor-update-viewer`'s two words are kept as the English **Update** and
# **Reset**: they sit on a narrow toolbar button, and the seed had no short
# Wakhi pair it could vouch for. The tooltip around them is Wakhi, and it puts
# the object first — «Viewer Update» — which is the word order rather than an
# untranslated string.
#
# **Counting.** CLDR has no plural data for `wbl`, and a noun after a numeral
# is unmarked, so the two accessibility counters below write a **single
# `*[other]`** branch each rather than two identical ones. No `[zero]`,
# `[two]`, `[few]` or `[many]` branch appears. See `chrome.ftl`'s header.
#
# **No copula.** As in the other three files, these are verbless nominal
# predications; a speaker should supply the copula.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Reset
       *[update] Update
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] Viewer { $word }
       *[other] Viewer { $word } { $shortcut }
    }


## The variant picker

editor-variant = Variant

editor-variant-filter = Filter…

editor-variant-next = Agla variant intikhob tsar

editor-variant-previous = Pichhla variant intikhob tsar


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] WCAG AA accessibility khilofwarzi peydo. Accessibility report { $action ->
            [close] band
           *[open] kusho
        } tsarn-ir klik tsar.
        [advisories] Accessibility report { $action ->
            [close] band
           *[open] kusho
        } tsarn-ir klik tsar. WCAG AA khilofwarzi nast, lekin digar accessibility peshnihod yast.
       *[clean] Accessibility report { $action ->
            [close] band
           *[open] kusho
        } tsarn-ir klik tsar. Accessibility masla nast.
    }

editor-accessibility-label =
    { $status ->
        [violations] WCAG AA accessibility khilofwarzi peydo. { $count ->
           *[other] { $count } WCAG AA khilofwarzi
        } peydo. Accessibility report { $action ->
            [close] band
           *[open] kusho
        } tsarn-ir klik tsar.
        [advisories] WCAG AA khilofwarzi nast. { $count ->
           *[other] { $count } digar accessibility peshnihod
        } peydo. Accessibility report { $action ->
            [close] band
           *[open] kusho
        } tsarn-ir klik tsar.
       *[clean] WCAG AA khilofwarzi nast. Accessibility report { $action ->
            [close] band
           *[open] kusho
        } tsarn-ir klik tsar.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = DoenetML version { $version }

editor-tab-help = Zamina madad
editor-tab-help-short = Zamina
editor-tab-errors = Ghalati
editor-tab-warnings = Hushdor
editor-tab-info = Ma'lumot
editor-tab-accessibility = Accessibility
editor-tab-responses = Ravon shuda jawab

editor-tab-with-count = { $label }: { $count }

editor-options = Editor tanzimot
editor-format-as-doenetml = DoenetML barin format tsar
editor-format-as-xml = XML barin format tsar


## The diagnostics panel

editor-diagnostic-line = Line #{ $line }

editor-no-errors = Ghalati nast
editor-no-warnings = Hushdor nast
editor-no-info = Ma'lumot diagnostic nast

editor-show-info-annotations = Editor-dar ma'lumot diagnostic nishon tsar
editor-show-accessibility-annotations = Editor-dar accessibility diagnostic nishon tsar

editor-accessibility-learn-more = Doenet accessibility bora ziyot ma'lumot

editor-accessibility-violations-heading = Accessibility khilofwarzi ({ $standard })

editor-accessibility-other-heading = Digar accessibility masla
editor-none-found = Chiz peydo nast


## Submitted responses

editor-no-responses = Hanuz ravon shuda jawab nast
editor-response-answer-id = Answer Id
editor-response-response = Jawab
editor-response-credit = Credit
editor-response-submitted = Ravon


## The context-help panel

help-placeholder = Documentation-ir tag nung, attribute yo { $ref }-dar cursor tsar.

help-unsupported-ref-chain = { $example } barin bisyor-hissa reference-ir madad hanuz nast.

help-unresolved-ref =
    { $reason ->
        [notFound] Yem reference-ir referent peydo nast: { $ref }.
        [multiple] Yem reference-ir bisyor referent peydo: { $ref }.
       *[indeterminate] { $ref }-ir referent nomalum.
    }

help-learn-about-references = Reference bora ziyot ma'lumot →
help-reference-page = Reference safha →

help-suggestions-header =
    { $location ->
        [inside] { $element }-dar
       *[top] Top level-dar
    }{ $allowed ->
        [none] { " — dram chiz nast." }
        [text] { " — dram text niwis." }
        [text-and-components] { " — dram text niwis, yo yem koshish tsar:" }
       *[components] { " — koshish tsar:" }
    }

help-suggestions-footer = Tamom { $total } component nishon tsarn-ir { $shortcut } fishor tsar.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } { $target }-ir reference.
       *[other] { $ref } { $target }-ir reference (line { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] { $owner } yaw { $role } barin dakhil tsar.
       *[other] { $owner } line { $line }-dar yaw { $role } barin dakhil tsar.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } { $element }-dar { $property } property-ir reference.
       *[other] { $ref } { $element }-dar { $property } property-ir reference (line { $line }).
    }

help-kind-attribute = attribute
help-kind-snippet = snippet
help-kind-array-entry = array entry

help-default = Default:
help-active-default = Faol default:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Ijozat value (har item-ir yiw):
       *[other] Ijozat value:
    }

help-suggested-values = Peshnihod value:

help-inserts = Dakhil tsart:

help-coordinates =
    { $count ->
       *[other] Coordinate:
    }

help-type = Type:

help-resolved-style = Hal shuda style (styleNumber { $styleNumber }):

help-resolved-function-names = Hal shuda function nung:
help-reset-list = Yem input-dar list reset:
help-added-on-input = Yem input-dar zam:
help-removed-on-input = Yem input-dar hazf:

help-reset-overrides = { $reset } { $additional } at { $removed }-ir ghalib.
