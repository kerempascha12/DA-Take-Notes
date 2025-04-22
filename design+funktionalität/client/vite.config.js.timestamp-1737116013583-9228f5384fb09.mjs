// vite.config.js
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "file:///C:/Users/kerem/OneDrive/Dokumente/schule/Diplomarbeit/DA%20-%20Take%20Notes/node_modules/vite/dist/node/index.js";
import vue from "file:///C:/Users/kerem/OneDrive/Dokumente/schule/Diplomarbeit/DA%20-%20Take%20Notes/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueDevTools from "file:///C:/Users/kerem/OneDrive/Dokumente/schule/Diplomarbeit/DA%20-%20Take%20Notes/node_modules/vite-plugin-vue-devtools/dist/vite.mjs";
import { quasar, transformAssetUrls } from "file:///C:/Users/kerem/OneDrive/Dokumente/schule/Diplomarbeit/DA%20-%20Take%20Notes/node_modules/@quasar/vite-plugin/src/index.js";
import VueRouter from "file:///C:/Users/kerem/OneDrive/Dokumente/schule/Diplomarbeit/DA%20-%20Take%20Notes/node_modules/unplugin-vue-router/dist/vite.js";
import AutoImport from "file:///C:/Users/kerem/OneDrive/Dokumente/schule/Diplomarbeit/DA%20-%20Take%20Notes/node_modules/unplugin-auto-import/dist/vite.js";
import Components from "file:///C:/Users/kerem/OneDrive/Dokumente/schule/Diplomarbeit/DA%20-%20Take%20Notes/node_modules/unplugin-vue-components/dist/vite.js";
var __vite_injected_original_import_meta_url = "file:///C:/Users/kerem/OneDrive/Dokumente/schule/Diplomarbeit/DA%20-%20Take%20Notes/vite.config.js";
var vite_config_default = defineConfig({
  plugins: [
    VueRouter({
      importMode: "sync"
    }),
    AutoImport({
      include: [/\.vue$/, /\.vue\?vue/, /\.js$/, /\.md$/],
      imports: [
        "vue",
        "vue-router",
        "pinia",
        {
          axios: [["default", "axios"]],
          quasar: ["useQuasar"]
        }
      ],
      dirs: ["src/stores"],
      dts: "./auto-imports.d.ts",
      eslintrc: {
        enabled: true,
        filepath: "./.eslintrc-auto-import.json",
        globalsPropValue: true
      }
    }),
    Components({}),
    vue({
      template: { transformAssetUrls }
    }),
    quasar({
      sassVariables: "src/quasar-variables.sass"
    }),
    vueDevTools()
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxrZXJlbVxcXFxPbmVEcml2ZVxcXFxEb2t1bWVudGVcXFxcc2NodWxlXFxcXERpcGxvbWFyYmVpdFxcXFxEQSAtIFRha2UgTm90ZXNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGtlcmVtXFxcXE9uZURyaXZlXFxcXERva3VtZW50ZVxcXFxzY2h1bGVcXFxcRGlwbG9tYXJiZWl0XFxcXERBIC0gVGFrZSBOb3Rlc1xcXFx2aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMva2VyZW0vT25lRHJpdmUvRG9rdW1lbnRlL3NjaHVsZS9EaXBsb21hcmJlaXQvREElMjAtJTIwVGFrZSUyME5vdGVzL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgVVJMIH0gZnJvbSAnbm9kZTp1cmwnO1xuXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJztcbmltcG9ydCB2dWVEZXZUb29scyBmcm9tICd2aXRlLXBsdWdpbi12dWUtZGV2dG9vbHMnO1xuaW1wb3J0IHsgcXVhc2FyLCB0cmFuc2Zvcm1Bc3NldFVybHMgfSBmcm9tICdAcXVhc2FyL3ZpdGUtcGx1Z2luJztcbmltcG9ydCBWdWVSb3V0ZXIgZnJvbSAndW5wbHVnaW4tdnVlLXJvdXRlci92aXRlJztcbmltcG9ydCBBdXRvSW1wb3J0IGZyb20gJ3VucGx1Z2luLWF1dG8taW1wb3J0L3ZpdGUnO1xuaW1wb3J0IENvbXBvbmVudHMgZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvdml0ZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICBWdWVSb3V0ZXIoe1xuICAgICAgaW1wb3J0TW9kZTogJ3N5bmMnLFxuICAgIH0pLFxuICAgIEF1dG9JbXBvcnQoe1xuICAgICAgaW5jbHVkZTogWy9cXC52dWUkLywgL1xcLnZ1ZVxcP3Z1ZS8sIC9cXC5qcyQvLCAvXFwubWQkL10sXG4gICAgICBpbXBvcnRzOiBbXG4gICAgICAgICd2dWUnLFxuICAgICAgICAndnVlLXJvdXRlcicsXG4gICAgICAgICdwaW5pYScsXG4gICAgICAgIHtcbiAgICAgICAgICBheGlvczogW1snZGVmYXVsdCcsICdheGlvcyddXSxcbiAgICAgICAgICBxdWFzYXI6IFsndXNlUXVhc2FyJ10sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgICAgZGlyczogWydzcmMvc3RvcmVzJ10sXG4gICAgICBkdHM6ICcuL2F1dG8taW1wb3J0cy5kLnRzJyxcbiAgICAgIGVzbGludHJjOiB7XG4gICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgIGZpbGVwYXRoOiAnLi8uZXNsaW50cmMtYXV0by1pbXBvcnQuanNvbicsXG4gICAgICAgIGdsb2JhbHNQcm9wVmFsdWU6IHRydWUsXG4gICAgICB9LFxuICAgIH0pLFxuICAgIENvbXBvbmVudHMoe30pLFxuICAgIHZ1ZSh7XG4gICAgICB0ZW1wbGF0ZTogeyB0cmFuc2Zvcm1Bc3NldFVybHMgfSxcbiAgICB9KSxcbiAgICBxdWFzYXIoe1xuICAgICAgc2Fzc1ZhcmlhYmxlczogJ3NyYy9xdWFzYXItdmFyaWFibGVzLnNhc3MnLFxuICAgIH0pLFxuICAgIHZ1ZURldlRvb2xzKCksXG4gIF0sXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgJ0AnOiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoJy4vc3JjJywgaW1wb3J0Lm1ldGEudXJsKSksXG4gICAgfSxcbiAgfSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUF1WixTQUFTLGVBQWUsV0FBVztBQUUxYixTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFNBQVM7QUFDaEIsT0FBTyxpQkFBaUI7QUFDeEIsU0FBUyxRQUFRLDBCQUEwQjtBQUMzQyxPQUFPLGVBQWU7QUFDdEIsT0FBTyxnQkFBZ0I7QUFDdkIsT0FBTyxnQkFBZ0I7QUFSME8sSUFBTSwyQ0FBMkM7QUFVbFQsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsVUFBVTtBQUFBLE1BQ1IsWUFBWTtBQUFBLElBQ2QsQ0FBQztBQUFBLElBQ0QsV0FBVztBQUFBLE1BQ1QsU0FBUyxDQUFDLFVBQVUsY0FBYyxTQUFTLE9BQU87QUFBQSxNQUNsRCxTQUFTO0FBQUEsUUFDUDtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFVBQ0UsT0FBTyxDQUFDLENBQUMsV0FBVyxPQUFPLENBQUM7QUFBQSxVQUM1QixRQUFRLENBQUMsV0FBVztBQUFBLFFBQ3RCO0FBQUEsTUFDRjtBQUFBLE1BQ0EsTUFBTSxDQUFDLFlBQVk7QUFBQSxNQUNuQixLQUFLO0FBQUEsTUFDTCxVQUFVO0FBQUEsUUFDUixTQUFTO0FBQUEsUUFDVCxVQUFVO0FBQUEsUUFDVixrQkFBa0I7QUFBQSxNQUNwQjtBQUFBLElBQ0YsQ0FBQztBQUFBLElBQ0QsV0FBVyxDQUFDLENBQUM7QUFBQSxJQUNiLElBQUk7QUFBQSxNQUNGLFVBQVUsRUFBRSxtQkFBbUI7QUFBQSxJQUNqQyxDQUFDO0FBQUEsSUFDRCxPQUFPO0FBQUEsTUFDTCxlQUFlO0FBQUEsSUFDakIsQ0FBQztBQUFBLElBQ0QsWUFBWTtBQUFBLEVBQ2Q7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssY0FBYyxJQUFJLElBQUksU0FBUyx3Q0FBZSxDQUFDO0FBQUEsSUFDdEQ7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
