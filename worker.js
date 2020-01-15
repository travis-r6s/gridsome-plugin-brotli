'use strict'

const brotli = require('brotli')
const fs = require('fs')
const util = require('util')
const mkdirp = require('mkdirp')
const mkdirpAsync = util.promisify(mkdirp)
const readFileAsync = util.promisify(fs.readFile)
const writeFileAsync = util.promisify(fs.writeFile)
const path = require('path')

async function compressFile (file, options) {
  // brotli compress the asset to a new file with the .br extension
  const fileBasePath = path.resolve(options.outputDir)
  const srcFileName = path.join(fileBasePath, file)
  const content = await readFileAsync(srcFileName)
  const compressed = await brotli.compress(content)

  const destFilePath = (options.path) ? path.join(fileBasePath, options.path) : fileBasePath
  const destFileName = path.join(destFilePath, file) + '.br'
  const destFileDirname = path.dirname(destFileName)

  await mkdirpAsync(destFileDirname)
  await writeFileAsync(destFileName, compressed)
}

module.exports = function (file, options, callback) {
  compressFile(file, options)
    .then(() => callback(null))
    .catch(err => callback(err))
}
