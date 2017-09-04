let folder = 'src'
try {
  new Function('async function test(){await 1}')
} catch (error) {
  folder = 'node6'
}

module.exports = require(`./${folder}/puptex`)
