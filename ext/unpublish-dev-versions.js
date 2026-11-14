'use strict'

// Drops component versions whose prerelease value is "-dev" so they are not published.
module.exports.register = function () {
  const logger = this.getLogger('unpublish-dev-versions')
  this.once('contentAggregated', ({ contentAggregate }) => {
    for (let i = contentAggregate.length - 1; i >= 0; i--) {
      const { name, version, prerelease } = contentAggregate[i]
      if (prerelease !== '-dev') continue
      logger.info(`Skipping component version ${version}@${name} (prerelease: ${prerelease})`)
      contentAggregate.splice(i, 1)
    }
  })
}
