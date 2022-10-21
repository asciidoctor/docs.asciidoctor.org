'use strict'

module.exports.register = function () {
  this.once('contentClassified', ({ contentCatalog }) => {
    contentCatalog.getPages((page) => {
      if (!(page.out && page.contents.includes(':page-location:'))) return
      const location = page
        .contents
        .toString()
        .split('\n')
        .find((it) => it.startsWith(':page-location: '))
        .substr(16)
      const target = contentCatalog.resolvePage(location, page.src)
      if (!target) return
      const { component, version, module_ = 'ROOT', relative } = page.src
      contentCatalog.removeFile(page)
      contentCatalog.registerPageAlias(`${version}@${component}:${module_}:${relative}`, target)
    })
  })
}
