const request = require('supertest')
const createApp = require('../src/createApp')

const invalidTex = encodeURIComponent('E=mc^')

const createServer = async (options) => {
  const app = await createApp(options)
  return app.listen()
}

// TODO puptex = new Puptex()?

describe('createApp:onError', () => {
  it('logs error when `preview` is falsy', async () => {
    let logError = jest.fn()
    const server = await createServer({onError: logError})

    // logs error
    await request(server).get(`/?q=${invalidTex}&preview=false`).expect(200)
    expect(logError).toHaveBeenCalledWith(
      'TeX Jax - parse error: Missing superscript or subscript argument',
      'E=mc^',
    )

    // does not log error
    await request(server).get(`/?q=${invalidTex}&preview=true`).expect(200),
    expect(logError.mock.calls.length).toBe(1)

    server.close()
  })
})
