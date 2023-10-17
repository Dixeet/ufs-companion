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
    }),
    AutoImport({
      imports: [
        'vue',
        {
          '@vueuse/core': ['useStorage', 'useAsyncState', 'useFetch'],
        },
      ],
      dirs: ['./src/composables/**'],
      dts: true,
      eslintrc: {
        enabled: true,
      },
    }),
  ],

  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
