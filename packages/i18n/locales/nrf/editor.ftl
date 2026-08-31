# Norman (Nouormand) editor and language-server surfaces. Translated from
# `locales/en/editor.ftl`, which is the source of truth: `lint:i18n` rejects a
# key that does not exist there, and reports a key that exists there but not
# here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Which Norman.** The tag `nrf` covers Jèrriais, Guernésiais (with
# Sercquiais and Auregnais) and continental Norman — Cotentinais, Augeron,
# Cauchois. There is no pan-Norman standard, so this catalog is written in
# **Jèrriais**, in **Le Maistre's** dictionary orthography (1966), the only
# Norman variety with a settled written norm. A Guernésiais or continental
# reviewer should expect to respell rather than to correct. `chrome.ftl`
# gives the spelling letter by letter.
#
# `WCAG AA`, `DoenetML`, `XML`, `styleNumber` and every attribute or element
# name are identifiers, not prose, and stay as written.
#
# **What is Norman's own.** The imperative is the 2nd person plural in `-ez`
# / `-iz` that this catalog addresses a reader with: «Cliqu'tez», «Mettez»,
# «Appouyiz». The connectives and function words are Jèrriais: the negator
# **«pon»**, the relativiser **«tchi»**, **«auve»** for *with*, «nul» /
# «nulle» for *no…*, «pour» for *in order to*, «sus» for *on*, «entre» for
# *between*, «à l'întérieu dé» for *inside*, «passe d'vant» for *overrides*,
# «co» for *yet*, «où'est qu'» for *where*. «erreu» is the Jèrriais word for
# an error and «ligne» for a line.
#
# **What is borrowed.** The editorial and accessibility vocabulary is French
# respelled by Le Maistre's rules: «variante», «filtrer», «accessibilité»,
# «violâtion», «recoumandâtion», «rapport», «vèrsion», «contexte»,
# «înformâtion», «référence», «propriété», «coordonnée», «documentâtion»,
# «attribut». Schooling in Jersey is in English, so this register is a
# written-French inheritance. Two entries are the weakest in the file:
# «tabl'yeau» for an array and «boutchet» for a snippet.
#
# **Counts.** `Intl.PluralRules` has **no CLDR data for `nrf`**, so no
# `[zero]`, `[two]`, `[few]` or `[many]` branch appears anywhere in this
# catalog. `[one]` *is* kept in the two counted messages —
# `editor-accessibility-label` and `help-coordinates` — because Jèrriais
# writes its plural («eune violâtion» / «deux violâtions», «Coordonnée» /
# «Coordonnées»), so the two branches are two different sentences.
#
# **Punctuation.** Jersey typography follows **English** practice: no space
# before `:`, `;`, `?` or `!` anywhere in these four files.
#
# **Weakest first.** A reviewer should attack «tabl'yeau» and «boutchet»,
# then the context-help sentences, which are the longest prose in the four
# files.


## The viewer's controls

editor-update-viewer =
    { $action ->
        [reset] R'mettre
       *[update] Mettre à jour
    }

editor-update-viewer-title =
    { $shortcut ->
        [none] { $word } l'affichoue
       *[other] { $word } l'affichoue { $shortcut }
    }


## The variant picker

editor-variant = Variante
editor-variant-filter = Filtrer…
editor-variant-next = Chouaisi la variante siêvante
editor-variant-previous = Chouaisi la variante prêcédente


## The accessibility status button

editor-accessibility-title =
    { $status ->
        [violations] On a trouvé eune violâtion d'l'accessibilité WCAG AA. Cliqu'tez pour { $action ->
            [close] framer
           *[open] ouvri
        } lé rapport d'accessibilité.
        [advisories] Cliqu'tez pour { $action ->
            [close] framer
           *[open] ouvri
        } lé rapport d'accessibilité. Nulle violâtion WCAG AA n'a 'té trouvée, mais i' y'a d'aut's recoumandâtions d'accessibilité.
       *[clean] Cliqu'tez pour { $action ->
            [close] framer
           *[open] ouvri
        } lé rapport d'accessibilité. Nul problème d'accessibilité n'a 'té trouvé.
    }

editor-accessibility-label =
    { $status ->
        [violations] On a trouvé eune violâtion d'l'accessibilité WCAG AA. { $count ->
            [one] { $count } violâtion WCAG AA trouvée
           *[other] { $count } violâtions WCAG AA trouvées
        }. Cliqu'tez pour { $action ->
            [close] framer
           *[open] ouvri
        } lé rapport d'accessibilité.
        [advisories] Nulle violâtion WCAG AA n'a 'té trouvée. { $count ->
            [one] { $count } recoumandâtion d'accessibilité dé pus trouvée
           *[other] { $count } recoumandâtions d'accessibilité dé pus trouvées
        }. Cliqu'tez pour { $action ->
            [close] framer
           *[open] ouvri
        } lé rapport d'accessibilité.
       *[clean] Nulle violâtion WCAG AA n'a 'té trouvée. Cliqu'tez pour { $action ->
            [close] framer
           *[open] ouvri
        } lé rapport d'accessibilité.
    }

editor-accessibility-badge = WCAG


## The footer

editor-version-title = Vèrsion DoenetML { $version }

editor-tab-help = Aîgue s'lon lé contexte
editor-tab-help-short = Contexte
editor-tab-errors = Erreurs
editor-tab-warnings = Avèrtissements
editor-tab-info = Înformâtions
editor-tab-accessibility = Accessibilité
editor-tab-responses = Rêponses env'yées

editor-tab-with-count = { $label }: { $count }

editor-options = Options d'l'êditeu
editor-format-as-doenetml = Mettre en forme coumme DoenetML
editor-format-as-xml = Mettre en forme coumme XML


## The diagnostics panel

editor-diagnostic-line = Ligne n° { $line }

editor-no-errors = Nulle erreu
editor-no-warnings = Nul avèrtissement
editor-no-info = Nul message d'înformâtion

editor-show-info-annotations = Montrer les messages d'înformâtion dans l'êditeu
editor-show-accessibility-annotations = Montrer les messages d'accessibilité dans l'êditeu

editor-accessibility-learn-more = Vaie coumme Doenet aborde l'accessibilité

editor-accessibility-violations-heading = Violâtions d'l'accessibilité ({ $standard })

editor-accessibility-other-heading = Aut's problèmes d'accessibilité
editor-none-found = Rein d'trouvé


## Submitted responses

editor-no-responses = Nulle rêponse env'yée pour lé moment
editor-response-answer-id = Id d'la rêponse
editor-response-response = Rêponse
editor-response-credit = Points
editor-response-submitted = Env'yée


## The context-help panel

help-placeholder = Mettez lé curseu sus un nom d'balise, un attribut ou { $ref } pour la documentâtion.

help-unsupported-ref-chain = L'aîgue pour les référence en pus d'eune partie coumme { $example } n'est pon co supportée.

help-unresolved-ref =
    { $reason ->
        [notFound] Nul référent trouvé pour la référence: { $ref }.
        [multiple] Pus d'un référent trouvé pour la référence: { $ref }.
       *[indeterminate] Un référent pour { $ref } n'a pon peu êt' dêterminé.
    }

help-learn-about-references = En saver pus sus les référence →
help-reference-page = Page dé référence →

help-suggestions-header =
    { $location ->
        [inside] À l'întérieu dé { $element }
       *[top] Au nivieau lé pus haut
    }{ $allowed ->
        [none] { " — rein n'va ichîn." }
        [text] { " — tapez du texte ichîn." }
        [text-and-components] { " — tapez du texte ichîn, ou sayiz:" }
       *[components] { " — des choses à sayi:" }
    }

help-suggestions-footer = Appouyiz sus { $shortcut } pour vaie touos les { $total } composants.

help-name-summary = { $name } — { $summary }

help-ref-is-reference =
    { $line ->
        [none] { $ref } est eune référence à { $target }.
       *[other] { $ref } est eune référence à { $target } (ligne { $line }).
    }

help-ref-derived-from =
    { $line ->
        [none] Mîns en pliaiche par { $owner } coumme { $role }.
       *[other] Mîns en pliaiche par { $owner } à la ligne { $line } coumme { $role }.
    }

help-property-is-reference =
    { $line ->
        [none] { $ref } est eune référence à la propriété { $property } dé { $element }.
       *[other] { $ref } est eune référence à la propriété { $property } dé { $element } (ligne { $line }).
    }

help-kind-attribute = attribut
help-kind-snippet = boutchet
help-kind-array-entry = entrée dé tabl'yeau

help-default = Valeu par dêfaut:
help-active-default = Valeu par dêfaut active:

help-style-number-annotation = { " " }(styleNumber { $styleNumber })

help-allowed-values =
    { $perItem ->
        [true] Valeurs permînses (eune par êlément):
       *[other] Valeurs permînses:
    }

help-suggested-values = Valeurs propôsées:

help-inserts = Mettre en pliaiche:

help-coordinates =
    { $count ->
        [one] Coordonnée:
       *[other] Coordonnées:
    }

help-type = Type:

help-resolved-style = Style résolu (styleNumber { $styleNumber }):

help-resolved-function-names = Noms d'fonctions résolus:
help-reset-list = Liste dé r'mîse sus ch't' chant:
help-added-on-input = Ajouté sus ch't' chant:
help-removed-on-input = Ôté sus ch't' chant:

help-reset-overrides = { $reset } passe d'vant { $additional } et { $removed }.
