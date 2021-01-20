const path = require('path')
const puppeteer = require('puppeteer')

const pageUrl = `file://${__dirname}/puptex.html`
const mathJaxUrl = require.resolve('mathjax/es5/tex-svg-full')
const root = path.dirname(mathJaxUrl);
const times = (count, fn) => [...Array(count).keys()].map(fn)

const defaults = {
  // max Puppeteer page count
  concurrency: 4,
}

const mathDefaults = {
  fontSize: '15px',
}

const config = 'MathJax = ' + JSON.stringify({
  tex: {
    packages: [ 'base', 'ams', 'newcommand', 'autoload', 'require' ]
  },
  svg: {
    mtextFont: 'Times',
    merrorFont: 'Times',
    fontCache: 'none'
  },
  loader: {
    paths: {
      mathjax: `file://${root}`
    }
  },
  startup: {
    typeset: false
  }
});

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
    await page.addScriptTag({content: config});
    await page.addScriptTag({url: mathJaxUrl})
    this.pages_.push(page)
    return page
  }

  async renderMath(math = '', options = {}) {
    const page = await this.getPage_()
    // return await page.evaluate((...args) => window.renderMath(...args), math, options)
    // https://github.com/mathjax/MathJax-demos-node/blob/master/puppeteer/tex2svg
    return page.evaluate(async (math, options) => {
      await MathJax.startup.promise
      const html = await MathJax.tex2svgPromise(math)
      const svg = html.firstChild
      svg.style.fontSize = options.fontSize
      const data = {
        svg: svg.outerHTML,
        width: svg.getAttribute('width'),
        height: svg.getAttribute('height'),
        style: svg.getAttribute('style'),
      }
      return data
    }, math, {...mathDefaults, ...options})
  }
}

module.exports = new PupTex
module.exports.PupTex = PupTex
