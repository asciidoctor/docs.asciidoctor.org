'use strict'

module.exports.register = function () {
  this.once('uiLoaded', () => {
    // FIXME move to parameter after upgrading to 3.0.0-rc.4
    const { uiCatalog } = this.getVariables()
    const siteCss = uiCatalog.findByType('asset').find((it) => it.path === 'css/site.css')
    if (siteCss) siteCss.contents = Buffer.from(siteCss.contents.toString().replace(/url\(\.\.[/]/g, 'url(/_/'))
  })
}
