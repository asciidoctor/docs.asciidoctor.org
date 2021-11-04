'use strict'

const { promises: fsp } = require('fs')
const ospath = require('path')

/**
 * An Antora extension that generates the docsearch config file from a Handlebars template and publishes it with the
 * site, where the scraper job can retrieve it.
 */
module.exports.register = function () {
  const handlebars = require(
    require.resolve('handlebars', {
      paths: [ospath.dirname(require.resolve('@antora/page-composer', { paths: this.module.paths }))]
    })
  ).create()
  handlebars.registerHelper('eq', (a, b) => a === b)

  this.on('beforePublish', async ({ playbook, contentCatalog, siteCatalog }) => {
    const configFile = ospath.join(__dirname, 'config.json')
    const templateSrc = await fsp.readFile(configFile + '.hbs', 'utf8')
    const template = handlebars.compile(templateSrc, { noEscape: true, preventIndent: true, srcName: 'config.json.hbs' })
    const components = contentCatalog.getComponentsSortedBy('name').filter((component) => component.latest.version)
    const stopPages = contentCatalog.getPages((page) => {
      return page.out && ('page-archived' in page.asciidoc.attributes || 'page-noindex' in page.asciidoc.attributes)
    })
    const config = template({ components, site: playbook.site, stopPages })
    siteCatalog.addFile({ contents: Buffer.from(config), out: { path: 'docsearch-config.json' } })
  })
}
