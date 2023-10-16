import { fileURLToPath, URL } from 'node:url';
import { defineConfig, splitVendorChunkPlugin } from 'vite';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import AutoImport from 'unplugin-auto-import/vite';
import vuetify from 'vite-plugin-vuetify';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    splitVendorChunkPlugin(),
    vue(),
    vuetify({ autoImport: true }),
    Components({
      dirs: ['src/components', 'src/layouts'],
      dts: true,
      resolvers: [],
    }),
    AutoImport({
      imports: ['vue'],
      dts: true,
      resolvers: [],
    }),
  ],

  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
