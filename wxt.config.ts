import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifestVersion: 2,
  srcDir: 'src',
  modules: ['@wxt-dev/auto-icons', '@wxt-dev/module-svelte'],
  autoIcons: {
    baseIconPath: 'assets/icon.svg',
  },
  manifest: {
    name: 'replock',
    description: 'Simple request block/replace extension for firefox.',
    version: '0.0.1',
    permissions: ['webRequest', 'webRequestBlocking', '<all_urls>', 'storage'],
    browser_specific_settings: {
      gecko: {
        data_collection_permissions: {
          required: ["none"],
        },
      },
    },
    homepage_url: 'https://github.com/mumincacao/replock',
  }
});
