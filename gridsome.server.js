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
    const results = await Promise.allSettled(compress)
    workerFarm.end(compressFile)

    const tmrEnd = new Date().getTime();

    const failedFiles = results
      .map((result, index) => ({ result, file: files[index] }))
      .filter((result) => result.status === 'rejected');
    const failReport = failedFiles.length
      ? '\nThese files failed:'
        + failedFiles.map(({ file, result }) => `\nFile: ${file} \nReason: ${result.reason}`).join('\n') 
      : '';

    const compressedCount = files.length - failedFiles.length;
    console.log(
      `Brotli compressed ${compressedCount}/${files.length} files in ${(tmrEnd - tmrStart) / 1000} s`
      + failReport
    );
  })
}

module.exports = BrotliPlugin

module.exports.defaultOptions = () => ({
  extensions: ['css', 'js'],
  path: ''
})
