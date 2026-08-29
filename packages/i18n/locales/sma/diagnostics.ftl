# Southern Sami diagnostics, Latin script. Translated from
# `locales/en/diagnostics.ftl`, which is the source of truth: `lint:i18n`
# rejects a key that does not exist there, and reports a key that exists there
# but not here as missing coverage.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Attribute names, element names and every other DoenetML identifier —
# `through`, `endpoint`, `midpointOffset`, `numDimensions`, `<answer>`,
# `selectFromSequence` — are part of the language, not prose, and stay in
# English exactly as written. So does anything quoted back from the author's
# own source.
#
# Southern Sami is written without `á`, `č`, `đ`, `ŋ`, `š`, `ŧ` and `ž`, and
# with `ï`, `ä`, `ö` and `å`, which Northern Sami does not use. A Northern
# Sami letter anywhere below is a bug, not a variant.
#
# Southern Sami counts in three categories, `one`, `two` and `other`, and a
# message here writes them out only where they differ. Where English separates
# a singular from a plural in the verb alone — "is ignored" against "are
# ignored" — Southern Sami marks number on the verb too, so `one` and
# `*[other]` are kept; the dual is not written out beside them, because the
# verb's dual is not what a list of two attribute names selects.
#
# Two choices run through the whole file and should be checked once rather
# than message by message. "Invalid" is «faamoehts», built with the privative
# `-hts` on «faamoe», force — the word a Southern Sami speaker would use of a
# rule that does not hold. "Ignored" is «ij nuhtjesovvh» / «eah nuhtjesovvh»,
# literally "is not used", because Southern Sami has no short idiom for the
# Northern «ii váldojuvvo vuhtii»; the verb carries the number, which is why
# these messages fork on `one` at all.
#
# Where English says something is "too" small or "too" close, this seed says
# it is not big enough, or is nearer than is allowed. Southern Sami has no
# comfortable one-word «too» for these, and the negated comparison is the
# ordinary way to say it.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] { $attributes } ij nuhtjesovvh gosse göökte geatjetjuvtjieh vadteme
       *[other] { $attributes } eah nuhtjesovvh gosse göökte geatjetjuvtjieh vadteme
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } ij nuhtjesovvh gosse dovne geatjetjuvtjie jïh gaskoetjuvtjie vadteme
       *[other] { $attributes } eah nuhtjesovvh gosse dovne geatjetjuvtjie jïh gaskoetjuvtjie vadteme
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset ij barkh gaskoetjuvtjien namhtah

## `<line>`

line-points-undetermined-dimensions = Linje tjuvtjiej tjïrrh gusnie dimensjovnh eah leah nænnoestamme.

line-points-too-few-dimensions = Linje tjuara tjuvtjiej tjïrrh vaedtsedh gusnie unnemes göökte dimensjovnh.

line-points-depend-on-variables = Linje tjuvtjiej tjïrrh vaadtsa mah variaabelijstie { $variables } jearohks.

line-equation-invalid-format = Faamoehts hammoe linjen eekvasjovnese variaabeligujmie { $variable1 } jïh { $variable2 }.

## `<ray>`

ray-overprescribed-through = Bielielinje lea through, endpoint jïh direction tjïrrh nænnoestamme. Vadteme through ij nuhtjesovvh.

ray-dimension-mismatch = numDimensions ij sjïehth ray:se.

## `<vector>`

vector-overprescribed-head = Vektore lea head, tail jïh displacement tjïrrh nænnoestamme. Vadteme head ij nuhtjesovvh.

vector-dimension-mismatch = numDimensions ij sjïehth vector:se.

## Attracting and constraining

attract-to-without-nearest-point = Ij maehtieh daase geasedh `<{ $component }>` juktie dïsse ij leah nearestPoint-staatevariaabele.

constrain-to-without-nearest-point = Ij maehtieh daase raastadidh `<{ $component }>` juktie dïsse ij leah nearestPoint-staatevariaabele.

constrain-to-interior-without-nearest-point = Ij maehtieh daan sisnjelen raastadidh `<{ $component }>` juktie dïsse ij leah nearestPoint-staatevariaabele.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition ij nuhtjesovvh choiceInput:sne mij ij leah inline

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput:se vadteme indeekseh eah nuhtjesovvh juktie indeeksi låhkoe ij sjïehth choice-maanaj låhkose.

pretzel-indices-count-mismatch = problem:se vadteme indeekseh eah nuhtjesovvh juktie indeeksi låhkoe ij sjïehth problem-maanaj låhkose.

shuffle-indices-count-mismatch = shuffle:se vadteme indeekseh eah nuhtjesovvh juktie indeeksi låhkoe ij sjïehth komponenti låhkose.

indices-ignored-out-of-range = { $component } vadteme indeekseh eah nuhtjesovvh juktie muvhth indeekseh raasten ålkolen.

pretzel-indices-repeated = pretzel:se vadteme indeekseh eah nuhtjesovvh juktie muvhth indeekseh gealadamme.

pretzel-circuit-first-index = pretzel:se vadteme indeekseh mode="circuit":sne eah nuhtjesovvh juktie voestes indeekse tjuara 1 årrodh.

## `<shuffle>` and `<sort>`

string-children-need-type = Vai `<{ $component }>` teekstemaanajgujmie barka, tjuara attribuvte `type` vadtasovvedh.

invalid-type-defaulting-to-math = Faamoehts type { $type } komponentesne { $component }. Tjuara math, text, number jallh boolean årrodh. Bïejesåvva math:ine.

string-not-valid-component-to-arrange = Teekste "{ $value }" ij leah faamosne komponente daase { $component }. Ij nuhtjesovvh.

## Types and variables

invalid-type-defaulting-to-number = Faamoehts type { $type }, type bïejesåvva number:ine.

invalid-variable-value = Faamoehts variaabelen aarvoe: `{ $value }`

## Variants

variant-index-must-be-number = Variantien indeekse { $index } tjuara låhkoe årrodh

variant-index-must-be-integer = Variantien indeekse { $index } tjuara ellieslåhkoe årrodh

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` ij leah absolutte mieride tjïrrehtamme. Vijriesvoeth relatijvine bïejesuvvieh.

side-by-side-absolute-margins = `<{ $component }>` ij leah absolutte mieride tjïrrehtamme. Marginh relatijvine bïejesuvvieh.

side-by-side-no-block-child = Faamoehts `<{ $component }>`: dïsse tjuara unnemes akte blovhkemaana årrodh.

## `<label>`

label-for-ignored-on-graphical = Attribuvte `for` grafiske `<label>`:sne ij nuhtjesovvh.

label-for-must-resolve-to-one = Attribuvte `for` `<label>`:sne tjuara aktem aajne komponentem vuesiehtidh.

label-for-unresolved = Attribuvte `for` `<label>`:sne idtji maehtieh komponentem vuesiehtidh.

label-for-answer-with-authored-inputs = Attribuvte `for` `<label>`:sne `<answer>`:m vuesehte gusnie jïjtse tjaaleme sïjsebuektemh; vuesehth sïjsebuektiemasse ryöktesth dan sæjjan.

label-for-answer-without-input = Attribuvte `for` `<label>`:sne `<answer>`:m vuesehte gusnie ij naan sïjsebuekteme mij nommem åådtje.

label-for-must-reference-input-or-answer = Attribuvte `for` `<label>`:sne tjuara sïjsebuektiemasse jallh answer:se vuesiehtidh.

## Accessibility

accessibility-short-description-or-decorative = Jaksemevoeten gaavhtan tjuara `<{ $component }>` gaertjies buerkiestimmiem utnedh jallh hearvine mïerhkesjamme årrodh.

accessibility-video-short-description = Jaksemevoeten gaavhtan tjuara `<video>`:sne gaertjies buerkiestimmie årrodh.

accessibility-input-short-description-or-label = Jaksemevoeten gaavhtan tjuara `<{ $component }>`:sne gaertjies buerkiestimmie jallh nomme årrodh.

accessibility-answer-input-short-description-or-label = Jaksemevoeten gaavhtan tjuara `<answer>`:sne mij sïjsebuektiemem darjoe gaertjies buerkiestimmie jallh nomme årrodh.

accessibility-short-description-contains-math = Gaertjies buerkiestimmine eah edtjh matematihkeles komponenth årrodh goh `<{ $component }>`. Tjaelieh matematihkem baakoejgujmie.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } kontraaste ij leah nuekies kapihtelen bijjietjaalegen teekstese (jemhkeles moduse) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; unnemes { $threshold }:1 kreavesåvva).
       *[other] { $colorName } kontraaste ij leah nuekies kapihtelen bijjietjaalegen teekstese ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; unnemes { $threshold }:1 kreavesåvva).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` { $count } tjuvtjien tjïrrh ij leah tjïrrehtamme gosse tjuvtjiej ij leah nommereles aarvoeh.

circle-too-many-through-points = Ij maehtieh sirkelem vielie goh 3 tjuvtjiej tjïrrh ryöknedh.

circle-overprescribed-radius-center-points = Ij maehtieh sirkelem vadteme radiusine, gaskoetjuvtjine jïh tjuvtjiejgujmie ryöknedh.

circle-center-with-multiple-points = Ij maehtieh sirkelem vadteme gaskoetjuvtjine vielie goh 1 tjuvtjien tjïrrh ryöknedh.

circle-radius-too-small = Ij maehtieh sirkelem ryöknedh: gosse gaskoe göökte tjuvtjiej gaskem lea { $distance }, dellie vadteme radius { $radius } ij leah nuekies stoerre.

circle-radius-with-many-points = Ij maehtieh sirkelem vielie goh göökte tjuvtjiej tjïrrh vadteme radiusine darjodh.

circle-invalid-center-or-through-points = Faamoehts gaskoetjuvtjie jallh faamoehts tjuvtjieh sirkelisnie.

circle-radius-center-with-multiple-points = Ij maehtieh sirkelen radiusem vadteme gaskoetjuvtjine vielie goh 1 tjuvtjien tjïrrh ryöknedh.

circle-change-radius-non-numerical = Ij maehtieh sirkelen radiusem jarkelidh gosse tjuvtjieh eah leah nommereles

circle-radius-with-points-non-numerical = Ij maehtieh sirkelem vielie goh akten tjuvtjien tjïrrh vadteme radiusine darjodh gosse aarvoeh eah leah nommereles.

circle-change-center-non-numerical = Sirkelen gaskoetjuvtjien jarkelimmie tjuvtjiej tjïrrh gusnie eah leah nommereles aarvoeh ij leah tjïrrehtamme.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Ij leah nuekies dimensjovnh funksjovnen definisjovnedajvese. Definisjovnedajvesne { $intervals } gaskoe, men funksjovnesne { $inputs ->
            [one] { $inputs } sïjsebuekteme
           *[other] { $inputs } sïjsebuektemh
        }.
       *[other] Ij leah nuekies dimensjovnh funksjovnen definisjovnedajvese. Definisjovnedajvesne { $intervals } gaskh, men funksjovnesne { $inputs ->
            [one] { $inputs } sïjsebuekteme
           *[other] { $inputs } sïjsebuektemh
        }.
    }

function-domain-invalid-format = Faamoehts hammoe funksjovnen definisjovnedajvesne.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Funksjovnen ij-nommereles maksimume ij nuhtjesovvh.
        [minimum] Funksjovnen ij-nommereles minimume ij nuhtjesovvh.
        [extremum] Funksjovnen ij-nommereles ekstremume ij nuhtjesovvh.
        [point] Funksjovnen ij-nommereles tjuvtjie ij nuhtjesovvh.
        [slope] Funksjovnen ij-nommereles luejtie ij nuhtjesovvh.
       *[other] Funksjovnen ij-nommereles { $type } ij nuhtjesovvh.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Funksjovnen gåaroes maksimume ij nuhtjesovvh.
        [minimum] Funksjovnen gåaroes minimume ij nuhtjesovvh.
        [extremum] Funksjovnen gåaroes ekstremume ij nuhtjesovvh.
        [point] Funksjovnen gåaroes tjuvtjie ij nuhtjesovvh.
       *[other] Funksjovnen gåaroes { $type } ij nuhtjesovvh.
    }

function-points-too-close = Funksjovnesne göökte tjuvtjieh mah leah vielie lïhke goh luhpie. Funksjovnem ij maehtieh nænnoestidh.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Funksjovnen iterasjovnh ajve dellie gååvnesieh gosse sïjsebuektemi låhkoe seamma goh olkesbuektemi låhkoe. Daan funksjovnesne { $inputs } sïjsebuekteme jïh { $outputs ->
            [one] { $outputs } olkesbuekteme
           *[other] { $outputs } olkesbuektemh
        }.
       *[other] Funksjovnen iterasjovnh ajve dellie gååvnesieh gosse sïjsebuektemi låhkoe seamma goh olkesbuektemi låhkoe. Daan funksjovnesne { $inputs } sïjsebuektemh jïh { $outputs ->
            [one] { $outputs } olkesbuekteme
           *[other] { $outputs } olkesbuektemh
        }.
    }

## Vector and slope fields

field-function-wrong-num-outputs =
    `<{ $component }>` tjuara funksjovnem utnedh mesnie { $expected ->
        [one] akte olkesbuekteme, luejtie y' fïerhten tjuvtjien luvnie, goh `y - x`
       *[other] göökte olkesbuektemh, vektore fïerhten tjuvtjien luvnie, goh `(y, -x)`
    }, men vadteme funksjovnesne { $found ->
        [one] { $found } olkesbuekteme
       *[other] { $found } olkesbuektemh
    }. { $alternative ->
        [none] Ij mij guvviedamme.
       *[other] `<{ $alternative }>` lea komponente dan funksjovnese. Ij mij guvviedamme.
    }

field-function-attribute-ignored-with-child = Attribuvte `function` ij nuhtjesovvh juktie funksjovne aaj komponenten sisnie vadteme; dïhte sisnie nuhtjesåvva. Vedtieh funksjovnem ajve akten vuekien mietie.

field-variables-ignored =
    `<{ $component }>`: attribuvte `variables` dan tjïelkestimmien variaabelh nommede mij ryöktesth komponenten sisnie tjaaleme. { $reason ->
        [function-child] Funksjovne daesnie `<function>`-maanine vadteme, mij jïjtse variaabelidie nommede, dan åvteste `variables` ij nuhtjesovvh.
       *[no-expression] Ij naan dagkeres tjïelkestimmie daesnie vadteme, dan åvteste `variables` ij nuhtjesovvh.
    }

## `<sequence>`

sequence-invalid-length = Faamoehts guhkiesvoete raajrose. Tjuara ij-negatijve ellieslåhkoe årrodh.

sequence-invalid-step = Faamoehts lahke raajrosne. Tjuara låhkoe årrodh raajrose mesnie såarhte { $type }.

sequence-invalid-endpoint-number = Faamoehts "{ $attribute }" låhkoeraajrosne. Tjuara låhkoe årrodh.

sequence-invalid-endpoint-letters = Faamoehts "{ $attribute }" bokstaaveraajrosne. Tjuara bokstaavi kombinasjovne årrodh.

sequence-invalid-endpoint = Faamoehts "{ $attribute }" raajrosne.

select-from-sequence-coprime-not-numbers = coprime ij nuhtjesovvh juktie låhkoeh eah veeljesovvh

select-from-sequence-coprime-with-exclude-combinations = coprime ij nuhtjesovvh juktie excludeCombinations vadteme

## Resolving a `target`

target-not-found = Faamoehts target daase `<{ $source }>`: ulmie ij gaavneme.

target-state-variable-not-found = Faamoehts target daase `<{ $source }>`: ij gaavneme staatevariaabele nommine "{ $property }" daan nualan: `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` variaabelh tjuerieh jeatjah årrodh goh jearohkes variaabele.

ode-system-duplicate-variable-names = Ij maehtieh ODE:n åelkies bealan funksjovnh nænnoestidh gosse jearohks variaabeli nommh gealadamme.

ode-system-rhs-function-error = Ij maehtieh ODE:n åelkies bealan funksjovnem nænnoestidh. Båajhtoehtimmie mathjs-funksjovnen darjomisnie.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Ij maehtieh vinhkelem { $count } linjej gaskem nænnoestidh

angle-invalid-through-point = Faamoehts tjuvtjie `<angle>` through:sne

parabola-vertex-too-many-points = Parabole tjåejjine vielie goh 1 tjuvtjien tjïrrh ij leah tjïrrehtamme.

parabola-too-many-points = Parabole vielie goh 3 tjuvtjiej tjïrrh ij leah tjïrrehtamme.

intersection-too-many-items = Vielie goh göökte gærjaj tjåekiedimmie ij leah tjïrrehtamme

## Other math components

ionic-compound-not-two-ions = Iovneles vïedteldimmie ij leah tjïrrehtamme jeatjah goh göökte iovnide.

ionic-compound-needs-cation-and-anion = Iovneles vïedteldimmie lea ajve aktese katiovnese jïh aktese aniovnese tjïrrehtamme.

solve-equations-cannot-evaluate = Ij maehtieh eekvasjovnem loesedh juktie dam idtji maehtieh ryöknedh: { $equation }

math-operators-operand-number-required = Tjuara operandNumber vedtedh gosse matematihkeles operandem vaaltah.

eigen-decomposition-failed = Idtji maehtieh matriesen jïjtsearvoeh ryöknedh

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: parameetere { $parameters } ij leah maallesne, dan åvteste dïhte iktesth gåaroesasse sjïehteles.
       *[other] `<matchesPattern>`: parameeterh { $parameters } eah leah maallesne, dan åvteste dah iktesth gåaroesasse sjïehteles.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: ij maehtieh grid="{ $grid }" toelhkestidh. Tjuara none, medium, dense jallh göökte positijve låhkoeh gaskine juakeme årrodh, vuesiehtimmien gaavhtan grid="1 0.5". Ruvtie ij guvviedamme.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" ij leah prefigure-vuesiehtæjjesne dåarjoehtamme; åelkies bealan læjhkoe nuhtjesåvva.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" ij leah prefigure-vuesiehtæjjesne dåarjoehtamme; bijjie bealan læjhkoe nuhtjesåvva.

prefigure-invalid-axis-bounds = `<graph>`: faamoehts akselen raasth prefigure-jarkoestæmman; standarde bbox (-10,-10,10,10) nuhtjesåvva.

prefigure-invalid-width = `<graph>`: faamoehts vijriesvoete prefigure-jarkoestæmman; standarde vijriesvoete 425 nuhtjesåvva.

prefigure-invalid-aspect-ratio = `<graph>`: faamoehts aspectRatio prefigure-jarkoestæmman; standarde gaskevuete 1 nuhtjesåvva.

prefigure-grid-spacing-too-fine = `<graph>`: ruvtien gaskh leah vielie onne goh akselen raasth luhpiedieh; ruvtie prefigure-vuesiehtæjjesne luajhtasåvva.

prefigure-annotations-not-rendered = `<graph>`: mïerhkesjimmieh eah vuesiehtamme gosse PreFigure-vuesiehtæjja ij nuhtjesovvh.

multiple-annotations-children = Gellie `<annotations>`-maanah `<graph>`:sne gaavneme; gaajhkh jeatjah goh minngemes eah nuhtjesovvh.

## Referring to other components

copy-unrecognized-component-type = Ij maehtieh ovnohkens komponentesåarhtem { $type } vijriedidh jallh kopijeeredh.

copy-prop-not-found = Ij gaavneme jïjtsevoete { $property } komponentesne mesnie såarhte { $component }

collect-no-source = Ij gaavneme gaaltije daase collect.

collect-invalid-component-type = Ij maehtieh komponenth såarhteste `<{ $component }>` tjöönghkedh juktie dïhte faamoehts komponentesåarhte.

reference-index-unavailable = Ij maehtieh indeeksese `{ $reference }` vuesiehtidh

## `<callAction>`

component-action-unavailable = Ij maehtieh { $action } komponentesne `{ $reference }` gohtjedh

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Daatajgujmie lea faamoehts hammoe. Raajesi guhkiesvoeth eah leah seammalaakan. Gaavneme daesnie: componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Daatajgujmie leah gealadamme kolovnenommh. Gaavneme daesnie: componentIdx :{ $componentIdx }

data-frame-missing-column-name = Daatajgujmie kolovnenomme gaatoes. Gaavneme daesnie: componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Akte award daan vaestiedassese answer-tsagken jïjtse seedtesovveme vaestiedassese tjåadtjoe, mij ov-vuartasjamme læjhkoem darjoe.

answer-max-num-attempts-in-section-wide-check-work = `maxNumAttempts` `<answer>`:se bïejedh mij `sectionWideCheckWork`-kaarhten sisnie ij barkh, juktie kaarhte pryövenassi låhkoem stuvrie. Bïejh `maxNumAttempts` kaarhtese.

nested-section-wide-check-work-max-num-attempts = `maxNumAttempts` kaarhtese bïejedh mesnie `sectionWideCheckWork` jïh mij mubpien `sectionWideCheckWork`-kaarhten sisnie ij barkh, juktie ålkoemes kaarhte pryövenassi låhkoem stuvrie. Bïejh `maxNumAttempts` ålkoemes kaarhtese.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] Attribuvte { $attributes } ij barkh jis symbolicEquality ij leah bïejesovveme.
       *[other] Attribuvth { $attributes } eah barkh jis symbolicEquality ij leah bïejesovveme.
    }

answer-invalid-type = Faamoehts såarhte vaestiedassese: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Gosse komponentesne `<{ $component }>` ij leah nomme, dellie dam ij maehtieh moduvlen attribuvtine nuhtjedh

module-attribute-name-already-defined = Komponentem `<{ $component } name="{ $name }">` ij maehtieh moduvlen attribuvtine nuhtjedh juktie komponentesåarhtesne `<module>` joe attribuvte "{ $name }" gååvnese.

conditional-content-condition-ignored = Attribuvte `condition` ij nuhtjesovvh `<conditionalContent>`:sne mesnie case- jallh else-maanah.

slider-markers-type-mismatch = Mïerhki såarhte ij sjïehth slider:n såarhtese.

pretzel-problem-needs-statement-and-answer = Faamoehts pretzel: fïerhten `<problem>`:sne tjuara akte `<statement>` jïh akte `<answer>` årrodh.

pretzel-circuit-first-problem-distractor = Faamoehts pretzel: mode="circuit":sne ij maehtieh voestes `<problem>` sïejhmehtæjja årrodh.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Faamoehts aarvoe { $values } attribuvtese `{ $attribute }`; ij nuhtjesovvh.
       *[other] Faamoehts aarvoeh { $values } attribuvtese `{ $attribute }`; eah nuhtjesovvh.
    }

attribute-must-be-references = Faamoehts aarvoe `{ $value }` attribuvtese `{ $attribute }`. Attribuvte tjuara vuesiehtimmijste tjöönghkesovveme årrodh mah mïerhkine `$` aelkieh.

math-input-invalid-function-names = <mathInput>: faamoehts funksjovnenommh daesnie { $attribute } eah nuhtjesovveme: { $names }. Fïerhten nommen vuesiehtimmiebielie tjuara unnemes 2 mïerhkh (bokstaavh jallh strekh) utnedh; dan mænngan maahta eaktoedihks `|<mathspeak alternatijve>` båetedh.

## Building components from the source

component-type-invalid = Faamoehts komponentesåarhte: `<{ $componentType }>`

attribute-repeated = Ij maehtieh attribuvtem { $attribute } gealadidh.

attribute-invalid-for-component = Faamoehts attribuvte "{ $attribute }" komponentese mesnie såarhte `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Stïjlebuerkiestimmesne { $styleNumber } ij leah nuekies kontraaste daase { $context ->
        [text-on-background] teeksteklaerien duekieklaerien vööste
        [high-contrast] jollehkontraasten klaerien duekien vööste
        [line] linjeklaerien duekien vööste
        [marker] mïerhkeklaerien duekien vööste
       *[text-on-canvas] teeksteklaerien duekien vööste
    }{ $mode ->
        [dark] { " (jemhkeles moduse)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; unnemes { $threshold }:1 kreavesåvva).

style-definition-dark-mode-text-background-contrast =
    Jalhts stïjlebuerkiestimmesne { $styleNumber } klaerieh mah nuekies kontraastem tjoevkes modusese utnieh, dellie jemhkeles modusen klaerine mah dejstie ryöknesuvvieh ij leah nuekies kontraaste teeksteklaerien duekieklaerien vööste ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; unnemes { $threshold }:1 kreavesåvva). { $suggestion ->
        [available] Vai kontraaste nuekies jemhkeles modusisnie, lissieh tjoevkes modusen kontraastem (vuesiehtimmien gaavhtan bïejh { $lightAttribute }="{ $lightColor }") jallh bijjelen jemhkeles modusen klaeriem vaedtsieh (vuesiehtimmien gaavhtan bïejh { $darkAttribute }="{ $darkColor }").
       *[none] Vai kontraaste nuekies jemhkeles modusisnie, lissieh tjoevkes modusen kontraastem jallh bijjelen ryöknesovveme klaerieh vaedtsieh textColorDarkMode jïh/jallh backgroundColorDarkMode tjïrrh.
    }

style-definition-dark-mode-text-canvas-contrast =
    Jalhts stïjlebuerkiestimmesne { $styleNumber } teeksteklaerie mij nuekies kontraastem tjoevkes modusese utnie, dellie jemhkeles modusen teeksteklaerine mij dehtie ryöknesåvva ij leah nuekies kontraaste duekien vööste ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; unnemes { $threshold }:1 kreavesåvva). { $suggestion ->
        [available] Vai kontraaste nuekies jemhkeles modusisnie, lissieh tjoevkes modusen kontraastem (vuesiehtimmien gaavhtan bïejh textColor="{ $lightColor }") jallh bijjelen jemhkeles modusen klaeriem vaedtsieh (vuesiehtimmien gaavhtan bïejh textColorDarkMode="{ $darkColor }").
       *[none] Vai kontraaste nuekies jemhkeles modusisnie, lissieh tjoevkes modusen kontraastem jallh bijjelen ryöknesovveme klaeriem vaedtsieh textColorDarkMode tjïrrh.
    }

section-multiple-style-palettes = Kapihtele ajve aktem <stylePalette> maahta veeljedh; minngemes nuhtjesåvva.

## Unique variants

variant-num-to-select-not-non-negative-integer = ij maehtieh { $component } sjïere variaanth nænnoestidh juktie numToSelect ij leah ij-negatijve ellieslåhkoe.

variant-num-to-select-not-constant-number = ij maehtieh { $component } sjïere variaanth nænnoestidh juktie numToSelect ij leah tjåadtjoes låhkoe.

variant-with-replacement-not-constant-boolean = ij maehtieh { $component } sjïere variaanth nænnoestidh juktie withReplacement ij leah tjåadtjoes boolean.

variant-select-weight-disables-unique = select:n sjïere variaanth eah barkh jis naan alternatijvesne selectWeight jallh selectForVariants vadteme

variant-coprime-undetermined = ij maehtieh { $component } sjïere variaanth nænnoestidh juktie ij maehtieh nænnoestidh coprime iktesth båajhtoehke.

variant-attribute-not-constant = ij maehtieh { $component } sjïere variaanth nænnoestidh juktie { $attribute } ij leah tjåadtjoes.

variant-attribute-not-number = ij maehtieh { $component } sjïere variaanth nænnoestidh juktie { $attribute } ij leah låhkoe.

variant-attribute-wrong-type-for-sequence =
    ij maehtieh { $component } sjïere variaanth nænnoestidh mesnie såarhte { $type } juktie { $attribute } ij leah { $expected ->
        [letters-combination] bokstaavi kombinasjovne
        [math-expression] faamosne matematihkeles tjïelkestimmie
        [integer] ellieslåhkoe
       *[number] låhkoe
    }.

variant-length-not-integer = ij maehtieh { $component } sjïere variaanth nænnoestidh juktie length ij leah ellieslåhkoe.

variant-sort-not-implemented = { $component } sjïere variaanth sort:ine eah leah tjïrrehtamme

variant-exclude-combinations-not-implemented = { $component } sjïere variaanth excludeCombinations:ine eah leah tjïrrehtamme

variant-math-exclude-not-implemented = { $component } sjïere variaanth såarhtesne math exclude:ine eah leah tjïrrehtamme

variant-non-constant-exclude-not-implemented = { $component } sjïere variaanth ij-tjåadtjoes exclude:ine eah leah tjïrrehtamme

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: ij leah dåarjoehtamme graafe prefigure-vuesiehtæjjesne; maadtoe bijjelen vaadtsasåvva.

prefigure-descendant-invalid-geometry = { $subject }: geometrije ij leah ellies jallh ij leah raastadamme; maadtoe bijjelen vaadtsasåvva.

prefigure-curve-label-omitted = { $subject }: nommh eah leah dåarjoehtamme jarkoestamme kurveelemeentine; nomme luajhtasåvva.

prefigure-curve-unsupported-definition-type = { $subject }: dåarjoehts kurvefunksjovnen buerkiestimmiesåarhte '{ $definitionType }'; maadtoe bijjelen vaadtsasåvva.

prefigure-region-flip-functions-unsupported = { $subject }: dåarjoehts attribuvte flipFunctions regionBetweenCurves:sne; maadtoe bijjelen vaadtsasåvva.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves:sne ajve maanafunksjovnh dåarjoehtamme mah formeline vadteme; maadtoe bijjelen vaadtsasåvva.

prefigure-label-position-unsupported =
    { $subject }: dåarjoehts labelPosition '{ $labelPosition }' daase { $labelKind ->
        [line-family] linjefaamien nomme
       *[point] tjuvtjien nomme
    }; standarde PreFigure-aalkoesijjie nuhtjesåvva.

prefigure-fill-style-unsupported = { $subject }: deavhtemestïjle '{ $fillStyle }' ij leah PreFigure:sne dåarjoehtamme; ellies deavhteme nuhtjesåvva.

prefigure-line-style-unknown = { $subject }: ovnohkens linjestïjle '{ $lineStyle }' luajhtasovvi PreFigure-darjomisnie.

prefigure-marker-style-mapped-to-diamond = { $subject }: mïerhkestïjle '{ $markerStyle }' PreFigure-stïjlese 'diamond' juhtiesovvi.

prefigure-marker-style-unsupported = { $subject }: mïerhkestïjle '{ $markerStyle }' ij leah PreFigure:sne dåarjoehtamme; standardestïjle nuhtjesåvva.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: faamoehts `ref`; ulmiem ij maehtieh gaavnedh. Mïerhkesjimmie luajhtasåvva.

annotation-ref-multiple-targets = `<annotation>`: `ref` gellie ulmide vuesiehti; voestes nuhtjesåvva.

annotation-ref-outside-graph = `<annotation>`: faamoehts `ref`; ulmie lea graafen ålkolen gusnie dïhte. Mïerhkesjimmie luajhtasåvva.

annotation-ref-unsupported-target = `<annotation>`: faamoehts `ref`; ulmie ij leah dåarjoehtamme grafiske objeekte prefigure-jarkoestimmesne. Mïerhkesjimmie luajhtasåvva.

annotation-text-missing = `<annotation>`: `text` gaatoes jallh gåaroes; gåaroes teekste darjosåvva.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Jorpes jearohksvoete gaavneme.
       *[other] Jorpes jearohksvoete gaavneme gusnie `<{ $componentType }>`-komponente meatan.
    }

reference-no-referent = Vuesiehtimmien ulmie ij gaavneme: `{ $reference }`

reference-multiple-referents = Gellie vuesiehtimmien ulmieh gaavneme: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Faamoehts hammoe attribuvtese { $attribute } daan nualan: `<{ $componentType }>`.

children-invalid = Faamoehts maanah daase `<{ $componentType }>`: faamoehts maanah gaavneme: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Faamoehts aarvoe `{ $value }` attribuvtese `{ $attribute }`, aarvoe `{ $default }` nuhtjesåvva

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML versjovne { $version } ij gaavneme.
       *[other] DoenetML versjovne { $version } ij gaavneme. Versjovne { $fallback } nuhtjesåvva
    }

## Reading the DoenetML

parse-invalid-doenetml = Faamoehts DoenetML: { $content }

parse-tag-missing-close-tag = Faamoehts DoenetML: tsagkesne `{ $tag }` ij leah gaptjemetsagke. Vuarteme jïjtse gaptjeje tsagke jallh `</{ $tagName }>`-tsagke.

parse-tag-error = Faamoehts DoenetML: båajhtoehtimmie tsagkesne `<{ $tagName }>`

parse-attribute-missing-value = Faamoehts DoenetML: faamoehts attribuvtesne `{ $attribute }` vååjnoe aarvoe gaatoes.

parse-attribute-invalid = Faamoehts DoenetML: faamoehts attribuvte `{ $attribute }`

parse-attribute-value-invalid = Faamoehts DoenetML: faamoehts attribuvten aarvoe `{ $value }`

parse-attribute-value-quote-mismatch = Faamoehts DoenetML: faamoehts attribuvten aarvoe `{ $value }`. Sitaatemïerhkh eah sjïehth. Vååjnoe `{ $quote }` gaatoes

parse-open-tag-name-missing = Faamoehts DoenetML: tsagke gaavneme mesnie ij leah nomme, vuesiehtimmien gaavhtan `<`

parse-tag-not-closed = Faamoehts DoenetML: tsagke `{ $tag }` ij gaptjesovveme (vååjnoe `>` gaatoes).

parse-self-closing-tag-name-missing = Faamoehts DoenetML: tsagke gaavneme mesnie ij leah nomme `<{ $content }>`

parse-self-closing-tag-not-closed = Faamoehts DoenetML: tsagke `{ $tag }` ij gaptjesovveme (vååjnoe `/>` gaatoes).

parse-tag-invalid-attributes = Faamoehts DoenetML: tsagke `{ $tag }` ij leah faamosne. Dïsse maehtieh faamoehts attribuvth årrodh.

parse-close-tag-name-missing = Faamoehts DoenetML: gaptjemetsagke gaavneme mesnie ij leah nomme, vuesiehtimmien gaavhtan `</`

parse-attribute-value-unquoted = Attribuvten aarvoeh tjuerieh sitaatemïerhki sisnie årrodh: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Faamoehts DoenetML: gaptjemetsagke `{ $tag }` gaavneme, men ij gaavneme sjïehteles rïhpestimmietsagke

parse-close-tag-mismatched = Faamoehts DoenetML: gaptjemetsagke ij sjïehth. Vuarteme `</{ $expected }>`. Gaavneme `{ $found }`

parser-node-unconvertible = Idtji maehtieh tjuvtjiem { $node } Dast-tjuvtjine jarkoestidh.

## Names

name-attribute-invalid =
    Faamoehts attribuvte name='{ $name }'. { $reason ->
        [characters] Nommine maehtieh ajve bokstaavh, nommerh, vueleliestrekh jallh strekh årrodh.
       *[start] Nommh tjuerieh bokstaavine aelkedh.
    }

component-name-invalid-start = Faamoehts komponentenomme "{ $name }". Nommh tjuerieh bokstaavine aelkedh.

## `<answer>` sugar

answer-video-watched-missing-video = Answer mesnie såarhte videoWatched tjuara attribuvtem video utnedh

answer-video-watched-video-not-reference = Answer mesnie såarhte videoWatched tjuara attribuvtem video utnedh mij vuesiehtimmie

answer-name-not-single-text = Answer:n attribuvtesne name tjuara akte teekstemaana årrodh

## Referencing another document

external-doenetml-recursion-limit = Ij maehtieh ålkoelijstie DoenetML:m veedtjedh juktie leah nov gellie rekursijve daltesh. Lea daate jorpes vuesiehtimmie?

external-doenetml-unavailable = Ij maehtieh DoenetML:m veedtjedh daesnie { $attribute }="{ $uri }"

external-doenetml-type-mismatch = Faamoehts DoenetML veedtjeme daesnie { $attribute }="{ $uri }": dïhte idtji sjïehth komponentesåarhtese "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Attribuvte `{ $from }` lea båarasovveme; nuhtjieh `{ $to }` dan sæjjan.
       *[other] [deprecation] Attribuvte `{ $from }` daan nualan `<{ $component }>` lea båarasovveme; nuhtjieh `{ $to }` dan sæjjan.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Attribuvte `{ $from }` lea båarasovveme jïh ij nuhtjesovvh juktie aaj `{ $to }` vadteme.
       *[other] [deprecation] Attribuvte `{ $from }` daan nualan `<{ $component }>` lea båarasovveme jïh ij nuhtjesovvh juktie aaj `{ $to }` vadteme.
    }

deprecated-attribute-ignored = [deprecation] Attribuvte `{ $attribute }` daan nualan `<{ $component }>` lea båarasovveme jïh ij nuhtjesovvh.

deprecated-attribute-to-child = [deprecation] Attribuvte `{ $attribute }` daan nualan `<{ $component }>` lea båarasovveme; nuhtjieh `<{ $child }>`-maanam dan sæjjan.

deprecated-attribute-value-renamed = [deprecation] Aarvoe `{ $value }` attribuvtesne `{ $attribute }` daan nualan `<{ $component }>` lea båarasovveme; nuhtjieh `{ $to }` dan sæjjan.


## Language coverage

pluralize-english-only = `<pluralize>` ajve engelsken gïelesne maahta gellielåhkoem darjodh, dan åvteste dan teekste jarkelimmien namhtah baasa dokumeentesne mij daan gïelesne tjaaleme: { $locale }. Tjaelieh gellielåhkoen hammoem ryöktesth, jallh vedtieh dam attribuvtine `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Elemeente `<{ $tag }>` ij leah nohkens Doenet-elemeente.

schema-element-not-allowed-at-root = Elemeente `<{ $tag }>` ij leah luhpiedihks dokumeenten maadtosne.

schema-element-not-allowed-inside = Elemeente `<{ $tag }>` ij leah luhpiedihks daan sisnie: `<{ $parent }>`.

schema-attribute-unrecognized = Elemeentesne `<{ $tag }>` ij leah attribuvte nommine `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Attribuvte `{ $attribute }` elemeentesne `<{ $tag }>` tjuara læstoe årrodh gusnie fïerhte lïhtsege akte daejstie: { $allowed }
       *[other] Attribuvte `{ $attribute }` elemeentesne `<{ $tag }>` tjuara akte daejstie årrodh: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Faamoehts variantenomme daase select. Variantenomme { $variantName } lea { $numOptions } alternatijvesne, men veeljemelåhkoe lea { $numToSelect }.

select-variant-name-without-options = Muvhth varianth daase select vadteme, men alternatijvh eah leah vejtiedihks variantenommese vadteme: { $variantName }.

select-variant-name-not-possible = Variantenomme { $variantName } mij daase select vadteme ij leah vejtiedihks variantenomme.

select-too-few-options = Ij maehtieh { $numToSelect } komponentem ajve { $numOptions } gaskeste veeljedh.

select-from-sequence-too-few-values = Ij maehtieh { $numToSelect } aarvoem raajrosne veeljedh mesnie guhkiesvoete { $length }.

select-from-sequence-indices-count-mismatch = Indeeksi låhkoe mij daase select vadteme tjuara veeljemelåhkose sjïehtedh

select-from-sequence-indices-not-integers = Gaajhkh indeekseh mah daase select vadteme tjuerieh ellieslåhkoeh årrodh

select-from-sequence-index-excluded = Vadteme selectfromsequence-indeekse lij ålkoestimmie

select-from-sequence-indices-excluded-combination = Vadteme selectfromsequence-indeekseh lin ålkoestimmiekombinasjovne

select-from-sequence-coprime-not-positive-integers = Ij maehtieh ektiefaktovrehts kombinasjovnh veeljedh juktie positijve ellieslåhkoeh eah veeljesovvh.

select-from-sequence-coprime-common-factor = Ij maehtieh ektiefaktovrehts låhkoeh veeljedh. Gaajhkine vejtiedihks aarvojne lea ektie faktovre. ("from" jallh "to" vadteme aarvoeh tjuerieh ektiefaktovrehts "step" vööste årrodh.)

select-from-sequence-coprime-single-number = Ij maehtieh ektiefaktovrehts kombinasjovnh akten låhkoen sisnie veeljedh mij ij leah 1.

select-from-sequence-excluded-too-many-combinations = Vielie goh 70% kombinasjovnijstie ålkoestamme selectFromSequence:sne

select-from-sequence-coprime-none-found = Idtji maehtieh ektiefaktovrehts låhkoeh veeljedh. Gaajhkine vejtiedihks aarvojne lea ektie faktovre.

select-from-sequence-too-few-unique-values = Ij maehtieh { $numToSelect } sjïere aarvoem raajrosne veeljedh mesnie guhkiesvoete { $numPossibleValues }

select-prime-numbers-too-few-values = Ij maehtieh { $numToSelect } aarvoem primelåhkoelæstosne veeljedh mesnie guhkiesvoete { $numValues }

select-prime-numbers-values-count-mismatch = Aarvoej låhkoe mij daase select vadteme tjuara veeljemelåhkose sjïehtedh

select-prime-numbers-values-not-prime = Gaajhkh aarvoeh mah primelåhkoen veeljiemasse vadteme tjuerieh primelåhkoelæstosne årrodh

select-prime-numbers-values-excluded-combination = Vadteme selectPrimeNumbers-aarvoeh lin ålkoestimmiekombinasjovne

select-prime-numbers-excluded-too-many-combinations = Vielie goh 70% kombinasjovnijstie ålkoestamme selectPrimeNumbers:sne

select-random-combination-fluke = Joekoen ov-jaehkies dahkoen gaavhtan idtji maehtieh luhpiedihks aarvoej kombinasjovnem veeljedh

select-random-value-fluke = Joekoen ov-jaehkies dahkoen gaavhtan idtji maehtieh luhpiedihks aarvoem veeljedh
