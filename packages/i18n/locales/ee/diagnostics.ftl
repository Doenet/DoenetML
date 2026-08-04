# Ewe diagnostics. Translated from `locales/en/diagnostics.ftl`, which is the
# source of truth: `lint:i18n` rejects a key that does not exist there, and
# reports a key that exists there but not here as missing coverage.
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
# Where English separates a singular from a plural only in the verb — "is
# ignored" against "are ignored" — the Ewe verb takes no number from its
# subject, and the argument is a list either way. So those selects are dropped
# and the count argument goes unused.
#
# `ɖ`, `ƒ`, `ɣ`, `ŋ`, `ɔ`, `ɛ` and `ʋ` are letters of the alphabet, as
# `content.ftl`'s header sets out; so are the tone marks.

## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints = Womebua { $attributes } ŋu o ne woɖo nuwuwu nɔƒe eveawo

line-segment-attributes-ignored-with-endpoint-and-midpoint = Womebua { $attributes } ŋu o ne woɖo nuwuwu nɔƒe kple titina nɔƒe siaa

line-segment-midpoint-offset-without-midpoint = midpointOffset mewɔa naneke o ne titina nɔƒe meli o

## `<line>`

line-points-undetermined-dimensions = Flia to nɔƒe siwo ƒe lolome womenya o dzi.

line-points-too-few-dimensions = Ele be flia nato nɔƒe siwo si lolome eve ya teti le dzi.

line-points-depend-on-variables = Flia to nɔƒe siwo nɔ tɔtrɔnuwo dzi la dzi: { $variables }.

line-equation-invalid-format = Ɖoɖoa mesɔ na fli ƒe sɔsɔmenya le tɔtrɔnu { $variable1 } kple { $variable2 } me o.

## `<ray>`

ray-overprescribed-through = Woɖo fli mɔ la kple through, endpoint kple direction siaa. Womebua through si woɖo la ŋu o.

ray-dimension-mismatch = numDimensions mesɔ le fli mɔ la me o.

## `<vector>`

vector-overprescribed-head = Woɖo vɛkta la kple head, tail kple displacement siaa. Womebua head si woɖo la ŋu o.

vector-dimension-mismatch = numDimensions mesɔ le vɛkta la me o.

## Attracting and constraining

attract-to-without-nearest-point = Mate ŋu ahe ayi `<{ $component }>` gbɔ o elabena nɔnɔme tɔtrɔnu nearestPoint mele esi o.

constrain-to-without-nearest-point = Mate ŋu abla ɖe `<{ $component }>` ŋu o elabena nɔnɔme tɔtrɔnu nearestPoint mele esi o.

constrain-to-interior-without-nearest-point = Mate ŋu abla ɖe `<{ $component }>` me o elabena nɔnɔme tɔtrɔnu nearestPoint mele esi o.

## `<choiceInput>`

choice-input-label-position-ignored = Womebua labelPosition ŋu le choiceInput si menye fli ɖeka o la me o

## Ordering children by index

choice-input-indices-count-mismatch = Womebua indɛks siwo woɖo na choiceInput ŋu o elabena indɛks ƒe agbɔsɔsɔ kple choice viwo ƒe agbɔsɔsɔ mesɔ o.

pretzel-indices-count-mismatch = Womebua indɛks siwo woɖo na problem ŋu o elabena indɛks ƒe agbɔsɔsɔ kple problem viwo ƒe agbɔsɔsɔ mesɔ o.

shuffle-indices-count-mismatch = Womebua indɛks siwo woɖo na shuffle ŋu o elabena indɛks ƒe agbɔsɔsɔ kple nuawo ƒe agbɔsɔsɔ mesɔ o.

indices-ignored-out-of-range = Womebua indɛks siwo woɖo na { $component } ŋu o elabena indɛks aɖewo le liƒoa godo.

pretzel-indices-repeated = Womebua indɛks siwo woɖo na pretzel ŋu o elabena wogagblɔ indɛks aɖewo.

pretzel-circuit-first-index = Womebua indɛks siwo woɖo na pretzel le circuit me ŋu o elabena ele be indɛks gbãtɔ nanye 1.

## `<shuffle>` and `<sort>`

string-children-need-type = Be `<{ $component }>` nawɔ dɔ kple nuŋɔŋlɔ ƒomevi viwo la, ele be woaɖo nɔnɔme `type`.

invalid-type-defaulting-to-math = type { $type } mesɔ na nu { $component } o. Ele be wòanye math, text, number alo boolean dometɔ ɖeka. Wotsɔ math ɖo eteƒe.

string-not-valid-component-to-arrange = Nuŋɔŋlɔ "{ $value }" menye { $component } nu si sɔ o. Womebua eŋu o.

## Types and variables

invalid-type-defaulting-to-number = type { $type } mesɔ o, wotsɔ number ɖo type teƒe.

invalid-variable-value = Tɔtrɔnu ƒe home mesɔ o: `{ $value }`

## Variants

variant-index-must-be-number = Ele be nɔnɔme indɛks { $index } nanye xexlẽdzesi

variant-index-must-be-integer = Ele be nɔnɔme indɛks { $index } nanye xexlẽdzesi blibo

## `<sideBySide>`

side-by-side-absolute-widths = Womewɔ `<{ $component }>` kple nudidi tututuwo o. Wotsɔ akpa ɖo keklẽmeawo teƒe.

side-by-side-absolute-margins = Womewɔ `<{ $component }>` kple nudidi tututuwo o. Wotsɔ akpa ɖo axadzinuawo teƒe.

side-by-side-no-block-child = `<{ $component }>` mesɔ o: ele be blɔk ƒomevi vi ɖeka ya teti nanɔ eŋu.

## `<label>`

label-for-ignored-on-graphical = Womebua nɔnɔme `for` si le nɔnɔmetata ƒe `<label>` dzi ŋu o.

label-for-must-resolve-to-one = Ele be nɔnɔme `for` si le `<label>` dzi la nafia nu ɖeka pɛ.

label-for-unresolved = Nɔnɔme `for` si le `<label>` dzi la mete ŋu fia nu aɖeke o.

label-for-answer-with-authored-inputs = Nɔnɔme `for` si le `<label>` dzi la fia `<answer>` si si nudede siwo woŋlɔ le; fia nudedea ŋutɔ.

label-for-answer-without-input = Nɔnɔme `for` si le `<label>` dzi la fia `<answer>` si si nudede si woana ŋkɔ mele o.

label-for-must-reference-input-or-answer = Ele be nɔnɔme `for` si le `<label>` dzi la nafia nudede alo ŋuɖoɖo.

## Accessibility

accessibility-short-description-or-decorative = Le ŋudɔwɔwɔ ta la, ele be numeɖeɖe kpui nanɔ `<{ $component }>` ŋu alo woagblɔ be atsyɔ̃ɖoɖo ko wònye.

accessibility-video-short-description = Le ŋudɔwɔwɔ ta la, ele be numeɖeɖe kpui nanɔ `<video>` ŋu.

accessibility-input-short-description-or-label = Le ŋudɔwɔwɔ ta la, ele be numeɖeɖe kpui alo ŋkɔ nanɔ `<{ $component }>` ŋu.

accessibility-answer-input-short-description-or-label = Le ŋudɔwɔwɔ ta la, ele be numeɖeɖe kpui alo ŋkɔ nanɔ `<answer>` si wɔa nudede la ŋu.

accessibility-short-description-contains-math = Mele be akɔntabubu nuwo abe `<{ $component }>` ene nanɔ numeɖeɖe kpui la me o. Ɖe akɔntabubu ɖe sia ɖe me kple nyawo.

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] { $colorName } ƒe vovototo mesɔ gbɔ na memama ƒe tanya ŋɔŋlɔ o (viviti nɔnɔme) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ele be wòanye { $threshold }:1 ya teti).
       *[other] { $colorName } ƒe vovototo mesɔ gbɔ na memama ƒe tanya ŋɔŋlɔ o ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ele be wòanye { $threshold }:1 ya teti).
    }

## `<circle>`

circle-through-points-non-numerical = Womewɔ `<circle>` si to nɔƒe { $count } dzi la haɖe o ne xexlẽdzesi ƒe home mele nɔƒe mawo si o.

circle-too-many-through-points = Mate ŋu abu nugogo si to nɔƒe 3 wu dzi la ŋu o.

circle-overprescribed-radius-center-points = Mate ŋu abu nugogo si si titinamɔ, titina kple totonɔƒewo katã le la ŋu o.

circle-center-with-multiple-points = Mate ŋu abu nugogo si si titina si woɖo le eye wòto nɔƒe 1 wu dzi la ŋu o.

circle-radius-too-small = Mate ŋu abu nugogoa ŋu o: elabena didi si le nɔƒe eveawo dome nye { $distance }, titinamɔ { $radius } si woɖo la le sue akpa.

circle-radius-with-many-points = Mate ŋu awɔ nugogo si to nɔƒe eve wu dzi kple titinamɔ si woɖo o.

circle-invalid-center-or-through-points = Nugogoa ƒe titina alo eƒe totonɔƒewo mesɔ o.

circle-radius-center-with-multiple-points = Mate ŋu abu nugogo si si titina si woɖo le eye wòto nɔƒe 1 wu dzi la ƒe titinamɔ ŋu o.

circle-change-radius-non-numerical = Mate ŋu atrɔ nugogo si to nɔƒe siwo si xexlẽdzesi ƒe home mele o dzi la ƒe titinamɔ o

circle-radius-with-points-non-numerical = Mate ŋu awɔ nugogo si to nɔƒe ɖeka wu dzi kple titinamɔ si woɖo ne xexlẽdzesi ƒe home meli o.

circle-change-center-non-numerical = Womewɔ nugogo si to nɔƒe siwo si xexlẽdzesi ƒe home mele o dzi la ƒe titina tɔtrɔ haɖe o.

## `<function>`

function-domain-insufficient-dimensions = Dɔwɔfia ƒe nuto ƒe lolome mesɔ gbɔ o. Dometsotso { $intervals } le nutoa si gake nudede { $inputs } le dɔwɔfia la si.

function-domain-invalid-format = Dɔwɔfia ƒe nuto ƒe ɖoɖo mesɔ o.

function-ignoring-non-numerical =
    { $type ->
        [maximum] Womebua dɔwɔfia ƒe kɔkɔƒe si menye xexlẽdzesi o la ŋu o.
        [minimum] Womebua dɔwɔfia ƒe bɔbɔƒe si menye xexlẽdzesi o la ŋu o.
        [extremum] Womebua dɔwɔfia ƒe nuwuƒe si menye xexlẽdzesi o la ŋu o.
        [point] Womebua dɔwɔfia ƒe nɔƒe si menye xexlẽdzesi o la ŋu o.
        [slope] Womebua dɔwɔfia ƒe dzedzeme si menye xexlẽdzesi o la ŋu o.
       *[other] Womebua dɔwɔfia ƒe { $type } si menye xexlẽdzesi o la ŋu o.
    }

function-ignoring-empty =
    { $type ->
        [maximum] Womebua dɔwɔfia ƒe kɔkɔƒe ƒuƒlu la ŋu o.
        [minimum] Womebua dɔwɔfia ƒe bɔbɔƒe ƒuƒlu la ŋu o.
        [extremum] Womebua dɔwɔfia ƒe nuwuƒe ƒuƒlu la ŋu o.
        [point] Womebua dɔwɔfia ƒe nɔƒe ƒuƒlu la ŋu o.
       *[other] Womebua dɔwɔfia ƒe { $type } ƒuƒlu la ŋu o.
    }

function-points-too-close = Nɔƒe eve siwo te ɖe wo nɔewo ŋu akpa le dɔwɔfia la si. Womate ŋu aɖe dɔwɔfia la gɔme o.

function-iterates-input-output-mismatch = Dɔwɔfia ate ŋu agagbugbɔ awɔ dɔ ne nudedewo ƒe agbɔsɔsɔ kple nu siwo doa go la ƒe agbɔsɔsɔ sɔ ko. Nudede { $inputs } kple nu si doa go { $outputs } le dɔwɔfia sia si.

## `<sequence>`

sequence-invalid-length = Ɖoɖoa ƒe didime mesɔ o. Ele be wòanye xexlẽdzesi blibo si menye ɖoɖodzesi o.

sequence-invalid-step = Ɖoɖoa ƒe afɔɖeɖe mesɔ o. Le { $type } ƒomevi ɖoɖo me la, ele be wòanye xexlẽdzesi.

sequence-invalid-endpoint-number = Xexlẽdzesi ɖoɖo ƒe "{ $attribute }" mesɔ o. Ele be wòanye xexlẽdzesi.

sequence-invalid-endpoint-letters = Ŋɔŋlɔdzesi ɖoɖo ƒe "{ $attribute }" mesɔ o. Ele be wòanye ŋɔŋlɔdzesiwo.

sequence-invalid-endpoint = Ɖoɖoa ƒe "{ $attribute }" mesɔ o.

select-from-sequence-coprime-not-numbers = Womebua coprime ŋu o elabena menye xexlẽdzesiwo wole tiam o

select-from-sequence-coprime-with-exclude-combinations = Womebua coprime ŋu o elabena woɖo excludeCombinations

## Resolving a `target`

target-not-found = target mesɔ le `<{ $source }>` me o: womekpɔ taɖodzinua o.

target-state-variable-not-found = target mesɔ le `<{ $source }>` me o: womekpɔ nɔnɔme tɔtrɔnu si ŋkɔe nye "{ $property }" le `<{ $component }>` me o.

## `<odeSystem>`

ode-system-variables-match-independent = Ele be `<odeSystem>` ƒe tɔtrɔnuwo nato vovo tso tɔtrɔnu si le eɖokui si la gbɔ.

ode-system-duplicate-variable-names = Mate ŋu aɖe ODE RHS dɔwɔfiawo gɔme ne wogagblɔ tɔtrɔnu ƒe ŋkɔ aɖewo o.

ode-system-rhs-function-error = Mate ŋu aɖe ODE RHS dɔwɔfia gɔme o. Vodada dzɔ esime wole mathjs dɔwɔfia wɔm.

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = Mate ŋu aɖe dzogoe si le fli { $count } dome la gɔme o

angle-invalid-through-point = Nɔƒea mesɔ le `<angle>` ƒe through me o

parabola-vertex-too-many-points = Womewɔ parabola si si kɔkɔƒe le eye wòto nɔƒe 1 wu dzi la haɖe o.

parabola-too-many-points = Womewɔ parabola si to nɔƒe 3 wu dzi la haɖe o.

intersection-too-many-items = Womewɔ nu eve wu ƒe godoƒe haɖe o

## Other math components

ionic-compound-not-two-ions = Womewɔ ion nutsotso si wu ion eve la haɖe o.

ionic-compound-needs-cation-and-anion = Wowɔ ion nutsotso na kation ɖeka kple anion ɖeka ko.

solve-equations-cannot-evaluate = Mate ŋu akpɔ sɔsɔmenya la gbɔ o elabena womete ŋu bu eŋu o: { $equation }

math-operators-operand-number-required = Ele be woaɖo operandNumber ne wole akɔntabubu dɔwɔnu ɖem do goe.

eigen-decomposition-failed = Mate ŋu abu matriks la ƒe eigen homewo ŋu o

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern = `<matchesPattern>`: paramɛta { $parameters } medze le ɖoɖoa me o, eya ta woasɔ kple ƒuƒlu ɣesiaɣi.

## `<graph>`

graph-grid-invalid = `<graph>`: mate ŋu ase grid="{ $grid }" gɔme o. Ele be wòanye none, medium, dense, alo xexlẽdzesi eve nyuiwo siwo dome ɖe le, abe grid="1 0.5" ene. Womata girid aɖeke o.

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure kpɔla la mexɔa xLabelPosition="left" o; ɖusime ƒe nɔnɔme dzie wowɔa dɔ le.

prefigure-y-label-position-unsupported = `<graph>`: prefigure kpɔla la mexɔa yLabelPosition="bottom" o; tame ƒe nɔnɔme dzie wowɔa dɔ le.

prefigure-invalid-axis-bounds = `<graph>`: aksis ƒe liƒowo mesɔ na prefigure tɔtrɔ o; bbox (-10,-10,10,10) dzie wowɔ dɔ le.

prefigure-invalid-width = `<graph>`: keklẽme la mesɔ na prefigure tɔtrɔ o; nɔnɔmetata ƒe keklẽme 425 dzie wowɔ dɔ le.

prefigure-invalid-aspect-ratio = `<graph>`: aspectRatio mesɔ na prefigure tɔtrɔ o; sɔsɔme 1 dzie wowɔ dɔ le.

prefigure-grid-spacing-too-fine = `<graph>`: girid ƒe dometsotsowo le sue akpa na aksis ƒe liƒowo; woɖe asi le girid ŋu le prefigure kpɔla la me.

prefigure-annotations-not-rendered = `<graph>`: womafia ŋkuɖodzinuwo o ne womele PreFigure kpɔla la ŋu dɔ wɔm o.

multiple-annotations-children = Wokpɔ `<annotations>` vi geɖe le `<graph>` me; womebua wo katã ŋu o negbe mamlɛtɔ ko.

## Referring to other components

copy-unrecognized-component-type = Mate ŋu akeke alo agbugbɔ aŋlɔ nu ƒomevi si womenya o: { $type }.

copy-prop-not-found = Womekpɔ nɔnɔme { $property } le { $component } ƒomevi nu la ŋu o

collect-no-source = Womekpɔ dzɔtsoƒe aɖeke na collect o.

collect-invalid-component-type = Mate ŋu aƒo `<{ $component }>` ƒomevi nuwo nu ƒu o elabena nu ƒomevi si mesɔ o wònye.

reference-index-unavailable = Mate ŋu afia indɛks `{ $reference }` o

## `<callAction>`

component-action-unavailable = Mate ŋu ayɔ { $action } le nu `{ $reference }` dzi o

## `<dataFrame>`

data-frame-inconsistent-row-lengths = Nyatakakawo ƒe nɔnɔme mesɔ o. Fliawo ƒe didime mesɔ o. Wokpɔe le componentIdx :{ $componentIdx }

data-frame-duplicate-column-names = Wogagblɔ sɔti ƒe ŋkɔ aɖewo le nyatakakawo me. Wokpɔe le componentIdx :{ $componentIdx }

data-frame-missing-column-name = Sɔti ƒe ŋkɔ aɖe mele nyatakakawo ŋu o. Wokpɔe le componentIdx :{ $componentIdx }

## `<answer>` and scoring

answer-award-depends-on-own-response = Ŋuɖoɖo sia ƒe award ɖeka nɔ ŋuɖoɖo si answer tagi la ŋutɔ ɖo ɖa la dzi, eye esia ahe nɔnɔme si womekpɔ mɔ na o vɛ.

answer-max-num-attempts-in-section-wide-check-work = `maxNumAttempts` dada ɖe `<answer>` si le nudzraɖoƒe si si `sectionWideCheckWork` le me dzi mewɔa naneke o, elabena nudzraɖoƒe ma ŋutɔe kpɔa agbagbadzedzewo ƒe agbɔsɔsɔ dzi. Da `maxNumAttempts` ɖe nudzraɖoƒea ŋutɔ dzi.

nested-section-wide-check-work-max-num-attempts = `maxNumAttempts` dada ɖe nudzraɖoƒe si si `sectionWideCheckWork` le eye wòle nudzraɖoƒe bubu si si `sectionWideCheckWork` hã le me dzi mewɔa naneke o, elabena nudzraɖoƒe si le gota la ŋutɔe kpɔa agbagbadzedzewo ƒe agbɔsɔsɔ dzi. Da `maxNumAttempts` ɖe nudzraɖoƒe si le gota la dzi.

answer-attributes-need-symbolic-equality = Nɔnɔme { $attributes } mawɔ naneke o ne womeɖo symbolicEquality o.

answer-invalid-type = Ƒomevia mesɔ na ŋuɖoɖoa o: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = Esi ŋkɔ mele nu `<{ $component }>` ŋu o ta la, womate ŋu awɔ eŋu dɔ abe module ƒe nɔnɔme ene o

module-attribute-name-already-defined = Womate ŋu awɔ nu `<{ $component } name="{ $name }">` ŋu dɔ abe module ƒe nɔnɔme ene o elabena nɔnɔme si ŋkɔe nye "{ $name }" xoxo le nu ƒomevi `<module>` si.

conditional-content-condition-ignored = Womebua nɔnɔme `condition` ŋu le nu `<conditionalContent>` si si case alo else viwo le la dzi o.

slider-markers-type-mismatch = Dzesiawo ƒe ƒomevi kple slider ƒe ƒomevi mesɔ o.

pretzel-problem-needs-statement-and-answer = pretzel mesɔ o: ele be `<statement>` ɖeka kple `<answer>` ɖeka nanɔ `<problem>` ɖe sia ɖe si.

pretzel-circuit-first-problem-distractor = pretzel mesɔ o: le mode="circuit" me la, `<problem>` gbãtɔ mate ŋu anye nublanuinu o.

## Attribute values

attribute-invalid-values = Home { $values } mesɔ na nɔnɔme `{ $attribute }` o; womebua wo ŋu o.

attribute-must-be-references = Home `{ $value }` mesɔ na nɔnɔme `{ $attribute }` o. Ele be nɔnɔmea nanye asifiafia siwo dzea egɔme kple `$`.

math-input-invalid-function-names = <mathInput>: womebua dɔwɔfia ƒe ŋkɔ siwo mesɔ o le { $attribute } me ŋu o: { $names }. Ele be ŋɔŋlɔdzesi 2 ya teti nanɔ ŋkɔ ɖe sia ɖe ƒe fiafia me (ŋɔŋlɔdzesi alo fli); `|<mathspeak alternative>` ate ŋu akplɔe ɖo.

## Building components from the source

component-type-invalid = Nu ƒomevia mesɔ o: `<{ $componentType }>`

attribute-repeated = Womate ŋu agagblɔ nɔnɔme { $attribute } o.

attribute-invalid-for-component = Nɔnɔme "{ $attribute }" mesɔ na `<{ $componentType }>` ƒomevi nu o.

## Style definition contrast

style-definition-insufficient-contrast =
    Nɔnɔme gɔmeɖeɖe { $styleNumber } ƒe vovototo mesɔ gbɔ na { $context ->
        [text-on-background] nuŋɔŋlɔ ƒe amadede kple megbenu ƒe amadede
        [high-contrast] vovototo gã ƒe amadede kple nuŋlɔƒea
        [line] fli ƒe amadede kple nuŋlɔƒea
        [marker] dzesi ƒe amadede kple nuŋlɔƒea
       *[text-on-canvas] nuŋɔŋlɔ ƒe amadede kple nuŋlɔƒea
    }{ $mode ->
        [dark] { " (viviti nɔnɔme)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ele be wòanye { $threshold }:1 ya teti).

style-definition-dark-mode-text-background-contrast =
    Togbɔ be nɔnɔme gɔmeɖeɖe { $styleNumber } ɖo amadede siwo ƒe vovototo sɔ gbɔ le kekeli nɔnɔme me hã la, viviti nɔnɔme ƒe amadede siwo do tso eme la ƒe vovototo mesɔ gbɔ na nuŋɔŋlɔ ƒe amadede kple megbenu ƒe amadede o ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ele be wòanye { $threshold }:1 ya teti). { $suggestion ->
        [available] Be vovototo nasɔ gbɔ le viviti nɔnɔme me la, dzi kekeli nɔnɔme ƒe vovototo ɖe edzi (kpɔɖeŋu, ɖo { $lightAttribute }="{ $lightColor }") alo trɔ viviti nɔnɔme ƒe amadede (kpɔɖeŋu, ɖo { $darkAttribute }="{ $darkColor }").
       *[none] Be vovototo nasɔ gbɔ le viviti nɔnɔme me la, dzi kekeli nɔnɔme ƒe vovototo ɖe edzi alo trɔ amadede siwo do tso eme la kple textColorDarkMode kple/alo backgroundColorDarkMode.
    }

style-definition-dark-mode-text-canvas-contrast =
    Togbɔ be nɔnɔme gɔmeɖeɖe { $styleNumber } ɖo nuŋɔŋlɔ ƒe amadede si ƒe vovototo sɔ gbɔ le kekeli nɔnɔme me hã la, viviti nɔnɔme ƒe nuŋɔŋlɔ amadede si do tso eme la ƒe vovototo mesɔ gbɔ le nuŋlɔƒea ŋu o ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; ele be wòanye { $threshold }:1 ya teti). { $suggestion ->
        [available] Be vovototo nasɔ gbɔ le viviti nɔnɔme me la, dzi kekeli nɔnɔme ƒe vovototo ɖe edzi (kpɔɖeŋu, ɖo textColor="{ $lightColor }") alo trɔ viviti nɔnɔme ƒe amadede (kpɔɖeŋu, ɖo textColorDarkMode="{ $darkColor }").
       *[none] Be vovototo nasɔ gbɔ le viviti nɔnɔme me la, dzi kekeli nɔnɔme ƒe vovototo ɖe edzi alo trɔ amadede si do tso eme la kple textColorDarkMode.
    }

section-multiple-style-palettes = Memama ate ŋu atia <stylePalette> ɖeka ko; mamlɛtɔ dzie wowɔa dɔ le.

## Unique variants

variant-num-to-select-not-non-negative-integer = mate ŋu akpɔ { $component } ƒe nɔnɔme tɔxɛwo o elabena numToSelect menye xexlẽdzesi blibo si menye ɖoɖodzesi o.

variant-num-to-select-not-constant-number = mate ŋu akpɔ { $component } ƒe nɔnɔme tɔxɛwo o elabena numToSelect menye xexlẽdzesi si metrɔna o.

variant-with-replacement-not-constant-boolean = mate ŋu akpɔ { $component } ƒe nɔnɔme tɔxɛwo o elabena withReplacement menye bulian si metrɔna o.

variant-select-weight-disables-unique = Wotsia select ƒe nɔnɔme tɔxɛwo nu ne tiatia aɖe si selectWeight alo selectForVariants li

variant-coprime-undetermined = mate ŋu akpɔ { $component } ƒe nɔnɔme tɔxɛwo o elabena mate ŋu aka ɖe edzi be coprime nye alakpa ɣesiaɣi o.

variant-attribute-not-constant = mate ŋu akpɔ { $component } ƒe nɔnɔme tɔxɛwo o elabena { $attribute } meli ke o.

variant-attribute-not-number = mate ŋu akpɔ { $component } ƒe nɔnɔme tɔxɛwo o elabena { $attribute } menye xexlẽdzesi o.

variant-attribute-wrong-type-for-sequence =
    mate ŋu akpɔ { $component } ƒe { $type } ƒomevi nɔnɔme tɔxɛwo o elabena { $attribute } menye { $expected ->
        [letters-combination] ŋɔŋlɔdzesiwo ƒe ƒoƒuƒu
        [math-expression] akɔntabubu nyagbe si sɔ
        [integer] xexlẽdzesi blibo
       *[number] xexlẽdzesi
    } o.

variant-length-not-integer = mate ŋu akpɔ { $component } ƒe nɔnɔme tɔxɛwo o elabena length menye xexlẽdzesi blibo o.

variant-sort-not-implemented = womewɔ { $component } ƒe nɔnɔme tɔxɛ siwo si sort le haɖe o

variant-exclude-combinations-not-implemented = womewɔ { $component } ƒe nɔnɔme tɔxɛ siwo si excludeCombinations le haɖe o

variant-math-exclude-not-implemented = womewɔ { $component } ƒe math ƒomevi nɔnɔme tɔxɛ siwo si exclude le haɖe o

variant-non-constant-exclude-not-implemented = womewɔ { $component } ƒe nɔnɔme tɔxɛ siwo si exclude si meli ke o le haɖe o

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: graph prefigure kpɔla la mexɔnɛ o; woto dzidzimevia dzi.

prefigure-descendant-invalid-geometry = { $subject }: nudidi si nu meli na o alo si mede blibo o; woto dzidzimevia dzi.

prefigure-curve-label-omitted = { $subject }: ŋkɔwo mewɔa dɔ le fli gobɛ nu siwo wotrɔ la dzi o; woɖe asi le ŋkɔa ŋu.

prefigure-curve-unsupported-definition-type = { $subject }: fli gobɛ dɔwɔfia ƒe gɔmeɖeɖe ƒomevi '{ $definitionType }' mexɔ o; woto dzidzimevia dzi.

prefigure-region-flip-functions-unsupported = { $subject }: nɔnɔme flipFunctions si le regionBetweenCurves dzi la mexɔ o; woto dzidzimevia dzi.

prefigure-region-non-formula-child = { $subject }: formula ƒomevi vi dɔwɔfiawo koe woxɔna le regionBetweenCurves me; woto dzidzimevia dzi.

prefigure-label-position-unsupported =
    { $subject }: labelPosition '{ $labelPosition }' mexɔ na { $labelKind ->
        [line-family] fli ƒomea ƒe ŋkɔ
       *[point] nɔƒe ƒe ŋkɔ
    } o; PreFigure ƒe ɖoɖo si li xoxo dzie wowɔ dɔ le.

prefigure-fill-style-unsupported = { $subject }: PreFigure mexɔa yɔyɔ nɔnɔme '{ $fillStyle }' o; egatrɔ yi amadede ɖeka ƒe yɔyɔ dzi.

prefigure-line-style-unknown = { $subject }: womenya fli nɔnɔme '{ $lineStyle }' o eye woɖe asi le eŋu le PreFigure ƒe dɔwɔwɔ me.

prefigure-marker-style-mapped-to-diamond = { $subject }: wotsɔ dzesi nɔnɔme '{ $markerStyle }' sɔ kple PreFigure ƒe nɔnɔme 'diamond'.

prefigure-marker-style-unsupported = { $subject }: PreFigure mexɔa dzesi nɔnɔme '{ $markerStyle }' o; nɔnɔme si li xoxo dzie wowɔ dɔ le.

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` mesɔ o; mate ŋu akpɔ taɖodzinua o. Woɖe asi le ŋkuɖodzinua ŋu.

annotation-ref-multiple-targets = `<annotation>`: `ref` ɖo taɖodzinu geɖe; taɖodzinu gbãtɔ dzie wowɔ dɔ le.

annotation-ref-outside-graph = `<annotation>`: `ref` mesɔ o; taɖodzinua le graf si lée ɖe asi la godo. Woɖe asi le ŋkuɖodzinua ŋu.

annotation-ref-unsupported-target = `<annotation>`: `ref` mesɔ o; taɖodzinua menye nɔnɔmetata nu si woxɔna le prefigure tɔtrɔ me o. Woɖe asi le ŋkuɖodzinua ŋu.

annotation-text-missing = `<annotation>`: `text` meli o alo ƒuƒlu wònye; nuŋɔŋlɔ ƒuƒlue wodo goe.

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] Wokpɔ nɔnɔ-ɖe-nɔewo-dzi gogloe.
       *[other] Wokpɔ nɔnɔ-ɖe-nɔewo-dzi gogloe si ku ɖe nu `<{ $componentType }>` ŋu.
    }

reference-no-referent = Womekpɔ naneke na asifiafia sia o: `{ $reference }`

reference-multiple-referents = Wokpɔ nu geɖe na asifiafia sia: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = Ɖoɖoa mesɔ na `<{ $componentType }>` ƒe nɔnɔme { $attribute } o.

children-invalid = Viawo mesɔ na `<{ $componentType }>` o: Wokpɔ vi siwo mesɔ o: { $children }

## Falling back to a default

attribute-value-invalid-using-default = Home `{ $value }` mesɔ na nɔnɔme `{ $attribute }` o, home `{ $default }` dzie wowɔ dɔ le

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] Womekpɔ DoenetML tata { $version } o.
       *[other] Womekpɔ DoenetML tata { $version } o. Egatrɔ yi tata { $fallback } dzi
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML mesɔ o: { $content }

parse-tag-missing-close-tag = DoenetML mesɔ o: Tugbaɖoɖo tagi mele `{ $tag }` ŋu o. Wokpɔ mɔ na tagi si tua eɖokui alo tagi `</{ $tagName }>`.

parse-tag-error = DoenetML mesɔ o: Vodada le tagi `<{ $tagName }>` me

parse-attribute-missing-value = DoenetML mesɔ o: Edze abe home mele nɔnɔme `{ $attribute }` si mesɔ o la ŋu o ene.

parse-attribute-invalid = DoenetML mesɔ o: Nɔnɔme `{ $attribute }` mesɔ o

parse-attribute-value-invalid = DoenetML mesɔ o: Nɔnɔme ƒe home `{ $value }` mesɔ o

parse-attribute-value-quote-mismatch = DoenetML mesɔ o: Nɔnɔme ƒe home `{ $value }` mesɔ o. Nyagbɔgblɔ dzesiawo mesɔ o. Edze abe `{ $quote }` bu ene

parse-open-tag-name-missing = DoenetML mesɔ o: Wokpɔ tagi si si ŋkɔ mele o, abe `<` ene

parse-tag-not-closed = DoenetML mesɔ o: Wometu tagi `{ $tag }` nu o (edze abe `>` bu ene).

parse-self-closing-tag-name-missing = DoenetML mesɔ o: Wokpɔ tagi si si ŋkɔ mele o `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML mesɔ o: Wometu tagi `{ $tag }` nu o (edze abe `/>` bu ene).

parse-tag-invalid-attributes = DoenetML mesɔ o: Tagi `{ $tag }` mesɔ o. Ɖewohĩ nɔnɔme siwo mesɔ o le eŋu.

parse-close-tag-name-missing = DoenetML mesɔ o: Wokpɔ tugbaɖoɖo tagi si si ŋkɔ mele o, abe `</` ene

parse-attribute-value-unquoted = Ele be nɔnɔme ƒe homewo nanɔ nyagbɔgblɔ dzesiwo dome: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML mesɔ o: Wokpɔ tugbaɖoɖo tagi `{ $tag }`, gake ʋuʋu tagi si sɔ kplii meli o

parse-close-tag-mismatched = DoenetML mesɔ o: Tugbaɖoɖo tagi la mesɔ o. Wokpɔ mɔ na `</{ $expected }>`. Wokpɔ `{ $found }`

parser-node-unconvertible = Womete ŋu trɔ nɔdi { $node } wòzu Dast nɔdi o.

## Names

name-attribute-invalid =
    Nɔnɔme name='{ $name }' mesɔ o. { $reason ->
        [characters] Ŋkɔwo ate ŋu anye ŋɔŋlɔdzesiwo, xexlẽdzesiwo, ete fliwo alo fliwo ko.
       *[start] Ele be ŋkɔwo nadze egɔme kple ŋɔŋlɔdzesi.
    }

component-name-invalid-start = Nu ƒe ŋkɔ "{ $name }" mesɔ o. Ele be ŋkɔwo nadze egɔme kple ŋɔŋlɔdzesi.

## `<answer>` sugar

answer-video-watched-missing-video = Ele be nɔnɔme video nanɔ videoWatched ƒomevi ŋuɖoɖo ŋu

answer-video-watched-video-not-reference = Ele be nɔnɔme video si nye asifiafia nanɔ videoWatched ƒomevi ŋuɖoɖo ŋu

answer-name-not-single-text = Ele be text vi ɖeka pɛ ko nanɔ ŋuɖoɖo ƒe nɔnɔme name ŋu

## Referencing another document

external-doenetml-recursion-limit = Mate ŋu axɔ gota DoenetML o elabena egbugbɔ ɖe eɖokui dzi zi geɖe akpa. Ɖe asifiafia gogloe aɖe li mahã?

external-doenetml-unavailable = Mate ŋu axɔ DoenetML tso { $attribute }="{ $uri }" o

external-doenetml-type-mismatch = DoenetML si woxɔ tso { $attribute }="{ $uri }" la mesɔ o: mesɔ kple nu ƒomevi "{ $componentType }" o

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] Nɔnɔme `{ $from }` do xoxo; zã `{ $to }` boŋ.
       *[other] [deprecation] Nɔnɔme `{ $from }` si le `<{ $component }>` dzi la do xoxo; zã `{ $to }` boŋ.
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] Nɔnɔme `{ $from }` do xoxo eye womebua eŋu o elabena woɖo `{ $to }` hã.
       *[other] [deprecation] Nɔnɔme `{ $from }` si le `<{ $component }>` dzi la do xoxo eye womebua eŋu o elabena woɖo `{ $to }` hã.
    }

deprecated-attribute-ignored = [deprecation] Nɔnɔme `{ $attribute }` si le `<{ $component }>` dzi la do xoxo eye womebua eŋu o.

deprecated-attribute-to-child = [deprecation] Nɔnɔme `{ $attribute }` si le `<{ $component }>` dzi la do xoxo; zã `<{ $child }>` vi la boŋ.


## Language coverage

pluralize-english-only = `<pluralize>` ate ŋu awɔ agbɔsɔsɔ le Eŋlisigbe me ko, eya ta eƒe nuŋɔŋlɔ tsi anyi abe ale si wòle ene le agbalẽ si woŋlɔ le { $locale } me la me. Ŋlɔ agbɔsɔsɔ ƒe nɔnɔmea ŋutɔ, alo tsɔe da ɖe nɔnɔme `pluralForm` me.


## Checking against the schema

schema-element-unrecognized = Nu `<{ $tag }>` menye Doenet nu si wonya o.

schema-element-not-allowed-at-root = Womeɖe mɔ na nu `<{ $tag }>` le agbalẽa ƒe kegli dzi o.

schema-element-not-allowed-inside = Womeɖe mɔ na nu `<{ $tag }>` le `<{ $parent }>` me o.

schema-attribute-unrecognized = Nɔnɔme si ŋkɔe nye `{ $attribute }` mele nu `<{ $tag }>` si o.

schema-attribute-value-not-allowed =
    { $isList ->
        [true] Ele be nu `<{ $tag }>` ƒe nɔnɔme `{ $attribute }` nanye nuŋɔŋlɔ si me nu ɖe sia ɖe nye esiawo dometɔ ɖeka: { $allowed }
       *[other] Ele be nu `<{ $tag }>` ƒe nɔnɔme `{ $attribute }` nanye esiawo dometɔ ɖeka: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = Nɔnɔmea ƒe ŋkɔ mesɔ na select o. Nɔnɔme ƒe ŋkɔ { $variantName } dze le tiatia { $numOptions } me gake agbɔsɔsɔ si woatia nye { $numToSelect }.

select-variant-name-without-options = Woɖo nɔnɔme aɖewo na select gake womeɖo tiatia aɖeke na nɔnɔme ƒe ŋkɔ si ate ŋu ava o: { $variantName }.

select-variant-name-not-possible = Nɔnɔme ƒe ŋkɔ { $variantName } si woɖo na select la menye nɔnɔme ƒe ŋkɔ si ate ŋu ava o.

select-too-few-options = Mate ŋu atia nu { $numToSelect } le { $numOptions } ko me o.

select-from-sequence-too-few-values = Mate ŋu atia home { $numToSelect } le ɖoɖo si ƒe didime nye { $length } me o.

select-from-sequence-indices-count-mismatch = Ele be indɛks siwo woɖo na select ƒe agbɔsɔsɔ nasɔ kple agbɔsɔsɔ si woatia

select-from-sequence-indices-not-integers = Ele be indɛks siwo katã woɖo na select nanye xexlẽdzesi blibowo

select-from-sequence-index-excluded = Woɖo selectfromsequence indɛks si woɖe ɖa

select-from-sequence-indices-excluded-combination = Woɖo selectfromsequence indɛks siwo nye ƒoƒu si woɖe ɖa

select-from-sequence-coprime-not-positive-integers = Mate ŋu atia xexlẽdzesi siwo mema wo nɔewo o ƒe ƒoƒuwo o elabena menye xexlẽdzesi blibo nyuiwo wole tiam o.

select-from-sequence-coprime-common-factor = Mate ŋu atia xexlẽdzesi siwo mema wo nɔewo o. Nu ɖeka mã home siwo katã ate ŋu ava. (Ele be home siwo woɖo na "from" alo "to" la nagbe "step" mama.)

select-from-sequence-coprime-single-number = Mate ŋu atia xexlẽdzesi siwo mema wo nɔewo o ƒe ƒoƒuwo tso xexlẽdzesi ɖeka si menye 1 o me o.

select-from-sequence-excluded-too-many-combinations = Woɖe ƒoƒuawo ƒe akpa 70% wu ɖa le selectFromSequence me

select-from-sequence-coprime-none-found = Womete ŋu tia xexlẽdzesi siwo mema wo nɔewo o o. Nu ɖeka mã home siwo katã ate ŋu ava.

select-from-sequence-too-few-unique-values = Mate ŋu atia home tɔxɛ { $numToSelect } le ɖoɖo si ƒe didime nye { $numPossibleValues } me o

select-prime-numbers-too-few-values = Mate ŋu atia home { $numToSelect } le xexlẽdzesi mamamawo ƒe nuŋɔŋlɔ si ƒe didime nye { $numValues } me o

select-prime-numbers-values-count-mismatch = Ele be home siwo woɖo na select ƒe agbɔsɔsɔ nasɔ kple agbɔsɔsɔ si woatia

select-prime-numbers-values-not-prime = Ele be home siwo katã woɖo na select prime number nanɔ xexlẽdzesi mamamawo ƒe nuŋɔŋlɔ la me

select-prime-numbers-values-excluded-combination = Home siwo woɖo na selectPrimeNumbers la nye ƒoƒu si woɖe ɖa

select-prime-numbers-excluded-too-many-combinations = Woɖe ƒoƒuawo ƒe akpa 70% wu ɖa le selectPrimeNumbers me

select-random-combination-fluke = Le nu si medzɔna zi geɖe o ta la, womete ŋu tia home tiatiamanɔmee ƒe ƒoƒu o

select-random-value-fluke = Le nu si medzɔna zi geɖe o ta la, womete ŋu tia home tiatiamanɔmee o
