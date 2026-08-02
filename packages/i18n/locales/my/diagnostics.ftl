# Burmese diagnostics. Translated from `locales/en/diagnostics.ftl`, which is
# the source of truth.
#
# Message ids are never translated — only the text to the right of `=`.
#
# UNREVIEWED SEED. Machine-generated, pending review by a speaker (#1521).
# Correct anything here freely; nothing in it was written by a translator.
#
# Translators: `through`, `endpoint`, `midpointOffset`, `numDimensions` and the
# like are DoenetML attribute names. They are part of the language, not prose,
# and are left in English exactly as written, as are tag names, attribute
# values and anything quoted back from the author's own source.
#
# Burmese has a single plural category, so a plural selector is written with
# its default variant alone. This file is Unicode, not Zawgyi.


## `<lineSegment>`

line-segment-attributes-ignored-with-endpoints =
    { $attributesCount ->
       *[other] အစွန်းအမှတ် နှစ်ခု သတ်မှတ်ထားလျှင် { $attributes } ကို လျစ်လျူရှုသည်
    }

line-segment-attributes-ignored-with-endpoint-and-midpoint =
    { $attributesCount ->
       *[other] အစွန်းအမှတ်တစ်ခုနှင့် အလယ်အမှတ်တစ်ခု နှစ်ခုစလုံး သတ်မှတ်ထားလျှင် { $attributes } ကို လျစ်လျူရှုသည်
    }

line-segment-midpoint-offset-without-midpoint = အလယ်အမှတ်မပါဘဲ midpointOffset သည် အကျိုးသက်ရောက်မှု မရှိပါ

## `<line>`

line-points-undetermined-dimensions = မဆုံးဖြတ်ရသေးသော ဒိုင်းမင်းရှင်းရှိ အမှတ်များကို ဖြတ်သွားသော မျဉ်း။

line-points-too-few-dimensions = မျဉ်းသည် အနည်းဆုံး ဒိုင်းမင်းရှင်း နှစ်ခုရှိ အမှတ်များကို ဖြတ်သွားရမည်။

line-points-depend-on-variables = မျဉ်းသည် အပြောင်းအလဲများပေါ် မူတည်သော အမှတ်များကို ဖြတ်သွားသည်: { $variables }။

line-equation-invalid-format = { $variable1 } နှင့် { $variable2 } အပြောင်းအလဲများဖြင့် မျဉ်း၏ ညီမျှခြင်း ပုံစံ မမှန်ကန်ပါ။

## `<ray>`

ray-overprescribed-through = မျဉ်းခြမ်းကို through၊ endpoint နှင့် direction ဖြင့် သတ်မှတ်ထားသည်။  သတ်မှတ်ထားသော through ကို လျစ်လျူရှုသည်။

ray-dimension-mismatch = မျဉ်းခြမ်းတွင် numDimensions မကိုက်ညီပါ။

## `<vector>`

vector-overprescribed-head = ဗက်တာကို head၊ tail နှင့် displacement ဖြင့် သတ်မှတ်ထားသည်။  သတ်မှတ်ထားသော head ကို လျစ်လျူရှုသည်။

vector-dimension-mismatch = ဗက်တာတွင် numDimensions မကိုက်ညီပါ။

## Attracting and constraining

attract-to-without-nearest-point = `<{ $component }>` ဆီသို့ ဆွဲဆောင်၍ မရပါ၊ အဘယ်ကြောင့်ဆိုသော် ၎င်းတွင် nearestPoint စတိတ်အပြောင်းအလဲ မရှိပါ။

constrain-to-without-nearest-point = `<{ $component }>` အပေါ် ကန့်သတ်၍ မရပါ၊ အဘယ်ကြောင့်ဆိုသော် ၎င်းတွင် nearestPoint စတိတ်အပြောင်းအလဲ မရှိပါ။

constrain-to-interior-without-nearest-point = `<{ $component }>` ၏ အတွင်းပိုင်းတွင် ကန့်သတ်၍ မရပါ၊ အဘယ်ကြောင့်ဆိုသော် ၎င်းတွင် nearestPoint စတိတ်အပြောင်းအလဲ မရှိပါ။

## `<choiceInput>`

choice-input-label-position-ignored = အင်လိုင်း မဟုတ်သော choiceInput အတွက် labelPosition ကို လျစ်လျူရှုသည်

## Ordering children by index

choice-input-indices-count-mismatch = choiceInput အတွက် သတ်မှတ်ထားသော အညွှန်းများကို လျစ်လျူရှုသည်၊ အညွှန်းအရေအတွက်သည် choice သားသမီးအရေအတွက်နှင့် မကိုက်ညီသောကြောင့် ဖြစ်သည်။

pretzel-indices-count-mismatch = problem အတွက် သတ်မှတ်ထားသော အညွှန်းများကို လျစ်လျူရှုသည်၊ အညွှန်းအရေအတွက်သည် problem သားသမီးအရေအတွက်နှင့် မကိုက်ညီသောကြောင့် ဖြစ်သည်။

shuffle-indices-count-mismatch = shuffle အတွက် သတ်မှတ်ထားသော အညွှန်းများကို လျစ်လျူရှုသည်၊ အညွှန်းအရေအတွက်သည် အစိတ်အပိုင်းအရေအတွက်နှင့် မကိုက်ညီသောကြောင့် ဖြစ်သည်။

indices-ignored-out-of-range = { $component } အတွက် သတ်မှတ်ထားသော အညွှန်းများကို လျစ်လျူရှုသည်၊ အချို့အညွှန်းများ အကွာအဝေးပြင်ပတွင် ရှိသောကြောင့် ဖြစ်သည်။

pretzel-indices-repeated = pretzel အတွက် သတ်မှတ်ထားသော အညွှန်းများကို လျစ်လျူရှုသည်၊ အချို့အညွှန်းများ ထပ်နေသောကြောင့် ဖြစ်သည်။

pretzel-circuit-first-index = circuit မုဒ်တွင် pretzel အတွက် သတ်မှတ်ထားသော အညွှန်းများကို လျစ်လျူရှုသည်၊ ပထမအညွှန်းသည် 1 ဖြစ်ရမည် ဖြစ်သောကြောင့်။

## `<shuffle>` and `<sort>`

string-children-need-type = `<{ $component }>` သည် စထရင်းသားသမီးများနှင့် အလုပ်လုပ်ရန် `type` အက်ထရီဗျုစ် သတ်မှတ်ရမည်။

invalid-type-defaulting-to-math = { $component } အစိတ်အပိုင်းအတွက် { $type } အမျိုးအစား မမှန်ကန်ပါ။ math၊ text၊ number သို့မဟုတ် boolean တစ်ခုခု ဖြစ်ရမည်။ math ဟု ယူဆသည်။

string-not-valid-component-to-arrange = "{ $value }" စထရင်းသည် { $component } လုပ်ရန် မှန်ကန်သော အစိတ်အပိုင်း မဟုတ်ပါ။ လျစ်လျူရှုသည်။

## Types and variables

invalid-type-defaulting-to-number = { $type } အမျိုးအစား မမှန်ကန်ပါ၊ အမျိုးအစားကို number အဖြစ် သတ်မှတ်သည်။

invalid-variable-value = အပြောင်းအလဲတစ်ခု၏ တန်ဖိုး မမှန်ကန်ပါ: `{ $value }`

## Variants

variant-index-must-be-number = မူကွဲအညွှန်း { $index } သည် ကိန်းဂဏန်း ဖြစ်ရမည်

variant-index-must-be-integer = မူကွဲအညွှန်း { $index } သည် ကိန်းပြည့် ဖြစ်ရမည်

## `<sideBySide>`

side-by-side-absolute-widths = ပကတိအတိုင်းအတာများအတွက် `<{ $component }>` ကို မဆောင်ရွက်ရသေးပါ။ အကျယ်ကို နှိုင်းရအဖြစ် သတ်မှတ်သည်။

side-by-side-absolute-margins = ပကတိအတိုင်းအတာများအတွက် `<{ $component }>` ကို မဆောင်ရွက်ရသေးပါ။ အနားသတ်များကို နှိုင်းရအဖြစ် သတ်မှတ်သည်။

side-by-side-no-block-child = `<{ $component }>` မမှန်ကန်ပါ: ၎င်းတွင် အနည်းဆုံး ဘလောက်သားသမီး တစ်ခု ရှိရမည်။

## `<label>`

label-for-ignored-on-graphical = ဂရပ်ဖစ် `<label>` ပေါ်ရှိ `for` အက်ထရီဗျုစ်ကို လျစ်လျူရှုသည်။

label-for-must-resolve-to-one = `<label>` ပေါ်ရှိ `for` အက်ထရီဗျုစ်သည် အစိတ်အပိုင်း တစ်ခုတည်းသို့ ဆုံးဖြတ်ရမည်။

label-for-unresolved = `<label>` ပေါ်ရှိ `for` အက်ထရီဗျုစ်ကို မည်သည့်အစိတ်အပိုင်းသို့မျှ မဆုံးဖြတ်နိုင်ပါ။

label-for-answer-with-authored-inputs = `<label>` ပေါ်ရှိ `for` အက်ထရီဗျုစ်သည် ထည့်သွင်းမှုများကို သီးခြားရေးထားသော `<answer>` ကို ရည်ညွှန်းသည်; ထိုထည့်သွင်းမှုကို တိုက်ရိုက် ရည်ညွှန်းပါ။

label-for-answer-without-input = `<label>` ပေါ်ရှိ `for` အက်ထရီဗျုစ်သည် အညွှန်းတပ်စရာ ထည့်သွင်းမှု မရှိသော `<answer>` ကို ရည်ညွှန်းသည်။

label-for-must-reference-input-or-answer = `<label>` ပေါ်ရှိ `for` အက်ထရီဗျုစ်သည် ထည့်သွင်းမှုတစ်ခု သို့မဟုတ် answer တစ်ခုကို ရည်ညွှန်းရမည်။

## Accessibility

accessibility-short-description-or-decorative = အသုံးပြုနိုင်စွမ်းအတွက် `<{ $component }>` တွင် အကျဉ်းချုပ်ဖော်ပြချက် ရှိရမည် သို့မဟုတ် အလှဆင်ရန်အဖြစ် သတ်မှတ်ရမည်။

accessibility-video-short-description = အသုံးပြုနိုင်စွမ်းအတွက် `<video>` တွင် အကျဉ်းချုပ်ဖော်ပြချက် ရှိရမည်။

accessibility-input-short-description-or-label = အသုံးပြုနိုင်စွမ်းအတွက် `<{ $component }>` တွင် အကျဉ်းချုပ်ဖော်ပြချက် သို့မဟုတ် အညွှန်း ရှိရမည်။

accessibility-answer-input-short-description-or-label = အသုံးပြုနိုင်စွမ်းအတွက် ထည့်သွင်းမှုတစ်ခု ဖန်တီးသော `<answer>` တွင် အကျဉ်းချုပ်ဖော်ပြချက် သို့မဟုတ် အညွှန်း ရှိရမည်။

accessibility-short-description-contains-math = အကျဉ်းချုပ်ဖော်ပြချက်များတွင် `<{ $component }>` ကဲ့သို့ သင်္ချာအစိတ်အပိုင်းများ မပါသင့်ပါ။ သင်္ချာမှန်သမျှကို စကားလုံးဖြင့် ရေးပါ။

accessibility-section-title-insufficient-contrast =
    { $mode ->
        [dark] ကဏ္ဍခေါင်းစဉ် စာသားအတွက် { $colorName } ၏ ကွာခြားချက် မလုံလောက်ပါ (အမှောင်မုဒ်) ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; အနည်းဆုံး { $threshold }:1 လိုအပ်သည်)။
       *[other] ကဏ္ဍခေါင်းစဉ် စာသားအတွက် { $colorName } ၏ ကွာခြားချက် မလုံလောက်ပါ ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; အနည်းဆုံး { $threshold }:1 လိုအပ်သည်)။
    }

## `<circle>`

circle-through-points-non-numerical = အမှတ်များတွင် ကိန်းဂဏန်းတန်ဖိုး မရှိသည့်အခါ အမှတ် { $count } ခုကို ဖြတ်သွားသော `<circle>` ကို မဆောင်ရွက်ရသေးပါ။

circle-too-many-through-points = အမှတ် 3 ခုထက်ပို၍ ဖြတ်သွားသော စက်ဝိုင်းကို မတွက်ချက်နိုင်ပါ။

circle-overprescribed-radius-center-points = သတ်မှတ်ထားသော အချင်းဝက်၊ ဗဟိုနှင့် ဖြတ်သွားသောအမှတ်များဖြင့် စက်ဝိုင်းကို မတွက်ချက်နိုင်ပါ။

circle-center-with-multiple-points = သတ်မှတ်ထားသော ဗဟိုနှင့် အမှတ် 1 ခုထက်ပို၍ ဖြတ်သွားသော စက်ဝိုင်းကို မတွက်ချက်နိုင်ပါ။

circle-radius-too-small = စက်ဝိုင်းကို မတွက်ချက်နိုင်ပါ: အမှတ်နှစ်ခုကြား အကွာအဝေးသည် { $distance } ဖြစ်သဖြင့် သတ်မှတ်ထားသော အချင်းဝက် { $radius } သည် သေးလွန်းသည်။

circle-radius-with-many-points = သတ်မှတ်ထားသော အချင်းဝက်ဖြင့် အမှတ်နှစ်ခုထက်ပို၍ ဖြတ်သွားသော စက်ဝိုင်းကို မဖန်တီးနိုင်ပါ။

circle-invalid-center-or-through-points = စက်ဝိုင်း၏ ဗဟို သို့မဟုတ် ဖြတ်သွားသောအမှတ်များ မမှန်ကန်ပါ။

circle-radius-center-with-multiple-points = သတ်မှတ်ထားသော ဗဟိုနှင့် အမှတ် 1 ခုထက်ပို၍ ဖြတ်သွားသော စက်ဝိုင်း၏ အချင်းဝက်ကို မတွက်ချက်နိုင်ပါ။

circle-change-radius-non-numerical = ကိန်းဂဏန်းမဟုတ်သော ဖြတ်သွားသောအမှတ်များပါသည့် စက်ဝိုင်း၏ အချင်းဝက်ကို မပြောင်းနိုင်ပါ

circle-radius-with-points-non-numerical = ကိန်းဂဏန်းတန်ဖိုးများ မရှိသည့်အခါ သတ်မှတ်ထားသော အချင်းဝက်ဖြင့် အမှတ်တစ်ခုထက်ပို၍ ဖြတ်သွားသော စက်ဝိုင်းကို မဖန်တီးနိုင်ပါ။

circle-change-center-non-numerical = ကိန်းဂဏန်းမဟုတ်သော အမှတ်များကို ဖြတ်သွားသော စက်ဝိုင်း၏ ဗဟိုကို ပြောင်းခြင်းကို မဆောင်ရွက်ရသေးပါ။

## `<function>`

function-domain-insufficient-dimensions =
    { $intervals ->
       *[other] ဖန်ရှင်၏ ဒိုမိန်းအတွက် ဒိုင်းမင်းရှင်း မလုံလောက်ပါ။ ဒိုမိန်းတွင် ကြားကာလ { $intervals } ခု ရှိသော်လည်း ဖန်ရှင်တွင် { $inputs ->
           *[other] ထည့်သွင်းမှု { $inputs } ခု
        } ရှိသည်။
    }

function-domain-invalid-format = ဖန်ရှင်၏ ဒိုမိန်း ပုံစံ မမှန်ကန်ပါ။

function-ignoring-non-numerical =
    { $type ->
        [maximum] ဖန်ရှင်၏ ကိန်းဂဏန်းမဟုတ်သော အမြင့်ဆုံးတန်ဖိုးကို လျစ်လျူရှုသည်။
        [minimum] ဖန်ရှင်၏ ကိန်းဂဏန်းမဟုတ်သော အနိမ့်ဆုံးတန်ဖိုးကို လျစ်လျူရှုသည်။
        [extremum] ဖန်ရှင်၏ ကိန်းဂဏန်းမဟုတ်သော အစွန်းရောက်တန်ဖိုးကို လျစ်လျူရှုသည်။
        [point] ဖန်ရှင်၏ ကိန်းဂဏန်းမဟုတ်သော အမှတ်ကို လျစ်လျူရှုသည်။
        [slope] ဖန်ရှင်၏ ကိန်းဂဏန်းမဟုတ်သော လျှောစောက်ကို လျစ်လျူရှုသည်။
       *[other] ဖန်ရှင်၏ ကိန်းဂဏန်းမဟုတ်သော { $type } ကို လျစ်လျူရှုသည်။
    }

function-ignoring-empty =
    { $type ->
        [maximum] ဖန်ရှင်၏ အလွတ် အမြင့်ဆုံးတန်ဖိုးကို လျစ်လျူရှုသည်။
        [minimum] ဖန်ရှင်၏ အလွတ် အနိမ့်ဆုံးတန်ဖိုးကို လျစ်လျူရှုသည်။
        [extremum] ဖန်ရှင်၏ အလွတ် အစွန်းရောက်တန်ဖိုးကို လျစ်လျူရှုသည်။
        [point] ဖန်ရှင်၏ အလွတ် အမှတ်ကို လျစ်လျူရှုသည်။
       *[other] ဖန်ရှင်၏ အလွတ် { $type } ကို လျစ်လျူရှုသည်။
    }

function-points-too-close = ဖန်ရှင်တွင် အမှတ်နှစ်ခု၏ တည်နေရာများ နီးလွန်းသည်။ ဖန်ရှင်ကို မသတ်မှတ်နိုင်ပါ။

function-iterates-input-output-mismatch =
    { $inputs ->
       *[other] ဖန်ရှင်၏ ထည့်သွင်းမှုအရေအတွက်နှင့် ထုတ်ပေးမှုအရေအတွက် တူညီမှသာ ဖန်ရှင် ထပ်ခါတလဲလဲလုပ်ခြင်း ဖြစ်နိုင်သည်။ ဤဖန်ရှင်တွင် ထည့်သွင်းမှု { $inputs } ခုနှင့် { $outputs ->
           *[other] ထုတ်ပေးမှု { $outputs } ခု
        } ရှိသည်။
    }

## `<sequence>`

sequence-invalid-length = အစဉ်လိုက်၏ အရှည် မမှန်ကန်ပါ။  အနုတ်မဟုတ်သော ကိန်းပြည့် ဖြစ်ရမည်။

sequence-invalid-step = အစဉ်လိုက်၏ အဆင့် မမှန်ကန်ပါ။  { $type } အမျိုးအစား အစဉ်လိုက်အတွက် ကိန်းဂဏန်း ဖြစ်ရမည်။

sequence-invalid-endpoint-number = ကိန်းဂဏန်း အစဉ်လိုက်၏ "{ $attribute }" မမှန်ကန်ပါ။  ကိန်းဂဏန်း ဖြစ်ရမည်။

sequence-invalid-endpoint-letters = အက္ခရာ အစဉ်လိုက်၏ "{ $attribute }" မမှန်ကန်ပါ။  အက္ခရာပေါင်းစပ်မှု ဖြစ်ရမည်။

sequence-invalid-endpoint = အစဉ်လိုက်၏ "{ $attribute }" မမှန်ကန်ပါ။

select-from-sequence-coprime-not-numbers = ကိန်းဂဏန်းများ မရွေးချယ်သောကြောင့် coprime ကို လျစ်လျူရှုသည်

select-from-sequence-coprime-with-exclude-combinations = excludeCombinations သတ်မှတ်ထားသောကြောင့် coprime ကို လျစ်လျူရှုသည်

## Resolving a `target`

target-not-found = `<{ $source }>` အတွက် target မမှန်ကန်ပါ: ပစ်မှတ်ကို မတွေ့ပါ။

target-state-variable-not-found = `<{ $source }>` အတွက် target မမှန်ကန်ပါ: `<{ $component }>` တွင် "{ $property }" အမည်ရှိ စတိတ်အပြောင်းအလဲကို မတွေ့ပါ။

## `<odeSystem>`

ode-system-variables-match-independent = `<odeSystem>` ၏ အပြောင်းအလဲများသည် လွတ်လပ်အပြောင်းအလဲနှင့် ကွဲပြားရမည်။

ode-system-duplicate-variable-names = ထပ်နေသော မှီခိုအပြောင်းအလဲအမည်များဖြင့် ODE RHS ဖန်ရှင်များကို မသတ်မှတ်နိုင်ပါ။

ode-system-rhs-function-error = ODE RHS ဖန်ရှင်ကို မသတ်မှတ်နိုင်ပါ။  mathjs ဖန်ရှင် ဖန်တီးရာတွင် အမှား။

## `<angle>`, `<parabola>`, and `<intersection>`

angle-too-many-lines = မျဉ်း { $count } ခုကြား ထောင့်ကို မသတ်မှတ်နိုင်ပါ

angle-invalid-through-point = `<angle>` ၏ through တွင် အမှတ် မမှန်ကန်ပါ

parabola-vertex-too-many-points = ထိပ်အမှတ်နှင့်အတူ အမှတ် 1 ခုထက်ပို၍ ဖြတ်သွားသော ပါရာဘိုလာကို မဆောင်ရွက်ရသေးပါ။

parabola-too-many-points = အမှတ် 3 ခုထက်ပို၍ ဖြတ်သွားသော ပါရာဘိုလာကို မဆောင်ရွက်ရသေးပါ။

intersection-too-many-items = အရာနှစ်ခုထက်ပိုသော ဖြတ်ခြင်းကို မဆောင်ရွက်ရသေးပါ

## Other math components

ionic-compound-not-two-ions = အိုင်သွန်နှစ်ခုမှလွဲ၍ အခြားမည်သည့်အရာအတွက်မျှ အိုင်သွန်ဒြပ်ပေါင်းကို မဆောင်ရွက်ရသေးပါ။

ionic-compound-needs-cation-and-anion = အိုင်သွန်ဒြပ်ပေါင်းကို ကက်သိုင်းတစ်ခုနှင့် အနိုင်းတစ်ခုအတွက်သာ ဆောင်ရွက်ထားသည်။

solve-equations-cannot-evaluate = ညီမျှခြင်း၏ တန်ဖိုးကို မတွက်ချက်နိုင်သဖြင့် မဖြေရှင်းနိုင်ပါ: { $equation }

math-operators-operand-number-required = သင်္ချာအော်ပရန်တစ်ခု ထုတ်ယူသည့်အခါ operandNumber သတ်မှတ်ရမည်။

eigen-decomposition-failed = မက်ထရစ်၏ အိုင်ဂင်တန်ဖိုးများကို မတွက်ချက်နိုင်ပါ

## `<matchesPattern>`

matches-pattern-parameter-not-in-pattern =
    { $parametersCount ->
       *[other] `<matchesPattern>`: { $parameters } ပါရာမီတာများသည် ပုံစံတွင် မပါဝင်သဖြင့် အမြဲတမ်း အလွတ်တစ်ခုနှင့်သာ ကိုက်ညီမည်။
    }

## `<graph>`

graph-grid-invalid = `<graph>`: grid="{ $grid }" ကို နားမလည်ပါ။ ၎င်းသည် none၊ medium၊ dense သို့မဟုတ် နေရာလွတ်တစ်ခုဖြင့် ခြားထားသော အပေါင်းကိန်းနှစ်ခု ဖြစ်ရမည်၊ ဥပမာ grid="1 0.5"။ ဇယားကွက် မဆွဲပါ။

## PreFigure renderer

prefigure-x-label-position-unsupported = `<graph>`: prefigure ရန်ဒါရာတွင် xLabelPosition="left" ကို မပံ့ပိုးပါ; ညာဘက်အပြုအမူကို သုံးသည်။

prefigure-y-label-position-unsupported = `<graph>`: prefigure ရန်ဒါရာတွင် yLabelPosition="bottom" ကို မပံ့ပိုးပါ; အပေါ်ဘက်အပြုအမူကို သုံးသည်။

prefigure-invalid-axis-bounds = `<graph>`: prefigure ပြောင်းလဲမှုအတွက် ဝင်ရိုးနယ်နိမိတ် မမှန်ကန်ပါ; ပုံသေ bbox (-10,-10,10,10) ကို သုံးသည်။

prefigure-invalid-width = `<graph>`: prefigure ပြောင်းလဲမှုအတွက် အကျယ် မမှန်ကန်ပါ; ပုံသေ ပုံအကျယ် 425 ကို သုံးသည်။

prefigure-invalid-aspect-ratio = `<graph>`: prefigure ပြောင်းလဲမှုအတွက် aspectRatio မမှန်ကန်ပါ; ပုံသေ အချိုး 1 ကို သုံးသည်။

prefigure-grid-spacing-too-fine = `<graph>`: ဝင်ရိုးနယ်နိမိတ်နှင့် နှိုင်းယှဉ်လျှင် ဇယားကွက်အကွာအဝေး သိမ်မွေ့လွန်းသည်; prefigure ရန်ဒါရာတွင် ဇယားကွက်ကို ချန်လှပ်ထားသည်။

prefigure-annotations-not-rendered = `<graph>`: PreFigure ရန်ဒါရာကို မသုံးလျှင် မှတ်ချက်များကို မဖော်ပြပါ။

multiple-annotations-children = `<graph>` တွင် `<annotations>` သားသမီးများစွာ တွေ့ရသည်; နောက်ဆုံးတစ်ခုမှလွဲ၍ အားလုံးကို လျစ်လျူရှုသည်။

## Referring to other components

copy-unrecognized-component-type = မသိသော အစိတ်အပိုင်းအမျိုးအစားကို မတိုးချဲ့နိုင် မကူးယူနိုင်ပါ: { $type }။

copy-prop-not-found = { $component } အမျိုးအစား အစိတ်အပိုင်းတွင် { $property } ပရော့ကို မတွေ့ပါ

collect-no-source = collect အတွက် အရင်းအမြစ် မတွေ့ပါ။

collect-invalid-component-type = `<{ $component }>` အမျိုးအစား အစိတ်အပိုင်းများကို မစုဆောင်းနိုင်ပါ၊ ၎င်းသည် မမှန်ကန်သော အစိတ်အပိုင်းအမျိုးအစား ဖြစ်သောကြောင့်။

reference-index-unavailable = `{ $reference }` အညွှန်းကို မရည်ညွှန်းနိုင်ပါ

## `<callAction>`

component-action-unavailable = `{ $reference }` အစိတ်အပိုင်းတွင် { $action } ကို မခေါ်နိုင်ပါ

## `<dataFrame>`

data-frame-inconsistent-row-lengths = ဒေတာ၏ ပုံသဏ္ဌာန် မမှန်ကန်ပါ။  အတန်းများ၏ အရှည် မညီညွတ်ပါ။ componentIdx :{ $componentIdx } တွင် တွေ့ရသည်

data-frame-duplicate-column-names = ဒေတာတွင် ထပ်နေသော ကော်လံအမည်များ ရှိသည်။  componentIdx :{ $componentIdx } တွင် တွေ့ရသည်

data-frame-missing-column-name = ဒေတာတွင် ကော်လံအမည်တစ်ခု ပျောက်နေသည်။  componentIdx :{ $componentIdx } တွင် တွေ့ရသည်

## `<answer>` and scoring

answer-award-depends-on-own-response = ဤ answer ၏ award တစ်ခုသည် တူညီသော answer တဂ်၏ ကိုယ်ပိုင်တင်သွင်းထားသော အဖြေအပေါ် အခြေခံထားသဖြင့် မမျှော်လင့်သော အပြုအမူကို ဖြစ်စေမည်။

answer-max-num-attempts-in-section-wide-check-work = `sectionWideCheckWork` ပါသော ကွန်တိန်နာအတွင်းရှိ `<answer>` တွင် `maxNumAttempts` သတ်မှတ်ခြင်းသည် အကျိုးသက်ရောက်မှု မရှိပါ၊ ကြိုးစားခွင့်အရေအတွက်ကို ကွန်တိန်နာက ထိန်းချုပ်သောကြောင့် ဖြစ်သည်။ ယင်းအစား ကွန်တိန်နာတွင် `maxNumAttempts` သတ်မှတ်ပါ။

nested-section-wide-check-work-max-num-attempts = `sectionWideCheckWork` ပါသော အခြားကွန်တိန်နာအတွင်းရှိ `sectionWideCheckWork` ကွန်တိန်နာတွင် `maxNumAttempts` သတ်မှတ်ခြင်းသည် အကျိုးသက်ရောက်မှု မရှိပါ၊ ကြိုးစားခွင့်အရေအတွက်ကို အပြင်ဘက်ကွန်တိန်နာက ထိန်းချုပ်သောကြောင့် ဖြစ်သည်။ ယင်းအစား အပြင်ဘက်ကွန်တိန်နာတွင် `maxNumAttempts` သတ်မှတ်ပါ။

answer-attributes-need-symbolic-equality =
    { $attributesCount ->
       *[other] symbolicEquality မသတ်မှတ်ဘဲ { $attributes } အက်ထရီဗျုစ်များသည် အကျိုးသက်ရောက်မှု ရှိမည်မဟုတ်ပါ။
    }

answer-invalid-type = answer အတွက် အမျိုးအစား မမှန်ကန်ပါ: { $type }

## `<module>`, `<conditionalContent>`, `<slider>`, `<pretzel>`

module-attribute-child-needs-name = `<{ $component }>` အစိတ်အပိုင်းတွင် အမည် မရှိသဖြင့် ၎င်းကို module အက်ထရီဗျုစ်အဖြစ် မသုံးနိုင်ပါ

module-attribute-name-already-defined = `<{ $component } name="{ $name }">` အစိတ်အပိုင်းကို module ၏ အက်ထရီဗျုစ်အဖြစ် မသုံးနိုင်ပါ၊ `<module>` အစိတ်အပိုင်းအမျိုးအစားတွင် "{ $name }" အက်ထရီဗျုစ်ကို သတ်မှတ်ပြီး ဖြစ်သောကြောင့်။

conditional-content-condition-ignored = case သို့မဟုတ် else သားသမီးများပါသော `<conditionalContent>` အစိတ်အပိုင်းတွင် `condition` အက်ထရီဗျုစ်ကို လျစ်လျူရှုသည်။

slider-markers-type-mismatch = အမှတ်အသားအမျိုးအစားသည် စလိုက်ဒါအမျိုးအစားနှင့် မကိုက်ညီပါ။

pretzel-problem-needs-statement-and-answer = pretzel မမှန်ကန်ပါ: `<problem>` တစ်ခုစီတွင် `<statement>` တစ်ခုနှင့် `<answer>` တစ်ခု ပါရမည်။

pretzel-circuit-first-problem-distractor = pretzel မမှန်ကန်ပါ: mode="circuit" တွင် ပထမ `<problem>` သည် အာရုံလွှဲစရာ မဖြစ်ရပါ။

## Attribute values

attribute-invalid-values =
    { $valuesCount ->
       *[other] `{ $attribute }` အက်ထရီဗျုစ်အတွက် { $values } တန်ဖိုးများ မမှန်ကန်ပါ; လျစ်လျူရှုသည်။
    }

attribute-must-be-references = `{ $attribute }` အက်ထရီဗျုစ်အတွက် `{ $value }` တန်ဖိုး မမှန်ကန်ပါ။ အက်ထရီဗျုစ်သည် `$` ဖြင့် စတင်သော ရည်ညွှန်းချက်များဖြင့် ဖွဲ့စည်းရမည်။

math-input-invalid-function-names = <mathInput>: { $attribute } တွင် မမှန်ကန်သော ဖန်ရှင်အမည်များကို လျစ်လျူရှုသည်: { $names }။ အမည်တစ်ခုစီ၏ ဖော်ပြသည့်အပိုင်းသည် အနည်းဆုံး အက္ခရာ 2 လုံး (အက္ခရာ သို့မဟုတ် အနုတ်လက္ခဏာ) ရှိရမည်; ထို့နောက် `|<mathspeak alternative>` အပိုင်းကို ရွေးချယ်၍ ထည့်နိုင်သည်။

## Building components from the source

component-type-invalid = အစိတ်အပိုင်းအမျိုးအစား မမှန်ကန်ပါ: `<{ $componentType }>`

attribute-repeated = { $attribute } အက်ထရီဗျုစ်ကို ထပ်၍ မရေးနိုင်ပါ။

attribute-invalid-for-component = `<{ $componentType }>` အမျိုးအစား အစိတ်အပိုင်းအတွက် "{ $attribute }" အက်ထရီဗျုစ် မမှန်ကန်ပါ။

## Style definition contrast

style-definition-insufficient-contrast =
    စတိုင်သတ်မှတ်ချက် { $styleNumber } တွင် { $context ->
        [text-on-background] နောက်ခံအရောင်နှင့် နှိုင်းယှဉ်လျှင် စာသားအရောင်၏
        [high-contrast] ကင်းဗတ်နှင့် နှိုင်းယှဉ်လျှင် ကွာခြားချက်မြင့်အရောင်၏
        [line] ကင်းဗတ်နှင့် နှိုင်းယှဉ်လျှင် မျဉ်းအရောင်၏
        [marker] ကင်းဗတ်နှင့် နှိုင်းယှဉ်လျှင် အမှတ်အသားအရောင်၏
       *[text-on-canvas] ကင်းဗတ်နှင့် နှိုင်းယှဉ်လျှင် စာသားအရောင်၏
    } ကွာခြားချက် မလုံလောက်ပါ{ $mode ->
        [dark] { " (အမှောင်မုဒ်)" }
       *[light] { "" }
    } ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; အနည်းဆုံး { $threshold }:1 လိုအပ်သည်)။

style-definition-dark-mode-text-background-contrast =
    စတိုင်သတ်မှတ်ချက် { $styleNumber } တွင် သတ်မှတ်ထားသော အရောင်များသည် အလင်းမုဒ်တွင် ကွာခြားချက် လုံလောက်သော်လည်း၊ ထိုတန်ဖိုးများမှ ဆင်းသက်လာသော အမှောင်မုဒ်အရောင်များတွင် နောက်ခံအရောင်နှင့် နှိုင်းယှဉ်လျှင် စာသားအရောင်၏ ကွာခြားချက် မလုံလောက်ပါ ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; အနည်းဆုံး { $threshold }:1 လိုအပ်သည်)။ { $suggestion ->
        [available] အမှောင်မုဒ်တွင် ကွာခြားချက် လုံလောက်စေရန် အလင်းမုဒ်၏ ကွာခြားချက်ကို တိုးပါ (ဥပမာ { $lightAttribute }="{ $lightColor }" သတ်မှတ်ပါ)၊ သို့မဟုတ် အမှောင်မုဒ်အရောင်ကို ကိုယ်တိုင် သတ်မှတ်ပါ (ဥပမာ { $darkAttribute }="{ $darkColor }" သတ်မှတ်ပါ)။
       *[none] အမှောင်မုဒ်တွင် ကွာခြားချက် လုံလောက်စေရန် အလင်းမုဒ်၏ ကွာခြားချက်ကို တိုးပါ၊ သို့မဟုတ် textColorDarkMode နှင့်/သို့မဟုတ် backgroundColorDarkMode ဖြင့် ဆင်းသက်လာသော အရောင်များကို ကိုယ်တိုင် သတ်မှတ်ပါ။
    }

style-definition-dark-mode-text-canvas-contrast =
    စတိုင်သတ်မှတ်ချက် { $styleNumber } တွင် သတ်မှတ်ထားသော စာသားအရောင်သည် အလင်းမုဒ်တွင် ကွာခြားချက် လုံလောက်သော်လည်း၊ ထိုတန်ဖိုးမှ ဆင်းသက်လာသော အမှောင်မုဒ် စာသားအရောင်သည် ကင်းဗတ်နှင့် နှိုင်းယှဉ်လျှင် ကွာခြားချက် မလုံလောက်ပါ ({ NUMBER($ratio, minimumFractionDigits: 2, maximumFractionDigits: 2) }:1; အနည်းဆုံး { $threshold }:1 လိုအပ်သည်)။ { $suggestion ->
        [available] အမှောင်မုဒ်တွင် ကွာခြားချက် လုံလောက်စေရန် အလင်းမုဒ်၏ ကွာခြားချက်ကို တိုးပါ (ဥပမာ textColor="{ $lightColor }" သတ်မှတ်ပါ)၊ သို့မဟုတ် အမှောင်မုဒ်အရောင်ကို ကိုယ်တိုင် သတ်မှတ်ပါ (ဥပမာ textColorDarkMode="{ $darkColor }" သတ်မှတ်ပါ)။
       *[none] အမှောင်မုဒ်တွင် ကွာခြားချက် လုံလောက်စေရန် အလင်းမုဒ်၏ ကွာခြားချက်ကို တိုးပါ၊ သို့မဟုတ် textColorDarkMode ဖြင့် ဆင်းသက်လာသော အရောင်ကို ကိုယ်တိုင် သတ်မှတ်ပါ။
    }

section-multiple-style-palettes = ကဏ္ဍတစ်ခုသည် <stylePalette> တစ်ခုသာ ရွေးနိုင်သည်; နောက်ဆုံးတစ်ခုကို သုံးသည်။

## Unique variants

variant-num-to-select-not-non-negative-integer = { $component } ၏ သီးခြားမူကွဲများကို မဆုံးဖြတ်နိုင်ပါ၊ numToSelect သည် အနုတ်မဟုတ်သော ကိန်းပြည့် မဟုတ်သောကြောင့်။

variant-num-to-select-not-constant-number = { $component } ၏ သီးခြားမူကွဲများကို မဆုံးဖြတ်နိုင်ပါ၊ numToSelect သည် ကိန်းသေ မဟုတ်သောကြောင့်။

variant-with-replacement-not-constant-boolean = { $component } ၏ သီးခြားမူကွဲများကို မဆုံးဖြတ်နိုင်ပါ၊ withReplacement သည် ကိန်းသေ ဘူလီယန် မဟုတ်သောကြောင့်။

variant-select-weight-disables-unique = ရွေးချယ်စရာတစ်ခုတွင် selectWeight သို့မဟုတ် selectForVariants သတ်မှတ်ထားလျှင် select ၏ သီးခြားမူကွဲများကို ပိတ်ထားသည်

variant-coprime-undetermined = { $component } ၏ သီးခြားမူကွဲများကို မဆုံးဖြတ်နိုင်ပါ၊ coprime သည် အမြဲမှားနေသလား ဆိုသည်ကို မဆုံးဖြတ်နိုင်သောကြောင့်။

variant-attribute-not-constant = { $component } ၏ သီးခြားမူကွဲများကို မဆုံးဖြတ်နိုင်ပါ၊ { $attribute } သည် ကိန်းသေ မဟုတ်သောကြောင့်။

variant-attribute-not-number = { $component } ၏ သီးခြားမူကွဲများကို မဆုံးဖြတ်နိုင်ပါ၊ { $attribute } သည် ကိန်းဂဏန်း မဟုတ်သောကြောင့်။

variant-attribute-wrong-type-for-sequence =
    { $type } အမျိုးအစား { $component } ၏ သီးခြားမူကွဲများကို မဆုံးဖြတ်နိုင်ပါ၊ { $attribute } သည် { $expected ->
        [letters-combination] အက္ခရာပေါင်းစပ်မှု
        [math-expression] မှန်ကန်သော သင်္ချာဖော်ပြချက်
        [integer] ကိန်းပြည့်
       *[number] ကိန်းဂဏန်း
    } မဟုတ်သောကြောင့်။

variant-length-not-integer = { $component } ၏ သီးခြားမူကွဲများကို မဆုံးဖြတ်နိုင်ပါ၊ length သည် ကိန်းပြည့် မဟုတ်သောကြောင့်။

variant-sort-not-implemented = sort ပါသော { $component } ၏ သီးခြားမူကွဲများကို မဆောင်ရွက်ရသေးပါ

variant-exclude-combinations-not-implemented = excludeCombinations ပါသော { $component } ၏ သီးခြားမူကွဲများကို မဆောင်ရွက်ရသေးပါ

variant-math-exclude-not-implemented = exclude ပါသော math အမျိုးအစား { $component } ၏ သီးခြားမူကွဲများကို မဆောင်ရွက်ရသေးပါ

variant-non-constant-exclude-not-implemented = ကိန်းသေမဟုတ်သော exclude ပါသော { $component } ၏ သီးခြားမူကွဲများကို မဆောင်ရွက်ရသေးပါ

## PreFigure conversion

prefigure-descendant-unsupported = { $subject }: graph prefigure ရန်ဒါရာတွင် မပံ့ပိုးပါ; အဆက်အနွယ်ကို ချန်လှပ်ထားသည်။

prefigure-descendant-invalid-geometry = { $subject }: ဂျီဩမေတြီသည် အကန့်အသတ်မရှိ သို့မဟုတ် မပြည့်စုံပါ; အဆက်အနွယ်ကို ချန်လှပ်ထားသည်။

prefigure-curve-label-omitted = { $subject }: ပြောင်းလဲထားသော မျဉ်းကွေးအစိတ်အပိုင်းများတွင် အညွှန်းများကို မပံ့ပိုးပါ; အညွှန်းကို ချန်လှပ်ထားသည်။

prefigure-curve-unsupported-definition-type = { $subject }: '{ $definitionType }' မျဉ်းကွေးဖန်ရှင် သတ်မှတ်ချက်အမျိုးအစားကို မပံ့ပိုးပါ; အဆက်အနွယ်ကို ချန်လှပ်ထားသည်။

prefigure-region-flip-functions-unsupported = { $subject }: regionBetweenCurves ပေါ်ရှိ flipFunctions အက်ထရီဗျုစ်ကို မပံ့ပိုးပါ; အဆက်အနွယ်ကို ချန်လှပ်ထားသည်။

prefigure-region-non-formula-child = { $subject }: regionBetweenCurves တွင် ဖော်မြူလာအမျိုးအစား သားသမီးဖန်ရှင်များကိုသာ ပံ့ပိုးသည်; အဆက်အနွယ်ကို ချန်လှပ်ထားသည်။

prefigure-label-position-unsupported =
    { $subject }: { $labelKind ->
        [line-family] မျဉ်းမျိုးရိုး အညွှန်းအတွက်
       *[point] အမှတ် အညွှန်းအတွက်
    } '{ $labelPosition }' labelPosition ကို မပံ့ပိုးပါ; PreFigure ၏ ပုံသေ စီစဉ်မှုကို သုံးသည်။

prefigure-fill-style-unsupported = { $subject }: '{ $fillStyle }' ဖြည့်စွက်စတိုင်ကို PreFigure က မပံ့ပိုးပါ; အပြည့်ဖြည့်ခြင်းသို့ ပြန်သွားသည်။

prefigure-line-style-unknown = { $subject }: မသိသော မျဉ်းစတိုင် '{ $lineStyle }' ကို PreFigure ထုတ်ပေးမှုမှ ချန်လှပ်ထားသည်။

prefigure-marker-style-mapped-to-diamond = { $subject }: '{ $markerStyle }' အမှတ်အသားစတိုင်ကို PreFigure ၏ 'diamond' စတိုင်နှင့် တွဲထားသည်။

prefigure-marker-style-unsupported = { $subject }: '{ $markerStyle }' အမှတ်အသားစတိုင်ကို PreFigure က မပံ့ပိုးပါ; ပုံသေစတိုင်ကို သုံးသည်။

## PreFigure annotations

annotation-ref-unresolvable = `<annotation>`: `ref` မမှန်ကန်ပါ; ပစ်မှတ်ကို မဆုံးဖြတ်နိုင်ပါ။ မှတ်ချက်ကို ချန်လှပ်ထားသည်။

annotation-ref-multiple-targets = `<annotation>`: `ref` သည် ပစ်မှတ်များစွာသို့ ရောက်သည်; ပထမပစ်မှတ်ကို သုံးသည်။

annotation-ref-outside-graph = `<annotation>`: `ref` မမှန်ကန်ပါ; ပစ်မှတ်သည် ဝန်းရံထားသော graph ၏ ပြင်ပတွင် ရှိသည်။ မှတ်ချက်ကို ချန်လှပ်ထားသည်။

annotation-ref-unsupported-target = `<annotation>`: `ref` မမှန်ကန်ပါ; prefigure ပြောင်းလဲမှုတွင် ပစ်မှတ်သည် ပံ့ပိုးထားသော ဂရပ်ဖစ်အရာဝတ္ထု မဟုတ်ပါ။ မှတ်ချက်ကို ချန်လှပ်ထားသည်။

annotation-text-missing = `<annotation>`: `text` မရှိ သို့မဟုတ် အလွတ်ဖြစ်သည်; အလွတ်စာသားကို ထုတ်ပေးသည်။

## Composites and references

composite-circular-dependency =
    { $componentType ->
        [none] စက်ဝိုင်းပုံ မှီခိုမှုကို တွေ့ရသည်။
       *[other] `<{ $componentType }>` အစိတ်အပိုင်း ပါဝင်သော စက်ဝိုင်းပုံ မှီခိုမှုကို တွေ့ရသည်။
    }

reference-no-referent = ရည်ညွှန်းချက်အတွက် ပစ်မှတ် မတွေ့ရပါ: `{ $reference }`

reference-multiple-referents = ရည်ညွှန်းချက်အတွက် ပစ်မှတ်များစွာ တွေ့ရသည်: `{ $reference }`

## Children that do not match

children-invalid-attribute-format = `<{ $componentType }>` ၏ { $attribute } အက်ထရီဗျုစ် ပုံစံ မမှန်ကန်ပါ။

children-invalid = `<{ $componentType }>` အတွက် သားသမီးများ မမှန်ကန်ပါ: မမှန်ကန်သော သားသမီးများ တွေ့ရသည်: { $children }

## Falling back to a default

attribute-value-invalid-using-default = `{ $attribute }` အက်ထရီဗျုစ်အတွက် `{ $value }` တန်ဖိုး မမှန်ကန်ပါ၊ `{ $default }` တန်ဖိုးကို သုံးသည်

## Loading a DoenetML version

doenetml-version-not-found =
    { $fallback ->
        [none] DoenetML ဗားရှင်း { $version } ကို မတွေ့ပါ။
       *[other] DoenetML ဗားရှင်း { $version } ကို မတွေ့ပါ။ ဗားရှင်း { $fallback } သို့ ပြန်သွားသည်
    }

## Reading the DoenetML

parse-invalid-doenetml = DoenetML မမှန်ကန်ပါ: { $content }

parse-tag-missing-close-tag = DoenetML မမှန်ကန်ပါ: `{ $tag }` တဂ်တွင် ပိတ်တဂ် မရှိပါ။ ကိုယ်တိုင်ပိတ်သော တဂ် သို့မဟုတ် `</{ $tagName }>` တဂ်ကို မျှော်လင့်ခဲ့သည်။

parse-tag-error = DoenetML မမှန်ကန်ပါ: `<{ $tagName }>` တဂ်တွင် အမှား

parse-attribute-missing-value = DoenetML မမှန်ကန်ပါ: `{ $attribute }` အက်ထရီဗျုစ် မမှန်ကန်ပါ၊ တန်ဖိုး ပျောက်နေပုံရသည်။

parse-attribute-invalid = DoenetML မမှန်ကန်ပါ: `{ $attribute }` အက်ထရီဗျုစ် မမှန်ကန်ပါ

parse-attribute-value-invalid = DoenetML မမှန်ကန်ပါ: `{ $value }` အက်ထရီဗျုစ်တန်ဖိုး မမှန်ကန်ပါ

parse-attribute-value-quote-mismatch = DoenetML မမှန်ကန်ပါ: `{ $value }` အက်ထရီဗျုစ်တန်ဖိုး မမှန်ကန်ပါ။ ကိုးကားအမှတ်အသားများ မကိုက်ညီပါ။ `{ $quote }` တစ်ခု ပျောက်နေပုံရသည်

parse-open-tag-name-missing = DoenetML မမှန်ကန်ပါ: တဂ်အမည်မပါသော တဂ်ကို တွေ့ရသည်၊ ဥပမာ `<`

parse-tag-not-closed = DoenetML မမှန်ကန်ပါ: `{ $tag }` တဂ်ကို မပိတ်ရသေးပါ (`>` တစ်ခု ပျောက်နေပုံရသည်)။

parse-self-closing-tag-name-missing = DoenetML မမှန်ကန်ပါ: တဂ်အမည်မပါသော တဂ်ကို တွေ့ရသည် `<{ $content }>`

parse-self-closing-tag-not-closed = DoenetML မမှန်ကန်ပါ: `{ $tag }` တဂ်ကို မပိတ်ရသေးပါ (`/>` ပျောက်နေပုံရသည်)။

parse-tag-invalid-attributes = DoenetML မမှန်ကန်ပါ: `{ $tag }` တဂ် မမှန်ကန်ပါ။ ၎င်း၏ အက်ထရီဗျုစ်များ မှားနေနိုင်သည်။

parse-close-tag-name-missing = DoenetML မမှန်ကန်ပါ: တဂ်အမည်မပါသော ပိတ်တဂ်ကို တွေ့ရသည်၊ ဥပမာ `</`

parse-attribute-value-unquoted = အက်ထရီဗျုစ်တန်ဖိုးများကို ကိုးကားအမှတ်အသားဖြင့် ပိတ်ရမည်: `{ $attribute }="{ $value }"`

parse-close-tag-without-open-tag = DoenetML မမှန်ကန်ပါ: `{ $tag }` ပိတ်တဂ်ကို တွေ့ရသော်လည်း သက်ဆိုင်ရာ ဖွင့်တဂ် မရှိပါ

parse-close-tag-mismatched = DoenetML မမှန်ကန်ပါ: ပိတ်တဂ် မကိုက်ညီပါ။ `</{ $expected }>` ကို မျှော်လင့်ခဲ့သည်။ တွေ့ရသည် `{ $found }`

parser-node-unconvertible = { $node } နုဒ်ကို Dast နုဒ်သို့ မပြောင်းနိုင်ပါ။

## Names

name-attribute-invalid =
    name='{ $name }' အက်ထရီဗျုစ် မမှန်ကန်ပါ။ { $reason ->
        [characters] အမည်များတွင် အက္ခရာ၊ ဂဏန်း၊ အောက်မျဉ်း သို့မဟုတ် အနုတ်လက္ခဏာသာ ပါဝင်နိုင်သည်။
       *[start] အမည်များသည် အက္ခရာဖြင့် စတင်ရမည်။
    }

component-name-invalid-start = "{ $name }" အစိတ်အပိုင်းအမည် မမှန်ကန်ပါ။ အမည်များသည် အက္ခရာဖြင့် စတင်ရမည်။

## `<answer>` sugar

answer-video-watched-missing-video = videoWatched အမျိုးအစား answer တွင် video အက်ထရီဗျုစ် ရှိရမည်

answer-video-watched-video-not-reference = videoWatched အမျိုးအစား answer ၏ video အက်ထရီဗျုစ်သည် ရည်ညွှန်းချက် ဖြစ်ရမည်

answer-name-not-single-text = answer ၏ name အက်ထရီဗျုစ်တွင် text သားသမီး တစ်ခုတည်း ရှိရမည်

## Referencing another document

external-doenetml-recursion-limit = ထပ်ခါတလဲလဲ အဆင့်များ များလွန်းသဖြင့် ပြင်ပ DoenetML ကို မရယူနိုင်ပါ။ စက်ဝိုင်းပုံ ရည်ညွှန်းချက် ရှိနေသလား။

external-doenetml-unavailable = { $attribute }="{ $uri }" မှ DoenetML ကို မရယူနိုင်ပါ

external-doenetml-type-mismatch = { $attribute }="{ $uri }" မှ ရယူထားသော DoenetML မမှန်ကန်ပါ: ၎င်းသည် "{ $componentType }" အစိတ်အပိုင်းအမျိုးအစားနှင့် မကိုက်ညီပါ

## Deprecated syntax

deprecated-attribute-renamed =
    { $component ->
        [none] [deprecation] `{ $from }` အက်ထရီဗျုစ်ကို ရပ်ဆိုင်းထားသည်; ယင်းအစား `{ $to }` ကို သုံးပါ။
       *[other] [deprecation] `<{ $component }>` ပေါ်ရှိ `{ $from }` အက်ထရီဗျုစ်ကို ရပ်ဆိုင်းထားသည်; ယင်းအစား `{ $to }` ကို သုံးပါ။
    }

deprecated-attribute-renamed-conflict =
    { $component ->
        [none] [deprecation] `{ $to }` ကိုပါ သတ်မှတ်ထားသောကြောင့် `{ $from }` အက်ထရီဗျုစ်ကို ရပ်ဆိုင်း၍ လျစ်လျူရှုထားသည်။
       *[other] [deprecation] `{ $to }` ကိုပါ သတ်မှတ်ထားသောကြောင့် `<{ $component }>` ပေါ်ရှိ `{ $from }` အက်ထရီဗျုစ်ကို ရပ်ဆိုင်း၍ လျစ်လျူရှုထားသည်။
    }

deprecated-attribute-ignored = [deprecation] `<{ $component }>` ပေါ်ရှိ `{ $attribute }` အက်ထရီဗျုစ်ကို ရပ်ဆိုင်း၍ လျစ်လျူရှုထားသည်။


## Language coverage

pluralize-english-only = `<pluralize>` သည် အင်္ဂလိပ်စာကိုသာ အများကိန်း ပြောင်းနိုင်သဖြင့် { $locale } ဘာသာဖြင့် ရေးထားသော စာတမ်းတွင် ၎င်း၏စာသားကို မပြောင်းဘဲ ထားသည်။ အများကိန်းပုံစံကို တိုက်ရိုက် ရေးပါ၊ သို့မဟုတ် `pluralForm` အက်ထရီဗျုစ်ဖြင့် သတ်မှတ်ပါ။


## Checking against the schema

schema-element-unrecognized = `<{ $tag }>` အစိတ်အပိုင်းသည် Doenet သိသော အစိတ်အပိုင်း မဟုတ်ပါ။

schema-element-not-allowed-at-root = `<{ $tag }>` အစိတ်အပိုင်းကို စာတမ်း၏ အမြစ်တွင် ခွင့်မပြုပါ။

schema-element-not-allowed-inside = `<{ $tag }>` အစိတ်အပိုင်းကို `<{ $parent }>` အတွင်း ခွင့်မပြုပါ။

schema-attribute-unrecognized = `<{ $tag }>` အစိတ်အပိုင်းတွင် `{ $attribute }` အမည်ရှိ အက်ထရီဗျုစ် မရှိပါ။

schema-attribute-value-not-allowed =
    { $isList ->
        [true] `<{ $tag }>` အစိတ်အပိုင်း၏ `{ $attribute }` အက်ထရီဗျုစ်သည် အရာတစ်ခုစီ ဤတို့ထဲမှ တစ်ခုဖြစ်သော စာရင်း ဖြစ်ရမည်: { $allowed }
       *[other] `<{ $tag }>` အစိတ်အပိုင်း၏ `{ $attribute }` အက်ထရီဗျုစ်သည် ဤတို့ထဲမှ တစ်ခု ဖြစ်ရမည်: { $allowed }
    }


## The `<select>` family's error boxes

select-variant-name-option-count-mismatch = select အတွက် မူကွဲအမည် မမှန်ကန်ပါ။  { $variantName } မူကွဲအမည်သည် ရွေးချယ်စရာ { $numOptions } ခုတွင် ပါဝင်သော်လည်း ရွေးရမည့်အရေအတွက်မှာ { $numToSelect } ဖြစ်သည်။

select-variant-name-without-options = select အတွက် မူကွဲအချို့ကို သတ်မှတ်ထားသော်လည်း ဖြစ်နိုင်သော မူကွဲအမည် { $variantName } အတွက် ရွေးချယ်စရာ မသတ်မှတ်ထားပါ။

select-variant-name-not-possible = select အတွက် သတ်မှတ်ထားသော { $variantName } မူကွဲအမည်သည် ဖြစ်နိုင်သော မူကွဲအမည် မဟုတ်ပါ။

select-too-few-options = { $numOptions } ခုမှသာ { $numToSelect } အစိတ်အပိုင်းကို မရွေးနိုင်ပါ။

select-from-sequence-too-few-values = အရှည် { $length } ရှိသော အစဉ်လိုက်မှ တန်ဖိုး { $numToSelect } ခုကို မရွေးနိုင်ပါ။

select-from-sequence-indices-count-mismatch = select အတွက် သတ်မှတ်ထားသော အညွှန်းအရေအတွက်သည် ရွေးရမည့်အရေအတွက်နှင့် ကိုက်ညီရမည်

select-from-sequence-indices-not-integers = select အတွက် သတ်မှတ်ထားသော အညွှန်းအားလုံး ကိန်းပြည့် ဖြစ်ရမည်

select-from-sequence-index-excluded = သတ်မှတ်ထားသော selectfromsequence ၏ အညွှန်းကို ချန်လှပ်ထားခဲ့သည်

select-from-sequence-indices-excluded-combination = သတ်မှတ်ထားသော selectfromsequence ၏ အညွှန်းများသည် ချန်လှပ်ထားသော ပေါင်းစပ်မှု ဖြစ်သည်

select-from-sequence-coprime-not-positive-integers = အပေါင်းကိန်းပြည့်များ မရွေးချယ်သဖြင့် ကိန်းရင်းချင်း ပေါင်းစပ်မှုများကို မရွေးနိုင်ပါ။

select-from-sequence-coprime-common-factor = ကိန်းရင်းချင်းများကို မရွေးနိုင်ပါ။ ဖြစ်နိုင်သော တန်ဖိုးအားလုံးတွင် ဘုံဆခွဲကိန်း ရှိသည်။ ("from" သို့မဟုတ် "to" ၏ သတ်မှတ်ထားသော တန်ဖိုးများသည် "step" နှင့် ကိန်းရင်းချင်း ဖြစ်ရမည်။)

select-from-sequence-coprime-single-number = 1 မဟုတ်သော ကိန်းတစ်ခုတည်းမှ ကိန်းရင်းချင်း ပေါင်းစပ်မှုများကို မရွေးနိုင်ပါ။

select-from-sequence-excluded-too-many-combinations = selectFromSequence တွင် ပေါင်းစပ်မှုများ၏ 70% ကျော်ကို ချန်လှပ်ထားသည်

select-from-sequence-coprime-none-found = ကိန်းရင်းချင်းများကို မရွေးနိုင်ခဲ့ပါ။ ဖြစ်နိုင်သော တန်ဖိုးအားလုံးတွင် ဘုံဆခွဲကိန်း ရှိသည်။

select-from-sequence-too-few-unique-values = အရှည် { $numPossibleValues } ရှိသော အစဉ်လိုက်မှ သီးခြားတန်ဖိုး { $numToSelect } ခုကို မရွေးနိုင်ပါ

select-prime-numbers-too-few-values = အရှည် { $numValues } ရှိသော သုည္ဒကိန်းစာရင်းမှ တန်ဖိုး { $numToSelect } ခုကို မရွေးနိုင်ပါ

select-prime-numbers-values-count-mismatch = select အတွက် သတ်မှတ်ထားသော တန်ဖိုးအရေအတွက်သည် ရွေးရမည့်အရေအတွက်နှင့် ကိုက်ညီရမည်

select-prime-numbers-values-not-prime = select prime number အတွက် သတ်မှတ်ထားသော တန်ဖိုးအားလုံး သုည္ဒကိန်းစာရင်းတွင် ပါဝင်ရမည်

select-prime-numbers-values-excluded-combination = selectPrimeNumbers ၏ သတ်မှတ်ထားသော တန်ဖိုးများသည် ချန်လှပ်ထားသော ပေါင်းစပ်မှု ဖြစ်သည်

select-prime-numbers-excluded-too-many-combinations = selectPrimeNumbers တွင် ပေါင်းစပ်မှုများ၏ 70% ကျော်ကို ချန်လှပ်ထားသည်

select-random-combination-fluke = အလွန်ဖြစ်နိုင်ခြေနည်းသော ကံဆိုးမှုကြောင့် ကျပန်းတန်ဖိုးများ၏ ပေါင်းစပ်မှုကို မရွေးနိုင်ခဲ့ပါ

select-random-value-fluke = အလွန်ဖြစ်နိုင်ခြေနည်းသော ကံဆိုးမှုကြောင့် ကျပန်းတန်ဖိုးကို မရွေးနိုင်ခဲ့ပါ
