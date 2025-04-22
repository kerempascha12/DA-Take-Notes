import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import { quasar, transformAssetUrls } from '@quasar/vite-plugin';
import VueRouter from 'unplugin-vue-router/vite';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';

export default defineConfig({
  plugins: [
    VueRouter({
      importMode: 'sync',
    }),
    AutoImport({
      include: [/\.vue$/, /\.vue\?vue/, /\.js$/, /\.md$/],
      imports: [
        'vue',
        'vue-router',
        'pinia',
        {
          axios: [['default', 'axios']],
          quasar: ['useQuasar'],
        },
      ],
      dirs: ['src/stores'],
      dts: './auto-imports.d.ts',
      eslintrc: {
        enabled: true,
        filepath: './.eslintrc-auto-import.json',
        globalsPropValue: true,
      },
    }),
    Components({}),
    vue({
      template: { transformAssetUrls },
    }),
    quasar({
      sassVariables: 'src/quasar-variables.sass',
    }),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
