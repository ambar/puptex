const puppeteer = require('puppeteer')

const pageUrl = `file://${__dirname}/puptex.html`
const mathJaxUrl = `file://${require.resolve('mathjax')}?config=TeX-MML-AM_SVG`
const times = (count, fn) => [...Array(count).keys()].map(fn)

const defaults = {
  // max Puppeteer page count
  concurrency: 4,
  // MathJax.Hub.Config
  mathJax: {},
}

class PupTex {
  constructor(config) {
    this.config_ = Object.assign({}, defaults, config)
    this.browser_ = null
    this.pages_ = []
    this.current_ = -1
  }

  config(config) {
    Object.assign(this.config_, config)
  }

  async launch() {
    if (this.browser_) {
      return
    }

    this.browser_ = await puppeteer.launch({
      // Running as root without --no-sandbox is not supported.
      // https://peter.sh/experiments/chromium-command-line-switches/#no-sandbox
      args: ['--no-sandbox'],
    })

    // prepare pages
    await Promise.all(times(this.config_.concurrency, () => this.getPage_()))
  }

  close() {
    if (this.browser_) {
      this.browser_.close()
      this.pages_.length = 0
    }
  }

  async getPage_() {
    this.current_ = (this.current_ + 1) % this.config_.concurrency

    if (this.pages_[this.current_]) {
      return this.pages_[this.current_]
    }

    const page = await this.browser_.newPage()
    page.on('console', console.info)
    await page.goto(pageUrl)
    await page.addScriptTag({url: mathJaxUrl})
    await page.evaluate((config) => window.config(config), this.config_)
    this.pages_.push(page)
    return page
  }

  async renderMath(math = '', options = {}) {
    const page = await this.getPage_()
    const data = await page.evaluate((...args) => window.renderMath(...args), math, options)
    return data
  }
}

module.exports = new PupTex
module.exports.PupTex = PupTex
