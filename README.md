# DoenetML

Monorepo for DoenetML Components. See the `packages/*` folders for individual components.

# What is DoenetML?

Semantic markup for building interactive web activities.
[Read more about Doenet](https://www.doenet.org)

```xml
<p>Drag the point to the 4th quadrant.</p>
<graph>
    <point xs='2 3'/>
</graph>
```

![](media/graph_example.png)

## Features

-   Internally manages a directed acyclic graph of dependencies to coordinate updates of self-referential worksheets

## Quickstart

To quickly get started contributing to DoenetML, you can use a
Codespace and your web browser. Click the green `<> Code` button
on the GitHub.com page for this repository, choose the
"Codespaces" tab, then click the green "Create codespace on main"
button.

Grab a cup of coffee, and after a few minutes, you should have a
working development environment in your web browser. Run
`npm run dev` in a terminal and click the green "Open in Browser"
button to confirm!

### Working locally

Your local environment should have Node and Rust installed.

In root directory, run `sh .devcontainer/setup.sh` to install
dependencies and build packages. After a short wait, you should
be able to run `npm run dev` and open `http://localhost:8012`.

## Demos

<details>
<summary>Point and Collect</summary>

```xml
<graph name="graph">
	<point name="p1" xs="2 3"/>
	<point name="p2" xs="$p1.y $p1.x"/>
</graph>
<asList>
	<collect source="graph" componentTypes="point"/>
</asList>
```

</details>

<details>
<summary>Text Input</summary>

```xml
<textInput name="t1" prefill="Cake"/>
<text>$t1.value is good.</text>
```

</details>

<details>
<summary>Sequence and Math Input</summary>

```xml
<mathInput name="n1" prefill="4"/>
<mathInput name="n2" prefill="14"/>
<p>
	Count from $n1.value to $n2.value:
	<aslist><sequence name="seq" from="$n1.value" to="$n2.value"/></aslist>.

	And the fifth number is $seq[5].value.
</p>
```

</details>

<details>
<summary>Point Parallelogram</summary>

```xml
<graph>
    <point name="p1" xs="0 4" />
    <point name="p2" xs="3 0" />
    <point name="p3" xs="$p1.x+$p2.x $p1.y+$p2.y" />
</graph>
```

</details>

<details>
<summary>Boolean Input</summary>

```xml
<booleanInput name="bool"/>

I think<text hide="$bool"> therefore I am</text>.

<booleanInput name="bool2"/>
<text hide="$bool2">Yin</text>
<text hide="!$bool2">Yang</text>
```

</details>

<details>
<summary>Value vs Immediate Value</summary>

```xml
<graph name="graph">
	<point name="p1" xs="$n1.value $n2.value"/>
	<point name="p2" xs="$n1.immediateValue+0.5 $n2.immediateValue"/>
</graph>

<mathInput name="n1" prefill="0"/>
<mathInput name="n2" prefill="0"/>

One point uses immediate value plus an offset
```

</details>

<details>
<summary>Collect Component Index</summary>

```xmlThe following paragraph contains numbers and sequences based on the number
<number name="n" copySource="/_mathinput1" />:

<p name="p1">
This paragraphs contains:
number
<number>23</number>
sequence
<aslist><sequence from="1" to="$n"/></aslist>
number
<number>42</number>
number
<number>2</number>
sequence
<aslist><sequence from="$n" to="2*$n"/></aslist>
number
<number>30</number>
</p>

Collect the numbers in that paragraph: <aslist><collect name="c1" source="p1" componentTypes="number"/></aslist>.

The fifth number is $c1[5].value.

Now try changing the number
<mathInput prefill="6"/>
```

</details>

<!-- ## Technical Documentation
JavaScript parses the DoenetML and calls Rust functions, passing in strings. On core creation, Rust returns a pointer to its main struct, existing in WASM linear memory. Javascript uses this to access the other core functions. Rust returns rendering data as strings.

The Doenet Rust code is in the doenet-core crate, doenet-core/src/lib.rs being the main file. The crate can be built as a library independent of javascript, but without a parser, one would need pre-parsed DoenetML objects as its input. -->

## Development

DoenetML features are split into npm _workspace_ located in the `packages/*` directory. Each package is built
using `vite`. Automatic building of dependencies is handled via the [wireit](https://github.com/google/wireit)
project, which is configured in
each workspace's `package.json`.

### VSCode

When using Visual Studio Code to work on DoenetML, you should open the pre-configured VSCode workspaces
located at `.vscode/doenet.code-workspace`. This will, among other things, make sure that `rust-analyzer` is pointed
at the correct directory.

You can do this directly by running
```bash
code .vscode/doenet.code-workspace
```

### Automatic Rebuilding (watch mode)

Because of the complicated build process for some packages, `npx vite build --watch` will often fail as dependencies
get rebuilt. Instead you should use

```bash
npm run build --watch
```

from a package's directory to have `wireit` manage rebuilding of dependencies. For example, to automatically rebuild
`doenetml` on any change and have that reflected in `test-viewer`, you could run

```bash
cd packages/doenetml
npm run build --watch &
cd ../test-viewer
npm run dev
```

Since `doenetml` should include most packages as dependencies, a change to almost any package will cause it to be rebuilt
automatically.

### Consistency checks

Keeping every `package.json` file consistent as well as keeping the `wireit` dependencies correct can be hard.
Programs in `scripts/` can help.

```bash
npx vite-node scripts/ensure-consistency.ts
```

will show the dependencies imported by each package and cross-reference this with those dependencies specified in its `package.json`.
