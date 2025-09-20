'use strict'

/**
 * Runs the checklinks plugin used by the Netlify build.
 * The script reads the configuration for checklinks from netlify/netlify.toml.
 * The location of the publish directory can be passed as the first argument.
 * In order to make the script work locally, you must remove the og:url metadata
 * from the HTML files.
 *
 * Install:
 *
 *  $ npm i -g https://github.com/mojavelinux/netlify-plugin-checklinks.git#patched @iarna/toml
 *
 * Run:
 * 
 *  $ NODE_PATH="$(npm -g root)" node checklinks.js
 */
const { onPostBuild: checklinks } = require('netlify-plugin-checklinks')
const toml = require('@iarna/toml')
const fsp = require('node:fs/promises')

;(async () => {
  const netlifyConfig = toml.parse(await fsp.readFile('netlify/netlify.toml', 'utf8'))
  const config = netlifyConfig.plugins.find((it) =>
    it.package === 'netlify-plugin-checklinks' || it.package?.endsWith('/netlify-plugin-checklinks')
  )
  if (!config) {
    console.warn('Could not locate checklinks configuration. Aborting')
    return
  }
  config.constants = {
    PUBLISH_DIR: (process.argv[2] || 'public'),
  }
  config.utils = {
    build: {
      failBuild: () => {},
    },
  }
  await checklinks(config)
})()
