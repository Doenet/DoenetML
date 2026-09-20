# Lule Sami diagnostics, Latin script. Translated from
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
# Lule Sami keeps `á` and `ŋ` but has no `č`, `š`, `ž`, `đ` or `ŧ`, writing
# `tj` and `sj` instead, and it uses `å`, which Northern Sami does not. A
# Northern Sami letter anywhere below is a bug, not a variant.
#
# Lule Sami counts in three categories, `one`, `two` and `other`, and a
# message here writes them out only where they differ. Where English separates
# a singular from a plural in the verb alone — "is ignored" against "are
# ignored" — Lule Sami marks number on the verb too, so `one` and `*[other]`
# are kept; the dual is not written out beside them, because the verb's dual
# is not what a list of two attribute names selects.
#
# Three messages here do print a count —
# `function-domain-insufficient-dimensions`,
# `function-iterates-input-output-mismatch` and
# `field-function-wrong-num-outputs` — and they keep English's two branches
# anyway, as `locales/se` does. A count of two therefore renders `*[other]`,
# whose noun is right after any numeral and whose verb wants the dual. That is
# a debt this seed leaves rather than a decision it made, and it is three
# branches of work for a speaker.
#
# Two choices run through the whole file and should be checked once rather
# than message by message. "Invalid" is «gusstuhis», and "ignored" is «ij
# adneduvá» / «e adneduvá», literally "is not used" — Lule Sami has no short
# equivalent of the Northern idiom «ii váldojuvvo vuhtii», and the passive
# here ends in `-duvvá` rather than Northern `-juvvo`. The verb carries the
# number, which is why these messages fork on `one` at all.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
        [one] { $attributes } ij adneduvá gå guokta gietjetjuoggá li vaddum
       *[other] { $attributes } e adneduvá gå guokta gietjetjuoggá li vaddum
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
        [one] { $attributes } ij adneduvá gå sihke gietjetjuoggá ja gaskatjuoggá li vaddum
       *[other] { $attributes } e adneduvá gå sihke gietjetjuoggá ja gaskatjuoggá li vaddum
    }

line-segment-midpoint-offset-without-midpoint = midpointOffset ij dåjma gaskatjuoggá dagá

## `<line>`

line-points-undetermined-dimensions = Linnjá tjuoggáj tjadá gånnå dimensjåvnå e la mierreduvvam.

line-points-too-few-dimensions = Linnjá hæhttu tjuoggáj tjadá mannat gånnå li unnemusát guokta dimensjåvnå.

line-points-depend-on-variables = Linnjá manná tjuoggáj tjadá ma li sorjavattja variábelijs: { $variables }.

line-equation-invalid-format = Gusstuhis hábme linnjá dásádussaj variábelij { $variable1 } ja { $variable2 }.

## `<ray>`

ray-overprescribed-through = Bielulinnjá la mierreduvvam through, endpoint ja direction baktu. Vaddum through ij adneduvá.

ray-dimension-mismatch = numDimensions ij hiebada ray:aj.

## `<vector>`

vector-overprescribed-head = Vektor la mierreduvvam head, tail ja displacement baktu. Vaddum head ij adneduvá.

vector-dimension-mismatch = numDimensions ij hiebada vector:aj.

## Attracting and constraining

attract-to-without-nearest-point = Ij máhte dási gæsodit `<{ $component }>` danen gå dan ij la nearestPoint-stáhtavariábel.

constrain-to-without-nearest-point = Ij máhte dási ráddjit `<{ $component }>` danen gå dan ij la nearestPoint-stáhtavariábel.

constrain-to-interior-without-nearest-point = Ij máhte dán sisŋeldis ráddjit `<{ $component }>` danen gå dan ij la nearestPoint-stáhtavariábel.

## `<choiceInput>`

choice-input-label-position-ignored = labelPosition ij adneduvá choiceInput:in mij ij la inline

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput:aj vaddum indeksa e adneduvá danen gå indeksaj låhko ij hiebada choice-mánáj låhkuj.

pretzel-indices-count-mismatch = problem:aj vaddum indeksa e adneduvá danen gå indeksaj låhko ij hiebada problem-mánáj låhkuj.

shuffle-indices-count-mismatch = shuffle:aj vaddum indeksa e adneduvá danen gå indeksaj låhko ij hiebada komponentaj låhkuj.

indices-ignored-out-of-range = { $component } vaddum indeksa e adneduvá danen gå muhtem indeksa li rájá ålggolin.

pretzel-indices-repeated = pretzel:aj vaddum indeksa e adneduvá danen gå muhtem indeksa li moatten vaddum.

pretzel-circuit-first-index = pretzel:aj vaddum indeksa mode="circuit":in e adneduvá danen gå vuostasj indeksa hæhttu 1 årrot.

## `<shuffle>` and `<sort>`

string-children-need-type = Vaj `<{ $component }>` tekstamánáj dåjmåj, hæhttu attribuhtta `type` vadduduvvat.

invalid-type-defaulting-to-math = Gusstuhis type { $type } komponentan { $component }. Hæhttu math, text, number jali boolean årrot. Bidjaduvvá math:n.

string-not-valid-component-to-arrange = Teksta "{ $value }" ij la gusstok komponenta dási { $component }. Ij adneduvá.

## Types and variables

invalid-type-defaulting-to-number = Gusstuhis type { $type }, type bidjaduvvá number:n.

invalid-variable-value = Gusstuhis variábela árvo: `{ $value }`

## Variants

variant-index-must-be-number = Variánta indeksa { $index } hæhttu låhko årrot

variant-index-must-be-integer = Variánta indeksa { $index } hæhttu ålles låhko årrot

## `<sideBySide>`

side-by-side-absolute-widths = `<{ $component }>` ij la tjadáduvvam absoluhtta mihtojda. Gåvdudagá bidjaduvvi relatijvalattjan.

side-by-side-absolute-margins = `<{ $component }>` ij la tjadáduvvam absoluhtta mihtojda. Rævdá bidjaduvvi relatijvalattjan.

side-by-side-no-block-child = Gusstuhis `<{ $component }>`: dan hæhttu unnemusát ihkap blåhkkamánná årrot.

## `<label>`

label-for-ignored-on-graphical = Attribuhtta `for` gráfalasj `<label>`:in ij adneduvá.

label-for-must-resolve-to-one = Attribuhtta `for` `<label>`:in hæhttu æksåhta ihtjaj komponentaj gehtjalit.

label-for-unresolved = Attribuhtta `for` `<label>`:in ittjij máhte komponentaj gehtjalit.

label-for-answer-with-authored-inputs = Attribuhtta `for` `<label>`:in gehtjal `<answer>`:aj gånnå li iesj tjállidum sisabiedjama; gehtjala baj sisabiedjamij njuolgga.

label-for-answer-without-input = Attribuhtta `for` `<label>`:in gehtjal `<answer>`:aj gånnå ij la sisabiedjam majt merkit.

label-for-must-reference-input-or-answer = Attribuhtta `for` `<label>`:in hæhttu sisabiedjamij jali answer:aj gehtjalit.

## Accessibility

accessibility-short-description-or-decorative = Juksamvuoda diehti hæhttu `<{ $component }>` oanep tjielggidusáv adnet jali herva merkiduvvam årrot.

accessibility-video-short-description = Juksamvuoda diehti hæhttu `<video>`:in oanep tjielggidus årrot.

accessibility-input-short-description-or-label = Juksamvuoda diehti hæhttu `<{ $component }>`:in oanep tjielggidus jali namádus årrot.

accessibility-answer-input-short-description-or-label = Juksamvuoda diehti hæhttu `<answer>`:in mij sisabiedjamav dahká oanep tjielggidus jali namádus årrot.

accessibility-short-description-contains-math = Oanep tjielggidusájn e galga matematihkalasj komponenta årrot degu `<{ $component }>`. Tjále matematihkav bágojgujm.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } kontrássta ij la nuoges kapihttala bajetjállaga tekstaj (sjævnnjis modus) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; gájbeduvvá unnemusát { $threshold }:1).
       *[other] { $colorName } kontrássta ij la nuoges kapihttala bajetjállaga tekstaj ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; gájbeduvvá unnemusát { $threshold }:1).
    }

## `<circle>`

circle-through-points-non-numerical = `<circle>` { $count } tjuoggá tjadá ij la tjadáduvvam dan situasjåvnån gå tjuoggáj e la numeralasj árvo.

circle-too-many-through-points = Ij máhte sirkkelav ienep gå 3 tjuoggá tjadá rehkenasstet.

circle-overprescribed-radius-center-points = Ij máhte sirkkelav vaddum radiusajn, guovdátjin ja tjuoggáj rehkenasstet.

circle-center-with-multiple-points = Ij máhte sirkkelav vaddum guovdátjin ienep gå 1 tjuoggá tjadá rehkenasstet.

circle-radius-too-small = Ij máhte sirkkelav rehkenasstet: gå gasska guovte tjuoggá gaskan la { $distance }, de vaddum radius { $radius } la ilá unne.

circle-radius-with-many-points = Ij máhte sirkkelav ienep gå guovte tjuoggá tjadá vaddum radiusajn dahkat.

circle-invalid-center-or-through-points = Gusstuhis guovdásj jali gusstuhis tjuoggá sirkkelin.

circle-radius-center-with-multiple-points = Ij máhte sirkkela radiusav vaddum guovdátjin ienep gå 1 tjuoggá tjadá rehkenasstet.

circle-change-radius-non-numerical = Ij máhte sirkkela radiusav rievddadit gå tjuoggá e la numeralattja

circle-radius-with-points-non-numerical = Ij máhte sirkkelav ienep gå ihta tjuoggá tjadá vaddum radiusajn dahkat gå árvo e la numeralattja.

circle-change-center-non-numerical = Sirkkela guovdásja rievddadibme tjuoggáj tjadá gånnå e la numeralasj árvo ij la tjadáduvvam.

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
        [one] Ij nuoges dimensjåvnå funksjuvna mierredimguovlluj. Mierredimguovlon la { $intervals } gasska, valla funksjuvnan { $inputs ->
            [one] la { $inputs } sisabiedjam
           *[other] li { $inputs } sisabiedjama
        }.
       *[other] Ij nuoges dimensjåvnå funksjuvna mierredimguovlluj. Mierredimguovlon li { $intervals } gaska, valla funksjuvnan { $inputs ->
            [one] la { $inputs } sisabiedjam
           *[other] li { $inputs } sisabiedjama
        }.
    }

function-domain-invalid-format = Gusstuhis hábme funksjuvna mierredimguovlon.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Funksjuvna numeralasjdagá maksimuma ij adneduvá.
        [minimum] Funksjuvna numeralasjdagá minimuma ij adneduvá.
        [extremum] Funksjuvna numeralasjdagá ekstremuma ij adneduvá.
        [point] Funksjuvna numeralasjdagá tjuoggá ij adneduvá.
        [slope] Funksjuvna numeralasjdagá luojtem ij adneduvá.
       *[other] Funksjuvna numeralasjdagá { $type } ij adneduvá.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Funksjuvna guoros maksimuma ij adneduvá.
        [minimum] Funksjuvna guoros minimuma ij adneduvá.
        [extremum] Funksjuvna guoros ekstremuma ij adneduvá.
        [point] Funksjuvna guoros tjuoggá ij adneduvá.
       *[other] Funksjuvna guoros { $type } ij adneduvá.
    }

function-points-too-close = Funksjuvnan li guokta tjuoggá ma li ilá lahkalakkoj. Funksjuvnav ij máhte mierredit.

function-iterates-input-output-mismatch =
    { $inputs ->
        [one] Funksjuvna gierddoma li vejulattja duosjta jus sisabiedjamij låhko la sæmmi degu ålgusbuktemij låhko. Dán funksjuvnan la { $inputs } sisabiedjam ja { $outputs ->
            [one] { $outputs } ålgusbuktem
           *[other] { $outputs } ålgusbukteme
        }.
       *[other] Funksjuvna gierddoma li vejulattja duosjta jus sisabiedjamij låhko la sæmmi degu ålgusbuktemij låhko. Dán funksjuvnan li { $inputs } sisabiedjama ja { $outputs ->
            [one] { $outputs } ålgusbuktem
           *[other] { $outputs } ålgusbukteme
        }.
    }

## Vector and slope fields

field-function-wrong-num-outputs =
    `<{ $component }>` dárbaj funksjuvnav gånnå { $expected ->
        [one] akta ålgusbuktem, luojtem y' juohkka tjuoggán, degu `y - x`
       *[other] guokta ålgusbukteme, vektor juohkka tjuoggán, degu `(y, -x)`
    }, valla vaddum funksjuvnan li { $found ->
        [one] { $found } ålgusbuktem
       *[other] { $found } ålgusbukteme
    }. { $alternative ->
        [none] Ij maktik sárgoduvá.
       *[other] `<{ $alternative }>` la komponenta dan funksjuvnaj. Ij maktik sárgoduvá.
    }

field-function-attribute-ignored-with-child = Attribuhtta `function` ij adneduvá danen gå funksjuvna aj komponenta sisŋelin la vaddum; dat mij la sisŋelin adneduvvá. Vatte funksjuvnav duosjta ihta vuoge milta.

field-variables-ignored =
    `<{ $component }>`: attribuhtta `variables` nammat dan tjielggidusá variábelijt mij njuolgga komponenta sisŋelin la tjállidum. { $reason ->
        [function-child] Funksjuvna dánna la vaddum `<function>`-mánnán, mij ietjas variábelijt nammat, ja danen `variables` ij adneduvá.
       *[no-expression] Ij makkirak dakkir tjielggidus la dánna vaddum, ja danen `variables` ij adneduvá.
    }

## `<sequence>`

sequence-invalid-length = Gusstuhis guhkkudahka rájddaj. Hæhttu negatijvadagá ålles låhko årrot.

sequence-invalid-step = Gusstuhis lávkke rájdan. Hæhttu låhko årrot rájddaj gånnå la sjláj { $type }.

sequence-invalid-endpoint-number = Gusstuhis "{ $attribute }" låhkorájdan. Hæhttu låhko årrot.

sequence-invalid-endpoint-letters = Gusstuhis "{ $attribute }" bukstávvarájdan. Hæhttu bukstávaj kombinasjåvnnå årrot.

sequence-invalid-endpoint = Gusstuhis "{ $attribute }" rájdan.

select-from-sequence-coprime-not-numbers = coprime ij adneduvá danen gå låho e válljiduvá

select-from-sequence-coprime-with-exclude-combinations = coprime ij adneduvá danen gå excludeCombinations la vaddum

## Resolving a `target`

target-not-found = Gusstuhis target dási `<{ $source }>`: ulmme ij gávnadum.

target-state-variable-not-found = Gusstuhis target dási `<{ $source }>`: ij gávnadum stáhtavariábel nammajn "{ $property }" dán nanna: `<{ $component }>`.

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` variábela hæhtti ietjá årrot degu sorjjatdagá variábel.

ode-system-duplicate-variable-names = Ij máhte ODE:a ålgesbiele funksjuvnajt mierredit gå sorjavasj variábelij nama li moatten.

ode-system-rhs-function-error = Ij máhte ODE:a ålgesbiele funksjuvnav mierredit. Mieddádus mathjs-funksjuvna dahkamin.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Ij máhte vinkkelav { $count } linnjá gaskan mierredit

angle-invalid-through-point = Gusstuhis tjuoggá `<angle>` through:in

parabola-vertex-too-many-points = Parabola tjåhkåjn ienep gå 1 tjuoggá tjadá ij la tjadáduvvam.

parabola-too-many-points = Parabola ienep gå 3 tjuoggá tjadá ij la tjadáduvvam.

intersection-too-many-items = Ienep gå guovte dinga tjuohppasibme ij la tjadáduvvam

## Other math components

ionic-compound-not-two-ions = Ijovnalasj tjadnalvis ij la tjadáduvvam iehtjádij degu guovte ijovnnaj.

ionic-compound-needs-cation-and-anion = Ijovnalasj tjadnalvis la duosjta ihta katijovnnaj ja ihta anijovnnaj tjadáduvvam.

solve-equations-cannot-evaluate = Ij máhte dásádusáv tjoavddet danen gå dav ittjij máhte rehkenasstet: { $equation }

math-operators-operand-number-required = Hæhttu operandNumber vaddet gå matematihkalasj operandav válde erit.

eigen-decomposition-failed = Ittjij máhte matriksa iesjárvojt rehkenasstet

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
        [one] `<matchesPattern>`: parameter { $parameters } ij la minstaran, ja danen dat gájkka ájgen guorosij hiebada.
       *[other] `<matchesPattern>`: parametera { $parameters } e la minstaran, ja danen da gájkka ájgen guorosij hiebadi.
    }

## `<graph>`

graph-grid-invalid = `<graph>`: ij máhte grid="{ $grid }" dulkot. Hæhttu none, medium, dense jali guokta positijvalasj lågo årrot gaskajn juogaduvvam, åvdåmærkka grid="1 0.5". Ruvtto ij sárgoduvá.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: xLabelPosition="left" ij la doarjjaduvvam prefigure-vuosedijiddjen; ålgesbiele láhtudibme adneduvvá.

prefigure-y-label-position-unsupported = `<graph>`: yLabelPosition="bottom" ij la doarjjaduvvam prefigure-vuosedijiddjen; bajetbiele láhtudibme adneduvvá.

prefigure-invalid-axis-bounds = `<graph>`: gusstuhis akselarájá prefigure-nubástuhttimij; standárda bbox (-10,-10,10,10) adneduvvá.

prefigure-invalid-width = `<graph>`: gusstuhis gåvvdudahka prefigure-nubástuhttimij; standárda gåvvdudahka 425 adneduvvá.

prefigure-invalid-aspect-ratio = `<graph>`: gusstuhis aspectRatio prefigure-nubástuhttimij; standárda gasskavuohta 1 adneduvvá.

prefigure-grid-spacing-too-fine = `<graph>`: ruvto gaska li ilá unne akselarájáj ektuj; ruvtto guoddoduvvá erit prefigure-vuosedijiddjen.

prefigure-annotations-not-rendered = `<graph>`: merkadusá e vuoseduvá gå PreFigure-vuosedijiddje ij adneduvá.

multiple-annotations-children = Moadda `<annotations>`-mánná gávnaduvvin `<graph>`:in; gájka ietjá degu maŋemus e adneduvá.

## Referring to other components

copy-unrecognized-component-type = Ij máhte dåbdåtdagá komponentasjlájav { $type } vijddedit jali máŋggit.

copy-prop-not-found = Ij gávnadum iesjvuohta { $property } komponentan gånnå la sjláj { $component }

collect-no-source = Ij gávnadum gáldo dási collect.

collect-invalid-component-type = Ij máhte komponentajt sjlájas `<{ $component }>` tjoahkkit danen gå dat la gusstuhis komponentasjláj.

reference-index-unavailable = Ij máhte indeksaj `{ $reference }` gehtjalit

## `<callAction>`

component-action-unavailable = Ij máhte { $action } komponentan `{ $reference }` gåhtjot

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Dáhtajn la gusstuhis hábme. Linnjáj guhkkudagá e la sæmmiláhkásattja. Gávnaduvvam dánna: componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Dáhtajn li moatten sæmmi kolonnanama. Gávnaduvvam dánna: componentIdx :{ $componentIdx }

data-frame-missing-column-name = Dáhtajs vájllu kolonnanamma. Gávnaduvvam dánna: componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Akta award dán vásstádussaj vuododuvvá answer-gilkora ietjas sáddiduvvam vásstádussaj, mij vuorddemdagá láhtudimev dahká.

answer-max-num-attempts-in-section-wide-check-work = `maxNumAttempts` bidjat `<answer>`:aj mij la `sectionWideCheckWork`-kårta sisŋelin ij dåjma, danen gå kårta stivrri gæhttjalimij lågov. Bija `maxNumAttempts` kårtaj.

nested-section-wide-check-work-max-num-attempts = `maxNumAttempts` bidjat kårtaj gånnå la `sectionWideCheckWork` ja mij la nuppe `sectionWideCheckWork`-kårta sisŋelin ij dåjma, danen gå ålgomus kårta stivrri gæhttjalimij lågov. Bija `maxNumAttempts` ålgomus kårtaj.

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
        [one] Attribuhtta { $attributes } ij dåjma jus symbolicEquality ij la bidjaduvvam.
       *[other] Attribuhta { $attributes } e dåjma jus symbolicEquality ij la bidjaduvvam.
    }

answer-invalid-type = Gusstuhis sjláj vásstádussaj: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Gå komponentan `<{ $component }>` ij la namma, de dav ij máhte moduvla attribuhttan adnet

module-attribute-name-already-defined = Komponentav `<{ $component } name="{ $name }">` ij máhte moduvla attribuhttan adnet danen gå komponentasjlájan `<module>` juo la attribuhtta "{ $name }".

conditional-content-condition-ignored = Attribuhtta `condition` ij adneduvá `<conditionalContent>`:in gånnå li case- jali else-máná.

slider-markers-type-mismatch = Merkaj sjláj ij hiebada slider:a sjlájaj.

pretzel-problem-needs-statement-and-answer = Gusstuhis pretzel: juohkka `<problem>`:in hæhttu akta `<statement>` ja akta `<answer>` årrot.

pretzel-circuit-first-problem-distractor = Gusstuhis pretzel: mode="circuit":in ij máhte vuostasj `<problem>` fillijiddje årrot.

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
        [one] Gusstuhis árvo { $values } attribuhttaj `{ $attribute }`; ij adneduvá.
       *[other] Gusstuhis árvo { $values } attribuhttaj `{ $attribute }`; e adneduvá.
    }

attribute-must-be-references = Gusstuhis árvo `{ $value }` attribuhttaj `{ $attribute }`. Attribuhtta hæhttu gehtjalvisájs tjoahkkidum årrot ma merkajn `$` álggi.

math-input-invalid-function-names = <mathInput>: gusstuhis funksjuvnanama dánna { $attribute } e la adneduvvam: { $names }. Juohkka nama vuosedimoasse hæhttu unnemusát 2 merka (bukstáva jali sárgá) adnet; dan maŋŋela máhttá ævtudagálasj `|<mathspeak molssaæjgadus>` tjuovvot.

## Building components from the source

component-type-invalid = Gusstuhis komponentasjláj: `<{ $componentType }>`

attribute-repeated = Ij máhte attribuhtav { $attribute } moatten vaddet.

attribute-invalid-for-component = Gusstuhis attribuhtta "{ $attribute }" komponentaj gånnå la sjláj `<{ $componentType }>`.

## Style definition contrast

style-definition-insufficient-contrast =
    Stijllamierredimen { $styleNumber } ij la nuoges kontrássta dási { $context ->
        [text-on-background] tekstaivne duogásjivne ektuj
        [high-contrast] alla kontrássta ivne duogásja ektuj
        [line] linnjáivne duogásja ektuj
        [marker] merkaivne duogásja ektuj
       *[text-on-canvas] tekstaivne duogásja ektuj
    }{ $mode ->
        [dark] { " (sjævnnjis modus)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; gájbeduvvá unnemusát { $threshold }:1).

style-definition-dark-mode-text-background-contrast =
    Vájku stijllamierredimen { $styleNumber } li ivne majn la nuoges kontrássta tjuovggis modussaj, de sjævnnjis modusa ivnij ma dajs rehkenasteduvvi ij la nuoges kontrássta tekstaivne duogásjivne vuosstáj ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; gájbeduvvá unnemusát { $threshold }:1). { $suggestion ->
        [available] Vaj kontrássta la nuoges sjævnnjis modusan, lasedi tjuovggis modusa kontrásstav (åvdåmærkka bija { $lightAttribute }="{ $lightColor }") jali badjelgehtja sjævnnjis modusa ivnev (åvdåmærkka bija { $darkAttribute }="{ $darkColor }").
       *[none] Vaj kontrássta la nuoges sjævnnjis modusan, lasedi tjuovggis modusa kontrásstav jali badjelgehtja rehkenasteduvvam ivnijt textColorDarkMode ja/jali backgroundColorDarkMode baktu.
    }

style-definition-dark-mode-text-canvas-contrast =
    Vájku stijllamierredimen { $styleNumber } la tekstaivne mij la nuoges kontrásstajn tjuovggis modussaj, de sjævnnjis modusa tekstaivnen mij dis rehkenasteduvvá ij la nuoges kontrássta duogásja vuosstáj ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; gájbeduvvá unnemusát { $threshold }:1). { $suggestion ->
        [available] Vaj kontrássta la nuoges sjævnnjis modusan, lasedi tjuovggis modusa kontrásstav (åvdåmærkka bija textColor="{ $lightColor }") jali badjelgehtja sjævnnjis modusa ivnev (åvdåmærkka bija textColorDarkMode="{ $darkColor }").
       *[none] Vaj kontrássta la nuoges sjævnnjis modusan, lasedi tjuovggis modusa kontrásstav jali badjelgehtja rehkenasteduvvam ivnev textColorDarkMode baktu.
    }

section-multiple-style-palettes = Kapihttal máhttá duosjta ihta <stylePalette> válljit; maŋemus adneduvvá.

## Unique variants

variant-num-to-select-not-non-negative-integer = ij máhte { $component } æjnastis variántajt mierredit danen gå numToSelect ij la negatijvadagá ålles låhko.

variant-num-to-select-not-constant-number = ij máhte { $component } æjnastis variántajt mierredit danen gå numToSelect ij la bissoves låhko.

variant-with-replacement-not-constant-boolean = ij máhte { $component } æjnastis variántajt mierredit danen gå withReplacement ij la bissoves boolean.

variant-select-weight-disables-unique = select:a æjnastis variánta li jaddaduvvam jus mangin molssaæjgadusán la selectWeight jali selectForVariants vaddum

variant-coprime-undetermined = ij máhte { $component } æjnastis variántajt mierredit danen gå ij máhte mierredit gájkka ájgen coprime la båsstot.

variant-attribute-not-constant = ij máhte { $component } æjnastis variántajt mierredit danen gå { $attribute } ij la bissoves.

variant-attribute-not-number = ij máhte { $component } æjnastis variántajt mierredit danen gå { $attribute } ij la låhko.

variant-attribute-wrong-type-for-sequence =
    ij máhte { $component } æjnastis variántajt mierredit gånnå la sjláj { $type } danen gå { $attribute } ij la { $expected ->
        [letters-combination] bukstávaj kombinasjåvnnå
        [math-expression] gusstok matematihkalasj tjielggidus
        [integer] ålles låhko
       *[number] låhko
    }.

variant-length-not-integer = ij máhte { $component } æjnastis variántajt mierredit danen gå length ij la ålles låhko.

variant-sort-not-implemented = { $component } æjnastis variánta sort:ajn e la tjadáduvvam

variant-exclude-combinations-not-implemented = { $component } æjnastis variánta excludeCombinations:ajn e la tjadáduvvam

variant-math-exclude-not-implemented = { $component } æjnastis variánta sjlájan math exclude:ajn e la tjadáduvvam

variant-non-constant-exclude-not-implemented = { $component } æjnastis variánta bissoveshis exclude:ajn e la tjadáduvvam

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: ij la doarjjaduvvam gráffa prefigure-vuosedijiddjen; maŋŋenboahtte guoddoduvvá badjel.

prefigure-descendant-invalid-geometry = { $subject }: geometrija ij la ållisasj jali ij la ráddjiduvvam; maŋŋenboahtte guoddoduvvá badjel.

prefigure-curve-label-omitted = { $subject }: namádusá e la doarjjaduvvam nubástuhtedum kurvaelementajn; namádus guoddoduvvá erit.

prefigure-curve-unsupported-definition-type = { $subject }: doarjjadagá kurvafunksjuvna mierredimsjláj '{ $definitionType }'; maŋŋenboahtte guoddoduvvá badjel.

prefigure-region-flip-functions-unsupported = { $subject }: doarjjadagá attribuhtta flipFunctions regionBetweenCurves:in; maŋŋenboahtte guoddoduvvá badjel.

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves:in li duosjta mánnáfunksjuvna doarjjaduvvam ma li formelajn vaddum; maŋŋenboahtte guoddoduvvá badjel.

prefigure-label-position-unsupported =
    { $subject }: doarjjadagá labelPosition '{ $labelPosition }' dási { $labelKind ->
        [line-family] linnjájuohkusa namádus
       *[point] tjuoggá namádus
    }; standárda PreFigure-álgosadje adneduvvá.

prefigure-fill-style-unsupported = { $subject }: devdemstijlla '{ $fillStyle }' ij la PreFigure:in doarjjaduvvam; dievva devdem adneduvvá.

prefigure-line-style-unknown = { $subject }: dåbdåtdagá linnjástijlla '{ $lineStyle }' guoddoduvvaj erit PreFigure-buvtadimen.

prefigure-marker-style-mapped-to-diamond = { $subject }: merkastijlla '{ $markerStyle }' sirdaduvvaj PreFigure-stijllaj 'diamond'.

prefigure-marker-style-unsupported = { $subject }: merkastijlla '{ $markerStyle }' ij la PreFigure:in doarjjaduvvam; standárdastijlla adneduvvá.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: gusstuhis `ref`; ulmev ij máhte gávnnat. Merkadus guoddoduvvá erit.

annotation-ref-multiple-targets = `<annotation>`: `ref` gehtjalij moatte ulmmáj; vuostasj adneduvvá.

annotation-ref-outside-graph = `<annotation>`: gusstuhis `ref`; ulmme la gráffa ålggolin gånnå dat la. Merkadus guoddoduvvá erit.

annotation-ref-unsupported-target = `<annotation>`: gusstuhis `ref`; ulmme ij la doarjjaduvvam gráfalasj objekta prefigure-nubástuhttimin. Merkadus guoddoduvvá erit.

annotation-text-missing = `<annotation>`: `text` vájllu jali la guoros; guoros teksta buvtaduvvá.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Birrasorjavasjvuohta la gávnaduvvam.
       *[other] Birrasorjavasjvuohta gávnaduvvam gånnå la `<{ $componentType }>`-komponenta mielden.
    }

reference-no-referent = Ij gávnadum gehtjalvisá åjvvedimusj: `{ $reference }`

reference-multiple-referents = Moadda gehtjalvisá åjvvedimusá gávnaduvvin: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Gusstuhis hábme attribuhttaj { $attribute } dán nanna: `<{ $componentType }>`.

children-invalid = Gusstuhis máná dási `<{ $componentType }>`: gávnaduvvin gusstuhis máná: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Gusstuhis árvo `{ $value }` attribuhttaj `{ $attribute }`, árvo `{ $default }` adneduvvá

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML versjåvnnå { $version } ij gávnadum.
       *[other] DoenetML versjåvnnå { $version } ij gávnadum. Versjåvnnå { $fallback } adneduvvá
    }

## Reading the DoenetML

parse-invalid-doenetml = Gusstuhis DoenetML: { $content }

parse-tag-missing-close-tag = Gusstuhis DoenetML: gilkoran `{ $tag }` ij la gåptjemgilkor. Vuorddeduvvaj iesjgåptjije gilkor jali `</{ $tagName }>`-gilkor.

parse-tag-error = Gusstuhis DoenetML: mieddádus gilkoran `<{ $tagName }>`

parse-attribute-missing-value = Gusstuhis DoenetML: gusstuhis attribuhtan `{ $attribute }` oro vájllume árvo.

parse-attribute-invalid = Gusstuhis DoenetML: gusstuhis attribuhtta `{ $attribute }`

parse-attribute-value-invalid = Gusstuhis DoenetML: gusstuhis attribuhttaárvo `{ $value }`

parse-attribute-value-quote-mismatch = Gusstuhis DoenetML: gusstuhis attribuhttaárvo `{ $value }`. Sitáhtamerka e hiebada aktan. Oro vájllume `{ $quote }`

parse-open-tag-name-missing = Gusstuhis DoenetML: gávnaduvvaj gilkor gånnå ij la namma, åvdåmærkka `<`

parse-tag-not-closed = Gusstuhis DoenetML: gilkor `{ $tag }` ij gåptjaduvvam (oro vájllume `>`).

parse-self-closing-tag-name-missing = Gusstuhis DoenetML: gávnaduvvaj gilkor gånnå ij la namma `<{ $content }>`

parse-self-closing-tag-not-closed = Gusstuhis DoenetML: gilkor `{ $tag }` ij gåptjaduvvam (oro vájllume `/>`).

parse-tag-invalid-attributes = Gusstuhis DoenetML: gilkor `{ $tag }` ij la gusstok. Dan máhtti gusstuhis attribuhta årrot.

parse-close-tag-name-missing = Gusstuhis DoenetML: gávnaduvvaj gåptjemgilkor gånnå ij la namma, åvdåmærkka `</`

parse-attribute-value-unquoted = Attribuhttaárvo hæhtti sitáhtamerkaj sisŋelin årrot: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = Gusstuhis DoenetML: gávnaduvvaj gåptjemgilkor `{ $tag }`, valla ij gávnadum vásstediddje rahpamgilkor

parse-close-tag-mismatched = Gusstuhis DoenetML: gåptjemgilkor ij hiebada. Vuorddeduvvaj `</{ $expected }>`. Gávnaduvvaj `{ $found }`

parser-node-unconvertible = Ittjij máhte tjuoggáv { $node } Dast-tjuoggán nubástuhttet.

## Names

name-attribute-invalid =
    Gusstuhis attribuhtta name='{ $name }'. { $reason ->
        [characters] Namájn máhtti duosjta bukstáva, låho, vuollesárgá jali sárgá årrot.
       *[start] Nama hæhtti bukstávajn álgget.
    }

component-name-invalid-start = Gusstuhis komponentanamma "{ $name }". Nama hæhtti bukstávajn álgget.

## `<answer>` sugar

answer-video-watched-missing-video = Answer gånnå la sjláj videoWatched hæhttu attribuhtav video adnet

answer-video-watched-video-not-reference = Answer gånnå la sjláj videoWatched hæhttu attribuhtav video adnet mij la gehtjalvis

answer-name-not-single-text = Answer attribuhtan name hæhttu akta tekstamánná årrot

## Referencing another document

external-doenetml-recursion-limit = Ij máhte ålgoldis DoenetML:av vieddjat danen gå li ilá moadda rekursijvalasj dáse. Lehkusj dánna birragehtjalvis?

external-doenetml-unavailable = Ij máhte DoenetML:av vieddjat dánna { $attribute }="{ $uri }"

external-doenetml-type-mismatch = Gusstuhis DoenetML vieddjidum dánna { $attribute }="{ $uri }": dat ittjij hiebada komponentasjlájaj "{ $componentType }"

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Attribuhtta `{ $from }` la boarásmuvvam; ane baj `{ $to }`.
       *[other] [deprecation] Attribuhtta `{ $from }` dán nanna `<{ $component }>` la boarásmuvvam; ane baj `{ $to }`.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Attribuhtta `{ $from }` la boarásmuvvam ja ij adneduvá danen gå aj `{ $to }` la vaddum.
       *[other] [deprecation] Attribuhtta `{ $from }` dán nanna `<{ $component }>` la boarásmuvvam ja ij adneduvá danen gå aj `{ $to }` la vaddum.
    }

deprecated-attribute-ignored = [deprecation] Attribuhtta `{ $attribute }` dán nanna `<{ $component }>` la boarásmuvvam ja ij adneduvá.

deprecated-attribute-to-child = [deprecation] Attribuhtta `{ $attribute }` dán nanna `<{ $component }>` la boarásmuvvam; ane baj `<{ $child }>`-mánáv.

deprecated-attribute-value-renamed = [deprecation] Árvo `{ $value }` attribuhtan `{ $attribute }` dán nanna `<{ $component }>` la boarásmuvvam; ane baj `{ $to }`.


## Language coverage

pluralize-english-only = `<pluralize>` máhttá moattelågov dahkat duosjta æŋgelsgielaj, ja danen dan teksta bissu rievddatdagá dokumentan mij la dán gielaj tjállidum: { $locale }. Tjále moattelågo hámev njuolgga, jali vatte dav attribuhtajn `pluralForm`.


## Checking against the schema

schema-element-unrecognized = Elementa `<{ $tag }>` ij la dåbdåduvvam Doenet-elementa.

schema-element-not-allowed-at-root = Elementa `<{ $tag }>` ij la lubák dokumenta ruohtsan.

schema-element-not-allowed-inside = Elementa `<{ $tag }>` ij la lubák dán sisŋelin: `<{ $parent }>`.

schema-attribute-unrecognized = Elementan `<{ $tag }>` ij la attribuhtta nammajn `{ $attribute }`.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Attribuhtta `{ $attribute }` elementan `<{ $tag }>` hæhttu liste årrot gånnå juohkka lahtto la akta dájs: { $allowed }
       *[other] Attribuhtta `{ $attribute }` elementan `<{ $tag }>` hæhttu akta dájs årrot: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Gusstuhis variántanamma dási select. Variántanamma { $variantName } la { $numOptions } molssaæjgadusán, valla válljimlåhko la { $numToSelect }.

select-variant-name-without-options = Muhtem variánta li vaddum dási select, valla molssaæjgadusá e la vaddum vejulasj variántanammaj: { $variantName }.

select-variant-name-not-possible = Variántanamma { $variantName } mij la vaddum dási select ij la vejulasj variántanamma.

select-too-few-options = Ij máhte { $numToSelect } komponentav duosjta { $numOptions } gaskas válljit.

select-from-sequence-too-few-values = Ij máhte { $numToSelect } árvov rájdan válljit gånnå la guhkkudahka { $length }.

select-from-sequence-indices-count-mismatch = Indeksaj låhko mij la vaddum dási select hæhttu válljimlåhkuj hiebadit

select-from-sequence-indices-not-integers = Gájka indeksa ma li vaddum dási select hæhtti ålles låho årrot

select-from-sequence-index-excluded = Vaddum selectfromsequence-indeksa lij ålgusváldum

select-from-sequence-indices-excluded-combination = Vaddum selectfromsequence-indeksa lidjin ålgusváldem kombinasjåvnnå

select-from-sequence-coprime-not-positive-integers = Ij máhte aktisasjfáktordagá kombinasjåvnåjt válljit danen gå positijvalasj ålles låho e válljiduvá.

select-from-sequence-coprime-common-factor = Ij máhte aktisasjfáktordagá lågojt válljit. Gájka vejulasj árvojn la aktisasj fáktor. ("from" jali "to" vaddum árvo hæhtti aktisasjfáktordagá "step" ektuj årrot.)

select-from-sequence-coprime-single-number = Ij máhte aktisasjfáktordagá kombinasjåvnåjt ihta lågon válljit mij ij la 1.

select-from-sequence-excluded-too-many-combinations = Ienep gå 70% kombinasjåvnåjs ålgusváldeduvvá selectFromSequence:in

select-from-sequence-coprime-none-found = Ittjij máhte aktisasjfáktordagá lågojt válljit. Gájka vejulasj árvojn la aktisasj fáktor.

select-from-sequence-too-few-unique-values = Ij máhte { $numToSelect } æjnastis árvov rájdan válljit gånnå la guhkkudahka { $numPossibleValues }

select-prime-numbers-too-few-values = Ij máhte { $numToSelect } árvov primmalågolistan válljit gånnå la guhkkudahka { $numValues }

select-prime-numbers-values-count-mismatch = Árvoj låhko mij la vaddum dási select hæhttu válljimlåhkuj hiebadit

select-prime-numbers-values-not-prime = Gájka árvo ma li vaddum primmalågo válljimij hæhtti primmalågolistan årrot

select-prime-numbers-values-excluded-combination = Vaddum selectPrimeNumbers-árvo lidjin ålgusváldem kombinasjåvnnå

select-prime-numbers-excluded-too-many-combinations = Ienep gå 70% kombinasjåvnåjs ålgusváldeduvvá selectPrimeNumbers:in

select-random-combination-fluke = Sierra æhpejáhkedis sáddjáj ittjij máhte lubák árvoj kombinasjåvnåv válljit

select-random-value-fluke = Sierra æhpejáhkedis sáddjáj ittjij máhte lubák árvov válljit
