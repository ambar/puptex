const request = require('supertest')
const createApp = require('../src/createApp')

const tex = encodeURIComponent('E=mc^2')
const invalidTex = encodeURIComponent('E=mc^')

const snapshot = res => (
  expect(Buffer.isBuffer(res.body) ? res.body.toString() : res.text).toMatchSnapshot()
)

const createServer = async (options) => {
  const app = await createApp(options)
  return app.listen()
}

describe('createApp', () => {
  let server
  beforeAll(async () => {
    server = await createServer()
  })

  afterAll(() => {
    server.close()
  })

  it('renders tex', async () => {
    const res = await request(server).get(`/?q=${tex}`).expect(200)
    snapshot(res)
  })

  it('renders invalid tex', async () => {
    const res = await request(server).get(`/?q=${invalidTex}`).expect(200)
    snapshot(res)
  })
})
