# Norman (Nouormand) diagnostics. Translated from
# `locales/en/diagnostics.ftl`, which is the source of truth: `lint:i18n`
# rejects a key that does not exist there, and reports a key that exists there
# but not here as missing coverage.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# **Which Norman.** The tag `nrf` covers Jèrriais, Guernésiais (with
# Sercquiais and Auregnais) and continental Norman — Cotentinais, Augeron,
# Cauchois. There is no pan-Norman standard, so this catalog is written in
# **Jèrriais**, in **Le Maistre's** dictionary orthography (1966). A
# Guernésiais or continental reviewer should expect to respell rather than to
# correct. `chrome.ftl` gives the spelling letter by letter: the dental
# «th», «bl» → «bli», «pl» → «ply», «tch» and «dg».
#
# Attribute names, element names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `<answer>`,
# `selectFromSequence` — are part of the language, not prose, and stay in
# English exactly as written. So does anything quoted back from the author's
# own source.
#
# **What is Norman's own.** The frame around every message is: «On n'peut
# pon …» for *cannot*, «dait» / «daivent» for *must*, «n'a pon 'té co fait»
# for *has not been implemented*, «pon valabl'ye» for *invalid*, «pa'ce que»
# for *because*, «don» for *so*, **«à la pliaiche»** for *instead*, «au
# mains» for *at least*, **«tréjous»** for *always*, «vide» for *empty*,
# «par dêfaut» for *by default*, «dêmodé» for *deprecated*. The negator is
# **«pon»**, the relativiser **«tchi»**, and *with* is **«auve»**. Native
# words doing real work here: «ligne» (a source line, a row), «nom» (name),
# «lettre», «forme» (shape), «rachinne» (root), «grill'ye» (grid),
# «cibl'ye» (target), «teile» (canvas), «entrée» / «sortie» (input /
# output), «guilyémets» (quote marks), «vathiabl'ye» (variable — with the
# Jèrriais intervocalic `r` → `th`).
#
# **What is borrowed.** The mathematical and computing nouns are French,
# respelled by Le Maistre's rules: «composant», «attribut», «valeu»,
# «index», «séquence», «équâtion», «matrice», «fonction», «întervalle»,
# «domaine», «parabole», «întersection», «dêpendance», «référence»,
# «contraste», «dêfinition», «annotâtion», «convèrsion», «cation», «anion»,
# «accessibilité», «pluriel», «schéma», «vèrsion», «balise», «module».
# `tag`, `prop` and `bloc` are taken from the markup as written. `WCAG AA`,
# `PreFigure`, `DoenetML` and `mathjs` are names. Schooling in Jersey is in
# **English**, so this whole register is a written-French inheritance rather
# than a spoken one; «noeud» for a syntax node is the single least certain
# word in the file.
#
# **The word for a line is «ligne» everywhere**, here and in `content.ftl`,
# for the geometric object and for a line of source text alike. Le Maistre
# records no separate Jèrriais geometric term, and coining one would be
# invention. The sister catalogs `wa` and `frp` do split the two words; this
# one deliberately does not.
#
# **Counts.** `Intl.PluralRules` has **no CLDR data for `nrf`** — the tag
# resolves against the runtime's default locale — so no `[zero]`, `[two]`,
# `[few]` or `[many]` branch appears anywhere in this catalog. `[one]` *is*
# kept in the eight counted messages, and it is doing real work: Jèrriais
# writes its plural, on the noun («un attribut» / «des attributs») and on the
# verb («est ignoré» / «sont ignorés»), so the two branches are two different
# sentences rather than one form written twice.
# `field-function-wrong-num-outputs` is the one exception and is written as the
# numeric `[1]` instead: its selector counts a component's outputs rather than
# a noun, so an exact-value match says what is meant and is not a plural
# category some other language's rules would be choosing.
#
# **Punctuation.** Jersey typography follows **English** practice: no space
# before `:`, `;`, `?` or `!` anywhere in these four files.
#
# **Weakest first.** A reviewer should attack the parser and schema sections
# (`parse-*`, `schema-*`): they are the messages a beginner meets first, and
# they carry the densest French loan vocabulary in the file.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] { $attributes } est ignoré quand les deux bouts sont donnés
       *[other] { $attributes } sont ignorés quand les deux bouts sont donnés
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } est ignoré quand un bout et un mitan sont donnés touos les deux
       *[other] { $attributes } sont ignorés quand un bout et un mitan sont donnés touos les deux
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset n'a pon d'effet sans mitan

## `<line>`

line-points-undetermined-dimensions = Ligne tchi passe par des points d'dimensions pon dêterminées.

line-points-too-few-dimensions = La ligne dait passer par des points d'au mains deux dimensions.

line-points-depend-on-variables = La ligne passe par des points tchi dêpendent des vathiabl'yes: { $variables }.

line-equation-invalid-format = Format pon valabl'ye pour l'équâtion d'eune ligne dans les vathiabl'yes { $variable1 } et { $variable2 }.

## `<ray>`

ray-overprescribed-through = La d'mi-ligne est donnée par through, endpoint et direction. Lé through donné est ignoré.

ray-dimension-mismatch = numDimensions n'correspond pon dans ray.

## `<vector>`

vector-overprescribed-head = Lé vecteu est donné par head, tail et displacement. Lé head donné est ignoré.

vector-dimension-mismatch = numDimensions n'correspond pon dans vector.

## Attracting and constraining

attract-to-without-nearest-point = On n'peut pon attither vers un `<{ $component }>` pa'ce qu'i' n'a pon d'vathiabl'ye d'êtat nearestPoint.

constrain-to-without-nearest-point = On n'peut pon restreindre à un `<{ $component }>` pa'ce qu'i' n'a pon d'vathiabl'ye d'êtat nearestPoint.

constrain-to-interior-without-nearest-point = On n'peut pon restreindre à l'întérieu d'un `<{ $component }>` pa'ce qu'i' n'a pon d'vathiabl'ye d'êtat nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition est ignoré pour un choiceInput tchi n'est pon inline

## Ordering children by index

choice-input-indices-count-mismatch = Les index donnés pour choiceInput sont ignorés pa'ce que lus nombre n'correspond pon au nombre d'enfants choice.

pretzel-indices-count-mismatch = Les index donnés pour problem sont ignorés pa'ce que lus nombre n'correspond pon au nombre d'enfants problem.

shuffle-indices-count-mismatch = Les index donnés pour shuffle sont ignorés pa'ce que lus nombre n'correspond pon au nombre d'composants.

indices-ignored-out-of-range = Les index donnés pour { $component } sont ignorés pa'ce que tchiques'uns sont hors d'portée.

pretzel-indices-repeated = Les index donnés pour pretzel sont ignorés pa'ce que tchiques'uns s'répètent.

pretzel-circuit-first-index = Les index donnés pour pretzel en mode circuit sont ignorés pa'ce que lé preunmié index dait êt' 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Pour qu'un `<{ $component }>` marche auve des enfants texte, un attribut `type` dait êt' donné.

invalid-type-defaulting-to-math = Lé type { $type } n'est pon valabl'ye pour lé composant { $component }. I' dait êt' math, text, number ou boolean. On prend math.

string-not-valid-component-to-arrange = Lé texte "{ $value }" n'est pon un composant valabl'ye pour { $component }. I' est ignoré.

## Types and variables

invalid-type-defaulting-to-number = Lé type { $type } n'est pon valabl'ye, on met lé type sus number.

invalid-variable-value = Valeu pon valabl'ye d'eune vathiabl'ye: `{ $value }`

## Variants

variant-index-must-be-number = L'index d'variante { $index } dait êt' un nombre

variant-index-must-be-integer = L'index d'variante { $index } dait êt' un entier

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` n'a pon 'té co fait pour des mesuthes absolues. Les larg'geurs sont mîses en relatif.

side-by-side-absolute-margins = `<{ $component }>` n'a pon 'té co fait pour des mesuthes absolues. Les mèrges sont mîses en relatif.

side-by-side-no-block-child = `<{ $component }>` pon valabl'ye: i' dait aver au mains un enfant d'bloc.

## `<label>`

label-for-ignored-on-graphical = L'attribut `for` sus un `<label>` graphique est ignoré.

label-for-must-resolve-to-one = L'attribut `for` sus `<label>` sé dait résoudre en justément un composant.

label-for-unresolved = L'attribut `for` sus `<label>` n'a pon peu êt' résolu en un composant.

label-for-answer-with-authored-inputs = L'attribut `for` sus `<label>` fait référence à un `<answer>` auve des chants d'entrée êcrits exprès; faites référence au chant lî-même.

label-for-answer-without-input = L'attribut `for` sus `<label>` fait référence à un `<answer>` sans chant d'entrée à êtitchetter.

label-for-must-reference-input-or-answer = L'attribut `for` sus `<label>` dait faithe référence à un chant d'entrée ou à un answer.

## Accessibility

accessibility-short-description-or-decorative = Pour l'accessibilité, `<{ $component }>` dait aver eune courte dêcription ou êt' donné coumme dêcoratif.

accessibility-video-short-description = Pour l'accessibilité, `<video>` dait aver eune courte dêcription.

accessibility-input-short-description-or-label = Pour l'accessibilité, `<{ $component }>` dait aver eune courte dêcription ou eune êtitchette.

accessibility-answer-input-short-description-or-label = Pour l'accessibilité, un `<answer>` tchi fait un chant d'entrée dait aver eune courte dêcription ou eune êtitchette.

accessibility-short-description-contains-math = Les courtes dêcriptions n'daivent pon contenîn d'composants mathémâtiques coumme `<{ $component }>`. Êcrivez les mathémâtiques auve des mots.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } n'a pon assez d'contraste pour lé texte du titre dé section (mode nièr) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; i' faut au mains { $threshold }:1).
       *[other] { $colorName } n'a pon assez d'contraste pour lé texte du titre dé section ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; i' faut au mains { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = Un `<circle>` tchi passe par { $count } points n'a pon 'té co fait quand les points n'ont pon d'valeurs numéthiques.

circle-too-many-through-points = On n'peut pon calculer un cèrcl'ye tchi passe par pus d'3 points.

circle-overprescribed-radius-center-points = On n'peut pon calculer un cèrcl'ye auve lé rayon, lé centre et les points donnés ensembl'ye.

circle-center-with-multiple-points = On n'peut pon calculer un cèrcl'ye auve un centre donné tchi passe par pus d'1 point.

circle-radius-too-small = On n'peut pon calculer lé cèrcl'ye: la distance entre les deux points êtant { $distance }, lé rayon donné { $radius } est trop p'tit.

circle-radius-with-many-points = On n'peut pon faithe un cèrcl'ye tchi passe par pus d'deux points auve un rayon donné.

circle-invalid-center-or-through-points = Lé centre ou les points d'passage du cèrcl'ye ne sont pon valabl'yes.

circle-radius-center-with-multiple-points = On n'peut pon calculer lé rayon d'un cèrcl'ye auve un centre donné tchi passe par pus d'1 point.

circle-change-radius-non-numerical = On n'peut pon changi lé rayon d'un cèrcl'ye auve des points pon numéthiques

circle-radius-with-points-non-numerical = On n'peut pon faithe un cèrcl'ye tchi passe par pus d'un point auve un rayon donné quand les valeurs ne sont pon numéthiques.

circle-change-center-non-numerical = Changi lé centre d'un cèrcl'ye tchi passe par des points auve des valeurs pon numéthiques n'a pon 'té co fait.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] I' n'y'a pon assez d'dimensions pour lé domaine d'la fonction. Lé domaine a { $intervals } întervalle mais la fonction a { $inputs ->
            [one] { $inputs } entrée
           *[other] { $inputs } entrées
        }.
       *[other] I' n'y'a pon assez d'dimensions pour lé domaine d'la fonction. Lé domaine a { $intervals } întervalles mais la fonction a { $inputs ->
            [one] { $inputs } entrée
           *[other] { $inputs } entrées
        }.
    }

function-domain-invalid-format = Format pon valabl'ye pour lé domaine d'la fonction.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Lé maximum pon numéthique d'la fonction est ignoré.
        [minimum] Lé minimum pon numéthique d'la fonction est ignoré.
        [extremum] L'extrémum pon numéthique d'la fonction est ignoré.
        [point] Lé point pon numéthique d'la fonction est ignoré.
        [slope] La pente pon numéthique d'la fonction est ignorée.
       *[other] Lé { $type } pon numéthique d'la fonction est ignoré.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Lé maximum vide d'la fonction est ignoré.
        [minimum] Lé minimum vide d'la fonction est ignoré.
        [extremum] L'extrémum vide d'la fonction est ignoré.
        [point] Lé point vide d'la fonction est ignoré.
       *[other] Lé { $type } vide d'la fonction est ignoré.
    }

function-points-too-close = La fonction a deux points trop près l'un dé l'aut'. On n'peut pon dêfinni la fonction.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Les itérâtions d'eune fonction ne sont possibl'yes que si lé nombre d'entrées est égal au nombre dé sorties. Chutte fonction a { $inputs } entrée et { $outputs ->
            [one] { $outputs } sortie
           *[other] { $outputs } sorties
        }.
       *[other] Les itérâtions d'eune fonction ne sont possibl'yes que si lé nombre d'entrées est égal au nombre dé sorties. Chutte fonction a { $inputs } entrées et { $outputs ->
            [one] { $outputs } sortie
           *[other] { $outputs } sorties
        }.
    }

## `<sequence>`

sequence-invalid-length = Longueu pon valabl'ye d'la séquence. Ch'la dait êt' un entier pon négatif.

sequence-invalid-step = Pas pon valabl'ye d'la séquence. Ch'la dait êt' un nombre pour eune séquence du type { $type }.

sequence-invalid-endpoint-number = "{ $attribute }" pon valabl'ye d'eune séquence dé nombres. Ch'la dait êt' un nombre.

sequence-invalid-endpoint-letters = "{ $attribute }" pon valabl'ye d'eune séquence dé lettres. Ch'la dait êt' eune combinaîson dé lettres.

sequence-invalid-endpoint = "{ $attribute }" pon valabl'ye d'la séquence.

select-from-sequence-coprime-not-numbers = coprime est ignoré pa'ce qu'on n'chouaisit pon des nombres

select-from-sequence-coprime-with-exclude-combinations = coprime est ignoré pa'ce que excludeCombinations est donné

## Resolving a `target`

target-not-found = target pon valabl'ye pour `<{ $source }>`: on n'peut pon trouver la cibl'ye.

target-state-variable-not-found = target pon valabl'ye pour `<{ $source }>`: on n'peut pon trouver eune vathiabl'ye d'êtat app'lée "{ $property }" sus un `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Les vathiabl'yes dé `<odeSystem>` daivent êt' difféthentes d'la vathiabl'ye îndépendante.

ode-system-duplicate-variable-names = On n'peut pon dêfinni les fonctions du côté drait d'l'ÉDO auve des noms d'vathiabl'yes dêpendantes tchi s'répètent.

ode-system-rhs-function-error = On n'peut pon dêfinni la fonction du côté drait d'l'ÉDO. Erreu à la créâtion d'la fonction mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = On n'peut pon dêfinni un angl'ye entre { $count } lignes

angle-invalid-through-point = Point pon valabl'ye dans lé through dé `<angle>`

parabola-vertex-too-many-points = Eune parabole auve un soumet tchi passe par pus d'1 point n'a pon 'té co faite.

parabola-too-many-points = Eune parabole tchi passe par pus d'3 points n'a pon 'té co faite.

intersection-too-many-items = L'întersection dé pus d'deux objets n'a pon 'té co faite

## Other math components

ionic-compound-not-two-ions = Un composé ionique pour aut'chose que deux ions n'a pon 'té co fait.

ionic-compound-needs-cation-and-anion = Un composé ionique n'a 'té fait que pour un cation et un anion.

solve-equations-cannot-evaluate = On n'peut pon résoudre l'équâtion pa'ce qu'ou n'a pon peu êt' êvaluée: { $equation }

math-operators-operand-number-required = I' faut donner un operandNumber quand on tithe un opérande mathémâtique.

eigen-decomposition-failed = On n'peut pon calculer les valeurs propres d'la matrice

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: lé paramètre { $parameters } n'se trouve pon dans lé modèle, don i' correspondra tréjous à un vide.
       *[other] `<matchesPattern>`: les paramètres { $parameters } n'se trouvent pon dans lé modèle, don i' correspondront tréjous à un vide.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: on n'peut pon comprendre grid="{ $grid }". Ch'la dait êt' none, medium, dense, ou deux nombres positifs séparés par un espace, coumme grid="1 0.5". Nulle grill'ye n'est dessinée.

## `<slopeField>` and `<vectorField>`

field-function-wrong-num-outputs =
    `<{ $component }>` a bésoin d'eune fonction auve { $expected ->
        [1] eune seule sortie, la pente y' à chaque point, coumme `y - x`
       *[other] deux sorties, lé vecteu à chaque point, coumme `(y, -x)`
    }, mais la fonction tch'on lî a donné a { $found ->
        [one] { $found } sortie
       *[other] { $found } sorties
    }. { $alternative ->
        [none] I' n'y'a rein à dessiner.
       *[other] `<{ $alternative }>` est lé composant pour chutte fonction. I' n'y'a rein à dessiner.
    }

field-function-attribute-ignored-with-child = L'attribut `function` est ignoré pa'ce que la fonction est étout donnée à l'întérieu du composant; ch'est chette-là d'dédans tch'on prend. Donnez la fonction ryen qu'd'eune des deux manières.

field-variables-ignored =
    `<{ $component }>`: l'attribut `variables` nomme les vathiabl'yes d'eune expression êcrite drait à l'întérieu du composant. { $reason ->
        [function-child] La fonction est ichîn donnée coumme un enfant `<function>`, tchi nomme ses propres vathiabl'yes, don `variables` est ignoré.
       *[no-expression] I' n'y'a nulle telle expression ichîn, don `variables` est ignoré.
    }

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" n'est pon supporté par lé module prefigure; on prend lé comportément d'la position draite.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" n'est pon supporté par lé module prefigure; on prend lé comportément d'la position haute.

prefigure-invalid-axis-bounds = `<graph>`: limites d'axes pon valabl'yes pour la convèrsion en prefigure; on prend la bbox par dêfaut (-10,-10,10,10).

prefigure-invalid-width = `<graph>`: larg'geur pon valabl'ye pour la convèrsion en prefigure; on prend la larg'geur par dêfaut 425.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio pon valabl'ye pour la convèrsion en prefigure; on prend lé rapport par dêfaut 1.

prefigure-grid-spacing-too-fine = `<graph>`: l'espacement d'la grill'ye est trop fîn pour les limites des axes; la grill'ye est omîse dans lé module prefigure.

prefigure-annotations-not-rendered = `<graph>`: les annotâtions n'sont pon affichies quand on n'emplyie pon lé module PreFigure.

multiple-annotations-children = Pus d'un enfant `<annotations>` trouvé dans `<graph>`; touos hormis lé dèrnié sont ignorés.

## Referring to other components

copy-unrecognized-component-type = On n'peut pon êtendre ou copier un type dé composant pon connu: { $type }.

copy-prop-not-found = On n'peut pon trouver lé prop { $property } sus un composant du type { $component }

collect-no-source = Nulle souorche trouvée pour collect.

collect-invalid-component-type = On n'peut pon ramasser des composants du type `<{ $component }>` pa'ce que ch'est un type dé composant pon valabl'ye.

reference-index-unavailable = On n'peut pon faithe référence à l'index `{ $reference }`

## `<callAction>`

component-action-unavailable = On n'peut pon app'ler { $action } sus lé composant `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Les données ont eune forme pon valabl'ye. Les rangies n'ont pon la même longueu. Trouvé dans componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Les données ont des noms d'colonnes tchi s'répètent. Trouvé dans componentIdx :{ $componentIdx }

data-frame-missing-column-name = Un nom d'colonne manque ès données. Trouvé dans componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Un award dé chutte rêponse s'base sus la rêponse env'yée par la balise answer lî-même, tchi donnera un comportément pon attendu.

answer-max-num-attempts-in-section-wide-check-work = Mettre `maxNumAttempts` sus un `<answer>` à l'întérieu d'un contenneu auve `sectionWideCheckWork` n'a pon d'effet, pa'ce que ch'est lé contenneu tchi mène lé nombre d'essais. Mettez `maxNumAttempts` sus lé contenneu à la pliaiche.

nested-section-wide-check-work-max-num-attempts = Mettre `maxNumAttempts` sus un contenneu auve `sectionWideCheckWork` tchi s'trouve à l'întérieu d'un aut' contenneu auve `sectionWideCheckWork` n'a pon d'effet, pa'ce que ch'est lé contenneu d'dehors tchi mène lé nombre d'essais. Mettez `maxNumAttempts` sus lé contenneu d'dehors à la pliaiche.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] L'attribut { $attributes } n'étha pon d'effet sans symbolicEquality.
       *[other] Les attributs { $attributes } n'éthont pon d'effet sans symbolicEquality.
    }

answer-invalid-type = Type pon valabl'ye pour la rêponse: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Coumme lé composant `<{ $component }>` n'a pon d'nom, i' n'peut pon servi coumme attribut d'un module

module-attribute-name-already-defined = Lé composant `<{ $component } name="{ $name }">` n'peut pon servi coumme attribut d'un module pa'ce que lé type dé composant `<module>` a dêjà un attribut "{ $name }".

conditional-content-condition-ignored = L'attribut `condition` est ignoré sus un composant `<conditionalContent>` auve des enfants case ou else.

slider-markers-type-mismatch = Lé type des marques n'correspond pon au type du curseu.

pretzel-problem-needs-statement-and-answer = pretzel pon valabl'ye: chaque `<problem>` dait contenîn un `<statement>` et un `<answer>`.

pretzel-circuit-first-problem-distractor = pretzel pon valabl'ye: en mode="circuit", lé preunmié `<problem>` n'peut pon êt' un distracteu.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Valeu pon valabl'ye { $values } pour l'attribut `{ $attribute }`; ignorée.
       *[other] Valeurs pon valabl'yes { $values } pour l'attribut `{ $attribute }`; ignorées.
    }

attribute-must-be-references = Valeu pon valabl'ye `{ $value }` pour l'attribut `{ $attribute }`. L'attribut dait êt' fait dé référence tchi c'menchent par un `$`.

math-input-invalid-function-names = <mathInput>: les noms d'fonctions pon valabl'yes dans { $attribute } sont ignorés: { $names }. La partie affichie dé chaque nom dait faithe au mains 2 caractéthes (des lettres ou des traits d'union); un suffixe `|<mathspeak alternative>` peut siéthe, mais n'est pon oblidgi.

## Building components from the source

component-type-invalid = Type dé composant pon valabl'ye: `<{ $componentType }>`

attribute-repeated = On n'peut pon répéter l'attribut { $attribute }.

attribute-invalid-for-component = Attribut "{ $attribute }" pon valabl'ye pour un composant du type `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    La dêfinition dé style { $styleNumber } n'a pon assez d'contraste pour { $context ->
        [text-on-background] la couleu du texte contre la couleu du fond
        [high-contrast] la couleu dé haut contraste contre la teile
        [line] la couleu d'la ligne contre la teile
        [marker] la couleu d'la marque contre la teile
       *[text-on-canvas] la couleu du texte contre la teile
    }{ $mode ->
        [dark] { " (mode nièr)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; i' faut au mains { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Bein qu'la dêfinition dé style { $styleNumber } donne des couleurs auve assez d'contraste pour lé mode cliai, les couleurs du mode nièr faites dé ches valeurs n'ont pon assez d'contraste pour la couleu du texte contre la couleu du fond ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; i' faut au mains { $threshold }:1). { $suggestion ->
        [available] Pour aver assez d'contraste en mode nièr, ou bein augmentez lé contraste du mode cliai (par exempl'ye { $lightAttribute }="{ $lightColor }"), ou bein changiz la couleu du mode nièr (par exempl'ye { $darkAttribute }="{ $darkColor }").
       *[none] Pour aver assez d'contraste en mode nièr, augmentez lé contraste du mode cliai ou changiz les couleurs faites auve textColorDarkMode et/ou backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Bein qu'la dêfinition dé style { $styleNumber } donne eune couleu d'texte auve assez d'contraste pour lé mode cliai, la couleu d'texte du mode nièr faite dé chutte valeu n'a pon assez d'contraste contre la teile ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; i' faut au mains { $threshold }:1). { $suggestion ->
        [available] Pour aver assez d'contraste en mode nièr, ou bein augmentez lé contraste du mode cliai (par exempl'ye textColor="{ $lightColor }"), ou bein changiz la couleu du mode nièr (par exempl'ye textColorDarkMode="{ $darkColor }").
       *[none] Pour aver assez d'contraste en mode nièr, augmentez lé contraste du mode cliai ou changiz la couleu faite auve textColorDarkMode.
    }

section-multiple-style-palettes = Eune section n'peut chouaisi qu'eune seule <stylePalette>; on prend la dèrnié.

## Unique variants

variant-num-to-select-not-non-negative-integer = on n'peut pon dêterminer les variantes uniques dé { $component } pa'ce que numToSelect n'est pon un entier pon négatif.

variant-num-to-select-not-constant-number = on n'peut pon dêterminer les variantes uniques dé { $component } pa'ce que numToSelect n'est pon un nombre constant.

variant-with-replacement-not-constant-boolean = on n'peut pon dêterminer les variantes uniques dé { $component } pa'ce que withReplacement n'est pon un boolean constant.

variant-select-weight-disables-unique = Les variantes uniques pour select sont dêsactivées s'i' y'a eune option auve un selectWeight ou un selectForVariants donné

variant-coprime-undetermined = on n'peut pon dêterminer les variantes uniques dé { $component } pa'ce qu'on n'peut pon dêterminer que coprime est tréjous faux.

variant-attribute-not-constant = on n'peut pon dêterminer les variantes uniques dé { $component } pa'ce que { $attribute } n'est pon eune constante.

variant-attribute-not-number = on n'peut pon dêterminer les variantes uniques dé { $component } pa'ce que { $attribute } n'est pon un nombre.

variant-attribute-wrong-type-for-sequence =
    on n'peut pon dêterminer les variantes uniques dé { $component } du type { $type } pa'ce que { $attribute } n'est pon { $expected ->
        [letters-combination] eune combinaîson dé lettres
        [math-expression] eune expression mathémâtique valabl'ye
        [integer] un entier
       *[number] un nombre
    }.

variant-length-not-integer = on n'peut pon dêterminer les variantes uniques dé { $component } pa'ce que length n'est pon un entier.

variant-sort-not-implemented = les variantes uniques d'un { $component } auve sort n'ont pon 'té co faites

variant-exclude-combinations-not-implemented = les variantes uniques d'un { $component } auve excludeCombinations n'ont pon 'té co faites

variant-math-exclude-not-implemented = les variantes uniques d'un { $component } du type math auve exclude n'ont pon 'té co faites

variant-non-constant-exclude-not-implemented = les variantes uniques d'un { $component } auve un exclude pon constant n'ont pon 'té co faites

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: pon supporté par lé module prefigure du graphique; lé dêcendant est sauté.

prefigure-descendant-invalid-geometry = { $subject }: géométrie pon finnie ou pon complète; lé dêcendant est sauté.

prefigure-curve-label-omitted = { $subject }: les êtitchettes ne sont pon supportées sus les êléments d'courbe convèrtis; l'êtitchette est omîse.

prefigure-curve-unsupported-definition-type = { $subject }: type dé dêfinition d'fonction dé courbe pon supporté '{ $definitionType }'; lé dêcendant est sauté.

prefigure-region-flip-functions-unsupported = { $subject }: attribut flipFunctions pon supporté sus regionBetweenCurves; lé dêcendant est sauté.

prefigure-region-non-formula-child = { $subject }: sus regionBetweenCurves, i' n'y'a qu'les fonctions enfants données par eune formule tchi sont supportées; lé dêcendant est sauté.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' pon supporté pour { $labelKind ->
        [line-family] eune êtitchette d'la famil'ye des lignes
       *[point] eune êtitchette dé point
    }; on prend l'alignement PreFigure par dêfaut.

prefigure-fill-style-unsupported = { $subject }: lé style dé remplîssage '{ $fillStyle }' n'est pon supporté par PreFigure; on r'vient à un remplîssage plein.

prefigure-line-style-unknown = { $subject }: style dé ligne pon connu '{ $lineStyle }' omis d'la sortie PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject }: lé style dé marque '{ $markerStyle }' a 'té convèrti en style PreFigure 'diamond'.

prefigure-marker-style-unsupported = { $subject }: lé style dé marque '{ $markerStyle }' n'est pon supporté par PreFigure; on prend lé style par dêfaut.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` pon valabl'ye; on n'peut pon résoudre la cibl'ye. L'annotâtion est omîse.

annotation-ref-multiple-targets = `<annotation>`: `ref` s'est résolu en pus d'eune cibl'ye; on prend la preunmié.

annotation-ref-outside-graph = `<annotation>`: `ref` pon valabl'ye; la cibl'ye est hors du graphique tchi la contchent. L'annotâtion est omîse.

annotation-ref-unsupported-target = `<annotation>`: `ref` pon valabl'ye; la cibl'ye n'est pon un objet graphique supporté dans la convèrsion prefigure. L'annotâtion est omîse.

annotation-text-missing = `<annotation>`: `text` tchi manque ou vide; on env'ye un texte vide.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] On a trouvé eune dêpendance circulaithe.
       *[other] On a trouvé eune dêpendance circulaithe auve un composant `<{ $componentType }>`.
    }

reference-no-referent = Nul référent trouvé pour la référence: `{ $reference }`

reference-multiple-referents = Pus d'un référent trouvé pour la référence: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Format pon valabl'ye pour l'attribut { $attribute } dé `<{ $componentType }>`.

children-invalid = Enfants pon valabl'yes pour `<{ $componentType }>`: enfants pon valabl'yes trouvés: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Valeu pon valabl'ye `{ $value }` pour l'attribut `{ $attribute }`, on prend la valeu `{ $default }`

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Vèrsion DoenetML { $version } pon trouvée.
       *[other] Vèrsion DoenetML { $version } pon trouvée. On r'vient à la vèrsion { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML pon valabl'ye: { $content }

parse-tag-missing-close-tag = DoenetML pon valabl'ye: la balise `{ $tag }` n'a pon d'balise dé framment. On attendait eune balise tchi s'frame lî-même ou eune balise `</{ $tagName }>`.

parse-tag-error = DoenetML pon valabl'ye: erreu dans la balise `<{ $tagName }>`

parse-attribute-missing-value = DoenetML pon valabl'ye: i' pathaît qu'l'attribut pon valabl'ye `{ $attribute }` n'a pon d'valeu.

parse-attribute-invalid = DoenetML pon valabl'ye: attribut pon valabl'ye `{ $attribute }`

parse-attribute-value-invalid = DoenetML pon valabl'ye: valeu d'attribut pon valabl'ye `{ $value }`

parse-attribute-value-quote-mismatch = DoenetML pon valabl'ye: valeu d'attribut pon valabl'ye `{ $value }`. Les guilyémets n'vont pon ensembl'ye. I' pathaît qu'i' vos manque un `{ $quote }`

parse-open-tag-name-missing = DoenetML pon valabl'ye: eune balise sans nom trouvée, par exempl'ye `<`

parse-tag-not-closed = DoenetML pon valabl'ye: la balise `{ $tag }` n'a pon 'té framée (i' pathaît qu'i' manque un `>`).

parse-self-closing-tag-name-missing = DoenetML pon valabl'ye: eune balise sans nom trouvée `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML pon valabl'ye: la balise `{ $tag }` n'a pon 'té framée (i' pathaît qu'i' manque `/>`).

parse-tag-invalid-attributes = DoenetML pon valabl'ye: la balise `{ $tag }` n'est pon valabl'ye. Ou peut aver des attributs pon corrects.

parse-close-tag-name-missing = DoenetML pon valabl'ye: eune balise dé framment sans nom trouvée, par exempl'ye `</`

parse-attribute-value-unquoted = Les valeurs des attributs daivent êt' entre guilyémets: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML pon valabl'ye: balise dé framment `{ $tag }` trouvée, mais nulle balise d'ouvèrtuthe tchi lî correspond

parse-close-tag-mismatched = DoenetML pon valabl'ye: balise dé framment tchi n'correspond pon. On attendait `</{ $expected }>`. On a trouvé `{ $found }`

parser-node-unconvertible = On n'peut pon convèrti lé noeud { $node } en noeud Dast.

## Names

name-attribute-invalid =
    Attribut name='{ $name }' pon valabl'ye. { $reason ->
        [characters] Les noms n'peuvent contenîn qué des lettres, des chiffres, des tirets bas ou des traits d'union.
       *[start] Les noms daivent c'menchi par eune lettre.
    }

component-name-invalid-start = Nom d'composant "{ $name }" pon valabl'ye. Les noms daivent c'menchi par eune lettre.

## `<answer>` sugar

answer-video-watched-missing-video = Un answer du type videoWatched dait aver un attribut video

answer-video-watched-video-not-reference = Un answer du type videoWatched dait aver un attribut video tch'est eune référence

answer-name-not-single-text = L'attribut name d'un answer dait aver un seul enfant texte

## Referencing another document

external-doenetml-recursion-limit = On n'peut pon r'trouver lé DoenetML d'dehors à cause dé trop d'nivieaux dé récursion. N'y'étha-t-i' pon eune référence circulaithe?

external-doenetml-unavailable = On n'peut pon r'trouver dé DoenetML dépis { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML pon valabl'ye r'trouvé dépis { $attribute }="{ $uri }": i' n'correspond pon au type dé composant "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] L'attribut `{ $from }` est dêmodé; emplyiz `{ $to }` à la pliaiche.
       *[other] [deprecation] L'attribut `{ $from }` sus `<{ $component }>` est dêmodé; emplyiz `{ $to }` à la pliaiche.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] L'attribut `{ $from }` est dêmodé et ignoré pa'ce que `{ $to }` est étout donné.
       *[other] [deprecation] L'attribut `{ $from }` sus `<{ $component }>` est dêmodé et ignoré pa'ce que `{ $to }` est étout donné.
    }

deprecated-attribute-ignored = [deprecation] L'attribut `{ $attribute }` sus `<{ $component }>` est dêmodé et ignoré.

deprecated-attribute-to-child = [deprecation] L'attribut `{ $attribute }` sus `<{ $component }>` est dêmodé; emplyiz un enfant `<{ $child }>` à la pliaiche.

deprecated-attribute-value-renamed = [deprecation] La valeu `{ $value }` dé l'attribut `{ $attribute }` sus `<{ $component }>` est dêmodée; emplyiz `{ $to }` à la pliaiche.


## Language coverage

pluralize-english-only = `<pluralize>` n'peut mettre au pluriel qué l'Angliais, don san texte reste coumme i' est dans un document êcrit en { $locale }. Êcrivez la forme du pluriel vous-même, ou donnez-la auve l'attribut `pluralForm`.


## Checking against the schema

schema-element-unrecognized = L'êlément `<{ $tag }>` n'est pon un êlément Doenet connu.

schema-element-not-allowed-at-root = L'êlément `<{ $tag }>` n'est pon permîns à la rachinne du document.

schema-element-not-allowed-inside = L'êlément `<{ $tag }>` n'est pon permîns à l'întérieu d'un `<{ $parent }>`.

schema-attribute-unrecognized = L'êlément `<{ $tag }>` n'a pon d'attribut app'lé `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] L'attribut `{ $attribute }` dé l'êlément `<{ $tag }>` dait êt' eune liste où'est qué chaque êlément est yun d'chennechîn: { $allowed }
       *[other] L'attribut `{ $attribute }` dé l'êlément `<{ $tag }>` dait êt' yun d'chennechîn: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Nom d'variante pon valabl'ye pour select. Lé nom d'variante { $variantName } s'trouve dans { $numOptions } options mais lé nombre à chouaisi est { $numToSelect }.

select-variant-name-without-options = Des variantes sont données pour select mais nulle option n'est donnée pour lé nom d'variante possibl'ye: { $variantName }.

select-variant-name-not-possible = Lé nom d'variante { $variantName } donné pour select n'est pon un nom d'variante possibl'ye.

select-too-few-options = On n'peut pon chouaisi { $numToSelect } composants hormis dé ryen qu'{ $numOptions }.

select-from-sequence-too-few-values = On n'peut pon chouaisi { $numToSelect } valeurs dans eune séquence dé longueu { $length }.

select-from-sequence-indices-count-mismatch = Lé nombre d'index donnés pour select dait correspondre au nombre à chouaisi

select-from-sequence-indices-not-integers = Touos les index donnés pour select daivent êt' des entiers

select-from-sequence-index-excluded = Un index donné dé selectfromsequence 'tait exclus

select-from-sequence-indices-excluded-combination = Les index donnés dé selectfromsequence 'taient eune combinaîson excluse

select-from-sequence-coprime-not-positive-integers = On n'peut pon chouaisi des combinaîsons dé nombres preunmiers entre ieux pa'ce qu'on n'chouaisit pon des entiers positifs.

select-from-sequence-coprime-common-factor = On n'peut pon chouaisi des nombres preunmiers entre ieux. Toutes les valeurs possibl'yes ont un facteu coummun. (Les valeurs données dé "from" ou "to" daivent êt' preunmiéthes entre ieux auve "step".)

select-from-sequence-coprime-single-number = On n'peut pon chouaisi des combinaîsons dé nombres preunmiers entre ieux hormis d'un seul nombre tchi n'est pon 1.

select-from-sequence-excluded-too-many-combinations = Pus dé 70% des combinaîsons sont excluses dans selectFromSequence

select-from-sequence-coprime-none-found = On n'a pon peu chouaisi des nombres preunmiers entre ieux. Toutes les valeurs possibl'yes ont un facteu coummun.

select-from-sequence-too-few-unique-values = On n'peut pon chouaisi { $numToSelect } valeurs uniques dans eune séquence dé longueu { $numPossibleValues }

select-prime-numbers-too-few-values = On n'peut pon chouaisi { $numToSelect } valeurs dans eune liste dé nombres preunmiers dé longueu { $numValues }

select-prime-numbers-values-count-mismatch = Lé nombre dé valeurs données pour select dait correspondre au nombre à chouaisi

select-prime-numbers-values-not-prime = Toutes les valeurs données pour la chouaix dé nombres preunmiers daivent êt' dans la liste des nombres preunmiers

select-prime-numbers-values-excluded-combination = Les valeurs données dé selectPrimeNumbers 'taient eune combinaîson excluse

select-prime-numbers-excluded-too-many-combinations = Pus dé 70% des combinaîsons sont excluses dans selectPrimeNumbers

select-random-combination-fluke = Par un hasard extrêmement pon probabl'ye, nulle combinaîson dé valeurs au hasard n'a peu êt' chouaisie

select-random-value-fluke = Par un hasard extrêmement pon probabl'ye, nulle valeu au hasard n'a peu êt' chouaisie

## Inputs embedded in math

math-embedded-input-shape-unsuitable =
    { $reason ->
        [not-inline] Ch't' `<{ $component }>` n'est pon montré pa'ce qu'i' est à l'întérieu des mathémâtiques et n'est pon `inline`. Ajoutez `inline` pour qu'i' d'veinge eune liste dêroulante, tchi tcheint dans eune expression.
        [expanded] Ch't' `<{ $component }>` n'est pon montré pa'ce qu'i' est à l'întérieu des mathémâtiques et est `expanded`. Ôtez `expanded`; eune boête dé pus d'eune ligne n'tcheint pon dans eune expression.
        [on-graph] Ch't' `<{ $component }>` n'est pon montré pa'ce qu'i' est à l'întérieu des mathémâtiques dessinées sus un graphique, où'est qu'i' n'y'a pon d'pliaiche pour un chant d'entrée.
       *[relative-width] Ch't' `<{ $component }>` n'est pon montré pa'ce qu'i' est à l'întérieu des mathémâtiques et a eune larg'geur relative. Donnez la larg'geur en unités absolues, coumme `px`, à la pliaiche.
    }
