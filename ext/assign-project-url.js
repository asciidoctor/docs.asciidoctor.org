'use strict'

module.exports.register = function () {
  // could switch this to componentsRegistered after upgrading to Antora 3.2
  this.once('contentClassified', ({ siteAsciiDocConfig, contentCatalog }) => {
    contentCatalog.getComponents().forEach((component) => {
      component.versions.forEach((componentVersion) => {
        const componentVersionId = { component: component.name, version: componentVersion.version }
        const componentVersionStartPage = contentCatalog.resolvePage('index.adoc', componentVersionId)
        if (!componentVersionStartPage) return
        const { startPath, webUrl } = componentVersionStartPage.src.origin
        if (!(startPath === 'docs' && webUrl)) return
        if (componentVersion.asciidoc === siteAsciiDocConfig) {
          componentVersion.asciidoc = Object.assign(
            {},
            siteAsciiDocConfig,
            { attributes: Object.assign({}, siteAsciiDocConfig.attributes) }
          )
        }
        componentVersion.asciidoc.attributes['page-project-url'] = webUrl
        componentVersion.asciidoc.attributes['page-project-host'] = ~webUrl.indexOf('gitlab') ? 'gitlab' : 'github'
      })
    })
  })
}
