'use strict'

module.exports.register = function () {
  this.once('uiLoaded', ({ uiCatalog }) => {
    const siteCss = uiCatalog.findByType('asset').find((it) => it.path === 'css/site.css')
    if (siteCss) siteCss.contents = Buffer.from(siteCss.contents.toString().replace(/url\(\.\.[/]/g, 'url(/_/'))
  })
}
