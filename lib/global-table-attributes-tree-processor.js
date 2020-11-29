/**
 * Backports support for the table-frame and table-grid document attributes to Asciidoctor < 2.
 */
function globalTableAttributesTreeProcessor () {
  this.process((doc) => {
    const defaultFrame = doc.getAttribute('table-frame')
    const defaultGrid = doc.getAttribute('table-grid')
    for (const block of doc.findBy({ context: 'table' })) {
      if (defaultFrame && !block.isAttribute('frame')) doc.setAttribute('frame', defaultFrame)
      if (defaultGrid && !block.isAttribute('grid')) doc.setAttribute('grid', defaultGrid)
    }
    return doc
  })
}

function register (registry, { file }) {
  const asciidocAttrs = file.asciidoc.attributes
  if ('table-frame' in asciidocAttrs || 'table-grid' in asciidocAttrs) {
    registry.treeProcessor(globalTableAttributesTreeProcessor)
  }
}

module.exports.register = register
