'use strict'

module.exports.register = function () {
  this.once('contextStarted', () => {
    global.Opal.Asciidoctor.Compliance.underline_style_section_titles = false
  })
}
