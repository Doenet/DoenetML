---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A `<repeat>`'s `for` holds items of one type, decided when the document loads.

- **What an item is** follows `<shuffle>`: a list, or a `<repeat>`, `<select>` or `<sort>` whose iterations or picks each hold one component, gives one item per entry; a `<group>` holding one component stands for it; and anything holding several components is **one item**. `for="$g"` of a `<group>` of several now goes once, where it went once per child, and a repeat over another repeat whose template holds several goes once per iteration, so `$d.P` names the `P` of that iteration (`<repeat for="$data" valueName="d">$d.P is labelled $d.L.</repeat>`). Before, it went over the components one by one and `$d.P` was blank.
- **Items of more than one type are an error at load** (`doenet-e0081`), shown in place of the iterations: a `<math>` and a `<text>`, a `<point>` and a `<line>`, a `<math>` and a group of several. A type is as for `<sort>` and `<shuffle>`: a value's type (integer, number and math are one type), an object's tag, or content. An input counts as what it holds. Before, `for` took any mix.
- **`type` types the text written in `for`** (math if not written), **and, when written, every item**: `for="2 $t"`, with `t` a `<text>`, is an error unless it says `type="text"`, and `<repeat type="text" for="$n">` of a `<number>` is an error.
- **The `valueName` is typed** by the items: a tag made from it is checked at load like any other reference, so `<point extend="$v"/>` over texts is `doenet-e0065` at load, and `<sort>$v <text>hi</text></sort>` over maths is `doenet-e0076`.
- **A name after the `valueName` when the items hold several components** names what every item declares by that name, with one tag. If an item lacks it, it names nothing in every iteration, with `doenet-w0183` at load; two tags are `doenet-w0184`, an error in place of the reference.
- **A `<group>` that extends another and adds children** (`<group name="h" extend="$g"><text name="R">c</text></group>`) is read at load as holding both, in `for` and in a `<sort>` or `<shuffle>`: `$d` of it shows all of them and `$d.R` names `R`, and a `<sort>` of it, when it holds several, is `doenet-e0077` as for any group of several. Before, it was read as the group it extends.
