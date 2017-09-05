const createApp = require('./src/createApp')

const runServer = async () => {
  const port = process.env.PORT || 11010
  const app = await createApp()
  app.listen(port, () => {
    console.info(`==> 🌎  Listening on port ${port}.`)
  })
}

runServer()
