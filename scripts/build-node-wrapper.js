// Node ESM entry: re-exports the CJS build so `import` and `require` share one FixedPoint class
const { writeFileSync } = require('fs')
const { join } = require('path')

const names = Object.keys(require('../dist/index.js')).filter((name) => name !== '__esModule')

writeFileSync(join(__dirname, '../dist/index.mjs'), `export { ${names.join(', ')} } from './index.js'\n`)
