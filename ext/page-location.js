'use strict'

module.exports.register = function () {
  this.once('documentsConverted', ({ contentCatalog }) => {
    contentCatalog.getPages((page) => {
      const location = page.asciidoc?.attributes?.['page-location']
      if (!location) return
      const target = contentCatalog.resolvePage(location, page.src)
      if (!target) return
      const { component, version, module_ = 'ROOT', relative } = page.src
      contentCatalog.removeFile(page)
      contentCatalog.registerPageAlias(`${version}@${component}:${module_}:${relative}`, target)
    })
  })
}
