const puppeteer = require('puppeteer')

const pageUrl = `file://${__dirname}/puptex.html`
const mathJaxUrl = `file://${require.resolve('mathjax')}?config=TeX-MML-AM_SVG`

const globalConfig = {
  // max Puppeteer page count
  concurrency: 4,
  // MathJax.Hub.Config
  mathJax: {},
}

const times = (count, fn) => [...Array(count).keys()].map(fn)

let browser = null
const launch = async () => {
  if (browser) {
    return
  }
  browser = await puppeteer.launch()
  // prepare pages
  await Promise.all(times(globalConfig.concurrency, () => getPage()))
}

const close = () => {
  if (browser) {
    browser.close()
    pages.length = 0
  }
}

const config = (config) => {
  Object.assign(globalConfig, config)
}

const pages = []
let current = -1
const getPage = async () => {
  current = (current + 1) % globalConfig.concurrency

  if (pages[current]) {
    return pages[current]
  }

  const page = await browser.newPage()
  page.on('console', console.info)
  await page.goto(pageUrl)
  await page.addScriptTag(mathJaxUrl)
  await page.evaluate((config) => window.config(config), globalConfig)
  pages.push(page)
  return page
}

const renderMath = async (math = '', options = {}) => {
  const page = await getPage()
  const data = await page.evaluate((...args) => window.renderMath(...args), math, options)
  return data
}

module.exports = {
  config,
  launch,
  renderMath,
  close,
}
