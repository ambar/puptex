const mathjaxNode = require('mathjax-node')
const puptex = require('../src/puptex')

mathjaxNode.start()
mathjaxNode.config({displayErrors: false})

const times = (count, fn) => [...Array(count).keys()].map(fn)

const bench = async (name, count, fn) => {
  const time = process.hrtime()
  const results = await Promise.all(times(count, fn))
  const [seconds, nanoseconds] = process.hrtime(time)
  const ms = seconds * 1000 + nanoseconds / 1e6
  console.info(name, `${ms / count}ms`)
}

const typeset = (math) => {
  return new Promise(r => mathjaxNode.typeset({math, svg: true}, r))
}

const tests = [
  {
    name: 'short',
    math: 'E=mc^2'
  },
  {
    name: 'long',
    math: 'f(x)=\\sum^{\\infty}_{n=0}\\frac{f^{(n)}(a)}{n!}(x-a)^n'
  },
  {
    name: 'unicode',
    math: 'A=\\{x|x\\leq 0,x~\\text{为有理数}\\}\\cup\\{x|x>0~\\mbox{且}~x^2<2,x~\\text{为有理数}\\}'
  },
]

;(async () => {
  await puptex.launch()

  const count = 400

  console.info('Benchmarking puptex:')
  for (const {name, math} of tests) {
    await bench(name, count, () => puptex.renderMath(math))
  }

  console.info('\nBenchmarking mathjax-node:')
  for (const {name, math} of tests) {
    await bench(name, count, () => typeset(math))
  }

  puptex.close()
})()
