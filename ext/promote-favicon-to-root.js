'use strict'

module.exports.register = function () {
  this.once('uiLoaded', ({ siteCatalog, uiCatalog }) => {
    const favicon = uiCatalog.findByType('asset').find((it) => it.path === 'img/favicon.ico')
    if (!favicon) return
    uiCatalog.addFile(new favicon.constructor({
      contents: favicon.contents,
      out: { dirname: '', basename: 'favicon.ico', path: 'favicon.ico' },
      path: 'favicon.ico',
      stat: favicon.stat,
      type: 'static',
    }))
  })
}
