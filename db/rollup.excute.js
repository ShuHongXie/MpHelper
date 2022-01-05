const loadConfigFile = require('rollup/dist/loadConfigFile')
const path = require('path')
const rollup = require('rollup')

loadConfigFile(path.resolve(__dirname, 'db.rollup.config.js'), { format: 'cjs' }).then(
  async ({ options, warnings }) => {
    console.log(`We currently have ${warnings.count} warnings`)

    // This prints all deferred warnings
    warnings.flush()

    for (const optionsObj of options) {
      const bundle = await rollup.rollup(optionsObj)
      await Promise.all(optionsObj.output.map(bundle.write))
    }

    rollup.watch(options)
  }
)
