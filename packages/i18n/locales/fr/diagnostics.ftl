# French diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
# the source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Attribute names, element names and every other DoenetML identifier — `through`,
# `endpoint`, `midpointOffset`, `numDimensions`, `<answer>`, `selectFromSequence`
# — are part of the language, not prose, and stay in English exactly as written.
# So does anything quoted back from the author's own source.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] { $attributes } est ignoré lorsque deux extrémités sont spécifiées
       *[other] { $attributes } sont ignorés lorsque deux extrémités sont spécifiées
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } est ignoré lorsqu’une extrémité et un milieu sont tous deux spécifiés
       *[other] { $attributes } sont ignorés lorsqu’une extrémité et un milieu sont tous deux spécifiés
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset n’a aucun effet sans un milieu

## `<line>`

line-points-undetermined-dimensions = Droite passant par des points de dimensions indéterminées.

line-points-too-few-dimensions = Une droite doit passer par des points d’au moins deux dimensions.

line-points-depend-on-variables = La droite passe par des points qui dépendent de variables : { $variables }.

line-equation-invalid-format = Format invalide pour l’équation d’une droite en les variables { $variable1 } et { $variable2 }.

## `<ray>`

ray-overprescribed-through = La demi-droite est déterminée par through, endpoint et direction. Le through spécifié est ignoré.

ray-dimension-mismatch = Incohérence de numDimensions dans la demi-droite.

## `<vector>`

vector-overprescribed-head = Le vecteur est déterminé par head, tail et displacement. Le head spécifié est ignoré.

vector-dimension-mismatch = Incohérence de numDimensions dans le vecteur.

## Attracting and constraining

attract-to-without-nearest-point = Impossible d’attirer vers un `<{ $component }>`, car il n’a pas de variable d’état nearestPoint.

constrain-to-without-nearest-point = Impossible de contraindre à un `<{ $component }>`, car il n’a pas de variable d’état nearestPoint.

constrain-to-interior-without-nearest-point = Impossible de contraindre à l’intérieur d’un `<{ $component }>`, car il n’a pas de variable d’état nearestPoint.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition est ignoré pour un choiceInput non incorporé

## Ordering children by index

choice-input-indices-count-mismatch = Les indices spécifiés pour choiceInput sont ignorés, car leur nombre ne correspond pas au nombre d’enfants choice.

pretzel-indices-count-mismatch = Les indices spécifiés pour problem sont ignorés, car leur nombre ne correspond pas au nombre d’enfants problem.

shuffle-indices-count-mismatch = Les indices spécifiés pour shuffle sont ignorés, car leur nombre ne correspond pas au nombre de composants.

indices-ignored-out-of-range = Les indices spécifiés pour { $component } sont ignorés, car certains sont hors limites.

pretzel-indices-repeated = Les indices spécifiés pour pretzel sont ignorés, car certains sont répétés.

pretzel-circuit-first-index = Les indices spécifiés pour pretzel en mode circuit sont ignorés, car le premier indice doit être 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Pour que `<{ $component }>` fonctionne avec des enfants de type chaîne, un attribut `type` doit être spécifié.

invalid-type-defaulting-to-math = Type { $type } invalide pour le composant { $component }. Il doit valoir math, text, number ou boolean. math est utilisé par défaut.

string-not-valid-component-to-arrange = La chaîne « { $value } » n’est pas un composant valide pour { $component }. Elle est ignorée.

## Types and variables

invalid-type-defaulting-to-number = Type { $type } invalide ; le type est fixé à number.

invalid-variable-value = Valeur de variable invalide : `{ $value }`

## Variants

variant-index-must-be-number = L’indice de variante { $index } doit être un nombre

variant-index-must-be-integer = L’indice de variante { $index } doit être un entier

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` n’est pas implémenté pour des mesures absolues. Les largeurs deviennent relatives.

side-by-side-absolute-margins = `<{ $component }>` n’est pas implémenté pour des mesures absolues. Les marges deviennent relatives.

side-by-side-no-block-child = `<{ $component }>` invalide : il doit avoir au moins un enfant de type bloc.

## `<label>`

label-for-ignored-on-graphical = L’attribut `for` sur un `<label>` graphique est ignoré.

label-for-must-resolve-to-one = L’attribut `for` de `<label>` doit se résoudre en exactement un composant.

label-for-unresolved = L’attribut `for` de `<label>` n’a pas pu être résolu en un composant.

label-for-answer-with-authored-inputs = L’attribut `for` de `<label>` référence un `<answer>` dont les entrées sont écrites explicitement ; référencez directement l’entrée.

label-for-answer-without-input = L’attribut `for` de `<label>` référence un `<answer>` sans entrée à étiqueter.

label-for-must-reference-input-or-answer = L’attribut `for` de `<label>` doit référencer une entrée ou une réponse.

## Accessibility

accessibility-short-description-or-decorative = Pour l’accessibilité, `<{ $component }>` doit avoir une description courte ou être déclaré décoratif.

accessibility-video-short-description = Pour l’accessibilité, `<video>` doit avoir une description courte.

accessibility-input-short-description-or-label = Pour l’accessibilité, `<{ $component }>` doit avoir une description courte ou une étiquette.

accessibility-answer-input-short-description-or-label = Pour l’accessibilité, un `<answer>` qui crée une entrée doit avoir une description courte ou une étiquette.

accessibility-short-description-contains-math = Une description courte ne devrait pas contenir de composants mathématiques comme `<{ $component }>`. Écrivez les mathématiques en toutes lettres.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } n’a pas un contraste suffisant pour le texte du titre de section (mode sombre) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1 ; il faut au moins { $threshold }:1).
       *[other] { $colorName } n’a pas un contraste suffisant pour le texte du titre de section ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1 ; il faut au moins { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` passant par { $count } points n’est pas implémenté lorsque les points n’ont pas de valeurs numériques.

circle-too-many-through-points = Impossible de calculer un cercle passant par plus de 3 points.

circle-overprescribed-radius-center-points = Impossible de calculer un cercle avec un rayon, un centre et des points spécifiés.

circle-center-with-multiple-points = Impossible de calculer un cercle de centre spécifié passant par plus d’un point.

circle-radius-too-small = Impossible de calculer le cercle : la distance entre les deux points étant { $distance }, le rayon spécifié { $radius } est trop petit.

circle-radius-with-many-points = Impossible de créer un cercle passant par plus de deux points avec un rayon spécifié.

circle-invalid-center-or-through-points = Centre ou points de passage du cercle invalides.

circle-radius-center-with-multiple-points = Impossible de calculer le rayon d’un cercle de centre spécifié passant par plus d’un point.

circle-change-radius-non-numerical = Impossible de changer le rayon d’un cercle dont les points de passage ne sont pas numériques

circle-radius-with-points-non-numerical = Impossible de créer un cercle passant par plus d’un point avec un rayon spécifié lorsque les valeurs ne sont pas numériques.

circle-change-center-non-numerical = Le changement de centre d’un cercle passant par des points non numériques n’est pas implémenté.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Dimensions insuffisantes pour le domaine de la fonction. Le domaine a { $intervals } intervalle mais la fonction a { $inputs ->
            [one] { $inputs } entrée
           *[other] { $inputs } entrées
        }.
       *[other] Dimensions insuffisantes pour le domaine de la fonction. Le domaine a { $intervals } intervalles mais la fonction a { $inputs ->
            [one] { $inputs } entrée
           *[other] { $inputs } entrées
        }.
    }

function-domain-invalid-format = Format invalide pour le domaine de la fonction.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Le maximum non numérique de la fonction est ignoré.
        [minimum] Le minimum non numérique de la fonction est ignoré.
        [extremum] L’extremum non numérique de la fonction est ignoré.
        [point] Le point non numérique de la fonction est ignoré.
        [slope] La pente non numérique de la fonction est ignorée.
       *[other] { $type } non numérique de la fonction est ignoré.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Le maximum vide de la fonction est ignoré.
        [minimum] Le minimum vide de la fonction est ignoré.
        [extremum] L’extremum vide de la fonction est ignoré.
        [point] Le point vide de la fonction est ignoré.
       *[other] { $type } vide de la fonction est ignoré.
    }

function-points-too-close = La fonction contient deux points trop proches l’un de l’autre. Impossible de définir la fonction.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Les itérées d’une fonction ne sont possibles que si le nombre d’entrées est égal au nombre de sorties. Cette fonction a { $inputs } entrée et { $outputs ->
            [one] { $outputs } sortie
           *[other] { $outputs } sorties
        }.
       *[other] Les itérées d’une fonction ne sont possibles que si le nombre d’entrées est égal au nombre de sorties. Cette fonction a { $inputs } entrées et { $outputs ->
            [one] { $outputs } sortie
           *[other] { $outputs } sorties
        }.
    }

## `<sequence>`

sequence-invalid-length = Longueur de suite invalide. Ce doit être un entier positif ou nul.

sequence-invalid-step = Pas de suite invalide. Ce doit être un nombre pour une suite de type { $type }.

sequence-invalid-endpoint-number = « { $attribute } » invalide pour une suite de nombres. Ce doit être un nombre.

sequence-invalid-endpoint-letters = « { $attribute } » invalide pour une suite de lettres. Ce doit être une combinaison de lettres.

sequence-invalid-endpoint = « { $attribute } » invalide pour la suite.

select-from-sequence-coprime-not-numbers = coprime est ignoré, car la sélection ne porte pas sur des nombres

select-from-sequence-coprime-with-exclude-combinations = coprime est ignoré, car excludeCombinations est spécifié

## Resolving a `target`

target-not-found = target invalide pour `<{ $source }>` : cible introuvable.

target-state-variable-not-found = target invalide pour `<{ $source }>` : aucune variable d’état nommée « { $property } » sur un `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = Les variables d’un `<odeSystem>` doivent différer de la variable indépendante.

ode-system-duplicate-variable-names = Impossible de définir les seconds membres de l’EDO avec des noms de variables dépendantes en double.

ode-system-rhs-function-error = Impossible de définir le second membre de l’EDO. Erreur lors de la création de la fonction mathjs.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Impossible de définir un angle entre { $count } droites

angle-invalid-through-point = Point invalide dans le through d’un `<angle>`

parabola-vertex-too-many-points = Une parabole de sommet donné passant par plus d’un point n’est pas implémentée.

parabola-too-many-points = Une parabole passant par plus de 3 points n’est pas implémentée.

intersection-too-many-items = L’intersection de plus de deux objets n’est pas implémentée

## Other math components

ionic-compound-not-two-ions = Les composés ioniques autres qu’à deux ions ne sont pas implémentés.

ionic-compound-needs-cation-and-anion = Les composés ioniques ne sont implémentés que pour un cation et un anion.

solve-equations-cannot-evaluate = Impossible de résoudre l’équation, car elle n’a pas pu être évaluée : { $equation }

math-operators-operand-number-required = Un operandNumber doit être spécifié pour extraire un opérande mathématique.

eigen-decomposition-failed = Impossible de calculer les valeurs propres de la matrice

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>` : le paramètre { $parameters } n’apparaît pas dans le motif ; il correspondra donc toujours à un blanc.
       *[other] `<matchesPattern>` : les paramètres { $parameters } n’apparaissent pas dans le motif ; ils correspondront donc toujours à un blanc.
    }

## `<graph>`

graph-grid-invalid = `<graph>` : impossible d’interpréter grid="{ $grid }". La valeur doit être none, medium, dense, ou deux nombres positifs séparés par une espace, comme grid="1 0.5". Aucune grille n’est tracée.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>` : xLabelPosition="left" n’est pas pris en charge par le rendu prefigure ; le comportement de la position droite est utilisé.

prefigure-y-label-position-unsupported = `<graph>` : yLabelPosition="bottom" n’est pas pris en charge par le rendu prefigure ; le comportement de la position haute est utilisé.

prefigure-invalid-axis-bounds = `<graph>` : bornes d’axes invalides pour la conversion prefigure ; la bbox par défaut (-10,-10,10,10) est utilisée.

prefigure-invalid-width = `<graph>` : largeur invalide pour la conversion prefigure ; la largeur de diagramme par défaut 425 est utilisée.

prefigure-invalid-aspect-ratio = `<graph>` : aspectRatio invalide pour la conversion prefigure ; le rapport d’aspect par défaut 1 est utilisé.

prefigure-grid-spacing-too-fine = `<graph>` : le pas de la grille est trop fin pour les bornes des axes ; la grille est omise dans le rendu prefigure.

prefigure-annotations-not-rendered = `<graph>` : les annotations ne sont pas rendues en dehors du rendu PreFigure.

multiple-annotations-children = Plusieurs enfants `<annotations>` trouvés dans `<graph>` ; tous sauf le dernier sont ignorés.

## Referring to other components

copy-unrecognized-component-type = Impossible d’étendre ou de copier un type de composant non reconnu : { $type }.

copy-prop-not-found = Propriété { $property } introuvable sur un composant de type { $component }

collect-no-source = Aucune source trouvée pour collect.

collect-invalid-component-type = Impossible de collecter des composants de type `<{ $component }>`, car ce type est invalide.

reference-index-unavailable = Impossible de référencer l’indice `{ $reference }`

## `<callAction>`

component-action-unavailable = Impossible d’appeler { $action } sur le composant `{ $reference }`

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Les données ont une forme invalide. Les lignes ont des longueurs incohérentes. Trouvé dans componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Les données ont des noms de colonnes en double. Trouvé dans componentIdx :{ $componentIdx }

data-frame-missing-column-name = Il manque un nom de colonne aux données. Trouvé dans componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Un award de cette réponse s’appuie sur la réponse soumise du tag answer lui-même, ce qui provoquera un comportement inattendu.

answer-max-num-attempts-in-section-wide-check-work = Définir `maxNumAttempts` sur un `<answer>` situé dans un conteneur avec `sectionWideCheckWork` n’a aucun effet : le nombre de tentatives est contrôlé par le conteneur. Définissez `maxNumAttempts` sur le conteneur.

nested-section-wide-check-work-max-num-attempts = Définir `maxNumAttempts` sur un conteneur avec `sectionWideCheckWork` lui-même situé dans un autre conteneur avec `sectionWideCheckWork` n’a aucun effet : le nombre de tentatives est contrôlé par le conteneur extérieur. Définissez `maxNumAttempts` sur le conteneur extérieur.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] L’attribut { $attributes } n’aura aucun effet sans symbolicEquality.
       *[other] Les attributs { $attributes } n’auront aucun effet sans symbolicEquality.
    }

answer-invalid-type = Type invalide pour answer : { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Le composant `<{ $component }>` n’ayant pas de nom, il ne peut pas servir d’attribut de module

module-attribute-name-already-defined = Le composant `<{ $component } name="{ $name }">` ne peut pas servir d’attribut de module, car le type de composant `<module>` définit déjà un attribut « { $name } ».

conditional-content-condition-ignored = L’attribut `condition` est ignoré sur un composant `<conditionalContent>` ayant des enfants case ou else.

slider-markers-type-mismatch = Le type des marqueurs ne correspond pas au type du curseur.

pretzel-problem-needs-statement-and-answer = pretzel invalide : chaque `<problem>` doit contenir un `<statement>` et un `<answer>`.

pretzel-circuit-first-problem-distractor = pretzel invalide : en mode="circuit", le premier `<problem>` ne peut pas être un distracteur.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Valeur { $values } invalide pour l’attribut `{ $attribute }` ; elle est ignorée.
       *[other] Valeurs { $values } invalides pour l’attribut `{ $attribute }` ; elles sont ignorées.
    }

attribute-must-be-references = Valeur `{ $value }` invalide pour l’attribut `{ $attribute }`. L’attribut doit être composé de références commençant par `$`.

math-input-invalid-function-names = <mathInput> : nom(s) de fonction invalide(s) ignoré(s) dans { $attribute } : { $names }. Le segment affiché de chaque nom doit compter au moins 2 caractères (lettres ou tirets) ; un suffixe facultatif `|<alternative mathspeak>` peut suivre.

## Building components from the source

component-type-invalid = Type de composant invalide : `<{ $componentType }>`

attribute-repeated = L’attribut { $attribute } ne peut pas être répété.

attribute-invalid-for-component = Attribut « { $attribute } » invalide pour un composant de type `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    La définition de style { $styleNumber } n’a pas un contraste suffisant pour { $context ->
        [text-on-background] la couleur du texte sur la couleur de fond
        [high-contrast] la couleur à contraste élevé sur le canevas
        [line] la couleur des traits sur le canevas
        [marker] la couleur des marqueurs sur le canevas
       *[text-on-canvas] la couleur du texte sur le canevas
    }{ $mode ->
        [dark] { " (mode sombre)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1 ; il faut au moins { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Bien que la définition de style { $styleNumber } spécifie des couleurs dont le contraste est suffisant en mode clair, les couleurs de mode sombre qui en sont dérivées n’offrent pas un contraste suffisant entre le texte et le fond ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1 ; il faut au moins { $threshold }:1). { $suggestion ->
        [available] Pour garantir un contraste suffisant en mode sombre, augmentez le contraste du mode clair (par exemple { $lightAttribute }="{ $lightColor }") ou remplacez la couleur du mode sombre (par exemple { $darkAttribute }="{ $darkColor }").
       *[none] Pour garantir un contraste suffisant en mode sombre, augmentez le contraste du mode clair ou remplacez les couleurs dérivées avec textColorDarkMode et/ou backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Bien que la définition de style { $styleNumber } spécifie une couleur de texte dont le contraste est suffisant en mode clair, la couleur de texte de mode sombre qui en est dérivée n’offre pas un contraste suffisant sur le canevas ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1 ; il faut au moins { $threshold }:1). { $suggestion ->
        [available] Pour garantir un contraste suffisant en mode sombre, augmentez le contraste du mode clair (par exemple textColor="{ $lightColor }") ou remplacez la couleur du mode sombre (par exemple textColorDarkMode="{ $darkColor }").
       *[none] Pour garantir un contraste suffisant en mode sombre, augmentez le contraste du mode clair ou remplacez la couleur dérivée avec textColorDarkMode.
    }

section-multiple-style-palettes = Une section ne peut sélectionner qu’un seul <stylePalette> ; le dernier est utilisé.

## Unique variants

variant-num-to-select-not-non-negative-integer = impossible de déterminer les variantes uniques de { $component }, car numToSelect n’est pas un entier positif ou nul.

variant-num-to-select-not-constant-number = impossible de déterminer les variantes uniques de { $component }, car numToSelect n’est pas un nombre constant.

variant-with-replacement-not-constant-boolean = impossible de déterminer les variantes uniques de { $component }, car withReplacement n’est pas un booléen constant.

variant-select-weight-disables-unique = Les variantes uniques de select sont désactivées lorsqu’une option spécifie selectWeight ou selectForVariants

variant-coprime-undetermined = impossible de déterminer les variantes uniques de { $component }, car on ne peut pas établir que coprime est toujours faux.

variant-attribute-not-constant = impossible de déterminer les variantes uniques de { $component }, car { $attribute } n’est pas une constante.

variant-attribute-not-number = impossible de déterminer les variantes uniques de { $component }, car { $attribute } n’est pas un nombre.

variant-attribute-wrong-type-for-sequence =
    impossible de déterminer les variantes uniques de { $component } de type { $type }, car { $attribute } n’est pas { $expected ->
        [letters-combination] une combinaison de lettres
        [math-expression] une expression mathématique valide
        [integer] un entier
       *[number] un nombre
    }.

variant-length-not-integer = impossible de déterminer les variantes uniques de { $component }, car length n’est pas un entier.

variant-sort-not-implemented = les variantes uniques d’un { $component } avec sort ne sont pas implémentées

variant-exclude-combinations-not-implemented = les variantes uniques d’un { $component } avec excludeCombinations ne sont pas implémentées

variant-math-exclude-not-implemented = les variantes uniques d’un { $component } de type math avec exclude ne sont pas implémentées

variant-non-constant-exclude-not-implemented = les variantes uniques d’un { $component } avec un exclude non constant ne sont pas implémentées

## PreFigure conversion

prefigure-descendant-unsupported = { $subject } : non pris en charge par le rendu prefigure du graphique ; le descendant est ignoré.

prefigure-descendant-invalid-geometry = { $subject } : géométrie non finie ou incomplète ; le descendant est ignoré.

prefigure-curve-label-omitted = { $subject } : les étiquettes ne sont pas prises en charge sur les courbes converties ; l’étiquette est omise.

prefigure-curve-unsupported-definition-type = { $subject } : type de définition de fonction de courbe « { $definitionType } » non pris en charge ; le descendant est ignoré.

prefigure-region-flip-functions-unsupported = { $subject } : l’attribut flipFunctions de regionBetweenCurves n’est pas pris en charge ; le descendant est ignoré.

prefigure-region-non-formula-child = { $subject } : seules les fonctions enfants de type formule sont prises en charge sur regionBetweenCurves ; le descendant est ignoré.

prefigure-label-position-unsupported =
    { $subject } : labelPosition « { $labelPosition } » non pris en charge pour { $labelKind ->
        [line-family] une étiquette de la famille des droites
       *[point] une étiquette de point
    } ; l’alignement PreFigure par défaut est utilisé.

prefigure-fill-style-unsupported = { $subject } : le style de remplissage « { $fillStyle } » n’est pas pris en charge par PreFigure ; un remplissage uni est utilisé.

prefigure-line-style-unknown = { $subject } : style de trait « { $lineStyle } » inconnu, omis de la sortie PreFigure.

prefigure-marker-style-mapped-to-diamond = { $subject } : le style de marqueur « { $markerStyle } » est converti en style PreFigure « diamond ».

prefigure-marker-style-unsupported = { $subject } : le style de marqueur « { $markerStyle } » n’est pas pris en charge par PreFigure ; le style par défaut est utilisé.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>` : `ref` invalide ; cible non résolue. L’annotation est omise.

annotation-ref-multiple-targets = `<annotation>` : `ref` s’est résolu en plusieurs cibles ; la première est utilisée.

annotation-ref-outside-graph = `<annotation>` : `ref` invalide ; la cible est hors du graphique conteneur. L’annotation est omise.

annotation-ref-unsupported-target = `<annotation>` : `ref` invalide ; la cible n’est pas un objet graphique pris en charge par la conversion prefigure. L’annotation est omise.

annotation-text-missing = `<annotation>` : `text` absent ou vide ; un texte vide est émis.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Dépendance circulaire détectée.
       *[other] Dépendance circulaire détectée impliquant un composant `<{ $componentType }>`.
    }

reference-no-referent = Aucun référent trouvé pour la référence : `{ $reference }`

reference-multiple-referents = Plusieurs référents trouvés pour la référence : `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Format invalide pour l’attribut { $attribute } de `<{ $componentType }>`.

children-invalid = Enfants invalides pour `<{ $componentType }>` : enfants invalides trouvés : { $children }

## Falling back to a default

attribute-value-invalid-using-default = Valeur `{ $value }` invalide pour l’attribut `{ $attribute }` ; la valeur `{ $default }` est utilisée

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Version { $version } de DoenetML introuvable.
       *[other] Version { $version } de DoenetML introuvable. Repli sur la version { $fallback }
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML invalide : { $content }

parse-tag-missing-close-tag = DoenetML invalide : la balise `{ $tag }` n’a pas de balise fermante. Une balise auto-fermante ou une balise `</{ $tagName }>` était attendue.

parse-tag-error = DoenetML invalide : erreur dans la balise `<{ $tagName }>`

parse-attribute-missing-value = DoenetML invalide : il semble manquer une valeur à l’attribut `{ $attribute }`.

parse-attribute-invalid = DoenetML invalide : attribut `{ $attribute }` invalide

parse-attribute-value-invalid = DoenetML invalide : valeur d’attribut `{ $value }` invalide

parse-attribute-value-quote-mismatch = DoenetML invalide : valeur d’attribut `{ $value }` invalide. Les guillemets ne correspondent pas. Il semble manquer un `{ $quote }`

parse-open-tag-name-missing = DoenetML invalide : balise trouvée sans nom de balise, par exemple `<`

parse-tag-not-closed = DoenetML invalide : la balise `{ $tag }` n’a pas été fermée (il semble manquer un `>`).

parse-self-closing-tag-name-missing = DoenetML invalide : balise trouvée sans nom de balise `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML invalide : la balise `{ $tag }` n’a pas été fermée (il semble manquer `/>`).

parse-tag-invalid-attributes = DoenetML invalide : la balise `{ $tag }` n’est pas valide. Ses attributs sont peut-être incorrects.

parse-close-tag-name-missing = DoenetML invalide : balise fermante trouvée sans nom de balise, par exemple `</`

parse-attribute-value-unquoted = Les valeurs d’attribut doivent être entre guillemets : `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML invalide : balise fermante `{ $tag }` trouvée, mais aucune balise ouvrante correspondante

parse-close-tag-mismatched = DoenetML invalide : balise fermante incohérente. `</{ $expected }>` était attendu. `{ $found }` a été trouvé

parser-node-unconvertible = Impossible de convertir le nœud { $node } en nœud Dast.

## Names

name-attribute-invalid =
    Attribut name='{ $name }' invalide. { $reason ->
        [characters] Un nom ne peut contenir que des lettres, des chiffres, des tirets bas ou des traits d’union.
       *[start] Un nom doit commencer par une lettre.
    }

component-name-invalid-start = Nom de composant « { $name } » invalide. Un nom doit commencer par une lettre.

## `<answer>` sugar

answer-video-watched-missing-video = Un answer de type videoWatched doit avoir un attribut video

answer-video-watched-video-not-reference = Un answer de type videoWatched doit avoir un attribut video qui est une référence

answer-name-not-single-text = L’attribut name d’un answer doit avoir un unique enfant de type texte

## Referencing another document

external-doenetml-recursion-limit = Impossible de récupérer le DoenetML externe : trop de niveaux de récursion. Y a-t-il une référence circulaire ?

external-doenetml-unavailable = Impossible de récupérer le DoenetML depuis { $attribute }="{ $uri }"

external-doenetml-type-mismatch = DoenetML invalide récupéré depuis { $attribute }="{ $uri }" : il ne correspond pas au type de composant « { $componentType } »

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] L’attribut `{ $from }` est obsolète ; utilisez `{ $to }`.
       *[other] [deprecation] L’attribut `{ $from }` de `<{ $component }>` est obsolète ; utilisez `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] L’attribut `{ $from }` est obsolète et ignoré, car `{ $to }` est également spécifié.
       *[other] [deprecation] L’attribut `{ $from }` de `<{ $component }>` est obsolète et ignoré, car `{ $to }` est également spécifié.
    }

deprecated-attribute-ignored = [deprecation] L’attribut `{ $attribute }` de `<{ $component }>` est obsolète et ignoré.


## Language coverage

pluralize-english-only = `<pluralize>` ne sait mettre au pluriel que l’anglais ; son texte est laissé tel quel dans un document écrit en { $locale }. Écrivez le pluriel directement, ou indiquez-le avec l’attribut `pluralForm`.


## Checking against the schema

schema-element-unrecognized = L’élément `<{ $tag }>` n’est pas un élément Doenet reconnu.

schema-element-not-allowed-at-root = L’élément `<{ $tag }>` n’est pas autorisé à la racine du document.

schema-element-not-allowed-inside = L’élément `<{ $tag }>` n’est pas autorisé dans `<{ $parent }>`.

schema-attribute-unrecognized = L’élément `<{ $tag }>` n’a pas d’attribut nommé `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] L’attribut `{ $attribute }` de l’élément `<{ $tag }>` doit être une liste dont chaque élément vaut l’un de : { $allowed }
       *[other] L’attribut `{ $attribute }` de l’élément `<{ $tag }>` doit valoir l’un de : { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Nom de variante invalide pour select. Le nom de variante { $variantName } apparaît dans { $numOptions } options, mais le nombre à sélectionner est { $numToSelect }.

select-variant-name-without-options = Des variantes sont spécifiées pour select, mais aucune option ne l’est pour le nom de variante possible : { $variantName }.

select-variant-name-not-possible = Le nom de variante { $variantName } spécifié pour select n’est pas un nom de variante possible.

select-too-few-options = Impossible de sélectionner { $numToSelect } composants parmi seulement { $numOptions }.

select-from-sequence-too-few-values = Impossible de sélectionner { $numToSelect } valeurs dans une suite de longueur { $length }.

select-from-sequence-indices-count-mismatch = Le nombre d’indices spécifiés pour select doit correspondre au nombre à sélectionner

select-from-sequence-indices-not-integers = Tous les indices spécifiés pour select doivent être des entiers

select-from-sequence-index-excluded = Un indice spécifié de selectfromsequence était exclu

select-from-sequence-indices-excluded-combination = Les indices spécifiés de selectfromsequence formaient une combinaison exclue

select-from-sequence-coprime-not-positive-integers = Impossible de sélectionner des combinaisons d’entiers premiers entre eux, car la sélection ne porte pas sur des entiers positifs.

select-from-sequence-coprime-common-factor = Impossible de sélectionner des nombres premiers entre eux. Toutes les valeurs possibles ont un facteur commun. (Les valeurs spécifiées de "from" ou "to" doivent être premières avec "step".)

select-from-sequence-coprime-single-number = Impossible de sélectionner des combinaisons de nombres premiers entre eux à partir d’un seul nombre différent de 1.

select-from-sequence-excluded-too-many-combinations = Plus de 70 % des combinaisons ont été exclues dans selectFromSequence

select-from-sequence-coprime-none-found = Impossible de sélectionner des nombres premiers entre eux. Toutes les valeurs possibles ont un facteur commun.

select-from-sequence-too-few-unique-values = Impossible de sélectionner { $numToSelect } valeurs distinctes dans une suite de longueur { $numPossibleValues }

select-prime-numbers-too-few-values = Impossible de sélectionner { $numToSelect } valeurs dans une liste de { $numValues } nombres premiers

select-prime-numbers-values-count-mismatch = Le nombre de valeurs spécifiées pour select doit correspondre au nombre à sélectionner

select-prime-numbers-values-not-prime = Toutes les valeurs spécifiées pour select prime number doivent figurer dans la liste des nombres premiers

select-prime-numbers-values-excluded-combination = Les valeurs spécifiées de selectPrimeNumbers formaient une combinaison exclue

select-prime-numbers-excluded-too-many-combinations = Plus de 70 % des combinaisons ont été exclues dans selectPrimeNumbers

select-random-combination-fluke = Par un hasard extrêmement improbable, aucune combinaison de valeurs aléatoires n’a pu être sélectionnée

select-random-value-fluke = Par un hasard extrêmement improbable, aucune valeur aléatoire n’a pu être sélectionnée
