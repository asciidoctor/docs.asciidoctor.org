'use strict'

const fsp = require('node:fs/promises')
const ospath = require('node:path')

/**
 * An Antora extension that generates the docsearch config file from a Handlebars template and publishes it with the
 * site, where the scraper job can retrieve it.
 */
module.exports.register = function () {
  const handlebars = this.require('handlebars').create()
  handlebars.registerHelper('eq', (a, b) => a === b)
  handlebars.registerHelper('not', (val) => !val)
  handlebars.registerHelper('or', (a, b) => a || b)

  this.on('beforePublish', async ({ playbook, contentCatalog, siteCatalog }) => {
    const configFile = ospath.join(__dirname, 'config.json')
    const templateSrc = await fsp.readFile(configFile + '.hbs', 'utf8')
    const template = handlebars.compile(templateSrc, { noEscape: true, preventIndent: true, srcName: 'config.json.hbs' })
    const components = contentCatalog.getComponentsSortedBy('name').filter((component) => component.name !== 'ROOT')
    const stopPages = contentCatalog.getPages((page) => {
      return page.out && ('page-archived' in page.asciidoc.attributes || 'page-noindex' in page.asciidoc.attributes)
    })
    const config = template({ components, site: playbook.site, stopPages })
    siteCatalog.addFile({ contents: Buffer.from(config), out: { path: 'docsearch-config.json' } })
  })
}
