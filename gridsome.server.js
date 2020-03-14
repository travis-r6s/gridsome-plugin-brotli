const glob = require('glob')
const util = require('util')
const workerFarm = require('worker-farm')
const worker = require.resolve('./worker')

const globAsync = util.promisify(glob)

function BrotliPlugin (api, options) {
  api.afterBuild(async ({ config }) => {
    console.log('Compressing build with Brotli...')
    const outputDir = config.outputDir || config.outDir
    const patternExt = (options.extensions.length > 1) ? `{${options.extensions.join(',')}}` : options.extensions[ 0 ]
    const pattern = `**/*.${patternExt}`

    const files = await globAsync(pattern, { cwd: outputDir, ignore: '**/*.br', nodir: true })
    const tmrStart = new Date().getTime()

    const compressFile = workerFarm(worker)
    const compress = files.map(file => {
      return new Promise((resolve, reject) => {
        compressFile(file, { ...options, outputDir }, err => err ? reject(err) : resolve())
      })
    })
    await Promise.all(compress)
    workerFarm.end(compressFile)

    const tmrEnd = new Date().getTime()
    console.log(`Brotli compressed ${files.length} files in ${(tmrEnd - tmrStart) / 1000} s`)
  })
}

module.exports = BrotliPlugin

module.exports.defaultOptions = () => ({
  extensions: ['css', 'js'],
  path: ''
})
