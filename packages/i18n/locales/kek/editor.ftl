# Qʼeqchiʼ editor and language-server surfaces: the footer, the diagnostics
# panel, the variant picker, the accessibility button and the context-help
# panel. Translated from `locales/en/editor.ftl`, which is the source of truth.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Orthography.** The ALMG alphabet; see `chrome.ftl`'s header for the
# inventory. Every apostrophe inside a Qʼeqchiʼ word is U+02BC MODIFIER LETTER
# APOSTROPHE `ʼ`, not U+2019 `’` — the two are homoglyphs in most fonts, so
# check the codepoint rather than the shape. Straight ASCII `'` is English's
# own punctuation carried through where a message quotes a value, and is not a
# Qʼeqchiʼ letter. `q` and `k` are
# two different sounds and keep separate letters; long vowels are doubled. No
# colonial-era spelling is mixed in: no `qu` for `k`, no `hu` for `w`, no `k`
# standing for uvular `q`, no `4` or `ɜ` for an ejective. The language is named
# «Qʼeqchiʼ», spelled exactly that way.
#
# **Number.** `Intl.PluralRules` has no CLDR data for `kek`; it falls back to
# the default locale and reports `one` and `other`, which Qʼeqchiʼ does not
# select. A noun after a numeral is not marked for plural, so the two counted
# messages — `editor-accessibility-label` and `help-coordinates` — are written
# as **one unselected form** and the `$count` select English wraps them in is
# dropped. The selects on `$status`, `$action`, `$shortcut`, `$reason`,
# `$location`, `$allowed`, `$line` and `$perItem` are not plural selects and
# are kept with exactly English's branches.
#
# **Loans.** The editor vocabulary is Spanish, adapted to ALMG spelling, inside
# a Qʼeqchiʼ frame: «bariante», «atributo», «komponente», «balor», «referensia»,
# «propiedad», «estilo», «funsion», «koordenada», «tipo», «lista», «areglo»,
# «kodigo», «bersion», «kursor», «etiketa». The verbs, the negations («inkʼaʼ»,
# «maakʼaʼ») and the word order around them are Qʼeqchiʼ. `WCAG AA`,
# `DoenetML`, `XML`, `styleNumber` and every key combination stay as English
# writes them.
#
# **Confidence.** Every key is answered. «Okenk» for *accessibility* is a
# description — "entering, getting in" — rather than an established term, and is
# the entry most in need of a speaker's judgement; «paltil» for *error* and
# «reetal» for *warning* are ordinary words carrying a technical load they do
# not ordinarily carry.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Sukʼisi
       *[update] Akʼobʼresi
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } li ilobʼaal
       *[other] { $word } li ilobʼaal { $shortcut }
    }


## The variant picker

editor-variant = Bariante

editor-variant-filter = Sikʼ...

editor-variant-next = Sikʼ li moqon bariante

editor-variant-previous = Sikʼ li junxil bariante


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Xtawmank jun paltil chirix li WCAG AA. Kʼe li klik re { $action ->
            [close] xtzʼapbʼal
           *[open] xteebʼal
        } li esil chirix li okenk.
        [advisories] Kʼe li klik re { $action ->
            [close] xtzʼapbʼal
           *[open] xteebʼal
        } li esil chirix li okenk. Maakʼaʼ paltil chirix li WCAG AA xtawmank, abʼan wan chik naʼlebʼ chirix li okenk.
       *[clean] Kʼe li klik re { $action ->
            [close] xtzʼapbʼal
           *[open] xteebʼal
        } li esil chirix li okenk. Maakʼaʼ chʼaʼajkilal chirix li okenk xtawmank.
    }

editor-accessibility-label =
    { $status ->
        [violations] Xtawmank jun paltil chirix li WCAG AA. { $count } paltil chirix li WCAG AA xtawmank. Kʼe li klik re { $action ->
            [close] xtzʼapbʼal
           *[open] xteebʼal
        } li esil chirix li okenk.
        [advisories] Maakʼaʼ paltil chirix li WCAG AA xtawmank. { $count } naʼlebʼ chik chirix li okenk xtawmank. Kʼe li klik re { $action ->
            [close] xtzʼapbʼal
           *[open] xteebʼal
        } li esil chirix li okenk.
       *[clean] Maakʼaʼ paltil chirix li WCAG AA xtawmank. Kʼe li klik re { $action ->
            [close] xtzʼapbʼal
           *[open] xteebʼal
        } li esil chirix li okenk.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Bersion re DoenetML { $version }

editor-tab-help = Tenqʼ chirix li wan saʼ ru
editor-tab-help-short = Tenqʼ
editor-tab-errors = Paltil
editor-tab-warnings = Reetal
editor-tab-info = Esil
editor-tab-accessibility = Okenk
editor-tab-responses = Sumenk taqlanbʼil

editor-tab-with-count = { $label }: { $count }

editor-options = Xnaʼlebʼ li tzʼiibʼlebʼaal
editor-format-as-doenetml = Kʼuubʼ joʼ DoenetML
editor-format-as-xml = Kʼuubʼ joʼ XML


## The diagnostics panel

editor-diagnostic-line = Raqal #{ $line }

editor-no-errors = Maakʼaʼ paltil
editor-no-warnings = Maakʼaʼ reetal
editor-no-info = Maakʼaʼ esil

editor-show-info-annotations = Kʼutbʼesi li esil saʼ li tzʼiibʼlebʼaal
editor-show-accessibility-annotations = Kʼutbʼesi li esil chirix li okenk saʼ li tzʼiibʼlebʼaal

editor-accessibility-learn-more = Tzol chanru naxkʼe reetal li okenk li Doenet

editor-accessibility-violations-heading = Paltil chirix li okenk ({ $standard })

editor-accessibility-other-heading = Jun chik chʼaʼajkilal chirix li okenk
editor-none-found = Maakʼaʼ


## Submitted responses

editor-no-responses = Toj maakʼaʼ sumenk taqlanbʼil
editor-response-answer-id = Xkʼabaʼ li sumenk
editor-response-response = Sumenk
editor-response-credit = Punto
editor-response-submitted = Taqlanbʼil


## The context-help panel

help-placeholder = Kʼe li kursor saʼ xkʼabaʼ jun etiketa, jun atributo, malaj { $ref } re xtawbʼal li esil.

help-unsupported-ref-chain = Toj maajiʼ nakʼanjelak li tenqʼ chirix eb li referensia kʼiila jachal joʼ { $example }.

help-unresolved-ref =
    { $reason ->
        [notFound] Inkʼaʼ xtawmank kʼaʼru naxye li referensia: { $ref }.
        [multiple] Kʼiila li naxye li referensia: { $ref }.
       *[indeterminate] Inkʼaʼ naru xnawbʼal kʼaʼru naxye { $ref }.
    }

help-learn-about-references = Tzol chirix eb li referensia →
help-reference-page = Perel re referensia →

help-suggestions-header =
    { $location ->
        [inside] Saʼ { $element }
       *[top] Saʼ xbʼeen naʼajej
    }{ $allowed ->
        [none] { " — maakʼaʼ naru naxik arin." }
        [text] { " — tzʼiibʼa tzʼiibʼ arin." }
        [text-and-components] { " — tzʼiibʼa tzʼiibʼ arin, malaj yal:" }
       *[components] { " — kʼaʼru naru taayal:" }
    }

help-suggestions-footer = Kʼe { $shortcut } re rilbʼal chixjunil li { $total } komponente.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } aʼan jun referensia re { $target }.
       *[other] { $ref } aʼan jun referensia re { $target } (raqal { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Kʼeebʼil xbʼaan { $owner } joʼ { $role }.
       *[other] Kʼeebʼil xbʼaan { $owner } saʼ li raqal { $line } joʼ { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } aʼan jun referensia re li propiedad { $property } re { $element }.
       *[other] { $ref } aʼan jun referensia re li propiedad { $property } re { $element } (raqal { $line }).
    }

help-kind-attribute = atributo
help-kind-snippet = jachal kodigo
help-kind-array-entry = jachal re li areglo

help-default = Kʼeebʼil chi junelik:
help-active-default = Yoo chi kʼanjelak chi junelik:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Balor naru (jun re li junjunq):
       *[other] Balor naru:
    }

help-suggested-values = Balor kʼeebʼil chi rilbʼal:

help-inserts = Naxkʼe:

help-coordinates = Koordenada:

help-type = Tipo:

help-resolved-style = Estilo kʼuubʼanbʼil (styleNumber { $styleNumber }):

help-resolved-function-names = Xkʼabaʼ eb li funsion kʼuubʼanbʼil:
help-reset-list = Sukʼisi li lista saʼ li okebʼaal aʼin:
help-added-on-input = Kʼeebʼil saʼ li okebʼaal aʼin:
help-removed-on-input = Isinbʼil saʼ li okebʼaal aʼin:

help-reset-overrides = { $reset } naxnumsi { $additional } ut { $removed }.
