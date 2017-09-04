const puptex = require('../src/puptex')

const maths = [
  [''],
  ['x+1\\\\over {1-x'],
  ['E=mc^'],
  ['E=mc^2'],
  ['f(x)=\\sum^{\\infty}_{n=0}\\frac{f^{(n)}(a)}{n!}(x-a)^n'],
  ['a_na_{n-1}\\cdots a_0:=\\sum_{i=0}^{n}{a_i\\times} \\text{拾}^i'],
  ['A=\\{x|x\\leq 0,x~\\text{为有理数}\\}\\cup\\{x|x>0~\\mbox{且}~x^2<2,x~\\text{为有理数}\\}'],
  ['sum_(i=1)^n i^3=((n(n+1))/2)^2', {format: 'asciimath'}],
]

;(async () => {
  await puptex.launch()
  console.time('renderAll')
  const results = await Promise.all(maths.map(args => puptex.renderMath(...args)))
  console.timeEnd('renderAll')
  const svgs = results.map(data => data.svg)
  const html = `<!DOCTYPE html><html><head></head><body>${svgs.join('<br />')}</body></html>`
  require('fs').writeFile(`./tmp/preview.html`, html, () => {})
  puptex.close()
})()
