# PupTex

Using [Puppeteer](https://github.com/GoogleChrome/puppeteer)(Headless Chrome) to render math:

- 2x faster than [mathjax-node](https://github.com/mathjax/MathJax-node)
- Configurable concurrent limit
- Renders CJK characters correctly

## Usage

**Node**

```js
import puptex from 'puptex'

;(async () => {
  puptex.config({
    concurrency: 2,
    mathJax: {},
  })
  await puptex.launch()
  const data = await puptex.renderMath('E=mc^2')
  // data => {errors: [], svg: '<svg .../>', mml: '', widht: '', height: '', ...}
  puptex.close()
})()
```

**Koa**

```js
import {createApp} from 'puptex/server'

;(async () => {
  const app = await createApp({middleware, onError})
  app.listen(11010)

  // serving http://localhost:11010/?q=E=mc^2
})()
```

## API

### `puptex.config(options: Object): void`

- `options: Object` PupTex global configuration
  - `concurrency: nubmer`: Max Puppeteer page count, defaults to `4`
  - `mathJax: Object`: [MathJax configuration](http://docs.mathjax.org/en/latest/options/index.html)

### `puptex.launch(): Promise<void>`

Launches browser.

### `puptex.renderMath(math: string, options: Object): Promise<data>`

- `options: Object`
  - `format: string`: `Tex` | `AsciiMath` | `MathML`, defaults to `Tex`
  - `mml: boolean`: Whether to render `<math>`, defaults to `false`
  - `fontSize: string`: `<svg>` root font size, defaults to `15px`
- `data: Object`
  - `errors: Array` MathJax error messages
  - `svg: string` `<svg>` markup
  - `mml: string` `<math>` markup
  - `width: string` `<math>` width
  - `height: string` `<svg>` height
  - `style: string` `<svg>` style (vertical-align)

### `puptex.close(): void`

Closes browser.
