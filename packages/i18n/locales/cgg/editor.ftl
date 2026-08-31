# Chiga (Rukiga) editor and language-server surfaces: the footer, the
# diagnostics panel, the variant picker, the accessibility button, and the
# context-help panel beside them. Selected by `uiLocale`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Script and orthography.** As `chrome.ftl` sets it out: the shared
# Runyankore-Rukiga standard, `c` and not `ch`, the augment written, Latin
# digits.
#
# `WCAG`, `WCAG AA`, `DoenetML`, `XML` and `styleNumber` are names rather than
# words and stay exactly as they stand, as do the key combinations `$shortcut`
# carries.
#
# **What is Rukiga here.** The panel's own frame: «Tihariho …» for *no X
# found*, «Kanda …» for *click to …*, «Manya …» for *learn about*,
# «nikyoreka» for *is a reference to*, «ekiranga» for an attribute,
# «omuhendo» for a value — the word `diagnostics.ftl` uses, not
# «ekigyendererwa», which this catalog spends on *objectives* in
# `content.ftl` — «omuringo» for a variant and for a type,
# «eibara» for a name — the Kigezi word, where Runyankore says «eiziina».
#
# **What is borrowed.** English, openly and only where the word is what a
# Ugandan classroom says: «fonkishoni», «eripoota», «tagi». The two counted
# selects below use ordinary Rukiga nouns («ekizibu» / «ebizibu»,
# «endagiriro») rather than a loan for *violation*, so that the plural has
# something to work on.
#
# **Weakest here.** «okuhikaho» is doing duty for *accessibility* throughout —
# it is «okuhika aha», *reaching*, which is the right idea but is not an
# established Rukiga technical term, and a reviewer should decide whether it
# reads as one. `help-kind-snippet` («akacweka») and `help-kind-array-entry`
# are the two other places where the seed had to describe rather than name.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] Garurayo
       *[update] Hyahyisa
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } Omworeki
       *[other] { $word } Omworeki { $shortcut }
    }


## The variant picker

editor-variant = Omuringo

editor-variant-filter = Cwamu…

editor-variant-next = Toorana omuringo ogurikukuratsya

editor-variant-previous = Toorana omuringo ogwahweireho


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] Hashangirwe ekizibu kya WCAG AA omu kuhikaho. Kanda { $action ->
            [close] okwigara
           *[open] okwigura
        } eripoota y'okuhikaho.
        [advisories] Kanda { $action ->
            [close] okwigara
           *[open] okwigura
        } eripoota y'okuhikaho. Tihariho kizibu kya WCAG AA ekishangirwe, kwonka hariho endagiriro ezindi z'okuhikaho.
       *[clean] Kanda { $action ->
            [close] okwigara
           *[open] okwigura
        } eripoota y'okuhikaho. Tihariho bizibu by'okuhikaho ebishangirwe.
    }

editor-accessibility-label =
    { $status ->
        [violations] Hashangirwe ekizibu kya WCAG AA omu kuhikaho. { $count ->
            [one] Hashangirwe ekizibu { $count } kya WCAG AA
           *[other] Hashangirwe ebizibu { $count } bya WCAG AA
        }. Kanda { $action ->
            [close] okwigara
           *[open] okwigura
        } eripoota y'okuhikaho.
        [advisories] Tihariho kizibu kya WCAG AA ekishangirwe. { $count ->
            [one] Hashangirwe endagiriro { $count } y'okuhikaho endiijo
           *[other] Hashangirwe endagiriro { $count } z'okuhikaho ezindi
        }. Kanda { $action ->
            [close] okwigara
           *[open] okwigura
        } eripoota y'okuhikaho.
       *[clean] Tihariho kizibu kya WCAG AA ekishangirwe. Kanda { $action ->
            [close] okwigara
           *[open] okwigura
        } eripoota y'okuhikaho.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Enshoneka ya DoenetML { $version }

editor-tab-help = Obuhwezi bw'ahu orikuba
editor-tab-help-short = Ahu orikuba
editor-tab-errors = Ebihabo
editor-tab-warnings = Okurabura
editor-tab-info = Amakuru
editor-tab-accessibility = Okuhikaho
editor-tab-responses = Eby'okugarukamu ebyohereziibwe

editor-tab-with-count = { $label }: { $count }

editor-options = Entoorano z'omuhandiiki
editor-format-as-doenetml = Teekateeka nka DoenetML
editor-format-as-xml = Teekateeka nka XML


## The diagnostics panel

editor-diagnostic-line = Omurongo #{ $line }

editor-no-errors = Tihariho Bihabo
editor-no-warnings = Tihariho Kurabura
editor-no-info = Tihariho Makuru

editor-show-info-annotations = Yoreka amakuru omu muhandiiki
editor-show-accessibility-annotations = Yoreka ebifa aha kuhikaho omu muhandiiki

editor-accessibility-learn-more = Manya oku Doenet erikutwara okuhikaho

editor-accessibility-violations-heading = Ebizibu by'okuhikaho ({ $standard })

editor-accessibility-other-heading = Ebizibu ebindi by'okuhikaho
editor-none-found = Tihariho ekishangirwe


## Submitted responses

editor-no-responses = Tihariho by'okugarukamu ebyohereziibwe hati
editor-response-answer-id = Ekimanyiso ky'Eky'okugarukamu
editor-response-response = Ekigarukiirwemu
editor-response-credit = Amanota
editor-response-submitted = Kyohereziibwe


## The context-help panel

help-placeholder = Ta akakomo aha ibara rya tagi, aha kiranga, nari aha { $ref } okushanga ebyahandiikirwe.

help-unsupported-ref-chain = Obuhwezi aha byoreka eby'ebicweka bingi nka { $example } tiburatandike.

help-unresolved-ref =
    { $reason ->
        [notFound] Tihariho ekishangirwe aha kyoreka eki: { $ref }.
        [multiple] Hashangirwe ebintu bingi aha kyoreka eki: { $ref }.
       *[indeterminate] Eki { $ref } erikworeka tikimanyirwe.
    }

help-learn-about-references = Manya aha byoreka →
help-reference-page = Orupapura rw'ebyoreka →

help-suggestions-header =
    { $location ->
        [inside] Omunda ya { $element }
       *[top] Ahaiguru munonga
    }{ $allowed ->
        [none] { " — tihariho ekirikubaasa kuza hanu." }
        [text] { " — handiika ebigambo hanu." }
        [text-and-components] { " — handiika ebigambo hanu, nari ogyezeho:" }
       *[components] { " — ebicweka ebi orikubaasa kugyezaho:" }
    }

help-suggestions-footer = Kanda { $shortcut } okureeba ebicweka byona { $total }.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } nikyoreka { $target }.
       *[other] { $ref } nikyoreka { $target } (omurongo { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Kiruga aha { $owner } nka { $role }.
       *[other] Kiruga aha { $owner } aha murongo { $line } nka { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } nikyoreka ekiranga { $property } kya { $element }.
       *[other] { $ref } nikyoreka ekiranga { $property } kya { $element } (omurongo { $line }).
    }

help-kind-attribute = ekiranga
help-kind-snippet = akacweka
help-kind-array-entry = ekitairwe omu rukurikirana

help-default = Eky'obwire bwona:
help-active-default = Eky'obwire bwona ekirikukora:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Emihendo ekirizibwe (aha buri kintu):
       *[other] Emihendo ekirizibwe:
    }

help-suggested-values = Emihendo eteereireho:

help-inserts = Nikitaho:

help-coordinates =
    { $count ->
        [one] Ekyoreka omwanya:
       *[other] Ebyoreka emyanya:
    }

help-type = Omuringo:

help-resolved-style = Endeeba eshangirwe (styleNumber { $styleNumber }):

help-resolved-function-names = Amabara ga fonkishoni agashangirwe:
help-reset-list = Orukurikirana orugaruriibwe aha kutaho oku:
help-added-on-input = Ebyongyeirweho aha kutaho oku:
help-removed-on-input = Ebiihirweho aha kutaho oku:

help-reset-overrides = { $reset } neekira { $additional } na { $removed }.
