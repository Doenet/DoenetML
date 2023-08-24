# Standalone DoenetML Renderer
This workspace contains a standalone DoenetML renderer.

## Usage

Include
```html
<script type="module" src="doenet-standalone.js"></script>
```
in your webpage. Then you can call the globally-exported function `renderDoenetToContainer`, which expects
a `<div>` element containing a `<source type="text/doenetml"></source>` as a child.

For example

```html
<script type="module">
    renderDoenetToContainer(document.querySelector(".doenetml-applet"))
</script>

<div class="doenetml-applet">
  <script type="text/doenetml">
    <p>Use this to test DoenetML</p>
    <graph showNavigation="false">

      <line through="(-8,8) (9,6)" />
      <line through="(0,4)" slope="1/2" styleNumber="2" />

      <line equation="y=2x-8" styleNumber="3" />
      <line equation="x=-6" styleNumber="4" />
      
    </graph>
  </script>
</div>
```

To pass attributes to the DoenetML react component, you may write them in kebob-case prefixed with `data-doenet`.
For example,
```html
<div class="doenetml-applet">
  <script type="text/doenetml" data-doenet-read-only="true" >
    <graph showNavigation="false">
      <line equation="x=-6" styleNumber="4" />
    </graph>
  </script>
</div>
```



## Development

Run
```bash
npm run dev
```
to start a `vite` dev server that serves the test viewer and navigate to the indicated URL. By default
`index.html` is served. You can instead navigate to `index-inline-worker.html` to view the same page but
with the inlined version of the DoenetML web worker.