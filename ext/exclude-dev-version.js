'use strict'

/**
 * An Antora extension that excludes component version buckets with a prerelease value that ends with -dev or -alpha.0.
 */
module.exports.register = function () {
  this.once('contentAggregated', ({ contentAggregate }) => {
    let logger
    const newContentAggregate = []
    for (const componentVersionBucket of contentAggregate) {
      const { name, version, prerelease } = componentVersionBucket
      if (prerelease && prerelease.constructor === String &&
          (prerelease.endsWith('-dev') || prerelease.endsWith('-alpha.0'))) {
        logger ??= this.getLogger('exclude-dev-version')
        logger.debug(`Excluding component version bucket ${version}@${name} (prerelease: ${prerelease})`)
        continue
      }
      newContentAggregate.push(componentVersionBucket)
    }
    this.updateVariables({ contentAggregate: newContentAggregate })
  })
}
