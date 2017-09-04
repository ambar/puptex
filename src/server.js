const createApp = require('./createApp')

exports.createApp = createApp

const runServer = async () => {
  const port = process.env.PORT || 11010
  const app = await createApp()
  app.listen(port, () => {
    console.info(`==> 🌎  Listening on port ${port}.`)
  })
}

if (process.argv.includes('--run')) {
  runServer()
}
