const Koa = require('koa')
const compress = require('koa-compress')
const {mapValues, pickBy} = require('lodash')
const puptex = require('./puptex')

// {bool: 'false', number: '1'} => {bool: false, number: 1}
const parseQuery = (query) => (
  mapValues(pickBy(query, Boolean), v => {
    if (v === 'true') {
      return true
    } else if (v === 'false') {
      return false
    } if (isFinite(v)) {
      return Number(v)
    }
    return v
  })
)

const render = ({svgPath, jsonPath, onError}) => async (ctx, next) => {
  await next()

  if ([svgPath, jsonPath].includes(ctx.path)) {
    const {q, tex, type, preview} = ctx.query
    const restQuery = parseQuery({preview})
    const math = q || tex
    const data = await puptex.renderMath(math)

    // 用 `preview` 参数控制是否记录日志
    if (data.errors && onError && !restQuery.preview) {
      onError(data.errors[0], math)
    }

    if (ctx.path === jsonPath) {
      ctx.body = data
    } else if (ctx.path === svgPath) {
      ctx.type = 'image/svg+xml'
      ctx.body = data.svg
    }
  }
}

const defaults = {
  onError() {},
  middleware: null,
  svgPath: '/',
  jsonPath: '/json',
}

const createApp = async (options) => {
  await puptex.launch()
  // ctrl + c
  process.on('SIGINT', () => {
    // close puppeteer browser & koa server
    process.exit()
  })

  options = Object.assign({}, defaults, options)

  const app = new Koa()
  app.use(compress())
  if (options.middleware) {
    app.use(options.middleware)
  }
  app.use(render(options))

  const listen = app.listen.bind(app)
  app.listen = (...args) => {
    const server = listen(...args)
    server.on('close', () => puptex.close())
    return server
  }

  return app
}

module.exports = createApp
