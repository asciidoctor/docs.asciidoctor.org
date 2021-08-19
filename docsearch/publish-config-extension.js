'use strict'

const { promises: fsp } = require('fs')
const ospath = require('path')

/**
 * An Antora pipeline extension that generates the docsearch config file from a Handlebars template and
 * publishes it with the site, where the scraper job can retrieve it.
 */
module.exports.register = (pipeline) => {
  const handlebars = require(
    require.resolve('handlebars', {
      paths: [ospath.dirname(require.resolve('@antora/page-composer', { paths: pipeline.module.paths }))]
    })
  ).create()
  handlebars.registerHelper('eq', (a, b) => a === b)

  pipeline.on('beforePublish', async ({ contentCatalog, siteCatalog }) => {
    const configFile = ospath.join(__dirname, 'config.json')
    const templateSrc = await fsp.readFile(configFile + '.hbs', 'utf8')
    const template = handlebars.compile(templateSrc, { noEscape: true, preventIndent: true, srcName: 'config.json.hbs' })
    const components = contentCatalog.getComponentsSortedBy('name').filter((component) => component.latest.version)
    const config = template({ components })
    siteCatalog.addFile({ contents: Buffer.from(config), out: { path: 'docsearch-config.json' } })
  })
}
