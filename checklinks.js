/**
 * Runs the checklinks plugin used by the Netlify build.
 * The script reads the configuration for checklinks from netlify/netlify.toml.
 *
 * Install:
 *
 *  $ npm i -g netlify-plugin-checklinks @ianra/toml
 *
 * Run:
 * 
 *  $ NODE_PATH="$(npm -g root)" node checklinks.js
 */
const { onPostBuild: checklinks } = require('netlify-plugin-checklinks')
const toml = require('@iarna/toml')
const { promises: fsp } = require('fs')

;(async () => {
  const netlifyConfig = toml.parse(await fsp.readFile('netlify/netlify.toml', 'utf8'))
  const config = netlifyConfig.plugins.find((it) => it.package === 'netlify-plugin-checklinks')
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
